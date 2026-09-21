#!/usr/bin/env node
/**
 * Deployment measurement (training/PLAN.md T10; DS009 "Export and deployment
 * measurement").
 *
 * Takes the winning checkpoint of a selection run, quantizes its F16 GGUF to
 * the deployment formats (Q8_0 and Q4_K_M by default), serves each quantized
 * artifact, and reruns the COMPLETE evaluation on that exact file: the 225-item
 * holdout through the D9 loop plus the capability probes, then a fixed-prompt
 * request that reports prompt-processing throughput and time to first token.
 * Accuracy, throughput, and peak memory of one artifact come from the same
 * server session, because DS007 forbids reporting BF16 accuracy with 4-bit
 * speed.
 *
 * Usage:
 *   node evaluation/run-deployment.mjs --experiment exp-003-sft-lr1e-4 [--quants Q8_0,Q4_K_M] [--threads 8] [--concurrency 4] [--limit N]
 *
 * Every quantization writes its own registry folder named
 * `<experiment>-<quant-slug>` (per-item records, metrics, report, run manifest,
 * probes), and `<experiment>/deployment.md` carries the comparison table.
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cpus, machine } from 'node:os';
import { createRuntime } from '../runtime/kernel.mjs';
import { generate } from './client.mjs';
import { renderProbesReport, scoreProbes, summaryOf } from './probes.mjs';
import { aggregate, resolveSlice, runSlice } from './run-eval.mjs';
import { LLAMA_QUANTIZE, REPOSITORY_ROOT, resolveArtifactPath, withServer } from './server.mjs';

const DEFAULT_REGISTRY = join(REPOSITORY_ROOT, 'evaluation/registry');

function parseArguments(argv) {
  const options = {
    experiment: null,
    quants: ['Q8_0', 'Q4_K_M'],
    threads: Math.min(8, cpus().length),
    concurrency: 4,
    port: 8081,
    maxTokens: 2048,
    limit: null,
    force: false,
    registry: DEFAULT_REGISTRY,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = () => {
      const next = argv[index + 1];
      if (next === undefined) throw new Error(`${flag} needs a value`);
      index += 1;
      return next;
    };
    if (flag === '--experiment') options.experiment = value();
    else if (flag === '--quants') options.quants = value().split(',').map((quant) => quant.trim()).filter((quant) => quant !== '');
    else if (flag === '--threads') options.threads = Number(value());
    else if (flag === '--concurrency') options.concurrency = Number(value());
    else if (flag === '--port') options.port = Number(value());
    else if (flag === '--max-tokens') options.maxTokens = Number(value());
    else if (flag === '--limit') options.limit = Number(value());
    else if (flag === '--force') options.force = true;
    else if (flag === '--registry') options.registry = value();
    else throw new Error(`unknown argument: ${flag}`);
  }
  if (options.experiment === null) throw new Error('--experiment is required');
  return options;
}

/** The winning artifact of a selection run, plus the checkpoint name it came from. */
function winnerOf(registryDir) {
  const selection = JSON.parse(readFileSync(join(registryDir, 'selection.json'), 'utf8'));
  const row = selection.rows.find((entry) => entry.checkpoint === selection.winner);
  if (row === undefined) throw new Error(`selection.json has no row for winner ${selection.winner}`);
  return { checkpoint: selection.winner, gguf: resolveArtifactPath(row.gguf) };
}

