/**
 * Form 33 of the scientific-reasoning book: discovering a rule from examples.
 *
 * Every variant names two binary conditions A and B, shows three input/output
 * rows of an unknown logical rule, and offers the same four candidates
 * (conjunction, disjunction, exclusive or, joint denial). Exactly one
 * candidate reproduces all three rows; the printed answer names the surviving
 * rule and applies it to the new case A=YES, B=NO.
 *
 * The variants differ in the world's vocabulary and in the three observed
 * rows, not in the elimination, so one family covers all twenty-five of them.
 */

import { slugify } from '../../naming.mjs';

function classify(body, [first, second]) {
  if (body === `${first} AND ${second}`) {
    return 'and';
  }
  if (body === `${first} OR ${second}`) {
    return 'or';
  }
  if (body === 'exactly one') {
    return 'xor';
  }
  if (body === `neither ${first} nor ${second}`) {
    return 'nor';
  }
  throw new Error(`the candidate rule "${body}" is not a supported logical rule`);
}

function applies(kind, [first, second]) {
  if (kind === 'and') {
    return first && second;
  }
  if (kind === 'or') {
    return first || second;
  }
  if (kind === 'xor') {
    return first !== second;
  }
  return !first && !second;
}

function parse(statement) {
  const problemData = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  const question = /Question\.\s*([\s\S]*)$/.exec(statement);
  if (problemData === null || question === null) {
    throw new Error('the statement does not state the examples, the candidates, and the new case');
  }
  const block = problemData[1];
  const meanings = [...block.matchAll(/([A-Z]) means “([^”]+)”/g)].map((match) => ({
    letter: match[1],
    meaning: match[2]
  }));
  const observed = /A box applies the same unknown logical rule: ([\s\S]*?)\.\s*Candidates:/.exec(block);
  const candidateList = /Candidates: ([\s\S]*?)\.\s*$/.exec(block);
  const target = /new case ([A-Z])=(YES|NO), ([A-Z])=(YES|NO)/.exec(question[1]);
  if (meanings.length !== 2 || observed === null || candidateList === null || target === null) {
    throw new Error('the statement does not state the examples, the candidates, and the new case');
  }
  const letters = meanings.map((meaning) => meaning.letter);
  const examples = [];
  for (const row of observed[1].split('; ')) {
    const match = /^([A-Z])=(YES|NO), ([A-Z])=(YES|NO) → result=(YES|NO)$/.exec(row.trim());
    if (match === null || match[1] !== letters[0] || match[3] !== letters[1]) {
      throw new Error(`the example "${row.trim()}" is not a row over ${letters.join(' and ')}`);
    }
    examples.push({
      values: [match[2] === 'YES', match[4] === 'YES'],
      result: match[5] === 'YES'
    });
  }
  const candidates = [];
  for (const candidate of candidateList[1].split('; ')) {
    const match = /^R(\d+)=(.+)$/.exec(candidate.trim());
    if (match === null) {
      throw new Error(`the candidate "${candidate.trim()}" is not a labelled rule`);
    }
    candidates.push({
      label: `R${match[1]}`,
      kind: classify(match[2], letters)
    });
  }
  const newCase = {
    first: { letter: target[1], value: target[2] },
    second: { letter: target[3], value: target[4] }
  };
  if (newCase.first.letter !== letters[0] || newCase.second.letter !== letters[1]) {
    throw new Error('the new case does not use the conditions of the examples');
  }
  return { letters, meanings, examples, candidates, newCase };
}

