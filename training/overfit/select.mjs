#!/usr/bin/env node
/**
 * Overfit-subset selection (training/PLAN.md T5a).
 *
 * Selects a deterministic, plan-diverse subset of the trainer view for the
 * tiny overfit test of DS009: one example per (book, plan) fingerprint, taken
 * round-robin across books so no book dominates, written to
 * `training/overfit/overfit-subset.json` with the seed and the export snapshot
 * it was drawn from. Regenerating the selection from the same export
 * reproduces the file byte for byte. Rows of the D11 validation slice
 * (`training/data/validation-slice.json`) are excluded, because the trainer
 * never trains on them and the gate scores the selected folders;
 * `--no-exclude-slice` restores the selection that predates this rule.
 *
 * The same selection is also written as an export-shaped JSONL view
 * (`training/overfit/overfit-subset.jsonl`, rows in export order) because the
 * evaluation loop scores slices of that shape: gate 2 of T5d runs the loop
 * over exactly these training items with
 * `--slice file:training/overfit/overfit-subset.jsonl`.
 *
 * Usage:
 *   node training/overfit/select.mjs [--rows training/data/all-books.jsonl] [--out training/overfit/overfit-subset.json] [--out-jsonl training/overfit/overfit-subset.jsonl] [--size 300] [--seed 20260918] [--slice training/data/validation-slice.json] [--no-exclude-slice]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seededRandom } from '../export.mjs';

const TRAINING_DIR = fileURLToPath(new URL('..', import.meta.url));
export const DEFAULT_ROWS = join(TRAINING_DIR, 'data', 'all-books.jsonl');
export const DEFAULT_OUT = join(TRAINING_DIR, 'overfit', 'overfit-subset.json');
export const DEFAULT_JSONL = join(TRAINING_DIR, 'overfit', 'overfit-subset.jsonl');
export const DEFAULT_SIZE = 300;
export const DEFAULT_SEED = 20260918;
export const DEFAULT_SLICE = join(TRAINING_DIR, 'data', 'validation-slice.json');

/** The `{messages, meta}` rows of an exported JSONL file. */
export function readExportedRows(path) {
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line));
}

/**
 * The D11 validation-slice folders (`training/data/validation-slice.json`), as
 * `book/folder` keys. The trainer drops these rows, so the overfit subset must
 * not spend its selection budget on them.
 */
export function validationSliceFolders(path = DEFAULT_SLICE) {
  const slice = JSON.parse(readFileSync(path, 'utf8'));
  return new Set(slice.folders);
}

/**
 * One representative per (book, plan) pair, then a seeded round-robin across
 * books until `size` examples are selected. The representative of a plan is
 * its first row in sorted folder order, so the choice does not depend on the
 * shuffle. Rows whose `book/folder` appears in `exclude` are skipped, so the
 * selected examples are rows the trainer actually trains on.
 */
export function selectOverfitSubset(rows, { size = DEFAULT_SIZE, seed = DEFAULT_SEED, exclude = null } = {}) {
  const groups = new Map();
  for (const row of rows) {
    const candidate = `${row.meta.book}/${row.meta.folder}`;
    if (exclude !== null && exclude.has(candidate)) {
      continue;
    }
    const key = `${row.meta.book}\u0000${row.meta.plan}`;
    const previous = groups.get(key);
    if (previous === undefined || candidate < previous.folder) {
      groups.set(key, { book: row.meta.book, plan: row.meta.plan, folder: candidate });
    }
  }
  const random = seededRandom(seed);
  const byBook = new Map();
  for (const group of groups.values()) {
    byBook.set(group.book, [...(byBook.get(group.book) ?? []), group]);
  }
  for (const [book, pool] of byBook) {
    for (let position = pool.length - 1; position > 0; position -= 1) {
      const swap = Math.floor(random() * (position + 1));
      [pool[position], pool[swap]] = [pool[swap], pool[position]];
    }
    byBook.set(book, pool);
  }
  const books = [...byBook.keys()].sort();
  const selected = [];
  const cursors = new Map(books.map((book) => [book, 0]));
  let progress = true;
  while (selected.length < size && progress) {
    progress = false;
    for (const book of books) {
      if (selected.length === size) {
        break;
      }
      const pool = byBook.get(book);
      const cursor = cursors.get(book);
      if (cursor < pool.length) {
        selected.push(pool[cursor].folder);
        cursors.set(book, cursor + 1);
        progress = true;
      }
    }
  }
  selected.sort();
  return {
    seed,
    size,
    count: selected.length,
    method: 'one example per (book, plan) fingerprint, seeded round-robin across books, folders sorted',
    folders: selected,
  };
}

function parseArguments(argv) {
  const options = { rows: DEFAULT_ROWS, out: DEFAULT_OUT, outJsonl: DEFAULT_JSONL, size: DEFAULT_SIZE, seed: DEFAULT_SEED, slice: DEFAULT_SLICE, excludeSlice: true };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--rows') {
      options.rows = argv[index + 1];
      index += 1;
    } else if (argument === '--out') {
      options.out = argv[index + 1];
      index += 1;
    } else if (argument === '--out-jsonl') {
      options.outJsonl = argv[index + 1];
      index += 1;
    } else if (argument === '--size') {
      options.size = Number(argv[index + 1]);
      index += 1;
    } else if (argument === '--seed') {
      options.seed = Number(argv[index + 1]);
      index += 1;
    } else if (argument === '--slice') {
      options.slice = argv[index + 1];
      index += 1;
    } else if (argument === '--no-exclude-slice') {
      options.excludeSlice = false;
    } else {
      throw new Error(`unknown argument: ${argument}`);
    }
  }
  return options;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const options = parseArguments(process.argv.slice(2));
  const rows = readExportedRows(options.rows);
  const exclude = options.excludeSlice ? validationSliceFolders(options.slice) : null;
  const subset = selectOverfitSubset(rows, { size: options.size, seed: options.seed, exclude });
  const exportManifest = JSON.parse(readFileSync(join(TRAINING_DIR, 'data', 'export-manifest.json'), 'utf8'));
  const document = {
    purpose: 'Training subset of the tiny overfit test (DS009); never used for the full runs.',
    seed: subset.seed,
    size: subset.size,
    count: subset.count,
    method: exclude === null ? subset.method : `${subset.method}, D11 validation-slice rows excluded`,
    snapshot: exportManifest.snapshot,
    rowsSha256: exportManifest.files['all-books.jsonl'].sha256,
    excludedSlice: exclude === null ? null : { path: options.slice, folders: exclude.size },
    folders: subset.folders,
  };
  writeFileSync(options.out, JSON.stringify(document, null, 2) + '\n');
  const selected = new Set(document.folders);
  const view = rows.filter((row) => selected.has(`${row.meta.book}/${row.meta.folder}`));
  writeFileSync(options.outJsonl, view.map((row) => JSON.stringify(row)).join('\n') + '\n');
  console.log(`overfit subset: ${document.count} examples, ${new Set(subset.folders.map((folder) => folder.split('/')[0])).size} books, seed ${document.seed}`);
  console.log(`snapshot: ${document.snapshot}`);
  console.log(`written: ${options.out}`);
  console.log(`written: ${options.outJsonl} (${view.length} export rows in file order)`);
}
