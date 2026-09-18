/**
 * Form 11 of the scientific-reasoning book: fair test and control variables.
 *
 * Every variant states a model world, names the factor whose effect is to be
 * tested, gives the two levels the groups A and B receive, and lists the
 * conditions that must be kept constant. The reasoning is the same in all
 * twenty-five variants: a fair test changes exactly one factor, keeps every
 * other stated condition fixed in both groups, and measures the same outcome
 * variable, because changing a second condition at the same time leaves two
 * causes for one difference.
 *
 * The printed answer names the changed factor and the controlled conditions
 * exactly as the case data lists them, so the family reads the list from the
 * statement instead of carrying any domain words of its own.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Case data\.\s*([\s\S]*?)\n\nQuestion\./;
const QUESTION_PATTERN = /Question\.\s*([\s\S]*)$/;
const FACTOR_PATTERN = /We want to test the effect of the factor “([^”]+)”\./;
const GROUPS_PATTERN = /The group A receives level (-?\d+), the group B level (-?\d+)\./;
const CONTROLS_PATTERN = /must be kept constant: ([^\n]*?)\./;
const QUESTION_TEXT =
  'Design the correct test and explain why changing another condition at the same time would make the conclusion ambiguous.';

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  const question = QUESTION_PATTERN.exec(statement);
  if (caseData === null || question === null) {
    throw new Error('the statement does not state its case data and its question');
  }
  if (question[1].trim() !== QUESTION_TEXT) {
    throw new Error('the statement does not ask for the design of a fair test');
  }
  const factor = FACTOR_PATTERN.exec(caseData[1]);
  const groups = GROUPS_PATTERN.exec(caseData[1]);
  const controls = CONTROLS_PATTERN.exec(caseData[1]);
  if (factor === null || groups === null || controls === null) {
    throw new Error('the statement does not state the tested factor, the two levels, and the controlled conditions');
  }
  const controlled = controls[1].split(',').map((value) => value.trim()).filter((value) => value !== '');
  if (controlled.length === 0) {
    throw new Error('the statement keeps no condition constant');
  }
  return {
    factor: factor[1],
    levelA: Number(groups[1]),
    levelB: Number(groups[2]),
    controls: controlled
  };
}

function solve(slots) {
  if (slots.levelA === slots.levelB) {
    throw new Error('the two groups receive the same level of the factor, so no effect can be tested');
  }
  return { factor: slots.factor, controls: slots.controls };
}

function render(solution) {
  return `We change only “${solution.factor}” and we control ${solution.controls.join(', ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.factor === "string" && slots.factor.length > 0, "the statement must name the factor to test");',
  'probe(Number.isFinite(slots.levelA) && Number.isFinite(slots.levelB), "both groups must receive a stated level of the factor");',
  'probe(slots.levelA !== slots.levelB, "the two groups must receive different levels, otherwise no effect can be tested");',
  'probe(Array.isArray(slots.controls) && slots.controls.length > 0, "the statement must keep at least one condition constant");',
  'probe(slots.controls.every((control) => typeof control === "string" && control.length > 0), "every controlled condition must be named");',
  'return "We change only \\u201c" + slots.factor + "\\u201d and we control " + slots.controls.join(", ") + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `A fair test changes exactly one factor, “${slots.factor}”, and holds every other condition fixed.`,
    `The two groups receive that factor at different levels, ${slots.levelA} and ${slots.levelB}, so any difference in the outcome can be traced to the factor.`,
    `The conditions kept constant are ${slots.controls.join(', ')}; changing any of them at the same time would give two causes for one difference and the conclusion would be ambiguous.`,
    'Both groups must also be measured on the same outcome variable, otherwise the comparison is not like for like.'
  ];
}

export const unit = 11;

export const cases = [
  {
    template: 'Fair test and control variables',
    type: slugify('Fair test and control variables'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
