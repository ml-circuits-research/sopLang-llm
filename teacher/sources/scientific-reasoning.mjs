/**
 * Parser for the seed book `vision/1000_Scientific_Reasoning_Problems_Grades_1-4_EN.docx`.
 *
 * The collection has two parts and both state their own vocabulary:
 *
 *   Part I  (problems 1-500)    Problem N. <reasoning type>
 *                               Domain: X • Grade G • Reasoning type: F
 *                               Problem world. …   Case data. …   Question. …
 *                               Step-by-step solution / Step N. …   Answer. …
 *                               Scientific idea reinforced. …
 *
 *   Part II (problems 501-1000) Problem N. <new reasoning type>
 *                               Domains: X • Grade G • New reasoning type: F
 *                               Given knowledge. …   Problem data. …   Question. …
 *                               Step-by-step solution / Step N. …   Answer. …
 *
 * The reasoning form is the printed template: it appears once per world (about
 * twenty times in the book), and the same form is applied to a different
 * domain in every variant. The stated premise blocks and the question form the
 * solver-visible projection; the worked steps, the answer, and the closing
 * scientific idea are reference material.
 */

import { slugify } from '../naming.mjs';

const PROBLEM_PATTERN = /^Problem (\d{1,4})\.\s+(.+)$/;
const STEP_HEADING = /^Step-by-step solution\.?\s*$/;
const BLOCK_PATTERN =
  /^(Domain|Domains|Problem world|Given knowledge|Case data|Problem data|Question|Answer|Scientific idea reinforced)\.\s*([\s\S]*)$/;
const STEP_PATTERN = /^Step (\d{1,2})\.\s*([\s\S]*)$/;
const FORM_PATTERN = /(?:New )?[Rr]easoning type:\s*(.+)$/;

export const BOOK_ID = 'scientific-reasoning';
export const BOOK_PATH = 'vision/1000_Scientific_Reasoning_Problems_Grades_1-4_EN.docx';

/**
 * Print-level quirks of this source that the pipeline quarantines instead of
 * silently repairing. Each rule names the defect and the action.
 */
export const BOOK_QUARANTINE_RULES = Object.freeze([
  {
    id: 'missing-answer',
    description: 'The problem has no printed answer, so no label can be inherited.',
    test: (problem) => problem.printedAnswer === ''
  },
  {
    id: 'missing-question',
    description: 'The problem has no Question block, so the task is unknown.',
    test: (problem) => problem.question === ''
  },
  {
    id: 'missing-premise',
    description: 'The problem states neither its world nor its case data, so no solver-visible text exists.',
    test: (problem) => problem.world === '' || problem.caseData === ''
  },
  {
    id: 'missing-reasoning-form',
    description: 'The problem does not name its reasoning form, so its template is unknown.',
    test: (problem) => problem.reasoningForm === ''
  }
]);

export function parseScientificReasoning(paragraphs) {
  const problems = [];
  let current = null;
  let block = null;

  const finish = () => {
    if (current !== null) {
      current.world = current.world.trim();
      current.caseData = current.caseData.trim();
      current.question = current.question.trim();
      current.printedAnswer = current.printedAnswer.trim();
      current.reinforced = current.reinforced.trim();
      current.steps = current.steps
        .flatMap((entry) => entry.split('\n'))
        .map((line) => line.trim())
        .filter((line) => line !== '')
        .map((line) => {
          const match = line.match(STEP_PATTERN);
          return match === null ? line : match[2].trim();
        });
      current.statement = [
        `${current.worldLabel}. ${current.world}`,
        `${current.caseLabel}. ${current.caseData}`,
        `Question. ${current.question}`
      ].join('\n\n');
      delete current.worldLabel;
      delete current.caseLabel;
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
        id: String(Number(problemMatch[1])),
        number: Number(problemMatch[1]),
        title: problemMatch[2].trim(),
        domain: '',
        grade: 0,
        reasoningForm: '',
        worldLabel: 'Problem world',
        caseLabel: 'Case data',
        world: '',
        caseData: '',
        question: '',
        printedAnswer: '',
        reinforced: '',
        steps: [],
        firstParagraph: paragraph.index,
        lastParagraph: paragraph.index
      };
      continue;
    }

    if (current === null) {
      continue;
    }

    current.lastParagraph = paragraph.index;
    const domainMatch = /^Domains?:\s*(.*?)\s*•\s*Grade (\d)\s*•\s*(?:New )?[Rr]easoning type:\s*(.+)$/.exec(text);
    if (domainMatch !== null) {
      current.domain = domainMatch[1].trim();
      current.grade = Number(domainMatch[2]);
      current.reasoningForm = domainMatch[3].trim();
      continue;
    }

    if (STEP_HEADING.test(text)) {
      block = 'Step-by-step solution';
      continue;
    }

    const blockMatch = text.match(BLOCK_PATTERN);
    if (blockMatch !== null) {
      block = blockMatch[1];
      if (block === 'Given knowledge') {
        current.worldLabel = 'Given knowledge';
        current.caseLabel = 'Problem data';
      }
      if (block === 'Problem world' || block === 'Given knowledge') {
        current.world = blockMatch[2].trim();
        continue;
      }
      if (block === 'Case data' || block === 'Problem data') {
        current.caseData = blockMatch[2].trim();
        continue;
      }
      if (block === 'Question') {
        current.question = blockMatch[2].trim();
        continue;
      }
      if (block === 'Answer') {
        current.printedAnswer = blockMatch[2].trim();
        continue;
      }
      if (block === 'Scientific idea reinforced') {
        current.reinforced = blockMatch[2].trim();
        continue;
      }
      continue;
    }

    if (block === 'Step-by-step solution') {
      current.steps.push(text);
      continue;
    }
    if (block === 'Question') {
      current.question = `${current.question} ${text}`.trim();
      continue;
    }
    if (block === 'Answer') {
      current.printedAnswer = `${current.printedAnswer} ${text}`.trim();
      continue;
    }
  }
  finish();

  const ordinals = new Map();
  for (const problem of problems) {
    if (!ordinals.has(problem.reasoningForm)) {
      ordinals.set(problem.reasoningForm, ordinals.size + 1);
    }
    problem.templateKey = problem.reasoningForm;
    problem.formOrdinal = ordinals.get(problem.reasoningForm);
    problem.type = slugify(problem.reasoningForm);
    problem.folder = `${problem.id}-${slugify(problem.title)}`;
    problem.order = problem.number;
    problem.paragraphSpan = { from: problem.firstParagraph, to: problem.lastParagraph };
    delete problem.firstParagraph;
    delete problem.lastParagraph;
  }

  return { problems };
}
