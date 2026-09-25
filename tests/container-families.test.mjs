/**
 * The container tranche of `teacher/procedural/containers.mjs`.
 *
 * The seventh dataset tranche adds the container plan shapes of
 * containers-plan.md step 5: a declared store built in stages, a declared
 * store patched by a keyed upsert under a merge policy, and a declared store
 * queried through a derived view. Every new family must satisfy the same three
 * properties the earlier tranches guarantee:
 *
 * - the statement parse round-trips the drawn slots exactly;
 * - the circuit agrees with the independent oracle on at least 20 samples;
 * - a statement that names a different operation is refused by the parse.
 *
 * The families are reached through `teacher/procedural/index.mjs`, the same
 * loader every other standalone family module ships behind, so this test also
 * pins that export. The query family's honest empty filter is pinned on a
 * hand-built instance: zero kept records renders "0 shipments ..." rather than
 * failing the execution.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { containerFamilies, canonicalJson, validateProceduralFamily } from '../teacher/procedural/index.mjs';
import { sampleInstances } from '../teacher/procedural/random.mjs';
import { buildProgram } from '../teacher/families/index.mjs';
import { answerMatches } from '../teacher/naming.mjs';
import { createRuntime } from '../runtime/kernel.mjs';

const SEED = 20260925;
const PER_FAMILY = 20;
const WRONG_QUESTION = 'What is the sum of the shipment ids?';
const MUTATION_COMMANDS = new Set(['containerAdd', 'containerUpsert', 'containerRemove']);

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

test('the container tranche exports three valid families', () => {
  assert.equal(containerFamilies.length, 3);
  assert.deepEqual(containerFamilies.map((family) => family.id), [
    'store-built-in-stages',
    'store-patched-by-upsert',
    'kept-shipments-query'
  ]);
  for (const family of containerFamilies) {
    validateProceduralFamily(family, `containers.mjs family ${family.id}`);
    assert.equal(family.type, family.id);
    assert.equal(family.category, 'no-knowledge');
    // Every container circuit carries a declaration, at least one mutation, and
    // at least one read of the container (the answer reads the store or view).
    assert.ok(family.wires.some((wire) => wire.command === 'container'), `${family.id} declares no container`);
    assert.ok(family.wires.some((wire) => MUTATION_COMMANDS.has(wire.command)), `${family.id} stages no mutation`);
  }
});

test('every container family round-trips its drawn slots', () => {
  for (const family of containerFamilies) {
    for (const instance of sampleInstances({ family, seed: SEED, count: PER_FAMILY })) {
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

test('every container family circuit agrees with the independent oracle on 20 samples', async () => {
  const runtime = createRuntime();
  for (const family of containerFamilies) {
    for (const instance of sampleInstances({ family, seed: SEED, count: PER_FAMILY })) {
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
  for (const family of containerFamilies) {
    for (const instance of sampleInstances({ family, seed: SEED, count: 5 })) {
      const wrong = wrongStatementFor(instance.statement);
      assert.notEqual(wrong, instance.statement, `${family.id} did not actually swap the question`);
      assert.throws(
        () => family.parse(wrong),
        /shipment|quantity|stage|replaced|kept|store|threshold/,
        `${family.id} accepted a wrong operation`
      );
    }
  }
});

test('an empty filter renders a zero answer instead of failing', async () => {
  const family = containerFamilies.find((candidate) => candidate.id === 'kept-shipments-query');
  const slots = { records: [{ id: 'A', quantity: 4 }, { id: 'B', quantity: 9 }], threshold: 10 };
  const runtime = createRuntime();
  const result = await runtime.run(programFor(family, slots), { outputs: ['answer'] });
  assert.equal(result.status, 'completed', result.error?.message ?? result.code);
  assert.equal(String(result.outputs.answer), '0 shipments were kept, and their total quantity is 0 units.');
});
