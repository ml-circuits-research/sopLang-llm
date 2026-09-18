/**
 * Family C3 of the world seed book: voting, majority, and quorum.
 *
 * Every problem states a committee of `members`, how many are `present`, and
 * the recorded yes, no, and abstain counts. Two thresholds decide the outcome.
 * The quorum threshold is a stated share of all members (60% in every printed
 * variant), compared against the number present; abstentions count for presence
 * but never as no votes. Only when quorum exists does the second test run, where
 * the motion passes when yes is strictly greater than no. The family prints the
 * combined verdict of the two tests.
 *
 * The four grades share one computation; the variants differ only in the stated
 * committee size and vote counts, so their cases share the same parse, solve,
 * compute, and explain functions and declare only their own printed template.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const MEMBERS_PATTERN = /committee has (\d+) members/i;
const PRESENT_PATTERN = /(\d+) are present/i;
const VOTES_PATTERN = /yes=(\d+),\s*no=(\d+),\s*abstain=(\d+)/i;
const QUORUM_PATTERN = /quorum is at least (\d+)% of all members/i;
const MAJORITY_PATTERN = /yes votes are strictly more than no votes/i;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const members = MEMBERS_PATTERN.exec(facts);
  const present = PRESENT_PATTERN.exec(facts);
  const votes = VOTES_PATTERN.exec(facts);
  const quorum = QUORUM_PATTERN.exec(facts);
  if (members === null || present === null || votes === null || quorum === null) {
    throw new Error('the statement does not state the committee size, the attendance, the votes, and the quorum rule');
  }
  if (!MAJORITY_PATTERN.test(facts)) {
    throw new Error('the statement does not state the strict-majority rule');
  }
  return {
    members: Number(members[1]),
    present: Number(present[1]),
    yes: Number(votes[1]),
    no: Number(votes[2]),
    abstain: Number(votes[3]),
    quorumPercent: Number(quorum[1]),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function quorumThreshold(slots) {
  return Math.ceil((slots.quorumPercent * slots.members) / 100);
}

function solve(slots) {
  if (slots.yes + slots.no + slots.abstain !== slots.present) {
    throw new Error('the stated votes do not add up to the number present');
  }
  const threshold = quorumThreshold(slots);
  const quorumMet = slots.present >= threshold;
  const majority = slots.yes > slots.no;
  return {
    threshold,
    quorumMet,
    majority,
    passes: quorumMet && majority,
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const main = `${solution.quorumMet ? 'Quorum is met' : 'Quorum is not met'}; ${
    solution.passes ? 'the motion passes.' : 'the motion does not pass.'
  }`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Number.isInteger(slots.members) && slots.members > 0, "the committee must have a positive whole number of members");',
  'probe(Number.isInteger(slots.present) && slots.present >= 0 && slots.present <= slots.members, "the number present must be a whole number within the committee");',
  'probe([slots.yes, slots.no, slots.abstain].every((count) => Number.isInteger(count) && count >= 0), "the yes, no, and abstain counts must be non-negative whole numbers");',
  'probe(slots.yes + slots.no + slots.abstain === slots.present, "the stated votes must add up to the number present");',
  'probe(Number.isInteger(slots.quorumPercent) && slots.quorumPercent > 0 && slots.quorumPercent <= 100, "the quorum share must be a stated percentage of all members");',
  'const threshold = Math.ceil((slots.quorumPercent * slots.members) / 100);',
  'probe(threshold > 0 && threshold <= slots.members, "the quorum threshold must fall inside the committee");',
  'const quorumMet = slots.present >= threshold;',
  'const passes = quorumMet && slots.yes > slots.no;',
  'const main = (quorumMet ? "Quorum is met" : "Quorum is not met") + "; " + (passes ? "the motion passes." : "the motion does not pass.");',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The quorum threshold is the stated share of all members rounded up: ceil(${slots.quorumPercent / 100} x ${slots.members}) = ${solution.threshold}.`,
    `The committee has ${slots.present} members present, so quorum is ${solution.quorumMet ? 'met' : 'not met'}; the ${slots.abstain} abstention${slots.abstain === 1 ? '' : 's'} count for presence but not as no votes.`,
    `The vote comparison is yes against no only: ${slots.yes} against ${slots.no}, so the strict majority is ${solution.majority ? 'satisfied' : 'not satisfied'}.`,
    `A motion passes only when both tests hold, so the motion ${solution.passes ? 'passes' : 'does not pass'}.`
  ];
}

function caseFor(grade) {
  const template = `Voting, majority, and quorum (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'C3';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
