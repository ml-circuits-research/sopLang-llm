import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRuntime } from '../runtime/kernel.mjs';
import { createRegistry } from '../runtime/registry.mjs';
import { createStandardCommands } from '../wires/standard/index.mjs';

function runtime(options = {}) {
  return createRuntime(options);
}

test('computes a single output from an input binding', async () => {
  const result = await runtime().run('@output jsEval\nreturn $rows.length;', {
    inputs: { rows: [1, 2, 3] }
  });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.output, 3);
});

test('evaluates a dependency chain in topological order regardless of text order', async () => {
  const source = [
    '@output jsEval',
    'return $total * 2;',
    '',
    '@total jsEval',
    'return $selected.reduce((sum, value) => sum + value, 0);',
    '',
    '@selected jsEval',
    'return $rows.filter((value) => value > 1);'
  ].join('\n');
  const result = await runtime().run(source, { inputs: { rows: [1, 2, 3] } });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.output, 10);
});

test('the schedule is stable for independent wires', async () => {
  const source = '@b jsEval\nreturn 2;\n\n@a jsEval\nreturn 1;\n\n@output jsEval\nreturn $a + $b;';
  const result = await runtime().run(source, {});
  const order = result.trace.entries.filter((entry) => entry.type === 'value').map((entry) => entry.wire);
  assert.deepEqual(order, ['b', 'a', 'output']);
});

test('reordering independent declarations does not change a pure result', async () => {
  const first = await runtime().run('@a literal\n2\n\n@b literal\n3\n\n@output jsEval\nreturn $a * $b;');
  const second = await runtime().run('@b literal\n3\n\n@a literal\n2\n\n@output jsEval\nreturn $a * $b;');
  assert.equal(first.outputs.output, second.outputs.output);
});

test('returns a partial outcome for an unresolved dependency and names it', async () => {
  const result = await runtime().run('@output jsEval\nreturn $missing + 1;', {});
  assert.equal(result.status, 'partial');
  assert.equal(result.code, 'unresolved_dependencies');
  assert.deepEqual(result.error.missing, [{ dependency: 'missing', wire: 'output' }]);
});

test('fails on a cycle before producing any output', async () => {
  const source = '@a jsEval\nreturn $b + 1;\n\n@b jsEval\nreturn $a + 1;\n\n@output jsEval\nreturn $a;';
  const result = await runtime().run(source, {});
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'cycle_detected');
  assert.deepEqual(result.outputs, {});
});

test('fails with unknown_output for an undeclared requested wire', async () => {
  const result = await runtime().run('@a literal\n1', { outputs: ['nope'] });
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'unknown_output');
});

test('fails with unknown_command for an unregistered command', async () => {
  const result = await runtime().run('@a notACommand\nbody', { outputs: ['a'] });
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'unknown_command');
});

test('fails with missing_input when a declared input has no binding', async () => {
  const result = await runtime().run('@problem input\n\n@output jsEval\nreturn $problem;', {});
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'missing_input');
});

test('reads a value through an implicit input binding without a declaration', async () => {
  const result = await runtime().run('@output jsEval\nreturn $value * 3;', { inputs: { value: 7 } });
  assert.equal(result.outputs.output, 21);
  assert.equal(result.status, 'completed');
});

test('literal parses JSON bodies and returns text otherwise', async () => {
  const json = await runtime().run('@a literal\n{ "items": [1, 2] }\n\n@output jsEval\nreturn $a.items.length;');
  assert.equal(json.outputs.output, 2);
  const text = await runtime().run('@a literal\nplain words\n\n@output jsEval\nreturn $a;');
  assert.equal(text.outputs.output, 'plain words');
});

test('validates the requested output against a declared schema', async () => {
  const schema = { type: 'object', required: ['answer'], properties: { answer: { type: 'string' } } };
  const good = await runtime().run('@output jsEval\nreturn { answer: "ok" };', { outputSchema: schema });
  assert.equal(good.status, 'completed');
  const bad = await runtime().run('@output jsEval\nreturn { value: 1 };', { outputSchema: schema });
  assert.equal(bad.status, 'failed');
  assert.equal(bad.code, 'validation_error');
});

test('charges neural calls against the budget', async () => {
  const models = { modelCall: async () => 'judged' };
  const result = await runtime().run('@verdict modelCall\nIs it so?', {
    outputs: ['verdict'],
    models,
    budget: { maxNeuralCalls: 1 }
  });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.verdict, 'judged');
  assert.equal(result.budgets.usage.neuralCalls, 1);
});

test('returns a partial outcome when the neural budget is exhausted', async () => {
  const models = { modelCall: async () => 'judged' };
  const source = '@a modelCall\nfirst\n\n@b modelCall\nsecond\n\n@output jsEval\nreturn $a + $b;';
  const result = await runtime().run(source, {
    models,
    budget: { maxNeuralCalls: 1 }
  });
  assert.equal(result.status, 'partial');
  assert.equal(result.code, 'budget_exceeded');
  assert.equal(result.error.details.budget, 'maxNeuralCalls');
});

