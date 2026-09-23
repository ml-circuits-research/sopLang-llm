/**
 * The composition inventory: a declared set of operator chains, each one family.
 *
 * The series measured the same profile at every checkpoint of every arm: 98% on
 * plan fingerprints the trainer saw and 12.5% to 25.0% on the sixteen slice rows
 * whose plans occur nowhere else (`evaluation/registry/phase4-analysis.md`, the
 * plan-inventory finding, 2026-09-22). The export holds 941 distinct plans in 8015
 * rows, distributed from 589 mathematical-thinking plans at 1.7 rows each to 10
 * decompose-to-solve plans at 100 rows each, so the model learns a few dozen
 * arithmetic templates very well and hundreds of plans once each.
 *
 * This module is the arm that attacks that directly, as astra_review I5 proposed:
 * instead of adding more phrasings of the plans that are already covered, it
 * declares the compositions explicitly, generates a learnable number of instances
 * of each, and holds out whole compositions so the held-out rows are compositions
 * the trainer never saw at any depth.
 *
 * The inventory is declared before any statement is rendered, which is what makes
 * the split structural: `COMPOSITIONS` below is the authority, each family is
 * derived from one entry, and the held-out entries are named in `HELD_OUT` rather
 * than decided per instance. A composition is a sequence of operators over one
 * drawn list, so the same machine that generates the training rows can describe
 * what it did, and the chain is the plan fingerprint.
 *
 * Two properties are required of every composition and are checked when the
 * generator loads:
 *
 * - **Total and observable.** Every chain must produce a whole number on every
 *   draw it admits, and the operators must change the answer: a chain that
 *   collapses to a constant teaches a constant.
 * - **Distinguishable from its neighbours.** Two compositions that differ by one
 *   operator must require different answers on the same draw, so the family that
 *   names the distinction can be learned from the statement rather than guessed.
 *
 * The third tranche adds the four census operations the book families perform
 * that the inventory still did not cover (`evaluation/census.mjs`): time
 * arithmetic (`elapsed`), graph traversal (`neighbourCount`, `pathExists`),
 * probability (`probability`), and two-dimensional geometry (`rectangleArea`).
 *
 * Two of them take two inputs, which the single-input chain cannot express, so
 * the smallest honest extension is used: the operator reads the chain value as
 * its first input and a second literal that the statement states explicitly as
 * its second. `rectangleArea` takes the length from the chain and the width from
 * its own sentence; `pathExists` takes one node from the chain and the other
 * node, plus the edge list, from its sentence. The chain keeps walking one value,
 * and the parameters a stage reads are recovered by the family's parse exactly as
 * the original operators' parameters are. An operator that ends on a word rather
 * than a number (`pathExists` -> yes/no, `probability` -> a reduced fraction)
 * declares `returns: 'answer'`, which the inventory check accepts as a terminal
 * type alongside `scalar`.
 *
 * The generators here are deliberately independent of `evaluation/diagnostics/`:
 * that module is evaluation-only material, and a training family that imported it
 * would put the evaluation vocabulary inside the suite it is measured by.
 */

const DEPOTS = ['north depot', 'river depot', 'hill depot', 'market depot', 'harbour depot'];
const KEEPERS = ['Priya', 'Mara', 'Daria', 'Luca', 'Ines', 'Tomas', 'Nadia', 'Ravi'];
const UNITS = ['crates', 'parts', 'tickets', 'litres', 'sheets'];
const TIMES = ['this morning', 'on Monday', 'after the audit', 'before lunch', 'last week'];

/**
 * The operators the inventory composes. Each reads one value and returns one, and
 * each declares whether it consumes a list or a scalar, so a chain can be checked
 * as a well-typed sequence rather than by running it and hoping.
 */
