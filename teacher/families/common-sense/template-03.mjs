/**
 * Template 3 of the common-sense book: bottlenecks.
 *
 * Every variant states four serial stages with maximum capacities A–D, one
 * unit of flow, and the single stage a stated improvement applies to. The
 * initial capacity of the process is the smallest stage capacity, the capacity
 * after the improvement is the smallest capacity once the improved stage has
 * grown, and the final bottleneck is every stage that attains that smallest
 * capacity.
 *
 * The family accepts every variant whose statement carries the capacities, the
 * improved stage, and the improvement percentage; the unit of flow varies
 * across the fifty variants (`cases`, `units`, `service units`, …) and is read
 * from the statement.
 */

import { slugify } from '../../naming.mjs';

const CAPACITIES_PATTERN = /capacities A=(\d+), B=(\d+), C=(\d+), and D=(\d+) ([a-z ]+)\/hour/;
const IMPROVEMENT_PATTERN = /Only stage ([A-D]) can be improved, by (\d+)%/;
const STAGES = Object.freeze(['A', 'B', 'C', 'D']);

function parse(statement) {
  const capacities = CAPACITIES_PATTERN.exec(statement);
  const improvement = IMPROVEMENT_PATTERN.exec(statement);
  if (capacities === null) {
    throw new Error('the statement does not state four stage capacities');
  }
  if (improvement === null) {
    throw new Error('the statement does not state the improved stage and its percentage');
  }
  return {
    capacities: {
      A: Number(capacities[1]),
      B: Number(capacities[2]),
      C: Number(capacities[3]),
      D: Number(capacities[4])
    },
    unit: capacities[5].trim(),
    stage: improvement[1],
    percent: Number(improvement[2])
  };
}

/**
 * The improved capacity in hundredths of a unit, so `c × (100 + p) / 100` is
 * computed exactly and the printed halves and quarters (`126.5`) never turn
 * into binary-float noise.
 */
function improvedHundredths(capacity, percent) {
  return capacity * (100 + percent);
}

function formatHundredths(value) {
  return String(value / 100);
}

function solve(slots) {
  const capacities = STAGES.map((stage) => slots.capacities[stage]);
  const initial = Math.min(...capacities);
  const improved = {};
  for (const stage of STAGES) {
    improved[stage] = stage === slots.stage ? improvedHundredths(slots.capacities[stage], slots.percent) : slots.capacities[stage] * 100;
  }
  const after = Math.min(...STAGES.map((stage) => improved[stage]));
  const bottlenecks = STAGES.filter((stage) => improved[stage] === after);
  return { initial, after, bottlenecks, unit: slots.unit };
}

function render(solution) {
  return `Initial capacity: ${solution.initial} ${solution.unit}/hour. After the improvement: ${formatHundredths(solution.after)} ${solution.unit}/hour. Final bottleneck stage(s): ${solution.bottlenecks.join(', ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const stages = ["A", "B", "C", "D"];',
  'const initial = Math.min(...stages.map((stage) => slots.capacities[stage]));',
  'const improved = {};',
  'for (const stage of stages) {',
  '  improved[stage] = stage === slots.stage ? slots.capacities[stage] * (100 + slots.percent) : slots.capacities[stage] * 100;',
  '}',
  'const after = Math.min(...stages.map((stage) => improved[stage]));',
  'const bottlenecks = stages.filter((stage) => improved[stage] === after);',
  'return "Initial capacity: " + initial + " " + slots.unit + "/hour. After the improvement: " + String(after / 100) + " " + slots.unit + "/hour. Final bottleneck stage(s): " + bottlenecks.join(", ") + ".";'
].join('\n');

function explain(slots, solution) {
  const list = (stage) => `${stage}=${slots.capacities[stage]}`;
  return [
    `Because every unit passes through every serial stage, the capacity of the process is the smallest stage capacity, so the initial capacity is min(${STAGES.map(list).join(', ')}) = ${solution.initial} ${slots.unit}/hour.`,
    `Stage ${slots.stage} grows by ${slots.percent}%, from ${slots.capacities[slots.stage]} to ${formatHundredths(improvedHundredths(slots.capacities[slots.stage], slots.percent))} ${slots.unit}/hour; the other stages keep their capacities.`,
    `The smallest capacity after the improvement is ${formatHundredths(solution.after)} ${slots.unit}/hour, attained by ${solution.bottlenecks.join(' and ')}, so ${solution.bottlenecks.length === 1 ? 'that stage is the final bottleneck' : 'those stages are the final bottlenecks'}.`,
    'Adding the stage capacities would treat serial stages as if they were parallel sources, which the process rule excludes.'
  ];
}

export const unit = 3;

export const cases = [
  {
    template: 'Bottlenecks',
    type: slugify('Bottlenecks'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
