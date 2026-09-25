/**
 * Section 44 of the logical-reasoning book: a hidden third factor.
 *
 * Every case prints shop notes in a named place where people who buy one thing
 * also report more of another, and three people read the pair: the first reads
 * the purchase as the cause, the second names an already-present trait that may
 * buy both, the third calls the price itself a mechanism. The case data changes
 * the place and the three names; the reasoning is fixed: an unseparated third
 * factor sits behind both columns, so selection is not yet separated from help.
 * The family reads the confound claim and renders the printed verdict with the
 * trait the second speaker named.
 */

import { slugify } from '../../naming.mjs';

const TEMPLATE = 'A hidden third factor';

const SHOP_PATTERN =
  /Shop notes in ([A-Z][A-Za-z ]+): people who buy the expensive ([a-z ]+) also log more ([a-z]+)\. ([A-Z][a-z]+) says the ([a-z ]+) cause the ([a-z]+)\. ([A-Z][a-z]+) says a third factor — already being a ([a-z]+) ([a-z]+) — may buy both the ([a-z ]+) and the ([a-z]+)\. ([A-Z][a-z]+) says price itself is a mechanism\./;

function sentenceCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function parse(statement) {
  const notes = SHOP_PATTERN.exec(statement);
  if (notes === null) {
    throw new Error('the statement does not print the shop notes with its three readings');
  }
  return {
    place: notes[1],
    purchase: notes[2],
    outcome: notes[3],
    causalSpeaker: notes[4],
    purchasedThing: notes[5],
    causalOutcome: notes[6],
    confoundSpeaker: notes[7],
    traitAdjective: notes[8],
    traitNoun: notes[9],
    factorThing: notes[10],
    factorOutcome: notes[11],
    priceSpeaker: notes[12]
  };
}

function solve(slots) {
  if (slots.causalOutcome !== slots.outcome || slots.factorOutcome !== slots.outcome) {
    throw new Error('every reading must log the same outcome the notes report');
  }
  if (!slots.purchase.endsWith(slots.purchasedThing) || slots.factorThing !== slots.purchasedThing) {
    throw new Error('the causal reading and the confound reading must name the same purchase');
  }
  const speakers = [slots.causalSpeaker, slots.confoundSpeaker, slots.priceSpeaker];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three readings must come from three different speakers');
  }
  return { traitAdjective: slots.traitAdjective };
}

function render(solution) {
  return `${sentenceCase(solution.traitAdjective)}ness can sit behind both columns. The table as written does not separate help from selection.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return slots.traitAdjective.charAt(0).toUpperCase() + slots.traitAdjective.slice(1) + "ness can sit behind both columns. The table as written does not separate help from selection.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The notes in ${slots.place} show that people who buy the expensive ${slots.purchase} also log more ${slots.outcome}, so the two columns move together.`,
    `${slots.confoundSpeaker} names an unseparated third factor — already being a ${slots.traitAdjective} ${slots.traitNoun} — which may buy both the ${slots.factorThing} and the ${slots.factorOutcome}.`,
    `${slots.causalSpeaker} reads the ${slots.purchasedThing} as the cause and ${slots.priceSpeaker} reads the price as one, but the table as written does not separate help from selection.`
  ];
}

export const unit = 44;

export const cases = [
  {
    template: TEMPLATE,
    type: slugify(TEMPLATE),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
