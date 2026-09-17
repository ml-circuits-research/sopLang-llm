/**
 * Families for chapter 28 of the mathematical seed book: systematic counting
 * and combinations.
 *
 * Every problem of this chapter is titled individually, so each printed heading
 * is a template with a single variant and gets its own family. All premises are
 * stated in the problem text (the listed choices, the restriction, the overlap),
 * so every case is `no-knowledge`: the counting rule is derived from the stated
 * options instead of a remembered formula.
 *
 * The 25 families of the chapter are split across `chapter-28.mjs`,
 * `chapter-28-b.mjs`, and `chapter-28-c.mjs`; each part declares the same
 * chapter number and repeats the shared helpers, so it loads on its own.
 */

export const chapter = 28;

const WORD_NUMBERS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
const ORDINALS = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5 };

function wordNumber(word) {
  const key = String(word).toLowerCase();
  if (!(key in WORD_NUMBERS)) {
    throw new Error(`unknown number word "${word}"`);
  }
  return WORD_NUMBERS[key];
}

function ordinal(word) {
  const key = String(word).toLowerCase();
  if (!(key in ORDINALS)) {
    throw new Error(`unknown ordinal word "${word}"`);
  }
  return ORDINALS[key];
}

function pick(statement, pattern, message) {
  const match = statement.match(pattern);
  if (match === null) {
    throw new Error(message);
  }
  return match;
}

function digitsOf(text) {
  return [...String(text).matchAll(/\d+/g)].map((match) => Number(match[0]));
}

function lettersOf(text) {
  return String(text).match(/[A-Z]/g) ?? [];
}

function splitOptions(text) {
  return String(text)
    .split(/,|\s+or\s+|\s+and\s+/)
    .map((token) => token.trim())
    .filter((token) => token !== '');
}

function factorial(value) {
  let total = 1;
  for (let index = 2; index <= value; index += 1) {
    total *= index;
  }
  return total;
}

function permutations(items) {
  if (items.length <= 1) {
    return [items];
  }
  return items.flatMap((item, index) =>
    permutations([...items.slice(0, index), ...items.slice(index + 1)]).map((rest) => [item, ...rest])
  );
}

function combinations(items, size) {
  const result = [];
  const walk = (start, chosen) => {
    if (chosen.length === size) {
      result.push(chosen);
      return;
    }
    for (let index = start; index < items.length; index += 1) {
      walk(index + 1, [...chosen, items[index]]);
    }
  };
  walk(0, []);
  return result;
}

