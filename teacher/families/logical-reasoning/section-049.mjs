/**
 * Section 49 of the logical-reasoning book: watching versus assigning.
 *
 * Every case presents two pages about the evening tea: one that watches people
 * who already chose the tea, and one whose printed comparison assigned the tea
 * and the rest-only condition to equal groups that then eased at the same
 * listed rate. Then one person equates the pages, one points at the
 * self-selection of the watching page and at the assignment of the comparison,
 * and one rejects the comparison for being unnatural. The case data changes
 * the place, the two page labels, the subject, the two group sizes, and the
 * three names; the verdict is fixed: the assigned comparison is the better
 * design for the causal question, and design, not sincerity, is the
 * difference.
 */

import { slugify } from '../../naming.mjs';

const OBSERVED_PATTERN =
  /Two pages in (.+?)\. Page ([A-Z]): people who already choose ([a-z ]+) also report ([a-z ]+)\./;
const ASSIGNED_PATTERN =
  /Page ([A-Z]): a printed comparison assigned ([a-z ]+) to (\d+) listed people and rest-only to (\d+); both groups eased at the same listed ([a-z]+)\./;
const EQUATE_PATTERN = /([A-Z][a-z]+) treats page ([A-Z]) as equal to page ([A-Z])\./;
const DESIGN_PATTERN =
  /([A-Z][a-z]+) says page ([A-Z]) leaks with self-selection; page ([A-Z]) is the better design for “did ([a-z ]+) do it\?”/;
const UNNATURAL_PATTERN = /([A-Z][a-z]+) says assignment is unnatural so it cannot teach\./;

function parse(statement) {
  const observed = OBSERVED_PATTERN.exec(statement);
  const assigned = ASSIGNED_PATTERN.exec(statement);
  const equate = EQUATE_PATTERN.exec(statement);
  const design = DESIGN_PATTERN.exec(statement);
  const unnatural = UNNATURAL_PATTERN.exec(statement);
  if (observed === null || assigned === null || equate === null || design === null || unnatural === null) {
    throw new Error('the statement does not record the two pages and the three verdicts');
  }
  return {
    place: observed[1],
    observedPage: observed[2],
    observedSubject: observed[3],
    observedOutcome: observed[4],
    assignedPage: assigned[1],
    assignedSubject: assigned[2],
    assignedCount: Number(assigned[3]),
    restCount: Number(assigned[4]),
    measure: assigned[5],
    equate: equate[1],
    equatedLeft: equate[2],
    equatedRight: equate[3],
    design: design[1],
    leakyPage: design[2],
    betterPage: design[3],
    designSubject: design[4],
    unnatural: unnatural[1]
  };
}

function solve(slots) {
  if (slots.observedPage === slots.assignedPage) {
    throw new Error('the watching page and the assigned page must be different pages');
  }
  if (slots.equatedLeft !== slots.observedPage || slots.equatedRight !== slots.assignedPage) {
    throw new Error('the equating verdict must compare the watching page with the assigned page');
  }
  if (slots.leakyPage !== slots.observedPage || slots.betterPage !== slots.assignedPage) {
    throw new Error('the design verdict must name the watching page as leaky and the assigned page as better');
  }
  if (slots.assignedCount <= 0 || slots.restCount <= 0) {
    throw new Error('both compared groups must have a positive listed size');
  }
  return {
    place: slots.place,
    observedPage: slots.observedPage,
    assignedPage: slots.assignedPage,
    assignedCount: slots.assignedCount,
    restCount: slots.restCount,
    subject: slots.assignedSubject
  };
}

function render(solution) {
  return `Page ${solution.assignedPage}, as written. Page ${solution.observedPage} observes choosers. Design, not sincerity, is the difference.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "Page " + slots.assignedPage + ", as written. Page " + slots.observedPage + " observes choosers. Design, not sincerity, is the difference.";'
].join('\n');

function explain(slots, solution) {
  return [
    `Page ${solution.observedPage} in ${slots.place} only watches people who already chose ${slots.observedSubject}, and people who choose a thing may differ in just the ways that matter, so the page lets them sort themselves.`,
    `Page ${solution.assignedPage} is a printed comparison: ${slots.assignedCount} listed people were assigned ${slots.assignedSubject} and ${slots.restCount} the rest-only condition, so the assignment, not the participants’ enthusiasm, carries the comparison.`,
    `Both groups eased at the same listed ${slots.measure}, which undercuts ${slots.assignedSubject} as the difference the causal question asks about, and must be read rather than ignored.`,
    `${slots.unnatural} calls the assignment unnatural, but calling a comparison artificial is not a refutation of it: the question “did ${slots.assignedSubject} do it?” is answered by the page built to compare, so page ${solution.assignedPage} starts first.`
  ];
}

export const unit = 49;

export const cases = [
  {
    template: 'Watching versus assigning',
    type: slugify('Watching versus assigning'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
