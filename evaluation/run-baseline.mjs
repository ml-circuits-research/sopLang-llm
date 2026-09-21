#!/usr/bin/env node
/**
 * Untuned-base baseline (training/PLAN.md T4; DS009 "The first training target").
 *
 * Scores the served base model before any fine-tuning on three surfaces, all
 * from the same checkpoint artifact:
 *
 * - direct-answer mode: a pinned sample of the evaluation holdout answered
 *   with prose, the comparison the first training run must beat;
 * - compiled-plan mode: the same sample through the full evaluation loop
 *   (generate, post-process, parse, execute, compare), so the zero-shot SOP
 *   Lang behavior is measured by the same classes as every later checkpoint;
 * - capability probes: JavaScript semantics and instruction-following
 *   microtasks, the loss detectors DS009 requires before the first run, so a
 *   collapse of the substrate is measured rather than noticed late.
 *
 * Everything is written under `evaluation/registry/<experiment>/`: per-item
 * records first, then the aggregate metrics, the report, and the run manifest.
 *
 * Usage:
 *   node evaluation/run-baseline.mjs [--experiment exp-000-baseline] [--base http://127.0.0.1:8080] [--model base] [--sample 50] [--seed 20260918] [--concurrency 4]
 */

import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRuntime } from '../runtime/kernel.mjs';
import { answerMatches, normalizeAnswer } from '../teacher/naming.mjs';
import { seededRandom, SYSTEM_PROMPT, SYSTEM_PROMPT_SHA256, CHAT_PROFILE_ID } from '../training/export.mjs';
import { generate } from './client.mjs';
import { aggregate, resolveSlice, runSlice } from './run-eval.mjs';

const REPOSITORY_ROOT = fileURLToPath(new URL('..', import.meta.url));
const DEFAULT_REGISTRY = join(REPOSITORY_ROOT, 'evaluation/registry');
const PROBES_PATH = join(REPOSITORY_ROOT, 'evaluation/probes/capability-probes.json');
const DIRECT_SYSTEM_PROMPT = 'Answer the problem directly with the final answer only.';

function parseArguments(argv) {
  const options = {
    experiment: 'exp-000-baseline',
    base: 'http://127.0.0.1:8080',
    model: 'base',
    sample: 50,
    seed: 20260918,
    maxTokens: 2048,
    concurrency: 4,
    out: DEFAULT_REGISTRY,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--experiment') { options.experiment = argv[index + 1]; index += 1; }
    else if (argument === '--base') { options.base = argv[index + 1]; index += 1; }
    else if (argument === '--model') { options.model = argv[index + 1]; index += 1; }
    else if (argument === '--sample') { options.sample = Number(argv[index + 1]); index += 1; }
    else if (argument === '--seed') { options.seed = Number(argv[index + 1]); index += 1; }
    else if (argument === '--max-tokens') { options.maxTokens = Number(argv[index + 1]); index += 1; }
    else if (argument === '--concurrency') { options.concurrency = Number(argv[index + 1]); index += 1; }
    else if (argument === '--out') { options.out = argv[index + 1]; index += 1; }
    else throw new Error(`unknown argument: ${argument}`);
  }
  return options;
}

/** A seeded sample of the holdout items, sorted by id, so both modes see the same problems. */
function sampleOf(items, { size, seed }) {
  const pool = [...items];
  const random = seededRandom(seed);
  for (let position = pool.length - 1; position > 0; position -= 1) {
    const swap = Math.floor(random() * (position + 1));
    [pool[position], pool[swap]] = [pool[swap], pool[position]];
  }
  return pool.slice(0, Math.min(size, pool.length)).sort((left, right) => (left.id < right.id ? -1 : 1));
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const records = new Array(items.length);
  let next = 0;
  const drain = async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      records[index] = await mapper(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, items.length)) }, drain));
  return records;
}

