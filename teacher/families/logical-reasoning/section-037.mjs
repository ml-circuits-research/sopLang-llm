/**
 * Section 37 of the logical-reasoning book: explanation versus proof.
 *
 * Every case prints one classroom analogy (DNA as a recipe, not a blueprint),
 * one speaker who reads last-minute improvisation into it, one speaker who
 * reads the picture as a teaching ladder, and one speaker who rejects every
 * teaching picture. The cases change the place and the three names; the
 * reading of the picture is fixed, and the job the picture was offered to do
 * follows from that reading: a ladder for picturing a sequence of steps
 * explains something to beginners, so the picture is an explanation for
 * beginners and never a proof that improvisation transfers to genomes.
 */

import { slugify } from '../../naming.mjs';

const TEACHING_PATTERN =
  /Teacher in ([^:]+): \u201cThink of DNA as a recipe, not a blueprint, so you can picture a sequence of steps\.\u201d ([A-Z][a-z]+) concludes that genomes can be improvised at the last minute the way a cook adds lemon\. ([A-Z][a-z]+) says the recipe picture is a (teaching ladder), not a proof about improvisation\. ([A-Z][a-z]+) says teaching pictures are lies and should never be used\./;

/**
 * The job each reading of the picture licenses. Only the ladder reading is
 * stated by this section, and it gives the picture the beginner-facing job:
 * picturing a sequence of steps is teaching work, and the improvisation the
 * first speaker concludes was never a mapped part of the picture.
 */
const JOB_BY_READING = Object.freeze({
  'teaching ladder': Object.freeze({
    intro: 'Explanation for beginners',
    limit: 'not a proof that last-minute improvisation transfers'
  })
});

function parse(statement) {
  const teaching = TEACHING_PATTERN.exec(statement);
  if (teaching === null) {
    throw new Error('the statement does not record the DNA recipe analogy and its three speakers');
  }
  return {
    place: teaching[1].trim(),
    transferrer: teaching[2],
    ladderReader: teaching[3],
    reading: teaching[4],
    denier: teaching[5]
  };
}

function solve(slots) {
  const job = JOB_BY_READING[slots.reading];
  if (job === undefined) {
    throw new Error(`unknown reading of the picture: "${slots.reading}"`);
  }
  return { intro: job.intro, limit: job.limit };
}

function render(solution) {
  return `${solution.intro}, ${solution.limit}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the teacher");',
  'probe(typeof slots.transferrer === "string" && slots.transferrer.length > 0, "the case must name the speaker who reads improvisation into the picture");',
  'probe(typeof slots.ladderReader === "string" && slots.ladderReader.length > 0, "the case must name the speaker who reads the picture as a teaching ladder");',
  'probe(typeof slots.denier === "string" && slots.denier.length > 0, "the case must name the speaker who rejects teaching pictures");',
  'probe(new Set([slots.transferrer, slots.ladderReader, slots.denier]).size === 3, "the three speakers must be three different people");',
  'const JOB_BY_READING = { "teaching ladder": { "intro": "Explanation for beginners", "limit": "not a proof that last-minute improvisation transfers" } };',
  'const job = JOB_BY_READING[slots.reading];',
  'probe(job !== undefined, "the picture must be read as a teaching ladder, so the case states the ladder reading");',
  'return job.intro + ", " + job.limit + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The teacher in ${slots.place} offers the recipe picture so that beginners can picture a sequence of steps, which is teaching work and not evidence about genomes.`,
    `${slots.transferrer} concludes that genomes can be improvised at the last minute, but ${slots.ladderReader} reads the picture as a ${slots.reading} and not as a proof about improvisation.`,
    `${slots.denier} would ban every teaching picture, yet an abused ladder does not make its first teaching use dishonest.`,
    `The work the analogy was offered to do is therefore ${solution.intro}, ${solution.limit}: improvisation was not a mapped part of the picture.`
  ];
}

export const unit = 37;

export const cases = [
  {
    template: 'Explanation versus proof',
    type: slugify('Explanation versus proof'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
