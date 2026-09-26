/**
 * Form 25 of the scientific-reasoning book: spatial relationships and
 * orientation.
 *
 * Every part-two variant states a knowledge block, then a `Problem data.`
 * block that maps a small world on a grid: a step north, south, east or west
 * has the same length, and four relations place named places relative to one
 * another ("A" is east of "B"). The question asks where one place is relative
 * to another and how many elementary moves the described route uses.
 *
 * Only three of the four relations form the route between the two places the
 * question names; the fourth describes a place the route never follows, so the
 * family walks the graph from the reference place and stops at the asked
 * place instead of summing all four relations. The answer is the compass word
 * of the net displacement and the number of relations the route uses — three
 * in every variant, but read from the route rather than assumed.
 *
 * The variants differ in the world (a garden, a river, a factory, a kitchen, a
 * circuit, the Sun and the Moon) and therefore in the place names and in the
 * extra relation; the walk is the same.
 */

import { slugify } from '../../naming.mjs';

const RELATION_PATTERN = /[“"]([^”"]+)[”"] is (north|south|east|west|northeast|northwest|southeast|southwest) of [“"]([^”"]+)[”"]/g;
const ASKED_PATTERN = /Where is [“"]([^”"]+)[”"] relative to [“"]([^”"]+)[”"]/;
const VECTORS = Object.freeze({
  north: [0, 1],
  south: [0, -1],
  east: [1, 0],
  west: [-1, 0],
  northeast: [1, 1],
  northwest: [-1, 1],
  southeast: [1, -1],
  southwest: [-1, -1]
});
const COMPASS = new Map(Object.entries(VECTORS).map(([word, [x, y]]) => [`${x},${y}`, word]));

function parse(statement) {
  const data = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  const question = /Question\.\s*([\s\S]*)$/.exec(statement);
  if (data === null || question === null) {
    throw new Error('the statement does not state its map and its question');
  }
  const relations = [...data[1].matchAll(RELATION_PATTERN)].map((match) => ({
    subject: match[1],
    direction: match[2],
    object: match[3]
  }));
  if (relations.length === 0) {
    throw new Error('the data block states no spatial relation');
  }
  const asked = ASKED_PATTERN.exec(question[1]);
  if (asked === null) {
    throw new Error('the question does not ask where one place is relative to another');
  }
  return { relations, target: asked[1], anchor: asked[2] };
}

/**
 * The walk from the reference place: each relation places its subject one step
 * from its object, so expanding the objects place by place reaches the asked
 * place along the route the question describes. A place already reached keeps
 * the first route that found it, which is the shortest one.
 */
function walk(slots) {
  const reached = new Map([[slots.anchor, { x: 0, y: 0, steps: 0 }]]);
  let frontier = [slots.anchor];
  while (frontier.length > 0 && !reached.has(slots.target)) {
    const next = [];
    for (const place of frontier) {
      const here = reached.get(place);
      for (const relation of slots.relations) {
        if (relation.object !== place || reached.has(relation.subject)) {
          continue;
        }
        const [stepX, stepY] = VECTORS[relation.direction];
        reached.set(relation.subject, { x: here.x + stepX, y: here.y + stepY, steps: here.steps + 1 });
        next.push(relation.subject);
      }
    }
    frontier = next;
  }
  const place = reached.get(slots.target);
  if (place === undefined) {
    throw new Error(`the described route does not reach "${slots.target}"`);
  }
  const direction = COMPASS.get(`${place.x},${place.y}`);
  if (direction === undefined) {
    throw new Error(`the route puts "${slots.target}" at an offset of (${place.x},${place.y}), which is not a compass direction`);
  }
  return { ...place, direction };
}

function solve(slots) {
  if (slots.target === slots.anchor) {
    throw new Error('the question asks for the position of the reference place itself');
  }
  return { target: slots.target, anchor: slots.anchor, ...walk(slots) };
}

function render(solution) {
  return `"${solution.target}" is ${solution.direction} of "${solution.anchor}"; the given route has ${solution.steps} steps.`;
}

const WIRES = [
  {
    name: 'place',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const VECTORS = { north: [0, 1], south: [0, -1], east: [1, 0], west: [-1, 0], northeast: [1, 1], northwest: [-1, 1], southeast: [1, -1], southwest: [-1, -1] };',
      'const COMPASS = new Map(Object.entries(VECTORS).map(([word, step]) => [step[0] + "," + step[1], word]));',
      'const reached = new Map([[slots.anchor, { x: 0, y: 0, steps: 0 }]]);',
      'let frontier = [slots.anchor];',
      'while (frontier.length > 0 && !reached.has(slots.target)) {',
      '  const next = [];',
      '  for (const place of frontier) {',
      '    const here = reached.get(place);',
      '    for (const relation of slots.relations) {',
      '      if (relation.object !== place || reached.has(relation.subject)) {',
      '        continue;',
      '      }',
      '      const step = VECTORS[relation.direction];',
      '      reached.set(relation.subject, { x: here.x + step[0], y: here.y + step[1], steps: here.steps + 1 });',
      '      next.push(relation.subject);',
      '    }',
      '  }',
      '  frontier = next;',
      '}',
      'probe(reached.has(slots.target), "the described route must reach the asked place");',
      'const place = reached.get(slots.target);',
      'const word = COMPASS.get(place.x + "," + place.y);',
      'probe(typeof word === "string" && word.length > 0, "the net displacement must be a compass direction");',
      'probe(place.steps > 0 && place.steps < slots.relations.length + 1, "the route must use at least one and fewer than all the stated relations");',
      'return { word: word, steps: place.steps };'
    ].join('\n')
  }
];

const COMPUTE = [
  'return "\\"" + $slots.target + "\\" is " + $place.word + " of \\"" + $slots.anchor + "\\"; the given route has " + $place.steps + " steps.";'
].join('\n');

function explain(slots, solution) {
  return [
    `Placing "${slots.anchor}" at the coordinate (0,0), the route the question describes is followed one relation at a time.`,
    `After ${solution.steps} elementary moves the walk reaches "${slots.target}" at the offset (${solution.x},${solution.y}).`,
    `Therefore "${slots.target}" is ${solution.direction} of "${slots.anchor}", and the route uses ${solution.steps} moves.`,
    'The map also states a relation the route never follows, so it does not shift the asked place.'
  ];
}

export const unit = 25;

export const cases = [
  {
    template: 'Spatial relationships and orientation',
    type: slugify('Spatial relationships and orientation'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
