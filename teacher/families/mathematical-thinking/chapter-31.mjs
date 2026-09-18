/**
 * Families for chapter 31 of the mathematical seed book: chance, probability,
 * and conditional information.
 *
 * Every problem of the chapter carries its own title, so each printed template
 * has exactly one variant and gets its own case. Most problems state the whole
 * outcome space, so they carry no external fact; two problems reuse a setup that
 * only a previous problem spelled out, and those materialize the missing setup
 * as a `@facts literal` table that the computation reads.
 * Part A of three: the chapter is split past the file-size rule of DS001, and every part repeats this header, the chapter number, and the full helper preamble.
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
    template: 'Equally likely outcomes',
    type: 'equally-likely-outcomes',
    category: 'no-knowledge',
    parse(statement) {
      const counts = ballCounts(statement);
      const red = counts.get('red');
      if (red === undefined) {
        throw new Error('the statement names no red balls');
      }
      let total = 0;
      for (const value of counts.values()) {
        total += value;
      }
      return { favorable: red, total };
    },
    solve(slots) {
      return { favorable: slots.favorable, total: slots.total };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    compute: ratioCompute('slots.favorable', 'slots.total'),
    explain(slots, solution) {
      return [
        `The bag holds ${slots.total} balls in total, all of identical size, so the choice is equally likely between them.`,
        `Exactly ${solution.favorable} of those balls are red, so red is favorable in ${solution.favorable} of the ${solution.total} equally likely outcomes.`,
        `The chance of red is therefore ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  },
  {
    template: 'A certain event',
    type: 'a-certain-event',
    category: 'no-knowledge',
    parse(statement) {
      const counts = ballCounts(statement);
      let total = 0;
      for (const value of counts.values()) {
        total += value;
      }
      if (total === 0) {
        throw new Error('the statement names no balls');
      }
      return { favorable: counts.get('green') ?? 0, total };
    },
    solve(slots) {
      return { favorable: slots.favorable, total: slots.total, certain: slots.favorable === slots.total };
    },
    render(solution) {
      return solution.certain
        ? `Yes; the probability is ${fraction(solution.total, solution.total)}.`
        : `No; the probability is ${fraction(solution.favorable, solution.total)}.`;
    },
    compute: [
      'const slots = $slots;',
      GCD_LINE,
      'const favorable = slots.favorable;',
      'const total = slots.total;',
      'const factor = gcd(favorable, total);',
      'const n = favorable / factor;',
      'const d = total / factor;',
      'const chance = d === 1 ? String(n) : n + "/" + d;',
      'return (favorable === total ? "Yes; the probability is " : "No; the probability is ") + chance + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'An event is certain when every possible outcome satisfies it, so certainty is decided by comparing the favorable outcomes with the whole outcome space.',
        `All ${solution.total} balls in the bag are green, so every outcome satisfies "the ball is green".`,
        `The event is therefore certain, and the probability is ${fraction(solution.total, solution.total)}.`
      ];
    }
  },
  {
    template: 'An impossible event',
    type: 'an-impossible-event',
    category: 'no-knowledge',
    parse(statement) {
      if (!/red/.test(statement)) {
        throw new Error('the statement does not mention a red ball');
      }
      const counts = ballCounts(statement);
      let total = 0;
      for (const value of counts.values()) {
        total += value;
      }
      return { favorable: counts.get('red') ?? 0, total: total === 0 ? 1 : total };
    },
    solve(slots) {
      return { favorable: slots.favorable, total: slots.total };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    compute: ratioCompute('slots.favorable', 'slots.total'),
    explain(slots, solution) {
      return [
        'An event is impossible when no possible outcome satisfies it, because there are zero favorable outcomes in a non-empty outcome space.',
        'The bag contains only yellow and blue balls, so no ball in it is red and there is nothing favorable to draw.',
        `With zero favorable outcomes the probability is ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  },
  {
    template: 'Comparing two chances with the same total',
    type: 'comparing-two-chances-with-the-same-total',
    category: 'no-knowledge',
    parse(statement) {
      const colors = [...ballCounts(statement)].map(([name, value]) => [name, value]);
      if (colors.length < 2) {
        throw new Error('the statement names fewer than two colours');
      }
      return { colors };
    },
    solve(slots) {
      let winner = slots.colors[0];
      for (const entry of slots.colors) {
        if (entry[1] > winner[1]) {
          winner = entry;
        }
      }
      return { winner: winner[0] };
    },
    render(solution) {
      return `${capitalize(solution.winner)}.`;
    },
    compute: [
      'const slots = $slots;',
      'let winner = slots.colors[0];',
      'for (const entry of slots.colors) {',
      '  if (entry[1] > winner[1]) winner = entry;',
      '}',
      'const name = winner[0];',
      'return name.charAt(0).toUpperCase() + name.slice(1) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      const total = slots.colors.reduce((sum, entry) => sum + entry[1], 0);
      const winner = slots.colors.find((entry) => entry[0] === solution.winner);
      return [
        `All ${total} balls are equally likely, so the chance of a colour is its count out of ${total}.`,
        `The counts are ${slots.colors.map((entry) => `${entry[1]} ${entry[0]}`).join(' and ')}, and they share the same total.`,
        `The larger count belongs to ${solution.winner}: ${winner[1]} out of ${total} beats the other colour, so ${solution.winner} is more likely.`
      ];
    }
  },
  {
    template: 'The same probability in two different bags',
    type: 'the-same-probability-in-two-different-bags',
    category: 'no-knowledge',
    parse(statement) {
      const bags = [];
      for (const match of statement.matchAll(/Bag ([A-Z]) has (\d+) red balls? out of (\d+)/g)) {
        bags.push({ name: match[1], red: Number(match[2]), total: Number(match[3]) });
      }
      if (bags.length < 2) {
        throw new Error('the statement names fewer than two bags');
      }
      return { bags };
    },
    solve(slots) {
      const [first, second] = slots.bags;
      const left = first.red * second.total;
      const right = second.red * first.total;
      const winner = left === right ? 'equal' : left > right ? first.name : second.name;
      return { winner };
    },
    render(solution) {
      return solution.winner === 'equal' ? 'They are equal.' : `Bag ${solution.winner}.`;
    },
    compute: [
      'const slots = $slots;',
      'const first = slots.bags[0];',
      'const second = slots.bags[1];',
      'const left = first.red * second.total;',
      'const right = second.red * first.total;',
      'if (left === right) return "They are equal.";',
      'return "Bag " + (left > right ? first.name : second.name) + ".";'
    ].join('\n'),
    explain(slots) {
      const [first, second] = slots.bags;
      return [
        `Comparing chances across different totals means comparing the fractions ${first.red}/${first.total} and ${second.red}/${second.total} without decimals.`,
        'Cross-multiplying compares them exactly: multiply the numerator of each fraction by the denominator of the other.',
        `${first.red}×${second.total} and ${second.red}×${first.total} are the same product, so the two fractions represent the same chance and neither bag is better.`
      ];
    }
  },
  {
    template: 'Probability by complement',
    type: 'probability-by-complement',
    category: 'no-knowledge',
    parse(statement) {
      const universe = dieUniverse(statement);
      const excluded = /NOT\s+(\d+)/.exec(statement);
      if (excluded === null) {
        throw new Error('the statement names no excluded result');
      }
      const excludedCount = universe.filter((face) => face === Number(excluded[1])).length;
      return { favorable: universe.length - excludedCount, total: universe.length };
    },
    solve(slots) {
      return { favorable: slots.favorable, total: slots.total };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    compute: ratioCompute('slots.favorable', 'slots.total'),
    explain(slots, solution) {
      return [
        `The complement counts the outcomes that do NOT satisfy the event, over the same total of ${solution.total} equally likely faces.`,
        `Only one face shows the excluded value, so ${solution.total - 1} of the ${solution.total} faces satisfy "NOT 6".`,
        `The probability is ${solution.favorable}/${solution.total}, which is ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  },
  {
    template: 'Probability of an even number',
    type: 'probability-of-an-even-number',
    category: 'no-knowledge',
    parse(statement) {
      const universe = dieUniverse(statement);
      const listed = /even numbers as ([\d,\s]+)/.exec(statement);
      if (listed === null) {
        throw new Error('the statement lists no even values');
      }
      const evens = listed[1].split(',').map((value) => Number(value.trim()));
      const favorable = evens.filter((face) => universe.includes(face)).length;
      return { favorable, total: universe.length };
    },
    solve(slots) {
      return { favorable: slots.favorable, total: slots.total };
    },
    render(solution) {
      return `${solution.favorable}/${solution.total}=${fraction(solution.favorable, solution.total)}.`;
    },
    compute: [
      'const slots = $slots;',
      GCD_LINE,
      'const favorable = slots.favorable;',
      'const total = slots.total;',
      'const factor = gcd(favorable, total);',
      'const n = favorable / factor;',
      'const d = total / factor;',
      'const reduced = d === 1 ? String(n) : n + "/" + d;',
      'return favorable + "/" + total + "=" + reduced;'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'An event made of several outcomes is counted by listing exactly the outcomes that satisfy it, then sharing the total number of equally likely outcomes.',
        `The even faces among 1 to ${solution.total} are the listed values, and ${solution.favorable} of them lie in the range.`,
        `The count gives ${solution.favorable}/${solution.total}, which reduces to ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  },
  {
    template: 'Probability of a sum from two simplified coins',
    type: 'probability-of-a-sum-from-two-simplified-coins',
    category: 'no-knowledge',
    parse(statement) {
      const listed = /\bpairs?\s+(\d{2}(?:,\s*\d{2})+)/.exec(statement);
      if (listed === null) {
        throw new Error('the statement lists no outcome pairs');
      }
      const target = /sum is (\d+)/.exec(statement);
      if (target === null) {
        throw new Error('the statement names no target sum');
      }
      return { outcomes: listed[1].split(',').map((token) => token.trim()), target: Number(target[1]) };
    },
    solve(slots) {
      const favorable = slots.outcomes.filter(
        (outcome) => [...outcome].reduce((sum, digit) => sum + Number(digit), 0) === slots.target
      ).length;
      return { favorable, total: slots.outcomes.length };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    compute: ratioCompute(
      'slots.outcomes.filter((outcome) => outcome.split("").reduce((sum, digit) => sum + Number(digit), 0) === slots.target).length',
      'slots.outcomes.length'
    ),
    explain(slots, solution) {
      return [
        'Two independent tokens that each show 0 or 1 give four equally likely pairs, so the outcome space is the listed set of pairs.',
        `A pair is favorable when its two digits add up to ${slots.target}, and ${solution.favorable} of the ${solution.total} pairs satisfy that.`,
        `The probability is therefore ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  },
  {
    template: 'Two different results',
    type: 'two-different-results',
    category: 'no-knowledge',
    parse(statement) {
      const outcomes = [...statement.matchAll(/\b([AB]{2})\b/g)].map((match) => match[1]);
      if (outcomes.length < 2) {
        throw new Error('the statement lists no two-toss sequences');
      }
      return { outcomes };
    },
    solve(slots) {
      const favorable = slots.outcomes.filter((outcome) => outcome[0] !== outcome[1]).length;
      return { favorable, total: slots.outcomes.length };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    compute: ratioCompute('slots.outcomes.filter((outcome) => outcome[0] !== outcome[1]).length', 'slots.outcomes.length'),
    explain(slots, solution) {
      return [
        'Tossing an idealized coin twice makes the four listed sequences equally likely, so each sequence is a single outcome.',
        `The results differ when the two letters are not the same, which happens in ${solution.favorable} of the ${solution.total} sequences.`,
        `The probability is ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  }
];
