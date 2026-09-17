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
    template: 'Precondition for an operation',
    type: 'precondition-for-an-operation',
    category: 'no-knowledge',
    parse(statement) {
      const precondition = must(statement, /([a-z]≠\d+)/, 'the input rule is missing')[1];
      return {
        precondition,
        forbidden: Number(must(precondition, /≠(\d+)/, 'the forbidden value is missing')[1]),
        tested: Number(must(statement, /Why is x=(\d+)/, 'the questioned input is missing')[1])
      };
    },
    solve(slots) {
      if (slots.tested !== slots.forbidden) {
        throw new Error('the questioned input satisfies the precondition');
      }
      return { precondition: slots.precondition };
    },
    render(solution) {
      return `Because it violates the precondition ${solution.precondition}.`;
    },
    compute: [
      SLOTS,
      'if (slots.tested !== slots.forbidden) { throw new Error("the questioned input satisfies the precondition"); }',
      'return "Because it violates the precondition " + slots.precondition + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The algorithm declares the input rule ${slots.precondition} before it divides, and a precondition is a promise the caller must keep.`,
        `The value ${slots.tested} is exactly the value the rule forbids, so the promise is broken.`,
        'Division by that value has no defined result, which is why the operation is not allowed for this input.'
      ];
    }
  },
  {
    template: 'Verifying a postcondition',
    type: 'verifying-a-postcondition',
    category: 'no-knowledge',
    parse(statement) {
      return {
        x: Number(must(statement, /For x=(\d+)/, 'the input is missing')[1]),
        formula: must(statement, /produces y=([^.]+)\./, 'the formula for y is missing')[1]
      };
    },
    solve(slots) {
      const y = evalXExpr(slots.formula, slots.x);
      return { y, even: y % 2 === 0 };
    },
    render(solution) {
      return solution.even ? `Yes, y=${solution.y} is even.` : `No, y=${solution.y} is odd.`;
    },
    compute: [
      SLOTS,
      'const y = String(slots.formula).split("+").reduce((total, term) => {',
      '  const cleaned = term.trim();',
      '  if (cleaned === "x") { return total + slots.x; }',
      '  const product = cleaned.match(/^(\\d+)[×*]x$/);',
      '  if (product !== null) { return total + Number(product[1]) * slots.x; }',
      '  return total + Number(cleaned);',
      '}, 0);',
      'return y % 2 === 0 ? "Yes, y=" + y + " is even." : "No, y=" + y + " is odd.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Running the formula ${slots.formula} on x=${slots.x} produces y=${solution.y}.`,
        'A postcondition is checked after the computation, so the promise is tested against the produced value rather than assumed.',
        `The value ${solution.y} can be split into pairs with nothing left over, so the promise holds.`
      ];
    }
  },
  {
    template: 'Invariant in a transfer loop',
    type: 'invariant-in-a-transfer-loop',
    category: 'no-knowledge',
    parse(statement) {
      const deltas = must(statement, /\(A,B\)→\(A([+-]\d+),B([+-]\d+)\)/, 'the operation is missing');
      return { deltaA: Number(deltas[1]), deltaB: Number(deltas[2]) };
    },
    solve(slots) {
      if (slots.deltaA + slots.deltaB !== 0) {
        throw new Error('the operation does not preserve the sum');
      }
      return {};
    },
    render() {
      return 'The sum A+B.';
    },
    compute: [
      SLOTS,
      'if (slots.deltaA + slots.deltaB !== 0) { throw new Error("the operation does not preserve the sum"); }',
      'return "The sum A+B.";'
    ].join('\n'),
    explain(slots) {
      return [
        'An invariant is a quantity that every step of the loop leaves unchanged, so it is checked across one operation.',
        `The operation changes A by ${slots.deltaA} and B by ${slots.deltaB}, so the two changes cancel in the total.`,
        'Adding both coordinates gives (A-1)+(B+1)=A+B, so the sum A+B is the quantity that stays fixed.'
      ];
    }
  },
  {
    template: 'Reversible algorithm',
    type: 'reversible-algorithm',
    category: 'no-knowledge',
    parse(statement) {
      const segment = must(statement, /performs ([^.]+)\./, 'the update steps are missing')[1];
      return {
        steps: segment.split(', then ').map((part) => parseUpdateStep(part)),
        output: Number(must(statement, /output is (\d+)/, 'the output value is missing')[1])
      };
    },
    solve(slots) {
      let value = slots.output;
      for (let index = slots.steps.length - 1; index >= 0; index -= 1) {
        const step = slots.steps[index];
        if (step.op === 'add') {
          value -= step.operand;
        } else if (step.op === 'subtract') {
          value += step.operand;
        } else if (step.op === 'multiply') {
          value /= step.operand;
        } else {
          value *= step.operand;
        }
      }
      return { input: value };
    },
    render(solution) {
      return `${solution.input}.`;
    },
    compute: [
      SLOTS,
      'let value = slots.output;',
      'for (let index = slots.steps.length - 1; index >= 0; index -= 1) {',
      '  const step = slots.steps[index];',
      '  if (step.op === "add") { value = value - step.operand; }',
      '  else if (step.op === "subtract") { value = value + step.operand; }',
      '  else if (step.op === "multiply") { value = value / step.operand; }',
      '  else { value = value * step.operand; }',
      '}',
      'return value + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Each step of the forward algorithm is undone by the opposite of that step, applied in the reverse order.',
        `Starting from the output ${slots.output} and dividing before subtracting recovers the intermediate and the input.`,
        `The recovered input is ${solution.input}.`
      ];
    }
  },
  {
    template: 'Irreversible algorithm because information is lost',
    type: 'irreversible-algorithm-because-information-is-lost',
    category: 'no-knowledge',
    parse(statement) {
      const outputs = must(statement, /outputs (\d+) if x is even and (\d+) if x is odd/, 'the parity outputs are missing');
      return {
        evenOutput: Number(outputs[1]),
        oddOutput: Number(outputs[2]),
        output: Number(must(statement, /If the output is (\d+)/, 'the produced output is missing')[1]),
        candidates: listOf(must(statement, /among ([0-9,\s]+)/, 'the candidate inputs are missing')[1])
      };
    },
    solve(slots) {
      const matching = slots.candidates.filter((x) => (x % 2 === 0 ? slots.evenOutput : slots.oddOutput) === slots.output);
      return { matching, single: matching.length === 1 };
    },
    render(solution) {
      return solution.single ? `Yes; x must be ${solution.matching[0]}.` : `No; x can be ${joinOr(solution.matching)}.`;
    },
    compute: [
      SLOTS,
      'const matching = slots.candidates.filter((x) => (x % 2 === 0 ? slots.evenOutput : slots.oddOutput) === slots.output);',
      'if (matching.length === 1) { return "Yes; x must be " + matching[0] + "."; }',
      'if (matching.length === 2) { return "No; x can be " + matching[0] + " or " + matching[1] + "."; }',
      'return "No; x can be " + matching.slice(0, -1).join(", ") + ", or " + matching[matching.length - 1] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The rule keeps only the parity of x, so every candidate that shares a parity produces the same output ${slots.output}.`,
        `Checking the candidates ${slots.candidates.join(', ')} shows that ${solution.matching.join(' and ')} all produce that output.`,
        'More than one input leads to the same output, so the exact input cannot be recovered from the output alone.'
      ];
    }
  },
  {
    template: 'Compression by counting repetitions',
    type: 'compression-by-counting-repetitions',
    category: 'no-knowledge',
    parse(statement) {
      return { text: must(statement, /How is (\w+) encoded/, 'the text to encode is missing')[1] };
    },
    solve(slots) {
      let encoded = '';
      let index = 0;
      while (index < slots.text.length) {
        let run = 1;
        while (index + run < slots.text.length && slots.text[index + run] === slots.text[index]) {
          run += 1;
        }
        encoded += `${run}${slots.text[index]}`;
        index += run;
      }
      return { encoded };
    },
    render(solution) {
      return `${solution.encoded}.`;
    },
    compute: [
      SLOTS,
      'const text = String(slots.text);',
      'let encoded = "";',
      'let index = 0;',
      'while (index < text.length) {',
      '  let run = 1;',
      '  while (index + run < text.length && text[index + run] === text[index]) { run += 1; }',
      '  encoded += run + text[index];',
      '  index += run;',
      '}',
      'return encoded + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The encoder splits the text into maximal runs of one symbol, because a run of length one must also be written explicitly.',
        `The text ${slots.text} becomes the groups ${solution.encoded.replace(/(\d)(.)/g, '$1$2 ').trim().replace(/ /g, ', ')}.`,
        `Writing each group as its count followed by the symbol gives ${solution.encoded}.`
      ];
    }
  },
  {
    template: 'Decoding a compressed representation',
    type: 'decoding-a-compressed-representation',
    category: 'knowledge',
    sharedPremise: 'The previous problem defines the encoding rule that writes each run of a repeated symbol as the number of repetitions followed by the symbol, so AAAABBCC becomes 4A2B2C.',
    facts: "{\"rule\":\"count-symbol\",\"description\":\"a run of one symbol is written as the number of repetitions followed by the symbol\",\"example\":{\"AAAABBCC\":\"4A2B2C\"}}",
    compute: [
      'const slots = $slots;',
      'const rule = $facts;',
      'if (rule.rule !== "count-symbol") { throw new Error("the fact wire does not define the count-symbol rule"); }',
      'let decoded = "";',
      'for (const match of String(slots.encoded).matchAll(/(\\d+)(.)/g)) {',
      '  decoded += String(match[2]).repeat(Number(match[1]));',
      '}',
      'return decoded + ".";'
    ].join('\n'),
    parse(statement) {
      return { encoded: must(statement, /decode ([^\s.]+)\./, 'the compressed text is missing')[1] };
    },
    solve(slots) {
      let decoded = '';
      for (const match of String(slots.encoded).matchAll(/(\d+)(.)/g)) {
        decoded += match[2].repeat(Number(match[1]));
      }
      return { decoded };
    },
    render(solution) {
      return `${solution.decoded}.`;
    },
    explain(slots, solution) {
      return [
        'The encoding rule comes from the previous problem, so the circuit carries it explicitly in a fact wire instead of assuming it.',
        `The rule reads each piece as a repetition count followed by the symbol it repeats, so ${slots.encoded} splits into a count and a symbol per group.`,
        `Expanding each group gives ${solution.decoded}.`
      ];
    }
  },
  {
    template: 'Compare two algorithms by number of steps',
    type: 'compare-two-algorithms-by-number-of-steps',
    category: 'no-knowledge',
    parse(statement) {
      return {
        list: firstList(statement),
        target: Number(must(statement, /To find (\d+) in/, 'the searched value is missing')[1])
      };
    },
    solve(slots) {
      const linear = slots.list.indexOf(slots.target) + 1;
      if (linear === 0) {
        throw new Error('the target does not appear in the list');
      }
      return { linear, halving: binaryProbes(slots.list, slots.target).length };
    },
    render(solution) {
      return `L: ${solution.linear}; H: ${solution.halving}.`;
    },
    compute: [
      SLOTS,
      'const linear = slots.list.indexOf(slots.target) + 1;',
      'if (linear === 0) { throw new Error("the target does not appear in the list"); }',
      'let low = 0;',
      'let high = slots.list.length - 1;',
      'let halving = 0;',
      'while (low <= high) {',
      '  const middle = Math.floor((low + high) / 2);',
      '  halving += 1;',
      '  if (slots.list[middle] === slots.target) { break; }',
      '  if (slots.list[middle] < slots.target) { low = middle + 1; } else { high = middle - 1; }',
      '}',
      'return "L: " + linear + "; H: " + halving + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Algorithm L visits the list in order, so the target ${slots.target} is found only after all preceding elements are compared: ${solution.linear} comparisons.`,
        'Algorithm H uses the sorted order: it tests the middle, then keeps the half that can still contain the target.',
        `Halving the candidates reaches ${slots.target} in ${solution.halving} comparisons, which is fewer than the linear scan.`
      ];
    }
  }
];
