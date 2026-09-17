import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRuntime } from '../runtime/kernel.mjs';
import { TraceLog, recordOutcome } from '../runtime/trace.mjs';
import { hashValue, hashDefinition, canonicalJson } from '../runtime/hashing.mjs';

test('a completed run writes a value entry per executed wire', async () => {
  const result = await createRuntime().run('@a literal\n2\n\n@b literal\n3\n\n@output jsEval\nreturn $a + $b;');
  const values = result.trace.entries.filter((entry) => entry.type === 'value');
  assert.deepEqual(
    values.map((entry) => entry.wire),
    ['a', 'b', 'output']
  );
  for (const entry of values) {
    assert.equal(typeof entry.definitionHash, 'string');
    assert.equal(typeof entry.outputHash, 'string');
    assert.ok(entry.startedAt <= entry.finishedAt);
  }
});

test('the trace records dependency identities per wire', async () => {
  const result = await createRuntime().run('@a literal\n1\n\n@output jsEval\nreturn $a;');
  const outputEntry = result.trace.entries.find((entry) => entry.wire === 'output');
  assert.deepEqual(
    outputEntry.dependencies.map((dependency) => dependency.name),
    ['a']
  );
  const dependency = outputEntry.dependencies[0];
  assert.equal(dependency.definitionHash, result.trace.entries.find((entry) => entry.wire === 'a').definitionHash);
  assert.equal(dependency.outputHash, result.trace.entries.find((entry) => entry.wire === 'a').outputHash);
});

test('a neural call records generation metadata', async () => {
  const models = {
    modelCall: async () => ({
      text: 'yes',
      modelRevision: 'student-r1',
      sampling: { temperature: 0 },
      promptTokens: 12,
      completionTokens: 1,
      latencyMs: 5
    })
  };
  const result = await createRuntime().run('@verdict modelCall\nIs $a equal to $b?', {
    inputs: { a: 1, b: 1 },
    outputs: ['verdict'],
    models
  });
  const call = result.trace.entries.find((entry) => entry.type === 'neural_call');
  assert.equal(call.wire, 'verdict');
  assert.equal(call.generation.text, 'yes');
  assert.equal(call.modelRevision, 'student-r1');
  assert.deepEqual(call.sampling, { temperature: 0 });
  assert.equal(call.promptTokens, 12);
  assert.equal(call.latencyMs, 5);
});

test('replay substitutes a recorded generation instead of invoking the model', async () => {
  let invocations = 0;
  const models = {
    modelCall: async () => {
      invocations += 1;
      return 'live-answer';
    }
  };
  const source = '@verdict modelCall\nIs $a equal to $b?\n\n@output jsEval\nreturn $verdict + "!";';
  const live = await createRuntime().run(source, { inputs: { a: 1, b: 1 }, models });
  assert.equal(live.outputs.output, 'live-answer!');
  assert.equal(invocations, 1);

  const replayed = await createRuntime().run(source, {
    inputs: { a: 1, b: 1 },
    mode: 'replay',
    replayFrom: live.trace
  });
  assert.equal(replayed.status, 'completed');
  assert.equal(replayed.outputs.output, 'live-answer!');
  assert.equal(invocations, 1);
});

test('replay fails when no recorded generation exists for a wire', async () => {
  const result = await createRuntime().run('@verdict modelCall\nJudge it.', {
    outputs: ['verdict'],
    mode: 'replay',
    replayFrom: { entries: [] }
  });
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'replay_mismatch');
});

test('replay rejects a changed instruction instead of returning the recorded answer', async () => {
  const models = { modelCall: async () => '1' };
  const first = await createRuntime().run('@read modelCall\nRead $x.', { inputs: { x: 1 }, outputs: ['read'], models });
  assert.equal(first.outputs.read, '1');
  const replayed = await createRuntime().run('@read modelCall\nRead $x carefully.', {
    inputs: { x: 1 },
    outputs: ['read'],
    mode: 'replay',
    replayFrom: first.trace
  });
  assert.equal(replayed.status, 'failed');
  assert.equal(replayed.code, 'replay_mismatch');
  assert.equal(replayed.error.details.wire, 'read');
});

test('replay rejects changed dependency values for an unchanged definition', async () => {
  const models = { modelCall: async () => 'recorded' };
  const source = '@read modelCall\nRead $x.';
  const first = await createRuntime().run(source, { inputs: { x: 1 }, outputs: ['read'], models });
  assert.equal(first.status, 'completed');
  const replayed = await createRuntime().run(source, {
    inputs: { x: 2 },
    outputs: ['read'],
    mode: 'replay',
    replayFrom: first.trace
  });
  assert.equal(replayed.status, 'failed');
  assert.equal(replayed.code, 'replay_mismatch');
});

