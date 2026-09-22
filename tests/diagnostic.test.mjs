import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  OPERATORS,
  STRUCTURES,
  buildDiagnosticSuite,
  generateProblem,
  structureFingerprint
} from '../evaluation/diagnostics/suite.mjs';
import { divergenceOf, promptOf, stageAnswers } from '../evaluation/run-diagnostic.mjs';
import { CONTRASTIVE_PAIRS, buildContrastiveSuite } from '../evaluation/diagnostics/pairs.mjs';

const suite = buildDiagnosticSuite({ perStructure: 2 });

test('every problem carries a latent graph whose oracle an independent walk reproduces', () => {
  assert.equal(suite.problems.length, STRUCTURES.length * 2);
  for (const problem of suite.problems) {
    const chain = STRUCTURES.find((structure) => structure.id === problem.structure).chain;
    let value = problem.values.filter((entry) => entry > problem.parameters.threshold);
    assert.ok(value.length >= 2 && value.length < problem.values.length,
      `${problem.id}: the filter must keep some values and drop some`);
    for (const name of chain.slice(1)) {
      value = OPERATORS[name].steps(value, problem.parameters);
    }
    assert.equal(value, problem.oracle, `${problem.id}: the recorded oracle is the chain result`);
    assert.ok(Number.isInteger(problem.oracle), `${problem.id}: the oracle is a whole number`);
  }
});

test('the split is a property of the structure, not of the wording', () => {
  // A structure is development or held, and every instance of it follows: a
  // renderer change must never move a problem across the split.
  const byStructure = new Map();
  for (const problem of suite.problems) {
    byStructure.set(problem.structure, new Set([...(byStructure.get(problem.structure) ?? []), problem.split]));
  }
  for (const [structure, splits] of byStructure) {
    assert.equal(splits.size, 1, `${structure} appears on more than one side of the split`);
  }
  const held = [...byStructure.entries()].filter(([, splits]) => splits.has('held')).map(([structure]) => structure);
  assert.ok(held.length >= 1, 'the suite reserves at least one structure');
  assert.ok(held.length < byStructure.size, 'the suite keeps structures on both sides');
});

test('a problem is reproduced from its seed alone', () => {
  const again = buildDiagnosticSuite({ perStructure: 2 });
  assert.deepEqual(
    again.problems.map((problem) => [problem.id, problem.values, problem.oracle, problem.statement]),
    suite.problems.map((problem) => [problem.id, problem.values, problem.oracle, problem.statement])
  );
  const different = buildDiagnosticSuite({ perStructure: 2, seed: 7 });
  assert.notDeepEqual(
    different.problems.map((problem) => problem.values),
    suite.problems.map((problem) => problem.values)
  );
});

test('the three diagnostic prompts supply exactly what they declare', () => {
  for (const problem of suite.problems) {
    assert.equal(promptOf(problem, 'normal'), problem.statement, 'the deployable condition sees the statement alone');
    assert.ok(promptOf(problem, 'values').includes(problem.valueRecord));
    assert.ok(!promptOf(problem, 'values').includes(problem.planRecord), 'the values condition must not carry the graph');
    assert.ok(promptOf(problem, 'plan').includes(problem.planRecord));
    assert.ok(!promptOf(problem, 'plan').includes(problem.valueRecord), 'the plan condition must not carry the values');
    const both = promptOf(problem, 'both');
    assert.ok(both.includes(problem.valueRecord) && both.includes(problem.planRecord));
    for (const condition of ['values', 'plan', 'both']) {
      assert.ok(!promptOf(problem, condition).includes(String(problem.oracle)) || problem.statement.includes(String(problem.oracle)),
        `${problem.id}/${condition}: the prompt must not state the answer`);
    }
  }
});

