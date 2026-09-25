/**
 * Section 81 of the adult-reasoning course: point of view and interest.
 *
 * Every variant prints the same three accounts of one parking stop: the driver
 * says a short time and that a tree hid the sign, the neighbour says a much
 * longer time and that the sign is visible from the pavement, and the camera
 * records the arrival and departure but says nothing about the tree. The
 * verdict measures what the camera fixes, notes which spoken figure it
 * contradicts and which it nearly matches, and leaves the visibility disputed.
 * The variants change the people and the place, so the family derives the
 * duration from the camera times and reads both spoken figures.
 */

import { slugify } from '../../naming.mjs';

const DRIVER_PATTERN =
  /^([A-Z][a-z]+), driver, ([^:\n]+): “I stood (\d+) minutes, the sign was hidden by a tree\.”$/m;
const NEIGHBOUR_PATTERN =
  /^([A-Z][a-z]+), neighbour: “Stood (\d+) minutes, the tree is thin, the sign is visible from the pavement\.”$/m;
const CAMERA_PATTERN = /Camera: “(\d{2}):(\d{2}) arrival, (\d{2}):(\d{2}) departure”/;

function parse(statement) {
  const driver = DRIVER_PATTERN.exec(statement);
  const neighbour = NEIGHBOUR_PATTERN.exec(statement);
  const camera = CAMERA_PATTERN.exec(statement);
  if (driver === null || neighbour === null || camera === null) {
    throw new Error('the statement does not print the driver, the neighbour, and the camera times');
  }
  if (driver[1] === neighbour[1]) {
    throw new Error('the driver and the neighbour must be different people');
  }
  const arrivalHours = Number(camera[1]);
  const arrivalMinutes = Number(camera[2]);
  const departureHours = Number(camera[3]);
  const departureMinutes = Number(camera[4]);
  const elapsed =
    (departureHours * 60 + departureMinutes - (arrivalHours * 60 + arrivalMinutes) + 1440) % 1440;
  return {
    driverName: driver[1],
    place: driver[2],
    driverMinutes: Number(driver[3]),
    driverSaysHidden: true,
    neighbourName: neighbour[1],
    neighbourMinutes: Number(neighbour[2]),
    neighbourSaysVisible: true,
    arrivalHours,
    arrivalMinutes,
    departureHours,
    departureMinutes,
    durationMinutes: elapsed
  };
}

function solve(slots) {
  const duration = slots.durationMinutes;
  if (!Number.isInteger(duration) || duration <= 0) {
    throw new Error('the camera must record a positive standing time');
  }
  if (Math.abs(slots.neighbourMinutes - duration) <= 1) {
    throw new Error('the neighbour figure must contradict the measured duration');
  }
  if (Math.abs(slots.driverMinutes - duration) > 1) {
    throw new Error('the driver figure must be close to the measured duration');
  }
  if (!(slots.driverSaysHidden && slots.neighbourSaysVisible)) {
    throw new Error('the two accounts must disagree about the tree');
  }
  return {
    duration,
    contradicts: slots.neighbourMinutes,
    closeTo: slots.driverMinutes,
    visibilityDisputed: slots.driverSaysHidden && slots.neighbourSaysVisible
  };
}

function render(solution) {
  const visibility = solution.visibilityDisputed
    ? 'Visibility of the tree remains disputed.'
    : 'Visibility of the tree is agreed.';
  return `The ${solution.duration}-minute duration contradicts ${solution.contradicts} and is close to ${solution.closeTo}. ${visibility}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const arrival = slots.arrivalHours * 60 + slots.arrivalMinutes;',
  'const departure = slots.departureHours * 60 + slots.departureMinutes;',
  'const duration = (departure - arrival + 1440) % 1440;',
  'probe(Number.isInteger(duration) && duration > 0, "the camera must record a positive standing time");',
  'probe(duration === slots.durationMinutes, "the reported duration matches the camera times");',
  'const visibility = slots.driverSaysHidden && slots.neighbourSaysVisible ? "Visibility of the tree remains disputed." : "Visibility of the tree is agreed.";',
  'return "The " + duration + "-minute duration contradicts " + slots.neighbourMinutes + " and is close to " + slots.driverMinutes + ". " + visibility;'
].join('\n');

function explain(slots, solution) {
  return [
    `The camera fixes two clock times, ${String(slots.arrivalHours).padStart(2, '0')}:${String(slots.arrivalMinutes).padStart(2, '0')} and ${String(slots.departureHours).padStart(2, '0')}:${String(slots.departureMinutes).padStart(2, '0')}, so the measured stop at ${slots.place} lasted ${solution.duration} minutes.`,
    `${slots.neighbourName} says ${solution.contradicts} minutes, which the measured duration contradicts, while ${slots.driverName}'s ${solution.closeTo} minutes is close to it.`,
    'The camera does not speak about the tree, so the disagreement between the driver who says the tree hid the sign and the neighbour who says the sign is visible from the pavement stays an opinion.'
  ];
}

export const unit = 81;

export const cases = [
  {
    template: 'Point of view and interest',
    type: slugify('Point of view and interest'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
