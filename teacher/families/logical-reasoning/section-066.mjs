/**
 * Section 66 of the logical-reasoning book: absolute change and relative
 * change.
 *
 * Every case prints a risk card from a named place: a listed risk before and
 * after a change, plus two posters, one speaking in relative terms and one in
 * absolute terms. Three voices answer — each poster is defended alone by one
 * voice and the third demands both sentences — and the question asks which
 * poster tells the truth.
 *
 * The case data changes the place and the three names; the reasoning is fixed.
 * The fall is half in relative terms and one point in absolute terms, and the
 * two bases are the same printed denominator, so both posters describe the same
 * change. The module derives the two descriptions from the printed numbers and
 * renders the printed verdict with them.
 */

import { slugify } from '../../naming.mjs';

const NUMBER_WORDS = Object.freeze([
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty'
]);

function numberWord(value) {
  return NUMBER_WORDS[value] ?? String(value);
}

const CARD_PATTERN =
  /Card in (.+?): a listed risk moves from (\d+) in (\d+) to (\d+) in (\d+) after a change\. Poster A: “([^”]+)” Poster B: “([^”]+)”/;
const VOICES_PATTERN =
  /([A-Z][a-z]+) says only Poster A is true\. ([A-Z][a-z]+) says only Poster B is true\. ([A-Z][a-z]+) says both can be true and should be written together\./;

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  const voices = VOICES_PATTERN.exec(statement);
  if (card === null || voices === null) {
    throw new Error('the statement does not record the risk card, the two posters, and the three voices');
  }
  return {
    place: card[1],
    before: Number(card[2]),
    beforeBase: Number(card[3]),
    after: Number(card[4]),
    afterBase: Number(card[5]),
    posterA: card[6],
    posterB: card[7],
    relativeVoice: voices[1],
    absoluteVoice: voices[2],
    bothVoice: voices[3]
  };
}

function solve(slots) {
  if (!Number.isInteger(slots.before) || slots.before <= 0) {
    throw new Error('the card must print a positive risk before the change');
  }
  if (!Number.isInteger(slots.after) || slots.after <= 0) {
    throw new Error('the card must print a positive risk after the change');
  }
  if (!Number.isInteger(slots.beforeBase) || !Number.isInteger(slots.afterBase) || slots.beforeBase <= 0) {
    throw new Error('the card must print the risk against a positive base');
  }
  if (slots.beforeBase !== slots.afterBase) {
    throw new Error('the two bases must be the same, so the two posters describe one change');
  }
  if (slots.after >= slots.before) {
    throw new Error('this section prints a risk that falls after the change');
  }
  if (
    slots.relativeVoice === slots.absoluteVoice ||
    slots.absoluteVoice === slots.bothVoice ||
    slots.relativeVoice === slots.bothVoice
  ) {
    throw new Error('the three voices must be different people');
  }
  const relativeHalved = slots.after * 2 === slots.before;
  if (!relativeHalved) {
    throw new Error('this section prints a fall of exactly half as the relative description');
  }
  const absoluteFall = slots.before - slots.after;
  if (slots.beforeBase !== 100 || absoluteFall !== 1) {
    throw new Error('this section prints a fall of exactly one point in a hundred as the absolute description');
  }
  return {
    place: slots.place,
    before: slots.before,
    after: slots.after,
    base: slots.beforeBase,
    absoluteFall,
    posterA: slots.posterA,
    posterB: slots.posterB,
    relativeVoice: slots.relativeVoice,
    absoluteVoice: slots.absoluteVoice,
    bothVoice: slots.bothVoice,
    relativeWord: 'half',
    absoluteWord: `${numberWord(absoluteFall)} percentage point${absoluteFall === 1 ? '' : 's'}`,
    bothTrue: true
  };
}

function render(solution) {
  return solution.bothTrue
    ? `Both, about the same change. Relative fall: ${solution.relativeWord}. Absolute fall: ${solution.absoluteWord}.`
    : 'Only one poster describes this change.';
}

const COMPUTE = [
  'const slots = $slots;',
  'const NUMBER_WORDS = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"];',
  'const word = (value) => NUMBER_WORDS[value] ?? String(value);',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place on the risk card");',
  'probe(Number.isInteger(slots.before) && slots.before > 0, "the card must print a positive risk before the change");',
  'probe(Number.isInteger(slots.after) && slots.after > 0, "the card must print a positive risk after the change");',
  'probe(Number.isInteger(slots.beforeBase) && slots.beforeBase > 0 && slots.beforeBase === slots.afterBase, "the two risks must sit on the same positive base");',
  'probe(slots.after < slots.before, "the risk must fall after the change");',
  'probe(typeof slots.posterA === "string" && slots.posterA.length > 0, "the case must print Poster A");',
  'probe(typeof slots.posterB === "string" && slots.posterB.length > 0, "the case must print Poster B");',
  'probe(typeof slots.relativeVoice === "string" && slots.relativeVoice.length > 0, "the case must name the voice that backs Poster A");',
  'probe(typeof slots.absoluteVoice === "string" && slots.absoluteVoice.length > 0, "the case must name the voice that backs Poster B");',
  'probe(typeof slots.bothVoice === "string" && slots.bothVoice.length > 0, "the case must name the voice that demands both posters");',
  'probe(slots.relativeVoice !== slots.absoluteVoice && slots.absoluteVoice !== slots.bothVoice && slots.relativeVoice !== slots.bothVoice, "the three voices must be different people");',
  'const relativeHalved = slots.after * 2 === slots.before;',
  'const absoluteFall = slots.before - slots.after;',
  'probe(relativeHalved, "the relative description must be a fall of half");',
  'probe(slots.beforeBase === 100 && absoluteFall === 1, "the absolute description must be a fall of one point in a hundred");',
  'const relativeWord = "half";',
  'const absoluteWord = word(absoluteFall) + " percentage point" + (absoluteFall === 1 ? "" : "s");',
  'const bothTrue = relativeHalved && slots.beforeBase === 100 && absoluteFall === 1;',
  'probe(bothTrue, "both posters must describe the same change");',
  'return bothTrue ? "Both, about the same change. Relative fall: " + relativeWord + ". Absolute fall: " + absoluteWord + "." : "Only one poster describes this change.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card from ${solution.place} writes the risk as ${solution.before} in ${solution.base} before the change and ${solution.after} in ${solution.base} after it.`,
    `Relative to the old risk, ${solution.after} is half of ${solution.before}; absolutely, the fall is ${solution.absoluteWord}.`,
    `${solution.relativeVoice} and ${solution.absoluteVoice} each defend one poster, but the two bases are the same and both sentences are true.`,
    `${solution.bothVoice} is right to demand both, because framing a change in one base alone hides the other description.`
  ];
}

export const unit = 66;

export const cases = [
  {
    template: 'Absolute change and relative change',
    type: slugify('Absolute change and relative change'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
