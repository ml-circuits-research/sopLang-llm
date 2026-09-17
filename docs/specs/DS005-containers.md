---
title: DS005-containers
summary: Defines the typed persistent container commands of SOP Lang, the table, set, and sequence collection semantics, patch-based batched commits, identity and merge policies, tombstones, derived views, and invalidation rules.
---

## Introduction

Long-document reasoning needs state that is more structured than a list of chunks and less brittle than a succession of prose summaries. [SOP Lang treats containers as first-class wire values](wiki.html#definition-container) with explicit schemas, identity policies, provenance, and revision semantics. A container is close to a table or collection in an ordinary data system, and it participates directly in the circuit dependency graph: downstream wires depend on a specific container revision, and updates invalidate those downstream computations in a defined way.

This specification defines the container commands declared in `DS004-wire-types.md`. The epoch and transaction semantics they rely on are specified in `DS002-sop-lang-core.md`. How compiled context plans and fills containers is specified in `DS006-context-adapter.md`.

## Core Content

### Collection kinds

The reference profile supports three collection semantics because they cover the intended use cases without introducing a large object model.

A table is a collection of JSON-like records governed by a record schema and, optionally, primary or candidate keys. A set is a collection whose membership is defined by a stable identity function or canonical hash. A sequence is an ordered collection whose order is semantically meaningful, such as a chronology of events, a sequence of argument moves, or the order of passages in a narrative.

A graph is not a primitive container type. Relations are ordinary tables whose fields act as foreign keys into entity tables, which keeps storage and validation simple while allowing graph algorithms in `jsEval`.

A typical planning result for a novel declares its containers and schemas before ingestion:

```sop
@characters container
kind: table
primaryKey: id
schema:
  type: object
  required: [id, name, sourceSpans]
  properties:
    id: { type: string }
    name: { type: string }
    aliases: { type: array, items: { type: string } }
    traits: { type: array, items: { type: string } }
    sourceSpans: { type: array }

@events container
kind: sequence
schema:
  type: object
  required: [id, actors, action, sourceSpans]
  properties:
    id: { type: string }
    actors: { type: array, items: { type: string } }
    placeId: { type: [string, "null"] }
    action: { type: string }
    temporalHint: { type: [string, "null"] }
    causes: { type: array, items: { type: string } }
    consequences: { type: array, items: { type: string } }
    sourceSpans: { type: array }
```

The syntax above is a readable profile and the implementation may normalize the body into a JSON schema object. What matters is that the container definition is explicit and available to both the runtime and the model. After the planning call, these definitions become part of the control plane for chunk ingestion. The source chunk remains data, while the schema is a system capability and contract.

### Patch-based updates and epoch-level commits

Container updates need careful semantics because a naive implementation would turn every appended record into a graph rewrite and restart the topological scheduler constantly. `containerAdd`, `containerUpsert`, and `containerRemove` therefore do not mutate the target container when they execute. [They produce validated `ContainerPatch` objects](wiki.html#definition-container-patch) against the container revision visible at the start of the epoch. All compatible patches that become ready during the epoch are computed in parallel. At the epoch boundary the runtime groups patches by target container, validates conflicts, orders them deterministically, and commits them as one new container revision.

A 500-chunk book produces 500 independent `containerAdd` wires for events. The compiled circuit evaluates all of these additions in the same ingestion epoch because none needs another's result. For a table or set the commit applies a deterministic key policy. For a sequence, completion order must not define semantic order because parallel scheduling would make it nondeterministic. Every item carries an ordering key such as source document order, chunk order, source offset, and local index, and the merged sequence is sorted by that key. The container revision increments once after the batch, and downstream readers are invalidated once.

A patch records the target container, parent revision, operation, items, source wire, schema version, and deterministic ordering metadata. Multiple patches against the same parent may commit together when their merge policies do not conflict.

A grouped commit is atomic. Every patch in the group is applied to a working copy of the target container, and the working copies replace the live state only after the whole group has been accepted. A rejected patch therefore leaves records, tombstones, history, and revision counters unchanged, and a rejected candidate cannot contaminate a reused store.

A patch may be entirely literal when the model extracted the records while reading a chunk:

```sop
@chunk042_events containerAdd
target: events
items:
  - id: event_042_01
    actors: [char_hamlet]
    placeId: place_castle
    action: "Hamlet confronts the implication of the apparition's claim."
    temporalHint: "after the encounter"
    causes: [event_017_03]
    consequences: []
    sourceSpans:
      - { sourceId: bookA, chunkId: chunk042, start: 830, end: 1011 }
```

A patch may also depend on a computed wire, in which case it executes after that wire is available and still stages its update for the epoch commit:

```sop
@normalizedRows jsEval
return $rawRows.map(normalizeRow);

@addNormalized containerAdd
target: observations
items: $normalizedRows
```

### Identity, merge policy, and history

`containerUpsert` requires a declared identity rule. The default behavior rejects a conflicting replacement instead of silently selecting a winner. An explicit merge policy may allow replacement when the source record version is the same, merging non-conflicting fields, or creating a competing assertion instead of overwriting. For semantic information extracted from books, preserving competing assertions is often preferable: two passages that describe a character differently are not collapsed merely because they share an identifier. The container keeps both claims with provenance, and [a later canonicalization wire constructs a derived view](wiki.html#definition-canonical-view).

`containerRemove` normally creates a tombstone or a new revision rather than erasing history so that replay and audit remain possible. In long-lived compiled contexts, deletion may mean that a record is not part of the current canonical view rather than that it never existed. The distinction matters when later analyses need to understand how the representation evolved.

Every accepted item is recorded in an append-only history together with the record it replaced, its identity, its source wire, and the revision it produced, so an earlier assertion and its source spans stay retrievable by revision after a replacement or a merge, while the canonical view is free to change. A table rejects a duplicate primary key, and a set is defined by membership identity: the identity is canonical or declared, and it governs membership within a patch, across grouped patches, and across revisions, so a repeated member never inflates a downstream count.

### Derived views and invalidation

[A filtered container is a derived wire](wiki.html#definition-container-filter) whose value depends on a source container revision and on any additional predicate dependencies. It preserves provenance rather than returning bare copied objects.

```sop
@highConfidenceClaims containerFilter
source: $claims
predicate:
  return row.confidence >= $threshold && row.status !== "superseded";
```

The filter command analyzes `$claims` and `$threshold` as value dependencies. Its output is a materialized view with references to source record identities and the source revision it was computed from. When either the source container or the threshold changes, the view becomes dirty, and downstream wires that depend on the view become dirty transitively.

The rule holds in composed cases. A filter that selects legal exceptions whose effective date overlaps a query period is followed by a JavaScript wire that groups them by jurisdiction. When an ingestion correction adds a previously missed exception, the base container receives a new revision, the filter is invalidated, and the grouping wire is invalidated in turn. The runtime may later implement incremental view maintenance that applies only the delta, but the reference semantics recompute the view from the new source revision, and an optimization is acceptable only when it produces the same result and trace-equivalent provenance.

A filter source may also be another derived view, so a chain such as base container, first filter, second filter, and scalar metric is a chain of ordinary value dependencies. The reference implementation binds the value of the source wire, keeps the base container name and the base revision as the provenance of the derived view, and invalidates every link of the chain from the base commit. An ordinary value read of a container, such as a `jsEval` body reading `$claims`, is scheduled and invalidated exactly like a declared container read.

A subtle case occurs when a container revision changes but the filtered result does not. The conservative implementation still recomputes the filter. After recomputation, if the materialized view has the same canonical content hash and provenance identity, downstream pure values may remain cache-valid under an optimization. The reference implementation applies the simpler transitive invalidation rule first and adds the content-hash shortcut only after equivalence tests pass.

Field-level dependency tracking is a further refinement: a view that filters only on `status` and projects only `id` and `text` need not logically change when an unrelated `editorialNote` field changes. The first implementation uses coarse container-revision invalidation because it is easier to audit, and the cost of conservative invalidation is measured before deciding whether field-level tracking is worthwhile.

Filters compose as ordinary dependency chains. Updating the base container invalidates the first filter, then the second, and then any scalar metric computed from the second. Nothing special is required beyond correct version propagation.

### Metaprogramming interaction

A `jsEval` wire may decide that a new container or view is required and use `circuit.addWire` to define it. That is a structural transaction and produces a new circuit revision. Ordinary additions to an existing container use container patches and are batched within the current epoch. The distinction keeps row insertion from being treated as a graph rewrite and gives the student a clear planning rule: container mutation commands handle data, and the circuit API handles changes to computational structure.

### Container design for summarization

Containers support controlled summarization and anti-smoothing evaluation. A summary is not generated directly from the raw book when the experiment tests preservation of important claims. The system compiles claims, exceptions, events, positions, and evidence into containers, marks which records are mandatory for the requested summary policy, generates prose, and measures coverage against those records. The container state serves as working memory and as evaluation substrate at the same time.

Selection, coverage, and wording are separate computations, and the acceptance gates follow that separation. Four questions are answered in order and reported separately: does the compiled inventory contain the important source material (inventory recall), does the importance policy select the right subset from that inventory (selection recall), does the generated prose represent the selected obligations (realization recall), and does the summary invent obligations that the source does not support (hallucination and false preservation). A single preservation number is not accepted as evidence that summarization works, because it hides which of those stages lost information.

A repair is accepted only when the full obligation set is re-audited after the repair. A repair that adds one previously missing obligation but drops another, or that strengthens a qualifier while losing an exception, fails: repair is measured for cost and for side effects, not for the single obligation it targeted. Preservation checks require identity and relation correctness rather than keyword overlap, because a summary may name an exception while attaching it to the wrong rule, and they are reported per obligation category (rare-critical facts, exceptions, qualifiers, minority positions) with the obligation weights that produced the score.

### Rationale and boundaries

Batched commits are both an optimization and a semantic simplification: they make parallel ingestion deterministic and invalidate downstream readers once per batch. The cost is that a patch is visible only after the epoch barrier, so a wire that needs the result of its own addition must read the container in a later epoch, which keeps causality visible in the trace.

### Reference implementation state

The reference implementation stores containers in `runtime/containers.mjs`. A container declares a kind of `table`, `set`, or `sequence`, an optional `primaryKey` or `identity`, an optional schema, and a `mergePolicy`. Mutation commands stage patches against the current revision, and `ContainerStore.commit` groups them, applies them in deterministic order, increments the revision once per group, and rejects a patch whose parent revision is not current.

A wire that reads a container depends on that container's revision and is invalidated after every commit that targets it, and the invalidation reaches the downstream wires transitively. A container declaration wire reads the container it declares so the declaration value refreshes at the next epoch and the snapshot returned to a caller reflects the committed revision. Declarations execute before the patches of an epoch, and a writer contributes the declaration of its target to the same epoch even when nothing reads the container.

`containerFilter` evaluates its predicate with the `row` binding in the isolated guest realm and treats any other `$name` in the predicate as a value dependency. The view it returns records the source container name and the source revision, so downstream results can be traced to the revision they observed. Stored records are frozen and a snapshot or a view is a deep copy, so no consumer can mutate container state outside a committed patch.

The reference profile deliberately does not offer destructive normalization. Canonical views are derived wires, and authoritative records remain append-only with source spans. This boundary exists because reconciliation can favor the most frequent interpretation and erase minority evidence, and the project measures preservation rather than assuming it.
