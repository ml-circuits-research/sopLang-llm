/**
 * Family C2 of the world seed book: rights as limits on decisions.
 *
 * Every problem states a council of `members` that votes `yes` to `no` for a
 * proposal, and the proposal removes one listed equal right from a named group.
 * The classroom constitution makes a decision valid only when both stages hold:
 * the vote must pass by simple majority, and the content must not remove a
 * protected right. The family therefore computes two predicates — did the
 * proposal win its vote, and does it violate the higher rights clause — and
 * prints the combined verdict.
 *
 * The four grades share one computation; the variants differ only in the data
 * they state (council size, vote counts, and the right the proposal removes),
 * so their cases share the same parse, solve, compute, and explain functions
 * and declare only their own printed template.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const VOTE_PATTERN = /A council of (\d+) members votes (\d+) to (\d+) for a proposal that (.+?)\. The classroom constitution/;
const RIGHT_PATTERN = /from the right to ([^.;]+)/;
const RIGHTS_CLAUSE_PATTERN = /may not remove the listed equal rights/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const vote = VOTE_PATTERN.exec(facts);
  if (vote === null) {
    throw new Error('the statement does not state a council vote for a proposal');
  }
  const proposal = vote[4].trim();
  const right = RIGHT_PATTERN.exec(proposal);
  if (right === null) {
    throw new Error('the proposal does not name the right it would remove');
  }
  return {
    members: Number(vote[1]),
    yes: Number(vote[2]),
    no: Number(vote[3]),
    proposal,
    right: right[1].trim(),
    removesRight: /would forbid\b/.test(proposal),
    protectsRights: RIGHTS_CLAUSE_PATTERN.test(facts),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  if (slots.yes + slots.no > slots.members) {
    throw new Error('the stated vote counts exceed the council size');
  }
  const majority = slots.yes > slots.no;
  const blocked = slots.removesRight && slots.protectsRights;
  if (slots.removesRight && !slots.protectsRights) {
    throw new Error('the statement removes a right without stating the higher rights clause');
  }
  return { majority, blocked, crossDomain: slots.crossDomain };
}

function verdictText(solution) {
  if (solution.majority) {
    return solution.blocked
      ? 'It received a majority, but it may not take effect under the stated rights rule.'
      : 'It received a majority, and it may take effect under the stated constitution.';
  }
  return solution.blocked
    ? 'It did not receive a majority, and it may not take effect under the stated rights rule.'
    : 'It did not receive a majority, so it may not take effect.';
}

function render(solution) {
  const main = verdictText(solution);
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
  }
];

const COMPUTE = [
  'const slots = $slots;',
  'const majority = slots.yes > slots.no;',
  'const blocked = slots.removesRight === true && slots.protectsRights === true;',
  'const main = majority ? (blocked ? "It received a majority, but it may not take effect under the stated rights rule." : "It received a majority, and it may take effect under the stated constitution.") : blocked ? "It did not receive a majority, and it may not take effect under the stated rights rule." : "It did not receive a majority, so it may not take effect.";',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The vote check compares the stated counts: ${slots.yes} against ${slots.no}, so the proposal ${solution.majority ? 'has' : 'does not have'} a simple majority of the votes cast.`,
    `The content check finds that the proposal ${slots.removesRight ? `would remove the protected right to ${slots.right}` : 'leaves every listed right in place'}, and the constitution ${slots.protectsRights ? 'places that right beyond ordinary majority power' : 'states no higher rights clause'}.`,
    `A decision must satisfy both stages, so the proposal ${solution.blocked ? 'may not take effect even though a vote was held' : 'is decided by the vote alone'}.`,
    'A passing vote is therefore necessary but not sufficient: the rights constraint can block a proposal that won its vote.'
  ];
}

function caseFor(grade) {
  const template = `Rights as limits on decisions (grade ${grade})`;
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

export const unit = 'C2';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
