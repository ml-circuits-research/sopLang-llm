/**
 * Section 19 of the adult-reasoning course: estimates and order of magnitude.
 *
 * Every variant prints the same organiser sheet and a confirmed list of
 * guests: one loaf per three people rounded up, 200 g of salad per person, one
 * two-litre bottle per four people rounded up, and a 50% reserve only for an
 * uncertain list. The variants change the ward, the confirmed count, and the
 * organiser who wants ten loaves "just in case", so the family derives the
 * three sheet quantities from the count and judges the extra loaves against the
 * reserve rule.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN = /Organiser sheet, ([^:]+):/;
const LOAF_PATTERN = /1 loaf per (\d+) people, rounded up\./;
const SALAD_PATTERN = /(\d+) g salad per person\./;
const BOTTLE_PATTERN = /1 two-litre bottle per (\d+) people, rounded up\./;
const LIST_PATTERN = /Today’s list: (\d+) confirmed, (\w+) uncertain\./;
const ORGANISER_PATTERN = /^([A-Z][a-z]+) wants \+(\d+) loaves/m;

function parse(statement) {
  const sheet = SHEET_PATTERN.exec(statement);
  const loaf = LOAF_PATTERN.exec(statement);
  const salad = SALAD_PATTERN.exec(statement);
  const bottle = BOTTLE_PATTERN.exec(statement);
  const list = LIST_PATTERN.exec(statement);
  const organiser = ORGANISER_PATTERN.exec(statement);
  if (sheet === null || loaf === null || salad === null || bottle === null || list === null || organiser === null) {
    throw new Error('the statement does not describe the organiser sheet and the confirmed list');
  }
  const uncertain = list[2] === 'zero' ? 0 : Number(list[2]);
  if (!Number.isInteger(uncertain)) {
    throw new Error(`the statement does not give the uncertain count as a number or "zero" (read "${list[2]}")`);
  }
  return {
    place: sheet[1],
    people: Number(list[1]),
    uncertain,
    loafRate: Number(loaf[1]),
    saladPerPerson: Number(salad[1]),
    bottleRate: Number(bottle[1]),
    organiser: organiser[1],
    extraLoaves: Number(organiser[2])
  };
}

function solve(slots) {
  if (slots.uncertain !== 0) {
    // The sheet ties the printed reserve verdict to a certain list; a variant
    // whose list is uncertain prints a different clause, so this family cannot
    // derive its answer from the statement it was given.
    throw new Error('the list carries uncertain guests, so the reserve rule prints a clause this family does not reproduce');
  }
  return {
    place: slots.place,
    organiser: slots.organiser,
    people: slots.people,
    extraLoaves: slots.extraLoaves,
    loaves: Math.ceil(slots.people / slots.loafRate),
    salad: slots.people * slots.saladPerPerson,
    bottles: Math.ceil(slots.people / slots.bottleRate)
  };
}

function render(solution) {
  return `Loaves ${solution.loaves}, salad ${solution.salad} g, bottles ${solution.bottles}. +${solution.extraLoaves} breaks the rule: the list is certain.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const loaves = Math.ceil(slots.people / slots.loafRate);',
  'const salad = slots.people * slots.saladPerPerson;',
  'const bottles = Math.ceil(slots.people / slots.bottleRate);',
  'probe(loaves * slots.loafRate >= slots.people && (loaves - 1) * slots.loafRate < slots.people, "the loaves must be the rounded-up quotient");',
  'probe(bottles * slots.bottleRate >= slots.people && (bottles - 1) * slots.bottleRate < slots.people, "the bottles must be the rounded-up quotient");',
  'return "Loaves " + loaves + ", salad " + salad + " g, bottles " + bottles + ". +" + slots.extraLoaves + " breaks the rule: the list is certain.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The sheet starts from the confirmed count of ${solution.people} people in ${solution.place}, and the salad line is the one that does not round: 200 g per person gives ${solution.salad} g.`,
    `Bread and drink are rounded up to whole units, so ${solution.people} people take ${solution.loaves} loaves at one loaf per three and ${solution.bottles} bottles at one bottle per four.`,
    `The 50% reserve belongs to an uncertain list, and today's list is certain, so the ${solution.extraLoaves} extra loaves ${solution.organiser} wants just in case break the rule instead of extending it.`
  ];
}

export const unit = 19;

export const cases = [
  {
    template: 'Estimates and order of magnitude',
    type: slugify('Estimates and order of magnitude'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
