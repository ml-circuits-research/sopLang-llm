# wire-discovery: shipped-circuit shape analysis

Run: 2026-09-25T05:15:24.719Z

## Measured totals

- solution.sop files scanned: **10360**
- jsEval bodies scanned: **11240**
- distinct shapes found: **1001**

| command | count | share of wires |
|---|---|---|
| jsEval | 11240 | 50.7% |
| literal | 10470 | 47.3% |
| aggregate | 240 | 1.1% |
| graphPath | 160 | 0.7% |
| fraction | 40 | 0.2% |

| wires per circuit | circuits | share |
|---|---|---|
| 2 | 9570 | 92.4% |
| 3 | 190 | 1.8% |
| 4 | 560 | 5.4% |
| 5 | 40 | 0.4% |

## Error-class correlation (holdout)

- holdout items: **705** — answer_match 436, answer_mismatch 83, execution_error 186, other 0
- failing holdout items: **269** of 705
- shipped shapes contained in any holdout program: **11** of 1001
- (shape, item) containment matches: **440**
- failing containment matches: **0**

Because failing containment is 0, the error-share factor is 0 for every shape; no whole-body shape occurs in a failing holdout program, so the ranking below reduces to frequency x mean-lines.

## Top 20 shapes (frequency x mean-lines x error-share)

### 1. `f569487dd2cb`

- frequency: **100**
- mean lines: **46.00**
- frequency x lines: **4600.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
probe(Number.isInteger(slots.localUnits) && slots.localUnits > 0, "the local demand must be a positive whole number");
probe(slots.factor > 0, "the conversion factor must be positive");
probe(Number.isInteger(slots.lossPercent) && slots.lossPercent > 0 && slots.lossPercent < 100, "the process loss must be a whole percent below 100");
probe(Number.isInteger(slots.capacity) && slots.capacity > 0, "the batch capacity must be a positive whole number");
probe(Number.isInteger(slots.parallelBatches) && slots.parallelBatches > 0, "the parallel batch capacity must be a positive whole number");
probe(Number.isInteger(slots.waveMinutes) && slots.waveMinutes > 0, "the wave time must be a positive whole number of minutes");
probe(Number.isInteger(slots.setupMinutes) && slots.setupMinutes >= 0, "the setup time must be a whole number of minutes");
probe(Number.isInteger(slots.bufferMinutes) && slots.bufferMinutes >= 0, "the buffer must be a whole number of minutes");
probe(Number.isInteger(slots.batchSlots) && slots.batchSlots > 0, "the batch slots must be a positive whole number");
probe(Number.isInteger(slots.fixedCost) && slots.fixedCost > 0, "the fixed cost must be a positive whole number");
probe(slots.ratePerUnit > 0, "the per-unit rate must be positive");
probe(Number.isInteger(slots.deadlineMinutes) && slots.deadlineMinutes > 0, "the deadline must be a positive whole number of minutes");
probe(slots.budgetUnits > 0, "the budget must be positive");
const preLossTenthsOf = (preLoss) => {
  const scaled = preLoss * 10;
  const lower = Math.floor(scaled);
  if (Math.abs(scaled - lower - 0.5) < 1e-9 && lower % 2 === 0) {
    return lower;
  }
  return Math.round(scaled);
};
const preLoss = slots.localUnits * slots.factor / (1 - slots.lossPercent / 100);
probe(preLoss > 0, "the pre-loss demand must be positive");
const preLossTenths = preLossTenthsOf(preLoss);
const batches = Math.ceil(preLossTenths / (slots.capacity * 10));
probe(batches === Math.ceil(preLoss / slots.capacity), "the one-decimal display must not change the whole-batch requirement");
probe(batches > 0, "the demand must require at least one batch");
const waves = Math.ceil(batches / slots.parallelBatches);
probe(waves * slots.parallelBatches >= batches, "the waves must cover every batch");
const minutes = waves * slots.waveMinutes + slots.setupMinutes + slots.bufferMinutes;
probe(minutes >= slots.setupMinutes + slots.bufferMinutes, "the elapsed time must include the setup and the buffer");
const cost = slots.fixedCost + slots.ratePerUnit * preLoss;
probe(cost >= slots.fixedCost, "the cost must include the fixed charge");
const capacityOk = batches <= slots.batchSlots;
const timeOk = minutes <= slots.deadlineMinutes;
const budgetOk = cost <= slots.budgetUnits;
const feasible = capacityOk && timeOk && budgetOk;
const failing = (capacityOk ? 0 : 1) + (timeOk ? 0 : 1) + (budgetOk ? 0 : 1);
probe(feasible === (failing === 0), "the verdict must be feasible exactly when no hard constraint fails");
const preLossText = Math.floor(preLossTenths / 10) + "." + (preLossTenths % 10);
const costText = cost.toFixed(2);
return "The plan is " + (feasible ? "feasible" : "not feasible") + ". Its key summaries are " + preLossText +
  " pre-loss standard units, " + batches + " batches, " + minutes + " minutes, and " + costText + " cost units. " +
  "The cost applies the stated per-unit rate to the pre-loss demand, the one quantity that every capacity " +
  "and variable-cost step shares.";
```

### 2. `dc99299c2b18`

- frequency: **80**
- mean lines: **37.00**
- frequency x lines: **2960.0**
- distinct families: **2**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
probe(Array.isArray(slots.tasks) && slots.tasks.length > 0, "the plan must schedule at least one task");
probe(Array.isArray(slots.edges), "the plan must state the precedence pairs");
const duration = {};
const indegree = {};
const after = {};
for (const task of slots.tasks) {
  duration[task.name] = task.duration;
  indegree[task.name] = 0;
  after[task.name] = [];
}
for (const edge of slots.edges) {
  indegree[edge[1]] += 1;
  after[edge[0]].push(edge[1]);
}
const starts = {};
for (const task of slots.tasks) {
  starts[task.name] = 0;
}
const ready = slots.tasks.filter((task) => indegree[task.name] === 0).map((task) => task.name);
const ordered = [];
while (ready.length > 0) {
  const name = ready.shift();
  ordered.push(name);
  for (const next of after[name]) {
    const candidate = starts[name] + duration[name];
    if (candidate > starts[next]) {
      starts[next] = candidate;
    }
    indegree[next] -= 1;
    if (indegree[next] === 0) {
      ready.push(next);
    }
  }
}
probe(ordered.length === slots.tasks.length, "the precedence pairs must schedule every task");
return slots.tasks.map((task) => starts[task.name] + duration[task.name]);
```

### 3. `774b6d233d07`

