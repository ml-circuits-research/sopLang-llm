/**
 * Section 56 of the adult-reasoning course: food chains in a described
 * ecosystem.
 *
 * Every variant describes one pond chain — algae, snails, small fish, heron —
 * with the note that a vanished producer starves its consumer and that the
 * arrow is not reversed. A proposal then removes the snails "so the algae
 * remain for oxygen" and claims the heron is untouched. The verdict walks the
 * given chain: the small fish lose their food, so the heron loses the fish and
 * is touched, and the oxygen the proposal invokes is not a link on the chain.
 * The cases change the pond location, so the family derives every clause from
 * the parsed links.
 */

import { slugify } from '../../naming.mjs';

const CHAIN_PATTERN = /Pond near ([^:]+): ([a-z ]+) → ([a-z ]+) → ([a-z ]+) → ([a-z ]+)\./;
const SHEET_PATTERN =
  /“If ([a-z ]+) vanish, ([a-z ]+) lose the food described here\. The arrow is not reversed\.”/;
const PROPOSAL_PATTERN =
  /Proposal: remove the ([a-z ]+) “so ([a-z ]+) remain for ([a-z]+)”; “the ([a-z ]+) is untouched”\./;

function parse(statement) {
  const chain = CHAIN_PATTERN.exec(statement);
  const sheet = SHEET_PATTERN.exec(statement);
  const proposal = PROPOSAL_PATTERN.exec(statement);
  if (chain === null || sheet === null || proposal === null) {
    throw new Error('the statement does not describe the pond chain and the removal proposal');
  }
  const links = [chain[2], chain[3], chain[4], chain[5]].map((link) => link.trim());
  return {
    place: chain[1].trim(),
    chain: links,
    sheetProducer: sheet[1].trim(),
    sheetConsumer: sheet[2].trim(),
    removed: proposal[1].trim(),
    kept: proposal[2].trim(),
    reason: proposal[3].trim(),
    claimUntouched: proposal[4].trim()
  };
}

function solve(slots) {
  const index = slots.chain.indexOf(slots.removed);
  if (index < 0) {
    throw new Error(`the removed link "${slots.removed}" is not on the given chain`);
  }
  if (index === slots.chain.length - 1) {
    throw new Error(`the removed link "${slots.removed}" has nothing below it on the given chain`);
  }
  const prey = slots.chain[index + 1];
  const eater = slots.chain[index + 2];
  const preyHead = prey.split(' ').pop();
  const loseClause =
    eater === undefined
      ? `Without ${slots.removed}: ${prey} lose food.`
      : `Without ${slots.removed}: ${prey} lose food, the ${eater} loses ${preyHead}.`;
  const touchedClause = eater === slots.claimUntouched
    ? `The ${eater} is touched.`
    : `${slots.claimUntouched} keeps its place on the given chain.`;
  const extraClause = slots.chain.includes(slots.reason)
    ? `${slots.reason} is one of the links of the given chain.`
    : `Pond ${slots.reason} is not in the chain — do not add it.`;
  return { prey, eater, preyHead, loseClause, touchedClause, extraClause };
}

function render(solution) {
  return `${solution.loseClause} ${solution.touchedClause} ${solution.extraClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the pond location");',
  'probe(Array.isArray(slots.chain) && slots.chain.length >= 3, "the case must describe a chain of at least three links");',
  'probe(slots.chain.every((link) => typeof link === "string" && link.length > 0), "every link of the chain must be a non-empty name");',
  'const index = slots.chain.indexOf(slots.removed);',
  'probe(index >= 1 && index < slots.chain.length - 1, "the removed link must sit below the top of the chain");',
  'probe(slots.sheetProducer === slots.chain[index - 1] && slots.sheetConsumer === slots.chain[index], "the sheet must describe the starvation of the removed link");',
  'probe(slots.chain.some((link) => link === slots.reason) === false, "the reason of the proposal must not be a link of the chain");',
  'const prey = slots.chain[index + 1];',
  'const eater = slots.chain[index + 2];',
  'const preyHead = prey.split(" ").pop();',
  'const loseClause = eater === undefined',
  '  ? "Without " + slots.removed + ": " + prey + " lose food."',
  '  : "Without " + slots.removed + ": " + prey + " lose food, the " + eater + " loses " + preyHead + ".";',
  'const touchedClause = eater === slots.claimUntouched',
  '  ? "The " + eater + " is touched."',
  '  : slots.claimUntouched + " keeps its place on the given chain.";',
  'const extraClause = slots.chain.includes(slots.reason)',
  '  ? slots.reason + " is one of the links of the given chain."',
  '  : "Pond " + slots.reason + " is not in the chain — do not add it.";',
  'return loseClause + " " + touchedClause + " " + extraClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The chain near ${slots.place} runs ${slots.chain.join(' → ')}, and the arrow points from the eaten link to the eater, so removing the ${slots.removed} leaves the ${solution.prey} without the food described for them.`,
    `The ${solution.eater} feeds on the ${solution.prey}, so it loses that food as well: the claim that the ${slots.claimUntouched} is untouched by the removal does not hold on the given chain.`,
    `The proposal keeps ${slots.kept} for ${slots.reason}, but ${slots.reason} is not a link of the described chain, so the verdict does not add it.`
  ];
}

export const unit = 56;

export const cases = [
  {
    template: 'Food chains in a described ecosystem',
    type: slugify('Food chains in a described ecosystem'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
