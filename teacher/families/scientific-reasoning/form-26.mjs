/**
 * Form 26 of the scientific-reasoning book: simple proportions and scaling.
 *
 * Every variant states one linear model: each unit of effort yields the same
 * fixed number of an observable quantity, the effects add, and the worked
 * example shows that two units yield twice that number. The question asks for
 * the quantity five units yield and for the number of units a stated quantity
 * needs, so both answers scale the stated value per unit.
 *
 * The variants differ in the world's vocabulary (pollen transfers, seeds
 * reaching a new location, decomposed material, retained water, saved energy,
 * crushed food, recovered energy, slowing points, useful contacts, changes of
 * phase, …) and in the value one unit yields, not in the rule. The source
 * prints the second clause of its answer in three ways and cycles the three
 * with the value one unit yields: two per unit prints "for 12, we need 6
 * active units", three prints "6 active units are needed for 18", and four
 * prints "for 24, 6 active units are needed".
 */

import { slugify } from '../../naming.mjs';

const MODEL_PATTERN =
  /each (.+?) produces exactly (\d+) (.+?) in the same interval, and the effects add linearly\. With (\d+) active units, we obtain (\d+) (.+?)\./;
const QUESTION_PATTERN =
  /How many .+? do we obtain with (\d+) active units\? How many active units are needed for (\d+) /;

/** Above this many units of output per unit of effort the source prints no answer. */
const PRINTED_TAILS = [2, 3, 4];

function parse(statement) {
  const model = MODEL_PATTERN.exec(statement);
  const question = QUESTION_PATTERN.exec(statement);
  if (model === null) {
    throw new Error('the statement does not state the linear model and the value one unit yields');
  }
  if (question === null) {
    throw new Error('the statement does not state the units it asks about and the target quantity');
  }
  const quantity = model[3].trim();
  if (quantity !== model[6].trim()) {
    throw new Error('the rule and the worked example name two different quantities');
  }
  const askedUnits = Number(question[1]);
  const target = Number(question[2]);
  if (askedUnits <= 0 || target <= 0) {
    throw new Error('the statement must ask for a positive number of units and a positive quantity');
  }
  return {
    perUnit: Number(model[2]),
    quantity,
    checkUnits: Number(model[4]),
    checkValue: Number(model[5]),
    askedUnits,
    target
  };
}

function solve(slots) {
  if (!PRINTED_TAILS.includes(slots.perUnit)) {
    throw new Error(`the source prints no answer for ${slots.perUnit} units of output per unit of effort`);
  }
  if (slots.target % slots.perUnit !== 0) {
    throw new Error(`the stated target ${slots.target} is not a whole number of units at ${slots.perUnit} per unit`);
  }
  return {
    perUnit: slots.perUnit,
    quantity: slots.quantity,
    askedUnits: slots.askedUnits,
    value: slots.askedUnits * slots.perUnit,
    target: slots.target,
    unitsNeeded: slots.target / slots.perUnit
  };
}

/**
 * The second clause of the printed answer. The source writes the same two
 * numbers in one of the three orders it cycles with the value one unit yields.
 */
function tail(solution) {
  if (solution.perUnit === 2) {
    return `for ${solution.target}, we need ${solution.unitsNeeded} active units.`;
  }
  if (solution.perUnit === 3) {
    return `${solution.unitsNeeded} active units are needed for ${solution.target}.`;
  }
  return `for ${solution.target}, ${solution.unitsNeeded} active units are needed.`;
}

function render(solution) {
  return `With ${solution.askedUnits} units: ${solution.value} ${solution.quantity}; ${tail(solution)}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const printedTails = [2, 3, 4];',
  'probe(Number.isInteger(slots.perUnit) && slots.perUnit > 0, "one unit of effort must yield a positive whole number of units of output");',
  'probe(typeof slots.quantity === "string" && slots.quantity.length > 0, "the statement must name the quantity that grows");',
  'probe(Number.isInteger(slots.askedUnits) && slots.askedUnits > 0, "the statement must ask about a positive number of units");',
  'probe(Number.isInteger(slots.target) && slots.target > 0, "the target quantity must be a positive number");',
  'probe(slots.checkValue === slots.checkUnits * slots.perUnit, "the worked example must show the value per unit it states");',
  'probe(printedTails.includes(slots.perUnit), "the source must print an answer for " + slots.perUnit + " units of output per unit of effort");',
  'probe(slots.target % slots.perUnit === 0, "the target quantity must be a whole number of units");',
  'const askedUnits = slots.askedUnits;',
  'const value = askedUnits * slots.perUnit;',
  'const unitsNeeded = slots.target / slots.perUnit;',
  'let tail;',
  'if (slots.perUnit === 2) tail = "for " + slots.target + ", we need " + unitsNeeded + " active units.";',
  'else if (slots.perUnit === 3) tail = unitsNeeded + " active units are needed for " + slots.target + ".";',
  'else tail = "for " + slots.target + ", " + unitsNeeded + " active units are needed.";',
  'probe(value === askedUnits * slots.perUnit && Number.isInteger(value), "the scaled quantity must be a whole number of units");',
  'probe(unitsNeeded * slots.perUnit === slots.target, "the computed units must produce exactly the target quantity");',
  'return "With " + askedUnits + " units: " + value + " " + slots.quantity + "; " + tail;'
].join('\n');

function explain(slots, solution) {
  return [
    `One unit of effort yields ${slots.perUnit} ${slots.quantity}, and the statement says the effects add linearly, so the quantity is proportional to the number of units.`,
    `The worked example confirms the factor: ${slots.checkUnits} units yield ${slots.checkValue} ${slots.quantity}, which is ${slots.checkUnits}×${slots.perUnit}.`,
    `Five units yield 5×${slots.perUnit}=${solution.value} ${slots.quantity}, and the target ${slots.target} is ${slots.target}÷${slots.perUnit}=${solution.unitsNeeded} units.`,
    'Dividing the target by the value per unit is valid only because the problem states a linear model; without that clause the same two numbers would not scale.'
  ];
}

export const unit = 26;

export const cases = [
  {
    template: 'Simple proportions and scaling',
    type: slugify('Simple proportions and scaling'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
