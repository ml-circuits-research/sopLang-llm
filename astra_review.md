# Astra review of sopLang-llm

Review date: 2026-09-22, approximately 07:00–07:05 UTC. Inspected commit: `c1884d6e4e025cc0960fe703a92e97fa24540703`, plus the working tree and live experiment records. The concurrent thread was updating `exp-009-mix10` selection records during this review. Line references below refer to this snapshot.

Scope: architecture and specification alignment, current research direction, training and evaluation plumbing, selected runtime implementation, dataset separation, preservation targets, and experiment evidence. This is a review, not a repair. The only repository file created by this review is `astra_review.md`. No training, model serving, evaluation chain, dataset regeneration, or process termination was performed. Short tests and in-memory reproductions used the CPU; the test log is outside the repository at `/tmp/soplang-astra-tests.log`.

## Assessment

The architecture remains a reasonable research direction: a small model compiles a problem, an explicit runtime performs deterministic computation, and acceptance depends on executed results. The runtime and data pipeline have substantial working infrastructure. The experimental results support learning the output protocol and reproducing familiar computations. They do not yet support reliable compilation of unfamiliar problem families, the compiled-context thesis, or an efficiency advantage over an appropriate baseline.

The immediate priority should be trustworthy measurement and a more diagnostic curriculum experiment. Continuing to add a few manually chosen plan shapes and repeating the same full training recipe has not yet improved holdout correctness. Broader procedural data and preservation mixtures are reasonable hypotheses, but the existing evidence does not establish that plan coverage is the sole cause or that another increase in depth will solve the problem.

Four matters deserve attention before interpreting the next experiment: reference-solution leakage in shape-matched demonstrations, insufficient server identity checks, remaining orchestration races, and mutable experiment inputs. There is also a confirmed broken chat CLI. These findings are independent of whether `exp-009-mix10` eventually improves its score.

## Verified state

| Measurement | Result and evidence |
| --- | --- |
| Existing automated tests | `npm test`: 289 passed, 0 failed, approximately 6.76 seconds, Node.js v22.23.2. |
| Current export and split | 7,575 exported SOP rows; 339 validation rows; 7,236 SOP training rows after exclusion; 265 holdout rows. Recomputed from `training/data/all-books.jsonl`, `validation-slice.json`, and `resolveSlice`. |
| Separation checked | 897 training plan fingerprints and 17 holdout fingerprints; 0 shared fingerprints and 0 exact statement matches between the selected training rows and holdout. This verifies the current mechanical split, not semantic independence of every family. |
| Preservation target execution | Executed all 758 committed targets in `training/data/preservation-10.jsonl` in isolated JavaScript contexts and compared their printed answers with dataset manifest oracles: 758 matched, 0 mismatches or execution errors. The trainer manifest for `exp-009-mix10` records 721 preservation rows after validation exclusion. |
| `exp-003-sft-lr1e-4` holdout | 0 correct of 225; 62 answer mismatches and 163 execution errors in its raw holdout records. |
| `exp-005-sft-widened` holdout | 1 correct of 265; 48 of 265 completed execution. |
| `exp-007-sft-wires` holdout | 1 correct of 265; 34 of 265 completed execution. |
| `exp-008-sft-shapes` holdout | 1 correct of 265; 82 of 265 completed execution; 182 execution errors, 81 answer mismatches, and 1 invalid graph. Capability probes: 2 correct of 10 under the strict direct-answer protocol. |
| `exp-008-sft-shapes` validation winner | `checkpoint-540`: 322 correct of 339, comprising 319 of 323 on seen plans and 3 of 16 on unseen plans. `checkpoint-360` and `checkpoint-450` each answered 4 of 16 unseen-plan items correctly, but lost on the declared overall selection metric. |
| Work in flight | `exp-008` training completed 681 steps and has selection, holdout, and probe evidence. `exp-009` training completed 747 steps; checkpoint selection was running. No final `exp-009` verdict is made here. |

Sources for the experiment counts are `evaluation/registry/<experiment>/items/holdout.jsonl`, `selection.json`, `probes.md`, and `training/checkpoints/<experiment>/run-manifest.json`. Existing documentation is sometimes older than these records.

## Findings requiring correction

### R1 — P1: shape-matched demonstrations consult the hidden reference solution

**Location:** `evaluation/run-adaptation.mjs:102`, `:138`, and the `targetWires` construction in both the dry-run path and the scoring path.

