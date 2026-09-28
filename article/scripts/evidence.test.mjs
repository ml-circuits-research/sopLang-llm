import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { coalitionValue, joinValue } from './restricted-comparators.mjs';
import { createRuntime } from '../../runtime/kernel.mjs';

test('coalition equivalence preserves membership and seats and rejects unsupported claims', () => {
  assert.equal(coalitionValue('AB with 8 seats, AC with 7 seats.'),
    coalitionValue('CA with 7 seats; BA with 8 seats'));
  assert.notEqual(coalitionValue('AB with 9 seats'), coalitionValue('AB with 8 seats'));
  assert.notEqual(coalitionValue('AC with 8 seats'), coalitionValue('AB with 8 seats'));
  for (const value of ['AB with 8 seats; BA with 8 seats', 'AAB with 8 seats',
    'AB with 8 seats but it is invalid', 'AB with 8 seats; none', 'AB with 9007199254740993 seats', '', null]) {
    assert.equal(coalitionValue(value), null);
  }
});

test('join equivalence requires time and polarity in a complete supported sentence', () => {
  const text = 'The earliest safe completion time is 46 minutes, so the plan ';
  assert.equal(joinValue(text + 'is not feasible.'), joinValue(text + 'does not meet the limit.'));
  assert.notEqual(joinValue(text + 'is feasible.'), joinValue(text + 'is not feasible.'));
  assert.notEqual(joinValue(text + 'is feasible.'), joinValue(text.replace('46', '45') + 'is feasible.'));
  for (const value of [text + 'is not infeasible.', text + 'is feasible. Actually, no.',
    '46; false', 'Not ' + text + 'is feasible.', text.replace('46', '9007199254740993') + 'is feasible.', null]) assert.equal(joinValue(value), null);
});

test('illustrative graph circuit executes and distinguishes disconnected and absent targets', async () => {
  const source = await readFile(new URL('../evidence/illustrative-graph.sop', import.meta.url), 'utf8');
  const runtime = createRuntime();
  const connected = await runtime.run(source, { outputs: ['answer'] });
  assert.equal(connected.status, 'completed');
  assert.equal(connected.outputs.answer, 'yes');
  const disconnected = await runtime.run(source.replace('["B","C"]', '["C","D"]'), { outputs: ['answer'] });
  assert.equal(disconnected.status, 'completed');
  assert.equal(disconnected.outputs.answer, 'no');
  const absent = await runtime.run(source.replace('"target":"C"', '"target":"E"'), { outputs: ['answer'] });
  assert.equal(absent.status, 'failed');
});

test('archived descriptive comparisons retain the intended population boundaries', async () => {
  const evidence = JSON.parse(await readFile(new URL('../evidence/results.json', import.meta.url)));
  assert.equal(evidence.recordCount, 7050);
  for (const arm of evidence.arms) {
    assert.equal(arm.items, 705);
    assert.equal(arm.comparatorDiscrepancies, 0);
  }
  const vocabulary = evidence.comparisons.find(row => row.left.startsWith('exp-016'));
  assert.deepEqual([vocabulary.common, vocabulary.changedOracles, vocabulary.leftOnlyMatch, vocabulary.rightOnlyMatch], [705, 0, 63, 2]);
  const changed = evidence.comparisons.find(row => row.left.startsWith('exp-021') && row.right.startsWith('exp-027'));
  assert.deepEqual([changed.common, changed.onlyLeftIds, changed.onlyRightIds, changed.changedOracles], [655, 50, 50, 100]);
});
