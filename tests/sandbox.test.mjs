import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRuntime } from '../runtime/kernel.mjs';
import { createJsSandbox } from '../runtime/sandbox.mjs';

test('a dependency value arrives in the guest realm as a copy', async () => {
  const sandbox = createJsSandbox({ timeoutMs: 500 });
  const rows = [1];
  const outcome = await sandbox.run({
    body: '$rows.push(2);\nreturn { length: $rows.length };',
    values: { rows },
    wire: 'mutate'
  });
  assert.equal(outcome.length, 2);
  assert.deepEqual(rows, [1], 'the caller value is unchanged');
});

test('a sibling wire observes the caller value unchanged in the same epoch', async () => {
  const source = [
    '@base jsEval',
    'return [1];',
    '',
    '@mutate jsEval',
    '$base.push(2);',
    'return $base.length;',
    '',
    '@observe jsEval',
    'return $base.length;'
  ].join('\n');
  const result = await createRuntime().run(source, { outputs: ['observe', 'mutate'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.mutate, 2, 'the mutating wire sees its own copy');
  assert.equal(result.outputs.observe, 1, 'the sibling still observes the committed value');
});

test('a container snapshot cannot be mutated through a guest body', async () => {
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
    '@view containerFilter',
    'source: $claims',
    'predicate:',
    '  return true;',
    '',
    '@tamper jsEval',
    '$view.records[0].text = "changed";',
    'return $view.records[0].text;',
    '',
    '@observe jsEval',
    'return $view.records[0].text;'
  ].join('\n');
  const result = await createRuntime().run(source, { outputs: ['observe', 'tamper'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.tamper, 'changed');
  assert.equal(result.outputs.observe, 'first', 'the stored record is unchanged');
  const claims = result.containers.find((container) => container.name === 'claims');
  assert.equal(claims.revision, 1, 'no patch was committed by the mutation');
});

test('generated code cannot reach the host process or the module system', async () => {
  const sandbox = createJsSandbox({ timeoutMs: 500 });
  const outcome = await sandbox.run({
    body: [
      'const attempts = [',
      '  typeof process,',
      '  typeof require,',
      '  typeof globalThis.process,',
      '  circuit.constructor.constructor("return typeof process")(),',
      '  (function () {}).constructor("return typeof require")(),',
      '  globalThis.constructor.constructor("return typeof process")()',
      '];',
      'return attempts.join("|");'
    ].join('\n'),
    values: {},
    wire: 'escape',
    definitions: '[]'
  });
  assert.equal(outcome, 'undefined|undefined|undefined|undefined|undefined|undefined');
});

test('a nonterminating body ends as a structured budget outcome', async () => {
  const runtime = createRuntime({ javascript: { timeoutMs: 150 } });
  const result = await runtime.run('@loop jsEval\nwhile (true) {}', { outputs: ['loop'] });
  assert.equal(result.status, 'partial');
  assert.equal(result.code, 'budget_exceeded');
  assert.equal(result.error.details.budget, 'maxJsTimeMs');
  const followUp = await runtime.run('@value jsEval\nreturn 1;', { outputs: ['value'] });
  assert.equal(followUp.status, 'completed', 'the runtime stays usable after the termination');
});

test('an asynchronous loop is terminated as well', async () => {
  const runtime = createRuntime({ javascript: { timeoutMs: 150 } });
  const result = await runtime.run('@loop jsEval\nwhile (true) { await Promise.resolve(); }', { outputs: ['loop'] });
  assert.equal(result.status, 'partial');
  assert.equal(result.code, 'budget_exceeded');
});

test('cumulative JavaScript time is charged against the budget', async () => {
  const result = await createRuntime({ javascript: { timeoutMs: 1000 } }).run(
    '@work jsEval\nconst until = Date.now() + 30;\nwhile (Date.now() < until) {}\nreturn "done";',
    { outputs: ['work'], budget: { maxJsTimeMs: 5 } }
  );
  assert.equal(result.status, 'partial');
  assert.equal(result.code, 'budget_exceeded');
  assert.equal(result.error.details.budget, 'maxJsTimeMs');
  assert.ok(result.budgets.usage.jsTimeMs >= 5);
});

test('a non-transferable dependency is rejected before the body runs', async () => {
  const result = await createRuntime().run('@out jsEval\nreturn 1;', {
    inputs: { callback: () => 1 },
    outputs: ['out']
  });
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'unsupported_value');
});

test('a non-transferable result is rejected after the body runs', async () => {
  const result = await createRuntime().run('@out jsEval\nreturn () => 1;', { outputs: ['out'] });
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'unsupported_value');
  assert.equal(result.trace.entries.filter((entry) => entry.type === 'error')[0].wire, 'out');
});

test('a filter predicate runs in the isolated realm under the same accounting', async () => {
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
    '@accepted containerFilter',
    'source: $claims',
    'predicate:',
    '  return row.confidence >= $threshold && typeof process === "undefined";',
    '',
    '@ids jsEval',
    'return $accepted.records.map((record) => record.id);'
  ].join('\n');
  const result = await createRuntime().run(source, { inputs: { threshold: 0.5 }, outputs: ['ids'] });
  assert.equal(result.status, 'completed');
  assert.deepEqual(result.outputs.ids, ['k1']);
});

// Hazard: a `new Worker(source, { eval: true })` inherits the parent process's
// `execArgv`. Under a host launched with `node --input-type=module -e`, Node
// parses the sandbox's CommonJS worker source as ECMAScript, `require` is
// undefined in that module scope, and every `jsEval` call fails with
// "The JavaScript worker failed: require is not defined in ES module scope".
// The worker must therefore be created with an explicit `execArgv`, and this
// regression test launches the runtime under that exact flag because the
// in-process suite (which runs from `.mjs` files) never exercises it.
test('the guest worker completes a jsEval wire under an inherited --input-type=module host', () => {
  const kernelPath = fileURLToPath(new URL('../runtime/kernel.mjs', import.meta.url));
  const script = [
    'const { createRuntime } = await import(' + JSON.stringify(pathToFileURL(kernelPath).href) + ');',
    'const result = await createRuntime().run("@out jsEval\\nreturn [3, 1, 2].sort().join(\\",\\");", { outputs: ["out"] });',
    'if (result.status !== "completed" || result.outputs.out !== "1,2,3") {',
    '  console.error(JSON.stringify({ status: result.status, code: result.code, message: result.error?.message }));',
    '  process.exit(1);',
    '}',
    'console.log("ok");'
  ].join('\n');
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8' });
  assert.equal(child.status, 0, `child failed: ${child.stderr}`);
  assert.equal(child.stdout.trim(), 'ok');
});
