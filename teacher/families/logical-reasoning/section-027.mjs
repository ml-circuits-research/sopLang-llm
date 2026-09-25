/**
 * Section 27 of the logical-reasoning book: rules of thumb.
 *
 * Every case posts a cook's card that hedges with “usually,” records a night
 * that is still firm at the time the card names, and asks what kind of sentence
 * the card was. The case data changes the kitchen and the three speakers; the
 * reasoning is fixed: a hedged policy is inductive, so one firm night is a miss
 * for a universal that was never posted.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN =
  /Cook\u2019s card in ([A-Za-z ]+): \u201cRice is usually done in (\d+) minutes at this stove\.\u201d Tonight the rice is still firm at (\d+) minutes\./;
const SPEAKERS_PATTERN =
  /([A-Z][a-z]+) says the card is false as a universal\. ([A-Z][a-z]+) says \u201cusually\u201d already left room for a miss\. ([A-Z][a-z]+) says rules of thumb are secret deductions\./;

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  const speakers = SPEAKERS_PATTERN.exec(statement);
  if (card === null) {
    throw new Error('the statement does not record the cook\u2019s card and the firm night');
  }
  if (speakers === null) {
    throw new Error('the statement does not record the three speakers');
  }
  return {
    kitchen: card[1].trim(),
    cardMinutes: Number(card[2]),
    nightMinutes: Number(card[3]),
    attacker: speakers[1],
    hedger: speakers[2],
    third: speakers[3]
  };
}

function solve(slots) {
  if (slots.nightMinutes !== slots.cardMinutes) {
    throw new Error('the firm night must fall at the time the card names');
  }
  const speakers = [slots.attacker, slots.hedger, slots.third];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the statement must name three different speakers');
  }
  return {
    attacker: slots.attacker,
    kitchen: slots.kitchen,
    cardMinutes: slots.cardMinutes
  };
}

function render(solution) {
  return `An inductive policy with slack in “usually.” ${solution.attacker} attacked a universal that was not posted.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "An inductive policy with slack in \\u201cusually.\\u201d " + slots.attacker + " attacked a universal that was not posted.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card says the rice is usually done in ${solution.cardMinutes} minutes, and “usually” is not “always.”`,
    `A miss hurts a universal, but it only nudges a rule of thumb, so ${solution.attacker} attacked a universal that was never posted.`,
    'Acting on the card (tasting, waiting) can still be reasonable, and the hedge must not be hardened after the fact.'
  ];
}

export const unit = 27;

export const cases = [
  {
    template: 'Rules of thumb',
    type: slugify('Rules of thumb'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
