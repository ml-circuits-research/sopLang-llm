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

export const unit = 28;

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
    template: 'Arrangements of three distinct objects',
    type: 'arrangements-of-three-distinct-objects',
    category: 'no-knowledge',
    parse(statement) {
      return { items: lettersOf(pick(statement, /Books ([A-Z](?:,\s*[A-Z])*)/, 'no book list').at(1)) };
    },
    solve(slots) {
      return { total: factorial(slots.items.length) };
    },
    render(solution) {
      return `${solution.total} orders.`;
    },
    compute: [
      'const slots = $slots;',
      'let total = 1;',
      'for (let step = 2; step <= slots.items.length; step += 1) {',
      '  total *= step;',
      '}',
      'return String(total) + " orders.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `All ${slots.items.length} books are distinct, so an order is a permutation of the whole set.`,
        'The first position takes any book, and each later position loses one available book.',
        `Multiplying ${slots.items.length} × ${slots.items.length - 1} × … × 1 gives ${solution.total} orders.`
      ];
    }
  },
{
    template: 'Arrangements with one book fixed',
    type: 'arrangements-with-one-book-fixed',
    category: 'no-knowledge',
    parse(statement) {
      return {
        items: lettersOf(pick(statement, /Books ([A-Z](?:,\s*[A-Z])*)/, 'no book list').at(1)),
        fixed: pick(statement, /but ([A-Z]) must be first/, 'no fixed book').at(1)
      };
    },
    solve(slots) {
      return { total: factorial(slots.items.length - 1) };
    },
    render(solution) {
      return `${solution.total} orders.`;
    },
    compute: [
      'const slots = $slots;',
      'let total = 1;',
      'for (let step = 2; step <= slots.items.length - 1; step += 1) {',
      '  total *= step;',
      '}',
      'return String(total) + " orders.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `${slots.fixed} is fixed in the first position, so only the other books can move.`,
        `The remaining ${slots.items.length - 1} books permute freely among the remaining positions.`,
        `That gives ${solution.total} orders, the same as permuting ${slots.items.length - 1} books.`
      ];
    }
  },
{
    template: 'Arrangements where two objects must be adjacent',
    type: 'arrangements-where-two-objects-must-be-adjacent',
    category: 'no-knowledge',
    parse(statement) {
      const pair = pick(statement, /([A-Z]) and ([A-Z]) must be next to each other/, 'no adjacency requirement');
      return {
        items: lettersOf(pick(statement, /^([A-Z](?:,\s*[A-Z])*)/, 'no object list').at(1)),
        first: pair.at(1),
        second: pair.at(2)
      };
    },
    solve(slots) {
      const adjacent = permutations(slots.items).filter(
        (order) => Math.abs(order.indexOf(slots.first) - order.indexOf(slots.second)) === 1
      );
      return { total: adjacent.length };
    },
    render(solution) {
      return `${solution.total} orders.`;
    },
    compute: [
      'const slots = $slots;',
      'const permute = (items) => items.length <= 1 ? [items] : items.flatMap((item, index) => permute(items.slice(0, index).concat(items.slice(index + 1))).map((rest) => [item].concat(rest)));',
      'let total = 0;',
      'for (const order of permute(slots.items)) {',
      '  if (Math.abs(order.indexOf(slots.first) - order.indexOf(slots.second)) === 1) {',
      '    total += 1;',
      '  }',
      '}',
      'return String(total) + " orders.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The requirement only concerns ${slots.first} and ${slots.second}, so the other arrangements are the permutations that keep those two next to each other.`,
        'Checking every order of the objects and keeping the ones where the two positions differ by one is a direct count.',
        `Out of all orders, ${solution.total} place ${slots.first} and ${slots.second} side by side.`
      ];
    }
  },
{
    template: 'Choosing a pair with an incompatibility',
    type: 'choosing-a-pair-with-an-incompatibility',
    category: 'no-knowledge',
    parse(statement) {
      const bad = pick(statement, /but ([A-Z]) and ([A-Z]) cannot be together/, 'no incompatible pair');
      return {
        people: lettersOf(pick(statement, /From ([A-Z](?:,\s*[A-Z])*) choose/, 'no people list').at(1)),
        size: wordNumber(pick(statement, /choose (\w+) people/, 'no team size').at(1)),
        first: bad.at(1),
        second: bad.at(2)
      };
    },
    solve(slots) {
      const badKey = [slots.first, slots.second].sort().join('');
      const valid = combinations(slots.people, slots.size).filter((team) => team.slice().sort().join('') !== badKey);
      return { total: valid.length };
    },
    render(solution) {
      return `${solution.total} teams.`;
    },
    compute: [
      'const slots = $slots;',
      'const badKey = [slots.first, slots.second].sort().join("");',
      'let total = 0;',
      'const walk = (start, chosen) => {',
      '  if (chosen.length === slots.size) {',
      '    if (chosen.slice().sort().join("") !== badKey) {',
      '      total += 1;',
      '    }',
      '    return;',
      '  }',
      '  for (let index = start; index < slots.people.length; index += 1) {',
      '    walk(index + 1, chosen.concat(slots.people[index]));',
      '  }',
      '};',
      'walk(0, []);',
      'return String(total) + " teams.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Every team is a pair of people, and the pair ${slots.first}${slots.second} is forbidden.`,
        `Counting all pairs first and then removing the forbidden one is the complement idea.`,
        `That leaves ${solution.total} admissible teams.`
      ];
    }
  },
{
    template: 'A code with a restricted first digit',
    type: 'a-code-with-a-restricted-first-digit',
    category: 'no-knowledge',
    parse(statement) {
      return {
        firstOptions: digitsOf(pick(statement, /The first may be only (.+?);/, 'no first-position rule').at(1)).map(String),
        secondOptions: digitsOf(pick(statement, /[Tt]he second may be (.+?)\./, 'no second-position rule').at(1)).map(String)
      };
    },
    solve(slots) {
      return { total: slots.firstOptions.length * slots.secondOptions.length };
    },
    render(solution) {
      return `${solution.total} codes.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.firstOptions.length * slots.secondOptions.length) + " codes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The first digit may be only ${slots.firstOptions.join(' or ')}, giving ${slots.firstOptions.length} options.`,
        `The second digit may be any of ${slots.secondOptions.join(', ')}, giving ${slots.secondOptions.length} options.`,
        `The two positions are chosen independently, so ${slots.firstOptions.length} × ${slots.secondOptions.length} = ${solution.total} codes.`
      ];
    }
  },
{
    template: 'A code that must contain a given digit',
    type: 'a-code-that-must-contain-a-given-digit',
    category: 'no-knowledge',
    parse(statement) {
      return {
        digits: digitsOf(pick(statement, /use ([0-9,\s]+?) with repetition/, 'no digit list').at(1)),
        special: Number(pick(statement, /at least one (\d)/, 'no required digit').at(1)),
        length: wordNumber(pick(statement, /(\w+)-digit/, 'no code length').at(1))
      };
    },
    solve(slots) {
      const all = Math.pow(slots.digits.length, slots.length);
      const without = Math.pow(slots.digits.length - 1, slots.length);
      return { total: all - without };
    },
    render(solution) {
      return `${solution.total} codes.`;
    },
    compute: [
      'const slots = $slots;',
      'const all = Math.pow(slots.digits.length, slots.length);',
      'const without = Math.pow(slots.digits.length - 1, slots.length);',
      'return String(all - without) + " codes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `All ${slots.digits.length}-digit codes over ${slots.digits.length} choices number ${Math.pow(slots.digits.length, slots.length)}.`,
        `Codes without the digit ${slots.special} use only the other ${slots.digits.length - 1} digits, giving ${Math.pow(slots.digits.length - 1, slots.length)}.`,
        `Keeping the codes that contain ${slots.special} at least once leaves ${solution.total}.`
      ];
    }
  },
{
    template: 'Exactly one 1 in a code',
    type: 'exactly-one-1-in-a-code',
    category: 'no-knowledge',
    parse(statement) {
      return {
        digits: digitsOf(pick(statement, /from ([0-9,\s]+?), with repetition/, 'no digit list').at(1)),
        special: Number(pick(statement, /exactly one (\d)/, 'no special digit').at(1)),
        length: wordNumber(pick(statement, /have (\w+) digits/, 'no code length').at(1))
      };
    },
    solve(slots) {
      return { total: slots.length * Math.pow(slots.digits.length - 1, slots.length - 1) };
    },
    render(solution) {
      return `${solution.total} codes.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.length * Math.pow(slots.digits.length - 1, slots.length - 1)) + " codes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The digit ${slots.special} appears exactly once, so first choose which of the ${slots.length} positions holds it.`,
        `Each remaining position takes any of the other ${slots.digits.length - 1} digits.`,
        `${slots.length} × ${slots.digits.length - 1} = ${solution.total} codes.`
      ];
    }
  },
{
    template: 'Two simplified dice',
    type: 'two-simplified-dice',
    category: 'no-knowledge',
    parse(statement) {
      return {
        faces: [...new Set(digitsOf(pick(statement, /numbered ([0-9\s,and]+?),/, 'no faces').at(1)))],
        cubes: wordNumber(pick(statement, /(\w+) cubes/, 'no cube count').at(1))
      };
    },
    solve(slots) {
      return { total: Math.pow(slots.faces.length, slots.cubes) };
    },
    render(solution) {
      return `${solution.total} results.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(Math.pow(slots.faces.length, slots.cubes)) + " results.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each of the ${slots.cubes} cubes shows one of ${slots.faces.length} faces.`,
        'The cubes are independent, so each cube multiplies the number of pairs by its face count.',
        `${slots.faces.length}^${slots.cubes} = ${solution.total} distinct ordered results.`
      ];
    }
  },
{
    template: 'Possible sums, not possible outcomes',
    type: 'possible-sums-not-possible-outcomes',
    category: 'no-knowledge',
    parse(statement) {
      return {
        faces: [...new Set(digitsOf(pick(statement, /faces ([0-9\s,and]+),/, 'no faces').at(1)))],
        cubes: wordNumber(pick(statement, /the (\w+) cubes/, 'no cube count').at(1))
      };
    },
    solve(slots) {
      const sums = new Set();
      const walk = (left, total) => {
        if (left === 0) {
          sums.add(total);
          return;
        }
        for (const face of slots.faces) {
          walk(left - 1, total + face);
        }
      };
      walk(slots.cubes, 0);
      return { sums: [...sums].sort((left, right) => left - right) };
    },
    render(solution) {
      return `${proseList(solution.sums)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const sums = new Set();',
      'const walk = (left, total) => {',
      '  if (left === 0) {',
      '    sums.add(total);',
      '    return;',
      '  }',
      '  for (const face of slots.faces) {',
      '    walk(left - 1, total + face);',
      '  }',
      '};',
      'walk(slots.cubes, 0);',
      'const values = [...sums].sort((left, right) => left - right);',
      'let text;',
      'if (values.length === 1) {',
      '  text = String(values[0]);',
      '} else {',
      '  text = values.slice(0, -1).join(", ") + ", and " + values[values.length - 1];',
      '}',
      'return text + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Adding the faces of the ${slots.cubes} cubes gives a sum for every ordered pair, but different pairs may share one sum.`,
        'Collecting the sums of all outcomes and keeping each value once is the relevant count here.',
        `The ruled-out outcomes disappear, and the possible sums are ${proseList(solution.sums)}.`
      ];
    }
  }
];
