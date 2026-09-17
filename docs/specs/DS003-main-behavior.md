---
title: DS003-main-behavior
summary: Defines the main behaviors of sopLang-llm, covering problem-to-circuit compilation, deterministic topological execution, the capability catalog, typed containers, compiled context, bounded recursive model calls, the verified teaching pipeline, manifest-driven fine-tuning, and falsifiable evaluation.
---

## Introduction

sopLang-llm turns a problem into an [executable SOP Lang circuit instead of a direct answer](wiki.html#definition-sop-lang). A small fine-tuned model interprets the task and compiles it into wires. The runtime executes those wires, delegates deterministic work to JavaScript, calls declared tools or bounded neural judgments where semantics remain necessary, and publishes a result that traces back to the circuit. The behaviors below describe the outcomes that engineers, coding agents, and reviewers rely on when they use and evaluate the system.

## Core Content

### Main Behavior Components

| Name | Explanation |
| --- | --- |
| Problem-to-circuit compilation | The student model reads the control plane and the problem, decomposes the task, delegates deterministic work to `jsEval` or installed wire types, and emits a circuit or patch instead of a direct answer. |
| Deterministic topological execution | The runtime extracts dependencies, rejects cycles, schedules wires in a stable topological order, evaluates the circuit in epochs over immutable snapshots, and publishes only a validated output wire. |
| Capability catalog and installable wire types | Available commands are described to the student through versioned manifests and can be added, renamed, or withheld at inference time without retraining. |
| Typed persistent containers | Container wires declare schemas and identity policies, and container mutations are staged as patches that commit once per epoch into a new revision. |
| Compiled context over long sources | A long source is planned into containers, compiled chunk by chunk in compile-only mode, sealed, and then queried from persistent state rather than one large prompt. |
| Bounded recursive model calls | The context adapter runs named call modes with narrow output contracts, separates the control plane from the data plane, projects selected state, and enforces repair, rerun, and budget limits. |
| Verified teaching pipeline | A coding agent acts as the teacher, builds problem factories with oracles and validators, executes candidate circuits, rejects failures, and preserves provenance and acceptance classes. |
| Manifest-driven fine-tuning and export | Training runs through reproducible manifests, validate tokenization and loss masks with a tiny overfit test, select checkpoints by executable behavior, and benchmark the exact exported artifact. |
| Falsifiable evaluation and evidence registry | Baselines, ablations, per-family metrics, and an evidence registry make every quantitative claim traceable and allow the thesis to be rejected. |

### Problem-to-circuit compilation

[The student model serves engineers](wiki.html#definition-student-model) and researchers who need a small model to solve decomposable problems reliably. It receives a trusted control plane and a problem or local state, and it produces SOP Lang. The result is a circuit or a patch that the runtime can validate and execute.

The initiating trigger is a compilation request from the context adapter. In an initial planning call, the model designs container schemas and an ingestion strategy from the task and source metadata. In a chunk-ingestion call, it produces inert container contributions, obligations, and deferred analysis wires for one source chunk. In a query-planning call, it compiles a question into a circuit over existing containers.

The principal behavior is decomposition until symbolic execution becomes possible. Arithmetic, sorting, counting, joins, filtering, aggregation, graph traversal, schema validation, and serialization are delegated to `jsEval` or a dedicated wire type. A local semantic judgment that cannot be reduced to a classical algorithm becomes a `modelCall` wire with a bounded instruction. A subproblem that cannot be resolved from available evidence becomes a structured unresolved obligation rather than plausible text. The observable result is a circuit whose execution is inspectable and whose neural calls are explicit.

The model's stopping behavior is a distinctive project rule. The training objective penalizes unnecessary neural work, and a subproblem that has become mechanical is expected to stop invoking the model. A fallback hierarchy orders preferred actions: an installed symbolic wire first, a short `jsEval` program second, an installed neural or domain tool third, a general `modelCall` fourth, further decomposition fifth, and explicit uncertainty when no available evidence or tool can resolve the subproblem.

The governing boundary is that the model proposes and the runtime decides. The wrapper never reinterprets malformed output as valid code unless that reinterpretation is an explicit repair step, so measurements reflect the student's behavior rather than the wrapper's corrections.

### Deterministic topological execution

The runtime serves every consumer of the project: engineers running circuits locally, the context adapter executing ingestion and analysis, and the evaluation suite measuring correctness. It converts a circuit into a result that can be defended.

The initiating trigger is a request to evaluate a circuit for named output wires with input wires supplied by the wrapper. The runtime extracts value and structural dependencies through each command's analyzer, builds the active dependency graph from the requested outputs and configured control roots, validates that the graph is acyclic, and computes the schedule. A cycle fails execution before any final answer is published.

Wires observe immutable dependency values within an epoch. Pure wires may run concurrently, and effect-producing wires stage validated effects that commit at the epoch boundary. A commit that changes dependencies or state revisions invalidates the affected wires and schedules the next epoch from the new snapshot. A restart is a move between snapshots, not a jump backward in execution. Explicit invalidation reaches the same consumers, a structural change advances the circuit revision counter, and a wire that reads a definition is invalidated when an observed definition changes. An effect that was staged without a commit never publishes.

The observable result is the value of the configured output wire, commonly `output`, together with a trace that records the circuit revision, epoch, wire names, command versions and definition hashes, dependency identities, execution intervals, output hashes, staged effects, transaction details, neural-call metadata, replay provenance, and errors. A rejected wire is recorded with the same identity fields as a successful one, and a malformed program is normalized into a failed outcome so a batch worker rejects one candidate and continues. When the caller requires JSON, a final `jsEval` constructs and serializes the object deterministically; when the caller requires a typed object, the runtime validates the output against a declared JSON Schema from the published profile before returning it, and an unsupported schema is rejected before execution. Exact replay substitutes a recorded neural observation only when the definition hash and the dependency value hashes match.

The hidden mechanism with a major consequence is cache validity. A cached value is reused only when its definition hash, dependency revisions, command implementation version, and external resource versions remain compatible, which is what allows later epochs to skip recomputation without reintroducing stale results.

The governing invariant is that a final answer comes only from a fully validated requested output wire in a stable revision with no pending required transaction. Budget exhaustion, unresolved dependencies, cycle detection, schema failure, and tool errors produce structured partial or failed outcomes rather than fabricated answers.

Generated JavaScript is a capability boundary as well as a correctness boundary. A `jsEval` body or a filter predicate runs in an isolated realm that receives copies of its dependency values and cannot reach the host process, the module system, or a stored record, so a generated program cannot mutate runtime state outside its declared effects, and a nonterminating body ends as a structured budget outcome instead of blocking the run.

### Capability catalog and installable wire types

The catalog serves the student model, which must compose capabilities it has never memorized, and the engineers who add new capability without retraining a student.

The initiating trigger is the construction of a control plane for a call. The wrapper discovers registered wire commands, renders their model-visible manifests, and includes them with the SOP Lang version, container schemas, output constraints, budgets, and the role the model performs. Each manifest states the command name and version, what the command does, when to use it and when not to, the accepted body form, how dependencies are referenced, the output contract, the effect class, determinism, and one or two canonical examples.

A command is implemented by an ECMAScript module that exports a `wireType` object with three layers: a manifest that may be shown to the model, an analyzer and validator used by the compiler, and an executor used by the runtime. Execution receives immutable resolved dependency values, the original body, declared budgets, versioned resources, and only the runtime APIs permitted by its effect class. A pure command cannot redefine wires or update containers; a container patch command receives the staging API; a graph-metaprogramming command may stage structural changes.

The observable result for an integrator is that adding a `.mjs` wire type, regenerating the catalog, and describing the command precisely is enough for the student to use it. Training randomizes command names and withholds entire wire types so that evaluation can distinguish reading manifests from memorizing token sequences.

The governing boundary is version integrity. The manifest and the executable code carry the same version and hash in the trace. A command whose description and behavior disagree makes the experiment invalid, so conformance tests generate inputs from the declared schema and check the relationships the manifest claims.

### Typed persistent containers

[Containers serve the student as external memory](wiki.html#definition-container) and serve evaluation as a measurable representation. Long-document reasoning needs state that is more structured than chunk lists and less brittle than prose summaries, so containers are first-class wire values with explicit schemas, identity policies, provenance, and revision semantics.

The initiating trigger is a planning call that declares containers such as `characters`, `places`, `events`, `rules`, `exceptions`, or `results`, with a kind of table, set, or sequence. Table records follow a record schema with primary or candidate keys. Set membership follows a stable identity function or canonical hash. Sequence order is semantic, so items carry ordering keys such as source document order, chunk order, source offset, and local index.

Container mutations do not mutate the target while executing. `containerAdd`, `containerUpsert`, and `containerRemove` produce validated patches against the container revision visible at the start of the epoch, so compatible patches computed by independent wires can commit together. At the epoch boundary the runtime groups patches by target container, validates conflicts, orders them deterministically, and commits one new container revision. A five-hundred-chunk book commits its event additions in one revision instead of five hundred. A group is atomic: a rejected patch leaves records, history, and revisions unchanged, and an ordinary value read of a container activates the same contributions and invalidation as a declared container read.

`containerUpsert` requires a declared identity rule, and the default rejects a conflicting replacement instead of silently choosing a winner. Competing assertions with provenance are preserved, and a later canonicalization wire builds a derived view. Removal creates a tombstone or a new revision rather than erasing history, so replay and audit remain possible, and every accepted item is recorded in an append-only history with the record it replaced, which keeps an earlier assertion and its source spans retrievable by revision. A set's membership follows its canonical or declared identity, so a repeated member never inflates a downstream count.

`containerFilter` defines a pure derived view with references to source record identities and the source revision it was computed from. A source or predicate change invalidates the view and its downstream consumers transitively. Filters compose: a filter may read another derived view, and the chain from a base container through successive views to a scalar is invalidated link by link from the base commit. Incremental maintenance and content-hash shortcuts are permitted optimizations only when they pass equivalence tests against the conservative reference semantics.

The governing boundary is that authoritative evidence stays append-only. Canonical views are derived results, not replacements for the records and spans that produced them.

### Compiled context over long sources

Compiled context serves users who need analysis of a book, a legal corpus, or a research record that exceeds the student's context window. It replaces one very large transient prompt with a versioned external semantic state.

The initiating trigger is a source that the adapter registers with a stable `sourceId`, content hash, canonical encoding, version, metadata, rights status, and offset map, followed by a planning call that defines the schemas, provenance requirements, identity policies, reconciliation stages, and analysis obligations for the intended class of questions.

The source is streamed in chunks. Each chunk has a `chunkId`, an owned source range, optional overlap context, and a source order. In the preferred compile-only mode, the model emits inert container contributions and deferred analysis wires, and the wrapper validates syntax, schemas, span boundaries, identifiers, and patch identity before appending the fragment. The global analysis circuit is not executed during ingestion.

At the end of ingestion the wrapper seals the snapshot. Sealing checks that all expected source ranges were processed, accepted patches are persisted, schemas are version-consistent, references resolve or are marked unresolved, and the compiled dependency graph is valid. Only after this barrier does the main execution begin, with container additions evaluated in batched ingestion epochs and the analysis circuit operating over stable container revisions. Intermediate reconciliation barriers that later chunks genuinely require are explicit and counted.

Every semantic record points back to one or more intervals in the canonical source, with offsets defined against a stable encoding and source version. Raw chunks are stored independently of compiled containers, so a final analysis can request rereading when a contradiction or a suspected extraction error appears.

The governing boundaries are honest framing and measurable loss. The project does not call this infinite context. Extraction can lose information, identity resolution can fail, and a schema can omit a distinction that later matters, so evaluation scores source coverage error, representation error, planning error, execution error, and synthesis error separately.

### Bounded recursive model calls

[The adapter is what makes compiled context operational.](wiki.html#definition-compiled-context) From the application's perspective one request may cover a book of hundreds of thousands of tokens, a growing container set, custom wire types, and a circuit that evolves over dozens of epochs. From the student's perspective each invocation stays bounded and purposeful.

The adapter exposes one high-level entry such as `solve(request, capabilities, source?)` and internally uses named call modes with narrow output contracts. `plan` designs the initial decomposition and container schemas. `ingest` compiles one source chunk into container contributions and unresolved obligations. `compile` produces or extends the executable circuit for a subproblem. `judge` performs a bounded semantic decision invoked through `modelCall`. `repair` receives a parse, runtime, or validation error and proposes a patch. `replan` receives newly available concrete values and decides whether the graph must expand. `synthesize` creates wording from already validated semantic results.

Each call is recorded as a `CallEnvelope` with request ID, role, circuit revision, epoch or ingestion revision, model revision, control-plane hash, input projection hash, budgets, sampling parameters, and expected output schema. The returned `CallResult` stores raw generated text, parse result, validated SOP Lang, token counts, latency, and any rejection or repair decision.

The hidden mechanism with a major consequence is state projection. Providing too little context causes wrong decomposition and providing too much recreates the long-context problem, so projection is a versioned algorithm with logged inputs and outputs. Chunk ingestion may project lexical matches, entity aliases, nearby chronology, unresolved obligations, and schema metadata. Final analysis may project results of container queries generated by an earlier planning call. The selector never uses the hidden answer to a benchmark question.

The student can request more context through structured needs such as retrieving candidate identities matching an alias or loading source spans supporting named claims. The adapter fulfills the request through approved retrieval functions and invokes the student again, and the additional call counts against the same request budget. Repair is bounded in the same way: a parse error, a static validation error, or a runtime error produces a bounded repair call, and repeated identical failure terminates early.

The governing boundary is that deployment uses the student only. A larger teacher may generate training data, but hidden fallback to a larger model would invalidate small-model claims, so any escalation baseline is logged and priced separately.

### Verified teaching pipeline

The teaching pipeline serves the project by producing training examples whose quality does not depend on model self-confidence. [A coding agent is a natural teacher](wiki.html#definition-teacher-agent) because the target behavior is executable: it can inspect a problem, design a decomposition, write SOP Lang, implement or call wire types, execute the circuit, create tests, compare outputs with an oracle, diagnose failures, and revise the solution.

The initiating trigger is a problem specification whose answer can be checked independently. The agent decides whether the task should be decomposed further, creates or reuses a problem-family generator, produces a circuit, executes it, and compares the output to an oracle. A wrong result is repaired from the trace. Accepted trajectories and selected failure and repair pairs are both preserved because deployed systems also replan after execution errors.

The teacher should not be trusted because it is sophisticated. The data pipeline decides what is accepted. Every accepted example has a provenance chain with the seed problem, generator configuration, teacher model and agent version, candidate circuit, runtime version, execution trace, oracle result, validators, repair history, and final acceptance decision. Acceptance classes separate `exact_verified`, `execution_verified`, `evidence_verified`, and `human_audited` examples so later ablations can measure data quality.

The factory builds parameterized generators rather than piles of prompts. Every family specifies the latent structure of the task, a generator, a natural-language renderer, an oracle, mutation operators, a difficulty vector, and coverage labels. The teacher sees the natural-language problem and the capability catalog, not the hidden oracle program. Difficulty is multidimensional and covers subproblem count, dependency depth, branching factor, irrelevant information, unnecessary wire types, recursion, container revisions, ambiguity, intermediate data size, and the share of work that can be delegated symbolically.

The books in `vision/` act as seed environments. The teacher reads a source, constructs candidate semantic inventories, and creates tasks whose answers must be grounded in the source. A philosophy book yields argument, qualifier, counterargument, definition, and framework comparison tasks. A novel yields entity resolution, chronology, causality, perspective, and evidence-preserving summarization tasks. A machine-learning research source yields method and result extraction, comparability, limitation tracking, and prior-art tasks. Document-level splits happen before task generation, and licensing metadata determines whether a source may appear in released artifacts.

The reference pipeline realizes this behavior for the seed books in three stages. Extraction registers a source with its raw hash, its canonical hash, and a versioned extraction profile, and keeps the statement, the printed answer, and the reference model of every problem apart so the solver-visible projection never carries the answer. The family layer turns a printed template into a circuit whose semantic stage parses the statement and whose deterministic stage computes the answer. The verifier executes each circuit and accepts the example only when the executed answer, the independent computation of the family, and the printed answer agree; a problem whose template has no family is preserved as a rejected candidate rather than approximated, so coverage is a number inside the source rather than an impression. A problem whose solution needs a fact the text does not state is filed under the knowledge category with that fact materialized in its circuit, so the required knowledge is visible in the artifact.

The governing boundary is leakage prevention and honest acceptance. Oracle values never enter a model prompt, held-out test seeds are inaccessible to the teacher pipeline until evaluation, rejected examples are preserved with their rejection reasons, and near-duplicate structural motifs do not dominate the dataset.

### Manifest-driven fine-tuning and export

The training laboratory serves engineers who need to specialize a small student without losing its general language and code ability. The first run answers a basic question: can the student learn to emit valid SOP Lang, respect the separation between control and data, delegate deterministic work, and execute correctly on held-out problems?

Training is driven by a machine-readable manifest that identifies the base model and exact revision, tokenizer, dataset snapshot, split manifest, system prompt profile, wire-registry snapshot, sequence length, packing, optimizer, learning-rate schedule, batch parameters, precision, fine-tuning method, random seeds, training-token budget, checkpoint schedule, and hardware and software environment. The run writes immutable logs and checkpoint hashes.

The first step is a tiny overfit test on a few hundred examples selected from several task roles. If training loss does not fall strongly, the pipeline is broken. If loss falls but inference still emits direct answers rather than SOP Lang, the chat template and generation prompt are inspected before any hyperparameter change. A unit test tokenizes one example and prints token IDs with the loss mask so a human can verify which tokens contribute to the objective.

Checkpoint selection uses the validation harness rather than token loss alone. The harness executes generated SOP Lang and reports parse validity, graph validity, final oracle success, symbolic delegation, and relevant behavioral metrics. A narrow SOP Lang mixture is compared against a mixture that includes capability-preservation data, and if code ability collapses while syntax improves, the training recipe is changed. Training also compares fixed command names against randomized command names supplied through runtime manifests.

The observable result of the laboratory is a selected checkpoint exported to the intended CPU inference format, for example GGUF when the runtime supports it. Accuracy, memory, and throughput are reported for the same exported artifact, and quantization is evaluated rather than assumed.

The governing boundary is cost honesty. A validated checkpoint is benchmarked on the exported artifact with prompt-processing throughput separated from generation throughput and with whole-task latency measured, because the student is often called recursively and a fast single call does not imply a fast system.

### Falsifiable evaluation and evidence registry

Evaluation serves reviewers and research engineers by making the thesis rejectable. The main comparison is factorial: the student in direct-answer mode, the same student with SOP Lang, a larger teacher in direct-answer mode, and the teacher with SOP Lang where feasible. Long-document experiments add a chunk-and-merge baseline and a retrieval baseline, and structured tasks include direct JavaScript or SQL generation where that is credible.

Ablations identify which parts of the system matter. Removing explicit decomposition asks the student to generate the whole circuit in one pass. Disabling `jsEval` forces neural computation for deterministic operations. Removing compiled containers supplies retrieved raw chunks instead. Replacing task-conditioned schemas with a fixed universal schema tests schema planning. Disabling metaprogramming tests graph expansion. Removing anti-smoothing audits tests preservation policy. Hiding custom wire descriptions tests memorized command names.

Generalization tests hold out operator compositions, dependency depths, branching patterns, tool manifests, schema shapes, source positions, and document lengths. Long-document evaluation varies the location of critical evidence and the number of irrelevant chunks, and it reports ingestion recall, representation precision, final answer accuracy, and performance as a function of source position and document length.

Final task success is the primary metric when an oracle exists, and success is the fraction of items whose executed result matches the oracle within the declared tolerance. Circuit parse validity, graph validity, runtime completion, and output-schema validity are reported separately, so a system does not look strong because it produces syntactically beautiful but semantically wrong programs. Teacher-student comparison uses a predeclared non-inferiority margin with paired evaluation over the same items. Efficiency metrics include generated and prompt tokens, neural call counts, accelerator time during compilation, CPU time during execution, wall-clock latency, peak memory, and compiled-state storage, with a reported cost per verified correct result.

The evidence registry holds hypotheses, benchmark definitions, experiment manifests, metrics, confidence intervals, plots, failure examples, and limitations. Manuscript tables and figures are generated from per-item records, and a number that cannot be traced to a raw result file does not appear. Negative results remain in the registry and influence the discussion, and predeclared falsification criteria protect the project from narrative drift.

The governing boundary is statistical structure. Macro averages by family and difficulty stratum prevent thousands of easy items from hiding fifty difficult long-document cases, and confidence intervals are computed over problem instances or document clusters rather than over extracted records that correlate within one book.
