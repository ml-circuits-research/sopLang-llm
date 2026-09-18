import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerDocxSource } from '../context/sources/docx.mjs';
import { BOOK_PATH, parseMathThinking, BOOK_QUARANTINE_RULES, normalizePrintedAnswer } from '../teacher/sources/math-thinking.mjs';
import { normalizeAnswer, answerMatches } from '../teacher/naming.mjs';

function book() {
  return parseMathThinking(registerDocxSource(BOOK_PATH).paragraphs);
}

test('the source registers with a raw hash, a canonical hash, and an extractor version', () => {
  const source = registerDocxSource(BOOK_PATH);
  assert.match(source.rawHash, /^[0-9a-f]{64}$/);
  assert.match(source.canonicalHash, /^[0-9a-f]{64}$/);
  assert.equal(source.extractor, 'docx-canvas-text 1.1.0');
  assert.ok(source.paragraphs.length > 10_000);
  assert.equal(source.drawings, 0, 'this seed book carries no drawings');
});

test('every problem of the book parses with a statement, an answer, and a paragraph span', () => {
  const parsed = book();
  assert.equal(parsed.chapters.length, 40);
  assert.equal(parsed.problems.length, 1000);
  for (const problem of parsed.problems) {
    assert.ok(problem.statement.length > 20, `${problem.id} has no statement`);
    assert.ok(problem.printedAnswer.length > 0, `${problem.id} has no printed answer`);
    assert.ok(problem.paragraphSpan.to > problem.paragraphSpan.from, `${problem.id} has an empty span`);
    assert.ok(problem.templateKey.length > 0);
    assert.equal(problem.type, problem.type.toLowerCase());
  }
  assert.equal(parsed.problems[0].id, '1.1');
  assert.equal(parsed.problems[0].templateKey, 'Order in a Line');
  assert.equal(parsed.problems[0].variant, 1);
});

test('the first problem keeps the source text and the reference material apart', () => {
  const problem = book().problems[0];
  assert.ok(problem.statement.startsWith('Four children stand in a single line'));
  assert.ok(!problem.statement.includes('Answer'));
  assert.equal(problem.printedAnswer, 'Ana, Mara, Daria, Luca.');
  assert.equal(problem.steps.length, 4);
  assert.ok(problem.abstractModel.includes('pos(Ana)'));
});

test('the quarantine rules name the defects of this source', () => {
  const problems = book().problems;
  const quarantined = problems.filter((problem) => BOOK_QUARANTINE_RULES.some((rule) => rule.test(problem)));
  assert.deepEqual(quarantined, [], 'no problem of this book is quarantined: the polarity answers are normalized instead');
  assert.deepEqual(
    BOOK_QUARANTINE_RULES.map((rule) => rule.id),
    ['missing-answer', 'missing-statement']
  );
});

test('the source declares the English equivalent of its polarity answers', () => {
  const polarity = book().problems.filter((problem) => ['19.11', '19.12', '19.13', '19.14', '19.15'].includes(problem.id));
  assert.equal(polarity[0].printedAnswer.trim(), 'Da.', 'the book keeps its own token');
  assert.equal(polarity[1].printedAnswer.trim(), 'Nu.');
  assert.deepEqual(
    polarity.map((problem) => normalizePrintedAnswer(problem)),
    ['Yes.', 'No.', 'Yes.', 'No.', 'Yes.']
  );
  assert.equal(
    normalizePrintedAnswer({ printedAnswer: 'Ana, Mara.' }),
    'Ana, Mara.',
    'an answer without a declared equivalent is shipped verbatim'
  );
});

test('answer comparison ignores formatting but not values', () => {
  assert.equal(answerMatches('Ana, Mara, Daria, Luca.', 'ana, mara, daria, luca'), true);
  assert.equal(answerMatches('40 square units.', '40 square units.'), true);
  assert.equal(answerMatches('Yes.', 'No.'), false);
  assert.equal(normalizeAnswer('  8⅔.  '), '82⁄3', 'compatibility normalization rewrites the vulgar fraction');
});
