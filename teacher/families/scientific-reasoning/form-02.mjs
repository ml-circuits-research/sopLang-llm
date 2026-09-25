/**
 * Form 2 of the scientific-reasoning book: order and sequence.
 *
 * Every variant describes one world in prose and then hands over the stages of
 * that world's process as a scrambled list ("The stages were written in mixed
 * order: …") together with the rule that each stage must prepare the next one.
 * The sequence is not in the scrambled list and the world paragraph does not
 * always spell it out either, so the case does two things: its stages identify
 * which process the world describes, and the knowledge sheet of that process
 * fixes the order of the stages.
 *
 * The sheets are the fact of this family and travel on the `@facts` wire: one
 * ordered step list per process (germination, the water pathway, the food
 * chain, the digestive route, the water cycle, the state changes of water, …).
 * The computation reads the case's stages from `$slots`, selects the sheet
 * whose steps they are, and prints them in the sheet's order; a case whose
 * stages match no sheet and cases that match more than one are refused instead
 * of answered with a guess, because the scrambled list alone does not determine
 * the sequence.
 *
 * The twenty-five variants differ in the world they describe, not in the task,
 * so one family covers all of them.
 */

import { slugify } from '../../naming.mjs';

const MIXED_PATTERN = /The stages were written in mixed order: (.+?)\.\s*The model rule/;

/**
 * One ordered step list per world, in the order the process runs. Articles are
 * ignored when a case is matched against a sheet, so a sheet may keep the
 * printed phrasing of a step ("air enters lungs") while the case lists a fuller
 * one ("air enters the lungs").
 */
const KNOWLEDGE_SHEETS = Object.freeze([
  // Biology: germination of the imaginary bean species F.
  ['the seed absorbs water', 'the seed coat softens',
    'the young root emerges', 'the shoot appears'],
  // Biology: the water pathway from the root to the leaf.
  ['water enters the root', 'water moves up through the stem',
    'water reaches the leaf', 'the leaf uses water and light'],
  // Biology + Ecology: the meadow food chain.
  ['plants grow', 'the rabbit eats plants',
    'the fox finds the rabbit', 'energy from food reaches the fox'],
  // Biology: how the animal of the model spends a hot day.
  ['the animal finds shelter', 'avoids the hours very hot',
    'finds water', 'goes out to look for food'],
  // Biology: the four-stage life cycle of insect L.
  ['egg', 'larva',
    'pupa', 'adult'],
  // Biology: the digestive route from the mouth to the blood.
  ['the mouth breaks up food', 'food reaches the stomach',
    'reaches the small intestine', 'nutrients pass into the blood'],
  // Biology: oxygen from the inhaled air to the cells.
  ['air enters lungs', 'oxygen passes into the blood',
    'the blood transports oxygen', 'oxygen reaches the cells'],
  // Biology: from a detected stimulus to the response.
  ['the receptor detects the stimulus', 'the signal starts',
    'the signal is interpreted', 'the muscle performs the response'],
  // Biology + Health: how microbes reach the body from a surface.
  ['microbes reach the surface', 'has transferred onto the hands',
    'hands touch the mouth', 'microbes can enters body'],
  // Materials: choosing a material that meets the requirements.
  ['we establish the requirements', 'we test the properties',
    'we eliminate the materials unsuitable', 'we choose the material which meets all the requirements'],
  // Chemistry: separating the mixture step by step.
  ['we use the magnet', 'we use the sieve',
    'we filter the liquid', 'we evaporate the water'],
  // Physics: ice heated into melting and then into vapor.
  ['the ice receives heat', 'the ice melts',
    'liquid water receives more heat', 'part turns into vapor'],
  // Physics: a warm body cooling in a cooler environment.
  ['the warm body is placed in a cooler environment', 'heat begins to transfer',
    'insulation slows the transfer', 'temperature falls more slowly'],
  // Physics: how a shadow appears on the screen.
  ['the source emits light', 'light reaches the object',
    'the opaque object blocks part of the light', 'a shadowed area appears on the screen'],
  // Physics: a sound from its source to the receiver.
  ['the source vibrates', 'the vibration sets the medium in motion',
    'the signal propagates', 'the receiver detects the sound'],
  // Physics: a push, the motion it starts, and friction.
  ['we apply a push', 'the object begins to move',
    'friction opposes motion', 'the object slows down'],
  // Physics: bringing a magnet close to a magnetic object.
  ['we bring closer the magnet', 'the object enters the action zone',
    'attraction occurs', 'the object moves toward the magnet'],
  // Physics: closing the circuit so the bulb lights up.
  ['we connect the battery', 'we close the path through the wires',
    'the path passes through the bulb', 'the bulb lights up'],
  // Earth science: water poured onto soil.
  ['we pour water onto the soil', 'water enters the spaces between particles',
    'a part is retained', 'the remainder drains away'],
  // Earth science: the water cycle.
  ['water evaporates', 'the vapor rises',
    'the vapor cools and condenses', 'the droplets can fall and be collected'],
  // Earth science: a place moving from the illuminated side into the night.
  ['the location is in zone illuminated', 'Earth rotates',
    'the location reaches toward the edge of the zone illuminated', 'the location enters zone of night'],
  // Earth science: rock fragments becoming layers of sediment.
  ['the rock breaks into fragments', 'the fragments have been transported',
    'the fragments have been deposited', 'forms layers of sediment'],
  // Environment: what a pollutant does after it enters a stream.
  ['the pollutant enters the stream', 'the water carries it downstream',
    'downstream organisms have been exposed', 'effects may appear farther from the source'],
  // Health: the food chosen and then used by the body.
  ['we choose the food', 'the food is digested',
    'nutrients have been absorbed', 'the body can use them'],
  // Science practice: measuring and comparing a quantity.
  ['we define what we measure', 'we choose the instrument and unit',
    'we measure several times', 'we compare values'],
]);

