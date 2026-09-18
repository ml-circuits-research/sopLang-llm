/**
 * Form 23 of the scientific-reasoning book: sets, intersections, differences.
 *
 * Every part-two variant states a knowledge block, then a `Problem data.`
 * block that lists five named cases with the properties each one carries,
 * declares three of those properties as the set labels A, B and C, and asks
 * for two or three set expressions built from them. The printed answer lists
 * each requested expression with its members, in the order the cases appear in
 * the data block, and prints the empty set as ∅.
 *
 * The variants differ in the world (pollination, dispersal, decomposition,
 * teeth, gears, light, water treatment) and in which expressions the question
 * requests — `A∩B, A∩C and C\A`, `B∩C, A\B and A∪C`, `A∩B∩C, B\C and A∪B` —
 * so the family reads the requested expressions from the question instead of
 * assuming one pattern. The first case of a block starts a sentence and is
 * capitalized in the source, while the printed answer names it in lower case,
 * so the parse restores the lower case the answer uses.
 */

import { slugify } from '../../naming.mjs';

const QUOTED = /[“"]([^“”"]+)[”"]/g;
const ENTRY_SEPARATOR = '; ';
const INTERSECTION = String.fromCharCode(8745);
const UNION = String.fromCharCode(8746);
const DIFFERENCE = String.fromCharCode(92);
const EMPTY = String.fromCharCode(8709);
const OPERATORS = [INTERSECTION, UNION, DIFFERENCE];

function parse(statement) {
  const data = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  const question = /Question\.\s*([\s\S]*)$/.exec(statement);
  if (data === null || question === null) {
    throw new Error('the statement does not state its observations and its set question');
  }
  const observations = /set labels\.\s*([\s\S]*)$/.exec(data[1]);
  if (observations === null) {
    throw new Error('the data block does not declare the properties as set labels');
  }
  const cases = [];
  for (const piece of observations[1].split(ENTRY_SEPARATOR)) {
    const entry = piece.trim().replace(/\.$/, '');
    if (entry === '') {
      continue;
    }
    const cut = entry.indexOf(': ');
    if (cut === -1) {
      throw new Error(`the case "${entry}" states no property list`);
    }
    const name = entry.slice(0, cut).trim();
    const properties = entry
      .slice(cut + 2)
      .split(', ')
      .map((property) => property.trim())
      .filter((property) => property !== '');
    if (properties.length === 0) {
      throw new Error(`the case "${entry}" states an empty property list`);
    }
    cases.push({ name: name.charAt(0).toLowerCase() + name.slice(1), properties });
  }
  if (cases.length === 0) {
    throw new Error('the data block lists no case');
  }
  const labels = {};
  for (const match of question[1].matchAll(/([ABC])\s*=\s*[“"]([^“”"]+)[”"]/g)) {
    labels[match[1]] = match[2];
  }
  if (Object.keys(labels).length === 0) {
    throw new Error('the question labels no set');
  }
  const requested = /Calculate\s+([\s\S]+?)\.\s/.exec(`${question[1]} `);
  if (requested === null) {
    throw new Error('the question does not say which set operations to calculate');
  }
  const ops = requested[1]
    .split(/,\s*|\s+and\s+/)
    .map((op) => op.trim())
    .filter((op) => op !== '');
  if (ops.length === 0) {
    throw new Error('the question requests no set operation');
  }
  return { cases, labels, ops };
}

/** One requested expression as its operands and operators, for example A∩B→[A, ∩, B]. */
function tokenize(expression) {
  const parts = [];
  let current = '';
  for (const character of expression) {
    if (OPERATORS.includes(character)) {
      parts.push(current.trim());
      parts.push(character);
      current = '';
    } else {
      current += character;
    }
  }
  parts.push(current.trim());
  return parts;
}

function membersOf(slots, expression) {
  const parts = tokenize(expression);
  if (parts.length < 3 || parts.length % 2 === 0) {
    throw new Error(`the expression "${expression}" is not a chain of set operations`);
  }
  const sets = {};
  for (const letter of parts.filter((part, index) => index % 2 === 0)) {
    if (!(letter in slots.labels)) {
      throw new Error(`the expression "${expression}" names the undeclared set ${letter}`);
    }
    sets[letter] = slots.cases
      .filter((entry) => entry.properties.includes(slots.labels[letter]))
      .map((entry) => entry.name);
  }
  let members = sets[parts[0]].slice();
  for (let index = 1; index < parts.length; index += 2) {
    const other = sets[parts[index + 1]];
    if (parts[index] === INTERSECTION) {
      members = members.filter((name) => other.includes(name));
    } else if (parts[index] === UNION) {
      members = members.concat(other.filter((name) => !members.includes(name)));
    } else {
      members = members.filter((name) => !other.includes(name));
    }
  }
  return members;
}

function solve(slots) {
  return { results: slots.ops.map((op) => ({ op, members: membersOf(slots, op) })) };
}

function render(solution) {
  const body = solution.results
    .map((result) => `${result.op}=${result.members.length === 0 ? EMPTY : `{${result.members.join(', ')}}`}`)
    .join('; ');
  return `${body}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const INTERSECTION = String.fromCharCode(8745);',
  'const UNION = String.fromCharCode(8746);',
  'const DIFFERENCE = String.fromCharCode(92);',
  'const EMPTY = String.fromCharCode(8709);',
  'const OPERATORS = [INTERSECTION, UNION, DIFFERENCE];',
  'probe(Array.isArray(slots.cases) && slots.cases.length > 0, "the data block must list at least one case");',
  'probe(slots.labels !== null && typeof slots.labels === "object", "the question must label the sets");',
  'probe(Array.isArray(slots.ops) && slots.ops.length > 0, "the question must request at least one set operation");',
  'for (const entry of slots.cases) {',
  '  probe(typeof entry.name === "string" && entry.name.length > 0, "every case must carry a name");',
  '  probe(Array.isArray(entry.properties) && entry.properties.length > 0, "every case must carry at least one property: " + entry.name);',
  '}',
  'const sets = {};',
  'for (const letter of Object.keys(slots.labels)) {',
  '  probe(["A", "B", "C"].indexOf(letter) !== -1, "a set label must be A, B, or C: " + letter);',
  '  sets[letter] = slots.cases.filter((entry) => entry.properties.indexOf(slots.labels[letter]) !== -1).map((entry) => entry.name);',
  '  probe(sets[letter].length > 0, "the labelled property must appear in the observations: " + slots.labels[letter]);',
  '}',
  'const results = slots.ops.map((op) => {',
  '  const parts = [];',
  '  let current = "";',
  '  for (const character of op) {',
  '    if (OPERATORS.indexOf(character) !== -1) {',
  '      parts.push(current.trim());',
  '      parts.push(character);',
  '      current = "";',
  '    } else {',
  '      current += character;',
  '    }',
  '  }',
  '  parts.push(current.trim());',
  '  probe(parts.length >= 3 && parts.length % 2 === 1, "a requested operation must chain at least two sets: " + op);',
  '  for (let index = 0; index < parts.length; index += 2) {',
  '    probe(parts[index] in sets, "every operand must be a labelled set: " + op);',
  '  }',
  '  let members = sets[parts[0]].slice();',
  '  for (let index = 1; index < parts.length; index += 2) {',
  '    const other = sets[parts[index + 1]];',
  '    if (parts[index] === INTERSECTION) {',
  '      members = members.filter((name) => other.indexOf(name) !== -1);',
  '    } else if (parts[index] === UNION) {',
  '      members = members.concat(other.filter((name) => members.indexOf(name) === -1));',
  '    } else {',
  '      probe(parts[index] === DIFFERENCE, "an operator must be intersection, union, or difference: " + op);',
  '      members = members.filter((name) => other.indexOf(name) === -1);',
  '    }',
  '  }',
  '  probe(members.length <= slots.cases.length, "an operation must not invent members: " + op);',
  '  return op + "=" + (members.length === 0 ? EMPTY : "{" + members.join(", ") + "}");',
  '});',
  'return results.join("; ") + ".";'
].join('\n');

function explain(slots, solution) {
  const described = solution.results
    .map((result) => (result.members.length === 0 ? `${result.op} keeps nothing` : `${result.op} keeps ${result.members.join(', ')}`))
    .join('; ');
  return [
    `Each labelled property becomes the set of the cases whose observation list carries it, so ${Object.keys(slots.labels).sort().map((letter) => `${letter} is the ${slots.labels[letter]} set`).join(', ')}.`,
    `${described}.`,
    'An intersection keeps the cases present in both operands, a set difference removes the cases of the right operand, and a union keeps the cases of either operand; each result is listed in the order the cases appear in the data block.',
    'The members of the requested expressions are the only cases that satisfy every stated membership test, so the lists above are exactly the sets the question asks for.'
  ];
}

export const unit = 23;

export const cases = [
  {
    template: 'Sets, intersections, and differences',
    type: slugify('Sets, intersections, and differences'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
