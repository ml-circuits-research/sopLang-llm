/**
 * Section 77 of the logical-reasoning book: a word that changes meaning.
 *
 * Every case posts a notice in a named place whose first line uses one word
 * ("light") for weight and whose later line uses the same spelling for
 * illumination. One person acts on the second reading as if it were the first,
 * a second person names the shift, and a third insists a repeated word always
 * keeps one meaning. The case data changes the place and the three names; the
 * reasoning is fixed, so the printed verdict carries no case data: the word
 * did two jobs, and the two lines were about different things.
 *
 * The family reads the notice, the lamp carrier, the person who reports the
 * shift, and the person who denies it, then renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const NOTICE_PATTERN =
  /Notice in ([^:]+): “Use only light tools on this floor\.” A later line on the same notice uses “light” to mean illumination \(“keep a light on”\)\. ([A-Za-z]+) carries a heavy lamp because “light is required\.” ([A-Za-z]+) says the word shifted: first “not-heavy,” then “illumination\.” ([A-Za-z]+) says a repeated word always keeps one meaning\./;

function parse(statement) {
  const notice = NOTICE_PATTERN.exec(statement);
  if (notice === null) {
    throw new Error('the statement does not record the notice and its three speakers');
  }
  return {
    place: notice[1].trim(),
    carrier: notice[2],
    shifted: notice[3],
    keeper: notice[4]
  };
}

function solve(slots) {
  if (slots.carrier === slots.shifted || slots.carrier === slots.keeper || slots.shifted === slots.keeper) {
    throw new Error('the notice needs three different people');
  }
  return {
    place: slots.place,
    carrier: slots.carrier,
    shifted: slots.shifted,
    keeper: slots.keeper
  };
}

function render(solution) {
  return 'Equivocation: one spelling, two jobs. The floor rule was about weight. The lamp line is about visibility.';
}

const COMPUTE = [
  'const slots = $slots;',
  'return "Equivocation: one spelling, two jobs. The floor rule was about weight. The lamp line is about visibility.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The notice in ${solution.place} uses “light” first for weight and then for illumination, so one spelling carries two jobs.`,
    `${solution.shifted} names that shift, while ${solution.keeper} wrongly assumes a repeated word must keep a single meaning.`,
    `${solution.carrier} acts on the illumination line as though the floor rule about weight had spoken, which crosses the two readings.`
  ];
}

export const unit = 77;

export const cases = [
  {
    template: 'A word that changes meaning',
    type: slugify('A word that changes meaning'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
