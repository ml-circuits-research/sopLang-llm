/**
 * Section 75 of the logical-reasoning book: fame, crowd, and borrowed voice.
 *
 * Every case records a stall in a named place, a famous singer who says the
 * pies are the best in the county, a long queue standing in the rain, and three
 * commentators: one who treats fame plus queue as a proof of quality, one who
 * says the singer is not a listed pie expert and the queue measures demand or
 * shelter rather than flavour, and one who claims borrowed fame is the adult
 * form of evidence. The case data changes the place, the two observed facts,
 * and the three commentators; the reasoning is fixed: fame and a queue show
 * that a famous person spoke and that people are standing there, not that the
 * pies are good.
 *
 * The family separates what the two observations show from what the quality of
 * the pie would need, and renders the printed answer.
 */

import { slugify } from '../../naming.mjs';

const STALL_PATTERN =
  /^Stall in ([A-Z][a-z]+(?: [A-Z][a-z]+)*)\. A ([a-z]+) singer says the pies are the best in the county\. A ([a-z]+) queue stands in the rain\. ([A-Z][a-z]+) treats fame plus queue as a proof of quality\. ([A-Z][a-z]+) says the singer is (not )?a listed pie expert and a queue measures ([^,]+), not ([^.]+)\. ([A-Z][a-z]+) says borrowed fame is the adult form of evidence\./;

function parse(statement) {
  const stall = STALL_PATTERN.exec(statement);
  if (stall === null) {
    throw new Error('the statement does not record the singer, the queue, and the three commentators');
  }
  const quality = stall[8].trim();
  const measured = stall[7].trim();
  return {
    place: stall[1],
    fame: stall[2],
    queue: stall[3],
    believer: stall[4],
    critic: stall[5],
    expertDenied: stall[6] === 'not ',
    measured,
    quality,
    sloganeer: stall[9]
  };
}

/**
 * The evidence proves the quality of the pie only when the voice is a listed
 * expert on pies and the queue measures the flavour itself. Here the singer is
 * not a listed pie expert, and the queue measures the stated list of other
 * things, so the two observations show only that a famous person spoke and that
 * people are standing there.
 */
function solve(slots) {
  const authorityIsListedExpert = slots.expertDenied === false;
  const queueMeasuresQuality = slots.measured.split(' or ').includes(slots.quality);
  return {
    place: slots.place,
    fame: slots.fame,
    famousPersonSpoke: slots.fame.length > 0,
    queueStands: slots.queue.length > 0,
    authorityIsListedExpert,
    queueMeasuresQuality,
    provesQuality: authorityIsListedExpert && queueMeasuresQuality
  };
}

function render(solution) {
  const spoke = `That a ${solution.fame} person spoke`;
  const standing = solution.queueStands ? 'and that people are standing there.' : 'and that nobody was seen.';
  const quality = solution.provesQuality ? 'The pies are proven.' : 'Quality of pie is a different question.';
  return `${spoke}, ${standing} ${quality}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place where the stall stands");',
  'probe(typeof slots.fame === "string" && slots.fame.length > 0, "the case must state what sort of singer spoke");',
  'probe(typeof slots.queue === "string" && slots.queue.length > 0, "the case must state that a queue stands there");',
  'probe(slots.expertDenied === true, "the case must record that the singer is not a listed pie expert");',
  'const queueMeasuresQuality = slots.measured.split(" or ").includes(slots.quality);',
  'probe(queueMeasuresQuality === false, "a queue that measures demand or shelter does not measure the flavour of the pie");',
  'const provesQuality = (slots.expertDenied === false) && queueMeasuresQuality;',
  'probe(provesQuality === false, "fame and a queue are not a tasting panel");',
  'return "That a " + slots.fame + " person spoke, and that people are standing there. Quality of pie is a different question.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The stall in ${slots.place} was visited by a ${slots.fame} singer and a ${slots.queue} queue stood in the rain.`,
    `Those two facts show only that a famous person spoke and that people are standing there.`,
    `${slots.critic} keeps the observations and refuses the upgrade: the singer is not a listed pie expert, and the queue measures ${slots.measured}, not ${slots.quality}.`,
    `Borrowed fame is not competence, so the ${slots.queue} queue leaves the quality of the pie an open question.`
  ];
}

export const unit = 75;

export const cases = [
  {
    template: 'Fame, crowd, and borrowed voice',
    type: slugify('Fame, crowd, and borrowed voice'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