test('replay records the substituted observation and its provenance', async () => {
  const models = { modelCall: async () => 'yes' };
  const source = '@verdict modelCall\nIs $a equal to $b?\n\n@output jsEval\nreturn $verdict + "!";';
  const live = await createRuntime().run(source, { inputs: { a: 1, b: 1 }, models });
  const replayed = await createRuntime().run(source, {
    inputs: { a: 1, b: 1 },
    mode: 'replay',
    replayFrom: live.trace
  });
  assert.equal(replayed.status, 'completed');
  assert.equal(replayed.outputs.output, 'yes!');
  const entry = replayed.trace.entries.find((candidate) => candidate.type === 'neural_replay');
  assert.equal(entry.generation.text, 'yes');
  assert.equal(entry.provenance.wire, 'verdict');
  assert.equal(
    entry.provenance.definitionHash,
    live.trace.entries.find((candidate) => candidate.type === 'neural_call').definitionHash
  );
  assert.equal(
    replayed.trace.entries.filter((candidate) => candidate.type === 'neural_call').length,
    0,
    'replay performs no fresh model call'
  );
});

test('a successful trace identifies the command version and the graph state', async () => {
  const result = await createRuntime().run('@a literal\n1\n\n@output jsEval\nreturn $a;');
  const entry = result.trace.entries.find((candidate) => candidate.wire === 'output');
  assert.equal(entry.command, 'jsEval');
  assert.equal(entry.commandVersion, '1.1.0');
  assert.equal(entry.circuitRevision, 1);
  assert.equal(entry.dependencies.length, 1);
  assert.equal(entry.dependencies[0].name, 'a');
});

test('a failing wire records the same dependency identities as a value entry', async () => {
  const result = await createRuntime().run(
    '@a literal\n41\n\n@b literal\n1\n\n@boom jsEval\nreturn $a + missingfn($b);',
    { outputs: ['boom'] }
  );
  assert.equal(result.status, 'failed');
  const errorEntry = result.trace.entries.find((candidate) => candidate.type === 'error');
  assert.equal(errorEntry.wire, 'boom');
  const valueEntry = result.trace.entries.find((candidate) => candidate.type === 'value' && candidate.wire === 'output');
  if (valueEntry !== undefined) {
    assert.deepEqual(errorEntry.dependencies, valueEntry.dependencies);
  }
  assert.deepEqual(
    errorEntry.dependencies.map((dependency) => dependency.name),
    ['a', 'b']
  );
  for (const dependency of errorEntry.dependencies) {
    const source = result.trace.entries.find((candidate) => candidate.wire === dependency.name);
    assert.equal(dependency.definitionHash, source.definitionHash);
    assert.equal(dependency.outputHash, source.outputHash);
  }
});

test('TraceLog records one entry per call and filters by type', () => {
  const log = new TraceLog({ circuitRevision: 3 });
  recordOutcome(log, {
    epoch: 1,
    wire: 'a',
    command: 'literal',
    result: { value: 1, error: null, definitionHash: 'h', dependencies: [] },
    startedAt: 0,
    finishedAt: 1
  });
  log.record({ type: 'neural_call', wire: 'b', epoch: 1, generation: { text: 'x' } });
  assert.equal(log.values().length, 1);
  assert.equal(log.neuralCalls().length, 1);
  assert.equal(log.toJSON().circuitRevision, 3);
});

test('canonical hashing is stable across key order', () => {
  assert.equal(canonicalJson({ a: 1, b: 2 }), canonicalJson({ b: 2, a: 1 }));
  assert.equal(hashValue({ a: 1, b: 2 }), hashValue({ b: 2, a: 1 }));
});

test('definition hashes differ when the body differs', () => {
  const first = hashDefinition({ command: 'jsEval', commandVersion: '1.0.0', body: 'return 1;' });
  const second = hashDefinition({ command: 'jsEval', commandVersion: '1.0.0', body: 'return 2;' });
  assert.notEqual(first, second);
});

test('definition hashes ignore trailing whitespace differences', () => {
  const first = hashDefinition({ command: 'jsEval', commandVersion: '1.0.0', body: 'return 1;  ' });
  const second = hashDefinition({ command: 'jsEval', commandVersion: '1.0.0', body: 'return 1;' });
  assert.equal(first, second);
});
