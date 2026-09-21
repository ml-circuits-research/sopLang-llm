# Phase 4 holdout analysis — `exp-003-sft-lr1e-4` (T9)

This is the failure analysis and data-iteration decision that `training/PLAN.md` T9 asks for, over the per-item records of the best experiment of the first series. Every number below is reproduced by

```bash
node evaluation/analyze-holdout.mjs --experiment exp-003-sft-lr1e-4
```

from `evaluation/registry/exp-003-sft-lr1e-4/items/holdout.jsonl`, `evaluation/registry/exp-003-sft-lr1e-4/selection/items/checkpoint-540.jsonl`, `training/data/all-books.jsonl`, and the shipped reference solutions under `training-data/`. The qualitative examples are item records, identified by their folder.

## The measurement that produced this analysis

| experiment | recipe | target tokens | validation slice (339, 323 of them on seen plans) | holdout (225, 0 on seen plans) |
| --- | --- | --- | --- | --- |
| `exp-000-baseline` | untuned base, zero shot | — | — | parse 0.0%, oracle 0.0% (50 items) |
| `exp-002-sft-lr2e-5` | full FT, lr 2e-5, 3 epochs, 606 steps, final loss 0.0236 | 11,563,168 | oracle 53.7% at checkpoint-450 | parse 100.0%, graph 99.6%, completion 12.4%, oracle 0.0% |
| `exp-003-sft-lr1e-4` | full FT, lr 1e-4, 3 epochs, 606 steps, final loss 0.00125 | 11,542,959 | oracle 94.7% at checkpoint-540 | parse 100.0%, graph 100.0%, completion 27.6%, oracle 0.0% |
| `exp-001-overfit-lr1e-4` | memorization gate, 284 rows | — | — | 284/284 on the trained rows, 0% on the 16 rows the D11 slice excluded |

The two holdout runs are the same 225 items, the same chat profile, the same greedy decoding, and the same post-processing contract.

## Slice definitions

| slice | rows | distinct plans | overlap with the training plans |
| --- | --- | --- | --- |
| training split (export minus the D11 slice) | 6436 | 877 | — |
| validation slice (D11, seed 3407) | 339 | 260 | 323 rows on plans that also occur in training, 16 rows on plans that occur nowhere else |
| holdout | 225 | 16 | 0 rows |

The export holds 6775 rows over 893 distinct plan fingerprints; the training split holds 6436 rows over 877 plans, with 453 plans represented by exactly one row and 9 plans by fifty or more. The holdout is therefore not a test on unseen wording of a known plan: its 16 plan clusters and their families (`units-and-rates`, `dependency-chain-and-join`, `a-public-counters-opening-hours`, `minimum-information-needed`, `negotiation-coalitions-and-agreement-grade-1..4`, and ten single-item families) do not occur anywhere in the export.

## Outcome classes

| slice | items | classes |
| --- | --- | --- |
| all | 225 | execution_error 163, answer_mismatch 62, answer_match 0 |

By book: `common-sense`/`units-and-rates` 50 items — all `answer_mismatch`; `decompose-to-solve`/`dependency-chain-and-join` 100 items — 99 `execution_error`, 1 mismatch; `world-as-a-system`/`negotiation-coalitions` 20 — 20 `execution_error`; `scientific-reasoning`/`minimum-information-needed` 25 — 21 execution_error, 4 mismatch; `logical-reasoning`/`two-written-rules-together` 10 — 7/3; `mathematical-thinking`/`decoding-with-a-one-to-one-dictionary` 10 — 6/4; `adult-reasoning`/`a-public-counters-opening-hours` 10 — 10 `execution_error`.

By category: `knowledge` 30 items (23 execution_error, 7 mismatch = 96.7% failure) versus `no-knowledge` 195 items (140, 55 = 100% failure). Knowledge rows do not fail disproportionately; the floor is at zero for both.

Every one of the 225 emitted programs kept the dataset shape (`literal + jsEval`), 225/225 parsed, and 224/225 passed graph validation in `exp-002` and 225/225 in `exp-003`.

## Anatomy of the 225 failures

