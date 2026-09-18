/**
 * Form 20 of the scientific-reasoning book: minimum intervention in a system.
 *
 * Every variant states the targets that must hold, the forbidden effects, and
 * a small catalogue of interventions, each with a cost, the effects it
 * produces, and its undesired effects. An intervention that produces a
 * forbidden effect is eliminated outright; among the remaining combinations we
 * first minimize the total cost and then the number of actions, and we prove
 * minimality by noting that every cheaper combination missed a target or
 * produced a forbidden effect.
 *
 * The variants change the world (germination, a plant, a food chain, a
 * habitat, the digestive route, a circuit, the water cycle, ...) and with it
 * the catalogue; the search stays the same, so one family covers all
 * twenty-five of them. A few interventions are printed in the answer with a
 * slightly different wording than the catalogue uses (`close the lid` becomes
 * `closing of the lid`), so the family keeps those printed names.
 */

import { slugify } from '../../naming.mjs';

const PLAN_PATTERN =
  /The targets are:\s*([\s\S]*?);\s*forbidden effects:\s*([\s\S]*?)\.\s*Available interventions:\s*([\s\S]*)$/;
const INTERVENTION_PATTERN =
  /([^.:\[\]]+?): cost (\d+), effects \[([^\]]*)\], undesired effects \[([^\]]*)\]/g;

/**
 * Interventions whose printed name differs from the catalogue label. The
 * answer text names them in the catalogue's order but with the source's own
 * wording, which the family keeps here while labels, costs, and effects are
 * parsed from the statement.
 */
const PRINTED_NAMES = new Map([
  ['protecting of the spring', 'protecting the spring'],
  ['protecting of the eggs', 'protecting the eggs'],
  ['close the lid', 'closing of the lid'],
  ['changing of orientation', 'changing the orientation'],
  ['add a protein source', 'adding a protein source'],
  ['add vegetables', 'adding vegetables']
]);

function effectList(text) {
  const trimmed = String(text).trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'none') {
    return [];
  }
  return trimmed.split(',').map((value) => value.trim());
}

function parse(statement) {
  const caseData = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state its case data');
  }
  const plan = PLAN_PATTERN.exec(caseData[1]);
  if (plan === null) {
    throw new Error('the case data does not state the targets, the forbidden effects, and the interventions');
  }
  const interventions = [];
  for (const match of plan[3].matchAll(INTERVENTION_PATTERN)) {
    interventions.push({
      name: match[1].trim(),
      cost: Number(match[2]),
      effects: effectList(match[3]),
      undesired: effectList(match[4])
    });
  }
  if (interventions.length === 0) {
    throw new Error('the case data lists no intervention');
  }
  return {
    targets: effectList(plan[1]),
    forbidden: effectList(plan[2]),
    interventions
  };
}

