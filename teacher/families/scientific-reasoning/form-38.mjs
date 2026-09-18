/**
 * Form 38 of the scientific-reasoning book: causality through intervention.
 *
 * Every variant states a world model, then a subexperiment in which two named
 * factors occur together with an increase in one quantity. Two interventions
 * follow: Test A removes the first factor with all other conditions held
 * constant, Test B removes the second. The factor whose removal makes the
 * increase disappear is the one the intervention supports as causal; the other
 * factor stays merely associated, because the initial joint observation does
 * not separate the two.
 *
 * The variants change the world's vocabulary (pollination, dispersal,
 * decomposition, a lever, an echo) and the order in which the two tests are
 * reported, not the reasoning, so one family covers all twenty-five of them.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/;
const FACTORS_PATTERN =
  /the factors “(.+?)” and “(.+?)” occur together with an increase in the quantity “(.+?)”/;
const TEST_PATTERN =
  /Test ([AB]) changes only “(.+?)” from present to absent[^;]*; the increase (disappears|remains)\./g;

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state the subexperiment');
  }
  const factors = FACTORS_PATTERN.exec(caseData[1]);
  if (factors === null) {
    throw new Error('the subexperiment does not name its two factors and its quantity');
  }
  const tests = [];
  for (const match of caseData[1].matchAll(TEST_PATTERN)) {
    tests.push({ test: match[1], factor: match[2], outcome: match[3] });
  }
  if (tests.length !== 2) {
    throw new Error(`the subexperiment must report two interventions, not ${tests.length}`);
  }
  const named = [factors[1], factors[2]];
  for (const test of tests) {
    if (!named.includes(test.factor)) {
      throw new Error(`the intervention removes “${test.factor}”, which is not one of the stated factors`);
    }
  }
  if (tests[0].factor === tests[1].factor) {
    throw new Error('the two interventions must remove different factors');
  }
  return { quantity: factors[3], factors: named, tests };
}

function solve(slots) {
  const causal = slots.tests.filter((test) => test.outcome === 'disappears');
  if (causal.length === 0) {
    throw new Error('no intervention removes the increase, so no factor is supported as causal');
  }
  if (causal.length > 1) {
    const ambiguity = new Error('both interventions remove the increase, so neither factor is singled out');
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  const associated = slots.factors.find((factor) => factor !== causal[0].factor);
  return { causal: causal[0].factor, associated };
}

function render(solution) {
  return `The factor supported as causal is “${solution.causal}”; “${solution.associated}” remains merely associated in the initial data.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.quantity === "string" && slots.quantity.length > 0, "the subexperiment must name the quantity that increases");',
  'probe(Array.isArray(slots.factors) && slots.factors.length === 2, "the subexperiment must name exactly two factors");',
  'probe(slots.factors[0] !== slots.factors[1], "the two factors must be distinct");',
  'probe(Array.isArray(slots.tests) && slots.tests.length === 2, "the subexperiment must report exactly two interventions");',
  'probe(slots.tests.every((test) => slots.factors.includes(test.factor)), "every intervention must remove one of the stated factors");',
  'probe(slots.tests.every((test) => test.outcome === "disappears" || test.outcome === "remains"), "an intervention either removes the increase or leaves it in place");',
  'const causal = slots.tests.filter((test) => test.outcome === "disappears");',
  'probe(causal.length === 1, "exactly one intervention must remove the increase, not " + causal.length);',
  'const associated = slots.factors.find((factor) => factor !== causal[0].factor);',
  'probe(typeof associated === "string" && associated.length > 0, "the factor left associated must be the other stated factor");',
  'return "The factor supported as causal is “" + causal[0].factor + "”; “" + associated + "” remains merely associated in the initial data.";'
].join('\n');

function explain(slots, solution) {
  const removed = slots.tests.find((test) => test.outcome === 'disappears');
  const kept = slots.tests.find((test) => test.outcome === 'remains');
  return [
    `The initial observation does not separate the factors because “${slots.factors[0]}” and “${slots.factors[1]}” occur together with the increase in “${slots.quantity}”.`,
    `When we eliminate only “${removed.factor}” with all other conditions held constant, the increase disappears; this supports its causal role in the submodel.`,
    `When we eliminate only “${kept.factor}”, the increase remains, so the initial association is not sufficient to establish causality for it.`,
    'The conclusion is limited to the stated interventions and conditions; we do not generalize beyond the model.'
  ];
}

export const unit = 38;

export const cases = [
  {
    template: 'Causality through intervention, not just correlation',
    type: slugify('Causality through intervention, not just correlation'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
