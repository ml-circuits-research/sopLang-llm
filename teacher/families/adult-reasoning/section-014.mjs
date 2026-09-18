/**
 * Section 14 of the adult-reasoning course: units and conversions.
 *
 * Every variant posts the same DIY guide with the metric equalities and the
 * coverage of one tin, then records a wall whose width is printed in
 * centimetres and whose height is printed in metres, plus the name of the
 * painter and the tin that person owns. The printed answer converts the width
 * to metres, multiplies to get the area in square metres, and compares the
 * area with the coverage threshold of one coat. The variants change the
 * village, the width, and the painter, so the case keeps centimetres, metres,
 * and hundredths of a square metre as scaled integers and never mixes units in
 * one formula.
 */

import { slugify } from '../../naming.mjs';

const GUIDE_PATTERN = /DIY guide, ([^:]+):/;
const NOTICE_PATTERN =
  /“1 m = 100 cm\. 1 m² = 10 000 cm²\. 1 l = 1000 cm³\. A (\d+(?:\.\d+)?) l tin covers (\d+(?:\.\d+)?) m² per coat on a primed surface\. Do not mix units in one formula\.”/;
const WALL_PATTERN =
  /Wall (\d+) cm wide, (\d+(?:\.\d+)?) m high, primed\. ([A-Z][a-z]+) has one (\d+(?:\.\d+)?) l tin, (one|two) coats?\./;

function formatHundredths(hundredths) {
  return `${Math.trunc(hundredths / 100)}.${String(hundredths % 100).padStart(2, '0')}`;
}

function parse(statement) {
  const guide = GUIDE_PATTERN.exec(statement);
  const notice = NOTICE_PATTERN.exec(statement);
  const wall = WALL_PATTERN.exec(statement);
  if (guide === null || notice === null || wall === null) {
    throw new Error('the statement does not post the conversions and one wall with its painter');
  }
  const widthCm = Number(wall[1]);
  const heightMeters = Number(wall[2]);
  const tinLitres = Number(notice[1]);
  const coverageSquareMeters = Number(notice[2]);
  const stockedLitres = Number(wall[4]);
  const coats = wall[5] === 'one' ? 1 : 2;
  if (!Number.isInteger(widthCm) || widthCm <= 0 || !(heightMeters > 0) || !(coverageSquareMeters > 0)) {
    throw new Error('the width in centimetres, the height in metres, and the coverage must all be positive');
  }
  return {
    village: guide[1].trim(),
    painter: wall[3],
    wallWidthCm: widthCm,
    wallHeightMeters: heightMeters,
    tinLitres,
    stockedLitres,
    coverageSquareMeters,
    coats,
    primed: /, primed\./.test(statement)
  };
}

function solve(slots) {
  if (slots.stockedLitres !== slots.tinLitres) {
    throw new Error('the case must own the tin whose coverage the notice states');
  }
  const heightCentimetres = Math.round(slots.wallHeightMeters * 100);
  const areaHundredths = Math.round((slots.wallWidthCm * heightCentimetres) / 100);
  const coverageHundredths = Math.round(slots.coverageSquareMeters * 100) * slots.coats;
  return {
    sourceWidthCm: slots.wallWidthCm,
    widthMetersHundredths: slots.wallWidthCm,
    areaHundredths,
    coverageHundredths,
    coverageText: String(slots.coverageSquareMeters),
    enough: areaHundredths <= coverageHundredths
  };
}

function render(solution) {
  const verdict = solution.enough ? 'Enough' : 'Not enough';
  return `${solution.sourceWidthCm} cm = ${formatHundredths(solution.widthMetersHundredths)} m. Area ${formatHundredths(solution.areaHundredths)} m². ${verdict} (threshold ${solution.coverageText} m²).`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.village === "string" && slots.village.trim().length > 0, "the case must name the village of the guide");',
  'probe(typeof slots.painter === "string" && /^[A-Z][a-z]+$/.test(slots.painter), "the case must name the painter");',
  'probe(Number.isInteger(slots.wallWidthCm) && slots.wallWidthCm > 0, "the width must be a positive whole number of centimetres");',
  'probe(typeof slots.wallHeightMeters === "number" && slots.wallHeightMeters > 0, "the height must be a positive number of metres");',
  'probe(typeof slots.coverageSquareMeters === "number" && slots.coverageSquareMeters > 0, "the tin coverage must be a positive area");',
  'probe(slots.stockedLitres === slots.tinLitres, "the painter must own the tin the notice describes");',
  'probe(slots.coats === 1 || slots.coats === 2, "the case must ask for one or two coats");',
  'probe(slots.primed === true, "the wall must be primed for the stated coverage");',
  'const format = (hundredths) => Math.trunc(hundredths / 100) + "." + String(hundredths % 100).padStart(2, "0");',
  'const heightCentimetres = Math.round(slots.wallHeightMeters * 100);',
  'const areaHundredths = Math.round((slots.wallWidthCm * heightCentimetres) / 100);',
  'const coverageHundredths = Math.round(slots.coverageSquareMeters * 100) * slots.coats;',
  'probe(Number.isInteger(areaHundredths) && areaHundredths > 0, "the primed wall must have a positive area in whole hundredths of a square metre");',
  'probe(slots.wallWidthCm * heightCentimetres === areaHundredths * 100, "the area must be the wall area in square centimetres divided by ten thousand");',
  'const enough = areaHundredths <= coverageHundredths;',
  'return slots.wallWidthCm + " cm = " + format(slots.wallWidthCm) + " m. Area " + format(areaHundredths) + " m\\u00b2. " + (enough ? "Enough" : "Not enough") + " (threshold " + slots.coverageSquareMeters + " m\\u00b2).";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.wallWidthCm} cm is ${formatHundredths(solution.widthMetersHundredths)} m by the guide's first equality, so both wall measurements are read in metres before multiplying.`,
    `${formatHundredths(solution.widthMetersHundredths)} m times ${slots.wallHeightMeters} m gives ${formatHundredths(solution.areaHundredths)} m², which is the same as ${slots.wallWidthCm * Math.round(slots.wallHeightMeters * 100)} cm² divided by 10 000.`,
    `One ${slots.tinLitres} l tin covers ${slots.coverageSquareMeters} m² per coat, so ${slots.coats === 1 ? 'one coat needs' : 'two coats need'} ${formatHundredths(solution.coverageHundredths)} m² of coverage against the ${formatHundredths(solution.areaHundredths)} m² wall.`,
    solution.enough
      ? `${slots.painter}'s single tin covers the primed wall at ${formatHundredths(solution.areaHundredths)} m², so it is enough.`
      : `${slots.painter}'s single tin falls short of the primed wall at ${formatHundredths(solution.areaHundredths)} m², so it is not enough.`
  ];
}

export const unit = 14;

export const cases = [
  {
    template: 'Units and conversions',
    type: slugify('Units and conversions'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
