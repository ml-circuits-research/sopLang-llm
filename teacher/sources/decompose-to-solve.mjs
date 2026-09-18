/**
 * Parser for the seed book `vision/Decompose_to_Solve_1000_Problems.docx`.
 *
 * Every problem prints one scenario, the main question, the decomposition the
 * book considers best, and the result of applying it:
 *
 *   Problem C.S.P — <decomposition pattern>
 *   Scenario. …
 *   Main question. …
 *   Best decomposition (N subproblems).  or  Best formulation (1 indivisible core).
 *   SP<k> — <subproblem>. Minimal inputs: … Input relevance: …
 *   Combined answer. …
 *   Decomposition lesson. …
 *   General-culture link. …
 *
 * The title names the decomposition pattern, and the ten patterns of the book
 * repeat across a hundred variants, so the pattern is the printed template. Two
 * patterns are the deliberate false-decomposition cases: their single atomic
 * core is the answer. The scenario and the main question form the
 * solver-visible projection; the subproblem list, the combined answer, the
 * lesson, and the general-culture link are reference material.
 */

import { slugify } from '../naming.mjs';

const PROBLEM_PATTERN = /^Problem (\d{1,2})\.(\d{1,2})\.(\d{1,2}) — (.+)$/;
const BLOCK_PATTERN =
  /^(Scenario|Main question|Best decomposition|Best formulation|Combined answer|Decomposition lesson|General-culture link)\.\s*([\s\S]*)$/;
const SUBPROBLEM_PATTERN = /^(SP\d+ — .*|Atomic core — .*)$/;

export const BOOK_ID = 'decompose-to-solve';
export const BOOK_PATH = 'vision/Decompose_to_Solve_1000_Problems.docx';

/**
 * Print-level quirks of this source that the pipeline quarantines instead of
 * silently repairing. Each rule names the defect and the action.
 */
export const BOOK_QUARANTINE_RULES = Object.freeze([
  {
    id: 'missing-answer',
    description: 'The problem has no Combined answer block, so no label can be inherited.',
    test: (problem) => problem.printedAnswer === ''
  },
  {
    id: 'missing-question',
    description: 'The problem has no Main question block, so the task is unknown.',
    test: (problem) => problem.question === ''
  },
  {
    id: 'missing-scenario',
    description: 'The problem has no Scenario block, so no solver-visible text exists.',
    test: (problem) => problem.scenario === ''
  }
]);

export function parseDecomposeToSolve(paragraphs) {
  const problems = [];
  let current = null;
  let block = null;

  const finish = () => {
    if (current !== null) {
      current.scenario = current.scenario.trim();
      current.question = current.question.trim();
      current.printedAnswer = current.printedAnswer.trim();
      current.lesson = current.lesson.trim();
      current.link = current.link.trim();
      current.statement = `Scenario. ${current.scenario}\n\nMain question. ${current.question}`;
      delete current.formulation;
      problems.push(current);
      current = null;
    }
    block = null;
  };

  for (const paragraph of paragraphs) {
    const text = paragraph.text.trim();
    if (text === '') {
      continue;
    }

    const problemMatch = text.match(PROBLEM_PATTERN);
    if (problemMatch !== null) {
      finish();
      current = {
        id: `${Number(problemMatch[1])}.${Number(problemMatch[2])}.${Number(problemMatch[3])}`,
        chapter: Number(problemMatch[1]),
        section: Number(problemMatch[2]),
        number: Number(problemMatch[3]),
        title: problemMatch[4].trim(),
        scenario: '',
        question: '',
        formula: '',
        subproblems: [],
        printedAnswer: '',
        lesson: '',
        link: '',
        firstParagraph: paragraph.index,
        lastParagraph: paragraph.index
      };
      continue;
    }

    if (current === null) {
      continue;
    }

    current.lastParagraph = paragraph.index;
    const blockMatch = text.match(BLOCK_PATTERN);
    if (blockMatch !== null) {
      block = blockMatch[1];
      if (block === 'Scenario') {
        current.scenario = blockMatch[2].trim();
        continue;
      }
      if (block === 'Main question') {
        current.question = blockMatch[2].trim();
        continue;
      }
      if (block === 'Combined answer') {
        current.printedAnswer = blockMatch[2].trim();
        continue;
      }
      if (block === 'Decomposition lesson') {
        current.lesson = blockMatch[2].trim();
        continue;
      }
      if (block === 'General-culture link') {
        current.link = blockMatch[2].trim();
        continue;
      }
      if (block === 'Best decomposition' || block === 'Best formulation') {
        current.formulation = blockMatch[2].trim();
        continue;
      }
    }

    if (SUBPROBLEM_PATTERN.test(text)) {
      current.subproblems.push(text);
      continue;
    }
    if (block === 'Scenario') {
      current.scenario = `${current.scenario} ${text}`.trim();
      continue;
    }
    if (block === 'Main question') {
      current.question = `${current.question} ${text}`.trim();
      continue;
    }
    if (block === 'Combined answer') {
      current.printedAnswer = `${current.printedAnswer} ${text}`.trim();
      continue;
    }
  }
  finish();

  const ordinals = new Map();
  for (const problem of problems) {
    if (!ordinals.has(problem.title)) {
      ordinals.set(problem.title, ordinals.size + 1);
    }
    problem.templateKey = problem.title;
    problem.patternOrdinal = ordinals.get(problem.title);
    problem.type = slugify(problem.title);
    problem.folder = `${problem.id}-${slugify(problem.title)}`;
    problem.order = problem.chapter * 10000 + problem.section * 100 + problem.number;
    problem.paragraphSpan = { from: problem.firstParagraph, to: problem.lastParagraph };
    delete problem.firstParagraph;
    delete problem.lastParagraph;
  }

  return { problems };
}
