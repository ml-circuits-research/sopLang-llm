/**
 * Form 1 of the scientific-reasoning book: classification by multiple rules.
 *
 * Every variant builds a small world, lists four or five named cases with the
 * values of four properties, and asks which case satisfies the competition
 * rule. The rule names the required properties, which must all be YES, and the
 * forbidden properties, which must all be NO; when the statement says there is
 * no additional forbidden property, only the required list applies. The case
 * label is a letter in most variants and a component name in the chemistry
 * variant, so the family keeps whatever label the source prints.
 *
 * The variants differ in the world's vocabulary (germination, a plant, a
 * meadow, a habitat, a mixture), not in the rule, so one family covers all
 * twenty-five of them.
 */

import { slugify } from '../../naming.mjs';

const CASE_PATTERN = /Case ([A-Za-z][A-Za-z ]*?): (.*?)(?=\. Case |\.?$)/g;
const PROPERTY_PATTERN = /([^;]+?): (YES|NO)/g;

function parse(statement) {
  const caseData = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  const question = /Question\.\s*([\s\S]*)$/.exec(statement);
  if (caseData === null || question === null) {
    throw new Error('the statement does not state its cases and its competition rule');
  }
  const cases = [];
  for (const match of caseData[1].matchAll(CASE_PATTERN)) {
    const properties = {};
    for (const property of match[2].matchAll(PROPERTY_PATTERN)) {
      properties[property[1].trim()] = property[2] === 'YES';
    }
    cases.push({ label: match[1].trim(), properties });
  }
  if (cases.length === 0) {
    throw new Error('the statement lists no case');
  }
  const required = /accepted: (.+?); and the forbidden/.exec(question[1]);
  if (required === null) {
    throw new Error('the question does not list the required properties');
  }
  const forbidden = /forbidden properties are: (.+?)\./.exec(question[1]);
  const forbiddenList =
    forbidden === null || forbidden[1].trim() === 'no additional forbidden property'
      ? []
      : forbidden[1].split(',').map((value) => value.trim());
  return {
    cases,
    required: required[1].split(',').map((value) => value.trim()),
    forbidden: forbiddenList
  };
}

function solve(slots) {
  const matching = slots.cases.filter(
    (entry) =>
      slots.required.every((property) => entry.properties[property] === true) &&
      slots.forbidden.every((property) => entry.properties[property] === false)
  );
  if (matching.length === 0) {
    throw new Error('no case satisfies the competition rule');
  }
  if (matching.length > 1) {
    const ambiguity = new Error(`the stated rule leaves ${matching.length} matching cases`);
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  return { label: matching[0].label };
}

function render(solution) {
  return `Case ${solution.label}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.cases) && slots.cases.length > 0, "the statement must list at least one case");',
  'probe(Array.isArray(slots.required) && slots.required.length > 0, "the rule must require at least one property");',
  'probe(Array.isArray(slots.forbidden), "the rule must state its forbidden properties, possibly none");',
  'for (const entry of slots.cases) {',
  '  probe(typeof entry.label === "string" && entry.label.length > 0, "every case must carry a label");',
  '  probe(slots.required.every((property) => property in entry.properties), "every required property must appear in every case: " + entry.label);',
  '}',
  'const matching = slots.cases.filter((entry) => slots.required.every((property) => entry.properties[property] === true) && slots.forbidden.every((property) => entry.properties[property] === false));',
  'probe(matching.length > 0, "at least one case must satisfy the competition rule");',
  'probe(matching.length === 1, "the competition rule must leave exactly one case, not " + matching.length);',
  'return "Case " + matching[0].label + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The rule turns into a conjunction: all ${slots.required.length} required properties must be YES${slots.forbidden.length === 0 ? '' : ` and every forbidden property must be NO (${slots.forbidden.join(', ')})`}.`,
    `Checking the cases against the stated values eliminates each one as soon as a single required property is NO or a forbidden property is YES.`,
    `Only Case ${solution.label} satisfies every clause of the rule.`
  ];
}

export const unit = 1;

export const cases = [
  {
    template: 'Classification by multiple rules',
    type: slugify('Classification by multiple rules'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
