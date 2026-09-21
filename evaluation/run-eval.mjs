#!/usr/bin/env node
/**
 * Evaluation loop of the fine-tuning laboratory (training/PLAN.md T6; decision D9).
 *
 * The loop is split into a classification core (`classifyItem`), a slice runner
 * (`runSlice`), an aggregate builder (`aggregate`), and a markdown renderer
 * (`renderReport`), so every metric is unit-testable without a served model.
 * The command line wires those to the HTTP client of `evaluation/client.mjs`,
 * resolves the two data views of the repository (the export for the validation
 * slice, the shipped `training-data/` trees for the holdout), and writes the
 * evidence registry with the per-item records first and the aggregates after,
 * because DS009 lets a report read only records that already exist.
 *
 * Every item lands in exactly one class:
 *
 * - generation_transport_error  the client returned no completion (after its one retry)
 * - wrapper_rejected            the D10 post-processor rejected the text
 * - parse_invalid               the runtime parser rejected the program
 * - graph_invalid               the graph cannot be resolved: unknown output, unknown
 *                               dependency, unresolved dependency, duplicate wire, cycle
 * - execution_error             the circuit failed for any other reason
 * - answer_mismatch             the executed answer differs from the manifest oracle
 * - answer_match                the executed answer equals the manifest oracle
 *
 * The four rates are reported separately, per DS009: a model may emit beautiful
 * syntax with wrong semantics, and no single micro-score may hide that. Rates are
 * reported overall and per book and per plan cluster (macro tables); accuracy and
 * speed always come from the same artifact.
 */

import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { appendItemLog, buildMessages, extractProgram, generate } from './client.mjs';
import { CHAT_PROFILE_ID, SYSTEM_PROMPT_SHA256 } from '../training/export.mjs';
import { parseCircuit } from '../runtime/parser.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { answerMatches } from '../teacher/naming.mjs';
import { renderProbesReport, scoreProbes, summaryOf } from './probes.mjs';
import { bookRoots, expectedAnswersOf, solutionFilesOf, statementBodyOf } from '../training-data/dataset-manifest.mjs';

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));

/** The seven outcome classes of D9, in ladder order. */
export const CLASSES = [
  'generation_transport_error',
  'wrapper_rejected',
  'parse_invalid',
  'graph_invalid',
  'execution_error',
  'answer_mismatch',
  'answer_match'
];

/** Runtime codes that mean an unresolvable graph rather than a failing executor. */
const GRAPH_CODES = new Set([
  'unresolved_dependencies',
  'unknown_output',
  'unknown_dependency',
  'cycle_detected',
  'duplicate_wire'
]);

const PARSE_EXCLUDED = new Set(['generation_transport_error', 'wrapper_rejected', 'parse_invalid']);
const GRAPH_EXCLUDED = new Set([...PARSE_EXCLUDED, 'graph_invalid']);
const RUNTIME_EXCLUDED = new Set([...GRAPH_EXCLUDED, 'execution_error']);

/** The four reported rates: the class sets each one excludes, and its label. */
const RATE_METRICS = [
  { key: 'parse_validity', label: 'parse validity', excluded: PARSE_EXCLUDED },
  { key: 'graph_validity', label: 'graph validity', excluded: GRAPH_EXCLUDED },
  { key: 'runtime_completion', label: 'runtime completion', excluded: RUNTIME_EXCLUDED },
  { key: 'oracle_match', label: 'oracle match', excluded: null }
];

const DEFAULT_BASE = 'http://127.0.0.1:8080';
const DEFAULT_MAX_TOKENS = 2048;
const DEFAULT_TIMEOUT_MS = 600000;
const DEFAULT_REGISTRY = 'evaluation/registry';
const DEFAULT_DATA_ROOT = join(REPO_ROOT, 'training-data');
const DEFAULT_EXPORT = join(REPO_ROOT, 'training', 'data', 'all-books.jsonl');
const DEFAULT_VALIDATION_SLICE = join(REPO_ROOT, 'training', 'data', 'validation-slice.json');
const EXPORT_MANIFEST = join(REPO_ROOT, 'training', 'data', 'export-manifest.json');
const ENVIRONMENT_MANIFEST = join(REPO_ROOT, 'training', 'environment', 'environment-manifest.json');

