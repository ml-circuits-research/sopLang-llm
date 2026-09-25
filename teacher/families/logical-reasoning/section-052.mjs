/**
 * Section 52 of the logical-reasoning book: do not invent the missing fact.
 *
 * Every case prints a late bus in a named place, a page that lists only a
 * queue and a dry road, and three speakers: one invents a secret crash around
 * the corner because it would explain the lateness neatly, one stays with what
 * the page lists and says the cause is not yet shown, and one prefers the neat
 * invention to silence. The case data changes the place and the three names;
 * the reasoning is fixed: an explanation may use the listed facts, a secret
 * crash is a new premise rather than a listed fact, and neatness does not mint
 * facts, so the printed verdict stops with the person who stayed with the
 * text.
 */

import { slugify } from '../../naming.mjs';

const STATEMENT_PATTERN =
  /A bus in ([A-Z][a-z]+(?: [A-Z][a-z]+)*) is late\. The page lists a queue and a dry road\. ([A-Z][a-z]+) invents a secret crash around the corner because that would explain lateness neatly\. ([A-Z][a-z]+) stays with what is listed and says the cause is not yet shown\. ([A-Z][a-z]+) says a neat invented crash is better science than silence\.\s*Question\. What may an explanation use\?/;

function parse(statement) {
  const matched = STATEMENT_PATTERN.exec(statement);
  if (matched === null) {
    throw new Error('the statement does not record the late bus, the listed page, and the three speakers');
  }
  return {
    place: matched[1],
    inventor: matched[2],
    sticker: matched[3],
    booster: matched[4]
  };
}

function solve(slots) {
  const speakers = [slots.inventor, slots.sticker, slots.booster];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three speakers must be different people');
  }
  return { place: slots.place, sticker: slots.sticker };
}

function render(solution) {
  return `Listed facts. A secret crash is a new premise. Neatness does not mint facts. ${solution.sticker} stops where the text stops.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "Listed facts. A secret crash is a new premise. Neatness does not mint facts. " + slots.sticker + " stops where the text stops.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The page for the bus in ${slots.place} lists only a queue and a dry road, so those listed facts are what an explanation may use.`,
    `${slots.inventor} adds a secret crash around the corner, which is a new premise rather than something the page lists.`,
    `${slots.booster} prefers the neat invention, but neatness does not mint facts.`,
    `${slots.sticker} stays with what is listed and stops where the text stops, so the verdict is ${solution.sticker}’s.`
  ];
}

export const unit = 52;

export const cases = [
  {
    template: 'Do not invent the missing fact',
    type: slugify('Do not invent the missing fact'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
