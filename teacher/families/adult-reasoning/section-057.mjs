/**
 * Section 57 of the adult-reasoning course: micro-organisms in an educational
 * text.
 *
 * Every variant quotes the same hygiene sheet — some micro-organisms in live
 * yoghurt are wanted, a warm wet sponge favours growth, soap-and-water washing
 * reduces numbers on skin without sterilising, and a one-minute boil is the
 * sheet's method for uncertain water on a hike — and then describes one person
 * who puts the sponge on a radiator, skips the wash before the yoghurt, and
 * boils the spring water. The verdict separates the aligned act from the two
 * that work against the sheet. The cases change the name and the boil length,
 * so the family derives each clause from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const SHEET_BOIL_PATTERN = /A (\d+)-minute boil is the sheet’s method for uncertain water on a hike/;
const ACTION_PATTERN =
  /([A-Z][a-z]+) (puts a wet sponge on a radiator|leaves the sponge cold), (does not wash|washes) before yoghurt, boils uncertain spring water (\d+) minute/;

function parse(statement) {
  const sheetBoil = SHEET_BOIL_PATTERN.exec(statement);
  const action = ACTION_PATTERN.exec(statement);
  if (sheetBoil === null || action === null) {
    throw new Error('the statement does not quote the sheet and describe the sponge, the hands, and the boil');
  }
  return {
    person: action[1],
    warmWetSponge: action[2] === 'puts a wet sponge on a radiator',
    washedBeforeYoghurt: action[3] === 'washes',
    boilMinutes: Number(action[4]),
    sheetBoilMinutes: Number(sheetBoil[1])
  };
}

function solve(slots) {
  if (!Number.isInteger(slots.boilMinutes) || slots.boilMinutes <= 0) {
    throw new Error('the boil length must be a positive whole number of minutes');
  }
  if (!Number.isInteger(slots.sheetBoilMinutes) || slots.sheetBoilMinutes <= 0) {
    throw new Error('the sheet must state its own boil method');
  }
  const boilClause =
    slots.boilMinutes === slots.sheetBoilMinutes
      ? 'The boil is aligned.'
      : `A ${slots.boilMinutes}-minute boil does not match the sheet.`;
  const spongeClause = slots.warmWetSponge
    ? 'The warm wet sponge works against.'
    : 'The cold sponge does not favour growth.';
  const handsClause = slots.washedBeforeYoghurt
    ? 'Washed hands reduce numbers before food.'
    : 'Unwashed hands do not reduce numbers before food.';
  return { boilClause, spongeClause, handsClause };
}

function render(solution) {
  return `${solution.boilClause} ${solution.spongeClause} ${solution.handsClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.person === "string" && slots.person.length > 0, "the case must name the person");',
  'probe(typeof slots.warmWetSponge === "boolean", "the case must state where the sponge was put");',
  'probe(typeof slots.washedBeforeYoghurt === "boolean", "the case must state whether the person washed");',
  'probe(Number.isInteger(slots.boilMinutes) && slots.boilMinutes > 0, "the boil length must be a positive whole number of minutes");',
  'probe(Number.isInteger(slots.sheetBoilMinutes) && slots.sheetBoilMinutes > 0, "the sheet must state its own boil method");',
  'const boilClause = slots.boilMinutes === slots.sheetBoilMinutes',
  '  ? "The boil is aligned."',
  '  : "A " + slots.boilMinutes + "-minute boil does not match the sheet.";',
  'const spongeClause = slots.warmWetSponge',
  '  ? "The warm wet sponge works against."',
  '  : "The cold sponge does not favour growth.";',
  'const handsClause = slots.washedBeforeYoghurt',
  '  ? "Washed hands reduce numbers before food."',
  '  : "Unwashed hands do not reduce numbers before food.";',
  'return boilClause + " " + spongeClause + " " + handsClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.person} boils the uncertain spring water for ${slots.boilMinutes} minute, which is exactly the sheet's ${slots.sheetBoilMinutes}-minute method, so ${solution.boilClause.toLowerCase()}`,
    slots.warmWetSponge
      ? 'A wet sponge left on a radiator is warm and wet, the two conditions the sheet names for growth, so the sponge works against the sheet.'
      : 'A cold sponge does not offer the warmth the sheet names for growth, so it does not work against the sheet.',
    slots.washedBeforeYoghurt
      ? 'Washing with soap and water reduces the numbers on the skin before the yoghurt is handled, which is what the sheet asks for.'
      : 'Skipping the wash leaves the numbers on the skin when the yoghurt is handled, and the sheet says soap-and-water washing reduces them.'
  ];
}

export const unit = 57;

export const cases = [
  {
    template: 'Micro-organisms in an educational text',
    type: slugify('Micro-organisms in an educational text'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
