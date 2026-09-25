/**
 * Book-shape families of the procedural arithmetic source: the dv6 tranche.
 *
 * The dv4 scheduling tranche split the decompose-to-solve book's weighted
 * critical path into named stages (a `finishes` jsEval wire, an `aggregate`
 * summary wire), and the dv5 contrastive tranche taught decisive-word pairs.
 * Neither moved the book holdout: exp-018 still scores 0/100 on
 * decompose-to-solve and 0/20 on world-as-a-system, all of it execution errors
 * and mismatches, because the book families that fail are NOT stage-split
 * circuits — they are single jsEval bodies of 8 to 33 lines that run one
 * specific plan shape (a parallel join with a buffer, a subset enumeration, a
 * per-route two-aggregation summary, an evidence elimination). This tranche
 * stops simplifying the shapes and mirrors the actual book bodies instead.
 *
 * Four families, one per measured shape, each with the real body's stage count
 * and constraint kinds:
 *
 * - `dependency-chain-join` — decompose-to-solve pattern 4: a fixed five-package
 *   chain A -> (B | C) -> D -> E, where the parallel branches collapse to their
 *   maximum, a mandatory buffer is added, and one number is tested against a
 *   deadline. The holdout for this shape is 100 items at 0% oracle match.
 * - `minimal-winning-coalition` — world-as-a-system family N21: enumerate every
 *   non-empty subset of the groups, keep the ones whose seats reach the
 *   threshold, drop the ones that lose a member without losing the majority, and
 *   print the survivors. 20 holdout items, 0% oracle match.
 * - `route-summary-selection` — decompose-to-solve pattern 7: three routes each
 *   summarized by two different aggregations (link times add, link capacities
 *   take a minimum), then the whole-route summaries are filtered by shared
 *   constraints and the fastest feasible route is chosen.
 * - `evidence-tree-elimination` — decompose-to-solve pattern 6: three competing
 *   hypotheses and four observations, each observation routed to the one
 *   hypothesis it can discriminate, the contradicted hypotheses eliminated, and
 *   the one survivor reported.
 *
 * The samplers keep every arithmetic integer-exact and every draw feasible on
 * purpose: the oracle, the circuit, and the printed answer must agree exactly,
 * and a draw with no minimal coalition or no feasible route is not a value the
 * plan can return. Where the book's own body would throw on an impossible
 * instance, the sampler here refuses to draw it, so the honest answer is always
 * a value and never an execution error. The oracle of each family is a genuinely
 * different algorithm from its circuit body: recursion where the body uses a
 * bitmask, plain loops where the body uses `reduce`/`Math.min`.
 */

const SUBJECTS = ['goods', 'mail', 'produce', 'freight', 'supplies'];
const DOMAINS = ['a warehouse', 'a loading dock', 'a dispatch depot', 'a freight yard'];
const WORK_NOUNS = ['shipments', 'packages', 'batches', 'invoices', 'consignments'];
const COMMENTS = ['the team was busy', 'the supervisor was away', 'the shift ran long', 'the weather was poor'];

/** An integer in [low, high], both inclusive. */
function intBetween(random, low, high) {
  return low + Math.floor(random() * (high - low + 1));
}

/**
 * The dependency-chain-join shape: A -> (B | C) -> D -> E with a buffer.
 *
 * The body mirrors decompose-to-solve pattern 4 exactly: `Math.max` collapses
 * the two parallel branches, the four chain legs and the buffer are summed into
 * one number, and that number is compared with the limit. The oracle reaches the
 * same value by a different route: it takes the longer of B and C by a plain
 * comparison, then adds the chain legs one at a time.
 */
