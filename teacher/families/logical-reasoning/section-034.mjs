/**
 * Section 34 of the logical-reasoning book: historical analogy.
 *
 * Every case quotes a speaker who names a past year as if the name proved the
 * outcome, then records three reactions: one treats the year-word as a proof,
 * one asks which parts of that year are actually mapped, and one wants the
 * whole family of historical analogies banned. The case data changes the
 * place, the year, the row that is compared with it, the number of closed
 * stalls, and the three names; the verdict is fixed: the analogy has not
 * mapped the parts that did the work in the named year, and a year-name is not
 * a mechanism.
 */

import { slugify } from '../../naming.mjs';

const SPEECH_PATTERN =
  /^A speaker in ([A-Z][A-Za-z ]*) says “this market (\w+) is another (\d{4})” because (\w+) stalls closed\./;
const ALARMER_PATTERN = /([A-Z][a-z]+) treats the year-word as a proof of a crash\./;
const MAPPER_PATTERN = /([A-Z][a-z]+) asks which parts of (\d{4}) are actually mapped\./;
const BANNER_PATTERN = /([A-Z][a-z]+) says historical analogies are forbidden as a type\./;

/** The counted words the printed statements use for small tallies. */
const COUNT_OF_WORD = Object.freeze({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10
});

function required(pattern, statement, what) {
  const match = pattern.exec(statement);
  if (match === null) {
    throw new Error(`the statement does not record ${what}`);
  }
  return match;
}

function parse(statement) {
  const speech = required(SPEECH_PATTERN, statement, 'the quoted year-word and the tally that is said to support it');
  const alarmer = required(ALARMER_PATTERN, statement, 'the reader who treats the year-word as a proof');
  const mapper = required(MAPPER_PATTERN, statement, 'the reader who asks which parts of the year are mapped');
  const banner = required(BANNER_PATTERN, statement, 'the reader who wants historical analogies banned');
  return {
    place: speech[1].trim(),
    rowNoun: speech[2],
    year: Number(speech[3]),
    countWord: speech[4],
    alarmer: alarmer[1],
    mapper: mapper[1],
    mappedYear: Number(mapper[2]),
    banner: banner[1]
  };
}

function solve(slots) {
  const count = COUNT_OF_WORD[slots.countWord];
  if (count === undefined || count < 1) {
    throw new Error(`the statement does not give a tally this section counts: ${slots.countWord}`);
  }
  if (slots.mappedYear !== slots.year) {
    throw new Error('the reader who asks about the mapped parts does not speak about the quoted year');
  }
  if (slots.alarmer === slots.mapper || slots.mapper === slots.banner) {
    throw new Error('the three reactions must be given by different people');
  }
  return {
    verdict: 'not mapped',
    year: slots.year,
    rowNoun: slots.rowNoun,
    countWord: slots.countWord,
    count,
    place: slots.place,
    alarmer: slots.alarmer,
    mapper: slots.mapper,
    banner: slots.banner
  };
}

function render(solution) {
  return `It has not mapped the parts that did the work in ${solution.year} onto this ${solution.rowNoun} of ${solution.countWord} stalls. A year-name is not a mechanism.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const countOfWord = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };',
  'return "It has not mapped the parts that did the work in " + slots.year + " onto this " + slots.rowNoun + " of " + slots.countWord + " stalls. A year-name is not a mechanism.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The speaker in ${solution.place} names ${solution.year} and offers one tally: ${solution.countWord} closed stalls in the market ${solution.rowNoun}.`,
    `${solution.alarmer} reads the year-word as a proof of a crash, but a year-name carries no mechanism; the parts of ${solution.year} that did the work were never written down.`,
    `${solution.mapper} asks the question that decides the case: which parts of ${solution.year} are actually mapped onto this market ${solution.rowNoun}, and are those parts the ones that did the work?`,
    `${solution.banner} would ban the whole family, yet historical analogies can pay for themselves once the mapped parts are named; here they have not been, so the analogy has done no work.`
  ];
}

export const unit = 34;

export const cases = [
  {
    template: 'Historical analogy',
    type: slugify('Historical analogy'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
