/**
 * Section 80 of the logical-reasoning book: who owed the first reason.
 *
 * Every case has one person pin an unsupported claim on a named board and
 * answer the request for a reason by asking the room to prove the opposite. A
 * second person says the assertor owed the first reason and a third treats the
 * room's silence as evidence. The case data changes the assertor, the place,
 * and the claim; the reasoning is fixed, so the printed verdict names the
 * assertor and restates the burden of proof.
 *
 * The family reads the assertor, the place, and the claim, then renders the
 * printed verdict with the assertor's name.
 */

import { slugify } from '../../naming.mjs';

const BURDEN_PATTERN =
  /([A-Za-z]+) pins a claim on the ([A-Za-z ]+) board: “([^”]+)” No reason is listed\. When asked, ([A-Za-z]+) says “prove it is safe, or stay quiet\.” ([A-Za-z]+) says the person who asserted owed the first reason\. ([A-Za-z]+) says silence from others is already evidence\./;

function parse(statement) {
  const burden = BURDEN_PATTERN.exec(statement);
  if (burden === null) {
    throw new Error('the statement does not record the pinned claim and its three speakers');
  }
  if (burden[1] !== burden[4]) {
    throw new Error('the person asked for a reason must be the person who pinned the claim');
  }
  return {
    assertor: burden[1],
    place: burden[2].trim(),
    claim: burden[3].trim(),
    reporter: burden[5],
    silence: burden[6]
  };
}

function solve(slots) {
  if (slots.assertor === slots.reporter || slots.assertor === slots.silence || slots.reporter === slots.silence) {
    throw new Error('the case needs three different speakers');
  }
  if (slots.claim.length === 0) {
    throw new Error('the pinned claim must not be empty');
  }
  return {
    assertor: slots.assertor,
    place: slots.place,
    claim: slots.claim
  };
}

function render(solution) {
  return `${solution.assertor}, the assertor. Shifting the burden asks the room to disprove an unsupported claim. Silence is not a premise.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const assertor = slots.assertor;',
  'return assertor + ", the assertor. Shifting the burden asks the room to disprove an unsupported claim. Silence is not a premise.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${solution.assertor} pinned the claim “${solution.claim}” on the ${solution.place} board with no reason listed, so the claim entered the room bare.`,
    `${solution.assertor} then answered the request for a reason with “prove it is safe,” which asks the room to disprove an unsupported claim instead of supplying one.`,
    `${solution.reporter} states the rule correctly: the person who asserted owed the first reason, and ${solution.assertor} is that person.`,
    `${solution.silence} is wrong that silence from others is already evidence; silence is not a premise.`
  ];
}

export const unit = 80;

export const cases = [
  {
    template: 'Who owed the first reason',
    type: slugify('Who owed the first reason'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