const dependencyChainJoin = {
  id: 'dependency-chain-join',
  name: 'Dependency Chain Join',
  type: 'dependency-chain-join',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 3, branching: 1, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    // The deadline is drawn on one side of the finish time, never exactly on it,
    // so the verdict is determined by the chain and both verdicts occur.
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const aMinutes = intBetween(random, 3, 12);
      const bMinutes = intBetween(random, 3, 12);
      const cMinutes = intBetween(random, 3, 12);
      const dMinutes = intBetween(random, 3, 12);
      const eMinutes = intBetween(random, 3, 12);
      const bufferMinutes = intBetween(random, 2, 6);
      const joinMinutes = Math.max(bMinutes, cMinutes);
      const minutes = aMinutes + joinMinutes + dMinutes + eMinutes + bufferMinutes;
      const offset = 1 + Math.floor(random() * 8);
      const limitMinutes = random() < 0.5 ? minutes - offset : minutes + offset;
      if (limitMinutes <= 0) {
        continue;
      }
      return { aMinutes, bMinutes, cMinutes, dMinutes, eMinutes, bufferMinutes, limitMinutes };
    }
    throw new Error('the sampler could not draw a deadline on one side of the finish time');
  },
  statement(slots) {
    return `A project runs five work packages in a chain. A takes ${slots.aMinutes} minutes. ` +
      `B (${slots.bMinutes} min) and C (${slots.cMinutes} min) can start only after A but may then run in parallel. ` +
      `D (${slots.dMinutes} min) needs both B and C finished. E (${slots.eMinutes} min) follows D. ` +
      `A final safety buffer of ${slots.bufferMinutes} minutes is mandatory, and the completion limit is ${slots.limitMinutes} minutes. ` +
      'What is the earliest safe completion time, and is the plan feasible?';
  },
  parse(statement) {
    const a = /A takes (\d+) minutes\./.exec(statement);
    const parallel = /B \((\d+) min\) and C \((\d+) min\) can start only after A but may then run in parallel\./.exec(statement);
    const d = /D \((\d+) min\) needs both B and C finished\./.exec(statement);
    const e = /E \((\d+) min\) follows D\./.exec(statement);
    const buffer = /A final safety buffer of (\d+) minutes is mandatory, and the completion limit is (\d+) minutes\./.exec(statement);
    if (a === null || parallel === null || d === null || e === null || buffer === null) {
      throw new Error('the statement does not state the five work packages, the parallel branches, and the buffer with the limit');
    }
    if (!statement.endsWith('What is the earliest safe completion time, and is the plan feasible?')) {
      throw new Error('the statement does not ask for the earliest safe completion time and feasibility');
    }
    return {
      aMinutes: Number(a[1]),
      bMinutes: Number(parallel[1]),
      cMinutes: Number(parallel[2]),
      dMinutes: Number(d[1]),
      eMinutes: Number(e[1]),
      bufferMinutes: Number(buffer[1]),
      limitMinutes: Number(buffer[2])
    };
  },
  /** Independent oracle: the join by a plain comparison, the chain legs added one at a time. */
  solve(slots) {
    const joinMinutes = slots.bMinutes >= slots.cMinutes ? slots.bMinutes : slots.cMinutes;
    let minutes = slots.aMinutes + joinMinutes;
    minutes += slots.dMinutes;
    minutes += slots.eMinutes;
    minutes += slots.bufferMinutes;
    return { joinMinutes, minutes, feasible: minutes <= slots.limitMinutes };
  },
  render(solution) {
    return `The earliest safe completion time is ${solution.minutes} minutes, so the plan is ${solution.feasible ? 'feasible' : 'not feasible'}. ` +
      'The critical insight is that B and C are parallel branches whose maximum duration controls the join.';
  },
  compute: [
    'const slots = $slots;',
    'const joinMinutes = Math.max(slots.bMinutes, slots.cMinutes);',
    'const minutes = slots.aMinutes + joinMinutes + slots.dMinutes + slots.eMinutes + slots.bufferMinutes;',
    'probe(Number.isInteger(minutes) && minutes > 0, "the earliest safe completion time must be a positive whole number of minutes");',
    'return "The earliest safe completion time is " + minutes + " minutes, so the plan is " + (minutes <= slots.limitMinutes ? "feasible" : "not feasible") + ". The critical insight is that B and C are parallel branches whose maximum duration controls the join.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The chain starts with A (${slots.aMinutes} minutes), and B and C run in parallel after it, so only the longer branch matters: max(${slots.bMinutes}, ${slots.cMinutes}) = ${solution.joinMinutes} minutes.`,
      `The join D (${slots.dMinutes} minutes) can start once both branches finish, and E (${slots.eMinutes} minutes) follows D.`,
      `Adding the mandatory buffer of ${slots.bufferMinutes} minutes gives ${slots.aMinutes} + ${solution.joinMinutes} + ${slots.dMinutes} + ${slots.eMinutes} + ${slots.bufferMinutes} = ${solution.minutes} minutes.`,
      `Comparing that earliest safe time with the limit of ${slots.limitMinutes} minutes makes the plan ${solution.feasible ? 'feasible' : 'not feasible'}.`
    ];
  }
};