function messageOf(failure) {
  return failure instanceof Error ? failure.message : String(failure);
}

/** `code: message` when both exist, the code or the message alone otherwise. */
function detailOf(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  const code = value.code ?? null;
  const message = value.message ?? null;
  if (code !== null && message !== null) return `${code}: ${message}`;
  return code ?? message ?? String(value);
}

function sha256OfText(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

function sha256OfFile(filePath) {
  return sha256OfText(readFileSync(filePath, 'utf8'));
}

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/**
 * The D9 ladder for one generated completion.
 *
 * `error` is the transport error the client reported alongside a missing
 * completion; it only sharpens the detail of the first class. The function
 * never throws: a runtime that fails, rejects, or returns an unexpected shape
 * is an outcome of the item, not of the batch.
 *
 * Returns `{ className, detail, answer }`; `answer` is the executed answer when
 * the circuit completed and `null` otherwise.
 */
export async function classifyItem({ completion, oracle, runtime, error = null }) {
  const text = typeof completion === 'string' ? completion : null;
  if (text === null || text.trim() === '') {
    return {
      className: 'generation_transport_error',
      detail: error !== null && error !== undefined && error.message ? error.message : 'empty completion',
      answer: null
    };
  }

  const extracted = extractProgram(text);
  if (!extracted.ok) {
    return { className: 'wrapper_rejected', detail: extracted.reason, answer: null };
  }

  try {
    parseCircuit(extracted.program, { sourceName: 'completion' });
  } catch (failure) {
    return { className: 'parse_invalid', detail: detailOf(failure), answer: null };
  }

  let result;
  try {
    result = await runtime.run(extracted.program, { outputs: ['answer'] });
  } catch (failure) {
    return { className: 'execution_error', detail: `runtime threw: ${messageOf(failure)}`, answer: null };
  }

  if (result?.status !== 'completed') {
    const code = result?.error?.code ?? result?.code ?? null;
    const detail = detailOf(result?.error ?? code);
    const graph = (result?.status === 'failed' || result?.status === 'partial') && GRAPH_CODES.has(code);
    return { className: graph ? 'graph_invalid' : 'execution_error', detail, answer: null };
  }

  const value = result.outputs?.answer;
  if (value === undefined) {
    return { className: 'execution_error', detail: 'completed without an answer output', answer: null };
  }
  const answer = String(value);
  if (!answerMatches(oracle, answer)) {
    return { className: 'answer_mismatch', detail: null, answer };
  }
  return { className: 'answer_match', detail: null, answer };
}

/**
 * Runs items through the model and writes the per-item records.
 *
 * Each item is `{ id, book, folder, plan, unit, template, category, statement,
 * oracle }`; `generateItem(messages)` is the generation step (the CLI injects
 * the client, the tests inject a stub) and returns the client result shape.
 * One failing item never aborts the batch: a throwing generator is recorded as
 * a transport error and a throwing classifier as an execution error.
 *
 * The records are written to `<outDir>/items/<sliceName>.jsonl`, one JSON
 * object per line, sorted by item id, and returned. Every record carries every
 * field of the schema, with `null` where the run learned nothing.
 */
export async function runSlice({
  items,
  generateItem,
  runtime,
  outDir = null,
  experimentId = null,
  sliceName,
  concurrency = 1,
  logPath = null
}) {
  const directory = outDir ?? join(DEFAULT_REGISTRY, experimentId ?? 'experiment');
  const workers = Math.max(1, Math.min(concurrency, items.length));

  const classifyOne = async (item) => {
    let generated;
    try {
      generated = await generateItem(buildMessages(item.statement));
    } catch (failure) {
      generated = { completion: null, error: { kind: 'transport', message: messageOf(failure) } };
    }
    const completion = typeof generated?.completion === 'string' ? generated.completion : null;
    const usage = generated?.usage ?? null;

    let verdict;
    try {
      verdict = await classifyItem({ completion, oracle: item.oracle, runtime, error: generated?.error ?? null });
    } catch (failure) {
      verdict = { className: 'execution_error', detail: `classification threw: ${messageOf(failure)}`, answer: null };
    }

    return {
      item: item.id,
      book: item.book ?? null,
      folder: item.folder ?? null,
      plan: item.plan ?? null,
      unit: item.unit ?? null,
      template: item.template ?? null,
      category: item.category ?? null,
      class: verdict.className,
      detail: verdict.detail ?? null,
      oracle: item.oracle ?? null,
      answer: verdict.answer ?? null,
      generated: {
        tokens: usage?.completion_tokens ?? null,
        promptTokens: usage?.prompt_tokens ?? null,
        attempts: generated?.attempts ?? null,
        latencyMs: generated?.latencyMs ?? null,
        completionSha256: completion === null ? null : sha256OfText(completion)
      },
      completion
    };
  };

  const records = new Array(items.length);
  let next = 0;
  const drain = async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      const record = await classifyOne(items[index]);
      records[index] = record;
      if (logPath !== null) appendItemLog(logPath, record);
    }
  };
  await Promise.all(Array.from({ length: workers }, drain));

  records.sort((left, right) => (left.item < right.item ? -1 : left.item > right.item ? 1 : 0));
  mkdirSync(join(directory, 'items'), { recursive: true });
  const path = join(directory, 'items', `${sliceName}.jsonl`);
  const body = records.map((record) => JSON.stringify(record)).join('\n');
  writeFileSync(path, records.length === 0 ? '' : `${body}\n`);
  return { records, path };
}

