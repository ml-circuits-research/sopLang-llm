/**
 * Section 83 of the logical-reasoning book: the first number pulls.
 *
 * Every case posts a host who jokes a hall holds a round number, two clerks who
 * later count the chairs and disagree by one, and a crowd whose quick guesses
 * settle near a round value between the joke and the counts. Three speakers
 * split on whether a joke can anchor; the verdict is yes, because the first
 * number occupies a slot whether or not it was sincere, and the live
 * comparison is the two counts rather than the theatrical first number.
 *
 * The place and the three names change, and the printed answer carries the
 * quoted number and the two counts, so the family reads all three from the
 * statement.
 */

import { slugify } from '../../naming.mjs';

const CASE_PATTERN =
  /A host in ([^.]+) jokes that the hall holds (\d+)\. Later, two clerks independently count (\d+) chairs and (\d+)\. People asked for a quick guess after the joke still hover near ([a-z]+)\. ([A-Z][a-z]+) says the joke cannot pull because it was a joke\. ([A-Z][a-z]+) names anchoring: the first number occupies a slot\. ([A-Z][a-z]+) says (\d+) is as live as (\d+)\./;

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
    throw new Error('the statement does not post the joking number and the two chair counts');
  }
  return {
    place: matched[1],
    anchor: Number(matched[2]),
    firstCount: Number(matched[3]),
    secondCount: Number(matched[4]),
    guessWord: matched[5],
    guess: numberWord(matched[5]),
    jokeVoice: matched[6],
    anchoringVoice: matched[7],
    liveVoice: matched[8],
    liveAnchor: Number(matched[9]),
    liveCount: Number(matched[10])
  };
}

function solve(slots) {
  const speakers = [slots.jokeVoice, slots.anchoringVoice, slots.liveVoice];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the case must give the three readings of the first number to three different people');
  }
  if (slots.liveAnchor !== slots.anchor || slots.liveCount !== slots.firstCount) {
    throw new Error('the last speaker must quote the joking number and the first count the case already stated');
  }
  if (slots.anchor === slots.firstCount || slots.anchor === slots.secondCount) {
    throw new Error('the joking number must be a theatrical value, not one of the counted values');
  }
  if (slots.firstCount === slots.secondCount) {
    throw new Error('the two independent counts must differ, so the live comparison is between them');
  }
  if (slots.guess <= slots.firstCount || slots.guess >= slots.anchor) {
    throw new Error('the quick guesses must settle between the counted value and the joking number');
  }
  return {
    anchor: slots.anchor,
    firstCount: slots.firstCount,
    secondCount: slots.secondCount,
    pulls: true
  };
}

function render(solution) {
  return `${solution.pulls ? 'Yes' : 'No'}. Anchors do not need to be sincere. Compare ${solution.firstCount} with ${solution.secondCount}, not with a theatrical ${solution.anchor}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "Yes. Anchors do not need to be sincere. Compare " + slots.firstCount + " with " + slots.secondCount + ", not with a theatrical " + slots.anchor + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The host's ${slots.anchor} is the first number on stage in ${slots.place}, and it was spoken as a joke.`,
    `Anchoring does not ask whether the first number was sincere: the slot is occupied either way, which is why the quick guesses settle near ${slots.guessWord} instead of near the count.`,
    `The live comparison is ${solution.firstCount} with ${solution.secondCount}, the two independent counts of the chairs, and neither of them is the theatrical ${solution.anchor}.`,
    `${slots.jokeVoice}'s "it was only a joke" is answered by ${slots.anchoringVoice}: the repair is a reset of the comparison, not an eye-roll.`
  ];
}

export const unit = 83;

export const cases = [
  {
    template: 'The first number pulls',
    type: slugify('The first number pulls'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