/** The number of minimal winning coalitions, by bitmask enumeration. Used only to reject an empty draw. */
function minimalWinningCount(groups, threshold) {
  const count = groups.length;
  let total = 0;
  for (let mask = 1; mask < (1 << count); mask += 1) {
    let seats = 0;
    for (let index = 0; index < count; index += 1) {
      if (mask & (1 << index)) {
        seats += groups[index].seats;
      }
    }
    if (seats < threshold) {
      continue;
    }
    const minimal = groups.every((group, index) => {
      if (!(mask & (1 << index))) {
        return true;
      }
      return seats - group.seats < threshold;
    });
    if (minimal) {
      total += 1;
    }
  }
  return total;
}

/** The canonical order both the oracle and the circuit print the coalitions in: fewer members first, then label order. */
function byCoalitionOrder(left, right) {
  if (left.label.length !== right.label.length) {
    return left.label.length - right.label.length;
  }
  return left.label.localeCompare(right.label);
}

/**
 * The minimal-winning-coalition shape: enumerate subsets, keep winning, keep minimal.
 *
 * The body mirrors world-as-a-system family N21: a bitmask walk of every
 * non-empty subset, a seat sum against the threshold, a minimality test that
 * removes each member, and the surviving labels printed in order. The oracle
 * enumerates the same subsets by recursion instead of bitmasks, so the two are
 * separate transcriptions of the one answer.
 */
