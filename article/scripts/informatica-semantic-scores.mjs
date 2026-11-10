// Recomputes, read-only, the semantic-level results the Informatica manuscript reports from the evaluation-only
// comparisons: the abstraction table (Table 3), the fine-tuned reference row, the 115-problem sample, and the judge
// statistics (agreement, calibration items per judging pass, agreement on the larger models' answers).
// Semantic = exact, or accepted by both judges. Judge verdicts: article/evidence/comparison/judge-{A,B}[-n].jsonl.
// Usage: node article/scripts/informatica-semantic-scores.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { joinValue, coalitionValue } from './restricted-comparators.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (path) => readFileSync(resolve(root, path), 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
const comparison = 'article/evidence/comparison';
const A = new Map(read(`${comparison}/judge-A.jsonl`).map((row) => [row.jid, row.verdict]));
const B = new Map(read(`${comparison}/judge-B.jsonl`).map((row) => [row.jid, row.verdict]));
const jidOf = (directory, row) => createHash('sha256').update(`${directory}::${row.item}#${row.sample ?? 0}`).digest('hex').slice(0, 12);
const pct = (count, n) => `${Math.floor((100 * count) / n + 0.5)}%`;
function score(directory, { file = 'items.jsonl', filter = () => true, group = () => 'all' } = {}) {
  const out = {};
  for (const row of read(`evaluation/registry/${directory}/${file}`).filter(filter)) {
    const g = out[group(row)] ??= { n: 0, solved: 0, exact: 0 };
    g.n++;
    if (row.class === 'answer_match') g.exact++;
    const jid = jidOf(directory, row);
    if (row.class === 'answer_match' || (A.get(jid) === 'same' && B.get(jid) === 'same')) g.solved++;
  }
  return out;
}
const cell = (g) => `${g.solved}/${g.n} = ${pct(g.solved, g.n)} (exact ${g.exact} = ${pct(g.exact, g.n)})`;

console.log('== Abstraction comparison, 33 held-out compositions per cell');
const small = [['coder05', 'Qwen2.5-Coder 0.5B'], ['coder15', 'Qwen2.5-Coder 1.5B'], ['qwen3-17', 'Qwen3 1.7B']];
for (const [model, label] of small) for (const [form, name] of [['ops3', 'operator plan'], ['js1', 'plain JavaScript'], ['sopicl3', 'SOP Lang, jsEval']]) {
  const [l0, l2] = ['l0', 'l2'].map((rung) => score(`e8-${form}-${rung}-${model}-paired`, { filter: (row) => row.split === 'held-out' }).all);
  console.log(`  ${label}, ${name}: generator ${cell(l0)}; narrative ${cell(l2)}`);
}
for (const [model, label] of [['haiku', 'Claude Haiku 4.5'], ['sonnet', 'Claude Sonnet 5']]) for (const [form, name] of [['ops', 'operator plan'], ['js', 'plain JavaScript'], ['sop', 'SOP Lang, jsEval']]) {
  const [l0, l2] = ['l0', 'l2'].map((rung) => score(`m-${model}-e8-${rung}-${form}`, { filter: (row) => row.split === 'held-out' }).all);
  console.log(`  ${label}, ${name}: generator ${cell(l0)}; narrative ${cell(l2)}`);
}
const [ft0, ft2] = ['l0', 'l2'].map((rung) => score(`e2-${rung}-exp021-paired`, { filter: (row) => row.split === 'held-out' }).all);
console.log(`  Qwen3 1.7B fine-tuned on compact targets (SOP Lang): generator ${cell(ft0)}; narrative ${cell(ft2)}`);
console.log('  Trained-composition controls (12 per cell):');
for (const [model, label] of small) for (const [form, name] of [['ops3', 'operator plan'], ['js1', 'plain JavaScript'], ['sopicl3', 'SOP Lang']]) {
  const [l0, l2] = ['l0', 'l2'].map((rung) => score(`e8-${form}-${rung}-${model}-paired`, { filter: (row) => row.split === 'trained-control' }).all);
  console.log(`    ${label}, ${name}: generator ${l0.solved}/${l0.n}; narrative ${l2.solved}/${l2.n}`);
}

console.log('\n== The 115-problem sample (55 held-out compositions, 55 book problems, 5 withheld-type problems)');
const sampleIds = new Set(read('evaluation/registry/s-prose-coder05/items.jsonl').map((row) => row.item));
const part = (row) => row.item.startsWith('procedural-arithmetic/') ? (/depletion/.test(row.item) ? 'withheld' : 'compositions') : 'book';
const main = [
  ['0.5B untuned, plain JavaScript', 's-js1-coder05'], ['1.5B untuned, plain JavaScript', 's-js1-coder15'], ['1.7B untuned, plain JavaScript', 's-js1-qwen3-17'],
  ['0.5B untuned, SOP Lang in prompt', 's-sopicl3-coder05'], ['1.5B untuned, SOP Lang in prompt', 's-sopicl3-coder15'], ['1.7B untuned, SOP Lang in prompt', 's-sopicl3-qwen3-17'],
  ['0.5B fine-tuned, final data', 'exp-026-0.5b-qwen2.5coder-dv13', 'items/holdout.jsonl'], ['1.5B fine-tuned, declarative-command data', 's-ft-exp016'],
  ['1.7B fine-tuned, compact targets', 's-ft-exp021'], ['1.7B fine-tuned, final data', 'exp-027-1.7b-qwen3-dv13', 'items/holdout.jsonl'],
  ['Haiku 4.5, plain JavaScript', 'm-haiku-main-js'], ['Haiku 4.5, SOP Lang in prompt', 'm-haiku-main-sop'], ['Sonnet 5, plain JavaScript', 'm-sonnet-main-js'], ['Sonnet 5, SOP Lang in prompt', 'm-sonnet-main-sop']
];
for (const [label, directory, file] of main) {
  const g = score(directory, { file, filter: (row) => sampleIds.has(row.item), group: part });
  console.log(`  ${label.padEnd(42)} compositions ${cell(g.compositions)}; book ${cell(g.book)}; withheld ${g.withheld.solved}/${g.withheld.n}`);
}

