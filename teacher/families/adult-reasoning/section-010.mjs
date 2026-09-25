/**
 * Section 10 of the adult-reasoning course: game rules and house rules.
 *
 * Every variant prints the same hall rules for the game “Bridges”: twelve
 * points win, a correct bridge scores three, an incomplete bridge at the end of
 * the turn scores zero and is taken down, an extra piece from the common pile
 * is returned with the loss of the turn, and “don’t put it there” about another
 * player’s plan costs two once per turn. The player builds an incomplete
 * bridge, keeps playing after the returned piece, and claims the win. The
 * cases change the district, the player, and the starting score, so the family
 * derives the score after the turn from the printed penalties.
 */

import { slugify } from '../../naming.mjs';

const HALL_PATTERN = /Hall rules, game “Bridges”, ([^:]+):/;
const WIN_PATTERN = /First to (\d+) points wins\./;
const BRIDGE_PATTERN = /A correct bridge = (\d+) points\./;
const INCOMPLETE_PATTERN = /An incomplete bridge at the end of the turn = (\d+) and is taken down\./;
const TALK_PATTERN = /“Don’t put it there” about another’s plan = −(\d+), once per turn\./;
const EXTRA_PIECE_PATTERN = /Extra piece from the common pile: put it back and lose the turn\./;
const PLAYER_PATTERN =
  /([A-Z][a-z]+) has (\d+) points\. Builds a bridge; the referee calls it incomplete\. Had taken an extra piece, put it back, but continued the turn and said “don’t put it there”\. Claims (\d+) points and the win\./;

function parse(statement) {
  const hall = HALL_PATTERN.exec(statement);
  const win = WIN_PATTERN.exec(statement);
  const bridge = BRIDGE_PATTERN.exec(statement);
  const incomplete = INCOMPLETE_PATTERN.exec(statement);
  const talk = TALK_PATTERN.exec(statement);
  const player = PLAYER_PATTERN.exec(statement);
  if (hall === null || win === null || bridge === null || incomplete === null || talk === null || player === null) {
    throw new Error('the statement does not print the hall rules and the player turn they describe');
  }
  return {
    place: hall[1],
    winThreshold: Number(win[1]),
    correctBridge: Number(bridge[1]),
    incompleteBridge: Number(incomplete[1]),
    forbiddenTalk: Number(talk[1]),
    extraPieceEndsTurn: EXTRA_PIECE_PATTERN.test(statement),
    player: { name: player[1], start: Number(player[2]), claimed: Number(player[3]) }
  };
}

function solve(slots) {
  if (!slots.extraPieceEndsTurn) {
    throw new Error('the hall rules must return the extra piece and end the turn');
  }
  if (slots.incompleteBridge !== 0) {
    throw new Error('the hall rules must score an incomplete bridge at the end of the turn as nothing');
  }
  const score = slots.player.start + slots.incompleteBridge - slots.forbiddenTalk;
  if (score >= slots.winThreshold) {
    throw new Error('the player would hold the winning score, which this section does not print');
  }
  return {
    incomplete: slots.incompleteBridge,
    talk: slots.forbiddenTalk,
    score,
    threshold: slots.winThreshold
  };
}

function render(solution) {
  return `Incomplete bridge = ${solution.incomplete}. Forbidden talk = −${solution.talk}. Left with ${solution.score}. Continuing after the extra piece is forbidden anyway. ${solution.score} < ${solution.threshold}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const score = slots.player.start + slots.incompleteBridge - slots.forbiddenTalk;',
  'probe(score < slots.winThreshold, "the earned score must stay under the winning total");',
  'return "Incomplete bridge = " + slots.incompleteBridge + ". Forbidden talk = −" + slots.forbiddenTalk + ". Left with " + score + ". Continuing after the extra piece is forbidden anyway. " + score + " < " + slots.winThreshold + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The bridge the referee of the ${slots.place} hall calls incomplete is taken down and scores nothing, so ${slots.player.name} keeps the starting ${slots.player.start} points and never collects the ${slots.correctBridge} a correct bridge would pay.`,
    `Saying “don’t put it there” about another player’s plan costs ${slots.forbiddenTalk} once per turn, which brings the score to ${solution.score}.`,
    'The extra piece came from the common pile, so the turn ended when it was returned; everything done after that adds nothing, and the claim of a win is invented.',
    `${solution.score} is below the ${slots.winThreshold} points the hall rules require, so there is no win.`
  ];
}

export const unit = 10;

export const cases = [
  {
    template: 'Game rules and house rules',
    type: slugify('Game rules and house rules'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
