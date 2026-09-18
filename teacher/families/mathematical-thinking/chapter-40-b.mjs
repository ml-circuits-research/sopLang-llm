/**
 * Part B of chapter 40: strategy, winning positions, and mixed systems.
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
    template: 'Optimistic versus robust decision-making',
    type: 'optimistic-versus-robust-decision-making',
    category: 'no-knowledge',
    parse(statement) {
      const options = [];
      for (const match of statement.matchAll(/([A-Z])=\{([\d,]+)\}/g)) {
        options.push({ name: match[1], payoffs: match[2].split(',').map(Number) });
      }
      if (options.length === 0) {
        throw new Error('cannot read the outcome sets');
      }
      return { options };
    },
    solve(slots) {
      let optimistic = null;
      let robust = null;
      for (const option of slots.options) {
        const best = Math.max(...option.payoffs);
        const worst = Math.min(...option.payoffs);
        if (optimistic === null || best > optimistic.best) {
          optimistic = { name: option.name, best };
        }
        if (robust === null || worst > robust.worst) {
          robust = { name: option.name, worst };
        }
      }
      return { optimistic: optimistic.name, robust: robust.name };
    },
    render(solution) {
      return `Optimistic: ${solution.optimistic}; robust: ${solution.robust}.`;
    },
    compute: [
      'const slots = $slots;',
      'let optimistic = null;',
      'let robust = null;',
      'for (const option of slots.options) {',
      '  const best = Math.max.apply(null, option.payoffs);',
      '  const worst = Math.min.apply(null, option.payoffs);',
      '  if (optimistic === null || best > optimistic.best) { optimistic = { name: option.name, best: best }; }',
      '  if (robust === null || worst > robust.worst) { robust = { name: option.name, worst: worst }; }',
      '}',
      'return "Optimistic: " + optimistic.name + "; robust: " + robust.name + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The optimistic criterion compares the best possible results, while the robust criterion compares the worst possible results.',
        `The largest best result belongs to ${solution.optimistic} and the largest worst result belongs to ${solution.robust}.`,
        `So the maximax choice is ${solution.optimistic} and the maximin choice is ${solution.robust}.`
      ];
    }
  },
  {
    template: 'Improve the correct bottleneck',
    type: 'improve-the-correct-bottleneck',
    category: 'no-knowledge',
    parse(statement) {
      const stages = [...statement.matchAll(/([A-Z])=(\d+)/g)].map((match) => ({
        name: match[1],
        capacity: Number(match[2])
      }));
      const upgradeMatch = statement.match(/increase either ([A-Z]) or ([A-Z]) by (\d+)/);
      if (stages.length === 0 || upgradeMatch === null) {
        throw new Error('cannot read the capacities or the allowed upgrade');
      }
      return {
        stages,
        options: [upgradeMatch[1], upgradeMatch[2]],
        delta: Number(upgradeMatch[3])
      };
    },
    solve(slots) {
      const base = Math.min(...slots.stages.map((stage) => stage.capacity));
      let best = null;
      for (const option of slots.options) {
        const capacities = slots.stages.map((stage) =>
          stage.name === option ? stage.capacity + slots.delta : stage.capacity
        );
        const throughput = Math.min(...capacities);
        if (best === null || throughput > best.throughput) {
          best = { name: option, throughput };
        }
      }
      if (best.throughput <= base) {
        throw new Error('no allowed upgrade improves the throughput');
      }
      return { base, choice: best.name, throughput: best.throughput };
    },
    render(solution) {
      return `Increase the capacity of ${solution.choice}.`;
    },
    compute: [
      'const slots = $slots;',
      'const base = Math.min.apply(null, slots.stages.map((stage) => stage.capacity));',
      'let best = null;',
      'for (const option of slots.options) {',
      '  const capacities = slots.stages.map((stage) => (stage.name === option ? stage.capacity + slots.delta : stage.capacity));',
      '  const throughput = Math.min.apply(null, capacities);',
      '  if (best === null || throughput > best.throughput) { best = { name: option, throughput: throughput }; }',
      '}',
      'if (best.throughput <= base) { throw new Error("no allowed upgrade improves the throughput"); }',
      'return "Increase the capacity of " + best.name + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The current throughput is the smallest capacity, ${solution.base} objects/hour, because that stage is the bottleneck.`,
        `Upgrading a stage that is not the bottleneck leaves the smallest capacity unchanged, while upgrading ${solution.choice} raises it to ${solution.throughput}.`,
        `Only the upgrade of ${solution.choice} increases the system throughput, so the answer is to increase ${solution.choice}.`
      ];
    }
  },
  {
    template: 'Defined “cut and choose” division',
    type: 'defined-cut-and-choose-division',
    category: 'no-knowledge',
    parse(statement) {
      const peopleMatch = statement.match(/(\w+) people divide/);
      const piecesMatch = statement.match(/into (\w+) pieces/);
      const cutterMatch = statement.match(/the (\w+) person cuts/);
      const chooserMatch = statement.match(/the (\w+) person chooses first/);
      if (peopleMatch === null || piecesMatch === null || cutterMatch === null || chooserMatch === null) {
        throw new Error('cannot read the division rule');
      }
      return {
        people: countWord(peopleMatch[1]),
        pieces: countWord(piecesMatch[1]),
        cutter: cutterMatch[1],
        chooser: chooserMatch[1]
      };
    },
    solve(slots) {
      if (slots.pieces !== 2) {
        throw new Error('the cut-and-choose rule needs two pieces');
      }
      if (slots.cutter === slots.chooser) {
        throw new Error('the cutter and the chooser must be different people');
      }
      let bestShare = -1;
      let bestCut = null;
      for (let tenths = 0; tenths <= 10; tenths += 1) {
        const left = tenths / 10;
        const guaranteed = Math.min(left, 1 - left);
        if (guaranteed > bestShare) {
          bestShare = guaranteed;
          bestCut = left;
        }
      }
      if (bestCut !== 0.5) {
        throw new Error('the equal cut is not the maximin cut');
      }
      return { bestShare, bestCut, worse: 'smaller' };
    },
    render(solution) {
      return `To avoid the risk of being left with a part they consider ${solution.worse}.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.pieces !== 2) { throw new Error("the cut-and-choose rule needs two pieces"); }',
      'if (slots.cutter === slots.chooser) { throw new Error("the cutter and the chooser must be different people"); }',
      'let bestShare = -1;',
      'let bestCut = null;',
      'for (let tenths = 0; tenths <= 10; tenths += 1) {',
      '  const left = tenths / 10;',
      '  const guaranteed = Math.min(left, 1 - left);',
      '  if (guaranteed > bestShare) { bestShare = guaranteed; bestCut = left; }',
      '}',
      'if (bestCut !== 0.5) { throw new Error("the equal cut is not the maximin cut"); }',
      'return "To avoid the risk of being left with a part they consider smaller.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The ${slots.chooser} person chooses first, so for any cut the chooser seizes the piece that looks better and the ${slots.cutter} person keeps the other one.`,
        'The cutter therefore guarantees only the smaller of the two pieces, and maximizing that guaranteed share means making the pieces equal, which is the maximin cut.',
        `An unequal cut would let the chooser take the better piece and leave the cutter with a part they consider smaller, which is exactly the risk the equal cut removes.`
      ];
    }
  },
  {
    template: 'Sustainability threshold',
    type: 'sustainability-threshold',
    category: 'no-knowledge',
    parse(statement) {
      const regenerateMatch = statement.match(/regenerates by (\d+) units\/day/);
      const useMatch = statement.match(/use exactly (\d+)\/day/);
      if (regenerateMatch === null || useMatch === null) {
        throw new Error('cannot read the regeneration or the use');
      }
      return { regenerate: Number(regenerateMatch[1]), use: Number(useMatch[1]) };
    },
    solve(slots) {
      return { net: slots.regenerate - slots.use };
    },
    render(solution) {
      return solution.net === 0 ? 'It remains constant.' : `It ${solution.net > 0 ? 'grows' : 'shrinks'}.`;
    },
    compute: [
      'const slots = $slots;',
      'const net = slots.regenerate - slots.use;',
      'return net === 0 ? "It remains constant." : (net > 0 ? "It grows." : "It shrinks.");'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The stock changes by the regeneration minus the use, that is ${slots.regenerate} - ${slots.use} = ${solution.net} units per day.`,
        'A net change of zero means the stock returns to the same level each day.',
        'So from one day to the next the stock remains constant, which is the exact sustainability threshold.'
      ];
    }
  },
  {
    template: 'Mixed constraints for a mission',
    type: 'mixed-constraints-for-a-mission',
    category: 'no-knowledge',
    parse(statement) {
      const budgetMatch = statement.match(/has (\d+) units of energy and (\d+) minutes/);
      if (budgetMatch === null) {
        throw new Error('cannot read the available energy and time');
      }
      const missions = [];
      for (const match of statement.matchAll(/([A-Z]) requires (\d+) energy and (\d+) minutes/g)) {
        missions.push({ name: match[1], energy: Number(match[2]), time: Number(match[3]) });
      }
      if (missions.length === 0) {
        throw new Error('cannot read the mission requirements');
      }
      return {
        energy: Number(budgetMatch[1]),
        time: Number(budgetMatch[2]),
        missions
      };
    },
    solve(slots) {
      const energy = slots.missions.reduce((sum, mission) => sum + mission.energy, 0);
      const time = slots.missions.reduce((sum, mission) => sum + mission.time, 0);
      return {
        feasible: energy <= slots.energy && time <= slots.time,
        energy,
        time,
        budgetEnergy: slots.energy,
        budgetTime: slots.time
      };
    },
    render(solution) {
      return solution.feasible ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'const energy = slots.missions.reduce((sum, mission) => sum + mission.energy, 0);',
      'const time = slots.missions.reduce((sum, mission) => sum + mission.time, 0);',
      'return energy <= slots.energy && time <= slots.time ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `All missions together need ${solution.energy} units of energy and ${solution.time} minutes.`,
        `The robot has ${slots.energy} units of energy and ${slots.time} minutes, so the energy demand is compared with ${slots.energy} and the time demand with ${slots.time}.`,
        `The energy demand exceeds the budget while the time demand fits, so both missions cannot be completed.`
      ];
    }
  },
  {
    template: 'Sensors and majority voting',
    type: 'sensors-and-majority-voting',
    category: 'no-knowledge',
    parse(statement) {
      const answersMatch = statement.match(/answers are ([a-z]+(?:, [a-z]+)*)/);
      const faultyMatch = statement.match(/at most (\w+) can be wrong/);
      if (answersMatch === null || faultyMatch === null) {
        throw new Error('cannot read the answers or the fault bound');
      }
      return {
        answers: answersMatch[1].split(', ').map((answer) => answer.trim()),
        faulty: countWord(faultyMatch[1])
      };
    },
    solve(slots) {
      const counts = new Map();
      for (const answer of slots.answers) {
        counts.set(answer, (counts.get(answer) ?? 0) + 1);
      }
      const ordered = [...counts.entries()].sort((left, right) => right[1] - left[1]);
      if (ordered.length < 2 || ordered[0][1] === ordered[1][1]) {
        throw new Error('there is no majority answer');
      }
      const guaranteed = slots.faulty * 2 < slots.answers.length;
      return { value: ordered[0][0], guaranteed };
    },
    render(solution) {
      if (!solution.guaranteed) {
        throw new Error('the majority answer is not guaranteed for this fault bound');
      }
      return `${capitalize(solution.value)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const counts = new Map();',
      'for (const answer of slots.answers) { counts.set(answer, (counts.get(answer) || 0) + 1); }',
      'const ordered = Array.from(counts.entries()).sort((left, right) => right[1] - left[1]);',
      'if (ordered.length < 2 || ordered[0][1] === ordered[1][1]) { throw new Error("there is no majority answer"); }',
      'if (slots.faulty * 2 >= slots.answers.length) { throw new Error("the majority answer is not guaranteed for this fault bound"); }',
      'const value = ordered[0][0];',
      'return value.charAt(0).toUpperCase() + value.slice(1) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `With ${slots.answers.length} sensors and at most ${slots.faulty} faulty, the two agreeing sensors cannot both be faulty.`,
        `The majority value is ${solution.value}, and the faulty sensors can change at most ${slots.faulty} of the answers, so the majority still holds.`,
        `The value guaranteed correct by majority is ${capitalize(solution.value)}.`
      ];
    }
  },
  {
    template: 'Decision with a two-stage tree',
    type: 'decision-with-a-two-stage-tree',
    category: 'no-knowledge',
    parse(statement) {
      const options = [];
      for (const match of statement.matchAll(/After ([A-Z]), an event gives payoff (\d+) or (\d+)/g)) {
        options.push({ name: match[1], payoffs: [Number(match[2]), Number(match[3])] });
      }
      if (options.length === 0) {
        throw new Error('cannot read the payoffs of the decision tree');
      }
      return { options };
    },
    solve(slots) {
      let best = null;
      for (const option of slots.options) {
        const worst = Math.min(...option.payoffs);
        if (best === null || worst > best.worst) {
          best = { name: option.name, worst };
        }
      }
      return best;
    },
    render(solution) {
      return `${solution.name}.`;
    },
    compute: [
      'const slots = $slots;',
      'let best = null;',
      'for (const option of slots.options) {',
      '  const worst = Math.min.apply(null, option.payoffs);',
      '  if (best === null || worst > best.worst) { best = { name: option.name, worst: worst }; }',
      '}',
      'return best.name + ".";'
    ].join('\n'),
    explain(slots, solution) {
      const lines = slots.options.map(
        (option) => `${option.name} guarantees ${Math.min(...option.payoffs)}`
      );
      return [
        'Maximizing the worst possible result means replacing each option by its smallest payoff and then choosing the largest of those minima.',
        `${lines.join(' and ')}, so the guaranteed values differ.`,
        `The option with the best guaranteed value is ${solution.name}, so it is the maximin choice.`
      ];
    }
  },
  {
    template: 'Policy with simplified hysteresis',
    type: 'policy-with-simplified-hysteresis',
    category: 'no-knowledge',
    parse(statement) {
      const onMatch = statement.match(/drops below (\d+)/);
      const offMatch = statement.match(/rises above (\d+)/);
      const startMatch = statement.match(/It is at (\d+), so it turns on/);
      const temperatureMatch = statement.match(/temperature reaches (\d+)/);
      if (onMatch === null || offMatch === null || startMatch === null || temperatureMatch === null) {
        throw new Error('cannot read the thresholds or the temperatures');
      }
      return {
        onBelow: Number(onMatch[1]),
        offAbove: Number(offMatch[1]),
        start: Number(startMatch[1]),
        temperature: Number(temperatureMatch[1])
      };
    },
    solve(slots) {
      if (slots.start >= slots.onBelow) {
        throw new Error('the heating is not in the on state described by the statement');
      }
      const heating = true;
      return { heating, turnsOff: heating && slots.temperature > slots.offAbove };
    },
    render(solution) {
      return solution.turnsOff ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'if (slots.start >= slots.onBelow) { throw new Error("the heating is not in the on state described by the statement"); }',
      'return slots.temperature > slots.offAbove ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The heating turns on below ${slots.onBelow} and turns off only above ${slots.offAbove}, so turning off is a stricter condition than turning on.`,
        `The temperature now reaches ${slots.temperature}, and the shutoff condition asks for more than ${slots.offAbove}.`,
        `Since ${slots.temperature} does not exceed ${slots.offAbove}, the heating stays on and does not turn off.`
      ];
    }
  },
];
