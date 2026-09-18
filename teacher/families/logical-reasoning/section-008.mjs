/**
 * Section 8 of the logical-reasoning book: exhaustive cases.
 *
 * Every case closes a list of three tags, rules out two of them for the item
 * on the counter, and records three speakers: one who names the remaining tag,
 * one who proposes an unlisted colour, and one who doubts that two negatives
 * force a third. The case data changes the place, the names, and the tags; the
 * reasoning is fixed: exhaustion is what turns the two negatives into a
 * positive, and a colour that is not on the list has no premise behind it. The
 * family reads the list and the two negatives, derives the remainder, and
 * renders the printed verdict with the claimant of that remainder.
 */

import { slugify } from '../../naming.mjs';

const LIST_PATTERN = /“A found item is tagged (.+?)\. No other tag exists/;
const RULED_OUT_PATTERN = /The item on the counter is not ([a-z]+) and not ([a-z]+)\./;
const CLAIM_PATTERN = /([A-Z][a-z]+) says it is ([a-z]+)\./;
const PROPOSAL_PATTERN = /([A-Z][a-z]+) says it might be ([a-z]+) because/;
const OBJECTION_PATTERN = /([A-Z][a-z]+) says two negatives never force a third\./;

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function parse(statement) {
  const list = LIST_PATTERN.exec(statement);
  const ruledOut = RULED_OUT_PATTERN.exec(statement);
  const claim = CLAIM_PATTERN.exec(statement);
  const proposal = PROPOSAL_PATTERN.exec(statement);
  const objection = OBJECTION_PATTERN.exec(statement);
  if (list === null || ruledOut === null || claim === null || proposal === null || objection === null) {
    throw new Error('the statement does not record the closed list, the two negatives, and the three speakers');
  }
  return {
    tags: list[1]
      .split(/\s*,\s*/)
      .map((tag) => tag.replace(/^or\s+/i, '').toLowerCase()),
    ruledOut: [ruledOut[1], ruledOut[2]],
    claimant: claim[1],
    claimed: claim[2],
    proposer: proposal[1],
    proposed: proposal[2],
    objector: objection[1]
  };
}

function solve(slots) {
  const { tags, ruledOut } = slots;
  if (tags.length !== 3 || new Set(tags).size !== tags.length) {
    throw new Error('the closed list must carry three distinct tags');
  }
  if (ruledOut.length !== 2 || new Set(ruledOut).size !== ruledOut.length) {
    throw new Error('the case must rule out two distinct tags');
  }
  for (const tag of ruledOut) {
    if (!tags.includes(tag)) {
      throw new Error(`the case rules out "${tag}", which is not on the closed list`);
    }
  }
  const remaining = tags.filter((tag) => !ruledOut.includes(tag));
  if (remaining.length !== 1) {
    throw new Error('the two negatives and the closed list must leave exactly one tag');
  }
  if (slots.claimed !== remaining[0]) {
    throw new Error('the claimant must name the tag the two negatives leave');
  }
  if (tags.includes(slots.proposed)) {
    throw new Error('the proposed colour must be unlisted, since the list admits no other tag');
  }
  if (slots.claimant === slots.proposer || slots.objector === slots.claimant || slots.objector === slots.proposer) {
    throw new Error('the claimant, the proposer, and the objector must be three different people');
  }
  return {
    claimant: slots.claimant,
    proposed: slots.proposed,
    remaining: remaining[0],
    ruledOut
  };
}

function render(solution) {
  return `${solution.claimant} is forced. Two tags are ruled out; the third remains. ${capitalize(solution.proposed)} is unlisted. Two negatives force the remainder only because the list was exhaustive.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.tags) && slots.tags.length === 3, "the case must post a closed list of three tags");',
  'probe(Array.isArray(slots.ruledOut) && slots.ruledOut.length === 2, "the case must rule out exactly two tags");',
  'probe(new Set(slots.tags).size === slots.tags.length, "the closed list holds distinct tags");',
  'probe(slots.ruledOut.every((tag) => slots.tags.indexOf(tag) !== -1), "both negatives must strike tags of the closed list");',
  'const remaining = slots.tags.filter((tag) => slots.ruledOut.indexOf(tag) === -1);',
  'probe(remaining.length === 1, "two negatives over a three-tag list leave exactly one tag");',
  'probe(slots.claimed === remaining[0], "the claimant must name the tag the two negatives leave");',
  'probe(slots.tags.indexOf(slots.proposed) === -1, "the proposed colour must not be a member of the closed list");',
  'const named = slots.proposed.charAt(0).toUpperCase() + slots.proposed.slice(1);',
  'return slots.claimant + " is forced. Two tags are ruled out; the third remains. " + named + " is unlisted. Two negatives force the remainder only because the list was exhaustive.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The desk list admits exactly three tags — ${slots.tags.join(', ')} — and states that no other tag exists.`,
    `The item on the counter is not ${solution.ruledOut[0]} and not ${solution.ruledOut[1]}, so striking those two leaves ${solution.remaining}, which is what ${solution.claimant} names.`,
    `${slots.proposer} proposes ${solution.proposed}, which is not on the list, so it comes from another document rather than from this list.`,
    `Two negatives force the remainder here only because the list was exhaustive; ${slots.objector} is right that two negatives never force a third on an open list.`
  ];
}

export const unit = 8;

export const cases = [
  {
    template: 'Exhaustive cases',
    type: slugify('Exhaustive cases'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
