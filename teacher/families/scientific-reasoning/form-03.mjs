/**
 * Form 3 of the scientific-reasoning book: if-then logical chain.
 *
 * Every variant posts a chain of local rules — "if “X” has been completed,
 * then “Y” can begin" — and states one premise as completed, then asks which
 * conclusions can be deduced one after the other. Each rule's conclusion is the
 * next rule's premise, so the deduction walks the chain from the stated premise
 * to the end of the rules, and the printed answer writes that walk with arrows.
 *
 * The world vocabulary changes from variant to variant (germination, water
 * transport, the meadow food chain, the digestive route, the light path, the
 * circuit), while the shape of the rules does not, so one family covers all
 * twenty-five of them. The chain length is whatever the case states, and the
 * wording of every link comes from the parsed rules.
 */

import { slugify } from '../../naming.mjs';

const RULE_PATTERN =
  /In the model, if [“"](.+?)[”"] has been completed, then [“"](.+?)[”"] can begin\./g;
const KNOWN_PATTERN = /We know that [“"](.+?)[”"] has been completed\./;

function parse(statement) {
  const caseData = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state its local rules');
  }
  const rules = [];
  for (const match of caseData[1].matchAll(RULE_PATTERN)) {
    rules.push({ from: match[1].trim(), to: match[2].trim() });
  }
  if (rules.length === 0) {
    throw new Error('the statement lists no if-then rule');
  }
  const known = KNOWN_PATTERN.exec(caseData[1]);
  if (known === null) {
    throw new Error('the statement does not state which premise is already completed');
  }
  return { rules, known: known[1].trim() };
}

function solve(slots) {
  const conclusion = new Map();
  for (const rule of slots.rules) {
    if (conclusion.has(rule.from) && conclusion.get(rule.from) !== rule.to) {
      throw new Error(`the rules state two different conclusions for “${rule.from}”`);
    }
    conclusion.set(rule.from, rule.to);
  }
  if (!conclusion.has(slots.known)) {
    throw new Error('the completed premise starts none of the stated rules');
  }
  const chain = [slots.known];
  const seen = new Set(chain);
  while (conclusion.has(chain[chain.length - 1])) {
    const next = conclusion.get(chain[chain.length - 1]);
    if (seen.has(next)) {
      throw new Error('the stated rules run in a circle instead of a chain');
    }
    seen.add(next);
    chain.push(next);
  }
  if (chain.length !== slots.rules.length + 1) {
    throw new Error('the stated rules do not form one chain that starts at the completed premise');
  }
  return { chain };
}

function render(solution) {
  return `The deduced chain is: ${solution.chain.join(' → ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const conclusion = new Map();',
  'for (const rule of slots.rules) {',
  '  conclusion.set(rule.from, rule.to);',
  '}',
  'const chain = [slots.known];',
  'while (conclusion.has(chain[chain.length - 1])) {',
  '  const next = conclusion.get(chain[chain.length - 1]);',
  '  chain.push(next);',
  '}',
  'return "The deduced chain is: " + chain.join(" → ") + ".";'
].join('\n');

function explain(slots, solution) {
  const steps = solution.chain.slice(1);
  return [
    `The completed premise is “${slots.known}”, so the deduction begins at that state.`,
    `The rule that starts from ${solution.chain[0]} concludes ${steps[0]}, and each later rule starts exactly from the state the previous rule concluded (${steps.join(' → ')}).`,
    `No rule is applied out of order: every conclusion becomes the premise of the next rule, which is why the chain is forced rather than chosen.`,
    `The deduction reaches ${solution.chain[solution.chain.length - 1]} after ${steps.length} step${steps.length === 1 ? '' : 's'}, and no rule of the case is left unapplied.`
  ];
}

export const unit = 3;

export const cases = [
  {
    template: 'If-then logical chain',
    type: slugify('If-then logical chain'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
