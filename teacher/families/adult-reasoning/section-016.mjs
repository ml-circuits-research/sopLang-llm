/**
 * Section 16 of the adult-reasoning course: the monthly budget.
 *
 * Every variant posts the same budget sheet for one person: the net income, the
 * three fixed lines of rent, food, and transport, and the rule that the
 * emergency fund is a percent of income taken first, so variables may only use
 * what remains and no unit of currency is both spent and saved. The printed
 * answer is the fund, the variable remainder, and whether the wanted coat fits
 * inside that remainder. The variants change the person, the village, the
 * income, and the fixed lines, so the case keeps every amount as whole cents
 * and subtracts the fund before the fixed lines.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN =
  /Budget sheet, ([A-Z][a-z]+), ([^:]+): net income (\d+)\. Fixed: rent (\d+), food (\d+), transport (\d+)\./;
const FUND_PATTERN = /Emergency fund (\d+(?:\.\d+)?)% of income, taken FIRST\./;
const WISH_PATTERN = /([A-Z][a-z]+) wants a (\d+) coat without touching the fund\./;

function formatAmount(cents) {
  if (cents % 100 === 0) {
    return String(cents / 100);
  }
  return `${Math.trunc(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;
}

function parse(statement) {
  const sheet = SHEET_PATTERN.exec(statement);
  const fund = FUND_PATTERN.exec(statement);
  const wish = WISH_PATTERN.exec(statement);
  if (sheet === null || fund === null || wish === null) {
    throw new Error('the statement does not post the budget sheet with the fund and the wanted coat');
  }
  const saver = sheet[1];
  const spender = wish[1];
  if (saver !== spender) {
    throw new Error('the sheet and the wanted coat must belong to the same person');
  }
  const incomeCents = Number(sheet[3]) * 100;
  const fixedCents = (Number(sheet[4]) + Number(sheet[5]) + Number(sheet[6])) * 100;
  const coatCents = Number(wish[2]) * 100;
  if (!(incomeCents > 0) || fixedCents < 0 || !(coatCents > 0)) {
    throw new Error('the income and the coat price must be positive and the fixed lines must not be negative');
  }
  if (fund[1] === '0') {
    throw new Error('the emergency fund must take a positive percent of income');
  }
  return {
    saver,
    village: sheet[2].trim(),
    incomeCents,
    fixedCents,
    coatCents,
    fundPercent: Number(fund[1]),
    fundFirst: /Emergency fund \d+(?:\.\d+)?% of income, taken FIRST\./.test(statement),
    noDoubleCount: /A unit of currency is not both spent and saved\./.test(statement)
  };
}

function solve(slots) {
  const fundCents = Math.round((slots.incomeCents * Math.round(slots.fundPercent * 100)) / 10000);
  const remainderCents = slots.incomeCents - fundCents - slots.fixedCents;
  if (remainderCents < 0) {
    throw new Error('the fund and the fixed lines must not exceed the net income');
  }
  return {
    fundCents,
    remainderCents,
    fits: remainderCents >= slots.coatCents,
    coatCents: slots.coatCents,
    fundPercent: slots.fundPercent
  };
}

function render(solution) {
  const verdict = solution.fits ? 'The coat fits.' : 'The coat does not fit.';
  return `Fund ${formatAmount(solution.fundCents)}. Remainder ${formatAmount(solution.remainderCents)}. ${verdict}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.saver === "string" && /^[A-Z][a-z]+$/.test(slots.saver), "the case must name the person the sheet belongs to");',
  'probe(typeof slots.village === "string" && slots.village.trim().length > 0, "the case must name the village of the sheet");',
  'probe(Number.isInteger(slots.incomeCents) && slots.incomeCents > 0, "the net income must be a positive whole number of cents");',
  'probe(Number.isInteger(slots.fixedCents) && slots.fixedCents >= 0, "the fixed lines must be a whole number of cents");',
  'probe(Number.isInteger(slots.coatCents) && slots.coatCents > 0, "the wanted coat must cost a positive whole number of cents");',
  'probe(typeof slots.fundPercent === "number" && slots.fundPercent > 0 && slots.fundPercent < 100, "the emergency fund must take a positive percent below the whole income");',
  'probe(slots.fundFirst === true, "the sheet must take the fund first");',
  'probe(slots.noDoubleCount === true, "the sheet must forbid counting one unit of currency twice");',
  'const format = (cents) => cents % 100 === 0 ? String(cents / 100) : Math.trunc(cents / 100) + "." + String(cents % 100).padStart(2, "0");',
  'const fundCents = Math.round((slots.incomeCents * Math.round(slots.fundPercent * 100)) / 10000);',
  'const remainderCents = slots.incomeCents - fundCents - slots.fixedCents;',
  'probe(fundCents > 0, "the fund must take something from a positive income");',
  'probe(remainderCents >= 0, "the fund and the fixed lines must not exceed the net income");',
  'probe(fundCents + slots.fixedCents + remainderCents === slots.incomeCents, "the fund, the fixed lines, and the remainder must add back to the income");',
  'const fits = remainderCents >= slots.coatCents;',
  'return "Fund " + format(fundCents) + ". Remainder " + format(remainderCents) + ". " + (fits ? "The coat fits." : "The coat does not fit.");'
].join('\n');

function explain(slots, solution) {
  return [
    `The sheet takes the emergency fund first, so ${slots.fundPercent}% of the net income ${formatAmount(slots.incomeCents)} is ${formatAmount(solution.fundCents)} before any fixed line is paid.`,
    `The fixed lines of rent, food, and transport take ${formatAmount(slots.fixedCents)} in total, and the income minus the fund and those lines leaves ${formatAmount(solution.remainderCents)} for variables.`,
    `The coat costs ${formatAmount(solution.coatCents)} and the fund is not touched, so the test is the remainder alone against that price.`,
    solution.fits
      ? `The remainder covers the coat, so ${slots.saver} can buy it without spending any unit twice.`
      : `The remainder is below the coat price, so ${slots.saver} cannot buy it without touching the fund.`
  ];
}

export const unit = 16;

export const cases = [
  {
    template: 'The monthly budget',
    type: slugify('The monthly budget'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
