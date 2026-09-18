/**
 * Form 5 of the scientific-reasoning book: elimination by clues.
 *
 * Every variant lists four or five named cases with the values of four
 * properties, and the question states the observed value of some of those
 * properties for an unknown case. A clue is a hard constraint: any case whose
 * recorded value contradicts it is eliminated, and the clues are applied one
 * after another until a single case remains. The case label is a letter in most
 * variants and a component name in the chemistry variant, so the family keeps
 * whatever label the source prints.
 *
 * The world vocabulary changes from variant to variant (germination, water
 * transport, the meadow, materials, measurements), while the elimination does
 * not, so one family covers all twenty-five of them.
 */

import { slugify } from '../../naming.mjs';

const CASE_PATTERN = /Case ([^:]+): (.*?)(?=\. Case |\.?$)/g;
const PROPERTY_PATTERN = /([^;]+?): (YES|NO)/g;
const CLUE_PATTERN = /[“"](.+?)[”"] is (YES|NO)/g;

function parse(statement) {
  const caseData = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  const question = /Question\.\s*([\s\S]*)$/.exec(statement);
  if (caseData === null || question === null) {
    throw new Error('the statement does not state its cases and the clues about the unknown one');
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
  const clueText = /matches the clues: (.+?)\. Which case is it/.exec(question[1]);
  if (clueText === null) {
    throw new Error('the question does not state the clues about the unknown case');
  }
  const clues = [];
  for (const match of clueText[1].matchAll(CLUE_PATTERN)) {
    clues.push({ property: match[1].trim(), value: match[2] === 'YES' });
  }
  if (clues.length === 0) {
    throw new Error('the question states no clue');
  }
  return { cases, clues };
}

function solve(slots) {
  for (const entry of slots.cases) {
    for (const clue of slots.clues) {
      if (!(clue.property in entry.properties)) {
        throw new Error(`case ${entry.label} does not record the clue “${clue.property}”`);
      }
    }
  }
  let compatible = slots.cases.slice();
  const trail = [];
  for (const clue of slots.clues) {
    compatible = compatible.filter((entry) => entry.properties[clue.property] === clue.value);
    trail.push({ property: clue.property, value: clue.value, compatible: compatible.map((entry) => entry.label) });
  }
  if (compatible.length === 0) {
    throw new Error('the clues contradict every case');
  }
  if (compatible.length > 1) {
    const ambiguity = new Error(`the clues leave ${compatible.length} cases instead of one`);
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  return { label: compatible[0].label, trail };
}

function render(solution) {
  return `Case ${solution.label}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.cases) && slots.cases.length > 0, "the statement must list at least one case");',
  'probe(Array.isArray(slots.clues) && slots.clues.length > 0, "the question must state at least one clue");',
  'for (const entry of slots.cases) {',
  '  probe(typeof entry.label === "string" && entry.label.length > 0, "every case must carry a label");',
  '  probe(slots.clues.every((clue) => clue.property in entry.properties), "case " + entry.label + " must record every clue property");',
  '}',
  'let compatible = slots.cases.slice();',
  'for (const clue of slots.clues) {',
  '  compatible = compatible.filter((entry) => entry.properties[clue.property] === clue.value);',
  '}',
  'probe(compatible.length > 0, "the clues must not contradict every case");',
  'probe(compatible.length === 1, "the clues must leave exactly one case, not " + compatible.length);',
  'return "Case " + compatible[0].label + ".";'
].join('\n');

function explain(slots, solution) {
  const shown = (labels) => labels.join(', ');
  return [
    'Each clue fixes the value of one property for the unknown case, so the case that must be identified is the one whose recorded values match all of them.',
    'Applying the clues one after another removes the cases that contradict them: ' +
      solution.trail
        .map((step) => `after “${step.property} = ${step.value ? 'YES' : 'NO'}” only ${shown(step.compatible)} remain${step.compatible.length === 1 ? 's' : ''}`)
        .join('; ') + '.',
    `No case is eliminated by a property the clues leave open, and the surviving case ${solution.label} agrees with every clue at once.`,
    'A single remaining case is the answer; while two or more survive, the clues would not identify the unknown case.'
  ];
}

export const unit = 5;

export const cases = [
  {
    template: 'Elimination by clues',
    type: slugify('Elimination by clues'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
