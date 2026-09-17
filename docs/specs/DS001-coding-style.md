---
title: DS001-coding-style
summary: Defines the Node.js .mjs coding style, module and folder layout, test organization with node --test, dependency policy, and file-size and line-length rules for the runtime, wire types, context adapter, and data pipeline of sopLang-llm.
---

## Introduction

This specification is the canonical source for coding style, source layout, and test organization in sopLang-llm. It applies to the language kernel, the wire registry, the context adapter, the data pipeline, the training scripts, and any example code that ships with the repository. A coding agent that changes repository code follows this document, and `AGENTS.md` points to it.

The repository is a downstream consumer of imported agent skills. Those skills direct how the work is performed; they are not part of the product's documented surface, and their folders keep their own guidance and dependency records.

## Core Content

### Language and module rules

Executable code is Node.js ECMAScript modules in `.mjs` files. Modules use explicit exports, relative imports that include the file extension, `node:` imports for built-ins, and async/await for asynchronous work.

The runtime requires a Node.js version that provides stable ECMAScript module support and the `node --test` runner. The exact minimum version is recorded in `dependencies.md` alongside the runtime prerequisite and its startup check. Functions stay focused and portable. Bundled resources resolve relative to the module through `import.meta.url`, never through the process working directory or a developer's home folder.

The dependency-free default applies to the library and its tests: Node.js built-ins and local code only. No npm packages, Python, transpilers, bundlers, or external test frameworks are introduced for convenience. Any accepted exception is recorded in `dependencies.md` with its purpose, alternatives considered, authorization, license, source and update URLs, startup check, and removal opportunity.

### Source layout

The repository separates the language kernel from the utilities that consume it so that the interface tests of each part stay meaningful.

| Area | Responsibility |
| --- | --- |
| `runtime/` | Parser, dependency analysis, topological scheduler, epoch and revision semantics, value store, effect staging, transaction log, tracing, sandbox, and resource budgets. |
| `wires/` | Standard wire commands under `wires/standard/`, installable wire types under `wires/custom/`, and SOP Lang templates under `wires/templates/`. |
| `context/` | Planning, source chunking, the source store, state projection, ingestion for compiled context, and canonical source extraction under `context/sources/`. |
| `teacher/` | Teaching agents, problem-family generators, validators, oracles, the repair loop, the problem families of the seed books under `teacher/families/`, and the pilot runner that compiles and verifies book-derived examples. |
| `training-data/` | Text artifacts of the dataset: one folder per problem with its statement, its SOP Lang circuit, and its explanation; a knowledge category and a self-contained category with problem-type subfolders; the evaluation holdout; preserved rejected candidates; and the text manifests and reports. |
| `training/` | Training configurations, scripts, and checkpoints. |
| `benchmarks/` | Problem families, long-document benchmarks, summarization, and novelty suites. |
| `evaluation/` | Runners, metrics, statistics, and reports. |
| `paper/` | The evidence registry, generated tables, figures, and the manuscript. |

The library layout mirrors the contract boundaries of `DS002-sop-lang-core.md`, `DS004-wire-types.md`, `DS005-containers.md`, and `DS006-context-adapter.md`. A module that implements a contract states the specification it satisfies in its header comment.

### Test organization

Tests use `node --test` with `node:assert/strict`. Every semantic rule in the specifications has unit, property, or end-to-end coverage, and the test files live beside the area they exercise.

Test files follow the naming pattern `<module>.test.mjs` and are discovered from the repository test entry point. Each contract surface defines its acceptance tests.

