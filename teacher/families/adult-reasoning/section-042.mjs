/**
 * Section 42 of the adult-reasoning course: an extract from an employment
 * contract.
 *
 * Every variant prints one closed contract — the daily and weekly hour caps,
 * the overtime rate that applies only to an order given IN WRITING
 * beforehand, the unpaid meal break outside the eight hours, the resignation
 * notice in working days — and then two episodes: the manager asks for extra
 * hours by speech on a weekday evening, and the employee announces a
 * resignation and wants to leave two calendar days later. The verdict applies
 * the extract literally: speech is not writing, so the extra hours are not
 * overtime, and the notice runs in working days, so the gap is far short of
 * ten. The cases change the name, the place, the weekday of the request, and
 * the overtime rate, so the family derives every clause from the parsed
 * values.
 */

import { slugify } from '../../naming.mjs';

const CONTRACT_PATTERN =
  /Contract of ([A-Z][a-z]+), ([^:]+): (\d+) h\/day, (\d+) h\/week\. Overtime (\d+) only if ordered IN WRITING beforehand\. Meal break (\d+) min unpaid, outside the (\d+) h\. Resignation notice (\d+) working days\./;
const EPISODE_PATTERN =
  /The manager says (verbally|in writing) ([A-Z][a-z]+) evening: stay (\d+) h\. ([A-Z][a-z]+) stays\. ([A-Z][a-z]+) announces resignation, wants to leave ([A-Z][a-z]+)\./;

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Working days strictly after `from`, up to and including `to`. */
function workingDaysBetween(from, to) {
  const start = WEEKDAYS.indexOf(from);
  const end = WEEKDAYS.indexOf(to);
  if (start === -1 || end === -1) {
    throw new Error(`the episode does not name two weekdays (${from}, ${to})`);
  }
  const span = ((end - start) % 7 + 7) % 7;
  let counted = 0;
  for (let step = 1; step <= span; step += 1) {
    if ((start + step) % 7 <= 4) {
      counted += 1;
    }
  }
  return counted;
}

function parse(statement) {
  const contract = CONTRACT_PATTERN.exec(statement);
  const episode = EPISODE_PATTERN.exec(statement);
  if (contract === null || episode === null) {
    throw new Error('the statement does not print the contract and the manager’s evening request');
  }
  const slots = {
    employee: contract[1],
    place: contract[2],
    hoursPerDay: Number(contract[3]),
    hoursPerWeek: Number(contract[4]),
    overtimeRate: Number(contract[5]),
    mealBreakMinutes: Number(contract[6]),
    capOutsideBreak: Number(contract[7]),
    noticeDays: Number(contract[8]),
    orderedInWriting: episode[1] === 'in writing',
    orderedOn: episode[2],
    requestedHours: Number(episode[3]),
    stays: episode[4],
    announceDay: episode[5],
    leaveDay: episode[6]
  };
  if (slots.stays !== slots.employee) {
    throw new Error('the episode must be about the person the contract names');
  }
  if (!/Probation already ended\./.test(statement)) {
    throw new Error('the statement does not place the episode after probation');
  }
  return slots;
}

function solve(slots) {
  const paidClause = slots.orderedInWriting
    ? `Yes: the ${slots.requestedHours} h were ordered in writing beforehand.`
    : 'No: the written order is missing.';
  const availableWorkingDays = workingDaysBetween(slots.announceDay, slots.leaveDay);
  const leaveClause =
    availableWorkingDays >= slots.noticeDays
      ? `Yes: ${availableWorkingDays} working days cover the ${slots.noticeDays} the extract requires.`
      : `No: ${slots.noticeDays} working days > ${slots.announceDay}-${slots.leaveDay}.`;
  return { paidClause, leaveClause, availableWorkingDays };
}

function render(solution) {
  return `${solution.paidClause} ${solution.leaveClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.employee === "string" && slots.employee.length > 0, "the case must name the employee");',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the workplace");',
  'probe(Number.isInteger(slots.hoursPerDay) && slots.hoursPerDay > 0, "the contract must state a positive daily hour cap");',
  'probe(Number.isInteger(slots.hoursPerWeek) && slots.hoursPerWeek >= slots.hoursPerDay, "the weekly cap must cover at least one day");',
  'probe(Number.isInteger(slots.overtimeRate) && slots.overtimeRate > 0, "the contract must state a positive overtime rate");',
  'probe(Number.isInteger(slots.mealBreakMinutes) && slots.mealBreakMinutes >= 0, "the meal break must be a whole number of minutes");',
  'probe(Number.isInteger(slots.noticeDays) && slots.noticeDays > 0, "the notice must be a positive number of working days");',
  'probe(typeof slots.orderedInWriting === "boolean", "the case must say whether the order was written or spoken");',
  'probe(Number.isInteger(slots.requestedHours) && slots.requestedHours > 0, "the manager must ask for a positive number of extra hours");',
  'probe(slots.stays === slots.employee, "the person who stays must be the person the contract names");',
  'const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];',
  'const start = WEEKDAYS.indexOf(slots.announceDay);',
  'const end = WEEKDAYS.indexOf(slots.leaveDay);',
  'probe(start !== -1 && end !== -1, "the resignation episode must name two weekdays");',
  'const span = ((end - start) % 7 + 7) % 7;',
  'let availableWorkingDays = 0;',
  'for (let step = 1; step <= span; step += 1) {',
  '  if ((start + step) % 7 <= 4) {',
  '    availableWorkingDays += 1;',
  '  }',
  '}',
  'probe(slots.announceDay !== slots.leaveDay, "the announcement and the wanted departure must fall on different weekdays");',
  'const paidClause = slots.orderedInWriting',
  '  ? "Yes: the " + slots.requestedHours + " h were ordered in writing beforehand."',
  '  : "No: the written order is missing.";',
  'const leaveClause = availableWorkingDays >= slots.noticeDays',
  '  ? "Yes: " + availableWorkingDays + " working days cover the " + slots.noticeDays + " the extract requires."',
  '  : "No: " + slots.noticeDays + " working days > " + slots.announceDay + "-" + slots.leaveDay + ".";',
  'return paidClause + " " + leaveClause;'
].join('\n');

function explain(slots, solution) {
  const orderLine = slots.orderedInWriting
    ? `The manager ordered the ${slots.requestedHours} extra hours in writing beforehand, which is the form the extract demands.`
    : `The manager spoke to ${slots.employee} on ${slots.orderedOn} evening, and speech is not writing, so the ${slots.requestedHours} extra hours are not overtime under the extract.`;
  return [
    orderLine,
    `The contract fixes ${slots.hoursPerDay} h/day and ${slots.hoursPerWeek} h/week with a ${slots.mealBreakMinutes} min unpaid break outside the ${slots.capOutsideBreak} h, so nothing here reclassifies the extra hours at the printed rate of ${slots.overtimeRate}.`,
    `The notice is counted in working days: ${slots.announceDay} to ${slots.leaveDay} gives only ${solution.availableWorkingDays} working days against the ${slots.noticeDays} the extract requires, so leaving on ${slots.leaveDay} is too early.`
  ];
}

export const unit = 42;

export const cases = [
  {
    template: 'An extract from an employment contract',
    type: slugify('An extract from an employment contract'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
