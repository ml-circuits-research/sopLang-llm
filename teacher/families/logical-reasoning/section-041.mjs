/**
 * Section 41 of the logical-reasoning book: moving together is not making.
 *
 * Every case prints notes in which ice-cream sales and recorded lake swims
 * rose in the same hot month, one speaker who says the sales cause the swims,
 * one speaker who names heat as a common driver listed in the same notes, and
 * one speaker who says two columns that rise together have proved a cause.
 * The cases change the place and the three names; the two counts, the month,
 * the amusing cause, and its effect are read from the statement, so the forced
 * verdict is only the joint rise and never the causal claim.
 */

import { slugify } from '../../naming.mjs';

const NOTES_PATTERN =
  /Notes in ([^:]+): ([a-z-]+) sales and recorded lake swims both rose in the same ([a-z]+ month)\. ([A-Z][a-z]+) says ([a-z-]+) causes (\w+)\. ([A-Z][a-z]+) names (\w+) as a common driver listed in the same notes \(\u201cthe month was ([a-z]+)\u201d\)\. ([A-Z][a-z]+) says two columns that rise together have already proved a cause\./;

function parse(statement) {
  const notes = NOTES_PATTERN.exec(statement);
  if (notes === null) {
    throw new Error('the statement does not record the notes, the common driver, and the three speakers');
  }
  return {
    place: notes[1].trim(),
    product: notes[2],
    season: notes[3],
    claimant: notes[4],
    cause: notes[5],
    effect: notes[6],
    driverNamer: notes[7],
    driver: notes[8],
    monthWord: notes[9],
    leveler: notes[10]
  };
}

/**
 * Joint movement in one hot month is the only thing the notes force. The
 * amusing column the first speaker promotes is the very column the notes
 * merely count, and the month is the listed rival that can drive both counts,
 * so the causal claim is never forced.
 */
function solve(slots) {
  if (slots.season !== `${slots.monthWord} month`) {
    throw new Error(`the notes state the month as "${slots.season}" but the driver sentence calls it "${slots.monthWord}"`);
  }
  if (slots.cause === slots.driver || slots.effect === slots.driver) {
    throw new Error(`the common driver ${slots.driver} must be a third quantity, not the promoted cause or its effect`);
  }
  return {
    season: slots.season,
    cause: slots.cause,
    effect: slots.effect,
    driver: slots.driver
  };
}

function render(solution) {
  return `Only that the two counts rose together in a ${solution.season}. Cause from ${solution.cause} to ${solution.effect} is not forced.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the notes");',
  'probe(typeof slots.season === "string" && slots.season.length > 0, "the case must name the month the two counts rose in");',
  'probe(typeof slots.cause === "string" && slots.cause.length > 0, "the case must name the column the first speaker promotes as a cause");',
  'probe(typeof slots.effect === "string" && slots.effect.length > 0, "the case must name the outcome the first speaker claims it produces");',
  'probe(typeof slots.driver === "string" && slots.driver.length > 0, "the case must name the common driver listed in the same notes");',
  'probe(typeof slots.claimant === "string" && slots.claimant.length > 0, "the case must name the speaker who claims the cause");',
  'probe(typeof slots.driverNamer === "string" && slots.driverNamer.length > 0, "the case must name the speaker who names the common driver");',
  'probe(typeof slots.leveler === "string" && slots.leveler.length > 0, "the case must name the speaker who treats the joint rise as proof of a cause");',
  'probe(new Set([slots.claimant, slots.driverNamer, slots.leveler]).size === 3, "the three speakers must be three different people");',
  'probe(slots.season === slots.monthWord + " month", "the month of the notes must be the month the driver sentence names");',
  'probe(slots.cause !== slots.effect && slots.driver !== slots.cause && slots.driver !== slots.effect, "the common driver must be a third quantity");',
  'return "Only that the two counts rose together in a " + slots.season + ". Cause from " + slots.cause + " to " + slots.effect + " is not forced.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The notes in ${slots.place} record one joint movement: ${slots.product} sales and recorded lake swims both rose in the same ${slots.season}.`,
    `${slots.claimant} says ${slots.cause} causes ${slots.effect}, yet joint movement is not making, and the notes force only that the two counts moved together.`,
    `${slots.driverNamer} names ${slots.driver} as a common driver listed in the same notes, which can move both counts without either one causing the other.`,
    `${slots.leveler} awards the causal prize to the amusing column, but the printed verdict keeps "together" until a contrast arrives.`
  ];
}

export const unit = 41;

export const cases = [
  {
    template: 'Moving together is not making',
    type: slugify('Moving together is not making'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
