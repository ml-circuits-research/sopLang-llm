/**
 * Families for chapter 38 of the mathematical seed book: binary codes, bits,
 * and parity.
 *
 * A family covers one printed template. It provides the reference parse that a
 * `modelCall` stage would perform, an independent computation, the answer text
 * the source prints, the SOP Lang computation body that the circuit executes,
 * and the explanation lines of the example. Twenty-four templates state every
 * premise they need, so they are `no-knowledge`; decoding with the dictionary of
 * the previous problem has to materialize that dictionary, so it is a
 * `knowledge` case whose circuit carries a `@facts literal` wire.
 */

export const unit = 38;

const COLOR_CODES = { red: 2, green: 5, blue: 7 };

function digitsOf(text) {
  return String(text)
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .map(Number);
}

function onesIn(word) {
  let ones = 0;
  for (const digit of String(word)) {
    if (digit === '1') {
      ones += 1;
    }
  }
  return ones;
}

function checkDigit(sum) {
  return ((sum % 10) + 10) % 10;
}

function mappingFrom(statement) {
  const mapping = {};
  for (const match of statement.matchAll(/([A-Z])=(\d+)/g)) {
    mapping[match[1]] = match[2];
  }
  return mapping;
}

function allDecodings(codes, target) {
  const entries = Object.entries(codes);
  const results = [];
  const walk = (index, path) => {
    if (index === target.length) {
      results.push([...path]);
      return;
    }
    for (const [symbol, code] of entries) {
      if (code !== '' && target.startsWith(code, index)) {
        path.push(symbol);
        walk(index + code.length, path);
        path.pop();
      }
    }
  };
  walk(0, []);
  return results;
}

function weightedValue(weights, code) {
  let value = 0;
  for (let index = 0; index < weights.length; index += 1) {
    value += weights[index] * Number(code[index]);
  }
  return value;
}

