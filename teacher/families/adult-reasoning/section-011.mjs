/**
 * Section 11 of the adult-reasoning course: prices, change, and rounding.
 *
 * Every variant prints a kiosk price list with whole crowns, a card floor, and
 * the rule for a purchase that leaves no change. The buyer orders rolls,
 * sandwiches, and waters and tenders a note; the seller has change, so the
 * tip/extra-item/exact-sum rule never applies. The cases change the ward, the
 * three prices, the ordered counts, and the tendered note, so the family
 * derives the cost, the change, and the card verdict from the statement.
 */

import { slugify } from '../../naming.mjs';

const KIOSK_PATTERN = /Kiosk in ([^:]+): roll (\d+); sandwich (\d+); 0\.5 l water (\d+)\./;
const CARD_PATTERN = /Cash yes\. Cards refused under (\d+)\./;
const NO_CHANGE_PATTERN = /If there is no change, the customer chooses: tip \/ extra item \/ exact sum\./;
const ORDER_PATTERN = /([A-Z][a-z]+) asks for (\d+) rolls, (\d+) sandwiches, (\d+) waters, tenders (\d+)\./;
const CHANGE_PATTERN = /The seller has change\./;

function parse(statement) {
  const kiosk = KIOSK_PATTERN.exec(statement);
  const card = CARD_PATTERN.exec(statement);
  const order = ORDER_PATTERN.exec(statement);
  if (kiosk === null || card === null || order === null) {
    throw new Error('the statement does not print the kiosk prices, the card floor, and the order');
  }
  return {
    place: kiosk[1],
    prices: { roll: Number(kiosk[2]), sandwich: Number(kiosk[3]), water: Number(kiosk[4]) },
    cardFloor: Number(card[1]),
    noChangeRule: NO_CHANGE_PATTERN.test(statement),
    buyer: {
      name: order[1],
      rolls: Number(order[2]),
      sandwiches: Number(order[3]),
      waters: Number(order[4]),
      tendered: Number(order[5])
    },
    sellerHasChange: CHANGE_PATTERN.test(statement)
  };
}

function solve(slots) {
  const { prices, buyer } = slots;
  const cost = buyer.rolls * prices.roll + buyer.sandwiches * prices.sandwich + buyer.waters * prices.water;
  const change = buyer.tendered - cost;
  if (!slots.sellerHasChange || change <= 0) {
    throw new Error('the statement says the seller has change, so the tendered sum must leave some');
  }
  if (prices.water >= slots.cardFloor) {
    throw new Error('the kiosk question is about a single water below the card floor');
  }
  return {
    cost,
    change,
    water: prices.water,
    cardFloor: slots.cardFloor,
    verdict: `One water at ${prices.water} < ${slots.cardFloor} → card refused.`
  };
}

function render(solution) {
  return `Cost ${solution.cost}, change ${solution.change}. ${solution.verdict}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the kiosk must name the ward it stands in");',
  'probe(typeof slots.buyer === "object" && slots.buyer !== null, "the statement must name the customer and the order");',
  'probe(typeof slots.buyer.name === "string" && slots.buyer.name.length > 0, "the customer name must be on record");',
  'probe(Number.isInteger(slots.prices.roll) && slots.prices.roll > 0, "a roll must cost a positive whole, crown amount");',
  'probe(Number.isInteger(slots.prices.sandwich) && slots.prices.sandwich > 0, "a sandwich must cost a positive whole amount");',
  'probe(Number.isInteger(slots.prices.water) && slots.prices.water > 0, "a water must cost a positive whole amount");',
  'probe(slots.buyer.rolls > 0 && slots.buyer.sandwiches > 0 && slots.buyer.waters > 0, "the order must ask for at least one of each item");',
  'probe(Number.isInteger(slots.cardFloor) && slots.cardFloor > 0, "the card floor must be a positive amount");',
  'probe(slots.sellerHasChange === true, "the statement must say the seller has change");',
  'const cost = slots.buyer.rolls * slots.prices.roll + slots.buyer.sandwiches * slots.prices.sandwich + slots.buyer.waters * slots.prices.water;',
  'const change = slots.buyer.tendered - cost;',
  'probe(slots.buyer.tendered >= cost, "the tendered note must cover the cost");',
  'probe(change > 0, "the seller must be able to give change");',
  'probe(cost > slots.prices.water, "the full order must cost more than a single water");',
  'probe(slots.prices.roll < slots.cardFloor && slots.prices.sandwich < slots.cardFloor, "a single item must fall under the floor the kiosk refuses cards below");',
  'probe(slots.prices.water < slots.cardFloor, "a single water must fall under the floor the kiosk refuses cards below");',
  'const card = "One water at " + slots.prices.water + " < " + slots.cardFloor + " → card refused.";',
  'return "Cost " + cost + ", change " + change + ". " + card;'
].join('\n');

function explain(slots, solution) {
  return [
    `The order at the ${slots.place} kiosk costs ${slots.buyer.rolls}×${slots.prices.roll} + ${slots.buyer.sandwiches}×${slots.prices.sandwich} + ${slots.buyer.waters}×${slots.prices.water} = ${solution.cost}, all at whole-crown prices, so nothing has to be rounded.`,
    `${slots.buyer.name} tenders ${slots.buyer.tendered} and the seller has change, so the change is ${solution.change}, and the tip/extra-item/exact-sum rule for a purchase without change never comes up.`,
    `A single water costs ${solution.water}, which is below the ${solution.cardFloor} floor the kiosk refuses cards under, so the answer is that a card would not be accepted for it.`
  ];
}

export const unit = 11;

export const cases = [
  {
    template: 'Prices, change, and rounding',
    type: slugify('Prices, change, and rounding'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
