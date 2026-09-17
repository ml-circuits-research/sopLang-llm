/**
 * Transactional circuit API.
 *
 * A JavaScript wire stages structural changes through this API. Operations are
 * buffered and validated at the epoch boundary: names are checked, command
 * availability is resolved, dependencies are re-analyzed, acyclicity is
 * verified, and budgets are charged before the transaction becomes visible.
 * Newly created wires never run inside the schedule that created them.
 *
 * A transaction is identified by an intent hash over its parent revision, its
 * origin wire, its structural read set, and its operations. Replaying the same
 * intent against the same parent revision is idempotent and returns the
 * recorded commit result without repeating its effects; reusing an identifier
 * with different content is a conflict, and a transaction whose operations were
 * never committed never publishes anything.
 *
 * The API exposes graph mutation but no hidden value store, so values continue
 * to enter JavaScript only through declared `$wire` dependencies.
 */

import { createNode, analyzeNode } from './graph.mjs';
import { assertWireName } from './identifiers.mjs';
import { SopError } from './errors.mjs';
import { hashDefinition, hashValue } from './hashing.mjs';

const OPERATION_METHODS = Object.freeze({
  addWire: 'addWire',
  redefineWire: 'redefineWire',
  invalidateWire: 'invalidateWire',
  invalidateDownstream: 'invalidateDownstream'
});

export class CircuitTransaction {
  constructor({ circuitRevision, originWire, parentRevision, epoch, knownWires = new Set() }) {
    this.transactionId = `tx-${parentRevision}-${epoch}-${originWire}`;
    this.parentRevision = parentRevision ?? circuitRevision;
    this.originWire = originWire;
    this.epoch = epoch ?? 0;
    this.knownWires = knownWires;
    this.operations = [];
    this.structuralReads = { names: new Set(), prefixes: new Set() };
    this.committed = false;
    this.commitKey = null;
    this.commitResult = undefined;
  }

  addWire(name, definition = {}) {
    return this.#stage('addWire', name, definition);
  }

  redefineWire(name, definition = {}) {
    return this.#stage('redefineWire', name, definition);
  }

  invalidateWire(name, definition = {}) {
    return this.#stage('invalidateWire', name, definition);
  }

  invalidateDownstream(name, definition = {}) {
    return this.#stage('invalidateDownstream', name, definition);
  }

  getDefinition(name) {
    this.noteStructuralReads([String(name)], []);
    return { name: String(name), known: this.knownWires.has(String(name)) };
  }

  listDefinitions(filter = {}) {
    const prefix = filter.prefix ?? '';
    this.noteStructuralReads([], [String(prefix)]);
    return { prefix };
  }

  /**
   * Record the structural read set of an execution. The runtime invalidates the
   * reading wire when a definition it observed changes, when a name matching a
   * listed prefix appears or disappears, or when a read definition is
   * redefined.
   */
  noteStructuralReads(names = [], prefixes = []) {
    for (const name of names) {
      this.structuralReads.names.add(String(name));
    }
    for (const prefix of prefixes) {
      this.structuralReads.prefixes.add(String(prefix));
    }
  }

  commit({ key, result } = {}) {
    this.committed = true;
    this.commitKey = key === undefined ? null : key;
    this.commitResult = result;
    return result;
  }

  intentHash() {
    return hashValue({
      parentRevision: this.parentRevision,
      originWire: this.originWire,
      structuralReads: {
        names: [...this.structuralReads.names].sort(),
        prefixes: [...this.structuralReads.prefixes].sort()
      },
      operations: this.operations.map((operation) => ({
        operation: operation.operation,
        name: operation.name,
        definition: operation.definition
      }))
    });
  }

  #stage(operation, name, definition) {
    assertWireName(name, 'wire name');
    this.operations.push({ operation, name, definition: { ...definition } });
    return { operation, name };
  }
}

/**
 * Replay the result of an isolated guest execution onto the host transaction.
 * Operations are staged on the transaction exactly as if the host code had
 * called the API directly, so commit gating and validation stay in one place.
 */
export function applyCircuitResult({ transaction, result, wire, recordStructuralReads = null }) {
  if (result.structuralReads.length > 0 || result.listReads.length > 0) {
    transaction.noteStructuralReads(result.structuralReads, result.listReads);
    if (recordStructuralReads !== null) {
      recordStructuralReads(result.structuralReads, result.listReads);
    }
  }
  for (const operation of result.operations) {
    const method = OPERATION_METHODS[operation.operation];
    if (method === undefined) {
      throw new SopError('unsupported_operation', `Unsupported circuit operation "${operation.operation}".`, {
        wire,
        operation: operation.operation
      });
    }
    transaction[method](operation.name, operation.definition);
  }
  if (result.committed) {
    transaction.commit({ key: result.commitKey ?? undefined, result: result.value });
  }
  return transaction;
}

