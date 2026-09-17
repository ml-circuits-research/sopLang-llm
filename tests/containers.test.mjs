import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRuntime } from '../runtime/kernel.mjs';
import { ContainerStore } from '../runtime/containers.mjs';

function runtime(options = {}) {
  return createRuntime(options);
}

test('declares a table, set, and sequence container', async () => {
  const source = [
    '@t container',
    'kind: table',
    'primaryKey: id',
    '',
    '@s container',
    'kind: set',
    '',
    '@q container',
    'kind: sequence'
  ].join('\n');
  const result = await runtime().run(source, { outputs: ['t', 's', 'q'] });
  assert.equal(result.status, 'completed');
  assert.deepEqual(
    result.containers.map((container) => container.kind),
    ['table', 'set', 'sequence']
  );
});

test('rejects an unknown collection kind', async () => {
  const result = await runtime().run('@t container\nkind: graph', { outputs: ['t'] });
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'validation_error');
});

test('table records use the declared primary key and reject duplicate keys', async () => {
  const store = new ContainerStore();
  store.declare('characters', { kind: 'table', primaryKey: 'id' });
  store.commit([
    {
      target: 'characters',
      parentRevision: 0,
      operation: 'add',
      items: [{ id: 'c1', name: 'Hamlet' }],
      sourceWire: 'add1',
      epoch: 0,
      sequence: 0
    }
  ]);
  assert.throws(
    () =>
      store.commit([
        {
          target: 'characters',
          parentRevision: 1,
          operation: 'add',
          items: [{ id: 'c1', name: 'Other' }],
          sourceWire: 'add2',
          epoch: 0,
          sequence: 0
        }
      ]),
    { code: 'validation_error' }
  );
});

test('a grouped commit increments the revision once per batch', async () => {
  const source = [
    '@events container',
    'kind: sequence',
    '',
    '@addOne containerAdd',
    'target: events',
    'items:',
    '  - id: e1',
    '',
    '@addTwo containerAdd',
    'target: events',
    'items:',
    '  - id: e2',
    '',
    '@addThree containerAdd',
    'target: events',
    'items:',
    '  - id: e3'
  ].join('\n');
  const result = await runtime().run(source, { outputs: ['events'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.containers[0].revision, 1);
  const commits = result.trace.entries.filter((entry) => entry.type === 'container_commit');
  assert.equal(commits.length, 1);
  assert.equal(commits[0].patches, 3);
  assert.equal(result.outputs.events.records.length, 3);
});

test('records observe the container revision from the start of the epoch', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    '',
    '@add containerAdd',
    'target: claims',
    'items:',
    '  - id: k1',
    '    text: first',
    '',
    '@all containerFilter',
    'source: $claims',
    'predicate:',
    '  return true;',
    '',
    '@count jsEval',
    'return $all.records.length;'
  ].join('\n');
  const result = await runtime().run(source, { outputs: ['count'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.count, 1);
  assert.ok(result.epochs >= 2);
});

test('containerFilter builds a derived view with provenance and source revision', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    '',
    '@add containerAdd',
    'target: claims',
    'items:',
    '  - id: k1',
    '    confidence: 0.9',
    '  - id: k2',
    '    confidence: 0.4',
    '',
    '@filtered containerFilter',
    'source: $claims',
    'predicate:',
    '  return row.confidence >= 0.5;',
    '',
    '@ids jsEval',
    'return $filtered.records.map((record) => record.id);'
  ].join('\n');
  const result = await runtime().run(source, { outputs: ['ids', 'filtered'] });
  assert.equal(result.status, 'completed');
  assert.deepEqual(result.outputs.ids, ['k1']);
  assert.equal(result.outputs.filtered.sourceRevision, 1);
  assert.equal(result.outputs.filtered.__container, 'claims');
});

