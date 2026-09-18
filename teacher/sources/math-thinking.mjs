/**
 * Parser for the seed book `vision/Mathematical_Thinking_1000_Problems_Grades_1-4_EN.docx`.
 *
 * The book states its own block contract, so the parser follows it literally:
 * a problem begins with a heading `N.k. Title Variant`, followed by
 * `What it explains and practices.`, `Problem.`, `Abstract model (also useful
 * for code representation).`, `Step-by-step solution` with numbered steps, and
 * `Answer: …`. A chapter begins with `Chapter N. Title` followed by a grade line
 * and a `Concepts practiced:` line.
 *
 * The parser keeps the source-owned parts apart on purpose. A problem record
 * carries the statement, the abstract model, the solution steps, and the printed
 * answer in separate fields so a solver-visible projection can exclude the
 * answer and the abstract model, which are reference material rather than
 * premises.
 *
 * Template identity comes from the printed heading: the trailing variant number
 * is removed, so `Order in a Line 1` through `Order in a Line 5` share the
 * template `Order in a Line`. A handful of chapters title every problem
 * individually; those problems form templates of one variant each.
 */

import { slugify } from '../naming.mjs';

const CHAPTER_PATTERN = /^Chapter (\d{1,2})\.\s+(.*)$/;
const PROBLEM_PATTERN = /^(\d{1,2})\.(\d{1,2})\.\s+(.*)$/;
const GRADE_PATTERN = /^Grade (I|II|III|IV)\.\s*(.*)$/;
const CONCEPTS_PATTERN = /^Concepts practiced:\s*(.*)$/;
const PRACTICE_PATTERN = /^What it explains and practices\.\s*(.*)$/;
const PROBLEM_BLOCK_PATTERN = /^Problem\.\s*(.*)$/;
const ABSTRACT_PATTERN = /^Abstract model \(also useful for code representation\)\.\s*(.*)$/;
const SOLUTION_HEADING_PATTERN = /^Step-by-step solution\s*$/;
const STEP_PATTERN = /^(\d{1,2})\.\s+(.*)$/;
const ANSWER_PATTERN = /^Answer:\s*(.*)$/;
const TRIVIAL_PARAGRAPH = /^(This page intentionally left blank\.?|\.|\*|\d{1,3})$/i;

export const BOOK_ID = 'mathematical-thinking';
export const BOOK_PATH = 'vision/Mathematical_Thinking_1000_Problems_Grades_1-4_EN.docx';

/**
 * Print-level quirks of this source that the pipeline quarantines instead of
 * silently repairing. Each rule names the defect and the action.
 */
/**
 * The five problems of chapter 19 print their answer as a Romanian polarity
 * token left in from another edition of an English book. The dataset is
 * English-only, so the source declares the English equivalent instead of
 * quarantining the items: the family computes the polarity from the statement
 * and renders the English token, while the source token stays in the book and
 * is never copied into a generated artifact. The mapping is the source's own
 * declaration of the normalization, recorded in `sources.md`.
 */
export const ANSWER_TOKEN_NORMALIZATION = Object.freeze({
  'Da.': 'Yes.',
  'Nu.': 'No.'
});

export function normalizePrintedAnswer(problem) {
  const token = String(problem.printedAnswer ?? '').trim();
  return ANSWER_TOKEN_NORMALIZATION[token] ?? problem.printedAnswer;
}

export const BOOK_QUARANTINE_RULES = Object.freeze([
  {
    id: 'missing-answer',
    description: 'The problem has no printed answer, so no label can be inherited.',
    test: (problem) => problem.printedAnswer === ''
  },
  {
    id: 'missing-statement',
    description: 'The problem has no statement block.',
    test: (problem) => problem.statement === ''
  }
]);

