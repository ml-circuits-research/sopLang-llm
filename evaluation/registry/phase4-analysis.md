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

## Widened-suite result (`exp-005-sft-widened`, 2026-09-21)

The first run on the widened export (7135 rows: the seven books plus ten synthetic families with nine training plan shapes) answers the question the analysis left open, and the answer differs by what is measured.

**Taught shapes transfer; withheld families do not.** On the holdout, which now holds 265 items (the 225 book eval rows plus the 40 instances of the one withheld synthetic family), the selected checkpoint scores parse 100.0%, graph 100.0%, runtime completion 18.1%, oracle match **0.4% (1 of 265)** — the first non-zero holdout of the series, and still a failure. The withheld synthetic family itself scores 0 of 40, so the model does not extend a learned style to a family it never saw. The validation slice behaves as before: 94.4% overall, 98.5% on plan-seen rows (318 of 323), 12.5% on the sixteen plan-unseen book rows.

**The text and planning families it was taught are learned.** The text-reasoning probe suite, scored on the same selected checkpoint (`evaluation/registry/text-probes-exp-005-compiled/`), gives **30 of 49** through the compiled path — the model compiles the probe, the runtime executes the plan, and the executed value is compared under the declared tolerance of `statesValue` (a numeric expectation must equal the first number the answer states): character counting **16 of 16**, word counting **9 of 9**, word reversal 4 of 8, one situation trap, no ordering item. Direct-answer mode on the same checkpoint scores **0 of 49** (`text-probes-exp-005-direct`), and the untuned base scored 5 of 49, so the capability is reachable only through compiling — which is the project's thesis in one measurement.

**What this settles and what it leaves open.** Widening the plan set works for shapes the suite teaches: letter counting, word counting, and reversal are solved on instances the model never saw, by plans that delegate the counting to `jsEval`. It does not work for a shape the suite withholds, so plan coverage is necessary but not sufficient: something else has to generalize a *style* to a *new plan*, and that is now the sharpest open question of the milestone. The candidates, in the order the evidence supports them: more plan shapes per source (nine taught shapes is a small curriculum), supervision that shows intermediate structure rather than one body (the multi-wire shape of `DS008-training-data.md`, which the suite does not use yet), and a larger student, since a 0.5B model may simply lack the reach — the plan-unseen column and the holdout are the instruments that can separate them.

The capability probes stay low on this arm as well (1 of 10 on the same artifact), consistent with D-B: the narrow mixture costs substrate, and preservation material remains on the list for the next series.

## Structure run (`exp-007-sft-wires`, closed 2026-09-21 19:17Z)

The run that teaches intermediate structure instead of one answer body: the suite is the widened export plus the multi-wire decomposition families (7335 rows; the seven books plus fifteen synthetic families, fourteen of them in training, one withheld family of forty instances, plans of up to four wire declarations with the probe harness on every `jsEval` stage). The recipe is the one the series has used since `exp-003` (3 epochs, lr 1e-4, per-device batch 4 with accumulation 8, gradient checkpointing, checkpoint every 90 steps, seed 3407); it completed 657 of 657 steps, final loss 0.00115, 17.494 GiB peak.

**Selection (339-row validation slice).** Winner checkpoint-540 at 94.4% overall: **98.1% on plan-seen rows (317 of 323)** and **18.8% on plan-unseen rows (3 of 16)**, against `exp-005-sft-widened` at 98.5% (318 of 323) and 12.5% (2 of 16). Parse validity and graph validity are 100.0% at every checkpoint from step 180 on, so the arm never lost the syntax.

**Holdout (265 items, all from families absent from the export).** parse 100.0%, graph 100.0%, runtime completion **12.8%**, oracle match **0.4% (1 of 265)**. `exp-005` scored the same 0.4% (1 of 265) with a *different* problem (plant-growth-rate-as-change-per-day here, compare-two-groups-by-percentage-not-absolute-count there), so the two arms share a count, not a success. The failure mix moved toward run-time failure: 231 execution errors and 33 answer mismatches against `exp-005`'s 217 and 47, i.e. the student now builds programs that keep the taught multi-stage shape and then fail inside it rather than answering a different question with a one-body plan.

