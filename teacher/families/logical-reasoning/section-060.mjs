/**
 * Section 60 of the logical-reasoning book: a new fact reorders the list.
 *
 * Every case recalls an earlier lamp problem that ranked “dead bulb first,”
 * then reports a new listed fact: the replacement bulb is also dark in that
 * socket, while both bulbs work in the neighbour socket. Three reactions
 * follow: keep the old rank, move the rank toward the socket, or call the
 * change of mind a shame. The place and the three names change with the case;
 * the move does not: the list reorders, because the new fact fights the
 * bulb-only story and supports the socket, and updating is the method working.
 */

import { slugify } from '../../naming.mjs';

const LAMP_PATTERN =
  /^Earlier in ([A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)*), a dark lamp was ranked “([^”]+)\.” A new listed fact arrives: the replacement bulb is also dark in that socket, while both bulbs work in the neighbour socket\. ([A-Z][a-z]+) keeps “([^”]+)\.” ([A-Z][a-z]+) moves the rank toward the socket\. ([A-Z][a-z]+) says changing your mind proves the first ranking was a shame\.\n\nQuestion\. What should the list do\?$/;

function parse(statement) {
  const lamp = LAMP_PATTERN.exec(statement);
  if (lamp === null) {
    throw new Error('the statement does not record the earlier rank, the new fact, and the three reactions');
  }
  return {
    place: lamp[1],
    earlierRank: lamp[2],
    keeper: lamp[3],
    keptRank: lamp[4],
    mover: lamp[5],
    shamer: lamp[6]
  };
}

function solve(slots) {
  if (slots.keptRank === slots.earlierRank) {
    throw new Error(`keeping "${slots.keptRank}" restates the earlier rank instead of defending its winner`);
  }
  const people = [slots.keeper, slots.mover, slots.shamer];
  if (new Set(people).size !== people.length) {
    throw new Error('the three reactions must come from three different people');
  }
  return {
    place: slots.place,
    earlierRank: slots.earlierRank,
    keptRank: slots.keptRank,
    keeper: people[0],
    mover: people[1],
    shamer: people[2]
  };
}

function render() {
  return 'Reorder. The new fact fights “this bulb only” and supports “this socket.” Updating is the method working.';
}

const COMPUTE = [
  'const slots = $slots;',
  'const people = [slots.keeper, slots.mover, slots.shamer];',
  'return "Reorder. The new fact fights \\u201Cthis bulb only\\u201D and supports \\u201Cthis socket.\\u201D Updating is the method working.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The earlier ranking in ${solution.place} — “${solution.earlierRank}” — rested on signs that are now joined by a second dark trial in the very same socket.`,
    `That new fact fights the “${solution.keptRank}” story, which predicted this socket would light any working bulb such as the replacement, so ${solution.keeper} is defending a story its own evidence has left behind.`,
    `${solution.mover} moves the rank toward the socket, which now fits both dark trials while both bulbs still work in the neighbour socket.`,
    `${solution.shamer} calls the change of mind a shame, but changing the order when the facts change is not arbitrary; it is the method working, and the new fact is recorded rather than yesterday defended.`
  ];
}

export const unit = 60;

export const cases = [
  {
    template: 'A new fact reorders the list',
    type: slugify('A new fact reorders the list'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
