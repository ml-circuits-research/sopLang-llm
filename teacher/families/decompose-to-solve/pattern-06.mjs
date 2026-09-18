/**
 * Pattern 6 of the decompose-to-solve book: evidence tree and elimination.
 *
 * Every variant describes one failure under three competing hypotheses
 * (insufficient capacity, an ordering or dependency mistake, a measurement or
 * recording error) followed by four observations: a capacity log that shows
 * enough units were available, a time-stamped record of a dependent action
 * taken before its prerequisite, an independent record that reproduces the
 * measured quantity within tolerance, and a comment that explicitly tests
 * nothing. The family builds the evidence tree itself: each observation is
 * routed to the one hypothesis it can discriminate, the capacity and
 * measurement hypotheses are eliminated by the records that contradict them,
 * the ordering hypothesis survives the positive test, and the non-discriminating
 * comment is dropped. The variants change the domain phrase, the handled noun,
 * and the numbers, never the method; the printed answer is one fixed shape with
 * the surviving hypothesis label injected.
 */

import { slugify } from '../../naming.mjs';

const SCENARIO_PATTERN = /^Scenario\. In (.+?), a failure occurred while handling (\d+) ([^.]+)\./;
const HYPOTHESIS_PATTERN = /H(\d+)\s*[—–-]\s*([^;.]+)/g;
const CAPACITY_RECORD_PATTERN = /The capacity log shows at least (\d+) units were available throughout\./;
const ORDERING_RECORD = 'A time-stamped record shows a dependent action occurred before its prerequisite had been completed.';
const MEASUREMENT_RECORD = 'An independent record reproduces the measured quantity within the stated tolerance.';
const TESTIMONY_PATTERN = /A separate comment says ([^;]+); this may be true but does not discriminate among the three hypotheses\./;

/** The claim each hypothesis kind makes, keyed by the kind the family reasons with. */
const KIND_PATTERNS = [
  ['capacity', /capacit/],
  ['ordering', /order|dependency/],
  ['measurement', /measurement|recording/]
];

/** The short label the printed answer uses for the surviving hypothesis. */
const SHORT_LABELS = {
  capacity: 'capacity shortfall',
  ordering: 'dependency/order mistake',
  measurement: 'measurement error'
};

/** The claim kind a hypothesis statement makes, refusing a statement that names several. */
function classify(claim) {
  const kinds = KIND_PATTERNS.filter(([, pattern]) => pattern.test(claim)).map(([kind]) => kind);
  if (kinds.length !== 1) {
    throw new Error(`the hypothesis "${claim}" does not name exactly one of the capacity, ordering, and measurement claims`);
  }
  return kinds[0];
}

function parse(statement) {
  const scenario = SCENARIO_PATTERN.exec(statement);
  if (scenario === null) {
    throw new Error('the statement does not name the domain, the handled count, and the handled noun');
  }
  const hypotheses = [...statement.matchAll(HYPOTHESIS_PATTERN)].map((match) => ({
    id: `H${match[1]}`,
    claim: match[2].trim(),
    kind: classify(match[2])
  }));
  if (hypotheses.length !== 3) {
    throw new Error('the statement does not propose exactly three hypotheses');
  }
  if (new Set(hypotheses.map((hypothesis) => hypothesis.id)).size !== hypotheses.length) {
    throw new Error('the statement reuses a hypothesis label');
  }
  if (new Set(hypotheses.map((hypothesis) => hypothesis.kind)).size !== hypotheses.length) {
    throw new Error('two hypotheses make the same claim');
  }
  const capacity = CAPACITY_RECORD_PATTERN.exec(statement);
  if (capacity === null) {
    throw new Error('the statement does not report the available capacity');
  }
  if (!statement.includes(ORDERING_RECORD)) {
    throw new Error('the statement does not report the time-stamped ordering record');
  }
  if (!statement.includes(MEASUREMENT_RECORD)) {
    throw new Error('the statement does not report the independent reproduction');
  }
  const testimony = TESTIMONY_PATTERN.exec(statement);
  const observations = [
    { kind: 'capacity-availability', availableUnits: Number(capacity[1]), at: capacity.index },
    { kind: 'ordering-violation', at: statement.indexOf(ORDERING_RECORD) },
    { kind: 'measurement-reproduction', at: statement.indexOf(MEASUREMENT_RECORD) }
  ];
  if (testimony !== null) {
    observations.push({ kind: 'testimony', comment: testimony[1].trim(), at: testimony.index });
  }
  observations.sort((left, right) => left.at - right.at);
  return {
    domain: scenario[1].trim(),
    workNoun: scenario[3].trim(),
    failureCount: Number(scenario[2]),
    hypotheses,
    observations: observations.map(({ at, ...observation }) => observation)
  };
}