**Capability probes.** 0 of 10 on the same artifact (`evaluation/registry/exp-007-sft-wires/probes.md`), below `exp-005`'s 1 of 10 and the untuned base's 4 of 10. The answer classes are all `answer_mismatch` with prose answers, so the substrate loss D-B measured on `exp-004` is reproduced on a full-fine-tuning arm: the narrow mixture trades general instruction and JavaScript behavior for SOP Lang syntax.

**Traceability defect found while reading the report.** `evaluation/registry/exp-007-sft-wires/report.md` records `dataset snapshot 5ffd341e…`, which is the export manifest *at report time*; the checkpoint was trained on the export of snapshot `390211ea…` (7335 rows), and the tree was regenerated to 7575 rows while the holdout was running. The 265 scored items are the ones the run resolved at its start (the per-item records name them, and the withheld synthetic family did not change: only the generator-version line of its `explanation.md` moved), so the measurement is sound, but an evaluation report must not name a dataset snapshot that no evaluated item came from. D-H records the fix.

## Shape run (`exp-008-sft-shapes`, closed 2026-09-22 00:41Z)

The run that teaches twenty plan shapes with two published stages each, under the chat profile `compiled-plan-chat-2` whose system prompt names the intermediate wires its targets carry. 7236 training rows, 3 epochs, 681 of 681 steps, final loss 0.001893, peak 17.823 GiB, one memory-guard refusal at step 0 from another user's 35B server on the shared pool and no other interruption.

**Selection (339-row validation slice, eight checkpoints).** Winner checkpoint-540 at 95.0% overall: **98.8% on plan-seen rows (319 of 323)** and **18.8% on plan-unseen rows (3 of 16)**; checkpoint-360 and checkpoint-450 reach **25.0% (4 of 16)** on plan-unseen rows at 94.7% overall. Parse validity and graph validity are 100.0% at every checkpoint from step 180. Against `exp-007-sft-wires` (94.4% / 98.1% / 18.8%) the arm gains 0.6 points overall and 0.7 on plan-seen rows, and its best plan-unseen rate is 4 of 16 against 3 of 16 — a single row, which the holdout has to confirm or refute.

**Holdout (265 items, all families absent from the export).** parse 100.0%, graph 99.6%, runtime completion **30.9%** (82 of 265, the highest of the series against 12.8% for `exp-007` and 18.1% for `exp-005`), oracle match **1 of 265**. The one match is a different problem from the ones `exp-005` and `exp-007` answered, so the three widened arms agree on the count and disagree on the item: the compiled style now executes on nearly a third of unseen-family problems, and still almost never lands on the answer. The execution errors fall to 182 from `exp-007`'s 231 while answer mismatches rise to 81 from 33: the failure moved one rung further up the ladder, from programs that break to programs that run and answer the wrong question.

**Capability probes: 2 of 10**, the best of any fine-tuned arm (base 4 of 10, `exp-003` 1, `exp-004` 0, `exp-005` 1, `exp-007` 0), with both instruction items answered correctly by prose (`OK:3`, `sop sop sop`) and all six JavaScript microtasks still prose. The substrate loss persists; the direction of the last two arms is up.

**D-J — Deeper taught structure improves execution on unseen families and does not buy correctness.** The measured ladder across the widened arms is `exp-005` (completion 18.1%) -> `exp-007` (12.8%) -> `exp-008` (30.9%) on the same 265 items, with the oracle count pinned at 1 of 265 for all three. Two stages of published structure per plan therefore buys *executable* structure: the student now composes plans whose shape holds at run time on a family it never saw, and still answers a different question than the one asked, which is what the answer-mismatch count (81, the highest of the series) records. The verdict for the next arm: plan coverage and stage depth are no longer the binding constraint on execution, so the next levers are the ones that address correctness — demonstrations of solved unseen-shape problems in the prompt (the adaptation runner, extended beyond the duplicated-plan demonstrations measured on 2026-09-21), a mixture with preservation data (`exp-009-mix10`, running), and, only after those, a larger student.

