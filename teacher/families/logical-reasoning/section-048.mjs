/**
 * Section 48 of the logical-reasoning book: several contributors.
 *
 * Every case records an evening in which the hall opened late with several
 * factors listed together, then has one person pick a single favourite, one
 * point out that the page lists contributors without ranking them, and one
 * conclude that nothing caused the lateness. The case data changes the place,
 * the three names, and the listed factors; the verdict is fixed by the
 * template and names no case data: the several listed factors are candidate
 * contributors together, a single-winner story is not forced, and "several"
 * does not mean "none".
 */

import { slugify } from '../../naming.mjs';

const NOTES_PATTERN = /Evening notes in (.+?): the hall opened late\./;
const LISTED_PATTERN =
  /Listed that night: (.+?)\. ([A-Z][a-z]+) picks the ([a-z][a-z -]*) as “the cause\.”/;
const PLURAL_PATTERN = /([A-Z][a-z]+) says the page lists several contributors and does not rank them\./;
const ABSENCE_PATTERN = /([A-Z][a-z]+) says if several things happened, nothing caused the lateness\./;

function parse(statement) {
  const notes = NOTES_PATTERN.exec(statement);
  const listed = LISTED_PATTERN.exec(statement);
  const plural = PLURAL_PATTERN.exec(statement);
  const absence = ABSENCE_PATTERN.exec(statement);
  if (notes === null || listed === null || plural === null || absence === null) {
    throw new Error('the statement does not record the evening notes, the listed factors, and the three verdicts');
  }
  return {
    place: notes[1],
    factors: listed[1].split(/, and |, /),
    picker: listed[2],
    chosenFactor: listed[3],
    plural: plural[1],
    absence: absence[1]
  };
}

function solve(slots) {
  if (slots.factors.length < 2) {
    throw new Error('this template needs several factors listed for the late opening');
  }
  if (!slots.factors.some((factor) => factor.includes(slots.chosenFactor))) {
    throw new Error(`the picked factor "${slots.chosenFactor}" is not among the listed factors`);
  }
  if (slots.picker === slots.plural || slots.picker === slots.absence || slots.plural === slots.absence) {
    throw new Error('the three verdicts must be attributed to three different people');
  }
  return {
    place: slots.place,
    contributors: slots.factors,
    picker: slots.picker,
    chosenFactor: slots.chosenFactor,
    plural: slots.plural,
    absence: slots.absence
  };
}

function render(solution) {
  return 'That several listed factors were present and each is a candidate contributor. A single-winner story is not forced. “Several” does not mean “none.”';
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the evening notes must name their place");',
  'probe(Array.isArray(slots.factors) && slots.factors.length >= 2, "the page must list several factors for the late opening");',
  'probe(slots.factors.every((factor) => typeof factor === "string" && factor.length > 0), "every listed factor must be stated");',
  'probe(slots.factors.some((factor) => factor.includes(slots.chosenFactor)), "the picked favourite must be one of the listed factors");',
  'probe(slots.picker !== slots.plural && slots.picker !== slots.absence && slots.plural !== slots.absence, "the three verdicts must be attributed to three different people");',
  'return "That several listed factors were present and each is a candidate contributor. A single-winner story is not forced. \\u201cSeveral\\u201d does not mean \\u201cnone.\\u201d";'
].join('\n');

function explain(slots, solution) {
  const listed = solution.contributors.join(', ');
  return [
    `The page in ${slots.place} lists ${solution.contributors.length} factors together — ${listed} — so more than one candidate could have a hand in the late opening.`,
    `${solution.picker} picks the ${solution.chosenFactor} as “the cause”, but a favourite is an appetite for one story, not a ranking the page printed.`,
    `${solution.plural} states what the page actually earns: several listed contributors, none of them ranked above the others.`,
    `${solution.absence} concludes that nothing caused the lateness, which does not follow: the absence of a unique winner is not the absence of a cause.`
  ];
}

export const unit = 48;

export const cases = [
  {
    template: 'Several contributors',
    type: slugify('Several contributors'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
