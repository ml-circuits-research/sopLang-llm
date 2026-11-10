// Recomputes, from the per-item records and the retained judge verdicts, the figures added to the
// Machine Learning manuscript in response to its review (29 September 2026):
// 1. the rewording test of the 1.7B run restricted to the items the two inventory-era runs share;
// 2. the book-type results of the main comparison split into the two taught shapes and the rest;
// 3. how many SOP Lang programs written from the prompt were rejected before execution;
// 4. whether re-generated book-wording programs (E3) are identical to those of the original held-out
//    evaluation of the same checkpoint, with and without the statement's trailing newline;
// 5. scheduling answers of the 1.7B series that the restricted parser accepts, and correct ones it does not;
// 6. Table 6 of the manuscript (E3 with the statement's trailing newline restored), and the withheld type
//    written in SOP Lang from the prompt by the untuned 1.7B model.
// Usage: node article/experiments/ml-review-checks.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { resolveSlice } from '../../evaluation/slices.mjs';
import { stratifiedSample, valueMatches } from '../../evaluation/run-items.mjs';
import { joinValue } from '../scripts/restricted-comparators.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const registry = resolve(root, 'evaluation/registry');
const out = resolve(root, 'article/evidence/comparison');
const read = (path) => existsSync(path) ? readFileSync(path, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line)) : [];
const verdicts = (letter) => new Map(read(resolve(out, `judge-${letter}.jsonl`)).map((row) => [row.jid, row.verdict]));
const A = verdicts('A'), B = verdicts('B');
const jidOf = (directory, key) => createHash('sha256').update(`${directory}::${key}`).digest('hex').slice(0, 12);
const semantic = (directory, row) => row.class === 'answer_match'
  || (A.get(jidOf(directory, `${row.item}#${row.sample ?? 0}`)) === 'same' && B.get(jidOf(directory, `${row.item}#${row.sample ?? 0}`)) === 'same');
const pct = (k, n) => n ? `${Math.floor((100 * k) / n + 0.5)}%` : '—';
const lines = ['# Checks for the Machine Learning manuscript review (recomputed from records)', ''];

// 1. Rewording, 1.7B run on the items within the inventory-era runs' own inventory.
const late = /(elapsed|path-exists|rectangle-area)/;
lines.push('## 1. Rewording, compact-target 1.7B run, on the 24 + 9 items shared with the inventory-era runs', '', '| Wording | Held-out | Trained controls |', '| --- | --- | --- |');
for (const [rung, name] of [['l0', 'Original'], ['l1', 'Paraphrase'], ['l2', 'Narrative']]) {
  const directory = `e2-${rung}-exp021-paired`;
  const rows = read(resolve(registry, directory, 'items.jsonl')).filter((row) => !late.test(row.item));
  const cell = (split) => { const group = rows.filter((row) => row.split === split); const ok = group.filter((row) => semantic(directory, row)).length; return `${ok}/${group.length} (${pct(ok, group.length)})`; };
  lines.push(`| ${name} | ${cell('held-out')} | ${cell('trained-control')} |`);
}