function solve(slots) {
  const supported = new Set();
  const eliminated = new Set();
  const ignored = [];
  for (const observation of slots.observations) {
    if (observation.kind === 'capacity-availability') {
      if (observation.availableUnits >= slots.failureCount) {
        eliminated.add('capacity');
      } else {
        supported.add('capacity');
      }
    } else if (observation.kind === 'ordering-violation') {
      supported.add('ordering');
    } else if (observation.kind === 'measurement-reproduction') {
      eliminated.add('measurement');
    } else if (observation.kind === 'testimony') {
      ignored.push(observation.comment);
    } else {
      throw new Error(`the observation kind "${observation.kind}" tests no hypothesis`);
    }
  }
  const survivors = slots.hypotheses.filter(
    (hypothesis) => supported.has(hypothesis.kind) && !eliminated.has(hypothesis.kind)
  );
  if (survivors.length !== 1) {
    throw new Error('the discriminating observations do not single out one hypothesis');
  }
  const winner = survivors[0];
  const label = SHORT_LABELS[winner.kind];
  if (label === undefined) {
    throw new Error(`the surviving ${winner.kind} hypothesis has no short label`);
  }
  return {
    hypothesisId: winner.id,
    label,
    eliminated: slots.hypotheses.filter((hypothesis) => eliminated.has(hypothesis.kind)),
    supported: slots.hypotheses.filter((hypothesis) => supported.has(hypothesis.kind)),
    ignored
  };
}

function render(solution) {
  return `${solution.hypothesisId}, the ${solution.label}, is the best-supported explanation. The decomposition is evidential: each observation is sent only to the hypothesis it can actually discriminate, then the hypothesis-level results are recombined.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.hypotheses) && slots.hypotheses.length >= 2, "the scenario must propose several hypotheses");',
  'probe(Array.isArray(slots.observations) && slots.observations.length > 0, "the scenario must list observations");',
  'probe(Number.isInteger(slots.failureCount) && slots.failureCount > 0, "the handled count must be a positive whole number");',
  'const ids = slots.hypotheses.map((hypothesis) => hypothesis.id);',
  'probe(new Set(ids).size === ids.length, "each hypothesis must carry its own label");',
  'const supported = [];',
  'const eliminated = [];',
  'for (const observation of slots.observations) {',
  '  if (observation.kind === "capacity-availability") {',
  '    probe(Number.isInteger(observation.availableUnits) && observation.availableUnits > 0, "the capacity log must state a positive number of available units");',
  '    if (observation.availableUnits >= slots.failureCount) { eliminated.push("capacity"); } else { supported.push("capacity"); }',
  '  } else if (observation.kind === "ordering-violation") {',
  '    supported.push("ordering");',
  '  } else if (observation.kind === "measurement-reproduction") {',
  '    eliminated.push("measurement");',
  '  } else {',
  '    probe(observation.kind === "testimony", "the observation must name the claim it tests");',
  '  }',
  '}',
  'const survivors = slots.hypotheses.filter((hypothesis) => supported.includes(hypothesis.kind) && !eliminated.includes(hypothesis.kind));',
  'probe(survivors.length === 1, "exactly one hypothesis must survive the discriminating observations");',
  'const labels = { capacity: "capacity shortfall", ordering: "dependency/order mistake", measurement: "measurement error" };',
  'const winner = survivors[0];',
  'probe(typeof labels[winner.kind] === "string", "the surviving hypothesis must be a known claim");',
  'return winner.id + ", the " + labels[winner.kind] + ", is the best-supported explanation. The decomposition is evidential: each observation is sent only to the hypothesis it can actually discriminate, then the hypothesis-level results are recombined.";'
].join('\n');

function explain(slots, solution) {
  const eliminated = solution.eliminated.map((hypothesis) => `${hypothesis.id} (${hypothesis.claim})`).join(' and ');
  const supported = `${solution.hypothesisId} (${solution.supported[0].claim})`;
  return [
    `The scenario handles ${slots.failureCount} ${slots.workNoun} under three hypotheses, so the evidence tree gives every observation one job instead of letting each one speak to all three claims.`,
    `The capacity log and the independent reproduction within tolerance are the discriminating records that eliminate ${eliminated}.`,
    `The time-stamped record of a dependent action taken before its prerequisite is the one observation that positively tests ${supported}, so that hypothesis survives.`,
    `The remark that the team was busy tests nothing, and recombining the hypothesis-level verdicts leaves ${solution.hypothesisId} — the ${solution.label} — as the best-supported explanation; the domain phrase "${slots.domain}" does not change the method.`
  ];
}

export const unit = 6;

export const cases = [
  {
    template: 'Evidence Tree and Elimination',
    type: slugify('Evidence Tree and Elimination'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
