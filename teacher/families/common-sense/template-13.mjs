/**
 * Template 13 of the common-sense book: measurement uncertainty.
 *
 * Every variant reports two measurements as `A = value ± error` and `B = value
 * ± error`, where the notation means only that each true value lies somewhere
 * in `[value − error, value + error]` with no distribution assumed inside the
 * interval. The honest reading is interval against interval: when the two
 * intervals are disjoint the whole of one lies beyond the whole of the other
 * and the ordering is certain, and when they overlap (or merely touch) the data
 * allow both orders, so the central values alone cannot establish one.
 *
 * The fifty variants differ only in the two values and the two errors, and
 * forty-eight of them overlap while two place B's interval entirely above A's.
 * Every quantity is kept in integer hundredths, so an endpoint such as `60.1`
 * is compared exactly instead of through binary-float noise.
 */

import { slugify } from '../../naming.mjs';

const MEASUREMENTS_PATTERN = /A = (\d+(?:\.\d+)?) ± (\d+(?:\.\d+)?) and B = (\d+(?:\.\d+)?) ± (\d+(?:\.\d+)?)/;
const MEASUREMENT_NAMES = Object.freeze(['A', 'B']);

/**
 * A stated decimal as an integer number of hundredths. The measurements carry
 * at most one decimal place; a value stated more finely than hundredths is
 * refused rather than rounded silently.
 */
function parseHundredths(text) {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(text);
  if (match === null) {
    throw new Error(`the stated value "${text}" is not a number with at most two decimals`);
  }
  return Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
}

function parse(statement) {
  const match = MEASUREMENTS_PATTERN.exec(statement);
  if (match === null) {
    throw new Error('the statement does not report two measurements as value ± error');
  }
  return {
    measurements: {
      A: { value: parseHundredths(match[1]), error: parseHundredths(match[2]) },
      B: { value: parseHundredths(match[3]), error: parseHundredths(match[4]) }
    }
  };
}

function formatHundredths(hundredths) {
  return String(hundredths / 100);
}

function solve(slots) {
  const intervals = {};
  for (const name of MEASUREMENT_NAMES) {
    const { value, error } = slots.measurements[name];
    if (error < 0) {
      throw new Error(`the stated error of ${name} must not be negative`);
    }
    intervals[name] = { value, error, low: value - error, high: value + error };
  }
  const { A, B } = intervals;
  const greater = A.high < B.low ? 'B' : B.high < A.low ? 'A' : null;
  return { intervals, greater };
}

/**
 * The strongest justified conclusion: a certain order only when the two
 * intervals are disjoint, and an explicit refusal to order them when they
 * overlap or touch, because a shared endpoint allows equality.
 */
function verdict(greater) {
  if (greater === 'B') {
    return 'B is certainly greater than A.';
  }
  if (greater === 'A') {
    return 'A is certainly greater than B.';
  }
  return 'The ordering cannot be established with certainty because the intervals overlap.';
}

function render(solution) {
  return verdict(solution.greater);
}

const COMPUTE = [
  'const slots = $slots;',
  'const measurements = slots.measurements;',
  'probe(measurements !== null && typeof measurements === "object", "the statement must report two measurements");',
  'probe(["A", "B"].every((name) => measurements[name] !== null && typeof measurements[name] === "object"), "each measurement must report a value and an error");',
  'probe(["A", "B"].every((name) => Number.isInteger(measurements[name].value) && measurements[name].value > 0), "each reported value must be a positive integer number of hundredths");',
  'probe(["A", "B"].every((name) => Number.isInteger(measurements[name].error) && measurements[name].error >= 0), "each stated error must be a non-negative integer number of hundredths");',
  'probe(["A", "B"].every((name) => measurements[name].error * 2 < measurements[name].value), "each error must leave a positive lower endpoint");',
  'const intervals = {};',
  'for (const name of ["A", "B"]) {',
  '  const measurement = measurements[name];',
  '  intervals[name] = { low: measurement.value - measurement.error, high: measurement.value + measurement.error };',
  '}',
  'probe(intervals.A.low <= intervals.A.high && intervals.B.low <= intervals.B.high, "every interval must run from its lower to its upper endpoint");',
  'const greater = intervals.A.high < intervals.B.low ? "B" : intervals.B.high < intervals.A.low ? "A" : null;',
  'if (greater === "B") {',
  '  return "B is certainly greater than A.";',
  '}',
  'if (greater === "A") {',
  '  return "A is certainly greater than B.";',
  '}',
  'return "The ordering cannot be established with certainty because the intervals overlap.";'
].join('\n');

function explain(slots, solution) {
  const { A, B } = solution.intervals;
  const interval = (measurement) => `[${formatHundredths(measurement.low)}, ${formatHundredths(measurement.high)}]`;
  const [lower, upper] = solution.greater === 'B' ? [B, A] : [A, B];
  const closing = solution.greater === null
    ? 'Because the intervals overlap, some allowed true values have A ≥ B and others have B ≥ A, so the ordering cannot be established with certainty.'
    : `Because the intervals do not overlap at all — ${solution.greater}'s lower endpoint ${formatHundredths(lower.low)} lies beyond the other's upper endpoint ${formatHundredths(upper.high)} — every allowed true value of ${solution.greater} exceeds every allowed true value of the other measurement.`;
  return [
    `A lies in ${formatHundredths(A.value)} ± ${formatHundredths(A.error)} = ${interval(A)}, and B lies in ${formatHundredths(B.value)} ± ${formatHundredths(B.error)} = ${interval(B)}.`,
    'The notation fixes only an interval for each true value; it states nothing about which values inside the interval are more likely.',
    closing,
    'Comparing the two central values alone would ignore the stated errors and would report an order the data do not support.'
  ];
}

export const unit = 13;

export const cases = [
  {
    template: 'Measurement uncertainty',
    type: slugify('Measurement uncertainty'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
