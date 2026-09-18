/**
 * Section 94 of the logical-reasoning book: counterfactuals with a held-fixed
 * list.
 *
 * Every case posts notes in a named place: a listed bus that left on its
 * printed minute, a traveller who arrived four minutes later, and a timetable
 * that keeps buses leaving on that minute. Two people then offer a
 * counterfactual. The case data changes the place, the clock times, the
 * traveller, and the two names; the reasoning is fixed: the licensed
 * counterfactual moves the traveller\u2019s arrival and holds the printed leaving
 * rule, while the other changes the bus\u2019s rule without a licence. The family
 * reads the notes and renders the printed verdict with the two names.
 */

import { slugify } from '../../naming.mjs';

const NOTES_PATTERN =
  /^Notes in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): the listed bus left at (\d{2}:\d{2}); ([A-Z][a-z]+) arrived at (\d{2}:\d{2})\. Timetable: buses here leave on the printed minute\. ([A-Z][a-z]+) says \u201chad \3 arrived at (\d{2}:\d{2}), \3 would have caught it\u201d \u2014 holding the timetable fixed\. ([A-Z][a-z]+) says \u201chad \3 been braver the bus would have waited,\u201d which the page never grants\./;

function minutesOf(hhmm) {
  const [hours, minutes] = hhmm.split(':').map(Number);
  return hours * 60 + minutes;
}

function parse(statement) {
  const notes = NOTES_PATTERN.exec(statement);
  if (notes === null) {
    throw new Error('the statement does not record the bus notes and the two counterfactuals');
  }
  return {
    place: notes[1],
    busLeaves: notes[2],
    traveller: notes[3],
    actualArrival: notes[4],
    licensedSpeaker: notes[5],
    counterfactualArrival: notes[6],
    unlicensedSpeaker: notes[7]
  };
}

function solve(slots) {
  const departure = minutesOf(slots.busLeaves);
  const actual = minutesOf(slots.actualArrival);
  const licensed = minutesOf(slots.counterfactualArrival);
  if (!(actual > departure)) {
    throw new Error('the recorded arrival must be after the printed leaving minute, so the traveller missed the bus');
  }
  if (!(licensed <= departure)) {
    throw new Error('the licensed counterfactual must arrive by the printed leaving minute to catch the bus');
  }
  if (!(licensed < actual)) {
    throw new Error('the licensed counterfactual must move the arrival earlier');
  }
  if (slots.licensedSpeaker === slots.unlicensedSpeaker) {
    throw new Error('the two counterfactuals must come from two different people');
  }
  return {
    place: slots.place,
    traveller: slots.traveller,
    licensedSpeaker: slots.licensedSpeaker,
    unlicensedSpeaker: slots.unlicensedSpeaker
  };
}

function render(solution) {
  return `${solution.licensedSpeaker}\u2019s. It changes arrival time and holds the printed leaving rule. ${solution.unlicensedSpeaker} changes the bus\u2019s rule without a licence.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const minutesOf = (hhmm) => { const parts = String(hhmm).split(":"); return Number(parts[0]) * 60 + Number(parts[1]); };',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the notes must name the place of the bus");',
  'probe(typeof slots.traveller === "string" && slots.traveller.length > 0, "the notes must name the traveller");',
  'const departure = minutesOf(slots.busLeaves);',
  'const actual = minutesOf(slots.actualArrival);',
  'const licensed = minutesOf(slots.counterfactualArrival);',
  'probe(actual > departure, "the recorded arrival must be after the printed leaving minute");',
  'probe(licensed <= departure, "the licensed counterfactual must arrive by the printed leaving minute");',
  'probe(licensed < actual, "the licensed counterfactual must move the arrival earlier");',
  'probe(slots.licensedSpeaker !== slots.unlicensedSpeaker, "the two counterfactuals must come from two different people");',
  'return slots.licensedSpeaker + "\\u2019s. It changes arrival time and holds the printed leaving rule. " + slots.unlicensedSpeaker + " changes the bus\\u2019s rule without a licence.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The notes from ${solution.place} record a bus that left on its printed minute and ${solution.traveller} arriving after it, so the traveller missed it.`,
    `${solution.licensedSpeaker}\u2019s counterfactual changes only the traveller\u2019s clock and holds the printed leaving rule fixed, so it is licensed by the page.`,
    `${solution.unlicensedSpeaker}\u2019s counterfactual has the bus waiting out of sentiment, which rewrites the bus\u2019s rule and finds no grant anywhere in the notes.`
  ];
}

export const unit = 94;

export const cases = [
  {
    template: 'Counterfactuals with a held-fixed list',
    type: slugify('Counterfactuals with a held-fixed list'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
