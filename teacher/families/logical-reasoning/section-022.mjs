/**
 * Section 22 of the logical-reasoning book: small samples and noise.
 *
 * Every case reports the bus mornings of one place — one late and one on time —
 * and three speakers: one hardens the pair into a bus type, one calls the pair
 * too few to harden a type, and one treats the single miss as proof of a
 * useless service. The place and the three names vary; the reasoning is fixed,
 * because the sample size is part of inductive strength and n = 2 is almost all
 * noise.
 *
 * The family reads the place, the sample size, its late and on-time split, and
 * the three speakers, then renders the printed verdict with the parsed sample
 * size.
 */

import { slugify } from '../../naming.mjs';

const MORNINGS_PATTERN =
  /([A-Za-z]+|\d+) mornings in ([^:]+): a bus is late ([A-Za-z]+|\d+) and on time ([A-Za-z]+|\d+)\. ([A-Z][a-z]+) says the bus is a late bus as a type\. ([A-Z][a-z]+) says ([a-z]+|\d+) mornings are too few to harden a type\. ([A-Z][a-z]+) says any miss already proves a useless service\./;

const NUMBER_WORDS = Object.freeze({
  once: 1,
  one: 1,
  two: 2,
  twice: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10
});

function countOf(word, what) {
  const value = NUMBER_WORDS[String(word).toLowerCase()];
  if (value === undefined) {
    throw new Error(`the statement spells ${what} as "${word}", which this section does not read`);
  }
  return value;
}

function parse(statement) {
  const mornings = MORNINGS_PATTERN.exec(statement);
  if (mornings === null) {
    throw new Error('the statement does not record the two mornings and the three speakers');
  }
  const sample = countOf(mornings[1], 'the sample size');
  if (countOf(mornings[7], 'the sample size again') !== sample) {
    throw new Error('the two occurrences of the sample size must agree');
  }
  return {
    place: mornings[2].trim(),
    sample,
    late: countOf(mornings[3], 'the late mornings'),
    onTime: countOf(mornings[4], 'the on-time mornings'),
    typeHastener: mornings[5],
    sampleSceptic: mornings[6],
    alarmist: mornings[8]
  };
}

function solve(slots) {
  if (slots.sample < 2 || slots.sample > 4) {
    throw new Error('the section is about a sample of a few mornings, not a long record');
  }
  if (slots.sample !== slots.late + slots.onTime) {
    throw new Error('every listed morning must be late or on time');
  }
  if (slots.late !== 1) {
    throw new Error('the printed verdict names a single miss, so the case must report exactly one late morning');
  }
  if (slots.onTime < 1) {
    throw new Error('the sample must also list a morning that was on time');
  }
  if (new Set([slots.typeHastener, slots.sampleSceptic, slots.alarmist]).size !== 3) {
    throw new Error('the three speakers must be three different people');
  }
  return { sample: slots.sample, late: slots.late, onTime: slots.onTime };
}

function render(solution) {
  return `Almost nothing as a type. n = ${solution.sample} is almost all noise. A single miss is not a destiny.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the two mornings");',
  'probe(Number.isInteger(slots.sample) && slots.sample >= 2 && slots.sample <= 4, "the section is about a sample of a few mornings, not a long record");',
  'probe(slots.late === 1, "the printed verdict names a single miss, so the case must report exactly one late morning");',
  'probe(Number.isInteger(slots.onTime) && slots.onTime >= 1, "the sample must also list a morning that was on time");',
  'probe(slots.sample === slots.late + slots.onTime, "every listed morning must be late or on time");',
  'probe(slots.typeHastener !== slots.sampleSceptic && slots.sampleSceptic !== slots.alarmist && slots.typeHastener !== slots.alarmist, "the three speakers must be three different people");',
  'return "Almost nothing as a type. n = " + slots.sample + " is almost all noise. A single miss is not a destiny.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.place} lists ${solution.sample} mornings, ${solution.late} late and ${solution.onTime} on time, so the record is almost all noise at n = ${solution.sample}.`,
    `${slots.typeHastener} hardens those mornings into a bus type, and ${slots.alarmist} reads the one miss as proof of a useless service; both claims outrun the list.`,
    `${slots.sampleSceptic} is right that a type needs more cases or a mechanism, and one miss only refutes “never late,” a sentence nobody was owed.`
  ];
}

export const unit = 22;

export const cases = [
  {
    template: 'Small samples and noise',
    type: slugify('Small samples and noise'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
