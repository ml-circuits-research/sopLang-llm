/**
 * Section 22 of the adult-reasoning course: use-by dates and storage.
 *
 * Every variant prints the same yoghurt notice: a sealed use-by date, a
 * three-day window after opening, a 2–6 °C storage range, a swollen-lid
 * warning, and a ban on refreezing. The reader opens the pack, stores it at
 * 4 °C with an intact lid, and asks about the last spoon on the 20th or 21st.
 * The verdict applies the earlier of the two clocks: the target day overruns
 * both the sealed date and the window that starts on the opening day. The
 * variants change the person, the opening day, and the target day, so the
 * family derives every number from the parsed notice and plan.
 */

import { slugify } from '../../naming.mjs';

const NOTICE_PATTERN =
  /Use by (\d{2})\.(\d{2})\.(\d{4})\. After opening, within (\d+) days, at (\d+)–(\d+) °C\./;
const PLAN_PATTERN =
  /([A-Z][a-z]+) opens on (\d{2})\.(\d{2})\.(\d{4}), keeps it at (\d+) °C, lid (not swollen|swollen), wants the last spoon on (\d{2})\.(\d{2})\.(\d{4})\./;

function parse(statement) {
  const notice = NOTICE_PATTERN.exec(statement);
  const plan = PLAN_PATTERN.exec(statement);
  if (notice === null || plan === null) {
    throw new Error('the statement does not print the yoghurt notice and the storage plan');
  }
  return {
    sealed: { day: Number(notice[1]), month: Number(notice[2]), year: Number(notice[3]) },
    openWindowDays: Number(notice[4]),
    storageLowC: Number(notice[5]),
    storageHighC: Number(notice[6]),
    person: plan[1],
    opened: { day: Number(plan[2]), month: Number(plan[3]), year: Number(plan[4]) },
    fridgeC: Number(plan[5]),
    lidSwollen: plan[6] === 'swollen',
    target: { day: Number(plan[7]), month: Number(plan[8]), year: Number(plan[9]) }
  };
}

function ordinal(value) {
  const rest = value % 100;
  if (rest >= 11 && rest <= 13) {
    return `${value}th`;
  }
  if (value % 10 === 1) {
    return `${value}st`;
  }
  if (value % 10 === 2) {
    return `${value}nd`;
  }
  if (value % 10 === 3) {
    return `${value}rd`;
  }
  return `${value}th`;
}

function solve(slots) {
  const windowEndDay = slots.opened.day + slots.openWindowDays - 1;
  const expiresFirst = Math.min(slots.sealed.day, windowEndDay);
  if (slots.lidSwollen) {
    throw new Error('a swollen lid closes the case before the dates, which is not this section pattern');
  }
  if (slots.target.day <= expiresFirst) {
    throw new Error('the target day stays inside both clocks, which is not this section pattern');
  }
  return {
    openDay: slots.opened.day,
    windowEndDay,
    openWindowDays: slots.openWindowDays,
    sealedDay: slots.sealed.day,
    allowed: false
  };
}

function render(solution) {
  if (solution.allowed) {
    return `Yes. Opened on the ${ordinal(solution.openDay)} → window ${solution.openDay}–${solution.windowEndDay} (${solution.openWindowDays} days). The target day stays inside both the sealed date (${solution.sealedDay}) and the open window.`;
  }
  return `No. Opened on the ${ordinal(solution.openDay)} → window ${solution.openDay}–${solution.windowEndDay} (${solution.openWindowDays} days). The 20th/21st overruns both the sealed date (${solution.sealedDay}) and the open window.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const ordinal = (value) => {',
  '  const rest = value % 100;',
  '  if (rest >= 11 && rest <= 13) return value + "th";',
  '  if (value % 10 === 1) return value + "st";',
  '  if (value % 10 === 2) return value + "nd";',
  '  if (value % 10 === 3) return value + "rd";',
  '  return value + "th";',
  '};',
  'const windowEndDay = slots.opened.day + slots.openWindowDays - 1;',
  'const expiresFirst = Math.min(slots.sealed.day, windowEndDay);',
  'return "No. Opened on the " + ordinal(slots.opened.day) + " \u2192 window " + slots.opened.day + "\u2013" + windowEndDay + " (" + slots.openWindowDays + " days). The 20th/21st overruns both the sealed date (" + slots.sealed.day + ") and the open window.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.person} opens the pack on ${slots.opened.day}.${String(slots.opened.month).padStart(2, '0')}.${slots.opened.year} and stores it at ${slots.fridgeC} °C, which is inside the ${slots.storageLowC}–${slots.storageHighC} °C range, so the storage and lid conditions of the notice are met.`,
    `The lid date covers a sealed pack and names the ${slots.sealed.day}th, while the open pack is allowed ${slots.openWindowDays} days from opening, that is the window ${solution.openDay}–${solution.windowEndDay}.`,
    `The plan wants the last spoon on the ${slots.target.day}th, which is later than the earlier of the two clocks (${solution.sealedDay}), and the notice applies the one that expires first, so the text does not allow eating it.`,
    'Storage and a sound lid are necessary conditions, not extensions of the date; the notice ends the case at the first of the two clocks.'
  ];
}

export const unit = 22;

export const cases = [
  {
    template: 'Use-by dates and storage',
    type: slugify('Use-by dates and storage'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
