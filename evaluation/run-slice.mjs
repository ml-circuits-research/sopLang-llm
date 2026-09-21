#!/usr/bin/env node
/**
 * Score one artifact on one slice (any slice file in export-row shape).
 *
 * `evaluation/run-eval.mjs` scores a slice against a server that is already
 * running; this tool owns the server as well, so a comparison across artifacts
 * (the untuned base against a fine-tuned checkpoint, one checkpoint against
 * another, a training slice against the holdout) is one command per artifact and
 * lands in its own registry folder with per-item records.
 *
 * Usage:
 *   node evaluation/run-slice.mjs --experiment cmp-base-train --gguf training/checkpoints/base-f16.gguf \
 *       --slice file:training/data/comparison-slice.jsonl
 *   node evaluation/run-slice.mjs --experiment cmp-exp005-holdout --best --slice holdout --port 8086
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { aggregate, resolveSlice, runSlice } from './run-eval.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { generate } from './client.mjs';
import { REPOSITORY_ROOT, withServer, resolveArtifactPath } from './server.mjs';
import { bestWinner } from './artifacts.mjs';

function parseArguments(argv) {
  const options = { experiment: null, slice: null, gguf: null, best: false, base: null, port: 8086, concurrency: 4, threads: null, maxTokens: 2048, help: false };
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
    else if (flag === '--gguf') options.gguf = value();
    else if (flag === '--best') options.best = true;
    else if (flag === '--base') options.base = value();
    else if (flag === '--port') options.port = Number(value());
    else if (flag === '--concurrency') options.concurrency = Number(value());
    else if (flag === '--threads') options.threads = Number(value());
    else if (flag === '--max-tokens') options.maxTokens = Number(value());
    else if (flag === '--help' || flag === '-h') options.help = true;
    else throw new Error(`unknown argument: ${flag}`);
  }
  return options;
}

const USAGE = `Usage: node evaluation/run-slice.mjs --experiment <id> --slice <spec> (--gguf <path> | --best | --base <url>) [options]

Scores one artifact on one slice and writes <registry>/<experiment>/{items,metrics.json,report.md,run-manifest.json}.

Options:
  --experiment <id>   registry folder of this run (required)
  --slice <spec>      holdout | validation | file:<path>   (required)
  --gguf <path>       artifact to serve (absolute or repository-relative)
  --best              serve the best measured selection winner
  --base <url>        attach to a running server instead of starting one
  --port N            port for the managed server (default 8086)
  --concurrency N     items generated in parallel (default 4)
  --max-tokens N      generation budget (default 2048)
  --threads N         CPU threads for the managed server
  --help              print this help
`;

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  process.stdout.write(USAGE);
  process.exit(0);
}
if (options.experiment === null || options.slice === null) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(2);
}

let artifactLabel = options.base ?? null;
let artifact = null;
if (options.gguf !== null) {
  artifact = resolveArtifactPath(options.gguf);
  artifactLabel = artifact.replace(`${REPOSITORY_ROOT}/`, '');
} else if (options.best) {
  const winner = bestWinner();
  if (winner === null) throw new Error('no measured winner found; pass --gguf');
  artifact = winner.gguf;
  artifactLabel = `${winner.gguf.replace(`${REPOSITORY_ROOT}/`, '')} (${winner.experiment} ${winner.winner})`;
  process.stdout.write(`best measured winner: ${winner.experiment} (${winner.winner})\n`);
} else if (options.base === null) {
  throw new Error('pass --gguf <path>, --best, or --base <url>');
}

const resolved = resolveSlice({ slice: options.slice });
const registryDir = join(REPOSITORY_ROOT, 'evaluation/registry', options.experiment);
mkdirSync(join(registryDir, 'items'), { recursive: true });
const runtime = createRuntime();

const run = async (baseUrl) => runSlice({
  items: resolved.items,
  generateItem: (messages) => generate({ base: baseUrl, model: 'student', messages, temperature: 0, maxTokens: options.maxTokens, timeoutMs: 600_000 }),
  runtime,
  outDir: registryDir,
  experimentId: options.experiment,
  sliceName: resolved.sliceName,
  concurrency: options.concurrency,
});

const records = options.base !== null
  ? (await run(options.base)).records
  : (await withServer(
      { ggufPath: artifact, port: options.port, logPath: join(registryDir, 'server.log'), threads: options.threads },
      ({ port }) => run(`http://127.0.0.1:${port}`),
    )).records;

const metrics = aggregate(records);
writeFileSync(join(registryDir, 'metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`);
writeFileSync(
  join(registryDir, 'report.md'),
  [
    `# Slice run — ${options.experiment}`,
    '',
    `Artifact: \`${artifactLabel}\`. Slice: ${resolved.sliceName} (${resolved.items.length} items, ${resolved.source ?? options.slice}).`,
    '',
    '| metric | numerator | items | rate |',
    '| --- | --- | --- | --- |',
    ...['parse_validity', 'graph_validity', 'runtime_completion', 'oracle_match'].map((name) => {
      const rate = metrics.rates[name];
      return `| ${name.replace(/_/g, ' ')} | ${rate === null ? 'n/a' : Math.round(rate * metrics.items)} | ${metrics.items} | ${rate === null ? 'n/a' : `${(rate * 100).toFixed(1)}%`} |`;
    }),
    '',
    '| class | items |',
    '| --- | --- |',
    ...Object.entries(metrics.classes).map(([name, count]) => `| ${name} | ${count} |`),
    '',
    `Per-item records: \`items/${resolved.sliceName}.jsonl\`.`,
    '',
  ].join('\n'),
);
writeFileSync(
  join(registryDir, 'run-manifest.json'),
  `${JSON.stringify({ experiment: options.experiment, artifact: artifactLabel, slice: { name: resolved.sliceName, spec: options.slice, items: resolved.items.length }, decoding: { temperature: 0, maxTokens: options.maxTokens, concurrency: options.concurrency, attemptsPerItem: 1, transportRetries: 1 }, startedAt: new Date().toISOString() }, null, 2)}\n`,
);

process.stdout.write(
  `${options.experiment}: ${metrics.items} items — parse ${(metrics.rates.parse_validity * 100).toFixed(1)}%, graph ${(metrics.rates.graph_validity * 100).toFixed(1)}%, ` +
  `completion ${(metrics.rates.runtime_completion * 100).toFixed(1)}%, oracle ${(metrics.rates.oracle_match * 100).toFixed(1)}%\n`,
);