/** Class counts for one group, with every D9 class present even at zero. */
function counted(records) {
  const classes = Object.fromEntries(CLASSES.map((className) => [className, 0]));
  for (const record of records) {
    if (Object.hasOwn(classes, record.class)) classes[record.class] += 1;
  }
  return classes;
}

/**
 * The four rates of one group, each as the fraction of items that survived its
 * stage, or `null` for an empty group (a rate over no items is not a number).
 */
function ratesOf(records) {
  if (records.length === 0) {
    return { parse_validity: null, graph_validity: null, runtime_completion: null, oracle_match: null };
  }
  const survived = (excluded) =>
    records.filter((record) => (excluded === null ? record.class === 'answer_match' : !excluded.has(record.class))).length;
  return Object.fromEntries(
    RATE_METRICS.map((metric) => [metric.key, round(survived(metric.excluded) / records.length, 6)])
  );
}

function groupTable(records, keyOf) {
  const groups = new Map();
  for (const record of records) {
    const raw = keyOf(record);
    const key = raw === null || raw === undefined || raw === '' ? 'unknown' : String(raw);
    const list = groups.get(key) ?? [];
    list.push(record);
    groups.set(key, list);
  }
  const table = [...groups.keys()].sort().map((key) => {
    const list = groups.get(key);
    return [key, { items: list.length, classes: counted(list), rates: ratesOf(list) }];
  });
  return Object.fromEntries(table);
}

function sumOf(records, pick) {
  let total = 0;
  for (const record of records) {
    const value = pick(record);
    if (typeof value === 'number' && Number.isFinite(value)) total += value;
  }
  return total;
}

/**
 * The aggregate of a per-item record set: class counts, the four rates, the two
 * macro tables (by book and by plan cluster), and the efficiency block. The
 * four rates are never collapsed into one score, and the efficiency block keeps
 * the raw components visible so a reader can reweight them.
 */
export function aggregate(records) {
  const items = records.length;
  const classes = counted(records);
  const generatedTokens = sumOf(records, (record) => record.generated?.tokens);
  const wallClockMs = sumOf(records, (record) => record.generated?.latencyMs);
  const matches = classes.answer_match;
  return {
    items,
    classes,
    rates: ratesOf(records),
    byBook: groupTable(records, (record) => record.book),
    byPlanCluster: groupTable(records, (record) => record.plan),
    efficiency: {
      generatedTokens,
      promptTokens: sumOf(records, (record) => record.generated?.promptTokens),
      calls: sumOf(records, (record) => record.generated?.attempts),
      wallClockMs,
      tokensPerSecond: wallClockMs > 0 ? round(generatedTokens / (wallClockMs / 1000), 2) : null,
      costPerCorrect: matches > 0 ? round(generatedTokens / matches, 2) : null
    }
  };
}

