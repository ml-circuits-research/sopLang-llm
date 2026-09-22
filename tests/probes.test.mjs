import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildProgram, planFingerprint } from '../teacher/families/index.mjs';
import { answerBody, probeCount, probeFindings, PROBE_HELPER } from '../teacher/families/probes.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { parseCircuit } from '../runtime/parser.mjs';

test('an assembled dataset circuit teaches the computation and not the generic contract', () => {
  // The generic input and output contract belongs to the `jsEval` command (version
  // 2), so the trained form carries no fixed preamble: a family whose computation
  // asserts nothing of its own assembles exactly its computation.
  const plain = buildProgram({ compute: 'return "answer";' }, { value: 1 });
  const plainAnswer = parseCircuit(plain, { sourceName: 'probe-fixture' }).wires
    .find((wire) => wire.name === 'answer');
  assert.equal(plainAnswer.body, 'return "answer";');
  assert.ok(!plainAnswer.body.includes(PROBE_HELPER), 'the preamble must not be injected');
  assert.deepEqual(probeFindings(plain), [{ wire: 'answer', probes: 0, assertions: 0 }]);

  // A family that asserts something about its own domain keeps its assertion as a
  // bare probe(...) call: the helper is provided by the sandbox (jsEval command
  // version 2.1), so the target carries no helper definition, and the runtime
  // resolves the call.
  const asserting = buildProgram(
    { compute: 'probe($slots.value > 0, "the value must be positive");\nreturn "answer";' },
    { value: 1 }
  );
  const assertingAnswer = parseCircuit(asserting, { sourceName: 'probe-fixture' }).wires
    .find((wire) => wire.name === 'answer');
  assert.ok(!assertingAnswer.body.includes(PROBE_HELPER), 'the helper is the sandbox\'s, not the target\'s');
  assert.equal(probeCount(assertingAnswer.body), 1);
  assert.deepEqual(probeFindings(asserting), [{ wire: 'answer', probes: 1, assertions: 1 }]);
});

test('a valid dataset circuit executes and returns the computed answer', async () => {
  const runtime = createRuntime();
  const result = await runtime.run(buildProgram({ compute: 'return String($slots.value * 2);' }, { value: 21 }), {
    outputs: ['answer']
  });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.answer, '42');
});

test('a failing domain probe ends the run as a structured execution error', async () => {
  const runtime = createRuntime();
  const result = await runtime.run(
    buildProgram({ compute: 'probe($slots.value > 100, "the value must exceed one hundred");\nreturn "answer";' }, { value: 1 }),
    { outputs: ['answer'] }
  );
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'execution_error');
  assert.match(result.error.message, /probe failed: the value must exceed one hundred/);
});

test('the output probe refuses an empty answer', async () => {
  const runtime = createRuntime();
  const result = await runtime.run(buildProgram({ compute: 'return "";' }, { value: 1 }), { outputs: ['answer'] });
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'execution_error');
});

test('the probe harness does not change the plan fingerprint', () => {
  const entry = { compute: 'return "answer";' };
  assert.equal(planFingerprint(entry), '\n===\nreturn "answer";');
  assert.equal(answerBody(entry.compute).includes(entry.compute), true);
});

test('the jsEval command owns the input and output contract the targets no longer restate', async () => {
  // This contract is what replaced the fixed preamble inside every generated target,
  // so it is the load-bearing part of that change: if a clause stops firing, the
  // dataset loses a guarantee it used to get from text the model had to emit.
  const runtime = createRuntime();
  const run = (source, output = 'answer') => runtime.run(source, { outputs: [output] });
  const code = (result) => (result.status === 'completed' ? 'completed' : result.code);

  // The input clause: a compiled record must be a non-empty object.
  assert.equal(code(await run('@slots literal\n{}\n\n@answer jsEval\nreturn Object.keys($slots).length;')), 'execution_error');
  assert.equal(code(await run('@slots literal\n[1, 2]\n\n@answer jsEval\nreturn $slots.length;')), 'execution_error');
  assert.equal(code(await run('@slots literal\nnull\n\n@answer jsEval\nreturn $slots === null ? "n" : "y";')), 'execution_error');
  assert.equal(code(await run('@slots literal\n{"v": 3}\n\n@answer jsEval\nreturn $slots.v;')), 'completed');

  // The output clause: absence is not a value and ends the run, while zero, false,
  // and an empty list are values and pass. A body that published its result through
  // a staged transaction returns nothing by design and is exempt.
  assert.equal(code(await run('@slots literal\n{"v": 1}\n\n@answer jsEval\nreturn null;')), 'execution_error');
  assert.equal(code(await run('@slots literal\n{"v": 1}\n\n@answer jsEval\nreturn undefined;')), 'execution_error');
  assert.equal(code(await run('@slots literal\n{"v": 1}\n\n@answer jsEval\nreturn "";')), 'execution_error');
  assert.equal(code(await run('@slots literal\n{"v": 1}\n\n@answer jsEval\nreturn 0;')), 'completed');
  assert.equal(code(await run('@slots literal\n{"v": 1}\n\n@answer jsEval\nreturn false;')), 'completed');
  assert.equal(code(await run('@slots literal\n{"v": 1}\n\n@answer jsEval\nreturn [];')), 'completed');
  assert.equal(code(await run('@p jsEval\nreturn circuit.commit({ k: "v", result: 7 });', 'p')), 'completed');
});
