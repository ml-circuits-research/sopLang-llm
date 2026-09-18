/**
 * Section 80 of the adult-reasoning course: statistics presented selectively.
 *
 * Every variant prints the same quoted result (a percentage of the customers
 * who replied are satisfied, with a small number of replies out of a much
 * larger number of sales) and then shows one reader repeating the percentage as
 * a claim about all customers. The verdict names the group the percentage
 * really covers, the approximate head count behind it, the total it does not
 * cover, and the unknown non-response. The variants change the reader, the
 * reply count, and the sales count, so the family derives the respondent count
 * and the head count from the parsed numbers.
 */

import { slugify } from '../../naming.mjs';

const NOTE_PATTERN = /“(\d+)% of customers who replied are satisfied\. (\d+) of (\d+) sales replied\.”/;
const READER_PATTERN = /([A-Z][a-z]+) reads: “(\d+)% of customers are satisfied\.”/;

function parse(statement) {
  const note = NOTE_PATTERN.exec(statement);
  const reader = READER_PATTERN.exec(statement);
  if (note === null || reader === null) {
    throw new Error('the statement does not print the quoted result and the reader who widens it');
  }
  const percent = Number(note[1]);
  const replied = Number(note[2]);
  const sales = Number(note[3]);
  if (percent <= 0 || percent > 100) {
    throw new Error('the quoted percentage must be a whole share of the respondents');
  }
  if (replied <= 0 || sales <= replied) {
    throw new Error('the replies must be a positive part of the sales');
  }
  return {
    name: reader[1],
    percent,
    readPercent: Number(reader[2]),
    replied,
    sales
  };
}

function solve(slots) {
  if (slots.readPercent !== slots.percent) {
    throw new Error('the reader must quote the same percentage');
  }
  const satisfied = Math.floor((slots.replied * slots.percent) / 100);
  if (satisfied <= 0 || satisfied > slots.replied) {
    throw new Error('the satisfied respondents must be a part of the replies');
  }
  return { replied: slots.replied, sales: slots.sales, satisfied, silent: slots.sales - slots.replied };
}

function render(solution) {
  return `Of ${solution.replied} respondents (≈${solution.satisfied} people), not of ${solution.sales}. Non-response is unknown.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.name === "string" && slots.name.length > 0, "the case must name the reader who widens the claim");',
  'probe(Number.isInteger(slots.percent) && slots.percent > 0 && slots.percent <= 100, "the note states a whole percentage");',
  'probe(slots.readPercent === slots.percent, "the reader repeats the same percentage");',
  'probe(Number.isInteger(slots.replied) && slots.replied > 0, "some customers replied");',
  'probe(Number.isInteger(slots.sales) && slots.sales > slots.replied, "the sales outnumber the replies");',
  'const satisfied = Math.floor(slots.replied * slots.percent / 100);',
  'probe(satisfied > 0 && satisfied <= slots.replied, "the satisfied respondents are a part of the replies");',
  'probe(slots.sales - slots.replied > 0, "the silent customers are a positive group");',
  'return "Of " + slots.replied + " respondents (≈" + satisfied + " people), not of " + slots.sales + ". Non-response is unknown.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The quoted sentence speaks only about the ${slots.replied} customers who replied, so ${slots.percent}% of them is about ${solution.satisfied} people, not a fact about the ${slots.sales} sales.`,
    `${slots.name} drops that limit and turns the result into "${slots.percent}% of customers are satisfied", which claims a share of everybody.`,
    `The remaining ${solution.silent} customers never replied, so their opinion is unknown and cannot be counted on either side.`
  ];
}

export const unit = 80;

export const cases = [
  {
    template: 'Statistics presented selectively',
    type: slugify('Statistics presented selectively'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
