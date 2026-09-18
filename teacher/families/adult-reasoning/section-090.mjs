/**
 * Section 90 of the adult-reasoning course: cooperation, roles, and blockages.
 *
 * Every variant needs two people to move one table and shows only one of them
 * lifting an end while the other is on the phone in the yard for a stated time.
 * The door is too narrow for one person carrying the table, and dragging it on
 * the floor is forbidden. The family reads the two people, the phone time, and
 * the two prohibitions, and renders why the lift cannot finish now.
 */

import { slugify } from '../../naming.mjs';

const ROLE_PATTERN = /The table is moved only with two people\. ([A-Z][a-z]+) lifts one end\./;
const PHONE_PATTERN = /([A-Z][a-z]+) is on the phone in the yard for (\d+) minutes\./;
const DOOR_PATTERN = /The door is too narrow for one person with the table\./;
const FLOOR_PATTERN = /Forbidden to drag the table on the floor\./;

function parse(statement) {
  const role = ROLE_PATTERN.exec(statement);
  const phone = PHONE_PATTERN.exec(statement);
  if (role === null || phone === null || !DOOR_PATTERN.test(statement) || !FLOOR_PATTERN.test(statement)) {
    throw new Error('the statement does not record the two-person rule, the phone, the narrow door, and the floor prohibition');
  }
  return {
    lifter: role[1],
    requiredPeople: 2,
    presentPeople: 1,
    blocker: phone[1],
    phoneMinutes: Number(phone[2]),
    doorNarrow: true,
    dragForbidden: true
  };
}

function solve(slots) {
  if (slots.presentPeople >= slots.requiredPeople) {
    throw new Error('the statement does not leave the second person missing');
  }
  return {
    verdict: 'No.',
    missing: 'The second person is missing.',
    path: slots.dragForbidden ? 'The floor is not an allowed path.' : 'The floor is an allowed path.',
    resource: slots.phoneMinutes > 0 ? `${slots.blocker}’s phone holds the resource.` : `${slots.blocker} is free.`
  };
}

function render(solution) {
  return `${solution.verdict} ${solution.missing} ${solution.path} ${solution.resource}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.lifter === "string" && slots.lifter.length > 0, "the case must name the person lifting one end");',
  'probe(typeof slots.blocker === "string" && slots.blocker.length > 0, "the case must name the person on the phone");',
  'probe(slots.lifter !== slots.blocker, "the lifting person and the blocked person must be different");',
  'probe(slots.requiredPeople === 2 && slots.presentPeople === 1, "moving the table must need two people with only one present");',
  'probe(Number.isInteger(slots.phoneMinutes) && slots.phoneMinutes > 0, "the phone time must be a positive whole number of minutes");',
  'probe(slots.doorNarrow === true && slots.dragForbidden === true, "the door and floor prohibitions must both hold");',
  'return "No. The second person is missing. The floor is not an allowed path. " + slots.blocker + "\\u2019s phone holds the resource.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The table moves only with two people, and only ${slots.lifter} is lifting an end, so ${solution.missing.toLowerCase()}`,
    `The narrow door rules out ${slots.lifter} carrying the table alone, and dragging it on the floor is forbidden, so no single-person route remains.`,
    `${slots.blocker} is on the phone in the yard for ${slots.phoneMinutes} minutes, so the second pair of hands is held by the call rather than by the door.`
  ];
}

export const unit = 90;

export const cases = [
  {
    template: 'Cooperation, roles, and blockages',
    type: slugify('Cooperation, roles, and blockages'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
