---
title: DS002-sop-lang-core
summary: Defines the SOP Lang surface language, wire bodies, dependency analysis, topological evaluation, epoch and revision semantics, metaprogramming transactions, invalidation rules, tracing, and the normative runtime contract.
---

## Introduction

SOP Lang is the executable intermediate representation of this project. [Its basic unit is a wire.](wiki.html#definition-wire) A declaration begins at the start of a line with `@`, followed by a wire name and a wire command. Everything until the next valid declaration belongs to that wire's body. The body may contain JavaScript, plain text, JSON, a neural instruction, or command-specific configuration, so the language does not need a large surface grammar for every tool. Extensibility lives in wire commands while the dependency model stays uniform.

This specification is the contract for the parser, the dependency analyzer, the scheduler, and the transaction layer. The wire command vocabulary and the extension interface are specified in `DS004-wire-types.md`. Container commands and their revision semantics are specified in `DS005-containers.md`.

## Core Content

### Wire declarations and bodies

A minimal program is:

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

`rows` is an input wire supplied by the wrapper. `selected` depends on `rows`, `total` depends on `selected`, and `output` depends on both values used in its code. Textual order is not execution order. The runtime extracts dependencies, constructs a directed graph, validates that the active graph is acyclic, performs a topological sort, and executes wires only after their value dependencies are valid. Reordering independent declarations does not change the result of a pure circuit.

The parser applies an unambiguous boundary rule. A line beginning in column one with a valid `@name command` starts a new wire. A body that must literally contain such a line escapes it as `\@name command`, and the runtime removes the escape before the body reaches the command. Wire identifiers use a conservative ASCII identifier grammar in the reference implementation so they can be bound predictably inside JavaScript. Values themselves may contain arbitrary Unicode.

The canonical value reference is `$name`. There is no privileged `choose` or `force` primitive. A local conditional belongs in JavaScript or in the implementation of a custom wire command. Structural conditionality that changes which subgraph should exist at all uses [the metaprogramming API](wiki.html#definition-metaprogramming), and the resulting graph revision is validated and sorted again. An ordinary JavaScript `if` selects among values that are already dependencies of the wire. Structural conditionality creates a different circuit revision.

The output of a circuit is a convention rather than a special control-flow construct. The runtime returns the value of a configured output wire, commonly named `output`. That wire can have any command type. When the caller requires JSON, a final `jsEval` constructs and serializes the object deterministically. When the caller requires a typed object, the runtime validates the output value against a declared JSON Schema before returning it, which keeps formatting correctness separate from the semantic correctness of upstream analysis.

### Dependency analysis

Dependency extraction must not be implemented by a naive regular expression over arbitrary body text. In `jsEval`, `$rows` used as an identifier is a dependency, while the characters `"$rows"` inside a string literal may be data or code to be emitted later. The JavaScript wire implementation parses or lexes the body well enough to identify value references outside quoted literals and comments. Other wire types define their own dependency analyzer.

Every registered command therefore has both execution semantics and dependency-analysis semantics. The runtime asks a command implementation which wire values and structural definitions it reads before scheduling it. The analyzer never inspects runtime values to discover dependencies after execution has started. Dynamic creation of new dependencies is graph metaprogramming and produces a new graph revision.

The body language decides the lexical rule. JavaScript analysis ignores references inside string literals, comments, regular-expression literals, and property names, and it recognizes a spread expression as a value read, so `/$ghost/` and `object.$price` invent no dependency while `[...$rows]` reads `rows`. Instruction text has no string literals, so prose analysis reads a `$name` token wherever it appears: an apostrophe in `What's $x?` must not hide a required input. A container read is recognized in both declared form, such as the `source` of a `containerFilter`, and ordinary form, such as `jsEval` reading `$claims`; both activate the same scheduling and invalidation behavior.

### Topological evaluation and epochs

For a fixed graph revision, the runtime computes the active dependency closure from the requested output wires and any configured control roots, then performs a deterministic topological sort. Kahn's algorithm is the reference implementation: compute the in-degree of every active node, repeatedly select zero-in-degree nodes in a stable lexical or creation order, emit them, and decrement their successors. If active nodes remain when no zero-in-degree node exists, the circuit contains a cycle and execution fails before any final answer is published.

[An epoch is the evaluation of a stable graph and state snapshot.](wiki.html#definition-epoch) During an epoch, wires observe immutable dependency values from that snapshot. Pure wires may be executed in parallel once all their dependencies are satisfied. Effect-producing wires do not mutate shared state immediately; they stage validated effects that commit at an epoch boundary.

The batching rule matters for container updates. Fifty chunk-specific wires that add records to the same container execute against the same container revision, emit fifty patches, and have those patches merged deterministically into one transactional commit. The commit creates the next container revision and, when necessary, a new execution epoch. Container commands, merge policies, and ordering keys are specified in `DS005-containers.md`.

The reference implementation begins conservatively and may execute all ready wires serially while preserving epoch semantics. Parallel execution is enabled for wire types declared safe. Correctness takes precedence over throughput optimization because the research depends on trustworthy traces.

### Restart and revision semantics

A restart is not a command that jumps backward in execution. It is the consequence of moving from one immutable graph-and-state snapshot to another. Cached values from a previous epoch are reused only when their definition hashes, dependency revisions, command implementation versions, and relevant external resource versions remain compatible.

A redefinition of wire `x` invalidates `x` and all downstream value consumers. Every structural change advances the circuit revision counter, so two same-size revisions stay distinguishable in the trace and in a cache key. An update to a container invalidates any materialized views or wires that depend on that container revision, and the invalidation reaches a composed chain such as base container, first filter, second filter, and the scalar computed from it. A graph mutation that does not touch a pure subgraph does not force recomputation of that subgraph.

Explicit invalidation follows the same reach. `circuit.invalidateWire` marks the named wire and every affected consumer, including transitive dependencies, because a refreshed observation must reach the output that depends on it; `circuit.invalidateDownstream` marks the consumers without invalidating the named wire itself. A wire that read a definition through `circuit.getDefinition` or listed names through `circuit.listDefinitions` is a structural consumer, so it is invalidated when an observed definition changes or when the set of names matching a listed prefix changes.

The runtime maintains a definition hash and a dependency revision vector. A changed definition makes the wire dirty, and every downstream consumer is dirty unless an incremental optimization proves that the consumer's actual input value hash is unchanged. Caching is permitted only under a strict key that includes the command implementation hash, the normalized wire body, the hashes or revision identifiers of all value dependencies, relevant structural dependencies, and versioned external resources. Neural commands are treated as observations rather than mathematical functions: recorded outputs can be replayed for deterministic downstream verification, and a fresh model call is a new observation.

[Structural invalidation is distinct from semantic correction.](wiki.html#definition-canonical-view) If a chunk is initially interpreted as introducing character `p17` and a later reconciliation concludes that `p17` is an alias of `p3`, the container state changes and downstream views are invalidated. Historical provenance is not rewritten: the original extracted record and its source span remain in the audit log, and a canonical view merges them while the evidence that led to the correction is preserved.

### Metaprogramming and templates

A static directed acyclic graph is sufficient when the complete set of subproblems is known before execution. Real tasks often reveal structure only after data is available: a query returns an unknown number of groups, a legal analysis discovers exceptions that each require separate verification, or a debugging task generates a new hypothesis after a test fails. SOP Lang supports this by letting `jsEval` stage changes to the circuit itself.

The JavaScript runtime exposes a transactional circuit API. It does not expose an unrestricted `getValue(name)` function. Values enter JavaScript through `$wire` dependencies so the graph remains a truthful description of causality. Structural reads of definitions and metadata are permitted because they are recorded separately; hidden value reads would make topological ordering and invalidation unsound.

A minimal API is:

```js
circuit.addWire(name, { command, body, metadata });
circuit.redefineWire(name, { command, body, metadata, expectedDefinitionHash });
circuit.invalidateWire(name, { reason });
circuit.invalidateDownstream(name, { reason });
circuit.instantiateTemplate(templateName, bindings, { prefix });
circuit.getDefinition(name);
circuit.listDefinitions({ prefix });
circuit.commit({ key, result });
```

All write methods append operations to a transaction buffer. `addWire` fails if the name already exists in the parent revision. `redefineWire` fails if the target does not exist, and the optional expected hash prevents a stale writer from silently overwriting a newer definition. `invalidateWire` changes the validity generation even when the code is identical, which recomputes a value because of an external event. `instantiateTemplate` expands a reusable SOP Lang template with hygienic names and explicit bindings. `commit` returns a value to the current wire while requesting that the buffered operations be validated and published at the epoch boundary.

A metaprogramming wire illustrates the control principle:

```sop
@expandGroups jsEval
for (const group of $groups) {
  const safe = String(group.id).replace(/[^A-Za-z0-9_]/g, "_");
  circuit.addWire(`score_${safe}`, {
    command: "jsEval",
    body: `return scoreGroup($groups.find(g => g.id === ${JSON.stringify(group.id)}));`
  });
}
return circuit.commit({
  key: `expand-groups-${$groups.length}`,
  result: { created: $groups.length }
});
```

Newly created wires are not executed within the stale schedule. The runtime applies the transaction, re-analyzes dependencies, verifies acyclicity, increments the circuit revision, and begins the next epoch. In practice, generated code avoids embedding large runtime values into generated bodies and prefers index wires or template instantiation that depends on the existing value.

Publication is gated on commit. A wire that stages structural operations without calling `circuit.commit` publishes nothing: its transaction is rejected as a validation failure, and no dependent wire observes the staged names. `circuit.getDefinition` returns the actual definition of the current revision, including the command identity, the definition hash, and the normalized body, and `circuit.listDefinitions` returns the definitions matching a prefix; both record a structural read that participates in invalidation.

A transaction carries an intent hash over its parent revision, origin wire, structural reads, and operations. Replaying the same intent against the same parent revision is idempotent and returns the recorded commit result without repeating its effects. Re-adding a name whose definition is unchanged is an idempotent no-op, so a metaprogramming wire that re-executes after an unrelated commit publishes no duplicate effect, while re-adding the same name with different content is a conflict and fails the run.

Recursion emerges naturally. A template can contain a metaprogramming wire that instantiates another copy of the template for a smaller subproblem. There is no cyclic dependency in any fixed graph revision because recursion is a sequence of finite DAG expansions. Resource bounds stay explicit: the runtime caps the number of epochs, total created wires, neural calls, JavaScript time, output bytes, and template depth. Exceeding a budget yields a structured `budget_exceeded` result and a trace of partial progress rather than an invented answer.

A template is an SOP Lang fragment with named parameters and hygienic internal wire names. It represents patterns such as map-then-reduce, retrieve-then-verify, claim-extract-then-coverage-check, or recursive divide-and-analyze. Template source is versioned, inspectable, and part of the capability catalog, and the student knows its contract. Parameter substitution distinguishes value bindings from identifier bindings and prevents accidental capture of internal names. Expanded wires are ordinary SOP Lang wires and appear in the trace.

### Tracing

[A trace records at least the circuit revision](wiki.html#definition-trace), epoch number, wire name, command identity and version, definition hash, dependency identities, execution start and end, output hash, staged effects, transaction details, neural-call metadata where relevant, replay provenance, and any error. A dependency identity names the dependency, its definition hash, and the hash of the value that was actually observed, so a record identifies the exact graph-and-state snapshot it belongs to.

A rejected wire is recorded with the same identity fields as a successful one, which keeps the evidence of a rejection auditable without re-running it. A failed run still carries the trace of the wires that completed before it, and a malformed program is normalized into a failed outcome with a structured code and an error record, so a dataset worker rejects one candidate without aborting its batch. Structural transactions are recorded with their intent hash, parent revision, resulting revision, operations, structural read set, and commit state.

For neural wires, exact replay and fresh rerun are distinguished. Exact replay substitutes a recorded response only when the wire definition hash, the command implementation identity, and the hashes of the dependency values all match; a mismatch is rejected as `replay_mismatch` rather than returning a stale answer, and the substitution is recorded with the provenance of the entry it replayed. A rerun invokes the model again and may produce a different result even with nominally deterministic decoding because backend details can differ. The project does not claim bit-for-bit reproducibility of neural generation.

### Normative runtime contract

The normative implementation state contains a versioned circuit definition, a dependency graph, a value store, a command registry, container revisions, an effect staging area, a transaction log, and explicit resource budgets. A wire has a name, command identity and version, body, normalized definition hash, value dependencies, structural dependencies, metadata, and evaluation state. Valid states include at least `pending`, `ready`, `running`, `valid`, `dirty`, `failed`, and `cancelled`.

The reference implementation realizes this state in `runtime/kernel.mjs`, which owns the run lifecycle, over `runtime/executor.mjs`, which owns the epoch loop, wire execution, commit barrier, transaction application, and invalidation, together with `runtime/graph.mjs`, `runtime/containers.mjs`, and `runtime/metaprogramming.mjs`. Evaluation-state tracking is coarse: a wire is either absent from the value map, present but dirty, or valid with a recorded output hash. A dirty wire is recomputed in the next epoch, and a valid wire is reused until an invalidation reaches it.

Values are immutable at every boundary. The request inputs are copied and frozen when the run starts; a container snapshot, a derived view, and the record set handed to a consumer are deep copies; a JavaScript wire receives copies of its dependency values through the versioned value profile of `runtime/values.mjs`. A mutation inside a wire therefore never reaches a caller value, a sibling observation, a stored record, or a container revision, and persistent change requires a committed patch and a new revision.

Generated JavaScript runs in an isolated guest realm inside a worker thread. The realm contains only ECMAScript intrinsics, so generated code cannot reach the host process, the module system, or a runtime object; the guest sees a facade over the transactional circuit API whose operations and structural reads are replayed onto the real transaction after the call. Execution is bounded twice: the synchronous part of a call runs under the realm's script timeout, and the worker is terminated when the call exceeds its JavaScript deadline, so a nonterminating body ends as a structured `budget_exceeded` outcome instead of blocking the runtime. Consumed JavaScript time is charged cumulatively against the request budget.

Before an epoch begins, the runtime validates the active graph and computes a deterministic topological schedule. A wire becomes ready only when all value dependencies are valid in the current snapshot. Pure wires may be evaluated concurrently. Effect-producing wires return staged effects. Container patches are grouped and committed at the epoch barrier. Structural graph transactions are validated and committed at the barrier. When either commit changes dependencies or state revisions, affected wires are invalidated and the next epoch is scheduled from the new snapshot.

The runtime API available to `jsEval` exposes graph mutation but no hidden value store. `circuit.getDefinition` is allowed; `circuit.getValue` is not. Values enter through declared `$wire` dependencies. A transaction records `transactionId`, `parentRevision`, `originWire`, structural read set, write set, operations, and an intent hash. Replaying the same idempotent transaction against the same parent revision returns the same commit result. Reusing an identifier with different content is a conflict.

A final answer is published only from a fully validated requested output wire in a stable revision with no pending required transaction. Budget exhaustion, unresolved dependencies, cycle detection, schema failure, and tool errors yield structured partial or failed outcomes rather than fabricated semantic answers. Schema acceptance is fail-closed: the runtime publishes the supported schema profile of `runtime/schema.mjs`, and a keyword, type name, or constraint form outside it is rejected as `unsupported_schema` before any record or output is accepted.

### Reference implementation state

The reference implementation stores the language kernel under `runtime/` and the wire commands under `wires/standard/`. The kernel contains the parser, the dependency analyzers, the graph builder and scheduler, the epoch loop, the value store, the container store, the transaction layer, the value profile, the trace, the budgets, the JavaScript sandbox, the profile reader, and the schema validator. `runtime/kernel.mjs` exposes `createRuntime` as the run entry point and accepts an optional command registry, model bindings, clock, budgets, and sandbox configuration; `runtime/executor.mjs` exposes the epoch execution the kernel delegates to.

The standard vocabulary registers `input`, `literal`, `jsEval`, `graphPath`, `aggregate`, `fraction`, `modelCall`, `container`, `containerAdd`, `containerUpsert`, `containerRemove`, and `containerFilter`. Command lookup is case-insensitive while the registry keeps each canonical command spelling for the trace and the capability catalog. Every standard command carries a model-visible manifest whose fields follow `DS004-wire-types.md`.

An input wire is declared with the `input` command and receives its value from the request bindings. A binding whose name has no declared wire becomes an implicit input node, so a circuit can read a wrapper value directly. A wire that reads a container observes the revision that exists at the start of its epoch, while the wires that stage patches for that container execute in the same epoch and commit together at the barrier.

A dependency that no current wire provides is pending rather than immediately fatal. The runtime includes candidate producers, such as a `jsEval` wire that stages structural transactions, and reports the dependency as unresolved only after an epoch makes no further progress. This is what allows a metaprogramming wire to create the wires that a later epoch executes.

`jsEval` declares `mayStage` for `structural_transaction` and `container_patch`. Its contract is pure unless the body explicitly stages an effect, and the runtime records the staged effects in the trace and checks them against the declaration. A command that stages an effect it did not declare, or that declares a pure effect class while staging a patch, fails with `effect_not_permitted`.

Container declarations read the container they declare, which makes the declaration value refresh after a commit. Container patches record the parent revision; a patch whose parent revision is not current is rejected rather than applied out of order.

### Rationale and boundaries

Uniform dependency handling across commands is what makes a small model able to orchestrate tools it has never memorized: the contract it must satisfy is the same for every command, and the runtime, not the model, owns scheduling correctness. The price is a conservative reference implementation that recomputes more than a mature data system would, which is acceptable while semantic equivalence tests are still being written.

SOP Lang does not guarantee determinism for commands declared non-deterministic, and it does not hide those calls. It also does not guarantee that a valid circuit is semantically correct: validity covers syntax, dependency soundness, acyclicity, schema conformance, and permitted effects. Semantic quality is measured by task-level evaluation, not by circuit acceptance.
