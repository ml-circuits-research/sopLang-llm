/**
 * Template 16 of the common-sense book: mean versus median.
 *
 * Every variant prints nine observations whose last value is a genuine extreme
 * value, and asks for the mean and the median plus which statistic serves which
 * purpose. The mean is the total over all nine observations divided by nine,
 * printed to two decimals; the median is the fifth value once the nine
 * observations are ordered, so the extreme value moves the mean and leaves the
 * median where the middle of the ordered list puts it. The verdict sentence is
 * the same in all fifty variants, so only the two numbers vary.
 *
 * Division by nine never lands exactly between two hundredths, but the
 * explanation also reports the mean of the eight observations that remain once
 * the extreme value is dropped, and that one is divided by eight and does land
 * on a half hundredth. The rounding is therefore done in whole hundredths with
 * an exact tie going to the even hundredth, which is how the source prints
 * 315/8 = 39.375 as 39.38 and 385/8 = 48.125 as 48.12.
 */

import { slugify } from '../../naming.mjs';

const OBSERVATIONS_PATTERN = /Nine observations are: ([^.]+)\./;
const EXTREME_PATTERN = /The last value, (\d+), is genuine and must not be deleted/;
const COUNT = 9;

function parse(statement) {
  const observations = OBSERVATIONS_PATTERN.exec(statement);
  const extreme = EXTREME_PATTERN.exec(statement);
  if (observations === null) {
    throw new Error('the statement does not list the nine observations');
  }
  if (extreme === null) {
    throw new Error('the statement does not name the genuine extreme value');
  }
  const values = observations[1].split(',').map((value) => Number(value.trim()));
  if (values.length !== COUNT || values.some((value) => !Number.isInteger(value) || value < 0)) {
    throw new Error('the nine observations must be whole non-negative numbers');
  }
  if (values[values.length - 1] !== Number(extreme[1])) {
    throw new Error('the named extreme value must be the last observation');
  }
  if (values[values.length - 1] !== Math.max(...values)) {
    throw new Error('the named extreme value must be the largest observation');
  }
  return { values, extreme: Number(extreme[1]) };
}

/**
 * The value of `sum / count` in whole hundredths: the exact quotient when it is
 * not a half, and the even hundredth when it is exactly a half.
 */
function hundredthsOf(sum, count) {
  const scaled = sum * 100;
  const quotient = Math.floor(scaled / count);
  const remainder = scaled % count;
  if (remainder * 2 > count || (remainder * 2 === count && quotient % 2 === 1)) {
    return quotient + 1;
  }
  return quotient;
}

const formatHundredths = (hundredths) => String(hundredths / 100);

function solve(slots) {
  const sorted = [...slots.values].sort((left, right) => left - right);
  const sum = slots.values.reduce((total, value) => total + value, 0);
  const median = sorted[Math.floor(sorted.length / 2)];
  const rest = slots.values.slice(0, -1);
  const restSum = rest.reduce((total, value) => total + value, 0);
  const mean = hundredthsOf(sum, slots.values.length);
  const withoutExtreme = hundredthsOf(restSum, rest.length);
  return {
    mean: formatHundredths(mean),
    median,
    sum,
    count: slots.values.length,
    extreme: slots.extreme,
    withoutExtreme: formatHundredths(withoutExtreme),
    shift: formatHundredths(mean - withoutExtreme)
  };
}

function render(solution) {
  return `Mean = ${solution.mean}; median = ${solution.median}. Use the mean for total amount per observation and the median for a more robust 'typical' value.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.values) && slots.values.length === 9, "the statement must list nine observations");',
  'probe(slots.values.every((value) => Number.isInteger(value) && value >= 0), "every observation must be a whole non-negative number");',
  'probe(slots.values[slots.values.length - 1] === slots.extreme, "the named extreme value must be the last observation");',
  'probe(slots.values[slots.values.length - 1] === Math.max.apply(null, slots.values), "the named extreme value must be the largest observation");',
  'const hundredthsOf = (sum, count) => {',
  '  const scaled = sum * 100;',
  '  const quotient = Math.floor(scaled / count);',
  '  const remainder = scaled % count;',
  '  return remainder * 2 > count || (remainder * 2 === count && quotient % 2 === 1) ? quotient + 1 : quotient;',
  '};',
  'const sorted = slots.values.slice().sort((left, right) => left - right);',
  'const sum = slots.values.reduce((total, value) => total + value, 0);',
  'probe(sum > 0, "the observations must carry a positive total");',
  'const median = sorted[Math.floor(sorted.length / 2)];',
  'const rest = slots.values.slice(0, -1);',
  'const restSum = rest.reduce((total, value) => total + value, 0);',
  'const mean = hundredthsOf(sum, slots.values.length);',
  'const withoutExtreme = hundredthsOf(restSum, rest.length);',
  'probe(mean >= withoutExtreme, "the extreme value must not pull the mean below the mean without it");',
  'return "Mean = " + String(mean / 100) + "; median = " + median + ". Use the mean for total amount per observation and the median for a more robust \'typical\' value.";'
].join('\n');

function explain(slots, solution) {
  const values = slots.values;
  return [
    `The mean includes every observation, so the total is ${values.join(' + ')} = ${solution.sum} and the mean is ${solution.sum}/${solution.count} = ${solution.mean}.`,
    `Ordering the nine observations puts the fifth, middle value at ${solution.median}, and that position is the median: four of the observations are listed before it and four after it, so the last value ${solution.extreme} cannot move it.`,
    `The first eight observations average ${solution.withoutExtreme}, so including the extreme value raises the mean by ${solution.shift}; the mean keeps the total honest while the median describes a typical observation.`,
    `Both statistics are reported because they answer different questions: the extreme value is genuine and belongs in the total, so the mean is the right figure for an average amount per observation, and the median is the more robust description of what is typical.`
  ];
}

export const unit = 16;

export const cases = [
  {
    template: 'Mean versus median',
    type: slugify('Mean versus median'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
