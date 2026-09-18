/**
 * Families for chapter 22 of the mathematical seed book: maps, orientation,
 * and spatial relationships.
 *
 * Part C of the chapter: the case list continues from `chapter-22.mjs`. The
 * module repeats the chapter number and the shared helpers so every part loads
 * on its own.
 */

export const unit = 22;

const CARDINAL = ['north', 'east', 'south', 'west'];
const OPPOSITE = { north: 'south', south: 'north', east: 'west', west: 'east' };
const LETTER = { N: 'north', E: 'east', S: 'south', W: 'west' };
const NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, twice: 2 };

const cap = (word) => word.charAt(0).toUpperCase() + word.slice(1);
const count = (word) => NUMBER_WORDS[word] ?? Number(word);
const manhattan = (left, right) => Math.abs(left.row - right.row) + Math.abs(left.column - right.column);

/** Steps written as "3 steps east", "2 blocks north", or "4 squares south". */
function parseSteps(text) {
  return [...text.matchAll(/(\d+)\s+(?:(?:steps?|blocks?|squares?)\s+)?(east|west|north|south)/g)].map((match) => ({
    count: Number(match[1]),
    direction: match[2]
  }));
}

function displacement(moves) {
  let dx = 0;
  let dy = 0;
  for (const move of moves) {
    if (move === 'E') dx += 1;
    else if (move === 'W') dx -= 1;
    else if (move === 'N') dy += 1;
    else if (move === 'S') dy -= 1;
  }
  return { dx, dy };
}

function describe(dx, dy) {
  const pieces = [];
  if (dx !== 0) pieces.push(`${Math.abs(dx)} squares ${dx > 0 ? 'east' : 'west'}`);
  if (dy !== 0) pieces.push(`${Math.abs(dy)} squares ${dy > 0 ? 'north' : 'south'}`);
  return pieces.join(' and ');
}

