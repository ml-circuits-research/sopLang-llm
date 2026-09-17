/**
 * Families for chapter 25 of the mathematical seed book: visual structures,
 * cutting, and transformations.
 *
 * This chapter titles every one of its 25 problems individually, so each
 * printed template is its own family and the case list is split across three
 * modules: this part carries cases 25.1-25.9, and the cases continue in
 * `chapter-25-b.mjs` (25.10-25.18) and `chapter-25-c.mjs` (25.19-25.25). Every
 * part repeats the chapter number and the shared helpers so the modules load
 * independently.
 *
 * A family covers one printed template: a reference parse, an independent
 * computation, the answer text the source prints, the SOP Lang computation body
 * that the circuit executes, and the explanation lines of the example. The
 * chapter defines its own rules (unit sides and boundary counts, the folding
 * criterion for symmetry, the repeating cycle, the stated growth step), so no
 * case needs a fact the statement leaves unstated and every case is
 * `no-knowledge`.
 */

export const chapter = 25;

const WORD_NUMBERS = {
  one: 1, once: 1, two: 2, twice: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, twenty: 20
};

function counted(text) {
  const word = String(text).toLowerCase();
  if (WORD_NUMBERS[word] !== undefined) {
    return WORD_NUMBERS[word];
  }
  const value = Number(word);
  if (!Number.isInteger(value)) {
    throw new Error(`"${text}" is not a whole number`);
  }
  return value;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const cases = [
  {
    template: 'How many segments does a row of joined squares have?',
    type: 'how-many-segments-does-a-row-of-joined-squares-have',
    category: 'no-knowledge',
    parse(statement) {
      const squaresMatch = statement.match(/\b([A-Za-z]+|\d+) identical squares are joined/i);
      const sidesMatch = statement.match(/square has (\d+) sides/i);
      if (squaresMatch === null || sidesMatch === null) {
        throw new Error('the squares or the sides-per-square count are missing');
      }
      return { squares: counted(squaresMatch[1]), sides: Number(sidesMatch[1]) };
    },
    solve(slots) {
      return { boundary: slots.squares * slots.sides - 2 * (slots.squares - 1) };
    },
    render(solution) {
      return `${solution.boundary} segments.`;
    },
    compute: [
      'const s = $slots;',
      'const boundary = s.squares * s.sides - 2 * (s.squares - 1);',
      'return boundary + " segments.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each of the ${slots.squares} separate squares contributes ${slots.sides} sides, so counting them apart gives ${slots.squares * slots.sides} sides.`,
        `Two squares that share a complete side turn that side interior: the two counted sides become one shared segment, removing 2 sides at each of the ${slots.squares - 1} joins.`,
        `The outer boundary therefore has ${solution.boundary} segments.`
      ];
    }
  },
  {
    template: 'Three squares in a row',
    type: 'three-squares-in-a-row',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/\b([A-Za-z]+|\d+) squares are joined in one row/i);
      if (match === null) {
        throw new Error('the number of squares in the row is missing');
      }
      return { squares: counted(match[1]), sides: 4 };
    },
    solve(slots) {
      return { boundary: slots.squares * slots.sides - 2 * (slots.squares - 1) };
    },
    render(solution) {
      return `${solution.boundary} unit sides.`;
    },
    compute: [
      'const s = $slots;',
      'const boundary = s.squares * s.sides - 2 * (s.squares - 1);',
      'return boundary + " unit sides.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A row of ${slots.squares} squares has ${slots.squares - 1} contacts where neighbours share a full side.`,
        `Counting every square alone gives ${slots.squares * slots.sides} unit sides; each shared side is counted twice and becomes interior, so subtract 2 per contact.`,
        `The outer boundary keeps ${solution.boundary} unit sides.`
      ];
    }
  },
  {
    template: 'Sticks for two triangles sharing a side',
    type: 'sticks-for-two-triangles-sharing-a-side',
    category: 'no-knowledge',
    parse(statement) {
      const sticksMatch = statement.match(/triangle made of sticks uses (\d+) sticks/);
      const secondMatch = statement.match(/build a second triangle/);
      if (sticksMatch === null || secondMatch === null) {
        throw new Error('the sticks per triangle or the number of triangles is missing');
      }
      return { perTriangle: Number(sticksMatch[1]), triangles: 2 };
    },
    solve(slots) {
      return { sticks: slots.perTriangle + (slots.perTriangle - 1) * (slots.triangles - 1) };
    },
    render(solution) {
      return `${solution.sticks} sticks.`;
    },
    compute: [
      'const s = $slots;',
      'const sticks = s.perTriangle + (s.perTriangle - 1) * (s.triangles - 1);',
      'return sticks + " sticks.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The first triangle uses ${slots.perTriangle} sticks.`,
        `Every further triangle reuses one existing side, so it adds only the remaining ${slots.perTriangle - 1} sticks.`,
        `With ${slots.triangles} triangles altogether the count is ${solution.sticks} sticks.`
      ];
    }
  },
  {
    template: 'A square divided into four small squares',
    type: 'a-square-divided-into-four-small-squares',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/count the (\d+) outer sides and the (\d+) interior lines/);
      if (match === null) {
        throw new Error('the outer sides or the interior lines are missing');
      }
      return { outerSides: Number(match[1]), interiorLines: Number(match[2]) };
    },
    solve(slots) {
      return { segments: slots.outerSides + slots.interiorLines };
    },
    render(solution) {
      return `${solution.segments} complete segments.`;
    },
    compute: [
      'const s = $slots;',
      'const segments = s.outerSides + s.interiorLines;',
      'return segments + " complete segments.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The dividing vertical line and horizontal line each run from one side of the square to the opposite side, so each is a whole straight segment.`,
        `That gives ${slots.interiorLines} interior segments plus the ${slots.outerSides} outer sides of the square.`,
        `Altogether ${solution.segments} complete straight segments have been drawn.`
      ];
    }
  },
  {
    template: 'Pieces that form a rectangle',
    type: 'pieces-that-form-a-rectangle',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/We have (\d+) unit squares/);
      if (match === null) {
        throw new Error('the number of unit squares is missing');
      }
      return { total: Number(match[1]) };
    },
    solve(slots) {
      const pairs = [];
      for (let rows = 1; rows * rows <= slots.total; rows += 1) {
        if (slots.total % rows === 0) {
          pairs.push([rows, slots.total / rows]);
        }
      }
      return { pairs };
    },
    render(solution) {
      return `${solution.pairs.map(([rows, columns]) => `${rows}\u00d7${columns}`).join(' or ')}.`;
    },
    compute: [
      'const s = $slots;',
      'const pairs = [];',
      'for (let rows = 1; rows * rows <= s.total; rows += 1) {',
      '  if (s.total % rows === 0) {',
      '    pairs.push(rows + "\u00d7" + (s.total / rows));',
      '  }',
      '}',
      'return pairs.join(" or ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A rectangle filled without gaps needs a whole number of rows and columns whose product is the ${slots.total} available unit squares.`,
        `So every whole-number divisor of ${slots.total} gives one dimension, and the matching dimension is ${slots.total} divided by it.`,
        `Listing the divisor pairs up to symmetry gives ${solution.pairs.map(([rows, columns]) => `${rows}\u00d7${columns}`).join(' or ')}.`
      ];
    }
  },
  {
    template: 'A missing piece in a mosaic',
    type: 'a-missing-piece-in-a-mosaic',
    category: 'no-knowledge',
    parse(statement) {
      const gridMatch = statement.match(/rectangle with (\d+) rows and (\d+) columns/i);
      const placedMatch = statement.match(/\b([A-Za-z]+|\d+) squares are already in place/i);
      if (gridMatch === null || placedMatch === null) {
        throw new Error('the grid size or the placed squares are missing');
      }
      return { rows: Number(gridMatch[1]), columns: Number(gridMatch[2]), placed: counted(placedMatch[1]) };
    },
    solve(slots) {
      return { missing: slots.rows * slots.columns - slots.placed };
    },
    render(solution) {
      return `${solution.missing} squares.`;
    },
    compute: [
      'const s = $slots;',
      'const missing = s.rows * s.columns - s.placed;',
      'return missing + " squares.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The rectangle holds ${slots.rows} rows of ${slots.columns} unit squares, so its capacity is ${slots.rows * slots.columns} squares.`,
        `Nine squares are already in place, so the unfilled part is the capacity minus the placed squares.`,
        `That leaves ${solution.missing} missing squares.`
      ];
    }
  },
  {
    template: 'A repeating two-dimensional pattern',
    type: 'a-repeating-two-dimensional-pattern',
    category: 'no-knowledge',
    parse(statement) {
      const boardMatch = statement.match(/A (\d+)\u00d7(\d+) board/);
      const colorMatch = statement.match(/top-left cell is (\w+)/);
      const cellMatch = statement.match(/row (\d+), column (\d+)/);
      if (boardMatch === null || colorMatch === null || cellMatch === null) {
        throw new Error('the board size, the top-left color, or the asked cell is missing');
      }
      const topLeft = colorMatch[1].toLowerCase();
      return {
        rows: Number(boardMatch[1]),
        columns: Number(boardMatch[2]),
        topLeft,
        opposite: topLeft === 'white' ? 'black' : 'white',
        row: Number(cellMatch[1]),
        column: Number(cellMatch[2])
      };
    },
    solve(slots) {
      const steps = (slots.row - 1) + (slots.column - 1);
      return { color: steps % 2 === 0 ? slots.topLeft : slots.opposite };
    },
    render(solution) {
      return `${capitalize(solution.color)}.`;
    },
    compute: [
      'const s = $slots;',
      'const steps = (s.row - 1) + (s.column - 1);',
      'const color = steps % 2 === 0 ? s.topLeft : s.opposite;',
      'return color.charAt(0).toUpperCase() + color.slice(1) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `On a checkerboard every step to a side-neighbour flips the color, so a cell keeps the color of the top-left cell exactly when the number of steps is even.`,
        `Moving from row 1 column 1 to row ${slots.row} column ${slots.column} takes ${slots.row - 1} vertical and ${slots.column - 1} horizontal steps, ${(slots.row - 1) + (slots.column - 1)} steps in total.`,
        `That number is even, so the cell has the same color as the top-left cell: ${solution.color}.`
      ];
    }
  },
  {
    template: 'The same shape after a translation',
    type: 'the-same-shape-after-a-translation',
    category: 'no-knowledge',
    parse(statement) {
      const movedMatch = statement.match(/moved (\d+) squares to the (right|left|up|down)/);
      if (movedMatch === null) {
        throw new Error('the translation is missing');
      }
      const rigid = /without being rotated or reflected/.test(statement);
      return {
        distance: Number(movedMatch[1]),
        direction: movedMatch[2],
        rotated: !rigid,
        reflected: !rigid
      };
    },
    solve(slots) {
      return { rigid: !slots.rotated && !slots.reflected };
    },
    render(solution) {
      return solution.rigid
        ? 'The shape does not change; only the position changes.'
        : 'The shape changes because the piece is turned over.';
    },
    compute: [
      'const s = $slots;',
      'const rigid = !s.rotated && !s.reflected;',
      'return rigid',
      '  ? "The shape does not change; only the position changes."',
      '  : "The shape changes because the piece is turned over.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A translation moves every point of the piece by the same ${slots.distance}-square displacement to the ${slots.direction}.`,
        'Because the displacement is identical for all points, all distances and angles between points stay the same, and no turning or flipping is involved.',
        `So the shape is unchanged and only the position differs.`
      ];
    }
  },
  {
    template: 'What changes under reflection?',
    type: 'what-changes-under-reflection',
    category: 'no-knowledge',
    parse(statement) {
      const directionMatch = statement.match(/arrow pointing (left|right|up|down)/);
      const mirrorMatch = statement.match(/(vertical|horizontal) mirror/);
      if (directionMatch === null || mirrorMatch === null) {
        throw new Error('the arrow direction or the mirror orientation is missing');
      }
      return { direction: directionMatch[1], mirror: mirrorMatch[1] };
    },
    solve(slots) {
      const flip = {
        vertical: { left: 'right', right: 'left' },
        horizontal: { up: 'down', down: 'up' }
      };
      return { direction: flip[slots.mirror][slots.direction] };
    },
    render(solution) {
      return `It will point ${solution.direction} and have the same length.`;
    },
    compute: [
      'const s = $slots;',
      'const flip = {',
      '  vertical: { left: "right", right: "left" },',
      '  horizontal: { up: "down", down: "up" }',
      '};',
      'const direction = flip[s.mirror][s.direction];',
      'return "It will point " + direction + " and have the same length.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The arrow points ${slots.direction} before the reflection, and the problem states that the ${slots.mirror} mirror swaps left and right while keeping length.`,
        `Mirroring therefore reverses the direction to ${solution.direction}.`,
        `Every distance inside the arrow is preserved, so the reflected arrow has the same length as the original.`
      ];
    }
  }
];
