/**
 * Section 39 of the adult-reasoning course: daily travel and its cost.
 *
 * Every variant names a commuter in a district, a return-ticket price paid
 * twice a day, a monthly pass with its price and its 30-day coverage, a fixed
 * number of workdays, and the rule to pick whichever option is cheaper at that
 * known number of days. The verdict multiplies the daily ticket cost by the
 * workdays and compares the product with the pass; the cases change the
 * commuter, the district, the ticket price, the pass price, and the workdays.
 */

import { slugify } from '../../naming.mjs';

const RIDER_PATTERN = /^([A-Z][a-z]+), ([^:]+): return ticket (\d+)×2 per day\./;
const PASS_PATTERN = /Monthly pass (\d+) \/ (\d+) days unlimited\./;
const WORKDAYS_PATTERN = /Works (\d+) days\./;

function parse(statement) {
  const rider = RIDER_PATTERN.exec(statement);
  const pass = PASS_PATTERN.exec(statement);
  const workdays = WORKDAYS_PATTERN.exec(statement);
  if (rider === null || pass === null || workdays === null) {
    throw new Error('the statement does not carry the rider, the daily ticket, the monthly pass, and the workdays');
  }
  if (!/Does not ride at weekends\./.test(statement)) {
    throw new Error('the statement does not fix the days the rider pays for');
  }
  return {
    rider: rider[1],
    place: rider[2].trim(),
    ridePrice: Number(rider[3]),
    passCost: Number(pass[1]),
    passDays: Number(pass[2]),
    workdays: Number(workdays[1])
  };
}

function solve(slots) {
  const ridesPerDay = 2;
  const ticketCost = slots.ridePrice * ridesPerDay * slots.workdays;
  if (slots.workdays > slots.passDays) {
    throw new Error('the workdays exceed the days the pass covers');
  }
  if (ticketCost === slots.passCost) {
    const error = new Error('the ticket total and the pass cost the same, so the rule picks neither');
    error.ambiguous = true;
    throw error;
  }
  return {
    ticketCost,
    passCost: slots.passCost,
    choice: slots.passCost < ticketCost ? 'pass' : 'tickets'
  };
}

function render(solution) {
  return `Tickets ${solution.ticketCost} vs pass ${solution.passCost}. Chooses the ${solution.choice}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots === "object" && slots !== null, "the travel case must carry its parsed values");',
  'probe(typeof slots.rider === "string" && slots.rider.length > 0, "the commuter must be named");',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the commuter must travel from a named district");',
  'probe(Number.isInteger(slots.ridePrice) && slots.ridePrice > 0, "the return ticket price must be a positive whole number");',
  'probe(Number.isInteger(slots.passCost) && slots.passCost > 0, "the monthly pass price must be a positive whole number");',
  'probe(Number.isInteger(slots.passDays) && slots.passDays > 0, "the pass must cover a positive number of days");',
  'probe(Number.isInteger(slots.workdays) && slots.workdays > 0 && slots.workdays <= slots.passDays, "the workdays must fit inside the days the pass covers");',
  'const ticketCost = slots.ridePrice * 2 * slots.workdays;',
  'probe(ticketCost !== slots.passCost, "the rule cannot choose when the two options cost the same");',
  'const choice = slots.passCost < ticketCost ? "pass" : "tickets";',
  'const answer = "Tickets " + ticketCost + " vs pass " + slots.passCost + ". Chooses the " + choice + ".";',
  'return answer;'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.rider} rides twice a day, so one day costs ${slots.ridePrice}×2 = ${slots.ridePrice * 2} and ${slots.workdays} workdays cost ${slots.ridePrice * 2}×${slots.workdays} = ${solution.ticketCost}.`,
    `The pass costs ${solution.passCost} for ${slots.passDays} days unlimited, and the weekends are not ridden, so the pass competes only with the ${slots.workdays} paid days.`,
    `${solution.ticketCost} is ${solution.choice === 'pass' ? 'more' : 'less'} than ${solution.passCost}, so the cheaper option is the ${solution.choice}.`
  ];
}

export const unit = 39;

export const cases = [
  {
    template: 'Daily travel and its cost',
    type: slugify('Daily travel and its cost'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
