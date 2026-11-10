# Evaluation-only experiments for the manuscript portfolio

Written 28 September 2026. Every experiment here uses artifacts that already exist: the winner GGUF of every trained run under `evaluation/registry/<run>/gguf/`, and the untuned base models under `training/checkpoints/` (`base-f16.gguf` = Qwen2.5-Coder-0.5B-Instruct, `base-1.5b-f16.gguf` = Qwen2.5-Coder-1.5B-Instruct, `base-qwen3-17b-f16.gguf` = Qwen3-1.7B, despite the file name). No training is launched. The GPU is shared with training in another project, so the jobs run only when the GPU is idle (see "Scheduling").

The first pass evaluates a fixed stratified sample: at most 10 problems per problem family or composition (200 of the 705 held-out problems, 150 of the 520 items per E2 rung), and 30 scheduling plus all 20 coalition problems for E3. The sample is chosen by a seeded hash, so every model sees the same items; full sets can follow for any result that needs them.

Each experiment states the question it answers, the paper it serves, the design, the items and models, the scoring, what each outcome would mean, and an estimated GPU cost. The hypotheses and the reading of each outcome are written here before any result exists.

## E1. Does a plain code model already solve these problems by writing JavaScript? (ML, Informatica)

**Question.** The papers compare fine-tuned SOP Lang compilers with nothing, or with direct prose answers. A reviewer will ask what the language and the fine-tuning add beyond a code model that writes ordinary code, in the style of program-aided prompting.

**Design.** The three untuned base models are each asked, for every held-out problem, to write one JavaScript function body that computes and returns the answer as a short string. The body runs in the project's own sandbox (as a single `jsEval` wire, so execution, budgets, and isolation are identical to the fine-tuned models'). Two prompt conditions:
- E1a, zero-shot: an instruction and the statement.
- E1b, one-shot: the same plus one solved example from a trained procedural type. The example is chosen once and fixed; it is never from the held-out types.

Qwen3 runs with thinking disabled, so that missing completions are not counted as failures.

**Items.** The 705-item held-out set in its current (final data version) form: 480 procedural, including the held-out compositions, and 225 book-derived.

**Scoring.**
1. The project's exact comparator.
2. The retrospective restricted parsers for the scheduling and coalition types.
3. A value check: every number of the reference appears among the numbers the answer states, and the verdict word, when present, agrees.

Parse and execution failures are counted separately from wrong answers.

**Reading.** Each outcome would change the papers as follows:
- **Base models solve many procedural problems but few book problems.** The fine-tuned students must be compared with this baseline, not with zero, and the ML paper's "coverage" claim becomes a claim about what fine-tuning adds on top of code-writing ability.
- **Base models solve few of either.** The fine-tuned students' in-inventory results are a gain that plain code-writing does not provide at this size, and the book-type failures are shared with models that were never specialized.
- **Base models solve some book problems that no fine-tuned student solved.** This is the most important outcome for both papers: fine-tuning would have removed an ability, and Section 7 of the ML paper must be rewritten.

**Cost.** 3 models × 705 items × 2 conditions = 4,230 generations. With up to 1,024 tokens each, this is roughly 3 to 6 hours of GPU.

## E2. Generator or vocabulary: does in-inventory transfer survive a change of surface? (ML)

**Question.** The central positive result, 160 of 160 on held-out compositions, cannot distinguish two readings. On the vocabulary reading, the model composes operations it was taught. On the template reading, it fills in the training generator's template.

**Design.** A surface ladder over the held-out compositions and a matched set of trained compositions. Every rung preserves the numbers, the operations, and the reference answer exactly; only the wording changes.
- **L0, original.** The generator's statement, re-evaluated as a determinism check.
- **L1, paraphrase.** The same content and order, with different nouns, verbs, and sentence frames. For example, "Discard every entry of 25 or less" replaces "keep only the records above 25", and "the harbour store's ledger lists" replaces "The harbour depot recorded". The unit word and the requested answer form stay the same.
- **L2, book style.** Narrative framing like the book-derived problems. The values are embedded in a scenario sentence, the operations are described in the order a person would explain them rather than as an instruction list, one irrelevant number is added in a distractor sentence, and the question comes last.
- **L3, book style without an explicit procedure.** The statement asks the question ("What is 60 percent of the third-largest reading above 25?") instead of listing steps, so the model must derive the order of operations.

**Items.** For each rung:
- all 11 held-out compositions, 40 instances each, parsed from the existing held-out problems so that values are unchanged;
- 4 trained compositions using the same operations, 20 fresh instances each, drawn with the generator's own sampler and a new seed, as a control.

