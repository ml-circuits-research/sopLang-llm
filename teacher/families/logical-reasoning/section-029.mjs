/**
 * Section 29 of the logical-reasoning book: a second look.
 *
 * Every case posts a clinic book with two week-long counts taken by two
 * different clerks over different patients, records three speakers, and asks
 * what the second look earned. The case data changes the town, the counts, and
 * the three names; the reasoning is fixed: replication across patients and
 * clerks adds inductive weight, and it still does not buy a universal about
 * every town.
 */

import { slugify } from '../../naming.mjs';

const NOTES_PATTERN =
  /Clinic notes in ([A-Za-z ]+): week one, (\d+) of (\d+) listed patients returned improved after rest\. Week two, a new clerk counts (\d+) of (\d+) different listed patients improved after rest\./;
const SPEAKERS_PATTERN =
  /([A-Z][a-z]+) says two similar counts under two clerks are stronger than one\. ([A-Z][a-z]+) says the second week adds nothing\. ([A-Z][a-z]+) says two weeks prove rest always works in every town\./;

function parse(statement) {
  const notes = NOTES_PATTERN.exec(statement);
  const speakers = SPEAKERS_PATTERN.exec(statement);
  if (notes === null) {
    throw new Error('the statement does not record the two weekly counts');
  }
  if (speakers === null) {
    throw new Error('the statement does not record the three speakers');
  }
  return {
    town: notes[1].trim(),
    firstWeek: Number(notes[2]),
    firstTotal: Number(notes[3]),
    secondWeek: Number(notes[4]),
    secondTotal: Number(notes[5]),
    replicator: speakers[1],
    doubter: speakers[2],
    universalizer: speakers[3]
  };
}

function solve(slots) {
  if (!(slots.firstWeek > 0 && slots.secondWeek > 0)) {
    throw new Error('each week must count at least one improved patient');
  }
  if (slots.firstWeek > slots.firstTotal || slots.secondWeek > slots.secondTotal) {
    throw new Error('an improved count cannot exceed its listed total');
  }
  const firstShare = slots.firstWeek / slots.firstTotal;
  const secondShare = slots.secondWeek / slots.secondTotal;
  if (Math.abs(firstShare - secondShare) > 0.5) {
    throw new Error('the two counts the speakers compare must be similar');
  }
  const speakers = [slots.replicator, slots.doubter, slots.universalizer];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the statement must name three different speakers');
  }
  return {
    town: slots.town,
    firstWeek: slots.firstWeek,
    firstTotal: slots.firstTotal,
    secondWeek: slots.secondWeek,
    secondTotal: slots.secondTotal
  };
}

function render() {
  return 'More inductive weight than a single week. They still do not buy a universal about every town.';
}

const COMPUTE = [
  'const slots = $slots;',
  'return "More inductive weight than a single week. They still do not buy a universal about every town.";'
].join('\n');

function explain(slots, solution) {
  return [
    `Week one reports ${solution.firstWeek} of ${solution.firstTotal} listed patients improved in ${solution.town}, and week two reports ${solution.secondWeek} of ${solution.secondTotal} different patients under a new clerk.`,
    'A pattern that returns across patients and clerks is harder to treat as an accident, so the second look earns more inductive weight than a single week.',
    'Strength is not “always, everywhere”: the two weeks stop at the edge of the clinic book and do not buy a universal about every town.'
  ];
}

export const unit = 29;

export const cases = [
  {
    template: 'A second look',
    type: slugify('A second look'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
