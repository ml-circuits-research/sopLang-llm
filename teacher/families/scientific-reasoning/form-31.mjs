/**
 * Form 31 of the scientific-reasoning book: exhaustive case analysis.
 *
 * Every variant names three binary conditions A, B, C, states a target result
 * and the rule that makes it appear, and asks for all 8 combinations to be
 * enumerated with the favorable ones identified. The rule is a condition
 * count ("exactly one", "exactly two", "at least two") or a small Boolean
 * formula over the same letters ("A is YES or both B and C are YES", "A is YES
 * and at least one among B or C is YES").
 *
 * The favorable combinations are printed in the ascending order of the
 * A/B/C truth table with N before Y, and the variants differ in the world's
 * vocabulary, not in the enumeration, so one family covers all twenty-five of
 * them.
 */

import { slugify } from '../../naming.mjs';

const VARIABLE_PATTERN = /([A-Z])=(.*?)(?=;|\.|$)/g;

function compileRule(text, letters) {
  const [first, second, third] = letters;
  const rule = text.trim();
  if (rule === 'exactly one condition is YES') {
    return { kind: 'count', exactly: 1 };
  }
  if (rule === 'exactly two conditions are YES') {
    return { kind: 'count', exactly: 2 };
  }
  if (rule === 'at least two conditions are YES') {
    return { kind: 'count', atLeast: 2 };
  }
  if (rule === `${first} is YES or both ${second} and ${third} are YES`) {
    return { kind: 'firstOrBothOthers' };
  }
  if (rule === `${first} is YES and at least one among ${second} or ${third} is YES`) {
    return { kind: 'firstAndAnyOther' };
  }
  throw new Error(`the stated rule "${rule}" is not a supported case rule`);
}

function parse(statement) {
  const problemData = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  if (problemData === null) {
    throw new Error('the statement does not state the conditions and the rule');
  }
  const meanings = /^([\s\S]*?)\.\s*The target result/.exec(problemData[1]);
  const target = /The target result is “([^”]+)”\./.exec(problemData[1]);
  const ruleText = /target appears exactly in cases in which (.+?)\. Each letter can be YES or NO\./.exec(
    problemData[1]
  );
  if (meanings === null || target === null || ruleText === null) {
    throw new Error('the statement does not state the conditions, the target, and the rule');
  }
  const variables = [];
  for (const match of meanings[1].matchAll(VARIABLE_PATTERN)) {
    variables.push({ letter: match[1], meaning: match[2].trim() });
  }
  if (variables.length < 2) {
    throw new Error('the statement does not name at least two conditions');
  }
  return {
    variables,
    target: target[1],
    rule: compileRule(ruleText[1], variables.map((variable) => variable.letter))
  };
}

/**
 * The favorable combinations of the A/B/C truth table in ascending numeric
 * order (N before Y), which is the order the source prints.
 */
function favorable(variables, rule) {
  const total = 2 ** variables.length;
  const favorableCases = [];
  for (let index = 0; index < total; index += 1) {
    const values = variables.map((_, position) => ((index >> (variables.length - 1 - position)) & 1) === 1);
    const yes = values.filter(Boolean).length;
    let holds;
    if (rule.kind === 'count') {
      holds = rule.exactly === undefined ? yes >= rule.atLeast : yes === rule.exactly;
    } else if (rule.kind === 'firstOrBothOthers') {
      holds = values[0] || (values[1] && values[2]);
    } else {
      holds = values[0] && (values[1] || values[2]);
    }
    if (holds) {
      favorableCases.push(values.map((value) => (value ? 'Y' : 'N')).join(''));
    }
  }
  return favorableCases;
}

function solve(slots) {
  const favorableCases = favorable(slots.variables, slots.rule);
  if (favorableCases.length === 0) {
    throw new Error('the stated rule leaves no favorable combination');
  }
  return { favorableCases };
}

function render(solution) {
  return `Favorable cases: ${solution.favorableCases.join(', ')}.`;
}

const WIRES = [
  {
    name: 'favorable',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const total = Math.pow(2, slots.variables.length);',
      'const favorable = [];',
      'for (let index = 0; index < total; index += 1) {',
      '  const values = slots.variables.map((_, position) => ((index >> (slots.variables.length - 1 - position)) & 1) === 1);',
      '  const yes = values.filter(Boolean).length;',
      '  let holds;',
      '  if (slots.rule.kind === "count") {',
      '    holds = slots.rule.exactly === undefined ? yes >= slots.rule.atLeast : yes === slots.rule.exactly;',
      '  } else if (slots.rule.kind === "firstOrBothOthers") {',
      '    holds = values[0] || (values[1] && values[2]);',
      '  } else {',
      '    holds = values[0] && (values[1] || values[2]);',
      '  }',
      '  if (holds) {',
      '    favorable.push(values.map((value) => (value ? "Y" : "N")).join(""));',
      '  }',
      '}',
      'probe(favorable.length > 0, "the stated rule must leave at least one favorable combination");',
      'probe(favorable.length < total, "a rule that accepts every combination is not a case analysis");',
      'return favorable;'
    ].join('\n')
  }
];

const COMPUTE = [
  'return "Favorable cases: " + $favorable.join(", ") + ".";'
].join('\n');

function explain(slots, solution) {
  const letters = slots.variables.map((variable) => variable.letter).join('/');
  return [
    `The target result "${slots.target}" depends on the ${slots.variables.length} binary conditions ${letters}, so the truth table has 2^${slots.variables.length} = ${2 ** slots.variables.length} combinations.`,
    'Listing them all is what makes the enumeration complete, because every condition takes both YES and NO and no combination is skipped.',
    `The same stated rule is applied to each combination: a combination is favorable exactly when the rule holds for it, which leaves the cases ${solution.favorableCases.join(', ')}.`,
    'Because every branch of the truth table was built and tested, no favorable case can lie outside the printed list.'
  ];
}

export const unit = 31;

export const cases = [
  {
    template: 'Exhaustive case analysis',
    type: slugify('Exhaustive case analysis'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
