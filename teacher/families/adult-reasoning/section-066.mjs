/**
 * Section 66 of the adult-reasoning course: bus and train timetables.
 *
 * Every variant prints the same timetable — four morning departures between two
 * stops, a fixed ride duration, a last-boarding margin before departure, and a
 * Monday departure that does not run — then one person reaching the stop on a
 * Monday a minute before or after the last boarding of the departure the
 * question names. The verdict repeats the last boarding hour and either the
 * halt arrival of the caught service or the lateness plus the removed Monday
 * service. The cases change the stops, the person, and the minute of arrival,
 * so the family compares the parsed arrival against the derived last boarding.
 */

import { slugify } from '../../naming.mjs';

const TIMETABLE_PATTERN = /Timetable (.+?) → (.+?): ((?:\d{1,2}:\d{2})(?:, \d{1,2}:\d{2})*)\./;
const DURATION_PATTERN = /Duration (\d+) min\./;
const BOARDING_PATTERN = /Last boarding: (\d+) minutes before departure\./;
const MISSING_PATTERN = /Mondays there is NO (\d{1,2}:\d{2})\./;
const REACH_PATTERN = /([A-Z][a-z]+) reaches the stop Monday at (\d{1,2}:\d{2})\./;
const QUESTION_PATTERN = /Question\. Do they catch the (\d{1,2}:\d{2}) on Monday, arriving at (\d{1,2}:\d{2})\?/;

function minutesOf(time) {
  return Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
}

function formatTime(totalMinutes) {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(wrapped / 60)).padStart(2, '0')}:${String(wrapped % 60).padStart(2, '0')}`;
}

function parse(statement) {
  const timetable = TIMETABLE_PATTERN.exec(statement);
  const duration = DURATION_PATTERN.exec(statement);
  const boarding = BOARDING_PATTERN.exec(statement);
  const missing = MISSING_PATTERN.exec(statement);
  const reach = REACH_PATTERN.exec(statement);
  const question = QUESTION_PATTERN.exec(statement);
  if (
    timetable === null ||
    duration === null ||
    boarding === null ||
    missing === null ||
    reach === null ||
    question === null
  ) {
    throw new Error('the statement does not print the timetable, its margins, the person, and the asked departure');
  }
  const departures = timetable[3].split(', ');
  if (reach[2] !== question[2]) {
    throw new Error('the hour the person reaches the stop must be the hour the question asks about');
  }
  const destination = timetable[2];
  return {
    origin: timetable[1],
    destination,
    destinationWord: destination.slice(destination.lastIndexOf(' ') + 1),
    departures,
    durationMinutes: Number(duration[1]),
    boardingMinutes: Number(boarding[1]),
    missingDeparture: missing[1],
    person: reach[1],
    arrivalTime: reach[2],
    arrivalMinutes: minutesOf(reach[2]),
    askedDeparture: question[1],
    askedDepartureMinutes: minutesOf(question[1])
  };
}

function solve(slots) {
  if (!slots.departures.includes(slots.askedDeparture)) {
    throw new Error(`the timetable does not list the asked departure ${slots.askedDeparture}`);
  }
  if (slots.departures.includes(slots.missingDeparture)) {
    throw new Error('the departure the statement removes on Mondays must not also be printed in the timetable');
  }
  if (slots.boardingMinutes >= slots.durationMinutes) {
    throw new Error('the last-boarding margin must be smaller than the ride duration for the section to hold');
  }
  const lastBoardingMinutes = slots.askedDepartureMinutes - slots.boardingMinutes;
  const haltMinutes = slots.askedDepartureMinutes + slots.durationMinutes;
  const catches = slots.arrivalMinutes <= lastBoardingMinutes;
  return {
    catches,
    lastBoardingMinutes,
    haltMinutes,
    verdictClause: catches ? 'Yes.' : 'No.',
    boardingClause: `Last boarding ${formatTime(lastBoardingMinutes)}.`,
    outcomeClause: catches
      ? `${slots.destinationWord} arrival ${formatTime(haltMinutes)}.`
      : `${slots.arrivalTime} is late. There is no ${slots.missingDeparture} on Monday.`
  };
}

function render(solution) {
  return `${solution.verdictClause} ${solution.boardingClause} ${solution.outcomeClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const formatTime = (totalMinutes) => {',
  '  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;',
  '  return String(Math.floor(wrapped / 60)).padStart(2, "0") + ":" + String(wrapped % 60).padStart(2, "0");',
  '};',
  'const lastBoardingMinutes = slots.askedDepartureMinutes - slots.boardingMinutes;',
  'probe(lastBoardingMinutes > 0, "the last boarding of the asked departure must fall inside the day");',
  'const haltMinutes = slots.askedDepartureMinutes + slots.durationMinutes;',
  'const catches = slots.arrivalMinutes <= lastBoardingMinutes;',
  'const destinationWord = slots.destination.slice(slots.destination.lastIndexOf(" ") + 1);',
  'const verdictClause = catches ? "Yes." : "No.";',
  'const boardingClause = "Last boarding " + formatTime(lastBoardingMinutes) + ".";',
  'const outcomeClause = catches',
  '  ? destinationWord + " arrival " + formatTime(haltMinutes) + "."',
  '  : slots.arrivalTime + " is late. There is no " + slots.missingDeparture + " on Monday.";',
  'return verdictClause + " " + boardingClause + " " + outcomeClause;'
].join('\n');

function explain(slots, solution) {
  const margin = solution.catches ? solution.lastBoardingMinutes - slots.arrivalMinutes : slots.arrivalMinutes - solution.lastBoardingMinutes;
  return [
    `Last boarding for the ${slots.askedDeparture} departure is ${slots.boardingMinutes} minutes before it, that is ${formatTime(solution.lastBoardingMinutes)}, and ${slots.person} reaches the ${slots.origin} stop at ${slots.arrivalTime}.`,
    solution.catches
      ? `The arrival is ${margin} minutes before last boarding, so the ${slots.askedDeparture} is caught and the ${slots.durationMinutes}-minute ride puts them in ${slots.destination} at ${formatTime(solution.haltMinutes)}.`
      : `The arrival is ${margin} minutes past last boarding, so the ${slots.askedDeparture} is missed.`,
    `The statement also removes the ${slots.missingDeparture} service on Mondays, so no later departure of the printed timetable stands in for the missed one.`
  ];
}

export const unit = 66;

export const cases = [
  {
    template: 'Bus and train timetables',
    type: slugify('Bus and train timetables'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
