/**
 * Section 68 of the adult-reasoning course: perimeter and area in practical
 * cases.
 *
 * Every variant prints the same sheet — rectangle area = L×W, perimeter =
 * 2(L+W) — and one room given by its two sides, then asks for the m² of rug
 * (the area) and the metres of cord along the outline (the perimeter). The
 * cases change the owner and the two side lengths, so the family derives both
 * printed numbers from the parsed rectangle.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN =
  /Sheet: rectangle area = L×W\. Perimeter = 2\(L\+W\)\. Rug = area\. Cord on the outline = perimeter\./;
const ROOM_PATTERN =
  /([A-Z][a-z]+)’s room: ([0-9]+(?:\.[0-9]+)?) m × ([0-9]+(?:\.[0-9]+)?) m\./;

/** Prints a measured value without a fixed number of decimals. */
function formatValue(value) {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 1000) / 1000);
}

function parse(statement) {
  const room = ROOM_PATTERN.exec(statement);
  if (room === null || !SHEET_PATTERN.test(statement)) {
    throw new Error('the statement does not give the sheet and one rectangular room');
  }
  const length = Number(room[2]);
  const width = Number(room[3]);
  if (!(length > 0) || !(width > 0)) {
    throw new Error('both sides of the room must be positive lengths');
  }
  return {
    owner: room[1],
    length,
    width,
    rugIsArea: /Rug = area\./.test(statement),
    cordIsPerimeter: /Cord on the outline = perimeter\./.test(statement)
  };
}

function solve(slots) {
  if (!slots.rugIsArea || !slots.cordIsPerimeter) {
    throw new Error('the sheet must map the rug to the area and the cord on the outline to the perimeter');
  }
  const area = slots.length * slots.width;
  const perimeter = 2 * (slots.length + slots.width);
  if (!(area > 0) || !(perimeter > 0)) {
    throw new Error('the room must give a positive area and perimeter');
  }
  return { owner: slots.owner, area, perimeter };
}

function render(solution) {
  return `Area ${formatValue(solution.area)} m². Perimeter ${formatValue(solution.perimeter)} m.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const area = slots.length * slots.width;',
  'const perimeter = 2 * (slots.length + slots.width);',
  'probe(area === slots.length * slots.width, "the rug must be the rectangle area L×W");',
  'probe(perimeter === 2 * (slots.length + slots.width), "the cord must be the perimeter 2(L+W)");',
  'probe(area > 0 && perimeter > 0, "the room must give a positive area and perimeter");',
  'const formatValue = (value) => Number.isInteger(value) ? String(value) : String(Math.round(value * 1000) / 1000);',
  'return "Area " + formatValue(area) + " m². Perimeter " + formatValue(perimeter) + " m.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.owner}'s room measures ${formatValue(slots.length)} m by ${formatValue(slots.width)} m, and the sheet makes the rug the area, so the rug is ${formatValue(slots.length)} × ${formatValue(slots.width)} = ${formatValue(solution.area)} m².`,
    `The cord runs along the outline, which the sheet calls the perimeter, so the cord is 2(${formatValue(slots.length)} + ${formatValue(slots.width)}) = ${formatValue(solution.perimeter)} m.`,
    'The two requests use different formulas on the same rectangle: multiplying the sides gives the surface, and adding the two sides before doubling gives the length around it.'
  ];
}

export const unit = 68;

export const cases = [
  {
    template: 'Perimeter and area in practical cases',
    type: slugify('Perimeter and area in practical cases'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
