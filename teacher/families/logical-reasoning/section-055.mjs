/**
 * Section 55 of the logical-reasoning book: a closed incident note.
 *
 * Every case prints a yard note from a named place whose signs are a gate
 * found open, a listed padlock lying closed beside it, and no listed tool
 * marks, and three speakers: one says “forced entry with tools,” one offers
 * stories that need no marks (a key or an unlocked exit), and one says the
 * most cinematic story wins. The case data changes the place and the three
 * names; the reasoning is fixed: a tool-forced entry would ordinarily leave
 * the marks the note says are absent, so the stories that do not need marks
 * fit the listed signs better.
 */

import { slugify } from '../../naming.mjs';

const STATEMENT_PATTERN =
  /Yard note in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): gate found open at 06:00; listed padlock lying closed beside it; no listed tool marks\. ([A-Z][a-z]+) says “forced entry with tools\.” ([A-Z][a-z]+) says “someone with a key, or an unlocked exit, better fits a closed lock with no tool marks\.” ([A-Z][a-z]+) says the most cinematic story wins\.\s*Question\. Which story fits the listed signs better\?/;

function parse(statement) {
  const matched = STATEMENT_PATTERN.exec(statement);
  if (matched === null) {
    throw new Error('the statement does not record the yard note, the two stories, and the third speaker');
  }
  return {
    place: matched[1],
    forced: matched[2],
    keyStory: matched[3],
    cinematic: matched[4]
  };
}

function solve(slots) {
  const speakers = [slots.forced, slots.keyStory, slots.cinematic];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three speakers must be different people');
  }
  return { place: slots.place, keyStory: slots.keyStory };
}

function render(solution) {
  return `${solution.keyStory}’s family of stories. Tool-forced entry would ordinarily leave marks the note says are absent.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the yard note");',
  'probe(typeof slots.forced === "string" && slots.forced.length > 0, "the case must name the speaker of the forced-entry story");',
  'probe(typeof slots.keyStory === "string" && slots.keyStory.length > 0, "the case must name the speaker of the key story");',
  'probe(typeof slots.cinematic === "string" && slots.cinematic.length > 0, "the case must name the speaker who prefers the cinematic story");',
  'probe(slots.forced !== slots.keyStory && slots.forced !== slots.cinematic && slots.keyStory !== slots.cinematic, "the three speakers must be different people");',
  'return slots.keyStory + "\\u2019s family of stories. Tool-forced entry would ordinarily leave marks the note says are absent.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The note from ${slots.place} lists an open gate, a padlock lying closed beside it, and no tool marks.`,
    `${slots.forced} needs a tool-forced entry, but such an entry would ordinarily leave exactly the marks the note says are absent.`,
    `A key or an unlocked exit needs no marks, so the stories of ${solution.keyStory} fit the listed signs better.`,
    `${slots.cinematic} promotes the most cinematic story, and cinema is not a sign.`
  ];
}

export const unit = 55;

export const cases = [
  {
    template: 'A closed incident note',
    type: slugify('A closed incident note'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
