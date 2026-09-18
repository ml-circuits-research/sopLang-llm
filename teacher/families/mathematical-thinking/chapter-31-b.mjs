/**
 * Families for chapter 31 of the mathematical seed book: chance, probability,
 * and conditional information.
 *
 * Every problem of the chapter carries its own title, so each printed template
 * has exactly one variant and gets its own case. Most problems state the whole
 * outcome space, so they carry no external fact; two problems reuse a setup that
 * only a previous problem spelled out, and those materialize the missing setup
 * as a `@facts literal` table that the computation reads.
 * Part B of three: the chapter is split past the file-size rule of DS001, and every part repeats this header, the chapter number, and the full helper preamble.
 */

export const unit = 31;

const GCD_LINE = 'function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }';
const BALL_COUNT = /(\d+)\s+(red|blue|green|yellow|orange|purple)\b/g;

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function fraction(numerator, denominator) {
  const factor = gcd(numerator, denominator);
  const n = numerator / factor;
  const d = denominator / factor;
  return d === 1 ? String(n) : `${n}/${d}`;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function ballCounts(statement) {
  const counts = new Map();
  for (const match of statement.matchAll(BALL_COUNT)) {
    counts.set(match[2], Number(match[1]));
  }
  return counts;
}

function universeUpTo(last) {
  return Array.from({ length: last }, (_, index) => index + 1);
}

function dieUniverse(statement) {
  const match = /(?:die|faces)\s*(?:numbered\s*)?1[^0-9](\d+)/.exec(statement);
  if (match === null) {
    throw new Error('no numbered face range found');
  }
  return universeUpTo(Number(match[1]));
}

function sequences(symbols, length) {
  let result = [''];
  for (let step = 0; step < length; step += 1) {
    result = result.flatMap((prefix) => symbols.map((symbol) => prefix + symbol));
  }
  return result;
}

function ratioCompute(favorableExpression, totalExpression) {
  return [
    'const slots = $slots;',
    GCD_LINE,
    `const favorable = ${favorableExpression};`,
    `const total = ${totalExpression};`,
    'const factor = gcd(favorable, total);',
    'const n = favorable / factor;',
    'const d = total / factor;',
    'return d === 1 ? String(n) : n + "/" + d;'
  ].join('\n');
}

export const cases = [
  {
    template: 'At least one success',
    type: 'at-least-one-success',
    category: 'no-knowledge',
    parse(statement) {
      const outcomes = [...statement.matchAll(/\b([AB]{2})\b/g)].map((match) => match[1]);
      const success = /let ([A-Z]) be a success/.exec(statement);
      if (outcomes.length < 2 || success === null) {
        throw new Error('the statement lists no trials or no success letter');
      }
      return { outcomes, success: success[1] };
    },
    solve(slots) {
      const favorable = slots.outcomes.filter((outcome) => outcome.includes(slots.success)).length;
      return { favorable, total: slots.outcomes.length };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    compute: ratioCompute('slots.outcomes.filter((outcome) => outcome.includes(slots.success)).length', 'slots.outcomes.length'),
    explain(slots, solution) {
      return [
        `"At least one success" is easier to count through its complement: the sequences that contain no ${slots.success} at all.`,
        `Only one of the ${solution.total} equally likely sequences has no ${slots.success}, so ${solution.total - 1} sequences contain at least one.`,
        `The favorable count is ${solution.favorable} out of ${solution.total}, giving ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  },
  {
    template: 'Exactly one success',
    type: 'exactly-one-success',
    category: 'knowledge',
    parse(statement) {
      const success = /exactly one ([A-Z])\b/.exec(statement);
      if (success === null) {
        throw new Error('the statement names no success letter');
      }
      return { success: success[1] };
    },
    solve(slots) {
      const facts = { trials: 2, outcomes: ['A', 'B'] };
      const space = sequences(facts.outcomes, facts.trials);
      const favorable = space.filter(
        (outcome) => [...outcome].filter((letter) => letter === slots.success).length === 1
      ).length;
      return { favorable, total: space.length };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    facts: '{"trials":2,"outcomes":["A","B"]}',
    compute: [
      'const slots = $slots;',
      'const facts = $facts;',
      'let space = [""];',
      'for (let step = 0; step < facts.trials; step += 1) {',
      '  space = space.flatMap((prefix) => facts.outcomes.map((symbol) => prefix + symbol));',
      '}',
      'const favorable = space.filter((outcome) => outcome.split("").filter((letter) => letter === slots.success).length === 1).length;',
      GCD_LINE,
      'const factor = gcd(favorable, space.length);',
      'const n = favorable / factor;',
      'const d = space.length / factor;',
      'return d === 1 ? String(n) : n + "/" + d;'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement is the second half of a two-trial experiment whose setup was given just before it, so the two equally likely letters per trial are supplied as the setup fact.',
        `Two binary trials give four equally likely sequences, and exactly one success happens when the single success letter appears once.`,
        `${solution.favorable} of the ${solution.total} sequences satisfy that, so the probability is ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  },
  {
    template: 'Drawing without replacement: the second chance changes',
    type: 'drawing-without-replacement-the-second-chance-changes',
    category: 'no-knowledge',
    parse(statement) {
      const counts = ballCounts(statement);
      const drawn = /draw a (\w+) ball/.exec(statement);
      if (drawn === null) {
        throw new Error('the statement names no first draw');
      }
      const replacement = !/do not put it back/.test(statement);
      return { counts: Object.fromEntries(counts), drawnColor: drawn[1], replacement };
    },
    solve(slots) {
      const counts = { ...slots.counts };
      if (!slots.replacement) {
        counts[slots.drawnColor] -= 1;
      }
      const favorable = counts.red;
      const total = counts.red + counts.blue;
      return { favorable, total };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const counts = { ...slots.counts };',
      'if (!slots.replacement) counts[slots.drawnColor] -= 1;',
      'const favorable = counts.red;',
      'const total = counts.red + counts.blue;',
      GCD_LINE,
      'const factor = gcd(favorable, total);',
      'const n = favorable / factor;',
      'const d = total / factor;',
      'return d === 1 ? String(n) : n + "/" + d;'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Drawing without replacement means the drawn ball leaves the bag, so both the favorable count and the total shrink.',
        `After one ${slots.drawnColor} ball is removed, the bag holds ${solution.favorable} red and ${solution.total - solution.favorable} blue balls.`,
        `The next draw is red in ${solution.favorable} of ${solution.total} equally likely cases, so the chance is ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  },
  {
    template: 'Drawing with replacement: the composition remains',
    type: 'drawing-with-replacement-the-composition-remains',
    category: 'no-knowledge',
    parse(statement) {
      const counts = ballCounts(statement);
      const drawn = /draw a (\w+) ball/.exec(statement);
      if (drawn === null) {
        throw new Error('the statement names no first draw');
      }
      const replacement = /return it before drawing again/.test(statement);
      return { counts: Object.fromEntries(counts), drawnColor: drawn[1], replacement };
    },
    solve(slots) {
      const counts = { ...slots.counts };
      if (!slots.replacement) {
        counts[slots.drawnColor] -= 1;
      }
      const favorable = counts.red;
      const total = counts.red + counts.blue;
      return { favorable, total };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const counts = { ...slots.counts };',
      'if (!slots.replacement) counts[slots.drawnColor] -= 1;',
      'const favorable = counts.red;',
      'const total = counts.red + counts.blue;',
      GCD_LINE,
      'const factor = gcd(favorable, total);',
      'const n = favorable / factor;',
      'const d = total / factor;',
      'return d === 1 ? String(n) : n + "/" + d;'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Returning the ball restores the bag to its original composition, so the second draw sees exactly the same bag as the first.',
        `The bag still holds ${solution.favorable} red and ${solution.total - solution.favorable} blue balls when the second draw is made.`,
        `The chance of red is ${solution.favorable} of ${solution.total}, that is ${fraction(solution.favorable, solution.total)}, the same as before.`
      ];
    }
  },
  {
    template: 'Information changes probability',
    type: 'information-changes-probability',
    category: 'no-knowledge',
    parse(statement) {
      const listed = /from ([\d,]+)/.exec(statement);
      const threshold = /greater than (\d+)/.exec(statement);
      const target = /it is (\d+)/.exec(statement);
      if (listed === null || threshold === null || target === null) {
        throw new Error('the statement is missing the numbers, the threshold, or the target');
      }
      return {
        universe: listed[1].split(',').map((value) => Number(value.trim())),
        threshold: Number(threshold[1]),
        target: Number(target[1])
      };
    },
    solve(slots) {
      const remaining = slots.universe.filter((value) => value > slots.threshold);
      const favorable = remaining.filter((value) => value === slots.target).length;
      return { favorable, total: remaining.length };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    compute: ratioCompute(
      'slots.universe.filter((value) => value > slots.threshold && value === slots.target).length',
      'slots.universe.filter((value) => value > slots.threshold).length'
    ),
    explain(slots, solution) {
      return [
        'New information does not rescale the chances; it removes every outcome that is now known to be impossible and leaves the rest equally likely.',
        `The outcomes left after learning the number is greater than ${slots.threshold} are ${slots.universe.filter((value) => value > slots.threshold).join(', ')}, a space of ${solution.total}.`,
        `The value ${slots.target} is one of them, so the conditional probability is ${solution.favorable}/${solution.total}, that is ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  },
  {
    template: 'Events that cannot occur simultaneously',
    type: 'events-that-cannot-occur-simultaneously',
    category: 'no-knowledge',
    parse(statement) {
      const a = /A is [^0-9]*(\d+)/.exec(statement);
      const b = /B is [^0-9]*(\d+)/.exec(statement);
      if (a === null || b === null) {
        throw new Error('the statement does not name both events');
      }
      return { a: [Number(a[1])], b: [Number(b[1])] };
    },
    solve(slots) {
      return { overlap: slots.a.filter((value) => slots.b.includes(value)) };
    },
    render(solution) {
      return solution.overlap.length === 0 ? 'No.' : `Yes; ${solution.overlap.join(' or ')}.`;
    },
    compute: [
      'const slots = $slots;',
      'const overlap = slots.a.filter((value) => slots.b.includes(value));',
      'return overlap.length === 0 ? "No." : "Yes; " + overlap.join(" or ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Two events can happen at the same time only when some single outcome belongs to both of them, so the question is whether their outcome sets intersect.',
        `Event A is satisfied only by ${slots.a.join(' or ')} and event B only by ${slots.b.join(' or ')}, and a single roll shows one result.`,
        'No outcome belongs to both events, so they cannot happen simultaneously.'
      ];
    }
  },
  {
    template: 'Events that can overlap',
    type: 'events-that-can-overlap',
    category: 'no-knowledge',
    parse(statement) {
      const universe = dieUniverse(statement);
      const aRule = /A=[“"]([^”"]+)[”"]/.exec(statement);
      const bRule = /B=[“"]([^”"]+)[”"]/.exec(statement);
      if (aRule === null || bRule === null) {
        throw new Error('the statement does not define both events');
      }
      const ruleSet = (rule) => {
        if (rule.includes('even')) {
          return universe.filter((value) => value % 2 === 0);
        }
        const greater = /greater than (\d+)/.exec(rule);
        if (greater !== null) {
          return universe.filter((value) => value > Number(greater[1]));
        }
        throw new Error(`unsupported event rule "${rule}"`);
      };
      return { universe, a: ruleSet(aRule[1]), b: ruleSet(bRule[1]) };
    },
    solve(slots) {
      return { overlap: slots.a.filter((value) => slots.b.includes(value)) };
    },
    render(solution) {
      return solution.overlap.length === 0 ? 'No.' : `Yes; ${solution.overlap.join(' or ')}.`;
    },
    compute: [
      'const slots = $slots;',
      'const overlap = slots.a.filter((value) => slots.b.includes(value));',
      'return overlap.length === 0 ? "No." : "Yes; " + overlap.join(" or ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Two events overlap when at least one outcome satisfies both of them at once.',
        `Event A is satisfied by ${slots.a.join(', ')} and event B by ${slots.b.join(', ')}.`,
        `The outcomes ${solution.overlap.join(' and ')} are in both sets, so the events can both be true.`
      ];
    }
  },
  {
    template: 'The union of two events by counting',
    type: 'the-union-of-two-events-by-counting',
    category: 'no-knowledge',
    parse(statement) {
      const universe = dieUniverse(statement);
      const aRule = /A=[“"]([^”"]+)[”"]/.exec(statement);
      const bRule = /B=[“"]([^”"]+)[”"]/.exec(statement);
      if (aRule === null || bRule === null) {
        throw new Error('the statement does not define both events');
      }
      const ruleSet = (rule) => {
        if (rule.includes('even')) {
          return universe.filter((value) => value % 2 === 0);
        }
        const greater = /greater than (\d+)/.exec(rule);
        if (greater !== null) {
          return universe.filter((value) => value > Number(greater[1]));
        }
        throw new Error(`unsupported event rule "${rule}"`);
      };
      return { universe, a: ruleSet(aRule[1]), b: ruleSet(bRule[1]) };
    },
    solve(slots) {
      const union = slots.a.concat(slots.b.filter((value) => !slots.a.includes(value)));
      return { favorable: union.length, total: slots.universe.length };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    compute: ratioCompute(
      'slots.a.concat(slots.b.filter((value) => !slots.a.includes(value))).length',
      'slots.universe.length'
    ),
    explain(slots, solution) {
      return [
        '"A or B" is satisfied by every outcome in either event, so its size is the union of the two outcome sets rather than the sum of their sizes.',
        `Event A contributes ${slots.a.join(', ')} and event B adds ${slots.b.filter((value) => !slots.a.includes(value)).join(', ')}, while the shared outcomes are counted once.`,
        `The union has ${solution.favorable} outcomes out of ${solution.total} equally likely ones, so the probability is ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  },
  {
    template: 'Comparing chances without decimals',
    type: 'comparing-chances-without-decimals',
    category: 'no-knowledge',
    parse(statement) {
      const games = [];
      for (const match of statement.matchAll(/Game ([A-Z]) wins in (\d+) of (\d+)/g)) {
        games.push({ name: match[1], wins: Number(match[2]), total: Number(match[3]) });
      }
      if (games.length < 2) {
        throw new Error('the statement names fewer than two games');
      }
      return { games };
    },
    solve(slots) {
      const [first, second] = slots.games;
      const left = first.wins * second.total;
      const right = second.wins * first.total;
      const winner = left === right ? 'equal' : left > right ? first.name : second.name;
      return { winner, left, right };
    },
    render(solution) {
      return solution.winner === 'equal' ? 'They are equal.' : `Game ${solution.winner}.`;
    },
    compute: [
      'const slots = $slots;',
      'const first = slots.games[0];',
      'const second = slots.games[1];',
      'const left = first.wins * second.total;',
      'const right = second.wins * first.total;',
      'if (left === right) return "They are equal.";',
      'return "Game " + (left > right ? first.name : second.name) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      const [first, second] = slots.games;
      return [
        `The two chances are the fractions ${first.wins}/${first.total} and ${second.wins}/${second.total}, and comparing fractions without decimals uses cross-multiplication.`,
        `Multiplying each numerator by the other denominator gives ${solution.left} and ${solution.right}.`,
        `The larger product belongs to game ${solution.winner}, which therefore has the greater chance.`
      ];
    }
  }
];