// 2. Book types of the main comparison: taught shapes against the rest.
const holdout = resolveSlice({ slice: 'holdout' }).items;
const sampleIds = new Set(stratifiedSample(holdout, 5, 20260928).map((item) => item.id));
const shapeOf = (id) => /negotiation-coalitions/.test(id) ? 'coalition' : /dependency-chain-and-join/.test(id) ? 'scheduling' : /^procedural-arithmetic\//.test(id) ? null : 'other';
const conditions = [
  ['0.5B untuned, direct', 's-prose-coder05'], ['0.5B untuned, JavaScript', 's-js1-coder05'], ['0.5B untuned, SOP Lang in prompt', 's-sopicl3-coder05'],
  ['1.5B untuned, direct', 's-prose-coder15'], ['1.5B untuned, JavaScript', 's-js1-coder15'], ['1.5B untuned, SOP Lang in prompt', 's-sopicl3-coder15'],
  ['1.7B untuned, direct', 's-prose-qwen3-17'], ['1.7B untuned, JavaScript', 's-js1-qwen3-17'], ['1.7B untuned, SOP Lang in prompt', 's-sopicl3-qwen3-17'],
  ['0.5B fine-tuned, final data', 'exp-026-0.5b-qwen2.5coder-dv13', 'holdout'], ['1.5B fine-tuned, declarative-command data', 's-ft-exp016'],
  ['1.7B fine-tuned, compact targets', 's-ft-exp021'], ['1.7B fine-tuned, final data', 'exp-027-1.7b-qwen3-dv13', 'holdout']
];
lines.push('', '## 2. Book types of the main comparison (semantic level): taught shapes and the other families', '', '| Condition | Coalition (20) | Scheduling (5) | Other book problems (30) | All book (55) |', '| --- | --- | --- | --- | --- |');
for (const [label, directory, source] of conditions) {
  const rows = source === 'holdout'
    ? read(resolve(registry, directory, 'items/holdout.jsonl')).filter((row) => sampleIds.has(row.item))
    : read(resolve(registry, directory, 'items.jsonl'));
  const count = { coalition: [0, 0], scheduling: [0, 0], other: [0, 0] };
  for (const row of rows) { const shape = shapeOf(row.item); if (!shape) continue; count[shape][1]++; if (semantic(directory, row)) count[shape][0]++; }
  const all = [count.coalition[0] + count.scheduling[0] + count.other[0], count.coalition[1] + count.scheduling[1] + count.other[1]];
  const cell = ([k, n]) => `${k}/${n} (${pct(k, n)})`;
  lines.push(`| ${label} | ${cell(count.coalition)} | ${cell(count.scheduling)} | ${cell(count.other)} | ${cell(all)} |`);
}

// 3. SOP Lang written from the prompt: programs rejected before execution.
lines.push('', '## 3. SOP Lang taught in the prompt (main comparison, 115 problems): outcome classes', '', '| Model | Parse invalid | Graph invalid | Execution error | Answer mismatch | Match |', '| --- | --- | --- | --- | --- | --- |');
for (const [label, directory] of [['0.5B', 's-sopicl3-coder05'], ['1.5B', 's-sopicl3-coder15'], ['1.7B', 's-sopicl3-qwen3-17']]) {
  const rows = read(resolve(registry, directory, 'items.jsonl'));
  const by = (cls) => rows.filter((row) => row.class === cls).length;
  lines.push(`| ${label} | ${by('parse_invalid')} | ${by('graph_invalid')} | ${by('execution_error')} | ${by('answer_mismatch')} | ${by('answer_match')} |`);
}

