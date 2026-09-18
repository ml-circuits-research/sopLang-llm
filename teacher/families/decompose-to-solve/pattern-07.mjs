/**
 * Pattern 7 of the decompose-to-solve book: network routes and bottlenecks.
 *
 * Every variant states three routes, each a chain of sequential links with a
 * per-link time and a per-link capacity, a required flow, and a total route
 * time limit. The decomposition keeps the meanings apart: link times are
 * aggregated by addition, link capacities by minimum (the bottleneck), and
 * only then are the two whole-route summaries tested against the shared
 * constraints. A route is feasible when its bottleneck capacity carries the
 * required flow and its total time stays within the limit; the answer is the
 * feasible route with the smallest total time. The variants change the domain
 * phrase, the moved noun, the link numbers, and the constraint values, not the
 * method.
 */

import { slugify } from '../../naming.mjs';

const SUBJECT_PATTERN = /three routes can move the same ([a-z][a-z -]*)\./;
const ROUTE_PATTERN = /([ABC]): times \[(\d+(?:, \d+)*)\] min, capacities \[(\d+(?:, \d+)*)\]/g;
const FLOW_PATTERN = /The required flow is (\d+) units and total route time must not exceed (\d+) minutes\./;

function numbersOf(list) {
  return list.split(',').map((value) => Number(value.trim()));
}

function parse(statement) {
  const subject = SUBJECT_PATTERN.exec(statement);
  const flow = FLOW_PATTERN.exec(statement);
  if (subject === null || flow === null) {
    throw new Error('the statement does not state the moved subject, the required flow, and the time limit');
  }
  const routes = [];
  for (const match of statement.matchAll(ROUTE_PATTERN)) {
    const times = numbersOf(match[2]);
    const capacities = numbersOf(match[3]);
    if (times.length !== capacities.length) {
      throw new Error(`route ${match[1]} does not pair every link time with a link capacity`);
    }
    routes.push({ name: match[1], times, capacities });
  }
  if (routes.length !== 3) {
    throw new Error('the statement does not state three routes');
  }
  return {
    subject: subject[1].trim(),
    requiredFlow: Number(flow[1]),
    limitMinutes: Number(flow[2]),
    routes
  };
}

function summarize(routes) {
  return routes.map((route) => ({
    name: route.name,
    timeMinutes: route.times.reduce((total, minutes) => total + minutes, 0),
    bottleneck: Math.min(...route.capacities)
  }));
}

function solve(slots) {
  const summaries = summarize(slots.routes).map((summary) => ({
    ...summary,
    feasible: summary.bottleneck >= slots.requiredFlow && summary.timeMinutes <= slots.limitMinutes
  }));
  const feasible = summaries.filter((summary) => summary.feasible);
  if (feasible.length === 0) {
    throw new Error('no route carries the required flow within the time limit');
  }
  let chosen = feasible[0];
  for (const summary of feasible) {
    if (summary.timeMinutes < chosen.timeMinutes) {
      chosen = summary;
    }
  }
  return { summaries, chosen };
}

function render(solution) {
  return `Choose Route ${solution.chosen.name}. The decomposition uses different aggregation operators for different meanings: sequential times add, serial capacities take a minimum, then shared constraints filter entire-route summaries.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.routes) && slots.routes.length === 3, "the scenario must state three routes");',
  'probe(Number.isInteger(slots.requiredFlow) && slots.requiredFlow > 0, "the required flow must be a positive whole number");',
  'probe(Number.isInteger(slots.limitMinutes) && slots.limitMinutes > 0, "the route time limit must be a positive whole number");',
  'for (const route of slots.routes) {',
  '  probe(Array.isArray(route.times) && route.times.length === route.capacities.length, "every link time must be paired with a link capacity");',
  '  probe(route.times.every((minutes) => Number.isInteger(minutes) && minutes > 0), "every link time must be a positive whole number");',
  '  probe(route.capacities.every((capacity) => Number.isInteger(capacity) && capacity > 0), "every link capacity must be a positive whole number");',
  '}',
  'const summaries = slots.routes.map((route) => ({',
  '  name: route.name,',
  '  timeMinutes: route.times.reduce((total, minutes) => total + minutes, 0),',
  '  bottleneck: Math.min(...route.capacities)',
  '}));',
  'const feasible = summaries.filter((summary) => summary.bottleneck >= slots.requiredFlow && summary.timeMinutes <= slots.limitMinutes);',
  'probe(feasible.length > 0, "at least one route must carry the required flow within the time limit");',
  'let chosen = feasible[0];',
  'for (const summary of feasible) {',
  '  if (summary.timeMinutes < chosen.timeMinutes) {',
  '    chosen = summary;',
  '  }',
  '}',
  'probe(chosen.bottleneck >= slots.requiredFlow, "the chosen route must carry the required flow");',
  'probe(chosen.timeMinutes <= slots.limitMinutes, "the chosen route must stay within the time limit");',
  'probe(feasible.every((summary) => summary.timeMinutes >= chosen.timeMinutes), "no feasible route may be faster than the chosen route");',
  'return "Choose Route " + chosen.name + ". The decomposition uses different aggregation operators for different meanings: sequential times add, serial capacities take a minimum, then shared constraints filter entire-route summaries.";'
].join('\n');

function explain(slots, solution) {
  const details = solution.summaries
    .map(
      (summary) =>
        `Route ${summary.name} takes ${summary.timeMinutes} minutes and is limited by its narrowest link at ${summary.bottleneck} units, so it is ${summary.feasible ? 'feasible' : 'not feasible'} for a flow of ${slots.requiredFlow} within ${slots.limitMinutes} minutes`
    )
    .join('; ');
  return [
    `The ${slots.subject} are decomposed into three route summaries: ${details}.`,
    'The two meanings are aggregated separately: the sequential link times add up, while the serial link capacities take a minimum because the narrowest link caps the whole route.',
    `The shared constraints then filter the whole-route summaries, and among the feasible routes Route ${solution.chosen.name} is the fastest at ${solution.chosen.timeMinutes} minutes, so it is the answer; the sum of link capacities is a distractor.`
  ];
}

export const unit = 7;

export const cases = [
  {
    template: 'Network Routes and Bottlenecks',
    type: slugify('Network Routes and Bottlenecks'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
