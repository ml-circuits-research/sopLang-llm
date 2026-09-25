/**
 * Section 63 of the logical-reasoning book: conditional counts.
 *
 * Every case prints notes from a named place: how often the bus was late on a
 * run of rainy mornings and on a run of dry mornings. Three voices answer —
 * one who reads the rain as a guarantee, one who compares the two counted
 * rates, one who dismisses the counts for being small — and the question asks
 * what the two counts support.
 *
 * The case data changes the place and the three names; the reasoning is fixed.
 * The rainy rate is higher than the dry rate but short of every rainy morning,
 * and the dry rate is not zero, so the notes support a raised rate rather than
 * a guarantee. The module renders the printed verdict from the compared rates.
 */

import { slugify } from '../../naming.mjs';

const NOTES_PATTERN =
  /Notes in (.+?): on (\d+) rainy mornings the bus was late (\d+) times\. On (\d+) dry mornings it was late (\d+) times\./;
const VOICES_PATTERN =
  /([A-Z][a-z]+) says rain guarantees lateness\. ([A-Z][a-z]+) says rain raised the counted late-rate from (\d+) in (\d+) to (\d+) in (\d+), and still left (\d+) rainy on-time mornings\. ([A-Z][a-z]+) says (\d+) and (\d+) are small and so mean nothing at all\./;

function parse(statement) {
  const notes = NOTES_PATTERN.exec(statement);
  const voices = VOICES_PATTERN.exec(statement);
  if (notes === null || voices === null) {
    throw new Error('the statement does not record the two counted mornings and the three voices');
  }
  return {
    place: notes[1],
    rainyMornings: Number(notes[2]),
    rainyLate: Number(notes[3]),
    dryMornings: Number(notes[4]),
    dryLate: Number(notes[5]),
    guarantor: voices[1],
    counter: voices[2],
    quotedDryLate: Number(voices[3]),
    quotedDryMornings: Number(voices[4]),
    quotedRainyLate: Number(voices[5]),
    quotedRainyMornings: Number(voices[6]),
    quotedOnTime: Number(voices[7]),
    dismisser: voices[8],
    dismissedRainyLate: Number(voices[9]),
    dismissedDryLate: Number(voices[10])
  };
}

function solve(slots) {
  if (!Number.isInteger(slots.rainyMornings) || slots.rainyMornings <= 0) {
    throw new Error('the notes must count a positive number of rainy mornings');
  }
  if (!Number.isInteger(slots.dryMornings) || slots.dryMornings <= 0) {
    throw new Error('the notes must count a positive number of dry mornings');
  }
  if (slots.rainyLate < 0 || slots.rainyLate > slots.rainyMornings) {
    throw new Error('the late count on rainy mornings must fit inside the counted mornings');
  }
  if (slots.dryLate < 0 || slots.dryLate > slots.dryMornings) {
    throw new Error('the late count on dry mornings must fit inside the counted mornings');
  }
  if (
    slots.guarantor === slots.counter ||
    slots.counter === slots.dismisser ||
    slots.guarantor === slots.dismisser
  ) {
    throw new Error('the three voices must be different people');
  }
  if (
    slots.quotedDryLate !== slots.dryLate ||
    slots.quotedDryMornings !== slots.dryMornings ||
    slots.quotedRainyLate !== slots.rainyLate ||
    slots.quotedRainyMornings !== slots.rainyMornings
  ) {
    throw new Error('the counting voice must quote the notes’ own rates');
  }
  if (
    slots.dismissedRainyLate !== slots.rainyLate ||
    slots.dismissedDryLate !== slots.dryLate
  ) {
    throw new Error('the dismissing voice must quote the notes’ own counts');
  }
  const onTimeRainy = slots.rainyMornings - slots.rainyLate;
  if (onTimeRainy !== slots.quotedOnTime) {
    throw new Error('the counting voice must state the rainy on-time mornings the notes leave');
  }
  // Rates are compared by cross-multiplication, so the verdict never depends on
  // binary-float division.
  const higherOnRainy = slots.rainyLate * slots.dryMornings > slots.dryLate * slots.rainyMornings;
  const guarantee = slots.rainyLate === slots.rainyMornings;
  if (!higherOnRainy) {
    throw new Error('this section reads notes where rain raised the counted late-rate');
  }
  if (guarantee) {
    throw new Error('a run of late rainy mornings without an on-time one is not the pattern of this section');
  }
  return {
    place: slots.place,
    rainyMornings: slots.rainyMornings,
    rainyLate: slots.rainyLate,
    dryMornings: slots.dryMornings,
    dryLate: slots.dryLate,
    onTimeRainy,
    guarantor: slots.guarantor,
    counter: slots.counter,
    dismisser: slots.dismisser,
    higherOnRainy,
    guarantee
  };
}

function render(solution) {
  return solution.higherOnRainy && !solution.guarantee
    ? 'A higher late-rate on rainy mornings in this notebook, not a guarantee.'
    : 'The two counts do not separate the mornings in this notebook.';
}

const COMPUTE = [
  'const slots = $slots;',
  'const onTimeRainy = slots.rainyMornings - slots.rainyLate;',
  'const higherOnRainy = slots.rainyLate * slots.dryMornings > slots.dryLate * slots.rainyMornings;',
  'const guarantee = slots.rainyLate === slots.rainyMornings;',
  'probe(!guarantee, "the rainy run must leave at least one on-time morning, so the notes do not state a guarantee");',
  'return higherOnRainy && !guarantee ? "A higher late-rate on rainy mornings in this notebook, not a guarantee." : "The two counts do not separate the mornings in this notebook.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The notes from ${solution.place} count ${solution.rainyLate} late mornings out of ${solution.rainyMornings} rainy ones and ${solution.dryLate} out of ${solution.dryMornings} dry ones.`,
    `The rainy rate is higher, which is what ${solution.counter} reports, but ${solution.onTimeRainy} rainy mornings were still on time, so rain is not a guarantee.`,
    `${solution.guarantor} overreads the raised rate and ${solution.dismisser} throws the counts away for being small.`,
    `Small notes are noisy, yet they are not blank: the counts support a raised rate and nothing stronger.`
  ];
}

export const unit = 63;

export const cases = [
  {
    template: 'Conditional counts',
    type: slugify('Conditional counts'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
