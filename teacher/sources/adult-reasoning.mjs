/**
 * Parser for the seed book `vision/Adult_Reasoning_and_Everyday_Knowledge_Course.docx`.
 *
 * The course is ten chapters of ten sections, each section holding ten
 * variants of one everyday-document scenario:
 *
 *   Problem N. <section title> — variant K
 *   STEM
 *   <the closed world: a notice, a bill, a policy, a message>
 *   QUESTION
 *   <what the reader must decide>
 *   ANSWER
 *   <the printed verdict>
 *   LOGICAL EXPLANATION
 *   <the visible skeleton of the reasoning>
 *
 * The section is the printed template: its ten variants change numbers, hours,
 * and names, not the rulebook. The stem and the question form the
 * solver-visible projection; the verdict and the explanation are reference
 * material. The stem frequently spans several paragraphs and keeps the printed
 * quotation marks of the notice, so stem text is joined with the blank line
 * the source prints.
 */

import { slugify } from '../naming.mjs';

const CHAPTER_PATTERN = /^Chapter (\d{1,2})\.\s+(.+?)(?:\s+—\s+problems .*)?$/;
const SECTION_PATTERN = /^(\d{1,2})\.(\d{1,2})\s+([A-Z].+?)(?:\s+\((\d{1,3})[–-](\d{1,3})\))?$/;
const PROBLEM_PATTERN = /^Problem (\d{1,4})\.\s+(.+)$/;
const LABEL_PATTERN = /^(STEM|QUESTION|ANSWER|LOGICAL EXPLANATION)\s*$/;

export const BOOK_ID = 'adult-reasoning';
export const BOOK_PATH = 'vision/Adult_Reasoning_and_Everyday_Knowledge_Course.docx';

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

export function parseAdultReasoning(paragraphs) {
  const problems = [];
  const chapters = new Map();
  const sections = new Map();
  let chapter = null;
  let section = null;
  let current = null;
  let label = null;

  const finish = () => {
    if (current !== null) {
      current.stem = current.stem.trim();
      current.question = current.question.trim();
      current.printedAnswer = current.printedAnswer.trim();
      current.explanation = current.explanation.trim();
      current.statement = `${current.stem}\n\nQuestion. ${current.question}`;
      delete current.stemParts;
      delete current.questionParts;
      delete current.answerParts;
      delete current.explanationParts;
      problems.push(current);
      current = null;
    }
    label = null;
  };

  const append = (text, key) => {
    if (current[key] === '') {
      current[key] = text;
    } else {
      current[key] = `${current[key]}\n\n${text}`;
    }
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
        explanation: '',
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
    if (sectionMatch !== null) {
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
      append(text, 'stem');
      continue;
    }
    if (label === 'QUESTION') {
      append(text, 'question');
      continue;
    }
    if (label === 'ANSWER') {
      append(text, 'printedAnswer');
      continue;
    }
    if (label === 'LOGICAL EXPLANATION') {
      append(text, 'explanation');
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
