/**
 * Section 30 of the logical-reasoning book: when a climb is enough to act.
 *
 * Every case posts a fete committee with a run of listed mornings that ended in
 * rain, a cheap cover against a costly soaking, and three speakers; it asks
 * whether action is licensed without a deduction. The case data changes the
 * town, the counted mornings, and the three names; the reasoning is fixed:
 * action can rest on strength plus stakes, so the climb is enough to put the
 * covers up while a law is over-hardening.
 */

import { slugify } from '../../naming.mjs';

const CLIMB_PATTERN =
  /Fete committee in ([A-Za-z ]+): on (\d+) of the last (\d+) listed outdoor mornings like this one, rain arrived after lunch\. Covers cost a little; wet instruments cost a lot\./;
const SPEAKERS_PATTERN =
  /([A-Z][a-z]+) says they must wait for a deduction that rain is necessary\. ([A-Z][a-z]+) says the climb plus the stakes is enough to put covers up\. ([A-Z][a-z]+) says (\d+) of (\d+) is already a proof that rain is metaphysically required\./;

function parse(statement) {
  const climb = CLIMB_PATTERN.exec(statement);
  const speakers = SPEAKERS_PATTERN.exec(statement);
  if (climb === null) {
    throw new Error('the statement does not record the run of rainy mornings and the stakes');
  }
  if (speakers === null) {
    throw new Error('the statement does not record the three speakers');
  }
  return {
    place: climb[1].trim(),
    successes: Number(climb[2]),
    trials: Number(climb[3]),
    deducer: speakers[1],
    climber: speakers[2],
    overhardener: speakers[3],
    echoedSuccesses: Number(speakers[4]),
    echoedTrials: Number(speakers[5])
  };
}

function solve(slots) {
  if (!(slots.successes > 0 && slots.successes <= slots.trials)) {
    throw new Error('the rainy mornings must be a positive count within the listed mornings');
  }
  if (slots.echoedSuccesses !== slots.successes || slots.echoedTrials !== slots.trials) {
    throw new Error('the last speaker must quote the same run of mornings');
  }
  const speakers = [slots.deducer, slots.climber, slots.overhardener];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the statement must name three different speakers');
  }
  return {
    place: slots.place,
    successes: slots.successes,
    trials: slots.trials,
    climber: slots.climber,
    overhardener: slots.overhardener
  };
}

function render(solution) {
  return `Yes, as practical induction. ${solution.climber} has the family right. ${solution.overhardener} over-hardened a climb into a law.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the town of the fete committee");',
  'probe(Number.isInteger(slots.successes) && slots.successes > 0 && slots.successes <= slots.trials, "the rainy mornings must be a positive count within the listed mornings");',
  'probe(slots.echoedSuccesses === slots.successes && slots.echoedTrials === slots.trials, "the last speaker must quote the same run of mornings");',
  'probe(typeof slots.climber === "string" && slots.climber.length > 0, "the case must name the speaker who acts on the climb");',
  'probe(slots.deducer !== slots.climber && slots.deducer !== slots.overhardener && slots.climber !== slots.overhardener, "the case must name three different speakers");',
  'return "Yes, as practical induction. " + slots.climber + " has the family right. " + slots.overhardener + " over-hardened a climb into a law.";'
].join('\n');

function explain(slots, solution) {
  return [
    `On ${solution.successes} of the last ${solution.trials} listed outdoor mornings in ${solution.place}, rain arrived after lunch, and the covers cost little against wet instruments.`,
    'Action can rest on strength plus stakes, so deduction is not the only honest licence to move and the committee may put the covers up.',
    `${solution.overhardener} hardens the same run into a law, and a high downside supports precaution rather than prophecy.`,
    'The honest report keeps the run on the page: it is a climb, not a deduction that rain is necessary.'
  ];
}

export const unit = 30;

export const cases = [
  {
    template: 'When a climb is enough to act',
    type: slugify('When a climb is enough to act'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
