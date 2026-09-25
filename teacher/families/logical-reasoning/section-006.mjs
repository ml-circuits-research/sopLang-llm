/**
 * Section 6 of the logical-reasoning book: inclusive or and exclusive or.
 *
 * Every case prints two signs in one place. Sign One lists two lunch sides and
 * closes with "OR both", so its "or" is inclusive; Sign Two lists two tray
 * proteins with "not both, and not a third protein", so its "or" is exclusive.
 * The case data changes the place and the three names; the reasoning is fixed:
 * the first speaker imports the exclusive reading into the inclusive sign, the
 * second imports the inclusive reading into the exclusive sign, and only the
 * third speaker lets each sentence define its own "or". The family reads the
 * two signs and the three sentences and renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const SIGNS_PATTERN =
  /Sign One in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): “Lunch includes ([a-z]+) OR ([a-z]+) OR both\.” Sign Two: “This special tray is ([A-Z]+) or ([A-Z]+), not both, and not a third protein\.”/;
const SPEAKERS_PATTERN =
  /([A-Z][a-z]+) takes ([a-z]+) and ([a-z]+) and says Sign One forbids the pair\. ([A-Z][a-z]+) asks for ([a-z]+) and ([a-z]+) on the special tray because “or” always includes both\. ([A-Z][a-z]+) says the two signs use “or” in two written ways\./;

function parse(statement) {
  const signs = SIGNS_PATTERN.exec(statement);
  const speakers = SPEAKERS_PATTERN.exec(statement);
  if (signs === null || speakers === null) {
    throw new Error('the statement does not carry the two signs and the three readings');
  }
  return {
    place: signs[1],
    inclusiveSides: [signs[2].toUpperCase(), signs[3].toUpperCase()],
    exclusiveSides: [signs[4].toUpperCase(), signs[5].toUpperCase()],
    pairTaker: speakers[1],
    takenPair: [speakers[2].toUpperCase(), speakers[3].toUpperCase()],
    bothAsker: speakers[4],
    askedPair: [speakers[5].toUpperCase(), speakers[6].toUpperCase()],
    reader: speakers[7]
  };
}

function samePair(left, right) {
  return left[0] === right[0] && left[1] === right[1];
}

/**
 * Each sign carries its own definition of "or": the words "OR both" make Sign
 * One inclusive, the words "not both" make Sign Two exclusive. The case must
 * list two different sides per sign, the forbidden pair must be the two sides
 * of the inclusive sign, the requested pair must be the two sides of the
 * exclusive sign, and only the third speaker reads each sign by its own words.
 */
function solve(slots) {
  if (slots.inclusiveSides[0] === slots.inclusiveSides[1] || slots.exclusiveSides[0] === slots.exclusiveSides[1]) {
    throw new Error('each sign must list two different sides');
  }
  if (samePair(slots.takenPair, slots.exclusiveSides) || !samePair(slots.takenPair, slots.inclusiveSides)) {
    throw new Error('the forbidding reading must pair the two sides of the inclusive sign');
  }
  if (samePair(slots.askedPair, slots.inclusiveSides) || !samePair(slots.askedPair, slots.exclusiveSides)) {
    throw new Error('the requesting reading must pair the two sides of the exclusive sign');
  }
  return { reader: slots.reader };
}

function render(solution) {
  return `${solution.reader}. Sign One is inclusive. Sign Two is exclusive. The word takes the sense the sentence writes.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const samePair = (left, right) => left[0] === right[0] && left[1] === right[1];',
  'return slots.reader + ". Sign One is inclusive. Sign Two is exclusive. The word takes the sense the sentence writes.";'
].join('\n');

function explain(slots, solution) {
  return [
    `Sign One in ${slots.place} lists ${slots.inclusiveSides[0]} or ${slots.inclusiveSides[1]} and adds "OR both", so its "or" is inclusive and allows both sides together.`,
    `Sign Two lists ${slots.exclusiveSides[0]} or ${slots.exclusiveSides[1]} with "not both" and no third protein, so its "or" is exclusive.`,
    `${slots.pairTaker} imports the exclusive reading into the inclusive sign, and ${slots.bothAsker} imports the inclusive reading into the exclusive sign, so each of them denies a sign its own words allow.`,
    `Only ${solution.reader} lets each sentence define its own "or", so the two signs keep the two senses they write.`
  ];
}

export const unit = 6;

export const cases = [
  {
    template: 'Inclusive or and exclusive or',
    type: slugify('Inclusive or and exclusive or'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
