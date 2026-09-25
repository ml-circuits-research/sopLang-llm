/**
 * Families for chapter 7 of the mathematical seed book: equalities, transfers,
 * and inverse operations.
 *
 * Each template states its own operational rule (a transfer decreases the source
 * and increases the destination by the same amount, additions are undone by
 * subtraction, equilibrium means equality), so no outside fact is needed and
 * the whole chapter is `no-knowledge`.
 */

export const unit = 7;

export const cases = [
  {
    template: 'Balancing Two Boxes',
    type: 'balancing-two-boxes',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/Box A has (\d+) cubes, while B has (\d+)/);
      if (match === null) {
        throw new Error('the two starting amounts are missing');
      }
      return { a: Number(match[1]), b: Number(match[2]) };
    },
    solve(slots) {
      const gap = slots.a - slots.b;
      if (gap < 0 || gap % 2 !== 0) {
        throw new Error('the two boxes cannot be equalized by an integer number of moves');
      }
      return { moved: gap / 2 };
    },
    render(solution) {
      return `${solution.moved} cubes.`;
    },
    compute: [
      'const slots = $slots;',
      'const gap = slots.a - slots.b;',
      'if (gap < 0 || gap % 2 !== 0) {',
      '  throw new Error("the two boxes cannot be equalized by an integer number of moves");',
      '}',
      'return String(gap / 2) + " cubes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Box A starts ${slots.a - slots.b} cubes ahead of Box B, and moving one cube takes 1 away from A while giving 1 to B.`,
        `Each move therefore closes the gap by 2, so the gap of ${slots.a - slots.b} shrinks by 2 per move.`,
        `Dividing the gap in half gives ${slots.a - slots.b} ÷ 2 = ${solution.moved} moves, after which both boxes hold ${slots.b + solution.moved} cubes.`,
        `The equality check ${slots.a} - ${solution.moved} = ${slots.b} + ${solution.moved} confirms the answer.`
      ];
    }
  },
  {
    template: 'The Unknown Term in a Chain',
    type: 'the-unknown-term-in-a-chain',
    category: 'no-knowledge',
    parse(statement) {
      const startMatch = statement.match(/start with (\d+) tokens/);
      const secondMatch = statement.match(/then another (\d+)/);
      const endMatch = statement.match(/There are (\d+) at the end/);
      if (startMatch === null || secondMatch === null || endMatch === null) {
        throw new Error('the chain of the two additions is missing');
      }
      return {
        start: Number(startMatch[1]),
        second: Number(secondMatch[1]),
        end: Number(endMatch[1])
      };
    },
    solve(slots) {
      const remaining = slots.end - slots.second;
      const added = remaining - slots.start;
      if (added < 0) {
        throw new Error('the final amount is below the starting amount');
      }
      return { added };
    },
    render(solution) {
      return String(solution.added);
    },
    compute: [
      'const slots = $slots;',
      'const added = slots.end - slots.second - slots.start;',
      'if (added < 0) {',
      '  throw new Error("the final amount is below the starting amount");',
      '}',
      'return String(added);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The chain reads ${slots.start} + x + ${slots.second} = ${slots.end}, where x is the unknown first addition.`,
        `Undoing the additions in reverse order means subtracting ${slots.second} first: ${slots.end} - ${slots.second} = ${slots.end - slots.second}.`,
        `Subtracting the starting amount as well gives ${slots.end - slots.second} - ${slots.start} = ${solution.added}.`,
        `Checking forward, ${slots.start} + ${solution.added} + ${slots.second} = ${slots.end}, so the unknown term is ${solution.added}.`
      ];
    }
  },
  {
    template: 'Two Successive Transfers',
    type: 'two-successive-transfers',
    category: 'no-knowledge',
    parse(statement) {
      const startMatch = statement.match(/contain A=(\d+) and B=(\d+) tokens/);
      const firstMatch = statement.match(/First, (\d+) are moved from A to B/);
      const secondMatch = statement.match(/Then (\d+) are moved from B back to A/);
      if (startMatch === null || firstMatch === null || secondMatch === null) {
        throw new Error('the starting amounts or the two transfers are missing');
      }
      return {
        a: Number(startMatch[1]),
        b: Number(startMatch[2]),
        first: Number(firstMatch[1]),
        second: Number(secondMatch[1])
      };
    },
    solve(slots) {
      return {
        a: slots.a - slots.first + slots.second,
        b: slots.b + slots.first - slots.second
      };
    },
    render(solution) {
      return `A=${solution.a}, B=${solution.b}.`;
    },
    compute: [
      'const slots = $slots;',
      'const a = slots.a - slots.first + slots.second;',
      'const b = slots.b + slots.first - slots.second;',
      'return "A=" + a + ", B=" + b + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A transfer decreases the source and increases the destination by the same amount, so the first move changes A to ${slots.a} - ${slots.first} = ${slots.a - slots.first} and B to ${slots.b} + ${slots.first} = ${slots.b + slots.first}.`,
        `The second move reverses direction: it takes ${slots.second} from B and gives them back to A.`,
        `The final counts are A = ${slots.a - slots.first} + ${slots.second} = ${solution.a} and B = ${slots.b + slots.first} - ${slots.second} = ${solution.b}.`,
        `The two boxes still hold ${solution.a + solution.b} tokens together, the same total as at the start.`
      ];
    }
  },
  {
    template: 'The Balance with an Unknown Box',
    type: 'the-balance-with-an-unknown-box',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/box X and (\d+) additional cubes; on the right there are (\d+) cubes/);
      if (match === null) {
        throw new Error('the loose cubes or the right-hand amount are missing');
      }
      return { extra: Number(match[1]), right: Number(match[2]) };
    },
    solve(slots) {
      const value = slots.right - slots.extra;
      if (value < 0) {
        throw new Error('the right-hand side is smaller than the loose cubes alone');
      }
      return { value };
    },
    render(solution) {
      return String(solution.value);
    },
    compute: [
      'const slots = $slots;',
      'const value = slots.right - slots.extra;',
      'if (value < 0) {',
      '  throw new Error("the right-hand side is smaller than the loose cubes alone");',
      '}',
      'return String(value);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Equilibrium means the two pans weigh the same, so the unknown box plus ${slots.extra} cubes must equal ${slots.right} cubes.`,
        `Removing the ${slots.extra} loose cubes from both sides keeps the balance and leaves the box alone on the left.`,
        `The box therefore holds ${slots.right} - ${slots.extra} = ${solution.value} cubes, and ${solution.value} + ${slots.extra} = ${slots.right} restores the equilibrium as a check.`
      ];
    }
  },
  {
    template: 'Choose the Correct Instruction',
    type: 'choose-the-correct-instruction',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/starts at (\d+) and must reach exactly (\d+)/);
      if (match === null) {
        throw new Error('the starting number or the target are missing');
      }
      const candidates = [...statement.matchAll(/[“"]([^”"]+)[”"]/g)].map((quoted) =>
        quoted[1].replace(/[.,]+$/, '').trim()
      );
      if (candidates.length === 0) {
        throw new Error('the candidate instructions are missing');
      }
      return { start: Number(match[1]), target: Number(match[2]), candidates };
    },
    solve(slots) {
      const successes = [];
      for (const candidate of slots.candidates) {
        const step = candidate.match(/^(add|subtract) (\d+)$/i);
        if (step === null) {
          continue;
        }
        const amount = Number(step[2]);
        const result = step[1].toLowerCase() === 'add' ? slots.start + amount : slots.start - amount;
        if (result === slots.target) {
          successes.push({ verb: step[1].toLowerCase() === 'add' ? 'Add' : 'Subtract', amount });
        }
      }
      if (successes.length !== 1) {
        throw new Error(`${successes.length} candidate instructions reach the target`);
      }
      return successes[0];
    },
    render(solution) {
      return `“${solution.verb} ${solution.amount}.”`;
    },
    wires: [
      {
        name: 'success',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          'const successes = [];',
          'for (const candidate of slots.candidates) {',
          '  const step = candidate.match(/^(add|subtract) (\\d+)$/i);',
          '  if (step === null) {',
          '    continue;',
          '  }',
          '  const amount = Number(step[2]);',
          '  const result = step[1].toLowerCase() === "add" ? slots.start + amount : slots.start - amount;',
          '  if (result === slots.target) {',
          '    successes.push({ verb: step[1].toLowerCase() === "add" ? "Add" : "Subtract", amount });',
          '  }',
          '}',
          'if (successes.length !== 1) {',
          '  throw new Error(successes.length + " candidate instructions reach the target");',
          '}',
          'return successes[0];'
        ].join('\n')
      }
    ],
    compute: [
      'return "\\u201c" + $success.verb + " " + $success.amount + ".\\u201d";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The robot starts at ${slots.start} and must land exactly on ${slots.target} after one instruction, so the needed change is ${slots.target} - ${slots.start} = ${slots.target - slots.start}.`,
        `Testing each candidate in turn shows that only “${solution.verb.toLowerCase()} ${solution.amount}” produces the target value ${slots.target}.`,
        `The other candidates change the number away from ${slots.target}, so “${solution.verb} ${solution.amount}” is the unique instruction that succeeds.`
      ];
    }
  }
];
