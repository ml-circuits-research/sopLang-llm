/**
 * Section 10 of the logical-reasoning book: two written rules together.
 *
 * Every case posts a workshop board with two independent rules — a universal
 * about apprentices at the grinder and a conditional about the inner store
 * lamp — and records a worker who is an apprentice at the grinder while the
 * lamp is off, one speaker who lets the darkness excuse the worker from the
 * first rule, and one who applies each rule to its own object. The case data
 * changes the place and the names; the reasoning is fixed: the two rules have
 * different objects, so the state of the store does not reach the grinder
 * rule. The family reads the two rules and the worker's situation and renders
 * the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const RULE_ONE_PATTERN = /Rule One — “Every apprentice wears (.+?) at the (.+?)\.”/;
const RULE_TWO_PATTERN = /Rule Two — “The (.+?) is dark unless the (.+?) is on\.”/;
const WORKER_PATTERN = /([A-Z][a-z]+) is an apprentice at the ([a-z]+); the ([a-z ]+?) is off\./;
const SKIP_PATTERN = /([A-Z][a-z]+) says ([A-Z][a-z]+) may skip the shield because the ([a-z ]+?) is dark\./;
const APPLIER_PATTERN = /([A-Z][a-z]+) applies each rule to its own object\./;

function parse(statement) {
  const ruleOne = RULE_ONE_PATTERN.exec(statement);
  const ruleTwo = RULE_TWO_PATTERN.exec(statement);
  const worker = WORKER_PATTERN.exec(statement);
  const skip = SKIP_PATTERN.exec(statement);
  const applier = APPLIER_PATTERN.exec(statement);
  if (ruleOne === null || ruleTwo === null || worker === null || skip === null || applier === null) {
    throw new Error('the statement does not record both rules, the worker, the excuse, and the applier');
  }
  return {
    subject: worker[1],
    rulePlace: ruleOne[2],
    place: worker[2],
    garment: ruleOne[1],
    store: ruleTwo[1],
    lamp: ruleTwo[2],
    offLamp: worker[3],
    sayer: skip[1],
    namedWorker: skip[2],
    darkPlace: skip[3],
    applier: applier[1]
  };
}

function solve(slots) {
  const { subject, place, rulePlace, garment, store, lamp, offLamp, sayer, namedWorker, darkPlace, applier } = slots;
  if (place !== rulePlace) {
    throw new Error('the worker must stand at the place Rule One speaks about');
  }
  if (offLamp !== lamp) {
    throw new Error('the lamp that is off must be the lamp Rule Two names');
  }
  if (!store.includes(darkPlace)) {
    throw new Error('the darkness the excuse cites must be the darkness of Rule Two');
  }
  if (namedWorker !== subject) {
    throw new Error('the excuse must be made for the apprentice the case records');
  }
  if (sayer === subject || applier === subject || applier === sayer) {
    throw new Error('the apprentice, the excuser, and the applier must be three different people');
  }
  return { subject, place, garment, store, sayer, applier };
}

function render(solution) {
  return `${solution.subject} wears the shield. Darkness in the store follows Rule Two and does not cancel Rule One. Visibility is not a clause of Rule One.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.subject === "string" && slots.subject.length > 0, "the case must name the apprentice");',
  'probe(typeof slots.garment === "string" && slots.garment.length > 0, "Rule One must name what the apprentice wears");',
  'probe(slots.place === slots.rulePlace, "the worker must stand at the place Rule One speaks about");',
  'probe(slots.offLamp === slots.lamp, "the lamp that is off must be the lamp Rule Two names");',
  'probe(slots.store.indexOf(slots.darkPlace) !== -1, "the darkness the excuse cites must be the darkness of Rule Two");',
  'probe(slots.namedWorker === slots.subject, "the excuse must be made for the apprentice the case records");',
  'return slots.subject + " wears the shield. Darkness in the store follows Rule Two and does not cancel Rule One. Visibility is not a clause of Rule One.";'
].join('\n');

function explain(slots, solution) {
  return [
    `Rule One is a universal about apprentices at the ${slots.place}: they wear ${slots.garment}.`,
    `Rule Two speaks about a different object, the ${slots.store}, and only says it is dark unless the ${slots.lamp} is on; on this board the ${slots.offLamp} is off.`,
    `${solution.subject} is an apprentice at the ${slots.place}, so Rule One covers the case and the shield is forced.`,
    `Darkness in the ${slots.darkPlace} follows Rule Two and does not cancel Rule One, so ${solution.sayer} is dropping a rule that the board never dropped.`
  ];
}

export const unit = 10;

export const cases = [
  {
    template: 'Two written rules together',
    type: slugify('Two written rules together'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
