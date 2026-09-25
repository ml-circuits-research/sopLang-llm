/**
 * Section 70 of the adult-reasoning course: cardinal points and meeting places.
 *
 * Every variant sends two walkers from the same post office along a
 * rectangular grid without diagonals: the first goes north then east, the
 * second goes east then north, over the same two distances swapped. Because a
 * grid has no diagonals and the two legs are perpendicular, the order of the
 * legs does not change the corner, so both arrive at the same point. The cases
 * change the two names, the distances, and the town, so the family derives the
 * equality from the parsed walks.
 */

import { slugify } from '../../naming.mjs';

const WALK_PATTERN =
  /([A-Z][a-z]+) from the post office: north ([0-9]+) m, then east ([0-9]+) m\. ([A-Z][a-z]+) from the post office: east ([0-9]+) m, then north ([0-9]+) m\. Rectangular grid, no diagonals, in ([^.]+)\./;

function parse(statement) {
  const walk = WALK_PATTERN.exec(statement);
  if (walk === null) {
    throw new Error('the statement does not give the two walks on the rectangular grid');
  }
  return {
    first: { name: walk[1], north: Number(walk[2]), east: Number(walk[3]) },
    second: { name: walk[4], north: Number(walk[6]), east: Number(walk[5]) },
    town: walk[7],
    gridWithoutDiagonals: /Rectangular grid, no diagonals/.test(statement)
  };
}

function solve(slots) {
  if (!slots.gridWithoutDiagonals) {
    throw new Error('the statement must place the walks on a grid without diagonals');
  }
  if (slots.first.name === slots.second.name) {
    throw new Error('the two walkers must be different people');
  }
  if (!(slots.first.north > 0) || !(slots.first.east > 0)) {
    throw new Error('both legs of the first walk must be positive distances');
  }
  if (slots.first.north !== slots.second.north || slots.first.east !== slots.second.east) {
    throw new Error('the two walks must cover the same north and east distances in the opposite order');
  }
  return {
    north: slots.first.north,
    east: slots.first.east,
    secondEast: slots.second.east,
    secondNorth: slots.second.north
  };
}

function render(solution) {
  return `Yes. On a grid, north ${solution.north} + east ${solution.east} = east ${solution.secondEast} + north ${solution.secondNorth}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "Yes. On a grid, north " + slots.first.north + " + east " + slots.first.east + " = east " + slots.second.east + " + north " + slots.second.north + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.first.name} walks north ${slots.first.north} m and then east ${slots.first.east} m, and ${slots.second.name} walks east ${slots.second.east} m and then north ${slots.second.north} m, both from the post office in ${slots.town}.`,
    'On a rectangular grid without diagonals the two legs stay perpendicular, so going north before east and going east before north both end at the corner with the same northing and the same easting.',
    `The two distances are identical in both walks, so the final points coincide: north ${solution.north} + east ${solution.east} = east ${solution.secondEast} + north ${solution.secondNorth}.`
  ];
}

export const unit = 70;

export const cases = [
  {
    template: 'Cardinal points and meeting places',
    type: slugify('Cardinal points and meeting places'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