export function parseMathThinking(paragraphs) {
  const problems = [];
  const chapters = new Map();
  let chapter = null;
  let current = null;

  const finish = () => {
    if (current !== null) {
      current.statement = current.statement.trim();
      current.abstractModel = current.abstractModel.trim();
      current.printedAnswer = current.printedAnswer.trim();
      problems.push(current);
      current = null;
    }
  };

  for (const paragraph of paragraphs) {
    const text = paragraph.text;
    if (text === '') {
      continue;
    }

    const chapterMatch = text.match(CHAPTER_PATTERN);
    if (chapterMatch !== null) {
      finish();
      chapter = {
        number: Number(chapterMatch[1]),
        title: chapterMatch[2].trim(),
        grade: null,
        concepts: '',
        paragraph: paragraph.index
      };
      chapters.set(chapter.number, chapter);
      continue;
    }

    const gradeMatch = text.match(GRADE_PATTERN);
    if (chapter !== null && gradeMatch !== null && chapter.grade === null && current === null) {
      chapter.grade = gradeMatch[1];
      continue;
    }
    const conceptsMatch = text.match(CONCEPTS_PATTERN);
    if (chapter !== null && conceptsMatch !== null && current === null) {
      chapter.concepts = conceptsMatch[1].trim();
      continue;
    }

    const problemMatch = text.match(PROBLEM_PATTERN);
    if (problemMatch !== null) {
      finish();
      const title = problemMatch[3].trim();
      const variant = title.match(/^(.*?)\s+(\d{1,2})$/);
      current = {
        id: `${Number(problemMatch[1])}.${Number(problemMatch[2])}`,
        section: Number(problemMatch[2]),
        chapter: Number(problemMatch[1]),
        title,
        templateTitle: variant === null ? title : variant[1].trim(),
        variant: variant === null ? 1 : Number(variant[2]),
        practice: '',
        statement: '',
        abstractModel: '',
        steps: [],
        printedAnswer: '',
        firstParagraph: paragraph.index,
        lastParagraph: paragraph.index
      };
      continue;
    }

    if (current === null) {
      continue;
    }

    current.lastParagraph = paragraph.index;
    const practiceMatch = text.match(PRACTICE_PATTERN);
    if (practiceMatch !== null && current.practice === '') {
      current.practice = practiceMatch[1];
      continue;
    }
    const problemBlockMatch = text.match(PROBLEM_BLOCK_PATTERN);
    if (problemBlockMatch !== null) {
      current.statement = current.statement === '' ? problemBlockMatch[1] : `${current.statement} ${problemBlockMatch[1]}`;
      continue;
    }
    const abstractMatch = text.match(ABSTRACT_PATTERN);
    if (abstractMatch !== null) {
      current.abstractModel = abstractMatch[1];
      continue;
    }
    if (SOLUTION_HEADING_PATTERN.test(text)) {
      current.inSolution = true;
      continue;
    }
    const answerMatch = text.match(ANSWER_PATTERN);
    if (answerMatch !== null) {
      current.printedAnswer = answerMatch[1];
      continue;
    }
    if (current.inSolution === true) {
      const stepMatch = text.match(STEP_PATTERN);
      if (stepMatch !== null) {
        current.steps.push(stepMatch[2].trim());
      }
      continue;
    }
    if (!TRIVIAL_PARAGRAPH.test(text) && current.statement === '') {
      current.statement = text;
    }
  }
  finish();

  for (const problem of problems) {
    const chapterRecord = chapters.get(problem.chapter) ?? { title: '', grade: null, concepts: '' };
    problem.chapterTitle = chapterRecord.title;
    problem.chapterGrade = chapterRecord.grade;
    problem.chapterConcepts = chapterRecord.concepts;
    problem.templateKey = problem.templateTitle;
    problem.type = slugify(problem.templateTitle);
    problem.folder = `${problem.id}-${slugify(problem.title)}`;
    problem.order = problem.chapter * 100 + problem.section;
    problem.paragraphSpan = { from: problem.firstParagraph, to: problem.lastParagraph };
    delete problem.firstParagraph;
    delete problem.lastParagraph;
    delete problem.inSolution;
  }

  return { chapters: [...chapters.values()], problems };
}
