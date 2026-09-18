/**
 * Section 63 of the adult-reasoning course: maps and legends described.
 *
 * Every variant prints the same legend — well, park, road, path, clinic — the
 * statement that north is the top of the page, and a two-leg route: the path
 * runs from the well to the park, then the road runs to the clinic. The person
 * then turns the map so that north lies on another side of the page and starts
 * from the well along the printed side of the rotated sheet. The verdict names
 * the cardinal that side carries and whether it is the leg that reaches the
 * park. The cases change the place, the person, and the printed directions, so
 * the family resolves the rotated compass from the parsed side and rotation.
 */

import { slugify } from '../../naming.mjs';

const LEGEND_PATTERN =
  /Map legend, (.+?): blue square = well; green triangle = park; thick line = road; dotted = path; cross = clinic\./;
const ROUTE_PATTERN =
  /North = top of the page\. From the well the path goes ([A-Z]+) to the park, then the road ([A-Z]+) to the clinic\./;
const TURN_PATTERN =
  /([A-Z][a-z]+) turns the map with north ([A-Z]+) and starts from the well on the path toward the ([A-Z]+) of the rotated page\./;

// The four positions of the sheet, clockwise from the top.
const PAGE_DIRECTIONS = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
// The compass, clockwise from north: turning the sheet moves a cardinal by the
// number of quarter turns between north and the side the person walks toward.
const COMPASS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

function parse(statement) {
  const legend = LEGEND_PATTERN.exec(statement);
  const route = ROUTE_PATTERN.exec(statement);
  const turn = TURN_PATTERN.exec(statement);
  if (legend === null || route === null || turn === null) {
    throw new Error('the statement does not print the legend, the route, and the person who turns the map');
  }
  const rotationPage = PAGE_DIRECTIONS.indexOf(turn[2]);
  const sidePage = PAGE_DIRECTIONS.indexOf(turn[3]);
  if (rotationPage === -1 || sidePage === -1) {
    throw new Error('the turned map must name north and the walking side with the printed page directions');
  }
  if (!COMPASS.includes(route[1]) || !COMPASS.includes(route[2])) {
    throw new Error('both legs of the route must be named with cardinal directions');
  }
  if (rotationPage === 0) {
    throw new Error('the sheet is not turned, so the section has no rotation to reason about');
  }
  return {
    place: legend[1],
    person: turn[1],
    rotation: turn[2],
    side: turn[3],
    rotationPage,
    sidePage,
    firstLeg: route[1],
    secondLeg: route[2]
  };
}

function solve(slots) {
  // A sheet whose north lies on `rotationPage` puts the cardinal that is
  // `sidePage` quarter turns clockwise of north on the walked side.
  const walkingIndex = (((slots.sidePage - slots.rotationPage) % 4) + 4) % 4;
  const walking = COMPASS[walkingIndex];
  const reachesPark = walking === slots.firstLeg;
  return {
    walking,
    reachesPark,
    rotationClause: `With north ${slots.rotation.toLowerCase()}, ${walking.toLowerCase()} is to the ${slots.side.toLowerCase()} of the rotated page.`,
    routeClause: reachesPark
      ? `Yes, they walk ${slots.firstLeg.toLowerCase()} on the path and reach the park.`
      : `No, they walk ${walking.toLowerCase()} and miss the park.`
  };
}

function render(solution) {
  return `${solution.rotationClause} ${solution.routeClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const PAGE_DIRECTIONS = ["UP", "RIGHT", "DOWN", "LEFT"];',
  'const COMPASS = ["NORTH", "EAST", "SOUTH", "WEST"];',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the legend must name the place it belongs to");',
  'probe(typeof slots.person === "string" && slots.person.length > 0, "the case must name the person who turns the map");',
  'probe(PAGE_DIRECTIONS.indexOf(slots.rotation) >= 0, "the statement must place north on one side of the rotated page");',
  'probe(PAGE_DIRECTIONS.indexOf(slots.side) >= 0, "the walked side must be a direction of the page");',
  'probe(slots.rotation !== "UP", "a map that is not turned has no rotation to reason about");',
  'probe(COMPASS.indexOf(slots.firstLeg) >= 0 && COMPASS.indexOf(slots.secondLeg) >= 0, "both legs of the route must be cardinal directions");',
  'probe(slots.firstLeg !== slots.secondLeg, "the two legs of the route must run on different cardinals");',
  'const rotationPage = PAGE_DIRECTIONS.indexOf(slots.rotation);',
  'const sidePage = PAGE_DIRECTIONS.indexOf(slots.side);',
  'const walkingIndex = (((sidePage - rotationPage) % 4) + 4) % 4;',
  'const walking = COMPASS[walkingIndex];',
  'const reachesPark = walking === slots.firstLeg;',
  'const rotationClause = "With north " + slots.rotation.toLowerCase() + ", " + walking.toLowerCase() + " is to the " + slots.side.toLowerCase() + " of the rotated page.";',
  'const routeClause = reachesPark',
  '  ? "Yes, they walk " + slots.firstLeg.toLowerCase() + " on the path and reach the park."',
  '  : "No, they walk " + walking.toLowerCase() + " and miss the park.";',
  'return rotationClause + " " + routeClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The legend in ${slots.place} draws the park as the green triangle and the path as the dotted line, so the first leg of the printed route runs from the well to the park on the ${slots.firstLeg} cardinal.`,
    `Turning the sheet until north lies ${slots.rotation.toLowerCase()} on the page drags every cardinal with it, and the side that then lies ${slots.side.toLowerCase()} of the rotated page is ${solution.walking.toLowerCase()}.`,
    solution.reachesPark
      ? `That is the cardinal of the path to the park, so ${slots.person} walks ${solution.walking.toLowerCase()} and arrives at the green triangle.`
      : `That is not the cardinal of the path to the park, so ${slots.person} leaves the dotted line and never reaches the green triangle.`
  ];
}

export const unit = 63;

export const cases = [
  {
    template: 'Maps and legends described',
    type: slugify('Maps and legends described'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
