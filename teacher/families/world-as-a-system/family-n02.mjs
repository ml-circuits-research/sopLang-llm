/**
 * Family N2 of the world seed book: coordinates and constraint-based location.
 *
 * Every problem places a point P on an integer grid and states simultaneous
 * constraints on its coordinates — the sum and the difference of x and y in
 * grades 1-2, plus a lower bound on x from grade 3 on. The valid locations are
 * the grid points that satisfy every stated equation and inequality at once,
 * and the answer lists them and says whether the location is unique. Some
 * variants of grades 2-4 append a cross-domain check, which the family renders
 * as the labelled answer suffix through the shared `renderCrossDomain`.
 *
 * The four grades share one computation; the grade differences live in the
 * stated grid bound, the stated constraints, and whether a cross-domain check
 * is appended.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';

const GRID_PATTERN = /x,y from (\d+) to (\d+)/;
const EQUATIONS_PATTERN = /It satisfies (.+?)(?=\.(?:\s|$))/;
const EXTRA_PATTERN = /It also satisfies (.+?)(?=\.(?:\s|$))/;

/** The coefficients (a, b) of `a*x + b*y` and the constant of one side of a constraint. */
function linearForm(text) {
  const terms = text.replace(/\s+/g, '').match(/[+-]?[^+-]+/g) ?? [];
  let a = 0;
  let b = 0;
  let constant = 0;
  for (const term of terms) {
    const match = /^([+-]?)(\d*)([xy]?)$/.exec(term);
    if (match === null || (match[2] === '' && match[3] === '')) {
      throw new Error(`the term "${term}" is not a coordinate term`);
    }
    const sign = match[1] === '-' ? -1 : 1;
    const magnitude = match[2] === '' ? 1 : Number(match[2]);
    if (match[3] === 'x') {
      a += sign * magnitude;
    } else if (match[3] === 'y') {
      b += sign * magnitude;
    } else {
      constant += sign * magnitude;
    }
  }
  return { a, b, constant };
}

/** One stated constraint as `a*x + b*y <op> value`, the shape the solver evaluates. */
function parseConstraint(text) {
  const normalized = text.replace(/−/g, '-').replace(/≥/g, '>=').replace(/≤/g, '<=').trim();
  const split = /^(.+?)(>=|<=|=)(.+)$/.exec(normalized);
  if (split === null) {
    throw new Error(`the constraint "${text}" states no comparison`);
  }
  const left = linearForm(split[1]);
  const right = linearForm(split[3]);
  const a = left.a - right.a;
  const b = left.b - right.b;
  if (a === 0 && b === 0) {
    throw new Error(`the constraint "${text}" names no coordinate`);
  }
  return { a, b, op: split[2], value: right.constant - left.constant };
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const grid = GRID_PATTERN.exec(facts);
  if (grid === null) {
    throw new Error('the statement states no integer grid bound');
  }
  const equations = EQUATIONS_PATTERN.exec(facts);
  if (equations === null) {
    throw new Error('the statement states no coordinate constraint');
  }
  const extra = EXTRA_PATTERN.exec(facts);
  const stated = [...equations[1].split(' and '), ...(extra === null ? [] : [extra[1]])];
  const constraints = stated.map((text) => parseConstraint(text));
  if (constraints.length < 2) {
    throw new Error('the statement states fewer than two simultaneous constraints');
  }
  return {
    gridMin: Number(grid[1]),
    gridMax: Number(grid[2]),
    constraints,
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function holds(constraint, x, y) {
  const left = constraint.a * x + constraint.b * y;
  if (constraint.op === '=') {
    return left === constraint.value;
  }
  if (constraint.op === '>=') {
    return left >= constraint.value;
  }
  if (constraint.op === '<=') {
    return left <= constraint.value;
  }
  throw new Error(`unknown constraint operator "${constraint.op}"`);
}

function solve(slots) {
  if (!Number.isInteger(slots.gridMax) || slots.gridMax < slots.gridMin) {
    throw new Error('the stated integer grid bound is not a valid range');
  }
  const candidates = [];
  for (let x = slots.gridMin; x <= slots.gridMax; x += 1) {
    for (let y = slots.gridMin; y <= slots.gridMax; y += 1) {
      if (slots.constraints.every((constraint) => holds(constraint, x, y))) {
        candidates.push([x, y]);
      }
    }
  }
  if (candidates.length === 0) {
    throw new Error('the stated constraints admit no point of the integer grid');
  }
  return { candidates, unique: candidates.length === 1, crossDomain: slots.crossDomain };
}

function render(solution) {
  const listed = solution.candidates.map(([x, y]) => `(${x}, ${y})`).join(', ');
  const main = `P=${listed}; the solution is ${solution.unique ? 'unique' : 'not unique'}.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Array.isArray(slots.constraints) && slots.constraints.length >= 2, "the statement must state at least two simultaneous constraints");',
  'probe(Number.isInteger(slots.gridMax) && Number.isInteger(slots.gridMin) && slots.gridMax >= slots.gridMin, "the statement must state a valid integer grid range");',
  'probe(slots.constraints.every((constraint) => ["=", ">=", "<="].includes(constraint.op)), "every stated constraint must use a known comparison");',
  'const candidates = [];',
  'for (let x = slots.gridMin; x <= slots.gridMax; x += 1) {',
  '  for (let y = slots.gridMin; y <= slots.gridMax; y += 1) {',
  '    const satisfied = slots.constraints.every((constraint) => {',
  '      const left = constraint.a * x + constraint.b * y;',
  '      return constraint.op === "=" ? left === constraint.value : constraint.op === ">=" ? left >= constraint.value : left <= constraint.value;',
  '    });',
  '    if (satisfied) {',
  '      candidates.push("(" + x + ", " + y + ")");',
  '    }',
  '  }',
  '}',
  'probe(candidates.length > 0, "the stated constraints must admit at least one point of the integer grid");',
  'const main = "P=" + candidates.join(", ") + "; the solution is " + (candidates.length === 1 ? "unique" : "not unique") + ".";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const listed = solution.candidates.map(([x, y]) => `(${x}, ${y})`).join(', ');
  return [
    `P must be a whole-number grid point between ${slots.gridMin} and ${slots.gridMax} in both coordinates, and every stated constraint has to hold at the same time.`,
    `Testing the grid points against the ${slots.constraints.length} stated constraints leaves ${solution.candidates.length === 1 ? 'a single point' : `${solution.candidates.length} points`}: ${listed}.`,
    solution.unique
      ? 'Only one grid point satisfies all the clues together, so the location is uniquely determined.'
      : 'More than one grid point satisfies all the clues together, so the clues do not pin down a unique location.'
  ];
}

function caseFor(grade) {
  return {
    template: `Coordinates and constraint-based location (grade ${grade})`,
    type: `coordinates-and-constraint-based-location-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N2';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
