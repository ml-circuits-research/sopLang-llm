/**
 * Families for chapter 19 of the mathematical seed book: invariants, games, and
 * reversible algorithms.
 *
 * A family covers one printed template: an independent computation, the answer
 * text the source prints, the SOP Lang computation body the circuit executes,
 * and the explanation lines of the example. Each problem states the definitions and the
 * allowed moves it depends on, so every case is `no-knowledge`.
 */

export const unit = 19;

export const cases = [
  {
    template: 'The “Even/Odd” Invariant',
    type: 'the-even-odd-invariant',
    category: 'no-knowledge',
    parse(statement) {
      const start = statement.match(/We start at (\d+), which is (even|odd)/);
      const step = statement.match(/add (\d+)/);
      const target = statement.match(/reach exactly (\d+)/);
      if (start === null || step === null || target === null) {
        throw new Error('the start, the allowed move, or the target is missing');
      }
      return { start: Number(start[1]), step: Number(step[1]), target: Number(target[1]) };
    },
    solve(slots) {
      const difference = slots.target - slots.start;
      const reachable = difference >= 0 && difference % slots.step === 0;
      return { reachable, difference, target: slots.target };
    },
    render(solution) {
      return solution.reachable
        ? `Yes, ${solution.target} is reachable.`
        : `No, ${solution.target} is impossible to reach.`;
    },
    compute: [
      'const slots = $slots;',
      'const difference = slots.target - slots.start;',
      'const reachable = difference >= 0 && difference % slots.step === 0;',
      'if (reachable) {',
      '  return "Yes, " + slots.target + " is reachable.";',
      '}',
      'return "No, " + slots.target + " is impossible to reach.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The only allowed move adds ${slots.step} to the current value, so every reachable value has the form ${slots.start} + k×${slots.step} for some whole number of moves k.`,
        `That means the difference between any reachable value and the start is a positive multiple of ${slots.step}, and it can never be negative.`,
        `The difference to ${slots.target} is ${solution.target} − ${slots.start} = ${solution.difference}, which is not a multiple of ${slots.step}.`,
        'So the move preserves the parity of the starting value and the target is impossible to reach; the invariant, not a search, settles the answer.'
      ];
    }
  },
  {
    template: 'Conserved Total in a Transfer Game',
    type: 'conserved-total-in-a-transfer-game',
    category: 'no-knowledge',
    parse(statement) {
      const start = statement.match(/start with A=(\d+), B=(\d+)/);
      const proposed = statement.match(/proposed state is A=(\d+), B=(\d+)/);
      if (start === null || proposed === null) {
        throw new Error('the starting or the proposed box contents are missing');
      }
      return {
        start: { a: Number(start[1]), b: Number(start[2]) },
        proposed: { a: Number(proposed[1]), b: Number(proposed[2]) }
      };
    },
    solve(slots) {
      const kept = slots.start.a + slots.start.b;
      const offered = slots.proposed.a + slots.proposed.b;
      return { kept, offered, possible: kept === offered };
    },
    render(solution) {
      return solution.possible ? 'Possible from the standpoint of the total.' : 'Impossible.';
    },
    compute: [
      'const slots = $slots;',
      'const kept = slots.start.a + slots.start.b;',
      'const offered = slots.proposed.a + slots.proposed.b;',
      'if (kept === offered) {',
      '  return "Possible from the standpoint of the total.";',
      '}',
      'return "Impossible.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A transfer move removes tokens from one box and puts exactly the same number into the other box, so nothing is created and nothing disappears.',
        `The total is an invariant of the game: the boxes start with ${slots.start.a} + ${slots.start.b} = ${solution.kept} tokens.`,
        `The proposed state holds ${slots.proposed.a} + ${slots.proposed.b} = ${solution.offered} tokens.`,
        solution.possible
          ? 'The two totals agree, so the proposed distribution is not excluded by the conservation law.'
          : 'The two totals differ, so the proposed distribution cannot be reached by any sequence of transfers.'
      ];
    }
  },
  {
    // The source prints these five answers as a Romanian polarity token
    // (`Da.`/`Nu.`); the source registration declares the English
    // equivalents and the family renders them, so the shipped answer is
    // `Yes.`/`No.` and the token never enters a generated artifact.
    template: 'Remainder upon Division by 3 as an Invariant',
    type: 'remainder-upon-division-by-3-as-an-invariant',
    category: 'no-knowledge',
    parse(statement) {
      const start = statement.match(/We start at (\d+) and may add only (\d+)/);
      const target = statement.match(/reach (\d+)\?/);
      if (start === null || target === null) {
        throw new Error('the start, the allowed move, or the target is missing');
      }
      return { start: Number(start[1]), step: Number(start[2]), target: Number(target[1]) };
    },
    solve(slots) {
      return {
        startRemainder: slots.start % slots.step,
        targetRemainder: slots.target % slots.step,
        forward: slots.target - slots.start
      };
    },
    render(solution) {
      const reachable = solution.forward >= 0 && solution.startRemainder === solution.targetRemainder;
      return reachable ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'const forward = slots.target - slots.start;',
      'const reachable = forward >= 0 && slots.start % slots.step === slots.target % slots.step;',
      'return reachable ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Adding a complete group of ${slots.step} does not change the remainder upon division by ${slots.step}, so that remainder is an invariant of every reachable value.`,
        `${slots.start} leaves remainder ${solution.startRemainder} and ${slots.target} leaves remainder ${solution.targetRemainder}.`,
        solution.startRemainder === solution.targetRemainder
          ? `The remainders agree, and the target is ahead of the start, so it is reachable: ${solution.forward} ÷ ${slots.step} whole groups are added.`
          : 'The remainders differ, so no number of added groups can turn the start into the target.'
      ];
    }
  },
  {
    template: 'Recovering the Input of an Algorithm',
    type: 'recovering-the-input-of-an-algorithm',
    category: 'no-knowledge',
    parse(statement) {
      const add = statement.match(/add (\d+);/);
      const multiply = statement.match(/multiply the result by (\d+)/);
      const output = statement.match(/output is (\d+)/);
      if (add === null || multiply === null || output === null) {
        throw new Error('the addition, the multiplier, or the output is missing');
      }
      return { add: Number(add[1]), multiply: Number(multiply[1]), output: Number(output[1]) };
    },
    solve(slots) {
      if (slots.output % slots.multiply !== 0) {
        throw new Error('the output is not an exact multiple of the multiplier');
      }
      return { input: slots.output / slots.multiply - slots.add };
    },
    render(solution) {
      return String(solution.input);
    },
    compute: [
      'const slots = $slots;',
      'if (slots.output % slots.multiply !== 0) {',
      '  throw new Error("the output is not an exact multiple of the multiplier");',
      '}',
      'const input = slots.output / slots.multiply - slots.add;',
      'return String(input);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The algorithm turns the input x into y = (x + ${slots.add}) × ${slots.multiply}, given as y = ${slots.output}.`,
        `Reversing undoes the last operation first: dividing the output by ${slots.multiply} gives ${slots.output} ÷ ${slots.multiply} = ${slots.output / slots.multiply}.`,
        `Then the earlier addition is undone by subtracting ${slots.add}, so the input is ${solution.input}.`,
        `Checking forward, (${solution.input} + ${slots.add}) × ${slots.multiply} = ${slots.output}, which confirms the recovered input.`
      ];
    }
  },
  {
    template: 'Shortest Path in a State Space',
    type: 'shortest-path-in-a-state-space',
    category: 'no-knowledge',
    parse(statement) {
      const start = statement.match(/starts at (\d+)/);
      const moves = statement.match(/add either (\d+) or (\d+)/);
      const target = statement.match(/reach exactly (\d+)/);
      if (start === null || moves === null || target === null) {
        throw new Error('the start, the allowed increases, or the target is missing');
      }
      return { start: Number(start[1]), moves: [Number(moves[1]), Number(moves[2])], target: Number(target[1]) };
    },
    solve(slots) {
      const small = Math.min(...slots.moves);
      const big = Math.max(...slots.moves);
      const increase = slots.target - slots.start;
      if (increase < 0) {
        throw new Error('the target is below the start');
      }
      const span = big - small;
      for (let count = 1; count <= increase; count += 1) {
        const rest = increase - count * small;
        if (rest < 0 || rest % span !== 0) {
          continue;
        }
        const bigCount = rest / span;
        if (bigCount < 0 || bigCount > count) {
          continue;
        }
        const smallCount = count - bigCount;
        const steps = [];
        for (let index = 0; index < smallCount; index += 1) {
          steps.push(small);
        }
        for (let index = 0; index < bigCount; index += 1) {
          steps.push(big);
        }
        return { moves: count, steps };
      }
      throw new Error('the target cannot be reached with the allowed increases');
    },
    render(solution) {
      return `${solution.moves} moves; one example of steps: [${solution.steps.join(', ')}].`;
    },
    wires: [
      {
        name: 'path',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          'const small = Math.min(...slots.moves);',
          'const big = Math.max(...slots.moves);',
          'const increase = slots.target - slots.start;',
          'if (increase < 0) {',
          '  throw new Error("the target is below the start");',
          '}',
          'const span = big - small;',
          'let found = null;',
          'for (let count = 1; count <= increase; count += 1) {',
          '  const rest = increase - count * small;',
          '  if (rest < 0 || rest % span !== 0) {',
          '    continue;',
          '  }',
          '  const bigCount = rest / span;',
          '  if (bigCount < 0 || bigCount > count) {',
          '    continue;',
          '  }',
          '  const steps = [];',
          '  for (let index = 0; index < count - bigCount; index += 1) {',
          '    steps.push(small);',
          '  }',
          '  for (let index = 0; index < bigCount; index += 1) {',
          '    steps.push(big);',
          '  }',
          '  found = { moves: count, steps };',
          '  break;',
          '}',
          'if (found === null) {',
          '  throw new Error("the target cannot be reached with the allowed increases");',
          '}',
          'return found;'
        ].join('\n')
      }
    ],
    compute: [
      'return $path.moves + " moves; one example of steps: [" + $path.steps.join(", ") + "].";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each move adds either ${slots.moves[0]} or ${slots.moves[1]}, and the token must grow from ${slots.start} to ${slots.target}, so the total increase is ${slots.target} − ${slots.start} = ${slots.target - slots.start}.`,
        `For a fixed number of moves m with k of the larger moves, the total increase is m×${Math.min(...slots.moves)} + k×${Math.max(...slots.moves) - Math.min(...slots.moves)}, which pins k down as soon as m is fixed.`,
        `The search takes the smallest m for which that equation has a whole solution with 0 ≤ k ≤ m, which gives ${solution.moves} moves.`,
        `One sequence achieving it is [${solution.steps.join(', ')}], and no sequence with fewer moves can reach the same total because the equation has no such solution.`
      ];
    }
  }
];
