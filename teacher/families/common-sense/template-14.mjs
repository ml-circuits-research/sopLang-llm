/**
 * Template 14 of the common-sense book: marginal allocation.
 *
 * Every variant states a pool of identical units to spread over three programs
 * A, B, C, and each program lists four non-increasing marginal benefits, one
 * per unit of the program, that must be taken in order. The best allocation
 * therefore gives every selected unit the largest marginal benefit still
 * available, and equal marginal benefits make several allocations optimal.
 *
 * The printed answer varies in shape with the tie count: a unique optimum is
 * printed as `A=…, B=…, C=…; maximum total benefit = … points.` and a
 * contested optimum as `One optimal allocation is A=…, with … points. There
 * are … tied optimal allocations.` The allocation printed as the example is
 * the first optimum of the enumeration over A, then B, then C, so the parser
 * and the solver reproduce one deterministic member of the tie set instead of
 * picking it by inspection. The unit nouns of the pool (`resource units`,
 * `units`, …) vary across the variants and are read from the statement.
 */

import { slugify } from '../../naming.mjs';

const RESOURCE_PATTERN = /There are (\d+) identical ([a-z ]+) to allocate among programs A, B, and C\./;
const AMOUNT_LIST = '(\\d+(?:, \\d+)*)';
const BENEFITS_PATTERN = new RegExp(
  `A: ${AMOUNT_LIST} points for units 1–(\\d+); B: ${AMOUNT_LIST} points; C: ${AMOUNT_LIST} points\\.`
);
const PROGRAM_NAMES = Object.freeze(['A', 'B', 'C']);

function amounts(text) {
  return text.split(',').map((amount) => Number(amount.trim()));
}

function parse(statement) {
  const resource = RESOURCE_PATTERN.exec(statement);
  const benefits = BENEFITS_PATTERN.exec(statement);
  if (resource === null) {
    throw new Error('the statement does not state the pool of identical units and the three programs');
  }
  if (benefits === null) {
    throw new Error('the statement does not state the marginal benefits of programs A, B, and C');
  }
  const programs = { A: amounts(benefits[1]), B: amounts(benefits[3]), C: amounts(benefits[4]) };
  const depth = Number(benefits[2]);
  const pool = Number(resource[1]);
  if (programs.A.length !== depth || programs.B.length !== depth || programs.C.length !== depth) {
    throw new Error('the stated unit range does not match the listed marginal benefits');
  }
  if (depth * PROGRAM_NAMES.length < pool) {
    throw new Error('the pool has more units than the programs can absorb');
  }
  return {
    units: pool,
    resourceUnit: resource[2].trim(),
    programs
  };
}

function totalOf(programs, taken) {
  return PROGRAM_NAMES.reduce(
    (sum, name) => sum + programs[name].slice(0, taken[name]).reduce((left, right) => left + right, 0),
    0
  );
}

/**
 * The enumeration walks A upward, then B upward, so the first allocation that
 * attains the maximum total benefit is the lexicographically smallest optimum:
 * the member the source prints when several allocations tie.
 */
function solve(slots) {
  const depth = slots.programs.A.length;
  let best = null;
  let optima = 0;
  let allocation = null;
  for (let a = 0; a <= slots.units; a += 1) {
    for (let b = 0; a + b <= slots.units; b += 1) {
      const taken = { A: a, B: b, C: slots.units - a - b };
      if (PROGRAM_NAMES.some((name) => taken[name] > depth)) {
        continue;
      }
      const value = totalOf(slots.programs, taken);
      if (best === null || value > best) {
        best = value;
        optima = 1;
        allocation = taken;
      } else if (value === best) {
        optima += 1;
      }
    }
  }
  if (allocation === null) {
    throw new Error('no allocation of the stated units fits the marginal benefits');
  }
  return { allocation, total: best, optima, programs: slots.programs, resourceUnit: slots.resourceUnit };
}

function render(solution) {
  const allocation = `A=${solution.allocation.A}, B=${solution.allocation.B}, C=${solution.allocation.C}`;
  if (solution.optima === 1) {
    return `${allocation}; maximum total benefit = ${solution.total} points.`;
  }
  return `One optimal allocation is ${allocation}, with ${solution.total} points. There are ${solution.optima} tied optimal allocations.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const names = ["A", "B", "C"];',
  'probe(slots.programs !== null && typeof slots.programs === "object", "the statement must state the marginal benefits of three programs");',
  'probe(names.every((name) => Array.isArray(slots.programs[name]) && slots.programs[name].length > 0), "every program must list at least one marginal benefit");',
  'probe(names.every((name) => slots.programs[name].every((value) => Number.isInteger(value) && value > 0)), "every marginal benefit must be a positive integer");',
  'probe(names.every((name) => slots.programs[name].length === slots.programs.A.length), "the programs must list the same number of marginal benefits");',
  'probe(Number.isInteger(slots.units) && slots.units > 0, "the statement must state a positive number of units to allocate");',
  'const depth = slots.programs.A.length;',
  'probe(slots.units <= names.length * depth, "the stated units must not exceed the benefits the programs can absorb");',
  'const totalOf = (taken) => names.reduce((sum, name) => sum + slots.programs[name].slice(0, taken[name]).reduce((left, right) => left + right, 0), 0);',
  'let best = null;',
  'let optima = 0;',
  'let allocation = null;',
  'for (let a = 0; a <= slots.units; a += 1) {',
  '  for (let b = 0; a + b <= slots.units; b += 1) {',
  '    const taken = { A: a, B: b, C: slots.units - a - b };',
  '    if (names.some((name) => taken[name] > depth)) {',
  '      continue;',
  '    }',
  '    const value = totalOf(taken);',
  '    if (best === null || value > best) {',
  '      best = value;',
  '      optima = 1;',
  '      allocation = taken;',
  '    } else if (value === best) {',
  '      optima += 1;',
  '    }',
  '  }',
  '}',
  'probe(allocation !== null, "at least one allocation of the stated units must be feasible");',
  'probe(best > 0, "the optimal allocation must have a positive total benefit");',
  'const chosen = "A=" + allocation.A + ", B=" + allocation.B + ", C=" + allocation.C;',
  'return optima === 1',
  '  ? chosen + "; maximum total benefit = " + best + " points."',
  '  : "One optimal allocation is " + chosen + ", with " + best + " points. There are " + optima + " tied optimal allocations.";'
].join('\n');

function explain(slots, solution) {
  const listed = (name) => `${name}: ${slots.programs[name].join(', ')}`;
  const allocation = `A=${solution.allocation.A}, B=${solution.allocation.B}, C=${solution.allocation.C}`;
  return [
    `Each program's marginal benefits fall as its units are added, so a unit is taken only when every earlier unit of that program is taken; the feasible allocations are the triples of the stated ${slots.units} ${slots.resourceUnit} that respect those four-step ladders (${listed('A')}; ${listed('B')}; ${listed('C')}).`,
    `The best allocation gives each unit the largest marginal benefit still available, which is the optimum ${allocation} with a total benefit of ${solution.total} points.`,
    solution.optima === 1
      ? 'No other allocation of the stated units reaches that total, so the optimum is unique.'
      : `Equal marginal benefits make ${solution.optima} allocations reach the same total, so the reported optimum is one member of a tie set rather than the only answer.`,
    'Taking a later unit without its earlier units would break the ordering rule, and adding marginal benefits across programs before ordering them would ignore which units are actually available.'
  ];
}

export const unit = 14;

export const cases = [
  {
    template: 'Marginal allocation',
    type: slugify('Marginal allocation'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
