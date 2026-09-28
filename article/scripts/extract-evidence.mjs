// Rebuild manuscript evidence from archived records without training or inference.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, relative } from 'node:path';
import assert from 'node:assert/strict';
import { coalitionValue, joinValue } from './restricted-comparators.mjs';
import { answerMatches } from '../../teacher/naming.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const out = resolve(root, 'article/evidence');
const ids = [
  'exp-017-qwen3-17b', 'exp-021-1.7b-qwen3-dv7',
  'exp-022-1.7b-qwen3-dv8', 'exp-023-1.7b-qwen3-dv9',
  'exp-024-1.7b-qwen3-dv11', 'exp-025-1.7b-qwen3-dv12',
  'exp-026-0.5b-qwen2.5coder-dv13', 'exp-027-1.7b-qwen3-dv13',
  'exp-014-deep-chains', 'exp-016-wires'
];
const provenance = [];
async function source(path, json = true) {
  const bytes = await readFile(resolve(root, path));
  provenance.push({ path, bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex') });
  return json ? JSON.parse(bytes) : bytes.toString('utf8');
}
async function jsonl(path) {
  return (await source(path, false)).trim().split('\n').map(JSON.parse);
}
function count(rows) {
  const classes = Object.fromEntries(['generation_transport_error',
    'wrapper_rejected', 'parse_invalid', 'graph_invalid', 'execution_error',
    'answer_mismatch', 'answer_match'].map(key => [key, 0]));
  for (const row of rows) {
    assert.ok(row.class in classes, `Unknown outcome: ${row.class}`);
    classes[row.class]++;
  }
  return { items: rows.length, classes,
    completed: classes.answer_match + classes.answer_mismatch,
    exactPercent: 100 * classes.answer_match / rows.length,
    plans: new Set(rows.map(row => row.plan)).size };
}

function diagnostic(rows, book, parser) {
  return rows.filter(row => row.book === book).map(row => {
    const expected = parser(row.oracle);
    const actual = parser(row.answer);
    const completed = ['answer_match', 'answer_mismatch'].includes(row.class);
    return { item: row.item, originalClass: row.class, oracle: row.oracle,
      answer: row.answer, expected, actual,
      verdict: !completed ? 'execution_failure' : expected === null || actual === null
        ? 'outside_grammar' : actual === expected ? 'restricted_match' : 'restricted_mismatch' };
  });
}
function paired(a, b) {
  const bMap = new Map(b.map(row => [row.item, row]));
  const result = { common: 0, onlyLeftIds: 0, onlyRightIds: 0,
    changedOracles: 0, changedPlans: 0, bothMatch: 0,
    leftOnlyMatch: 0, rightOnlyMatch: 0, neitherMatch: 0, byBook: {} };
  for (const row of a) {
    const other = bMap.get(row.item);
    if (!other) { result.onlyLeftIds++; continue; }
    result.common++;
    result.changedOracles += row.oracle !== other.oracle;
    result.changedPlans += row.plan !== other.plan;
    const left = row.class === 'answer_match', right = other.class === 'answer_match';
    const cell = left ? right ? 'bothMatch' : 'leftOnlyMatch'
      : right ? 'rightOnlyMatch' : 'neitherMatch';
    result[cell]++;
    const group = result.byBook[row.book] ??= { n: 0, leftOnly: 0, rightOnly: 0 };
    group.n++;
    group.leftOnly += left && !right;
    group.rightOnly += right && !left;
  }
  result.onlyRightIds = b.length - result.common;
  return result;
}
await mkdir(out, { recursive: true });
const arms = [], raw = new Map();
for (const id of ids) {
  const basePath = `evaluation/registry/${id}`;
  const rows = await jsonl(`${basePath}/items/holdout.jsonl`);
  assert.equal(rows.length, 705);
  assert.equal(new Set(rows.map(row => row.item)).size, rows.length);
  raw.set(id, rows);
  const evaluation = await source(`${basePath}/run-manifest.json`);
  let training;
  try { training = await source(`training/checkpoints/${id}/run-manifest.json`); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const base = await source(relative(root, evaluation.base_model_manifest.path));
    training = { base_model_manifest: { content: base },
      base_model_revision: base.revision, finished_utc: evaluation.training?.finishedUtc,
      dataset_snapshot: evaluation.dataset.snapshot, manifestMissing: true };
  }
  const metrics = await source(`${basePath}/metrics.json`);
  const selection = await source(`${basePath}/selection.json`);
  const counts = count(rows);
  assert.deepEqual(counts.classes, metrics.classes);
  const comparisonDiscrepancies = rows.filter(row =>
    ['answer_match', 'answer_mismatch'].includes(row.class) &&
    (row.class === 'answer_match') !== answerMatches(row.oracle, row.answer));
  const books = Object.fromEntries([...new Set(rows.map(row => row.book))]
    .map(book => [book, count(rows.filter(row => row.book === book))]));
  const commandUsage = Object.fromEntries(Object.keys(books).map(book => {
    const subset = rows.filter(row => row.book === book);
    return [book, { items: subset.length,
      withContainerDeclaration: subset.filter(row =>
        /^@[\w]+ container(?:Add|Upsert|Remove|Filter)?\s*$/m.test(row.completion)).length,
      withSpecializedDeclaration: subset.filter(row =>
        /^@[\w]+ (?:graphPath|aggregate|fraction)\s*$/m.test(row.completion)).length,
      withJsEval: subset.filter(row => /^@[\w]+ jsEval\s*$/m.test(row.completion)).length }];
  }));
  arms.push({ id, ...counts, books, commandUsage,
    comparatorDiscrepancies: comparisonDiscrepancies.length,
    base: training.base_model_manifest?.content?.repo,
    trainingManifestMissing: training.manifestMissing ?? false,
    finishApproximate: evaluation.training?.finishedUtcApprox ?? false,
    revision: training.base_model_revision, dataVersion: evaluation.dataset.dataVersion,
    finish: training.finished_utc, seed: training.seed,
    trainExamples: training.train_examples, targetTokensSeen: training.target_tokens_seen,
    steps: training.steps_completed, learningRate: training.learning_rate,
    epochs: training.epochs, maxSequenceLength: training.max_seq_len,
    effectiveBatch: training.effective_batch_size, precision: training.precision,
    optimizer: training.optimizer, selection: selection.winner,
    sliceHash: evaluation.slice.itemsSha256,
    trainSnapshot: training.dataset_snapshot,
    environment: training.trainer_stack });
}
const comparisons = [
  [ids[1], ids[0]], [ids[1], ids[2]], [ids[1], ids[7]], [ids[6], ids[7]],
  [ids[9], ids[8]]
].map(([left, right]) => ({ left, right, ...paired(raw.get(left), raw.get(right)) }));
const diagnostics = [];
for (const id of ids) {
  for (const [book, parser] of [['world-as-a-system', coalitionValue],
    ['decompose-to-solve', joinValue]]) {
    const records = diagnostic(raw.get(id), book, parser);
    const counts = {};
    for (const row of records) counts[row.verdict] = (counts[row.verdict] ?? 0) + 1;
    const name = `${id}-${book}-restricted.jsonl`;
    await writeFile(resolve(out, name), records.map(row => JSON.stringify(row)).join('\n') + '\n');
    diagnostics.push({ id, book, items: records.length, counts, file: name });
  }
}
const judgeInputs = [];
for (let index = 0; index < 4; index++) {
  judgeInputs.push(...await jsonl(`evaluation/registry/agent-eval/judge-slice-${index}.jsonl`));
}
const historicalJudges = { items: judgeInputs.length,
  uniqueKeys: new Set(judgeInputs.map(row => row.key)).size,
  fields: [...new Set(judgeInputs.flatMap(Object.keys))],
  conclusion: 'Archived shards contain inputs only. Individual verdicts are absent.' };
const result = { auditDate: '2026-09-28', recordCount: arms.length * 705,
  design: 'Retrospective descriptive audit; no new training or neural judgment.',
  arms, comparisons, diagnostics, historicalJudges,
  limitations: [
    'One training seed per arm; item-level counts are not independent training replications.',
    'The benchmark was repeatedly inspected and changed during development.',
    'Historical item records do not include full statements; identical IDs do not prove identical prompts.',
    'Restricted parsers are retrospective diagnostics, not a general semantic scorer.',
    'The official Qwen3-1.7B name is used; the legacy parameter-count field is not independently certified.'
  ] };
await writeFile(resolve(out, 'results.json'), JSON.stringify(result, null, 2) + '\n');
await writeFile(resolve(out, 'source-hashes.json'), JSON.stringify(provenance, null, 2) + '\n');
const header = 'experiment,base,data_version,training_finished,items,exact_match,execution_error,answer_mismatch,completed\n';
await writeFile(resolve(out, 'results.csv'), header + arms.map(arm =>
  [arm.id, arm.base, arm.dataVersion.number, arm.finish, arm.items,
    arm.classes.answer_match, arm.classes.execution_error,
    arm.classes.answer_mismatch, arm.completed].join(',')).join('\n') + '\n');
console.log(JSON.stringify({ output: relative(root, out), records: result.recordCount,
  counts: arms.map(arm => ({ id: arm.id, exact: arm.classes.answer_match,
    comparatorDiscrepancies: arm.comparatorDiscrepancies,
    coalitionContainers: arm.commandUsage['world-as-a-system'].withContainerDeclaration })),
  diagnostics: diagnostics.filter(row => [ids[1], ids[7]].includes(row.id)),
  comparisons, historicalJudges }, null, 2));
