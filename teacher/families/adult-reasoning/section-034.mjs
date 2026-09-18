/**
 * Section 34 of the adult-reasoning course: drinking water, leaks, and meters.
 *
 * Every variant prints one village's water book (“index A → B m³, N per m³
 * including sewerage”), the drip table (10 drops / 10 s ≈ 3 l/h, 1000 l =
 * 1 m³), and one person's dripping tap over a number of days at a number of
 * hours per day. The verdict subtracts the two index readings for the billed
 * consumption and its cost, then converts the drip's litres into cubic metres
 * so the leak can be read against the index. The variants change the village,
 * the closing index, the price per cubic metre, the drip duration, and the
 * person's name, so the family derives every number from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const BOOK_PATTERN =
  /Water book, ([^:\n]+): index (\d+) → (\d+) m³, ([\d.]+) per m³ including sewerage\./;
const TABLE_PATTERN = /Table: 10 drops \/ 10 s ≈ (\d+) l\/h\. 1000 l = 1 m³\./;
const DRIP_PATTERN =
  /([A-Z][a-z]+)’s tap drips that way (\d+) days, (\d+) h\/day, on top of the index\./;

function parse(statement) {
  const book = BOOK_PATTERN.exec(statement);
  const table = TABLE_PATTERN.exec(statement);
  const drip = DRIP_PATTERN.exec(statement);
  if (book === null || table === null || drip === null) {
    throw new Error('the statement does not carry the water book, the drip table, and the dripping tap');
  }
  return {
    place: book[1].trim(),
    indexFrom: Number(book[2]),
    indexTo: Number(book[3]),
    pricePerCubicMetre: Number(book[4]),
    litresPerHour: Number(table[1]),
    litresPerCubicMetre: 1000,
    name: drip[1],
    days: Number(drip[2]),
    hoursPerDay: Number(drip[3])
  };
}

/**
 * The book bills the difference of the two index readings at the printed price
 * per cubic metre; the leak is the table's rate over the stated days and hours,
 * divided by 1000 to reach the same unit as the index.
 */
function solve(slots) {
  const indexUse = slots.indexTo - slots.indexFrom;
  if (!Number.isInteger(indexUse) || indexUse <= 0) {
    throw new Error('the closing index must be greater than the opening index');
  }
  const cost = Math.round(indexUse * slots.pricePerCubicMetre * 100) / 100;
  const dripLitres = slots.litresPerHour * slots.hoursPerDay * slots.days;
  if (!Number.isInteger(dripLitres) || dripLitres <= 0) {
    throw new Error('the dripping tap must lose a positive whole number of litres');
  }
  const dripCubicMetres = dripLitres / slots.litresPerCubicMetre;
  return {
    indexUse,
    cost,
    dripLitres,
    dripText: dripCubicMetres.toFixed(2)
  };
}

function render(solution) {
  return `Index ${solution.indexUse} m³ = ${solution.cost}. Drip ${solution.dripText} m³ (${solution.dripLitres} l).`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the village whose water book is read");',
  'probe(typeof slots.name === "string" && slots.name.length > 0, "the case must name the person with the dripping tap");',
  'probe(Number.isInteger(slots.indexFrom) && Number.isInteger(slots.indexTo) && slots.indexTo > slots.indexFrom, "the two index readings must be whole numbers in increasing order");',
  'probe(typeof slots.pricePerCubicMetre === "number" && slots.pricePerCubicMetre > 0, "the book must state a positive price per cubic metre");',
  'probe(Number.isInteger(slots.litresPerHour) && slots.litresPerHour > 0, "the drip table must state a positive rate in litres per hour");',
  'probe(slots.litresPerCubicMetre === 1000, "the table must equate 1000 litres with one cubic metre");',
  'probe(Number.isInteger(slots.days) && slots.days > 0, "the drip must last a positive whole number of days");',
  'probe(Number.isInteger(slots.hoursPerDay) && slots.hoursPerDay > 0 && slots.hoursPerDay <= 24, "the drip must run a positive whole number of hours per day, at most 24");',
  'const indexUse = slots.indexTo - slots.indexFrom;',
  'const cost = Math.round(indexUse * slots.pricePerCubicMetre * 100) / 100;',
  'probe(cost > 0, "the billed cost must be positive");',
  'const dripLitres = slots.litresPerHour * slots.hoursPerDay * slots.days;',
  'probe(dripLitres > 0, "the leak must lose a positive number of litres");',
  'const dripText = (dripLitres / slots.litresPerCubicMetre).toFixed(2);',
  'return "Index " + indexUse + " m³ = " + cost + ". Drip " + dripText + " m³ (" + dripLitres + " l).";'
].join('\n');

function explain(slots, solution) {
  return [
    `The book charges the difference between the two readings, so ${slots.indexTo} minus ${slots.indexFrom} gives ${solution.indexUse} m³ and, at ${slots.pricePerCubicMetre} per m³, a cost of ${solution.cost}.`,
    `The table is the authority for the leak: ${slots.litresPerHour} l/h for ${slots.hoursPerDay} h on each of ${slots.days} days is ${solution.dripLitres} l.`,
    `Because 1000 l is 1 m³, the drip is ${solution.dripText} m³ on top of the index, which is why the printed answer keeps both units for the same water.`
  ];
}

export const unit = 34;

export const cases = [
  {
    template: 'Drinking water, leaks, and meters',
    type: slugify('Drinking water, leaks, and meters'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
