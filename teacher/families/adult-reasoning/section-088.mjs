/**
 * Section 88 of the adult-reasoning course: a written norm versus a habit.
 *
 * Every variant states a canteen rule of a named place, describing where trays
 * go, then records an old practice that is explicitly described and not a rule,
 * and finally shows one person following the practice while appealing to its age.
 * The family reads the written norm, the described habit, and the practice the
 * person repeats, and renders the written norm as the one that applies.
 */

import { slugify } from '../../naming.mjs';

const RULE_PATTERN = /Canteen rule, ([^:]+): trays at ([^.]+)\./;
const HABIT_PATTERN = /Old habit \(described, not a rule\): trays on the ([a-z]+), a worker collects them\./;
const ACTOR_PATTERN = /([A-Z][a-z]+) leaves the tray on the ([a-z]+): “that’s how it’s been done for years”\./;

function parse(statement) {
  const rule = RULE_PATTERN.exec(statement);
  const habit = HABIT_PATTERN.exec(statement);
  const actor = ACTOR_PATTERN.exec(statement);
  if (rule === null || habit === null || actor === null) {
    throw new Error('the statement does not state the canteen rule, the old habit, and the person following it');
  }
  return {
    place: rule[1],
    norm: rule[2],
    habitSurface: habit[1],
    workerCollects: true,
    person: actor[1],
    usedSurface: actor[2]
  };
}

function solve(slots) {
  if (slots.usedSurface !== slots.habitSurface) {
    throw new Error('the person does not repeat the described habit');
  }
  return {
    normLabel: slots.norm.charAt(0).toUpperCase() + slots.norm.slice(1),
    ruling: 'The habit is recognised as a habit, not as authorisation.'
  };
}

function render(solution) {
  return `${solution.normLabel}. ${solution.ruling}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the canteen rule");',
  'probe(typeof slots.norm === "string" && slots.norm.length > 0, "the rule must name where the trays go");',
  'probe(typeof slots.person === "string" && slots.person.length > 0, "the case must name the person leaving the tray");',
  'probe(slots.habitSurface === slots.usedSurface, "the person must repeat the surface the habit describes");',
  'probe(slots.workerCollects === true, "the habit must be the practice of a worker collecting the trays");',
  'const normLabel = slots.norm.charAt(0).toUpperCase() + slots.norm.slice(1);',
  'return normLabel + ". The habit is recognised as a habit, not as authorisation.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The canteen rule of ${slots.place} is written down: trays go at ${slots.norm}.`,
    `${slots.person} leaves the tray on the ${slots.usedSurface}, which is only the old practice the statement describes and labels as not a rule.`,
    `Age is not authorisation, so the written norm ${solution.normLabel} is the one that applies, and the habit is recorded only as a habit.`
  ];
}

export const unit = 88;

export const cases = [
  {
    template: 'A written norm versus a habit',
    type: slugify('A written norm versus a habit'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
