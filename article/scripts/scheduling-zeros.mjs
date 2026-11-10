// Tallies the held-out scheduling answers (the dependency-chain-and-join items of the decompose-to-solve
// book, 100 per run) of the 1.7B runs trained with the scheduling shape, from their original held-out
// evaluation records. For each run it counts exact matches, execution errors, answers the restricted
// parser accepts, and answers that state the reference duration with the right verdict in wording the
// parser does not accept (the same test as section 5 of article/experiments/ml-review-checks.mjs).
// It then sums the three runs that targeted the stuck books with new training data (data versions 9, 11
// and 12). Reads only. Usage: node article/scripts/scheduling-zeros.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { joinValue } from './restricted-comparators.mjs';

const registry = fileURLToPath(new URL('../../evaluation/registry/', import.meta.url));
const RUNS = ['exp-021-1.7b-qwen3-dv7', 'exp-022-1.7b-qwen3-dv8', 'exp-023-1.7b-qwen3-dv9', 'exp-024-1.7b-qwen3-dv11', 'exp-025-1.7b-qwen3-dv12', 'exp-027-1.7b-qwen3-dv13'];
const TARGETED = ['exp-023-1.7b-qwen3-dv9', 'exp-024-1.7b-qwen3-dv11', 'exp-025-1.7b-qwen3-dv12'];
const read = file => readFileSync(file, 'utf8').trim().split('\n').map(line => JSON.parse(line));

const rows = [];
for (const run of RUNS) {
  const items = read(resolve(registry, run, 'items/holdout.jsonl')).filter(row => /dependency-chain-and-join/.test(row.item));
  const tally = { run, items: items.length, exactMatch: 0, executionError: 0, parserAccepts: 0, rightOtherWording: 0 };
  for (const row of items) {
    if (row.class === 'answer_match') tally.exactMatch++;
    if (row.class === 'execution_error') tally.executionError++;
    const reference = joinValue(row.oracle), answer = row.answer ?? '';
    if (!reference || !answer) continue;
    if (joinValue(answer) === reference) { tally.parserAccepts++; continue; }
    const { minutes, feasible } = JSON.parse(reference);
    const negative = /(not feasible|does not meet|doesn.t meet|exceeds|misses|not meet|is not within|infeasible|no, )/i.test(answer);
    const positive = /(meets the|is feasible|within the limit|meet the limit|yes)/i.test(answer) && !negative;
    if ((feasible ? positive : negative) && new RegExp(`\\b${minutes} minutes`).test(answer)) tally.rightOtherWording++;
  }
  rows.push(tally);
}
const sum = key => rows.filter(row => TARGETED.includes(row.run)).reduce((total, row) => total + row[key], 0);
console.log('| Run | Items | Exact matches | Execution errors | Parser accepts | Right, other wording |');
console.log('| --- | --- | --- | --- | --- | --- |');
for (const row of rows) console.log(`| ${row.run} | ${row.items} | ${row.exactMatch} | ${row.executionError} | ${row.parserAccepts} | ${row.rightOtherWording} |`);
console.log(`\nRuns that targeted the stuck books (data versions 9, 11, 12): ${sum('items')} answers, ${sum('exactMatch')} exact matches, ${sum('executionError')} execution errors, ${sum('parserAccepts')} accepted by the parser, ${sum('rightOtherWording')} more right in other wording.`);
