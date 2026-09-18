/**
 * Section 24 of the logical-reasoning book: one miss and a universal.
 *
 * Every case shows a teaching card in one place that records a strict universal
 * (“all swans are white”), a later page that shows one counterexample, and
 * three speakers: one declares the universal finished, one says a single miss
 * cannot touch a proud sentence, and one lets the miss also finish a “most”
 * sentence the card never made. The place varies; the reasoning is fixed,
 * because one listed counterexample kills the universal and leaves a
 * statistical claim that was never on the card untouched.
 *
 * The family reads the card’s claim, the single counterexample, and the
 * “most” sentence the third speaker overreaches to, then renders the printed
 * verdict with the claim the card actually made.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN =
  /A teaching card in ([A-Z][A-Za-z]*(?: [A-Z][a-z]+)*) records the claim “([^”]+)\.”/;
const PAGE_PATTERN = /A later page shows (one|\d+) ([a-z]+(?: [a-z]+)*)\./;
const QUESTION_PATTERN = /Question\. What does one ([a-z]+(?: [a-z]+)*) refute\?/;
const FINISHED_PATTERN = /([A-Z][a-z]+) says the universal is finished\./;
const PROUD_PATTERN = /([A-Z][a-z]+) says one miss cannot touch a proud sentence\./;
const OVERREACH_PATTERN = /([A-Z][a-z]+) says the miss also finishes “([^”]+),” which the card never made\./;

function find(pattern, statement, what) {
  const match = pattern.exec(statement);
  if (match === null) {
    throw new Error(`the statement does not record ${what}`);
  }
  return match;
}

function parse(statement) {
  const card = find(CARD_PATTERN, statement, 'the claim written on the teaching card');
  const page = find(PAGE_PATTERN, statement, 'the counterexample the later page shows');
  const question = find(QUESTION_PATTERN, statement, 'the question about the counterexample');
  if (page[2] !== question[1]) {
    throw new Error('the question must ask about the counterexample the later page shows');
  }
  if (!/^(one|1)$/.test(page[1])) {
    throw new Error('the section is about the single listed counterexample');
  }
  return {
    place: card[1],
    claim: card[2].trim(),
    counterexample: page[2],
    finishedSpeaker: find(FINISHED_PATTERN, statement, 'the speaker who declares the universal finished')[1],
    proudSpeaker: find(PROUD_PATTERN, statement, 'the speaker who calls the sentence proud')[1],
    panicSpeaker: find(OVERREACH_PATTERN, statement, 'the speaker who overreaches to a statistical sentence')[1],
    overreach: find(OVERREACH_PATTERN, statement, 'the statistical sentence the miss cannot finish')[2].trim()
  };
}

function solve(slots) {
  if (!/^all\b/.test(slots.claim)) {
    throw new Error('the card must record a strict universal for one miss to refute');
  }
  if (!/^most\b/.test(slots.overreach)) {
    throw new Error('the overreach must be a statistical sentence the card never made');
  }
  if (new Set([slots.finishedSpeaker, slots.proudSpeaker, slots.panicSpeaker]).size !== 3) {
    throw new Error('the three speakers must be three different people');
  }
  return { claim: slots.claim, counterexample: slots.counterexample, place: slots.place };
}

function render(solution) {
  return `The strict universal “${solution.claim}.” It does not, by itself, refute a statistical sentence that was not on the card.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the teaching card");',
  'probe(typeof slots.claim === "string" && /^all\\b/.test(slots.claim), "the card must record a strict universal for one miss to refute");',
  'probe(typeof slots.counterexample === "string" && slots.counterexample.length > 0, "the case must name the counterexample the later page shows");',
  'probe(typeof slots.overreach === "string" && /^most\\b/.test(slots.overreach), "the overreach must be a statistical sentence the card never made");',
  'probe(slots.finishedSpeaker !== slots.proudSpeaker && slots.proudSpeaker !== slots.panicSpeaker && slots.finishedSpeaker !== slots.panicSpeaker, "the three speakers must be three different people");',
  'return "The strict universal “" + slots.claim + ".” It does not, by itself, refute a statistical sentence that was not on the card.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card in ${solution.place} records the strict universal “${solution.claim},” and the later page shows one ${solution.counterexample}, which is a listed counterexample of exactly that sentence.`,
    `${slots.finishedSpeaker} is right that the universal dies with that one case, while ${slots.proudSpeaker} would keep a corpse standing.`,
    `${slots.panicSpeaker} lets the same miss also finish “${slots.overreach},” but a “most” claim was never on the card: the weapon must match the claim.`
  ];
}

export const unit = 24;

export const cases = [
  {
    template: 'One miss and a universal',
    type: slugify('One miss and a universal'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
