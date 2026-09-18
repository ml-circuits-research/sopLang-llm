/**
 * Family H5 of the world seed book: causes, conditions, and consequences.
 *
 * Every problem states a list of Boolean facts and a list of implication rules
 * whose antecedents are combined with AND or OR, and asks which consequences
 * follow when the rules are applied exactly as written (no converse, and a
 * one-way implication is not reversed). The family forward-chains the rules to
 * a fixed point and reports the derived consequences in rule order.
 *
 * The printed appraisal has four shapes, and the shape is a property of the
 * derivation rather than of the grade: a consequence already stated as a fact
 * is reported as such, an OR rule reports its consequences as clauses, a rule
 * whose AND conditions are blocked reports both what follows and what does not,
 * and a fully fired rule set reports the deduced consequences, adding "all"
 * when the fired rules form one chain. Grades 2-4 append a cross-domain check
 * (grade 4 also a mixed-domain map-sheet count), which the family renders as the
 * labelled answer suffix.
 */

import {
  blocksOf,
  stripCrossDomain,
  parseCrossDomain,
  renderCrossDomain,
  CROSS_DOMAIN_SOURCE
} from './shared.mjs';
import { slugify } from '../../naming.mjs';

/** The predicates this scenario names, matched on words so "riverside" is not a river. */
const PREDICATES = Object.freeze([
  Object.freeze({ key: 'rain', pattern: /\brain\b/ }),
  Object.freeze({ key: 'river high', pattern: /\briver\b/ }),
  Object.freeze({ key: 'siren', pattern: /\bsiren\b/ }),
  Object.freeze({ key: 'gate closed', pattern: /\bgate\b/ }),
  Object.freeze({ key: 'flooding', pattern: /\bflood(?:ing|s)?\b/ }),
  Object.freeze({ key: 'road closure', pattern: /\broad\b/ }),
  Object.freeze({ key: 'warning', pattern: /\bwarning\b/ }),
  Object.freeze({ key: 'field muddy', pattern: /\bmud(?:dy)?\b/ }),
  Object.freeze({ key: 'bus rerouting', pattern: /\bbus\b|\brerout/ })
]);

/** How the book names each consequence in the printed answer. */
const CONSEQUENCE_NAMES = Object.freeze({
  flooding: 'flooding',
  'road closure': 'road closure',
  warning: 'a warning',
  'field muddy': 'the field becomes muddy',
  'bus rerouting': 'bus rerouting'
});

const STATEMENT_PATTERN = /Facts: ([\s\S]*?)\s*Rules: ([\s\S]*)/;
const RULE_PATTERN = /If ([^.]*)\./g;