## Mixture run (`exp-009-mix10`, closed 2026-09-22 07:18Z)

The run that keeps the `exp-008` export and recipe and adds the derived capability-preservation view: 7236 export rows plus 721 of the 758 preservation rows (37 excluded because their source row sits in the D11 validation slice), 747 of 747 steps, final loss 0.000969, peak 17.823 GiB, chat profile `compiled-plan-chat-2`. The mixture was verified against the run manifest before reading any result: the file hash is pinned, `--extra-data` is in the recorded recipe, and 7957 rows at effective batch 32 gives exactly the 747 planned steps.

**Selection (339-row validation slice, 14 checkpoints).** Winner checkpoint-728 at 95.3% overall — the best of the series — with **98.8% on plan-seen rows (319 of 323)** and **25.0% on plan-unseen rows (4 of 16)**, the highest plan-unseen figure any selected checkpoint has reached. Parse validity and graph validity are 100.0% at every scored checkpoint.

**Holdout (265 items, all families absent from the export).** parse 100.0%, graph 100.0%, runtime completion **19.2%**, oracle match **0 of 265**. The failure mix is 214 execution errors and 51 answer mismatches, against `exp-008`'s 182 and 81 — so the mixture moved failures back toward programs that break rather than programs that answer the wrong question.

**Capability probes: 1 of 10**, against `exp-008`'s 2 of 10 and the untuned base's 4 of 10. Both instruction items that `exp-008` answered (`OK:3`, `sop sop sop`) are answered again; the JavaScript microtasks remain prose.

**D-K — the derived preservation mixture did not restore the substrate, and the run is also confounded.** Three facts have to be read together rather than as one verdict:

1. *The probe score did not improve.* `exp-008` passes 2 of 10 and `exp-009` passes 1 of 10 on the same suite from the same served artifact pipeline. The mixture as derived — every tenth statement repeated with a long standalone JavaScript program that prints the same answer — therefore did not recover the instruction and code behaviour the probes measure.
2. *The comparison carries a budget confound.* `exp-009` trains 747 steps against `exp-008`'s 681 (the mixture added 721 rows, and the recipe is fixed at three epochs), so the two arms differ in exposure as well as in mixture. The probe difference of one item cannot be attributed to the mixture against a 10% larger schedule.
3. *The probe suite measures the wrong targets for this mixture.* Six of the ten probes ask for a short expression or a one-word answer; three of the six JavaScript probes state the correct value and are still classed as mismatches because the strict protocol forbids the extra text (`[1,2,3,4].filter(...).length = 2` states 2 and is scored wrong, as do the nullish and sum probes). The preservation targets teach long standalone programs, not the short forms the suite rewards, so a null result here is evidence about *this* mixture shape, not about preservation training in general.

The next arm on this lever therefore changes the mixture shape rather than the ratio: independently generated short-answer code and instruction tasks that match what the probes measure, a matched training budget against `exp-008` (same step count, or `exp-008` extended to 747), and the probe suite reported as three separate numbers — strict protocol compliance, semantic value correctness, and executable-code correctness — so a format failure is never read as a capability loss (this is review finding R6, and it is now a prerequisite of the next probe claim).

## Four-condition diagnostic (`diag-009`, closed 2026-09-22 08:07Z)

The instrument astra_review I1 asks for: one suite with a known latent graph, generated before any wording is chosen, split by structure (`filter-total-add-rate` and `filter-count-per-unit` held out, the other four on the development side), and one checkpoint — `exp-009-mix10`'s winner `checkpoint-728` — scored on the same 60 problems in four conditions. 240 generations; `evaluation/registry/diag-009/`.

