/**
 * Section 11 of the logical-reasoning book: sufficient conditions.
 *
 * Every case quotes a kiln card whose rule makes a reading sufficient for
 * stopping, records the reading that meets the card, and adds two speakers:
 * one who insists on an extra sign that the card never names and one who notes
 * that the card named heat as enough. The case data changes the place, the
 * threshold, the reading, and the names; the reasoning is fixed: a sufficient
 * condition is enough on its own, so a missing extra sign does not block the
 * conclusion, while that sign could be another sufficient condition in another
 * document. The family reads the threshold and the reading and renders the
 * printed verdict.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN = /“If the (.+?) reads (\d+) or more, stop the (.+?)\.”/;
const READING_PATTERN = /The (.+?) reads (\d+)\./;
const STOP_PATTERN = /([A-Z][a-z]+) stops the (.+?)\./;
const ALTERNATIVE_PATTERN = /([A-Z][a-z]+) says you should stop only if (.+?) is ([a-z]+)\./;
const ENOUGH_PATTERN = /([A-Z][a-z]+) says the card named (.+?) as enough\./;

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  const reading = READING_PATTERN.exec(statement);
  const stop = STOP_PATTERN.exec(statement);
  const alternative = ALTERNATIVE_PATTERN.exec(statement);
  const enough = ENOUGH_PATTERN.exec(statement);
  if (card === null || reading === null || stop === null || alternative === null || enough === null) {
    throw new Error('the statement does not record the card, the reading, the action, and the two speakers');
  }
  return {
    place: /^Kiln card in (.+?):/.exec(statement)?.[1] ?? '',
    instrument: card[1],
    threshold: Number(card[2]),
    action: card[3],
    readInstrument: reading[1],
    reading: Number(reading[2]),
    subject: stop[1],
    stopAction: stop[2],
    sayer: alternative[1],
    extraSign: alternative[2],
    alternative: alternative[3],
    claimer: enough[1],
    namedReason: enough[2]
  };
}

function solve(slots) {
  const { instrument, threshold, action, readInstrument, reading, stopAction, alternative, extraSign } = slots;
  if (!Number.isInteger(threshold) || threshold <= 0 || !Number.isInteger(reading) || reading <= 0) {
    throw new Error('the card must state a positive threshold and the case a positive reading');
  }
  if (readInstrument !== instrument) {
    throw new Error('the recorded reading must come from the instrument the card names');
  }
  if (stopAction !== action) {
    throw new Error('the action the case records must be the action the card names');
  }
  if (reading < threshold) {
    throw new Error('this section carries readings that meet the card threshold');
  }
  if (alternative === '' || alternative === extraSign) {
    throw new Error('the extra sign must be a quality, not a repetition of its object');
  }
  return { subject: slots.subject, instrument, threshold, reading, action, extraSign, alternative };
}

function render(solution) {
  return `Yes. The listed reading is sufficient for stopping. ${capitalize(solution.alternative)} would be another possible reason in another document.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Number.isInteger(slots.threshold) && slots.threshold > 0, "the card must state a positive threshold reading");',
  'probe(Number.isInteger(slots.reading) && slots.reading > 0, "the case must record a positive reading");',
  'probe(slots.reading >= slots.threshold, "the recorded reading must meet the card threshold");',
  'probe(slots.readInstrument === slots.instrument, "the recorded reading must come from the instrument the card names");',
  'probe(slots.stopAction === slots.action, "the action the case records must be the action the card names");',
  'probe(typeof slots.alternative === "string" && slots.alternative.length > 0, "the objector must name the extra sign");',
  'const alternative = slots.alternative.charAt(0).toUpperCase() + slots.alternative.slice(1);',
  'return "Yes. The listed reading is sufficient for stopping. " + alternative + " would be another possible reason in another document.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card reads: if the ${slots.instrument} reads ${solution.threshold} or more, stop the ${slots.action}; that makes the listed reading sufficient for stopping.`,
    `The ${slots.instrument} reads ${solution.reading}, which meets the threshold, so the action is forced on this card.`,
    `${slots.sayer} asks for ${solution.extraSign} as well, but the card names no such sign, and a sufficient condition is enough on its own.`,
    `${capitalize(solution.alternative)} could be another reason to stop in another document; that possibility does not block the conclusion this card forces.`
  ];
}

export const unit = 11;

export const cases = [
  {
    template: 'Sufficient conditions',
    type: slugify('Sufficient conditions'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