function quantize(sourceGguf, targetGguf, quant, logPath) {
  const log = spawn(LLAMA_QUANTIZE, [sourceGguf, targetGguf, quant], { cwd: REPOSITORY_ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  log.stdout.on('data', (chunk) => { output += chunk; });
  log.stderr.on('data', (chunk) => { output += chunk; });
  return new Promise((resolve, reject) => {
    log.on('error', reject);
    log.on('close', (code) => {
      writeFileSync(logPath, output);
      if (code !== 0) reject(new Error(`llama-quantize ${quant} failed; see ${logPath}`));
      else resolve();
    });
  });
}

/**
 * Prompt-processing throughput and time to first token, measured on one fixed
 * prompt through the native completion endpoint with a single predicted token,
 * so `prompt_ms` is the prompt processing time and `predicted_ms` the first
 * generated token.
 */
async function measureThroughput({ port, prompt }) {
  const response = await fetch(`http://127.0.0.1:${port}/completion`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt, n_predict: 1, temperature: 0, cache_prompt: false, stream: false }),
  });
  const body = await response.json();
  const timings = body.timings ?? {};
  return {
    promptTokens: timings.prompt_n ?? null,
    promptMs: timings.prompt_ms ?? null,
    promptTokensPerSecond: timings.prompt_ms ? (timings.prompt_n ?? 0) / (timings.prompt_ms / 1000) : null,
    firstTokenMs: timings.prompt_ms === null || timings.predicted_ms === null ? null : timings.prompt_ms + timings.predicted_ms,
  };
}

/** A usable host label: some ARM kernels report the CPU model as 'unknown'. */
function cpuLabel() {
  const model = cpus()[0]?.model ?? 'unknown';
  return model === 'unknown' ? `${machine()} host, ${cpus().length} cores` : model;
}

const options = parseArguments(process.argv.slice(2));
const registryDir = join(options.registry, options.experiment);
if (!existsSync(join(registryDir, 'selection.json'))) {
  throw new Error(`${registryDir}/selection.json does not exist; run evaluation/select-checkpoint.mjs first`);
}
const winner = winnerOf(registryDir);
const ggufDir = join(registryDir, 'gguf');
mkdirSync(ggufDir, { recursive: true });
const items = resolveSlice({ slice: 'holdout', limit: options.limit }).items;
const runtime = createRuntime();
const rows = [];

for (const quant of options.quants) {
  const slug = quant.toLowerCase().replace(/_/g, '-');
  const quantizedPath = join(ggufDir, `${winner.checkpoint}-${slug}.gguf`);
  const experimentId = `${options.experiment}-${slug}`;
  const artifactDir = join(options.registry, experimentId);
  mkdirSync(join(artifactDir, 'items'), { recursive: true });
  console.log(`\n=== ${quant}: ${basename(quantizedPath)}`);
  const storedPath = join(artifactDir, 'metrics.json');
  if (!options.force && existsSync(storedPath)) {
    // A measured artifact is reused: quantization and scoring cost GPU minutes, and
    // the per-artifact records are already the evidence this report summarizes.
    const stored = JSON.parse(readFileSync(storedPath, 'utf8'));
    console.log(`${quant}: reusing the recorded measurement (${stored.deployment.artifact})`);
    rows.push({ quant, slug, artifact: stored.deployment.artifact, experimentId, items: stored.items, rates: stored.rates, efficiency: stored.efficiency, probes: stored.capabilityProbes, throughput: stored.deployment.throughput, peakResidentGib: stored.deployment.peakResidentGib });
    continue;
  }
  await quantize(winner.gguf, quantizedPath, quant, join(ggufDir, `${winner.checkpoint}-${slug}-quantize.log`));

  const measurement = await withServer(
    { ggufPath: quantizedPath, port: options.port, logPath: join(artifactDir, 'server.log'), threads: options.threads },
    async ({ port, peakResidentGib }) => {
      const throughput = await measureThroughput({ port, prompt: items[0].statement });
      const { records } = await runSlice({
        items,
        generateItem: (messages) => generate({ base: `http://127.0.0.1:${port}`, model: 'student', messages, temperature: 0, maxTokens: options.maxTokens }),
        runtime,
        outDir: artifactDir,
        experimentId,
        sliceName: 'holdout',
        concurrency: options.concurrency,
      });
      const probes = await scoreProbes({ base: `http://127.0.0.1:${port}`, model: 'student', concurrency: options.concurrency });
      writeFileSync(join(artifactDir, 'items/capability-probes.jsonl'), `${probes.records.map((record) => JSON.stringify(record)).join('\n')}\n`);
      writeFileSync(join(artifactDir, 'probes.md'), renderProbesReport({
        experiment: experimentId,
        artifact: quantizedPath.replace(`${REPOSITORY_ROOT}/`, ''),
        profile: probes.profile,
        records: probes.records,
      }));
      return { throughput, metrics: aggregate(records), probes: { profile: probes.profile, ...summaryOf(probes.records) }, peakResidentGib: peakResidentGib() };
    },
  );

  const rates = measurement.metrics.rates;
  const row = {
    quant,
    slug,
    artifact: quantizedPath.replace(`${REPOSITORY_ROOT}/`, ''),
    experimentId,
    items: measurement.metrics.items,
    rates,
    efficiency: measurement.metrics.efficiency,
    probes: { passed: measurement.probes.passed, items: measurement.probes.items },
    throughput: measurement.throughput,
    peakResidentGib: measurement.peakResidentGib,
  };
  rows.push(row);
  writeFileSync(
    join(artifactDir, 'metrics.json'),
    `${JSON.stringify({ ...measurement.metrics, capabilityProbes: measurement.probes, deployment: { quant, artifact: row.artifact, throughput: row.throughput, peakResidentGib: row.peakResidentGib } }, null, 2)}\n`,
  );
  console.log(
    `${quant}: oracle ${(rates.oracle_match * 100).toFixed(1)}%, parse ${(rates.parse_validity * 100).toFixed(1)}%, ` +
    `probes ${row.probes.passed}/${row.probes.items}, ${row.efficiency.tokensPerSecond?.toFixed(1) ?? 'n/a'} generated tok/s, ` +
    `prompt ${row.throughput.promptTokensPerSecond?.toFixed(0) ?? 'n/a'} tok/s, peak ${row.peakResidentGib?.toFixed(1) ?? 'n/a'} GiB`,
  );
}

