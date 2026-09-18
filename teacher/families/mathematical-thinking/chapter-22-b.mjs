/**
 * Families for chapter 22 of the mathematical seed book: maps, orientation,
 * and spatial relationships.
 *
 * Part B of the chapter: the case list continues from `chapter-22.mjs`. The
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
    template: 'Minimum detour around a blockage',
    type: 'minimum-detour-around-a-blockage',
    category: 'no-knowledge',
    parse(statement) {
      const target = statement.match(/target (\d+) squares? east/);
      const blocked = statement.match(/exactly (\d+) steps? east is blocked/);
      if (target === null || blocked === null) throw new Error('the target or the blockage is missing');
      return { target: Number(target[1]), blocked: Number(blocked[1]) };
    },
    solve(slots) {
      if (slots.blocked >= slots.target) throw new Error('the blocked square prevents reaching the target');
      return { steps: slots.target + (slots.blocked >= 1 ? 2 : 0) };
    },
    render(solution) {
      return `${solution.steps} steps.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.blocked >= slots.target) throw new Error("the blocked square prevents reaching the target");',
      'const steps = slots.target + (slots.blocked >= 1 ? 2 : 0);',
      'return steps + " steps.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The direct route of ${slots.target} steps passes through the blocked square, so it cannot be used.`,
        `Leaving the row before the blockage and returning to it after costs two extra steps, giving a minimum of ${solution.steps} steps.`
      ];
    }
  },
{
    template: 'Reflecting a route in a vertical mirror',
    type: 'reflecting-a-route-in-a-vertical-mirror',
    category: 'no-knowledge',
    parse(statement) {
      const route = statement.match(/A route is ([A-Z,]+)\./);
      if (route === null) throw new Error('the route is missing');
      return { route: route[1].split(',').map((move) => move.trim()) };
    },
    solve(slots) {
      return { route: slots.route.map((move) => (move === 'E' ? 'W' : move === 'W' ? 'E' : move)) };
    },
    render(solution) {
      return `${solution.route.join(',')}.`;
    },
    compute: [
      'const slots = $slots;',
      'const route = slots.route.map((move) => (move === "E" ? "W" : move === "W" ? "E" : move));',
      'return route.join(",") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A vertical mirror reverses left and right, so every east move becomes a west move and every west move becomes an east move.',
        'North and south are unaffected, so only the east-west letters of the route change.',
        `Applying the swap to each leg gives ${solution.route.join(',')}.`
      ];
    }
  },
{
    template: 'Rotating an arrow by a quarter-turn',
    type: 'rotating-an-arrow-by-a-quarter-turn',
    category: 'no-knowledge',
    parse(statement) {
      const initial = statement.match(/arrow points (\w+)/);
      const cycle = statement.match(/cycle ([a-z]+(?:→[a-z]+)+)/);
      const turns = statement.match(/after (\w+) such turns?/);
      if (initial === null || cycle === null || turns === null) throw new Error('the direction, cycle, or turn count are missing');
      const directions = cycle[1].split('→');
      return { initial: initial[1], cycle: directions.slice(0, directions.length - 1), turns: count(turns[1]) };
    },
    solve(slots) {
      const index = slots.cycle.indexOf(slots.initial);
      if (index === -1) throw new Error('the starting direction is not in the cycle');
      return { direction: slots.cycle[(index + slots.turns) % slots.cycle.length] };
    },
    render(solution) {
      return `${cap(solution.direction)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const index = slots.cycle.indexOf(slots.initial);',
      'if (index === -1) { throw new Error("the starting direction is not in the cycle"); }',
      'const word = slots.cycle[(index + slots.turns) % slots.cycle.length];',
      'return word.charAt(0).toUpperCase() + word.slice(1) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The stated cycle fixes where one quarter-turn sends each direction: ${slots.cycle.join('→')}.`,
        `Starting at ${slots.initial} and advancing ${slots.turns} place(s) in the cycle gives ${solution.direction}.`
      ];
    }
  },
{
    template: 'Composing two rotations',
    type: 'composing-two-rotations',
    category: 'no-knowledge',
    parse(statement) {
      const initial = statement.match(/faces (\w+)/);
      const cycle = statement.match(/cycle is ([NSEW](?:→[NSEW])+)/);
      const turns = statement.match(/turns left by 90° (\w+)/);
      if (initial === null || cycle === null || turns === null) throw new Error('the direction, cycle, or turn count are missing');
      const letters = cycle[1].split('→').map((letter) => LETTER[letter]);
      return { initial: initial[1], cycle: letters.slice(0, letters.length - 1), turns: count(turns[1]) };
    },
    solve(slots) {
      const index = slots.cycle.indexOf(slots.initial);
      if (index === -1) throw new Error('the starting direction is not in the cycle');
      return { direction: slots.cycle[(index + slots.turns) % slots.cycle.length] };
    },
    render(solution) {
      return `${cap(solution.direction)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const index = slots.cycle.indexOf(slots.initial);',
      'if (index === -1) { throw new Error("the starting direction is not in the cycle"); }',
      'const word = slots.cycle[(index + slots.turns) % slots.cycle.length];',
      'return word.charAt(0).toUpperCase() + word.slice(1) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A left turn and a right turn are opposites, so a left-turn cycle runs the cardinal directions in the reverse order of a right-turn cycle.',
        `Following the stated cycle from ${slots.initial} for ${slots.turns} left turn(s) lands on ${solution.direction}.`
      ];
    }
  },
{
    template: 'An ambiguous map instruction',
    type: 'an-ambiguous-map-instruction',
    category: 'no-knowledge',
    parse(statement) {
      const facingKnown = /faces? (north|south|east|west)/.test(statement) || /\bfacing (north|south|east|west)\b/.test(statement);
      const relativeInstruction = /to the (right|left)|(?:go|turn) (forward|back)/i.test(statement);
      return { facingKnown, relativeInstruction };
    },
    solve(slots) {
      return { unique: slots.facingKnown || !slots.relativeInstruction };
    },
    render(solution) {
      return solution.unique ? 'Yes; the note fixes a unique destination.' : 'No; the starting orientation is missing.';
    },
    compute: [
      'const slots = $slots;',
      'const unique = slots.facingKnown || !slots.relativeInstruction;',
      'return unique ? "Yes; the note fixes a unique destination." : "No; the starting orientation is missing.";'
    ].join('\n'),
    explain(slots) {
      return [
        'A relative instruction such as "to the right" is interpreted using the traveler\'s facing direction, so it only names a destination once that direction is fixed.',
        'The note never states the starting orientation, so different orientations send the traveler to different places.',
        'Because the outcome depends on a state that is missing, the note does not determine a unique destination.'
      ];
    }
  },
{
    template: 'Map legend and route length',
    type: 'map-legend-and-route-length',
    category: 'no-knowledge',
    parse(statement) {
      const scale = statement.match(/1 grid square represents (\d+) m/);
      const moves = parseSteps(statement);
      if (scale === null || moves.length === 0) throw new Error('the scale or the route are missing');
      return { scale: Number(scale[1]), moves };
    },
    solve(slots) {
      const squares = slots.moves.reduce((sum, move) => sum + move.count, 0);
      return { length: squares * slots.scale };
    },
    render(solution) {
      return `${solution.length} m.`;
    },
    compute: [
      'const slots = $slots;',
      'let squares = 0;',
      'for (const move of slots.moves) squares += move.count;',
      'return (squares * slots.scale) + " m.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The legend converts each drawn square to ${slots.scale} m, so the route length is the number of drawn squares multiplied by that scale.`,
        `The route covers ${slots.moves.reduce((sum, move) => sum + move.count, 0)} squares, giving ${solution.length} m.`
      ];
    }
  },
{
    template: 'Adjacency on a grid',
    type: 'adjacency-on-a-grid',
    category: 'no-knowledge',
    parse(statement) {
      const cell = statement.match(/For cell \((\d+),(\d+)\)/);
      const tail = statement.slice(statement.indexOf('adjacent:'));
      const candidates = [...tail.matchAll(/\((\d+),(\d+)\)/g)].map((match) => ({ row: Number(match[1]), column: Number(match[2]) }));
      if (cell === null || candidates.length === 0) throw new Error('the cell or the candidates are missing');
      return { cell: { row: Number(cell[1]), column: Number(cell[2]) }, candidates };
    },
    solve(slots) {
      const { row, column } = slots.cell;
      return { adjacent: slots.candidates.filter((candidate) => Math.abs(candidate.row - row) + Math.abs(candidate.column - column) === 1) };
    },
    render(solution) {
      return `${joinList(solution.adjacent.map((cell) => `(${cell.row},${cell.column})`))}.`;
    },
    compute: [
      'const slots = $slots;',
      'const row = slots.cell.row; const column = slots.cell.column;',
      'const adjacent = slots.candidates.filter((c) => Math.abs(c.row - row) + Math.abs(c.column - column) === 1);',
      'const labels = adjacent.map((c) => "(" + c.row + "," + c.column + ")");',
      'if (labels.length <= 1) return labels.join("") + ".";',
      'return labels.slice(0, -1).join(", ") + " and " + labels[labels.length - 1] + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        'Cells share a side exactly when their row and column differ by one in one coordinate and agree in the other, which is the same as a coordinate gap of one in total.',
        'Testing each candidate against the subject cell keeps only the side-sharing neighbours and rejects corner-touching cells.'
      ];
    }
  },
{
    template: 'A cell halfway between two landmarks',
    type: 'a-cell-halfway-between-two-landmarks',
    category: 'no-knowledge',
    parse(statement) {
      const columns = statement.match(/A is in column (\d+) and C in column (\d+)/);
      if (columns === null) throw new Error('the two columns are missing');
      return { left: Number(columns[1]), right: Number(columns[2]) };
    },
    solve(slots) {
      const sum = slots.left + slots.right;
      if (sum % 2 !== 0) throw new Error('the halfway column is not a whole column');
      return { column: sum / 2 };
    },
    render(solution) {
      return `Column ${solution.column}.`;
    },
    compute: [
      'const slots = $slots;',
      'if ((slots.left + slots.right) % 2 !== 0) { throw new Error("the halfway column is not a whole column"); }',
      'return "Column " + ((slots.left + slots.right) / 2) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Being equally far from both landmarks means the two distances to the ends must be equal, so the middle column is their average.',
        `Averaging columns ${slots.left} and ${slots.right} gives column ${solution.column}.`
      ];
    }
  },
{
    template: 'A required intermediate landmark',
    type: 'a-required-intermediate-landmark',
    category: 'no-knowledge',
    parse(statement) {
      const start = statement.match(/the start is \((\d+),(\d+)\)/);
      const library = statement.match(/the library is \((\d+),(\d+)\)/);
      const target = statement.match(/the target is \((\d+),(\d+)\)/);
      if (start === null || library === null || target === null) throw new Error('the start, library, or target are missing');
      return {
        start: { row: Number(start[1]), column: Number(start[2]) },
        library: { row: Number(library[1]), column: Number(library[2]) },
        target: { row: Number(target[1]), column: Number(target[2]) }
      };
    },
    solve(slots) {
      return { steps: manhattan(slots.start, slots.library) + manhattan(slots.library, slots.target) };
    },
    render(solution) {
      return `${solution.steps} steps.`;
    },
    compute: [
      'const slots = $slots;',
      'const distance = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.column - b.column);',
      'return (distance(slots.start, slots.library) + distance(slots.library, slots.target)) + " steps.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'With only horizontal and vertical steps, the shortest path between two cells is the sum of the row gap and the column gap.',
        `Going start→library costs ${manhattan(slots.start, slots.library)} steps and library→target costs ${manhattan(slots.library, slots.target)} steps, for a total of ${solution.steps}.`
      ];
    }
  },
{
    template: 'Points in the same column',
    type: 'points-in-the-same-column',
    category: 'no-knowledge',
    parse(statement) {
      const points = [...statement.matchAll(/([A-Z])=\((\d+),(\d+)\)/g)].map((match) => ({
        name: match[1],
        row: Number(match[2]),
        column: Number(match[3])
      }));
      if (points.length < 3) throw new Error('the points are missing');
      return { points };
    },
    solve(slots) {
      let pair = null;
      for (let i = 0; i < slots.points.length; i += 1) {
        for (let j = i + 1; j < slots.points.length; j += 1) {
          if (slots.points[i].column === slots.points[j].column) pair = [slots.points[i], slots.points[j]];
        }
      }
      if (pair === null) throw new Error('no two points share a column');
      return { pair };
    },
    render(solution) {
      return `${solution.pair[0].name} and ${solution.pair[1].name}.`;
    },
    compute: [
      'const slots = $slots;',
      'for (let i = 0; i < slots.points.length; i += 1) {',
      '  for (let j = i + 1; j < slots.points.length; j += 1) {',
      '    if (slots.points[i].column === slots.points[j].column) {',
      '      return slots.points[i].name + " and " + slots.points[j].name + ".";',
      '    }',
      '  }',
      '}',
      'throw new Error("no two points share a column");'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A column is fixed by the second coordinate, so two points share a column exactly when their second coordinates are equal.',
        `Comparing the second coordinates leaves only ${solution.pair[0].name} and ${solution.pair[1].name}, which both lie in column ${solution.pair[0].column}.`
      ];
    }
  }
];