test('containerFilter predicate reads a declaration value as a dependency', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    '',
    '@add containerAdd',
    'target: claims',
    'items:',
    '  - id: k1',
    '    confidence: 0.9',
    '  - id: k2',
    '    confidence: 0.4',
    '',
    '@filtered containerFilter',
    'source: $claims',
    'predicate:',
    '  return row.confidence >= $threshold;',
    '',
    '@ids jsEval',
    'return $filtered.records.map((record) => record.id);'
  ].join('\n');
  const result = await runtime().run(source, { inputs: { threshold: 0.5 }, outputs: ['ids'] });
  assert.equal(result.status, 'completed');
  assert.deepEqual(result.outputs.ids, ['k1']);
});

test('a committed patch invalidates the filter and its downstream values', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    '',
    '@addOne containerAdd',
    'target: claims',
    'items:',
    '  - id: k1',
    '    text: first',
    '',
    '@double jsEval',
    'circuit.addWire("addTwo", {',
    '  command: "containerAdd",',
    '  body: "target: claims\\nitems:\\n  - id: k2\\n    text: second"',
    '});',
    'return circuit.commit({ result: "expanded" });',
    '',
    '@view containerFilter',
    'source: $claims',
    'predicate:',
    '  return true;',
    '',
    '@count jsEval',
    'return $view.records.length;'
  ].join('\n');
  const result = await runtime().run(source, { controlRoots: ['double'], outputs: ['count'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.count, 2);
});

test('upsert rejects a conflicting replacement by default', async () => {
  const store = new ContainerStore();
  store.declare('claims', { kind: 'table', primaryKey: 'id' });
  store.commit([
    {
      target: 'claims',
      parentRevision: 0,
      operation: 'add',
      items: [{ id: 'k1', text: 'first' }],
      sourceWire: 'add',
      epoch: 0,
      sequence: 0
    }
  ]);
  assert.throws(
    () =>
      store.commit([
        {
          target: 'claims',
          parentRevision: 1,
          operation: 'upsert',
          items: [{ id: 'k1', text: 'second' }],
          sourceWire: 'upsert',
          mergePolicy: 'reject',
          epoch: 0,
          sequence: 0
        }
      ]),
    { code: 'validation_error' }
  );
});

test('upsert with replace policy overwrites the record', async () => {
  const store = new ContainerStore();
  store.declare('claims', { kind: 'table', primaryKey: 'id' });
  store.commit([
    {
      target: 'claims',
      parentRevision: 0,
      operation: 'add',
      items: [{ id: 'k1', text: 'first' }],
      sourceWire: 'add',
      epoch: 0,
      sequence: 0
    }
  ]);
  store.commit([
    {
      target: 'claims',
      parentRevision: 1,
      operation: 'upsert',
      items: [{ id: 'k1', text: 'second' }],
      sourceWire: 'upsert',
      mergePolicy: 'replace',
      epoch: 0,
      sequence: 0
    }
  ]);
  assert.deepEqual(store.snapshot('claims').records, [{ id: 'k1', text: 'second' }]);
});

test('upsert with competing-assertion policy preserves both claims', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    'mergePolicy: competing-assertion',
    '',
    '@add containerAdd',
    'target: claims',
    'items:',
    '  - id: k1',
    '    text: first',
    '',
    '@resolve containerUpsert',
    'target: claims',
    'items:',
    '  - id: k1',
    '    text: second',
    '',
    '@view containerFilter',
    'source: $claims',
    'predicate:',
    '  return true;',
    '',
    '@count jsEval',
    'return $view.records.length;'
  ].join('\n');
  const result = await runtime().run(source, { outputs: ['count'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.count, 2);
});

test('remove writes a tombstone instead of erasing history', async () => {
  const store = new ContainerStore();
  store.declare('claims', { kind: 'table', primaryKey: 'id' });
  store.commit([
    {
      target: 'claims',
      parentRevision: 0,
      operation: 'add',
      items: [{ id: 'k1', text: 'first' }],
      sourceWire: 'add',
      epoch: 0,
      sequence: 0
    }
  ]);
  store.commit([
    {
      target: 'claims',
      parentRevision: 1,
      operation: 'remove',
      items: [{ id: 'k1' }],
      sourceWire: 'remove',
      epoch: 0,
      sequence: 0
    }
  ]);
  assert.equal(store.snapshot('claims').records.length, 0);
  assert.equal(store.tombstonesOf('claims').length, 1);
  assert.equal(store.tombstonesOf('claims')[0].record.text, 'first');
});

