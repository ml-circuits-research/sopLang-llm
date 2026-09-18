/**
 * Section 32 of the logical-reasoning book: a false analogy.
 *
 * Every case posts a school card whose engine is one named property, drops a
 * hard object that sinks, and records three reactions: one reads the sinking
 * as a refutation of the card, one names the property the two objects do not
 * share, and one treats any two hard things as the same lesson. The case data
 * changes the place, the dropped object, and the three names; the verdict is
 * fixed: the sunk object does not carry the property that does the floating
 * work, so its sinking refutes nothing.
 */

import { slugify } from '../../naming.mjs';

const PLACE_PATTERN = /^Stall in ([A-Z][A-Za-z ]*)\./;
const CARD_PATTERN = /A school card: (\w+) floats on a pond because it is ([^.]+)\./;
const DROP_PATTERN = /A performer drops an (\w+) bar into a bucket; it (\w+)\./;
const REFUTER_PATTERN = /([A-Z][a-z]+) says this proves (\w+) cannot float\./;
const MAPPER_PATTERN = /([A-Z][a-z]+) says (\w+) and (\w+) do not share the property that does the floating work\./;
const LEVELLER_PATTERN = /([A-Z][a-z]+) says any two (\w+) things dropped in water are the same lesson\./;

/**
 * The property the card's engine names, keyed by the cause the card prints.
 * The verdict quotes the property, so a card with an unlisted cause is a case
 * this section does not cover and `solve` refuses it.
 */
const PROPERTY_OF_CAUSE = Object.freeze({
  'less dense than liquid water': 'density compared with the liquid'
});

/** The ongoing form the verdict uses, keyed by the outcome the case prints. */
const STATE_OF_OUTCOME = Object.freeze({
  sinks: 'sinking',
  floats: 'floating'
});

function required(pattern, statement, what) {
  const match = pattern.exec(statement);
  if (match === null) {
    throw new Error(`the statement does not record ${what}`);
  }
  return match;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function parse(statement) {
  const place = required(PLACE_PATTERN, statement, 'the place of the stall');
  const card = required(CARD_PATTERN, statement, 'the school card and the cause it names');
  const drop = required(DROP_PATTERN, statement, 'the object dropped into the bucket and its outcome');
  const refuter = required(REFUTER_PATTERN, statement, 'the reader who takes the sinking as a refutation');
  const mapper = required(MAPPER_PATTERN, statement, 'the reader who names the property the objects do not share');
  const leveller = required(LEVELLER_PATTERN, statement, 'the reader who treats any two hard things as the same lesson');
  return {
    place: place[1].trim(),
    floatingThing: card[1],
    cardCause: card[2].trim(),
    droppedThing: drop[1],
    droppedOutcome: drop[2],
    refuter: refuter[1],
    refutedThing: refuter[2],
    mapper: mapper[1],
    comparedThings: [mapper[2], mapper[3]],
    leveller: leveller[1],
    sharedFeature: leveller[2]
  };
}

function solve(slots) {
  const property = PROPERTY_OF_CAUSE[slots.cardCause];
  const state = STATE_OF_OUTCOME[slots.droppedOutcome];
  if (property === undefined) {
    throw new Error(`the card states a cause this section does not cover: ${slots.cardCause}`);
  }
  if (state === undefined) {
    throw new Error(`the case states an outcome this section does not cover: ${slots.droppedOutcome}`);
  }
  if (slots.refutedThing !== slots.floatingThing) {
    throw new Error('the refutation does not speak about the object the card floats');
  }
  if (slots.comparedThings[0] !== slots.droppedThing || slots.comparedThings[1] !== slots.floatingThing) {
    throw new Error('the unshared-property reader does not compare the dropped object with the card object');
  }
  if (slots.sharedFeature === slots.droppedThing || slots.sharedFeature === slots.floatingThing) {
    throw new Error('the leveller shares the name of an object instead of a property');
  }
  return {
    verdict: 'no',
    property,
    object: capitalize(slots.droppedThing),
    state,
    floatingThing: slots.floatingThing,
    sharedFeature: slots.sharedFeature,
    place: slots.place,
    refuter: slots.refuter,
    mapper: slots.mapper,
    leveller: slots.leveller
  };
}

function render(solution) {
  return `No. The relevant property is ${solution.property}. ${solution.object}’s ${solution.state} is a different object.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const propertyOfCause = { "less dense than liquid water": "density compared with the liquid" };',
  'const stateOfOutcome = { sinks: "sinking", floats: "floating" };',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the stall");',
  'probe(typeof slots.floatingThing === "string" && slots.floatingThing.length > 0, "the card must name the object that floats");',
  'probe(propertyOfCause[slots.cardCause] !== undefined, "the card must state a cause this section covers");',
  'probe(stateOfOutcome[slots.droppedOutcome] !== undefined, "the case must state an outcome this section covers");',
  'probe(slots.droppedThing !== slots.floatingThing, "the dropped object must differ from the object the card floats");',
  'probe(slots.comparedThings[1] === slots.floatingThing && slots.comparedThings[0] === slots.droppedThing, "the unshared-property reader must compare the dropped object with the card object");',
  'const object = slots.droppedThing.charAt(0).toUpperCase() + slots.droppedThing.slice(1);',
  'return "No. The relevant property is " + propertyOfCause[slots.cardCause] + ". " + object + "\\u2019s " + stateOfOutcome[slots.droppedOutcome] + " is a different object.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The school card in ${solution.place} explains floating with one named property: ${solution.property}.`,
    `${solution.refuter} reads the bar of ${slots.droppedThing} sinking as a refutation, but the bar is a different object and the card never claimed that every hard thing floats.`,
    `${solution.mapper} names the real gap: the two objects do not share the property that does the floating work, while ${solution.leveller} shares only ${solution.sharedFeature}, which does no work in the card.`,
    'A likeness supports a conclusion only when the property behind it transfers; sharing hardness transfers nothing.'
  ];
}

export const unit = 32;

export const cases = [
  {
    template: 'False analogy',
    type: slugify('False analogy'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
