/**
 * Section 70 of the logical-reasoning book: a banner against the table under it.
 *
 * Every case sets a shouting headline above a two-cell table of last month's
 * and this month's sales, and then has three speakers: one follows the
 * headline, one follows the table and computes what the headline's word would
 * have required, and one says headlines are allowed to sing because tables are
 * dull. The case data changes the place, the headline's claim, the two sale
 * counts, and the three names; the reasoning is fixed: the table carries the
 * quantity, the headline's word must be tested against the cells, and song
 * does not amend a cell.
 */

import { slugify } from '../../naming.mjs';

const HEADLINE_PATTERN = /Headline in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): “([^”]+)”/;
const TABLE_PATTERN = /Table under it: last month (\d+) listed sales, this month (\d+)\./;
const FOLLOW_HEADLINE_PATTERN = /([A-Z][a-z]+) follows the headline\./;
const FOLLOW_TABLE_PATTERN = /([A-Z][a-z]+) follows the table: (\d+) is not double (\d+)\./;
const SING_PATTERN = /([A-Z][a-z]+) says headlines are allowed to sing because tables are dull\./;

const MULTIPLE_WORDS = Object.freeze({
  DOUBLED: 2,
  TRIPLED: 3,
  QUADRUPLED: 4
});

function claimedMultipleOf(headline) {
  const word = /([A-Z]+)\s*$/.exec(headline.trim().replace(/\.$/, ''));
  const multiple = word === null ? undefined : MULTIPLE_WORDS[word[1]];
  if (multiple === undefined) {
    throw new Error(`the headline claims "${headline.trim()}", a multiple this section does not read`);
  }
  return multiple;
}

function parse(statement) {
  const headline = HEADLINE_PATTERN.exec(statement);
  if (headline === null) {
    throw new Error('the statement does not post the headline with its claim');
  }
  const table = TABLE_PATTERN.exec(statement);
  if (table === null) {
    throw new Error('the statement does not give the table with last month\'s and this month\'s sales');
  }
  const follower = FOLLOW_HEADLINE_PATTERN.exec(statement);
  if (follower === null) {
    throw new Error('the statement does not record the speaker who follows the headline');
  }
  const reader = FOLLOW_TABLE_PATTERN.exec(statement);
  if (reader === null) {
    throw new Error('the statement does not record the speaker who reads the table cells');
  }
  const singer = SING_PATTERN.exec(statement);
  if (singer === null) {
    throw new Error('the statement does not record the speaker who excuses the headline');
  }
  const lastMonth = Number(table[1]);
  const thisMonth = Number(table[2]);
  if (Number(reader[2]) !== thisMonth || Number(reader[3]) !== lastMonth) {
    throw new Error('the table reader must quote the two listed sales counts');
  }
  return {
    place: headline[1],
    claim: headline[2].trim(),
    multiple: claimedMultipleOf(headline[2]),
    lastMonth,
    thisMonth,
    headlineClaimant: follower[1],
    tableClaimant: reader[1],
    singClaimant: singer[1]
  };
}

function solve(slots) {
  if (slots.lastMonth <= 0) {
    throw new Error('last month must be listed with a positive count of sales');
  }
  const claimed = slots.lastMonth * slots.multiple;
  if (slots.thisMonth <= slots.lastMonth) {
    throw new Error('this month must be above last month for the printed verdict of a small rise');
  }
  if (slots.thisMonth >= claimed) {
    throw new Error('this month must stay below the headline\'s claim, so the table contradicts the banner');
  }
  const speakers = new Set([slots.headlineClaimant, slots.tableClaimant, slots.singClaimant]);
  if (speakers.size !== 3) {
    throw new Error('the three readings of the page must come from three different speakers');
  }
  return {
    place: slots.place,
    lastMonth: slots.lastMonth,
    thisMonth: slots.thisMonth,
    claimed,
    verdict: 'the table'
  };
}

function render(solution) {
  return `The table. Double of ${solution.lastMonth} would be ${solution.claimed}. ${solution.thisMonth} is a small rise.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const claimed = slots.lastMonth * slots.multiple;',
  'return "The table. Double of " + slots.lastMonth + " would be " + claimed + ". " + slots.thisMonth + " is a small rise.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The page in ${slots.place} separates two layers: the banner claims "${slots.claim}", while the table under it lists ${slots.lastMonth} last month and ${slots.thisMonth} this month.`,
    `Testing the banner's word against the cells, double of ${slots.lastMonth} would be ${solution.claimed}, and ${slots.thisMonth} is far below that.`,
    `${solution.tableClaimant} reads down the table and sees a small rise, which is the quantity the page actually carries.`,
    `${solution.singClaimant} excuses the banner because tables are dull; song does not amend a cell.`
  ];
}

export const unit = 70;

export const cases = [
  {
    template: 'Headline versus table',
    type: slugify('Headline versus table'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
