/**
 * Form 27 of the scientific-reasoning book: rates and accumulation.
 *
 * Every variant tracks one quantity over equal intervals under a constant
 * rate. The source states the rate twice, in two shapes: the first shape gives
 * the starting value and the net change per interval and asks for the value
 * after the tracked intervals and after two more, and the second shape gives
 * the starting value, the value reached, and the number of intervals and asks
 * for the net change per interval and for two later values. A rate is a change
 * per interval and accumulation repeats it, so the value after n intervals is
 * start + n × rate in both shapes.
 *
 * The variants differ in the world's vocabulary (pollen portions, viable
 * seeds, organic matter, water, energy, transmitted force, food surface,
 * available energy, …), in the unit the tracked quantity is printed in, and in
 * the shape the source states, not in the rule.
 */

import { slugify } from '../../naming.mjs';

const QUANTITY_PATTERN = /The quantity tracked is “(.+?)” \(unit: (.+?)\)\./;
const SEQUENCE_PATTERN =
  /We start with (\d+) (.+?); in each equal interval, the net change is \+(\d+) (.+?); we track (\d+) intervals\./;
const MEASURED_PATTERN =
  /The value starts from (\d+) (.+?) and reaches (\d+) (.+?) after (\d+) equal intervals\. The model states that the rate is constant\./;

function parse(statement) {
  const quantity = QUANTITY_PATTERN.exec(statement);
  if (quantity === null) {
    throw new Error('the statement does not name the tracked quantity and its unit');
  }
  const unit = quantity[2].trim();
  const sequence = SEQUENCE_PATTERN.exec(statement);
  if (sequence !== null) {
    if (sequence[2].trim() !== unit || sequence[4].trim() !== unit) {
      throw new Error('the stated rate is not measured in the unit of the tracked quantity');
    }
    return {
      shape: 'rate-given',
      name: quantity[1].trim(),
      unit,
      start: Number(sequence[1]),
      rate: Number(sequence[3]),
      intervals: Number(sequence[5])
    };
  }
  const measured = MEASURED_PATTERN.exec(statement);
  if (measured === null) {
    throw new Error('the statement states neither a constant rate nor a value reached after equal intervals');
  }
  if (measured[2].trim() !== unit || measured[4].trim() !== unit) {
    throw new Error('the measured values are not printed in the unit of the tracked quantity');
  }
  return {
    shape: 'rate-sought',
    name: quantity[1].trim(),
    unit,
    start: Number(measured[1]),
    final: Number(measured[3]),
    intervals: Number(measured[5])
  };
}

/**
 * The constant rate of the second shape: the whole increase spread over the
 * intervals the statement counts, which must be a whole positive number of
 * units per interval.
 */
function rateOf(slots) {
  if (slots.shape === 'rate-given') {
    return slots.rate;
  }
  const increase = slots.final - slots.start;
  if (increase <= 0 || increase % slots.intervals !== 0) {
    throw new Error(`the stated increase ${increase} is not a whole number of units per interval`);
  }
  return increase / slots.intervals;
}

function solve(slots) {
  const rate = rateOf(slots);
  const afterTracked = slots.start + slots.intervals * rate;
  if (slots.shape === 'rate-given') {
    return { shape: slots.shape, unit: slots.unit, intervals: slots.intervals, rate, afterTracked, afterTwoMore: afterTracked + 2 * rate };
  }
  if (afterTracked !== slots.final) {
    throw new Error('the stated rate does not reach the stated value after the stated intervals');
  }
  return { shape: slots.shape, unit: slots.unit, rate, afterFirst: slots.start + rate, afterOneMore: slots.final + rate };
}

function render(solution) {
  if (solution.shape === 'rate-given') {
    return `after ${solution.intervals} intervals: ${solution.afterTracked} ${solution.unit}; after two more: ${solution.afterTwoMore} ${solution.unit}.`;
  }
  return `The rate is +${solution.rate} ${solution.unit}/interval; after first interval ${solution.afterFirst}, and after one additional interval ${solution.afterOneMore}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.unit === "string" && slots.unit.length > 0, "the tracked quantity must carry a unit");',
  'probe(Number.isInteger(slots.start) && slots.start >= 0, "the tracked quantity must start from a whole non-negative value");',
  'probe(Number.isInteger(slots.intervals) && slots.intervals > 0, "the statement must track a positive number of intervals");',
  'const rate = slots.shape === "rate-given" ? slots.rate : (slots.final - slots.start) / slots.intervals;',
  'probe(Number.isInteger(rate) && rate > 0, "the constant rate must be a whole positive change per interval");',
  'const afterTracked = slots.start + slots.intervals * rate;',
  'if (slots.shape === "rate-given") {',
  '  probe(afterTracked > slots.start, "accumulating a positive rate must raise the value");',
  '  return "after " + slots.intervals + " intervals: " + afterTracked + " " + slots.unit + "; after two more: " + (afterTracked + 2 * rate) + " " + slots.unit + ".";',
  '}',
  'probe(slots.final > slots.start, "the measured value must be above the starting value");',
  'probe((slots.final - slots.start) % slots.intervals === 0, "the whole increase must divide into the tracked intervals");',
  'probe(afterTracked === slots.final, "the computed rate must reach the measured value after the tracked intervals");',
  'return "The rate is +" + rate + " " + slots.unit + "/interval; after first interval " + (slots.start + rate) + ", and after one additional interval " + (slots.final + rate) + ".";'
].join('\n');

function explain(slots, solution) {
  if (solution.shape === 'rate-given') {
    return [
      `A rate is a change per interval, so the constant net change of +${solution.rate} ${slots.unit} per interval is added once for every interval.`,
      `After ${slots.intervals} intervals the value is ${slots.start}+${slots.intervals}×${solution.rate}=${solution.afterTracked} ${slots.unit}; two more intervals add 2×${solution.rate}.`,
      `The value after two more intervals is therefore ${solution.afterTwoMore} ${slots.unit}, not ${solution.afterTracked}×2, because accumulation repeats the change instead of multiplying the total.`
    ];
  }
  return [
    `The whole increase is ${slots.final}-${slots.start}=${slots.final - slots.start} ${slots.unit}, and the model spreads it over ${slots.intervals} equal intervals, so the net change is ${slots.final - slots.start}÷${slots.intervals}=+${solution.rate} ${slots.unit} per interval.`,
    `The first interval adds that change once: ${slots.start}+${solution.rate}=${solution.afterFirst} ${slots.unit}.`,
    `One interval beyond the final measurement adds the same change to the measured value, ${slots.final}+${solution.rate}=${solution.afterOneMore} ${slots.unit}.`,
    `The check is the accumulation rule itself: start + number of intervals × rate reproduces every stated value.`
  ];
}

export const unit = 27;

export const cases = [
  {
    template: 'Rates and accumulation',
    type: slugify('Rates and accumulation'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