- frequency: **100**
- mean lines: **26.00**
- frequency x lines: **2600.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
probe(Array.isArray(slots.routes) && slots.routes.length === 3, "the scenario must state three routes");
probe(Number.isInteger(slots.requiredFlow) && slots.requiredFlow > 0, "the required flow must be a positive whole number");
probe(Number.isInteger(slots.limitMinutes) && slots.limitMinutes > 0, "the route time limit must be a positive whole number");
for (const route of slots.routes) {
  probe(Array.isArray(route.times) && route.times.length === route.capacities.length, "every link time must be paired with a link capacity");
  probe(route.times.every((minutes) => Number.isInteger(minutes) && minutes > 0), "every link time must be a positive whole number");
  probe(route.capacities.every((capacity) => Number.isInteger(capacity) && capacity > 0), "every link capacity must be a positive whole number");
}
const summaries = slots.routes.map((route) => ({
  name: route.name,
  timeMinutes: route.times.reduce((total, minutes) => total + minutes, 0),
  bottleneck: Math.min(...route.capacities)
}));
const feasible = summaries.filter((summary) => summary.bottleneck >= slots.requiredFlow && summary.timeMinutes <= slots.limitMinutes);
probe(feasible.length > 0, "at least one route must carry the required flow within the time limit");
let chosen = feasible[0];
for (const summary of feasible) {
  if (summary.timeMinutes < chosen.timeMinutes) {
    chosen = summary;
  }
}
probe(chosen.bottleneck >= slots.requiredFlow, "the chosen route must carry the required flow");
probe(chosen.timeMinutes <= slots.limitMinutes, "the chosen route must stay within the time limit");
probe(feasible.every((summary) => summary.timeMinutes >= chosen.timeMinutes), "no feasible route may be faster than the chosen route");
return "Choose Route " + chosen.name + ". The decomposition uses different aggregation operators for different meanings: sequential times add, serial capacities take a minimum, then shared constraints filter entire-route summaries.";
```

### 4. `a1add07e0d2b`

- frequency: **100**
- mean lines: **26.00**
- frequency x lines: **2600.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
probe(Array.isArray(slots.hypotheses) && slots.hypotheses.length >= 2, "the scenario must propose several hypotheses");
probe(Array.isArray(slots.observations) && slots.observations.length > 0, "the scenario must list observations");
probe(Number.isInteger(slots.failureCount) && slots.failureCount > 0, "the handled count must be a positive whole number");
const ids = slots.hypotheses.map((hypothesis) => hypothesis.id);
probe(new Set(ids).size === ids.length, "each hypothesis must carry its own label");
const supported = [];
const eliminated = [];
for (const observation of slots.observations) {
  if (observation.kind === "capacity-availability") {
    probe(Number.isInteger(observation.availableUnits) && observation.availableUnits > 0, "the capacity log must state a positive number of available units");
    if (observation.availableUnits >= slots.failureCount) { eliminated.push("capacity"); } else { supported.push("capacity"); }
  } else if (observation.kind === "ordering-violation") {
    supported.push("ordering");
  } else if (observation.kind === "measurement-reproduction") {
    eliminated.push("measurement");
  } else {
    probe(observation.kind === "testimony", "the observation must name the claim it tests");
  }
}
const survivors = slots.hypotheses.filter((hypothesis) => supported.includes(hypothesis.kind) && !eliminated.includes(hypothesis.kind));
probe(survivors.length === 1, "exactly one hypothesis must survive the discriminating observations");
const labels = { capacity: "capacity shortfall", ordering: "dependency/order mistake", measurement: "measurement error" };
const winner = survivors[0];
probe(typeof labels[winner.kind] === "string", "the surviving hypothesis must be a known claim");
return winner.id + ", the " + labels[winner.kind] + ", is the best-supported explanation. The decomposition is evidential: each observation is sent only to the hypothesis it can actually discriminate, then the hypothesis-level results are recombined.";
```

### 5. `e1ee4a2cf41c`

- frequency: **100**
- mean lines: **24.00**
- frequency x lines: **2400.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
probe(Number.isInteger(slots.items) && slots.items > 0, "the workload must be a positive whole number of items");
const optionFields = ["A", "B"];
for (const label of optionFields) {
  const option = slots["option" + label];
  probe(Number.isInteger(option.setupMinutes) && option.setupMinutes > 0, "the setup time of Option " + label + " must be a positive whole number");
  probe(Number.isInteger(option.itemsPerCycle) && option.itemsPerCycle > 0, "the cycle capacity of Option " + label + " must be a positive whole number");
  probe(Number.isInteger(option.fixedCents) && option.fixedCents >= 0, "the fixed cost of Option " + label + " must be a whole number of units");
  probe(Number.isInteger(option.itemCents) && option.itemCents > 0, "the per-item cost of Option " + label + " must be a positive whole number of units");
}
probe(Number.isInteger(slots.limitMinutes) && slots.limitMinutes > 0, "the completion limit must be a positive whole number of minutes");
probe(Number.isInteger(slots.budgetCents) && slots.budgetCents > 0, "the cost ceiling must be a positive number of units");
const evaluate = (option) => ({ label: option.label, minutes: option.setupMinutes + Math.ceil(slots.items / option.itemsPerCycle) * 6, costCents: option.fixedCents + option.itemCents * slots.items });
const evaluated = [evaluate(slots.optionA), evaluate(slots.optionB)];
for (const option of evaluated) {
  option.feasible = option.minutes <= slots.limitMinutes && option.costCents <= slots.budgetCents;
}
const feasible = evaluated.filter((option) => option.feasible);
probe(feasible.length > 0, "the scenario asks for a selection, so at least one option must satisfy both shared constraints");
const chosen = feasible.reduce((best, option) => (option.costCents < best.costCents ? option : best));
probe(chosen.feasible, "the selected option must stay within the stated time limit and cost ceiling");
probe(feasible.every((option) => option.costCents >= chosen.costCents), "the selected option must be the cheapest feasible one");
probe(feasible.filter((option) => option.costCents === chosen.costCents).length === 1, "the preference rule needs a unique cheapest feasible option");
return "Choose Option " + chosen.label + ". The important architecture is “evaluate each option locally, then compare summaries under shared constraints,” rather than interleaving the arithmetic of both options.";
```

### 6. `4ebb350f24d0`

- frequency: **100**
- mean lines: **23.00**
- frequency x lines: **2300.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
const formatScore = (scaled) => {
  const sign = scaled < 0 ? "-" : "";
  const magnitude = Math.abs(scaled);
  return sign + Math.floor(magnitude / 10) + "." + (magnitude % 10);
};
const timeWeightScales = { 1: 10, 1.5: 15, 2: 20 };
const timeScale = timeWeightScales[slots.timeWeight];
probe(timeScale !== undefined, "the stated time weight must be one of 1, 1.5, 2");
probe(Number.isInteger(slots.qualityWeight) && slots.qualityWeight > 0, "the stated quality weight must be a positive whole number");
for (const side of ["A", "B"]) {
  probe(Number.isInteger(slots["cost" + side]) && slots["cost" + side] > 0, "the cost of configuration " + side + " must be a positive whole number");
  probe(Number.isInteger(slots["time" + side]) && slots["time" + side] > 0, "the time of configuration " + side + " must be a positive whole number");
  probe(Number.isInteger(slots["quality" + side]) && slots["quality" + side] >= 0 && slots["quality" + side] <= 100, "the quality score of configuration " + side + " must be a percentage");
}
const scoreA = slots.costA * 10 + timeScale * slots.timeA - slots.qualityWeight * 10 * slots.qualityA;
const scoreB = slots.costB * 10 + timeScale * slots.timeB - slots.qualityWeight * 10 * slots.qualityB;
const winner = scoreA <= scoreB ? "A" : "B";
const winnerScore = winner === "A" ? scoreA : scoreB;
const loserScore = winner === "A" ? scoreB : scoreA;
probe(winnerScore <= loserScore, "the winning coupled score must not exceed the losing one");
probe(Number.isInteger(winnerScore) && Number.isInteger(loserScore), "both coupled scores must be exact in tenths");
return "This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration " + winner + " wins because the predetermined combined score is " + formatScore(winnerScore) + " versus " + formatScore(loserScore) + ".";
```

