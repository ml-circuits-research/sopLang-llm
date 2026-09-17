/**
 * Typed persistent container store.
 *
 * Containers are table, set, or sequence collections with explicit schemas,
 * identity policies, and revision counters. Container mutation commands stage
 * patches against the revision visible at the start of an epoch; the store
 * applies compatible patches in one deterministic commit per target container
 * and increments the revision once per grouped commit.
 *
 * A grouped commit is atomic. Every patch is applied to a working copy of the
 * target container, and the working copies replace the live state only after
 * every patch in the group has been accepted, so a rejected patch leaves
 * records, tombstones, history, and revision counters untouched.
 *
 * History is append-only. Every accepted item is recorded in the container
 * history together with the record it replaced, and removal writes a tombstone
 * instead of erasing the record, so earlier assertions stay retrievable by
 * revision while the canonical view is free to change. Stored records are
 * frozen and snapshots are deep copies, so no consumer can mutate container
 * state outside a committed patch.
 */

import { canonicalJson, hashValue } from './hashing.mjs';
import { SopError } from './errors.mjs';
import { validateValueAgainstSchema, assertSchemaSupported } from './schema.mjs';
import { copyValue, freezeValue } from './values.mjs';

export const COLLECTION_KINDS = Object.freeze(['table', 'set', 'sequence']);

export class ContainerStore {
  constructor() {
    this.containers = new Map();
    this.tombstones = new Map();
    this.history = new Map();
    this.revisionCounter = 0;
  }

  declare(name, definition = {}) {
    if (this.containers.has(name)) {
      throw new SopError('duplicate_wire', `Container "${name}" is already declared.`, { container: name });
    }
    const kind = String(definition.kind ?? '').toLowerCase();
    if (!COLLECTION_KINDS.includes(kind)) {
      throw new SopError('validation_error', `Container "${name}" requires a kind of ${COLLECTION_KINDS.join(', ')}.`, {
        container: name
      });
    }
    if (definition.schema !== undefined && definition.schema !== null) {
      if (typeof definition.schema !== 'object') {
        throw new SopError('validation_error', `Container "${name}" schema must be an object.`, { container: name });
      }
      assertSchemaSupported(definition.schema, { context: `schema of container "${name}"` });
    }
    if (kind === 'table' && definition.primaryKey !== undefined && definition.primaryKey !== null) {
      if (typeof definition.primaryKey !== 'string' || definition.primaryKey === '') {
        throw new SopError('validation_error', `Container "${name}" primaryKey must be a field name.`, {
          container: name
        });
      }
    }
    const container = {
      name,
      kind,
      primaryKey: definition.primaryKey ?? null,
      identity: definition.identity ?? null,
      schema: definition.schema ?? null,
      mergePolicy: definition.mergePolicy ?? 'reject',
      revision: 0,
      records: []
    };
    this.containers.set(name, container);
    this.tombstones.set(name, []);
    this.history.set(name, []);
    return this.snapshot(name);
  }

  has(name) {
    return this.containers.has(name);
  }

  require(name) {
    const container = this.containers.get(name);
    if (container === undefined) {
      throw new SopError('unknown_wire', `Container "${name}" is not declared.`, { container: name });
    }
    return container;
  }

  revisionOf(name) {
    return this.require(name).revision;
  }

  definitions() {
    return [...this.containers.values()].map((container) => ({
      name: container.name,
      kind: container.kind,
      primaryKey: container.primaryKey,
      identity: container.identity,
      schema: container.schema,
      mergePolicy: container.mergePolicy,
      revision: container.revision,
      records: container.records.length,
      history: this.history.get(container.name).length
    }));
  }

  snapshot(name) {
    const container = this.require(name);
    return {
      __container: container.name,
      kind: container.kind,
      revision: container.revision,
      records: copyValue(container.records, { role: `snapshot of container "${name}"` })
    };
  }

  revisionKeys() {
    const keys = new Map();
    for (const [name, container] of this.containers.entries()) {
      keys.set(name, container.revision);
    }
    return keys;
  }

  stagePatch(patch) {
    const container = this.require(patch.target);
    const operation = String(patch.operation ?? '');
    if (!['add', 'upsert', 'remove'].includes(operation)) {
      throw new SopError('validation_error', `Unsupported container operation "${operation}".`, {
        container: container.name,
        operation
      });
    }
    const items = Array.isArray(patch.items) ? patch.items : patch.items === undefined ? [] : [patch.items];
    return {
      target: container.name,
      parentRevision: container.revision,
      operation,
      items: copyValue(items, { role: `staged items for container "${container.name}"` }),
      sourceWire: patch.sourceWire ?? null,
      mergePolicy: patch.mergePolicy ?? container.mergePolicy,
      epoch: patch.epoch ?? 0,
      sequence: patch.sequence ?? 0
    };
  }

