/**
 * Section 84 of the logical-reasoning book: staying because of what was
 * already spent.
 *
 * Every case names one person who has already paid for a dull listed lecture, a
 * listed free walk that the same person would now prefer, and three speakers:
 * one who says the spent ticket is gone and the live question is the next hour,
 * one who says leaving would waste the money, and one who repeats the demand to
 * stay. The place and the three names change; the verdict is fixed: the payment
 * is sunk, staying does not bring it back, and the live question is which next
 * hour is better.
 *
 * The printed answer names the payer, so the family reads the payer from the
 * statement and checks that the two later mentions are the same person.
 */

import { slugify } from '../../naming.mjs';

const CASE_PATTERN =
  /([A-Z][a-z]+) in ([^.]+) has already paid for a dull listed lecture\. The next hour could be used on a listed free walk that ([A-Z][a-z]+) would now prefer\. ([A-Z][a-z]+) says the spent ticket is gone and the live question is the next hour\. ([A-Z][a-z]+) says leaving would waste the money, so ([A-Z][a-z]+) must stay\./;

function parse(statement) {
  const matched = CASE_PATTERN.exec(statement);
  if (matched === null) {
    throw new Error('the statement does not post a paid lecture beside a preferred free walk');
  }
  return {
    payer: matched[1],
    place: matched[2],
    preferrer: matched[3],
    liveVoice: matched[4],
    wasteVoice: matched[5],
    mustStay: matched[6]
  };
}

function solve(slots) {
  if (slots.payer !== slots.preferrer || slots.payer !== slots.mustStay) {
    throw new Error('the case must pay for the lecture, prefer the walk, and demand the stay for one person');
  }
  const speakers = [slots.payer, slots.liveVoice, slots.wasteVoice];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the case must give the future-regarding and the waste reading to two other people');
  }
  return { payer: slots.payer, sunk: 'The payment is sunk', live: 'The live question is which next hour is better' };
}

function render(solution) {
  return `The payment is sunk. It will not return if ${solution.payer} stays. The live question is which next hour is better.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.payer === "string" && slots.payer.length > 0, "the case must name the person who already paid");',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the lecture");',
  'probe(slots.payer === slots.preferrer && slots.payer === slots.mustStay, "the payer, the person who prefers the walk, and the person told to stay must be the same");',
  'probe(typeof slots.liveVoice === "string" && slots.liveVoice.length > 0, "the case must name the speaker who separates the spent payment from the live question");',
  'probe(typeof slots.wasteVoice === "string" && slots.wasteVoice.length > 0, "the case must name the speaker who calls leaving a waste");',
  'probe(slots.payer !== slots.liveVoice && slots.payer !== slots.wasteVoice && slots.liveVoice !== slots.wasteVoice, "the readings must belong to three different speakers");',
  'const sunk = "The payment is sunk";',
  'return sunk + ". It will not return if " + slots.payer + " stays. The live question is which next hour is better.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.payer} has already paid in ${slots.place}, and the dull listed lecture is the only thing that payment bought.`,
    `The money is gone whichever way the next hour goes, so ${solution.sunk.toLowerCase()}: staying does not bring the payment back.`,
    `The live question is which next hour is better, the lecture or the listed free walk ${slots.payer} would now prefer, and only that comparison concerns the future.`,
    `${slots.wasteVoice}'s claim that leaving would waste the money tries to revive an unrecoverable payment, while ${slots.liveVoice} keeps the decision in futures.`
  ];
}

export const unit = 84;

export const cases = [
  {
    template: 'Staying because of what was already spent',
    type: slugify('Staying because of what was already spent'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