function percent(rate) {
  return rate === null || rate === undefined ? 'n/a' : `${(rate * 100).toFixed(1)}%`;
}

function numeratorOf(classes, items, excluded) {
  if (excluded === null) return classes.answer_match ?? 0;
  return items - CLASSES.filter((className) => excluded.has(className)).reduce((total, name) => total + (classes[name] ?? 0), 0);
}

function ratesTable(classes, items) {
  const lines = ['| metric | numerator | items | rate |', '| --- | --- | --- | --- |'];
  for (const metric of RATE_METRICS) {
    const numerator = numeratorOf(classes, items, metric.excluded);
    const rate = items === 0 ? null : round(numerator / items, 6);
    lines.push(`| ${metric.label} | ${numerator} | ${items} | ${percent(rate)} |`);
  }
  return lines;
}

function groupRatesTable(title, group) {
  const lines = [`## ${title}`, '', '| key | items | parse validity | graph validity | runtime completion | oracle match |', '| --- | --- | --- | --- | --- | --- |'];
  const keys = Object.keys(group);
  for (const key of keys) {
    const entry = group[key];
    const cells = RATE_METRICS.map((metric) => percent(entry.rates[metric.key]));
    lines.push(`| ${key} | ${entry.items} | ${cells.join(' | ')} |`);
  }
  if (keys.length === 0) lines.push('| (none) | 0 | n/a | n/a | n/a | n/a |');
  lines.push('');
  return lines;
}

function groupClassesTable(title, group) {
  const lines = [
    `## ${title}`,
    '',
    `| key | ${CLASSES.join(' | ')} |`,
    `| --- | ${CLASSES.map(() => '---').join(' | ')} |`
  ];
  const keys = Object.keys(group);
  for (const key of keys) {
    lines.push(`| ${key} | ${CLASSES.map((className) => group[key].classes[className] ?? 0).join(' | ')} |`);
  }
  if (keys.length === 0) lines.push(`| (none) | ${CLASSES.map(() => 0).join(' | ')} |`);
  lines.push('');
  return lines;
}

/**
 * The registry report: the run identity, the four rates overall and per book
 * and per plan cluster, the class counts, the efficiency columns, and the
 * artifact-consistency statement DS009 requires.
 */
export function renderReport({ manifest, metrics }) {
  const efficiency = metrics.efficiency;
  const checkpoint = manifest.checkpoint?.gguf ?? 'not recorded';
  const lines = [
    `# Evaluation report — ${manifest.experiment} / ${manifest.slice.name}`,
    '',
    '| field | value |',
    '| --- | --- |',
    `| experiment | ${manifest.experiment} |`,
    `| slice | ${manifest.slice.name} (${manifest.slice.source}) |`,
    `| items | ${metrics.items} |`,
    `| checkpoint (GGUF) | ${checkpoint} |`,
    `| model | ${manifest.model ?? 'not recorded'} |`,
    `| base url | ${manifest.base} |`,
    `| chat profile | ${manifest.chatProfile.id} |`,
    `| system prompt sha256 | ${manifest.chatProfile.systemPromptSha256} |`,
    `| dataset snapshot (trainer export at scoring time) | ${manifest.dataset.snapshot ?? 'not recorded'} |`,
    `| slice items sha256 | ${manifest.slice.itemsSha256 ?? 'not recorded'} |`,
    `| started at | ${manifest.startedAt} |`,
    `| decoding | temperature ${manifest.decoding.temperature}, max_tokens ${manifest.decoding.maxTokens}, concurrency ${manifest.decoding.concurrency}; one generation attempt per item plus the client's single transport retry |`,
    '',
    '## Overall rates',
    '',
    ...ratesTable(metrics.classes, metrics.items),
    '',
    '## Outcome classes',
    '',
    '| class | items |',
    '| --- | --- |',
    ...CLASSES.map((className) => `| ${className} | ${metrics.classes[className] ?? 0} |`),
    '',
    ...groupRatesTable('Rates by book', metrics.byBook),
    ...groupClassesTable('Classes by book', metrics.byBook),
    ...groupRatesTable('Rates by plan cluster', metrics.byPlanCluster),
    '## Efficiency',
    '',
    '| metric | value |',
    '| --- | --- |',
    `| generated tokens | ${efficiency.generatedTokens} |`,
    `| prompt tokens | ${efficiency.promptTokens} |`,
    `| neural calls (generation attempts) | ${efficiency.calls} |`,
    `| wall clock (summed per-item generation latency) | ${(efficiency.wallClockMs / 1000).toFixed(1)} s |`,
    `| generated tokens per second | ${efficiency.tokensPerSecond ?? 'n/a'} |`,
    `| cost per correct (generated tokens per answer_match) | ${efficiency.costPerCorrect ?? 'n/a (no correct answer)'} |`,
    '',
    '## Artifact consistency',
    '',
    `No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (${checkpoint}, model ${manifest.model ?? 'not recorded'}), the same run manifest (\`run-manifest.json\`), and the same per-item records (\`items/${manifest.slice.name}.jsonl\`).`,
    ''
  ];
  return `${lines.join('\n')}`;
}

