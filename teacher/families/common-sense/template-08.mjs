/**
 * Template 8 of the common-sense book: time dependencies.
 *
 * Every variant states six tasks with whole-day durations, the tasks that can
 * start on day 0, and the prerequisites of each remaining task, and asks for
 * the minimum project duration together with one dependency chain that fixes
 * it. Earliest start times are the latest finish of a task's prerequisites, so
 * the duration is the maximum finish time and the chain is found by walking
 * back from that task through the prerequisite that attains its start time.
 *
 * The variants differ in the six durations only: the predecessor structure is
 * stated in every variant and is parsed from the statement, so the schedule is
 * computed rather than recognized. When two prerequisites finish together the
 * chain follows the one the statement lists first, which is the chain the
 * printed answer names.
 */

import { slugify } from '../../naming.mjs';

const DURATIONS_PATTERN = /durations in whole (\w+)s: ([A-Z]=\d+(?:, [A-Z]=\d+)*)\./;
const DURATION_PATTERN = /([A-Z])=(\d+)/g;
const ROOTS_PATTERN = /([A-Z](?: and [A-Z])*) can start on day 0\./;
const AFTER_PATTERN = /([A-Z](?: and [A-Z])*) can start only after (?:both )?([A-Z](?: and [A-Z])*)[;.]/g;

function names(text) {
  return text.split(' and ');
}

function parse(statement) {
  const durations = DURATIONS_PATTERN.exec(statement);
  if (durations === null) {
    throw new Error('the statement does not state the task durations');
  }
  const durationUnit = durations[1];
  const durationsOf = {};
  const order = [];
  for (const pair of durations[2].matchAll(DURATION_PATTERN)) {
    durationsOf[pair[1]] = Number(pair[2]);
    order.push(pair[1]);
  }
  const prerequisites = {};
  for (const name of order) {
    prerequisites[name] = null;
  }
  const roots = ROOTS_PATTERN.exec(statement);
  if (roots === null) {
    throw new Error('the statement does not say which tasks can start on day 0');
  }
  for (const name of names(roots[1])) {
    prerequisites[name] = [];
  }
  for (const after of statement.matchAll(AFTER_PATTERN)) {
    for (const name of names(after[1])) {
      prerequisites[name] = names(after[2]);
    }
  }
  for (const name of order) {
    if (prerequisites[name] === null) {
      throw new Error(`the statement does not state the prerequisites of task ${name}`);
    }
    for (const prerequisite of prerequisites[name]) {
      if (!order.includes(prerequisite)) {
        throw new Error(`task ${name} depends on ${prerequisite}, which has no stated duration`);
      }
    }
  }
  return { order, durations: durationsOf, prerequisites, unit: durationUnit };
}

/**
 * The earliest schedule: tasks are released in dependency order, a task starts
 * at the latest finish among its prerequisites, and the duration of the project
 * is the latest finish of all tasks.
 */
function schedule(slots) {
  const start = {};
  const finish = {};
  const scheduled = [];
  const remaining = slots.order.slice();
  while (remaining.length > 0) {
    const ready = remaining.filter((name) => slots.prerequisites[name].every((prerequisite) => scheduled.includes(prerequisite)));
    if (ready.length === 0) {
      throw new Error('the stated prerequisites contain a cycle, so no schedule exists');
    }
    for (const name of ready) {
      const prerequisites = slots.prerequisites[name];
      start[name] = prerequisites.length === 0 ? 0 : Math.max(...prerequisites.map((prerequisite) => finish[prerequisite]));
      finish[name] = start[name] + slots.durations[name];
      scheduled.push(name);
      remaining.splice(remaining.indexOf(name), 1);
    }
  }
  return { start, finish, order: scheduled };
}

