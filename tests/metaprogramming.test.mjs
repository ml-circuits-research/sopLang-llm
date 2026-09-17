import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRuntime } from '../runtime/kernel.mjs';
import { CircuitTransaction, validateTransaction, materializeTransaction } from '../runtime/metaprogramming.mjs';
import { createRegistry } from '../runtime/registry.mjs';
import { createStandardCommands } from '../wires/standard/index.mjs';
import { hashDefinition } from '../runtime/hashing.mjs';

function registry() {
  return createRegistry(createStandardCommands());
}

function factoryFor(start = 0) {
  let createdAt = start;
  return {
    nextCreatedAt: () => createdAt,
    setNextCreatedAt: (value) => {
      createdAt = value;
    }
  };
}

test('addWire stages an addition that launches a new epoch', async () => {
  const source =
    '@groups input\n\n@expand jsEval\nfor (const group of $groups) {\n  circuit.addWire(`score_${group}`, { command: "jsEval", body: `return $groups.indexOf("${group}") * 10;` });\n}\nreturn circuit.commit({ created: $groups.length });\n\n@total jsEval\nreturn $score_a + $score_b + $score_c;';
  const result = await createRuntime().run(source, {
    inputs: { groups: ['a', 'b', 'c'] },
    outputs: ['total']
  });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.total, 30);
  assert.ok(result.epochs >= 2);
});

test('a commit value is returned to the originating wire', async () => {
  const result = await createRuntime().run(
    '@expand jsEval\nreturn circuit.commit({ key: "k", result: { created: 3 } });',
    { outputs: ['expand'] }
  );
  assert.deepEqual({ ...result.outputs.expand }, { created: 3 });
});

test('new wires appear in the trace of the new epoch', async () => {
  const source =
    '@expand jsEval\ncircuit.addWire("added", { command: "literal", body: "7" });\nreturn circuit.commit({ result: true });\n\n@output jsEval\nreturn $added * 2;';
  const result = await createRuntime().run(source, {
    outputs: ['output'],
    controlRoots: ['expand']
  });
  const addedEntry = result.trace.entries.find((entry) => entry.wire === 'added');
  assert.ok(addedEntry !== undefined);
  assert.equal(addedEntry.epoch, 2);
  assert.equal(result.outputs.output, 14);
});

test('validateTransaction rejects addWire for an existing name', () => {
  const transaction = new CircuitTransaction({ circuitRevision: 1, originWire: 'a', epoch: 0 });
  transaction.addWire('a', { command: 'jsEval', body: 'return 1;' });
  assert.throws(
    () =>
      validateTransaction({
        transaction,
        registry: registry(),
        currentWires: new Map([['a', { command: { name: 'jsEval' }, definitionHash: 'x' }]])
      }),
    { code: 'duplicate_wire' }
  );
});

test('validateTransaction rejects redefineWire for a missing wire', () => {
  const transaction = new CircuitTransaction({ circuitRevision: 1, originWire: 'a', epoch: 0 });
  transaction.redefineWire('missing', { command: 'jsEval', body: 'return 1;' });
  assert.throws(
    () => validateTransaction({ transaction, registry: registry(), currentWires: new Map() }),
    { code: 'unknown_wire' }
  );
});

test('stale redefinition is rejected through expectedDefinitionHash', () => {
  const existingHash = hashDefinition({ command: 'jsEval', commandVersion: '1.0.0', body: 'return 1;' });
  const transaction = new CircuitTransaction({ circuitRevision: 1, originWire: 'a', epoch: 0 });
  transaction.redefineWire('a', {
    command: 'jsEval',
    body: 'return 2;',
    expectedDefinitionHash: 'not-the-current-hash'
  });
  assert.throws(
    () =>
      validateTransaction({
        transaction,
        registry: registry(),
        currentWires: new Map([['a', { command: { name: 'jsEval' }, definitionHash: existingHash }]])
      }),
    { code: 'stale_definition' }
  );
});

