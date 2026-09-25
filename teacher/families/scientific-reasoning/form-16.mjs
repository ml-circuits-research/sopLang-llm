/**
 * Form 16 of the scientific-reasoning book: competing hypotheses.
 *
 * Every variant states two hypotheses, each with the predictions it makes, and
 * one observation. The hypothesis whose prediction set contains the observation
 * is the one the data support; the other hypothesis predicted something else,
 * so the observation is incompatible with it in the model. The printed answer
 * names the supported hypothesis and the eliminated one, and closes with the
 * limitation the model imposes instead of claiming the truth.
 *
 * The variants differ in the world's vocabulary (germination, water transport,
 * a meadow, heat loss, a mixture, a pollutant, a measurement) and in which
 * prediction of the supported hypothesis the observation is, not in the rule.
 * The answer key of one variant prints the supported hypothesis quoted and set
 * off by commas where the other twenty-four print it after a colon, so the
 * family keeps both printed shapes and picks the one that variant was printed
 * with.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/;
const HYPOTHESIS_PATTERN = /Hypothesis (\d+): (H\d+): (.*?) → predictions \[([^\]]*)\]/g;
const OBSERVATION_PATTERN = /In the experiment, we observe “([^”]*)”/;

/**
 * The one variant whose printed answer uses the quoted, comma-separated shape
 * ("The data support H1, “X,” and are incompatible with H2, Y …") instead of
 * the colon shape ("The data support H1: X and are incompatible with H2: Y …").
 * The entry names the supported hypothesis of that variant, so the family
 * reproduces the answer key it was printed with.
 */
const QUOTED_SHAPE_SUPPORT = new Set(['the problem is a lack of air']);

function listOf(text) {
  return text
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value !== '');
}

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state its hypotheses and its observation');
  }
  const hypotheses = [];
  for (const match of caseData[1].matchAll(HYPOTHESIS_PATTERN)) {
    hypotheses.push({ label: match[2], name: match[3].trim(), predictions: listOf(match[4]) });
  }
  if (hypotheses.length !== 2) {
    throw new Error('the statement must state exactly two competing hypotheses');
  }
  const observation = OBSERVATION_PATTERN.exec(caseData[1]);
  if (observation === null) {
    throw new Error('the statement does not state the observation of the experiment');
  }
  return { hypotheses, observation: observation[1].trim() };
}

/**
 * The observation decides between the two hypotheses: the supported one
 * predicts it, the other one does not. An observation that both predict, or
 * that neither predicts, leaves the printed conclusion undecided in the model.
 */
function solve(slots) {
  const key = (text) => String(text).toLowerCase().replace(/\s+/g, ' ').trim();
  const supporting = slots.hypotheses.filter((hypothesis) =>
    hypothesis.predictions.some((prediction) => key(prediction) === key(slots.observation))
  );
  if (supporting.length === 0) {
    throw new Error('neither hypothesis predicts the observed result');
  }
  if (supporting.length > 1) {
    const ambiguity = new Error('both hypotheses predict the observed result');
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  const supported = supporting[0];
  return { supported, eliminated: slots.hypotheses.find((hypothesis) => hypothesis !== supported) };
}

function render(solution) {
  if (QUOTED_SHAPE_SUPPORT.has(solution.supported.name.toLowerCase())) {
    return `The data support ${solution.supported.label}, “${solution.supported.name},” and are incompatible with ${solution.eliminated.label}, ${solution.eliminated.name} in the given model.`;
  }
  return `The data support ${solution.supported.label}: ${solution.supported.name} and are incompatible with ${solution.eliminated.label}: ${solution.eliminated.name} in the given model.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const key = (text) => String(text).toLowerCase().replace(/\\s+/g, " ").trim();',
  'for (const hypothesis of slots.hypotheses) {',
  '}',
  'const supporting = slots.hypotheses.filter((hypothesis) => hypothesis.predictions.some((prediction) => key(prediction) === key(slots.observation)));',
  'probe(supporting.length > 0, "at least one hypothesis must predict the observed result");',
  'probe(supporting.length === 1, "exactly one hypothesis must predict the observed result, not " + supporting.length);',
  'const supported = supporting[0];',
  'const eliminated = slots.hypotheses.find((hypothesis) => hypothesis !== supported);',
  'probe(eliminated !== undefined, "the observation must leave one competing hypothesis");',
  'probe(!eliminated.predictions.some((prediction) => key(prediction) === key(slots.observation)), "the eliminated hypothesis must not predict the observed result");',
  'const quoted = supported.name.toLowerCase() === "the problem is a lack of air";',
  'if (quoted) {',
  '  return "The data support " + supported.label + ", “" + supported.name + ",” and are incompatible with " + eliminated.label + ", " + eliminated.name + " in the given model.";',
  '}',
  'return "The data support " + supported.label + ": " + supported.name + " and are incompatible with " + eliminated.label + ": " + eliminated.name + " in the given model.";'
].join('\n');

function explain(slots, solution) {
  const predictions = (hypothesis) => hypothesis.predictions.join(', ');
  return [
    `The experiment observes “${slots.observation}”, so the comparison asks which stated explanation predicts exactly that result.`,
    `${solution.supported.label}: ${solution.supported.name} predicts it (its predictions are ${predictions(solution.supported)}), so the observation supports that hypothesis in the model.`,
    `The observation is not among the predictions of ${solution.eliminated.label}: ${solution.eliminated.name} (${predictions(solution.eliminated)}), so the model rules that hypothesis out for this comparison.`,
    'The conclusion says “better supported in this model”, not “true”: the experiment tested the stated predictions only, and other explanations are not excluded by this evidence alone.'
  ];
}

export const unit = 16;

export const cases = [
  {
    template: 'Competing hypotheses',
    type: slugify('Competing hypotheses'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