`targetSolutionOf(item)` reads the evaluated item's `training-data/<book>/<folder>/solution.sop`. Its wire count controls which training demonstrations are placed in the model prompt when `--demo-mode shapes` is selected. Choosing demonstrations using hidden solution structure is evaluation leakage even though the reference answer is never copied into the prompt. A real deployment receives the statement and cannot look up the correct circuit first. This conflicts with the solver-visible separation in DS008 and the projection boundary in DS006.

The current holdout has 235 reference circuits with two wires and 30 with three wires. Thus this selector currently has access to whether the reference uses the extra facts wire; it is not measuring retrieval of deeper four- or five-wire decompositions on this holdout.

**Correction:** choose demonstrations from the statement and deployment-visible capability information only. If a model predicts a plan shape, record that prediction and its cost. An explicitly named oracle-assisted diagnostic may retain the current selector, but its results must be separated from deployable adaptation results. Existing `distinct` runs are not invalidated by this specific shape-selection defect.

**Acceptance:** replacing or removing the target `solution.sop` must leave the normal adaptation prompt unchanged; log exact demonstration item identities and prompt hashes. No normal retrieval path should read the target solution.

### R2 — P1: the readiness fix still does not identify the served checkpoint

**Location:** `evaluation/server.mjs:23`, `:46`, `:101`; `evaluation/run-holdout.sh` readiness loop; `evaluation/chat.mjs:104`.

All managed servers use the same alias, `student`. `waitForServer` accepts any `/v1/models` response containing that alias while the newly spawned child has not yet reported an exit. If an old server owns the port while the new child is still loading or has not yet reported its bind failure, the old server satisfies the check. The shell holdout runner has the same issue. Checking process liveness reduces the window but does not bind the HTTP response to the intended artifact. The chat CLI is weaker still: an existing healthy server is reused while the UI names the separately selected artifact.

**Reproduction:** a local mock HTTP server returning `{"data":[{"id":"student"}]}` was accepted by `waitForServer(..., { expectedModel: 'student', child: { exitCode: null } })` without any artifact identity. No model server was launched for this reproduction. The source itself records a previous wrong-server incident for `exp-009`; this review does not assert that its current rerun is also wrong.

**Correction:** use a unique alias per launch or artifact, pass that alias through generation requests, and bind the launch to a recorded artifact hash. Fail if the owned child exits during scoring. Apply the same identity contract to selection, holdout, probes, adaptation, deployment, and chat.

**Acceptance:** a pre-existing server with alias `student`, or the alias of a different launch, must never satisfy readiness for a new launch. A port-conflict test should fail before any scored request is sent. Save artifact identity with the raw evaluation records.

### R3 — P1: the completed-selection shortcut can launch duplicate holdout workers

**Location:** `evaluation/start-chain.sh:52`, `evaluation/run-holdout.sh`, `training/environment/watchdog.sh:69`, and `evaluation/run-series.sh`.

`start-chain.sh` checks for `selection.md` and `selection.json` before checking whether evaluation is already running. In that branch it launches `run-holdout.sh`, explicitly closes the lock descriptor, and exits. `run-holdout.sh` does not acquire the experiment lock. A second call made before `report.md` appears follows the same branch and launches another holdout worker into the same output directory. The start lock only serializes the two launch decisions; it does not make either decision reject an already running holdout.

Cross-experiment serialization also remains incomplete: the watchdog checks processes belonging to the current experiment, and `start-chain.sh` checks a trainer with that experiment name. Neither enforces the comment promising to wait while another experiment owns the GPU. Two incomplete experiments can therefore contend for the fixed serving ports and overwrite their own run artifacts after repeated retries.

**Correction:** have every evaluation path, including the completed-selection shortcut, hold the experiment lock for its lifetime. Use a shared project scheduling lock for operations that must not overlap on the GPU. Check experiment completion from a complete manifest, not only the presence of a Markdown report. Preserve failed attempts under distinct attempt identifiers.

**Acceptance:** concurrent starts of one selected experiment produce one holdout worker; separate queued experiments cannot serve or train concurrently under the serialized policy. Exercise these paths with fake processes, without GPU work.

### R4 — P1: training resumes and evaluations read mutable global inputs

**Location:** `evaluation/client.mjs:26–45`, `evaluation/select-checkpoint.mjs:133–140`, `evaluation/slices.mjs` export resolution, and `training/python/sft_train.py:958`, `:1037`, `:1134`.

