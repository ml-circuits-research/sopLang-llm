#!/usr/bin/env node
/**
 * Diagnostic development suite (astra_review I1/I2).
 *
 * The series so far measures a single number — executed-answer accuracy on the
 * holdout — and every interpretation of it has been an inference. This module
 * builds a small suite whose latent computation is known exactly, so the same
 * checkpoint can be asked four different questions about the same problems and
 * the failing stage can be identified instead of assumed:
 *
 *   normal       the statement alone (the deployable condition);
 *   values       the statement plus the correct extracted values and their roles;
 *   plan         the statement plus the correct operator graph, without values;
 *   both         values and graph supplied; the model still emits executable SOP.
 *
 * The last three are oracle-assisted diagnostics and are recorded as such; their
 * scores must never be reported as ordinary task performance.
 *
 * A problem is a latent graph of typed operators over instance values. The graph
 * is generated first, the oracle is computed from it, and only then is a
 * sentence rendered, so the split is a property of the structure (the operator
 * sequence and the value roles) rather than of the wording. Several renderers
 * phrase the same graph, and the split keeps a whole structure on one side.
 *
 * The suite is evaluation-only material: nothing here enters training.
 */

import { createHash } from 'node:crypto';

/** The operators the suite composes. Each is total on its declared input type. */
export const OPERATORS = Object.freeze({
  filterAbove: {
    arity: 1,
    takes: 'list',
    steps: (values, parameters) => values.filter((value) => value > parameters.threshold),
    describe: (parameters) => `keep only the values above ${parameters.threshold}`
  },
  total: {
    arity: 1,
    takes: 'list',
    steps: (values) => values.reduce((sum, value) => sum + value, 0),
    describe: () => 'add the kept values'
  },
  count: {
    arity: 1,
    takes: 'list',
    steps: (values) => values.length,
    describe: () => 'count the kept values'
  },
  largest: {
    arity: 1,
    takes: 'list',
    steps: (values) => Math.max(...values),
    describe: () => 'take the largest kept value'
  },
  double: {
    arity: 1,
    takes: 'scalar',
    steps: (value) => value * 2,
    describe: () => 'double it'
  },
  addRate: {
    arity: 1,
    takes: 'scalar',
    steps: (value, parameters) => value + parameters.rate,
    describe: (parameters) => `add the fixed charge of ${parameters.rate} units`
  },
  perUnit: {
    arity: 1,
    takes: 'scalar',
    steps: (value, parameters) => value * parameters.perUnit,
    describe: (parameters) => `multiply it by the ${parameters.perUnit} units per item`
  }
});

/** Deterministic PRNG (mulberry32), so a suite is reproduced from its seed alone. */
function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(random, values) {
  return values[Math.min(values.length - 1, Math.floor(random() * values.length))];
}

const SUBJECTS = ['the workshop', 'the depot', 'the clinic', 'the print shop', 'the laboratory'];
const UNITS = ['units', 'parts', 'crates', 'litres', 'tickets'];
const TIMES = ['this morning', 'on Monday', 'after the audit', 'before lunch', 'last week'];

/** The operator sequences the suite teaches and tests: structure is the split unit. */
export const STRUCTURES = Object.freeze([
  { id: 'filter-total', chain: ['filterAbove', 'total'] },
  { id: 'filter-count', chain: ['filterAbove', 'count'] },
  { id: 'filter-largest-double', chain: ['filterAbove', 'largest', 'double'] },
  { id: 'filter-total-add-rate', chain: ['filterAbove', 'total', 'addRate'] },
  { id: 'filter-count-per-unit', chain: ['filterAbove', 'count', 'perUnit'] },
  { id: 'filter-largest-add-rate', chain: ['filterAbove', 'largest', 'addRate'] }
]);

/**
 * One problem: a structure, the instance values, the parameters its operators
 * need, and the oracle computed from the graph. `describe` renders both the
 * statement and the two diagnostic inputs from the same latent record, so the
 * oracle-assisted conditions never carry more than their declared input.
 */
export function generateProblem({ structure, random, renderer }) {
  const count = 5 + Math.floor(random() * 4);
  const values = Array.from({ length: count }, () => 2 + Math.floor(random() * 40));
  const threshold = 8 + Math.floor(random() * 20);
  const parameters = {
    threshold,
    rate: 3 + Math.floor(random() * 9),
    perUnit: 2 + Math.floor(random() * 5)
  };
  // Every structure must be observable: at least two values pass the filter and
  // at least one does not, so a wrong threshold or a missing filter changes the
  // answer instead of coinciding with the right one.
  const kept = values.filter((value) => value > threshold);
  if (kept.length < 2 || kept.length === values.length) return null;

  let current = kept;
  const stages = [];
  for (const name of structure.chain) {
    const operator = OPERATORS[name];
    if (operator.takes === 'scalar' && Array.isArray(current)) return null;
    if (operator.takes === 'list' && !Array.isArray(current)) return null;
    current = operator.steps(current, parameters);
    stages.push({ operator: name, value: current });
  }
  if (!Number.isFinite(current) || (Array.isArray(current) && current.length === 0)) return null;
  if (Number.isInteger(current) === false) return null;

  const problem = {
    structure: structure.id,
    values,
    parameters,
    kept,
    oracle: current,
    subject: pick(random, SUBJECTS),
    unit: pick(random, UNITS),
    time: pick(random, TIMES),
    renderer
  };
  problem.statement = renderStatement(problem, renderer);
  problem.valueRecord = renderValueRecord(problem);
  problem.planRecord = renderPlanRecord(problem);
  return problem;
}

