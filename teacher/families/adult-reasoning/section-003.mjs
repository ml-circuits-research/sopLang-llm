/**
 * Section 3 of the adult-reasoning course: news headline and body.
 *
 * Every variant prints one market story: a headline that shouts about exploding
 * tomato prices, a deck that quotes one price per kilo, and a body that reports
 * a handful of stalls on one morning, a field range of a few units, a single
 * small "tasting edition" bowl at the deck price, a shopper's recollection, the
 * absence of any register, and the town hall's line about complaints. Two
 * comments follow. The verdict separates what the body supports (a small
 * sample, a field range, one bowl) from what only the headline claims, and then
 * shows that neither comment follows, because the first repeats the headline as
 * if it were the body and the second reads "no complaints" as "no prices". The
 * cases change the market town, the signing journalist, the deck price, and the
 * comment that repeats it, so the family derives the body clause from the
 * parsed sample and the bowl.
 */

import { slugify } from '../../naming.mjs';

const NUMBER_WORDS = new Map([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
  ['ten', 10]
]);
const NUMBER_NAMES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

const HEADLINE_PATTERN = /CHAOS at the market in ([^:]+): tomato prices EXPLODE/;
const DECK_PATTERN = /Deck: “Sellers ask (\d+) per kilo”\./;
const BYLINE_PATTERN = /Body, signed ([A-Z][a-z]+):/;
const SAMPLE_PATTERN = /at ([a-z]+) stalls? out of ([a-z]+), field tomatoes were (\d+) a kilo\./;
const BOWL_PATTERN = /At one stall a (\d+) g ‘tasting edition’ bowl was ticketed at (\d+) a kilo\./;
const LAST_STALL_PATTERN = /At the last stall: (\d+) a kilo\./;
const LAST_WEEK_PATTERN = /A shopper said last week they were (\d+)\./;
const TOWN_HALL_PATTERN = /The town hall, after the edition closed: ‘([^’]+)’\./;
const FIRST_COMMENT_PATTERN = /Comment 1: “So every kilo is (\d+); the headline says so\.”/;

function word(number) {
  return NUMBER_NAMES[number] ?? String(number);
}

function parse(statement) {
  const headline = HEADLINE_PATTERN.exec(statement);
  const deck = DECK_PATTERN.exec(statement);
  const byline = BYLINE_PATTERN.exec(statement);
  const sample = SAMPLE_PATTERN.exec(statement);
  const bowl = BOWL_PATTERN.exec(statement);
  const lastStall = LAST_STALL_PATTERN.exec(statement);
  const lastWeek = LAST_WEEK_PATTERN.exec(statement);
  const townHall = TOWN_HALL_PATTERN.exec(statement);
  const firstComment = FIRST_COMMENT_PATTERN.exec(statement);
  if (
    headline === null ||
    deck === null ||
    byline === null ||
    sample === null ||
    bowl === null ||
    lastStall === null ||
    lastWeek === null ||
    townHall === null ||
    firstComment === null
  ) {
    throw new Error('the statement does not describe the market story with its two comments');
  }
  const stallsVisited = NUMBER_WORDS.get(sample[1]) ?? Number(sample[1]);
  const stallsTotal = NUMBER_WORDS.get(sample[2]) ?? Number(sample[2]);
  return {
    place: headline[1].trim(),
    author: byline[1],
    deckPrice: Number(deck[1]),
    stallsVisited,
    stallsTotal,
    lowPrice: Number(sample[3]),
    highPrice: Number(lastStall[1]),
    bowlGrams: Number(bowl[1]),
    bowlPrice: Number(bowl[2]),
    lastYearPrice: Number(lastWeek[1]),
    townHallQuote: townHall[1],
    commentOnePrice: Number(firstComment[1])
  };
}

