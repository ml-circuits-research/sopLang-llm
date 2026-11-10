// Scores the evaluation-only comparison (article/experiments/no-training-plan.md) at three levels:
// exact (the project's comparator), strict value (evaluation/run-items.mjs valueMatches), and
// semantic (two blind judges, read from judge files when present). It also writes the anonymized
// judge inputs for every record that produced an answer but failed the first two levels.
// Usage: node article/experiments/analyze-comparison.mjs [--judge-inputs]
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { resolveSlice } from '../../evaluation/slices.mjs';
import { stratifiedSample, valueMatches } from '../../evaluation/run-items.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const registry = resolve(root, 'evaluation/registry');
const out = resolve(root, 'article/evidence/comparison');
mkdirSync(out, { recursive: true });
const readJsonl = (path) => existsSync(path) ? readFileSync(path, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line)) : [];

// The shared sample of 115 held-out problems, and statements for every item source.
const holdout = resolveSlice({ slice: 'holdout' }).items;
const sample = stratifiedSample(holdout, 5, 20260928);
const sampleIds = new Set(sample.map((item) => item.id));
const statements = new Map(holdout.map((item) => [item.id, item.statement]));
for (const file of ['items-e2/L0.jsonl', 'items-e2/L1.jsonl', 'items-e2/L2.jsonl', 'items-e3/original.jsonl', 'items-e3/procedural.jsonl']) {
  for (const row of readJsonl(resolve(registry, file))) statements.set(row.id ?? `${row.book}/${row.folder}`, row.statement);
}
const heldOutCompositions = new Set(['below-largest-add-rate', 'above-count-double', 'below-total-per-unit-subtract-rate', 'above-largest-add-rate',
  'above-total-modulo', 'above-total-percent-discount', 'above-third-largest-percent', 'keep-below-total-ratio',
  'below-largest-path-exists', 'below-total-elapsed', 'below-largest-rectangle-area']);
const familyOf = (id) => id.split('/').slice(-2, -1)[0];
const partOf = (id) => id.startsWith('procedural-arithmetic/') ? (heldOutCompositions.has(familyOf(id)) ? 'held-out compositions' : 'withheld procedural type') : 'book types';

// Conditions: [label, registry directory, record source].
const conditions = [
  ['0.5B base, direct answer', 's-prose-coder05'], ['1.5B base, direct answer', 's-prose-coder15'], ['1.7B base, direct answer', 's-prose-qwen3-17'],
  ['0.5B base, JavaScript (1 example)', 's-js1-coder05'], ['1.5B base, JavaScript (1 example)', 's-js1-coder15'], ['1.7B base, JavaScript (1 example)', 's-js1-qwen3-17'],
  ['0.5B base, SOP Lang in prompt (3 examples)', 's-sopicl3-coder05'], ['1.5B base, SOP Lang in prompt (3 examples)', 's-sopicl3-coder15'], ['1.7B base, SOP Lang in prompt (3 examples)', 's-sopicl3-qwen3-17'],
  ['0.5B fine-tuned (final data)', 'exp-026-0.5b-qwen2.5coder-dv13', 'holdout'], ['1.5B fine-tuned (declarative-command data)', 's-ft-exp016'],
  ['1.7B fine-tuned (compact targets)', 's-ft-exp021'], ['1.7B fine-tuned (final data)', 'exp-027-1.7b-qwen3-dv13', 'holdout']
];
function recordsOf(directory, source) {
  if (source === 'holdout') {
    return readJsonl(resolve(registry, directory, 'items/holdout.jsonl')).filter((row) => sampleIds.has(row.item))
      .map((row) => ({ item: row.item, class: row.class, answer: row.answer, oracle: row.oracle, completion: row.completion }));
  }
  return readJsonl(resolve(registry, directory, 'items.jsonl'));
}
const answerOf = (row, directory) => row.answer ?? (directory.startsWith('s-prose') ? row.completion : null);

// Judge verdicts, when both judge files exist: accepted only if both judges accept.
const judgeA = new Map(readJsonl(resolve(out, 'judge-A.jsonl')).map((row) => [row.jid, row.verdict]));
const judgeB = new Map(readJsonl(resolve(out, 'judge-B.jsonl')).map((row) => [row.jid, row.verdict]));
const jidOf = (condition, item) => createHash('sha256').update(`${condition}::${item}`).digest('hex').slice(0, 12);

const table = [], judgeInputs = [];
const accepted = (jid) => judgeA.get(jid) === 'same' && judgeB.get(jid) === 'same';
const judged = (jid) => judgeA.has(jid) && judgeB.has(jid);
// Every answered record that is not an exact match goes to the judges, including those the strict
// value check accepts, because that check cannot read free-form verdicts ("placed today: true").
function score(directory, row, part, statement) {
  const answer = answerOf(row, directory);
  part.n++;
  if (answer !== null && answer !== undefined) part.answered++;
  if (row.class === 'answer_match') { part.exact++; part.strict++; part.semantic++; return; }
  if (valueMatches(row.oracle, answer)) part.strict++;
  if (answer === null || answer === undefined) return;
  const jid = jidOf(directory, `${row.item}#${row.sample ?? 0}`);
  if (judged(jid)) { if (accepted(jid)) part.semantic++; } else part.pending++;
  judgeInputs.push({ jid, statement: statement ?? null, reference: row.oracle, candidate: String(answer).slice(0, 1500) });
}
const blank = () => ({ n: 0, answered: 0, exact: 0, strict: 0, semantic: 0, pending: 0 });
for (const [label, directory, source] of conditions) {
  const rows = recordsOf(directory, source);
  if (rows.length === 0) { table.push({ label, directory, available: false }); continue; }
  const parts = {};
  for (const row of rows) score(directory, row, parts[partOf(row.item)] ??= blank(), statements.get(row.item));
  table.push({ label, directory, available: true, records: rows.length, parts });
}
// The experiment directories (E2, E3, E8, E9), grouped by their split.
const experiments = {};
for (const directory of readdirSync(registry).filter((name) => /^(e[2389]-|e3nl-|m-)/.test(name)).sort()) {
  const rows = readJsonl(resolve(registry, directory, 'items.jsonl'));
  if (!rows.length) continue;
  const parts = experiments[directory] = {};
  for (const row of rows) score(directory, row, parts[directory.includes('-main-') ? partOf(row.item) : (row.split ?? 'all')] ??= blank(), statements.get(row.item));
}
writeFileSync(resolve(out, 'comparison.json'), JSON.stringify({ sampleSize: sample.length, table, experiments }, null, 2) + '\n');
if (process.argv.includes('--judge-inputs')) {
  const shuffled = judgeInputs.sort((a, b) => a.jid.localeCompare(b.jid));
  writeFileSync(resolve(out, 'judge-inputs.jsonl'), shuffled.map((row) => JSON.stringify(row)).join('\n') + '\n');
  console.log(`${shuffled.length} judge inputs written`);
}
for (const row of table) {
  if (!row.available) { console.log(`${row.label}: not yet available`); continue; }
  console.log(row.label, Object.entries(row.parts).map(([part, p]) => `${part}: exact ${p.exact}/${p.n}, strict ${p.strict}, semantic ${p.semantic}${p.pending ? ` (+${p.pending} pending)` : ''}`).join(' | '));
}
