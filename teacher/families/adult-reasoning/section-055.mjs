/**
 * Section 55 of the adult-reasoning course: plants, light, and water.
 *
 * Every variant posts the same sheet about a potted plant: in daylight it makes
 * sugars and oxygen from water and CO₂, in prolonged dark production stops and
 * the reserves are used, a covered leaf pales, and roots do not "see" light.
 * The episode then keeps the plant several days in a cupboard and claims it
 * still makes oxygen because it is green. The verdict reads the sheet
 * literally: with no light the production of oxygen is off, and the green of
 * the leaf is pigment rather than a reaction in progress. The cases change the
 * keeper and the number of dark days, so the family derives each clause from
 * the parsed values.
 */

import { slugify } from '../../naming.mjs';

const SHEET_DAYLIGHT_PATTERN =
  /In daylight the green plant in ([A-Z][a-z]+)’s pot makes sugars and oxygen from water and CO₂\./;
const SHEET_DARK_PATTERN = /In prolonged dark, production stops; reserves are used\./;
const SHEET_PALE_PATTERN = /A leaf covered opaque pales\./;
const SHEET_ROOTS_PATTERN = /Roots do not ‘see’ light\./;
const EPISODE_PATTERN =
  /([A-Z][a-z]+) keeps the plant (\d+) days in a cupboard and says it “makes oxygen, because it is green”\./;

function parse(statement) {
  const daylight = SHEET_DAYLIGHT_PATTERN.exec(statement);
  const episode = EPISODE_PATTERN.exec(statement);
  if (daylight === null || episode === null) {
    throw new Error('the statement does not describe the potted plant and the cupboard episode');
  }
  if (!SHEET_PALE_PATTERN.test(statement) || !SHEET_ROOTS_PATTERN.test(statement)) {
    throw new Error('the statement does not state what a covered leaf does and that roots do not see light');
  }
  return {
    keeper: daylight[1],
    actor: episode[1],
    daysInDark: Number(episode[2]),
    inDark: true,
    productionStopsInDark: SHEET_DARK_PATTERN.test(statement),
    coveredLeafPales: SHEET_PALE_PATTERN.test(statement),
    claimsGreenMakesOxygen: true
  };
}

function solve(slots) {
  const productionClause = slots.inDark && slots.productionStopsInDark
    ? 'Light production is off.'
    : 'Light production continues.';
  const pigmentClause = slots.claimsGreenMakesOxygen
    ? 'Green is pigment, not a reaction in progress.'
    : 'Green is the pigment of the leaf.';
  return { productionClause, pigmentClause };
}

function render(solution) {
  return `${solution.productionClause} ${solution.pigmentClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.keeper === "string" && slots.keeper.length > 0, "the sheet must name the keeper of the pot");',
  'probe(slots.actor === slots.keeper, "the cupboard episode must be about the keeper of the pot");',
  'probe(Number.isInteger(slots.daysInDark) && slots.daysInDark > 0, "the cupboard stay must be a positive whole number of days");',
  'probe(slots.inDark === true, "the case must place the plant in the dark");',
  'probe(slots.productionStopsInDark === true, "the sheet must stop production in prolonged dark");',
  'probe(slots.claimsGreenMakesOxygen === true, "the case must state the claim that green makes oxygen");',
  'const productionClause = slots.inDark && slots.productionStopsInDark',
  '  ? "Light production is off."',
  '  : "Light production continues.";',
  'const pigmentClause = slots.claimsGreenMakesOxygen',
  '  ? "Green is pigment, not a reaction in progress."',
  '  : "Green is the pigment of the leaf.";',
  'return productionClause + " " + pigmentClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The sheet makes the sugars and the oxygen a daylight reaction of the plant in ${slots.keeper}'s pot, and a cupboard gives it no light at all for ${slots.daysInDark} days.`,
    'In prolonged dark the sheet stops that production and spends the reserves of the plant, so no oxygen is being made while the pot sits in the cupboard.',
    `The green of the leaf is pigment, and the sheet notes that a leaf covered opaque pales: green does not by itself mean that a reaction is in progress, so the reason ${slots.actor} gives does not hold.`
  ];
}

export const unit = 55;

export const cases = [
  {
    template: 'Plants, light, and water',
    type: slugify('Plants, light, and water'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
