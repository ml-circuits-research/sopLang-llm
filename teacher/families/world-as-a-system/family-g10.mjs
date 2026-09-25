/**
 * Family G10 of the world seed book: regions, sets, and membership.
 *
 * Every problem states a containment chain from a locality up to a continent
 * and asks one of four questions: whether a unit is inside a larger one (by
 * transitivity), whether a stated containment may be reversed (it may not),
 * which larger units contain a unit, or whether sharing a country proves that
 * two cities share a region (it does not). From grade 3 on the facts add a
 * second city of the same country whose region is not stated; that sentence
 * states no containment, so the chain parser ignores it and it plays no role in
 * the answer. The four grades share one computation and declare only their own
 * printed template.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const CONTAINMENT_PATTERN = /([A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)*) is in ([A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)*)/g;

function questionOf(task) {
  const reversal = /Can we conclude that (.+?) is in (.+?)\?/.exec(task);
  if (reversal !== null) {
    return { kind: 'reversal', subject: reversal[1], object: reversal[2] };
  }
  const membership = /(?:^|[.?]\s*)Is (.+?) in (.+?)\?/.exec(task);
  if (membership !== null) {
    return { kind: 'membership', subject: membership[1], object: membership[2] };
  }
  const ancestors = /Which larger units contain (.+?)\?/.exec(task);
  if (ancestors !== null) {
    return { kind: 'ancestors', subject: ancestors[1], object: null };
  }
  const region = /Does being in (.+?) prove two cities share a region\?/.exec(task);
  if (region !== null) {
    return { kind: 'region', subject: region[1], object: null };
  }
  throw new Error('the task asks none of the containment questions of this family');
}

function parse(statement) {
  const blocks = blocksOf(statement);
  // "is in the continent of X" and "is in X" state the same containment, so the
  // chain is read from one normalized form.
  const facts = stripCrossDomain(blocks['Given facts']).replace(/ in the continent of /g, ' in ');
  const pairs = [...facts.matchAll(CONTAINMENT_PATTERN)].map((match) => ({ inner: match[1], outer: match[2] }));
  if (pairs.length === 0) {
    throw new Error('the facts state no containment');
  }
  return { pairs, question: questionOf(blocks.Task), crossDomain: parseCrossDomain(blocks['Given facts']) };
}

// The stated containments form a forest of chains, so each place has at most
// one stated container: walking that chain from a place yields its larger
// units in order, nearest first.
function chainOf(pairs, start) {
  const parent = new Map(pairs.map((pair) => [pair.inner, pair.outer]));
  const chain = [];
  const seen = new Set([start]);
  let node = start;
  while (parent.has(node)) {
    node = parent.get(node);
    if (seen.has(node)) {
      break;
    }
    seen.add(node);
    chain.push(node);
  }
  return chain;
}

function contains(pairs, inner, outer) {
  return chainOf(pairs, inner).includes(outer);
}

function solve(slots) {
  const question = slots.question;
  if (question.kind === 'membership') {
    if (!contains(slots.pairs, question.subject, question.object)) {
      throw new Error('the asked membership does not follow from the stated containment');
    }
    return { question, chain: chainOf(slots.pairs, question.subject), crossDomain: slots.crossDomain };
  }
  if (question.kind === 'reversal') {
    if (!contains(slots.pairs, question.object, question.subject)) {
      throw new Error('the reversed question does not reverse a stated containment');
    }
    return { question, chain: chainOf(slots.pairs, question.object), crossDomain: slots.crossDomain };
  }
  if (question.kind === 'ancestors') {
    const chain = chainOf(slots.pairs, question.subject);
    if (chain.length === 0) {
      throw new Error('the facts state no larger unit for the asked place');
    }
    return { question, chain, crossDomain: slots.crossDomain };
  }
  return { question, chain: [], crossDomain: slots.crossDomain };
}

// The printed list style of this family: nearest unit first, with the Oxford
// comma before the last one.
function listPhrase(items) {
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function render(solution) {
  const question = solution.question;
  let main;
  if (question.kind === 'membership') {
    main = `Yes, ${question.subject} is in ${question.object}.`;
  } else if (question.kind === 'reversal') {
    main = 'No. The containment relation cannot be reversed.';
  } else if (question.kind === 'ancestors') {
    main = `${listPhrase(solution.chain)}.`;
  } else {
    main = 'No. Country membership alone is insufficient to identify the region.';
  }
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const WIRES = [
  {
    name: 'main',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const parent = new Map(slots.pairs.map((pair) => [pair.inner, pair.outer]));',
      'const chainOf = (start) => {',
      '  const chain = [];',
      '  const seen = new Set([start]);',
      '  let node = start;',
      '  while (parent.has(node)) {',
      '    node = parent.get(node);',
      '    if (seen.has(node)) {',
      '      break;',
      '    }',
      '    seen.add(node);',
      '    chain.push(node);',
      '  }',
      '  return chain;',
      '};',
      'const contains = (inner, outer) => chainOf(inner).indexOf(outer) >= 0;',
      'const listPhrase = (items) => items.length === 1 ? items[0] : items.length === 2 ? items[0] + " and " + items[1] : items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];',
      'const question = slots.question;',
      'let main;',
      'if (question.kind === "membership") {',
      '  probe(contains(question.subject, question.object), "the asked membership must follow from the stated containment");',
      '  main = "Yes, " + question.subject + " is in " + question.object + ".";',
      '} else if (question.kind === "reversal") {',
      '  probe(contains(question.object, question.subject), "the reversed question must reverse a containment the facts state");',
      '  main = "No. The containment relation cannot be reversed.";',
      '} else if (question.kind === "ancestors") {',
      '  const chain = chainOf(question.subject);',
      '  probe(chain.length > 0, "the facts must state a larger unit for the asked place");',
      '  main = listPhrase(chain) + ".";',
      '} else {',
      '  main = "No. Country membership alone is insufficient to identify the region.";',
      '}',
      'return main;'
    ].join('\n')
  },
  {
    name: 'cross',
    command: 'jsEval',
    body: [
      CROSS_DOMAIN_SOURCE,
      'return { suffix: renderCrossDomain($slots.crossDomain) };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const suffix = $cross.suffix;',
  'return suffix === "" ? $main : $main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const question = solution.question;
  if (question.kind === 'membership') {
    return [
      `Read the stated chain of containments from ${question.subject} upward and apply transitivity at each step.`,
      `The chain reaches ${solution.chain.join(', ')}, so ${question.object} contains ${question.subject}.`,
      `Containment only runs from the smaller unit to the larger one, which is why the chain settles the query.`
    ];
  }
  if (question.kind === 'reversal') {
    return [
      `The facts state that ${question.object} is contained in ${question.subject}, directly or through a chain.`,
      `No stated rule infers the larger unit from the smaller one in the other direction.`,
      `The reversed claim is therefore unsupported and the answer is no.`
    ];
  }
  if (question.kind === 'ancestors') {
    return [
      `Read the direct container of ${question.subject} first.`,
      `Then propagate upward through the stated chain, which adds ${solution.chain.slice(1).join(', ')}.`,
      `Transitivity makes every unit on that chain a container of ${question.subject}, in that order.`
    ];
  }
  return [
    `The facts put two cities in ${question.subject}, but they state the region of only one of them.`,
    `Two cities can share a country while sitting in different regions, so country membership alone fixes nothing.`,
    `The question asks what the facts prove; the region of the second city stays unstated.`
  ];
}

function caseFor(grade) {
  const template = `Regions, sets, and membership (grade ${grade})`;
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

export const unit = 'G10';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
