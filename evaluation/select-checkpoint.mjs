#!/usr/bin/env node
/**
 * Checkpoint selection (training/PLAN.md T7; DS009 "Checkpoint selection").
 *
 * For every checkpoint directory of an experiment: convert the HF checkpoint to
 * an F16 GGUF (no quantization during selection), serve it locally, run the
 * evaluation loop on the fixed validation slice, and tabulate oracle match and
 * parse validity. The winner is chosen by oracle match with parse validity as
 * the tiebreaker, never by training loss, and `selection.md` records the table,
 * the winner, and why. Because most slice rows sit on a plan fingerprint the
 * trainer also trains on, the table reports oracle match separately for
 * plan-seen and plan-unseen rows (DS009 "Checkpoint selection"). A LoRA
 * checkpoint (adapter files only) is merged into its base model with
 * `training/python/merge_adapter.py` before conversion, because the converter
 * reads full model directories.
 *
 * Usage:
 *   node evaluation/select-checkpoint.mjs --experiment exp-002-sft-lr2e-5 [--concurrency 4] [--port 8090] [--extra-args "--ctx-size 16384"]
 */

import { spawn } from 'node:child_process';
import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRuntime } from '../runtime/kernel.mjs';
import { generate } from './client.mjs';
import { aggregate, resolveSlice, runSlice } from './run-eval.mjs';
import { withServer } from './server.mjs';

const REPOSITORY_ROOT = fileURLToPath(new URL('..', import.meta.url));
const DEFAULT_REGISTRY = join(REPOSITORY_ROOT, 'evaluation/registry');
const CONVERTER = join(REPOSITORY_ROOT, 'tools/llamacpp/convert_hf_to_gguf.py');

function parseArguments(argv) {
  const options = {
    experiment: null,
    checkpoints: null,
    registry: DEFAULT_REGISTRY,
    port: 8090,
    concurrency: 4,
    maxTokens: 2048,
    slice: 'validation',
    limit: null,
    only: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--experiment') { options.experiment = argv[index + 1]; index += 1; }
    else if (argument === '--checkpoints') { options.checkpoints = argv[index + 1]; index += 1; }
    else if (argument === '--registry') { options.registry = argv[index + 1]; index += 1; }
    else if (argument === '--port') { options.port = Number(argv[index + 1]); index += 1; }
    else if (argument === '--concurrency') { options.concurrency = Number(argv[index + 1]); index += 1; }
    else if (argument === '--max-tokens') { options.maxTokens = Number(argv[index + 1]); index += 1; }
    else if (argument === '--slice') { options.slice = argv[index + 1]; index += 1; }
    else if (argument === '--limit') { options.limit = Number(argv[index + 1]); index += 1; }
    else if (argument === '--only') { options.only = argv[index + 1]; index += 1; }
    else throw new Error(`unknown argument: ${argument}`);
  }
  if (options.experiment === null) {
    throw new Error('--experiment is required');
  }
  return options;
}

function run(command, args, { logPath = null } = {}) {
  return new Promise((resolve, reject) => {
    // `stdio` takes pipes or file descriptors, never the string 'append': open
    // the log in append mode and hand its descriptor to the child, the way
    // `withServer` does. The string made every conversion fail with
    // ERR_INVALID_SYNC_FORK_INPUT before the first checkpoint was scored.
    let logFd = null;
    let stdio = ['ignore', 'pipe', 'pipe'];
    if (logPath !== null) {
      logFd = openSync(logPath, 'a');
      stdio = ['ignore', logFd, logFd];
    }
    const child = spawn(command, args, { cwd: REPOSITORY_ROOT, stdio });
    if (logFd !== null) {
      closeSync(logFd);
    }
    let output = '';
    if (child.stdout !== null) {
      child.stdout.on('data', (chunk) => { output += chunk; });
      child.stderr.on('data', (chunk) => { output += chunk; });
    }
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, output }));
  });
}

async function convertCheckpoint(checkpointDir, ggufPath, logPath) {
  const result = await run('bash', ['training/environment/train.sh', 'python', CONVERTER, checkpointDir, '--outfile', ggufPath, '--outtype', 'f16'], { logPath });
  if (result.code !== 0) {
    throw new Error(`GGUF conversion failed for ${checkpointDir}; see ${logPath}`);
  }
}

