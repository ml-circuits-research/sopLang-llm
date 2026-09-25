/**
 * Family N25 of the world seed book: meta-reasoning (robustness, information,
 * causality).
 *
 * Every problem states one meta-level comparison and asks for the appraisal the
 * stated criterion forces. Five designs cycle through the grades:
 *
 *   - information balance: two yes/no questions over a set of equally likely
 *     possibilities; the more balanced branch sizes win;
 *   - robustness: two score ranges and a claimed ranking; the ranking is robust
 *     only when the worst case of the higher option still beats the best case
 *     of the lower one;
 *   - counterexample: a universal claim about roads and travel time plus two
 *     towns; a pair with more roads but not shorter travel time disproves it;
 *   - causality: a correlation with a stated common factor and no intervention,
 *     which does not establish direct causation;
 *   - dominance: two plans over cost, time, and safety; a plan Pareto-dominates
 *     the other when it is no worse everywhere and strictly better somewhere.
 *
 * Grades 2-4 append a cross-domain check (map scale, clock arithmetic, quorum,
 * or duplicate reports, optionally combined with a map-sheet count) that the
 * family renders through the shared `renderCrossDomain`, and grade 4 also
 * carries the mixed-domain variant.
 *
 * The four grades share one computation; the variants differ in which design
 * they state and in the appended checks.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';

const NUMBER_WORDS = Object.freeze({
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10
});

const BALANCE_PATTERN = /(\w+) equally likely locations ([A-Z](?:, ?[A-Z])*) remain possible/;
const QUESTION_PATTERN = /(Q\d+) asks [“"]([^”"]+)[”"]/g;
const QUESTION_OPTIONS_PATTERN = /Is it (.+?)\?/;
const RANGE_PATTERN = /[Oo]ption ([A-Z]) scores between (\d+(?:\.\d+)?) and (\d+(?:\.\d+)?)/g;
const CLAIM_RANKING_PATTERN = /Is the ranking ([A-Z])>([A-Z]) robust\?/;
const TOWN_PATTERN = /Town ([A-Z]) has (\d+) roads and average travel time (\d+) minutes/g;
const CAUSAL_TASK_PATTERN = /Can we conclude that (.+?) cause (.+?)\?/;
const PLAN_PATTERN = /([A-Z]) costs (\d+(?:\.\d+)?), takes (\d+(?:\.\d+)?) minutes, and has safety score (\d+(?:\.\d+)?)/g;

// The detectors are separate from the scanning patterns: a global pattern
// carries a lastIndex across calls, so reusing one for `test` would make the
// decision depend on an earlier scan.
const BALANCE_TEST = /equally likely locations/;
const RANGE_TEST = /scores between \d+ and \d+ after measurement error/;
const TOWN_TEST = /Every town with more roads has shorter average travel time/;
const PLAN_TEST = /Two transport plans are compared/;

function parseBalance(facts) {
  const scenario = BALANCE_PATTERN.exec(facts);
  if (scenario === null) {
    throw new Error('the statement does not state the equally likely possibilities');
  }
  const count = NUMBER_WORDS[scenario[1].toLowerCase()] ?? Number(scenario[1]);
  if (!Number.isInteger(count)) {
    throw new Error(`the statement states an unknown number of possibilities: "${scenario[1]}"`);
  }
  const locations = scenario[2].split(',').map((value) => value.trim());
  if (locations.length !== count) {
    throw new Error('the statement names a different number of locations than it counts');
  }
  const questions = [];
  for (const match of facts.matchAll(QUESTION_PATTERN)) {
    const options = QUESTION_OPTIONS_PATTERN.exec(match[2]);
    if (options === null) {
      throw new Error(`the statement states a question the family cannot read: "${match[2]}"`);
    }
    questions.push({ name: match[1], options: options[1].split(' or ').map((value) => value.trim()) });
  }
  if (questions.length < 2) {
    throw new Error('the statement compares fewer than two questions');
  }
  return { kind: 'balance', locations, questions };
}

function parseRobustness(facts, task) {
  const ranges = new Map();
  for (const match of facts.matchAll(RANGE_PATTERN)) {
    ranges.set(match[1], { name: match[1], low: Number(match[2]), high: Number(match[3]) });
  }
  const claim = CLAIM_RANKING_PATTERN.exec(task);
  if (claim === null || !ranges.has(claim[1]) || !ranges.has(claim[2])) {
    throw new Error('the statement states no robust-ranking claim over the stated ranges');
  }
  return { kind: 'robustness', intervals: [ranges.get(claim[1]), ranges.get(claim[2])] };
}

function parseCounterexample(facts) {
  const towns = [];
  for (const match of facts.matchAll(TOWN_PATTERN)) {
    towns.push({ name: match[1], roads: Number(match[2]), minutes: Number(match[3]) });
  }
  if (towns.length < 2) {
    throw new Error('the statement describes fewer than two towns');
  }
  return { kind: 'counterexample', towns };
}

function parseCausality(facts, task) {
  if (!/No intervention is described/.test(facts)) {
    throw new Error('the statement describes an intervention the family does not model');
  }
  const question = CAUSAL_TASK_PATTERN.exec(task);
  if (question === null) {
    throw new Error('the task does not ask whether the stated association is causal');
  }
  return { kind: 'causality', cause: question[1].trim(), effect: question[2].trim(), intervention: false };
}

function parseDominance(facts) {
  const plans = [];
  for (const match of facts.matchAll(PLAN_PATTERN)) {
    plans.push({
      name: match[1],
      cost: Number(match[2]),
      minutes: Number(match[3]),
      safety: Number(match[4])
    });
  }
  if (plans.length !== 2) {
    throw new Error('the statement does not compare exactly two plans');
  }
  return { kind: 'dominance', plans };
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const task = blocks.Task;
  const crossDomain = parseCrossDomain(blocks['Given facts']);
  if (BALANCE_TEST.test(facts)) {
    return { ...parseBalance(facts), crossDomain };
  }
  if (RANGE_TEST.test(facts)) {
    return { ...parseRobustness(facts, task), crossDomain };
  }
  if (TOWN_TEST.test(facts)) {
    return { ...parseCounterexample(facts), crossDomain };
  }
  if (CAUSAL_TASK_PATTERN.test(task)) {
    return { ...parseCausality(facts, task), crossDomain };
  }
  if (PLAN_TEST.test(facts)) {
    return { ...parseDominance(facts), crossDomain };
  }
  throw new Error('the statement states no meta-reasoning comparison the family recognises');
}

function solve(slots) {
  if (slots.kind === 'balance') {
    // The information criterion is branch balance: the smaller the gap between
    // the yes and no branch sizes, the more informative the question. A tie
    // keeps the question named first.
    let best = slots.questions[0];
    for (const question of slots.questions.slice(1)) {
      const balance = Math.abs(2 * question.options.length - slots.locations.length);
      const bestBalance = Math.abs(2 * best.options.length - slots.locations.length);
      if (balance < bestBalance) {
        best = question;
      }
    }
    return { kind: 'balance', better: best.name, splits: slots.questions.map((question) => ({ name: question.name, yes: question.options.length, no: slots.locations.length - question.options.length })), crossDomain: slots.crossDomain };
  }
  if (slots.kind === 'robustness') {
    const [first, second] = slots.intervals;
    // Robust A>B means every allowed value of A stays above every allowed value
    // of B, so the worst case of A is compared with the best case of B.
    return { kind: 'robustness', first: first.name, second: second.name, worst: first.low, best: second.high, robust: first.low > second.high, crossDomain: slots.crossDomain };
  }
  if (slots.kind === 'counterexample') {
    // The claim is universal: towns with more roads have shorter travel time.
    // One town pair that has more roads without shorter travel time refutes it.
    let pair = null;
    for (let i = 0; i < slots.towns.length && pair === null; i += 1) {
      for (let j = i + 1; j < slots.towns.length && pair === null; j += 1) {
        const left = slots.towns[i];
        const right = slots.towns[j];
        if (left.roads > right.roads && left.minutes >= right.minutes) {
          pair = [left.name, right.name];
        } else if (right.roads > left.roads && right.minutes >= left.minutes) {
          pair = [right.name, left.name];
        }
      }
    }
    return { kind: 'counterexample', pair, crossDomain: slots.crossDomain };
  }
  if (slots.kind === 'causality') {
    // The association is stated with a common factor and no intervention, so
    // the correlation alone does not establish direct causation.
    return { kind: 'causality', cause: slots.cause, effect: slots.effect, crossDomain: slots.crossDomain };
  }
  if (slots.kind === 'dominance') {
    const [first, second] = slots.plans;
    const atLeast = (left, right) => left.cost <= right.cost && left.minutes <= right.minutes && left.safety >= right.safety;
    const strictlyBetter = (left, right) => left.cost < right.cost || left.minutes < right.minutes || left.safety > right.safety;
    let dominator = null;
    let dominated = null;
    if (atLeast(first, second) && strictlyBetter(first, second)) {
      dominator = first.name;
      dominated = second.name;
    } else if (atLeast(second, first) && strictlyBetter(second, first)) {
      dominator = second.name;
      dominated = first.name;
    }
    return { kind: 'dominance', dominator, dominated, crossDomain: slots.crossDomain };
  }
  throw new Error(`unknown meta-reasoning criterion "${slots.kind}"`);
}

function mainOf(solution) {
  if (solution.kind === 'balance') {
    return `${solution.better}.`;
  }
  if (solution.kind === 'robustness') {
    return solution.robust
      ? `Yes; the ranking ${solution.first}>${solution.second} is robust across the stated ranges.`
      : 'No; the ranking is sensitive to the uncertainty.';
  }
  if (solution.kind === 'counterexample') {
    return solution.pair === null
      ? 'No; the stated towns agree with the claim.'
      : `Yes. ${solution.pair[0]} and ${solution.pair[1]} form a counterexample.`;
  }
  if (solution.kind === 'causality') {
    return `No. The association alone does not establish that ${solution.cause} cause ${solution.effect}.`;
  }
  if (solution.kind === 'dominance') {
    return solution.dominator === null
      ? 'Neither plan dominates the other.'
      : `${solution.dominator} Pareto-dominates ${solution.dominated}.`;
  }
  throw new Error(`unknown meta-reasoning criterion "${solution.kind}"`);
}

function render(solution) {
  const main = mainOf(solution);
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
  'let main;',
  'if (slots.kind === "balance") {',
  '  const locations = slots.locations;',
  '  const questions = slots.questions;',
  '  let best = questions[0];',
  '  for (const question of questions.slice(1)) {',
  '    const balance = Math.abs(2 * question.options.length - locations.length);',
  '    const bestBalance = Math.abs(2 * best.options.length - locations.length);',
  '    if (balance < bestBalance) {',
  '      best = question;',
  '    }',
  '  }',
  '  main = best.name + ".";',
  '} else if (slots.kind === "robustness") {',
  '  const intervals = slots.intervals;',
  '  const robust = intervals[0].low > intervals[1].high;',
  '  main = robust',
  '    ? "Yes; the ranking " + intervals[0].name + ">" + intervals[1].name + " is robust across the stated ranges."',
  '    : "No; the ranking is sensitive to the uncertainty.";',
  '} else if (slots.kind === "counterexample") {',
  '  const towns = slots.towns;',
  '  let pair = null;',
  '  for (let i = 0; i < towns.length && pair === null; i += 1) {',
  '    for (let j = i + 1; j < towns.length && pair === null; j += 1) {',
  '      const left = towns[i];',
  '      const right = towns[j];',
  '      if (left.roads > right.roads && left.minutes >= right.minutes) {',
  '        pair = [left.name, right.name];',
  '      } else if (right.roads > left.roads && right.minutes >= left.minutes) {',
  '        pair = [right.name, left.name];',
  '      }',
  '    }',
  '  }',
  '  main = pair === null ? "No; the stated towns agree with the claim." : "Yes. " + pair[0] + " and " + pair[1] + " form a counterexample.";',
  '} else if (slots.kind === "causality") {',
  '  main = "No. The association alone does not establish that " + slots.cause + " cause " + slots.effect + ".";',
  '} else if (slots.kind === "dominance") {',
  '  const plans = slots.plans;',
  '  const first = plans[0];',
  '  const second = plans[1];',
  '  const atLeast = (left, right) => left.cost <= right.cost && left.minutes <= right.minutes && left.safety >= right.safety;',
  '  const strictlyBetter = (left, right) => left.cost < right.cost || left.minutes < right.minutes || left.safety > right.safety;',
  '  if (atLeast(first, second) && strictlyBetter(first, second)) {',
  '    main = first.name + " Pareto-dominates " + second.name + ".";',
  '  } else if (atLeast(second, first) && strictlyBetter(second, first)) {',
  '    main = second.name + " Pareto-dominates " + first.name + ".";',
  '  } else {',
  '    main = "Neither plan dominates the other.";',
  '  }',
  '} else {',
  '  throw new Error("unknown meta-reasoning criterion: " + slots.kind);',
  '}',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  if (solution.kind === 'balance') {
    const splits = solution.splits.map((split) => `${split.name} splits the ${slots.locations.length} possibilities ${split.yes} versus ${split.no}`);
    return [
      ...splits.map((split) => `${split}.`),
      `${solution.better} has the more nearly equal branches, so it is the more informative question by the stated criterion.`
    ];
  }
  if (solution.kind === 'robustness') {
    return [
      `The claim ranks ${solution.first} above ${solution.second}, and the worst allowed value of ${solution.first} is ${solution.worst}.`,
      `The best allowed value of ${solution.second} is ${solution.best}, and ${solution.worst}>${solution.best} is ${solution.robust ? 'true' : 'false'}.`,
      solution.robust
        ? 'Every allowed value keeps the claimed order, so the ranking survives the stated uncertainty.'
        : 'Some allowed values reverse the claimed order, so the ranking is sensitive to the uncertainty.'
    ];
  }
  if (solution.kind === 'counterexample') {
    return [
      'The claim is universal: a town with more roads must have shorter average travel time.',
      ...(solution.pair === null
        ? ['Every stated town pair agrees with the claim, so the stated data provide no counterexample.', 'A universal claim needs one case with the condition and the opposite conclusion to fail.']
        : [`${solution.pair[0]} has more roads than ${solution.pair[1]} yet not a shorter average travel time.`, 'One case that satisfies the condition and not the conclusion refutes the universal claim.'])
    ];
  }
  if (solution.kind === 'causality') {
    return [
      `${solution.cause} and ${solution.effect} are correlated in the stated months.`,
      'The statement also names a third factor that moves with both and describes no intervention.',
      `Correlation alone therefore does not establish that ${solution.cause} cause ${solution.effect}.`
    ];
  }
  if (solution.kind === 'dominance') {
    if (solution.dominator === null) {
      return [
        'Each plan is better on at least one stated criterion and worse on another.',
        'Neither plan is at least as good everywhere with a strict advantage somewhere, so neither dominates.',
        'The comparison therefore reports no domination instead of a winner.'
      ];
    }
    return [
      `${solution.dominator} is no worse than ${solution.dominated} on cost, time, and safety.`,
      `It is strictly better on at least one criterion, so ${solution.dominator} Pareto-dominates ${solution.dominated}.`,
      'Dominance needs no weighting: the loser is worse on some criterion and better on none.'
    ];
  }
  throw new Error(`unknown meta-reasoning criterion "${solution.kind}"`);
}

function caseFor(grade) {
  return {
    template: `Meta-reasoning: robustness, information, causality (grade ${grade})`,
    type: `meta-reasoning-robustness-information-causality-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N25';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
