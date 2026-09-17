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
    template: 'Arithmetic mean defined by dividing the sum',
    type: 'arithmetic-mean-defined-by-dividing-the-sum',
    category: 'no-knowledge',
    parse(statement) {
      const match = /What is the mean of ([0-9]+(?:,\s*[0-9]+)*)\?/.exec(statement);
      if (match === null) {
        throw new Error('the list of numbers whose mean is asked for is missing');
      }
      return { values: numbersFrom(match[1]) };
    },
    solve(slots) {
      const total = slots.values.reduce((sum, value) => sum + value, 0);
      if (total % slots.values.length !== 0) {
        throw new Error('the mean of the given numbers is not a whole number');
      }
      return { mean: total / slots.values.length };
    },
    render(solution) {
      return `${solution.mean}.`;
    },
    compute: `const slots = $slots;
const total = slots.values.reduce((sum, value) => sum + value, 0);
if (total % slots.values.length !== 0) {
  throw new Error("the mean of the given numbers is not a whole number");
}
return String(total / slots.values.length) + ".";`,
    explain(slots, solution) {
      return [
        'The statement defines the mean as the sum divided by how many numbers there are, so no outside rule is needed.',
        `Adding ${slots.values.join(' + ')} gives ${slots.values.reduce((sum, value) => sum + value, 0)}, and dividing by the ${slots.values.length} values gives ${solution.mean}.`
      ];
    }
  },
  {
    template: 'Mean as balancing',
    type: 'mean-as-balancing',
    category: 'no-knowledge',
    parse(statement) {
      const match = /contain ([0-9]+(?:,\s*[0-9]+)*(?:,?\s+and\s+[0-9]+)?) balls/.exec(statement);
      if (match === null) {
        throw new Error('the number of balls in each box is missing');
      }
      return { values: numbersFrom(match[1]) };
    },
    solve(slots) {
      const total = slots.values.reduce((sum, value) => sum + value, 0);
      if (total % slots.values.length !== 0) {
        throw new Error('the balls do not split into equal whole shares');
      }
      return { each: total / slots.values.length };
    },
    render(solution) {
      return `${solution.each} balls.`;
    },
    compute: `const slots = $slots;
const total = slots.values.reduce((sum, value) => sum + value, 0);
if (total % slots.values.length !== 0) {
  throw new Error("the balls do not split into equal whole shares");
}
return String(total / slots.values.length) + " balls.";`,
    explain(slots, solution) {
      return [
        `Redistributing without loss keeps the total of ${slots.values.reduce((sum, value) => sum + value, 0)} balls unchanged, and "the same number in every box" means sharing it equally among ${slots.values.length} boxes.`,
        `The equal share is ${solution.each} balls, and ${solution.each} × ${slots.values.length} returns the original total as a check.`
      ];
    }
  },
  {
    template: 'Missing value from a mean',
    type: 'missing-value-from-a-mean',
    category: 'knowledge',
    parse(statement) {
      const countMatch = /The mean of (\w+) numbers is ([0-9.]+)/.exec(statement);
      const knownMatch = /(\w+) of them are ([0-9.]+) and ([0-9.]+)/.exec(statement);
      if (countMatch === null || knownMatch === null) {
        throw new Error('the count, the mean, or the known values are missing');
      }
      const count = NUMBER_WORDS.get(countMatch[1].toLowerCase());
      const knownCount = NUMBER_WORDS.get(knownMatch[1].toLowerCase());
      if (count === undefined || knownCount === undefined) {
        throw new Error('the number word in the statement is not recognized');
      }
      const known = [Number(knownMatch[2]), Number(knownMatch[3])];
      if (known.length !== knownCount || count !== known.length + 1) {
        throw new Error('the statement does not describe exactly one missing value');
      }
      return { count, mean: Number(countMatch[2]), known };
    },
    solve(slots) {
      const total = slots.count * slots.mean;
      return { missing: total - slots.known.reduce((sum, value) => sum + value, 0) };
    },
    render(solution) {
      return `${solution.missing}.`;
    },
    facts: MEAN_RULE,
    compute: `const slots = $slots;
const rule = $facts.meanRule;
const count = rule.denominator === "count" ? slots.count : (() => { throw new Error("unsupported denominator " + rule.denominator); })();
const total = rule.numerator === "sum" ? slots.mean * count : (() => { throw new Error("unsupported numerator " + rule.numerator); })();
const known = slots.known.reduce((sum, value) => sum + value, 0);
return String(total - known) + ".";`,
    explain(slots, solution) {
      return [
        `The statement gives the mean but not its definition, so the solution uses the rule that the mean of ${slots.count} numbers is their sum divided by ${slots.count}.`,
        `The full sum is therefore ${slots.count} × ${slots.mean} = ${slots.count * slots.mean}, and the two known values add to ${slots.known.reduce((sum, value) => sum + value, 0)}.`,
        `The missing number is ${slots.count * slots.mean} − ${slots.known.reduce((sum, value) => sum + value, 0)} = ${solution.missing}.`
      ];
    }
  },
  {
    template: 'The mean changes when a value is added',
    type: 'the-mean-changes-when-a-value-is-added',
    category: 'knowledge',
    parse(statement) {
      const valuesMatch = /The values ([0-9]+(?:,\s*[0-9]+)*(?:\s+and\s+[0-9]+)?) have mean ([0-9.]+)/.exec(statement);
      const addedMatch = /We add the value ([0-9.]+)/.exec(statement);
      if (valuesMatch === null || addedMatch === null) {
        throw new Error('the original values, their mean, or the added value are missing');
      }
      const values = numbersFrom(valuesMatch[1]);
      const oldMean = Number(valuesMatch[2]);
      const sum = values.reduce((total, value) => total + value, 0);
      if (sum / values.length !== oldMean) {
        throw new Error('the values and the stated mean disagree');
      }
      return { values, oldMean, added: Number(addedMatch[1]) };
    },
    solve(slots) {
      const total = slots.values.reduce((sum, value) => sum + value, 0) + slots.added;
      return { total, count: slots.values.length + 1 };
    },
    render(solution) {
      return `${solution.total}/${solution.count} = ${fractionText(solution.total, solution.count)}.`;
    },
    facts: MEAN_RULE,
    compute: `${FRACTION_UTILS}
const slots = $slots;
const rule = $facts.meanRule;
const numerator = rule.numerator === "sum" ? slots.values.reduce((sum, value) => sum + value, 0) + slots.added : (() => { throw new Error("unsupported numerator " + rule.numerator); })();
const denominator = rule.denominator === "count" ? slots.values.length + 1 : (() => { throw new Error("unsupported denominator " + rule.denominator); })();
return numerator + "/" + denominator + " = " + fractionText(numerator, denominator) + ".";`,
    explain(slots, solution) {
      return [
        'The mean is not defined in this statement, so the solution applies the rule that it is the sum divided by the count.',
        `The old values add to ${slots.values.reduce((sum, value) => sum + value, 0)}; adding ${slots.added} gives ${solution.total}, and there are now ${solution.count} values.`,
        `The new mean is ${solution.total}/${solution.count}, which the book prints as ${fractionText(solution.total, solution.count)}.`
      ];
    }
  },
  {
    template: 'The mean need not be one of the observed values',
    type: 'the-mean-need-not-be-one-of-the-observed-values',
    category: 'knowledge',
    parse(statement) {
      const match = /The data are ([0-9]+) and ([0-9]+)/.exec(statement);
      if (match === null) {
        throw new Error('the data values are missing');
      }
      return { values: [Number(match[1]), Number(match[2])] };
    },
    solve(slots) {
      const mean = slots.values.reduce((sum, value) => sum + value, 0) / slots.values.length;
      return { mean, observed: slots.values.includes(mean) };
    },
    render(solution) {
      return `${solution.observed ? 'Yes' : 'No'}; the mean is ${solution.mean}.`;
    },
    facts: MEAN_RULE,
    compute: `const slots = $slots;
const rule = $facts.meanRule;
const numerator = rule.numerator === "sum" ? slots.values.reduce((sum, value) => sum + value, 0) : (() => { throw new Error("unsupported numerator " + rule.numerator); })();
const denominator = rule.denominator === "count" ? slots.values.length : (() => { throw new Error("unsupported denominator " + rule.denominator); })();
const mean = numerator / denominator;
const observed = slots.values.includes(mean);
return (observed ? "Yes" : "No") + "; the mean is " + mean + ".";`,
    explain(slots, solution) {
      return [
        'The statement does not define the mean, so the solution uses the rule that it is the sum of the data divided by their count.',
        `Here the mean is (${slots.values.join(' + ')}) / ${slots.values.length} = ${solution.mean}, which is not one of the observed values ${slots.values.join(', ')}.`,
        'That is why the answer is no: the mean may fall between the observations.'
      ];
    }
  },
  {
    template: 'Median of an ordered list',
    type: 'median-of-an-ordered-list',
    category: 'no-knowledge',
    parse(statement) {
      const match = /For ([0-9]+(?:,[0-9]+)*),? what is the median\?/.exec(statement);
      if (match === null) {
        throw new Error('the list of values is missing');
      }
      return { values: numbersFrom(match[1]) };
    },
    solve(slots) {
      const ordered = [...slots.values].sort((a, b) => a - b);
      if (ordered.length % 2 === 0) {
        throw new Error('the statement defines the median only for an odd number of values');
      }
      return { median: ordered[(ordered.length - 1) / 2] };
    },
    render(solution) {
      return `${solution.median}.`;
    },
    compute: `const slots = $slots;
const ordered = [...slots.values].sort((a, b) => a - b);
if (ordered.length % 2 === 0) {
  throw new Error("the statement defines the median only for an odd number of values");
}
return String(ordered[(ordered.length - 1) / 2]) + ".";`,
    explain(slots, solution) {
      return [
        'The definition given in the statement sorts the list and takes the middle value.',
        `Sorting ${slots.values.join(', ')} gives ${[...slots.values].sort((a, b) => a - b).join(', ')}, and the middle of the ${slots.values.length} values is ${solution.median}.`
      ];
    }
  },
  {
    template: 'Median with an even number of values',
    type: 'median-with-an-even-number-of-values',
    category: 'no-knowledge',
    parse(statement) {
      const match = /What is the median of ([0-9]+(?:,[0-9]+)*)\?/.exec(statement);
      if (match === null) {
        throw new Error('the list of values is missing');
      }
      return { values: numbersFrom(match[1]) };
    },
    solve(slots) {
      const ordered = [...slots.values].sort((a, b) => a - b);
      if (ordered.length % 2 !== 0) {
        throw new Error('the statement defines the even case only');
      }
      const middle = ordered.length / 2;
      return { median: (ordered[middle - 1] + ordered[middle]) / 2 };
    },
    render(solution) {
      return `${solution.median}.`;
    },
    compute: `const slots = $slots;
const ordered = [...slots.values].sort((a, b) => a - b);
if (ordered.length % 2 !== 0) {
  throw new Error("the statement defines the even case only");
}
const middle = ordered.length / 2;
return String((ordered[middle - 1] + ordered[middle]) / 2) + ".";`,
    explain(slots, solution) {
      return [
        'The statement defines the median for an even list as the mean of the two central values, so no outside rule is needed.',
        `Sorting gives ${[...slots.values].sort((a, b) => a - b).join(', ')} with central values ${[...slots.values].sort((a, b) => a - b)[1]} and ${[...slots.values].sort((a, b) => a - b)[2]}.`,
        `Their mean is their sum divided by two, so the median is ${solution.median}.`
      ];
    }
  },
  {
    template: 'Mode as the most frequent value',
    type: 'mode-as-the-most-frequent-value',
    category: 'no-knowledge',
    parse(statement) {
      const match = /For ([0-9]+(?:,[0-9]+)*),? what is the mode\?/.exec(statement);
      if (match === null) {
        throw new Error('the list of values is missing');
      }
      return { values: numbersFrom(match[1]) };
    },
    solve(slots) {
      const modes = mostFrequent(slots.values);
      if (modes.length !== 1) {
        throw new Error(`the data have ${modes.length} most frequent values instead of one`);
      }
      return { mode: modes[0] };
    },
    render(solution) {
      return `${solution.mode}.`;
    },
    compute: `const slots = $slots;
const counts = new Map();
for (const value of slots.values) {
  counts.set(value, (counts.get(value) || 0) + 1);
}
const highest = Math.max(...counts.values());
const modes = [...counts].filter(([, count]) => count === highest).map(([value]) => value).sort((a, b) => a - b);
if (modes.length !== 1) {
  throw new Error("the data have " + modes.length + " most frequent values instead of one");
}
return String(modes[0]) + ".";`,
    explain(slots, solution) {
      return [
        'The statement defines the mode as the value that appears most often, so only counting is needed.',
        `Counting the data ${slots.values.join(', ')} shows that ${solution.mode} appears more often than every other value, so it is the mode.`
      ];
    }
  },
];

