#!/usr/bin/env node
/**
 * Adaptation measurement: can the student compile a problem when the prompt
 * carries demonstrated plans?
 *
 * The holdout asks for a plan whose family the trainer never saw, and the
 * measured answer so far is that the student compiles nothing that executes. The
 * product thesis is a small model with context: a plan is not invented from
 * nothing, it is read, adapted, and compiled with the protocol in front of it.
 * This runner measures exactly that difference on the SAME statements and the
 * SAME checkpoint: `--demos 0` sends the statement alone (the recorded profile),
 * and `--demos N` puts N compiled examples of other problems in front of it,
 * drawn from the training rows so no demonstration is one of the targets.
 *
 * Every run lands in its own registry folder with per-item records, the
 * demonstration rule, and the executed answers, so the comparison between
 * `--demos 0` and `--demos N` is per item rather than anecdotal.
 *
 * Usage:
 *   node evaluation/run-adaptation.mjs --experiment adapt-holdout-0 --best --slice holdout --demos 0
 *   node evaluation/run-adaptation.mjs --experiment adapt-holdout-3 --best --slice holdout --demos 3
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildMessages, extractProgram, generate } from './client.mjs';
import { parseCircuit } from '../runtime/parser.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { answerMatches } from '../teacher/naming.mjs';
import { REPOSITORY_ROOT, resolveArtifactPath, withServer } from './server.mjs';
import { bestWinner } from './artifacts.mjs';
import { resolveSlice } from './run-eval.mjs';

const EXPORT = join(REPOSITORY_ROOT, 'training/data/all-books.jsonl');
const DATA_ROOT = join(REPOSITORY_ROOT, 'training-data');
const VALIDATION_SLICE = join(REPOSITORY_ROOT, 'training/data/validation-slice.json');

function parseArguments(argv) {
  const options = { experiment: null, slice: 'holdout', demos: 0, demoMode: 'distinct', dryRun: false, gguf: null, best: false, base: null, port: 8087, concurrency: 4, maxTokens: 2048, limit: null, threads: null, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = () => {
      const next = argv[index + 1];
      if (next === undefined) throw new Error(`${flag} needs a value`);
      index += 1;
      return next;
    };
    if (flag === '--experiment') options.experiment = value();
    else if (flag === '--slice') options.slice = value();
    else if (flag === '--demos') options.demos = Number(value());
    else if (flag === '--demo-mode') options.demoMode = value();
    else if (flag === '--dry-run') options.dryRun = true;
    else if (flag === '--gguf') options.gguf = value();
    else if (flag === '--best') options.best = true;
    else if (flag === '--base') options.base = value();
    else if (flag === '--port') options.port = Number(value());
    else if (flag === '--concurrency') options.concurrency = Number(value());
    else if (flag === '--max-tokens') options.maxTokens = Number(value());
    else if (flag === '--limit') options.limit = Number(value());
    else if (flag === '--threads') options.threads = Number(value());
    else if (flag === '--help' || flag === '-h') options.help = true;
    else throw new Error(`unknown argument: ${flag}`);
  }
  return options;
}

const USAGE = `Usage: node evaluation/run-adaptation.mjs --experiment <id> --demos <N> (--gguf <path> | --best) [--slice holdout|validation|file:<path>] [options]

Options:
  --demos N        demonstrated compiled examples placed in the prompt (0 = the recorded profile alone)
  --demo-mode M    distinct (default) or shapes: shapes prefers demonstrations whose plan has the same wire count as the target
  --dry-run        resolve the slice and the demonstrations of every item, write nothing, and exit
  --slice <spec>   holdout (default) | validation | file:<path>
  --limit N        score the first N items after sorting
  --concurrency N  items generated in parallel (default 4)
  --port N         port for the managed server (default 8087)
  --max-tokens N   generation budget (default 2048)
  --help           print this help
`;

/**
 * The demonstrations: training rows in export order, never a row of the target's
 * own family, so a demonstration teaches the protocol rather than the answer.
 *
 * `mode` chooses which training rows are eligible:
 *
 * - `distinct` (the recorded behaviour) takes the first rows of templates not
 *   seen yet, so every demonstration is a different problem type;
 * - `shapes` prefers rows whose plan declares the same number of wires as the
 *   target's own plan, so the demonstrations teach the shape the target needs
 *   (a two-stage plan shown a two-stage plan) rather than an unrelated one. The
 *   target's own book stays excluded either way.
 */