The evaluation client always imports the current `SYSTEM_PROMPT` from `training/export.mjs`. Models trained under `compiled-plan-chat-1` now receive `compiled-plan-chat-2` when evaluated with the current client. The old training prompt hash is `67655b81e61a7025442d5d9db6f47566350b4f3d045d48083089ff05608caae2`; the current hash is `dfe015ee9f325f0f859383073b93ddda440d00d64ab0b0e9e7de7c1c1cef3a03`. The selection harness also determines which plans were trained from the current export, rather than the specific experiment's training snapshot. Its `selection.json` does not pin the prompt or the input snapshot sufficiently to recover that distinction.

The trainer has the corresponding resume risk: it reloads the current dataset and extra-data paths, selects a checkpoint, constructs a new manifest, and overwrites the old manifest before calling `trainer.train(resume_from_checkpoint=...)`. It does not compare the original data, profile, split, or recipe hashes before resuming. Regenerating the export between episodes can silently turn one named experiment into two different curricula.

**Correction:** preserve experiment-specific input files and the full prompt text under content-addressed snapshots. On resume, compare immutable fields before any overwrite. Resolve evaluation prompts, training-plan membership, and validation inputs from the experiment snapshot. Allow prompt-change ablations only through an explicit recorded override and a separate evaluation identity.

**Acceptance:** an old checkpoint retains its original prompt after a new export; changed inputs cause a resume refusal or a new experiment, not silent continuation. Evaluation manifests pin artifact, runtime/registry version, prompt, slice, and raw-record hashes. Historical results are not proven false by this finding; their automatic reproduction is currently unsafe.

### R5 — P2: the chat CLI fails before processing any option

**Location:** `evaluation/chat.mjs:95–97`.

`main()` calls `parseArguments`, but the file neither defines nor imports it. `HELP` is also missing. Reproduced with `node evaluation/chat.mjs --help`: exit code 1 and `ReferenceError: parseArguments is not defined`. This prevents both interactive chat and `--once` use.

**Correction and acceptance:** restore the argument parser and help text, add a CLI help smoke check that requires no model, and exercise the single-question path with a controlled generation stub. Also fix the existing-server identity issue described in R2 before trusting the displayed model name.

### R6 — P2: probe failures are being overinterpreted as loss of JavaScript understanding

**Location:** `evaluation/probes.mjs` direct scoring and report conclusion; `evaluation/registry/phase4-analysis.md` D-B; `training/preservation.mjs`.

The strict direct-answer score is valid for instruction compliance, but it mixes wrong values with correct values expressed in a forbidden format. In the `exp-008` raw capability records, three of the six JavaScript probes state the correct result and are still classified as mismatches: the filter expression ends with `= 2`, the nullish expression with `= 7`, and the sum expression with `= 10`. Reporting 0 of 6 as strict passes is correct. Inferring from that number alone that the JavaScript substrate has disappeared is not justified.

The current preservation data asks the model to generate long standalone JavaScript for the same problem corpus. It does not directly train the short expression answers or exact instruction formats that the ten-probe suite measures. `exp-009` is a useful test of code-output mixture training, but a poor result would not establish that preservation training in general failed. It also trains 747 steps versus `exp-008`'s 681, so a causal attribution solely to the mixture requires a budget control.

**Correction:** retain the strict score and add a separately reported semantic-value audit and executable code probes. Distinguish format failures from semantic failures. If preservation is the next lever, include independently generated code and instruction tasks aligned with the desired capabilities, excluding the evaluated probes and their derivatives. Report example share and target-token share; 721 extra rows out of 7,957 total selected rows is approximately 9.1%, while the declared 0.1 ratio means extra rows relative to the source export.

**Acceptance:** report strict compliance, semantic correctness, and executable code correctness separately, with counts, under a predeclared comparison rule. Do not relax a scorer after seeing a candidate's answers to manufacture an improvement.

### R7 — P2: selection is dominated by familiar plans and excludes the new procedural families

**Location:** `training/export.mjs:258–310`, `evaluation/select-checkpoint.mjs:198`, and DS009's checkpoint-selection rule.

The 339-row validation set contains 323 rows on plans also used in training and only 16 on unseen plans. Procedural source rows are explicitly excluded. The current implementation follows DS009 by selecting the highest overall oracle score, but that objective mostly rewards familiar-plan reproduction and does not directly measure the new families added in successive arms. In `exp-008`, the selected checkpoint gets 3 of 16 unseen-plan items, while two other checkpoints get 4 of 16. A difference of one item is too small to establish superior generalization, but it demonstrates that the selection objective and the stated research headline can disagree.

