/**
 * Section 87 of the logical-reasoning book: a feeling of certainty.
 *
 * Every case stages a quiz night in a named place where one person is
 * extremely sure and turns out to be wrong, with a record of past
 * “extremely sure” calls and how many were right. One voice says the feeling
 * is not tracking the record and the other treats certainty as self-proving.
 * The case data changes the place, the person, and the two speakers; the
 * reasoning is fixed: the feeling is a nervous-system state, and on a record
 * where only a fraction of the sure calls were right it is weak evidence of
 * accuracy, so the module renders the printed verdict with the counted
 * fraction.
 */

import { slugify } from '../../naming.mjs';

const COUNT_WORDS = new Map([
  ['zero', 0],
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
  ['ten', 10],
  ['eleven', 11],
  ['twelve', 12],
  ['twenty', 20],
  ['thirty', 30],
  ['twice', 2],
  ['thrice', 3]
]);

const CERTAINTY_PATTERN =
  /Quiz night in (.+?): ([A-Z][a-z]+) is extremely sure of an answer and, when the card is turned, is wrong\. Notes show ([A-Z][a-z]+) has been “extremely sure” ([A-Za-z]+) listed times and right ([A-Za-z]+)\. ([A-Z][a-z]+) says the feeling is not tracking the record\. ([A-Z][a-z]+) says certainty is self-proving because it is strong\./;

function countOf(token) {
  if (/^\d+$/.test(token)) {
    return Number(token);
  }
  const value = COUNT_WORDS.get(token.toLowerCase());
  if (value === undefined) {
    throw new Error(`the statement uses the unrecognised count "${token}"`);
  }
  return value;
}

function parse(statement) {
  const certainty = CERTAINTY_PATTERN.exec(statement);
  if (certainty === null) {
    throw new Error('the statement does not record the quiz, the two voices, and the sure record');
  }
  if (certainty[2] !== certainty[3]) {
    throw new Error('the sure record must belong to the person who was wrong');
  }
  return {
    place: certainty[1],
    person: certainty[2],
    total: countOf(certainty[4]),
    right: countOf(certainty[5]),
    tracker: certainty[6],
    selfProver: certainty[7]
  };
}

function solve(slots) {
  if (!Number.isInteger(slots.total) || slots.total <= 0) {
    throw new Error('the sure record must list a positive number of times');
  }
  if (!Number.isInteger(slots.right) || slots.right < 0) {
    throw new Error('the sure record must list a non-negative number of right calls');
  }
  if (slots.right >= slots.total) {
    throw new Error('a record that is not short of certainty is not the pattern of this section');
  }
  return {
    place: slots.place,
    person: slots.person,
    total: slots.total,
    right: slots.right,
    tracker: slots.tracker,
    selfProver: slots.selfProver
  };
}

function render(solution) {
  return `A nervous-system state. On this record it is weak evidence of accuracy (${solution.right} of ${solution.total}).`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "A nervous-system state. On this record it is weak evidence of accuracy (" + slots.right + " of " + slots.total + ").";'
].join('\n');

function explain(slots, solution) {
  return [
    `The record from ${solution.place} shows ${solution.person} was extremely sure ${solution.total} times and right only ${solution.right} times.`,
    `A feeling of certainty is a nervous-system state, so it is evidence about the feeler rather than about the card.`,
    `${solution.tracker} reads that fraction correctly; ${solution.selfProver} treats strength of feeling as proof, which is a circle.`
  ];
}

export const unit = 87;

export const cases = [
  {
    template: 'A feeling of certainty',
    type: slugify('A feeling of certainty'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
