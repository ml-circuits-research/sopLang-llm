/**
 * Families for chapter 2 of the mathematical seed book: states, changes, and
 * working backward.
 *
 * A family covers one printed template. It provides the reference parse that
 * the compiling model performs on the printed statement, an independent
 * computation, the answer text the source prints, the SOP Lang computation
 * body that the circuit executes, and the explanation lines of the example.
 * Every premise of a solution is stated in the problem text, so the chapter is
 * `no-knowledge`.
 */

export const unit = 2;

const NUMBER_WORDS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12
};

export const cases = [
  {
    template: 'State After Two Changes',
    type: 'state-after-two-changes',
    category: 'no-knowledge',
    parse(statement) {
      const initialMatch = statement.match(/initially contains (\d+) \w+\./);
      const firstMatch = statement.match(/The first rule says .(add|remove) (\d+),./);
      const secondMatch = statement.match(/the second says .(add|remove) (\d+)\./);
      if (initialMatch === null || firstMatch === null || secondMatch === null) {
        throw new Error('the initial count or one of the two rules is missing');
      }
      return {
        initial: Number(initialMatch[1]),
        first: { op: firstMatch[1], amount: Number(firstMatch[2]) },
        second: { op: secondMatch[1], amount: Number(secondMatch[2]) }
      };
    },
    solve(slots) {
      const apply = (value, change) => (change.op === 'add' ? value + change.amount : value - change.amount);
      const afterFirst = apply(slots.initial, slots.first);
      const afterSecond = apply(afterFirst, slots.second);
      if (afterSecond < 0) {
        throw new Error('the second rule would remove more than the box holds');
      }
      return { afterFirst, afterSecond };
    },
    render(solution) {
      return String(solution.afterSecond);
    },
    compute: [
      'const slots = $slots;',
      'const apply = (value, change) => (change.op === "add" ? value + change.amount : value - change.amount);',
      'const afterFirst = apply(slots.initial, slots.first);',
      'const afterSecond = apply(afterFirst, slots.second);',
      'if (afterSecond < 0) {',
      '  throw new Error("the second rule would remove more than the box holds");',
      '}',
      'return String(afterSecond);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The box starts with ${slots.initial}, and the rules are applied in the printed order, so the state is updated once per rule instead of combining them.`,
        `The first rule makes the count ${slots.initial} ${slots.first.op === 'add' ? '+' : '-'} ${slots.first.amount} = ${solution.afterFirst}.`,
        `The second rule then acts on ${solution.afterFirst}: ${solution.afterFirst} ${slots.second.op === 'add' ? '+' : '-'} ${slots.second.amount} = ${solution.afterSecond}.`,
        `The order matters because the second rule is read against the result of the first, not against the starting count.`
      ];
    }
  },
  {
    template: 'Reconstruct the Starting State',
    type: 'reconstruct-the-starting-state',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/After (\d+) \w+ were added to a box and then (\d+) were removed, (\d+) remained\./);
      if (match === null) {
        throw new Error('the added count, the removed count, or the final count is missing');
      }
      return { added: Number(match[1]), removed: Number(match[2]), final: Number(match[3]) };
    },
    solve(slots) {
      // Work backward: undo the last change first, then the one before it.
      const steps = [
        { op: 'add', amount: slots.added },
        { op: 'remove', amount: slots.removed }
      ];
      let value = slots.final;
      for (let index = steps.length - 1; index >= 0; index -= 1) {
        const step = steps[index];
        value = step.op === 'add' ? value - step.amount : value + step.amount;
      }
      if (value < 0) {
        throw new Error('the reconstructed start is negative');
      }
      return { start: value };
    },
    render(solution) {
      return String(solution.start);
    },
    compute: [
      'const slots = $slots;',
      'const steps = [{ op: "add", amount: slots.added }, { op: "remove", amount: slots.removed }];',
      'let value = slots.final;',
      'for (let index = steps.length - 1; index >= 0; index -= 1) {',
      '  const step = steps[index];',
      '  value = step.op === "add" ? value - step.amount : value + step.amount;',
      '}',
      'if (value < 0) {',
      '  throw new Error("the reconstructed start is negative");',
      '}',
      'return String(value);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Forward, the box first gains ${slots.added} objects and then loses ${slots.removed}, ending at ${slots.final}.`,
        'Working backward means inverting each rule and reversing the order: undoing "remove" is adding back, and undoing "add" is taking away.',
        `Undoing the last change gives ${slots.final} + ${slots.removed} = ${slots.final + slots.removed}; undoing the first gives ${slots.final + slots.removed} - ${slots.added} = ${solution.start}.`,
        `Checking forward from ${solution.start}: ${solution.start} + ${slots.added} - ${slots.removed} = ${slots.final}, which matches.`
      ];
    }
  },
  {
    template: 'A Transfer That Preserves the Total',
    type: 'a-transfer-that-preserves-the-total',
    category: 'no-knowledge',
    parse(statement) {
      const boxesMatch = statement.match(/Box A has (\d+) \w+ and Box B has (\d+)\./);
      const movedMatch = statement.match(/([A-Za-z]+|\d+) tokens are moved from A to B/);
      if (boxesMatch === null || movedMatch === null) {
        throw new Error('the starting amounts or the moved amount are missing');
      }
      const moved = Number.isNaN(Number(movedMatch[1])) ? NUMBER_WORDS[movedMatch[1].toLowerCase()] : Number(movedMatch[1]);
      if (moved === undefined) {
        throw new Error(`unknown number word "${movedMatch[1]}"`);
      }
      return { a: Number(boxesMatch[1]), b: Number(boxesMatch[2]), moved };
    },
    solve(slots) {
      if (slots.moved > slots.a) {
        throw new Error('more tokens are moved than Box A holds');
      }
      const afterA = slots.a - slots.moved;
      const afterB = slots.b + slots.moved;
      const total = slots.a + slots.b;
      if (afterA + afterB !== total) {
        throw new Error('the transfer does not conserve the total');
      }
      return { afterA, afterB, total };
    },
    render(solution) {
      return `A=${solution.afterA}, B=${solution.afterB}, total=${solution.total}.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.moved > slots.a) {',
      '  throw new Error("more tokens are moved than Box A holds");',
      '}',
      'const afterA = slots.a - slots.moved;',
      'const afterB = slots.b + slots.moved;',
      'const total = slots.a + slots.b;',
      'if (afterA + afterB !== total) {',
      '  throw new Error("the transfer does not conserve the total");',
      '}',
      'return "A=" + afterA + ", B=" + afterB + ", total=" + total + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Box A gives away ${slots.moved} tokens and Box B receives exactly those ${slots.moved} tokens, so nothing is created or lost.`,
        `Box A goes from ${slots.a} to ${slots.a} - ${slots.moved} = ${solution.afterA}, and Box B goes from ${slots.b} to ${slots.b} + ${slots.moved} = ${solution.afterB}.`,
        `The conserved total is ${slots.a} + ${slots.b} = ${solution.total}, and the same total is ${solution.afterA} + ${solution.afterB}, which is the check that the transfer was counted correctly.`
      ];
    }
  },
  {
    template: 'How Many Were Added?',
    type: 'how-many-were-added',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/initially had (\d+) elements, and after one action it has (\d+)\./);
      if (match === null) {
        throw new Error('the initial count or the final count is missing');
      }
      return { initial: Number(match[1]), final: Number(match[2]) };
    },
    solve(slots) {
      const change = slots.final - slots.initial;
      if (change < 0) {
        throw new Error('the stated action was "add", so the final count cannot be smaller');
      }
      return { change };
    },
    render(solution) {
      return String(solution.change);
    },
    compute: [
      'const slots = $slots;',
      'const change = slots.final - slots.initial;',
      'if (change < 0) {',
      '  throw new Error(\'the stated action was "add", so the final count cannot be smaller\');',
      '}',
      'return String(change);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The problem states that the only action was adding, so the change is exactly the gap between the initial and the final state.`,
        `Counting the steps from ${slots.initial} up to ${slots.final} is the same as subtracting: ${slots.final} - ${slots.initial} = ${solution.change}.`,
        `Checking: ${slots.initial} + ${solution.change} = ${slots.final}, so ${solution.change} elements were added.`
      ];
    }
  },
  {
    template: 'Choose the Compatible Result',
    type: 'choose-the-compatible-result',
    category: 'no-knowledge',
    parse(statement) {
      const startMatch = statement.match(/A box starts with (\d+) balls\./);
      const firstMatch = statement.match(/Rule 1: (add|remove) (\d+)\./);
      const secondMatch = statement.match(/Rule 2: (add|remove) (\d+)\./);
      const candidatesMatch = statement.match(/propose final results: ([0-9, ]+)\./);
      if (startMatch === null || firstMatch === null || secondMatch === null || candidatesMatch === null) {
        throw new Error('the start, the rules, or the candidate list is missing');
      }
      return {
        start: Number(startMatch[1]),
        first: { op: firstMatch[1], amount: Number(firstMatch[2]) },
        second: { op: secondMatch[1], amount: Number(secondMatch[2]) },
        candidates: candidatesMatch[1].split(',').map((value) => Number(value.trim()))
      };
    },
    solve(slots) {
      const apply = (value, change) => (change.op === 'add' ? value + change.amount : value - change.amount);
      const target = apply(apply(slots.start, slots.first), slots.second);
      const matching = slots.candidates.filter((value) => value === target);
      if (matching.length !== 1) {
        throw new Error(`${matching.length} candidate results are compatible with both rules instead of one`);
      }
      return { target };
    },
    render(solution) {
      return String(solution.target);
    },
    compute: [
      'const slots = $slots;',
      'const apply = (value, change) => (change.op === "add" ? value + change.amount : value - change.amount);',
      'const target = apply(apply(slots.start, slots.first), slots.second);',
      'const matching = slots.candidates.filter((value) => value === target);',
      'if (matching.length !== 1) {',
      '  throw new Error(`${matching.length} candidate results are compatible with both rules instead of one`);',
      '}',
      'return String(target);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A result is compatible only if it follows from applying both rules in order to the starting count ${slots.start}.`,
        `The first rule gives ${slots.start} ${slots.first.op === 'add' ? '+' : '-'} ${slots.first.amount}, and the second rule then applies to that intermediate number.`,
        `The only result that satisfies both rules in order is ${solution.target}, so the other two candidates must fail at least one of the rules.`,
        `Checking: ${slots.start} ${slots.first.op === 'add' ? '+' : '-'} ${slots.first.amount} ${slots.second.op === 'add' ? '+' : '-'} ${slots.second.amount} = ${solution.target}.`
      ];
    }
  }
];
