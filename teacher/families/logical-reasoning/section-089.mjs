/**
 * Section 89 of the logical-reasoning book: the already-ticked box.
 *
 * Every case stages a form in a named place that arrives with one option
 * already ticked, records that unticking is allowed, and gives one person who
 * leaves the tick because it was there, one voice that asks whether the option
 * would be chosen on a blank form, and one voice that calls defaults nature.
 * The case data changes the place, the ticked option, and the three names; the
 * reasoning is fixed: the tick works through status quo / default, nature did
 * not mark the box, and the answer must be judged as if both boxes started
 * empty, so the module renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const FORM_PATTERN =
  /A form in (.+?) arrives with “(.+?)” already ticked\. Unticking is allowed\. ([A-Z][a-z]+) leaves the tick because it was there\. ([A-Z][a-z]+) asks whether (.+?) would be chosen on a blank form\. ([A-Z][a-z]+) says defaults are nature\./;

function parse(statement) {
  const form = FORM_PATTERN.exec(statement);
  if (form === null) {
    throw new Error('the statement does not record the pre-ticked form and the three voices');
  }
  return {
    place: form[1],
    option: form[2],
    keeper: form[3],
    asker: form[4],
    subject: form[5],
    naturalist: form[6]
  };
}

function solve(slots) {
  if (slots.option.length === 0 || slots.subject.length === 0) {
    throw new Error('the case must name the ticked option and the choice it stands for');
  }
  return {
    place: slots.place,
    option: slots.option,
    subject: slots.subject,
    keeper: slots.keeper,
    asker: slots.asker,
    naturalist: slots.naturalist
  };
}

function render(solution) {
  return `Status quo / default. Nature did not mark the box. Answer as if both boxes started empty.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "Status quo / default. Nature did not mark the box. Answer as if both boxes started empty.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The form in ${solution.place} arrives with “${solution.option}” already ticked, and leaving it costs nothing but a motion.`,
    `${solution.keeper} leaves it because it was there, so the option rides on status quo / default rather than on a considered choice.`,
    `${solution.asker} asks the right question about a blank form, while ${solution.naturalist} mistakes the ink for nature.`,
    `Judge ${solution.subject} as if both boxes started empty.`
  ];
}

export const unit = 89;

export const cases = [
  {
    template: 'The already-ticked box',
    type: slugify('The already-ticked box'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
