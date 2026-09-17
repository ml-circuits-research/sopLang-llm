import { hashValue, canonicalJson } from './hashing.mjs';
import { toErrorInfo } from './errors.mjs';

/**
 * Execution trace.
 *
 * The trace records the circuit revision, epoch number, wire name, command
 * identity and version, definition hash, dependency identities, execution
 * interval, output hash, staged effects, transaction details, neural-call
 * metadata, replay provenance, and any error. The revision identifies the
 * structural state a value or a rejection belongs to, and the dependency
 * identities identify the exact values it was computed from, so replay and
 * audit can compare a computation with its record.
 *
 * Neural commands are treated as observations. In replay mode a recorded
 * generation is substituted only when the wire definition, the command
 * implementation, and the dependency value hashes all match, and the
 * substitution is recorded with the provenance of the entry it replayed.
 */

export class TraceLog {
  constructor({ circuitRevision = 0 } = {}) {
    this.circuitRevision = circuitRevision;
    this.entries = [];
  }

  record(entry) {
    const record = {
      circuitRevision: this.circuitRevision,
      epoch: entry.epoch ?? 0,
      ...entry
    };
    this.entries.push(record);
    return record;
  }

  neuralCalls() {
    return this.entries.filter((entry) => entry.type === 'neural_call');
  }

  values() {
    return this.entries.filter((entry) => entry.type === 'value');
  }

  errors() {
    return this.entries.filter((entry) => entry.type === 'error');
  }

  transactions() {
    return this.entries.filter((entry) => entry.type === 'transaction');
  }

  toJSON() {
    return {
      circuitRevision: this.circuitRevision,
      entries: this.entries
    };
  }
}

export function recordOutcome(log, { epoch, wire, command, commandVersion = null, result, startedAt, finishedAt }) {
  if (result.error !== null && result.error !== undefined) {
    return recordFailure(log, {
      error: result.error,
      epoch,
      wire,
      command,
      commandVersion,
      definitionHash: result.definitionHash ?? null,
      dependencies: result.dependencies ?? [],
      startedAt,
      finishedAt
    });
  }
  const entry = {
    epoch,
    wire,
    command,
    commandVersion,
    type: 'value',
    definitionHash: result.definitionHash,
    dependencies: result.dependencies ?? [],
    startedAt,
    finishedAt,
    outputHash: hashValue(result.value)
  };
  if (result.stagedEffects && result.stagedEffects.length > 0) {
    entry.stagedEffects = result.stagedEffects;
  }
  return log.record(entry);
}

/**
 * A rejected wire keeps the same identity fields as a successful one, plus the
 * structured error, so a dataset worker can audit why a candidate was rejected
 * without re-running it.
 */
export function recordFailure(log, { error, epoch = 0, circuitRevision = null, wire = null, command = null, commandVersion = null, definitionHash = null, dependencies = [], startedAt = null, finishedAt = null }) {
  const info = error !== null && error !== undefined && error.code !== undefined ? error : toErrorInfo(error);
  const entry = {
    epoch,
    type: 'error',
    code: info.code,
    message: info.message
  };
  if (info.details !== undefined) {
    entry.details = info.details;
  }
  if (wire !== null) {
    entry.wire = wire;
  }
  if (command !== null) {
    entry.command = command;
    entry.commandVersion = commandVersion;
  }
  if (definitionHash !== null) {
    entry.definitionHash = definitionHash;
  }
  if (dependencies.length > 0) {
    entry.dependencies = dependencies;
  }
  if (startedAt !== null) {
    entry.startedAt = startedAt;
    entry.finishedAt = finishedAt;
  }
  if (circuitRevision !== null) {
    entry.circuitRevision = circuitRevision;
  }
  return log.record(entry);
}

/**
 * A structural transaction is recorded with its intent hash, parent revision,
 * resulting revision, operations, structural read set, and commit state. The
 * intent hash and the parent revision are what make a retry auditable as an
 * idempotent replay rather than a duplicate effect.
 */
export function recordTransaction(log, { transaction, intentHash, status, revision, noops = [] }) {
  if (log === null || log === undefined) {
    return null;
  }
  return log.record({
    epoch: transaction.epoch,
    type: 'transaction',
    wire: transaction.originWire,
    transactionId: transaction.transactionId,
    intentHash,
    status,
    parentRevision: transaction.parentRevision,
    revision,
    committed: transaction.committed,
    commitKey: transaction.commitKey ?? null,
    operations: transaction.operations.map((operation) => ({ operation: operation.operation, name: operation.name })),
    noops,
    structuralReads: {
      names: [...transaction.structuralReads.names].sort(),
      prefixes: [...transaction.structuralReads.prefixes].sort()
    }
  });
}

/**
 * Exact replay index over the neural observations of an earlier trace.
 *
 * A capture matches on the wire name, the definition hash of the wire, and the
 * hashes of the dependency values the observation was computed from. Entries
 * are consumed in order, so a wire that was invalidated and re-observed during
 * the original run can be replayed in the same order.
 */
export function createReplayIndex(replayFrom) {
  const entries = Array.isArray(replayFrom) ? replayFrom : (replayFrom?.entries ?? []);
  const observations = entries.filter((entry) => entry.type === 'neural_call');
  const consumed = new Set();

  return {
    observations,
    capture({ wire, definitionHash = null, dependencyHashes = null }) {
      const key = dependencyHashes === null ? null : canonicalJson(dependencyHashes);
      let sawWire = false;
      let sawDefinition = false;
      for (let index = 0; index < observations.length; index += 1) {
        const entry = observations[index];
        if (entry.wire !== wire) {
          continue;
        }
        sawWire = true;
        if (definitionHash !== null && entry.definitionHash !== definitionHash) {
          continue;
        }
        sawDefinition = true;
        if (key !== null && canonicalJson(entry.dependencyHashes ?? {}) !== key) {
          continue;
        }
        if (consumed.has(index)) {
          continue;
        }
        consumed.add(index);
        return {
          ok: true,
          text: entry.generation?.text ?? '',
          provenance: {
            wire: entry.wire,
            epoch: entry.epoch ?? null,
            definitionHash: entry.definitionHash ?? null,
            command: entry.command ?? null,
            commandVersion: entry.commandVersion ?? null,
            modelRevision: entry.modelRevision ?? null,
            dependencyHashes: entry.dependencyHashes ?? null
          }
        };
      }
      if (!sawWire) {
        return { ok: false, reason: `the trace contains no recorded observation for wire "${wire}"` };
      }
      if (!sawDefinition) {
        return { ok: false, reason: `the recorded definition hash of wire "${wire}" does not match the current definition` };
      }
      return { ok: false, reason: `the recorded dependency values of wire "${wire}" do not match the current values` };
    }
  };
}

export { toErrorInfo };
