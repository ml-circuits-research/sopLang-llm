/**
 * Family G7 of the world seed book: relief and movement cost.
 *
 * Every problem states the energy cost of each terrain, three routes as lists
 * of terrain segments, and an energy limit. The energy of a route is the sum of
 * the costs of its segments; a route above the limit is infeasible, and among
 * the feasible routes the smallest energy wins, with the printed order breaking
 * ties (the listed routes tie in this source).
 *
 * The four grades share one computation: the variants differ in the stated
 * routes and in the energy limit, not in the algorithm.
 */

import { blocksOf, stripCrossDomain } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const COSTS_PATTERN = /Terrain energy costs per segment: \{([^}]+)\}/;
const ROUTE_PATTERN = /(R\d+)=\[([^\]]*)\]/g;
const LIMIT_PATTERN = /spend at most (\d+) energy units/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const costsMatch = COSTS_PATTERN.exec(facts);
  if (costsMatch === null) {
    throw new Error('the statement lists no terrain energy costs');
  }
  const costs = {};
  for (const entry of costsMatch[1].split(',')) {
    const [terrain, cost] = entry.split(':').map((value) => value.trim());
    if (terrain === undefined || cost === undefined || terrain === '' || !Number.isFinite(Number(cost))) {
      throw new Error(`the terrain entry "${entry.trim()}" is not a named cost`);
    }
    costs[terrain.replace(/^['"]|['"]$/g, '')] = Number(cost);
  }
  const routes = [];
  for (const match of facts.matchAll(ROUTE_PATTERN)) {
    routes.push({
      name: match[1],
      terrains: match[2].split(',').map((value) => value.trim().replace(/^['"]|['"]$/g, '')).filter((value) => value !== '')
    });
  }
  if (routes.length === 0) {
    throw new Error('the statement lists no candidate route');
  }
  const limit = LIMIT_PATTERN.exec(facts);
  if (limit === null) {
    throw new Error('the statement states no energy limit');
  }
  return { costs, routes, limit: Number(limit[1]) };
}

function energyOf(route, costs) {
  let energy = 0;
  for (const terrain of route.terrains) {
    const cost = costs[terrain];
    if (cost === undefined) {
      throw new Error(`the route ${route.name} uses the unstated terrain "${terrain}"`);
    }
    energy += cost;
  }
  return energy;
}

function solve(slots) {
  const scored = slots.routes.map((route) => ({
    name: route.name,
    energy: energyOf(route, slots.costs)
  }));
  const feasible = scored.filter((route) => route.energy <= slots.limit);
  if (feasible.length === 0) {
    throw new Error('every listed route exceeds the energy limit');
  }
  let best = feasible[0];
  for (const route of feasible.slice(1)) {
    if (route.energy < best.energy) {
      best = route;
    }
  }
  return { name: best.name, energy: best.energy };
}

function render(solution) {
  return `Route ${solution.name}, using ${solution.energy} energy units.`;
}

const WIRES = [
  {
    name: 'best',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const scored = slots.routes.map((route) => {',
      '  let energy = 0;',
      '  for (const terrain of route.terrains) {',
      '    energy += slots.costs[terrain];',
      '  }',
      '  return { name: route.name, energy };',
      '});',
      'const feasible = scored.filter((route) => route.energy <= slots.limit);',
      'probe(feasible.length > 0, "at least one listed route must stay within the energy limit");',
      'let best = feasible[0];',
      'for (const route of feasible.slice(1)) {',
      '  if (route.energy < best.energy) {',
      '    best = route;',
      '  }',
      '}',
      'return { name: best.name, energy: best.energy };'
    ].join('\n')
  }
];

const COMPUTE = [
  'return "Route " + $best.name + ", using " + $best.energy + " energy units.";'
].join('\n');

function explain(slots, solution) {
  const energies = slots.routes.map((route) => `${route.name}=${energyOf(route, slots.costs)}`).join(', ');
  return [
    `The energy of a route is the sum of the costs of its terrain segments, so the candidates cost ${energies}.`,
    `A route that spends more than the stated limit of ${slots.limit} energy units is infeasible and drops out before the choice.`,
    `${solution.name} is the first feasible route with the smallest energy, ${solution.energy} units, and no feasible route uses less.`
  ];
}

function caseFor(grade) {
  const template = `Relief and movement cost (grade ${grade})`;
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

export const unit = 'G7';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
