/**
 * Families for chapter 5 of the mathematical seed book: measurement, time,
 * money, and space.
 *
 * A family covers one printed template. It provides the reference parse that
 * the compiling model performs on the printed statement, an independent
 * computation, the answer text the source prints, the SOP Lang computation
 * body that the circuit executes, and the explanation lines of the example.
 * Most problems state every premise, but the timeline template turns a number
 * of hours into a clock time, which relies on the conventions that an hour
 * holds sixty minutes and a day holds twenty-four hours; those facts are not
 * stated, so that family is `knowledge` and materializes them in a
 * `@facts literal` wire.
 */

export const unit = 5;

const TIME_FACTS = Object.freeze({ minutesPerHour: 60, hoursPerDay: 24 });

const TIMELINE_WIRES = [
  {
    name: 'clock',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const facts = $facts;',
      'const minutesPerHour = facts.minutesPerHour;',
      'const hoursPerDay = facts.hoursPerDay;',
      'const day = hoursPerDay * minutesPerHour;',
      'const start = slots.hour * minutesPerHour + slots.minute;',
      'const end = ((start + slots.hours * minutesPerHour) % day + day) % day;',
      'return { endHour: Math.floor(end / minutesPerHour), endMinute: end % minutesPerHour };'
    ].join('\n')
  }
];

const TIMELINE_COMPUTE = [
  'return $clock.endHour + ":" + ($clock.endMinute < 10 ? "0" + $clock.endMinute : String($clock.endMinute));'
];

