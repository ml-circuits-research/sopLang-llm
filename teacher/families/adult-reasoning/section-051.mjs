/**
 * Section 51 of the adult-reasoning course: density, weight, and floating.
 *
 * Every variant posts the same club sheet at a place: a body floats when its
 * density is below the density of water (1 g/cm³), the density is mass divided
 * by volume, a density equal to water means suspended, and trapped air lowers
 * the average density of the whole. The narrative then weighs one lump of clay
 * and gives it two shapes: a solid cube and a boat whose trapped air makes it
 * displace a larger volume. The verdict prints both densities to two decimals
 * and reads the fate off the sheet's rule. The cases vary the mass, the cube,
 * the boat, and the place, so both densities and both fates are computed from
 * the parsed quantities, and the quotient stays exact while the printed value
 * is rounded.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN = /Club sheet, ([^:]+): /;
const WATER_PATTERN = /density < water’s density \((\d+(?:\.\d+)?) g\/cm³\)/;
const CLAY_PATTERN = /Clay (\d+) g: cube (\d+) cm³; boat that displaces (\d+) cm³ with air\./;
const SUSPENDED_PATTERN = /Equal to 1: suspended\./;
const TRAPPED_AIR_PATTERN = /Trapped air lowers the average density/;

function formatDensity(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

/**
 * The sheet's rule, applied to one shape: the quotient is compared with the
 * water density exactly, while the printed density is rounded to two decimals.
 */
function densityFate(massGrams, volumeCm3, waterDensity) {
  const density = massGrams / volumeCm3;
  const shown = density.toFixed(2);
  const water = formatDensity(waterDensity);
  if (density > waterDensity) {
    return { density, clause: `${shown} > ${water} → sinks` };
  }
  if (density < waterDensity) {
    return { density, clause: `${shown} < ${water} → floats` };
  }
  return { density, clause: `${shown} = ${water} → suspended` };
}

function parse(statement) {
  const sheet = SHEET_PATTERN.exec(statement);
  const water = WATER_PATTERN.exec(statement);
  const clay = CLAY_PATTERN.exec(statement);
  if (sheet === null || water === null || clay === null) {
    throw new Error('the statement does not carry the sheet, the water density, and the two shapes');
  }
  return {
    place: sheet[1],
    waterDensity: Number(water[1]),
    massGrams: Number(clay[1]),
    cubeVolumeCm3: Number(clay[2]),
    boatVolumeCm3: Number(clay[3]),
    suspendedAtWaterDensity: SUSPENDED_PATTERN.test(statement),
    trappedAirLowersDensity: TRAPPED_AIR_PATTERN.test(statement)
  };
}

function solve(slots) {
  if (slots.massGrams <= 0 || slots.cubeVolumeCm3 <= 0 || slots.boatVolumeCm3 <= 0) {
    throw new Error('the clay, the cube, and the boat must all be positive quantities');
  }
  if (slots.boatVolumeCm3 <= slots.cubeVolumeCm3) {
    throw new Error('the boat must displace more water than the solid cube because of its trapped air');
  }
  if (slots.suspendedAtWaterDensity !== true) {
    throw new Error('the sheet must state the fate of a density equal to water');
  }
  return {
    cube: densityFate(slots.massGrams, slots.cubeVolumeCm3, slots.waterDensity),
    boat: densityFate(slots.massGrams, slots.boatVolumeCm3, slots.waterDensity)
  };
}

function render(solution) {
  return `Cube ${solution.cube.clause}. Boat ${solution.boat.clause}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const formatDensity = (value) => Number.isInteger(value) ? String(value) : value.toFixed(2);',
  'const densityFate = (massGrams, volumeCm3) => {',
  '  const density = massGrams / volumeCm3;',
  '  const shown = density.toFixed(2);',
  '  const water = formatDensity(slots.waterDensity);',
  '  if (density > slots.waterDensity) { return shown + " > " + water + " → sinks"; }',
  '  if (density < slots.waterDensity) { return shown + " < " + water + " → floats"; }',
  '  return shown + " = " + water + " → suspended";',
  '};',
  'const cube = densityFate(slots.massGrams, slots.cubeVolumeCm3);',
  'const boat = densityFate(slots.massGrams, slots.boatVolumeCm3);',
  'return "Cube " + cube + ". Boat " + boat + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The club of ${slots.place} measures density as mass divided by volume, so the ${slots.massGrams} g of clay divided by the ${slots.cubeVolumeCm3} cm³ of the solid cube gives ${solution.cube.density.toFixed(2)}, above the water density of ${formatDensity(slots.waterDensity)} g/cm³, and the cube sinks.`,
    `The same ${slots.massGrams} g shaped into a boat displaces ${slots.boatVolumeCm3} cm³, so the average density falls to ${solution.boat.density.toFixed(2)}, below water, and the boat floats.`,
    `The trapped air is what lowers the average density of the whole: the mass never changes, but the volume the shape pushes aside grows from ${slots.cubeVolumeCm3} cm³ to ${slots.boatVolumeCm3} cm³, and the sheet reads a density equal to water as suspended.`
  ];
}

export const unit = 51;

export const cases = [
  {
    template: 'Density, weight, and floating',
    type: slugify('Density, weight, and floating'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
