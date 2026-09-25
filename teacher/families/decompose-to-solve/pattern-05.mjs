/**
 * Pattern 5 of the decompose-to-solve book: one coupled objective that looks
 * like three independent choice problems.
 *
 * Every variant compares two configurations A and B on cost, time, and quality
 * under a rule fixed in advance, `S = cost + w×time − q×quality`, and asks what
 * the correct decomposition is. The answer is deliberately negative: the three
 * apparent strands are clauses of a single objective, so the only sound
 * formulation is one optimization subproblem; solving cost, time, and quality
 * separately and voting among their winners would produce partial statements
 * that have to be recombined before they mean anything. The winner is the
 * configuration with the smaller coupled score, and the answer prints the two
 * scores with one decimal. The variants change the domain phrase, the sentence
 * nouns, and the numbers, never the method.
 */

import { slugify } from '../../naming.mjs';

const CONTEXT_PATTERN = /Scenario\. In ([a-z][^.]*?), two configurations are being compared/;
const A_PATTERN = /A costs (\d+) units, takes (\d+) minutes, and has an assessed quality score of (\d+)\/100\./;
const B_PATTERN = /B costs (\d+) units, takes (\d+) minutes, and scores (\d+)\/100\./;
const RULE_PATTERN = /minimize S = cost \+ ([0-9.]+)\s*[×x*]\s*time\s*[−-]\s*(\d+)\s*[×x*]\s*quality\./;

/** The one-decimal score text of a score scaled by ten. */
function formatScore(scaled) {
  const sign = scaled < 0 ? '-' : '';
  const magnitude = Math.abs(scaled);
  return `${sign}${Math.floor(magnitude / 10)}.${magnitude % 10}`;
}

function parse(statement) {
  const context = CONTEXT_PATTERN.exec(statement);
  const a = A_PATTERN.exec(statement);
  const b = B_PATTERN.exec(statement);
  const rule = RULE_PATTERN.exec(statement);
  if (context === null || a === null || b === null || rule === null) {
    throw new Error('the statement does not compare two configurations under a coupled scoring rule');
  }
  return {
    context: context[1].trim(),
    costA: Number(a[1]),
    timeA: Number(a[2]),
    qualityA: Number(a[3]),
    costB: Number(b[1]),
    timeB: Number(b[2]),
    qualityB: Number(b[3]),
    timeWeight: Number(rule[1]),
    qualityWeight: Number(rule[2])
  };
}

function solve(slots) {
  // Scaled by ten so a 1.5 time weight stays exact integer arithmetic.
  const timeWeightScales = { 1: 10, 1.5: 15, 2: 20 };
  const timeScale = timeWeightScales[slots.timeWeight];
  if (timeScale === undefined) {
    throw new Error(`the stated time weight ${slots.timeWeight} is not one of 1, 1.5, 2`);
  }
  const scoreA = slots.costA * 10 + timeScale * slots.timeA - slots.qualityWeight * 10 * slots.qualityA;
  const scoreB = slots.costB * 10 + timeScale * slots.timeB - slots.qualityWeight * 10 * slots.qualityB;
  const winner = scoreA <= scoreB ? 'A' : 'B';
  return {
    scoreA,
    scoreB,
    winner,
    winnerScore: winner === 'A' ? scoreA : scoreB,
    loserScore: winner === 'A' ? scoreB : scoreA
  };
}

function render(solution) {
  return `This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration ${solution.winner} wins because the predetermined combined score is ${formatScore(solution.winnerScore)} versus ${formatScore(solution.loserScore)}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const formatScore = (scaled) => {',
  '  const sign = scaled < 0 ? "-" : "";',
  '  const magnitude = Math.abs(scaled);',
  '  return sign + Math.floor(magnitude / 10) + "." + (magnitude % 10);',
  '};',
  'const timeWeightScales = { 1: 10, 1.5: 15, 2: 20 };',
  'const timeScale = timeWeightScales[slots.timeWeight];',
  'for (const side of ["A", "B"]) {',
  '}',
  'const scoreA = slots.costA * 10 + timeScale * slots.timeA - slots.qualityWeight * 10 * slots.qualityA;',
  'const scoreB = slots.costB * 10 + timeScale * slots.timeB - slots.qualityWeight * 10 * slots.qualityB;',
  'const winner = scoreA <= scoreB ? "A" : "B";',
  'const winnerScore = winner === "A" ? scoreA : scoreB;',
  'const loserScore = winner === "A" ? scoreB : scoreA;',
  'probe(winnerScore <= loserScore, "the winning coupled score must not exceed the losing one");',
  'probe(Number.isInteger(winnerScore) && Number.isInteger(loserScore), "both coupled scores must be exact in tenths");',
  'return "This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration " + winner + " wins because the predetermined combined score is " + formatScore(winnerScore) + " versus " + formatScore(loserScore) + ".";'
].join('\n');

function explain(slots, solution) {
  const aScore = formatScore(solution.scoreA);
  const bScore = formatScore(solution.scoreB);
  return [
    `The scenario is ${slots.context}, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + ${slots.timeWeight}×time − ${slots.qualityWeight}×quality.`,
    `For configuration A that gives ${slots.costA} + ${slots.timeWeight}×${slots.timeA} − ${slots.qualityWeight}×${slots.qualityA} = ${aScore}, and for configuration B it gives ${slots.costB} + ${slots.timeWeight}×${slots.timeB} − ${slots.qualityWeight}×${slots.qualityB} = ${bScore}.`,
    `Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.`,
    `Configuration ${solution.winner} therefore wins with ${formatScore(solution.winnerScore)} against ${formatScore(solution.loserScore)}.`
  ];
}

export const unit = 5;

export const cases = [
  {
    template: 'Atomic Case: Coupled Objective',
    type: slugify('Atomic Case: Coupled Objective'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
