/**
 * Section 28 of the logical-reasoning book: testimony as a thin sample.
 *
 * Every case reports a sincere witness in a named village who generalises one
 * slip into “always icy in March,” records two onlookers, and asks what the
 * single slip supports. The case data changes the village and the three names;
 * the reasoning is fixed: honesty is not coverage, and a sample of one
 * supports only the slip it records.
 */

import { slugify } from '../../naming.mjs';

const TESTIMONY_PATTERN =
  /([A-Z][a-z]+) in ([A-Za-z ]+) says the hill path is always icy in March, because ([A-Z][a-z]+) slipped once last March\. ([A-Z][a-z]+) treats the slip as a sample of one\. ([A-Z][a-z]+) says a sincere slip is already a climate record\./;

function parse(statement) {
  const testimony = TESTIMONY_PATTERN.exec(statement);
  if (testimony === null) {
    throw new Error('the statement does not record the testimony, the slip, and the two onlookers');
  }
  return {
    witness: testimony[1],
    village: testimony[2].trim(),
    echoed: testimony[3],
    critic: testimony[4],
    third: testimony[5]
  };
}

function solve(slots) {
  if (slots.witness !== slots.echoed) {
    throw new Error('the testimony must report the witness\u2019 own slip');
  }
  const speakers = [slots.witness, slots.critic, slots.third];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the statement must name three different speakers');
  }
  return {
    witness: slots.witness,
    village: slots.village
  };
}

function render(solution) {
  return `That ${solution.witness} slipped once last March on that path. It does not by itself support “always icy in March.”`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.witness === "string" && slots.witness.length > 0, "the case must name the witness");',
  'probe(typeof slots.village === "string" && slots.village.length > 0, "the case must name the village");',
  'probe(slots.witness === slots.echoed, "the testimony must report the witness\\u2019 own slip, so the two names must agree");',
  'probe(slots.critic !== slots.witness && slots.third !== slots.witness && slots.critic !== slots.third, "the case must name two onlookers besides the witness");',
  'return "That " + slots.witness + " slipped once last March on that path. It does not by itself support \\u201calways icy in March.\\u201d";'
].join('\n');

function explain(slots, solution) {
  return [
    `${solution.witness} is honest about the one slip in ${solution.village}, and a sincere report can still be thin evidence.`,
    'The claim “always icy in March” is a climate-shaped generalisation, and one slip in one March is a sample of one for it.',
    'So the slip supports only that the slip happened; honesty does not widen the sample.'
  ];
}

export const unit = 28;

export const cases = [
  {
    template: 'Testimony as a thin sample',
    type: slugify('Testimony as a thin sample'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
