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

**D-A — The next dataset revision widens the training plan set; no further recipe arm is expected to move the holdout.** The evidence is the 98.8%/12.5%/0.0% ladder across plan-seen, plan-unseen-in-book, and family-unseen items, and the fact that both a memorizing and a non-memorizing learning rate land on the same 0.0%. Per `DS009` ("when training accuracy approaches perfection while held-out operator compositions stagnate, additional passes over the same examples are unlikely to help and the data factory generates new structural diversity"), the work belongs to the family modules under `teacher/families/<book>/`: new families in the style of the eight decompose-to-solve training families and the other books' generators, several plan shapes per new family, all passing the existing acceptance checks and `node training-data/verify.mjs`. The 225-item holdout stays frozen and keeps its role as the series benchmark, so its families stay withheld from training. Consequence for `DS008`: the suite's single circuit shape (`slots` literal plus deterministic `answer`) is now a measured limitation, and the `DS008` extension for multi-wire plans, container operations, and registry-reading examples is the second half of the same revision — no holdout failure is caused by the absence of those types (no completion attempted a container or a second wire), so they extend the teaching surface rather than repair a defect.

**D-B — The capability-preservation mixture stays "none" for the next arm, and the probes become part of the next checkpoint's evaluation.** `DS009` allows no preservation data in the first run if the decision is recorded and the evaluation carries the probes that would detect the loss. The detector exists (`evaluation/probes/capability-probes.json`, 10 items: 6 JavaScript microtasks, 4 instruction-following) and the untuned base scores 4/10 (`exp-000-baseline`). The probes were not yet scored on a fine-tuned checkpoint, so the mixture cannot be decided from measurement; the next arm scores them on its own selected checkpoint and this record gets the verdict.

**D-C — The second student size waits for the widened suite.** A scaling curve on the current suite would compare two students on a measurement that reads 0/225, so `exp-005+` (Qwen2.5-Coder-1.5B-Instruct) is justified only against the frozen holdout *after* the diversity revision — or, if the owner wants the capacity data point earlier, as an explicitly labeled arm on the current suite whose holdout result is reported as the plan-coverage limit rather than as a scaling result.

**D-D — One more recipe arm runs: `exp-004-lora` (T8 arm 3).** It is the last member of the first series that `DS009` requires (full fine-tuning versus LoRA at the same token budget), it tests the plausible mechanism that full fine-tuning at lr 1e-4 damaged the base model's statement-reading substrate, and it is cheap (about an hour on the GB10). It is launched with the same recipe as `exp-003` except `--method lora` (r 16, alpha 32, dropout 0.05, every attention and MLP projection per D8) and lr 1e-4, with checkpoint selection and one holdout run in the same series.

**D-E — The deployment measurement (T10) is queued behind the LoRA arm** and then applies to the best artifact available, which is the highest-holdout winner of the first series; T11's knowledge enrichment stays deferred because knowledge rows do not fail disproportionately.

## Open items this analysis leaves behind

- Score the capability probes (and direct-answer mode) on the `exp-004-lora` selected checkpoint and record the mixture verdict (D-B).
- Author the widened training families and re-run `node training-data/verify.mjs` over the extended suite (D-A), then train the next full run on it.
- Update `evaluation/registry/phase4-first-series.md` with the `exp-004` row when its holdout run lands.
