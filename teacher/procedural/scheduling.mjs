/**
 * Scheduling families of the procedural arithmetic source.
 *
 * The decompose-to-solve book is the largest execution-error book in exp-013
 * (83 items), and its task-dependency plans are the graph shapes the procedural
 * inventory still does not cover: the two graph operators the inventory added
 * (`neighbourCount`, `pathExists`) answer degree and reachability over an
 * unweighted, undirected graph, while the book's scheduling families compute a
 * weighted critical path over a directed precedence DAG — the earliest finish
 * time, a deadline verdict, and the transitive prerequisites of one task. Those
 * three shapes are the tranche this module teaches, plus the route bottleneck
 * (the narrowest link capacity), which the book's network family aggregates by
 * minimum rather than sum.
 *
 * Every family is a small, decomposed plan, which is the point: the book bodies
 * that fail are 46 to 67 lines of one jsEval body, and the failures are
 * iteration and array-method mistakes (`ready.after is not iterable`,
 * `completed.last is not a function`) and a guard that fires on a plan that
 * did not schedule every task. Here each family splits that one body into
 * named stages — compute per-task finish times, take the latest, count the
 * blocking tasks, take the narrowest capacity — where the summary stages are
 * `aggregate` wires and only the genuinely graph-shaped stage is `jsEval`. The
 * precedence graph is directed, so the undirected `graphPath` command does not
 * fit any of these questions; `aggregate` fits the summary stages and carries
 * them.
 *
 * The samplers keep the arithmetic integer-exact and acyclic on purpose: the
 * oracle, the circuit, and the printed answer must agree exactly, and a cycle
 * in the precedence pairs is not a value a schedule can have. The oracle of
 * each family is a genuinely different algorithm from its stages: the finish
 * oracle walks the DAG by memoized recursion where the stages relax a
 * topological order, and the prerequisite oracle recurses where the stages use
 * a queue.
 */

const TASK_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

/** The task list as prose: [{A,5},{B,3}] -> "A(5), B(3)". */
function renderTasks(tasks) {
  return tasks.map((task) => `${task.name}(${task.duration})`).join(', ');
}

/** The prose task list back to name/duration records. */
function parseTasks(text) {
  const tasks = [];
  for (const match of text.matchAll(/([A-Z])\((\d+)\)/g)) {
    tasks.push({ name: match[1], duration: Number(match[2]) });
  }
  if (tasks.length === 0 || tasks.some((task) => !Number.isInteger(task.duration) || task.duration <= 0)) {
    throw new Error('the statement does not state the tasks with positive whole durations');
  }
  return tasks;
}

/** The precedence pairs as prose: [["A","B"],["A","C"]] -> "A must finish before B, A must finish before C". */
function renderEdges(edges) {
  return edges.map(([before, after]) => `${before} must finish before ${after}`).join(', ');
}

/** The prose precedence pairs back to [before, after] name pairs. */
function parseEdges(statement) {
  const edges = [];
  for (const match of statement.matchAll(/([A-Z]) must finish before ([A-Z])/g)) {
    edges.push([match[1], match[2]]);
  }
  return edges;
}

/** A list of numbers as prose: [12,5,8] -> "12, 5 and 8". */
function renderNumbers(values) {
  const printed = values.map((value) => String(value));
  return `${printed.slice(0, -1).join(', ')} and ${printed.at(-1)}`;
}

/** The prose number list back to numbers, the inverse of `renderNumbers`. */
function parseNumbers(text) {
  return text.split(/,\s*|\s+and\s+/).map((piece) => Number(piece.trim()));
}

/**
 * Draw a connected, acyclic precedence schedule: five to seven named tasks with
 * whole durations, and precedence pairs that only ever point from an earlier
 * name to a later one. Every task after the first receives at least one
 * incoming pair, so the schedule has a single source and every task is
 * reachable from it, which keeps the critical path a genuine chain rather than
 * a lone task.
 */
