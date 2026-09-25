/**
 * Section 67 of the logical-reasoning book: independence versus a streak.
 *
 * Every case posts one card holding a fair coin tossed twice, records a
 * separate notebook entry about a bus, and then has three speakers: one reads
 * a streak as a debt ("due for tails"), one says the two tosses are independent
 * on this card, and one merges the coin and the bus into a shared luck
 * account. The case data changes the place, the number of heads already
 * thrown, and the three names; the reasoning is fixed: the card's own rule
 * makes each toss independent, so the streak invents a memory the coin was
 * never given, and the unrelated bus is not part of the coin's rule.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN =
  /Card in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): a fair listed coin is tossed ([a-z]+)\./;
const NOTEBOOK_PATTERN =
  /Separately, a notebook says dry-weather road painting often blocks the bus\./;
const DUE_PATTERN = /([A-Z][a-z]+) says after ([a-z]+) heads the coin is due for tails\./;
const INDEPENDENT_PATTERN =
  /([A-Z][a-z]+) says the two tosses are independent on this card, so “due” is not a fraction\./;
const LUCK_PATTERN = /([A-Z][a-z]+) says the coin and the bus must share a luck account\./;

const NUMBER_WORDS = Object.freeze({
  one: 1,
  two: 2,
  twice: 2,
  three: 3,
  thrice: 3,
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
  const card = CARD_PATTERN.exec(statement);
  if (card === null) {
    throw new Error('the statement does not post the card with its fair coin and its two tosses');
  }
  if (!NOTEBOOK_PATTERN.test(statement)) {
    throw new Error('the statement does not record the separate notebook entry about the bus');
  }
  const due = DUE_PATTERN.exec(statement);
  if (due === null) {
    throw new Error('the statement does not record the speaker who reads the streak as a debt');
  }
  const independent = INDEPENDENT_PATTERN.exec(statement);
  if (independent === null) {
    throw new Error('the statement does not record the speaker who reads the two tosses as independent');
  }
  const luck = LUCK_PATTERN.exec(statement);
  if (luck === null) {
    throw new Error('the statement does not record the speaker who merges the coin and the bus');
  }
  return {
    place: card[1],
    tosses: wordNumber(card[2], 'the number of tosses'),
    streak: wordNumber(due[2], 'the number of heads already thrown'),
    dueClaimant: due[1],
    independentClaimant: independent[1],
    luckClaimant: luck[1]
  };
}

function solve(slots) {
  if (slots.tosses < 2) {
    throw new Error('the card tosses the coin fewer than twice, so there is no next-toss claim to read');
  }
  if (slots.streak < 1) {
    throw new Error('the card records no run of heads, so the "due" claim has nothing to attach to');
  }
  const speakers = new Set([slots.dueClaimant, slots.independentClaimant, slots.luckClaimant]);
  if (speakers.size !== 3) {
    throw new Error('the three readings of the card must come from three different speakers');
  }
  return {
    place: slots.place,
    tosses: slots.tosses,
    streak: slots.streak,
    dueClaimant: slots.dueClaimant,
    independentClaimant: slots.independentClaimant,
    luckClaimant: slots.luckClaimant,
    subject: 'the two tosses'
  };
}

function render(solution) {
  return `The two tosses, as a fair coin on this card. “Due” invents a memory the coin is not given.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "The two tosses, as a fair coin on this card. “Due” invents a memory the coin is not given.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card in ${slots.place} is a fair coin tossed ${slots.tosses === 2 ? 'twice' : `${slots.tosses} times`}, and a fair coin's own rule makes each toss independent of the ones before it.`,
    `${solution.dueClaimant} reads ${slots.streak} heads as a debt the coin must now pay, but the card never gives the coin a memory of those heads.`,
    `${solution.independentClaimant} states what the card actually writes: "due" is not a fraction here.`,
    `${solution.luckClaimant} folds the separate bus note into the coin; the notebook entry is another object with its own rule, not evidence about this toss.`
  ];
}

export const unit = 67;

export const cases = [
  {
    template: 'Independent and not independent',
    type: slugify('Independent and not independent'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
