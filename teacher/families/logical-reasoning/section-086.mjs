/**
 * Section 86 of the logical-reasoning book: two coats for one quantity.
 *
 * Every case prints one ward card as two cells of the same listed group — the
 * patients who lived and the patients who died — and two posters that lead with
 * one cell each, the survivor frame in words and the death frame in words.
 * Three speakers split on whether the posters report different worlds; the
 * verdict is no, because the frames change the feeling and not the count, and
 * the repair is to write both before choosing a policy mood.
 *
 * The place changes, and the cells, the denominators, and the poster phrases
 * are read from the statement: the family checks that the two posters count the
 * same group, that the cells exhaust it, and that each poster phrase names the
 * count it leads with.
 */

import { slugify } from '../../naming.mjs';

const CASE_PATTERN =
  /Ward card in ([^:]+): (\d+) of (\d+) listed patients in a printed comparison lived; (\d+) of (\d+) died\. Poster A leads with “([a-z]+) lived\.” Poster B leads with “([a-z]+) died\.” ([A-Z][a-z]+) says the posters report different worlds\. ([A-Z][a-z]+) says they are one quantity in two frames\. ([A-Z][a-z]+) says the darker frame is always more true\./;

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
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90
});

function numberWord(word) {
  const value = NUMBER_WORDS[word];
  if (value === undefined) {
    throw new Error(`"${word}" is not a number word this family reads`);
  }
  return value;
}

function parse(statement) {
  const matched = CASE_PATTERN.exec(statement);
  if (matched === null) {
    throw new Error('the statement does not print one ward card behind two poster phrases');
  }
  return {
    place: matched[1],
    livedCount: Number(matched[2]),
    livedDenominator: Number(matched[3]),
    diedCount: Number(matched[4]),
    diedDenominator: Number(matched[5]),
    livedWord: matched[6],
    diedWord: matched[7],
    differentWorldsVoice: matched[8],
    oneQuantityVoice: matched[9],
    darkerFrameVoice: matched[10]
  };
}

function solve(slots) {
  const speakers = [slots.differentWorldsVoice, slots.oneQuantityVoice, slots.darkerFrameVoice];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the case must give the three readings of the posters to three different people');
  }
  if (slots.livedDenominator !== slots.diedDenominator) {
    throw new Error('both posters must count the same listed group');
  }
  if (slots.livedCount + slots.diedCount !== slots.livedDenominator) {
    throw new Error('the lived and died cells must exhaust the listed group they split');
  }
  if (numberWord(slots.livedWord) !== slots.livedCount || numberWord(slots.diedWord) !== slots.diedCount) {
    throw new Error('each poster phrase must name the count it leads with');
  }
  return { framesChangeCount: false, livedCount: slots.livedCount, diedCount: slots.diedCount };
}

function render(solution) {
  return `${solution.framesChangeCount ? 'Yes' : 'No'}. They change the feeling. Write both before you choose a policy mood.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the ward card");',
  'probe(Number.isInteger(slots.livedCount) && slots.livedCount > 0 && Number.isInteger(slots.diedCount) && slots.diedCount > 0, "both cells of the ward card must be positive counts");',
  'probe(slots.livedDenominator === slots.diedDenominator, "both posters must count the same listed group");',
  'probe(slots.livedCount + slots.diedCount === slots.livedDenominator, "the lived and died cells must exhaust the listed group");',
  'probe(typeof slots.livedWord === "string" && slots.livedWord.length > 0 && typeof slots.diedWord === "string" && slots.diedWord.length > 0, "both poster phrases must name a count in words");',
  'probe(slots.differentWorldsVoice !== slots.oneQuantityVoice && slots.differentWorldsVoice !== slots.darkerFrameVoice && slots.oneQuantityVoice !== slots.darkerFrameVoice, "the three readings must belong to three different speakers");',
  'return "No. They change the feeling. Write both before you choose a policy mood.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The ward card in ${slots.place} holds one group of ${slots.livedDenominator} listed patients split into ${solution.livedCount} who lived and ${solution.diedCount} who died.`,
    `Poster A leads with “${slots.livedWord} lived” and poster B with “${slots.diedWord} died”, which are the same cells in two frames rather than two worlds.`,
    `So the frames change the feeling and not the count, and the survivor frame is not more true than the death frame: ${slots.oneQuantityVoice} has the quantity right.`,
    `Writing both before choosing a policy mood is the repair, because ${slots.darkerFrameVoice}'s darker-is-truer prize is the wrong prize for a coat.`
  ];
}

export const unit = 86;

export const cases = [
  {
    template: 'Two coats for one quantity',
    type: slugify('Two coats for one quantity'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
