/**
 * Form 40 of the scientific-reasoning book: dominance and multi-criteria
 * trade-offs.
 *
 * Every variant states a world model, three criteria (C1–C3) scored from 1 to 5
 * where 5 is better, and four labelled options with one score per criterion.
 * The stated rule declares an option dominated when another option is at least
 * as good on every criterion and strictly better on at least one. The family
 * eliminates the dominated option, prints the non-dominated frontier in the
 * declared order, and keeps the fixed clause that the frontier has no unique
 * winner without added priorities.
 *
 * The variants change the world and the criterion names (flower coverage,
 * required force, echo level, thermal comfort), not the reasoning; the
 * reasoning turns on the component-by-component comparison rather than on a sum
 * of the scores.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/;
const CRITERION_PATTERN = /C(\d+)=performance for “(.+?)”/g;
const OPTION_PATTERN = /([A-D])=\s*\((\d+(?:\s*,\s*\d+)+)\)/g;

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state the scored options');
  }
  const criteria = [];
  for (const match of caseData[1].matchAll(CRITERION_PATTERN)) {
    criteria.push({ label: `C${match[1]}`, name: match[2] });
  }
  if (criteria.length === 0) {
    throw new Error('the statement does not name the criteria the options are scored on');
  }
  const options = [];
  for (const match of caseData[1].matchAll(OPTION_PATTERN)) {
    const scores = match[2].split(',').map((value) => Number(value.trim()));
    if (scores.length !== criteria.length) {
      throw new Error(`option ${match[1]} carries ${scores.length} scores for ${criteria.length} criteria`);
    }
    options.push({ label: match[1], scores });
  }
  if (options.length < 2) {
    throw new Error(`dominance needs at least two options, not ${options.length}`);
  }
  const labels = new Set(options.map((option) => option.label));
  if (labels.size !== options.length) {
    throw new Error('the options must carry distinct labels');
  }
  return { criteria, options };
}

function dominates(left, right) {
  return (
    left.scores.every((score, index) => score >= right.scores[index]) &&
    left.scores.some((score, index) => score > right.scores[index])
  );
}

function solve(slots) {
  const dominators = new Map(
    slots.options.map((option) => [
      option.label,
      slots.options.filter((other) => other.label !== option.label && dominates(other, option)).map((other) => other.label)
    ])
  );
  const eliminated = slots.options.filter((option) => dominators.get(option.label).length > 0);
  const frontier = slots.options.filter((option) => dominators.get(option.label).length === 0);
  if (eliminated.length !== 1) {
    throw new Error(`the stated scores leave ${eliminated.length} dominated options, not one`);
  }
  if (frontier.length < 2) {
    throw new Error('the frontier holds fewer than two candidates, so the printed trade-off clause does not apply');
  }
  return {
    eliminated: eliminated[0].label,
    dominator: dominators.get(eliminated[0].label)[0],
    frontier: frontier.map((option) => option.label)
  };
}

function render(solution) {
  return `Eliminate ${solution.eliminated}; non-dominated frontier: ${solution.frontier.join(', ')}. There is no unique winner without additional criteria.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.criteria) && slots.criteria.length > 0, "the problem must score its options on at least one criterion");',
  'probe(slots.criteria.every((criterion) => typeof criterion.name === "string" && criterion.name.length > 0), "every criterion must be named");',
  'probe(Array.isArray(slots.options) && slots.options.length >= 2, "dominance needs at least two options");',
  'probe(new Set(slots.options.map((option) => option.label)).size === slots.options.length, "the option labels must be distinct");',
  'probe(slots.options.every((option) => Array.isArray(option.scores) && option.scores.length === slots.criteria.length), "every option must be scored on every criterion");',
  'probe(slots.options.every((option) => option.scores.every((score) => Number.isInteger(score) && score >= 1 && score <= 5)), "every score must be an integer from 1 to 5");',
  'const dominates = (left, right) => left.scores.every((score, index) => score >= right.scores[index]) && left.scores.some((score, index) => score > right.scores[index]);',
  'const dominators = new Map(slots.options.map((option) => [option.label, slots.options.filter((other) => other.label !== option.label && dominates(other, option)).map((other) => other.label)]));',
  'const eliminated = slots.options.filter((option) => dominators.get(option.label).length > 0);',
  'const frontier = slots.options.filter((option) => dominators.get(option.label).length === 0);',
  'probe(eliminated.length === 1, "exactly one option must be dominated, not " + eliminated.length);',
  'probe(frontier.length > 1, "the frontier must keep several candidates, not " + frontier.length);',
  'probe(frontier.length + eliminated.length === slots.options.length, "an option is either dominated or on the frontier");',
  'return "Eliminate " + eliminated[0].label + "; non-dominated frontier: " + frontier.map((option) => option.label).join(", ") + ". There is no unique winner without additional criteria.";'
].join('\n');

function explain(slots, solution) {
  const scored = slots.options
    .map((option) => `${option.label}=(${option.scores.join(', ')})`)
    .join(', ');
  return [
    `We do not add scores unless instructed to do so; dominance is a component-by-component comparison over ${slots.criteria.map((criterion) => `${criterion.label} (${criterion.name})`).join(', ')}.`,
    `With the scored options ${scored}, the dominance relation found is: ${solution.eliminated} is dominated by ${solution.dominator}.`,
    `The non-dominated frontier is {${solution.frontier.join(', ')}}: no option on it is at least as good as another on every criterion while being strictly better somewhere.`,
    'Several candidates remain, each making different trade-offs; without added priorities, there is no unique logical winner.'
  ];
}

export const unit = 40;

export const cases = [
  {
    template: 'Dominance and multi-criteria trade-offs',
    type: slugify('Dominance and multi-criteria trade-offs'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