// 4. Program identity: E3 book-wording re-generations against the original held-out evaluation.
const runs = [['exp017', 'exp-017-qwen3-17b'], ['exp021', 'exp-021-1.7b-qwen3-dv7'], ['exp025', 'exp-025-1.7b-qwen3-dv12'], ['exp027', 'exp-027-1.7b-qwen3-dv13']];
lines.push('', '## 4. Book-wording programs identical to the original held-out evaluation of the same checkpoint', '', 'Statements of the scheduling problems changed after some runs were evaluated, so only coalition problems (whose statements never changed) isolate the prompt bytes.', '', '| Run | Newline removed: coalition | Newline removed: scheduling | Newline restored: coalition | Newline restored: scheduling |', '| --- | --- | --- | --- | --- |');
const programOf = (row) => row.completion ?? row.program ?? row.text ?? null;
for (const [short, run] of runs) {
  const original = new Map(read(resolve(registry, run, 'items/holdout.jsonl')).map((row) => [row.item, programOf(row)]));
  const cell = (directory, pattern) => {
    const rows = read(resolve(registry, directory, 'items.jsonl')).filter((row) => pattern.test(row.item));
    if (!rows.length) return 'not run';
    const same = rows.filter((row) => programOf(row) !== null && programOf(row) === original.get(row.item.replace(/-procedural$/, ''))).length;
    return `${same}/${rows.length}`;
  };
  lines.push(`| ${short} | ${cell(`e3-original-${short}-paired`, /negotiation-coalitions/)} | ${cell(`e3-original-${short}-paired`, /dependency-chain/)} | ${cell(`e3nl-original-${short}`, /negotiation-coalitions/)} | ${cell(`e3nl-original-${short}`, /dependency-chain/)} |`);
}
// 5. Scheduling answers of the six 1.7B runs trained with the shape, in their original evaluations.
lines.push('', '## 5. Held-out scheduling answers (100 per run): accepted by the restricted parser, and right but outside its grammar', '', '| Run | Parser accepts | Right duration and verdict, other wording | Right number, unit "work packages" |', '| --- | --- | --- | --- |');
for (const run of ['exp-021-1.7b-qwen3-dv7', 'exp-022-1.7b-qwen3-dv8', 'exp-023-1.7b-qwen3-dv9', 'exp-024-1.7b-qwen3-dv11', 'exp-025-1.7b-qwen3-dv12', 'exp-027-1.7b-qwen3-dv13']) {
  let parser = 0, wording = 0, unit = 0;
  for (const row of read(resolve(registry, run, 'items/holdout.jsonl')).filter((row) => /dependency-chain-and-join/.test(row.item))) {
    const reference = joinValue(row.oracle), answer = row.answer ?? '';
    if (!reference || !answer) continue;
    if (joinValue(answer) === reference) { parser++; continue; }
    const { minutes, feasible } = JSON.parse(reference);
    const negative = /(not feasible|does not meet|doesn.t meet|exceeds|misses|not meet|is not within|infeasible|no, )/i.test(answer);
    const positive = /(meets the|is feasible|within the limit|meet the limit|yes)/i.test(answer) && !negative;
    if (!(feasible ? positive : negative)) continue;
    if (new RegExp(`\\b${minutes} minutes`).test(answer)) wording++;
    else if (new RegExp(`\\b${minutes} work packages`).test(answer)) unit++;
  }
  lines.push(`| ${run} | ${parser} | ${wording} | ${unit} |`);
}
// 6. E3 with the newline restored (semantic level, exact in parentheses), and E9 in SOP Lang from the prompt.
lines.push('', '## 6. Book problems in both wordings with the trailing newline restored (15 per cell; semantic, exact in parentheses)', '', '| Run | Scheduling, book | Scheduling, template | Coalitions, book | Coalitions, template |', '| --- | --- | --- | --- | --- |');
const cellOf = (directory, split) => {
  const rows = read(resolve(registry, directory, 'items.jsonl')).filter((row) => row.split === split);
  const ok = rows.filter((row) => semantic(directory, row)).length, exact = rows.filter((row) => row.class === 'answer_match').length;
  return `${ok}/${rows.length} ${pct(ok, rows.length)} (${pct(exact, rows.length)})`;
};
for (const run of ['exp017', 'exp021', 'exp025', 'exp027']) {
  lines.push(`| ${run} | ${cellOf(`e3nl-original-${run}`, 'held-out-scheduling')} | ${cellOf(`e3nl-procedural-${run}`, 'held-out-scheduling')} | ${cellOf(`e3nl-original-${run}`, 'held-out-coalition')} | ${cellOf(`e3nl-procedural-${run}`, 'held-out-coalition')} |`);
}
{
  const directory = 'e9-sopicl3-qwen3-17';
  const rows = read(resolve(registry, directory, 'items.jsonl'));
  const by = (cls) => rows.filter((row) => row.class === cls).length;
  const ok = rows.filter((row) => semantic(directory, row)).length;
  const strict = rows.filter((row) => row.class === 'answer_match' || valueMatches(row.oracle, row.answer)).length;
  const noAnswerWire = rows.filter((row) => /Requested wire "answer" does not exist/.test(row.detail ?? '')).length;
  lines.push('', '## 7. Withheld type, untuned 1.7B model writing SOP Lang from the prompt (40 problems)', '', `Semantic ${ok}/40 (${pct(ok, 40)}); strict value ${strict}/40; exact ${by('answer_match')}/40. Classes: graph invalid ${by('graph_invalid')} (of which no wire named answer: ${noAnswerWire}), parse invalid ${by('parse_invalid')}, execution error ${by('execution_error')}, answer mismatch ${by('answer_mismatch')}.`);
}
writeFileSync(resolve(out, 'ml-review-checks.md'), lines.join('\n') + '\n');
console.log(lines.join('\n'));
