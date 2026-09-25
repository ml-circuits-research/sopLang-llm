/**
 * Section 42 of the logical-reasoning book: a common cause.
 *
 * Every case prints a clinic table in a named place where hot-drink sales and
 * headache complaints rise together on the same listed heatwave days, and three
 * people read the table: the first blames the drink, the second names the heat
 * that may lift both, the third treats the coincidence itself as a mechanism.
 * The case data changes the place and the three names; the reasoning is fixed:
 * a driver the page already puts behind both columns is available, while the
 * drink-to-headache arrow is not. The family reads the two claims and renders
 * the printed verdict with the driver the second speaker named.
 */

import { slugify } from '../../naming.mjs';

const TEMPLATE = 'Common cause';

const TABLE_PATTERN =
  /Clinic table in ([A-Z][A-Za-z ]+): hot-drink sales and headache complaints both rose on the same listed heatwave days\. ([A-Z][a-z]+) says ([a-z]+) causes ([a-z]+)\. ([A-Z][a-z]+) says ([a-z]+) may lift both ([a-z]+) and ([a-z]+)\. ([A-Z][a-z]+) says the coincidence of two rises is already a mechanism\./;

function sentenceCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function parse(statement) {
  const table = TABLE_PATTERN.exec(statement);
  if (table === null) {
    throw new Error('the statement does not print the clinic table with its three readings');
  }
  return {
    place: table[1],
    arrowSpeaker: table[2],
    exposure: table[3],
    outcome: table[4],
    driverSpeaker: table[5],
    driver: table[6],
    lifted: [table[7], table[8]],
    coincidenceSpeaker: table[9]
  };
}

function solve(slots) {
  if (!slots.lifted.includes(slots.outcome)) {
    throw new Error('the driver claim does not cover the symptom the arrow claim blames');
  }
  if (slots.exposure === slots.driver) {
    throw new Error('the blamed exposure and the named driver must be different');
  }
  const speakers = [slots.arrowSpeaker, slots.driverSpeaker, slots.coincidenceSpeaker];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three readings must come from three different speakers');
  }
  return { driver: slots.driver, exposure: slots.exposure };
}

function render(solution) {
  return `A common driver — ${solution.driver} — sitting behind both rises. ${sentenceCase(solution.exposure)}-as-cause is a jump.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "A common driver — " + slots.driver + " — sitting behind both rises. " + slots.exposure.charAt(0).toUpperCase() + slots.exposure.slice(1) + "-as-cause is a jump.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The table in ${slots.place} puts hot-drink sales and headache complaints on the same listed heatwave days, so the two columns rise together.`,
    `${slots.driverSpeaker} names ${solution.driver}, which the page already puts behind the thirst and the headache alike, so that story is at least listed as possible.`,
    `${slots.arrowSpeaker} jumps from the pairing to ${solution.exposure} causing ${slots.outcome}; nothing on the page closes off the common driver, and a coincidence of two rises is not itself a mechanism.`
  ];
}

export const unit = 42;

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