export function demonstrationRows(rows, { demos, targetBook, targetTemplate, mode = 'distinct', targetWires = null }) {
  if (demos <= 0) return [];
  const eligible = rows.filter(
    (row) => row.book !== targetBook && `${row.book}|${row.template}` !== `${targetBook}|${targetTemplate}`
  );
  const picked = [];
  if (mode === 'shapes' && targetWires !== null) {
    // First pass: same wire count, one per template; then the general rule fills
    // the rest, so a request for more demonstrations than the shape affords still
    // returns the requested number.
    for (const row of eligible) {
      if (picked.length === demos) break;
      const wires = wireCountOf(row.solution);
      if (wires !== targetWires) continue;
      if (picked.some((chosen) => chosen.template === row.template)) continue;
      picked.push(row);
    }
  }
  const seenTemplates = new Set(picked.map((row) => `${row.book}|${row.template}`));
  for (const row of eligible) {
    if (picked.length === demos) break;
    const template = `${row.book}|${row.template}`;
    if (seenTemplates.has(template)) continue;
    seenTemplates.add(template);
    picked.push(row);
  }
  if (picked.length < demos) throw new Error(`only ${picked.length} demonstrations available; the export is smaller than the request`);
  return picked;
}

/** The wire declarations of a program: what "the same shape" is measured on. */
function wireCountOf(solution) {
  return String(solution ?? '').split('\n').filter((line) => line.startsWith('@')).length;
}

/**
 * The reference solution of a sliced item. A slice item carries the identity,
 * the statement, and the oracle, not the program (an evaluation must not read
 * the answer's shape into its own prompt), so the shape-matched demonstration
 * rule reads it from the shipped tree by folder. A missing file is a dataset
 * defect rather than a scoring outcome, so it throws.
 */
function targetSolutionOf(item) {
  const path = join(DATA_ROOT, item.book, ...String(item.folder).split('/'), 'solution.sop');
  return readFileSync(path, 'utf8');
}

function composeStatement({ statement, demos }) {
  if (demos.length === 0) return statement;
  const blocks = demos.map((row, index) => `Example ${index + 1}.\nProblem: ${row.statement}\nPlan:\n${row.solution.trimEnd()}`);
  return `${blocks.join('\n\n')}\n\nNow compile this problem the same way.\nProblem: ${statement}`;
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(concurrency, items.length)) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  process.stdout.write(USAGE);
  process.exit(0);
}
if (options.experiment === null) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(2);
}

