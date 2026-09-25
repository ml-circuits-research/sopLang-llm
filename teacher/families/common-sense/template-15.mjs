/**
 * Template 15 of the common-sense book: chained yields.
 *
 * Every variant states a starting quantity, three serial stages that each
 * retain a whole percentage of what they receive, and one five-percentage-point
 * improvement that exactly one stage may take. The current output is the
 * starting quantity times the three retention fractions, and the best stage to
 * improve is the one whose own gain is largest in absolute terms: a late stage
 * multiplies by the retention of every earlier stage, so the largest local
 * percentage need not be the largest absolute gain.
 *
 * The printed quantities carry at most two decimals, and the source rounds the
 * floating-point product, so the family reproduces the same arithmetic: a
 * three-factor product of `retention / 100`, then a round to the nearest
 * hundredth with an exact binary tie going to the even hundredth (the tie rule
 * the source's own numbers show: 1090.125 is printed as 1090.12 while 1218.375
 * is printed as 1218.38). Gains are compared after that rounding, because
 * mathematically equal gains reached through different multiplication orders
 * agree to the printed hundredth while differing in their last bits; the gains
 * themselves are rounded once, from the exact difference, so a tie such as
 * 64.125 prints as 64.12. The unit noun varies across the variants (`cases`,
 * `units`, `participants`, …) and is read from the statement.
 */

import { slugify } from '../../naming.mjs';

const FLOW_PATTERN = /A flow begins with (\d+) ([a-z ]+) and passes through three stages\./;
const RATES_PATTERN =
  /Stage 1 retains (\d+)%, Stage 2 retains (\d+)% of what it receives, and Stage 3 retains (\d+)% of what it receives\./;
const IMPROVEMENT_PATTERN = /increase the retention rate of exactly one stage by (\d+) percentage points, capped at 100%\./;
const STAGE_COUNT = 3;

function parse(statement) {
  const flow = FLOW_PATTERN.exec(statement);
  const rates = RATES_PATTERN.exec(statement);
  const improvement = IMPROVEMENT_PATTERN.exec(statement);
  if (flow === null) {
    throw new Error('the statement does not state the starting quantity and the three stages');
  }
  if (rates === null) {
    throw new Error('the statement does not state the retention rate of each stage');
  }
  if (improvement === null) {
    throw new Error('the statement does not state the improvement available to one stage');
  }
  const stated = [Number(rates[1]), Number(rates[2]), Number(rates[3])];
  if (stated.some((rate) => !Number.isInteger(rate) || rate <= 0 || rate > 100)) {
    throw new Error('every retention rate must be a whole percentage between one and one hundred');
  }
  const points = Number(improvement[1]);
  if (!Number.isInteger(points) || points <= 0 || points > 100) {
    throw new Error('the improvement must be a whole number of percentage points between one and one hundred');
  }
  return { start: Number(flow[1]), unit: flow[2].trim(), rates: stated, improvementPoints: points };
}

/**
 * A rounded hundredth: an exact binary tie goes to the even hundredth, and a
 * value that merely starts with a 5 in the third decimal follows the double it
 * actually is. The twenty-decimal expansion of the double is what separates
 * those two cases (1090.12500000000000000000 against 1390.51499999999987267074).
 */
function roundHundredths(value) {
  const text = value.toFixed(20);
  const point = text.indexOf('.');
  const kept = text.slice(point + 1, point + 3);
  const rest = text.slice(point + 3);
  let hundredths = Number(text.slice(0, point) + kept);
  const half = `5${'0'.repeat(rest.length - 1)}`;
  if (rest > half || (rest === half && Number(kept[1]) % 2 === 1)) {
    hundredths += 1;
  }
  return String(hundredths / 100);
}

function outputOf(start, rates) {
  return start * (rates[0] / 100) * (rates[1] / 100) * (rates[2] / 100);
}

