/**
 * Families for chapter 29 of the mathematical seed book: propositional logic
 * and conditional rules.
 *
 * A family covers one printed template. It provides the reference parse that a
 * `modelCall` stage would perform, an independent computation, the answer text
 * the source prints, the SOP Lang computation body that the circuit executes,
 * and the explanation lines of the example. Every premise of each solution is
 * stated by the problem text (the combination rules, the priority order, the
 * thresholds and the finite domains are all printed), so every case is
 * `no-knowledge` except the truth-table case, whose abbreviation convention is
 * carried in a fact wire.
 */

export const unit = 29;

/**
 * Printed abbreviation convention for the truth-table template: the source
 * writes the on state as O and the off state as F. The problem text does not
 * define these letters, so the convention travels in the `@facts` wire of that
 * knowledge case.
 */
const STATE_ABBREVIATIONS = { on: 'O', off: 'F' };

function formatList(items) {
  const values = items.map((item) => String(item));
  if (values.length === 0) return '';
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`;
}

function tokenizeExpression(text) {
  return text.split('(').join(' ( ').split(')').join(' ) ').trim().split(/\s+/);
}

function evaluateExpression(tokens, environment) {
  const state = { position: 0 };
  const parsePrimary = () => {
    const token = tokens[state.position];
    if (token === '(') {
      state.position += 1;
      const value = parseOr();
      if (tokens[state.position] !== ')') {
        throw new Error('the expression has unbalanced parentheses');
      }
      state.position += 1;
      return value;
    }
    if (token === undefined || token === 'AND' || token === 'OR') {
      throw new Error(`the expression has an unexpected token "${token}"`);
    }
    state.position += 1;
    return environment[token] === true;
  };
  const parseNot = () => {
    if (tokens[state.position] === 'NOT') {
      state.position += 1;
      return !parseNot();
    }
    return parsePrimary();
  };
  const parseAnd = () => {
    let value = parseNot();
    while (tokens[state.position] === 'AND') {
      state.position += 1;
      const right = parseNot();
      value = value && right;
    }
    return value;
  };
  const parseOr = () => {
    let value = parseAnd();
    while (tokens[state.position] === 'OR') {
      state.position += 1;
      const right = parseAnd();
      value = value || right;
    }
    return value;
  };
  const value = parseOr();
  if (state.position !== tokens.length) {
    throw new Error('the expression has trailing tokens');
  }
  return value;
}

function compare(value, operator, threshold) {
  if (operator === '>') return value > threshold;
  if (operator === '<') return value < threshold;
  if (operator === '>=') return value >= threshold;
  if (operator === '<=') return value <= threshold;
  throw new Error(`unknown comparison operator "${operator}"`);
}

function numberWord(text) {
  const words = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  const key = String(text).toLowerCase();
  if (/^\d+$/.test(key)) return Number(key);
  if (!(key in words)) throw new Error(`unknown number word "${text}"`);
  return words[key];
}

function enumerateStates(count, options) {
  let states = [[]];
  for (let index = 0; index < count; index += 1) {
    states = states.flatMap((state) => options.map((option) => [...state, option]));
  }
  return states;
}

function partHolds(part, value) {
  if (part.kind === 'even') return value % 2 === 0;
  if (part.kind === 'odd') return value % 2 !== 0;
  return compare(value, part.operator, part.threshold);
}

function intervalOf(condition, domain) {
  let match = condition.match(/^(\d+)≤x≤(\d+)$/);
  if (match !== null) return { lo: Number(match[1]), hi: Number(match[2]) };
  match = condition.match(/^x<(\d+)$/);
  if (match !== null) return { lo: domain.lo, hi: Number(match[1]) - 1 };
  match = condition.match(/^x>(\d+)$/);
  if (match !== null) return { lo: Number(match[1]) + 1, hi: domain.hi };
  match = condition.match(/^x≤(\d+)$/);
  if (match !== null) return { lo: domain.lo, hi: Number(match[1]) };
  match = condition.match(/^x≥(\d+)$/);
  if (match !== null) return { lo: Number(match[1]), hi: domain.hi };
  throw new Error(`the condition "${condition}" cannot be read as an interval`);
}

export const cases = [
  {
    template: '“Exclusive or” means exactly one',
    type: 'exclusive-or-means-exactly-one',
    category: 'no-knowledge',
    parse(statement) {
      const ruleMatch = statement.match(/“(\w+) XOR (\w+)”/);
      if (ruleMatch === null) {
        throw new Error('the XOR rule is missing');
      }
      const pieces = [...statement.matchAll(/([A-Z])=(\w+) (\w+)/g)].map((match) => ({
        name: match[1],
        properties: [match[2], match[3] === 'circle' ? 'round' : match[3]]
      }));
      if (pieces.length === 0) {
        throw new Error('no described pieces found');
      }
      return { operator: 'xor', properties: [ruleMatch[1], ruleMatch[2]], pieces };
    },
    solve(slots) {
      const accepted = [];
      for (const piece of slots.pieces) {
        const holds = piece.properties.filter((property) => slots.properties.includes(property)).length;
        if (holds === 1) {
          accepted.push(piece.name);
        }
      }
      return { accepted };
    },
    render(solution) {
      return `${formatList(solution.accepted)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const accepted = [];',
      'for (const piece of slots.pieces) {',
      '  const holds = piece.properties.filter((property) => slots.properties.indexOf(property) !== -1).length;',
      '  if (holds === 1) accepted.push(piece.name);',
      '}',
      'if (accepted.length === 1) return accepted[0] + ".";',
      'if (accepted.length === 2) return accepted[0] + " and " + accepted[1] + ".";',
      'return accepted.slice(0, -1).join(", ") + ", and " + accepted[accepted.length - 1] + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        `Exclusive or is true only when exactly one of ${slots.properties[0]} and ${slots.properties[1]} holds, so having both is not enough and having neither is too little.`,
        'Counting the satisfied properties of each piece and keeping the count equal to one removes the pieces that satisfy two properties or none.',
        `Only ${formatList(slots.pieces.filter((piece) => piece.properties.filter((property) => slots.properties.includes(property)).length === 1).map((piece) => piece.name))} remain, which is why the piece with both properties is excluded.`
      ];
    }
  },
  {
    template: 'Parentheses change the rule',
    type: 'parentheses-change-the-rule',
    category: 'no-knowledge',
    parse(statement) {
      const ruleMatch = statement.match(/R1=(.+?);\s*R2=(.+?)\./);
      const pieceMatch = statement.match(/For a (\w+) (\w+)/);
      if (ruleMatch === null || pieceMatch === null) {
        throw new Error('the two rules or the described piece are missing');
      }
      return {
        rules: [
          { name: 'R1', tokens: tokenizeExpression(ruleMatch[1]) },
          { name: 'R2', tokens: tokenizeExpression(ruleMatch[2]) }
        ],
        environment: { [pieceMatch[1]]: true, [pieceMatch[2]]: true }
      };
    },
    solve(slots) {
      return {
        results: slots.rules.map((rule) => ({ name: rule.name, value: evaluateExpression(rule.tokens, slots.environment) }))
      };
    },
    render(solution) {
      return `${solution.results.map((result) => `${result.name} ${result.value}`).join('; ')}.`;
    },
    compute: [
      'const slots = $slots;',
      'const evaluate = (tokens) => {',
      '  let position = 0;',
      '  const primary = () => {',
      '    if (tokens[position] === "(") { position += 1; const value = or(); position += 1; return value; }',
      '    const token = tokens[position]; position += 1;',
      '    return slots.environment[token] === true;',
      '  };',
      '  const not = () => { if (tokens[position] === "NOT") { position += 1; return !not(); } return primary(); };',
      '  const and = () => { let value = not(); while (tokens[position] === "AND") { position += 1; const right = not(); value = value && right; } return value; };',
      '  const or = () => { let value = and(); while (tokens[position] === "OR") { position += 1; const right = and(); value = value || right; } return value; };',
      '  return or();',
      '};',
      'const parts = slots.rules.map((rule) => rule.name + " " + String(evaluate(rule.tokens)));',
      'return parts.join("; ") + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        'Parentheses fix the order of evaluation, so the two rules are not the same expression even though they use the same properties.',
        `For a ${Object.keys(slots.environment).join(' ')} piece, the colours that are absent are false and only the described properties are true.`,
        'R1 evaluates the "or" inside the parentheses first and then conjoins with the shape, while R2 evaluates the "and" first and then disjoins; the different groupings give different truth values.'
      ];
    }
  },
  {
    template: '“At most one” as a limit',
    type: 'at-most-one-as-a-limit',
    category: 'no-knowledge',
    parse(statement) {
      const limitMatch = statement.match(/at most (\w+) of/);
      const stateMatch = statement.match(/The state is ([\w, ]+)\./);
      if (limitMatch === null || stateMatch === null) {
        throw new Error('the limit or the lamp states are missing');
      }
      return {
        limit: numberWord(limitMatch[1]),
        lamps: stateMatch[1].split(',').map((value) => value.trim())
      };
    },
    solve(slots) {
      const on = slots.lamps.filter((lamp) => lamp === 'on').length;
      return { valid: on <= slots.limit, on };
    },
    render(solution) {
      return `${solution.valid ? 'Yes' : 'No'}.`;
    },
    compute: [
      'const slots = $slots;',
      'const on = slots.lamps.filter((lamp) => lamp === "on").length;',
      'return on <= slots.limit ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots) {
      return [
        `A valid code may have at most ${slots.limit} lamp on, which is an upper bound rather than an exact value.`,
        `Counting the lamps described as on gives ${slots.lamps.filter((lamp) => lamp === 'on').length}.`,
        'That count exceeds the limit, so the state is invalid and the answer is no.'
      ];
    }
  },
  {
    template: 'A rule with priority',
    type: 'a-rule-with-priority',
    category: 'no-knowledge',
    parse(statement) {
      const firstMatch = statement.match(/if the number is (-?\d+), display “([^”]+)”/);
      const secondMatch = statement.match(/if it is even, display “([^”]+)”/);
      const fallbackMatch = statement.match(/otherwise display “([^”]+)”/);
      const valueMatch = statement.match(/displayed for (-?\d+)/);
      if (firstMatch === null || secondMatch === null || fallbackMatch === null || valueMatch === null) {
        throw new Error('the ordered rules or the input value are missing');
      }
      return {
        rules: [
          { kind: 'equals', value: Number(firstMatch[1]), label: firstMatch[2] },
          { kind: 'even', label: secondMatch[1] }
        ],
        fallback: fallbackMatch[1],
        value: Number(valueMatch[1])
      };
    },
    solve(slots) {
      for (const rule of slots.rules) {
        const matches = rule.kind === 'equals' ? slots.value === rule.value : slots.value % 2 === 0;
        if (matches) return { label: rule.label };
      }
      return { label: slots.fallback };
    },
    render(solution) {
      return `“${solution.label}”.`;
    },
    compute: [
      'const slots = $slots;',
      'let label = slots.fallback;',
      'for (const rule of slots.rules) {',
      '  const matches = rule.kind === "equals" ? slots.value === rule.value : slots.value % 2 === 0;',
      '  if (matches) { label = rule.label; break; }',
      '}',
      'return "“" + label + "”.";'
    ].join('\n'),
    explain(slots) {
      return [
        'The rules are ordered and the first applicable one wins, so the chain must be scanned from the top and stopped at the first match.',
        `For the value ${slots.value} the first rule applies immediately, which means the later even rule and the default label are never reached.`,
        `The output is therefore the label ${slots.rules[0].label}, not the even branch.`
      ];
    }
  },
  {
    template: 'A rule set with no uncovered case',
    type: 'a-rule-set-with-no-uncovered-case',
    category: 'no-knowledge',
    parse(statement) {
      const domainMatch = statement.match(/For numbers (\d+)–(\d+)/);
      const rulesMatch = statement.match(/says: (.+?)\. Is there/);
      if (domainMatch === null || rulesMatch === null) {
        throw new Error('the domain or the labelled conditions are missing');
      }
      const domain = { lo: Number(domainMatch[1]), hi: Number(domainMatch[2]) };
      const intervals = rulesMatch[1].split(';').map((clause) => {
        const clauseMatch = clause.trim().match(/^if (.+), (\w+)$/);
        if (clauseMatch === null) {
          throw new Error(`the clause "${clause}" does not match the template`);
        }
        return { ...intervalOf(clauseMatch[1], domain), label: clauseMatch[2] };
      });
      return { domain, intervals };
    },
    solve(slots) {
      const uncovered = [];
      for (let value = slots.domain.lo; value <= slots.domain.hi; value += 1) {
        if (!slots.intervals.some((interval) => value >= interval.lo && value <= interval.hi)) {
          uncovered.push(value);
        }
      }
      return { uncovered };
    },
    render(solution) {
      return `${solution.uncovered.length === 0 ? 'No' : 'Yes'}.`;
    },
    compute: [
      'const slots = $slots;',
      'let uncovered = 0;',
      'for (let value = slots.domain.lo; value <= slots.domain.hi; value += 1) {',
      '  if (!slots.intervals.some((interval) => value >= interval.lo && value <= interval.hi)) uncovered += 1;',
      '}',
      'return uncovered === 0 ? "No." : "Yes.";'
    ].join('\n'),
    explain(slots) {
      return [
        `The domain is the integers from ${slots.domain.lo} to ${slots.domain.hi}, and the conditions describe ${slots.intervals.length} exhaustive-looking ranges.`,
        'Converting each condition into the interval of the domain it accepts and walking the domain shows that every value falls inside at least one interval.',
        'Because the intervals tile the whole domain with no gap, no number is left without a label.'
      ];
    }
  },
  {
    template: 'A truth table for two conditions',
    type: 'a-truth-table-for-two-conditions',
    category: 'knowledge',
    parse(statement) {
      const countMatch = statement.match(/(\w+) lamps/);
      const optionsMatch = statement.match(/can each be (\w+) or (\w+)/);
      if (countMatch === null || optionsMatch === null) {
        throw new Error('the lamp count or the options are missing');
      }
      return { count: numberWord(countMatch[1]), options: [optionsMatch[1], optionsMatch[2]] };
    },
    solve(slots) {
      const initials = enumerateStates(slots.count, slots.options).map((state) => state.map((value) => STATE_ABBREVIATIONS[value]).join(''));
      return { initials };
    },
    render(solution) {
      return `${solution.initials.join(', ')} (on/off).`;
    },
    facts: '{ "on": "O", "off": "F" }',
    compute: [
      'const slots = $slots;',
      'let states = [[]];',
      'for (let index = 0; index < slots.count; index += 1) {',
      '  const next = [];',
      '  for (const state of states) {',
      '    for (const option of slots.options) next.push(state.concat([option]));',
      '  }',
      '  states = next;',
      '}',
      'const initials = states.map((state) => state.map((value) => $facts[value]).join(""));',
      'return initials.join(", ") + " (on/off).";'
    ].join('\n'),
    explain(slots) {
      return [
        `Each of the ${slots.count} lamps is an independent choice between two values, so the state is an ordered pair.`,
        'Multiplying the options per lamp gives the number of states, and listing them in the fixed order of the options enumerates the whole table.',
        `The printed convention writes each state with one letter per lamp (on as O and off as F), which yields ${formatList(enumerateStates(slots.count, slots.options).map((state) => state.map((value) => STATE_ABBREVIATIONS[value]).join('')))}.`
      ];
    }
  },
  {
    template: 'Test order changes cost, not the result',
    type: 'test-order-changes-cost-not-the-result',
    category: 'no-knowledge',
    parse(statement) {
      const slowMatch = statement.match(/testing (\w+) takes a long time/);
      const fastMatch = statement.match(/testing ([^ ]+) is fast/);
      const valueMatch = statement.match(/For x=(-?\d+)/);
      if (slowMatch === null || fastMatch === null || valueMatch === null) {
        throw new Error('the tested parts or the tested value are missing');
      }
      const fastCompare = fastMatch[1].match(/^x([><])(\d+)$/);
      if (fastCompare === null) {
        throw new Error(`the fast test "${fastMatch[1]}" is not a simple comparison`);
      }
      return {
        operator: 'and',
        value: Number(valueMatch[1]),
        parts: [
          { expression: 'x is even', kind: 'even', cost: 10 },
          { expression: fastMatch[1], kind: 'compare', operator: fastCompare[1], threshold: Number(fastCompare[2]), cost: 1 }
        ]
      };
    },
    solve(slots) {
      const failing = slots.parts.filter((part) => !partHolds(part, slots.value));
      const pool = failing.length > 0 ? failing : slots.parts;
      const chosen = pool.reduce((best, part) => (part.cost < best.cost ? part : best), pool[0]);
      return { chosen: chosen.expression };
    },
    render(solution) {
      return `Test ${solution.chosen} first.`;
    },
    compute: [
      'const slots = $slots;',
      'const holds = (part) => part.kind === "even" ? slots.value % 2 === 0 : (part.operator === ">" ? slots.value > part.threshold : slots.value < part.threshold);',
      'const failing = slots.parts.filter((part) => !holds(part));',
      'const pool = failing.length > 0 ? failing : slots.parts;',
      'let chosen = pool[0];',
      'for (const part of pool) { if (part.cost < chosen.cost) chosen = part; }',
      'return "Test " + chosen.expression + " first.";'
    ].join('\n'),
    explain(slots) {
      return [
        'For a conjunction, one false part is enough to make the whole rule false, so the search can stop as soon as a failing test is found.',
        `For the value ${slots.value} the comparison fails, and it is also the cheapest test to run.`,
        'Evaluating the cheap failing comparison first gives the answer without ever running the slow parity test.'
      ];
    }
  },
];
