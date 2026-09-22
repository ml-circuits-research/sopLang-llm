/**
 * Contrastive source: families whose decisive word or boundary changes the plan.
 *
 * The four-condition diagnostic (`evaluation/registry/diag-009/`) established
 * that the trained checkpoint does not fail at reading the statement, choosing
 * operators, or writing JavaScript: supplying the correct values or the correct
 * operator graph changes almost nothing. It fails because it completes the
 * nearest memorized family, copying that family's plan and its return phrasing
 * even when the statement asks for a different operation (`phase4-analysis.md`,
 * D-L). Every family in this module is built so that shortcut cannot work: two
 * statements share their wording, their numbers and their subject, and differ
 * only where the asked-for operation differs, so the only way to answer both is
 * to read the decisive phrase.
 *
 * The module ships three pair shapes, each with a boundary the model must
 * respect rather than a magnitude it can pattern-match:
 *
 * - `boundary-inclusion-pair` — "above N" against "at least N": the record equal
 *   to the threshold is dropped on one side and kept on the other.
 * - `direction-pair` — "increase the largest by N" against "increase the
 *   smallest by N": the same ledger, the same operator, a different operand.
 * - `rate-vs-absolute-pair` — "add N units" against "add N percent": the same
 *   ledger and the same second operand, a different operation on it.
 *
 * Pair membership travels in the problem's `pair` field, and the module also
 * exports `PAIR_KINDS` so the verifier, the exporter and the diagnostic runner
 * can hold both members of a pair on the same side of every split (DS008,
 * "Contrastive pairs": a pair is one unit for splitting, because a split that
 * keeps one member teaches the answer to the other).
 *
 * The families are otherwise ordinary procedural families: a recorded seed
 * draws the instances, the oracle is independent of the circuit compute body,
 * `parse` reads the statement back, and the acceptance class is
 * `constructed_verified`. The statements carry their own premises, so the
 * `no-knowledge` category is correct for all of them.
 */

const HOLDERS = ['Priya', 'Mara', 'Daria', 'Luca', 'Ines', 'Tomas', 'Nadia', 'Ravi'];
const DEPOTS = ['north depot', 'river depot', 'hill depot', 'market depot'];

/** Draw a ledger whose threshold is present, so the boundary of a pair is observable. */
function drawLedgerWithBoundary(random, { minimum = 8, maximum = 60, extra = 4 }) {
  const threshold = minimum + 2 + Math.floor(random() * (maximum - minimum - 4));
  const values = [];
  const aboveCount = 2 + Math.floor(random() * 3);
  for (let index = 0; index < aboveCount; index += 1) {
    values.push(threshold + 1 + Math.floor(random() * (maximum - threshold)));
  }
  const belowCount = 2 + Math.floor(random() * 2);
  for (let index = 0; index < belowCount; index += 1) {
    values.push(minimum + Math.floor(random() * (threshold - minimum)));
  }
  // The record equal to the threshold is always present: it is the one the two
  // members of an inclusion pair disagree about.
  values.push(threshold);
  for (let index = 0; index < extra; index += 1) {
    values.push(threshold + Math.floor(random() * 9) - 4);
  }
  const distinct = [];
  for (const value of values) {
    if (value >= minimum && !distinct.includes(value)) {
      distinct.push(value);
    }
  }
  for (let index = distinct.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [distinct[index], distinct[swap]] = [distinct[swap], distinct[index]];
  }
  return { threshold, values: distinct };
}

function renderLedger(values, unit) {
  const printed = values.map((value) => `${value}`);
  return `${printed.slice(0, -1).join(', ')} and ${printed.at(-1)} ${unit}`;
}

/** Read back a rendered ledger: the numbers in order, with the trailing unit word dropped. */
function readLedger(text) {
  const numbers = [];
  for (const part of text.split(',')) {
    for (const piece of part.split(' and ')) {
      // The last record carries the unit word ("18 crates"), so the leading
      // number is taken from every non-empty piece and the unit is discarded.
      const match = /^\s*(\d+)/.exec(piece);
      if (match !== null) {
        numbers.push(Number(match[1]));
      }
    }
  }
  return numbers;
}

function probeValues(values, unit) {
  return [
    'const slots = $slots;',
    'probe(Array.isArray(slots.values) && slots.values.length > 0, "the records must be a non-empty list");',
    'const values = slots.values;',
    'for (const value of values) {',
    `  probe(Number.isInteger(value) && value > 0, "every record must be a positive whole number of ${unit}");`,
    '}'
  ];
}

