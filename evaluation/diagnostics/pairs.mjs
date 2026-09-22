/**
 * The contrastive pair suite: the same latent task rendered as a pair.
 *
 * A separate module from `suite.mjs` because the two suites answer different
 * questions. That one asks a single question per problem and counts single
 * answers; this one renders both members of a pair from one latent draw and
 * counts a pair only when both answers are correct, which is the measurement the
 * contrastive arm needs (astra_review I3, `phase4-analysis.md` D-L).
 */
import { pick, seededRandom, seedForStream, SUBJECTS, TIMES, UNITS } from './random.mjs';

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

