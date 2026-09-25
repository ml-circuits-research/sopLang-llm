/**
 * Section 89 of the adult-reasoning course: who knows what.
 *
 * Every variant hides a gift in a cupboard; one person places it unseen, a
 * second person waits in another room, and a third opens the cupboard, looks,
 * closes it, and says nothing. The second person asks whether the opener knows,
 * and the placer, who never saw the opening, answers that nobody knows. The
 * family reads the four sentences and renders who knows at the end and what the
 * placer got wrong.
 */

import { slugify } from '../../naming.mjs';

const PLACE_PATTERN = /([A-Z][a-z]+) puts a gift in a cupboard, seen only by ([A-Z][a-z]+)\./;
const ROOM_PATTERN = /([A-Z][a-z]+) is in another room\./;
const OPEN_PATTERN = /([A-Z][a-z]+) opens the cupboard, sees, closes, says nothing\./;
const ASK_PATTERN = /([A-Z][a-z]+) asks: “Does ([A-Z][a-z]+) know\?”/;
const DENY_PATTERN = /([A-Z][a-z]+): “No, nobody knows\.”/;

function parse(statement) {
  const place = PLACE_PATTERN.exec(statement);
  const room = ROOM_PATTERN.exec(statement);
  const open = OPEN_PATTERN.exec(statement);
  const ask = ASK_PATTERN.exec(statement);
  const deny = DENY_PATTERN.exec(statement);
  if (place === null || room === null || open === null || ask === null || deny === null) {
    throw new Error('the statement does not record the placing, the waiting, the opening, the question, and the denial');
  }
  return {
    placer: place[1],
    placerAlone: true,
    witness: place[2],
    waiting: room[1],
    opener: open[1],
    asker: ask[1],
    askedAbout: ask[2],
    denier: deny[1]
  };
}

function solve(slots) {
  if (
    slots.witness !== slots.placer ||
    slots.asker !== slots.waiting ||
    slots.askedAbout !== slots.opener ||
    slots.denier !== slots.placer
  ) {
    throw new Error('the statement does not match the cupboard pattern of one honest placer and one unmentioned opener');
  }
  return {
    knowers: `${slots.placer} and ${slots.opener} know.`,
    waiting: `${slots.waiting} does not.`,
    mistake: `${slots.placer} did not see ${slots.opener}’s act and said “nobody”.`
  };
}

function render(solution) {
  return `${solution.knowers} ${solution.waiting} ${solution.mistake}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return slots.placer + " and " + slots.opener + " know. " + slots.waiting + " does not. " + slots.placer + " did not see " + slots.opener + "\\u2019s act and said \\u201Cnobody\\u201D.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.placer} placed the gift, so ${slots.placer} knows where it is regardless of what was said afterwards.`,
    `${slots.opener} opened the cupboard, saw, and said nothing: silence changes who else learns, not what ${slots.opener} knows.`,
    `${slots.waiting} stayed in another room and the report never reached ${slots.waiting}.`,
    `${slots.placer} never saw the opening, so the claim “nobody knows” is wrong: ${solution.knowers} ${solution.waiting}`
  ];
}

export const unit = 89;

export const cases = [
  {
    template: 'Who knows what',
    type: slugify('Who knows what'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
