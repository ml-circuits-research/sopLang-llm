/**
 * Section 20 of the adult-reasoning course: hidden errors in published sums.
 *
 * Every variant prints a shop notice that multiplies a jar count by an each
 * price, states a total larger than the true product, and then advertises that
 * difference as a saving. The variants change the village, the count, the each
 * price, the printed total, and the person who rebuilds the product, so the
 * family recomputes the product, measures the discrepancy in both directions,
 * and shows that the advertised saving is that discrepancy with its sign
 * flipped.
 */

import { slugify } from '../../naming.mjs';

const NOTICE_PATTERN = /Notice in ([^:]+):/;
const PRODUCT_PATTERN = /(\d+) jars at (\d+) each, total (\d+),/;
const SAVING_PATTERN = /a saving of (\d+) against the each-price\./;
const REBUILDER_PATTERN = /^([A-Z][a-z]+) rebuilds the product\./m;

function parse(statement) {
  const notice = NOTICE_PATTERN.exec(statement);
  const product = PRODUCT_PATTERN.exec(statement);
  const saving = SAVING_PATTERN.exec(statement);
  const rebuilder = REBUILDER_PATTERN.exec(statement);
  if (notice === null || product === null || saving === null || rebuilder === null) {
    throw new Error('the statement does not describe the notice, its total, and its saving');
  }
  const jars = Number(product[1]);
  const each = Number(product[2]);
  const noticeTotal = Number(product[3]);
  const claimedSaving = Number(saving[1]);
  return {
    place: notice[1],
    rebuilder: rebuilder[1],
    jars,
    each,
    noticeTotal,
    claimedSaving,
    product: jars * each
  };
}

function solve(slots) {
  const discrepancy = slots.noticeTotal - slots.product;
  if (discrepancy === 0) {
    throw new Error('the notice total equals the product, so there is no error to locate');
  }
  if (slots.claimedSaving !== Math.abs(discrepancy)) {
    throw new Error('the advertised saving is not the notice discrepancy with its sign flipped');
  }
  return {
    place: slots.place,
    rebuilder: slots.rebuilder,
    jars: slots.jars,
    each: slots.each,
    product: slots.product,
    discrepancy,
    direction: discrepancy > 0 ? `${discrepancy} higher, not lower` : `${-discrepancy} lower, not higher`
  };
}

function render(solution) {
  return `The correct product is ${solution.product}. The notice is ${solution.direction}. The “saving” is the sign flipped.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const discrepancy = slots.noticeTotal - slots.product;',
  'probe(discrepancy !== 0, "the notice total must differ from the product, or there is no error to find");',
  'const direction = discrepancy > 0 ? discrepancy + " higher, not lower" : (-discrepancy) + " lower, not higher";',
  'return "The correct product is " + slots.product + ". The notice is " + direction + ". The “saving” is the sign flipped.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${solution.rebuilder} rebuilds the product in the notice from ${solution.place}, and ${solution.jars} jars at ${solution.each} each give ${solution.product}.`,
    `The printed total is ${slots.noticeTotal}, which is ${solution.direction} than the product, so the notice overstates the sum rather than cutting it.`,
    `A saving against the each price would have to be a total below ${solution.product}, and the advertised ${slots.claimedSaving} is exactly the discrepancy in the other direction, so the "saving" is the sign flipped.`
  ];
}

export const unit = 20;

export const cases = [
  {
    template: 'Hidden errors in published sums',
    type: slugify('Hidden errors in published sums'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
