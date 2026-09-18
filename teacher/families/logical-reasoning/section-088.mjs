/**
 * Section 88 of the logical-reasoning book: the visible queue.
 *
 * Every case posts two stalls in a named place selling the same listed pie,
 * one with a long queue and one with none, and records that nothing has been
 * tasted. One person joins the long queue because “everyone is there”, one
 * voice says the queue is social proof that may be rain-shelter or habit, and
 * one voice says a queue is a tasting panel. The case data changes the place
 * and the three names; the reasoning is fixed: the queue proves only that
 * people are standing there, so the module renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const QUEUE_PATTERN =
  /Two stalls in (.+?) sell the same listed pie\. Stall A has a long queue\. Stall B has none\. (No tasting yet|A tasting has happened)\./;

const VOICES_PATTERN =
  /([A-Z][a-z]+) joins A because “everyone is there\.” ([A-Z][a-z]+) says the queue is social proof and may be rain-shelter or habit, not yet flavour\. ([A-Z][a-z]+) says a queue is a tasting panel\./;

function parse(statement) {
  const queue = QUEUE_PATTERN.exec(statement);
  if (queue === null) {
    throw new Error('the statement does not record the two stalls and the tasting state');
  }
  const voices = VOICES_PATTERN.exec(statement);
  if (voices === null) {
    throw new Error('the statement does not record the joiner and the two voices');
  }
  return {
    place: queue[1],
    tasted: queue[2] === 'A tasting has happened',
    joiner: voices[1],
    challenger: voices[2],
    naive: voices[3]
  };
}

function solve(slots) {
  if (slots.tasted) {
    throw new Error('a case that has already tasted the pie is not the pattern of this section');
  }
  return {
    place: slots.place,
    joiner: slots.joiner,
    challenger: slots.challenger,
    naive: slots.naive,
    proved: 'people are standing there',
    flavour: 'untested'
  };
}

function render(solution) {
  return `That ${solution.proved}. Flavour is ${solution.flavour} on this page.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place with the two stalls");',
  'probe(typeof slots.joiner === "string" && slots.joiner.length > 0, "the case must name the person who joins the queue");',
  'probe(typeof slots.challenger === "string" && slots.challenger.length > 0, "the case must name the voice that reads the queue as social proof");',
  'probe(typeof slots.naive === "string" && slots.naive.length > 0, "the case must name the voice that reads the queue as a tasting panel");',
  'probe(slots.challenger !== slots.naive, "the two voices must be different people");',
  'probe(slots.tasted === false, "the section only covers a queue where nothing has been tasted");',
  'return "That people are standing there. Flavour is untested on this page.";'
].join('\n');

function explain(slots, solution) {
  return [
    `Two stalls in ${solution.place} sell the same listed pie and only one has a queue, and nothing has been tasted yet.`,
    `${solution.joiner} joins the long queue on the strength of “everyone is there”, which is social proof and not evidence about flavour.`,
    `${solution.challenger} keeps rain-shelter and habit as live rivals, while ${solution.naive} treats the queue as a tasting panel.`,
    `The queue proves that people are standing there; flavour is untested on this page.`
  ];
}

export const unit = 88;

export const cases = [
  {
    template: 'The visible queue',
    type: slugify('The visible queue'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
