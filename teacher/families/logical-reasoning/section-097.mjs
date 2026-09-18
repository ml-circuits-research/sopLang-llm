/**
 * Section 97 of the logical-reasoning book: precaution and panic.
 *
 * Every case posts a river board in a named place: a listed modest rise in the
 * level and a rare historical flood pictured from forty years ago, then three
 * responses to the page. The case data changes the place and the three names;
 * the reasoning is fixed: the old photograph is an available picture, not this
 * afternoon's deduction, the listed rise is a small change that calls for
 * small reversible acts, and the third reader matches act to that change
 * instead of treating the picture as a forecast or manners as a river gauge.
 * The family reads the board and renders the printed verdict with the matcher.
 */

import { slugify } from '../../naming.mjs';

const BOARD_PATTERN =
  /^River board in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): a listed modest rise in level; a rare historical flood is pictured from forty years ago\. ([A-Z][a-z]+) panics as if the picture were this afternoon\u2019s deduction\. ([A-Z][a-z]+) ignores the rise because panic is unseemly\. ([A-Z][a-z]+) matches act to the modest listed rise \(move loose gear\) without treating the old picture as today\u2019s forecast\./;

function parse(statement) {
  const board = BOARD_PATTERN.exec(statement);
  if (board === null) {
    throw new Error('the statement does not record the river board and its three responses');
  }
  return {
    place: board[1],
    panicker: board[2],
    ignorer: board[3],
    matcher: board[4]
  };
}

function solve(slots) {
  if (typeof slots.place !== 'string' || slots.place.length === 0) {
    throw new Error('the board must name the place of the river');
  }
  const responders = [slots.panicker, slots.ignorer, slots.matcher];
  if (!responders.every((name) => typeof name === 'string' && name.length > 0)) {
    throw new Error('the board must name the panicker, the ignorer, and the matcher');
  }
  if (new Set(responders).size !== responders.length) {
    throw new Error('the three responses must come from three different people');
  }
  return {
    place: slots.place,
    panicker: slots.panicker,
    ignorer: slots.ignorer,
    matcher: slots.matcher
  };
}

function render(solution) {
  return `${solution.matcher}. The picture is availability. The rise is a small listed change. Proportion is the adult tool.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const responders = [slots.panicker, slots.ignorer, slots.matcher];',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the board must name the place of the river");',
  'probe(responders.every((name) => typeof name === "string" && name.length > 0), "the board must name the panicker, the ignorer, and the matcher");',
  'probe(new Set(responders).size === responders.length, "the three responses must come from three different people");',
  'return slots.matcher + ". The picture is availability. The rise is a small listed change. Proportion is the adult tool.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The river board in ${solution.place} lists a modest rise in level and a rare historical flood pictured from forty years ago.`,
    `${solution.panicker} treats the old photograph as this afternoon's deduction; availability is not a forecast of the current level.`,
    `${solution.ignorer} waves the rise away because panic is unseemly, but the listed change still calls for a small reversible act.`,
    `${solution.matcher} matches act to the modest listed rise by moving loose gear without treating the old picture as today's forecast; proportion is the adult tool.`
  ];
}

export const unit = 97;

export const cases = [
  {
    template: 'Precaution and panic',
    type: slugify('Precaution and panic'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
