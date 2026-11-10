// Re-executes every saved generated program of the held-out evaluations through the current
// evaluation classifier (extraction, parse, graph validation, runtime execution, answer comparison)
// and compares each re-derived class and answer with the recorded one. No model inference is run.
// Usage: node article/scripts/reexecute-evaluations.mjs [--arms exp-014,exp-016,...]
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { classifyItem } from '../../evaluation/run-eval.mjs';
import { createRuntime } from '../../runtime/kernel.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const registry = resolve(root, 'evaluation/registry');
const flag = process.argv.indexOf('--arms');
const requested = flag > 0 ? process.argv[flag + 1].split(',') : null;
const arms = (await readdir(registry)).filter(name => /^exp-\d{3}/.test(name) && existsSync(resolve(registry, name, 'items/holdout.jsonl')))
  .filter(name => !requested || requested.some(prefix => name.startsWith(prefix))).sort();

const runtime = createRuntime();
const summary = [];
const disagreements = [];
for (const arm of arms) {
  const rows = (await readFile(resolve(registry, arm, 'items/holdout.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line));
  const counts = { items: rows.length, sameClass: 0, sameAnswer: 0, transitions: {} };
  for (const row of rows) {
    const verdict = await classifyItem({ completion: row.completion, oracle: row.oracle, runtime });
    const answer = verdict.answer ?? null;
    const recordedAnswer = row.answer ?? null;
    if (verdict.className === row.class) counts.sameClass++;
    if (answer === recordedAnswer) counts.sameAnswer++;
    if (verdict.className !== row.class || answer !== recordedAnswer) {
      const key = `${row.class} -> ${verdict.className}`;
      counts.transitions[key] = (counts.transitions[key] ?? 0) + 1;
      disagreements.push({ arm, item: row.item, recordedClass: row.class, reexecutedClass: verdict.className,
        recordedAnswer, reexecutedAnswer: answer, recordedDetail: row.detail ?? null, reexecutedDetail: verdict.detail ?? null });
    }
  }
  summary.push({ arm, ...counts });
  console.log(`${arm}: ${counts.sameClass}/${counts.items} classes, ${counts.sameAnswer}/${counts.items} answers identical`, JSON.stringify(counts.transitions));
}
const out = resolve(root, 'article/evidence');
await writeFile(resolve(out, 'reexecution-summary.json'), JSON.stringify({ generated: new Date().toISOString(),
  note: 'Current runtime and classifier re-applied to every saved completion; no inference.', arms: summary }, null, 2) + '\n');
await writeFile(resolve(out, 'reexecution-disagreements.jsonl'), disagreements.map(row => JSON.stringify(row)).join('\n') + (disagreements.length ? '\n' : ''));
const total = summary.reduce((sum, arm) => sum + arm.items, 0), same = summary.reduce((sum, arm) => sum + arm.sameClass, 0);
console.log(`total: ${same}/${total} classes reproduced; ${disagreements.length} records differ in class or answer`);
