/**
 * Family G9 of the world seed book: exchange, routes, and capacities.
 *
 * Every problem states that goods move between two places along two branches,
 * each branch a chain of directed edges with a capacity. A branch can only
 * carry its narrowest edge, and the independent branch capacities add up; from
 * grade 3 on the facts also state a destination limit that caps the sum. The
 * four grades share one computation and differ in whether the limit is stated,
 * so their cases share the parse, solve, render, compute, and explain
 * functions and declare only their own printed template.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const EDGE_PATTERN = /([A-Z][A-Za-z]+)→([A-Z][A-Za-z]+) capacity (\d+)/g;
const HEADER_PATTERN = /Goods move from ([A-Z][A-Za-z]+) to ([A-Z][A-Za-z]+) along [a-z]+ branch(?:es)?:/;
const LIMIT_PATTERN = /The final warehouse at ([A-Z][A-Za-z]+) can accept at most (\d+) units\./;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const header = HEADER_PATTERN.exec(facts);
  if (header === null) {
    throw new Error('the facts do not state a move between two places along branches');
  }
  const limit = LIMIT_PATTERN.exec(facts);
  const branchText = facts.slice(header.index + header[0].length, limit === null ? undefined : limit.index);
  const branches = branchText
    .split(';')
    .map((segment) => segment.trim())
    .filter((segment) => segment !== '')
    .map((segment) => {
      const edges = [...segment.matchAll(EDGE_PATTERN)].map((match) => ({
        from: match[1],
        to: match[2],
        capacity: Number(match[3])
      }));
      if (edges.length === 0) {
        throw new Error('a stated branch carries no edge capacity');
      }
      return { edges };
    });
  if (branches.length === 0) {
    throw new Error('the facts state no branch');
  }
  return {
    origin: header[1],
    destination: header[2],
    branches,
    destinationLimit: limit === null ? null : Number(limit[2]),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

// A branch is a series of edges, so it cannot carry more than its narrowest
// edge. Branches do not share an edge in this family, so their capacities are
// independent and may be added; a stated destination limit then caps the sum.
function branchCapacity(branch) {
  return Math.min(...branch.edges.map((edge) => edge.capacity));
}

function solve(slots) {
  for (const branch of slots.branches) {
    if (branch.edges.some((edge) => !Number.isInteger(edge.capacity) || edge.capacity <= 0)) {
      throw new Error('every edge capacity must be a positive whole number of units');
    }
  }
  const branchCapacities = slots.branches.map(branchCapacity);
  const total = branchCapacities.reduce((sum, capacity) => sum + capacity, 0);
  if (slots.destinationLimit !== null && (!Number.isInteger(slots.destinationLimit) || slots.destinationLimit <= 0)) {
    throw new Error('the stated destination limit must be a positive whole number of units');
  }
  const maximum = slots.destinationLimit === null ? total : Math.min(total, slots.destinationLimit);
  return {
    origin: slots.origin,
    destination: slots.destination,
    branchCapacities,
    total,
    destinationLimit: slots.destinationLimit,
    maximum,
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const suffix = renderCrossDomain(solution.crossDomain);
  const main = `${solution.maximum} units.`;
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Array.isArray(slots.branches) && slots.branches.length > 0, "the statement must describe at least one branch");',
  'probe(typeof slots.origin === "string" && typeof slots.destination === "string", "the goods must move between two named places");',
  'for (const branch of slots.branches) {',
  '  probe(Array.isArray(branch.edges) && branch.edges.length > 0, "every branch must state at least one edge");',
  '  probe(branch.edges.every((edge) => Number.isInteger(edge.capacity) && edge.capacity > 0), "every edge capacity must be a positive whole number of units");',
  '}',
  'const capacities = slots.branches.map((branch) => Math.min(...branch.edges.map((edge) => edge.capacity)));',
  'const total = capacities.reduce((sum, capacity) => sum + capacity, 0);',
  'probe(capacities.every((capacity) => capacity > 0), "every branch must be able to carry at least one unit");',
  'probe(slots.destinationLimit === null || (Number.isInteger(slots.destinationLimit) && slots.destinationLimit > 0), "a stated destination limit must be a positive whole number of units");',
  'const maximum = slots.destinationLimit === null ? total : Math.min(total, slots.destinationLimit);',
  'probe(maximum <= total, "a destination limit can never raise what the branches carry");',
  'const main = maximum + " units.";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const step = (capacity, index) => `Branch ${index + 1} is limited by its narrowest edge, so it carries ${capacity} units.`;
  const cap =
    solution.destinationLimit === null
      ? `No shared destination cap is stated, so the branches carry the full sum.`
      : `The destination accepts at most ${solution.destinationLimit} units, so the sum is capped at min(${solution.total}, ${solution.destinationLimit})=${solution.maximum}.`;
  return [
    `Each branch is a chain of edges, so it can only carry the smallest edge capacity along it.`,
    ...solution.branchCapacities.map(step),
    `The independent branch capacities add to ${solution.total} units on their way to ${solution.destination}.`,
    cap
  ];
}

function caseFor(grade) {
  const template = `Exchange, routes, and capacities (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'G9';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
