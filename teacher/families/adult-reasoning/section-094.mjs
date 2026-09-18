/**
 * Section 94 of the adult-reasoning course: reserve, insurance, and excess.
 *
 * Every variant prints the same policy terms — an excess, a yearly premium, and
 * full cover of a loss F — one person's reserve, and one loss that happens once
 * in the scenario. The verdict adds the premium and the excess as the insured
 * out-of-pocket, reads the uninsured out-of-pocket off the loss, and compares
 * the reserve with that loss. The variants change the person, the terms, the
 * reserve, and the loss, so the family derives the two out-of-pocket sums and
 * the reserve comparison from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const POLICY_PATTERN =
  /Insurance: excess (\d+), yearly premium (\d+), covers loss F\. Without insurance, F is paid from reserve\. ([A-Z][a-z]+)[’']s reserve: (\d+)\. One F of (\d+) happens once in the scenario\./;

function parse(statement) {
  const policy = POLICY_PATTERN.exec(statement);
  if (policy === null) {
    throw new Error('the statement does not carry the policy terms, the reserve, and the single loss');
  }
  const count = (statement.match(/One F of \d+ happens once/g) ?? []).length;
  if (count !== 1) {
    throw new Error('the statement must place exactly one loss in the scenario');
  }
  return {
    holder: policy[3],
    excess: Number(policy[1]),
    premium: Number(policy[2]),
    reserve: Number(policy[4]),
    loss: Number(policy[5])
  };
}

function solve(slots) {
  const insured = slots.premium + slots.excess;
  const uninsured = slots.loss;
  let comparison = '>';
  if (slots.reserve < uninsured) {
    comparison = '<';
  } else if (slots.reserve === uninsured) {
    comparison = '=';
  }
  return { premium: slots.premium, excess: slots.excess, reserve: slots.reserve, insured, uninsured, comparison };
}

function render(solution) {
  return `With: ${solution.premium}+${solution.excess}=${solution.insured}. Without: ${solution.uninsured}. Reserve ${solution.reserve} ${solution.comparison} the uninsured loss.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots === "object" && slots !== null, "the insurance case must carry its parsed values");',
  'probe(typeof slots.holder === "string" && slots.holder.length > 0, "the person holding the policy must be named");',
  'probe(Number.isInteger(slots.premium) && slots.premium > 0, "the yearly premium must be a positive whole number");',
  'probe(Number.isInteger(slots.excess) && slots.excess > 0, "the excess must be a positive whole number");',
  'probe(Number.isInteger(slots.reserve) && slots.reserve > 0, "the reserve must be a positive whole number");',
  'probe(Number.isInteger(slots.loss) && slots.loss > 0, "the loss must be a positive whole number");',
  'probe(slots.reserve < slots.loss, "the reserve must not cover the uninsured loss for this section");',
  'const insured = slots.premium + slots.excess;',
  'const uninsured = slots.loss;',
  'let comparison = ">";',
  'if (slots.reserve < uninsured) { comparison = "<"; } else if (slots.reserve === uninsured) { comparison = "="; }',
  'const answer = "With: " + slots.premium + "+" + slots.excess + "=" + insured + ". Without: " + uninsured + ". Reserve " + slots.reserve + " " + comparison + " the uninsured loss.";',
  'return answer;'
].join('\n');

function explain(slots, solution) {
  return [
    `With the policy ${slots.holder} pays the yearly premium ${slots.premium} plus the excess ${slots.excess} on the single loss, so the insured out-of-pocket is ${slots.premium}+${slots.excess}=${solution.insured}.`,
    `Without the policy the whole loss of ${solution.uninsured} is paid from the reserve, so the uninsured out-of-pocket is ${solution.uninsured}.`,
    `The reserve of ${slots.reserve} is ${solution.comparison} the uninsured loss of ${solution.uninsured}, so the drawer alone cannot absorb it and the policy caps the payment at ${solution.insured}.`
  ];
}

export const unit = 94;

export const cases = [
  {
    template: 'Reserve, insurance, and excess',
    type: slugify('Reserve, insurance, and excess'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
