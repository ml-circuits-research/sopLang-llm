/**
 * Form 35 of the scientific-reasoning book: repeated processes and recurrence.
 *
 * Every variant tracks one quantity in a state x, gives its initial value x0,
 * the fixed change of a cycle (an addition and a subtraction), a cap, and the
 * number of cycles. One cycle applies the whole rule to the state of the
 * previous cycle: it adds, subtracts, and only then truncates with
 * min(cap, state). The printed answer lists the state after each cycle and says
 * whether the cap intervened. A cycle intervenes when its uncapped value
 * exceeds the cap; a cycle that lands exactly on the cap truncates nothing and
 * is not counted, which is why the printed answers distinguish a series such as
 * 5, 7, 9, 11, 11 (intervening at cycle 5) from 6, 8, 10, 11, 11 (cycle 4).
 *
 * The variants differ in the world's vocabulary and in the four numbers, not in
 * the recurrence, so one family covers all twenty-five of them.
 */

import { slugify } from '../../naming.mjs';

const NUMBER_WORDS = Object.freeze({
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten'
});

const DATA_PATTERN = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/;
const START_PATTERN = /We start with x[₀0]\s*=\s*(\d+)/;
const STEP_PATTERN = /we add (\d+), we subtract (\d+)/;
const CAP_PATTERN = /we apply the cap (\d+)/;
const CYCLES_PATTERN = /We repeat (\d+) cycles/;

function parse(statement) {
  const data = DATA_PATTERN.exec(statement);
  if (data === null) {
    throw new Error('the statement does not state the recurrence of its quantity');
  }
  const start = START_PATTERN.exec(data[1]);
  const step = STEP_PATTERN.exec(data[1]);
  const cap = CAP_PATTERN.exec(data[1]);
  const cycles = CYCLES_PATTERN.exec(data[1]);
  if (start === null || step === null || cap === null || cycles === null) {
    throw new Error('the statement does not state the initial value, the step, the cap, and the cycle count');
  }
  return {
    start: Number(start[1]),
    add: Number(step[1]),
    subtract: Number(step[2]),
    cap: Number(cap[1]),
    cycles: Number(cycles[1])
  };
}

/** The state after every cycle, with the first cycle whose uncapped value exceeds the cap. */
function evolve(slots) {
  const states = [];
  let value = slots.start;
  let firstCapped = null;
  for (let cycle = 1; cycle <= slots.cycles; cycle += 1) {
    const uncapped = value + slots.add - slots.subtract;
    if (uncapped > slots.cap && firstCapped === null) {
      firstCapped = cycle;
    }
    value = Math.min(slots.cap, uncapped);
    states.push(value);
  }
  return { states, firstCapped };
}

function solve(slots) {
  if (slots.cycles < 1) {
    throw new Error('the statement must repeat at least one cycle');
  }
  const { states, firstCapped } = evolve(slots);
  return { states, firstCapped, cycles: slots.cycles };
}

function render(solution) {
  const span = NUMBER_WORDS[solution.cycles] ?? String(solution.cycles);
  const note =
    solution.firstCapped === null
      ? `The cap does not intervene in the first ${span} cycles.`
      : `The cap intervenes at cycle ${solution.firstCapped}.`;
  return `The states are ${solution.states.join(', ')}. ${note}`;
}

const WIRES = [
  {
    name: 'series',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const states = [];',
      'let value = slots.start;',
      'let firstCapped = null;',
      'for (let cycle = 1; cycle <= slots.cycles; cycle += 1) {',
      '  const uncapped = value + slots.add - slots.subtract;',
      '  if (uncapped > slots.cap && firstCapped === null) { firstCapped = cycle; }',
      '  value = Math.min(slots.cap, uncapped);',
      '  states.push(value);',
      '}',
      'probe(states.length === slots.cycles, "the evolution must produce one state per cycle");',
      'probe(states.every((state) => state <= slots.cap), "no state may exceed the cap");',
      'probe(states[states.length - 1] <= slots.cap, "the last state must respect the cap");',
      'return { states: states, firstCapped: firstCapped };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const words = { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten" };',
  'const span = words[$slots.cycles] === undefined ? String($slots.cycles) : words[$slots.cycles];',
  'const note = $series.firstCapped === null ? "The cap does not intervene in the first " + span + " cycles." : "The cap intervenes at cycle " + $series.firstCapped + ".";',
  'return "The states are " + $series.states.join(", ") + ". " + note;'
].join('\n');

function explain(slots, solution) {
  const net = slots.add - slots.subtract;
  return [
    `Every cycle first adds ${slots.add} and subtracts ${slots.subtract}, so the uncapped state grows by ${net} from the state of the previous cycle, starting at ${slots.start}.`,
    `The cap ${slots.cap} enters only through min(${slots.cap}, state), so it truncates the first cycle whose uncapped value is larger than ${slots.cap}${solution.firstCapped === null ? `; over the ${solution.cycles} cycles the uncapped values stay at or below it` : `, which is cycle ${solution.firstCapped}`}.`,
    `Applying the rule to each previous state gives the printed series ${slots.start} → ${solution.states.join(' → ')}.`,
    solution.firstCapped === null
      ? 'A cap that is never exceeded changes nothing, so the capped series and the constant-step progression coincide.'
      : 'Comparing the series with the constant-step progression shows the cap: the truncated cycles keep the cap value instead of growing further.'
  ];
}

export const unit = 35;

export const cases = [
  {
    template: 'Repeated processes and recurrence',
    type: slugify('Repeated processes and recurrence'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
