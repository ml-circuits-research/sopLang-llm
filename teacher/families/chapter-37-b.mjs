/**
 * Families for chapter 37 of the mathematical seed book: elementary statistics
 * and data interpretation.
 *
 * A family covers one printed template. It provides the reference parse that a
 * `modelCall` stage would perform, an independent computation, the answer text
 * the source prints, the SOP Lang computation body that the circuit executes,
 * and the explanation lines of the example. Templates whose statement defines
 * the statistic they use are `no-knowledge`. Templates that rely on a rule the
 * statement omits, such as the mean formula or the association-to-causation
 * principle, are `knowledge`: they carry a `@facts literal` wire whose JSON
 * table materializes the missing rule, and the computation reads it as `$facts`.
 */

export const chapter = 37;

const NUMBER_WORDS = new Map([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
  ['ten', 10]
]);

const REPEAT_WORDS = new Map([
  ['once', 1],
  ['twice', 2],
  ['thrice', 3]
]);

const VULGAR_FRACTION = new Map([
  ['1/2', '½'],
  ['1/3', '⅓'],
  ['2/3', '⅔'],
  ['1/4', '¼'],
  ['3/4', '¾'],
  ['1/5', '⅕'],
  ['2/5', '⅖'],
  ['3/5', '⅗'],
  ['4/5', '⅘'],
  ['1/6', '⅙'],
  ['5/6', '⅚'],
  ['1/8', '⅛'],
  ['3/8', '⅜'],
  ['5/8', '⅝'],
  ['7/8', '⅞']
]);

const MEAN_RULE = JSON.stringify({ meanRule: { numerator: 'sum', denominator: 'count' } });
const MEDIAN_RULE = JSON.stringify({ medianRule: { odd: 'middle', even: 'mean-of-two-central' } });
const RANGE_RULE = JSON.stringify({ rangeRule: { from: 'max', to: 'min', combine: 'difference' } });

function greatestCommonDivisor(left, right) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

/** The printed book writes a mixed number with one Unicode fraction glyph. */
function fractionText(numerator, denominator) {
  const divisor = greatestCommonDivisor(numerator, denominator);
  const num = numerator / divisor;
  const den = denominator / divisor;
  if (den === 1) {
    return String(num);
  }
  const whole = Math.trunc(num / den);
  const remainder = num - whole * den;
  const glyph = VULGAR_FRACTION.get(`${remainder}/${den}`);
  const tail = glyph === undefined ? `${remainder}/${den}` : glyph;
  return whole === 0 ? tail : `${whole}${tail}`;
}

function numbersFrom(text) {
  return text
    .split(/,\s*and\s+|,\s*|\s+and\s+/)
    .map((piece) => piece.trim())
    .filter((piece) => piece !== '')
    .map(Number);
}

function frequencyFrom(token) {
  if (/^[0-9]+$/.test(token)) {
    return Number(token);
  }
  if (!REPEAT_WORDS.has(token)) {
    throw new Error(`unknown frequency word "${token}"`);
  }
  return REPEAT_WORDS.get(token);
}

function mostFrequent(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const highest = Math.max(...counts.values());
  return [...counts.entries()].filter(([, count]) => count === highest).map(([value]) => value).sort((a, b) => a - b);
}

/** Sandbox copy of `fractionText`, because the compute body runs isolated. */
const FRACTION_UTILS = `const VULGAR_FRACTION = new Map([["1/2", "½"], ["1/3", "⅓"], ["2/3", "⅔"], ["1/4", "¼"], ["3/4", "¾"], ["1/5", "⅕"], ["2/5", "⅖"], ["3/5", "⅗"], ["4/5", "⅘"], ["1/6", "⅙"], ["5/6", "⅚"], ["1/8", "⅛"], ["3/8", "⅜"], ["5/8", "⅝"], ["7/8", "⅞"]]);
function fractionText(numerator, denominator) {
  let a = Math.abs(numerator);
  let b = Math.abs(denominator);
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  const num = numerator / a;
  const den = denominator / a;
  if (den === 1) {
    return String(num);
  }
  const whole = Math.trunc(num / den);
  const remainder = num - whole * den;
  const glyph = VULGAR_FRACTION.get(remainder + "/" + den);
  const tail = glyph === undefined ? remainder + "/" + den : glyph;
  return whole === 0 ? tail : String(whole) + tail;
}`;

