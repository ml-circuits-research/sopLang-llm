/**
 * Template 12 of the common-sense book: causality.
 *
 * Every variant reports an observational phase (days using procedure X also
 * show better outcomes, but X is used mainly when staffing is complete, so
 * `complete staffing` is a plausible confounder) and then a randomized phase
 * (comparable cases assigned to X or the usual procedure under the same stated
 * conditions, with a success count per group). The observational association
 * cannot separate X from the confounder, so it is merely correlational evidence;
 * random assignment is meant to distribute known and unknown factors more
 * evenly, so the experiment is stronger causal evidence — while a single small
 * experiment can still be moved by random variation and cannot claim absolute
 * certainty.
 *
 * The fifty variants differ only in the two success counts of the randomized
 * phase, so the success rates are read from the parsed counts and used in the
 * explanation, while the printed conclusion keeps the same three claims.
 */

import { slugify } from '../../naming.mjs';

const OBSERVATION_PATTERN = /Over four weeks, days using procedure X also show better outcomes\. However, X is used mainly when ([a-z ]+)\./;
const ASSIGNMENT_PATTERN = /randomly assigns (\d+) comparable cases: (\d+) receive X and (\d+) receive the usual procedure under the same team and stated conditions\./;
const OUTCOME_PATTERN = /In the X group, (\d+) of (\d+) reach the target; in the control group, (\d+) of (\d+) do so\./;

function parse(statement) {
  const observation = OBSERVATION_PATTERN.exec(statement);
  const assignment = ASSIGNMENT_PATTERN.exec(statement);
  const outcome = OUTCOME_PATTERN.exec(statement);
  if (observation === null) {
    throw new Error('the statement does not state the observational comparison and its confounder');
  }
  if (assignment === null) {
    throw new Error('the statement does not state the randomized assignment and its two groups');
  }
  if (outcome === null) {
    throw new Error('the statement does not state the outcome of each randomized group');
  }
  return {
    confounder: observation[1].trim(),
    randomized: true,
    total: Number(assignment[1]),
    treatmentSize: Number(assignment[2]),
    controlSize: Number(assignment[3]),
    treatment: { successes: Number(outcome[1]), total: Number(outcome[2]) },
    control: { successes: Number(outcome[3]), total: Number(outcome[4]) }
  };
}

/**
 * A success rate in tenths of a percent, rounded half away from zero, so the
 * explanation prints the book's `75.0%` without binary-float noise.
 */
function rateTenths(successes, total) {
  const scaled = successes * 1000;
  const quotient = Math.floor(scaled / total);
  const remainder = scaled - quotient * total;
  return quotient + (2 * remainder >= total ? 1 : 0);
}

function solve(slots) {
  if (slots.randomized !== true) {
    throw new Error('the statement does not state a randomized comparison');
  }
  if (slots.treatmentSize !== slots.treatment.total || slots.controlSize !== slots.control.total) {
    throw new Error('the stated group sizes disagree with the reported outcomes');
  }
  if (slots.treatmentSize + slots.controlSize !== slots.total) {
    throw new Error('the two groups do not account for the assigned cases');
  }
  for (const [name, group] of [['X', slots.treatment], ['control', slots.control]]) {
    if (group.successes < 0 || group.successes > group.total || group.total <= 0) {
      throw new Error(`the ${name} group must report a success count between zero and its size`);
    }
  }
  return {
    confounder: slots.confounder,
    observational: 'correlational',
    randomized: 'stronger causal evidence',
    certainty: false,
    treatment: { ...slots.treatment, rate: rateTenths(slots.treatment.successes, slots.treatment.total) },
    control: { ...slots.control, rate: rateTenths(slots.control.successes, slots.control.total) }
  };
}

function render(solution) {
  return `The first four weeks provide ${solution.observational} evidence; the randomized comparison provides ${solution.randomized}, but not absolute certainty.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(slots.randomized === true, "the statement must state a randomized comparison");',
  'probe(typeof slots.confounder === "string" && slots.confounder.length > 0, "the statement must name the factor that travels with X in the observational phase");',
  'probe(Number.isInteger(slots.total) && slots.total > 0, "the randomized phase must assign a positive number of comparable cases");',
  'probe(Number.isInteger(slots.treatmentSize) && Number.isInteger(slots.controlSize) && slots.treatmentSize > 0 && slots.controlSize > 0, "each randomized group must be a positive size");',
  'probe(slots.treatmentSize + slots.controlSize === slots.total, "the two groups must account for the assigned cases");',
  'probe(Number.isInteger(slots.treatment.successes) && Number.isInteger(slots.treatment.total) && slots.treatment.successes >= 0 && slots.treatment.successes <= slots.treatment.total, "the X group must report a success count inside its size");',
  'probe(Number.isInteger(slots.control.successes) && Number.isInteger(slots.control.total) && slots.control.successes >= 0 && slots.control.successes <= slots.control.total, "the control group must report a success count inside its size");',
  'probe(slots.treatment.total === slots.treatmentSize && slots.control.total === slots.controlSize, "the reported group sizes must match the assignment");',
  'const observational = "correlational";',
  'const randomized = "stronger causal evidence";',
  'probe(observational !== randomized, "the observational and randomized phases must not be conflated");',
  'return "The first four weeks provide " + observational + " evidence; the randomized comparison provides " + randomized + ", but not absolute certainty.";'
].join('\n');

function explain(slots, solution) {
  const percent = (rate) => `${(rate / 10).toFixed(1)}%`;
  return [
    `The first four weeks are observational: X and better outcomes occur together, but X is used mainly when ${slots.confounder}, so ${slots.confounder} is a plausible confounder that travels with X and the association alone cannot separate them.`,
    `Randomly assigning ${slots.total} comparable cases (${slots.treatmentSize} to X, ${slots.controlSize} to the usual procedure) under the same team and stated conditions is meant to distribute known and unknown factors more evenly between the groups.`,
    `The reported success rates are ${solution.treatment.successes}/${solution.treatment.total} = ${percent(solution.treatment.rate)} with X and ${solution.control.successes}/${solution.control.total} = ${percent(solution.control.rate)} in control, so within this model the difference is more plausibly attributed to X than to staffing.`,
    'One small experiment can still be moved by random variation and applies only to comparable settings, so the justified conclusion is stronger causal evidence, not absolute proof.'
  ];
}

export const unit = 12;

export const cases = [
  {
    template: 'Causality',
    type: slugify('Causality'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
