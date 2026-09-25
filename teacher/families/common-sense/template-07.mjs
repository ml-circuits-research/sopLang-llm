/**
 * Template 7 of the common-sense book: logical implications.
 *
 * Every variant states a numbered list of conditionals over the activity of
 * indicators A–E, one observed case that fixes the value of some indicators,
 * and asks which values of the remaining indicators follow necessarily and
 * whether the last rule is needed for those conclusions. Nothing follows by
 * converse or by contrapositive unless a rule states it, so the answer is the
 * forward closure of the observed facts under the stated rules.
 *
 * The variants of this template repeat one rule set and one observed case; the
 * parser still reads the rules, the observation, the queried indicators, and
 * the rule the question asks about from the statement, and the deduction is
 * computed rather than recognized.
 */

import { slugify } from '../../naming.mjs';

const RULE_PATTERN = /(\d)\. (If [^.]*\.)/g;
const CONDITION_PATTERN = /^(?:indicator )?([A-Z]) is (active|inactive)$/;
const CONSEQUENT_PATTERN = /^([A-Z]) (cannot be|must also be|must be|is) (active|inactive)$/;
const OBSERVED_PATTERN = /In the observed case, ([^.]+)\./;
const OBSERVED_FACT_PATTERN = /^([A-Z]) is known to be (active|inactive)$/;
const QUERY_PATTERN = /Which values of ([^.]+?) follow necessarily\?/;
const ASKED_RULE_PATTERN = /Is Rule (\d+) needed/;