/**
 * The inclusion pair: "above N" and "at least N" over the same ledger.
 *
 * The member of the pair named `above` drops the record equal to the threshold;
 * the member named `at-least` keeps it. The two statements differ in two words.
 */
function inclusionPair(kind) {
  const above = kind === 'above';
  const familyId = above ? 'filtered-records-above-a-threshold' : 'filtered-records-at-least-a-threshold';
  return {
    id: familyId,
    name: above ? 'Filtered Records Above A Threshold' : 'Filtered Records At Least A Threshold',
    type: familyId,
    category: 'no-knowledge',
    pairKind: 'boundary-inclusion-pair',
    pairRole: above ? 'above' : 'at-least',
    pairPartner: above ? 'filtered-records-at-least-a-threshold' : 'filtered-records-above-a-threshold',
    difficulty: { subproblems: 2, dependencyDepth: 1, branching: 0, irrelevantInformation: 0, symbolicShare: 0.95 },
    sample(random) {
      const { threshold, values } = drawLedgerWithBoundary(random, { minimum: 6, maximum: 48 });
      return {
        depot: DEPOTS[Math.floor(random() * DEPOTS.length)],
        unit: 'crates',
        threshold,
        values
      };
    },
    statement(slots) {
      const qualifier = above ? `above ${slots.threshold}` : `at least ${slots.threshold}`;
      return `The ${slots.depot} recorded ${renderLedger(slots.values, slots.unit)} this week. ` +
        `Keep only the records ${qualifier} ${slots.unit}, then report how many were kept and their total.`;
    },
    parse(statement) {
      const ledger = /recorded (.+) this week\./.exec(statement);
      const qualifier = /Keep only the records (above|at least) (\d+) crates,/.exec(statement);
      const depot = /^The ([a-z ]+depot) recorded/.exec(statement);
      if (ledger === null || qualifier === null || depot === null) {
        throw new Error('the statement does not state the records, the threshold and the depot');
      }
      const expected = above ? 'above' : 'at least';
      if (qualifier[1] !== expected) {
        throw new Error(`the statement was parsed by the wrong family: it says "${qualifier[1]}"`);
      }
      const values = readLedger(ledger[1]);
      if (values.some((value) => !Number.isInteger(value))) {
        throw new Error('the statement does not state whole numbers of crates');
      }
      return { depot: depot[1], unit: 'crates', threshold: Number(qualifier[2]), values };
    },
    /** Independent oracle: the kept list built by the plain comparison, then counted and summed. */
    solve(slots) {
      const kept = [];
      for (const value of slots.values) {
        if (above ? value > slots.threshold : value >= slots.threshold) {
          kept.push(value);
        }
      }
      let total = 0;
      for (const value of kept) {
        total += value;
      }
      return { kept: kept.length, total };
    },
    render(solution) {
      return `${solution.kept} records were kept, and their total is ${solution.total} crates.`;
    },
    compute: [
      ...probeValues([], 'crates'),
      'probe(Number.isInteger(slots.threshold) && slots.threshold > 0, "the threshold must be a positive whole number of crates");',
      `const kept = values.filter((value) => ${above ? 'value > slots.threshold' : 'value >= slots.threshold'});`,
      'probe(kept.length > 0, "the threshold must leave at least one record");',
      'let total = 0;',
      'for (const value of kept) {',
      '  total += value;',
      '}',
      'return kept.length + " records were kept, and their total is " + total + " crates.";'
    ].join('\n'),
    explain(slots, solution) {
      const qualifier = above ? 'strictly above' : 'at or above';
      return [
        `The ${slots.depot} recorded ${slots.values.length} values, and the threshold is ${slots.threshold} crates.`,
        `Keeping the records ${qualifier} the threshold keeps ${solution.kept} of them.`,
        `The kept records total ${solution.total} crates.`
      ];
    }
  };
}

/**
 * The direction pair: "increase the largest by N" and "increase the smallest by N".
 *
 * The ledger, the operator and the added amount are identical; the operand is
 * chosen by one adjective. A model that matches the family rather than the
 * statement answers both members with the same number.
 */
