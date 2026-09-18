/**
 * Section 95 of the adult-reasoning course: good, middle, and bad scenarios.
 *
 * Every variant prints one route with a good, a middle, and a bad travel time,
 * an immovable meeting at a fixed clock time, a departure time, and the
 * notebook rule that an immovable meeting is planned against the bad scenario.
 * The verdict adds the bad minutes to the departure, compares the arrival with
 * the meeting, and states the departure the notebook asks for as the meeting
 * minus the bad minutes. The variants change the place, the person, and the bad
 * duration, so the family derives the relation, the required departure, and the
 * clock the rule points at from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const ROUTE_PATTERN = /Road to (.+?): good (\d+) min; middle (\d+); bad (\d+) min \(works on the bridge\)\./;
const MEETING_PATTERN = /An immovable meeting at (\d{1,2}):(\d{2})\./;
const LEAVES_PATTERN = /([A-Z][a-z]+) leaves at (\d{1,2}):(\d{2})\./;

function toMinutes(hours, minutes) {
  return Number(hours) * 60 + Number(minutes);
}

function formatClock(total) {
  const hours = Math.floor(total / 60) % 24;
  const minutes = total % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function parse(statement) {
  const route = ROUTE_PATTERN.exec(statement);
  const meeting = MEETING_PATTERN.exec(statement);
  const leaves = LEAVES_PATTERN.exec(statement);
  if (route === null || meeting === null || leaves === null) {
    throw new Error('the statement does not carry the three scenarios, the meeting, and the departure');
  }
  if (!/for an immovable meeting, plan the bad scenario\./.test(statement)) {
    throw new Error('the statement does not carry the notebook rule for immovable meetings');
  }
  const good = Number(route[2]);
  const middle = Number(route[3]);
  const bad = Number(route[4]);
  if (!(good < middle && middle < bad)) {
    throw new Error('the scenarios must be ordered good < middle < bad');
  }
  return {
    place: route[1].trim(),
    person: leaves[1],
    good,
    middle,
    bad,
    meeting: `${meeting[1]}:${meeting[2]}`,
    meetingMinutes: toMinutes(meeting[1], meeting[2]),
    departure: `${leaves[2]}:${leaves[3]}`,
    departureMinutes: toMinutes(leaves[2], leaves[3])
  };
}

function solve(slots) {
  const arrivalMinutes = slots.departureMinutes + slots.bad;
  let relation = 'arrives before';
  if (arrivalMinutes > slots.meetingMinutes) {
    relation = 'overruns';
  } else if (arrivalMinutes === slots.meetingMinutes) {
    relation = 'lands exactly at';
  }
  return {
    departure: slots.departure,
    bad: slots.bad,
    meeting: slots.meeting,
    arrival: formatClock(arrivalMinutes),
    arrivalMinutes,
    relation,
    requiredDeparture: formatClock(slots.meetingMinutes - slots.bad),
    requiredDepartureMinutes: slots.meetingMinutes - slots.bad
  };
}

function render(solution) {
  return `${solution.departure}+${solution.bad} min ${solution.relation} ${solution.meeting}. Required departure: ${solution.meeting} minus ${solution.bad} min.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots === "object" && slots !== null, "the scenario case must carry its parsed values");',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the route must reach a named place");',
  'probe(typeof slots.person === "string" && slots.person.length > 0, "the traveller must be named");',
  'probe(Number.isInteger(slots.good) && slots.good > 0, "the good scenario must be a positive whole number of minutes");',
  'probe(Number.isInteger(slots.middle) && slots.middle > slots.good, "the middle scenario must be slower than the good one");',
  'probe(Number.isInteger(slots.bad) && slots.bad > slots.middle, "the bad scenario must be the slowest of the three");',
  'probe(Number.isInteger(slots.meetingMinutes) && Number.isInteger(slots.departureMinutes), "the meeting and the departure must be clock times on the same day");',
  'probe(slots.departureMinutes < slots.meetingMinutes, "the traveller must set out before the meeting");',
  'const arrivalMinutes = slots.departureMinutes + slots.bad;',
  'probe(arrivalMinutes > slots.meetingMinutes, "the bad scenario must miss the immovable meeting");',
  'const relation = arrivalMinutes > slots.meetingMinutes ? "overruns" : (arrivalMinutes === slots.meetingMinutes ? "lands exactly at" : "arrives before");',
  'const answer = slots.departure + "+" + slots.bad + " min " + relation + " " + slots.meeting + ". Required departure: " + slots.meeting + " minus " + slots.bad + " min.";',
  'return answer;'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.person} leaves at ${slots.departure} for the meeting at ${slots.meeting}, and the bridge works make the bad travel time ${slots.bad} minutes instead of the good ${slots.good}.`,
    `${slots.departure} + ${slots.bad} min reaches ${solution.arrival}, so the bad scenario ${solution.relation} the immovable ${slots.meeting} and the meeting cannot be moved.`,
    `Planning against the bad scenario means leaving at ${solution.requiredDeparture}, which is ${slots.meeting} minus ${slots.bad} minutes, so the middle and good times are not the ones to plan with.`
  ];
}

export const unit = 95;

export const cases = [
  {
    template: 'Good / middle / bad scenarios',
    type: slugify('Good / middle / bad scenarios'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