The three mechanisms below account for all of them. They are not three defects of the runtime or the harness; they are three readings of the same behavior: the student replays the memorized family whose statement shape is closest to the unseen one and patches it with fragments of a second memorized family.

### Mechanism 1 — spliced templates do not compile (80 items, 35.6%)

The generated `answer` body fails to compile. `missing ) after argument list` accounts for 74 items, `Unexpected token ')'` for 3, and `Unexpected token ';'`, `Unexpected token ':'`, and `Identifier 'time' has already been declared` for one each. The splice is visible in the completions: `eval/no-knowledge/dependency-chain-and-join/1.1.4-dependency-chain-and-join` emits `probe(Number.isInteger(slots.durations.every((value) => value > 0), "every item must have a positive duration");` — a slot-probe line from a family that has a `durations` map pasted around a call from a family that has numbered durations, leaving the parentheses unbalanced. The reference solution for the same item reads `aMinutes`…`eMinutes` plus `bufferMinutes` and `limitMinutes`, and computes a join with `Math.max`.

### Mechanism 2 — the compiled inputs are wrong (77 items, 34.2%)

The body compiles and executes, and the dataset's own probe harness fires inside it, which means the emitted `slots` literal carries the wrong keys or the wrong values. Comparing the emitted `@slots` literal against the shipped reference solution: identical key sets in 20 items, partial overlap in 198, disjoint key sets in 5, and an unparsable JSON literal in 2. The disjoint cases name the interfering family directly:

- `eval/no-knowledge/dependency-chain-and-join/3.5.4-dependency-chain-and-join`: reference `aMinutes…eMinutes, bufferMinutes, limitMinutes`; emitted `items, budgetA, parallelB, serialC, bufferA, bufferB, limit`.
- `eval/knowledge/decoding-with-a-one-to-one-dictionary/38.19-…`: reference `codes`; emitted `dictionary, code`.
- `eval/no-knowledge/a-necessary-but-not-sufficient-property/21.17-…`: reference `required, asked`; emitted `tickets, askedColor, askedKind, observedColor, observedKind`.

Groups of related assertions repeat across items — `at least one group must reach the winning threshold` 15 times, `every work package must have a single duration` 9, `every work package must have a stated duration` 6, `the remaining groups must be able to lose against the first group` 5 — which is the probe harness reporting one systematic slot-extraction error per family, not random noise.

### Mechanism 3 — the program runs and answers the wrong question (62 items, 27.6%)

`common-sense`/`units-and-rates` is the whole of one shape: 50 items whose reference asks for a count of useful cases (oracle `20.9 useful cases.`), while the completion answers with a memorized rate sentence: `The useful output is 125400 undefined in undefined minutes.` Six of the 62 mismatches carry an unfilled template placeholder (`undefined`) in the answer text, and others append a unit-conversion step that the statement did not ask for (`… 35s. Convert the minutes to hours with 35 × 60 = 126000 hours.`). The program is syntactically valid, executes, and computes a quantity the statement does not request.

## Surface comparison

The holdout is not harder by surface. Statement lengths overlap the training distribution (median 634 characters against 491, p90 708 against 873), and target lengths are comparable at the median (1922 characters against 2211); the holdout's long tail is heavier (p90 8256 and maximum 8371 against 3509 and 6054), and the 100-item `dependency-chain-and-join` family is the family responsible for most of that tail and for 74 of the 80 compile failures. The reproduction command above prints the table (`Surface comparison`) from the shipped `problem.md` and `solution.sop` files. The heavy tail is worth noting for the next series — the widened plan set should keep solutions inside the length band the student trains on, or the sequence budget and the example design must grow with it — but it explains at most the compile-failure cluster, not the 0% oracle match across families whose statements and targets sit inside the training distribution.

## Verdicts on the DS009 diagnostic questions

**"Syntax high but semantic success low — the student has learned the language but not the task."** Confirmed, and this is the primary finding. Parse validity 100.0%, graph validity 100.0%, and 225/225 completions in the correct program shape, against runtime completion 27.6% and oracle match 0.0%. The student emits legal SOP Lang for every statement and legal, executable JavaScript for two thirds of them; it does not compile the statement.

