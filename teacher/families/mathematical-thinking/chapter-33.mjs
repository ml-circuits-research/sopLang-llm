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

export const unit = 33;
export const cases = [
  {
    template: 'Linear search in a list',
    type: 'linear-search-in-a-list',
    category: 'no-knowledge',
    parse(statement) {
      return { list: firstList(statement), target: Number(must(statement, /stops when it finds (\d+)/, 'the searched value is missing')[1]) };
    },
    solve(slots) {
      const index = slots.list.indexOf(slots.target);
      if (index === -1) {
        throw new Error('the target does not appear in the list');
      }
      return { comparisons: index + 1 };
    },
    render(solution) {
      return `${solution.comparisons} comparisons.`;
    },
    compute: [
      SLOTS,
      'const index = slots.list.indexOf(slots.target);',
      'if (index === -1) { throw new Error("the target does not appear in the list"); }',
      'return (index + 1) + " comparisons.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The algorithm walks the list from the left and stops at the first match, so each visited element costs exactly one comparison.',
        `The elements ${slots.list.slice(0, solution.comparisons).join(', ')} are compared one by one, and the last of them is ${slots.target}.`,
        `That is ${solution.comparisons} comparisons; the elements after the match are never touched.`
      ];
    }
  },
  {
    template: 'Unsuccessful search',
    type: 'unsuccessful-search',
    category: 'no-knowledge',
    parse(statement) {
      return { list: firstList(statement), target: Number(must(statement, /searched linearly for the value (\d+)/, 'the searched value is missing')[1]) };
    },
    solve(slots) {
      const index = slots.list.indexOf(slots.target);
      return { comparisons: index === -1 ? slots.list.length : index + 1 };
    },
    render(solution) {
      return `${solution.comparisons} comparisons.`;
    },
    compute: [
      SLOTS,
      'const index = slots.list.indexOf(slots.target);',
      'return (index === -1 ? slots.list.length : index + 1) + " comparisons.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'An unsuccessful search has no match that can end it early, so every element must be examined.',
        `Testing all ${slots.list.length} elements and finding none equal to ${slots.target} is what licenses saying that the value is absent.`,
        `The answer is therefore ${solution.comparisons} comparisons, one per element.`
      ];
    }
  },
  {
    template: 'Search in a sorted list by halving',
    type: 'search-in-a-sorted-list-by-halving',
    category: 'no-knowledge',
    parse(statement) {
      const list = listOf(must(statement, /sorted list is \[([0-9,\s]+)\]/, 'the sorted list is missing')[1]);
      return { list, target: Number(must(statement, /We search for (\d+)/, 'the searched value is missing')[1]) };
    },
    solve(slots) {
      const probes = binaryProbes(slots.list, slots.target);
      if (probes.length < 2) {
        throw new Error('the search stops at the first probe, so there is no next element');
      }
      return { next: probes[1] };
    },
    render(solution) {
      return `${solution.next}.`;
    },
    compute: [
      SLOTS,
      'const probes = [];',
      'let low = 0;',
      'let high = slots.list.length - 1;',
      'while (low <= high) {',
      '  const middle = Math.floor((low + high) / 2);',
      '  probes.push(slots.list[middle]);',
      '  if (slots.list[middle] === slots.target) { break; }',
      '  if (slots.list[middle] < slots.target) { low = middle + 1; } else { high = middle - 1; }',
      '}',
      'if (probes.length < 2) { throw new Error("the search stops at the first probe, so there is no next element"); }',
      'return probes[1] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The first probe is the middle of the whole list; because the target is larger, the half to its left is discarded and only the larger items remain.',
        `The next probe is the middle of that remaining part, which is ${solution.next}.`,
        'Each step halves the candidates, so a sorted list needs far fewer checks than a linear scan.'
      ];
    }
  },
  {
    template: 'Why sorting helps binary search',
    type: 'why-sorting-helps-binary-search',
    category: 'no-knowledge',
    parse(statement) {
      const direction = must(statement, /target is (larger|smaller) than the middle/, 'the comparison rule is missing')[1];
      if (!/unsorted list/.test(statement)) {
        throw new Error('the question does not describe an unsorted list');
      }
      return { direction, sorted: false };
    },
    solve(slots) {
      if (slots.sorted) {
        throw new Error('a sorted list keeps the discard rule safe');
      }
      return { reason: 'Because without sorting, position gives no reliable information about size.' };
    },
    render(solution) {
      return solution.reason;
    },
    compute: [
      SLOTS,
      'if (slots.sorted) { throw new Error("a sorted list keeps the discard rule safe"); }',
      'return "Because without sorting, position gives no reliable information about size.";'
    ].join('\n'),
    explain() {
      return [
        'Halving works because the middle element splits the list into a smaller part and a larger part, and the comparison tells us which part to keep.',
        'That guarantee is produced by the sort: in a sorted list every item left of the middle is smaller and every item right of it is larger.',
        'Without that order an element larger than the middle can sit anywhere, so discarding a whole side could throw away the target.'
      ];
    }
  },
  {
    template: 'One pass of sorting by swaps',
    type: 'one-pass-of-sorting-by-swaps',
    category: 'no-knowledge',
    parse(statement) {
      return { list: firstList(statement) };
    },
    solve(slots) {
      const list = [...slots.list];
      for (let index = 0; index + 1 < list.length; index += 1) {
        if (list[index] > list[index + 1]) {
          const held = list[index];
          list[index] = list[index + 1];
          list[index + 1] = held;
        }
      }
      return { list };
    },
    render(solution) {
      return `[${solution.list.join(',')}].`;
    },
    compute: [
      SLOTS,
      'const list = [...slots.list];',
      'for (let index = 0; index + 1 < list.length; index += 1) {',
      '  if (list[index] > list[index + 1]) {',
      '    const held = list[index];',
      '    list[index] = list[index + 1];',
      '    list[index + 1] = held;',
      '  }',
      '}',
      'return "[" + list.join(",") + "].";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `One pass visits the neighboring pairs (${slots.list.slice(0, -1).map((value, index) => `${value},${slots.list[index + 1]}`).join('), (')}) from left to right and swaps a pair only when it descends.`,
        'A larger element therefore travels one position to the right per pass, while a smaller element can move left across several pairs at once.',
        `After the full pass the list reads ${solution.list.join(', ')}.`
      ];
    }
  },
  {
    template: 'Sorting by selecting the minimum',
    type: 'sorting-by-selecting-the-minimum',
    category: 'no-knowledge',
    parse(statement) {
      return { list: firstList(statement) };
    },
    solve(slots) {
      const list = [...slots.list];
      let smallest = 0;
      for (let index = 1; index < list.length; index += 1) {
        if (list[index] < list[smallest]) {
          smallest = index;
        }
      }
      const held = list[0];
      list[0] = list[smallest];
      list[smallest] = held;
      return { list, smallest };
    },
    render(solution) {
      return `[${solution.list.join(',')}].`;
    },
    compute: [
      SLOTS,
      'const list = [...slots.list];',
      'let smallest = 0;',
      'for (let index = 1; index < list.length; index += 1) {',
      '  if (list[index] < list[smallest]) { smallest = index; }',
      '}',
      'const held = list[0];',
      'list[0] = list[smallest];',
      'list[smallest] = held;',
      'return "[" + list.join(",") + "].";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The algorithm scans the list once to locate the smallest element, which is ${solution.list[0]} here.`,
        'It then exchanges that element with the element currently in the first position, so exactly one swap puts the minimum at the front.',
        `The remaining elements keep their relative order, and the list becomes ${solution.list.join(', ')}.`
      ];
    }
  },
  {
    template: 'Algorithm with a counter',
    type: 'algorithm-with-a-counter',
    category: 'no-knowledge',
    parse(statement) {
      return {
        start: Number(must(statement, /starts with c=(\d+)/, 'the starting counter is missing')[1]),
        list: firstList(statement),
        increment: Number(must(statement, /it adds (\d+) to c/, 'the increment is missing')[1])
      };
    },
    solve(slots) {
      const even = slots.list.filter((value) => value % 2 === 0).length;
      return { value: slots.start + slots.increment * even };
    },
    render(solution) {
      return `${solution.value}.`;
    },
    compute: [
      SLOTS,
      'const even = slots.list.filter((value) => value % 2 === 0).length;',
      'return (slots.start + slots.increment * even) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The counter begins at ${slots.start} and the rule adds ${slots.increment} once for every even number in the list.`,
        `Scanning ${slots.list.join(', ')} keeps the even values and discards the odd ones.`,
        `The final counter is therefore ${solution.value}.`
      ];
    }
  },
  {
    template: 'Algorithm with an accumulated sum',
    type: 'algorithm-with-an-accumulated-sum',
    category: 'no-knowledge',
    parse(statement) {
      return {
        start: Number(must(statement, /starts with s=(\d+)/, 'the starting sum is missing')[1]),
        list: firstList(statement)
      };
    },
    solve(slots) {
      return { value: slots.start + slots.list.reduce((total, value) => total + value, 0) };
    },
    render(solution) {
      return `${solution.value}.`;
    },
    compute: [
      SLOTS,
      'return (slots.start + slots.list.reduce((total, value) => total + value, 0)) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The accumulator starts at ${slots.start} and the loop performs one addition per element.`,
        `The running value grows through ${slots.list.reduce((values, value) => [...values, values[values.length - 1] + value], [slots.start]).join(' → ')}.`,
        `After the last element the accumulator holds ${solution.value}.`
      ];
    }
  },
  {
    template: 'Algorithm with a filter before summing',
    type: 'algorithm-with-a-filter-before-summing',
    category: 'no-knowledge',
    parse(statement) {
      return {
        start: Number(must(statement, /Start with s=(\d+)/, 'the starting sum is missing')[1]),
        list: firstList(statement),
        threshold: Number(must(statement, /if x<(\d+)/, 'the filter threshold is missing')[1])
      };
    },
    solve(slots) {
      const kept = slots.list.filter((value) => value < slots.threshold);
      return { value: slots.start + kept.reduce((total, value) => total + value, 0), kept };
    },
    render(solution) {
      return `${solution.value}.`;
    },
    compute: [
      SLOTS,
      'const kept = slots.list.filter((value) => value < slots.threshold);',
      'return (slots.start + kept.reduce((total, value) => total + value, 0)) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The branch adds an element only when it is smaller than ${slots.threshold}, so the filter runs before every addition.`,
        `From ${slots.list.join(', ')} only ${solution.kept.join(' and ')} pass the test, and the others are ignored.`,
        `Adding the surviving elements to the starting sum ${slots.start} gives ${solution.value}.`
      ];
    }
  }
];
