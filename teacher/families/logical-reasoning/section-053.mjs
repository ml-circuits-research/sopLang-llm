/**
 * Section 53 of the logical-reasoning book: fewer extra parts.
 *
 * Every case prints a dark lamp in a named place, a short story that blames
 * the bulb, a long story that adds a tapped line and a rare moth, the remark
 * that no extra signs of tapping or moths are listed, and a third speaker who
 * calls the shorter story a preference while both still fit “dark” and says
 * the next act is to swap the bulb. The case data changes the place and the
 * three names; the reasoning is fixed: the bulb-only story is preferred as a
 * start because it adds less unlisted machinery, the ranking is not proof, and
 * the cheap test comes next.
 */

import { slugify } from '../../naming.mjs';

const STATEMENT_PATTERN =
  /A lamp in ([A-Z][a-z]+(?: [A-Z][a-z]+)*) is dark\. ([A-Z][a-z]+) offers: the bulb is dead\. ([A-Z][a-z]+) offers: the bulb is dead AND a neighbour tapped the line AND a rare moth jammed the switch\. No extra signs of tapping or moths are listed\. ([A-Z][a-z]+) says the shorter story is a preference while both still fit “dark,” and the next act is to swap the bulb\.\s*Question\. How should the stories be ranked before the next test\?/;

function parse(statement) {
  const matched = STATEMENT_PATTERN.exec(statement);
  if (matched === null) {
    throw new Error('the statement does not record the dark lamp, the two stories, and the three speakers');
  }
  return {
    place: matched[1],
    shortStory: matched[2],
    longStory: matched[3],
    ranker: matched[4]
  };
}

function solve(slots) {
  const speakers = [slots.shortStory, slots.longStory, slots.ranker];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three speakers must be different people');
  }
  return { place: slots.place, shortStory: slots.shortStory };
}

function render(solution) {
  return 'Prefer the bulb-only story as a start; it adds less unlisted machinery. Ranking is not proof. Then do the cheap test.';
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the dark lamp");',
  'probe(typeof slots.shortStory === "string" && slots.shortStory.length > 0, "the case must name the speaker of the bulb-only story");',
  'probe(typeof slots.longStory === "string" && slots.longStory.length > 0, "the case must name the speaker of the long story");',
  'probe(typeof slots.ranker === "string" && slots.ranker.length > 0, "the case must name the speaker who ranks the shorter story");',
  'probe(slots.shortStory !== slots.longStory && slots.shortStory !== slots.ranker && slots.longStory !== slots.ranker, "the three speakers must be different people");',
  'probe(slots.shortStory !== slots.longStory, "the bulb-only story and the long story come from two speakers");',
  'return "Prefer the bulb-only story as a start; it adds less unlisted machinery. Ranking is not proof. Then do the cheap test.";'
].join('\n');

function explain(slots, solution) {
  return [
    `Both stories in ${slots.place} can cover a dark lamp, so neither is ruled out by the sign alone.`,
    `${slots.longStory} adds a tapped line and a rare moth, two unlisted engines the page does not report.`,
    `The bulb-only story of ${solution.shortStory} is therefore preferred as a start, because it adds less unlisted machinery.`,
    `That ranking is not proof, so the next act is the cheap test: swap the bulb.`
  ];
}

export const unit = 53;

export const cases = [
  {
    template: 'Fewer extra parts',
    type: slugify('Fewer extra parts'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
