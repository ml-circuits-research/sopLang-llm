/**
 * Section 26 of the logical-reasoning book: enumeration is not a climb.
 *
 * Every case lists the contents of one drawer: a small number of labelled keys,
 * of which one group opens the shed and one bent key does not. Three speakers
 * follow: one says some of these keys open the shed, one says all keys
 * everywhere open sheds, and one reads the drawer as the complete list and the
 * open count as a count rather than a climb. The place, the count, and the
 * three names vary; the reasoning is fixed, because a closed list is counted,
 * not induced from, and only leaving the list makes the sentence a climb.
 *
 * The family reads the enumeration (its total, its open and bent keys, and the
 * quoted count) and the three speakers, then renders the printed verdict with
 * the count in words.
 */

import { slugify } from '../../naming.mjs';

const DRAWER_PATTERN =
  /A drawer in ([A-Z][A-Za-z]*(?: [A-Z][a-z]+)*) holds ([A-Za-z]+|\d+) labelled keys\./;
const SPLIT_PATTERN = /([A-Za-z]+|\d+) open the shed; ([A-Za-z]+|\d+) is bent and does not\./;
const WEAK_PATTERN = /([A-Z][a-z]+) says “some of these keys open the shed\.”/;
const CLIMB_PATTERN = /([A-Z][a-z]+) says “all keys everywhere open sheds\.”/;
const COUNT_PATTERN =
  /([A-Z][a-z]+) says the drawer is a complete list of the ([A-Za-z]+|\d+), so “([A-Za-z]+|\d+) of these ([A-Za-z]+|\d+) open the shed” is a count, not a climb\./;

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

function countOf(word, what) {
  const text = String(word).toLowerCase();
  const value = /^\d+$/.test(text) ? Number(text) : NUMBER_WORDS.indexOf(text);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`the statement spells ${what} as "${word}", which this section does not read`);
  }
  return { value, word: NUMBER_WORDS[value] ?? String(value) };
}

function find(pattern, statement, what) {
  const match = pattern.exec(statement);
  if (match === null) {
    throw new Error(`the statement does not record ${what}`);
  }
  return match;
}

function parse(statement) {
  const drawer = find(DRAWER_PATTERN, statement, 'the drawer and its labelled keys');
  const split = find(SPLIT_PATTERN, statement, 'the open and the bent keys');
  const count = find(COUNT_PATTERN, statement, 'the speaker who reads the drawer as a complete list');
  const total = countOf(drawer[2], 'the labelled keys');
  const open = countOf(split[1], 'the keys that open the shed');
  const bent = countOf(split[2], 'the bent key');
  const counted = countOf(count[3], 'the quoted count of open keys');
  const quotedTotal = countOf(count[4], 'the quoted total of keys');
  if (counted.word !== open.word || quotedTotal.word !== total.word) {
    throw new Error('the quoted count must be the enumeration’s own numbers');
  }
  return {
    place: drawer[1],
    total: total.value,
    totalWord: total.word,
    open: open.value,
    bent: bent.value,
    counted: counted.value,
    countedOf: quotedTotal.value,
    enumerator: count[1],
    weak: find(WEAK_PATTERN, statement, 'the speaker who says some of these keys open the shed')[1],
    climber: find(CLIMB_PATTERN, statement, 'the speaker who says all keys everywhere open sheds')[1]
  };
}

function solve(slots) {
  if (slots.total !== slots.open + slots.bent) {
    throw new Error('the enumeration must account for every labelled key in the drawer');
  }
  if (slots.open < 1 || slots.bent < 1) {
    throw new Error('a count of the open keys needs both outcomes listed');
  }
  if (slots.counted !== slots.open || slots.countedOf !== slots.total) {
    throw new Error('the quoted count must be the enumeration’s own numbers');
  }
  if (new Set([slots.enumerator, slots.weak, slots.climber]).size !== 3) {
    throw new Error('the three speakers must be three different people');
  }
  return {
    enumerator: slots.enumerator,
    weak: slots.weak,
    climber: slots.climber,
    totalWord: slots.totalWord
  };
}

function render(solution) {
  return `${solution.enumerator} is right about the ${solution.totalWord}. ${solution.weak} is also true and weaker. ${solution.climber} climbed from ${solution.totalWord} keys to the world.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return slots.enumerator + " is right about the " + slots.totalWord + ". " + slots.weak + " is also true and weaker. " + slots.climber + " climbed from " + slots.totalWord + " keys to the world.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The drawer in ${slots.place} is a complete list of ${slots.total} labelled keys: ${slots.open} open the shed and ${slots.bent} bent one does not.`,
    `${solution.enumerator} counts inside that closed list and is right about the ${solution.totalWord}, and “${slots.open} of these ${slots.totalWord} open the shed” carries no more than the count.`,
    `${solution.weak} is true and weaker, because some of the listed keys do open the shed, while ${solution.climber} leaves the list for keys everywhere, which the drawer cannot support.`
  ];
}

export const unit = 26;

export const cases = [
  {
    template: 'Enumeration is not a climb',
    type: slugify('Enumeration is not a climb'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
