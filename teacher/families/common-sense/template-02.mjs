/**
 * Template 2 of the common-sense book: units and rates.
 *
 * Every variant states a nominal throughput in units per hour, an overhead
 * percentage of that throughput that produces no useful output, and a running
 * time in minutes. The useful rate is the throughput reduced by the overhead,
 * the time is converted to hours, and the produced quantity is the rate times
 * the time, where the hour units cancel.
 *
 * The fifty variants differ in the throughput, the overhead, the running time,
 * and the unit noun (`cases`, `measurements`, `service units`, …), which the
 * parser reads from the statement. The printed quantity is rounded to two
 * decimals (`19.36`, `20.25`) with a trailing zero dropped (`20.9`), and the
 * variants whose hundredths fall exactly on a half print the even hundredth
 * (`12.82`, `35.62`), so the quantity is computed as an exact rational and
 * rounded half-to-even.
 */

import { slugify } from '../../naming.mjs';

const THROUGHPUT_PATTERN = /nominal throughput of (\d+) ([a-z ]+?) per hour/;
const OVERHEAD_PATTERN = /An overhead equal to (\d+)% of the nominal throughput/;
const DURATION_PATTERN = /The process runs for (\d+) minutes/;
const MINUTES_PER_HOUR = 60;

function parse(statement) {
  const throughput = THROUGHPUT_PATTERN.exec(statement);
  const overhead = OVERHEAD_PATTERN.exec(statement);
  const duration = DURATION_PATTERN.exec(statement);
  if (throughput === null) {
    throw new Error('the statement does not state a nominal throughput and its unit');
  }
  if (overhead === null) {
    throw new Error('the statement does not state the overhead percentage');
  }
  if (duration === null) {
    throw new Error('the statement does not state the running time in minutes');
  }
  return {
    throughput: Number(throughput[1]),
    unit: throughput[2].trim(),
    overheadPercent: Number(overhead[1]),
    minutes: Number(duration[1])
  };
}

/**
 * The rounded value of the exact rational `numerator / denominator` in
 * hundredths. The rounding runs on the rational itself with round-half-to-even,
 * so the printed quantities never inherit binary-float noise.
 */
function roundHundredths(numerator, denominator) {
  let hundredths = Math.floor((numerator * 100) / denominator);
  const remainder = (numerator * 100) % denominator;
  if (2 * remainder > denominator || (2 * remainder === denominator && hundredths % 2 === 1)) {
    hundredths += 1;
  }
  return hundredths;
}

/** Hundredths as the book prints them: two decimals, trailing zeros dropped. */
function formatHundredths(hundredths) {
  const whole = Math.floor(hundredths / 100);
  const rest = hundredths % 100;
  if (rest === 0) {
    return String(whole);
  }
  return `${whole}.${String(rest).padStart(2, '0').replace(/0$/, '')}`;
}

function solve(slots) {
  const usefulPercent = 100 - slots.overheadPercent;
  return {
    unit: slots.unit,
    rateHundredths: roundHundredths(slots.throughput * usefulPercent, 100),
    quantityHundredths: roundHundredths(slots.throughput * usefulPercent * slots.minutes, 100 * MINUTES_PER_HOUR)
  };
}

function render(solution) {
  return `${formatHundredths(solution.quantityHundredths)} useful ${solution.unit}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const roundHundredths = (numerator, denominator) => {',
  '  let hundredths = Math.floor((numerator * 100) / denominator);',
  '  const remainder = (numerator * 100) % denominator;',
  '  if (2 * remainder > denominator || (2 * remainder === denominator && hundredths % 2 === 1)) {',
  '    hundredths += 1;',
  '  }',
  '  return hundredths;',
  '};',
  'const formatHundredths = (hundredths) => {',
  '  const whole = Math.floor(hundredths / 100);',
  '  const rest = hundredths % 100;',
  '  if (rest === 0) { return String(whole); }',
  '  return whole + "." + String(rest).padStart(2, "0").replace(/0$/, "");',
  '};',
  'const usefulPercent = 100 - slots.overheadPercent;',
  'const rate = roundHundredths(slots.throughput * usefulPercent, 100);',
  'probe(rate > 0, "the useful rate must stay positive");',
  'const quantity = roundHundredths(slots.throughput * usefulPercent * slots.minutes, 6000);',
  'probe(quantity > 0, "the produced quantity must stay positive");',
  'return formatHundredths(quantity) + " useful " + slots.unit + ".";'
].join('\n');

function explain(slots, solution) {
  const usefulPercent = 100 - slots.overheadPercent;
  const hoursHundredths = roundHundredths(slots.minutes, MINUTES_PER_HOUR);
  return [
    `The overhead removes ${slots.overheadPercent}% of the throughput, so the useful rate is ${slots.throughput} × (1 − ${slots.overheadPercent}/100) = ${formatHundredths(solution.rateHundredths)} ${slots.unit}/hour.`,
    `The running time is ${slots.minutes} minutes, that is ${slots.minutes}/${MINUTES_PER_HOUR} = ${formatHundredths(hoursHundredths)} hours.`,
    `The produced quantity is the useful rate times the running time, ${formatHundredths(solution.rateHundredths)} ${slots.unit}/hour × ${slots.minutes}/${MINUTES_PER_HOUR} hours = ${formatHundredths(solution.quantityHundredths)} ${slots.unit}.`,
    'The per-hour unit of the rate cancels against the hours of the running time, so the result is a quantity, not a rate.'
  ];
}

export const unit = 2;

export const cases = [
  {
    template: 'Units and rates',
    type: slugify('Units and rates'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
