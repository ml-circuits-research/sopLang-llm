// Holdout failure analysis for the Phase 4 registry (training/PLAN.md T9).
//
// Reads the per-item records of one experiment's holdout run and reproduces every
// number of `evaluation/registry/phase4-analysis.md`: the slice definitions, the
// outcome classes by book, category, and plan cluster, the failure taxonomy, the
// comparison of the emitted slots against the reference solution, the emitted wire
// shape, and the confusion between seen and unseen plans.
//
// Usage:
//   node evaluation/analyze-holdout.mjs --experiment exp-003-sft-lr1e-4 [--checkpoint 540] [--samples 4]
//
// The checkpoint defaults to the winner named in the experiment's `selection.md`;
// the reference solutions come from the shipped tree, so the slots comparison is
// against what the dataset certifies, not against a re-parse of the completion.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const readJsonl = (path) => readFileSync(path, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
const section = (title) => console.log(`\n## ${title}\n`);

function argsOf(argv) {
  const args = { experiment: null, checkpoint: null, samples: 4 };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--experiment') args.experiment = argv[++i];
    else if (argv[i] === '--checkpoint') args.checkpoint = Number(argv[++i]);
    else if (argv[i] === '--samples') args.samples = Number(argv[++i]);
  }
  if (!args.experiment) throw new Error('--experiment is required');
  return args;
}

function winnerOf(experiment) {
  const path = join(root, 'evaluation/registry', experiment, 'selection.md');
  if (!existsSync(path)) return null;
  const match = readFileSync(path, 'utf8').match(/Selected: \*\*checkpoint-(\d+)\*\*/);
  return match ? Number(match[1]) : null;
}

const tally = (values) => Object.fromEntries(
  [...values.reduce((map, value) => map.set(value, (map.get(value) ?? 0) + 1), new Map())]
    .sort((a, b) => b[1] - a[1]),
);

function table(rows, header) {
  console.log(`| ${header.join(' | ')} |`);
  console.log(`| ${header.map(() => '---').join(' | ')} |`);
  for (const row of rows) console.log(`| ${row.join(' | ')} |`);
}

// --- slices ---------------------------------------------------------------
function slices() {
  const rows = readJsonl(join(root, 'training/data/all-books.jsonl'));
  const slice = JSON.parse(readFileSync(join(root, 'training/data/validation-slice.json'), 'utf8'));
  const key = (row) => `${row.meta.book}/${row.meta.folder}`;
  const inSlice = new Set(slice.folders);
  const training = rows.filter((row) => !inSlice.has(key(row)));
  const validation = rows.filter((row) => inSlice.has(key(row)));
  const trainingPlans = new Set(training.map((row) => row.meta.plan));
  const perPlan = new Map();
  for (const row of training) perPlan.set(row.meta.plan, (perPlan.get(row.meta.plan) ?? 0) + 1);
  const counts = [...perPlan.values()].sort((a, b) => a - b);
  const buckets = { '1 row': 0, '2-4': 0, '5-9': 0, '10-49': 0, '50+': 0 };
  for (const count of counts) {
    if (count === 1) buckets['1 row'] += 1;
    else if (count < 5) buckets['2-4'] += 1;
    else if (count < 10) buckets['5-9'] += 1;
    else if (count < 50) buckets['10-49'] += 1;
    else buckets['50+'] += 1;
  }
  return {
    exportRows: rows.length,
    exportPlans: new Set(rows.map((row) => row.meta.plan)).size,
    training, validation, trainingPlans, perPlanBuckets: buckets,
    medianRowsPerPlan: counts[Math.floor(counts.length / 2)],
    slice,
    validationReusedRows: validation.filter((row) => trainingPlans.has(row.meta.plan)).length,
  };
}

