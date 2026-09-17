/**
 * Families for chapter 14 of the mathematical seed book: area, perimeter, and
 * geometric decomposition.
 *
 * A family covers one printed template. It provides the reference parse that the
 * compiling model performs, an independent computation, the answer text the
 * source prints, the SOP Lang computation body that the circuit executes, and
 * the explanation lines of the example. Every rule the solutions need (the
 * unit-square definition of area, the perimeter formula, the additive rule for
 * non-overlapping parts) is stated inside the problem text, so every case of
 * this chapter is `no-knowledge`.
 */

export const chapter = 14;

export const cases = [
  {
    template: 'Area of a Rectangle',
    type: 'area-of-a-rectangle',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/measuring (\d+) units by (\d+) units/);
      if (match === null) {
        throw new Error('the rectangle side lengths are missing');
      }
      return { length: Number(match[1]), width: Number(match[2]) };
    },
    solve(slots) {
      const area = slots.length * slots.width;
      if (!Number.isInteger(area) || area <= 0) {
        throw new Error('the side lengths must be positive integers');
      }
      return { area };
    },
    render(solution) {
      return `${solution.area} square units.`;
    },
    compute: [
      'const slots = $slots;',
      'const area = slots.length * slots.width;',
      'if (!Number.isInteger(area) || area <= 0) {',
      '  throw new Error("the side lengths must be positive integers");',
      '}',
      'return String(area) + " square units.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement defines area as the number of unit squares that cover the rectangle, and it states that the area of a rectangle is length×width.',
        `The measured rectangle has sides ${slots.length} and ${slots.width}, so the covering is ${slots.length} rows of ${slots.width} unit squares.`,
        `Multiplying the two side lengths gives ${solution.area} square units, which is exactly the number of unit squares counted row by row.`
      ];
    }
  },
  {
    template: 'Side Length from a Known Area',
    type: 'side-length-from-a-known-area',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/an area of (\d+) unit squares and (\d+) squares in each row/);
      if (match === null) {
        throw new Error('the area or the squares per row are missing');
      }
      return { area: Number(match[1]), perRow: Number(match[2]) };
    },
    solve(slots) {
      if (slots.perRow <= 0 || slots.area % slots.perRow !== 0) {
        throw new Error('the area does not split into whole rows of that size');
      }
      return { rows: slots.area / slots.perRow };
    },
    render(solution) {
      return String(solution.rows);
    },
    compute: [
      'const slots = $slots;',
      'if (slots.perRow <= 0 || slots.area % slots.perRow !== 0) {',
      '  throw new Error("the area does not split into whole rows of that size");',
      '}',
      'return String(slots.area / slots.perRow);'
    ].join('\n'),
    explain(slots) {
      return [
        'The statement gives the rule area = number of rows × number of squares per row, so the unknown is the number of rows.',
        `The rectangle covers ${slots.area} unit squares and every row holds ${slots.perRow} of them, so the rows are the missing factor of the product.`,
        `Dividing the area by the row length recovers that factor: ${slots.area} ÷ ${slots.perRow}.`
      ];
    }
  },
  {
    template: 'Same Area, Different Perimeters',
    type: 'same-area-different-perimeters',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/R1 has sides (\d+) and (\d+); R2 has sides (\d+) and (\d+)/);
      if (match === null) {
        throw new Error('the side pairs of R1 and R2 are missing');
      }
      return {
        side1a: Number(match[1]),
        side1b: Number(match[2]),
        side2a: Number(match[3]),
        side2b: Number(match[4])
      };
    },
    solve(slots) {
      const area1 = slots.side1a * slots.side1b;
      const area2 = slots.side2a * slots.side2b;
      const perimeter1 = 2 * (slots.side1a + slots.side1b);
      const perimeter2 = 2 * (slots.side2a + slots.side2b);
      return { equalAreas: area1 === area2, perimeter1, perimeter2 };
    },
    render(solution) {
      const verdict = solution.equalAreas ? 'Equal areas' : 'Different areas';
      return `${verdict}; P1=${solution.perimeter1}, P2=${solution.perimeter2}.`;
    },
    compute: [
      'const slots = $slots;',
      'const area1 = slots.side1a * slots.side1b;',
      'const area2 = slots.side2a * slots.side2b;',
      'const perimeter1 = 2 * (slots.side1a + slots.side1b);',
      'const perimeter2 = 2 * (slots.side2a + slots.side2b);',
      'const verdict = area1 === area2 ? "Equal areas" : "Different areas";',
      'return verdict + "; P1=" + perimeter1 + ", P2=" + perimeter2 + ".";'
    ].join('\n'),
    explain(slots, solution) {
      const area1 = slots.side1a * slots.side1b;
      const area2 = slots.side2a * slots.side2b;
      return [
        'The two definitions in the statement give the two measurements that must be compared: area = product of the side lengths and perimeter = twice the sum of the side lengths.',
        `R1 covers ${area1} square units and R2 covers ${area2}, so the areas agree even though the side pairs differ.`,
        `The perimeters are the sums doubled: 2×(${slots.side1a}+${slots.side1b}) = ${solution.perimeter1} and 2×(${slots.side2a}+${slots.side2b}) = ${solution.perimeter2}.`,
        'Decomposing the same area into a longer, thinner rectangle therefore lengthens the boundary, which is what the comparison shows.'
      ];
    }
  },
  {
    template: 'Two Adjacent Rectangles',
    type: 'two-adjacent-rectangles',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/Both have height (\d+); the first has width (\d+), the second (\d+)/);
      if (match === null) {
        throw new Error('the common height or the two widths are missing');
      }
      return { height: Number(match[1]), width1: Number(match[2]), width2: Number(match[3]) };
    },
    solve(slots) {
      const first = slots.height * slots.width1;
      const second = slots.height * slots.width2;
      return { total: first + second };
    },
    render(solution) {
      return String(solution.total);
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.height * (slots.width1 + slots.width2));'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement gives the additive rule: the area of a composite figure built from non-overlapping parts is the sum of the areas of those parts.',
        `Each part is a rectangle of height ${slots.height}, so the first covers ${slots.height}×${slots.width1} and the second ${slots.height}×${slots.width2} square units.`,
        `Summing the two products gives ${solution.total}, and the shared height means the same total is ${slots.height}×(${slots.width1}+${slots.width2}).`
      ];
    }
  },
  {
    template: 'Fence on Three Sides',
    type: 'fence-on-three-sides',
    category: 'no-knowledge',
    parse(statement) {
      const size = statement.match(/garden is (\d+) m long and (\d+) m wide/);
      const wall = statement.match(/One of the (\d+) m sides is already a wall/);
      if (size === null || wall === null) {
        throw new Error('the garden dimensions or the wall side are missing');
      }
      return { length: Number(size[1]), width: Number(size[2]), wallLength: Number(wall[1]) };
    },
    solve(slots) {
      let fence;
      if (slots.wallLength === slots.length) {
        fence = slots.length + 2 * slots.width;
      } else if (slots.wallLength === slots.width) {
        fence = slots.width + 2 * slots.length;
      } else {
        throw new Error('the wall side is neither the length nor the width of the garden');
      }
      return { fence };
    },
    render(solution) {
      return `${solution.fence} m`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.wallLength !== slots.length && slots.wallLength !== slots.width) {',
      '  throw new Error("the wall side is neither the length nor the width of the garden");',
      '}',
      'const fence = slots.wallLength === slots.length',
      '  ? slots.length + 2 * slots.width',
      '  : slots.width + 2 * slots.length;',
      'return String(fence) + " m";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The fence goes around the garden, but one full side is already a wall, so only three of the four sides need fencing.',
        `The wall replaces one of the ${slots.length} m sides, which leaves the opposite ${slots.length} m side plus both ${slots.width} m sides.`,
        `Adding those three sides gives ${slots.length}+${slots.width}+${slots.width} = ${solution.fence} m, half of the perimeter plus the one remaining long side.`
      ];
    }
  }
];
