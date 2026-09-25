/**
 * Section 46 of the adult-reasoning course: internal rules and sanctions.
 *
 * Every variant prints the same shop rules — the phone kept in the locker with
 * a family-emergency exception, the sanction ladder in order for the SAME act,
 * the clause that a different type of act may restart the ladder, and the
 * smoking rule — and then one day: the employee already carries one rung for
 * the phone and now commits a second phone fault next to a smoking breach. The
 * verdict keeps the two acts on separate lines: the phone climbs one rung from
 * the printed sanction, the smoking is a different type of act and so starts
 * again at rung 1, and the last rung of the ladder is out of reach for the
 * phone. The cases change the place, the person, and the printed sanction, so
 * the family derives the rungs from the parsed ladder.
 */

import { slugify } from '../../naming.mjs';

const LADDER_PATTERN = /Sanctions in order for the SAME act: ([^.]+)\./;
const PRIOR_PATTERN = /([A-Z][a-z]+) has a ([a-z ]+?) for the ([a-z]+)\./;
const RESTART_PATTERN = /A different type of act may restart the ladder\./;
const OTHER_ACT_PATTERN = /([A-Z][a-z]+) only in the back yard\./;
const CONDUCT_PATTERN = /Today ([a-z]+) in front and answers a call without announcing\./;

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function parse(statement) {
  const ladder = LADDER_PATTERN.exec(statement);
  const prior = PRIOR_PATTERN.exec(statement);
  const otherAct = OTHER_ACT_PATTERN.exec(statement);
  const conduct = CONDUCT_PATTERN.exec(statement);
  if (ladder === null || prior === null || otherAct === null || conduct === null || !RESTART_PATTERN.test(statement)) {
    throw new Error('the statement does not print the ladder, the prior sanction, and the day’s conduct');
  }
  const slots = {
    rungs: ladder[1].split(', '),
    person: prior[1],
    priorSanction: prior[2],
    priorAct: prior[3],
    otherAct: otherAct[1],
    conductVerb: conduct[1]
  };
  const priorIndex = slots.rungs.indexOf(slots.priorSanction);
  if (priorIndex === -1) {
    throw new Error(`the printed sanction "${slots.priorSanction}" is not one of the ladder rungs`);
  }
  if (priorIndex + 1 >= slots.rungs.length) {
    throw new Error('the prior sanction is already the last rung, so the ladder has nowhere to climb');
  }
  if (slots.otherAct.toLowerCase().slice(0, 4) !== slots.conductVerb.slice(0, 4)) {
    throw new Error('the conduct of the day must be the act the rules class as the other type');
  }
  if (capitalize(slots.priorAct) === slots.otherAct) {
    throw new Error('the two acts must be of different types for the ladder to restart');
  }
  return slots;
}

function solve(slots) {
  const priorIndex = slots.rungs.indexOf(slots.priorSanction);
  const nextIndex = priorIndex + 1;
  const lastRung = slots.rungs[slots.rungs.length - 1];
  const lastRungWord = lastRung.split(' ')[0];
  return {
    sameActClause: `${capitalize(slots.priorAct)}: same act → rung ${nextIndex + 1} (${slots.rungs[nextIndex]}).`,
    otherActClause: `${slots.otherAct}: other type → rung 1 possible.`,
    warningClause: `Do not jump to the ${lastRungWord} for the ${slots.priorAct}.`
  };
}

function render(solution) {
  return `${solution.sameActClause} ${solution.otherActClause} ${solution.warningClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const priorIndex = slots.rungs.indexOf(slots.priorSanction);',
  'const nextIndex = priorIndex + 1;',
  'const lastRungWord = slots.rungs[slots.rungs.length - 1].split(" ")[0];',
  'const sameActClause = slots.priorAct.charAt(0).toUpperCase() + slots.priorAct.slice(1) + ": same act → rung " + (nextIndex + 1) + " (" + slots.rungs[nextIndex] + ").";',
  'const otherActClause = slots.otherAct + ": other type → rung 1 possible.";',
  'const warningClause = "Do not jump to the " + lastRungWord + " for the " + slots.priorAct + ".";',
  'return sameActClause + " " + otherActClause + " " + warningClause;'
].join('\n');

function explain(slots, solution) {
  const nextIndex = slots.rungs.indexOf(slots.priorSanction) + 1;
  return [
    `${slots.person} already carries the ${slots.priorSanction} for the ${slots.priorAct}, so the second fault of the same act lands on the next rung of the printed ladder, rung ${nextIndex + 1}, ${slots.rungs[nextIndex]}.`,
    `The smoking is a different type of act, and the rules let such an act restart the ladder, so rung 1 is possible for it instead of a rung carried over from the phone.`,
    `The ladder is per act, not per bad day: the two lines stay separate and the ${slots.rungs[slots.rungs.length - 1]} sits two rungs above the phone, so the phone cannot jump to it.`
  ];
}

export const unit = 46;

export const cases = [
  {
    template: 'Internal rules and sanctions',
    type: slugify('Internal rules and sanctions'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
