/**
 * Families for chapter 3 of the mathematical seed book: grouping, pairs,
 * distributions, and a simple invariant.
 *
 * A family covers one printed template. It provides the reference parse that
 * the compiling model performs on the printed statement, an independent
 * computation, the answer text the source prints, the SOP Lang computation
 * body that the circuit executes, and the explanation lines of the example.
 * Every premise is stated in the problem text, so the chapter is
 * `no-knowledge`.
 */

export const unit = 3;

export const cases = [
  {
    template: 'Forming Pairs',
    type: 'forming-pairs',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/There are (\d+) identical \w+, and one pair contains exactly (\d+) \w+\./);
      if (match === null) {
        throw new Error('the total number of objects or the group size is missing');
      }
      return { total: Number(match[1]), groupSize: Number(match[2]) };
    },
    solve(slots) {
      if (slots.groupSize <= 0) {
        throw new Error('the group size must be positive');
      }
      const groups = Math.floor(slots.total / slots.groupSize);
      const remainder = slots.total - groups * slots.groupSize;
      return { groups, remainder };
    },
    render(solution) {
      return `${solution.groups} pairs, remainder ${solution.remainder}.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.groupSize <= 0) {',
      '  throw new Error("the group size must be positive");',
      '}',
      'const groups = Math.floor(slots.total / slots.groupSize);',
      'const remainder = slots.total - groups * slots.groupSize;',
      'return groups + " pairs, remainder " + remainder + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A complete group needs exactly ${slots.groupSize} objects, so the number of complete groups is how many times ${slots.groupSize} fits inside ${slots.total}.`,
        `Repeatedly taking ${slots.groupSize} at a time from ${slots.total} gives ${solution.groups} complete groups and leaves ${solution.remainder} unused.`,
        `Checking the division: ${solution.groups} × ${slots.groupSize} + ${solution.remainder} = ${slots.total}, and the remainder is smaller than the group size.`
      ];
    }
  },
  {
    template: 'Equal Boxes and Leftover Objects',
    type: 'equal-boxes-and-leftover-objects',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/We have (\d+) \w+ and want to fill boxes with exactly (\d+) objects in each\./);
      if (match === null) {
        throw new Error('the total number of objects or the box capacity is missing');
      }
      return { total: Number(match[1]), capacity: Number(match[2]) };
    },
    solve(slots) {
      if (slots.capacity <= 0) {
        throw new Error('the box capacity must be positive');
      }
      const boxes = Math.floor(slots.total / slots.capacity);
      const leftover = slots.total - boxes * slots.capacity;
      return { boxes, leftover };
    },
    render(solution) {
      return `${solution.boxes} complete boxes and ${solution.leftover} objects left over.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.capacity <= 0) {',
      '  throw new Error("the box capacity must be positive");',
      '}',
      'const boxes = Math.floor(slots.total / slots.capacity);',
      'const leftover = slots.total - boxes * slots.capacity;',
      'return boxes + " complete boxes and " + leftover + " objects left over.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A box counts only if it is completely filled with ${slots.capacity} objects, so partial boxes are not counted.`,
        `Taking ${slots.capacity} objects at a time from ${slots.total} fills ${solution.boxes} boxes and leaves ${solution.leftover} objects outside.`,
        `Checking: ${solution.boxes} × ${slots.capacity} + ${solution.leftover} = ${slots.total}, and ${solution.leftover} is less than ${slots.capacity}, so no extra complete box can be formed.`
      ];
    }
  },
  {
    template: 'Two Ways to Arrange the Pieces',
    type: 'two-ways-to-arrange-the-pieces',
    category: 'no-knowledge',
    parse(statement) {
      const totalMatch = statement.match(/There are (\d+) pieces\./);
      const rowsMatch = statement.match(/in rows of (\d+) and in rows of (\d+)\./);
      if (totalMatch === null || rowsMatch === null) {
        throw new Error('the total number of pieces or one of the row sizes is missing');
      }
      return { total: Number(totalMatch[1]), first: Number(rowsMatch[1]), second: Number(rowsMatch[2]) };
    },
    solve(slots) {
      if (slots.first <= 0 || slots.second <= 0) {
        throw new Error('the row sizes must be positive');
      }
      if (slots.total % slots.first !== 0 || slots.total % slots.second !== 0) {
        throw new Error('the claim of two remainder-free arrangements is false');
      }
      return { firstRows: slots.total / slots.first, secondRows: slots.total / slots.second, first: slots.first, second: slots.second };
    },
    render(solution) {
      return `${solution.firstRows} rows of ${solution.first}; ${solution.secondRows} rows of ${solution.second}.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.first <= 0 || slots.second <= 0) {',
      '  throw new Error("the row sizes must be positive");',
      '}',
      'if (slots.total % slots.first !== 0 || slots.total % slots.second !== 0) {',
      '  throw new Error("the claim of two remainder-free arrangements is false");',
      '}',
      'const firstRows = slots.total / slots.first;',
      'const secondRows = slots.total / slots.second;',
      'return firstRows + " rows of " + slots.first + "; " + secondRows + " rows of " + slots.second + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `An arrangement is possible exactly when repeatedly taking groups of the required size leaves no piece over, which is the same as the remainder being zero.`,
        `For rows of ${slots.first}, ${slots.total} splits into ${solution.firstRows} rows because ${solution.firstRows} × ${slots.first} = ${slots.total}.`,
        `For rows of ${slots.second}, ${slots.total} splits into ${solution.secondRows} rows because ${solution.secondRows} × ${slots.second} = ${slots.total}.`,
        `Both remainders are zero, so the claim is confirmed and the numbers of rows differ because the row sizes differ.`
      ];
    }
  },
  {
    template: 'Can You Reach the Target Number?',
    type: 'can-you-reach-the-target-number',
    category: 'no-knowledge',
    parse(statement) {
      const startMatch = statement.match(/Start with (\d+) tokens, which can be divided exactly into pairs\./);
      const stepMatch = statement.match(/you may add exactly (\d+) tokens\./);
      const targetMatch = statement.match(/The target is (\d+)\./);
      if (startMatch === null || stepMatch === null || targetMatch === null) {
        throw new Error('the start, the move size, or the target is missing');
      }
      return { start: Number(startMatch[1]), step: Number(stepMatch[1]), target: Number(targetMatch[1]) };
    },
    solve(slots) {
      if (slots.step <= 0) {
        throw new Error('the move size must be positive');
      }
      const gap = slots.target - slots.start;
      const reachable = gap >= 0 && gap % slots.step === 0;
      return { reachable, moves: reachable ? gap / slots.step : null, target: slots.target };
    },
    render(solution) {
      return solution.reachable
        ? `Yes, ${solution.target} can be reached in ${solution.moves} moves.`
        : `No, ${solution.target} cannot be reached.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.step <= 0) {',
      '  throw new Error("the move size must be positive");',
      '}',
      'const gap = slots.target - slots.start;',
      'const reachable = gap >= 0 && gap % slots.step === 0;',
      'return reachable ? "Yes, " + slots.target + " can be reached in " + (gap / slots.step) + " moves." : "No, " + slots.target + " cannot be reached.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Every move adds exactly ${slots.step}, so after any number of moves the count is ${slots.start} plus a multiple of ${slots.step}.`,
        `That property is the invariant: the count stays paired all the way, and it can never become an odd number.`,
        `${slots.target} differs from ${slots.start} by ${slots.target - slots.start}, which is not a whole multiple of ${slots.step}, so no number of moves lands exactly on ${slots.target}.`,
        `The invariant explains the answer without trying move after move.`
      ];
    }
  },
  {
    template: 'Sharing with a Condition',
    type: 'sharing-with-a-condition',
    category: 'no-knowledge',
    parse(statement) {
      const shareMatch = statement.match(/[A-Z][a-z]+ and [A-Z][a-z]+ share (\d+) cards\./);
      const differenceMatch = statement.match(/exactly (\d+) card more than the second/);
      if (shareMatch === null || differenceMatch === null) {
        throw new Error('the total number of cards or the required difference is missing');
      }
      return { total: Number(shareMatch[1]), difference: Number(differenceMatch[1]) };
    },
    solve(slots) {
      const remainder = slots.total - slots.difference;
      if (remainder < 0 || remainder % 2 !== 0) {
        throw new Error('the total and the difference do not split into two whole shares');
      }
      const second = remainder / 2;
      return { first: second + slots.difference, second };
    },
    render(solution) {
      return `First person: ${solution.first}; second person: ${solution.second}.`;
    },
    compute: [
      'const slots = $slots;',
      'const remainder = slots.total - slots.difference;',
      'if (remainder < 0 || remainder % 2 !== 0) {',
      '  throw new Error("the total and the difference do not split into two whole shares");',
      '}',
      'const second = remainder / 2;',
      'return "First person: " + (second + slots.difference) + "; second person: " + second + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `All ${slots.total} cards are used, and the first person receives ${slots.difference} more than the second.`,
        `Setting aside the extra ${slots.difference} cards leaves ${slots.total - slots.difference} cards to split into two equal shares of ${solution.second}.`,
        `Giving the extra cards back to the first person produces ${solution.first} and ${solution.second}, which differ by ${slots.difference}.`,
        `Checking: ${solution.first} + ${solution.second} = ${slots.total}, so all the cards are used.`
      ];
    }
  }
];
