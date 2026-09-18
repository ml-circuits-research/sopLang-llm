/**
 * Form 8 of the scientific-reasoning book: inferring a hidden state.
 *
 * Every variant declares that each sign can be produced only by the causes it
 * lists, gives three causes with the signs each of them can produce, and
 * reports a single observed sign. Reasoning backwards is valid only because
 * the statement declares the list of causes complete: the hidden state is the
 * one cause whose sign list contains the observed sign, and each other cause is
 * eliminated because it cannot produce that sign at all. The shared signs
 * between causes are deliberately uninformative, which is why the observed sign
 * is never one that two causes share.
 *
 * The variants differ in the world's vocabulary (germination, a leaf, a
 * meadow, digestion, sound, the water cycle, geology), not in the backward
 * step, so one family covers all twenty-five of them. The source prints the
 * cause with a lower-case first letter inside its answer sentence, which is why
 * the rendered answer lower-cases it.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/;
const CAUSE_LIST_PATTERN =
  /produced only by the causes listed:\s*([\s\S]*?)\.\s*We observe the sign “([^”]+)”/;
const ARROW_PATTERN = /\s*(?:→|->)\s*/;

function splitSigns(text) {
  return text
    .split(',')
    .map((sign) => sign.trim())
    .filter((sign) => sign !== '');
}

function lowerFirst(text) {
  return text.length === 0 ? text : `${text[0].toLowerCase()}${text.slice(1)}`;
}

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state its case data');
  }
  const blocks = CAUSE_LIST_PATTERN.exec(caseData[1]);
  if (blocks === null) {
    throw new Error('the statement does not list the causes with the signs they produce');
  }
  const causes = blocks[1].split(/\.\s+/).map((chunk) => {
    const parts = chunk.split(ARROW_PATTERN);
    if (parts.length !== 2 || parts[0].trim() === '' || parts[1].trim() === '') {
      throw new Error(`the cause "${chunk}" is not written as "cause → signs"`);
    }
    return { cause: parts[0].trim(), signs: splitSigns(parts[1]) };
  });
  if (causes.length === 0) {
    throw new Error('the statement lists no possible cause');
  }
  const observed = blocks[2].trim();
  if (observed === '') {
    throw new Error('the statement reports no observed sign');
  }
  return { causes, observed };
}

function solve(slots) {
  const matching = slots.causes.filter((entry) => entry.signs.includes(slots.observed));
  if (matching.length === 0) {
    throw new Error(`no declared cause can produce the observed sign "${slots.observed}"`);
  }
  if (matching.length > 1) {
    const ambiguity = new Error(
      `the observed sign "${slots.observed}" leaves ${matching.length} hidden states: ${matching.map((entry) => entry.cause).join(', ')}`
    );
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  return { cause: matching[0].cause };
}

function render(solution) {
  return `The hidden state is “${lowerFirst(solution.cause)}”.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.causes) && slots.causes.length > 0, "the statement must list at least one possible cause");',
  'probe(typeof slots.observed === "string" && slots.observed.length > 0, "the statement must report the observed sign");',
  'for (const entry of slots.causes) {',
  '  probe(typeof entry.cause === "string" && entry.cause.length > 0, "every cause must carry a name");',
  '  probe(Array.isArray(entry.signs) && entry.signs.length > 0, "every cause must list the signs it can produce: " + entry.cause);',
  '}',
  'const matching = slots.causes.filter((entry) => entry.signs.indexOf(slots.observed) !== -1);',
  'probe(matching.length > 0, "at least one declared cause must produce the observed sign");',
  'probe(matching.length === 1, "the observed sign must leave exactly one hidden state, not " + matching.length);',
  'const cause = matching[0].cause;',
  'const lowerFirst = cause.length === 0 ? cause : cause[0].toLowerCase() + cause.slice(1);',
  'return "The hidden state is “" + lowerFirst + "”.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The model declares the causes complete and gives each of the ${slots.causes.length} causes the signs it can produce.`,
    `The observed sign “${slots.observed}” is looked up in those lists, which keeps only the causes able to produce it.`,
    `The other causes are eliminated because none of their listed signs is the observed one, so the hidden state is “${solution.cause}”.`,
    'The step from effect to cause is licensed by the closed model of the problem; outside it, the cause list need not be complete.'
  ];
}

export const unit = 8;

export const cases = [
  {
    template: 'Inferring a hidden state',
    type: slugify('Inferring a hidden state'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
