import { collectClosure, topologicalOrder, expandContainerWriters, linkContainerReads, downstreamConsumers, isContainerDeclaration } from './graph.mjs';
import { assertStagingPermitted } from './security.mjs';
import { recordOutcome, recordFailure, recordTransaction } from './trace.mjs';
import { SopError, toErrorInfo } from './errors.mjs';
import { validateValueAgainstSchema } from './schema.mjs';
import { CircuitTransaction, validateTransaction, materializeTransaction, requireCommittedTransaction } from './metaprogramming.mjs';
import { hashValue } from './hashing.mjs';
import { copyValue } from './values.mjs';

/**
 * Epoch and wire execution for the SOP Lang runtime.
 *
 * The executor owns the epoch loop described in DS002: it collects the active
 * closure of the requested outputs, schedules a deterministic topological
 * order, executes wires over immutable snapshots, commits staged container
 * patches at the epoch barrier, applies buffered structural transactions, and
 * invalidates the wires a commit or a redefinition affects. The kernel owns the
 * public run lifecycle and delegates execution here.
 *
 * A wire failure is recorded with its definition, dependency, and command
 * identity before the run ends, and a budget exhaustion is reported as a
 * partial outcome with the progress that precedes it.
 */

export async function executeEpochs(runtime, { state, trace, outputs, limits, outputSchema, controlRoots = [] }) {
  while (true) {
    limits.charge('epochs', 1, {});
    state.epoch = limits.usage.epochs;
    trace.circuitRevision = state.revision;

    const closure = collectClosure(state.graph, [...outputs, ...controlRoots]);
    const { active, pending } = expandContainerWriters(state.graph, {
      ...closure,
      roots: [...outputs, ...controlRoots]
    });
    const order = topologicalOrder(state.graph, active, { pending });

    state.epochPatchMark = state.stagedPatches.length;
    const deferredReaders = new Set();
    // Declarations execute first inside an epoch: a patch targets a container
    // that must already exist, and a declaration reads the revision the epoch
    // started from.
    for (const name of order) {
      const node = state.graph.get(name);
      if (node.isInput || !isContainerDeclaration(node)) {
        continue;
      }
      if (state.values.has(name) && !state.dirty.has(name)) {
        continue;
      }
      if (runtime.mustDeferForCommit({ node, state, skipped: deferredReaders })) {
        deferredReaders.add(name);
        continue;
      }
      const startedAt = runtime.now();
      try {
        await executeWire(runtime, { node, state, limits, trace, epoch: state.epoch, startedAt });
      } catch (error) {
        return runtime.wireFailure({ error, node, state, trace, limits, outputs, startedAt });
      }
    }
    for (const name of order) {
      const node = state.graph.get(name);
      if (node.isInput) {
        bindInput({ node, state });
        continue;
      }
      if (state.values.has(name) && !state.dirty.has(name)) {
        continue;
      }
      if (runtime.mustDeferForCommit({ node, state, skipped: deferredReaders })) {
        deferredReaders.add(name);
        continue;
      }
      const startedAt = runtime.now();
      try {
        await executeWire(runtime, { node, state, limits, trace, epoch: state.epoch, startedAt });
      } catch (error) {
        return runtime.wireFailure({ error, node, state, trace, limits, outputs, startedAt });
      }
    }

    const epochPatches = state.stagedPatches.slice(state.epochPatchMark);
    let invalidatedByCommit = false;
    if (epochPatches.length > 0) {
      const committed = state.containers.commit(epochPatches);
      for (const entry of committed) {
        trace.record({
          epoch: state.epoch,
          type: 'container_commit',
          wire: `container:${entry.container}`,
          container: entry.container,
          revision: entry.revision,
          patches: entry.patches,
          history: state.containers.historyOf(entry.container, { revision: entry.revision }).length
        });
      }
      invalidatedByCommit = markContainerDependentsDirty(state, committed);
    }

    if (state.stagedTransactions.length > 0) {
      const transactions = state.stagedTransactions;
      state.stagedTransactions = [];
      const applied = applyTransactions(runtime, { state, limits, transactions, trace });
      if (applied.changed) {
        continue;
      }
    }

    if (deferredReaders.size > 0 || invalidatedByCommit) {
      continue;
    }

    const unresolvedWires = [...active.keys()].filter(
      (name) => !state.values.has(name) && (pending.get(name)?.length ?? 0) > 0
    );
    const missingValues = new Map();
    for (const name of unresolvedWires) {
      for (const dependency of pending.get(name) ?? []) {
        missingValues.set(dependency, name);
      }
    }

    const unresolvedOutputs = outputs.filter((name) => !state.values.has(name));
    if (missingValues.size > 0 || unresolvedOutputs.length > 0) {
      return {
        status: 'partial',
        code: 'unresolved_dependencies',
        error: {
          code: 'unresolved_dependencies',
          message:
            missingValues.size > 0
              ? `The run ended without values for: ${[...missingValues.keys()].sort().join(', ')}.`
              : `The run ended without values for: ${unresolvedOutputs.join(', ')}.`,
          missing: [...missingValues.entries()].map(([dependency, wire]) => ({ dependency, wire }))
        },
        outputs: Object.fromEntries(
          outputs
            .filter((name) => state.values.has(name))
            .map((name) => [name, copyValue(state.values.get(name), { role: `output "${name}"` })])
        ),
        epochs: state.epoch,
        trace: trace.toJSON(),
        budgets: limits.toJSON(),
        containers: state.containers.definitions()
      };
    }

    const outputValues = {};
    for (const name of outputs) {
      outputValues[name] = copyValue(state.values.get(name), { role: `output "${name}"` });
    }

    if (outputSchema !== null && outputSchema !== undefined) {
      const validation = validateValueAgainstSchema(outputValues[outputs[0]], outputSchema);
      if (!validation.ok) {
        throw new SopError(
          validation.code ?? 'validation_error',
          `The output does not satisfy the declared schema: ${validation.message}`,
          { path: validation.path }
        );
      }
    }

    limits.charge('outputBytes', Buffer.byteLength(JSON.stringify(outputValues), 'utf8'), {});

    return {
      status: 'completed',
      code: 'completed',
      outputs: outputValues,
      epochs: state.epoch,
      trace: trace.toJSON(),
      budgets: limits.toJSON(),
      containers: state.containers.definitions()
    };
  }
}

