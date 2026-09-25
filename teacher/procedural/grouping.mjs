/**
 * Grouping families of the procedural arithmetic source.
 *
 * The evidence so far is that plan coverage, not plan depth, binds the student:
 * it reaches 98.1% oracle on the rows whose plan it saw and compiles nothing on
 * a holdout family it never saw. These two families add plan shapes that rest on
 * grouping and selection rather than on a single pass over the stated numbers: a
 * per-site total that must be published as an object and then ranked, and a
 * "top k" list that must be ranked and then truncated before it is summed.
 *
 * Both keep the contract of the source — self-contained statement, integer-exact
 * oracle reached by a route independent of the circuit body, reference parse of
 * its own statements, difficulty vector, two named intermediate wires whose
 * published values the answer reads through `$name` (DS008, "Additional circuit
 * shapes"). Every stage body carries the probe harness of the answer wire, so no
 * intermediate value is published unchecked.
 */

const SITE_NAMES = [
  'north', 'east', 'south', 'west', 'central', 'harbour',
  'river', 'ridge', 'delta', 'coast', 'valley', 'meadow'
];

/** The latent plan: group the recorded amounts by site, rank the totals, read the leader. */
const groupedLabelTotals = {
  id: 'grouped-label-totals',
  name: 'Grouped Label Totals',
  type: 'grouped-label-totals',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 0.95 },
  sample(random) {
    // A site may be drawn more than once, so a group holds several records and
    // the totals stage has a real merge to perform. The statement must still
    // determine a single leading site over at least two of them, so the sampler
    // keeps redrawing until the recorded list names two sites and the greatest
    // total is held by exactly one label.
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const count = 4 + Math.floor(random() * 3);
      const labels = [];
      for (let index = 0; index < count; index += 1) {
        labels.push(SITE_NAMES[Math.floor(random() * SITE_NAMES.length)]);
      }
      const amounts = [];
      for (let index = 0; index < count; index += 1) {
        amounts.push(1 + Math.floor(random() * 40));
      }
      const totals = new Map();
      for (let index = 0; index < count; index += 1) {
        totals.set(labels[index], (totals.get(labels[index]) ?? 0) + amounts[index]);
      }
      if (totals.size < 2) {
        continue;
      }
      const best = Math.max(...totals.values());
      let leaders = 0;
      for (const total of totals.values()) {
        if (total === best) {
          leaders += 1;
        }
      }
      if (leaders === 1) {
        return { labels, amounts };
      }
    }
    throw new Error('the sampler could not draw recorded amounts with a single leading site');
  },
  statement(slots) {
    const records = slots.labels.map((label, index) => `${index === 0 ? 'The' : 'the'} ${label} site recorded ${slots.amounts[index]} units`);
    return `${records.slice(0, -1).join(', ')}, and ${records[records.length - 1]}. ` +
      'Which site recorded the most units in total, and how many units is that?';
  },
  parse(statement) {
    const tail = ' Which site recorded the most units in total, and how many units is that?';
    if (!statement.endsWith(tail)) {
      throw new Error('the statement does not ask which site recorded the most units in total');
    }
    const head = statement.slice(0, statement.length - tail.length);
    if (!/^The [a-z]+ site recorded \d+ units(?:, (?:and )?the [a-z]+ site recorded \d+ units)*\.$/.test(head)) {
      throw new Error('the statement does not list the recorded amounts in order');
    }
    const labels = [];
    const amounts = [];
    for (const pair of head.matchAll(/([a-z]+) site recorded (\d+) units/g)) {
      labels.push(pair[1]);
      amounts.push(Number(pair[2]));
    }
    return { labels, amounts };
  },
  /** Independent oracle: a plain loop that accumulates a Map by hand. */
  solve(slots) {
    const totals = new Map();
    for (let index = 0; index < slots.labels.length; index += 1) {
      const label = slots.labels[index];
      const previous = totals.has(label) ? totals.get(label) : 0;
      totals.set(label, previous + slots.amounts[index]);
    }
    let winner = '';
    let total = 0;
    for (const [label, summed] of totals) {
      if (summed > total) {
        winner = label;
        total = summed;
      }
    }
    return { winner, total };
  },
  render(solution) {
    return `The ${solution.winner} site leads with ${solution.total} units.`;
  },
  wires: [
    {
      name: 'totals',
      command: 'jsEval',
      body: [
        'const slots = $slots;',
        'const totals = {};',
        'for (let index = 0; index < slots.labels.length; index += 1) {',
        '  const label = slots.labels[index];',
        '  totals[label] = (totals[label] ?? 0) + slots.amounts[index];',
        '}',
        'probe(Object.values(totals).every((total) => Number.isInteger(total) && total > 0), "every published total must be a positive whole number");',
        'return totals;'
      ].join('\n')
    },
    {
      name: 'ranked',
      command: 'jsEval',
      body: [
        'const totals = $totals;',
        'const entries = Object.entries(totals).map(([label, total], order) => ({ label, total, order }));',
        'entries.sort((left, right) => (right.total - left.total) || (left.order - right.order));',
        'const ranked = entries.map((entry) => [entry.label, entry.total]);',
        'probe(ranked.length === Object.keys(totals).length, "the ranking must keep every published site");',
        'probe(ranked.every((pair) => Array.isArray(pair) && pair.length === 2), "every published pair must name a site and its total");',
        'probe(ranked.every((pair, index) => index === 0 || ranked[index - 1][1] >= pair[1]), "the ranking must run from the largest total down");',
        'return ranked;'
      ].join('\n')
    }
  ],
  compute: [
    'const slots = $slots;',
    'const totals = $totals;',
    'const ranked = $ranked;',
    'const winner = ranked[0][0];',
    'const total = ranked[0][1];',
    'probe(totals[winner] === total, "the leading pair must repeat the total the totals stage published for that site");',
    'return "The " + winner + " site leads with " + total + " units.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The statement records ${slots.amounts.length} amounts, and ${new Set(slots.labels).size} sites are named among them.`,
      'The totals stage groups the recorded amounts by site, and the ranked stage sorts those totals from the largest down.',
      `The answer reads the leading pair: the ${solution.winner} site with ${solution.total} units.`
    ];
  }
};

