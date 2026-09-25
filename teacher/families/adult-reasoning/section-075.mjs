/**
 * Section 75 of the adult-reasoning course: internal inconsistencies in a story.
 *
 * Every variant presents one person’s short account: a denial of having been
 * in a named place the previous day, a stay-at-home claim, a meeting at a
 * fixed hour in front of the post office in that very same place, a note that
 * the house has no post office in front, and a claim of having spoken to
 * nobody. The verdict names the two pairs of sentences that cannot hold
 * together: the denial of the place against the meeting inside it, and the
 * “nobody” against the timed meeting. The variants change the speaker, the
 * place, and the length of the meeting, so the family derives each clause from
 * the parsed story.
 */

import { slugify } from '../../naming.mjs';

const STORY_PATTERN =
  /([A-Z][a-z]+): “I was not in ([^,]+) yesterday, I stayed home all the sun\. At (\d{1,2}:\d{2}) I met ([A-Z][a-z]+) in front of the post office in ([^,]+), (\d+) minutes\. My house has no post office in front\. I spoke to nobody yesterday\.”/;

function parse(statement) {
  const story = STORY_PATTERN.exec(statement);
  if (story === null) {
    throw new Error('the statement does not tell the denial, the meeting, and the nobody claim as one account');
  }
  return {
    speaker: story[1],
    absentPlace: story[2],
    time: story[3],
    metPerson: story[4],
    meetingPlace: story[5],
    minutes: Number(story[6]),
    houseHasNoPostOffice: /My house has no post office in front\./.test(statement),
    claimsNobody: /I spoke to nobody yesterday\./.test(statement)
  };
}

function solve(slots) {
  if (slots.absentPlace !== slots.meetingPlace) {
    throw new Error('the meeting does not happen in the place the account denies, so the first pair does not conflict');
  }
  if (!Number.isInteger(slots.minutes) || slots.minutes <= 0) {
    throw new Error('the meeting must last a positive number of minutes to contradict the nobody claim');
  }
  if (!slots.claimsNobody) {
    throw new Error('the account does not claim to have spoken to nobody');
  }
  const placeClause = 'Absence from the place vs the meeting at the post office in the place.';
  const nobodyClause = `“Nobody” vs the ${slots.minutes}-minute meeting.`;
  return { placeClause, nobodyClause };
}

function render(solution) {
  return `${solution.placeClause} ${solution.nobodyClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const placeClause = "Absence from the place vs the meeting at the post office in the place.";',
  'const nobodyClause = "“Nobody” vs the " + slots.minutes + "-minute meeting.";',
  'return placeClause + " " + nobodyClause;'
].join('\n');

function explain(slots) {
  return [
    `${slots.speaker} first denies being in ${slots.absentPlace} at all, saying the whole day was spent at home.`,
    `The same account then places a meeting in front of the post office in ${slots.meetingPlace} at ${slots.time}, so the denial and the meeting cannot both be true.`,
    `Because that meeting lasted ${slots.minutes} minutes with ${slots.metPerson}, the closing claim of having spoken to nobody fails as well.`,
    'The detail that the house has no post office in front removes one excuse for the first pair but leaves the contradiction standing.'
  ];
}

export const unit = 75;

export const cases = [
  {
    template: 'Internal inconsistencies in a story',
    type: slugify('Internal inconsistencies in a story'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
