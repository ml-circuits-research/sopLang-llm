/**
 * Section 17 of the logical-reasoning book: the contrapositive of a posted
 * conditional.
 *
 * Every case posts one market card — "if it rained in the last hour, the
 * market pavement is wet" — and records three speakers: the first offers the
 * licensed twin "if the pavement is not wet, it did not rain in the last
 * hour", the second offers the converse "if the pavement is wet, it rained in
 * the last hour", and the third cannot hear a difference. The case data
 * changes the market place and the three names; the reasoning is fixed: the
 * card already buys the contrapositive, while the converse adds a new claim
 * because wetness can arrive from another path. The family reads the two twin
 * sentences and renders the printed verdict with the contrapositive speaker.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN = /If it rained in the last hour, the market pavement is wet\./;
const CONTRAPOSITIVE_PATTERN =
  /([A-Z][a-z]+) says the licensed twin is: if the pavement is not wet, it did not rain in the last hour\./;
const CONVERSE_PATTERN =
  /([A-Z][a-z]+) says the licensed twin is: if the pavement is wet, it rained in the last hour\./;
const BYSTANDER_PATTERN = /([A-Z][a-z]+) cannot hear a difference\./;

function parse(statement) {
  if (!CARD_PATTERN.test(statement)) {
    throw new Error('the statement does not post the market card');
  }
  const contrapositive = CONTRAPOSITIVE_PATTERN.exec(statement);
  const converse = CONVERSE_PATTERN.exec(statement);
  const bystander = BYSTANDER_PATTERN.exec(statement);
  if (contrapositive === null || converse === null || bystander === null) {
    throw new Error('the statement does not record the two licensed twins and the bystander');
  }
  return {
    contrapositive: contrapositive[1],
    converse: converse[1],
    bystander: bystander[1]
  };
}

/**
 * The card licenses the twin that denies the back and denies the front; the
 * reversed sentence is a new claim, not a second reading of the same claim.
 * The two speakers are kept apart so the verdict names the licensed one.
 */
function solve(slots) {
  const speakers = [slots.contrapositive, slots.converse, slots.bystander];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the statement must record three different speakers');
  }
  return {
    licensed: slots.contrapositive,
    unlicensed: slots.converse
  };
}

function render(solution) {
  return `Only ${solution.licensed}’s twin — the contrapositive. ${solution.unlicensed} wrote the converse, a new claim. Wetness can arrive by a street-cleaning truck.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "Only " + slots.contrapositive + "\\u2019s twin \\u2014 the contrapositive. " + slots.converse + " wrote the converse, a new claim. Wetness can arrive by a street-cleaning truck.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card states one conditional: rain in the last hour gives a wet market pavement.`,
    `${solution.licensed} turns that conditional around by denying the back — no wet pavement, no rain — which is the contrapositive the card already licenses.`,
    `${solution.unlicensed} turns it around the other way, from a wet pavement to rain, which is the converse and a new claim.`,
    `The new claim needs a new premise, because wetness can arrive by a street-cleaning truck without any rain.`
  ];
}

export const unit = 17;

export const cases = [
  {
    template: 'The contrapositive',
    type: slugify('The contrapositive'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