/**
 * A LoRA checkpoint holds adapter files, which the converter cannot read, so it
 * is merged into its base model first (once; the merged directory is reused).
 * Full fine-tuning checkpoints are returned unchanged.
 */
async function servableCheckpoint(checkpoint, logPath) {
  if (!existsSync(join(checkpoint.path, 'adapter_config.json'))) {
    return checkpoint.path;
  }
  const merged = join(dirname(checkpoint.path), `merged-${checkpoint.name}`);
  if (!existsSync(join(merged, 'config.json'))) {
    const result = await run('bash', [
      'training/environment/train.sh', 'python', join(REPOSITORY_ROOT, 'training/python/merge_adapter.py'),
      '--checkpoint', checkpoint.path, '--out', merged,
    ], { logPath });
    if (result.code !== 0) {
      throw new Error(`LoRA merge failed for ${checkpoint.path}; see ${logPath}`);
    }
  }
  console.log(`  merged adapter: ${merged}`);
  return merged;
}

function checkpointDirectories(root) {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^checkpoint-\d+$/.test(entry.name))
    .map((entry) => ({ name: entry.name, step: Number(entry.name.slice('checkpoint-'.length)), path: join(root, entry.name) }))
    .sort((left, right) => left.step - right.step);
}

/**
 * Plan fingerprints of the rows the trainer actually trains on: the export minus
 * the D11 slice that selection scores. DS009 requires the selection table to
 * separate plan-seen from plan-unseen rows, because a slice drawn from the
 * training books is mostly plan-seen and reads as recall rather than as
 * compilation.
 */
function trainingPlanFingerprints() {
  const slice = JSON.parse(readFileSync(join(REPOSITORY_ROOT, 'training/data/validation-slice.json'), 'utf8'));
  const excluded = new Set(slice.folders);
  const plans = new Set();
  for (const line of readFileSync(join(REPOSITORY_ROOT, 'training/data/all-books.jsonl'), 'utf8').split('\n')) {
    if (line === '') continue;
    const row = JSON.parse(line);
    if (!excluded.has(`${row.meta.book}/${row.meta.folder}`)) plans.add(row.meta.plan);
  }
  return plans;
}

function planSplitOf(records, trainingPlans) {
  const split = (rows) => (rows.length === 0 ? null : {
    items: rows.length,
    oracleMatch: rows.filter((row) => row.class === 'answer_match').length / rows.length,
  });
  return {
    planSeen: split(records.filter((record) => trainingPlans.has(record.plan))),
    planUnseen: split(records.filter((record) => !trainingPlans.has(record.plan))),
  };
}

const options = parseArguments(process.argv.slice(2));
const checkpointsRoot = options.checkpoints ?? join(REPOSITORY_ROOT, 'training/checkpoints', options.experiment);
const registryDir = join(options.registry, options.experiment);
const ggufDir = join(registryDir, 'gguf');
mkdirSync(ggufDir, { recursive: true });

let checkpoints = checkpointDirectories(checkpointsRoot);
if (options.only !== null) {
  const named = checkpoints.find((checkpoint) => checkpoint.name === options.only);
  if (named === undefined) {
    throw new Error(`no checkpoint named ${options.only} under ${checkpointsRoot}`);
  }
  checkpoints = [named];
}
if (checkpoints.length === 0) {
  throw new Error(`no checkpoint-<step> directories under ${checkpointsRoot}`);
}
console.log(`selection: ${checkpoints.length} checkpoint(s) of ${options.experiment} on the ${options.slice} slice`);

const items = options.limit === null ? resolveSlice({ slice: options.slice }).items : resolveSlice({ slice: options.slice, limit: options.limit }).items;
const runtime = createRuntime();
const trainingPlans = options.slice === 'validation' ? trainingPlanFingerprints() : null;
const rows = [];