### 7. `0dc1d90038a7`

- frequency: **120**
- mean lines: **18.00**
- frequency x lines: **2160.0**
- distinct families: **3**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
const values = slots.values;
probe(Array.isArray(values) && values.length > 0, "the records must be a non-empty list");
let current = values;
// stage 1: keepBelow
const kept0 = current.filter((value) => value < slots.threshold);
current = kept0;
// stage 2: count
const count1 = current.length;
current = count1;
// stage 3: elapsed
const adjusted2 = current * slots.per;
current = adjusted2;
// stage 4: addRate
const adjusted3 = current + slots.rate;
current = adjusted3;
probe(Number.isInteger(current) && current >= 0, "the answer must be a whole number that is not negative");
return current + " units.";
```

### 8. `fa29e28da3ce`

- frequency: **100**
- mean lines: **21.00**
- frequency x lines: **2100.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
const formatTenths = (tenths) => Math.floor(tenths / 10) + "." + (tenths % 10);
probe(Number.isInteger(slots.demand) && slots.demand > 0, "the expected demand must be a positive whole number");
probe(Number.isInteger(slots.errorPercent) && slots.errorPercent > 0, "the forecast error must be a positive whole number of percent");
probe(Number.isInteger(slots.marginPercent) && slots.marginPercent > 0, "the safety margin must be a positive whole number of percent");
for (const side of ["A", "B"]) {
  probe(Number.isInteger(slots["capacity" + side]) && slots["capacity" + side] > 0, "the capacity of option " + side + " must be a positive whole number");
  probe(Number.isInteger(slots["cost" + side]) && slots["cost" + side] > 0, "the cost of option " + side + " must be a positive whole number");
}
const scaled = slots.demand * (100 + slots.errorPercent) * (100 + slots.marginPercent);
const requirementTenths = Math.floor((scaled + 500) / 1000);
probe(requirementTenths > slots.demand * 10, "the robust requirement must exceed the average forecast");
const options = [
  { label: "A", capacity: slots.capacityA, cost: slots.costA },
  { label: "B", capacity: slots.capacityB, cost: slots.costB }
];
const feasible = options.filter((option) => option.capacity * 10 >= requirementTenths);
probe(feasible.length > 0, "at least one stated option must reach the robust requirement");
const chosen = feasible.reduce((best, option) => (option.cost < best.cost ? option : best));
probe(feasible.every((option) => option.cost >= chosen.cost), "the chosen option must have the lowest cost among the feasible ones");
return "The robust capacity requirement is " + formatTenths(requirementTenths) + ", and Option " + chosen.label + " is the lowest-cost option that meets it. The uncertainty interval and safety policy are separate transformations, which prevents double-counting the margin.";
```

### 9. `a0f2285f9b5d`