const OPERATORS = Object.freeze({
  keepAbove: {
    takes: 'list',
    returns: 'list',
    apply: (values, parameters) => values.filter((value) => value > parameters.threshold),
    sentence: (parameters) => `keep only the records above ${parameters.threshold}`,
    clause: 'the threshold must leave at least one record and must drop at least one'
  },
  keepBelow: {
    takes: 'list',
    returns: 'list',
    apply: (values, parameters) => values.filter((value) => value < parameters.threshold),
    sentence: (parameters) => `keep only the records below ${parameters.threshold}`,
    clause: 'the threshold must leave at least one record and must drop at least one'
  },
  total: {
    takes: 'list',
    returns: 'scalar',
    apply: (values) => values.reduce((sum, value) => sum + value, 0),
    sentence: () => 'add the kept records',
    clause: 'the kept records must be a non-empty list'
  },
  count: {
    takes: 'list',
    returns: 'scalar',
    apply: (values) => values.length,
    sentence: () => 'count the kept records',
    clause: 'the kept records must be a non-empty list'
  },
  largest: {
    takes: 'list',
    returns: 'scalar',
    apply: (values) => Math.max(...values),
    sentence: () => 'take the largest kept record',
    clause: 'the kept records must be a non-empty list'
  },
  smallest: {
    takes: 'list',
    returns: 'scalar',
    apply: (values) => Math.min(...values),
    sentence: () => 'take the smallest kept record',
    clause: 'the kept records must be a non-empty list'
  },
  double: {
    takes: 'scalar',
    returns: 'scalar',
    // The factor is a drawn parameter rather than a constant two, so the stage is a
    // property of the draw and not a number a model can assume from the operator name.
    apply: (value, parameters) => value * parameters.multiplier,
    sentence: (parameters) => `double it by the factor of ${parameters.multiplier}`,
    clause: 'the value must be a number'
  },
  addRate: {
    takes: 'scalar',
    returns: 'scalar',
    apply: (value, parameters) => value + parameters.rate,
    sentence: (parameters) => `add the fixed charge of ${parameters.rate}`,
    clause: 'the value must be a number'
  },
  subtractRate: {
    takes: 'scalar',
    returns: 'scalar',
    apply: (value, parameters) => value - parameters.rate,
    sentence: (parameters) => `subtract the fixed deduction of ${parameters.rate}`,
    clause: 'the value must exceed the deduction'
  },
  perUnit: {
    takes: 'scalar',
    returns: 'scalar',
    apply: (value, parameters) => value * parameters.perUnit,
    sentence: (parameters) => `multiply it by the ${parameters.perUnit} labels per record`,
    clause: 'the value must be a number'
  },
  // The census operators (evaluation/census.mjs): the operations the book families
  // perform that the original eleven did not cover. Each follows the same contract
  // and the same draw-parameter discipline as the originals.
  keepDivisibleBy: {
    takes: 'list',
    returns: 'list',
    apply: (values, parameters) => values.filter((value) => value % parameters.divisor === 0),
    sentence: (parameters) => `keep only the records divisible by ${parameters.divisor}`,
    clause: 'the divisor must keep at least one record and drop at least one'
  },
  modulo: {
    takes: 'scalar',
    returns: 'scalar',
    apply: (value, parameters) => value % parameters.divisor,
    sentence: (parameters) => `take the remainder of it divided by ${parameters.divisor}`,
    clause: 'the value must not be a multiple of the divisor, so the remainder is non-zero'
  },
  uniqueCount: {
    takes: 'list',
    returns: 'scalar',
    apply: (values) => new Set(values).size,
    sentence: () => 'count the distinct records',
    clause: 'the kept records must contain at least one repeated value, so the distinct count differs from the count'
  },
  percentOf: {
    takes: 'scalar',
    returns: 'scalar',
    apply: (value, parameters) => (value * parameters.pct) / 100,
    sentence: (parameters) => `take ${parameters.pct} percent of it`,
    clause: 'the percentage must land on a whole number'
  },
  ratioPer: {
    takes: 'scalar',
    returns: 'scalar',
    apply: (value, parameters) => value / parameters.divisor,
    sentence: (parameters) => `split it into ${parameters.divisor} equal parts`,
    clause: 'the value must divide evenly, so each part is a whole number'
  },
  discount: {
    takes: 'scalar',
    returns: 'scalar',
    apply: (value, parameters) => value - (value * parameters.pct) / 100,
    sentence: (parameters) => `reduce it by the discount of ${parameters.pct} percent`,
    clause: 'the discounted amount must land on a whole number and stay positive'
  },
  nthLargest: {
    takes: 'list',
    returns: 'scalar',
    apply: (values, parameters) => [...values].sort((left, right) => right - left)[parameters.nth - 1],
    sentence: (parameters) => `take the ${ordinal(parameters.nth)} largest kept record`,
    clause: 'the kept records must hold at least as many records as the asked rank'
  },
  squareArea: {
    takes: 'scalar',
    returns: 'scalar',
    apply: (value) => value * value,
    sentence: () => 'take the area of a square with that side',
    clause: 'the side must be a whole number, so the area is whole'
  },
  // Time arithmetic: convert a running total of hours into minutes, or of days
  // into hours, by a factor the sentence states. The factor is stated rather than
  // assumed, because a unit convention is external knowledge (DS008 files those
  // under `knowledge/`), and this family stays `no-knowledge`. The ledger records
  // the input unit, the answer is reported in the operator's label.
  elapsed: {
    takes: 'scalar',
    returns: 'scalar',
    apply: (value, parameters) => value * parameters.per,
    sentence: (parameters) => `convert it into ${parameters.label} by the factor of ${parameters.per}`,
    clause: 'the value must be a number',
    report: {
      instruction: (slots) => `Report the result in ${slots.label}.`,
      parseInstruction: (instruction, slots) => {
        const match = /^Report the result in (minutes|hours)\.$/.exec(instruction);
        if (match === null) {
          throw new Error('the statement does not report the elapsed time in minutes or hours');
        }
        if (match[1] !== slots.label) {
          throw new Error('the reported unit does not match the conversion');
        }
      },
      render: (answer, slots) => `${answer} ${slots.label}.`,
      phrase: (answer, slots) => `${answer} ${slots.label}`,
      ret: 'return current + " " + slots.label + ".";',
      probe: 'probe(Number.isInteger(current) && current >= 0, "the answer must be a whole number that is not negative");'
    }
  },
  // Graph traversal, single-input: count the neighbours of the chain's node among
  // the stated edges. The node is the value the previous stage produced, and the
  // edge list is a second literal the sentence states explicitly.
  neighbourCount: {
    takes: 'scalar',
    returns: 'scalar',
    apply: (value, parameters) => parameters.edges.reduce((count, edge) => count + (edge[0] === value || edge[1] === value ? 1 : 0), 0),
    sentence: (parameters) => `count the neighbours of that node in the edges ${formatEdges(parameters.edges)}`,
    clause: 'the node must appear in at least one edge',
    report: {
      instruction: () => 'Report the number of neighbours.',
      parseInstruction: (instruction) => {
        if (instruction !== 'Report the number of neighbours.') {
          throw new Error('the statement does not ask for the number of neighbours');
        }
      },
      render: (answer) => `${answer} neighbours.`,
      phrase: (answer) => `${answer} neighbours`,
      ret: 'return current + " neighbours.";',
      probe: 'probe(Number.isInteger(current) && current >= 0, "the answer must be a whole number that is not negative");'
    }
  },
  // Graph traversal, two-input: whether a path joins the chain's node to a second
  // node the sentence states, over a stated edge list. The answer is a word, so
  // this operator returns 'answer'.
  pathExists: {
    takes: 'scalar',
    returns: 'answer',
    apply: (value, parameters) => (hasPath(parameters.edges, value, parameters.target) ? 'yes' : 'no'),
    sentence: (parameters) => `check whether a path exists from that node to node ${parameters.target} in the edges ${formatEdges(parameters.edges)}`,
    clause: 'the two nodes must be distinct and appear in the edges',
    report: {
      instruction: () => 'Report whether a path exists.',
      parseInstruction: (instruction) => {
        if (instruction !== 'Report whether a path exists.') {
          throw new Error('the statement does not ask whether a path exists');
        }
      },
      render: (answer) => `${answer}.`,
      phrase: (answer) => `${answer}`,
      ret: 'return current + ".";',
      probe: 'probe(current === "yes" || current === "no", "the answer must be yes or no");'
    }
  },
  // Probability over the list at this stage: count the outcomes divisible by the
  // stated divisor, divide by the total, and reduce. The divisor is its own slot
  // (`favourableDivisor`) rather than the filter's, so a chain that first keeps
  // multiples of one divisor and then asks for the probability of another does not
  // collapse onto certainty. The answer is a reduced fraction (or a whole number
  // when the fraction is whole), so 'answer'.
  probability: {
    takes: 'list',
    returns: 'answer',
    apply: (values, parameters) => reduceFraction(values.filter((value) => value % parameters.favourableDivisor === 0).length, values.length),
    sentence: (parameters) => `count the outcomes divisible by ${parameters.favourableDivisor} and divide by the total`,
    clause: 'some but not all outcomes must be favourable',
    report: {
      instruction: () => 'Report the probability as a reduced fraction.',
      parseInstruction: (instruction) => {
        if (instruction !== 'Report the probability as a reduced fraction.') {
          throw new Error('the statement does not ask for the probability');
        }
      },
      render: (answer) => `${answer}.`,
      phrase: (answer) => `${answer}`,
      ret: 'return current + ".";',
      probe: 'probe(typeof current === "string" && /^\\d+(\\/\\d+)?$/.test(current), "the answer must be a reduced fraction");'
    }
  },
  // Two-dimensional geometry: the area of a rectangle whose length is the chain
  // value and whose width is the second literal the sentence states.
  rectangleArea: {
    takes: 'scalar',
    returns: 'scalar',
    apply: (value, parameters) => value * parameters.width,
    sentence: (parameters) => `take the area of a rectangle that is ${parameters.width} wide`,
    clause: 'the width must be a whole number, so the area is whole'
  }
});

