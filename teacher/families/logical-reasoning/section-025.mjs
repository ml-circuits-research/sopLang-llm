/**
 * Section 25 of the logical-reasoning book: trends that may not continue.
 *
 * Every case records harvest notes of one place that report a yield rising for
 * four years, from a listed base to a taller last year, and three speakers: one
 * says the next year must rise, one says the run supports a cautious
 * expectation only with a continuing mechanism the page does not give, and one
 * calls the rises a law of nature. The place, the base, the last year, and the
 * three names vary; the reasoning is fixed, because extrapolation silently adds
 * the premise that whatever lifted the yield continues.
 *
 * The family reads the run (its length, base, last year, and unit), the
 * questioned year, and the three speakers, then renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const RUN_PATTERN =
  /Harvest notes in ([A-Z][A-Za-z]*(?: [A-Z][a-z]+)*): yield rose for ([A-Za-z]+|\d+) years, from a listed base of (\d+) ([a-z]+) to a last year of (\d+)\./;
const MUST_RISE_PATTERN = /([A-Z][a-z]+) says year ([A-Za-z]+|\d+) must rise\./;
const CAUTIOUS_PATTERN =
  /([A-Z][a-z]+) says the run supports a cautious expectation only if a continuing mechanism is given; this page gives the run, not the mechanism\./;
const LAW_PATTERN = /([A-Z][a-z]+) says ([A-Za-z]+|\d+) rises prove a law of nature\./;

const NUMBER_WORDS = Object.freeze({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12
});

function countOf(word, what) {
  const digits = /^\d+$/.test(String(word)) ? Number(word) : NUMBER_WORDS[String(word).toLowerCase()];
  if (digits === undefined || !Number.isInteger(digits) || digits < 1) {
    throw new Error(`the statement spells ${what} as "${word}", which this section does not read`);
  }
  return digits;
}

function find(pattern, statement, what) {
  const match = pattern.exec(statement);
  if (match === null) {
    throw new Error(`the statement does not record ${what}`);
  }
  return match;
}

function parse(statement) {
  const run = find(RUN_PATTERN, statement, 'the harvest run and its numbers');
  const mustRise = find(MUST_RISE_PATTERN, statement, 'the speaker who says the next year must rise');
  const law = find(LAW_PATTERN, statement, 'the speaker who calls the rises a law of nature');
  return {
    place: run[1],
    years: countOf(run[2], 'the length of the run'),
    base: Number(run[3]),
    unit: run[4],
    lastYear: Number(run[5]),
    nextYear: countOf(mustRise[2], 'the questioned year'),
    mustRiseSpeaker: mustRise[1],
    cautiousSpeaker: find(CAUTIOUS_PATTERN, statement, 'the speaker who asks for the mechanism')[1],
    lawSpeaker: law[1],
    rises: countOf(law[2], 'the rises the law speaker counts')
  };
}

function solve(slots) {
  if (slots.lastYear <= slots.base) {
    throw new Error('the notes must report a yield that rose from its base to the last year');
  }
  if (slots.nextYear !== slots.years + 1) {
    throw new Error('the questioned year must come right after the reported run');
  }
  if (slots.rises !== slots.years) {
    throw new Error('the law-of-nature speaker must count the run’s own rises');
  }
  if (new Set([slots.mustRiseSpeaker, slots.cautiousSpeaker, slots.lawSpeaker]).size !== 3) {
    throw new Error('the three speakers must be three different people');
  }
  return { place: slots.place, years: slots.years, base: slots.base, lastYear: slots.lastYear, unit: slots.unit };
}

function render(solution) {
  return `Nothing as a deduction. As induction it is a climb with a hidden premise: that whatever lifted the yield continues. The page did not write that premise.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the harvest notes");',
  'probe(Number.isInteger(slots.years) && slots.years >= 1, "a run needs at least one year of rises");',
  'probe(Number.isInteger(slots.base) && slots.base > 0 && Number.isInteger(slots.lastYear) && slots.lastYear > slots.base, "the notes must report a yield that rose from its base to the last year");',
  'probe(typeof slots.unit === "string" && slots.unit.length > 0, "the case must name the unit of the yield");',
  'probe(slots.nextYear === slots.years + 1, "the questioned year must come right after the reported run");',
  'probe(slots.rises === slots.years, "the law-of-nature speaker must count the run’s own rises");',
  'probe(slots.mustRiseSpeaker !== slots.cautiousSpeaker && slots.cautiousSpeaker !== slots.lawSpeaker && slots.mustRiseSpeaker !== slots.lawSpeaker, "the three speakers must be three different people");',
  'return "Nothing as a deduction. As induction it is a climb with a hidden premise: that whatever lifted the yield continues. The page did not write that premise.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The notes of ${solution.place} report ${solution.years} rises, from a base of ${solution.base} ${solution.unit} to a last year of ${solution.lastYear} ${solution.unit}.`,
    `${slots.mustRiseSpeaker} reads year ${slots.nextYear} as forced, but a chart is not a deduction: extrapolation adds the unwritten premise that the mechanism behind the climb continues.`,
    `${slots.lawSpeaker} turns ${slots.rises} rises into a law of nature, while ${slots.cautiousSpeaker} keeps the expectation cautious until a mechanism is given; four points can be a path or a bump.`
  ];
}

export const unit = 25;

export const cases = [
  {
    template: 'Trends that may not continue',
    type: slugify('Trends that may not continue'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