- frequency: **20**
- mean lines: **98.00**
- frequency x lines: **1960.0**
- distinct families: **4**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const describeCrossDomain = function describeCrossDomain(check) {
  if (check.kind === 'distance') {
    return `${check.centimetres * check.kilometresPerCentimetre} km.`;
  }
  if (check.kind === 'time') {
    const minutes = check.startHour * 60 + check.startMinute + check.hours * 60;
    const hour = String(Math.floor(minutes / 60)).padStart(2, '0');
    const minute = String(minutes % 60).padStart(2, '0');
    return `${hour}:${minute}.`;
  }
  if (check.kind === 'quorum') {
    return check.present >= check.threshold ? 'quorum is met.' : 'quorum is not met.';
  }
  if (check.kind === 'reports') {
    return `${check.total - check.duplicates} independent reports.`;
  }
  if (check.kind === 'sheets') {
    return `${check.start + check.received} map sheets.`;
  }
  throw new Error(`Unknown cross-domain check "${check.kind}".`);
};
const renderCrossDomain = function renderCrossDomain(checks) {
  if (checks === null || checks === undefined || checks.length === 0) {
    return '';
  }
  const parts = checks.map((check, index) => {
    const label = index === 1 ? 'Mixed-domain answer:' : 'Cross-domain answer:';
    return `${label} ${describeCrossDomain(check)}`;
  });
  return parts.join(' ');
};
const slots = $slots;
probe(typeof slots.kind === "string" && slots.kind.length > 0, "the compiled slots must name the meta-reasoning criterion");
let main;
if (slots.kind === "balance") {
  const locations = slots.locations;
  const questions = slots.questions;
  probe(Array.isArray(locations) && locations.length >= 2, "the statement must leave at least two possible locations");
  probe(Array.isArray(questions) && questions.length >= 2, "the statement must compare at least two questions");
  probe(questions.every((question) => question.options.length > 0 && question.options.every((option) => locations.includes(option))), "every question must ask about the stated possible locations");
  let best = questions[0];
  for (const question of questions.slice(1)) {
    const balance = Math.abs(2 * question.options.length - locations.length);
    const bestBalance = Math.abs(2 * best.options.length - locations.length);
    if (balance < bestBalance) {
      best = question;
    }
  }
  main = best.name + ".";
} else if (slots.kind === "robustness") {
  const intervals = slots.intervals;
  probe(Array.isArray(intervals) && intervals.length === 2, "the statement must state two score ranges");
  probe(intervals.every((interval) => interval.low <= interval.high), "every stated score range must be ordered");
  const robust = intervals[0].low > intervals[1].high;
  main = robust
    ? "Yes; the ranking " + intervals[0].name + ">" + intervals[1].name + " is robust across the stated ranges."
    : "No; the ranking is sensitive to the uncertainty.";
} else if (slots.kind === "counterexample") {
  const towns = slots.towns;
  probe(Array.isArray(towns) && towns.length >= 2, "the statement must describe at least two towns");
  probe(towns.every((town) => Number.isInteger(town.roads) && town.roads >= 0), "every town must state a road count");
  let pair = null;
  for (let i = 0; i < towns.length && pair === null; i += 1) {
    for (let j = i + 1; j < towns.length && pair === null; j += 1) {
      const left = towns[i];
      const right = towns[j];
      if (left.roads > right.roads && left.minutes >= right.minutes) {
        pair = [left.name, right.name];
      } else if (right.roads > left.roads && right.minutes >= left.minutes) {
        pair = [right.name, left.name];
      }
    }
  }
  main = pair === null ? "No; the stated towns agree with the claim." : "Yes. " + pair[0] + " and " + pair[1] + " form a counterexample.";
} else if (slots.kind === "causality") {
  probe(typeof slots.cause === "string" && slots.cause.length > 0, "the task must name the suspected cause");
  probe(typeof slots.effect === "string" && slots.effect.length > 0, "the task must name the suspected effect");
  probe(slots.intervention === false, "the family answers only the variant that describes no intervention");
  main = "No. The association alone does not establish that " + slots.cause + " cause " + slots.effect + ".";
} else if (slots.kind === "dominance") {
  const plans = slots.plans;
  probe(Array.isArray(plans) && plans.length === 2, "the statement must compare exactly two plans");
  const first = plans[0];
  const second = plans[1];
  const atLeast = (left, right) => left.cost <= right.cost && left.minutes <= right.minutes && left.safety >= right.safety;
  const strictlyBetter = (left, right) => left.cost < right.cost || left.minutes < right.minutes || left.safety > right.safety;
  if (atLeast(first, second) && strictlyBetter(first, second)) {
    main = first.name + " Pareto-dominates " + second.name + ".";
  } else if (atLeast(second, first) && strictlyBetter(second, first)) {
    main = second.name + " Pareto-dominates " + first.name + ".";
  } else {
    main = "Neither plan dominates the other.";
  }
} else {
  throw new Error("unknown meta-reasoning criterion: " + slots.kind);
}
const suffix = renderCrossDomain(slots.crossDomain);
return suffix === "" ? main : main + " " + suffix;
```

### 10. `7197ae8b72dc`

- frequency: **50**
- mean lines: **39.00**
- frequency x lines: **1950.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
probe(Array.isArray(slots.scenarios) && slots.scenarios.length > 0, "the statement must name the scenarios");
probe(Array.isArray(slots.strategies) && slots.strategies.length > 0, "the statement must state the strategy outcomes");
probe(Number.isInteger(slots.threshold) && slots.threshold > 0, "the robustness threshold must be a positive integer");
const scenarioCount = slots.scenarios.length;
probe(Array.isArray(slots.probabilities) && slots.probabilities.length === scenarioCount, "the statement must state one probability per scenario");
let probabilitySum = 0;
for (const probability of slots.probabilities) {
  probe(Number.isInteger(probability) && probability > 0 && probability <= 100, "every scenario probability must be a positive percentage");
  probabilitySum += probability;
}
probe(probabilitySum === 100, "the scenario probabilities must sum to one hundred percent");
const labels = [];
const hundredths = {};
const minimums = {};
for (const strategy of slots.strategies) {
  probe(typeof strategy.label === "string" && strategy.label.length > 0, "every strategy must carry a label");
  probe(Array.isArray(strategy.outcomes) && strategy.outcomes.length === scenarioCount, "every strategy must carry one outcome per scenario");
  let total = 0;
  for (let index = 0; index < scenarioCount; index += 1) {
    const outcome = strategy.outcomes[index];
    probe(Number.isInteger(outcome) && outcome > 0, "every scenario outcome must be a positive integer");
    total += slots.probabilities[index] * outcome;
  }
  probe(hundredths[strategy.label] === undefined, "the strategy labels must be distinct");
  hundredths[strategy.label] = total;
  minimums[strategy.label] = Math.min(...strategy.outcomes);
  labels.push(strategy.label);
}
const acceptable = labels.filter((label) => minimums[label] >= slots.threshold);
const bestMean = acceptable.length === 0 ? 0 : Math.max(...acceptable.map((label) => hundredths[label]));
const winner = acceptable.find((label) => hundredths[label] === bestMean);
probe(acceptable.length === 0 || winner !== undefined, "the acceptable strategies must attain a largest weighted mean");
const format = (value) => {
  const tenths = Math.floor(value / 10);
  return Math.floor(tenths / 10) + "." + (tenths % 10);
};
const means = labels.map((label) => label + "=" + format(hundredths[label])).join(", ");
return "Weighted means: " + means + ". After the robustness threshold, the choice is " + (winner === undefined ? "none of the strategies" : winner) + ".";
```

### 11. `d9d9a4221cb9`

