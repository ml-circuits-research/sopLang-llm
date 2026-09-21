#!/usr/bin/env node
/**
 * Trainer-view exporter (training/PLAN.md T2; DS009 "Dataset materialization").
 *
 * Reads the shipped book trees under `training-data/` and writes the immutable
 * trainer view under `training/data/`: one JSONL file per book plus one
 * combined file, every row carrying the exact role-separated messages of the
 * recorded chat profile `compiled-plan-chat-2` and the manifest metadata that
 * travels beside the messages, never inside them. The exporter also writes the
 * export manifest with the per-file SHA-256 hashes and the content-addressed
 * dataset snapshot id, the distribution report that DS009 requires before
 * tokenization, and the validation slice the trainer keeps out of training.
 *
 * The tool reads only `no-knowledge/` and `knowledge/`; `eval/` is the
 * evaluation holdout and a directory fact, so a split is never recomputed. Two
 * runs over the same tree are byte-identical: no output carries a timestamp.
 *
 * Usage:
 *   node training/export.mjs [--root <dataset root>] [--out <output dir>] [--book <book id>]
 */

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  bookRoots,
  manifestRowsOf,
  manifestRowValues,
  splitCells,
  statementBodyOf,
} from '../training-data/dataset-manifest.mjs';
import { SOURCES } from '../teacher/sources/index.mjs';
import {
  preservationFileName,
  preservationManifestOf,
  preservationRowsOf,
} from './preservation.mjs';

/** Registered sources whose statements come from a generator, not a document, keyed by id. */
const GENERATED_SOURCES = new Map(SOURCES.filter((source) => source.kind === 'generated').map((source) => [source.id, source]));
const GENERATED_SOURCE_IDS = new Set(GENERATED_SOURCES.keys());

export const EXPORTER_VERSION = '1.0.0';
export const CHAT_PROFILE_ID = 'compiled-plan-chat-2';

/**
 * The fixed system prompt of the profile: hashing it pins the exact text.
 *
 * The prompt names every shape the targets of this export may carry, because
 * `DS008-training-data.md` requires the profile to match the suite it
 * describes: a profile that promises one shape while the targets carry another
 * teaches the student to emit declared-but-absent structure. `compiled-plan-chat-1`
 * named the `slots`-plus-`answer` shape; the widened suite teaches plans with
 * named intermediate wires, so `compiled-plan-chat-2` names them too.
 */
export const SYSTEM_PROMPT = [
  'You compile problems into SOP Lang circuits.',
  'Read the problem and emit exactly one SOP Lang program, the compiled plan of this instance:',
  'a @slots literal wire that carries the values you extracted from the statement,',
  'an optional @facts literal wire that carries external knowledge the computation reads,',
  'zero or more intermediate wires that publish the named stages of the plan for the later wires to read through $name,',
  'and a @answer jsEval wire that computes the answer deterministically from those values.',
  'Every jsEval wire computes deterministic work from the values it reads and asserts its inputs and its output with probe(...) calls.',
  'The program carries no input wire and no model call.',
  'Output only the program.',
].join(' ');

export const SYSTEM_PROMPT_SHA256 = sha256(SYSTEM_PROMPT);

/** The categories that hold training rows; `eval/` is the holdout, by directory. */
export const TRAINING_CATEGORIES = ['no-knowledge', 'knowledge'];

/** The validation slice of D11: 5% of the training rows, seed 3407. */
export const VALIDATION_SEED = 3407;
export const VALIDATION_SLICE_SIZE = 339;

const TRAINING_DIR = fileURLToPath(new URL('.', import.meta.url));
export const DEFAULT_DATA_DIR = join(TRAINING_DIR, 'data');
export const DEFAULT_DATASET_ROOT = fileURLToPath(new URL('../training-data/', import.meta.url));

/** The book-specific grouping column of a manifest row; see `unitOf`. */
const UNIT_COLUMNS = ['chapter', 'section', 'pattern', 'form', 'family'];

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

