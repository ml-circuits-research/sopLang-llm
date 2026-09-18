/**
 * Section 85 of the adult-reasoning course: promises, conditions, and keeping them.
 *
 * Every variant records one speaker promising to come on Saturday “if it does
 * not rain”, then states that it rains that Saturday, and closes with a second
 * person accusing the promise of being broken. The verdict reads the condition
 * inside the promise: the rain makes the condition false, so the duty never
 * starts, and the accuser has read the sentence without its “if”. The cases
 * change the promising person and the accusing person, so the family derives
 * the reading clause from the parsed names.
 */

import { slugify } from '../../naming.mjs';

const PROMISE_PATTERN = /([A-Z][a-z]+): “I’ll come Saturday if it doesn’t rain\.”/;
const ACCUSER_PATTERN = /([A-Z][a-z]+): “You promised you’d come\.”/;

function parse(statement) {
  const promise = PROMISE_PATTERN.exec(statement);
  const accuser = ACCUSER_PATTERN.exec(statement);
  if (promise === null || accuser === null) {
    throw new Error('the statement does not hold the conditional promise and the accusation');
  }
  const rain = /Saturday it rains\./.test(statement);
  return {
    promiser: promise[1],
    accuser: accuser[1],
    rainDay: rain ? 'Saturday' : null,
    conditionHolds: !rain
  };
}

function solve(slots) {
  if (slots.promiser === slots.accuser) {
    throw new Error('the promising person and the accusing person must be different');
  }
  if (slots.conditionHolds) {
    throw new Error('the stated day does not make the condition false, which is not this section pattern');
  }
  return {
    brokenClause: 'No.',
    dutyClause: 'The condition is false, so the duty does not start.',
    readingClause: `${slots.accuser} read without the “if”.`
  };
}

function render(solution) {
  return `${solution.brokenClause} ${solution.dutyClause} ${solution.readingClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.promiser === "string" && slots.promiser.length > 0, "the case must name the person who promised");',
  'probe(typeof slots.accuser === "string" && slots.accuser.length > 0, "the case must name the person who accuses");',
  'probe(slots.promiser !== slots.accuser, "the promising person and the accusing person must be different");',
  'probe(slots.conditionHolds === false, "the stated day must make the condition false");',
  'probe(slots.rainDay === "Saturday", "the case must state that it rains on the promised day");',
  'const brokenClause = "No.";',
  'const dutyClause = "The condition is false, so the duty does not start.";',
  'const readingClause = slots.accuser + " read without the \\u201cif\\u201d.";',
  'return brokenClause + " " + dutyClause + " " + readingClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.promiser}'s sentence carries a condition: coming on Saturday is promised only if it does not rain.`,
    `Saturday it rains, so the condition is false and the promise has no scope to be kept or broken; the duty it would create never starts.`,
    `${slots.accuser} repeats the promise as if it were unconditional, which drops the “if” from the sentence.`,
    'The correct reading keeps the condition attached, so the accusation of a broken promise fails.'
  ];
}

export const unit = 85;

export const cases = [
  {
    template: 'Promises, conditions, and keeping them',
    type: slugify('Promises, conditions, and keeping them'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