function drawSchedule(random) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const count = 5 + Math.floor(random() * 3);
    const tasks = [];
    for (let index = 0; index < count; index += 1) {
      tasks.push({ name: TASK_NAMES[index], duration: 1 + Math.floor(random() * 9) });
    }
    const edges = [];
    for (let left = 0; left < count; left += 1) {
      for (let right = left + 1; right < count; right += 1) {
        if (random() < 0.3) {
          edges.push([tasks[left].name, tasks[right].name]);
        }
      }
    }
    for (let right = 1; right < count; right += 1) {
      if (!edges.some(([, after]) => after === tasks[right].name)) {
        const left = Math.floor(random() * right);
        edges.push([tasks[left].name, tasks[right].name]);
      }
    }
    // Print the pairs in name order so the statement reads alphabetically; the
    // parse recovers them in the same order it printed them, so the round-trip
    // is unaffected.
    edges.sort((a, b) => (a[0] === b[0] ? a[1].localeCompare(b[1]) : a[0].localeCompare(b[0])));
    return { tasks, edges };
  }
  throw new Error('the sampler could not draw a connected acyclic schedule');
}

/**
 * The total completion time of a schedule, by memoized recursion from each task
 * over its successors. This is the independent oracle for the finish families:
 * the circuit stages compute the same value by a topological relaxation, so the
 * two are separate transcriptions of the one answer.
 */
function scheduleFinish(tasks, edges) {
  const duration = new Map(tasks.map((task) => [task.name, task.duration]));
  const after = new Map(tasks.map((task) => [task.name, []]));
  for (const [before, next] of edges) {
    after.get(before).push(next);
  }
  const memo = new Map();
  const longestFrom = (name) => {
    if (memo.has(name)) {
      return memo.get(name);
    }
    let best = 0;
    for (const next of after.get(name)) {
      const length = longestFrom(next);
      if (length > best) {
        best = length;
      }
    }
    const value = duration.get(name) + best;
    memo.set(name, value);
    return value;
  };
  let finish = 0;
  for (const task of tasks) {
    const length = longestFrom(task.name);
    if (length > finish) {
      finish = length;
    }
  }
  return finish;
}

/**
 * The `finishes` stage: each task's earliest finish time, computed by a
 * topological relaxation (Kahn's order, then the longest path into each task).
 * The output list is what the summary `aggregate` stage reduces to the latest
 * finish.
 */
const FINISHES_WIRE = {
  name: 'finishes',
  command: 'jsEval',
  body: [
    'const slots = $slots;',
    'probe(Array.isArray(slots.tasks) && slots.tasks.length > 0, "the plan must schedule at least one task");',
    'probe(Array.isArray(slots.edges), "the plan must state the precedence pairs");',
    'const duration = {};',
    'const indegree = {};',
    'const after = {};',
    'for (const task of slots.tasks) {',
    '  duration[task.name] = task.duration;',
    '  indegree[task.name] = 0;',
    '  after[task.name] = [];',
    '}',
    'for (const edge of slots.edges) {',
    '  indegree[edge[1]] += 1;',
    '  after[edge[0]].push(edge[1]);',
    '}',
    'const starts = {};',
    'for (const task of slots.tasks) {',
    '  starts[task.name] = 0;',
    '}',
    'const ready = slots.tasks.filter((task) => indegree[task.name] === 0).map((task) => task.name);',
    'const ordered = [];',
    'while (ready.length > 0) {',
    '  const name = ready.shift();',
    '  ordered.push(name);',
    '  for (const next of after[name]) {',
    '    const candidate = starts[name] + duration[name];',
    '    if (candidate > starts[next]) {',
    '      starts[next] = candidate;',
    '    }',
    '    indegree[next] -= 1;',
    '    if (indegree[next] === 0) {',
    '      ready.push(next);',
    '    }',
    '  }',
    '}',
    'probe(ordered.length === slots.tasks.length, "the precedence pairs must schedule every task");',
    'return slots.tasks.map((task) => starts[task.name] + duration[task.name]);'
  ].join('\n')
};

