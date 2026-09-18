/**
 * Section 4 of the adult-reasoning course: recipes, procedures, and step order.
 *
 * Every variant prints one bread recipe for two tins with six numbered steps,
 * the halving rule for a single tin (halve all ingredients, but not the waiting
 * times of S1, S4 and S5), the cold-room rule that turns the S4 rise into a
 * longer wait, and the ban on putting salt into the yeast water before S2. The
 * baker then wants one tin, works in a cold room, puts the salt with the yeast,
 * and halves everything including the kneading and the rising. The verdict
 * states what was respected (the ingredients were halved) and lists the
 * breaches, each named with the quantity the step prescribes. The cases change
 * the kitchen, the baker, the flour and water amounts, and the printed
 * kneading and rising minutes, so the family derives each breach from the
 * parsed recipe and the parsed episode.
 */

import { slugify } from '../../naming.mjs';

const KITCHEN_PATTERN = /Recipe from ([A-Z][a-z]+)’s kitchen in ([^:]+):/;
const BATCH_PATTERN = /For (\d+) tins: (\d+) g flour, (\d+) g lukewarm water, (\d+) g dry yeast, (\d+) g salt, (\d+) g oil\./;
const YEAST_STEP_PATTERN = /S(\d+): yeast \+ water, (\d+) minutes\./;
const KNEAD_PATTERN = /S(\d+): knead (\d+) minutes\./;
const RISE_PATTERN = /S(\d+): rise (\d+) min at (\d+)–(\d+) °C\./;
const PROOF_PATTERN = /S(\d+): two tins, another (\d+) min\./;
const BAKE_PATTERN = /S(\d+): (\d+) min at (\d+) °C\./;
const COLD_PATTERN = /Below (\d+) °C, S4 becomes (\d+) min\./;
const SALT_BAN_PATTERN = /Do not put salt into the yeast water before S(\d+)\./;
const BAKER_PATTERN =
  /([A-Z][a-z]+) wants (\w+) tin, the room is (\d+) °C, puts salt with the yeast, halves everything including kneading \((\d+) min\) and rising \((\d+) min\), then bakes\./;

function parse(statement) {
  const kitchen = KITCHEN_PATTERN.exec(statement);
  const batch = BATCH_PATTERN.exec(statement);
  const yeastStep = YEAST_STEP_PATTERN.exec(statement);
  const knead = KNEAD_PATTERN.exec(statement);
  const rise = RISE_PATTERN.exec(statement);
  const proof = PROOF_PATTERN.exec(statement);
  const bake = BAKE_PATTERN.exec(statement);
  const cold = COLD_PATTERN.exec(statement);
  const saltBan = SALT_BAN_PATTERN.exec(statement);
  const baker = BAKER_PATTERN.exec(statement);
  if (
    kitchen === null ||
    batch === null ||
    yeastStep === null ||
    knead === null ||
    rise === null ||
    proof === null ||
    bake === null ||
    cold === null ||
    saltBan === null ||
    baker === null
  ) {
    throw new Error('the statement does not print the recipe and the single-tin episode');
  }
  return {
    kitchenOf: kitchen[1],
    place: kitchen[2].trim(),
    baker: baker[1],
    tins: batch[1],
    flour: Number(batch[2]),
    water: Number(batch[3]),
    yeastStep: Number(yeastStep[1]),
    yeastMinutes: Number(yeastStep[2]),
    saltStep: Number(saltBan[1]),
    kneadStep: Number(knead[1]),
    kneadMinutes: Number(knead[2]),
    riseStep: Number(rise[1]),
    riseMinutes: Number(rise[2]),
    riseLowC: Number(rise[3]),
    riseHighC: Number(rise[4]),
    proofStep: Number(proof[1]),
    proofMinutes: Number(proof[2]),
    bakeStep: Number(bake[1]),
    bakeMinutes: Number(bake[2]),
    bakeC: Number(bake[3]),
    coldBelow: Number(cold[1]),
    coldRise: Number(cold[2]),
    roomTemp: Number(baker[3]),
    observedKnead: Number(baker[4]),
    observedRise: Number(baker[5]),
    saltWithYeast: true,
    halvesEverything: /halves everything/.test(statement)
  };
}

