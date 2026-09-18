/**
 * Form 39 of the scientific-reasoning book: error, deviation, and
 * reconciliation of measurements.
 *
 * Every variant prints a short series of repeated measurements of one quantity
 * and states the sheet rule: in a stable system the repeats form a group with
 * small differences, while a series that changes steadily can indicate drift
 * rather than a single bad point. The family classifies the shape of the series
 * (an isolated value far from the rest, a steady change, or neither) and
 * reports the median as the robust center, always with the rule that
 * verification precedes any correction.
 *
 * The isolated value is the single measurement outside the Tukey fences of the
 * series (first and third quartile, one and a half interquartile ranges); the
 * drift is a strictly constant step between consecutive measurements in the
 * printed order. The variants change the world and the measured quantity
 * (visits, dispersal distance, air volume, travel time), not the reasoning.
 */

import { slugify } from '../../naming.mjs';

const SERIES_PATTERN = /Repeated measurements for “(.+?)” \((.+?)\): ([\d, ]+)\./;
const FENCE_FACTOR = 1.5;

function parse(statement) {
  const series = SERIES_PATTERN.exec(statement);
  if (series === null) {
    throw new Error('the statement does not print a series of repeated measurements');
  }
  const values = series[3]
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value !== '')
    .map((value) => Number(value));
  if (values.length < 4 || values.some((value) => !Number.isFinite(value))) {
    throw new Error('the series must list at least four numeric measurements');
  }
  return { quantity: series[1], unit: series[2], values };
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/** First and third quartile by the half-split method: the odd middle is dropped. */
function quartiles(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const half = Math.floor(sorted.length / 2);
  return { low: median(sorted.slice(0, half)), high: median(sorted.slice(sorted.length - half)) };
}

function solve(slots) {
  const center = median(slots.values);
  const { low, high } = quartiles(slots.values);
  const spread = high - low;
  const suspicious = slots.values.filter(
    (value) => value < low - FENCE_FACTOR * spread || value > high + FENCE_FACTOR * spread
  );
  if (suspicious.length > 1) {
    const ambiguity = new Error(`the series shows ${suspicious.length} values beyond the fences, not one isolated point`);
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  if (suspicious.length === 1) {
    return { shape: 'outlier', outlier: suspicious[0], median: center };
  }
  const steps = slots.values.slice(1).map((value, index) => value - slots.values[index]);
  const drifting = steps.every((step) => step === steps[0] && step !== 0);
  return { shape: drifting ? 'drift' : 'none', outlier: null, median: center };
}

function render(solution) {
  if (solution.shape === 'outlier') {
    return `The series contains an isolated suspicious point: ${solution.outlier}; verification must precede any correction. A robust center is the median ${solution.median}.`;
  }
  if (solution.shape === 'drift') {
    return `The diagnosis of the series: a gradual drift, not a single outlier; verification must precede any correction. A robust center is the median ${solution.median}, but the series must also be analyzed in temporal order.`;
  }
  return `The series shows no evident outlier in the model; verification must precede any correction. A robust center is the median ${solution.median}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.quantity === "string" && slots.quantity.length > 0, "the series must name the measured quantity");',
  'probe(Array.isArray(slots.values) && slots.values.length >= 4, "the series must list at least four repeated measurements");',
  'probe(slots.values.every((value) => Number.isFinite(value) && value > 0), "every measurement must be a positive finite number");',
  'const sorted = [...slots.values].sort((left, right) => left - right);',
  'const median = (list) => { const half = Math.floor(list.length / 2); return list.length % 2 === 1 ? list[half] : (list[half - 1] + list[half]) / 2; };',
  'const center = median(sorted);',
  'const half = Math.floor(sorted.length / 2);',
  'const low = median(sorted.slice(0, half));',
  'const high = median(sorted.slice(sorted.length - half));',
  'const spread = high - low;',
  'const suspicious = slots.values.filter((value) => value < low - 1.5 * spread || value > high + 1.5 * spread);',
  'probe(suspicious.length <= 1, "the series must show at most one value beyond the fences, not " + suspicious.length);',
  'probe(Number.isFinite(low) && Number.isFinite(high) && spread >= 0, "the fences of the series must be finite and ordered");',
  'probe(center >= low && center <= high, "the robust center must lie between the first and third quartiles");',
  'probe(suspicious.length === 0 || suspicious[0] !== center, "an isolated point must differ from the robust center");',
  'const steps = slots.values.slice(1).map((value, index) => value - slots.values[index]);',
  'const drifting = steps.every((step) => step === steps[0] && step !== 0);',
  'if (suspicious.length === 1) {',
  '  return "The series contains an isolated suspicious point: " + suspicious[0] + "; verification must precede any correction. A robust center is the median " + center + ".";',
  '}',
  'if (!drifting) {',
  '  return "The series shows no evident outlier in the model; verification must precede any correction. A robust center is the median " + center + ".";',
  '}',
  'return "The diagnosis of the series: a gradual drift, not a single outlier; verification must precede any correction. A robust center is the median " + center + ", but the series must also be analyzed in temporal order.";'
].join('\n');

function explain(slots, solution) {
  const first = [
    'We first examine the series in measurement order and then the distribution of values; the two views answer different questions.'
  ];
  if (solution.shape === 'outlier') {
    return [
      ...first,
      `The value ${solution.outlier} lies beyond the fences of the series, while the other measurements form a group with small differences, so the pattern is an isolated suspicious point: ${solution.outlier}.`,
      'We do not automatically delete anything. We check transcription, the instrument, experimental conditions, and repeat the measurement if possible.',
      `As a robust center of the values, we use the median ${solution.median}.`
    ];
  }
  if (solution.shape === 'drift') {
    return [
      ...first,
      `The measurements of “${slots.quantity}” (${slots.unit}) change by the same step at every position, so the pattern is a gradual drift, not a single outlier.`,
      'We do not automatically delete anything. We check transcription, the instrument, experimental conditions, and repeat the measurement if possible.',
      `As a robust center of the values, we use the median ${solution.median}, but the series must also be analyzed in temporal order.`
    ];
  }
  return [
    ...first,
    `No measurement of “${slots.quantity}” (${slots.unit}) lies beyond the fences of the series, and the values do not change steadily, so there is no evident outlier in the model.`,
    'We do not automatically delete anything. We check transcription, the instrument, experimental conditions, and repeat the measurement if possible.',
    `As a robust center of the values, we use the median ${solution.median}.`
  ];
}

export const unit = 39;

export const cases = [
  {
    template: 'Error, deviation, and reconciliation of measurements',
    type: slugify('Error, deviation, and reconciliation of measurements'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
