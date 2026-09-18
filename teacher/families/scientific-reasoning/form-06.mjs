/**
 * Form 6 of the scientific-reasoning book: diagnosis from clues.
 *
 * Every variant states a small closed model, lists three possible causes with
 * the signs each cause would produce, and reports the signs that were actually
 * observed. The cause supported by the data is the one whose sign list is
 * exactly the observed list: every other cause either misses an observed sign
 * or requires a sign the observation contradicts. The variants differ in the
 * world's vocabulary (germination, a leaf, a meadow, digestion, circuits,
 * separation of a mixture), not in the diagnosis, so one family covers all
 * twenty-five of them.
 *
 * The source prints the cause with a lower-case first letter inside its answer
 * sentence, which is why the rendered answer lower-cases it.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/;
const CAUSE_LIST_PATTERN =
  /possible causes and their signs are:\s*([\s\S]*?)\.\s*We observe:\s*([\s\S]*)$/;

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
    throw new Error('the statement does not list the possible causes with their signs');
  }
  const causes = blocks[1].split(/\.\s+/).map((chunk) => {
    const separator = chunk.indexOf(': ');
    if (separator === -1) {
      throw new Error(`the cause "${chunk}" does not name the signs it produces`);
    }
    return {
      cause: chunk.slice(0, separator).trim(),
      signs: splitSigns(chunk.slice(separator + 2))
    };
  });
  if (causes.length === 0) {
    throw new Error('the statement lists no possible cause');
  }
  const observed = splitSigns(blocks[2].replace(/\.\s*$/, ''));
  if (observed.length === 0) {
    throw new Error('the statement reports no observation');
  }
  return { causes, observed };
}

function solve(slots) {
  const matching = slots.causes.filter(
    (entry) =>
      entry.signs.length === slots.observed.length &&
      slots.observed.every((sign) => entry.signs.includes(sign))
  );
  if (matching.length === 0) {
    throw new Error('no cause explains every observed sign');
  }
  if (matching.length > 1) {
    const ambiguity = new Error(
      `the stated causes leave ${matching.length} diagnosis candidates: ${matching.map((entry) => entry.cause).join(', ')}`
    );
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  return { cause: matching[0].cause };
}

function render(solution) {
  return `The cause supported by the data is “${lowerFirst(solution.cause)}”.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.causes) && slots.causes.length > 0, "the statement must list at least one possible cause");',
  'probe(Array.isArray(slots.observed) && slots.observed.length > 0, "the statement must report at least one observation");',
  'for (const entry of slots.causes) {',
  '  probe(typeof entry.cause === "string" && entry.cause.length > 0, "every cause must carry a name");',
  '  probe(Array.isArray(entry.signs) && entry.signs.length > 0, "every cause must list the signs it produces: " + entry.cause);',
  '}',
  'const matching = slots.causes.filter((entry) => entry.signs.length === slots.observed.length && slots.observed.every((sign) => entry.signs.includes(sign)));',
  'probe(matching.length > 0, "at least one cause must explain every observed sign");',
  'probe(matching.length === 1, "exactly one cause must match the observations, not " + matching.length);',
  'const cause = matching[0].cause;',
  'const lowerFirst = cause.length === 0 ? cause : cause[0].toLowerCase() + cause.slice(1);',
  'return "The cause supported by the data is “" + lowerFirst + "”.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The model offers ${slots.causes.length} possible causes, each with the signs it would produce: ${slots.causes.map((entry) => entry.cause).join(', ')}.`,
    `The observations are ${slots.observed.join(', ')}, so a cause fits only if its sign list contains every observed sign and no sign that was not observed.`,
    `The other causes each miss at least one observed sign or predict a sign that the observation contradicts, while “${solution.cause}” is compatible with all of the data.`,
    `The diagnosis concludes inside the closed model of the problem, not about causes outside it.`
  ];
}

export const unit = 6;

export const cases = [
  {
    template: 'Diagnosis from clues',
    type: slugify('Diagnosis from clues'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
