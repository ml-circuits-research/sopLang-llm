/**
 * Section 100 of the adult-reasoning course: a synthesis from several fragments.
 *
 * Every variant packs one decision into three fragments: the shop’s Monday
 * closing time, a purchase with a quantity, a unit price and a budget, and a
 * bus arrival with the walk from the stop to the door. The notebook allows
 * going in only when time and money both suffice. The variants change the
 * place, the buyer, and the unit price, so the family derives the cost, the
 * walking arrival, the minutes left in the shop, and the verdict from the
 * parsed fragments.
 */

import { slugify } from '../../naming.mjs';

const CLOSING_PATTERN = /F1: the shop in (.+?) closes Monday at (\d{1,2}):(\d{2})\./;
const PURCHASE_PATTERN =
  /F2: ([A-Z][a-z]+) wants (\d+) kg of sugar at (\d+) \/kg, budget (\d+)\./;
const BUS_PATTERN =
  /F3: the bus arrives at (\d{1,2}):(\d{2}); last boarding back (\d{1,2}):(\d{2}); from stop to door (\d+) minutes on foot\./;

function toMinutes(hours, minutes) {
  return Number(hours) * 60 + Number(minutes);
}

function toClock(totalMinutes) {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = String(Math.floor(wrapped / 60)).padStart(2, '0');
  const minutes = String(wrapped % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function parse(statement) {
  const closing = CLOSING_PATTERN.exec(statement);
  const purchase = PURCHASE_PATTERN.exec(statement);
  const bus = BUS_PATTERN.exec(statement);
  if (closing === null || purchase === null || bus === null) {
    throw new Error('the statement does not print the closing, purchase, and bus fragments');
  }
  return {
    place: closing[1],
    buyer: purchase[1],
    quantityKg: Number(purchase[2]),
    pricePerKg: Number(purchase[3]),
    budget: Number(purchase[4]),
    closesAt: toMinutes(closing[2], closing[3]),
    arrival: toMinutes(bus[1], bus[2]),
    lastBoarding: toMinutes(bus[3], bus[4]),
    walkMinutes: Number(bus[5]),
    // The fragments give the walk but never how long the purchase itself takes.
    shoppingMinutes: null
  };
}

function solve(slots) {
  const cost = slots.quantityKg * slots.pricePerKg;
  const moneyOk = cost <= slots.budget;
  const moneyClause = moneyOk
    ? `Money: ${cost} ≤ ${slots.budget} → ok.`
    : `Money: ${cost} > ${slots.budget} → no.`;
  const arrivalPlus = slots.arrival + slots.walkMinutes;
  const minutesLeft = slots.closesAt - arrivalPlus;
  const minutesText = minutesLeft === 1 ? '1 minute' : `${minutesLeft} minutes`;
  const timeOk = slots.shoppingMinutes !== null && slots.shoppingMinutes <= minutesLeft;
  const timeClause = timeOk
    ? `Time: ${toClock(slots.arrival)}+${slots.walkMinutes} min=${toClock(arrivalPlus)}, close ${toClock(slots.closesAt)} — ${minutesText} in the shop, enough.`
    : `Time: ${toClock(slots.arrival)}+${slots.walkMinutes} min=${toClock(arrivalPlus)}, close ${toClock(slots.closesAt)} — ${minutesText} in the shop, not given as enough.`;
  const verdict =
    moneyOk && timeOk
      ? 'The synthesis is a sure yes: both time and money suffice.'
      : timeOk
        ? 'The synthesis is not a sure yes: money is not secured.'
        : 'The synthesis is not a sure yes: time is not secured.';
  return { moneyClause, timeClause, verdict, cost, minutesLeft };
}

function render(solution) {
  return `${solution.moneyClause} ${solution.timeClause} ${solution.verdict}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const toClock = (total) => {',
  '  const wrapped = ((total % 1440) + 1440) % 1440;',
  '  return String(Math.floor(wrapped / 60)).padStart(2, "0") + ":" + String(wrapped % 60).padStart(2, "0");',
  '};',
  'const cost = slots.quantityKg * slots.pricePerKg;',
  'const moneyOk = cost <= slots.budget;',
  'const moneyClause = moneyOk',
  '  ? "Money: " + cost + " ≤ " + slots.budget + " → ok."',
  '  : "Money: " + cost + " > " + slots.budget + " → no.";',
  'const arrivalPlus = slots.arrival + slots.walkMinutes;',
  'const minutesLeft = slots.closesAt - arrivalPlus;',
  'const minutesText = minutesLeft === 1 ? "1 minute" : minutesLeft + " minutes";',
  'const timeOk = slots.shoppingMinutes !== null && slots.shoppingMinutes <= minutesLeft;',
  'const timeClause = "Time: " + toClock(slots.arrival) + "+" + slots.walkMinutes + " min=" + toClock(arrivalPlus) + ", close " + toClock(slots.closesAt) + " — " + minutesText + " in the shop, " + (timeOk ? "enough." : "not given as enough.");',
  'const verdict = moneyOk && timeOk',
  '  ? "The synthesis is a sure yes: both time and money suffice."',
  '  : (timeOk ? "The synthesis is not a sure yes: money is not secured." : "The synthesis is not a sure yes: time is not secured.");',
  'return moneyClause + " " + timeClause + " " + verdict;'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.quantityKg} kg at ${slots.pricePerKg} per kg costs ${solution.cost}, which is ${solution.cost <= slots.budget ? 'within' : 'over'} the budget of ${slots.budget}, so the money half of the notebook is settled.`,
    `The bus reaches the stop at ${toClock(slots.arrival)} and the walk adds ${slots.walkMinutes} minutes, putting ${slots.buyer} at the door at ${toClock(slots.arrival + slots.walkMinutes)}, while ${slots.place} closes at ${toClock(slots.closesAt)}.`,
    `That leaves ${solution.minutesLeft} minutes in the shop, and no fragment states how long buying ${slots.quantityKg} kg takes, so the time is not given as enough.`,
    `The notebook demands time and money together, so ${solution.verdict.startsWith('The synthesis is a sure yes') ? 'both halves are met' : 'the synthesis is not a sure yes'}.`
  ];
}

export const unit = 100;

export const cases = [
  {
    template: 'A synthesis from several fragments',
    type: slugify('A synthesis from several fragments'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