function directionPair(direction) {
  const largest = direction === 'largest';
  const familyId = largest ? 'raised-largest-record' : 'raised-smallest-record';
  return {
    id: familyId,
    name: largest ? 'Raised Largest Record' : 'Raised Smallest Record',
    type: familyId,
    category: 'no-knowledge',
    pairKind: 'direction-pair',
    pairRole: largest ? 'largest' : 'smallest',
    pairPartner: largest ? 'raised-smallest-record' : 'raised-largest-record',
    difficulty: { subproblems: 2, dependencyDepth: 1, branching: 1, irrelevantInformation: 0, symbolicShare: 0.95 },
    sample(random) {
      const values = [];
      while (values.length < 5) {
        const value = 11 + Math.floor(random() * 70);
        if (!values.includes(value)) {
          values.push(value);
        }
      }
      return {
        holder: HOLDERS[Math.floor(random() * HOLDERS.length)],
        unit: 'shipments',
        values,
        bonus: 3 + Math.floor(random() * 20)
      };
    },
    statement(slots) {
      const target = largest ? 'largest' : 'smallest';
      return `${slots.holder} logged ${renderLedger(slots.values, slots.unit)} this month. ` +
        `The ${target} record is raised by ${slots.bonus} ${slots.unit}. ` +
        'What is the total of all the records after that change?';
    },
    parse(statement) {
      const ledger = /logged (.+) this month\./.exec(statement);
      const change = /The (largest|smallest) record is raised by (\d+) shipments\./.exec(statement);
      const holder = /^([A-Z][a-z]+) logged/.exec(statement);
      if (ledger === null || change === null || holder === null) {
        throw new Error('the statement does not state the records, the raised record and the holder');
      }
      const expected = largest ? 'largest' : 'smallest';
      if (change[1] !== expected) {
        throw new Error(`the statement was parsed by the wrong family: it says "${change[1]}"`);
      }
      const values = readLedger(ledger[1]);
      if (values.some((value) => !Number.isInteger(value))) {
        throw new Error('the statement does not state whole numbers of shipments');
      }
      return { holder: holder[1], unit: 'shipments', values, bonus: Number(change[2]) };
    },
    /** Independent oracle: the chosen extreme found by one comparison walk. */
    solve(slots) {
      let extreme = slots.values[0];
      for (const value of slots.values) {
        if (largest ? value > extreme : value < extreme) {
          extreme = value;
        }
      }
      let total = 0;
      for (const value of slots.values) {
        total += value;
      }
      return { total: total + slots.bonus, raised: extreme + slots.bonus, extreme };
    },
    render(solution) {
      return `The ${largest ? 'largest' : 'smallest'} record becomes ${solution.raised} shipments, so the total is ${solution.total} shipments.`;
    },
    compute: [
      ...probeValues([], 'shipments'),
      'probe(Number.isInteger(slots.bonus) && slots.bonus > 0, "the raise must be a positive whole number of shipments");',
      `let target = values[0];`,
      'for (const value of values) {',
      `  if (${largest ? 'value > target' : 'value < target'}) {`,
      '    target = value;',
      '  }',
      '}',
      'let total = 0;',
      'for (const value of values) {',
      '  total += value;',
      '}',
      'probe(values.filter((value) => value === target).length === 1, "the extreme record must be unique");',
      `return "The ${largest ? 'largest' : 'smallest'} record becomes " + (target + slots.bonus) + " shipments, so the total is " + (total + slots.bonus) + " shipments.";`
    ].join('\n'),
    explain(slots, solution) {
      return [
        `${slots.holder} logged ${slots.values.length} records.`,
        `The ${largest ? 'largest' : 'smallest'} of them is ${solution.extreme} shipments, and it is raised by ${slots.bonus}.`,
        `Every record added up is ${solution.total - slots.bonus} shipments before the raise and ${solution.total} afterwards.`
      ];
    }
  };
}

/**
 * The rate pair: "add N units" and "add N percent" over the same ledger.
 *
 * The decisive word is one token long and the second operand is the same number,
 * so the only difference between the two correct answers is the operation.
 */
