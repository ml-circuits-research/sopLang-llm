/**
 * Section 91 of the adult-reasoning course: frequency, chance, and expected number.
 *
 * Every variant states the composition of an urn, draws with replacement, and
 * the fraction the probability follows, then quotes a person who multiplies the
 * fraction by the number of draws and calls the result obligatory. The family
 * reads the counts, the number of draws, and the quoted claim, and renders the
 * one-draw probability, the expected number, and the reason expectation is not
 * certainty.
 */

import { slugify } from '../../naming.mjs';

const URN_PATTERN = /Urn: (\d+) white, (\d+) red\./;
const RULE_PATTERN = /P = sought number \/ (\d+)\./;
const DRAW_PATTERN = /([A-Z][a-z]+) draws (\d+) times/;
const CLAIM_PATTERN = /because (\d+)\/(\d+) of (\d+) is (\d+)/;

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function parse(statement) {
  const urn = URN_PATTERN.exec(statement);
  const rule = RULE_PATTERN.exec(statement);
  const draw = DRAW_PATTERN.exec(statement);
  const claim = CLAIM_PATTERN.exec(statement);
  if (urn === null || rule === null || draw === null || claim === null) {
    throw new Error('the statement does not state the urn, the probability rule, the draws, and the quoted claim');
  }
  return {
    white: Number(urn[1]),
    red: Number(urn[2]),
    statedTotal: Number(rule[1]),
    drawer: draw[1],
    draws: Number(draw[2]),
    claimNumerator: Number(claim[1]),
    claimDenominator: Number(claim[2]),
    claimDraws: Number(claim[3]),
    claimExpected: Number(claim[4])
  };
}

function solve(slots) {
  const total = slots.white + slots.red;
  if (
    slots.statedTotal !== total ||
    slots.claimNumerator !== slots.red ||
    slots.claimDenominator !== total ||
    slots.claimDraws !== slots.draws
  ) {
    throw new Error('the quoted claim and the probability rule do not restate the urn and the number of draws');
  }
  const divisor = gcd(slots.red, total);
  const probability =
    divisor === 1 ? `${slots.red}/${total}` : `${slots.red}/${total}=${slots.red / divisor}/${total / divisor}`;
  const expected = (slots.draws * slots.red) / total;
  return {
    probability,
    expected: String(expected),
    draws: slots.draws
  };
}

function render(solution) {
  return `P=${solution.probability}. Expected number in ${solution.draws} draws = ${solution.expected}, not certainty. Zero reds can occur.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const total = slots.white + slots.red;',
  'let a = slots.red;',
  'let b = total;',
  'while (b !== 0) { const next = a % b; a = b; b = next; }',
  'const probability = a === 1 ? slots.red + "/" + total : slots.red + "/" + total + "=" + (slots.red / a) + "/" + (total / a);',
  'const expected = (slots.draws * slots.red) / total;',
  'probe(Number.isInteger(expected), "the expected number of reds must be a whole number for the stated draws");',
  'return "P=" + probability + ". Expected number in " + slots.draws + " draws = " + expected + ", not certainty. Zero reds can occur.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The urn holds ${slots.white} white and ${slots.red} red balls, so one draw gives red with probability ${slots.red}/${slots.white + slots.red}, simplified to ${solution.probability.replace(/^\d+\/\d+=/, '')}.`,
    `With replacement every draw repeats the same odds, so ${slots.draws} draws expect ${solution.expected} reds on average, but an average is not a guarantee.`,
    `${slots.drawer} multiplies the fraction by the number of draws and calls the result obligatory; the draws stay independent, so a run of ${slots.draws} draws with zero reds is possible and simply more or less likely.`
  ];
}

export const unit = 91;

export const cases = [
  {
    template: 'Frequency, chance, and expected number',
    type: slugify('Frequency, chance, and expected number'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