export const cases = [
  {
    template: 'Coins with Given Values',
    type: 'coins-with-given-values',
    category: 'no-knowledge',
    parse(statement) {
      const valuesMatch = statement.match(/coins worth (\d+) lei and (\d+) lei/);
      const totalMatch = statement.match(/worth exactly (\d+) lei\./);
      if (valuesMatch === null || totalMatch === null) {
        throw new Error('the coin values or the target total is missing');
      }
      return { first: Number(valuesMatch[1]), second: Number(valuesMatch[2]), total: Number(totalMatch[1]) };
    },
    solve(slots) {
      if (slots.first <= 0 || slots.second <= 0) {
        throw new Error('coin values must be positive');
      }
      // Among all exact combinations, the one with the fewest coins.
      let best = null;
      for (let countSecond = Math.floor(slots.total / slots.second); countSecond >= 0; countSecond -= 1) {
        const rest = slots.total - countSecond * slots.second;
        if (rest % slots.first === 0) {
          const countFirst = rest / slots.first;
          if (best === null || countFirst + countSecond < best.countFirst + best.countSecond) {
            best = { countFirst, countSecond };
          }
        }
      }
      if (best === null) {
        throw new Error(`no combination of ${slots.first} and ${slots.second} reaches ${slots.total}`);
      }
      return { ...best, first: slots.first, second: slots.second };
    },
    render(solution) {
      const coins = (count, value) => `${count} coin${count === 1 ? '' : 's'} worth ${value} lei`;
      return `${coins(solution.countFirst, solution.first)} and ${coins(solution.countSecond, solution.second)}.`;
    },
    wires: [
      {
        name: 'best',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          'if (slots.first <= 0 || slots.second <= 0) {',
          '  throw new Error("coin values must be positive");',
          '}',
          'let best = null;',
          'for (let countSecond = Math.floor(slots.total / slots.second); countSecond >= 0; countSecond -= 1) {',
          '  const rest = slots.total - countSecond * slots.second;',
          '  if (rest % slots.first === 0) {',
          '    const countFirst = rest / slots.first;',
          '    if (best === null || countFirst + countSecond < best.countFirst + best.countSecond) {',
          '      best = { countFirst: countFirst, countSecond: countSecond };',
          '    }',
          '  }',
          '}',
          'if (best === null) {',
          '  throw new Error(`no combination of ${slots.first} and ${slots.second} reaches ${slots.total}`);',
          '}',
          'return best;'
        ].join('\n')
      }
    ],
    compute: [
      'const coin = (count, value) => count + " coin" + (count === 1 ? "" : "s") + " worth " + value + " lei";',
      'return coin($best.countFirst, $slots.first) + " and " + coin($best.countSecond, $slots.second) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A combination works when some nonnegative number of ${slots.first}-lei coins plus some nonnegative number of ${slots.second}-lei coins adds up to exactly ${slots.total}.`,
        `Scanning the possible numbers of the larger coin leaves the remainder to be paid with the smaller coin, which is possible only when that remainder is a multiple of ${slots.first}.`,
        `The combination that uses the fewest coins is ${solution.countFirst} coins worth ${slots.first} lei and ${solution.countSecond} coins worth ${slots.second} lei.`,
        `Checking the value: ${solution.countFirst} × ${slots.first} + ${solution.countSecond} × ${slots.second} = ${slots.total}.`
      ];
    }
  },
  {
    template: 'Timeline',
    type: 'timeline',
    category: 'knowledge',
    parse(statement) {
      const match = statement.match(/starts at (\d{1,2}):(\d{2}) and lasts exactly (\d+) hours?\./);
      if (match === null) {
        throw new Error('the start time or the duration is missing');
      }
      const hour = Number(match[1]);
      const minute = Number(match[2]);
      if (hour > 23 || minute > 59) {
        throw new Error(`"${match[1]}:${match[2]}" is not a valid clock time`);
      }
      return { hour, minute, hours: Number(match[3]) };
    },
    solve(slots) {
      const day = TIME_FACTS.hoursPerDay * TIME_FACTS.minutesPerHour;
      const start = slots.hour * TIME_FACTS.minutesPerHour + slots.minute;
      const end = ((start + slots.hours * TIME_FACTS.minutesPerHour) % day + day) % day;
      return { endHour: Math.floor(end / TIME_FACTS.minutesPerHour), endMinute: end % TIME_FACTS.minutesPerHour };
    },
    render(solution) {
      return `${solution.endHour}:${String(solution.endMinute).padStart(2, '0')}`;
    },
    facts: JSON.stringify(TIME_FACTS),
    wires: TIMELINE_WIRES,
    compute: TIMELINE_COMPUTE.join('\n'),
    explain(slots, solution) {
      return [
        `A clock time uses the convention that one hour is ${TIME_FACTS.minutesPerHour} minutes and one day is ${TIME_FACTS.hoursPerDay} hours, and those conventions are supplied as facts rather than assumed.`,
        `The start time ${slots.hour}:${String(slots.minute).padStart(2, '0')} becomes ${slots.hour * TIME_FACTS.minutesPerHour + slots.minute} minutes after midnight.`,
        `Adding ${slots.hours} hours means adding ${slots.hours * TIME_FACTS.minutesPerHour} minutes, and reading the total back in hours and minutes gives ${solution.endHour}:${String(solution.endMinute).padStart(2, '0')}.`
      ];
    }
  },
  {
    template: 'A Route of Three Segments',
    type: 'a-route-of-three-segments',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/three consecutive segments measuring (\d+) (\w+), (\d+) \w+, and (\d+) \w+\./);
      if (match === null) {
        throw new Error('the three segment lengths are missing');
      }
      return { lengths: [Number(match[1]), Number(match[3]), Number(match[4])], unit: match[2] };
    },
    solve(slots) {
      return { total: slots.lengths.reduce((sum, value) => sum + value, 0) };
    },
    render(solution) {
      return `${solution.total} cm`;
    },
    compute: [
      'const slots = $slots;',
      'const total = slots.lengths.reduce((sum, value) => sum + value, 0);',
      'return total + " " + slots.unit;'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A route made of consecutive segments with no overlaps has a length equal to the sum of the segment lengths, as the given rule states.`,
        `The three segments measure ${slots.lengths.join(', ')} in the same unit, so they can be added directly without any conversion.`,
        `The total is ${slots.lengths.join(' + ')} = ${solution.total}, reported in ${slots.unit}.`
      ];
    }
  },
  {
    template: 'Classify by Number of Sides',
    type: 'classify-by-number-of-sides',
    category: 'no-knowledge',
    parse(statement) {
      const definitionMatch = statement.match(/we define a .([a-z]+). as a closed shape with (\d+) sides\./);
      const shapesMatch = statement.match(/three shapes: one with (\d+) sides, one with (\d+) sides, and one with (\d+) sides\./);
      if (definitionMatch === null || shapesMatch === null) {
        throw new Error('the definition or the candidate shapes are missing');
      }
      return {
        required: Number(definitionMatch[2]),
        candidates: [Number(shapesMatch[1]), Number(shapesMatch[2]), Number(shapesMatch[3])]
      };
    },
    solve(slots) {
      const matching = slots.candidates.filter((value) => value === slots.required);
      if (matching.length !== 1) {
        throw new Error(`${matching.length} candidate shapes satisfy the definition instead of one`);
      }
      return { sides: matching[0], candidates: slots.candidates, required: slots.required };
    },
    render(solution) {
      return `The shape with ${solution.sides} sides.`;
    },
    compute: [
      'const slots = $slots;',
      'const matching = slots.candidates.filter((value) => value === slots.required);',
      'if (matching.length !== 1) {',
      '  throw new Error(`${matching.length} candidate shapes satisfy the definition instead of one`);',
      '}',
      'return "The shape with " + matching[0] + " sides.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The definition fixes the required number of sides at ${slots.required}, so it acts as a test for each candidate shape.`,
        `Testing the candidates ${slots.candidates.join(', ')} against that number leaves exactly one match.`,
        `The shape with ${solution.sides} sides satisfies the definition, and the other candidates have too few or too many sides.`
      ];
    }
  },
  {
    template: 'Route on a Grid',
    type: 'route-on-a-grid',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/move (\d+) squares? to the right and (\d+) squares? upward\./);
      if (match === null) {
        throw new Error('the horizontal or the vertical distance is missing');
      }
      return { right: Number(match[1]), up: Number(match[2]) };
    },
    solve(slots) {
      return { moves: slots.right + slots.up, right: slots.right, up: slots.up };
    },
    render(solution) {
      return `${solution.moves} moves.`;
    },
    compute: [
      'const slots = $slots;',
      'const moves = slots.right + slots.up;',
      'return moves + " moves.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each move goes to exactly one neighboring square, either horizontally or vertically, and the robot never moves backward.`,
        `Reaching ${slots.right} squares to the right costs ${slots.right} horizontal moves and reaching ${slots.up} squares upward costs ${slots.up} vertical moves.`,
        `Because no move is wasted or repeated, the total is independent of the order: ${slots.right} + ${slots.up} = ${solution.moves} moves.`
      ];
    }
  }
];
