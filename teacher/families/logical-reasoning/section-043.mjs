/**
 * Section 43 of the logical-reasoning book: reverse or two-way arrows.
 *
 * Every case prints a diary in a named place where people who report one state
 * also report a late habit, and three people read the pairing: the first reads
 * the habit as the cause, the second offers the reverse or a mutual arrow, the
 * third calls the arrow obvious because the habit is vivid. The case data
 * changes the place and the three names; the reasoning is fixed: a pairing is
 * not a direction, so the family renders the printed "not forced" verdict with
 * the habit the vividness claim names.
 */

import { slugify } from '../../naming.mjs';

const TEMPLATE = 'Reverse or two-way arrows';

const DIARY_PATTERN =
  /Diary in ([A-Z][A-Za-z ]+): people who report ([a-z ]+) also report more evening ([a-z-]+)-watching\. ([A-Z][a-z]+) says ([a-z-]+) causes ([a-z ]+)\. ([A-Z][a-z]+) says ([a-z ]+) may also send people toward late ([a-z-]+), or each may feed the other\. ([A-Z][a-z]+) says the arrow is obvious because ([a-z-]+) is vivid\./;

function parse(statement) {
  const diary = DIARY_PATTERN.exec(statement);
  if (diary === null) {
    throw new Error('the statement does not print the diary pairing with its three readings');
  }
  return {
    place: diary[1],
    outcome: diary[2],
    habit: diary[3],
    forwardSpeaker: diary[4],
    forwardCause: diary[5],
    forwardOutcome: diary[6],
    reverseSpeaker: diary[7],
    reverseOutcome: diary[8],
    lateHabit: diary[9],
    vividSpeaker: diary[10],
    vivid: diary[11]
  };
}

function solve(slots) {
  if (slots.forwardCause !== slots.habit || slots.lateHabit !== slots.habit || slots.vivid !== slots.habit) {
    throw new Error('the pairing, the reverse reading, and the vividness claim must name the same habit');
  }
  if (slots.forwardOutcome !== slots.outcome || slots.reverseOutcome !== slots.outcome) {
    throw new Error('the two readings must name the same reported state');
  }
  const speakers = [slots.forwardSpeaker, slots.reverseSpeaker, slots.vividSpeaker];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three readings must come from three different speakers');
  }
  return { habit: slots.habit, vivid: slots.vivid };
}

function render(solution) {
  return `No. The page gives a pairing, not a direction. Vividness of ${solution.vivid} is not an arrow.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "No. The page gives a pairing, not a direction. Vividness of " + slots.vivid + " is not an arrow.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The diary in ${slots.place} pairs ${slots.outcome} with more evening ${slots.habit}-watching, so only a pairing is on the page.`,
    `${slots.forwardSpeaker} reads ${slots.vivid} as the cause and ${slots.reverseSpeaker} offers the reverse or a mutual arrow; nothing listed separates the three rivals.`,
    `${slots.vividSpeaker} treats vividness as an arrow, but vividness is not a direction, so the direction is not forced.`
  ];
}

export const unit = 43;

export const cases = [
  {
    template: TEMPLATE,
    type: slugify(TEMPLATE),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
