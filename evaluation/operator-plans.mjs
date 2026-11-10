/**
 * Operator plans: the highest abstraction level measured in the evaluation-only comparison.
 *
 * The model does not write code. It names a sequence of operations from a fixed catalogue (the
 * operators of the procedural composition inventory) and supplies the values and parameters it
 * extracts; this module executes the plan with the operators' own implementations and formats the
 * answer with the terminal operator's report, so the output convention belongs to the language,
 * not to the model. It is an evaluation harness, not a runtime command: SOP Lang semantics are
 * unchanged.
 */
import { OPERATORS, COMPOSITIONS } from '../teacher/procedural/compositions.mjs';
import { compositionFamily } from '../teacher/procedural/composition-families.mjs';
import { seededRandom } from '../teacher/procedural/random.mjs';

const PARAMETERS = {
  keepAbove: 'threshold', keepBelow: 'threshold', double: 'multiplier', addRate: 'rate', subtractRate: 'rate',
  perUnit: 'perUnit', keepDivisibleBy: 'divisor', modulo: 'divisor', percentOf: 'pct', ratioPer: 'divisor', discount: 'pct',
  nthLargest: 'nth', elapsed: 'per, label ("minutes" or "hours")', neighbourCount: 'edges (list of [a, b] pairs)',
  pathExists: 'edges (list of [a, b] pairs), target', probability: 'favourableDivisor', rectangleArea: 'width'
};
const MEANING = {
  keepAbove: 'keep the values strictly greater than threshold', keepBelow: 'keep the values strictly less than threshold',
  total: 'sum of the list', count: 'number of items in the list', largest: 'largest item', smallest: 'smallest item',
  double: 'multiply by multiplier', addRate: 'add rate', subtractRate: 'subtract rate', perUnit: 'multiply by perUnit',
  keepDivisibleBy: 'keep the values divisible by divisor', modulo: 'remainder after dividing by divisor', uniqueCount: 'number of distinct values',
  percentOf: 'pct percent of the value', ratioPer: 'divide the value into divisor equal parts (the size of one part)', discount: 'reduce the value by pct percent',
  nthLargest: 'the nth largest item of the list (repeated values count separately)', squareArea: 'area of a square with that side',
  elapsed: 'multiply by per and report in label', neighbourCount: 'number of neighbours of the node equal to the value, in edges',
  pathExists: 'yes or no: is the node equal to the value connected to target through edges', probability: 'fraction of the list divisible by favourableDivisor',
  rectangleArea: 'area of a rectangle with length equal to the value and the given width'
};
export const CATALOGUE = Object.entries(OPERATORS).map(([name, op]) =>
  `- ${name} (${op.takes} -> ${op.returns === 'answer' ? 'final answer' : op.returns})${PARAMETERS[name] ? `, parameters: ${PARAMETERS[name]}` : ''}: ${MEANING[name] ?? ''}`).join('\n');

export const OPS_SYSTEM = [
  'You translate a problem into a plan of named operations. Do not write code and do not compute the answer yourself.',
  'Reply with exactly one ```json code block: {"values": [the list of recorded values], "unit": "the unit word", "steps": [{"op": "<name>", <parameters>}, ...]}.',
  'The steps run in order: the first step reads the list of values, each later step reads the result of the previous one.',
  'Available operations:\n' + CATALOGUE
].join('\n');

function exampleFor(id, seed) {
  const composition = COMPOSITIONS.find((entry) => entry.id === id);
  const family = compositionFamily(composition);
  const slots = family.sample(seededRandom(seed));
  const steps = composition.chain.map((name) => {
    const step = { op: name };
    for (const key of (PARAMETERS[name] ?? '').split(',').map((part) => part.trim().split(' ')[0]).filter(Boolean)) step[key] = slots[key];
    return step;
  });
  return { statement: family.statement(slots), plan: JSON.stringify({ values: slots.values, unit: slots.unit, steps }) };
}
// Trained compositions only; none is held out and none is an E2 control.
export const OPS_EXAMPLES = [exampleFor('above-total-add-rate', 11), exampleFor('below-largest-double', 12), exampleFor('above-largest-path-exists', 13)];

/** Executes a plan reply; returns { className, answer, detail }. */
export function executePlan(completion) {
  const fence = /```(?:json)?\s*\n([\s\S]*?)```/.exec(completion ?? '');
  const text = fence ? fence[1] : (/\{[\s\S]*\}/.exec(completion ?? '') ?? [''])[0];
  let plan;
  try { plan = JSON.parse(text); } catch { return { className: 'parse_invalid', answer: null, detail: 'the reply is not a JSON plan' }; }
  if (!Array.isArray(plan?.values) || !Array.isArray(plan?.steps) || plan.steps.length === 0) return { className: 'parse_invalid', answer: null, detail: 'the plan lacks values or steps' };
  const unknown = plan.steps.find((step) => !OPERATORS[step?.op]);
  if (unknown) return { className: 'graph_invalid', answer: null, detail: `unknown operation ${unknown?.op}` };
  const slots = { values: plan.values, unit: plan.unit ?? 'units' };
  let current = plan.values;
  try {
    for (const step of plan.steps) {
      const { op, ...parameters } = step;
      Object.assign(slots, parameters);
      current = OPERATORS[op].apply(current, parameters);
    }
    if (current === undefined || (typeof current === 'number' && !Number.isFinite(current))) throw new Error('the plan produced no value');
  } catch (failure) {
    return { className: 'execution_error', answer: null, detail: failure.message };
  }
  const report = OPERATORS[plan.steps.at(-1).op].report;
  return { className: 'executed', answer: report ? report.render(current, slots) : `${current} units.`, detail: null };
}
