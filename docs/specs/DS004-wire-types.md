---
title: DS004-wire-types
summary: Defines the standard SOP Lang wire vocabulary, the state and effect model of each command, and the .mjs wire type contract with manifest, analyzer, validator, executor, versioning, and conformance testing.
---

## Introduction

[Wire commands are the extension interface of SOP Lang.](wiki.html#definition-wire-command) A small standard vocabulary gives the student stable concepts without turning SOP Lang into a large programming language, and installable `.mjs` wire types add capability that the model composes from descriptions at inference time. Every command carries one stable executable identity and one model-visible contract, so the runtime can schedule it and the student can choose it.

This specification defines the reference profile commands and the contract for defining new wire types. The scheduling and transaction semantics that all commands obey are specified in `DS002-sop-lang-core.md`. The container commands appear here in summary form and are specified in detail in `DS005-containers.md`.

## Core Content

### The predefined vocabulary

The standard library is deliberately biased toward orchestration, deterministic delegation, explicit neural calls, and typed state. Ordinary domain operations belong in JavaScript or in installable `.mjs` wire types.

| Command | Purpose | State and effect model |
| --- | --- | --- |
| `input` | Bind a value supplied by the wrapper, such as the current problem, chunk, or runtime parameter. | Immutable for one request or declared snapshot. |
| `literal` | Produce a literal scalar, JSON value, or text body. | Pure. |
| `jsEval` | Execute JavaScript over declared `$wire` dependencies in an isolated realm; may also stage graph or container transactions through the runtime API. | Pure unless it explicitly stages effects; bounded by the JavaScript deadline and charged cumulatively. |
| `modelCall` | Invoke the configured neural model for a local semantic judgment or generation step. | Explicit non-deterministic neural effect, fully logged. |
| `container` | Declare a typed persistent collection and its schema and identity policy. | Structural state declaration. |
| `containerAdd` | Stage one or more new records for a target container. | Batched container patch. |
| `containerUpsert` | Stage keyed inserts or replacements under a declared merge policy. | Batched container patch. |
| `containerRemove` | Stage deletion or tombstone operations under an explicit identity contract. | Batched container patch. |
| `containerFilter` | Define a pure derived view of a source container while retaining provenance. | Pure, and invalidated when source or predicate dependencies change. |

`input` wires are normally injected by the wrapper rather than invented by the student. A problem call may bind `problem`, `sourceChunk`, `requestedOutputSchema`, or a selected state projection. The model sees their names and contracts in the control plane, which prevents a generated circuit from smuggling source text into program syntax and keeps the boundary between data and executable code explicit.

`literal` is useful for constants and small structured values. Large source documents are not embedded as literals inside generated programs. They remain in a source store and are referenced by input wires or source identifiers, which avoids duplicating large text inside the circuit and keeps provenance stable.

`jsEval` is the universal deterministic escape hatch. It supports ordinary JavaScript data structures, numbers, strings, arrays, objects, and maps or sets when the runtime serialization profile permits them, plus small algorithms. The student is trained to prefer code whenever the remaining problem is mechanical: sorting records by timestamp, computing a median, joining rows by identifier, finding connected components, validating a JSON object, or serializing an answer.

The reference implementation runs every JavaScript body in an isolated guest realm: dependency values arrive as copies through the versioned value profile, generated code cannot reach the host process or the module system, and the `circuit` parameter is a facade whose operations are replayed onto the real transaction after the call. Execution is bounded, so a nonterminating body ends as a structured `budget_exceeded` outcome instead of blocking the runtime. Filter predicates run in the same isolated realm. The research semantics do not depend on pretending JavaScript is less expressive than it is, and they do not depend on a deployment sandbox either: the isolation makes a generated program unable to mutate runtime state outside its declared effects.

`modelCall` makes recursive neural reasoning explicit. A wire body contains the local instruction, the relevant dependency values, and optionally a constrained output schema. Instruction text is prose rather than code, so its dependency analysis reads a `$name` token wherever it appears and an apostrophe never hides an input. A summarization circuit may use model calls for claim extraction or paraphrasing while using JavaScript for coverage accounting. A novelty circuit may use retrieval and deterministic overlap metrics first and a neural judge only on remaining candidate comparisons. Every model invocation is a visible cost center that can be ablated, and its trace entry records the definition hash and the dependency value hashes that exact replay validates.

Container commands are part of the standard vocabulary because persistent typed context is a central research object rather than an application-specific convenience. They are implemented through the same extension interface as every other command, so the kernel needs no special hard-coded scheduling paths beyond the generic effect and invalidation contracts. A container read is recognized in declared form, such as the `source` of a `containerFilter`, and in ordinary value form, such as a `jsEval` or `modelCall` body reading `$claims`; both activate the same contribution and invalidation behavior, and a filter source may itself be a derived view so filters compose as ordinary dependency chains.

The standard vocabulary stays small enough for the student to learn its semantics thoroughly. Search, SQL, theorem proving, vector retrieval, source fetching, paraphrasing, embedding, domain-specific scoring, and external APIs are installed as additional wire types. That separation is essential to the claim that the model orchestrates capabilities described at runtime instead of memorizing a closed DSL.

### Wire type module structure

[Every additional command is implemented by an ECMAScript module.](wiki.html#definition-wire-type) The relative module path may determine the command name: a file at `wires/text/paraphrase.mjs` can expose `text.paraphrase`, and a file placed directly at `wires/paraphrase.mjs` exposes `paraphrase`. Namespaces are not invented merely to classify commands.

A reference module exports a `wireType` object with three layers: a manifest that may be shown to the model, an analyzer and validator used by the compiler, and an executor used by the runtime.

```js
export const wireType = {
  manifest: {
    name: "text.paraphrase",
    version: "1.0.0",
    summary: "Rewrite supplied text while preserving specified facts and constraints.",
    whenToUse: "Use when wording must change but semantic content is already known.",
    whenNotToUse: "Do not use to discover facts or perform arithmetic.",
    bodyFormat: "text",
    syntax: "@out text.paraphrase\n$input\n<rewrite instruction>",
    inputContract: {
      requiredDependencies: ["text-like value"],
      notes: "All referenced values must appear as $wire dependencies."
    },
    outputSchema: { "type": "string" },
    effectClass: "neural",
    determinism: "not_guaranteed",
    examples: [
      {
        source: "@short text.paraphrase\n$draft\nMake this concise without dropping qualifications.",
        explanation: "Uses an existing draft as the value dependency."
      }
    ]
  },

  analyze({ body, parser }) {
    return parser.findValueReferences(body);
  },

  validate({ body, capabilities }) {
    return { ok: true };
  },

  async execute(ctx) {
    return ctx.models.paraphrase({
      body: ctx.body,
      values: ctx.values,
      budget: ctx.budget
    });
  }
};
```

[The manifest is part of the runtime capability catalog](wiki.html#definition-capability-catalog) presented to the planner, not documentation for humans alone. It is concise, operational, and unambiguous. It states the command name and version, what the command does, when it should and should not be used, the accepted body form, how dependencies are referenced, the output contract, the effect class, determinism, and one or two canonical examples. A vague description such as "processes text intelligently" is unacceptable because the student cannot make a reliable planning decision from it.

The analyzer is equally important. Scheduling is sound only when the runtime knows which values are required before execution. A command that uses the generic SOP Lang reference syntax delegates to the default reference parser. A specialized command implements a structured body language and returns dependencies from parsed fields. The analyzer never inspects runtime values to discover dependencies after execution has begun, and dynamic dependency creation belongs to graph metaprogramming and a new revision.

The validator checks body syntax and static constraints before execution. An SQL command may reject multiple statements, a search command may require a query string and a named index, and a domain solver may require a declared schema. Validation errors are compilation failures, not natural-language warnings.

A declared data contract is validated fail-closed. The runtime publishes the supported JSON Schema profile with its version, and a schema that uses a keyword, a type name, or a constraint form outside it is rejected as `unsupported_schema` before any record or output is accepted, rather than being silently ignored.

The executor receives immutable resolved dependency values, the original body, declared budgets, versioned resources, and only the runtime APIs [permitted by the effect class](wiki.html#definition-effect-class). A pure command cannot redefine wires or update containers. A container patch command receives the staging API but not arbitrary external write access. A graph-metaprogramming command may stage structural changes. This capability-based execution contract prevents the scheduler from assuming that two commands are parallel-safe merely because their current data dependencies do not intersect.

### Versioning and conformance

The manifest and the executable code are versioned together. The trace records the implementation hash. If a description says that a command sorts ascending while the code sorts descending, the experiment is invalid regardless of how well the student follows the description. Automated conformance tests generate sample inputs from the declared schema and check basic relationships between manifest claims and execution.

Training exposes the student to varying capability catalogs. Some examples rename semantically equivalent tools with random identifiers and provide only the manifest. Other examples withhold a wire type entirely until evaluation. Success on unseen commands is especially informative because it shows that the model interprets tool descriptions and composes them instead of memorizing SOP Lang token sequences.

### Rationale and boundaries

Uniform dependency and effect contracts are what let a small model orchestrate commands it has never seen. The cost is that each command must carry an accurate analyzer, because a wrong dependency read makes the schedule unsound, and an accurate validator, because a rejected body must fail as a compilation error rather than surface as a runtime surprise.

### Reference implementation state

The reference profile implements the full standard vocabulary in `wires/standard/`. `runtime/registry.mjs` provides case-insensitive command lookup, and every registered command exposes a manifest through `registry.manifests()` for the capability catalog. A command declares `effectClass`, and a command that stages effects conditionally declares them in `mayStage`, which is how `jsEval` keeps its pure default while it is allowed to expand the circuit or stage a container patch. A staged structural transaction publishes only when the wire calls `circuit.commit`; an uncommitted transaction is rejected as a validation failure.

An installer registers an additional command by calling `registry.register({ name, version, effectClass, manifest, analyze, validate, execute })`. Command names resolve case-insensitively, and the registry keeps the canonical spelling that the trace and the catalog use.

The standard vocabulary deliberately does not include a general conditional or loop construct. Local conditionality belongs in `jsEval`, and structural conditionality belongs to the metaprogramming API in `DS002-sop-lang-core.md`. The vocabulary also does not define command-specific scheduling exceptions: every command is scheduled through the same effect and invalidation rules.
