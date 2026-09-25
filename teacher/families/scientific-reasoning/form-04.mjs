/**
 * Form 4 of the scientific-reasoning book: choice under multiple conditions.
 *
 * Every variant lists four or five named options, each with the values of four
 * properties, and states in the question the conditions that must hold at the
 * same time. The rule is a conjunction: an option qualifies only when every
 * mandatory condition is YES, and one NO on any of them eliminates the option,
 * however many other properties it satisfies. The option label is a letter in
 * most variants and a component name in the chemistry variant, so the family
 * keeps whatever label the case prints.
 *
 * The world vocabulary changes from variant to variant (germination, water
 * transport, the meadow, materials, measurements), while the rule does not, so
 * one family covers all twenty-five of them.
 */

import { slugify } from '../../naming.mjs';

const OPTION_PATTERN = /Option ([^:]+): (.*?)(?=\. Option |\.?$)/g;
const PROPERTY_PATTERN = /([^;]+?): (YES|NO)/g;

function parse(statement) {
  const caseData = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  const question = /Question\.\s*([\s\S]*)$/.exec(statement);
  if (caseData === null || question === null) {
    throw new Error('the statement does not state its options and the conditions they must meet');
  }
  const options = [];
  for (const match of caseData[1].matchAll(OPTION_PATTERN)) {
    const properties = {};
    for (const property of match[2].matchAll(PROPERTY_PATTERN)) {
      properties[property[1].trim()] = property[2] === 'YES';
    }
    options.push({ label: match[1].trim(), properties });
  }
  if (options.length === 0) {
    throw new Error('the statement lists no option');
  }
  const conditions = /simultaneously meets all conditions: (.+?)\. If even one/.exec(question[1]);
  if (conditions === null) {
    throw new Error('the question does not list the mandatory conditions');
  }
  const required = conditions[1].split(',').map((value) => value.trim());
  if (required.length === 0) {
    throw new Error('the question states no mandatory condition');
  }
  return { options, required };
}

/** The first mandatory condition an option fails, or null when it meets all of them. */
function failureOf(option, required) {
  return required.find((property) => option.properties[property] !== true) ?? null;
}

function solve(slots) {
  for (const option of slots.options) {
    for (const property of slots.required) {
      if (!(property in option.properties)) {
        throw new Error(`option ${option.label} does not state the mandatory condition “${property}”`);
      }
    }
  }
  const matching = slots.options.filter((option) => failureOf(option, slots.required) === null);
  if (matching.length === 0) {
    throw new Error('no option meets every mandatory condition');
  }
  if (matching.length > 1) {
    const ambiguity = new Error(`the mandatory conditions leave ${matching.length} options instead of one`);
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  return {
    label: matching[0].label,
    eliminated: slots.options
      .filter((option) => option.label !== matching[0].label)
      .map((option) => ({ label: option.label, property: failureOf(option, slots.required) }))
  };
}

function render(solution) {
  return `Option ${solution.label}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'for (const option of slots.options) {',
  '}',
  'const failed = (option) => slots.required.find((property) => option.properties[property] !== true) ?? null;',
  'const matching = slots.options.filter((option) => failed(option) === null);',
  'probe(matching.length > 0, "at least one option must meet every mandatory condition");',
  'probe(matching.length === 1, "the mandatory conditions must leave exactly one option, not " + matching.length);',
  'return "Option " + matching[0].label + ".";'
].join('\n');

function explain(slots, solution) {
  const list = (entry) => `${entry.label} fails “${entry.property}”`;
  return [
    `The question turns the conditions into one conjunction: ${slots.required.join(' and ')} must all be YES at the same time, so a single NO eliminates an option.`,
    `Option ${solution.label} states YES for all ${slots.required.length} mandatory conditions, so it is the only option left standing.`,
    `The other options each fail at least one mandatory condition (${solution.eliminated.map(list).join('; ')}).`,
    'Counting YES values would be unsafe here, because a missing mandatory condition cannot be compensated by the properties that do not replace it.'
  ];
}

export const unit = 4;

export const cases = [
  {
    template: 'Choice under multiple conditions',
    type: slugify('Choice under multiple conditions'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
