/**
 * Section 15 of the adult-reasoning course: averages, ratios, and parts of a
 * whole.
 *
 * Every variant posts the same nursery notebook with the definition of the
 * arithmetic mean and of a ratio, then records three group sizes in litres and
 * the person who writes the mean and the min:max ratio. The printed answer is
 * the mean to two decimal places and the ratio of the smallest group to the
 * largest. The variants change the ward, the three sizes, and the writer, so
 * the case keeps the mean as hundredths of a litre and reads the ratio from the
 * extreme sizes of the parsed triple.
 */

import { slugify } from '../../naming.mjs';

const NOTEBOOK_PATTERN = /Nursery notebook, ([^:]+):/;
const GROUPS_PATTERN =
  /Three groups have (\d+), (\d+), (\d+) litres\. ([A-Z][a-z]+) writes the mean and the min:max ratio\./;

function formatHundredths(hundredths) {
  return `${Math.trunc(hundredths / 100)}.${String(hundredths % 100).padStart(2, '0')}`;
}

function parse(statement) {
  const notebook = NOTEBOOK_PATTERN.exec(statement);
  const groups = GROUPS_PATTERN.exec(statement);
  if (notebook === null || groups === null) {
    throw new Error('the statement does not record three group sizes and the writer of the mean');
  }
  const litres = [Number(groups[1]), Number(groups[2]), Number(groups[3])];
  if (litres.some((value) => !Number.isInteger(value) || value <= 0)) {
    throw new Error('the three group sizes must be positive whole litres');
  }
  if (new Set(litres).size !== litres.length) {
    throw new Error('the three group sizes must differ for the min:max ratio to be defined');
  }
  return {
    ward: notebook[1].trim(),
    writer: groups[4],
    litres,
    arithmeticMean: /Arithmetic mean = sum \/ how many/.test(statement),
    ratioRule: /Ratio A:B = A parts to B parts/.test(statement)
  };
}

function solve(slots) {
  const total = slots.litres.reduce((sum, value) => sum + value, 0);
  const meanHundredths = Math.round((total * 100) / slots.litres.length);
  const smallest = Math.min(...slots.litres);
  const largest = Math.max(...slots.litres);
  if (!(smallest < largest)) {
    throw new Error('the three group sizes must have a smallest and a largest member');
  }
  return { meanHundredths, smallest, largest };
}

function render(solution) {
  return `Mean ${formatHundredths(solution.meanHundredths)} l. Ratio ${solution.smallest}:${solution.largest}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.ward === "string" && slots.ward.trim().length > 0, "the case must name the ward of the notebook");',
  'probe(typeof slots.writer === "string" && /^[A-Z][a-z]+$/.test(slots.writer), "the case must name the person writing the mean");',
  'probe(Array.isArray(slots.litres) && slots.litres.length === 3, "the case must carry exactly three group sizes");',
  'probe(slots.litres.every((value) => Number.isInteger(value) && value > 0), "every group size must be a positive whole number of litres");',
  'probe(new Set(slots.litres).size === 3, "the three group sizes must differ");',
  'probe(slots.arithmeticMean === true, "the notebook must define the arithmetic mean as the sum over how many");',
  'probe(slots.ratioRule === true, "the notebook must define a ratio as parts to parts");',
  'const format = (hundredths) => Math.trunc(hundredths / 100) + "." + String(hundredths % 100).padStart(2, "0");',
  'const total = slots.litres[0] + slots.litres[1] + slots.litres[2];',
  'const meanHundredths = Math.round((total * 100) / 3);',
  'const smallest = Math.min(slots.litres[0], slots.litres[1], slots.litres[2]);',
  'const largest = Math.max(slots.litres[0], slots.litres[1], slots.litres[2]);',
  'probe(smallest < meanHundredths / 100 && meanHundredths / 100 < largest, "the mean of three numbers must lie between the smallest and the largest");',
  'return "Mean " + format(meanHundredths) + " l. Ratio " + smallest + ":" + largest + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The mean is the sum over how many, so ${slots.litres.join(' + ')} = ${slots.litres[0] + slots.litres[1] + slots.litres[2]} litres over three groups.`,
    `That gives ${formatHundredths(solution.meanHundredths)} litres, and it is neither the middle value nor the most frequent one, which the notebook excludes.`,
    `The ratio takes parts to parts, so the smallest group of ${solution.smallest} litres and the largest of ${solution.largest} litres are written ${solution.smallest}:${solution.largest}.`,
    `${slots.writer} writes both numbers in ${slots.ward}, and the ratio uses the extreme group sizes, not the mean.`
  ];
}

export const unit = 15;

export const cases = [
  {
    template: 'Averages, ratios, and parts of a whole',
    type: slugify('Averages, ratios, and parts of a whole'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