function predicateOf(text) {
  const lowered = text.toLowerCase();
  const positive = !/\bnot\b/.test(lowered);
  for (const predicate of PREDICATES) {
    if (predicate.pattern.test(lowered)) {
      return { key: predicate.key, positive };
    }
  }
  throw new Error(`the statement uses an unknown condition "${text}"`);
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const split = STATEMENT_PATTERN.exec(facts);
  if (split === null) {
    throw new Error('the statement does not list facts followed by rules');
  }
  const givens = split[1]
    .split(';')
    .map((text) => text.trim().replace(/\.$/, ''))
    .filter((text) => text !== '');
  if (givens.length === 0) {
    throw new Error('the statement lists no given fact');
  }
  const rules = [];
  for (const match of split[2].matchAll(RULE_PATTERN)) {
    const body = match[1];
    const comma = body.indexOf(',');
    if (comma === -1) {
      throw new Error(`the rule "${match[0]}" does not separate conditions from its consequence`);
    }
    const conditions = body.slice(0, comma).trim();
    const consequent = body.slice(comma + 1).trim();
    const parts = conditions.split(/\s+(?:AND|OR)\s+/i);
    rules.push({
      connector: /\bOR\b/i.test(conditions) ? 'OR' : 'AND',
      conditions: parts.map((part) => predicateOf(part)),
      consequent: predicateOf(consequent).key
    });
  }
  if (rules.length === 0) {
    throw new Error('the statement states no rule');
  }
  return {
    facts: givens.map((text) => predicateOf(text)),
    rules,
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function nameOf(key) {
  const name = CONSEQUENCE_NAMES[key];
  if (name === undefined) {
    throw new Error(`the consequence "${key}" has no printed name`);
  }
  return name;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The book's list style: "A and B", "A, B, and C". */
function joinList(items) {
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function chainOf(slots, derived) {
  for (let index = 1; index < derived.length; index += 1) {
    const rule = slots.rules.find((candidate) => candidate.consequent === derived[index]);
    const previous = derived.slice(0, index);
    if (!rule.conditions.some((condition) => previous.includes(condition.key))) {
      return false;
    }
  }
  return true;
}

function solve(slots) {
  const trueKeys = new Set(slots.facts.filter((fact) => fact.positive).map((fact) => fact.key));
  const falseKeys = new Set(slots.facts.filter((fact) => !fact.positive).map((fact) => fact.key));
  const derived = [];
  const derivedKeys = new Set();
  const holds = (condition) => (condition.positive
    ? trueKeys.has(condition.key) || derivedKeys.has(condition.key)
    : falseKeys.has(condition.key));
  let changed = true;
  while (changed) {
    changed = false;
    for (const rule of slots.rules) {
      if (trueKeys.has(rule.consequent) || derivedKeys.has(rule.consequent)) {
        continue;
      }
      const satisfied = rule.connector === 'OR'
        ? rule.conditions.some(holds)
        : rule.conditions.every(holds);
      if (satisfied) {
        derived.push(rule.consequent);
        derivedKeys.add(rule.consequent);
        changed = true;
      }
    }
  }
  const heads = slots.rules.map((rule) => rule.consequent);
  const givenHeads = heads.filter((head) => trueKeys.has(head));
  const missingHeads = heads.filter((head) => !trueKeys.has(head) && !derivedKeys.has(head));
  const kind = givenHeads.length > 0
    ? 'given'
    : slots.rules.some((rule) => rule.connector === 'OR')
      ? 'disjunction'
      : missingHeads.length > 0
        ? 'blocked'
        : 'all';
  if (derived.length === 0) {
    throw new Error('no rule of the statement fires on the given facts');
  }
  return {
    kind,
    chain: kind === 'all' ? chainOf(slots, derived) : false,
    derived,
    givenHeads,
    missingHeads,
    facts: slots.facts,
    rules: slots.rules,
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  return `${appraisal(solution)}${suffixOf(solution)}`;
}

function appraisal(solution) {
  const deduced = capitalize(joinList(solution.derived.map(nameOf)));
  if (solution.kind === 'given') {
    return `${deduced} can be deduced; ${nameOf(solution.givenHeads[0])} is already given as a fact.`;
  }
  if (solution.kind === 'disjunction') {
    const clauses = solution.derived.map((key) => (key === 'warning'
      ? 'the warning follows from the working siren'
      : capitalize(nameOf(key))));
    return `${clauses.slice(0, -1).join(', ')}${clauses.length === 1 ? '' : ', and '}${clauses[clauses.length - 1]}.`;
  }
  if (solution.kind === 'blocked') {
    return `${deduced} can be deduced, but ${joinList(solution.missingHeads.map(nameOf))} cannot be deduced.`;
  }
  return `${deduced} can${solution.chain ? ' all' : ''} be deduced.`;
}

function suffixOf(solution) {
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? '' : ` ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Array.isArray(slots.facts) && slots.facts.length > 0, "the statement must list at least one given fact");',
  'probe(Array.isArray(slots.rules) && slots.rules.length > 0, "the statement must state at least one implication rule");',
  'const names = { flooding: "flooding", "road closure": "road closure", warning: "a warning", "field muddy": "the field becomes muddy", "bus rerouting": "bus rerouting" };',
  'const nameOf = (key) => { const name = names[key]; if (name === undefined) { throw new Error("unknown consequence " + key); } return name; };',
  'const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);',
  'const joinList = (items) => items.length === 1 ? items[0] : items.length === 2 ? items[0] + " and " + items[1] : items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];',
  'const trueKeys = new Set(slots.facts.filter((fact) => fact.positive).map((fact) => fact.key));',
  'const falseKeys = new Set(slots.facts.filter((fact) => !fact.positive).map((fact) => fact.key));',
  'const derived = [];',
  'const derivedKeys = new Set();',
  'const holds = (condition) => condition.positive ? trueKeys.has(condition.key) || derivedKeys.has(condition.key) : falseKeys.has(condition.key);',
  'let changed = true;',
  'while (changed) {',
  '  changed = false;',
  '  for (const rule of slots.rules) {',
  '    if (trueKeys.has(rule.consequent) || derivedKeys.has(rule.consequent)) {',
  '      continue;',
  '    }',
  '    const satisfied = rule.connector === "OR" ? rule.conditions.some(holds) : rule.conditions.every(holds);',
  '    if (satisfied) {',
  '      derived.push(rule.consequent);',
  '      derivedKeys.add(rule.consequent);',
  '      changed = true;',
  '    }',
  '  }',
  '}',
  'probe(derived.length > 0, "at least one rule must fire on the given facts");',
  'const heads = slots.rules.map((rule) => rule.consequent);',
  'const givenHeads = heads.filter((head) => trueKeys.has(head));',
  'const missingHeads = heads.filter((head) => !trueKeys.has(head) && !derivedKeys.has(head));',
  'probe(heads.every((head) => names[head] !== undefined), "every consequence must be one the book names");',
  'const deduced = capitalize(joinList(derived.map(nameOf)));',
  'let main;',
  'if (givenHeads.length > 0) {',
  '  main = deduced + " can be deduced; " + nameOf(givenHeads[0]) + " is already given as a fact.";',
  '} else if (slots.rules.some((rule) => rule.connector === "OR")) {',
  '  const clauses = derived.map((key) => key === "warning" ? "the warning follows from the working siren" : capitalize(nameOf(key)));',
  '  main = clauses.slice(0, -1).join(", ") + (clauses.length === 1 ? "" : ", and ") + clauses[clauses.length - 1] + ".";',
  '} else if (missingHeads.length > 0) {',
  '  main = deduced + " can be deduced, but " + joinList(missingHeads.map(nameOf)) + " cannot be deduced.";',
  '} else {',
  '  let chain = true;',
  '  for (let index = 1; index < derived.length; index += 1) {',
  '    const rule = slots.rules.filter((candidate) => candidate.consequent === derived[index])[0];',
  '    if (!rule.conditions.some((condition) => derived.slice(0, index).includes(condition.key))) {',
  '      chain = false;',
  '    }',
  '  }',
  '  main = deduced + " can" + (chain ? " all" : "") + " be deduced.";',
  '}',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const sentences = [
    'Read the given facts as true predicates and fire each rule only when its antecedent is satisfied: AND needs every listed condition, OR needs one.',
    `Forward chaining adds ${solution.derived.map(nameOf).join(', ')} in that order, and no converse of a rule is used.`
  ];
  if (solution.kind === 'given') {
    sentences.push(`${capitalize(nameOf(solution.givenHeads[0]))} is stated as a fact, so the answer reports it as given rather than deduced.`);
  } else if (solution.kind === 'blocked') {
    sentences.push(`${joinList(solution.missingHeads.map(nameOf))} stays underivable because an AND condition of its rule is not satisfied by any fact or derived consequence.`);
  } else if (solution.kind === 'disjunction') {
    sentences.push('The mud rule is a disjunction, so the single stated condition that holds is enough to fire it, and the siren rule fires independently.');
  } else {
    sentences.push(solution.chain
      ? 'Every rule fired and each one after the first takes its antecedent from the previous conclusion, so the whole chain follows.'
      : 'Every rule fired, but the conclusions come from independent rules as well as a chain, so the answer lists them without claiming a single chain.');
  }
  return sentences;
}

function caseFor(grade) {
  const template = `Causes, conditions, and consequences (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'H5';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