  commit(patches) {
    const grouped = new Map();
    for (const patch of patches) {
      if (!grouped.has(patch.target)) {
        grouped.set(patch.target, []);
      }
      grouped.get(patch.target).push(patch);
    }

    // Phase one: apply every group to a working copy. Any rejection leaves the
    // live state untouched because nothing is assigned back yet.
    const prepared = [];
    for (const [target, group] of grouped.entries()) {
      const container = this.require(target);
      const ordered = [...group].sort(comparePatches);
      const working = {
        container,
        target,
        ordered,
        records: container.records.slice(),
        tombstones: this.tombstones.get(target).slice(),
        history: this.history.get(target).slice()
      };
      for (const patch of ordered) {
        if (patch.parentRevision !== container.revision) {
          throw new SopError(
            'validation_error',
            `Container patch for "${target}" targets revision ${patch.parentRevision} but the current revision is ${container.revision}.`,
            { container: target, parentRevision: patch.parentRevision, revision: container.revision }
          );
        }
        this.applyPatch(working, patch);
      }
      if (container.kind === 'sequence') {
        working.records = this.orderSequence(working.records);
      }
      prepared.push(working);
    }

    // Phase two: publish every accepted group and advance its revision once.
    const committed = [];
    for (const working of prepared) {
      working.container.records = working.records;
      working.container.revision += 1;
      this.revisionCounter += 1;
      this.tombstones.set(working.target, working.tombstones);
      this.history.set(working.target, working.history);
      committed.push({ container: working.target, revision: working.container.revision, patches: working.ordered.length });
    }
    return committed;
  }

  /**
   * Sequence order is semantic, so completion order never defines it. Every
   * item carries an ordering key such as source document order, chunk order,
   * source offset, and local index; the merged sequence is sorted by that key.
   * Items without a key keep their relative insertion order after the keyed
   * items, and the sort is stable.
   */
  orderSequence(records) {
    const indexed = records.map((record, index) => ({ record, index, key: orderingKeyOf(record) }));
    indexed.sort((left, right) => {
      const comparison = compareOrderKeys(left.key, right.key);
      if (comparison !== 0) {
        return comparison;
      }
      return left.index - right.index;
    });
    return indexed.map((entry) => entry.record);
  }

  applyPatch(working, patch) {
    if (patch.operation === 'add' || patch.operation === 'upsert') {
      for (const item of patch.items) {
        this.validateRecord(working.container, item);
      }
    }
    if (patch.operation === 'add') {
      this.applyAdd(working, patch);
      return;
    }
    if (patch.operation === 'upsert') {
      for (const item of patch.items) {
        this.applyUpsert(working, item, patch);
      }
      return;
    }
    if (patch.operation === 'remove') {
      for (const item of patch.items) {
        this.applyRemove(working, item, patch);
      }
    }
  }

  applyAdd(working, patch) {
    const { container } = working;
    // A set is defined by membership identity, so a repeated member is not a
    // new element; the identity is canonical or declared, and it holds within a
    // patch, across grouped patches, and across revisions.
    const members = container.kind === 'set' ? new Set(working.records.map((record) => this.identityOf(container, record))) : null;
    for (const item of patch.items) {
      if (container.primaryKey !== null) {
        const key = item[container.primaryKey];
        if (key === undefined || key === null) {
          throw new SopError(
            'validation_error',
            `Record for container "${container.name}" is missing primary key "${container.primaryKey}".`,
            { container: container.name, record: item }
          );
        }
        const existing = working.records.find((record) => record[container.primaryKey] === key);
        if (existing !== undefined) {
          throw new SopError(
            'validation_error',
            `Container "${container.name}" already contains primary key "${String(key)}"; use containerUpsert for keyed replacement.`,
            { container: container.name, key }
          );
        }
      }
      const identity = this.identityOf(container, item);
      if (members !== null) {
        if (members.has(identity)) {
          continue;
        }
        members.add(identity);
      }
      working.records.push(freezeValue(item));
      working.history.push(historyEntry(working, patch, 'add', item, null, identity));
    }
  }