/** The chain of tasks that fix each other's start, traced back from the last finish. */
function criticalChain(slots, plan) {
  const last = plan.order.reduce((best, name) => (plan.finish[name] > plan.finish[best] ? name : best));
  const chain = [last];
  let task = last;
  while (slots.prerequisites[task].length > 0) {
    const binding = slots.prerequisites[task].find((prerequisite) => plan.finish[prerequisite] === plan.start[task]);
    if (binding === undefined) {
      throw new Error(`no stated prerequisite of task ${task} fixes its start time`);
    }
    chain.unshift(binding);
    task = binding;
  }
  return { last, chain };
}

function solve(slots) {
  const plan = schedule(slots);
  const { last, chain } = criticalChain(slots, plan);
  return { start: plan.start, finish: plan.finish, order: plan.order, last, chain, duration: plan.finish[last], unit: slots.unit };
}

function render(solution) {
  return `The minimum duration is ${solution.duration} ${solution.unit}s. One critical chain is ${solution.chain.join('–')}.`;
}

const WIRES = [
  {
    name: 'schedule',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const start = {};',
      'const finish = {};',
      'const scheduled = [];',
      'const remaining = slots.order.slice();',
      'while (remaining.length > 0) {',
      '  const ready = remaining.filter((name) => slots.prerequisites[name].every((prerequisite) => scheduled.indexOf(prerequisite) !== -1));',
      '  if (ready.length === 0) {',
      '    throw new Error("the stated prerequisites contain a cycle, so no schedule exists");',
      '  }',
      '  for (const name of ready) {',
      '    const prerequisites = slots.prerequisites[name];',
      '    start[name] = prerequisites.length === 0 ? 0 : Math.max(...prerequisites.map((prerequisite) => finish[prerequisite]));',
      '    finish[name] = start[name] + slots.durations[name];',
      '    scheduled.push(name);',
      '    remaining.splice(remaining.indexOf(name), 1);',
      '  }',
      '}',
      'return { start, finish, scheduled };'
    ].join('\n')
  },
  {
    name: 'critical',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const schedule = $schedule;',
      'const last = schedule.scheduled.reduce((best, name) => (schedule.finish[name] > schedule.finish[best] ? name : best));',
      'probe(schedule.finish[last] > 0, "the project must have a positive duration");',
      'const chain = [last];',
      'let task = last;',
      'while (slots.prerequisites[task].length > 0) {',
      '  const binding = slots.prerequisites[task].find((prerequisite) => schedule.finish[prerequisite] === schedule.start[task]);',
      '  if (binding === undefined) {',
      '    throw new Error("no stated prerequisite of task " + task + " fixes its start time");',
      '  }',
      '  chain.unshift(binding);',
      '  task = binding;',
      '}',
      'return { chain, duration: schedule.finish[last] };'
    ].join('\n')
  }
];

const COMPUTE = [
  'return "The minimum duration is " + $critical.duration + " " + $slots.unit + "s. One critical chain is " + $critical.chain.join("\\u2013") + ".";'
].join('\n');

function explain(slots, solution) {
  const roots = solution.order.filter((name) => slots.prerequisites[name].length === 0);
  const rootsText = roots.map((name) => `${name} finishes at ${solution.finish[name]}`).join(', ');
  const rest = solution.order.filter((name) => slots.prerequisites[name].length > 0);
  const restText = rest
    .map((name) => `${name} waits for ${slots.prerequisites[name].join(' and ')}, starts at ${solution.start[name]}, and finishes at ${solution.finish[name]}`)
    .join('; ');
  return [
    `Tasks with no prerequisite start at day 0: ${rootsText}.`,
    `Every other task starts at the latest finish among its prerequisites, so ${restText}.`,
    `The latest finish of all tasks is ${solution.duration} ${solution.unit}s, reached by task ${solution.last}, so no schedule is shorter than that and this one attains it.`,
    `Each step of ${solution.chain.join('–')} waits for the previous step and therefore fixes the next start, while shortening a task outside that chain leaves the final finish unchanged.`
  ];
}

export const unit = 8;

export const cases = [
  {
    template: 'Time dependencies',
    type: slugify('Time dependencies'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
