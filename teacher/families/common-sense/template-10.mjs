/**
 * Template 10 of the common-sense book: break-even threshold.
 *
 * Every variant states two alternatives as a fixed cost plus a per-unit cost
 * and asks for the volume at which their total costs are equal, which
 * alternative is cheaper below and above that volume, and how a whole-unit
 * decision uses a non-integer threshold. Setting `fixedA + variableA × q =
 * fixedB + variableB × q` gives `q = (fixedB − fixedA)/(variableA −
 * variableB)`; the alternative with the smaller fixed cost is cheaper at low
 * volume and the alternative with the smaller per-unit cost is cheaper above
 * the crossing.
 *
 * The fifty variants differ only in the four costs, and every one of them gives
 * Plan A the higher fixed cost and the lower per-unit cost, so the printed
 * answer always names Plan B below and Plan A above the threshold. The
 * threshold is rounded to two decimals with trailing zeros removed (`83.33`,
 * `162.5`, `50`), which the module computes in exact integer hundredths.
 */

import { slugify } from '../../naming.mjs';

const COSTS_PATTERN = /Plan A = (\d+) CU fixed \+ (\d+) CU per unit; Plan B = (\d+) CU fixed \+ (\d+) CU per unit/;
const PLAN_LABELS = Object.freeze({ A: 'Plan A', B: 'Plan B' });
const PLANS = Object.freeze(['A', 'B']);

function parse(statement) {
  const match = COSTS_PATTERN.exec(statement);
  if (match === null) {
    throw new Error('the statement does not state both plans as a fixed cost plus a per-unit cost');
  }
  return {
    plans: {
      A: { fixed: Number(match[1]), variable: Number(match[2]) },
      B: { fixed: Number(match[3]), variable: Number(match[4]) }
    }
  };
}

/**
 * Exact rounding of `numerator / denominator` to hundredths, half away from
 * zero. The printed answers contain halves and quarters (`162.5`, `56.25`), so
 * the crossing point is kept as an integer number of hundredths and never as a
 * binary float.
 */
function roundHundredths(numerator, denominator) {
  const sign = numerator < 0 ? -1 : 1;
  const magnitude = Math.abs(numerator);
  const quotient = Math.floor(magnitude / denominator);
  const remainder = magnitude - quotient * denominator;
  return sign * (quotient + (2 * remainder >= denominator ? 1 : 0));
}

function formatHundredths(hundredths) {
  return String(hundredths / 100);
}

function solve(slots) {
  const { A, B } = slots.plans;
  let numerator = (B.fixed - A.fixed) * 100;
  let denominator = A.variable - B.variable;
  if (denominator === 0) {
    throw new Error('the two plans have the same per-unit cost, so they never cross');
  }
  if (denominator < 0) {
    numerator = -numerator;
    denominator = -denominator;
  }
  const threshold = roundHundredths(numerator, denominator);
  if (threshold <= 0) {
    throw new Error('the two plans do not cross at a positive volume');
  }
  const cheaperBelow = A.fixed < B.fixed ? 'A' : B.fixed < A.fixed ? 'B' : null;
  const cheaperAbove = A.variable < B.variable ? 'A' : B.variable < A.variable ? 'B' : null;
  if (cheaperBelow === null || cheaperAbove === null) {
    throw new Error('the two plans share one cost term, so neither is strictly cheaper on both sides');
  }
  return { threshold, cheaperBelow, cheaperAbove };
}

function render(solution) {
  return `Break-even volume: ${formatHundredths(solution.threshold)} units. Below it, ${PLAN_LABELS[solution.cheaperBelow]} is cheaper; above it, ${PLAN_LABELS[solution.cheaperAbove]} is cheaper.`;
}

const WIRES = [
  {
    name: 'breakEven',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const plans = slots.plans;',
      'let numerator = (plans.B.fixed - plans.A.fixed) * 100;',
      'let denominator = plans.A.variable - plans.B.variable;',
      'if (denominator < 0) {',
      '  numerator = -numerator;',
      '  denominator = -denominator;',
      '}',
      'const sign = numerator < 0 ? -1 : 1;',
      'const magnitude = Math.abs(numerator);',
      'const quotient = Math.floor(magnitude / denominator);',
      'const remainder = magnitude - quotient * denominator;',
      'const threshold = sign * (quotient + (2 * remainder >= denominator ? 1 : 0));',
      'probe(threshold > 0, "the two plans must cross at a positive volume");',
      'const cheaperBelow = plans.A.fixed < plans.B.fixed ? "A" : "B";',
      'const cheaperAbove = plans.A.variable < plans.B.variable ? "A" : "B";',
      'return { threshold, cheaperBelow, cheaperAbove };'
    ].join('\n')
  }
];

const COMPUTE = [
  'return "Break-even volume: " + String($breakEven.threshold / 100) + " units. Below it, Plan " + $breakEven.cheaperBelow + " is cheaper; above it, Plan " + $breakEven.cheaperAbove + " is cheaper.";'
].join('\n');

function explain(slots, solution) {
  const { A, B } = slots.plans;
  const list = PLANS.map((label) => `${PLAN_LABELS[label]} ${slots.plans[label].fixed} + ${slots.plans[label].variable}q`).join(' and ');
  return [
    `Setting the two total costs equal, ${list}, isolates q = (${B.fixed} − ${A.fixed})/(${A.variable} − ${B.variable}) = ${formatHundredths(solution.threshold)} units, where both plans cost the same.`,
    `${PLAN_LABELS[solution.cheaperBelow]} carries the smaller fixed cost, so it is cheaper at low volume and stays cheaper on every volume up to the crossing point.`,
    `${PLAN_LABELS[solution.cheaperAbove]} carries the smaller per-unit cost, so every additional unit widens its advantage and it is cheaper above the crossing point.`,
    'When volume must be a whole number, a non-integer threshold is not rounded to a single winner: the nearest integers below and above it are compared directly, because the cheaper plan can change across the crossing.'
  ];
}

export const unit = 10;

export const cases = [
  {
    template: 'Break-even threshold',
    type: slugify('Break-even threshold'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
