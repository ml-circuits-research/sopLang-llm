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
    template: 'An outfit from two independent choices',
    type: 'an-outfit-from-two-independent-choices',
    category: 'no-knowledge',
    parse(statement) {
      return {
        shirts: Number(pick(statement, /(\d+)\s+shirts?/, 'no shirt count').at(1)),
        trousers: Number(pick(statement, /(\d+)\s+pairs? of trousers?/, 'no trouser count').at(1))
      };
    },
    solve(slots) {
      return { total: slots.shirts * slots.trousers };
    },
    render(solution) {
      return `${solution.total} outfits.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.shirts * slots.trousers) + " outfits.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `An outfit pairs one shirt with one pair of trousers, and the two choices are independent.`,
        `There are ${slots.shirts} shirts and ${slots.trousers} pairs of trousers, so the outfits are counted by the product.`,
        `The product is ${solution.total}, which is the number of different outfits.`
      ];
    }
  },
{
    template: 'A menu with one choice from each category',
    type: 'a-menu-with-one-choice-from-each-category',
    category: 'no-knowledge',
    parse(statement) {
      return {
        soups: Number(pick(statement, /(\d+)\s+soups?/, 'no soup count').at(1)),
        mains: Number(pick(statement, /(\d+)\s+main courses?/, 'no main course count').at(1)),
        desserts: Number(pick(statement, /(\d+)\s+desserts?/, 'no dessert count').at(1))
      };
    },
    solve(slots) {
      return { total: slots.soups * slots.mains * slots.desserts };
    },
    render(solution) {
      return `${solution.total} menus.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.soups * slots.mains * slots.desserts) + " menus.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A complete menu picks one item from each of ${slots.soups} soups, ${slots.mains} main courses, and ${slots.desserts} desserts.`,
        'The three picks are made independently, so the counts multiply.',
        `${slots.soups} × ${slots.mains} × ${slots.desserts} = ${solution.total} complete menus.`
      ];
    }
  },
{
    template: 'A two-digit code without repetition',
    type: 'a-two-digit-code-without-repetition',
    category: 'no-knowledge',
    parse(statement) {
      const digits = digitsOf(pick(statement, /using ([0-9,\s]+?)\s+without/, 'no digit list').at(1));
      return { digits, length: wordNumber(pick(statement, /(\w+)-digit/, 'no code length').at(1)) };
    },
    solve(slots) {
      let total = 1;
      for (let step = 0; step < slots.length; step += 1) {
        total *= slots.digits.length - step;
      }
      return { total };
    },
    render(solution) {
      return `${solution.total} codes.`;
    },
    compute: [
      'const slots = $slots;',
      'let total = 1;',
      'for (let step = 0; step < slots.length; step += 1) {',
      '  total *= slots.digits.length - step;',
      '}',
      'return String(total) + " codes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The code uses ${slots.digits.length} digits and has ${slots.length} positions, with no digit repeated.`,
        'The first position has every digit available, and each later position loses the digits already used.',
        `Multiplying the shrinking choices gives ${solution.total} codes.`
      ];
    }
  },
{
    template: 'Pairs where order does not matter',
    type: 'pairs-where-order-does-not-matter',
    category: 'no-knowledge',
    parse(statement) {
      return {
        letters: lettersOf(pick(statement, /from ([A-Z](?:,\s*[A-Z])*)/, 'no letter list').at(1)),
        size: wordNumber(pick(statement, /Choose (\w+) letters/, 'no team size').at(1))
      };
    },
    solve(slots) {
      return { teams: combinations(slots.letters, slots.size).map((team) => team.join('')) };
    },
    render(solution) {
      return `${solution.teams.join(', ')}; ${solution.teams.length} teams.`;
    },
    compute: [
      'const slots = $slots;',
      'const teams = [];',
      'const walk = (start, chosen) => {',
      '  if (chosen.length === slots.size) {',
      '    teams.push(chosen.join(""));',
      '    return;',
      '  }',
      '  for (let index = start; index < slots.letters.length; index += 1) {',
      '    walk(index + 1, chosen.concat(slots.letters[index]));',
      '  }',
      '};',
      'walk(0, []);',
      'return teams.join(", ") + "; " + teams.length + " teams.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Since the order inside a team does not matter, each team is a subset of the letters rather than an ordered pair.',
        `Listing the ${slots.size}-letter subsets of ${slots.letters.join(', ')} gives ${solution.teams.join(', ')}.`,
        `There are ${solution.teams.length} teams, and AB and BA are counted as the same team.`
      ];
    }
  },
{
    template: 'Order matters in a race',
    type: 'order-matters-in-a-race',
    category: 'no-knowledge',
    parse(statement) {
      const children = lettersOf(pick(statement, /children ([A-Z](?:,\s*[A-Z])*)/, 'no child list').at(1));
      const places = pick(statement, /occupy (\w+) and (\w+) place/, 'no place list');
      return { children, places: ordinal(places.at(2)) };
    },
    solve(slots) {
      let total = 1;
      for (let step = 0; step < slots.places; step += 1) {
        total *= slots.children.length - step;
      }
      return { total };
    },
    render(solution) {
      return `${solution.total} results.`;
    },
    compute: [
      'const slots = $slots;',
      'let total = 1;',
      'for (let step = 0; step < slots.places; step += 1) {',
      '  total *= slots.children.length - step;',
      '}',
      'return String(total) + " results.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each result is an ordered fill of ${slots.places} places from ${slots.children.length} children, and one child cannot take both places.`,
        'The first place has every child available and the second place loses the child already placed.',
        `${slots.children.length} × ${slots.children.length - 1} = ${solution.total} ordered results.`
      ];
    }
  },
{
    template: 'Counting by disjoint cases',
    type: 'counting-by-disjoint-cases',
    category: 'no-knowledge',
    parse(statement) {
      const letters = lettersOf(pick(statement, /letter ([A-Z]) or ([A-Z])/, 'no letter pair').slice(1, 3).join(','));
      const digits = digitsOf(pick(statement, /followed by a digit ([0-9,\s]+)/, 'no digit list').at(1));
      pick(statement, /just the letter ([A-Z]) with no digit/, 'no single letter');
      return { letters, digits, single: 1 };
    },
    solve(slots) {
      return { total: slots.letters.length * slots.digits.length + slots.single };
    },
    render(solution) {
      return `${solution.total} codes.`;
    },
    compute: [
      'const slots = $slots;',
      'const total = slots.letters.length * slots.digits.length + slots.single;',
      'return String(total) + " codes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The codes split into two disjoint cases that share no code, so their counts add.',
        `The first case is a letter choice (${slots.letters.length}) together with a digit choice (${slots.digits.length}), giving ${slots.letters.length * slots.digits.length} codes.`,
        `The second case is the single letter with no digit, giving ${slots.single} more code for a total of ${solution.total}.`
      ];
    }
  },
{
    template: 'Counting by complement',
    type: 'counting-by-complement',
    category: 'no-knowledge',
    parse(statement) {
      return {
        digits: digitsOf(pick(statement, /Using digits ([0-9,\s]+)/, 'no digit list').at(1)),
        total: Number(pick(statement, /There are (\d+) codes in total/, 'no code total').at(1))
      };
    },
    solve(slots) {
      return { total: slots.total - slots.digits.length };
    },
    render(solution) {
      return `${solution.total} codes.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.total - slots.digits.length) + " codes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Counting the complement asks for all ${slots.total} two-digit codes except those with two equal digits.`,
        `The equal codes are the repetitions of each of the ${slots.digits.length} digits, so there are ${slots.digits.length} of them.`,
        `${slots.total} − ${slots.digits.length} = ${solution.total} codes with two different digits.`
      ];
    }
  },
{
    template: 'Paths with two successive choices',
    type: 'paths-with-two-successive-choices',
    category: 'no-knowledge',
    parse(statement) {
      const first = pick(statement, /go to ([A-Z]) or ([A-Z])/, 'no first step').slice(1, 3);
      const second = splitOptions(pick(statement, /each of [^.]*?you can go to (.+?)\./, 'no second step').at(1));
      return { first, second };
    },
    solve(slots) {
      return { total: slots.first.length * slots.second.length };
    },
    render(solution) {
      return `${solution.total} paths.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.first.length * slots.second.length) + " paths.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Every path is built by choosing a first-step destination and then a second-step destination.',
        `Each of the ${slots.first.length} first steps offers the same ${slots.second.length} second steps.`,
        `${slots.first.length} × ${slots.second.length} = ${solution.total} paths.`
      ];
    }
  },
{
    template: 'Paths with one blocked branch',
    type: 'paths-with-one-blocked-branch',
    category: 'no-knowledge',
    parse(statement) {
      const first = pick(statement, /go to ([A-Z]) or ([A-Z])/, 'no first step').slice(1, 3);
      const branches = [...statement.matchAll(/(?:From|from) ([A-Z]) (?:you may go to|only to) ([A-Z](?:\s*,\s*[A-Z])*)/g)].map(
        (match) => ({ from: match[1], to: splitOptions(match[2]) })
      );
      if (branches.length === 0) {
        throw new Error('no branch listing found');
      }
      return { first, branches };
    },
    solve(slots) {
      return { total: slots.branches.reduce((sum, branch) => sum + branch.to.length, 0) };
    },
    render(solution) {
      return `${solution.total} paths.`;
    },
    compute: [
      'const slots = $slots;',
      'let total = 0;',
      'for (const branch of slots.branches) {',
      '  total += branch.to.length;',
      '}',
      'return String(total) + " paths.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Blocking one end of the graph does not make the cases equal, so the paths through each first step are counted separately.',
        `Through ${slots.branches[0].from} there are ${slots.branches[0].to.length} continuations, and through ${slots.branches[1].from} there are ${slots.branches[1].to.length}.`,
        `Adding the disjoint groups of paths gives ${solution.total} complete paths.`
      ];
    }
  }
];
