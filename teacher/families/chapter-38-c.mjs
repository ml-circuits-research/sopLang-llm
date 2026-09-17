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

export const chapter = 38;

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
    template: 'Decoding with a one-to-one dictionary',
    type: 'decoding-with-a-one-to-one-dictionary',
    category: 'knowledge',
    sharedPremise: 'The previous problem defines the dictionary red→2, green→5, blue→7.',
    parse(statement) {
      const codesMatch = statement.match(/decode ([\d-]+)/);
      if (codesMatch === null) {
        throw new Error('no sequence to decode found');
      }
      return { codes: codesMatch[1].split('-').filter((part) => part !== '').map(Number) };
    },
    solve(slots) {
      const names = new Map(Object.entries(COLOR_CODES).map(([name, code]) => [String(code), name]));
      const words = slots.codes.map((code) => {
        if (names.get(String(code)) === undefined) {
          throw new Error(`the dictionary has no entry for code ${code}`);
        }
        return names.get(String(code));
      });
      return { words };
    },
    render(solution) {
      return `${solution.words.join('-')}.`;
    },
    facts: JSON.stringify(COLOR_CODES),
    compute: [
      'const slots = $slots;',
      'const names = new Map(Object.entries($facts).map(([name, code]) => [String(code), name]));',
      'const words = slots.codes.map((code) => {',
      '  if (names.get(String(code)) === undefined) { throw new Error("the dictionary has no entry for code " + code); }',
      '  return names.get(String(code));',
      '});',
      'return words.join("-") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The dictionary maps each colour to a number, and because the mapping is one-to-one the same table can be read backwards.',
        `Each number is replaced by the colour it names, so ${slots.codes.map((code, index) => `${code} becomes ${solution.words[index]}`).join(', ')}.`,
        `The decoded message is ${solution.words.join('-')}.`
      ];
    }
  },
  {
    template: 'Code collision',
    type: 'code-collision',
    category: 'no-knowledge',
    parse(statement) {
      const mapping = {};
      for (const match of statement.matchAll(/([A-Z])→(\d+)/g)) {
        mapping[match[1]] = Number(match[2]);
      }
      const receivedMatch = statement.match(/receive code (\d+)/);
      if (Object.keys(mapping).length === 0 || receivedMatch === null) {
        throw new Error('no mapping or received code found');
      }
      return { mapping, received: Number(receivedMatch[1]) };
    },
    solve(slots) {
      const origins = Object.entries(slots.mapping)
        .filter(([, code]) => code === slots.received)
        .map(([symbol]) => symbol);
      return { determinable: origins.length === 1, origins };
    },
    render(solution) {
      return solution.determinable ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'const origins = Object.entries(slots.mapping).filter(([, code]) => code === slots.received);',
      'return origins.length === 1 ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A code identifies its source only when the mapping is one-to-one.',
        `Here the received code ${slots.received} is produced by more than one symbol, so the same code has several possible origins.`,
        'Nothing in the received code tells which one was sent, so we cannot know for certain.'
      ];
    }
  },
  {
    template: 'Coordinate code',
    type: 'coordinate-code',
    category: 'no-knowledge',
    parse(statement) {
      const codeMatch = statement.match(/code (\d+)/);
      if (codeMatch === null) {
        throw new Error('no code found');
      }
      return { code: codeMatch[1] };
    },
    solve(slots) {
      if (slots.code.length !== 2) {
        throw new Error('the coordinate code must have exactly two digits');
      }
      return { row: slots.code[0], column: slots.code[1] };
    },
    render(solution) {
      return `Row ${solution.row}, column ${solution.column}.`;
    },
    compute: [
      'const slots = $slots;',
      'if (String(slots.code).length !== 2) { throw new Error("the coordinate code must have exactly two digits"); }',
      'return "Row " + slots.code[0] + ", column " + slots.code[1] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The format fixes the meaning of each position: the first digit is the row and the second is the column.',
        `Splitting ${slots.code} according to that format gives row ${solution.row} and column ${solution.column}.`
      ];
    }
  },
  {
    template: 'Changing field order changes meaning',
    type: 'changing-field-order-changes-meaning',
    category: 'no-knowledge',
    parse(statement) {
      const codeMatch = statement.match(/string (\d+)/);
      if (codeMatch === null) {
        throw new Error('no string found');
      }
      return { code: codeMatch[1] };
    },
    solve(slots) {
      if (slots.code.length !== 2) {
        throw new Error('the string must have exactly two digits');
      }
      return { first: [slots.code[0], slots.code[1]], second: [slots.code[1], slots.code[0]] };
    },
    render(solution) {
      const [a, b] = solution.first;
      const [c, d] = solution.second;
      return `It can mean (${a},${b}) or (${c},${d}), depending on the format.`;
    },
    compute: [
      'const slots = $slots;',
      'if (String(slots.code).length !== 2) { throw new Error("the string must have exactly two digits"); }',
      'const a = slots.code[0];',
      'const b = slots.code[1];',
      'return "It can mean (" + a + "," + b + ") or (" + b + "," + a + "), depending on the format.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The digits alone do not say which field comes first; the format does.',
        `Reading ${slots.code} as (row,column) gives (${solution.first.join(',')}), while reading it as (column,row) gives (${solution.second.join(',')}).`,
        'The same string therefore means two different cells in the two systems.'
      ];
    }
  },
  {
    template: 'Code with a length field',
    type: 'code-with-a-length-field',
    category: 'no-knowledge',
    parse(statement) {
      const codeMatch = statement.match(/Is code (\w+) valid/);
      if (codeMatch === null) {
        throw new Error('no code to validate found');
      }
      return { code: codeMatch[1] };
    },
    solve(slots) {
      const declared = Number(slots.code[0]);
      const text = slots.code.slice(1);
      return { valid: text.length === declared, declared, length: text.length };
    },
    render(solution) {
      return solution.valid ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'const declared = Number(slots.code[0]);',
      'const text = String(slots.code).slice(1);',
      'return text.length === declared ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The first digit promises how many letters follow, so the code is valid only when the declared count matches the text length.`,
        `The prefix of ${slots.code} declares ${solution.declared} letters, but the text has ${solution.length}.`,
        'The promise is broken, so the code is not valid.'
      ];
    }
  },
  {
    template: 'Detect a missing letter using the length field',
    type: 'detect-a-missing-letter-using-the-length-field',
    category: 'no-knowledge',
    parse(statement) {
      const codeMatch = statement.match(/receive (\w+)/);
      if (codeMatch === null) {
        throw new Error('no received code found');
      }
      return { code: codeMatch[1] };
    },
    solve(slots) {
      const declared = Number(slots.code[0]);
      const text = slots.code.slice(1);
      return { complete: text.length === declared, declared, length: text.length };
    },
    render(solution) {
      return solution.complete ? 'The message is complete.' : 'The message is incomplete or corrupted.';
    },
    compute: [
      'const slots = $slots;',
      'const declared = Number(slots.code[0]);',
      'const text = String(slots.code).slice(1);',
      'return text.length === declared ? "The message is complete." : "The message is incomplete or corrupted.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The length field states how many letters should follow, so comparing it with the letters actually present reveals a transmission problem.`,
        `The field ${solution.declared} promises ${solution.declared} letters, but only ${solution.length} are present.`,
        'Because the promise is not met, the message is incomplete or corrupted.'
      ];
    }
  },
  {
    template: 'Base-ten and base-two representation',
    type: 'base-ten-and-base-two-representation',
    category: 'no-knowledge',
    parse(statement) {
      const decimalMatch = statement.match(/The value (\d+) is written/);
      const binaryMatch = statement.match(/and\s*[“"](\d+)[”"]\s+in the system/);
      const weightsMatch = statement.match(/weights ([\d,\s]+)\./);
      if (decimalMatch === null || binaryMatch === null || weightsMatch === null) {
        throw new Error('no decimal value, binary string, or weights found');
      }
      return {
        decimal: Number(decimalMatch[1]),
        binary: binaryMatch[1],
        weights: digitsOf(weightsMatch[1])
      };
    },
    solve(slots) {
      if (slots.binary.length !== slots.weights.length) {
        throw new Error('the binary string does not match the number of weights');
      }
      const value = weightedValue(slots.weights, slots.binary);
      return { value, same: value === slots.decimal };
    },
    render(solution) {
      return solution.same
        ? `No; both represent the value ${solution.value}.`
        : `Yes; the two notations give different values.`;
    },
    compute: [
      'const slots = $slots;',
      'if (String(slots.binary).length !== slots.weights.length) { throw new Error("the binary string does not match the number of weights"); }',
      'let value = 0;',
      'for (let index = 0; index < slots.weights.length; index += 1) {',
      '  value += slots.weights[index] * Number(slots.binary[index]);',
      '}',
      'return value === slots.decimal ? "No; both represent the value " + value + "." : "Yes; the two notations give different values.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The two notations are different ways of writing numbers, so the same value can appear in both.',
        `Evaluating the binary form ${slots.binary} with the weights ${slots.weights.join(', ')} gives ${solution.value}.`,
        `That equals the decimal value ${slots.decimal}, so the representations differ but the value is the same.`
      ];
    }
  }
];
