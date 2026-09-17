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

function toMinutes(text) {
  const [hours, minutes] = String(text).split(':');
  return Number(hours) * 60 + Number(minutes);
}

function formatClock(minutes) {
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
}

/**
 * Reads a comma-separated list of numbers out of a captured statement fragment,
 * dropping the empty entries a trailing separator leaves behind.
 */
function readNumberList(text) {
  return String(text)
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value !== '')
    .map((value) => Number(value));
}

function greatestCommonDivisor(left, right) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

// Part C of three: 9 chapter 26 cases, with the helpers they reference.
// Every part repeats the module header so each module imports on its own.
export const cases = [
  {
    template: 'A cycle of three tasks',
    type: 'a-cycle-of-three-tasks',
    category: 'no-knowledge',
    parse(statement) {
      const cycleMatch = statement.match(/repeats ([A-Za-z, ]+)\.\.\./);
      const stepMatch = statement.match(/at step (\d+)/);
      if (cycleMatch === null || stepMatch === null) {
        throw new Error('the repeated sequence or the step number is missing');
      }
      const tokens = cycleMatch[1].split(',').map((token) => token.trim()).filter((token) => token !== '');
      if (tokens.length === 0) {
        throw new Error('the repeated sequence is empty');
      }
      let period = tokens.length;
      for (let candidate = 1; candidate < tokens.length; candidate += 1) {
        if (tokens.every((token, index) => token === tokens[index % candidate])) {
          period = candidate;
          break;
        }
      }
      return { cycle: tokens.slice(0, period), step: Number(stepMatch[1]) };
    },
    solve(slots) {
      return { task: slots.cycle[(slots.step - 1) % slots.cycle.length] };
    },
    render(solution) {
      return `${solution.task}.`;
    },
    compute: [
      'const slots = $slots;',
      'return slots.cycle[(slots.step - 1) % slots.cycle.length] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The written sequence repeats, and the shortest block that is copied over and over is ${slots.cycle.join(', ')}, of length ${slots.cycle.length}.`,
        `Step ${slots.step} has the same task as position ${(slots.step - 1) % slots.cycle.length + 1} of that block, because ${slots.step - 1} modulo ${slots.cycle.length} removes the completed blocks.`,
        `Position ${(slots.step - 1) % slots.cycle.length + 1} holds ${solution.task}.`
      ];
    }
  },
  {
    template: 'A schedule with a defined weekend',
    type: 'a-schedule-with-a-defined-weekend',
    category: 'no-knowledge',
    parse(statement) {
      const weekendMatch = statement.match(/Define the weekend as (\w+) and (\w+)/);
      const dayMatch = statement.match(/chosen date is (\w+)/);
      if (weekendMatch === null || dayMatch === null) {
        throw new Error('the weekend definition or the chosen date is missing');
      }
      return { weekend: [weekendMatch[1], weekendMatch[2]], day: dayMatch[1] };
    },
    solve(slots) {
      return { allowed: !slots.weekend.includes(slots.day) };
    },
    render(solution) {
      return solution.allowed ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'return (slots.weekend.includes(slots.day) ? "No" : "Yes") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The problem defines the weekend itself as ${slots.weekend.join(' and ')}, so no outside calendar knowledge is needed here.`,
        `The activity only runs on days outside that set, which is a plain membership test on ${slots.day}.`,
        `${slots.day} ${solution.allowed ? 'is not' : 'is'} a weekend day, so the activity ${solution.allowed ? 'can' : 'cannot'} take place.`
      ];
    }
  },
  {
    template: 'Overlapping time intervals',
    type: 'overlapping-time-intervals',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/occupies (\d{1,2}:\d{2})–(\d{1,2}:\d{2}), and B occupies (\d{1,2}:\d{2})–(\d{1,2}:\d{2})/);
      if (match === null) {
        throw new Error('the two time intervals are missing');
      }
      return { a: [match[1], match[2]], b: [match[3], match[4]] };
    },
    solve(slots) {
      const shared = Math.min(toMinutes(slots.a[1]), toMinutes(slots.b[1]))
        - Math.max(toMinutes(slots.a[0]), toMinutes(slots.b[0]));
      return { overlap: shared > 0, shared };
    },
    render(solution) {
      return solution.overlap ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'const minutes = (text) => { const parts = String(text).split(":"); return Number(parts[0]) * 60 + Number(parts[1]); };',
      'const shared = Math.min(minutes(slots.a[1]), minutes(slots.b[1])) - Math.max(minutes(slots.a[0]), minutes(slots.b[0]));',
      'return (shared > 0 ? "Yes" : "No") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each activity is an interval, ${slots.a[0]}–${slots.a[1]} for A and ${slots.b[0]}–${slots.b[1]} for B.`,
        `The times belonging to both are the interval from the later start to the earlier end, which lasts ${solution.shared} minute${solution.shared === 1 ? '' : 's'}.`,
        `That shared stretch is ${solution.shared > 0 ? 'longer than zero' : 'not longer than zero'}, so the two activities ${solution.overlap ? 'do' : 'do not'} overlap.`
      ];
    }
  },
  {
    template: 'Intervals that only touch',
    type: 'intervals-that-only-touch',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/A ends at (\d{1,2}:\d{2}), and B begins exactly at (\d{1,2}:\d{2})/);
      if (match === null) {
        throw new Error('the end of A or the start of B is missing');
      }
      return { aEnd: match[1], bStart: match[2] };
    },
    solve(slots) {
      const shared = Math.max(0, toMinutes(slots.aEnd) - toMinutes(slots.bStart));
      return { overlap: shared > 0, shared };
    },
    render(solution) {
      return solution.overlap ? 'Yes.' : 'No, according to the given definition.';
    },
    compute: [
      'const slots = $slots;',
      'const minutes = (text) => { const parts = String(text).split(":"); return Number(parts[0]) * 60 + Number(parts[1]); };',
      'const shared = Math.max(0, minutes(slots.aEnd) - minutes(slots.bStart));',
      'return (shared > 0 ? "Yes" : "No, according to the given definition") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A runs up to ${slots.aEnd} and B starts exactly at ${slots.bStart}, so the two intervals meet at that single instant.`,
        `The problem defines overlap as a positive amount of shared running time, and here that duration is ${solution.shared} minute${solution.shared === 1 ? '' : 's'}.`,
        `A single instant is not a positive amount of time, so by the given definition the activities do not overlap.`
      ];
    }
  },
  {
    template: 'Three activities and a free window',
    type: 'three-activities-and-a-free-window',
    category: 'no-knowledge',
    parse(statement) {
      const listMatch = statement.match(/Busy intervals are ([^.]+)\./);
      const windowMatch = statement.match(/between (\d{1,2}:\d{2}) and (\d{1,2}:\d{2})/);
      const needMatch = statement.match(/(\d+)-minute break/);
      if (listMatch === null || windowMatch === null || needMatch === null) {
        throw new Error('the busy intervals, the window, or the break length is missing');
      }
      const busy = [...listMatch[1].matchAll(/(\d{1,2}:\d{2})–(\d{1,2}:\d{2})/g)]
        .map((match) => [match[1], match[2]]);
      if (busy.length === 0) {
        throw new Error('no busy interval could be read');
      }
      return { busy, window: [windowMatch[1], windowMatch[2]], need: Number(needMatch[1]) };
    },
    solve(slots) {
      const busy = slots.busy
        .map(([start, end]) => [toMinutes(start), toMinutes(end)])
        .sort((left, right) => left[0] - right[0]);
      const windowEnd = toMinutes(slots.window[1]);
      let cursor = toMinutes(slots.window[0]);
      for (const [start, end] of busy) {
        if (start - cursor >= slots.need) {
          return { start: cursor, end: start };
        }
        if (end > cursor) {
          cursor = end;
        }
      }
      if (windowEnd - cursor >= slots.need) {
        return { start: cursor, end: windowEnd };
      }
      throw new Error('no free window is long enough');
    },
    render(solution) {
      return `${formatClock(solution.start)}–${formatClock(solution.end)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const minutes = (text) => { const parts = String(text).split(":"); return Number(parts[0]) * 60 + Number(parts[1]); };',
      'const clock = (value) => Math.floor(value / 60) + ":" + String(value % 60).padStart(2, "0");',
      'const busy = slots.busy.map((interval) => [minutes(interval[0]), minutes(interval[1])]).sort((left, right) => left[0] - right[0]);',
      'const windowEnd = minutes(slots.window[1]);',
      'let cursor = minutes(slots.window[0]);',
      'let found = null;',
      'for (const [start, end] of busy) {',
      '  if (start - cursor >= slots.need) { found = [cursor, start]; break; }',
      '  if (end > cursor) { cursor = end; }',
      '}',
      'if (found === null && windowEnd - cursor >= slots.need) { found = [cursor, windowEnd]; }',
      'if (found === null) { throw new Error("no free window is long enough"); }',
      'return clock(found[0]) + "–" + clock(found[1]) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The busy intervals ${slots.busy.map(([start, end]) => `${start}–${end}`).join(', ')} carve the window ${slots.window[0]}–${slots.window[1]} into free stretches between them.`,
        `Walking the busy intervals in time order and keeping the furthest end seen so far gives each free stretch as the place where the next activity starts after the previous one ended.`,
        `The first stretch whose length reaches ${slots.need} minutes is ${formatClock(solution.start)}–${formatClock(solution.end)}.`
      ];
    }
  },
  {
    template: 'How many occurrences by a date?',
    type: 'how-many-occurrences-by-a-date',
    category: 'no-knowledge',
    parse(statement) {
      const daysMatch = statement.match(/days ([\d,]+?)\.\.\./);
      const stepMatch = statement.match(/every (\d+) days/);
      const limitMatch = statement.match(/including day (\d+)/);
      if (daysMatch === null || stepMatch === null || limitMatch === null) {
        throw new Error('the listed days, the period, or the last day is missing');
      }
      return {
        days: readNumberList(daysMatch[1]),
        step: Number(stepMatch[1]),
        limit: Number(limitMatch[1])
      };
    },
    solve(slots) {
      for (let index = 1; index < slots.days.length; index += 1) {
        if (slots.days[index] - slots.days[index - 1] !== slots.step) {
          throw new Error('the listed inspection days are not evenly spaced');
        }
      }
      const first = slots.days[0];
      if (slots.limit < first) {
        return { count: 0 };
      }
      return { count: Math.floor((slots.limit - first) / slots.step) + 1 };
    },
    render(solution) {
      return `${solution.count} inspection${solution.count === 1 ? '' : 's'}.`;
    },
    compute: [
      'const slots = $slots;',
      'for (let index = 1; index < slots.days.length; index += 1) { if (slots.days[index] - slots.days[index - 1] !== slots.step) { throw new Error("the listed inspection days are not evenly spaced"); } }',
      'const first = slots.days[0];',
      'const count = slots.limit < first ? 0 : Math.floor((slots.limit - first) / slots.step) + 1;',
      'return count + " inspection" + (count === 1 ? "" : "s") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The inspections form the arithmetic progression ${slots.days.join(', ')}, ..., with period ${slots.step} days.`,
        `Counting the terms up to and including day ${slots.limit} means finding how many whole periods of ${slots.step} fit between the first inspection on day ${slots.days[0]} and that day.`,
        `${slots.limit - slots.days[0]} days fit ${solution.count - 1} whole period${solution.count - 1 === 1 ? '' : 's'} after the first term, so ${solution.count} inspection${solution.count === 1 ? '' : 's'} occur in total.`
      ];
    }
  },
  {
    template: 'The first occurrence after a threshold',
    type: 'the-first-occurrence-after-a-threshold',
    category: 'no-knowledge',
    parse(statement) {
      const listMatch = statement.match(/minutes ([\d, ]+)\.\.\./);
      const afterMatch = statement.match(/strictly after minute (\d+)/);
      if (listMatch === null || afterMatch === null) {
        throw new Error('the listed minutes or the threshold is missing');
      }
      const minutes = readNumberList(listMatch[1]);
      if (minutes.length < 2) {
        throw new Error('the departure list does not show the step');
      }
      return { minutes, step: minutes[1] - minutes[0], after: Number(afterMatch[1]) };
    },
    solve(slots) {
      if (slots.step <= 0) {
        throw new Error('the departures are not increasing');
      }
      let minute = slots.minutes[0];
      while (minute <= slots.after) {
        minute += slots.step;
      }
      return { minute };
    },
    render(solution) {
      return `Minute ${solution.minute}.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.step <= 0) { throw new Error("the departures are not increasing"); }',
      'let minute = slots.minutes[0];',
      'while (minute <= slots.after) { minute += slots.step; }',
      'return "Minute " + minute + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The departures are the multiples ${slots.minutes.join(', ')}, ..., so they are one arithmetic progression with period ${slots.step} minutes.`,
        `Every departure at or before minute ${slots.after} is removed, leaving only departures strictly later than the threshold.`,
        `The first of those is minute ${solution.minute}, since subtracting the period would fall back to or below ${slots.after}.`
      ];
    }
  },
  {
    template: 'Two cycles with different phases',
    type: 'two-cycles-with-different-phases',
    category: 'no-knowledge',
    parse(statement) {
      const aMatch = statement.match(/A occurs on days ([\d,\s]+?)\.\.\./);
      const bMatch = statement.match(/B occurs on days ([\d,\s]+?)\.\.\./);
      const periodMatch = statement.match(/Both have period (\d+)/);
      if (aMatch === null || bMatch === null || periodMatch === null) {
        throw new Error('the two day lists or the shared period is missing');
      }
      return { a: readNumberList(aMatch[1]), b: readNumberList(bMatch[1]), period: Number(periodMatch[1]) };
    },
    solve(slots) {
      const periodA = slots.a[1] - slots.a[0];
      const periodB = slots.b[1] - slots.b[0];
      if (periodA !== slots.period || periodB !== slots.period) {
        throw new Error('the stated period does not match the two day lists');
      }
      const difference = slots.b[0] - slots.a[0];
      return { coincide: difference % greatestCommonDivisor(periodA, periodB) === 0, difference, periodA, periodB };
    },
    render(solution) {
      return solution.coincide ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'const gcd = (left, right) => { let a = Math.abs(left); let b = Math.abs(right); while (b !== 0) { const next = a % b; a = b; b = next; } return a; };',
      'const periodA = slots.a[1] - slots.a[0];',
      'const periodB = slots.b[1] - slots.b[0];',
      'if (periodA !== slots.period || periodB !== slots.period) { throw new Error("the stated period does not match the two day lists"); }',
      'const coincide = (slots.b[0] - slots.a[0]) % gcd(periodA, periodB) === 0;',
      'return (coincide ? "Yes" : "No") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Pattern A starts on day ${slots.a[0]} and repeats every ${solution.periodA} days, while B starts on day ${slots.b[0]} and repeats every ${solution.periodB} days.`,
        `Two such progressions share a day exactly when the offset between their starts is a multiple of the greatest common divisor of the two periods, here ${greatestCommonDivisor(solution.periodA, solution.periodB)}.`,
        `The offset is ${solution.difference}, which is not a multiple of ${greatestCommonDivisor(solution.periodA, solution.periodB)}, so the two patterns keep their phase difference and never coincide.`
      ];
    }
  },
  {
    template: 'Reconstructing the start of a cycle',
    type: 'reconstructing-the-start-of-a-cycle',
    category: 'no-knowledge',
    parse(statement) {
      const cycleMatch = statement.match(/repeats ([A-Z](?:,[A-Z])*)\./);
      const knownMatch = statement.match(/position (\d+) is ([A-Z])/);
      if (cycleMatch === null || knownMatch === null) {
        throw new Error('the cycle or the known position is missing');
      }
      return {
        cycle: cycleMatch[1].split(','),
        position: Number(knownMatch[1]),
        symbol: knownMatch[2]
      };
    },
    solve(slots) {
      const index = (slots.position - 1) % slots.cycle.length;
      if (slots.cycle[index] !== slots.symbol) {
        throw new Error(`position ${slots.position} holds ${slots.cycle[index]}, not ${slots.symbol}`);
      }
      return { symbol: slots.cycle[0], offset: index };
    },
    render(solution) {
      return `${solution.symbol}.`;
    },
    compute: [
      'const slots = $slots;',
      'const index = (slots.position - 1) % slots.cycle.length;',
      'if (slots.cycle[index] !== slots.symbol) { throw new Error("position " + slots.position + " holds " + slots.cycle[index] + ", not " + slots.symbol); }',
      'return slots.cycle[0] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The cycle written as ${slots.cycle.join(', ')} has length ${slots.cycle.length}, so position ${slots.position} uses the same symbol as position ${solution.offset + 1} of the cycle.`,
        `The text says that position ${slots.position} is ${slots.symbol}, and position ${solution.offset + 1} of the written cycle is indeed ${slots.cycle[solution.offset]}, so the written order is consistent.`,
        `Position 1 of the cycle, which is also position 1 of the pattern, is therefore ${solution.symbol}.`
      ];
    }
  }
];
