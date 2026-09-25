/**
 * Family N12 of the world seed book: genealogy and generations.
 *
 * Every problem states a handful of parent links ("Maya is a parent of Noah")
 * and asks for the family relation between two named people. Under the stated
 * simplified model a direct link is a parent, two upward links are a
 * grandparent, people who share a parent are siblings, and children of siblings
 * are cousins.
 *
 * The four grades share one computation over the same stated genealogy; grades
 * 2 to 4 append a cross-domain check, which the family renders as the labelled
 * answer suffix through the shared `renderCrossDomain`.
 */

import { slugify } from '../../naming.mjs';
import {
  blocksOf,
  stripCrossDomain,
  parseCrossDomain,
  renderCrossDomain,
  CROSS_DOMAIN_SOURCE
} from './shared.mjs';

const LINK_PATTERN = /([A-Z][A-Za-z]+) is (?:also )?a parent of ([A-Z][A-Za-z]+)/g;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const links = [];
  for (const match of facts.matchAll(LINK_PATTERN)) {
    links.push({ parent: match[1], child: match[2] });
  }
  if (links.length === 0) {
    throw new Error('the statement states no parent link');
  }
  const task = /relation between ([A-Z][A-Za-z]+) and ([A-Z][A-Za-z]+)/.exec(blocks.Task);
  if (task === null) {
    throw new Error('the task does not ask for the relation between two named people');
  }
  return {
    links,
    subject: task[1],
    object: task[2],
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

/** The parents and the children of every named person, as plain lookup maps. */
function familyOf(links) {
  const parents = new Map();
  const children = new Map();
  const remember = (map, key, value) => {
    if (!map.has(key)) {
      map.set(key, new Set());
    }
    map.get(key).add(value);
  };
  for (const link of links) {
    remember(parents, link.child, link.parent);
    remember(children, link.parent, link.child);
  }
  return { parents, children };
}

/** Every person `levels` parent-links below `person`. */
function descendantsAt(children, person, levels) {
  let frontier = new Set([person]);
  for (let step = 0; step < levels; step += 1) {
    const next = new Set();
    for (const current of frontier) {
      for (const child of children.get(current) ?? []) {
        next.add(child);
      }
    }
    frontier = next;
  }
  return frontier;
}

/** Whether the two people share at least one parent. */
function shareParent(parents, left, right) {
  const leftParents = parents.get(left) ?? new Set();
  for (const parent of parents.get(right) ?? []) {
    if (leftParents.has(parent)) {
      return true;
    }
  }
  return false;
}

function relationPhrase(slots) {
  const { parents, children } = familyOf(slots.links);
  const left = slots.subject;
  const right = slots.object;
  const leftParents = parents.get(left) ?? new Set();
  const rightParents = parents.get(right) ?? new Set();
  if (leftParents.has(right)) {
    return `${right} is a parent of ${left}.`;
  }
  if (rightParents.has(left)) {
    return `${left} is a parent of ${right}.`;
  }
  if (descendantsAt(children, left, 2).has(right)) {
    return `${left} is a grandparent of ${right}.`;
  }
  if (descendantsAt(children, right, 2).has(left)) {
    return `${right} is a grandparent of ${left}.`;
  }
  if (shareParent(parents, left, right)) {
    return `${left} and ${right} are siblings.`;
  }
  for (const leftParent of leftParents) {
    for (const rightParent of rightParents) {
      if (leftParent !== rightParent && shareParent(parents, leftParent, rightParent)) {
        return `${left} and ${right} are cousins under the implied family tree.`;
      }
    }
  }
  throw new Error(`the stated links do not determine the relation between ${left} and ${right}`);
}

function solve(slots) {
  return { relation: relationPhrase(slots), crossDomain: slots.crossDomain };
}

function render(solution) {
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? solution.relation : `${solution.relation} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'const parents = new Map();',
  'const children = new Map();',
  'const remember = (map, key, value) => {',
  '  if (!map.has(key)) {',
  '    map.set(key, new Set());',
  '  }',
  '  map.get(key).add(value);',
  '};',
  'for (const link of slots.links) {',
  '  remember(parents, link.child, link.parent);',
  '  remember(children, link.parent, link.child);',
  '}',
  'const descendantsAt = (person, levels) => {',
  '  let frontier = new Set([person]);',
  '  for (let step = 0; step < levels; step += 1) {',
  '    const next = new Set();',
  '    for (const current of frontier) {',
  '      for (const child of children.get(current) || []) {',
  '        next.add(child);',
  '      }',
  '    }',
  '    frontier = next;',
  '  }',
  '  return frontier;',
  '};',
  'const shareParent = (left, right) => {',
  '  const leftParents = parents.get(left) || new Set();',
  '  for (const parent of parents.get(right) || []) {',
  '    if (leftParents.has(parent)) {',
  '      return true;',
  '    }',
  '  }',
  '  return false;',
  '};',
  'const left = slots.subject;',
  'const right = slots.object;',
  'const leftParents = parents.get(left) || new Set();',
  'const rightParents = parents.get(right) || new Set();',
  'let relation = null;',
  'if (leftParents.has(right)) {',
  '  relation = right + " is a parent of " + left + ".";',
  '} else if (rightParents.has(left)) {',
  '  relation = left + " is a parent of " + right + ".";',
  '} else if (descendantsAt(left, 2).has(right)) {',
  '  relation = left + " is a grandparent of " + right + ".";',
  '} else if (descendantsAt(right, 2).has(left)) {',
  '  relation = right + " is a grandparent of " + left + ".";',
  '} else if (shareParent(left, right)) {',
  '  relation = left + " and " + right + " are siblings.";',
  '} else {',
  '  for (const leftParent of leftParents) {',
  '    for (const rightParent of rightParents) {',
  '      if (leftParent !== rightParent && shareParent(leftParent, rightParent)) {',
  '        relation = left + " and " + right + " are cousins under the implied family tree.";',
  '      }',
  '    }',
  '  }',
  '}',
  'probe(relation !== null, "the stated links must determine the relation between the two named people");',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? relation : relation + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const parentLinks = slots.links.length;
  return [
    `Read the ${parentLinks} stated parent links and treat them as a directed graph from parent to child.`,
    `Trace the paths between ${slots.subject} and ${slots.object}: a direct link is a parent, two upward links are a grandparent, and a shared parent makes siblings.`,
    `The stated links produce: ${solution.relation}`,
    ...(slots.crossDomain === null ? [] : ['The appended check is a separate arithmetic question, answered in the labelled suffix.'])
  ];
}

function caseFor(grade) {
  const template = `Genealogy and generations (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N12';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
