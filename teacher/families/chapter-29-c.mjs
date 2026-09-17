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
    template: 'Implication as an access rule',
    type: 'implication-as-an-access-rule',
    category: 'no-knowledge',
    parse(statement) {
      const ruleMatch = statement.match(/then they may (.+?)\./);
      const personMatch = statement.match(/([A-Z][a-z]+) has a VIP badge/);
      if (ruleMatch === null || personMatch === null) {
        throw new Error('the implication or the satisfied premise is missing');
      }
      return { person: personMatch[1], action: ruleMatch[1], holds: true };
    },
    solve(slots) {
      if (slots.holds !== true) throw new Error('the antecedent is not satisfied');
      return { conclusion: `${slots.person} may ${slots.action}` };
    },
    render(solution) {
      return `${solution.conclusion}.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.holds !== true) throw new Error("the antecedent is not satisfied");',
      'return slots.person + " may " + slots.action + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        `The rule is the implication "has a VIP badge implies may ${slots.action}".`,
        `The problem states the antecedent directly: ${slots.person} has the badge.`,
        'Modus ponens then guarantees the consequent, so the single guaranteed conclusion is the action, and nothing stronger may be claimed.'
      ];
    }
  },
  {
    template: 'Do not reverse an implication',
    type: 'do-not-reverse-an-implication',
    category: 'no-knowledge',
    parse(statement) {
      const ruleMatch = statement.match(/if someone has a (.+?), they may (.+?)”/);
      const observedMatch = statement.match(/([A-Z][a-z]+) may (.+?), but/);
      if (ruleMatch === null || observedMatch === null) {
        throw new Error('the implication or the observation is missing');
      }
      return { antecedent: ruleMatch[1], consequent: ruleMatch[2], observed: observedMatch[2] };
    },
    solve(slots) {
      if (slots.observed === slots.antecedent) return { conclusion: 'Yes' };
      if (slots.observed === slots.consequent) return { conclusion: 'No' };
      throw new Error('the observation matches neither side of the implication');
    },
    render(solution) {
      return `${solution.conclusion}.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.observed === slots.antecedent) return "Yes.";',
      'if (slots.observed === slots.consequent) return "No.";',
      'throw new Error("the observation matches neither side of the implication");'
    ].join('\n'),
    explain(slots) {
      return [
        `The rule only runs forward: "${slots.antecedent}" implies "${slots.consequent}".`,
        `What we observe is the consequent "${slots.observed}", and the text adds that staff reach the same door without the badge, so the consequent has other causes.`,
        'A consequent cannot be reversed into its antecedent unless the implication is an equivalence, so nothing about the badge follows and the answer is no.'
      ];
    }
  },
  {
    template: 'An intuitive contrapositive in a universal rule',
    type: 'an-intuitive-contrapositive-in-a-universal-rule',
    category: 'no-knowledge',
    parse(statement) {
      const ruleMatch = statement.match(/Every (\w+) piece is (\w+)/);
      const observedMatch = statement.match(/piece that is not (\w+)/);
      if (ruleMatch === null || observedMatch === null) {
        throw new Error('the universal rule or the observation is missing');
      }
      return { antecedent: ruleMatch[1], consequent: ruleMatch[2], observed: `not ${observedMatch[1]}` };
    },
    solve(slots) {
      const contradicts = slots.observed === `not ${slots.consequent}`;
      return { text: contradicts ? `No, it cannot be ${slots.antecedent}` : `Yes, it can be ${slots.antecedent}` };
    },
    render(solution) {
      return `${solution.text}.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.observed === "not " + slots.consequent) return "No, it cannot be " + slots.antecedent + ".";',
      'return "Yes, it can be " + slots.antecedent + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        `The universal rule says every ${slots.antecedent} piece is ${slots.consequent}, that is "${slots.antecedent}" implies "${slots.consequent}".`,
        `The piece we found fails the consequent: it is ${slots.observed}.`,
        'By the contrapositive the antecedent must fail too, so the piece cannot be golden.'
      ];
    }
  },
  {
    template: '“At least two” as a threshold',
    type: 'at-least-two-as-a-threshold',
    category: 'no-knowledge',
    parse(statement) {
      const ruleMatch = statement.match(/at least (\d+) of (\d+) tasks/);
      const solvedMatch = statement.match(/solves tasks ([\d, and]+) but not (\d+)/);
      if (ruleMatch === null || solvedMatch === null) {
        throw new Error('the threshold or the solved tasks are missing');
      }
      return {
        threshold: Number(ruleMatch[1]),
        total: Number(ruleMatch[2]),
        solved: [...solvedMatch[1].matchAll(/\d+/g)].map((match) => Number(match[0]))
      };
    },
    solve(slots) {
      return { awarded: slots.solved.length >= slots.threshold };
    },
    render(solution) {
      return `${solution.awarded ? 'Yes' : 'No'}.`;
    },
    compute: [
      'const slots = $slots;',
      'return slots.solved.length >= slots.threshold ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots) {
      return [
        `The award condition is a threshold: at least ${slots.threshold} of the ${slots.total} tasks must be solved.`,
        `The description lists the solved tasks as ${formatList(slots.solved)}, so the number of successes can be counted directly.`,
        `That count reaches the threshold, so the condition is met and the prize is received.`
      ];
    }
  },
  {
    template: '“Exactly two” does not mean “at least two”',
    type: 'exactly-two-does-not-mean-at-least-two',
    category: 'no-knowledge',
    parse(statement) {
      const requireMatch = statement.match(/exactly (\w+) of (\w+) buttons/);
      const pressedMatch = statement.match(/All (\w+) are pressed/);
      if (requireMatch === null || pressedMatch === null) {
        throw new Error('the exact requirement or the pressed count is missing');
      }
      return { require: numberWord(requireMatch[1]), total: numberWord(requireMatch[2]), pressed: numberWord(pressedMatch[1]) };
    },
    solve(slots) {
      return { opens: slots.pressed === slots.require };
    },
    render(solution) {
      return `${solution.opens ? 'Yes' : 'No'}.`;
    },
    compute: [
      'const slots = $slots;',
      'return slots.pressed === slots.require ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots) {
      return [
        `"Exactly ${slots.require}" is an equality, not a minimum, so ${slots.require} pressed buttons are required while one more is already too many.`,
        `The problem says ${slots.pressed} of the ${slots.total} buttons are pressed.`,
        `Since the count does not equal the required value, the gate stays closed.`
      ];
    }
  },
  {
    template: "De Morgan's rule through a finite example",
    type: 'de-morgans-rule-through-a-finite-example',
    category: 'no-knowledge',
    parse(statement) {
      const ruleMatch = statement.match(/it is (\w+) or (\w+)/);
      if (ruleMatch === null) {
        throw new Error('the negated disjunction is missing');
      }
      return { operator: 'or', properties: [ruleMatch[1], ruleMatch[2]] };
    },
    solve(slots) {
      return { text: `It must be neither ${slots.properties.join(' nor ')}` };
    },
    render(solution) {
      return `${solution.text}.`;
    },
    compute: [
      'const slots = $slots;',
      'return "It must be neither " + slots.properties.join(" nor ") + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        `The test negates a disjunction: NOT(${slots.properties[0]} or ${slots.properties[1]}).`,
        'De Morgan\'s rule turns the negation of an "or" into the conjunction of the two negations.',
        `So passing requires both ${slots.properties[0]} and ${slots.properties[1]} to be absent at the same time.`
      ];
    }
  },
  {
    template: 'Negating “and” allows at least one failure',
    type: 'negating-and-allows-at-least-one-failure',
    category: 'no-knowledge',
    parse(statement) {
      const ruleMatch = statement.match(/it is (\w+) and (\w+)/);
      if (ruleMatch === null) {
        throw new Error('the negated conjunction is missing');
      }
      return { operator: 'and', properties: [ruleMatch[1], ruleMatch[2]] };
    },
    solve(slots) {
      return { text: `All pieces that are not simultaneously ${slots.properties.join(' and ')}` };
    },
    render(solution) {
      return `${solution.text}.`;
    },
    compute: [
      'const slots = $slots;',
      'return "All pieces that are not simultaneously " + slots.properties.join(" and ") + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        `The rejection test negates a conjunction: NOT(${slots.properties[0]} and ${slots.properties[1]}).`,
        'De Morgan\'s rule turns the negation of an "and" into the disjunction of the two negations.',
        `A piece is therefore rejected as soon as it lacks ${slots.properties[0]} or lacks ${slots.properties[1]}, so only the pieces that are ${slots.properties[0]} and ${slots.properties[1]} at once are kept.`
      ];
    }
  },
  {
    template: 'A necessary condition for acceptance',
    type: 'a-necessary-condition-for-acceptance',
    category: 'no-knowledge',
    parse(statement) {
      const ruleMatch = statement.match(/only if it is (\w+) AND has a (\w+)/);
      const queryMatch = statement.match(/property “(\w+)” necessary/);
      if (ruleMatch === null || queryMatch === null) {
        throw new Error('the acceptance rule or the queried property are missing');
      }
      return { operator: 'and', properties: [ruleMatch[1], ruleMatch[2]], query: queryMatch[1] };
    },
    solve(slots) {
      const necessary = slots.operator === 'and' ? slots.properties.includes(slots.query) : slots.properties.length === 1 && slots.properties[0] === slots.query;
      const sufficient = slots.operator === 'or' ? slots.properties.includes(slots.query) : slots.properties.length === 1 && slots.properties[0] === slots.query;
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
      'const necessary = slots.operator === "and" ? slots.properties.indexOf(slots.query) !== -1 : slots.properties.length === 1;',
      'const sufficient = slots.operator === "or" ? slots.properties.indexOf(slots.query) !== -1 : slots.properties.length === 1;',
      'if (sufficient && necessary) return "It is necessary and sufficient.";',
      'if (sufficient) return "It is sufficient, but not necessary.";',
      'if (necessary) return "Necessary, but not sufficient.";',
      'return "Neither necessary nor sufficient.";'
    ].join('\n'),
    explain(slots) {
      return [
        `Acceptance is the conjunction ${slots.properties[0]} AND ${slots.properties[1]}, so every accepted object has both properties.`,
        `${slots.query} is therefore required and is a necessary condition.`,
        `It is not sufficient on its own, because an object with ${slots.query} but without ${slots.properties[1]} is still not accepted.`
      ];
    }
  },
  {
    template: 'Contradiction from two rules',
    type: 'contradiction-from-two-rules',
    category: 'no-knowledge',
    parse(statement) {
      const positiveMatch = statement.match(/every (\w+) piece is (\w+)/);
      const negativeMatch = statement.match(/no (\w+) piece is (\w+)/);
      if (positiveMatch === null || negativeMatch === null) {
        throw new Error('the two rules are missing');
      }
      return { subject: positiveMatch[1], property: positiveMatch[2], positiveUniversal: true, negativeUniversal: true };
    },
    solve(slots) {
      const contradiction = slots.positiveUniversal && slots.negativeUniversal;
      if (contradiction) return { text: `No ${slots.subject} piece can exist` };
      return { text: `A ${slots.subject} piece can exist` };
    },
    render(solution) {
      return `${solution.text}.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.positiveUniversal && slots.negativeUniversal) return "No " + slots.subject + " piece can exist.";',
      'return "A " + slots.subject + " piece can exist.";'
    ].join('\n'),
    explain(slots) {
      return [
        `The first rule says every ${slots.subject} piece is ${slots.property}, so the property follows from being ${slots.subject}.`,
        `The second rule says no ${slots.property} piece is ${slots.subject}, so being ${slots.property} excludes being ${slots.subject}.`,
        `Assuming a ${slots.subject} piece exists forces it to be ${slots.property} and at the same time not ${slots.property}, a contradiction, so no such piece can exist.`
      ];
    }
  },
  {
    template: 'A rule true for all tested examples is not automatically universal',
    type: 'a-rule-true-for-all-tested-examples-is-not-automatically-universal',
    category: 'no-knowledge',
    parse(statement) {
      const testedMatch = statement.match(/check the numbers ([\d, ]+) and all/);
      const propertyMatch = statement.match(/all are (\w+)/);
      if (testedMatch === null || propertyMatch === null) {
        throw new Error('the tested numbers or the claimed property are missing');
      }
      return {
        tested: testedMatch[1].split(',').map((value) => Number(value.trim())),
        property: propertyMatch[1],
        domainSize: 'unbounded'
      };
    },
    solve(slots) {
      const generalizes = slots.domainSize !== 'unbounded' && slots.tested.length >= slots.domainSize;
      return { generalizes };
    },
    render(solution) {
      return `${solution.generalizes ? 'Yes' : 'No'}.`;
    },
    compute: [
      'const slots = $slots;',
      'const generalizes = slots.domainSize !== "unbounded" && slots.tested.length >= slots.domainSize;',
      'return generalizes ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots) {
      return [
        `Only the numbers ${formatList(slots.tested)} were checked, and each of them happens to be ${slots.property}.`,
        `The claim covers all numbers, which is an unbounded domain that the finite sample never exhausted.`,
        'Examples can only confirm the cases they test, so the universal conclusion is not justified.'
      ];
    }
  },
];
