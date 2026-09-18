/**
 * Section 17 of the adult-reasoning course: fees and commissions as written.
 *
 * Every variant posts the same online-fair notice and names a buyer who takes
 * home delivery: the commission is a percentage of the seller price, paid by
 * the buyer on top of that price, the stated delivery fee is added for the home
 * total, and the pick-up point charges nothing. The variants change the ward,
 * the seller price, the commission rate, the buyer, and the delivery fee, so
 * the family derives every printed amount from the parsed values and prints it
 * with two decimals.
 */

import { slugify } from '../../naming.mjs';

const FAIR_PATTERN = /Online fair used in ([^:]+): seller price (\d+)\./;
const COMMISSION_PATTERN = /Commission (\d+)% of the seller price, paid by the buyer\./;
const DELIVERY_PATTERN = /Home delivery (\d+);/;
const PICKUP_PATTERN = /the pick-up point in (.+?) (\d+)\./;
const BUYER_PATTERN = /^([A-Z][a-z]+) chooses home delivery\./m;

function parse(statement) {
  const fair = FAIR_PATTERN.exec(statement);
  const commission = COMMISSION_PATTERN.exec(statement);
  const delivery = DELIVERY_PATTERN.exec(statement);
  const pickup = PICKUP_PATTERN.exec(statement);
  const buyer = BUYER_PATTERN.exec(statement);
  if (fair === null || commission === null || delivery === null || pickup === null || buyer === null) {
    throw new Error('the statement does not describe the fair notice, its fees, and the buyer');
  }
  return {
    place: fair[1],
    sellerPrice: Number(fair[2]),
    commissionPercent: Number(commission[1]),
    deliveryFee: Number(delivery[1]),
    pickupFee: Number(pickup[2]),
    buyer: buyer[1]
  };
}

/** The three printed amounts in cents, so every figure stays exact. */
function amounts(slots) {
  const commissionCents = slots.sellerPrice * slots.commissionPercent;
  const baseCents = slots.sellerPrice * 100;
  return {
    commissionCents,
    homeCents: baseCents + commissionCents + slots.deliveryFee * 100,
    pickupCents: baseCents + commissionCents + slots.pickupFee * 100
  };
}

const money = (cents) => (cents / 100).toFixed(2);

function solve(slots) {
  const totals = amounts(slots);
  return {
    place: slots.place,
    buyer: slots.buyer,
    commissionPercent: slots.commissionPercent,
    sellerPrice: slots.sellerPrice,
    deliveryFee: slots.deliveryFee,
    commission: money(totals.commissionCents),
    home: money(totals.homeCents),
    pickup: money(totals.pickupCents)
  };
}

function render(solution) {
  return `Commission ${solution.commission}. Home ${solution.home}. Pick-up ${solution.pickup}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the notice must name the place of the fair");',
  'probe(typeof slots.buyer === "string" && slots.buyer.length > 0, "the case must name the buyer");',
  'probe(Number.isInteger(slots.sellerPrice) && slots.sellerPrice > 0, "the seller price must be a positive whole number");',
  'probe(Number.isInteger(slots.commissionPercent) && slots.commissionPercent > 0, "the commission must be a positive percentage");',
  'probe(Number.isInteger(slots.deliveryFee) && slots.deliveryFee > 0, "the home delivery must cost a positive amount");',
  'probe(Number.isInteger(slots.pickupFee) && slots.pickupFee >= 0, "the pick-up fee must be a non-negative amount");',
  'const commissionCents = slots.sellerPrice * slots.commissionPercent;',
  'const baseCents = slots.sellerPrice * 100;',
  'const homeCents = baseCents + commissionCents + slots.deliveryFee * 100;',
  'const pickupCents = baseCents + commissionCents + slots.pickupFee * 100;',
  'probe(homeCents > pickupCents, "home delivery must cost more than the pick-up point");',
  'const money = (cents) => (cents / 100).toFixed(2);',
  'return "Commission " + money(commissionCents) + ". Home " + money(homeCents) + ". Pick-up " + money(pickupCents) + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The notice makes the commission a percentage of the seller price, so ${solution.commissionPercent}% of ${solution.sellerPrice} is ${solution.commission}, paid by the buyer on top of the price rather than taken out of it.`,
    `The home total is the seller price plus that commission plus the stated delivery fee of ${solution.deliveryFee}, which gives ${solution.home}.`,
    `The pick-up total adds the same commission to the price without a delivery fee, so ${solution.buyer} pays ${solution.pickup} at the pick-up point in ${solution.place}, the difference being exactly the delivery fee.`
  ];
}

export const unit = 17;

export const cases = [
  {
    template: 'Fees and commissions as written',
    type: slugify('Fees and commissions as written'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
