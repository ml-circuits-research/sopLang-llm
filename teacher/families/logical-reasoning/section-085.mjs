/**
 * Section 85 of the logical-reasoning book: winners in the window.
 *
 * Every case shows a window of a few shops that lasted a number of years, a
 * footnote that lists the larger number of shops that closed over the same
 * stretch, and three speakers: one who reads the window as proof that shops
 * last, one who names survivorship, and one who says footnotes are jealous of
 * windows. The place changes, as do the two displayed counts and the duration;
 * the verdict is fixed: the leavers are missing from the window, visible
 * duration is selected for survival, and a fair inductive climb would include
 * the closed shops the footnote lists.
 *
 * The printed answer names the footnote count as a word, so the family reads
 * both counts and the duration from the statement and checks that the closed
 * mass is the larger one.
 */

import { slugify } from '../../naming.mjs';

const CASE_PATTERN =
  /A window in ([^.]+) shows ([a-z]+) shops that lasted ([a-z]+) years\. A footnote lists ([a-z]+) shops that closed in the same stretch\. ([A-Z][a-z]+) says shops last, because the window says so\. ([A-Z][a-z]+) names survivorship: the closed shops cannot dress a window\. ([A-Z][a-z]+) says footnotes are jealous of windows\./;

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
    throw new Error('the statement does not show a window of lasting shops beside a footnote of closings');
  }
  return {
    place: matched[1],
    shownShops: numberWord(matched[2]),
    lastedYears: numberWord(matched[3]),
    closedWord: matched[4],
    closedShops: numberWord(matched[4]),
    windowVoice: matched[5],
    survivorshipVoice: matched[6],
    jealousyVoice: matched[7]
  };
}

function solve(slots) {
  const speakers = [slots.windowVoice, slots.survivorshipVoice, slots.jealousyVoice];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the case must give the three readings of the window to three different people');
  }
  if (slots.shownShops <= 0 || slots.lastedYears <= 0) {
    throw new Error('the window must show at least one shop that lasted at least one year');
  }
  if (slots.closedShops <= slots.shownShops) {
    throw new Error('the footnote must list more closed shops than the window shows, so the display is a selection');
  }
  return { missing: 'The leavers', closedWord: slots.closedWord, closedShops: slots.closedShops };
}

function render(solution) {
  return `The leavers. Visible duration is selected for survival. A fair inductive climb would include the ${solution.closedWord}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "The leavers. Visible duration is selected for survival. A fair inductive climb would include the " + slots.closedWord + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The window in ${slots.place} is available to be seen because its ${slots.shownShops} shops survived ${slots.lastedYears} years, while the ${slots.closedShops} shops that closed are out of sight in the footnote.`,
    `The missing mass is what the induction would need, so ${solution.missing.toLowerCase()} are exactly the cases the window leaves out.`,
    `${slots.windowVoice} lets the display design finish the induction, but ${slots.survivorshipVoice} names the selection: only survivors can dress a window.`,
    `Putting the ${solution.closedWord} back into the sentence is the repair, and ${slots.jealousyVoice}'s remark about footnotes is not a statistical claim.`
  ];
}

export const unit = 85;

export const cases = [
  {
    template: 'Winners in the window',
    type: slugify('Winners in the window'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
