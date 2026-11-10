// Which output sentence the scheduling programs printed after the scheduling references were rewritten into a
// value-bearing form (Informatica, Section 5.5). Reads evaluation/registry/<run>/items/holdout.jsonl and the
// retrospective restricted-parser decisions in article/evidence/<run>-decompose-to-solve-restricted.jsonl, and the
// training programs at the commits whose SHA-256 equals each run's recorded dataset_sha256.
// Usage: node article/scripts/scheduling-output-forms.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (path) => readFileSync(path, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
const SCHEDULING = /dependency-chain-and-join/;
const NEW_FORM = /^\s*\d+(\.\d+)? minutes: (not )?feasible\.?\s*$/i; // "46 minutes: not feasible"
// The procedural scheduling type (dependency-chain-join) prints, in every data version,
// "The earliest safe completion time is N minutes, so the plan is (not) feasible. The critical insight is ...".
const PROCEDURAL_FRAME = /^The earliest safe completion time is [^,]*, (so|and) the plan /i;
const PROCEDURAL_VERDICT = /so the plan is (not )?feasible/i;
const QUESTION_ECHO = /the plan (meets|does not meet) the /i; // the book statement asks "does the plan meet the limit?"
const SENTENCE_VARIANT = /earliest safe completion time is \d+/i;

const runs = [
  ['exp-021-1.7b-qwen3-dv7', 'compact targets, prose references (before the rewrite)'],
  ['exp-024-1.7b-qwen3-dv11', '1.7B, value-bearing references'],
  ['exp-025-1.7b-qwen3-dv12', '1.7B, simplified statements'],
  ['exp-027-1.7b-qwen3-dv13', '1.7B, final data'],
  ['exp-026-0.5b-qwen2.5coder-dv13', '0.5B, final data']
];
const totals = { ran: 0, newForm: 0, proceduralFrame: 0, proceduralVerdict: 0, questionEcho: 0, sentenceVariant: 0 };
for (const [run, label] of runs) {
  const rows = read(resolve(root, 'evaluation/registry', run, 'items/holdout.jsonl')).filter((row) => SCHEDULING.test(row.folder));
  const ran = rows.filter((row) => row.class !== 'execution_error');
  const oracleForms = [...new Set(rows.map((row) => row.oracle.replace(/\d+/g, 'N')))];
  const count = (pattern) => ran.filter((row) => pattern.test(row.answer ?? '')).length;
  const restrictedPath = resolve(root, 'article/evidence', `${run}-decompose-to-solve-restricted.jsonl`);
  const restricted = existsSync(restrictedPath) ? read(restrictedPath) : [];
  const verdicts = {};
  for (const row of restricted) verdicts[row.restricted ?? row.verdict ?? row.status ?? 'unknown'] = (verdicts[row.restricted ?? row.verdict ?? row.status ?? 'unknown'] ?? 0) + 1;
  const result = { programs: rows.length, ran: ran.length, exact: rows.filter((row) => row.class === 'answer_match').length,
    newForm: count(NEW_FORM), proceduralFrame: count(PROCEDURAL_FRAME), proceduralVerdict: count(PROCEDURAL_VERDICT), questionEcho: count(QUESTION_ECHO), sentenceVariant: count(SENTENCE_VARIANT) };
  console.log(`${run} (${label}): ${JSON.stringify(result)}`);
  console.log(`  reference forms: ${oracleForms.slice(0, 3).join(' | ')}`);
  console.log(`  restricted-parser decisions: ${JSON.stringify(verdicts)}`);
  if (run !== 'exp-021-1.7b-qwen3-dv7') for (const key of Object.keys(totals)) totals[key] += result[key];
}
console.log(`Four runs after the rewrite: ${JSON.stringify(totals)}`);

// What the training programs taught about this output: programs printing the value-bearing form, and the return
// statement of the procedural type that teaches the scheduling solution shape (dependency-chain-join).
for (const [label, commit] of [['dv7', '9aba95b08'], ['dv11', 'e230b2146'], ['dv12', 'e494ddbf5'], ['dv13', 'df3602594']]) {
  const rows = execFileSync('git', ['show', `${commit}:training/data/all-books.jsonl`], { cwd: root, maxBuffer: 1 << 30, encoding: 'utf8' })
    .split('\n').filter(Boolean).map((line) => JSON.parse(line));
  const program = (row) => row.messages.find((message) => message.role === 'assistant').content;
  const newForm = rows.filter((row) => /" minutes: " \+ \(/.test(program(row)));
  const newFormTypes = [...new Set(newForm.map((row) => `${row.meta.book}/${row.meta.type}`))];
  const procedural = rows.filter((row) => row.meta.type === 'dependency-chain-join');
  const returns = [...new Set(procedural.map((row) => (program(row).match(/return [^\n]*/g) ?? []).pop()))];
  console.log(`${label} @ ${commit}: training programs printing "N minutes: (not) feasible." ${newForm.length} (${newFormTypes.join(', ') || 'none'}); procedural scheduling type ${procedural.length} programs, return: ${returns.join(' | ').slice(0, 220)}`);
}
