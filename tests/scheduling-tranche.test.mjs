/**
 * The scheduling tranche of `teacher/procedural/scheduling.mjs`.
 *
 * The fourth dataset tranche adds the task-dependency and scheduling shapes the
 * decompose-to-solve book uses and the composition inventory still lacks: the
 * earliest finish time of a precedence DAG, a deadline verdict over that DAG,
 * the transitive prerequisite count of one task, and the bottleneck capacity of
 * a route in series. Every new family must satisfy the same three properties
 * the earlier tranches guarantee:
 *
 * - the statement parse round-trips the drawn slots exactly;
 * - the circuit agrees with the independent oracle on at least 20 samples;
 * - a statement that names a different operation is refused by the parse.
 *
 * The families are reached through `teacher/procedural/index.mjs`, the same
 * loader every other standalone family module ships behind, so this test also
 * pins that export.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { schedulingFamilies, canonicalJson, validateProceduralFamily } from '../teacher/procedural/index.mjs';
import { sampleInstances } from '../teacher/procedural/random.mjs';
import { buildProgram } from '../teacher/families/index.mjs';
import { answerMatches } from '../teacher/naming.mjs';
import { createRuntime } from '../runtime/kernel.mjs';

const SEED = 20260924;
const WRONG_QUESTION = 'How many of the tasks are prime?';

function programFor(family, slots) {
  return buildProgram({ compute: family.compute, wires: family.wires }, slots);
}

/** Swap the closing question for a question no family of this tranche accepts. */
function wrongStatementFor(statement) {
  const boundary = statement.lastIndexOf('. ');
  if (boundary === -1) {
    return statement;
  }
  return `${statement.slice(0, boundary + 1)} ${WRONG_QUESTION}`;
}

test('the scheduling tranche exports four valid families', () => {
  assert.equal(schedulingFamilies.length, 4);
  const ids = schedulingFamilies.map((family) => family.id);
  assert.deepEqual(ids, [
    'schedule-finish-time',
    'schedule-deadline-feasibility',
    'task-prerequisite-count',
    'route-bottleneck-capacity'
  ]);
  for (const family of schedulingFamilies) {
    validateProceduralFamily(family, `scheduling.mjs family ${family.id}`);
    assert.equal(family.type, family.id);
    assert.equal(family.category, 'no-knowledge');
  }
});

test('every scheduling family round-trips its drawn slots and stays English', () => {
  for (const family of schedulingFamilies) {
    for (const instance of sampleInstances({ family, seed: SEED, count: 20 })) {
      assert.equal(
        canonicalJson(family.parse(instance.statement)),
        canonicalJson(instance.slots),
        `${family.id} instance ${instance.index} does not round-trip`
      );
      const answer = family.render(family.solve(instance.slots));
      assert.ok(answer.length > 0, `${family.id} instance ${instance.index} rendered an empty answer`);
      assert.ok(!instance.statement.includes(answer), `${family.id} instance ${instance.index} prints its own answer`);
    }
  }
});

test('every scheduling family circuit agrees with the independent oracle on 20 samples', async () => {
  const runtime = createRuntime();
  for (const family of schedulingFamilies) {
    for (const instance of sampleInstances({ family, seed: SEED, count: 20 })) {
      const result = await runtime.run(programFor(family, instance.slots), { outputs: ['answer'] });
      assert.equal(
        result.status,
        'completed',
        `${family.id} instance ${instance.index} ended ${result.status}:${result.code} (${result.error?.message ?? ''})`
      );
      const expected = family.render(family.solve(instance.slots));
      assert.ok(
        answerMatches(expected, String(result.outputs.answer)),
        `${family.id} instance ${instance.index}: oracle "${expected}" against circuit "${result.outputs.answer}"`
      );
    }
  }
});

test('a statement naming a different operation is refused', () => {
  for (const family of schedulingFamilies) {
    for (const instance of sampleInstances({ family, seed: SEED, count: 5 })) {
      const wrong = wrongStatementFor(instance.statement);
      assert.notEqual(wrong, instance.statement, `${family.id} did not actually swap the question`);
      assert.throws(
        () => family.parse(wrong),
        /finish|deadline|bottleneck|capacit|target|task|schedule|precedence/,
        `${family.id} accepted a wrong operation`
      );
    }
  }
});