const minimalWinningCoalition = {
  id: 'minimal-winning-coalition',
  name: 'Minimal Winning Coalition',
  type: 'minimal-winning-coalition',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 2, irrelevantInformation: 0, symbolicShare: 0.8 },
  sample(random) {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const groups = [
        { label: 'A', seats: intBetween(random, 5, 8) },
        { label: 'B', seats: intBetween(random, 3, 7) },
        { label: 'C', seats: intBetween(random, 2, 3) }
      ];
      const threshold = intBetween(random, 6, 9);
      if (minimalWinningCount(groups, threshold) === 0) {
        continue;
      }
      return { groups, threshold };
    }
    throw new Error('the sampler could not draw seats with a minimal winning coalition');
  },
  statement(slots) {
    const seats = slots.groups.map((group) => `${group.label}=${group.seats}`).join(', ');
    return `A council has three groups: ${seats}. ` +
      `A governing coalition needs at least ${slots.threshold} seats. ` +
      'A coalition is winning when the seats of its members reach the threshold, and a minimal winning coalition is winning but removing any member makes it lose. ' +
      'Which coalitions are minimal winning coalitions?';
  },
  parse(statement) {
    const facts = /A council has three groups: ([A-Z]=\d+(?:, [A-Z]=\d+)+)\./.exec(statement);
    const threshold = /A governing coalition needs at least (\d+) seats\./.exec(statement);
    if (facts === null || threshold === null) {
      throw new Error('the statement does not state the group seats and the governing threshold');
    }
    if (!statement.includes('minimal winning coalition is winning but removing any member makes it lose')) {
      throw new Error('the rules do not define a minimal winning coalition');
    }
    if (!statement.endsWith('Which coalitions are minimal winning coalitions?')) {
      throw new Error('the statement does not ask for the minimal winning coalitions');
    }
    const groups = [];
    for (const match of facts[1].matchAll(/([A-Z])=(\d+)/g)) {
      groups.push({ label: match[1], seats: Number(match[2]) });
    }
    return { groups, threshold: Number(threshold[1]) };
  },
  /** Independent oracle: recursive subset enumeration, then the same winning and minimal tests. */
  solve(slots) {
    const subsets = [];
    const build = (start, picked) => {
      if (picked.length > 0) {
        subsets.push(picked.slice());
      }
      for (let index = start; index < slots.groups.length; index += 1) {
        picked.push(index);
        build(index + 1, picked);
        picked.pop();
      }
    };
    build(0, []);
    const winning = [];
    for (const subset of subsets) {
      let seats = 0;
      for (const index of subset) {
        seats += slots.groups[index].seats;
      }
      if (seats < slots.threshold) {
        continue;
      }
      const minimal = subset.every((index) => seats - slots.groups[index].seats < slots.threshold);
      if (minimal) {
        winning.push({ label: subset.map((index) => slots.groups[index].label).join(''), seats });
      }
    }
    winning.sort(byCoalitionOrder);
    return { winning };
  },
  render(solution) {
    return `${solution.winning.map((coalition) => `${coalition.label} with ${coalition.seats} seats`).join('; ')}.`;
  },
  compute: [
    'const slots = $slots;',
    'const count = slots.groups.length;',
    'const winning = [];',
    'for (let mask = 1; mask < (1 << count); mask += 1) {',
    '  const members = [];',
    '  let seats = 0;',
    '  for (let index = 0; index < count; index += 1) {',
    '    if (mask & (1 << index)) {',
    '      members.push(slots.groups[index].label);',
    '      seats += slots.groups[index].seats;',
    '    }',
    '  }',
    '  if (seats < slots.threshold) { continue; }',
    '  const minimal = members.every((label) => seats - slots.groups.find((group) => group.label === label).seats < slots.threshold);',
    '  if (minimal) { winning.push({ label: members.join(""), seats: seats }); }',
    '}',
    'probe(winning.length > 0, "the stated seats must leave at least one minimal winning coalition");',
    'winning.sort((left, right) => left.label.length === right.label.length ? left.label.localeCompare(right.label) : left.label.length - right.label.length);',
    'return winning.map((coalition) => coalition.label + " with " + coalition.seats + " seats").join("; ") + ".";'
  ].join('\n'),
  explain(slots, solution) {
    const groupList = slots.groups.map((group) => `${group.label}=${group.seats}`).join(', ');
    return [
      `The council seats are ${groupList}, and a winning coalition must reach ${slots.threshold} seats.`,
      `Every non-empty subset is tested: the winning ones reach the threshold, and the minimal ones would fall below it again if any single member left.`,
      `The minimal winning coalitions are ${solution.winning.map((coalition) => `${coalition.label} (${coalition.seats} seats)`).join(', ')}.`
    ];
  }
};

/**
 * The route-summary-selection shape: two aggregations per route, then filter and pick.
 *
 * The body mirrors decompose-to-solve pattern 7: `reduce` adds the link times,
 * `Math.min` takes the bottleneck capacity, the whole-route summaries are
 * filtered by the shared flow and time constraints, and the fastest feasible
 * route wins. The oracle reaches the same summaries by plain loops, so the two
 * are separate transcriptions.
 */
