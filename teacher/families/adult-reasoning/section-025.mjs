/**
 * Section 25 of the adult-reasoning course: allergens and declared ingredients.
 *
 * Every variant prints the same biscuit label — a plain ingredient list that
 * names butter, a trace warning for soya and sesame, and a facility warning
 * that also processes peanuts — plus a canteen note that refuses any food
 * whose ingredient or warning names a declared allergen, treats traces and
 * the facility as risk, and calls butter a milk product. The guest declares a
 * peanut allergy and lactose intolerance, so two independent channels close
 * the case. The variants change the guest and the canteen's place, so the
 * family reads the channels out of the parsed label.
 */

import { slugify } from '../../naming.mjs';

const INGREDIENT_PATTERN = /Biscuit: “([^.]+)\./;
const BUTTER_PATTERN = /butter (\d+)%/;
const TRACE_PATTERN = /May contain traces of ([^.]+)\./;
const FACILITY_PATTERN = /Made in a facility that also processes ([^.]+)\./;
const NOTE_PATTERN = /Canteen note, ([^:]+):/;
const GUEST_PATTERN = /([A-Z][a-z]+) declared a peanut allergy and lactose intolerance\./;

function listOf(text) {
  return text
    .split(/ and |,/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function parse(statement) {
  const ingredientList = INGREDIENT_PATTERN.exec(statement);
  const butter = BUTTER_PATTERN.exec(statement);
  const traces = TRACE_PATTERN.exec(statement);
  const facility = FACILITY_PATTERN.exec(statement);
  const note = NOTE_PATTERN.exec(statement);
  const guest = GUEST_PATTERN.exec(statement);
  if (
    ingredientList === null ||
    butter === null ||
    traces === null ||
    facility === null ||
    note === null ||
    guest === null
  ) {
    throw new Error('the statement does not print the biscuit label, the canteen note, and the guest declaration');
  }
  return {
    ingredients: ingredientList[1].split(',').map((item) => item.trim()),
    butterPercent: Number(butter[1]),
    traces: listOf(traces[1]),
    facilityAllergens: listOf(facility[1]),
    canteen: note[1].trim(),
    guest: {
      name: guest[1],
      peanutAllergy: true,
      lactoseIntolerance: true
    }
  };
}

function solve(slots) {
  const channels = [];
  if (slots.guest.peanutAllergy && slots.facilityAllergens.some((item) => /^peanuts?$/.test(item))) {
    channels.push('Peanuts in the facility warning');
  }
  if (slots.guest.lactoseIntolerance && slots.ingredients.some((item) => /^butter/.test(item))) {
    channels.push('butter/milk as an ingredient');
  }
  if (channels.length === 0) {
    throw new Error('the label names no declared allergen, which is not this section pattern');
  }
  return { channels, guest: slots.guest.name };
}

function render(solution) {
  const enough = solution.channels.length > 1 ? 'Each channel alone is enough.' : 'One channel is enough.';
  return `${solution.channels.join('; ')}. ${enough}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const channels = [];',
  'if (slots.guest.peanutAllergy && slots.facilityAllergens.some((item) => /^peanuts?$/.test(item))) { channels.push("Peanuts in the facility warning"); }',
  'if (slots.guest.lactoseIntolerance && slots.ingredients.some((item) => /^butter/.test(item))) { channels.push("butter/milk as an ingredient"); }',
  'probe(channels.length > 0, "at least one channel must name a declared allergen");',
  'const enough = channels.length > 1 ? "Each channel alone is enough." : "One channel is enough.";',
  'return channels.join("; ") + ". " + enough;'
].join('\n');

function explain(slots, solution) {
  return [
    `The label is a closed world: the ingredient list ${slots.ingredients.join(', ')} names butter at ${slots.butterPercent}%, the trace warning names ${slots.traces.join(' and ')}, and the facility warning names ${slots.facilityAllergens.join(' and ')}.`,
    `${slots.guest.name} declared a peanut allergy and lactose intolerance, and the canteen note of ${slots.canteen} refuses any food whose ingredient or warning names a declared allergen.`,
    `Two independent channels close the case: ${solution.channels[0]}, and the butter that the note calls a milk product.`,
    'The traces and the facility line count as risk, and each channel alone is enough, so the refusal does not need both.'
  ];
}

export const unit = 25;

export const cases = [
  {
    template: 'Allergens and declared ingredients',
    type: slugify('Allergens and declared ingredients'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