- frequency: **50**
- mean lines: **39.00**
- frequency x lines: **1950.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
probe(Array.isArray(slots.rules) && slots.rules.length > 0, "the statement must list at least one rule");
probe(slots.rules.every((rule) => Array.isArray(rule.conditions) && rule.conditions.length > 0 && rule.conclusion !== null && typeof rule.conclusion.name === "string"), "every rule must state conditions and a consequence");
probe(Array.isArray(slots.observed) && slots.observed.length > 0, "the statement must state the observed case");
probe(Array.isArray(slots.query) && slots.query.length > 0, "the question must name the indicators whose values follow");
probe(Number.isInteger(slots.askedRule), "the question must name the rule whose necessity is asked");
const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const facts = new Map();
for (const fact of slots.observed) {
  facts.set(fact.name, fact.value);
}
const applied = [];
let progressed = true;
while (progressed) {
  progressed = false;
  for (const rule of slots.rules) {
    if (applied.indexOf(rule.index) !== -1) {
      continue;
    }
    const holds = rule.conditions.every((condition) => facts.get(condition.name) === condition.value);
    if (!holds) {
      continue;
    }
    const known = facts.get(rule.conclusion.name);
    if (known !== undefined) {
      if (known !== rule.conclusion.value) {
        throw new Error("rule " + rule.index + " contradicts the known value of " + rule.conclusion.name);
      }
      continue;
    }
    facts.set(rule.conclusion.name, rule.conclusion.value);
    applied.push(rule.index);
    progressed = true;
  }
}
probe(slots.query.every((name) => facts.get(name) !== undefined), "the stated rules must pin down every queried value");
probe(applied.indexOf(slots.askedRule) === -1, "the asked rule must not be needed in this family");
const conclusions = slots.query.map((name) => name + " must be " + facts.get(name)).join("; ");
return conclusions + ". Rule " + slots.askedRule + " is not needed for these " + words[slots.query.length] + " conclusions in this case.";
```

### 12. `e4bafb930d35`

- frequency: **20**
- mean lines: **96.00**
- frequency x lines: **1920.0**
- distinct families: **4**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const describeCrossDomain = function describeCrossDomain(check) {
  if (check.kind === 'distance') {
    return `${check.centimetres * check.kilometresPerCentimetre} km.`;
  }
  if (check.kind === 'time') {
    const minutes = check.startHour * 60 + check.startMinute + check.hours * 60;
    const hour = String(Math.floor(minutes / 60)).padStart(2, '0');
    const minute = String(minutes % 60).padStart(2, '0');
    return `${hour}:${minute}.`;
  }
  if (check.kind === 'quorum') {
    return check.present >= check.threshold ? 'quorum is met.' : 'quorum is not met.';
  }
  if (check.kind === 'reports') {
    return `${check.total - check.duplicates} independent reports.`;
  }
  if (check.kind === 'sheets') {
    return `${check.start + check.received} map sheets.`;
  }
  throw new Error(`Unknown cross-domain check "${check.kind}".`);
};
const renderCrossDomain = function renderCrossDomain(checks) {
  if (checks === null || checks === undefined || checks.length === 0) {
    return '';
  }
  const parts = checks.map((check, index) => {
    const label = index === 1 ? 'Mixed-domain answer:' : 'Cross-domain answer:';
    return `${label} ${describeCrossDomain(check)}`;
  });
  return parts.join(' ');
};
const slots = $slots;
probe(Array.isArray(slots.links) && slots.links.length > 0, "the statement must state at least one parent link");
probe(typeof slots.subject === "string" && typeof slots.object === "string" && slots.subject !== slots.object, "the task must name two different people");
const parents = new Map();
const children = new Map();
const remember = (map, key, value) => {
  if (!map.has(key)) {
    map.set(key, new Set());
  }
  map.get(key).add(value);
};
for (const link of slots.links) {
  probe(typeof link.parent === "string" && typeof link.child === "string", "every stated link must name a parent and a child");
  remember(parents, link.child, link.parent);
  remember(children, link.parent, link.child);
}
const descendantsAt = (person, levels) => {
  let frontier = new Set([person]);
  for (let step = 0; step < levels; step += 1) {
    const next = new Set();
    for (const current of frontier) {
      for (const child of children.get(current) || []) {
        next.add(child);
      }
    }
    frontier = next;
  }
  return frontier;
};
const shareParent = (left, right) => {
  const leftParents = parents.get(left) || new Set();
  for (const parent of parents.get(right) || []) {
    if (leftParents.has(parent)) {
      return true;
    }
  }
  return false;
};
const left = slots.subject;
const right = slots.object;
const leftParents = parents.get(left) || new Set();
const rightParents = parents.get(right) || new Set();
let relation = null;
if (leftParents.has(right)) {
  relation = right + " is a parent of " + left + ".";
} else if (rightParents.has(left)) {
  relation = left + " is a parent of " + right + ".";
} else if (descendantsAt(left, 2).has(right)) {
  relation = left + " is a grandparent of " + right + ".";
} else if (descendantsAt(right, 2).has(left)) {
  relation = right + " is a grandparent of " + left + ".";
} else if (shareParent(left, right)) {
  relation = left + " and " + right + " are siblings.";
} else {
  for (const leftParent of leftParents) {
    for (const rightParent of rightParents) {
      if (leftParent !== rightParent && shareParent(leftParent, rightParent)) {
        relation = left + " and " + right + " are cousins under the implied family tree.";
      }
    }
  }
}
probe(relation !== null, "the stated links must determine the relation between the two named people");
const suffix = renderCrossDomain(slots.crossDomain);
return suffix === "" ? relation : relation + " " + suffix;
```

### 13. `8aae8452a2ab`

- frequency: **50**
- mean lines: **38.00**
- frequency x lines: **1900.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
probe(Number.isInteger(slots.probabilityPercent) && slots.probabilityPercent > 0 && slots.probabilityPercent < 100, "the probability must be a percentage below one hundred");
probe(Number.isInteger(slots.loss) && slots.loss > 0, "the loss must be a positive amount");
probe(Number.isInteger(slots.protectionCost) && slots.protectionCost > 0, "the protective measure must have a certain positive cost");
probe(Number.isInteger(slots.reductionPercent) && slots.reductionPercent > 0 && slots.reductionPercent < 100, "the reduction must keep part of the loss");
probe(Number.isInteger(slots.riskLimit) && slots.riskLimit > 0, "the risk limit must be a positive amount");
const roundHundredths = (numerator, denominator) => {
  let hundredths = Math.floor((numerator * 100) / denominator);
  const remainder = (numerator * 100) % denominator;
  if (2 * remainder > denominator || (2 * remainder === denominator && hundredths % 2 === 1)) {
    hundredths += 1;
  }
  return hundredths;
};
const formatHundredths = (hundredths) => {
  const whole = Math.floor(hundredths / 100);
  const rest = hundredths % 100;
  if (rest === 0) { return String(whole); }
  return whole + "." + String(rest).padStart(2, "0").replace(/0$/, "");
};
const expectedWithout = roundHundredths(slots.probabilityPercent * slots.loss, 100);
const expectedWith = roundHundredths(slots.protectionCost * 10000 + slots.probabilityPercent * slots.reductionPercent * slots.loss, 10000);
const adverseWithout = slots.loss * 100;
const adverseWith = slots.protectionCost * 100 + slots.reductionPercent * slots.loss;
const limit = slots.riskLimit * 100;
const acceptableWithout = adverseWithout <= limit;
const acceptableWith = adverseWith <= limit;
probe(adverseWith <= adverseWithout, "the protective measure must not increase the adverse-scenario loss");
probe(expectedWithout > 0 && expectedWith > 0, "both expected costs must be positive");
let justification = "neither option, because both violate the hard risk rule";
if (acceptableWithout && acceptableWith) {
  justification = expectedWith < expectedWithout ? "the protective measure" : "the option without protection";
} else if (acceptableWithout) {
  justification = "the option without protection";
} else if (acceptableWith) {
  justification = "the protective measure";
}
return "Expected cost without protection: " + formatHundredths(expectedWithout) + " CU; with protection: " + formatHundredths(expectedWith) + " CU. Under the hard risk rule, the justified choice is " + justification + ".";
```

### 14. `929d3f24ada4`

- frequency: **50**
- mean lines: **37.00**
- frequency x lines: **1850.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
probe(Array.isArray(slots.weights) && slots.weights.length > 0, "the statement must state the criterion weights");
probe(Array.isArray(slots.options) && slots.options.length > 0, "the statement must state the option scores");
probe(slots.scale !== null && typeof slots.scale === "object", "the statement must state the scoring scale");
const scale = slots.scale;
probe(Number.isInteger(scale.minimum) && Number.isInteger(scale.maximum) && scale.maximum > scale.minimum, "the scoring scale must be an ordered pair of integers");
const criteria = slots.weights.length;
let weightSum = 0;
for (const weight of slots.weights) {
  probe(Number.isInteger(weight.percent) && weight.percent > 0 && weight.percent <= 100, "every criterion weight must be a positive percentage");
  weightSum += weight.percent;
}
probe(weightSum === 100, "the criterion weights must sum to one hundred percent");
const labels = [];
const hundredths = {};
for (const option of slots.options) {
  probe(typeof option.label === "string" && option.label.length > 0, "every option must carry a label");
  probe(Array.isArray(option.scores) && option.scores.length === criteria, "every option must carry one score per criterion");
  let total = 0;
  for (let index = 0; index < criteria; index += 1) {
    const score = option.scores[index];
    probe(Number.isInteger(score) && score >= scale.minimum && score <= scale.maximum, "every score must be an integer inside the stated scale");
    total += slots.weights[index].percent * score;
  }
  probe(hundredths[option.label] === undefined, "the option labels must be distinct");
  hundredths[option.label] = total;
  labels.push(option.label);
}
const maximum = Math.max(...labels.map((label) => hundredths[label]));
const winners = labels.filter((label) => hundredths[label] === maximum);
probe(winners.length > 0, "the weighted scores must attain a maximum");
const format = (value) => {
  const whole = Math.floor(value / 100);
  const fraction = value % 100;
  return whole + "." + (fraction < 10 ? "0" + fraction : String(fraction));
};
return "Scores: " + labels.map((label) => label + "=" + format(hundredths[label])).join(", ") + ". Winner(s) under these weights: " + winners.join(", ") + ".";
```

