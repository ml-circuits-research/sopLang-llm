/**
 * Parser for the seed book `vision/World_as_a_System_1000_Reasoning_Problems_Grades_1-4_EN.docx`.
 *
 * The book states its own block contract, so the parser follows it literally:
 * the body is four grade parts, each part introduces the same fifty reasoning
 * families (`G1. Positions and orientation`, ... `N25. Meta-reasoning`), and
 * every family blocks five problems under a `Problem N. Title` heading. A
 * problem carries `Knowledge context.`, `Given facts.`, `Rules.`, `Task.`,
 * `Step-by-step solution.`, `Answer.`, `Knowledge takeaway.`, and
 * `Formal model.` blocks.
 *
 * The parser keeps the source-owned parts apart on purpose. The statement is
 * the four premise blocks — knowledge context, given facts, rules, task — and
 * it is the only solver-visible projection. The worked solution, the printed
 * answer, the takeaway, and the formal model are reference material and never
 * reach `problem.md`.
 *
 * Template identity comes from the printed structure: one family inside one
 * grade is one template, so `G3 Rivers: upstream and downstream` in grade 2
 * and the same family in grade 4 are different templates (their printed rules
 * and their answers differ), while the five problems of a family block share
 * the template and vary only in the data they state.
 */

import { slugify } from '../naming.mjs';

const GRADE_PATTERN = /^GRADE (\d)$/;
const PART_PATTERN = /^Part [A-Z] — /;
const FAMILY_PATTERN = /^([A-Z]\d{1,2})\.\s+(.+)$/;
const PROBLEM_PATTERN = /^Problem (\d{1,4})\.\s+(.+)$/;
const BLOCK_PATTERN =
  /^(Knowledge context|Given facts|Rules|Task|Step-by-step solution|Answer|Knowledge takeaway|Formal model)\.\s*([\s\S]*)$/;
const STEP_MARKER = /(?<=\.)\s+(?=\d{1,2}\.\s)/;

const PREMISE_BLOCKS = Object.freeze(['Knowledge context', 'Given facts', 'Rules', 'Task']);
const REFERENCE_BLOCKS = Object.freeze(['Step-by-step solution', 'Answer', 'Knowledge takeaway', 'Formal model']);
const ALL_BLOCKS = Object.freeze([...PREMISE_BLOCKS, ...REFERENCE_BLOCKS]);

export const BOOK_ID = 'world-as-a-system';
export const BOOK_PATH = 'vision/World_as_a_System_1000_Reasoning_Problems_Grades_1-4_EN.docx';

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
    id: 'missing-statement',
    description: 'The problem has no statement block, so no solver-visible text exists.',
    test: (problem) => problem.statement === ''
  },
  {
    id: 'missing-family',
    description: 'The problem appears before any family heading, so its template is unknown.',
    test: (problem) => problem.familyCode === ''
  },
  {
    id: 'incomplete-block',
    description: 'One of the eight printed blocks is missing, so the problem cannot be read as printed.',
    test: (problem) => problem.missingBlocks.length > 0
  }
]);

export function parseWorldSystem(paragraphs) {
  const problems = [];
  const grades = new Map();
  let grade = null;
  let family = null;
  let current = null;

  const finish = () => {
    if (current === null) {
      return;
    }
    current.knowledgeContext = current.parts['Knowledge context'].join(' ').trim();
    current.givenFacts = current.parts['Given facts'].join(' ').trim();
    current.rules = current.parts.Rules.join(' ').trim();
    current.task = current.parts.Task.join(' ').trim();
    current.solutionSteps = current.parts['Step-by-step solution'].join(' ').trim();
    current.printedAnswer = current.parts.Answer.join(' ').trim();
    current.takeaway = current.parts['Knowledge takeaway'].join(' ').trim();
    current.formalModel = current.parts['Formal model'].join(' ').trim();
    current.steps = current.solutionSteps === '' ? [] : current.solutionSteps.split(STEP_MARKER).map((step) => step.replace(/^\d{1,2}\.\s*/, '').trim());
    current.missingBlocks = ALL_BLOCKS.filter((block) => (current.parts[block].join(' ').trim() === ''));
    current.title = current.title.trim();
    current.statement = [
      `Knowledge context. ${current.knowledgeContext}`,
      `Given facts. ${current.givenFacts}`,
      `Rules. ${current.rules}`,
      `Task. ${current.task}`
    ].join('\n\n');
    delete current.parts;
    problems.push(current);
    current = null;
  };

  for (const paragraph of paragraphs) {
    const text = paragraph.text.trim();
    if (text === '') {
      continue;
    }

    const gradeMatch = text.match(GRADE_PATTERN);
    if (gradeMatch !== null) {
      finish();
      grade = Number(gradeMatch[1]);
      family = null;
      grades.set(grade, { number: grade, paragraph: paragraph.index });
      continue;
    }

    if (PART_PATTERN.test(text)) {
      finish();
      continue;
    }

    const problemMatch = text.match(PROBLEM_PATTERN);
    if (problemMatch !== null) {
      finish();
      current = {
        number: Number(problemMatch[1]),
        title: problemMatch[2].trim(),
        grade: grade ?? 0,
        familyCode: family === null ? '' : family.code,
        familyTitle: family === null ? '' : family.title,
        parts: Object.fromEntries(ALL_BLOCKS.map((block) => [block, []])),
        firstParagraph: paragraph.index,
        lastParagraph: paragraph.index
      };
      continue;
    }

    // A family heading closes the problem block before it; it is never part of
    // a problem, and the map-of-families table in the front matter spells its
    // codes without the heading punctuation, so this pattern sees only the
    // real headings.
    const familyMatch = text.match(FAMILY_PATTERN);
    if (familyMatch !== null) {
      finish();
      family = { code: familyMatch[1], title: familyMatch[2].trim(), grade };
      continue;
    }

    if (current === null) {
      continue;
    }

    current.lastParagraph = paragraph.index;
    const blockMatch = text.match(BLOCK_PATTERN);
    if (blockMatch !== null) {
      current.lastBlock = blockMatch[1];
      current.parts[blockMatch[1]].push(blockMatch[2].trim());
      continue;
    }
    if (current.lastBlock === undefined) {
      current.title = `${current.title} ${text}`;
      continue;
    }
    current.parts[current.lastBlock].push(text);
  }
  finish();

  for (const problem of problems) {
    problem.id = String(problem.number);
    problem.order = problem.number;
    problem.templateKey = `${problem.familyTitle} (grade ${problem.grade})`;
    problem.type = slugify(problem.templateKey);
    problem.folder = `${problem.id}-${slugify(problem.title)}`;
    problem.paragraphSpan = { from: problem.firstParagraph, to: problem.lastParagraph };
    delete problem.firstParagraph;
    delete problem.lastParagraph;
    delete problem.lastBlock;
  }

  return { grades: [...grades.values()].sort((left, right) => left.number - right.number), problems };
}
