/**
 * Families for chapter 15 of the mathematical seed book: time, routes, and
 * scheduling.
 *
 * Five printed templates. `Choose the Shortest Route` and `Transport in
 * Multiple Trips` are pure comparisons and divisions, and `Schedule and
 * Duration` states its own `1 hour = 60 minutes` rule, so those cases are
 * `no-knowledge`. `Latest Starting Time` and `Events at Equal Intervals` never
 * state the clock convention, so their circuits materialize the base-60 fact
 * table on a `@facts literal` wire and read it as `$facts`.
 */

export const unit = 15;

const CLOCK_FACTS = '{"minutesPerHour": 60}';

function clockText(totalMinutes, perHour) {
  return `${Math.floor(totalMinutes / perHour)}:${String(totalMinutes % perHour).padStart(2, '0')}`;
}

export const cases = [
  {
    template: 'Schedule and Duration',
    type: 'schedule-and-duration',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/starts at (\d+):(\d+) and lasts (\d+) minutes/);
      if (match === null) {
        throw new Error('the start time or the duration is missing');
      }
      return { hours: Number(match[1]), minutes: Number(match[2]), duration: Number(match[3]) };
    },
    solve(slots) {
      const end = slots.hours * 60 + slots.minutes + slots.duration;
      return { hours: Math.floor(end / 60), minutes: end % 60 };
    },
    render(solution) {
      return clockText(solution.hours * 60 + solution.minutes, 60);
    },
    compute: [
      'const slots = $slots;',
      'const end = slots.hours * 60 + slots.minutes + slots.duration;',
      'return String(Math.floor(end / 60)) + ":" + String(end % 60).padStart(2, "0");'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement supplies the rule it needs: 1 hour = 60 minutes, and the start time may be converted into minutes counted from 0:00.',
        `The start ${slots.hours}:${String(slots.minutes).padStart(2, '0')} becomes ${slots.hours * 60 + slots.minutes} minutes, and adding the ${slots.duration} minutes gives ${slots.hours * 60 + slots.minutes + slots.duration} minutes.`,
        `Converting that total back into hours and minutes gives ${solution.hours}:${String(solution.minutes).padStart(2, '0')}, the answer.`
      ];
    }
  },
  {
    template: 'Latest Starting Time',
    type: 'latest-starting-time',
    category: 'knowledge',
    parse(statement) {
      const match = statement.match(/finished by (\d+):(\d+) and lasts exactly (\d+) minutes/);
      if (match === null) {
        throw new Error('the deadline or the duration is missing');
      }
      return { hours: Number(match[1]), minutes: Number(match[2]), duration: Number(match[3]) };
    },
    solve(slots) {
      const deadline = slots.hours * 60 + slots.minutes;
      const start = deadline - slots.duration;
      if (start < 0) {
        throw new Error('the activity does not fit inside the day');
      }
      return { hours: Math.floor(start / 60), minutes: start % 60 };
    },
    render(solution) {
      return clockText(solution.hours * 60 + solution.minutes, 60);
    },
    facts: CLOCK_FACTS,
    compute: [
      'const slots = $slots;',
      'const perHour = $facts.minutesPerHour;',
      'const start = slots.hours * perHour + slots.minutes - slots.duration;',
      'if (start < 0) {',
      '  throw new Error("the activity does not fit inside the day");',
      '}',
      'return String(Math.floor(start / perHour)) + ":" + String(start % perHour).padStart(2, "0");'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'This problem states only how to move backward: subtract the full duration from the deadline. The clock itself, with 60 minutes in an hour, is a convention the text never spells out, so the circuit carries it on a facts wire.',
        `The deadline ${slots.hours}:${String(slots.minutes).padStart(2, '0')} is ${slots.hours * 60 + slots.minutes} minutes, and the activity occupies the ${slots.duration} minutes just before it.`,
        `Subtracting gives ${slots.hours * 60 + slots.minutes - slots.duration} minutes, which is ${solution.hours}:${String(solution.minutes).padStart(2, '0')} — the latest start that still finishes on time.`
      ];
    }
  },
  {
    template: 'Choose the Shortest Route',
    type: 'choose-the-shortest-route',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/lengths (\d+) m, (\d+) m, and (\d+) m/);
      if (match === null) {
        throw new Error('the three route lengths are missing');
      }
      return { lengths: [Number(match[1]), Number(match[2]), Number(match[3])] };
    },
    solve(slots) {
      let best = 0;
      for (let index = 1; index < slots.lengths.length; index += 1) {
        if (slots.lengths[index] < slots.lengths[best]) {
          best = index;
        }
      }
      const longest = Math.max(...slots.lengths);
      return { route: best + 1, advantage: longest - slots.lengths[best] };
    },
    render(solution) {
      return `Route ${solution.route}; ${solution.advantage} m shorter than the longest.`;
    },
    compute: [
      'const slots = $slots;',
      'let best = 0;',
      'for (let index = 1; index < slots.lengths.length; index += 1) {',
      '  if (slots.lengths[index] < slots.lengths[best]) { best = index; }',
      '}',
      'const longest = Math.max(...slots.lengths);',
      'return "Route " + (best + 1) + "; " + (longest - slots.lengths[best]) + " m shorter than the longest.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement defines "shortest" as the route with the smallest total length, so the task is a minimum over three numbers and then a comparison with the maximum.',
        `Scanning the lengths ${slots.lengths.join(' m, ')} m keeps the smallest value, ${slots.lengths[solution.route - 1]} m, which belongs to route ${solution.route}.`,
        `The longest route is ${Math.max(...slots.lengths)} m, so choosing route ${solution.route} saves the difference, ${solution.advantage} m.`
      ];
    }
  },
  {
    template: 'Events at Equal Intervals',
    type: 'events-at-equal-intervals',
    category: 'knowledge',
    parse(statement) {
      const start = statement.match(/first bus leaves at (\d+):(\d+)\. The next buses leave every (\d+) minutes/);
      const asked = statement.match(/does the (\d+)\w* departure occur/);
      if (start === null || asked === null) {
        throw new Error('the first departure, the interval, or the asked departure is missing');
      }
      return {
        hours: Number(start[1]),
        minutes: Number(start[2]),
        interval: Number(start[3]),
        index: Number(asked[1])
      };
    },
    solve(slots) {
      const departure = slots.hours * 60 + slots.minutes + (slots.index - 1) * slots.interval;
      return { hours: Math.floor(departure / 60), minutes: departure % 60 };
    },
    render(solution) {
      return clockText(solution.hours * 60 + solution.minutes, 60);
    },
    facts: CLOCK_FACTS,
    compute: [
      'const slots = $slots;',
      'const perHour = $facts.minutesPerHour;',
      'const departure = slots.hours * perHour + slots.minutes + (slots.index - 1) * slots.interval;',
      'return String(Math.floor(departure / perHour)) + ":" + String(departure % perHour).padStart(2, "0");'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The departures are equally spaced, so the time of the k-th one is the first departure plus k−1 intervals. The statement never states the clock convention, so the 60-minutes-per-hour fact travels on the facts wire.',
        `The first bus leaves at ${slots.hours}:${String(slots.minutes).padStart(2, '0')}, and the wanted departure is number ${slots.index}, so it is ${slots.index - 1} intervals after the first.`,
        `Adding ${slots.index - 1}×${slots.interval} minutes gives ${solution.hours}:${String(solution.minutes).padStart(2, '0')}, the departure time asked for.`
      ];
    }
  },
  {
    template: 'Transport in Multiple Trips',
    type: 'transport-in-multiple-trips',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/(\d+) people must be transported\. A vehicle can take at most (\d+) people per trip/);
      if (match === null) {
        throw new Error('the number of people or the trip capacity is missing');
      }
      return { people: Number(match[1]), capacity: Number(match[2]) };
    },
    solve(slots) {
      const fullTrips = Math.floor(slots.people / slots.capacity);
      const remainder = slots.people % slots.capacity;
      return { trips: remainder === 0 ? fullTrips : fullTrips + 1 };
    },
    render(solution) {
      return `${solution.trips} trips.`;
    },
    compute: [
      'const slots = $slots;',
      'return String(Math.ceil(slots.people / slots.capacity)) + " trips.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement gives the rule: fill whole trips as far as possible, and add one more trip if anybody is left over.',
        `${slots.people} people divide into ${Math.floor(slots.people / slots.capacity)} full trips of ${slots.capacity} with ${slots.people % slots.capacity} people left over.`,
        `Because any remainder still has to travel, the last group forces one extra trip, giving ${solution.trips} trips in total.`
      ];
    }
  }
];
