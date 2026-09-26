/**
 * Pattern 3 of the decompose-to-solve book: normalization and capacity.
 *
 * Every variant states a raw requirement in a local counting unit, the size of
 * that local unit in standard units, an operational loss percentage, a
 * container capacity, and how many containers are available. The answer is a
 * four-step chain: normalize the requirement to standard units, inflate it for
 * the loss (enough input must survive to deliver the requirement), discretize
 * that need into whole containers, and compare the count with availability.
 * The variants change the domain phrase, the counted noun, and the numbers,
 * never the method. The closing sentence is fixed in the module; every number
 * in the verdict comes from the parsed scenario.
 */

import { slugify } from '../../naming.mjs';

const RAW_PATTERN = /the worksheet lists a raw requirement of (\d+) (.+?) in a local counting unit\./;
const FACTOR_PATTERN = /One local unit corresponds to ([\d.]+) standard units\./;
const LOSS_PATTERN = /Operational losses are estimated at (\d+)%, so enough input must be available to deliver the final requirement after loss\./;
const CONTAINER_PATTERN = /Each container or service slot can supply (\d+) standard units, and at most (\d+) are available\./;

/** Turns a printed decimal such as "1.25" into an exact numerator/denominator. */
function ratio(text) {
  const [whole, fraction = ''] = String(text).split('.');
  const denominator = 10 ** fraction.length;
  return { numerator: Number(`${whole}${fraction}`), denominator };
}

function parse(statement) {
  const raw = RAW_PATTERN.exec(statement);
  const factor = FACTOR_PATTERN.exec(statement);
  const loss = LOSS_PATTERN.exec(statement);
  const container = CONTAINER_PATTERN.exec(statement);
  if (raw === null || factor === null || loss === null || container === null) {
    throw new Error('the statement does not state the raw requirement, the unit factor, the loss, and the container capacity');
  }
  const unit = ratio(factor[1]);
  return {
    rawRequirement: Number(raw[1]),
    itemUnit: raw[2].trim(),
    unitFactorNumerator: unit.numerator,
    unitFactorDenominator: unit.denominator,
    lossPercent: Number(loss[1]),
    containerCapacity: Number(container[1]),
    availableContainers: Number(container[2])
  };
}

/** The exact scaled need in standard units: raw × factor × 100 / (100 − loss). */
function scaledNeed(slots) {
  return {
    numerator: slots.rawRequirement * slots.unitFactorNumerator * 100,
    denominator: slots.unitFactorDenominator * (100 - slots.lossPercent)
  };
}

function solve(slots) {
  const need = scaledNeed(slots);
  const containers = Math.ceil(
    need.numerator / (need.denominator * slots.containerCapacity)
  );
  return {
    containers,
    feasible: containers <= slots.availableContainers,
    normalizedNumerator: slots.rawRequirement * slots.unitFactorNumerator,
    normalizedDenominator: slots.unitFactorDenominator,
    needNumerator: need.numerator,
    needDenominator: need.denominator
  };
}

function render(solution) {
  return `The operation needs ${solution.containers} capacity units and is ${solution.feasible ? 'feasible' : 'not feasible'}. The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const need = slots.rawRequirement * slots.unitFactorNumerator * 100;',
  'const lossAdjusted = slots.unitFactorDenominator * (100 - slots.lossPercent) * slots.containerCapacity;',
  'const containers = Math.ceil(need / lossAdjusted);',
  'const feasible = containers <= slots.availableContainers;',
  'return "The operation needs " + containers + " capacity units and is " + (feasible ? "feasible" : "not feasible") + ". The decomposition follows the semantic transformations: normalize → adjust for loss → discretize into containers → compare with availability.";'
].join('\n');

/** Prints an exact rational as a trimmed decimal for the prose explanation. */
function decimal(numerator, denominator) {
  return String(Number((numerator / denominator).toFixed(2)));
}

function explain(slots, solution) {
  const normalized = decimal(solution.normalizedNumerator, solution.normalizedDenominator);
  const adjusted = decimal(solution.needNumerator, solution.needDenominator);
  return [
    `Normalizing first: ${slots.rawRequirement} ${slots.itemUnit} × ${decimal(slots.unitFactorNumerator, slots.unitFactorDenominator)} = ${normalized} standard units.`,
    `Adjusting for the ${slots.lossPercent}% loss, enough input must be supplied for ${normalized} / ${decimal(100 - slots.lossPercent, 100)} = ${adjusted} standard units.`,
    `Discretizing that need into containers of ${slots.containerCapacity} standard units gives ceil(${adjusted}/${slots.containerCapacity}) = ${solution.containers} capacity units.`,
    `Comparing with the ${slots.availableContainers} available containers makes the plan ${solution.feasible ? 'feasible' : 'not feasible'}; the color-coding note does not affect capacity.`
  ];
}

export const unit = 3;

export const cases = [
  {
    template: 'Normalization and Capacity',
    type: slugify('Normalization and Capacity'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
