/**
 * Section 31 of the logical-reasoning book: relevant versus decorative
 * likeness.
 *
 * Every case teaches that an electric circuit is like a water circuit, asks why
 * a bulb goes dark when the path is cut, and records three speakers. The case
 * data changes the town and the three names; the reasoning is fixed: the
 * structural relations that did the explanatory work transfer, and a feature
 * that never entered the explanation (wetness) is decorative.
 */

import { slugify } from '../../naming.mjs';

const LESSON_PATTERN =
  /A teacher in ([A-Za-z ]+) says an electric circuit is like a water circuit: a source, a path, resistance, a return\. The lesson asks why a bulb goes dark when the path is cut\./;
const SPEAKERS_PATTERN =
  /([A-Z][a-z]+) maps \u201ccut path \u2192 no flow \u2192 dark bulb\.\u201d ([A-Z][a-z]+) says the analogy also proves that electricity is wet\. ([A-Z][a-z]+) says only the relations that did the work should move\./;

function parse(statement) {
  const lesson = LESSON_PATTERN.exec(statement);
  const speakers = SPEAKERS_PATTERN.exec(statement);
  if (lesson === null) {
    throw new Error('the statement does not record the lesson and its question');
  }
  if (speakers === null) {
    throw new Error('the statement does not record the three speakers');
  }
  return {
    town: lesson[1].trim(),
    mapper: speakers[1],
    wetness: speakers[2],
    third: speakers[3]
  };
}

function solve(slots) {
  const speakers = [slots.mapper, slots.wetness, slots.third];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the statement must name three different speakers');
  }
  return {
    town: slots.town,
    mapper: slots.mapper,
    wetness: slots.wetness
  };
}

function render() {
  return 'The structure: break the path, the working stops. Wetness is decorative.';
}

const COMPUTE = [
  'const slots = $slots;',
  'return "The structure: break the path, the working stops. Wetness is decorative.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The lesson in ${solution.town} maps the electric circuit onto the water circuit: a source, a path, resistance, a return.`,
    `${solution.mapper} keeps the relations that did the work, so cutting the path stops the flow and the bulb goes dark.`,
    `${solution.wetness} carries wetness across, but wetness never entered that explanation, so it is a decorative likeness rather than a relevant one.`,
    'The question to ask of any shared feature is whether it did any work over there.'
  ];
}

export const unit = 31;

export const cases = [
  {
    template: 'Relevant versus decorative likeness',
    type: slugify('Relevant versus decorative likeness'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
