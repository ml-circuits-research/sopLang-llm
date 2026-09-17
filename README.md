# sopLang-llm

sopLang-llm fine-tunes a small code-capable language model to compile problems into SOP Lang circuits instead of generating final answers directly. Instead of asking a model to simulate all reasoning inside token generation, the project trains the model to interpret a task, decompose it, select available capabilities, and emit an executable SOP Lang program. A runtime then resolves dependencies, runs JavaScript for deterministic work, invokes declared tools or bounded neural judgments when semantics still matter, and returns a result that can be traced back to the circuit that produced it.

The project targets three audiences. It is a tutorial for engineers who have not previously fine-tuned language models, an implementation specification for a coding agent that builds the system and runs experiments, and an argument for reviewers who need every architectural choice backed by an experiment that can falsify it. The full research and engineering handbook is `vision/Small_Models_Compiled_Context_SOP_Lang_EN.docx`.

## Overview

The optimization target is different from ordinary instruction tuning. A conventional system computes an answer as one model response. This project computes a circuit from the model and an answer from the runtime. The model can still make semantic judgments through explicit neural wires, but each judgment is a visible component of the circuit and its inputs and outputs appear in the trace.

Three proposals define the system.

Fine-tuned compilation. The student model is trained to emit SOP Lang rather than final prose. Arithmetic, sorting, counting, joins, filtering, aggregation, graph traversal, schema validation, and serialization are delegated to JavaScript or to installed wire types. The model's most valuable learned behavior is stopping where symbolic execution becomes possible.

Compiled context. A source that exceeds the model context is planned first. The planner declares typed containers with schemas and identity policies. The source is then streamed in chunks and each chunk is compiled into inert container contributions and deferred circuit fragments. The accumulated circuit is executed after sealing, producing a persistent semantic state that ordinary code and later neural calls can query.

Verified teaching. A coding agent acts as the teacher and builds problem factories with parameterized generators, mutation operators, oracles, validators, and difficulty schedules. Candidate SOP Lang solutions are executed, failures are rejected, and every accepted example keeps its provenance. The books in `vision/` serve as seed environments from which the factory derives tasks grounded in authentic prose.

## Documentation

The canonical documentation lives under `docs/`.

- `docs/index.html` introduces the system and carries the Documentation Map.
- `docs/wiki.html` is the terminology reference for every project-specific term.
- `docs/specsLoader.html?spec=matrix.md` opens the specification matrix, which links every design specification under `docs/specs/`.
- `docs/specs/DS000-vision.md` records the research hypothesis, audiences, and falsification criteria.
- `docs/specs/DS002-sop-lang-core.md` and the following files define the language, runtime, adapter, model, and data contracts.

The design specifications are the source of truth for documented behavior. `AGENTS.md` tells a coding agent how to work in this repository.

## Implementation status

The repository ships the language runtime under `runtime/` and the standard vocabulary under `wires/standard/`, together with a test suite that covers the parser, dependency analysis, scheduling, epochs and revisions, containers, metaprogramming, tracing and replay, the registry and profile readers, the published schema profile, the isolated JavaScript sandbox, and compiled-context end-to-end scenarios.

The first stage of the training-data pipeline is implemented. `context/sources/docx.mjs` extracts a seed book with the versioned canonical profile, `teacher/sources/` parses the first seed book into problem records, `teacher/families/` holds the problem families that compile a printed template into a circuit, and `teacher/pilot.mjs` executes each circuit, verifies the answer against the source and against an independent computation, and writes the text artifacts under `training-data/`.

The installable wire loader under `wires/custom/`, templates under `wires/templates/`, the remaining context adapter machinery, the learning-based teacher and its repair loop, and the training, benchmark, and evaluation trees under `training/`, `benchmarks/`, and `evaluation/` are planned work described by their specifications. Statements about those surfaces in the documentation describe intended behavior rather than exercised behavior.

