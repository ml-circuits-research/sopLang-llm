/**
 * Pattern 8 of the decompose-to-solve book: uncertainty and robustness.
 *
 * Every variant states an expected demand, a symmetric forecast error, a
 * safety margin that the policy applies to the high forecast, and two capacity
 * options with their costs. The robust requirement is the high forecast with
 * the margin applied to it, `demand × (1 + error) × (1 + margin)`, printed
 * with one decimal; only the options whose capacity reaches it are feasible,
 * and the answer names the cheapest feasible one. The two transformations stay
 * separate: the margin is applied to the high forecast, never to the average,
 * which is the stated reason the average forecast is a planning number and not
 * the capacity decision. The variants change the domain phrase, the demand
 * noun, and the numbers, never the method.
 */

import { slugify } from '../../naming.mjs';

const DEMAND_PATTERN = /expected demand is (\d+) ([a-z][a-z -]*?), but forecast error is estimated at ±(\d+)%\./;
const MARGIN_PATTERN = /The policy adds a further (\d+)% safety margin to the high forecast before selecting capacity\./;
const OPTIONS_PATTERN = /Option A provides capacity (\d+) for cost (\d+); Option B provides capacity (\d+) for cost (\d+)\./;

/** The one-decimal text of a requirement held in tenths. */
function formatTenths(tenths) {
  return `${Math.floor(tenths / 10)}.${tenths % 10}`;
}

/** The text of a value held in hundredths, without trailing fraction zeros. */
function formatHundredths(hundredths) {
  const whole = Math.floor(hundredths / 100);
  const fraction = String(hundredths % 100).padStart(2, '0').replace(/0+$/, '');
  return fraction === '' ? String(whole) : `${whole}.${fraction}`;
}

function parse(statement) {
  const demand = DEMAND_PATTERN.exec(statement);
  const margin = MARGIN_PATTERN.exec(statement);
  const options = OPTIONS_PATTERN.exec(statement);
  if (demand === null || margin === null || options === null) {
    throw new Error('the statement does not state the demand, the forecast error, the safety margin, and two capacity options');
  }
  return {
    demand: Number(demand[1]),
    demandUnit: demand[2].trim(),
    errorPercent: Number(demand[3]),
    marginPercent: Number(margin[1]),
    capacityA: Number(options[1]),
    costA: Number(options[2]),
    capacityB: Number(options[3]),
    costB: Number(options[4])
  };
}

function solve(slots) {
  // Scaled by 10000 so the two percentage transformations stay exact integer
  // arithmetic; the printed requirement is held in tenths.
  const scaled = slots.demand * (100 + slots.errorPercent) * (100 + slots.marginPercent);
  const requirementTenths = Math.floor((scaled + 500) / 1000);
  const options = [
    { label: 'A', capacity: slots.capacityA, cost: slots.costA },
    { label: 'B', capacity: slots.capacityB, cost: slots.costB }
  ];
  const feasible = options.filter((option) => option.capacity * 10 >= requirementTenths);
  if (feasible.length === 0) {
    throw new Error('no stated option reaches the robust capacity requirement');
  }
  // Costs are compared only among the options that already satisfy the rule.
  const chosen = feasible.reduce((best, option) => (option.cost < best.cost ? option : best));
  return {
    requirementTenths,
    highForecastHundredths: slots.demand * (100 + slots.errorPercent),
    chosen: chosen.label,
    chosenCost: chosen.cost
  };
}

function render(solution) {
  return `The robust capacity requirement is ${formatTenths(solution.requirementTenths)}, and Option ${solution.chosen} is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const formatTenths = (tenths) => Math.floor(tenths / 10) + "." + (tenths % 10);',
  'for (const side of ["A", "B"]) {',
  '}',
  'const scaled = slots.demand * (100 + slots.errorPercent) * (100 + slots.marginPercent);',
  'const requirementTenths = Math.floor((scaled + 500) / 1000);',
  'probe(requirementTenths > slots.demand * 10, "the robust requirement must exceed the average forecast");',
  'const options = [',
  '  { label: "A", capacity: slots.capacityA, cost: slots.costA },',
  '  { label: "B", capacity: slots.capacityB, cost: slots.costB }',
  '];',
  'const feasible = options.filter((option) => option.capacity * 10 >= requirementTenths);',
  'probe(feasible.length > 0, "at least one stated option must reach the robust requirement");',
  'const chosen = feasible.reduce((best, option) => (option.cost < best.cost ? option : best));',
  'probe(feasible.every((option) => option.cost >= chosen.cost), "the chosen option must have the lowest cost among the feasible ones");',
  'return "The robust capacity requirement is " + formatTenths(requirementTenths) + ", and Option " + chosen.label + " is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.";'
].join('\n');

function explain(slots, solution) {
  const verdict = (capacity) => (capacity * 10 >= solution.requirementTenths ? 'reaches' : 'falls short of');
  const requirement = formatTenths(solution.requirementTenths);
  return [
    `The average forecast of ${slots.demand} ${slots.demandUnit} is widened first by the ±${slots.errorPercent}% error bound, which gives the high forecast ${formatHundredths(solution.highForecastHundredths)}.`,
    `The ${slots.marginPercent}% safety policy is applied to that high forecast and not to the average, so the robust requirement is ${requirement}.`,
    `Option A's capacity ${slots.capacityA} ${verdict(slots.capacityA)} ${requirement}, and Option B's capacity ${slots.capacityB} ${verdict(slots.capacityB)} ${requirement}.`,
    `Comparing costs only among the options that satisfy the rule, Option ${solution.chosen} at cost ${solution.chosenCost} is the cheapest, so it is the robust choice.`
  ];
}

export const unit = 8;

export const cases = [
  {
    template: 'Uncertainty and Robustness',
    type: slugify('Uncertainty and Robustness'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
