/**
 * Section 43 of the adult-reasoning course: hours, breaks, and overtime.
 *
 * Every variant posts the same time clock — the shift span, the unpaid break,
 * the punch-in threshold after which an arrival is late, the monthly count of
 * lates that earns a written warning, and the rule about extra time after the
 * shift — and then records one week of five punch-ins plus a Saturday the
 * employee offers as compensation. The verdict reads the threshold exactly:
 * the arrivals after it are late, the arrivals at or before it are not, and
 * the Saturday changes nothing because the clock does not count it as a
 * working day. The cases change the place, the person, and the punch-in times,
 * so the family derives the late days, the clean times, and the count word
 * from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const CLOCK_PATTERN =
  /Time clock, ([^:]+): (\d{2}:\d{2})–(\d{2}:\d{2}), break (\d{2}:\d{2})–(\d{2}:\d{2})\. After (\d{2}:\d{2}) = late\. (\d+) lates\/month = written warning\. Extra after (\d{2}:\d{2}) only with a slip\. ([A-Z][a-z]+) is not a working day here\./;
const WEEK_PATTERN =
  /([A-Z][a-z]+): Mon (\d{2}:\d{2}), Tue (\d{2}:\d{2}), Wed (\d{2}:\d{2}), Thu (\d{2}:\d{2}), Fri (\d{2}:\d{2}), ([A-Z][a-z]+) “makes it up”\./;

const COUNT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

function minutesOf(clock) {
  const parts = clock.split(':');
  return Number(parts[0]) * 60 + Number(parts[1]);
}

function countWord(count) {
  if (Number.isInteger(count) && count >= 0 && count < COUNT_WORDS.length) {
    const word = COUNT_WORDS[count];
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  return String(count);
}

function parse(statement) {
  const clock = CLOCK_PATTERN.exec(statement);
  const week = WEEK_PATTERN.exec(statement);
  if (clock === null || week === null) {
    throw new Error('the statement does not print the time clock and the week of punch-ins');
  }
  return {
    place: clock[1],
    shiftFrom: clock[2],
    shiftTo: clock[3],
    breakFrom: clock[4],
    breakTo: clock[5],
    threshold: clock[6],
    warningCount: Number(clock[7]),
    extraAfter: clock[8],
    restDay: clock[9],
    employee: week[1],
    punchIns: [
      { day: 'Mon', clock: week[2] },
      { day: 'Tue', clock: week[3] },
      { day: 'Wed', clock: week[4] },
      { day: 'Thu', clock: week[5] },
      { day: 'Fri', clock: week[6] }
    ],
    makeUpDay: week[7]
  };
}

function solve(slots) {
  const threshold = minutesOf(slots.threshold);
  const late = slots.punchIns.filter((entry) => minutesOf(entry.clock) > threshold);
  const onTime = slots.punchIns.filter((entry) => minutesOf(entry.clock) <= threshold);
  if (late.length === 0 || onTime.length === 0) {
    throw new Error('this section counts both a late arrival and a clean arrival');
  }
  const makeUpClause =
    slots.makeUpDay === slots.restDay
      ? `${slots.makeUpDay} erases nothing: it is not a working day on this clock.`
      : `${slots.makeUpDay} counts as a working day on this clock, so the offer is a real shift.`;
  return {
    threshold: slots.threshold,
    lateDays: late.map((entry) => entry.day),
    lateClocks: late.map((entry) => entry.clock),
    onTimeClocks: onTime.map((entry) => entry.clock),
    countWord: countWord(late.length),
    makeUpClause
  };
}

function render(solution) {
  return `${solution.countWord}: ${solution.lateDays.join(', ')}. ${solution.onTimeClocks.join(' and ')} ≤ ${solution.threshold}. ${solution.makeUpClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const minutesOf = (clock) => {',
  '  const parts = clock.split(":");',
  '  return Number(parts[0]) * 60 + Number(parts[1]);',
  '};',
  'const threshold = minutesOf(slots.threshold);',
  'const late = slots.punchIns.filter((entry) => minutesOf(entry.clock) > threshold);',
  'const onTime = slots.punchIns.filter((entry) => minutesOf(entry.clock) <= threshold);',
  'probe(late.length > 0 && onTime.length > 0, "the week must contain a late arrival and a clean arrival");',
  'probe(late.length + onTime.length === slots.punchIns.length, "every punch-in is either late or clean against the threshold");',
  'const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];',
  'const count = late.length;',
  'const rawWord = count < COUNT_WORDS.length ? COUNT_WORDS[count] : String(count);',
  'const countWord = rawWord.charAt(0).toUpperCase() + rawWord.slice(1);',
  'const lateDays = late.map((entry) => entry.day).join(", ");',
  'const cleanClocks = onTime.map((entry) => entry.clock).join(" and ");',
  'const makeUpClause = slots.makeUpDay === slots.restDay',
  '  ? slots.makeUpDay + " erases nothing: it is not a working day on this clock."',
  '  : slots.makeUpDay + " counts as a working day on this clock, so the offer is a real shift.";',
  'return countWord + ": " + lateDays + ". " + cleanClocks + " ≤ " + slots.threshold + ". " + makeUpClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The clock marks late only after ${slots.threshold}, so ${solution.lateClocks.join(', ')} are late while ${solution.onTimeClocks.join(' and ')} are not.`,
    `That leaves ${solution.countWord} lates on ${solution.lateDays.join(', ')}, which is the printed warning count of ${slots.warningCount} lates/month.`,
    `${solution.makeUpClause} The shift itself runs ${slots.shiftFrom}–${slots.shiftTo} with a break at ${slots.breakFrom}–${slots.breakTo}, and extra time after ${slots.extraAfter} needs a slip.`
  ];
}

export const unit = 43;

export const cases = [
  {
    template: 'Hours, breaks, and overtime',
    type: slugify('Hours, breaks, and overtime'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
