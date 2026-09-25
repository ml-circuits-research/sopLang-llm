/**
 * Template 4 of the common-sense book: budget and constraints.
 *
 * Every variant states a total budget, an unavoidable fixed cost, a per-unit
 * cost and its benefit, a minimum number of units for a valid plan, and an
 * optional add-on module with its own cost and benefit. Both plans are the best
 * affordable one — the fixed cost is spent first, the remaining budget buys
 * whole units, and fractional units cannot be purchased — and a plan counts
 * only when it reaches the minimum-unit threshold.
 *
 * The fifty variants differ in all six amounts, so the answer has three shapes:
 * the add-on wins (`21 units plus the module for 394 benefit points`), the plan
 * without it wins or ties (`29 units for 290 benefit points`, since the module
 * is only worth its own benefit), and neither plan reaches the minimum
 * (`the maximum is 13 units without the add-on and 8 with it`). The benefit
 * comparison runs only over the feasible plans.
 */

import { slugify } from '../../naming.mjs';

const BUDGET_PATTERN = /total budget is (\d+) currency units \(CU\)/;
const FIXED_PATTERN = /unavoidable fixed cost of (\d+) CU/;
const UNIT_PATTERN = /Each implemented unit then costs (\d+) CU and yields (\d+) benefit points/;
const MINIMUM_PATTERN = /At least (\d+) units are required for a valid plan/;
const ADD_ON_PATTERN = /add-on module costs (\d+) CU and adds (\d+) benefit points/;

function parse(statement) {
  const budget = BUDGET_PATTERN.exec(statement);
  const fixed = FIXED_PATTERN.exec(statement);
  const unit = UNIT_PATTERN.exec(statement);
  const minimum = MINIMUM_PATTERN.exec(statement);
  const addOn = ADD_ON_PATTERN.exec(statement);
  if (budget === null || fixed === null || unit === null || minimum === null || addOn === null) {
    throw new Error('the statement does not state the budget, the fixed cost, the unit cost and benefit, the minimum, and the add-on');
  }
  return {
    budget: Number(budget[1]),
    fixedCost: Number(fixed[1]),
    unitCost: Number(unit[1]),
    unitBenefit: Number(unit[2]),
    minimumUnits: Number(minimum[1]),
    addOnCost: Number(addOn[1]),
    addOnBenefit: Number(addOn[2])
  };
}

/** The number of whole units a remaining budget can buy; fractional units are excluded. */
function affordableUnits(remaining, unitCost) {
  return remaining < 0 ? 0 : Math.floor(remaining / unitCost);
}

function solve(slots) {
  const unitsWithout = affordableUnits(slots.budget - slots.fixedCost, slots.unitCost);
  const unitsWith = affordableUnits(slots.budget - slots.fixedCost - slots.addOnCost, slots.unitCost);
  const benefitWithout = unitsWithout * slots.unitBenefit;
  const benefitWith = unitsWith * slots.unitBenefit + slots.addOnBenefit;
  const feasibleWithout = unitsWithout >= slots.minimumUnits;
  const feasibleWith = unitsWith >= slots.minimumUnits;
  let plan = 'none';
  if (feasibleWithout && feasibleWith) {
    plan = benefitWith > benefitWithout ? 'add-on' : 'without';
  } else if (feasibleWithout) {
    plan = 'without';
  } else if (feasibleWith) {
    plan = 'add-on';
  }
  return {
    plan,
    minimumUnits: slots.minimumUnits,
    unitsWithout,
    unitsWith,
    benefitWithout,
    benefitWith,
    units: plan === 'add-on' ? unitsWith : unitsWithout,
    benefit: plan === 'add-on' ? benefitWith : benefitWithout
  };
}

function render(solution) {
  if (solution.plan === 'none') {
    return `Neither plan is feasible: the maximum is ${solution.unitsWithout} units without the add-on and ${solution.unitsWith} with it, both below the required ${solution.minimumUnits}.`;
  }
  if (solution.plan === 'add-on') {
    return `The optimal feasible plan uses the add-on: ${solution.units} units plus the module for ${solution.benefit} benefit points.`;
  }
  return `The optimal feasible plan is without the add-on: ${solution.units} units for ${solution.benefit} benefit points.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const affordableUnits = (remaining, unitCost) => (remaining < 0 ? 0 : Math.floor(remaining / unitCost));',
  'const unitsWithout = affordableUnits(slots.budget - slots.fixedCost, slots.unitCost);',
  'const unitsWith = affordableUnits(slots.budget - slots.fixedCost - slots.addOnCost, slots.unitCost);',
  'probe(unitsWithout >= unitsWith, "the add-on must not increase the number of affordable units");',
  'const benefitWithout = unitsWithout * slots.unitBenefit;',
  'const benefitWith = unitsWith * slots.unitBenefit + slots.addOnBenefit;',
  'const feasibleWithout = unitsWithout >= slots.minimumUnits;',
  'const feasibleWith = unitsWith >= slots.minimumUnits;',
  'if (!feasibleWithout && !feasibleWith) {',
  '  return "Neither plan is feasible: the maximum is " + unitsWithout + " units without the add-on and " + unitsWith + " with it, both below the required " + slots.minimumUnits + ".";',
  '}',
  'if (feasibleWithout && feasibleWith && benefitWith > benefitWithout) {',
  '  return "The optimal feasible plan uses the add-on: " + unitsWith + " units plus the module for " + benefitWith + " benefit points.";',
  '}',
  'if (!feasibleWithout) {',
  '  return "The optimal feasible plan uses the add-on: " + unitsWith + " units plus the module for " + benefitWith + " benefit points.";',
  '}',
  'return "The optimal feasible plan is without the add-on: " + unitsWithout + " units for " + benefitWithout + " benefit points.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The fixed cost is unavoidable, so ${slots.budget} − ${slots.fixedCost} = ${slots.budget - slots.fixedCost} CU remain and whole units cost ${slots.unitCost} CU each, so at most floor(${slots.budget - slots.fixedCost}/${slots.unitCost}) = ${solution.unitsWithout} units can be bought without the add-on.`,
    `With the module, ${slots.budget - slots.fixedCost - slots.addOnCost} CU remain for units, so at most ${solution.unitsWith} units can be bought, and its ${slots.addOnBenefit} benefit points are added once.`,
    `A plan is valid only when it reaches the required ${slots.minimumUnits} units, so any plan below that threshold is excluded before the benefit comparison.`,
    solution.plan === 'none'
      ? 'With both maxima below the requirement, no feasible plan exists and the answer reports the two maxima.'
      : 'Feasibility is checked before optimization: the reported plan is the feasible one with the larger benefit, and a tie is reported as the plan without the add-on.'
  ];
}

export const unit = 4;

export const cases = [
  {
    template: 'Budget and constraints',
    type: slugify('Budget and constraints'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
