/**
 * Form 12 of the scientific-reasoning book: is the evidence sufficient?
 *
 * Every variant states a model world, two competing hypotheses with the
 * observations each predicts, and one observation known so far that the
 * statement declares compatible with both hypotheses. Because that observation
 * cannot separate them, the printed answer refuses to choose and names instead
 * a discriminating observation: for each hypothesis the family takes the first
 * prediction that goes beyond the known observation, and those two predictions
 * are the test that would tell the hypotheses apart.
 *
 * The variants differ in the world's vocabulary; the shape of the case data
 * (two hypothesis lines, one known observation) is the same in all twenty-five
 * of them.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Case data\.\s*([\s\S]*?)\n\nQuestion\./;
const QUESTION_PATTERN = /Question\.\s*([\s\S]*)$/;
const HYPOTHESIS_PATTERN = /H([12]): (.+?) predicts \[([^\]]*)\]/g;
const KNOWN_PATTERN = /Until now we know only “([^”]+)”/;
const COMPATIBLE_PATTERN = /compatible with both hypotheses/;
const QUESTION_TEXT =
  'Is this information sufficient to choose a hypothesis? If not, what evidence would genuinely discriminate between them?';

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  const question = QUESTION_PATTERN.exec(statement);
  if (caseData === null || question === null) {
    throw new Error('the statement does not state its case data and its question');
  }
  if (question[1].trim() !== QUESTION_TEXT) {
    throw new Error('the statement does not ask whether the evidence is sufficient');
  }
  if (!COMPATIBLE_PATTERN.test(caseData[1])) {
    throw new Error('the statement does not declare the known observation compatible with both hypotheses');
  }
  const known = KNOWN_PATTERN.exec(caseData[1]);
  if (known === null) {
    throw new Error('the statement does not name the observation known so far');
  }
  const hypotheses = [];
  for (const hypothesis of caseData[1].matchAll(HYPOTHESIS_PATTERN)) {
    const predictions = hypothesis[3].split(',').map((value) => value.trim()).filter((value) => value !== '');
    if (predictions.length === 0) {
      throw new Error(`hypothesis H${hypothesis[1]} predicts no observation`);
    }
    hypotheses.push({ label: hypothesis[2].trim(), predictions });
  }
  if (hypotheses.length !== 2) {
    throw new Error(`the statement states ${hypotheses.length} hypotheses instead of two`);
  }
  return { hypotheses, known: known[1] };
}

/** The first prediction of a hypothesis that goes beyond the known observation. */
function discriminating(hypothesis, known) {
  const prediction = hypothesis.predictions.find((value) => value !== known);
  if (prediction === undefined) {
    throw new Error(`hypothesis ${hypothesis.label} predicts nothing beyond the known observation`);
  }
  return prediction;
}

function solve(slots) {
  const first = discriminating(slots.hypotheses[0], slots.known);
  const second = discriminating(slots.hypotheses[1], slots.known);
  if (first === second) {
    throw new Error('the two hypotheses share every prediction beyond the known observation');
  }
  return { first, second };
}

function render(solution) {
  return `No. We need a discriminating observation, for example “${solution.first}” versus “${solution.second}”.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const discriminating = slots.hypotheses.map((hypothesis) => hypothesis.predictions.find((value) => value !== slots.known));',
  'return "No. We need a discriminating observation, for example \\u201c" + discriminating[0] + "\\u201d versus \\u201c" + discriminating[1] + "\\u201d.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The observation known so far, “${slots.known}”, is stated to be compatible with both hypotheses, so it cannot choose between them.`,
    `Each hypothesis predicts more than that: ${slots.hypotheses[0].label} predicts “${solution.first}”, while ${slots.hypotheses[1].label} predicts “${solution.second}”.`,
    `A test that can produce “${solution.first}” but not “${solution.second}”, or the reverse, is the evidence that would genuinely discriminate.`,
    'Until such an observation exists, either hypothesis remains possible and picking one would be an assumption rather than a conclusion.'
  ];
}

export const unit = 12;

export const cases = [
  {
    template: 'Is the evidence sufficient?',
    type: slugify('Is the evidence sufficient?'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
