/**
 * Section 59 of the adult-reasoning course: simple circuits and fuses.
 *
 * Every variant quotes the same workshop sheet — the bulb lights only when the
 * circle is closed and the filament is whole, a fuse breaks at high current and
 * opens the circle, a fuse must never be replaced with a wire, and two bulbs in
 * series go out together when one burns — and then describes one person who
 * finds two bulbs in series with one burnt and bridges the break with a wire
 * "so the light works". The verdict explains why both bulbs stay out and why
 * the ban on the wire stands even though the wire would light them. The cases
 * change the name and the quoted reason, so the family derives each clause from
 * the parsed values.
 */

import { slugify } from '../../naming.mjs';

const SERIES_RULE_PATTERN = /Two bulbs in series: one burnt also puts the other out\./;
const FUSE_PATTERN = /A fuse breaks at high current and opens the circle\./;
const BAN_PATTERN = /Forbidden to replace a fuse with a wire\./;
const ACTION_PATTERN =
  /([A-Z][a-z]+) has (\w+) bulbs in series, (\w+) burnt, puts in a wire “([^”]+)”\./;

const WORD_NUMBERS = { one: 1, two: 2, three: 3, four: 4, five: 5 };

function numberFromWord(word) {
  const value = WORD_NUMBERS[word];
  if (value === undefined) {
    throw new Error(`the statement counts bulbs with the unsupported word "${word}"`);
  }
  return value;
}

function parse(statement) {
  const action = ACTION_PATTERN.exec(statement);
  if (action === null) {
    throw new Error('the statement does not describe the series bulbs, the burnt bulb, and the wire');
  }
  return {
    person: action[1],
    bulbsInSeries: numberFromWord(action[2]),
    burntBulbs: numberFromWord(action[3]),
    wireClaim: action[4],
    wiredAround: true,
    sheetSeriesRule: SERIES_RULE_PATTERN.test(statement),
    sheetFuseRule: FUSE_PATTERN.test(statement),
    sheetBan: BAN_PATTERN.test(statement)
  };
}

function solve(slots) {
  if (!slots.sheetSeriesRule || !slots.sheetFuseRule || !slots.sheetBan) {
    throw new Error('the workshop sheet does not state the series rule, the fuse rule, and the ban');
  }
  if (slots.bulbsInSeries < 2 || slots.burntBulbs < 1) {
    throw new Error('the section describes at least two bulbs in series with one burnt');
  }
  const outClause = 'Series = one path; one break cuts all.';
  const wireClause = slots.wiredAround
    ? `The wire cancels protection; the ban is direct, even if it “${/light/.test(slots.wireClaim) ? 'would light' : slots.wireClaim}”.`
    : 'The wire is not in place, so the circle keeps its protection.';
  return { outClause, wireClause };
}

function render(solution) {
  return `${solution.outClause} ${solution.wireClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.person === "string" && slots.person.length > 0, "the case must name the person");',
  'probe(Number.isInteger(slots.bulbsInSeries) && slots.bulbsInSeries >= 2, "the case must put at least two bulbs in series");',
  'probe(Number.isInteger(slots.burntBulbs) && slots.burntBulbs >= 1, "the case must burn at least one bulb");',
  'probe(slots.burntBulbs < slots.bulbsInSeries, "a burnt bulb is not a working bulb");',
  'probe(typeof slots.wireClaim === "string" && slots.wireClaim.length > 0, "the case must quote the reason for the wire");',
  'probe(slots.sheetSeriesRule === true && slots.sheetFuseRule === true && slots.sheetBan === true, "the sheet must state the series rule, the fuse rule, and the ban");',
  'const outClause = "Series = one path; one break cuts all.";',
  'const wireClause = slots.wiredAround',
  '  ? "The wire cancels protection; the ban is direct, even if it “" + (/light/.test(slots.wireClaim) ? "would light" : slots.wireClaim) + "”."',
  '  : "The wire is not in place, so the circle keeps its protection.";',
  'return outClause + " " + wireClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `Two bulbs in series sit on a single path, so the burnt filament opens the circle for both: ${slots.person} sees no light from either bulb.`,
    `The fuse exists to break at high current and open the circle, and the sheet forbids replacing it with a wire, so bridging the break removes the protection the workshop requires.`,
    `The quoted reason "${slots.wireClaim}" is beside the point: the ban is stated directly, even though the wire would light the bulbs.`
  ];
}

export const unit = 59;

export const cases = [
  {
    template: 'Simple circuits and fuses',
    type: slugify('Simple circuits and fuses'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
