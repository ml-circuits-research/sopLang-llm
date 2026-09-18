import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildProgram, planFingerprint } from '../teacher/families/index.mjs';
import { answerBody, probeCount, probeFindings, PROBE_HELPER } from '../teacher/families/probes.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { parseCircuit } from '../runtime/parser.mjs';

test('every assembled dataset circuit carries the probe harness in its jsEval stage', () => {
  const program = buildProgram({ compute: 'return "answer";' }, { value: 1 });
  const wires = parseCircuit(program, { sourceName: 'probe-fixture' }).wires;
  const answer = wires.find((wire) => wire.name === 'answer');
  assert.ok(answer.body.startsWith(PROBE_HELPER));
  assert.equal(probeCount(answer.body) >= 3, true, 'two input probes and one output probe');
  assert.deepEqual(probeFindings(program), [{ wire: 'answer', probes: probeCount(answer.body) }]);
  assert.match(answer.body, /Object\.keys\(\$slots\)\.length > 0/);
  assert.match(answer.body, /String\(answer\)\.length > 0/);
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
