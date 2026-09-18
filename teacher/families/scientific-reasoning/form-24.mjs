/**
 * Form 24 of the scientific-reasoning book: conservation of a quantity.
 *
 * Every part-two variant states a knowledge block, then a `Problem data.`
 * block describing a closed system with three tracked compartments of one
 * quantity and its conserved total: `the total is 24 portions`. The two shapes
 * the block takes decide how the three final values are derived:
 *
 * - the block states the initial values and two successive transfers ("Move 2
 *   units from the compartment A to the compartment B, then 2 units from B to
 *   C"), so the family applies the transfers in order;
 * - the block states the values of the first two compartments after the
 *   transfers and names the third one in the question, so the family takes the
 *   remainder of the total, which is the only value that conserves it.
 *
 * The printed answer reports the three final values with the unit of the total
 * and the total itself, so the family reproduces that line and checks the sum.
 * The variants differ in the world and in the tracked quantity (pollen,
 * seeds, water, energy, force, light packets) and therefore in the compartment
 * names, the unit, and the numbers; the conservation rule is the same.
 */

import { slugify } from '../../naming.mjs';

const QUOTED = /[“"]([^“”"]+)[”"]/g;
const TOTAL_PATTERN = /total is (\d+)\s*([^;]*);/;
const INITIAL_PATTERN = /initial state:\s*([\s\S]*?)\.\s*(?:Move|$)/;
const MOVE_PATTERN = /(?:Move|then) (\d+) units from (?:the compartment )?[“"]([^“”"]+)[”"] to (?:the compartment )?[“"]([^”"]+)[”"]/g;
const AFTER_PATTERN = /after two transfers,\s*([\s\S]*?)\.\s/;

function quotedNames(text) {
  return [...text.matchAll(QUOTED)].map((match) => match[1]);
}

function valuesIn(text) {
  return [...text.matchAll(/=(\d+)/g)].map((match) => Number(match[1]));
}

function parse(statement) {
  const data = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  const question = /Question\.\s*([\s\S]*)$/.exec(statement);
  if (data === null || question === null) {
    throw new Error('the statement does not state its closed system and its question');
  }
  const total = TOTAL_PATTERN.exec(data[1]);
  if (total === null) {
    throw new Error('the data block does not state the conserved total');
  }
  const unit = total[2].trim();
  if (unit === '') {
    throw new Error('the conserved total carries no unit');
  }
  const initial = INITIAL_PATTERN.exec(data[1]);
  if (initial !== null) {
    const compartments = quotedNames(initial[1]);
    const values = valuesIn(initial[1]);
    if (compartments.length !== 3 || values.length !== 3) {
      throw new Error('the initial state must give three named compartments with a value each');
    }
    const moves = [...data[1].matchAll(MOVE_PATTERN)].map((match) => ({
      amount: Number(match[1]),
      from: match[2],
      to: match[3]
    }));
    if (moves.length === 0) {
      throw new Error('the data block states no transfer to apply');
    }
    return { shape: 'initial', total: Number(total[1]), unit, compartments, values, moves };
  }
  const after = AFTER_PATTERN.exec(data[1]);
  if (after === null) {
    throw new Error('the data block states neither the initial state nor the state after the transfers');
  }
  const known = quotedNames(after[1]);
  const knownValues = valuesIn(after[1]);
  const missing = quotedNames(question[1])[0];
  if (known.length !== 2 || knownValues.length !== 2 || missing === undefined) {
    throw new Error('the state after the transfers must give two values and the question the missing compartment');
  }
  if (known.includes(missing)) {
    throw new Error('the question asks for a value that is already known');
  }
  return { shape: 'after', total: Number(total[1]), unit, compartments: [...known, missing], values: knownValues };
}

function solve(slots) {
  let values;
  if (slots.shape === 'initial') {
    values = slots.values.slice();
    for (const move of slots.moves) {
      const from = slots.compartments.indexOf(move.from);
      const to = slots.compartments.indexOf(move.to);
      if (from === -1 || to === -1) {
        throw new Error(`the transfer "${move.from}" to "${move.to}" does not name two tracked compartments`);
      }
      if (from === to) {
        throw new Error('a transfer must name two different compartments');
      }
      values[from] -= move.amount;
      values[to] += move.amount;
    }
  } else {
    values = [slots.values[0], slots.values[1], slots.total - slots.values[0] - slots.values[1]];
  }
  if (values.some((value) => value < 0)) {
    throw new Error('a compartment of the final state would hold a negative quantity');
  }
  const sum = values.reduce((left, right) => left + right, 0);
  if (sum !== slots.total) {
    throw new Error(`the final state sums to ${sum}, not to the conserved total ${slots.total}`);
  }
  return { compartments: slots.compartments, unit: slots.unit, total: slots.total, values };
}

function render(solution) {
  const [first, second, third] = solution.values;
  return `Consistent final state: "${solution.compartments[0]}"=${first}, "${solution.compartments[1]}"=${second}, "${solution.compartments[2]}"=${third} ${solution.unit}; the total is ${solution.total}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.compartments) && slots.compartments.length === 3, "the statement must name three compartments");',
  'probe(Number.isInteger(slots.total) && slots.total > 0, "the conserved total must be a positive whole quantity");',
  'probe(typeof slots.unit === "string" && slots.unit.length > 0, "the conserved total must carry its unit");',
  'let values;',
  'if (slots.shape === "initial") {',
  '  probe(Array.isArray(slots.values) && slots.values.length === 3, "the initial state must give three values");',
  '  probe(Array.isArray(slots.moves) && slots.moves.length > 0, "the data block must state the transfers to apply");',
  '  values = slots.values.slice();',
  '  for (const move of slots.moves) {',
  '    const from = slots.compartments.indexOf(move.from);',
  '    const to = slots.compartments.indexOf(move.to);',
  '    probe(from !== -1 && to !== -1, "every transfer must name two tracked compartments");',
  '    probe(from !== to && Number.isInteger(move.amount) && move.amount > 0, "every transfer must move a positive quantity between two different compartments");',
  '    values[from] -= move.amount;',
  '    values[to] += move.amount;',
  '  }',
  '} else {',
  '  probe(slots.shape === "after", "the statement must state either the initial state or the state after the transfers");',
  '  probe(Array.isArray(slots.values) && slots.values.length === 2, "the state after the transfers must give the two known compartments");',
  '  values = [slots.values[0], slots.values[1], slots.total - slots.values[0] - slots.values[1]];',
  '}',
  'probe(values.length === 3, "the final state must report three compartments");',
  'probe(values.every((value) => Number.isInteger(value) && value >= 0), "every compartment must hold a non-negative whole quantity");',
  'probe(values.reduce((sum, value) => sum + value, 0) === slots.total, "the three compartments must sum to the conserved total");',
  'return "Consistent final state: \\"" + slots.compartments[0] + "\\"=" + values[0] + ", \\"" + slots.compartments[1] + "\\"=" + values[1] + ", \\"" + slots.compartments[2] + "\\"=" + values[2] + " " + slots.unit + "; the total is " + slots.total + ".";'
].join('\n');

function explain(slots, solution) {
  const [first, second, third] = slots.compartments;
  const [firstValue, secondValue, thirdValue] = solution.values;
  const route =
    slots.shape === 'initial'
      ? `Applying the ${slots.moves.length} stated transfers in order to the initial values gives "${first}"=${firstValue}, "${second}"=${secondValue} and "${third}"=${thirdValue}.`
      : `The two known compartments are "${first}"=${firstValue} and "${second}"=${secondValue}, so "${third}" carries the whole remainder of the total.`;
  return [
    `The system is closed, so the sum of the three compartments must stay equal to the initial total of ${slots.total} ${slots.unit}.`,
    route,
    `Check: ${firstValue}+${secondValue}+${thirdValue}=${slots.total}.`,
    'Moving the quantity changes its distribution and not the total, so any state that satisfies this equality is a possible reconstruction.'
  ];
}

export const unit = 24;

export const cases = [
  {
    template: 'Conservation of a quantity',
    type: slugify('Conservation of a quantity'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