/**
 * The `sources.md` registry of the dataset root, keyed by book id: the raw and
 * canonical source hashes plus the extractor version every exported row
 * carries as provenance.
 */
export function sourceRegistryOf(datasetRoot) {
  const text = readFileSync(join(datasetRoot, 'sources.md'), 'utf8');
  const lines = text.split('\n').filter((line) => line.startsWith('|'));
  const header = splitCells(lines[0]);
  const registry = new Map();
  for (const line of lines.slice(2)) {
    const cells = splitCells(line);
    if (cells.length !== header.length) {
      continue;
    }
    const row = Object.fromEntries(header.map((name, index) => [name, cells[index]]));
    registry.set(row.source, {
      rawHash: row['raw hash'],
      canonicalHash: row['canonical hash'],
      extractor: row.extractor,
      rights: row.rights,
      permittedUse: row['permitted use'],
    });
  }
  return registry;
}

/**
 * The grouping value of a manifest row. Most books name the column explicitly
 * (`chapter`, `section`, `pattern`, `form`, `family`); the common-sense book
 * writes its unit under a repeated `template` header, where the first
 * occurrence is the unit and the second the template name.
 */
function unitOf(entry) {
  const typeIndex = entry.header.indexOf('type');
  const searchEnd = typeIndex === -1 ? entry.header.length : typeIndex;
  for (const name of UNIT_COLUMNS) {
    const index = entry.header.indexOf(name);
    if (index !== -1 && index < searchEnd) {
      return entry.cells[index];
    }
  }
  const first = entry.header.indexOf('template');
  if (first !== -1 && entry.header.indexOf('template', first + 1) !== -1) {
    return entry.cells[first];
  }
  return '';
}

/**
 * Every training row of the dataset root, in deterministic order: book order,
 * then manifest-file and row order. A row is a training row when its category
 * is a training category and its folder is not under `eval/`; the three
 * content hashes are re-checked against the files, so a stale manifest fails
 * the export instead of shipping.
 */
export function collectRows({ datasetRoot = DEFAULT_DATASET_ROOT, book = null } = {}) {
  const books = bookRoots({ root: datasetRoot, book });
  if (book !== null && books.length === 0) {
    throw new Error(`unknown book id: ${book}; the implemented books are ${bookRoots({ root: datasetRoot }).join(', ')}`);
  }
  const sources = sourceRegistryOf(datasetRoot);
  const rows = [];
  for (const bookName of books) {
    const source = sources.get(bookName) ?? {};
    for (const entry of manifestRowsOf(join(datasetRoot, bookName))) {
      const values = manifestRowValues(entry);
      const folder = values.folder;
      if (typeof folder !== 'string' || folder.startsWith('eval/') || values.split === 'eval') {
        continue;
      }
      if (!TRAINING_CATEGORIES.includes(values.category)) {
        continue;
      }
      const directory = join(datasetRoot, bookName, folder);
      const problem = readFileSync(join(directory, 'problem.md'), 'utf8');
      const solution = readFileSync(join(directory, 'solution.sop'), 'utf8');
      const explanation = readFileSync(join(directory, 'explanation.md'), 'utf8');
      for (const [column, text] of [['problem', problem], ['solution', solution], ['explanation', explanation]]) {
        const actual = sha256(text).slice(0, 12);
        if (values[column] !== undefined && values[column] !== actual) {
          throw new Error(`${bookName}/${folder}: the ${column} hash ${actual} does not match the manifest value ${values[column]}`);
        }
      }
      rows.push({
        book: bookName,
        folder,
        statement: statementBodyOf(problem),
        solution,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: statementBodyOf(problem) },
          { role: 'assistant', content: solution },
        ],
        meta: {
          book: bookName,
          unit: unitOf(entry),
          folder,
          template: values.template ?? '',
          type: values.type ?? '',
          category: values.category,
          split: values.split ?? '',
          plan: values.plan ?? '',
          status: values.status ?? '',
          hashes: { problem: values.problem ?? '', solution: values.solution ?? '', explanation: values.explanation ?? '' },
          // A generated row records its generator in place of a document identity:
          // there are no source bytes and no extractor to name (DS008, procedural
          // source families).
          source: GENERATED_SOURCES.has(bookName)
            ? {
                generator: GENERATED_SOURCES.get(bookName).generator,
                generatorVersion: GENERATED_SOURCES.get(bookName).generatorVersion,
                seed: GENERATED_SOURCES.get(bookName).seed,
              }
            : {
                raw: source.rawHash ?? '',
                canonical: source.canonicalHash ?? '',
                extractor: source.extractor ?? '',
              },
          manifest: values,
        },
      });
    }
  }
  return rows;
}

