/**
 * Section 96 of the logical-reasoning book: reading a study summary.
 *
 * Every case posts a wall summary in a named place: the listed adults, the
 * comparison, tea versus rest, the identical easing rate, and the tea-shop
 * funder, then three readings of the page. The case data changes the place, the
 * headcount, and the three names; the reasoning is fixed: design, result, and
 * motive are three separate objects, so the funder is a reason to look hard at
 * independence and not an automatic bin or an automatic halo. The family reads
 * the summary and renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const SUMMARY_PATTERN =
  /^Wall summary in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): \u201c(\d+) adults; comparison; tea versus rest; same listed easing rate; funded by a tea shop.\u201d ([A-Z][a-z]+) throws the page away because of the funder\. ([A-Z][a-z]+) throws the result away because \u201cstudies always lie.\u201d ([A-Z][a-z]+) keeps three objects separate: design, result, and a reason to look hard at independence \(funder\)\./;

function parse(statement) {
  const summary = SUMMARY_PATTERN.exec(statement);
  if (summary === null) {
    throw new Error('the statement does not record the wall summary and its three readings');
  }
  return {
    place: summary[1],
    adults: Number(summary[2]),
    pageThrower: summary[3],
    resultThrower: summary[4],
    keeper: summary[5]
  };
}

function solve(slots) {
  if (!Number.isInteger(slots.adults) || slots.adults <= 0) {
    throw new Error('the summary must list a positive number of adults');
  }
  const readers = [slots.pageThrower, slots.resultThrower, slots.keeper];
  if (new Set(readers).size !== readers.length) {
    throw new Error('the three readings must come from three different people');
  }
  return {
    place: slots.place,
    adults: slots.adults,
    pageThrower: slots.pageThrower,
    resultThrower: slots.resultThrower,
    keeper: slots.keeper
  };
}

function render(solution) {
  return 'The design and the listed result, plus a caution about independence \u2014 not an automatic bin, not an automatic halo.';
}

const COMPUTE = [
  'const slots = $slots;',
  'return "The design and the listed result, plus a caution about independence \\u2014 not an automatic bin, not an automatic halo.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The wall summary in ${solution.place} labels a design (a comparison of tea versus rest over ${solution.adults} adults at the same listed easing rate), a result, and a motive (the tea-shop funder).`,
    `${solution.keeper} keeps those three objects separate, so the funder becomes a reason to look hard at independence rather than a substitute for reading the cells.`,
    `${solution.pageThrower} bins the page because of the funder, and ${solution.resultThrower} bins the result because studies always lie; both let a motive do the inspection.`
  ];
}

export const unit = 96;

export const cases = [
  {
    template: 'Reading a study summary',
    type: slugify('Reading a study summary'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
