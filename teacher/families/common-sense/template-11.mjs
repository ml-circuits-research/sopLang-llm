/**
 * Template 11 of the common-sense book: sampling.
 *
 * Every variant states a target population of N people divided approximately
 * equally among four areas and three candidate methods: an open voluntary link
 * (self-selection), a random selection of a fixed number of people within each
 * area with nonresponse tracked separately (stratified random sampling), and a
 * single-site interview on one day (place-and-time selection). The goal is an
 * estimate for the whole population, so the method that gives every area an
 * explicit random path into the sample is the best basis for generalization,
 * and a larger sample of a self-selected or single-site group does not repair
 * its systematic selection bias.
 *
 * The fifty variants differ only in the population size (4000–12000) and in the
 * counts attached to the methods; the method that begins with random selection
 * within each area is always labelled M2, and its planned coverage of the
 * population is read from the parsed counts rather than assumed.
 */

import { slugify } from '../../naming.mjs';

const POPULATION_PATTERN = /The target population contains (\d+) people, divided approximately equally among ([a-z]+) areas/;
const METHOD_PATTERN = /(M\d+): (randomly select \d+ people from each area and track nonresponse separately|post an open link and keep the first \d+ voluntary responses|interview \d+ people entering one shopping center on a single Saturday)/g;
const SAMPLE_SIZE_PATTERN = /(\d+) people|first (\d+) voluntary responses/;
const AREA_COUNTS = Object.freeze({
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10
});

/**
 * The kind of selection a method uses, read from its own description: random
 * selection within every area, voluntary self-selection, or selection by place
 * and time.
 */
function kindOf(description) {
  if (description.startsWith('randomly select')) {
    return 'stratified';
  }
  if (description.startsWith('post an open link')) {
    return 'voluntary';
  }
  return 'venue';
}

function parse(statement) {
  const population = POPULATION_PATTERN.exec(statement);
  if (population === null) {
    throw new Error('the statement does not state the target population and its areas');
  }
  const areas = AREA_COUNTS[population[2]];
  if (areas === undefined) {
    throw new Error(`the statement divides the population among "${population[2]}" areas, which is not a stated count`);
  }
  METHOD_PATTERN.lastIndex = 0;
  const methods = [];
  let match = METHOD_PATTERN.exec(statement);
  while (match !== null) {
    const size = SAMPLE_SIZE_PATTERN.exec(match[2]);
    if (size === null) {
      throw new Error(`the method ${match[1]} does not state the size of the group it selects`);
    }
    methods.push({ label: match[1], kind: kindOf(match[2]), size: Number(size[1] ?? size[2]) });
    match = METHOD_PATTERN.exec(statement);
  }
  if (methods.length < 3) {
    throw new Error('the statement does not state the three candidate methods');
  }
  return { population: Number(population[1]), areas, methods };
}

function solve(slots) {
  const stratified = slots.methods.filter((method) => method.kind === 'stratified');
  if (stratified.length !== 1) {
    throw new Error('exactly one stated method must select randomly within each area');
  }
  const chosen = stratified[0];
  const planned = chosen.size * slots.areas;
  return {
    method: chosen.label,
    planned,
    perArea: chosen.size,
    population: slots.population,
    areas: slots.areas
  };
}

function render(solution) {
  return `${solution.method}, because it begins with random selection stratified by area and makes nonresponse observable.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Number.isInteger(slots.population) && slots.population > 0, "the target population must be a positive integer");',
  'probe(Number.isInteger(slots.areas) && slots.areas > 1, "the population must be divided among several areas");',
  'probe(Array.isArray(slots.methods) && slots.methods.length >= 3, "the statement must state the candidate methods");',
  'probe(slots.methods.every((method) => typeof method.label === "string" && Number.isInteger(method.size) && method.size > 0), "every method must carry a label and a positive group size");',
  'const stratified = slots.methods.filter((method) => method.kind === "stratified");',
  'probe(stratified.length === 1, "exactly one stated method must select randomly within each area");',
  'const chosen = stratified[0];',
  'probe(["voluntary", "venue"].every((kind) => slots.methods.some((method) => method.kind === kind)), "the statement must also state the voluntary and the single-site methods");',
  'const planned = chosen.size * slots.areas;',
  'probe(planned > 0, "the chosen method must plan to select a positive number of people");',
  'probe(planned < slots.population, "the chosen sample cannot exceed the target population");',
  'return chosen.label + ", because it begins with random selection stratified by area and makes nonresponse observable.";'
].join('\n');

function explain(slots, solution) {
  const described = slots.methods.map((method) => `${method.label} (${method.kind}, ${method.size}${method.kind === 'stratified' ? ' per area' : ''})`).join(', ');
  return [
    `The three stated methods are ${described}; only ${solution.method} selects people randomly inside every area, so only it gives each area a deliberate path into the sample.`,
    'An open link is filled by self-selection: whether someone sees it and chooses to answer is exactly what separates the sample from the population, so the larger voluntary group is still a group of volunteers.',
    'A single shopping center on a single Saturday draws from whoever visits that place at that time, so people who never go there cannot enter the sample no matter how many interviews are conducted.',
    `${solution.method} randomly selects ${solution.perArea} people in each of the ${solution.areas} areas, a planned ${solution.planned} of ${solution.population} people, and tracks nonresponse separately, so nonresponse can be measured instead of hidden; a larger sample would mostly shrink random error and would not repair systematic selection bias.`
  ];
}

export const unit = 11;

export const cases = [
  {
    template: 'Sampling',
    type: slugify('Sampling'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
