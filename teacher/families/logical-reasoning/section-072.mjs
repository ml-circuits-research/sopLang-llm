/**
 * Section 72 of the logical-reasoning book: a weaker copy of the claim.
 *
 * Every case records one speaker who says a sample of four is too small for a
 * town-wide claim, a reply that answers with total ignorance instead, and two
 * commentators: one who calls the reply a knock-down of a stronger, uglier
 * copy, and one who claims the two sentences are the same sentence. The case
 * data changes the speaker, the place, and the two commentators; the reasoning
 * is fixed: the sentence the reply attacks was never said, so the reply is a
 * straw man.
 *
 * The family reads the two quoted sentences and the stated sample size and
 * renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const CLAIM_PATTERN =
  /^([A-Z][a-z]+) in ([A-Z][a-z]+(?: [A-Z][a-z]+)*) says “([^”]+)” A reply: “([^”]+)\.” ([A-Z][a-z]+) says the reply knocked down a stronger, uglier copy\. ([A-Z][a-z]+) says the two sentences are the same sentence\./;

const SAMPLE_PATTERN = /sample of ([a-z]+) is too small/;

const SAMPLE_SIZES = Object.freeze({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10
});

function parse(statement) {
  const claim = CLAIM_PATTERN.exec(statement);
  if (claim === null) {
    throw new Error('the statement does not record the sample claim, the reply, and the two commentators');
  }
  const sample = SAMPLE_PATTERN.exec(claim[3]);
  if (sample === null) {
    throw new Error('the statement does not record the size of the sample');
  }
  const sampleSize = SAMPLE_SIZES[sample[1]];
  if (sampleSize === undefined) {
    throw new Error(`the statement names an unknown sample size "${sample[1]}"`);
  }
  return {
    speaker: claim[1],
    place: claim[2],
    originalClaim: claim[3],
    replyClaim: claim[4],
    critic: claim[5],
    sloganeer: claim[6],
    sampleSize
  };
}

/**
 * The reply swaps the small-sample sentence for a claim of total ignorance, so
 * the sentence that was attacked is not the sentence that was made and the
 * reply is not attached to the claim.
 */
function solve(slots) {
  const sameSentence = slots.originalClaim === slots.replyClaim;
  return {
    speaker: slots.speaker,
    place: slots.place,
    critic: slots.critic,
    sampleSize: slots.sampleSize,
    sameSentence,
    attached: sameSentence
  };
}

function render(solution) {
  const verdict = solution.attached ? 'Yes' : 'No';
  return `${verdict}. “Too small for this climb” is not “know nothing forever.” That is a straw man.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const attached = slots.originalClaim === slots.replyClaim;',
  'const verdict = attached ? "Yes" : "No";',
  'return verdict + ". \u201cToo small for this climb\u201d is not \u201cknow nothing forever.\u201d That is a straw man.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.speaker} of ${slots.place} said only that a sample of ${slots.sampleSize} is too small for a town-wide claim.`,
    `The reply answers a different sentence: “${slots.replyClaim}” is not the small-sample point.`,
    `${slots.critic} is right that the reply knocked down a stronger, uglier copy rather than the sentence on the page.`,
    `Because the attacked sentence and the sentence that was made differ, the reply is ${solution.attached ? '' : 'not '}attached to the claim.`
  ];
}

export const unit = 72;

export const cases = [
  {
    template: 'A weaker copy of the claim',
    type: slugify('A weaker copy of the claim'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
