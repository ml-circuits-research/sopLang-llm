/**
 * Part C of chapter 40: strategy, winning positions, and mixed systems.
 * The part repeats the chapter number and shared helpers to import on its own;
 * the loader concatenates the parts of the chapter in file order.
 */

export const chapter = 40;
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
    template: 'Strategy by preserving multiples of three',
    type: 'strategy-by-preserving-multiples-of-three',
    category: 'no-knowledge',
    parse(statement) {
      const tokensMatch = statement.match(/Starting from (\d+) tokens/);
      const movesMatch = statement.match(/takes (\d+) or (\d+)/);
      if (tokensMatch === null || movesMatch === null) {
        throw new Error('cannot read the starting tokens or the allowed removals');
      }
      return {
        tokens: Number(tokensMatch[1]),
        moves: [Number(movesMatch[1]), Number(movesMatch[2])]
      };
    },
    solve(slots) {
      const winning = slots.moves.filter((move) => (slots.tokens - move) % 3 === 0);
      if (winning.length !== 1) {
        throw new Error('the statement does not describe a single first move');
      }
      return { move: winning[0], left: slots.tokens - winning[0] };
    },
    render(solution) {
      return `Take ${solution.move}.`;
    },
    compute: [
      'const slots = $slots;',
      'const winning = slots.moves.filter((move) => (slots.tokens - move) % 3 === 0);',
      'if (winning.length !== 1) { throw new Error("the statement does not describe a single first move"); }',
      'return "Take " + winning[0] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The target is to hand the opponent a multiple of 3, because from a multiple of 3 every pair of moves can be answered so that the pair totals 3.',
        `Starting from ${slots.tokens}, only one removal of ${slots.moves.join(' or ')} leaves a multiple of 3: taking ${solution.move} leaves ${solution.left}.`,
        `Therefore the first move is to take ${solution.move}.`
      ];
    }
  },
  {
    template: 'Strategy with information before acting',
    type: 'strategy-with-information-before-acting',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(
        /If you choose action ([A-Z]), you receive (\d+) for ([A-Z]) and (\d+) for ([A-Z]); with ([A-Z]), you receive (\d+) for ([A-Z]) and (\d+) for ([A-Z])/
      );
      const targetMatch = statement.match(/guarantee (\d+)/);
      if (match === null || targetMatch === null) {
        throw new Error('cannot read the payoffs of the information problem');
      }
      const table = {};
      table[match[1]] = { [match[3]]: Number(match[2]), [match[5]]: Number(match[4]) };
      table[match[6]] = { [match[8]]: Number(match[7]), [match[10]]: Number(match[9]) };
      return {
        actions: [match[1], match[6]],
        states: [match[3], match[5]],
        table,
        target: Number(targetMatch[1])
      };
    },
    solve(slots) {
      let guarantee = Infinity;
      for (const state of slots.states) {
        let best = -Infinity;
        for (const action of slots.actions) {
          best = Math.max(best, slots.table[action][state]);
        }
        guarantee = Math.min(guarantee, best);
      }
      return { guarantee, target: slots.target, informed: true };
    },
    render(solution) {
      return solution.guarantee >= solution.target ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'let guarantee = Infinity;',
      'for (const state of slots.states) {',
      '  let best = -Infinity;',
      '  for (const action of slots.actions) { best = Math.max(best, slots.table[action][state]); }',
      '  guarantee = Math.min(guarantee, best);',
      '}',
      'return guarantee >= slots.target ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      const bestFor = (state) =>
        Math.max(...slots.actions.map((action) => slots.table[action][state]));
      return [
        'Observing the type with certainty before acting lets the choice depend on the state, so the guarantee is the smallest over states of the best payoff available in that state.',
        `With the information the policy earns ${bestFor(slots.states[0])} in state ${slots.states[0]} and ${bestFor(slots.states[1])} in state ${slots.states[1]}, so the guarantee is ${solution.guarantee}.`,
        `Since ${solution.guarantee} is at least the required ${slots.target}, the answer is yes.`
      ];
    }
  },
  {
    template: 'A losing position in the 1-or-2 game',
    type: 'a-losing-position-in-the-1-or-2-game',
    category: 'no-knowledge',
    parse(statement) {
      const tokensMatch = statement.match(/there are (\d+) tokens/);
      if (tokensMatch === null) {
        throw new Error('cannot read the token count');
      }
      return { tokens: Number(tokensMatch[1]) };
    },
    solve(slots) {
      if (slots.tokens % 3 !== 0) {
        throw new Error('the template expects a multiple of three');
      }
      return { tokens: slots.tokens };
    },
    render(solution) {
      return `No; ${solution.tokens} is a losing position.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.tokens % 3 !== 0) { throw new Error("the template expects a multiple of three"); }',
      'return "No; " + slots.tokens + " is a losing position.";'
    ].join('\n'),
    explain(slots) {
      return [
        `${slots.tokens} is a multiple of 3, and the player to move can only remove 1 or 2.`,
        `Taking 1 leaves 2, which the opponent takes; taking 2 leaves 1, which the opponent takes.`,
        'In both replies the opponent removes the last token, so the position is losing for the player to move.'
      ];
    }
  },
  {
    template: 'Route robust to a blockage',
    type: 'route-robust-to-a-blockage',
    category: 'no-knowledge',
    parse(statement) {
      const networks = [];
      for (const match of statement.matchAll(/Network (\d+) has ([^.]*)/g)) {
        const routes = [...match[2].matchAll(/[A-Z]-[A-Z]-[A-Z]/g)].map((route) => route[0]);
        networks.push({ index: Number(match[1]), routes: routes.length });
      }
      if (networks.length === 0) {
        throw new Error('cannot read the network descriptions');
      }
      return { networks };
    },
    solve(slots) {
      const ordered = [...slots.networks].sort((left, right) => right.routes - left.routes);
      if (ordered.length < 2 || ordered[0].routes === ordered[1].routes) {
        throw new Error('no single more robust structure');
      }
      return { index: ordered[0].index, routes: ordered[0].routes };
    },
    render(solution) {
      return `Network ${solution.index}.`;
    },
    compute: [
      'const slots = $slots;',
      'const ordered = slots.networks.slice().sort((left, right) => right.routes - left.routes);',
      'if (ordered.length < 2 || ordered[0].routes === ordered[1].routes) { throw new Error("no single more robust structure"); }',
      'return "Network " + ordered[0].index + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Blocking one link destroys a structure whose routes share that link, so robustness against a single blockage requires more than one separate route.',
        `The first network offers a single route, while the second offers two separate routes, so one blocked link still leaves a path in the second.`,
        `The more robust structure is Network ${solution.index}.`
      ];
    }
  },
  {
    template: 'Without information, the same result cannot be guaranteed',
    type: 'without-information-the-same-result-cannot-be-guaranteed',
    category: 'knowledge',
    sharedPremise: 'The previous problem is a box of type X or Y: action A pays 10 for X and 0 for Y, while action B pays 0 for X and 10 for Y.',
    parse(statement) {
      const actionsMatch = statement.match(/choose ([A-Z]) or ([A-Z])/);
      const statesMatch = statement.match(/state is ([A-Z]) or ([A-Z])/);
      const targetMatch = statement.match(/guarantee (\d+)/);
      if (actionsMatch === null || statesMatch === null || targetMatch === null) {
        throw new Error('cannot read the actions, the states, or the target');
      }
      return {
        actions: [actionsMatch[1], actionsMatch[2]],
        states: [statesMatch[1], statesMatch[2]],
        target: Number(targetMatch[1]),
        informed: !/before learning/.test(statement)
      };
    },
    solve(slots) {
      if (slots.informed) {
        throw new Error('the template requires a choice made before observing the state');
      }
      let guarantee = -Infinity;
      for (const action of slots.actions) {
        let worst = Infinity;
        for (const state of slots.states) {
          worst = Math.min(worst, INFO_GAME[action][state]);
        }
        guarantee = Math.max(guarantee, worst);
      }
      return { guarantee, target: slots.target };
    },
    render(solution) {
      return solution.guarantee >= solution.target ? 'Yes.' : 'No.';
    },
    facts: JSON.stringify({ payoffs: INFO_GAME, decisionRule: { worstCase: 'min', acrossActions: 'max' } }),
    compute: [
      READ_FACTS,
      'if (slots.informed) { throw new Error("the template requires a choice made before observing the state"); }',
      'const rule = facts.decisionRule;',
      'let guarantee = -Infinity;',
      'for (const action of slots.actions) {',
      '  let worst = Infinity;',
      '  for (const state of slots.states) {',
      '    worst = rule.worstCase === "min" ? Math.min(worst, facts.payoffs[action][state]) : (() => { throw new Error("unsupported worst-case rule " + rule.worstCase); })();',
      '  }',
      '  guarantee = rule.acrossActions === "max" ? Math.max(guarantee, worst) : (() => { throw new Error("unsupported action rule " + rule.acrossActions); })();',
      '}',
      'return guarantee >= slots.target ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The payoff table of the previous problem is carried as an explicit fact: action A pays 10 in X and 0 in Y, and action B pays 0 in X and 10 in Y.',
        'Choosing before learning the state fixes a single action, so the guarantee of an action is its worst payoff over the two states.',
        `That worst payoff is 0 for both actions, so the best guarantee is ${solution.guarantee}, which is below the required ${slots.target}.`,
        'Without observing the type the result cannot be guaranteed, so the answer is no.'
      ];
    }
  },
  {
    template: 'Decision based on defined probability and payoff',
    type: 'decision-based-on-defined-probability-and-payoff',
    category: 'no-knowledge',
    parse(statement) {
      const games = [];
      for (const match of statement.matchAll(/Game ([A-Z]) gives (\d+) or (\d+)/g)) {
        games.push({ name: match[1], payoffs: [Number(match[2]), Number(match[3])] });
      }
      if (games.length === 0) {
        throw new Error('cannot read the game payoffs');
      }
      return { games };
    },
    solve(slots) {
      const averages = slots.games.map((game) => ({
        name: game.name,
        average: game.payoffs.reduce((sum, value) => sum + value, 0) / game.payoffs.length
      }));
      const ordered = [...averages].sort((left, right) => right.average - left.average);
      if (ordered.length < 2 || ordered[0].average === ordered[1].average) {
        throw new Error('the average values do not single out one game');
      }
      return { best: ordered[0].name, averages };
    },
    render(solution) {
      return `Game ${solution.best}.`;
    },
    compute: [
      'const slots = $slots;',
      'const averages = slots.games.map((game) => ({ name: game.name, average: game.payoffs.reduce((sum, value) => sum + value, 0) / game.payoffs.length }));',
      'averages.sort((left, right) => right.average - left.average);',
      'if (averages.length < 2 || averages[0].average === averages[1].average) { throw new Error("the average values do not single out one game"); }',
      'return "Game " + averages[0].name + ".";'
    ].join('\n'),
    explain(slots, solution) {
      const lines = solution.averages.map((entry) => `${entry.name} averages ${entry.average}`);
      return [
        'The average value of a game with equally likely outcomes is the mean of its payoffs.',
        `${lines.join(' and ')}, so the means differ.`,
        `The higher average belongs to game ${solution.best}, which is therefore the choice.`
      ];
    }
  },
  {
    template: 'Plan with dependency and value',
    type: 'plan-with-dependency-and-value',
    category: 'no-knowledge',
    parse(statement) {
      const budgetMatch = statement.match(/You have (\d+) minutes/);
      if (budgetMatch === null) {
        throw new Error('cannot read the time budget');
      }
      const tasks = [];
      for (const match of statement.matchAll(
        /Task ([A-Z]) is worth (\d+) and takes (\d+) minutes?, but it can be done only after ([A-Z]), which takes (\d+) minutes? and is worth (\d+)/g
      )) {
        tasks.push({ name: match[1], value: Number(match[2]), time: Number(match[3]), requires: match[4] });
        tasks.push({ name: match[4], value: Number(match[6]), time: Number(match[5]), requires: null });
      }
      for (const match of statement.matchAll(/Task ([A-Z]) takes (\d+) minutes? and is worth (\d+)/g)) {
        tasks.push({ name: match[1], value: Number(match[3]), time: Number(match[2]), requires: null });
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
        const names = chosen.map((task) => task.name);
        let feasible = true;
        let time = 0;
        let value = 0;
        for (const task of chosen) {
          time += task.time;
          value += task.value;
          if (task.requires !== null && !names.includes(task.requires)) {
            feasible = false;
          }
        }
        if (!feasible || time > slots.budget) {
          continue;
        }
        if (best === null || value > best.value || (value === best.value && time < best.time)) {
          best = { names, time, value };
        }
      }
      return best;
    },
    render(solution) {
      return `${solution.names.join('+')}.`;
    },
    compute: [
      'const slots = $slots;',
      'let best = null;',
      'for (let mask = 0; mask < (1 << slots.tasks.length); mask += 1) {',
      '  const chosen = slots.tasks.filter((task, index) => (mask & (1 << index)) !== 0);',
      '  const names = chosen.map((task) => task.name);',
      '  let feasible = true;',
      '  let time = 0;',
      '  let value = 0;',
      '  for (const task of chosen) {',
      '    time += task.time;',
      '    value += task.value;',
      '    if (task.requires !== null && !names.includes(task.requires)) { feasible = false; }',
      '  }',
      '  if (!feasible || time > slots.budget) { continue; }',
      '  if (best === null || value > best.value || (value === best.value && time < best.time)) {',
      '    best = { names: names, time: time, value: value };',
      '  }',
      '}',
      'return best.names.join("+") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The budget is ${slots.budget} minutes, and a plan is feasible only when every chosen task fits and each prerequisite is chosen with it.`,
        `${solution.names.join('+')} takes ${solution.time} minutes and is worth ${solution.value} points, while the dependent task needs its prerequisite as well and no longer fits.`,
        `So the best feasible choice is ${solution.names.join('+')}.`
      ];
    }
  },
  {
    template: 'Choose between two feasible plans using a score function',
    type: 'choose-between-two-feasible-plans-using-a-score-function',
    category: 'no-knowledge',
    parse(statement) {
      const plans = [];
      for (const match of statement.matchAll(/(?:Plan )?([A-Z]) costs (\d+) and takes (\d+)/g)) {
        plans.push({ name: match[1], cost: Number(match[2]), time: Number(match[3]) });
      }
      const formulaMatch = statement.match(/score=(\d*)×?cost\+(\d*)×?time/);
      if (plans.length === 0 || formulaMatch === null) {
        throw new Error('cannot read the plans or the score formula');
      }
      return {
        plans,
        costWeight: coefficient(formulaMatch[0], 'cost'),
        timeWeight: coefficient(formulaMatch[0], 'time')
      };
    },
    solve(slots) {
      const scored = slots.plans.map((plan) => ({
        name: plan.name,
        score: slots.costWeight * plan.cost + slots.timeWeight * plan.time
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
    compute: [
      'const slots = $slots;',
      'const scored = slots.plans.map((plan) => ({ name: plan.name, score: slots.costWeight * plan.cost + slots.timeWeight * plan.time }));',
      'scored.sort((left, right) => left.score - right.score);',
      'if (scored.length < 2 || scored[0].score === scored[1].score) { throw new Error("the scores do not single out one plan"); }',
      'return "Plan " + scored[0].name + ".";'
    ].join('\n'),
    explain(slots, solution) {
      const lines = solution.scores.map((entry) => `${entry.name} scores ${entry.score}`);
      return [
        `The score adds the cost and the time, so each plan is summarized by a single number and the lower score wins.`,
        `${lines.join(' and ')}.`,
        `Since the lower score belongs to plan ${solution.best}, that plan is chosen.`
      ];
    }
  },
];
