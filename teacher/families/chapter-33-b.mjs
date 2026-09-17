/**
 * Families for chapter 33 of the mathematical seed book: algorithms, search,
 * sorting, and debugging.
 *
 * The chapter titles every problem individually, so each printed template has a
 * single variant and one family case per template. Most templates state their
 * own rule, so the category is `no-knowledge`; the decoding template refers to
 * the encoding rule of the previous problem without restating it, so its
 * circuit materializes that rule in a `literal` fact wire.
 *
 * The chapter is split across `chapter-33.mjs`, `chapter-33-b.mjs`, and
 * `chapter-33-c.mjs` because DS001 caps a module at 800 lines; every part
 * repeats this header, the chapter number, and the helpers outside `cases`.
 */

const SLOTS = 'const slots = $slots;';
const WORD_NUMBERS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
function must(statement, pattern, message) {
  const match = statement.match(pattern);
  if (match === null) { throw new Error(message); }
  return match;
}

function listOf(text) {
  return text.split(',').map((value) => Number(value.trim()));
}

function firstList(statement) {
  return listOf(must(statement, /\[([0-9,\s]+)\]/, 'the list is missing')[1]);
}

function applyStep(value, step) {
  switch (step.op) {
    case 'add': return value + step.operand;
    case 'subtract': return value - step.operand;
    case 'multiply': return value * step.operand;
    case 'divide': return value / step.operand;
    default: throw new Error(`unsupported operation "${step.op}"`);
  }
}

function parseFormula(text) {
  const cleaned = String(text).trim().replace(/^y=/, '').replace(/\s+/g, '');
  if (cleaned === 'x+x') { return { op: 'multiply', operand: 2 }; }
  const right = cleaned.match(/^(\d+)[×*]x$/);
  if (right !== null) { return { op: 'multiply', operand: Number(right[1]) }; }
  const left = cleaned.match(/^x([+\-*/])(\d+)$/);
  if (left === null) { throw new Error(`unsupported formula "${text.trim()}"`); }
  return { op: { '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide' }[left[1]], operand: Number(left[2]) };
}

function parseWordStep(text) {
  const cleaned = String(text).trim().replace(/\s+/g, ' ').replace(/\.$/, '');
  const named = {
    double: { op: 'multiply', operand: 2 },
    halve: { op: 'divide', operand: 2 },
    'twice a number': { op: 'multiply', operand: 2 },
    'twice the number': { op: 'multiply', operand: 2 }
  };
  if (named[cleaned] !== undefined) { return named[cleaned]; }
  const match = cleaned.match(/^(add|subtract|multiply by|divide by) (\d+)$/);
  if (match === null) { throw new Error(`unsupported operation "${cleaned}"`); }
  const operators = { add: 'add', subtract: 'subtract', 'multiply by': 'multiply', 'divide by': 'divide' };
  return { op: operators[match[1]], operand: Number(match[2]) };
}

function parseUpdateStep(text) {
  const cleaned = String(text).trim().replace(/\.$/, '').replace(/\s+/g, '');
  const patterns = [
    { pattern: /^x=x\+(\d+)$/, op: 'add' },
    { pattern: /^x=x-(\d+)$/, op: 'subtract' },
    { pattern: /^x=(\d+)[×*x]x$/, op: 'multiply' },
    { pattern: /^x=x\/(\d+)$/, op: 'divide' }
  ];
  for (const entry of patterns) {
    const match = cleaned.match(entry.pattern);
    if (match !== null) { return { op: entry.op, operand: Number(match[1]) }; }
  }
  throw new Error(`unsupported update "${text.trim()}"`);
}

function evalTerm(term, x) {
  const cleaned = String(term).trim();
  if (cleaned === 'x') { return x; }
  const product = cleaned.match(/^(\d+)[×*]x$/);
  if (product !== null) { return Number(product[1]) * x; }
  const value = Number(cleaned);
  if (Number.isNaN(value)) { throw new Error(`unsupported term "${cleaned}"`); }
  return value;
}

function evalXExpr(expression, x) {
  return String(expression).split('+').reduce((total, term) => total + evalTerm(term, x), 0);
}

function binaryProbes(list, target) {
  const probes = [];
  let low = 0;
  let high = list.length - 1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    probes.push(list[middle]);
    if (list[middle] === target) { break; }
    if (list[middle] < target) { low = middle + 1; } else { high = middle - 1; }
  }
  return probes;
}

