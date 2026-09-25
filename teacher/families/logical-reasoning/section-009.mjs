/**
 * Section 9 of the logical-reasoning book: definitions as rules.
 *
 * Every case quotes a library charter whose definition names a necessary
 * condition — a borrower listed for at least a stated number of months — and
 * records a borrower whose listing falls short, one speaker who asks for an
 * exception on grounds of care, and one who applies the definition as written.
 * The case data changes the place, the threshold, the shortfall, and the
 * names; the reasoning is fixed: the printed definition behaves as a rule, a
 * shortfall against its number fails it, and a personal quality is not a
 * listed substitute. The family reads the threshold and the actual listing and
 * renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const CHARTER_PATTERN = /^(.+?) library charter: “Only a resident borrower listed for at least (\d+) months may take an atlas home/;
const BORROWER_PATTERN = /([A-Z][a-z]+) has been listed for (\d+) months and asks for an atlas\./;
const EXCEPTION_PATTERN = /([A-Z][a-z]+) says ([A-Z][a-z]+) is careful and should be an exception\./;
const APPLIER_PATTERN = /([A-Z][a-z]+) applies the definition as written\./;

function parse(statement) {
  const charter = CHARTER_PATTERN.exec(statement);
  const borrower = BORROWER_PATTERN.exec(statement);
  const exception = EXCEPTION_PATTERN.exec(statement);
  const applier = APPLIER_PATTERN.exec(statement);
  if (charter === null || borrower === null || exception === null || applier === null) {
    throw new Error('the statement does not record the charter, the borrower, the exception, and the applier');
  }
  return {
    place: charter[1],
    threshold: Number(charter[2]),
    subject: borrower[1],
    actual: Number(borrower[2]),
    sayer: exception[1],
    namedBorrower: exception[2],
    applier: applier[1]
  };
}

function solve(slots) {
  const { threshold, actual, subject, sayer, namedBorrower, applier } = slots;
  if (!Number.isInteger(threshold) || threshold <= 0 || !Number.isInteger(actual) || actual < 0) {
    throw new Error('the charter must state a positive threshold and the case a non-negative listing');
  }
  if (actual >= threshold) {
    throw new Error('this section carries borrowers who fall short of the charter, not borrowers who satisfy it');
  }
  if (namedBorrower !== subject) {
    throw new Error('the exception must be asked for the borrower the case records');
  }
  if (sayer === subject || applier === subject || applier === sayer) {
    throw new Error('the borrower, the exception-seeker, and the applier must be three different people');
  }
  return { subject, actual, threshold, sayer, applier };
}

function render(solution) {
  return `No. ${solution.actual} is less than ${solution.threshold}. Carefulness is not a listed substitute. ${solution.applier} is doing deduction. ${solution.sayer} is writing a second charter.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "No. " + slots.actual + " is less than " + slots.threshold + ". Carefulness is not a listed substitute. " + slots.applier + " is doing deduction. " + slots.sayer + " is writing a second charter.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The charter defines the borrower who may take an atlas home by a necessary condition: listed for at least ${solution.threshold} months.`,
    `${solution.subject} has been listed for ${solution.actual} months, and ${solution.actual} is less than ${solution.threshold}, so the necessary condition fails.`,
    `${solution.sayer} offers carefulness instead, but the charter lists no substitute of that kind, so the offer is not part of the definition.`,
    `${solution.applier} applies the definition as written, which is the deduction the case forces.`
  ];
}

export const unit = 9;

export const cases = [
  {
    template: 'Definitions as rules',
    type: slugify('Definitions as rules'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
