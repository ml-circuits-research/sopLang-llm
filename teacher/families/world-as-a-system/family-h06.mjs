/**
 * Family H6 of the world seed book: travel through time and space.
 *
 * Every problem states a courier journey (origin, destination, departure hour,
 * distance, average speed) and a council meeting that begins at a printed hour,
 * and asks for the arrival and whether the courier is in time. The arrival is
 * the departure hour plus distance ÷ speed, and the source prints both hours in
 * its own decimal-hour style (`11.0:00`, `16.6:00`): the hour is rounded to one
 * decimal and followed by `:00`. The verdict is derived from the comparison the
 * rules state -- arrival no later than the meeting start means "yes, on time",
 * otherwise "no, the meeting has already begun".
 *
 * The four grades share one computation and one plan: the variants differ in
 * the stated distance, speed, and meeting time, not in the algorithm, so their
 * cases share the same parse, solve, compute, and explain functions and only
 * declare their own printed template.
 */

import { blocksOf, stripCrossDomain } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const JOURNEY_PATTERN = /A courier leaves ([A-Z][A-Za-z]+(?: [A-Z][A-Za-z]+)*) for ([A-Z][A-Za-z]+(?: [A-Z][A-Za-z]+)*) at (\d{1,2}):(\d{2})/;
const DISTANCE_PATTERN = /Distance is (\d+(?:\.\d+)?) km and the stated average speed is (\d+(?:\.\d+)?) km\/h/;
const MEETING_PATTERN = /A council meeting in [A-Z][A-Za-z]+(?: [A-Z][A-Za-z]+)* begins at (\d+(?:\.\d+)?):(\d{2})/;

/** The printed hour style of the book: one decimal place followed by `:00`. */
function formatHour(hour) {
  return `${hour.toFixed(1)}:00`;
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const journey = JOURNEY_PATTERN.exec(facts);
  const distance = DISTANCE_PATTERN.exec(facts);
  const meeting = MEETING_PATTERN.exec(facts);
  if (journey === null || distance === null || meeting === null) {
    throw new Error('the statement does not state a complete courier journey and meeting time');
  }
  const distanceKm = Number(distance[1]);
  const speedKmh = Number(distance[2]);
  if (speedKmh <= 0 || distanceKm <= 0) {
    throw new Error('the stated distance and average speed must be positive');
  }
  return {
    from: journey[1],
    destination: journey[2],
    departureHour: Number(journey[3]) + Number(journey[4]) / 60,
    distanceKm,
    speedKmh,
    meetingHour: Number(meeting[1]) + Number(meeting[2]) / 60
  };
}

function solve(slots) {
  const travelHours = slots.distanceKm / slots.speedKmh;
  // The source works in the printed one-decimal hour grid: it prints the travel
  // time and the arrival rounded to one decimal, and compares in that grid.
  const arrivalHour = Math.round((slots.departureHour + travelHours) * 10) / 10;
  if (!Number.isFinite(arrivalHour)) {
    throw new Error('the stated journey does not yield a finite arrival time');
  }
  return {
    from: slots.from,
    destination: slots.destination,
    departureHour: slots.departureHour,
    travelHours,
    arrivalHour,
    meetingHour: slots.meetingHour,
    onTime: arrivalHour <= slots.meetingHour
  };
}

function render(solution) {
  const verdict = solution.onTime ? 'yes, on time' : 'no, the meeting has already begun';
  return `Arrival at about ${formatHour(solution.arrivalHour)}; ${verdict}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.destination === "string" && slots.destination.length > 0, "the courier journey must name a destination");',
  'probe(typeof slots.departureHour === "number" && Number.isFinite(slots.departureHour), "the courier must depart at a stated hour");',
  'probe(typeof slots.distanceKm === "number" && slots.distanceKm > 0, "the stated distance must be a positive number of kilometres");',
  'probe(typeof slots.speedKmh === "number" && slots.speedKmh > 0, "the stated average speed must be positive");',
  'probe(typeof slots.meetingHour === "number" && Number.isFinite(slots.meetingHour), "the meeting must begin at a stated hour");',
  'const travelHours = slots.distanceKm / slots.speedKmh;',
  'const arrivalHour = Math.round((slots.departureHour + travelHours) * 10) / 10;',
  'probe(Number.isFinite(arrivalHour), "the stated journey must yield a finite arrival time");',
  'const formatHour = (hour) => hour.toFixed(1) + ":00";',
  'const verdict = arrivalHour <= slots.meetingHour ? "yes, on time" : "no, the meeting has already begun";',
  'return "Arrival at about " + formatHour(arrivalHour) + "; " + verdict + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The courier leaves ${slots.from} for ${slots.destination} at ${formatHour(slots.departureHour)}, and travel time is distance divided by speed: ${slots.distanceKm} ÷ ${slots.speedKmh} = ${solution.travelHours.toFixed(1)} hours.`,
    `Arrival time adds the travel time to the departure hour: ${formatHour(slots.departureHour)} + ${solution.travelHours.toFixed(1)} = ${formatHour(solution.arrivalHour)}.`,
    `The rules allow attending from the beginning only when the arrival is no later than the event start, and ${formatHour(solution.arrivalHour)} compared with ${formatHour(slots.meetingHour)} is ${solution.onTime ? 'no later' : 'later'}.`,
    solution.onTime
      ? 'The courier therefore arrives in time and can be present from the beginning.'
      : 'The meeting has already begun when the courier arrives, so attendance from its beginning is not possible.'
  ];
}

function caseFor(grade) {
  const template = `Travel through time and space (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'H6';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
