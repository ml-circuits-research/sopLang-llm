/**
 * Section 50 of the logical-reasoning book: after this, therefore because of
 * this.
 *
 * Every case records a fete where something new went up at one listed hour and
 * a later listed hour brought an unrelated event, then has one person call the
 * first event the cause, one answer that later is not because, and one propose
 * removing the first event to control the weather. The case data changes the
 * place, the event pair, the two listed hours, and the three names; the
 * verdict is fixed: mere sequence earns no causal claim, because no mechanism,
 * no contrast, and no replication are printed.
 */

import { slugify } from '../../naming.mjs';

const FETE_PATTERN =
  /Fete in (.+?): a new ([a-z-]+) went up at ([a-z0-9:]+); at ([0-9:]+) a ([a-z-]+) arrived\./;
const CAUSE_PATTERN = /([A-Z][a-z]+) says the ([a-z-]+) caused the ([a-z-]+)\./;
const SEQUENCE_PATTERN = /([A-Z][a-z]+) says later is not because\./;
const REMEDY_PATTERN = /([A-Z][a-z]+) says the town should take the ([a-z-]+) down to keep weather fair\./;

function parse(statement) {
  const fete = FETE_PATTERN.exec(statement);
  const cause = CAUSE_PATTERN.exec(statement);
  const sequence = SEQUENCE_PATTERN.exec(statement);
  const remedy = REMEDY_PATTERN.exec(statement);
  if (fete === null || cause === null || sequence === null || remedy === null) {
    throw new Error('the statement does not record the fete, the two hours, and the three verdicts');
  }
  return {
    place: fete[1],
    object: fete[2],
    firstHour: fete[3],
    secondHour: fete[4],
    outcome: fete[5],
    cause: cause[1],
    causeObject: cause[2],
    causeOutcome: cause[3],
    sequence: sequence[1],
    remedy: remedy[1],
    remedyObject: remedy[2]
  };
}

function solve(slots) {
  if (slots.object === slots.outcome) {
    throw new Error('the earlier event and the later event must be different');
  }
  if (slots.causeObject !== slots.object || slots.causeOutcome !== slots.outcome) {
    throw new Error('the causal sentence must be about the stated event pair');
  }
  if (slots.remedyObject !== slots.object) {
    throw new Error('the removing verdict must be about the earlier event');
  }
  if (slots.cause === slots.sequence || slots.cause === slots.remedy || slots.sequence === slots.remedy) {
    throw new Error('the three verdicts must be attributed to three different people');
  }
  return {
    place: slots.place,
    object: slots.object,
    outcome: slots.outcome,
    firstHour: slots.firstHour,
    secondHour: slots.secondHour
  };
}

function render(solution) {
  return `None about the ${solution.object} and the ${solution.outcome}. A later event can follow anything you hung at ${solution.firstHour}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the fete must name its place");',
  'probe(typeof slots.object === "string" && slots.object.length > 0, "the earlier event must be named");',
  'probe(typeof slots.outcome === "string" && slots.outcome.length > 0, "the later event must be named");',
  'probe(slots.object !== slots.outcome, "the earlier event and the later event must be different");',
  'probe(typeof slots.firstHour === "string" && slots.firstHour.length > 0 && typeof slots.secondHour === "string" && slots.secondHour.length > 0, "both listed hours must be stated");',
  'probe(slots.firstHour !== slots.secondHour, "the two events must not share one listed hour");',
  'probe(slots.causeObject === slots.object && slots.causeOutcome === slots.outcome, "the causal sentence must be about the stated event pair");',
  'probe(slots.remedyObject === slots.object, "the removing verdict must be about the earlier event");',
  'probe(slots.cause !== slots.sequence && slots.cause !== slots.remedy && slots.sequence !== slots.remedy, "the three verdicts must be attributed to three different people");',
  'return "None about the " + slots.object + " and the " + slots.outcome + ". A later event can follow anything you hung at " + slots.firstHour + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `In ${slots.place} the ${solution.object} went up at ${slots.firstHour} and the ${solution.outcome} arrived at ${slots.secondHour}, so the page prints a sequence and nothing more.`,
    `${slots.cause} reads that sequence as a causal sentence, but after this therefore because of this is the oldest fallacy on the list: time-order is a clue, not a sufficient proof.`,
    `The page prints no mechanism, no contrast between a fete with and without the ${solution.object}, and no replication, so the causal claim about the ${solution.object} and the ${solution.outcome} is unpaid.`,
    `${slots.remedy} would take the ${solution.object} down to keep the weather fair, which treats a joke as an engine; a later event can follow anything you hung at ${solution.firstHour}.`
  ];
}

export const unit = 50;

export const cases = [
  {
    template: 'After this, therefore because of this',
    type: slugify('After this, therefore because of this'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
