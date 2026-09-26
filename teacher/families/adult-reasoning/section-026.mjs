/**
 * Section 26 of the adult-reasoning course: sleep, rest, and daily rhythm.
 *
 * Every variant prints the same course protocol — a 7 h 30 min target in bed,
 * lights out at 23:00 and rise at 06:30, coffee stopping 8 h before lights
 * out, screens off 45 min before, no morning recovery, a nap of at most 20
 * minutes finished before 15:00, and a fixed departure — plus a plan that
 * drinks coffee at 16:30, stays on the phone until 23:20, goes to bed at
 * 23:40, wants to rise at 07:10, and naps 40 minutes at 15:30. The answer
 * derives the coffee and screen cut-offs from lights out and lists each
 * breach. The variants change the person and the place in the protocol.
 */

import { slugify } from '../../naming.mjs';

const CLOCK = String.raw`(\d{2}):(\d{2})`;
const PROTOCOL_PATTERN = new RegExp(
  String.raw`Target (\d+) h (\d+) min in bed\. Lights out ${CLOCK}, rise ${CLOCK}\. ` +
    String.raw`Coffee stops (\d+) h before lights out\. Screens off (\d+) min before\. ` +
    String.raw`Do not recover in the morning\. Nap ≤(\d+) min, finished before ${CLOCK}\. ` +
    String.raw`Must leave (.+?) at ${CLOCK}\.`
);
const PLAN_PATTERN = new RegExp(
  String.raw`([A-Z][a-z]+) drinks coffee at ${CLOCK}, phone until ${CLOCK}, lights out ${CLOCK}, ` +
    String.raw`wants to rise at ${CLOCK} and nap (\d+) min at ${CLOCK}\.`
);

function minutesOf(hours, minutes) {
  return Number(hours) * 60 + Number(minutes);
}

function parse(statement) {
  const protocol = PROTOCOL_PATTERN.exec(statement);
  const plan = PLAN_PATTERN.exec(statement);
  if (protocol === null || plan === null) {
    throw new Error('the statement does not print the sleep protocol and the plan');
  }
  return {
    targetHours: Number(protocol[1]),
    targetMinutes: Number(protocol[2]),
    lightsOut: minutesOf(protocol[3], protocol[4]),
    rise: minutesOf(protocol[5], protocol[6]),
    coffeeHoursBeforeLightsOut: Number(protocol[7]),
    screenMinutesBeforeLightsOut: Number(protocol[8]),
    napMaxMinutes: Number(protocol[9]),
    napDeadline: minutesOf(protocol[10], protocol[11]),
    leaveAt: minutesOf(protocol[13], protocol[14]),
    departurePlace: protocol[12].trim(),
    person: plan[1],
    planCoffee: minutesOf(plan[2], plan[3]),
    planPhone: minutesOf(plan[4], plan[5]),
    planLightsOut: minutesOf(plan[6], plan[7]),
    planRise: minutesOf(plan[8], plan[9]),
    planNapMinutes: Number(plan[10]),
    planNap: minutesOf(plan[11], plan[12])
  };
}

