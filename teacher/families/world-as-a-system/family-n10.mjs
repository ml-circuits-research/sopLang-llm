/**
 * Family N10 of the world seed book: migration and population balance.
 *
 * Every problem states a town's starting population and one year of births,
 * deaths, people moving in, and people moving out. The answer keeps the two
 * components of the balance equation apart: natural change is births minus
 * deaths, migration change is in-migration minus out-migration, and the
 * year-end population is the starting population plus both changes. Each
 * component is printed with an explicit sign.
 *
 * The four grades share one computation; the variants differ in the stated
 * numbers. A grade could append a cross-domain check, so the family carries the
 * shared descriptor through parse, render, and the circuit.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const START_PATTERN = /begins the year with (\d+) residents/;
const FLOW_PATTERN = /births=(\d+), deaths=(\d+), people moving in=(\d+), people moving out=(\d+)/;

function signed(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const start = START_PATTERN.exec(facts);
  const flow = FLOW_PATTERN.exec(facts);
  if (start === null || flow === null) {
    throw new Error('the statement does not state a starting population and the four yearly flows');
  }
  return {
    start: Number(start[1]),
    births: Number(flow[1]),
    deaths: Number(flow[2]),
    movingIn: Number(flow[3]),
    movingOut: Number(flow[4]),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  const natural = slots.births - slots.deaths;
  const migration = slots.movingIn - slots.movingOut;
  return { natural, migration, end: slots.start + natural + migration, crossDomain: slots.crossDomain };
}

function render(solution) {
  const main = `Natural change ${signed(solution.natural)}; migration change ${signed(solution.migration)}; end population ${solution.end}.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const WIRES = [
  {
    name: 'cross',
    command: 'jsEval',
    body: [
      CROSS_DOMAIN_SOURCE,
      'const slots = $slots;',
      'return { suffix: renderCrossDomain(slots.crossDomain) };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const slots = $slots;',
  'const natural = slots.births - slots.deaths;',
  'const migration = slots.movingIn - slots.movingOut;',
  'const end = slots.start + natural + migration;',
  'probe(Number.isFinite(end) && end > 0, "the year-end population must be a positive number");',
  'const sign = (value) => value >= 0 ? "+" + value : String(value);',
  'const main = "Natural change " + sign(natural) + "; migration change " + sign(migration) + "; end population " + end + ".";',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `Natural change compares births with deaths: ${slots.births} − ${slots.deaths} = ${signed(solution.natural)}.`,
    `Migration change compares people moving in with people moving out: ${slots.movingIn} − ${slots.movingOut} = ${signed(solution.migration)}.`,
    `The year-end population adds both components to the starting population of ${slots.start}, giving ${slots.start} ${signed(solution.natural)} ${signed(solution.migration)} = ${solution.end}.`
  ];
}

function caseFor(grade) {
  const template = `Migration and population balance (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N10';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
