/**
 * Section 78 of the logical-reasoning book: a leap from few to all.
 *
 * Every case has one person meet a small number of dry pies and announce a
 * rule for every boxed pie in the county; a second person calls that a leap
 * from few to all and a third defends the count as already a law. The case
 * data changes the two names, the place, and the count word; the reasoning is
 * fixed, so the printed verdict names the family (induction hardened into a
 * universal) and restates the count as cases against the county-wide claim.
 *
 * The family reads the count, the sampled noun, and the region of the
 * universal, then renders the printed verdict with the count in words.
 */

import { slugify } from '../../naming.mjs';

const LEAP_PATTERN =
  /([A-Za-z]+) in ([A-Za-z ]+) meets ([a-z]+) dry ([a-z]+) and says all ([a-z ]+) in the ([a-z]+) are dry\. ([A-Za-z]+) calls that a leap from few to all\. ([A-Za-z]+) says ([a-z]+) is already a law if the ([a-z]+) were sincere ([a-z]+)\./;

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
  'twelve'
]);

function countOf(word) {
  const value = NUMBER_WORDS.indexOf(String(word).toLowerCase());
  if (value < 2) {
    throw new Error(`the case states the count as "${word}", which is not a plurality of small cases`);
  }
  return { value, word: NUMBER_WORDS[value] };
}

function parse(statement) {
  const leap = LEAP_PATTERN.exec(statement);
  if (leap === null) {
    throw new Error('the statement does not record the sampled pies and the county-wide claim');
  }
  const count = countOf(leap[3]);
  if (count.word !== String(leap[9]).toLowerCase()) {
    throw new Error('the two occurrences of the count must agree');
  }
  const sample = leap[4];
  if (sample !== leap[10] || sample !== leap[11]) {
    throw new Error('the case must sample one noun throughout');
  }
  if (!leap[5].endsWith(` ${sample}`)) {
    throw new Error('the county-wide claim must be about the sampled noun');
  }
  return {
    observer: leap[1],
    place: leap[2].trim(),
    count: count.value,
    countWord: count.word,
    sample,
    universal: leap[5],
    region: leap[6],
    caller: leap[7],
    sceptic: leap[8]
  };
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function solve(slots) {
  if (slots.count < 2) {
    throw new Error('a leap from few to all needs at least two cases');
  }
  return {
    count: slots.count,
    countWord: slots.countWord,
    region: slots.region,
    sample: slots.sample
  };
}

function render(solution) {
  return `Induction, hardened into a universal without the right to that climb. ${capitalize(solution.countWord)} cases do not buy “all in the ${solution.region}.”`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const numberOf = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };',
  'const capitalized = slots.countWord.charAt(0).toUpperCase() + slots.countWord.slice(1);',
  'return "Induction, hardened into a universal without the right to that climb. " + capitalized + " cases do not buy “all in the " + slots.region + ".”";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.observer} in ${slots.place} met ${solution.countWord} dry ${solution.sample} and announced a rule about every boxed ${solution.sample} in the ${solution.region}.`,
    `${slots.caller} names that move correctly: few to all is induction hardened into a universal without the right to that climb.`,
    `${slots.sceptic} treats the count itself as a law, but the quality of a case is not the quantity of cases, and the county-wide claim is a new object.`
  ];
}

export const unit = 78;

export const cases = [
  {
    template: 'A leap from few to all',
    type: slugify('A leap from few to all'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
