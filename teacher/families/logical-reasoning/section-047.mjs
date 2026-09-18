/**
 * Section 47 of the logical-reasoning book: a mechanism named in the text.
 *
 * Every case posts one card that writes the sugar-making path with light among
 * its stated inputs, keeps a plant in a sealed dark cupboard for a listed span,
 * and records three verdicts: one keeps the written path, one appeals to a
 * proverb about living things, and one files the darkness as a mere
 * correlation. The case data changes the place, the three names, the listed
 * span, and the subject the darkness is tied to; the reasoning is fixed:
 * removing a listed input stops the written path, a saying is not a second
 * mechanism until it is written, and a written path is not downgraded to a
 * coincidence.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN =
  /Card in (.+?): green plants make sugars from carbon dioxide and water using light\./;
const CUPBOARD_PATTERN =
  /A plant sits in a sealed dark cupboard for a listed ([a-z]+) with water but no light\./;
const MECHANISM_PATTERN =
  /([A-Z][a-z]+) says new sugar-making by the listed process is not available this ([a-z]+)\./;
const PROVERB_PATTERN = /([A-Z][a-z]+) says living things find a way\./;
const CORRELATION_PATTERN =
  /([A-Z][a-z]+) says darkness is only correlated with idle ([a-z]+), never ([a-z]+)\./;

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  const cupboard = CUPBOARD_PATTERN.exec(statement);
  const mechanism = MECHANISM_PATTERN.exec(statement);
  const proverb = PROVERB_PATTERN.exec(statement);
  const correlation = CORRELATION_PATTERN.exec(statement);
  if (card === null || cupboard === null || mechanism === null || proverb === null || correlation === null) {
    throw new Error('the statement does not record the card, the cupboard, and the three verdicts');
  }
  return {
    place: card[1],
    span: cupboard[1],
    supported: mechanism[1],
    supportedSpan: mechanism[2],
    proverb: proverb[1],
    correlation: correlation[1],
    idleSubject: correlation[2]
  };
}

function solve(slots) {
  if (slots.supported === slots.proverb || slots.supported === slots.correlation || slots.proverb === slots.correlation) {
    throw new Error('the three verdicts must be attributed to three different people');
  }
  if (slots.supportedSpan !== slots.span) {
    throw new Error('the verdict about the path must cover the listed span of the cupboard');
  }
  return {
    supported: slots.supported,
    proverb: slots.proverb,
    correlation: slots.correlation
  };
}

function render(solution) {
  return `${solution.supported}’s sentence. The mechanism names light as an input. “Find a way” invents a second process the card does not give.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place the card is posted in");',
  'probe(typeof slots.span === "string" && slots.span.length > 0, "the case must state the listed span of the sealed cupboard");',
  'probe(typeof slots.supported === "string" && slots.supported.length > 0, "the case must name the speaker who keeps the written path");',
  'probe(slots.supportedSpan === slots.span, "the verdict about the path must cover the listed span of the cupboard");',
  'probe(slots.supported !== slots.proverb && slots.supported !== slots.correlation && slots.proverb !== slots.correlation, "the three verdicts must be attributed to three different people");',
  'probe(typeof slots.idleSubject === "string" && slots.idleSubject.length > 0, "the correlation verdict must name what the darkness goes with");',
  'return slots.supported + "\\u2019s sentence. The mechanism names light as an input. \\u201cFind a way\\u201d invents a second process the card does not give.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card in ${slots.place} writes the sugar-making path with carbon dioxide, water, and light among its listed inputs, so a plant kept dark for the listed ${slots.span} cannot run that path.`,
    `${solution.supported} keeps the written path and says new sugar-making by it is not available this ${slots.span}, which is the sentence the card supports.`,
    `${solution.proverb} offers a proverb about living things instead, but a saying is not a rival pathway until someone writes it down with its own inputs.`,
    `${solution.correlation} files the darkness as a correlation with idle ${slots.idleSubject}; the card names light as an input, so the path itself, not a coincidence, is why the sugar-making stops.`
  ];
}

export const unit = 47;

export const cases = [
  {
    template: 'A mechanism named in the text',
    type: slugify('A mechanism named in the text'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
