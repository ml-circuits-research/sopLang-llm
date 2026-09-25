/**
 * Families for chapter 31 of the mathematical seed book: chance, probability,
 * and conditional information.
 *
 * Every problem of the chapter carries its own title, so each printed template
 * has exactly one variant and gets its own case. Most problems state the whole
 * outcome space, so they carry no external fact; two problems reuse a setup that
 * only a previous problem spelled out, and those materialize the missing setup
 * as a `@facts literal` table that the computation reads.
 * Part C of three: the chapter is split past the file-size rule of DS001, and every part repeats this header, the chapter number, and the full helper preamble.
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

const PROB_ZERO_WIRES = [
  {
    name: 'counts',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const facts = $facts;',
      'const remaining = facts.cards.filter((card) => card.color === slots.condition);',
      'const favorable = remaining.filter((card) => card.shape === slots.target).length;',
      'return { favorable: favorable, total: remaining.length };'
    ].join('\n')
  }
];

const PROB_ZERO_COMPUTE = [
  GCD_LINE,
  'const factor = gcd($counts.favorable, $counts.total);',
  'const n = $counts.favorable / factor;',
  'const d = $counts.total / factor;',
  'return d === 1 ? String(n) : n + "/" + d;'
].join('\n');

export const cases = [
  {
    template: 'Making the better choice in a game',
    type: 'making-the-better-choice-in-a-game',
    category: 'no-knowledge',
    parse(statement) {
      const bags = [];
      for (const match of statement.matchAll(/([AB]) has (\d+)(?: winning balls)? out of\s*(\d+)/g)) {
        bags.push({ name: match[1], wins: Number(match[2]), total: Number(match[3]) });
      }
      if (bags.length < 2) {
        throw new Error('the statement names fewer than two bags');
      }
      return { bags };
    },
    solve(slots) {
      const [first, second] = slots.bags;
      const left = first.wins * second.total;
      const right = second.wins * first.total;
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
      'const left = first.wins * second.total;',
      'const right = second.wins * first.total;',
      'if (left === right) return "They are equal.";',
      'return "Bag " + (left > right ? first.name : second.name) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      const [first, second] = slots.bags;
      const ratio = (bag) => fraction(bag.wins, bag.total);
      return [
        'Each bag wins in a fraction of its equally likely balls, so the better bag is the one with the larger fraction of winning balls.',
        `Bag A wins with probability ${ratio(first)} and bag B with probability ${ratio(second)}.`,
        `${ratio(first)} is the greater chance, so bag ${solution.winner} maximizes the chance of winning.`
      ];
    }
  },
  {
    template: 'A fair game under the given definition',
    type: 'a-fair-game-under-the-given-definition',
    category: 'no-knowledge',
    parse(statement) {
      const win = /win on ([\d,]+)/.exec(statement);
      const lose = /lose on ([\d,]+)/.exec(statement);
      if (win === null || lose === null) {
        throw new Error('the statement does not list the winning and losing faces');
      }
      return {
        win: win[1].split(',').map((value) => Number(value.trim())),
        lose: lose[1].split(',').map((value) => Number(value.trim()))
      };
    },
    solve(slots) {
      return { fair: slots.win.length === slots.lose.length, winCount: slots.win.length, loseCount: slots.lose.length };
    },
    render(solution) {
      return solution.fair ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'return slots.win.length === slots.lose.length ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      const total = solution.winCount + solution.loseCount;
      return [
        'The definition given in the statement calls a game fair when winning and losing have the same probability, so the two counts must be compared over the same total.',
        `Winning happens on ${solution.winCount} of the ${total} faces and losing on ${solution.loseCount} of them.`,
        `${solution.winCount}/${total} equals ${solution.loseCount}/${total}, so the game is fair.`
      ];
    }
  },
  {
    template: 'An unfair game hidden behind two labels',
    type: 'an-unfair-game-hidden-behind-two-labels',
    category: 'no-knowledge',
    parse(statement) {
      const total = /wheel has (\d+) equal sectors/.exec(statement);
      const labels = [];
      for (const match of statement.matchAll(/(\d+) labeled ([A-Z])/g)) {
        labels.push([match[2], Number(match[1])]);
      }
      if (total === null || labels.length < 2) {
        throw new Error('the statement does not list the sectors and their labels');
      }
      return { labels, total: Number(total[1]) };
    },
    solve(slots) {
      let best = slots.labels[0];
      for (const entry of slots.labels) {
        if (entry[1] > best[1]) {
          best = entry;
        }
      }
      const equal = slots.labels.every((entry) => entry[1] === slots.labels[0][1]);
      return { equal, bigger: best[0] };
    },
    render(solution) {
      return solution.equal ? 'Yes; they have equal chances.' : `No; ${solution.bigger} is more likely.`;
    },
    compute: [
      'const slots = $slots;',
      'let best = slots.labels[0];',
      'for (const entry of slots.labels) {',
      '  if (entry[1] > best[1]) best = entry;',
      '}',
      'const equal = slots.labels.every((entry) => entry[1] === slots.labels[0][1]);',
      'return equal ? "Yes; they have equal chances." : "No; " + best[0] + " is more likely.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Two labels do not imply two equal chances: each chance is the share of the equal sectors that carry the label.',
        `The wheel has ${slots.total} equal sectors, of which ${slots.labels[0][1]} are ${slots.labels[0][0]} and ${slots.labels[1][1]} are ${slots.labels[1][0]}.`,
        `Since ${solution.bigger} covers more sectors, ${solution.bigger} is more likely and the chances are not equal.`
      ];
    }
  },
  {
    template: 'Observed frequency versus probability',
    type: 'observed-frequency-versus-probability',
    category: 'no-knowledge',
    parse(statement) {
      const probs = [];
      for (const match of statement.matchAll(/probability (\d+)\/(\d+) for ([A-Z])/g)) {
        probs.push([match[3], Number(match[1]), Number(match[2])]);
      }
      const observed = /obtain\s+([A-Z](?:,\s?[A-Z])*)/.exec(statement);
      if (probs.length === 0 || observed === null) {
        throw new Error('the statement lists no toss probabilities or no observed tosses');
      }
      return { probs, observed: observed[1].split(',').map((token) => token.trim()) };
    },
    solve(slots) {
      const bySymbol = new Map(slots.probs.map(([symbol, numerator, denominator]) => [symbol, numerator / denominator]));
      let chance = 1;
      for (const symbol of slots.observed) {
        chance *= bySymbol.get(symbol);
      }
      return { possible: chance > 0, chance };
    },
    render(solution) {
      return solution.possible ? 'No.' : 'Yes.';
    },
    compute: [
      'const slots = $slots;',
      'const bySymbol = new Map(slots.probs.map((entry) => [entry[0], entry[1] / entry[2]]));',
      'let chance = 1;',
      'for (const symbol of slots.observed) chance *= bySymbol.get(symbol);',
      'return chance > 0 ? "No." : "Yes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A probability describes the chance on each individual trial; it constrains the rate over many trials, not the exact result of a small batch.',
        `Every observed result keeps the stated probability, so the observed run has probability greater than zero and is fully compatible with the rule.`,
        `A run of ${slots.observed.length} tosses landing the same way is just one of the possible outcomes and contradicts nothing, so the answer is no.`
      ];
    }
  },
  {
    template: 'Relative frequency from data',
    type: 'relative-frequency-from-data',
    category: 'no-knowledge',
    parse(statement) {
      const trials = /In (\d+) trials/.exec(statement);
      const occurrences = /occurred (\d+) times/.exec(statement);
      if (trials === null || occurrences === null) {
        throw new Error('the statement does not give the trials and the occurrences');
      }
      return { trials: Number(trials[1]), occurrences: Number(occurrences[1]) };
    },
    solve(slots) {
      return { favorable: slots.occurrences, total: slots.trials };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    compute: ratioCompute('slots.occurrences', 'slots.trials'),
    explain(slots, solution) {
      return [
        'Relative frequency is the share of trials in which the event occurred, computed as occurrences divided by trials.',
        `The event occurred ${slots.occurrences} times in ${slots.trials} trials.`,
        `The ratio is ${slots.occurrences}/${slots.trials}, which simplifies to ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  },
  {
    template: 'Probability conditioned on color',
    type: 'probability-conditioned-on-color',
    category: 'no-knowledge',
    parse(statement) {
      const cards = [...statement.matchAll(/\b(red|blue|green|yellow)-(circle|square|triangle|star)\b/g)].map((match) => ({
        color: match[1],
        shape: match[2]
      }));
      const condition = /chosen card is (red|blue|green|yellow)/.exec(statement);
      const target = /it is a (circle|square|triangle|star)/.exec(statement);
      if (cards.length === 0 || condition === null || target === null) {
        throw new Error('the statement does not list the cards, the condition, and the target');
      }
      return { cards, condition: condition[1], target: target[1] };
    },
    solve(slots) {
      const remaining = slots.cards.filter((card) => card.color === slots.condition);
      const favorable = remaining.filter((card) => card.shape === slots.target).length;
      return { favorable, total: remaining.length };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    compute: ratioCompute(
      'slots.cards.filter((card) => card.color === slots.condition && card.shape === slots.target).length',
      'slots.cards.filter((card) => card.color === slots.condition).length'
    ),
    explain(slots, solution) {
      return [
        'Conditioning on the known colour discards every card that does not have that colour and keeps the rest equally likely.',
        `Only the ${solution.total} ${slots.condition} cards remain possible, and ${solution.favorable} of them is a ${slots.target}.`,
        `The conditional probability is ${solution.favorable}/${solution.total}, that is ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  },
  {
    template: 'Probability zero after new information',
    type: 'probability-zero-after-new-information',
    category: 'knowledge',
    parse(statement) {
      const condition = /card is (red|blue|green|yellow)/.exec(statement);
      const target = /it is a (\w+)/.exec(statement);
      if (condition === null || target === null) {
        throw new Error('the statement does not give the condition and the target');
      }
      return { condition: condition[1], target: target[1] };
    },
    solve(slots) {
      const cards = [
        { color: 'red', shape: 'circle' },
        { color: 'red', shape: 'square' },
        { color: 'blue', shape: 'circle' },
        { color: 'blue', shape: 'triangle' }
      ];
      const remaining = cards.filter((card) => card.color === slots.condition);
      const favorable = remaining.filter((card) => card.shape === slots.target).length;
      return { favorable, total: remaining.length };
    },
    render(solution) {
      return `${fraction(solution.favorable, solution.total)}.`;
    },
    facts: '{"cards":[{"color":"red","shape":"circle"},{"color":"red","shape":"square"},{"color":"blue","shape":"circle"},{"color":"blue","shape":"triangle"}]}',
    wires: PROB_ZERO_WIRES,
    compute: PROB_ZERO_COMPUTE,
    explain(slots, solution) {
      return [
        'The statement continues the card problem that precedes it, so the deck it refers to is supplied as a setup fact rather than restated in the problem text.',
        `Conditioning on the red card keeps only the ${solution.total} red cards, and neither of them is a ${slots.target}.`,
        `No remaining outcome is favorable, so the conditional probability is ${fraction(solution.favorable, solution.total)}.`
      ];
    }
  }
];
