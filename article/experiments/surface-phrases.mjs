/**
 * Surface rewrites of a procedural composition instance for experiment E2
 * (article/experiments/no-training-plan.md, "Generator or vocabulary").
 *
 * Every renderer here reads the slots the composition family drew or parsed and
 * states exactly those values: the same ledger, the same operator parameters, the
 * same order of operations, and the same requested report form. Only the wording
 * changes. The rungs are:
 *
 * - L1, paraphrase: the generator's structure (ledger, then a step list, then a
 *   report instruction) with different nouns, verbs, and sentence frames;
 * - L2, book style: a scenario sentence that carries the ledger, one distractor
 *   sentence with an irrelevant number, the operations as narrative prose in the
 *   order a person would explain them, and the question last;
 * - L3, book style without a procedure: the scenario and the distractor, then one
 *   question that names the quantity as a nested noun phrase, with no step list.
 *
 * Threshold wording is exact by construction: "above T", "greater than T", and
 * "discard every entry of T or less" all keep the values strictly greater than T,
 * and the mirrored phrases keep the values strictly smaller than T, which is what
 * `keepAbove` and `keepBelow` compute. Every choice among alternatives is drawn
 * from a seeded stream keyed by the instance and the rung, so a rebuild is
 * byte-identical. No English number word appears in a rewrite except the ordinal
 * of the `nthLargest` rank, which the original statement also spells out.
 */

import { formatEdges } from '../../teacher/procedural/compositions.mjs';
import { seededRandom, seedOf } from '../../teacher/procedural/random.mjs';

const ORDINALS = { 1: 'first', 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth' };
const PLACE_NOUNS = ['store', 'warehouse', 'stockroom'];
const RECORD_NOUNS = [['entry', 'entries'], ['reading', 'readings'], ['item', 'items']];
const KEEPERS = ['Priya', 'Mara', 'Daria', 'Luca', 'Ines', 'Tomas', 'Nadia', 'Ravi'];

/** The ordinal word of the `nthLargest` rank, the only number word a rewrite may carry. */
export function ordinalOf(nth) {
  const word = ORDINALS[nth];
  if (word === undefined) throw new Error(`no ordinal word for rank ${nth}`);
  return word;
}

function pick(random, values) {
  return values[Math.min(values.length - 1, Math.floor(random() * values.length))];
}

function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1);
}

/** The ledger as the generator prints it: "22, 35 and 8 tickets". */
function ledgerOf(slots) {
  const printed = slots.values.map(String);
  return `${printed.slice(0, -1).join(', ')} and ${printed.at(-1)} ${slots.unit}`;
}

/** The wording context of one instance at one rung, drawn once from a keyed stream. */
export function contextOf(key, slots) {
  const random = seededRandom(seedOf(key));
  const [recS, recP] = pick(random, RECORD_NOUNS);
  return {
    random,
    place: `${slots.depot.split(' ')[0]} ${pick(random, PLACE_NOUNS)}`,
    recS,
    recP,
    keeper: pick(random, KEEPERS)
  };
}

/** A distractor number that equals no number the statement already states. */
export function distractorOf(random, taken) {
  const used = new Set(taken);
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const value = 2 + Math.floor(random() * 98);
    if (!used.has(value)) return value;
  }
  throw new Error('no free distractor number');
}

function distractorSentence(context, value) {
  return pick(context.random, [
    `The ${context.place} also has ${value} parking spaces, which play no part in this question.`,
    `${context.keeper} has worked there for ${value} months, which does not affect the ${context.recP}.`,
    `The gate of the ${context.place} carries the number ${value}, which is irrelevant here.`
  ]);
}