test('an accepted redefinition replaces the wire and invalidates downstream values', async () => {
  const source =
    '@a jsEval\nreturn 1;\n\n@b jsEval\nreturn $a + 1;\n\n@redefine jsEval\ncircuit.redefineWire("a", { command: "jsEval", body: "return 10;" });\nreturn circuit.commit({ result: true });';
  const result = await createRuntime().run(source, {
    outputs: ['b'],
    controlRoots: ['redefine']
  });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.b, 11);
});

test('invalidateWire recomputes a value even when the code is identical', async () => {
  let counter = 0;
  const registry = createRegistry([
    ...createStandardCommands(),
    {
      name: 'counter',
      version: '1.0.0',
      effectClass: 'pure',
      analyze: () => ({ values: [], structural: [], containerReads: [], containerWrites: [] }),
      validate: () => ({ ok: true }),
      async execute() {
        counter += 1;
        return counter;
      }
    }
  ]);
  const source =
    '@value counter\n\n@invalidate jsEval\ncircuit.invalidateWire("value", { reason: "external event" });\nreturn circuit.commit({ result: true });';
  const result = await createRuntime({ registry }).run(source, {
    outputs: ['value'],
    controlRoots: ['invalidate']
  });
  assert.equal(result.status, 'completed');
  assert.ok(result.outputs.value >= 2);
});

test('a transaction that exceeds the operation budget returns a partial outcome', async () => {
  const source =
    '@expand jsEval\nfor (let index = 0; index < 5; index += 1) {\n  circuit.addWire(`n${index}`, { command: "literal", body: "1" });\n}\nreturn circuit.commit({ result: true });';
  const result = await createRuntime().run(source, {
    outputs: ['expand'],
    budget: { maxTransactionOps: 2 }
  });
  assert.equal(result.status, 'partial');
  assert.equal(result.code, 'budget_exceeded');
  assert.equal(result.error.details.budget, 'maxTransactionOps');
});

test('created wires are charged against the created-wire budget', async () => {
  const source =
    '@expand jsEval\nfor (let index = 0; index < 5; index += 1) {\n  circuit.addWire(`n${index}`, { command: "literal", body: "1" });\n}\nreturn circuit.commit({ result: true });';
  const result = await createRuntime().run(source, {
    outputs: ['expand'],
    budget: { maxCreatedWires: 2 }
  });
  assert.equal(result.status, 'partial');
  assert.equal(result.error.details.budget, 'maxCreatedWires');
});

test('getDefinition is available to JavaScript but getValue is not', async () => {
  const source =
    '@a literal\n1\n\n@inspect jsEval\nreturn typeof circuit.getDefinition ("a");';
  const result = await createRuntime().run(source, { outputs: ['inspect'] });
  assert.equal(result.outputs.inspect, 'object');
  const forbidden = await createRuntime().run('@probe jsEval\nreturn circuit.getValue("a");', { outputs: ['probe'] });
  assert.equal(forbidden.status, 'failed');
  assert.equal(forbidden.code, 'execution_error');
});

test('materializeTransaction builds scheduled nodes for additions', () => {
  const transaction = new CircuitTransaction({ circuitRevision: 1, originWire: 'x', epoch: 0 });
  transaction.addWire('fresh', { command: 'literal', body: '2' });
  const validated = validateTransaction({
    transaction,
    registry: registry(),
    currentWires: new Map()
  });
  const additions = materializeTransaction({ validated, factory: factoryFor(5) });
  assert.equal(additions.length, 1);
  assert.equal(additions[0].kind, 'add');
  assert.equal(additions[0].node.name, 'fresh');
  assert.equal(additions[0].node.createdAt, 5);
});

test('a staged write without a commit never publishes', async () => {
  const source =
    '@build jsEval\ncircuit.addWire("x", { command: "literal", body: "7" });\nreturn "staged";\n\n@output jsEval\nreturn $x + 1;';
  const result = await createRuntime().run(source, { outputs: ['output'], controlRoots: ['build'] });
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'validation_error');
  const failure = result.trace.entries.find((entry) => entry.type === 'error');
  assert.equal(failure.wire, 'build');
});

