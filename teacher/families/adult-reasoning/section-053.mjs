/**
 * Section 53 of the adult-reasoning course: light, shadow, and reflection.
 *
 * Every variant posts the same sheet about straight light and shadows: an
 * object casts a shadow only while it is lit, and an opaque screen between
 * source and object leaves the object in shade. The episode then puts a book
 * between lamp and mug, the mug's shadow on the wall vanishes, and the actor
 * thinks the shadow moved into the book. The verdict reads the sheet literally:
 * the mug is no longer lit, the book casts its own shadow over the mug, and
 * removing the book restores the straight-line shadow. The cases change the
 * actor, so the family derives each clause from the parsed flags.
 */

import { slugify } from '../../naming.mjs';

const SHEET_STRAIGHT_PATTERN = /Light travels straight in uniform air\./;
const SHEET_LIT_PATTERN = /An object’s shadow requires the object to be lit\./;
const SHEET_SCREEN_PATTERN =
  /An opaque screen between source and object leaves the object in shade: its shadow on the wall disappears\./;
const EPISODE_PATTERN =
  /([A-Z][a-z]+) puts a book between lamp and mug; the mug’s shadow on the wall vanishes\. Thinks “the shadow moved into the book”\./;

function parse(statement) {
  const episode = EPISODE_PATTERN.exec(statement);
  if (episode === null) {
    throw new Error('the statement does not describe the book, the mug, and the vanished shadow');
  }
  if (!SHEET_STRAIGHT_PATTERN.test(statement) || !SHEET_LIT_PATTERN.test(statement)) {
    throw new Error('the statement does not state that light is straight and that a shadow requires light');
  }
  return {
    actor: episode[1],
    lightTravelsStraight: true,
    shadowRequiresLight: true,
    screenOpaque: SHEET_SCREEN_PATTERN.test(statement),
    screenBetween: true,
    shadowVanishes: true,
    believesMovedIntoBook: true
  };
}

function solve(slots) {
  const mugLit = !(slots.screenOpaque && slots.screenBetween);
  const litClause = slots.shadowRequiresLight && !mugLit
    ? 'The mug is no longer lit.'
    : 'The mug is still in the light of the lamp.';
  const screenClause = slots.screenOpaque
    ? 'The book has its own shadow; the mug sits in it.'
    : 'The book lets the light through, so the mug keeps its own shadow.';
  const returnClause = slots.lightTravelsStraight
    ? 'Without the book, the mug’s shadow returns in a straight line.'
    : 'Without the book, the mug’s shadow returns.';
  return { mugLit, litClause, screenClause, returnClause };
}

function render(solution) {
  return `${solution.litClause} ${solution.screenClause} ${solution.returnClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const mugLit = !(slots.screenOpaque && slots.screenBetween);',
  'const litClause = slots.shadowRequiresLight && !mugLit',
  '  ? "The mug is no longer lit."',
  '  : "The mug is still in the light of the lamp.";',
  'const screenClause = slots.screenOpaque',
  '  ? "The book has its own shadow; the mug sits in it."',
  '  : "The book lets the light through, so the mug keeps its own shadow.";',
  'const returnClause = slots.lightTravelsStraight',
  '  ? "Without the book, the mug\u2019s shadow returns in a straight line."',
  '  : "Without the book, the mug\u2019s shadow returns.";',
  'return litClause + " " + screenClause + " " + returnClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The book is an opaque screen placed between the lamp and the mug, so the sheet leaves the mug in shade; ${slots.actor} reads the vanished patch as a shadow that moved into the book.`,
    `A shadow needs a lit object, and the mug is no longer lit, so the patch it threw on the wall disappears while the book throws its own shadow over the mug.`,
    `Because light travels straight in uniform air, taking the book away puts the lamp, the mug, and the wall back on one line and the mug’s shadow returns.`
  ];
}

export const unit = 53;

export const cases = [
  {
    template: 'Light, shadow, and reflection',
    type: slugify('Light, shadow, and reflection'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
