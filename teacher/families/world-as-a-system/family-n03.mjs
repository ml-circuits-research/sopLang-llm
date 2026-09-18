/**
 * Family N3 of the world seed book: Earth, Sun, seasons, and local time.
 *
 * The family carries two printed shapes. A time-zone problem states that one
 * place is a number of time zones east or west of another, fixes the clock at
 * the reference place, and asks for the local time at the other place: every
 * zone east adds one hour and every zone west subtracts one, so the answer is
 * the stated clock shifted by the signed offset, taken modulo a day. A
 * seasonal problem states the simplified tilted-axis model and asks which of
 * the two months has the longer daylight and whether that fact settles the
 * rainfall: the stated relation makes June the longer month and carries no
 * information about rain.
 *
 * All four grades carry both shapes; the grades differ in the stated clock and
 * in whether the seasonal shape appends a cross-domain check (grades 2-4 do,
 * and the shared descriptor renders its suffix).
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';

const TIME_ZONE_PATTERN = /([A-Z][A-Za-z]+) is (\d+) time zone\(s\) (east|west) of ([A-Z][A-Za-z]+)/;
const REFERENCE_CLOCK_PATTERN = /At ([A-Z][A-Za-z]+) it is (\d{1,2}):(\d{2})/;
const LOCAL_TIME_QUESTION = /What local time is it in ([A-Z][A-Za-z]+)\?/;
const SEASON_PATTERN = /days are generally longer around ([A-Z][a-z]+) than around ([A-Z][a-z]+)/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const crossDomain = parseCrossDomain(blocks['Given facts']);
  const timeZone = TIME_ZONE_PATTERN.exec(facts);
  if (timeZone !== null) {
    const clock = REFERENCE_CLOCK_PATTERN.exec(facts);
    const question = LOCAL_TIME_QUESTION.exec(blocks.Task);
    if (clock === null) {
      throw new Error('the time-zone statement fixes no reference clock');
    }
    if (question === null) {
      throw new Error('the task asks for no local time');
    }
    const place = timeZone[1];
    const reference = timeZone[4];
    const target = question[1];
    const zones = Number(timeZone[2]);
    const direction = timeZone[3];
    if (clock[1] !== reference) {
      throw new Error(`the stated clock belongs to ${clock[1]}, not to the reference place ${reference}`);
    }
    let shiftHours;
    if (target === place) {
      shiftHours = (direction === 'east' ? 1 : -1) * zones;
    } else if (target === reference) {
      shiftHours = (direction === 'east' ? -1 : 1) * zones;
    } else {
      throw new Error(`the asked place ${target} is neither of the two stated places`);
    }
    return {
      kind: 'timezone',
      place,
      reference,
      target,
      zones,
      direction,
      shiftHours,
      baseHour: Number(clock[2]),
      baseMinute: Number(clock[3]),
      crossDomain
    };
  }
  const season = SEASON_PATTERN.exec(facts);
  if (season !== null) {
    return { kind: 'seasonal', longer: season[1], shorter: season[2], crossDomain };
  }
  throw new Error('the statement states neither a time-zone offset nor the tilt-season model');
}

function clockText(hour, minute) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function solve(slots) {
  if (slots.kind === 'timezone') {
    const totalMinutes = slots.baseHour * 60 + slots.baseMinute + slots.shiftHours * 60;
    const minutes = ((totalMinutes % 1440) + 1440) % 1440;
    return {
      kind: 'timezone',
      hour: Math.floor(minutes / 60),
      minute: minutes % 60,
      target: slots.target,
      crossDomain: slots.crossDomain
    };
  }
  if (slots.kind === 'seasonal') {
    return { kind: 'seasonal', longer: slots.longer, crossDomain: slots.crossDomain };
  }
  throw new Error(`unknown model kind "${slots.kind}"`);
}

function render(solution) {
  const main =
    solution.kind === 'timezone'
      ? `${clockText(solution.hour, solution.minute)}.`
      : `${solution.longer} has longer daylight; rainfall cannot be determined from this fact alone.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(slots.kind === "timezone" || slots.kind === "seasonal", "the statement must carry one of the two printed model kinds");',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'let main;',
  'if (slots.kind === "timezone") {',
  '  probe(Number.isInteger(slots.zones) && slots.zones > 0, "the stated number of time zones must be a positive integer");',
  '  probe(slots.direction === "east" || slots.direction === "west", "the stated direction must be east or west");',
  '  probe(Number.isInteger(slots.baseHour) && Number.isInteger(slots.baseMinute), "the reference clock must be a stated hour and minute");',
  '  probe(Math.abs(slots.shiftHours) === slots.zones, "the signed shift must match the stated number of time zones");',
  '  const totalMinutes = slots.baseHour * 60 + slots.baseMinute + slots.shiftHours * 60;',
  '  const minutes = ((totalMinutes % 1440) + 1440) % 1440;',
  '  const hour = String(Math.floor(minutes / 60)).padStart(2, "0");',
  '  const minute = String(minutes % 60).padStart(2, "0");',
  '  main = hour + ":" + minute + ".";',
  '} else {',
  '  probe(typeof slots.longer === "string" && slots.longer.length > 0, "the longer-daylight month must be named");',
  '  main = slots.longer + " has longer daylight; rainfall cannot be determined from this fact alone.";',
  '}',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  if (slots.kind === 'timezone') {
    const later = slots.shiftHours > 0;
    return [
      `Each time zone east adds one hour and each zone west subtracts one, so ${slots.target} is ${Math.abs(slots.shiftHours)} hour(s) ${later ? 'later' : 'earlier'} than ${slots.reference}.`,
      `Shifting the stated clock ${clockText(slots.baseHour, slots.baseMinute)} by ${slots.shiftHours} hour(s) gives the local time ${clockText(solution.hour, solution.minute)}.`,
      'The shift is taken modulo 24 hours, so the answer is the local clock of the asked place.'
    ];
  }
  return [
    'The stated model tilts the axis and ties the tilt to day length in the Northern Hemisphere.',
    `That relation makes ${slots.longer} the month with the longer daylight period and ${slots.shorter} the shorter one.`,
    'The same relation carries no rainfall information, so whether it will rain cannot be deduced from the season alone.'
  ];
}

function caseFor(grade) {
  return {
    template: `Earth, Sun, seasons, and local time (grade ${grade})`,
    type: `earth-sun-seasons-and-local-time-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N3';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