const routeSummarySelection = {
  id: 'route-summary-selection',
  name: 'Route Summary Selection',
  type: 'route-summary-selection',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 3, branching: 2, irrelevantInformation: 0, symbolicShare: 0.85 },
  sample(random) {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const routes = ['A', 'B', 'C'].map((name) => {
        const linkCount = 3 + Math.floor(random() * 2);
        const times = [];
        const capacities = [];
        for (let index = 0; index < linkCount; index += 1) {
          times.push(intBetween(random, 2, 9));
          capacities.push(intBetween(random, 2, 9));
        }
        return { name, times, capacities };
      });
      const summaries = routes.map((route) => ({
        timeMinutes: route.times.reduce((total, minutes) => total + minutes, 0),
        bottleneck: Math.min(...route.capacities)
      }));
      const maxBottleneck = Math.max(...summaries.map((summary) => summary.bottleneck));
      const minTime = Math.min(...summaries.map((summary) => summary.timeMinutes));
      const maxTime = Math.max(...summaries.map((summary) => summary.timeMinutes));
      const requiredFlow = intBetween(random, 2, maxBottleneck);
      const limitMinutes = intBetween(random, minTime, maxTime);
      const feasibleCount = summaries.filter(
        (summary) => summary.bottleneck >= requiredFlow && summary.timeMinutes <= limitMinutes
      ).length;
      if (feasibleCount === 0) {
        continue;
      }
      return {
        subject: SUBJECTS[Math.floor(random() * SUBJECTS.length)],
        requiredFlow,
        limitMinutes,
        routes
      };
    }
    throw new Error('the sampler could not draw three routes with a feasible choice');
  },
  statement(slots) {
    const routes = slots.routes.map((route) =>
      `${route.name}: times [${route.times.join(', ')}] min, capacities [${route.capacities.join(', ')}]`
    ).join('; ');
    return `Three routes can move the same ${slots.subject}. ${routes}. ` +
      `The required flow is ${slots.requiredFlow} units and total route time must not exceed ${slots.limitMinutes} minutes. ` +
      'Which route should be chosen?';
  },
  parse(statement) {
    const subject = /Three routes can move the same ([a-z][a-z -]*)\./.exec(statement);
    const flow = /The required flow is (\d+) units and total route time must not exceed (\d+) minutes\./.exec(statement);
    if (subject === null || flow === null) {
      throw new Error('the statement does not state the moved subject, the required flow, and the time limit');
    }
    const routes = [];
    for (const match of statement.matchAll(/([ABC]): times \[(\d+(?:, \d+)*)\] min, capacities \[(\d+(?:, \d+)*)\]/g)) {
      const times = match[2].split(',').map((value) => Number(value.trim()));
      const capacities = match[3].split(',').map((value) => Number(value.trim()));
      if (times.length !== capacities.length) {
        throw new Error(`route ${match[1]} does not pair every link time with a link capacity`);
      }
      routes.push({ name: match[1], times, capacities });
    }
    if (routes.length !== 3) {
      throw new Error('the statement does not state three routes');
    }
    if (!statement.endsWith('Which route should be chosen?')) {
      throw new Error('the statement does not ask which route should be chosen');
    }
    return {
      subject: subject[1].trim(),
      requiredFlow: Number(flow[1]),
      limitMinutes: Number(flow[2]),
      routes
    };
  },
  /** Independent oracle: each route summarized by plain loops, then the feasible one with the smallest time. */
  solve(slots) {
    const summaries = [];
    for (const route of slots.routes) {
      let timeMinutes = 0;
      for (const minutes of route.times) {
        timeMinutes += minutes;
      }
      let bottleneck = route.capacities[0];
      for (const capacity of route.capacities) {
        if (capacity < bottleneck) {
          bottleneck = capacity;
        }
      }
      summaries.push({
        name: route.name,
        timeMinutes,
        bottleneck,
        feasible: bottleneck >= slots.requiredFlow && timeMinutes <= slots.limitMinutes
      });
    }
    const feasible = summaries.filter((summary) => summary.feasible);
    let chosen = feasible[0];
    for (const summary of feasible) {
      if (summary.timeMinutes < chosen.timeMinutes) {
        chosen = summary;
      }
    }
    return { summaries, chosen };
  },
  render(solution) {
    return `Choose Route ${solution.chosen.name}. ` +
      'The decomposition uses different aggregation operators for different meanings: sequential times add, serial capacities take a minimum, then shared constraints filter entire-route summaries.';
  },
  compute: [
    'const slots = $slots;',
    'const summaries = slots.routes.map((route) => ({',
    '  name: route.name,',
    '  timeMinutes: route.times.reduce((total, minutes) => total + minutes, 0),',
    '  bottleneck: Math.min(...route.capacities)',
    '}));',
    'const feasible = summaries.filter((summary) => summary.bottleneck >= slots.requiredFlow && summary.timeMinutes <= slots.limitMinutes);',
    'probe(feasible.length > 0, "at least one route must carry the required flow within the time limit");',
    'let chosen = feasible[0];',
    'for (const summary of feasible) {',
    '  if (summary.timeMinutes < chosen.timeMinutes) {',
    '    chosen = summary;',
    '  }',
    '}',
    'probe(chosen.bottleneck >= slots.requiredFlow, "the chosen route must carry the required flow");',
    'probe(chosen.timeMinutes <= slots.limitMinutes, "the chosen route must stay within the time limit");',
    'probe(feasible.every((summary) => summary.timeMinutes >= chosen.timeMinutes), "no feasible route may be faster than the chosen route");',
    'return "Choose Route " + chosen.name + ". The decomposition uses different aggregation operators for different meanings: sequential times add, serial capacities take a minimum, then shared constraints filter entire-route summaries.";'
  ].join('\n'),
  explain(slots, solution) {
    const details = solution.summaries.map(
      (summary) => `Route ${summary.name} takes ${summary.timeMinutes} minutes and is limited by its narrowest link at ${summary.bottleneck} units, so it is ${summary.feasible ? 'feasible' : 'not feasible'} for a flow of ${slots.requiredFlow} within ${slots.limitMinutes} minutes`
    ).join('; ');
    return [
      `The ${slots.subject} are decomposed into three route summaries: ${details}.`,
      'The two meanings are aggregated separately: the sequential link times add up, while the serial link capacities take a minimum because the narrowest link caps the whole route.',
      `The shared constraints then filter the whole-route summaries, and among the feasible routes Route ${solution.chosen.name} is the fastest at ${solution.chosen.timeMinutes} minutes, so it is the answer.`
    ];
  }
};

