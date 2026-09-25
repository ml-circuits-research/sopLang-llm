/**
 * Family N20 of the world seed book: fairness — equal, proportional, and
 * need-based allocation.
 *
 * Every problem states one relief fund, the populations and the need scores of
 * three districts, and the three fairness principles (equal, population-
 * proportional, need-proportional). The task names the principle to apply, so
 * the family reads the principle out of the task and divides the fund by it:
 * equal shares are `fund ÷ districts`, proportional shares are
 * `fund × weight ÷ total weight`, and the minimum-guarantee variant pays each
 * district the stated minimum and splits the remainder equally. The compare
 * variant computes the equal and the need-proportional allocations and prints
 * the one that gives more to the highest-need district.
 *
 * All amounts are printed with two decimals and the districts keep the printed
 * order. The four grades share the algorithm and differ only in the stated fund
 * (35/40/45/50) and the need scores.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const FUND_PATTERN = /relief fund has (\d+(?:\.\d+)?) units/;
const LABELS_PATTERN = /districts ([A-Z](?:\s*,\s*[A-Z])*)/;
const POPULATIONS_PATTERN = /Populations are \[([^\]]+)\]/;
const NEEDS_PATTERN = /need scores are \[([^\]]+)\]/;
const MINIMUM_PATTERN = /a (\d+(?:\.\d+)?)-unit minimum guarantee/;

function numbers(text) {
  return text
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value !== '')
    .map((value) => Number(value));
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const fund = FUND_PATTERN.exec(facts);
  const labels = LABELS_PATTERN.exec(facts);
  const populations = POPULATIONS_PATTERN.exec(facts);
  const needs = NEEDS_PATTERN.exec(facts);
  if (fund === null || labels === null || populations === null || needs === null) {
    throw new Error('the statement does not give a fund, its districts, their populations, and their need scores');
  }
  const task = blocks.Task;
  const method = /Allocate the fund equally/.test(task)
    ? 'equal'
    : /Allocate in proportion to population/.test(task)
      ? 'population'
      : /Allocate in proportion to need score/.test(task)
        ? 'need'
        : /minimum guarantee, then divide the remainder equally/.test(task)
          ? 'guarantee'
          : /Compare equal allocation with need-proportional allocation/.test(task)
            ? 'compare'
            : null;
  if (method === null) {
    throw new Error('the task names no stated fairness principle');
  }
  const minimum = method === 'guarantee' ? MINIMUM_PATTERN.exec(task) : null;
  if (method === 'guarantee' && minimum === null) {
    throw new Error('the task states no minimum guarantee amount');
  }
  return {
    labels: labels[1].split(',').map((value) => value.trim()),
    fund: Number(fund[1]),
    populations: numbers(populations[1]),
    needScores: numbers(needs[1]),
    method,
    minimum: minimum === null ? null : Number(minimum[1]),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function equalShares(fund, count) {
  return Array.from({ length: count }, () => fund / count);
}

function proportionalShares(fund, weights) {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (!(total > 0)) {
    throw new Error('the stated weights must sum to a positive total');
  }
  return weights.map((weight) => (fund * weight) / total);
}

function solve(slots) {
  const count = slots.labels.length;
  if (slots.populations.length !== count || slots.needScores.length !== count) {
    throw new Error('every district must have one population and one need score');
  }
  if (slots.method === 'equal') {
    return { labels: slots.labels, amounts: equalShares(slots.fund, count), method: slots.method, crossDomain: slots.crossDomain };
  }
  if (slots.method === 'population') {
    return { labels: slots.labels, amounts: proportionalShares(slots.fund, slots.populations), method: slots.method, crossDomain: slots.crossDomain };
  }
  if (slots.method === 'need') {
    return { labels: slots.labels, amounts: proportionalShares(slots.fund, slots.needScores), method: slots.method, crossDomain: slots.crossDomain };
  }
  if (slots.method === 'guarantee') {
    const remainder = slots.fund - slots.minimum * count;
    if (remainder < 0) {
      throw new Error('the stated minimum guarantees exceed the fund');
    }
    return {
      labels: slots.labels,
      amounts: Array.from({ length: count }, () => slots.minimum + remainder / count),
      method: slots.method,
      crossDomain: slots.crossDomain
    };
  }
  if (slots.method === 'compare') {
    const highest = slots.needScores.indexOf(Math.max(...slots.needScores));
    const equal = equalShares(slots.fund, count);
    const byNeed = proportionalShares(slots.fund, slots.needScores);
    if (equal[highest] === byNeed[highest]) {
      throw new Error('the two compared allocations tie at the highest-need district');
    }
    const winner = byNeed[highest] > equal[highest] ? byNeed : equal;
    return { labels: slots.labels, amounts: winner, method: 'need', crossDomain: slots.crossDomain };
  }
  throw new Error(`unknown fairness principle "${slots.method}"`);
}

function render(solution) {
  const main = `${solution.labels.map((label, index) => `${label}=${solution.amounts[index].toFixed(2)}`).join(', ')}.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const WIRES = [
  {
    name: 'cross',
    command: 'jsEval',
    body: [
      CROSS_DOMAIN_SOURCE,
      'const slots = $slots;',
      'return { suffix: renderCrossDomain(slots.crossDomain) };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const slots = $slots;',
  'const count = slots.labels.length;',
  'const proportional = (weights) => {',
  '  const total = weights.reduce((sum, weight) => sum + weight, 0);',
  '  probe(total > 0, "the stated weights must sum to a positive total");',
  '  return weights.map((weight) => (slots.fund * weight) / total);',
  '};',
  'const equal = () => slots.labels.map(() => slots.fund / count);',
  'let amounts;',
  'if (slots.method === "equal") {',
  '  amounts = equal();',
  '} else if (slots.method === "population") {',
  '  amounts = proportional(slots.populations);',
  '} else if (slots.method === "need") {',
  '  amounts = proportional(slots.needScores);',
  '} else if (slots.method === "guarantee") {',
  '  const remainder = slots.fund - slots.minimum * count;',
  '  probe(remainder >= 0, "the stated minimum guarantees must not exceed the fund");',
  '  amounts = slots.labels.map(() => slots.minimum + remainder / count);',
  '} else if (slots.method === "compare") {',
  '  const highest = slots.needScores.indexOf(Math.max(...slots.needScores));',
  '  const byNeed = proportional(slots.needScores);',
  '  const byEqual = equal();',
  '  probe(byNeed[highest] !== byEqual[highest], "the two compared allocations must not tie at the highest-need district");',
  '  amounts = byNeed[highest] > byEqual[highest] ? byNeed : byEqual;',
  '} else {',
  '  throw new Error("unknown fairness principle");',
  '}',
  'probe(amounts.length === count && amounts.every((amount) => Number.isFinite(amount)), "every district must receive a finite share");',
  'const main = slots.labels.map((label, index) => label + "=" + amounts[index].toFixed(2)).join(", ") + ".";',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  const shares = solution.amounts.map((amount, index) => `${solution.labels[index]}=${amount.toFixed(2)}`).join(', ');
  if (slots.method === 'equal' || slots.method === 'guarantee') {
    return [
      slots.method === 'equal'
        ? `The equal principle asks for the same amount for each of the ${slots.labels.length} districts.`
        : `The minimum-guarantee principle pays each district its ${slots.minimum}-unit floor first, using ${slots.minimum * slots.labels.length} units of the fund.`,
      slots.method === 'equal'
        ? `Dividing the fund of ${slots.fund} units by ${slots.labels.length} gives ${(slots.fund / slots.labels.length).toFixed(2)} to each district.`
        : `The remainder ${slots.fund} − ${slots.minimum * slots.labels.length} = ${slots.fund - slots.minimum * slots.labels.length} is split equally, adding ${((slots.fund - slots.minimum * slots.labels.length) / slots.labels.length).toFixed(2)} to each floor.`,
      `The resulting allocation is ${shares}.`
    ];
  }
  if (slots.method === 'compare') {
    const highest = slots.needScores.indexOf(Math.max(...slots.needScores));
    return [
      `The highest-need district is ${solution.labels[highest]}, whose need score ${slots.needScores[highest]} is the largest.`,
      `Equal allocation gives it ${(slots.fund / slots.labels.length).toFixed(2)}, while need-proportional allocation gives it ${((slots.fund * slots.needScores[highest]) / slots.needScores.reduce((sum, weight) => sum + weight, 0)).toFixed(2)}.`,
      `The need-proportional principle gives that district more, so the printed allocation is ${shares}.`
    ];
  }
  const weights = slots.method === 'population' ? slots.populations : slots.needScores;
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return [
    `The ${slots.method === 'population' ? 'population-proportional' : 'need-proportional'} principle uses the stated weights ${weights.join(':')}.`,
    `Those weights total ${total}, so each district takes the fraction weight ÷ ${total} of the fund of ${slots.fund} units.`,
    `Applying the fractions in printed order gives ${shares}.`
  ];
}

function caseFor(grade) {
  const template = `Fairness: equal, proportional, and need-based (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N20';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
