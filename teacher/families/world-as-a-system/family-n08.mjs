/**
 * Family N8 of the world seed book: ecosystems and indirect effects.
 *
 * Every problem states a short food chain as `A eats B; B eats C` facts, the
 * classroom rule that a consumer may decrease when its food source sharply
 * decreases, and a task that names one population. The answer propagates the
 * qualitative decrease along the dependency arrows: the first consumer of the
 * named population decreases directly, and the consumers further down the chain
 * are affected indirectly. The source names the direct consumer and the
 * transitive consumers, and prints the upstream food source only in the worked
 * steps, never in the answer.
 *
 * Grades 2-4 additionally append a cross-domain check (distance, clock
 * arithmetic, quorum, duplicate reports, optionally with a map-sheet count),
 * which the family renders through the shared `renderCrossDomain`.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const RELATION_PATTERN = /Food relation:\s*([^.]*)\./;
const EATS_PATTERN = /([^;]+?)\s+eats\s+(.+)/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const relation = RELATION_PATTERN.exec(facts);
  if (relation === null) {
    throw new Error('the statement states no food relation');
  }
  const links = [];
  for (const clause of relation[1].split(';')) {
    const eats = EATS_PATTERN.exec(clause.trim());
    if (eats === null) {
      continue;
    }
    links.push({ consumer: eats[1].trim(), food: eats[2].trim() });
  }
  if (links.length === 0) {
    throw new Error('the food relation names no consumer');
  }
  const task = /If (.+?) sharply decreases/.exec(blocks.Task);
  if (task === null) {
    throw new Error('the task names no population that sharply decreases');
  }
  return { links, decreased: task[1].trim(), crossDomain: parseCrossDomain(blocks['Given facts']) };
}

/** The consumers of `name`, directly or transitively, in printed order. */
function consumersOf(slots, name) {
  const byFood = new Map();
  for (const link of slots.links) {
    if (!byFood.has(link.food)) {
      byFood.set(link.food, []);
    }
    byFood.get(link.food).push(link.consumer);
  }
  const seen = new Set([name]);
  const queue = [name];
  const consumers = [];
  while (queue.length > 0) {
    const current = queue.shift();
    for (const consumer of byFood.get(current) ?? []) {
      if (seen.has(consumer)) {
        continue;
      }
      seen.add(consumer);
      consumers.push(consumer);
      queue.push(consumer);
    }
  }
  return consumers;
}

function solve(slots) {
  const consumers = consumersOf(slots, slots.decreased);
  if (consumers.length < 2) {
    throw new Error('the stated chain does not reach an indirect population');
  }
  return {
    direct: consumers[0],
    indirect: consumers.slice(1),
    decreased: slots.decreased,
    crossDomain: slots.crossDomain
  };
}

function indirectPhrase(indirect) {
  const joined = indirect.length === 1 ? indirect[0] : `${indirect.slice(0, -1).join(', ')} and ${indirect[indirect.length - 1]}`;
  return `${joined} may be affected indirectly`;
}

function render(solution) {
  const main = `${solution.direct} may decrease directly and ${indirectPhrase(solution.indirect)}.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const WIRES = [
  {
    name: 'cross',
    command: 'jsEval',
    body: [
      CROSS_DOMAIN_SOURCE,
      'const slots = $slots;',
      'return { suffix: renderCrossDomain(slots.crossDomain) };'
    ].join('\n')
  },
  {
    name: 'consumers',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const byFood = new Map();',
      'for (const link of slots.links) {',
      '  if (!byFood.has(link.food)) {',
      '    byFood.set(link.food, []);',
      '  }',
      '  byFood.get(link.food).push(link.consumer);',
      '}',
      'const seen = new Set([slots.decreased]);',
      'const queue = [slots.decreased];',
      'const consumers = [];',
      'while (queue.length > 0) {',
      '  const current = queue.shift();',
      '  for (const consumer of byFood.get(current) || []) {',
      '    if (seen.has(consumer)) {',
      '      continue;',
      '    }',
      '    seen.add(consumer);',
      '    consumers.push(consumer);',
      '    queue.push(consumer);',
      '  }',
      '}',
      'return { direct: consumers[0], indirect: consumers.slice(1) };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const indirect = $consumers.indirect;',
  'const joined = indirect.length === 1 ? indirect[0] : indirect.slice(0, -1).join(", ") + " and " + indirect[indirect.length - 1];',
  'const main = $consumers.direct + " may decrease directly and " + joined + " may be affected indirectly.";',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `${solution.decreased} is a food source, so the stated rule lets its consumer ${solution.direct} decrease directly.`,
    `The chain continues from ${solution.direct}, so ${solution.indirect.join(' and ')} ${solution.indirect.length === 1 ? 'is' : 'are'} affected indirectly rather than directly.`,
    'The food of the named population lies upstream of the change, so the stated rule does not imply that it decreases for the same reason.',
    'The rule gives a directional possibility only; it carries no population numbers.'
  ];
}

function caseFor(grade) {
  const template = `Ecosystems and indirect effects (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N8';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
