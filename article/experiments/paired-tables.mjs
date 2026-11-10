// Paired tables for E2, E3 and E8: identical instances at every wording, semantic level from comparison.json.
// The two inventory-era runs (exp-012, exp-013) were trained before the elapsed, pathExists and
// rectangleArea operations existed, so their rows use only compositions within their own inventory.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../../', import.meta.url));
const dir = resolve(root, 'article/evidence/comparison');
const read = (path) => readFileSync(path, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
const judge = (letter) => new Map(read(resolve(dir, `judge-${letter}.jsonl`)).map((row) => [row.jid, row.verdict]));
const A = judge('A'), B = judge('B');
const jidOf = (directory, key) => createHash('sha256').update(`${directory}::${key}`).digest('hex').slice(0, 12);
const late = /(elapsed|path-exists|rectangle-area)/;
function score(directory, filter = () => true) {
  const rows = read(resolve(root, 'evaluation/registry', directory, 'items.jsonl')).filter(filter);
  const out = {};
  for (const row of rows) {
    const group = out[row.split] ??= { n: 0, exact: 0, semantic: 0 };
    group.n++;
    const jid = jidOf(directory, `${row.item}#${row.sample ?? 0}`);
    const ok = row.class === 'answer_match' || (A.get(jid) === 'same' && B.get(jid) === 'same');
    if (row.class === 'answer_match') group.exact++;
    if (ok) group.semantic++;
  }
  return out;
}
const lines = ['# Paired evaluation-only tables (semantic level, exact in parentheses)', ''];
const fmt = (g) => g ? `${g.semantic}/${g.n} (${g.exact})` : '—';
lines.push('## E2 rewording (3 instances per composition, identical at every wording)', '', '| Run | Wording | Held-out | Trained controls |', '| --- | --- | --- | --- |');
for (const [label, run, restrict] of [['0.5B, extended inventory', 'exp012', true], ['1.5B, extended inventory', 'exp013', true], ['1.7B, compact targets', 'exp021', false]]) {
  for (const [rung, name] of [['l0', 'Original'], ['l1', 'Paraphrase'], ['l2', 'Narrative']]) {
    const g = score(`e2-${rung}-${run}-paired`, (row) => !restrict || !late.test(row.item));
    lines.push(`| ${label} | ${name} | ${fmt(g['held-out'])} | ${fmt(g['trained-control'])} |`);
  }
}
lines.push('', '## E8 abstraction level, untuned models (identical instances in both wordings)', '', '| Model | Form | Original held-out | Original controls | Narrative held-out | Narrative controls |', '| --- | --- | --- | --- | --- | --- |');
for (const [model, label] of [['coder05', '0.5B'], ['coder15', '1.5B'], ['qwen3-17', '1.7B']]) {
  for (const [form, name] of [['ops3', 'Operator plan'], ['js1', 'Plain JavaScript'], ['sopicl3', 'SOP Lang, jsEval']]) {
    const l0 = score(`e8-${form}-l0-${model}-paired`), l2 = score(`e8-${form}-l2-${model}-paired`);
    lines.push(`| ${label} | ${name} | ${fmt(l0['held-out'])} | ${fmt(l0['trained-control'])} | ${fmt(l2['held-out'])} | ${fmt(l2['trained-control'])} |`);
  }
}
lines.push('', '## E3 book problems, both wordings (same 15 scheduling and 15 coalition problems)', '', '| Run | Scheduling, book | Scheduling, procedural | Coalitions, book | Coalitions, procedural |', '| --- | --- | --- | --- | --- |');
for (const run of ['exp017', 'exp021', 'exp025', 'exp027']) {
  const o = score(`e3-original-${run}-paired`), p = score(`e3-procedural-${run}-paired`);
  lines.push(`| ${run} | ${fmt(o['held-out-scheduling'])} | ${fmt(p['held-out-scheduling'])} | ${fmt(o['held-out-coalition'])} | ${fmt(p['held-out-coalition'])} |`);
}
writeFileSync(resolve(dir, 'paired-tables.md'), lines.join('\n') + '\n');
console.log(lines.join('\n'));