test('record schemas reject a record that misses a required field', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    'schema:',
    '  type: object',
    '  required: [id, text]',
    '  properties:',
    '    id: { type: string }',
    '    text: { type: string }',
    '',
    '@add containerAdd',
    'target: claims',
    'items:',
    '  - id: k1'
  ].join('\n');
  const result = await runtime().run(source, { outputs: ['claims'] });
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'validation_error');
});

test('a patch may reference a computed wire value', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    '',
    '@rawRows jsEval',
    'return [{ id: "k1" }, { id: "k2" }];',
    '',
    '@addNormalized containerAdd',
    'target: claims',
    'items: $rawRows',
    '',
    '@all containerFilter',
    'source: $claims',
    'predicate:',
    '  return true;',
    '',
    '@count jsEval',
    'return $all.records.length;'
  ].join('\n');
  const result = await runtime().run(source, { outputs: ['count'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.count, 2);
});

test('two patches to different containers commit independently', async () => {
  const source = [
    '@a container',
    'kind: table',
    'primaryKey: id',
    '',
    '@b container',
    'kind: table',
    'primaryKey: id',
    '',
    '@addA containerAdd',
    'target: a',
    'items:',
    '  - id: a1',
    '',
    '@addB containerAdd',
    'target: b',
    'items:',
    '  - id: b1',
    '',
    '@allA containerFilter',
    'source: $a',
    'predicate:',
    '  return true;',
    '',
    '@allB containerFilter',
    'source: $b',
    'predicate:',
    '  return true;',
    '',
    '@out jsEval',
    'return $allA.records.length + $allB.records.length;'
  ].join('\n');
  const result = await runtime().run(source, { outputs: ['out'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.out, 2);
  const commits = result.trace.entries.filter((entry) => entry.type === 'container_commit');
  assert.equal(commits.length, 2);
});

test('sequence order follows semantic ordering keys, not insertion order', () => {
  const store = new ContainerStore();
  store.declare('events', { kind: 'sequence' });
  store.commit([
    {
      target: 'events',
      parentRevision: 0,
      operation: 'add',
      items: [{ id: 'late', __orderKey: [1, 1, 500, 0] }],
      sourceWire: 'chunkB',
      epoch: 0,
      sequence: 0
    }
  ]);
  store.commit([
    {
      target: 'events',
      parentRevision: 1,
      operation: 'add',
      items: [{ id: 'early', __orderKey: [1, 0, 10, 0] }],
      sourceWire: 'chunkA',
      epoch: 0,
      sequence: 1
    }
  ]);
  assert.deepEqual(
    store.snapshot('events').records.map((record) => record.id),
    ['early', 'late']
  );
});

test('a sequence merge is stable for items without ordering keys', () => {
  const store = new ContainerStore();
  store.declare('events', { kind: 'sequence' });
  store.commit([
    {
      target: 'events',
      parentRevision: 0,
      operation: 'add',
      items: [{ id: 'keyed', __orderKey: [1] }, { id: 'plain' }],
      sourceWire: 'a',
      epoch: 0,
      sequence: 0
    }
  ]);
  assert.deepEqual(
    store.snapshot('events').records.map((record) => record.id),
    ['keyed', 'plain']
  );
});

test('a rejected patch leaves records, history, and the revision untouched', () => {
  const store = new ContainerStore();
  store.declare('characters', { kind: 'table', primaryKey: 'id' });
  assert.throws(
    () =>
      store.commit([
        {
          target: 'characters',
          parentRevision: 0,
          operation: 'add',
          items: [{ id: 'x' }, { id: 'x' }],
          sourceWire: 'add',
          epoch: 0,
          sequence: 0
        }
      ]),
    { code: 'validation_error' }
  );
  assert.deepEqual(store.snapshot('characters').records, []);
  assert.equal(store.revisionOf('characters'), 0);
  assert.deepEqual(store.historyOf('characters'), []);
});

test('a failure in one group never publishes another group of the same commit', () => {
  const store = new ContainerStore();
  store.declare('a', { kind: 'table', primaryKey: 'id' });
  store.declare('b', { kind: 'table', primaryKey: 'id' });
  store.commit([
    { target: 'a', parentRevision: 0, operation: 'add', items: [{ id: 'a1' }], sourceWire: 'seed', epoch: 0, sequence: 0 }
  ]);
  assert.throws(
    () =>
      store.commit([
        { target: 'a', parentRevision: 1, operation: 'add', items: [{ id: 'a2' }], sourceWire: 'addA', epoch: 1, sequence: 0 },
        { target: 'b', parentRevision: 0, operation: 'add', items: [{ id: 'b1' }, { id: 'b1' }], sourceWire: 'addB', epoch: 1, sequence: 1 }
      ]),
    { code: 'validation_error' }
  );
  assert.equal(store.revisionOf('a'), 1, 'the accepted group did not advance');
  assert.deepEqual(
    store.snapshot('a').records.map((record) => record.id),
    ['a1'],
    'the rejected group did not contaminate a sibling'
  );
  assert.deepEqual(store.snapshot('b').records, []);
  const reused = store.commit([
    { target: 'b', parentRevision: 0, operation: 'add', items: [{ id: 'b1' }], sourceWire: 'addB', epoch: 2, sequence: 0 }
  ]);
  assert.equal(reused[0].revision, 1, 'the store remains usable after a rejection');
});

test('set membership is governed by identity within a patch and across revisions', () => {
  const store = new ContainerStore();
  store.declare('tags', { kind: 'set' });
  store.commit([
    { target: 'tags', parentRevision: 0, operation: 'add', items: [1, 1, 2], sourceWire: 'add1', epoch: 0, sequence: 0 }
  ]);
  assert.deepEqual(store.snapshot('tags').records, [1, 2]);
  store.commit([
    { target: 'tags', parentRevision: 1, operation: 'add', items: [2, 3], sourceWire: 'add2', epoch: 0, sequence: 1 }
  ]);
  assert.deepEqual(store.snapshot('tags').records, [1, 2, 3]);
  store.commit([
    { target: 'tags', parentRevision: 2, operation: 'add', items: [4], sourceWire: 'add3', epoch: 0, sequence: 0 },
    { target: 'tags', parentRevision: 2, operation: 'add', items: [4, 5], sourceWire: 'add4', epoch: 0, sequence: 1 }
  ]);
  assert.deepEqual(store.snapshot('tags').records, [1, 2, 3, 4, 5]);
  assert.equal(store.revisionOf('tags'), 3);
});

test('a replacement keeps the earlier assertion retrievable by revision', () => {
  const store = new ContainerStore();
  store.declare('claims', { kind: 'table', primaryKey: 'id' });
  store.commit([
    {
      target: 'claims',
      parentRevision: 0,
      operation: 'add',
      items: [{ id: 'k1', text: 'original', sourceSpans: [{ start: 1, end: 5 }] }],
      sourceWire: 'add',
      epoch: 0,
      sequence: 0
    }
  ]);
  store.commit([
    {
      target: 'claims',
      parentRevision: 1,
      operation: 'upsert',
      items: [{ id: 'k1', text: 'changed' }],
      sourceWire: 'upsert',
      mergePolicy: 'replace',
      epoch: 0,
      sequence: 0
    }
  ]);
  assert.deepEqual(store.snapshot('claims').records, [{ id: 'k1', text: 'changed' }]);
  const history = store.historyOf('claims');
  assert.equal(history.length, 2);
  assert.equal(history[1].operation, 'upsert-replace');
  assert.equal(history[1].previous.text, 'original');
  assert.deepEqual(history[1].previous.sourceSpans, [{ start: 1, end: 5 }]);
  const atRevisionOne = store.historyOf('claims', { revision: 1 });
  assert.deepEqual(
    atRevisionOne.map((entry) => entry.record.text),
    ['original']
  );
  assert.deepEqual(store.tombstonesOf('claims'), []);
});

test('a merge keeps the replaced assertion in the history', () => {
  const store = new ContainerStore();
  store.declare('claims', { kind: 'table', primaryKey: 'id' });
  store.commit([
    { target: 'claims', parentRevision: 0, operation: 'add', items: [{ id: 'k1', text: 'first', status: 'open' }], sourceWire: 'add', epoch: 0, sequence: 0 }
  ]);
  store.commit([
    {
      target: 'claims',
      parentRevision: 1,
      operation: 'upsert',
      items: [{ id: 'k1', status: 'closed' }],
      sourceWire: 'merge',
      mergePolicy: 'merge',
      epoch: 0,
      sequence: 0
    }
  ]);
  assert.deepEqual(store.snapshot('claims').records, [{ id: 'k1', text: 'first', status: 'closed' }]);
  const history = store.historyOf('claims');
  assert.equal(history[1].operation, 'upsert-merge');
  assert.deepEqual(history[1].previous, { id: 'k1', text: 'first', status: 'open' });
});

test('a committed patch invalidates a composed filter chain', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    '',
    '@addOne containerAdd',
    'target: claims',
    'items:',
    '  - id: k1',
    '    confidence: 0.9',
    '',
    '@expand jsEval',
    'circuit.addWire("addTwo", {',
    '  command: "containerAdd",',
    '  body: "target: claims\\nitems:\\n  - id: k2\\n    confidence: 0.8"',
    '});',
    'return circuit.commit({ result: "expanded" });',
    '',
    '@accepted containerFilter',
    'source: $claims',
    'predicate:',
    '  return row.confidence >= 0.5;',
    '',
    '@ids containerFilter',
    'source: $accepted',
    'predicate:',
    '  return true;',
    '',
    '@count jsEval',
    'return $ids.records.length;'
  ].join('\n');
  const result = await runtime().run(source, { controlRoots: ['expand'], outputs: ['count'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.count, 2);
  assert.equal(result.outputs.count === 2, true);
});

test('a second-stage filter reports the base container revision', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    '',
    '@add containerAdd',
    'target: claims',
    'items:',
    '  - id: k1',
    '    confidence: 0.9',
    '',
    '@accepted containerFilter',
    'source: $claims',
    'predicate:',
    '  return row.confidence >= 0.5;',
    '',
    '@ids containerFilter',
    'source: $accepted',
    'predicate:',
    '  return true;'
  ].join('\n');
  const result = await runtime().run(source, { outputs: ['ids'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.ids.__container, 'claims');
  assert.equal(result.outputs.ids.sourceRevision, 1);
  assert.deepEqual(
    result.outputs.ids.records.map((record) => record.id),
    ['k1']
  );
});

test('a patch may take its items from a derived view', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    '',
    '@add containerAdd',
    'target: claims',
    'items:',
    '  - id: k1',
    '    confidence: 0.9',
    '  - id: k2',
    '    confidence: 0.1',
    '',
    '@accepted containerFilter',
    'source: $claims',
    'predicate:',
    '  return row.confidence >= 0.5;',
    '',
    '@selected container',
    'kind: set',
    '',
    '@copy containerAdd',
    'target: selected',
    'items: $accepted',
    '',
    '@copied containerFilter',
    'source: $selected',
    'predicate:',
    '  return true;',
    '',
    '@ids jsEval',
    'return $copied.records.map((record) => record.id);'
  ].join('\n');
  const result = await runtime().run(source, { outputs: ['ids'] });
  assert.equal(result.status, 'completed');
  assert.deepEqual(result.outputs.ids, ['k1']);
});