function clock(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function solve(slots) {
  const coffeeCutoff = slots.lightsOut - slots.coffeeHoursBeforeLightsOut * 60;
  const screenCutoff = slots.lightsOut - slots.screenMinutesBeforeLightsOut;
  const coffeeLate = slots.planCoffee > coffeeCutoff;
  const screenLate = slots.planPhone > screenCutoff;
  const bedtimeMoved = slots.planLightsOut !== slots.lightsOut;
  const risingMoved = slots.planRise !== slots.rise;
  const napLate = slots.planNap > slots.napDeadline;
  const napLong = slots.planNapMinutes > slots.napMaxMinutes;
  if (!coffeeLate && !screenLate && !bedtimeMoved && !risingMoved && !napLate && !napLong) {
    throw new Error('the plan breaks no rule, which is not this section pattern');
  }
  const breaches = [coffeeLate, screenLate, bedtimeMoved, risingMoved, napLate, napLong].filter(Boolean).length;

  const clauses = [];
  clauses.push(
    coffeeLate
      ? `Coffee too late (last would be ${clock(coffeeCutoff)})`
      : `Coffee at ${clock(slots.planCoffee)} is inside the window`
  );
  clauses.push(
    screenLate ? `screen after ${clock(screenCutoff)}` : `screen within the window before lights out`
  );
  if (bedtimeMoved && risingMoved) {
    clauses.push('bedtime and rising moved');
  } else if (bedtimeMoved) {
    clauses.push('bedtime moved');
  } else if (risingMoved) {
    clauses.push('rising moved');
  } else {
    clauses.push('bedtime and rising kept');
  }
  if (napLate && napLong) {
    clauses.push(`nap after ${clock(slots.napDeadline)} and too long`);
  } else if (napLate) {
    clauses.push(`nap after ${clock(slots.napDeadline)}`);
  } else if (napLong) {
    clauses.push('nap too long');
  } else {
    clauses.push('nap inside the rules');
  }

  return {
    coffeeCutoff,
    screenCutoff,
    breaches,
    verdict: breaches >= 4 ? 'At least four breaches.' : `At least ${breaches} breaches.`,
    text: `${clauses.join('; ')}.`
  };
}

function render(solution) {
  return `${solution.text} ${solution.verdict}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const clock = (value) => String(Math.floor(value / 60)).padStart(2, "0") + ":" + String(value % 60).padStart(2, "0");',
  'const coffeeCutoff = slots.lightsOut - slots.coffeeHoursBeforeLightsOut * 60;',
  'const screenCutoff = slots.lightsOut - slots.screenMinutesBeforeLightsOut;',
  'const coffeeLate = slots.planCoffee > coffeeCutoff;',
  'const screenLate = slots.planPhone > screenCutoff;',
  'const bedtimeMoved = slots.planLightsOut !== slots.lightsOut;',
  'const risingMoved = slots.planRise !== slots.rise;',
  'const napLate = slots.planNap > slots.napDeadline;',
  'const napLong = slots.planNapMinutes > slots.napMaxMinutes;',
  'const breaches = [coffeeLate, screenLate, bedtimeMoved, risingMoved, napLate, napLong].filter(Boolean).length;',
  'probe(breaches >= 4, "the plan must break at least four rules for this section pattern");',
  'const clauses = [];',
  'clauses.push(coffeeLate ? "Coffee too late (last would be " + clock(coffeeCutoff) + ")" : "Coffee at " + clock(slots.planCoffee) + " is inside the window");',
  'clauses.push(screenLate ? "screen after " + clock(screenCutoff) : "screen within the window before lights out");',
  'if (bedtimeMoved && risingMoved) { clauses.push("bedtime and rising moved"); }',
  'else if (bedtimeMoved) { clauses.push("bedtime moved"); }',
  'else if (risingMoved) { clauses.push("rising moved"); }',
  'else { clauses.push("bedtime and rising kept"); }',
  'if (napLate && napLong) { clauses.push("nap after " + clock(slots.napDeadline) + " and too long"); }',
  'else if (napLate) { clauses.push("nap after " + clock(slots.napDeadline)); }',
  'else if (napLong) { clauses.push("nap too long"); }',
  'else { clauses.push("nap inside the rules"); }',
  'const verdict = breaches >= 4 ? "At least four breaches." : "At least " + breaches + " breaches.";',
  'return clauses.join("; ") + ". " + verdict;'
].join('\n');

function explain(slots, solution) {
  return [
    `The protocol fixes lights out at ${clock(slots.lightsOut)}, so coffee stops ${slots.coffeeHoursBeforeLightsOut} h earlier, by ${clock(solution.coffeeCutoff)}, and screens go off ${slots.screenMinutesBeforeLightsOut} min earlier, by ${clock(solution.screenCutoff)}.`,
    `${slots.person} drinks coffee at ${clock(slots.planCoffee)} and stays on the phone until ${clock(slots.planPhone)}, so both windows are missed.`,
    `The plan also moves lights out to ${clock(slots.planLightsOut)} and the rise to ${clock(slots.planRise)}, and it naps ${slots.planNapMinutes} min at ${clock(slots.planNap)}, after the ${clock(slots.napDeadline)} deadline and longer than the ${slots.napMaxMinutes} min allowed.`,
    `The target of ${slots.targetHours} h ${slots.targetMinutes} min in bed is not an average to be traded across the week, so the breaches stand on their own, and rising at ${clock(slots.planRise)} leaves only ${slots.leaveAt - slots.planRise} min before the ${clock(slots.leaveAt)} departure from ${slots.departurePlace}.`
  ];
}

export const unit = 26;

export const cases = [
  {
    template: 'Sleep, rest, and daily rhythm',
    type: slugify('Sleep, rest, and daily rhythm'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
