/**
 * Chapter dump for family authors.
 *
 * Prints the problems of one chapter of the mathematical seed book with the
 * fields a family author needs: the printed id and title, the template title, the
 * statement, the printed answer, and the abstract model. The abstract model and
 * the answer are reference material: a family's parse and computation must work
 * from the statement alone, and they are shown here only so the author can check
 * that the family reproduces them.
 *
 * Usage: node teacher/chapter-dump.mjs --chapter 7
 */

import { registerDocxSource } from '../context/sources/docx.mjs';
import { BOOK_PATH, parseMathThinking } from './sources/math-thinking.mjs';

const argumentsList = process.argv.slice(2);
const index = argumentsList.indexOf('--chapter');
const chapter = index === -1 ? 1 : Number(argumentsList[index + 1]);

const source = registerDocxSource(BOOK_PATH);
const parsed = parseMathThinking(source.paragraphs);
const problems = parsed.problems.filter((problem) => problem.chapter === chapter);
if (problems.length === 0) {
  process.stdout.write(`No problems found for chapter ${chapter}.\n`);
  process.exit(1);
}

const chapterRecord = parsed.chapters.find((record) => record.number === chapter);
process.stdout.write(`# Chapter ${chapter}: ${chapterRecord.title}\n`);
process.stdout.write(`Concepts: ${chapterRecord.concepts}\n\n`);

for (const problem of problems) {
  process.stdout.write(`--- ${problem.id} | ${problem.title} | template: ${problem.templateKey} | type: ${problem.type}\n`);
  process.stdout.write(`STATEMENT: ${problem.statement}\n`);
  process.stdout.write(`PRINTED ANSWER: ${problem.printedAnswer}\n`);
  process.stdout.write(`ABSTRACT MODEL (reference only): ${problem.abstractModel}\n\n`);
}
