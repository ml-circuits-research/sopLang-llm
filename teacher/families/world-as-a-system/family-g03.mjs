/**
 * Family G3 of the world seed book: rivers, upstream and downstream.
 *
 * Every problem states `X flows into Y` facts, which are the directed edges of
 * a river network, and asks whether a named river is upstream of another, that
 * is, whether water can follow the arrows from the source to the target. Grades
 * 3 and 4 append a canal sentence that only says part of the flow is diverted
 * while the remaining flow still arrives, so it never deletes an edge and never
 * changes the reachable set.
 *
 * The four grades share one computation: the variants differ in the stated
 * network and in the distractor sentence, not in the algorithm.
 */

import { blocksOf, stripCrossDomain } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const FLOW_PATTERN = /([A-Z][A-Za-z]+(?: [A-Z][A-Za-z]+)*) flows into ([A-Z][A-Za-z]+(?: [A-Z][A-Za-z]+)*)/g;
const QUESTION_PATTERN = /Is (.+?) upstream of (.+?)\?/;
const REACH_PATTERN = /Can water from (.+?) reach (.+?) through the stated network\?/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const flows = [];
  for (const match of facts.matchAll(FLOW_PATTERN)) {
    if (match[1] !== match[2]) {
      flows.push({ from: match[1], to: match[2] });
    }
  }
  if (flows.length === 0) {
    throw new Error('the statement states no flow between two rivers');
  }
  const question = QUESTION_PATTERN.exec(blocks.Task);
  const reach = REACH_PATTERN.exec(blocks.Task);
  if (question === null || reach === null) {
    throw new Error('the task does not ask for upstream reachability');
  }
  if (question[1] !== reach[1] || question[2] !== reach[2]) {
    throw new Error('the two questions of the task name different rivers');
  }
  return {
    flows,
    source: question[1],
    target: question[2],
    canal: /A canal diverts/.test(facts)
  };
}

function reaches(flows, source, target) {
  const adjacency = new Map();
  for (const flow of flows) {
    if (!adjacency.has(flow.from)) {
      adjacency.set(flow.from, []);
    }
    adjacency.get(flow.from).push(flow.to);
  }
  const seen = new Set([source]);
  const queue = [source];
  while (queue.length > 0) {
    const river = queue.shift();
    if (river === target) {
      return true;
    }
    for (const next of adjacency.get(river) ?? []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return false;
}

function solve(slots) {
  const known = new Set();
  for (const flow of slots.flows) {
    known.add(flow.from);
    known.add(flow.to);
  }
  if (!known.has(slots.source) || !known.has(slots.target)) {
    throw new Error('the asked rivers do not both appear in the stated network');
  }
  return {
    source: slots.source,
    target: slots.target,
    reachable: reaches(slots.flows, slots.source, slots.target),
    canal: slots.canal
  };
}

function render(solution) {
  if (!solution.reachable) {
    return `No; water from ${solution.source} cannot reach ${solution.target}.`;
  }
  return `Yes; water from ${solution.source} can reach ${solution.target}.`;
}

const WIRES = [
  {
    name: 'reach',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const adjacency = new Map();',
      'for (const flow of slots.flows) {',
      '  if (!adjacency.has(flow.from)) {',
      '    adjacency.set(flow.from, []);',
      '  }',
      '  adjacency.get(flow.from).push(flow.to);',
      '}',
      'const seen = new Set([slots.source]);',
      'const queue = [slots.source];',
      'let reachable = false;',
      'while (queue.length > 0) {',
      '  const river = queue.shift();',
      '  if (river === slots.target) {',
      '    reachable = true;',
      '    break;',
      '  }',
      '  for (const next of adjacency.get(river) ?? []) {',
      '    if (!seen.has(next)) {',
      '      seen.add(next);',
      '      queue.push(next);',
      '    }',
      '  }',
      '}',
      'return reachable;'
    ].join('\n')
  }
];

const COMPUTE = [
  'return $reach',
  '  ? "Yes; water from " + $slots.source + " can reach " + $slots.target + "."',
  '  : "No; water from " + $slots.source + " cannot reach " + $slots.target + ".";'
].join('\n');

function explain(slots, solution) {
  const canal = solution.canal ? 'The canal sentence does not remove an edge: the remaining flow still follows the stated arrows.' : 'No fact removes an edge from the network.';
  return [
    `Each "flows into" fact is a directed arrow, so the network has ${slots.flows.length} arrows from upstream to downstream.`,
    `Following the arrows from ${solution.source} ${solution.reachable ? 'reaches' : 'never reaches'} ${solution.target}.`,
    canal
  ];
}

function caseFor(grade) {
  const template = `Rivers: upstream and downstream (grade ${grade})`;
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

export const unit = 'G3';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
