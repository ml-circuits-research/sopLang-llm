/**
 * Aggregation families of the procedural arithmetic source.
 *
 * The decomposition families showed a plan whose stages each publish one value.
 * These two widen the same shape to plans where the second stage needs more
 * than one number out of the first, so a stage publishes a small record instead
 * of a list: the score plan filters the scores that pass a threshold and then
 * summarizes the kept list as a count and a total, and the container plan fills
 * whole crates and then packs the parts beyond the crates into boxes.
 *
 * Both samplers keep the arithmetic integer-exact on purpose: the oracle, the
 * circuit, and the printed answer must agree exactly, and a rounding rule would
 * be a different task from the one these families teach. The oracle of each
 * family is a genuinely different algorithm from its stages: the score oracle
 * counts and adds in one `for` loop where the stages use `filter` and `reduce`,
 * and the container oracle divides and takes remainders with `Math.floor` where
 * the stages remove one crate and one box at a time.
 */

/** The latent plan: keep the scores that pass a threshold, then count and average them. */
const averageOfQualifying = {
  id: 'average-of-qualifying',
  name: 'Average of Qualifying',
  type: 'average-of-qualifying',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 3, branching: 1, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    // The statement must keep at least two scores and leave at least one of
    // them behind, and the kept total must divide by the kept count, because
    // the printed average is exact: the sampler redraws until all three hold,
    // so no rounding rule and no sampling flag leaks into the compiled slots.
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const count = 5 + Math.floor(random() * 4);
      const minimum = 5 + Math.floor(random() * 26);
      const scores = [];
      for (let index = 0; index < count; index += 1) {
        scores.push(1 + Math.floor(random() * 60));
      }
      let kept = 0;
      let total = 0;
      for (const score of scores) {
        if (score >= minimum) {
          kept += 1;
          total += score;
        }
      }
      if (kept < 2 || kept === scores.length || total % kept !== 0) {
        continue;
      }
      return { scores, minimum };
    }
    throw new Error('the sampler could not draw scores whose qualifying average is a whole number');
  },
  statement(slots) {
    return `The scores are ${slots.scores.slice(0, -1).join(', ')} and ${slots.scores.at(-1)}. ` +
      `A score qualifies when it is at least ${slots.minimum}. ` +
      'How many scores qualify, and what is their exact average?';
  },
  parse(statement) {
    const head = /^The scores are ([0-9, and]+)\. A score qualifies when it is at least (\d+)\./.exec(statement);
    if (head === null) {
      throw new Error('the statement does not state the scores and the qualifying minimum');
    }
    const scores = head[1].split(/ and |, /).filter(Boolean).map(Number);
    if (scores.length === 0 || scores.some((score) => !Number.isInteger(score))) {
      throw new Error('the statement does not state whole scores');
    }
    return { scores, minimum: Number(head[2]) };
  },
  /** Independent oracle: one pass that keeps, counts, and adds at the same time. */
  solve(slots) {
    let kept = 0;
    let total = 0;
    for (const score of slots.scores) {
      if (score >= slots.minimum) {
        kept += 1;
        total += score;
      }
    }
    return kept === 0
      ? { count: 0, total: 0, average: null }
      : { count: kept, total, average: total / kept };
  },
  render(solution) {
    // Zero qualifying scores is a valid, honest outcome of the filter, so the family
    // says so instead of dividing by zero or emitting an execution error.
    return solution.average === null
      ? 'No scores qualify, so an exact average cannot be computed.'
      : `${solution.count} scores qualify and their average is ${solution.average}.`;
  },
  wires: [
    {
      name: 'qualifying',
      command: 'aggregate',
      body: [
        'source: $slots.scores',
        'op: count',
        'predicate:',
        '  atLeast: $slots.minimum'
      ].join('\n')
    },
    {
      name: 'summary',
      command: 'aggregate',
      body: [
        'source: $slots.scores',
        'op: average',
        'predicate:',
        '  atLeast: $slots.minimum'
      ].join('\n')
    }
  ],
  compute: [
    'const slots = $slots;',
    'return $qualifying + " scores qualify and their average is " + $summary + ".";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The statement lists ${slots.scores.length} scores and a qualifying minimum of ${slots.minimum}.`,
      `The qualifying stage keeps the ${solution.count} scores at or above the minimum, and the summary stage reduces that list to a count and a total of ${solution.total}.`,
      `The printed average is the published total over the published count, ${solution.average}.`
    ];
  }
};

