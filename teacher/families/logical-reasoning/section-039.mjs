/**
 * Section 39 of the logical-reasoning book: mapping the parts.
 *
 * Every case prints a class card whose engine is the heart's two circuits, one
 * speaker who maps them onto a town pump with one loop through a filter and
 * one loop through houses, one speaker who maps them onto a single bucket
 * passed around a table, and one speaker who says any water-moving picture
 * will do. The cases change the place and the three names; the card's engine
 * is the number of circuits, so the mapping that survives is the one whose
 * pump keeps exactly that many loops, and the printed answer names the number
 * and the speaker who offered it.
 */

import { slugify } from '../../naming.mjs';

const CLASS_CARD_PATTERN =
  /Class card in ([^:]+): the heart moves blood in ([a-z]+) circuits \u2014 one through the lungs, one through the rest of the body\. ([A-Z][a-z]+) analogises (a town pump that has one loop through a filter and one loop through houses)\. ([A-Z][a-z]+) analogises a single bucket passed around a table\. ([A-Z][a-z]+) says any water-moving picture is as good as any other\./;

const CIRCUIT_COUNTS = Object.freeze({ one: 1, two: 2, three: 3 });
const NUMBER_WORDS = Object.freeze(['zero', 'one', 'two', 'three']);

function parse(statement) {
  const card = CLASS_CARD_PATTERN.exec(statement);
  if (card === null) {
    throw new Error('the statement does not record the class card, the two water pictures, and the third speaker');
  }
  const circuits = CIRCUIT_COUNTS[card[2]];
  if (circuits === undefined) {
    throw new Error(`the card states an unknown number of circuits: "${card[2]}"`);
  }
  const loops = (card[4].match(/loop/g) ?? []).length;
  return {
    place: card[1].trim(),
    circuits,
    loops,
    mapper: card[3],
    alternative: card[5],
    leveler: card[6]
  };
}

/**
 * The card's engine is the circuit count, so a picture keeps the listed
 * structure only when its pump keeps as many loops as the card lists circuits.
 * The bucket picture loses the second circuit and the third speaker treats the
 * mapping as a vibe about water.
 */
function solve(slots) {
  if (slots.loops !== slots.circuits) {
    throw new Error(`the surviving mapping has ${slots.loops} loop(s) but the card lists ${slots.circuits} circuit(s)`);
  }
  return { mapper: slots.mapper, circuits: slots.circuits };
}

function render(solution) {
  const word = NUMBER_WORDS[solution.circuits];
  return `${solution.mapper}\u2019s ${word}-loop pump. The card\u2019s engine is ${word} circuits, not \u201cwater moves.\u201d`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const NUMBER_WORDS = ["zero", "one", "two", "three"];',
  'const word = NUMBER_WORDS[slots.circuits];',
  'return slots.mapper + "\\u2019s " + word + "-loop pump. The card\\u2019s engine is " + word + " circuits, not \\u201cwater moves.\\u201d";'
].join('\n');

function explain(slots, solution) {
  const word = NUMBER_WORDS[solution.circuits];
  return [
    `The card's engine is ${word} circuits: one through the lungs and one through the rest of the body, with a pump to drive them.`,
    `${slots.mapper} maps that engine onto a town pump with one loop through a filter and one loop through houses, so the pump keeps one loop per circuit.`,
    `${slots.alternative} maps a single bucket passed around a table, which loses the second circuit, and ${slots.leveler} answers that any water-moving picture is as good as any other.`,
    `Mapping is work rather than a vibe about water: the part that did the teaching must appear in the map, so ${solution.mapper}.`
  ];
}

export const unit = 39;

export const cases = [
  {
    template: 'Mapping the parts',
    type: slugify('Mapping the parts'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
