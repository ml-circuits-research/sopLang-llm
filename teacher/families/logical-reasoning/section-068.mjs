/**
 * Section 68 of the logical-reasoning book: regression toward a mean.
 *
 * Every case posts club notes that show one unusually high score on a noisy
 * scoreboard followed by a nearer-to-average score the next week, with no new
 * training listed, and then has three speakers: one credits a tea introduced
 * between the weeks, one says an extreme noisy result is often followed by a
 * quieter one even without a causal hero, and one argues that the tea must be
 * credited because something changed in the number. The case data changes the
 * place, the size of the run, and the three names; the reasoning is fixed: the
 * retreat of an extreme of noise is available on this page, no comparison
 * group is listed, and the tea stays a candidate instead of a crowned cause.
 */

import { slugify } from '../../naming.mjs';

const NOTES_PATTERN =
  /Club notes in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): a listed noisy scoreboard shows ([a-z]+) unusually high score, then a nearer-to-average score the next week, with no new training listed\./;
const TEA_PATTERN =
  /([A-Z][a-z]+) says the new tea between weeks caused the drop toward average\./;
const REGRESSION_PATTERN =
  /([A-Z][a-z]+) says an extreme noisy result is often followed by a quieter one even without a causal hero\./;
const CHANGED_PATTERN =
  /([A-Z][a-z]+) says the tea must be credited because something changed in the number\./;

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
  ten: 10
});

function wordNumber(word, what) {
  const value = NUMBER_WORDS[word];
  if (value === undefined) {
    throw new Error(`the statement spells ${what} as "${word}", which this section does not read`);
  }
  return value;
}

function parse(statement) {
  const notes = NOTES_PATTERN.exec(statement);
  if (notes === null) {
    throw new Error('the statement does not post the club notes with their noisy board and its quieter next week');
  }
  const tea = TEA_PATTERN.exec(statement);
  if (tea === null) {
    throw new Error('the statement does not record the speaker who credits the tea');
  }
  const regression = REGRESSION_PATTERN.exec(statement);
  if (regression === null) {
    throw new Error('the statement does not record the speaker who names the retreat of an extreme');
  }
  const changed = CHANGED_PATTERN.exec(statement);
  if (changed === null) {
    throw new Error('the statement does not record the speaker who reads "something changed" as a cause');
  }
  return {
    place: notes[1],
    extremes: wordNumber(notes[2], 'the number of unusually high scores'),
    quietWeeks: 1,
    teaClaimant: tea[1],
    regressionClaimant: regression[1],
    changedClaimant: changed[1]
  };
}

function solve(slots) {
  if (slots.extremes !== 1) {
    throw new Error('the notes must show exactly one extreme before the quieter week');
  }
  if (slots.quietWeeks !== 1) {
    throw new Error('the quieter score must come one week after the extreme for a plain retreat to be available');
  }
  const speakers = new Set([slots.teaClaimant, slots.regressionClaimant, slots.changedClaimant]);
  if (speakers.size !== 3) {
    throw new Error('the three readings of the notes must come from three different speakers');
  }
  return {
    place: slots.place,
    extremes: slots.extremes,
    quietWeeks: slots.quietWeeks,
    teaClaimant: slots.teaClaimant,
    regressionClaimant: slots.regressionClaimant,
    changedClaimant: slots.changedClaimant,
    verdict: 'not forced'
  };
}

function render(solution) {
  return `No. Regression toward a mean is available when a result was an extreme of a noisy board. The tea may still have done something; this page does not show it.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "No. Regression toward a mean is available when a result was an extreme of a noisy board. The tea may still have done something; this page does not show it.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The notes in ${slots.place} show one unusually high score on a noisy board and then a nearer-to-average score the next week, and an extreme of noise is expected to retreat toward the board's mean.`,
    `${solution.teaClaimant} reads that retreat as the tea's work, but the drop toward average is available without any causal hero.`,
    `${solution.regressionClaimant} names exactly that pattern, and no comparison group is listed to separate the tea from the retreat.`,
    `${solution.changedClaimant} treats "something changed in the number" as proof of a cause; the tea stays a candidate on this page instead of being crowned.`
  ];
}

export const unit = 68;

export const cases = [
  {
    template: 'An extreme result, then a quieter one',
    type: slugify('An extreme result, then a quieter one'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
