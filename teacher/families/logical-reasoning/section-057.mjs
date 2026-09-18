/**
 * Section 57 of the logical-reasoning book: one social fact with several stories.
 *
 * Every case reports a sudden queue at a stall, one listed scarcity sign, and
 * three speakers: one reaches for a secret rumour about danger, one points at
 * the printed sign, and one treats the crowd itself as proof of a hidden
 * oracle. The place, the three names, and the pies the sign leaves change with
 * the case; the ranking does not: the listed sign comes first, secret danger is
 * an unlisted extra story, and a crowd shows demand rather than hidden truth.
 */

import { slugify } from '../../naming.mjs';

const QUEUE_PATTERN =
  /^A sudden queue forms at a stall in ([A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)*)\. Listed: a new sign saying “([^”]+)\.” ([A-Z][a-z]+) says people must have heard a secret rumour about danger\. ([A-Z][a-z]+) says the printed scarcity sign is already an adequate ordinary explanation\. ([A-Z][a-z]+) says crowds prove hidden truth\.\n\nQuestion\. What ranks first\?$/;

const SCARCITY_PATTERN = /^last (\d+) pies$/;

function parse(statement) {
  const queue = QUEUE_PATTERN.exec(statement);
  if (queue === null) {
    throw new Error('the statement does not record the queue, the listed sign, and the three stories');
  }
  return {
    place: queue[1],
    sign: queue[2],
    rumourSayer: queue[3],
    signSayer: queue[4],
    crowdSayer: queue[5]
  };
}

function solve(slots) {
  const scarcity = SCARCITY_PATTERN.exec(slots.sign);
  if (scarcity === null) {
    throw new Error(`the listed sign "${slots.sign}" does not state how many pies are left`);
  }
  const pies = Number(scarcity[1]);
  if (!Number.isInteger(pies) || pies <= 0) {
    throw new Error('the listed sign must claim a positive number of pies');
  }
  const speakers = [slots.rumourSayer, slots.signSayer, slots.crowdSayer];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three stories must come from three different people');
  }
  return {
    place: slots.place,
    sign: slots.sign,
    pies,
    rumourSayer: speakers[0],
    signSayer: speakers[1],
    crowdSayer: speakers[2]
  };
}

function render() {
  return 'The listed sign. Secret danger is extra. Crowds show demand or fear of missing pies, not a hidden oracle.';
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the queue");',
  'probe(typeof slots.sign === "string" && slots.sign.length > 0, "the case must quote the listed sign");',
  'const scarcity = /^last (\\d+) pies$/.exec(String(slots.sign));',
  'probe(scarcity !== null, "the listed sign must state how many pies are left");',
  'const pies = Number(scarcity[1]);',
  'probe(Number.isInteger(pies) && pies > 0, "the listed sign must claim a positive number of pies");',
  'const speakers = [slots.rumourSayer, slots.signSayer, slots.crowdSayer];',
  'probe(speakers.every((name) => typeof name === "string" && name.length > 0), "the case must name the person behind each story");',
  'probe(new Set(speakers).size === speakers.length, "the three stories must come from three different people");',
  'return "The listed sign. Secret danger is extra. Crowds show demand or fear of missing pies, not a hidden oracle.";'
].join('\n');

function explain(slots, solution) {
  return [
    `A sudden queue at a stall in ${solution.place} is the surprising fact, and the page lists one engine for it: the new sign reading “${solution.sign}.”`,
    `${solution.rumourSayer} reaches for a secret rumour about danger, which the page never lists, so that story adds a premise instead of ranking one.`,
    `${solution.signSayer} ranks the printed scarcity sign first, because a sign saying the last ${solution.pies} pies are left is an adequate ordinary explanation of the queue.`,
    `${solution.crowdSayer} reads the crowd as proof of a hidden oracle, but a queue shows demand — or only the fear of missing pies.`
  ];
}

export const unit = 57;

export const cases = [
  {
    template: 'A social fact with more than one story',
    type: slugify('A social fact with more than one story'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
