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
/** Turn a stream key into a 32-bit seed, so a named stream is reproducible. */
function seedForStream(key) {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

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

/**
 * The contrastive suite: the same latent task rendered as a pair, so the two
 * conditions of a pair can be scored together.
 *
 * This is the measurement the contrastive arm is built for. `buildDiagnosticSuite`
 * asks one question per problem and counts single answers; a model that completes
 * the nearest memorized family scores the same on both members of a pair without
 * reading either decisive phrase, so single-answer accuracy cannot see the
 * difference the arm is supposed to make. Here each pair is generated from one
 * draw: `statement` carries the decisive phrase of that member and nothing else
 * changes, the oracle of each member is computed from the member's own parse, and
 * a pair is `both_correct` only when both answers match. Two identical wrong
 * answers do not pass, which is exactly the pattern-completion failure mode.
 *
 * The pairs are the three shipped shapes of `teacher/procedural/contrastive.mjs`,
 * rendered over the diagnostic's own subjects and units so this suite stays
 * independent of the training renderer's phrasing: a pair whose wording the model
 * has memorized would measure recall of the wording rather than reading of the
 * decisive phrase.
 */
export const CONTRASTIVE_PAIRS = Object.freeze([
  Object.freeze({
    kind: 'boundary-inclusion-pair',
    members: Object.freeze([
      { role: 'above', decisive: 'above' },
      { role: 'at-least', decisive: 'at least' }
    ]),
    // filter -> count: the pair's difference is visible in whether the record
    // equal to the threshold joins the kept list, and the count states it.
    chain: Object.freeze(['filterAbove', 'count'])
  }),
  Object.freeze({
    kind: 'direction-pair',
    members: Object.freeze([
      { role: 'largest', decisive: 'largest' },
      { role: 'smallest', decisive: 'smallest' }
    ]),
    chain: Object.freeze(['largest', 'double'])
  }),
  Object.freeze({
    kind: 'rate-vs-absolute-pair',
    members: Object.freeze([
      { role: 'percent', decisive: 'percent' },
      { role: 'absolute', decisive: 'absolute' }
    ]),
    chain: Object.freeze(['total', 'addRate'])
  })
]);

/** The operator chains the pair members run; the `filterAbove` step is shared by both sides. */
const PAIR_OPERATORS = Object.freeze({
  filterAbove: {
    takes: 'list',
    describe: (parameters) => `keep only the values the statement includes (threshold ${parameters.threshold})`,
    steps: (values, parameters, inclusive) => values.filter((value) => (inclusive ? value >= parameters.threshold : value > parameters.threshold))
  },
  count: { takes: 'list', describe: () => 'count the kept values', steps: (values) => values.length },
  total: { takes: 'list', describe: () => 'add the kept values', steps: (values) => values.reduce((sum, value) => sum + value, 0) },
  largest: { takes: 'list', describe: () => 'take the largest kept value', steps: (values) => Math.max(...values) },
  smallest: { takes: 'list', describe: () => 'take the smallest kept value', steps: (values) => Math.min(...values) },
  double: { takes: 'scalar', describe: () => 'double it', steps: (value) => value * 2 },
  addRate: {
    takes: 'scalar',
    describe: (parameters) => `add the fixed charge of ${parameters.rate}`,
    steps: (value, parameters) => value + parameters.rate
  },
  addPercent: {
    takes: 'scalar',
    describe: (parameters) => `add ${parameters.rate} percent of it`,
    steps: (value, parameters) => value + (value * parameters.rate) / 100
  }
});

/**
 * One pair drawn from one latent record. `members` holds both statements of the
 * pair and both oracles; `shared` holds what the two members have in common, so a
 * report can show that only the decisive phrase differs.
 */
export function generateContrastivePair({ pair, random, renderer }) {
  for (let attempt = 0; attempt < 6000; attempt += 1) {
    const count = 5 + Math.floor(random() * 4);
    const values = Array.from({ length: count }, () => 2 + Math.floor(random() * 40));
    const threshold = 8 + Math.floor(random() * 20);
    const rate = 3 + Math.floor(random() * 9);
    const parameters = { threshold, rate };
    const kept = values.filter((value) => value > threshold);
    // Every pair needs both sides of the filter non-empty, so a wrong threshold or a
    // missing filter changes the answer instead of coinciding with the right one.
    if (kept.length < 2 || kept.length === values.length) continue;
    if (pair.kind === 'boundary-inclusion-pair') {
      // The inclusion pair additionally needs the record equal to the threshold to be
      // present exactly once: it is the whole difference between the two members.
      const boundary = values.filter((value) => value === threshold).length;
      if (boundary !== 1) continue;
    }
    if (pair.kind === 'rate-vs-absolute-pair') {
      const total = values.reduce((sum, value) => sum + value, 0);
      // The rate of this pair is a whole multiple of five, because "ten percent" reads
      // like the arithmetic a statement would state, and the percentage of the total
      // must land on a whole number of units, so both oracles stay integers. The
      // percentage must also differ from the fixed amount that shares its number, or
      // the pair is unobservable and would score as a pair while teaching nothing.
      if (rate % 5 !== 0) continue;
      if ((total * rate) % 100 !== 0 || (total * rate) / 100 === rate) continue;
    }
    const subject = pick(random, SUBJECTS);
    const unit = pick(random, UNITS);
    const time = pick(random, TIMES);
    const members = pair.members.map((member) => {
      const problem = {
        structure: `${pair.kind}:${member.role}`,
        values,
        parameters,
        kept,
        subject,
        unit,
        time,
        renderer,
        pairKind: pair.kind,
        role: member.role
      };
      problem.statement = renderPairStatement(problem, pair, member);
      problem.valueRecord = renderPairValueRecord(problem, pair, member);
      problem.planRecord = renderPairPlanRecord(problem, pair, member);
      problem.oracle = runPairChain(pair, member, values, parameters);
      return problem;
    });
    if (members.some((member) => member.oracle === null || !Number.isInteger(member.oracle))) continue;
    // A pair whose two members coincide is unobservable and must never be emitted:
    // it would score as a pair while teaching nothing.
    if (members[0].oracle === members[1].oracle) continue;
    return {
      kind: pair.kind,
      chain: [...pair.chain],
      shared: { values, parameters, subject, unit, time },
      members
    };
  }
  throw new Error(`${pair.kind}: the generator could not draw an observable pair`);
}

/** Walk one member's chain, applying the member's decisive choice at the step that has one. */
function runPairChain(pair, member, values, parameters) {
  const inclusive = pair.kind === 'boundary-inclusion-pair' && member.role === 'at-least';
  let current = PAIR_OPERATORS.filterAbove.steps(values, parameters, inclusive);
  if (pair.kind === 'direction-pair') {
    const operator = member.role === 'largest' ? PAIR_OPERATORS.largest : PAIR_OPERATORS.smallest;
    current = operator.steps(current);
    current = PAIR_OPERATORS.double.steps(current);
    return current;
  }
  if (pair.kind === 'rate-vs-absolute-pair') {
    current = PAIR_OPERATORS.total.steps(current);
    const operator = member.role === 'percent' ? PAIR_OPERATORS.addPercent : PAIR_OPERATORS.addRate;
    current = operator.steps(current, parameters);
    return current;
  }
  return PAIR_OPERATORS.count.steps(current);
}

function renderPairStatement(problem, pair, member) {
  const list = problem.values.length === 1
    ? `${problem.values[0]}`
    : `${problem.values.slice(0, -1).join(', ')} and ${problem.values.at(-1)}`;
  const opening = [
    `${problem.subject[0].toUpperCase()}${problem.subject.slice(1)} recorded ${list} ${problem.unit} ${problem.time}.`,
    `At ${problem.subject}, ${list} ${problem.unit} were logged ${problem.time}.`,
    `The log of ${problem.subject} ${problem.time} holds ${list} ${problem.unit}.`
  ][problem.renderer % 3];
  if (pair.kind === 'boundary-inclusion-pair') {
    const qualifier = member.role === 'above' ? `above ${problem.parameters.threshold}` : `at least ${problem.parameters.threshold}`;
    return `${opening} Please keep only the records ${qualifier} ${problem.unit}, then report how many records were kept.`;
  }
  if (pair.kind === 'direction-pair') {
    return `${opening} Please keep only the records above ${problem.parameters.threshold} ${problem.unit}, ` +
      `then report the ${member.role} kept record doubled.`;
  }
  const extra = member.role === 'percent'
    ? `${problem.parameters.rate} percent of the total`
    : `a fixed ${problem.parameters.rate} ${problem.unit}`;
  return `${opening} Please keep only the records above ${problem.parameters.threshold} ${problem.unit}, ` +
    `then report the total of the kept records plus ${extra}.`;
}

function renderPairValueRecord(problem, pair, member) {
  const roles = [
    `recorded values: [${problem.values.join(', ')}]`,
    `threshold: ${problem.parameters.threshold}`
  ];
  if (pair.kind === 'boundary-inclusion-pair') roles.push(`is the threshold included: ${member.role === 'at-least'}`);
  if (pair.kind === 'rate-vs-absolute-pair') {
    roles.push(member.role === 'percent' ? `percentage: ${problem.parameters.rate}` : `fixedCharge: ${problem.parameters.rate}`);
  }
  return roles.join('\n');
}

function renderPairPlanRecord(problem, pair, member) {
  const steps = ['1. filterAbove parameters: ' + JSON.stringify({ threshold: problem.parameters.threshold })
    + ': ' + (pair.kind === 'boundary-inclusion-pair' && member.role === 'at-least'
      ? 'keep the values at or above the threshold'
      : 'keep the values above the threshold')];
  if (pair.kind === 'boundary-inclusion-pair') steps.push('2. count: count the kept values');
  if (pair.kind === 'direction-pair') {
    steps.push(`2. ${member.role}: take the ${member.role} kept value`);
    steps.push('3. double: double it');
  }
  if (pair.kind === 'rate-vs-absolute-pair') {
    steps.push('2. total: add the kept values');
    steps.push(member.role === 'percent'
      ? `3. addPercent parameters: ${JSON.stringify({ rate: problem.parameters.rate })}: add ${problem.parameters.rate} percent of it`
      : `3. addRate parameters: ${JSON.stringify({ rate: problem.parameters.rate })}: add the fixed charge of ${problem.parameters.rate}`);
  }
  return steps.join('\n');
}

/**
 * Build a contrastive suite: `perPair` pairs per kind, each pair carrying both
 * statements, both oracles, and the shared draw. The pairs are the scoring unit,
 * so the suite reports `pairs` and `members` separately.
 */
export function buildContrastiveSuite({ seed = 20260922, perPair = 8, pairs = CONTRASTIVE_PAIRS } = {}) {
  const built = [];
  // Each pair kind draws from its own stream, keyed by the suite seed and the kind.
  // A single shared stream makes every kind depend on how many draws the preceding
  // kinds happened to consume, which is unpredictable because a draw retries until it
  // is observable; a per-kind stream keeps a suite reproducible from its seed alone
  // and keeps one kind's rejection rate from starving the next.
  for (const pair of pairs) {
    const random = seededRandom(seedForStream(`${seed}:${pair.kind}`));
    let made = 0;
    let attempts = 0;
    while (made < perPair && attempts < perPair * 6000) {
      attempts += 1;
      const drawn = generateContrastivePair({ pair, random, renderer: attempts % 3 });
      built.push({
        ...drawn,
        id: `${pair.kind}-${String(made + 1).padStart(2, '0')}`
      });
      made += 1;
    }
    if (made < perPair) {
      throw new Error(`${pair.kind}: the generator produced only ${made} of ${perPair} pairs`);
    }
  }
  return {
    profile: `diagnostic-pairs-1.0.0`,
    seed,
    perPair,
    kinds: pairs.map((pair) => pair.kind),
    pairs: built
  };
}
