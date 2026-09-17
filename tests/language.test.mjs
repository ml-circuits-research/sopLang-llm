import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findNonEnglishTokens, assertEnglishContent } from '../teacher/language.mjs';

test('detects Romanian diacritics in generated text', () => {
  const tokens = findNonEnglishTokens('The plurals șî sînt corecte.');
  assert.ok(tokens.includes('diacritic ș (U+0219)'));
  assert.ok(tokens.some((token) => token.includes('diacritic î')));
  assert.deepEqual(findNonEnglishTokens('café'), [], 'a loanword diacritic is not Romanian content');
});

test('detects the Romanian polarity tokens as standalone words', () => {
  assert.deepEqual(findNonEnglishTokens('Nu.'), ['Nu']);
  assert.deepEqual(findNonEnglishTokens('Da.'), ['Da']);
  assert.deepEqual(findNonEnglishTokens('The answer is NU'), ['NU']);
});

test('does not flag English words that merely contain the letters', () => {
  assert.deepEqual(findNonEnglishTokens('The number is zero.'), []);
  assert.deepEqual(findNonEnglishTokens('DASH-8 and data and nature'), []);
  assert.deepEqual(findNonEnglishTokens('An annual audit.'), []);
});

test('the assert helper throws with the artifact location and the offending tokens', () => {
  assert.throws(() => assertEnglishContent('Răspunsul este Da.', 'rejected/1.1/rejection.md'), /non-English content in rejected\/1.1\/rejection\.md: .*diacritic.*, Da/);
});