  applyUpsert(working, item, patch) {
    const { container } = working;
    const policy = patch.mergePolicy;
    const identity = this.identityOf(container, item);
    if (identity === null) {
      working.records.push(freezeValue(item));
      working.history.push(historyEntry(working, patch, 'upsert-insert', item, null));
      return;
    }
    const index = working.records.findIndex((record) => this.identityOf(container, record) === identity);
    if (index === -1) {
      working.records.push(freezeValue(item));
      working.history.push(historyEntry(working, patch, 'upsert-insert', item, null, identity));
      return;
    }
    const previous = working.records[index];
    if (policy === 'replace') {
      working.records[index] = freezeValue(item);
      working.history.push(historyEntry(working, patch, 'upsert-replace', item, previous, identity));
      return;
    }
    if (policy === 'merge') {
      if (typeof previous !== 'object' || previous === null || typeof item !== 'object' || item === null) {
        throw new SopError('validation_error', `Merge policy requires object records in "${container.name}".`, {
          container: container.name,
          identity
        });
      }
      const merged = { ...previous, ...item };
      working.records[index] = freezeValue(merged);
      working.history.push(historyEntry(working, patch, 'upsert-merge', merged, previous, identity));
      return;
    }
    if (policy === 'competing-assertion') {
      const competing = { ...item, __competingAssertionOf: identity };
      working.records.push(freezeValue(competing));
      working.history.push(historyEntry(working, patch, 'upsert-competing', competing, previous, identity));
      return;
    }
    throw new SopError(
      'validation_error',
      `Upsert conflict for identity "${String(identity)}" in container "${container.name}" under policy "${policy}".`,
      { container: container.name, identity, policy }
    );
  }

  applyRemove(working, item, patch) {
    const { container } = working;
    const identity = this.identityOf(container, item);
    if (identity === null) {
      return;
    }
    const index = working.records.findIndex((record) => this.identityOf(container, record) === identity);
    if (index === -1) {
      return;
    }
    const [removed] = working.records.splice(index, 1);
    working.tombstones.push({
      record: copyValue(removed, { role: `tombstone of "${container.name}"` }),
      identity,
      revisionRemovedAt: container.revision
    });
    working.history.push(historyEntry(working, patch, 'remove', removed, null, identity));
  }

  identityOf(container, record) {
    if (record === null || typeof record !== 'object') {
      return canonicalJson(record);
    }
    if (record.__competingAssertionOf !== undefined) {
      return canonicalJson(record);
    }
    if (container.identity !== null) {
      if (typeof container.identity === 'function') {
        return container.identity(record);
      }
      return record[container.identity];
    }
    if (container.primaryKey !== null) {
      return record[container.primaryKey];
    }
    if (container.kind === 'set') {
      return hashValue(record);
    }
    return null;
  }

  validateRecord(container, record) {
    if (container.schema === null) {
      return;
    }
    const result = validateValueAgainstSchema(record, container.schema);
    if (!result.ok) {
      throw new SopError(result.code ?? 'validation_error', `Record does not satisfy the schema of "${container.name}": ${result.message}`, {
        container: container.name,
        record,
        path: result.path
      });
    }
  }

  viewOf(name, records, sourceRevision) {
    return {
      __container: name,
      kind: 'view',
      sourceRevision,
      records: copyValue(records, { role: `derived view of container "${name}"` })
    };
  }

  tombstonesOf(name) {
    return this.tombstones.get(name) ?? [];
  }

  /**
   * The append-only assertion history of a container. When a revision is given,
   * the result contains the assertions that were accepted up to and including
   * that container revision, so an earlier reading of the store stays
   * retrievable after a replacement or a merge.
   */
  historyOf(name, { revision = null } = {}) {
    const entries = this.history.get(name) ?? [];
    if (revision === null) {
      return entries.map((entry) => entry);
    }
    return entries.filter((entry) => entry.revision <= revision).map((entry) => entry);
  }
}

function historyEntry(working, patch, operation, record, previous, identity = null) {
  return {
    container: working.target,
    revision: working.container.revision + 1,
    operation,
    identity: identity ?? null,
    record: copyValue(record, { role: `history record of "${working.target}"` }),
    previous: previous === null ? null : copyValue(previous, { role: `replaced record of "${working.target}"` }),
    sourceWire: patch.sourceWire,
    epoch: patch.epoch,
    sequence: patch.sequence
  };
}

function comparePatches(left, right) {
  if (left.epoch !== right.epoch) {
    return left.epoch - right.epoch;
  }
  if (left.sequence !== right.sequence) {
    return left.sequence - right.sequence;
  }
  return String(left.sourceWire) < String(right.sourceWire) ? -1 : 1;
}

export function orderingKeyOf(item) {
  if (item !== null && typeof item === 'object' && Array.isArray(item.__orderKey)) {
    return item.__orderKey;
  }
  return null;
}

export function compareOrderKeys(left, right) {
  if (left === null && right === null) {
    return 0;
  }
  if (left === null) {
    return 1;
  }
  if (right === null) {
    return -1;
  }
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const a = left[index];
    const b = right[index];
    if (a === b) {
      continue;
    }
    if (a === undefined) {
      return -1;
    }
    if (b === undefined) {
      return 1;
    }
    return a < b ? -1 : 1;
  }
  return 0;
}