const NUMBER_WORDS = Object.freeze(['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);

function parseConditions(text, index) {
  return text.split(' and ').map((clause) => {
    const condition = CONDITION_PATTERN.exec(clause.trim());
    if (condition === null) {
      throw new Error(`rule ${index} states a condition that this family does not read: "${clause.trim()}"`);
    }
    return { name: condition[1], value: condition[2] };
  });
}

function parseRules(statement) {
  const rules = [];
  for (const rule of statement.matchAll(RULE_PATTERN)) {
    const index = Number(rule[1]);
    const body = rule[2].replace(/\.$/, '').replace(/^If /, '');
    const split = /^(.*), ([A-Z] (?:cannot be|must also be|must be|is) (?:active|inactive))$/.exec(body);
    if (split === null) {
      throw new Error(`rule ${index} does not state a condition and a consequence`);
    }
    const consequent = CONSEQUENT_PATTERN.exec(split[2]);
    if (consequent === null) {
      throw new Error(`rule ${index} states a consequence that this family does not read: "${split[2]}"`);
    }
    // "E cannot be active" forbids activity, so the consequent is the opposite
    // of the value the sentence prints; "A is inactive" states it directly.
    const stated = consequent[3];
    rules.push({
      index,
      conditions: parseConditions(split[1], index),
      conclusion: {
        name: consequent[1],
        value: consequent[2] === 'cannot be' ? (stated === 'active' ? 'inactive' : 'active') : stated
      }
    });
  }
  return rules;
}

function parse(statement) {
  const rules = parseRules(statement);
  const observed = OBSERVED_PATTERN.exec(statement);
  const query = QUERY_PATTERN.exec(statement);
  const asked = ASKED_RULE_PATTERN.exec(statement);
  if (rules.length === 0) {
    throw new Error('the statement does not list any rule');
  }
  if (observed === null) {
    throw new Error('the statement does not state the observed case');
  }
  if (query === null) {
    throw new Error('the question does not name the indicators whose values follow');
  }
  if (asked === null) {
    throw new Error('the question does not name the rule whose necessity is asked');
  }
  const facts = observed[1].split(' and ').map((clause) => {
    const fact = OBSERVED_FACT_PATTERN.exec(clause.trim());
    if (fact === null) {
      throw new Error(`the observed case states an unknown fact: "${clause.trim()}"`);
    }
    return { name: fact[1], value: fact[2] };
  });
  return {
    rules,
    observed: facts,
    query: (query[1].match(/[A-Z]/g) ?? []),
    askedRule: Number(asked[1])
  };
}

/**
 * The forward closure of the observed facts. A rule is applied only when all of
 * its conditions already hold and its consequent is not yet known, so the rules
 * recorded as used are exactly those that added one of the derived facts; the
 * converse of a conditional is never applied, because that would need a rule
 * this statement does not contain.
 */
function solve(slots) {
  const facts = new Map(slots.observed.map((fact) => [fact.name, fact.value]));
  const observedNames = new Set(facts.keys());
  const applied = [];
  let progressed = true;
  while (progressed) {
    progressed = false;
    for (const rule of slots.rules) {
      if (applied.includes(rule.index)) {
        continue;
      }
      if (!rule.conditions.every((condition) => facts.get(condition.name) === condition.value)) {
        continue;
      }
      const known = facts.get(rule.conclusion.name);
      if (known !== undefined) {
        if (known !== rule.conclusion.value) {
          throw new Error(`rule ${rule.index} contradicts the known value of ${rule.conclusion.name}`);
        }
        continue;
      }
      facts.set(rule.conclusion.name, rule.conclusion.value);
      applied.push(rule.index);
      progressed = true;
    }
  }
  const values = slots.query.map((name) => {
    const value = facts.get(name);
    if (value === undefined) {
      throw new Error(`the stated rules do not pin down ${name}`);
    }
    if (observedNames.has(name)) {
      throw new Error(`${name} is observed rather than derived, a shape this family does not phrase`);
    }
    return { name, value };
  });
  if (applied.includes(slots.askedRule)) {
    throw new Error(`the deduction uses rule ${slots.askedRule}, a shape this family does not phrase`);
  }
  const askedRule = slots.rules.find((rule) => rule.index === slots.askedRule);
  if (askedRule === undefined) {
    throw new Error(`the question asks about rule ${slots.askedRule}, which the statement does not list`);
  }
  return { values, applied, askedRule };
}

function render(solution) {
  const conclusions = solution.values.map(({ name, value }) => `${name} must be ${value}`).join('; ');
  return `${conclusions}. Rule ${solution.askedRule.index} is not needed for these ${NUMBER_WORDS[solution.values.length]} conclusions in this case.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];',
  'const facts = new Map();',
  'for (const fact of slots.observed) {',
  '  facts.set(fact.name, fact.value);',
  '}',
  'const applied = [];',
  'let progressed = true;',
  'while (progressed) {',
  '  progressed = false;',
  '  for (const rule of slots.rules) {',
  '    if (applied.indexOf(rule.index) !== -1) {',
  '      continue;',
  '    }',
  '    const holds = rule.conditions.every((condition) => facts.get(condition.name) === condition.value);',
  '    if (!holds) {',
  '      continue;',
  '    }',
  '    const known = facts.get(rule.conclusion.name);',
  '    if (known !== undefined) {',
  '      if (known !== rule.conclusion.value) {',
  '        throw new Error("rule " + rule.index + " contradicts the known value of " + rule.conclusion.name);',
  '      }',
  '      continue;',
  '    }',
  '    facts.set(rule.conclusion.name, rule.conclusion.value);',
  '    applied.push(rule.index);',
  '    progressed = true;',
  '  }',
  '}',
  'probe(slots.query.every((name) => facts.get(name) !== undefined), "the stated rules must pin down every queried value");',
  'probe(applied.indexOf(slots.askedRule) === -1, "the asked rule must not be needed in this family");',
  'const conclusions = slots.query.map((name) => name + " must be " + facts.get(name)).join("; ");',
  'return conclusions + ". Rule " + slots.askedRule + " is not needed for these " + words[slots.query.length] + " conclusions in this case.";'
].join('\n');

function explain(slots, solution) {
  const observed = slots.observed.map(({ name, value }) => `${name} ${value}`).join(' and ');
  const applied = solution.applied.map((index) => slots.rules.find((rule) => rule.index === index));
  const additions = applied.map((rule) => `rule ${rule.index} gives ${rule.conclusion.name} ${rule.conclusion.value}`).join('; ');
  const asked = solution.askedRule;
  const askedCondition = asked.conditions.map(({ name, value }) => `${name} ${value}`).join(' and ');
  return [
    `The observed case fixes ${observed}, and only the stated conditionals are chained forward from those facts.`,
    `${additions}, so the values that follow necessarily are ${solution.values.map(({ name, value }) => `${name} ${value}`).join(', ')}.`,
    `A conditional licenses its consequent only when its condition holds, so none of the derived values can be reversed into a statement about the other indicators.`,
    `Rule ${asked.index} would need ${askedCondition}, which the derived facts do not satisfy, so it is compatible with these conclusions but is not needed for them.`
  ];
}

export const unit = 7;

export const cases = [
  {
    template: 'Logical implications',
    type: slugify('Logical implications'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
