/**
 * Section 27 of the adult-reasoning course: hygiene and cross-contamination.
 *
 * Every variant posts the same canteen sheet and one episode: a person cracks
 * raw eggs on the green (ready) board, wipes their hands for fewer seconds than
 * the sheet requires on a towel older than the change interval, leaves salad on
 * that board, stores raw meat on the ready shelf beside yoghurts, keeps the
 * fridge above the sheet's maximum, and a second person rinses raw meat under a
 * jet. The verdict lists the seven breaches, each keyed to the sheet sentence
 * it violates. The variants change the kitchen place and the two names; the
 * numbers are derived from the parsed sheet and episode.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN =
  /Canteen sheet, ([^:]+): “After raw eggs, wash (\d+) s before a ready-to-eat food\. Red board = raw, green = ready\. Do not rinse raw meat under a jet\. Fridge ≤(\d+) °C\. Ready food up, raw down\. Dish towel changed every (\d+) h\.”/;
const EGG_PATTERN =
  /([A-Z][a-z]+) cracks eggs on (\w+), wipes hands (\d+) s on a (\d+)-hour towel,/;
const SALAD_PATTERN = /puts salad on the same board/;
const MEAT_PATTERN = /puts meat up beside yoghurts/;
const JET_PATTERN = /Fridge (\d+) °C\. ([A-Z][a-z]+) runs a jet over raw meat\./;

function parse(statement) {
  const sheet = SHEET_PATTERN.exec(statement);
  const egg = EGG_PATTERN.exec(statement);
  const jet = JET_PATTERN.exec(statement);
  if (sheet === null || egg === null || jet === null) {
    throw new Error('the statement does not describe the canteen sheet and the two handling episodes');
  }
  if (!SALAD_PATTERN.test(statement) || !MEAT_PATTERN.test(statement)) {
    throw new Error('the statement does not place the salad and the raw meat as the sheet forbids');
  }
  return {
    place: sheet[1].trim(),
    washSeconds: Number(sheet[2]),
    fridgeMax: Number(sheet[3]),
    towelLimitHours: Number(sheet[4]),
    runner: egg[1],
    eggBoard: egg[2],
    wipeSeconds: Number(egg[3]),
    towelHours: Number(egg[4]),
    saladOnSameBoard: true,
    rawUp: true,
    fridgeTemp: Number(jet[1]),
    helper: jet[2],
    jetOnMeat: true
  };
}

function solve(slots) {
  if (slots.eggBoard !== 'green') {
    throw new Error('the variant does not crack raw eggs on the ready board');
  }
  const breaches = [];
  breaches.push(`${slots.eggBoard.charAt(0).toUpperCase()}${slots.eggBoard.slice(1)} for raw`);
  if (slots.wipeSeconds < slots.washSeconds) {
    breaches.push(`${slots.wipeSeconds} s`);
  }
  if (slots.towelHours > slots.towelLimitHours) {
    breaches.push(`${slots.towelHours}-hour towel`);
  }
  if (slots.saladOnSameBoard) {
    breaches.push('salad on a contaminated board');
  }
  if (slots.rawUp) {
    breaches.push('raw up');
  }
  if (slots.fridgeTemp > slots.fridgeMax) {
    breaches.push(`${slots.fridgeTemp}>${slots.fridgeMax} °C`);
  }
  if (slots.jetOnMeat) {
    breaches.push('jet on meat');
  }
  return { breaches };
}

function render(solution) {
  return `${solution.breaches.join('; ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.runner === "string" && slots.runner.length > 0, "the statement must name the person working the boards");',
  'probe(typeof slots.helper === "string" && slots.helper.length > 0, "the statement must name the person rinsing the meat");',
  'probe(slots.runner !== slots.helper, "the two named people must be different");',
  'probe(Number.isInteger(slots.washSeconds) && slots.washSeconds > 0, "the required hand-wash time must be a positive whole number of seconds");',
  'probe(Number.isInteger(slots.towelLimitHours) && slots.towelLimitHours > 0, "the towel change interval must be a positive whole number of hours");',
  'probe(Number.isInteger(slots.wipeSeconds) && slots.wipeSeconds >= 0, "the actual hand-wash time must be a whole number of seconds");',
  'probe(Number.isInteger(slots.towelHours) && slots.towelHours >= 0, "the towel age must be a whole number of hours");',
  'probe(slots.eggBoard === "green", "the raw eggs must be cracked on the ready board to breach the colour rule");',
  'probe(Number.isInteger(slots.fridgeTemp) && Number.isInteger(slots.fridgeMax) && slots.fridgeTemp > slots.fridgeMax, "the stem states the fridge is above the sheet maximum");',
  'const breaches = [];',
  'breaches.push(slots.eggBoard.charAt(0).toUpperCase() + slots.eggBoard.slice(1) + " for raw");',
  'if (slots.wipeSeconds < slots.washSeconds) { breaches.push(slots.wipeSeconds + " s"); }',
  'if (slots.towelHours > slots.towelLimitHours) { breaches.push(slots.towelHours + "-hour towel"); }',
  'if (slots.saladOnSameBoard) { breaches.push("salad on a contaminated board"); }',
  'if (slots.rawUp) { breaches.push("raw up"); }',
  'if (slots.fridgeTemp > slots.fridgeMax) { breaches.push(slots.fridgeTemp + ">" + slots.fridgeMax + " °C"); }',
  'if (slots.jetOnMeat) { breaches.push("jet on meat"); }',
  'return breaches.join("; ") + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The sheet at the canteen in ${slots.place} gives ${slots.washSeconds} s of washing after raw eggs before a ready-to-eat food, so ${slots.runner}'s ${slots.wipeSeconds} s on a ${slots.towelHours}-hour towel breaks both the wash time and the ${slots.towelLimitHours}-hour towel change.`,
    `Green is the ready board, so cracking raw eggs on it puts the salad that stays on the same board in contact with the raw traces; the sheet's storage rule is ready food up and raw down, so the meat beside the yoghurts is a third breach.`,
    `The fridge reads ${slots.fridgeTemp} °C against the sheet's maximum of ${slots.fridgeMax} °C, and ${slots.helper} rinsing raw meat under a jet breaks the sentence that forbids the jet.`,
    `Each of the ${solution.breaches.length} listed items is tied to one of those sentences, and nothing on the sheet is satisfied by good intention.`
  ];
}

export const unit = 27;

export const cases = [
  {
    template: 'Hygiene and cross-contamination',
    type: slugify('Hygiene and cross-contamination'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