export function validateTransaction({ transaction, registry, budget, currentWires }) {
  const created = [];
  const redefined = [];
  const invalidated = [];

  for (const operation of transaction.operations) {
    if (budget !== undefined) {
      budget.charge('transactionOps', 1, { wire: operation.name });
    }
    const existing = currentWires.get(operation.name) ?? null;
    const command = registry.require(operation.definition.command ?? existing?.command?.name);

    if (operation.operation === 'addWire') {
      if (existing !== null) {
        const proposed = hashDefinition({
          command: command.name,
          commandVersion: command.version,
          body: operation.definition.body ?? ''
        });
        if (proposed === existing.definitionHash) {
          // An identical retry of an already applied addition is idempotent: the
          // definition is unchanged, so the transaction publishes no new effect.
          created.push({ ...operation, command, noop: true });
          continue;
        }
        throw new SopError(
          'duplicate_wire',
          `Wire "${operation.name}" already exists in revision ${transaction.parentRevision} with a different definition.`,
          { wire: operation.name, definitionHash: proposed, existingDefinitionHash: existing.definitionHash }
        );
      }
      created.push({ ...operation, command, noop: false });
      continue;
    }

    if (operation.operation === 'redefineWire') {
      if (existing === null) {
        throw new SopError('unknown_wire', `Wire "${operation.name}" does not exist and cannot be redefined.`, {
          wire: operation.name
        });
      }
      const expected = operation.definition.expectedDefinitionHash;
      if (expected !== undefined && expected !== null && expected !== existing.definitionHash) {
        throw new SopError(
          'stale_definition',
          `Wire "${operation.name}" was redefined against an outdated definition hash.`,
          { wire: operation.name, expectedDefinitionHash: expected, actualDefinitionHash: existing.definitionHash }
        );
      }
      redefined.push({ ...operation, command, previousDefinitionHash: existing.definitionHash });
      continue;
    }

    if (operation.operation === 'invalidateWire' || operation.operation === 'invalidateDownstream') {
      if (existing === null) {
        throw new SopError('unknown_wire', `Wire "${operation.name}" does not exist and cannot be invalidated.`, {
          wire: operation.name
        });
      }
      invalidated.push({ ...operation, command, previousDefinitionHash: existing.definitionHash });
      continue;
    }

    throw new SopError('unsupported_operation', `Unsupported circuit operation "${operation.operation}".`, {
      operation: operation.operation
    });
  }

  return {
    created,
    redefined,
    invalidated,
    intentHash: transaction.intentHash(),
    parentRevision: transaction.parentRevision,
    noops: created.filter((entry) => entry.noop).map((entry) => entry.name)
  };
}

export function materializeTransaction({ validated, factory }) {
  const additions = [];
  let createdAt = factory.nextCreatedAt();

  const build = (entry, kind) => {
    const node = createNode({
      name: entry.name,
      command: entry.command,
      body: entry.definition.body ?? '',
      line: 0,
      sourceName: 'metaprogramming',
      createdAt
    });
    createdAt += 1;
    analyzeNode(node);
    additions.push({ kind, node });
  };

  for (const entry of validated.created) {
    if (entry.noop) {
      additions.push({ kind: 'noop', name: entry.name, reason: 'already applied' });
      continue;
    }
    build(entry, 'add');
  }
  for (const entry of validated.redefined) {
    build(entry, 'redefine');
  }
  for (const entry of validated.invalidated) {
    additions.push({
      kind: entry.operation === 'invalidateDownstream' ? 'invalidate_downstream' : 'invalidate',
      name: entry.name,
      reason: entry.definition.reason ?? null
    });
  }

  factory.setNextCreatedAt(createdAt);
  return additions;
}

export function requireCommittedTransaction(transaction, wire) {
  if (transaction.operations.length > 0 && !transaction.committed) {
    throw new SopError(
      'validation_error',
      `Wire "${wire}" staged ${transaction.operations.length} circuit operation(s) without calling circuit.commit.`,
      { wire, operations: transaction.operations.length }
    );
  }
}
