/**
 * Section 7 of the adult-reasoning course: lists, tables, and footnotes.
 *
 * Every variant prints the yearbook of a day-care: two opening-hours rows with
 * a one-child, a two-children, and a three-plus column, a lunch price per
 * child, and a neighbourhood discount. The footnote is the trap: the “2
 * children” and “3+” columns replace the base fee, lunch is added only after
 * the hours fee, and the discount comes last and once. The cases change the
 * village, the two-children fee, the lunch price, and the family name, so the
 * family derives every printed number from the statement.
 */

import { slugify } from '../../naming.mjs';

const CITY_PATTERN = /Yearbook of a day-care in ([^:]+):/;
const HOURS_PATTERN =
  /Hours (\d{1,2}:\d{2})–(\d{1,2}:\d{2}): 1 child (\d+); 2 children(?: same family)? (\d+); 3\+ (\d+)\./g;
const LUNCH_PATTERN = /Lunch: \+(\d+) per child, any hours\./;
const DISCOUNT_PATTERN = /Neighbourhood discount: −(\d+) per family, once, if they live in ([^.]+)\./;
const FAMILY_PATTERN =
  /([A-Z][a-z]+)’s family lives in ([^,]+), has ([a-z]+) children, wants (\d{1,2}:\d{2})–(\d{1,2}:\d{2}) and lunch for both\./;

const CHILDREN_WORDS = { one: 1, two: 2, three: 3, four: 4 };

function parse(statement) {
  const city = CITY_PATTERN.exec(statement);
  const family = FAMILY_PATTERN.exec(statement);
  const lunch = LUNCH_PATTERN.exec(statement);
  const discount = DISCOUNT_PATTERN.exec(statement);
  const rows = [...statement.matchAll(HOURS_PATTERN)].map((row) => ({
    from: row[1],
    until: row[2],
    one: Number(row[3]),
    two: Number(row[4]),
    threePlus: Number(row[5])
  }));
  if (city === null || family === null || lunch === null || discount === null) {
    throw new Error('the statement does not print the yearbook, the lunch price, the discount, and the family');
  }
  if (rows.length !== 2) {
    throw new Error('the yearbook must print exactly the two opening-hours rows');
  }
  const children = CHILDREN_WORDS[family[3]];
  if (children === undefined) {
    throw new Error(`the family size "${family[3]}" is not one the yearbook columns cover`);
  }
  return {
    place: city[1],
    family: {
      name: family[1],
      children,
      from: family[4],
      until: family[5]
    },
    rows,
    lunchPerChild: Number(lunch[1]),
    discount: { amount: Number(discount[1]), place: discount[2] },
    columnsReplaceBaseFee: /columns REPLACE the base fee; do not add 1\+1\./.test(statement)
  };
}

function baseFee(slots) {
  const row = slots.rows.find(
    (candidate) => candidate.from === slots.family.from && candidate.until === slots.family.until
  );
  if (row === undefined) {
    throw new Error(`the yearbook prints no ${slots.family.from}–${slots.family.until} row`);
  }
  if (slots.family.children === 1) {
    return row.one;
  }
  return slots.family.children === 2 ? row.two : row.threePlus;
}

function solve(slots) {
  const base = baseFee(slots);
  const lunchCount = slots.family.children;
  const discountAmount = slots.discount.place === slots.place ? slots.discount.amount : 0;
  return {
    base,
    lunchCount,
    lunchPerChild: slots.lunchPerChild,
    discount: discountAmount,
    total: base + lunchCount * slots.lunchPerChild - discountAmount
  };
}

function render(solution) {
  return `${solution.base} + ${solution.lunchCount}×${solution.lunchPerChild} − ${solution.discount} = ${solution.total}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.family === "object" && slots.family !== null, "the yearbook must name the family that asks for the fee");',
  'probe(typeof slots.family.name === "string" && slots.family.name.length > 0, "the family name must be on record");',
  'probe(Number.isInteger(slots.family.children) && slots.family.children >= 1, "the family size must be a whole number of children");',
  'probe(Array.isArray(slots.rows) && slots.rows.length === 2, "the yearbook must print the two opening-hours rows");',
  'probe(slots.rows.every((row) => row.one > 0 && row.two > row.one && row.threePlus > row.two), "each row must charge more as the family grows");',
  'probe(Number.isInteger(slots.lunchPerChild) && slots.lunchPerChild > 0, "lunch must cost a positive amount per child");',
  'probe(Number.isInteger(slots.discount.amount) && slots.discount.amount > 0, "the neighbourhood discount must be a positive amount");',
  'const row = slots.rows.find((candidate) => candidate.from === slots.family.from && candidate.until === slots.family.until);',
  'probe(row !== undefined, "the family must ask for one of the printed opening-hours rows");',
  'const base = slots.family.children === 1 ? row.one : (slots.family.children === 2 ? row.two : row.threePlus);',
  'const discount = slots.discount.place === slots.place ? slots.discount.amount : 0;',
  'const total = base + slots.family.children * slots.lunchPerChild - discount;',
  'probe(total > base, "adding lunch must raise the fee above the hours fee");',
  'return base + " + " + slots.family.children + "×" + slots.lunchPerChild + " − " + discount + " = " + total + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The footnote is binding, so ${slots.family.name}'s ${slots.family.children} children pay the “2 children” column for ${slots.family.from}–${slots.family.until}, ${solution.base}, and not twice the one-child fee.`,
    `Lunch comes after the hours fee, at ${solution.lunchPerChild} per child, so the family adds ${solution.lunchCount}×${solution.lunchPerChild} = ${solution.lunchCount * solution.lunchPerChild}.`,
    `The ${slots.discount.amount} neighbourhood discount is applied last and only once, because the family lives in ${slots.place}, which leaves ${solution.total} for the month.`,
    'The public-holiday clause does not reduce anything: the fee is due in full in every month.'
  ];
}

export const unit = 7;

export const cases = [
  {
    template: 'Lists, tables, and footnotes',
    type: slugify('Lists, tables, and footnotes'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