/** The `latest` stage: the overall completion time is the latest task finish. */
const LATEST_WIRE = {
  name: 'latest',
  command: 'aggregate',
  body: ['source: $finishes', 'op: max'].join('\n')
};

/** The latent plan: compute every task's finish time, then report the latest one. */
const scheduleFinishTime = {
  id: 'schedule-finish-time',
  name: 'Schedule Finish Time',
  type: 'schedule-finish-time',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 3, branching: 1, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    return drawSchedule(random);
  },
  statement(slots) {
    return `A project schedules the tasks ${renderTasks(slots.tasks)}. ` +
      `${renderEdges(slots.edges)}. ` +
      'What is the earliest time by which every task is finished?';
  },
  parse(statement) {
    const head = /^A project schedules the tasks ([A-Z]\(\d+\)(?:, [A-Z]\(\d+\))*)\. /.exec(statement);
    if (head === null) {
      throw new Error('the statement does not state the tasks and their durations');
    }
    if (!statement.endsWith('What is the earliest time by which every task is finished?')) {
      throw new Error('the statement does not ask for the earliest finish time');
    }
    return { tasks: parseTasks(head[1]), edges: parseEdges(statement) };
  },
  /** Independent oracle: the longest path through the DAG, by memoized recursion. */
  solve(slots) {
    return { finish: scheduleFinish(slots.tasks, slots.edges) };
  },
  render(solution) {
    return `The earliest finish time is ${solution.finish} minutes.`;
  },
  wires: [FINISHES_WIRE, LATEST_WIRE],
  compute: [
    'const slots = $slots;',
    'const latest = $latest;',
    'probe(Number.isInteger(latest) && latest > 0, "the earliest finish time must be a positive whole number of minutes");',
    'return "The earliest finish time is " + latest + " minutes.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The statement hands ${slots.tasks.length} tasks and ${slots.edges.length} precedence pairs to the schedule.`,
      `A task can only start once every task that must finish before it has finished, so the completion time is the longest chain of dependent tasks, not the sum of all durations.`,
      `The longest chain takes ${solution.finish} minutes, which is the earliest time by which every task is finished.`
    ];
  }
};

/** The latent plan: compute the completion time, then test it against a deadline. */
const scheduleDeadlineFeasible = {
  id: 'schedule-deadline-feasibility',
  name: 'Schedule Deadline Feasibility',
  type: 'schedule-deadline-feasibility',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 3, branching: 1, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    // The deadline is drawn on one side of the finish time, never exactly on it,
    // so the verdict is determined by the schedule and both verdicts occur.
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const schedule = drawSchedule(random);
      const finish = scheduleFinish(schedule.tasks, schedule.edges);
      const offset = 1 + Math.floor(random() * 6);
      const deadline = random() < 0.5 ? finish - offset : finish + offset;
      if (deadline <= 0) {
        continue;
      }
      return { ...schedule, deadline };
    }
    throw new Error('the sampler could not draw a deadline on one side of the finish time');
  },
  statement(slots) {
    return `A project schedules the tasks ${renderTasks(slots.tasks)}. ` +
      `${renderEdges(slots.edges)}. ` +
      `The deadline is ${slots.deadline} minutes. ` +
      'Can every task be finished by the deadline?';
  },
  parse(statement) {
    const head = /^A project schedules the tasks ([A-Z]\(\d+\)(?:, [A-Z]\(\d+\))*)\. /.exec(statement);
    const deadline = /The deadline is (\d+) minutes\. /.exec(statement);
    if (head === null || deadline === null) {
      throw new Error('the statement does not state the tasks, the precedence pairs, and the deadline');
    }
    if (!statement.endsWith('Can every task be finished by the deadline?')) {
      throw new Error('the statement does not ask whether the schedule meets the deadline');
    }
    return { tasks: parseTasks(head[1]), edges: parseEdges(statement), deadline: Number(deadline[1]) };
  },
  /** Independent oracle: the same recursive longest path, compared with the deadline. */
  solve(slots) {
    const finish = scheduleFinish(slots.tasks, slots.edges);
    return { finish, deadline: slots.deadline, feasible: finish <= slots.deadline };
  },
  render(solution) {
    return solution.feasible
      ? `Yes, the tasks finish at ${solution.finish} minutes, within the ${solution.deadline}-minute deadline.`
      : `No, the tasks finish at ${solution.finish} minutes, past the ${solution.deadline}-minute deadline.`;
  },
  wires: [FINISHES_WIRE, LATEST_WIRE],
  compute: [
    'const slots = $slots;',
    'const latest = $latest;',
    'probe(Number.isInteger(latest) && latest > 0, "the earliest finish time must be a positive whole number of minutes");',
    'if (latest <= slots.deadline) {',
    '  return "Yes, the tasks finish at " + latest + " minutes, within the " + slots.deadline + "-minute deadline.";',
    '}',
    'return "No, the tasks finish at " + latest + " minutes, past the " + slots.deadline + "-minute deadline.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The schedule finishes at ${solution.finish} minutes, which is the longest chain of dependent tasks.`,
      `The stated deadline is ${solution.deadline} minutes, so the plan is ${solution.feasible ? 'feasible' : 'not feasible'}.`,
      `The verdict follows the completion time alone: the deadlines of individual tasks are not part of the statement.`
    ];
  }
};