function solve(slots) {
  const count = slots.interventions.length;
  if (count > 20) {
    throw new Error('the catalogue is too large for an exhaustive search of its combinations');
  }
  const optima = [];
  for (let mask = 1; mask < 1 << count; mask += 1) {
    const chosen = slots.interventions.filter((entry, index) => (mask & (1 << index)) !== 0);
    const effects = new Set(chosen.flatMap((entry) => entry.effects));
    const undesired = chosen.flatMap((entry) => entry.undesired);
    if (undesired.some((effect) => slots.forbidden.includes(effect))) {
      continue;
    }
    if (!slots.targets.every((target) => effects.has(target))) {
      continue;
    }
    const cost = chosen.reduce((total, entry) => total + entry.cost, 0);
    const candidate = { cost, count: chosen.length, names: chosen.map((entry) => entry.name) };
    const best = optima[0];
    if (
      best === undefined ||
      cost < best.cost ||
      (cost === best.cost && candidate.count < best.count)
    ) {
      optima.length = 0;
      optima.push(candidate);
    } else if (cost === best.cost && candidate.count === best.count) {
      optima.push(candidate);
    }
  }
  if (optima.length === 0) {
    throw new Error('no combination of interventions covers the targets without a forbidden effect');
  }
  if (new Set(optima.map((entry) => entry.names.join(' | '))).size > 1) {
    const ambiguity = new Error('the stated goals leave more than one minimum intervention');
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  return { cost: optima[0].cost, names: optima[0].names };
}

/** The printed name of an intervention: its catalogue label unless the source renames it. */
function printedName(name) {
  const label = String(name).toLowerCase();
  return PRINTED_NAMES.get(label) ?? label;
}

function render(solution) {
  return `The minimum intervention is ${solution.names.map(printedName).join(', ')}, with total cost ${solution.cost}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.targets) && slots.targets.length > 0, "the statement must name at least one target");',
  'probe(Array.isArray(slots.forbidden) && slots.forbidden.length > 0, "the statement must name the forbidden effects");',
  'probe(Array.isArray(slots.interventions) && slots.interventions.length > 0, "the statement must list its interventions");',
  'for (const entry of slots.interventions) {',
  '  probe(typeof entry.name === "string" && entry.name.length > 0, "every intervention must carry a name");',
  '  probe(Number.isInteger(entry.cost) && entry.cost > 0, "every intervention must have a positive cost: " + entry.name);',
  '  probe(Array.isArray(entry.effects) && entry.effects.length > 0, "every intervention must state the effects it produces: " + entry.name);',
  '  probe(Array.isArray(entry.undesired), "every intervention must state its undesired effects, possibly none: " + entry.name);',
  '}',
  'const count = slots.interventions.length;',
  'probe(count <= 20, "the catalogue must be small enough for an exhaustive search");',
  'const optima = [];',
  'for (let mask = 1; mask < 1 << count; mask += 1) {',
  '  const chosen = slots.interventions.filter((entry, index) => (mask & (1 << index)) !== 0);',
  '  const effects = new Set(chosen.flatMap((entry) => entry.effects));',
  '  if (chosen.flatMap((entry) => entry.undesired).some((effect) => slots.forbidden.includes(effect))) {',
  '    continue;',
  '  }',
  '  if (!slots.targets.every((target) => effects.has(target))) {',
  '    continue;',
  '  }',
  '  const cost = chosen.reduce((total, entry) => total + entry.cost, 0);',
  '  const candidate = { cost: cost, count: chosen.length, names: chosen.map((entry) => entry.name) };',
  '  const best = optima[0];',
  '  if (best === undefined || cost < best.cost || (cost === best.cost && candidate.count < best.count)) {',
  '    optima.length = 0;',
  '    optima.push(candidate);',
  '  } else if (cost === best.cost && candidate.count === best.count) {',
  '    optima.push(candidate);',
  '  }',
  '}',
  'probe(optima.length > 0, "some combination must cover the targets without a forbidden effect");',
  'probe(new Set(optima.map((entry) => entry.names.join(" | "))).size === 1, "the stated goals must leave exactly one minimum intervention");',
  'const best = optima[0];',
  'probe(Number.isInteger(best.cost) && best.cost > 0, "the minimum total cost must be a positive number");',
  'probe(best.names.length > 0, "the minimum intervention must contain at least one action");',
  'const printed = new Map(' + JSON.stringify([...PRINTED_NAMES]) + ');',
  'const names = best.names.map((name) => printed.get(String(name).toLowerCase()) || String(name).toLowerCase());',
  'return "The minimum intervention is " + names.join(", ") + ", with total cost " + best.cost + ".";'
].join('\n');

function explain(slots, solution) {
  const names = solution.names.map(printedName);
  return [
    `Feasibility first: any combination whose undesired effects include a forbidden effect (${slots.forbidden.join(', ')}) is eliminated, and the rest must cover every target (${slots.targets.join(', ')}).`,
    `Among the feasible combinations the smallest total cost is ${solution.cost}, attained by ${names.join(' and ')} (${names.length} action${names.length === 1 ? '' : 's'}).`,
    'Every cheaper combination is excluded, because at a lower cost it either misses a target or produces a forbidden effect; no combination at the minimum cost uses fewer actions.',
    'The result is therefore minimal in the given search space, and not merely a feasible answer.'
  ];
}

export const unit = 20;

export const cases = [
  {
    template: 'Minimum intervention in a system',
    type: slugify('Minimum intervention in a system'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