export const cases = [
  {
    template: 'Two modes',
    type: 'two-modes',
    category: 'no-knowledge',
    parse(statement) {
      const match = /The data are ([0-9]+(?:,[0-9]+)*)\./.exec(statement);
      if (match === null) {
        throw new Error('the list of values is missing');
      }
      return { values: numbersFrom(match[1]) };
    },
    solve(slots) {
      return { modes: mostFrequent(slots.values) };
    },
    render(solution) {
      return `${solution.modes.join(' and ')}.`;
    },
    compute: `const slots = $slots;
const counts = new Map();
for (const value of slots.values) {
  counts.set(value, (counts.get(value) || 0) + 1);
}
const highest = Math.max(...counts.values());
const modes = [...counts].filter(([, count]) => count === highest).map(([value]) => value).sort((a, b) => a - b);
return modes.join(" and ") + ".";`,
    explain(slots, solution) {
      return [
        'The quoted definition keeps every value that is tied for the highest count, rather than a single winner.',
        `In ${slots.values.join(', ')} the values ${solution.modes.join(' and ')} each appear twice, more often than any other value.`,
        `Both are reported as modes: ${solution.modes.join(' and ')}.`
      ];
    }
  },
  {
    template: 'Range as maximum minus minimum',
    type: 'range-as-maximum-minus-minimum',
    category: 'no-knowledge',
    parse(statement) {
      const match = /For ([0-9]+(?:,[0-9]+)*),? what is the range\?/.exec(statement);
      if (match === null) {
        throw new Error('the list of values is missing');
      }
      return { values: numbersFrom(match[1]) };
    },
    solve(slots) {
      return { range: Math.max(...slots.values) - Math.min(...slots.values) };
    },
    render(solution) {
      return `${solution.range}.`;
    },
    compute: `const slots = $slots;
return String(Math.max(...slots.values) - Math.min(...slots.values)) + ".";`,
    explain(slots, solution) {
      return [
        'The statement defines the range as the maximum value minus the minimum value.',
        `The largest value is ${Math.max(...slots.values)} and the smallest is ${Math.min(...slots.values)}, so the range is ${solution.range}.`
      ];
    }
  },
  {
    template: 'Same mean, different spread',
    type: 'same-mean-different-spread',
    category: 'knowledge',
    parse(statement) {
      const match = /Set A is ([0-9]+(?:,[0-9]+)*); set B is ([0-9]+(?:,[0-9]+)*)\./.exec(statement);
      if (match === null) {
        throw new Error('the two data sets are missing');
      }
      return { setA: numbersFrom(match[1]), setB: numbersFrom(match[2]) };
    },
    solve(slots) {
      const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
      const range = (values) => Math.max(...values) - Math.min(...values);
      return { sameMean: mean(slots.setA) === mean(slots.setB), sameRange: range(slots.setA) === range(slots.setB) };
    },
    render(solution) {
      return `The mean is ${solution.sameMean ? 'the same' : 'not the same'}; the range is ${solution.sameRange ? 'the same' : 'not'}.`;
    },
    facts: JSON.stringify({ meanRule: { numerator: 'sum', denominator: 'count' }, rangeRule: { from: 'max', to: 'min', combine: 'difference' } }),
    compute: `const slots = $slots;
const meanRule = $facts.meanRule;
const rangeRule = $facts.rangeRule;
const mean = (values) => {
  const numerator = meanRule.numerator === "sum" ? values.reduce((sum, value) => sum + value, 0) : (() => { throw new Error("unsupported numerator " + meanRule.numerator); })();
  const denominator = meanRule.denominator === "count" ? values.length : (() => { throw new Error("unsupported denominator " + meanRule.denominator); })();
  return numerator / denominator;
};
const range = (values) => {
  const from = rangeRule.from === "max" ? Math.max(...values) : (() => { throw new Error("unsupported range from " + rangeRule.from); })();
  const to = rangeRule.to === "min" ? Math.min(...values) : (() => { throw new Error("unsupported range to " + rangeRule.to); })();
  return rangeRule.combine === "difference" ? from - to : (() => { throw new Error("unsupported range combine " + rangeRule.combine); })();
};
return "The mean is " + (mean(slots.setA) === mean(slots.setB) ? "the same" : "not the same") +
  "; the range is " + (range(slots.setA) === range(slots.setB) ? "the same" : "not") + ".";`,
    explain(slots, solution) {
      return [
        'The two statistics are not defined here, so the solution uses the mean as sum divided by count and the range as maximum minus minimum.',
        `Both sets have mean ${slots.setA.reduce((sum, value) => sum + value, 0) / slots.setA.length} = ${slots.setB.reduce((sum, value) => sum + value, 0) / slots.setB.length}, so the means agree.`,
        `The ranges are ${Math.max(...slots.setA) - Math.min(...slots.setA)} and ${Math.max(...slots.setB) - Math.min(...slots.setB)}, so the spreads differ.`
      ];
    }
  },
  {
    template: 'Effect of an outlier on the mean',
    type: 'effect-of-an-outlier-on-the-mean',
    category: 'knowledge',
    parse(statement) {
      const valuesMatch = /The data are ([0-9]+(?:,[0-9]+)*) with mean ([0-9.]+)\./.exec(statement);
      const addedMatch = /We add ([0-9.]+)\./.exec(statement);
      if (valuesMatch === null || addedMatch === null) {
        throw new Error('the data, their mean, or the added value are missing');
      }
      const values = numbersFrom(valuesMatch[1]);
      const oldMean = Number(valuesMatch[2]);
      if (values.reduce((sum, value) => sum + value, 0) / values.length !== oldMean) {
        throw new Error('the data and the stated mean disagree');
      }
      return { values, oldMean, added: Number(addedMatch[1]) };
    },
    solve(slots) {
      const newMean = (slots.values.reduce((sum, value) => sum + value, 0) + slots.added) / (slots.values.length + 1);
      const direction = newMean > slots.oldMean ? 'increases' : newMean < slots.oldMean ? 'decreases' : 'does not change';
      return { newMean, direction };
    },
    render(solution) {
      return `${solution.newMean}; the mean ${solution.direction}.`;
    },
    facts: MEAN_RULE,
    compute: `const slots = $slots;
const rule = $facts.meanRule;
const numerator = rule.numerator === "sum" ? slots.values.reduce((sum, value) => sum + value, 0) + slots.added : (() => { throw new Error("unsupported numerator " + rule.numerator); })();
const denominator = rule.denominator === "count" ? slots.values.length + 1 : (() => { throw new Error("unsupported denominator " + rule.denominator); })();
const newMean = numerator / denominator;
const direction = newMean > slots.oldMean ? "increases" : (newMean < slots.oldMean ? "decreases" : "does not change");
return newMean + "; the mean " + direction + ".";`,
    explain(slots, solution) {
      return [
        'The mean is not defined in this statement, so the solution computes the sum divided by the count.',
        `The values ${slots.values.join(', ')} add to ${slots.values.reduce((sum, value) => sum + value, 0)}; adding the outlier ${slots.added} gives ${slots.values.reduce((sum, value) => sum + value, 0) + slots.added} over ${slots.values.length + 1} values.`,
        `The new mean is ${solution.newMean}, larger than the old mean ${slots.oldMean}, so the mean ${solution.direction}.`
      ];
    }
  },
  {
    template: 'Effect of an outlier on the median',
    type: 'effect-of-an-outlier-on-the-median',
    category: 'knowledge',
    parse(statement) {
      const valuesMatch = /The list ([0-9]+(?:,[0-9]+)*) has median ([0-9.]+)\./.exec(statement);
      const addedMatch = /We add ([0-9.]+)/.exec(statement);
      if (valuesMatch === null || addedMatch === null) {
        throw new Error('the list, its median, or the added value are missing');
      }
      return { values: numbersFrom(valuesMatch[1]), oldMedian: Number(valuesMatch[2]), added: Number(addedMatch[1]) };
    },
    solve(slots) {
      const ordered = [...slots.values, slots.added].sort((a, b) => a - b);
      if (ordered.length % 2 !== 0) {
        throw new Error('the median rule for an even list of values is required');
      }
      const middle = ordered.length / 2;
      return { median: (ordered[middle - 1] + ordered[middle]) / 2 };
    },
    render(solution) {
      return `${solution.median}.`;
    },
    facts: MEDIAN_RULE,
    compute: `const slots = $slots;
const rule = $facts.medianRule;
const ordered = [...slots.values, slots.added].sort((a, b) => a - b);
if (ordered.length % 2 !== 0) {
  throw new Error("the median rule for an even list of values is required");
}
const middle = ordered.length / 2;
const median = rule.even === "mean-of-two-central" ? (ordered[middle - 1] + ordered[middle]) / 2 : (() => { throw new Error("unsupported even median rule " + rule.even); })();
return String(median) + ".";`,
    explain(slots, solution) {
      return [
        'The statement asks for the median rule for four values, which it assumes but does not restate, so the solution uses the mean of the two central values.',
        `After adding ${slots.added} the ordered list is ${[...slots.values, slots.added].sort((a, b) => a - b).join(', ')}, whose central values are ${[...slots.values, slots.added].sort((a, b) => a - b)[1]} and ${[...slots.values, slots.added].sort((a, b) => a - b)[2]}.`,
        `Their mean is ${solution.median}, which is the new median.`
      ];
    }
  },
  {
    template: 'Weighted data through repetition',
    type: 'weighted-data-through-repetition',
    category: 'knowledge',
    parse(statement) {
      const match = /grade ([0-9]+) (\w+) and grade ([0-9]+) (\w+)/.exec(statement);
      if (match === null) {
        throw new Error('the grades or their repetitions are missing');
      }
      const repetitions = [frequencyFrom(match[2]), frequencyFrom(match[4])];
      return { grades: [[Number(match[1]), repetitions[0]], [Number(match[3]), repetitions[1]]] };
    },
    solve(slots) {
      const values = [];
      for (const [grade, repetitions] of slots.grades) {
        for (let index = 0; index < repetitions; index += 1) {
          values.push(grade);
        }
      }
      const total = values.reduce((sum, value) => sum + value, 0);
      return { total, count: values.length };
    },
    render(solution) {
      return `${fractionText(solution.total, solution.count)}.`;
    },
    facts: MEAN_RULE,
    compute: `${FRACTION_UTILS}
const slots = $slots;
const rule = $facts.meanRule;
const values = [];
for (const entry of slots.grades) {
  for (let index = 0; index < entry[1]; index += 1) {
    values.push(entry[0]);
  }
}
const numerator = rule.numerator === "sum" ? values.reduce((sum, value) => sum + value, 0) : (() => { throw new Error("unsupported numerator " + rule.numerator); })();
const denominator = rule.denominator === "count" ? values.length : (() => { throw new Error("unsupported denominator " + rule.denominator); })();
return fractionText(numerator, denominator) + ".";`,
    explain(slots, solution) {
      return [
        'Each grade is treated as equally weighted, which means the grade is written once for every time it occurs.',
        `The repeated list is ${slots.grades.map(([grade, repetitions]) => Array.from({ length: repetitions }, () => grade).join(', ')).join(', ')}, and its sum is ${solution.total} over ${solution.count} grades.`,
        `The mean is ${solution.total}/${solution.count}, printed as ${fractionText(solution.total, solution.count)}.`
      ];
    }
  },
  {
    template: 'Weighted mean defined by weights',
    type: 'weighted-mean-defined-by-weights',
    category: 'no-knowledge',
    parse(statement) {
      const entries = [...statement.matchAll(/([0-9]+) with weight ([0-9]+)/g)].map((match) => [Number(match[1]), Number(match[2])]);
      if (entries.length === 0) {
        throw new Error('the values and their weights are missing');
      }
      return { entries };
    },
    solve(slots) {
      const weighted = slots.entries.reduce((sum, [value, weight]) => sum + value * weight, 0);
      const weights = slots.entries.reduce((sum, [, weight]) => sum + weight, 0);
      return { weighted, weights };
    },
    render(solution) {
      return `${fractionText(solution.weighted, solution.weights)}.`;
    },
    compute: `${FRACTION_UTILS}
const slots = $slots;
const weighted = slots.entries.reduce((sum, entry) => sum + entry[0] * entry[1], 0);
const weights = slots.entries.reduce((sum, entry) => sum + entry[1], 0);
return fractionText(weighted, weights) + ".";`,
    explain(slots, solution) {
      return [
        'The statement defines the weighted mean as the sum of value×weight divided by the sum of the weights.',
        `The weighted numerator is ${slots.entries.map(([value, weight]) => `${value}×${weight}`).join(' + ')} = ${solution.weighted}, and the weights add to ${solution.weights}.`,
        `The mean is ${solution.weighted}/${solution.weights}, printed as ${fractionText(solution.weighted, solution.weights)}.`
      ];
    }
  },
  {
    template: 'Frequency from a table',
    type: 'frequency-from-a-table',
    category: 'no-knowledge',
    parse(statement) {
      const entries = [...statement.matchAll(/value ([0-9]+) appears ([0-9]+|once|twice|thrice)/gi)].map((match) => [
        Number(match[1]),
        frequencyFrom(match[2])
      ]);
      if (entries.length === 0) {
        throw new Error('the frequency table is missing');
      }
      return { entries };
    },
    solve(slots) {
      return { total: slots.entries.reduce((sum, [, count]) => sum + count, 0) };
    },
    render(solution) {
      return `${solution.total} observations.`;
    },
    compute: `const slots = $slots;
const total = slots.entries.reduce((sum, entry) => sum + entry[1], 0);
return total + " observations.";`,
    explain(slots, solution) {
      return [
        'The total number of observations is the sum of the frequencies in the table.',
        `Adding the frequencies ${slots.entries.map(([, count]) => count).join(' + ')} gives ${solution.total} observations.`
      ];
    }
  },
];