/** The data record of one row: `messages` plus the metadata that travels beside them. */
export function serializedRow(row) {
  return JSON.stringify({ messages: row.messages, meta: row.meta });
}

function jsonlOf(rows, serialized) {
  return rows.map((row) => serialized(row)).join('\n') + '\n';
}

/**
 * The content-addressed dataset snapshot id: a SHA-256 over the sorted
 * fingerprints of every training row, so the id changes whenever an example,
 * its plan, or its folder identity changes.
 */
export function snapshotOf(rows) {
  const fingerprints = rows
    .map((row) => `${row.book}/${row.folder} ${row.meta.plan} ${row.meta.hashes.problem} ${row.meta.hashes.solution}`)
    .sort();
  return sha256(fingerprints.join('\n'));
}

/** Deterministic PRNG (mulberry32) so a selection is reproducible from its seed alone. */
export function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The validation slice of D11: a seeded Fisher-Yates shuffle over the export
 * order while reserving the same number of rows from every book, so the macro
 * tables by book rest on comparable sample sizes. Within a book the selection
 * prefers a row whose plan does not already occur in the slice, so the
 * selection metric reads like the plan-clustered holdout; a book with fewer
 * plans than its quota (common-sense has 19) is filled with the shuffled
 * remainder and reports its overlap.
 */
export function validationSliceOf(rows, { seed = VALIDATION_SEED, size = VALIDATION_SLICE_SIZE } = {}) {
  const random = seededRandom(seed);
  const perBook = new Map();
  for (const row of rows) {
    // A procedural source holds out whole families in its own `eval/` tree, so
    // the D11 row slice stays a book-only instrument: adding a generator must
    // not move the slice the earlier experiments were measured against.
    if (GENERATED_SOURCE_IDS.has(row.book)) {
      continue;
    }
    perBook.set(row.book, [...(perBook.get(row.book) ?? []), row]);
  }
  const selection = [];
  const quota = Math.floor(size / perBook.size);
  const remainder = size - quota * perBook.size;
  const books = [...perBook.keys()];
  books.forEach((book, index) => {
    const pool = perBook.get(book);
    const take = quota + (index < remainder ? 1 : 0);
    const indices = pool.map((_, position) => position);
    for (let position = indices.length - 1; position > 0; position -= 1) {
      const swap = Math.floor(random() * (position + 1));
      [indices[position], indices[swap]] = [indices[swap], indices[position]];
    }
    const chosen = [];
    const plans = new Set();
    for (const position of indices) {
      if (chosen.length === take) {
        break;
      }
      if (!plans.has(pool[position].meta.plan)) {
        plans.add(pool[position].meta.plan);
        chosen.push(pool[position]);
      }
    }
    for (const position of indices) {
      if (chosen.length === take) {
        break;
      }
      if (!chosen.includes(pool[position])) {
        chosen.push(pool[position]);
      }
    }
    for (const row of chosen) {
      selection.push(`${book}/${row.folder}`);
    }
  });
  selection.sort();
  return {
    seed,
    size,
    count: selection.length,
    method: 'per-book quota of the 5% slice, seeded Fisher-Yates (mulberry32) over each book\'s export order, plan-disjoint first, folders sorted',
    planDisjoint: selection.filter((folder) => {
      const separator = folder.indexOf('/');
      const book = folder.slice(0, separator);
      const rest = folder.slice(separator + 1);
      const row = rows.find((candidate) => candidate.book === book && candidate.folder === rest);
      const plan = row?.meta.plan;
      return (perBook.get(book) ?? []).filter((candidate) => candidate.meta.plan === plan).length === 1;
    }).length,
    folders: selection,
  };
}

