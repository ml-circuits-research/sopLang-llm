/**
 * Section 82 of the logical-reasoning book: what comes easily to mind.
 *
 * Every case posts two pictured crashes in one week beside a board table whose
 * listed yearly count has not risen, and three speakers: one who reads the
 * pictures as a rising frequency, one who names availability and separates the
 * week's pictures from a census, and one who takes the side of the pictures
 * against the table. The place and the three names change; the verdict is
 * fixed: availability supplied a feeling of commonness, the table remains the
 * count, and a vivid week is not a year.
 */

import { slugify } from '../../naming.mjs';

const CASE_PATTERN =
  /([A-Za-z]+) pictured crashes in one week dominate talk in ([^.]+)\. A table on the same board shows a listed yearly count that (has not risen|has risen)\. ([A-Z][a-z]+) says crashes are now common because they are easy to picture\. ([A-Z][a-z]+) says ease of recall is a fact about the week’s pictures, not a census\. ([A-Z][a-z]+) says tables cannot fight pictures\./;

const NUMBER_WORDS = Object.freeze({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12
});

function numberWord(word) {
  const value = NUMBER_WORDS[String(word).toLowerCase()];
  if (value === undefined) {
    throw new Error(`"${word}" is not a number word this family reads`);
  }
  return value;
}

function parse(statement) {
  const matched = CASE_PATTERN.exec(statement);
  if (matched === null) {
    throw new Error('the statement does not put pictured crashes beside a listed yearly count');
  }
  return {
    picturedCrashes: numberWord(matched[1]),
    place: matched[2],
    yearlyCountRose: matched[3] === 'has risen',
    picturingVoice: matched[4],
    availabilityVoice: matched[5],
    tableVoice: matched[6]
  };
}

function solve(slots) {
  const speakers = [slots.picturingVoice, slots.availabilityVoice, slots.tableVoice];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the case must give the three readings of the pictures to three different people');
  }
  if (slots.picturedCrashes <= 0) {
    throw new Error('the case must picture at least one crash in the week the talk runs on');
  }
  if (slots.yearlyCountRose) {
    throw new Error(`the year-count in ${slots.place} has risen, so the case is not an availability story`);
  }
  return { place: slots.place, supplied: 'A feeling of commonness' };
}

function render(solution) {
  return `${solution.supplied}. The table is the count. Pictures can be urgent and still be a bad substitute for a year-list.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const supplied = "A feeling of commonness";',
  'return supplied + ". The table is the count. Pictures can be urgent and still be a bad substitute for a year-list.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The talk in ${slots.place} runs on ${slots.picturedCrashes} pictured crashes in one week, while the board's listed yearly count has not risen.`,
    `${slots.picturingVoice} treats the easy pictures as a commonness of crashes, but ${slots.availabilityVoice} reads ease of recall as a fact about the week's pictures rather than a census.`,
    `So ${solution.supplied.toLowerCase()} is what availability supplied: the table stays the count, and the pictures are not a substitute for a year-list even when the care they prompt is real.`,
    `${slots.tableVoice}'s claim that tables cannot fight pictures does not change the count the table carries.`
  ];
}

export const unit = 82;

export const cases = [
  {
    template: 'What comes easily to mind',
    type: slugify('What comes easily to mind'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
