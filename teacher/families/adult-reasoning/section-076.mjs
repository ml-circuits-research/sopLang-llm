/**
 * Section 76 of the adult-reasoning course: messages that demand hurried action.
 *
 * Every variant prints an email that claims to come from the administrator,
 * sets a deadline of a few minutes, asks for the password and a card, demands
 * secrecy, and offers a link, followed by the internal guide: an administrator
 * never asks for the password, urgency under thirty minutes together with
 * secrecy is a sign of a false message, and the check is done on a site typed
 * by hand rather than on a link. The verdict follows the guide instead of the
 * email and counts the signs it lists. The variants change the recipient’s
 * name and the deadline, so the family derives each clause from the parsed
 * message and guide.
 */

import { slugify } from '../../naming.mjs';

const EMAIL_PATTERN =
  /Email to ([A-Z][a-z]+): “I am the administrator\. The account closes in (\d+) minutes\. Send the password and a card\. Tell no one\. Link ([^\s”]+)\./;
const GUIDE_PATTERN =
  /Internal guide: “An administrator does not ask for the password\. Urgency under (\d+) min \+ secrecy = a sign of a false message\. Check on a site typed by hand, not on a link\.”/;

function parse(statement) {
  const email = EMAIL_PATTERN.exec(statement);
  const guide = GUIDE_PATTERN.exec(statement);
  if (email === null || guide === null) {
    throw new Error('the statement does not describe the urgent message and the internal guide');
  }
  return {
    name: email[1],
    minutes: Number(email[2]),
    asksPassword: /Send the password and a card/.test(statement),
    demandsSecrecy: /Tell no one/.test(statement),
    link: email[3],
    urgencyMinutes: Number(guide[1]),
    checkTypedByHand: /Check on a site typed by hand, not on a link/.test(statement)
  };
}

function solve(slots) {
  if (!Number.isInteger(slots.minutes) || slots.minutes <= 0) {
    throw new Error('the message must give a positive whole number of minutes before the account closes');
  }
  if (!slots.checkTypedByHand) {
    throw new Error('the guide does not say to check on a site typed by hand');
  }
  const signs = [];
  if (slots.asksPassword) {
    signs.push('the password request');
  }
  if (slots.minutes < slots.urgencyMinutes) {
    signs.push('the urgency');
  }
  if (slots.demandsSecrecy) {
    signs.push('the secrecy');
  }
  if (signs.length === 0) {
    throw new Error('the message shows none of the signs the guide lists');
  }
  const actionClause = 'Do not send password/card, do not click.';
  const checkClause = 'Type the known address or ignore.';
  const summary =
    signs.length === 3
      ? 'Every sign on the guide is present.'
      : `Only ${signs.length} of the 3 signs are present.`;
  return { actionClause, checkClause, summary };
}

function render(solution) {
  return `${solution.actionClause} ${solution.checkClause} ${solution.summary}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const signs = [];',
  'if (slots.asksPassword) { signs.push("the password request"); }',
  'if (slots.minutes < slots.urgencyMinutes) { signs.push("the urgency"); }',
  'if (slots.demandsSecrecy) { signs.push("the secrecy"); }',
  'probe(signs.length > 0, "the message must show at least one sign from the guide");',
  'const actionClause = "Do not send password/card, do not click.";',
  'const checkClause = "Type the known address or ignore.";',
  'const summary = signs.length === 3',
  '  ? "Every sign on the guide is present."',
  '  : "Only " + signs.length + " of the 3 signs are present.";',
  'return actionClause + " " + checkClause + " " + summary;'
].join('\n');

function explain(slots) {
  return [
    `The message presses ${slots.name} with a deadline of ${slots.minutes} minutes, which is inside the guide’s ${slots.urgencyMinutes}-minute window for manufactured urgency.`,
    'It asks for the password and a card, which the guide says an administrator never does, and it adds secrecy with “Tell no one”.',
    `The offered link ${slots.link} is exactly the kind of address the guide refuses, so the check belongs on the known address typed by hand.`,
    'Following the guide means sending nothing, clicking nothing, and ignoring the message or verifying it through the typed address.'
  ];
}

export const unit = 76;

export const cases = [
  {
    template: 'Messages that demand hurried action',
    type: slugify('Messages that demand hurried action'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
