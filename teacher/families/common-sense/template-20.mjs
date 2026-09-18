/**
 * Template 20 of the common-sense book: successive percentage changes.
 *
 * Every variant starts a quantity at a round base value, applies a favorable
 * percentage increase and then a disruptive percentage decrease, and asks for
 * the final value after both transformations. A second percentage always
 * applies to the value the first one produced, so the correct final value is
 * `start × (1 + a/100) × (1 − b/100)`, while the shortcut a colleague proposes
 * applies `+a% − b%` once to the original value and gives
 * `start × (1 + (a − b)/100)`. The answer reports both values, their absolute
 * difference, and whether that difference is larger than the stated materiality
 * threshold.
 *
 * The family accepts every variant that carries the base value with its unit
 * noun, the two percentages, and the threshold. The fifty variants differ in
 * the base value, in the percentages, in the unit noun (`cases`, `units`,
 * `service units`, …), and in whether the final value carries a fractional
 * part.
 */

import { slugify } from '../../naming.mjs';

const START_PATTERN = /starts at (\d+) ([a-z ]+?)\. First, a favorable change increases it by (\d+)%/;
const SECOND_PATTERN = /Second, a disruption reduces the remaining value by (\d+)%/;
const PROPOSAL_PATTERN = /proposes applying '\+(\d+)%[^']*?(\d+)%' once to the original value/;
const THRESHOLD_PATTERN = /difference greater than (\d+) ([a-z ]+?) between the two methods/;

function parse(statement) {
  const start = START_PATTERN.exec(statement);
  if (start === null) {
    throw new Error('the statement does not state the base value and the first percentage');
  }
  const second = SECOND_PATTERN.exec(statement);
  if (second === null) {
    throw new Error('the statement does not state the second percentage');
  }
  const proposal = PROPOSAL_PATTERN.exec(statement);
  if (proposal === null) {
    throw new Error('the statement does not state the simplified method it proposes');
  }
  const threshold = THRESHOLD_PATTERN.exec(statement);
  if (threshold === null) {
    throw new Error('the statement does not state the materiality threshold');
  }
  return {
    start: Number(start[1]),
    unit: start[2].trim(),
    increasePercent: Number(start[3]),
    decreasePercent: Number(second[1]),
    proposedIncreasePercent: Number(proposal[1]),
    proposedDecreasePercent: Number(proposal[2]),
    threshold: Number(threshold[1]),
    thresholdUnit: threshold[2].trim()
  };
}

/**
 * Every reported value in hundredths of a unit, so `start × (100 + a) ×
 * (100 − b) / 100` and the shortcut `start × (100 + a − b)` are computed with
 * integer arithmetic and the printed halves, quarters, and hundredths
 * (`985.6`, `1133.44`) never pick up binary-float noise.
 */
function successiveHundredths(start, increasePercent, decreasePercent) {
  const numerator = start * (100 + increasePercent) * (100 - decreasePercent);
  if (numerator % 100 !== 0) {
    throw new Error('the successive percentages do not produce a whole number of hundredths');
  }
  return numerator / 100;
}

function shortcutHundredths(start, increasePercent, decreasePercent) {
  return start * (100 + increasePercent - decreasePercent);
}

function formatHundredths(value) {
  const whole = Math.floor(value / 100);
  const fraction = value % 100;
  if (fraction === 0) {
    return String(whole);
  }
  if (fraction % 10 === 0) {
    return `${whole}.${fraction / 10}`;
  }
  return `${whole}.${fraction < 10 ? `0${fraction}` : fraction}`;
}

function solve(slots) {
  if (slots.unit !== slots.thresholdUnit) {
    throw new Error('the statement measures the base value and the threshold in different units');
  }
  if (slots.proposedIncreasePercent !== slots.increasePercent || slots.proposedDecreasePercent !== slots.decreasePercent) {
    throw new Error('the simplified method does not restate the two stated percentages');
  }
  if (slots.increasePercent <= 0 || slots.increasePercent >= 100 || slots.decreasePercent <= 0 || slots.decreasePercent >= 100) {
    throw new Error('both percentages must lie strictly between zero and one hundred');
  }
  const finalHundredths = successiveHundredths(slots.start, slots.increasePercent, slots.decreasePercent);
  const simplifiedHundredths = shortcutHundredths(slots.start, slots.increasePercent, slots.decreasePercent);
  const differenceHundredths = simplifiedHundredths - finalHundredths;
  return {
    unit: slots.unit,
    threshold: slots.threshold,
    finalHundredths,
    simplifiedHundredths,
    differenceHundredths,
    acceptable: differenceHundredths <= slots.threshold * 100
  };
}