const lines = [];
const percent = (rate) => (rate === null || rate === undefined ? 'n/a' : `${(rate * 100).toFixed(1)}%`);
lines.push(`# Deployment measurement, ${options.experiment}`);
lines.push('');
lines.push(`Winner \`${winner.checkpoint}\` of the selection table, quantized from \`${winner.gguf.replace(`${REPOSITORY_ROOT}/`, '')}\` (F16).`);
lines.push(`Every row below — accuracy, throughput, and memory — was measured on that row's own artifact in one server session on this host (\`${cpuLabel()}\`, ${options.threads} threads, greedy decoding, ${items.length} holdout items, one generated attempt per item).`);
lines.push('');
lines.push('| quant | artifact | items | parse | graph | completion | oracle | probes | generated tok/s | prompt tok/s | first token ms | peak RSS GiB |');
lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const row of rows) {
  lines.push(
    `| ${row.quant} | \`${row.artifact}\` | ${row.items} | ${percent(row.rates.parse_validity)} | ${percent(row.rates.graph_validity)} | ` +
    `${percent(row.rates.runtime_completion)} | ${percent(row.rates.oracle_match)} | ${row.probes.passed}/${row.probes.items} | ` +
    `${row.efficiency.tokensPerSecond?.toFixed(1) ?? 'n/a'} | ${row.throughput.promptTokensPerSecond?.toFixed(0) ?? 'n/a'} | ` +
    `${row.throughput.firstTokenMs?.toFixed(0) ?? 'n/a'} | ${row.peakResidentGib?.toFixed(2) ?? 'n/a'} |`,
  );
}
lines.push('');
lines.push(`Whole-task latency per item (mean of the per-item generations) is in each artifact's own metrics file; the prompt-processing figure uses the same fixed prompt for every row (\`prompt_n\`/\`prompt_ms\` of the native completion endpoint with \`n_predict: 1\`), and the first-token time is that prompt time plus the single predicted token.`);
lines.push('');
lines.push(`Per-artifact evidence: \`<artifact registry folder>/{items/holdout.jsonl,items/capability-probes.jsonl,metrics.json,probes.md,server.log}\`. Quantization loss is the difference between a row and the F16 selection table of the same checkpoint; it is reported here rather than assumed.`);
lines.push('');
writeFileSync(join(registryDir, 'deployment.md'), lines.join('\n'));
console.log(`\nwrote ${join(registryDir, 'deployment.md')}`);
