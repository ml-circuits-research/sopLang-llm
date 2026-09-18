/**
 * Section 98 of the logical-reasoning book: two families on one page.
 *
 * Every case posts a vaccine card in a named place: the definitional mechanism
 * the card states and, beside it, three neighbours reporting tiredness after a
 * dose, then three readings of the pair. The case data changes the place and
 * the three names; the reasoning is fixed: the card's sentence says what a
 * vaccine is, the tired evenings are a thin inductive sample about a side
 * feeling, and two families that answer different questions can both stand.
 * The family reads the card and its three readings and renders the verdict.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN =
  /^Card in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): \u201cA vaccine trains the immune system; it is not a listed daily food\.\u201d Beside it, three neighbours say they felt tired after a dose\. ([A-Z][a-z]+) treats three stories as a disproof of the training sentence\. ([A-Z][a-z]+) keeps the definitional mechanism separate from a thin inductive sample about tiredness\. ([A-Z][a-z]+) says two families on one card must cancel\./;

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  if (card === null) {
    throw new Error('the statement does not record the vaccine card and its three readings');
  }
  return {
    place: card[1],
    disproofReader: card[2],
    separator: card[3],
    canceller: card[4]
  };
}

function solve(slots) {
  if (typeof slots.place !== 'string' || slots.place.length === 0) {
    throw new Error('the card must name the place of the clinic');
  }
  const readers = [slots.disproofReader, slots.separator, slots.canceller];
  if (!readers.every((name) => typeof name === 'string' && name.length > 0)) {
    throw new Error('the card must name the three neighbours reading it');
  }
  if (new Set(readers).size !== readers.length) {
    throw new Error('the three readings must come from three different people');
  }
  return {
    place: slots.place,
    disproofReader: slots.disproofReader,
    separator: slots.separator,
    canceller: slots.canceller
  };
}

function render() {
  return 'Yes. The training sentence is a definitional mechanism on the card. Three tired evenings are a small sample about a side feeling, not a refutation of what the card said a vaccine is.';
}

const COMPUTE = [
  'const slots = $slots;',
  'const readers = [slots.disproofReader, slots.separator, slots.canceller];',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the card must name the place of the clinic");',
  'probe(readers.every((name) => typeof name === "string" && name.length > 0), "the card must name the three neighbours reading it");',
  'probe(new Set(readers).size === readers.length, "the three readings must come from three different people");',
  'return "Yes. The training sentence is a definitional mechanism on the card. Three tired evenings are a small sample about a side feeling, not a refutation of what the card said a vaccine is.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card in ${solution.place} states a definitional mechanism: a vaccine trains the immune system, and it is not a listed daily food.`,
    `Beside it stand three testimonies about tiredness after a dose, which are a small sample about a side feeling.`,
    `${solution.separator} keeps the two apart, so the small inductive sample is weighed against its own question and never eats the definition by standing next to it.`,
    `${solution.disproofReader} treats the three stories as a refutation, and ${solution.canceller} wants the two families to cancel; both confuse two different questions for one.`
  ];
}

export const unit = 98;

export const cases = [
  {
    template: 'Two families on one page',
    type: slugify('Two families on one page'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
