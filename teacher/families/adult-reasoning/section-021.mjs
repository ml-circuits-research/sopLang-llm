/**
 * Section 21 of the adult-reasoning course: nutrition labels.
 *
 * Every variant prints a cereal label per 100 g, a recommended serving, the
 * pack weight, a front claim of "reduced salt", and the category mean the back
 * of the pack compares against; the eater takes half a pack, not one serving.
 * The variants change the parish, the energy and pack values, the serving size,
 * and the eater, so the family scales the per-100 g figures from the exact half
 * pack, prints the half weight with the label's own tie-to-even rounding, and
 * tests the claim against the printed reference.
 */

import { slugify } from '../../naming.mjs';

const LABEL_PATTERN = /Cereal label, ([^:]+):/;
const ENERGY_PATTERN = /Per 100 g: (\d+) kcal, (\d+) g protein, (\d+) g sugars, (\d+(?:\.\d+)?) g salt\./;
const SERVING_PATTERN = /Recommended serving (\d+) g\./;
const PACK_PATTERN = /Pack (\d+) g\./;
const MEAN_PATTERN = /category mean (\d+(?:\.\d+)?) g salt\/100 g/;
const EATER_PATTERN = /^([A-Z][a-z]+) eats half a pack\./m;

/** The label's own rounding rule: a half gram rounds to the even gram. */
function roundHalfEven(value) {
  const whole = Math.floor(value);
  const rest = value - whole;
  if (rest > 0.5) return whole + 1;
  if (rest < 0.5) return whole;
  return whole % 2 === 0 ? whole : whole + 1;
}

function parse(statement) {
  const label = LABEL_PATTERN.exec(statement);
  const energy = ENERGY_PATTERN.exec(statement);
  const serving = SERVING_PATTERN.exec(statement);
  const pack = PACK_PATTERN.exec(statement);
  const mean = MEAN_PATTERN.exec(statement);
  const eater = EATER_PATTERN.exec(statement);
  if (label === null || energy === null || serving === null || pack === null || mean === null || eater === null) {
    throw new Error('the statement does not describe the cereal label, the pack, and the person eating');
  }
  return {
    place: label[1],
    eater: eater[1],
    kcalPer100: Number(energy[1]),
    saltLabel: energy[4],
    saltPer100Hundredths: Math.round(Number(energy[4]) * 100),
    serving: Number(serving[1]),
    pack: Number(pack[1]),
    meanLabel: mean[1],
    meanHundredths: Math.round(Number(mean[1]) * 100)
  };
}

function solve(slots) {
  const exactHalf = slots.pack / 2;
  const half = roundHalfEven(exactHalf);
  const kcal = Math.round((slots.kcalPer100 * exactHalf) / 100);
  const saltHundredths = Math.round((slots.saltPer100Hundredths * exactHalf) / 100);
  const claim = slots.saltPer100Hundredths < slots.meanHundredths
    ? `${slots.saltLabel}<${slots.meanLabel}, so the claim is consistent with the printed reference.`
    : `${slots.saltLabel} is not below ${slots.meanLabel}, so the claim is not consistent with the printed reference.`;
  return {
    place: slots.place,
    eater: slots.eater,
    serving: slots.serving,
    half,
    kcal,
    salt: (saltHundredths / 100).toFixed(2),
    claim
  };
}

function render(solution) {
  return `${solution.half} g → ${solution.kcal} kcal and ${solution.salt} g salt. ${solution.claim}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the label must name the place");',
  'probe(typeof slots.eater === "string" && slots.eater.length > 0, "the case must name the person eating");',
  'probe(Number.isInteger(slots.kcalPer100) && slots.kcalPer100 > 0, "the label must give a positive energy per 100 g");',
  'probe(Number.isInteger(slots.saltPer100Hundredths) && slots.saltPer100Hundredths > 0, "the label must give a positive salt amount per 100 g");',
  'probe(Number.isInteger(slots.meanHundredths) && slots.meanHundredths > 0, "the back must print a positive category mean");',
  'probe(Number.isInteger(slots.serving) && slots.serving > 0, "the label must recommend a positive serving");',
  'probe(Number.isInteger(slots.pack) && slots.pack > 0, "the pack must weigh a positive number of grams");',
  'probe(typeof slots.saltLabel === "string" && typeof slots.meanLabel === "string", "the printed salt figures must be carried as text");',
  'const roundHalfEven = (value) => {',
  '  const whole = Math.floor(value);',
  '  const rest = value - whole;',
  '  if (rest > 0.5) { return whole + 1; }',
  '  if (rest < 0.5) { return whole; }',
  '  return whole % 2 === 0 ? whole : whole + 1;',
  '};',
  'const exactHalf = slots.pack / 2;',
  'const half = roundHalfEven(exactHalf);',
  'probe(half > 0 && half <= slots.pack, "the half pack must weigh no more than the pack");',
  'const kcal = Math.round((slots.kcalPer100 * exactHalf) / 100);',
  'const saltHundredths = Math.round((slots.saltPer100Hundredths * exactHalf) / 100);',
  'const claim = slots.saltPer100Hundredths < slots.meanHundredths',
  '  ? slots.saltLabel + "<" + slots.meanLabel + ", so the claim is consistent with the printed reference."',
  '  : slots.saltLabel + " is not below " + slots.meanLabel + ", so the claim is not consistent with the printed reference.";',
  'return half + " g \u2192 " + kcal + " kcal and " + (saltHundredths / 100).toFixed(2) + " g salt. " + claim;'
].join('\n');

function explain(slots, solution) {
  return [
    `The label states its values per 100 g, but ${solution.eater} eats half a pack of ${slots.pack} g rather than the recommended ${solution.serving} g serving, so the serving size does not decide what is eaten.`,
    `Scaling ${slots.kcalPer100} kcal and the printed salt figure to the exact half pack gives ${solution.kcal} kcal and ${solution.salt} g of salt eaten, while the half weight itself is printed as ${solution.half} g with the label's own rounding.`,
    `The front claim is judged against the reference the pack itself prints, and ${solution.claim}`
  ];
}

export const unit = 21;

export const cases = [
  {
    template: 'Nutrition labels',
    type: slugify('Nutrition labels'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
