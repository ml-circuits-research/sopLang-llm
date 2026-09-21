import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import {
  CHAT_PROFILE_ID,
  SYSTEM_PROMPT,
  SYSTEM_PROMPT_SHA256,
  TRAINING_CATEGORIES,
  VALIDATION_SLICE_SIZE,
  buildTrainerView,
  collectRows,
  writeTrainerView,
} from '../training/export.mjs';
import { bookRoots, expectedAnswersOf, statementBodyOf } from '../training-data/dataset-manifest.mjs';

const DATASET_ROOT = fileURLToPath(new URL('../training-data/', import.meta.url));
const DATA_DIR = fileURLToPath(new URL('../training/data/', import.meta.url));
const HOLD_ROW_COUNTS = {
  'procedural-arithmetic': 80,
  'adult-reasoning': 990,
  'common-sense': 950,
  'decompose-to-solve': 900,
  'logical-reasoning': 990,
  'mathematical-thinking': 990,
  'scientific-reasoning': 975,
  'world-as-a-system': 980,
};

const rows = collectRows({ datasetRoot: DATASET_ROOT });

test('the export holds every training row and no holdout row', () => {
  assert.equal(rows.length, 6855);
  const perBook = new Map();
  for (const row of rows) {
    perBook.set(row.book, (perBook.get(row.book) ?? 0) + 1);
    assert.ok(TRAINING_CATEGORIES.includes(row.meta.category));
    assert.ok(!row.meta.folder.startsWith('eval/'));
    assert.ok(row.meta.split !== 'eval');
  }
  assert.deepEqual(Object.fromEntries([...perBook.entries()].sort()), HOLD_ROW_COUNTS);
});

test('every row carries the recorded chat shape and its manifest metadata', () => {
  const expected = new Map(
    bookRoots({ root: DATASET_ROOT }).map((book) => [book, expectedAnswersOf(join(DATASET_ROOT, book))]),
  );
  for (const row of rows) {
    assert.deepEqual(row.messages.map((message) => message.role), ['system', 'user', 'assistant']);
    assert.equal(row.messages[0].content, SYSTEM_PROMPT);
    assert.equal(row.messages[1].content, row.statement);
    assert.equal(row.messages[2].content, row.solution);
    const directory = join(DATASET_ROOT, row.book, row.meta.folder);
    assert.equal(row.statement, statementBodyOf(readFileSync(join(directory, 'problem.md'), 'utf8')));
    assert.equal(row.solution, readFileSync(join(directory, 'solution.sop'), 'utf8'));
    assert.equal(row.meta.book, row.book);
    assert.ok(row.meta.template.length > 0);
    assert.ok(row.meta.type.length > 0);
    assert.ok(row.meta.unit.length > 0);
    assert.equal(row.meta.plan, expected.get(row.book).get(row.meta.folder).plan);
    assert.match(row.meta.hashes.solution, /^[0-9a-f]{12}$/);
    if (row.meta.source.generator === undefined) {
      assert.match(row.meta.source.raw, /^[0-9a-f]{64}$/);
      assert.equal(row.meta.source.extractor, 'docx-canvas-text 1.1.0');
    } else {
      // A generated row names its generator, its version, and the seed its
      // instance was sampled from instead of a document identity.
      assert.equal(row.meta.source.generator, 'arithmetic.mjs');
      assert.match(row.meta.source.generatorVersion, /^\d+\.\d+\.\d+$/);
      assert.equal(typeof row.meta.source.seed, 'number');
    }
  }
});

test('the chat profile is pinned by its text and hash', () => {
  assert.equal(CHAT_PROFILE_ID, 'compiled-plan-chat-1');
  assert.equal(
    SYSTEM_PROMPT,
    'You compile problems into SOP Lang circuits. Read the problem and emit exactly one SOP Lang program, '
      + 'the compiled plan of this instance: a @slots literal wire that carries the values you extracted from '
      + 'the statement, an optional @facts literal wire that carries external knowledge the computation reads, '
      + 'and a @answer jsEval wire that computes the answer deterministically from those values. The program '
      + 'carries no input wire and no model call. Output only the program.',
  );
  assert.equal(SYSTEM_PROMPT_SHA256, buildTrainerView({ datasetRoot: DATASET_ROOT }).manifest.profile.systemPromptSha256);
});

