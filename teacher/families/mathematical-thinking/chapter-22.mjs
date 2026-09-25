/**
 * Families for chapter 22 of the mathematical seed book: maps, orientation,
 * and spatial relationships.
 *
 * A family covers one printed template. It provides the reference parse that
 * compiles the statement into the slots literal, an independent computation,
 * the answer text the source prints, the JS computation body the answer wire
 * executes, and the explanation lines of the example. Every problem of the
 * chapter states the convention it needs (turn cycles, coordinate axes, mirror
 * rules, map scale), so every family is `no-knowledge`.
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
    template: 'Left and right after a turn',
    type: 'left-and-right-after-a-turn',
    category: 'no-knowledge',
    parse(statement) {
      const initial = statement.match(/facing (\w+)/);
      const turn = statement.match(/makes (\w+) (right|left) turns/);
      if (initial === null || turn === null) throw new Error('the facing direction or the turn is missing');
      return { initial: initial[1], turn: turn[2], count: count(turn[1]) };
    },
    solve(slots) {
      const step = slots.turn === 'right' ? 1 : -1;
      const index = (CARDINAL.indexOf(slots.initial) + step * slots.count + 8) % 4;
      return { direction: CARDINAL[index] };
    },
    render(solution) {
      return `${cap(solution.direction)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const cycle = ["north", "east", "south", "west"];',
      'const step = slots.turn === "right" ? 1 : -1;',
      'const index = (cycle.indexOf(slots.initial) + step * slots.count + 8) % 4;',
      'const word = cycle[index];',
      'return word.charAt(0).toUpperCase() + word.slice(1) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The text fixes the turn cycle north→east→south→west→north, so one right turn moves one place forward in that cycle.`,
        `Starting from ${slots.initial} and taking ${slots.count} right turn(s) steps forward ${slots.count} place(s), landing on ${solution.direction}.`
      ];
    }
  },
{
    template: 'A route described by cardinal steps',
    type: 'a-route-described-by-cardinal-steps',
    category: 'no-knowledge',
    parse(statement) {
      const start = statement.match(/Starting at ([A-Z])/);
      const walk = statement.match(/\bwalks\b(.*)$/s);
      if (start === null || walk === null) throw new Error('the start or the walk is missing');
      return { place: start[1], moves: parseSteps(walk[1]) };
    },
    solve(slots) {
      const dx = slots.moves.reduce((sum, move) => sum + (move.direction === 'east' ? move.count : move.direction === 'west' ? -move.count : 0), 0);
      const dy = slots.moves.reduce((sum, move) => sum + (move.direction === 'north' ? move.count : move.direction === 'south' ? -move.count : 0), 0);
      return { place: slots.place, dx, dy };
    },
    render(solution) {
      return `${describe(solution.dx, solution.dy)} of ${solution.place}.`;
    },
    compute: [
      'const slots = $slots;',
      'let dx = 0; let dy = 0;',
      'for (const move of slots.moves) {',
      '  if (move.direction === "east") dx += move.count;',
      '  else if (move.direction === "west") dx -= move.count;',
      '  else if (move.direction === "north") dy += move.count;',
      '  else if (move.direction === "south") dy -= move.count;',
      '}',
      'const pieces = [];',
      'if (dx !== 0) pieces.push(Math.abs(dx) + " squares " + (dx > 0 ? "east" : "west"));',
      'if (dy !== 0) pieces.push(Math.abs(dy) + " squares " + (dy > 0 ? "north" : "south"));',
      'return pieces.join(" and ") + " of " + slots.place + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each instruction changes one coordinate: east and west move the column, north and south move the row.`,
        `Summing the displacements separately gives ${solution.dx} square(s) east-west and ${solution.dy} square(s) north-south.`,
        `Combining the two components places the child ${describe(solution.dx, solution.dy)} of ${solution.place}.`
      ];
    }
  },
{
    template: 'Returning along exactly the same route',
    type: 'returning-along-exactly-the-same-route',
    category: 'no-knowledge',
    parse(statement) {
      const walk = statement.match(/\bwalks\b(.*?)\./s);
      if (walk === null) throw new Error('the walk is missing');
      const moves = parseSteps(walk[1]);
      if (moves.length === 0) throw new Error('no steps found');
      return { moves };
    },
    solve(slots) {
      return { moves: [...slots.moves].reverse().map((move) => ({ count: move.count, direction: OPPOSITE[move.direction] })) };
    },
    render(solution) {
      return `${solution.moves.map((move, index) => `${move.count}${index === 0 ? ' steps' : ''} ${move.direction}`).join(', ')}.`;
    },
    compute: [
      'const slots = $slots;',
      'const opposite = { north: "south", south: "north", east: "west", west: "east" };',
      'const moves = slots.moves.slice().reverse();',
      'const parts = moves.map((move, index) => move.count + (index === 0 ? " steps" : "") + " " + opposite[move.direction]);',
      'return parts.join(", ") + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        'To retrace a route exactly, the walker must undo the last move first and walk its opposite: reversing the list and swapping east↔west and north↔south.',
        `The return list therefore starts with the opposite of the last leg (${slots.moves[slots.moves.length - 1].direction}) and ends with the opposite of the first leg (${slots.moves[0].direction}).`
      ];
    }
  },
{
    template: 'Relative position from two relations',
    type: 'relative-position-from-two-relations',
    category: 'no-knowledge',
    parse(statement) {
      const relations = [...statement.matchAll(/The (\w+) is (east|west|north|south) of the (\w+)/g)].map((match) => ({
        subject: match[1],
        direction: match[2],
        reference: match[3]
      }));
      const query = statement.match(/Where is the (\w+) relative to the (\w+)\?/);
      if (relations.length === 0 || query === null) throw new Error('the relations or the query are missing');
      return { relations, subject: query[1], reference: query[2] };
    },
    solve(slots) {
      const names = new Set();
      for (const relation of slots.relations) {
        names.add(relation.subject);
        names.add(relation.reference);
      }
      const east = new Map([...names].map((name) => [name, new Set()]));
      const north = new Map([...names].map((name) => [name, new Set()]));
      for (const relation of slots.relations) {
        const alongEast = relation.direction === 'east' || relation.direction === 'west';
        const forward = relation.direction === 'east' || relation.direction === 'north';
        const map = alongEast ? east : north;
        const [greater, lesser] = forward ? [relation.subject, relation.reference] : [relation.reference, relation.subject];
        map.get(greater).add(lesser);
      }
      for (const map of [east, north]) {
        let changed = true;
        while (changed) {
          changed = false;
          for (const name of names) {
            for (const middle of [...map.get(name)]) {
              for (const further of map.get(middle)) {
                if (!map.get(name).has(further)) {
                  map.get(name).add(further);
                  changed = true;
                }
              }
            }
          }
        }
      }
      const { subject, reference } = slots;
      if (east.get(subject).has(reference)) return { direction: 'east', reference };
      if (east.get(reference).has(subject)) return { direction: 'west', reference };
      if (north.get(subject).has(reference)) return { direction: 'north', reference };
      if (north.get(reference).has(subject)) return { direction: 'south', reference };
      throw new Error('the relations do not determine the relative position');
    },
    render(solution) {
      return `${cap(solution.direction)} of the ${solution.reference}.`;
    },
    wires: [
      {
        name: 'position',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          'const names = new Set();',
          'for (const r of slots.relations) { names.add(r.subject); names.add(r.reference); }',
          'const east = {}; const north = {};',
          'for (const n of names) { east[n] = new Set(); north[n] = new Set(); }',
          'for (const r of slots.relations) {',
          '  const alongEast = r.direction === "east" || r.direction === "west";',
          '  const forward = r.direction === "east" || r.direction === "north";',
          '  const map = alongEast ? east : north;',
          '  const greater = forward ? r.subject : r.reference;',
          '  const lesser = forward ? r.reference : r.subject;',
          '  map[greater].add(lesser);',
          '}',
          'for (const n of names) {',
          '  for (const map of [east, north]) {',
          '    const stack = [...map[n]];',
          '    while (stack.length) {',
          '      const middle = stack.pop();',
          '      for (const further of map[middle]) {',
          '        if (!map[n].has(further)) { map[n].add(further); stack.push(further); }',
          '      }',
          '    }',
          '  }',
          '}',
          'const s = slots.subject; const t = slots.reference;',
          'if (east[s].has(t)) return "east";',
          'if (east[t].has(s)) return "west";',
          'if (north[s].has(t)) return "north";',
          'if (north[t].has(s)) return "south";',
          'throw new Error("the relations do not determine the relative position");'
        ].join('\n')
      }
    ],
    compute: [
      'return $position.charAt(0).toUpperCase() + $position.slice(1) + " of the " + $slots.reference + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Each relation aligns two places on one axis, so "east of" and "west of" become one directed inequality along the east-west axis.',
        'Chaining the relations transitively links the asked subject to its reference without any diagram.',
        `The chain places ${slots.subject} ${solution.direction} of ${solution.reference}.`
      ];
    }
  },
{
    template: 'The opposite corner of a rectangle on a grid',
    type: 'the-opposite-corner-of-a-rectangle-on-a-grid',
    category: 'no-knowledge',
    parse(statement) {
      const corner = statement.match(/top-left corner of a rectangle is at \(row (\d+), column (\d+)\)/);
      const height = statement.match(/(\d+) squares high/);
      const width = statement.match(/(\d+) squares wide/);
      if (corner === null || height === null || width === null) throw new Error('the corner or the size is missing');
      return { row: Number(corner[1]), column: Number(corner[2]), height: Number(height[1]), width: Number(width[1]) };
    },
    solve(slots) {
      return { row: slots.row + slots.height, column: slots.column + slots.width };
    },
    render(solution) {
      return `(row ${solution.row}, column ${solution.column}).`;
    },
    compute: [
      'const slots = $slots;',
      'return "(row " + (slots.row + slots.height) + ", column " + (slots.column + slots.width) + ").";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Rows are numbered downward, so moving down from row ${slots.row} by the rectangle height reaches row ${solution.row}; columns grow to the right, so moving across by the width reaches column ${solution.column}.`,
        `The bottom-right corner therefore sits at (row ${solution.row}, column ${solution.column}).`
      ];
    }
  },
{
    template: 'An obstacle makes a route impossible',
    type: 'an-obstacle-makes-a-route-impossible',
    category: 'no-knowledge',
    parse(statement) {
      const start = statement.match(/starts at \((\d+),(\d+)\)/);
      const instructions = statement.match(/instructions are ([A-Z,]+)\./);
      const blocked = statement.match(/Cell \((\d+),(\d+)\) is blocked/);
      if (start === null || instructions === null || blocked === null) throw new Error('the start, instructions, or blocked cell are missing');
      return {
        row: Number(start[1]),
        column: Number(start[2]),
        moves: instructions[1].split(',').map((move) => move.trim()),
        blocked: { row: Number(blocked[1]), column: Number(blocked[2]) }
      };
    },
    solve(slots) {
      let { row, column } = slots;
      for (const move of slots.moves) {
        if (move === 'E') column += 1;
        else if (move === 'W') column -= 1;
        else if (move === 'N') row += 1;
        else if (move === 'S') row -= 1;
        if (row === slots.blocked.row && column === slots.blocked.column) return { possible: false };
      }
      return { possible: true };
    },
    render(solution) {
      return solution.possible ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'let row = slots.row; let column = slots.column;',
      'for (const move of slots.moves) {',
      '  if (move === "E") column += 1;',
      '  else if (move === "W") column -= 1;',
      '  else if (move === "N") row += 1;',
      '  else if (move === "S") row -= 1;',
      '  if (row === slots.blocked.row && column === slots.blocked.column) return "No.";',
      '}',
      'return "Yes.";'
    ].join('\n'),
    explain(slots) {
      return [
        'Walking the instruction letters one at a time and updating the row for north/south and the column for east/west gives every cell the robot visits.',
        `The second east move enters (${slots.blocked.row},${slots.blocked.column}), which is blocked, so the robot cannot finish the sequence.`
      ];
    }
  },
{
    template: 'Two different routes, the same destination',
    type: 'two-different-routes-the-same-destination',
    category: 'no-knowledge',
    parse(statement) {
      const routeA = statement.match(/Route A is ([A-Z,]+)\./);
      const routeB = statement.match(/Route B is ([A-Z,]+)\./);
      if (routeA === null || routeB === null) throw new Error('the routes are missing');
      return {
        routeA: routeA[1].split(',').map((move) => move.trim()),
        routeB: routeB[1].split(',').map((move) => move.trim())
      };
    },
    solve(slots) {
      const a = displacement(slots.routeA);
      const b = displacement(slots.routeB);
      return { same: a.dx === b.dx && a.dy === b.dy, dx: a.dx, dy: a.dy, backup: b };
    },
    render(solution) {
      if (!solution.same) {
        return `No; one route ends ${describe(solution.dx, solution.dy)} of the start and the other ${describe(solution.backup.dx, solution.backup.dy)} of the start.`;
      }
      return `Yes; both end ${describe(solution.dx, solution.dy)} of the start.`;
    },
    wires: [
      {
        name: 'route',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          'const walk = (moves) => {',
          '  const d = { dx: 0, dy: 0 };',
          '  for (const move of moves) {',
          '    if (move === "E") d.dx += 1; else if (move === "W") d.dx -= 1;',
          '    else if (move === "N") d.dy += 1; else if (move === "S") d.dy -= 1;',
          '  }',
          '  return d;',
          '};',
          'return { a: walk(slots.routeA), b: walk(slots.routeB) };'
        ].join('\n')
      }
    ],
    compute: [
      'const show = (d) => {',
      '  const pieces = [];',
      '  if (d.dx !== 0) pieces.push(Math.abs(d.dx) + " squares " + (d.dx > 0 ? "east" : "west"));',
      '  if (d.dy !== 0) pieces.push(Math.abs(d.dy) + " squares " + (d.dy > 0 ? "north" : "south"));',
      '  return pieces.join(" and ");',
      '};',
      'if ($route.a.dx === $route.b.dx && $route.a.dy === $route.b.dy) return "Yes; both end " + show($route.a) + " of the start.";',
      'return "No; one route ends " + show($route.a) + " of the start and the other " + show($route.b) + " of the start.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Order of moves does not matter for the final square: each letter changes the row or the column by one, independent of the others.',
        `Both routes use the same counts of N and E letters, so each ends ${describe(solution.dx, solution.dy)} of the start.`
      ];
    }
  },
{
    template: 'Distance along grid streets',
    type: 'distance-along-grid-streets',
    category: 'no-knowledge',
    parse(statement) {
      const moves = parseSteps(statement);
      if (moves.length === 0) throw new Error('the block distances are missing');
      return { moves };
    },
    solve(slots) {
      const dx = slots.moves.reduce((sum, move) => sum + (move.direction === 'east' ? move.count : move.direction === 'west' ? -move.count : 0), 0);
      const dy = slots.moves.reduce((sum, move) => sum + (move.direction === 'north' ? move.count : move.direction === 'south' ? -move.count : 0), 0);
      return { segments: Math.abs(dx) + Math.abs(dy) };
    },
    render(solution) {
      return `${solution.segments} unit street segments.`;
    },
    compute: [
      'const slots = $slots;',
      'let dx = 0; let dy = 0;',
      'for (const move of slots.moves) {',
      '  if (move.direction === "east") dx += move.count;',
      '  else if (move.direction === "west") dx -= move.count;',
      '  else if (move.direction === "north") dy += move.count;',
      '  else if (move.direction === "south") dy -= move.count;',
      '}',
      'return (Math.abs(dx) + Math.abs(dy)) + " unit street segments.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'With streets only east-west and north-south, every route must cover each east-west block and each north-south block at least once.',
        `Adding the two independent distances gives the minimum of ${solution.segments} unit street segments.`
      ];
    }
  }
];
