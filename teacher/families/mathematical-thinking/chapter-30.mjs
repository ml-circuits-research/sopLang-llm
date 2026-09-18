/**
 * Families for chapter 30 of the mathematical seed book: symmetries,
 * transformations, and composing motions.
 *
 * This chapter titles every problem individually and prints each one once, so
 * every template has a single case. A statement that fixes the displacement,
 * the axis, or the rotation rule it uses is `no-knowledge`. When the solution
 * needs a property of a named transformation that the statement does not state
 * (a reflection keeps the distance to the axis, a rigid motion preserves
 * lengths, a quarter-turn swaps the axes, a whole turn is a full turn), the case
 * is `knowledge` and the circuit carries that fact on an explicit `literal`
 * wire that the computation reads as `$facts`.
 */

export const unit = 30;

const FULL_TURN_DEGREES = 360;
const QUARTER_TURN_DEGREES = 90;

const NUMBER_WORDS = new Map([
  ['once', 1], ['twice', 2], ['three', 3], ['four', 4], ['five', 5],
  ['six', 6], ['seven', 7], ['eight', 8], ['nine', 9], ['ten', 10]
]);

function expect(match, label) {
  if (match === null) {
    throw new Error(`the ${label} is missing`);
  }
  return match;
}

function countFromWord(text) {
  const value = NUMBER_WORDS.get(String(text).toLowerCase());
  if (value === undefined) {
    throw new Error(`the count "${text}" is not a number word`);
  }
  return value;
}

function signed(text) {
  return Number(String(text).replace('−', '-'));
}

function parseDisplacements(statement) {
  const displacements = [...statement.matchAll(/(\d+) units? (right|left)/g)]
    .map((match) => (match[2] === 'right' ? Number(match[1]) : -Number(match[1])));
  if (displacements.length === 0) {
    throw new Error('no displacements are described');
  }
  return { displacements };
}

const COMPUTE_DISPLACEMENT = [
  'const slots = $slots;',
  'const total = slots.displacements.reduce((sum, value) => sum + value, 0);',
  'return Math.abs(total) + " units to the " + (total >= 0 ? "right" : "left") + ".";'
].join('\n');

const COMPUTE_REFLECTION = [
  'const slots = $slots;',
  'const distance = slots.axis - slots.column;',
  'const image = $facts.reflectionPreservesDistanceFromAxis === true ? slots.axis + distance : slots.column;',
  'return "Column " + image + ".";'
].join('\n');

function knowledgeCase({ template, type, parse, solve, render, facts, compute, explain }) {
  return {
    template,
    type,
    category: 'knowledge',
    parse,
    solve,
    render,
    facts: JSON.stringify(facts),
    compute,
    explain
  };
}

