/**
 * Families for chapter 20 of the mathematical seed book: mixed contest models
 * with constraints, optimization, codes, and multistage computations.
 *
 * A family covers one printed template: an independent computation, the answer
 * text the source prints, the SOP Lang computation body the circuit executes,
 * and the explanation lines of the example. The constraints and the selection rules are
 * printed with each problem, so every case is `no-knowledge`.
 */

export const unit = 20;

export const cases = [
  {
    template: 'Scheduling Four Tasks',
    type: 'scheduling-four-tasks',
    category: 'no-knowledge',
    parse(statement) {
      const listMatch = statement.match(/Four tasks ([^.]+) must each be performed exactly once/);
      if (listMatch === null) {
        throw new Error('the task list is missing');
      }
      const tasks = listMatch[1]
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
      const constraints = [...statement.matchAll(/(T\d+) must come before (T\d+)/g)].map((match) => [match[1], match[2]]);
      if (tasks.length === 0 || constraints.length === 0) {
        throw new Error('the tasks or the ordering rules are missing');
      }
      return { tasks, constraints };
    },
    solve(slots) {
      const before = new Map(slots.tasks.map((task) => [task, new Set()]));
      for (const [first, second] of slots.constraints) {
        before.get(second).add(first);
      }
      let changed = true;
      while (changed) {
        changed = false;
        for (const task of slots.tasks) {
          for (const earlier of [...before.get(task)]) {
            for (const evenEarlier of before.get(earlier)) {
              if (!before.get(task).has(evenEarlier)) {
                before.get(task).add(evenEarlier);
                changed = true;
              }
            }
          }
        }
      }
      const order = [...slots.tasks].sort((left, right) => before.get(left).size - before.get(right).size);
      const ranks = new Set(order.map((task) => before.get(task).size));
      if (ranks.size !== order.length) {
        throw new Error('the rules do not determine a single order');
      }
      return { order };
    },
    render(solution) {
      return `${solution.order.join(', ')}.`;
    },
    wires: [
      {
        name: 'order',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          'const tasks = slots.tasks;',
          'const before = new Map(tasks.map((task) => [task, new Set()]));',
          'for (const [first, second] of slots.constraints) {',
          '  before.get(second).add(first);',
          '}',
          'let changed = true;',
          'while (changed) {',
          '  changed = false;',
          '  for (const task of tasks) {',
          '    for (const earlier of [...before.get(task)]) {',
          '      for (const evenEarlier of before.get(earlier)) {',
          '        if (!before.get(task).has(evenEarlier)) {',
          '          before.get(task).add(evenEarlier);',
          '          changed = true;',
          '        }',
          '      }',
          '    }',
          '  }',
          '}',
          'const order = [...tasks].sort((left, right) => before.get(left).size - before.get(right).size);',
          'const ranks = new Set(order.map((task) => before.get(task).size));',
          'if (ranks.size !== order.length) {',
          '  throw new Error("the rules do not determine a single order");',
          '}',
          'return order;'
        ].join('\n')
      }
    ],
    compute: [
      'return $order.join(", ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each rule is an inequality of positions: ${slots.constraints.map(([first, second]) => `${first} < ${second}`).join(', ')}.`,
        'Taking the transitive closure gives every task the set of tasks that must precede it.',
        `Sorting the tasks by how many predecessors they have yields the order ${solution.order.join(', ')}.`,
        'The predecessor counts are all different, so exactly one order satisfies the rules without extra freedom.'
      ];
    }
  },
  {
    template: 'Three-Digit Code and Positional Clues',
    type: 'three-digit-code-and-positional-clues',
    category: 'no-knowledge',
    parse(statement) {
      const digitsMatch = statement.match(/uses exactly the digits ([\d, ]+)/);
      const firstMatch = statement.match(/digit (\d) is first/);
      const orderMatch = statement.match(/digit (\d) comes after digit (\d)/);
      if (digitsMatch === null || firstMatch === null || orderMatch === null) {
        throw new Error('the digits or the positional clues are missing');
      }
      const digits = digitsMatch[1]
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
        .map((value) => Number(value));
      return { digits, first: Number(firstMatch[1]), earlier: Number(orderMatch[2]), later: Number(orderMatch[1]) };
    },
    solve(slots) {
      const digits = slots.digits.map(String);
      const permutations = [];
      const build = (prefix, rest) => {
        if (rest.length === 0) {
          permutations.push(prefix);
          return;
        }
        for (let index = 0; index < rest.length; index += 1) {
          build(prefix + rest[index], rest.slice(0, index).concat(rest.slice(index + 1)));
        }
      };
      build('', digits);
      const first = String(slots.first);
      const earlier = String(slots.earlier);
      const later = String(slots.later);
      const matching = permutations.filter(
        (code) => code[0] === first && code.indexOf(earlier) < code.indexOf(later)
      );
      if (matching.length !== 1) {
        throw new Error(`the clues leave ${matching.length} codes instead of one`);
      }
      return { code: matching[0] };
    },
    render(solution) {
      return solution.code;
    },
    wires: [
      {
        name: 'permutations',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          'const digits = slots.digits.map(String);',
          'const permutations = [];',
          'const build = (prefix, rest) => {',
          '  if (rest.length === 0) {',
          '    permutations.push(prefix);',
          '    return;',
          '  }',
          '  for (let index = 0; index < rest.length; index += 1) {',
          '    build(prefix + rest[index], rest.slice(0, index).concat(rest.slice(index + 1)));',
          '  }',
          '};',
          'build("", digits);',
          'return permutations;'
        ].join('\n')
      }
    ],
    compute: [
      'const first = String($slots.first);',
      'const earlier = String($slots.earlier);',
      'const later = String($slots.later);',
      'const matching = $permutations.filter((code) => code[0] === first && code.indexOf(earlier) < code.indexOf(later));',
      'if (matching.length !== 1) {',
      '  throw new Error("the clues leave " + matching.length + " codes instead of one");',
      '}',
      'return matching[0];'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The code uses each of the digits ${slots.digits.join(', ')} exactly once, so the candidates are all permutations of those three digits.`,
        `Fixing digit ${slots.first} in the first position removes all permutations that do not start with it.`,
        `The remaining clue says that digit ${slots.earlier} stands before digit ${slots.later}, which keeps only ${solution.code}.`,
        'With three distinct digits a single ordering clue decides between the two remaining candidates, so the code is unique.'
      ];
    }
  },
  {
    template: 'Allocation with Minimum Limits',
    type: 'allocation-with-minimum-limits',
    category: 'no-knowledge',
    parse(statement) {
      const total = statement.match(/There are (\d+) resources/);
      const minimums = statement.match(/A must receive at least (\d+), B at least (\d+)/);
      if (total === null || minimums === null) {
        throw new Error('the total or the minimum limits are missing');
      }
      return { total: Number(total[1]), minimumA: Number(minimums[1]), minimumB: Number(minimums[2]) };
    },
    solve(slots) {
      const remaining = slots.total - slots.minimumA - slots.minimumB;
      if (remaining < 0) {
        throw new Error('the minimum limits exceed the available resources');
      }
      return { remaining };
    },
    render(solution) {
      return String(solution.remaining);
    },
    compute: [
      'const slots = $slots;',
      'const remaining = slots.total - slots.minimumA - slots.minimumB;',
      'if (remaining < 0) {',
      '  throw new Error("the minimum limits exceed the available resources");',
      '}',
      'return String(remaining);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `All ${slots.total} resources are split between A, B, and C, so C receives whatever A and B leave.`,
        `Every extra resource given to A or B above its minimum takes one resource away from C, so C is largest when A and B sit exactly at their limits.`,
        `Giving A ${slots.minimumA} and B ${slots.minimumB} leaves ${slots.total} − ${slots.minimumA} − ${slots.minimumB} = ${solution.remaining} for C.`,
        `Any other allocation with A ≥ ${slots.minimumA} and B ≥ ${slots.minimumB} leaves strictly less for C, so ${solution.remaining} is the greatest possible value.`
      ];
    }
  },
  {
    template: 'Choice by Two Criteria',
    type: 'choice-by-two-criteria',
    category: 'no-knowledge',
    parse(statement) {
      const plans = [...statement.matchAll(/(P\d+)=\((\d+), (\d+)\)/g)].map((match) => ({
        name: match[1],
        time: Number(match[2]),
        cost: Number(match[3])
      }));
      if (plans.length < 2) {
        throw new Error('the plan list is missing or too short');
      }
      return { plans };
    },
    solve(slots) {
      const ranked = [...slots.plans].sort((left, right) => left.time - right.time || left.cost - right.cost);
      const best = ranked[0];
      const runnerUp = ranked[1];
      if (best.time === runnerUp.time && best.cost === runnerUp.cost) {
        throw new Error('the two criteria do not separate the top two plans');
      }
      return { name: best.name, time: best.time, cost: best.cost };
    },
    render(solution) {
      return `${solution.name}.`;
    },
    compute: [
      'const slots = $slots;',
      'const ranked = [...slots.plans].sort((left, right) => left.time - right.time || left.cost - right.cost);',
      'const best = ranked[0];',
      'const runnerUp = ranked[1];',
      'if (best.time === runnerUp.time && best.cost === runnerUp.cost) {',
      '  throw new Error("the two criteria do not separate the top two plans");',
      '}',
      'return ranked[0].name + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The selection rule is lexicographic: time is compared first, and cost is consulted only when two plans have the same time.',
        `Among the plans the smallest time is ${solution.time}, which already rules out every plan with a larger time.`,
        `The surviving plan with time ${solution.time} also has the smaller cost whenever the time was tied, so ${solution.name} is selected.`,
        'No other plan can beat it, because beating it would require a smaller time or an equal time with a smaller cost.'
      ];
    }
  },
  {
    template: 'Mixed Three-Stage Model',
    type: 'mixed-three-stage-model',
    category: 'no-knowledge',
    parse(statement) {
      const boxes = statement.match(/There are (\d+) boxes with (\d+) pieces each/);
      const removed = statement.match(/From the total, (\d+)\/(\d+) is removed/);
      const added = statement.match(/(\d+) new pieces are added/);
      if (boxes === null || removed === null || added === null) {
        throw new Error('the boxes, the removed fraction, or the added pieces are missing');
      }
      return {
        boxes: Number(boxes[1]),
        perBox: Number(boxes[2]),
        numerator: Number(removed[1]),
        denominator: Number(removed[2]),
        added: Number(added[1])
      };
    },
    solve(slots) {
      const total = slots.boxes * slots.perBox;
      if (total % slots.denominator !== 0) {
        throw new Error('the total does not split into the given number of equal parts');
      }
      const removed = (total / slots.denominator) * slots.numerator;
      return { total, removed, afterRemoval: total - removed, end: total - removed + slots.added };
    },
    render(solution) {
      return String(solution.end);
    },
    compute: [
      'const slots = $slots;',
      'const total = slots.boxes * slots.perBox;',
      'if (total % slots.denominator !== 0) {',
      '  throw new Error("the total does not split into the given number of equal parts");',
      '}',
      'const part = total / slots.denominator;',
      'const removed = part * slots.numerator;',
      'return String(Math.round(total - removed + slots.added));'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The starting amount is ${slots.boxes} boxes × ${slots.perBox} pieces = ${solution.total} pieces.`,
        `The removed fraction ${slots.numerator}/${slots.denominator} is read as dividing the total into ${slots.denominator} equal parts and taking ${slots.numerator}, so ${solution.total} ÷ ${slots.denominator} × ${slots.numerator} = ${solution.removed} pieces are removed.`,
        `After the removal ${solution.total} − ${solution.removed} = ${solution.afterRemoval} pieces remain, and then ${slots.added} pieces are added back.`,
        `The final amount is ${solution.afterRemoval} + ${slots.added} = ${solution.end} pieces.`
      ];
    }
  }
];
