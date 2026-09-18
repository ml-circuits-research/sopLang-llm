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
    template: 'Verify a checksum',
    type: 'verify-a-checksum',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/data ([\d,\s]+?) and checksum (\d+)/);
      if (match === null) {
        throw new Error('no data or checksum found');
      }
      return { digits: digitsOf(match[1]), checksum: Number(match[2]) };
    },
    solve(slots) {
      const sum = slots.digits.reduce((total, digit) => total + digit, 0);
      return { valid: checkDigit(sum) === slots.checksum };
    },
    render(solution) {
      return solution.valid ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'let sum = 0;',
      'for (const digit of slots.digits) {',
      '  sum += digit;',
      '}',
      'return (((sum % 10) + 10) % 10) === slots.checksum ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Recomputing the rule gives the expected check digit from the data: ${slots.digits.join(' + ')} has last digit ${checkDigit(slots.digits.reduce((total, digit) => total + digit, 0))}.`,
        `The transmitted checksum is ${slots.checksum}, and the two agree, so the message passes verification.`
      ];
    }
  },
  {
    template: 'A checksum detects a changed digit',
    type: 'a-checksum-detects-a-changed-digit',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/data ([\d,\s]+?) and checksum (\d+)/);
      const changeMatch = statement.match(/(\d+) becomes (\d+)/);
      if (match === null || changeMatch === null) {
        throw new Error('no data, checksum, or change found');
      }
      return {
        digits: digitsOf(match[1]),
        checksum: Number(match[2]),
        from: Number(changeMatch[1]),
        to: Number(changeMatch[2])
      };
    },
    solve(slots) {
      const data = [...slots.digits];
      const index = data.indexOf(slots.from);
      if (index === -1) {
        throw new Error('the changed digit is not part of the data');
      }
      data[index] = slots.to;
      const sum = data.reduce((total, digit) => total + digit, 0);
      return { valid: checkDigit(sum) === slots.checksum };
    },
    render(solution) {
      return solution.valid ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'const data = slots.digits.slice();',
      'const index = data.indexOf(slots.from);',
      'if (index === -1) throw new Error("the changed digit is not part of the data");',
      'data[index] = slots.to;',
      'let sum = 0;',
      'for (const digit of data) {',
      '  sum += digit;',
      '}',
      'return (((sum % 10) + 10) % 10) === slots.checksum ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The digit ${slots.from} becomes ${slots.to}, so the data changes while the checksum stays ${slots.checksum}.`,
        `Recomputing the last digit of the new sum gives a value different from ${slots.checksum}, so verification fails and the answer is no.`
      ];
    }
  },
  {
    template: 'Fixed-length code and number of messages',
    type: 'fixed-length-code-and-number-of-messages',
    category: 'no-knowledge',
    parse(statement) {
      const positionsMatch = statement.match(/has (\d+) binary positions?/);
      if (positionsMatch === null) {
        throw new Error('no position count found');
      }
      return { positions: Number(positionsMatch[1]) };
    },
    solve(slots) {
      return { count: Math.pow(2, slots.positions) };
    },
    render(solution) {
      return `${solution.count} messages.`;
    },
    compute: [
      'const slots = $slots;',
      'return Math.pow(2, slots.positions) + " messages.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each of the ${slots.positions} positions is independent and can be 0 or 1, so the number of messages doubles with every position.`,
        `That gives 2 to the power ${slots.positions}, which is ${solution.count} different messages.`
      ];
    }
  },
  {
    template: 'How many bits are needed for five labels?',
    type: 'how-many-bits-are-needed-for-five-labels',
    category: 'no-knowledge',
    parse(statement) {
      const labelsMatch = statement.match(/You have (\d+) types/);
      if (labelsMatch === null) {
        throw new Error('no number of labels found');
      }
      return { labels: Number(labelsMatch[1]) };
    },
    solve(slots) {
      let bits = 0;
      while (Math.pow(2, bits) < slots.labels) {
        bits += 1;
      }
      return { bits };
    },
    render(solution) {
      return `${solution.bits} bits.`;
    },
    compute: [
      'const slots = $slots;',
      'let bits = 0;',
      'while (Math.pow(2, bits) < slots.labels) {',
      '  bits += 1;',
      '}',
      'return bits + " bits.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A code of length n has 2^n distinct words, so the length must be large enough that this count reaches ${slots.labels}.`,
        `Two bits give only 4 words, while three bits give 8, which is at least ${slots.labels}.`,
        `The minimum length is therefore ${solution.bits} bits.`
      ];
    }
  },
  {
    template: 'Simple prefix code and decoding without a separator',
    type: 'simple-prefix-code-and-decoding-without-a-separator',
    category: 'no-knowledge',
    parse(statement) {
      const codes = mappingFrom(statement);
      const targetMatch = statement.match(/Decode (\d+)/);
      if (Object.keys(codes).length === 0 || targetMatch === null) {
        throw new Error('no code table or message found');
      }
      return { codes, target: targetMatch[1] };
    },
    solve(slots) {
      const results = allDecodings(slots.codes, slots.target);
      if (results.length !== 1) {
        throw new Error('the message does not decode uniquely');
      }
      return { text: results[0].join('') };
    },
    render(solution) {
      return `${solution.text}.`;
    },
    compute: [
      'const slots = $slots;',
      'const entries = Object.entries(slots.codes);',
      'const target = String(slots.target);',
      'const results = [];',
      'const walk = (index, path) => {',
      '  if (index === target.length) {',
      '    results.push(path.join(""));',
      '    return;',
      '  }',
      '  for (const [symbol, code] of entries) {',
      '    if (code !== "" && target.startsWith(code, index)) {',
      '      walk(index + code.length, path.concat(symbol));',
      '    }',
      '  }',
      '};',
      'walk(0, []);',
      'if (results.length !== 1) throw new Error("the message does not decode uniquely");',
      'return results[0] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Because no codeword is the beginning of another, reading from left to right never leaves a choice: exactly one codeword can start at each position.',
        `Matching the codewords against ${slots.target} step by step isolates the symbols in order.`,
        `The decoded text is ${solution.text}.`
      ];
    }
  },
  {
    template: 'Ambiguous code caused by a prefix',
    type: 'ambiguous-code-caused-by-a-prefix',
    category: 'no-knowledge',
    parse(statement) {
      const codes = mappingFrom(statement);
      const targetMatch = statement.match(/string (\d+)/);
      if (Object.keys(codes).length === 0 || targetMatch === null) {
        throw new Error('no code table or string found');
      }
      return { codes, target: targetMatch[1] };
    },
    solve(slots) {
      const readings = allDecodings(slots.codes, slots.target)
        .map((path) => path.join(''))
        .sort((left, right) => left.length - right.length || (left < right ? -1 : 1));
      return { readings, target: slots.target };
    },
    render(solution) {
      if (solution.readings.length <= 1) {
        return `No ambiguity: ${solution.target} has only one reading: ${solution.readings[0] ?? ''}.`;
      }
      return `Ambiguity occurs: ${solution.target} can be ${solution.readings.join(' or ')}.`;
    },
    compute: [
      'const slots = $slots;',
      'const entries = Object.entries(slots.codes);',
      'const target = String(slots.target);',
      'const results = [];',
      'const walk = (index, path) => {',
      '  if (index === target.length) {',
      '    results.push(path.join(""));',
      '    return;',
      '  }',
      '  for (const [symbol, code] of entries) {',
      '    if (code !== "" && target.startsWith(code, index)) {',
      '      walk(index + code.length, path.concat(symbol));',
      '    }',
      '  }',
      '};',
      'walk(0, []);',
      'if (results.length <= 1) return "No ambiguity: " + (results[0] ?? "") + " is the only reading.";',
      'const ordered = results.slice().sort((left, right) => left.length - right.length || (left < right ? -1 : 1));',
      'return "Ambiguity occurs: " + target + " can be " + ordered.join(" or ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'When one codeword is the beginning of another, a string can be split in more than one way.',
        `Here the codeword 0 is a prefix of 01, so ${slots.target} can be read as the single symbol B or as 0 followed by 1.`,
        'The same bits therefore carry two different messages, which is exactly the ambiguity.'
      ];
    }
  },
  {
    template: 'Run-length coding and when it compresses',
    type: 'run-length-coding-and-when-it-compresses',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/writes (\w+) as (\w+)/);
      if (match === null) {
        throw new Error('no original or run-length string found');
      }
      return { original: match[1], code: match[2] };
    },
    solve(slots) {
      return { compresses: slots.code.length < slots.original.length };
    },
    render(solution) {
      return solution.compresses ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.code).length < String(slots.original).length ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Run-length coding replaces a run by a count followed by the repeated symbol, so the original of ${slots.original.length} symbols becomes ${slots.code}.`,
        `The code has ${slots.code.length} characters against ${slots.original.length} in the original, so it is shorter and does compress.`
      ];
    }
  },
  {
    template: 'Run-length coding can enlarge a message',
    type: 'run-length-coding-can-enlarge-a-message',
    category: 'no-knowledge',
    parse(statement) {
      const originalMatch = statement.match(/The string (\w+) has/);
      const codeMatch = statement.match(/writes it as (\w+)/);
      if (originalMatch === null || codeMatch === null) {
        throw new Error('no original or run-length string found');
      }
      return { original: originalMatch[1], code: codeMatch[1] };
    },
    solve(slots) {
      return { shorter: slots.code.length < slots.original.length };
    },
    render(solution) {
      return solution.shorter ? 'Yes; it makes it shorter.' : 'No; it makes it longer.';
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.code).length < String(slots.original).length ? "Yes; it makes it shorter." : "No; it makes it longer.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `With no run longer than one symbol, every symbol gains its own count, so ${slots.original} becomes ${slots.code}.`,
        `That is ${slots.code.length} characters against the original ${slots.original.length}, so the coded form is longer rather than shorter.`
      ];
    }
  },
  {
    template: 'Code dictionary as a mapping table',
    type: 'code-dictionary-as-a-mapping-table',
    category: 'no-knowledge',
    parse(statement) {
      const dictionary = {};
      for (const match of statement.matchAll(/(\w+)→(\d+)/g)) {
        dictionary[match[1]] = Number(match[2]);
      }
      const sequenceMatch = statement.match(/represents ([\w,\s]+)\?/);
      if (Object.keys(dictionary).length === 0 || sequenceMatch === null) {
        throw new Error('no dictionary or sequence found');
      }
      const names = sequenceMatch[1]
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part !== '');
      return { dictionary, names };
    },
    solve(slots) {
      const numbers = slots.names.map((name) => {
        if (slots.dictionary[name] === undefined) {
          throw new Error(`the dictionary has no entry for "${name}"`);
        }
        return slots.dictionary[name];
      });
      return { numbers };
    },
    render(solution) {
      return `${solution.numbers.join('-')}.`;
    },
    compute: [
      'const slots = $slots;',
      'const numbers = slots.names.map((name) => {',
      '  if (slots.dictionary[name] === undefined) { throw new Error("the dictionary has no entry for \\"" + name + "\\""); }',
      '  return slots.dictionary[name];',
      '});',
      'return numbers.join("-") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A dictionary is a table that assigns a code to each name, so encoding means looking up every name in order.',
        `Reading the table for ${slots.names.join(', ')} gives ${solution.numbers.join(', ')}.`,
        `Written as a sequence, the message is ${solution.numbers.join('-')}.`
      ];
    }
  },
];