export const cases = [
  {
    template: 'Translation by a vector on a grid',
    type: 'translation-by-a-vector-on-a-grid',
    category: 'no-knowledge',
    parse(statement) {
      const point = expect(statement.match(/Point P=\((\d+),(\d+)\)/), 'starting point');
      const move = expect(statement.match(/moved (\d+) columns? to the right and (\d+) rows? upward/), 'displacement');
      return { row: Number(point[1]), column: Number(point[2]), right: Number(move[1]), up: Number(move[2]) };
    },
    solve: (slots) => ({ row: slots.row - slots.up, column: slots.column + slots.right }),
    render: (solution) => `(${solution.row},${solution.column}).`,
    compute: [
      'const slots = $slots;',
      'const row = slots.row - slots.up;',
      'const column = slots.column + slots.right;',
      'return "(" + row + "," + column + ").";'
    ].join('\n'),
    explain: (slots, solution) => [
      `The point starts at column ${slots.column} and row ${slots.row} in the (row, column) convention of the problem.`,
      `Moving ${slots.right} columns right adds ${slots.right} to the column, and moving ${slots.up} rows up subtracts ${slots.up} from the row because the problem states that up decreases the row number.`,
      `The new position is (${solution.row},${solution.column}).`
    ]
  },
  {
    template: 'The inverse translation',
    type: 'the-inverse-translation',
    category: 'no-knowledge',
    parse(statement) {
      const translation = expect(statement.match(/translation of \+?(\d+) columns?/), 'translation');
      const final = expect(statement.match(/ends in column (\d+)/), 'final column');
      return { translation: Number(translation[1]), final: Number(final[1]) };
    },
    solve: (slots) => ({ initial: slots.final - slots.translation }),
    render: (solution) => `Column ${solution.initial}.`,
    compute: [
      'const slots = $slots;',
      'return "Column " + (slots.final - slots.translation) + ".";'
    ].join('\n'),
    explain: (slots, solution) => [
      `The forward motion adds ${slots.translation} to the column and ends at column ${slots.final}.`,
      `Undoing it is the inverse operation, so the initial column was ${slots.final} − ${slots.translation} = ${solution.initial}.`
    ]
  },
  {
    template: 'Two translations compose',
    type: 'two-translations-compose',
    category: 'no-knowledge',
    parse: parseDisplacements,
    solve: (slots) => ({ total: slots.displacements.reduce((sum, value) => sum + value, 0) }),
    render: (solution) => `${Math.abs(solution.total)} units to the ${solution.total >= 0 ? 'right' : 'left'}.`,
    compute: COMPUTE_DISPLACEMENT,
    explain: (slots, solution) => [
      `Two moves in the same direction compose into a single move, so the displacements ${slots.displacements.join(' and ')} are added.`,
      `Their total is ${solution.total}, so the total effect is ${Math.abs(solution.total)} units to the ${solution.total >= 0 ? 'right' : 'left'}.`
    ]
  },
  {
    template: 'Opposite translations partially cancel',
    type: 'opposite-translations-partially-cancel',
    category: 'no-knowledge',
    parse: parseDisplacements,
    solve: (slots) => ({ total: slots.displacements.reduce((sum, value) => sum + value, 0) }),
    render: (solution) => `${Math.abs(solution.total)} units to the ${solution.total >= 0 ? 'right' : 'left'}.`,
    compute: COMPUTE_DISPLACEMENT,
    explain: (slots, solution) => [
      `The displacements ${slots.displacements.join(' and ')} have opposite signs, so the smaller one cancels part of the larger one.`,
      `Adding them gives ${solution.total}, so the point ends ${Math.abs(solution.total)} units to the ${solution.total >= 0 ? 'right' : 'left'} of its initial position.`
    ]
  },
  knowledgeCase({
    template: 'Reflecting a column across a vertical axis',
    type: 'reflecting-a-column-across-a-vertical-axis',
    parse(statement) {
      const axis = expect(statement.match(/axis is column (\d+)/), 'axis column');
      const column = expect(statement.match(/Point P is in column (\d+)/), 'point column');
      return { axis: Number(axis[1]), column: Number(column[1]) };
    },
    solve: (slots) => ({ image: 2 * slots.axis - slots.column }),
    render: (solution) => `Column ${solution.image}.`,
    facts: { reflectionPreservesDistanceFromAxis: true },
    compute: COMPUTE_REFLECTION,
    explain: (slots, solution) => [
      `The point is ${slots.axis - slots.column} columns from the axis at column ${slots.axis}.`,
      'A reflection keeps the distance to the axis and puts the image on the other side, the property the circuit reads from its fact wire.',
      `The image therefore lies at column ${solution.image}.`
    ]
  }),
  knowledgeCase({
    template: 'A point lying on the axis',
    type: 'a-point-lying-on-the-axis',
    parse(statement) {
      const axis = expect(statement.match(/axis is column (\d+)/), 'axis column');
      const column = expect(statement.match(/lies exactly in column (\d+)/), 'point column');
      return { axis: Number(axis[1]), column: Number(column[1]) };
    },
    solve: (slots) => ({ image: 2 * slots.axis - slots.column }),
    render: (solution) => `Column ${solution.image}.`,
    facts: { reflectionPreservesDistanceFromAxis: true },
    compute: COMPUTE_REFLECTION,
    explain: (slots, solution) => [
      `The point lies in column ${slots.column}, exactly on the axis at column ${slots.axis}, so its distance to the axis is zero.`,
      'A reflection keeps the distance to the axis, and a zero distance stays zero, so the point does not move.',
      `Its image is again in column ${solution.image}.`
    ]
  }),
  knowledgeCase({
    template: 'Two reflections in the same axis',
    type: 'two-reflections-in-the-same-axis',
    parse(statement) {
      const reflections = [...statement.matchAll(/reflect/gi)].length;
      if (reflections === 0) {
        throw new Error('no reflection is described');
      }
      return { reflections };
    },
    solve: (slots) => ({ returns: slots.reflections % 2 === 0 }),
    render: (solution) => (solution.returns ? 'It returns to the initial point.' : 'It ends on the other side of the axis, at the same distance.'),
    facts: { twoReflectionsInTheSameAxisReturnToTheStart: true },
    compute: [
      'const slots = $slots;',
      'const even = slots.reflections % 2 === 0;',
      'const returns = even && $facts.twoReflectionsInTheSameAxisReturnToTheStart === true;',
      'return returns ? "It returns to the initial point." : "It ends on the other side of the axis, at the same distance.";'
    ].join('\n'),
    explain: (slots) => [
      `The point is reflected ${slots.reflections} times in the same axis, so the operation is applied twice.`,
      'Each reflection swaps the two sides while keeping the distance to the axis, so the second application undoes the first, a fact the circuit reads from its fact wire.',
      'After an even number of reflections the point is back at its initial position.'
    ]
  }),
  {
    template: 'Rotating directions by 90°',
    type: 'rotating-directions-by-90',
    category: 'no-knowledge',
    parse(statement) {
      const mapping = [...statement.matchAll(/(north|east|south|west)→(north|east|south|west)/g)].map((match) => [match[1], match[2]]);
      const direction = expect(statement.match(/arrow pointing (north|east|south|west)/), 'arrow direction');
      if (mapping.length === 0) {
        throw new Error('no rotation mapping is given');
      }
      return { mapping, direction: direction[1] };
    },
    solve: (slots) => ({ direction: new Map(slots.mapping).get(slots.direction) }),
    render: (solution) => `${solution.direction[0].toUpperCase()}${solution.direction.slice(1)}.`,
    compute: [
      'const slots = $slots;',
      'const direction = new Map(slots.mapping).get(slots.direction);',
      'return direction[0].toUpperCase() + direction.slice(1) + ".";'
    ].join('\n'),
    explain: (slots, solution) => [
      `The problem states the 90° clockwise mapping as ${slots.mapping.map(([from, to]) => `${from}→${to}`).join(', ')}.`,
      `Following that mapping once from ${slots.direction} gives ${solution.direction}, so the arrow points ${solution.direction}.`
    ]
  },
  knowledgeCase({
    template: 'Four 90° rotations',
    type: 'four-90-rotations',
    parse(statement) {
      const turn = expect(statement.match(/rotated (\w+)(?: times?)? by (\d+)/), 'rotation');
      return { times: countFromWord(turn[1]), degrees: Number(turn[2]) };
    },
    solve(slots) {
      const total = slots.times * slots.degrees;
      return { total, remainder: total % FULL_TURN_DEGREES };
    },
    render: (solution) => (solution.remainder === 0 ? 'The same orientation as at the start.' : `It ends ${solution.remainder} degrees from the start.`),
    facts: { degreesPerFullTurn: FULL_TURN_DEGREES },
    compute: [
      'const slots = $slots;',
      'const total = slots.times * slots.degrees;',
      'const remainder = total % $facts.degreesPerFullTurn;',
      'return remainder === 0 ? "The same orientation as at the start." : "It ends " + remainder + " degrees from the start.";'
    ].join('\n'),
    explain: (slots, solution) => [
      `The shape is rotated ${slots.times} times by ${slots.degrees}°, so the total rotation is ${solution.total}°.`,
      `A full turn is ${FULL_TURN_DEGREES}°, the convention the circuit reads from its fact wire, and ${solution.total}° is exactly a whole number of full turns.`,
      'After a whole number of complete turns the shape has the same orientation as at the start.'
    ]
  }),
  knowledgeCase({
    template: 'A 180° rotation as two quarter-turns',
    type: 'a-180-rotation-as-two-quarter-turns',
    parse(statement) {
      const start = expect(statement.match(/points (north|east|south|west)/), 'arrow direction');
      const turn = expect(statement.match(/rotated (\w+)(?: times?)? by (\d+)/), 'rotation');
      return { start: start[1], times: countFromWord(turn[1]), degrees: Number(turn[2]) };
    },
    solve(slots) {
      const order = ['north', 'east', 'south', 'west'];
      const steps = (slots.times * slots.degrees) / QUARTER_TURN_DEGREES;
      return { direction: order[(order.indexOf(slots.start) + steps) % 4] };
    },
    render: (solution) => `${solution.direction[0].toUpperCase()}${solution.direction.slice(1)}.`,
    facts: {
      degreesPerQuarterTurn: QUARTER_TURN_DEGREES,
      clockwiseQuarterTurn: { north: 'east', east: 'south', south: 'west', west: 'north' }
    },
    compute: [
      'const slots = $slots;',
      'const map = $facts.clockwiseQuarterTurn;',
      'const steps = Math.round((slots.times * slots.degrees) / $facts.degreesPerQuarterTurn);',
      'let direction = slots.start;',
      'for (let index = 0; index < steps; index += 1) {',
      '  direction = map[direction];',
      '}',
      'return direction[0].toUpperCase() + direction.slice(1) + ".";'
    ].join('\n'),
    explain: (slots, solution) => [
      `The arrow starts pointing ${slots.start} and is rotated ${slots.times} times by ${slots.degrees}° clockwise, which is two quarter-turns.`,
      'A clockwise quarter-turn sends north to east, east to south, south to west, and west to north, the cycle the circuit reads from its fact wire.',
      `Applying that cycle twice from ${slots.start} gives ${solution.direction}.`
    ]
  }),
  {
    template: 'The order of transformations can matter',
    type: 'the-order-of-transformations-can-matter',
    category: 'no-knowledge',
    parse(statement) {
      const point = expect(statement.match(/Point P=\((\d+),(\d+)\)/), 'starting point');
      const add = expect(statement.match(/adds (\d+) to the column/), 'T increment');
      return { column: Number(point[2]), add: Number(add[1]) };
    },
    solve(slots) {
      const tThenS = -(slots.column + slots.add);
      const sThenT = -slots.column + slots.add;
      return { tThenS, sThenT, equal: tThenS === sThenT };
    },
    render: (solution) => (solution.equal ? 'Yes; the results are equal.' : 'No; the results differ.'),
    compute: [
      'const slots = $slots;',
      'const tThenS = -(slots.column + slots.add);',
      'const sThenT = -slots.column + slots.add;',
      'return tThenS === sThenT ? "Yes; the results are equal." : "No; the results differ.";'
    ].join('\n'),
    explain: (slots, solution) => [
      `Operation T adds ${slots.add} to the column and operation S replaces the column c by −c.`,
      `T then S gives −(${slots.column} + ${slots.add}) = ${solution.tThenS}, while S then T gives −${slots.column} + ${slots.add} = ${solution.sThenT}.`,
      'The two compositions differ, so the order of the transformations matters.'
    ]
  },
  knowledgeCase({
    template: 'Which properties does translation preserve?',
    type: 'which-properties-does-translation-preserve',
    parse(statement) {
      const length = expect(statement.match(/length (\d+)/), 'segment length');
      return { length: Number(length[1]) };
    },
    solve: (slots) => ({ length: slots.length }),
    render: (solution) => `No; the length remains ${solution.length}.`,
    facts: { translationPreservesLengths: true },
    compute: [
      'const slots = $slots;',
      'if ($facts.translationPreservesLengths === true) {',
      '  return "No; the length remains " + slots.length + ".";',
      '}',
      'return "Yes; the length can change.";'
    ].join('\n'),
    explain: (slots, solution) => [
      'A translation is a rigid motion: it shifts every point by the same displacement without turning or stretching the figure.',
      'That property, taken from the fact wire, means distances such as the segment length are unchanged.',
      `The length stays ${solution.length}, so it cannot change through translation alone.`
    ]
  }),
  knowledgeCase({
    template: 'Which properties does rotation preserve?',
    type: 'which-properties-does-rotation-preserve',
    parse(statement) {
      const size = expect(statement.match(/(\d+)×(\d+) rectangle/), 'rectangle dimensions');
      const rotation = expect(statement.match(/rotated by (\d+)/), 'rotation');
      return { horizontal: Number(size[1]), vertical: Number(size[2]), degrees: Number(rotation[1]) };
    },
    solve(slots) {
      const swapped = (slots.degrees / QUARTER_TURN_DEGREES) % 2 === 1;
      return { horizontal: swapped ? slots.vertical : slots.horizontal, vertical: swapped ? slots.horizontal : slots.vertical };
    },
    render: (solution) => `${solution.horizontal}×${solution.vertical}.`,
    facts: { degreesPerQuarterTurn: QUARTER_TURN_DEGREES, quarterTurnSwapsTheAxes: true },
    compute: [
      'const slots = $slots;',
      'const quarterTurns = Math.round(slots.degrees / $facts.degreesPerQuarterTurn);',
      'const swapped = quarterTurns % 2 === 1 && $facts.quarterTurnSwapsTheAxes === true;',
      'const horizontal = swapped ? slots.vertical : slots.horizontal;',
      'const vertical = swapped ? slots.horizontal : slots.vertical;',
      'return horizontal + "×" + vertical + ".";'
    ].join('\n'),
    explain: (slots, solution) => [
      `The rectangle is ${slots.horizontal}×${slots.vertical} and is rotated by ${slots.degrees}°, one quarter-turn.`,
      'A rotation preserves the side lengths but turns the figure, so the horizontal and vertical roles of the two sides swap, the property the circuit reads from its fact wire.',
      `Written as horizontal × vertical the dimensions become ${solution.horizontal}×${solution.vertical}.`
    ]
  }),
  {
    template: 'Reflection reverses the orientation of a sequence',
    type: 'reflection-reverses-the-orientation-of-a-sequence',
    category: 'no-knowledge',
    parse(statement) {
      const line = expect(statement.match(/letters appear ([A-Z](?:-[A-Z])+) from left to right/), 'letter line');
      return { letters: line[1].split('-') };
    },
    solve: (slots) => ({ order: [...slots.letters].reverse() }),
    render: (solution) => `${solution.order.join('-')}.`,
    compute: ['const slots = $slots;', 'return [...slots.letters].reverse().join("-") + ".";'].join('\n'),
    explain: (slots, solution) => [
      `The printed order from left to right is ${slots.letters.join('-')}.`,
      'A vertical reflection swaps left and right, so the leftmost item becomes the rightmost and the order is reversed.',
      `The image shows ${solution.order.join('-')}.`
    ]
  },
  {
    template: 'Central symmetry on a number line',
    type: 'central-symmetry-on-a-number-line',
    category: 'no-knowledge',
    parse(statement) {
      const center = expect(statement.match(/center is at (-?\d+)/), 'center');
      const point = expect(statement.match(/Point A is at (-?\d+)/), 'point');
      return { center: Number(center[1]), point: Number(point[1]) };
    },
    solve: (slots) => ({ symmetric: 2 * slots.center - slots.point }),
    render: (solution) => `${solution.symmetric}.`,
    compute: ['const slots = $slots;', 'return String(2 * slots.center - slots.point) + ".";'].join('\n'),
    explain: (slots, solution) => [
      `Point A is at ${slots.point} and the center is at ${slots.center}, so A is ${slots.center - slots.point} units to the left of the center.`,
      `The centrally symmetric point lies the same distance on the other side, as the statement says, so it is at ${slots.center} + ${slots.center - slots.point} = ${solution.symmetric}.`
    ]
  },
  {
    template: 'A transformation that cannot cause enlargement',
    type: 'a-transformation-that-cannot-cause-enlargement',
    category: 'no-knowledge',
    parse(statement) {
      const sides = expect(statement.match(/side length (\d+) and another has side length (\d+)/), 'side lengths');
      return { first: Number(sides[1]), second: Number(sides[2]), preservesLengths: /preserve lengths/.test(statement) };
    },
    solve: (slots) => ({ possible: slots.preservesLengths === true && slots.first === slots.second }),
    render: (solution) => (solution.possible ? 'Yes.' : 'No.'),
    compute: [
      'const slots = $slots;',
      'const rigid = slots.preservesLengths === true;',
      'return rigid && slots.first !== slots.second ? "No." : "Yes.";'
    ].join('\n'),
    explain: (slots) => [
      `The first square has side length ${slots.first} and the second has side length ${slots.second}.`,
      'Translation, rotation, and reflection preserve lengths, so a rigid motion of the first square would keep its side length unchanged.',
      `A side of ${slots.second} cannot come from a side of ${slots.first} using only these transformations, so the answer is no.`
    ]
  },
  {
    template: 'Scaling defined explicitly',
    type: 'scaling-defined-explicitly',
    category: 'no-knowledge',
    parse(statement) {
      const size = expect(statement.match(/(\d+)×(\d+) rectangle/), 'rectangle dimensions');
      const factor = expect(statement.match(/factor (\d+)/), 'scaling factor');
      return { horizontal: Number(size[1]), vertical: Number(size[2]), factor: Number(factor[1]) };
    },
    solve: (slots) => ({ horizontal: slots.horizontal * slots.factor, vertical: slots.vertical * slots.factor }),
    render: (solution) => `${solution.horizontal}×${solution.vertical}.`,
    compute: [
      'const slots = $slots;',
      'return (slots.horizontal * slots.factor) + "×" + (slots.vertical * slots.factor) + ".";'
    ].join('\n'),
    explain: (slots, solution) => [
      `The problem defines scaling by factor ${slots.factor} as multiplying every length by ${slots.factor}.`,
      `Applying it to the ${slots.horizontal}×${slots.vertical} rectangle gives ${slots.horizontal}×${slots.factor} = ${solution.horizontal} and ${slots.vertical}×${slots.factor} = ${solution.vertical}.`,
      `The new dimensions are ${solution.horizontal}×${solution.vertical}.`
    ]
  },
  {
    template: 'Scaling and perimeter',
    type: 'scaling-and-perimeter',
    category: 'no-knowledge',
    parse(statement) {
      const square = expect(statement.match(/side (\d+) has perimeter (\d+)/), 'square and perimeter');
      const growth = expect(statement.match(/all lengths are (doubled|tripled|quadrupled)/), 'scaling factor');
      return { side: Number(square[1]), perimeter: Number(square[2]), factor: { doubled: 2, tripled: 3, quadrupled: 4 }[growth[1]] };
    },
    solve(slots) {
      const newPerimeter = (slots.perimeter / slots.side) * slots.side * slots.factor;
      return { newPerimeter, times: newPerimeter / slots.perimeter };
    },
    render(solution) {
      const word = solution.times === 2 ? 'doubles' : solution.times === 3 ? 'triples' : `is multiplied by ${solution.times}`;
      return `It becomes ${solution.newPerimeter}, so it ${word}.`;
    },
    compute: [
      'const slots = $slots;',
      'const newPerimeter = (slots.perimeter / slots.side) * slots.side * slots.factor;',
      'const times = newPerimeter / slots.perimeter;',
      'const word = times === 2 ? "doubles" : times === 3 ? "triples" : "is multiplied by " + times;',
      'return "It becomes " + newPerimeter + ", so it " + word + ".";'
    ].join('\n'),
    explain: (slots, solution) => [
      `The statement fixes the relation between side and perimeter: a side of ${slots.side} has perimeter ${slots.perimeter}, so the perimeter is ${slots.perimeter / slots.side} times the side.`,
      `Doubling all lengths makes the side ${slots.side * slots.factor}, so the perimeter becomes ${solution.newPerimeter}, which is ${solution.times} times the original.`,
      'The perimeter therefore doubles.'
    ]
  },
  {
    template: 'Scaling and area counted in squares',
    type: 'scaling-and-area-counted-in-squares',
    category: 'no-knowledge',
    parse(statement) {
      const square = expect(statement.match(/(\d+)×(\d+) square has (\d+) unit cells/), 'first square');
      const grown = expect(statement.match(/obtain a (\d+)×(\d+) square/), 'new square');
      return { width: Number(square[1]), height: Number(square[2]), cells: Number(square[3]), newWidth: Number(grown[1]), newHeight: Number(grown[2]) };
    },
    solve(slots) {
      const newCells = slots.newWidth * slots.newHeight;
      return { newCells, times: newCells / slots.cells };
    },
    render: (solution) => `${solution.newCells} cells, ${solution.times} times as many.`,
    compute: [
      'const slots = $slots;',
      'const newCells = slots.newWidth * slots.newHeight;',
      'return newCells + " cells, " + (newCells / slots.cells) + " times as many.";'
    ].join('\n'),
    explain: (slots, solution) => [
      `The ${slots.width}×${slots.height} square holds ${slots.cells} unit cells, so the cell count is the product of the two dimensions.`,
      `The doubled square is ${slots.newWidth}×${slots.newHeight}, which holds ${slots.newWidth} × ${slots.newHeight} = ${solution.newCells} cells.`,
      `Comparing ${solution.newCells} with ${slots.cells} gives ${solution.times} times as many cells.`
    ]
  },
  {
    template: 'An unknown inverse transformation',
    type: 'an-unknown-inverse-transformation',
    category: 'no-knowledge',
    parse(statement) {
      const move = expect(statement.match(/moved (\d+) units to the (right|left)/), 'motion');
      return { distance: Number(move[1]), direction: move[2] };
    },
    solve: (slots) => ({ distance: slots.distance, direction: slots.direction === 'right' ? 'left' : 'right' }),
    render: (solution) => `Translate ${solution.distance} units to the ${solution.direction}.`,
    compute: [
      'const slots = $slots;',
      'const opposite = slots.direction === "right" ? "left" : "right";',
      'return "Translate " + slots.distance + " units to the " + opposite + ".";'
    ].join('\n'),
    explain: (slots, solution) => [
      `The figure was moved ${slots.distance} units to the ${slots.direction}.`,
      'The inverse of a translation has the same distance and the opposite direction, so it restores the initial position without changing the orientation.',
      `The required transformation is to translate ${solution.distance} units to the ${solution.direction}.`
    ]
  },
  knowledgeCase({
    template: 'Identifying a transformation from its effect',
    type: 'identifying-a-transformation-from-its-effect',
    parse(statement) {
      const arrow = expect(statement.match(/pointed (left|right|up|down) now points (left|right|up|down)/), 'arrow directions');
      return { before: arrow[1], after: arrow[2], verticalChanged: !/up remains up/.test(statement) };
    },
    solve: (slots) => ({ reflection: slots.before !== slots.after && slots.verticalChanged === false }),
    render: (solution) => (solution.reflection ? 'Vertical reflection.' : 'Translation.'),
    facts: { verticalReflectionReversesLeftRight: true, translationPreservesOrientation: true },
    compute: [
      'const slots = $slots;',
      'const flipped = slots.before !== slots.after;',
      'if (flipped && slots.verticalChanged === false && $facts.verticalReflectionReversesLeftRight === true) {',
      '  return "Vertical reflection.";',
      '}',
      'return "Translation.";'
    ].join('\n'),
    explain: (slots) => [
      `The arrow pointed ${slots.before} and now points ${slots.after}, so its horizontal direction is reversed while the vertical direction is unchanged.`,
      'A translation preserves orientation, but a vertical reflection reverses left and right and keeps up and down, the property the circuit reads from its fact wire.',
      'The effect is therefore a vertical reflection.'
    ]
  }),
  {
    template: 'Two figures congruent through rigid transformations',
    type: 'two-figures-congruent-through-rigid-transformations',
    category: 'no-knowledge',
    parse: (statement) => ({
      sameSideLengths: /same three side lengths/.test(statement),
      differentOrientations: /different orientations/.test(statement),
      orientationCanChange: /translated, rotated, or reflected/.test(statement)
    }),
    solve: (slots) => ({ congruent: slots.sameSideLengths === true && slots.orientationCanChange === true }),
    render: (solution) => (solution.congruent ? 'No.' : 'Yes.'),
    compute: [
      'const slots = $slots;',
      'const congruent = slots.sameSideLengths === true && slots.orientationCanChange === true;',
      'return congruent ? "No." : "Yes.";'
    ].join('\n'),
    explain: () => [
      'The problem defines congruent as being able to overlap by translation, rotation, or reflection, without enlargement.',
      'The two triangles have the same three side lengths and their orientations differ, but rotation and reflection change orientation while preserving lengths.',
      'Orientation alone therefore cannot prevent congruence, so the answer is no.'
    ]
  },
  {
    template: 'A fixed point under rotation',
    type: 'a-fixed-point-under-rotation',
    category: 'no-knowledge',
    parse(statement) {
      const center = expect(statement.match(/around point ([A-Z])/), 'rotation center');
      return { center: center[1], centerFixed: /center of rotation does not move/.test(statement) };
    },
    solve: (slots) => ({ fixed: slots.centerFixed === true }),
    render: (solution) => (solution.fixed ? 'In the same position.' : 'It moves with the figure.'),
    compute: [
      'const slots = $slots;',
      'return slots.centerFixed === true ? "In the same position." : "It moves with the figure.";'
    ].join('\n'),
    explain: (slots) => [
      `The figure rotates around point ${slots.center}, and the statement says that the center of rotation does not move.`,
      'That is the defining property of the center of rotation, so every rotation leaves it where it is.',
      `After any rotation point ${slots.center} is again in the same position.`
    ]
  },
  {
    template: 'Transforming a pair of points',
    type: 'transforming-a-pair-of-points',
    category: 'no-knowledge',
    parse(statement) {
      const p = expect(statement.match(/P=\((\d+),(\d+)\)/), 'point P');
      const q = expect(statement.match(/Q=\((\d+),(\d+)\)/), 'point Q');
      const move = expect(statement.match(/translated by ([+\-−]?\d+) in row and ([+\-−]?\d+) in column/), 'translation');
      return { p: { row: Number(p[1]), column: Number(p[2]) }, q: { row: Number(q[1]), column: Number(q[2]) }, rowDelta: signed(move[1]), columnDelta: signed(move[2]) };
    },
    solve(slots) {
      const image = (point) => ({ row: point.row + slots.rowDelta, column: point.column + slots.columnDelta });
      const p = image(slots.p);
      const q = image(slots.q);
      return { p, q, sameRow: p.row === q.row };
    },
    render: (solution) => `P′=(${solution.p.row},${solution.p.column}), Q′=(${solution.q.row},${solution.q.column}); ${solution.sameRow ? 'yes' : 'no'}.`,
    compute: [
      'const slots = $slots;',
      'const pRow = slots.p.row + slots.rowDelta;',
      'const pColumn = slots.p.column + slots.columnDelta;',
      'const qRow = slots.q.row + slots.rowDelta;',
      'const qColumn = slots.q.column + slots.columnDelta;',
      'const sameRow = pRow === qRow;',
      'return "P′=(" + pRow + "," + pColumn + "), Q′=(" + qRow + "," + qColumn + "); " + (sameRow ? "yes" : "no") + ".";'
    ].join('\n'),
    explain: (slots, solution) => [
      `The same translation adds ${slots.rowDelta} to the row and ${slots.columnDelta} to the column of every point.`,
      `P=(${slots.p.row},${slots.p.column}) becomes (${solution.p.row},${solution.p.column}) and Q=(${slots.q.row},${slots.q.column}) becomes (${solution.q.row},${solution.q.column}).`,
      'Both images keep the same row, so the two points are still on the same row as each other.'
    ]
  },
  knowledgeCase({
    template: 'Transforming a shape and the path of a point',
    type: 'transforming-a-shape-and-the-path-of-a-point',
    parse(statement) {
      const shape = expect(statement.match(/A (\w+) is translated (\d+) units to the (right|left)/), 'translated shape');
      const vertex = expect(statement.match(/(\w+) vertices/), 'vertex count');
      return { shape: shape[1], vertices: countFromWord(vertex[1]), distance: Number(shape[2]), direction: shape[3] };
    },
    solve: (slots) => ({ distance: slots.distance, direction: slots.direction, vertices: slots.vertices }),
    render: () => 'All points must move by the same displacement.',
    facts: { translationMovesEveryPointEqually: true },
    compute: [
      'const slots = $slots;',
      'if ($facts.translationMovesEveryPointEqually === true) {',
      '  return "All points must move by the same displacement.";',
      '}',
      'return "It is enough to move one vertex.";'
    ].join('\n'),
    explain: (slots) => [
      `The ${slots.shape} with ${slots.vertices} vertices is translated ${slots.distance} units to the ${slots.direction}.`,
      'A translation moves every point of a figure by the same displacement, the property the circuit reads from its fact wire, so the figure keeps its shape instead of stretching.',
      'All three vertices must move by that displacement; moving only one would tear the figure apart.'
    ]
  })
];