export function mustDeferForCommit({ node, state, skipped }) {
  // A reader may run inside the epoch as long as the containers it reads have no
  // patch staged in this epoch, because it then observes the committed revision.
  // A reader that depends on a deferred reader also defers, so the whole
  // downstream chain runs in the next epoch over the new revision.
  for (const dependency of node.dependencies.values) {
    if (skipped.has(dependency)) {
      return true;
    }
  }
  for (const dependency of node.readsContainers) {
    if (skipped.has(dependency)) {
      return true;
    }
  }
  if (node.readsContainers.size === 0) {
    return false;
  }
  const uncommitted = state.stagedPatches.slice(state.epochPatchMark ?? 0);
  return uncommitted.some((patch) => node.readsContainers.has(patch.target));
}

export function bindInput({ node, state }) {
  if (!state.inputs.has(node.name)) {
    throw new SopError('missing_input', `Input wire "${node.name}" has no value bound by the wrapper.`, {
      wire: node.name
    });
  }
  state.values.set(node.name, state.inputs.get(node.name));
  state.dirty.delete(node.name);
}

export async function executeWire(runtime, { node, state, limits, trace, epoch, startedAt }) {
  const values = {};
  for (const dependency of node.dependencies.values) {
    values[dependency] = state.inputs.has(dependency) ? state.inputs.get(dependency) : state.values.get(dependency);
  }
  for (const containerName of node.dependencies.containerReads) {
    if (state.containers.has(containerName)) {
      values[containerName] = state.containers.snapshot(containerName);
    } else if (state.values.has(containerName)) {
      // A derived view such as a second-stage filter reads the value of the wire
      // that produced it, not a store revision.
      values[containerName] = state.values.get(containerName);
    }
  }

  const epochPatchStart = state.stagedPatches.length;
  const transaction = new CircuitTransaction({
    circuitRevision: state.revision,
    originWire: node.name,
    parentRevision: state.revision,
    epoch,
    knownWires: new Set(state.graph.nodes.keys())
  });

  const context = runtime.createContext({ node, state, values, limits, transaction, trace, epoch });
  const value = await node.command.execute(context);
  const finishedAt = runtime.now();

  const staged = [];
  if (state.stagedPatches.length > epochPatchStart) {
    staged.push('container_patch');
  }
  if (transaction.operations.length > 0) {
    staged.push('structural_transaction');
  }
  assertStagingPermitted({ command: node.command, wire: node.name, staged });
  requireCommittedTransaction(transaction, node.name);
  if (transaction.operations.length > 0) {
    state.stagedTransactions.push(transaction);
  }
  copyStructuralReads(node, transaction);

  state.values.set(node.name, value);
  state.dirty.delete(node.name);
  state.outputHashes.set(node.name, hashValue(value));

  recordOutcome(trace, {
    epoch,
    wire: node.name,
    command: node.command.name,
    commandVersion: node.command.version,
    result: {
      value,
      error: null,
      definitionHash: node.definitionHash,
      dependencies: describeDependencies({ node, state })
    },
    startedAt,
    finishedAt
  });

  return value;
}

export function describeDependencies({ node, state }) {
  const described = [];
  for (const dependency of node.dependencies.values) {
    described.push({
      name: dependency,
      definitionHash: state.graph.get(dependency)?.definitionHash ?? null,
      outputHash: state.outputHashes.get(dependency) ?? null
    });
  }
  for (const containerName of node.readsContainers) {
    described.push({
      name: containerName,
      container: state.containers.has(containerName),
      revision: state.containers.has(containerName) ? state.containers.revisionOf(containerName) : null
    });
  }
  return described;
}