**"Train high but holdout low — structural overfit."** Confirmed at the plan level, with a sharper reading than the aggregate rates. On the validation slice, the 323 rows whose plan also occurs in the training rows score 319/323 = 98.8% at checkpoint-540, while the 16 rows whose plan occurs nowhere else score 2/16 = 12.5%, and the 225 holdout rows score 0/225. The dataset teaches 877 plan shapes; the student reproduces a known shape for new numbers and has no procedure for a new shape. The failure is not an artifact of the high learning rate: the `exp-002-sft-lr2e-5` arm is far from convergence (validation 53.7%, final loss 0.0236 against 0.00125) and still scores 0.0% on the holdout, so more (or better-tuned) passes over the same 877 plans are not the missing ingredient.

**"Wrapper rejection dominant — template or format problem."** Rejected by the evidence. Zero wrapper rejections, zero parse failures, zero truncations at the 2048-token budget across both holdout runs, and the `exp-001-overfit-lr1e-4` gate 3 already proved the served rendering identical to the training rendering. The chat profile, the post-processing contract, the GGUF conversion, and the serving path are sound; the `exp-000-baseline` contrast (49 of 50 holdout completions parse-invalid without training) shows the pipeline's contribution directly.

**"Knowledge rows fail disproportionately — knowledge-mode weakness."** Rejected at this scale. The 30 holdout knowledge rows fail at the same rate as the 195 no-knowledge rows (96.7% against 100%), and the failures are plan failures of the same three mechanisms.

## Decisions

**D-A — The next dataset revision widens the training plan set; no further recipe arm is expected to move the holdout.** The evidence is the 98.8%/12.5%/0.0% ladder across plan-seen, plan-unseen-in-book, and family-unseen items, and the fact that both a memorizing and a non-memorizing learning rate land on the same 0.0%. Per `DS009` ("when training accuracy approaches perfection while held-out operator compositions stagnate, additional passes over the same examples are unlikely to help and the data factory generates new structural diversity"), the work belongs on the data side. The mechanical route, established by reading the pipeline: one family case equals one printed template equals one plan shape (`planFingerprint(entry)` hashes the `facts` body plus the `compute` body, and the loader rejects two cases that declare the same `template`), statements are transcribed from the DOCX books by `teacher/sources/<book>.mjs`, and the eval-only families are the same modules on the holdout side of a deterministic split. So the plan set cannot grow from the family modules alone: it needs new source text. `DS008` invites exactly that ("A mathematical family generates word problems whose underlying operations are known exactly", "Generators with independent oracles are the only scalable way to obtain exact labels", with a volume cap that keeps books from dominating) but defines no acceptance class, layout root, unit of work, rights status, or provenance record for a generated example, so the `DS008` extension comes first and the family authoring second. The alternatives are recorded: rotating the holdout (train on the withheld families and hold out other ones) leaves no plan-disjoint holdout behind, because every family is then either trained on or promoted to a second holdout; a new book source needs an owner decision and a rights status. The 225-item holdout stays frozen and keeps its role as the series benchmark, so its families stay withheld from training.

**D-B — verdict (2026-09-21): the narrow mixture does degrade the substrate, so the next series carries preservation material.** The untuned base passes 4 of the 10 capability probes (`exp-000-baseline`). The LoRA winner of `exp-004-lora` passes **0 of 10** on the same suite, scored inside its own holdout run against its own served artifact (`evaluation/registry/exp-004-lora/probes.md`). A second probe suite, authored for the reported small-model failure modes in text tasks (`text-reasoning-probes-1.0.0`, 49 probes: letter counting, reversal, word counts, ordering, situation traps), scores **5 of 49 for the base and 1 of 49 for the `exp-003` winner** (`evaluation/registry/text-probes-base/`, `evaluation/registry/text-probes-exp-003/`), measured in direct-answer mode. Two independent measurements therefore show a real capability loss after SOP Lang training, and the loss is not confined to the arm that memorized hardest. The next series trains with a preservation mixture (instruction and JavaScript material at a recorded proportion) or at a lower effective rate for the same token budget, and every arm scores both probe suites so the change is attributable rather than assumed.