### 15. `dfdf2339c0b9`

- frequency: **50**
- mean lines: **36.00**
- frequency x lines: **1800.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
probe(Array.isArray(slots.order) && slots.order.length > 0, "the statement must name the tasks");
probe(slots.order.every((name) => Number.isInteger(slots.durations[name]) && slots.durations[name] > 0), "every task duration must be a positive whole number");
probe(slots.order.every((name) => Array.isArray(slots.prerequisites[name])), "every task must state its prerequisites");
probe(slots.order.every((name) => slots.prerequisites[name].every((prerequisite) => slots.order.indexOf(prerequisite) !== -1)), "every prerequisite must be a stated task");
probe(typeof slots.unit === "string" && slots.unit.length > 0, "the statement must state the time unit of the durations");
const start = {};
const finish = {};
const scheduled = [];
const remaining = slots.order.slice();
while (remaining.length > 0) {
  const ready = remaining.filter((name) => slots.prerequisites[name].every((prerequisite) => scheduled.indexOf(prerequisite) !== -1));
  if (ready.length === 0) {
    throw new Error("the stated prerequisites contain a cycle, so no schedule exists");
  }
  for (const name of ready) {
    const prerequisites = slots.prerequisites[name];
    start[name] = prerequisites.length === 0 ? 0 : Math.max(...prerequisites.map((prerequisite) => finish[prerequisite]));
    finish[name] = start[name] + slots.durations[name];
    scheduled.push(name);
    remaining.splice(remaining.indexOf(name), 1);
  }
}
const last = scheduled.reduce((best, name) => (finish[name] > finish[best] ? name : best));
probe(finish[last] > 0, "the project must have a positive duration");
const chain = [last];
let task = last;
while (slots.prerequisites[task].length > 0) {
  const binding = slots.prerequisites[task].find((prerequisite) => finish[prerequisite] === start[task]);
  if (binding === undefined) {
    throw new Error("no stated prerequisite of task " + task + " fixes its start time");
  }
  chain.unshift(binding);
  task = binding;
}
return "The minimum duration is " + finish[last] + " " + slots.unit + "s. One critical chain is " + chain.join("\u2013") + ".";
```

### 16. `549b1039181e`

- frequency: **50**
- mean lines: **35.00**
- frequency x lines: **1750.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
const names = ["A", "B", "C"];
probe(slots.programs !== null && typeof slots.programs === "object", "the statement must state the marginal benefits of three programs");
probe(names.every((name) => Array.isArray(slots.programs[name]) && slots.programs[name].length > 0), "every program must list at least one marginal benefit");
probe(names.every((name) => slots.programs[name].every((value) => Number.isInteger(value) && value > 0)), "every marginal benefit must be a positive integer");
probe(names.every((name) => slots.programs[name].length === slots.programs.A.length), "the programs must list the same number of marginal benefits");
probe(Number.isInteger(slots.units) && slots.units > 0, "the statement must state a positive number of units to allocate");
const depth = slots.programs.A.length;
probe(slots.units <= names.length * depth, "the stated units must not exceed the benefits the programs can absorb");
const totalOf = (taken) => names.reduce((sum, name) => sum + slots.programs[name].slice(0, taken[name]).reduce((left, right) => left + right, 0), 0);
let best = null;
let optima = 0;
let allocation = null;
for (let a = 0; a <= slots.units; a += 1) {
  for (let b = 0; a + b <= slots.units; b += 1) {
    const taken = { A: a, B: b, C: slots.units - a - b };
    if (names.some((name) => taken[name] > depth)) {
      continue;
    }
    const value = totalOf(taken);
    if (best === null || value > best) {
      best = value;
      optima = 1;
      allocation = taken;
    } else if (value === best) {
      optima += 1;
    }
  }
}
probe(allocation !== null, "at least one allocation of the stated units must be feasible");
probe(best > 0, "the optimal allocation must have a positive total benefit");
const chosen = "A=" + allocation.A + ", B=" + allocation.B + ", C=" + allocation.C;
return optima === 1
  ? chosen + "; maximum total benefit = " + best + " points."
  : "One optimal allocation is " + chosen + ", with " + best + " points. There are " + optima + " tied optimal allocations.";
```

### 17. `fbca4f7c881c`

