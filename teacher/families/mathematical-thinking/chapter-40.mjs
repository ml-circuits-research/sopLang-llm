/**
 * Part A of chapter 40: strategy, winning positions, and mixed systems.
 * The part repeats the chapter number and shared helpers to import on its own;
 * the loader concatenates the parts of the chapter in file order.
 */

export const unit = 40;
const NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5 };
const INFO_GAME = { A: { X: 10, Y: 0 }, B: { X: 0, Y: 10 } };
const PLAN_TABLE = { A: { cost: 4, time: 6 }, B: { cost: 6, time: 3 } };
function countWord(text) {
  const word = String(text).toLowerCase();
  return NUMBER_WORDS[word] ?? Number(word);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function coefficient(formula, term) {
  const match = formula.match(new RegExp(`(\\d*)×?${term}`));
  if (match === null) {
    throw new Error(`the score formula does not contain the term "${term}"`);
  }
  return match[1] === '' ? 1 : Number(match[1]);
}

const READ_FACTS = [
  'const slots = $slots;',
  'const facts = typeof $facts === "string" ? JSON.parse($facts) : $facts;'
].join('\n');

export const cases = [
  {
    template: 'Supply chain with a minimum-capacity bottleneck',
    type: 'supply-chain-with-a-minimum-capacity-bottleneck',
    category: 'no-knowledge',
    parse(statement) {
      const stages = [...statement.matchAll(/([A-Z])=(\d+)/g)].map((match) => ({
        name: match[1],
        capacity: Number(match[2])
      }));
      if (stages.length === 0) {
        throw new Error('cannot read the stage capacities');
      }
      return { stages };
    },
    solve(slots) {
      const bottleneck = slots.stages.reduce(
        (lowest, stage) => (stage.capacity < lowest.capacity ? stage : lowest)
      );
      return { throughput: bottleneck.capacity, bottleneck: bottleneck.name };
    },
    render(solution) {
      return `${solution.throughput} objects/hour.`;
    },
    compute: [
      'const slots = $slots;',
      'const bottleneck = slots.stages.reduce((lowest, stage) => (stage.capacity < lowest.capacity ? stage : lowest));',
      'return bottleneck.capacity + " objects/hour.";'
    ].join('\n'),
    explain(slots) {
      const listed = slots.stages.map((stage) => `${stage.name}=${stage.capacity}`).join(', ');
      return [
        `Every object must pass through all stages (${listed}), so no stage can be bypassed.`,
        'The stable throughput of such a line is set by the slowest stage, because a faster stage only builds up waiting work.',
        'The smallest capacity is the bottleneck, and that value is the maximum stable number of objects per hour the system can produce.'
      ];
    }
  },
  {
    template: 'Majority does not help if two sensors may be wrong',
    type: 'majority-does-not-help-if-two-sensors-may-be-wrong',
    category: 'no-knowledge',
    parse(statement) {
      const answersMatch = statement.match(/the same situation ([a-z]+(?:, [a-z]+)*)/);
      const faultyMatch = statement.match(/up to (\w+) sensors may be wrong/);
      const valueMatch = statement.match(/Is .?([a-z]+).? still guaranteed/);
      if (answersMatch === null || faultyMatch === null || valueMatch === null) {
        throw new Error('cannot read the answers, the fault bound, or the claimed value');
      }
      return {
        answers: answersMatch[1].split(', ').map((answer) => answer.trim()),
        faulty: countWord(faultyMatch[1]),
        value: valueMatch[1]
      };
    },
    solve(slots) {
      const counts = new Map();
      for (const answer of slots.answers) {
        counts.set(answer, (counts.get(answer) ?? 0) + 1);
      }
      const ordered = [...counts.entries()].sort((left, right) => right[1] - left[1]);
      if (ordered[0][0] !== slots.value) {
        throw new Error('the claimed value is not the majority answer');
      }
      return { value: slots.value, guaranteed: slots.faulty * 2 < slots.answers.length };
    },
    render(solution) {
      return solution.guaranteed ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'const counts = new Map();',
      'for (const answer of slots.answers) { counts.set(answer, (counts.get(answer) || 0) + 1); }',
      'const ordered = Array.from(counts.entries()).sort((left, right) => right[1] - left[1]);',
      'if (ordered[0][0] !== slots.value) { throw new Error("the claimed value is not the majority answer"); }',
      'return slots.faulty * 2 < slots.answers.length ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The majority answer is still ${slots.value}, but now up to ${slots.faulty} sensors may be wrong.`,
        `The two sensors that agree could be exactly the ${slots.faulty} faulty ones, and the single dissenting sensor could be the only correct one.`,
        `With that fault bound the majority value is not guaranteed, so the answer is no.`
      ];
    }
  },
  {
    template: 'Inventory with a reorder threshold',
    type: 'inventory-with-a-reorder-threshold',
    category: 'no-knowledge',
    parse(statement) {
      const thresholdMatch = statement.match(/falls below (\d+) units/);
      const inventoryMatch = statement.match(/Inventory is (\d+)/);
      const soldMatch = statement.match(/(\d+) units are sold/);
      if (thresholdMatch === null || inventoryMatch === null || soldMatch === null) {
        throw new Error('cannot read the threshold, the inventory, or the sales');
      }
      return {
        threshold: Number(thresholdMatch[1]),
        inventory: Number(inventoryMatch[1]),
        sold: Number(soldMatch[1])
      };
    },
    solve(slots) {
      const stock = slots.inventory - slots.sold;
      return { stock, order: stock < slots.threshold };
    },
    render(solution) {
      return solution.order ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'const stock = slots.inventory - slots.sold;',
      'return stock < slots.threshold ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The policy places an order when the inventory falls below ${slots.threshold} units.`,
        `After ${slots.sold} units are sold the inventory is ${slots.inventory} - ${slots.sold} = ${solution.stock}.`,
        `Because ${solution.stock} is below ${slots.threshold}, an order should be placed.`
      ];
    }
  },
  {
    template: 'Ecological plan with a renewable resource',
    type: 'ecological-plan-with-a-renewable-resource',
    category: 'no-knowledge',
    parse(statement) {
      const stockMatch = statement.match(/has (\d+) units/);
      const replenishMatch = statement.match(/Each day (\d+) units are replenished/);
      const useMatch = statement.match(/we use (\d+)/);
      const daysMatch = statement.match(/after (\d+) days/);
      if (stockMatch === null || replenishMatch === null || useMatch === null || daysMatch === null) {
        throw new Error('cannot read the resource plan');
      }
      return {
        stock: Number(stockMatch[1]),
        replenish: Number(replenishMatch[1]),
        use: Number(useMatch[1]),
        days: Number(daysMatch[1])
      };
    },
    solve(slots) {
      let stock = slots.stock;
      for (let day = 0; day < slots.days; day += 1) {
        stock += slots.replenish;
        if (stock < slots.use) {
          throw new Error('the plan runs into a temporary shortage');
        }
        stock -= slots.use;
      }
      return { stock, net: slots.replenish - slots.use };
    },
    render(solution) {
      return `${solution.stock} units.`;
    },
    compute: [
      'const slots = $slots;',
      'let stock = slots.stock;',
      'for (let day = 0; day < slots.days; day += 1) {',
      '  stock += slots.replenish;',
      '  if (stock < slots.use) { throw new Error("the plan runs into a temporary shortage"); }',
      '  stock -= slots.use;',
      '}',
      'return stock + " units.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each day replenishment happens first, so the stock changes by ${slots.replenish} - ${slots.use} = ${solution.net} units per day.`,
        `Starting from ${slots.stock} and applying a net change of ${solution.net} for ${slots.days} days never causes a shortage.`,
        `After ${slots.days} days the reservoir holds ${solution.stock} units.`
      ];
    }
  },
  {
    template: 'The 1-or-2 game: a small winning position',
    type: 'the-1-or-2-game-a-small-winning-position',
    category: 'no-knowledge',
    parse(statement) {
      const tokensMatch = statement.match(/There are (\d+) tokens/);
      const movesMatch = statement.match(/removing (\d+) or (\d+)/);
      if (tokensMatch === null || movesMatch === null) {
        throw new Error('cannot read the token count or the allowed removals');
      }
      return {
        tokens: Number(tokensMatch[1]),
        moves: [Number(movesMatch[1]), Number(movesMatch[2])]
      };
    },
    solve(slots) {
      const winning = slots.moves.filter((move) => (slots.tokens - move) % 3 === 0);
      if (winning.length !== 1) {
        throw new Error('the statement does not describe a single winning move');
      }
      return { move: winning[0] };
    },
    render(solution) {
      return `Take ${solution.move} token${solution.move === 1 ? '' : 's'}.`;
    },
    compute: [
      'const slots = $slots;',
      'const winning = slots.moves.filter((move) => (slots.tokens - move) % 3 === 0);',
      'if (winning.length !== 1) { throw new Error("the statement does not describe a single winning move"); }',
      'const move = winning[0];',
      'return "Take " + move + " token" + (move === 1 ? "" : "s") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'With removals of 1 or 2, the losing positions for the player to move are the multiples of 3, because every pair of replies can be forced to total 3.',
        `Taking ${solution.move} from ${slots.tokens} leaves ${slots.tokens - solution.move}, which is a multiple of 3.`,
        'Whatever the opponent takes, the complementary amount restores a multiple of 3, so the same reply keeps working until the opponent takes the last token from a losing position.',
        `So the forced winning move is to take ${solution.move}.`
      ];
    }
  },
  {
    template: 'Same problem, different score function',
    type: 'same-problem-different-score-function',
    category: 'knowledge',
    parse(statement) {
      if (!/same plans/.test(statement)) {
        throw new Error('the statement does not refer to the previous plans');
      }
      const formulaMatch = statement.match(/score=(\d*)×?cost\+(\d*)×?time/);
      if (formulaMatch === null) {
        throw new Error('cannot read the score formula');
      }
      return {
        costWeight: coefficient(formulaMatch[0], 'cost'),
        timeWeight: coefficient(formulaMatch[0], 'time')
      };
    },
    solve(slots) {
      const scored = Object.keys(PLAN_TABLE).map((name) => ({
        name,
        score: slots.costWeight * PLAN_TABLE[name].cost + slots.timeWeight * PLAN_TABLE[name].time
      }));
      const ordered = [...scored].sort((left, right) => left.score - right.score);
      if (ordered.length < 2 || ordered[0].score === ordered[1].score) {
        throw new Error('the scores do not single out one plan');
      }
      return { best: ordered[0].name, scores: scored };
    },
    render(solution) {
      return `Plan ${solution.best}.`;
    },
    facts: JSON.stringify(PLAN_TABLE),
    compute: [
      READ_FACTS,
      'const names = Object.keys(facts);',
      'const scored = names.map((name) => ({ name: name, score: slots.costWeight * facts[name].cost + slots.timeWeight * facts[name].time }));',
      'scored.sort((left, right) => left.score - right.score);',
      'if (scored.length < 2 || scored[0].score === scored[1].score) { throw new Error("the scores do not single out one plan"); }',
      'return "Plan " + scored[0].name + ".";'
    ].join('\n'),
    explain(slots, solution) {
      const lines = solution.scores.map((entry) => `${entry.name} scores ${entry.score}`);
      return [
        'The plans are the ones from the previous problem, carried as an explicit fact: A costs 4 and takes 6, and B costs 6 and takes 3.',
        `Weighting the cost twice and the time once gives ${lines.join(' and ')}.`,
        `The score of ${solution.best} is lower, so plan ${solution.best} is chosen.`
      ];
    }
  },
  {
    template: 'Game with an exact target',
    type: 'game-with-an-exact-target',
    category: 'no-knowledge',
    parse(statement) {
      const targetMatch = statement.match(/reaches exactly (\d+)/);
      const currentMatch = statement.match(/You are at (\d+)/);
      const movesMatch = statement.match(/adding (\d+) or (\d+)/);
      if (targetMatch === null || currentMatch === null || movesMatch === null) {
        throw new Error('cannot read the current value, the target, or the increments');
      }
      return {
        target: Number(targetMatch[1]),
        current: Number(currentMatch[1]),
        moves: [Number(movesMatch[1]), Number(movesMatch[2])]
      };
    },
    solve(slots) {
      const delta = slots.target - slots.current;
      if (!slots.moves.includes(delta)) {
        throw new Error('there is no immediate winning move');
      }
      return { delta };
    },
    render(solution) {
      return `Yes: add ${solution.delta}.`;
    },
    compute: [
      'const slots = $slots;',
      'const delta = slots.target - slots.current;',
      'if (!slots.moves.includes(delta)) { throw new Error("there is no immediate winning move"); }',
      'return "Yes: add " + delta + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The game starts at 0 and the winner is the player who reaches exactly ${slots.target}, so a position of ${slots.current} is winning when the remaining distance is an allowed increment.`,
        `The remaining distance is ${slots.target} - ${slots.current} = ${solution.delta}, and ${solution.delta} is one of the allowed adds (${slots.moves.join(' or ')}).`,
        `The immediate winning move is therefore to add ${solution.delta} and reach ${slots.target} exactly.`
      ];
    }
  },
  {
    template: 'Scheduling with an optional task',
    type: 'scheduling-with-an-optional-task',
    category: 'no-knowledge',
    parse(statement) {
      const budgetMatch = statement.match(/You have (\d+) minutes/);
      if (budgetMatch === null) {
        throw new Error('cannot read the time budget');
      }
      const tasks = [];
      for (const match of statement.matchAll(/(?:Task )?([A-Z]) takes (\d+) and is worth (\d+)/g)) {
        tasks.push({ name: match[1], time: Number(match[2]), value: Number(match[3]) });
      }
      if (tasks.length === 0) {
        throw new Error('cannot read the tasks');
      }
      return { budget: Number(budgetMatch[1]), tasks };
    },
    solve(slots) {
      let best = null;
      for (let mask = 0; mask < (1 << slots.tasks.length); mask += 1) {
        const chosen = slots.tasks.filter((task, index) => (mask & (1 << index)) !== 0);
        const time = chosen.reduce((sum, task) => sum + task.time, 0);
        const value = chosen.reduce((sum, task) => sum + task.value, 0);
        if (time > slots.budget) {
          continue;
        }
        if (best === null || value > best.value || (value === best.value && time < best.time)) {
          best = { names: chosen.map((task) => task.name), time, value };
        }
      }
      return best;
    },
    render(solution) {
      return `${solution.names.join('+')}, ${solution.value} points.`;
    },
    compute: [
      'const slots = $slots;',
      'let best = null;',
      'for (let mask = 0; mask < (1 << slots.tasks.length); mask += 1) {',
      '  const chosen = slots.tasks.filter((task, index) => (mask & (1 << index)) !== 0);',
      '  const time = chosen.reduce((sum, task) => sum + task.time, 0);',
      '  const value = chosen.reduce((sum, task) => sum + task.value, 0);',
      '  if (time > slots.budget) { continue; }',
      '  if (best === null || value > best.value || (value === best.value && time < best.time)) {',
      '    best = { names: chosen.map((task) => task.name), time: time, value: value };',
      '  }',
      '}',
      'return best.names.join("+") + ", " + best.value + " points.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Every subset of the tasks that fits in ${slots.budget} minutes is a legal schedule, because whole tasks are done at most once each.`,
        `The best subset is ${solution.names.join('+')}, which uses ${solution.time} of the ${slots.budget} minutes and collects ${solution.value} points.`,
        'Any schedule containing the remaining tasks would exceed the time limit, so no other subset earns more points.'
      ];
    }
  },
  {
    template: 'Reserve for unknown demand',
    type: 'reserve-for-unknown-demand',
    category: 'no-knowledge',
    parse(statement) {
      const rangeMatch = statement.match(/between (\d+) and (\d+) units/);
      if (rangeMatch === null) {
        throw new Error('cannot read the demand range');
      }
      return { low: Number(rangeMatch[1]), high: Number(rangeMatch[2]) };
    },
    solve(slots) {
      return { reserve: slots.high };
    },
    render(solution) {
      return `${solution.reserve} units.`;
    },
    compute: [
      'const slots = $slots;',
      'return slots.high + " units.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The demand can be anything from ${slots.low} to ${slots.high} units, so a stock level only guarantees coverage when it covers every value in that range.`,
        'Covering the whole range means covering its largest value, because any smaller stock would fail when the demand reaches the top of the range.',
        `The minimum stock that is sufficient in every case is therefore ${solution.reserve} units.`
      ];
    }
  },
];
