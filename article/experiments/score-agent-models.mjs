// Executes and scores the replies of the larger models (agent sessions) exactly as run-items.mjs scores
// the small models: same extraction, same sandbox, same comparator. Writes per-condition record files
// evaluation/registry/m-<model>-<set>-<condition>/items.jsonl, which analyze-comparison.mjs picks up.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { classify, valueMatches } from '../../evaluation/run-items.mjs';
import { createRuntime } from '../../runtime/kernel.mjs';
const registry = fileURLToPath(new URL('../../evaluation/registry/', import.meta.url));
const index = JSON.parse(readFileSync(resolve(registry, 'agent-models-index.json'), 'utf8'));
const runtime = createRuntime();
const groups = {};
const coverage = {};
for (const file of readdirSync(resolve(registry, 'agent-models')).filter((name) => /^answers-[a-z]+-(b2|c[1-6]|d[12])\.jsonl$/.test(name))) {
  const model = file.split('-')[1];
  const seen = new Set();
  for (const line of readFileSync(resolve(registry, 'agent-models', file), 'utf8').split('\n').filter(Boolean)) {
    let row; try { row = JSON.parse(line); } catch { continue; }
    const meta = index[row.key];
    if (!meta || seen.has(row.key)) continue;
    seen.add(row.key);
    const verdict = await classify(meta.mode, typeof row.reply === 'string' && row.reply.trim() ? row.reply : null, meta.oracle, runtime);
    const answer = verdict.answer ?? (meta.mode === 'prose' ? row.reply : null);
    (groups[`m-${model}-${meta.set}-${meta.condition}`] ??= []).push({ item: meta.item, sample: 0, split: meta.split, book: meta.book,
      composition: meta.composition, oracle: meta.oracle, class: verdict.className, detail: verdict.detail ?? null, answer,
      valueMatch: valueMatches(meta.oracle, answer), completion: row.reply });
  }
  coverage[file] = seen.size;
}
for (const [directory, rows] of Object.entries(groups)) {
  mkdirSync(resolve(registry, directory), { recursive: true });
  writeFileSync(resolve(registry, directory, 'items.jsonl'), rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
  writeFileSync(resolve(registry, directory, 'run-manifest.json'), JSON.stringify({ experiment: directory,
    model: directory.split('-')[1], via: 'Claude Code agent session (model alias), same messages as evaluation/run-items.mjs', scoredAt: new Date().toISOString() }, null, 2) + '\n');
}
console.log(JSON.stringify(coverage), Object.keys(groups).length, 'record sets');