- frequency: **20**
- mean lines: **86.00**
- frequency x lines: **1720.0**
- distinct families: **4**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const describeCrossDomain = function describeCrossDomain(check) {
  if (check.kind === 'distance') {
    return `${check.centimetres * check.kilometresPerCentimetre} km.`;
  }
  if (check.kind === 'time') {
    const minutes = check.startHour * 60 + check.startMinute + check.hours * 60;
    const hour = String(Math.floor(minutes / 60)).padStart(2, '0');
    const minute = String(minutes % 60).padStart(2, '0');
    return `${hour}:${minute}.`;
  }
  if (check.kind === 'quorum') {
    return check.present >= check.threshold ? 'quorum is met.' : 'quorum is not met.';
  }
  if (check.kind === 'reports') {
    return `${check.total - check.duplicates} independent reports.`;
  }
  if (check.kind === 'sheets') {
    return `${check.start + check.received} map sheets.`;
  }
  throw new Error(`Unknown cross-domain check "${check.kind}".`);
};
const renderCrossDomain = function renderCrossDomain(checks) {
  if (checks === null || checks === undefined || checks.length === 0) {
    return '';
  }
  const parts = checks.map((check, index) => {
    const label = index === 1 ? 'Mixed-domain answer:' : 'Cross-domain answer:';
    return `${label} ${describeCrossDomain(check)}`;
  });
  return parts.join(' ');
};
const slots = $slots;
probe(Array.isArray(slots.plots) && slots.plots.length > 0, "the statement must lay out at least one plot");
probe(Array.isArray(slots.uses) && slots.uses.length === slots.plots.length, "each plot must receive exactly one of the stated uses");
probe(slots.forbidden.length + slots.adjacent.length + slots.ends.length > 0, "the statement must state at least one placement constraint");
probe(Number.isInteger(slots.caseNumber) && slots.caseNumber >= 1, "the statement must state a positive case number");
const holds = (order) => {
  const position = new Map(slots.plots.map((plot, index) => [order[index], index]));
  const last = slots.plots.length - 1;
  for (const [left, right] of slots.forbidden) {
    if (Math.abs(position.get(left) - position.get(right)) === 1) {
      return false;
    }
  }
  for (const [left, right] of slots.adjacent) {
    if (Math.abs(position.get(left) - position.get(right)) !== 1) {
      return false;
    }
  }
  for (const use of slots.ends) {
    const index = position.get(use);
    if (index !== 0 && index !== last) {
      return false;
    }
  }
  return true;
};
const valid = [];
const order = [];
const used = new Set();
const place = (index) => {
  if (index === slots.plots.length) {
    if (holds(order)) {
      valid.push(order.slice());
    }
    return;
  }
  for (const use of slots.uses) {
    if (used.has(use)) {
      continue;
    }
    used.add(use);
    order.push(use);
    place(index + 1);
    order.pop();
    used.delete(use);
  }
};
place(0);
probe(valid.length > 0, "the stated constraints must leave at least one valid assignment");
const chosen = valid[(slots.caseNumber - 1) % valid.length];
probe(chosen.length === slots.plots.length && new Set(chosen).size === slots.uses.length, "the assignment must place every use exactly once");
probe(holds(chosen), "the assignment must satisfy every stated constraint");
const main = slots.plots.map((plot, index) => plot + "=" + chosen[index]).join(", ") + " is a valid assignment.";
const suffix = renderCrossDomain(slots.crossDomain);
return suffix === "" ? main : main + " " + suffix;
```

### 18. `7a40cb07fdd2`

- frequency: **20**
- mean lines: **84.00**
- frequency x lines: **1680.0**
- distinct families: **4**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const describeCrossDomain = function describeCrossDomain(check) {
  if (check.kind === 'distance') {
    return `${check.centimetres * check.kilometresPerCentimetre} km.`;
  }
  if (check.kind === 'time') {
    const minutes = check.startHour * 60 + check.startMinute + check.hours * 60;
    const hour = String(Math.floor(minutes / 60)).padStart(2, '0');
    const minute = String(minutes % 60).padStart(2, '0');
    return `${hour}:${minute}.`;
  }
  if (check.kind === 'quorum') {
    return check.present >= check.threshold ? 'quorum is met.' : 'quorum is not met.';
  }
  if (check.kind === 'reports') {
    return `${check.total - check.duplicates} independent reports.`;
  }
  if (check.kind === 'sheets') {
    return `${check.start + check.received} map sheets.`;
  }
  throw new Error(`Unknown cross-domain check "${check.kind}".`);
};
const renderCrossDomain = function renderCrossDomain(checks) {
  if (checks === null || checks === undefined || checks.length === 0) {
    return '';
  }
  const parts = checks.map((check, index) => {
    const label = index === 1 ? 'Mixed-domain answer:' : 'Cross-domain answer:';
    return `${label} ${describeCrossDomain(check)}`;
  });
  return parts.join(' ');
};
const slots = $slots;
probe(Array.isArray(slots.facts) && slots.facts.length > 0, "the statement must list at least one given fact");
probe(Array.isArray(slots.rules) && slots.rules.length > 0, "the statement must state at least one implication rule");
const names = { flooding: "flooding", "road closure": "road closure", warning: "a warning", "field muddy": "the field becomes muddy", "bus rerouting": "bus rerouting" };
const nameOf = (key) => { const name = names[key]; if (name === undefined) { throw new Error("unknown consequence " + key); } return name; };
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const joinList = (items) => items.length === 1 ? items[0] : items.length === 2 ? items[0] + " and " + items[1] : items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];
const trueKeys = new Set(slots.facts.filter((fact) => fact.positive).map((fact) => fact.key));
const falseKeys = new Set(slots.facts.filter((fact) => !fact.positive).map((fact) => fact.key));
const derived = [];
const derivedKeys = new Set();
const holds = (condition) => condition.positive ? trueKeys.has(condition.key) || derivedKeys.has(condition.key) : falseKeys.has(condition.key);
let changed = true;
while (changed) {
  changed = false;
  for (const rule of slots.rules) {
    if (trueKeys.has(rule.consequent) || derivedKeys.has(rule.consequent)) {
      continue;
    }
    const satisfied = rule.connector === "OR" ? rule.conditions.some(holds) : rule.conditions.every(holds);
    if (satisfied) {
      derived.push(rule.consequent);
      derivedKeys.add(rule.consequent);
      changed = true;
    }
  }
}
probe(derived.length > 0, "at least one rule must fire on the given facts");
const heads = slots.rules.map((rule) => rule.consequent);
const givenHeads = heads.filter((head) => trueKeys.has(head));
const missingHeads = heads.filter((head) => !trueKeys.has(head) && !derivedKeys.has(head));
probe(heads.every((head) => names[head] !== undefined), "every consequence must be one the book names");
const deduced = capitalize(joinList(derived.map(nameOf)));
let main;
if (givenHeads.length > 0) {
  main = deduced + " can be deduced; " + nameOf(givenHeads[0]) + " is already given as a fact.";
} else if (slots.rules.some((rule) => rule.connector === "OR")) {
  const clauses = derived.map((key) => key === "warning" ? "the warning follows from the working siren" : capitalize(nameOf(key)));
  main = clauses.slice(0, -1).join(", ") + (clauses.length === 1 ? "" : ", and ") + clauses[clauses.length - 1] + ".";
} else if (missingHeads.length > 0) {
  main = deduced + " can be deduced, but " + joinList(missingHeads.map(nameOf)) + " cannot be deduced.";
} else {
  let chain = true;
  for (let index = 1; index < derived.length; index += 1) {
    const rule = slots.rules.filter((candidate) => candidate.consequent === derived[index])[0];
    if (!rule.conditions.some((condition) => derived.slice(0, index).includes(condition.key))) {
      chain = false;
    }
  }
  main = deduced + " can" + (chain ? " all" : "") + " be deduced.";
}
const suffix = renderCrossDomain(slots.crossDomain);
return suffix === "" ? main : main + " " + suffix;
```

