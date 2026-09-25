/**
 * Form 30 of the scientific-reasoning book: planning with partial dependencies.
 *
 * Every variant states five tasks with their prerequisites: some tasks have no
 * prerequisite, some wait for one task, and one waits for two. The plan groups
 * the tasks by level: a task enters the first level in which every
 * prerequisite has already been placed, so the tasks inside one level can run
 * in parallel, and reading the levels in order yields a valid total order.
 *
 * The variants differ in the world's vocabulary (pollination, seed dispersal,
 * decomposition, soil, a lever, a circuit), not in the reasoning, so one family
 * covers all twenty-five of them.
 */

import { slugify } from '../../naming.mjs';

const DEPENDENCY_PATTERN = /“([^”]+)” (?:without prerequisites|after ((?:“[^”]+”)(?: and “[^”]+”)*))/g;
const TASK_NAME_PATTERN = /“([^”]+)”/g;

function parse(statement) {
  const problemData = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  if (problemData === null) {
    throw new Error('the statement does not state the dependencies');
  }
  const declared = /The dependencies are: ([\s\S]*)$/.exec(problemData[1]);
  if (declared === null) {
    throw new Error('the statement does not state the dependencies');
  }
  const tasks = [];
  for (const match of declared[1].matchAll(DEPENDENCY_PATTERN)) {
    const after =
      match[2] === undefined ? [] : [...match[2].matchAll(TASK_NAME_PATTERN)].map((name) => name[1]);
    tasks.push({ name: match[1], after });
  }
  if (tasks.length === 0) {
    throw new Error('the statement lists no task');
  }
  return { tasks };
}

/**
 * Levels of the dependency graph, each level keeping the order in which the
 * statement lists its tasks. A task is placed as soon as every prerequisite
 * already sits in an earlier level, which is what makes the tasks of one level
 * independent of each other.
 */
function levels(slots) {
  const names = new Set(slots.tasks.map((task) => task.name));
  for (const task of slots.tasks) {
    for (const dependency of task.after) {
      if (!names.has(dependency)) {
        throw new Error(`the prerequisite "${dependency}" is not a stated task`);
      }
    }
  }
  const completed = new Set();
  const plan = [];
  let remaining = slots.tasks;
  while (remaining.length > 0) {
    const level = remaining.filter((task) => task.after.every((name) => completed.has(name)));
    if (level.length === 0) {
      throw new Error('the stated dependencies contain a cycle');
    }
    for (const task of level) {
      completed.add(task.name);
    }
    plan.push(level.map((task) => task.name));
    remaining = remaining.filter((task) => !completed.has(task.name));
  }
  return plan;
}

function solve(slots) {
  return { plan: levels(slots) };
}

function render(solution) {
  return `Plan by levels: ${solution.plan.map((level) => level.join(', ')).join(' | ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const names = new Set(slots.tasks.map((task) => task.name));',
  'for (const task of slots.tasks) {',
  '  for (const dependency of task.after) {',
  '  }',
  '}',
  'const completed = new Set();',
  'const plan = [];',
  'let remaining = slots.tasks;',
  'while (remaining.length > 0) {',
  '  const level = remaining.filter((task) => task.after.every((name) => completed.has(name)));',
  '  for (const task of level) {',
  '    completed.add(task.name);',
  '  }',
  '  plan.push(level.map((task) => task.name));',
  '  remaining = remaining.filter((task) => !completed.has(task.name));',
  '}',
  'probe(plan.length > 0, "the plan must have at least one level");',
  'probe(plan.reduce((total, level) => total + level.length, 0) === slots.tasks.length, "every task must appear exactly once in the plan");',
  'return "Plan by levels: " + plan.map((level) => level.join(", ")).join(" | ") + ".";'
].join('\n');

function explain(slots, solution) {
  const waiting = slots.tasks.filter((task) => task.after.length > 1);
  return [
    `The first level holds the tasks without prerequisites: ${solution.plan[0].join(', ')}.`,
    'From there each level is built by marking the placed tasks and collecting every task whose prerequisites are all marked already, so the tasks inside one level never wait for one another and can run in parallel.',
    waiting.length === 0
      ? 'No task waits for several prerequisites in this variant.'
      : `The task that must wait for several prerequisites is ${waiting.map((task) => `${task.name} (after ${task.after.join(' and ')})`).join(', ')}.`,
    `The resulting levels are ${solution.plan.map((level) => level.join(', ')).join(' | ')}, and reading them in order gives a valid total ordering, because a task is only ever placed after every prerequisite it names.`
  ];
}

export const unit = 30;

export const cases = [
  {
    template: 'Planning with partial dependencies',
    type: slugify('Planning with partial dependencies'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