function ratePair(mode) {
  const percent = mode === 'percent';
  const familyId = percent ? 'total-plus-a-percentage' : 'total-plus-a-fixed-amount';
  return {
    id: familyId,
    name: percent ? 'Total Plus A Percentage' : 'Total Plus A Fixed Amount',
    type: familyId,
    category: 'no-knowledge',
    pairKind: 'rate-vs-absolute-pair',
    pairRole: percent ? 'percent' : 'absolute',
    pairPartner: percent ? 'total-plus-a-fixed-amount' : 'total-plus-a-percentage',
    difficulty: { subproblems: 2, dependencyDepth: 1, branching: 0, irrelevantInformation: 0, symbolicShare: 0.95 },
    sample(random) {
      let total = 0;
      const values = [];
      while (values.length < 4) {
        const value = 4 + Math.floor(random() * 30);
        if (!values.includes(value)) {
          values.push(value);
        }
      }
      for (const value of values) {
        total += value;
      }
      const factor = 2 + Math.floor(random() * 4);
      const rate = 5 * factor;
      // The percentage must divide the total cleanly, so the oracle stays a whole
      // number, and it must differ from the percentage's own value in units, so the
      // two members of the pair never answer alike: a total of exactly one hundred
      // would make "percent" and "units" agree and the pair unobservable.
      if ((total * rate) % 100 !== 0 || total <= 20 || (total * rate) / 100 === rate) {
        return ratePair(mode).sample(random);
      }
      return {
        workshop: 'printing workshop',
        unit: 'sheets',
        values,
        rate
      };
    },
    statement(slots) {
      const operation = percent ? `${slots.rate} percent of the total` : `${slots.rate} sheets`;
      return `The printing workshop consumed ${renderLedger(slots.values, slots.unit)} on four days. ` +
        `To be safe, order the total plus ${operation} as extra stock. ` +
        'How many sheets must be ordered in all?';
    },
    parse(statement) {
      const consumed = /consumed (.+) on four days\./.exec(statement);
      const extra = /order the total plus (\d+) (percent of the total|sheets) as extra stock\./.exec(statement);
      if (consumed === null || extra === null) {
        throw new Error('the statement does not state the consumed amounts and the extra stock');
      }
      const stated = extra[2] === 'percent of the total' ? 'percent' : 'absolute';
      if (stated !== mode) {
        throw new Error(`the statement was parsed by the wrong family: it asks for "${stated}"`);
      }
      const values = readLedger(consumed[1]);
      if (values.some((value) => !Number.isInteger(value))) {
        throw new Error('the statement does not state whole numbers of sheets');
      }
      return { workshop: 'printing workshop', unit: 'sheets', values, rate: Number(extra[1]) };
    },
    /** Independent oracle: the total first, then the extra computed from it. */
    solve(slots) {
      let total = 0;
      for (const value of slots.values) {
        total += value;
      }
      const extra = percent ? (total * slots.rate) / 100 : slots.rate;
      return { consumed: total, extra, ordered: total + extra };
    },
    render(solution) {
      return `${solution.ordered} sheets must be ordered, which is ${solution.consumed} consumed plus ${solution.extra} extra.`;
    },
    compute: [
      ...probeValues([], 'sheets'),
      'probe(Number.isInteger(slots.rate) && slots.rate > 0, "the extra stock must be a positive whole number");',
      'let consumed = 0;',
      'for (const value of values) {',
      '  consumed += value;',
      '}',
      `const extra = ${percent ? '(consumed * slots.rate) / 100;' : 'slots.rate;'}`,
      `probe(${percent ? 'consumed * slots.rate % 100 === 0' : 'true'}, "the percentage of the total must be a whole number of sheets");`,
      'return (consumed + extra) + " sheets must be ordered, which is " + consumed + " consumed plus " + extra + " extra.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The four days consumed ${slots.values.join(' + ')} sheets, which is ${solution.consumed} sheets.`,
        percent
          ? `${slots.rate} percent of ${solution.consumed} sheets is ${solution.extra} sheets, and that is the extra stock.`
          : `The extra stock is the fixed ${solution.extra} sheets.`,
        `Ordering both is ${solution.ordered} sheets.`
      ];
    }
  };
}

export const families = [
  inclusionPair('above'),
  inclusionPair('at-least'),
  directionPair('largest'),
  directionPair('smallest'),
  ratePair('absolute'),
  ratePair('percent')
];

/** The pair kinds this source contributes, for the split rule and the verifier. */
export const PAIR_KINDS = Object.freeze([
  Object.freeze({
    kind: 'boundary-inclusion-pair',
    members: Object.freeze(['filtered-records-above-a-threshold', 'filtered-records-at-least-a-threshold']),
    decisive: 'the threshold word (above against at least)',
    observable: 'the record equal to the threshold, present in every ledger of the family'
  }),
  Object.freeze({
    kind: 'direction-pair',
    members: Object.freeze(['raised-largest-record', 'raised-smallest-record']),
    decisive: 'the adjective choosing the operand (largest against smallest)',
    observable: 'a ledger whose largest and smallest differ by more than the raise'
  }),
  Object.freeze({
    kind: 'rate-vs-absolute-pair',
    members: Object.freeze(['total-plus-a-percentage', 'total-plus-a-fixed-amount']),
    decisive: 'the unit of the added amount (percent of the total against units)',
    observable: 'a total whose percentage differs from the fixed amount'
  })
]);
