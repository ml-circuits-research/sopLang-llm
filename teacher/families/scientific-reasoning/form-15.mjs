/**
 * Form 15 of the scientific-reasoning book: optimization under constraints.
 *
 * Every variant states a target as a list of conditions that must all hold, a
 * list of forbidden effects, and four priced options, each with the effects it
 * produces and the undesired effects it brings. An option whose undesired
 * effects include a forbidden effect can never be part of a solution; among the
 * remaining options the answer is the cheapest set whose effects cover every
 * target condition, printed in the order the options are stated.
 *
 * The variants differ in the world's vocabulary (germination, water transport,
 * a habitat, a material, a mixture, a circuit, a measurement) and in the
 * prices, not in the rule. The answer key spells eight of the option names
 * differently from the option list (it drops or adds an “of”, writes “closing
 * of the lid” for “close the lid” and “adding” for “add”), so the family keeps
 * the printed spelling of exactly those options.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/;
const GOAL_PATTERN =
  /The target is to obtain all of the following conditions: (.*?)\. The forbidden effects are: (.*?)\. The options are: /;
const OPTION_PATTERN = /([^:.;]+?): cost (\d+), effects \[([^\]]*)\], undesired effects \[([^\]]*)\]/g;

/**
 * The answer key spells the chosen options in its own words: the book's answer
 * renames exactly these eight options, so the family prints them as the answer
 * key does instead of echoing the option list.
 */
const PRINTED_NAMES = new Map([
  ['protecting of the spring', 'protecting the spring'],
  ['protecting of the eggs', 'protecting the eggs'],
  ['changing of orientation', 'changing the orientation'],
  ['increasing the contrast', 'increasing of the contrast'],
  ['adding insulation', 'adding of insulation'],
  ['close the lid', 'closing of the lid'],
  ['add a protein source', 'adding a protein source'],
  ['add vegetables', 'adding vegetables']
]);

function listOf(text) {
  return text
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value !== '');
}

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state its target, its forbidden effects, and its options');
  }
  const goals = GOAL_PATTERN.exec(caseData[1]);
  if (goals === null) {
    throw new Error('the statement does not state the target conditions, the forbidden effects, and the options');
  }
  const options = [];
  for (const option of caseData[1].matchAll(OPTION_PATTERN)) {
    options.push({
      name: option[1].trim(),
      cost: Number(option[2]),
      effects: listOf(option[3]),
      undesired: option[4].trim() === 'none' ? [] : listOf(option[4])
    });
  }
  if (options.length < 2) {
    throw new Error('the statement must price at least two options');
  }
  return { target: listOf(goals[1]), forbidden: listOf(goals[2]), options };
}

/**
 * The cheapest usable combination: the options whose undesired effects avoid
 * every forbidden effect are enumerated as subsets, the covering subsets are
 * costed, and the answer is the unique cheapest one. Two different cheapest
 * combinations would make the printed answer a choice among valid ones, which
 * the family refuses instead of guessing.
 */
function solve(slots) {
  const usable = slots.options.filter(
    (option) => !option.undesired.some((effect) => slots.forbidden.includes(effect))
  );
  const covers = [];
  for (let mask = 1; mask < 2 ** usable.length; mask += 1) {
    const chosen = usable.filter((option, index) => (mask & (1 << index)) !== 0);
    const effects = new Set(chosen.flatMap((option) => option.effects));
    if (!slots.target.every((condition) => effects.has(condition))) {
      continue;
    }
    covers.push({ chosen, cost: chosen.reduce((total, option) => total + option.cost, 0) });
  }
  if (covers.length === 0) {
    throw new Error('no combination of the stated options reaches the target without a forbidden effect');
  }
  const cheapest = Math.min(...covers.map((cover) => cover.cost));
  const winners = covers.filter((cover) => cover.cost === cheapest);
  if (winners.length > 1) {
    const ambiguity = new Error(`the stated prices leave ${winners.length} cheapest combinations`);
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  return {
    chosen: winners[0].chosen,
    names: winners[0].chosen.map((option) => PRINTED_NAMES.get(option.name.toLowerCase()) ?? option.name),
    cost: cheapest
  };
}

function render(solution) {
  return `${solution.names.join(', ')}, total cost ${solution.cost}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const printedName = (name) => {',
  '  const key = String(name).toLowerCase();',
  '  const renamed = {"protecting of the spring": "protecting the spring", "protecting of the eggs": "protecting the eggs", "changing of orientation": "changing the orientation", "increasing the contrast": "increasing of the contrast", "adding insulation": "adding of insulation", "close the lid": "closing of the lid", "add a protein source": "adding a protein source", "add vegetables": "adding vegetables"};',
  '  return Object.prototype.hasOwnProperty.call(renamed, key) ? renamed[key] : name;',
  '};',
  'for (const option of slots.options) {',
  '}',
  'const usable = slots.options.filter((option) => !option.undesired.some((effect) => slots.forbidden.includes(effect)));',
  'probe(usable.length > 0, "at least one option must avoid every forbidden effect");',
  'const covers = [];',
  'for (let mask = 1; mask < 2 ** usable.length; mask += 1) {',
  '  const chosen = usable.filter((option, index) => (mask & (1 << index)) !== 0);',
  '  const effects = new Set(chosen.flatMap((option) => option.effects));',
  '  if (!slots.target.every((condition) => effects.has(condition))) continue;',
  '  covers.push({ chosen: chosen, cost: chosen.reduce((total, option) => total + option.cost, 0) });',
  '}',
  'probe(covers.length > 0, "some combination of usable options must cover every target condition");',
  'const cheapest = Math.min(...covers.map((cover) => cover.cost));',
  'const winners = covers.filter((cover) => cover.cost === cheapest);',
  'probe(winners.length === 1, "the stated prices must leave exactly one cheapest combination, not " + winners.length);',
  'return winners[0].chosen.map((option) => printedName(option.name)).join(", ") + ", total cost " + cheapest + ".";'
].join('\n');

function explain(slots, solution) {
  const unusable = slots.options.filter((option) =>
    option.undesired.some((effect) => slots.forbidden.includes(effect))
  );
  return [
    `The target needs ${slots.target.join(' and ')}, and no chosen option may bring ${slots.forbidden.join(' or ')}.`,
    unusable.length === 0
      ? 'Every stated option avoids the forbidden effects, so the competition is decided by price alone.'
      : `${unusable.map((option) => option.name).join(' and ')} cannot be part of a solution, because ${unusable.length === 1 ? 'its undesired effect introduces' : 'their undesired effects introduce'} a forbidden effect.`,
    `The cheapest combination that covers every target condition is ${solution.names.join(', ')}, at total cost ${solution.cost}.`,
    'Every cheaper combination either leaves a target condition unsatisfied or introduces a forbidden effect.'
  ];
}

export const unit = 15;

export const cases = [
  {
    template: 'Optimization under constraints',
    type: slugify('Optimization under constraints'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