// --- slots comparison -----------------------------------------------------
function referenceSlots(book, folder) {
  const path = join(root, 'training-data', book, folder, 'solution.sop');
  if (!existsSync(path)) return null;
  const match = readFileSync(path, 'utf8').match(/@slots\s+literal\s*\n(\{[\s\S]*?\n\})/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

function emittedSlots(program) {
  const match = program.match(/@slots\s+literal\s*\n(\{[\s\S]*?\n\})/);
  if (!match) return 'absent';
  try { return JSON.parse(match[1]); } catch { return 'unparsable'; }
}

function slotsComparison(items) {
  const verdicts = new Map();
  const examples = [];
  for (const item of items) {
    const reference = referenceSlots(item.book, item.folder);
    if (!reference) continue;
    const emitted = emittedSlots(item.completion ?? '');
    if (emitted === 'absent' || emitted === 'unparsable') {
      verdicts.set(emitted, (verdicts.get(emitted) ?? 0) + 1);
      continue;
    }
    const want = new Set(Object.keys(reference));
    const got = new Set(Object.keys(emitted));
    const shared = [...got].filter((name) => want.has(name)).length;
    const verdict = shared === want.size && got.size === want.size ? 'identical keys'
      : shared > 0 ? 'partial overlap' : 'disjoint keys';
    verdicts.set(verdict, (verdicts.get(verdict) ?? 0) + 1);
    if (verdict === 'disjoint keys' && examples.length < 3) {
      examples.push(`  - \`${item.folder}\`: reference [${[...want].join(', ')}] vs emitted [${[...got].join(', ')}]`);
    }
  }
  return { verdicts: Object.fromEntries(verdicts), examples };
}

// --- main -----------------------------------------------------------------
const args = argsOf(process.argv.slice(2));
const registry = join(root, 'evaluation/registry', args.experiment);
const items = readJsonl(join(registry, 'items/holdout.jsonl'));
const checkpoint = args.checkpoint ?? winnerOf(args.experiment);
const data = slices();

section('Slice definitions');
table([
  ['training split (export minus the D11 slice)', data.training.length, new Set(data.training.map((r) => r.meta.plan)).size, '—'],
  ['validation slice (D11, seed ' + data.slice.seed + ')', data.validation.length,
    new Set(data.validation.map((r) => r.meta.plan)).size, `${data.validationReusedRows} rows on plans that also occur in training`],
  ['holdout', items.length, new Set(items.map((item) => item.plan)).size,
    `${items.filter((item) => data.trainingPlans.has(item.plan)).length} rows on plans that occur in training`],
], ['slice', 'rows', 'distinct plans', 'overlap with the training plans']);
console.log(`\nexport: ${data.exportRows} rows, ${data.exportPlans} distinct plans; training rows per plan: ` +
  Object.entries(data.perPlanBuckets).map(([bucket, count]) => `${count} plans with ${bucket}`).join(', ') +
  `; median ${data.medianRowsPerPlan}.`);

section('Outcome classes');
table([['all', items.length, ...Object.entries(tally(items.map((i) => i.class))).map(([k, v]) => `${k} ${v}`)]],
  ['slice', 'items', 'classes']);
for (const [label, select] of [['by book', (i) => i.book], ['by category', (i) => i.category], ['by plan cluster', (i) => i.plan]]) {
  console.log(`\n${label}:\n`);
  const groups = [...new Set(items.map(select))].sort();
  table(groups.map((group) => {
    const rows = items.filter((item) => select(item) === group);
    const family = rows[0].folder.split('/').slice(-2, -1)[0];
    return [group, family, rows.length, ...Object.entries(tally(rows.map((r) => r.class))).map(([k, v]) => `${k} ${v}`)];
  }), ['key', 'family', 'items', 'classes']);
}

section('Failure taxonomy');
table(Object.entries(tally(items.filter((i) => i.detail).map((i) => i.detail
  .replace(/^.*could not be compiled: /, 'js body does not compile: ')
  .replace(/^.*probe failed: /, 'probe assertion: ')
  .slice(0, 72)))).map(([key, count]) => [count, key]), ['items', 'detail']);

section('Emitted slots versus the reference solution');
const comparison = slotsComparison(items);
table(Object.entries(comparison.verdicts).map(([key, count]) => [key, count]), ['verdict', 'items']);
if (comparison.examples.length) console.log(`\ndisjoint examples:\n${comparison.examples.join('\n')}`);

section('Emitted wire shape');
table(Object.entries(tally(items.map((item) =>
  [...(item.completion ?? '').matchAll(/^@(\w+)\s+(\w+)$/gm)].map((m) => m[2]).join(' + ') || '(no wire)'))),
  ['wires', 'items']);

section('Question: does training on seen plans transfer to unseen plans?');
if (checkpoint !== null) {
  const selectionPath = join(registry, `selection/items/checkpoint-${checkpoint}.jsonl`);
  if (existsSync(selectionPath)) {
    const selection = readJsonl(selectionPath);
    const reused = selection.filter((item) => data.trainingPlans.has(item.plan));
    const disjoint = selection.filter((item) => !data.trainingPlans.has(item.plan));
    const rate = (rows) => `${rows.filter((row) => row.class === 'answer_match').length}/${rows.length}`;
    table([
      ['validation rows on plans that occur in training', reused.length, rate(reused)],
      ['validation rows on plans that occur nowhere else', disjoint.length, rate(disjoint)],
    ], ['subset (checkpoint-' + checkpoint + ')', 'items', 'answer_match']);
    console.log(`\nunseen-plan validation rows by class: ${JSON.stringify(tally(disjoint.map((row) => row.class)))}`);
  }
} else {
  console.log('no selection.md winner found; pass --checkpoint');
}

section('Samples of the dominant classes');
const samples = items.filter((item) => item.class !== 'answer_match');
for (const item of samples.slice(0, args.samples)) {
  console.log(`- \`${item.book}/${item.folder}\` (${item.plan}) class ${item.class}`);
  console.log(`  detail: ${item.detail ?? 'none'}`);
  console.log(`  oracle: ${String(item.oracle).slice(0, 120)}`);
  console.log(`  answer: ${String(item.answer).slice(0, 160)}`);
}