The holdout is also repeatedly inspected to choose the next curriculum, and the new demonstration selector reads its reference programs. Even without training-row overlap, this is a development benchmark now; treating it as untouched final evidence would overstate independence.

**Correction:** keep the historical validation instrument for comparability, and add a versioned development suite with held-out procedural seeds, operator compositions, wording changes, and family clusters. Predeclare its role in future checkpoint selection. Reserve a separate final suite before the next curriculum iteration and keep its solutions out of development tools. Do not move the old holdout into training to improve the score.

**Acceptance:** new training shapes have development coverage; report family-level counts and uncertainty; select without consulting final-test outcomes. Update DS009 before changing the official selection rule.

### R8 — P2: the preservation transformer does not preserve general SOP semantics

**Location:** `training/preservation.mjs:66–68` and `:76–95`.

`substituteWireReferences` applies a regular expression across the whole JavaScript body. It rewrites text inside strings, regular expressions, comments, and property names, despite DS002 distinguishing those positions from wire reads. For example, a circuit with a `slots` literal and `@answer jsEval` body `return "$slots";` returns `$slots` under the runtime; the transformed target instead returns `w_slots`. The transformer also emits bindings in textual declaration order, although SOP execution follows dependency order, and treats every command other than `jsEval` as a literal without rejecting unsupported commands.

**Impact boundary:** all 758 currently committed preservation targets matched their manifest oracles in this review. This is a confirmed transformation defect for admitted language constructs, not evidence that the running mixture contains 758 bad targets.

**Correction:** rewrite only lexically identified value references, emit bindings in topological order, and explicitly reject unsupported commands. Alternatively, narrow and enforce the accepted source subset before transformation. Check every generated preservation row against its source result at export time.

**Acceptance:** quoted `$slots`, regular-expression text, property names, forward references, and unsupported commands are covered by semantic equivalence or explicit rejection checks.

### R9 — P2: compiled probe scoring can accept a wrong result

**Location:** `evaluation/probes.mjs:140–143`, `:169–178`.

`statesValue` accepts the first number anywhere in the answer. Reproduced: `statesValue('2', '2 + 2 = 4')` returns `true`, although the stated result is 4. Non-numeric expectations can pass merely by appearing among other tokens. The compiled scorer also ignores the probe's `comparison: 'exact'` policy. This is too permissive for a correctness metric, and differs from the strict direct-answer scorer.

**Impact boundary:** inspected the 30 accepted answers in `text-probes-exp-005-compiled`; they are largely straightforward outputs such as `3 times.`, `11 words.`, or a reversed word. This review does not demonstrate that those 30 specific passes are false. The comparator nevertheless admits counterexamples and prevents an unqualified direct-versus-compiled comparison.

**Correction and acceptance:** use exact or typed values, or tightly specified task-specific renderings such as a single count followed by an allowed unit. Honor exact probes. Reject echoed operands, contradictory answers, and lists containing both correct and incorrect candidates. Recompute changed metrics into a versioned evaluation result while preserving the original records.

## Additional operational and reporting corrections

- `training/environment/resume-series.sh:57` starts the training supervisor with `nohup` but without `setsid`. A direct resume therefore does not meet AGENTS.md's explicit separate-session requirement, even though a resume invoked from an already detached watchdog may survive. Route resume through the same detached launcher and verify the supervisor's session identity.
- `training/python/sft_train.py:1112` reconstructs resumed target-token counts using the dataset-wide target/input ratio. Those resumed target counts are estimates. Input counters seeded from the latest log can also diverge from the restored checkpoint when the last log and checkpoint steps differ. Save both counters in checkpoint state and label historical estimates before using them for precise compute comparisons.
- `training/STATE.md` still calls `exp-008` training and contains a claim of 1 of 225 for `exp-002`/`exp-003`; `exp-003` raw records contain 0 of 225. `phase4-first-series.md` still lists `exp-008` in flight, although its holdout exists. Refresh the handoff and tables from raw records. The old task to split `run-eval.mjs` is also stale: the code already has `slices.mjs`, `cli.mjs`, and `aggregate.mjs`.
- The current selection and evaluation writers overwrite existing output paths, and `runSlice` persists its primary item file only after all items complete unless a separate log is requested. Interrupted selection can lose partial progress. Use attempt-specific manifests and append or atomically checkpoint item records so recovery preserves evidence.

