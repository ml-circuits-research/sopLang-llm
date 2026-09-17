/**
 * Families for chapter 26 of the mathematical seed book: calendars, cycles, and
 * periodic scheduling.
 *
 * A family covers one printed template. It provides the reference parse of the
 * statement, an independent computation, the answer text
 * the source prints, the SOP Lang computation body that the circuit executes,
 * and the explanation lines of the example. Every template of this chapter has a
 * single printed variant, so each title is one case.
 *
 * The cycle positions, the periods, the block lengths, and the interval bounds
 * are all stated in the problem text, so those cases are `no-knowledge`. When a
 * problem needs the order of the seven weekdays and never lists that order, the
 * case is `knowledge`: the order travels on a `@facts literal` wire and the
 * computation reads it as `$facts` instead of assuming an unstated calendar
 * fact.
 */

export const chapter = 26;

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * Prologue of every weekday computation: the parsed slots plus the fact table
 * that carries the order of the seven weekdays.
 */
function weekdayCompute(lines) {
  return [
    'const slots = $slots;',
    'const facts = (typeof $facts === "object" && $facts !== null) ? $facts : JSON.parse(String($facts));',
    'const days = facts.weekdays;',
    ...lines
  ].join('\n');
}

/**
 * Builds a case whose solution needs the weekday cycle, a calendar fact the
 * problem text does not list. The fact table travels on a `@facts literal` wire,
 * so the circuit materializes the fact instead of hiding it in code.
 */
function weekdayCase({ template, type, parse, solve, render, compute, explain, sharedPremise }) {
  return {
    template,
    type,
    category: 'knowledge',
    parse,
    solve,
    render,
    facts: JSON.stringify({ weekdays: WEEKDAYS }),
    compute,
    sharedPremise,
    explain
  };
}