function sliceNameOf(slice) {
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
 * - `holdout`    the 225 `eval/` examples of `training-data/<book>`, with the
 *                statement from `problem.md` and the oracle from the manifest
 * - `validation` the export rows whose `<book>/<folder>` id is listed in
 *                `validation-slice.json`
 * - `file:<path>` a JSONL file in export row shape (the same rows the export
 *                writes), for a pinned subset or the baseline sample of T4
 *
 * Items whose folder has no manifest row are a dataset defect, not an item
 * outcome, so resolution fails loudly instead of scoring without an oracle.
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
        const folder = relative(root, dirname(file)).split(sep).join('/');
        if (!folder.startsWith('eval/')) continue;
        const expected = oracles.get(folder);
        if (expected === undefined) throw new Error(`holdout: no manifest row for ${book}/${folder}`);
        items.push(
          itemOf({
            book,
            folder,
            plan: expected.plan,
            category: categoryOf(folder),
            statement: statementBodyOf(readFileSync(join(dirname(file), 'problem.md'), 'utf8')),
            oracle: expected.answer
          })
        );
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

/**
 * The identity of a resolved slice: one SHA-256 over the items the run scores.
 *
 * The score of an evaluation is a statement about a concrete set of prompts and
 * expected answers, so a manifest that names only the trainer view can name a
 * dataset no scored item came from: the export under `training/data/` is a file
 * that any later regeneration rewrites. This hash covers the scored set itself
 * (book, folder, plan, expected answer, statement), so a report can be checked
 * against the tree it measured. `exp-007-sft-wires` is the run that exposed the
 * gap: its report named the 7575-row export that was regenerated while the
 * holdout was running, not the 7335-row export its checkpoint was trained on.
 */
export function sliceIdentityOf(items) {
  const lines = items.map((item) =>
    [item.book, item.folder, item.plan, item.oracle, item.statement].join('\u0000')
  );
  // The scored set is a set: the identity is computed over sorted lines, so a
  // resolver that changes its ordering does not change the identity of a slice,
  // while adding, dropping, or altering an item does.
  return sha256OfText(lines.slice().sort().join('\n'));
}

class UsageError extends Error {}

function positiveInt(text, flag) {
  const value = Number(text);
  if (!Number.isInteger(value) || value < 1) throw new UsageError(`${flag} needs a positive integer, got "${text}"`);
  return value;
}

function parseArgs(argv) {
  const options = {
    experiment: null,
    slice: null,
    gguf: null,
    books: null,
    limit: null,
    base: DEFAULT_BASE,
    model: null,
    maxTokens: DEFAULT_MAX_TOKENS,
    concurrency: 1,
    out: DEFAULT_REGISTRY,
    log: false,
    probes: false,
    help: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = () => {
      const next = argv[index + 1];
      if (next === undefined) throw new UsageError(`${flag} needs a value`);
      index += 1;
      return next;
    };
    switch (flag) {
      case '--experiment':
        options.experiment = value();
        break;
      case '--slice': {
        const spec = value();
        if (spec !== 'holdout' && spec !== 'validation' && !(spec.startsWith('file:') && spec.length > 'file:'.length)) {
          throw new UsageError(`--slice must be holdout, validation, or file:<path>, got "${spec}"`);
        }
        options.slice = spec;
        break;
      }
      case '--gguf':
        options.gguf = value();
        break;
      case '--books': {
        const list = value().split(',').map((book) => book.trim()).filter((book) => book !== '');
        options.books = list.length > 0 ? list : null;
        break;
      }
      case '--limit':
        options.limit = positiveInt(value(), flag);
        break;
      case '--base':
        options.base = value();
        break;
      case '--model':
        options.model = value();
        break;
      case '--max-tokens':
        options.maxTokens = positiveInt(value(), flag);
        break;
      case '--concurrency':
        options.concurrency = positiveInt(value(), flag);
        break;
      case '--out':
        options.out = value();
        break;
      case '--log':
        options.log = true;
        break;
      case '--probes':
        options.probes = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        throw new UsageError(`unknown argument "${flag}"`);
    }
  }
  return options;
}

const USAGE = `Usage: node evaluation/run-eval.mjs --experiment <id> --slice <holdout|validation|file:<path>> [options]

Runs the D9 evaluation loop over one slice of the dataset and writes the
evidence registry under <out>/<experiment>/: items/<slice>.jsonl (per-item
records, written first), metrics.json, report.md, and run-manifest.json.

Arguments:
  --experiment <id>     experiment id; it names the registry folder (required)
  --slice <spec>        holdout             the 225 training-data/<book>/eval/ examples
                        validation          the 339 export rows of validation-slice.json
                        file:<path>         a JSONL file in export row shape (messages + meta)
  --books a,b           restrict the slice to those books (default: every book)
  --limit N             keep the first N items after sorting by item id
  --base <url>          llama-server base url (default ${DEFAULT_BASE})
  --model <name>        model name recorded in the manifest; llama-server ignores it
                        when a single model is served (default: not sent)
  --max-tokens N        max_tokens of every request (default ${DEFAULT_MAX_TOKENS}; D9 ceiling)
  --concurrency N       items generated in parallel (default 1, one request at a time)
  --gguf <path>         checkpoint artifact the run scores, recorded in the manifest
  --out <dir>           registry root (default ${DEFAULT_REGISTRY})
  --log                 also append every per-item record to <experiment>/run-log.jsonl
  --probes              also score the capability-probe suite on the same served
                        artifact: items/capability-probes.jsonl, probes.md, and a
                        capabilityProbes block in metrics.json (DS009, the loss
                        detector the preservation decision reads)
  --help, -h            print this help and exit

Decoding is greedy (temperature 0) with one attempt per item, per D9: the only
retry is the client's single retry on a transport failure. The four reported
rates are never combined into one score.`;

async function main(argv) {
  const options = parseArgs(argv);
  if (options.help) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }
  if (options.experiment === null) throw new UsageError('--experiment <id> is required');
  if (options.slice === null) throw new UsageError('--slice <holdout|validation|file:<path>> is required');

  const resolved = resolveSlice({ slice: options.slice, books: options.books, limit: options.limit });
  const experimentDirectory = join(options.out, options.experiment);
  const startedAt = new Date().toISOString();
  const runtime = createRuntime();
  const generateItem = (messages) =>
    generate({
      base: options.base,
      model: options.model ?? undefined,
      messages,
      temperature: 0,
      maxTokens: options.maxTokens,
      timeoutMs: DEFAULT_TIMEOUT_MS
    });

  const { records } = await runSlice({
    items: resolved.items,
    generateItem,
    runtime,
    outDir: experimentDirectory,
    experimentId: options.experiment,
    sliceName: resolved.sliceName,
    concurrency: options.concurrency,
    logPath: options.log ? join(experimentDirectory, 'run-log.jsonl') : null
  });
  const metrics = aggregate(records);

  // Capability probes (DS009 "Capability preservation"): the same served
  // artifact answers the JavaScript and instruction microtasks the untuned base
  // was scored with, so a substrate loss is measured rather than noticed late.
  let capabilityProbes = null;
  if (options.probes) {
    const scored = await scoreProbes({
      base: options.base,
      model: options.model ?? undefined,
      concurrency: options.concurrency,
      timeoutMs: DEFAULT_TIMEOUT_MS
    });
    writeFileSync(
      join(experimentDirectory, 'items/capability-probes.jsonl'),
      `${scored.records.map((record) => JSON.stringify(record)).join('\n')}\n`
    );
    writeFileSync(
      join(experimentDirectory, 'probes.md'),
      renderProbesReport({
        experiment: options.experiment,
        artifact: options.gguf,
        profile: scored.profile,
        records: scored.records
      })
    );
    const summary = summaryOf(scored.records);
    capabilityProbes = {
      profile: scored.profile,
      systemPromptSha256: scored.systemPromptSha256,
      items: summary.items,
      passed: summary.passed,
      byKind: summary.byKind
    };
    if (options.log) {
      appendFileSync(join(experimentDirectory, 'run-log.jsonl'), `${scored.records.map((record) => JSON.stringify(record)).join('\n')}\n`);
    }
  }

  const exportManifest = existsSync(EXPORT_MANIFEST) ? JSON.parse(readFileSync(EXPORT_MANIFEST, 'utf8')) : null;
  const manifest = {
    experiment: options.experiment,
    slice: { name: resolved.sliceName, spec: options.slice, source: resolved.source, count: records.length, books: options.books, limit: options.limit, itemsSha256: sliceIdentityOf(resolved.items) },
    checkpoint: { gguf: options.gguf },
    model: options.model,
    base: options.base,
    decoding: {
      temperature: 0,
      maxTokens: options.maxTokens,
      stream: false,
      timeoutMs: DEFAULT_TIMEOUT_MS,
      concurrency: options.concurrency,
      attemptsPerItem: 1,
      transportRetries: 1
    },
    chatProfile: { id: CHAT_PROFILE_ID, systemPromptSha256: SYSTEM_PROMPT_SHA256 },
    capabilityProbes: capabilityProbes === null
      ? null
      : { profile: capabilityProbes.profile, systemPromptSha256: capabilityProbes.systemPromptSha256, items: capabilityProbes.items, passed: capabilityProbes.passed },
    dataset: {
      exportManifest: relative(REPO_ROOT, EXPORT_MANIFEST).split(sep).join('/'),
      snapshot: exportManifest?.snapshot ?? null,
      validationSlice: relative(REPO_ROOT, DEFAULT_VALIDATION_SLICE).split(sep).join('/')
    },
    environment: existsSync(ENVIRONMENT_MANIFEST)
      ? {
          manifest: relative(REPO_ROOT, ENVIRONMENT_MANIFEST).split(sep).join('/'),
          sha256: sha256OfFile(ENVIRONMENT_MANIFEST)
        }
      : null,
    startedAt
  };

  mkdirSync(experimentDirectory, { recursive: true });
  writeFileSync(
    join(experimentDirectory, 'metrics.json'),
    `${JSON.stringify(capabilityProbes === null ? metrics : { ...metrics, capabilityProbes }, null, 2)}\n`
  );
  writeFileSync(join(experimentDirectory, 'run-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(experimentDirectory, 'report.md'), renderReport({ manifest, metrics }));

  const rates = metrics.rates;
  process.stdout.write(
    [
      `${options.experiment} / ${resolved.sliceName}: ${metrics.items} items`,
      `parse validity ${percent(rates.parse_validity)}, graph validity ${percent(rates.graph_validity)}, runtime completion ${percent(rates.runtime_completion)}, oracle match ${percent(rates.oracle_match)}`,
      ...(capabilityProbes === null ? [] : [`capability probes ${capabilityProbes.passed}/${capabilityProbes.items} (${capabilityProbes.profile})`]),
      `wrote ${experimentDirectory}/{items/${resolved.sliceName}.jsonl,metrics.json,report.md,run-manifest.json${capabilityProbes === null ? '' : ',items/capability-probes.jsonl,probes.md'}}`,
      ''
    ].join('\n')
  );
}

if (process.argv[1] !== undefined && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    await main(process.argv.slice(2));
  } catch (failure) {
    process.stderr.write(`run-eval: ${messageOf(failure)}\n`);
    process.exitCode = failure instanceof UsageError ? 2 : 1;
  }
}
