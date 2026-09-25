/**
 * Form 29 of the scientific-reasoning book: paths in a network with constraints.
 *
 * Every variant states one undirected network of five nodes as a list of six
 * priced edges, names one of those edges as closed, and names the starting
 * point and the destination. The answer is the allowed route of smallest total
 * cost, printed as the nodes in order with the sum of its edge costs, and a
 * route that uses the closed link is never a candidate.
 *
 * The variants differ in the world's vocabulary (pollination, seed dispersal,
 * decomposition, exercise, the lever, river water, the kitchen, …), not in the
 * network: in every variant the edges are, in printed order, start–A cost 1,
 * A–destination cost 2, start–B cost 2, B–C cost 1, C–destination cost 1, and
 * A–C cost 2. The statement therefore determines the cheapest cost exactly: a
 * variant that closes A–destination removes the two-edge route and leaves two
 * three-edge routes of the same cheapest cost 4, while a variant that closes
 * B–C keeps the two-edge route start–A–destination as the unique cheapest
 * route of cost 3.
 *
 * The source paraphrases the closed link's name ("the layer with clover" for
 * "the clover bed", "the shelf dry" for "the dry shelf"), so a node is
 * identified by the words it is built from, singular and without the words that
 * carry no content, as form 14 does for the same book.
 *
 * The printed route of a tied variant is not determined by the statement: two
 * variants that differ only in their vocabulary print routes through different
 * intermediate nodes, and no statement feature (node order, traversal order,
 * tie policy) selects the printed one. The tied variants therefore ship the
 * canonical cheapest route — the first cheapest route in the statement's own
 * edge-list order, where two routes are compared by the sequence of their edge
 * positions in the printed edge list — and declare the printed answer as an
 * alternative: `printedAnswerStatus` returns 'alternative' when the cheapest
 * cost is tied and 'match' otherwise, so the unique variants keep reproducing
 * the printed answer byte for byte. `verifyPrinted` re-reads the printed route
 * from the source text and accepts it only when it is an allowed route of the
 * network whose total cost equals the cheapest cost, which confirms the printed
 * route from the statement's own data instead of reproducing a table of the
 * answer key. No material beyond the statement is used.
 */

import { slugify } from '../../naming.mjs';

const NETWORK_PATTERN =
  /The network has bidirectional edges with the following costs: ([\s\S]*?)\. The (?:link ([^.]+?) is closed\.|([^.]+?) link is closed\.)/;
const POINTS_PATTERN = /The starting point is “(.+?)”, the destination is “(.+?)”\./;
const ANSWER_PATTERN = /^The minimum-cost path is (.*), total cost (\d+)\.$/;

const EDGE_SEPARATOR = ';';
const LINK_DASH = '–';
const PATH_ARROW = ' → ';

/**
 * Words that name no node content, so they never decide which node a phrase
 * names. The bare article "a" stays in, because one variant names its nodes
 * "the gear A", "the gear B", and "the gear C".
 */
const MATCH_STOPWORDS = new Set(['the', 'of', 'an', 'in', 'with', 'and']);

const PRINTED_ANSWER_REASON =
  'the task admits several allowed routes of the same cheapest cost and the source prints one of them';

/**
 * The words of a node name: the source prints one node in two orders ("the
 * dry shelf" and "the shelf dry"), so a node is identified by the words it is
 * built from, singular and without the words that carry no content.
 */
function nodeWords(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((word) => word !== '' && !MATCH_STOPWORDS.has(word))
    .map((word) => (word.length > 3 ? word.replace(/s$/, '') : word));
}

function wordOverlap(left, right) {
  const words = new Set(nodeWords(right));
  return nodeWords(left).filter((word) => words.has(word)).length;
}

/** The single node a printed phrase names, or a failure when two nodes match as well. */
function nodeOf(phrase, nodes) {
  let best = [];
  let score = -1;
  for (const node of nodes) {
    const match = wordOverlap(phrase, node);
    if (match > score) {
      best = [node];
      score = match;
    } else if (match === score) {
      best.push(node);
    }
  }
  if (score <= 0 || best.length !== 1) {
    throw new Error(`the statement's phrase "${phrase}" does not name exactly one node of the network`);
  }
  return best[0];
}

/** The distinct nodes of the network, in the order the edge list first names them. */
function nodesOf(slots) {
  const nodes = [];
  for (const edge of slots.edges) {
    for (const node of [edge.from, edge.to]) {
      if (!nodes.includes(node)) {
        nodes.push(node);
      }
    }
  }
  return nodes;
}

