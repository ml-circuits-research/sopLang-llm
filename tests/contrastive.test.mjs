import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createRuntime } from '../runtime/kernel.mjs';
import { buildProgram } from '../teacher/families/index.mjs';
import { answerMatches } from '../teacher/naming.mjs';
import { PAIR_KINDS, families } from '../teacher/procedural/contrastive.mjs';
import { sampleInstances } from '../teacher/procedural/random.mjs';

/** A deterministic draw, so a failure names a reproducible instance. */
function draw(seed, count = 25) {
  return families.flatMap((family) =>
    sampleInstances({ family, seed, count }).map((instance) => ({ family, slots: instance.slots })));
}

const drawn = draw(20260922);

test('every family round-trips its own statement through parse', () => {
  // The live generator refuses a family whose parse does not read back what the
  // statement states, so this is the check the dataset build would fail on.
  for (const { family, slots } of drawn) {
    const parsed = family.parse(family.statement(slots));
    assert.deepEqual(parsed, slots, `${family.id}: the statement does not read back as the slots it was rendered from`);
  }
});

test('every circuit computes the oracle for its own parse', async () => {
  const runtime = createRuntime();
  for (const { family, slots } of drawn) {
    const parsed = family.parse(family.statement(slots));
    const expected = family.render(family.solve(parsed));
    const result = await runtime.run(buildProgram(family, parsed), { outputs: ['answer'] });
    assert.equal(result.status, 'completed', `${family.id}: the circuit did not complete (${result.code})`);
    assert.ok(answerMatches(expected, String(result.outputs.answer)),
      `${family.id}: the circuit says "${result.outputs.answer}" and the oracle says "${expected}"`);
  }
});

test('each pair member changes the answer when only the decisive phrase changes', () => {
  // This is the property the arm exists for: the same ledger, the same numbers,
  // the same wording, one decisive phrase moved, and a different required answer.
  // A family matching the template instead of the statement answers both members
  // alike, which this test refuses.
  for (const { kind, members } of PAIR_KINDS) {
    const [leftId, rightId] = members;
    const left = families.find((family) => family.id === leftId);
    const right = families.find((family) => family.id === rightId);
    assert.ok(left !== undefined && right !== undefined, `${kind}: both members must exist`);
    assert.equal(left.pairKind, kind);
    assert.equal(right.pairKind, kind);
    assert.notEqual(left.pairRole, right.pairRole, `${kind}: the members must play different roles`);
    for (const { slots } of draw(20260922, 40).filter(({ family: drawnFamily }) => drawnFamily.id === leftId)) {
      const shared = { ...slots, values: [...slots.values] };
      const leftAnswer = left.render(left.solve(left.parse(left.statement(slots))));
      const rightAnswer = right.render(right.solve(right.parse(right.statement(shared))));
      assert.notEqual(leftAnswer, rightAnswer,
        `${kind}: ${leftId} and ${rightId} answered alike on ${JSON.stringify(shared)}, so the pair is unobservable`);
    }
  }
});

test('the boundary pair keeps the record equal to the threshold on exactly one side', () => {
  const above = families.find((family) => family.id === 'filtered-records-above-a-threshold');
  const atLeast = families.find((family) => family.id === 'filtered-records-at-least-a-threshold');
  for (const { family, slots } of drawn.filter(({ family: drawnFamily }) => drawnFamily.id === 'filtered-records-above-a-threshold')) {
    const boundary = slots.values.filter((value) => value === slots.threshold);
    assert.equal(boundary.length, 1, `the ledger ${JSON.stringify(slots.values)} must state the threshold ${slots.threshold} exactly once`);
    const parsed = { ...slots, values: [...slots.values] };
    const aboveSolution = above.solve(parsed);
    const atLeastSolution = atLeast.solve(parsed);
    assert.equal(atLeastSolution.kept, aboveSolution.kept + 1, 'the threshold record is kept by one side only');
    assert.equal(atLeastSolution.total, aboveSolution.total + slots.threshold, 'and it adds exactly the threshold to the total');
  }
});

test('a family refuses the statement of its pair partner', () => {
  // The decisive word is what tells the two apart, so parsing the other member's
  // statement must fail rather than silently compute the wrong operation.
  for (const { members } of PAIR_KINDS) {
    const [leftId, rightId] = members;
    const left = families.find((family) => family.id === leftId);
    const right = families.find((family) => family.id === rightId);
    for (const { family, slots } of drawn.filter(({ family: drawnFamily }) => drawnFamily.id === leftId).slice(0, 5)) {
      const partnerFamily = right;
      assert.throws(() => partnerFamily.parse(family.statement(slots)),
        `${partnerFamily.id} accepted the statement of its pair partner`);
    }
  }
});
