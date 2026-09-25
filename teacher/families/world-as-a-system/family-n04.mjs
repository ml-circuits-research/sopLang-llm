/**
 * Family N4 of the world seed book: stocks, flows, and conservation.
 *
 * Every problem states a reservoir with a starting stock, a daily inflow, a
 * daily outflow, and the number of days the rates hold, and asks for the stock
 * at the end plus whether the stock grows or shrinks each day. The daily net
 * change is the inflow minus the outflow, the end stock is the starting stock
 * plus the number of days times that net change, and the verdict follows the
 * sign of the net change: positive means increasing, negative means
 * decreasing, and zero means the stock is unchanged.
 *
 * All four grades share one computation; the grades differ in the stated stock,
 * the stated rates, the number of days, and the sign of the net change, never
 * in the algorithm.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';

const STOCK_PATTERN =
  /A reservoir starts with (\d+) water units\. Each day (\d+) units flow in and (\d+) units flow out\. Assume these rates stay constant for (\d+) days/;
const QUESTION_PATTERN = /How much water is stored after (\d+) days\?/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const stock = STOCK_PATTERN.exec(facts);
  if (stock === null) {
    throw new Error('the statement does not state the starting stock, the daily flows, and the day count');
  }
  const question = QUESTION_PATTERN.exec(blocks.Task);
  if (question === null) {
    throw new Error('the task asks for no stock after a number of days');
  }
  const days = Number(stock[4]);
  if (Number(question[1]) !== days) {
    throw new Error(`the facts state ${days} day(s) but the task asks about ${question[1]}`);
  }
  return {
    start: Number(stock[1]),
    inflow: Number(stock[2]),
    outflow: Number(stock[3]),
    days,
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  const dailyNet = slots.inflow - slots.outflow;
  return {
    end: slots.start + slots.days * dailyNet,
    dailyNet,
    verdict: dailyNet > 0 ? 'increasing' : dailyNet < 0 ? 'decreasing' : 'unchanged',
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const main = `${solution.end} units; the stock is ${solution.verdict}.`;
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
  'const dailyNet = slots.inflow - slots.outflow;',
  'const end = slots.start + slots.days * dailyNet;',
  'probe(Number.isInteger(end), "the end stock must be a whole number of units");',
  'const verdict = dailyNet > 0 ? "increasing" : dailyNet < 0 ? "decreasing" : "unchanged";',
  'probe(verdict === "increasing" || verdict === "decreasing" || verdict === "unchanged", "the verdict must follow the sign of the daily net change");',
  'const main = end + " units; the stock is " + verdict + ".";',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The daily net change is the inflow minus the outflow: ${slots.inflow} - ${slots.outflow} = ${solution.dailyNet} unit(s) per day.`,
    `Over ${slots.days} day(s) that net change accumulates to ${slots.days} times ${solution.dailyNet} = ${slots.days * solution.dailyNet} unit(s).`,
    `Adding the accumulated change to the starting stock ${slots.start} gives ${solution.end} unit(s).`,
    `The stock is ${solution.verdict} because the daily net change is ${solution.dailyNet > 0 ? 'positive' : solution.dailyNet < 0 ? 'negative' : 'zero'}.`
  ];
}

function caseFor(grade) {
  return {
    template: `Stocks, flows, and conservation (grade ${grade})`,
    type: `stocks-flows-and-conservation-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N4';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
