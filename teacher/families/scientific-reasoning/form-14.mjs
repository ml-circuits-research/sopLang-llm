/**
 * Form 14 of the scientific-reasoning book: propagation of effects through a
 * network.
 *
 * Every variant states a directed network as a list of `source → destination`
 * arrows and names one node the model changes ("We change “…”"). The change
 * activates that node, every arrow leaving an active node activates its
 * destination, and the passes repeat until they add nothing; the printed
 * answer lists the nodes the effect reaches, in the order the passes discover
 * them, and never the starting node itself.
 *
 * The variants differ in the world's vocabulary (germination, water transport
 * in a plant, a meadow's food chain, the life cycle of an insect, digestion, a
 * closed circuit) and in the number of arrows, not in the rule. One variant
 * writes the changed node in the statement's own word order ("egg viable")
 * while its arrow prints the same node in the other order ("viable egg"), so
 * the family identifies a node by its words rather than by their exact order.
 */

import { slugify } from '../../naming.mjs';

const NETWORK_PATTERN =
  /Case data\.\s*The network of dependencies has the arrows: ([\s\S]*?)\.\s*We change “([^”]*)”\./;
const ARROW_SEPARATOR = ';';
const ARROW = '→';

/**
 * The identity of a node by its words: two spellings of the same node that
 * differ only in word order (as one variant of the book prints the changed
 * node) stand for one node of the network.
 */
function nodeKey(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((word) => word !== '')
    .sort()
    .join(' ');
}

function parse(statement) {
  const network = NETWORK_PATTERN.exec(statement);
  if (network === null) {
    throw new Error('the statement does not state its dependency arrows and the node the model changes');
  }
  const arrows = network[1]
    .split(ARROW_SEPARATOR)
    .map((arrow) => arrow.split(ARROW).map((node) => node.trim()));
  if (arrows.length === 0 || arrows.some((arrow) => arrow.length !== 2 || arrow[0] === '' || arrow[1] === '')) {
    throw new Error('every dependency must be printed as one source arrow one destination');
  }
  const start = network[2].trim();
  if (start === '') {
    throw new Error('the statement does not name the node the model changes');
  }
  return { arrows, start };
}

/**
 * The transitive closure of the effect: the changed node is active from the
 * start, and one pass adds every destination of an arrow whose source is
 * active. Scanning the arrows in their printed order makes the discovery order
 * of the answer the order of the network, which is what the book prints.
 */
function solve(slots) {
  const seen = new Set([nodeKey(slots.start)]);
  const reached = new Map();
  let changed = true;
  while (changed) {
    changed = false;
    for (const arrow of slots.arrows) {
      if (!seen.has(nodeKey(arrow[0])) || seen.has(nodeKey(arrow[1]))) {
        continue;
      }
      seen.add(nodeKey(arrow[1]));
      reached.set(nodeKey(arrow[1]), arrow[1]);
      changed = true;
    }
  }
  if (reached.size === 0) {
    throw new Error('the changed node starts no arrow, so no effect propagates');
  }
  return { reached: [...reached.values()] };
}

function render(solution) {
  return `The effect can propagate to: ${solution.reached.join(', ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const nodeKey = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter((word) => word !== "").sort().join(" ");',
  'probe(Array.isArray(slots.arrows) && slots.arrows.length > 0, "the statement must state at least one dependency arrow");',
  'probe(typeof slots.start === "string" && slots.start.length > 0, "the statement must name the node the model changes");',
  'for (const arrow of slots.arrows) {',
  '  probe(Array.isArray(arrow) && arrow.length === 2 && arrow[0].length > 0 && arrow[1].length > 0, "every dependency must be printed as one source arrow one destination");',
  '}',
  'probe(slots.arrows.some((arrow) => nodeKey(arrow[0]) === nodeKey(slots.start)), "the changed node must be the source of a stated arrow");',
  'const seen = new Set([nodeKey(slots.start)]);',
  'const reached = new Map();',
  'let changed = true;',
  'while (changed) {',
  '  changed = false;',
  '  for (const arrow of slots.arrows) {',
  '    if (!seen.has(nodeKey(arrow[0])) || seen.has(nodeKey(arrow[1]))) continue;',
  '    seen.add(nodeKey(arrow[1]));',
  '    reached.set(nodeKey(arrow[1]), arrow[1]);',
  '    changed = true;',
  '  }',
  '}',
  'probe(reached.size > 0, "the changed node must reach at least one node of the network");',
  'return "The effect can propagate to: " + [...reached.values()].join(", ") + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The model changes “${slots.start}”, so that node is active before any arrow is applied, and the answer never counts it among the effects.`,
    `One pass activates every destination of an arrow whose source is already active; the passes repeat until a pass adds nothing, which is the transitive closure of the ${slots.arrows.length} stated arrows.`,
    `The effect reaches ${solution.reached.length === 1 ? 'one node' : `${solution.reached.length} nodes`}, in the order the network hands them on: ${solution.reached.join(', ')}.`,
    'A node that no arrow path reaches stays out of the answer, so a neighbour of a reached node is never assumed to be affected.'
  ];
}

export const unit = 14;

export const cases = [
  {
    template: 'Propagation of effects through a network',
    type: slugify('Propagation of effects through a network'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