// Part A of three: 8 chapter 26 cases, with the helpers they reference.
// Every part repeats the module header so each module imports on its own.
export const cases = [
  weekdayCase({
    template: 'The day four days ago',
    type: 'the-day-four-days-ago',
    sharedPremise: 'The weekday order used is Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.',
    parse(statement) {
      const targetMatch = statement.match(/today is (\w+), what day was it (\d+) days ago/);
      if (targetMatch === null) {
        throw new Error('the weekday or the day count is missing');
      }
      return { today: targetMatch[1], offset: Number(targetMatch[2]) };
    },
    solve(slots) {
      const index = WEEKDAYS.indexOf(slots.today);
      if (index === -1) {
        throw new Error(`unknown weekday "${slots.today}"`);
      }
      const length = WEEKDAYS.length;
      return { day: WEEKDAYS[((index - slots.offset) % length + length) % length] };
    },
    render(solution) {
      return `${solution.day}.`;
    },
    compute: weekdayCompute([
      'const index = days.indexOf(slots.today);',
      'if (index === -1) { throw new Error("unknown weekday \\"" + slots.today + "\\""); }',
      'const length = days.length;',
      'return days[((index - slots.offset) % length + length) % length] + ".";'
    ]),
    explain(slots, solution) {
      return [
        `Going back ${slots.offset} days is a move in the negative direction on the weekday cycle, which the problem text takes for granted rather than listing.`,
        `The circuit reads the seven weekdays from the fact table and shifts the position of ${slots.today} by minus ${slots.offset}, wrapping around the start of the cycle.`,
        `The wrapped position is ${solution.day}, so ${slots.offset} days before ${slots.today} is exactly that weekday.`
      ];
    }
  }),
  weekdayCase({
    template: 'The remainder after complete weeks',
    type: 'the-remainder-after-complete-weeks',
    parse(statement) {
      const todayMatch = statement.match(/Today is (\w+)/);
      const offsetMatch = statement.match(/it be (\d+) days from now/);
      const weekMatch = statement.match(/remove complete (\d+)-day weeks/);
      if (todayMatch === null || offsetMatch === null || weekMatch === null) {
        throw new Error('the weekday, the day count, or the week length is missing');
      }
      return {
        today: todayMatch[1],
        offset: Number(offsetMatch[1]),
        weekLength: Number(weekMatch[1])
      };
    },
    solve(slots) {
      const index = WEEKDAYS.indexOf(slots.today);
      if (index === -1) {
        throw new Error(`unknown weekday "${slots.today}"`);
      }
      const remainder = slots.offset % slots.weekLength;
      return { day: WEEKDAYS[(index + remainder) % WEEKDAYS.length], remainder };
    },
    render(solution) {
      return `${solution.day}.`;
    },
    compute: weekdayCompute([
      'const remainder = slots.offset % slots.weekLength;',
      'const index = days.indexOf(slots.today);',
      'if (index === -1) { throw new Error("unknown weekday \\"" + slots.today + "\\""); }',
      'return days[(index + remainder) % days.length] + ".";'
    ]),
    explain(slots, solution) {
      return [
        `The text states ${slots.weekLength}-day weeks, so ${slots.offset} days can be split into complete weeks plus a remainder.`,
        `${slots.offset} modulo ${slots.weekLength} is ${solution.remainder}, and only that remainder can change the weekday.`,
        `Stepping ${solution.remainder} weekday positions forward from ${slots.today} on the cycle read from the fact table gives ${solution.day}.`
      ];
    }
  }),
  weekdayCase({
    template: 'A simplified 30-day calendar',
    type: 'a-simplified-30-day-calendar',
    parse(statement) {
      const monthMatch = statement.match(/In an imaginary (\d+)-day month, day 1 is (\w+)/);
      const targetMatch = statement.match(/weekday is day (\d+)/);
      if (monthMatch === null || targetMatch === null) {
        throw new Error('the month length, the first weekday, or the target date is missing');
      }
      return {
        monthLength: Number(monthMatch[1]),
        startDay: monthMatch[2],
        targetDay: Number(targetMatch[1])
      };
    },
    solve(slots) {
      if (slots.targetDay < 1 || slots.targetDay > slots.monthLength) {
        throw new Error(`day ${slots.targetDay} lies outside the ${slots.monthLength}-day month`);
      }
      const index = WEEKDAYS.indexOf(slots.startDay);
      if (index === -1) {
        throw new Error(`unknown weekday "${slots.startDay}"`);
      }
      const steps = slots.targetDay - 1;
      return { day: WEEKDAYS[(index + steps) % WEEKDAYS.length], steps };
    },
    render(solution) {
      return `${solution.day}.`;
    },
    compute: weekdayCompute([
      'if (slots.targetDay < 1 || slots.targetDay > slots.monthLength) { throw new Error("day " + slots.targetDay + " lies outside the " + slots.monthLength + "-day month"); }',
      'const steps = slots.targetDay - 1;',
      'const index = days.indexOf(slots.startDay);',
      'if (index === -1) { throw new Error("unknown weekday \\"" + slots.startDay + "\\""); }',
      'return days[(index + steps) % days.length] + ".";'
    ]),
    explain(slots, solution) {
      return [
        `Dates are counted from 1, so from day 1 to day ${slots.targetDay} the calendar advances ${solution.steps} day steps.`,
        `Reducing those ${solution.steps} steps modulo the seven weekdays leaves the displacement that actually moves the weekday.`,
        `Starting from ${slots.startDay} in the order read from the fact table, the resulting weekday is ${solution.day}; the ${slots.monthLength}-day length only bounds the date.`
      ];
    }
  }),
  weekdayCase({
    template: 'The last day of a given month',
    type: 'the-last-day-of-a-given-month',
    parse(statement) {
      const monthMatch = statement.match(/(\d+) days and begins on a (\w+)/);
      const targetMatch = statement.match(/weekday is day (\d+)/);
      if (monthMatch === null || targetMatch === null) {
        throw new Error('the month length, the first weekday, or the target date is missing');
      }
      return {
        monthLength: Number(monthMatch[1]),
        startDay: monthMatch[2],
        targetDay: Number(targetMatch[1])
      };
    },
    solve(slots) {
      if (slots.targetDay > slots.monthLength) {
        throw new Error(`day ${slots.targetDay} lies outside the ${slots.monthLength}-day month`);
      }
      const index = WEEKDAYS.indexOf(slots.startDay);
      if (index === -1) {
        throw new Error(`unknown weekday "${slots.startDay}"`);
      }
      const steps = slots.targetDay - 1;
      return { day: WEEKDAYS[(index + steps) % WEEKDAYS.length], steps };
    },
    render(solution) {
      return `${solution.day}.`;
    },
    compute: weekdayCompute([
      'if (slots.targetDay > slots.monthLength) { throw new Error("day " + slots.targetDay + " lies outside the " + slots.monthLength + "-day month"); }',
      'const steps = slots.targetDay - 1;',
      'const index = days.indexOf(slots.startDay);',
      'if (index === -1) { throw new Error("unknown weekday \\"" + slots.startDay + "\\""); }',
      'return days[(index + steps) % days.length] + ".";'
    ]),
    explain(slots, solution) {
      return [
        `The month starts on ${slots.startDay} with the label day 1, so day ${slots.targetDay} is ${solution.steps} day steps later.`,
        `Removing whole weeks from ${solution.steps} steps leaves the displacement modulo seven that the weekday cycle senses.`,
        `Continuing that displacement from ${slots.startDay} along the order given by the fact table lands on ${solution.day}, the last day of the ${slots.monthLength}-day month.`
      ];
    }
  }),
  weekdayCase({
    template: 'The first day of the next month',
    type: 'the-first-day-of-the-next-month',
    parse(statement) {
      const monthMatch = statement.match(/A month has (\d+) days, and day 1 is (\w+)/);
      if (monthMatch === null) {
        throw new Error('the month length or the first weekday is missing');
      }
      return { monthLength: Number(monthMatch[1]), startDay: monthMatch[2] };
    },
    solve(slots) {
      const index = WEEKDAYS.indexOf(slots.startDay);
      if (index === -1) {
        throw new Error(`unknown weekday "${slots.startDay}"`);
      }
      const shift = slots.monthLength % WEEKDAYS.length;
      return { day: WEEKDAYS[(index + shift) % WEEKDAYS.length], shift };
    },
    render(solution) {
      return `${solution.day}.`;
    },
    compute: weekdayCompute([
      'const shift = slots.monthLength % days.length;',
      'const index = days.indexOf(slots.startDay);',
      'if (index === -1) { throw new Error("unknown weekday \\"" + slots.startDay + "\\""); }',
      'return days[(index + shift) % days.length] + ".";'
    ]),
    explain(slots, solution) {
      return [
        `The day after date ${slots.monthLength} is the new date 1, so the two first days of the month are exactly ${slots.monthLength} days apart.`,
        `Only ${slots.monthLength} modulo seven matters for the weekday, and that shift is ${solution.shift} day${solution.shift === 1 ? '' : 's'}.`,
        `Shifting ${slots.startDay} by ${solution.shift} positions in the weekday order from the fact table gives ${solution.day} for the start of the next month.`
      ];
    }
  }),
  {
    template: 'Alternating work and rest',
    type: 'alternating-work-and-rest',
    category: 'no-knowledge',
    parse(statement) {
      const cycleMatch = statement.match(/one day it (\w+), one day it (\w+)/);
      const firstMatch = statement.match(/Day 1 is a (\w+) day/);
      const dayMatch = statement.match(/on day (\d+)\?/);
      if (cycleMatch === null || firstMatch === null || dayMatch === null) {
        throw new Error('the repeating behaviour, the first day, or the target day is missing');
      }
      const cycle = [cycleMatch[1], cycleMatch[2]];
      const stem = firstMatch[1].replace(/s$/, '');
      const firstIndex = cycle.findIndex((state) => state.replace(/s$/, '') === stem);
      if (firstIndex === -1) {
        throw new Error(`"${firstMatch[1]}" is not one of the two behaviours`);
      }
      return { cycle: firstIndex === 0 ? cycle : [cycle[1], cycle[0]], day: Number(dayMatch[1]) };
    },
    solve(slots) {
      return { action: slots.cycle[(slots.day - 1) % slots.cycle.length] };
    },
    render(solution) {
      return `It ${solution.action}.`;
    },
    compute: [
      'const slots = $slots;',
      'return "It " + slots.cycle[(slots.day - 1) % slots.cycle.length] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The robot repeats the two-state cycle ${slots.cycle.join(', ')}, and the text fixes ${slots.cycle[0]} as the behaviour of day 1.`,
        `Counting from day 1, day ${slots.day} sits at position ${(slots.day - 1) % slots.cycle.length} of that cycle because ${slots.day - 1} modulo ${slots.cycle.length} keeps only the remainder.`,
        `That position holds ${solution.action}, so on day ${slots.day} the robot ${solution.action}.`
      ];
    }
  },
  weekdayCase({
    template: 'Three consecutive working days',
    type: 'three-consecutive-working-days',
    parse(statement) {
      const rangeMatch = statement.match(/Only (\w+)–(\w+) count as working days/);
      const startMatch = statement.match(/starts on (\w+)/);
      const requiredMatch = statement.match(/requires (\d+) working days/);
      if (rangeMatch === null || startMatch === null || requiredMatch === null) {
        throw new Error('the working-day range, the starting day, or the required count is missing');
      }
      return {
        range: [rangeMatch[1], rangeMatch[2]],
        start: startMatch[1],
        required: Number(requiredMatch[1])
      };
    },
    solve(slots) {
      const first = WEEKDAYS.indexOf(slots.range[0]);
      const last = WEEKDAYS.indexOf(slots.range[1]);
      if (first === -1 || last < first) {
        throw new Error('the working-day range does not match the weekday order');
      }
      const working = new Set(WEEKDAYS.slice(first, last + 1));
      if (!working.has(slots.start)) {
        throw new Error(`the task starts on ${slots.start}, which is not a working day`);
      }
      let index = WEEKDAYS.indexOf(slots.start);
      let counted = 1;
      while (counted < slots.required) {
        index = (index + 1) % WEEKDAYS.length;
        if (working.has(WEEKDAYS[index])) {
          counted += 1;
        }
      }
      return { day: WEEKDAYS[index] };
    },
    render(solution) {
      return `${solution.day}.`;
    },
    compute: weekdayCompute([
      'const first = days.indexOf(slots.range[0]);',
      'const last = days.indexOf(slots.range[1]);',
      'if (first === -1 || last < first) { throw new Error("the working-day range does not match the weekday order"); }',
      'const working = days.slice(first, last + 1);',
      'if (!working.includes(slots.start)) { throw new Error("the task starts on " + slots.start + ", which is not a working day"); }',
      'let index = days.indexOf(slots.start);',
      'let counted = 1;',
      'while (counted < slots.required) {',
      '  index = (index + 1) % days.length;',
      '  if (working.includes(days[index])) { counted += 1; }',
      '}',
      'return days[index] + ".";'
    ]),
    explain(slots, solution) {
      return [
        `The working week is the block from ${slots.range[0]} to ${slots.range[1]}, read on the weekday order supplied by the fact table; Saturday and Sunday are outside it.`,
        `The start day counts as the first working day, so the ${slots.required} required days are counted by walking forward one weekday at a time and skipping any day outside the block.`,
        `The walk from ${slots.start} crosses the weekend and stops on ${solution.day}.`
      ];
    }
  }),
  weekdayCase({
    template: 'A deadline two working days later',
    type: 'a-deadline-two-working-days-later',
    parse(statement) {
      const receivedMatch = statement.match(/received on (\w+)/);
      const countMatch = statement.match(/in (\d+) working days/);
      const rangeMatch = statement.match(/working days are (\w+)–(\w+)/);
      const excludedMatch = statement.match(/Do not count (\w+) as the first day/);
      if (receivedMatch === null || countMatch === null || rangeMatch === null || excludedMatch === null) {
        throw new Error('the arrival day, the working-day count, or the working-day range is missing');
      }
      if (excludedMatch[1] !== receivedMatch[1]) {
        throw new Error('the excluded first day is not the day the message arrives');
      }
      return {
        received: receivedMatch[1],
        count: Number(countMatch[1]),
        range: [rangeMatch[1], rangeMatch[2]]
      };
    },
    solve(slots) {
      const first = WEEKDAYS.indexOf(slots.range[0]);
      const last = WEEKDAYS.indexOf(slots.range[1]);
      if (first === -1 || last < first) {
        throw new Error('the working-day range does not match the weekday order');
      }
      const working = new Set(WEEKDAYS.slice(first, last + 1));
      let index = WEEKDAYS.indexOf(slots.received);
      if (index === -1) {
        throw new Error(`unknown weekday "${slots.received}"`);
      }
      let counted = 0;
      while (counted < slots.count) {
        index = (index + 1) % WEEKDAYS.length;
        if (working.has(WEEKDAYS[index])) {
          counted += 1;
        }
      }
      return { day: WEEKDAYS[index] };
    },
    render(solution) {
      return `${solution.day}.`;
    },
    compute: weekdayCompute([
      'const first = days.indexOf(slots.range[0]);',
      'const last = days.indexOf(slots.range[1]);',
      'if (first === -1 || last < first) { throw new Error("the working-day range does not match the weekday order"); }',
      'const working = days.slice(first, last + 1);',
      'let index = days.indexOf(slots.received);',
      'if (index === -1) { throw new Error("unknown weekday \\"" + slots.received + "\\""); }',
      'let counted = 0;',
      'while (counted < slots.count) {',
      '  index = (index + 1) % days.length;',
      '  if (working.includes(days[index])) { counted += 1; }',
      '}',
      'return days[index] + ".";'
    ]),
    explain(slots, solution) {
      return [
        `Working days are the block from ${slots.range[0]} to ${slots.range[1]} in the weekday order given by the fact table.`,
        `Because ${slots.received} is explicitly not counted as the first day, the count starts at zero and advances one weekday at a time, admitting only days inside the block.`,
        `Two admitted steps after ${slots.received} land on ${solution.day}, which is the deadline.`
      ];
    }
  }),
];
