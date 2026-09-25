/**
 * Section 33 of the logical-reasoning book: scale and models.
 *
 * Every case describes a table model that holds a toy load, then records
 * three reactions: one reads the name the two structures share as proof that
 * the real structure will carry the real load, one says that scale can change
 * which forces matter, and one says that models prove nothing at all. The case
 * data changes the place, the modelled structure, the small load, the real
 * load, and the three names; the verdict is fixed: the model supports a
 * limited analogy, because a shared name is not shared mechanics and the
 * statement never scales the relevant forces.
 */

import { slugify } from '../../naming.mjs';

const MODEL_PATTERN = /^A (\w+) model of a bridge in ([A-Z][A-Za-z ]*) holds a (\w+) cart\./;
const ENTHUSIAST_PATTERN = /([A-Z][a-z]+) says the real (\w+) bridge will hold a (\w+) because both are “(\w+)\.?”/;
const SCALER_PATTERN = /([A-Z][a-z]+) says scale can change which forces matter\./;
const NIHILIST_PATTERN = /([A-Z][a-z]+) says models are always lies so they prove nothing at all\./;

/**
 * A statement that hands the family the scaling the section's cases withhold
 * is a different problem: it would support the claim, so `parse` refuses it
 * instead of printing the limited-analogy verdict over it.
 */
const SCALING_PATTERN = /\bthe same forces\b|\bforces (are|stay) the same\b|\bforces scale (with|by)\b/;

function required(pattern, statement, what) {
  const match = pattern.exec(statement);
  if (match === null) {
    throw new Error(`the statement does not record ${what}`);
  }
  return match;
}

function parse(statement) {
  if (SCALING_PATTERN.test(statement)) {
    throw new Error('the statement already scales the relevant forces, so it is not the limited analogy this section covers');
  }
  const model = required(MODEL_PATTERN, statement, 'the model, its place, and the load it holds');
  const enthusiast = required(ENTHUSIAST_PATTERN, statement, 'the reader who infers from the shared name');
  const scaler = required(SCALER_PATTERN, statement, 'the reader who says scale can change which forces matter');
  const nihilist = required(NIHILIST_PATTERN, statement, 'the reader who says models prove nothing');
  return {
    modelKind: model[1],
    place: model[2].trim(),
    modelNoun: model[3],
    enthusiast: enthusiast[1],
    realQualifier: enthusiast[2],
    realLoad: enthusiast[3],
    sharedName: enthusiast[4],
    scaler: scaler[1],
    nihilist: nihilist[1]
  };
}

function solve(slots) {
  if (slots.realLoad === slots.modelNoun) {
    throw new Error('the real load must differ from the load the model holds');
  }
  return {
    verdict: 'limited analogy',
    modelKind: slots.modelKind,
    place: slots.place,
    modelNoun: slots.modelNoun,
    realQualifier: slots.realQualifier,
    realLoad: slots.realLoad,
    sharedName: slots.sharedName,
    enthusiast: slots.enthusiast,
    scaler: slots.scaler,
    nihilist: slots.nihilist
  };
}

function render(solution) {
  return `A limited analogy. Size can introduce stresses the ${solution.modelNoun} never met. Shared name is not shared mechanics.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "A limited analogy. Size can introduce stresses the " + slots.modelNoun + " never met. Shared name is not shared mechanics.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The model in ${solution.place} is a ${solution.modelKind} bridge that holds a ${solution.modelNoun} cart, while the real ${solution.realQualifier} bridge is asked to hold a ${solution.realLoad}.`,
    `${solution.enthusiast} rests the inference on the word “${solution.sharedName}”, which both structures carry, but a shared name transports no mechanics.`,
    `${solution.scaler} names what the statement leaves out: size can introduce stresses the ${solution.modelNoun} never met, and the case never states that the relevant forces scale.`,
    `${solution.nihilist} overcorrects: a model can guide without proving, so the verdict is a limited analogy rather than a dismissal.`
  ];
}

export const unit = 33;

export const cases = [
  {
    template: 'Scale and models',
    type: slugify('Scale and models'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
