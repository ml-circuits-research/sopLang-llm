/**
 * Section 64 of the logical-reasoning book: small choices and average return.
 *
 * Every case stages a fete in a named place with two games on the stall. Game
 * One states a stake and a prize won on a printed share of the tickets; Game
 * Two states a stake, a rare winning ticket, and a large prize. Three voices
 * answer — one who feels the big prize is wiser, one who compares the printed
 * fractions, one who calls the feeling a number — and the question asks which
 * game has the better average return.
 *
 * The case data changes the place and the three names; the reasoning is fixed.
 * Average return is prize times chance of winning, so Game One returns exactly
 * its stake and Game Two returns a fraction of its stake however large its
 * prize is. The module renders the average and the percent of the stake, both
 * computed in hundredths so the printed numbers never pick up float noise.
 */

import { slugify } from '../../naming.mjs';

const SHARES = new Map([
  ['half', 2],
  ['third', 3],
  ['quarter', 4],
  ['fifth', 5],
  ['tenth', 10]
]);

const FETE_PATTERN =
  /Fete in (.+?)\. Game One: pay (\d+); ([a-z]+) the tickets win (\d+); ([a-z]+) win nothing\. Game Two: pay (\d+); one ticket in (\d+) wins (\d+); the rest win nothing\./;
const VOICES_PATTERN =
  /([A-Z][a-z]+) feels Game Two is wiser because the prize is huge\. ([A-Z][a-z]+) compares average return from the printed fractions\. ([A-Z][a-z]+) says feeling lucky is a number\./;

function shareOf(token) {
  const denominator = SHARES.get(String(token).toLowerCase());
  if (denominator === undefined) {
    throw new Error(`the stall prints the win share as "${token}", which this section cannot read`);
  }
  return denominator;
}

function parse(statement) {
  const fete = FETE_PATTERN.exec(statement);
  const voices = VOICES_PATTERN.exec(statement);
  if (fete === null || voices === null) {
    throw new Error('the statement does not record the two games and the three voices');
  }
  return {
    place: fete[1],
    stakeOne: Number(fete[2]),
    winShareOne: shareOf(fete[3]),
    prizeOne: Number(fete[4]),
    loseShareOne: shareOf(fete[5]),
    stakeTwo: Number(fete[6]),
    drawSize: Number(fete[7]),
    prizeTwo: Number(fete[8]),
    prizeChaser: voices[1],
    comparer: voices[2],
    feeler: voices[3]
  };
}

/**
 * `value / denominator` scaled by 100, refused unless the division is exact:
 * the section never prints a rounded average, so a stall that would need one is
 * not a case of this family.
 */
function exactHundredths(value, denominator) {
  if (!Number.isInteger(denominator) || denominator <= 0) {
    throw new Error('the stall fractions must have a positive denominator');
  }
  if (value % denominator !== 0) {
    throw new Error('the stall fractions must divide into whole hundredths');
  }
  return (value * 100) / denominator;
}

function formatHundredths(value) {
  return value % 100 === 0 ? String(value / 100) : (value / 100).toFixed(2);
}

