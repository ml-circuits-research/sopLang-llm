// Where the compact-target and split-target 1.7B runs differ on the held-out set, and what the
// failing scheduling programs contain (Informatica, Section 5.3 and Table 1).
// Reads evaluation/registry/<run>/items/holdout.jsonl; prints counts only (no model calls).
// Usage: node article/scripts/split-target-failures.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { parseCircuit } from '../../runtime/parser.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const load = (run) => readFileSync(resolve(root, 'evaluation/registry', run, 'items/holdout.jsonl'), 'utf8')
  .split('\n').filter(Boolean).map((line) => JSON.parse(line));

const SCHEDULING = /dependency-chain-and-join/;
const groupOf = (row) => row.book === 'procedural-arithmetic' ? 'procedural' : SCHEDULING.test(row.folder) ? 'scheduling' : 'otherBook';

function wiresOf(completion) {
  try { return parseCircuit(completion ?? '').wires; } catch { return null; }
}
function slotsOf(wires) {
  const literal = wires?.find((wire) => wire.name === 'slots' && wire.command === 'literal');
  try { return literal ? JSON.parse(literal.body) : null; } catch { return null; }
}
// A keyed collection of durations: a slots property that is a plain object whose values are all numbers
// (for example {"A": 7, "B": 11, ...}), as opposed to one scalar per duration.
function keyedNumbers(slots) {
  if (!slots || typeof slots !== 'object') return false;
  return Object.values(slots).some((value) => value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length >= 2 && Object.values(value).every((inner) => typeof inner === 'number'));
}
// An assertion that the plan is feasible: a probe whose condition compares a computed value with the limit.
const FEASIBILITY_PROBE = /probe\(\s*[^,;]*?(?:<=?\s*[^,;]*limit|limit\w*\s*>=?\s*(?!\d)[A-Za-z_$])/i;
const jsBodies = (wires) => (wires ?? []).filter((wire) => wire.command === 'jsEval');

function summarize(run) {
  const rows = load(run);
  const out = { run, n: rows.length, groups: {} };
  for (const row of rows) {
    const group = out.groups[groupOf(row)] ??= { n: 0, execution_error: 0, answer_match: 0, answer_mismatch: 0, other: 0 };
    group.n++;
    if (row.class in group) group[row.class]++; else group.other++;
  }
  const scheduling = rows.filter((row) => groupOf(row) === 'scheduling');
  const detail = { programs: scheduling.length, oneComputationWire: 0, multiComputationWires: 0, keyedDurations: 0,
    feasibilityProbe: 0, valuesCall: 0, valuesCrash: 0, maxOverAllDurations: 0, failures: 0, failuresOneWire: 0, failuresMultiWire: 0,
    failuresWithValuesCrash: 0, failuresWithFeasibilityProbe: 0, notFeasibleReferences: 0, feasibilityProbeOnNotFeasible: 0 };
  for (const row of scheduling) {
    const wires = wiresOf(row.completion);
    const computation = jsBodies(wires);
    const code = computation.map((wire) => wire.body).join('\n');
    if (computation.length <= 1) detail.oneComputationWire++; else detail.multiComputationWires++;
    if (keyedNumbers(slotsOf(wires))) detail.keyedDurations++;
    const probe = FEASIBILITY_PROBE.test(code);
    if (probe) detail.feasibilityProbe++;
    if (/\.values\(\)/.test(code) && !/Object\.values\(/.test(code.replace(/[A-Za-z_$.]+\.values\(\)/g, ''))) detail.valuesCall++;
    // The plan lost: the maximum over all durations instead of the chain with one join.
    if (/Math\.max\(\s*\.\.\.\s*(?:Object\.values\()?\$?slots\.durations/.test(code)) detail.maxOverAllDurations++;
    const crash = /values is not a function/.test(row.detail ?? '');
    if (crash) detail.valuesCrash++;
    const notFeasible = /not feasible/.test(row.oracle);
    if (notFeasible) { detail.notFeasibleReferences++; if (probe) detail.feasibilityProbeOnNotFeasible++; }
    if (row.class === 'execution_error') {
      detail.failures++;
      if (computation.length <= 1) detail.failuresOneWire++; else detail.failuresMultiWire++;
      if (crash) detail.failuresWithValuesCrash++;
      if (probe) detail.failuresWithFeasibilityProbe++;
    }
  }
  out.scheduling = detail;
  // Other book-derived programs: execution failures by number of computation wires.
  const other = rows.filter((row) => groupOf(row) === 'otherBook');
  const byWires = { one: { n: 0, failed: 0 }, more: { n: 0, failed: 0 } };
  for (const row of other) {
    const key = jsBodies(wiresOf(row.completion)).length <= 1 ? 'one' : 'more';
    byWires[key].n++;
    if (row.class === 'execution_error') byWires[key].failed++;
  }
  out.otherBookByWires = byWires;
  return out;
}

const runs = ['exp-017-qwen3-17b', 'exp-018-1.7b-qwen3-dv4', 'exp-019-1.7b-qwen3-dv5', 'exp-021-1.7b-qwen3-dv7', 'exp-022-1.7b-qwen3-dv8',
  'exp-023-1.7b-qwen3-dv9', 'exp-024-1.7b-qwen3-dv11', 'exp-025-1.7b-qwen3-dv12', 'exp-026-0.5b-qwen2.5coder-dv13', 'exp-027-1.7b-qwen3-dv13'];
const results = runs.map(summarize);
for (const result of results) {
  const g = result.groups;
  console.log(`\n== ${result.run} (${result.n} held-out problems)`);
  for (const [name, group] of Object.entries(g)) console.log(`  ${name.padEnd(11)} n=${group.n} execErr=${group.execution_error} match=${group.answer_match} mismatch=${group.answer_mismatch} other=${group.other}`);
  console.log('  scheduling programs:', JSON.stringify(result.scheduling));
  console.log('  other book programs by computation wires:', JSON.stringify(result.otherBookByWires));
}

// The compact/split contrast itself.
const [compact, split] = ['exp-021-1.7b-qwen3-dv7', 'exp-022-1.7b-qwen3-dv8'].map((run) => results.find((result) => result.run === run));
const total = (result, key) => Object.values(result.groups).reduce((sum, group) => sum + group[key], 0);
console.log('\n== Compact (exp-021) against split (exp-022) targets');
console.log(`  execution errors, all 705: ${total(compact, 'execution_error')} -> ${total(split, 'execution_error')} (added ${total(split, 'execution_error') - total(compact, 'execution_error')})`);
for (const name of ['scheduling', 'procedural', 'otherBook']) {
  console.log(`  execution errors, ${name} (${compact.groups[name].n}): ${compact.groups[name].execution_error} -> ${split.groups[name].execution_error}; exact matches ${compact.groups[name].answer_match} -> ${split.groups[name].answer_match}`);
}
console.log(`  exact matches, all 705: ${total(compact, 'answer_match')} -> ${total(split, 'answer_match')}`);

// Two-sided Fisher exact test on a 2x2 table, used only as orientation for single-run differences.
function fisher(a, b, c, d) {
  const logFactorial = (n) => { let sum = 0; for (let k = 2; k <= n; k++) sum += Math.log(k); return sum; };
  const row1 = a + b, row2 = c + d, col1 = a + c, n = a + b + c + d;
  const p = (x) => Math.exp(logFactorial(row1) + logFactorial(row2) + logFactorial(col1) + logFactorial(n - col1)
    - logFactorial(n) - logFactorial(x) - logFactorial(row1 - x) - logFactorial(col1 - x) - logFactorial(row2 - col1 + x));
  const observed = p(a);
  let sum = 0;
  for (let x = Math.max(0, col1 - row2); x <= Math.min(row1, col1); x++) { const px = p(x); if (px <= observed * (1 + 1e-9)) sum += px; }
  return Math.min(1, sum);
}
const pair = (name, key) => [compact.groups[name][key], compact.groups[name].n - compact.groups[name][key], split.groups[name][key], split.groups[name].n - split.groups[name][key]];
for (const name of ['scheduling', 'procedural', 'otherBook']) {
  console.log(`  Fisher p (execution errors, ${name}): ${fisher(...pair(name, 'execution_error')).toFixed(3)}`);
}
