/**
 * Section 41 of the adult-reasoning course: a voting procedure from a
 * rulebook.
 *
 * Every variant quotes the same internal-election rules for an association in
 * some place: a member needs at least thirty days and dues paid by the eve, the
 * vote is secret on a stamped paper, one member is one vote, no proxies, the
 * most valid votes win, two stamps or none is void, and at least twenty members
 * must be present or the round is reconvened. The ballot box then holds
 * nineteen valid members, a member a few days short of the threshold with dues
 * paid, a paper with two stamps, and a vote sent by phone from abroad. The
 * verdict sieves each item through the rule it fails; the cases change the
 * place, the names, the days, and the presence count.
 */

import { slugify } from '../../naming.mjs';

const PLACE_PATTERN = /Internal election, association in ([^:]+):/;
const MEMBERSHIP_PATTERN = /member ≥(\d+) days \+ dues paid by the eve/;
const PRESENCE_PATTERN = /Minimum presence (\d+) members, else reconvene\./;
const BOX_PATTERN =
  /Box: (\d+) valid members present \+ ([A-Z][a-z]+) a member for (\d+) days with (dues paid|dues unpaid)\./;

function parse(statement) {
  const place = PLACE_PATTERN.exec(statement);
  const membership = MEMBERSHIP_PATTERN.exec(statement);
  const presence = PRESENCE_PATTERN.exec(statement);
  const box = BOX_PATTERN.exec(statement);
  if (place === null || membership === null || presence === null || box === null) {
    throw new Error('the statement does not carry the rules, the presence floor, and the ballot box');
  }
  if (!/Secret vote on a stamped paper\./.test(statement) || !/No proxies\./.test(statement)) {
    throw new Error('the rules do not state the stamped paper and the ban on proxies');
  }
  return {
    place: place[1].trim(),
    thresholdDays: Number(membership[1]),
    minimumPresence: Number(presence[1]),
    presentCount: Number(box[1]),
    name: box[2],
    memberDays: Number(box[3]),
    duesPaid: box[4] === 'dues paid',
    doublePaper: /One paper with two stamps\./.test(statement),
    phoneVote: /One vote by phone from abroad\./.test(statement)
  };
}

function solve(slots) {
  if (!slots.duesPaid) {
    throw new Error('the box member owes the dues, so the printed membership clause does not apply');
  }
  if (slots.memberDays >= slots.thresholdDays) {
    throw new Error('the box member already meets the membership threshold, so the printed clause does not apply');
  }
  if (slots.presentCount >= slots.minimumPresence) {
    throw new Error('the round reaches the presence floor, so the printed reconvening clause does not apply');
  }
  return {
    membershipClause: `${slots.name} has ${slots.memberDays}<${slots.thresholdDays} → does not vote.`,
    phoneClause: 'The phone is not a paper.',
    presenceClause: `${slots.presentCount}<${slots.minimumPresence} → reconvene.`,
    paperClause: 'The double paper is void, but the round already falls on presence.'
  };
}

function render(solution) {
  return `${solution.membershipClause} ${solution.phoneClause} ${solution.presenceClause} ${solution.paperClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots === "object" && slots !== null, "the election case must carry its parsed values");',
  'probe(typeof slots.name === "string" && slots.name.length > 0, "the box member must be named");',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the association must sit in a named place");',
  'probe(Number.isInteger(slots.thresholdDays) && slots.thresholdDays > 0, "the membership threshold must be a positive whole number of days");',
  'probe(Number.isInteger(slots.minimumPresence) && slots.minimumPresence > 0, "the presence floor must be a positive whole number of members");',
  'probe(Number.isInteger(slots.presentCount) && slots.presentCount >= 0, "the valid members present must be a whole number");',
  'probe(Number.isInteger(slots.memberDays) && slots.memberDays >= 0, "the days of membership must be a whole number");',
  'probe(slots.duesPaid === true, "the box member must have the dues paid for this answer");',
  'probe(slots.memberDays < slots.thresholdDays, "the box member must fall short of the membership threshold");',
  'probe(slots.presentCount < slots.minimumPresence, "the round must fall short of the presence floor");',
  'probe(slots.doublePaper === true && slots.phoneVote === true, "the box must hold the double paper and the phone vote");',
  'const membershipClause = slots.name + " has " + slots.memberDays + "<" + slots.thresholdDays + " → does not vote.";',
  'const phoneClause = "The phone is not a paper.";',
  'const presenceClause = slots.presentCount + "<" + slots.minimumPresence + " → reconvene.";',
  'const paperClause = "The double paper is void, but the round already falls on presence.";',
  'return membershipClause + " " + phoneClause + " " + presenceClause + " " + paperClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.name} has been a member for ${slots.memberDays} days, which is below the ${slots.thresholdDays} the rulebook requires, so ${slots.name} is not a valid voter even though the dues are paid.`,
    'The vote sent by phone is not a secret vote on a stamped paper, so it cannot enter the count.',
    `Only ${slots.presentCount} valid members are present, below the floor of ${slots.minimumPresence}, and the rulebook reconvenes the round in ${slots.place} on that ground alone.`,
    'The paper with two stamps is void under the same rulebook, but the presence shortfall already decides the round.'
  ];
}

export const unit = 41;

export const cases = [
  {
    template: 'A voting procedure from a rulebook',
    type: slugify('A voting procedure from a rulebook'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
