/**
 * Section 3 of the logical-reasoning book: if the front is present.
 *
 * Every case prints one night-ward rule in the form "IF a visitor arrives after
 * H:00, THEN the visitor signs the late book and waits in the lobby", two
 * arrival times — one after the printed hour, one before it — and a third
 * speaker who calls the rule a suggestion because the lobby looks empty. The
 * case data changes the place, the hour, the two times, and the three names;
 * the reasoning is fixed: the satisfied antecedent forces the consequent by
 * modus ponens, a time before the hour leaves this one sentence silent, and
 * the atmosphere of the lobby is not a clause of the rule. The family compares
 * the two arrival times with the printed hour in minutes.
 */

import { slugify } from '../../naming.mjs';

const RULE_PATTERN =
  /Night-ward rule in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): “IF a visitor arrives after (\d{1,2}):(\d{2}), THEN the visitor signs the late book and waits in the lobby\.”/;
const ARRIVALS_PATTERN =
  /([A-Z][a-z]+) arrives at (\d{1,2}):(\d{2})\. ([A-Z][a-z]+) arrived at (\d{1,2}):(\d{2})\. ([A-Z][a-z]+) says the rule is only a suggestion because the lobby looks empty\./;

function toMinutes(hours, minutes) {
  return Number(hours) * 60 + Number(minutes);
}

function parse(statement) {
  const rule = RULE_PATTERN.exec(statement);
  const arrivals = ARRIVALS_PATTERN.exec(statement);
  if (rule === null || arrivals === null) {
    throw new Error('the statement does not carry the night-ward rule and the two arrivals');
  }
  return {
    place: rule[1],
    cutoffMinutes: toMinutes(rule[2], rule[3]),
    lateArrivalMinutes: toMinutes(arrivals[2], arrivals[3]),
    earlyArrivalMinutes: toMinutes(arrivals[5], arrivals[6]),
    lateVisitor: arrivals[1],
    earlyVisitor: arrivals[4],
    doubter: arrivals[7]
  };
}

/**
 * The rule is the implication "after the cut-off implies sign and wait". It
 * forces its consequent for the visitor whose arrival is after the cut-off and
 * stays silent for the visitor who arrived before it; any other pair of times
 * is not this section's pattern.
 */
function solve(slots) {
  if (slots.lateArrivalMinutes <= slots.cutoffMinutes) {
    throw new Error(`${slots.lateVisitor} arrives at or before the cut-off, so the antecedent is not satisfied`);
  }
  if (slots.earlyArrivalMinutes > slots.cutoffMinutes) {
    throw new Error(`${slots.earlyVisitor} arrives after the cut-off, so the rule is not silent for that visitor`);
  }
  return {
    forced: slots.lateVisitor,
    uncovered: slots.earlyVisitor
  };
}

function render(solution) {
  return `${solution.forced} must sign and wait (modus ponens). ${solution.uncovered} is not covered by this sentence. An empty lobby is not a written exception.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the rule must name the ward");',
  'probe(Number.isInteger(slots.cutoffMinutes) && slots.cutoffMinutes > 0, "the rule must state a positive arrival cut-off");',
  'probe(slots.lateArrivalMinutes > slots.cutoffMinutes, "the forcing visitor must arrive after the cut-off");',
  'probe(slots.earlyArrivalMinutes <= slots.cutoffMinutes, "the uncovered visitor must arrive at or before the cut-off");',
  'probe(new Set([slots.lateVisitor, slots.earlyVisitor, slots.doubter]).size === 3, "the arrivals and the remark must come from three different people");',
  'return slots.lateVisitor + " must sign and wait (modus ponens). " + slots.earlyVisitor + " is not covered by this sentence. An empty lobby is not a written exception.";'
].join('\n');

/**
 * The printed clock times, padded, so the explanation reads the hours of the
 * statement instead of raw minute counts.
 */
function formatMinutes(value) {
  const hours = Math.floor(value / 60);
  return `${hours}:${String(value % 60).padStart(2, '0')}`;
}

function explain(slots, solution) {
  return [
    `The rule of ${slots.place} is a conditional whose antecedent is "arrives after ${formatMinutes(slots.cutoffMinutes)}" and whose consequent is "signs the late book and waits in the lobby".`,
    `${solution.forced} arrives at ${formatMinutes(slots.lateArrivalMinutes)}, so the antecedent is true and the consequent follows by modus ponens.`,
    `${solution.uncovered} arrives at ${formatMinutes(slots.earlyArrivalMinutes)}, so the antecedent is false and this one sentence says nothing about that visitor.`,
    `${slots.doubter} appeals to an empty lobby, but atmosphere is not a clause of the rule; only a written exception could release the consequent.`
  ];
}

export const unit = 3;

export const cases = [
  {
    template: 'If the front is present',
    type: slugify('If the front is present'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
