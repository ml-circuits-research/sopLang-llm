/**
 * Section 92 of the logical-reasoning book: a control as written.
 *
 * Every case posts a trial card in a named place: a rest-only group, a tea
 * group, the same listed headcount, and an identical easing rate, followed by
 * three readings of the rest-only group. The case data changes the place, the
 * headcount, and the three names; the reasoning is fixed: the rest-only group
 * is the world without the candidate cause, built and kept, so it is the
 * contrast that leaves rest, time, and regression standing beside tea. The
 * family reads the card and the three readings and renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN =
  /^Card in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): Group R rests only; Group T takes tea; (\d+) listed people each; easing rate identical\. ([A-Z][a-z]+) says the tea group\u2019s improvement still proves tea\. ([A-Z][a-z]+) says the rest-only group is there to show what would happen without tea; identical rates undercut tea as the difference\. ([A-Z][a-z]+) says controls are rude to tea\./;

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  if (card === null) {
    throw new Error('the statement does not record the trial card and its three readings');
  }
  return {
    place: card[1],
    listedPeople: Number(card[2]),
    teaReader: card[3],
    contrastReader: card[4],
    controlReader: card[5]
  };
}

function solve(slots) {
  if (!Number.isInteger(slots.listedPeople) || slots.listedPeople <= 0) {
    throw new Error('the card must list a positive number of people per group');
  }
  const readers = [slots.teaReader, slots.contrastReader, slots.controlReader];
  if (new Set(readers).size !== readers.length) {
    throw new Error('the three readings must come from three different people');
  }
  return {
    place: slots.place,
    listedPeople: slots.listedPeople,
    teaReader: slots.teaReader,
    contrastReader: slots.contrastReader,
    controlReader: slots.controlReader
  };
}

function render(solution) {
  return 'Acting as the contrast. Without it, improvement after tea could be rest, time, or regression.';
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the card must name the place of the trial");',
  'probe(Number.isInteger(slots.listedPeople) && slots.listedPeople > 0, "the card must list a positive number of people per group");',
  'probe(slots.teaReader !== slots.contrastReader && slots.contrastReader !== slots.controlReader && slots.teaReader !== slots.controlReader, "the three readings must come from three different people");',
  'return "Acting as the contrast. Without it, improvement after tea could be rest, time, or regression.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card from ${solution.place} built the rest-only group as the world without the candidate cause, with ${solution.listedPeople} listed people on each side and the easing rate identical.`,
    `${solution.contrastReader} reads that group correctly: without it, an improvement after tea cannot be separated from rest, time, or regression.`,
    `${solution.teaReader} treats the tea group\u2019s improvement as proof of tea, which the identical easing rate denies.`,
    `${solution.controlReader} wants the control deleted out of loyalty; the card already did the adult job by keeping it.`
  ];
}

export const unit = 92;

export const cases = [
  {
    template: 'A control as written',
    type: slugify('A control as written'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