/** The claim kind a hypothesis statement makes, refusing a statement that names several. */
const KIND_PATTERNS = [
  ['capacity', /capacit/],
  ['ordering', /order|dependency/],
  ['measurement', /measurement|recording/]
];

/** The short label the printed answer uses for the surviving hypothesis. */
const KIND_LABELS = {
  capacity: 'capacity shortfall',
  ordering: 'dependency/order mistake',
  measurement: 'measurement error'
};

function classify(claim) {
  const kinds = KIND_PATTERNS.filter(([, pattern]) => pattern.test(claim)).map(([kind]) => kind);
  if (kinds.length !== 1) {
    throw new Error(`the hypothesis "${claim}" does not name exactly one of the capacity, ordering, and measurement claims`);
  }
  return kinds[0];
}

/** The claim text of a hypothesis kind over the handled noun, always classifying back to that kind. */
function claimFor(kind, noun) {
  if (kind === 'capacity') {
    return `the ${noun} handling had insufficient capacity`;
  }
  if (kind === 'ordering') {
    return `the ${noun} steps ran in the wrong order`;
  }
  return `a measurement error slipped into the ${noun} count`;
}

/**
 * The evidence-tree-elimination shape: route observations, eliminate, report the survivor.
 *
 * The body mirrors decompose-to-solve pattern 6: each observation is routed to
 * the one hypothesis it can discriminate, the capacity and measurement
 * hypotheses are eliminated by the records that contradict them, the ordering
 * hypothesis survives its positive test, and the non-discriminating comment is
 * dropped. The surviving hypothesis's id varies because the three claims are
 * permuted across H1/H2/H3, but the survivor is always the ordering claim —
 * exactly as in the book, whose variants change the domain phrase and numbers
 * but never the method.
 */
