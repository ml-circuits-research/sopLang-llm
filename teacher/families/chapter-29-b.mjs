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

export const chapter = 29;

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
    template: 'The “and” condition requires both rules',
    type: 'the-and-condition-requires-both-rules',
    category: 'no-knowledge',
    parse(statement) {
      const minMatch = statement.match(/greater than (\d+)/);
      const maxMatch = statement.match(/less than (\d+)/);
      const listMatch = statement.match(/Among ([\d,\s]+), which/);
      if (minMatch === null || maxMatch === null || listMatch === null) {
        throw new Error('the "and" rule or the candidate list is missing');
      }
      return {
        min: Number(minMatch[1]),
        max: Number(maxMatch[1]),
        candidates: listMatch[1].split(',').map((value) => Number(value.trim()))
      };
    },
    solve(slots) {
      const selected = slots.candidates.filter((value) => value > slots.min && value < slots.max);
      if (selected.length === 0) throw new Error('no candidate satisfies both conditions');
      return { selected };
    },
    render(solution) {
      return `${formatList(solution.selected)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const selected = slots.candidates.filter((value) => value > slots.min && value < slots.max);',
      'const values = selected.map((value) => String(value));',
      'if (values.length === 0) throw new Error("no candidate satisfies both conditions");',
      'if (values.length === 1) return values[0] + ".";',
      'if (values.length === 2) return values[0] + " and " + values[1] + ".";',
      'return values.slice(0, -1).join(", ") + ", and " + values[values.length - 1] + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        `The badge rule is a conjunction: a number must be greater than ${slots.min} and at the same time less than ${slots.max}.`,
        `Testing each candidate against both conditions leaves only the numbers in the open interval between ${slots.min} and ${slots.max}.`,
        `The boundaries themselves are excluded because the comparisons are strict, and that is why ${slots.max} does not receive the badge.`
      ];
    }
  },
  {
    template: 'The “or” condition allows one or both',
    type: 'the-or-condition-allows-one-or-both',
    category: 'no-knowledge',
    parse(statement) {
      const ruleMatch = statement.match(/if it is (\w+) OR (\w+)/);
      if (ruleMatch === null) {
        throw new Error('the "or" rule is missing');
      }
      const pieces = [...statement.matchAll(/([A-Z])=(\w+) (\w+)/g)].map((match) => ({
        name: match[1],
        properties: [match[2], match[3] === 'circle' ? 'round' : match[3]]
      }));
      if (pieces.length === 0) {
        throw new Error('no described pieces found');
      }
      return { operator: 'or', properties: [ruleMatch[1], ruleMatch[2]], pieces };
    },
    solve(slots) {
      const accepted = slots.pieces
        .filter((piece) => piece.properties.some((property) => slots.properties.includes(property)))
        .map((piece) => piece.name);
      return { accepted };
    },
    render(solution) {
      return `${formatList(solution.accepted)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const accepted = slots.pieces.filter((piece) => piece.properties.some((property) => slots.properties.indexOf(property) !== -1)).map((piece) => piece.name);',
      'if (accepted.length === 1) return accepted[0] + ".";',
      'if (accepted.length === 2) return accepted[0] + " and " + accepted[1] + ".";',
      'return accepted.slice(0, -1).join(", ") + ", and " + accepted[accepted.length - 1] + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        `Inclusive "or" is satisfied by either property, so a piece passes as soon as it has ${slots.properties[0]} or ${slots.properties[1]}.`,
        'Checking each piece against the two properties keeps every piece that has at least one of them.',
        `The result is ${formatList(slots.pieces.filter((piece) => piece.properties.some((property) => slots.properties.includes(property))).map((piece) => piece.name))}, because the pieces with neither property are the only ones rejected.`
      ];
    }
  },
  {
    template: 'Negating a condition',
    type: 'negating-a-condition',
    category: 'no-knowledge',
    parse(statement) {
      const ruleMatch = statement.match(/NOT\(x([<>])(\d+)\)/);
      const listMatch = statement.match(/Among ([\d,\s]+), which/);
      if (ruleMatch === null || listMatch === null) {
        throw new Error('the negated comparison or the candidate list is missing');
      }
      return {
        operator: ruleMatch[1],
        threshold: Number(ruleMatch[2]),
        candidates: listMatch[1].split(',').map((value) => Number(value.trim()))
      };
    },
    solve(slots) {
      const selected = slots.candidates.filter((value) => !compare(value, slots.operator, slots.threshold));
      if (selected.length === 0) throw new Error('no candidate satisfies the negation');
      return { selected };
    },
    render(solution) {
      return `${formatList(solution.selected)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const holds = (value) => slots.operator === ">" ? value > slots.threshold : value < slots.threshold;',
      'const selected = slots.candidates.filter((value) => !holds(value)).map((value) => String(value));',
      'if (selected.length === 0) throw new Error("no candidate satisfies the negation");',
      'if (selected.length === 1) return selected[0] + ".";',
      'if (selected.length === 2) return selected[0] + " and " + selected[1] + ".";',
      'return selected.slice(0, -1).join(", ") + ", and " + selected[selected.length - 1] + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        `NOT(x ${slots.operator} ${slots.threshold}) is true exactly for the numbers that fail x ${slots.operator} ${slots.threshold}.`,
        `Negating a strict comparison keeps the boundary, so the answer is the set of numbers ${slots.operator === '>' ? 'at most' : 'at least'} ${slots.threshold}.`,
        `Scanning the candidates with the negated test keeps ${formatList(slots.candidates.filter((value) => !compare(value, slots.operator, slots.threshold)).map(String))}.`
      ];
    }
  },
  {
    template: 'Overlapping rules',
    type: 'overlapping-rules',
    category: 'no-knowledge',
    parse(statement) {
      const conditions = [...statement.matchAll(/labels ([A-Z]) if x(≥|≤|>|<)(\d+)/g)].map((match) => ({
        label: match[1],
        operator: { '≥': '>=', '≤': '<=', '>': '>', '<': '<' }[match[2]],
        value: Number(match[3])
      }));
      const valueMatch = statement.match(/For x=(\d+)/);
      if (conditions.length === 0 || valueMatch === null) {
        throw new Error('the labelled conditions or the tested value are missing');
      }
      return { value: Number(valueMatch[1]), conditions };
    },
    solve(slots) {
      const labels = slots.conditions
        .filter((condition) => compare(slots.value, condition.operator, condition.value))
        .map((condition) => condition.label);
      return { labels };
    },
    render(solution) {
      if (solution.labels.length === 0) return 'None.';
      if (solution.labels.length === 1) return `One: ${solution.labels[0]}.`;
      if (solution.labels.length === 2) return `Two: ${solution.labels[0]} and ${solution.labels[1]}.`;
      return `Three: ${solution.labels[0]}, ${solution.labels[1]}, and ${solution.labels[2]}.`;
    },
    compute: [
      'const slots = $slots;',
      'const holds = (condition) => condition.operator === ">=" ? slots.value >= condition.value : condition.operator === "<=" ? slots.value <= condition.value : condition.operator === ">" ? slots.value > condition.value : slots.value < condition.value;',
      'const labels = slots.conditions.filter(holds).map((condition) => condition.label);',
      'if (labels.length === 0) return "None.";',
      'if (labels.length === 1) return "One: " + labels[0] + ".";',
      'if (labels.length === 2) return "Two: " + labels[0] + " and " + labels[1] + ".";',
      'return "Three: " + labels[0] + ", " + labels[1] + ", and " + labels[2] + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        'The rules have no "else" branch, so they are independent tests and every true condition contributes a label.',
        `The value ${slots.value} satisfies ${slots.conditions.filter((condition) => compare(slots.value, condition.operator, condition.value)).length} of the conditions at the same time.`,
        'Because the two tests overlap on the value, both labels are assigned and the answer counts two.'
      ];
    }
  },
  {
    template: 'Evaluating a condition on every state',
    type: 'evaluating-a-condition-on-every-state',
    category: 'no-knowledge',
    parse(statement) {
      const countMatch = statement.match(/(\w+) lamps/);
      const requiredMatch = statement.match(/exactly (\w+) is on/);
      if (countMatch === null || requiredMatch === null) {
        throw new Error('the lamp count or the exact-on condition is missing');
      }
      return { count: numberWord(countMatch[1]), options: ['on', 'off'], onValue: 'on', required: numberWord(requiredMatch[1]) };
    },
    solve(slots) {
      const matching = enumerateStates(slots.count, slots.options)
        .filter((state) => state.filter((value) => value === slots.onValue).length === slots.required)
        .map((state) => `(${state.join(',')})`);
      return { matching };
    },
    render(solution) {
      return `In states ${formatList(solution.matching)}.`;
    },
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
      'const matching = states.filter((state) => state.filter((value) => value === slots.onValue).length === slots.required).map((state) => "(" + state.join(",") + ")");',
      'if (matching.length === 2) return "In states " + matching[0] + " and " + matching[1] + ".";',
      'return "In states " + matching.slice(0, -1).join(", ") + ", and " + matching[matching.length - 1] + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        `The alarm condition is "exactly ${slots.required} of the lamps is on", which is true only for the states whose number of on lamps equals ${slots.required}.`,
        'Enumerating all the lamp states and counting the on values in each one evaluates the condition on the whole table.',
        `The states that satisfy the count are ${formatList(enumerateStates(slots.count, slots.options).filter((state) => state.filter((value) => value === slots.onValue).length === slots.required).map((state) => `(${state.join(',')})`))}, which are the only rows where the alarm starts.`
      ];
    }
  },
  {
    template: 'A sufficient condition for acceptance',
    type: 'a-sufficient-condition-for-acceptance',
    category: 'no-knowledge',
    parse(statement) {
      const ruleMatch = statement.match(/if it is (\w+) OR has a (\w+)/);
      const queryMatch = statement.match(/Is being (\w+) sufficient/);
      if (ruleMatch === null || queryMatch === null) {
        throw new Error('the acceptance rule or the queried property are missing');
      }
      return { operator: 'or', properties: [ruleMatch[1], ruleMatch[2]], query: queryMatch[1] };
    },
    solve(slots) {
      const sufficient = slots.operator === 'or' ? slots.properties.includes(slots.query) : slots.properties.length === 1 && slots.properties[0] === slots.query;
      const necessary = slots.operator === 'and' ? slots.properties.includes(slots.query) : slots.properties.length === 1 && slots.properties[0] === slots.query;
      return { sufficient, necessary };
    },
    render(solution) {
      if (solution.sufficient && solution.necessary) return 'It is necessary and sufficient.';
      if (solution.sufficient) return 'It is sufficient, but not necessary.';
      if (solution.necessary) return 'Necessary, but not sufficient.';
      return 'Neither necessary nor sufficient.';
    },
    compute: [
      'const slots = $slots;',
      'const sufficient = slots.operator === "or" ? slots.properties.indexOf(slots.query) !== -1 : slots.properties.length === 1;',
      'const necessary = slots.operator === "and" ? slots.properties.indexOf(slots.query) !== -1 : slots.properties.length === 1;',
      'if (sufficient && necessary) return "It is necessary and sufficient.";',
      'if (sufficient) return "It is sufficient, but not necessary.";',
      'if (necessary) return "Necessary, but not sufficient.";',
      'return "Neither necessary nor sufficient.";'
    ].join('\n'),
    explain(slots) {
      return [
        `Acceptance is the disjunction ${slots.properties[0]} OR ${slots.properties[1]}, so either property on its own is enough.`,
        `${slots.query} therefore implies acceptance, which makes it sufficient.`,
        `But ${slots.properties[1]} alone is also accepted without ${slots.query}, so ${slots.query} is not required and is not necessary.`
      ];
    }
  },
  {
    template: 'A necessary and sufficient condition',
    type: 'a-necessary-and-sufficient-condition',
    category: 'no-knowledge',
    parse(statement) {
      const forwardMatch = statement.match(/if the code is \d+ it opens/);
      const backwardMatch = statement.match(/if it opens the code must have been \d+/);
      if (forwardMatch === null || backwardMatch === null) {
        throw new Error('the two directions of the equivalence are missing');
      }
      return { forward: true, backward: true };
    },
    solve(slots) {
      return { sufficient: slots.forward, necessary: slots.backward };
    },
    render(solution) {
      if (solution.sufficient && solution.necessary) return 'Yes.';
      if (solution.sufficient) return 'It is sufficient, but not necessary.';
      if (solution.necessary) return 'Necessary, but not sufficient.';
      return 'Neither necessary nor sufficient.';
    },
    compute: [
      'const slots = $slots;',
      'if (slots.forward && slots.backward) return "Yes.";',
      'if (slots.forward) return "It is sufficient, but not necessary.";',
      'if (slots.backward) return "Necessary, but not sufficient.";',
      'return "Neither necessary nor sufficient.";'
    ].join('\n'),
    explain(slots) {
      return [
        'The problem states the condition holds in both directions: the code makes the door open, and an open door proves the code.',
        `The forward direction makes the condition sufficient and the backward direction makes it necessary.`,
        'Both directions hold together, so the condition is necessary and sufficient and the answer is yes.'
      ];
    }
  },
  {
    template: 'Constructing a counterexample systematically',
    type: 'constructing-a-counterexample-systematically',
    category: 'no-knowledge',
    parse(statement) {
      const thresholdMatch = statement.match(/greater than (\d+)/);
      const predicateMatch = statement.match(/then it is (\w+)/);
      const candidatesMatch = statement.match(/among ([\d, ]+)\./);
      if (thresholdMatch === null || predicateMatch === null || candidatesMatch === null) {
        throw new Error('the implication or the candidates are missing');
      }
      return {
        threshold: Number(thresholdMatch[1]),
        operator: '>',
        predicate: predicateMatch[1],
        candidates: candidatesMatch[1].split(',').map((value) => Number(value.trim()))
      };
    },
    solve(slots) {
      const predicateHolds = (value) => (slots.predicate === 'even' ? value % 2 === 0 : value % 2 !== 0);
      const witness = slots.candidates.find((value) => compare(value, slots.operator, slots.threshold) && !predicateHolds(value));
      if (witness === undefined) throw new Error('no counterexample found among the candidates');
      return { witness };
    },
    render(solution) {
      return `${solution.witness}.`;
    },
    compute: [
      'const slots = $slots;',
      'const predicateHolds = (value) => slots.predicate === "even" ? value % 2 === 0 : value % 2 !== 0;',
      'const witness = slots.candidates.find((value) => value > slots.threshold && !predicateHolds(value));',
      'if (witness === undefined) throw new Error("no counterexample found among the candidates");',
      'return witness + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        `A counterexample must make the hypothesis true and the conclusion false: it must be ${slots.operator} ${slots.threshold} while failing to be ${slots.predicate}.`,
        'Testing each candidate against the hypothesis first discards the numbers that do not even trigger the rule.',
        `The remaining candidate that is not ${slots.predicate} falsifies the universal claim and is the counterexample.`
      ];
    }
  },
];
