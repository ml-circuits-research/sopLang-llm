/**
 * Family N19 of the world seed book: common resources and avoiding depletion.
 *
 * Every problem states a shared resource with a starting stock, a regeneration
 * per period, a number of users and a per-user withdrawal. The rules define the
 * stock equation `end = start + regeneration − total harvest` and the
 * non-depleting test (the stock must not fall below its starting level), and
 * the task asks for the end stock, the depleting verdict, and the equal
 * per-user share that would exactly match regeneration.
 *
 * The four grades share one algorithm; they differ only in the stated numbers
 * (starting stock 70/80/90/100, regeneration 10..14, 4..7 users, 3..7 taken
 * each). The later grades of this family carry no appended cross-domain check,
 * but the descriptor is threaded through parse/render/compute like every other
 * family so a statement that grows one is handled without a code change.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const STOCK_PATTERN = /has (\d+(?:\.\d+)?) (?:fish|units|animals|trees) at the start of the period and regenerates (\d+(?:\.\d+)?)/;
const USERS_PATTERN = /There are (\d+) users, each planning to take (\d+(?:\.\d+)?)/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const stock = STOCK_PATTERN.exec(facts);
  if (stock === null) {
    throw new Error('the statement states no starting stock and regeneration');
  }
  const users = USERS_PATTERN.exec(facts);
  if (users === null) {
    throw new Error('the statement states no users and per-user withdrawal');
  }
  if (!/should not decline below its starting level/.test(facts)) {
    throw new Error('the statement does not define non-depleting as staying at or above the starting level');
  }
  return {
    start: Number(stock[1]),
    regeneration: Number(stock[2]),
    users: Number(users[1]),
    withdrawalPerUser: Number(users[2]),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  if (!(slots.users > 0)) {
    throw new Error('the number of users must be positive to share the regeneration');
  }
  const totalHarvest = slots.users * slots.withdrawalPerUser;
  const endStock = slots.start + slots.regeneration - totalHarvest;
  return {
    totalHarvest,
    endStock,
    nonDepleting: endStock >= slots.start,
    equalShare: slots.regeneration / slots.users,
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const verdict = solution.nonDepleting ? 'non-depleting' : 'depleting';
  const main = `End stock ${solution.endStock}; ${verdict}. Equal regeneration-matching share: ${solution.equalShare.toFixed(2)} each.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const WIRES = [
  {
    name: 'cross',
    command: 'jsEval',
    body: [
      CROSS_DOMAIN_SOURCE,
      'const slots = $slots;',
      'return { suffix: renderCrossDomain(slots.crossDomain) };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const slots = $slots;',
  'const totalHarvest = slots.users * slots.withdrawalPerUser;',
  'const endStock = slots.start + slots.regeneration - totalHarvest;',
  'probe(endStock >= 0, "the stated stock equation must not drive the stock below zero");',
  'const equalShare = slots.regeneration / slots.users;',
  'const verdict = endStock >= slots.start ? "non-depleting" : "depleting";',
  'const main = "End stock " + endStock + "; " + verdict + ". Equal regeneration-matching share: " + equalShare.toFixed(2) + " each.";',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The total harvest is ${slots.users} users × ${slots.withdrawalPerUser} each = ${solution.totalHarvest}.`,
    `The stock equation gives ${slots.start} + ${slots.regeneration} − ${solution.totalHarvest} = ${solution.endStock} at the end of the period.`,
    `Because the end stock is ${solution.nonDepleting ? 'at or above' : 'below'} the starting level of ${slots.start}, the planned use is ${solution.nonDepleting ? 'non-depleting' : 'depleting'}.`,
    `Matching regeneration exactly means sharing ${slots.regeneration} fish among ${slots.users} users, so each may take ${slots.regeneration} ÷ ${slots.users} = ${solution.equalShare.toFixed(2)}.`
  ];
}

function caseFor(grade) {
  const template = `Common resources and avoiding depletion (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N19';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