// The early-stop watcher already scored every save during training on this very
// slice (select-checkpoint --only). Re-scoring those checkpoints again would
// convert, boot, and score the same models a second time - about an hour per
// arm. A stored score for the same checkpoint and the same item count is
// reused verbatim; only the checkpoints the watcher never saw are scored here.
function storedScore(checkpoint) {
  const scoresPath = join(REPOSITORY_ROOT, 'training/checkpoints', options.experiment, 'validation-scores.jsonl');
  if (!existsSync(scoresPath)) return null;
  try {
    for (const line of readFileSync(scoresPath, 'utf8').split('\n')) {
      if (line.trim() === '') continue;
      const record = JSON.parse(line);
      if (record.checkpoint !== checkpoint.name || record.items !== items.length) continue;
      if (record.oracle === null || record.parse === null) continue;
      return record;
    }
  } catch {
    return null;
  }
  return null;
}

for (const checkpoint of checkpoints) {
  const stored = storedScore(checkpoint);
  if (stored !== null) {
    console.log(`\n=== ${checkpoint.name}: reusing the in-loop validation score (${stored.items} items)`);
    rows.push({
      checkpoint: checkpoint.name,
      step: stored.step ?? checkpoint.step,
      gguf: null,
      metrics: {
        items: stored.items,
        classes: { reused: stored.items },
        rates: {
          oracle_match: stored.oracle,
          parse_validity: stored.parse,
          graph_validity: stored.graph ?? null,
          runtime_completion: stored.completion ?? null
        }
      },
      planSplit: null,
      reused: true
    });
    continue;
  }
  const ggufPath = join(ggufDir, `${checkpoint.name}.gguf`);
  console.log(`\n=== ${checkpoint.name} (${items.length} validation items)`);
  const convertSource = await servableCheckpoint(checkpoint, join(ggufDir, `${checkpoint.name}-merge.log`));
  await convertCheckpoint(convertSource, ggufPath, join(ggufDir, `${checkpoint.name}-convert.log`));
  const records = await withServer({ ggufPath, port: options.port, logPath: join(ggufDir, `${checkpoint.name}-server.log`) }, ({ alias }) =>
    runSlice({
      items,
      generateItem: (messages) => generate({ base: `http://127.0.0.1:${options.port}`, model: alias, messages, temperature: 0, maxTokens: options.maxTokens }),
      runtime,
      outDir: join(registryDir, 'selection'),
      experimentId: options.experiment,
      sliceName: checkpoint.name,
      concurrency: options.concurrency,
    }),
  );
  const metrics = aggregate(records.records);
  const planSplit = trainingPlans === null ? null : planSplitOf(records.records, trainingPlans);
  rows.push({ checkpoint: checkpoint.name, step: checkpoint.step, gguf: ggufPath.replace(`${REPOSITORY_ROOT}/`, ''), metrics, planSplit });
  console.log(
    `${checkpoint.name}: oracle ${(metrics.rates.oracle_match * 100).toFixed(1)}%, parse ${(metrics.rates.parse_validity * 100).toFixed(1)}%, graph ${(metrics.rates.graph_validity * 100).toFixed(1)}%` +
    (planSplit === null ? '' : `; plan-seen ${planSplit.planSeen === null ? 'n/a' : `${(planSplit.planSeen.oracleMatch * 100).toFixed(1)}% (${planSplit.planSeen.items})`}, plan-unseen ${planSplit.planUnseen === null ? 'n/a' : `${(planSplit.planUnseen.oracleMatch * 100).toFixed(1)}% (${planSplit.planUnseen.items})`}`),
  );
}

// A reused winner has no GGUF yet: the holdout serves the winner's artifact,
// so exactly the winner is converted now instead of every checkpoint.
const ranked = [...rows].sort((left, right) => {
  const oracle = (right.metrics.rates.oracle_match ?? 0) - (left.metrics.rates.oracle_match ?? 0);
  if (oracle !== 0) return oracle;
  return (right.metrics.rates.parse_validity ?? 0) - (left.metrics.rates.parse_validity ?? 0);
});
const winner = ranked[0];
if (winner.gguf === null) {
  const winnerCheckpoint = checkpoints.find((checkpoint) => checkpoint.name === winner.checkpoint);
  if (winnerCheckpoint !== undefined) {
    console.log(`\n=== converting the winner ${winner.checkpoint} for the holdout`);
    const convertSource = await servableCheckpoint(winnerCheckpoint, join(ggufDir, `${winner.checkpoint}-merge.log`));
    await convertCheckpoint(convertSource, join(ggufDir, `${winner.checkpoint}.gguf`), join(ggufDir, `${winner.checkpoint}-convert.log`));
    winner.gguf = join(ggufDir, `${winner.checkpoint}.gguf`).replace(`${REPOSITORY_ROOT}/`, '');
  }
}