test('the export is deterministic and the committed artifacts are current', () => {
  const first = mkdtempSync(join(tmpdir(), 'soplang-export-a-'));
  const second = mkdtempSync(join(tmpdir(), 'soplang-export-b-'));
  try {
    writeTrainerView({ datasetRoot: DATASET_ROOT, outDir: first });
    writeTrainerView({ datasetRoot: DATASET_ROOT, outDir: second });
    const names = readdirSync(first).sort();
    assert.deepEqual(names, readdirSync(second).sort());
    for (const name of names) {
      assert.equal(
        readFileSync(join(first, name), 'utf8'),
        readFileSync(join(second, name), 'utf8'),
        `${name} differs between two exports`,
      );
      assert.equal(
        readFileSync(join(first, name), 'utf8'),
        readFileSync(join(DATA_DIR, name), 'utf8'),
        `${name} in training/data/ is stale; run node training/export.mjs`,
      );
    }
    const manifest = JSON.parse(readFileSync(join(first, 'export-manifest.json'), 'utf8'));
    assert.equal(manifest.rows, 6855);
    assert.equal(manifest.snapshot, JSON.parse(readFileSync(join(DATA_DIR, 'export-manifest.json'), 'utf8')).snapshot);
  } finally {
    rmSync(first, { recursive: true, force: true });
    rmSync(second, { recursive: true, force: true });
  }
});

test('the validation slice is the recorded size, a subset, and deterministic', () => {
  const view = buildTrainerView({ datasetRoot: DATASET_ROOT });
  const slice = view.validation;
  assert.equal(slice.count, VALIDATION_SLICE_SIZE);
  assert.equal(new Set(slice.folders).size, slice.count);
  const known = new Map(rows.map((row) => [`${row.book}/${row.meta.folder}`, row]));
  const selected = new Set(slice.folders);
  const plansOutside = new Set(
    rows.filter((row) => !selected.has(`${row.book}/${row.meta.folder}`)).map((row) => `${row.book}:${row.meta.plan}`),
  );
  let disjoint = 0;
  for (const folder of slice.folders) {
    const row = known.get(folder);
    assert.ok(row, `${folder} is not an exported training row`);
    if (!plansOutside.has(`${row.book}:${row.meta.plan}`)) {
      disjoint += 1;
    }
  }
  assert.equal(slice.planDisjoint, disjoint);
  assert.ok(disjoint > 0);
  assert.deepEqual(slice.folders, [...slice.folders].sort());
});

test('the overfit subset is plan-diverse, deterministic, and a subset of the export', async () => {
  const { selectOverfitSubset } = await import('../training/overfit/select.mjs');
  const subset = selectOverfitSubset(rows);
  assert.equal(subset.count, 300);
  assert.equal(new Set(subset.folders).size, subset.count);
  const exported = new Map(rows.map((row) => [`${row.book}/${row.meta.folder}`, row.meta.plan]));
  const plans = new Set();
  for (const folder of subset.folders) {
    const plan = exported.get(folder);
    assert.ok(plan !== undefined, `${folder} is not an exported training row`);
    assert.ok(!plans.has(plan), `${folder} repeats the plan of another selected example`);
    plans.add(plan);
  }
  assert.deepEqual(subset.folders, [...subset.folders].sort());
  assert.deepEqual(selectOverfitSubset(rows).folders, subset.folders);
});

test('the overfit subset excludes the D11 validation slice when the slice is passed', async () => {
  const { selectOverfitSubset, validationSliceFolders } = await import('../training/overfit/select.mjs');
  const exclude = validationSliceFolders();
  assert.ok(exclude.size > 0);
  const subset = selectOverfitSubset(rows, { exclude });
  assert.equal(subset.count, 300);
  assert.equal(new Set(subset.folders).size, subset.count);
  const exported = new Set(rows.map((row) => `${row.book}/${row.meta.folder}`));
  for (const folder of subset.folders) {
    assert.ok(!exclude.has(folder), `${folder} is a D11 validation-slice row`);
    assert.ok(exported.has(folder), `${folder} is not an exported training row`);
  }
  assert.deepEqual(selectOverfitSubset(rows, { exclude }).folders, subset.folders);
});

test('an unknown book id is refused with the implemented list', () => {
  assert.throws(
    () => writeTrainerView({ datasetRoot: DATASET_ROOT, book: 'no-such-book' }),
    /unknown book id: no-such-book; the implemented books are adult-reasoning, common-sense, decompose-to-solve, logical-reasoning, mathematical-thinking, procedural-arithmetic, scientific-reasoning, world-as-a-system/,
  );
});
