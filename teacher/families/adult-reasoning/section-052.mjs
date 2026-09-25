/**
 * Section 52 of the adult-reasoning course: heat, temperature, and changes of
 * state.
 *
 * Every variant posts the same kitchen sheet: at ordinary pressure water boils
 * at 100 °C, ice melts at 0 °C, a glass holding ice and water together stays at
 * 0 °C, and a lid only shortens the time to the boil. The student then claims
 * the lid takes the water to 120 °C and that the melting glass reads 10 °C
 * "because the room is warm". The verdict reads the sheet literally: the lid
 * cannot raise the boiling point above the stated value, and the mixture holds
 * the melting temperature while both phases are present. The cases change the
 * student, the kitchen, the town, and the figures the student asserts, so the
 * family derives both temperatures from the parsed sheet.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN =
  /In ([A-Z][a-z]+)’s kitchen in ([^,]+), at ordinary pressure, water boils at (\d+) °C\. Ice melts at (-?\d+) °C\. While ice and water are both present mixed, the temperature stays at (-?\d+) °C\./;
const LID_PATTERN =
  /A lid shortens time to the boil; it does not raise the boiling temperature above (\d+) °C in an unpressurised pot\./;
const CLAIM_PATTERN =
  /([A-Z][a-z]+) thinks the lid takes water to (\d+) °C and that a glass of melting ice is (-?\d+) °C/;

function parse(statement) {
  const sheet = SHEET_PATTERN.exec(statement);
  const lid = LID_PATTERN.exec(statement);
  const claim = CLAIM_PATTERN.exec(statement);
  if (sheet === null || lid === null || claim === null) {
    throw new Error('the statement does not describe the sheet and the student claim');
  }
  return {
    student: sheet[1],
    claimer: claim[1],
    place: sheet[2],
    boilC: Number(sheet[3]),
    meltC: Number(sheet[4]),
    mixtureC: Number(sheet[5]),
    lidCeilingC: Number(lid[1]),
    claimedBoilC: Number(claim[2]),
    claimedMeltC: Number(claim[3]),
    lidShortensOnly: Number(lid[1]) === Number(sheet[3]),
    iceWaterHolds: Number(sheet[5]) === Number(sheet[4])
  };
}

function solve(slots) {
  const boilClause = slots.lidShortensOnly
    ? `Boil with lid: still ${slots.boilC} °C.`
    : `Boil with lid: ${slots.claimedBoilC} °C.`;
  const glassClause = slots.iceWaterHolds
    ? `Glass of ice+water: ${slots.mixtureC} °C.`
    : `Glass of ice+water: ${slots.claimedMeltC} °C.`;
  return { boilClause, glassClause };
}

function render(solution) {
  return `${solution.boilClause} ${solution.glassClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const boilClause = slots.lidShortensOnly',
  '  ? "Boil with lid: still " + slots.boilC + " \u00b0C."',
  '  : "Boil with lid: " + slots.claimedBoilC + " \u00b0C.";',
  'const glassClause = slots.iceWaterHolds',
  '  ? "Glass of ice+water: " + slots.mixtureC + " \u00b0C."',
  '  : "Glass of ice+water: " + slots.claimedMeltC + " \u00b0C.";',
  'return boilClause + " " + glassClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The sheet fixes the plain boiling point of water at ${slots.boilC} °C in ${slots.place} at ordinary pressure, and it says the lid only shortens the time to the boil, so the lid cannot carry the water to the ${slots.claimedBoilC} °C that ${slots.claimer} asserts.`,
    `While the ice and the water are both present the sheet keeps the temperature at the melting point of ${slots.meltC} °C, so the glass does not take the ${slots.claimedMeltC} °C that the warm room suggests.`,
    `A lid traps heat so the water reaches ${slots.boilC} °C sooner, but it does not change the temperature of a change of state, so both of ${slots.claimer}'s figures are too high.`
  ];
}

export const unit = 52;

export const cases = [
  {
    template: 'Heat, temperature, and changes of state',
    type: slugify('Heat, temperature, and changes of state'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
