/**
 * Section 100 of the logical-reasoning book: capstone cases with mixed tools.
 *
 * Every case posts four objects in a named square: a headline shouting that
 * the market proves ice never floats, a stall table showing one iron bar
 * sinking, a school card explaining that ice floats because it is less dense
 * than liquid water, and a speaker who says doubters hate the town, then three
 * readings of the square. The case data changes the place and the three names;
 * the reasoning is fixed: the headline is costume, the iron bar does not speak
 * about ice, the density mechanism stands, and the person-strike is set aside.
 * The family reads the square and renders the printed capstone verdict.
 */

import { slugify } from '../../naming.mjs';

const SQUARE_PATTERN =
  /^In ([A-Z][a-z]+(?: [A-Z][a-z]+)*) square a headline says \u201cMARKET PROVES ICE NEVER FLOATS\.\u201d A stall table shows one iron bar sinking\. A school card on the same square: ice floats because it is less dense than liquid water\. A speaker says anyone who doubts the headline hates the town\. ([A-Z][a-z]+) treats the headline as the fact\. ([A-Z][a-z]+) separates headline, one sinking bar, the density card, and the person-strike\. ([A-Z][a-z]+) says a loud square is already a method\./;

function parse(statement) {
  const square = SQUARE_PATTERN.exec(statement);
  if (square === null) {
    throw new Error('the statement does not record the square and its four objects');
  }
  return {
    place: square[1],
    headlineReader: square[2],
    separator: square[3],
    loudnessReader: square[4]
  };
}

function solve(slots) {
  if (typeof slots.place !== 'string' || slots.place.length === 0) {
    throw new Error('the square must name its place');
  }
  const readers = [slots.headlineReader, slots.separator, slots.loudnessReader];
  if (!readers.every((name) => typeof name === 'string' && name.length > 0)) {
    throw new Error('the square must name the three people reading it');
  }
  if (new Set(readers).size !== readers.length) {
    throw new Error('the three readings must come from three different people');
  }
  return {
    place: slots.place,
    headlineReader: slots.headlineReader,
    separator: slots.separator,
    loudnessReader: slots.loudnessReader
  };
}

function render() {
  return 'It refuses the headline as costume, notes that iron sinking does not speak about ice, keeps the density mechanism, and sets aside the person-strike. Loudness is not a family of reasoning.';
}

const COMPUTE = [
  'const slots = $slots;',
  'const readers = [slots.headlineReader, slots.separator, slots.loudnessReader];',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the square must name its place");',
  'probe(readers.every((name) => typeof name === "string" && name.length > 0), "the square must name the three people reading it");',
  'probe(new Set(readers).size === readers.length, "the three readings must come from three different people");',
  'return "It refuses the headline as costume, notes that iron sinking does not speak about ice, keeps the density mechanism, and sets aside the person-strike. Loudness is not a family of reasoning.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The square in ${solution.place} holds four objects: a headline claiming the market proves ice never floats, a stall table with one sinking iron bar, a school card on density, and a speaker striking at doubters.`,
    `${solution.separator} labels each layer: the headline is costume, the iron bar is one object of another kind, the density card is the mechanism, and the insult is not evidence.`,
    `${solution.headlineReader} lets the headline stand as the fact, and the iron bar cannot speak about ice because it does not share the relevant property.`,
    `${solution.loudnessReader} treats a loud square as a method; loudness is not a family of reasoning.`
  ];
}

export const unit = 100;

export const cases = [
  {
    template: 'Capstone cases — mixed tools',
    type: slugify('Capstone cases — mixed tools'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
