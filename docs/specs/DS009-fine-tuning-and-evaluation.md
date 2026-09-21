---
title: DS009-fine-tuning-and-evaluation
summary: Defines the supervised fine-tuning laboratory, the tiny overfit test, manifest-driven training runs, capability-preservation mixtures, checkpoint selection, export, baselines and ablations, metrics, non-inferiority testing, the evidence registry, and falsification criteria.
---

## Introduction

The fine-tuning laboratory turns verified teaching data into a student checkpoint that compiles problems into SOP Lang, and the evaluation suite determines whether the resulting system supports or rejects the research thesis. Both are treated as reproducible engineering: every run is driven by a machine-readable manifest, every result traces to raw per-item records, and every claim is tied to an experiment identifier.

The data that feeds training is specified in `DS008-training-data.md`, the model tiers being trained are described in `DS007-model-strategy.md`, and the metrics reported here are the ones the evidence registry publishes.

## Core Content

### The first training target

The first fine-tuning run does not try to prove the full research thesis. It answers a more basic question: [can the selected student learn](wiki.html#definition-student-model) to emit valid SOP Lang, respect the separation between control and data, delegate deterministic work, and execute correctly on held-out problems? A pilot dataset of perhaps tens of thousands of verified examples is enough to expose tokenizer issues, malformed chat templates, loss-mask mistakes, catastrophic forgetting, or a student that is simply too small.

The experiment begins by benchmarking the untuned base or instruct model and recording direct-answer performance, zero-shot SOP Lang generation if possible, JavaScript competence, tool-manifest following, and CPU inference speed after the intended quantization. Fine-tuning then starts on a narrow curriculum containing syntax, simple decomposition, `jsEval` delegation, container operations, and one or two tool families, and evaluation uses held-out seeds and a small set of unseen compositions.

### Tiny overfit test

A first supervised fine-tuning run is treated like a software integration test with gradients. The objective is not to discover the best possible model in one attempt but to prove that the dataset, tokenizer, chat template, loss mask, optimizer, checkpointing, and inference wrapper are aligned.

The safest path begins with a tiny dataset of a few hundred examples selected from several task roles and runs training until the model can nearly memorize the set. If training loss does not fall strongly, the pipeline is broken. If training loss falls but inference still emits direct answers rather than SOP Lang, the chat template and generation prompt are inspected before changing hyperparameters. A unit test tokenizes one example and prints token IDs with the loss mask so a human can verify exactly which tokens contribute to the objective.

### Dataset materialization

The training and evaluation data are organized as text artifacts under `training-data/`, and their layout is specified in `DS008-training-data.md`. The materialization step reads the text artifacts and their manifests, keeps the evaluation holdout out of the training sets, and derives the trainer view (the message records a fine-tuning run consumes) from the artifacts instead of treating the derived form as the maintained source. A split is a directory fact, not a runtime flag: an example lives either under a training category or under `eval/`, and no export recomputes that decision.

The dataset is materialized into immutable JSONL or Parquet files with a manifest containing hashes. The shipped materialization is the trainer view under `training/data/`: one JSONL file per book plus one combined file, every row carrying the exact role-separated messages of the recorded profile plus a metadata object, and an export manifest that records the exporter version, the chat profile identifier and system-prompt hash, per-file SHA-256 hashes, row counts per book and category, and a content-addressed dataset snapshot identifier derived from the sorted row fingerprints. The exporter reads only the training categories and never recomputes the split, and two runs over the same tree are byte-identical because no output carries a timestamp. The same step writes the pre-tokenization distribution report and the validation slice: a fixed sample of the training rows, excluded from training and used only for checkpoint selection, whose rows prefer plan fingerprints that occur nowhere else in the export. An additional metadata object may identify the family, generator seed, teacher trace, verification tier, decomposition depth, wire types used, and source document, and that metadata is not injected into the model unless it is also available at deployment. The separation prevents accidental leakage through convenient training annotations.

The message layout of the first training series is the recorded chat profile `compiled-plan-chat-1`: a fixed system prompt that states the compiled-plan compilation task (a `slots` literal with the extracted values, an optional `facts` literal with external knowledge, and a deterministic `answer` `jsEval` wire, no input wire and no model call, program output only), a user message carrying the statement body of `problem.md` after its identity heading, and an assistant target carrying the exact bytes of `solution.sop`. `explanation.md` never enters prompts, training, or evaluation. The profile identifier and the hash of the system prompt text travel in every export manifest and run manifest, and the profile changes only through a version increment. The implementation decisions of the first series — the pinned student revision, the trainer toolchain, the export layout, the training recipes, and the evaluation protocol — are recorded in `training/PLAN.md`, and every run manifest keeps recording them per run.

Before tokenization, the pipeline computes distribution reports: input tokens, target tokens, total sequence length, number of wires, number of `$` dependencies, number of JavaScript lines, number of container operations, and examples by role. Extremely long outliers are inspected rather than silently truncated, because truncating the end of an SOP Lang target can teach the model to emit syntactically incomplete programs. When examples exceed the selected sequence length, they are redesigned into local decisions or handled by an explicit segmentation strategy whose production behavior is identical.

Tokenization uses the tokenizer distributed with the selected base model revision, and the training script applies the model's official chat template unless the project deliberately defines a new one and evaluates the consequences. The target loss is computed on assistant tokens, and padding tokens, system content, and user content are masked from the language-model loss in the ordinary supervised setup.

### Training configuration

A practical first full-fine-tuning configuration for a sub-billion model uses BF16 where supported, AdamW or the optimizer recommended for the selected trainer, gradient clipping, a modest learning rate, and enough gradient accumulation for a stable effective batch size. The exact learning rate comes from a small logarithmic sweep rather than being copied from a larger model, and LoRA runs may tolerate different rates because far fewer parameters are updated. The experiment manifest records every value.

The repository records model revision, tokenizer revision, dataset hash, sequence length, packing policy, batch size, gradient accumulation, optimizer, learning rate, schedule, warmup, precision, gradient clipping, epochs or token budget, random seeds, checkpoint cadence, and evaluation cadence. A small initial grid over learning rate and number of passes is preferable to copying settings from a different model family.

Device memory is a declared part of the recipe on hosts whose accelerator shares a pool with the processor. A run declares a ceiling and a floor: the training process caps its own allocator at a fraction of device memory, releases the cached blocks of that allocator whenever the pool approaches the floor, and stops at a step boundary, after writing a checkpoint, only when releasing them does not clear the floor, so the host stays responsive and the run is resumed rather than killed by the operating system. The run manifest records the declared budget and the realized peak, the training log carries the memory samples of every logged step, and a run stopped this way reports a distinct status instead of a completion. Gradient checkpointing and a smaller batch are the levers when the declared ceiling does not fit a batch, because a unified pool that is exhausted by device allocations is invisible to the accounting of the host and can only be diagnosed from records written before the failure.

The most important training budget is token exposure. Reporting "three epochs" is ambiguous when dataset size changes, so the report states total target tokens and total examples together with the distribution across task families. For a half-billion-parameter student, tens to hundreds of millions of high-quality post-training tokens are feasible on local accelerator hardware, and the correct amount is found empirically because more synthetic data can hurt when it is repetitive or noisy.

### Capability preservation

A narrow SOP Lang dataset can overfit the student. The model may become excellent at emitting `@wire jsEval` while getting worse at understanding natural language, writing JavaScript, or following ordinary instructions. The training mixture therefore includes a controlled amount of capability-preservation data, preferably from sources compatible with the base model license. The proportion is an experimental variable, and the goal is to retain the linguistic and coding substrate that SOP Lang compilation depends on rather than to preserve chat personality.

Evaluation checkpoints include general JavaScript microtasks, basic instruction-following tests, and SOP Lang tasks. If code ability collapses while SOP Lang syntax improves, the recipe is changed: full fine-tuning may need a lower learning rate or more mixed data, and LoRA may preserve base behavior better in some settings. The decision is made from measurements.

### Checkpoint selection

Checkpoint evaluation occurs on a fixed validation set after a defined token interval, and a checkpoint is never selected by training loss alone. The validation harness executes generated SOP Lang and reports parse validity, graph validity, final oracle success, [symbolic delegation, and relevant behavioral metrics](wiki.html#definition-symbolic-delegation). A checkpoint with slightly worse token loss may produce substantially better executable programs.

A validation slice drawn from the training books is mostly a recall measurement: most of its rows carry a plan fingerprint that also occurs in the rows the trainer trains on, so their success shows that the student reproduces a known plan for new values. The selection table therefore reports oracle match separately for rows whose plan fingerprint occurs in the training split and rows whose plan fingerprint occurs nowhere in it, and the holdout analysis reports the same split. The selection rule itself stays the overall oracle match, on the tiebreaker of parse validity, so tables remain comparable across experiments.

Overfitting is understood behaviorally. When training accuracy approaches perfection while held-out operator compositions stagnate, additional passes over the same examples are unlikely to help and the data factory generates new structural diversity. When both train and validation performance stay low and syntax errors dominate, the model may be too small, the target grammar too variable, or the recipe broken. When syntax is high but semantic success is low, the student has learned the language but not the planning policy.

The first serious training series varies one major dimension at a time. It compares full fine-tuning with a LoRA baseline, a narrow SOP Lang-only mixture with a mixture that includes language and code preservation data, datasets with and without explicit decomposition examples, and training with fixed command names against training with randomized command names and runtime manifests. Each comparison reuses the same evaluation suite and seeds where possible.

### Generation post-processing and outcome classes

A raw completion becomes a candidate program through one recorded contract: after trimming whitespace it is either bare SOP Lang whose first line begins with `@` at column one, or exactly one fenced block whose entire body is the program; empty completions, more than one fenced block, a body without a wire declaration, and any prose outside a single fence are rejected before parsing. The rule is implemented once, in the evaluation client, and fence-stripped-but-parseable completions are counted separately from prose completions so a chat-template defect is never misread as a language defect.

Every evaluated item lands in exactly one class: `generation_transport_error` for a transport failure or an empty completion, `wrapper_rejected` for the post-processing contract, `parse_invalid` for the parser, `graph_invalid` for an unknown output or dependency or a cycle, `execution_error` for a circuit that fails at run time, `answer_mismatch` for an executed answer that differs from the oracle, and `answer_match`. Evaluation generation is greedy with one attempt and no repair pass, and the runtime budget keeps one bad circuit from aborting the batch.

### Export and deployment measurement

After a checkpoint is selected it is exported to the intended CPU runtime, and the complete benchmark is rerun on that exact artifact. The laboratory measures generated tokens per second, prompt processing, time to first token, peak resident memory, and whole-task latency. Because the student may be called recursively, it also measures the distribution of call counts per task.

The runtime contributes cost as well. JavaScript execution, container commits, retrieval, source loading, and custom tools are timed. For long documents, the report includes compilation time, peak memory, compiled-state size, and query-time cost after compilation. For repeated queries, it shows the amortized cost curve.

A single experiment manifest is sufficient to reproduce data selection, training, export, and evaluation, and model checkpoints, raw traces, and derived metrics are linked by content hashes. A reviewer does not have to trust a manually assembled spreadsheet.

### Baselines and ablations

The main experimental comparison is factorial rather than anecdotal. At minimum it evaluates the student in direct-answer mode, the same student with SOP Lang, a larger teacher in direct-answer mode, and the larger teacher with SOP Lang where feasible. Long-document experiments add a straightforward chunk-and-merge baseline and a retrieval-based baseline, and structured tasks include direct JavaScript or SQL generation when that is a credible alternative.

Ablations identify which parts of the system matter. Removing explicit decomposition asks the student to generate the whole circuit in one pass. Disabling `jsEval` forces neural computation for otherwise deterministic operations. Removing compiled containers provides retrieved raw chunks instead. Replacing task-conditioned schemas with a fixed universal schema tests schema planning. Disabling metaprogramming prevents graph expansion after values are known. Removing anti-smoothing audits tests preservation policy. Hiding custom wire descriptions and testing memorized command names tests manifest reading.

The most important comparison for the small-model thesis reports total neural tokens, number of calls, runtime cost, and latency together with accuracy, because a recursive small model invoked many times may use more compute than a single large call.

### Generalization tests

Generalization tests go beyond held-out wording. Procedural families hold out operator compositions, dependency depths, branching patterns, tool manifests, and schema shapes. A student trained on circuits up to depth eight is tested at depths sixteen, thirty-two, and sixty-four. A student trained on a set of named tools is tested on semantically similar but renamed tools whose definitions are supplied only through manifests. A student trained on sources up to a hundred thousand tokens is tested on much longer sources while local context stays fixed.

Long-document evaluation explicitly varies the location of critical evidence and the number of irrelevant chunks, because position sensitivity and dilution are different effects. A compiled-context system may be robust to position and still suffer when ingestion produces too many noisy records, so container precision and source-recall metrics are reported alongside final accuracy.

### Metrics

Final task success is the primary metric when an oracle exists. For a problem set of N items, success is the fraction whose executed final result matches the oracle within the declared tolerance. Circuit parse validity, graph validity, runtime completion, and output-schema validity are reported separately, which prevents a system from looking strong because it produces syntactically beautiful but semantically wrong programs.

For teacher-student comparison, a predeclared non-inferiority margin is appropriate. With teacher success `p_T` and student-plus-runtime success `p_S`, an acceptable task-specific margin is defined before final results are viewed. Paired evaluation is used because both systems solve the same items, and the paired difference is bootstrapped or evaluated with an appropriate paired proportion method. When the lower confidence bound for `p_S - p_T` is above the negative margin, the student is non-inferior under that benchmark definition, which does not mean the models are generally equally capable.

Efficiency metrics include total generated neural tokens, total prompt tokens, number of neural calls, accelerator time during compilation, CPU time during execution, wall-clock latency, peak memory, energy where measurable, and compiled-state storage. A useful aggregate is cost per verified correct result, and raw components are reported so the weighting is transparent.

Controlled summarization reports weighted content preservation, rare-critical recall, exception recall, qualifier preservation, contradiction preservation, hallucination rate, compression ratio, and human readability. A simple weighted preservation measure over required items is the sum of `weight_i * preserved_i` divided by the sum of `weight_i`, and it is reported by category rather than collapsed into one score, because a system that preserves dates but destroys minority positions has not solved the intended problem. Preservation checks require identity and relation correctness rather than keyword overlap, since a summary may mention an exception but attach it to the wrong rule.

Summary acceptance separates the stages instead of scoring one number. Inventory recall, selection recall, and realization recall are reported as separate quantities, so a report distinguishes loss inside the compiled inventory from loss in the importance policy and from loss in the wording. A repair evaluation re-audits the full obligation set after every repair and rejects an acceptance in which the repair adds one obligation while dropping another, strengthens a qualifier, or moves an obligation to the wrong rule; repair cost and repair side effects are reported together.

Novelty evaluation reports candidate recall, prior-art retrieval recall, relationship-classification accuracy, calibration, and evidence completeness, with retrieval recall and semantic classification separated because a perfect judge cannot identify prior art that retrieval never surfaces. Every novelty record preserves the evidence that produced its conclusion: the search queries, the indexes searched, the corpus snapshot identifier, the publication cutoff, the number of candidates examined, the comparison method, and the stated limitations of the search. A conclusion is constrained to the searched corpus, so an output reads as "no close match was found in the searched corpus under these queries" instead of asserting historical novelty. Failure to retrieve a match is recorded as negative evidence and never as proof of novelty, and a record that lacks the evidence list is rejected rather than reported as a novelty result. Long-context evaluation reports ingestion recall, representation precision, final answer accuracy, and performance as a function of source position and document length.

Repair behavior is measured as well: how often an invalid circuit becomes correct after one repair call, how many epochs are needed, whether repairs introduce new failures, and whether a small model recovers from its own off-policy states.

Statistical analysis preserves problem-family structure. When a benchmark contains thousands of easy arithmetic items and only fifty difficult long-document cases, one micro-averaged score hides the research result. The report uses macro averages by family and difficulty stratum, and confidence intervals are computed over problem instances or document clusters rather than over individual extracted records that correlate strongly within one book.

### Evidence registry and manifests

Every training run is driven by a machine-readable manifest that identifies the base model and exact revision, tokenizer, dataset snapshot, split manifest, system prompt profile, wire-registry snapshot, sequence length, packing, optimizer, learning-rate schedule, batch parameters, precision, fine-tuning method, device-memory budget, random seeds, training-token budget, checkpoint schedule, and hardware and software environment. The run writes immutable logs and checkpoint hashes.

Every evaluation manifest identifies the checkpoint artifact actually used, including quantization, runtime version, wire-registry version, benchmark split, capability catalog, context budgets, neural-call budgets, CPU or GPU settings, and random seeds. Per-item records are stored before aggregate statistics, and article-generation scripts read only those records. An evaluation manifest names the dataset manifest and the source hashes it was locked to, so a report can always be traced back to the artifacts that produced it, and the evaluation holdout recorded in a dataset manifest is the only split an evaluation run may read.

No reported result combines accuracy from one checkpoint format with speed from another. No held-out benchmark selects training checkpoints beyond the predeclared validation process. Data-generation seeds for final test sets stay inaccessible to the teacher pipeline until evaluation time.

The paper and its tables are generated from an evidence registry that holds hypotheses, benchmark definitions, experiment manifests, metrics, confidence intervals, plots, failure examples, and limitations. Every quantitative claim references an experiment ID and every qualitative example references a source item and a trace. Negative results remain in the registry and influence the discussion. A result that cannot be traced to a raw record does not appear.

### Falsification criteria

Predeclared criteria protect the project from narrative drift. The small-model efficiency hypothesis is not supported if the student requires greater total neural compute than the larger baseline for equal accuracy. The compiled-context hypothesis is not supported if ingestion losses make final accuracy worse than a simpler retrieval baseline at similar cost. The unseen-tool hypothesis is not supported if the student fails when command names are randomized despite clear manifests. The anti-smoothing hypothesis is not supported if rare-critical preservation does not improve after controlling for output length and model-call budget.

A negative result remains publishable when it identifies a sharper limitation than expected, for example that sub-billion models learn SOP Lang syntax and deterministic delegation but cannot reliably perform task-conditioned decomposition over ambiguous long documents. The purpose of the system is to make those boundaries measurable.

### Rationale and boundaries

The laboratory and the evaluation suite are separated on purpose. The laboratory optimizes a checkpoint under a declared curriculum, and the evaluation suite decides whether the resulting system meets a predeclared standard. Keeping the two activities apart, with manifests and per-item records in between, is what allows a reviewer to check whether a reported difference comes from the architecture, the training budget, or the measurement procedure.

The project does not claim bit-for-bit reproducibility of neural generation and does not claim that a passing non-inferiority test generalizes beyond the benchmark definition that produced it.
