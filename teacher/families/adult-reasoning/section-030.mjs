/**
 * Section 30 of the adult-reasoning course: first-aid procedures as written.
 *
 * Every variant posts the same club first-aid sheet for a nosebleed (lean
 * forward and not back, a 10 min pinch on the wings, no cotton wool, emergency
 * after 20 min still flowing, no aspirin) and one episode in which a second
 * person lays the bleeding person on their back, packs cotton, gives aspirin,
 * and waits only 5 min. The verdict lists the four breaches against the sheet
 * and then states the first correct steps. The variants change the club's town
 * and the two names; the sheet's times are parsed from the statement.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN =
  /First-aid sheet at a club in ([^(]+) \(course procedure, not personal advice\): “Nosebleed: lean forward, not back; (\d+) min pinch on the wings; no cotton wool; after (\d+) min still flowing — emergency; no aspirin\./;
const EPISODE_PATTERN =
  /([A-Z][a-z]+) has been bleeding from the nose for (\d+) min\. ([A-Z][a-z]+) lays ([A-Z][a-z]+) on their back, packs cotton, gives aspirin, waits (\d+) min\./;
const QUESTION_PATTERN = /What did ([A-Z][a-z]+) do against the sheet\?/;

function parse(statement) {
  const sheet = SHEET_PATTERN.exec(statement);
  const episode = EPISODE_PATTERN.exec(statement);
  const question = QUESTION_PATTERN.exec(statement);
  if (sheet === null || episode === null || question === null) {
    throw new Error('the statement does not describe the first-aid sheet and the nosebleed episode');
  }
  if (episode[1] !== episode[4]) {
    throw new Error('the episode does not lay the bleeding person down');
  }
  return {
    place: sheet[1].trim(),
    pinchMinutes: Number(sheet[2]),
    emergencyMinutes: Number(sheet[3]),
    patient: episode[1],
    bleedingMinutes: Number(episode[2]),
    helper: episode[3],
    questionHelper: question[1],
    postureReversed: true,
    cottonPacked: true,
    aspirinGiven: true,
    waitMinutes: Number(episode[5])
  };
}

function solve(slots) {
  const breaches = [];
  if (slots.postureReversed) {
    breaches.push('Posture reversed');
  }
  if (slots.cottonPacked) {
    breaches.push('cotton');
  }
  if (slots.aspirinGiven) {
    breaches.push('aspirin');
  }
  if (slots.waitMinutes < slots.pinchMinutes) {
    breaches.push('time too short');
  }
  if (breaches.length === 0) {
    throw new Error('the variant does not act against the sheet');
  }
  const list = breaches.join(', ');
  const breachClause = `${list.charAt(0).toUpperCase()}${list.slice(1)}`;
  return { breachClause, pinchMinutes: slots.pinchMinutes };
}

function render(solution) {
  return `${solution.breachClause}. Correct: forward, ${solution.pinchMinutes} min pinch, no cotton/aspirin.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.patient === "string" && slots.patient.length > 0, "the statement must name the person bleeding");',
  'probe(typeof slots.helper === "string" && slots.helper.length > 0, "the statement must name the person helping");',
  'probe(slots.patient !== slots.helper, "the two named people must be different");',
  'probe(slots.questionHelper === slots.helper, "the question must ask about the person who acted");',
  'probe(Number.isInteger(slots.pinchMinutes) && slots.pinchMinutes > 0, "the sheet pinch time must be a positive whole number of minutes");',
  'probe(Number.isInteger(slots.emergencyMinutes) && slots.emergencyMinutes > slots.pinchMinutes, "the emergency time must exceed the pinch time");',
  'probe(Number.isInteger(slots.waitMinutes) && slots.waitMinutes >= 0, "the waiting time must be a whole number of minutes");',
  'probe(slots.waitMinutes < slots.pinchMinutes, "the helper must wait less than the sheet requires");',
  'const breaches = [];',
  'if (slots.postureReversed) { breaches.push("Posture reversed"); }',
  'if (slots.cottonPacked) { breaches.push("cotton"); }',
  'if (slots.aspirinGiven) { breaches.push("aspirin"); }',
  'if (slots.waitMinutes < slots.pinchMinutes) { breaches.push("time too short"); }',
  'const list = breaches.join(", ");',
  'const breachClause = list.charAt(0).toUpperCase() + list.slice(1);',
  'return breachClause + ". Correct: forward, " + slots.pinchMinutes + " min pinch, no cotton/aspirin.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The sheet at the club in ${slots.place} says to lean forward and not back, so laying ${slots.patient} on their back is the reverse of the written posture.`,
    `The sheet forbids cotton wool and aspirin for a nosebleed, and ${slots.helper} packed cotton and gave aspirin; it also asks for a ${slots.pinchMinutes} min pinch, while ${slots.helper} waited only ${slots.waitMinutes} min.`,
    `The first correct steps are to sit ${slots.patient} forward, pinch the wings for ${slots.pinchMinutes} min, and keep cotton and aspirin away.`,
    `${slots.patient} had bled for ${slots.bleedingMinutes} min, which is still short of the sheet's ${slots.emergencyMinutes} min emergency line.`
  ];
}

export const unit = 30;

export const cases = [
  {
    template: 'First-aid procedures as written',
    type: slugify('First-aid procedures as written'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
