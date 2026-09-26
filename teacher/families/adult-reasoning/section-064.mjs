/**
 * Section 64 of the adult-reasoning course: speed, duration, and distance.
 *
 * Every variant prints the same sheet — distance = speed × time at constant
 * speed — and one person walking a distance at a speed with no pauses from a
 * start hour. The verdict states the duration both as decimal hours and as
 * whole hours and minutes, then the arrival hour. The cases change the person,
 * the speed, and the distance, so the family derives the duration from the
 * parsed quotient and splits it into hours and minutes.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN = /Sheet: distance = speed × time at constant speed\./;
const WALK_PATTERN = /([A-Z][a-z]+) walks (\d+(?:\.\d+)?) km\/h, (\d+(?:\.\d+)?) km, no pauses, start (\d{1,2}):(\d{2})\./;

function formatTime(totalMinutes) {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(wrapped / 60)).padStart(2, '0')}:${String(wrapped % 60).padStart(2, '0')}`;
}

function parse(statement) {
  if (!SHEET_PATTERN.test(statement)) {
    throw new Error('the statement does not print the constant-speed sheet');
  }
  const walk = WALK_PATTERN.exec(statement);
  if (walk === null) {
    throw new Error('the statement does not give the walker, the speed, the distance, and the start hour');
  }
  const speedKmh = Number(walk[2]);
  const distanceKm = Number(walk[3]);
  if (!(speedKmh > 0) || !(distanceKm > 0)) {
    throw new Error('the speed and the distance must be positive quantities');
  }
  return {
    person: walk[1],
    speedKmh,
    distanceKm,
    startTime: `${walk[4]}:${walk[5]}`,
    startMinutes: Number(walk[4]) * 60 + Number(walk[5])
  };
}

function solve(slots) {
  const durationMinutes = Math.round((slots.distanceKm / slots.speedKmh) * 60);
  if (!(durationMinutes > 0)) {
    throw new Error('the printed speed and distance must give a positive walking duration');
  }
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const decimal = (durationMinutes / 60).toFixed(2);
  const arrival = formatTime(slots.startMinutes + durationMinutes);
  return {
    durationMinutes,
    arrival,
    durationClause: `${decimal} h ≈ ${hours} h ${minutes} min.`,
    arrivalClause: `Arrival ${arrival}.`
  };
}

function render(solution) {
  return `${solution.durationClause} ${solution.arrivalClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const durationMinutes = Math.round((slots.distanceKm / slots.speedKmh) * 60);',
  'probe(Number.isInteger(durationMinutes) && durationMinutes > 0, "the sheet must give a positive walking duration");',
  'probe(Math.abs(durationMinutes / 60 - slots.distanceKm / slots.speedKmh) < 1 / 120, "the duration must be the distance divided by the speed");',
  'probe(durationMinutes < 1440, "the walk must fit inside one day for the printed arrival hour");',
  'const formatTime = (totalMinutes) => {',
  '  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;',
  '  return String(Math.floor(wrapped / 60)).padStart(2, "0") + ":" + String(wrapped % 60).padStart(2, "0");',
  '};',
  'const hours = Math.floor(durationMinutes / 60);',
  'const minutes = durationMinutes % 60;',
  'const durationClause = (durationMinutes / 60).toFixed(2) + " h ≈ " + hours + " h " + minutes + " min.";',
  'const arrivalClause = "Arrival " + formatTime(slots.startMinutes + durationMinutes) + ".";',
  'return durationClause + " " + arrivalClause;'
].join('\n');

function explain(slots, solution) {
  const hours = Math.floor(solution.durationMinutes / 60);
  const minutes = solution.durationMinutes % 60;
  return [
    `The sheet fixes distance = speed × time at constant speed, so the walking time is ${slots.distanceKm} ÷ ${slots.speedKmh} = ${(solution.durationMinutes / 60).toFixed(2)} h.`,
    `The stem adds no pause, so that decimal hour is the whole walking time: ${hours} whole hours plus ${minutes} minutes of the remaining part.`,
    `${slots.person} starts at ${slots.startTime}, and adding ${hours} h ${minutes} min gives the printed arrival hour ${solution.arrival}.`
  ];
}

export const unit = 64;

export const cases = [
  {
    template: 'Speed, duration, and distance',
    type: slugify('Speed, duration, and distance'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
