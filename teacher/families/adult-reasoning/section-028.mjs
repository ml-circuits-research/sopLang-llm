/**
 * Section 28 of the adult-reasoning course: body numbers presented in a text.
 *
 * Every variant is an observation journal about one person: a resting pulse
 * today and yesterday measured with the same method, an axillary temperature,
 * the notebook's rule that a difference of at least 3 beats is a “change to
 * watch” and not an illness, and the notebook's fever line above 37.5 °C. The
 * person also reads a “dangerous” label outside the notebook. The verdict
 * compares the two pulses against the notebook threshold, compares the
 * temperature against the fever line, and discards the outside word. The
 * variants change the person and the two pulse readings; the temperature, the
 * watch threshold, and the fever line are parsed from the journal text.
 */

import { slugify } from '../../naming.mjs';

const JOURNAL_PATTERN =
  /Observation journal \(not a diagnosis\) about ([A-Z][a-z]+): “Resting pulse today (\d+), method (\d+) s × 2\. Yesterday (\d+), same method\. Axillary temperature ([\d.]+) °C\. Notebook: a difference ≥(\d+) beats = ‘change to watch’, not ‘illness’\. Fever in the notebook: >([\d.]+) °C axillary\.”/;
const OUTSIDE_PATTERN = /([A-Z][a-z]+) reads outside the notebook that the pulse is “dangerous”\./;
const QUESTION_PATTERN = /Is ([\d.]+) a fever\?/;

function parse(statement) {
  const journal = JOURNAL_PATTERN.exec(statement);
  const outside = OUTSIDE_PATTERN.exec(statement);
  const question = QUESTION_PATTERN.exec(statement);
  if (journal === null || outside === null || question === null) {
    throw new Error('the statement does not describe the observation journal and the outside reading');
  }
  return {
    person: journal[1],
    today: Number(journal[2]),
    methodSeconds: Number(journal[3]),
    yesterday: Number(journal[4]),
    temperature: journal[5],
    watchThreshold: Number(journal[6]),
    feverLimit: journal[7],
    askedTemperature: question[1],
    outsideWord: 'dangerous'
  };
}

function solve(slots) {
  const difference = slots.today - slots.yesterday;
  if (difference < slots.watchThreshold) {
    throw new Error('the variant does not reach the notebook change-to-watch threshold');
  }
  if (!(Number(slots.temperature) < Number(slots.feverLimit))) {
    throw new Error('the variant does not show a temperature below the notebook fever line');
  }
  return {
    difference,
    watchLabel: 'change to watch',
    watchThreshold: slots.watchThreshold,
    temperature: slots.temperature,
    feverLimit: slots.feverLimit
  };
}

function render(solution) {
  return `Difference ${solution.difference} ≥ ${solution.watchThreshold} → “${solution.watchLabel}”. ${solution.temperature} < ${solution.feverLimit} → not fever. “Dangerous” is outside the stem.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const difference = slots.today - slots.yesterday;',
  'return "Difference " + difference + " ≥ " + slots.watchThreshold + " → “change to watch”. " + slots.temperature + " < " + slots.feverLimit + " → not fever. “Dangerous” is outside the stem.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The journal records ${slots.today} beats today against ${slots.yesterday} yesterday with the same ${slots.methodSeconds} s × 2 method, so the difference is ${solution.difference} beats.`,
    `The notebook calls a difference of ${slots.watchThreshold} beats or more a “${solution.watchLabel}” and not an illness, so that is the strongest conclusion the notebook allows for ${slots.person}.`,
    `The axillary reading of ${slots.temperature} °C stays below the notebook fever line of ${slots.feverLimit} °C, so ${slots.askedTemperature} is not a fever, and the word “${slots.outsideWord}” appears nowhere in the notebook's own rules.`
  ];
}

export const unit = 28;

export const cases = [
  {
    template: 'Body numbers presented in a text',
    type: slugify('Body numbers presented in a text'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
