/**
 * Section 62 of the adult-reasoning course: time zones from a given table.
 *
 * Every variant prints the same call table — the home zone R, a zone P one hour
 * ahead of R, and a zone Q two hours behind it — plus a Thursday call hour
 * stated in R. One person sits in the second read zone and sets a local alarm
 * for the call hour, so the verdict names the correct local time in that zone
 * and how far the local alarm misses it. The cases change the place, the call
 * hour, the person, and the zone the person is in, so the family derives the
 * local time and the miss from the parsed offsets rather than from constants.
 */

import { slugify } from '../../naming.mjs';

const TABLE_PATTERN = /Call table: time in (.+?) = ([A-Z])\./;
const ZONE_PATTERN = /Time ([A-Z]) = ([A-Z])([+−-])(\d+)/g;
const CALL_PATTERN = /Call Thursday (\d{1,2}):(\d{2}) time ([A-Z])\./;
const ALARM_PATTERN = /([A-Z][a-z]+) is in ([A-Z]) and sets an alarm for (\d{1,2}):(\d{2}) local\./;

function minutesOf(hour, minute) {
  return Number(hour) * 60 + Number(minute);
}

function formatTime(totalMinutes) {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(wrapped / 60)).padStart(2, '0')}:${String(wrapped % 60).padStart(2, '0')}`;
}

function spellHours(minutes) {
  const hours = minutes / 60;
  const value = Number.isInteger(hours) ? String(hours) : String(Number(hours.toFixed(2)));
  return `${value} ${hours === 1 ? 'hour' : 'hours'}`;
}

function parse(statement) {
  const table = TABLE_PATTERN.exec(statement);
  const call = CALL_PATTERN.exec(statement);
  const alarm = ALARM_PATTERN.exec(statement);
  if (table === null || call === null || alarm === null) {
    throw new Error('the statement does not print the call table, the call hour, and the person who sets an alarm');
  }
  if (call[3] !== table[2]) {
    throw new Error('the call hour must be stated in the zone the table calls the reference');
  }
  const zoneOffsets = {};
  for (const match of statement.matchAll(ZONE_PATTERN)) {
    if (match[2] !== table[2]) {
      throw new Error('every zone offset must be expressed relative to the zone the table calls the reference');
    }
    zoneOffsets[match[1]] = (match[3] === '+' ? 1 : -1) * Number(match[4]) * 60;
  }
  if (zoneOffsets[alarm[2]] === undefined) {
    throw new Error(`the table does not give the offset of zone ${alarm[2]}, where the person sits`);
  }
  if (alarm[2] === table[2]) {
    throw new Error('the person must sit in another zone than the one the call hour is stated in');
  }
  return {
    place: table[1],
    referenceLabel: table[2],
    referenceTime: `${call[1]}:${call[2]}`,
    referenceMinutes: minutesOf(call[1], call[2]),
    zoneLabel: alarm[2],
    person: alarm[1],
    alarmTime: `${alarm[3]}:${alarm[4]}`,
    alarmMinutes: minutesOf(alarm[3], alarm[4]),
    zoneOffsets
  };
}

function solve(slots) {
  const offset = slots.zoneOffsets[slots.zoneLabel];
  if (offset === undefined) {
    throw new Error(`the table does not give the offset of zone ${slots.zoneLabel}`);
  }
  const localMinutes = slots.referenceMinutes + offset;
  const missMinutes = slots.alarmMinutes - localMinutes;
  if (missMinutes === 0) {
    throw new Error('the local alarm matches the local time, so the section has no lateness to report');
  }
  const localTime = formatTime(localMinutes);
  const direction = missMinutes > 0 ? 'late' : 'early';
  return {
    localTime,
    missMinutes,
    referenceClause: `${slots.referenceTime} ${slots.referenceLabel} = ${localTime} in ${slots.zoneLabel}.`,
    alarmClause: `The local alarm is ${spellHours(Math.abs(missMinutes))} ${direction}.`
  };
}

function render(solution) {
  return `${solution.referenceClause} ${solution.alarmClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const offset = slots.zoneOffsets[slots.zoneLabel];',
  'const formatTime = (totalMinutes) => {',
  '  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;',
  '  return String(Math.floor(wrapped / 60)).padStart(2, "0") + ":" + String(wrapped % 60).padStart(2, "0");',
  '};',
  'const spellHours = (minutes) => {',
  '  const hours = minutes / 60;',
  '  const value = Number.isInteger(hours) ? String(hours) : String(Number(hours.toFixed(2)));',
  '  return value + " " + (hours === 1 ? "hour" : "hours");',
  '};',
  'const localMinutes = slots.referenceMinutes + offset;',
  'const missMinutes = slots.alarmMinutes - localMinutes;',
  'probe(missMinutes !== 0, "the alarm must miss the local time for the printed clause to exist");',
  'const localTime = formatTime(localMinutes);',
  'const direction = missMinutes > 0 ? "late" : "early";',
  'const referenceClause = slots.referenceTime + " " + slots.referenceLabel + " = " + localTime + " in " + slots.zoneLabel + ".";',
  'const alarmClause = "The local alarm is " + spellHours(Math.abs(missMinutes)) + " " + direction + ".";',
  'return referenceClause + " " + alarmClause;'
].join('\n');

function explain(slots, solution) {
  const offset = slots.zoneOffsets[slots.zoneLabel];
  const shift = Math.abs(offset) / 60;
  const behind = offset < 0;
  const miss = Math.abs(solution.missMinutes) / 60;
  return [
    `The table sets the home zone ${slots.referenceLabel} in ${slots.place} and puts zone ${slots.zoneLabel} ${shift} hours ${behind ? 'behind' : 'ahead of'} ${slots.referenceLabel}.`,
    `The call is at ${slots.referenceTime} ${slots.referenceLabel}, so the same instant reads ${solution.localTime} in ${slots.zoneLabel}.`,
    `${slots.person} sets the alarm for ${slots.alarmTime} local, which is ${miss} hours ${behind ? 'past' : 'short of'} the correct ${solution.localTime}, so the local alarm is ${miss} hours ${solution.missMinutes > 0 ? 'late' : 'early'}.`
  ];
}

export const unit = 62;

export const cases = [
  {
    template: 'Time zones from a given table',
    type: slugify('Time zones from a given table'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
