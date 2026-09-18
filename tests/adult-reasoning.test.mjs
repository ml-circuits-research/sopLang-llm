import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerDocxSource } from '../context/sources/docx.mjs';
import { BOOK_PATH, parseAdultReasoning, BOOK_QUARANTINE_RULES } from '../teacher/sources/adult-reasoning.mjs';

function book() {
  return parseAdultReasoning(registerDocxSource(BOOK_PATH).paragraphs);
}

test('the adult-reasoning source registers with the canonical profile', () => {
  const source = registerDocxSource(BOOK_PATH);
  assert.match(source.rawHash, /^[0-9a-f]{64}$/);
  assert.match(source.canonicalHash, /^[0-9a-f]{64}$/);
  assert.equal(source.extractor, 'docx-canvas-text 1.1.0');
  assert.equal(source.paragraphs.length, 9374);
  assert.equal(source.drawings, 0);
});

test('the course parses as ten chapters of ten sections of ten variants', () => {
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

test('the first variant keeps the stem and the question apart from the verdict', () => {
  const problem = book().problems[0];
  assert.equal(problem.id, '1');
  assert.equal(problem.templateKey, 'Instructions and warnings');
  assert.equal(problem.sectionOrdinal, 1);
  assert.equal(problem.title, 'The warehouse notice — variant 1');
  assert.match(problem.statement, /^On the service door of a warehouse in Little River/);
  assert.match(problem.statement, /\n\nQuestion\. Who may enter by the service door/);
  assert.equal(problem.statement.includes('ANSWER'), false);
  assert.match(problem.printedAnswer, /^Sam may not enter in the home vest/);
  assert.ok(problem.explanation.length > 50, 'the explanation is reference material kept apart');
  assert.equal(problem.explanation.includes('Split the rules into allowed / forbidden / procedure.'), true);
});