export const cases = [
  {
    template: 'Binary code with two positions',
    type: 'binary-code-with-two-positions',
    category: 'no-knowledge',
    parse(statement) {
      const positionsMatch = statement.match(/has (\d+) positions?/);
      if (positionsMatch === null) {
        throw new Error('no position count found');
      }
      const symbolMatch = statement.match(/can be (\S+) or (\S+)/);
      if (symbolMatch === null) {
        throw new Error('no symbol alphabet found');
      }
      const symbols = [symbolMatch[1], symbolMatch[2]].map((symbol) => symbol.replace(/[^0-9A-Za-z]/g, ''));
      return { positions: Number(positionsMatch[1]), symbols };
    },
    solve(slots) {
      if (!Number.isInteger(slots.positions) || slots.positions < 1) {
        throw new Error('invalid position count');
      }
      const codes = [];
      const total = Math.pow(slots.symbols.length, slots.positions);
      for (let value = 0; value < total; value += 1) {
        let rest = value;
        const digits = [];
        for (let index = 0; index < slots.positions; index += 1) {
          digits.unshift(slots.symbols[rest % slots.symbols.length]);
          rest = Math.floor(rest / slots.symbols.length);
        }
        codes.push(digits.join(''));
      }
      return { codes };
    },
    render(solution) {
      return `${solution.codes.join(', ')}.`;
    },
    wires: [
      {
        name: 'codes', command: 'jsEval', body: [
          'const slots = $slots;',
          'if (!Number.isInteger(slots.positions) || slots.positions < 1) { throw new Error("invalid position count"); }',
          'const symbols = slots.symbols;',
          'const codes = [];',
          'const total = Math.pow(symbols.length, slots.positions);',
          'for (let value = 0; value < total; value += 1) {',
          '  let rest = value;',
          '  const digits = [];',
          '  for (let index = 0; index < slots.positions; index += 1) {',
          '    digits.unshift(symbols[rest % symbols.length]);',
          '    rest = Math.floor(rest / symbols.length);',
          '  }',
          '  codes.push(digits.join(""));',
          '}',
          'return codes;'
        ].join('\n')
      }
    ],
    compute: ['return $codes.join(", ") + ".";'].join('\n'),
    explain(slots, solution) {
      return [
        `The code has ${slots.positions} positions and each position can take ${slots.symbols.length} symbols, so the choices are independent.`,
        'Counting every combination in positional order, from all symbols equal to the first one up to all equal to the last, visits each code exactly once.',
        `The complete list has ${solution.codes.length} codes: ${solution.codes.join(', ')}.`
      ];
    }
  },
  {
    template: 'Binary value from given weights',
    type: 'binary-value-from-given-weights',
    category: 'no-knowledge',
    parse(statement) {
      const weightsMatch = statement.match(/values ([\d,\s]+)\./);
      const codeMatch = statement.match(/does (\d+) represent/);
      if (weightsMatch === null || codeMatch === null) {
        throw new Error('no weights or bit string found');
      }
      return { weights: digitsOf(weightsMatch[1]), code: codeMatch[1] };
    },
    solve(slots) {
      if (slots.code.length !== slots.weights.length) {
        throw new Error('the bit string does not match the number of weights');
      }
      return { value: weightedValue(slots.weights, slots.code) };
    },
    render(solution) {
      return `${solution.value}.`;
    },
    compute: [
      'const slots = $slots;',
      'if (String(slots.code).length !== slots.weights.length) { throw new Error("the bit string does not match the number of weights"); }',
      'let value = 0;',
      'for (let index = 0; index < slots.weights.length; index += 1) {',
      '  value += slots.weights[index] * Number(slots.code[index]);',
      '}',
      'return value + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each position carries a weight (${slots.weights.join(', ')}), and a bit says whether that weight is included.`,
        `Multiplying every bit of ${slots.code} by its weight and adding the results gives ${solution.value}.`,
        'A bit equal to 0 contributes nothing, so only the positions with 1 count.'
      ];
    }
  },
  {
    template: 'Build the binary code for a value',
    type: 'build-the-binary-code-for-a-value',
    category: 'no-knowledge',
    parse(statement) {
      const weightsMatch = statement.match(/weights ([\d,\s]+),/);
      const valueMatch = statement.match(/represents (\d+)/);
      if (weightsMatch === null || valueMatch === null) {
        throw new Error('no weights or target value found');
      }
      return { weights: digitsOf(weightsMatch[1]), value: Number(valueMatch[1]) };
    },
    solve(slots) {
      let remaining = slots.value;
      let code = '';
      for (const weight of slots.weights) {
        if (remaining >= weight) {
          code += '1';
          remaining -= weight;
        } else {
          code += '0';
        }
      }
      if (remaining !== 0) {
        throw new Error('the value cannot be represented with these weights');
      }
      return { code };
    },
    render(solution) {
      return `${solution.code}.`;
    },
    compute: [
      'const slots = $slots;',
      'let remaining = slots.value;',
      'let code = "";',
      'for (const weight of slots.weights) {',
      '  if (remaining >= weight) {',
      '    code += "1";',
      '    remaining -= weight;',
      '  } else {',
      '    code += "0";',
      '  }',
      '}',
      'if (remaining !== 0) { throw new Error("the value cannot be represented with these weights"); }',
      'return code + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Taking the largest weights first and including one whenever it still fits builds the code greedily: 4 fits into ${slots.value}, so the first bit is 1.`,
        `The remaining amount is then tested against 2 and against 1 in turn.`,
        `The greedy choices leave nothing over and produce the code ${solution.code}.`
      ];
    }
  },
  {
    template: 'Largest value with three bits',
    type: 'largest-value-with-three-bits',
    category: 'no-knowledge',
    parse(statement) {
      const weightsMatch = statement.match(/weights ([\d,\s]+),/);
      if (weightsMatch === null) {
        throw new Error('no weights found');
      }
      return { weights: digitsOf(weightsMatch[1]) };
    },
    solve(slots) {
      const maximum = slots.weights.reduce((total, weight) => total + weight, 0);
      return { maximum };
    },
    render(solution) {
      return `${solution.maximum}.`;
    },
    compute: [
      'const slots = $slots;',
      'let maximum = 0;',
      'for (const weight of slots.weights) {',
      '  maximum += weight;',
      '}',
      'return maximum + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The largest value is reached when every bit is 1, because each 1 adds its weight while each 0 adds nothing.',
        `Adding all the weights (${slots.weights.join(' + ')}) gives ${solution.maximum}.`
      ];
    }
  },
  {
    template: 'Even parity bit',
    type: 'even-parity-bit',
    category: 'no-knowledge',
    parse(statement) {
      const messageMatch = statement.match(/message (\d+)/);
      if (messageMatch === null) {
        throw new Error('no message found');
      }
      return { message: messageMatch[1] };
    },
    solve(slots) {
      return { bit: onesIn(slots.message) % 2 === 0 ? 0 : 1 };
    },
    render(solution) {
      return `${solution.bit}.`;
    },
    compute: [
      'const slots = $slots;',
      'let ones = 0;',
      'for (const digit of String(slots.message)) {',
      '  if (digit === "1") ones += 1;',
      '}',
      'return (ones % 2 === 0 ? 0 : 1) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The check bit must make the total number of 1-bits even.`,
        `The message ${slots.message} already has ${onesIn(slots.message)} ones, so the check bit is ${solution.bit}.`,
        solution.bit === 0
          ? 'Adding 0 leaves the count unchanged and it stays even.'
          : 'Adding 1 turns an odd count into an even one.'
      ];
    }
  },
  {
    template: 'Even parity when the number of ones is odd',
    type: 'even-parity-when-the-number-of-ones-is-odd',
    category: 'no-knowledge',
    parse(statement) {
      const messageMatch = statement.match(/message (\d+)/);
      if (messageMatch === null) {
        throw new Error('no message found');
      }
      return { message: messageMatch[1] };
    },
    solve(slots) {
      return { bit: onesIn(slots.message) % 2 === 0 ? 0 : 1 };
    },
    render(solution) {
      return `${solution.bit}.`;
    },
    compute: [
      'const slots = $slots;',
      'let ones = 0;',
      'for (const digit of String(slots.message)) {',
      '  if (digit === "1") ones += 1;',
      '}',
      'return (ones % 2 === 0 ? 0 : 1) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The message ${slots.message} has ${onesIn(slots.message)} ones, which is an odd count.`,
        `A check bit of 1 adds one more 1 and makes the total even, so the bit to add is ${solution.bit}.`
      ];
    }
  },
  {
    template: 'Detecting an error with parity',
    type: 'detecting-an-error-with-parity',
    category: 'no-knowledge',
    parse(statement) {
      const receivedMatch = statement.match(/receive (\d+)/);
      if (receivedMatch === null) {
        throw new Error('no received word found');
      }
      return { received: receivedMatch[1] };
    },
    solve(slots) {
      return { valid: onesIn(slots.received) % 2 === 0 };
    },
    render(solution) {
      return solution.valid ? 'The message is valid.' : 'The message is invalid / an error is detected.';
    },
    compute: [
      'const slots = $slots;',
      'let ones = 0;',
      'for (const digit of String(slots.received)) {',
      '  if (digit === "1") ones += 1;',
      '}',
      'return ones % 2 === 0 ? "The message is valid." : "The message is invalid / an error is detected.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A word is valid when it contains an even number of 1-bits, so counting the ones decides the test.',
        `The received word ${slots.received} has ${onesIn(slots.received)} ones, an odd count that breaks the rule.`,
        'Therefore an error is detected and the message is invalid.'
      ];
    }
  },
  {
    template: 'Limitation of parity: two errors can go undetected',
    type: 'limitation-of-parity-two-errors-can-go-undetected',
    category: 'no-knowledge',
    parse(statement) {
      const originalMatch = statement.match(/valid word (\d+)/);
      const nextMatch = statement.match(/(\d+)\s*→\s*(\d+)/);
      if (originalMatch === null || nextMatch === null) {
        throw new Error('no original or changed word found');
      }
      return { original: originalMatch[1], next: nextMatch[2] };
    },
    solve(slots) {
      return { paritySame: onesIn(slots.original) % 2 === onesIn(slots.next) % 2 };
    },
    render(solution) {
      return solution.paritySame ? 'No.' : 'Yes.';
    },
    compute: [
      'const slots = $slots;',
      'let first = 0;',
      'for (const digit of String(slots.original)) {',
      '  if (digit === "1") first += 1;',
      '}',
      'let second = 0;',
      'for (const digit of String(slots.next)) {',
      '  if (digit === "1") second += 1;',
      '}',
      'return first % 2 === second % 2 ? "No." : "Yes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Parity only reports whether the number of 1-bits is even or odd.`,
        `The original ${slots.original} has ${onesIn(slots.original)} ones and the changed word ${slots.next} has ${onesIn(slots.next)}, so both have the same parity.`,
        'The parity test sees no violation and cannot detect the two errors, so the answer is no.'
      ];
    }
  },
  {
    template: 'Checksum modulo',
    type: 'checksum-modulo',
    category: 'no-knowledge',
    parse(statement) {
      const digitsMatch = statement.match(/check digit for ([\d,\s]+?)\?/);
      if (digitsMatch === null) {
        throw new Error('no digits to check found');
      }
      return { digits: digitsOf(digitsMatch[1]) };
    },
    solve(slots) {
      const sum = slots.digits.reduce((total, digit) => total + digit, 0);
      return { digit: checkDigit(sum) };
    },
    render(solution) {
      return `${solution.digit}.`;
    },
    compute: [
      'const slots = $slots;',
      'let sum = 0;',
      'for (const digit of slots.digits) {',
      '  sum += digit;',
      '}',
      'return (((sum % 10) + 10) % 10) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The check digit is the last digit of the sum of the data, that is, the sum taken modulo 10.`,
        `Adding ${slots.digits.join(' + ')} gives ${slots.digits.reduce((total, digit) => total + digit, 0)}, whose last digit is ${solution.digit}.`
      ];
    }
  },
];