/**
 * A step reduced to its content words, so that the article differences between
 * a case and its sheet ("the lungs" against "lungs") do not hide the match.
 */
function normalizeStage(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((word) => word !== '' && word !== 'the' && word !== 'a' && word !== 'an')
    .join(' ');
}

/** The sheet whose steps are exactly the stages of the case. */
function matchingSheet(stages, sheets) {
  const wanted = stages.map(normalizeStage).sort().join(' | ');
  const candidates = sheets.filter(
    (sheet) => sheet.length === stages.length && sheet.map(normalizeStage).sort().join(' | ') === wanted
  );
  if (candidates.length === 0) {
    throw new Error('the stages of the case match no knowledge sheet');
  }
  if (candidates.length > 1) {
    throw new Error(`the stages of the case match ${candidates.length} knowledge sheets`);
  }
  return candidates[0];
}

function parse(statement) {
  const caseData = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state its case data');
  }
  const mixed = MIXED_PATTERN.exec(caseData[1]);
  if (mixed === null) {
    throw new Error('the statement does not list the stages in mixed order');
  }
  const stages = mixed[1]
    .split('/')
    .map((stage) => stage.trim())
    .filter((stage) => stage !== '');
  if (stages.length < 2) {
    throw new Error('the statement lists fewer than two stages to order');
  }
  return { stages };
}

function solve(slots) {
  const sheet = matchingSheet(slots.stages, KNOWLEDGE_SHEETS);
  const rank = new Map(sheet.map((step, index) => [normalizeStage(step), index]));
  const positions = slots.stages.map((stage) => rank.get(normalizeStage(stage)));
  return { chain: positions.slice().sort((left, right) => left - right).map((index) => sheet[index]) };
}

function render(solution) {
  const chain = solution.chain.join(' → ');
  return `${chain.charAt(0).toUpperCase()}${chain.slice(1)}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const facts = (typeof $facts === "object" && $facts !== null) ? $facts : JSON.parse(String($facts));',
  'const sheets = facts.sheets;',
  'const normalize = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter((word) => word !== "" && word !== "the" && word !== "a" && word !== "an").join(" ");',
  'const wanted = slots.stages.map(normalize).sort().join(" | ");',
  'const candidates = sheets.filter((sheet) => sheet.length === slots.stages.length && sheet.map(normalize).sort().join(" | ") === wanted);',
  'probe(candidates.length > 0, "the stages of the case must match a knowledge sheet");',
  'probe(candidates.length === 1, "the stages of the case must match exactly one knowledge sheet, not " + candidates.length);',
  'const sheet = candidates[0];',
  'const rank = new Map(sheet.map((step, index) => [normalize(step), index]));',
  'const positions = slots.stages.map((stage) => rank.get(normalize(stage)));',
  'probe(positions.every((index) => typeof index === "number"), "every stage must be one step of the sheet");',
  'const chain = positions.slice().sort((left, right) => left - right).map((index) => sheet[index]);',
  'probe(chain.length === slots.stages.length, "the ordered chain must keep every stage of the case");',
  'const text = chain.join(" → ");',
  'return text.charAt(0).toUpperCase() + text.slice(1) + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The world of the case describes one process, and its stages ${slots.stages.join(', ')} are the steps of that process written in mixed order.`,
    `Matching those steps against the knowledge sheet of the process gives the sequence ${solution.chain.join(' → ')}, because each step of the sheet is the one that prepares the next.`,
    'The first step is the one that depends on none of the others, and every later step uses the result of the step before it.',
    'Reversing any neighbouring pair would ask for the effect before the cause, so the order of the sheet is the only order the process allows.'
  ];
}

export const unit = 2;

export const cases = [
  {
    template: 'Order and sequence',
    type: slugify('Order and sequence'),
    category: 'knowledge',
    parse,
    solve,
    render,
    facts: { sheets: KNOWLEDGE_SHEETS },
    compute: COMPUTE,
    explain
  }
];
