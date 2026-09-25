/**
 * Container families of the procedural arithmetic source.
 *
 * The container plan shape is the seventh tranche of the procedural inventory:
 * a structural state declaration (a `container` wire) plus staged patches
 * (`containerAdd`, `containerUpsert`) and a derived view (`containerFilter`)
 * over it. The book's longest `jsEval` bodies fail at iteration and
 * array-method mistakes, and the five container commands move that state out of
 * the body and into trusted runtime state (see containers-plan.md). Each family
 * here splits the one long body into named stages: the declaration, one or two
 * seeds, and an answer that reads the committed store or the derived view.
 *
 * The module ships three families, one per shape:
 *
 * - `store-built-in-stages` — a keyed table declared once, seeded in two
 *   `containerAdd` stages, and an answer that reads the committed store.
 * - `store-patched-by-upsert` — a keyed table declared under a merge policy,
 *   seeded once, one record replaced by `containerUpsert`, and an answer that
 *   reads the patched view.
 * - `kept-shipments-query` — a keyed table declared and seeded, a
 *   `containerFilter` view over it, and an answer that aggregates the view; an
 *   honest empty filter renders "0 shipments ..." as an answer, never a failure.
 *
 * Every seed passes through an intermediate `jsEval` wire that reads `$slots`,
 * because a mutation's `items` reference must be a plain wire name rather than
 * a dotted path (`tests/container-validator.test.mjs`). The statements carry
 * their own premises, so the `no-knowledge` category is correct for all three.
 */

/** Records as prose: [{id:'A',quantity:20},{id:'B',quantity:35}] -> "A(20), B(35)". */
function renderRecords(records) {
  return records.map((record) => `${record.id}(${record.quantity})`).join(', ');
}

/** Prose back to id/quantity records, the inverse of `renderRecords`. */
function parseRecords(text) {
  const records = [];
  for (const match of text.matchAll(/([A-Z])\((\d+)\)/g)) {
    records.push({ id: match[1], quantity: Number(match[2]) });
  }
  if (records.length === 0 || records.some((record) => !Number.isInteger(record.quantity) || record.quantity <= 0)) {
    throw new Error('the statement does not state shipments with positive whole quantities');
  }
  return records;
}

/** The declaration body every family shares: a keyed table of id/quantity records. */
const LEDGER_DECLARATION = 'kind: table\nprimaryKey: id\nschema:\n  type: object';

/** The patched family declares a merge policy so its upsert may replace a key. */
const MERGED_LEDGER_DECLARATION = 'kind: table\nprimaryKey: id\nmergePolicy: replace\nschema:\n  type: object';

/** The latent plan: declare a store, seed it in two stages, then read the committed store. */
const storeBuiltInStages = {
  id: 'store-built-in-stages',
  name: 'Store Built In Stages',
  type: 'store-built-in-stages',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 3, branching: 0, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    const ids = ['A', 'B', 'C', 'D', 'E', 'F'];
    const firstCount = 2 + Math.floor(random() * 2);
    const secondCount = 2 + Math.floor(random() * 2);
    const firstStage = [];
    const secondStage = [];
    let index = 0;
    for (let i = 0; i < firstCount; i += 1) {
      firstStage.push({ id: ids[index], quantity: 3 + Math.floor(random() * 28) });
      index += 1;
    }
    for (let i = 0; i < secondCount; i += 1) {
      secondStage.push({ id: ids[index], quantity: 3 + Math.floor(random() * 28) });
      index += 1;
    }
    return { firstStage, secondStage };
  },
  statement(slots) {
    return `A store records shipments in two stages. The first stage adds ${renderRecords(slots.firstStage)}. ` +
      `The second stage adds ${renderRecords(slots.secondStage)}. ` +
      'How many shipments does the store hold, and what is their total quantity?';
  },
  parse(statement) {
    const first = /The first stage adds ([A-Z]\(\d+\)(?:, [A-Z]\(\d+\))*)\./.exec(statement);
    const second = /The second stage adds ([A-Z]\(\d+\)(?:, [A-Z]\(\d+\))*)\./.exec(statement);
    if (first === null || second === null) {
      throw new Error('the statement does not state the two stages of shipments');
    }
    if (!statement.endsWith('How many shipments does the store hold, and what is their total quantity?')) {
      throw new Error('the statement does not ask for the shipment count and total quantity');
    }
    return { firstStage: parseRecords(first[1]), secondStage: parseRecords(second[1]) };
  },
  /** Independent oracle: the two stages concatenated, then counted and summed. */
  solve(slots) {
    const records = [...slots.firstStage, ...slots.secondStage];
    let total = 0;
    for (const record of records) {
      total += record.quantity;
    }
    return { count: records.length, total };
  },
  render(solution) {
    return `The store holds ${solution.count} shipments whose total quantity is ${solution.total} units.`;
  },
  wires: [
    { name: 'ledger', command: 'container', body: LEDGER_DECLARATION },
    { name: 'first', command: 'jsEval', body: 'return $slots.firstStage;' },
    { name: 'second', command: 'jsEval', body: 'return $slots.secondStage;' },
    { name: 'seedFirst', command: 'containerAdd', body: 'target: ledger\nitems: $first' },
    { name: 'seedSecond', command: 'containerAdd', body: 'target: ledger\nitems: $second' }
  ],
  compute: [
    'const ledger = $ledger;',
    'const records = ledger.records;',
    'let total = 0;',
    'for (const record of records) {',
    '  total += record.quantity;',
    '}',
    'probe(Number.isInteger(records.length) && records.length > 0, "the shipment count must be a positive whole number");',
    'probe(Number.isInteger(total) && total > 0, "the total quantity must be a positive whole number");',
    'return "The store holds " + records.length + " shipments whose total quantity is " + total + " units.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The store seeds ${slots.firstStage.length} shipments in the first stage and ${slots.secondStage.length} in the second.`,
      `The committed store holds every seeded shipment, ${solution.count} in all.`,
      `Adding their quantities gives a total of ${solution.total} units.`
    ];
  }
};