const lines = [];
lines.push(`# Checkpoint selection, ${options.experiment}`);
lines.push('');
lines.push(`Validation slice: ${items.length} rows, selected by the D11 slice of \`training/data/validation-slice.json\`.`);
lines.push('Every checkpoint is converted to an F16 GGUF (no quantization during selection) and scored with the full evaluation loop:');
lines.push('greedy decoding, one attempt, the recorded post-processing contract, then parse, graph, execution, and oracle comparison.');
if (trainingPlans !== null) {
  const seen = items.filter((item) => trainingPlans.has(item.plan)).length;
  lines.push('');
  lines.push(`${seen} of ${items.length} slice rows sit on a plan fingerprint that also occurs in the rows the trainer trains on, and ${items.length - seen} are on plans that occur nowhere else; DS009 requires the table to report oracle match for the two groups separately, because the first group measures recall of a known plan and only the second measures compilation of an unseen one. The winner is still chosen by overall oracle match, so selection stays comparable across experiments.`);
}
lines.push('');
lines.push('| checkpoint | step | oracle match | oracle match (plan seen) | oracle match (plan unseen) | parse validity | graph validity | runtime completion | items |');
lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const row of ranked) {
  const rate = (name) => (row.metrics.rates[name] === null ? 'n/a' : `${(row.metrics.rates[name] * 100).toFixed(1)}%`);
  const split = (key) => (row.planSplit === null || row.planSplit[key] === null
    ? 'n/a'
    : `${(row.planSplit[key].oracleMatch * 100).toFixed(1)}% (${row.planSplit[key].items})`);
  lines.push(`| ${row.checkpoint} | ${row.step} | ${rate('oracle_match')} | ${split('planSeen')} | ${split('planUnseen')} | ${rate('parse_validity')} | ${rate('graph_validity')} | ${rate('runtime_completion')} | ${row.metrics.items} |`);
}
lines.push('');
lines.push(`Selected: **${winner.checkpoint}** (highest oracle match, parse validity as the tiebreaker; training loss is never used for selection).`);
lines.push('');
lines.push('| class | items (selected checkpoint) |');
lines.push('| --- | --- |');
if (winner.reused === true) {
  lines.push('| _reused in-loop score_ | _the holdout is the authoritative class table_ |');
} else {
  for (const [className, count] of Object.entries(winner.metrics.classes)) {
    lines.push(`| ${className} | ${count} |`);
  }
}
lines.push('');
lines.push('Per-item records: `selection/<checkpoint>.jsonl`.');
lines.push('');
if (options.only !== null) {
  // The early-stop watcher scores each save as it lands. It appends one line to the
  // experiment's scores file and prints the machine-readable verdict; the full
  // selection table stays the chain's job at the end of the arm.
  const scoreLine = {
    checkpoint: winner.checkpoint,
    step: winner.step,
    oracle: winner.metrics.rates.oracle_match ?? null,
    parse: winner.metrics.rates.parse_validity ?? null,
    graph: winner.metrics.rates.graph_validity ?? null,
    completion: winner.metrics.rates.runtime_completion ?? null,
    items: winner.metrics.items,
    scoredUtc: new Date().toISOString()
  };
  const scoresPath = join(REPOSITORY_ROOT, 'training/checkpoints', options.experiment, 'validation-scores.jsonl');
  mkdirSync(dirname(scoresPath), { recursive: true });
  appendFileSync(scoresPath, `${JSON.stringify(scoreLine)}\n`);
  console.log(`EARLYSTOP ${JSON.stringify(scoreLine)}`);
} else {
  writeFileSync(join(registryDir, 'selection.md'), lines.join('\n'));
  writeFileSync(join(registryDir, 'selection.json'), JSON.stringify({ experiment: options.experiment, slice: options.slice, items: items.length, winner: winner.checkpoint, rows }, null, 2) + '\n');
  console.log(`\nselected ${winner.checkpoint}; wrote ${join(registryDir, 'selection.md')}`);
}
