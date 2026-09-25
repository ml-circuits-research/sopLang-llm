/**
 * Family N21 of the world seed book: negotiation, coalitions, and agreement.
 *
 * Every problem states the seats of three groups and the seat threshold a
 * governing coalition must reach, and the rules define a winning coalition (the
 * seats of its members reach the threshold) and a minimal winning coalition
 * (winning, but losing any member makes it lose). The family enumerates every
 * non-empty subset of the groups in the printed order — single groups first,
 * then pairs, then the full set — keeps the minimal winning ones, and prints
 * each as `<label> with <seats> seats`, joined by semicolons.
 *
 * The four grades share one algorithm; they differ only in the stated seats
 * (5..8 for A, 3..7 for B, 2..3 for C) and the threshold (6..9).
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const SEAT_PATTERN = /([A-Z])=(\d+)/g;
const THRESHOLD_PATTERN = /needs at least (\d+) seats/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const groups = [];
  for (const match of facts.matchAll(SEAT_PATTERN)) {
    groups.push({ label: match[1], seats: Number(match[2]) });
  }
  if (groups.length < 2) {
    throw new Error('the statement states fewer than two groups with seats');
  }
  const threshold = THRESHOLD_PATTERN.exec(facts);
  if (threshold === null) {
    throw new Error('the statement states no governing threshold');
  }
  if (!/Minimal winning means it is winning but removing any member makes it lose/.test(blocks.Rules)) {
    throw new Error('the rules do not define a minimal winning coalition');
  }
  return {
    groups,
    threshold: Number(threshold[1]),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

/** Every non-empty subset of the group indices, by size and then by index order. */
function subsetsOf(count) {
  const subsets = [];
  const build = (start, picked) => {
    if (picked.length > 0) {
      subsets.push(picked.slice());
    }
    for (let index = start; index < count; index += 1) {
      picked.push(index);
      build(index + 1, picked);
      picked.pop();
    }
  };
  build(0, []);
  return subsets;
}

function solve(slots) {
  const winning = [];
  for (const subset of subsetsOf(slots.groups.length)) {
    const seats = subset.reduce((sum, index) => sum + slots.groups[index].seats, 0);
    if (seats < slots.threshold) {
      continue;
    }
    const minimal = subset.every((index) => seats - slots.groups[index].seats < slots.threshold);
    if (minimal) {
      winning.push({ label: subset.map((index) => slots.groups[index].label).join(''), seats });
    }
  }
  if (winning.length === 0) {
    throw new Error('no coalition reaches the stated threshold minimally');
  }
  return { winning, crossDomain: slots.crossDomain };
}

function render(solution) {
  const main = `${solution.winning.map((coalition) => `${coalition.label} with ${coalition.seats} seats`).join('; ')}.`;
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
  'const subsets = [];',
  'const build = (start, picked) => {',
  '  if (picked.length > 0) {',
  '    subsets.push(picked.slice());',
  '  }',
  '  for (let index = start; index < slots.groups.length; index += 1) {',
  '    picked.push(index);',
  '    build(index + 1, picked);',
  '    picked.pop();',
  '  }',
  '};',
  'build(0, []);',
  'const winning = [];',
  'for (const subset of subsets) {',
  '  let seats = 0;',
  '  for (const index of subset) {',
  '    seats += slots.groups[index].seats;',
  '  }',
  '  if (seats < slots.threshold) {',
  '    continue;',
  '  }',
  '  const minimal = subset.every((index) => seats - slots.groups[index].seats < slots.threshold);',
  '  if (minimal) {',
  '    winning.push({ label: subset.map((index) => slots.groups[index].label).join(""), seats: seats });',
  '  }',
  '}',
  'probe(winning.length > 0, "the stated seats must leave at least one minimal winning coalition");',
  'const main = winning.map((coalition) => coalition.label + " with " + coalition.seats + " seats").join("; ") + ".";',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  const groupList = slots.groups.map((group) => `${group.label}=${group.seats}`).join(', ');
  const printed = solution.winning.map((coalition) => `${coalition.label} (${coalition.seats})`).join(', ');
  return [
    `The stated seats are ${groupList}, and a coalition is winning when its seat total reaches ${slots.threshold}.`,
    'Enumerating every non-empty subset and keeping the ones that reach the threshold gives the winning coalitions.',
    `A winning coalition is minimal exactly when dropping any of its members leaves the rest below ${slots.threshold}; ${solution.winning.length === 1 ? 'one coalition passes' : 'the coalitions that pass are'} ${printed}.`
  ];
}

function caseFor(grade) {
  const template = `Negotiation, coalitions, and agreement (grade ${grade})`;
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

export const unit = 'N21';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
