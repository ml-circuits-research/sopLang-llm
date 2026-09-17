/**
 * Families for chapter 1 of the mathematical seed book: order, comparison, and
 * conditions.
 *
 * A family covers one printed template. It provides the reference parse that
 * the compiling model performs on the printed statement, an independent
 * computation, the answer text the source prints, the SOP Lang computation
 * body that the circuit executes, and the explanation lines of the example.
 * The chapter is self-contained: every premise of the solution is stated in
 * the problem text, so the category is `no-knowledge`.
 */

export const chapter = 1;

export const cases = [
  {
    template: 'Order in a Line',
    type: 'order-in-a-line',
    category: 'no-knowledge',
    parse(statement) {
      const people = [];
      const clues = [];
      for (const match of statement.matchAll(/([A-Z][a-z]+) is before ([A-Z][a-z]+)/g)) {
        if (!people.includes(match[1])) {
          people.push(match[1]);
        }
        if (!people.includes(match[2])) {
          people.push(match[2]);
        }
        clues.push([match[1], match[2]]);
      }
      if (clues.length === 0) {
        throw new Error('no ordering clues found');
      }
      return { people, clues };
    },
    solve(slots) {
      const ancestors = new Map(slots.people.map((name) => [name, new Set()]));
      for (const [before, after] of slots.clues) {
        ancestors.get(after).add(before);
      }
      let changed = true;
      while (changed) {
        changed = false;
        for (const name of slots.people) {
          for (const ancestor of [...ancestors.get(name)]) {
            for (const earlier of ancestors.get(ancestor)) {
              if (!ancestors.get(name).has(earlier)) {
                ancestors.get(name).add(earlier);
                changed = true;
              }
            }
          }
        }
      }
      const order = [...slots.people].sort((left, right) => ancestors.get(left).size - ancestors.get(right).size);
      const ranks = new Set(order.map((name) => ancestors.get(name).size));
      if (ranks.size !== order.length) {
        throw new Error('the clues do not determine a single order');
      }
      return { order };
    },
    render(solution) {
      return `${solution.order.join(', ')}.`;
    },
    compute: [
      'const slots = $slots;',
      'const ancestors = new Map(slots.people.map((name) => [name, new Set()]));',
      'for (const [before, after] of slots.clues) {',
      '  ancestors.get(after).add(before);',
      '}',
      'let changed = true;',
      'while (changed) {',
      '  changed = false;',
      '  for (const name of slots.people) {',
      '    for (const ancestor of [...ancestors.get(name)]) {',
      '      for (const earlier of ancestors.get(ancestor)) {',
      '        if (!ancestors.get(name).has(earlier)) {',
      '          ancestors.get(name).add(earlier);',
      '          changed = true;',
      '        }',
      '      }',
      '    }',
      '  }',
      '}',
      'const order = [...slots.people].sort((left, right) => ancestors.get(left).size - ancestors.get(right).size);',
      'const ranks = new Set(order.map((name) => ancestors.get(name).size));',
      'if (ranks.size !== order.length) {',
      '  throw new Error("the clues do not determine a single order");',
      '}',
      'return order.join(", ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      const first = solution.order[0];
      const last = solution.order[solution.order.length - 1];
      return [
        `The clues form a chain of "before" relations over ${slots.people.length} children, so each clue can be read as an inequality of positions.`,
        'Taking the transitive closure of the clues gives every child the set of children that must stand earlier.',
        `Counting those predecessors orders the line without any guessing: ${solution.order.join(' < ')}.`,
        `The first position belongs to ${first} and the last to ${last}, and no other order satisfies all clues at once.`
      ];
    }
  },
  {
    template: 'Who Has the Longest Object?',
    type: 'who-has-the-longest-object',
    category: 'no-knowledge',
    parse(statement) {
      const people = [];
      const comparisons = [];
      const listMatch = statement.match(/^([A-Z][a-z]+(?:, [A-Z][a-z]+)*(?:, and [A-Z][a-z]+)?) each have/);
      if (listMatch !== null) {
        for (const name of listMatch[1].split(/, and |, /)) {
          people.push(name.trim());
        }
      }
      for (const match of statement.matchAll(/([A-Z][a-z]+)’s ribbon is (longer|shorter) than ([A-Z][a-z]+)’s/g)) {
        for (const name of [match[1], match[3]]) {
          if (!people.includes(name)) {
            people.push(name);
          }
        }
        comparisons.push([match[1], match[2], match[3]]);
      }
      if (comparisons.length === 0) {
        throw new Error('no ribbon comparisons found');
      }
      return { people, comparisons };
    },
    solve(slots) {
      const greater = new Map(slots.people.map((name) => [name, new Set()]));
      for (const [left, direction, right] of slots.comparisons) {
        if (direction === 'longer') {
          greater.get(left).add(right);
        } else {
          greater.get(right).add(left);
        }
      }
      let changed = true;
      while (changed) {
        changed = false;
        for (const name of slots.people) {
          for (const other of [...greater.get(name)]) {
            for (const further of greater.get(other)) {
              if (!greater.get(name).has(further)) {
                greater.get(name).add(further);
                changed = true;
              }
            }
          }
        }
      }
      const total = slots.people.length;
      const longest = slots.people.find((name) => greater.get(name).size === total - 1);
      const shortest = slots.people.find((name) => slots.people.every((other) => other === name || greater.get(other).has(name)));
      if (longest === undefined || shortest === undefined || longest === shortest) {
        throw new Error('the comparisons do not determine a single longest and shortest owner');
      }
      return { longest, shortest };
    },
    render(solution) {
      return `Longest: ${solution.longest}. Shortest: ${solution.shortest}.`;
    },
    compute: [
      'const slots = $slots;',
      'const greater = new Map(slots.people.map((name) => [name, new Set()]));',
      'for (const [left, direction, right] of slots.comparisons) {',
      '  if (direction === "longer") {',
      '    greater.get(left).add(right);',
      '  } else {',
      '    greater.get(right).add(left);',
      '  }',
      '}',
      'let changed = true;',
      'while (changed) {',
      '  changed = false;',
      '  for (const name of slots.people) {',
      '    for (const other of [...greater.get(name)]) {',
      '      for (const further of greater.get(other)) {',
      '        if (!greater.get(name).has(further)) {',
      '          greater.get(name).add(further);',
      '          changed = true;',
      '        }',
      '      }',
      '    }',
      '  }',
      '}',
      'const total = slots.people.length;',
      'const longest = slots.people.find((name) => greater.get(name).size === total - 1);',
      'const shortest = slots.people.find((name) => slots.people.every((other) => other === name || greater.get(other).has(name)));',
      'if (longest === undefined || shortest === undefined || longest === shortest) {',
      '  throw new Error("the comparisons do not determine a single longest and shortest owner");',
      '}',
      'return "Longest: " + longest + ". Shortest: " + shortest + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        `Each comparison is a direct inequality about ribbon length over the owners: ${slots.comparisons.map(([left, direction, right]) => `${left} ${direction === 'longer' ? '>' : '<'} ${right}`).join(', ')}.`,
        'Reading the comparisons transitively places one owner above all others and one below all others.',
        'The owner that is longer than every other owner is the longest, and the owner that is shorter than every other owner is the shortest.'
      ];
    }
  },
  {
    template: 'The Hidden Number Between Two Bounds',
    type: 'the-hidden-number-between-two-bounds',
    category: 'no-knowledge',
    parse(statement) {
      const listMatch = statement.match(/\[([0-9,\s]+)\]/);
      const boundsMatch = statement.match(/greater than (\d+) and, at the same time, less than (\d+)/);
      if (listMatch === null || boundsMatch === null) {
        throw new Error('the candidate list or the bounds are missing');
      }
      return {
        numbers: listMatch[1].split(',').map((value) => Number(value.trim())),
        lower: Number(boundsMatch[1]),
        upper: Number(boundsMatch[2])
      };
    },
    solve(slots) {
      const matching = slots.numbers.filter((value) => value > slots.lower && value < slots.upper);
      if (matching.length !== 1) {
        throw new Error(`the bounds keep ${matching.length} candidates instead of one`);
      }
      return { value: matching[0] };
    },
    render(solution) {
      return String(solution.value);
    },
    compute: [
      'const slots = $slots;',
      'const matching = slots.numbers.filter((value) => value > slots.lower && value < slots.upper);',
      'if (matching.length !== 1) {',
      '  throw new Error(`the bounds keep ${matching.length} candidates instead of one`);',
      '}',
      'return String(matching[0]);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The rule is a conjunction: a candidate counts only if it satisfies both comparisons at once (greater than ${slots.lower} and less than ${slots.upper}).`,
        `Testing the list ${slots.numbers.join(', ')} against both comparisons leaves exactly one number.`,
        `That number is ${solution.value}; every other candidate fails at least one of the two comparisons.`
      ];
    }
  },
  {
    template: 'Numbered Seats',
    type: 'numbered-seats',
    category: 'no-knowledge',
    parse(statement) {
      const countMatch = statement.match(/There are (\d+) seats/);
      const startMatch = statement.match(/([A-Z][a-z]+) sits in seat (\d+)/);
      const stepMatch = statement.match(/“(\w+) places after” means that we add (\d+)/);
      const steps = [...statement.matchAll(/([A-Z][a-z]+) sits exactly \w+ places after ([A-Z][a-z]+)/g)].map((match) => ({
        name: match[1],
        after: match[2]
      }));
      if (countMatch === null || startMatch === null || stepMatch === null || steps.length !== 2) {
        throw new Error('the seat statement does not match the template');
      }
      return {
        seatCount: Number(countMatch[1]),
        start: { name: startMatch[1], seat: Number(startMatch[2]) },
        steps,
        step: Number(stepMatch[2])
      };
    },
    solve(slots) {
      const seats = new Map([[slots.start.name, slots.start.seat]]);
      for (const entry of slots.steps) {
        seats.set(entry.name, seats.get(entry.after) + slots.step);
      }
      const asked = slots.steps.map((entry) => ({ name: entry.name, seat: seats.get(entry.name) }));
      for (const entry of asked) {
        if (entry.seat > slots.seatCount) {
          throw new Error(`${entry.name} falls outside the seat line`);
        }
      }
      return { seats: asked };
    },
    render(solution) {
      return `${solution.seats.map((entry) => `${entry.name}: seat ${entry.seat}`).join('; ')}.`;
    },
    compute: [
      'const slots = $slots;',
      'const seats = new Map([[slots.start.name, slots.start.seat]]);',
      'for (const entry of slots.steps) {',
      '  seats.set(entry.name, seats.get(entry.after) + slots.step);',
      '}',
      'const asked = slots.steps.map((entry) => ({ name: entry.name, seat: seats.get(entry.name) }));',
      'for (const entry of asked) {',
      '  if (entry.seat > slots.seatCount) {',
      '    throw new Error(`${entry.name} falls outside the seat line`);',
      '  }',
      '}',
      'return asked.map((entry) => entry.name + ": seat " + entry.seat).join("; ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The starting position is fixed: ${slots.start.name} sits in seat ${slots.start.seat}.`,
        `The problem defines "places after" as adding ${slots.step} to the seat number, so each later child is computed from the previous child instead of being counted from the start.`,
        `Applying the step twice gives ${solution.seats.map((entry) => `${entry.name} in seat ${entry.seat}`).join(' and ')}.`,
        `Both seats stay inside the ${slots.seatCount}-seat line, which is the consistency check for the answer.`
      ];
    }
  },
  {
    template: 'Two Boxes with a Given Difference',
    type: 'two-boxes-with-a-given-difference',
    category: 'no-knowledge',
    parse(statement) {
      const totalMatch = statement.match(/contain (\d+) \w+ altogether/);
      const differenceMatch = statement.match(/Box A has (\d+) more than Box B/);
      if (totalMatch === null || differenceMatch === null) {
        throw new Error('the total or the difference is missing');
      }
      return { total: Number(totalMatch[1]), difference: Number(differenceMatch[1]) };
    },
    solve(slots) {
      const remainder = slots.total - slots.difference;
      if (remainder < 0 || remainder % 2 !== 0) {
        throw new Error('the total and the difference do not split into two whole boxes');
      }
      const second = remainder / 2;
      return { first: second + slots.difference, second };
    },
    render(solution) {
      return `Box A: ${solution.first}; Box B: ${solution.second}.`;
    },
    compute: [
      'const slots = $slots;',
      'const remainder = slots.total - slots.difference;',
      'if (remainder < 0 || remainder % 2 !== 0) {',
      '  throw new Error("the total and the difference do not split into two whole boxes");',
      '}',
      'const second = remainder / 2;',
      'return "Box A: " + (second + slots.difference) + "; Box B: " + second + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The two boxes together hold ${slots.total}, and the first box holds ${slots.difference} more than the second.`,
        `Removing the extra ${slots.difference} from the total leaves two equal shares of ${solution.second}.`,
        `Returning the extra to the first box gives ${solution.first} in Box A and ${solution.second} in Box B, and the two numbers add up to ${slots.total} again as a check.`
      ];
    }
  }
];
