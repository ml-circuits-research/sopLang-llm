import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerDocxSource } from '../context/sources/docx.mjs';
import { BOOK_PATH, parseScientificReasoning, BOOK_QUARANTINE_RULES } from '../teacher/sources/scientific-reasoning.mjs';

function book() {
  return parseScientificReasoning(registerDocxSource(BOOK_PATH).paragraphs);
}

test('the scientific-reasoning source registers with the canonical profile', () => {
  const source = registerDocxSource(BOOK_PATH);
  assert.match(source.rawHash, /^[0-9a-f]{64}$/);
  assert.match(source.canonicalHash, /^[0-9a-f]{64}$/);
  assert.equal(source.extractor, 'docx-canvas-text 1.1.0');
  assert.equal(source.paragraphs.length, 12915);
  assert.equal(source.drawings, 0);
});

test('both parts parse as one thousand problems of forty reasoning forms', () => {
  const parsed = book();
  assert.equal(parsed.problems.length, 1000);
  const forms = new Map();
  for (const problem of parsed.problems) {
    forms.set(problem.formOrdinal, (forms.get(problem.formOrdinal) ?? 0) + 1);
  }
  assert.equal(forms.size, 40);
  assert.equal([...forms.values()].every((count) => count === 25), true);
  assert.deepEqual(
    parsed.problems.filter((problem) => BOOK_QUARANTINE_RULES.some((rule) => rule.test(problem))),
    []
  );
});

test('part one states the world and the case, and keeps the answer out of the statement', () => {
  const problem = book().problems[0];
  assert.equal(problem.id, '1');
  assert.equal(problem.templateKey, 'Classification by multiple rules');
  assert.equal(problem.formOrdinal, 1);
  assert.equal(problem.domain, 'Biology');
  assert.equal(problem.grade, 1);
  assert.match(problem.statement, /^Problem world\. For the imaginary bean species F/);
  assert.match(problem.statement, /\n\nCase data\. Case A: has water: YES/);
  assert.match(problem.statement, /\n\nQuestion\. The competition rule says/);
  assert.equal(problem.statement.includes('Answer.'), false);
  assert.equal(problem.statement.includes('Step-by-step'), false);
  assert.equal(problem.printedAnswer, 'Case D.');
  assert.equal(problem.steps.length, 4);
});

test('part two states its own vocabulary and every form names its own template', () => {
  const problem = book().problems.find((candidate) => candidate.number === 501);
  assert.equal(problem.templateKey, 'Necessary and sufficient conditions');
  assert.equal(problem.formOrdinal, 21);
  assert.equal(problem.domain, 'Biology + Ecology');
  assert.match(problem.statement, /^Given knowledge\. In the simplified model, pollination succeeds/);
  assert.match(problem.statement, /\n\nProblem data\. The target result is/);
  assert.match(problem.printedAnswer, /^A is necessary, but not sufficient/);
});
