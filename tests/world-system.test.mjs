import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerDocxSource } from '../context/sources/docx.mjs';
import { BOOK_PATH, parseWorldSystem, BOOK_QUARANTINE_RULES } from '../teacher/sources/world-system.mjs';
import { getSource, sourceIds } from '../teacher/sources/index.mjs';
import { loadFamilies } from '../teacher/families/index.mjs';

function book() {
  return parseWorldSystem(registerDocxSource(BOOK_PATH).paragraphs);
}

test('the world source registers with the canonical profile', () => {
  const source = registerDocxSource(BOOK_PATH);
  assert.match(source.rawHash, /^[0-9a-f]{64}$/);
  assert.match(source.canonicalHash, /^[0-9a-f]{64}$/);
  assert.equal(source.extractor, 'docx-canvas-text 1.1.0');
  assert.equal(source.paragraphs.length, 9422);
  assert.equal(source.drawings, 0, 'this seed book carries no drawings');
});

test('the book parses as four grades of fifty reasoning families', () => {
  const parsed = book();
  assert.equal(parsed.grades.length, 4);
  assert.equal(parsed.problems.length, 1000);
  for (const problem of parsed.problems) {
    assert.ok(problem.statement.length > 20, `${problem.id} has no statement`);
    assert.ok(problem.printedAnswer.length > 0, `${problem.id} has no printed answer`);
    assert.ok(problem.steps.length > 0, `${problem.id} has no worked steps`);
    assert.deepEqual(problem.missingBlocks, [], `${problem.id} is missing a printed block`);
    assert.match(problem.templateKey, / \(grade [1-4]\)$/);
    assert.ok(problem.familyCode.length > 0);
    assert.equal(problem.type, problem.type.toLowerCase());
  }
  const perUnit = new Map();
  for (const problem of parsed.problems) {
    const key = `${problem.familyCode}|${problem.grade}`;
    perUnit.set(key, (perUnit.get(key) ?? 0) + 1);
  }
  assert.equal(perUnit.size, 200, 'one template per family and grade');
  assert.equal([...perUnit.values()].every((count) => count === 5), true, 'each family block holds five problems');
  assert.equal(new Set(parsed.problems.map((problem) => problem.templateKey)).size, 200);
});

test('the first problem keeps the premise blocks apart from the reference material', () => {
  const problem = book().problems[0];
  assert.equal(problem.id, '1');
  assert.equal(problem.number, 1);
  assert.equal(problem.grade, 1);
  assert.equal(problem.familyCode, 'G1');
  assert.equal(problem.familyTitle, 'Positions and orientation');
  assert.equal(problem.title, 'Position chain from Cedar to Alder');
  assert.equal(problem.templateKey, 'Positions and orientation (grade 1)');
  assert.equal(problem.type, 'positions-and-orientation-grade-1');
  assert.equal(problem.folder, '1-position-chain-from-cedar-to-alder');
  assert.equal(problem.printedAnswer, 'Alder is east of Cedar; grid displacement 2 unit(s).');
  assert.equal(problem.steps.length, 4);
  assert.equal(problem.paragraphSpan.from, 173);
  assert.equal(problem.statement.startsWith('Knowledge context. A map can be modeled'), true);
  assert.equal(problem.statement.includes('Answer.'), false, 'the statement never carries the printed answer');
  assert.equal(problem.statement.includes('Formal model'), false, 'the statement never carries the reference model');
  assert.equal(problem.statement.includes('Step-by-step solution'), false, 'the statement never carries the worked solution');
});

test('the family headings name one template per block and the grades repeat them', () => {
  const parsed = book();
  const gradeTitles = new Map();
  for (const problem of parsed.problems) {
    const key = `${problem.familyCode}|${problem.grade}`;
    gradeTitles.set(key, problem.familyTitle);
  }
  assert.equal(gradeTitles.get('G1|1'), 'Positions and orientation');
  assert.equal(gradeTitles.get('N25|4'), 'Meta-reasoning: robustness, information, causality');
  assert.equal(gradeTitles.size, 200);
});

test('the appended cross-domain checks stay inside the given facts', () => {
  const parsed = book();
  const withCheck = parsed.problems.filter((problem) => /Cross-domain check:/.test(problem.givenFacts));
  assert.equal(withCheck.length, 310, 'the book appends 310 secondary checks');
  for (const problem of withCheck) {
    assert.match(problem.printedAnswer, /Cross-domain answer:/, `${problem.id} carries a check without a labelled answer`);
    assert.equal(/Cross-domain check:/.test(problem.statement), true);
  }
  assert.equal(parsed.problems[0].givenFacts.includes('Cross-domain'), false);
});

test('the quarantine rules name the defects of this source', () => {
  const parsed = book();
  const quarantined = parsed.problems.filter((problem) => BOOK_QUARANTINE_RULES.some((rule) => rule.test(problem)));
  assert.deepEqual(quarantined, [], 'the printed book has no incomplete problem');

  const malformed = {
    printedAnswer: '',
    statement: 'Knowledge context. A claim.',
    familyCode: '',
    missingBlocks: ['Given facts', 'Rules']
  };
  const fired = BOOK_QUARANTINE_RULES.filter((rule) => rule.test(malformed)).map((rule) => rule.id);
  assert.deepEqual(fired.sort(), ['incomplete-block', 'missing-answer', 'missing-family']);
});

test('the source registry resolves every registered book and its units', () => {
  assert.deepEqual(sourceIds(), [
    'mathematical-thinking',
    'world-as-a-system',
    'common-sense',
    'logical-reasoning',
    'scientific-reasoning',
    'adult-reasoning',
    'decompose-to-solve',
    'procedural-arithmetic'
  ]);
  assert.equal(getSource('procedural-arithmetic').kind, 'generated');
  assert.equal(getSource('procedural-arithmetic').unitLabel, 'family');
  assert.equal(getSource('procedural-arithmetic').unitOf({ familyId: 'whole-units-under-a-budget' }), 'whole-units-under-a-budget');
  assert.equal(getSource('world-as-a-system').unitKind, 'code');
  assert.equal(getSource('world-as-a-system').unitOf({ familyCode: 'H7' }), 'H7');
  assert.equal(getSource('common-sense').unitOf({ templateOrdinal: 3 }), 3);
  assert.equal(getSource('logical-reasoning').unitLabel, 'section');
  assert.equal(getSource('scientific-reasoning').unitLabel, 'form');
  assert.equal(getSource('decompose-to-solve').unitLabel, 'pattern');
  assert.equal(getSource('mathematical-thinking').unitKind, 'number');
  assert.throws(() => getSource('unknown-book'), /Known books: mathematical-thinking/);
});

test('the family loader reads one book directory and validates its units', async () => {
  const { families, units } = await loadFamilies({ book: 'world-as-a-system', only: new Set(['G1']) });
  assert.deepEqual([...units], ['G1']);
  assert.deepEqual([...families.keys()].sort(), [
    'Positions and orientation (grade 1)',
    'Positions and orientation (grade 2)',
    'Positions and orientation (grade 3)',
    'Positions and orientation (grade 4)'
  ]);
  await assert.rejects(() => loadFamilies({ book: 'world-as-a-system', only: new Set(['Z9']) }), /No family module implements family Z9/);
});
