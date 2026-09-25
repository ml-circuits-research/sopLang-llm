/**
 * Pattern 4 of the decompose-to-solve book: dependency chain and join.
 *
 * Every variant states one domain scenario in which five work packages A–E
 * carry a dependency graph: A is sequential, B and C start only after A and
 * then run in parallel, D waits for both of them, and E follows D. A mandatory
 * safety buffer and a completion limit close the statement, and a trailing
 * sentence mentions a workload count that the task durations already include.
 *
 * The earliest safe completion time is the length of the critical path
 * `A + max(B, C) + D + E + buffer`, so B and C collapse into their maximum,
 * and the verdict compares that single number with the limit. The variants
 * change the domain phrase, the workload noun, and the durations, not the
 * method.
 */

import { slugify } from '../../naming.mjs';

const A_PATTERN = /A takes (\d+) minutes\./;
const PARALLEL_PATTERN = /B \((\d+) min\) and C \((\d+) min\) can start only after A but may then run in parallel\./;
const D_PATTERN = /D \((\d+) min\) needs both B and C finished\./;
const E_PATTERN = /E \((\d+) min\) follows D\./;
const BUFFER_PATTERN = /A final safety or review buffer of (\d+) minutes is mandatory, and the completion limit is (\d+) minutes\./;

function parse(statement) {
  const a = A_PATTERN.exec(statement);
  const parallel = PARALLEL_PATTERN.exec(statement);
  const d = D_PATTERN.exec(statement);
  const e = E_PATTERN.exec(statement);
  const buffer = BUFFER_PATTERN.exec(statement);
  if (a === null || parallel === null || d === null || e === null || buffer === null) {
    throw new Error('the statement does not state the A–E durations, the parallel branches, and the buffer with the limit');
  }
  return {
    aMinutes: Number(a[1]),
    bMinutes: Number(parallel[1]),
    cMinutes: Number(parallel[2]),
    dMinutes: Number(d[1]),
    eMinutes: Number(e[1]),
    bufferMinutes: Number(buffer[1]),
    limitMinutes: Number(buffer[2])
  };
}

function solve(slots) {
  const joinMinutes = Math.max(slots.bMinutes, slots.cMinutes);
  const minutes = slots.aMinutes + joinMinutes + slots.dMinutes + slots.eMinutes + slots.bufferMinutes;
  return { joinMinutes, minutes, feasible: minutes <= slots.limitMinutes };
}

function render(solution) {
  return `The earliest safe completion time is ${solution.minutes} minutes, so the plan is ${solution.feasible ? 'feasible' : 'not feasible'}. The critical insight is that B and C are parallel branches whose maximum duration controls the join.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const joinMinutes = Math.max(slots.bMinutes, slots.cMinutes);',
  'const minutes = slots.aMinutes + joinMinutes + slots.dMinutes + slots.eMinutes + slots.bufferMinutes;',
  'return "The earliest safe completion time is " + minutes + " minutes, so the plan is " + (minutes <= slots.limitMinutes ? "feasible" : "not feasible") + ". The critical insight is that B and C are parallel branches whose maximum duration controls the join.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The chain starts with A (${slots.aMinutes} minutes), and B and C run in parallel after it, so only the longer branch matters: max(${slots.bMinutes}, ${slots.cMinutes}) = ${solution.joinMinutes} minutes.`,
    `The join D (${slots.dMinutes} minutes) can start once both branches finish, and E (${slots.eMinutes} minutes) follows D.`,
    `Adding the mandatory buffer of ${slots.bufferMinutes} minutes gives ${slots.aMinutes} + ${solution.joinMinutes} + ${slots.dMinutes} + ${slots.eMinutes} + ${slots.bufferMinutes} = ${solution.minutes} minutes.`,
    `Comparing that earliest safe time with the limit of ${slots.limitMinutes} minutes makes the plan ${solution.feasible ? 'feasible' : 'not feasible'}; the mentioned workload count is a distractor because the durations already include it.`
  ];
}

export const unit = 4;

export const cases = [
  {
    template: 'Dependency Chain and Join',
    type: slugify('Dependency Chain and Join'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
