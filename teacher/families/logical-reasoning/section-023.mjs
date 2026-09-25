/**
 * Section 23 of the logical-reasoning book: who got counted.
 *
 * Every case has one café leave a review book on the counter, twenty glowing
 * notes appear in it, and the owner conclude that everyone loves the café.
 * Three speakers follow: one asks who bothers to write in a counter book, one
 * treats the notes as a town census, and one says unhappy guests are just as
 * likely to write a novel on the way out. The place, the names, and the note
 * count vary; the reasoning is fixed, because the counter book selects the
 * people who liked the café or were polite enough to write.
 *
 * The family reads the place, the note count, and the three speakers, then
 * renders the printed verdict with the speaker who named the filter and the
 * speaker who invented the opposite one.
 */

import { slugify } from '../../naming.mjs';

const BOOK_PATTERN =
  /A café in ([A-Z][A-Za-z]*(?: [A-Z][a-z]+)*) leaves a review book on the counter\. ([A-Za-z]+|\d+) glowing notes are written\./;
const OWNER_PATTERN = /The owner says [“"]everyone loves us[.”"]/;
const NAMER_PATTERN = /([A-Z][a-z]+) asks who bothers to write in a counter book\./;
const CENSUS_PATTERN = /([A-Z][a-z]+) treats ([A-Za-z]+|\d+) notes as a town census\./;
const INVENTOR_PATTERN = /([A-Z][a-z]+) says unhappy guests are just as likely to write a novel on the way out\./;

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
  twelve: 12,
  fifteen: 15,
  twenty: 20
});

function countOf(word, what) {
  const value = NUMBER_WORDS[String(word).toLowerCase()];
  if (value === undefined) {
    throw new Error(`the statement spells ${what} as "${word}", which this section does not read`);
  }
  return value;
}

function find(pattern, statement, what) {
  const match = pattern.exec(statement);
  if (match === null) {
    throw new Error(`the statement does not record ${what}`);
  }
  return match;
}

function parse(statement) {
  const book = find(BOOK_PATTERN, statement, 'the review book and its glowing notes');
  if (!OWNER_PATTERN.test(statement)) {
    throw new Error('the statement does not record the owner’s “everyone” claim');
  }
  const census = find(CENSUS_PATTERN, statement, 'the speaker who treats the notes as a census');
  const notes = countOf(book[2], 'the glowing notes');
  if (countOf(census[2], 'the notes of the census reading') !== notes) {
    throw new Error('the census reading must count the same notes the book holds');
  }
  return {
    place: book[1],
    notes,
    namer: find(NAMER_PATTERN, statement, 'the speaker who asks who bothers to write')[1],
    census: census[1],
    inventor: find(INVENTOR_PATTERN, statement, 'the speaker who invents the angry novel')[1]
  };
}

function solve(slots) {
  if (slots.notes < 2) {
    throw new Error('a review book of one glowing note is not a sample of anything');
  }
  if (new Set([slots.namer, slots.census, slots.inventor]).size !== 3) {
    throw new Error('the three speakers must be three different people');
  }
  return { namer: slots.namer, inventor: slots.inventor, notes: slots.notes, place: slots.place };
}

function render(solution) {
  return `People who liked the café enough, or were polite enough, to write. That is not “everyone.” ${solution.namer} named the filter. ${solution.inventor} invented an equal opposite filter the page did not show.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "People who liked the café enough, or were polite enough, to write. That is not “everyone.” " + slots.namer + " named the filter. " + slots.inventor + " invented an equal opposite filter the page did not show.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The counter book in ${solution.place} holds ${solution.notes} glowing notes, but a case reaches that page only if a guest liked the café enough, or was polite enough, to write in it.`,
    `${solution.namer} names that filter, so the sample is not “everyone,” and selection can bake the conclusion into the evidence the owner then reads.`,
    `${slots.census} treats the notes as a town census, and ${solution.inventor} invents an equal opposite filter the page never showed; neither move is on the page, so the climb stops at the filter.`
  ];
}

export const unit = 23;

export const cases = [
  {
    template: 'Who got counted',
    type: slugify('Who got counted'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
