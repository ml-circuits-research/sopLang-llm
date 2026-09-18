/**
 * Section 91 of the logical-reasoning book: anecdote beside a comparison.
 *
 * Every case records one named person in a named place who improved after
 * tea, prints a card reporting an N-person comparison in which tea and
 * rest-only eased at the same listed rate, and gives one voice that treats the
 * anecdote as equal to the card and one voice that keeps the layers labelled.
 * The case data changes the person, the place, the comparison size, and the
 * two voices; the reasoning is fixed: the anecdote is sample one and the card
 * is a comparison, so the comparison card leads a cautious decision, and the
 * module renders the printed verdict with the named person.
 */

import { slugify } from '../../naming.mjs';

const ANECDOTE_PATTERN =
  /([A-Z][a-z]+) in (.+?) improved after tea\. A printed card: in a (\d+)-person comparison, tea and rest-only eased at the same listed rate\. ([A-Z][a-z]+) treats the anecdote as equal to the card\. ([A-Z][a-z]+) keeps the layers labelled: one story versus a comparison\./;

function parse(statement) {
  const anecdote = ANECDOTE_PATTERN.exec(statement);
  if (anecdote === null) {
    throw new Error('the statement does not record the anecdote beside the printed comparison');
  }
  return {
    person: anecdote[1],
    place: anecdote[2],
    size: Number(anecdote[3]),
    equalizer: anecdote[4],
    labeller: anecdote[5]
  };
}

function solve(slots) {
  if (!Number.isInteger(slots.size) || slots.size <= 0) {
    throw new Error('the comparison must cover a positive number of people');
  }
  if (slots.person === slots.equalizer || slots.person === slots.labeller) {
    throw new Error('the improved person must be distinct from the two voices');
  }
  return {
    person: slots.person,
    place: slots.place,
    size: slots.size,
    equalizer: slots.equalizer,
    labeller: slots.labeller
  };
}

function render(solution) {
  return `The comparison card. The anecdote is real about ${solution.person} and does not upgrade the trial.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.person === "string" && slots.person.length > 0, "the case must name the person who improved after tea");',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the anecdote");',
  'probe(Number.isInteger(slots.size) && slots.size > 0, "the comparison must cover a positive number of people");',
  'probe(typeof slots.equalizer === "string" && slots.equalizer.length > 0, "the case must name the voice that equates the anecdote with the card");',
  'probe(typeof slots.labeller === "string" && slots.labeller.length > 0, "the case must name the voice that keeps the layers labelled");',
  'probe(slots.equalizer !== slots.labeller, "the two voices must be different people");',
  'probe(slots.person !== slots.equalizer && slots.person !== slots.labeller, "the improved person must be distinct from the two voices");',
  'return "The comparison card. The anecdote is real about " + slots.person + " and does not upgrade the trial.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${solution.person} in ${solution.place} improved after tea, which is an anecdote: a sample of one.`,
    `The printed card reports a ${solution.size}-person comparison in which tea and rest-only eased at the same listed rate, and ease without the tea is the point of the comparison.`,
    `${solution.equalizer} treats the story as equal to the card, while ${solution.labeller} keeps one story and one comparison on separate layers.`,
    `Both can be true at once, but only the comparison card should lead a cautious decision about whether the tea did the work.`
  ];
}

export const unit = 91;

export const cases = [
  {
    template: 'Anecdote beside a comparison',
    type: slugify('Anecdote beside a comparison'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
