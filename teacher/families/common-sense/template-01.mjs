/**
 * Template 1 of the common-sense book: weighted averages.
 *
 * Every variant states two groups, each with a case count and a mean, and a
 * preliminary summary that averages the two group means without accounting for
 * group size. The combined indicator must give every individual case equal
 * weight, so it is the case-weighted mean of the two means, and the answer
 * compares it with the simple mean-of-means.
 *
 * The fifty variants differ in the group sizes and means, so the weighted mean
 * often needs two decimals: the book rounds it to two decimals and drops a
 * trailing zero (`70.7`, `76.9`), which the exact hundredths arithmetic here
 * reproduces. The comparison is printed as a plain sentence, so the mean of
 * means is formatted the same way.
 */

import { slugify } from '../../naming.mjs';

const GROUPS_PATTERN = /Group A contains (\d+) cases with a mean of (\d+); Group B contains (\d+) cases with a mean of (\d+)/;

function parse(statement) {
  const groups = GROUPS_PATTERN.exec(statement);
  if (groups === null) {
    throw new Error('the statement does not state both groups with their case counts and means');
  }
  const [countA, meanA, countB, meanB] = groups.slice(1).map(Number);
  if (countA === 0 || countB === 0) {
    throw new Error('both groups must contain at least one case');
  }
  return { countA, meanA, countB, meanB };
}

/**
 * The rounded value of the exact rational `numerator / denominator` in
 * hundredths. Rounding is done on the rational itself with round-half-to-even,
 * so the printed halves and quarters never inherit binary-float noise.
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
  const totalA = slots.countA * slots.meanA;
  const totalB = slots.countB * slots.meanB;
  const cases = slots.countA + slots.countB;
  return {
    weightedHundredths: roundHundredths(totalA + totalB, cases),
    simpleHundredths: roundHundredths(slots.meanA + slots.meanB, 2)
  };
}

function render(solution) {
  return `The weighted mean is ${formatHundredths(solution.weightedHundredths)}, compared with a simple mean-of-means of ${formatHundredths(solution.simpleHundredths)}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Number.isInteger(slots.countA) && slots.countA > 0 && Number.isInteger(slots.countB) && slots.countB > 0, "both groups must have a positive case count");',
  'probe(Number.isInteger(slots.meanA) && slots.meanA > 0 && Number.isInteger(slots.meanB) && slots.meanB > 0, "both group means must be positive integers");',
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
  'const totalA = slots.countA * slots.meanA;',
  'const totalB = slots.countB * slots.meanB;',
  'const cases = slots.countA + slots.countB;',
  'probe(cases > 1, "the two groups must be compared across more than one case");',
  'const weighted = roundHundredths(totalA + totalB, cases);',
  'const simple = roundHundredths(slots.meanA + slots.meanB, 2);',
  'probe(weighted > 0 && simple > 0, "both combined means must be positive");',
  'return "The weighted mean is " + formatHundredths(weighted) + ", compared with a simple mean-of-means of " + formatHundredths(simple) + ".";'
].join('\n');

function explain(slots, solution) {
  const totalA = slots.countA * slots.meanA;
  const totalB = slots.countB * slots.meanB;
  return [
    `Every case must carry the same weight, so each group contributes its mean multiplied by its case count: Group A contributes ${slots.countA} × ${slots.meanA} = ${totalA} points and Group B contributes ${slots.countB} × ${slots.meanB} = ${totalB} points.`,
    `The combined total is ${totalA + totalB} points across ${slots.countA + slots.countB} cases, so the weighted mean is ${formatHundredths(solution.weightedHundredths)}.`,
    `The preliminary summary weights the two groups equally, (${slots.meanA} + ${slots.meanB}) / 2 = ${formatHundredths(solution.simpleHundredths)}, which is correct only when the groups contain the same number of cases.`,
    'Averaging the group means would over-represent the smaller group, so the weighted mean is the method that satisfies the equal-weight rule.'
  ];
}

export const unit = 1;

export const cases = [
  {
    template: 'Weighted averages',
    type: slugify('Weighted averages'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
