/**
 * Families for chapter 16 of the mathematical seed book: large numbers,
 * estimation, and digit constraints.
 *
 * Nine printed templates over twenty-five problems. Five of them are the
 * interval templates `What Values Can Round to 1200?` through `... to 6300?`,
 * which differ only in their constants and are built by one factory. Every
 * problem states the place values, the rounding neighbourhood, the interval
 * bounds, the program instructions, or the allowed digit range, so every case
 * of this chapter is `no-knowledge`.
 */

export const unit = 16;

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * The five interval templates share one body: read the accepted interval and
 * the candidate from the statement, then test the two comparisons at once.
 */
function roundingIntervalCase(template) {
  const type = slugify(template);
  return {
    template,
    type,
    category: 'no-knowledge',
    parse(statement) {
      const rule = statement.match(/rounds to (\d+) to the nearest hundred if it is at least (\d+) and at most (\d+)/);
      const check = statement.match(/Check whether (\d+) rounds to (\d+)/);
      if (rule === null || check === null) {
        throw new Error('the interval rule or the candidate check is missing');
      }
      return {
        target: Number(rule[1]),
        lower: Number(rule[2]),
        upper: Number(rule[3]),
        candidate: Number(check[1])
      };
    },
    solve(slots) {
      return {
        accepted: slots.candidate >= slots.lower && slots.candidate <= slots.upper,
        candidate: slots.candidate,
        target: slots.target
      };
    },
    render(solution) {
      return solution.accepted
        ? `Yes, ${solution.candidate} rounds to ${solution.target}.`
        : `No, ${solution.candidate} does not round to ${solution.target}.`;
    },
    compute: [
      'const slots = $slots;',
      'const accepted = slots.candidate >= slots.lower && slots.candidate <= slots.upper;',
      'return accepted',
      '  ? "Yes, " + slots.candidate + " rounds to " + slots.target + "."',
      '  : "No, " + slots.candidate + " does not round to " + slots.target + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement defines the whole interval that rounds to the target hundred: an integer qualifies when it is at least the lower bound and at most the upper bound.',
        `The interval before ${template} runs from ${slots.lower} to ${slots.upper}, and the candidate is ${slots.candidate}.`,
        `Testing both comparisons together shows the candidate ${solution.accepted ? 'lies inside' : 'lies outside'} that interval, so ${solution.accepted ? 'it rounds to the target' : 'it rounds elsewhere'}.`
      ];
    }
  };
}

