/**
 * Section 8 of the adult-reasoning course: pronouns, references, and ambiguity.
 *
 * Every variant quotes the same stairwell minutes: one person proposes painting
 * the banister, a second objects, a third promises a vote on the painting while
 * the price stays under a ceiling, the chair sends “this” to next month’s list,
 * and the proposer asks that “theirs” be voted today. A vote is held, and a
 * note mentions that “he” will request three quotes. The attached rule fixes
 * “this” to the last proposal stated, “theirs” to the speaker, and “he” to the
 * person named before, so the printed answer decides the painting, defers the
 * conditional promise, and attaches the quotes to the conditional voter. The
 * cases change the district, the names, and the price ceiling.
 */

import { slugify } from '../../naming.mjs';

const PLACE_PATTERN = /Stairwell minutes, ([^:]+):/;
const OPENING_PATTERN =
  /([A-Z][a-z]+) proposed painting the banister\. ([A-Z][a-z]+) objected, saying the roof had already been paid for\. ([A-Z][a-z]+) will vote for painting if the price stays under (\d+)\./;
const THEIRS_PATTERN = /([A-Z][a-z]+) asked that theirs be voted today\./;
const VOTE_PATTERN = /A vote was held\. Four for, two against, one abstention\./;
const NOTE_PATTERN = /It was noted that he will request three quotes\./;
const RULE_PATTERN = /“he” = the last man named before\. Decisions apply only if the text says what was voted\./;
const DEFERRAL_PATTERN = /The chair asked that this be put on next month’s list\./;

function parse(statement) {
  const place = PLACE_PATTERN.exec(statement);
  const opening = OPENING_PATTERN.exec(statement);
  const theirs = THEIRS_PATTERN.exec(statement);
  if (place === null || opening === null || theirs === null) {
    throw new Error('the statement does not quote the minutes with the proposal, the objection, and the “theirs” request');
  }
  return {
    place: place[1],
    proposer: opening[1],
    objector: opening[2],
    conditionalVoter: opening[3],
    priceCeiling: Number(opening[4]),
    theirsSpeaker: theirs[1],
    voteRecorded: VOTE_PATTERN.test(statement),
    quotesOnlyNoted: NOTE_PATTERN.test(statement),
    deferralRecorded: DEFERRAL_PATTERN.test(statement),
    ruleAttached: RULE_PATTERN.test(statement)
  };
}

function solve(slots) {
  if (slots.proposer === slots.conditionalVoter) {
    throw new Error('the minutes do not separate the proposer from the conditional voter');
  }
  if (slots.theirsSpeaker !== slots.proposer) {
    throw new Error('the minutes do not let the speaker request that “theirs” be voted');
  }
  if (!slots.voteRecorded || !slots.quotesOnlyNoted) {
    throw new Error('the minutes do not record the vote and the note about the three quotes');
  }
  return {
    voted: `Today ${slots.proposer}’s proposal (the painting) was voted.`,
    deferred: `“This” (${slots.conditionalVoter}’s conditional proposal) is deferred.`,
    referent: `“He” = ${slots.conditionalVoter}.`,
    quotes: 'The three quotes are “noted”, not explicitly voted.'
  };
}

function render(solution) {
  return `${solution.voted} ${solution.deferred} ${solution.referent} ${solution.quotes}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const voted = "Today " + slots.proposer + "’s proposal (the painting) was voted.";',
  'const deferred = "“This” (" + slots.conditionalVoter + "’s conditional proposal) is deferred.";',
  'const referent = "“He” = " + slots.conditionalVoter + ".";',
  'const quotes = "The three quotes are “noted”, not explicitly voted.";',
  'return voted + " " + deferred + " " + referent + " " + quotes;'
].join('\n');

function explain(slots, solution) {
  return [
    `“Theirs” belongs to the speaker, so the item the ${slots.place} minutes put to the vote is ${slots.proposer}'s proposal, the painting, and the recorded four-for vote carries it.`,
    `“This” points at the last proposal stated, ${slots.conditionalVoter}'s promise to vote for the painting under ${slots.priceCeiling}, and the chair sends that promise to next month’s list, so it is deferred instead of decided.`,
    `${slots.conditionalVoter} is also the person the attached rule attaches to the pronoun “he”, so the three quotes are requested by the conditional voter and not by ${slots.objector}.`,
    'The quotes appear only in the note that they will be requested: the minutes never say they were voted, which is what stays unclear.'
  ];
}

export const unit = 8;

export const cases = [
  {
    template: 'Pronouns, references, and ambiguity',
    type: slugify('Pronouns, references, and ambiguity'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