function percentile(sorted, fraction) {
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(fraction * sorted.length) - 1));
  return sorted[index];
}

function distribution(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return {
    min: sorted[0],
    p50: percentile(sorted, 0.5),
    p90: percentile(sorted, 0.9),
    p99: percentile(sorted, 0.99),
    max: sorted[sorted.length - 1],
  };
}

/** Measures of one row that the report distributes; see `renderReport`. */
export function measuresOf(row) {
  const wireLines = row.solution.match(/^@[A-Za-z0-9_-]+[ \t]+\S+/gm) ?? [];
  const solutionLines = row.solution.split('\n');
  const jsStart = solutionLines.findIndex((line) => /^@[A-Za-z0-9_-]+[ \t]+jsEval\b/.test(line));
  const dependencies = new Set(row.solution.match(/\$[A-Za-z_][A-Za-z0-9_]*/g) ?? []);
  return {
    statementCharacters: row.statement.length,
    targetCharacters: row.solution.length,
    wires: wireLines.length,
    jsLines: jsStart === -1 ? 0 : solutionLines.slice(jsStart + 1).filter((line) => line.trim() !== '').length,
    dependencies: dependencies.size,
  };
}

const MEASURE_NAMES = [
  ['statementCharacters', 'statement characters'],
  ['targetCharacters', 'target characters'],
  ['wires', 'wire declarations'],
  ['jsLines', 'jsEval body lines'],
  ['dependencies', '$ dependencies'],
];

