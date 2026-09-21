/**
 * The text-reasoning probe suite (`evaluation/probes/text-reasoning-probes.json`).
 *
 * The suite covers the tasks small models are known to fail because the answer
 * needs deterministic counting, transforming, or ordering over characters and
 * words instead of language modelling: letter counting ("how many r in
 * raspberry"), string reversal and stride, word counts, alphabetical and
 * length ordering, and single-step situation traps.
 *
 * Every derivable expectation is recomputed here from the source material the
 * item declares, by an implementation independent of the builder that wrote the
 * file, so a wrong expected value fails the suite instead of teaching the
 * measurement a wrong answer.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const suite = JSON.parse(readFileSync(fileURLToPath(new URL('../evaluation/probes/text-reasoning-probes.json', import.meta.url)), 'utf8'));

function countLetter({ text, letter, caseInsensitive }) {
  const haystack = caseInsensitive ? text.toLowerCase() : text;
  return [...haystack].filter((character) => character === letter).length;
}

function derive(item) {
  const { derivation } = item;
  switch (derivation.op) {
    case 'count-letter':
      return String(countLetter(derivation));
    case 'reverse':
      return [...derivation.text].reverse().join('');
    case 'every-second':
      return [...derivation.text].filter((_, index) => index % 2 === 0).join('');
    case 'word-count':
      return String(derivation.text.split(/\s+/).filter(Boolean).length);
    case 'longest-word':
      return [...derivation.text.split(/\s+/).filter(Boolean)]
        .sort((left, right) => right.length - left.length || left.localeCompare(right))[0];
    case 'words-containing':
      return String(derivation.text.split(/\s+/).filter((word) => word.toLowerCase().includes(derivation.letter)).length);
    case 'sort':
      return [...derivation.words].sort((left, right) => left.localeCompare(right)).join(',');
    case 'sort-length':
      return [...derivation.words].sort((left, right) => left.length - right.length || left.localeCompare(right)).join(',');
    case 'stated':
      return null;
    default:
      throw new Error(`unknown derivation op ${derivation.op}`);
  }
}

test('the suite is identified, sized, and complete', () => {
  assert.equal(suite.profile, 'text-reasoning-probes-1.0.0');
  assert.ok(suite.probes.length >= 40, `expected at least forty probes, found ${suite.probes.length}`);
  assert.ok(suite.systemPrompt.length > 0);
  const ids = new Set();
  const kinds = new Set();
  for (const item of suite.probes) {
    assert.match(item.id, /^[a-z0-9-]+$/, `${item.id} is not a usable id`);
    assert.ok(!ids.has(item.id), `${item.id} is declared twice`);
    ids.add(item.id);
    kinds.add(item.kind);
    assert.ok(item.prompt.length > 0 && item.expected.length > 0, `${item.id} has an empty prompt or expectation`);
    assert.ok(['normalized', 'exact'].includes(item.comparison), `${item.id} has no usable comparison`);
  }
  assert.deepEqual([...kinds].sort(), ['character-count', 'ordering', 'situation-trick', 'string-transform', 'word-count']);
});

test('every derivable expectation matches an independent recomputation', () => {
  let derived = 0;
  for (const item of suite.probes) {
    const expected = derive(item);
    if (expected === null) {
      continue;
    }
    derived += 1;
    assert.equal(item.expected, expected, `${item.id}: recorded "${item.expected}" but recomputation gives "${expected}"`);
  }
  assert.ok(derived >= 39, `only ${derived} probes carry a derivation`);
});

test('the letter-counting probes cover the reported failure mode', () => {
  const strawberry = suite.probes.find((item) => item.id === 'count-strawberry-r');
  assert.ok(strawberry !== undefined, 'the strawberry case is missing');
  assert.equal(strawberry.expected, '3');
  const raspberry = suite.probes.find((item) => item.id === 'count-raspberry-r');
  assert.equal(raspberry.expected, '3');
  const mixedCase = suite.probes.filter((item) => item.derivation.caseInsensitive === true);
  assert.ok(mixedCase.length >= 4, 'the suite needs case-insensitive counts over sentences');
});

test('the declared value tolerance of compiled mode accepts phrasing and rejects wrong values', async () => {
  const { statesValue } = await import('../evaluation/probes.mjs');
  assert.equal(statesValue('3', '3 times.'), true);
  assert.equal(statesValue('3', 'The letter appears 3 times.'), true);
  assert.equal(statesValue('3', '4 times out of 3'), false);
  assert.equal(statesValue('12', '12 words.'), true);
  assert.equal(statesValue('12', '1 or 2 words'), false);
  assert.equal(statesValue('ananab', 'ananab'), true);
  assert.equal(statesValue('the same', 'The same.'), true);
  assert.equal(statesValue('3', null), false);
});

test('the situation traps keep their stated answers and ask for one value', () => {
  const traps = suite.probes.filter((item) => item.kind === 'situation-trick');
  assert.equal(traps.length, 10);
  for (const item of traps) {
    assert.equal(item.derivation.op, 'stated');
    assert.ok(/Reply with only/.test(item.prompt), `${item.id} does not ask for a single value`);
  }
  assert.equal(traps.find((item) => item.id === 'situation-bat-and-ball').expected, '0.05');
  assert.equal(traps.find((item) => item.id === 'situation-kg-feathers-iron').expected, 'the same');
});