| condition | oracle-assisted | matched | rate | parse valid | executed |
| --- | --- | --- | --- | --- | --- |
| normal (statement alone) | no | 8 of 60 | 13.3% | 100.0% | 78.3% |
| values supplied | yes | 9 of 60 | 15.0% | 100.0% | 91.7% |
| plan supplied | yes | 8 of 60 | 13.3% | 100.0% | 60.0% |
| values and plan supplied | yes | 10 of 60 | 16.7% | 100.0% | 61.7% |

**D-L — the bottleneck is not reading the statement, not choosing operators, and not writing JavaScript: it is adapting a memorized plan to the asked-for operation.** Four facts together settle it:

1. **Supplying the correct values buys almost nothing** (13.3% -> 15.0%, one problem, and that one is in the held-out `filter-count-per-unit` structure where four problems were rescued). Statement reading and role assignment are therefore not the bottleneck on plans the model has seen, which is the opposite of what the low holdout numbers suggested.
2. **Supplying the correct operator graph buys nothing** (8 of 60, identical to normal) while *lowering* execution from 78.3% to 60.0%: the graph is read, and it makes the model emit programs that fail their own guards more often. Operator selection is also not the bottleneck.
3. **Even with both supplied, ten problems of sixty are answered** (16.7%), so code emission and the output protocol are not the bottleneck either.
4. **The programs carry the memorized plan and the memorized phrasing, not the asked-for computation.** On `filter-total-001` (oracle 141, chain filter -> total -> add-rate) the executed answer is `The total is 141, and it applies to 32, 39 and , 37 and , 33 and .` — the correct total of the kept values, then the *copied return statement of a different training family* (`Filtered Total`'s list rendering) with a dangling `and` where the fixed charge should have been added. Every one of the 60 normal-condition programs declares the same two `jsEval` wires plus `slots` (60 of 60), and the intermediate wire is always named `kept`. The answer is assembled by pattern completion of a familiar family rather than by applying the operation the statement asks for.

The stage classification agrees: 20 problems stop after the filter, 18 lose the final stage, 13 fail at run time, 1 is a value error, and only 8 match. The held-out structures are uniformly hard (`filter-largest-double` 0 of 10, `filter-total-add-rate` 0 of 10, `filter-largest-add-rate` 0 of 10) while `filter-count` reaches 7 of 10, which is the structure whose output shape the suite's `count-letter` and word-count training families already teach.

**What the next arm must therefore change.** Not more plan shapes, and not more statements to read: supervision that forces the *operation* to come from the statement rather than from the nearest memorized family. The two candidates the diagnosis supports, in order: (a) contrastive pairs inside one structure — the same statement with one decisive word changed, and its two different programs, so the model cannot answer by family recall (astra_review I3, which the paired-structure data above now justifies with counts rather than intuition); (b) training rows whose *wording* varies while the structure is held fixed, so the phrasing of the taught return statements stops acting as the plan selector. The efficiency question of I4 (how many tokens the assertion scaffolding consumes) is measurable from these records as a secondary axis, and the two-call wrapper of I6 is the fallback if neither moves the paired accuracy.

## Contrastive-pair arm (`exp-010-contrastive`, closed 2026-09-22 17:11Z)

The arm D-L called for: `teacher/procedural/contrastive.mjs` added six families in three pairs, each pair
rendering the same wording, numbers and entities and differing only where the decisive phrase changes the
required operation, plus five self-referential families (count the letter a word names, its length, its first
and last letter, its distinct count, which of two words is longer). The recipe is exp-009's exactly (3 epochs,
lr 1e-4, batch 4, grad-accum 8, gradient checkpointing, save-steps 90, preservation-10), so the arm changed the
data and nothing else: 8221 examples, 771 steps, from the enlarged export.

**Selection (339 validation rows, winner `checkpoint-450`):**

| checkpoint | oracle match | plan seen | plan unseen |
| --- | --- | --- | --- |
| 90 | 35.7% | 37.2% | 6.3% (1/16) |
| 180 | 70.8% | 73.4% | 18.8% (3/16) |
| 270 | 89.4% | 92.9% | 18.8% (3/16) |
| 360 | 93.2% | 96.9% | 18.8% (3/16) |
| **450** | **94.4%** | **98.1%** | **18.8% (3/16)** |
| 540 | 94.4% | 98.1% | 18.8% (3/16) |
| 630–771 | 94.4% | 98.5% | 12.5% (2/16) |

