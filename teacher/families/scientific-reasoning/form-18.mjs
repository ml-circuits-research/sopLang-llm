/**
 * Form 18 of the scientific-reasoning book: detecting a contradiction.
 *
 * Every variant builds a small world, then prints a student conclusion and one
 * explicit data record of the form `In the data, for case <label>, "<property>"
 * is NO`. The conclusion claims that a case meets every mandatory condition
 * including that same property, so the quoted claim and the record cannot both
 * be true in the same case and the same model. The family locates the exact
 * contradiction by matching the property the conclusion asserts with the
 * property the record negates, and prints the minimum correction: withdrawing
 * the asserted proposition instead of editing any other part of the data.
 *
 * The variants change the world vocabulary (germination, a plant, a meadow, a
 * habitat, a mixture, ...), the case label (`A`, `pebbles`), and the property
 * ("the shoot receives light", "the component is attracted by a magnet"); the
 * reasoning stays the same, so one family covers all twenty-five of them.
 */

import { slugify } from '../../naming.mjs';

const CONCLUSION_PATTERN =
  /A student writes the conclusion: “([\s\S]+?) meets all mandatory conditions, including ([\s\S]+?)\./;
const RECORD_PATTERN =
  /The problem data includes:\s*In the data, for case ([\s\S]+?), “([\s\S]+?)” is (YES|NO)\./;
const CORRECTION =
  'The correction is not to assign the case or stage a property or order that the data explicitly negate.';

/** The conclusion and the record name one property; one variant writes it with a leading "that". */
function normalizeProperty(text) {
  return String(text).trim().toLowerCase().replace(/^that\s+/, '');
}

function parse(statement) {
  const caseData = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state its case data');
  }
  const conclusion = CONCLUSION_PATTERN.exec(caseData[1]);
  const record = RECORD_PATTERN.exec(caseData[1]);
  if (conclusion === null || record === null) {
    throw new Error('the case data does not quote both the conclusion and the record that contradicts it');
  }
  return {
    conclusion: { label: conclusion[1].trim(), property: conclusion[2].trim() },
    record: { caseLabel: record[1].trim(), property: record[2].trim(), value: record[3] }
  };
}

function solve(slots) {
  if (normalizeProperty(slots.conclusion.property) !== normalizeProperty(slots.record.property)) {
    throw new Error('the quoted conclusion does not assert the property that the data record states');
  }
  if (slots.record.value !== 'NO') {
    throw new Error('the data record does not negate the property the conclusion asserts');
  }
  return {
    caseLabel: slots.record.caseLabel,
    property: slots.record.property,
    value: slots.record.value
  };
}

function render(solution) {
  return `The statement is contradictory because In the data, for case ${solution.caseLabel}, “${solution.property}” is ${solution.value}. ${CORRECTION}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(slots.conclusion !== null && typeof slots.conclusion === "object", "the case data must quote the student conclusion");',
  'probe(typeof slots.conclusion.label === "string" && slots.conclusion.label.length > 0, "the conclusion must name the case it claims to satisfy");',
  'probe(typeof slots.conclusion.property === "string" && slots.conclusion.property.length > 0, "the conclusion must name the property it asserts");',
  'probe(slots.record !== null && typeof slots.record === "object", "the case data must quote the explicit data record");',
  'probe(["YES", "NO"].includes(slots.record.value), "the record must state YES or NO");',
  'const normalize = (text) => String(text).trim().toLowerCase().replace(/^that\\s+/, "");',
  'probe(normalize(slots.conclusion.property) === normalize(slots.record.property), "the conclusion and the record must speak about the same property");',
  'probe(slots.record.value === "NO", "a contradiction needs a record that negates the asserted property");',
  'return "The statement is contradictory because In the data, for case " + slots.record.caseLabel + ", “" + slots.record.property + "” is " + slots.record.value + ". The correction is not to assign the case or stage a property or order that the data explicitly negate.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The printed conclusion is split into checkable propositions: it asserts that case ${slots.conclusion.label} meets all mandatory conditions, including “${slots.conclusion.property}”.`,
    `The explicit record states that for case ${solution.caseLabel}, “${solution.property}” is ${solution.value}, so the two propositions are a claim and its negation in one case and one model.`,
    'A statement and its negation cannot both be true at the same time, so the printed conclusion cannot hold while the data stands.',
    'The minimum correction withdraws exactly the contradicted proposition and leaves the rest of the information unchanged.'
  ];
}

export const unit = 18;

export const cases = [
  {
    template: 'Detecting a contradiction',
    type: slugify('Detecting a contradiction'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
