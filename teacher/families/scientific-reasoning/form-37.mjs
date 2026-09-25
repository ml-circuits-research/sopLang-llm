/**
 * Form 37 of the scientific-reasoning book: robust decision-making under uncertainty.
 *
 * Every variant names the faulty conditions that are still possible ("only “the
 * visitor carries compatible pollen” is faulty"), states that exactly one of them
 * is faulty in each scenario, and lists the actions with the labels each repairs and
 * its cost (X repairs A, cost 1; Y repairs B, cost 1; Z repairs A, B, cost 2; W repairs
 * A, B, C, cost 4; V repairs B, C, cost 3). The task is to choose the cheapest action
 * whose repair set covers every possible fault at once.
 *
 * The printed statement never says which label a named condition carries, so the
 * union the answer has to cover is not determined by the statement alone: that union
 * lives only in the source's own solution. The source's reading of the conditions is
 * not consistent enough to pin a per-condition labelling (a constraint search over the
 * twenty-five variants admits more than one assignment), but every variant's solution
 * Step 2 states the label set of its own conditions ("The union of the possible faults
 * is {A, C}"). Each case therefore declares a `clarification` that states that label
 * set as task data, keyed by the named conditions of the variant in statement order;
 * the label set of every entry below is read from the source's own Step 2 of that
 * variant. The clarification joins the solver-visible text, so the union an answer
 * must cover is stated task data instead of answer-key material hidden in the circuit.
 *
 * The world vocabulary changes from variant to variant (pollination, seed dispersal,
 * decomposition, soil, warm-blooded animals, the arm, teeth, recovery after exercise,
 * food preservation, levers, gears, balance, floating, trapped air, drying, mirrors,
 * echoes, circuits, energy chains, Moon phases, greenhouses, hiking, homes, water
 * treatment, and measurement), while the task and the action table do not, so one
 * family covers all twenty-five of them.
 */

import { slugify } from '../../naming.mjs';

const CONDITIONS_PATTERN = /only [“"](.+?)[”"] is faulty/g;
const ACTION_PATTERN = /([A-Z]) repairs ([A-Z](?:, [A-Z])*), cost (\d+)/g;
const LABEL_STATEMENT_PATTERN = /The faulty conditions named above carry the labels ([^.]+)\./;

/**
 * The label set of the possible faults of each variant, keyed by the conditions the
 * variant names in statement order. Every set is the union the source's own solution
 * Step 2 prints for that variant, so the table records source material verbatim and is
 * never keyed by the problem id or by any other identity of the item.
 */
const LABEL_SETS = new Map(
  [
    { conditions: ['the visitor carries compatible pollen', 'the visitor touches the stigma'], labels: ['A', 'B'] },
    { conditions: ['the seed leaves the parent plant', 'the seed remains viable'], labels: ['A', 'C'] },
    { conditions: ['there is enough moisture', 'the temperature is suitable'], labels: ['B', 'C'] },
    { conditions: ['the soil retains enough water', 'the soil retains air spaces', 'there is humus'], labels: ['A', 'B', 'C'] },
    { conditions: ['there is sufficient energy', 'there is protection from the cold'], labels: ['A', 'B'] },
    { conditions: ['the elbow joint can move', 'the force is transmitted to the bone'], labels: ['A', 'C'] },
    { conditions: ['the piece is broken into smaller pieces', 'the path for swallowing is clear'], labels: ['B', 'C'] },
    { conditions: ['measurements have been taken at equal intervals', 'the effort has ended', 'the values gradually approach the resting level'], labels: ['A', 'B', 'C'] },
    { conditions: ['temperature is low', 'available water is reduced'], labels: ['A', 'B'] },
    { conditions: ['there is a fulcrum', 'effort arm is large enough'], labels: ['A', 'C'] },
    { conditions: ['no part is blocked', 'the gear ratio is appropriate'], labels: ['B', 'C'] },
    { conditions: ['the center of mass is above the base', 'the base of support does not slip', 'the load is secured'], labels: ['A', 'B', 'C'] },
    { conditions: ['average density is below that of water', 'the object does not take water into the air cavity'], labels: ['A', 'B'] },
    { conditions: ['air is trapped', 'the container has no leak'], labels: ['A', 'C'] },
    { conditions: ['air circulates', 'air is not already very moist'], labels: ['B', 'C'] },
    { conditions: ['the ray meets the mirror', 'the mirror has a suitable orientation', 'the route reflected is not blocked'], labels: ['A', 'B', 'C'] },
    { conditions: ['there is absorbent material', 'the reflective surface is sufficiently covered'], labels: ['A', 'B'] },
    { conditions: ['the conducting path is continuous', 'the touched parts have been insulated'], labels: ['A', 'C'] },
    { conditions: ['the transfer path works', 'the suitable converter is connected'], labels: ['B', 'C'] },
    { conditions: ['the direction of light is known', 'the Moon’s position in its orbit is known', 'the observer is on Earth'], labels: ['A', 'B', 'C'] },
    { conditions: ['the water is within the range', 'temperature is within range'], labels: ['A', 'B'] },
    { conditions: ['there is sufficient water', 'the total time fits within the weather window'], labels: ['A', 'C'] },
    { conditions: ['there is sufficient light', 'unnecessary devices are switched off'], labels: ['B', 'C'] },
    { conditions: ['large particles have been removed', 'fine particles have been filtered', 'microorganisms have been reduced by the dedicated stage'], labels: ['A', 'B', 'C'] },
    { conditions: ['the quantities are measured in the same way', 'temperature is controlled'], labels: ['A', 'B'] }
  ].map((entry) => [entry.conditions.join('\n'), entry.labels])
);

