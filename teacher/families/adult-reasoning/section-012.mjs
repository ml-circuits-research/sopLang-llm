/**
 * Section 12 of the adult-reasoning course: percents, discounts, and markups.
 *
 * Every variant posts the same two-step discount notice in a shop and prints
 * the original coat ticket and the customer who holds the store card. The
 * printed answer applies the second percent to the already reduced price, then
 * shows what happens when the two percents are instead added against the
 * original price, and finally the gap between the two methods. The variants
 * change the village, the two percents, the ticket, and the customer, so the
 * case derives all three amounts with scaled integer arithmetic on cents.
 */

import { slugify } from '../../naming.mjs';

const SHOP_PATTERN = /Shop in ([^:]+):/;
const NOTICE_PATTERN =
  /“(\d+)% off coats\. At till 2, another (\d+)% off the already reduced price, only with the store card\. The discounts do NOT add as (\d+)\+(\d+) of the original price\.”/;
const TICKET_PATTERN = /Coat original ticket (\d+)\. ([A-Z][a-z]+) has the card, till 2\./;

function formatCents(cents) {
  return `${Math.trunc(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;
}

function parse(statement) {
  const shop = SHOP_PATTERN.exec(statement);
  const notice = NOTICE_PATTERN.exec(statement);
  const ticket = TICKET_PATTERN.exec(statement);
  if (shop === null || notice === null || ticket === null) {
    throw new Error('the statement does not post the two-step discount notice with its ticket and card holder');
  }
  const firstPercent = Number(notice[1]);
  const secondPercent = Number(notice[2]);
  if (Number(notice[3]) !== firstPercent || Number(notice[4]) !== secondPercent) {
    throw new Error('the notice repeats a different pair of percents than the one it prints on the till');
  }
  const originalCents = Number(ticket[1]) * 100;
  if (!(firstPercent >= 1) || !(secondPercent >= 1) || firstPercent + secondPercent >= 100) {
    throw new Error('the two percents must each be at least one and must leave a positive price when added');
  }
  return {
    shop: shop[1].trim(),
    customer: ticket[2],
    originalCents,
    firstPercent,
    secondPercent,
    tillLoyalty: /At till 2, another/.test(statement)
  };
}

function solve(slots) {
  const reducedCents = Math.round((slots.originalCents * (100 - slots.firstPercent)) / 100);
  const paidCents = Math.round((reducedCents * (100 - slots.secondPercent)) / 100);
  const wrongCents = Math.round(
    (slots.originalCents * (100 - slots.firstPercent - slots.secondPercent)) / 100
  );
  if (!(paidCents > wrongCents)) {
    throw new Error('the two-step discount must charge more than adding the percents, because both percents are positive');
  }
  return { paidCents, wrongCents, differenceCents: paidCents - wrongCents };
}

function render(solution) {
  return `${formatCents(solution.paidCents)}. Wrong method ${formatCents(solution.wrongCents)}, difference ${formatCents(solution.differenceCents)}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const format = (cents) => Math.trunc(cents / 100) + "." + String(cents % 100).padStart(2, "0");',
  'const reducedCents = Math.round((slots.originalCents * (100 - slots.firstPercent)) / 100);',
  'const paidCents = Math.round((reducedCents * (100 - slots.secondPercent)) / 100);',
  'const wrongCents = Math.round((slots.originalCents * (100 - slots.firstPercent - slots.secondPercent)) / 100);',
  'probe(paidCents < slots.originalCents, "the two-stage discount must lower the ticket");',
  'probe(paidCents > wrongCents, "adding the percents to the original price undercharges, so the wrong method must come out lower");',
  'return format(paidCents) + ". Wrong method " + format(wrongCents) + ", difference " + format(paidCents - wrongCents) + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The coat is ticketed at ${formatCents(slots.originalCents)} in ${slots.shop}, and ${slots.customer} holds the store card, so the till 2 discount applies after the ${slots.firstPercent}% reduction.`,
    `The first discount leaves ${formatCents(Math.round((slots.originalCents * (100 - slots.firstPercent)) / 100))}, and ${slots.secondPercent}% of that reduced price brings the payment to ${formatCents(solution.paidCents)}.`,
    `Adding the percents treats them as ${slots.firstPercent + slots.secondPercent}% of the original ticket, which gives ${formatCents(solution.wrongCents)} and is not what the notice says.`,
    `The two methods differ by ${formatCents(solution.differenceCents)} because the second percent is taken on the reduced price, not on the original ticket.`
  ];
}

export const unit = 12;

export const cases = [
  {
    template: 'Percents, discounts, and markups',
    type: slugify('Percents, discounts, and markups'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
