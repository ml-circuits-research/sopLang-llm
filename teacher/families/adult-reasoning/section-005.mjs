/**
 * Section 5 of the adult-reasoning course: public signs described in words.
 *
 * Every variant describes one post by a school, read from top to bottom: a red
 * circle that forbids goods vehicles, a middle plate that excepts deliveries
 * inside an early window, and a cancelled P that bans parking. A note then
 * states that the delivery exception amends only the lorry ban, that bicycles
 * are not goods vehicles, and that a private car with shopping bags is not a
 * delivery. Three people act: a driver arrives with a delivery van inside the
 * window and wants to stand for a few minutes, a neighbour parks a car for a
 * minute, and a pupil rides past. The verdict gives the van its window but
 * refuses the standing, refuses the car's parking without calling it a lorry,
 * and lets the bicycle pass while refusing to invent a rule the register does
 * not print. The cases change the town and the arrival minute, so the family
 * derives the window label and the membership test from the parsed register.
 */

import { slugify } from '../../naming.mjs';

const REGISTER_PATTERN = /The town sign register for (.+?) describes a post by a school, top to bottom:/;
const EXCEPTION_PATTERN = /Middle: “except deliveries between (\d{1,2}):(\d{2}) and (\d{1,2}):(\d{2})”\./;
const VAN_PATTERN =
  /([A-Z][a-z]+) brings bread in a delivery van at (\d{1,2}):(\d{2}) and wants to stand (\d+) minutes at the post\./;
const CAR_PATTERN = /A neighbour parks a car “for (one|\d+) minute”\./;

function hourLabel(hour, minute) {
  return minute === '00' ? String(Number(hour)) : `${Number(hour)}:${minute}`;
}

function toMinutes(hour, minute) {
  return Number(hour) * 60 + Number(minute);
}

function parse(statement) {
  const register = REGISTER_PATTERN.exec(statement);
  const exception = EXCEPTION_PATTERN.exec(statement);
  const van = VAN_PATTERN.exec(statement);
  const car = CAR_PATTERN.exec(statement);
  if (register === null || exception === null || van === null || car === null) {
    throw new Error('the statement does not describe the post and the three people');
  }
  return {
    place: register[1].trim(),
    driver: van[1],
    arrival: { hour: Number(van[2]), minute: van[3] },
    standMinutes: Number(van[4]),
    window: {
      from: { hour: Number(exception[1]), minute: exception[2] },
      until: { hour: Number(exception[3]), minute: exception[4] }
    },
    parkingPlateCancelled: /cancelled P/.test(statement),
    exceptionAmendsParking: /exception amends the parking ban/.test(statement),
    bicyclesAreGoodsVehicles: !/Bicycles are not goods vehicles/.test(statement),
    carIsDelivery: !/A private car with shopping bags is not “delivery”/.test(statement)
  };
}

function solve(slots) {
  const from = toMinutes(slots.window.from.hour, slots.window.from.minute);
  const until = toMinutes(slots.window.until.hour, slots.window.until.minute);
  const arrival = toMinutes(slots.arrival.hour, slots.arrival.minute);
  if (arrival < from || arrival > until) {
    throw new Error('the delivery van does not arrive inside the excepted window');
  }
  const parkingBanned = slots.parkingPlateCancelled && !slots.exceptionAmendsParking;
  const windowLabel = `${hourLabel(slots.window.from.hour, slots.window.from.minute)}–${hourLabel(slots.window.until.hour, slots.window.until.minute)}`;
  const vanClause = `The van may move in the ${windowLabel} window but may not stand (cancelled P).`;
  const carClause = `The car is not a lorry, but it ${parkingBanned ? 'may not park' : 'may park'}.`;
  const bicycleClause = `The bicycle ${slots.bicyclesAreGoodsVehicles ? 'may not pass' : 'may pass'}; the register is silent on P for bicycles — do not fill the silence.`;
  return { vanClause, carClause, bicycleClause, parkingBanned };
}

function render(solution) {
  return `${solution.vanClause} ${solution.carClause} ${solution.bicycleClause}`;
}

const WIRES = [
  {
    name: 'window',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const label = (hour, minute) => (minute === "00" ? String(Number(hour)) : Number(hour) + ":" + minute);',
      'const windowLabel = label(slots.window.from.hour, slots.window.from.minute) + "–" + label(slots.window.until.hour, slots.window.until.minute);',
      'const parkingBanned = slots.parkingPlateCancelled && !slots.exceptionAmendsParking;',
      'return { windowLabel, parkingBanned };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const slots = $slots;',
  'const vanClause = "The van may move in the " + $window.windowLabel + " window but may not stand (cancelled P).";',
  'const carClause = "The car is not a lorry, but it " + ($window.parkingBanned ? "may not park" : "may park") + ".";',
  'const bicycleClause = "The bicycle " + (slots.bicyclesAreGoodsVehicles ? "may not pass" : "may pass") + "; the register is silent on P for bicycles — do not fill the silence.";',
  'return vanClause + " " + carClause + " " + bicycleClause;'
].join('\n');

function explain(slots, solution) {
  const windowLabel = `${hourLabel(slots.window.from.hour, slots.window.from.minute)}–${hourLabel(slots.window.until.hour, slots.window.until.minute)}`;
  return [
    `${slots.driver} brings bread in a delivery van at ${slots.arrival.hour}:${slots.arrival.minute} to the post the register of ${slots.place} describes, inside the excepted ${windowLabel} window, so the lorry ban does not reach the van.`,
    `The van still wants to stand ${slots.standMinutes} minutes, and the cancelled P bans parking for every vehicle, because the exception amends only the lorry ban and not the parking ban.`,
    `${slots.carIsDelivery ? 'Even if the shopping bags counted as a delivery' : 'The car is not a lorry and its shopping bags are not a delivery'}, so ${solution.parkingBanned ? 'the parking ban alone already stops it' : 'nothing in the register stops it'}.`,
    `The pupil's bicycle is not a goods vehicle, so the lorry ban does not stop it; the register prints nothing about a P for bicycles, so the answer stops where the register stops.`
  ];
}

export const unit = 5;

export const cases = [
  {
    template: 'Public signs described in words',
    type: slugify('Public signs described in words'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