const evidenceTreeElimination = {
  id: 'evidence-tree-elimination',
  name: 'Evidence Tree Elimination',
  type: 'evidence-tree-elimination',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 3, branching: 2, irrelevantInformation: 1, symbolicShare: 0.8 },
  sample(random) {
    const failureCount = intBetween(random, 4, 20);
    const availableUnits = failureCount + intBetween(random, 1, 10);
    const kinds = ['capacity', 'ordering', 'measurement'];
    for (let index = kinds.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [kinds[index], kinds[swap]] = [kinds[swap], kinds[index]];
    }
    const noun = WORK_NOUNS[Math.floor(random() * WORK_NOUNS.length)];
    const hypotheses = kinds.map((kind, index) => ({ id: `H${index + 1}`, claim: claimFor(kind, noun), kind }));
    return {
      domain: DOMAINS[Math.floor(random() * DOMAINS.length)],
      workNoun: noun,
      failureCount,
      hypotheses,
      observations: [
        { kind: 'capacity-availability', availableUnits },
        { kind: 'ordering-violation' },
        { kind: 'measurement-reproduction' },
        { kind: 'testimony', comment: COMMENTS[Math.floor(random() * COMMENTS.length)] }
      ]
    };
  },
  statement(slots) {
    const hypotheses = slots.hypotheses.map((hypothesis) => `${hypothesis.id} - ${hypothesis.claim}`).join('; ');
    const capacity = slots.observations.find((observation) => observation.kind === 'capacity-availability');
    const testimony = slots.observations.find((observation) => observation.kind === 'testimony');
    return `Scenario. In ${slots.domain}, a failure occurred while handling ${slots.failureCount} ${slots.workNoun}. ` +
      `${hypotheses}. ` +
      `The capacity log shows at least ${capacity.availableUnits} units were available throughout. ` +
      'A time-stamped record shows a dependent action occurred before its prerequisite had been completed. ' +
      'An independent record reproduces the measured quantity within the stated tolerance. ' +
      `A separate comment says ${testimony.comment}; this may be true but does not discriminate among the three hypotheses. ` +
      'Which hypothesis is the best-supported explanation?';
  },
  parse(statement) {
    const scenario = /^Scenario\. In (.+?), a failure occurred while handling (\d+) ([^.]+)\./.exec(statement);
    if (scenario === null) {
      throw new Error('the statement does not name the domain, the handled count, and the handled noun');
    }
    const hypotheses = [];
    for (const match of statement.matchAll(/H(\d+)\s*[-–—]\s*([^;.]+)/g)) {
      hypotheses.push({ id: `H${match[1]}`, claim: match[2].trim(), kind: classify(match[2]) });
    }
    if (hypotheses.length !== 3) {
      throw new Error('the statement does not propose exactly three hypotheses');
    }
    const capacity = /The capacity log shows at least (\d+) units were available throughout\./.exec(statement);
    if (capacity === null) {
      throw new Error('the statement does not report the available capacity');
    }
    if (!statement.includes('A time-stamped record shows a dependent action occurred before its prerequisite had been completed.')) {
      throw new Error('the statement does not report the time-stamped ordering record');
    }
    if (!statement.includes('An independent record reproduces the measured quantity within the stated tolerance.')) {
      throw new Error('the statement does not report the independent reproduction');
    }
    const testimony = /A separate comment says ([^;]+); this may be true but does not discriminate among the three hypotheses\./.exec(statement);
    if (testimony === null) {
      throw new Error('the statement does not report the non-discriminating comment');
    }
    if (!statement.endsWith('Which hypothesis is the best-supported explanation?')) {
      throw new Error('the statement does not ask for the best-supported hypothesis');
    }
    return {
      domain: scenario[1].trim(),
      workNoun: scenario[3].trim(),
      failureCount: Number(scenario[2]),
      hypotheses,
      observations: [
        { kind: 'capacity-availability', availableUnits: Number(capacity[1]) },
        { kind: 'ordering-violation' },
        { kind: 'measurement-reproduction' },
        { kind: 'testimony', comment: testimony[1].trim() }
      ]
    };
  },
  /** Independent oracle: the elimination by Set membership, with the surviving hypothesis reported. */
  solve(slots) {
    const supported = new Set();
    const eliminated = new Set();
    const ignored = [];
    for (const observation of slots.observations) {
      if (observation.kind === 'capacity-availability') {
        if (observation.availableUnits >= slots.failureCount) {
          eliminated.add('capacity');
        } else {
          supported.add('capacity');
        }
      } else if (observation.kind === 'ordering-violation') {
        supported.add('ordering');
      } else if (observation.kind === 'measurement-reproduction') {
        eliminated.add('measurement');
      } else if (observation.kind === 'testimony') {
        ignored.push(observation.comment);
      }
    }
    const survivors = slots.hypotheses.filter(
      (hypothesis) => supported.has(hypothesis.kind) && !eliminated.has(hypothesis.kind)
    );
    const winner = survivors[0];
    return {
      hypothesisId: winner.id,
      label: KIND_LABELS[winner.kind],
      eliminated: slots.hypotheses.filter((hypothesis) => eliminated.has(hypothesis.kind)),
      supported: slots.hypotheses.filter((hypothesis) => supported.has(hypothesis.kind)),
      ignored
    };
  },
  render(solution) {
    return `${solution.hypothesisId}, the ${solution.label}, is the best-supported explanation. ` +
      'The decomposition is evidential: each observation is sent only to the hypothesis it can actually discriminate, then the hypothesis-level results are recombined.';
  },
  compute: [
    'const slots = $slots;',
    'const supported = [];',
    'const eliminated = [];',
    'for (const observation of slots.observations) {',
    '  if (observation.kind === "capacity-availability") {',
    '    if (observation.availableUnits >= slots.failureCount) { eliminated.push("capacity"); } else { supported.push("capacity"); }',
    '  } else if (observation.kind === "ordering-violation") {',
    '    supported.push("ordering");',
    '  } else if (observation.kind === "measurement-reproduction") {',
    '    eliminated.push("measurement");',
    '  } else {',
    '  }',
    '}',
    'const survivors = slots.hypotheses.filter((hypothesis) => supported.includes(hypothesis.kind) && !eliminated.includes(hypothesis.kind));',
    'probe(survivors.length === 1, "exactly one hypothesis must survive the discriminating observations");',
    'const labels = { capacity: "capacity shortfall", ordering: "dependency/order mistake", measurement: "measurement error" };',
    'const winner = survivors[0];',
    'probe(typeof labels[winner.kind] === "string", "the surviving hypothesis must be a known claim");',
    'return winner.id + ", the " + labels[winner.kind] + ", is the best-supported explanation. The decomposition is evidential: each observation is sent only to the hypothesis it can actually discriminate, then the hypothesis-level results are recombined.";'
  ].join('\n'),
  explain(slots, solution) {
    const eliminated = solution.eliminated.map((hypothesis) => `${hypothesis.id} (${hypothesis.claim})`).join(' and ');
    return [
      `The scenario handles ${slots.failureCount} ${slots.workNoun} under three hypotheses, so the evidence tree gives every observation one job instead of letting each one speak to all three claims.`,
      `The capacity log and the independent reproduction within tolerance are the discriminating records that eliminate ${eliminated}.`,
      `The time-stamped record of a dependent action taken before its prerequisite is the one observation that positively tests ${solution.hypothesisId}, so that hypothesis survives.`,
      `The remark that ${solution.ignored[0] ?? 'tests nothing'} tests nothing, and recombining the hypothesis-level verdicts leaves ${solution.hypothesisId} — the ${solution.label} — as the best-supported explanation.`
    ];
  }
};

export const bookShapeFamilies = [
  dependencyChainJoin,
  minimalWinningCoalition,
  routeSummarySelection,
  evidenceTreeElimination
];
