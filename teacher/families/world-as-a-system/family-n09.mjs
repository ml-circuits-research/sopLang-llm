/**
 * Family N9 of the world seed book: renewable resources and sustainable use.
 *
 * Every problem states the starting stock of a forest resource, the units it
 * regenerates and the units people harvest each year, and a constant number of
 * years. The first answer is the stock after that many years (start plus the
 * per-year net change times the years); the second is the printed verdict,
 * "sustainable under the stated definition" when the rule "use is sustainable
 * over the period if stock does not decline" holds, and the negated verdict
 * otherwise.
 *
 * The four grades share one computation; the variants differ in the stated
 * numbers. A grade could append a cross-domain check, so the family carries the
 * shared descriptor through parse, render, and the circuit.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const START_PATTERN = /starts at (\d+) units/;
const FLOW_PATTERN = /regenerates (\d+) units and people harvest (\d+) units/;
const YEARS_PATTERN = /constant for (\d+) years/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const start = START_PATTERN.exec(facts);
  const flow = FLOW_PATTERN.exec(facts);
  const years = YEARS_PATTERN.exec(facts);
  if (start === null || flow === null || years === null) {
    throw new Error('the statement does not state a starting stock, a yearly flow, and a number of years');
  }
  return {
    start: Number(start[1]),
    regeneration: Number(flow[1]),
    harvest: Number(flow[2]),
    years: Number(years[1]),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  const net = slots.regeneration - slots.harvest;
  const stock = slots.start + slots.years * net;
  return { net, stock, sustainable: stock >= slots.start, crossDomain: slots.crossDomain };
}

function render(solution) {
  const verdict = solution.sustainable ? 'sustainable' : 'not sustainable';
  const main = `${solution.stock} units; ${verdict} under the stated definition.`;
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
  'const net = slots.regeneration - slots.harvest;',
  'const stock = slots.start + slots.years * net;',
  'probe(Number.isFinite(stock), "the stock after the stated years must be a finite number");',
  'const verdict = stock >= slots.start ? "sustainable" : "not sustainable";',
  'const main = stock + " units; " + verdict + " under the stated definition.";',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The annual net change is regeneration minus harvest, ${slots.regeneration} − ${slots.harvest} = ${solution.net} units per year.`,
    `Over ${slots.years} years the stock therefore changes by ${slots.years} × ${solution.net} = ${slots.years * solution.net} units, so the final stock is ${slots.start} + ${slots.years * solution.net} = ${solution.stock} units.`,
    `Comparing the final stock with the starting stock of ${slots.start} units shows the stock ${solution.sustainable ? 'does not decline' : 'declines'}, which makes the harvest ${solution.sustainable ? 'sustainable' : 'not sustainable'} under the stated definition.`
  ];
}

function caseFor(grade) {
  const template = `Renewable resources and sustainable use (grade ${grade})`;
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

export const unit = 'N9';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
