/**
 * Section 18 of the adult-reasoning course: comparing two or three offers.
 *
 * Every variant prints one shopper's note and two washing-powder boxes: the
 * note says to compare the price per 100 washes after adding delivery, ignore
 * the scent, and fall back to the lighter box only when the difference per 100
 * is under 5. The variants change the shopper, the prices, the wash counts, the
 * delivery fees, and the box weights, so the family derives both costs, the
 * difference, and the chosen box from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const NOTE_PATTERN =
  /^([A-Z][a-z]+)’s note: “I compare the price per 100 washes after adding delivery\. I ignore scent\. If the difference per 100 is under (\d+), I choose the lighter box\.”/m;
const OFFER_A_PATTERN = /^A: (\d+), (\d+) washes, delivery (\d+), ([\d.]+) kg\.$/m;
const OFFER_B_PATTERN = /^B: (\d+), (\d+) washes, delivery (\d+), ([\d.]+) kg\.$/m;

function offer(match) {
  return {
    price: Number(match[1]),
    washes: Number(match[2]),
    delivery: Number(match[3]),
    weight: Number(match[4])
  };
}

function parse(statement) {
  const note = NOTE_PATTERN.exec(statement);
  const a = OFFER_A_PATTERN.exec(statement);
  const b = OFFER_B_PATTERN.exec(statement);
  if (note === null || a === null || b === null) {
    throw new Error('the statement does not describe the note and the two offers');
  }
  return { shopper: note[1], threshold: Number(note[2]), a: offer(a), b: offer(b) };
}

/** The price per 100 washes of one offer, in cents, delivery included. */
function perHundredCents(box) {
  return ((box.price + box.delivery) * 10000) / box.washes;
}

function solve(slots) {
  const aCents = perHundredCents(slots.a);
  const bCents = perHundredCents(slots.b);
  const differenceCents = Math.abs(aCents - bCents);
  let choice;
  if (differenceCents < slots.threshold * 100) {
    choice = slots.a.weight <= slots.b.weight ? 'A' : 'B';
  } else {
    choice = aCents <= bCents ? 'A' : 'B';
  }
  return {
    shopper: slots.shopper,
    a: (aCents / 100).toFixed(2),
    b: (bCents / 100).toFixed(2),
    difference: (differenceCents / 100).toFixed(2),
    choice
  };
}

function render(solution) {
  return `A ${solution.a}, B ${solution.b}, difference ${solution.difference}. Chooses ${solution.choice}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const perHundredCents = (box) => ((box.price + box.delivery) * 10000) / box.washes;',
  'const aCents = perHundredCents(slots.a);',
  'const bCents = perHundredCents(slots.b);',
  'probe(Number.isInteger(aCents) && Number.isInteger(bCents), "both costs per 100 washes must be whole cents");',
  'const differenceCents = Math.abs(aCents - bCents);',
  'const useWeight = differenceCents < slots.threshold * 100;',
  'const choice = useWeight ? (slots.a.weight <= slots.b.weight ? "A" : "B") : (aCents <= bCents ? "A" : "B");',
  'const money = (cents) => (cents / 100).toFixed(2);',
  'return "A " + money(aCents) + ", B " + money(bCents) + ", difference " + money(differenceCents) + ". Chooses " + choice + ".";'
].join('\n');

function explain(slots, solution) {
  const underThreshold = Math.round(Number(solution.difference) * 100) < slots.threshold * 100;
  return [
    'The note fixes one measure, the price per 100 washes after adding delivery, so the scent comparison is set aside.',
    underThreshold
      ? `Box A costs ${solution.a} per 100 washes and box B costs ${solution.b}, so the difference per 100 is ${solution.difference}, which is under ${slots.threshold} and therefore too small to decide on.`
      : `Box A costs ${solution.a} per 100 washes and box B costs ${solution.b}, so the difference per 100 is ${solution.difference}, which is not under ${slots.threshold}.`,
    underThreshold
      ? `${slots.shopper} therefore falls back to the lighter box, box ${solution.choice}.`
      : `Because the difference is not under the threshold, ${slots.shopper} takes the cheaper box on that measure, and that is box ${solution.choice}.`
  ];
}

export const unit = 18;

export const cases = [
  {
    template: 'Comparing two or three offers',
    type: slugify('Comparing two or three offers'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
