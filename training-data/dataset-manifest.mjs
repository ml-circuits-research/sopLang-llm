/**
 * Book dataset readers of the verifier.
 *
 * These readers locate the shipped trees under a root and read the manifest
 * tables by their own header row, so a book may carry extra columns (the world
 * book writes the grade next to the family) without a book-specific regex.
 * The statement body of an example is the part of `problem.md` after the
 * identity heading: the text a solver actually receives.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEFAULT_ROOT = fileURLToPath(new URL('.', import.meta.url));

export function bookRoots({ root = DEFAULT_ROOT, book = null } = {}) {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => book === null || name === book)
    .filter((name) => existsSync(join(root, name, 'manifest')))
    .sort();
}

/** Every solution.sop of a book dataset, across the categories that hold them. */
export function solutionFilesOf(root) {
  const files = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(path);
      } else if (entry.name === 'solution.sop') {
        files.push(path);
      }
    }
  };
  for (const category of ['no-knowledge', 'knowledge', 'eval']) {
    const path = join(root, category);
    if (existsSync(path)) {
      walk(path);
    }
  }
  return files.sort();
}

/**
 * Every manifest row of a book dataset, in manifest-file and row order, as the
 * ordered header together with the cells of each row. Books differ in their
 * columns (the world book carries the grade next to the family, the
 * common-sense book writes its unit under a repeated `template` header), so a
 * reader that needs a column reads the header instead of assuming a position.
 */
export function manifestRowsOf(root) {
  const rows = [];
  const manifestDirectory = join(root, 'manifest');
  for (const fileName of readdirSync(manifestDirectory).sort()) {
    const lines = readFileSync(join(manifestDirectory, fileName), 'utf8').split('\n');
    let header = null;
    for (const line of lines) {
      if (!line.startsWith('|')) {
        continue;
      }
      const cells = splitCells(line);
      if (cells.every((cell) => /^-+$/.test(cell))) {
        continue;
      }
      if (header === null) {
        header = cells;
        continue;
      }
      if (cells.length !== header.length) {
        continue;
      }
      rows.push({ file: fileName, header, cells });
    }
  }
  return rows;
}

/**
 * The manifest row as named values. A header name may repeat (the common-sense
 * book writes `template` for both the unit and the template), and the later
 * occurrence wins, which is the column the book means by that name.
 */
export function manifestRowValues(entry) {
  return Object.fromEntries(entry.header.map((name, index) => [name, entry.cells[index]]));
}

/**
 * The manifest row of every accepted example, keyed by the dataset-relative
 * folder: the printed answer the circuit must reproduce and the plan
 * fingerprint that identifies the latent plan across the variants of a
 * template.
 */
export function expectedAnswersOf(root) {
  const expected = new Map();
  for (const entry of manifestRowsOf(root)) {
    const row = manifestRowValues(entry);
    if (typeof row.folder !== 'string' || row.answer === undefined || row.plan === undefined) {
      continue;
    }
    expected.set(row.folder, { answer: row.answer, plan: row.plan });
  }
  return expected;
}

/**
 * The cells of a manifest table row. The writer escapes the column separator
 * inside a value (an answer may state its levels with `|`), so the split runs
 * on unescaped pipes only.
 */
export function splitCells(line) {
  const body = line.replace(/^\|/, '').replace(/\|$/, '');
  const cells = [];
  let current = '';
  for (let index = 0; index < body.length; index += 1) {
    const character = body[index];
    if (character === '\\' && body[index + 1] === '|') {
      current += '|';
      index += 1;
    } else if (character === '|') {
      cells.push(current.trim());
      current = '';
    } else {
      current += character;
    }
  }
  cells.push(current.trim());
  return cells;
}

/** The statement of a shipped example: `problem.md` without its identity heading. */
export function statementBodyOf(text) {
  const separator = text.indexOf('\n\n');
  return separator === -1 ? text : text.slice(separator + 2);
}
