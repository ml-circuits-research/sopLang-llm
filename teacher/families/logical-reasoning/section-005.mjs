/**
 * Section 5 of the logical-reasoning book: either-or, with one side gone.
 *
 * Every case prints a travel plan whose closed disjunction lists two means and
 * says no third means is listed, then removes one listed side — the only
 * morning bus is cancelled while the train runs on time — and lets three
 * speakers read the plan differently. The case data changes the place and the
 * three names; the reasoning is fixed: inside a closed disjunction the one
 * remaining listed side is forced, walking is a means the plan never listed,
 * and "or" cannot restore an option the plan has cancelled. The family reads
 * the plan and the three sentences and renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const PLAN_PATTERN =
  /Printed plan in ([A-Z][a-z]+(?: [A-Z][a-z]+)*) for one clerk: “Today you travel by ([A-Z]+) or by ([A-Z]+)\. No third means is listed\.” The only morning ([a-z]+) is cancelled\. The ([a-z]+) is on time\./;
const SPEAKERS_PATTERN =
  /([A-Z][a-z]+) says the clerk takes the ([a-z]+)\. ([A-Z][a-z]+) says the clerk may now ([a-z]+), because a cancellation opens every road\. ([A-Z][a-z]+) says “or” always keeps the cancelled ([a-z]+) as a live option\./;

function parse(statement) {
  const plan = PLAN_PATTERN.exec(statement);
  const speakers = SPEAKERS_PATTERN.exec(statement);
  if (plan === null || speakers === null) {
    throw new Error('the statement does not carry the closed plan and the three sentences');
  }
  return {
    place: plan[1],
    listedMeans: [plan[2], plan[3]],
    cancelledMeans: plan[4].toUpperCase(),
    runningMeans: plan[5].toUpperCase(),
    keeper: speakers[1],
    keeperMeans: speakers[2].toUpperCase(),
    walker: speakers[3],
    walkMeans: speakers[4].toUpperCase(),
    restorer: speakers[5],
    restoredMeans: speakers[6].toUpperCase()
  };
}

/**
 * The plan lists one disjunction and states that nothing else is listed, so
 * the cancelled side is gone and the side that still runs is the only option
 * the plan leaves. The case must cancel one listed side, keep the other one
 * running, and the three readings must land where the verdict says: the first
 * claims the survivor, the second walks a means the plan never listed, and the
 * third clings to the cancelled side.
 */
function solve(slots) {
  if (slots.listedMeans[0] === slots.listedMeans[1]) {
    throw new Error('the plan must list two different means');
  }
  const survivor = slots.listedMeans.find((means) => means !== slots.cancelledMeans);
  if (survivor === undefined) {
    throw new Error('the cancelled means must be one of the two listed sides');
  }
  if (survivor !== slots.runningMeans) {
    throw new Error(`the ${slots.runningMeans.toLowerCase()} is not the listed side the cancellation leaves`);
  }
  if (slots.keeperMeans !== survivor) {
    throw new Error('the first reading must claim the surviving mean');
  }
  if (slots.listedMeans.includes(slots.walkMeans)) {
    throw new Error('the walking reading must name a means the plan does not list');
  }
  if (slots.restoredMeans !== slots.cancelledMeans) {
    throw new Error('the third reading must cling to the cancelled mean');
  }
  return {
    forced: slots.keeper,
    walker: slots.walker,
    restorer: slots.restorer
  };
}

function render(solution) {
  return `${solution.forced} is right inside the plan. ${solution.walker} invents a third means. ${solution.restorer} restores a cancelled option the plan cannot restore.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const survivor = slots.listedMeans.find((means) => means !== slots.cancelledMeans);',
  'return slots.keeper + " is right inside the plan. " + slots.walker + " invents a third means. " + slots.restorer + " restores a cancelled option the plan cannot restore.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The plan of ${slots.place} is a closed disjunction: ${slots.listedMeans[0]} or ${slots.listedMeans[1]}, with no third means listed.`,
    `The only morning ${slots.cancelledMeans.toLowerCase()} is cancelled, so that side is gone, and the ${slots.runningMeans.toLowerCase()} is on time, so ${solution.forced} is right inside the plan.`,
    `${solution.walker} adds ${slots.walkMeans.toLowerCase()}, a means the plan never listed, so that reading is not drawn from the plan.`,
    `${solution.restorer} keeps the cancelled ${slots.restoredMeans.toLowerCase()} alive as a live option, but "or" is not a repair shop and the plan cannot restore what it has cancelled.`
  ];
}

export const unit = 5;

export const cases = [
  {
    template: 'Either-or, with one side gone',
    type: slugify('Either-or, with one side gone'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
