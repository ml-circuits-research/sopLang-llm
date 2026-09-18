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

export const unit = 26;

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

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
function weekdayCase({ template, type, parse, solve, render, compute, explain }) {
  return {
    template,
    type,
    category: 'knowledge',
    parse,
    solve,
    render,
    facts: JSON.stringify({ weekdays: WEEKDAYS }),
    compute,
    explain
  };
}

// Part B of three: 8 chapter 26 cases, with the helpers they reference.
// Every part repeats the module header so each module imports on its own.
export const cases = [
  {
    template: 'The day three days from now',
    type: 'the-day-three-days-from-now',
    category: 'no-knowledge',
    parse(statement) {
      const orderMatch = statement.match(/Use the order ([^.]+), then repeat/);
      const targetMatch = statement.match(/today is (\w+), what day will it be (\d+) days from now/);
      if (orderMatch === null || targetMatch === null) {
        throw new Error('the weekday order or the day count is missing');
      }
      return { days: orderMatch[1].split(', '), today: targetMatch[1], offset: Number(targetMatch[2]) };
    },
    solve(slots) {
      const index = slots.days.indexOf(slots.today);
      if (index === -1) {
        throw new Error(`the weekday "${slots.today}" is not in the given order`);
      }
      return { day: slots.days[(index + slots.offset) % slots.days.length] };
    },
    render(solution) {
      return `${solution.day}.`;
    },
    compute: [
      'const slots = $slots;',
      'const days = slots.days;',
      'const index = days.indexOf(slots.today);',
      'if (index === -1) { throw new Error("the weekday \\"" + slots.today + "\\" is not in the given order"); }',
      'return days[(index + slots.offset) % days.length] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The problem fixes the cycle ${slots.days.join(' -> ')}, so each weekday is a position in a loop of ${slots.days.length} states.`,
        `Moving ${slots.offset} days forward from ${slots.today} adds ${slots.offset} to that position and keeps the remainder modulo ${slots.days.length}.`,
        `The position that remains names ${solution.day}, and any whole extra week would land on the same weekday again.`
      ];
    }
  },
  {
    template: 'After a whole number of weeks',
    type: 'after-a-whole-number-of-weeks',
    category: 'no-knowledge',
    parse(statement) {
      const dayMatch = statement.match(/If a day is (\w+), what day will it be (\d+) days later/);
      const weekMatch = statement.match(/(\d+) days form one complete week/);
      if (dayMatch === null || weekMatch === null) {
        throw new Error('the weekday or the week length is missing');
      }
      return { day: dayMatch[1], offset: Number(dayMatch[2]), weekLength: Number(weekMatch[1]) };
    },
    solve(slots) {
      const displacement = slots.offset % slots.weekLength;
      if (displacement !== 0) {
        throw new Error(`${slots.offset} days is not a whole number of ${slots.weekLength}-day weeks`);
      }
      return { day: slots.day, weeks: slots.offset / slots.weekLength };
    },
    render(solution) {
      return `${solution.day}.`;
    },
    compute: [
      'const slots = $slots;',
      'const displacement = slots.offset % slots.weekLength;',
      'if (displacement !== 0) { throw new Error(slots.offset + " days is not a whole number of " + slots.weekLength + "-day weeks"); }',
      'return slots.day + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The text gives the week length ${slots.weekLength}, so complete weeks move a date by a multiple of ${slots.weekLength} days.`,
        `${slots.offset} days is ${solution.weeks} complete week${solution.weeks === 1 ? '' : 's'}, and the displacement modulo ${slots.weekLength} is ${slots.offset % slots.weekLength}.`,
        `A displacement of zero leaves the weekday untouched, so the day is still ${solution.day}.`
      ];
    }
  },
  {
    template: 'An event every two days',
    type: 'an-event-every-two-days',
    category: 'no-knowledge',
    parse(statement) {
      const runMatch = statement.match(/days ([\d,\s]+) and continues every (\d+) days/);
      const countMatch = statement.match(/next (\w+) dates/);
      if (runMatch === null || countMatch === null || NUMBER_WORDS[countMatch[1]] === undefined) {
        throw new Error('the known days, the period, or the requested count is missing');
      }
      return {
        days: runMatch[1].split(',').map((value) => Number(value.trim())),
        step: Number(runMatch[2]),
        count: NUMBER_WORDS[countMatch[1]]
      };
    },
    solve(slots) {
      for (let index = 1; index < slots.days.length; index += 1) {
        if (slots.days[index] - slots.days[index - 1] !== slots.step) {
          throw new Error('the days given in the problem are not evenly spaced');
        }
      }
      const last = slots.days[slots.days.length - 1];
      const next = [];
      for (let index = 1; index <= slots.count; index += 1) {
        next.push(last + index * slots.step);
      }
      return { next };
    },
    render(solution) {
      return `${solution.next.join(', ')}.`;
    },
    compute: [
      'const slots = $slots;',
      'for (let index = 1; index < slots.days.length; index += 1) { if (slots.days[index] - slots.days[index - 1] !== slots.step) { throw new Error("the days given in the problem are not evenly spaced"); } }',
      'const last = slots.days[slots.days.length - 1];',
      'const next = [];',
      'for (let index = 1; index <= slots.count; index += 1) {',
      '  next.push(last + index * slots.step);',
      '}',
      'return next.join(", ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The known dates ${slots.days.join(', ')} differ by ${slots.step} each time, which fixes the period of the activity.`,
        `The next dates continue the same arithmetic progression from ${slots.days[slots.days.length - 1]}, adding ${slots.step} day${slots.step === 1 ? '' : 's'} at every step.`,
        `The ${slots.count} requested dates are ${solution.next.join(', ')}, and each of them is exactly ${slots.step} after the one before it.`
      ];
    }
  },
  {
    template: 'Two activities that coincide',
    type: 'two-activities-that-coincide',
    category: 'no-knowledge',
    parse(statement) {
      const aMatch = statement.match(/Activity A occurs every (\d+) days starting on day (\d+)/);
      const bMatch = statement.match(/Activity B occurs every (\d+) days starting on day (\d+)/);
      if (aMatch === null || bMatch === null) {
        throw new Error('the period or the first day of one activity is missing');
      }
      return {
        a: { period: Number(aMatch[1]), start: Number(aMatch[2]) },
        b: { period: Number(bMatch[1]), start: Number(bMatch[2]) }
      };
    },
    solve(slots) {
      const occursOn = (activity, day) => day >= activity.start
        && (day - activity.start) % activity.period === 0;
      const limit = slots.a.start + slots.b.start + slots.a.period * slots.b.period;
      for (let day = 1; day <= limit; day += 1) {
        if (occursOn(slots.a, day) && occursOn(slots.b, day)) {
          return { day };
        }
      }
      throw new Error('the two activities never occur on the same day');
    },
    render(solution) {
      return `Day ${solution.day}.`;
    },
    compute: [
      'const slots = $slots;',
      'const occursOn = (activity, day) => day >= activity.start && (day - activity.start) % activity.period === 0;',
      'const limit = slots.a.start + slots.b.start + slots.a.period * slots.b.period;',
      'let day = 1;',
      'while (day <= limit && !(occursOn(slots.a, day) && occursOn(slots.b, day))) {',
      '  day += 1;',
      '}',
      'if (day > limit) { throw new Error("the two activities never occur on the same day"); }',
      'return "Day " + day + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Activity A is the progression ${slots.a.start}, ${slots.a.start + slots.a.period}, ${slots.a.start + 2 * slots.a.period}, ... and B is ${slots.b.start}, ${slots.b.start + slots.b.period}, ${slots.b.start + 2 * slots.b.period}, ...`,
        'The question asks for the smallest day that belongs to both progressions at once, which is a common element of two arithmetic progressions.',
        `Searching the days in order from 1, bounded by one combined period, finds ${solution.day} as the first day on which both activities fall together.`
      ];
    }
  },
  weekdayCase({
    template: 'A calendar with blocked days',
    type: 'a-calendar-with-blocked-days',
    parse(statement) {
      const blockedMatch = statement.match(/(\w+) and (\w+) are blocked/);
      const boundsMatch = statement.match(/after (\w+), before (\w+)/);
      if (blockedMatch === null || boundsMatch === null) {
        throw new Error('the blocked days or the meeting bounds are missing');
      }
      return { blocked: [blockedMatch[1], blockedMatch[2]], bounds: [boundsMatch[1], boundsMatch[2]] };
    },
    solve(slots) {
      const from = WEEKDAYS.indexOf(slots.bounds[0]);
      const to = WEEKDAYS.indexOf(slots.bounds[1]);
      if (from === -1 || to <= from) {
        throw new Error('the meeting bounds do not match the weekday order');
      }
      const candidates = WEEKDAYS.slice(from + 1, to);
      const open = candidates.filter((day) => !slots.blocked.includes(day));
      if (open.length !== 1) {
        throw new Error(`the constraints leave ${open.length} days instead of one`);
      }
      return { day: open[0], candidates };
    },
    render(solution) {
      return `${solution.day}.`;
    },
    compute: weekdayCompute([
      'const from = days.indexOf(slots.bounds[0]);',
      'const to = days.indexOf(slots.bounds[1]);',
      'if (from === -1 || to <= from) { throw new Error("the meeting bounds do not match the weekday order"); }',
      'const open = days.slice(from + 1, to).filter((day) => !slots.blocked.includes(day));',
      'if (open.length !== 1) { throw new Error("the constraints leave " + open.length + " days instead of one"); }',
      'return open[0] + ".";'
    ]),
    explain(slots, solution) {
      return [
        `"After ${slots.bounds[0]}, before ${slots.bounds[1]}" selects the weekdays strictly between the two bounds on the order carried by the fact table, giving ${solution.candidates.join(', ')}.`,
        `Removing the blocked days ${slots.blocked.join(' and ')} from that list leaves only ${solution.day}.`,
        `One candidate survives every constraint, so the meeting can only be placed on ${solution.day}.`
      ];
    }
  }),
  {
    template: 'Periodicity with a break after every three events',
    type: 'periodicity-with-a-break-after-every-three-events',
    category: 'no-knowledge',
    parse(statement) {
      const operationsMatch = statement.match(/performs (\d+) operations/);
      const restMatch = statement.match(/rests for (\d+) minute/);
      const cycleMatch = statement.match(/cycle is ([O,R, ]+)\./);
      const minuteMatch = statement.match(/in minute (\d+)/);
      if (operationsMatch === null || restMatch === null || cycleMatch === null || minuteMatch === null) {
        throw new Error('the work length, the rest length, the cycle, or the minute is missing');
      }
      return {
        operations: Number(operationsMatch[1]),
        restMinutes: Number(restMatch[1]),
        cycle: cycleMatch[1].split(',').map((symbol) => symbol.trim()),
        minute: Number(minuteMatch[1])
      };
    },
    solve(slots) {
      const built = [
        ...new Array(slots.operations).fill('O'),
        ...new Array(slots.restMinutes).fill('R')
      ];
      if (built.join(',') !== slots.cycle.join(',')) {
        throw new Error('the stated cycle does not match the described operations and rest');
      }
      return { symbol: slots.cycle[(slots.minute - 1) % slots.cycle.length] };
    },
    render(solution) {
      return solution.symbol === 'O' ? 'It performs an operation.' : 'It rests.';
    },
    compute: [
      'const slots = $slots;',
      'const built = new Array(slots.operations).fill("O").concat(new Array(slots.restMinutes).fill("R"));',
      'if (built.join(",") !== slots.cycle.join(",")) { throw new Error("the stated cycle does not match the described operations and rest"); }',
      'const symbol = slots.cycle[(slots.minute - 1) % slots.cycle.length];',
      'return symbol === "O" ? "It performs an operation." : "It rests.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The machine does ${slots.operations} operation${slots.operations === 1 ? '' : 's'} then rests ${slots.restMinutes} minute${slots.restMinutes === 1 ? '' : 's'}, which is the written cycle ${slots.cycle.join(', ')} of length ${slots.cycle.length}.`,
        `Minute 1 is the first operation, so minute ${slots.minute} sits at position ${(slots.minute - 1) % slots.cycle.length + 1}, since ${slots.minute - 1} modulo ${slots.cycle.length} drops the completed cycles.`,
        `Position ${(slots.minute - 1) % slots.cycle.length + 1} holds ${solution.symbol}, so in minute ${slots.minute} it ${solution.symbol === 'O' ? 'performs an operation' : 'rests'}.`
      ];
    }
  },
  {
    template: 'Shift change after four days',
    type: 'shift-change-after-four-days',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/Team (\w+) works (\d+) days, then team (\w+) works (\d+) days/);
      const dayMatch = statement.match(/on day (\d+)/);
      if (match === null || dayMatch === null) {
        throw new Error('the two teams, their block lengths, or the day is missing');
      }
      if (match[2] !== match[4]) {
        throw new Error('the two teams do not work blocks of the same length');
      }
      return { teams: [match[1], match[3]], blockLength: Number(match[2]), day: Number(dayMatch[1]) };
    },
    solve(slots) {
      const block = Math.floor((slots.day - 1) / slots.blockLength) % slots.teams.length;
      return { team: slots.teams[block], block };
    },
    render(solution) {
      return `Team ${solution.team}.`;
    },
    compute: [
      'const slots = $slots;',
      'const block = Math.floor((slots.day - 1) / slots.blockLength) % slots.teams.length;',
      'return "Team " + slots.teams[block] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Team ${slots.teams[0]} takes days 1 through ${slots.blockLength}, then team ${slots.teams[1]} takes the next ${slots.blockLength} days, and the two-block pattern repeats.`,
        `Day ${slots.day} lies in block number ${Math.floor((slots.day - 1) / slots.blockLength) + 1} of the schedule, and the team is that block number reduced modulo ${slots.teams.length}.`,
        `The reduction leaves team ${solution.team} on duty.`
      ];
    }
  },
  weekdayCase({
    template: 'A month with one explicitly added day',
    type: 'a-month-with-one-explicitly-added-day',
    parse(statement) {
      const match = statement.match(/both begin on (\w+): one has (\d+) days and the other (\d+)/);
      if (match === null) {
        throw new Error('the shared first weekday or the two month lengths are missing');
      }
      return { startDay: match[1], lengths: [Number(match[2]), Number(match[3])] };
    },
    solve(slots) {
      const index = WEEKDAYS.indexOf(slots.startDay);
      if (index === -1) {
        throw new Error(`unknown weekday "${slots.startDay}"`);
      }
      return {
        starts: slots.lengths.map((length) => ({
          length,
          shift: length % WEEKDAYS.length,
          day: WEEKDAYS[(index + length % WEEKDAYS.length) % WEEKDAYS.length]
        }))
      };
    },
    render(solution) {
      const [first, second] = solution.starts;
      return `After ${first.length} days: ${first.day}; after ${second.length} days: ${second.day}.`;
    },
    compute: weekdayCompute([
      'const index = days.indexOf(slots.startDay);',
      'if (index === -1) { throw new Error("unknown weekday \\"" + slots.startDay + "\\""); }',
      'const starts = slots.lengths.map((length) => ({',
      '  length,',
      '  day: days[(index + length % days.length) % days.length]',
      '}));',
      'return "After " + starts[0].length + " days: " + starts[0].day + "; after " + starts[1].length + " days: " + starts[1].day + ".";'
    ]),
    explain(slots, solution) {
      const [first, second] = solution.starts;
      return [
        `Both months begin on ${slots.startDay}, so the weekday of the next month differs only by the month length.`,
        `A month of ${first.length} days shifts the weekday by ${first.length} modulo seven, which is ${first.shift}, and ${second.length} days shifts it by ${second.shift}.`,
        `Applying those shifts to ${slots.startDay} in the weekday order from the fact table names ${first.day} after the shorter month and ${second.day} after the longer one; the single added day moves the start by exactly one weekday.`
      ];
    }
  }),
];