/** The English ordinal of a rank: 1 -> first, 2 -> second, 3 -> third, and so on. */
function ordinal(n) {
  const names = { 1: 'first', 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth' };
  return names[n] ?? `${n}th`;
}

/** The stated edge list as prose: [[12, 15], [15, 8]] -> "12-15, 15-8". */
function formatEdges(edges) {
  return edges.map((edge) => `${edge[0]}-${edge[1]}`).join(', ');
}

/** The prose edge list back to pairs of numbers, the inverse of `formatEdges`. */
function parseEdges(text) {
  return text.split(', ').map((pair) => pair.split('-').map(Number));
}

/** The greatest common divisor of two whole numbers, by Euclid's algorithm. */
function gcd(left, right) {
  let a = left;
  let b = right;
  while (b !== 0) {
    const remainder = b;
    b = a % b;
    a = remainder;
  }
  return a;
}

/** A reduced fraction as text: 2/8 -> "1/4", and a whole result as "1". */
function reduceFraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  const reducedNumerator = numerator / divisor;
  const reducedDenominator = denominator / divisor;
  return reducedDenominator === 1 ? String(reducedNumerator) : `${reducedNumerator}/${reducedDenominator}`;
}

/** Whether an undirected path joins `from` to `to` over the stated edge list. */
function hasPath(edges, from, to) {
  const adjacency = new Map();
  for (const [left, right] of edges) {
    if (!adjacency.has(left)) adjacency.set(left, []);
    if (!adjacency.has(right)) adjacency.set(right, []);
    adjacency.get(left).push(right);
    adjacency.get(right).push(left);
  }
  const seen = new Set([from]);
  const queue = [from];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === to) return true;
    for (const next of adjacency.get(node)) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return false;
}

