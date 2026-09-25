/**
 * Section 58 of the logical-reasoning book: a lab note and a first check.
 *
 * Every case records one instrument read on Monday and a larger read on
 * Tuesday, quotes a manual that names the first check to run when a jump that
 * large appears, and stages three reactions: publish a new law, rerun the
 * calibration, or claim large jumps are always discoveries. The place, the two
 * readings, and the three names change with the case; the ranking does not:
 * instrument or procedure error stays open as the listed first candidate, and a
 * new natural law is the expensive story.
 */

import { slugify } from '../../naming.mjs';

const NOTE_PATTERN =
  /^Lab note in ([A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)*): the same instrument reads (\d+) on Monday and (\d+) on Tuesday\. Manual: “If a jump this large appears, first rerun with a fresh calibration standard\.” ([A-Z][a-z]+) publishes a new natural law by Tuesday afternoon\. ([A-Z][a-z]+) reruns the calibration\. ([A-Z][a-z]+) says large jumps are always discoveries\.\n\nQuestion\. What is the first ranked story\?$/;

function parse(statement) {
  const note = NOTE_PATTERN.exec(statement);
  if (note === null) {
    throw new Error('the statement does not record the two readings, the manual clause, and the three reactions');
  }
  return {
    place: note[1],
    monday: Number(note[2]),
    tuesday: Number(note[3]),
    discoverer: note[4],
    checker: note[5],
    appetite: note[6]
  };
}

function solve(slots) {
  if (!Number.isInteger(slots.monday) || !Number.isInteger(slots.tuesday)) {
    throw new Error('the lab note must carry two whole-number readings');
  }
  const jump = slots.tuesday - slots.monday;
  if (jump <= 0) {
    throw new Error('the lab note must record a jump, so Tuesday must read higher than Monday');
  }
  const people = [slots.discoverer, slots.checker, slots.appetite];
  if (new Set(people).size !== people.length) {
    throw new Error('the three reactions must come from three different people');
  }
  return {
    place: slots.place,
    monday: slots.monday,
    tuesday: slots.tuesday,
    jump,
    discoverer: people[0],
    checker: people[1],
    appetite: people[2]
  };
}

function render() {
  return 'Instrument or procedure error remains open and is the listed first candidate. A new law is the expensive story.';
}

const COMPUTE = [
  'const slots = $slots;',
  'const jump = slots.tuesday - slots.monday;',
  'const people = [slots.discoverer, slots.checker, slots.appetite];',
  'return "Instrument or procedure error remains open and is the listed first candidate. A new law is the expensive story.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The note in ${solution.place} records the same instrument reading ${solution.monday} on Monday and ${solution.tuesday} on Tuesday, a jump of ${solution.jump}.`,
    `The manual names a first rival for exactly this shape: rerun with a fresh calibration standard, so instrument or procedure error stays open as the first ranked candidate.`,
    `${solution.discoverer} reaches past that check and publishes a new natural law, which is the expensive story rather than the first one.`,
    `${solution.appetite} says large jumps are always discoveries, which is an appetite for drama; ${solution.checker} runs the listed check first.`
  ];
}

export const unit = 58;

export const cases = [
  {
    template: 'A lab note and a first check',
    type: slugify('A lab note and a first check'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