function renderStatement(problem, renderer) {
  const list = problem.values.length === 1
    ? `${problem.values[0]}`
    : `${problem.values.slice(0, -1).join(', ')} and ${problem.values.at(-1)}`;
  const opening = [
    `${problem.subject[0].toUpperCase()}${problem.subject.slice(1)} recorded ${list} ${problem.unit} ${problem.time}.`,
    `At ${problem.subject}, ${list} ${problem.unit} were logged ${problem.time}.`,
    `The log of ${problem.subject} ${problem.time} holds ${list} ${problem.unit}.`
  ][renderer % 3];
  const closing = {
    'filter-total': `keep only the records above ${problem.parameters.threshold} ${problem.unit}, then report the total of the kept records plus the fixed charge of ${problem.parameters.rate} ${problem.unit} that applies to every order.`,
    'filter-count': `keep only the records above ${problem.parameters.threshold} ${problem.unit}, then report how many records were kept.`,
    'filter-largest-double': `keep only the records above ${problem.parameters.threshold} ${problem.unit}, then report the largest kept record doubled.`,
    'filter-total-add-rate': `keep only the records above ${problem.parameters.threshold} ${problem.unit}, then report the total of the kept records plus the fixed charge of ${problem.parameters.rate} ${problem.unit} that applies to every order.`,
    'filter-count-per-unit': `keep only the records above ${problem.parameters.threshold} ${problem.unit}, then report how many records were kept multiplied by the ${problem.parameters.perUnit} labels printed on each kept record.`,
    'filter-largest-add-rate': `keep only the records above ${problem.parameters.threshold} ${problem.unit}, then report the largest kept record plus the fixed charge of ${problem.parameters.rate} ${problem.unit}.`
  }[problem.structure];
  return `${opening} Please ${closing}`;
}

/** The values-and-roles input of the `values` diagnostic condition. */
function renderValueRecord(problem) {
  const roles = [
    `recorded values: [${problem.values.join(', ')}]`,
    `threshold: ${problem.parameters.threshold}`
  ];
  if (problem.structure.includes('add-rate')) roles.push(`fixedCharge: ${problem.parameters.rate}`);
  if (problem.structure.includes('per-unit')) roles.push(`labelsPerRecord: ${problem.parameters.perUnit}`);
  return roles.join('\n');
}

/** The operator-graph input of the `plan` diagnostic condition, without values. */
function renderPlanRecord(problem) {
  const lines = STRUCTURES.find((structure) => structure.id === problem.structure).chain.map((name, index) => {
    const operator = OPERATORS[name];
    const parameters = ['filterAbove', 'addRate', 'perUnit'].includes(name)
      ? ` parameters: ${JSON.stringify(
          name === 'filterAbove'
            ? { threshold: problem.parameters.threshold }
            : name === 'addRate'
              ? { rate: problem.parameters.rate }
              : { perUnit: problem.parameters.perUnit }
        )}`
      : '';
    return `${index + 1}. ${name}${parameters}: ${operator.describe(problem.parameters)}`;
  });
  return lines.join('\n');
}

/**
 * The suite: a declared number of problems per structure, with the structures
 * split into a `development` side (its graphs may be taught later) and a
 * `held` side (its compositions are reserved), decided before any rendering.
 */
export function buildDiagnosticSuite({ seed = 20260922, perStructure = 10, structures = STRUCTURES } = {}) {
  const random = seededRandom(seed);
  const problems = [];
  for (const structure of structures) {
    let made = 0;
    let attempts = 0;
    while (made < perStructure && attempts < perStructure * 200) {
      attempts += 1;
      const renderer = attempts % 3;
      const problem = generateProblem({ structure, random, renderer });
      if (problem === null) continue;
      problems.push({
        ...problem,
        id: `${structure.id}-${String(made + 1).padStart(3, '0')}`,
        split: structure.id === 'filter-total-add-rate' || structure.id === 'filter-count-per-unit' ? 'held' : 'development'
      });
      made += 1;
    }
    if (made < perStructure) {
      throw new Error(`${structure.id}: the generator produced only ${made} of ${perStructure} problems`);
    }
  }
  return {
    profile: `diagnostic-suite-1.0.0`,
    seed,
    perStructure,
    structures: structures.map((structure) => structure.id),
    problems
  };
}

/** The plan fingerprint of a problem: its structure and the constant parameters its operators read. */
export function structureFingerprint(problem) {
  const text = `${problem.structure}|${JSON.stringify(problem.parameters)}`;
  return createHash('sha256').update(text).digest('hex').slice(0, 12);
}