// The demonstrations come from the training rows: everything the export holds
// minus the D11 slice (which selection keeps for itself).
const allRows = readFileSync(EXPORT, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
const excluded = new Set(JSON.parse(readFileSync(VALIDATION_SLICE, 'utf8')).folders);
const trainingRows = allRows
  .filter((row) => !excluded.has(`${row.meta.book}/${row.meta.folder}`))
  .map((row) => ({ book: row.meta.book, template: row.meta.template, statement: row.messages[1].content, solution: row.messages[2].content }));

const resolved = resolveSlice({ slice: options.slice, limit: options.limit });
const registryDir = join(REPOSITORY_ROOT, 'evaluation/registry', options.experiment);

/**
 * `--dry-run` resolves the slice and the demonstrations of every item and
 * writes nothing: it is how the demonstration rule is inspected without a
 * served model (which shapes the prompts carry, and which problems stand as
 * examples), and it keeps the rule testable in the suite.
 */
if (options.dryRun) {
  const lines = resolved.items.map((item) => {
    const demos = demonstrationRows(trainingRows, {
      demos: options.demos,
      targetBook: item.book,
      targetTemplate: item.template,
      mode: options.demoMode,
      targetWires: wireCountOf(targetSolutionOf(item))
    });
    return `${item.book}/${item.folder}: ${demos.length} demo(s) [${demos.map((row) => `${row.book}/${row.template} (${wireCountOf(row.solution)} wires)`).join(', ')}]`;
  });
  process.stdout.write(`${lines.join('\n')}\n`);
  process.stdout.write(`${resolved.items.length} item(s), demos ${options.demos}, mode ${options.demoMode}\n`);
  process.exit(0);
}

mkdirSync(join(registryDir, 'items'), { recursive: true });

let artifact = null;
let artifactLabel = options.base ?? null;
if (options.gguf !== null) {
  artifact = resolveArtifactPath(options.gguf);
  artifactLabel = artifact.replace(`${REPOSITORY_ROOT}/`, '');
} else if (options.best) {
  const winner = bestWinner();
  if (winner === null) throw new Error('no measured winner found; pass --gguf');
  artifact = winner.gguf;
  artifactLabel = `${winner.gguf.replace(`${REPOSITORY_ROOT}/`, '')} (${winner.experiment} ${winner.winner})`;
} else if (options.base === null) {
  throw new Error('pass --gguf, --best, or --base');
}

const runtime = createRuntime();
const run = async (baseUrl) => mapWithConcurrency(resolved.items, options.concurrency, async (item) => {
  const demos = demonstrationRows(trainingRows, {
    demos: options.demos,
    targetBook: item.book,
    targetTemplate: item.template,
    mode: options.demoMode,
    targetWires: wireCountOf(targetSolutionOf(item))
  });
  const statement = composeStatement({ statement: item.statement, demos });
  const result = await generate({ base: baseUrl, model: 'student', messages: buildMessages(statement), temperature: 0, maxTokens: options.maxTokens, timeoutMs: 600_000 });
  const record = {
    item: `${item.book}/${item.folder}`,
    book: item.book,
    plan: item.plan,
    demonstrations: demos.length,
    demonstrationItems: demos.map((row) => `${row.book}/${row.template}`),
    oracle: item.oracle,
    class: 'generation_transport_error',
    answer: null,
    detail: result.error?.message ?? null,
    completion: result.completion,
    generated: { tokens: result.usage?.completion_tokens ?? null, promptTokens: result.usage?.prompt_tokens ?? null, attempts: result.attempts, latencyMs: result.latencyMs },
  };
  if (result.error !== null) {
    return record;
  }
  const extracted = extractProgram(result.completion);
  if (!extracted.ok) {
    return { ...record, class: 'wrapper_rejected', detail: extracted.reason };
  }
  let outcome;
  try {
    outcome = await runtime.run(parseCircuit(extracted.program), { outputs: ['answer'] });
  } catch (error) {
    outcome = { status: 'failed', code: 'parse_error', error: { message: error.message } };
  }
  if (outcome.status !== 'completed') {
    return { ...record, class: 'execution_error', detail: `${outcome.status}:${outcome.code ?? ''} ${outcome.error?.message ?? ''}`.trim() };
  }
  const answer = String(outcome.outputs.answer);
  return { ...record, class: answerMatches(item.oracle, answer) ? 'answer_match' : 'answer_mismatch', answer };
});

const records = options.base !== null
  ? await run(options.base)
  : (await withServer(
      { ggufPath: artifact, port: options.port, logPath: join(registryDir, 'server.log'), threads: options.threads },
      ({ port }) => run(`http://127.0.0.1:${port}`),
    ));

const count = (name) => records.filter((record) => record.class === name).length;
const rate = (name) => `${((count(name) / Math.max(1, records.length)) * 100).toFixed(1)}%`;
writeFileSync(join(registryDir, 'items', `${resolved.sliceName}.jsonl`), `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);
writeFileSync(
  join(registryDir, 'report.md'),
  [
    `# Adaptation run — ${options.experiment}`,
    '',
    `Artifact: \`${artifactLabel}\`. Slice: ${resolved.sliceName} (${records.length} items). Demonstrations in the prompt: **${options.demos}**.`,
    '',
    '| metric | rate | items |',
    '| --- | --- | --- |',
    `| answer_match | ${rate('answer_match')} | ${count('answer_match')} |`,
    `| answer_mismatch | ${rate('answer_mismatch')} | ${count('answer_mismatch')} |`,
    `| execution_error | ${rate('execution_error')} | ${count('execution_error')} |`,
    `| wrapper_rejected | ${rate('wrapper_rejected')} | ${count('wrapper_rejected')} |`,
    `| generation_transport_error | ${rate('generation_transport_error')} | ${count('generation_transport_error')} |`,
    '',
    options.demos === 0
      ? 'The prompt is the recorded compiled-plan profile alone: the same measurement `evaluation/run-slice.mjs` reports for a slice.'
      : `Each prompt carries ${options.demos} compiled examples drawn from the training rows in export order, never from the target's own book, so the demonstration teaches the protocol rather than the answer.`,
    '',
    'Per-item records: `items/' + resolved.sliceName + '.jsonl` (each record names the demonstrations it received).',
    '',
  ].join('\n'),
);
writeFileSync(
  join(registryDir, 'run-manifest.json'),
  `${JSON.stringify({ experiment: options.experiment, artifact: artifactLabel, slice: { name: resolved.sliceName, spec: options.slice, items: records.length }, demonstrations: options.demos, demonstrationRule: 'training rows in export order, never the target book, distinct templates', decoding: { temperature: 0, maxTokens: options.maxTokens, concurrency: options.concurrency, attemptsPerItem: 1, transportRetries: 1 }, startedAt: new Date().toISOString() }, null, 2)}\n`,
);

process.stdout.write(
  `${options.experiment}: ${records.length} items with ${options.demos} demonstration(s) — match ${rate('answer_match')}, mismatch ${rate('answer_mismatch')}, ` +
  `execution_error ${rate('execution_error')}, wrapper_rejected ${rate('wrapper_rejected')}\n`,
);
