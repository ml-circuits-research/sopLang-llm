/**
 * Form 22 of the scientific-reasoning book: quantifiers all, some, none.
 *
 * Every part-two variant states a knowledge block, then a `Problem data.`
 * block that lists five named cases with the properties each one carries, and
 * asks for the truth value of four quantified statements over those cases:
 * a universal statement ("all P cases are Q"), an existential one ("some P
 * case is Q"), a negative one ("no P case is Q"), and an existential one with
 * a lack ("some P case is not Q"). The printed answer is the four verdicts in
 * order, so the family computes each verdict from the observations instead of
 * echoing a fixed line.
 *
 * The variants differ in the world (pollination, seed dispersal, decomposition,
 * soil, teeth, light, electricity) and therefore in the property names; the
 * quantified shape is the same in all twenty-five. One variant prints the
 * negative statement as "no case with the property Q has the property R" and
 * inserts "does not have the property" in the others; the printed steps show
 * that both spellings ask whether the two properties overlap at all, so the
 * negative verdict is computed as "no case carries both properties".
 */

import { slugify } from '../../naming.mjs';

const QUOTED = /[“"]([^“”"]+)[”"]/g;
const ENTRY_SEPARATOR = '; ';
const STATEMENT_SEPARATOR = ' / ';

function quotedNames(text) {
  return [...text.matchAll(QUOTED)].map((match) => match[1]);
}

function parse(statement) {
  const data = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  const question = /Question\.\s*([\s\S]*)$/.exec(statement);
  if (data === null || question === null) {
    throw new Error('the statement does not state its observations and its questions');
  }
  const observations = /cases are:\s*([\s\S]*)$/.exec(data[1]);
  if (observations === null) {
    throw new Error('the data block does not introduce the observed cases');
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
    const properties = entry
      .slice(cut + 2)
      .split(', ')
      .map((property) => property.trim())
      .filter((property) => property !== '');
    if (properties.length === 0) {
      throw new Error(`the case "${entry}" states an empty property list`);
    }
    cases.push({ label: entry.slice(0, cut).trim(), properties });
  }
  if (cases.length === 0) {
    throw new Error('the data block lists no case');
  }
  const statements = [];
  for (const piece of question[1].split(STATEMENT_SEPARATOR)) {
    const quantifier = /\b(all|some|no) cases? with the property\b/.exec(piece);
    if (quantifier === null) {
      continue;
    }
    const properties = quotedNames(piece);
    if (properties.length !== 2) {
      throw new Error(`the statement "${piece.trim()}" does not name exactly two properties`);
    }
    statements.push({ quantifier: quantifier[1], negative: /do not have the property/.test(piece), properties });
  }
  if (statements.length === 0) {
    throw new Error('the question states no quantified statement');
  }
  return { cases, statements };
}

function solve(slots) {
  const holds = (entry, property) => entry.properties.includes(property);
  const verdicts = slots.statements.map((statement) => {
    const [subject, predicate] = statement.properties;
    if (statement.quantifier === 'all') {
      const holders = slots.cases.filter((entry) => holds(entry, subject));
      return holders.every((entry) => holds(entry, predicate) === !statement.negative);
    }
    if (statement.quantifier === 'some') {
      const holders = slots.cases.filter((entry) => holds(entry, subject));
      return holders.some((entry) => holds(entry, predicate) === !statement.negative);
    }
    return !slots.cases.some((entry) => holds(entry, subject) && holds(entry, predicate));
  });
  if (verdicts.length === 0) {
    throw new Error('the question states no quantified statement to decide');
  }
  return { verdicts };
}

function render(solution) {
  const verdicts = solution.verdicts.map((verdict) => (verdict ? 'true' : 'false'));
  return `In order: ${verdicts.join(', ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.cases) && slots.cases.length > 0, "the data block must list at least one case");',
  'probe(Array.isArray(slots.statements) && slots.statements.length > 0, "the question must state at least one quantified statement");',
  'const holds = (entry, property) => entry.properties.indexOf(property) !== -1;',
  'for (const entry of slots.cases) {',
  '  probe(typeof entry.label === "string" && entry.label.length > 0, "every case must carry a label");',
  '  probe(Array.isArray(entry.properties) && entry.properties.length > 0, "every case must carry at least one property: " + entry.label);',
  '}',
  'for (const statement of slots.statements) {',
  '  probe(statement.properties.length === 2, "every quantified statement must name two properties");',
  '  probe(["all", "some", "no"].indexOf(statement.quantifier) !== -1, "a quantifier must be all, some, or no: " + statement.quantifier);',
  '  probe(statement.properties.every((property) => slots.cases.some((entry) => holds(entry, property))), "every named property must appear in the observations");',
  '}',
  'const verdicts = slots.statements.map((statement) => {',
  '  const subject = statement.properties[0];',
  '  const predicate = statement.properties[1];',
  '  if (statement.quantifier === "all") {',
  '    const holders = slots.cases.filter((entry) => holds(entry, subject));',
  '    return holders.every((entry) => holds(entry, predicate) === !statement.negative);',
  '  }',
  '  if (statement.quantifier === "some") {',
  '    const holders = slots.cases.filter((entry) => holds(entry, subject));',
  '    return holders.some((entry) => holds(entry, predicate) === !statement.negative);',
  '  }',
  '  return !slots.cases.some((entry) => holds(entry, subject) && holds(entry, predicate));',
  '});',
  'probe(verdicts.length === slots.statements.length, "every statement must receive a truth value");',
  'probe(verdicts.every((verdict) => typeof verdict === "boolean"), "every verdict must be true or false");',
  'return "In order: " + verdicts.map((verdict) => (verdict ? "true" : "false")).join(", ") + ".";'
].join('\n');

function explain(slots, solution) {
  const holds = (entry, property) => entry.properties.includes(property);
  const verdict = (value) => (value ? 'true' : 'false');
  const [universal, existential, negative, lacking] = slots.statements;
  const lines = [
    `Every property becomes a category of cases, so the four statements reduce to questions about membership lists: all ${universal.properties[0]} cases in the ${universal.properties[1]} category, some case in both, no case in both ${negative.properties[0]} and ${negative.properties[1]}, and some ${lacking.properties[0]} case outside ${lacking.properties[1]}.`
  ];
  const counterexample = slots.cases.find((entry) => holds(entry, universal.properties[0]) && !holds(entry, universal.properties[1]));
  lines.push(
    counterexample === undefined
      ? `Statement 1 is ${verdict(solution.verdicts[0])}: no counterexample carries ${universal.properties[0]} without ${universal.properties[1]}.`
      : `Statement 1 is ${verdict(solution.verdicts[0])}: ${counterexample.label} carries ${universal.properties[0]} without ${universal.properties[1]}.`
  );
  const witness = slots.cases.find((entry) => holds(entry, existential.properties[0]) && holds(entry, existential.properties[1]));
  lines.push(
    witness === undefined
      ? `Statement 2 is ${verdict(solution.verdicts[1])}: no case carries both properties.`
      : `Statement 2 is ${verdict(solution.verdicts[1])}: ${witness.label} carries both properties.`
  );
  const overlap = slots.cases.find((entry) => holds(entry, negative.properties[0]) && holds(entry, negative.properties[1]));
  const outside = slots.cases.find((entry) => holds(entry, lacking.properties[0]) && !holds(entry, lacking.properties[1]));
  lines.push(
    `Statement 3 is ${verdict(solution.verdicts[2])}${overlap === undefined ? ': the two categories share no case' : `: ${overlap.label} is in both categories`}, and statement 4 is ${verdict(solution.verdicts[3])}${outside === undefined ? ': no case lacks the second property' : `: ${outside.label} is a witness`}.`
  );
  return lines;
}

export const unit = 22;

export const cases = [
  {
    template: 'Quantifiers: all, some, none',
    type: slugify('Quantifiers: all, some, none'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