| Surface | Required test coverage |
| --- | --- |
| Parser | Multiline bodies, escaped `\@name command` declarations, conservative ASCII wire identifier grammar, arbitrary Unicode values. |
| Dependency analysis | `$rows` used as an identifier outside quoted literals and comments, no dependency recognized inside strings, comments, regular-expression literals, or property names, instruction-text analysis for prose bodies, per-command analyzer semantics. |
| Scheduler | Cycle rejection before any final answer is published, stable topological order, deterministic lexical or creation order among ready nodes. |
| Metaprogramming | Graph transactions, stale-definition conflicts through `expectedDefinitionHash`, invalidation of redefined wires and their downstream consumers. |
| Containers | Batched additions, one revision increment per grouped commit, atomic rejection of an invalid group, deterministic sequence order keys, set membership identity, append-only history across upserts, filter composition and invalidation, tombstone behavior. |
| Sandbox | Realm isolation of generated code, copy semantics for dependency values and container snapshots, deadline termination of nonterminating bodies, cumulative JavaScript accounting, value-profile rejection of non-transferable values. |
| Schema profile | Enforced constraints, unsupported keywords reported as `unsupported_schema`, boolean schemas, fail-closed acceptance for records and outputs. |
| Context adapter | Complete source coverage, source-span boundaries, resumable patch persistence, seal-time validation. |
| Data factory | No oracle field reaches a model prompt, document-level splits hold before task generation, rejection reasons are preserved. |
| Training | A tiny overfit run verifies tokenization, chat template, and loss mask before a full experiment. |

### File size and line length

`fileSizesCheck.sh` reports oversized files, line totals per extension, and line-length warnings. A file above 500 lines is a warning and above 800 lines is an error state that calls for splitting the module or document. Markdown and HTML prose blocks stay unwrapped in source: long lines inside a paragraph, list item, or caption are expected because the documentation and the specs viewer wrap text naturally. Code files keep lines short enough to read in a terminal.

### Implemented module layout

The language kernel lives under `runtime/`. `kernel.mjs` is the run entry point and exposes `createRuntime`; it owns the run lifecycle, validates the program and the declared contracts, and delegates epoch execution to `executor.mjs`, which contains the epoch loop, wire execution, container commits, structural transaction application, and invalidation. `parser.mjs` implements the declaration rule and escapes, `dependencies.mjs` implements the JavaScript and instruction-text dependency analyzers, `graph.mjs` builds the graph, the container and structural read sets, and the schedule, `registry.mjs` resolves commands, `containers.mjs` holds the typed store with atomic grouped commits and append-only history, `metaprogramming.mjs` stages structural transactions, `sandbox.mjs` runs generated JavaScript in an isolated guest realm, `values.mjs` defines the transferable value profile, `profile.mjs` reads command profiles, `schema.mjs` validates records and outputs against the published schema profile, `budget.mjs` tracks limits, `trace.mjs` and `hashing.mjs` record and identify results, and `errors.mjs` and `security.mjs` carry structured codes and effect checks.

The standard wire commands live under `wires/standard/`, one module per command family, with `index.mjs` exporting the vocabulary that a registry is built from. Tests live under `tests/` and mirror the module names they exercise.

### Runtime and interface conventions

The kernel must not silently [change SOP Lang semantics](wiki.html#definition-sop-lang) to accommodate a model output. Parser or runtime changes require a version increment and migration of the affected training data. Model-facing text, including wire manifests and control-plane templates, is versioned together with the code that validates it.

Error handling distinguishes compilation failures from natural-language warnings. A parse failure, schema failure, cycle, unsupported command, or budget violation produces a structured error or a structured partial result, never a substituted answer.

[The `jsEval` sandbox](wiki.html#definition-js-eval) is an implementation detail of the runtime rather than a language guarantee. Sandboxing decisions do not change the declared semantics of the command.

### Documentation obligations for code changes

Every code change that alters behavior, interfaces, architecture, workflows, or constraints updates the HTML documentation and the affected design specifications in the same change. New project-specific terms receive a detailed entry on `docs/wiki.html` with a stable anchor, and eligible occurrences link to that anchor.

### Research engineering rules

Each experiment receives a unique manifest and an immutable result directory. The manifest records the git commit, model revisions, dataset hashes, random seeds, runtime configuration, machine information, and benchmark split identifiers. Evaluation writes per-item JSONL records before aggregate metrics, and table generation reads those records rather than transcribed numbers.

Rejected data and failure traces are preserved. Oracle values never enter a model prompt, the final test set never drives curriculum tuning, and no reported number is published without a path back to raw evaluation records.
