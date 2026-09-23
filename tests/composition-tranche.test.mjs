/**
 * The tranche compositions of `teacher/procedural/compositions.mjs`.
 *
 * The next dataset tranche extends the composition inventory with the census
 * operations the book families perform that the original operators did not
 * cover: time arithmetic (`elapsed`), graph traversal (`neighbourCount`,
 * `pathExists`), probability (`probability`), and two-dimensional geometry
 * (`rectangleArea`). Each is a well-typed chain whose family derives from one
 * composition entry, and every new family must satisfy the same three
 * properties the earlier tranches guarantee:
 *
 * - the statement parse round-trips the drawn slots exactly;
 * - the circuit agrees with the independent oracle on at least 20 samples;
 * - a statement that names a different operation is refused by the parse.
 *
 * The existing compositions are re-checked lightly so a tranche cannot break
 * what the previous one shipped.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { compositionFamilies } from '../teacher/procedural/composition-families.mjs';
import { COMPOSITIONS, assertInventoryIsWellFormed } from '../teacher/procedural/compositions.mjs';
import { sampleInstances } from '../teacher/procedural/random.mjs';
import { buildProgram } from '../teacher/families/index.mjs';
import { answerMatches } from '../teacher/naming.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { canonicalJson } from '../teacher/procedural/index.mjs';

const SEED = 20260923;
const TRANCHE_OPERATORS = ['elapsed', 'neighbourCount', 'pathExists', 'probability', 'rectangleArea'];
const WRONG_TERMINAL = 'take the area of a square with that side';

/** The composition entries the tranche added, i.e. the ones using a new operator. */
const trancheCompositions = COMPOSITIONS.filter((entry) => entry.chain.some((name) => TRANCHE_OPERATORS.includes(name)));
const trancheFamilies = trancheCompositions.map((entry) => compositionFamilies.find((family) => family.id === entry.id));
const existingFamilies = compositionFamilies.filter((family) => !trancheCompositions.some((entry) => entry.id === family.id));

function programFor(family, slots) {
  return buildProgram({ compute: family.compute, wires: family.wires }, slots);
}

/** Swap the terminal operator sentence for a sentence no stage of the chain recognises. */
function wrongStatementFor(statement) {
  return statement.replace(/^(.*, then )(.*?)(\. Report .+)$/, `$1${WRONG_TERMINAL}$3`);
}

test('the inventory is well formed and declares the tranche operators', () => {
  const summary = assertInventoryIsWellFormed();
  assert.equal(summary.compositions, COMPOSITIONS.length);
  assert.ok(COMPOSITIONS.length >= 48, `expected at least 48 compositions, got ${COMPOSITIONS.length}`);
  assert.equal(trancheCompositions.length, 11);
  for (const family of trancheFamilies) {
    assert.ok(family !== undefined, `${family?.id ?? '?'} is missing its family`);
    assert.equal(family.type, family.id);
  }
});

test('every tranche family round-trips its drawn slots and stays English', () => {
  for (const family of trancheFamilies) {
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

test('every tranche family circuit agrees with the independent oracle on 20 samples', async () => {
  const runtime = createRuntime();
  for (const family of trancheFamilies) {
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

test('a statement naming a different terminal operation is refused', () => {
  for (const family of trancheFamilies) {
    for (const instance of sampleInstances({ family, seed: SEED, count: 5 })) {
      const wrong = wrongStatementFor(instance.statement);
      assert.notEqual(wrong, instance.statement, `${family.id} did not actually swap the terminal sentence`);
      assert.throws(() => family.parse(wrong), /operation|chain|unit|probability|neighbour|path|conversion|rectangle/, `${family.id} accepted a wrong operation`);
    }
  }
});

test('the existing compositions still round-trip and agree with their oracles', async () => {
  const runtime = createRuntime();
  for (const family of existingFamilies) {
    for (const instance of sampleInstances({ family, seed: SEED, count: 3 })) {
      assert.equal(
        canonicalJson(family.parse(instance.statement)),
        canonicalJson(instance.slots),
        `${family.id} instance ${instance.index} does not round-trip`
      );
      const expected = family.render(family.solve(instance.slots));
      const result = await runtime.run(programFor(family, instance.slots), { outputs: ['answer'] });
      assert.equal(result.status, 'completed', `${family.id} instance ${instance.index} ended ${result.status}:${result.code}`);
      assert.ok(
        answerMatches(expected, String(result.outputs.answer)),
        `${family.id} instance ${instance.index}: oracle "${expected}" against circuit "${result.outputs.answer}"`
      );
    }
  }
});
