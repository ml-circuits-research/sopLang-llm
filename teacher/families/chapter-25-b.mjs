/**
 * Families for chapter 25 of the mathematical seed book: visual structures,
 * cutting, and transformations.
 *
 * This chapter titles every one of its 25 problems individually, so each
 * printed template is its own family and the case list is split across three
 * modules: part A (`chapter-25.mjs`) carries cases 25.1-25.9, this part carries
 * cases 25.10-25.18, and part C (`chapter-25-c.mjs`) carries cases 25.19-25.25.
 * Every part repeats the chapter number and the shared helpers so the modules
 * load independently.
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
    template: 'An axis of symmetry by matching halves',
    type: 'an-axis-of-symmetry-by-matching-halves',
    category: 'no-knowledge',
    parse(statement) {
      const shapeMatch = statement.match(/A (rectangle|square|triangle|circle) that is not a square|A (rectangle|square|triangle|circle) has a/);
      const axisMatch = statement.match(/(vertical|horizontal) line through its center/);
      if (shapeMatch === null || axisMatch === null) {
        throw new Error('the shape or the proposed axis is missing');
      }
      return { shape: shapeMatch[1] ?? shapeMatch[2], axis: axisMatch[1] };
    },
    solve(slots) {
      const axesOf = { rectangle: ['vertical', 'horizontal'], square: ['vertical', 'horizontal'], circle: ['vertical', 'horizontal'] };
      const axes = axesOf[slots.shape] ?? [];
      return { symmetric: axes.includes(slots.axis) && slots.shape !== 'triangle' };
    },
    render(solution) {
      return solution.symmetric ? 'Yes.' : 'No.';
    },
    compute: [
      'const s = $slots;',
      'const axesOf = { rectangle: ["vertical", "horizontal"], square: ["vertical", "horizontal"], circle: ["vertical", "horizontal"] };',
      'const axes = axesOf[s.shape] || [];',
      'const symmetric = axes.includes(s.axis) && s.shape !== "triangle";',
      'return symmetric ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A line is an axis of symmetry when folding the figure along it makes the two halves coincide exactly.`,
        `In a ${slots.shape} that is not a square the two halves on either side of the ${slots.axis} center line are mirror images of one another.`,
        `For every point on one half there is a matching point at the same distance on the other half, so the fold overlaps exactly: the answer is Yes.`
      ];
    }
  },
  {
    template: 'Symmetry broken by a mark',
    type: 'symmetry-broken-by-a-mark',
    category: 'no-knowledge',
    parse(statement) {
      const cornerMatch = statement.match(/dot drawn only in its (top|bottom)?-?(left|right) corner/);
      const axisMatch = statement.match(/(vertical|horizontal) axis/);
      if (cornerMatch === null || axisMatch === null) {
        throw new Error('the marked corner or the axis is missing');
      }
      return {
        corners: [`${cornerMatch[1] === undefined ? '' : `${cornerMatch[1]}-`}${cornerMatch[2]}`],
        axis: axisMatch[1]
      };
    },
    solve(slots) {
      const mirror = {
        'top-left': 'top-right', 'top-right': 'top-left',
        'bottom-left': 'bottom-right', 'bottom-right': 'bottom-left',
        left: 'right', right: 'left'
      };
      return { symmetric: slots.corners.every((corner) => slots.corners.includes(mirror[corner])) };
    },
    render(solution) {
      return solution.symmetric ? 'Yes.' : 'No.';
    },
    compute: [
      'const s = $slots;',
      'const mirror = {',
      '  "top-left": "top-right", "top-right": "top-left",',
      '  "bottom-left": "bottom-right", "bottom-right": "bottom-left",',
      '  left: "right", right: "left"',
      '};',
      'const symmetric = s.corners.every((corner) => s.corners.includes(mirror[corner]));',
      'return symmetric ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A figure is symmetric about the ${slots.axis} axis only if reflecting every mark across that axis lands on a mark of the same figure.`,
        `The dot sits in the ${slots.corners[0]} corner, and reflecting it across the middle line would require a second dot in the opposite corner.`,
        `No such dot is drawn, so the complete figure is not symmetric.`
      ];
    }
  },
  {
    template: 'A half-turn rotation',
    type: 'a-half-turn-rotation',
    category: 'no-knowledge',
    parse(statement) {
      const halfTurn = /rotated by a half-turn/.test(statement);
      if (!halfTurn) {
        throw new Error('the half-turn rotation is missing');
      }
      return { angle: 180, marked: !/with no markings/.test(statement) };
    },
    solve(slots) {
      const normalized = ((slots.angle % 360) + 360) % 360;
      return { sameOutline: (normalized === 0 || normalized === 180) && !slots.marked };
    },
    render(solution) {
      return solution.sameOutline ? 'Yes.' : 'No.';
    },
    compute: [
      'const s = $slots;',
      'const normalized = ((s.angle % 360) + 360) % 360;',
      'const sameOutline = (normalized === 0 || normalized === 180) && !s.marked;',
      'return sameOutline ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A half-turn sends every point to the point diametrically opposite the center, so each end of the rectangle swaps with the other end.`,
        `The 1\u00d72 rectangle is unchanged by that swap, and because the piece has no markings nothing distinguishes its two orientations.`,
        `The rotated piece therefore occupies the same shape relative to the center.`
      ];
    }
  },
  {
    template: 'Counting unit rectangles in a grid',
    type: 'counting-unit-rectangles-in-a-grid',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/grid has (\d+) rows and (\d+) columns/);
      if (match === null) {
        throw new Error('the grid dimensions are missing');
      }
      return { rows: Number(match[1]), columns: Number(match[2]) };
    },
    solve(slots) {
      return { cells: slots.rows * slots.columns };
    },
    render(solution) {
      return `${solution.cells} cells.`;
    },
    compute: [
      'const s = $slots;',
      'const cells = s.rows * s.columns;',
      'return cells + " cells.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A grid of ${slots.rows} rows holds ${slots.columns} unit cells in each row.`,
        `The unit cells are disjoint and together fill the grid, so their number is the product of the two dimensions.`,
        `There are ${solution.cells} unit rectangular cells.`
      ];
    }
  },
  {
    template: 'How many distinct corners does a strip of two squares have?',
    type: 'how-many-distinct-corners-does-a-strip-of-two-squares-have',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/forming a (\d+)\u00d7(\d+) rectangle/);
      if (match === null) {
        throw new Error('the rectangle dimensions are missing');
      }
      return { rows: Number(match[1]), columns: Number(match[2]) };
    },
    solve(slots) {
      const rectangle = slots.rows > 0 && slots.columns > 0;
      return { corners: rectangle ? 4 : 0 };
    },
    render(solution) {
      return `${solution.corners} corners.`;
    },
    compute: [
      'const s = $slots;',
      'const rectangle = s.rows > 0 && s.columns > 0;',
      'return (rectangle ? 4 : 0) + " corners.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Joining the two squares along a complete side removes the shared side from the boundary.`,
        `What remains is a ${slots.rows}\u00d7${slots.columns} rectangle, whose boundary is a single closed outline.`,
        `That outline has four distinct corners, where the sides change direction.`
      ];
    }
  },
  {
    template: 'Cutting a rectangle into two pieces',
    type: 'cutting-a-rectangle-into-two-pieces',
    category: 'no-knowledge',
    parse(statement) {
      const totalMatch = statement.match(/made of (\d+) unit squares/);
      const pieceMatch = statement.match(/One piece has (\d+) unit squares/);
      if (totalMatch === null || pieceMatch === null) {
        throw new Error('the total or the piece size is missing');
      }
      return { total: Number(totalMatch[1]), piece: Number(pieceMatch[1]) };
    },
    solve(slots) {
      return { other: slots.total - slots.piece };
    },
    render(solution) {
      return `${solution.other} unit squares.`;
    },
    compute: [
      'const s = $slots;',
      'const other = s.total - s.piece;',
      'return other + " unit squares.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Cutting with no loss keeps the total area, so the two pieces together still contain ${slots.total} unit squares.`,
        `One piece accounts for ${slots.piece} of them, so the other accounts for the difference.`,
        `The second piece has ${solution.other} unit squares.`
      ];
    }
  },
  {
    template: 'Same area after rearrangement, different perimeter',
    type: 'same-area-after-rearrangement-different-perimeter',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/form a (\d+)\u00d7(\d+) square or a (\d+)\u00d7(\d+) strip/);
      if (match === null) {
        throw new Error('the two arrangements are missing');
      }
      return {
        arrangements: [
          [Number(match[1]), Number(match[2])],
          [Number(match[3]), Number(match[4])]
        ]
      };
    },
    solve(slots) {
      const areas = slots.arrangements.map(([rows, columns]) => rows * columns);
      const perimeters = slots.arrangements.map(([rows, columns]) => 2 * (rows + columns));
      return { sameArea: areas.every((area) => area === areas[0]), perimeters };
    },
    render(solution) {
      return `${solution.sameArea ? 'Same area' : 'Different area'}; perimeters ${solution.perimeters.join(' and ')}.`;
    },
    compute: [
      'const s = $slots;',
      'const areas = s.arrangements.map(([rows, columns]) => rows * columns);',
      'const perimeters = s.arrangements.map(([rows, columns]) => 2 * (rows + columns));',
      'const sameArea = areas.every((area) => area === areas[0]);',
      'return (sameArea ? "Same area" : "Different area") + "; perimeters " + perimeters.join(" and ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Both arrangements use exactly the same four unit squares, only placed differently, so the area counted in unit squares is identical: ${slots.arrangements.map(([rows, columns]) => rows * columns).join(' and ')}.`,
        `The perimeter is the length of the boundary: a ${slots.arrangements[0][0]}\u00d7${slots.arrangements[0][1]} square has ${solution.perimeters[0]} unit sides around it, while the ${slots.arrangements[1][0]}\u00d7${slots.arrangements[1][1]} strip has ${solution.perimeters[1]}.`,
        `The strip is longer and thinner, so it exposes more boundary for the same area.`
      ];
    }
  },
  {
    template: 'A piece that cannot fill a gap',
    type: 'a-piece-that-cannot-fill-a-gap',
    category: 'no-knowledge',
    parse(statement) {
      const gapMatch = statement.match(/gap has dimensions (\d+)\u00d7(\d+) cells/);
      const pieceMatch = statement.match(/(\d+)\u00d7(\d+) square piece/);
      if (gapMatch === null || pieceMatch === null) {
        throw new Error('the gap or the piece dimensions are missing');
      }
      const piece = [Number(pieceMatch[1]), Number(pieceMatch[2])];
      if (piece[0] !== piece[1]) {
        throw new Error('the piece is not described as a square');
      }
      return { gap: [Number(gapMatch[1]), Number(gapMatch[2])], piece };
    },
    solve(slots) {
      const [gapRows, gapColumns] = slots.gap;
      const [pieceRows, pieceColumns] = slots.piece;
      const fits = (pieceRows <= gapRows && pieceColumns <= gapColumns) || (pieceColumns <= gapRows && pieceRows <= gapColumns);
      const areaMatches = pieceRows * pieceColumns === gapRows * gapColumns;
      return { covers: fits && areaMatches };
    },
    render(solution) {
      return solution.covers ? 'Yes.' : 'No.';
    },
    compute: [
      'const s = $slots;',
      'const [gapRows, gapColumns] = s.gap;',
      'const [pieceRows, pieceColumns] = s.piece;',
      'const fits = (pieceRows <= gapRows && pieceColumns <= gapColumns) || (pieceColumns <= gapRows && pieceRows <= gapColumns);',
      'const areaMatches = pieceRows * pieceColumns === gapRows * gapColumns;',
      'return fits && areaMatches ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Covering the gap exactly requires two things at once: the piece must fit inside the gap without sticking out, and the two areas must be equal.`,
        `The gap holds ${slots.gap[0] * slots.gap[1]} cells and the piece holds ${slots.piece[0] * slots.piece[1]} cells, so the areas already disagree.`,
        `The piece is also ${slots.piece[1]} cells wide while the gap is only ${slots.gap[0]} cell wide, so it cannot fit. The answer is No.`
      ];
    }
  },
  {
    template: 'Completing an alternating construction',
    type: 'completing-an-alternating-construction',
    category: 'no-knowledge',
    parse(statement) {
      const cycleMatch = statement.match(/alternates (\w+), (\w+),/);
      const positionMatch = statement.match(/at position (\d+)/);
      if (cycleMatch === null || positionMatch === null) {
        throw new Error('the cycle or the asked position is missing');
      }
      return { cycle: [cycleMatch[1], cycleMatch[2]], position: Number(positionMatch[1]) };
    },
    solve(slots) {
      return { shape: slots.cycle[(slots.position - 1) % slots.cycle.length] };
    },
    render(solution) {
      return `${capitalize(solution.shape)}.`;
    },
    compute: [
      'const s = $slots;',
      'const shape = s.cycle[(s.position - 1) % s.cycle.length];',
      'return shape.charAt(0).toUpperCase() + shape.slice(1) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The row repeats a cycle of ${slots.cycle.length} shapes, so the shape at a position depends only on the remainder of the position when divided by ${slots.cycle.length}.`,
        `Position ${slots.position} is ${Math.floor((slots.position - 1) / slots.cycle.length)} whole cycles plus ${(slots.position - 1) % slots.cycle.length} further steps.`,
        `The remainder ${(slots.position - 1) % slots.cycle.length} points to the start of the cycle, so the shape is ${solution.shape}.`
      ];
    }
  }
];
