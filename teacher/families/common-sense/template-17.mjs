/**
 * Template 17 of the common-sense book: integer capacity threshold.
 *
 * Every variant states a demand, a reserve percentage that must exist
 * physically, and the supply of one indivisible module. The required capacity
 * is the demand grossed up by the reserve, the theoretical module count is that
 * capacity divided by the module supply, and because modules are indivisible
 * the answer is the ceiling of the ratio: the printed answer is the smallest
 * whole number of modules whose installed capacity covers the target. The
 * demand noun (`cases`, `units`, `participants`, …) varies across the variants;
 * the divisor, the capacity unit, and the size of the reserve vary with it.
 */

import { slugify } from '../../naming.mjs';

const SYSTEM_PATTERN =
  /A system must cover demand of (\d+) ([a-z ]+) and, under a resilience rule, maintain an additional (\d+)% reserve above estimated demand\. Each identical module can supply at most (\d+) ([a-z ]+)\./;
const INDIVISIBLE_PATTERN = /Modules are indivisible, and reserve capacity must exist physically/;

function parse(statement) {
  const system = SYSTEM_PATTERN.exec(statement);
  if (system === null) {
    throw new Error('the statement does not state the demand, the reserve, and the module supply');
  }
  if (!INDIVISIBLE_PATTERN.test(statement)) {
    throw new Error('the statement does not state that modules are indivisible');
  }
  const demand = Number(system[1]);
  const demandUnit = system[2].trim();
  const reserve = Number(system[3]);
  const capacity = Number(system[4]);
  const capacityUnit = system[5].trim();
  if (demandUnit !== capacityUnit) {
    throw new Error('the demand and the module supply must be stated in the same unit');
  }
  if (!(demand > 0) || !(capacity > 0)) {
    throw new Error('the demand and the module supply must be positive quantities');
  }
  if (!Number.isInteger(reserve) || reserve < 0 || reserve >= 100) {
    throw new Error('the reserve must be a whole percentage below one hundred');
  }
  if ((demand * (100 + reserve)) % 100 !== 0) {
    throw new Error('the stated reserve does not leave a whole required capacity');
  }
  return { demand, reserve, capacity, unit: capacityUnit };
}

function solve(slots) {
  const required = (slots.demand * (100 + slots.reserve)) / 100;
  const modules = Math.ceil(required / slots.capacity);
  const installed = modules * slots.capacity;
  return {
    demand: slots.demand,
    reserve: slots.reserve,
    capacity: slots.capacity,
    unit: slots.unit,
    required,
    modules,
    installed,
    spare: installed - required
  };
}

function render(solution) {
  return `At least ${solution.modules} modules are required.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Number.isInteger(slots.demand) && slots.demand > 0, "the statement must state a positive whole demand");',
  'probe(Number.isInteger(slots.capacity) && slots.capacity > 0, "the module supply must be a positive whole quantity");',
  'probe(Number.isInteger(slots.reserve) && slots.reserve >= 0 && slots.reserve < 100, "the reserve must be a whole percentage below one hundred");',
  'probe((slots.demand * (100 + slots.reserve)) % 100 === 0, "the stated reserve must leave a whole required capacity");',
  'const required = (slots.demand * (100 + slots.reserve)) / 100;',
  'const modules = Math.ceil(required / slots.capacity);',
  'const installed = modules * slots.capacity;',
  'probe(Number.isInteger(modules) && modules > 0, "the target capacity must need at least one module");',
  'probe(installed >= required, "the installed capacity must cover the target capacity");',
  'probe(installed - slots.capacity < required, "one module fewer must fall short of the target capacity");',
  'return "At least " + modules + " modules are required.";'
].join('\n');

function explain(slots, solution) {
  const ratio = solution.required / solution.capacity;
  return [
    `The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: ${solution.demand} × (1 + ${solution.reserve}/100) = ${solution.required} ${solution.unit}.`,
    `Dividing by the supply of one module gives ${solution.required}/${solution.capacity} = ${ratio}, the theoretical module count.`,
    `Modules are indivisible and the target is a minimum, so the ratio is rounded up to ${solution.modules} modules; ${solution.modules} modules install ${solution.installed} ${solution.unit}, which covers the target${solution.spare === 0 ? ' exactly' : ` with ${solution.spare} ${solution.unit} to spare`}, while one module fewer would fall short.`,
    'Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.'
  ];
}

export const unit = 17;

export const cases = [
  {
    template: 'Integer capacity threshold',
    type: slugify('Integer capacity threshold'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
