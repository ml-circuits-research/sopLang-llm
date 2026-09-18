/**
 * Section 1 of the logical-reasoning book: universals applied to a named case.
 *
 * Every case posts one closed handbook rule, records two people pointing at an
 * entry, and asks which pointing is forced. The case data changes the place and
 * the two names; the reasoning is fixed: the universal covers the listed
 * member of its class and does not touch the member of another class. The
 * family reads the two pointing sentences and renders the printed verdict with
 * the first point of the pair.
 */

import { slugify } from '../../naming.mjs';

const POINTING_PATTERN =
  /([A-Z][a-z]+) points at the listed sparrow and says it lays eggs\. ([A-Z][a-z]+) points at the listed oak and says it lays eggs\./;

function parse(statement) {
  const pointing = POINTING_PATTERN.exec(statement);
  if (pointing === null) {
    throw new Error('the statement does not record the two pointing sentences');
  }
  return { covered: pointing[1], uncovered: pointing[2] };
}

function solve(slots) {
  return {
    covered: slots.covered,
    uncovered: slots.uncovered
  };
}

function render(solution) {
  return `Only ${solution.covered}’s. The sparrow is a listed bird, so the universal covers it. The oak is listed as a tree, so the same universal does not touch it.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.covered === "string" && slots.covered.length > 0, "the case must name the person pointing at the listed sparrow");',
  'probe(typeof slots.uncovered === "string" && slots.uncovered.length > 0, "the case must name the person pointing at the listed oak");',
  'probe(slots.covered !== slots.uncovered, "the two pointing people must be different");',
  'return "Only " + slots.covered + "\\u2019s. The sparrow is a listed bird, so the universal covers it. The oak is listed as a tree, so the same universal does not touch it.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The handbook lists the sparrow as a bird and the oak as a tree, and the universal covers every listed bird.`,
    `${solution.covered} points at the listed sparrow, so the property is forced for it.`,
    `${solution.uncovered} points at the listed oak, which the same universal does not touch; a class that is not on the page is not a premise.`
  ];
}

export const unit = 1;

export const cases = [
  {
    template: 'Universals applied to a named case',
    type: slugify('Universals applied to a named case'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