**Holdout (265 items) and probes, against exp-009-mix10:**

| metric | exp-009-mix10 | exp-010-contrastive |
| --- | --- | --- |
| holdout oracle match | 0.0% (0/265) | 0.4% (1/265) |
| runtime completion | 19.2% | 20.8% |
| capability probes | 1/10 | 2/10 |
| plan-unseen, best checkpoint | 25.0% (4/16) | 18.8% (3/16) |

**Verdict: the arm did not move the deployed number, and the honest reading is that it is a null result with one
weak positive.** The holdout went from 0 of 265 to 1 of 265 executed answers — a single item, which is not
evidence of anything. The capability probes went from 1 of 10 to 2 of 10, also one item. On the selection slice
the best plan-unseen score is *lower* than exp-009's best (18.8% against 25.0%), although the contrastive arm
reaches a comparable oracle match (94.4% against 95.3%) at an earlier step (450 against 728), so it is not
slower to learn the trained plans; it simply does not generalize better to unseen ones.

What this rules out. D-L said the model completes the nearest memorized family instead of applying the asked-for
operation, and the arm was built so that shortcut is observably wrong on one member of every pair. If that
diagnosis were the whole story, the pairs should have taught the model to read the decisive phrase. They did
not: the model still answers 0.4% of unseen holdout problems. So either the dose was too small — six pair
families among twenty-seven, 240 of 7935 exported rows, one training pass — or the failure is not "does not
attend to the decisive phrase" but "cannot produce a plan it has not been shown", which contrastive *phrasing*
cannot fix because the unseen plans themselves are what is missing.

The second reading is the one the plan-unseen column supports. Every checkpoint of every arm sits between 12.5%
and 25.0% on the sixteen unseen-plan rows, regardless of the mixture, the recipe, the target length or the
phrasing: the number does not respond to any lever tried so far. The next arm should attack plan coverage
directly (astra_review I5: structural splits over a declared inventory of compositions, and the retrieval
baseline over statements), not the phrasing of the plans that are already covered.

### Pair accuracy on the winner (`diag-pairs-010`, 2026-09-22 19:18Z)

The measurement the arm was built for, run on `checkpoint-450` with 24 pairs (8 per kind):

| pair kind | both correct | one correct | neither | paired accuracy |
| --- | --- | --- | --- | --- |
| boundary-inclusion (`above` against `at least`) | 7 | 1 | 0 | 87.5% |
| direction (the largest record against the smallest) | 0 | 1 | 7 | 0.0% |
| rate-vs-absolute (a fixed amount against a percentage) | 1 | 5 | 2 | 12.5% |
| **all** | **8** | **7** | **9** | **33.3%** |

**This is more informative than the holdout number and it changes the reading of the arm.** The deployed
holdout gave 0.4% and said nothing about why; the pairs separate the three shapes and show the failure is not
uniform:

- **The boundary pair works.** Seven of eight pairs answer `above` and `at least` differently and both
  correctly, which is the skill the pair was built to teach and the one a memorized family cannot supply: the
  two statements differ by two words and only the comparison changes. This is a genuine, if narrow, positive
  result.
- **The direction pair fails completely.** Zero of eight: the model answers both members alike, which is
  exactly the pattern-completion failure D-L described, and the pair did not cure it.
- **The rate pair is half-learned.** One pair fully correct and five with only one member right, so the model
  distinguishes a fixed amount from a percentage in some cases but not reliably.

So the arm taught the sharpest, most local distinction (a word that flips a comparison) and did not teach the
two that require the model to select a different operand or a different operation on the same operand. That is
consistent with the null holdout result: the pairs that worked are the ones whose difference is *lexical and
adjacent*, and the ones that failed need the plan to change shape.

