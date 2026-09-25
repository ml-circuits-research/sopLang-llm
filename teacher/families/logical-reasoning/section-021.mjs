/**
 * Section 21 of the logical-reasoning book: from a sample toward a class.
 *
 * Every case reports a tasting of a handful of boxed chocolates drawn from one
 * open carton of 200, with no nuts found, and records three speakers: the
 * taster declares the whole carton nut-free, a second speaker says the tasted
 * chocolates support only a cautious climb, and a third calls the tasted set a
 * census. The case data changes the place, the names, and the sample size; the
 * reasoning is fixed: the sample is smaller than the carton, so the tasting
 * supports a limited inductive claim about this carton and no forced universal.
 * The family compares the two quantities and renders the verdict naming the
 * speaker who measured the strength right.
 */

import { slugify } from '../../naming.mjs';

const SETUP_PATTERN =
  /([A-Z][a-z]+) tastes (\d+) boxed chocolates from one open carton of (\d+) and finds no nuts\./;
const UNIVERSAL_PATTERN = /([A-Z][a-z]+) says the whole carton is nut-free\./;
const CAUTIOUS_PATTERN = /([A-Z][a-z]+) says the (\d+) support only a cautious climb\./;
const CENSUS_PATTERN = /([A-Z][a-z]+) says a sample of (\d+) is already a census\./;

function parse(statement) {
  const setup = SETUP_PATTERN.exec(statement);
  const universal = UNIVERSAL_PATTERN.exec(statement);
  const cautious = CAUTIOUS_PATTERN.exec(statement);
  const census = CENSUS_PATTERN.exec(statement);
  if (setup === null || universal === null || cautious === null || census === null) {
    throw new Error('the statement does not record the tasting and the three claims about it');
  }
  const sample = Number(setup[2]);
  const carton = Number(setup[3]);
  if (Number(cautious[2]) !== sample || Number(census[2]) !== sample) {
    throw new Error('every speaker must speak about the tasted set');
  }
  if (universal[1] !== setup[1]) {
    throw new Error('the universal claim must come from the taster');
  }
  return {
    taster: setup[1],
    sample,
    carton,
    claims: [
      { name: universal[1], stance: 'universal' },
      { name: cautious[1], stance: 'cautious' },
      { name: census[1], stance: 'census' }
    ]
  };
}

/**
 * The tasting covers the sample and not the carton, so the honest claim stays a
 * limited one. The family compares the two counts: while the sample is smaller
 * than the carton, the census stance is false and the cautious speaker is the
 * one who measured the strength right.
 */
function solve(slots) {
  const names = slots.claims.map((claim) => claim.name);
  if (new Set(names).size !== names.length) {
    throw new Error('the statement must record three different speakers');
  }
  if (!Number.isInteger(slots.sample) || !Number.isInteger(slots.carton) || slots.sample <= 0 || slots.carton <= 0) {
    throw new Error('the tasting must count positive numbers of chocolates');
  }
  if (slots.sample >= slots.carton) {
    throw new Error('the tasted set must be smaller than the carton, so the census stance cannot be right');
  }
  const cautious = slots.claims.filter((claim) => claim.stance === 'cautious').map((claim) => claim.name);
  const universal = slots.claims.filter((claim) => claim.stance === 'universal').map((claim) => claim.name);
  if (cautious.length !== 1 || universal.length !== 1 || universal[0] !== slots.taster) {
    throw new Error('the case must record one cautious claim by a second speaker and one universal claim by the taster');
  }
  return { cautious: cautious[0], sample: slots.sample, carton: slots.carton };
}

function render(solution) {
  return `A limited inductive claim about this carton, not a forced universal. ${solution.cautious} has the strength right. “So far” is the honest adverb.`;
}

const WIRES = [
  {
    name: 'cautious',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const cautious = slots.claims.filter((claim) => claim.stance === "cautious").map((claim) => claim.name);',
      'return cautious;'
    ].join('\n')
  }
];

const COMPUTE = [
  'return "A limited inductive claim about this carton, not a forced universal. " + $cautious[0] + " has the strength right. \\u201cSo far\\u201d is the honest adverb.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The tasting found no nuts in ${solution.sample} chocolates drawn from a carton of ${solution.carton}.`,
    `Induction climbs from the tasted cases toward the class, so ${solution.sample} of ${solution.carton} supports a limited claim about this carton.`,
    `${solution.cautious} keeps the claim at that strength, while the taster's nut-free carton and the census stance both jump past what the sample covers.`,
    `The honest form of the conclusion keeps "so far", because the untasted chocolates have not been examined.`
  ];
}

export const unit = 21;

export const cases = [
  {
    template: 'From sample toward a class',
    type: slugify('From sample toward a class'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
