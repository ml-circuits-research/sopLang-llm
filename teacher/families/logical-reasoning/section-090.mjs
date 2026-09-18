/**
 * Section 90 of the logical-reasoning book: a face and a table.
 *
 * Every case posts a board in a named place with a table of N listed cases and
 * one photographed face carrying a captioned story, and records one person who
 * lets the face outvote the table, one voice that keeps the face as a person
 * and the table as a rate, and one voice that calls the face the adult form of
 * N rows. The case data changes the place, the row count, and the three names;
 * the reasoning is fixed: affect threatens to replace the rate, and one story
 * stays one story even when it is true, so the module renders the printed
 * verdict with the counted rows.
 */

import { slugify } from '../../naming.mjs';

const BOARD_PATTERN =
  /Board in (.+?): a table of (\d+) listed cases, and one photographed face with a captioned story\. ([A-Z][a-z]+) lets the face outvote the table\. ([A-Z][a-z]+) keeps the face as a person and the table as a rate\. ([A-Z][a-z]+) says a face is the adult form of (\d+) rows\./;

function parse(statement) {
  const board = BOARD_PATTERN.exec(statement);
  if (board === null) {
    throw new Error('the statement does not record the board with its table and its face');
  }
  return {
    place: board[1],
    rows: Number(board[2]),
    outvoter: board[3],
    keeper: board[4],
    conflater: board[5],
    claimedRows: Number(board[6])
  };
}

function solve(slots) {
  if (!Number.isInteger(slots.rows) || slots.rows <= 0) {
    throw new Error('the table must list a positive number of cases');
  }
  if (slots.claimedRows !== slots.rows) {
    throw new Error('the two mentions of the table size must agree');
  }
  return {
    place: slots.place,
    rows: slots.rows,
    outvoter: slots.outvoter,
    keeper: slots.keeper,
    conflater: slots.conflater
  };
}

function render(solution) {
  return `The rate. A story can be true and urgent. It does not become ${solution.rows} rows.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place with the board");',
  'probe(typeof slots.outvoter === "string" && slots.outvoter.length > 0, "the case must name the person who lets the face outvote the table");',
  'probe(typeof slots.keeper === "string" && slots.keeper.length > 0, "the case must name the voice that keeps the face and the table separate");',
  'probe(typeof slots.conflater === "string" && slots.conflater.length > 0, "the case must name the voice that promotes the face to a rate");',
  'probe(slots.keeper !== slots.conflater, "the two voices must be different people");',
  'probe(Number.isInteger(slots.rows) && slots.rows > 0, "the table must list a positive number of cases");',
  'probe(slots.claimedRows === slots.rows, "the two mentions of the table size must agree");',
  'return "The rate. A story can be true and urgent. It does not become " + slots.rows + " rows.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The board in ${solution.place} holds two different objects: one photographed person with a story, and a table of ${solution.rows} listed cases.`,
    `${solution.outvoter} lets the face outvote the table, so a vivid feeling stands in for the weight of the rows.`,
    `${solution.keeper} keeps the face as a person and the table as a rate, and ${solution.conflater} wrongly calls the face the adult form of ${solution.rows} rows.`,
    `A story can be true and urgent and still does not become ${solution.rows} rows.`
  ];
}

export const unit = 90;

export const cases = [
  {
    template: 'A face and a table',
    type: slugify('A face and a table'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
