/**
 * Family N24 of the world seed book: matching, scheduling, and coverage.
 *
 * Every problem states one allowed-task list per student and asks for one
 * complete valid assignment: each student gets exactly one allowed task and
 * each task is used exactly once. The family solves the all-different
 * constraint by depth-first search over the students in printed order, taking
 * the allowed tasks in the order the statement first names them, so the first
 * complete assignment found is the one the book prints.
 *
 * The variants differ in how restricted the lists are (from one allowed task to
 * two), which moves the forced choices; grades 2-4 append a cross-domain check
 * (map scale, clock arithmetic, quorum, or duplicate reports, optionally
 * combined with a map-sheet count) that the family renders through the shared
 * `renderCrossDomain`, and grades 3-4 also carry the mixed-domain variant.
 *
 * The four grades share one computation.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';

const CHOICES_PATTERN = /([A-Z][A-Za-z]+): \[([^\]]+)\]/g;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const students = [];
  const rawChoices = new Map();
  for (const match of facts.matchAll(CHOICES_PATTERN)) {
    const tasks = match[2].split(',').map((value) => value.trim().replace(/^'|'$/g, ''));
    students.push(match[1]);
    rawChoices.set(match[1], tasks);
  }
  if (students.length === 0) {
    throw new Error('the statement lists no allowed assignment');
  }
  // The printed order of the task names is the order the search tries them in,
  // so the first complete assignment found is the printed one. A task enters
  // that order the first time the statement names it.
  const tasks = [];
  for (const student of students) {
    for (const task of rawChoices.get(student)) {
      if (!tasks.includes(task)) {
        tasks.push(task);
      }
    }
  }
  if (tasks.length !== students.length) {
    throw new Error('the statement does not pair as many tasks as students');
  }
  const choices = {};
  for (const student of students) {
    choices[student] = tasks.filter((task) => rawChoices.get(student).includes(task));
  }
  return { students, tasks, choices, crossDomain: parseCrossDomain(blocks['Given facts']) };
}

/**
 * Depth-first search over the students in printed order. Each student takes the
 * first allowed task that is still free; a branch that leaves some student
 * without a task is undone, so the first complete assignment found is the one
 * with the printed preference order.
 */
function firstAssignment(slots) {
  const used = new Set();
  const assignment = new Map();
  const search = (index) => {
    if (index === slots.students.length) {
      return true;
    }
    const student = slots.students[index];
    for (const task of slots.choices[student]) {
      if (used.has(task)) {
        continue;
      }
      used.add(task);
      assignment.set(student, task);
      if (search(index + 1)) {
        return true;
      }
      used.delete(task);
      assignment.delete(student);
    }
    return false;
  };
  if (!search(0)) {
    return null;
  }
  return slots.students.map((student) => ({ student, task: assignment.get(student) }));
}

function solve(slots) {
  const assignment = firstAssignment(slots);
  if (assignment === null) {
    throw new Error('the allowed tasks admit no complete assignment');
  }
  return { assignment, crossDomain: slots.crossDomain };
}

function render(solution) {
  const main = `Valid assignment: ${solution.assignment.map((pair) => `${pair.student}→${pair.task}`).join(', ')}.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Array.isArray(slots.students) && slots.students.length > 0, "the statement must name at least one student");',
  'probe(Array.isArray(slots.tasks) && slots.tasks.length > 0, "the statement must name at least one task");',
  'probe(slots.students.length === slots.tasks.length, "the statement must pair as many tasks as students");',
  'const used = new Set();',
  'const assignment = new Map();',
  'const search = (index) => {',
  '  if (index === slots.students.length) {',
  '    return true;',
  '  }',
  '  const student = slots.students[index];',
  '  const allowed = slots.choices[student];',
  '  probe(Array.isArray(allowed) && allowed.length > 0, "every student must have at least one allowed task");',
  '  for (const task of allowed) {',
  '    if (used.has(task)) {',
  '      continue;',
  '    }',
  '    used.add(task);',
  '    assignment.set(student, task);',
  '    if (search(index + 1)) {',
  '      return true;',
  '    }',
  '    used.delete(task);',
  '    assignment.delete(student);',
  '  }',
  '  return false;',
  '};',
  'probe(search(0), "the allowed tasks must admit at least one complete assignment");',
  'const main = "Valid assignment: " + slots.students.map((student) => student + "→" + assignment.get(student)).join(", ") + ".";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const forced = slots.students.filter((student) => slots.choices[student].length === 1);
  return [
    forced.length === 0
      ? 'No student has a single allowed task, so the search starts with the most restricted list.'
      : forced.length === 1
        ? `${forced[0]} has a single allowed task, so that choice is taken first and removed from the remaining choices.`
        : `${forced.join(' and ')} have a single allowed task each, so those choices are taken first and removed from the remaining choices.`,
    `Trying the remaining allowed tasks in printed order yields ${solution.assignment.map((pair) => `${pair.student}→${pair.task}`).join(', ')}.`,
    'Every student keeps an allowed task, every task is used exactly once, and any branch that would leave a student without a free task was undone before the next candidate.'
  ];
}

function caseFor(grade) {
  return {
    template: `Matching, scheduling, and coverage (grade ${grade})`,
    type: `matching-scheduling-and-coverage-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N24';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
