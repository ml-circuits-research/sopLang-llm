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

  // A family that asserts something about its own domain keeps its assertion, and
  // gets the helper it calls: that text is the family's, not a fixed preamble.
  const asserting = buildProgram(
    { compute: 'probe($slots.value > 0, "the value must be positive");\nreturn "answer";' },
    { value: 1 }
  );
  const assertingAnswer = parseCircuit(asserting, { sourceName: 'probe-fixture' }).wires
    .find((wire) => wire.name === 'answer');
  assert.ok(assertingAnswer.body.startsWith(PROBE_HELPER));
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
