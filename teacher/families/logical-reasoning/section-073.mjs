/**
 * Section 73 of the logical-reasoning book: only two rooms when the building
 * has more.
 *
 * Every case records a speaker who offers an either-or about banning the
 * Saturday market or accepting chaos, a page that already lists three further
 * options, and two commentators: one who points at those other listed rooms
 * and one who claims extra rooms do not count while a speaker is urgent. The
 * case data changes the place and the three commentators; the reasoning is
 * fixed: the page lists more than the two rooms the dilemma admits, so the
 * dilemma is not forced.
 *
 * The family counts the horns of the quoted either-or and the listed options
 * and renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const DILEMMA_PATTERN =
  /^Speaker in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): “Either ([^”]+) or ([^”]+)\.” Listed options on the same page: ([^.]+)\. ([A-Z][a-z]+) accepts the either-or\. ([A-Z][a-z]+) points at the other listed rooms\. ([A-Z][a-z]+) says extra rooms do not count if a speaker is urgent\./;

function parse(statement) {
  const dilemma = DILEMMA_PATTERN.exec(statement);
  if (dilemma === null) {
    throw new Error('the statement does not record the either-or, the listed options, and the two commentators');
  }
  const options = dilemma[4]
    .split(',')
    .map((option) => option.trim())
    .filter((option) => option.length > 0);
  if (options.length < 3) {
    throw new Error('the statement does not list three further options beside the either-or');
  }
  return {
    place: dilemma[1],
    horns: [dilemma[2].trim(), dilemma[3].trim()],
    options,
    believer: dilemma[5],
    critic: dilemma[6],
    sloganeer: dilemma[7]
  };
}

/**
 * A dilemma is forced only when the page offers nothing but its two horns. The
 * page here lists each further room by name, so the two horns are not the whole
 * building and the dilemma is not forced.
 */
function solve(slots) {
  const rooms = slots.horns.length;
  const listedRooms = slots.options.length;
  return {
    place: slots.place,
    options: slots.options,
    rooms,
    listedRooms,
    forced: listedRooms <= rooms
  };
}

function render(solution) {
  const verdict = solution.forced ? 'Yes' : 'No';
  return `${verdict}. The page already lists more than two rooms. Urgency does not delete lines.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const forced = slots.options.length <= slots.horns.length;',
  'probe(forced === false, "a page that lists further rooms does not force the either-or");',
  'const verdict = forced ? "Yes" : "No";',
  'return verdict + ". The page already lists more than two rooms. Urgency does not delete lines.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The speaker in ${slots.place} offered two rooms: ${slots.horns.join(' and ')}.`,
    `The same page lists ${solution.listedRooms} further rooms: ${slots.options.join(', ')}.`,
    `${slots.critic} points at those listed rooms, so the pair on offer is not the whole page.`,
    `Urgency is how the speaker feels; it does not edit the list, so the dilemma is ${solution.forced ? '' : 'not '}forced.`
  ];
}

export const unit = 73;

export const cases = [
  {
    template: 'Only two rooms when the building has more',
    type: slugify('Only two rooms when the building has more'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