function proseList(values) {
  const parts = values.map((value) => String(value));
  if (parts.length === 1) {
    return parts[0];
  }
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

export const cases = [
{
    template: 'Distributing two distinct objects into two boxes',
    type: 'distributing-two-distinct-objects-into-two-boxes',
    category: 'no-knowledge',
    parse(statement) {
      const before = statement.split(';')[0];
      const boxes = lettersOf(pick(statement, /box ([A-Z]) or ([A-Z])/, 'no boxes').slice(1, 3).join(','));
      return { balls: (before.match(/\bball\b/g) ?? []).length, boxes: boxes.length };
    },
    solve(slots) {
      return { total: Math.pow(slots.boxes, slots.balls) };
    },
    render(solution) {
      return `${solution.total} distributions.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(Math.pow(slots.boxes, slots.balls)) + " distributions.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each of the ${slots.balls} distinct balls independently chooses one of the ${slots.boxes} boxes.`,
        'The choices are independent, so the distributions are counted by a power.',
        `${slots.boxes}^${slots.balls} = ${solution.total} distributions, including the ones that empty a box.`
      ];
    }
  },
{
    template: 'Distribution with both boxes nonempty',
    type: 'distribution-with-both-boxes-nonempty',
    category: 'no-knowledge',
    parse(statement) {
      return {
        balls: wordNumber(pick(statement, /with (\w+) distinct balls/, 'no ball count').at(1)),
        boxes: wordNumber(pick(statement, /and (\w+) boxes/, 'no box count').at(1))
      };
    },
    solve(slots) {
      let total = 0;
      for (let empty = 0; empty <= slots.boxes; empty += 1) {
        let ways = 1;
        for (let step = 0; step < slots.balls; step += 1) {
          ways *= slots.boxes - empty;
        }
        total += (empty % 2 === 0 ? 1 : -1) * combinations([...Array(slots.boxes).keys()], empty).length * ways;
      }
      return { total };
    },
    render(solution) {
      return `${solution.total} distributions.`;
    },
    compute: [
      'const slots = $slots;',
      'const choose = (n, k) => {',
      '  let value = 1;',
      '  for (let step = 0; step < k; step += 1) {',
      '    value = value * (n - step) / (step + 1);',
      '  }',
      '  return Math.round(value);',
      '};',
      'let total = 0;',
      'for (let empty = 0; empty <= slots.boxes; empty += 1) {',
      '  total += (empty % 2 === 0 ? 1 : -1) * choose(slots.boxes, empty) * Math.pow(slots.boxes - empty, slots.balls);',
      '}',
      'return String(total) + " distributions.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Allowing empty boxes gives ${slots.boxes}^${slots.balls} distributions, but the problem requires every box to receive a ball.`,
        'Removing the assignments that leave a box empty, by inclusion and exclusion over the empty boxes, keeps only the distributions that use all boxes.',
        `With ${slots.balls} balls and ${slots.boxes} boxes, ${solution.total} distributions remain.`
      ];
    }
  },
{
    template: 'Choosing a route through ordered gates',
    type: 'choosing-a-route-through-ordered-gates',
    category: 'no-knowledge',
    parse(statement) {
      const first = lettersOf(pick(statement, /level-1 gate \(([A-Z]) or ([A-Z])\)/, 'no first gates').slice(1, 3).join(','));
      const branches = [...statement.matchAll(/After ([A-Z]), ([^;.]+?) are allowed/gi)].map((match) => ({
        from: match[1],
        to: splitOptions(match[2])
      }));
      if (branches.length === 0) {
        throw new Error('no allowed gate pairs found');
      }
      return { first, branches };
    },
    solve(slots) {
      return { total: slots.branches.reduce((sum, branch) => sum + branch.to.length, 0) };
    },
    render(solution) {
      return `${solution.total} routes.`;
    },
    compute: [
      'const slots = $slots;',
      'let total = 0;',
      'for (const branch of slots.branches) {',
      '  total += branch.to.length;',
      '}',
      'return String(total) + " routes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A route is fixed by the level-1 gate and then the level-2 gate allowed after it.',
        `Each first gate contributes its own list of continuations, so the route counts add: ${slots.branches.map((branch) => `${branch.from}→${branch.to.length}`).join(' and ')}.`,
        `The total is ${solution.total} distinct routes.`
      ];
    }
  },
{
    template: 'Counting with overlap between two lists',
    type: 'counting-with-overlap-between-two-lists',
    category: 'no-knowledge',
    parse(statement) {
      return {
        a: Number(pick(statement, /List A contains (\d+) children/, 'no list A size').at(1)),
        b: Number(pick(statement, /list B contains (\d+)[,.]/, 'no list B size').at(1)),
        both: Number(pick(statement, /(\d+) children are on both/, 'no overlap size').at(1))
      };
    },
    solve(slots) {
      return { total: slots.a + slots.b - slots.both };
    },
    render(solution) {
      return `${solution.total} children.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.a + slots.b - slots.both) + " children.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Adding the two lists counts the ${slots.both} children on both lists twice.`,
        'Subtracting the overlap once counts every child exactly once.',
        `${slots.a} + ${slots.b} − ${slots.both} = ${solution.total} different children.`
      ];
    }
  },
{
    template: 'Choosing two objects of different colors',
    type: 'choosing-two-objects-of-different-colors',
    category: 'no-knowledge',
    parse(statement) {
      return {
        red: Number(pick(statement, /(\d+) distinct red balls/, 'no red ball count').at(1)),
        blue: Number(pick(statement, /(\d+) distinct blue balls/, 'no blue ball count').at(1))
      };
    },
    solve(slots) {
      return { total: slots.red * slots.blue };
    },
    render(solution) {
      return `${solution.total} pairs.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.red * slots.blue) + " pairs.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A mixed pair takes one red ball and one blue ball, so the colors fix the roles.`,
        `There are ${slots.red} red choices and, independently, ${slots.blue} blue choices.`,
        `${slots.red} × ${slots.blue} = ${solution.total} pairs of different colors.`
      ];
    }
  },
{
    template: 'Circular arrangements with a fixed reference point',
    type: 'circular-arrangements-with-a-fixed-reference-point',
    category: 'no-knowledge',
    parse(statement) {
      return {
        items: lettersOf(pick(statement, /flags ([A-Z](?:,\s*[A-Z])*)/, 'no flag list').at(1)),
        fixed: pick(statement, /fix ([A-Z]) at the top/, 'no fixed flag').at(1)
      };
    },
    solve(slots) {
      return { total: factorial(slots.items.length - 1) };
    },
    render(solution) {
      return `${solution.total} ways.`;
    },
    compute: [
      'const slots = $slots;',
      'let total = 1;',
      'for (let step = 2; step <= slots.items.length - 1; step += 1) {',
      '  total *= step;',
      '}',
      'return String(total) + " ways.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Fixing ${slots.fixed} at the top removes the rotations from the count, so each circled arrangement is counted once.`,
        `That leaves the other ${slots.items.length - 1} flags to be placed in the remaining positions.`,
        `They can be ordered in ${solution.total} ways.`
      ];
    }
  },
{
    template: 'Number of handshakes',
    type: 'number-of-handshakes',
    category: 'no-knowledge',
    parse(statement) {
      return { children: wordNumber(pick(statement, /(\w+) children greet/, 'no child count').at(1)) };
    },
    solve(slots) {
      return { total: (slots.children * (slots.children - 1)) / 2 };
    },
    render(solution) {
      return `${solution.total} handshakes.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.children * (slots.children - 1) / 2) + " handshakes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each handshake is an unordered pair of the ${slots.children} children.`,
        `Ordering the pairs first gives ${slots.children} × ${slots.children - 1}, which counts each pair twice.`,
        `Halving that count gives ${solution.total} handshakes.`
      ];
    }
  }
];
