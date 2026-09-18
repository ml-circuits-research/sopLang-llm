/**
 * Form 21 of the scientific-reasoning book: necessary and sufficient
 * conditions. It opens part two of the book, so its statements use the
 * `Given knowledge.` / `Problem data.` labels.
 *
 * Every variant states one target result that occurs exactly when a named set
 * of three conditions holds simultaneously, then exhibits three cases: P has
 * only the analyzed condition true, Q has only the analyzed condition false,
 * and R has all three true. Q shows that the condition is necessary (without
 * it, the complete set is not satisfied and the result does not occur), P shows
 * that it is not sufficient alone (the result still does not occur), and R
 * shows that the whole set is sufficient in the model.
 *
 * The variants change the world (pollination, seed dispersal, decomposition,
 * soil, bones and muscles, gears, density, mirrors, energy, ...) and with it
 * the result, the three conditions, and which of them the question examines;
 * the reasoning stays the same, so one family covers all twenty-five of them.
 * The analyzed condition is the one the two cases vary, and the source prints
 * the shorter clause for the first condition and the longer one otherwise.
 */

import { slugify } from '../../naming.mjs';

const CONDITIONS_PATTERN = /three conditions are met simultaneously:\s*([\s\S]*?)\.\s*Case P has/;
const ONLY_PATTERN = /Case P has only ([A-Z])=YES and the other two conditions NO/;
const MISSING_PATTERN = /Case Q has ([A-Z])=NO and the other two YES/;
const ALL_PATTERN = /Case R has ([A-Z]=(?:[A-Z]=)*YES)/;
const ANALYZE_PATTERN = /Analyze the condition ([A-Z])=/;
const GUARANTEE_PATTERN = /if ([A-Z]) is true, the result is guaranteed/;
const IMPOSSIBLE_PATTERN = /without ([A-Z]), the result is impossible/;

/** The clause the source prints after "necessary, but": shorter for the first condition. */
const SUFFICIENCY_CLAUSE = new Map([
  ['A', 'not sufficient on its own']
]);
const DEFAULT_CLAUSE = 'is not alone sufficient';

function parse(statement) {
  const problemData = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  if (problemData === null) {
    throw new Error('the statement does not state its problem data');
  }
  const question = /Question\.\s*([\s\S]*)$/.exec(statement);
  if (question === null) {
    throw new Error('the statement does not state its question');
  }
  const result = /The target result is “([\s\S]*?)”\./.exec(problemData[1]);
  const conditionsText = CONDITIONS_PATTERN.exec(problemData[1]);
  const only = ONLY_PATTERN.exec(problemData[1]);
  const missing = MISSING_PATTERN.exec(problemData[1]);
  const all = ALL_PATTERN.exec(problemData[1]);
  if (result === null || conditionsText === null || only === null || missing === null || all === null) {
    throw new Error('the problem data does not state the result, the three conditions, and cases P, Q, R');
  }
  const conditions = conditionsText[1].split(';').map((entry) => {
    const match = /^\s*([A-Z])\s*=\s*([\s\S]+?)\s*$/.exec(entry);
    if (match === null) {
      throw new Error(`the problem data states a condition without a name: "${entry.trim()}"`);
    }
    return { letter: match[1], text: match[2] };
  });
  const analyzed =
    ANALYZE_PATTERN.exec(question[1])?.[1] ??
    GUARANTEE_PATTERN.exec(question[1])?.[1] ??
    IMPOSSIBLE_PATTERN.exec(question[1])?.[1];
  if (analyzed === undefined) {
    throw new Error('the question does not say which condition to analyze');
  }
  const guaranteed = GUARANTEE_PATTERN.exec(question[1])?.[1];
  const impossible = IMPOSSIBLE_PATTERN.exec(question[1])?.[1];
  if (guaranteed !== undefined && guaranteed !== analyzed) {
    throw new Error('the question analyzes two different conditions');
  }
  if (impossible !== undefined && impossible !== analyzed) {
    throw new Error('the question analyzes two different conditions');
  }
  return {
    result: result[1].trim(),
    conditions,
    letters: all[1].split('=').slice(0, -1),
    yesAlone: only[1],
    noAlone: missing[1],
    analyzed
  };
}

function solve(slots) {
  if (!Array.isArray(slots.conditions) || slots.conditions.length !== 3) {
    throw new Error('the model states exactly three simultaneous conditions');
  }
  const letters = slots.conditions.map((entry) => entry.letter).join('');
  if (letters !== slots.letters.join('')) {
    throw new Error('case R does not state the same conditions as the rule');
  }
  if (!letters.includes(slots.analyzed)) {
    throw new Error('the analyzed condition is not part of the stated set');
  }
  if (slots.noAlone !== slots.analyzed) {
    throw new Error('case Q must turn off the analyzed condition and leave the others on');
  }
  if (slots.yesAlone !== slots.analyzed) {
    throw new Error('case P must turn on the analyzed condition and leave the others off');
  }
  return {
    letter: slots.analyzed,
    clause: SUFFICIENCY_CLAUSE.get(slots.analyzed) ?? DEFAULT_CLAUSE,
    letters: slots.letters
  };
}

function render(solution) {
  return `${solution.letter} is necessary, but ${solution.clause}. The set ${solution.letters.join('\u2227')} is sufficient in the model.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.result === "string" && slots.result.length > 0, "the model must state the target result");',
  'probe(Array.isArray(slots.conditions) && slots.conditions.length === 3, "the model must state exactly three simultaneous conditions");',
  'probe(slots.conditions.every((entry) => typeof entry.letter === "string" && entry.letter.length === 1 && typeof entry.text === "string" && entry.text.length > 0), "every condition must carry a name and its text");',
  'const letters = slots.conditions.map((entry) => entry.letter).join("");',
  'probe(letters === slots.letters.join(""), "case R must confirm the same three conditions");',
  'probe(letters.includes(slots.analyzed), "the analyzed condition must belong to the stated set");',
  'probe(slots.noAlone === slots.analyzed, "case Q must be the case where the analyzed condition is off");',
  'probe(slots.yesAlone === slots.analyzed, "case P must be the case where only the analyzed condition is on");',
  'probe(new Set(letters).size === letters.length, "the three conditions must be distinct");',
  'const clause = slots.analyzed === "A" ? "not sufficient on its own" : "is not alone sufficient";',
  'return slots.analyzed + " is necessary, but " + clause + ". The set " + slots.letters.join("\\u2227") + " is sufficient in the model.";'
].join('\n');

function explain(slots, solution) {
  const text = (letter) => slots.conditions.find((entry) => entry.letter === letter)?.text ?? '';
  return [
    `Case Q turns off the analyzed condition ${slots.analyzed} (“${text(slots.analyzed)}”) and keeps the other two on; the complete set is then not satisfied, so the target result “${slots.result}” does not occur, which is what necessary means.`,
    `Case P does the opposite: ${slots.analyzed} is on while the other two are off, and the result still does not occur, so ${slots.analyzed} alone is not sufficient.`,
    `Case R has all three conditions on, and the rule states that the set ${solution.letters.join('\u2227')} is sufficient in this model; no single member of the set guarantees the result.`,
    'Necessary means the result cannot occur without the condition; sufficient means the stated condition or set of conditions guarantees it, and here only the whole set is sufficient.'
  ];
}

export const unit = 21;

export const cases = [
  {
    template: 'Necessary and sufficient conditions',
    type: slugify('Necessary and sufficient conditions'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
