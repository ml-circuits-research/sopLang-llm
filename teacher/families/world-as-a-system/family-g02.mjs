/**
 * Family G2 of the world seed book: roads and routes.
 *
 * Every problem lists three candidate routes with their segment costs and the
 * printed total, asks which route a traveler should use, and grades 3-4 mark
 * one segment closed. A route is feasible only when none of its segments is
 * closed, and among the feasible routes the smallest printed total wins; the
 * listed totals are equal in this source, so the first feasible route in
 * printed order is the printed answer.
 *
 * The four grades share one computation: the variants differ in the stated
 * data and in whether a road is closed, not in the algorithm.
 */

import { blocksOf, stripCrossDomain } from './shared.mjs';

const ROUTE_PATTERN = /([A-Z][A-Za-z]+(?:–[A-Z][A-Za-z]+)+) has segment costs \[([\d, ]+)\] \(total (\d+)\)/g;
const CLOSED_PATTERN = /The road ([A-Z][A-Za-z]+–[A-Z][A-Za-z]+) is closed/g;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const routes = [];
  for (const match of facts.matchAll(ROUTE_PATTERN)) {
    routes.push({
      name: match[1],
      segments: match[1].split('–'),
      costs: match[2].split(',').map((value) => Number(value.trim())),
      total: Number(match[3])
    });
  }
  if (routes.length === 0) {
    throw new Error('the statement lists no candidate routes');
  }
  const closed = [];
  for (const match of facts.matchAll(CLOSED_PATTERN)) {
    closed.push(match[1]);
  }
  return { routes, closed };
}

function isFeasible(route, closed) {
  return closed.every((segment) => !route.name.includes(segment));
}

function solve(slots) {
  const feasible = slots.routes.filter((route) => isFeasible(route, slots.closed));
  if (feasible.length === 0) {
    throw new Error('every listed route uses a closed road');
  }
  let best = feasible[0];
  for (const route of feasible.slice(1)) {
    if (route.total < best.total) {
      best = route;
    }
  }
  return { name: best.name, total: best.total };
}

function render(solution) {
  return `Use ${solution.name}; total cost ${solution.total}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const usable = slots.routes.filter((route) => slots.closed.every((segment) => !route.name.includes(segment)));',
  'probe(usable.length > 0, "at least one listed route must avoid every closed road");',
  'let best = usable[0];',
  'for (const route of usable.slice(1)) {',
  '  if (route.total < best.total) {',
  '    best = route;',
  '  }',
  '}',
  'return "Use " + best.name + "; total cost " + best.total + ".";'
].join('\n');

function explain(slots, solution) {
  const closed = slots.closed.length === 0 ? 'no road is closed' : `the closed road ${slots.closed.join(', ')} removes some candidates`;
  return [
    `The statement lists ${slots.routes.length} candidate routes, and ${closed}.`,
    `Summing the segment costs of every feasible route leaves ${solution.total} as the smallest total, on ${solution.name}.`,
    `The chosen route is the first feasible route with that smallest total, and no feasible route costs less.`
  ];
}

function caseFor(grade) {
  return {
    template: `Roads and routes (grade ${grade})`,
    type: `roads-and-routes-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'G2';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
