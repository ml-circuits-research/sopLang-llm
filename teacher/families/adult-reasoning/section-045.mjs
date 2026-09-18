/**
 * Section 45 of the adult-reasoning course: income tax in a closed scenario.
 *
 * Every variant prints one closed scenario in quotation marks — a taxable
 * income defined as the gross minus a fixed allowance, a single flat rate, and
 * the sentence "No other allowances" — and then one gross amount. The verdict
 * applies only that scenario: the base is the gross minus the printed
 * allowance and the tax is the printed rate of that base, with no rate,
 * threshold, or credit imported from a real tax code. The cases change the
 * person, the allowance, and the gross, so the family derives the base and the
 * tax from the parsed values with scaled integer arithmetic.
 */

import { slugify } from '../../naming.mjs';

const SCENARIO_PATTERN = /“Taxable income = gross − (\d+)\. Rate (\d+)% of the taxable base\./;
const GROSS_PATTERN = /([A-Z][a-z]+)’s gross: (\d+)\./;

/** The printed tax: the hundredths are exact because the base and the rate are integers. */
function taxText(base, ratePercent) {
  const hundredths = base * ratePercent;
  return `${Math.floor(hundredths / 100)}.${String(hundredths % 100).padStart(2, '0')}`;
}

function parse(statement) {
  const scenario = SCENARIO_PATTERN.exec(statement);
  const gross = GROSS_PATTERN.exec(statement);
  if (scenario === null || gross === null) {
    throw new Error('the statement does not print the closed scenario and the gross amount');
  }
  if (!/No other allowances\./.test(statement)) {
    throw new Error('the statement does not close the scenario with "No other allowances"');
  }
  return {
    allowance: Number(scenario[1]),
    ratePercent: Number(scenario[2]),
    person: gross[1],
    gross: Number(gross[2])
  };
}

function solve(slots) {
  if (!(slots.gross > slots.allowance)) {
    throw new Error('the gross does not exceed the allowance, so the base would not be positive');
  }
  const base = slots.gross - slots.allowance;
  return {
    base,
    tax: taxText(base, slots.ratePercent)
  };
}

function render(solution) {
  return `Base ${solution.base}. Tax ${solution.tax}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.person === "string" && slots.person.length > 0, "the case must name the person the gross belongs to");',
  'probe(Number.isInteger(slots.allowance) && slots.allowance > 0, "the scenario must print a positive allowance");',
  'probe(Number.isInteger(slots.ratePercent) && slots.ratePercent > 0 && slots.ratePercent < 100, "the scenario must print a rate between 0 and 100 percent");',
  'probe(Number.isInteger(slots.gross) && slots.gross > slots.allowance, "the gross must be a whole amount above the allowance");',
  'const base = slots.gross - slots.allowance;',
  'probe(base > 0, "the taxable base must be positive");',
  'const hundredths = base * slots.ratePercent;',
  'probe(Number.isInteger(hundredths), "the tax in hundredths must stay a whole number");',
  'const tax = Math.floor(hundredths / 100) + "." + String(hundredths % 100).padStart(2, "0");',
  'return "Base " + base + ". Tax " + tax + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The scenario defines the taxable income as the gross minus ${slots.allowance}, so ${slots.person}’s gross of ${slots.gross} gives a base of ${solution.base}.`,
    `The only rate on the page is ${slots.ratePercent}% of the taxable base, so the tax is ${solution.tax} and no other allowance enters the computation.`,
    `The scenario is a closed course example, and "No other allowances" stops any real tax code from being imported into it.`
  ];
}

export const unit = 45;

export const cases = [
  {
    template: 'Income tax in a closed scenario',
    type: slugify('Income tax in a closed scenario'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