/** Direct-answer mode: prose completions compared with the oracle through the verifier's normalization. */
async function runDirect({ items, options, logPath }) {
  return mapWithConcurrency(items, options.concurrency, async (item) => {
    const result = await generate({
      base: options.base,
      model: options.model,
      messages: [
        { role: 'system', content: DIRECT_SYSTEM_PROMPT },
        { role: 'user', content: item.statement },
      ],
      temperature: 0,
      maxTokens: options.maxTokens,
    });
    const completion = result.completion;
    let className = 'generation_transport_error';
    let detail = result.error?.message ?? null;
    if (completion !== null && completion.trim() !== '') {
      className = answerMatches(item.oracle, completion) ? 'answer_match' : 'answer_mismatch';
      detail = null;
    }
    const record = {
      item: item.id,
      book: item.book,
      folder: item.folder,
      plan: item.plan,
      category: item.category,
      class: className,
      detail,
      oracle: item.oracle,
      answer: className === 'answer_mismatch' ? normalizeAnswer(completion) : className === 'answer_match' ? String(item.oracle) : null,
      generated: {
        tokens: result.usage?.completion_tokens ?? null,
        promptTokens: result.usage?.prompt_tokens ?? null,
        attempts: result.attempts,
        latencyMs: result.latencyMs,
      },
      completion,
    };
    return record;
  }).then((records) => {
    records.sort((left, right) => (left.item < right.item ? -1 : 1));
    mkdirSync(join(join(options.out, options.experiment), 'items'), { recursive: true });
    const path = join(options.out, options.experiment, 'items', `direct-${records.length}.jsonl`);
    writeFileSync(path, records.map((record) => JSON.stringify(record)).join('\n') + '\n');
    if (logPath !== null) {
      appendLines(logPath, records);
    }
    return { records, path };
  });
}

function appendLines(path, records) {
  for (const record of records) {
    appendFileSync(path, `${JSON.stringify(record)}\n`);
  }
}

