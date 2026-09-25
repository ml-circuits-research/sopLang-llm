/**
 * Section 18 of the logical-reasoning book: affirming the back of a conditional.
 *
 * Every case reuses the market card — "if it rained in the last hour, the
 * market pavement is wet" — and reports a wet pavement. Three speakers take a
 * stance: the first reads the wet pavement as proof of rain; the second points
 * at a street-cleaning truck ten minutes ago, a rival path to the same
 * consequent; the third says rivals do not matter once the then-clause matches,
 * which is the same mistake as the first. The case data changes the market
 * place and the three names; the reasoning is fixed: the card gives rain as one
 * sufficient path, not the only path, so the observed back forces nothing. The
 * family parses each stance and renders the verdict naming the two speakers who
 * affirm the back.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN = /If it rained in the last hour, the market pavement is wet\./;
const OBSERVED_PATTERN = /The pavement is wet\./;
const AFFIRM_PATTERN = /([A-Z][a-z]+) says it rained in the last hour\./;
const RIVAL_PATTERN = /([A-Z][a-z]+) lists a street-cleaning truck ten minutes ago as a rival path\./;
const THEN_CLAUSE_PATTERN = /([A-Z][a-z]+) says rivals do not matter once the then-clause matches\./;

function parse(statement) {
  if (!CARD_PATTERN.test(statement)) {
    throw new Error('the statement does not post the market card');
  }
  if (!OBSERVED_PATTERN.test(statement)) {
    throw new Error('the statement does not report the wet pavement');
  }
  const affirm = AFFIRM_PATTERN.exec(statement);
  const rival = RIVAL_PATTERN.exec(statement);
  const thenClause = THEN_CLAUSE_PATTERN.exec(statement);
  if (affirm === null || rival === null || thenClause === null) {
    throw new Error('the statement does not record the three stances on the wet pavement');
  }
  return {
    claims: [
      { name: affirm[1], stance: 'affirm-back' },
      { name: rival[1], stance: 'rival-path' },
      { name: thenClause[1], stance: 'affirm-back' }
    ]
  };
}

/**
 * The back of the card is observed; that does not select the front. Only the
 * "the then-clause matches, so the front holds" stance affirms the back, so the
 * family collects those speakers and leaves the rival-path speaker out.
 */
function solve(slots) {
  const names = slots.claims.map((claim) => claim.name);
  if (new Set(names).size !== names.length) {
    throw new Error('the statement must record three different speakers');
  }
  const affirmers = slots.claims.filter((claim) => claim.stance === 'affirm-back').map((claim) => claim.name);
  if (affirmers.length !== 2) {
    throw new Error('exactly two speakers must treat the wet pavement as proof of rain');
  }
  return { affirmers };
}

function render(solution) {
  return `No. ${solution.affirmers.join(' and ')} affirm the back. The card gives rain as one sufficient path, not the only path.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const affirmers = slots.claims.filter((claim) => claim.stance === "affirm-back").map((claim) => claim.name);',
  'return "No. " + affirmers.join(" and ") + " affirm the back. The card gives rain as one sufficient path, not the only path.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card says rain suffices for a wet pavement, and the pavement is wet.`,
    `${solution.affirmers[0]} and ${solution.affirmers[1]} read the wet pavement as proof of rain, which affirms the back of the card.`,
    `The street-cleaning truck is a second door to the same wet pavement, so the observed back does not select rain.`,
    `The card would force rain only if it read "wet only if rain", and it does not.`
  ];
}

export const unit = 18;

export const cases = [
  {
    template: 'Affirming the back',
    type: slugify('Affirming the back'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
