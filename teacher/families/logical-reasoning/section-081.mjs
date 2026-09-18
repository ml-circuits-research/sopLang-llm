/**
 * Section 81 of the logical-reasoning book: looking for the agreeable.
 *
 * Every case has one person file only the clippings that suit a view already
 * held and throw the rest away, a second person write the opposite headline
 * and try to fill it from the same pile before deciding, and a third defend
 * the tidy pile as a method. The case data changes the two names and the
 * place; the reasoning is fixed, so the printed verdict names the person who
 * runs the counter-check and calls the one-sided filing confirmation bias.
 *
 * The family reads the two procedures and renders the printed verdict with the
 * name of the person who fights the lean.
 */

import { slugify } from '../../naming.mjs';

const AGREEABLE_PATTERN =
  /([A-Za-z]+) in ([A-Za-z ]+) keeps only clippings that suit a view already held and throws the others away\. ([A-Za-z]+) writes the opposite headline and tries to fill it from the same pile before deciding\. ([A-Za-z]+) says a tidy pile is already a method\./;

function parse(statement) {
  const agreeable = AGREEABLE_PATTERN.exec(statement);
  if (agreeable === null) {
    throw new Error('the statement does not record the two filing procedures and the third speaker');
  }
  return {
    keeper: agreeable[1],
    place: agreeable[2].trim(),
    repairer: agreeable[3],
    enthusiast: agreeable[4]
  };
}

function solve(slots) {
  if (slots.keeper === slots.repairer || slots.keeper === slots.enthusiast || slots.repairer === slots.enthusiast) {
    throw new Error('the case needs three different speakers');
  }
  return {
    keeper: slots.keeper,
    place: slots.place,
    repairer: slots.repairer,
    enthusiast: slots.enthusiast
  };
}

function render(solution) {
  return `${solution.repairer}’s. Hunting only for friends of a view is confirmation bias as a filing system.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const repairer = slots.repairer;',
  'probe(typeof repairer === "string" && repairer.length > 0, "the case must name the person who writes the opposite headline");',
  'probe(typeof slots.keeper === "string" && slots.keeper.length > 0, "the case must name the person who keeps only the agreeable clippings");',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place");',
  'probe(repairer !== slots.keeper && repairer !== slots.enthusiast && slots.keeper !== slots.enthusiast, "the case must name three different speakers");',
  'return repairer + "’s. Hunting only for friends of a view is confirmation bias as a filing system.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${solution.keeper} in ${solution.place} keeps only the clippings that suit a view already held, which is confirmation bias run as a filing system.`,
    `${solution.repairer} writes the opposite headline and tries to fill it from the same pile before deciding, so the other view has to be searched for rather than merely promised.`,
    `${solution.enthusiast} is wrong that a tidy pile is already a method: a shrine is tidy and still one-sided, and procedure beats a promise to be fair later.`
  ];
}

export const unit = 81;

export const cases = [
  {
    template: 'Looking for the agreeable',
    type: slugify('Looking for the agreeable'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