function joinOr(values) {
  if (values.length === 1) { return String(values[0]); }
  if (values.length === 2) { return `${values[0]} or ${values[1]}`; }
  return `${values.slice(0, -1).join(', ')}, or ${values[values.length - 1]}`;
}

export const chapter = 33;
export const cases = [
  {
    template: 'Loop with a fixed number of repetitions',
    type: 'loop-with-a-fixed-number-of-repetitions',
    category: 'no-knowledge',
    parse(statement) {
      const start = Number(must(statement, /x starts at (\d+)/, 'the starting value is missing')[1]);
      const repeated = must(statement, /Repeat the instruction (\S+) (\w+) times/, 'the repeated instruction is missing');
      const count = WORD_NUMBERS[repeated[2]];
      if (count === undefined) {
        throw new Error(`the repetition count "${repeated[2]}" is not a number word`);
      }
      return { start, step: parseUpdateStep(repeated[1]), count };
    },
    solve(slots) {
      let value = slots.start;
      for (let index = 0; index < slots.count; index += 1) {
        value = applyStep(value, slots.step);
      }
      return { value };
    },
    render(solution) {
      return `${solution.value}.`;
    },
    compute: [
      SLOTS,
      'let value = slots.start;',
      'for (let index = 0; index < slots.count; index += 1) {',
      '  if (slots.step.op === "add") { value = value + slots.step.operand; }',
      '  else if (slots.step.op === "subtract") { value = value - slots.step.operand; }',
      '  else if (slots.step.op === "multiply") { value = value * slots.step.operand; }',
      '  else { value = value / slots.step.operand; }',
      '}',
      'return value + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The number of repetitions is fixed, so the loop body runs exactly ${slots.count} times with no condition to check.`,
        `Each repetition adds the same amount, so the total change from ${slots.start} is a repeated addition.`,
        `The value after the last repetition is ${solution.value}.`
      ];
    }
  },
  {
    template: 'Loop until a threshold is reached',
    type: 'loop-until-a-threshold-is-reached',
    category: 'no-knowledge',
    parse(statement) {
      const start = Number(must(statement, /x starts at (\d+)/, 'the starting value is missing')[1]);
      const limit = Number(must(statement, /While x<(\d+)/, 'the loop threshold is missing')[1]);
      const step = parseUpdateStep(must(statement, /perform (\S+)/, 'the loop update is missing')[1]);
      return { start, limit, step };
    },
    solve(slots) {
      const values = [slots.start];
      let value = slots.start;
      while (value < slots.limit) {
        value = applyStep(value, slots.step);
        values.push(value);
      }
      return { values, value };
    },
    render(solution) {
      return `It stops at ${solution.value}.`;
    },
    compute: [
      SLOTS,
      'let value = slots.start;',
      'const values = [value];',
      'while (value < slots.limit) {',
      '  value = value + slots.step.operand;',
      '  values.push(value);',
      '}',
      'return "It stops at " + value + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The condition x<${slots.limit} is checked before every repetition, so the loop runs while the value is still below the threshold.`,
        `The running values are ${solution.values.join(' → ')}, and the update is applied at each step.`,
        `The first value that is not below the threshold is ${solution.value}, and the condition is then false, so the loop stops there.`
      ];
    }
  },
  {
    template: 'A loop that cannot stop',
    type: 'a-loop-that-cannot-stop',
    category: 'no-knowledge',
    parse(statement) {
      const start = Number(must(statement, /x starts at (\d+)/, 'the starting value is missing')[1]);
      const limit = Number(must(statement, /While x<(\d+)/, 'the loop threshold is missing')[1]);
      const step = parseUpdateStep(must(statement, /performs (x=[^ ]+)/, 'the loop update is missing')[1]);
      if (step.op !== 'subtract') {
        throw new Error('the loop update does not decrease the value');
      }
      return { start, limit, step: -step.operand };
    },
    solve(slots) {
      let value = slots.start;
      let steps = 0;
      while (value < slots.limit && steps < 1000) {
        value += slots.step;
        steps += 1;
      }
      return { stops: value >= slots.limit, value };
    },
    render(solution) {
      return solution.stops ? `Yes, at ${solution.value}.` : 'No.';
    },
    compute: [
      SLOTS,
      'let value = slots.start;',
      'let steps = 0;',
      'while (value < slots.limit && steps < 1000) { value = value + slots.step; steps += 1; }',
      'return value >= slots.limit ? "Yes, at " + value + "." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The condition asks whether x<${slots.limit}, and the body changes x by ${slots.step} each time.`,
        `Starting at ${slots.start}, the value moves farther away from the threshold instead of toward it.`,
        'The condition never becomes false, so the loop runs forever; the answer is No.'
      ];
    }
  },
  {
    template: 'If/else branch',
    type: 'if-else-branch',
    category: 'no-knowledge',
    parse(statement) {
      const branches = must(statement, /if x is even, y=([^;]+); otherwise y=([^.]+)\./, 'the two branch formulas are missing');
      return {
        x: Number(must(statement, /For x=(\d+)/, 'the tested value is missing')[1]),
        even: parseFormula(branches[1]),
        odd: parseFormula(branches[2])
      };
    },
    solve(slots) {
      const step = slots.x % 2 === 0 ? slots.even : slots.odd;
      return { y: applyStep(slots.x, step) };
    },
    render(solution) {
      return `${solution.y}.`;
    },
    compute: [
      SLOTS,
      'const step = slots.x % 2 === 0 ? slots.even : slots.odd;',
      'let y = slots.x;',
      'if (step.op === "add") { y = y + step.operand; }',
      'else if (step.op === "subtract") { y = y - step.operand; }',
      'else if (step.op === "multiply") { y = y * step.operand; }',
      'else { y = y / step.operand; }',
      'return y + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The branch is selected by the parity of x: an even x uses the first formula and an odd x uses the second.`,
        `For x=${slots.x} the value is odd, so the second formula applies.`,
        `Applying it gives y=${solution.y}.`
      ];
    }
  },
  {
    template: 'Nested branches',
    type: 'nested-branches',
    category: 'no-knowledge',
    parse(statement) {
      const letters = must(statement, /write ([A-Z]), otherwise ([A-Z]); if x≤\d+ write ([A-Z])/, 'the branch letters are missing');
      return {
        x: Number(must(statement, /for x=(\d+)/, 'the tested value is missing')[1]),
        threshold: Number(must(statement, /if x>(\d+)/, 'the outer threshold is missing')[1]),
        letters: { even: letters[1], odd: letters[2], nonPositive: letters[3] }
      };
    },
    solve(slots) {
      if (slots.x <= slots.threshold) {
        return { letter: slots.letters.nonPositive };
      }
      return { letter: slots.x % 2 === 0 ? slots.letters.even : slots.letters.odd };
    },
    render(solution) {
      return `${solution.letter}.`;
    },
    compute: [
      SLOTS,
      'if (slots.x <= slots.threshold) { return slots.letters.nonPositive + "."; }',
      'return (slots.x % 2 === 0 ? slots.letters.even : slots.letters.odd) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The outer branch first checks whether x is greater than ${slots.threshold}; the inner branch is reached only when that is true.`,
        `For x=${slots.x} the outer test succeeds, so the inner test on parity decides the letter.`,
        `The value is odd, so the program writes ${solution.letter}.`
      ];
    }
  },
  {
    template: 'Instruction order changes the result',
    type: 'instruction-order-changes-the-result',
    category: 'no-knowledge',
    parse(statement) {
      const p = must(statement, /Program P: ([^.]+)\./, 'program P is missing')[1];
      const q = must(statement, /Program Q: ([^.]+)\./, 'program Q is missing')[1];
      const split = (segment) => segment.split(', then ').map((part) => parseWordStep(part));
      return {
        input: Number(must(statement, /For input (\d+)/, 'the input is missing')[1]),
        p: split(p),
        q: split(q)
      };
    },
    solve(slots) {
      const run = (value, steps) => steps.reduce((current, step) => applyStep(current, step), value);
      const p = run(slots.input, slots.p);
      const q = run(slots.input, slots.q);
      return { p, q, same: p === q };
    },
    render(solution) {
      return solution.same ? `Yes; both give ${solution.p}.` : `No; P=${solution.p}, Q=${solution.q}.`;
    },
    compute: [
      SLOTS,
      'const run = (value, steps) => steps.reduce((current, step) => {',
      '  if (step.op === "add") { return current + step.operand; }',
      '  if (step.op === "subtract") { return current - step.operand; }',
      '  if (step.op === "multiply") { return current * step.operand; }',
      '  return current / step.operand;',
      '}, value);',
      'const p = run(slots.input, slots.p);',
      'const q = run(slots.input, slots.q);',
      'return p === q ? "Yes; both give " + p + "." : "No; P=" + p + ", Q=" + q + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The order of the instructions decides which operation sees the intermediate value, so swapping two non-commuting steps changes the outcome.',
        `Program P applies its steps to ${slots.input} to get ${solution.p}, and program Q applies its own order to get ${solution.q}.`,
        'The two results differ, so the programs are not equivalent.'
      ];
    }
  },
  {
    template: 'Debugging with a test case',
    type: 'debugging-with-a-test-case',
    category: 'no-knowledge',
    parse(statement) {
      return {
        x: Number(must(statement, /We test x=(\d+)/, 'the test value is missing')[1]),
        correct: parseWordStep(must(statement, /should calculate ([^,]+), but it uses/, 'the correct rule is missing')[1]),
        wrong: parseFormula(must(statement, /uses the formula ([^.]+)\./, 'the incorrect formula is missing')[1])
      };
    },
    solve(slots) {
      return { correct: applyStep(slots.x, slots.correct), actual: applyStep(slots.x, slots.wrong) };
    },
    render(solution) {
      return `Correct result ${solution.correct}; the program produces ${solution.actual}.`;
    },
    compute: [
      SLOTS,
      'const apply = (value, step) => {',
      '  if (step.op === "add") { return value + step.operand; }',
      '  if (step.op === "subtract") { return value - step.operand; }',
      '  if (step.op === "multiply") { return value * step.operand; }',
      '  return value / step.operand;',
      '};',
      'return "Correct result " + apply(slots.x, slots.correct) + "; the program produces " + apply(slots.x, slots.wrong) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A test case compares what the program should do with what it does for one input; here the input is ${slots.x}.`,
        `The intended rule gives ${solution.correct}, while the faulty formula gives ${solution.actual}.`,
        'The two values differ, which is exactly the evidence that the program contains a bug.'
      ];
    }
  },
  {
    template: 'Choose a test case that finds the bug',
    type: 'choose-a-test-case-that-finds-the-bug',
    category: 'no-knowledge',
    parse(statement) {
      const candidates = must(statement, /Of x=(\d+) and x=(\d+)/, 'the candidate test values are missing');
      return {
        correct: parseFormula(must(statement, /correct rule is ([^;]+);/, 'the correct rule is missing')[1]),
        wrong: parseFormula(must(statement, /incorrect program is ([^.]+)\./, 'the incorrect program is missing')[1]),
        candidates: [Number(candidates[1]), Number(candidates[2])]
      };
    },
    solve(slots) {
      const revealing = slots.candidates.filter((x) => applyStep(x, slots.correct) !== applyStep(x, slots.wrong));
      return { revealing, candidates: slots.candidates };
    },
    render(solution) {
      if (solution.revealing.length === 0) {
        return 'Neither.';
      }
      const listed = solution.revealing.map((x) => `x=${x}`).join(' and ');
      return solution.revealing.length === solution.candidates.length ? `Both: ${listed}.` : `${listed}.`;
    },
    compute: [
      SLOTS,
      'const apply = (value, step) => {',
      '  if (step.op === "add") { return value + step.operand; }',
      '  if (step.op === "subtract") { return value - step.operand; }',
      '  if (step.op === "multiply") { return value * step.operand; }',
      '  return value / step.operand;',
      '};',
      'const revealing = slots.candidates.filter((x) => apply(x, slots.correct) !== apply(x, slots.wrong));',
      'if (revealing.length === 0) { return "Neither."; }',
      'const listed = revealing.map((x) => "x=" + x).join(" and ");',
      'return revealing.length === slots.candidates.length ? "Both: " + listed + "." : listed + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A test case reveals a bug only when the correct rule and the faulty program disagree on that input.',
        `For this pair of rules the values ${solution.candidates.map((x) => `x=${x}`).join(' and ')} are tested against both behaviours.`,
        `Every candidate distinguishes the two, so the answer is: ${solution.revealing.map((x) => `x=${x}`).join(' and ')}.`
      ];
    }
  }
];
