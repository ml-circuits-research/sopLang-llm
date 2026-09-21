/**
 * Decomposition families of the procedural arithmetic source.
 *
 * Every other family of this source compiles into one answer body: the model has
 * to produce the whole computation at once. These two teach the shape the books
 * also teach but the suite never showed — a plan with named intermediate wires,
 * where one stage publishes a value and the next stage reads it through
 * `$name`. The published value is visible in the target and scored by the
 * fingerprint, so a suite built from them measures whether the student can plan
 * in steps rather than only fill in one body.
 *
 * The contract is DS008, "Additional circuit shapes": every `jsEval` wire,
 * intermediate or final, carries the probe harness, and the answer stays
 * deterministic work over the values the plan carries.
 */

const MEASUREMENTS = [
  'recorded measurements', 'field samples', 'weekly readings', 'sensor values', 'load tests', 'batch timings'
];
const SCORES = [
  ['the Falcons', 'the Herons'], ['team North', 'team South'], ['the first shop', 'the second shop'],
  ['the morning shift', 'the evening shift'], ['the old line', 'the new line']
];

/** The latent plan: filter the values that pass a threshold, then total them. */
const filteredTotal = {
  id: 'filtered-total',
  name: 'Filtered Total',
  type: 'filtered-total',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 0.95 },
  sample(random) {
    // The statement must determine a non-empty kept list and leave at least one
    // value behind, so the sampler redraws until both hold: the reference parse
    // recovers exactly the values the statement states, and no sampling flag
    // leaks into the compiled slots.
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const count = 4 + Math.floor(random() * 3);
      const threshold = 5 + Math.floor(random() * 12);
      const values = [];
      for (let index = 0; index < count; index += 1) {
        values.push(1 + Math.floor(random() * 30));
      }
      const kept = values.filter((value) => value > threshold);
      if (kept.length === 0 || kept.length === values.length) {
        continue;
      }
      return {
        subject: MEASUREMENTS[Math.floor(random() * MEASUREMENTS.length)],
        values,
        threshold
      };
    }
    throw new Error("the sampler could not draw a list that is partly above the threshold");
  },
  statement(slots) {
    const list = slots.values.length === 1 ? `${slots.values[0]}` : `${slots.values.slice(0, -1).join(', ')} and ${slots.values.at(-1)}`;
    return `The ${slots.subject} are ${list}. Keep only the values above ${slots.threshold}, and report the kept values and their total.`;
  },
  parse(statement) {
    const head = /^The ([a-z ]+) are ([0-9, and]+)\./.exec(statement);
    const threshold = /Keep only the values above (\d+),/.exec(statement);
    if (head === null || threshold === null) {
      throw new Error('the statement does not state the values and the threshold');
    }
    const values = head[2].split(/ and |, /).filter(Boolean).map(Number);
    if (values.some((value) => !Number.isInteger(value))) {
      throw new Error('the statement does not state whole numbers');
    }
    return { subject: head[1], values, threshold: Number(threshold[1]) };
  },
  /** Independent oracle: a plain loop that keeps and adds in one pass. */
  solve(slots) {
    let total = 0;
    const kept = [];
    for (const value of slots.values) {
      if (value > slots.threshold) {
        kept.push(value);
        total += value;
      }
    }
    return { kept, total };
  },
  render(solution) {
    if (solution.kept.length === 0) {
      return `No value is above the threshold, so the total is 0.`;
    }
    const list = solution.kept.length === 1 ? `${solution.kept[0]}` : `${solution.kept.slice(0, -1).join(', ')} and ${solution.kept.at(-1)}`;
    return `The kept values are ${list}, and their total is ${solution.total}.`;
  },
  wires: [
    {
      name: 'kept',
      command: 'jsEval',
      body: [
        'const slots = $slots;',
        'probe(Array.isArray(slots.values) && slots.values.length > 0, "the values must be a non-empty list");',
        'probe(Number.isInteger(slots.threshold), "the threshold must be a whole number");',
        'const kept = slots.values.filter((value) => value > slots.threshold);',
        'probe(slots.values.every((value) => Number.isInteger(value)), "every value must be a whole number");',
        'probe(kept.every((value) => value > slots.threshold), "only the values above the threshold may be kept");',
        'probe(kept.length <= slots.values.length, "the kept list cannot be longer than the recorded list");',
        'return kept;'
      ].join('\n')
    }
  ],
  compute: [
    'const slots = $slots;',
    'probe(Array.isArray($kept), "the kept stage must publish a list");',
    'probe($kept.every((value) => value > slots.threshold), "the published list must hold only values above the threshold");',
    'const total = $kept.reduce((sum, value) => sum + value, 0);',
    'probe(total >= 0, "the total cannot be negative for positive values");',
    'if ($kept.length === 0) {',
    '  return "No value is above the threshold, so the total is 0.";',
    '}',
    'const list = $kept.length === 1 ? String($kept[0]) : $kept.slice(0, -1).join(", ") + " and " + $kept[$kept.length - 1];',
    'return "The kept values are " + list + ", and their total is " + total + ".";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The statement lists ${slots.values.length} values and a threshold of ${slots.threshold}.`,
      `The first stage keeps the values above the threshold: ${solution.kept.length === 0 ? 'none' : solution.kept.join(', ')}.`,
      `The second stage totals what the first published: ${solution.total}.`
    ];
  }
};

