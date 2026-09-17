/**
 * Families for chapter 10 of the mathematical seed book: geometry and
 * measurement through definitions.
 *
 * The chapter fixes the meaning of the perimeter, of a polyline length, and of
 * an area counted in unit squares directly in each statement, so those
 * templates carry no outside fact. The "meters and centimeters" template
 * converts between two units, so it materializes the unit convention as a
 * `@facts literal` wire and is a `knowledge` case.
 */

export const chapter = 10;

/** Unit convention external to the problem text, materialized in the circuit. */
const CENTIMETERS_PER_METER = 100;

export const cases = [
  {
    template: 'Perimeter of a Rectangle',
    type: 'perimeter-of-a-rectangle',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/two sides of (\d+) cm and two sides of (\d+) cm/);
      if (match === null) {
        throw new Error('the two side lengths are missing');
      }
      return { first: Number(match[1]), second: Number(match[2]) };
    },
    solve(slots) {
      return { perimeter: 2 * (slots.first + slots.second) };
    },
    render(solution) {
      return `${solution.perimeter} cm`;
    },
    compute: [
      'const slots = $slots;',
      'const perimeter = 2 * (slots.first + slots.second);',
      'return perimeter + " cm";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A rectangle has two sides of ${slots.first} cm and two sides of ${slots.second} cm.`,
        'The statement defines the perimeter as the sum of the lengths of all sides, so each of the two lengths appears twice.',
        `Adding the four sides is the same as 2 · (${slots.first} + ${slots.second}).`,
        `The perimeter is ${solution.perimeter} cm.`
      ];
    }
  },
  {
    template: 'Unknown Side from the Perimeter',
    type: 'unknown-side-from-the-perimeter',
    category: 'no-knowledge',
    parse(statement) {
      const perimeterMatch = statement.match(/perimeter (\d+) cm/);
      const knownMatch = statement.match(/each (\d+) cm/);
      if (perimeterMatch === null || knownMatch === null) {
        throw new Error('the perimeter or the known side is missing');
      }
      return { perimeter: Number(perimeterMatch[1]), known: Number(knownMatch[1]) };
    },
    solve(slots) {
      const remaining = slots.perimeter - 2 * slots.known;
      if (remaining % 2 !== 0) {
        throw new Error('the remaining length does not split into two equal sides');
      }
      return { unknown: remaining / 2 };
    },
    render(solution) {
      return `${solution.unknown} cm`;
    },
    compute: [
      'const slots = $slots;',
      'const remaining = slots.perimeter - 2 * slots.known;',
      'if (remaining % 2 !== 0) {',
      '  throw new Error("the remaining length does not split into two equal sides");',
      '}',
      'const unknown = remaining / 2;',
      'return unknown + " cm";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The perimeter is ${slots.perimeter} cm and the two known opposite sides are ${slots.known} cm each.`,
        'The two known sides account for 2 · ' + slots.known + ' = ' + 2 * slots.known + ' cm of the perimeter.',
        `The two remaining sides are equal, so the pair is ${slots.perimeter} − ${2 * slots.known} = ${slots.perimeter - 2 * slots.known} cm and each one is half of that.`,
        `The unknown side is ${solution.unknown} cm.`
      ];
    }
  },
  {
    template: 'Meters and Centimeters',
    type: 'meters-and-centimeters',
    category: 'knowledge',
    parse(statement) {
      const match = statement.match(/A ribbon is (\d+) m plus another (\d+) cm/);
      if (match === null) {
        throw new Error('the meters and centimeters parts are missing');
      }
      return { meters: Number(match[1]), centimeters: Number(match[2]) };
    },
    solve(slots) {
      return { total: slots.meters * CENTIMETERS_PER_METER + slots.centimeters };
    },
    render(solution) {
      return `${solution.total} cm`;
    },
    facts: '{"centimetersPerMeter": 100}',
    compute: [
      'const slots = $slots;',
      'const facts = $facts;',
      'const total = slots.meters * facts.centimetersPerMeter + slots.centimeters;',
      'return total + " cm";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The ribbon is ${slots.meters} m plus another ${slots.centimeters} cm.`,
        'A meter is a larger unit than a centimeter, so the two parts cannot be added before the meters are converted.',
        `The unit rule 1 m = ${CENTIMETERS_PER_METER} cm turns ${slots.meters} m into ${slots.meters * CENTIMETERS_PER_METER} cm.`,
        `Adding the converted part and the extra part gives ${solution.total} cm.`
      ];
    }
  },
  {
    template: 'Polyline',
    type: 'polyline',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/segments with lengths ([0-9,\s]+) cm/);
      if (match === null) {
        throw new Error('the segment lengths are missing');
      }
      const segments = match[1].split(',').map((value) => Number(value.trim()));
      if (segments.some((value) => !Number.isInteger(value))) {
        throw new Error('a segment length is not an integer');
      }
      return { segments };
    },
    solve(slots) {
      return { total: slots.segments.reduce((sum, value) => sum + value, 0) };
    },
    render(solution) {
      return `${solution.total} cm`;
    },
    compute: [
      'const slots = $slots;',
      'let total = 0;',
      'for (const segment of slots.segments) {',
      '  total += segment;',
      '}',
      'return total + " cm";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The polyline is traversed segment by segment, so its length is the total distance walked along it.`,
        `The stated rule says the segments are added one after another: ${slots.segments.join(' + ')}.`,
        `Their sum is ${solution.total} cm.`
      ];
    }
  },
  {
    template: 'Area as a Number of Unit Squares',
    type: 'area-as-a-number-of-unit-squares',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/with (\d+) rows and (\d+) columns/);
      if (match === null) {
        throw new Error('the grid dimensions are missing');
      }
      return { rows: Number(match[1]), columns: Number(match[2]) };
    },
    solve(slots) {
      return { area: slots.rows * slots.columns };
    },
    render(solution) {
      return `${solution.area} unit squares.`;
    },
    compute: [
      'const slots = $slots;',
      'const area = slots.rows * slots.columns;',
      'return area + " unit squares.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The figure is covered without gaps or overlaps by ${slots.rows} rows of ${slots.columns} identical squares.`,
        'The definition of the area in unit squares counts exactly those covering squares.',
        `Each row holds ${slots.columns} squares, and there are ${slots.rows} rows, so the count is ${slots.rows} · ${slots.columns}.`,
        `The area is ${solution.area} unit squares.`
      ];
    }
  }
];
