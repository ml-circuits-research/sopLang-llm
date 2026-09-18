/**
 * Section 97 of the adult-reasoning course: a plan in steps with dependencies.
 *
 * Every variant prints the same four-step soup plan: shopping must precede
 * prep, boiling must follow prep, and the table step runs parallel with the
 * tail of the boil. One cook then reorders the work, starting the boil before
 * the prep, and states a target equal to the boil alone. The variants change
 * the cook, the three chain durations, and the stated target, so the family
 * derives the critical path, the broken arrow, and the mistaken target from the
 * parsed values.
 */

import { slugify } from '../../naming.mjs';

const SHOPPING_PATTERN = /S1 shopping (\d+) min \(before S2\)/;
const PREP_PATTERN = /S2 prep (\d+) min/;
const BOIL_PATTERN = /S3 boil (\d+) min after S2/;
const TABLE_PATTERN = /S4 table (\d+) min, parallel with the last (\d+) min of S3/;
const COOK_PATTERN =
  /([A-Z][a-z]+) starts S3 before S2 and wants everything in (\d+) min from the start\./;

function parse(statement) {
  const shopping = SHOPPING_PATTERN.exec(statement);
  const prep = PREP_PATTERN.exec(statement);
  const boil = BOIL_PATTERN.exec(statement);
  const table = TABLE_PATTERN.exec(statement);
  const cook = COOK_PATTERN.exec(statement);
  if (shopping === null || prep === null || boil === null || table === null || cook === null) {
    throw new Error('the statement does not print the four steps and the reordered plan');
  }
  return {
    cook: cook[1],
    shopping: Number(shopping[1]),
    prep: Number(prep[1]),
    boil: Number(boil[1]),
    table: Number(table[1]),
    tableOverlap: Number(table[2]),
    wanted: Number(cook[2]),
    startsBoilBeforePrep: true
  };
}

function solve(slots) {
  const chain = `${slots.shopping}+${slots.prep}+${slots.boil}`;
  const total = slots.shopping + slots.prep + slots.boil;
  const tableClause =
    slots.tableOverlap === slots.table
      ? 'S4 does not cut S3.'
      : `S4 overlaps only the last ${slots.tableOverlap} min of S3.`;
  const orderClause = slots.startsBoilBeforePrep
    ? 'Boiling before prep breaks the arrow.'
    : 'Boiling after prep respects the arrow.';
  const targetClause = `${slots.boil} is S3’s duration, not the chain’s.`;
  return { chain, total, tableClause, orderClause, targetClause };
}

function render(solution) {
  return `Critical path ${solution.chain}=${solution.total} min. ${solution.tableClause} ${solution.orderClause} ${solution.targetClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots === "object" && slots !== null, "the plan must carry the parsed steps");',
  'probe(typeof slots.cook === "string" && slots.cook.length > 0, "the reordered plan must name the cook");',
  'probe(Number.isInteger(slots.shopping) && slots.shopping > 0, "shopping must last a positive whole number of minutes");',
  'probe(Number.isInteger(slots.prep) && slots.prep > 0, "prep must last a positive whole number of minutes");',
  'probe(Number.isInteger(slots.boil) && slots.boil > 0, "boiling must last a positive whole number of minutes");',
  'probe(Number.isInteger(slots.table) && slots.table > 0, "the table step must last a positive whole number of minutes");',
  'probe(slots.tableOverlap > 0 && slots.tableOverlap <= slots.table, "the table step must overlap the tail of the boil");',
  'probe(Number.isInteger(slots.wanted) && slots.wanted > 0, "the cook must state a whole target in minutes");',
  'const chain = slots.shopping + "+" + slots.prep + "+" + slots.boil;',
  'const total = slots.shopping + slots.prep + slots.boil;',
  'const tableClause = slots.tableOverlap === slots.table',
  '  ? "S4 does not cut S3."',
  '  : "S4 overlaps only the last " + slots.tableOverlap + " min of S3.";',
  'const orderClause = slots.startsBoilBeforePrep',
  '  ? "Boiling before prep breaks the arrow."',
  '  : "Boiling after prep respects the arrow.";',
  'const targetClause = slots.boil + " is S3’s duration, not the chain’s.";',
  'return "Critical path " + chain + "=" + total + " min. " + tableClause + " " + orderClause + " " + targetClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `Shopping (${slots.shopping} min) must finish before prep (${slots.prep} min), and boiling (${slots.boil} min) must follow prep, so the only order that respects the arrows is S1 then S2 then S3.`,
    `The longest path through those dependencies is ${solution.chain}=${solution.total} minutes, which no parallelism can shorten because ${slots.cook} has put S3 ahead of S2, breaking the arrow the plan states.`,
    `S4 runs parallel with the last ${slots.tableOverlap} min of S3, so it hides inside the chain rather than cutting it.`,
    `${slots.cook} targets ${slots.wanted} min, but ${slots.boil} is S3’s duration alone, not the chain’s duration.`
  ];
}

export const unit = 97;

export const cases = [
  {
    template: 'A plan in steps with dependencies',
    type: slugify('A plan in steps with dependencies'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
