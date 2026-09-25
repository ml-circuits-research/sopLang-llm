/**
 * Section 7 of the logical-reasoning book: hypothetical chains.
 *
 * Every case posts a door card carrying three chained conditionals, records
 * one person who holds the condition of the first link and one who reads the
 * absence of that condition as a proof of the opposite of the last link, and
 * asks what the chain forces. The case data changes the place and the three
 * names; the chain keeps its shape: presence enters at the first antecedent
 * and the last consequent is the conclusion the card carries forward. The
 * family reads the three links from the card and renders the printed verdict
 * with the name of the person who denied the front of the chain.
 */

import { slugify } from '../../naming.mjs';

const CHAIN_PATTERN = /“If (.+?), (.+?)\. If (.+?), (.+?)\. If (.+?), (.+?)\.”/;
const HOLDER_PATTERN = /([A-Z][a-z]+) is issued (.+?)\./;
const DENIER_PATTERN = /([A-Z][a-z]+) sees no key issued and says (.+?) must stay shut forever\./;
const ASKER_PATTERN = /([A-Z][a-z]+) asks whether the chain carries/;
const QUESTION_PATTERN = /What does the chain force when (.+?) is issued\?/;

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function parse(statement) {
  const chain = CHAIN_PATTERN.exec(statement);
  const holder = HOLDER_PATTERN.exec(statement);
  const denier = DENIER_PATTERN.exec(statement);
  const asker = ASKER_PATTERN.exec(statement);
  const question = QUESTION_PATTERN.exec(statement);
  if (chain === null || holder === null || denier === null || asker === null || question === null) {
    throw new Error('the statement does not record the door card, the holder, the denial, and the question');
  }
  if (question[1] !== holder[2]) {
    throw new Error('the question must ask about the condition the holder satisfies');
  }
  return {
    subject: holder[1],
    trigger: holder[2],
    links: [
      { if: chain[1], then: chain[2] },
      { if: chain[3], then: chain[4] },
      { if: chain[5], then: chain[6] }
    ],
    denier: denier[1],
    denierClaim: denier[2],
    asker: asker[1]
  };
}

function solve(slots) {
  const { subject, trigger, links, denier, denierClaim, asker } = slots;
  if (links.length !== 3) {
    throw new Error('the chain must carry three links');
  }
  if (links[0].if !== `${trigger} is issued`) {
    throw new Error('the chain must start at the condition the holder satisfies');
  }
  const conclusion = links[links.length - 1].then;
  if (conclusion === denierClaim || !conclusion.startsWith(denierClaim)) {
    throw new Error('the denial must name the subject of the chain conclusion');
  }
  if (denier === subject || asker === subject || asker === denier) {
    throw new Error('the holder, the denier, and the asker must be three different people');
  }
  return { subject, conclusion, denier, asker };
}

function render(solution) {
  return `${capitalize(solution.conclusion)}. ${solution.denier} denied the front of the first link and treated that as a proof of the opposite end. The card did not say the key is the only possible door.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const conclusion = slots.links[slots.links.length - 1].then;',
  'const verdict = conclusion.charAt(0).toUpperCase() + conclusion.slice(1);',
  'return verdict + ". " + slots.denier + " denied the front of the first link and treated that as a proof of the opposite end. The card did not say the key is the only possible door.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card carries three links: ${slots.links.map((link) => `if ${link.if} then ${link.then}`).join('; ')}.`,
    `${solution.subject} is issued ${slots.trigger}, so the first antecedent is present and the chain transfers that presence forward link by link.`,
    `The last consequent is the conclusion the card forces: ${solution.conclusion}.`,
    `${solution.denier} denied the front of the first link and treated that denial as a proof of the opposite end, but the card never says the key is the only possible door, so ${solution.denier} is writing a second document.`
  ];
}

export const unit = 7;

export const cases = [
  {
    template: 'Hypothetical chains',
    type: slugify('Hypothetical chains'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
