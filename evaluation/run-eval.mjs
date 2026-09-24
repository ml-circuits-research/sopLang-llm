#!/usr/bin/env node
/**
 * Evaluation loop of the fine-tuning laboratory (training/PLAN.md T6; decision D9).
 *
 * The loop is split into a classification core (`classifyItem`), a slice runner
 * (`runSlice`), an aggregate builder (`aggregate`), and a markdown renderer
 * (`renderReport`), so every metric is unit-testable without a served model.
 * Slice resolution and its identity live in `evaluation/slices.mjs` and the
 * command-line surface in `evaluation/cli.mjs`, so this module stays inside the
 * DS001 module size rule. `main` wires the three to the HTTP client of
 * `evaluation/client.mjs`, resolves the two data views of the repository (the
 * export for the validation slice, the shipped `training-data/` trees for the
 * holdout), and writes the evidence registry with the per-item records first
 * and the aggregates after, because DS009 lets a report read only records that
 * already exist.
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
import { join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { appendItemLog, buildMessages, extractProgram, generate } from './client.mjs';
import { CHAT_PROFILE_ID, SYSTEM_PROMPT_SHA256 } from '../training/export.mjs';
import { parseCircuit } from '../runtime/parser.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { answerMatches } from '../teacher/naming.mjs';
import { renderProbesReport, scoreProbes, summaryOf } from './probes.mjs';
import { parseArgs, UsageError } from './cli.mjs';
import { aggregate, percent, reportSections } from './aggregate.mjs';

export { aggregate } from './aggregate.mjs';
import { resolveSlice, sliceIdentityOf } from './slices.mjs';

export { resolveSlice, sliceIdentityOf } from './slices.mjs';

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

/**
 * The registry report: the run identity, then the sections the aggregate module
 * renders (the four rates overall and per book and per plan cluster, the class
 * counts, the efficiency columns), and the artifact-consistency statement DS009
 * requires.
 */
export function renderReport({ manifest, metrics }) {
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
    ...reportSections(metrics),
    '## Artifact consistency',
    '',
    `No report may combine accuracy from one artifact with speed from another. Every number above — the four rates, the class counts, and the efficiency columns — comes from the same artifact (${checkpoint}, model ${manifest.model ?? 'not recorded'}), the same run manifest (\`run-manifest.json\`), and the same per-item records (\`items/${manifest.slice.name}.jsonl\`).`,
    ''
  ];
  return `${lines.join('\n')}`;
}

/** The usage text of the loop entry: flags are parsed by `evaluation/cli.mjs`. */
const USAGE = [
  "Usage: node evaluation/run-eval.mjs --experiment <id> --slice <holdout|validation|file:<path>> [options]",
  "",
  "  --gguf <path>        artifact label recorded in the run manifest and the report",
  "  --books a,b          limit a holdout run to these book ids",
  "  --limit N            score only the first N resolved items",
  "  --base <url>         llama-server base URL (default http://127.0.0.1:8080)",
  "  --model <alias>      model alias served by that base",
  "  --max-tokens N       generation budget per item (default 2048)",
  "  --concurrency N      parallel items (default 1)",
  "  --out <dir>          registry root (default evaluation/registry)",
  "  --log                also append the raw requests to run-log.jsonl",
  "  --probes             score the capability probes on the same served artifact",
].join("\n");

export async function main(argv) {
  const options = parseArgs(argv, { base: DEFAULT_BASE, maxTokens: DEFAULT_MAX_TOKENS, out: DEFAULT_REGISTRY });
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
    // Which base the trained checkpoint was fine-tuned from, copied from the
    // trainer's own manifest, so the chat (winner05/winner15) can tell the 0.5B
    // arms from the 1.5B arms without guessing from the experiment name.
    base_model_manifest: (() => {
      const trainerManifestPath = join(REPO_ROOT, 'training/checkpoints', options.experiment, 'run-manifest.json');
      if (!existsSync(trainerManifestPath)) return null;
      try {
        const trainerManifest = JSON.parse(readFileSync(trainerManifestPath, 'utf8'));
        const pinned = trainerManifest.base_model_manifest ?? null;
        return pinned === null || typeof pinned.path !== 'string' ? null : { path: pinned.path };
      } catch {
        return null;
      }
    })(),
    training: (() => {
      const trainerManifestPath = join(REPO_ROOT, 'training/checkpoints', options.experiment, 'run-manifest.json');
      if (!existsSync(trainerManifestPath)) return null;
      try {
        const trainerManifest = JSON.parse(readFileSync(trainerManifestPath, 'utf8'));
        return {
          createdUtc: trainerManifest.created_utc ?? null,
          finishedUtc: trainerManifest.finished_utc ?? null,
          epochs: trainerManifest.epochs ?? null
        };
      } catch {
        return null;
      }
    })(),
    capabilityProbes: capabilityProbes === null
      ? null
      : { profile: capabilityProbes.profile, systemPromptSha256: capabilityProbes.systemPromptSha256, items: capabilityProbes.items, passed: capabilityProbes.passed },
    dataset: {
      exportManifest: relative(REPO_ROOT, EXPORT_MANIFEST).split(sep).join('/'),
      snapshot: exportManifest?.snapshot ?? null,
      dataVersion: (() => {
        const path = join(REPO_ROOT, 'training-data', 'VERSION');
        if (!existsSync(path)) return null;
        try {
          const number = readFileSync(path, 'utf8').trim();
          const labelPath = join(REPO_ROOT, 'training-data', 'VERSION.label');
          const label = existsSync(labelPath) ? readFileSync(labelPath, 'utf8').trim() : null;
          return { number, label };
        } catch {
          return null;
        }
      })(),
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
