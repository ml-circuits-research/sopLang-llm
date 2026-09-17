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
    template: 'Mean from a frequency table',
    type: 'mean-from-a-frequency-table',
    category: 'knowledge',
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
      const total = slots.entries.reduce((sum, [value, count]) => sum + value * count, 0);
      const observations = slots.entries.reduce((sum, [, count]) => sum + count, 0);
      return { total, observations };
    },
    render(solution) {
      return `${solution.total}/${solution.observations} = ${fractionText(solution.total, solution.observations)}.`;
    },
    facts: MEAN_RULE,
    compute: `${FRACTION_UTILS}
const slots = $slots;
const rule = $facts.meanRule;
const numerator = rule.numerator === "sum" ? slots.entries.reduce((sum, entry) => sum + entry[0] * entry[1], 0) : (() => { throw new Error("unsupported numerator " + rule.numerator); })();
const denominator = rule.denominator === "count" ? slots.entries.reduce((sum, entry) => sum + entry[1], 0) : (() => { throw new Error("unsupported denominator " + rule.denominator); })();
return numerator + "/" + denominator + " = " + fractionText(numerator, denominator) + ".";`,
    explain(slots, solution) {
      return [
        'The statement does not define the mean, so the solution uses the sum of the values divided by how many observations there are.',
        `The table contributes ${slots.entries.map(([value, count]) => `${value}×${count}`).join(' + ')} = ${solution.total} to the sum, over ${solution.observations} observations.`,
        `The mean is ${solution.total}/${solution.observations}, printed as ${fractionText(solution.total, solution.observations)}.`
      ];
    }
  },
  {
    template: 'Reconstruct a missing frequency',
    type: 'reconstruct-a-missing-frequency',
    category: 'no-knowledge',
    parse(statement) {
      const entries = [...statement.matchAll(/([A-Z])=([0-9]+|\?)/g)].map((match) => [match[1], match[2] === '?' ? null : Number(match[2])]);
      const totalMatch = /and total ([0-9]+)/.exec(statement);
      const askedMatch = /frequency of ([A-Z])/.exec(statement);
      if (entries.length === 0 || totalMatch === null || askedMatch === null) {
        throw new Error('the frequencies, the total, or the asked label are missing');
      }
      const unknown = entries.filter(([, frequency]) => frequency === null);
      if (unknown.length !== 1 || unknown[0][0] !== askedMatch[1]) {
        throw new Error('the statement does not ask for the single unknown frequency');
      }
      return { entries, total: Number(totalMatch[1]), label: askedMatch[1] };
    },
    solve(slots) {
      const known = slots.entries.filter(([, frequency]) => frequency !== null).reduce((sum, [, frequency]) => sum + frequency, 0);
      return { missing: slots.total - known };
    },
    render(solution) {
      return `${solution.missing}.`;
    },
    compute: `const slots = $slots;
const known = slots.entries.filter((entry) => entry[1] !== null).reduce((sum, entry) => sum + entry[1], 0);
return String(slots.total - known) + ".";`,
    explain(slots, solution) {
      return [
        'The frequencies of one table must add up to the stated total, so the unknown frequency is what remains.',
        `The known frequencies ${slots.entries.filter(([, frequency]) => frequency !== null).map(([label, frequency]) => `${label}=${frequency}`).join(', ')} add to ${slots.entries.filter(([, frequency]) => frequency !== null).reduce((sum, [, frequency]) => sum + frequency, 0)}.`,
        `The frequency of ${slots.label} is ${slots.total} − ${slots.entries.filter(([, frequency]) => frequency !== null).reduce((sum, [, frequency]) => sum + frequency, 0)} = ${solution.missing}.`
      ];
    }
  },
  {
    template: 'Percent defined as “out of 100”',
    type: 'percent-defined-as-out-of-100',
    category: 'no-knowledge',
    parse(statement) {
      const definition = /([0-9]+)% means [0-9]+ out of 100, or ([0-9]+)\/([0-9]+)/.exec(statement);
      const question = /How much is ([0-9]+)% of ([0-9]+) objects\?/.exec(statement);
      if (definition === null || question === null) {
        throw new Error('the percent definition or the question is missing');
      }
      const percent = Number(definition[1]);
      const askedPercent = Number(question[1]);
      if (percent !== askedPercent) {
        throw new Error('the defined percent and the asked percent disagree');
      }
      return { percent, fraction: [Number(definition[2]), Number(definition[3])], amount: Number(question[2]) };
    },
    solve(slots) {
      return { value: (slots.amount * slots.fraction[0]) / slots.fraction[1] };
    },
    render(solution) {
      return `${solution.value} objects.`;
    },
    compute: `const slots = $slots;
return String(slots.amount * slots.fraction[0] / slots.fraction[1]) + " objects.";`,
    explain(slots, solution) {
      return [
        `The statement fixes the percent locally: ${slots.percent}% is ${slots.fraction[0]}/${slots.fraction[1]} of the whole.`,
        `Taking that fraction of ${slots.amount} objects gives ${slots.amount} × ${slots.fraction[0]}/${slots.fraction[1]} = ${solution.value} objects.`
      ];
    }
  },
  {
    template: 'Percentage from a table',
    type: 'percentage-from-a-table',
    category: 'no-knowledge',
    parse(statement) {
      const match = /Of ([0-9]+) answers, ([0-9]+) are correct/.exec(statement);
      if (match === null) {
        throw new Error('the total answers or the correct answers are missing');
      }
      return { total: Number(match[1]), correct: Number(match[2]) };
    },
    solve(slots) {
      return { percentage: (slots.correct / slots.total) * 100 };
    },
    render(solution) {
      return `${solution.percentage}%`;
    },
    compute: `const slots = $slots;
return String(slots.correct / slots.total * 100) + "%";`,
    explain(slots, solution) {
      return [
        'The statement gives the rule: the fraction correct/total multiplied by 100.',
        `The fraction is ${slots.correct}/${slots.total}, and multiplying it by 100 gives ${solution.percentage}%.`
      ];
    }
  },
  {
    template: 'Original total from a percentage',
    type: 'original-total-from-a-percentage',
    category: 'no-knowledge',
    parse(statement) {
      const amountMatch = /([0-9]+) objects represent ([0-9]+)% of the total/.exec(statement);
      const fractionMatch = /([0-9]+)%=([0-9]+)\/([0-9]+)/.exec(statement);
      if (amountMatch === null || fractionMatch === null) {
        throw new Error('the amount, the percentage, or the fraction are missing');
      }
      if (Number(amountMatch[2]) !== Number(fractionMatch[1])) {
        throw new Error('the percentage and the stated fraction describe different parts');
      }
      return { amount: Number(amountMatch[1]), percent: Number(amountMatch[2]), fraction: [Number(fractionMatch[2]), Number(fractionMatch[3])] };
    },
    solve(slots) {
      return { total: (slots.amount * slots.fraction[1]) / slots.fraction[0] };
    },
    render(solution) {
      return `${solution.total}.`;
    },
    compute: `const slots = $slots;
return String(slots.amount * slots.fraction[1] / slots.fraction[0]) + ".";`,
    explain(slots, solution) {
      return [
        `The problem supplies the conversion locally: ${slots.percent}% is the same as ${slots.fraction[0]}/${slots.fraction[1]}.`,
        `So ${slots.fraction[0]}/${slots.fraction[1]} of the total is ${slots.amount}, which means the total is ${slots.amount} × ${slots.fraction[1]}/${slots.fraction[0]} = ${solution.total}.`
      ];
    }
  },
  {
    template: 'Compare two groups by percentage, not absolute count',
    type: 'compare-two-groups-by-percentage-not-absolute-count',
    category: 'no-knowledge',
    parse(statement) {
      const match = /Class ([A-Z]) has ([0-9]+) correct answers out of ([0-9]+)\. Class ([A-Z]) has ([0-9]+) out of ([0-9]+)\./.exec(statement);
      if (match === null) {
        throw new Error('the two classes with their counts are missing');
      }
      return {
        groups: [
          [match[1], Number(match[2]), Number(match[3])],
          [match[4], Number(match[5]), Number(match[6])]
        ]
      };
    },
    solve(slots) {
      const [first, second] = slots.groups;
      const proportion = (group) => group[1] / group[2];
      if (proportion(first) === proportion(second)) {
        throw new Error('the two proportions are equal');
      }
      return { larger: proportion(first) > proportion(second) ? first[0] : second[0] };
    },
    render(solution) {
      return `Class ${solution.larger}.`;
    },
    compute: `const slots = $slots;
const first = slots.groups[0];
const second = slots.groups[1];
const firstShare = first[1] / first[2];
const secondShare = second[1] / second[2];
if (firstShare === secondShare) {
  throw new Error("the two proportions are equal");
}
return "Class " + (firstShare > secondShare ? first[0] : second[0]) + ".";`,
    explain(slots, solution) {
      return [
        'The absolute counts cannot be compared directly because the classes answered different numbers of questions, so the shares are compared instead.',
        `Class ${slots.groups[0][0]} has ${slots.groups[0][1]}/${slots.groups[0][2]} correct and class ${slots.groups[1][0]} has ${slots.groups[1][1]}/${slots.groups[1][2]} correct.`,
        `The larger proportion belongs to class ${solution.larger}, even though the other class has more correct answers in absolute terms.`
      ];
    }
  },
  {
    template: 'Sample and population defined',
    type: 'sample-and-population-defined',
    category: 'no-knowledge',
    parse(statement) {
      const match = /A school has ([0-9]+) students\. We survey ([0-9]+)\./.exec(statement);
      if (match === null) {
        throw new Error('the number of students or the number surveyed is missing');
      }
      return { students: Number(match[1]), surveyed: Number(match[2]) };
    },
    solve(slots) {
      return { population: slots.students, sample: slots.surveyed };
    },
    render(solution) {
      return `Population: ${solution.population}; sample: ${solution.sample}.`;
    },
    compute: `const slots = $slots;
return "Population: " + slots.students + "; sample: " + slots.surveyed + ".";`,
    explain(slots, solution) {
      return [
        'The statement defines the population as everyone we want to learn about and the sample as those actually measured.',
        `The whole school of ${slots.students} students is the population, and the ${slots.surveyed} students who are surveyed form the sample.`
      ];
    }
  },
  {
    template: 'Biased sample under an explicit selection rule',
    type: 'biased-sample-under-an-explicit-selection-rule',
    category: 'no-knowledge',
    parse(statement) {
      const selectionMatch = /survey only ([^.]*)/.exec(statement);
      if (selectionMatch === null) {
        throw new Error('the selection rule of the sample is missing');
      }
      return {
        selectedByBehaviour: /who are already/.test(selectionMatch[1]),
        mayDiffer: /may have different preferences/.test(statement)
      };
    },
    solve(slots) {
      return { representative: !(slots.selectedByBehaviour && slots.mayDiffer) };
    },
    render(solution) {
      return solution.representative
        ? 'It is guaranteed to be representative.'
        : 'It is not guaranteed to be representative.';
    },
    compute: `const slots = $slots;
const representative = !(slots.selectedByBehaviour && slots.mayDiffer);
return representative ? "It is guaranteed to be representative." : "It is not guaranteed to be representative.";`,
    explain(slots, solution) {
      return [
        'The sample is chosen by a behaviour that is related to the question: the students are surveyed only where the question is about going.',
        'The statement also warns that those students may have different preferences from the students who do not go there.',
        'A group that may differ from the population in exactly the measured preference is not guaranteed to represent it, so the answer is that it is not guaranteed to be representative.'
      ];
    }
  },
  {
    template: 'Correlation described, not causation demonstrated',
    type: 'correlation-described-not-causation-demonstrated',
    category: 'knowledge',
    parse(statement) {
      return {
        observedAssociation: /In a table,/.test(statement),
        causalQuestion: /makes the [a-z]+ rise/.test(statement)
      };
    },
    solve(slots) {
      const canConclude = slots.causalQuestion && slots.observedAssociation ? false : true;
      return { canConclude };
    },
    render(solution) {
      return solution.canConclude ? 'Yes.' : 'No.';
    },
    facts: JSON.stringify({ associationImpliesCausation: false }),
    compute: `const slots = $slots;
const canConclude = slots.causalQuestion && slots.observedAssociation ? $facts.associationImpliesCausation : true;
return canConclude ? "Yes." : "No.";`,
    explain(slots, solution) {
      return [
        'The table records only that two quantities move together, which is an association, and the question asks for a causal direction.',
        'The unstated principle is that an observed association does not by itself establish causation, so the fact table carries it as false.',
        'Because the evidence is only an association, the table alone cannot support the causal conclusion, and the answer is no.'
      ];
    }
  }
];

