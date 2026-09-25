/**
 * Section 44 of the adult-reasoning course: a summarised insurance policy.
 *
 * Every variant prints the same closed policy — the covered perils, the
 * exclusions, the excess taken from each covered loss, and the notice window —
 * and then one claim: a theft with a smashed window, notified in time, plus an
 * undeclared object that was taken in the same theft. The verdict applies the
 * policy literally: forced entry is on the covered list, so the loss is paid
 * minus the excess, and the object falls on its own exclusion because it was
 * never declared and its value is over the printed threshold. The cases change
 * the name, the place, the excess, and the loss, so the family derives the
 * payment and the exclusion clause from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const POLICY_PATTERN = /Home policy of ([A-Z][a-z]+), ([^:]+): covers ([^.]+)\. Not: ([^.]+)\./;
const EXCESS_PATTERN = /losses under an excess of (\d+)/;
const DECLARED_PATTERN = /undeclared objects over (\d+)/;
const NOTICE_PATTERN = /Notice within (\d+) h\./;
const CLAIM_PATTERN = /Theft with a smashed window, loss (\d+), notice in (\d+) h\./;
const OBJECT_PATTERN = /An (undeclared )?([a-z]+) worth (\d+) is missing\./;

/** The payout expression the policy prints: the loss split around the excess. */
function payoutClause(label, loss, excess) {
  const paid = loss - excess;
  return `${label}: (${excess}+${paid})−${excess}=${paid}.`;
}

function parse(statement) {
  const policy = POLICY_PATTERN.exec(statement);
  const excess = EXCESS_PATTERN.exec(statement);
  const threshold = DECLARED_PATTERN.exec(statement);
  const notice = NOTICE_PATTERN.exec(statement);
  const claim = CLAIM_PATTERN.exec(statement);
  const object = OBJECT_PATTERN.exec(statement);
  if (policy === null || excess === null || threshold === null || notice === null || claim === null || object === null) {
    throw new Error('the statement does not print the policy, the claim, and the undeclared object');
  }
  return {
    holder: policy[1],
    place: policy[2],
    coveredPerils: policy[3].split(', '),
    exclusions: policy[4].split('; '),
    excess: Number(excess[1]),
    undeclaredLimit: Number(threshold[1]),
    noticeWindow: Number(notice[1]),
    loss: Number(claim[1]),
    noticeHours: Number(claim[2]),
    objectDeclared: object[1] === undefined,
    objectKind: object[2],
    objectValue: Number(object[3])
  };
}

function solve(slots) {
  const forcedEntryCovered = slots.coveredPerils.includes('theft with forced entry');
  if (!forcedEntryCovered) {
    throw new Error('the policy does not cover theft with forced entry');
  }
  if (!(slots.loss > slots.excess)) {
    throw new Error('the covered loss does not exceed the excess, so the excess is not taken first');
  }
  const noticeInTime = slots.noticeHours <= slots.noticeWindow;
  const theftClause = noticeInTime
    ? payoutClause('Forced entry is covered', slots.loss, slots.excess)
    : `The ${slots.noticeHours} h notice is late for the ${slots.noticeWindow} h window.`;
  const objectExcluded = !slots.objectDeclared && slots.objectValue > slots.undeclaredLimit;
  const objectClause = objectExcluded
    ? `The ${slots.objectKind} is excluded (undeclared and >${slots.undeclaredLimit}).`
    : slots.objectDeclared
      ? payoutClause(`The declared ${slots.objectKind} is covered`, slots.objectValue, slots.excess)
      : payoutClause(`The ${slots.objectKind} is inside the undeclared limit`, slots.objectValue, slots.excess);
  return { theftClause, objectClause, noticeInTime, objectExcluded };
}

function render(solution) {
  return `${solution.theftClause} ${solution.objectClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const paid = slots.loss - slots.excess;',
  'const theftClause = "Forced entry is covered: (" + slots.excess + "+" + paid + ")−" + slots.excess + "=" + paid + ".";',
  'const objectExcluded = !slots.objectDeclared && slots.objectValue > slots.undeclaredLimit;',
  'const objectClause = objectExcluded',
  '  ? "The " + slots.objectKind + " is excluded (undeclared and >" + slots.undeclaredLimit + ")."',
  '  : "The " + slots.objectKind + " is paid after the same excess.";',
  'return theftClause + " " + objectClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The policy covers fire, theft with forced entry, and water from pipes, so the smashed window puts the theft on the covered side of the list; the notice of ${slots.noticeHours} h is inside the printed ${slots.noticeWindow} h window.`,
    `The excess is taken from each covered loss, so of the ${slots.loss} claimed the insurer keeps the first ${slots.excess} and pays the remaining ${slots.loss - slots.excess}.`,
    `${slots.holder} never declared the ${slots.objectKind}, and its value of ${slots.objectValue} is over the printed limit of ${slots.undeclaredLimit}, so the object falls on the separate exclusion even though it was taken in the same theft.`
  ];
}

export const unit = 44;

export const cases = [
  {
    template: 'A summarised insurance policy',
    type: slugify('A summarised insurance policy'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
