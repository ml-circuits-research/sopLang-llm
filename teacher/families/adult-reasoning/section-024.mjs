/**
 * Section 24 of the adult-reasoning course: water, effort, and temperature.
 *
 * Every variant prints the same day-hike guide: 0.4 l per 10 kg of body mass
 * rounded up to the next 10 kg, an extra 0.5 l when noon is above 28 °C, an
 * extra 0.5 l for a route over 15 km, the exclusion of the 0.5 l drunk in the
 * morning, and the rule that the 150 ml pauses come from the pack rather than
 * from a reserve. The reader gives a body mass, a route length, and a noon
 * temperature; the answer prints each block of the sum and its total. The
 * variants change the hiker, the guide's district, the mass, the route, and
 * the temperature, so the family derives every block from the parsed guide.
 */

import { slugify } from '../../naming.mjs';

const GUIDE_PATTERN =
  /In the pack: ([\d.]+) l per (\d+) kg of body mass, rounded up to (\d+) kg\. Above (\d+) °C at noon: \+([\d.]+) l\. Over (\d+) km: \+([\d.]+) l\./;
const HIKER_PATTERN = /([A-Z][a-z]+) is (\d+) kg, route (\d+) km, noon (\d+) °C\./;
const PLACE_PATTERN = /Day-hike guide, ([^:]+):/;

function parse(statement) {
  const guide = GUIDE_PATTERN.exec(statement);
  const hiker = HIKER_PATTERN.exec(statement);
  const place = PLACE_PATTERN.exec(statement);
  if (guide === null || hiker === null || place === null) {
    throw new Error('the statement does not print the day-hike guide and the hiker plan');
  }
  return {
    place: place[1].trim(),
    rateTenths: Math.round(Number(guide[1]) * 10),
    roundingKg: Number(guide[2]),
    heatAboveC: Number(guide[4]),
    heatTenths: Math.round(Number(guide[5]) * 10),
    overKm: Number(guide[6]),
    effortTenths: Math.round(Number(guide[7]) * 10),
    hiker: hiker[1],
    massKg: Number(hiker[2]),
    routeKm: Number(hiker[3]),
    noonC: Number(hiker[4])
  };
}

function tenths(value) {
  return (value / 10).toFixed(1);
}

function solve(slots) {
  const blocks = Math.ceil(slots.massKg / slots.roundingKg);
  const baseTenths = blocks * slots.rateTenths;
  const heatTenths = slots.noonC > slots.heatAboveC ? slots.heatTenths : 0;
  const effortTenths = slots.routeKm > slots.overKm ? slots.effortTenths : 0;
  return {
    blocks,
    baseTenths,
    heatTenths,
    effortTenths,
    totalTenths: baseTenths + heatTenths + effortTenths,
    routeKm: slots.routeKm,
    overKm: slots.overKm
  };
}

function render(solution) {
  const heat = solution.heatTenths > 0 ? tenths(solution.heatTenths) : '0';
  const effort = solution.effortTenths > 0 ? tenths(solution.effortTenths) : '0';
  const comparison = solution.routeKm > solution.overKm ? '>' : '≤';
  return `${tenths(solution.baseTenths)} + ${heat} (heat) + ${effort} (${solution.routeKm}${comparison}${solution.overKm}) = ${tenths(solution.totalTenths)} l. Morning water is explicitly excluded.`;
}

const WIRES = [
  {
    name: 'sum',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const blocks = Math.ceil(slots.massKg / slots.roundingKg);',
      'const baseTenths = blocks * slots.rateTenths;',
      'const heatTenths = slots.noonC > slots.heatAboveC ? slots.heatTenths : 0;',
      'const effortTenths = slots.routeKm > slots.overKm ? slots.effortTenths : 0;',
      'const totalTenths = baseTenths + heatTenths + effortTenths;',
      'return { baseTenths, heatTenths, effortTenths, totalTenths };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const slots = $slots;',
  'const tenths = (value) => (value / 10).toFixed(1);',
  'const heat = $sum.heatTenths > 0 ? tenths($sum.heatTenths) : "0";',
  'const effort = $sum.effortTenths > 0 ? tenths($sum.effortTenths) : "0";',
  'const comparison = slots.routeKm > slots.overKm ? ">" : "\u2264";',
  'return tenths($sum.baseTenths) + " + " + heat + " (heat) + " + effort + " (" + slots.routeKm + comparison + slots.overKm + ") = " + tenths($sum.totalTenths) + " l. Morning water is explicitly excluded.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The guide, printed for ${slots.place}, rounds the mass up to the next ${slots.roundingKg} kg step, so ${slots.massKg} kg gives ${solution.blocks} steps and ${tenths(solution.baseTenths)} l of base reserve.`,
    `Noon is ${slots.noonC} °C, ${slots.noonC > slots.heatAboveC ? 'above' : 'not above'} the ${slots.heatAboveC} °C threshold, so the heat block is ${tenths(solution.heatTenths)} l.`,
    `The route is ${slots.routeKm} km against the ${slots.overKm} km threshold, so the effort block is ${solution.effortTenths > 0 ? tenths(solution.effortTenths) : '0'} l; the sum is ${tenths(solution.totalTenths)} l.`,
    'The 0.5 l drunk in the morning is explicitly excluded from the pack, and the 150 ml pauses are drunk from the pack rather than carried on top of it.'
  ];
}

export const unit = 24;

export const cases = [
  {
    template: 'Water, effort, and temperature',
    type: slugify('Water, effort, and temperature'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
