/**
 * Pattern 10 of the decompose-to-solve book: one constraint core.
 *
 * Every variant looks decomposable — a scenario piles up several rules stated
 * in different places — but all the rules are clauses of one predicate over a
 * single integer variable x: a lower bound, an upper bound, a divisibility
 * requirement, and a resource limit that must keep a reserve. Splitting them
 * yields fragments that would have to be recombined at once, so the correct
 * representation is one constraint-satisfaction subproblem. The answer reports
 * the largest feasible multiple, `x = k × floor(min(max, limit − reserve) / k)`,
 * followed by the fixed closing clause about clauses of one predicate.
 *
 * The variants change the leading domain phrase, the noun being counted, and
 * the numbers (bound width, divisor, limit, reserve), not the method.
 */

import { slugify } from '../../naming.mjs';

const SUBJECT_PATTERN = /one integer decision x specifies the number of ([a-z][a-z -]*) to authorize\./;
const LOWER_PATTERN = /x must be at least (\d+);/;
const UPPER_PATTERN = /it must not exceed (\d+);/;
const DIVISOR_PATTERN = /operations require x to be a multiple of (\d+);/;
const RESOURCE_PATTERN = /a resource limit of (\d+) units must still leave a reserve of at least (\d+)\./;

function parse(statement) {
  const subject = SUBJECT_PATTERN.exec(statement);
  const lower = LOWER_PATTERN.exec(statement);
  const upper = UPPER_PATTERN.exec(statement);
  const divisor = DIVISOR_PATTERN.exec(statement);
  const resource = RESOURCE_PATTERN.exec(statement);
  if (subject === null || lower === null || upper === null || divisor === null || resource === null) {
    throw new Error('the statement does not state the counted noun, the bounds, the divisibility rule, and the resource limit');
  }
  return {
    subjectNoun: subject[1].trim(),
    lowerBound: Number(lower[1]),
    upperBound: Number(upper[1]),
    divisor: Number(divisor[1]),
    resourceLimit: Number(resource[1]),
    reserve: Number(resource[2])
  };
}

function solve(slots) {
  const effectiveUpper = Math.min(slots.upperBound, slots.resourceLimit - slots.reserve);
  const x = Math.floor(effectiveUpper / slots.divisor) * slots.divisor;
  if (x < slots.lowerBound) {
    throw new Error('the single constraint core has no feasible value for x');
  }
  return { x, effectiveUpper };
}

function render(solution) {
  return `The best representation is a single constraint-satisfaction subproblem, yielding x=${solution.x}. The apparent subproblems are merely clauses of one predicate over the same variable.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const effectiveUpper = Math.min(slots.upperBound, slots.resourceLimit - slots.reserve);',
  'const x = Math.floor(effectiveUpper / slots.divisor) * slots.divisor;',
  'probe(x >= slots.lowerBound, "the clauses must admit at least one multiple of the divisor");',
  'probe(x % slots.divisor === 0 && x >= slots.lowerBound && x <= slots.upperBound && x + slots.reserve <= slots.resourceLimit, "x must satisfy every clause of the one predicate");',
  'return "The best representation is a single constraint-satisfaction subproblem, yielding x=" + x + ". The apparent subproblems are merely clauses of one predicate over the same variable.";'
].join('\n');

function explain(slots, solution) {
  return [
    `All four rules speak about the same variable: ${slots.lowerBound} ≤ x ≤ ${slots.upperBound}, x a multiple of ${slots.divisor}, and x + ${slots.reserve} ≤ ${slots.resourceLimit}.`,
    `The resource clause tightens the upper bound to min(${slots.upperBound}, ${slots.resourceLimit} − ${slots.reserve}) = ${solution.effectiveUpper}.`,
    `The largest multiple of ${slots.divisor} within the bounds is ${solution.x}, so the ${slots.subjectNoun} take that value.`,
    `Because every rule constrains the same x, the apparent strands are clauses of one predicate, and decomposing them would only produce fragments that must be recombined immediately.`
  ];
}

export const unit = 10;

export const cases = [
  {
    template: 'Atomic Case: One Constraint Core',
    type: slugify('Atomic Case: One Constraint Core'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
