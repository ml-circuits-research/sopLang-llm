/**
 * Section 71 of the adult-reasoning course: source, claim, and evidence.
 *
 * Every variant prints three claims about one well: a neighbour's second-hand
 * rumour that it is dry, an official town-hall notice that closes it for
 * repairs over a day range, and a dated photo of red tape on the pump. A
 * passer-by then turns the rumour into common knowledge ("Everybody knows it's
 * dry"). The verdict ranks the sources: the notice states both the closure and
 * its cause, the photo is merely compatible with it, the rumour is hearsay
 * whose "dry" never appears in the notice, and an anonymous "everybody" is not
 * a source. The cases change the town, the speaker, the dates, and the photo
 * day, so the family derives each clause from the parsed claims.
 */

import { slugify } from '../../naming.mjs';

const SCENE_PATTERN = /Three claims about a well in ([^:]+):/;
const NEIGHBOUR_PATTERN = /C1 \(neighbour\): “([^”]+)”/;
const NOTICE_PATTERN =
  /C2 \(town-hall notice\): “Closed for repairs ([0-9]+)–([0-9]+) September\.”/;
const PHOTO_PATTERN = /C3 \(photo ([0-9]+) Sept\. on the notice\): red tape on the pump\./;
const SPEAKER_PATTERN = /([A-Z][a-z]+): (“Everybody knows it’s dry\.”)/;

function parse(statement) {
  const scene = SCENE_PATTERN.exec(statement);
  const neighbour = NEIGHBOUR_PATTERN.exec(statement);
  const notice = NOTICE_PATTERN.exec(statement);
  const photo = PHOTO_PATTERN.exec(statement);
  const speaker = SPEAKER_PATTERN.exec(statement);
  if (
    scene === null ||
    neighbour === null ||
    notice === null ||
    photo === null ||
    speaker === null
  ) {
    throw new Error('the statement does not give the three claims and the passer-by');
  }
  return {
    town: scene[1].trim(),
    neighbourClaim: neighbour[1],
    notice: { from: Number(notice[1]), to: Number(notice[2]) },
    photoDay: Number(photo[1]),
    speaker: speaker[1],
    speakerClaim: speaker[2]
  };
}

function solve(slots) {
  const hearsay = /I heard from someone/i.test(slots.neighbourClaim);
  if (!hearsay) {
    throw new Error('the neighbour claim must be second-hand rather than first-hand');
  }
  const photoInWindow = slots.photoDay >= slots.notice.from && slots.photoDay <= slots.notice.to;
  if (!photoInWindow) {
    throw new Error('the photo must fall inside the announced closure to be compatible with it');
  }
  const noticeMentionsDry = /dry/i.test(`Closed for repairs ${slots.notice.from}–${slots.notice.to} September`);
  const authorityIsSource = /^Everybody\b/.test(slots.speakerClaim);
  return {
    primaryClause: 'C2 states the closure and the cause.',
    compatibleClause: photoInWindow ? 'C3 is visually compatible.' : 'C3 is visually incompatible.',
    hearsayClause:
      hearsay && !noticeMentionsDry
        ? 'C1 is hearsay; “dry” is not in C2.'
        : 'C1 is a first-hand source.',
    authorityClause: authorityIsSource ? '“Everybody” is a source.' : '“Everybody” is not a source.'
  };
}

function render(solution) {
  return `${solution.primaryClause} ${solution.compatibleClause} ${solution.hearsayClause} ${solution.authorityClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.town === "string" && slots.town.length > 0, "the case must name the town of the well");',
  'probe(typeof slots.neighbourClaim === "string" && slots.neighbourClaim.length > 0, "the case must carry the neighbour claim");',
  'probe(typeof slots.speaker === "string" && slots.speaker.length > 0, "the case must name the person who repeats the rumour");',
  'probe(slots.notice.from > 0 && slots.notice.to >= slots.notice.from, "the notice must announce a well-formed closure range");',
  'probe(slots.photoDay > 0, "the photo must carry a day of September");',
  'const hearsay = /I heard from someone/i.test(slots.neighbourClaim);',
  'probe(hearsay === true, "the neighbour claim must be second-hand rather than first-hand");',
  'const photoInWindow = slots.photoDay >= slots.notice.from && slots.photoDay <= slots.notice.to;',
  'probe(photoInWindow === true, "the photo must fall inside the announced closure to be compatible with it");',
  'const noticeMentionsDry = /dry/i.test("Closed for repairs " + slots.notice.from + "–" + slots.notice.to + " September");',
  'const authorityIsSource = /^Everybody/.test(slots.speakerClaim);',
  'const primaryClause = "C2 states the closure and the cause.";',
  'const compatibleClause = photoInWindow ? "C3 is visually compatible." : "C3 is visually incompatible.";',
  'const hearsayClause = hearsay && !noticeMentionsDry ? "C1 is hearsay; “dry” is not in C2." : "C1 is a first-hand source.";',
  'const authorityClause = authorityIsSource ? "“Everybody” is a source." : "“Everybody” is not a source.";',
  'return primaryClause + " " + compatibleClause + " " + hearsayClause + " " + authorityClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The well is in ${slots.town}, and C2 is the town-hall notice, an official document that both closes the well and names the cause, repairs for ${slots.notice.from}–${slots.notice.to} September.`,
    `C3 is a photo taken on ${slots.photoDay} September, inside the announced closure, showing red tape on the pump, so it fits the notice without adding a second cause.`,
    `C1 is a neighbour's claim passed on from someone else, so it is hearsay, and the word dry never appears in the notice: the closure is about repairs, not about the water.`,
    `${slots.speaker} upgrades that rumour to common knowledge with "Everybody knows it is dry", but an anonymous everybody is not a source that can close a well.`
  ];
}

export const unit = 71;

export const cases = [
  {
    template: 'Source, claim, and evidence',
    type: slugify('Source, claim, and evidence'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