export function copyStructuralReads(node, transaction) {
  for (const name of transaction.structuralReads.names) {
    node.structuralReads.names.add(name);
  }
  for (const prefix of transaction.structuralReads.prefixes) {
    node.structuralReads.prefixes.add(prefix);
  }
}

export function markContainerDependentsDirty(state, committed) {
  const names = new Set(committed.map((entry) => entry.container));
  const changed = new Set();
  for (const node of state.graph.nodes.values()) {
    if (node.isInput) {
      continue;
    }
    let readsCommittedContainer = node.declaresContainer && names.has(node.name);
    if (!readsCommittedContainer) {
      for (const name of names) {
        if (node.readsContainers.has(name)) {
          readsCommittedContainer = true;
          break;
        }
      }
    }
    if (!readsCommittedContainer) {
      continue;
    }
    invalidateWire(state, node.name);
    changed.add(node.name);
  }
  return changed.size > 0;
}

export function applyTransactions(runtime, { state, limits, transactions, trace }) {
  let changed = false;
  for (const transaction of transactions) {
    const intentHash = transaction.intentHash();
    const previous = state.appliedTransactions.get(intentHash);
    if (previous !== undefined && previous.parentRevision === transaction.parentRevision) {
      // The same intent against the same parent revision is idempotent: its
      // effects are not repeated and its recorded result is reused.
      recordTransaction(trace, { transaction, intentHash, status: 'idempotent_replay', revision: previous.revision });
      continue;
    }
    const validated = validateTransaction({
      transaction,
      registry: runtime.registry,
      budget: limits,
      currentWires: state.graph.nodes
    });
    const additions = materializeTransaction({ validated, factory: factoryOf(state) });
    const effective = additions.filter((addition) => addition.kind !== 'noop');
    if (effective.length > 0) {
      state.revision += 1;
    }
    for (const addition of effective) {
      if (addition.kind === 'add' || addition.kind === 'redefine') {
        if (addition.kind === 'add') {
          limits.charge('createdWires', 1, { wire: addition.node.name });
        }
        state.graph.nodes.set(addition.node.name, addition.node);
        invalidateWire(state, addition.node.name);
      } else if (addition.kind === 'invalidate') {
        invalidateWire(state, addition.name);
      } else if (addition.kind === 'invalidate_downstream') {
        invalidateDownstream(state, addition.name);
      }
    }
    linkContainerReads(state.graph);
    invalidateStructuralReaders(state, effective);
    state.definitionSnapshot = { revision: null, text: null };
    state.appliedTransactions.set(intentHash, {
      parentRevision: transaction.parentRevision,
      revision: state.revision,
      commitResult: transaction.commitResult,
      commitKey: transaction.commitKey
    });
    recordTransaction(trace, {
      transaction,
      intentHash,
      status: validated.noops.length === transaction.operations.length ? 'idempotent_replay' : 'applied',
      revision: state.revision,
      noops: validated.noops
    });
    changed = changed || effective.length > 0;
  }
  return { changed };
}

/**
 * A wire that read a definition or listed a prefix is invalidated when a
 * definition it observed changes or when the set of names in a listed prefix
 * changes.
 */
export function invalidateStructuralReaders(state, additions) {
  for (const addition of additions) {
    if (addition.kind !== 'add' && addition.kind !== 'redefine') {
      continue;
    }
    for (const node of state.graph.nodes.values()) {
      if (node.isInput || node.name === addition.node.name) {
        continue;
      }
      if (node.structuralReads.names.has(addition.node.name)) {
        invalidateWire(state, node.name);
        continue;
      }
      for (const prefix of node.structuralReads.prefixes) {
        if (addition.node.name.startsWith(prefix)) {
          invalidateWire(state, node.name);
          break;
        }
      }
    }
  }
}

export function factoryOf(state) {
  if (state.factory === undefined) {
    let createdAt = state.graph.createdAt;
    state.factory = {
      nextCreatedAt: () => createdAt,
      setNextCreatedAt: (value) => {
        createdAt = value;
      }
    };
  }
  return state.factory;
}

export function invalidateWire(state, name) {
  state.dirty.add(name);
  state.values.delete(name);
  state.outputHashes.delete(name);
  invalidateDownstream(state, name);
}

export function invalidateDownstream(state, name) {
  const affected = downstreamConsumers(state.graph, name);
  for (const affectedName of affected) {
    state.dirty.add(affectedName);
    state.values.delete(affectedName);
    state.outputHashes.delete(affectedName);
  }
  return affected;
}

/**
 * The definition set of the current circuit revision, in the form the guest
 * realm reads it. The text is produced at most once per revision.
 */
export function definitionSnapshot(state) {
  if (state.definitionSnapshot.revision === state.revision) {
    return state.definitionSnapshot.text;
  }
  const entries = [];
  for (const node of state.graph.nodes.values()) {
    if (node.isInput) {
      continue;
    }
    entries.push({
      name: node.name,
      command: node.command.name,
      version: node.command.version,
      definitionHash: node.definitionHash,
      body: node.body
    });
  }
  const text = JSON.stringify(entries);
  state.definitionSnapshot = { revision: state.revision, text };
  return text;
}

export { toErrorInfo };
