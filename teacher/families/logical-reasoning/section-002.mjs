/**
 * Section 2 of the logical-reasoning book: some, all, and none.
 *
 * Every case posts one closed stall notice — "some" boxed pies contain nuts,
 * all boxed soups are vegetarian, no boxed juice contains milk — fixes a count
 * of boxes, and lets three speakers read the notice differently. The case data
 * changes the place, the count, and the three names; the reasoning is fixed:
 * the universal affirmative plus a member of its class forces the property,
 * "some" is silent about the box in hand, and a rumour about the recipe
 * contradicts "none". The family reads the three claim sentences and renders
 * the printed verdict with the soup speaker first.
 */

import { slugify } from '../../naming.mjs';

const NOTICE_PATTERN =
  /A stall notice in ([A-Z][a-z]+(?: [A-Z][a-z]+)*) says: “SOME boxed pies contain nuts\. ALL boxed soups are vegetarian\. NONE of the boxed juices contain milk\.” There are (\d+) boxes of each kind\./;
const CLAIMS_PATTERN =
  /([A-Z][a-z]+) takes one pie and says this pie must contain nuts\. ([A-Z][a-z]+) takes one soup and says this soup is vegetarian\. ([A-Z][a-z]+) says a juice might still contain milk if the cook changed the recipe this morning\./;

function parse(statement) {
  const notice = NOTICE_PATTERN.exec(statement);
  const claims = CLAIMS_PATTERN.exec(statement);
  if (notice === null || claims === null) {
    throw new Error('the statement does not carry the stall notice and the three claims');
  }
  return {
    place: notice[1],
    boxes: Number(notice[2]),
    pieSpeaker: claims[1],
    soupSpeaker: claims[2],
    juiceSpeaker: claims[3]
  };
}

/**
 * "Some" is at least one box, so the pie in hand is forced only when the count
 * leaves no other candidate. A notice that printed one box per kind would make
 * the pie claim forced, and this section is not that pattern.
 */
function solve(slots) {
  if (!Number.isInteger(slots.boxes) || slots.boxes < 2) {
    throw new Error(`a count of ${slots.boxes} boxes per kind cannot keep "some" from meaning "this one"`);
  }
  return {
    forced: slots.soupSpeaker,
    possible: slots.pieSpeaker,
    contradicting: slots.juiceSpeaker
  };
}

function render(solution) {
  return `${solution.forced} is forced. ${solution.possible} is possible but not forced (“some” is not “this one”). ${solution.contradicting} contradicts “none.”`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return slots.soupSpeaker + " is forced. " + slots.pieSpeaker + " is possible but not forced (\\u201csome\\u201d is not \\u201cthis one\\u201d). " + slots.juiceSpeaker + " contradicts \\u201cnone.\\u201d";'
].join('\n');

function explain(slots, solution) {
  return [
    `The notice of ${slots.place} is a closed page: "some" boxed pies contain nuts, every boxed soup is vegetarian, and no boxed juice contains milk.`,
    `${solution.forced} takes a soup, and the listed soup class falls under "all", so the notice forces the property for that box.`,
    `${solution.possible} takes a pie, and "some" speaks about the class without naming the box in hand, so that claim stays possible and unforced; the ${slots.boxes} boxes of each kind do not turn "some" into "all".`,
    `${solution.contradicting} keeps a juice open to milk, which the "none" clause rules out, and a rumour about this morning is not an amendment to the notice.`
  ];
}

export const unit = 2;

export const cases = [
  {
    template: 'Some, all, and none',
    type: slugify('Some, all, and none'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
