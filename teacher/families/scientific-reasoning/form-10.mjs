/**
 * Form 10 of the scientific-reasoning book: reading and explaining data.
 *
 * Every variant states a model world, records that only one factor was changed,
 * and prints a short table of tested levels with the result measured at each
 * level. The reasoning is the same in all twenty-five variants: order the
 * tested levels, read the results in that order, name the pattern of the
 * results inside the tested interval, and attach the observed association to
 * the factor that was changed without extrapolating beyond the tested levels.
 * The verdict is strictly increasing, strictly decreasing, or neither, and the
 * answer text joins the smallest and the largest tested level.
 *
 * The variants differ only in the world's vocabulary and in the factor name
 * (germination, leaves, a meadow, a habitat, a mixture of substances), so one
 * family covers all twenty-five of them.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Case data\.\s*([\s\S]*?)\n\nQuestion\./;
const QUESTION_PATTERN = /Question\.\s*([\s\S]*)$/;
const FACTOR_PATTERN = /Only the factor “([^”]+)” was changed\./;
const POINT_PATTERN = /level (-?\d+) → result (-?\d+)/g;
const QUESTION_TEXT =
  'Describe the pattern in the data and state the most cautious conclusion allowed. Do not extrapolate beyond the tested levels.';

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  const question = QUESTION_PATTERN.exec(statement);
  if (caseData === null || question === null) {
    throw new Error('the statement does not state its case data and its question');
  }
  if (question[1].trim() !== QUESTION_TEXT) {
    throw new Error('the statement does not ask for the pattern of the data');
  }
  const factor = FACTOR_PATTERN.exec(caseData[1]);
  if (factor === null) {
    throw new Error('the statement does not name the factor that was changed');
  }
  const points = [];
  for (const point of caseData[1].matchAll(POINT_PATTERN)) {
    points.push([Number(point[1]), Number(point[2])]);
  }
  if (points.length < 2) {
    throw new Error('the statement does not report at least two tested levels');
  }
  const levels = new Set(points.map((point) => point[0]));
  if (levels.size !== points.length) {
    throw new Error('the statement repeats a tested level');
  }
  return {
    factor: factor[1],
    points: [...points].sort((left, right) => left[0] - right[0])
  };
}

function solve(slots) {
  const results = slots.points.map((point) => point[1]);
  const rising = results.every((value, index) => index === 0 || value > results[index - 1]);
  const falling = results.every((value, index) => index === 0 || value < results[index - 1]);
  return {
    factor: slots.factor,
    first: slots.points[0][0],
    last: slots.points[slots.points.length - 1][0],
    verdict: rising ? 'increases' : falling ? 'decreases' : 'does not change monotonically'
  };
}

function render(solution) {
  return `In the levels tested, when “${solution.factor}” changes from ${solution.first} to ${solution.last}, the result ${solution.verdict}; the data support this relationship only for the conditions of the experiment.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const levels = slots.points.map((point) => point[0]);',
  'const ordered = [...slots.points].sort((left, right) => left[0] - right[0]);',
  'const results = ordered.map((point) => point[1]);',
  'const rising = results.every((value, index) => index === 0 || value > results[index - 1]);',
  'const falling = results.every((value, index) => index === 0 || value < results[index - 1]);',
  'probe(results.length === slots.points.length && results.length >= 2, "the results must cover every tested level");',
  'const verdict = rising ? "increases" : falling ? "decreases" : "does not change monotonically";',
  'return "In the levels tested, when \\u201c" + slots.factor + "\\u201d changes from " + ordered[0][0] + " to " + ordered[ordered.length - 1][0] + ", the result " + verdict + "; the data support this relationship only for the conditions of the experiment.";'
].join('\n');

function explain(slots, solution) {
  const levels = slots.points.map((point) => point[0]).join(', ');
  const results = slots.points.map((point) => point[1]).join(', ');
  return [
    `Only the factor “${slots.factor}” was changed, so the tested levels ${levels} are the whole interval the data speak about.`,
    `Reading the results in the same order, ${results}, shows that the result ${solution.verdict} within the interval tested.`,
    'Because no other condition changed in the model experiment, the association can be attributed to this factor, but only for the conditions of the experiment.',
    'The conclusion stops at the largest tested level: nothing is claimed about untested levels, and a local pattern is not turned into a universal rule.'
  ];
}

export const unit = 10;

export const cases = [
  {
    template: 'Reading and explaining data',
    type: slugify('Reading and explaining data'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
