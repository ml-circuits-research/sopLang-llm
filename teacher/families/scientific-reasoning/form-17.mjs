/**
 * Form 17 of the scientific-reasoning book: multi-step synthesis.
 *
 * Every variant states one named case with the values of four properties, the
 * eligibility rule as the list of properties that must hold, and a process as
 * a chain of connected rules together with the stated order of its stages. The
 * answer answers three questions at once: whether the case satisfies every
 * required property, which stage the chain reaches after three links from its
 * first stage, and which stage immediately precedes the final stage.
 *
 * The variants differ in the world's vocabulary (germination, water transport,
 * a meadow, the life cycle of an insect, digestion, a circuit, a measurement)
 * and in the length of the stage names, not in the rule. The chemistry variant
 * names its case “iron” instead of a letter and drops one property from its
 * eligibility rule, and the answer key prints “we reach at” there instead of
 * “we reach”, so the family keeps that printed wording for that stage.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/;
const CASE_PATTERN =
  /Case (\S+) has the properties: (.*?)\. The eligibility rule requires (.*?)\. For the process, we have the following connected rules: ([\s\S]*?)\. The stated order is: ([\s\S]*?)\.?$/;
const PROPERTY_PATTERN = /([^;]+?): (YES|NO)/g;
const ARROW = '→';
const LINKS = 3;

/**
 * The stage the answer key of one variant prints as "we reach at" instead of
 * "we reach"; the entry reproduces that printed wording.
 */
const REACH_AT_PRINTINGS = new Set(['we evaporate the water']);

function listOf(text) {
  return text
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value !== '');
}

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state its case and its process');
  }
  const parts = CASE_PATTERN.exec(caseData[1]);
  if (parts === null) {
    throw new Error('the statement does not state the properties, the eligibility rule, and the process chain');
  }
  const properties = {};
  for (const property of parts[2].matchAll(PROPERTY_PATTERN)) {
    properties[property[1].trim()] = property[2] === 'YES';
  }
  const required = listOf(parts[3]);
  const stages = parts[5]
    .split(ARROW)
    .map((stage) => stage.trim())
    .filter((stage) => stage !== '');
  if (Object.keys(properties).length === 0 || required.length === 0 || stages.length < LINKS + 1) {
    throw new Error('the statement must state properties, the eligibility rule, and a chain of stages');
  }
  return { label: parts[1].trim(), properties, required, stages };
}

/**
 * The three levels of the synthesis: the eligibility rule is a conjunction over
 * the stated property values, the third link of the chain is the stage three
 * arrows away from its first stage, and the predecessor is the stage printed
 * immediately before the last one.
 */
function solve(slots) {
  const missing = slots.required.filter((property) => !(property in slots.properties));
  if (missing.length > 0) {
    throw new Error(`the case does not state the required properties: ${missing.join(', ')}`);
  }
  if (!slots.required.every((property) => slots.properties[property] === true)) {
    throw new Error('the case does not satisfy the stated eligibility rule, which the printed form does not answer');
  }
  return {
    label: slots.label,
    reached: slots.stages[LINKS],
    predecessor: slots.stages[slots.stages.length - 2],
    final: slots.stages[slots.stages.length - 1]
  };
}

function render(solution) {
  const reach = REACH_AT_PRINTINGS.has(solution.reached.toLowerCase())
    ? `after three links we reach at “${solution.reached}”`
    : `after three links we reach “${solution.reached}”`;
  return `(1) Yes, case ${solution.label}; (2) ${reach}; (3) immediately before it is “${solution.predecessor}”.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const links = 3;',
  'probe(typeof slots.label === "string" && slots.label.length > 0, "the statement must name its case");',
  'probe(slots.properties !== null && typeof slots.properties === "object" && Object.keys(slots.properties).length > 0, "the case must state its properties");',
  'probe(Array.isArray(slots.required) && slots.required.length > 0, "the statement must state the eligibility rule");',
  'probe(Array.isArray(slots.stages) && slots.stages.length > links, "the process chain must have more than " + links + " stages");',
  'probe(slots.stages.every((stage) => typeof stage === "string" && stage.length > 0), "every stage of the chain must be a non-empty label");',
  'const missing = slots.required.filter((property) => !(property in slots.properties));',
  'probe(missing.length === 0, "the case must state every required property: " + missing.join(", "));',
  'probe(slots.required.every((property) => slots.properties[property] === true), "the case must satisfy every required property");',
  'const reached = slots.stages[links];',
  'const predecessor = slots.stages[slots.stages.length - 2];',
  'probe(predecessor !== reached, "the predecessor of the final stage must differ from the reached stage");',
  'const reach = reached.toLowerCase() === "we evaporate the water" ? "after three links we reach at “" + reached + "”" : "after three links we reach “" + reached + "”";',
  'return "(1) Yes, case " + slots.label + "; (2) " + reach + "; (3) immediately before it is “" + predecessor + "”.";'
].join('\n');

function explain(slots, solution) {
  return [
    `Level 1 checks the eligibility rule as a conjunction over the stated properties: ${slots.required.map((property) => `${property} = ${slots.properties[property] ? 'YES' : 'NO'}`).join(', ')}, so case ${solution.label} is eligible.`,
    `Level 2 follows the stated order and applies one link per step: ${slots.stages.slice(0, LINKS + 1).join(' → ')}, so after three links the process reaches “${solution.reached}”.`,
    `Level 3 reads the same order backwards from its end: the stage printed immediately before the final stage “${solution.final}” is “${solution.predecessor}”.`,
    'The synthesis uses only the links the data state, so no stage that the chain does not connect is introduced.'
  ];
}

export const unit = 17;

export const cases = [
  {
    template: 'Multi-step synthesis',
    type: slugify('Multi-step synthesis'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
