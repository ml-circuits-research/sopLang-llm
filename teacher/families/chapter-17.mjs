/**
 * Families for chapter 17 of the mathematical seed book: fractions, ratios, and
 * proportionality.
 *
 * Five printed templates. Every problem states the definition or the rule it
 * uses — the "divide into equal parts and take some" reading of a fraction, the
 * scaling rule for equivalent fractions and recipes, the repeated base
 * combination, and the rule that each later fraction is taken from the quantity
 * mentioned just before it — so every case of this chapter is `no-knowledge`.
 */

export const chapter = 17;

export const cases = [
  {
    template: 'Fraction of a Larger Quantity',
    type: 'fraction-of-a-larger-quantity',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/From (\d+) units, we want to find (\d+)\/(\d+)/);
      if (match === null) {
        throw new Error('the total or the fraction is missing');
      }
      return { total: Number(match[1]), numerator: Number(match[2]), denominator: Number(match[3]) };
    },
    solve(slots) {
      if (slots.denominator <= 0 || slots.total % slots.denominator !== 0) {
        throw new Error('the total does not split into whole parts of that denominator');
      }
      const part = slots.total / slots.denominator;
      return { part, value: part * slots.numerator };
    },
    render(solution) {
      return String(solution.value);
    },
    compute: [
      'const slots = $slots;',
      'if (slots.denominator <= 0 || slots.total % slots.denominator !== 0) {',
      '  throw new Error("the total does not split into whole parts of that denominator");',
      '}',
      'return String((slots.total / slots.denominator) * slots.numerator);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement defines the fraction operation: divide the total into equal parts and take the requested number of parts.',
        `Dividing ${slots.total} into ${slots.denominator} equal parts gives ${solution.part} per part, and ${slots.numerator} such parts are wanted.`,
        `Multiplying ${solution.part} by ${slots.numerator} gives ${solution.value}, the requested fraction of the total.`
      ];
    }
  },
  {
    template: 'Equivalent Fractions by Scaling',
    type: 'equivalent-fractions-by-scaling',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/Transform (\d+)\/(\d+) by multiplying both numbers by (\d+)/);
      if (match === null) {
        throw new Error('the fraction or the scaling factor is missing');
      }
      return { numerator: Number(match[1]), denominator: Number(match[2]), factor: Number(match[3]) };
    },
    solve(slots) {
      return {
        numerator: slots.numerator * slots.factor,
        denominator: slots.denominator * slots.factor
      };
    },
    render(solution) {
      return `${solution.numerator}/${solution.denominator}`;
    },
    compute: [
      'const slots = $slots;',
      'return (slots.numerator * slots.factor) + "/" + (slots.denominator * slots.factor);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement gives the rule: multiplying the numerator and the denominator of a fraction by the same nonzero number represents the same portion of the whole.',
        `Applying the factor ${slots.factor} to both numbers changes ${slots.numerator}/${slots.denominator} into (${slots.numerator}×${slots.factor})/(${slots.denominator}×${slots.factor}).`,
        `That is the fraction ${solution.numerator}/${solution.denominator}, which cuts the whole into ${slots.factor} times as many pieces and takes ${slots.factor} times as many of them.`
      ];
    }
  },
  {
    template: 'Scaled Recipe',
    type: 'scaled-recipe',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/recipe for (\d+) people uses (\d+) g of flour\. We want exactly (\d+) times as many servings/);
      if (match === null) {
        throw new Error('the base servings, the flour amount, or the factor is missing');
      }
      return { people: Number(match[1]), flour: Number(match[2]), factor: Number(match[3]) };
    },
    solve(slots) {
      return { people: slots.people * slots.factor, flour: slots.flour * slots.factor };
    },
    render(solution) {
      return `${solution.people} people and ${solution.flour} g.`;
    },
    compute: [
      'const slots = $slots;',
      'return (slots.people * slots.factor) + " people and " + (slots.flour * slots.factor) + " g.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement gives the rule: multiplying the number of servings by a factor multiplies every ingredient by the same factor, which keeps the recipe proportions unchanged.',
        `The base recipe serves ${slots.people} people, and the wanted number of servings is ${slots.factor} times that, so ${slots.people}×${slots.factor} = ${solution.people} people.`,
        `The same factor scales the flour: ${slots.flour}×${slots.factor} = ${solution.flour} g, so the portion per person stays ${slots.flour / slots.people} g.`
      ];
    }
  },
  {
    template: 'Ratio Preserved in a Table',
    type: 'ratio-preserved-in-a-table',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/base combination contains (\d+) objects of type A and (\d+) of type B\. We build (\d+) identical combinations/);
      if (match === null) {
        throw new Error('the base combination or the number of combinations is missing');
      }
      return { baseA: Number(match[1]), baseB: Number(match[2]), count: Number(match[3]) };
    },
    solve(slots) {
      return { totalA: slots.baseA * slots.count, totalB: slots.baseB * slots.count };
    },
    render(solution) {
      return `A=${solution.totalA}, B=${solution.totalB}.`;
    },
    compute: [
      'const slots = $slots;',
      'return "A=" + (slots.baseA * slots.count) + ", B=" + (slots.baseB * slots.count) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Each built combination is identical to the base one, so the ratio between the two types of objects is preserved in every copy.',
        `One base combination holds ${slots.baseA} objects of type A and ${slots.baseB} of type B, and there are ${slots.count} combinations.`,
        `Multiplying each base count by ${slots.count} gives ${solution.totalA} objects of type A and ${solution.totalB} of type B, so the ratio ${slots.baseA}:${slots.baseB} survives.`
      ];
    }
  },
  {
    template: 'Two Stages with Fractions, Different Reference Wholes',
    type: 'two-stages-with-fractions-different-reference-wholes',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/From a total of (\d+), first (\d+)\/(\d+) is used\. Then (\d+)\/(\d+) of what remains is used/);
      if (match === null) {
        throw new Error('the total or one of the two fractions is missing');
      }
      return {
        total: Number(match[1]),
        numerator1: Number(match[2]),
        denominator1: Number(match[3]),
        numerator2: Number(match[4]),
        denominator2: Number(match[5])
      };
    },
    solve(slots) {
      const first = (slots.total / slots.denominator1) * slots.numerator1;
      const remaining = slots.total - first;
      const second = (remaining / slots.denominator2) * slots.numerator2;
      return { first, remaining, second };
    },
    render(solution) {
      return String(solution.second);
    },
    compute: [
      'const slots = $slots;',
      'const first = (slots.total / slots.denominator1) * slots.numerator1;',
      'const remaining = slots.total - first;',
      'return String((remaining / slots.denominator2) * slots.numerator2);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement makes the reference explicit: each fraction is calculated from the quantity mentioned immediately before it, so the two fractions do not share a denominator here.',
        `The first stage uses ${slots.numerator1}/${slots.denominator1} of ${slots.total}, which is ${solution.first} units, leaving ${solution.remaining} units.`,
        `The second fraction is taken from that remainder, not from the original total: ${slots.numerator2}/${slots.denominator2} of ${solution.remaining} is ${solution.second} units.`
      ];
    }
  }
];
