/**
 * Section 93 of the logical-reasoning book: a claim that could be wrong.
 *
 * Every case names a person in a place who offers a stone that always points
 * north and whose south-pointing only proves the south is secretly north, then
 * two more readings of it. The case data changes the place and the three
 * names; the reasoning is fixed: a claim that relabels every miss as a secret
 * success is armoured against any observation, so nothing could count against
 * it and nothing counts for it either. The family reads the three sentences and
 * renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const CLAIM_PATTERN =
  /^([A-Z][a-z]+) in ([A-Z][a-z]+(?: [A-Z][a-z]+)*) says \u201cthis stone always points north, and if it points south that would only prove the south is secretly north.\u201d ([A-Z][a-z]+) says the claim cannot be shown wrong, so it is not doing scientific work in the modest sense of this book\. ([A-Z][a-z]+) says an unfalsifiable claim is the strongest kind because nothing can touch it\./;

function parse(statement) {
  const claim = CLAIM_PATTERN.exec(statement);
  if (claim === null) {
    throw new Error('the statement does not record the three sentences about the claim');
  }
  return {
    claimant: claim[1],
    place: claim[2],
    falsifier: claim[3],
    strengthReader: claim[4]
  };
}

function solve(slots) {
  const speakers = [slots.claimant, slots.falsifier, slots.strengthReader];
  if (slots.place.length === 0) {
    throw new Error('the claim must be located in a named place');
  }
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three sentences must come from three different people');
  }
  return {
    claimant: slots.claimant,
    place: slots.place,
    falsifier: slots.falsifier,
    strengthReader: slots.strengthReader
  };
}

function render(solution) {
  return 'One armoured against any observation. That is slogan-strength, not science-strength. Untouchable is not strong; it has left the game.';
}

const COMPUTE = [
  'const slots = $slots;',
  'return "One armoured against any observation. That is slogan-strength, not science-strength. Untouchable is not strong; it has left the game.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${solution.claimant} of ${solution.place} offers a stone whose every miss is relabelled a secret success, so no observation could count against the claim.`,
    `${solution.falsifier} names what that costs: a claim that cannot be shown wrong is not doing scientific work in the modest sense of this book.`,
    `${solution.strengthReader} calls the claim the strongest kind because nothing can touch it, but untouchable is not strong; it has left the game.`
  ];
}

export const unit = 93;

export const cases = [
  {
    template: 'A claim that could be wrong',
    type: slugify('A claim that could be wrong'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