/** The latent plan: find every task that must finish before one named task, then count them. */
const taskPrerequisiteCount = {
  id: 'task-prerequisite-count',
  name: 'Task Prerequisite Count',
  type: 'task-prerequisite-count',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    const schedule = drawSchedule(random);
    const target = schedule.tasks[Math.floor(random() * schedule.tasks.length)].name;
    return { tasks: schedule.tasks, edges: schedule.edges, target };
  },
  statement(slots) {
    return `A project schedules the tasks ${renderTasks(slots.tasks)}. ` +
      `${renderEdges(slots.edges)}. ` +
      `How many tasks must finish before task ${slots.target} can start?`;
  },
  parse(statement) {
    const head = /^A project schedules the tasks ([A-Z]\(\d+\)(?:, [A-Z]\(\d+\))*)\. /.exec(statement);
    const target = /How many tasks must finish before task ([A-Z]) can start\?/.exec(statement);
    if (head === null || target === null) {
      throw new Error('the statement does not state the tasks, the precedence pairs, and the target task');
    }
    return { tasks: parseTasks(head[1]), edges: parseEdges(statement), target: target[1] };
  },
  /** Independent oracle: recursive walk of the reversed graph from the target. */
  solve(slots) {
    const beforeOf = new Map(slots.tasks.map((task) => [task.name, []]));
    for (const [before, after] of slots.edges) {
      beforeOf.get(after).push(before);
    }
    const reach = new Set([slots.target]);
    const visit = (name) => {
      for (const before of beforeOf.get(name)) {
        if (!reach.has(before)) {
          reach.add(before);
          visit(before);
        }
      }
    };
    visit(slots.target);
    reach.delete(slots.target);
    return { count: reach.size, target: slots.target };
  },
  render(solution) {
    if (solution.count === 0) {
      return `No task must finish before task ${solution.target} can start.`;
    }
    if (solution.count === 1) {
      return `1 task must finish before task ${solution.target} can start.`;
    }
    return `${solution.count} tasks must finish before task ${solution.target} can start.`;
  },
  wires: [
    {
      name: 'blocking',
      command: 'jsEval',
      body: [
        'const slots = $slots;',
        'probe(Array.isArray(slots.tasks) && slots.tasks.length > 0, "the plan must schedule at least one task");',
        'probe(Array.isArray(slots.edges), "the plan must state the precedence pairs");',
        'probe(slots.tasks.some((task) => task.name === slots.target), "the target task must be one of the scheduled tasks");',
        'const beforeOf = {};',
        'for (const task of slots.tasks) {',
        '  beforeOf[task.name] = [];',
        '}',
        'for (const edge of slots.edges) {',
        '  beforeOf[edge[1]].push(edge[0]);',
        '}',
        'const seen = new Set([slots.target]);',
        'const queue = [slots.target];',
        'while (queue.length > 0) {',
        '  const name = queue.shift();',
        '  for (const before of beforeOf[name]) {',
        '    if (!seen.has(before)) {',
        '      seen.add(before);',
        '      queue.push(before);',
        '    }',
        '  }',
        '}',
        'seen.delete(slots.target);',
        'return [...seen];'
      ].join('\n')
    },
    {
      name: 'count',
      command: 'aggregate',
      body: ['source: $blocking', 'op: count'].join('\n')
    }
  ],
  compute: [
    'const slots = $slots;',
    'const count = $count;',
    'probe(Number.isInteger(count) && count >= 0 && count < slots.tasks.length, "the prerequisite count must be a whole number below the task count");',
    'if (count === 0) {',
    '  return "No task must finish before task " + slots.target + " can start.";',
    '}',
    'if (count === 1) {',
    '  return "1 task must finish before task " + slots.target + " can start.";',
    '}',
    'return count + " tasks must finish before task " + slots.target + " can start.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `Task ${slots.target} can start only after every task that must finish before it has finished, directly or transitively.`,
      `Walking the precedence pairs backwards from ${slots.target} reaches ${solution.count} task${solution.count === 1 ? '' : 's'}.`,
      `That is the count of tasks that must finish before task ${slots.target} can start.`
    ];
  }
};

