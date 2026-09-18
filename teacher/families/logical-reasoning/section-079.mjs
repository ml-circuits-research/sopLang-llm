/**
 * Section 79 of the logical-reasoning book: a vivid side road.
 *
 * Every case puts a committee in a named place on a question of whether a
 * listed item adds up, and answers it with a moving childhood story. One
 * person treats the story as an answer to the sum, a second says the story may
 * be important and still be a different subject, and a third claims vividness
 * is how adults do arithmetic. The case data changes the place, the item, and
 * the three names; the reasoning is fixed, so the printed verdict is constant:
 * the story did not address the sum, because vividness is not addition.
 *
 * The family reads the place, the item, and the three speakers, then renders
 * the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const SIDE_ROAD_PATTERN =
  /Committee in ([A-Za-z ]+) is asked whether ([a-z ]+) adds up\. A speaker describes a moving childhood story about a grandparent’s kitchen\. ([A-Za-z]+) treats the story as an answer to the sum\. ([A-Za-z]+) says the story may be important and still be a different subject\. ([A-Za-z]+) says vividness is how adults do arithmetic\./;

function parse(statement) {
  const sideRoad = SIDE_ROAD_PATTERN.exec(statement);
  if (sideRoad === null) {
    throw new Error('the statement does not record the committee question and its three speakers');
  }
  return {
    place: sideRoad[1].trim(),
    item: sideRoad[2].trim(),
    confused: sideRoad[3],
    steady: sideRoad[4],
    enthusiast: sideRoad[5]
  };
}

function solve(slots) {
  if (slots.confused === slots.steady || slots.confused === slots.enthusiast || slots.steady === slots.enthusiast) {
    throw new Error('the case needs three different speakers');
  }
  if (!slots.item.includes('line')) {
    throw new Error('the committee question must be about a listed line');
  }
  return {
    place: slots.place,
    item: slots.item,
    confused: slots.confused,
    steady: slots.steady,
    enthusiast: slots.enthusiast
  };
}

function render(solution) {
  return 'No. It changed the subject. Vividness is not addition.';
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the committee place");',
  'probe(typeof slots.item === "string" && slots.item.indexOf("line") >= 0, "the committee question must be about a listed line");',
  'probe(slots.confused !== slots.steady && slots.confused !== slots.enthusiast && slots.steady !== slots.enthusiast, "the case must name three different speakers");',
  'probe(typeof slots.enthusiast === "string" && slots.enthusiast.length > 0, "the case must name the speaker who defends vividness");',
  'const question = slots.item;',
  'probe(question.indexOf("line") >= 0, "the committee question must be about a listed line");',
  'probe(question.length > 0, "the committee question must not be empty");',
  'return "No. It changed the subject. Vividness is not addition.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The committee in ${solution.place} asked whether ${solution.item} adds up, so the question is arithmetic.`,
    `${solution.confused} treats a kitchen memory as an answer to that sum, but the story does not touch the cells of the line.`,
    `${solution.steady} keeps the two apart correctly: the story may be important and still be a different subject.`,
    `${solution.enthusiast} is wrong that vividness is how adults do arithmetic; a side road is not the road that was asked about.`
  ];
}

export const unit = 79;

export const cases = [
  {
    template: 'A vivid side road',
    type: slugify('A vivid side road'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
