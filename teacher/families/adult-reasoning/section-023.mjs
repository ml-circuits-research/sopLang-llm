/**
 * Section 23 of the adult-reasoning course: doses according to the given leaflet.
 *
 * Every variant prints the same fictional syrup leaflet: an adult dose of
 * 10 ml every 8 hours capped at 3 doses / 30 ml per 24 h, a child schedule, a
 * ban under 6, the rule that a missed dose is skipped rather than doubled, the
 * spoon volume, and the statement that adult body weight does not change the
 * adult schedule. The reader took one dose, missed the next, and now wants to
 * double up "to catch up" and asks whether the weight matters. The verdict
 * caps the moment at the single leaflet dose and rejects the weight as a
 * parameter. The variants change the name and the weight.
 */

import { slugify } from '../../naming.mjs';

const LEAFLET_PATTERN =
  /Adults: (\d+) ml every (\d+) hours, max (\d+) doses \/ (\d+) ml per 24 h\./;
const PLAN_PATTERN =
  /([A-Z][a-z]+), (\d+), (\d+) kg, took (\d+) ml at (\d{2}):(\d{2}), missed (\d{2}):(\d{2}), at (\d{2}):(\d{2}) wants (\d+) ml “to catch up”\./;

function parse(statement) {
  const leaflet = LEAFLET_PATTERN.exec(statement);
  const plan = PLAN_PATTERN.exec(statement);
  if (leaflet === null || plan === null) {
    throw new Error('the statement does not print the leaflet and the person taking the course');
  }
  return {
    adultDoseMl: Number(leaflet[1]),
    adultIntervalHours: Number(leaflet[2]),
    adultMaxDoses: Number(leaflet[3]),
    adultMaxMl: Number(leaflet[4]),
    person: plan[1],
    age: Number(plan[2]),
    weightKg: Number(plan[3]),
    takenMl: Number(plan[4]),
    takenAt: `${plan[5]}:${plan[6]}`,
    missedAt: `${plan[7]}:${plan[8]}`,
    askAt: `${plan[9]}:${plan[10]}`,
    wantedMl: Number(plan[11])
  };
}

function solve(slots) {
  if (slots.wantedMl <= slots.adultDoseMl) {
    throw new Error('the wanted amount does not exceed the leaflet dose, which is not this section pattern');
  }
  if (slots.takenMl !== slots.adultDoseMl) {
    throw new Error('the taken amount differs from the leaflet dose, which is not this section pattern');
  }
  return {
    allowedMl: slots.adultDoseMl,
    wantedMl: slots.wantedMl,
    weightKg: slots.weightKg,
    skippedAt: slots.missedAt
  };
}

function render(solution) {
  return `At most ${solution.allowedMl} ml (not ${solution.wantedMl}). Weight is not a parameter of the adult schedule.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.person === "string" && slots.person.length > 0, "the case must name the person taking the course");',
  'probe(Number.isInteger(slots.adultDoseMl) && slots.adultDoseMl > 0, "the adult dose must be a positive whole number of millilitres");',
  'probe(Number.isInteger(slots.weightKg) && slots.weightKg > 0, "the body weight must be a positive whole number of kilograms");',
  'probe(slots.takenMl === slots.adultDoseMl, "the taken amount must equal the leaflet dose");',
  'probe(slots.wantedMl > slots.adultDoseMl, "the wanted amount must exceed the leaflet dose for this section pattern");',
  'probe(slots.adultDoseMl * slots.adultMaxDoses <= slots.adultMaxMl, "the leaflet dose times the dose cap must respect the 24-hour cap");',
  'return "At most " + slots.adultDoseMl + " ml (not " + slots.wantedMl + "). Weight is not a parameter of the adult schedule.";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.person} is ${slots.age} and took the adult dose of ${slots.takenMl} ml at ${slots.takenAt}, then let the ${slots.missedAt} dose pass, so the leaflet says it is skipped and not doubled.`,
    `At ${slots.askAt} the amount the text allows is the ordinary adult dose, ${solution.allowedMl} ml, not the ${solution.wantedMl} ml of a catch-up dose.`,
    `The leaflet caps the day at ${slots.adultMaxDoses} doses and ${slots.adultMaxMl} ml, and the weight of ${solution.weightKg} kg never enters the adult schedule.`,
    'The plausible-looking arithmetic of doubling for a missed dose is exactly what the text rules out.'
  ];
}

export const unit = 23;

export const cases = [
  {
    template: 'Doses according to the given leaflet',
    type: slugify('Doses according to the given leaflet'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