/**
 * The declared inventory. Each entry is one composition, and the entry is the
 * authority: the family is derived from it, the plan fingerprint is its chain, and
 * the split is decided by whether its id is in `HELD_OUT`.
 */
export const COMPOSITIONS = Object.freeze([
  // Depth 2: the two halves of the filter decision, one operation each. These are
  // the pairs whose difference is a single word, and the only kind the contrastive
  // arm taught successfully (7 of 8 pairs), so they anchor the inventory.
  { id: 'above-total', chain: ['keepAbove', 'total'], depths: 2 },
  { id: 'below-total', chain: ['keepBelow', 'total'], depths: 2 },
  { id: 'above-count', chain: ['keepAbove', 'count'], depths: 2 },
  { id: 'below-count', chain: ['keepBelow', 'count'], depths: 2 },
  // Depth 3: an extreme chosen after the filter, then one arithmetic step. These
  // are the compositions the direction pair failed (0 of 8), so the inventory
  // gives them the coverage the contrastive families could not.
  { id: 'above-largest-double', chain: ['keepAbove', 'largest', 'double'], depths: 3 },
  { id: 'above-smallest-double', chain: ['keepAbove', 'smallest', 'double'], depths: 3 },
  { id: 'above-total-add-rate', chain: ['keepAbove', 'total', 'addRate'], depths: 3 },
  { id: 'above-total-subtract-rate', chain: ['keepAbove', 'total', 'subtractRate'], depths: 3 },
  { id: 'below-total-add-rate', chain: ['keepBelow', 'total', 'addRate'], depths: 3 },
  { id: 'below-largest-double', chain: ['keepBelow', 'largest', 'double'], depths: 3 },
  // Depth 4: two arithmetic steps after the filter, so the plan has a middle value
  // that only exists as an intermediate stage.
  { id: 'above-count-per-unit-add-rate', chain: ['keepAbove', 'count', 'perUnit', 'addRate'], depths: 4 },
  { id: 'above-largest-per-unit-subtract-rate', chain: ['keepAbove', 'largest', 'perUnit', 'subtractRate'], depths: 4 },
  { id: 'below-count-per-unit-add-rate', chain: ['keepBelow', 'count', 'perUnit', 'addRate'], depths: 4 },
  { id: 'below-total-double-subtract-rate', chain: ['keepBelow', 'total', 'double', 'subtractRate'], depths: 4 },
  { id: 'above-total-per-unit-add-rate', chain: ['keepAbove', 'total', 'perUnit', 'addRate'], depths: 4 },
  { id: 'above-smallest-per-unit-add-rate', chain: ['keepAbove', 'smallest', 'perUnit', 'addRate'], depths: 4 },
  // Depth 5: three arithmetic steps, the deepest composition the inventory carries,
  // so the held-out side has a composition no depth-4 family can imitate.
  { id: 'above-total-double-per-unit-add-rate', chain: ['keepAbove', 'total', 'double', 'perUnit', 'addRate'], depths: 5 },
  { id: 'below-largest-per-unit-double-add-rate', chain: ['keepBelow', 'largest', 'perUnit', 'double', 'addRate'], depths: 5 },
  // The four compositions the held-out side reserves, declared beside the rest so the
  // inventory is one list and the split is one set of ids. They are generated by the
  // same code as the trained entries and are separated only by `HELD_OUT`.
  { id: 'below-largest-add-rate', chain: ['keepBelow', 'largest', 'addRate'], depths: 3 },
  { id: 'above-count-double', chain: ['keepAbove', 'count', 'double'], depths: 3 },
  { id: 'below-total-per-unit-subtract-rate', chain: ['keepBelow', 'total', 'perUnit', 'subtractRate'], depths: 4 },
  { id: 'above-largest-add-rate', chain: ['keepAbove', 'largest', 'addRate'], depths: 3 },
  // The census compositions: the operations the books use and the eleven did not
  // cover, composed by the same declared-inventory discipline (evaluation/census.mjs).
  { id: 'keep-divisible-total', chain: ['keepDivisibleBy', 'total'], depths: 2 },
  { id: 'keep-divisible-count', chain: ['keepDivisibleBy', 'count'], depths: 2 },
  { id: 'above-unique-count', chain: ['keepAbove', 'uniqueCount'], depths: 2 },
  { id: 'above-total-percent', chain: ['keepAbove', 'total', 'percentOf'], depths: 3 },
  { id: 'above-total-ratio', chain: ['keepAbove', 'total', 'ratioPer'], depths: 3 },
  { id: 'above-total-discount', chain: ['keepAbove', 'total', 'discount'], depths: 3 },
  { id: 'above-second-largest', chain: ['keepAbove', 'nthLargest'], depths: 2, rank: 2 },
  { id: 'above-largest-square-area', chain: ['keepAbove', 'largest', 'squareArea'], depths: 3 },
  { id: 'above-total-modulo-add-rate', chain: ['keepAbove', 'total', 'modulo', 'addRate'], depths: 4 },
  { id: 'keep-divisible-total-percent', chain: ['keepDivisibleBy', 'total', 'percentOf'], depths: 3 },
  { id: 'above-unique-count-percent', chain: ['keepAbove', 'uniqueCount', 'percentOf'], depths: 3 },
  // The census compositions the held-out side reserves.
  { id: 'above-total-modulo', chain: ['keepAbove', 'total', 'modulo'], depths: 3 },
  { id: 'above-total-percent-discount', chain: ['keepAbove', 'total', 'percentOf', 'discount'], depths: 4 },
  { id: 'above-third-largest-percent', chain: ['keepAbove', 'nthLargest', 'percentOf'], depths: 3, rank: 3 },
  { id: 'keep-below-total-ratio', chain: ['keepBelow', 'total', 'ratioPer'], depths: 3 },
  // The tranche compositions: time arithmetic, graph traversal, probability, and
  // two-dimensional geometry, each chained three or four steps deep so the new
  // operators teach decomposition rather than a one-step completion.
  { id: 'above-divisible-probability', chain: ['keepAbove', 'keepDivisibleBy', 'probability'], depths: 3 },
  { id: 'above-count-neighbour-count', chain: ['keepAbove', 'count', 'neighbourCount'], depths: 3 },
  { id: 'above-count-neighbour-add-rate', chain: ['keepAbove', 'count', 'neighbourCount', 'addRate'], depths: 4 },
  { id: 'above-total-rectangle-area', chain: ['keepAbove', 'total', 'rectangleArea'], depths: 3 },
  { id: 'below-count-rectangle-add-rate', chain: ['keepBelow', 'count', 'rectangleArea', 'addRate'], depths: 4 },
  { id: 'above-total-elapsed', chain: ['keepAbove', 'total', 'elapsed'], depths: 3 },
  { id: 'below-count-elapsed-add-rate', chain: ['keepBelow', 'count', 'elapsed', 'addRate'], depths: 4 },
  { id: 'above-largest-path-exists', chain: ['keepAbove', 'largest', 'pathExists'], depths: 3 },
  // The tranche compositions the held-out side reserves, so the trainer never
  // sees these whole chains.
  { id: 'below-largest-path-exists', chain: ['keepBelow', 'largest', 'pathExists'], depths: 3 },
  { id: 'below-total-elapsed', chain: ['keepBelow', 'total', 'elapsed'], depths: 3 },
  { id: 'below-largest-rectangle-area', chain: ['keepBelow', 'largest', 'rectangleArea'], depths: 3 }
]);