/** The latent plan: fill whole crates, then pack the parts beyond them into boxes and report the remainder. */
const conversionChainLeftover = {
  id: 'conversion-chain-leftover',
  name: 'Conversion Chain Leftover',
  type: 'conversion-chain-leftover',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 3, branching: 1, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    // The printed answer reports a full crate count, a full box count, and a
    // remainder, so the sampler redraws until all three are positive: the
    // parts beyond the crates must still fill at least one box and must not be
    // an exact multiple of the box size.
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const parts = 200 + Math.floor(random() * 1801);
      const perCrate = 20 + Math.floor(random() * 41);
      const perBox = 2 + Math.floor(random() * 7);
      const rest = parts % perCrate;
      if (perBox >= perCrate || parts < perCrate || rest < perBox || rest % perBox === 0) {
        continue;
      }
      return { parts, perCrate, perBox };
    }
    throw new Error('the sampler could not draw parts that leave a full crate, a full box, and a remainder');
  },
  statement(slots) {
    return `A sorting line receives ${slots.parts} parts. ` +
      `A crate holds ${slots.perCrate} parts and a box holds ${slots.perBox} parts. ` +
      'Crates are filled first, then boxes. How many crates and boxes are filled, and how many parts are left over?';
  },
  parse(statement) {
    const match = /^A sorting line receives (\d+) parts\. A crate holds (\d+) parts and a box holds (\d+) parts\./.exec(statement);
    if (match === null) {
      throw new Error('the statement does not state the parts, the crate size, and the box size');
    }
    return { parts: Number(match[1]), perCrate: Number(match[2]), perBox: Number(match[3]) };
  },
  /** Independent oracle: whole divisions and remainders, without a packing loop. */
  solve(slots) {
    const crates = Math.floor(slots.parts / slots.perCrate);
    const rest = slots.parts % slots.perCrate;
    return {
      parts: slots.parts,
      crates,
      rest,
      boxes: Math.floor(rest / slots.perBox),
      leftover: rest % slots.perBox
    };
  },
  render(solution) {
    return `${solution.parts} parts fill ${solution.crates} crates and ${solution.boxes} boxes, with ${solution.leftover} parts left over.`;
  },
  wires: [
    {
      name: 'crates',
      command: 'jsEval',
      body: [
        'const slots = $slots;',
        'let crates = 0;',
        'let rest = slots.parts;',
        'while (rest >= slots.perCrate) {',
        '  rest -= slots.perCrate;',
        '  crates += 1;',
        '}',
        'probe(rest < slots.perCrate, "the parts beyond the crates must be fewer than a full crate");',
        'probe(crates * slots.perCrate + rest === slots.parts, "the crates and the parts beyond them must rebuild the stated parts");',
        'return { crates, rest };'
      ].join('\n')
    },
    {
      name: 'boxes',
      command: 'jsEval',
      body: [
        'const slots = $slots;',
        'probe(Number.isInteger($crates.rest) && $crates.rest >= 0 && $crates.rest < slots.perCrate, "the parts beyond the crates must be fewer than a full crate");',
        'let boxes = 0;',
        'let leftover = $crates.rest;',
        'while (leftover >= slots.perBox) {',
        '  leftover -= slots.perBox;',
        '  boxes += 1;',
        '}',
        'probe(leftover < slots.perBox, "the leftover parts must be fewer than a full box");',
        'return { boxes, leftover };'
      ].join('\n')
    }
  ],
  compute: [
    'const slots = $slots;',
    'const packed = $crates.crates * slots.perCrate + $boxes.boxes * slots.perBox + $boxes.leftover;',
    'probe(packed === slots.parts, "the crates, the boxes, and the leftover must rebuild the stated parts");',
    'return slots.parts + " parts fill " + $crates.crates + " crates and " + $boxes.boxes + " boxes, with " + $boxes.leftover + " parts left over.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The statement hands ${slots.parts} parts to a line whose crates hold ${slots.perCrate} parts and whose boxes hold ${slots.perBox} parts.`,
      `The crates stage removes one crate at a time and publishes ${solution.crates} full crates with ${solution.rest} parts beyond them.`,
      `The boxes stage packs those parts one box at a time: ${solution.boxes} boxes, with ${solution.leftover} parts left over.`
    ];
  }
};

export const aggregationFamilies = [averageOfQualifying, conversionChainLeftover];
