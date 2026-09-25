/**
 * Section 14 of the logical-reasoning book: unless and except.
 *
 * Every case posts one hall board with two clauses: the hall stays open until a
 * stated closing time "unless" a storm warning is posted, and all evening
 * classes run "except" one listed class, which is cancelled. The stem then
 * posts no storm warning and records three reactions: a reader who treats the
 * world's storms as the warning, a reader who cancels the listed class and
 * keeps the rest, and a reader who treats "except" as licence to cancel
 * anything awkward. The town, the closing time, the excepted class, and the
 * three names change between cases; the reasoning is fixed. With no posted
 * warning the default stands, and a named exception stays a single hole.
 */

import { slugify } from '../../naming.mjs';

const BOARD_PATTERN =
  /^Hall board in ([A-Z][a-z]+(?: [A-Z][a-z]+)?): “The hall stays open until (\d{1,2}:\d{2}) unless a storm warning is posted\. All evening classes run as planned except the ([^,]+), which is cancelled\.”/;
const WEATHER_PATTERN = /(No|A) storm warning is posted\./;
const DOUBTER_PATTERN =
  /([A-Z][a-z]+) says the hall may already be shut because storms exist in the world\./;
const READER_PATTERN =
  /([A-Z][a-z]+) treats the ([^,]+) as cancelled and the other evening classes as running\./;
const OVERREACH_PATTERN =
  /([A-Z][a-z]+) treats “except” as permission to cancel anything awkward\./;

function parse(statement) {
  const board = BOARD_PATTERN.exec(statement);
  const weather = WEATHER_PATTERN.exec(statement);
  const doubter = DOUBTER_PATTERN.exec(statement);
  const reader = READER_PATTERN.exec(statement);
  const overreach = OVERREACH_PATTERN.exec(statement);
  if (board === null || weather === null || doubter === null || reader === null || overreach === null) {
    throw new Error('the statement does not record the hall board and its three reactions');
  }
  if (reader[2] !== board[3]) {
    throw new Error('the reader in the statement cancels a class the board does not list');
  }
  return {
    place: board[1],
    closing: board[2],
    cancelledClass: board[3],
    warningPosted: weather[1] === 'A',
    doubter: doubter[1],
    reader: reader[1],
    overreach: overreach[1]
  };
}

/**
 * "Open unless a warning is posted" is read by contraposition: with no posted
 * warning the default outlet stands, and the world's weather is not the posted
 * warning the board names. "All except X" removes exactly the listed class, so
 * the answer keeps the rest of the timetable.
 */
function solve(slots) {
  if (slots.warningPosted) {
    throw new Error('the case must post no storm warning, so the default closing time stands');
  }
  const speakers = [slots.doubter, slots.reader, slots.overreach];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three reactions must come from three different people');
  }
  return { closing: slots.closing, cancelledClass: slots.cancelledClass };
}

function render(solution) {
  return `Without a posted warning, the hall stays open until ${solution.closing}. The ${solution.cancelledClass} is the listed hole. Other classes still run.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "Without a posted warning, the hall stays open until " + slots.closing + ". The " + slots.cancelledClass + " is the listed hole. Other classes still run.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The board in ${slots.place} keeps the hall open until ${slots.closing} unless a storm warning is posted, which is the conditional "no posted warning, so the hall stays open".`,
    `No warning is posted, so the default stands and the hall stays open until ${solution.closing}; ${slots.doubter} points at storms in the world, but the board names a posted warning and nothing else.`,
    `"All evening classes run as planned except the ${solution.cancelledClass}" removes exactly one listed item, so that class is cancelled and the other classes still run.`,
    `${slots.reader} reads the pair that way, while ${slots.overreach} turns one named exception into a licence to cancel anything awkward.`
  ];
}

export const unit = 14;

export const cases = [
  {
    template: 'Unless and except',
    type: slugify('Unless and except'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
