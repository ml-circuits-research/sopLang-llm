/**
 * Section 86 of the adult-reasoning course: a declared conflict of interest.
 *
 * Every variant prints a committee rule with two parts — whoever holds a direct
 * money interest in a topic does not vote that topic, but may still speak — and
 * then puts a member who sells the very goods under decision in front of the
 * vote. The verdict applies the closed rule literally: the sale is a direct
 * money interest, so the member stays silent in the vote while keeping the
 * floor. The cases change the committee place and the member, so the family
 * derives the two clauses from the parsed names and the matched topic.
 */

import { slugify } from '../../naming.mjs';

const RULE_PATTERN = /Committee, ([^:]+): “Whoever has a direct money interest in a topic does not vote the topic\. May speak\.”/;
const MEMBER_PATTERN = /([A-Z][a-z]+) sells ([a-z]+)\./;
const VOTE_PATTERN = /The committee votes which ([a-z]+) firm/;

function parse(statement) {
  const rule = RULE_PATTERN.exec(statement);
  const member = MEMBER_PATTERN.exec(statement);
  const vote = VOTE_PATTERN.exec(statement);
  if (rule === null || member === null || vote === null) {
    throw new Error('the statement does not hold the committee rule, the member, and the voted topic');
  }
  const sold = member[2];
  const voted = vote[1];
  return {
    place: rule[1],
    member: member[1],
    soldItem: sold,
    votedTopic: `${voted} firm`,
    interestMatchesTopic: sold === voted
  };
}

function solve(slots) {
  if (!slots.interestMatchesTopic) {
    throw new Error('the member sells goods outside the voted topic, which is not this section pattern');
  }
  return {
    voteClause: slots.interestMatchesTopic ? 'Does not vote.' : 'May vote.',
    speakClause: 'May speak.'
  };
}

function render(solution) {
  return `${solution.voteClause} ${solution.speakClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const voteClause = slots.interestMatchesTopic ? "Does not vote." : "May vote.";',
  'return voteClause + " May speak.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The rule of the ${slots.place} committee removes the vote from whoever holds a direct money interest in the topic, and it grants the right to speak in the same sentence.`,
    `${slots.member} sells ${slots.soldItem}, and the committee votes which ${slots.votedTopic} to use, so the sale is a direct money interest in the topic under decision.`,
    `The first clause therefore applies as written: ${slots.member} does not vote.`,
    `The second clause is untouched by the interest, so ${slots.member} may speak, and the two answers are “Does not vote.” and “May speak.”.`
  ];
}

export const unit = 86;

export const cases = [
  {
    template: 'A declared conflict of interest',
    type: slugify('A declared conflict of interest'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