function joinList(items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

export const cases = [
{
    template: 'The smallest bounding region',
    type: 'the-smallest-bounding-region',
    category: 'no-knowledge',
    parse(statement) {
      const points = [...statement.matchAll(/\((\d+),(\d+)\)/g)].map((match) => ({ row: Number(match[1]), column: Number(match[2]) }));
      if (points.length < 2) throw new Error('the object cells are missing');
      return { points };
    },
    solve(slots) {
      const rows = slots.points.map((point) => point.row);
      const columns = slots.points.map((point) => point.column);
      return { rows: [Math.min(...rows), Math.max(...rows)], columns: [Math.min(...columns), Math.max(...columns)] };
    },
    render(solution) {
      return `Rows ${solution.rows[0]}\u2013${solution.rows[1]} and columns ${solution.columns[0]}\u2013${solution.columns[1]}.`;
    },
    compute: [
      'const slots = $slots;',
      'const rows = slots.points.map((point) => point.row);',
      'const columns = slots.points.map((point) => point.column);',
      'return "Rows " + Math.min.apply(null, rows) + "\\u2013" + Math.max.apply(null, rows) +',
      '  " and columns " + Math.min.apply(null, columns) + "\\u2013" + Math.max.apply(null, columns) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'An axis-aligned rectangle containing all objects must span every row and every column that any object occupies.',
        `The smallest such rectangle reaches from the lowest object row to the highest and from the leftmost column to the rightmost.`
      ];
    }
  },
{
    template: 'A closed path',
    type: 'a-closed-path',
    category: 'no-knowledge',
    parse(statement) {
      const moves = statement.match(/moves ([NSEW,]+),/);
      if (moves === null) throw new Error('the moves are missing');
      return { moves: moves[1].split(',').map((move) => move.trim()) };
    },
    solve(slots) {
      const { dx, dy } = displacement(slots.moves);
      return { closed: dx === 0 && dy === 0 };
    },
    render(solution) {
      return solution.closed ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'let dx = 0; let dy = 0;',
      'for (const move of slots.moves) {',
      '  if (move === "E") dx += 1; else if (move === "W") dx -= 1;',
      '  else if (move === "N") dy += 1; else if (move === "S") dy -= 1;',
      '}',
      'return (dx === 0 && dy === 0) ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots) {
      return [
        'A path returns to its start when every east move is cancelled by a west move and every north move by a south move, so both displacements must be zero.',
        'Here the north and south moves cancel and the east and west moves cancel, so the robot is back at its starting square.'
      ];
    }
  },
{
    template: 'A path that is not closed despite four moves',
    type: 'a-path-that-is-not-closed-despite-four-moves',
    category: 'no-knowledge',
    parse(statement) {
      const moves = statement.match(/moves ([NSEW,]+),/);
      if (moves === null) throw new Error('the moves are missing');
      return { moves: moves[1].split(',').map((move) => move.trim()) };
    },
    solve(slots) {
      const { dx, dy } = displacement(slots.moves);
      return { closed: dx === 0 && dy === 0, dx, dy };
    },
    render(solution) {
      return solution.closed ? 'Yes.' : `No; it ends ${describe(solution.dx, solution.dy)} of the start.`;
    },
    compute: [
      'const slots = $slots;',
      'let dx = 0; let dy = 0;',
      'for (const move of slots.moves) {',
      '  if (move === "E") dx += 1; else if (move === "W") dx -= 1;',
      '  else if (move === "N") dy += 1; else if (move === "S") dy -= 1;',
      '}',
      'if (dx === 0 && dy === 0) return "Yes.";',
      'const pieces = [];',
      'if (dx !== 0) pieces.push(Math.abs(dx) + " squares " + (dx > 0 ? "east" : "west"));',
      'if (dy !== 0) pieces.push(Math.abs(dy) + " squares " + (dy > 0 ? "north" : "south"));',
      'return "No; it ends " + pieces.join(" and ") + " of the start.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The east and west moves cancel here, but two north moves and no south move leave a net displacement northward.',
        `The imbalance of the letters is why the path does not close: it ends ${describe(solution.dx, solution.dy)} of the start.`
      ];
    }
  },
{
    template: 'Ordering landmarks along a path',
    type: 'ordering-landmarks-along-a-path',
    category: 'no-knowledge',
    parse(statement) {
      const list = statement.match(/measured from the start: (.+?)\. In what order/s);
      if (list === null) throw new Error('the landmark list is missing');
      const landmarks = list[1].split(', ').map((entry) => {
        const [name, position] = entry.split('=');
        return { name, position: Number(position) };
      });
      if (landmarks.some((landmark) => !Number.isFinite(landmark.position))) throw new Error('a landmark position is missing');
      return { landmarks };
    },
    solve(slots) {
      return { order: [...slots.landmarks].sort((left, right) => left.position - right.position).map((landmark) => landmark.name) };
    },
    render(solution) {
      const text = solution.order.join(', ');
      return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const order = slots.landmarks.slice().sort((a, b) => a.position - b.position).map((landmark) => landmark.name);',
      'const text = order.join(", ");',
      'return text.charAt(0).toUpperCase() + text.slice(1) + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        'Walking away from the start means meeting landmarks in increasing order of their measured positions.',
        `The positions ${slots.landmarks.map((landmark) => `${landmark.name}=${landmark.position}`).join(', ')} sort into the order the walker meets them.`
      ];
    }
  },
{
    template: 'Distance between landmarks, not from the start',
    type: 'distance-between-landmarks-not-from-the-start',
    category: 'no-knowledge',
    parse(statement) {
      const positions = [...statement.matchAll(/at position (\d+)/g)].map((match) => Number(match[1]));
      if (positions.length !== 2) throw new Error('the two positions are missing');
      return { positions };
    },
    solve(slots) {
      return { distance: Math.abs(slots.positions[0] - slots.positions[1]) };
    },
    render(solution) {
      return `${solution.distance} units.`;
    },
    compute: [
      'const slots = $slots;',
      'return Math.abs(slots.positions[0] - slots.positions[1]) + " units.";'
    ].join('\n'),
    explain(slots) {
      return [
        'Both positions are measured in the same unit from the same origin, so the distance between the landmarks is the absolute difference of the two numbers.',
        `The difference between ${slots.positions[0]} and ${slots.positions[1]} is ${Math.abs(slots.positions[0] - slots.positions[1])} units.`
      ];
    }
  },
{
    template: 'Two instructions meet at the same point',
    type: 'two-instructions-meet-at-the-same-point',
    category: 'no-knowledge',
    parse(statement) {
      const a = statement.match(/A=\((\d+),(\d+)\)/);
      const c = statement.match(/C=\((\d+),(\d+)\)/);
      const b = statement.match(/Point B is (\d+) squares (east|west|north|south) of A/);
      const d = statement.match(/Point D is (\d+) squares (east|west|north|south) of B/);
      if (a === null || c === null || b === null || d === null) throw new Error('a point or an offset is missing');
      return {
        a: { row: Number(a[1]), column: Number(a[2]) },
        c: { row: Number(c[1]), column: Number(c[2]) },
        b: { count: Number(b[1]), direction: b[2] },
        d: { count: Number(d[1]), direction: d[2] }
      };
    },
    solve(slots) {
      const shift = (point, offset) => {
        const result = { row: point.row, column: point.column };
        if (offset.direction === 'north') result.row += offset.count;
        else if (offset.direction === 'south') result.row -= offset.count;
        else if (offset.direction === 'east') result.column += offset.count;
        else if (offset.direction === 'west') result.column -= offset.count;
        return result;
      };
      const b = shift(slots.a, slots.b);
      const d = shift(b, slots.d);
      return { c: slots.c, d, same: slots.c.row === d.row && slots.c.column === d.column };
    },
    render(solution) {
      if (!solution.same) {
        return `No; C=(${solution.c.row},${solution.c.column}) and D=(${solution.d.row},${solution.d.column}).`;
      }
      return `Yes; C=D=(${solution.c.row},${solution.c.column}).`;
    },
    compute: [
      'const slots = $slots;',
      'const shift = (point, offset) => {',
      '  const result = { row: point.row, column: point.column };',
      '  if (offset.direction === "north") result.row += offset.count;',
      '  else if (offset.direction === "south") result.row -= offset.count;',
      '  else if (offset.direction === "east") result.column += offset.count;',
      '  else if (offset.direction === "west") result.column -= offset.count;',
      '  return result;',
      '};',
      'const b = shift(slots.a, slots.b);',
      'const d = shift(b, slots.d);',
      'if (slots.c.row === d.row && slots.c.column === d.column) {',
      '  return "Yes; C=D=(" + slots.c.row + "," + slots.c.column + ").";',
      '}',
      'return "No; C=(" + slots.c.row + "," + slots.c.column + ") and D=(" + d.row + "," + d.column + ").";'
    ].join('\n'),
    explain(slots) {
      return [
        'Each offset updates one coordinate: north and south change the first coordinate, east and west change the second.',
        `From A=(2,2) a 3-square move east gives B, and from B a 3-square move north gives D.`,
        'Comparing the result with the explicitly given C shows whether the two descriptions name the same point.'
      ];
    }
  },
{
    template: 'The shortest instruction sequence',
    type: 'the-shortest-instruction-sequence',
    category: 'no-knowledge',
    parse(statement) {
      const target = statement.match(/target is (\d+) squares? east and (\d+) squares? north/);
      const asked = statement.match(/in only (\d+) steps/);
      if (target === null || asked === null) throw new Error('the target or the proposed length are missing');
      return { east: Number(target[1]), north: Number(target[2]), asked: Number(asked[1]) };
    },
    solve(slots) {
      return { minimum: Math.abs(slots.east) + Math.abs(slots.north), asked: slots.asked };
    },
    render(solution) {
      if (solution.asked >= solution.minimum) return `Yes; a route of ${solution.asked} steps reaches the target.`;
      return `No; the minimum is ${solution.minimum} steps.`;
    },
    compute: [
      'const slots = $slots;',
      'const minimum = Math.abs(slots.east) + Math.abs(slots.north);',
      'if (slots.asked >= minimum) return "Yes; a route of " + slots.asked + " steps reaches the target.";',
      'return "No; the minimum is " + minimum + " steps.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Without diagonal moves, every step changes exactly one coordinate by one, so reaching a target needs at least as many steps as the total east and north displacement.',
        `The target needs ${Math.abs(slots.east)} east steps and ${Math.abs(slots.north)} north steps, a minimum of ${solution.minimum}, which is more than ${slots.asked}.`
      ];
    }
  }
];
