/**
 * Section 40 of the adult-reasoning course: finite resources described in
 * numbers.
 *
 * Every variant reports a rain tank holding a stated number of litres, a
 * garden drinking a fixed daily dose, and rain due in a dozen days, together
 * with a notebook rule that forbids watering above the dose and asks for an
 * equal division across the days if the dose does not last. The verdict
 * multiplies the dose by the days, compares the product with the litres on
 * hand, and reports the surplus; the cases change the place, the gardener, the
 * tank level, and the daily dose.
 */

import { slugify } from '../../naming.mjs';

const TANK_PATTERN = /Rain tank, ([^:]+): (\d+) l today\./;
const DRINK_PATTERN = /([A-Z][a-z]+)[’']s garden drinks (\d+) l\/day\./;
const RAIN_PATTERN = /Rain in (\d+) days\./;

function parse(statement) {
  const tank = TANK_PATTERN.exec(statement);
  const drink = DRINK_PATTERN.exec(statement);
  const rain = RAIN_PATTERN.exec(statement);
  if (tank === null || drink === null || rain === null) {
    throw new Error('the statement does not carry the tank level, the daily dose, and the day the rain arrives');
  }
  if (!/No preventive watering above the dose\./.test(statement)) {
    throw new Error('the notebook does not state the ceiling on the daily dose');
  }
  return {
    place: tank[1].trim(),
    gardener: drink[1],
    available: Number(tank[2]),
    dose: Number(drink[2]),
    days: Number(rain[1])
  };
}

function solve(slots) {
  const needed = slots.dose * slots.days;
  if (needed > slots.available) {
    throw new Error('the current dose does not last until the rain, so the printed answer is the equal-division one');
  }
  return {
    dose: slots.dose,
    days: slots.days,
    needed,
    available: slots.available,
    left: slots.available - needed
  };
}

function render(solution) {
  return `Yes. ${solution.dose}×${solution.days}=${solution.needed} ≤ ${solution.available}. Left ${solution.left} l.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots === "object" && slots !== null, "the tank case must carry its parsed values");',
  'probe(typeof slots.gardener === "string" && slots.gardener.length > 0, "the garden must belong to a named person");',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the tank must stand in a named place");',
  'probe(Number.isInteger(slots.available) && slots.available > 0, "the tank level must be a positive whole number of litres");',
  'probe(Number.isInteger(slots.dose) && slots.dose > 0, "the daily dose must be a positive whole number of litres");',
  'probe(Number.isInteger(slots.days) && slots.days > 0, "the days until the rain must be a positive whole number");',
  'const needed = slots.dose * slots.days;',
  'probe(needed <= slots.available, "the current dose must last until the rain for this answer");',
  'const answer = "Yes. " + slots.dose + "×" + slots.days + "=" + needed + " ≤ " + slots.available + ". Left " + (slots.available - needed) + " l.";',
  'return answer;'
].join('\n');

function explain(slots, solution) {
  return [
    `The garden of ${slots.gardener} in ${slots.place} drinks ${solution.dose} l a day, and the rain is due in ${solution.days} days, so the whole stretch needs ${solution.dose}×${solution.days} = ${solution.needed} l.`,
    `The tank holds ${solution.available} l today, and ${solution.needed} ≤ ${solution.available}, so the current dose lasts and does not have to be divided across the days.`,
    `The reserve left when the rain arrives is ${solution.available} − ${solution.needed} = ${solution.left} l.`
  ];
}

export const unit = 40;

export const cases = [
  {
    template: 'Finite resources described in numbers',
    type: slugify('Finite resources described in numbers'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
