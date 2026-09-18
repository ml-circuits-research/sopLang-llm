/**
 * Form 9 of the scientific-reasoning book: choosing a discriminating
 * experiment.
 *
 * Every variant states two rival explanations of the same trouble, each with
 * the observations it predicts, and reports the observation the two of them
 * share. A test is useful only when the two hypotheses predict different
 * results for it, so the discriminating pair is the first prediction of the
 * first hypothesis that the second hypothesis does not make, together with the
 * first prediction of the second hypothesis that the first does not make. The
 * shared observation is sometimes one of the listed predictions (it then leads
 * both lists) and sometimes a plain statement that the cause is not yet
 * located, which is why the family searches for the predictions instead of
 * skipping a fixed number of them.
 *
 * The variants differ in the world's vocabulary (germination, a leaf, a food
 * chain, digestion, sound, measurement), not in the choice of test, so one
 * family covers all twenty-five of them.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/;
const HYPOTHESES_PATTERN =
  /H1:\s*([\s\S]*?)\s*predicts \[([\s\S]*?)\],\s*while H2:\s*([\s\S]*?)\s*predicts \[([\s\S]*?)\]\./;

function splitPredictions(text) {
  return text
    .split(',')
    .map((prediction) => prediction.trim())
    .filter((prediction) => prediction !== '');
}

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state its case data');
  }
  const hypotheses = HYPOTHESES_PATTERN.exec(caseData[1]);
  if (hypotheses === null) {
    throw new Error('the statement does not state its two hypotheses with their predictions');
  }
  const predictions1 = splitPredictions(hypotheses[2]);
  const predictions2 = splitPredictions(hypotheses[4]);
  if (predictions1.length === 0 || predictions2.length === 0) {
    throw new Error('a hypothesis states no prediction');
  }
  return {
    name1: hypotheses[1].trim(),
    predictions1,
    name2: hypotheses[3].trim(),
    predictions2
  };
}

function solve(slots) {
  const first = slots.predictions1.find((prediction) => !slots.predictions2.includes(prediction));
  const second = slots.predictions2.find((prediction) => !slots.predictions1.includes(prediction));
  if (first === undefined || second === undefined) {
    const ambiguity = new Error('the two hypotheses predict the same observations, so no test distinguishes them');
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  return { first, second, name1: slots.name1, name2: slots.name2 };
}

function render(solution) {
  return `We test whether “${solution.first}” (or “${solution.second}”). The appearance of the first supports H1: ${solution.name1}, while the second result supports H2: ${solution.name2}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.name1 === "string" && slots.name1.length > 0, "the first hypothesis must carry its name");',
  'probe(Array.isArray(slots.predictions1) && slots.predictions1.length > 0, "the first hypothesis must state its predictions");',
  'probe(typeof slots.name2 === "string" && slots.name2.length > 0, "the second hypothesis must carry its name");',
  'probe(Array.isArray(slots.predictions2) && slots.predictions2.length > 0, "the second hypothesis must state its predictions");',
  'const first = slots.predictions1.find((prediction) => slots.predictions2.indexOf(prediction) === -1);',
  'const second = slots.predictions2.find((prediction) => slots.predictions1.indexOf(prediction) === -1);',
  'probe(first !== undefined, "the first hypothesis must predict something the second does not");',
  'probe(second !== undefined, "the second hypothesis must predict something the first does not");',
  'return "We test whether “" + first + "” (or “" + second + "”). The appearance of the first supports H1: " + slots.name1 + ", while the second result supports H2: " + slots.name2 + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    'Both hypotheses account for the trouble, so a test that they answer alike cannot separate them; only a prediction one makes and the other refuses can.',
    `The first prediction of H1 that H2 does not make is “${solution.first}”, and the first prediction of H2 that H1 does not make is “${solution.second}”.`,
    `Observing “${solution.first}” supports H1: ${solution.name1}, while observing “${solution.second}” supports H2: ${solution.name2}.`,
    'The predictions are written down before the test, so the rule is not changed after the result is seen.'
  ];
}

export const unit = 9;

export const cases = [
  {
    template: 'Choosing a discriminating experiment',
    type: slugify('Choosing a discriminating experiment'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
