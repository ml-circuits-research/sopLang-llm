/**
 * Template 6 of the common-sense book: base rates.
 *
 * Every variant states a model population, the prevalence of a target event,
 * the sensitivity of a detector on the cases where the event is present, and
 * its specificity on the cases where the event is absent, and asks for the
 * share of positive alerts that are true positives. Building the frequencies
 * from the population turns the conditional probability into the ratio of true
 * positives to all positive alerts, which is where the low base rate makes the
 * false positives dominate.
 *
 * The variants differ in the prevalence (1–8%), the sensitivity (85–95%) and
 * the specificity (90–98%); the printed answer rounds the share to one decimal
 * place, so the ratio is computed in whole cases and rounded on tenths of a
 * percent instead of on a binary float.
 */

import { slugify } from '../../naming.mjs';

const POPULATION_PATTERN = /In a model population of (\d+) cases/;
const PREVALENCE_PATTERN = /the target event occurs in (\d+)% of cases/;
const SENSITIVITY_PATTERN = /A detector is positive in (\d+)% of cases where the event is present \(sensitivity\)/;
const SPECIFICITY_PATTERN = /and correctly negative in (\d+)% of cases where the event is absent \(specificity\)/;

function parse(statement) {
  const population = POPULATION_PATTERN.exec(statement);
  const prevalence = PREVALENCE_PATTERN.exec(statement);
  const sensitivity = SENSITIVITY_PATTERN.exec(statement);
  const specificity = SPECIFICITY_PATTERN.exec(statement);
  if (population === null || prevalence === null || sensitivity === null || specificity === null) {
    throw new Error('the statement does not state the population, the prevalence, the sensitivity, and the specificity');
  }
  return {
    population: Number(population[1]),
    prevalence: Number(prevalence[1]),
    sensitivity: Number(sensitivity[1]),
    specificity: Number(specificity[1])
  };
}

/** The share of positive alerts that are true positives, in tenths of a percent. */
function shareTenthsOf(truePositives, alerts) {
  return Math.round((1000 * truePositives) / alerts);
}

function formatShare(tenths) {
  return (tenths / 10).toFixed(1);
}

function solve(slots) {
  const present = (slots.population * slots.prevalence) / 100;
  const absent = slots.population - present;
  const truePositives = (present * slots.sensitivity) / 100;
  const falsePositives = (absent * (100 - slots.specificity)) / 100;
  if (![present, absent, truePositives, falsePositives].every((count) => Number.isInteger(count))) {
    throw new Error('the stated rates do not split the population into whole case counts');
  }
  const alerts = truePositives + falsePositives;
  if (alerts <= 0) {
    throw new Error('the stated rates produce no positive alert');
  }
  return {
    present,
    absent,
    truePositives,
    falsePositives,
    alerts,
    shareTenths: shareTenthsOf(truePositives, alerts)
  };
}

function render(solution) {
  return `Approximately ${formatShare(solution.shareTenths)}% of positive alerts are true positives.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const present = slots.population * slots.prevalence / 100;',
  'const absent = slots.population - present;',
  'const truePositives = present * slots.sensitivity / 100;',
  'const falsePositives = absent * (100 - slots.specificity) / 100;',
  'probe(Number.isInteger(present) && Number.isInteger(absent) && Number.isInteger(truePositives) && Number.isInteger(falsePositives), "the stated rates must split the population into whole case counts");',
  'const alerts = truePositives + falsePositives;',
  'probe(alerts > 0, "the stated rates must produce at least one positive alert");',
  'const shareTenths = Math.round(1000 * truePositives / alerts);',
  'return "Approximately " + (shareTenths / 10).toFixed(1) + "% of positive alerts are true positives.";'
].join('\n');

function explain(slots, solution) {
  const falsePositiveRate = 100 - slots.specificity;
  return [
    `Of the ${slots.population} cases, ${slots.prevalence}% carry the event, so ${solution.present} cases are positive and ${solution.absent} are not.`,
    `The detector catches ${slots.sensitivity}% of the ${solution.present}: ${solution.truePositives} true positives. The remaining ${solution.absent} cases alert at the false-positive rate ${falsePositiveRate}%, adding ${solution.falsePositives} false positives.`,
    `The positive alerts therefore number ${solution.truePositives} + ${solution.falsePositives} = ${solution.alerts}, and ${solution.truePositives}/${solution.alerts} = ${formatShare(solution.shareTenths)}%, so only about ${formatShare(solution.shareTenths)}% of the alerts indicate the event.`,
    `The low base rate leaves the false positives numerous enough to dominate the alerts, which is why the detector's hit rates alone do not answer the question.`
  ];
}

export const unit = 6;

export const cases = [
  {
    template: 'Base rates',
    type: slugify('Base rates'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