function parse(statement) {
  const network = NETWORK_PATTERN.exec(statement);
  const points = POINTS_PATTERN.exec(statement);
  if (network === null) {
    throw new Error('the statement does not state the network, its closed link, and its cost rule');
  }
  if (points === null) {
    throw new Error('the statement does not state the starting point and the destination');
  }
  const edges = [];
  for (const printed of network[1].split(EDGE_SEPARATOR)) {
    const separator = printed.lastIndexOf(':');
    const link = printed.slice(0, separator);
    const cost = Number(printed.slice(separator + 1).trim());
    const halves = link.split(LINK_DASH);
    if (separator === -1 || halves.length !== 2 || halves[0].trim() === '' || halves[1].trim() === '') {
      throw new Error(`the statement's edge "${printed.trim()}" is not printed as two nodes and a cost`);
    }
    edges.push({ from: halves[0].trim(), to: halves[1].trim(), cost });
  }
  if (edges.length < 2 || edges.some((edge) => !Number.isInteger(edge.cost) || edge.cost <= 0)) {
    throw new Error('the statement must state at least two edges of positive whole cost');
  }
  const nodes = [];
  for (const edge of edges) {
    for (const node of [edge.from, edge.to]) {
      if (!nodes.includes(node)) {
        nodes.push(node);
      }
    }
  }
  const start = points[1].trim();
  const destination = points[2].trim();
  if (!nodes.includes(start) || !nodes.includes(destination)) {
    throw new Error('the starting point and the destination must be nodes of the network');
  }
  const closedPhrase = network[2] ?? network[3];
  const halves = closedPhrase.trim().split(LINK_DASH);
  if (halves.length !== 2) {
    throw new Error(`the statement's closed link "${closedPhrase.trim()}" is not printed as two nodes`);
  }
  const first = nodeOf(halves[0], nodes);
  const second = nodeOf(halves[1], nodes);
  if (first === second) {
    throw new Error('the closed link must join two different nodes of the network');
  }
  const closed = edges.filter(
    (edge) =>
      (edge.from === first && edge.to === second) || (edge.from === second && edge.to === first)
  );
  if (closed.length !== 1) {
    throw new Error(`the closed link ${first}${LINK_DASH}${second} must be one of the stated edges`);
  }
  return {
    edges: edges.map((edge) => ({ ...edge, closed: edge === closed[0] })),
    start,
    destination
  };
}

/**
 * Every allowed route, from the starting point to the destination and never
 * through the closed link, each one carrying the positions its edges hold in
 * the printed edge list. The network has five nodes, so the enumeration of
 * simple routes is exhaustive and the cheapest cost is the minimum.
 */
function routesOf(slots) {
  const adjacency = new Map();
  slots.edges.forEach((edge, index) => {
    if (edge.closed) {
      return;
    }
    for (const [from, to] of [
      [edge.from, edge.to],
      [edge.to, edge.from]
    ]) {
      if (!adjacency.has(from)) {
        adjacency.set(from, []);
      }
      adjacency.get(from).push({ to, cost: edge.cost, index });
    }
  });
  const routes = [];
  const walk = (node, path, cost, indexes) => {
    if (node === slots.destination) {
      routes.push({ path: [...path], cost, indexes: [...indexes] });
      return;
    }
    for (const step of adjacency.get(node) ?? []) {
      if (path.includes(step.to)) {
        continue;
      }
      path.push(step.to);
      walk(step.to, path, cost + step.cost, [...indexes, step.index]);
      path.pop();
    }
  };
  walk(slots.start, [slots.start], 0, []);
  return routes;
}

/**
 * The canonical route among equals: the first one in edge-list order, compared
 * by the sequence of edge positions its edges hold in the printed list and then
 * by route length. The choice is fixed by the statement's own ordering, never
 * by the answer key.
 */
function firstInEdgeOrder(routes) {
  return routes.slice().sort((left, right) => {
    const limit = Math.min(left.indexes.length, right.indexes.length);
    for (let position = 0; position < limit; position += 1) {
      if (left.indexes[position] !== right.indexes[position]) {
        return left.indexes[position] - right.indexes[position];
      }
    }
    return left.indexes.length - right.indexes.length;
  })[0];
}

function solve(slots) {
  const routes = routesOf(slots);
  if (routes.length === 0) {
    throw new Error('the closed link leaves no allowed route from the starting point to the destination');
  }
  const cheapest = Math.min(...routes.map((route) => route.cost));
  const winners = routes.filter((route) => route.cost === cheapest);
  const chosen = firstInEdgeOrder(winners);
  return { path: chosen.path, cost: cheapest, tied: winners.length > 1 };
}

function render(solution) {
  return `The minimum-cost path is ${solution.path.join(PATH_ARROW)}, total cost ${solution.cost}.`;
}

/**
 * The printed answer is determined only when the cheapest route is unique. The
 * function is the per-variant declaration the pilot resolves: 'alternative'
 * when the source printed one of several cheapest routes, 'match' when the
 * printed route is the only cheapest route.
 */
function printedAnswerStatus(parsedSlots, solution) {
  return solution.tied ? 'alternative' : 'match';
}

/**
 * Confirms the printed answer's declared 'alternative' status from the
 * statement's own data: the printed route must resolve to network nodes, run
 * from the starting point to the destination, use allowed links only, and add
 * up to the cheapest cost. It never compares against a route stored in the
 * family, so a table of the answer key cannot pass this check.
 */