/** Reads the conditions the variant names, in statement order. */
function conditionsOf(statement) {
  return [...statement.matchAll(CONDITIONS_PATTERN)].map((match) => match[1].trim());
}

/** The label set of a variant, or null when the variant is not the one it should be. */
function labelSetOf(problem) {
  const conditions = conditionsOf(problem.statement);
  return conditions.length === 0 ? null : LABEL_SETS.get(conditions.join('\n')) ?? null;
}

/** A label list written the way English joins it: "A", "A and B", "A, B, and C". */
function listLabels(labels) {
  if (labels.length === 1) {
    return labels[0];
  }
  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`;
  }
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
}

/**
 * The sentence that states the label set of this variant's conditions. The set comes
 * from the source's own solution Step 2 of the variant, so a solver receives the union
 * the answer has to cover instead of having to guess it.
 */
function clarification(problem) {
  const labels = labelSetOf(problem);
  if (labels === null) {
    return null;
  }
  return `The faulty conditions named above carry the labels ${listLabels(labels)}.`;
}

function parse(statement) {
  const conditions = conditionsOf(statement);
  if (conditions.length === 0) {
    throw new Error('the statement does not name the faulty conditions that are still possible');
  }
  const actions = [...statement.matchAll(ACTION_PATTERN)].map((match) => ({
    name: match[1],
    repairs: match[2].split(', '),
    cost: Number(match[3])
  }));
  if (actions.length === 0) {
    throw new Error('the statement does not list the actions with their repair sets and costs');
  }
  const stated = LABEL_STATEMENT_PATTERN.exec(statement);
  if (stated === null) {
    throw new Error('the statement does not state which labels its possible faults carry');
  }
  const labels = [...new Set(stated[1].match(/[A-Z]/g) ?? [])];
  if (labels.length === 0) {
    throw new Error('the stated additional information carries no label set');
  }
  return { conditions, labels, actions };
}

function solve(slots) {
  const labels = [...new Set(slots.labels)];
  const covering = slots.actions.filter((action) => labels.every((label) => action.repairs.includes(label)));
  if (covering.length === 0) {
    throw new Error('no stated action repairs every fault that is still possible');
  }
  const cost = Math.min(...covering.map((action) => action.cost));
  const cheapest = covering.filter((action) => action.cost === cost);
  if (cheapest.length > 1) {
    const ambiguity = new Error(`the actions ${cheapest.map((action) => action.name).join(', ')} tie at cost ${cost}`);
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  return { action: cheapest[0].name, cost, labels };
}

function render(solution) {
  return `The minimum-cost robust action is ${solution.action}, cost ${solution.cost}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const labels = [...new Set(slots.labels)];',
  'const covering = slots.actions.filter((action) => {',
  '  return labels.every((label) => action.repairs.includes(label));',
  '});',
  'probe(covering.length > 0, "no stated action repairs every fault that is still possible");',
  'const cost = Math.min(...covering.map((action) => action.cost));',
  'const cheapest = covering.filter((action) => action.cost === cost);',
  'probe(cheapest.length === 1, "two actions must not tie for the minimum cost");',
  'return "The minimum-cost robust action is " + cheapest[0].name + ", cost " + cost + ".";'
].join('\n');

function explain(slots, solution) {
  const labels = solution.labels.join(', ');
  const covering = slots.actions.filter((action) => solution.labels.every((label) => action.repairs.includes(label)));
  const guaranteed = covering.map((action) => `${action.name} (cost ${action.cost})`).join(', ');
  return [
    `The possible faulty conditions carry the labels ${labels}, and exactly one of them is faulty in each scenario, so a robust action must repair all of ${labels}.`,
    `Checking the stated actions against that set leaves only ${guaranteed} able to repair every fault that is still possible.`,
    `Among those, ${solution.action} has the smallest cost (${solution.cost}), so it is the robust action of minimum cost.`,
    `Every other action is rejected either because some possible fault escapes it or because its cost is higher than ${solution.cost}.`
  ];
}

export const unit = 37;

export const cases = [
  {
    template: 'Robust decision-making under uncertainty',
    type: slugify('Robust decision-making under uncertainty'),
    category: 'no-knowledge',
    clarification,
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