console.log('\n== Withheld stock-and-lead-time type, all 40 problems (outside the operator catalogue)');
for (const [label, directory] of [['1.5B untuned, plain JavaScript', 'e9-js1-coder15'], ['1.7B untuned, plain JavaScript', 'e9-js1-qwen3-17'],
  ['1.7B fine-tuned, compact targets', 'e9-ft-exp021'], ['1.7B fine-tuned, final data', 'e9-ft-exp027']]) {
  console.log(`  ${label.padEnd(34)} ${cell(score(directory).all)}`);
}

console.log('\n== Judges');
const passes = readdirSync(resolve(root, comparison)).map((name) => /^judge-pairs-(\d+)\.jsonl$/.exec(name)?.[1]).filter(Boolean).map(Number).sort((a, b) => a - b);
const pairs = new Map(passes.flatMap((n) => read(`${comparison}/judge-pairs-${n}.jsonl`).map((row) => [row.pid, { ...row, chunk: n }])));
const verdicts = (letter) => new Map(passes.flatMap((n) => read(`${comparison}/judge-${letter}-${n}.jsonl`)).map((row) => [row.pid, row.verdict]));
const JA = verdicts('A'), JB = verdicts('B');
const key = JSON.parse(readFileSync(resolve(root, `${comparison}/judge-calibration-key.json`), 'utf8'));
const knownWrong = new Set(key.filter((row) => row.truth === 'different').map((row) => row.pid));
const kappa = (pids) => {
  const n = pids.length, agree = pids.filter((p) => JA.get(p) === JB.get(p)).length / n;
  const expected = ['same', 'different', 'unclear'].reduce((sum, label) => sum + (pids.filter((p) => JA.get(p) === label).length / n) * (pids.filter((p) => JB.get(p) === label).length / n), 0);
  return { n, agreeing: pids.filter((p) => JA.get(p) === JB.get(p)).length, agreement: agree, kappa: (agree - expected) / (1 - expected) };
};
const all = [...pairs.keys()];
const recordPids = new Set(Object.keys(JSON.parse(readFileSync(resolve(root, `${comparison}/judge-pair-map.json`), 'utf8'))));
const injected = all.filter((p) => !recordPids.has(p));
console.log(`  all pairs: ${JSON.stringify(kappa(all))}`);
console.log(`  distinct answers with records: ${JSON.stringify(kappa(all.filter((p) => recordPids.has(p))))}`);
console.log(`  injected pairs ${injected.length}: known-wrong (distinct) ${knownWrong.size}, accepted by A ${[...knownWrong].filter((p) => JA.get(p) === 'same').length}, by B ${[...knownWrong].filter((p) => JB.get(p) === 'same').length}; other injected ${injected.filter((p) => !knownWrong.has(p)).map((p) => `${p} (${JA.get(p)}/${JB.get(p)})`).join(', ')}`);
for (const n of passes) {
  const chunk = all.filter((p) => pairs.get(p).chunk === n);
  const parserEquivalent = chunk.filter((p) => { const { reference, candidate } = pairs.get(p); const j = joinValue(reference), c = coalitionValue(reference); return (j && j === joinValue(candidate)) || (c && c === coalitionValue(candidate)); });
  console.log(`  chunk ${n}: ${chunk.length} pairs, known-wrong items ${chunk.filter((p) => knownWrong.has(p)).length}, parser-equivalent items ${parserEquivalent.length}`);
}
// Pairs that carry at least one larger-model record.
const map = JSON.parse(readFileSync(resolve(root, `${comparison}/judge-pair-map.json`), 'utf8'));
const pidOfJid = new Map(Object.entries(map).flatMap(([pid, jids]) => jids.map((jid) => [jid, pid])));
const largerDirs = ['haiku', 'sonnet'].flatMap((model) => ['main-direct', 'main-js', 'main-sop', 'e8-l0-ops', 'e8-l0-js', 'e8-l0-sop', 'e8-l2-ops', 'e8-l2-js', 'e8-l2-sop', 'e3-original-js', 'e3-original-sop', 'e3-procedural-js', 'e3-procedural-sop', 'e9-js', 'e9-sop'].map((set) => `m-${model}-${set}`));
const largerPids = new Set();
for (const directory of largerDirs) for (const row of read(`evaluation/registry/${directory}/items.jsonl`)) { const pid = pidOfJid.get(jidOf(directory, row)); if (pid) largerPids.add(pid); }
const larger = [...largerPids];
console.log(`  pairs with a larger-model answer: ${JSON.stringify(kappa(larger))}; of them in chunks 5 and 6: ${larger.filter((p) => pairs.get(p).chunk === 5 || pairs.get(p).chunk === 6).length}`);
