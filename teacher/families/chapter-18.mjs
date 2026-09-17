/**
 * Families for chapter 18 of the mathematical seed book: deductive geometry on
 * grids and composite figures.
 *
 * A family covers one printed template: an independent computation, the answer
 * text the source prints, the SOP Lang computation body the circuit executes,
 * and the explanation lines of the example. Every definition the solutions rely on
 * (rectangle area, perimeter, symmetry, grid coordinates, exact tiling) is
 * stated in the problem text itself, so every case is `no-knowledge`.
 */

export const chapter = 18;

export const cases = [
  {
    template: 'Area with a Corner Cut Out',
    type: 'area-with-a-corner-cut-out',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/measuring (\d+)×(\d+) units has a (\d+)×(\d+) rectangle cut/);
      if (match === null) {
        throw new Error('the board and cut-out dimensions are missing');
      }
      return {
        width: Number(match[1]),
        height: Number(match[2]),
        cutWidth: Number(match[3]),
        cutHeight: Number(match[4])
      };
    },
    solve(slots) {
      const board = slots.width * slots.height;
      const cut = slots.cutWidth * slots.cutHeight;
      if (cut > board) {
        throw new Error('the cut-out is larger than the board');
      }
      return { remaining: board - cut };
    },
    render(solution) {
      return String(solution.remaining);
    },
    compute: [
      'const slots = $slots;',
      'const board = slots.width * slots.height;',
      'const cut = slots.cutWidth * slots.cutHeight;',
      'if (cut > board) {',
      '  throw new Error("the cut-out is larger than the board");',
      '}',
      'return String(board - cut);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The board is a rectangle ${slots.width} by ${slots.height}, so its area is ${slots.width}×${slots.height} = ${slots.width * slots.height}.`,
        `The piece cut from the corner is a ${slots.cutWidth} by ${slots.cutHeight} rectangle with area ${slots.cutWidth}×${slots.cutHeight} = ${slots.cutWidth * slots.cutHeight}.`,
        `Because the two regions do not overlap, the remaining area is the board area minus the cut-out area, ${slots.width * slots.height} − ${slots.cutWidth * slots.cutHeight} = ${solution.remaining}.`
      ];
    }
  },
  {
    template: 'Perimeter of an L-Shaped Figure',
    type: 'perimeter-of-an-l-shaped-figure',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/sides with lengths ([0-9, ]+) cm/);
      if (match === null) {
        throw new Error('the boundary side lengths are missing');
      }
      const sides = match[1]
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
        .map((value) => Number(value));
      if (sides.length === 0 || sides.some((value) => !Number.isFinite(value))) {
        throw new Error('the boundary side lengths are not numbers');
      }
      return { sides };
    },
    solve(slots) {
      let perimeter = 0;
      for (const side of slots.sides) {
        perimeter += side;
      }
      return { perimeter };
    },
    render(solution) {
      return `${solution.perimeter} cm`;
    },
    compute: [
      'const slots = $slots;',
      'let perimeter = 0;',
      'for (const side of slots.sides) {',
      '  perimeter += side;',
      '}',
      'return String(perimeter) + " cm";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The perimeter is defined as the sum of all segments of the outer boundary, so every listed side is used exactly once.',
        `Adding the boundary segments in order gives ${slots.sides.join(' + ')} = ${solution.perimeter} cm.`,
        'Nothing is subtracted for the concave corners: an L-shaped figure still contributes each boundary segment to its perimeter.'
      ];
    }
  },
  {
    template: 'Symmetry in a String',
    type: 'symmetry-in-a-string',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/Analyze the string ([A-Za-z]+)/);
      if (match === null) {
        throw new Error('the string to analyze is missing');
      }
      return { text: match[1] };
    },
    solve(slots) {
      const reversed = [...slots.text].reverse().join('');
      return { symmetric: reversed === slots.text, reversed };
    },
    render(solution) {
      return solution.symmetric ? 'Yes, the string is symmetric.' : 'No, the string is not symmetric.';
    },
    compute: [
      'const slots = $slots;',
      'const reversed = slots.text.split("").reverse().join("");',
      'if (reversed === slots.text) {',
      '  return "Yes, the string is symmetric.";',
      '}',
      'return "No, the string is not symmetric.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A string is symmetric when it reads the same left to right and right to left, so the test is whether the string equals its mirror.`,
        `Reversing ${slots.text} gives ${solution.reversed}.`,
        solution.symmetric
          ? 'The two readings are identical, so every position matches its mirrored position and the string is symmetric.'
          : 'The two readings differ, so some mirrored pair of positions holds different letters and the string is not symmetric.'
      ];
    }
  },
  {
    template: 'Grid Positions: Row and Column',
    type: 'grid-positions-row-and-column',
    category: 'no-knowledge',
    parse(statement) {
      const start = statement.match(/starts at \((\d+)\s*,\s*(\d+)\)/);
      const rows = statement.match(/move of ([+-]?\d+) rows/);
      const columns = statement.match(/move of ([+-]?\d+) columns/);
      if (start === null || rows === null || columns === null) {
        throw new Error('the start position or one of the moves is missing');
      }
      return {
        start: { row: Number(start[1]), column: Number(start[2]) },
        rowMove: Number(rows[1]),
        columnMove: Number(columns[1])
      };
    },
    solve(slots) {
      return {
        row: slots.start.row + slots.rowMove,
        column: slots.start.column + slots.columnMove
      };
    },
    render(solution) {
      return `(${solution.row},${solution.column})`;
    },
    compute: [
      'const slots = $slots;',
      'const row = slots.start.row + slots.rowMove;',
      'const column = slots.start.column + slots.columnMove;',
      'return "(" + row + "," + column + ")";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A position is written as (row, column), so the two coordinates are tracked separately.',
        `The row move of ${slots.rowMove} changes only the first coordinate: ${slots.start.row} + ${slots.rowMove} = ${solution.row}.`,
        `The column move of ${slots.columnMove} changes only the second coordinate: ${slots.start.column} + ${slots.columnMove} = ${solution.column}.`,
        `Combining the two independent moves gives the final position (${solution.row},${solution.column}).`
      ];
    }
  },
  {
    template: 'Covering with Rectangular Tiles',
    type: 'covering-with-rectangular-tiles',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/A (\d+)×(\d+) surface is covered exactly, without cutting, by (\d+)×(\d+) tiles/);
      if (match === null) {
        throw new Error('the surface or tile dimensions are missing');
      }
      return {
        surfaceLength: Number(match[1]),
        surfaceWidth: Number(match[2]),
        tileLength: Number(match[3]),
        tileWidth: Number(match[4])
      };
    },
    solve(slots) {
      if (slots.surfaceLength % slots.tileLength !== 0 || slots.surfaceWidth % slots.tileWidth !== 0) {
        throw new Error('the tiles do not cover the surface exactly');
      }
      return {
        alongLength: slots.surfaceLength / slots.tileLength,
        alongWidth: slots.surfaceWidth / slots.tileWidth
      };
    },
    render(solution) {
      return String(solution.alongLength * solution.alongWidth);
    },
    compute: [
      'const slots = $slots;',
      'if (slots.surfaceLength % slots.tileLength !== 0 || slots.surfaceWidth % slots.tileWidth !== 0) {',
      '  throw new Error("the tiles do not cover the surface exactly");',
      '}',
      'const alongLength = slots.surfaceLength / slots.tileLength;',
      'const alongWidth = slots.surfaceWidth / slots.tileWidth;',
      'return String(Math.round(alongLength * alongWidth));'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `All tiles have the same orientation, so the tiling is a regular grid of ${slots.tileLength}×${slots.tileWidth} tiles.`,
        `Along the length, ${slots.surfaceLength} ÷ ${slots.tileLength} = ${solution.alongLength} tiles fit; along the width, ${slots.surfaceWidth} ÷ ${slots.tileWidth} = ${solution.alongWidth} tiles fit.`,
        `The number of tiles is the product of the two counts, ${solution.alongLength} × ${solution.alongWidth} = ${solution.alongLength * solution.alongWidth}, and exact division means no tile is cut.`
      ];
    }
  }
];
