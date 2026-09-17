/**
 * Families for chapter 34 of the mathematical seed book: resources, packing,
 * budgets, and optimization.
 *
 * This chapter titles every problem individually, so each of its 25 problems
 * forms a template of one variant. Each family still parses the quantities out
 * of the statement and recomputes the answer, so the circuit is an algorithm
 * rather than a constant. Every premise the solutions use (capacities, prices,
 * durations, subdivision rules, "may be rotated", "one cut increases the number
 * of pieces by one") is stated in the problem text, so the chapter needs no
 * external fact and every case is `no-knowledge`.
 *
 * This is part C of the chapter. The parts carry disjoint cases and each
 * one repeats the header, the chapter number, and the helpers its own cases
 * call, so every part imports and loads on its own.
 */

export const chapter = 34;

function requireMatch(statement, pattern, label) {
  const match = statement.match(pattern);
  if (match === null) {
    throw new Error(`${label} is missing from the statement`);
  }
  return match.slice(1);
}
function numbers(statement, pattern, label) {
  return requireMatch(statement, pattern, label).map(Number);
}
function plural(count, singular) {
  return `${count} ${count === 1 ? singular : `${singular}s`}`;
}
/** Build the `@answer jsEval` body; `$slots` carries the values parsed from the statement. */
function circuit(lines) {
  return ['const slots = $slots;', ...lines].join('\n');
}
export const cases = [
  {
    template: 'Safety reserve',
    type: 'safety-reserve',
    category: 'no-knowledge',
    parse(statement) {
      const [capacity, reserve] = numbers(
        statement,
        /capacity (\d+) L, but the safety rule requires at least (\d+) L/,
        'the capacity and the reserve'
      );
      return { capacity, reserve };
    },
    solve(slots) { return { maximum: slots.capacity - slots.reserve }; },
    render(solution) { return `${solution.maximum} L.`; },
    compute: circuit(['return (slots.capacity - slots.reserve) + " L.";']),
    explain(slots, solution) {
      return [
        `If x litres are put in, the empty space is ${slots.capacity} − x, and the rule requires it to stay at least ${slots.reserve} litres.`,
        `So ${slots.capacity} − x ≥ ${slots.reserve}, which rearranges to x ≤ ${solution.maximum}.`,
        `The largest amount satisfying the rule is therefore ${solution.maximum} L.`
      ];
    }
  },
  {
    template: 'Order with minimum lot sizes',
    type: 'order-with-minimum-lot-sizes',
    category: 'no-knowledge',
    parse(statement) {
      const [bagSize, need] = numbers(
        statement,
        /bags of (\d+)\. You need at least (\d+) screws/,
        'the bag size and the requirement'
      );
      return { bagSize, need };
    },
    solve(slots) {
      const bags = Math.ceil(slots.need / slots.bagSize);
      return { bags, surplus: bags * slots.bagSize - slots.need };
    },
    render(solution) { return `${solution.bags} bags; ${solution.surplus} extra screws.`; },
    compute: circuit([
      'const bought = Math.ceil(slots.need / slots.bagSize);',
      'return bought + " bags; " + (bought * slots.bagSize - slots.need) + " extra screws.";'
    ]),
    explain(slots, solution) {
      return [
        `Screws come only in whole bags of ${slots.bagSize}, so the order must be a multiple of ${slots.bagSize} at least ${slots.need}.`,
        `One bag short leaves ${slots.need} − ${(solution.bags - 1) * slots.bagSize} screws still missing, so ${solution.bags} bags are needed.`,
        `Those bags bring ${solution.bags * slots.bagSize} screws, leaving ${solution.surplus} extra.`
      ];
    }
  },
  {
    template: 'Plan with a deadline dependency',
    type: 'plan-with-a-deadline-dependency',
    category: 'no-knowledge',
    parse(statement) {
      const [bMinutes, aMinutes] = numbers(
        statement,
        /Task B takes (\d+) minutes and can begin only after task A, which takes (\d+) minutes/,
        'the task durations'
      );
      return { aMinutes, bMinutes };
    },
    solve(slots) { return { finish: slots.aMinutes + slots.bMinutes }; },
    render(solution) { return `Minute ${solution.finish}.`; },
    compute: circuit(['return "Minute " + (slots.aMinutes + slots.bMinutes) + ".";']),
    explain(slots, solution) {
      return [
        `Task A starts at minute 0 and runs for ${slots.aMinutes} minutes, so it occupies minutes 0 to ${slots.aMinutes}.`,
        `Task B cannot begin earlier than that, so it starts at minute ${slots.aMinutes} and adds its own ${slots.bMinutes} minutes.`,
        `It finishes at minute ${solution.finish}, with no break shortening the chain.`
      ];
    }
  },
  {
    template: 'Two independent tasks can run simultaneously',
    type: 'two-independent-tasks-can-run-simultaneously',
    category: 'no-knowledge',
    parse(statement) {
      const [aMinutes, bMinutes] = numbers(
        statement,
        /A takes (\d+) minutes on machine 1, B takes (\d+) minutes on machine 2/,
        'the task durations'
      );
      return { aMinutes, bMinutes };
    },
    solve(slots) { return { finish: Math.max(slots.aMinutes, slots.bMinutes) }; },
    render(solution) { return `After ${plural(solution.finish, 'minute')}.`; },
    compute: circuit([
      'const finish = Math.max(slots.aMinutes, slots.bMinutes);',
      'return "After " + finish + " minute" + (finish === 1 ? "" : "s") + ".";'
    ]),
    explain(slots, solution) {
      return [
        `The two tasks use different machines and are independent, so both start at time 0 and run at the same time.`,
        `Task A needs ${slots.aMinutes} minutes and task B needs ${slots.bMinutes} minutes, and both must be finished.`,
        `The later of the two finishes decides, so both are done after ${solution.finish} minutes.`
      ];
    }
  },
  {
    template: 'Choose by total cost, not unit price',
    type: 'choose-by-total-cost-not-unit-price',
    category: 'no-knowledge',
    parse(statement) {
      const [need, countA, costA, countB, costB] = numbers(
        statement,
        /need exactly (\d+) notebooks\. Package A has (\d+) notebooks for (\d+) lei; package B has (\d+) notebooks for (\d+) lei/,
        'the notebook requirement and the packages'
      );
      return { need, packageA: { count: countA, cost: costA }, packageB: { count: countB, cost: costB } };
    },
    solve(slots) {
      const options = [['A', slots.packageA], ['B', slots.packageB]]
        .filter(([, entry]) => slots.need % entry.count === 0)
        .map(([name, entry]) => ({
          name,
          packages: slots.need / entry.count,
          cost: (slots.need / entry.count) * entry.cost
        }));
      if (options.length === 0) { throw new Error('neither package type reaches the required count exactly'); }
      return options.reduce((best, option) => (option.cost < best.cost ? option : best));
    },
    render(solution) { return `Packages ${solution.name}, ${solution.cost} lei.`; },
    compute: circuit([
      'const options = [["A", slots.packageA], ["B", slots.packageB]]',
      '  .filter((entry) => slots.need % entry[1].count === 0)',
      '  .map((entry) => ({ name: entry[0], packages: slots.need / entry[1].count, cost: (slots.need / entry[1].count) * entry[1].cost }));',
      'if (options.length === 0) { throw new Error("neither package type reaches the required count exactly"); }',
      'let best = options[0];',
      'for (const option of options) { if (option.cost < best.cost) { best = option; } }',
      'return "Packages " + best.name + ", " + best.cost + " lei.";'
    ]),
    explain(slots, solution) {
      return [
        `Only whole packages can be bought and the total must be exactly ${slots.need} notebooks, so each package type needs a whole number of packages.`,
        `Package A reaches ${slots.need} with ${slots.need / slots.packageA.count} packages for ${(slots.need / slots.packageA.count) * slots.packageA.cost} lei, and package B needs ${slots.need / slots.packageB.count} packages for ${(slots.need / slots.packageB.count) * slots.packageB.cost} lei.`,
        `Comparing the totals rather than the unit prices shows packages ${solution.name} is cheaper.`
      ];
    }
  },
  {
    template: 'Choice with two objectives and priority',
    type: 'choice-with-two-objectives-and-priority',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(
        statement,
        /transport (\d+) boxes\. (\w+) costs (\d+) and takes (\d+) minutes; (\w+) costs (\d+) and takes (\d+) minutes\. Rule: duration must be at most (\d+) minutes/,
        'the plan data'
      );
      return {
        plans: [
          { name: match[1], cost: Number(match[2]), minutes: Number(match[3]) },
          { name: match[4], cost: Number(match[5]), minutes: Number(match[6]) }
        ],
        maxMinutes: Number(match[7])
      };
    },
    solve(slots) {
      const allowed = slots.plans.filter((plan) => plan.minutes <= slots.maxMinutes);
      if (allowed.length === 0) { throw new Error('no plan satisfies the duration rule'); }
      return allowed.reduce((best, plan) => (plan.cost < best.cost ? plan : best));
    },
    render(solution) { return `${solution.name}.`; },
    compute: circuit([
      'const allowed = slots.plans.filter((plan) => plan.minutes <= slots.maxMinutes);',
      'if (allowed.length === 0) { throw new Error("no plan satisfies the duration rule"); }',
      'let best = allowed[0];',
      'for (const plan of allowed) { if (plan.cost < best.cost) { best = plan; } }',
      'return best.name + ".";'
    ]),
    explain(slots, solution) {
      return [
        `The duration rule is a hard constraint: a plan whose duration exceeds ${slots.maxMinutes} minutes is not considered at all.`,
        `That removes the plan taking ${slots.plans.find((plan) => plan.minutes > slots.maxMinutes)?.minutes ?? 0} minutes, leaving ${solution.name} as the only allowed plan.`,
        `Among the allowed plans ${solution.name} has the lowest cost, so it is chosen.`
      ];
    }
  },
  {
    template: 'Plan robust to one missing unit',
    type: 'plan-robust-to-one-missing-unit',
    category: 'no-knowledge',
    parse(statement) {
      const [vehicles, capacity, people] = numbers(
        statement,
        /You have (\d+) vehicles with capacity (\d+) each and must transport (\d+) people/,
        'the fleet and the demand'
      );
      return { vehicles, capacity, people };
    },
    solve(slots) {
      const remaining = (slots.vehicles - 1) * slots.capacity;
      return { remaining, sufficient: remaining >= slots.people };
    },
    render(solution) { return solution.sufficient ? 'Yes.' : 'No.'; },
    compute: circuit(['return (slots.vehicles - 1) * slots.capacity >= slots.people ? "Yes." : "No.";']),
    explain(slots, solution) {
      return [
        `The plan must still work with one vehicle missing, so the usable capacity is (${slots.vehicles} − 1) × ${slots.capacity} = ${solution.remaining}.`,
        `The demand is ${slots.people} people, and ${solution.remaining} is at least that.`,
        `So the capacity is sufficient even in the degraded case, and the answer is yes.`
      ];
    }
  },
  {
    template: 'Optimization with equal groups',
    type: 'optimization-with-equal-groups',
    category: 'no-knowledge',
    parse(statement) {
      const [tokens, boxes] = numbers(
        statement,
        /(\d+) tokens must be divided among (\d+) boxes/,
        'the token and box counts'
      );
      return { tokens, boxes };
    },
    solve(slots) {
      if (slots.tokens % slots.boxes !== 0) { throw new Error('the tokens do not divide evenly among the boxes'); }
      return { perBox: slots.tokens / slots.boxes };
    },
    render(solution) { return `${solution.perBox} in each.`; },
    compute: circuit([
      'if (slots.tokens % slots.boxes !== 0) { throw new Error("the tokens do not divide evenly among the boxes"); }',
      'return (slots.tokens / slots.boxes) + " in each.";'
    ]),
    explain(slots, solution) {
      return [
        `Equal boxes mean one number x repeated ${slots.boxes} times, so ${slots.boxes}x = ${slots.tokens}.`,
        `Dividing gives x = ${solution.perBox}, which is a whole number and therefore usable in every box.`,
        `Any other whole number would not add back to ${slots.tokens}, so the equal-split solution is unique.`
      ];
    }
  }
];
