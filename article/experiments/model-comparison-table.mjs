// All-model comparison (semantic level: exact, or accepted by both blind judges), on identical items:
// untuned small models, fine-tuned small models, and two larger models (Haiku 4.5, Sonnet 5) prompted identically.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../../', import.meta.url));
const registry = resolve(root, 'evaluation/registry');
const dir = resolve(root, 'article/evidence/comparison');
const read = (path) => existsSync(path) ? readFileSync(path, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line)) : [];
const A = new Map(read(resolve(dir, 'judge-A.jsonl')).map((row) => [row.jid, row.verdict]));
const B = new Map(read(resolve(dir, 'judge-B.jsonl')).map((row) => [row.jid, row.verdict]));
const jidOf = (directory, key) => createHash('sha256').update(`${directory}::${key}`).digest('hex').slice(0, 12);
const sampleIds = new Set(read(resolve(registry, 's-prose-coder05/items.jsonl')).map((row) => row.item));
const partOf = (id) => id.startsWith('procedural-arithmetic/') ? (/depletion/.test(id) ? 'withheld' : 'compositions') : 'book';
function score(directory, groupOf, file = 'items.jsonl', filter = () => true) {
  const rows = read(resolve(registry, directory, file)).filter(filter);
  const out = {};
  for (const row of rows) {
    const group = out[groupOf(row)] ??= { n: 0, ok: 0, exact: 0 };
    group.n++;
    const jid = jidOf(directory, `${row.item}#${row.sample ?? 0}`);
    if (row.class === 'answer_match') group.exact++;
    if (row.class === 'answer_match' || (A.get(jid) === 'same' && B.get(jid) === 'same')) group.ok++;
  }
  return out;
}
const f = (g) => g ? `${g.ok}/${g.n}` : '—';
const lines = ['# All-model comparison (semantic level)', ''];
lines.push('## Main comparison: the same 115 held-out problems', '', '| Model | Condition | Held-out compositions | Book types | Withheld type |', '| --- | --- | --- | --- | --- |');
const main = [
  ['0.5B untuned', 'direct', 's-prose-coder05'], ['0.5B untuned', 'JavaScript', 's-js1-coder05'], ['0.5B untuned', 'SOP Lang in prompt', 's-sopicl3-coder05'],
  ['1.5B untuned', 'direct', 's-prose-coder15'], ['1.5B untuned', 'JavaScript', 's-js1-coder15'], ['1.5B untuned', 'SOP Lang in prompt', 's-sopicl3-coder15'],
  ['1.7B untuned', 'direct', 's-prose-qwen3-17'], ['1.7B untuned', 'JavaScript', 's-js1-qwen3-17'], ['1.7B untuned', 'SOP Lang in prompt', 's-sopicl3-qwen3-17'],
  ['0.5B fine-tuned (final data)', 'SOP Lang', 'exp-026-0.5b-qwen2.5coder-dv13', 'holdout'], ['1.5B fine-tuned', 'SOP Lang', 's-ft-exp016'],
  ['1.7B fine-tuned (compact)', 'SOP Lang', 's-ft-exp021'], ['1.7B fine-tuned (final data)', 'SOP Lang', 'exp-027-1.7b-qwen3-dv13', 'holdout'],
  ['Haiku 4.5', 'direct', 'm-haiku-main-direct'], ['Haiku 4.5', 'JavaScript', 'm-haiku-main-js'], ['Haiku 4.5', 'SOP Lang in prompt', 'm-haiku-main-sop'],
  ['Sonnet 5', 'direct', 'm-sonnet-main-direct'], ['Sonnet 5', 'JavaScript', 'm-sonnet-main-js'], ['Sonnet 5', 'SOP Lang in prompt', 'm-sonnet-main-sop']
];
const table = { main: {}, e8: {}, e3: {}, e9: {} };
for (const [model, condition, directory, source] of main) {
  const g = source === 'holdout' ? score(directory, (row) => partOf(row.item), 'items/holdout.jsonl', (row) => sampleIds.has(row.item)) : score(directory, (row) => partOf(row.item));
  table.main[`${model} | ${condition}`] = g;
  lines.push(`| ${model} | ${condition} | ${f(g.compositions)} | ${f(g.book)} | ${f(g.withheld)} |`);
}
lines.push('', '## Abstraction level and wording: 33 held-out compositions, identical instances in both wordings', '', '| Model | Form | Generator wording | Narrative wording |', '| --- | --- | --- | --- |');
for (const [model, prefix, forms] of [['0.5B untuned', 'e8-%-%L-coder05-paired', null], ['1.5B untuned', 'e8-%-%L-coder15-paired', null], ['1.7B untuned', 'e8-%-%L-qwen3-17-paired', null], ['Haiku 4.5', 'm-haiku-e8-%L-%', 'agent'], ['Sonnet 5', 'm-sonnet-e8-%L-%', 'agent']]) {
  for (const [form, small, big] of [['Operator plan', 'ops3', 'ops'], ['Plain JavaScript', 'js1', 'js'], ['SOP Lang, jsEval', 'sopicl3', 'sop']]) {
    const name = (rung) => forms ? prefix.replace('%L', rung).replace('%', big) : prefix.replace('%', small).replace('%L', rung);
    const l0 = score(name('l0'), (row) => row.split), l2 = score(name('l2'), (row) => row.split);
    table.e8[`${model} | ${form}`] = { l0: l0['held-out'], l2: l2['held-out'] };
    lines.push(`| ${model} | ${form} | ${f(l0['held-out'])} | ${f(l2['held-out'])} |`);
  }
}
lines.push('', '## Book problems in their own and in the teaching wording (15 scheduling, 15 coalition; same problems)', '', '| Model | Condition | Scheduling, book | Scheduling, procedural | Coalitions, book | Coalitions, procedural |', '| --- | --- | --- | --- | --- | --- |');
const e3rows = [['1.7B fine-tuned (compact)', 'SOP Lang', 'e3-original-exp021-paired', 'e3-procedural-exp021-paired'], ['1.7B fine-tuned (final data)', 'SOP Lang', 'e3-original-exp027-paired', 'e3-procedural-exp027-paired']];
for (const model of ['haiku', 'sonnet']) for (const [c, label] of [['js', 'JavaScript'], ['sop', 'SOP Lang in prompt']]) e3rows.push([model === 'haiku' ? 'Haiku 4.5' : 'Sonnet 5', label, `m-${model}-e3-original-${c}`, `m-${model}-e3-procedural-${c}`]);
for (const [model, condition, original, procedural] of e3rows) {
  const o = score(original, (row) => row.split), p = score(procedural, (row) => row.split);
  table.e3[`${model} | ${condition}`] = { o, p };
  lines.push(`| ${model} | ${condition} | ${f(o['held-out-scheduling'])} | ${f(p['held-out-scheduling'])} | ${f(o['held-out-coalition'])} | ${f(p['held-out-coalition'])} |`);
}
lines.push('', '## Withheld stock type, all 40 problems', '', '| Model | Condition | Correct |', '| --- | --- | --- |');
for (const [model, condition, directory] of [['1.5B untuned', 'JavaScript', 'e9-js1-coder15'], ['1.7B untuned', 'JavaScript', 'e9-js1-qwen3-17'], ['1.7B fine-tuned (compact)', 'SOP Lang', 'e9-ft-exp021'], ['1.7B fine-tuned (final data)', 'SOP Lang', 'e9-ft-exp027'], ['Haiku 4.5', 'JavaScript', 'm-haiku-e9-js'], ['Haiku 4.5', 'SOP Lang in prompt', 'm-haiku-e9-sop'], ['Sonnet 5', 'JavaScript', 'm-sonnet-e9-js'], ['Sonnet 5', 'SOP Lang in prompt', 'm-sonnet-e9-sop']]) {
  const g = score(directory, () => 'all');
  table.e9[`${model} | ${condition}`] = g.all;
  lines.push(`| ${model} | ${condition} | ${f(g.all)} |`);
}
writeFileSync(resolve(dir, 'model-comparison.md'), lines.join('\n') + '\n');
writeFileSync(resolve(dir, 'model-comparison.json'), JSON.stringify(table, null, 2) + '\n');
console.log(lines.join('\n'));