test('the divergence classifier names the stage of a wrong answer', () => {
  // A chain with a genuine intermediate stage: filter -> largest -> double, so
  // "largest kept value" is a stage answer that is neither the oracle nor a
  // value the statement stated.
  const problem = suite.problems.find((entry) => entry.structure === 'filter-largest-double');
  const stage = stageAnswers(problem);
  assert.ok(stage.length >= 1, 'the chosen structure has an intermediate stage');
  const classify = (className, answer) => divergenceOf({ className, program: '', answer, problem, oracleOfStage: () => stage });
  assert.equal(classify('answer_match', String(problem.oracle)), 'none');
  assert.equal(classify('execution_error', null), 'runtime_failure');
  assert.equal(classify('parse_invalid', null), 'invalid_syntax');
  assert.equal(classify('answer_mismatch', String(stage[0])), 'missing_final_stage', 'stopping after the intermediate stage is reported as such');
  // A value that is no stage of this chain at all is the residual class.
  const stray = [problem.oracle, ...stage, problem.kept.length].reduce((a, b) => a + b, 0) + 1000;
  assert.equal(classify('answer_mismatch', String(stray)), 'wrong_values_or_operation');
  // A formatting mismatch is the oracle and no other number: a trailing count of
  // the kept records is a stage value, and a stage error is reported before the
  // formatting deviation, because the classifier names the earliest failed stage.
  assert.equal(classify('answer_mismatch', String(problem.oracle)), 'wrong_formatting');
  assert.equal(
    classify('answer_mismatch', `the answer is ${problem.oracle} (from ${problem.kept.length} records)`),
    'stopped_after_filter',
    'an answer that also states a stage value is a stage error first'
  );
});

test('a structure fingerprint covers the composition and its constants, not the values', () => {
  const problem = suite.problems[0];
  assert.match(structureFingerprint(problem), /^[0-9a-f]{12}$/);
  const sibling = suite.problems.find((entry) => entry.structure === problem.structure && entry.id !== problem.id);
  if (sibling !== undefined) {
    // Same operator chain but different constants or wording: the fingerprint is
    // allowed to differ on constants, but two problems of one structure with the
    // same constants and different values must share it.
    const clone = { ...problem, values: sibling.values };
    assert.equal(structureFingerprint(clone), structureFingerprint(problem), 'instance values stay out of the fingerprint');
  }
});

test('a contrastive pair is observable, decisive and scored as a pair', () => {
  const suite = buildContrastiveSuite({ seed: 20260922, perPair: 5 });
  assert.equal(suite.pairs.length, CONTRASTIVE_PAIRS.length * 5);
  for (const pair of suite.pairs) {
    const [left, right] = pair.members;
    // Observable: both statements share the draw, and the members require different
    // answers. A pair that answered alike would score as a pair while teaching nothing.
    assert.notEqual(left.oracle, right.oracle, `${pair.id}: the two members require the same answer`);
    assert.deepEqual(left.values, right.values);
    assert.deepEqual(left.parameters, right.parameters);
    // Decisive: the statements differ in the decisive phrase and are otherwise the
    // same wording over the same numbers.
    assert.notEqual(left.statement, right.statement);
    // The two statements are the same wording over the same numbers: removing this
    // pair kind's decisive phrase must leave the same text on both sides, so a pair
    // cannot differ by an extra clause that changes more than the operation.
    const decisive = pair.kind === 'boundary-inclusion-pair'
      ? [/\babove \d+\b/g, /\bat least \d+\b/g]
      : pair.kind === 'direction-pair'
        ? [/\blargest\b/g, /\bsmallest\b/g]
        : [/\d+ percent of the total/g, /a fixed \d+ [a-z]+/g];
    const stripped = (statement, pattern) => statement.replace(pattern, 'X').replace(/\s+/g, ' ').trim();
    assert.equal(stripped(left.statement, decisive[0]), stripped(right.statement, decisive[1]),
      `${pair.id}: the members differ by more than the decisive phrase`);
    // Each member's oracle is the member's own chain, recomputed here for the
    // inclusion pair, whose difference is exactly the record equal to the threshold.
    if (pair.kind === 'boundary-inclusion-pair') {
      assert.equal(right.oracle, left.oracle + 1, `${pair.id}: the threshold record joins one side only`);
      assert.equal(pair.shared.values.filter((value) => value === pair.shared.parameters.threshold).length, 1);
    }
  }
});

test('the pair suite is reproducible from its seed and per-kind independent', () => {
  // Each pair kind draws from its own stream, so one kind's rejection rate cannot
  // starve the next, and the whole suite reproduces from the seed alone.
  const first = buildContrastiveSuite({ seed: 20260922, perPair: 4 });
  const again = buildContrastiveSuite({ seed: 20260922, perPair: 4 });
  assert.deepEqual(
    again.pairs.map((pair) => pair.members.map((member) => member.oracle)),
    first.pairs.map((pair) => pair.members.map((member) => member.oracle))
  );
  assert.deepEqual(again.pairs.map((pair) => pair.members.map((member) => member.statement)),
    first.pairs.map((pair) => pair.members.map((member) => member.statement)));
  const different = buildContrastiveSuite({ seed: 7, perPair: 4 });
  assert.notDeepEqual(different.pairs.map((pair) => pair.members[0].values), first.pairs.map((pair) => pair.members[0].values));
});
