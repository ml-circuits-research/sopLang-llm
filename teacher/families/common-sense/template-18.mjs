/**
 * Template 18 of the common-sense book: multi-criteria decision.
 *
 * Every variant scores three options A, B, and C on three criteria from 0 to
 * 10, states a percentage weight per criterion, and asks for each option's
 * weighted score together with the option(s) that reach the maximum. The
 * weighted score of an option is the sum over the criteria of the criterion
 * weight times the option's score, computed in hundredths so the printed
 * two-decimal values are exact, and the winner is every option whose weighted
 * score attains that maximum.
 *
 * The family accepts every variant that carries the scoring scale, the
 * criterion weights in their stated order, and one score list per option: the
 * fifty variants differ in the scores and in whether the maximum is reached by
 * one option or shared by two.
 */

import { slugify } from '../../naming.mjs';

const SCALE_PATTERN = /each scored from (\d+) to (\d+) where (\d+) is better/;
const WEIGHT_PATTERN = /(\d+)% for Criterion (\d+)/g;
const LABELLED_LIST_PATTERN = /([A-Z]): (\d+(?:, \d+)*)/g;

function parse(statement) {
  const scale = SCALE_PATTERN.exec(statement);
  if (scale === null) {
    throw new Error('the statement does not state the scoring scale');
  }
  const weights = [...statement.matchAll(WEIGHT_PATTERN)]
    .map((match) => ({ criterion: Number(match[2]), percent: Number(match[1]) }))
    .sort((left, right) => left.criterion - right.criterion);
  if (weights.length === 0) {
    throw new Error('the statement does not state the criterion weights');
  }
  const scoresIndex = statement.indexOf('Scores are: ');
  if (scoresIndex < 0) {
    throw new Error('the statement does not state the option scores');
  }
  const options = [...statement.slice(scoresIndex).matchAll(LABELLED_LIST_PATTERN)]
    .map((match) => ({ label: match[1], scores: match[2].split(', ').map(Number) }));
  if (options.length === 0) {
    throw new Error('the statement does not state any option scores');
  }
  return {
    scale: { minimum: Number(scale[1]), maximum: Number(scale[2]), better: Number(scale[3]) },
    weights,
    options
  };
}

/**
 * A weighted score in hundredths of a point: `(w/100) × s` summed over the
 * criteria is `Σ w × s` hundredths, an integer, so the printed two-decimal
 * values never pick up binary-float noise.
 */
function weightHundredths(option, weights) {
  let total = 0;
  for (let index = 0; index < weights.length; index += 1) {
    total += weights[index].percent * option.scores[index];
  }
  return total;
}

function formatHundredths(value) {
  const whole = Math.floor(value / 100);
  const fraction = value % 100;
  return `${whole}.${fraction < 10 ? `0${fraction}` : fraction}`;
}

function solve(slots) {
  const criteria = slots.weights.length;
  for (const option of slots.options) {
    if (option.scores.length !== criteria) {
      throw new Error(`option ${option.label} does not carry one score per criterion`);
    }
    for (const score of option.scores) {
      if (!Number.isInteger(score) || score < slots.scale.minimum || score > slots.scale.maximum) {
        throw new Error(`option ${option.label} carries a score outside the stated scale`);
      }
    }
  }
  const scores = slots.options.map((option) => ({
    label: option.label,
    hundredths: weightHundredths(option, slots.weights)
  }));
  const maximum = Math.max(...scores.map((score) => score.hundredths));
  const winners = scores.filter((score) => score.hundredths === maximum).map((score) => score.label);
  return { scores, maximum, winners };
}

function render(solution) {
  const scores = solution.scores
    .map((score) => `${score.label}=${formatHundredths(score.hundredths)}`)
    .join(', ');
  return `Scores: ${scores}. Winner(s) under these weights: ${solution.winners.join(', ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const scale = slots.scale;',
  'const criteria = slots.weights.length;',
  'let weightSum = 0;',
  'for (const weight of slots.weights) {',
  '  weightSum += weight.percent;',
  '}',
  'const labels = [];',
  'const hundredths = {};',
  'for (const option of slots.options) {',
  '  let total = 0;',
  '  for (let index = 0; index < criteria; index += 1) {',
  '    const score = option.scores[index];',
  '    total += slots.weights[index].percent * score;',
  '  }',
  '  hundredths[option.label] = total;',
  '  labels.push(option.label);',
  '}',
  'const maximum = Math.max(...labels.map((label) => hundredths[label]));',
  'const winners = labels.filter((label) => hundredths[label] === maximum);',
  'probe(winners.length > 0, "the weighted scores must attain a maximum");',
  'const format = (value) => {',
  '  const whole = Math.floor(value / 100);',
  '  const fraction = value % 100;',
  '  return whole + "." + (fraction < 10 ? "0" + fraction : String(fraction));',
  '};',
  'return "Scores: " + labels.map((label) => label + "=" + format(hundredths[label])).join(", ") + ". Winner(s) under these weights: " + winners.join(", ") + ".";'
].join('\n');

function explain(slots, solution) {
  const weights = slots.weights.map((weight) => `${weight.percent}%`).join('/');
  const winner = solution.winners.length === 1
    ? `${solution.winners[0]} alone reaches it`
    : `${solution.winners.join(' and ')} share it`;
  return [
    `Each option's weighted score adds, over the ${slots.weights.length} criteria, the criterion weight times the option's score; with the stated weights ${weights}, a criterion carrying more weight moves the total proportionally more.`,
    `Every option score lies between ${slots.scale.minimum} and ${slots.scale.maximum}, and because the weights are fractions of one whole the weighted score stays on that same scale.`,
    `The decision rule takes the largest of the weighted sums, and ${winner}, so the ranking is read off those sums rather than from any single criterion.`,
    'The ranking is conditional on the stated weights: another weighting, or one more criterion, can reorder the options, so the outcome reports the preferences of the model instead of a universal truth.'
  ];
}

export const unit = 18;

export const cases = [
  {
    template: 'Multi-criteria decision',
    type: slugify('Multi-criteria decision'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
