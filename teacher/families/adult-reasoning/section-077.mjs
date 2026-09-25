/**
 * Section 77 of the adult-reasoning course: files, copies, and versions.
 *
 * Every variant prints the same copy guide (an important file lives in two
 * places, the version is the date in the name, never edit the only stick, and
 * the recycle bin is not a reserve) and then describes one person who deletes
 * the newer version from the computer — where it only reaches the recycle bin —
 * and edits the only stick that still holds a useful copy. The verdict names
 * the broken rules: one useful place left, the bin counted as a copy, and the
 * only stick edited. The variants change the person and the version names, so
 * the family derives each clause from the parsed actions.
 */

import { slugify } from '../../naming.mjs';

const ACTION_PATTERN =
  /^([A-Z][a-z]+) deletes (\S+) from the computer \(it stays in the bin\) and edits the only stick\.$/m;
const VERSION_PATTERN = /“([A-Za-z0-9_]+)” is newer than “([A-Za-z0-9_]+)”/;
const COUNT_WORDS = Object.freeze({ 2: 'two', 3: 'three' });

function dayOf(label) {
  const match = /(\d+)/.exec(label);
  if (match === null) {
    throw new Error(`the version name "${label}" does not carry a date`);
  }
  return Number(match[1]);
}

function parse(statement) {
  const action = ACTION_PATTERN.exec(statement);
  const versions = VERSION_PATTERN.exec(statement);
  if (action === null || versions === null) {
    throw new Error('the statement does not print the copy guide and the person acting on the copies');
  }
  const newerDay = dayOf(versions[1]);
  const olderDay = dayOf(versions[2]);
  if (newerDay <= olderDay) {
    throw new Error('the guide must call the later date the newer version');
  }
  return {
    name: action[1],
    deletedVersion: action[2],
    deletedFromComputer: /deletes \S+ from the computer/.test(statement),
    staysInBin: /it stays in the bin/.test(statement),
    editsOnlyStick: /edits the only stick/.test(statement),
    newerLabel: versions[1],
    olderLabel: versions[2],
    newerDay,
    olderDay
  };
}

function solve(slots) {
  if (!slots.deletedFromComputer) {
    throw new Error('the scenario must delete the computer copy of the newer version');
  }
  const usefulPlaces = slots.deletedFromComputer ? 1 : 2;
  const clauses = [];
  if (usefulPlaces === 1) {
    clauses.push('only one useful place');
  }
  if (slots.staysInBin) {
    clauses.push('the bin is not a copy');
  }
  if (slots.editsOnlyStick) {
    clauses.push('editing the only stick');
  }
  const word = COUNT_WORDS[clauses.length];
  if (word === undefined) {
    throw new Error(`${clauses.length} broken rules do not match the printed count`);
  }
  return { clauses, word, usefulPlaces };
}

function render(solution) {
  return `At least ${solution.word}: ${solution.clauses.join('; ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const usefulPlaces = slots.deletedFromComputer ? 1 : 2;',
  'probe(usefulPlaces === 1, "the deletion must leave a single useful place");',
  'const clauses = [];',
  'if (usefulPlaces === 1) { clauses.push("only one useful place"); }',
  'if (slots.staysInBin) { clauses.push("the bin is not a copy"); }',
  'if (slots.editsOnlyStick) { clauses.push("editing the only stick"); }',
  'const words = { 2: "two", 3: "three" };',
  'const word = words[clauses.length];',
  'probe(typeof word === "string", "the broken-rule count must have a printed word");',
  'return "At least " + word + ": " + clauses.join("; ") + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The guide keeps an important file in two places, and ${slots.name} deletes the ${slots.deletedVersion} copy from the computer, so only the stick still holds a useful copy.`,
    'The deleted file only reaches the recycle bin, and the guide says the bin is not a reserve, so the bin is not counted as a copy.',
    'Because the stick is now the only useful place, editing it removes the last good version. Both printed versions matter: the guide keeps the file name as the version, and it prints that the newer name is the later date.',
    `That leaves ${solution.clauses.length} rules broken: ${solution.clauses.join('; ')}.`
  ];
}

export const unit = 77;

export const cases = [
  {
    template: 'Files, copies, and versions',
    type: slugify('Files, copies, and versions'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