/** L1 step phrases: one list of alternatives per operator, each stating its parameters exactly. */
const L1_STEPS = {
  keepAbove: (s, c) => [`discard every ${c.recS} of ${s.threshold} or less`, `keep only the ${c.recP} greater than ${s.threshold}`, `remove the ${c.recP} that are ${s.threshold} or lower`],
  keepBelow: (s, c) => [`discard every ${c.recS} of ${s.threshold} or more`, `keep only the ${c.recP} smaller than ${s.threshold}`, `remove the ${c.recP} that are ${s.threshold} or higher`],
  total: (s, c) => [`sum the remaining ${c.recP}`, `find the sum of the remaining ${c.recP}`],
  count: (s, c) => [`count how many ${c.recP} remain`, `find the number of remaining ${c.recP}`],
  largest: (s, c) => [`pick the biggest remaining ${c.recS}`, `find the maximum of the remaining ${c.recP}`],
  nthLargest: (s, c) => [`rank the remaining ${c.recP} from largest to smallest and take the ${ordinalOf(s.nth)} ${c.recS} in that ranking`, `find the ${ordinalOf(s.nth)} largest of the remaining ${c.recP}`],
  double: (s) => [`multiply the result by ${s.multiplier}`, `scale it up by a factor of ${s.multiplier}`],
  addRate: (s) => [`add the fixed fee of ${s.rate}`, `add a flat charge of ${s.rate}`, `increase it by the fixed amount of ${s.rate}`],
  subtractRate: (s) => [`subtract the fixed allowance of ${s.rate}`, `take away a flat deduction of ${s.rate}`, `reduce it by the fixed amount of ${s.rate}`],
  perUnit: (s, c) => [`multiply it by the ${s.perUnit} labels each ${c.recS} needs`, `scale it by the ${s.perUnit} labels that go on each ${c.recS}`],
  modulo: (s) => [`find the remainder when it is divided by ${s.divisor}`, `take the remainder left after dividing it by ${s.divisor}`],
  percentOf: (s) => [`take ${s.pct} percent of that`, `work out ${s.pct} percent of it`],
  discount: (s) => [`lower it by a ${s.pct} percent discount`, `apply a discount of ${s.pct} percent to it`],
  ratioPer: (s) => [`split it into ${s.divisor} equal shares and take the size of each share`, `divide it into ${s.divisor} equal parts and give the size of each part`],
  elapsed: (s) => [`turn it into ${s.label} by multiplying by ${s.per}`, `express it in ${s.label}, using a conversion factor of ${s.per}`],
  rectangleArea: (s) => [`find the area of a rectangle with that length and a width of ${s.width}`, `treat it as the length of a rectangle ${s.width} wide and compute the area`],
  pathExists: (s) => [`treat it as a node and check whether it can reach node ${s.target} along the undirected links ${formatEdges(s.edges)}`, `check whether the node with that number is connected to node ${s.target} through the undirected links ${formatEdges(s.edges)}`]
};

/** L2 narrative clauses: `who` performs one operation, in the third person. */
const L2_CLAUSES = {
  keepAbove: (s, c, who) => [`${who} sets aside every ${c.recS} of ${s.threshold} or less`, `${who} keeps only the ${c.recP} above ${s.threshold}`],
  keepBelow: (s, c, who) => [`${who} sets aside every ${c.recS} of ${s.threshold} or more`, `${who} keeps only the ${c.recP} below ${s.threshold}`],
  total: (s, c, who) => [`${who} adds up the ${c.recP} that remain`],
  count: (s, c, who) => [`${who} counts how many ${c.recP} remain`],
  largest: (s, c, who) => [`${who} picks out the largest remaining ${c.recS}`],
  nthLargest: (s, c, who) => [`${who} ranks the remaining ${c.recP} from largest to smallest and picks the ${ordinalOf(s.nth)} ${c.recS} in that order`],
  double: (s, c, who) => [`${who} multiplies that figure by ${s.multiplier}`],
  addRate: (s, c, who) => [`${who} adds a fixed charge of ${s.rate} to it`],
  subtractRate: (s, c, who) => [`${who} takes a fixed deduction of ${s.rate} off it`],
  perUnit: (s, c, who) => [`${who} multiplies it by the ${s.perUnit} labels each unit needs`],
  modulo: (s, c, who) => [`${who} divides it by ${s.divisor} and keeps only the remainder`],
  percentOf: (s, c, who) => [`${who} takes ${s.pct} percent of that figure`],
  discount: (s, c, who) => [`${who} applies a ${s.pct} percent discount to it`],
  ratioPer: (s, c, who) => [`${who} splits it into ${s.divisor} equal parts and looks at the size of each part`],
  elapsed: (s, c, who) => [`${who} converts it into ${s.label} with a conversion factor of ${s.per}`],
  rectangleArea: (s, c, who) => [`${who} treats it as the length of a rectangle that is ${s.width} wide and works out its area`],
  pathExists: (s, c, who) => [`${who} treats it as a node and checks whether a path connects it to node ${s.target} through the undirected links ${formatEdges(s.edges)}`]
};

/** L3 noun phrases: each operator wraps the phrase of the stage before it. */
const L3_PHRASES = {
  keepAbove: (s, c) => `${c.recP} above ${s.threshold}`,
  keepBelow: (s, c) => `${c.recP} below ${s.threshold}`,
  total: (s, c, x) => `the sum of the ${x}`,
  count: (s, c, x) => `the number of ${x}`,
  largest: (s, c, x) => `the largest of the ${x}`,
  nthLargest: (s, c, x) => `the ${ordinalOf(s.nth)}-largest of the ${x}`,
  double: (s, c, x) => `${s.multiplier} times ${x}`,
  addRate: (s, c, x) => `the result of adding a fixed charge of ${s.rate} to ${x}`,
  subtractRate: (s, c, x) => `the amount left after a fixed deduction of ${s.rate} is taken off ${x}`,
  perUnit: (s, c, x) => `the number of labels for ${x} at ${s.perUnit} labels per unit`,
  modulo: (s, c, x) => `the remainder when ${x} is divided by ${s.divisor}`,
  percentOf: (s, c, x) => `${s.pct} percent of ${x}`,
  discount: (s, c, x) => `the amount left after a ${s.pct} percent discount is taken off ${x}`,
  ratioPer: (s, c, x) => `the size of each part when ${x} is split into ${s.divisor} equal parts`,
  elapsed: (s, c, x) => `${x} expressed in ${s.label}, using a conversion factor of ${s.per}`,
  rectangleArea: (s, c, x) => `the area of a rectangle that is ${s.width} wide and whose length is ${x}`
};

