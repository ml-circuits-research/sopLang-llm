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
 * This is part B of the chapter. The parts carry disjoint cases and each
 * one repeats the header, the chapter number, and the helpers its own cases
 * call, so every part imports and loads on its own.
 */

export const unit = 34;

const WORD_NUMBERS = Object.freeze({
  one: 1,
  once: 1,
  two: 2,
  twice: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10
});

function numberWord(text) {
  const value = WORD_NUMBERS[String(text).toLowerCase()];
  if (value === undefined) {
    throw new Error(`the word "${text}" is not a supported number`);
  }
  return value;
}
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
function words(statement, pattern, label) {
  return requireMatch(statement, pattern, label);
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
    template: 'Scheduling tasks on one machine',
    type: 'scheduling-tasks-on-one-machine',
    category: 'no-knowledge',
    parse(statement) {
      const durations = [...statement.matchAll(/[A-Z] in (\d+)/g)].map((match) => Number(match[1]));
      if (durations.length === 0) { throw new Error('the task durations are missing from the statement'); }
      return { durations };
    },
    solve(slots) { return { total: slots.durations.reduce((sum, minutes) => sum + minutes, 0) }; },
    render(solution) { return `${solution.total} minutes.`; },
    compute: circuit([
      'let total = 0;',
      'for (const minutes of slots.durations) { total += minutes; }',
      'return total + " minutes.";'
    ]),
    explain(slots, solution) {
      return [
        `One machine runs the tasks one after another, so the order cannot change how long the whole set takes.`,
        `The total is the sum of the individual durations ${slots.durations.join(' + ')}.`,
        `That sum is ${solution.total} minutes, and no waiting or overlap occurs because the machine is never idle.`
      ];
    }
  },
  {
    template: 'Minimize waiting for the earliest tasks',
    type: 'minimize-waiting-for-the-earliest-tasks',
    category: 'no-knowledge',
    parse(statement) {
      const tasks = [...statement.matchAll(/([A-Z])\s*=\s*(\d+)/g)].map((match) => ({
        name: match[1],
        minutes: Number(match[2])
      }));
      if (tasks.length === 0) { throw new Error('the task durations are missing from the statement'); }
      return { tasks };
    },
    solve(slots) {
      const order = [...slots.tasks].sort((left, right) => left.minutes - right.minutes);
      const cost = (list) =>
        list.reduce((sum, task, index) => sum + list.slice(0, index + 1).reduce((inner, other) => inner + other.minutes, 0), 0);
      return { order, ascending: cost(order), descending: cost([...order].reverse()) };
    },
    render(solution) { return `Order ${solution.order.map((task) => task.name).join(',')}.`; },
    wires: [
      {
        name: 'chosen', command: 'jsEval', body: circuit([
          'const order = slots.tasks.slice().sort((left, right) => left.minutes - right.minutes);',
          'const cost = (list) => list.reduce((sum, task, index) => sum + list.slice(0, index + 1).reduce((inner, other) => inner + other.minutes, 0), 0);',
          'return cost(order) <= cost(order.slice().reverse()) ? order : order.slice().reverse();'
        ])
      }
    ],
    compute: ['return "Order " + $chosen.map((task) => task.name).join(",") + ".";'].join('\n'),
    explain(slots, solution) {
      return [
        `A task's completion time counts every task done before it, so an early short task is charged to all later tasks.`,
        `Ordering the durations as ${solution.order.map((task) => task.minutes).join(', ')} gives a completion-time sum of ${solution.ascending}, while the reverse order gives ${solution.descending}.`,
        `The smaller sum belongs to the order ${solution.order.map((task) => task.name).join(',')}, which places the shortest task first.`
      ];
    }
  },
  {
    template: 'Two machines in parallel',
    type: 'two-machines-in-parallel',
    category: 'no-knowledge',
    parse(statement) {
      const [machineWord, taskWord, minutes] = words(
        statement,
        /You have (\w+) identical machines and (\w+) tasks, each taking (\d+) minutes/,
        'the machine and task counts'
      );
      return { machines: numberWord(machineWord), tasks: numberWord(taskWord), minutes: Number(minutes) };
    },
    solve(slots) { return { total: Math.ceil(slots.tasks / slots.machines) * slots.minutes }; },
    render(solution) { return `${solution.total} minutes.`; },
    compute: circuit(['return Math.ceil(slots.tasks / slots.machines) * slots.minutes + " minutes.";']),
    explain(slots, solution) {
      return [
        `Each machine handles one task at a time, so the ${slots.tasks} tasks are handled in groups of at most ${slots.machines}.`,
        `That takes ${Math.ceil(slots.tasks / slots.machines)} rounds of ${slots.minutes} minutes each, and the machines run simultaneously.`,
        `So all tasks finish after ${solution.total} minutes, and the last round cannot be shortened.`
      ];
    }
  },
  {
    template: 'Balancing tasks between two machines',
    type: 'balancing-tasks-between-two-machines',
    category: 'no-knowledge',
    parse(statement) {
      const [list] = words(statement, /tasks lasting ([\d,\s]+) minutes/, 'the task durations');
      const [threshold] = numbers(statement, /finishing time of (\d+) minutes/, 'the target finishing time');
      const durations = list.split(',').map((value) => Number(value.trim()));
      if (durations.some((value) => Number.isNaN(value))) { throw new Error('the task durations are not all numbers'); }
      return { durations, threshold };
    },
    solve(slots) {
      let best = Infinity;
      for (let mask = 0; mask < 2 ** slots.durations.length; mask += 1) {
        let first = 0;
        let second = 0;
        for (let index = 0; index < slots.durations.length; index += 1) {
          if ((mask >> index) % 2 === 1) { first += slots.durations[index]; } else { second += slots.durations[index]; }
        }
        best = Math.min(best, Math.max(first, second));
      }
      return { best, threshold: slots.threshold };
    },
    render(solution) {
      const verdict = solution.best <= solution.threshold ? 'possible' : 'impossible';
      return `${solution.threshold} is ${verdict}; the minimum time is ${solution.best} minutes.`;
    },
    compute: circuit([
      'let best = Infinity;',
      'for (let mask = 0; mask < (1 << slots.durations.length); mask += 1) {',
      '  let first = 0;',
      '  let second = 0;',
      '  for (let index = 0; index < slots.durations.length; index += 1) {',
      '    if ((mask >> index) & 1) { first += slots.durations[index]; } else { second += slots.durations[index]; }',
      '  }',
      '  best = Math.min(best, Math.max(first, second));',
      '}',
      'return slots.threshold + (best <= slots.threshold ? " is possible; " : " is impossible; ") + "the minimum time is " + best + " minutes.";'
    ]),
    explain(slots, solution) {
      return [
        `The ${slots.durations.length} tasks split into two groups, and the finishing time of a split is the larger group total.`,
        `Trying every split shows the best achievable finishing time is ${solution.best} minutes; the total ${slots.durations.reduce((sum, value) => sum + value, 0)} gives the lower bound of half of it, which cannot be reached exactly.`,
        `A finishing time of ${slots.threshold} minutes is below the best split, so ${slots.threshold} is ${solution.best <= slots.threshold ? 'possible' : 'impossible'}.`
      ];
    }
  },
  {
    template: 'Filling with two package sizes',
    type: 'filling-with-two-package-sizes',
    category: 'no-knowledge',
    parse(statement) {
      const [space, sizeA, sizeB] = numbers(
        statement,
        /shelf has (\d+) units of space\. Packages A occupy (\d+) units, packages B occupy (\d+)/,
        'the shelf space and package sizes'
      );
      return { space, sizeA, sizeB };
    },
    solve(slots) {
      for (let a = Math.floor(slots.space / slots.sizeA); a >= 0; a -= 1) {
        const rest = slots.space - a * slots.sizeA;
        if (rest % slots.sizeB === 0) { return { filled: true, a, b: rest / slots.sizeB }; }
      }
      return { filled: false };
    },
    render(solution) {
      return solution.filled ? `Yes: ${solution.a} A and ${solution.b} B.` : 'No: the shelf cannot be filled exactly.';
    },
    compute: circuit([
      'for (let a = Math.floor(slots.space / slots.sizeA); a >= 0; a -= 1) {',
      '  const rest = slots.space - a * slots.sizeA;',
      '  if (rest % slots.sizeB === 0) { return "Yes: " + a + " A and " + (rest / slots.sizeB) + " B."; }',
      '}',
      'return "No: the shelf cannot be filled exactly.";'
    ]),
    explain(slots, solution) {
      return [
        `Filling exactly means finding counts a and b with a×${slots.sizeA} + b×${slots.sizeB} = ${slots.space}.`,
        `Trying the possible counts of A leaves a remainder that must divide by ${slots.sizeB}; ${solution.a} packages A leave ${slots.space - solution.a * slots.sizeA} units, which is exactly ${solution.b} packages B.`,
        `So the shelf can be filled exactly with ${solution.a} A and ${solution.b} B.`
      ];
    }
  },
  {
    template: 'Maximize value under a capacity limit',
    type: 'maximize-value-under-a-capacity-limit',
    category: 'no-knowledge',
    parse(statement) {
      const [capacity] = numbers(statement, /carry (\d+) kg/, 'the capacity');
      const items = [...statement.matchAll(/(?:Object )?([A-Z]): (\d+) kg, value (\d+)/g)].map((match) => ({
        name: match[1],
        weight: Number(match[2]),
        value: Number(match[3])
      }));
      if (items.length === 0) { throw new Error('the objects are missing from the statement'); }
      return { capacity, items };
    },
    solve(slots) {
      let best = null;
      for (let mask = 0; mask < 2 ** slots.items.length; mask += 1) {
        let weight = 0;
        let value = 0;
        const names = [];
        for (let index = 0; index < slots.items.length; index += 1) {
          if ((mask >> index) % 2 === 1) {
            weight += slots.items[index].weight;
            value += slots.items[index].value;
            names.push(slots.items[index].name);
          }
        }
        if (weight > slots.capacity) { continue; }
        if (best === null || value > best.value || (value === best.value && names.length < best.names.length)) {
          best = { names, value };
        }
      }
      return best;
    },
    render(solution) { return `${solution.names.join('+')}, value ${solution.value}.`; },
    wires: [
      {
        name: 'best', command: 'jsEval', body: circuit([
          'let best = null;',
          'for (let mask = 0; mask < (1 << slots.items.length); mask += 1) {',
          '  let weight = 0;',
          '  let value = 0;',
          '  const names = [];',
          '  for (let index = 0; index < slots.items.length; index += 1) {',
          '    if ((mask >> index) & 1) {',
          '      weight += slots.items[index].weight;',
          '      value += slots.items[index].value;',
          '      names.push(slots.items[index].name);',
          '    }',
          '  }',
          '  if (weight > slots.capacity) { continue; }',
          '  if (best === null || value > best.value || (value === best.value && names.length < best.names.length)) { best = { names, value }; }',
          '}',
          'return best;'
        ])
      }
    ],
    compute: ['return $best.names.join("+") + ", value " + $best.value + ".";'].join('\n'),
    explain(slots, solution) {
      return [
        `Each object is either taken or left, so the search tries every combination and discards the ones heavier than ${slots.capacity} kg.`,
        `Comparing the allowed combinations by total value leaves ${solution.names.join(' and ')} at value ${solution.value}.`,
        `No other allowed combination reaches a larger value, so ${solution.names.join('+')} is optimal.`
      ];
    }
  },
  {
    template: 'Minimize cost for a minimum quantity',
    type: 'minimize-cost-for-a-minimum-quantity',
    category: 'no-knowledge',
    parse(statement) {
      const [unitsA, costA, unitsB, costB, need] = numbers(
        statement,
        /Package A provides (\d+) units at cost (\d+), B provides (\d+) units at cost (\d+)\. You need at least (\d+) units/,
        'the package data and the requirement'
      );
      return { unitsA, costA, unitsB, costB, need };
    },
    solve(slots) {
      let best = null;
      const limitA = Math.ceil(slots.need / slots.unitsA) + 1;
      const limitB = Math.ceil(slots.need / slots.unitsB) + 1;
      for (let a = 0; a <= limitA; a += 1) {
        for (let b = 0; b <= limitB; b += 1) {
          if (a * slots.unitsA + b * slots.unitsB < slots.need) { continue; }
          const cost = a * slots.costA + b * slots.costB;
          if (best === null || cost < best.cost || (cost === best.cost && a + b < best.a + best.b)) {
            best = { a, b, cost, units: a * slots.unitsA + b * slots.unitsB };
          }
        }
      }
      return best;
    },
    render(solution) { return `${plural(solution.a, 'package')} A, cost ${solution.cost}.`; },
    wires: [
      {
        name: 'best', command: 'jsEval', body: circuit([
          'let best = null;',
          'const limitA = Math.ceil(slots.need / slots.unitsA) + 1;',
          'const limitB = Math.ceil(slots.need / slots.unitsB) + 1;',
          'for (let a = 0; a <= limitA; a += 1) {',
          '  for (let b = 0; b <= limitB; b += 1) {',
          '    if (a * slots.unitsA + b * slots.unitsB < slots.need) { continue; }',
          '    const cost = a * slots.costA + b * slots.costB;',
          '    if (best === null || cost < best.cost || (cost === best.cost && a + b < best.a + best.b)) { best = { a, b, cost, units: a * slots.unitsA + b * slots.unitsB }; }',
          '  }',
          '}',
          'return best;'
        ])
      }
    ],
    compute: ['return $best.a + " package" + ($best.a === 1 ? "" : "s") + " A, cost " + $best.cost + ".";'].join('\n'),
    explain(slots, solution) {
      return [
        `Every purchase is a count of packages A and B, and only purchases reaching ${slots.need} units qualify.`,
        `Comparing the qualifying combinations by cost leaves ${solution.a} packages A and ${solution.b} packages B at ${solution.units} units for ${solution.cost}.`,
        `The alternatives like 1 A and 1 B or 2 B cost more, so ${plural(solution.a, 'package')} A is the minimum-cost choice.`
      ];
    }
  },
  {
    template: 'Choose under both weight and volume constraints',
    type: 'choose-under-both-weight-and-volume-constraints',
    category: 'no-knowledge',
    parse(statement) {
      const [maxWeight, maxVolume, xWeight, xVolume, yWeight, yVolume] = numbers(
        statement,
        /allows at most (\d+) kg and at most (\d+) units of volume\. Package X has (\d+) kg, volume (\d+); Y has (\d+) kg, volume (\d+)/,
        'the limits and the package data'
      );
      return {
        maxWeight,
        maxVolume,
        x: { weight: xWeight, volume: xVolume },
        y: { weight: yWeight, volume: yVolume }
      };
    },
    solve(slots) {
      const weight = slots.x.weight + slots.y.weight;
      const volume = slots.x.volume + slots.y.volume;
      return { weight, volume, allowed: weight <= slots.maxWeight && volume <= slots.maxVolume };
    },
    render(solution) { return solution.allowed ? 'Yes.' : 'No.'; },
    compute: circuit([
      'const weight = slots.x.weight + slots.y.weight;',
      'const volume = slots.x.volume + slots.y.volume;',
      'return weight <= slots.maxWeight && volume <= slots.maxVolume ? "Yes." : "No.";'
    ]),
    explain(slots, solution) {
      return [
        `Taking both packages together adds their weights to ${solution.weight} kg and their volumes to ${solution.volume} units.`,
        `The weight stays within the ${slots.maxWeight} kg limit, but the volume exceeds the ${slots.maxVolume}-unit limit.`,
        `Since both limits must hold at once, the answer is no.`
      ];
    }
  }
];
