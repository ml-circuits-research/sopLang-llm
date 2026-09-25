/**
 * Family G5 of the world seed book: maps, legends, and clues.
 *
 * Every problem states a legend, the attributes of four map cells, and a set of
 * required attributes; the answer lists the cells whose attribute set contains
 * every required attribute, in printed order. From grade 2 on, the statement
 * additionally carries a cross-domain check (map scale, clock arithmetic,
 * quorum, or duplicate reports, optionally combined with a map-sheet count),
 * which the family renders as the labelled answer suffix through the shared
 * `renderCrossDomain`.
 *
 * The four grades share one computation; the grade differences live in the
 * stated data and in whether a cross-domain check is appended.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';

const CELL_PATTERN = /([A-Z]\d) has ([^;.]+)/g;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const cells = [];
  for (const match of facts.matchAll(CELL_PATTERN)) {
    cells.push({ id: match[1], attributes: match[2].split(',').map((value) => value.trim()) });
  }
  if (cells.length === 0) {
    throw new Error('the statement describes no map cell');
  }
  const conditions = /conditions: (.+?)\?/.exec(blocks.Task);
  if (conditions === null) {
    throw new Error('the task lists no required attributes');
  }
  return {
    cells,
    required: conditions[1].split(',').map((value) => value.trim()),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  const matching = slots.cells
    .filter((cell) => slots.required.every((attribute) => cell.attributes.includes(attribute)))
    .map((cell) => cell.id);
  if (matching.length === 0) {
    throw new Error('no cell has every required attribute');
  }
  return { matching, crossDomain: slots.crossDomain };
}

function render(solution) {
  const main = solution.matching.join(', ');
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const WIRES = [
  {
    name: 'matching',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const matching = slots.cells.filter((cell) => slots.required.every((attribute) => cell.attributes.includes(attribute))).map((cell) => cell.id);',
      'probe(matching.length > 0, "at least one cell must have every required attribute");',
      'return matching;'
    ].join('\n')
  },
  {
    name: 'cross',
    command: 'jsEval',
    body: [
      CROSS_DOMAIN_SOURCE,
      'return { suffix: renderCrossDomain($slots.crossDomain) };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const suffix = $cross.suffix;',
  'return suffix === "" ? $matching.join(", ") : $matching.join(", ") + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The task requires the attribute set ${JSON.stringify(slots.required)}, and each cell satisfies the task only when it has every one of those attributes.`,
    `Intersecting the clue sets leaves ${solution.matching.length === 1 ? 'one cell' : 'the cells'} ${solution.matching.join(', ')} in printed order.`,
    'Extra attributes do not disqualify a cell, and no other cell has all of the required attributes.'
  ];
}

function caseFor(grade) {
  return {
    template: `Maps, legends, and clues (grade ${grade})`,
    type: `maps-legends-and-clues-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'G5';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
