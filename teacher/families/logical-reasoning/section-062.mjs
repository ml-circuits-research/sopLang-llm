/**
 * Section 62 of the logical-reasoning book: base rates and rare events.
 *
 * Every case prints a teaching card from a named clinic: a crowd, a rare
 * condition, and a flag test with a stated sensitivity and a stated
 * false-alarm rate. Three voices answer the card — one who trusts the flag,
 * one who counts the flags, one who trusts the sensitivity alone — and the
 * question asks whether most flagged people actually have the condition.
 *
 * The case data changes the place and the three names; the reasoning is fixed.
 * True flags are the rare cases the test catches, false flags are the alarms
 * raised on the healthy remainder, and because the base rate is tiny the
 * second count outruns the first, so the printed verdict reports the two
 * counted flags and the condition letter the card names.
 */

import { slugify } from '../../naming.mjs';

const COUNT_WORDS = new Map([
  ['zero', 0],
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
  ['ten', 10],
  ['eleven', 11],
  ['twelve', 12]
]);

const NUMBER_WORDS = Object.freeze([
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty'
]);

function countOf(token) {
  const value = COUNT_WORDS.get(String(token).toLowerCase());
  if (value === undefined) {
    throw new Error(`the card counts the flags with the unrecognised word "${token}"`);
  }
  return value;
}

function numberWord(value) {
  return NUMBER_WORDS[value] ?? String(value);
}

const CARD_PATTERN =
  /Teaching card in (.+?): in a crowd of (\d+), about (\d+) person has condition ([A-Z])\./;
const TEST_PATTERN =
  /A flag test catches (\d+) of (\d+) real ([A-Z]) and also flags (\d+) of (\d+) people without ([A-Z])\./;
const VOICES_PATTERN =
  /([A-Z][a-z]+) says a flagged person almost surely has ([A-Z])\. ([A-Z][a-z]+) counts about ([a-z]+) true flag and about (\d+) false flags, so most flags are false\. ([A-Z][a-z]+) says a test that catches (\d+) of (\d+) cannot mostly be wrong when it rings\./;

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  const test = TEST_PATTERN.exec(statement);
  const voices = VOICES_PATTERN.exec(statement);
  if (card === null || test === null || voices === null) {
    throw new Error('the statement does not record the clinic card, the flag test, and the three voices');
  }
  return {
    place: card[1],
    population: Number(card[2]),
    prevalence: Number(card[3]),
    condition: card[4],
    sensitivityNumerator: Number(test[1]),
    sensitivityDenominator: Number(test[2]),
    sensitivityCondition: test[3],
    falseAlarmNumerator: Number(test[4]),
    falseAlarmDenominator: Number(test[5]),
    healthyCondition: test[6],
    doubter: voices[1],
    voicedCondition: voices[2],
    counter: voices[3],
    claimedTrueFlags: countOf(voices[4]),
    claimedFalseFlags: Number(voices[5]),
    sensitivityVoice: voices[6],
    voicedSensitivityNumerator: Number(voices[7]),
    voicedSensitivityDenominator: Number(voices[8])
  };
}

