/**
 * Section 4 of the logical-reasoning book: if the back is absent.
 *
 * Every case prints one caretaker card in the form "IF the street pipe is
 * frozen solid, THEN every ground-floor tap gives no water", a speaker who
 * runs a tap and gets a steady stream, a second speaker who denies the frozen
 * pipe, and a third speaker who reads a dry tap tomorrow as proof of a freeze.
 * The case data changes the place and the three names; the reasoning is fixed:
 * the running tap makes the consequent false, so modus tollens denies the
 * antecedent, while a dry tap would only affirm the consequent — the card
 * named one sufficient path to dryness, not the only path. The family reads
 * the card and the three sentences and renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN =
  /Caretaker card in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): “IF (the street pipe is frozen solid), THEN (every ground-floor tap gives no water)\.”/;
const SPEAKERS_PATTERN =
  /([A-Z][a-z]+) opens the kitchen tap and a steady stream comes\. ([A-Z][a-z]+) says the street pipe cannot be frozen solid, given this card\. ([A-Z][a-z]+) says a dry tap tomorrow would, by the same card, prove a freeze\./;

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  const speakers = SPEAKERS_PATTERN.exec(statement);
  if (card === null || speakers === null) {
    throw new Error('the statement does not carry the caretaker card and the three sentences');
  }
  return {
    place: card[1],
    antecedent: card[2],
    consequent: card[3],
    tapOpener: speakers[1],
    denier: speakers[2],
    overreacher: speakers[3]
  };
}

/**
 * The card is the implication "frozen pipe implies dry taps". The steady
 * stream falsifies the consequent, so denying the antecedent is valid, while
 * reading a dry tap as proof of a freeze would affirm the consequent.
 */
function solve(slots) {
  if (slots.antecedent.length === 0 || slots.consequent.length === 0) {
    throw new Error('the card must state both halves of the conditional');
  }
  if (slots.denier === slots.overreacher) {
    throw new Error('the valid sentence and the overreaching sentence must come from different speakers');
  }
  return {
    forced: slots.denier,
    overreacher: slots.overreacher
  };
}

function render(solution) {
  return `${solution.forced} is forced (modus tollens). ${solution.overreacher} affirms the back: a dry tap has more than one possible path. The card named one sufficient path to dryness, not the only path.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return slots.denier + " is forced (modus tollens). " + slots.overreacher + " affirms the back: a dry tap has more than one possible path. The card named one sufficient path to dryness, not the only path.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card of ${slots.place} states one conditional: if ${slots.antecedent}, then ${slots.consequent}.`,
    `${slots.tapOpener} opens a kitchen tap and a steady stream comes, so the consequent is false, and modus tollens makes the denial of the antecedent by ${solution.forced} valid.`,
    `${solution.overreacher} would treat a later dry tap as proof of a freeze, but that affirms the consequent: a dry tap has more than one possible path.`,
    `The card named one sufficient path to dryness, not the only path, so the second sentence outruns what the card says.`
  ];
}

export const unit = 4;

export const cases = [
  {
    template: 'If the back is absent',
    type: slugify('If the back is absent'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
