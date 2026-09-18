/**
 * Families for chapter 21 of the mathematical seed book: sets, properties, and
 * logical classification (part A: templates 21.1-21.9).
 *
 * Every printed template of the chapter is covered by one case. Each case
 * provides the reference parse that compiles the statement into the slots
 * literal, an independent computation over the parsed slots, the answer text
 * the source prints, the JS computation body the answer wire executes, and the
 * explanation lines of the example. Every premise of every solution is stated
 * in the problem text (the definitions of "both", "at least one", "even",
 * "exactly one" and the integer convention are all given in the statements), so
 * the whole chapter is `no-knowledge`.
 *
 * The chapter is longer than the file-size rule of DS001, so it is split into
 * `chapter-21.mjs`, `chapter-21-b.mjs`, and `chapter-21-c.mjs`; every part
 * repeats the header, the chapter number, and the helpers.
 */

export const unit = 21;

function splitWords(text) {
  return text
    .split(/,| and /)
    .map((value) => value.trim())
    .filter((value) => value !== '');
}

function splitNumbers(text) {
  return splitWords(text).map((value) => Number(value));
}

function countWithin(low, high, keep) {
  let total = 0;
  for (let value = low; value <= high; value += 1) {
    if (keep(value)) {
      total += 1;
    }
  }
  return total;
}

function matchesQuestion(question, value) {
  const atMost = question.match(/at most (\d+)/);
  if (atMost !== null) {
    return value <= Number(atMost[1]);
  }
  const exact = question.match(/the number (\d+)/);
  if (exact !== null) {
    return value === Number(exact[1]);
  }
  throw new Error(`unsupported question "${question}"`);
}

