/**
 * Section 50 of the adult-reasoning course: a public counter's opening hours.
 *
 * Every variant posts the same counter notice at a place: the counter opens
 * Monday to Thursday 09:00–15:00 and Friday 09:00–12:00, the last ticket is
 * handed out 30 min before closing, and no ticket at all is issued during the
 * 11:00–11:20 break. The narrative then names one person who asks for a ticket
 * on Friday afternoon and on Monday afternoon, and the verdict reports both
 * attempts against the printed last-ticket times. The cases vary the place, the
 * name, and the two asked-for times, so the family computes both last-ticket
 * times from the parsed closing hours, pulls the last ticket back to the break
 * start when it would fall inside the break, and compares the asked-for times
 * with those limits.
 */

import { slugify } from '../../naming.mjs';

const HOURS_PATTERN =
  /Counter hours, ([^:]+): Mon–Thu (\d{1,2}):(\d{2})–(\d{1,2}):(\d{2}), Friday (\d{1,2}):(\d{2})–(\d{1,2}):(\d{2})\./;
const LEAD_PATTERN = /Last ticket (\d+) min before closing\./;
const BREAK_PATTERN = /Break (\d{1,2}):(\d{2})–(\d{1,2}):(\d{2}), no tickets\./;
const ATTEMPT_PATTERN =
  /([A-Z][a-z]+) wants a ticket Friday (\d{1,2}):(\d{2}) and Monday (\d{1,2}):(\d{2})\./;

function toMinutes(hours, minutes) {
  return Number(hours) * 60 + Number(minutes);
}

function formatTime(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function parse(statement) {
  const hours = HOURS_PATTERN.exec(statement);
  const lead = LEAD_PATTERN.exec(statement);
  const breakTime = BREAK_PATTERN.exec(statement);
  const attempt = ATTEMPT_PATTERN.exec(statement);
  if (hours === null || lead === null || breakTime === null || attempt === null) {
    throw new Error('the statement does not carry the counter hours, the break, and the two attempts');
  }
  return {
    place: hours[1],
    weekdayOpenMinutes: toMinutes(hours[2], hours[3]),
    weekdayCloseMinutes: toMinutes(hours[4], hours[5]),
    fridayOpenMinutes: toMinutes(hours[6], hours[7]),
    fridayCloseMinutes: toMinutes(hours[8], hours[9]),
    lastTicketLeadMinutes: Number(lead[1]),
    breakStartMinutes: toMinutes(breakTime[1], breakTime[2]),
    breakEndMinutes: toMinutes(breakTime[3], breakTime[4]),
    visitor: attempt[1],
    fridayAttemptMinutes: toMinutes(attempt[2], attempt[3]),
    mondayAttemptMinutes: toMinutes(attempt[4], attempt[5])
  };
}

function solve(slots) {
  if (slots.lastTicketLeadMinutes <= 0 || slots.lastTicketLeadMinutes >= slots.fridayCloseMinutes) {
    throw new Error('the last-ticket lead must be a positive time that fits inside the shortest day');
  }
  const inBreak = (time) => time >= slots.breakStartMinutes && time < slots.breakEndMinutes;
  const lastTicket = (closingMinutes) => {
    const candidate = closingMinutes - slots.lastTicketLeadMinutes;
    return inBreak(candidate) ? slots.breakStartMinutes : candidate;
  };
  const fridayLast = lastTicket(slots.fridayCloseMinutes);
  const mondayLast = lastTicket(slots.weekdayCloseMinutes);
  const fridaySucceeds = !inBreak(slots.fridayAttemptMinutes) && slots.fridayAttemptMinutes <= fridayLast;
  const mondaySucceeds = !inBreak(slots.mondayAttemptMinutes) && slots.mondayAttemptMinutes <= mondayLast;
  const verdict =
    fridaySucceeds && mondaySucceeds
      ? 'Both'
      : fridaySucceeds
        ? 'Friday'
        : mondaySucceeds
          ? 'Monday'
          : 'Neither';
  return { verdict, fridayLast, mondayLast };
}

function render(solution) {
  return `${solution.verdict}. Friday last ticket ${formatTime(solution.fridayLast)}. Monday last ticket ${formatTime(solution.mondayLast)}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.visitor === "string" && slots.visitor.length > 0, "the case must name the person asking for a ticket");',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the counter");',
  'probe(slots.fridayCloseMinutes < slots.weekdayCloseMinutes, "the Friday closing time must come before the weekday closing time");',
  'probe(slots.fridayOpenMinutes < slots.fridayCloseMinutes && slots.weekdayOpenMinutes < slots.weekdayCloseMinutes, "each day must close after it opens");',
  'probe(slots.breakStartMinutes < slots.breakEndMinutes, "the break must end after it starts");',
  'probe(slots.lastTicketLeadMinutes > 0 && slots.lastTicketLeadMinutes < slots.fridayCloseMinutes, "the last-ticket lead must fit inside the shortest day");',
  'const formatTime = (totalMinutes) => String(Math.floor(totalMinutes / 60)).padStart(2, "0") + ":" + String(totalMinutes % 60).padStart(2, "0");',
  'const inBreak = (time) => time >= slots.breakStartMinutes && time < slots.breakEndMinutes;',
  'const lastTicket = (closingMinutes) => {',
  '  const candidate = closingMinutes - slots.lastTicketLeadMinutes;',
  '  return inBreak(candidate) ? slots.breakStartMinutes : candidate;',
  '};',
  'const fridayLast = lastTicket(slots.fridayCloseMinutes);',
  'const mondayLast = lastTicket(slots.weekdayCloseMinutes);',
  'const fridaySucceeds = !inBreak(slots.fridayAttemptMinutes) && slots.fridayAttemptMinutes <= fridayLast;',
  'const mondaySucceeds = !inBreak(slots.mondayAttemptMinutes) && slots.mondayAttemptMinutes <= mondayLast;',
  'probe(slots.fridayAttemptMinutes >= slots.fridayOpenMinutes && slots.fridayAttemptMinutes < slots.fridayCloseMinutes, "the Friday attempt must fall inside the opening hours");',
  'probe(slots.mondayAttemptMinutes >= slots.weekdayOpenMinutes && slots.mondayAttemptMinutes < slots.weekdayCloseMinutes, "the Monday attempt must fall inside the opening hours");',
  'const verdict = fridaySucceeds && mondaySucceeds ? "Both" : fridaySucceeds ? "Friday" : mondaySucceeds ? "Monday" : "Neither";',
  'return verdict + ". Friday last ticket " + formatTime(fridayLast) + ". Monday last ticket " + formatTime(mondayLast) + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The counter of ${slots.place} closes at ${formatTime(slots.fridayCloseMinutes)} on Friday and at ${formatTime(slots.weekdayCloseMinutes)} from Monday to Thursday, and the last ticket is handed out ${slots.lastTicketLeadMinutes} min before closing.`,
    `${slots.visitor} asks at ${formatTime(slots.fridayAttemptMinutes)} on Friday and at ${formatTime(slots.mondayAttemptMinutes)} on Monday, and both times are past the printed last-ticket times of ${formatTime(solution.fridayLast)} and ${formatTime(solution.mondayLast)}.`,
    `The ${formatTime(slots.breakStartMinutes)}–${formatTime(slots.breakEndMinutes)} break issues no tickets at all, so it cannot rescue an attempt that the last-ticket rule has already refused.`
  ];
}

export const unit = 50;

export const cases = [
  {
    template: "A public counter's opening hours",
    type: slugify("A public counter's opening hours"),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
