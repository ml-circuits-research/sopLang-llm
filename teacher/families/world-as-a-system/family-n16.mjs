/**
 * Family N16 of the world seed book: uncertain data, intervals, and limits.
 *
 * Every problem states two uncertain measurements as closed intervals, A and B,
 * and asks whether the data justifies the strict claim "A is definitely greater
 * than B". The stated rule makes the claim valid only when the worst case for A
 * beats the best case for B, that is when A's minimum exceeds B's maximum; an
 * overlap therefore defeats the claim. The answer restates the verdict and the
 * comparison it rests on.
 *
 * The four grades share one computation: the variants differ in the interval
 * bounds and in the appended cross-domain (and mixed-domain) check, which the
 * shared helper renders as the labelled answer suffix.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const INTERVAL_PATTERN = /([AB]) is between (-?\d+(?:\.\d+)?) and (-?\d+(?:\.\d+)?)/g;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const intervals = {};
  for (const match of facts.matchAll(INTERVAL_PATTERN)) {
    intervals[match[1]] = { minimum: Number(match[2]), maximum: Number(match[3]) };
  }
  if (intervals.A === undefined || intervals.B === undefined) {
    throw new Error('the statement does not state two intervals A and B');
  }
  return { a: intervals.A, b: intervals.B, crossDomain: parseCrossDomain(blocks['Given facts']) };
}

function solve(slots) {
  const { a, b } = slots;
  if (a.minimum > a.maximum || b.minimum > b.maximum) {
    throw new Error('an interval has its minimum above its maximum');
  }
  return {
    aMinimum: a.minimum,
    bMaximum: b.maximum,
    definitelyGreater: a.minimum > b.maximum,
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const main = solution.definitelyGreater
    ? `Yes. A's minimum ${solution.aMinimum} is greater than B's maximum ${solution.bMaximum}, so A is definitely greater than B.`
    : 'No. The intervals do not justify saying A is definitely greater than B.';
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'const definitelyGreater = slots.a.minimum > slots.b.maximum;',
  'probe(typeof definitelyGreater === "boolean", "the worst-case comparison must yield a verdict");',
  'const main = definitelyGreater',
  '  ? "Yes. A\'s minimum " + slots.a.minimum + " is greater than B\'s maximum " + slots.b.maximum + ", so A is definitely greater than B."',
  '  : "No. The intervals do not justify saying A is definitely greater than B.";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The interval for A is [${solution.aMinimum}, ${slots.a.maximum}] and the interval for B is [${slots.b.minimum}, ${solution.bMaximum}], so both measurements carry a range of allowed values.`,
    `The strict claim is defended only by the worst case for A against the best case for B, that is the test A_min > B_max, here ${solution.aMinimum} > ${solution.bMaximum}.`,
    solution.definitelyGreater
      ? 'That test holds, so no allowed pair of values can reverse the ordering and the claim is guaranteed.'
      : 'That test fails, so at least one allowed pair of values reverses the ordering and no definite comparison follows from the data.',
    'Overlapping or merely close intervals therefore support only a cautious reading, which is what the qualifier in the answer records.'
  ];
}

function caseFor(grade) {
  const template = `Uncertain data, intervals, and limits (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N16';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