export const cases = [
  {
    template: 'Two Properties at the Same Time',
    type: 'two-properties-at-the-same-time',
    category: 'no-knowledge',
    parse(statement) {
      const total = statement.match(/There are (\d+) cards/);
      const first = statement.match(/(\d+) are round/);
      const second = statement.match(/(\d+) are blue/);
      const both = statement.match(/(\d+) are both/);
      if (total === null || first === null || second === null || both === null) {
        throw new Error('the property counts are missing');
      }
      return {
        total: Number(total[1]),
        first: Number(first[1]),
        second: Number(second[1]),
        both: Number(both[1])
      };
    },
    solve(slots) {
      if (slots.both > slots.first || slots.both > slots.second) {
        throw new Error('the intersection is larger than a property');
      }
      return { firstOnly: slots.first - slots.both };
    },
    render(solution) {
      return `${solution.firstOnly} cards.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.both > slots.first || slots.both > slots.second) { throw new Error("the intersection is larger than a property"); }',
      'return String(slots.first - slots.both) + " cards.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The round group has ${slots.first} cards and the blue group has ${slots.second}, and ${slots.both} cards satisfy both properties at once.`,
        `Asking for "round but not blue" removes the shared cards from the round group, so the count is ${slots.first} - ${slots.both}.`,
        `The remaining ${solution.firstOnly} cards carry the round property alone.`
      ];
    }
  },
  {
    template: 'At Least One of Two Properties',
    type: 'at-least-one-of-two-properties',
    category: 'no-knowledge',
    parse(statement) {
      const star = statement.match(/(\d+) have a star/);
      const stripe = statement.match(/(\d+) have a stripe/);
      const both = statement.match(/(\d+) have both/);
      if (star === null || stripe === null || both === null) {
        throw new Error('the star, stripe, or both count is missing');
      }
      return { star: Number(star[1]), stripe: Number(stripe[1]), both: Number(both[1]) };
    },
    solve(slots) {
      return { union: slots.star + slots.stripe - slots.both };
    },
    render(solution) {
      return `${solution.union} pieces.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.star + slots.stripe - slots.both) + " pieces.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Adding the two property counts counts the shared pieces twice, so the shared ${slots.both} pieces must be subtracted once.`,
        `The marked group is therefore ${slots.star} + ${slots.stripe} - ${slots.both} = ${solution.union} pieces.`,
        'This is the addition rule for a union of two sets.'
      ];
    }
  },
  {
    template: 'Neither Property',
    type: 'neither-property',
    category: 'no-knowledge',
    parse(statement) {
      const total = statement.match(/There are (\d+) tokens/);
      const union = statement.match(/(\d+) are red or/);
      if (total === null || union === null) {
        throw new Error('the total or the grouped count is missing');
      }
      return { total: Number(total[1]), union: Number(union[1]) };
    },
    solve(slots) {
      if (slots.union > slots.total) {
        throw new Error('the grouped count exceeds the total');
      }
      return { neither: slots.total - slots.union };
    },
    render(solution) {
      return `${solution.neither} tokens.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.union > slots.total) { throw new Error("the grouped count exceeds the total"); }',
      'return String(slots.total - slots.union) + " tokens.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The ${slots.union} tokens described by the rule are exactly those that are red, have a triangle, or have both.`,
        `Everything else in the group of ${slots.total} tokens satisfies neither property.`,
        `That complement has ${slots.total} - ${slots.union} = ${solution.neither} tokens.`
      ];
    }
  },
  {
    template: 'Exactly One Property',
    type: 'exactly-one-property',
    category: 'no-knowledge',
    parse(statement) {
      const circle = statement.match(/(\d+) have a circle/);
      const square = statement.match(/(\d+) have a square/);
      const both = statement.match(/(\d+) have both/);
      if (circle === null || square === null || both === null) {
        throw new Error('the circle, square, or both count is missing');
      }
      return { circle: Number(circle[1]), square: Number(square[1]), both: Number(both[1]) };
    },
    solve(slots) {
      return {
        circleOnly: slots.circle - slots.both,
        squareOnly: slots.square - slots.both
      };
    },
    render(solution) {
      return `${solution.circleOnly + solution.squareOnly} labels.`;
    },
    compute: [
      'const slots = $slots;',
      'const circleOnly = slots.circle - slots.both;',
      'const squareOnly = slots.square - slots.both;',
      'return String(circleOnly + squareOnly) + " labels.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `"Exactly one" splits into two disjoint groups: circle without square and square without circle.`,
        `Subtracting the ${slots.both} shared labels gives ${solution.circleOnly} circle-only and ${solution.squareOnly} square-only labels.`,
        `Their sum is ${solution.circleOnly + solution.squareOnly} labels.`
      ];
    }
  },
  {
    template: 'One Group Entirely Inside Another',
    type: 'one-group-entirely-inside-another',
    category: 'no-knowledge',
    parse(statement) {
      const sizes = statement.match(/There are (\d+) gold pieces and (\d+) metallic pieces/);
      if (sizes === null) {
        throw new Error('the two group sizes are missing');
      }
      return { inner: Number(sizes[1]), outer: Number(sizes[2]) };
    },
    solve(slots) {
      if (slots.inner > slots.outer) {
        throw new Error('the contained group cannot be larger than the container');
      }
      return { outerOnly: slots.outer - slots.inner };
    },
    render(solution) {
      return `${solution.outerOnly} pieces.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.inner > slots.outer) { throw new Error("the contained group cannot be larger than the container"); }',
      'return String(slots.outer - slots.inner) + " pieces.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The rule "all gold pieces are metallic" says the ${slots.inner} gold pieces are already counted among the ${slots.outer} metallic pieces.`,
        `Metallic pieces that are not gold are the metallic group with the gold group removed.`,
        `That leaves ${slots.outer} - ${slots.inner} = ${solution.outerOnly} pieces.`
      ];
    }
  },
  {
    template: 'An Impossible Rule Combination',
    type: 'an-impossible-rule-combination',
    category: 'no-knowledge',
    parse(statement) {
      const rule = statement.match(/every piece with ([a-z ]+?) is ([a-z]+)/);
      const observed = statement.match(/piece with ([a-z ]+?) and says it is ([a-z]+), not ([a-z]+)/);
      if (rule === null || observed === null) {
        throw new Error('the rule or the observation is missing');
      }
      return {
        ruleProperty: rule[1],
        ruleConsequence: rule[2],
        observedProperty: observed[1],
        observedValue: observed[2],
        deniedValue: observed[3]
      };
    },
    solve(slots) {
      const contradicts =
        slots.observedProperty === slots.ruleProperty &&
        slots.deniedValue === slots.ruleConsequence &&
        slots.observedValue !== slots.ruleConsequence;
      return { possible: !contradicts };
    },
    render(solution) {
      return solution.possible
        ? 'Yes; the description can be true.'
        : 'No; the description is incompatible with the rule.';
    },
    compute: [
      'const slots = $slots;',
      'const contradicts = slots.observedProperty === slots.ruleProperty &&',
      '  slots.deniedValue === slots.ruleConsequence &&',
      '  slots.observedValue !== slots.ruleConsequence;',
      'return contradicts ? "No; the description is incompatible with the rule." : "Yes; the description can be true.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The rule is a universal implication: anything with the property "${slots.ruleProperty}" must be "${slots.ruleConsequence}".`,
        `The observation keeps that property but denies the value the rule forces, so it instantaneously violates the implication.`,
        'A single observation of this form is enough to make the description impossible while the rule is obeyed.'
      ];
    }
  },
  {
    template: 'A Witness for the Word “Exists”',
    type: 'a-witness-for-the-word-exists',
    category: 'no-knowledge',
    parse(statement) {
      const list = statement.match(/cards on the table are ([^.]+)\./);
      const threshold = statement.match(/greater than (\d+)/);
      if (list === null || threshold === null) {
        throw new Error('the card list or the threshold is missing');
      }
      return { cards: splitNumbers(list[1]), threshold: Number(threshold[1]) };
    },
    solve(slots) {
      const witnesses = slots.cards.filter((value) => value > slots.threshold);
      if (witnesses.length !== 1) {
        throw new Error(`the condition has ${witnesses.length} witnesses instead of one`);
      }
      return { witness: witnesses[0] };
    },
    render(solution) {
      return `Card ${solution.witness}.`;
    },
    compute: [
      'const slots = $slots;',
      'const witnesses = slots.cards.filter(function (value) { return value > slots.threshold; });',
      'if (witnesses.length !== 1) { throw new Error("the condition has " + witnesses.length + " witnesses instead of one"); }',
      'return "Card " + witnesses[0] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `An "exists" statement is proved by exhibiting one element that satisfies the condition, not by checking all of them.`,
        `Testing ${slots.cards.join(', ')} against the condition "greater than ${slots.threshold}" leaves exactly the card ${solution.witness}.`,
        `That card is the witness, and no other card in the list can play the role.`
      ];
    }
  },
  {
    template: 'The Counterexample That Refutes “All”',
    type: 'the-counterexample-that-refutes-all',
    category: 'no-knowledge',
    parse(statement) {
      const list = statement.match(/list ([\d,\s]+) are even/);
      if (list === null) {
        throw new Error('the number list is missing');
      }
      return { numbers: splitNumbers(list[1]) };
    },
    solve(slots) {
      const counterexamples = slots.numbers.filter((value) => value % 2 !== 0);
      if (counterexamples.length !== 1) {
        throw new Error(`the list has ${counterexamples.length} counterexamples instead of one`);
      }
      return { counterexample: counterexamples[0] };
    },
    render(solution) {
      return `${solution.counterexample}.`;
    },
    compute: [
      'const slots = $slots;',
      'const counterexamples = slots.numbers.filter(function (value) { return value % 2 !== 0; });',
      'if (counterexamples.length !== 1) { throw new Error("the list has " + counterexamples.length + " counterexamples instead of one"); }',
      'return String(counterexamples[0]) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `To refute an "all" statement one element that breaks it is enough, because the claim covers every element of the list.`,
        `Checking the pairing rule (no remainder when divided by two) over ${slots.numbers.join(', ')} shows that only ${solution.counterexample} fails.`,
        `That number is the counterexample, and its existence makes the claim false.`
      ];
    }
  },
  {
    template: 'Two Boxes That Form a Partition',
    type: 'two-boxes-that-form-a-partition',
    category: 'no-knowledge',
    parse(statement) {
      const total = statement.match(/There are (\d+) cards numbered (\d+)–(\d+)/);
      const threshold = statement.match(/numbers at most (\d+) go into the first/);
      if (total === null || threshold === null) {
        throw new Error('the card count, range, or threshold is missing');
      }
      return {
        total: Number(total[1]),
        low: Number(total[2]),
        high: Number(total[3]),
        threshold: Number(threshold[1])
      };
    },
    solve(slots) {
      const first = countWithin(slots.low, slots.high, (value) => value <= slots.threshold);
      const second = countWithin(slots.low, slots.high, (value) => value > slots.threshold);
      if (first + second !== slots.total) {
        throw new Error('the two boxes do not cover the collection');
      }
      return { first, second };
    },
    render(solution) {
      return `${solution.first} in the first box and ${solution.second} in the second.`;
    },
    compute: [
      'const slots = $slots;',
      'let first = 0;',
      'let second = 0;',
      'for (let value = slots.low; value <= slots.high; value += 1) {',
      '  if (value <= slots.threshold) { first += 1; } else { second += 1; }',
      '}',
      'if (first + second !== slots.total) { throw new Error("the two boxes do not cover the collection"); }',
      'return first + " in the first box and " + second + " in the second.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The two rules "at most ${slots.threshold}" and "greater than ${slots.threshold}" never both hold and never both fail, so each number goes to exactly one box.`,
        `Counting the numbers from ${slots.low} to ${slots.high} under each rule gives ${solution.first} and ${solution.second}.`,
        `The two counts add up to the ${slots.total} cards, which confirms the partition.`
      ];
    }
  }
];
