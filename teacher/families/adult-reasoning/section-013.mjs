/**
 * Section 13 of the adult-reasoning course: simple interest and instalments.
 *
 * Every variant posts the same mutual-aid poster and records one borrower who
 * takes a capital for a number of months and brings the money exactly on time.
 * The printed answer is the simple interest, the sum at term, and the separate
 * late line of one percent of the capital. The variants change the ward, the
 * rate, the capital, the term, and the borrower, so the case derives the three
 * amounts with scaled integer arithmetic on cents.
 */

import { slugify } from '../../naming.mjs';

const POSTER_PATTERN = /Mutual-aid poster, ([^:]+):/;
const NOTICE_PATTERN =
  /“Simple interest: interest = capital × yearly rate × \(months\/12\)\. Rate (\d+(?:\.\d+)?)%\. No arrangement fee\. Late: \+(\d+(?:\.\d+)?)% of capital per begun month, a separate line\. At term = capital \+ interest\.”/;
const LOAN_PATTERN =
  /([A-Z][a-z]+) borrows (\d+) for (\d+) months and brings the money exactly on time\./;

function formatCents(cents) {
  return `${Math.trunc(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;
}

function formatPercent(percent) {
  return `${percent}%`;
}

function parse(statement) {
  const poster = POSTER_PATTERN.exec(statement);
  const notice = NOTICE_PATTERN.exec(statement);
  const loan = LOAN_PATTERN.exec(statement);
  if (poster === null || notice === null || loan === null) {
    throw new Error('the statement does not post the simple-interest notice with one on-time borrower');
  }
  const ratePercent = Number(notice[1]);
  const latePercent = Number(notice[2]);
  const capitalCents = Number(loan[2]) * 100;
  const months = Number(loan[3]);
  if (!(ratePercent > 0) || !(latePercent > 0) || !(capitalCents > 0) || !Number.isInteger(months) || months <= 0) {
    throw new Error('the rate, the late percent, the capital, and the term must all be positive');
  }
  return {
    ward: poster[1].trim(),
    borrower: loan[1],
    capitalCents,
    months,
    ratePercent,
    latePercent,
    onTime: /brings the money exactly on time/.test(statement)
  };
}

function solve(slots) {
  const interestCents = Math.round(
    (slots.capitalCents * Math.round(slots.ratePercent * 100) * slots.months) / 120000
  );
  const termCents = slots.capitalCents + interestCents;
  const lateCents = Math.round((slots.capitalCents * Math.round(slots.latePercent * 100)) / 10000);
  return { interestCents, termCents, lateCents, latePercent: slots.latePercent };
}

function render(solution) {
  return `Interest ${formatCents(solution.interestCents)}. At term ${formatCents(solution.termCents)}. One late month: +${formatCents(solution.lateCents)} (${formatPercent(solution.latePercent)} of capital, not of the total).`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const format = (cents) => Math.trunc(cents / 100) + "." + String(cents % 100).padStart(2, "0");',
  'const interestCents = Math.round((slots.capitalCents * Math.round(slots.ratePercent * 100) * slots.months) / 120000);',
  'const termCents = slots.capitalCents + interestCents;',
  'const lateCents = Math.round((slots.capitalCents * Math.round(slots.latePercent * 100)) / 10000);',
  'probe(interestCents > 0, "the simple interest must be positive for a positive rate and term");',
  'probe(termCents === slots.capitalCents + interestCents, "the sum at term must add the interest to the capital");',
  'probe(lateCents === Math.round((slots.capitalCents * slots.latePercent) / 100), "one late month must charge the late percent of the capital alone");',
  'return "Interest " + format(interestCents) + ". At term " + format(termCents) + ". One late month: +" + format(lateCents) + " (" + slots.latePercent + "% of capital, not of the total).";'
].join('\n');

function explain(slots, solution) {
  return [
    `The poster fixes simple interest as capital × yearly rate × months/12, so ${formatCents(slots.capitalCents)} at ${formatPercent(slots.ratePercent)} for ${slots.months} months gives ${formatCents(solution.interestCents)}.`,
    `The sum at term is the capital plus that interest alone, ${formatCents(solution.termCents)}; no interest is charged on interest.`,
    `The late line is a separate charge of ${formatPercent(slots.latePercent)} of the capital, which is ${formatCents(solution.lateCents)} and does not include the interest.`,
    `${slots.borrower} brings the money exactly on time in ${slots.ward}, so no late line is added.`
  ];
}

export const unit = 13;

export const cases = [
  {
    template: 'Simple interest and instalments',
    type: slugify('Simple interest and instalments'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
