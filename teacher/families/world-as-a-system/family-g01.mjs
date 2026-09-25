/**
 * Family G1 of the world seed book: positions and orientation.
 *
 * Every problem states a chain of relative moves between named places
 * ("Pine is 1 map unit(s) east of Cedar") and asks where the target lies
 * relative to the origin, plus the grid displacement |x|+|y|. Grades 3 and 4
 * append an irrelevant museum sentence and ask for it to be identified, and the
 * family reports it as part of the answer.
 *
 * The four grades share one computation and one plan: the variants differ in
 * the data they state (unit counts, chain length, distractors), not in the
 * algorithm, so their cases share the same parse, solve, compute, and explain
 * functions and only declare their own printed template.
 */

import { blocksOf, stripCrossDomain } from './shared.mjs';

const DIRECTION_VECTORS = Object.freeze({
  east: Object.freeze([1, 0]),
  west: Object.freeze([-1, 0]),
  north: Object.freeze([0, 1]),
  south: Object.freeze([0, -1])
});

const RELATION_PATTERN = /([A-Z][A-Za-z]+(?: [A-Z][A-Za-z]+)*) is (\d+) map unit\(s\) (east|west|north|south) of ([A-Z][A-Za-z]+(?: [A-Z][A-Za-z]+)*)/g;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const relations = [];
  for (const match of facts.matchAll(RELATION_PATTERN)) {
    relations.push({ place: match[1], units: Number(match[2]), direction: match[3], reference: match[4] });
  }
  if (relations.length === 0) {
    throw new Error('the statement states no relative move');
  }
  const task = /Where is (.+?) relative to (.+?)\?/.exec(blocks.Task);
  if (task === null) {
    throw new Error('the task does not ask for a relative position');
  }
  return {
    origin: task[2],
    target: task[1],
    relations,
    irrelevantFact: /Identify any irrelevant fact/.test(blocks.Task)
  };
}

function positionOf(slots, name) {
  // The relations are a labelled graph: each fact states one vector between two
  // places. A breadth-first walk from the origin accumulates the vectors, so a
  // chain of any length yields the target's coordinates relative to the origin.
  const adjacency = new Map();
  const link = (from, to, vector) => {
    if (!adjacency.has(from)) {
      adjacency.set(from, []);
    }
    adjacency.get(from).push({ to, vector });
  };
  for (const relation of slots.relations) {
    const vector = DIRECTION_VECTORS[relation.direction];
    if (vector === undefined) {
      throw new Error(`unknown direction "${relation.direction}"`);
    }
    const step = [vector[0] * relation.units, vector[1] * relation.units];
    link(relation.place, relation.reference, [-step[0], -step[1]]);
    link(relation.reference, relation.place, step);
  }
  const seen = new Set([slots.origin]);
  const queue = [{ name: slots.origin, position: [0, 0] }];
  while (queue.length > 0) {
    const current = queue.shift();
    if (current.name === name) {
      return current.position;
    }
    for (const edge of adjacency.get(current.name) ?? []) {
      if (seen.has(edge.to)) {
        continue;
      }
      seen.add(edge.to);
      queue.push({ name: edge.to, position: [current.position[0] + edge.vector[0], current.position[1] + edge.vector[1]] });
    }
  }
  return null;
}

function directionPhrase(dx, dy) {
  if (dx === 0 && dy === 0) {
    return 'the same position of';
  }
  const vertical = dy > 0 ? 'north' : dy < 0 ? 'south' : '';
  const horizontal = dx > 0 ? 'east' : dx < 0 ? 'west' : '';
  if (vertical !== '' && horizontal !== '') {
    return `${vertical}-${horizontal} of`;
  }
  return `${vertical}${horizontal} of`;
}

function solve(slots) {
  const position = positionOf(slots, slots.target);
  if (position === null) {
    throw new Error('the target is not connected to the origin by the stated moves');
  }
  const [dx, dy] = position;
  return {
    dx,
    dy,
    displacement: Math.abs(dx) + Math.abs(dy),
    origin: slots.origin,
    target: slots.target,
    irrelevantFact: slots.irrelevantFact
  };
}

function render(solution) {
  const where = `${solution.target} is ${directionPhrase(solution.dx, solution.dy)} ${solution.origin}; grid displacement ${solution.displacement} unit(s).`;
  return solution.irrelevantFact ? `${where} The museum fact is irrelevant.` : where;
}

const COMPUTE = [
  'const slots = $slots;',
  'const vectors = { east: [1, 0], west: [-1, 0], north: [0, 1], south: [0, -1] };',
  'const adjacency = new Map();',
  'const link = (from, to, vector) => {',
  '  if (!adjacency.has(from)) {',
  '    adjacency.set(from, []);',
  '  }',
  '  adjacency.get(from).push({ to, vector });',
  '};',
  'for (const relation of slots.relations) {',
  '  const vector = vectors[relation.direction];',
  '  const step = [vector[0] * relation.units, vector[1] * relation.units];',
  '  link(relation.place, relation.reference, [-step[0], -step[1]]);',
  '  link(relation.reference, relation.place, step);',
  '}',
  'const seen = new Set([slots.origin]);',
  'const queue = [{ name: slots.origin, position: [0, 0] }];',
  'let position = null;',
  'while (queue.length > 0 && position === null) {',
  '  const current = queue.shift();',
  '  if (current.name === slots.target) {',
  '    position = current.position;',
  '    break;',
  '  }',
  '  for (const edge of adjacency.get(current.name) || []) {',
  '    if (seen.has(edge.to)) {',
  '      continue;',
  '    }',
  '    seen.add(edge.to);',
  '    queue.push({ name: edge.to, position: [current.position[0] + edge.vector[0], current.position[1] + edge.vector[1]] });',
  '  }',
  '}',
  'probe(position !== null, "the target must be reachable from the origin through the stated moves");',
  'const dx = position[0];',
  'const dy = position[1];',
  'const vertical = dy > 0 ? "north" : dy < 0 ? "south" : "";',
  'const horizontal = dx > 0 ? "east" : dx < 0 ? "west" : "";',
  'const phrase = dx === 0 && dy === 0 ? "the same position of" : vertical !== "" && horizontal !== "" ? vertical + "-" + horizontal + " of" : vertical + horizontal + " of";',
  'const where = slots.target + " is " + phrase + " " + slots.origin + "; grid displacement " + (Math.abs(dx) + Math.abs(dy)) + " unit(s).";',
  'return slots.irrelevantFact ? where + " The museum fact is irrelevant." : where;'
].join('\n');

function explain(slots, solution) {
  return [
    `Start ${slots.origin} at (0,0) and translate each stated relation into a coordinate move.`,
    `Following the stated moves from ${slots.origin} to ${slots.target} adds up to (${solution.dx},${solution.dy}).`,
    `That coordinate places ${slots.target} ${directionPhrase(solution.dx, solution.dy)} ${slots.origin}, and the grid displacement is |${solution.dx}|+|${solution.dy}|=${solution.displacement}.`,
    ...(slots.irrelevantFact ? ['The museum sentence changes no coordinate, so it is a distractor.'] : [])
  ];
}

function caseFor(grade) {
  return {
    template: `Positions and orientation (grade ${grade})`,
    type: `positions-and-orientation-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'G1';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