function solve(slots) {
  const effectiveRise = slots.roomTemp < slots.coldBelow ? slots.coldRise : slots.riseMinutes;
  if (slots.roomTemp >= slots.coldBelow) {
    throw new Error('the workroom is not below the temperature that lengthens the rise');
  }
  if (slots.observedKnead !== slots.kneadMinutes / 2) {
    throw new Error('the baker did not halve the kneading time of the recipe');
  }
  if (slots.observedRise !== slots.riseMinutes / 2) {
    throw new Error('the baker did not halve the rise time of the recipe');
  }
  const respectClause = `Halved ingredients: ${slots.halvesEverything ? 'yes' : 'no'}.`;
  const breaches = [];
  if (slots.saltWithYeast) {
    breaches.push(`salt in S${slots.yeastStep}`);
  }
  if (slots.observedKnead !== slots.kneadMinutes) {
    breaches.push(`${slots.observedKnead}-minute knead`);
  }
  if (slots.observedRise !== effectiveRise) {
    breaches.push(`${slots.observedRise}-minute rise`);
  }
  if (slots.observedRise !== slots.coldRise) {
    breaches.push(`ignoring the ${slots.coldRise} minutes at ${slots.roomTemp} °C`);
  }
  const breachesClause = breaches.length === 0 ? 'Breaches: none.' : `Breaches: ${breaches.join('; ')}.`;
  return { respectClause, breachesClause };
}

function render(solution) {
  return `${solution.respectClause} ${solution.breachesClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots === "object" && slots !== null, "the case must carry the parsed recipe");',
  'probe(typeof slots.baker === "string" && slots.baker.length > 0, "the episode must name the baker");',
  'probe(slots.flour > 0 && slots.water > 0, "the recipe must carry positive amounts");',
  'probe(Number.isInteger(slots.kneadMinutes) && slots.kneadMinutes > 0, "the kneading time must be a whole number of minutes");',
  'probe(Number.isInteger(slots.riseMinutes) && slots.riseMinutes > 0, "the rise time must be a whole number of minutes");',
  'probe(slots.roomTemp < slots.coldBelow, "the workroom must be below the temperature that lengthens the rise");',
  'probe(slots.coldRise > slots.riseMinutes, "the cold-room rise must be longer than the warm rise");',
  'probe(slots.observedKnead === slots.kneadMinutes / 2, "the baker must have halved the kneading time");',
  'probe(slots.observedRise === slots.riseMinutes / 2, "the baker must have halved the rise time");',
  'const effectiveRise = slots.roomTemp < slots.coldBelow ? slots.coldRise : slots.riseMinutes;',
  'const respectClause = "Halved ingredients: " + (slots.halvesEverything ? "yes" : "no") + ".";',
  'const breaches = [];',
  'if (slots.saltWithYeast) { breaches.push("salt in S" + slots.yeastStep); }',
  'if (slots.observedKnead !== slots.kneadMinutes) { breaches.push(slots.observedKnead + "-minute knead"); }',
  'if (slots.observedRise !== effectiveRise) { breaches.push(slots.observedRise + "-minute rise"); }',
  'if (slots.observedRise !== slots.coldRise) { breaches.push("ignoring the " + slots.coldRise + " minutes at " + slots.roomTemp + " °C"); }',
  'const breachesClause = breaches.length === 0 ? "Breaches: none." : "Breaches: " + breaches.join("; ") + ".";',
  'return respectClause + " " + breachesClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The recipe from ${slots.kitchenOf}'s kitchen in ${slots.place} is written for ${slots.tins} tins, and ${slots.baker} halved the ${slots.flour} g of flour and the ${slots.water} g of water for one tin, which the recipe asks for, so ${solution.respectClause}`,
    `The salt went into the yeast water at S${slots.yeastStep}, although the recipe forbids salt there before S${slots.saltStep}, and the kneading was cut to ${slots.observedKnead} minutes although S${slots.kneadStep} prescribes ${slots.kneadMinutes}.`,
    `The rise of S${slots.riseStep} is printed as ${slots.riseMinutes} minutes at ${slots.riseLowC}–${slots.riseHighC} °C, and the room is ${slots.roomTemp} °C, below the ${slots.coldBelow} °C that turns it into ${slots.coldRise} minutes, so the halved ${slots.observedRise} minutes are wrong twice over.`,
    `The correct sequence for one tin keeps the waiting times whole: S${slots.yeastStep} yeast with water for ${slots.yeastMinutes} minutes, then the flour with the salt, ${slots.kneadMinutes} minutes of kneading at S${slots.kneadStep}, ${slots.coldRise} minutes of rising at ${slots.roomTemp} °C, ${slots.proofMinutes} minutes in the tins at S${slots.proofStep}, and ${slots.bakeMinutes} minutes at ${slots.bakeC} °C at S${slots.bakeStep}.`
  ];
}

export const unit = 4;

export const cases = [
  {
    template: 'Recipes, procedures, and step order',
    type: slugify('Recipes, procedures, and step order'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
