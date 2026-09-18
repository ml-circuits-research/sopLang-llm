import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerDocxSource } from '../context/sources/docx.mjs';
import { BOOK_PATH, parseCommonSense, BOOK_QUARANTINE_RULES } from '../teacher/sources/common-sense.mjs';

function book() {
  return parseCommonSense(registerDocxSource(BOOK_PATH).paragraphs);
}

test('the common-sense source registers with the canonical profile', () => {
  const source = registerDocxSource(BOOK_PATH);
  assert.match(source.rawHash, /^[0-9a-f]{64}$/);
  assert.match(source.canonicalHash, /^[0-9a-f]{64}$/);
  assert.equal(source.extractor, 'docx-canvas-text 1.1.0');
  assert.equal(source.paragraphs.length, 10013);
  assert.equal(source.drawings, 0);
});

test('the manual parses as ten chapters of one hundred problems', () => {
  const parsed = book();
  assert.equal(parsed.chapters.length, 10);
  assert.equal(parsed.sections.length, 100);
  assert.equal(parsed.problems.length, 1000);
  for (const problem of parsed.problems) {
    assert.ok(problem.statement.length > 40, `${problem.id} has no statement`);
    assert.ok(problem.question.length > 10, `${problem.id} has no question`);
    assert.ok(problem.printedAnswer.length > 0, `${problem.id} has no printed answer`);
    assert.ok(problem.steps.length > 0, `${problem.id} has no worked steps`);
    assert.ok(problem.title.length > 0);
  }
});

test('the twenty reasoning patterns are the templates and each carries fifty variants', () => {
  const parsed = book();
  const ordinals = new Map();
  for (const problem of parsed.problems) {
    ordinals.set(problem.templateOrdinal, (ordinals.get(problem.templateOrdinal) ?? 0) + 1);
  }
  assert.equal(ordinals.size, 20);
  assert.equal([...ordinals.values()].every((count) => count === 50), true);
  const first = parsed.problems[0];
  assert.equal(first.id, '1.1.1');
  assert.equal(first.title, 'Weighted averages');
  assert.equal(first.templateKey, 'Weighted averages');
  assert.equal(first.templateOrdinal, 1);
  assert.equal(first.order, 10101);
  assert.equal(first.type, 'weighted-averages');
  assert.equal(first.folder, '1.1.1-weighted-averages');
});

test('the statement is the printed text plus the question, and the answer stays out', () => {
  const problem = book().problems[0];
  assert.match(problem.statement, /^Two groups were evaluated on the same scale\./);
  assert.match(problem.statement, /\n\nQuestion\. Compute the correct combined mean/);
  assert.equal(problem.statement.includes('Answer.'), false);
  assert.equal(problem.statement.includes('Step-by-step'), false);
  assert.equal(problem.printedAnswer, 'The weighted mean is 80, compared with a simple mean-of-means of 78.');
  assert.equal(problem.steps.length, 3);
});

test('the quarantine rules name the defects of this source', () => {
  const parsed = book();
  assert.deepEqual(
    parsed.problems.filter((problem) => BOOK_QUARANTINE_RULES.some((rule) => rule.test(problem))),
    []
  );
  const fire = (problem) => BOOK_QUARANTINE_RULES.filter((rule) => rule.test(problem)).map((rule) => rule.id).sort();
  assert.deepEqual(fire({ printedAnswer: '', question: 'q', statement: 's' }), ['missing-answer']);
  assert.deepEqual(fire({ printedAnswer: 'a', question: '', statement: 's' }), ['missing-question']);
  assert.deepEqual(fire({ printedAnswer: 'a', question: 'q', statement: '' }), ['missing-statement']);
});
