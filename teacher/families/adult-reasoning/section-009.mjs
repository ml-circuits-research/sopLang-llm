/**
 * Section 9 of the adult-reasoning course: offers, ads, and conditions.
 *
 * Every variant prints a shop leaflet whose large type advertises a from-price
 * for the Start model, whose small type prices the Plus model with a case,
 * forbids stacking the store-card discount, and sets delivery at 20 under a 300
 * order. The buyer wants what the cover image shows, so the model is the Plus,
 * the card discount stays out, and delivery follows the printed threshold. The
 * cases change the town, the advertised from-price, the Plus price, and the
 * buyer, so the family derives the owed sum from the statement.
 */

import { slugify } from '../../naming.mjs';

const SHOP_PATTERN = /Shop leaflet, ([^:]+): “HEADPHONES (\d+)” in large type\./;
const SMALL_TYPE_PATTERN =
  /Small type: “from-price, Start model, stock (\d+)\. Start has no case\. Plus costs (\d+) with a case\. The (\d+)% store-card discount does NOT stack with this from-price\. Delivery (\d+) under a (\d+) order, (\d+) from (\d+)\. Ends (\w+) (\d{1,2}:\d{2})\. The cover image is illustrative and shows the Plus model\.”/;
const BUYER_PATTERN =
  /([A-Z][a-z]+) has a card, wants “what is on the cover”, orders (\w+) unit on (\w+), expects (\d+) minus (\d+)%, free delivery\./;

function parse(statement) {
  const shop = SHOP_PATTERN.exec(statement);
  const small = SMALL_TYPE_PATTERN.exec(statement);
  const buyer = BUYER_PATTERN.exec(statement);
  if (shop === null || small === null || buyer === null) {
    throw new Error('the statement does not print the leaflet, its small type, and the buyer');
  }
  return {
    place: shop[1],
    fromPrice: Number(shop[2]),
    stock: Number(small[1]),
    plusPrice: Number(small[2]),
    discountPercent: Number(small[3]),
    deliveryUnder: Number(small[4]),
    deliveryThreshold: Number(small[5]),
    deliveryFrom: Number(small[6]),
    discountStacks: !/does NOT stack/.test(statement),
    coverModel: /cover image is illustrative and shows the (\w+) model/.exec(statement)[1],
    buyer: {
      name: buyer[1],
      units: buyer[2],
      day: buyer[3],
      expectedPrice: Number(buyer[4]),
      expectedDiscount: Number(buyer[5])
    }
  };
}

function solve(slots) {
  if (slots.discountStacks) {
    throw new Error('the leaflet forbids stacking the store-card discount with the from-price');
  }
  if (slots.buyer.expectedPrice !== slots.fromPrice) {
    throw new Error('the buyer expects the advertised from-price, not the price of the cover model');
  }
  const model = slots.coverModel;
  const price = slots.plusPrice;
  const delivery = price < slots.deliveryThreshold ? slots.deliveryUnder : slots.deliveryFrom;
  return {
    model,
    price,
    delivery,
    discountPercent: slots.discountPercent,
    total: price + delivery
  };
}

function render(solution) {
  return `${solution.model}, ${solution.price} + delivery ${solution.delivery} = ${solution.total}. No ${solution.discountPercent}%.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the leaflet must name the town it belongs to");',
  'probe(typeof slots.buyer === "object" && slots.buyer !== null, "the leaflet must name the buyer");',
  'probe(typeof slots.buyer.name === "string" && slots.buyer.name.length > 0, "the buyer name must be on record");',
  'probe(Number.isInteger(slots.stock) && slots.stock > 0, "the small type must state a positive stock");',
  'probe(Number.isInteger(slots.fromPrice) && slots.fromPrice > 0, "the large type must advertise a positive price");',
  'probe(Number.isInteger(slots.plusPrice) && slots.plusPrice > slots.fromPrice, "the Plus model with its case must cost more than the advertised from-price");',
  'probe(Number.isInteger(slots.discountPercent) && slots.discountPercent > 0, "the store-card discount must be a positive percentage");',
  'probe(slots.deliveryUnder >= 0 && slots.deliveryFrom >= 0, "the delivery fees must not be negative");',
  'probe(Number.isInteger(slots.deliveryThreshold) && slots.deliveryThreshold > 0, "the delivery threshold must be a positive order value");',
  'probe(slots.discountStacks === false, "the card discount must not stack with the from-price");',
  'probe(slots.buyer.expectedPrice === slots.fromPrice, "the buyer expects the advertised from-price");',
  'probe(slots.buyer.expectedDiscount === slots.discountPercent, "the buyer expects the advertised card discount");',
  'const price = slots.plusPrice;',
  'const delivery = price < slots.deliveryThreshold ? slots.deliveryUnder : slots.deliveryFrom;',
  'probe(delivery === slots.deliveryUnder || delivery === slots.deliveryFrom, "the delivery fee must be one of the two printed fees");',
  'const total = price + delivery;',
  'probe(total >= price && total > 0, "the owed sum must cover the model price");',
  'return slots.coverModel + ", " + price + " + delivery " + delivery + " = " + total + ". No " + slots.discountPercent + "%.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The ${slots.place} leaflet prints only a from-price for the Start model in its large type, and ${slots.buyer.name} asked for what the cover shows, which the small type says is the Plus model with a case.`,
    `The card discount does not stack with this from-price, so the expected ${slots.fromPrice} minus ${slots.discountPercent}% is not the sum the buyer owes, and the card stays out of the calculation.`,
    `The Plus costs ${solution.price}, which is ${solution.price < slots.deliveryThreshold ? 'under' : 'at or above'} the ${slots.deliveryThreshold} delivery threshold, so delivery is ${solution.delivery} and the sum is ${solution.total}.`
  ];
}

export const unit = 9;

export const cases = [
  {
    template: 'Offers, ads, and conditions',
    type: slugify('Offers, ads, and conditions'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