function solve(slots) {
  const surviving = slots.candidates.filter((candidate) =>
    slots.examples.every(
      (example) => applies(candidate.kind, example.values) === example.result
    )
  );
  if (surviving.length === 0) {
    throw new Error('no candidate rule reproduces the given examples');
  }
  if (surviving.length > 1) {
    const ambiguity = new Error(`the given examples leave ${surviving.length} candidate rules`);
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  const kind = surviving[0].kind;
  const result = applies(kind, [slots.newCase.first.value === 'YES', slots.newCase.second.value === 'YES']);
  return { kind, result, letters: slots.letters, newCase: slots.newCase };
}

/**
 * The printed name of each surviving rule. The conjunction is the only one the
 * source prints with the leading article, so the phrase table keeps that
 * wording per rule instead of deriving it from the candidate row.
 */
const RULE_PHRASES = Object.freeze({
  and: (letters) => `The rule is ${letters[0]} AND ${letters[1]}`,
  or: (letters) => `Rule is ${letters[0]} or ${letters[1]} (at least one)`,
  xor: (letters) => `Rule is exactly one of ${letters[0]} and ${letters[1]}`,
  nor: (letters) => `Rule is neither ${letters[0]} nor ${letters[1]}`
});

function render(solution) {
  const { newCase } = solution;
  return `${RULE_PHRASES[solution.kind](solution.letters)}; for ${newCase.first.letter}=${newCase.first.value}, ${newCase.second.letter}=${newCase.second.value} the result is ${solution.result ? 'YES' : 'NO'}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.letters) && slots.letters.length === 2, "the statement must name exactly two conditions");',
  'probe(Array.isArray(slots.meanings) && slots.meanings.length === 2 && slots.meanings.every((meaning) => typeof meaning.meaning === "string" && meaning.meaning.length > 0), "the statement must say what each condition means");',
  'probe(Array.isArray(slots.examples) && slots.examples.length > 0, "the statement must show at least one example");',
  'for (const example of slots.examples) {',
  '  probe(Array.isArray(example.values) && example.values.length === 2, "every example must give both input values");',
  '  probe(typeof example.result === "boolean", "every example must give its output");',
  '}',
  'probe(Array.isArray(slots.candidates) && slots.candidates.length > 1, "the statement must offer several candidate rules");',
  'const kinds = ["and", "or", "xor", "nor"];',
  'for (const candidate of slots.candidates) {',
  '  probe(kinds.indexOf(candidate.kind) !== -1, "every candidate must be one of the four stated logical rules");',
  '}',
  'const applies = (kind, values) => {',
  '  if (kind === "and") { return values[0] && values[1]; }',
  '  if (kind === "or") { return values[0] || values[1]; }',
  '  if (kind === "xor") { return values[0] !== values[1]; }',
  '  return !values[0] && !values[1];',
  '};',
  'const surviving = slots.candidates.filter((candidate) => slots.examples.every((example) => applies(candidate.kind, example.values) === example.result));',
  'probe(surviving.length > 0, "at least one candidate rule must reproduce the examples");',
  'probe(surviving.length === 1, "the examples must leave exactly one candidate rule, not " + surviving.length);',
  'const kind = surviving[0].kind;',
  'const first = slots.newCase.first;',
  'const second = slots.newCase.second;',
  'const result = applies(kind, [first.value === "YES", second.value === "YES"]);',
  'const prefixes = {',
  '  and: "The rule is " + slots.letters[0] + " AND " + slots.letters[1],',
  '  or: "Rule is " + slots.letters[0] + " or " + slots.letters[1] + " (at least one)",',
  '  xor: "Rule is exactly one of " + slots.letters[0] + " and " + slots.letters[1],',
  '  nor: "Rule is neither " + slots.letters[0] + " nor " + slots.letters[1]',
  '};',
  'return prefixes[kind] + "; for " + first.letter + "=" + first.value + ", " + second.letter + "=" + second.value + " the result is " + (result ? "YES" : "NO") + ".";'
].join('\n');

function explain(slots, solution) {
  const words = {
    and: `both ${slots.letters[0]} and ${slots.letters[1]} must be YES`,
    or: `at least one of ${slots.letters[0]} and ${slots.letters[1]} must be YES`,
    xor: `exactly one of ${slots.letters[0]} and ${slots.letters[1]} must be YES`,
    nor: `neither ${slots.letters[0]} nor ${slots.letters[1]} may be YES`
  };
  return [
    `The statement names ${slots.letters[0]} as "${slots.meanings[0].meaning}" and ${slots.letters[1]} as "${slots.meanings[1].meaning}", and shows ${slots.examples.length} input/output rows of the unknown rule.`,
    `Each candidate rule is turned into a prediction for those rows, and a candidate is eliminated as soon as one prediction disagrees with the observed output.`,
    `The only candidate that reproduces all ${slots.examples.length} rows is the one that says ${words[solution.kind]}.`,
    `Applying that rule to the new case ${slots.newCase.first.letter}=${slots.newCase.first.value}, ${slots.newCase.second.letter}=${slots.newCase.second.value} gives the result ${solution.result ? 'YES' : 'NO'}, and the rule was chosen because it fits every example at once, not because its wording sounds related to the world of the problem.`
  ];
}

export const unit = 33;

export const cases = [
  {
    template: 'Discovering a rule from examples',
    type: slugify('Discovering a rule from examples'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