## Recommended next work for the parallel thread

1. Fix R1–R4 before using new adaptation or checkpoint-selection results as research evidence. Preserve the current `exp-009` attempt and inspect its serving identity; this review provides no reason to discard its trained weights or automatically restart training.
2. Fix the chat entry point and add the small regression checks identified above. Preserve the existing runtime semantics; none of these fixes requires changing SOP Lang to accommodate model output.
3. Finish and report `exp-009` using verified artifact identity. State the strict probe result separately from semantic and code-execution observations. Compare against `exp-008` on the same pinned input suite and prompt, with the extra training budget disclosed.
4. Build one compact, diagnostic procedural development suite on the existing 0.5B student. Teach basic operators and reserve new compositions; vary names, units, wording, irrelevant facts, and dependency depth independently. Include familiar-plan/new-values and unfamiliar-composition conditions, with sufficient independent families to avoid interpreting one extra correct row as a trend.
5. Separate extraction failure from program construction failure. A diagnostic can supply correct slots, or a known plan, but label such conditions as oracle-assisted. Compare them with normal statement-only compilation. This identifies whether the next training data should target reading values, selecting operators, composing stages, or writing JavaScript.
6. Compare SOP emission with standalone JavaScript emission on that same controlled suite and student, measuring answer correctness and generated tokens. The runtime architecture is valuable, but the current series does not isolate what SOP adds beyond code execution. A compact-target versus assertion-heavy-target ablation is also worth considering: the failure analysis contains malformed probe expressions, so repeated assertion prose may consume useful capacity. This is a hypothesis to test under a new supervised profile, not permission to weaken dataset verification or alter the existing runtime.
7. Keep compiled-context, container teaching, definition-reading, and repair trajectories as explicit later milestones. The runtime infrastructure for some of them exists, but the current training/evaluation path does not establish those capabilities. Avoid broadening all of these surfaces at once while unfamiliar-family correctness remains 1 of 265.

The owner directive recorded in `training/STATE.md` keeps this milestone on `Qwen2.5-Coder-0.5B-Instruct`. Nothing in this review requires downloading or training a larger student.

## Improvement proposals and experiment designs

Added at the owner's request after the initial review. These are proposals grounded in this repository's failure patterns, not measured improvements. Suggested sample sizes and decision thresholds below are starting policies to declare before running an experiment. They are not statistical guarantees. Keep the student at 0.5B, preserve the original evidence, and run the experiments sequentially after the measurement fixes.

### I1 — First identify which part of compilation is failing

The most useful next experiment may require no training. Use a new procedural development suite whose latent values and operator graphs are known, and evaluate the same checkpoint under four conditions:

| Condition | What the model receives | What a substantial improvement would suggest |
| --- | --- | --- |
| Normal compilation | Statement and the declared SOP profile | Deployable reference score. |
| Correct values supplied | Statement plus a typed record of the correct input values and their semantic roles, without the answer or operator graph | Reading the statement or assigning roles to values is a major bottleneck. |
| Correct plan supplied | Statement plus the correct abstract operator graph, without extracted instance values or executable solution | Operator selection or composition is a major bottleneck. |
| Correct values and plan supplied | Both diagnostic inputs above; the model still emits executable SOP | Remaining errors concern code emission, the output protocol, or the supplied representation. |

The last three conditions are explicitly oracle-assisted diagnostics. Their scores must not be reported as ordinary task performance. A small first pass could use 240 generated problems across six operator-composition groups, with 40 problems per group. Report paired successes and failures on the same items, broken down by group. Expand the suite before treating a small difference as a stable effect.

For each failure, record the earliest divergence from the latent computation: wrong input value or unit, wrong operator, wrong dependency edge, invalid JavaScript, wrong intermediate value, or wrong final rendering. Compare values by semantic role, allowing equivalent variable names and valid alternative programs. Final answer correctness remains the main metric.

**Decision:** prioritize extraction supervision if correct values rescue many failures; prioritize compositional supervision if the supplied graph does; prioritize simpler code targets if both are needed and code still fails. If no condition helps, inspect the diagnostic prompt and representation before concluding that the model lacks capacity.

### I2 — Generate combinations of operators, with structural splits defined before rendering

