/**
 * Pattern 1 of the decompose-to-solve book: two-step minimal split.
 *
 * Every variant states a workload, a completion limit, a block capacity, a
 * block time, a one-time setup, and a staffing sentence that explicitly does
 * not change the block rate. The compressed number is
 * `ceil(workload / capacity) × blockTime + setup`, and the answer compares it
 * with the limit: a compression of the operational details into one number,
 * followed by a pure constraint test. The variants change the domain phrase,
 * the workload noun, and the numbers, not the method.
 */

import { slugify } from '../../naming.mjs';

const WORKLOAD_PATTERN = /a team must handle (\d+) ([a-z][a-z -]*)\./;
const LIMIT_PATTERN = /The stated completion limit is (\d+) minutes\./;
const BLOCK_PATTERN = /Each processing block can handle at most (\d+) [a-z][a-z -]*, and each block takes (\d+) minutes\./;
const SETUP_PATTERN = /A one-time setup takes (\d+) minutes\./;

function parse(statement) {
  const workload = WORKLOAD_PATTERN.exec(statement);
  const limit = LIMIT_PATTERN.exec(statement);
  const block = BLOCK_PATTERN.exec(statement);
  const setup = SETUP_PATTERN.exec(statement);
  if (workload === null || limit === null || block === null || setup === null) {
    throw new Error('the statement does not state the workload, the limit, the block rate, and the setup');
  }
  return {
    workload: Number(workload[1]),
    workUnit: workload[2].trim(),
    limitMinutes: Number(limit[1]),
    blockCapacity: Number(block[1]),
    blockMinutes: Number(block[2]),
    setupMinutes: Number(setup[1])
  };
}

function solve(slots) {
  const blocks = Math.ceil(slots.workload / slots.blockCapacity);
  const minutes = blocks * slots.blockMinutes + slots.setupMinutes;
  return { blocks, minutes, feasible: minutes <= slots.limitMinutes };
}

function render(solution) {
  return `The correct answer is ${solution.feasible ? 'yes' : 'no'}. First compress the operational details into one number (${solution.minutes} minutes), then compare that output with the deadline. The large problem becomes a workload calculation followed by a pure constraint test.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Number.isInteger(slots.workload) && slots.workload > 0, "the workload must be a positive whole number");',
  'probe(Number.isInteger(slots.blockCapacity) && slots.blockCapacity > 0, "the block capacity must be a positive whole number");',
  'probe(Number.isInteger(slots.blockMinutes) && slots.blockMinutes > 0, "the block time must be a positive whole number");',
  'probe(Number.isInteger(slots.setupMinutes) && slots.setupMinutes >= 0, "the setup time must be a whole number");',
  'probe(Number.isInteger(slots.limitMinutes) && slots.limitMinutes > 0, "the limit must be a positive whole number");',
  'const blocks = Math.ceil(slots.workload / slots.blockCapacity);',
  'const minutes = blocks * slots.blockMinutes + slots.setupMinutes;',
  'return "The correct answer is " + (minutes <= slots.limitMinutes ? "yes" : "no") + ". First compress the operational details into one number (" + minutes + " minutes), then compare that output with the deadline. The large problem becomes a workload calculation followed by a pure constraint test.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The workload is compressed first: ${slots.workload} ${slots.workUnit} need ceil(${slots.workload}/${slots.blockCapacity}) = ${solution.blocks} blocks.`,
    `The block time and the one-time setup give ${solution.blocks} × ${slots.blockMinutes} + ${slots.setupMinutes} = ${solution.minutes} minutes.`,
    `That single number is then compared with the limit of ${slots.limitMinutes} minutes, so the plan is ${solution.feasible ? 'feasible' : 'not feasible'}; the staffing count is a distractor because the block rate is fixed.`
  ];
}

export const unit = 1;

export const cases = [
  {
    template: 'Two-Step Minimal Split',
    type: slugify('Two-Step Minimal Split'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
