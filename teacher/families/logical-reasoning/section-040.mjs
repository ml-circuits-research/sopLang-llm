/**
 * Section 40 of the logical-reasoning book: analogy held to a written fact.
 *
 * Every case prints a school card that names tilt, not changing distance from
 * the Sun, as the cause of the seasons, one speaker who offers a tilted lamp
 * over a globe, one speaker who prefers a nearer-in-summer picture because it
 * feels warmer, and one speaker who denies that two analogies can disagree.
 * The cases change the place and the three names; the card's chosen engine and
 * the distance it rejects are read from the card, so the surviving analogy is
 * the map that keeps the engine and the rival is rejected for contradicting
 * the listed fact about distance.
 */

import { slugify } from '../../naming.mjs';

const SCHOOL_CARD_PATTERN =
  /School card in ([^:]+): Earth\u2019s axis is tilted about 23\.5 degrees relative to its orbit; that (\w+), not changing (\w+) from the Sun, is why seasons change\. A speaker analogises a (tilted lamp) over a globe\. ([A-Z][a-z]+) says the lamp picture may teach the (\w+), but a second picture of \u201cEarth moving nearer in summer\u201d fights the card\. ([A-Z][a-z]+) prefers the nearer-in-summer picture because it feels warmer\. ([A-Z][a-z]+) says two analogies cannot disagree\./;

function parse(statement) {
  const card = SCHOOL_CARD_PATTERN.exec(statement);
  if (card === null) {
    throw new Error('the statement does not record the school card, the two pictures, and the three speakers');
  }
  return {
    place: card[1].trim(),
    engine: card[2],
    rival: card[3],
    lamp: card[4],
    supporter: card[5],
    taught: card[6],
    preferrer: card[7],
    denier: card[8]
  };
}

/**
 * The card breaks the tie between the two pictures: it names one engine and
 * the rival it replaces. The lamp picture teaches exactly the engine the card
 * chose, so it is allowed to survive as a map of that engine, while the
 * nearer-in-summer picture denies the listed fact about distance.
 */
function solve(slots) {
  if (slots.taught !== slots.engine) {
    throw new Error(`the lamp picture teaches "${slots.taught}", but the card's engine is "${slots.engine}"`);
  }
  return {
    lamp: slots.lamp,
    engine: slots.engine,
    rival: slots.rival
  };
}

function render(solution) {
  return `The ${solution.lamp}, as a map of ${solution.engine}. The nearer-in-summer picture contradicts the listed fact about ${solution.rival}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the school card");',
  'probe(typeof slots.engine === "string" && slots.engine.length > 0, "the card must name the engine that drives the seasons");',
  'probe(typeof slots.rival === "string" && slots.rival.length > 0, "the card must name the factor it rejects");',
  'probe(slots.engine !== slots.rival, "the card must choose one factor over a different one");',
  'probe(typeof slots.lamp === "string" && slots.lamp.length > 0, "the case must name the surviving picture");',
  'probe(typeof slots.supporter === "string" && slots.supporter.length > 0, "the case must name the speaker who offers the lamp picture");',
  'probe(typeof slots.preferrer === "string" && slots.preferrer.length > 0, "the case must name the speaker who prefers the nearer-in-summer picture");',
  'probe(typeof slots.denier === "string" && slots.denier.length > 0, "the case must name the speaker who denies that two analogies can disagree");',
  'probe(new Set([slots.supporter, slots.preferrer, slots.denier]).size === 3, "the three speakers must be three different people");',
  'probe(slots.taught === slots.engine, "the lamp picture must teach the engine the card chose, or it is a rival too");',
  'return "The " + slots.lamp + ", as a map of " + slots.engine + ". The nearer-in-summer picture contradicts the listed fact about " + slots.rival + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The school card in ${slots.place} chooses ${slots.engine} over changing ${slots.rival} from the Sun as the reason the seasons change, so that fact is the authority both pictures answer to.`,
    `${slots.supporter} offers the ${slots.lamp}, which teaches the chosen ${slots.engine} and therefore keeps the card's engine.`,
    `${slots.preferrer} prefers the nearer-in-summer picture because it feels warmer, but that picture asserts changing ${slots.rival}, which the card denies.`,
    `${slots.denier} is wrong that two analogies cannot disagree: they can, and the written fact breaks the tie in favour of the map of ${slots.engine}.`
  ];
}

export const unit = 40;

export const cases = [
  {
    template: 'Analogy held to a written fact',
    type: slugify('Analogy held to a written fact'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