/** The latent plan: declare a store under a merge policy, seed it, replace one record, read the patched view. */
const storePatchedByUpsert = {
  id: 'store-patched-by-upsert',
  name: 'Store Patched By Upsert',
  type: 'store-patched-by-upsert',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 3, branching: 0, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    const ids = ['A', 'B', 'C', 'D'];
    const count = 3 + Math.floor(random() * 2);
    const seed = [];
    for (let i = 0; i < count; i += 1) {
      seed.push({ id: ids[i], quantity: 5 + Math.floor(random() * 26) });
    }
    const patchIndex = Math.floor(random() * count);
    let quantity = 5 + Math.floor(random() * 26);
    if (quantity === seed[patchIndex].quantity) {
      quantity += 1;
    }
    return { seed, patch: { id: seed[patchIndex].id, quantity } };
  },
  statement(slots) {
    return `A store tracks shipments: ${renderRecords(slots.seed)}. ` +
      `Shipment ${slots.patch.id} is replaced with a quantity of ${slots.patch.quantity}. ` +
      'How many shipments does the store hold, and what is their total quantity?';
  },
  parse(statement) {
    const records = /A store tracks shipments: ([A-Z]\(\d+\)(?:, [A-Z]\(\d+\))*)\./.exec(statement);
    const patch = /Shipment ([A-Z]) is replaced with a quantity of (\d+)\./.exec(statement);
    if (records === null || patch === null) {
      throw new Error('the statement does not state the shipments and the replaced shipment');
    }
    if (!statement.endsWith('How many shipments does the store hold, and what is their total quantity?')) {
      throw new Error('the statement does not ask for the shipment count and total quantity');
    }
    return { seed: parseRecords(records[1]), patch: { id: patch[1], quantity: Number(patch[2]) } };
  },
  /** Independent oracle: the ledger summed, then the replaced record swapped in. */
  solve(slots) {
    let total = 0;
    for (const record of slots.seed) {
      total += record.id === slots.patch.id ? slots.patch.quantity : record.quantity;
    }
    return { count: slots.seed.length, total };
  },
  render(solution) {
    return `The store holds ${solution.count} shipments whose total quantity is ${solution.total} units.`;
  },
  wires: [
    { name: 'ledger', command: 'container', body: MERGED_LEDGER_DECLARATION },
    { name: 'records', command: 'jsEval', body: 'return $slots.seed;' },
    { name: 'seed', command: 'containerAdd', body: 'target: ledger\nitems: $records' },
    { name: 'changed', command: 'jsEval', body: 'return [$slots.patch];' },
    { name: 'patch', command: 'containerUpsert', body: 'target: ledger\nitems: $changed' }
  ],
  compute: [
    'const ledger = $ledger;',
    'const records = ledger.records;',
    'let total = 0;',
    'for (const record of records) {',
    '  total += record.quantity;',
    '}',
    'probe(Number.isInteger(records.length) && records.length > 0, "the shipment count must be a positive whole number");',
    'probe(Number.isInteger(total) && total > 0, "the total quantity must be a positive whole number");',
    'return "The store holds " + records.length + " shipments whose total quantity is " + total + " units.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The store starts with ${slots.seed.length} shipments and replaces the shipment ${slots.patch.id} with a quantity of ${slots.patch.quantity}.`,
      `Replacing a keyed record keeps the count at ${solution.count} shipments.`,
      `The patched view totals ${solution.total} units.`
    ];
  }
};