function requireOperators(chain, table, rung) {
  for (const name of chain) {
    if (table[name] === undefined) throw new Error(`${rung}: no phrase for the operator ${name}`);
  }
}

/** The report instruction of L1: the generator's report semantics in other words. */
function l1Report(chain, slots, random) {
  const terminal = chain.at(-1);
  if (terminal === 'pathExists') return pick(random, ['State whether such a path exists.', 'Say whether a path exists.']);
  const unit = terminal === 'elapsed' ? slots.label : slots.unit;
  return pick(random, [`Give the result in ${unit}.`, `State the result in ${unit}.`]);
}

/** L1: the same structure as the generator, different nouns, verbs, and frames. */
export function renderL1(chain, slots, key) {
  requireOperators(chain, L1_STEPS, 'L1');
  const context = contextOf(key, slots);
  const ledger = pick(context.random, [
    `The ${context.place}'s ledger lists ${ledgerOf(slots)}.`,
    `At the ${context.place}, the stock sheet shows ${ledgerOf(slots)}.`,
    `The logbook of the ${context.place} holds ${ledgerOf(slots)}.`
  ]);
  const steps = chain.map((name) => pick(context.random, L1_STEPS[name](slots, context)));
  const procedure = pick(context.random, ['then', 'next']) === 'then'
    ? `${capitalize(steps.join(', then '))}.`
    : `Proceed as follows: ${steps.join('; next, ')}.`;
  return { statement: `${ledger} ${procedure} ${l1Report(chain, slots, context.random)}`, distractor: null };
}

const CONNECTORS = { 2: ['To begin,', 'Finally,'], 3: ['To begin,', 'Next,', 'Finally,'], 4: ['To begin,', 'Next,', 'After that,', 'Finally,'], 5: ['To begin,', 'Next,', 'After that,', 'Then,', 'Finally,'] };

function l2Question(chain, slots) {
  const terminal = chain.at(-1);
  if (terminal === 'pathExists') return 'Question. Is there such a path?';
  const unit = terminal === 'elapsed' ? slots.label : slots.unit;
  return `Question. What is the final figure, in ${unit}?`;
}

/** The numbers a statement must carry besides the distractor, used to keep the distractor distinct. */
function statedNumbers(slots) {
  const numbers = [...slots.values];
  for (const key of ['threshold', 'rate', 'perUnit', 'multiplier', 'divisor', 'pct', 'per', 'width', 'target', 'favourableDivisor']) {
    if (typeof slots[key] === 'number') numbers.push(slots[key]);
  }
  if (Array.isArray(slots.edges)) numbers.push(...slots.edges.flat());
  return numbers;
}

/** L2: scenario, distractor, the operations as narrative prose, and the question last. */
export function renderL2(chain, slots, key) {
  requireOperators(chain, L2_CLAUSES, 'L2');
  const context = contextOf(key, slots);
  const distractor = distractorOf(context.random, statedNumbers(slots));
  const connectors = CONNECTORS[chain.length];
  if (connectors === undefined) throw new Error(`L2: no connectors for a chain of ${chain.length}`);
  const sentences = chain.map((name, index) => {
    const who = index === 0 ? context.keeper : 'the keeper';
    return `${connectors[index]} ${pick(context.random, L2_CLAUSES[name](slots, context, who))}.`;
  });
  const statement = [
    `Scenario. During the weekly audit at the ${context.place}, ${context.keeper} listed ${context.recP} of ${ledgerOf(slots)}.`,
    distractorSentence(context, distractor),
    ...sentences,
    l2Question(chain, slots)
  ].join(' ');
  return { statement, distractor };
}

/** L3: scenario, distractor, and one question that names the quantity without a step list. */
export function renderL3(chain, slots, key) {
  const context = contextOf(key, slots);
  const distractor = distractorOf(context.random, statedNumbers(slots));
  const terminal = chain.at(-1);
  const body = terminal === 'pathExists' ? chain.slice(0, -1) : chain;
  requireOperators(body, L3_PHRASES, 'L3');
  let phrase = null;
  for (const name of body) phrase = L3_PHRASES[name](slots, context, phrase);
  let question;
  if (terminal === 'pathExists') {
    question = `Question. Is the node whose number is ${phrase} connected to node ${slots.target} through the undirected links ${formatEdges(slots.edges)}?`;
  } else {
    const unit = terminal === 'elapsed' ? slots.label : slots.unit;
    question = `Question. What is ${phrase}? Give the answer in ${unit}.`;
  }
  const statement = [
    `Scenario. At the ${context.place}, ${context.keeper} keeps a ledger of ${context.recP}: ${ledgerOf(slots)}.`,
    distractorSentence(context, distractor),
    question
  ].join(' ');
  return { statement, distractor };
}

export const RENDERERS = Object.freeze({ L1: renderL1, L2: renderL2, L3: renderL3 });