/** The latent plan: rank the values, keep the leading k of them, total the kept ones. */
const topKAmongList = {
  id: 'top-k-among-list',
  name: 'Top K Among List',
  type: 'top-k-among-list',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 0.95 },
  sample(random) {
    // Distinct values keep the leading k unambiguous, and the count keeps at
    // least two values out of the kept part, so the truncation is real work:
    // both preconditions are checked here and the draw is redrawn otherwise.
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const count = 5 + Math.floor(random() * 3);
      const values = [];
      for (let index = 0; index < count; index += 1) {
        values.push(1 + Math.floor(random() * 99));
      }
      if (new Set(values).size !== values.length) {
        continue;
      }
      const k = 2 + Math.floor(random() * (count - 3));
      if (k > count - 2) {
        continue;
      }
      return { values, k };
    }
    throw new Error('the sampler could not draw a list of distinct values with a proper kept part');
  },
  statement(slots) {
    const list = slots.values.length === 1 ? `${slots.values[0]}` : `${slots.values.slice(0, -1).join(', ')} and ${slots.values[slots.values.length - 1]}`;
    return `The recorded values are ${list}. Report the ${slots.k} largest values in descending order, and their total.`;
  },
  parse(statement) {
    const match = /^The recorded values are ([0-9, and]+)\. Report the (\d+) largest values in descending order, and their total\.$/.exec(statement);
    if (match === null) {
      throw new Error('the statement does not state the values and how many of them to keep');
    }
    const values = match[1].split(/ and |, /).filter(Boolean).map(Number);
    if (values.length === 0 || values.some((value) => !Number.isInteger(value))) {
      throw new Error('the statement does not state the values as whole numbers');
    }
    return { values, k: Number(match[2]) };
  },
  /** Independent oracle: selection by repeated scans for the current maximum, never a sort. */
  solve(slots) {
    const remaining = [...slots.values];
    const kept = [];
    for (let round = 0; round < slots.k; round += 1) {
      let bestAt = 0;
      for (let index = 1; index < remaining.length; index += 1) {
        if (remaining[index] > remaining[bestAt]) {
          bestAt = index;
        }
      }
      kept.push(remaining[bestAt]);
      remaining.splice(bestAt, 1);
    }
    let total = 0;
    for (const value of kept) {
      total += value;
    }
    return { kept, total };
  },
  render(solution) {
    const list = solution.kept.length === 1 ? `${solution.kept[0]}` : `${solution.kept.slice(0, -1).join(', ')} and ${solution.kept[solution.kept.length - 1]}`;
    return `The ${solution.kept.length} largest values are ${list}, and their total is ${solution.total}.`;
  },
  wires: [
    {
      name: 'ranked',
      command: 'jsEval',
      body: [
        'const slots = $slots;',
        'const ranked = slots.values.slice().sort((left, right) => right - left);',
        'probe(ranked.length === slots.values.length, "the ranking must keep every stated value");',
        'return ranked;'
      ].join('\n')
    },
    {
      name: 'keptTop',
      command: 'jsEval',
      body: [
        'const slots = $slots;',
        'const ranked = $ranked;',
        'const keptTop = ranked.slice(0, slots.k);',
        'probe(keptTop.length === slots.k, "the kept values must be exactly the requested count");',
        'probe(keptTop.every((value, index) => value === ranked[index]), "the kept values must be the leading part of the ranking");',
        'return keptTop;'
      ].join('\n')
    }
  ],
  compute: [
    'const slots = $slots;',
    'const ranked = $ranked;',
    'const keptTop = $keptTop;',
    'probe(keptTop.every((value, index) => value === ranked[index]), "the kept values must be the leading values of the ranking");',
    'const total = keptTop.reduce((sum, value) => sum + value, 0);',
    'probe(Number.isInteger(total) && total > 0, "the total of the kept values must be a positive whole number");',
    'const list = keptTop.length === 1 ? String(keptTop[0]) : keptTop.slice(0, -1).join(", ") + " and " + keptTop[keptTop.length - 1];',
    'return "The " + keptTop.length + " largest values are " + list + ", and their total is " + total + ".";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The statement fixes ${slots.values.length} values and asks for the leading ${slots.k} of them.`,
      'The ranked stage orders every value from the largest down, and the keptTop stage takes the leading count of that ranking.',
      `The answer names those kept values and adds them to ${solution.total}.`
    ];
  }
};

export const groupingFamilies = [groupedLabelTotals, topKAmongList];
