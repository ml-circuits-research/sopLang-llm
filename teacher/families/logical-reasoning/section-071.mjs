/**
 * Section 71 of the logical-reasoning book: the person instead of the sentence.
 *
 * Every case has one speaker assert a card about the world, a reply that
 * attacks the speaker's origin instead of the card, and then two more
 * speakers: one says the reply attacks the person and leaves the card's
 * sentence untouched, one says origin is a refutation. The case data changes
 * the place, the speaker, the subject of the card, and the three names; the
 * reasoning is fixed: the sentence under discussion is about the world, the
 * reply is about the person, and origin does not by itself make a sentence
 * false.
 */

import { slugify } from '../../naming.mjs';

const CLAIM_PATTERN =
  /In ([A-Z][a-z]+(?: [A-Z][a-z]+)*), ([A-Z][a-z]+) says the ([a-z][a-z ]*?) is right\./;
const REPLY_PATTERN = /A speaker replies: “([^”]+)”/;
const DEFENDER_PATTERN =
  /([A-Z][a-z]+) says the reply attacks the person and leaves the ([a-z]+) sentence untouched\./;
const ORIGIN_PATTERN = /([A-Z][a-z]+) says origin is a refutation\./;

function parse(statement) {
  const claim = CLAIM_PATTERN.exec(statement);
  if (claim === null) {
    throw new Error('the statement does not record the card a named speaker says is right');
  }
  const reply = REPLY_PATTERN.exec(statement);
  if (reply === null) {
    throw new Error('the statement does not quote the reply that answers the speaker');
  }
  const defender = DEFENDER_PATTERN.exec(statement);
  if (defender === null) {
    throw new Error('the statement does not record the speaker who says the reply attacks the person');
  }
  const origin = ORIGIN_PATTERN.exec(statement);
  if (origin === null) {
    throw new Error('the statement does not record the speaker who calls origin a refutation');
  }
  const subject = claim[3];
  const topic = subject.split(' ')[0];
  if (defender[2] !== topic) {
    throw new Error('the defender must name the same sentence the first speaker put up for discussion');
  }
  return {
    place: claim[1],
    claimant: claim[2],
    subject,
    topic,
    reply: reply[1],
    defender: defender[1],
    originClaimant: origin[1]
  };
}

function solve(slots) {
  if (!/\bfrom here\b/.test(slots.reply)) {
    throw new Error('the reply must attack the speaker\'s origin for this section\'s verdict');
  }
  if (slots.reply.toLowerCase().includes(slots.topic)) {
    throw new Error('the reply must leave the sentence\'s own subject untouched');
  }
  const speakers = new Set([slots.claimant, slots.defender, slots.originClaimant]);
  if (speakers.size !== 3) {
    throw new Error('the three voices of the exchange must come from three different speakers');
  }
  return {
    place: slots.place,
    claimant: slots.claimant,
    subject: slots.subject,
    topic: slots.topic,
    reply: slots.reply,
    defender: slots.defender,
    originClaimant: slots.originClaimant,
    verdict: 'not scored'
  };
}

function render(solution) {
  return `No. Motive or origin may explain why someone spoke. It does not, by itself, make the sentence false.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "No. Motive or origin may explain why someone spoke. It does not, by itself, make the sentence false.";'
].join('\n');

function explain(slots, solution) {
  return [
    `In ${slots.place}, ${slots.claimant} puts up the ${slots.subject} as a sentence about the world, and the reply answers with the speaker's origin instead of that sentence.`,
    `${solution.defender} reads the exchange correctly: the reply attacks the person and leaves the ${slots.topic} sentence untouched.`,
    `${solution.originClaimant} treats origin as a refutation, but where someone is from bears on the density of ice only through the sentence, which the reply never touches.`,
    `Origin may explain why someone spoke; on this page it does not by itself make the sentence false.`
  ];
}

export const unit = 71;

export const cases = [
  {
    template: 'The person instead of the sentence',
    type: slugify('The person instead of the sentence'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
