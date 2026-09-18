/**
 * Section 13 of the logical-reasoning book: a biconditional.
 *
 * Every case posts one pass office where a day pass is issued "if and only if"
 * a stated fee is paid today and a photograph is on file, then records three
 * applicants: one who paid without a photograph, one who has a photograph
 * without paying, and one who holds both halves. The office town, the fee, and
 * the three names change between cases; the reasoning is fixed. A biconditional
 * makes the pair necessary and sufficient, so the applicant holding both halves
 * receives the pass and each missing half blocks it.
 */

import { slugify } from '../../naming.mjs';

const OFFICE_PATTERN =
  /^Pass office in ([A-Z][a-z]+(?: [A-Z][a-z]+)?): “A day pass is issued if and only if the fee of (\d+) is paid today and a photograph is on file\.”/;
const APPLICANT_PATTERN =
  /([A-Z][a-z]+) (paid today but has no photograph|has a photograph but did not pay today|paid today and has a photograph)\./g;

/** The two halves each recorded applicant holds, read off the printed clause. */
function halfStatus(clause) {
  switch (clause) {
    case 'paid today but has no photograph':
      return { paid: true, photograph: false };
    case 'has a photograph but did not pay today':
      return { paid: false, photograph: true };
    case 'paid today and has a photograph':
      return { paid: true, photograph: true };
    default:
      throw new Error(`the applicant clause "${clause}" is not one of the section's three shapes`);
  }
}

function parse(statement) {
  const office = OFFICE_PATTERN.exec(statement);
  if (office === null) {
    throw new Error('the statement does not record the pass office and its biconditional');
  }
  const applicants = [];
  for (const match of statement.matchAll(APPLICANT_PATTERN)) {
    applicants.push({ name: match[1], ...halfStatus(match[2]) });
  }
  if (applicants.length !== 3) {
    throw new Error('the statement does not record exactly three applicants');
  }
  return { place: office[1], fee: Number(office[2]), applicants };
}

/**
 * "If and only if" closes both directions, so the pass is forced for the
 * applicant who holds both halves and for nobody else; a case whose applicants
 * leave that set empty or larger than one does not match the section.
 */
function solve(slots) {
  const names = slots.applicants.map((applicant) => applicant.name);
  if (new Set(names).size !== names.length) {
    throw new Error('the three applicants must be different people');
  }
  if (!Number.isInteger(slots.fee) || slots.fee <= 0) {
    throw new Error('the fee must be a positive whole number');
  }
  const holders = slots.applicants.filter((applicant) => applicant.paid && applicant.photograph);
  if (holders.length !== 1) {
    throw new Error('the sentence issues exactly one pass, to the applicant holding both halves');
  }
  return { place: slots.place, fee: slots.fee, holder: holders[0].name };
}

function render(solution) {
  return `Only ${solution.holder}. “If and only if” makes the pair necessary and sufficient. Missing either half blocks the pass.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Number.isInteger(slots.fee) && slots.fee > 0, "the fee must be a positive whole number");',
  'probe(Array.isArray(slots.applicants) && slots.applicants.length === 3, "the case must record exactly three applicants");',
  'probe(new Set(slots.applicants.map((applicant) => applicant.name)).size === 3, "the three applicants must be different people");',
  'const holders = slots.applicants.filter((applicant) => applicant.paid === true && applicant.photograph === true);',
  'probe(holders.length === 1, "exactly one applicant holds both halves of the biconditional");',
  'return "Only " + holders[0].name + ". \\u201cIf and only if\\u201d makes the pair necessary and sufficient. Missing either half blocks the pass.";'
].join('\n');

function explain(slots, solution) {
  const paidOnly = slots.applicants.find((applicant) => applicant.paid && !applicant.photograph);
  const photoOnly = slots.applicants.find((applicant) => !applicant.paid && applicant.photograph);
  return [
    `The office in ${slots.place} issues a day pass if and only if the fee of ${slots.fee} is paid today and a photograph is on file, so the two halves are together necessary and sufficient.`,
    `${paidOnly.name} paid today but has no photograph, so one half of the pair is missing and the pass is blocked.`,
    `${photoOnly.name} has a photograph but did not pay today, so the other half is missing and the pass is blocked just the same.`,
    `${solution.holder} holds both halves, and the sufficiency direction of "if and only if" issues the pass to ${solution.holder}.`
  ];
}

export const unit = 13;

export const cases = [
  {
    template: 'If and only if',
    type: slugify('If and only if'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