/**
 * The compositions the training rows never use.
 *
 * The split is a property of the composition and not of the instance, which is the
 * whole point of declaring the inventory: every instance of a held-out entry is
 * held out, at every depth, so the evaluation rows are compositions the trainer
 * never saw in any form. Two entries per depth are reserved, which keeps the
 * held-out side from being a single depth's worth of material.
 */
export const HELD_OUT = Object.freeze([
  'below-largest-add-rate',
  'above-count-double',
  'below-total-per-unit-subtract-rate',
  'above-largest-add-rate',
  'above-total-modulo',
  'above-total-percent-discount',
  'above-third-largest-percent',
  'keep-below-total-ratio',
  'below-largest-path-exists',
  'below-total-elapsed',
  'below-largest-rectangle-area'
]);

/**
 * The pairs the inventory declares, so a family can say which composition it is
 * the sibling of. Two compositions are siblings when they differ in exactly one
 * operator, which is the distinction a sequence of statements must make learnable.
 */
export const COMPOSITION_PAIRS = Object.freeze([
  { kind: 'filter-direction-pair', members: ['above-total', 'below-total'], decisive: 'above against below' },
  { kind: 'aggregate-pair', members: ['above-total', 'above-count'], decisive: 'the total against the count' },
  { kind: 'extreme-pair', members: ['above-largest-double', 'above-smallest-double'], decisive: 'largest against smallest' },
  { kind: 'rate-direction-pair', members: ['above-total-add-rate', 'above-total-subtract-rate'], decisive: 'add against subtract' }
]);