**D-C — The second student size waits for the widened suite.** A scaling curve on the current suite would compare two students on a measurement that reads 0/225, so `exp-005+` (Qwen2.5-Coder-1.5B-Instruct) is justified only against the frozen holdout *after* the diversity revision — or, if the owner wants the capacity data point earlier, as an explicitly labeled arm on the current suite whose holdout result is reported as the plan-coverage limit rather than as a scaling result.

**D-D — verdict: LoRA trades in-distribution recall for unseen-plan reach.** `exp-004-lora` completed 606 of 606 steps (final loss 0.0279, 14.8 GiB peak, the same token budget as the full-fine-tuning arms) and its selection scored 52.5% overall: 54.2% on plan-seen rows (175 of 323) against the full-fine-tuning arm of `exp-003-sft-lr1e-4` at 98.8%, but **18.8% on the plan-unseen rows (3 of 16) against 12.5% (2 of 16)**. Sixteen rows cannot carry a claim, so it is recorded as a hypothesis with its evidence: a base-preserving method keeps more of what a genuinely new plan needs, while full fine-tuning buys recall of the plans it saw. Its holdout, scored on the same served artifact, is parse 99.6%, graph 99.6%, runtime completion 12.5%, oracle match 0.0% over 265 items. The widened suite — whose plan-unseen column is measured over far more rows — is the instrument that settles this.

**D-E — The deployment measurement (T10) is queued behind the LoRA arm** and then applies to the best artifact available, which is the highest-holdout winner of the first series; T11's knowledge enrichment stays deferred because knowledge rows do not fail disproportionately.

**D-F — A variant-capped training mixture was evaluated as the next datapoint and rejected before spending GPU time on it.** The export repeats a few plans heavily (9 plans carry fifty or more rows, 208 carry ten to forty-nine, while 453 plans are represented by exactly one row), so a cap of four rows per (book, plan) fingerprint was built as a candidate view: 2130 rows over all 877 training plans, maximum four rows per plan, no D11 slice row. The measurement showed why it cannot answer the question it was meant to answer: with such a cap the book mixture changes beyond recognition (common-sense contributes 19 of 2130 rows instead of 1000 of 6775, mathematical-thinking 563), so a surviving-book difference would be a mixture effect and a losing one a mixture effect in the other direction, and neither outcome isolates the variant-repetition hypothesis. More decisively, no re-mixing of the 893 existing plan fingerprints can teach a family the export does not contain, which is what the holdout measures (0/225). The view generator was deleted rather than committed, and the hypothesis stays recorded here: if a future suite has enough plans that variant repetition becomes the binding constraint, the same cap is the natural ablation.

**T10 — deployment measurement (closed 2026-09-21).** The winner of `exp-003-sft-lr1e-4` (checkpoint-540, F16) was quantized to Q8_0 (531 MB) and Q4_K_M, and each artifact was served and scored in one session on the same host (`aarch64 host, 20 cores`, 8 threads, greedy decoding, 265 holdout items, one attempt per item), so accuracy, throughput, and memory of a row come from that row's own file: parse validity 100.0% for both, graph validity 100.0%, runtime completion 40.4%, oracle match 0.0%, capability probes 1/10, 160.9 generated tokens/s (Q8_0) and 176.2 (Q4_K_M), prompt processing 4613 and 2483 tokens/s, first token 19 and 36 ms, peak resident memory 2.69 and 2.75 GiB. Quantization therefore changed cost rather than measured behavior at this resolution. The quantized runs use the 265-item slice, so they are not compared row for row with the F16 selection table, which was measured on the 339-row validation slice; `evaluation/registry/exp-003-sft-lr1e-4/deployment.md` carries the table and `evaluation/run-deployment.mjs` reproduces it (a recorded artifact is reused unless `--force` is passed).

## Open items this analysis leaves behind

- Score the capability probes (and direct-answer mode) on the `exp-004-lora` selected checkpoint and record the mixture verdict (D-B).
- Author the widened training families and re-run `node training-data/verify.mjs` over the extended suite (D-A), then train the next full run on it.
- Update `evaluation/registry/phase4-first-series.md` with the `exp-004` row when its holdout run lands.
