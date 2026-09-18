/**
 * Section 19 of the logical-reasoning book: denying the front of a conditional.
 *
 * Every case posts the market card — "if it rained in the last hour, the market
 * pavement is wet" — and reports a gauge showing no rain in the last hour.
 * Three speakers take a stance: the first concludes that the pavement must be
 * dry; the second says the card does not decide the pavement; the third pours a
 * bucket and asks whether the card forbids it. The case data changes the market
 * place and the three names; the reasoning is fixed: killing the front leaves
 * the back open, so nothing follows about the pavement, and the bucket is
 * another door to wetness. The family parses each stance and renders the
 * verdict naming the speaker who denied the front.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN = /If it rained in the last hour, the market pavement is wet\./;
const GAUGE_PATTERN = /A gauge shows no rain in the last hour\./;
const DENY_PATTERN = /([A-Z][a-z]+) says the pavement must be dry\./;
const OPEN_PATTERN = /([A-Z][a-z]+) says the card does not decide the pavement\./;
const BUCKET_PATTERN = /([A-Z][a-z]+) pours a bucket and asks whether the card forbids the bucket\./;

function parse(statement) {
  if (!CARD_PATTERN.test(statement)) {
    throw new Error('the statement does not post the market card');
  }
  if (!GAUGE_PATTERN.test(statement)) {
    throw new Error('the statement does not report the gauge showing no rain');
  }
  const deny = DENY_PATTERN.exec(statement);
  const open = OPEN_PATTERN.exec(statement);
  const bucket = BUCKET_PATTERN.exec(statement);
  if (deny === null || open === null || bucket === null) {
    throw new Error('the statement does not record the three stances on the dry gauge');
  }
  return {
    claims: [
      { name: deny[1], stance: 'deny-front' },
      { name: open[1], stance: 'front-open' },
      { name: bucket[1], stance: 'front-open' }
    ]
  };
}

/**
 * No rain removes the front of the card, which does not remove the back. Only
 * the "the pavement must be dry" stance denies the front, so the family
 * collects those speakers and leaves the open-front speakers out.
 */
function solve(slots) {
  const names = slots.claims.map((claim) => claim.name);
  if (new Set(names).size !== names.length) {
    throw new Error('the statement must record three different speakers');
  }
  const deniers = slots.claims.filter((claim) => claim.stance === 'deny-front').map((claim) => claim.name);
  if (deniers.length !== 1) {
    throw new Error('exactly one speaker must read the dry gauge as a dry pavement');
  }
  return { deniers };
}

function render(solution) {
  return `Nothing about the pavement. ${solution.deniers[0]} denied the front. The bucket is another door to wetness.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.claims) && slots.claims.length === 3, "the case must record the three speakers on the dry gauge");',
  'probe(slots.claims.every((claim) => typeof claim.name === "string" && claim.name.length > 0), "every speaker must have a name");',
  'probe(slots.claims.every((claim) => claim.stance === "deny-front" || claim.stance === "front-open"), "every stance must deny the front or leave it open");',
  'probe(new Set(slots.claims.map((claim) => claim.name)).size === slots.claims.length, "the three speakers must be different people");',
  'const deniers = slots.claims.filter((claim) => claim.stance === "deny-front").map((claim) => claim.name);',
  'probe(deniers.length === 1, "exactly one speaker must read the dry gauge as a dry pavement");',
  'return "Nothing about the pavement. " + deniers[0] + " denied the front. The bucket is another door to wetness.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card says rain suffices for a wet pavement, and the gauge shows no rain in the last hour.`,
    `${solution.deniers[0]} concludes that the pavement must be dry, which denies the front of the card.`,
    `Removing the front removes nothing from the back, because the card never said rain is the only door to wetness.`,
    `The poured bucket is another door, so the card does not forbid a wet pavement after a dry gauge.`
  ];
}

export const unit = 19;

export const cases = [
  {
    template: 'Denying the front',
    type: slugify('Denying the front'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