/** The latent plan: a route's capacity is the narrowest of its links in series. */
const routeBottleneckCapacity = {
  id: 'route-bottleneck-capacity',
  name: 'Route Bottleneck Capacity',
  type: 'route-bottleneck-capacity',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 0, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    const linkCount = 3 + Math.floor(random() * 4);
    const capacities = [];
    for (let index = 0; index < linkCount; index += 1) {
      capacities.push(2 + Math.floor(random() * 19));
    }
    return { capacities };
  },
  statement(slots) {
    return `A route is made of links in series. The links have capacities ${renderNumbers(slots.capacities)} units. ` +
      'What is the bottleneck capacity of the route?';
  },
  parse(statement) {
    const capacities = /The links have capacities ([0-9, ]+ and \d+|\d+) units\./.exec(statement);
    if (capacities === null) {
      throw new Error('the statement does not state the link capacities');
    }
    if (!statement.endsWith('What is the bottleneck capacity of the route?')) {
      throw new Error('the statement does not ask for the bottleneck capacity');
    }
    const values = parseNumbers(capacities[1]);
    if (values.length === 0 || values.some((value) => !Number.isInteger(value) || value <= 0)) {
      throw new Error('the statement does not state positive whole link capacities');
    }
    return { capacities: values };
  },
  /** Independent oracle: the minimum by a plain loop over the capacities. */
  solve(slots) {
    let bottleneck = slots.capacities[0];
    for (const capacity of slots.capacities) {
      if (capacity < bottleneck) {
        bottleneck = capacity;
      }
    }
    return { bottleneck };
  },
  render(solution) {
    return `The bottleneck capacity of the route is ${solution.bottleneck} units.`;
  },
  wires: [
    {
      name: 'bottleneck',
      command: 'aggregate',
      body: ['source: $slots.capacities', 'op: min'].join('\n')
    }
  ],
  compute: [
    'const slots = $slots;',
    'const bottleneck = $bottleneck;',
    'probe(Number.isInteger(bottleneck) && bottleneck > 0, "the bottleneck capacity must be a positive whole number");',
    'return "The bottleneck capacity of the route is " + bottleneck + " units.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The ${slots.capacities.length} links run in series, so the route can pass no more than its narrowest link.`,
      `The capacities are ${slots.capacities.join(', ')}, and the smallest is ${solution.bottleneck}.`,
      `The bottleneck capacity of the route is therefore ${solution.bottleneck} units, the minimum rather than the sum.`
    ];
  }
};

export const schedulingFamilies = [scheduleFinishTime, scheduleDeadlineFeasible, taskPrerequisiteCount, routeBottleneckCapacity];