test('a structural reader observes real definitions and is invalidated by a change', async () => {
  const source = [
    '@a literal',
    '1',
    '',
    '@inspect jsEval',
    'const definition = circuit.getDefinition("a");',
    'return circuit.commit({ result: { body: definition.body, known: definition.known } });',
    '',
    '@redefine jsEval',
    'circuit.redefineWire("a", { command: "literal", body: "2" });',
    'return circuit.commit({ result: "redefined" });'
  ].join('\n');
  const result = await createRuntime().run(source, { outputs: ['inspect'], controlRoots: ['redefine'] });
  assert.equal(result.status, 'completed');
  assert.deepEqual({ ...result.outputs.inspect }, { body: '2', known: true });
  const inspections = result.trace.entries.filter((entry) => entry.wire === 'inspect' && entry.type === 'value');
  assert.equal(inspections.length, 2, 'the reader re-ran after the definition changed');
});

test('listDefinitions returns the definitions matching a prefix', async () => {
  const source = [
    '@score_one literal',
    '1',
    '',
    '@score_two literal',
    '2',
    '',
    '@other literal',
    '3',
    '',
    '@inspect jsEval',
    'return circuit.commit({ result: circuit.listDefinitions({ prefix: "score_" }).map((entry) => entry.name) });'
  ].join('\n');
  const result = await createRuntime().run(source, { outputs: ['inspect'] });
  assert.equal(result.status, 'completed');
  assert.deepEqual([...result.outputs.inspect], ['score_one', 'score_two']);
});

test('a transaction retried after an unrelated commit publishes no duplicate effect', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    '',
    '@expand jsEval',
    'circuit.addWire("made", { command: "literal", body: "5" });',
    'return circuit.commit({ result: $claims.records.length });',
    '',
    '@add containerAdd',
    'target: claims',
    'items:',
    '  - id: c1',
    '',
    '@output jsEval',
    'return $made + $claims.records.length;'
  ].join('\n');
  const result = await createRuntime().run(source, { outputs: ['output'], controlRoots: ['expand'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.output, 6);
  const transactions = result.trace.entries.filter((entry) => entry.type === 'transaction');
  assert.equal(transactions.length, 2);
  assert.ok(transactions.some((entry) => entry.noops.length === 1), 'the retry was recognized as an idempotent no-op');
});

test('reusing an identifier with different content is rejected', async () => {
  const source = [
    '@first jsEval',
    'circuit.addWire("made", { command: "literal", body: "5" });',
    'return circuit.commit({ result: 1 });',
    '',
    '@second jsEval',
    'circuit.addWire("made", { command: "literal", body: "9" });',
    'return circuit.commit({ result: 2 });'
  ].join('\n');
  const result = await createRuntime().run(source, { outputs: ['second'], controlRoots: ['first'] });
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'duplicate_wire');
});

test('every structural change advances the circuit revision', async () => {
  const source =
    '@redefine jsEval\ncircuit.redefineWire("a", { command: "jsEval", body: "return 10;" });\nreturn circuit.commit({ result: true });\n\n@a jsEval\nreturn 1;';
  const result = await createRuntime().run(source, { outputs: ['a'], controlRoots: ['redefine'] });
  assert.equal(result.status, 'completed');
  const revisions = [...new Set(result.trace.entries.map((entry) => entry.circuitRevision))];
  assert.equal(revisions.length >= 2, true, 'a same-size redefinition is still a new revision');
  const transaction = result.trace.entries.find((entry) => entry.type === 'transaction');
  assert.equal(transaction.parentRevision, 1);
  assert.equal(transaction.revision, 2);
  assert.equal(transaction.committed, true);
  assert.deepEqual(transaction.operations, [{ operation: 'redefineWire', name: 'a' }]);
});
