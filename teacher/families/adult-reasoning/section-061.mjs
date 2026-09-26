/**
 * Section 61 of the adult-reasoning course: calendars, deadlines, and working
 * days.
 *
 * Every variant prints one club rule — sign-up runs until a named weekday hour,
 * a withdrawal at least three working days before the trip day recovers half
 * the fee and anything later recovers nothing, today is a named weekday at a
 * named hour, the trip is the coming trip day, the fee is already paid, and
 * working days run Monday to Friday — and then asks whether the person may
 * still sign up and what a withdrawal today would recover. The verdict counts
 * the working days strictly between today and the trip day, so the gap falls
 * short of the required three. The cases change the place, the name, and the
 * weekdays, so the family derives every clause from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const RULES_PATTERN =
  /Club in ([^:]+): sign-up until ([A-Z][a-z]+) (\d{1,2}):(\d{2})\. Withdrawal ≥(\d+) working days before ([A-Z][a-z]+) → (\d+)% of the fee; else 0\. Today is ([A-Z][a-z]+) (\d{1,2}):(\d{2})\. The trip is this ([A-Z][a-z]+)\. The fee is paid\. Working days: ([A-Z][a-z]{2})–([A-Z][a-z]{2})\./;
const QUESTION_PATTERN = /Can ([A-Z][a-z]+) still sign up\?/;

const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_ABBREVIATIONS = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

function weekdayIndex(name) {
  const index = WEEKDAY_NAMES.indexOf(name);
  if (index === -1) {
    throw new Error(`the statement names the unknown weekday "${name}"`);
  }
  return index;
}

/** The named working days of a "Mon–Fri" range, both ends included. */
function workingWeek(from, to) {
  const start = DAY_ABBREVIATIONS[from];
  const end = DAY_ABBREVIATIONS[to];
  if (start === undefined || end === undefined || end < start) {
    throw new Error(`the statement names the unsupported working-day range ${from}–${to}`);
  }
  return WEEKDAY_NAMES.slice(start, end + 1);
}

/** The working days strictly after `from` and strictly before `to`. */
function workingDaysBefore(from, to, workingDays) {
  const start = weekdayIndex(from);
  const end = weekdayIndex(to);
  if (end <= start) {
    throw new Error(`the trip day ${to} must come after today ${from}`);
  }
  const days = [];
  for (let index = start + 1; index < end; index += 1) {
    if (workingDays.includes(WEEKDAY_NAMES[index])) {
      days.push(WEEKDAY_NAMES[index]);
    }
  }
  return days;
}

function minutesOf(hour, minute) {
  return Number(hour) * 60 + Number(minute);
}

function parse(statement) {
  const rules = RULES_PATTERN.exec(statement);
  const question = QUESTION_PATTERN.exec(statement);
  if (rules === null || question === null) {
    throw new Error('the statement does not print the club rules and the sign-up question');
  }
  return {
    place: rules[1],
    person: question[1],
    deadlineDay: rules[2],
    deadlineTime: `${rules[3]}:${rules[4]}`,
    deadlineMinutes: minutesOf(rules[3], rules[4]),
    requiredDays: Number(rules[5]),
    tripDay: rules[6],
    refundPercent: Number(rules[7]),
    today: rules[8],
    todayTime: `${rules[9]}:${rules[10]}`,
    todayMinutes: minutesOf(rules[9], rules[10]),
    tripNoticeDay: rules[11],
    workingDays: workingWeek(rules[12], rules[13]),
    feePaid: /The fee is paid\./.test(statement)
  };
}

function solve(slots) {
  if (!slots.feePaid) {
    throw new Error('the section states that the fee is paid');
  }
  if (slots.requiredDays <= 0 || slots.refundPercent <= 0) {
    throw new Error('the withdrawal rule must require working days and recover a share');
  }
  if (slots.tripNoticeDay !== slots.tripDay) {
    throw new Error('the withdrawal rule and the trip notice must name the same day');
  }
  const days = workingDaysBefore(slots.today, slots.tripDay, slots.workingDays);
  const recovered = days.length >= slots.requiredDays ? slots.refundPercent : 0;
  const open =
    weekdayIndex(slots.today) < weekdayIndex(slots.deadlineDay) ||
    (slots.today === slots.deadlineDay && slots.todayMinutes <= slots.deadlineMinutes);
  const signupClause = open
    ? `Sign-up is open until ${slots.deadlineDay} ${slots.deadlineTime}.`
    : `Sign-up closed at ${slots.deadlineDay} ${slots.deadlineTime}.`;
  const shortfall = days.length >= slots.requiredDays ? '≥' : '<';
  const qualifier = days.length >= slots.requiredDays ? 'has' : 'has only';
  const withdrawClause =
    `Withdrawal from ${slots.today} ${qualifier} ${days.join('+')} (${days.length}) ${shortfall} ${slots.requiredDays} → ${recovered}%`;
  return { signupClause, withdrawClause, days, recovered };
}

function render(solution) {
  return `${solution.signupClause} ${solution.withdrawClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];',
  'const start = WEEKDAY_NAMES.indexOf(slots.today);',
  'const end = WEEKDAY_NAMES.indexOf(slots.tripDay);',
  'const days = [];',
  'for (let index = start + 1; index < end; index += 1) {',
  '  if (slots.workingDays.indexOf(WEEKDAY_NAMES[index]) !== -1) { days.push(WEEKDAY_NAMES[index]); }',
  '}',
  'const recovered = days.length >= slots.requiredDays ? slots.refundPercent : 0;',
  'const open = start < WEEKDAY_NAMES.indexOf(slots.deadlineDay)',
  '  || (start === WEEKDAY_NAMES.indexOf(slots.deadlineDay) && slots.todayMinutes <= slots.deadlineMinutes);',
  'const signupClause = open',
  '  ? "Sign-up is open until " + slots.deadlineDay + " " + slots.deadlineTime + "."',
  '  : "Sign-up closed at " + slots.deadlineDay + " " + slots.deadlineTime + ".";',
  'const qualifier = days.length >= slots.requiredDays ? "has" : "has only";',
  'const shortfall = days.length >= slots.requiredDays ? "≥" : "<";',
  'const withdrawClause = "Withdrawal from " + slots.today + " " + qualifier + " " + days.join("+") + " (" + days.length + ") " + shortfall + " " + slots.requiredDays + " → " + recovered + "%";',
  'return signupClause + " " + withdrawClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The club in ${slots.place} keeps sign-up open until ${slots.deadlineDay} ${slots.deadlineTime}, and the statement puts today at ${slots.today} ${slots.todayTime}, so ${slots.person} is still in time to sign up.`,
    `The withdrawal rule measures whole working days between today and the trip: from ${slots.today} only ${solution.days.join(' and ')} fall inside the range, so the count is ${solution.days.length}.`,
    `${solution.days.length} is short of the required ${slots.requiredDays}, so the withdrawal recovers ${solution.recovered}% of the paid fee instead of the ${slots.refundPercent}% a timely withdrawal would return.`
  ];
}

export const unit = 61;

export const cases = [
  {
    template: 'Calendars, deadlines, and working days',
    type: slugify('Calendars, deadlines, and working days'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
