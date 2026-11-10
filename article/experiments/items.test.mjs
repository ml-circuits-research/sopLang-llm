/**
 * Re-run the mechanical checks of the E2 and E3 item files over the written
 * files (evaluation/registry/items-e2/, evaluation/registry/items-e3/).
 *
 * Run: node --test article/experiments/items.test.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

import { COMPOSITIONS, HELD_OUT } from '../../teacher/procedural/compositions.mjs';
import { compositionFamily } from '../../teacher/procedural/composition-families.mjs';
import { bookShapeFamilies } from '../../teacher/procedural/bookshapes.mjs';
import { expectedAnswersOf, statementBodyOf } from '../../training-data/dataset-manifest.mjs';
import {
  checkSameNumbers,
  checkSurfaceRow,
  checkThreshold,
  coalitionReference,
  parseCoalitionOracle,
  parseScheduleOracle,
  scheduleReference
} from './item-checks.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const E2 = join(ROOT, 'evaluation', 'registry', 'items-e2');
const E3 = join(ROOT, 'evaluation', 'registry', 'items-e3');
const RUNGS = ['L0', 'L1', 'L2', 'L3'];

function readRows(path) {
  return readFileSync(path, 'utf8').split('\n').filter((line) => line.trim() !== '').map((line) => JSON.parse(line));
}

const e2 = Object.fromEntries(RUNGS.map((rung) => [rung, readRows(join(E2, `${rung}.jsonl`))]));
const families = new Map(COMPOSITIONS.map((composition) => [composition.id, compositionFamily(composition)]));

test('E2: every rung holds 440 held-out and 80 control items over the same instances', () => {
  for (const rung of RUNGS) {
    const rows = e2[rung];
    assert.equal(rows.length, 520);
    assert.equal(rows.filter((row) => row.split === 'held-out').length, 440);
    assert.equal(rows.filter((row) => row.split === 'trained-control').length, 80);
    assert.deepEqual(new Set(rows.filter((row) => row.split === 'held-out').map((row) => row.composition)), new Set(HELD_OUT));
    for (const row of rows) {
      assert.equal(row.rung, rung);
      assert.equal(row.book, 'procedural-arithmetic');
      assert.equal(row.plan, null);
      assert.equal(row.split === 'held-out', HELD_OUT.includes(row.composition));
    }
  }
  const base = e2.L0.map((row) => row.folder.replace(/-L0$/, ''));
  for (const rung of RUNGS.slice(1)) {
    assert.deepEqual(e2[rung].map((row) => row.folder.replace(new RegExp(`-${rung}$`), '')), base);
    e2[rung].forEach((row, index) => {
      assert.equal(row.oracle, e2.L0[index].oracle);
      assert.deepEqual(row.slots, e2.L0[index].slots);
    });
  }
});

test('E2: every row passes the numbers, threshold, parameter, and number-word checks', () => {
  for (const rung of RUNGS) {
    for (const row of e2[rung]) {
      for (const [check, messages] of Object.entries(checkSurfaceRow(row))) {
        assert.deepEqual(messages, [], `${row.folder} ${check}`);
      }
    }
  }
});

test('E2: the oracle is the family reference answer, L0 is the family statement, and held-out oracles match the manifest', () => {
  const oracles = expectedAnswersOf(join(ROOT, 'training-data', 'procedural-arithmetic'));
  for (const row of e2.L0) {
    const family = families.get(row.composition);
    assert.equal(family.render(family.solve(row.slots)), row.oracle, row.folder);
    assert.equal(family.statement(row.slots), row.statement, row.folder);
    assert.ok(isDeepStrictEqual(family.parse(row.statement), row.slots), row.folder);
    if (row.split === 'held-out') {
      const folder = row.folder.replace(/-L0$/, '');
      assert.equal(oracles.get(folder).answer, row.oracle, folder);
      const shipped = statementBodyOf(readFileSync(join(ROOT, 'training-data', 'procedural-arithmetic', folder, 'problem.md'), 'utf8')).trimEnd();
      assert.equal(row.statement, shipped, folder);
    }
  }
});

test('E2: the threshold check rejects a flipped or inclusive boundary', () => {
  const chain = ['keepAbove', 'total'];
  const slots = { values: [30, 12, 25], threshold: 25 };
  assert.deepEqual(checkThreshold('Discard every entry of 25 or less, then sum.', chain, slots), []);
  assert.deepEqual(checkThreshold('Keep only the entries greater than 25.', chain, slots), []);
  assert.notDeepEqual(checkThreshold('Keep only the entries of 25 or more.', chain, slots), []);
  assert.notDeepEqual(checkThreshold('Keep the entries of at least 25.', chain, slots), []);
  assert.notDeepEqual(checkThreshold('Discard every entry of 25 or more.', chain, slots), []);
  assert.notDeepEqual(checkThreshold('Keep only the entries below 25.', chain, slots), []);
});

const e3 = { original: readRows(join(E3, 'original.jsonl')), procedural: readRows(join(E3, 'procedural.jsonl')) };
const scheduleFamily = bookShapeFamilies.find((family) => family.id === 'dependency-chain-join');
const coalitionFamily = bookShapeFamilies.find((family) => family.id === 'minimal-winning-coalition');

test('E3: 100 scheduling and 20 coalition items in both wordings, with the book oracle', () => {
  for (const wording of ['original', 'procedural']) {
    const rows = e3[wording];
    assert.equal(rows.length, 120);
    assert.equal(rows.filter((row) => row.split === 'held-out-scheduling').length, 100);
    assert.equal(rows.filter((row) => row.split === 'held-out-coalition').length, 20);
    for (const row of rows) assert.equal(row.rung, wording);
  }
  const books = new Map();
  e3.original.forEach((row, index) => {
    const rewrite = e3.procedural[index];
    assert.equal(rewrite.folder, `${row.folder}-procedural`);
    assert.equal(rewrite.oracle, row.oracle);
    if (!books.has(row.book)) books.set(row.book, expectedAnswersOf(join(ROOT, 'training-data', row.book)));
    assert.equal(books.get(row.book).get(row.folder).answer, row.oracle, row.folder);
    const shipped = statementBodyOf(readFileSync(join(ROOT, 'training-data', row.book, row.folder, 'problem.md'), 'utf8')).trimEnd();
    assert.equal(row.statement, shipped, row.folder);
  });
});

test('E3: each rewrite is the procedural template, states the source numbers, and computes the oracle', () => {
  e3.procedural.forEach((row, index) => {
    const source = e3.original[index];
    assert.deepEqual(checkSameNumbers(source.statement, row.statement), [], row.folder);
    if (row.split === 'held-out-scheduling') {
      const slots = scheduleFamily.parse(row.statement);
      assert.equal(scheduleFamily.statement(slots), row.statement);
      const reference = scheduleReference(slots);
      const oracle = parseScheduleOracle(row.oracle);
      assert.equal(reference.minutes, oracle.minutes, row.folder);
      assert.equal(reference.feasible, oracle.feasible, row.folder);
    } else {
      const slots = coalitionFamily.parse(row.statement);
      assert.equal(coalitionFamily.statement(slots), row.statement);
      assert.deepEqual(coalitionReference(slots), parseCoalitionOracle(row.oracle), row.folder);
    }
  });
});
