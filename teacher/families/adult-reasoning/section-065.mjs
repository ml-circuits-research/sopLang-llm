/**
 * Section 65 of the adult-reasoning course: numeric scale and real distance.
 *
 * Every variant prints the same numerical scale 1:50 000 with its printed
 * reading — one centimetre on the map is 500 metres, that is 0.5 kilometres —
 * and a person measuring a whole number of centimetres between two wells. The
 * verdict multiplies the measurement by the kilometre reading and repeats the
 * same distance in metres. The cases change the person and the measurement, so
 * the family derives the kilometre reading from the parsed scale and checks it
 * against the printed reading instead of repeating a constant.
 */

import { slugify } from '../../naming.mjs';

const SCALE_PATTERN = /Map scale 1:(\d{1,3})(?: (\d{3}))?\./;
const READING_PATTERN = /“1 cm on the map = (\d+) m = ([\d.]+) km\.”/;
const MEASURE_PATTERN = /([A-Z][a-z]+) measures (\d+(?:\.\d+)?) cm between two wells\./;

function parse(statement) {
  const scale = SCALE_PATTERN.exec(statement);
  const reading = READING_PATTERN.exec(statement);
  const measure = MEASURE_PATTERN.exec(statement);
  if (scale === null || reading === null || measure === null) {
    throw new Error('the statement does not print the numerical scale, its reading, and the measurement');
  }
  const denominator = Number(`${scale[1]}${scale[2] ?? ''}`);
  if (!(denominator > 1)) {
    throw new Error('the numerical scale must print a denominator larger than one');
  }
  // A scale of 1:n makes one map centimetre n centimetres, that is n/100 metres.
  const metresPerCm = denominator / 100;
  const printedMetres = Number(reading[1]);
  const printedKilometres = Number(reading[2]);
  if (printedMetres !== metresPerCm || printedKilometres !== metresPerCm / 1000) {
    throw new Error('the printed map reading does not agree with the printed numerical scale');
  }
  const measuredCm = Number(measure[2]);
  if (!(measuredCm > 0)) {
    throw new Error('the measured length on the map must be a positive quantity');
  }
  return {
    person: measure[1],
    denominator,
    metresPerCm,
    kilometresPerCm: metresPerCm / 1000,
    measuredCm
  };
}

function solve(slots) {
  const kilometres = slots.measuredCm * slots.kilometresPerCm;
  const metres = slots.measuredCm * slots.metresPerCm;
  return {
    kilometres,
    metres,
    distanceClause: `${slots.measuredCm} × ${slots.kilometresPerCm} km = ${kilometres.toFixed(1)} km (${metres} m).`
  };
}

function render(solution) {
  return solution.distanceClause;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.person === "string" && slots.person.length > 0, "the case must name the person who measures");',
  'probe(Number.isInteger(slots.denominator) && slots.denominator > 1, "the scale denominator must be a whole number larger than one");',
  'probe(typeof slots.metresPerCm === "number" && slots.metresPerCm > 0, "one map centimetre must carry a positive real length");',
  'probe(slots.kilometresPerCm === slots.metresPerCm / 1000, "the printed kilometre reading must be the metre reading divided by a thousand");',
  'probe(slots.metresPerCm === slots.denominator / 100, "one map centimetre must be the scale denominator in centimetres");',
  'probe(typeof slots.measuredCm === "number" && slots.measuredCm > 0, "the measured length on the map must be positive");',
  'const kilometres = slots.measuredCm * slots.kilometresPerCm;',
  'const metres = slots.measuredCm * slots.metresPerCm;',
  'probe(kilometres > 0 && metres > 0, "the real distance must be a positive quantity");',
  'probe(Math.abs(kilometres * 1000 - metres) < 1e-9, "the kilometre and metre answers must be the same distance");',
  'probe(Number.isInteger(metres), "the real distance in metres must be a whole number for the printed brackets");',
  'return slots.measuredCm + " × " + slots.kilometresPerCm + " km = " + kilometres.toFixed(1) + " km (" + metres + " m).";'
].join('\n');

function explain(slots, solution) {
  return [
    `The numerical scale 1:${slots.denominator} means one centimetre on the map is ${slots.denominator} centimetres on the ground, which is the printed reading of ${slots.metresPerCm} m or ${slots.kilometresPerCm} km.`,
    `${slots.person} measures ${slots.measuredCm} cm between the two wells, so the real distance is ${slots.measuredCm} times the reading of ${slots.kilometresPerCm} km.`,
    `That gives ${solution.kilometres.toFixed(1)} km, which is the same distance as ${solution.metres} m when the kilometre answer is written in metres.`
  ];
}

export const unit = 65;

export const cases = [
  {
    template: 'Numeric scale and real distance',
    type: slugify('Numeric scale and real distance'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
