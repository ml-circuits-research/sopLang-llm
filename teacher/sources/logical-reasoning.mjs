/**
 * Parser for the seed book `vision/Logical_Reasoning_Types_Course.docx`.
 *
 * Part II of the book is a 10 × 10 × 10 grid: ten chapters, ten sections per
 * chapter, and ten closed cases per section. Every case is printed as
 *
 *   Problem N. <section title> — <world> — case K
 *   STEM
 *   <the only facts the case allows>
 *   QUESTION
 *   <what is asked>
 *   ANSWER
 *   <the printed verdict>
 *   STEP-BY-STEP REASONING
 *   1. … 2. … 3. …
 *
 * The section is the printed template: its ten cases change names, hours, and
 * places, not the method, so the section is the unit of work and each case is
 * one variant. The stem and the question form the solver-visible projection;
 * the answer and the worked reasoning are reference material.
 */

import { slugify } from '../naming.mjs';

const CHAPTER_PATTERN = /^Chapter (\d{1,2})\.\s+(.+)$/;
const SECTION_PATTERN = /^(\d{1,2})\.(\d{1,2})\s+([A-Z].*)$/;
const PROBLEM_PATTERN = /^Problem (\d{1,4})\.\s+(.+)$/;
const LABEL_PATTERN = /^(STEM|QUESTION|ANSWER|STEP-BY-STEP REASONING)\s*$/;
const STEP_PATTERN = /^(\d{1,2})\.\s+([\s\S]*)$/;

export const BOOK_ID = 'logical-reasoning';
export const BOOK_PATH = 'vision/Logical_Reasoning_Types_Course.docx';

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
    description: 'The problem has no question, so the task is unknown.',
    test: (problem) => problem.question === ''
  },
  {
    id: 'missing-stem',
    description: 'The problem has no stem, so no solver-visible text exists.',
    test: (problem) => problem.stem === ''
  },
  {
    id: 'missing-section',
    description: 'The problem appears before any section heading, so its template is unknown.',
    test: (problem) => problem.templateKey === ''
  }
]);

export function parseLogicalReasoning(paragraphs) {
  const problems = [];
  const chapters = new Map();
  const sections = new Map();
  let chapter = null;
  let section = null;
  let current = null;
  let label = null;

  const finish = () => {
    if (current !== null) {
      const parts = [current.stem, current.question];
      current.stem = current.stem.trim();
      current.question = current.question.trim();
      current.printedAnswer = current.printedAnswer.trim();
      current.steps = current.steps
        .flatMap((block) => block.split('\n'))
        .map((line) => line.trim())
        .filter((line) => line !== '')
        .map((line) => {
          const match = line.match(STEP_PATTERN);
          return match === null ? line : match[2].trim();
        });
      current.statement = `${current.stem}\n\nQuestion. ${current.question}`;
      if (parts.some((part) => part === '')) {
        current.statement = parts.filter((part) => part !== '').join('\n\n');
      }
      delete current.stemParts;
      delete current.questionParts;
      delete current.answerParts;
      delete current.stepParts;
      problems.push(current);
      current = null;
    }
    label = null;
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
        chapter: chapter?.number ?? 0,
        chapterTitle: chapter?.title ?? '',
        sectionNumber: section?.number ?? 0,
        sectionTitle: section?.title ?? '',
        stem: '',
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
      section = {
        chapter: Number(sectionMatch[1]),
        number: Number(sectionMatch[2]),
        title: sectionMatch[3].trim()
      };
      sections.set(`${section.chapter}.${section.number}`, section);
      continue;
    }

    if (current === null) {
      continue;
    }

    current.lastParagraph = paragraph.index;
    if (LABEL_PATTERN.test(text)) {
      label = text;
      continue;
    }
    if (label === 'STEM') {
      current.stem = current.stem === '' ? text : `${current.stem} ${text}`;
      continue;
    }
    if (label === 'QUESTION') {
      current.question = current.question === '' ? text : `${current.question} ${text}`;
      continue;
    }
    if (label === 'ANSWER') {
      current.printedAnswer = current.printedAnswer === '' ? text : `${current.printedAnswer} ${text}`;
      continue;
    }
    if (label === 'STEP-BY-STEP REASONING') {
      current.steps.push(text);
      continue;
    }
  }
  finish();

  for (const problem of problems) {
    problem.templateKey = problem.sectionTitle;
    problem.sectionOrdinal = (problem.chapter - 1) * 10 + problem.sectionNumber;
    problem.type = slugify(problem.sectionTitle);
    problem.folder = `${problem.id}-${slugify(problem.title)}`;
    problem.order = problem.number;
    problem.paragraphSpan = { from: problem.firstParagraph, to: problem.lastParagraph };
    delete problem.firstParagraph;
    delete problem.lastParagraph;
  }

  return { chapters: [...chapters.values()], sections: [...sections.values()], problems };
}