/** The latent plan: declare and seed a store, filter it, then aggregate the derived view. */
const keptShipmentsQuery = {
  id: 'kept-shipments-query',
  name: 'Kept Shipments Query',
  type: 'kept-shipments-query',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    const ids = ['A', 'B', 'C', 'D', 'E'];
    const count = 3 + Math.floor(random() * 3);
    const records = [];
    for (let i = 0; i < count; i += 1) {
      records.push({ id: ids[i], quantity: 5 + Math.floor(random() * 36) });
    }
    // The threshold is drawn over a range that reaches past the quantities, so a
    // sample may keep every record, some records, or none — the empty filter is a
    // valid instance whose answer is "0 shipments ...", not a failure.
    const threshold = 5 + Math.floor(random() * 46);
    return { records, threshold };
  },
  statement(slots) {
    return `A store records shipments: ${renderRecords(slots.records)}. ` +
      `Keep only the shipments whose quantity is at least ${slots.threshold}. ` +
      'How many shipments are kept, and what is their total quantity?';
  },
  parse(statement) {
    const records = /A store records shipments: ([A-Z]\(\d+\)(?:, [A-Z]\(\d+\))*)\./.exec(statement);
    const threshold = /Keep only the shipments whose quantity is at least (\d+)\./.exec(statement);
    if (records === null || threshold === null) {
      throw new Error('the statement does not state the shipments and the threshold');
    }
    if (!statement.endsWith('How many shipments are kept, and what is their total quantity?')) {
      throw new Error('the statement does not ask for the kept shipment count and total quantity');
    }
    return { records: parseRecords(records[1]), threshold: Number(threshold[1]) };
  },
  /** Independent oracle: the threshold comparison over the raw records, then counted and summed. */
  solve(slots) {
    let count = 0;
    let total = 0;
    for (const record of slots.records) {
      if (record.quantity >= slots.threshold) {
        count += 1;
        total += record.quantity;
      }
    }
    return { count, total };
  },
  render(solution) {
    const noun = solution.count === 1 ? 'shipment' : 'shipments';
    return `${solution.count} ${noun} were kept, and their total quantity is ${solution.total} units.`;
  },
  wires: [
    { name: 'ledger', command: 'container', body: LEDGER_DECLARATION },
    { name: 'records', command: 'jsEval', body: 'return $slots.records;' },
    { name: 'threshold', command: 'jsEval', body: 'return $slots.threshold;' },
    { name: 'seed', command: 'containerAdd', body: 'target: ledger\nitems: $records' },
    { name: 'kept', command: 'containerFilter', body: 'source: $ledger\npredicate: return row.quantity >= $threshold;' }
  ],
  compute: [
    'const kept = $kept;',
    'const records = kept.records;',
    'let total = 0;',
    'for (const record of records) {',
    '  total += record.quantity;',
    '}',
    'probe(Number.isInteger(records.length) && records.length >= 0, "the kept count must be a whole number");',
    'probe(Number.isInteger(total) && total >= 0, "the kept total must be a whole number");',
    'const noun = records.length === 1 ? "shipment" : "shipments";',
    'return records.length + " " + noun + " were kept, and their total quantity is " + total + " units.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The store records ${slots.records.length} shipments and keeps only those with a quantity of at least ${slots.threshold}.`,
      `That filter keeps ${solution.count} shipment${solution.count === 1 ? '' : 's'}.`,
      `The kept shipments total ${solution.total} units.`
    ];
  }
};

export const containerFamilies = [storeBuiltInStages, storePatchedByUpsert, keptShipmentsQuery];
