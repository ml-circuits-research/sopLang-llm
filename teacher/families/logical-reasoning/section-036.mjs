/**
 * Section 36 of the logical-reasoning book: institutional analogy.
 *
 * Every case quotes a letter that likens an institution to a business with
 * shared fixtures, posts the institution's own infection card beside it, and
 * records three reactions: one follows the likeness, one names the relevant
 * work the institution includes, and one says that every building with the
 * shared fixtures is the same. The case data changes the place, the two
 * institutions, the shared fixture, the visitor cap, and the three names; the
 * verdict is fixed: the likeness does not carry the visitor rule, because the
 * shared fixture is decorative and the infection card names the constraints
 * that decide the rule.
 */

import { slugify } from '../../naming.mjs';

const LETTER_PATTERN =
  /^A letter in ([A-Z][A-Za-z ]*) says “the (\w+) is a (\w+) with (\w+), so visitors may come as they would to a guest house\.”/;
const CARD_PATTERN = /Infection card on the same wall: wash in, wash out; (\w+) visitors at a time\./;
const FOLLOWER_PATTERN = /([A-Z][a-z]+) follows the (\w+) likeness\./;
const MAPPER_PATTERN = /([A-Z][a-z]+) says the relevant work of a (\w+) includes infection control\./;
const LEVELLER_PATTERN = /([A-Z][a-z]+) says all buildings with (\w+) are the same\./;

/** The counted words the printed statements use for small visitor caps. */
const COUNT_OF_WORD = Object.freeze({
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

function required(pattern, statement, what) {
  const match = pattern.exec(statement);
  if (match === null) {
    throw new Error(`the statement does not record ${what}`);
  }
  return match;
}

function parse(statement) {
  const letter = required(LETTER_PATTERN, statement, 'the letter and the two institutions it likens');
  const card = required(CARD_PATTERN, statement, 'the infection card and the visitor cap it posts');
  const follower = required(FOLLOWER_PATTERN, statement, 'the reader who follows the letter’s likeness');
  const mapper = required(MAPPER_PATTERN, statement, 'the reader who names the institution’s relevant work');
  const leveller = required(LEVELLER_PATTERN, statement, 'the reader who treats every building with the shared fixture as the same');
  return {
    place: letter[1].trim(),
    institution: letter[2],
    likeness: letter[3],
    letterFixture: letter[4],
    capWord: card[1],
    follower: follower[1],
    followedLikeness: follower[2],
    mapper: mapper[1],
    mapperInstitution: mapper[2],
    leveller: leveller[1],
    sharedFixture: leveller[2]
  };
}

function solve(slots) {
  const cap = COUNT_OF_WORD[slots.capWord];
  if (cap === undefined || cap < 1) {
    throw new Error(`the card does not post a visitor cap this section counts: ${slots.capWord}`);
  }
  if (slots.likeness === slots.institution) {
    throw new Error('the likeness must be an institution other than the one the card governs');
  }
  if (slots.followedLikeness !== slots.likeness) {
    throw new Error('the reader who follows the likeness follows a likeness the letter does not draw');
  }
  if (slots.mapperInstitution !== slots.institution) {
    throw new Error('the reader who names the relevant work does not speak about the institution the letter likens');
  }
  if (slots.sharedFixture === '' || slots.letterFixture === '') {
    throw new Error('the case does not name the fixture the two buildings share');
  }
  return {
    verdict: 'no',
    sharedFixture: slots.sharedFixture,
    capWord: slots.capWord,
    cap,
    place: slots.place,
    institution: slots.institution,
    likeness: slots.likeness,
    follower: slots.follower,
    mapper: slots.mapper,
    leveller: slots.leveller
  };
}

function render(solution) {
  return `No. Shared ${solution.sharedFixture} are decorative. The infection card names the relevant constraints.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const countOfWord = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the letter");',
  'probe(countOfWord[slots.capWord] !== undefined && countOfWord[slots.capWord] > 0, "the card must post a visitor cap this section counts");',
  'probe(slots.likeness !== slots.institution, "the likeness must be an institution other than the one the card governs");',
  'probe(slots.followedLikeness === slots.likeness, "the reader who follows the likeness must follow the likeness the letter draws");',
  'probe(typeof slots.sharedFixture === "string" && slots.sharedFixture.length > 0, "the leveller must name the fixture the buildings share");',
  'return "No. Shared " + slots.sharedFixture + " are decorative. The infection card names the relevant constraints.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The letter in ${solution.place} likens the ${solution.institution} to a ${solution.likeness} because both have ${slots.letterFixture}, and it reads the visitor rule off that shared fixture.`,
    `${solution.follower} follows the likeness, but the fixture is decorative: the rule on the wall turns on infection control, which the ${solution.likeness} has no reason to carry.`,
    `${solution.mapper} names the relevant work the ${solution.institution} includes, and the infection card posts the constraint in the open: wash in, wash out, and ${solution.capWord} visitors at a time.`,
    `${solution.leveller} flattens every building with ${solution.sharedFixture} into one kind, which is exactly the inference the card's own constraint blocks.`
  ];
}

export const unit = 36;

export const cases = [
  {
    template: 'Institutional analogy',
    type: slugify('Institutional analogy'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