function solve(slots) {
  if (
    slots.condition !== slots.sensitivityCondition ||
    slots.condition !== slots.healthyCondition ||
    slots.condition !== slots.voicedCondition
  ) {
    throw new Error('every mention of the condition must name the same letter');
  }
  if (!Number.isInteger(slots.population) || slots.population <= 0) {
    throw new Error('the crowd must be a positive whole number');
  }
  if (!Number.isInteger(slots.prevalence) || slots.prevalence <= 0 || slots.prevalence >= slots.population) {
    throw new Error('the condition must be rare yet present in the crowd');
  }
  if (
    !Number.isInteger(slots.sensitivityDenominator) ||
    slots.sensitivityDenominator <= 0 ||
    slots.sensitivityNumerator > slots.sensitivityDenominator
  ) {
    throw new Error('the sensitivity must be a fraction no greater than one');
  }
  if (
    !Number.isInteger(slots.falseAlarmDenominator) ||
    slots.falseAlarmDenominator <= 0 ||
    slots.falseAlarmNumerator > slots.falseAlarmDenominator
  ) {
    throw new Error('the false-alarm rate must be a fraction no greater than one');
  }
  if (
    slots.doubter === slots.counter ||
    slots.counter === slots.sensitivityVoice ||
    slots.doubter === slots.sensitivityVoice
  ) {
    throw new Error('the three voices must be different people');
  }
  if (
    slots.voicedSensitivityNumerator !== slots.sensitivityNumerator ||
    slots.voicedSensitivityDenominator !== slots.sensitivityDenominator
  ) {
    throw new Error('the last voice must quote the card’s own sensitivity');
  }
  const trueFlags = Math.round(
    (slots.prevalence * slots.sensitivityNumerator) / slots.sensitivityDenominator
  );
  const falseFlags = Math.round(
    ((slots.population - slots.prevalence) * slots.falseAlarmNumerator) / slots.falseAlarmDenominator
  );
  if (trueFlags < 1) {
    throw new Error('the test must catch at least one real case');
  }
  if (falseFlags <= trueFlags) {
    throw new Error('this section reads a base rate that keeps most flags false');
  }
  if (slots.claimedTrueFlags !== trueFlags || slots.claimedFalseFlags !== falseFlags) {
    throw new Error('the counting voice must count the flags this arithmetic produces');
  }
  return {
    place: slots.place,
    condition: slots.condition,
    population: slots.population,
    prevalence: slots.prevalence,
    sensitivityNumerator: slots.sensitivityNumerator,
    sensitivityDenominator: slots.sensitivityDenominator,
    falseAlarmNumerator: slots.falseAlarmNumerator,
    falseAlarmDenominator: slots.falseAlarmDenominator,
    doubter: slots.doubter,
    counter: slots.counter,
    sensitivityVoice: slots.sensitivityVoice,
    trueFlags,
    falseFlags,
    totalFlags: trueFlags + falseFlags,
    mostFlagsFalse: true
  };
}

function render(solution) {
  return `No. About ${numberWord(solution.trueFlags)} true flag beside about ${numberWord(solution.falseFlags)} false flags. Catching almost all real ${solution.condition} does not make a flag trustworthy when ${solution.condition} is rare.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const NUMBER_WORDS = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"];',
  'const word = (value) => NUMBER_WORDS[value] ?? String(value);',
  'const trueFlags = Math.round((slots.prevalence * slots.sensitivityNumerator) / slots.sensitivityDenominator);',
  'const falseFlags = Math.round(((slots.population - slots.prevalence) * slots.falseAlarmNumerator) / slots.falseAlarmDenominator);',
  'probe(trueFlags >= 1, "the test must catch at least one real case");',
  'const mostFlagsFalse = falseFlags > trueFlags;',
  'return mostFlagsFalse ? "No. About " + word(trueFlags) + " true flag beside about " + word(falseFlags) + " false flags. Catching almost all real " + slots.condition + " does not make a flag trustworthy when " + slots.condition + " is rare." : "Yes. Most flags would be true in this arithmetic.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card from ${solution.place} puts about ${solution.prevalence} case of condition ${solution.condition} in a crowd of ${solution.population}, and the test catches ${solution.sensitivityNumerator} of ${solution.sensitivityDenominator} real cases.`,
    `That yields about ${solution.trueFlags} true flag, while the ${solution.population - solution.prevalence} healthy people contribute about ${solution.falseFlags} false flags at a rate of ${solution.falseAlarmNumerator} in ${solution.falseAlarmDenominator}.`,
    `${solution.counter} counts both numbers, whereas ${solution.doubter} and ${solution.sensitivityVoice} read the flag or the sensitivity as if the base rate did not matter.`,
    `With a rare condition the healthy crowd dominates the flags, so most flagged people are not ${solution.condition} cases.`
  ];
}

export const unit = 62;

export const cases = [
  {
    template: 'Base rates and rare events',
    type: slugify('Base rates and rare events'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
