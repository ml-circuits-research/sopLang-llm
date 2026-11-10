// Builds oracle-free prompt files for evaluating larger models through agent sessions. Every item carries
// exactly the chat messages the small models received in the same condition (evaluation/run-items.mjs).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { messagesFor, stratifiedSample } from '../../evaluation/run-items.mjs';
import { resolveSlice } from '../../evaluation/slices.mjs';
const registry = fileURLToPath(new URL('../../evaluation/registry/', import.meta.url));
const out = resolve(registry, 'agent-models');
mkdirSync(out, { recursive: true });
const read = (path) => readFileSync(resolve(registry, path), 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line)).map((row) => ({ ...row, id: row.id ?? `${row.book}/${row.folder}` }));
const sets = {
  main: stratifiedSample(resolveSlice({ slice: 'holdout' }).items, 5, 20260928),
  'e8-l0': read('items-e2/paired/L0.jsonl'), 'e8-l2': read('items-e2/paired/L2.jsonl'),
  'e3-original': read('items-e3/paired/original.jsonl'), 'e3-procedural': read('items-e3/paired/procedural.jsonl'),
  e9: read('items-e9/depletion.jsonl')
};
const conditions = { direct: ['prose', 0], js: ['js', 1], sop: ['sop-icl', 3], ops: ['ops', 3] };
// Agent batches: which (set, condition) pairs each batch answers.
// Each batch holds at most one wording of any problem, so an agent cannot carry an answer from one
// wording to another (the first design mixed wordings in one batch, which invalidated wording comparisons).
const batches = {
  d1: [['main', 'direct']],
  d2: [['main', 'js']],
  b2: [['main', 'sop']],
  c1: [['e8-l0', 'ops'], ['e8-l0', 'js']],
  c2: [['e8-l2', 'ops'], ['e8-l2', 'js']],
  c3: [['e8-l0', 'sop'], ['e9', 'js']],
  c4: [['e8-l2', 'sop'], ['e9', 'sop']],
  c5: [['e3-original', 'js'], ['e3-original', 'sop']],
  c6: [['e3-procedural', 'js'], ['e3-procedural', 'sop']]
};
const index = {};
for (const [batch, pairs] of Object.entries(batches)) {
  const templates = {}, items = [];
  for (const [set, condition] of pairs) {
    const [mode, shots] = conditions[condition];
    templates[condition] ??= messagesFor(mode, shots, '{{STATEMENT}}');
    for (const item of sets[set]) {
      const key = `${set}|${condition}|${item.id}`;
      items.push({ key, condition, statement: item.statement });
      index[key] = { set, condition, mode, item: item.id, oracle: item.oracle, split: item.split ?? null, composition: item.composition ?? null, book: item.book ?? null };
    }
  }
  writeFileSync(resolve(out, `prompts-${batch}.json`), JSON.stringify({ templates, items }, null, 1) + '\n');
  console.log(batch, items.length, Object.keys(templates).join(','));
}
// The index (with oracles) stays outside the directory the agents are told to read.
writeFileSync(resolve(registry, 'agent-models-index.json'), JSON.stringify(index));