The current procedural extension adds hand-authored families. An alternative is a small generator of typed computation graphs. Begin with operators whose semantics already have simple independent oracles, such as filter, sum, count, group, stable sort, minimum/maximum, unit conversion, and percentage application. Reject combinations that are ambiguous, degenerate, or type-invalid.

Generate a latent graph and values, compute its oracle, render a natural-language problem, and compile a verified SOP target. Keep the graph hidden from normal model prompts. Use more than one statement renderer, and audit that every renderer fully states the required task. An executable target does not prove that its accompanying English statement is unambiguous.

Divide evaluation into separate questions:

- Same composition with new values: can the model instantiate a learned computation?
- Same composition with different wording: can it identify the same task through a different description?
- New composition of taught operators: can it combine skills rather than retrieve a complete template?
- Greater dependency depth: can it carry a familiar operation through a longer chain?

Assign structural groups before choosing instance seeds or rendering text. Canonicalize operators, edges, types, and relevant constants for split identity; exclude cosmetic names and assertion prose. A different source-code hash alone is not evidence of a different reasoning plan. Keep paraphrases and closely related variants in their assigned split, and retain a sealed final set.

**First scope:** use a small declared inventory of compositions and depths two through four. Train the constituent operations before testing unfamiliar compositions. Widen one dimension at a time. The expected benefit is a clearer test of generalization; improved accuracy is an open question.

### I3 — Add paired problems that require the model to notice the decisive word or value

Repeated templates can permit shortcuts. Create pairs from training-side latent tasks where one small change changes the required operation or answer. For example, “increase by 20%” and “increase to 20%” should not produce the same calculation; “at least three” and “more than three” differ on the boundary. Also create pairs where the answer must stay unchanged, such as reordering independent facts or inserting an irrelevant number.

Compute each pair's expectations independently. Keep an entire pair and its paraphrases in the same split. In training, use ordinary verified statement-to-program rows; a new contrastive-loss implementation is unnecessary for the first test.

**Measure:** individual answer accuracy and the number of pairs where both answers are correct. For invariant pairs, require both correctness and invariance: two identical wrong answers do not pass. Use boundary cases that make the changed distinction observable.

**Decision:** if familiar templates succeed but these pairs fail, adding more random numeric variants is unlikely to diagnose the problem. Add coverage of the missing semantic distinctions and measure them again on separate development pairs.

### I4 — Reduce repeated target text while keeping verification intact

The generated targets repeatedly teach assertion scaffolding and explanatory strings. Measure the token share used by literals, computation, assertions, and assertion messages before changing the targets. The experiment should ask whether the model can spend fewer generated tokens on fixed scaffolding while preserving the required checks.

A conservative first arm can standardize harness wording and shorten repeated assertion messages while retaining the mandatory input and output assertions on every `jsEval` stage. Use a new versioned target/export profile, preserve the old dataset, and verify that the transformed targets have the same outputs and rejection behavior on valid and invalid inputs. Update affected specifications if the proposed form changes their contract. Do not silently omit guards from the deployed target while training on guarded targets, or vice versa.

Compare the original and compact targets at a matched training-token budget, with examples seen and wall time reported separately. Measure executable answer accuracy, JavaScript syntax failures, truncation, and median generated tokens. A shorter program that answers the wrong question is not a success.

One important distinction should remain visible: assertions generated by the model check the program's own assumptions. They cannot establish that its extracted numbers came from the statement or that it chose the right operation. Independent dataset verification and development oracles remain necessary.

### I5 — Test retrieval based only on the incoming statement

Replace the reference-solution selector with a simple deterministic retrieval baseline over training statements. Start with a token-based ranking implemented using Node.js built-ins, optionally including units and other observable statement features. No embedding model or new dependency is necessary for this first comparison.

Keep three controls: no demonstrations, a fixed set of diverse demonstrations, and retrieved demonstrations. Use the same checkpoint, task set, generation budget, and a declared total prompt budget. Deduplicate retrieved examples by training-side structural family so three near-identical examples do not masquerade as three distinct hints. Log exact example IDs, ranking scores, and prompt hashes. The retrieved target programs are permitted because they belong to the training corpus; the evaluated item's reference program is not.

**Measure:** final answer accuracy and total prompt plus generated tokens. Manually inspect a small development sample of retrieval failures. If retrieval finds plausible examples but compilation remains wrong, improve adaptation training or decomposition; if retrieval consistently finds unrelated examples, improve the retrieval representation first.