/** The DS009 pre-tokenization distribution report of the exported rows. */
export function renderReport({ rows, validation, snapshot }) {
  const books = [...new Set(rows.map((row) => row.book))];
  const lines = [];
  lines.push('# Trainer-view export report');
  lines.push('');
  lines.push('Derived by `training/export.mjs` from the shipped trees under `training-data/`;');
  lines.push(`dataset snapshot \`${snapshot}\`. The report is deterministic and carries no timestamp.`);
  lines.push('');
  lines.push('| book | rows | no-knowledge | knowledge | templates | plans |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  const tableRows = [...books, 'all books'];
  for (const book of tableRows) {
    const selected = book === 'all books' ? rows : rows.filter((row) => row.book === book);
    const count = (category) => selected.filter((row) => row.meta.category === category).length;
    const templates = new Set(selected.map((row) => `${row.meta.type}\u0000${row.meta.template}`)).size;
    const plans = new Set(selected.map((row) => row.meta.plan)).size;
    lines.push(`| ${book} | ${selected.length} | ${count('no-knowledge')} | ${count('knowledge')} | ${templates} | ${plans} |`);
  }
  lines.push('');
  lines.push('## Distributions');
  lines.push('');
  lines.push('Measured over the exported training rows before tokenization. `statement characters` is the user');
  lines.push('message, `target characters` the assistant message, `wire declarations` the `@name command` lines');
  lines.push('of the solution, `jsEval body lines` the non-empty lines after the `jsEval` declaration, and');
  lines.push('`$ dependencies` the distinct `$name` references of the solution text.');
  lines.push('');
  lines.push('| book | measure | min | p50 | p90 | p99 | max |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  for (const book of tableRows) {
    const selected = book === 'all books' ? rows : rows.filter((row) => row.book === book);
    const measures = selected.map(measuresOf);
    for (const [key, label] of MEASURE_NAMES) {
      const stats = distribution(measures.map((measure) => measure[key]));
      lines.push(`| ${book} | ${label} | ${stats.min} | ${stats.p50} | ${stats.p90} | ${stats.p99} | ${stats.max} |`);
    }
  }
  lines.push('');
  lines.push('## Longest targets');
  lines.push('');
  lines.push('| folder | target characters |');
  lines.push('| --- | --- |');
  const longestTargets = [...rows].sort((left, right) => right.solution.length - left.solution.length).slice(0, 10);
  for (const row of longestTargets) {
    lines.push(`| ${row.book}/${row.folder} | ${row.solution.length} |`);
  }
  lines.push('');
  lines.push('## Longest statements');
  lines.push('');
  lines.push('| folder | statement characters |');
  lines.push('| --- | --- |');
  const longestStatements = [...rows].sort((left, right) => right.statement.length - left.statement.length).slice(0, 10);
  for (const row of longestStatements) {
    lines.push(`| ${row.book}/${row.folder} | ${row.statement.length} |`);
  }
  lines.push('');
  lines.push('## Validation slice');
  lines.push('');
  lines.push(`Seed ${validation.seed}, ${validation.count} rows, one quota per book (${validation.method}).`);
  lines.push('The trainer excludes these folder ids from training. Rows were preferred plan-disjoint, so a library');
  lines.push('with fewer plans than its quota (common-sense) reuses plans; the table below records the plan counts.');
  lines.push('');
  const byBook = new Map();
  for (const folder of validation.folders) {
    const book = folder.split('/')[0];
    byBook.set(book, (byBook.get(book) ?? 0) + 1);
  }
  const plansOfBook = new Map();
  for (const row of rows) {
    plansOfBook.set(row.book, (plansOfBook.get(row.book) ?? new Set()).add(row.meta.plan));
  }
  lines.push('| book | validation rows | plans in the book | validation rows on a reused plan |');
  lines.push('| --- | --- | --- | --- |');
  for (const book of [...byBook.keys()].sort()) {
    const selected = validation.folders.filter((folder) => folder.startsWith(`${book}/`));
    const plans = new Set(selected.map((folder) => rows.find((row) => `${row.book}/${row.folder}` === folder)?.meta.plan));
    lines.push(`| ${book} | ${selected.length} | ${plansOfBook.get(book)?.size ?? 0} | ${selected.length - plans.size} |`);
  }
  lines.push('');
  return lines.join('\n');
}

/** In-memory trainer view: the JSONL files, manifest, report, and validation slice. */
export function buildTrainerView({ datasetRoot = DEFAULT_DATASET_ROOT } = {}) {
  const rows = collectRows({ datasetRoot });
  const books = [...new Set(rows.map((row) => row.book))];
  const serialized = serializedRow;
  const files = new Map();
  for (const book of books) {
    files.set(`${book}.jsonl`, jsonlOf(rows.filter((row) => row.book === book), serialized));
  }
  files.set('all-books.jsonl', jsonlOf(rows, serialized));

  const snapshot = snapshotOf(rows);
  const validation = validationSliceOf(rows);
  const report = renderReport({ rows, validation, snapshot });

  const fileRecords = {};
  for (const [name, text] of files) {
    fileRecords[name] = { sha256: sha256(text), bytes: Buffer.byteLength(text), rows: text.split('\n').length - 1 };
  }
  // The capability-preservation view (DS009): the same statements with the
  // derived JavaScript target, so a mixture arm can repeat 10% of the export in
  // the other output language without importing a second corpus.
  const preservationRows = preservationRowsOf(rows);
  const preservationName = preservationFileName();
  const preservationFile = jsonlOf(preservationRows, serialized);
  fileRecords[preservationName] = {
    sha256: sha256(preservationFile),
    bytes: Buffer.byteLength(preservationFile),
    rows: preservationRows.length,
  };
  const bookRecords = {};
  for (const book of books) {
    const selected = rows.filter((row) => row.book === book);
    bookRecords[book] = {
      rows: selected.length,
      categories: Object.fromEntries(
        TRAINING_CATEGORIES.map((category) => [category, selected.filter((row) => row.meta.category === category).length]),
      ),
      templates: new Set(selected.map((row) => `${row.meta.type}\u0000${row.meta.template}`)).size,
      plans: new Set(selected.map((row) => row.meta.plan)).size,
    };
  }
  const manifest = {
    exporter: `training/export.mjs ${EXPORTER_VERSION}`,
    profile: { id: CHAT_PROFILE_ID, systemPromptSha256: SYSTEM_PROMPT_SHA256 },
    snapshot,
    rows: rows.length,
    books: bookRecords,
    files: fileRecords,
    dataset: {
      root: 'training-data',
      sourcesSha256: sha256(readFileSync(join(datasetRoot, 'sources.md'), 'utf8')),
    },
    validationSlice: { seed: validation.seed, count: validation.count },
    preservation: {
      ...preservationManifestOf(preservationRows, { sourceSnapshot: snapshot }),
      file: preservationName,
      sha256: fileRecords[preservationName].sha256,
      bytes: fileRecords[preservationName].bytes,
    },
  };
  return { rows, files, manifest, report, validation, preservationFile, preservationName };
}

/** Writes the trainer view and returns its manifest. `book` limits the JSONL files written. */
export function writeTrainerView({ datasetRoot = DEFAULT_DATASET_ROOT, outDir = DEFAULT_DATA_DIR, book = null } = {}) {
  if (book !== null && !bookRoots({ root: datasetRoot, book }).length) {
    throw new Error(`unknown book id: ${book}; the implemented books are ${bookRoots({ root: datasetRoot }).join(', ')}`);
  }
  const view = buildTrainerView({ datasetRoot });
  mkdirSync(outDir, { recursive: true });
  for (const [name, text] of view.files) {
    if (book !== null && name === 'all-books.jsonl') {
      continue;
    }
    if (book !== null && name !== `${book}.jsonl`) {
      continue;
    }
    writeFileSync(join(outDir, name), text);
  }
  if (book === null) {
    writeFileSync(join(outDir, view.preservationName), view.preservationFile);
  }
  writeFileSync(join(outDir, 'export-manifest.json'), JSON.stringify(view.manifest, null, 2) + '\n');
  writeFileSync(join(outDir, 'report.md'), view.report);
  writeFileSync(join(outDir, 'validation-slice.json'), JSON.stringify(view.validation, null, 2) + '\n');
  return view.manifest;
}

function parseArguments(argv) {
  const options = { datasetRoot: DEFAULT_DATASET_ROOT, outDir: DEFAULT_DATA_DIR, book: null };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--root') {
      options.datasetRoot = argv[index + 1];
      index += 1;
    } else if (argument === '--out') {
      options.outDir = argv[index + 1];
      index += 1;
    } else if (argument === '--book') {
      options.book = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`unknown argument: ${argument}`);
    }
  }
  return options;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const options = parseArguments(process.argv.slice(2));
  const manifest = writeTrainerView(options);
  console.log(`exporter: training/export.mjs ${EXPORTER_VERSION}, profile ${CHAT_PROFILE_ID}`);
  console.log(`rows: ${manifest.rows}, snapshot: ${manifest.snapshot}`);
  for (const [book, record] of Object.entries(manifest.books)) {
    console.log(`  ${book}: ${record.rows} rows (${record.categories['no-knowledge']} no-knowledge, ${record.categories.knowledge} knowledge), ${record.templates} templates, ${record.plans} plans`);
  }
  for (const [name, record] of Object.entries(manifest.files)) {
    console.log(`  ${name}: ${record.rows} rows, ${record.bytes} bytes, sha256 ${record.sha256.slice(0, 16)}`);
  }
  console.log(
    `  ${manifest.preservation.file}: ${manifest.preservation.rows} rows, profile ${manifest.preservation.profile.id}, ratio ${manifest.preservation.ratio} (1 in ${manifest.preservation.stride}), sha256 ${manifest.preservation.sha256.slice(0, 16)}`,
  );
}
