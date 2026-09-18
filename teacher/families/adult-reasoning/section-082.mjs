/**
 * Section 82 of the adult-reasoning course: premises, conclusions, and leaps.
 *
 * Every variant quotes one speaker who turns a single observed bus into a claim
 * about every bus in a place and then leaps from traffic to “the town hall
 * deserves no trust on any subject”. The verdict separates the three layers:
 * the observation covers one bus on one day for a stated number of minutes, the
 * generalisation inflates that to every bus, and the leap carries the traffic
 * complaint over to an unrelated subject. The cases change the speaker, the
 * place, and the waiting time, so the family derives the observation clause
 * from the parsed minutes and keeps the fixed generalisation and leap wording.
 */

import { slugify } from '../../naming.mjs';

const QUOTE_PATTERN =
  /([A-Z][a-z]+): “Every bus in ([^”]+?) is late\. I waited (\d+) minutes for one on Tuesday\. So the town hall deserves no trust on any subject\.”/;

function parse(statement) {
  const quote = QUOTE_PATTERN.exec(statement);
  if (quote === null) {
    throw new Error('the statement does not quote the claim about every bus and every subject');
  }
  return {
    speaker: quote[1],
    place: quote[2],
    minutes: Number(quote[3]),
    busesObserved: 1,
    daysObserved: 1,
    generalised: /Every bus in [^”]+? is late\./.test(statement),
    leapSubject: /deserves no trust on any subject/.test(statement)
  };
}

function solve(slots) {
  if (!slots.generalised || !slots.leapSubject) {
    throw new Error('the claim does not contain the generalisation and the leap this section reads');
  }
  if (slots.minutes <= 0) {
    throw new Error('the observed wait must be a positive number of minutes');
  }
  return {
    observedClause: `Observed: ${slots.busesObserved === 1 ? 'one bus' : `${slots.busesObserved} buses`}, ${slots.daysObserved === 1 ? 'one day' : `${slots.daysObserved} days`}, ${slots.minutes} min.`,
    generalisationClause: 'Generalisation: every bus.',
    leapClause: 'Leap: from traffic to “any subject”.'
  };
}

function render(solution) {
  return `${solution.observedClause} ${solution.generalisationClause} ${solution.leapClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.speaker === "string" && slots.speaker.length > 0, "the case must name the speaker");',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the buses");',
  'probe(Number.isInteger(slots.minutes) && slots.minutes > 0, "the observed wait must be a positive whole number of minutes");',
  'probe(slots.busesObserved === 1 && slots.daysObserved === 1, "the observation covers one bus on one day");',
  'probe(slots.generalised === true && slots.leapSubject === true, "the claim must generalise and leap to any subject");',
  'const observedClause = "Observed: one bus, one day, " + slots.minutes + " min.";',
  'const generalisationClause = "Generalisation: every bus.";',
  'const leapClause = "Leap: from traffic to \\u201cany subject\\u201d.";',
  'return observedClause + " " + generalisationClause + " " + leapClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.speaker} reports one bus in ${slots.place} on one day and a wait of ${slots.minutes} minutes, so the observation is a single case with a single number.`,
    `The sentence “Every bus in ${slots.place} is late” turns that single case into a claim about every bus, which the stated evidence does not cover.`,
    'The last sentence carries the traffic complaint over to “no trust on any subject”, which is a leap to a different question rather than a further conclusion about buses.',
    'A sound reading keeps the three layers apart: one observation, one generalisation, one leap.'
  ];
}

export const unit = 82;

export const cases = [
  {
    template: 'Premises, conclusions, and leaps',
    type: slugify('Premises, conclusions, and leaps'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
