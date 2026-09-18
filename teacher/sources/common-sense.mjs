/**
 * Parser for the seed book `vision/Common_Sense_for_Adults_1000_Problems.docx`.
 *
 * The manual is organized as ten chapters, ten sections per chapter, and ten
 * worked problems per section. Every problem is self-contained:
 *
 *   Problem C.S.P — <reasoning pattern>
 *   <statement sentences>
 *   Question. <what to compute>
 *   Answer. <the printed result>
 *   Step-by-step logical solution
 *   1. … 2. … 3. …
 *
 * The title after the dash names the reasoning pattern, and the twenty
 * patterns of the book repeat across the hundred sections with different data,
 * so the printed template of a problem is its title and a template carries
 * fifty variants. The parser keeps the statement, the question, the printed
 * answer, and the worked steps apart: the statement and the question are the
 * solver-visible projection and the rest is reference material.
 */

import { slugify } from '../naming.mjs';

const CHAPTER_PATTERN = /^Chapter (\d{1,2})\.\s+(.+)$/;
const SECTION_PATTERN = /^(\d{1,2})\.(\d{1,2})\.\s+([A-Z].*)$/;
const PROBLEM_PATTERN = /^Problem (\d{1,2})\.(\d{1,2})\.(\d{1,2}) — (.+)$/;
const QUESTION_PATTERN = /^Question\.\s*([\s\S]*)$/;
const ANSWER_PATTERN = /^Answer\.\s*([\s\S]*)$/;
const SOLUTION_HEADING = /^Step-by-step logical solution\s*$/;
const STEP_PATTERN = /^\d{1,2}\.\s+(.+)$/;

export const BOOK_ID = 'common-sense';
export const BOOK_PATH = 'vision/Common_Sense_for_Adults_1000_Problems.docx';

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
    id: 'missing-statement',
    description: 'The problem has no statement, so no solver-visible text exists.',
    test: (problem) => problem.statement === ''
  }
]);

export function parseCommonSense(paragraphs) {
  const problems = [];
  const chapters = new Map();
  const sections = new Map();
  let current = null;
  let chapter = null;
  let section = null;
  let inSteps = false;

  const finish = () => {
    if (current !== null) {
      const body = current.statementParts.join(' ').trim();
      current.statement = current.question === '' ? body : `${body}\n\nQuestion. ${current.question}`;
      current.question = current.question.trim();
      current.printedAnswer = current.printedAnswer.trim();
      current.steps = current.steps.map((step) => step.trim()).filter((step) => step !== '');
      delete current.statementParts;
      problems.push(current);
      current = null;
    }
    inSteps = false;
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
        chapterTitle: chapter?.title ?? '',
        sectionTitle: section?.title ?? '',
        statementParts: [],
        question: '',
        printedAnswer: '',
        steps: [],
        firstParagraph: paragraph.index,
        lastParagraph: paragraph.index
      };
      continue;
    }

    const chapterMatch = text.match(CHAPTER_PATTERN);
    if (chapterMatch !== null) {
      finish();
      chapter = { number: Number(chapterMatch[1]), title: chapterMatch[2].trim() };
      chapters.set(chapter.number, chapter);
      section = null;
      continue;
    }

    const sectionMatch = text.match(SECTION_PATTERN);
    if (sectionMatch !== null && sectionMatch[3] === sectionMatch[3].trim()) {
      finish();
      section = { chapter: Number(sectionMatch[1]), number: Number(sectionMatch[2]), title: sectionMatch[3].trim() };
      sections.set(`${section.chapter}.${section.number}`, section);
      continue;
    }

    if (current === null) {
      continue;
    }

    current.lastParagraph = paragraph.index;
    const questionMatch = text.match(QUESTION_PATTERN);
    if (questionMatch !== null) {
      current.question = questionMatch[1];
      continue;
    }
    const answerMatch = text.match(ANSWER_PATTERN);
    if (answerMatch !== null) {
      current.printedAnswer = answerMatch[1];
      continue;
    }
    if (SOLUTION_HEADING.test(text)) {
      inSteps = true;
      continue;
    }
    if (inSteps) {
      const stepMatch = text.match(STEP_PATTERN);
      if (stepMatch !== null) {
        current.steps.push(stepMatch[1]);
      }
      continue;
    }
    current.statementParts.push(text);
  }
  finish();

  const ordinals = new Map();
  for (const problem of problems) {
    if (!ordinals.has(problem.title)) {
      ordinals.set(problem.title, ordinals.size + 1);
    }
    problem.templateKey = problem.title;
    problem.templateOrdinal = ordinals.get(problem.title);
    problem.type = slugify(problem.title);
    problem.folder = `${problem.id}-${slugify(problem.title)}`;
    problem.order = problem.chapter * 10000 + problem.section * 100 + problem.number;
    problem.paragraphSpan = { from: problem.firstParagraph, to: problem.lastParagraph };
    delete problem.firstParagraph;
    delete problem.lastParagraph;
  }

  return { chapters: [...chapters.values()], sections: [...sections.values()], problems };
}