function solve(slots) {
  if (!Number.isInteger(slots.stakeOne) || slots.stakeOne <= 0) {
    throw new Error('Game One must charge a positive stake');
  }
  if (!Number.isInteger(slots.stakeTwo) || slots.stakeTwo <= 0) {
    throw new Error('Game Two must charge a positive stake');
  }
  if (!Number.isInteger(slots.prizeOne) || slots.prizeOne <= 0) {
    throw new Error('Game One must print a positive prize');
  }
  if (!Number.isInteger(slots.prizeTwo) || slots.prizeTwo <= 0) {
    throw new Error('Game Two must print a positive prize');
  }
  if (!Number.isInteger(slots.drawSize) || slots.drawSize <= 1) {
    throw new Error('Game Two must print a draw of more than one ticket');
  }
  if (
    slots.prizeChaser === slots.comparer ||
    slots.comparer === slots.feeler ||
    slots.prizeChaser === slots.feeler
  ) {
    throw new Error('the three voices must be different people');
  }
  const totalShare = slots.winShareOne + slots.loseShareOne;
  if (totalShare <= 0) {
    throw new Error('the printed shares of Game One must cover the tickets');
  }
  const averageOneHundredths = exactHundredths(slots.prizeOne * slots.loseShareOne, totalShare);
  const stakeOneHundredths = slots.stakeOne * 100;
  if (averageOneHundredths !== stakeOneHundredths) {
    throw new Error('this section prints a first game whose average return is its stake');
  }
  const averageTwoHundredths = exactHundredths(slots.prizeTwo, slots.drawSize);
  const stakeTwoHundredths = slots.stakeTwo * 100;
  if (averageTwoHundredths >= stakeTwoHundredths) {
    throw new Error('this section prints a second game whose rare prize still loses on average');
  }
  const percentHundredths = exactHundredths(averageTwoHundredths, slots.stakeTwo);
  return {
    place: slots.place,
    stakeOne: slots.stakeOne,
    prizeOne: slots.prizeOne,
    stakeTwo: slots.stakeTwo,
    drawSize: slots.drawSize,
    prizeTwo: slots.prizeTwo,
    prizeChaser: slots.prizeChaser,
    comparer: slots.comparer,
    feeler: slots.feeler,
    averageOneHundredths,
    averageTwoHundredths,
    percentHundredths,
    breakEven: true
  };
}

function render(solution) {
  return `Game One breaks even on average. Game Two returns ${formatHundredths(solution.averageTwoHundredths)} on average for a stake of ${solution.stakeTwo}, so ${formatHundredths(solution.percentHundredths)} percent of the stake. The huge prize is rare.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const totalShare = slots.winShareOne + slots.loseShareOne;',
  'probe(Number.isInteger(totalShare) && totalShare > 0, "the printed shares of Game One must cover the tickets");',
  'probe((slots.prizeOne * slots.loseShareOne) % totalShare === 0, "Game One must divide into whole hundredths");',
  'const averageOneHundredths = (slots.prizeOne * slots.loseShareOne * 100) / totalShare;',
  'probe(averageOneHundredths === slots.stakeOne * 100, "this section prints a first game whose average return is exactly its stake");',
  'probe(slots.prizeTwo % slots.drawSize === 0, "Game Two must divide into whole hundredths");',
  'const averageTwoHundredths = (slots.prizeTwo * 100) / slots.drawSize;',
  'const stakeTwoHundredths = slots.stakeTwo * 100;',
  'probe((averageTwoHundredths * 100) % slots.stakeTwo === 0, "the percent of the stake must be a whole hundredth");',
  'const percentHundredths = (averageTwoHundredths * 100) / slots.stakeTwo;',
  'const formatHundredths = (value) => (value % 100 === 0 ? String(value / 100) : (value / 100).toFixed(2));',
  'const secondLoses = averageTwoHundredths < stakeTwoHundredths;',
  'probe(secondLoses, "the rare prize must still lose on average against the stake");',
  'return secondLoses ? "Game One breaks even on average. Game Two returns " + formatHundredths(averageTwoHundredths) + " on average for a stake of " + slots.stakeTwo + ", so " + formatHundredths(percentHundredths) + " percent of the stake. The huge prize is rare." : "Game Two returns " + formatHundredths(averageTwoHundredths) + " on average and beats its stake.";'
].join('\n');

function explain(slots, solution) {
  return [
    `Game One in ${solution.place} wins ${solution.prizeOne} on a printed share of the tickets for a stake of ${solution.stakeOne}, so its average return is ${formatHundredths(solution.averageOneHundredths)}, exactly the stake.`,
    `Game Two wins ${solution.prizeTwo} on one ticket in ${solution.drawSize} for a stake of ${solution.stakeTwo}, so its average return is ${formatHundredths(solution.averageTwoHundredths)}.`,
    `The comparison is ${solution.comparer}’s: average return is prize times chance, and size of prize is not size of average.`,
    `The huge prize is rare, which is why ${solution.prizeChaser}’s feeling and ${solution.feeler}’s luck never enter the arithmetic.`
  ];
}

export const unit = 64;

export const cases = [
  {
    template: 'Small choices and average return',
    type: slugify('Small choices and average return'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