test('returns a partial outcome when the epoch budget is exhausted', async () => {
  const source =
    '@a jsEval\nreturn 1;\n\n@expand jsEval\ncircuit.addWire("b", { command: "jsEval", body: "return 2;" });\nreturn circuit.commit({ result: "expanded" });\n\n@output jsEval\nreturn $a + $b;';
  const result = await runtime().run(source, { controlRoots: ['expand'], budget: { maxEpochs: 1 } });
  assert.equal(result.status, 'partial');
  assert.equal(result.code, 'budget_exceeded');
  assert.equal(result.error.details.budget, 'maxEpochs');
});

test('reports an effect violation when a pure command stages a container patch', async () => {
  const registry = createRegistry([
    ...createStandardCommands(),
    {
      name: 'sneaky',
      version: '1.0.0',
      effectClass: 'pure',
      analyze: () => ({ values: [], structural: [], containerReads: [], containerWrites: [] }),
      validate: () => ({ ok: true }),
      async execute(ctx) {
        ctx.stagePatch({ target: 'claims', operation: 'add', items: [{ id: 'x' }] });
        return 1;
      }
    }
  ]);
  const result = await createRuntime({ registry }).run(
    '@claims container\nkind: table\nprimaryKey: id\n\n@sneak sneaky\n\n@output jsEval\nreturn $sneak + $claims.records.length;',
    { outputs: ['output'] }
  );
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'effect_not_permitted');
});

test('a jsEval wire may stage a structural transaction but not violate its declaration', async () => {
  const result = await runtime().run(
    '@a jsEval\nreturn 1;\n\n@expand jsEval\ncircuit.addWire("b", { command: "jsEval", body: "return 2;" });\nreturn circuit.commit({ result: "expanded" });\n\n@output jsEval\nreturn $a + $b;',
    { outputs: ['output'], controlRoots: ['expand'] }
  );
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.output, 3);
});

test('a container contribution activates for an ordinary value read', async () => {
  const source = [
    '@rows container',
    'kind: sequence',
    '',
    '@add containerAdd',
    'target: rows',
    'items:',
    '  - value: 1',
    '',
    '@output jsEval',
    'return $rows.records.length;'
  ].join('\n');
  const result = await runtime().run(source, { outputs: ['output'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.output, 1);
  assert.equal(result.containers[0].revision, 1);
});

test('a direct container output observes the committed state', async () => {
  const source = [
    '@rows container',
    'kind: sequence',
    '',
    '@add containerAdd',
    'target: rows',
    'items:',
    '  - value: 1'
  ].join('\n');
  const result = await runtime().run(source, { outputs: ['rows'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.rows.records.length, 1);
  assert.equal(result.outputs.rows.revision, 1);
});

test('a model call that reads a container observes the committed state', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    '',
    '@add containerAdd',
    'target: claims',
    'items:',
    '  - id: c1',
    '',
    '@judgment modelCall',
    'How many claims are recorded in $claims?',
    ''
  ].join('\n');
  let observed = null;
  const result = await runtime().run(source, {
    outputs: ['judgment'],
    models: {
      modelCall: async ({ values }) => {
        observed = values.claims;
        return 'one';
      }
    }
  });
  assert.equal(result.status, 'completed');
  assert.equal(observed.records.length, 1);
});

test('invalidateWire invalidates all affected consumers', async () => {
  let calls = 0;
  const models = {
    modelCall: async () => {
      calls += 1;
      return String(calls);
    }
  };
  const source = [
    '@judge modelCall',
    'Give the current observation of $seed.',
    '',
    '@refresh jsEval',
    'circuit.invalidateWire("judge", { reason: "external event" });',
    'return circuit.commit({ result: "refreshed" });',
    '',
    '@output jsEval',
    'return String($judge);'
  ].join('\n');
  const result = await runtime().run(source, {
    inputs: { seed: 1 },
    outputs: ['output'],
    controlRoots: ['refresh'],
    models
  });
  assert.equal(result.status, 'completed');
  assert.equal(calls, 2, 'the observation was refreshed once');
  assert.equal(result.outputs.output, '2', 'the consumer reflects the current observation');
});

test('a malformed program returns a failed outcome instead of a rejected promise', async () => {
  const result = await runtime().run('not a circuit');
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'parse_error');
  assert.equal(result.epochs, 0);
  assert.deepEqual(result.outputs, {});
  assert.equal(result.trace.entries.filter((entry) => entry.type === 'error').length, 1);
});

test('a failing wire records its identity and keeps earlier progress in the trace', async () => {
  const source = '@a literal\n1\n\n@boom jsEval\nthrow new Error("kaboom");\n\n@output jsEval\nreturn $a + $boom;';
  const result = await runtime().run(source, { outputs: ['output'] });
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'execution_error');
  const failure = result.trace.entries.find((entry) => entry.type === 'error');
  assert.equal(failure.wire, 'boom');
  assert.equal(failure.command, 'jsEval');
  assert.equal(failure.commandVersion, '2.0.0');
  assert.equal(typeof failure.definitionHash, 'string');
  assert.ok(result.trace.entries.some((entry) => entry.wire === 'a' && entry.type === 'value'));
});
