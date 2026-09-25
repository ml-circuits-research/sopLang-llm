/**
 * Section 59 of the logical-reasoning book: when two stories still fit.
 *
 * Every case reports a damp wall, two listed stories that both fit it — a
 * leaking roof tile above and rising damp from a cracked plinth — and a page
 * that says no further sign separates them. Three reactions follow: declare the
 * dramatic story guilty, hold the tie and name a next look, or call
 * explanations useless. The place and the three names change with the case; the
 * honest state does not: the list is a tie on present signs, drama does not
 * break a tie, and the method now says what to measure next.
 */

import { slugify } from '../../naming.mjs';

const WALL_PATTERN =
  /^A wall in ([A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)*) is damp\. Two listed stories still fit: a leaking roof tile above, or rising damp from a listed cracked plinth\. No further sign yet separates them\. ([A-Z][a-z]+) declares the tile guilty because roofs are more dramatic\. ([A-Z][a-z]+) says both still fit and names a next look that could separate them\. ([A-Z][a-z]+) says if two fit, explanations are useless\.\n\nQuestion\. What is the honest state of the list\?$/;

const RIVALS = Object.freeze(['a leaking roof tile above', 'rising damp from a listed cracked plinth']);

function parse(statement) {
  const wall = WALL_PATTERN.exec(statement);
  if (wall === null) {
    throw new Error('the statement does not record the damp wall, the two fitting stories, and the three reactions');
  }
  return {
    place: wall[1],
    drama: wall[2],
    tieHolder: wall[3],
    dismisser: wall[4]
  };
}

function solve(slots) {
  const people = [slots.drama, slots.tieHolder, slots.dismisser];
  if (new Set(people).size !== people.length) {
    throw new Error('the three reactions must come from three different people');
  }
  if (RIVALS.length !== 2) {
    throw new Error('the section fits exactly two listed stories to one damp wall');
  }
  return {
    place: slots.place,
    rivals: [...RIVALS],
    drama: people[0],
    tieHolder: people[1],
    dismisser: people[2]
  };
}

function render() {
  return 'A tie on present signs. Drama does not break a tie. A method that leaves a tie has told you what to measure next.';
}

const COMPUTE = [
  'const slots = $slots;',
  'const people = [slots.drama, slots.tieHolder, slots.dismisser];',
  'const rivals = ["a leaking roof tile above", "rising damp from a listed cracked plinth"];',
  'return "A tie on present signs. Drama does not break a tie. A method that leaves a tie has told you what to measure next.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The wall in ${solution.place} is damp, and both listed stories — ${solution.rivals[0]}, and ${solution.rivals[1]} — still fit the sign the page reports.`,
    `${solution.drama} breaks the tie by declaring the more dramatic story guilty, but taste is not evidence.`,
    `${solution.tieHolder} keeps the tie and names the next look that could separate the two stories, which is what a tie asks for.`,
    `${solution.dismisser} reads the tie as uselessness, yet a method that ends in a draw has told you exactly what to measure next.`
  ];
}

export const unit = 59;

export const cases = [
  {
    template: 'When two stories still fit',
    type: slugify('When two stories still fit'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
