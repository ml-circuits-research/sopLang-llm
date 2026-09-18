/**
 * Problem dump for family authors.
 *
 * Prints the problems of one unit of one seed book with the fields a family
 * author needs: the printed id and title, the template identity, the statement
 * blocks, the printed answer, and the reference material (the printed steps
 * and the formal model). The reference material is shown only so the author can
 * check that the family reproduces it: a family's parse and computation must
 * work from the statement alone.
 *
 * Usage:
 *   node teacher/chapter-dump.mjs --book mathematical-thinking --chapter 7
 *   node teacher/chapter-dump.mjs --book world-as-a-system --family G3
 *   node teacher/chapter-dump.mjs --book world-as-a-system --family N12 --limit 3
 */

import { registerDocxSource } from '../context/sources/docx.mjs';
import { getSource } from './sources/index.mjs';

const argumentsList = process.argv.slice(2);

function option(name) {
  const index = argumentsList.indexOf(`--${name}`);
  return index === -1 ? null : argumentsList[index + 1];
}

function fail(message) {
  process.stderr.write(`chapter-dump: ${message}\n`);
  process.exit(1);
}

const bookId = option('book') ?? 'mathematical-thinking';
let source;
try {
  source = getSource(bookId);
} catch (error) {
  fail(error.message);
}

const unitOption = source.unitKind === 'number' ? option('chapter') ?? '1' : option('family') ?? 'G1';
const unit = source.unitKind === 'number' ? Number(unitOption) : unitOption.toUpperCase();
if (source.unitKind === 'number' && !Number.isInteger(unit)) {
  fail(`--chapter takes a chapter number, not "${unitOption}".`);
}
const limit = option('limit') === null ? null : Number(option('limit'));

const registration = registerDocxSource(source.path);
const parsed = source.parse(registration.paragraphs);
let problems = parsed.problems.filter((problem) => source.unitOf(problem) === unit);
if (limit !== null) {
  problems = problems.slice(0, limit);
}
if (problems.length === 0) {
  fail(`No problems found for ${source.unitLabel} ${unit} in ${source.id}.`);
}

process.stdout.write(`# ${source.id} — ${source.unitLabel} ${unit} (${problems.length} problems)\n\n`);
for (const problem of problems) {
  process.stdout.write(`--- ${problem.id} | ${problem.title} | template: ${problem.templateKey} | type: ${problem.type}\n`);
  if (source.secondary !== null) {
    process.stdout.write(`${source.secondary.label.toUpperCase()}: ${source.secondary.of(problem)}\n`);
  }
  process.stdout.write(`STATEMENT:\n${problem.statement}\n`);
  process.stdout.write(`PRINTED ANSWER: ${problem.printedAnswer}\n`);
  if (Array.isArray(problem.steps) && problem.steps.length > 0) {
    process.stdout.write(`REFERENCE STEPS (${problem.steps.length}): ${problem.steps.join(' | ')}\n`);
  }
  if (typeof problem.abstractModel === 'string' && problem.abstractModel !== '') {
    process.stdout.write(`ABSTRACT MODEL (reference only): ${problem.abstractModel}\n`);
  }
  if (typeof problem.formalModel === 'string' && problem.formalModel !== '') {
    process.stdout.write(`FORMAL MODEL (reference only): ${problem.formalModel}\n`);
  }
  process.stdout.write('\n');
}
