/**
 * Section 60 of the adult-reasoning course: materials, hardness, conduction,
 * solubility.
 *
 * Every variant prints the same table — copper conducts heat and electricity
 * without magnetising, dry wood does not conduct here and burns, glass does not
 * conduct, does not burn easily, and breaks, steel magnetises and conducts —
 * and then describes one person whose spoon sticks to a magnet while a plate
 * fails a continuity tester like the glass trial, and who wants that plate as a
 * chopping board beside a flame. The verdict names the material the spoon
 * matches, names the trial the plate matched, and says why that material is no
 * board. The cases change the name, so the family derives every clause from the
 * parsed table and the parsed trials.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN = /Table: “([^”]+)”/;
const ROW_PATTERN = /([A-Z][a-z]+(?: [a-z]+)?): ([^.”]+)[.”]/g;
const TRIAL_PATTERN =
  /([A-Z][a-z]+)’s spoon (sticks to|does not stick to) a magnet\. A plate (does not light|lights) a continuity tester \(like the ([a-z]+) trial\)\. ([A-Z][a-z]+) wants the plate as a chopping board next to a flame\./;

/** The table name without its qualifier, as the answer prints it: "Dry wood" → "wood". */
function materialName(text) {
  return text
    .toLowerCase()
    .replace(/^dry\s+/, '');
}

function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function parse(statement) {
  const sheet = SHEET_PATTERN.exec(statement);
  const trial = TRIAL_PATTERN.exec(statement);
  if (sheet === null || trial === null) {
    throw new Error('the statement does not print the table and describe the spoon and the plate');
  }
  const entries = [...sheet[1].matchAll(ROW_PATTERN)].map((match) => ({
    name: materialName(match[1]),
    description: match[2]
  }));
  return {
    person: trial[1],
    spoonSticksToMagnet: trial[2] === 'sticks to',
    plateLightsTester: trial[3] === 'lights',
    trialMaterial: trial[4],
    wantsBoard: trial[5] === trial[1] && /chopping board next to a flame/.test(statement),
    materials: entries,
    magnetising: entries.filter((entry) => /can magnetise/.test(entry.description)).map((entry) => entry.name),
    nonConducting: entries.filter((entry) => /does not conduct/.test(entry.description)).map((entry) => entry.name),
    flammable: entries.filter((entry) => /burns/.test(entry.description)).map((entry) => entry.name),
    brittle: entries.filter((entry) => /breaks/.test(entry.description)).map((entry) => entry.name)
  };
}

/** The one table material whose description satisfies `property`. */
function only(materials, candidates, property) {
  if (candidates.length !== 1) {
    throw new Error(`the table must name exactly one material that ${property}`);
  }
  return candidates[0];
}

function solve(slots) {
  if (!slots.spoonSticksToMagnet) {
    throw new Error('the section fits the spoon by its sticking to a magnet');
  }
  if (slots.plateLightsTester) {
    throw new Error('the plate must fail the continuity tester');
  }
  if (!slots.wantsBoard) {
    throw new Error('the section asks why the plate cannot serve as a chopping board');
  }
  const spoonMaterial = only(slots.materials, slots.magnetising, 'magnetises');
  const boardMaterial = only(slots.materials, slots.flammable, 'burns');
  const brittleMaterial = only(slots.materials, slots.brittle, 'breaks');
  if (!slots.nonConducting.includes(slots.trialMaterial)) {
    throw new Error('the trial the plate matched must be a material that does not conduct');
  }
  const spoonClause = `Spoon: ${spoonMaterial}.`;
  const plateClause = `Plate: ${slots.trialMaterial}-like behaviour.`;
  const boardClause = `${capitalise(boardMaterial)} burns; ${brittleMaterial} is not a chopping board.`;
  return { spoonClause, plateClause, boardClause, boardMaterial };
}

function render(solution) {
  return `${solution.spoonClause} ${solution.plateClause} ${solution.boardClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.person === "string" && slots.person.length > 0, "the case must name the person");',
  'probe(slots.spoonSticksToMagnet === true, "the spoon must stick to a magnet");',
  'probe(slots.plateLightsTester === false, "the plate must fail the continuity tester");',
  'probe(Array.isArray(slots.materials) && slots.materials.length >= 4, "the table must list its materials");',
  'probe(slots.magnetising.length === 1 && slots.flammable.length === 1 && slots.brittle.length === 1, "exactly one material must magnetise, burn, and break");',
  'probe(slots.nonConducting.indexOf(slots.trialMaterial) !== -1, "the trial the plate matched must not conduct");',
  'const capitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1);',
  'const spoonClause = "Spoon: " + slots.magnetising[0] + ".";',
  'const plateClause = "Plate: " + slots.trialMaterial + "-like behaviour.";',
  'const boardClause = capitalise(slots.flammable[0]) + " burns; " + slots.brittle[0] + " is not a chopping board.";',
  'return spoonClause + " " + plateClause + " " + boardClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `Only one material in the table magnetises without giving up conduction — steel — so the spoon that sticks to the magnet matches steel.`,
    `${slots.person}'s plate failed the continuity tester exactly as the ${slots.trialMaterial} trial does, so the plate behaves like ${slots.trialMaterial} rather than like the conducting materials.`,
    `The table gives the board a second reason to refuse it: ${solution.boardMaterial} burns, and ${slots.brittle[0]} breaks, so the plate is not a chopping board next to a flame.`
  ];
}

export const unit = 60;

export const cases = [
  {
    template: 'Materials: hardness, conduction, solubility',
    type: slugify('Materials: hardness, conduction, solubility'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
