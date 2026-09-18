/**
 * Section 1 of the adult-reasoning course: instructions and warnings.
 *
 * Every variant posts the same warehouse notice and describes two people: one
 * wears a vest brought from home, the other is under 18 and asks about the
 * porter's cabin, and an alarm pattern sounds during the visit. The verdict
 * applies the notice literally: the home vest does not replace the rail vest,
 * persons under 18 are forbidden, the cabin is inside the no-smoking perimeter
 * and therefore not a waiting place, and the intermittent alarm means staying
 * put. The cases change the place, the hours, the names, and the ages, so the
 * family derives each clause from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const VEST_PATTERN =
  /([A-Z][a-z]+) is (\d+), wears a vest brought from home, and wants to walk in at (\d{1,2}):(\d{2}) on the yellow lane\./;
const MINOR_PATTERN = /([A-Z][a-z]+) is (\d+) and asks whether they may wait in the porter’s cabin beside an employed parent\./;
const HOURS_PATTERN = /opens for visits at (\d{1,2}):(\d{2}) and closes at (\d{1,2}):(\d{2})/;

function parse(statement) {
  const vest = VEST_PATTERN.exec(statement);
  const minor = MINOR_PATTERN.exec(statement);
  const hours = HOURS_PATTERN.exec(statement);
  if (vest === null || minor === null || hours === null) {
    throw new Error('the statement does not describe the two people and the visit hours');
  }
  return {
    visitor: { name: vest[1], age: Number(vest[2]), homeVest: true, arrival: `${vest[3]}:${vest[4]}` },
    minor: { name: minor[1], age: Number(minor[2]) },
    openFrom: `${hours[1]}:${hours[2]}`,
    openUntil: `${hours[3]}:${hours[4]}`,
    intermittentAlarm: /three short bursts with pauses/.test(statement)
  };
}

function solve(slots) {
  const visitorClause = slots.visitor.homeVest
    ? `${slots.visitor.name} may not enter in the home vest (the rail vest is required).`
    : `${slots.visitor.name} may enter in the rail vest.`;
  const minorClause =
    slots.minor.age < 18
      ? `${slots.minor.name} may not enter: under 18; the cabin is still inside the perimeter.`
      : `${slots.minor.name} may enter: adult and willing to wait outside the perimeter.`;
  const alarmClause = slots.intermittentAlarm
    ? 'The intermittent alarm means stay put.'
    : 'The continuous alarm means leave by the east gate.';
  return { visitorClause, minorClause, alarmClause };
}

function render(solution) {
  return `${solution.visitorClause} ${solution.minorClause} ${solution.alarmClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.visitor === "object" && slots.visitor !== null, "the case must describe the visitor wearing the vest");',
  'probe(typeof slots.minor === "object" && slots.minor !== null, "the case must describe the person asking about the cabin");',
  'probe(Number.isInteger(slots.visitor.age) && slots.visitor.age >= 0, "the visitor age must be a whole number");',
  'probe(Number.isInteger(slots.minor.age) && slots.minor.age >= 0, "the asking person age must be a whole number");',
  'probe(slots.visitor.name !== slots.minor.name, "the two described people must be different");',
  'const visitorClause = slots.visitor.homeVest',
  '  ? slots.visitor.name + " may not enter in the home vest (the rail vest is required)."',
  '  : slots.visitor.name + " may enter in the rail vest.";',
  'const minorClause = slots.minor.age < 18',
  '  ? slots.minor.name + " may not enter: under 18; the cabin is still inside the perimeter."',
  '  : slots.minor.name + " may enter: adult and willing to wait outside the perimeter.";',
  'const alarmClause = slots.intermittentAlarm',
  '  ? "The intermittent alarm means stay put."',
  '  : "The continuous alarm means leave by the east gate.";',
  'return visitorClause + " " + minorClause + " " + alarmClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The notice is closed: the required vest is the one on the hook rail, so ${slots.visitor.name}'s home vest does not satisfy it even though the visit falls inside the opening hours ${slots.openFrom}–${slots.openUntil}.`,
    `${slots.minor.name} is ${slots.minor.age}, and the notice forbids persons under 18; the cabin does not help because the no-smoking perimeter includes it.`,
    slots.intermittentAlarm
      ? 'Three short bursts with pauses are the intermittent alarm, and the notice says to stay where you are.'
      : 'A continuous alarm longer than ten seconds is the continuous alarm, and the notice says to leave by the east gate.'
  ];
}

export const unit = 1;

export const cases = [
  {
    template: 'Instructions and warnings',
    type: slugify('Instructions and warnings'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
