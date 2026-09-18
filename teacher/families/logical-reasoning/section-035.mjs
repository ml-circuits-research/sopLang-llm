/**
 * Section 35 of the logical-reasoning book: a living likeness.
 *
 * Every case posts a garden card that names the process and its inputs, then
 * records three reactions: one appeals to a proverb to keep the process
 * running without one of its listed inputs, one maps the card and finds the
 * input missing, and one prefers a neighbour's likeness as the better
 * science. The case data changes the place, the process, the missing input,
 * the proverb, and the three names; the verdict is fixed: the mapping of the
 * mechanism is doing the honest work, because the card's process needs the
 * listed input and a proverb is not a listed substitute.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN = /^Garden card in ([A-Z][A-Za-z ]*): /;
const PROCESS_PATTERN = /That process is called (\w+)\./;
const PROVERB_PATTERN =
  /([A-Z][a-z]+) says a plant in a ([A-Za-z ]+) will still make new sugar because “([A-Za-z ]+?) (find|make|get) ([A-Za-z ]+?)\.?”/;
const MAPPER_PATTERN = /([A-Z][a-z]+) maps the card: no (\w+), no listed process\./;
const RIVAL_PATTERN = /([A-Z][a-z]+) says the (\w+) likeness is the better science\./;

/** The gerund the printed verdict quotes, keyed by the proverb's verb. */
const GERUND_OF_VERB = Object.freeze({
  find: 'Finding',
  make: 'Making',
  get: 'Getting'
});

function required(pattern, statement, what) {
  const match = pattern.exec(statement);
  if (match === null) {
    throw new Error(`the statement does not record ${what}`);
  }
  return match;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function parse(statement) {
  const card = required(CARD_PATTERN, statement, 'the place of the garden card');
  const process = required(PROCESS_PATTERN, statement, 'the name of the process the card describes');
  const proverber = required(PROVERB_PATTERN, statement, 'the reader who appeals to a proverb');
  const mapper = required(MAPPER_PATTERN, statement, 'the reader who maps the card and finds an input missing');
  const rival = required(RIVAL_PATTERN, statement, 'the reader who prefers another likeness');
  return {
    place: card[1].trim(),
    process: process[1],
    proverber: proverber[1],
    darkPlace: proverber[2].trim(),
    proverbSubject: proverber[3].trim(),
    proverbVerb: proverber[4],
    proverbObject: proverber[5].trim(),
    mapper: mapper[1],
    missingInput: mapper[2],
    rival: rival[1],
    rivalFeature: rival[2]
  };
}

function solve(slots) {
  const gerund = GERUND_OF_VERB[slots.proverbVerb];
  if (gerund === undefined) {
    throw new Error(`the proverb uses a verb this section does not quote: ${slots.proverbVerb}`);
  }
  if (slots.mapper === slots.proverber || slots.proverber === slots.rival) {
    throw new Error('the three reactions must be given by different people');
  }
  return {
    verdict: 'mapping',
    mapper: slots.mapper,
    process: capitalize(slots.process),
    missingInput: slots.missingInput,
    proverbGerund: gerund,
    proverbObject: slots.proverbObject,
    place: slots.place,
    proverber: slots.proverber,
    darkPlace: slots.darkPlace,
    rival: slots.rival,
    rivalFeature: slots.rivalFeature
  };
}

function render(solution) {
  return `${solution.mapper}’s mapping of the mechanism. ${solution.process} as written needs ${solution.missingInput}. “${solution.proverbGerund} ${solution.proverbObject}” is not a listed substitute.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const gerundOfVerb = { find: "Finding", make: "Making", get: "Getting" };',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the garden card");',
  'probe(typeof slots.process === "string" && slots.process.length > 0, "the card must name the process");',
  'probe(gerundOfVerb[slots.proverbVerb] !== undefined, "the proverb must use a verb this section quotes");',
  'probe(typeof slots.missingInput === "string" && slots.missingInput.length > 0, "the mapping must name the input the card lists and the case withholds");',
  'probe(typeof slots.mapper === "string" && slots.mapper.length > 0, "the case must name the reader who maps the card");',
  'probe(slots.mapper !== slots.proverber && slots.proverber !== slots.rival, "the three reactions must be given by different people");',
  'const process = slots.process.charAt(0).toUpperCase() + slots.process.slice(1);',
  'return slots.mapper + "\\u2019s mapping of the mechanism. " + process + " as written needs " + slots.missingInput + ". \\u201c" + gerundOfVerb[slots.proverbVerb] + " " + slots.proverbObject + "\\u201d is not a listed substitute.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The garden card in ${solution.place} names ${solution.process} and lists its inputs, so the process runs only when the light it needs is present.`,
    `${solution.proverber} moves a plant into a ${solution.darkPlace} and keeps the sugar claim by quoting “${slots.proverbSubject} ${slots.proverbVerb} ${slots.proverbObject}”, which is a proverb and not a listed substitute for an input.`,
    `${solution.mapper} maps the card instead: with no ${solution.missingInput} the listed process does not run, so no new sugar is made under the card's own mechanism.`,
    `${solution.rival} prefers the ${solution.rivalFeature} likeness, which carries no inputs at all; only the mapping of the card's mechanism does honest work.`
  ];
}

export const unit = 35;

export const cases = [
  {
    template: 'A living likeness',
    type: slugify('A living likeness'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
