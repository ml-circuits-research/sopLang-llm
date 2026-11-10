// Summarizes the evaluation-only experiments E2, E3, E8 and E9 from their per-item records.
// Levels: exact (the project's comparator) and strict value (evaluation/run-items.mjs valueMatches);
// the semantic level is added by analyze-comparison.mjs once the judge files exist.
// Usage: node article/experiments/summarize-experiments.mjs
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { valueMatches } from '../../evaluation/run-items.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const registry = resolve(root, 'evaluation/registry');
const out = resolve(root, 'article/evidence/comparison');
mkdirSync(out, { recursive: true });
const rowsOf = (dir) => {
  const file = resolve(registry, dir, 'items.jsonl');
  return existsSync(file) ? readFileSync(file, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line)) : [];
};
const tally = (rows, keyOf) => {
  const groups = {};
  for (const row of rows) {
    const group = groups[keyOf(row)] ??= { n: 0, exact: 0, strict: 0, executed: 0 };
    group.n++;
    if (row.class === 'answer_match') group.exact++;
    if (row.class === 'answer_match' || valueMatches(row.oracle, row.answer)) group.strict++;
    if (row.class === 'answer_match' || row.class === 'answer_mismatch') group.executed++;
  }
  return groups;
};
const cell = (g) => g ? `${g.strict}/${g.n} (exact ${g.exact}, ran ${g.executed})` : '—';
const lines = ['# Evaluation-only experiments: strict-value results', '', `Generated ${new Date().toISOString()} from evaluation/registry/<experiment>/items.jsonl. Each cell: strict-value correct / items (exact matches, programs that ran).`, ''];
const dirs = readdirSync(registry).filter((name) => /^e[2389]-/.test(name) && existsSync(resolve(registry, name, 'items.jsonl'))).sort();
const summary = {};
for (const family of ['e2', 'e3', 'e8', 'e9']) {
  const members = dirs.filter((dir) => dir.startsWith(family + '-'));
  if (!members.length) continue;
  lines.push(`## ${family.toUpperCase()}`, '');
  const keyOf = family === 'e3' ? (row) => `${row.split}` : family === 'e9' ? () => 'withheld type' : (row) => `${row.split}`;
  const columns = new Set();
  const table = {};
  for (const dir of members) { table[dir] = tally(rowsOf(dir), keyOf); Object.keys(table[dir]).forEach((key) => columns.add(key)); }
  const cols = [...columns].sort();
  lines.push(`| Run | ${cols.join(' | ')} |`, `| --- | ${cols.map(() => '---').join(' | ')} |`);
  for (const dir of members) lines.push(`| ${dir} | ${cols.map((col) => cell(table[dir][col])).join(' | ')} |`);
  lines.push('');
  summary[family] = table;
}
writeFileSync(resolve(out, 'experiments.md'), lines.join('\n') + '\n');
writeFileSync(resolve(out, 'experiments.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(lines.join('\n'));
