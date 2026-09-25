/**
 * Section 99 of the logical-reasoning book: civic text, number, and cause.
 *
 * Every case posts three objects from one named place: a charter with a listed
 * month threshold for taking an atlas home, a table whose damage rose the year
 * after home loans expanded, and a letter claiming the charter caused the
 * damage, then three readings. The case data changes the place, the threshold,
 * the resident's listed months, and the three names; the reasoning is fixed:
 * the definition forces the refusal when the listed months fall below the
 * threshold, while the table is a before-after without a comparison town and
 * so shows no cause. The family reads the page and renders the printed verdict
 * with the two numbers of the deduction.
 */

import { slugify } from '../../naming.mjs';

const PAGE_PATTERN =
  /^([A-Z][a-z]+(?: [A-Z][a-z]+)*) charter: only resident borrowers listed for at least (\d+) months may take an atlas home\. A table: atlas damage rose the year after home loans expanded\. A letter: \u201cthe charter caused the damage\.\u201d ([A-Z][a-z]+) applies the charter to a (\d+)-month resident and refuses the loan\. ([A-Z][a-z]+) treats the table as proof the charter caused damage\. ([A-Z][a-z]+) says the table is a before-after without a comparison town, so cause is not shown, while the (\d+)-month refusal still follows the definition\./;

function parse(statement) {
  const page = PAGE_PATTERN.exec(statement);
  if (page === null) {
    throw new Error('the statement does not record the charter, the table, the letter, and its readings');
  }
  return {
    place: page[1],
    thresholdMonths: Number(page[2]),
    refusalApplier: page[3],
    applicantMonths: Number(page[4]),
    causeReader: page[5],
    mixedReader: page[6],
    statedRefusalMonths: Number(page[7])
  };
}

function solve(slots) {
  if (typeof slots.place !== 'string' || slots.place.length === 0) {
    throw new Error('the page must name the place of the library');
  }
  if (!Number.isInteger(slots.thresholdMonths) || slots.thresholdMonths <= 0) {
    throw new Error('the charter must list a positive month threshold');
  }
  if (!Number.isInteger(slots.applicantMonths) || slots.applicantMonths <= 0) {
    throw new Error('the applicant must have a positive number of listed months');
  }
  if (slots.applicantMonths >= slots.thresholdMonths) {
    throw new Error('the definition forces the refusal only when the listed months fall below the threshold');
  }
  if (slots.statedRefusalMonths !== slots.applicantMonths) {
    throw new Error('the two readings of the page must state the same number of listed months');
  }
  const readers = [slots.refusalApplier, slots.causeReader, slots.mixedReader];
  if (!readers.every((name) => typeof name === 'string' && name.length > 0)) {
    throw new Error('the page must name the three readers of the charter, the table, and the letter');
  }
  if (new Set(readers).size !== readers.length) {
    throw new Error('the three readings must come from three different people');
  }
  return {
    place: slots.place,
    thresholdMonths: slots.thresholdMonths,
    applicantMonths: slots.applicantMonths,
    refusalApplier: slots.refusalApplier,
    causeReader: slots.causeReader,
    mixedReader: slots.mixedReader
  };
}

function render(solution) {
  return `The refusal is forced by the definition (${solution.applicantMonths} < ${solution.thresholdMonths}). The causal story about damage is not forced. Two families, two strengths.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const readers = [slots.refusalApplier, slots.causeReader, slots.mixedReader];',
  'return "The refusal is forced by the definition (" + slots.applicantMonths + " < " + slots.thresholdMonths + "). The causal story about damage is not forced. Two families, two strengths.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The charter of ${solution.place} lets only resident borrowers listed for at least ${solution.thresholdMonths} months take an atlas home, and the applicant is listed for ${solution.applicantMonths} months.`,
    `The definition is a tight deduction: ${solution.applicantMonths} < ${solution.thresholdMonths}, so ${solution.refusalApplier}'s refusal follows with certainty.`,
    `${solution.causeReader} reads the table as proof of cause, but a rise after home loans expanded is a before-after with no comparison town.`,
    `${solution.mixedReader} labels the two objects by their own standards, so a mixed page gets two families and two strengths.`
  ];
}

export const unit = 99;

export const cases = [
  {
    template: 'Civic text, number, and cause',
    type: slugify('Civic text, number, and cause'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