Train with demonstrations only as a subsequent arm, using training-side queries and excluding each query's own example from retrieval. Do not simultaneously change the retrieval rule, fine-tuning mixture, and target format.

### I6 — Compare one full-program call with two bounded compilation calls

After I1 identifies a bottleneck, test a two-call wrapper: the first call extracts a small typed record or proposes an operator plan; the second compiles the statement and that model-produced record into SOP. The second call must receive the first call's actual output, including its mistakes. Supplying corrected intermediate records would turn the experiment into the oracle-assisted condition from I1.

This path requires its own documented adapter behavior and matching supervision. Train the intermediate outputs and include training-side examples with imperfect intermediate predictions if the deployed second call must correct them. Continue emitting ordinary SOP programs for the existing runtime; this proposal does not require a new executable language.

**Controls:** compare against a single call with a comparable total token budget, and report the two-call latency. Log both neural calls under one request budget. If two calls raise accuracy but consume more compute, report that tradeoff directly. This experiment tests whether exposing a smaller intermediate decision helps this particular student.

### I7 — Add one repair attempt only when a real runtime error is available

The repository has a runtime with structured failures, but current headline evaluation uses one generation attempt without repair. A bounded repair arm could expose a parser error or a failed wire, together with the original problem and the relevant generated code, then ask the same student for one corrected program.

Create repair supervision from failures on training-side problems. Never include a holdout oracle answer, its reference circuit, or an expected intermediate value in a deployable repair prompt. A successfully executed wrong answer usually supplies no automatic error signal; the wrapper must not act as if it knows that answer is wrong. Developer-side oracle checks score the experiment after the fact.

**Measure:** initial correct answers, additional correct answers after repair, remaining failures, calls, tokens, and latency. Compare one repair with one fresh retry at the same declared budget. If repair mostly makes wrong programs executable, it has improved robustness but has not solved planning.

### I8 — Keep a small compiled-context demonstration as a later milestone

Once local compilation has a useful measured success rate, test the broader project idea with a narrow synthetic document task. A suitable first case is an event log with explicit entity IDs and dated corrections, queried for the latest applicable state with supporting source spans. Put some relevant events in different chunks and keep an independent oracle over the complete source.

Begin with one fixed schema so schema planning is not another moving variable. Implement ingestion, persisted contributions, sealing, and query execution according to DS006. Measure record extraction, source-span correctness, duplicate handling, and final answers separately. Compare against a simple retrieval baseline on the same documents and queries, and report compilation cost separately from the cost of repeated queries.

This is a proposed integration milestone, not a capability of the current system. It should follow the measurement fixes and a successful local compiler experiment, rather than becoming another simultaneous implementation project.

### Suggested order and stopping rules

| Order | Work | Decision before spending more compute |
| --- | --- | --- |
| 1 | Complete measurement fixes and the current mixture evaluation | Confirm which checkpoint and inputs produced each reported result. |
| 2 | Run I1 on a small independent development suite | Identify the failure stage worth targeting. |
| 3 | Build I2 and I3 as one controlled data experiment | Determine whether new compositions and decisive wording improve across multiple groups. |
| 4 | Choose one of I4, I5, or I6 from the diagnosis | Change one main factor, with a matched control. |
| 5 | Evaluate I7 if executable errors remain a substantial failure class | Keep repair only if its measured benefit justifies its cost. |
| 6 | Attempt I8 after local compilation is useful | Test the actual compiled-context path with a narrow, auditable task. |

For each arm, declare the data snapshot, checkpoint-selection rule, training budget, inference budget, and development success criterion before launch. Report paired wins and losses across independent composition groups. One extra correct answer among sixteen unseen-plan items is a reason to investigate, not a reason to announce generalization. If a controlled arm produces no useful improvement, record the negative result and move to the next diagnosed bottleneck instead of repeating an equivalent run under a new name.

## Limits of this review

The 289 tests were rerun, raw completed-run counts and split intersections were recomputed, the preservation file was fully executed against manifest answers, and the CLI, readiness, transformation, and numeric-scoring defects were reproduced without GPU inference. No full 7,840-circuit provenance sweep or new model evaluation was run. The reference-solution dependency, orchestration races, and resume-input problem were established by tracing source paths; the live training/evaluation processes were not disturbed to reproduce destructive races. Passing tests and these checks do not certify every runtime semantic rule or every dataset statement. The concurrent thread may have repaired findings after the snapshot; reconcile the cited source locations before applying changes.