## Training data pipeline

The dataset is a tree of text files under `training-data/`. Two main sets separate examples by the knowledge their solution requires: `no-knowledge/` holds problems whose premises are fully stated by the problem text, and `knowledge/` holds problems whose solution needs an external fact, which the circuit then materializes explicitly. Inside a category the next level is the problem type, such as `order-in-a-line`, and every problem folder holds exactly three files: `problem.md` (the statement, and nothing else, plus a labelled `Referenced context` line when the statement hands its premise to an earlier problem), `solution.sop` (the SOP Lang circuit — the compiled plan of that instance: a `slots` `literal` wire carries the values extracted from the statement, an optional `facts` `literal` carries external knowledge, and the `answer` wire performs the deterministic `jsEval` computation; dataset circuits contain no `input` wire and no `modelCall` wire), and `explanation.md` (an `## Explanation` section and a `## Result` section). One percent of the accepted examples form the evaluation holdout under `eval/` and are excluded from the training sets; rejected candidates are preserved under `rejected/` with their reason. `sources.md`, `manifest.md`, and `report.md` hold the source inventory, the per-example hashes, and the dataset report.

```bash
node teacher/chapter-dump.mjs --chapter 7          # inspect a chapter of the seed book
node teacher/pilot-cli.mjs --verify --chapters 7   # verify the families of a chapter without writing artifacts
node teacher/pilot-cli.mjs                         # compile the whole book into training-data/
node training-data/verify.mjs                      # check the shipped tree and re-execute every circuit
node training-data/verify.mjs --help               # describe every supported argument
node training-data/verify.mjs --timings            # add the duration of every circuit execution
node training-data/verify.mjs --provenance         # list unprovable computed-versus-stored verdicts
```

`training-data/verify.mjs` enforces the dataset circuit contract over the shipped tree. It warns on any `input` or `modelCall` wire, because a compiled plan carries its own data and no circuit re-parses its problem; when the shape holds it executes every circuit without inputs and without model bindings and compares the answer with the printed answer of its manifest row; and it probes answer provenance by perturbing each `slots` literal (number shifts, zeroing, flipped booleans, mirrored strings, flipped characters, changed array lengths, aligned sibling objects, aligned and swapped scalar pairs, composed scalar values) and re-running the circuit. An answer that stays the same through every perturbation is reported per file: a hardcoded answer (the answer wire reads no input value) fails the run, while an unverifiable verdict is listed as information and does not fail it when every circuit of the plan prints that same answer, because there is nothing to compare it against. Exit code 0 means the whole tree is verified.

The first book is compiled: 40 chapters, 608 covered templates, 587 distinct plans, 994 accepted examples (934 self-contained, 60 requiring an external fact that their circuit materializes), 10 evaluation examples held out at one percent, and 6 preserved rejections (the five polarity answers of chapter 19 quarantined by the English-only lexicon and one template without a family). Every accepted example is `exact_verified`, because the circuit was executed by the runtime and its answer matched both the printed answer and the family computation over the same reference parse; the dataset report states the independence limitation of that class, the source-owned text blemishes, and the holdout selection rule.

The family modules under `teacher/families/` are the source of the dataset, not a temporary artifact: the pilot compiles them into `training-data/`, so the shipped tree is verified without them but can only be regenerated, corrected, or extended from them. A family holds the reference parse, the independent computation, the answer text, the computation body that becomes the `answer` wire, and the explanation lines of one printed template.

## Prerequisites

The implementation language is Node.js using ECMAScript modules in `.mjs` files. The library and its tests use Node.js built-ins only; `node --test` and `node:assert/strict` cover test organization. No package manager step is required for the library.

Fine-tuning requires a trainer environment with enough accelerator or unified memory for the selected student size. The handbook treats the exact model family, trainer, and hardware as experimental variables that each run records in its manifest.

## Library usage