function solve(slots) {
  if (slots.deckPrice !== slots.bowlPrice) {
    throw new Error('the deck does not quote the tasting bowl of the body');
  }
  if (slots.bowlPrice <= slots.highPrice) {
    throw new Error('the tasting bowl is not priced above the field range');
  }
  if (slots.commentOnePrice !== slots.bowlPrice) {
    throw new Error('the first comment does not repeat the deck price');
  }
  const bodyClause = `Body: a sample of ${word(slots.stallsTotal)} stalls, one day; ${slots.lowPrice}–${slots.highPrice} a kilo for field fruit; one ${slots.bowlGrams} g tasting bowl at ${slots.bowlPrice} a kilo.`;
  const headlineClause = 'The headline generalises.';
  const fieldIsUniform = slots.lowPrice === slots.highPrice;
  const firstCommentFollows = fieldIsUniform && slots.commentOnePrice === slots.lowPrice;
  const secondCommentFollows = /price/.test(slots.townHallQuote);
  const reasons = [];
  if (!firstCommentFollows) {
    reasons.push('the first treats the headline as the body');
  }
  if (!secondCommentFollows) {
    reasons.push('the second confuses “no complaints” with “no prices”');
  }
  const lead =
    !firstCommentFollows && !secondCommentFollows
      ? 'Neither comment follows'
      : firstCommentFollows && secondCommentFollows
        ? 'Both comments follow'
        : 'One comment follows';
  const commentsClause = reasons.length === 0 ? `${lead}.` : `${lead}: ${reasons.join('; ')}.`;
  return { bodyClause, headlineClause, commentsClause };
}

function render(solution) {
  return `${solution.bodyClause} ${solution.headlineClause} ${solution.commentsClause}`;
}

const WIRES = [
  {
    name: 'body',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];',
      'const sample = words[slots.stallsTotal] ?? String(slots.stallsTotal);',
      'const bodyClause = "Body: a sample of " + sample + " stalls, one day; " + slots.lowPrice + "–" + slots.highPrice + " a kilo for field fruit; one " + slots.bowlGrams + " g tasting bowl at " + slots.bowlPrice + " a kilo.";',
      'const headlineClause = "The headline generalises.";',
      'return { bodyClause, headlineClause };'
    ].join('\n')
  },
  {
    name: 'comments',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const fieldIsUniform = slots.lowPrice === slots.highPrice;',
      'const firstCommentFollows = fieldIsUniform && slots.commentOnePrice === slots.lowPrice;',
      'const secondCommentFollows = /price/.test(slots.townHallQuote);',
      'const reasons = [];',
      'if (!firstCommentFollows) { reasons.push("the first treats the headline as the body"); }',
      'if (!secondCommentFollows) { reasons.push("the second confuses “no complaints” with “no prices”"); }',
      'const lead = !firstCommentFollows && !secondCommentFollows ? "Neither comment follows" : firstCommentFollows && secondCommentFollows ? "Both comments follow" : "One comment follows";',
      'const commentsClause = reasons.length === 0 ? lead + "." : lead + ": " + reasons.join("; ") + ".";',
      'return commentsClause;'
    ].join('\n')
  }
];

const COMPUTE = [
  'return $body.bodyClause + " " + $body.headlineClause + " " + $comments;'
].join('\n');

function explain(slots, solution) {
  return [
    `The body reports, for the market in ${slots.place}, ${slots.stallsVisited} of the ${slots.stallsTotal} stalls on one morning, with field tomatoes between ${slots.lowPrice} and ${slots.highPrice} a kilo, so the supported claim is a small sample and a range, not a market-wide price.`,
    `The one price the deck shouts about is the ${slots.bowlGrams} g “tasting edition” bowl at ${slots.bowlPrice} a kilo, a single item ${slots.author} describes beside the range, so the headline generalises what the body shows once.`,
    `The first comment repeats that deck price as if every kilo cost ${slots.commentOnePrice}, and the second turns the town hall's “${slots.townHallQuote}” into a lie about prices, which the body never states; the shopper's ${slots.lastYearPrice} a kilo was a recollection of last week, not a price of the visit.`,
    `Nothing in the body supports either comment, so the answer is that neither follows the text.`
  ];
}

export const unit = 3;

export const cases = [
  {
    template: 'News: headline and body',
    type: slugify('News: headline and body'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
