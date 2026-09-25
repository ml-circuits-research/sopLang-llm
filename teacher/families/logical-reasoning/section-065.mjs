/**
 * Section 65 of the logical-reasoning book: averages that hide a split.
 *
 * Every case prints a town card from a named place: the average weekly pay of a
 * listed group and the two clusters the same card shows. Three voices answer —
 * one who reads the average as a typical worker, one who calls it a centre of
 * mass, one who believes averages always portray a real person — and the
 * question asks whether the printed average portrays a typical worker.
 *
 * The case data changes the place, the size of the listed group, and the three
 * names; the reasoning is fixed. The clusters sit on both sides of the average,
 * so the average is their mix and nobody on the card need stand on it. The
 * module checks that the two cluster values straddle the average and renders
 * the printed verdict with the cluster values.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN =
  /Town card in (.+?): average weekly pay of (\d+) listed workers is (\d+)\. The same card shows two clusters: half at (\d+), half at (\d+)\./;
const QUESTION_PATTERN = /Question\. Does (\d+) portray a typical worker here\?/;
const VOICES_PATTERN =
  /([A-Z][a-z]+) says a typical worker earns (\d+)\. ([A-Z][a-z]+) says (\d+) is a centre of mass and nobody in the clusters need stand there\. ([A-Z][a-z]+) says averages always portray a real person\./;

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  const question = QUESTION_PATTERN.exec(statement);
  const voices = VOICES_PATTERN.exec(statement);
  if (card === null || question === null || voices === null) {
    throw new Error('the statement does not record the town card, the two clusters, and the three voices');
  }
  return {
    place: card[1],
    workers: Number(card[2]),
    average: Number(card[3]),
    lowCluster: Number(card[4]),
    highCluster: Number(card[5]),
    askedAverage: Number(question[1]),
    portraitVoice: voices[1],
    claimedAverage: Number(voices[2]),
    centreVoice: voices[3],
    restatedAverage: Number(voices[4]),
    believer: voices[5]
  };
}

function solve(slots) {
  if (!Number.isInteger(slots.workers) || slots.workers <= 0) {
    throw new Error('the card must list a positive number of workers');
  }
  if (slots.lowCluster >= slots.highCluster) {
    throw new Error('the two clusters must sit at different pays');
  }
  if (slots.average <= slots.lowCluster || slots.average >= slots.highCluster) {
    throw new Error('the average must sit strictly between the two clusters');
  }
  if (slots.lowCluster + slots.highCluster !== 2 * slots.average) {
    throw new Error('the average must be the midpoint of the two clusters this card prints');
  }
  if (slots.askedAverage !== slots.average) {
    throw new Error('the question must ask about the average the card prints');
  }
  if (slots.claimedAverage !== slots.average || slots.restatedAverage !== slots.average) {
    throw new Error('both voices must name the average the card prints');
  }
  if (
    slots.portraitVoice === slots.centreVoice ||
    slots.centreVoice === slots.believer ||
    slots.portraitVoice === slots.believer
  ) {
    throw new Error('the three voices must be different people');
  }
  return {
    place: slots.place,
    workers: slots.workers,
    average: slots.average,
    lowCluster: slots.lowCluster,
    highCluster: slots.highCluster,
    portraitVoice: slots.portraitVoice,
    centreVoice: slots.centreVoice,
    believer: slots.believer,
    // Nobody on the card need stand on the average: it is the mix of the two
    // clusters, not one of the pays the card lists.
    averageIsGhost: slots.average !== slots.lowCluster && slots.average !== slots.highCluster
  };
}

function render(solution) {
  return solution.averageIsGhost
    ? `Not as a portrait. The listed people sit at ${solution.lowCluster} and ${solution.highCluster}. The average is a mix, not a resident.`
    : 'The average is one of the listed pays in this card.';
}

const COMPUTE = [
  'const slots = $slots;',
  'const averageIsGhost = slots.average !== slots.lowCluster && slots.average !== slots.highCluster;',
  'return averageIsGhost ? "Not as a portrait. The listed people sit at " + slots.lowCluster + " and " + slots.highCluster + ". The average is a mix, not a resident." : "The average is one of the listed pays in this card.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card from ${solution.place} averages ${solution.workers} listed pays to ${solution.average} while the same card shows the clusters at ${solution.lowCluster} and ${solution.highCluster}.`,
    `The average is the total divided by the count, so it sits between the clusters as their mix.`,
    `No listed worker need earn ${solution.average}, which is what ${solution.centreVoice} points out and ${solution.portraitVoice} denies.`,
    `${solution.believer} treats an average as a portrait, but a number that no one stands on cannot portray a typical worker here.`
  ];
}

export const unit = 65;

export const cases = [
  {
    template: 'Averages that hide a split',
    type: slugify('Averages that hide a split'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
