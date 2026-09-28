// Reconstruct historical base-model comparisons without generating new outputs.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { answerMatches } from '../../teacher/naming.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = resolve(root, 'article/evidence');
const sources = new Map();
async function read(path, format = 'json') {
  const bytes = await readFile(resolve(root, path));
  sources.set(path, { path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  if (format === 'text') return bytes.toString();
  if (format === 'jsonl') return bytes.toString().trim().split('\n').map(JSON.parse);
  return JSON.parse(bytes);
}
// This preserves the historical diagnostic, including its known semantic limits.
export function historicalContentMatch(completion, printed) {
  if (completion === null || String(completion).trim() === '') return false;
  const numbers = text => [...String(text).matchAll(/-?\d+(?:\.\d+)?/g)].map(match => Number(match[0]));
  const expected = numbers(printed);
  if (expected.length) return expected.every(number => numbers(completion).includes(number));
  const normalized = text => String(text).toLowerCase().replace(/[^a-z0-9]/g, '');
  const core = normalized(printed);
  return core.length > 0 && normalized(completion).includes(core);
}
const definitions = [
  { name: 'Qwen2.5-Coder-0.5B-Instruct', base: 'cmp-base-holdout-prose-05', tuned: 'exp-012-census', identity: 'training/environment/base-model.json', purpose: 'Paired early workflow comparison' },
  { name: 'Qwen2.5-Coder-1.5B-Instruct', base: 'cmp-base-holdout-prose-15', tuned: 'exp-013-1.5b', identity: 'training/environment/base-model-1.5b.json', purpose: 'Paired early workflow comparison' },
  { name: 'Qwen3-1.7B', base: 'cmp-base-holdout-prose-q3', tuned: 'exp-021-1.7b-qwen3-dv7', identity: 'training/environment/base-model-qwen3-17b.json', purpose: 'Incomplete base-output audit; not a model-capacity ranking' }
];
await read('evaluation/run-prose-eval.mjs', 'text');
await read('teacher/naming.mjs', 'text');
const comparisons = [];
for (const definition of definitions) {
  const basePath = `evaluation/registry/${definition.base}`;
  const tunedPath = `evaluation/registry/${definition.tuned}`;
  const baseRows = await read(`${basePath}/items/prose.jsonl`, 'jsonl');
  const tunedRows = await read(`${tunedPath}/items/holdout.jsonl`, 'jsonl');
  const baseManifest = await read(`${basePath}/run-manifest.json`);
  const tunedManifest = await read(`${tunedPath}/run-manifest.json`);
  const metrics = await read(`${tunedPath}/metrics.json`);
  const identity = await read(definition.identity);
  const selection = await read(`${tunedPath}/selection.json`);
  assert.equal(identity.repo, `Qwen/${definition.name}`);
  const keyed = new Map(tunedRows.map(row => [row.item, row]));
  assert.equal(keyed.size, tunedRows.length);
  assert.equal(new Set(baseRows.map(row => `${row.book}/${row.folder}`)).size, baseRows.length);
  assert.equal(baseRows.length, tunedRows.length);
  const decisions = baseRows.map(row => {
    const id = `${row.book}/${row.folder}`, tuned = keyed.get(id);
    assert.ok(tuned, `Missing paired item ${id}`);
    assert.equal(row.printed, tuned.oracle, `Changed oracle ${id}`);
    const baseContent = historicalContentMatch(row.completion, row.printed);
    assert.equal(baseContent, row.matched, `Historical label changed: ${id}`);
    const completed = ['answer_match', 'answer_mismatch'].includes(tuned.class);
    const tunedExact = completed && answerMatches(String(tuned.answer), tuned.oracle);
    assert.equal(tunedExact, tuned.class === 'answer_match');
    return { item: id, expected: row.printed, baseAnswer: row.completion, tunedAnswer: tuned.answer,
      baseError: row.error, baseContent, baseExact: row.completion !== null && answerMatches(row.completion, row.printed),
      tunedContent: completed && historicalContentMatch(tuned.answer, tuned.oracle), tunedExact,
      tunedClass: tuned.class };
  });
  const count = key => decisions.filter(row => row[key]).length;
  const summary = { ...definition, items: decisions.length, commonIdentifiers: decisions.length, changedOracles: 0,
    baseContent: count('baseContent'), baseExact: count('baseExact'), baseMissingCompletions: decisions.filter(row => row.baseAnswer === null).length,
    tunedContent: count('tunedContent'), tunedExact: count('tunedExact'),
    baseManifest, tunedManifest, baseIdentity: identity.repo, revision: identity.revision,
    selectedCheckpoint: selection.winner, trainingFinish: tunedManifest.training ?? null };
  assert.equal(summary.baseContent, baseManifest.matched);
  assert.equal(summary.tunedExact, metrics.classes.answer_match);
  comparisons.push(summary);
  await writeFile(resolve(output, `${definition.base}-paired-diagnostics.jsonl`), decisions.map(row => JSON.stringify(row)).join('\n') + '\n');
}
await writeFile(resolve(output, 'baseline-results.json'), JSON.stringify({
  scope: 'Retrospective paired rescoring; historical answer-content matching is a weak diagnostic, not semantic accuracy.',
  limitations: ['Base answers use a 512-token cap in the retained evaluator source; compiled answers use 2048.',
    'Fine-tuning, prompting, and execution change together; this is not an isolated execution ablation.',
    'Number presence ignores order, roles, units, and contradiction; word containment also permits false positives.',
    'Exact matching penalizes semantically equivalent prose.',
    'Qwen3 base evaluation has 322 missing completions out of 705 and must not support a clean capacity ranking.',
    'Identical identifiers and reference strings do not establish identical missing historical compiled prompt bytes.'],
  comparisons
}, null, 2) + '\n');
await writeFile(resolve(output, 'baseline-source-hashes.json'), JSON.stringify([...sources.values()], null, 2) + '\n');
console.log(JSON.stringify(comparisons.map(({ name, items, baseContent, tunedContent, baseExact, tunedExact, baseMissingCompletions }) =>
  ({ name, items, baseContent, tunedContent, baseExact, tunedExact, baseMissingCompletions })), null, 2));