function render(solution) {
  const verdict = solution.acceptable ? 'acceptable' : 'not acceptable';
  return `Correct final value: ${formatHundredths(solution.finalHundredths)} ${solution.unit}. `
    + `The simplified method gives ${formatHundredths(solution.simplifiedHundredths)}, `
    + `a difference of ${formatHundredths(solution.differenceHundredths)} ${solution.unit}, `
    + `so it is ${verdict} under the stated threshold.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Number.isInteger(slots.start) && slots.start > 0, "the base value must be a positive integer");',
  'probe(typeof slots.unit === "string" && slots.unit.length > 0, "the base value must carry a unit noun");',
  'probe(slots.unit === slots.thresholdUnit, "the base value and the threshold must use the same unit noun");',
  'probe(Number.isInteger(slots.increasePercent) && slots.increasePercent > 0 && slots.increasePercent < 100, "the first percentage must lie strictly between zero and one hundred");',
  'probe(Number.isInteger(slots.decreasePercent) && slots.decreasePercent > 0 && slots.decreasePercent < 100, "the second percentage must lie strictly between zero and one hundred");',
  'probe(slots.proposedIncreasePercent === slots.increasePercent && slots.proposedDecreasePercent === slots.decreasePercent, "the simplified method must restate the two stated percentages");',
  'probe(Number.isInteger(slots.threshold) && slots.threshold >= 0, "the materiality threshold must be a non-negative integer");',
  'const numerator = slots.start * (100 + slots.increasePercent) * (100 - slots.decreasePercent);',
  'probe(numerator % 100 === 0, "the successive percentages must produce a whole number of hundredths");',
  'const finalHundredths = numerator / 100;',
  'const simplifiedHundredths = slots.start * (100 + slots.increasePercent - slots.decreasePercent);',
  'const differenceHundredths = simplifiedHundredths - finalHundredths;',
  'probe(differenceHundredths === slots.start * slots.increasePercent * slots.decreasePercent / 100, "the difference must be the original value times the product of the two percentages");',
  'const format = (value) => {',
  '  const whole = Math.floor(value / 100);',
  '  const fraction = value % 100;',
  '  if (fraction === 0) { return String(whole); }',
  '  if (fraction % 10 === 0) { return whole + "." + (fraction / 10); }',
  '  return whole + "." + (fraction < 10 ? "0" + fraction : String(fraction));',
  '};',
  'const verdict = differenceHundredths <= slots.threshold * 100 ? "acceptable" : "not acceptable";',
  'return "Correct final value: " + format(finalHundredths) + " " + slots.unit + ". The simplified method gives " + format(simplifiedHundredths) + ", a difference of " + format(differenceHundredths) + " " + slots.unit + ", so it is " + verdict + " under the stated threshold.";'
].join('\n');

function explain(slots, solution) {
  const afterFirst = slots.start * (100 + slots.increasePercent);
  const differenceRate = slots.increasePercent * slots.decreasePercent;
  const verdict = solution.acceptable
    ? `the difference stays inside the stated threshold of ${slots.threshold}`
    : `the difference is larger than the stated threshold of ${slots.threshold}`;
  return [
    `The first change increases ${slots.start} ${slots.unit} by ${slots.increasePercent}% of that value, which gives ${formatHundredths(afterFirst)} ${slots.unit} and is the base the second percentage sees.`,
    `The second change reduces the new base by ${slots.decreasePercent}%, so the final value is ${formatHundredths(solution.finalHundredths)} ${slots.unit} rather than the original value changed once.`,
    `Applying '+${slots.increasePercent}% - ${slots.decreasePercent}%' once to ${slots.start} ${slots.unit} instead gives ${formatHundredths(solution.simplifiedHundredths)} ${slots.unit}, so the two methods differ by the original value times ${differenceRate}/10000, which is ${formatHundredths(solution.differenceHundredths)} ${slots.unit}.`,
    `Because ${verdict}, the direct add/subtract method is ${solution.acceptable ? 'accepted' : 'rejected'} under the stated criterion.`
  ];
}

export const unit = 20;

export const cases = [
  {
    template: 'Successive percentage changes',
    type: slugify('Successive percentage changes'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
