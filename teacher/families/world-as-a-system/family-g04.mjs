/**
 * Family G4 of the world seed book: neighbours and borders.
 *
 * Every problem states a set of fictional states and their shared borders,
 * which are the undirected edges of an adjacency network, and asks two things:
 * the fewest border crossings between two named states, and whether a third
 * named state is unavoidable, that is, whether the destination is still
 * reachable once that state is deleted from the network.
 *
 * The four grades share one computation: the variants differ in the stated
 * states and borders (a later grade drops one border from the printed list, so
 * a candidate can become a cut vertex), not in the algorithm.
 */

import { blocksOf, stripCrossDomain, adjacencyOf, shortestDistance, reachableWithout } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const STATES_PATTERN = /fictional states (.+?)\./;
const BORDERS_PATTERN = /Shared borders: (.+?)\./;
const DISTANCE_PATTERN = /fewest number of border crossings needed to travel from (.+?) to (.+?)\?/;
const CROSSED_PATTERN = /Is (.+?) necessarily crossed\?/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const states = STATES_PATTERN.exec(facts);
  const borders = BORDERS_PATTERN.exec(facts);
  if (states === null || borders === null) {
    throw new Error('the statement lists neither the fictional states nor their shared borders');
  }
  const pairs = [];
  for (const entry of borders[1].split(',')) {
    const [left, right] = entry.trim().split(/[–-]/);
    if (left === undefined || right === undefined || left.trim() === '' || right.trim() === '') {
      throw new Error(`the shared-border entry "${entry.trim()}" is not a pair of states`);
    }
    pairs.push([left.trim(), right.trim()]);
  }
  if (pairs.length === 0) {
    throw new Error('the statement lists no shared border');
  }
  const distance = DISTANCE_PATTERN.exec(blocks.Task);
  const crossed = CROSSED_PATTERN.exec(blocks.Task);
  if (distance === null || crossed === null) {
    throw new Error('the task does not ask for the crossing count and the unavoidability of one state');
  }
  return {
    states: states[1].split(',').map((value) => value.trim()),
    pairs,
    from: distance[1],
    to: distance[2],
    candidate: crossed[1]
  };
}

function solve(slots) {
  const adjacency = adjacencyOf(slots.pairs);
  for (const state of [slots.from, slots.to, slots.candidate]) {
    if (!adjacency.has(state)) {
      throw new Error(`the asked state "${state}" is not part of the stated border network`);
    }
  }
  const distance = shortestDistance(adjacency, slots.from, slots.to);
  if (!Number.isFinite(distance)) {
    throw new Error(`the stated borders do not connect ${slots.from} to ${slots.to}`);
  }
  return {
    distance,
    candidate: slots.candidate,
    unavoidable: !reachableWithout(adjacency, slots.from, slots.to, new Set([slots.candidate]))
  };
}

function render(solution) {
  return `${solution.distance} border crossing(s); ${solution.candidate} is ${solution.unavoidable ? '' : 'not '}unavoidable.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.pairs) && slots.pairs.length > 0, "the statement must list at least one shared border");',
  'probe(typeof slots.from === "string" && slots.from.length > 0 && typeof slots.to === "string" && slots.to.length > 0, "the two endpoints of the crossing question must be named");',
  'probe(typeof slots.candidate === "string" && slots.candidate.length > 0, "the unavoidability question must name one state");',
  'const adjacency = new Map();',
  'for (const pair of slots.pairs) {',
  '  const left = pair[0];',
  '  const right = pair[1];',
  '  probe(typeof left === "string" && typeof right === "string" && left !== right, "every shared border must join two different states");',
  '  if (!adjacency.has(left)) {',
  '    adjacency.set(left, new Set());',
  '  }',
  '  if (!adjacency.has(right)) {',
  '    adjacency.set(right, new Set());',
  '  }',
  '  adjacency.get(left).add(right);',
  '  adjacency.get(right).add(left);',
  '}',
  'probe(adjacency.has(slots.from) && adjacency.has(slots.to), "both endpoints of the crossing question must appear in the stated borders");',
  'probe(slots.from !== slots.to, "the crossing question must name two different states");',
  'const seen = new Set([slots.from]);',
  'let frontier = [slots.from];',
  'let distance = 0;',
  'let found = false;',
  'while (frontier.length > 0 && !found) {',
  '  distance += 1;',
  '  const next = [];',
  '  for (const state of frontier) {',
  '    for (const neighbour of adjacency.get(state) ?? []) {',
  '      if (neighbour === slots.to) {',
  '        found = true;',
  '      } else if (!seen.has(neighbour)) {',
  '        seen.add(neighbour);',
  '        next.push(neighbour);',
  '      }',
  '    }',
  '  }',
  '  frontier = found ? [] : next;',
  '}',
  'probe(found, "the stated borders must connect the two endpoints of the crossing question");',
  'const visited = new Set([slots.from]);',
  'const queue = [slots.from];',
  'let reachable = false;',
  'while (queue.length > 0) {',
  '  const state = queue.shift();',
  '  if (state === slots.to) {',
  '    reachable = true;',
  '    break;',
  '  }',
  '  for (const neighbour of adjacency.get(state) ?? []) {',
  '    if (neighbour !== slots.candidate && !visited.has(neighbour)) {',
  '      visited.add(neighbour);',
  '      queue.push(neighbour);',
  '    }',
  '  }',
  '}',
  'return distance + " border crossing(s); " + slots.candidate + (reachable ? " is not unavoidable." : " is unavoidable.");'
].join('\n');

function explain(slots, solution) {
  return [
    `Each shared border is an undirected link, so the network has ${slots.pairs.length} links over the listed states.`,
    `A breadth-first search from ${slots.from} reaches ${slots.to} in ${solution.distance} links, which is the fewest border crossings.`,
    `Deleting ${solution.candidate} leaves ${slots.to} ${solution.unavoidable ? 'unreachable' : 'reachable'} from ${slots.from}, so the state is ${solution.unavoidable ? 'crossed by every route' : 'avoidable on at least one route'}.`
  ];
}

function caseFor(grade) {
  const template = `Neighbours and borders (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'G4';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