function verifyPrinted(parsedSlots, solution, printedText) {
  const printed = ANSWER_PATTERN.exec(String(printedText).trim());
  if (printed === null || Number(printed[2]) !== solution.cost) {
    return false;
  }
  const nodes = nodesOf(parsedSlots);
  let path;
  try {
    path = printed[1].split(PATH_ARROW).map((phrase) => nodeOf(phrase.trim(), nodes));
  } catch (error) {
    return false;
  }
  if (path.length < 2 || path[0] !== parsedSlots.start || path[path.length - 1] !== parsedSlots.destination) {
    return false;
  }
  if (new Set(path).size !== path.length) {
    return false;
  }
  let total = 0;
  for (let position = 0; position + 1 < path.length; position += 1) {
    const edge = parsedSlots.edges.find(
      (candidate) =>
        candidate.closed !== true &&
        ((candidate.from === path[position] && candidate.to === path[position + 1]) ||
          (candidate.from === path[position + 1] && candidate.to === path[position]))
    );
    if (edge === undefined) {
      return false;
    }
    total += edge.cost;
  }
  return total === solution.cost;
}

const WIRES = [
  {
    name: 'routes',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const adjacency = new Map();',
      'slots.edges.forEach((edge, index) => {',
      '  if (edge.closed === true) return;',
      '  for (const pair of [[edge.from, edge.to], [edge.to, edge.from]]) {',
      '    if (!adjacency.has(pair[0])) adjacency.set(pair[0], []);',
      '    adjacency.get(pair[0]).push({ to: pair[1], cost: edge.cost, index: index });',
      '  }',
      '});',
      'const routes = [];',
      'const walk = (node, path, cost, indexes) => {',
      '  if (node === slots.destination) { routes.push({ path: path.slice(), cost: cost, indexes: indexes.slice() }); return; }',
      '  for (const step of adjacency.get(node) || []) {',
      '    if (path.includes(step.to)) continue;',
      '    path.push(step.to);',
      '    walk(step.to, path, cost + step.cost, indexes.concat([step.index]));',
      '    path.pop();',
      '  }',
      '};',
      'walk(slots.start, [slots.start], 0, []);',
      'probe(routes.length > 0, "the closed link must leave at least one allowed route");',
      'return routes;'
    ].join('\n')
  },
  {
    name: 'best',
    command: 'jsEval',
    body: [
      'const routes = $routes;',
      'const cheapest = Math.min(...routes.map((route) => route.cost));',
      'probe(Number.isInteger(cheapest) && cheapest > 0, "the cheapest allowed route must have a positive whole cost");',
      'const winners = routes.filter((route) => route.cost === cheapest);',
      'probe(winners.length >= 1, "the allowed routes must determine a cheapest cost");',
      'const chosen = winners.slice().sort((left, right) => {',
      '  const limit = Math.min(left.indexes.length, right.indexes.length);',
      '  for (let position = 0; position < limit; position += 1) {',
      '    if (left.indexes[position] !== right.indexes[position]) return left.indexes[position] - right.indexes[position];',
      '  }',
      '  return left.indexes.length - right.indexes.length;',
      '})[0];',
      'probe(chosen.path[0] === $slots.start && chosen.path[chosen.path.length - 1] === $slots.destination, "the reported route must run from the starting point to the destination");',
      'probe(chosen.path.length > 1 && new Set(chosen.path).size === chosen.path.length, "the reported route must visit every node once");',
      'return { path: chosen.path, cost: cheapest };'
    ].join('\n')
  }
];

const COMPUTE = [
  'return "The minimum-cost path is " + $best.path.join(" → ") + ", total cost " + $best.cost + ".";'
].join('\n');

function explain(slots, solution) {
  const closed = slots.edges.find((edge) => edge.closed);
  const lines = [
    `The closed link ${closed.from}${LINK_DASH}${closed.to} is removed from the network, so no allowed route may use it.`,
    `The remaining routes are enumerated and their edge costs added: the allowed route with the smallest sum is ${solution.path.join(PATH_ARROW)}, at total cost ${solution.cost}.`
  ];
  if (solution.tied) {
    lines.push(
      'Two allowed routes reach the destination at this cheapest cost and the statement does not say which one to print, so the route whose edges come first in the printed list is reported.'
    );
  }
  lines.push(
    'Counting nodes instead of adding costs would prefer a route with fewer stops that costs more, which the question rules out.',
    'Every other allowed route costs the same or more, and a route that used the closed link is not a candidate at all.'
  );
  return lines;
}

export const unit = 29;

export const cases = [
  {
    template: 'Paths in a network with constraints',
    type: slugify('Paths in a network with constraints'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain,
    printedAnswerStatus,
    printedAnswerReason: PRINTED_ANSWER_REASON,
    verifyPrinted
  }
];
