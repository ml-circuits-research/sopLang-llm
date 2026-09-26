/**
 * Section 93 of the adult-reasoning course: opportunity cost.
 *
 * Every variant names a person, a Saturday list of three options with at most
 * one money value on them, the option that is chosen, and the notebook rule
 * that only money is measured on the chosen axis. The verdict reads the money
 * opportunity cost of the chosen visit off the best money-valued option given
 * up — the extra shift — and notes that the option without a sum contributes
 * nothing on that axis. The variants change the name and the shift amount, so
 * the family derives the cost, its label, and the unvalued option from the
 * parsed list.
 */

import { slugify } from '../../naming.mjs';

const CASE_PATTERN =
  /Opportunity cost = the value of the best option given up\. ([A-Z][a-z]+), Saturday: (.+?)\. Chooses \((\d+)\)\./;
const OPTION_PATTERN = /\((\d+)\) ([^,]+?)(?=, |$)/g;
const VALUE_PATTERN = /^(.*?)(?: (\d+))?$/;

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function parseOptions(list) {
  const options = [];
  for (const match of list.matchAll(OPTION_PATTERN)) {
    const parts = VALUE_PATTERN.exec(match[2].trim());
    options.push({
      ordinal: Number(match[1]),
      label: parts[1].trim(),
      value: parts[2] === undefined ? null : Number(parts[2])
    });
  }
  return options;
}

function parse(statement) {
  const caseMatch = CASE_PATTERN.exec(statement);
  if (caseMatch === null) {
    throw new Error('the statement does not carry the person, the Saturday options, and the choice');
  }
  const options = parseOptions(caseMatch[2]);
  if (options.length < 3) {
    throw new Error(`the statement lists ${options.length} options instead of the three the section prints`);
  }
  if (!/measures only money today/.test(statement)) {
    throw new Error('the statement does not fix the axis the notebook measures');
  }
  return { person: caseMatch[1], options, chosen: Number(caseMatch[3]) };
}

function solve(slots) {
  const chosen = slots.options.find((option) => option.ordinal === slots.chosen);
  if (chosen === undefined) {
    throw new Error(`the statement chooses option ${slots.chosen}, which is not in the list`);
  }
  const givenUp = slots.options.filter((option) => option.ordinal !== chosen.ordinal);
  const valued = givenUp.filter((option) => option.value !== null);
  if (valued.length === 0) {
    const error = new Error('no option given up carries a money value, so the money cost is undefined');
    error.ambiguous = true;
    throw error;
  }
  const best = valued.reduce((leader, option) => (option.value > leader.value ? option : leader));
  const unvalued = givenUp.filter((option) => option.value === null);
  return {
    cost: best.value,
    label: best.label,
    chosenLabel: chosen.label,
    unvaluedLabel: unvalued.map((option) => capitalize(option.label)).join(' and ')
  };
}

function render(solution) {
  return `${solution.cost} (the ${solution.label}). ${solution.unvaluedLabel} has no sum on the chosen axis.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const chosen = slots.options.find((option) => option.ordinal === slots.chosen);',
  'const valued = slots.options.filter((option) => option.ordinal !== slots.chosen && option.value !== null);',
  'const best = valued.reduce((leader, option) => (option.value > leader.value ? option : leader));',
  'const unvalued = slots.options.filter((option) => option.ordinal !== slots.chosen && option.value === null);',
  'const unvaluedLabels = unvalued.map((option) => option.label.charAt(0).toUpperCase() + option.label.slice(1)).join(" and ");',
  'const answer = best.value + " (the " + best.label + "). " + unvaluedLabels + " has no sum on the chosen axis.";',
  'return answer;'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.person} chooses the ${solution.chosenLabel}, so the opportunity cost is the value of the best option given up.`,
    `On the money axis only the ${solution.label} has a sum, ${solution.cost}, and it is therefore the money opportunity cost of the visit.`,
    `The ${solution.unvaluedLabel.toLowerCase()} option has no sum on the chosen axis, so adding it would double count a value the notebook does not measure.`
  ];
}

export const unit = 93;

export const cases = [
  {
    template: 'Opportunity cost',
    type: slugify('Opportunity cost'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
