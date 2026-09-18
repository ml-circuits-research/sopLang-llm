/**
 * Section 83 of the adult-reasoning course: generalising from a small sample.
 *
 * Every variant has one person ask a handful of friends in one place whether
 * they like a series, count the yeses, and then announce the same percentage as
 * a fact about the whole country. The notebook clause states the rule the
 * family applies: a sample is representative only when the text says how it
 * mirrors the whole, and the friends are never declared representative. The
 * verdict therefore keeps the fraction on the friends alone. The cases change
 * the asker, the place, the sample size, the yeses, and the announced
 * percentage, so the family derives the fraction from the parsed counts.
 */

import { slugify } from '../../naming.mjs';

const SAMPLE_PATTERN =
  /([A-Z][a-z]+) asks (\d+) friends in ([^.]+?) if they like a series\. (\d+) say yes\. Conclusion: “(\d+)% of the country likes it”\./;

function parse(statement) {
  const sample = SAMPLE_PATTERN.exec(statement);
  if (sample === null) {
    throw new Error('the statement does not describe the friends, the yeses, and the country conclusion');
  }
  return {
    asker: sample[1],
    place: sample[3],
    friends: Number(sample[2]),
    yes: Number(sample[4]),
    announcedPercent: Number(sample[5]),
    declaredRepresentative: !/not declared representative/.test(statement)
  };
}

function solve(slots) {
  if (slots.friends <= 0) {
    throw new Error('the sample must contain at least one friend');
  }
  if (slots.yes < 0 || slots.yes > slots.friends) {
    throw new Error('the number of yeses must fall between zero and the sample size');
  }
  if (slots.declaredRepresentative) {
    throw new Error('the case declares the sample representative, which is not this section pattern');
  }
  const shownPercent = Math.round((slots.yes * 100) / slots.friends);
  if (shownPercent !== slots.announcedPercent) {
    throw new Error('the announced percentage does not follow from the counted sample');
  }
  return {
    legitPercent: `${slots.yes}/${slots.friends}`,
    population: 'these friends',
    refusedPopulation: 'the country'
  };
}

function render(solution) {
  return `${solution.legitPercent} of ${solution.population}, not of ${solution.refusedPopulation}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.asker === "string" && slots.asker.length > 0, "the case must name the person asking");',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the friends");',
  'probe(Number.isInteger(slots.friends) && slots.friends > 0, "the sample size must be a positive whole number");',
  'probe(Number.isInteger(slots.yes) && slots.yes >= 0 && slots.yes <= slots.friends, "the yeses must fit inside the sample");',
  'probe(slots.declaredRepresentative === false, "the text must leave the friends undeclared as representative");',
  'probe(Math.round((slots.yes * 100) / slots.friends) === slots.announcedPercent, "the announced percentage must follow from the sample");',
  'const legitPercent = slots.yes + "/" + slots.friends;',
  'return legitPercent + " of these friends, not of the country.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.asker} asked ${slots.friends} friends in ${slots.place} and ${slots.yes} said yes, so the only count the evidence supports is ${solution.legitPercent} of those friends.`,
    `The conclusion states ${slots.announcedPercent}% of the country, which is the same number moved from a handful of friends to a whole population.`,
    'The notebook fixes the test: a sample is representative only if the text says how it mirrors the whole, and nothing in the statement says that about these friends.',
    'The legitimate claim therefore stays with the friends, and the country-wide percentage is unsupported.'
  ];
}

export const unit = 83;

export const cases = [
  {
    template: 'Generalising from a small sample',
    type: slugify('Generalising from a small sample'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