Each rung has 520 items. Reference answers come from the generator's own reference computation, and every rewritten statement is checked mechanically to contain exactly the slot values of its source.

**Models.**
- The three composition-inventory runs: 0.5B first inventory, 0.5B extended, and 1.5B extended.
- The 1.5B run on the declarative-command data.
- Two Qwen3-1.7B runs: compact targets, and the final data version.

**Scoring.** The exact comparator, plus a value check on the returned number.

**Reading.** The rows compare held-out and trained compositions at each rung:
- **Held-out and trained compositions fall together as the surface moves away from the generator.** The template reading gains weight. The ML paper must describe transfer as template-bound, and the book-type failures are at least partly a surface effect.
- **Trained compositions hold, but held-out ones fall only at L2 and L3.** Composition works within the vocabulary but depends on the procedure being spelled out, which is a distinct and reportable finding.
- **Both hold through L3.** The vocabulary reading is supported, and the ML paper can state it without the template caveat.

**Cost.** 6 models × 4 rungs × 520 items = 12,480 generations of short programs, roughly 6 to 10 hours of GPU. It can be cut to L0, L1 and L2 for the first pass.

## E3. The reverse direction: book problems in procedural wording (ML)

**Question.** The 1.7B runs trained with the procedural scheduling and coalition shapes solved the coalition book type reliably and the scheduling book type rarely. Is the scheduling failure about the plan or about the book's wording?

**Design.** The 100 held-out scheduling problems and the 20 coalition problems are rewritten into the sentence template of the procedural types that teach those shapes, with the same numbers and the same reference values. The runs are then evaluated on both the original and the rewritten wording.

**Models.** Every run whose training data contained the procedural shape: the six 1.7B runs from the compact-target version onward, and the 0.5B run on the final data. The 1.7B run on the third data version, which never saw the shapes, is a negative control.

**Scoring.** The restricted parsers, with the extended verdict grammar reported separately.

**Reading.** The outcome decides between two explanations:
- **Scheduling becomes solvable in procedural wording.** The failure is a surface transfer failure. Together with E2, this gives the ML paper a single account: transfer is bounded by both the operations and the wording the curriculum taught.
- **Scheduling stays unsolved.** The plan itself was not learned robustly, which is consistent with its instability across runs.

**Cost.** 7 models × 120 items × 2 wordings = 1,680 generations, about 1 to 2 hours of GPU.

## E4. How stable is a single evaluation? Decoding variation (ML, Informatica)

**Question.** Every result is one greedy decode of one trained run. Training-seed variation needs training and is out of scope. Decoding variation can be measured now, and it tells a reader whether "0 of 225" means never, or rarely under greedy decoding.

**Design.** Sample 5 completions per item at temperature 0.7 on four slices, using the same runs as E2:
- the held-out compositions;
- the scheduling problems;
- the coalition problems;
- the withheld procedural type.

Report the mean and range of accuracy across samples, and pass@5.

**Reading.**
- **If pass@5 on the out-of-inventory types is still near zero,** the "almost never" wording is supported.
- **If it is substantial,** the papers must describe a capability that greedy decoding hides.

**Cost.** About 6 models × 280 items × 5 samples = 8,400 generations, roughly 5 to 8 hours of GPU. This is the lowest priority.

## E5. Base-model direct answers, re-run cleanly (ML, ESE)

**Question.** The earlier direct-answer run of Qwen3-1.7B returned no completion for 322 of 705 requests, most likely because its thinking mode consumed the 512-token budget. This population incident is reported in the ESE paper, and it left the ML paper without a clean direct-answer baseline for the 1.7B base.

**Design.** Re-run the direct-answer prompt on Qwen3-1.7B with thinking disabled and a 1,024-token budget. Score it with the existing prose scorer and the value check. Record missing completions separately.

**Cost.** 705 generations, under an hour.

## E6. Non-GPU analyses that strengthen the papers

These need no GPU and can proceed immediately:
- **E6a (ESE), human second coder.** A person codes the 32 incidents with the fixed codebook ([incident-codebook.md](../evidence/incident-codebook.md)) from [incident-coding-input.json](../evidence/incident-coding-input.json), without seeing the agent codings. Agreement is reported beside the agent-agent agreement. A coding sheet will be prepared.
- **E6b (Informatica), output-convention analysis.** For every run and book type, count how often the returned sentence reproduces the sentence template of a trained procedural type instead of the type's own reference form. This quantifies "output conventions are learned from the nearest type" beyond the one example given now.
- **E6c (ML), per-program reporting.** Report the held-out book results per program fingerprint (16 programs), not only per item, with the program-level counts in a supplementary table.