/** The latent plan: two stages publish a best value each, and the answer compares them. */
const higherBest = {
  id: 'higher-best-of-two',
  name: 'Higher Best of Two',
  type: 'higher-best-of-two',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 0.95 },
  sample(random) {
    const draw = () => Array.from({ length: 2 + Math.floor(random() * 3) }, () => 3 + Math.floor(random() * 25));
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const first = draw();
      const second = draw();
      const bestA = Math.max(...first);
      const bestB = Math.max(...second);
      if (bestA !== bestB) {
        const [left, right] = SCORES[Math.floor(random() * SCORES.length)];
        return { left, right, first, second };
      }
    }
    throw new Error('the sampler could not draw two different best values');
  },
  statement(slots) {
    return `${slots.left} scored ${slots.first.join(', ')}, and ${slots.right} scored ${slots.second.join(', ')}. ` +
      'Which side has the higher best score, and by how many points?';
  },
  parse(statement) {
    const match = /^(.+) scored ([0-9, ]+), and (.+) scored ([0-9, ]+)\. Which side/.exec(statement);
    if (match === null) {
      throw new Error('the statement does not state the two sides and their scores');
    }
    const scores = (text) => text.split(', ').map(Number);
    return { left: match[1], right: match[3], first: scores(match[2]), second: scores(match[4]) };
  },
  /** Independent oracle: sort each list and take its last element. */
  solve(slots) {
    const bestLeft = [...slots.first].sort((left, right) => left - right).at(-1);
    const bestRight = [...slots.second].sort((left, right) => left - right).at(-1);
    return {
      winner: bestLeft > bestRight ? slots.left : slots.right,
      margin: Math.abs(bestLeft - bestRight)
    };
  },
  render(solution) {
    return `${solution.winner} has the higher best score, by ${solution.margin} points.`;
  },
  wires: [
    {
      name: 'bestLeft',
      command: 'jsEval',
      body: [
        'const slots = $slots;',
        'probe(Array.isArray(slots.first) && slots.first.length > 0, "the first side must have at least one score");',
        'probe(slots.first.every((score) => Number.isInteger(score)), "every first-side score must be a whole number");',
        'const best = slots.first.reduce((highest, score) => (score > highest ? score : highest), slots.first[0]);',
        'probe(slots.first.includes(best), "the published best must be one of the stated scores");',
        'return best;'
      ].join('\n')
    },
    {
      name: 'bestRight',
      command: 'jsEval',
      body: [
        'const slots = $slots;',
        'probe(Array.isArray(slots.second) && slots.second.length > 0, "the second side must have at least one score");',
        'probe(slots.second.every((score) => Number.isInteger(score)), "every second-side score must be a whole number");',
        'const best = slots.second.reduce((highest, score) => (score > highest ? score : highest), slots.second[0]);',
        'probe(slots.second.includes(best), "the published best must be one of the stated scores");',
        'return best;'
      ].join('\n')
    }
  ],
  compute: [
    'const slots = $slots;',
    'probe(Number.isInteger($bestLeft) && Number.isInteger($bestRight), "both stages must publish a whole number");',
    'probe($bestLeft !== $bestRight, "the two sides must not share their best score");',
    'const winner = $bestLeft > $bestRight ? slots.left : slots.right;',
    'const margin = Math.abs($bestLeft - $bestRight);',
    'probe(margin > 0, "the margin must be positive when the best scores differ");',
    'return winner + " has the higher best score, by " + margin + " points.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The first stage publishes the best score of ${slots.left}, the second the best score of ${slots.right}.`,
      'Comparing the two published values is the whole answer, so no side is rescored in the final stage.',
      `${solution.winner} wins by ${solution.margin} points.`
    ];
  }
};

export const decompositionFamilies = [filteredTotal, higherBest];