### 19. `79cbdf22332e`

- frequency: **50**
- mean lines: **29.00**
- frequency x lines: **1450.0**
- distinct families: **1**
- error share: **no holdout program contains this shape** — match 0, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
probe(Number.isInteger(slots.start) && slots.start > 0, "the flow must begin with a positive whole quantity");
probe(Array.isArray(slots.rates) && slots.rates.length === 3, "the statement must state the retention rate of three stages");
probe(slots.rates.every((rate) => Number.isInteger(rate) && rate > 0 && rate <= 100), "every retention rate must be a whole percentage between one and one hundred");
probe(Number.isInteger(slots.improvementPoints) && slots.improvementPoints > 0 && slots.improvementPoints <= 100, "the improvement must be a whole number of percentage points between one and one hundred");
const roundHundredths = (value) => {
  const text = value.toFixed(20);
  const point = text.indexOf(".");
  const kept = text.slice(point + 1, point + 3);
  const rest = text.slice(point + 3);
  let hundredths = Number(text.slice(0, point) + kept);
  const half = "5" + "0".repeat(rest.length - 1);
  if (rest > half || (rest === half && Number(kept[1]) % 2 === 1)) {
    hundredths += 1;
  }
  return String(hundredths / 100);
};
const outputOf = (rates) => slots.start * (rates[0] / 100) * (rates[1] / 100) * (rates[2] / 100);
const current = outputOf(slots.rates);
const gains = slots.rates.map((rate, index) => {
  const improved = slots.rates.map((other, position) => (position === index ? Math.min(100, other + slots.improvementPoints) : other));
  return outputOf(improved) - current;
});
const shown = gains.map(roundHundredths);
const bestGain = shown.reduce((left, right) => (Number(right) > Number(left) ? right : left), shown[0]);
probe(Number(bestGain) >= 0, "improving a stage must not lower the final output");
const stages = shown.map((value, index) => (value === bestGain ? index + 1 : 0)).filter((stage) => stage > 0);
probe(stages.length > 0, "at least one stage must be the best to improve");
return "Current final output: " + roundHundredths(current) + " " + slots.unit + ". Best stage(s) to improve: " + stages.join(", ") + ", for a gain of " + bestGain + " " + slots.unit + ".";
```

### 20. `e8d7a363ed5a`

- frequency: **80**
- mean lines: **18.00**
- frequency x lines: **1440.0**
- distinct families: **2**
- error share: **0/40 (0.0%)** — match 40, mismatch 0, execution 0, other 0
- score (freq x lines x error-share): **0.00**

```js
const slots = $slots;
const values = slots.values;
probe(Array.isArray(values) && values.length > 0, "the records must be a non-empty list");
let current = values;
// stage 1: keepBelow
const kept0 = current.filter((value) => value < slots.threshold);
current = kept0;
// stage 2: total
const total1 = current.reduce((sum, value) => sum + value, 0);
current = total1;
// stage 3: perUnit
const scaled2 = current * slots.perUnit;
current = scaled2;
// stage 4: subtractRate
const adjusted3 = current - slots.rate;
current = adjusted3;
probe(Number.isInteger(current) && current >= 0, "the answer must be a whole number that is not negative");
return current + " units.";
```

## Line-cost map (procedural generator transcription)

- one-line jsEval operators: **20** — keepAbove, keepBelow, total, count, largest, smallest, double, perUnit, addRate, subtractRate, keepDivisibleBy, modulo, ratioPer, percentOf, discount, nthLargest, uniqueCount, squareArea, elapsed, rectangleArea
- declarative operators (already a wire): **3**
  - `pathExists` -> `graphPath` (3 fields)
  - `neighbourCount` -> `graphPath` (3 fields)
  - `probability` -> `fraction` (2 fields)

## Validation gate

A proposed abstraction is adopted only after the family round-trip/oracle tests AND `node training-data/verify.mjs` (which executes every shipped circuit and reproduces the printed answer) pass, in every phase. Applying that rule to the measured top candidates:

- top-20 shapes admitted to that gate on line-reduction evidence (multi-line AND recurring): **20**
  - `f569487dd2cb` freq 100, mean-lines 46.00, families 1
  - `dc99299c2b18` freq 80, mean-lines 37.00, families 2
  - `774b6d233d07` freq 100, mean-lines 26.00, families 1
  - `a1add07e0d2b` freq 100, mean-lines 26.00, families 1
  - `e1ee4a2cf41c` freq 100, mean-lines 24.00, families 1
  - `4ebb350f24d0` freq 100, mean-lines 23.00, families 1
  - `0dc1d90038a7` freq 120, mean-lines 18.00, families 3
  - `fa29e28da3ce` freq 100, mean-lines 21.00, families 1
  - `a0f2285f9b5d` freq 20, mean-lines 98.00, families 4
  - `7197ae8b72dc` freq 50, mean-lines 39.00, families 1
  - `d9d9a4221cb9` freq 50, mean-lines 39.00, families 1
  - `e4bafb930d35` freq 20, mean-lines 96.00, families 4
  - `8aae8452a2ab` freq 50, mean-lines 38.00, families 1
  - `929d3f24ada4` freq 50, mean-lines 37.00, families 1
  - `dfdf2339c0b9` freq 50, mean-lines 36.00, families 1
  - `549b1039181e` freq 50, mean-lines 35.00, families 1
  - `fbca4f7c881c` freq 20, mean-lines 86.00, families 4
  - `7a40cb07fdd2` freq 20, mean-lines 84.00, families 4
  - `79cbdf22332e` freq 50, mean-lines 29.00, families 1
  - `e8d7a363ed5a` freq 80, mean-lines 18.00, families 2
- top-20 shapes below the proposal bar (single-line or rare): **0**

Error-share is 0 for every shape in this run (see the correlation section), so no candidate carries mistake-reduction evidence yet; admission rests on line reduction alone, and every admitted candidate still owes the round-trip/oracle and verify gates before adoption.

