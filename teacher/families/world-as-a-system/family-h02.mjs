/**
 * Family H2 of the world seed book: dates, durations, and centuries.
 *
 * Every problem states a foundation year, a reorganization year, and the
 * century convention ("years 1-100 are the 1st century, 101-200 the 2nd, and so
 * on"). The printed answer is the elapsed time by subtraction followed by the
 * label of the century each year falls in, and the century is the stated
 * function `floor((year - 1) / 100) + 1` applied mechanically, not the first two
 * digits read off the year.
 *
 * The four grades differ only in the stated years (the boundary cases move from
 * the 14th to the 19th century), so they share one parse, solve, render, and
 * compute. No problem of this family carries an appended cross-domain check, so
 * the family has no cross-domain plumbing.
 */

import { blocksOf, stripCrossDomain } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const EVENT_PATTERN = /An institution was founded in (\d{1,4}) and reorganized in (\d{1,4})/;

/** The stated convention: years 1-100 are the 1st century, 101-200 the 2nd, and so on. */
function centuryOf(year) {
  return Math.floor((year - 1) / 100) + 1;
}

function ordinal(value) {
  const remainder = value % 100;
  const suffix = remainder >= 11 && remainder <= 13
    ? 'th'
    : value % 10 === 1
      ? 'st'
      : value % 10 === 2
        ? 'nd'
        : value % 10 === 3
          ? 'rd'
          : 'th';
  return `${value}${suffix}`;
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const match = EVENT_PATTERN.exec(facts);
  if (match === null) {
    throw new Error('the statement does not date a foundation and a reorganization');
  }
  const start = Number(match[1]);
  const end = Number(match[2]);
  if (start >= end) {
    throw new Error('the stated reorganization does not follow the foundation');
  }
  return { start, end };
}

function solve(slots) {
  return {
    start: slots.start,
    end: slots.end,
    years: slots.end - slots.start,
    startCentury: centuryOf(slots.start),
    endCentury: centuryOf(slots.end)
  };
}

function render(solution) {
  return `${solution.years} years; ${solution.start} is in the ${ordinal(solution.startCentury)} century and ${solution.end} in the ${ordinal(solution.endCentury)} century.`;
}

const WIRES = [
  {
    name: 'centuries',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const centuryOf = (year) => Math.floor((year - 1) / 100) + 1;',
      'const startCentury = centuryOf(slots.start);',
      'const endCentury = centuryOf(slots.end);',
      'probe(startCentury >= 1 && endCentury >= startCentury, "the century rule must order the two labels consistently with the years");',
      'return { start: startCentury, end: endCentury };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const ordinal = (value) => { const remainder = value % 100; const suffix = remainder >= 11 && remainder <= 13 ? "th" : value % 10 === 1 ? "st" : value % 10 === 2 ? "nd" : value % 10 === 3 ? "rd" : "th"; return value + suffix; };',
  'return ($slots.end - $slots.start) + " years; " + $slots.start + " is in the " + ordinal($centuries.start) + " century and " + $slots.end + " in the " + ordinal($centuries.end) + " century.";'
].join('\n');

function explain(slots, solution) {
  return [
    `Subtracting the earlier date from the later one gives ${solution.end} - ${solution.start} = ${solution.years} years.`,
    `The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(${solution.start}) = ${solution.startCentury} and c(${solution.end}) = ${solution.endCentury}.`,
    `The rule is applied mechanically: ${solution.start} lies in the ${ordinal(solution.startCentury)} century and ${solution.end} in the ${ordinal(solution.endCentury)} century, which the first two digits of the year would not both give.`
  ];
}

function caseFor(grade) {
  const template = `Dates, durations, and centuries (grade ${grade})`;
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

export const unit = 'H2';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