The runtime accepts a circuit and a set of input wires, extracts value dependencies, builds a dependency graph, rejects cycles, computes a topological order, and executes wires after their dependencies are valid.

```sop
@selected jsEval
return $rows.filter(row => row.enabled === true);

@total jsEval
return $selected.reduce((sum, row) => sum + row.amount, 0);

@output jsEval
return JSON.stringify({
  count: $selected.length,
  total: $total
});
```

`rows` is an input wire supplied by the caller. The runtime resolves `$rows`, `$selected`, and `$total` as dependencies, validates that the active graph is acyclic, and returns the value of the configured output wire, commonly named `output`.

Every JavaScript body runs in an isolated guest realm that receives copies of its dependency values, so generated code cannot reach the host process, the module system, or a stored value, and a nonterminating body ends as a structured budget outcome instead of blocking the runtime.

The library entry point is `runtime/kernel.mjs`.

```js
import { createRuntime } from './runtime/kernel.mjs';

const runtime = createRuntime();
const result = await runtime.run(source, {
  inputs: { rows: [{ enabled: true, amount: 4 }] },
  outputs: ['output']
});

console.log(result.status);   // completed
console.log(result.outputs);  // { output: '{"count":1,"total":4}' }
console.log(result.trace);    // per-wire definition hashes, dependencies, and output hashes
```

A request may bind a model for `modelCall` wires, declare budgets, validate the output against a schema, receive an existing container store, and run in `replay` mode against a recorded trace.

```js
const result = await runtime.run(source, {
  inputs,
  outputs: ['answer'],
  models: { modelCall: async ({ instruction, values }) => judge(instruction, values) },
  budget: { maxNeuralCalls: 4 },
  outputSchema: { type: 'object', required: ['answer'] }
});
```

The run result reports one of three statuses. `completed` carries the requested output values. `partial` reports a budget limit or an unresolved dependency together with the partial output and trace. `failed` reports a parse, validation, execution, or cycle error with a stable code, so a batch worker rejects one candidate without aborting the run. Codes include `parse_error`, `unknown_command`, `unknown_output`, `unknown_dependency`, `cycle_detected`, `validation_error`, `missing_input`, `stale_definition`, `effect_not_permitted`, `execution_error`, `unsupported_schema`, `unsupported_value`, `replay_mismatch`, and `budget_exceeded`. Exact replay substitutes a recorded neural observation only when its definition hash and dependency value hashes match, and a mismatch is rejected rather than answered from stale evidence.

## Tests

```bash
npm test
```

The test suite covers parser boundaries and escapes, dependency analysis outside strings, comments, regular-expression literals, and property names, instruction-text analysis, scheduling stability and cycle rejection, epoch and revision semantics, container patches, atomic commit rejection, membership identity, append-only history, and invalidation, metaprogramming transactions and budgets, the isolated sandbox and its accounting, the schema profile, tracing and replay, profile parsing, the command registry, and end-to-end compiled-context scenarios. Tests use `node --test` with `node:assert/strict` and require no third-party packages.

## Experimental workflow

The research workflow below is planned work; none of it is implemented yet. It has four stages. The data factory builds problem families with latent structures and independent oracles. The teacher agent produces candidate circuits and accepts only examples that pass execution checks. The fine-tuning laboratory trains the student on verified trajectories, starting with a tiny overfit test that validates the chat template and loss mask. The evaluation suite reports task success, circuit validity, symbolic delegation, neural call counts, cost per verified result, long-document ingestion recall, anti-smoothing preservation, and novelty metrics.

Every training and evaluation run is driven by a machine-readable manifest that records model and tokenizer revisions, dataset hashes, split identifiers, random seeds, and the runtime configuration. Reported results are traced to raw per-item records rather than assembled by hand.

## License

The repository is licensed under the GNU Affero General Public License, version 3. The seed books under `vision/` carry their own rights status, which every dataset manifest records and which determines whether a source can appear in released artifacts.
