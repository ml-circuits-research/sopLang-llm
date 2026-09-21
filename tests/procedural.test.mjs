/**
 * The procedural generator of `teacher/procedural/arithmetic.mjs`.
 *
 * The properties under test are the ones the dataset contract of DS008 requires
 * from a procedural source: instances reproduce from their seed, the statement
 * determines the values the circuit receives (the reference parse round-trips),
 * the statement never carries its own answer, the text passes the English-only
 * gate, the circuit compute body runs on the real runtime and agrees with the
 * independent oracle, and the families declare distinct plan fingerprints so a
 * suite built from them widens the plan set instead of repeating one shape.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

import { families, sourceId, generatorVersion } from '../teacher/procedural/arithmetic.mjs';
import { sampleInstances } from '../teacher/procedural/random.mjs';
import { answerBody } from '../teacher/families/probes.mjs';
import { assertEnglishContent } from '../teacher/language.mjs';
import { answerMatches, slugify } from '../teacher/naming.mjs';
import { createRuntime } from '../runtime/kernel.mjs';

const SEED = 20260921;
const PER_FAMILY = 25;

function programFor(slots, compute) {
  return `@slots literal\n${JSON.stringify(slots, null, 2)}\n\n@answer jsEval\n${answerBody(compute)}\n`;
}

test('the procedural source is identified and its families are slugged and unique', () => {
  assert.equal(sourceId, 'procedural-arithmetic');
  assert.match(generatorVersion, /^\d+\.\d+\.\d+$/);
  assert.ok(families.length >= 3);
  const ids = new Set();
  for (const family of families) {
    assert.equal(family.type, slugify(family.name));
    assert.equal(family.id, family.type);
    assert.ok(!ids.has(family.id), `${family.id} is declared twice`);
    ids.add(family.id);
    assert.ok(['knowledge', 'no-knowledge'].includes(family.category));
    for (const axis of ['subproblems', 'dependencyDepth', 'branching', 'irrelevantInformation', 'symbolicShare']) {
      assert.equal(typeof family.difficulty[axis], 'number', `${family.id} is missing the difficulty axis ${axis}`);
    }
  }
});

test('the families declare distinct plan fingerprints', () => {
  const fingerprints = new Set(families.map((family) => createHash('sha256').update(`\n===\n${family.compute}`).digest('hex')));
  assert.equal(fingerprints.size, families.length);
});

test('instances reproduce from the recorded seed and are unique per family', () => {
  for (const family of families) {
    const first = sampleInstances({ family, seed: SEED, count: PER_FAMILY });
    const second = sampleInstances({ family, seed: SEED, count: PER_FAMILY });
    assert.equal(first.length, PER_FAMILY);
    assert.deepEqual(second, first, `${family.id} does not reproduce from its seed`);
    assert.equal(new Set(first.map((instance) => instance.statement)).size, PER_FAMILY);
    const other = sampleInstances({ family, seed: SEED + 1, count: PER_FAMILY });
    assert.notDeepEqual(other.map((instance) => instance.statement), first.map((instance) => instance.statement));
  }
});

test('the reference parse recovers the sampled values and the statement is English and answer-free', () => {
  for (const family of families) {
    for (const instance of sampleInstances({ family, seed: SEED, count: PER_FAMILY })) {
      assert.deepEqual(family.parse(instance.statement), instance.slots, `${family.id} instance ${instance.index} does not round-trip`);
      assert.doesNotThrow(() => assertEnglishContent(instance.statement, `${family.id} instance ${instance.index}`));
      const answer = family.oracle(instance.slots);
      assert.ok(answer.length > 0);
      assert.ok(!instance.statement.includes(answer), `${family.id} instance ${instance.index} prints its own answer`);
      assert.ok(family.explain(instance.slots, answer).length >= 2);
    }
  }
});

test('every instance executes on the runtime and agrees with the independent oracle', async () => {
  const runtime = createRuntime();
  for (const family of families) {
    for (const instance of sampleInstances({ family, seed: SEED, count: PER_FAMILY })) {
      const result = await runtime.run(programFor(instance.slots, family.compute), { outputs: ['answer'] });
      assert.equal(result.status, 'completed', `${family.id} instance ${instance.index} ended ${result.status}:${result.code} (${result.error?.message ?? ''})`);
      assert.ok(answerMatches(family.oracle(instance.slots), String(result.outputs.answer)),
        `${family.id} instance ${instance.index}: oracle "${family.oracle(instance.slots)}" against circuit "${result.outputs.answer}"`);
    }
  }
});

test('a statement whose values changed is rejected by the circuit guards', async () => {
  const runtime = createRuntime();
  const family = families[1];
  const [instance] = sampleInstances({ family, seed: SEED, count: 1 });
  const broken = { ...instance.slots, unitPrice: 0 };
  const result = await runtime.run(programFor(broken, family.compute), { outputs: ['answer'] });
  assert.equal(result.status, 'failed');
  assert.match(String(result.error?.message ?? ''), /probe failed/);
});
