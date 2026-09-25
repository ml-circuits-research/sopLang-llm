/**
 * Family H1 of the world seed book: ordering events.
 *
 * Every problem states a few `X happened before Y` / `X happened after Y` facts
 * about named events and asks two things: which relation between one pair must
 * hold, and whether the exact order of another pair can be determined. The
 * answer states the forced comparison and reports the second one as
 * undetermined. Grade 3 appends a cross-domain check to one variant, which the
 * family renders as the labelled answer suffix through the shared
 * `renderCrossDomain`. The four grades share one computation and declare only
 * their own printed template.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const EVENT = '[A-Z][A-Za-z]*(?: [a-z][A-Za-z]*)*';
const BEFORE_PATTERN = new RegExp(`(${EVENT}) happened before (${EVENT})`, 'g');
const AFTER_PATTERN = new RegExp(`(${EVENT}) happened after (${EVENT})`, 'g');

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const before = [...facts.matchAll(BEFORE_PATTERN)].map((match) => ({ earlier: match[1], later: match[2] }));
  const after = [...facts.matchAll(AFTER_PATTERN)].map((match) => ({ earlier: match[2], later: match[1] }));
  const pairs = [...before, ...after];
  if (pairs.length === 0) {
    throw new Error('the facts state no order between events');
  }
  const must = /What must be true about the order of (.+?) and (.+?)\?/.exec(blocks.Task);
  const determined = /Can the exact order of (.+?) and (.+?) be determined\?/.exec(blocks.Task);
  if (must === null || determined === null) {
    throw new Error('the task does not ask the two order questions of this family');
  }
  if (must[1] === must[2] || determined[1] === determined[2]) {
    throw new Error('a comparison must name two different events');
  }
  return {
    pairs,
    must: { first: must[1], second: must[2] },
    determined: { first: determined[1], second: determined[2] },
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

// "Before" is transitive: the stated pairs are the edges of a partial order, and
// reachability in that order is the relation the facts force. Two events none of
// whose edges link them stay incomparable.
function reaches(pairs, from, to) {
  const edges = new Map();
  for (const pair of pairs) {
    if (!edges.has(pair.earlier)) {
      edges.set(pair.earlier, []);
    }
    edges.get(pair.earlier).push(pair.later);
  }
  const seen = new Set([from]);
  const queue = [from];
  while (queue.length > 0) {
    const node = queue.shift();
    for (const next of edges.get(node) ?? []) {
      if (next === to) {
        return true;
      }
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return false;
}

function solve(slots) {
  const { must, determined } = slots;
  const forced = reaches(slots.pairs, must.first, must.second)
    ? [must.first, must.second]
    : reaches(slots.pairs, must.second, must.first)
      ? [must.second, must.first]
      : null;
  if (forced === null) {
    throw new Error('the questioned pair is not ordered by the stated facts');
  }
  if (reaches(slots.pairs, determined.first, determined.second) || reaches(slots.pairs, determined.second, determined.first)) {
    throw new Error('the second questioned pair is determined by the stated facts');
  }
  return {
    must: { earlier: forced[0], later: forced[1] },
    determined,
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const main = `${solution.must.earlier} must be before ${solution.must.later}. The relative order of ${solution.determined.first} and ${solution.determined.second} cannot be determined from the given facts.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const WIRES = [
  {
    name: 'order',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const edges = new Map();',
      'for (const pair of slots.pairs) {',
      '  if (!edges.has(pair.earlier)) {',
      '    edges.set(pair.earlier, []);',
      '  }',
      '  edges.get(pair.earlier).push(pair.later);',
      '}',
      'const reaches = (from, to) => {',
      '  const seen = new Set([from]);',
      '  const queue = [from];',
      '  while (queue.length > 0) {',
      '    const node = queue.shift();',
      '    for (const next of edges.get(node) || []) {',
      '      if (next === to) {',
      '        return true;',
      '      }',
      '      if (!seen.has(next)) {',
      '        seen.add(next);',
      '        queue.push(next);',
      '      }',
      '    }',
      '  }',
      '  return false;',
      '};',
      'const earlier = reaches(slots.must.first, slots.must.second) ? slots.must.first : reaches(slots.must.second, slots.must.first) ? slots.must.second : null;',
      'probe(earlier !== null, "the first questioned pair must be ordered by the stated facts");',
      'probe(!reaches(slots.determined.first, slots.determined.second) && !reaches(slots.determined.second, slots.determined.first), "the second questioned pair must stay undetermined");',
      'return { earlier: earlier, later: earlier === slots.must.first ? slots.must.second : slots.must.first };'
    ].join('\n')
  },
  {
    name: 'cross',
    command: 'jsEval',
    body: [
      CROSS_DOMAIN_SOURCE,
      'const slots = $slots;',
      'return { suffix: renderCrossDomain(slots.crossDomain) };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const main = $order.earlier + " must be before " + $order.later + ". The relative order of " + $slots.determined.first + " and " + $slots.determined.second + " cannot be determined from the given facts.";',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The stated facts are edges of a partial order on the events, and "before" is transitive.`,
    `Chaining the stated facts links ${solution.must.earlier} to ${solution.must.later}, so that order is forced.`,
    `No chain of stated facts links ${solution.determined.first} and ${solution.determined.second} in either direction, so the facts leave their order open.`,
    `A relation that no chain of facts forces is reported as undetermined rather than assumed.`
  ];
}

function caseFor(grade) {
  const template = `Ordering events (grade ${grade})`;
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

export const unit = 'H1';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