/** Capability probes: one generation per probe, exact or normalized comparison. */
async function runProbes({ options, logPath }) {
  const suite = JSON.parse(readFileSync(PROBES_PATH, 'utf8'));
  const records = await mapWithConcurrency(suite.probes, options.concurrency, async (probe) => {
    const result = await generate({
      base: options.base,
      model: options.model,
      messages: [
        { role: 'system', content: suite.systemPrompt },
        { role: 'user', content: probe.prompt },
      ],
      temperature: 0,
      maxTokens: 256,
    });
    const completion = result.completion;
    const text = completion === null ? '' : completion.trim();
    // A quoted result is a formatting deviation, not a capability loss, so the
    // normalized comparison strips one layer of wrapping quotes; the exact
    // instruction probes stay strict.
    const bare = text.replace(/^["'`]+/, '').replace(/["'`]+$/, '');
    const matched =
      text !== '' &&
      (probe.comparison === 'exact' ? text === probe.expected : normalizeAnswer(bare) === normalizeAnswer(probe.expected));
    return {
      item: `probe/${probe.id}`,
      kind: probe.kind,
      class: completion === null ? 'generation_transport_error' : matched ? 'answer_match' : 'answer_mismatch',
      expected: probe.expected,
      comparison: probe.comparison,
      answer: text === '' ? null : text,
      generated: {
        tokens: result.usage?.completion_tokens ?? null,
        promptTokens: result.usage?.prompt_tokens ?? null,
        attempts: result.attempts,
        latencyMs: result.latencyMs,
      },
      completion,
    };
  });
  records.sort((left, right) => (left.item < right.item ? -1 : 1));
  mkdirSync(join(options.out, options.experiment, 'items'), { recursive: true });
  const path = join(options.out, options.experiment, 'items', 'capability-probes.jsonl');
  writeFileSync(path, records.map((record) => JSON.stringify(record)).join('\n') + '\n');
  if (logPath !== null) {
    appendLines(logPath, records);
  }
  return { records, path, profile: suite.profile };
}

function efficiencyOf(records) {
  const generated = records.reduce((total, record) => total + (record.generated.tokens ?? 0), 0);
  const prompt = records.reduce((total, record) => total + (record.generated.promptTokens ?? 0), 0);
  const calls = records.reduce((total, record) => total + (record.generated.attempts ?? 0), 0);
  const wallClockMs = records.reduce((total, record) => total + (record.generated.latencyMs ?? 0), 0);
  const matches = records.filter((record) => record.class === 'answer_match').length;
  return {
    generatedTokens: generated,
    promptTokens: prompt,
    calls,
    wallClockMs,
    tokensPerSecond: wallClockMs === 0 ? null : Number(((generated / wallClockMs) * 1000).toFixed(2)),
    costPerCorrect: matches === 0 ? null : Number((generated / matches).toFixed(1)),
  };
}

function classesOf(records) {
  const classes = {};
  for (const record of records) {
    classes[record.class] = (classes[record.class] ?? 0) + 1;
  }
  return classes;
}

function renderBaselineReport({ metrics }) {
  const lines = [];
  lines.push('# Baseline of the untuned base model');
  lines.push('');
  lines.push(`Experiment \`${metrics.experiment}\`, checkpoint \`${metrics.checkpoint.model}\`.`);
  lines.push(`Sample: ${metrics.sample.size} holdout examples, seed ${metrics.sample.seed}, the same items in both modes.`);
  lines.push('');
  lines.push('## Direct answers');
  lines.push('');
  lines.push('| class | items |');
  lines.push('| --- | --- |');
  for (const [className, count] of Object.entries(metrics.direct.classes)) {
    lines.push(`| ${className} | ${count} |`);
  }
  lines.push('');
  lines.push(`Direct-answer match rate: ${(metrics.direct.answerMatchRate * 100).toFixed(1)}%.`);
  lines.push('');
  lines.push('## Compiled-plan mode (zero shot)');
  lines.push('');
  lines.push('| rate | value |');
  lines.push('| --- | --- |');
  for (const [name, value] of Object.entries(metrics.compiled.rates)) {
    lines.push(`| ${name} | ${value === null ? 'n/a' : `${(value * 100).toFixed(1)}%`} |`);
  }
  lines.push('');
  lines.push('| class | items |');
  lines.push('| --- | --- |');
  for (const [className, count] of Object.entries(metrics.compiled.classes)) {
    lines.push(`| ${className} | ${count} |`);
  }
  lines.push('');
  lines.push('## Capability probes');
  lines.push('');
  lines.push(`Probe suite \`${metrics.probes.profile}\`: ${metrics.probes.passed} of ${metrics.probes.items} passed.`);
  lines.push('');
  lines.push('| kind | passed | items |');
  lines.push('| --- | --- | --- |');
  for (const [kind, value] of Object.entries(metrics.probes.byKind)) {
    lines.push(`| ${kind} | ${value.passed} | ${value.items} |`);
  }
  lines.push('');
  lines.push('## Efficiency');
  lines.push('');
  lines.push('| measure | value |');
  lines.push('| --- | --- |');
  for (const [name, value] of Object.entries(metrics.efficiency)) {
    lines.push(`| ${name} | ${value === null ? 'n/a' : value} |`);
  }
  lines.push('');
  lines.push('Accuracy and speed above come from the same served artifact.');
  lines.push('');
  return lines.join('\n');
}

const options = parseArguments(process.argv.slice(2));
const experimentDir = join(options.out, options.experiment);
mkdirSync(join(experimentDir, 'items'), { recursive: true });
const logPath = join(experimentDir, 'requests.jsonl');

const holdout = resolveSlice({ slice: 'holdout' });
const items = sampleOf(holdout.items, { size: options.sample, seed: options.seed });
console.log(`holdout items: ${holdout.items.length}, sampled ${items.length} with seed ${options.seed}`);

const startedAt = new Date().toISOString();
const direct = await runDirect({ items, options, logPath });
console.log(`direct: ${JSON.stringify(classesOf(direct.records))}`);

const runtime = createRuntime();
const compiled = await runSlice({
  items,
  generateItem: (messages) => generate({ base: options.base, model: options.model, messages, temperature: 0, maxTokens: options.maxTokens }),
  runtime,
  outDir: experimentDir,
  experimentId: options.experiment,
  sliceName: `compiled-${items.length}`,
  concurrency: options.concurrency,
  logPath,
});
console.log(`compiled: ${JSON.stringify(classesOf(compiled.records))}`);

const probes = await runProbes({ options, logPath });
console.log(`probes: ${probes.records.filter((record) => record.class === 'answer_match').length}/${probes.records.length} passed`);

const directMatches = direct.records.filter((record) => record.class === 'answer_match').length;
const probeMatches = probes.records.filter((record) => record.class === 'answer_match').length;
const byKind = {};
for (const record of probes.records) {
  byKind[record.kind] ??= { items: 0, passed: 0 };
  byKind[record.kind].items += 1;
  if (record.class === 'answer_match') byKind[record.kind].passed += 1;
}

const metrics = {
  experiment: options.experiment,
  checkpoint: { model: options.model, base: options.base, artifact: 'training/checkpoints/base-f16.gguf', quantization: 'F16' },
  sample: { size: items.length, seed: options.seed, source: holdout.source },
  direct: {
    classes: classesOf(direct.records),
    answerMatchRate: direct.records.length === 0 ? null : directMatches / direct.records.length,
    efficiency: efficiencyOf(direct.records),
  },
  compiled: aggregate(compiled.records),
  probes: {
    profile: probes.profile,
    items: probes.records.length,
    passed: probeMatches,
    rate: probes.records.length === 0 ? null : probeMatches / probes.records.length,
    byKind,
  },
  efficiency: {
    generatedTokens: efficiencyOf(direct.records).generatedTokens + efficiencyOf(compiled.records).generatedTokens + efficiencyOf(probes.records).generatedTokens,
    promptTokens: efficiencyOf(direct.records).promptTokens + efficiencyOf(compiled.records).promptTokens + efficiencyOf(probes.records).promptTokens,
    calls: efficiencyOf(direct.records).calls + efficiencyOf(compiled.records).calls + efficiencyOf(probes.records).calls,
    wallClockMs: efficiencyOf(direct.records).wallClockMs + efficiencyOf(compiled.records).wallClockMs + efficiencyOf(probes.records).wallClockMs,
  },
};

writeFileSync(join(experimentDir, 'metrics.json'), JSON.stringify(metrics, null, 2) + '\n');
writeFileSync(join(experimentDir, 'report.md'), renderBaselineReport({ metrics }));
writeFileSync(
  join(experimentDir, 'run-manifest.json'),
  JSON.stringify(
    {
      experiment: options.experiment,
      kind: 'baseline',
      checkpoint: metrics.checkpoint,
      base: options.base,
      model: options.model,
      decoding: { temperature: 0, maxTokens: options.maxTokens, attempts: 'one retry on transport failure' },
      prompts: {
        compiledPlanProfile: { id: CHAT_PROFILE_ID, systemPromptSha256: SYSTEM_PROMPT_SHA256 },
        directSystemPrompt: DIRECT_SYSTEM_PROMPT,
        probeProfile: probes.profile,
      },
      sample: metrics.sample,
      items: { direct: direct.records.length, compiled: compiled.records.length, probes: probes.records.length },
      dataset: {
        snapshot: JSON.parse(readFileSync(join(REPOSITORY_ROOT, 'training/data/export-manifest.json'), 'utf8')).snapshot,
        holdoutSource: holdout.source,
      },
      runtime: { kernel: 'runtime/kernel.mjs', modelBindings: 'none' },
      startedAt,
    },
    null,
    2,
  ) + '\n',
);
console.log(`registry: ${experimentDir}`);