The next arm should therefore treat these three kinds separately rather than as one lever: keep the boundary
pairs, add many more direction pairs (the cheapest diagnostics of operand selection), and check whether the
rate pair's five one-correct cases fail on the same member every time — if they do, the failure is a memorized
default for one of the two operations, which is a data-balance problem rather than a phrasing problem.

## Decisions taken on the night of 2026-09-21

**D-G — Containers and registry reads are not in the structure arm; six more multi-wire plan shapes are.** `DS008-training-data.md` specifies container plans and registry-reading plans, and the reconnaissance of this repository found four coupled gates that none of tonight's time could move together: the family validator accepts only `jsEval` and `literal` as an intermediate wire (`teacher/procedural/index.mjs`), the program builder has no container wire path (`teacher/families/index.mjs`, `buildProgram`), the provenance battery judges reactivity from `slots`/`facts` references in the answer wire (`training-data/provenance.mjs`), and no manifest column records the structural read set a definition-reading plan must publish (`DS008`, "Additional circuit shapes"). Each of those is a runtime-contract change that needs its own acceptance evidence, and a half-implemented shape would ship circuits the verifier cannot judge. The lever both shapes serve — plan coverage — is served tonight by six more generator families with two named intermediate stages each (`Teacher/families` equivalent: `teacher/procedural/grouping.mjs`, `aggregation.mjs`, `textshapes.mjs`), which deepens the dependency chain the suite teaches to three stages without touching the runtime contract. The container and registry items stay open with their four gates named above.

**D-H — The chat profile is versioned to `compiled-plan-chat-2`, and the evaluation manifest must record the slice it scored.** The suite has carried multi-wire targets since `exp-007`, while `compiled-plan-chat-1` promises exactly a `slots` wire, an optional `facts` wire, and an `answer` wire; `DS008` requires the profile to name the shapes its targets carry, so the profile now names the intermediate wires and the probe assertions (`training/export.mjs`, recorded in `DS009`). `exp-007` is therefore the last arm whose prompt promised a shape narrower than its targets, and that is stated in its own row rather than silently rewritten. Separately, an evaluation run must record the identity of the slice it scored: until `evaluation/run-eval.mjs` writes the hash of its resolved item list next to the trainer-export snapshot, a report can name a dataset that no scored item came from, exactly as `exp-007`'s does.

## Widened plan set for `exp-008-sft-shapes` (in flight from 2026-09-21 19:21Z)

The procedural source now declares 21 families: the 15 it had, plus `grouped-label-totals`, `top-k-among-list`, `average-of-qualifying`, `conversion-chain-leftover`, `vowel-richest-word`, and `length-ranked-words`. Each new family publishes two named intermediate values (a filtered or ranked collection, then a summary record or an extreme pair), so the deepest chain the suite teaches is `slots → stage 1 → stage 2 → answer`, where the previous maximum was one stage. The suite holds 840 accepted circuits (20 training families of 40 instances plus the withheld family), `node training-data/verify.mjs` reports `verify: OK` over the whole tree with all 840 procedural answers reproduced and all 840 proven reactive to perturbed slots, `npm test` passes 281 of 281, the trainer view exports 7575 rows under profile `compiled-plan-chat-2`, and the tokenizer gate reports no row above the 4096-token limit (worst total 2015 tokens). `exp-008-sft-shapes` trains on exactly that export with the series recipe; the plan-unseen column of its selection table and its holdout are the measurement that decides whether deeper taught structure moves an unseen family.

## Open items this analysis leaves behind

- Publish the slice identity in the evaluation manifest (D-H): the hash of the resolved item list beside the trainer-export snapshot.
- Implement the container and definition-read shapes with their four gates (D-G), then author one family per shape and extend `training-data/verify.mjs` to judge them.
- A capability-preservation arm: the probes read 4 of 10 for the base and 0 of 10 for the structure run, so the next series carries preservation material whose size and mixture are recorded before the run.
- Update `evaluation/registry/phase4-first-series.md` with the `exp-004`, `exp-005`, and `exp-007` rows (their holdout runs have landed).
