/**
 * Section 96 of the adult-reasoning course: thinking traps illustrated.
 *
 * Every variant lists the same three traps with their one-line definitions —
 * confirmation, anchor, and sunk cost — and then shows one person who paid a
 * sum for a poor course and stays only so as not to lose it, while the text
 * says the remaining hours do not bring the money back. The verdict names the
 * trap the vignette illustrates and explains that the sum is gone on both
 * branches, so the next hour is a new cost of time. The variants change the
 * person and the sum, so the family derives the trap label, the amount, and the
 * two clauses from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const TRAP_PATTERN = /(confirmation|anchor|sunk cost) \(([^)]+)\)/g;
const VIGNETTE_PATTERN =
  /([A-Z][a-z]+) paid (\d+) for a poor course and stays [“"']so as not to lose (\d+)[”"'][^.]*\./;
const ALREADY_PAID_CUE = /already put money in/;

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function parse(statement) {
  const definitions = [...statement.matchAll(TRAP_PATTERN)].map((match) => ({
    label: match[1],
    definition: match[2]
  }));
  const vignette = VIGNETTE_PATTERN.exec(statement);
  if (definitions.length < 3 || vignette === null) {
    throw new Error('the statement does not carry the three trap definitions and the vignette');
  }
  return {
    person: vignette[1],
    amount: Number(vignette[2]),
    saidAmount: Number(vignette[3]),
    vignetteText: vignette[0],
    definitions
  };
}

function solve(slots) {
  const trap = slots.definitions.find((entry) => ALREADY_PAID_CUE.test(entry.definition));
  if (trap === undefined) {
    const error = new Error('no listed trap is defined by continuing because money was already put in');
    error.ambiguous = true;
    throw error;
  }
  if (!/so as not to lose/.test(slots.vignetteText)) {
    throw new Error(`the vignette does not show the behaviour the ${trap.label} trap names`);
  }
  if (slots.amount !== slots.saidAmount) {
    throw new Error('the sum paid and the sum the person wants to save differ, so the vignette is not this section’s pattern');
  }
  return { trap: capitalize(trap.label), amount: slots.amount };
}

function render(solution) {
  return `${solution.trap}. The ${solution.amount} are gone on both branches. The next hour is a new cost of time.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const trap = slots.definitions.find((entry) => /already put money in/.test(entry.definition));',
  'const label = trap.label.charAt(0).toUpperCase() + trap.label.slice(1);',
  'const answer = label + ". The " + slots.amount + " are gone on both branches. The next hour is a new cost of time.";',
  'return answer;'
].join('\n');

function explain(slots, solution) {
  const sunkCost = slots.definitions.find((entry) => ALREADY_PAID_CUE.test(entry.definition));
  return [
    `${slots.person} keeps attending only because the ${solution.amount} was already paid, which is the behaviour the ${sunkCost.label} trap defines as continuing because the money is in.`,
    `That sum is gone whether the course is finished or dropped, so staying cannot save it: the ${solution.amount} are the same on both branches.`,
    `What staying does add is a new cost — the next hour — on top of a course whose remaining hours do not bring the money back, so the decision must weigh the coming hour, not the spent sum.`
  ];
}

export const unit = 96;

export const cases = [
  {
    template: 'Thinking traps illustrated',
    type: slugify('Thinking traps illustrated'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
