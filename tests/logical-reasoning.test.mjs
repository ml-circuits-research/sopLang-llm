import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerDocxSource } from '../context/sources/docx.mjs';
import { BOOK_PATH, parseLogicalReasoning, BOOK_QUARANTINE_RULES } from '../teacher/sources/logical-reasoning.mjs';

function book() {
  return parseLogicalReasoning(registerDocxSource(BOOK_PATH).paragraphs);
}

test('the logical-reasoning source registers with the canonical profile', () => {
  const source = registerDocxSource(BOOK_PATH);
  assert.match(source.rawHash, /^[0-9a-f]{64}$/);
  assert.match(source.canonicalHash, /^[0-9a-f]{64}$/);
  assert.equal(source.extractor, 'docx-canvas-text 1.1.0');
  assert.equal(source.paragraphs.length, 9343);
  assert.equal(source.drawings, 0);
});

test('part two parses as ten chapters of ten sections of ten cases', () => {
  const parsed = book();
  assert.equal(parsed.chapters.length, 10);
  assert.equal(parsed.sections.length, 100);
  assert.equal(parsed.problems.length, 1000);
  const units = new Map();
  for (const problem of parsed.problems) {
    units.set(problem.sectionOrdinal, (units.get(problem.sectionOrdinal) ?? 0) + 1);
  }
  assert.equal(units.size, 100);
  assert.equal([...units.values()].every((count) => count === 10), true);
  assert.deepEqual(
    parsed.problems.filter((problem) => BOOK_QUARANTINE_RULES.some((rule) => rule.test(problem))),
    []
  );
});

test('the first case keeps the stem and the question apart from the verdict', () => {
  const problem = book().problems[0];
  assert.equal(problem.id, '1');
  assert.equal(problem.templateKey, 'Universals applied to a named case');
  assert.equal(problem.sectionOrdinal, 1);
  assert.equal(problem.chapter, 1);
  assert.equal(problem.templateKey.length > 0, true);
  assert.match(problem.title, /— case 1$/);
  assert.match(problem.statement, /An evening class in Dunwick posts one closed rule/);
  assert.match(problem.statement, /\n\nQuestion\. Which pointing is forced by the handbook\?/);
  assert.equal(problem.statement.includes('ANSWER'), false);
  assert.match(problem.printedAnswer, /^Only Sam’s\./);
  assert.equal(problem.steps.length, 5);
});
