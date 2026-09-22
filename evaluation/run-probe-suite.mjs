#!/usr/bin/env node
/**
 * Score one probe suite on one served artifact (DS009, "Generalization tests").
 *
 * A probe suite is evaluation-only material with its own manifest and per-item
 * records; it never enters training. This runner serves the artifact for you
 * (or attaches to a server that is already up), asks every probe with the
 * suite's own system prompt, and writes the per-item records and the report into
 * a registry folder named by `--experiment`, so the numbers of a probe result
 * trace back to the artifact, the suite, and the individual answers.
 *
 * Usage:
 *   node evaluation/run-probe-suite.mjs --suite evaluation/probes/text-reasoning-probes.json \
 *       --experiment text-probes-base --gguf training/checkpoints/base-f16.gguf
 *   node evaluation/run-probe-suite.mjs --suite evaluation/probes/text-reasoning-probes.json \
 *       --experiment text-probes-best --best --port 8082
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bestWinner } from './artifacts.mjs';
import { renderProbesReport, scoreProbes, scoreProbesCompiled } from './probes.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { REPOSITORY_ROOT, resolveArtifactPath, withServer } from './server.mjs';

function parseArguments(argv) {
  const options = { suite: null, experiment: null, gguf: null, best: false, base: null, port: 8083, concurrency: 1, threads: null, compiled: false, maxTokens: 1024, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = () => {
      const next = argv[index + 1];
      if (next === undefined) throw new Error(`${flag} needs a value`);
      index += 1;
      return next;
    };
    if (flag === '--suite') options.suite = value();
    else if (flag === '--experiment') options.experiment = value();
    else if (flag === '--gguf') options.gguf = value();
    else if (flag === '--best') options.best = true;
    else if (flag === '--base') options.base = value();
    else if (flag === '--port') options.port = Number(value());
    else if (flag === '--concurrency') options.concurrency = Number(value());
    else if (flag === '--threads') options.threads = Number(value());
    else if (flag === '--compiled') options.compiled = true;
    else if (flag === '--max-tokens') options.maxTokens = Number(value());
    else if (flag === '--help' || flag === '-h') options.help = true;
    else throw new Error(`unknown argument: ${flag}`);
  }
  return options;
}

const USAGE = `Usage: node evaluation/run-probe-suite.mjs --suite <path> --experiment <id> (--gguf <path> | --best) [options]

Runs one probe suite against one artifact and writes
<registry>/<experiment>/{items/<profile>.jsonl, <profile>.md, run-manifest.json}.

Options:
  --suite <path>        the probe suite JSON (required)
  --experiment <id>     registry folder name of this run (required)
  --gguf <path>         artifact to serve (absolute or repository-relative)
  --best                serve the best measured winner instead of a named artifact
  --base <url>          attach to a server that is already running
  --port N              port for the managed server (default 8083)
  --concurrency N       probes generated in parallel (default 1)
  --threads N           CPU threads for the managed server
  --compiled            compiled-plan mode: the model must emit a circuit, the runtime executes
                        it, and the executed answer is compared with the expected value
  --max-tokens N        generation budget in compiled mode (default 1024)
  --help                print this help
`;

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  process.stdout.write(USAGE);
  process.exit(0);
}
if (options.suite === null || options.experiment === null) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(2);
}

const suitePath = options.suite.startsWith('/') ? options.suite : join(REPOSITORY_ROOT, options.suite);
if (!existsSync(suitePath)) throw new Error(`the suite ${suitePath} does not exist`);
const suite = JSON.parse(readFileSync(suitePath, 'utf8'));

let artifact = null;
if (options.gguf !== null) {
  artifact = resolveArtifactPath(options.gguf);
} else if (options.best) {
  const winner = bestWinner();
  if (winner === null) throw new Error('no measured winner found; pass --gguf');
  artifact = winner.gguf;
  process.stdout.write(`best measured winner: ${winner.experiment} (${winner.winner})\n`);
} else if (options.base === null) {
  throw new Error('pass --gguf <path>, --best, or --base <url>');
}

const registryDir = join(REPOSITORY_ROOT, 'evaluation/registry', options.experiment);
mkdirSync(join(registryDir, 'items'), { recursive: true });

const run = async (base, alias) => (options.compiled
  ? scoreProbesCompiled({
      suite,
      base,
      model: alias,
      concurrency: options.concurrency,
      maxTokens: options.maxTokens,
      timeoutMs: 600_000,
      runtime: createRuntime(),
    })
  : scoreProbes({
      suite,
      base,
      model: alias,
      concurrency: options.concurrency,
      timeoutMs: 600_000,
    }));

const scored = options.base !== null
  ? await run(options.base)
  : await withServer(
      { ggufPath: artifact, port: options.port, logPath: join(registryDir, 'server.log'), threads: options.threads },
      ({ port, alias }) => run(`http://127.0.0.1:${port}`, alias),
    );

const slug = suite.profile.replace(/[^a-z0-9.-]+/gi, '-') + (options.compiled ? '.compiled' : '');
writeFileSync(join(registryDir, 'items', `${slug}.jsonl`), `${scored.records.map((record) => JSON.stringify(record)).join('\n')}\n`);
const artifactLabel = options.base !== null ? `attached server ${options.base}` : artifact.replace(`${REPOSITORY_ROOT}/`, '');
writeFileSync(
  join(registryDir, `${slug}.md`),
  `${renderProbesReport({ experiment: options.experiment, artifact: artifactLabel, profile: scored.profile, records: scored.records })}\n## Distribution of the answers\n\n${Object.entries(
    scored.records.reduce((counts, record) => {
      const key = record.class === 'answer_match' ? 'answer_match' : `${record.class}${record.answer === null ? '' : ` (answered)`}`;
      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    }, {}),
  )
    .sort()
    .map(([key, count]) => `- ${key}: ${count}`)
    .join('\n')}\n`,
);
writeFileSync(
  join(registryDir, 'run-manifest.json'),
  `${JSON.stringify(
    {
      experiment: options.experiment,
      suite: { path: suitePath.replace(`${REPOSITORY_ROOT}/`, ''), profile: suite.profile, items: suite.probes.length, systemPromptSha256: scored.systemPromptSha256 },
      artifact: artifactLabel,
      mode: options.compiled ? 'compiled-plan (the model must emit a circuit; the executed answer is compared)' : 'direct answer',
      decoding: { temperature: 0, maxTokens: options.compiled ? options.maxTokens : 256, concurrency: options.concurrency, attemptsPerItem: 1, transportRetries: 1 },
      startedAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
);

const passed = scored.records.filter((record) => record.class === 'answer_match').length;
process.stdout.write(`${options.experiment}: ${passed}/${scored.records.length} probes passed against ${artifactLabel}\n`);
process.stdout.write(`wrote ${registryDir}/{items/${slug}.jsonl,${slug}.md,run-manifest.json}\n`);