function solve(slots) {
  if (slots.rates.length !== STAGE_COUNT) {
    throw new Error('the statement does not describe three stages');
  }
  const current = outputOf(slots.start, slots.rates);
  const gains = slots.rates.map((_, index) => {
    const improved = slots.rates.map((rate, position) =>
      position === index ? Math.min(100, rate + slots.improvementPoints) : rate
    );
    return outputOf(slots.start, improved) - current;
  });
  const shown = gains.map(roundHundredths);
  const bestGain = shown.reduce((left, right) => (Number(right) > Number(left) ? right : left), shown[0]);
  const stages = shown.map((value, index) => (value === bestGain ? index + 1 : 0)).filter((stage) => stage > 0);
  if (stages.length === 0) {
    throw new Error('no stage improves the final output');
  }
  return { current: roundHundredths(current), stages, gain: bestGain, unit: slots.unit, rates: slots.rates };
}

function render(solution) {
  return `Current final output: ${solution.current} ${solution.unit}. Best stage(s) to improve: ${solution.stages.join(', ')}, for a gain of ${solution.gain} ${solution.unit}.`;
}

const WIRES = [
  {
    name: 'yields',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const roundHundredths = (value) => {',
      '  const text = value.toFixed(20);',
      '  const point = text.indexOf(".");',
      '  const kept = text.slice(point + 1, point + 3);',
      '  const rest = text.slice(point + 3);',
      '  let hundredths = Number(text.slice(0, point) + kept);',
      '  const half = "5" + "0".repeat(rest.length - 1);',
      '  if (rest > half || (rest === half && Number(kept[1]) % 2 === 1)) {',
      '    hundredths += 1;',
      '  }',
      '  return String(hundredths / 100);',
      '};',
      'const outputOf = (rates) => slots.start * (rates[0] / 100) * (rates[1] / 100) * (rates[2] / 100);',
      'const current = outputOf(slots.rates);',
      'const gains = slots.rates.map((rate, index) => {',
      '  const improved = slots.rates.map((other, position) => (position === index ? Math.min(100, other + slots.improvementPoints) : other));',
      '  return outputOf(improved) - current;',
      '});',
      'const shown = gains.map(roundHundredths);',
      'const bestGain = shown.reduce((left, right) => (Number(right) > Number(left) ? right : left), shown[0]);',
      'probe(Number(bestGain) >= 0, "improving a stage must not lower the final output");',
      'const stages = shown.map((value, index) => (value === bestGain ? index + 1 : 0)).filter((stage) => stage > 0);',
      'return { current: roundHundredths(current), stages, bestGain };'
    ].join('\n')
  }
];

const COMPUTE = [
  'return "Current final output: " + $yields.current + " " + $slots.unit + ". Best stage(s) to improve: " + $yields.stages.join(", ") + ", for a gain of " + $yields.bestGain + " " + $slots.unit + ".";'
].join('\n');

function explain(slots, solution) {
  const percent = (rate) => `${rate}%`;
  const product = slots.rates.map(percent).join(' × ');
  const gains = slots.rates.map(
    (_, index) => `stage ${index + 1} ${roundHundredths(
      outputOf(slots.start, slots.rates.map((rate, position) =>
        position === index ? Math.min(100, rate + slots.improvementPoints) : rate
      )) - outputOf(slots.start, slots.rates)
    )}`
  );
  return [
    `Retention multiplies along the chain, so the overall retention is ${product} and the current output is that product applied to ${slots.start} ${slots.unit}, which is ${solution.current} ${slots.unit}.`,
    `Raising one stage by ${slots.improvementPoints} percentage points keeps the other two rates fixed; the resulting absolute gains are ${gains.join(', ')} ${slots.unit}.`,
    `The largest absolute gain is ${solution.gain} ${slots.unit}, so the best stage(s) to improve are ${solution.stages.join(', ')}.`,
    'The gain from a stage is proportional to the retention of the other two stages, so a stage\'s own percentage is not what decides the best place to improve; adding the percentages would ignore that each stage multiplies the flow it receives.'
  ];
}

export const unit = 15;

export const cases = [
  {
    template: 'Chained yields',
    type: slugify('Chained yields'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
