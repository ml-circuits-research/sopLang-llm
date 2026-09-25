/**
 * Pattern 2 of the decompose-to-solve book: competing alternatives.
 *
 * Every variant states the same shape: a workload of items, two named options
 * that differ in setup time, cycle capacity, fixed cost, and per-item cost, and
 * two shared constraints (a completion limit in minutes and a cost ceiling in
 * units). Each option is evaluated on its own — `setup + ceil(items / capacity)
 * × 6` minutes and `fixed + perItem × items` units — and the summaries are then
 * compared: feasibility is mandatory, and among the feasible options the lower
 * cost wins. The variants change the domain phrase, the item noun, and the
 * numbers, not the method; the printed answer only names the selected option.
 * All hundred variants have both options feasible and distinct costs.
 */

import { slugify } from '../../naming.mjs';

const ITEMS_PATTERN = /(\d+) [a-z][a-z -]* must be handled\./;
const OPTION_A_PATTERN =
  /Option A has a (\d+)-minute setup, processes (\d+) [a-z][a-z -]* per six-minute cycle, costs (\d+\.\d\d) units fixed plus (\d+\.\d\d) per item\./;
const OPTION_B_PATTERN =
  /Option B has a (\d+)-minute setup, processes (\d+) per six-minute cycle, costs (\d+\.\d\d) units fixed plus (\d+\.\d\d) per item\./;
const CONSTRAINTS_PATTERN = /must finish within (\d+) minutes and cost at most (\d+\.\d\d) units\./;

function optionFrom(match, label) {
  return {
    label,
    setupMinutes: Number(match[1]),
    itemsPerCycle: Number(match[2]),
    fixedCents: Math.round(Number(match[3]) * 100),
    itemCents: Math.round(Number(match[4]) * 100)
  };
}

function parse(statement) {
  const items = ITEMS_PATTERN.exec(statement);
  const optionA = OPTION_A_PATTERN.exec(statement);
  const optionB = OPTION_B_PATTERN.exec(statement);
  const constraints = CONSTRAINTS_PATTERN.exec(statement);
  if (items === null || optionA === null || optionB === null || constraints === null) {
    throw new Error('the statement does not state the workload, both options, and the shared constraints');
  }
  return {
    items: Number(items[1]),
    optionA: optionFrom(optionA, 'A'),
    optionB: optionFrom(optionB, 'B'),
    limitMinutes: Number(constraints[1]),
    budgetCents: Math.round(Number(constraints[2]) * 100)
  };
}

function evaluate(option, items) {
  return {
    label: option.label,
    minutes: option.setupMinutes + Math.ceil(items / option.itemsPerCycle) * 6,
    costCents: option.fixedCents + option.itemCents * items
  };
}

function solve(slots) {
  const options = [evaluate(slots.optionA, slots.items), evaluate(slots.optionB, slots.items)];
  for (const option of options) {
    option.feasible = option.minutes <= slots.limitMinutes && option.costCents <= slots.budgetCents;
  }
  const feasible = options.filter((option) => option.feasible);
  if (feasible.length === 0) {
    throw new Error('neither option satisfies the stated time limit and cost ceiling');
  }
  const chosen = feasible.reduce((best, option) => (option.costCents < best.costCents ? option : best));
  if (feasible.filter((option) => option.costCents === chosen.costCents).length > 1) {
    throw new Error('the cheapest feasible options cost the same, so the preference rule does not select one');
  }
  return { chosen, options, limitMinutes: slots.limitMinutes, budgetCents: slots.budgetCents };
}

function render(solution) {
  return `Choose Option ${solution.chosen.label}. The important architecture is “evaluate each option locally, then compare summaries under shared constraints,” rather than interleaving the arithmetic of both options.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const optionFields = ["A", "B"];',
  'for (const label of optionFields) {',
  '  const option = slots["option" + label];',
  '}',
  'const evaluate = (option) => ({ label: option.label, minutes: option.setupMinutes + Math.ceil(slots.items / option.itemsPerCycle) * 6, costCents: option.fixedCents + option.itemCents * slots.items });',
  'const evaluated = [evaluate(slots.optionA), evaluate(slots.optionB)];',
  'for (const option of evaluated) {',
  '  option.feasible = option.minutes <= slots.limitMinutes && option.costCents <= slots.budgetCents;',
  '}',
  'const feasible = evaluated.filter((option) => option.feasible);',
  'probe(feasible.length > 0, "the scenario asks for a selection, so at least one option must satisfy both shared constraints");',
  'const chosen = feasible.reduce((best, option) => (option.costCents < best.costCents ? option : best));',
  'probe(chosen.feasible, "the selected option must stay within the stated time limit and cost ceiling");',
  'probe(feasible.every((option) => option.costCents >= chosen.costCents), "the selected option must be the cheapest feasible one");',
  'probe(feasible.filter((option) => option.costCents === chosen.costCents).length === 1, "the preference rule needs a unique cheapest feasible option");',
  'return "Choose Option " + chosen.label + ". The important architecture is “evaluate each option locally, then compare summaries under shared constraints,” rather than interleaving the arithmetic of both options.";'
].join('\n');

function minutesText(minutes) {
  return `${minutes} minutes`;
}

function costText(cents) {
  return `${(cents / 100).toFixed(2)} units`;
}

function explain(slots, solution) {
  const [first, second] = solution.options;
  return [
    `Each option is evaluated on its own: Option A finishes in ${minutesText(first.minutes)} and costs ${costText(first.costCents)}, while Option B finishes in ${minutesText(second.minutes)} and costs ${costText(second.costCents)}.`,
    `Both summaries are checked against the shared constraints of ${minutesText(solution.limitMinutes)} and ${costText(solution.budgetCents)}, and both options are feasible.`,
    `Comparing the two summaries under the lower-cost preference selects Option ${solution.chosen.label}: ${costText(solution.chosen.costCents)} is the cheaper feasible cost.`,
    `Interleaving the arithmetic of the two options would hide that the local evaluations are independent; keeping them separate is what makes the comparison trustworthy.`
  ];
}

export const unit = 2;

export const cases = [
  {
    template: 'Competing Alternatives',
    type: slugify('Competing Alternatives'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
