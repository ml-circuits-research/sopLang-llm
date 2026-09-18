/**
 * Section 51 of the logical-reasoning book: ranking rival stories.
 *
 * Every case describes one dark lamp whose listed signs are an on switch and a
 * lit neighbouring lamp on the same socket-strip, then records three offered
 * stories: a dead bulb, a failure of the whole grid, and a rare animal jamming
 * a hidden second switch with no such animal listed. The case data changes the
 * place, the socket-strip, the bulb, the owner of the grid, the unlisted
 * animal, and the three names; the reasoning is fixed: the story that fits the
 * listed signs starts first, the story that fights a listed fact is dropped,
 * and the unlisted engine is postponed rather than believed.
 */

import { slugify } from '../../naming.mjs';

const LAMP_PATTERN = /A ([a-z]+) in (.+?) is dark\./;
const LISTED_PATTERN =
  /Listed: the switch is on; the neighbouring ([a-z]+) on the same listed ([a-z-]+) is lit\./;
const FITTING_PATTERN = /([A-Z][a-z]+) offers “the ([a-z]+) is dead\.”/;
const RIVAL_PATTERN = /([A-Z][a-z]+) offers “the ([a-z]+)’s whole grid has failed\.”/;
const UNLISTED_PATTERN =
  /([A-Z][a-z]+) offers “a ([a-z]+ [a-z]+ jammed a hidden second [a-z-]+),” with no ([a-z]+) listed\./;

function parse(statement) {
  const lamp = LAMP_PATTERN.exec(statement);
  const listed = LISTED_PATTERN.exec(statement);
  const fitting = FITTING_PATTERN.exec(statement);
  const rival = RIVAL_PATTERN.exec(statement);
  const unlisted = UNLISTED_PATTERN.exec(statement);
  if (lamp === null || listed === null || fitting === null || rival === null || unlisted === null) {
    throw new Error('the statement does not record the dark lamp, its listed signs, and the three stories');
  }
  return {
    place: lamp[2],
    lampNoun: lamp[1],
    neighbourNoun: listed[1],
    strip: listed[2],
    fitting: fitting[1],
    part: fitting[2],
    rival: rival[1],
    gridOwner: rival[2],
    unlisted: unlisted[1],
    unlistedStory: unlisted[2],
    unlistedAnimal: unlisted[3]
  };
}

function solve(slots) {
  if (slots.fitting === slots.rival || slots.fitting === slots.unlisted || slots.rival === slots.unlisted) {
    throw new Error('the three stories must be offered by three different people');
  }
  if (slots.part === slots.unlistedAnimal) {
    throw new Error('the postponed engine must not be the part the first story replaces');
  }
  if (slots.lampNoun !== slots.neighbourNoun) {
    throw new Error('the lit neighbour must be the same kind of thing as the dark lamp');
  }
  return {
    place: slots.place,
    lampNoun: slots.lampNoun,
    fitting: slots.fitting,
    part: slots.part,
    rival: slots.rival,
    gridOwner: slots.gridOwner,
    unlisted: slots.unlisted,
    unlistedAnimal: slots.unlistedAnimal
  };
}

function render(solution) {
  return `${solution.fitting}’s. A dead ${solution.part} fits a dark ${solution.lampNoun} beside a working neighbour. A whole-grid failure fights the neighbour ${solution.lampNoun}. The ${solution.unlistedAnimal} adds an unlisted engine.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the dark lamp must name its place");',
  'probe(typeof slots.lampNoun === "string" && slots.lampNoun.length > 0, "the case must name the kind of thing that is dark");',
  'probe(slots.lampNoun === slots.neighbourNoun, "the lit neighbour must be the same kind of thing as the dark lamp");',
  'probe(typeof slots.strip === "string" && slots.strip.length > 0, "the lit neighbour must name the strip it shares");',
  'probe(typeof slots.fitting === "string" && slots.fitting.length > 0, "the first story must be attributed to a person");',
  'probe(typeof slots.part === "string" && slots.part.length > 0, "the first story must name the part it replaces");',
  'probe(typeof slots.unlistedAnimal === "string" && slots.unlistedAnimal.length > 0, "the postponed story must name its unlisted engine");',
  'probe(slots.fitting !== slots.rival && slots.fitting !== slots.unlisted && slots.rival !== slots.unlisted, "the three stories must be offered by three different people");',
  'probe(slots.part !== slots.unlistedAnimal, "the postponed engine must not be the part the first story replaces");',
  'return slots.fitting + "\\u2019s. A dead " + slots.part + " fits a dark " + slots.lampNoun + " beside a working neighbour. A whole-grid failure fights the neighbour " + slots.lampNoun + ". The " + slots.unlistedAnimal + " adds an unlisted engine.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The ${solution.lampNoun} in ${slots.place} is dark while the switch is on and the neighbouring ${slots.lampNoun} on the same listed ${slots.strip} is lit, so the dark ${solution.lampNoun} is the only broken thing on the page.`,
    `${solution.fitting} offers a dead ${solution.part}, which fits a dark lamp beside a working neighbour, so that story is the one that starts first.`,
    `${solution.rival} offers a failure of the ${solution.gridOwner}’s whole grid, but that fights the lit neighbour lamp, and a story that contradicts a listed sign is dropped.`,
    `${solution.unlisted} offers a hidden second switch jammed by a ${solution.unlistedAnimal} that no sign lists, so that engine is postponed, not chosen; the best story on this list is also not married to the truth.`
  ];
}

export const unit = 51;

export const cases = [
  {
    template: 'Ranking rival stories',
    type: slugify('Ranking rival stories'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