## Order and decision points

1. **E1 and E5 first.** They are the cheapest, and they answer the question every reviewer asks first. If E1 shows base models solving book problems that fine-tuned students fail, stop and revise the ML paper's framing before running E2 and E3.
2. **E2 at rungs L0, L1 and L2**, then L3 if L2 leaves the question open.
3. **E3.**
4. **E4, if idle GPU time remains.**

Every experiment writes its items, per-item records, and a run manifest under `evaluation/registry/<experiment>/`, like the existing evaluations. Per-item records are written incrementally, so an interrupted run resumes where it stopped.

## Scheduling on a shared GPU

The GPU is currently used by training in another project, which has priority. A watcher checks once a minute. It considers the GPU idle when no foreign compute process is present and utilization stays below 10% for ten consecutive minutes. It then starts the next queued job detached, through `training/environment/start-detached.sh`. While a job runs, the watcher keeps checking. If a foreign compute process appears, it stops the job and its model server, and the job resumes from its last record once the GPU is idle again. Launches also require at least 30 GiB of free disk, as the repository's launch discipline requires. Queue, state, and log live under `evaluation/registry/idle-queue/`.

## Scoring of the reduced comparison (revision of 28 September, evening)

The computation is done by executing the generated program (SOP Lang or JavaScript), so the only fragile step is comparing the returned text with the reference. Every record is scored at three levels, and all three are reported:

1. **Exact.** The project's comparator (`teacher/naming.mjs`).
2. **Strict value.** A single-number reference must be the last number the answer states. A multi-number reference must equal the answer's numbers as a multiset, with nothing missing and nothing extra. A feasibility or yes/no verdict must agree. Echoing an input number does not pass.
3. **Semantic, by two independent judges.** Every record that executed (or, for direct answers, returned text) and failed levels 1 and 2 is judged by two separate agent sessions. Each judge sees only the statement, the reference answer, and the candidate answer. Items are shuffled, and the model and condition are hidden. The question is whether the candidate states the same result (values, verdict, selection), whatever the wording. Both judges see the same items. Every verdict is saved with a one-sentence reason, and an answer counts as semantically correct only when both judges accept it. Agreement (Cohen's κ) is reported. So is a calibration of the judges on a hidden sample of answers already accepted at level 2, and on a sample known to be wrong.

The comparison uses the same 115 held-out problems for every model and condition:
- untuned bases answering directly, writing plain JavaScript with one example, and writing SOP Lang taught in the prompt (a syntax guide and three solved examples of trained types);
- the fine-tuned students.

The fine-tuned students are expected to differ strongly from the prompted bases on in-inventory problems. A small difference would be treated as suspicious and investigated before anything is reported.

## Added after the first results (29 September)

**E9. The withheld procedural type in full.** On the 5-item sample, the untuned 1.7B model writing JavaScript answered 4 of 5 problems of the withheld stock-and-lead-time type correctly, while every fine-tuned model answered 0 of 5. All 40 problems of the type are evaluated for the untuned 1.5B and 1.7B models (JavaScript, one example) and for two fine-tuned 1.7B runs. If the contrast holds, specialization blocked an ability that plain code-writing gave the base model. This is the strongest evidence available for the cost of a narrow curriculum.

**E8. Abstraction level by prompt.** The position to be tested is that small models do better when the language asks them to recognize simple patterns rather than write code. The untuned base models are compared on the surface-ladder compositions at L0 and L2 (5 per composition; held-out and control), in three conditions with the same examples of trained compositions:
- *operator plans*, where the model names operations from a fixed catalogue and supplies extracted values and parameters, and the harness executes the plan and formats the answer (`evaluation/operator-plans.mjs`, verified to reproduce all 520 L0 references from the correct plans);
- *plain JavaScript*;
- *SOP Lang with `jsEval`*, taught in the prompt.

**Reading.**
- If operator plans outperform code for the untuned small models, especially under the book-style wording of L2, the papers can argue from measurement that raising the abstraction of the language, so that the model selects and parameterizes patterns while code is produced from them, suits small models better than generating `jsEval` bodies.
- If they do not, the argument must be weakened: the bottleneck is then reading the problem rather than writing the code.

The catalogue covers only the procedural operations, so this test says nothing about the book types, whose solution shapes would need their own general operations.