export { OPERATORS };
export { formatEdges, parseEdges };

/**
 * Check the declared inventory before any family derives from it.
 *
 * A declared inventory is only worth what its entries guarantee, so each is
 * checked here rather than trusted: the chain must be well-typed end to end (a
 * list operator cannot read a scalar and the other way round), it must end on a
 * scalar so the answer is one number, every operator it names must exist, and no
 * two entries may share a chain, because two families with one plan would be one
 * composition counted twice and would also defeat the split.
 *
 * Called when the generator loads, exactly like the family checks of
 * `teacher/procedural/index.mjs`, so a broken inventory fails the build instead of
 * writing a dataset.
 */
export function assertInventoryIsWellFormed() {
  const seen = new Map();
  for (const composition of COMPOSITIONS) {
    if (composition.chain.length !== composition.depths) {
      throw new Error(`${composition.id}: the chain has ${composition.chain.length} operators but declares depth ${composition.depths}`);
    }
    let current = 'list';
    for (const [index, name] of composition.chain.entries()) {
      const operator = OPERATORS[name];
      if (operator === undefined) {
        throw new Error(`${composition.id}: step ${index + 1} names the unknown operator "${name}"`);
      }
      if (operator.takes !== current) {
        throw new Error(`${composition.id}: step ${index + 1} (${name}) reads a ${operator.takes} but the chain carries a ${current}`);
      }
      current = operator.returns;
    }
    if (current !== 'scalar' && current !== 'answer') {
      throw new Error(`${composition.id}: the chain ends on a ${current}, so the answer would not be one value`);
    }
    const key = composition.chain.join('>');
    if (seen.has(key)) {
      throw new Error(`${composition.id} and ${seen.get(key)} declare the same chain, so they are one composition`);
    }
    seen.set(key, composition.id);
  }
  for (const id of HELD_OUT) {
    if (!COMPOSITIONS.some((composition) => composition.id === id)) {
      throw new Error(`the held-out list names "${id}", which is not a declared composition`);
    }
  }
  for (const pair of COMPOSITION_PAIRS) {
    for (const member of pair.members) {
      if (!COMPOSITIONS.some((composition) => composition.id === member)) {
        throw new Error(`the pair ${pair.kind} names "${member}", which is not a declared composition`);
      }
    }
  }
  return { compositions: COMPOSITIONS.length, heldOut: HELD_OUT.length, pairs: COMPOSITION_PAIRS.length };
}