export const cases = [
  {
    template: 'Four-Digit Number from Place Values',
    type: 'four-digit-number-from-place-values',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/has (\d+) thousands, (\d+) hundreds, (\d+) tens, and (\d+) ones/);
      if (match === null) {
        throw new Error('the four place-value counts are missing');
      }
      return {
        thousands: Number(match[1]),
        hundreds: Number(match[2]),
        tens: Number(match[3]),
        ones: Number(match[4])
      };
    },
    solve(slots) {
      const value =
        1000 * slots.thousands + 100 * slots.hundreds + 10 * slots.tens + slots.ones;
      return { value, digits: [slots.thousands, slots.hundreds, slots.tens, slots.ones] };
    },
    render(solution) {
      return String(solution.value);
    },
    compute: [
      'const slots = $slots;',
      'return String(1000 * slots.thousands + 100 * slots.hundreds + 10 * slots.tens + slots.ones);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement fixes the place values explicitly: one thousand is 1000, one hundred is 100, and one ten is 10.',
        `Writing the counts into those places gives ${slots.thousands} thousands, ${slots.hundreds} hundreds, ${slots.tens} tens, and ${slots.ones} ones.`,
        `The decomposition 1000×${slots.thousands}+100×${slots.hundreds}+10×${slots.tens}+${slots.ones} collapses to the single number ${solution.value}.`
      ];
    }
  },
  {
    template: 'Rounding to the Nearest Hundred',
    type: 'rounding-to-the-nearest-hundred',
    category: 'no-knowledge',
    parse(statement) {
      const rounded = statement.match(/Round (\d+) to the nearest hundred/);
      const neighbours = statement.match(/neighboring hundreds are (\d+) and (\d+)/);
      if (rounded === null || neighbours === null) {
        throw new Error('the number or its neighbouring hundreds are missing');
      }
      return { value: Number(rounded[1]), lower: Number(neighbours[1]), upper: Number(neighbours[2]) };
    },
    solve(slots) {
      const lowerDistance = slots.value - slots.lower;
      const upperDistance = slots.upper - slots.value;
      return { rounded: lowerDistance < upperDistance ? slots.lower : slots.upper, lowerDistance, upperDistance };
    },
    render(solution) {
      return String(solution.rounded);
    },
    compute: [
      'const slots = $slots;',
      'const lowerDistance = slots.value - slots.lower;',
      'const upperDistance = slots.upper - slots.value;',
      'return String(lowerDistance < upperDistance ? slots.lower : slots.upper);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The statement gives the rule: measure the distance to each neighbouring hundred and keep the closer one; a value exactly halfway is assigned to the upper hundred.',
        `${slots.value} is ${solution.lowerDistance} above ${slots.lower} and ${solution.upperDistance} below ${slots.upper}.`,
        `The smaller distance is ${Math.min(solution.lowerDistance, solution.upperDistance)}, so the nearest hundred is ${solution.rounded}.`
      ];
    }
  },
  roundingIntervalCase('What Values Can Round to 1200?'),
  roundingIntervalCase('What Values Can Round to 2500?'),
  roundingIntervalCase('What Values Can Round to 3700?'),
  roundingIntervalCase('What Values Can Round to 4800?'),
  roundingIntervalCase('What Values Can Round to 6300?'),
  {
    template: 'Algorithm on a Large Number',
    type: 'algorithm-on-a-large-number',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/receives (\d+)\. Instruction 1: add (\d+)\. Instruction 2: subtract (\d+)\./);
      if (match === null) {
        throw new Error('the input or one of the two instructions is missing');
      }
      return { input: Number(match[1]), add: Number(match[2]), subtract: Number(match[3]) };
    },
    solve(slots) {
      const afterAdd = slots.input + slots.add;
      const output = afterAdd - slots.subtract;
      const undone = output + slots.subtract - slots.add;
      return { output, checked: undone === slots.input };
    },
    render(solution) {
      return String(solution.output);
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.input + slots.add - slots.subtract);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The two instructions are applied in the order printed, so the additions and the subtraction combine into one expression over the input value.',
        `Starting from ${slots.input} and adding ${slots.add} gives ${slots.input + slots.add}; subtracting ${slots.subtract} then gives ${solution.output}.`,
        `The check runs the program backwards: from ${solution.output}, adding ${slots.subtract} and removing ${slots.add} returns ${slots.input}, so the output is consistent.`
      ];
    }
  },
  {
    template: 'Largest Allowed Numerical Code',
    type: 'largest-allowed-numerical-code',
    category: 'no-knowledge',
    parse(statement) {
      const digits = statement.match(/each digit from \[([\d,\s]+)\] exactly once/);
      const bounds = statement.match(/greater than (\d+) and less than (\d+)/);
      if (digits === null || bounds === null) {
        throw new Error('the digit list or the bounds are missing');
      }
      return {
        digits: digits[1].split(',').map((value) => Number(value.trim())),
        lower: Number(bounds[1]),
        upper: Number(bounds[2])
      };
    },
    solve(slots) {
      const results = [];
      const walk = (used, prefix) => {
        if (prefix.length === slots.digits.length) {
          results.push(Number(prefix.join('')));
          return;
        }
        for (let index = 0; index < slots.digits.length; index += 1) {
          if (used[index] === true) {
            continue;
          }
          used[index] = true;
          prefix.push(slots.digits[index]);
          walk(used, prefix);
          prefix.pop();
          used[index] = false;
        }
      };
      walk(slots.digits.map(() => false), []);
      const allowed = results.filter((value) => value > slots.lower && value < slots.upper);
      return { largest: Math.max(...allowed) };
    },
    render(solution) {
      return String(solution.largest);
    },
    compute: [
      'const slots = $slots;',
      'const results = [];',
      'const walk = (used, prefix) => {',
      '  if (prefix.length === slots.digits.length) {',
      '    results.push(Number(prefix.join("")));',
      '    return;',
      '  }',
      '  for (let index = 0; index < slots.digits.length; index += 1) {',
      '    if (used[index] === true) { continue; }',
      '    used[index] = true;',
      '    prefix.push(slots.digits[index]);',
      '    walk(used, prefix);',
      '    prefix.pop();',
      '    used[index] = false;',
      '  }',
      '};',
      'walk(slots.digits.map(() => false), []);',
      'const allowed = results.filter((value) => value > slots.lower && value < slots.upper);',
      'return String(Math.max(...allowed));'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Each digit must be used exactly once, so the candidates are the permutations of the printed digits, and the code must also stay strictly between the two bounds.',
        `Enumerating the permutations of [${slots.digits.join(', ')}] and discarding those outside (${slots.lower}, ${slots.upper}) leaves a set of legal codes.`,
        `Among the legal codes the largest one is read off by taking the largest possible leading digit first and then the remaining digits in decreasing order, which yields ${solution.largest}.`
      ];
    }
  }
];
