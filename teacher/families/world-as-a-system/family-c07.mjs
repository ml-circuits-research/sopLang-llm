/**
 * Family C7 of the world seed book: collective choice and preferences.
 *
 * Every problem states voter groups with complete rankings of the same three
 * public projects and asks for the winner of one pairwise contest. A voter
 * group prefers the option it ranks higher, so the contest counts the voters of
 * every group that ranks one option above the other and ignores the third
 * option. The answer names the winner with both totals, or prints a tie with
 * the two equal totals. Some variants of grades 2-4 append a cross-domain
 * check, which the family renders as the labelled answer suffix through the
 * shared `renderCrossDomain`.
 *
 * The four grades share one computation; the grade differences live in the
 * stated voter counts and in whether a cross-domain check is appended.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';

const GROUP_PATTERN = /(\d+) voters rank ([^;.]+)/g;
const CONTEST_PATTERN = /In a pairwise vote between (.+?) and (.+?), which option wins\?/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const groups = [];
  for (const match of facts.matchAll(GROUP_PATTERN)) {
    const ranking = match[2].split('>').map((option) => option.trim()).filter((option) => option !== '');
    if (ranking.length < 2) {
      throw new Error(`the voter group ranking "${match[2]}" does not order at least two options`);
    }
    groups.push({ voters: Number(match[1]), ranking });
  }
  if (groups.length === 0) {
    throw new Error('the statement states no voter group ranking');
  }
  const contest = CONTEST_PATTERN.exec(blocks.Task);
  if (contest === null) {
    throw new Error('the task does not state a pairwise contest');
  }
  return {
    options: [contest[1].trim(), contest[2].trim()],
    groups,
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  const [first, second] = slots.options;
  let firstVotes = 0;
  let secondVotes = 0;
  for (const group of slots.groups) {
    const left = group.ranking.indexOf(first);
    const right = group.ranking.indexOf(second);
    if (left === -1 || right === -1) {
      throw new Error(`the voter group ranking ${group.ranking.join('>')} does not name both ${first} and ${second}`);
    }
    if (left < right) {
      firstVotes += group.voters;
    } else {
      secondVotes += group.voters;
    }
  }
  if (firstVotes === secondVotes) {
    return { tie: true, winner: null, firstVotes, secondVotes, crossDomain: slots.crossDomain };
  }
  const winner = firstVotes > secondVotes ? first : second;
  return {
    tie: false,
    winner,
    firstVotes,
    secondVotes,
    winnerVotes: Math.max(firstVotes, secondVotes),
    loserVotes: Math.min(firstVotes, secondVotes),
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const main = solution.tie
    ? `tie ${solution.firstVotes}–${solution.secondVotes}.`
    : `${solution.winner} wins ${solution.winnerVotes} to ${solution.loserVotes}.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Array.isArray(slots.options) && slots.options.length === 2, "the task must name exactly two options of the contest");',
  'probe(Array.isArray(slots.groups) && slots.groups.length > 0, "the statement must state at least one voter group");',
  'let firstVotes = 0;',
  'let secondVotes = 0;',
  'for (const group of slots.groups) {',
  '  const left = group.ranking.indexOf(slots.options[0]);',
  '  const right = group.ranking.indexOf(slots.options[1]);',
  '  probe(left !== -1 && right !== -1, "every voter group must rank both options of the contest");',
  '  if (left < right) {',
  '    firstVotes += group.voters;',
  '  } else {',
  '    secondVotes += group.voters;',
  '  }',
  '}',
  'probe(firstVotes + secondVotes > 0, "the contest must count at least one voter");',
  'const main = firstVotes === secondVotes',
  '  ? "tie " + firstVotes + "–" + secondVotes + "."',
  '  : firstVotes > secondVotes',
  '    ? slots.options[0] + " wins " + firstVotes + " to " + secondVotes + "."',
  '    : slots.options[1] + " wins " + secondVotes + " to " + firstVotes + ".";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The contest is ${slots.options[0]} against ${slots.options[1]}, and each voter group gives all of its voters to the option it ranks higher.`,
    `Reading the ranked lists gives ${slots.options[0]}=${solution.firstVotes} and ${slots.options[1]}=${solution.secondVotes}, because the third option never enters this comparison.`,
    solution.tie
      ? 'Both options collect the same number of voters, so the pairwise majority ends in a tie.'
      : `The larger total belongs to ${solution.winner}, which therefore wins the pairwise contest.`
  ];
}

function caseFor(grade) {
  return {
    template: `Collective choice and preferences (grade ${grade})`,
    type: `collective-choice-and-preferences-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'C7';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
