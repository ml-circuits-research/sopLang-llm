/**
 * Section 84 of the adult-reasoning course: negotiation with written constraints.
 *
 * Every variant prints the sheet that precedes a bargain: one side will not go
 * under a floor, the other will not go over a ceiling, one object is on the
 * table, and payment is cash today or not at all. The sheet's own rule is that
 * overlapping intervals leave room, so the verdict reports the common interval
 * and one figure inside it. The cases change the two parties, the floor, and
 * the ceiling, so the family derives the interval and its example from the
 * parsed numbers.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN =
  /Sheet before a bargain: ([A-Z][a-z]+) will not go under (\d+)\. ([A-Z][a-z]+) will not go over (\d+)\./;

function parse(statement) {
  const sheet = SHEET_PATTERN.exec(statement);
  if (sheet === null) {
    throw new Error('the statement does not state both written limits');
  }
  return {
    seller: sheet[1],
    buyer: sheet[3],
    floor: Number(sheet[2]),
    ceiling: Number(sheet[4]),
    oneObject: /One object\./.test(statement),
    cashToday: /Cash today, otherwise not\./.test(statement)
  };
}

function solve(slots) {
  if (slots.floor <= 0 || slots.ceiling <= 0) {
    throw new Error('the written limits must be positive amounts');
  }
  if (slots.floor > slots.ceiling) {
    throw new Error('the written intervals do not overlap, which is not this section pattern');
  }
  if (slots.seller === slots.buyer) {
    throw new Error('the two sides of the bargain must be different people');
  }
  const middle = (slots.floor + slots.ceiling) / 2;
  if (!Number.isInteger(middle)) {
    throw new Error('the common interval has no whole middle figure to use as the example');
  }
  return {
    floor: slots.floor,
    ceiling: slots.ceiling,
    example: middle,
    payment: slots.cashToday ? 'cash today' : 'on other terms'
  };
}

function render(solution) {
  return `Yes, [${solution.floor}, ${solution.ceiling}]. Example: ${solution.example} ${solution.payment}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.seller === "string" && slots.seller.length > 0, "the case must name the side with the floor");',
  'probe(typeof slots.buyer === "string" && slots.buyer.length > 0, "the case must name the side with the ceiling");',
  'probe(slots.seller !== slots.buyer, "the two sides of the bargain must be different people");',
  'probe(Number.isInteger(slots.floor) && slots.floor > 0, "the floor must be a positive whole amount");',
  'probe(Number.isInteger(slots.ceiling) && slots.ceiling > 0, "the ceiling must be a positive whole amount");',
  'probe(slots.floor <= slots.ceiling, "the written intervals must overlap");',
  'probe((slots.floor + slots.ceiling) % 2 === 0, "the common interval must have a whole middle figure");',
  'const middle = (slots.floor + slots.ceiling) / 2;',
  'probe(slots.cashToday === true && slots.oneObject === true, "the sheet must fix one object and cash today");',
  'return "Yes, [" + slots.floor + ", " + slots.ceiling + "]. Example: " + middle + " cash today.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.seller} will not go under ${slots.floor} and ${slots.buyer} will not go over ${slots.ceiling}, so the two written intervals share the range ${slots.floor} to ${slots.ceiling}.`,
    `The sheet's own rule says an overlap leaves room, and the middle of that shared range, ${solution.example}, belongs to both sides at once.`,
    `The object is single and the payment is cash today, so the example keeps that condition instead of proposing instalments or a second object.`,
    `Any figure from ${slots.floor} to ${slots.ceiling} would satisfy both limits; ${solution.example} is the one printed because it is the shared middle.`
  ];
}

export const unit = 84;

export const cases = [
  {
    template: 'Negotiation with written constraints',
    type: slugify('Negotiation with written constraints'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
