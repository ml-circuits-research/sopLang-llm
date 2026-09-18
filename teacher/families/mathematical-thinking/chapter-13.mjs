/**
 * Families for chapter 13 of the mathematical seed book: inverse problems and
 * systems of conditions.
 *
 * The chapter gives a method in every statement (remove the difference, undo
 * the operations from right to left, replace A tickets with B tickets), so the
 * solutions use only premises stated in the problem text and every case is
 * `no-knowledge`.
 */

export const unit = 13;

export const cases = [
  {
    template: 'Two Numbers: Sum and Difference',
    type: 'two-numbers-sum-and-difference',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/have sum (\d+)\. The first is (\d+) greater/);
      if (match === null) {
        throw new Error('the sum or the difference is missing');
      }
      return { sum: Number(match[1]), difference: Number(match[2]) };
    },
    solve(slots) {
      const rest = slots.sum - slots.difference;
      if (rest % 2 !== 0) {
        throw new Error('the sum and the difference do not give whole numbers');
      }
      return { first: (slots.sum + slots.difference) / 2, second: rest / 2 };
    },
    render(solution) {
      return `${solution.first} and ${solution.second}.`;
    },
    compute: [
      'const slots = $slots;',
      'const rest = slots.sum - slots.difference;',
      'if (rest % 2 !== 0) {',
      '  throw new Error("the sum and the difference do not give whole numbers");',
      '}',
      'const first = (slots.sum + slots.difference) / 2;',
      'const second = rest / 2;',
      'return first + " and " + second + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The two numbers add up to ${slots.sum}, and the first is ${slots.difference} larger than the second.`,
        `Removing the difference ${slots.difference} from the sum leaves two equal quantities: ${slots.sum} − ${slots.difference} = ${slots.sum - slots.difference}.`,
        `Half of that is the second number, ${solution.second}, and adding the difference back gives the first, ${solution.first}.`
      ];
    }
  },
  {
    template: 'Total and a Multiplicative Relationship',
    type: 'total-and-a-multiplicative-relationship',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/contain (\d+) pieces altogether\. Box A contains (\d+) times the quantity in B, plus another (\d+)/);
      if (match === null) {
        throw new Error('the total, the multiplier, or the extra amount is missing');
      }
      return { total: Number(match[1]), factor: Number(match[2]), extra: Number(match[3]) };
    },
    solve(slots) {
      const groups = slots.factor + 1;
      const remaining = slots.total - slots.extra;
      if (remaining % groups !== 0) {
        throw new Error('the total does not split into whole groups');
      }
      const b = remaining / groups;
      return { a: slots.factor * b + slots.extra, b };
    },
    render(solution) {
      return `A=${solution.a}, B=${solution.b}.`;
    },
    compute: [
      'const slots = $slots;',
      'const groups = slots.factor + 1;',
      'const remaining = slots.total - slots.extra;',
      'if (remaining % groups !== 0) {',
      '  throw new Error("the total does not split into whole groups");',
      '}',
      'const b = remaining / groups;',
      'const a = slots.factor * b + slots.extra;',
      'return "A=" + a + ", B=" + b + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The two boxes hold ${slots.total} pieces together, and A holds ${slots.factor} times B plus ${slots.extra} extra pieces.`,
        `Setting the extra pieces aside leaves ${slots.total} − ${slots.extra} = ${slots.total - slots.extra} pieces shared by B and the ${slots.factor} copies of B.`,
        `That is ${slots.factor + 1} equal groups, so B holds ${slots.total - slots.extra} ÷ ${slots.factor + 1} = ${solution.b} pieces.`,
        `Then A holds ${slots.factor} · ${solution.b} + ${slots.extra} = ${solution.a} pieces, and ${solution.a} + ${solution.b} = ${slots.total} confirms the total.`
      ];
    }
  },
  {
    template: 'Undo a Chain of Three Operations',
    type: 'undo-a-chain-of-three-operations',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/operations: (.+?)\. The final result is (\d+)/);
      if (match === null) {
        throw new Error('the operation chain or the final result is missing');
      }
      const operations = match[1].split(/,\s*apoi\s*/).map((token) => {
        const operation = token.trim().match(/^([+\-−])\s*(\d+)$/);
        if (operation === null) {
          throw new Error(`the operation "${token}" is not a signed number`);
        }
        return { sign: operation[1] === '+' ? '+' : '-', value: Number(operation[2]) };
      });
      if (operations.length === 0) {
        throw new Error('the operation chain is empty');
      }
      return { operations, result: Number(match[2]) };
    },
    solve(slots) {
      let value = slots.result;
      for (let index = slots.operations.length - 1; index >= 0; index -= 1) {
        const operation = slots.operations[index];
        value += operation.sign === '+' ? -operation.value : operation.value;
      }
      return { value };
    },
    render(solution) {
      return String(solution.value);
    },
    compute: [
      'const slots = $slots;',
      'let value = slots.result;',
      'for (let index = slots.operations.length - 1; index >= 0; index -= 1) {',
      '  const operation = slots.operations[index];',
      '  value += operation.sign === "+" ? -operation.value : operation.value;',
      '}',
      'return String(value);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The number starts unknown and the chain applies ${slots.operations.map((operation) => operation.sign + operation.value).join(', then ')} to reach ${slots.result}.`,
        'Working backward means undoing the operations from right to left, each with its opposite operation.',
        `Undoing the chain one step at a time brings ${slots.result} back to the starting value ${solution.value}.`,
        `Checking forward, applying the chain to ${solution.value} ends exactly at ${slots.result}.`
      ];
    }
  },
  {
    template: 'Two Types of Tickets',
    type: 'two-types-of-tickets',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/(\d+) tickets were bought\. A type A ticket costs (\d+) lei and a type B ticket costs (\d+) lei\. The total is (\d+) lei/);
      if (match === null) {
        throw new Error('the ticket count, the prices, or the total is missing');
      }
      return { tickets: Number(match[1]), priceA: Number(match[2]), priceB: Number(match[3]), total: Number(match[4]) };
    },
    solve(slots) {
      const difference = slots.priceB - slots.priceA;
      const extra = slots.total - slots.tickets * slots.priceA;
      if (difference <= 0 || extra % difference !== 0) {
        throw new Error('the prices do not split the total into whole tickets');
      }
      const b = extra / difference;
      const a = slots.tickets - b;
      if (a < 0 || b < 0) {
        throw new Error('the solution assigns a negative number of tickets');
      }
      return { a, b };
    },
    render(solution) {
      return `A=${solution.a}, B=${solution.b}.`;
    },
    compute: [
      'const slots = $slots;',
      'const difference = slots.priceB - slots.priceA;',
      'const extra = slots.total - slots.tickets * slots.priceA;',
      'if (difference <= 0 || extra % difference !== 0) {',
      '  throw new Error("the prices do not split the total into whole tickets");',
      '}',
      'const b = extra / difference;',
      'const a = slots.tickets - b;',
      'if (a < 0 || b < 0) {',
      '  throw new Error("the solution assigns a negative number of tickets");',
      '}',
      'return "A=" + a + ", B=" + b + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `There are ${slots.tickets} tickets together, and a type A ticket costs ${slots.priceA} lei while a type B ticket costs ${slots.priceB} lei.`,
        `Assuming all ${slots.tickets} tickets were type A would cost ${slots.tickets} · ${slots.priceA} = ${slots.tickets * slots.priceA} lei.`,
        `The real total is ${slots.total} lei, so ${slots.total - slots.tickets * slots.priceA} lei must be added by replacing A tickets with B tickets, each replacement adding ${slots.priceB - slots.priceA} lei.`,
        `The number of replacements is ${solution.b}, so there are ${solution.b} type B tickets and ${slots.tickets} − ${solution.b} = ${solution.a} type A tickets.`
      ];
    }
  },
  {
    template: 'Three Quantities, Three Clues',
    type: 'three-quantities-three-clues',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/contain the quantities (\d+), (\d+), and (\d+)/);
      if (match === null) {
        throw new Error('the three quantities are missing');
      }
      return { values: [Number(match[1]), Number(match[2]), Number(match[3])] };
    },
    solve(slots) {
      const values = [...slots.values].sort((left, right) => left - right);
      if (new Set(values).size !== values.length) {
        throw new Error('the three quantities are not distinct');
      }
      return { a: values[1], b: values[2], c: values[0] };
    },
    render(solution) {
      return `A=${solution.a}, B=${solution.b}, C=${solution.c}.`;
    },
    compute: [
      'const slots = $slots;',
      'const values = [...slots.values].sort((left, right) => left - right);',
      'if (new Set(values).size !== values.length) {',
      '  throw new Error("the three quantities are not distinct");',
      '}',
      'return "A=" + values[1] + ", B=" + values[2] + ", C=" + values[0] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The three quantities ${slots.values.join(', ')} are used exactly once, so one box gets the smallest, one the middle, and one the largest.`,
        'The clues say B has more than A and C has less than A, which orders the boxes as C < A < B.',
        `Reading the sorted quantities in that order gives A = ${solution.a}, B = ${solution.b}, and C = ${solution.c}.`
      ];
    }
  }
];
