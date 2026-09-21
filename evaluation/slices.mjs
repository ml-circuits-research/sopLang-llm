#!/usr/bin/env node
/**
 * Slice resolution for the evaluation loop: which items a run scores.
 *
 * A slice is resolved from the shipped tree, never recomputed from a split
 * decision: `holdout` reads the `eval/` folders of `training-data/<book>`, the
 * validation slice reads the folder ids of `validation-slice.json` against the
 * export, and `file:<path>` reads any JSONL in export row shape. Items whose
 * folder has no manifest row are a dataset defect rather than an item outcome,
 * so resolution fails loudly instead of scoring without an oracle.
 *
 * The module also owns the identity of a resolved slice: one hash over the
 * scored items (book, folder, plan, expected answer, statement). A report that
 * names only the trainer export can name a dataset that no scored item came
 * from, because the export is a derived file that a later regeneration
 * rewrites; the identity is what lets a reader check a report against the tree
 * it actually measured.
 */

import { readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

import { bookRoots, expectedAnswersOf, solutionFilesOf, statementBodyOf } from '../training-data/dataset-manifest.mjs';

export const DEFAULT_DATA_ROOT = join(dirname(new URL(import.meta.url).pathname), '..', 'training-data');
export const DEFAULT_EXPORT = join(dirname(new URL(import.meta.url).pathname), '..', 'training', 'data', 'all-books.jsonl');
export const DEFAULT_VALIDATION_SLICE = join(
  dirname(new URL(import.meta.url).pathname),
  '..',
  'training',
  'data',
  'validation-slice.json'
);

function sha256OfText(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

export function sliceNameOf(slice) {
  if (slice === 'holdout' || slice === 'validation') return slice;
  if (typeof slice === 'string' && slice.startsWith('file:')) {
    const filePath = slice.slice('file:'.length);
    if (filePath === '') throw new Error('--slice file: needs a path');
    return basename(filePath).replace(/\.jsonl$/i, '') || 'slice';
  }
  throw new Error(`unknown slice "${slice}": use holdout, validation, or file:<path>`);
}

function readJsonl(filePath) {
  const rows = [];
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    if (line.trim() === '') continue;
    rows.push(JSON.parse(line));
  }
  return rows;
}

/** One resolved item: the identity, the statement body, and the oracle answer. */
function itemOf({ book, folder, plan, unit, template, category, statement, oracle }) {
  return {
    id: `${book}/${folder}`,
    book,
    folder,
    plan: plan ?? null,
    unit: unit ?? null,
    template: template ?? null,
    category: category ?? null,
    statement,
    oracle: oracle ?? null
  };
}

function categoryOf(folder) {
  for (const part of String(folder).split('/')) {
    if (part === 'knowledge' || part === 'no-knowledge') return part;
  }
  return null;
}

function statementOf(dataRoot, book, folder) {
  const path = join(dataRoot, book, ...String(folder).split('/'), 'problem.md');
  return statementBodyOf(readFileSync(path, 'utf8'));
}

function oracleTable(book, root, cache) {
  if (!cache.has(book)) cache.set(book, expectedAnswersOf(root));
  return cache.get(book);
}

function itemsFromExportRows({ rows, wanted, dataRoot, books, label }) {
  const cache = new Map();
  const items = [];
  for (const row of rows) {
    const meta = row?.meta ?? {};
    if (typeof meta.book !== 'string' || typeof meta.folder !== 'string') {
      throw new Error(`${label}: every row must carry meta.book and meta.folder`);
    }
    const id = `${meta.book}/${meta.folder}`;
    if (wanted !== null && !wanted.has(id)) continue;
    if (books !== null && !books.includes(meta.book)) continue;
    const expected = oracleTable(meta.book, join(dataRoot, meta.book), cache).get(meta.folder);
    if (expected === undefined) throw new Error(`${label}: no manifest row for ${id}, so the item has no oracle answer`);
    items.push(
      itemOf({
        book: meta.book,
        folder: meta.folder,
        plan: expected.plan ?? meta.plan,
        unit: meta.unit,
        template: meta.template,
        category: meta.category ?? categoryOf(meta.folder),
        statement: statementOf(dataRoot, meta.book, meta.folder),
        oracle: expected.answer
      })
    );
  }
  if (wanted === null || books !== null) return items;
  const seen = new Set(items.map((item) => item.id));
  const missing = [...wanted].filter((id) => !seen.has(id)).sort();
  if (missing.length > 0) {
    throw new Error(`${label}: ${missing.length} folder(s) are absent from the export, e.g. ${missing[0]}`);
  }
  return items;
}

/**
 * The items of one slice, sorted by id and cut to `limit`:
 *
 * - `holdout`    the `eval/` examples of `training-data/<book>`, with the
 *                statement from `problem.md` and the oracle from the manifest
 * - `validation` the export rows whose `<book>/<folder>` id is listed in
 *                `validation-slice.json`
 * - `file:<path>` a JSONL file in export row shape (the same rows the export
 *                writes), for a pinned subset or the baseline sample of T4
 */
export function resolveSlice({
  slice,
  dataRoot = DEFAULT_DATA_ROOT,
  exportPath = DEFAULT_EXPORT,
  validationPath = DEFAULT_VALIDATION_SLICE,
  books = null,
  limit = null
}) {
  const sliceName = sliceNameOf(slice);
  let items;
  let source;

  if (slice === 'holdout') {
    const known = bookRoots({ root: dataRoot });
    if (books !== null) {
      const unknown = books.filter((book) => !known.includes(book));
      if (unknown.length > 0) throw new Error(`unknown book(s): ${unknown.join(', ')}`);
    }
    const selected = known.filter((book) => books === null || books.includes(book));
    items = [];
    for (const book of selected) {
      const root = join(dataRoot, book);
      const oracles = expectedAnswersOf(root);
      for (const file of solutionFilesOf(root)) {
        const folder = dirname(file).split('/').slice(-1)[0];
        const relativeFolder = relativeFolderOf(root, file);
        if (!relativeFolder.startsWith('eval/')) continue;
        const expected = oracles.get(relativeFolder);
        if (expected === undefined) throw new Error(`holdout: no manifest row for ${book}/${relativeFolder}`);
        items.push(
          itemOf({
            book,
            folder: relativeFolder,
            plan: expected.plan,
            category: categoryOf(relativeFolder),
            statement: statementBodyOf(readFileSync(join(dirname(file), 'problem.md'), 'utf8')),
            oracle: expected.answer
          })
        );
        void folder;
      }
    }
    source = `${dataRoot}/<book>/eval/**/solution.sop`;
  } else if (slice === 'validation') {
    const wanted = new Set(JSON.parse(readFileSync(validationPath, 'utf8')).folders);
    items = itemsFromExportRows({ rows: readJsonl(exportPath), wanted, dataRoot, books, label: 'validation' });
    source = `${exportPath} filtered by ${validationPath}`;
  } else {
    const filePath = slice.slice('file:'.length);
    items = itemsFromExportRows({ rows: readJsonl(filePath), wanted: null, dataRoot, books, label: `file:${filePath}` });
    source = filePath;
  }

  items.sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
  if (limit !== null && limit !== undefined) items = items.slice(0, limit);
  return { sliceName, source, items };
}

function relativeFolderOf(root, file) {
  const prefix = `${root}/`;
  const withoutPrefix = file.startsWith(prefix) ? file.slice(prefix.length) : file;
  return withoutPrefix.replace(/\/solution\.sop$/, '');
}

/**
 * The identity of a resolved slice: one SHA-256 over the items the run scores.
 *
 * The score of an evaluation is a statement about a concrete set of prompts and
 * expected answers. The scored set is a set, so the lines are sorted before
 * hashing: a resolver that changes its ordering does not change the identity of
 * a slice, while adding, dropping, or altering an item does.
 */
export function sliceIdentityOf(items) {
  const lines = items.map((item) =>
    [item.book, item.folder, item.plan, item.oracle, item.statement].join('\u0000')
  );
  return sha256OfText(lines.slice().sort().join('\n'));
}
