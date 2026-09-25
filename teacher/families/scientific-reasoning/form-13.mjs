/**
 * Form 13 of the scientific-reasoning book: counterfactual reasoning.
 *
 * Every variant states a model world, a causal network of arrows, the cause the
 * normal world starts from, and one node that is then completely blocked. The
 * reasoning is the same in all twenty-five variants: propagate from the stated
 * start along the given arrows, delete the blocked node and every arrow
 * entering or leaving it, and report which effects are no longer obtainable
 * through this path. Effects that the cancelled propagation still reaches are
 * unaffected, and the answer keeps the order in which the normal world reaches
 * the lost effects.
 *
 * A node is identified by the set of its words rather than by their order: the
 * source prints the start of one variant as “egg viable” while the network
 * names the same node “viable egg”, and the printed answer reaches through it.
 * Every other variant spells its nodes identically in the network, in the
 * start, and in the blocked clause.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Case data\.\s*([\s\S]*?)\n\nQuestion\./;
const QUESTION_PATTERN = /Question\.\s*([\s\S]*)$/;
const NETWORK_PATTERN =
  /The causal network is: (.*?)\. In the normal situation, we start with “([^”]+)”\./;
const BLOCKED_PATTERN = /Now imagine that “([^”]+)” is completely blocked/;
const QUESTION_TEXT =
  'Which effects that occurred before can no longer be obtained through this path? Explain the difference between the normal world and the counterfactual world.';

/** The identity of a node: its words, in any order, lowercased. */
function nodeKey(name) {
  return name.toLowerCase().split(/\s+/).sort().join(' ');
}

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  const question = QUESTION_PATTERN.exec(statement);
  if (caseData === null || question === null) {
    throw new Error('the statement does not state its case data and its question');
  }
  if (question[1].trim() !== QUESTION_TEXT) {
    throw new Error('the statement does not ask which effects the blockage loses');
  }
  const network = NETWORK_PATTERN.exec(caseData[1]);
  const blocked = BLOCKED_PATTERN.exec(caseData[1]);
  if (network === null || blocked === null) {
    throw new Error('the statement does not state its causal network, its start, and the blocked node');
  }
  const edges = [];
  for (const link of network[1].split(';')) {
    const parts = link.split('→').map((value) => value.trim());
    if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
      throw new Error(`the statement states a link that is not a pair of nodes: "${link.trim()}"`);
    }
    edges.push({ from: parts[0], to: parts[1] });
  }
  if (edges.length === 0) {
    throw new Error('the statement states no link in its causal network');
  }
  return { edges, start: network[2], blocked: blocked[1] };
}

/** Every node the given start reaches along the arrows, in traversal order. */
function reachedNames(edges, start, skipKey) {
  const reached = [];
  const queue = [nodeKey(start)];
  const visited = new Set(queue);
  while (queue.length > 0) {
    const node = queue.shift();
    for (const edge of edges) {
      const to = nodeKey(edge.to);
      if (nodeKey(edge.from) !== node || to === skipKey || visited.has(to)) {
        continue;
      }
      visited.add(to);
      reached.push(edge.to);
      queue.push(to);
    }
  }
  return reached;
}

function solve(slots) {
  const normal = reachedNames(slots.edges, slots.start, null);
  const blockedKey = nodeKey(slots.blocked);
  if (!normal.some((name) => nodeKey(name) === blockedKey)) {
    throw new Error(`the blocked node "${slots.blocked}" is not reached from the stated start`);
  }
  const surviving = reachedNames(slots.edges, slots.start, blockedKey);
  const lost = normal.filter((name) => !surviving.some((other) => nodeKey(other) === nodeKey(name)));
  if (lost.length === 0) {
    throw new Error('blocking the node loses no effect, so the counterfactual world is the normal world');
  }
  return { blocked: slots.blocked, reached: normal, lost };
}

function render(solution) {
  return `By blocking “${solution.blocked}”, we lose along the given path: ${solution.lost.join(', ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const key = (name) => name.toLowerCase().split(/\\s+/).sort().join(" ");',
  'const walk = (skip) => {',
  '  const reached = [];',
  '  const queue = [key(slots.start)];',
  '  const visited = new Set(queue);',
  '  while (queue.length > 0) {',
  '    const node = queue.shift();',
  '    for (const edge of slots.edges) {',
  '      const to = key(edge.to);',
  '      if (key(edge.from) !== node || to === skip || visited.has(to)) {',
  '        continue;',
  '      }',
  '      visited.add(to);',
  '      reached.push(edge.to);',
  '      queue.push(to);',
  '    }',
  '  }',
  '  return reached;',
  '};',
  'const normal = walk(null);',
  'const surviving = walk(key(slots.blocked));',
  'const lost = normal.filter((name) => !surviving.some((other) => key(other) === key(name)));',
  'probe(lost.length > 0, "blocking the node must lose at least one effect");',
  'return "By blocking \\u201c" + slots.blocked + "\\u201d, we lose along the given path: " + lost.join(", ") + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `In the normal world, the stated start “${slots.start}” reaches ${solution.reached.join(', ')} along the given path.`,
    `The counterfactual world eliminates the node “${slots.blocked}” together with every arrow entering or leaving it, so nothing downstream of that node can be produced through this path.`,
    `Propagating again from the same initial cause leaves ${solution.lost.join(', ')} unreachable, so those effects are the ones lost.`,
    'Nodes that no chain of arrows connects to the stated start were never produced through this path, so blocking this link does not change them.'
  ];
}

export const unit = 13;

export const cases = [
  {
    template: 'Counterfactual reasoning',
    type: slugify('Counterfactual reasoning'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
