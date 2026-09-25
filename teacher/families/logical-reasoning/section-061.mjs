/**
 * Section 61 of the logical-reasoning book: a percent without a base.
 *
 * Every case quotes a poster that announces a percentage cut, reports that no
 * original price, date, or basket is given, and stages three reactions: treat
 * the poster as a finished quantity, notice that a percent is a sentence with a
 * hole until the base is written, or invent a base to be helpful. The place,
 * the percentage, the invented base, and the three names change with the case;
 * the verdict does not: only a bare percent is on the poster, and the invented
 * base is a second poster rather than information the poster carried.
 */

import { slugify } from '../../naming.mjs';

const POSTER_PATTERN =
  /^Poster in ([A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)*): “Prices down (\d+)%!” No original price, no date, no basket\. ([A-Z][a-z]+) treats the poster as a finished quantity\. ([A-Z][a-z]+) says a percent is a sentence with a hole until the base is written\. ([A-Z][a-z]+) invents a base of (\d+) to be helpful\.\n\nQuestion\. What quantity is actually on the poster\?$/;

function parse(statement) {
  const poster = POSTER_PATTERN.exec(statement);
  if (poster === null) {
    throw new Error('the statement does not record the poster, the missing base, and the three reactions');
  }
  return {
    place: poster[1],
    percent: Number(poster[2]),
    finisher: poster[3],
    baseFinder: poster[4],
    inventor: poster[5],
    inventedBase: Number(poster[6])
  };
}

function solve(slots) {
  if (!Number.isInteger(slots.percent) || slots.percent <= 0 || slots.percent >= 100) {
    throw new Error('the poster must announce a percentage cut between zero and one hundred');
  }
  if (!Number.isInteger(slots.inventedBase) || slots.inventedBase <= 0) {
    throw new Error('the helpful story must invent a positive whole-number base');
  }
  const people = [slots.finisher, slots.baseFinder, slots.inventor];
  if (new Set(people).size !== people.length) {
    throw new Error('the three reactions must come from three different people');
  }
  return {
    place: slots.place,
    percent: slots.percent,
    inventedBase: slots.inventedBase,
    finisher: people[0],
    baseFinder: people[1],
    inventor: people[2]
  };
}

function render(solution) {
  return `Only a bare percent. Inventing ${solution.inventedBase} writes a second poster.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const percent = Number(slots.percent);',
  'const inventedBase = Number(slots.inventedBase);',
  'probe(Number.isInteger(inventedBase) && inventedBase > 0, "the helpful story must invent a positive whole-number base");',
  'const people = [slots.finisher, slots.baseFinder, slots.inventor];',
  'return "Only a bare percent. Inventing " + inventedBase + " writes a second poster.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The poster in ${solution.place} announces a cut of ${solution.percent}%, but a percent is a sentence with a hole: it is always a percent of something, and no original price, date, or basket is listed.`,
    `${solution.finisher} treats the poster as a finished quantity, which reads a number the page never printed.`,
    `${solution.baseFinder} keeps the hole open and asks for the base, and the “down” also needs the date it is measured from.`,
    `${solution.inventor} fills the hole with a base of ${solution.inventedBase} to be helpful, but a helpful invention is still an invention: it writes a second poster instead of reading this one.`
  ];
}

export const unit = 61;

export const cases = [
  {
    template: 'A percent without a base',
    type: slugify('A percent without a base'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
