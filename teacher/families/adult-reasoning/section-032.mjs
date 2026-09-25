/**
 * Section 32 of the adult-reasoning course: power, time, and consumption.
 *
 * Every variant posts the course sheet (“1000 W × 1 h = 1 kWh. Course round
 * price: 1.00 per kWh.”) beside one bulb and one person who leaves it on for a
 * number of hours per night over a number of nights. The verdict converts
 * watt-hours to kilowatt-hours, rounds to two decimals the way the sheet
 * rounds, and prices the rounded figure at the round price. The variants
 * change the bulb power, the nightly hours, the nights, the round price, and
 * the person's name, so the family derives both numbers from the parsed
 * values.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN =
  /Bulb (\d+) W\. Sheet: “1000 W × 1 h = 1 kWh\. Course round price: ([\d.]+) per kWh\.”/;
const USER_PATTERN =
  /([A-Z][a-z]+) leaves the bulb on (\d+) h\/night, (\d+) nights\./;

function parse(statement) {
  const sheet = SHEET_PATTERN.exec(statement);
  const user = USER_PATTERN.exec(statement);
  if (sheet === null || user === null) {
    throw new Error('the statement does not carry the sheet and the person leaving the bulb on');
  }
  return {
    kwhRule: '1000 W × 1 h = 1 kWh',
    watts: Number(sheet[1]),
    pricePerKwh: Number(sheet[2]),
    name: user[1],
    hoursPerNight: Number(user[2]),
    nights: Number(user[3])
  };
}

/**
 * The sheet fixes one formula: watts / 1000 × hours × nights. The course
 * rounds to two decimals before pricing, so the money clause repeats the
 * rounded consumption instead of the raw one.
 */
function solve(slots) {
  if (!Number.isInteger(slots.watts) || slots.watts <= 0) {
    throw new Error('the bulb power must be a positive whole number of watts');
  }
  if (!Number.isInteger(slots.hoursPerNight) || slots.hoursPerNight <= 0 || slots.hoursPerNight > 24) {
    throw new Error('the nightly hours must be a positive whole number up to 24');
  }
  if (!Number.isInteger(slots.nights) || slots.nights <= 0) {
    throw new Error('the nights must be a positive whole number');
  }
  const wattHours = slots.watts * slots.hoursPerNight * slots.nights;
  const kwh = Math.round(wattHours / 10) / 100;
  const money = Math.round(kwh * slots.pricePerKwh * 100) / 100;
  return { kwhText: kwh.toFixed(2), moneyText: money.toFixed(2) };
}

function render(solution) {
  return `${solution.kwhText} kWh = ${solution.moneyText} in money at the round price.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const wattHours = slots.watts * slots.hoursPerNight * slots.nights;',
  'const kwh = Math.round(wattHours / 10) / 100;',
  'probe(kwh > 0, "the consumption of the bulb must be positive");',
  'const money = Math.round(kwh * slots.pricePerKwh * 100) / 100;',
  'probe(money > 0, "the priced consumption must be positive");',
  'return kwh.toFixed(2) + " kWh = " + money.toFixed(2) + " in money at the round price.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The sheet states that 1000 W for 1 h is 1 kWh, so ${slots.watts} W for ${slots.hoursPerNight} h on each of ${slots.nights} nights gives ${slots.watts * slots.hoursPerNight * slots.nights} Wh.`,
    `Dividing by 1000 and rounding to the two decimals of the course gives ${solution.kwhText} kWh, the figure the sheet then prices.`,
    `At the round price of ${slots.pricePerKwh} per kWh the consumption costs ${solution.moneyText}, which is why the printed money clause repeats the same number.`
  ];
}

export const unit = 32;

export const cases = [
  {
    template: 'Power, time, and consumption',
    type: slugify('Power, time, and consumption'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
