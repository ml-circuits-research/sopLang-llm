/**
 * Families for chapter 6 of the mathematical seed book: place value and
 * numerical codes.
 *
 * Every template states its own place-value convention (one ten means 10 ones,
 * one hundred is worth 100, the place-value rule for two digits, the allowed
 * digit set, the two limits), so the solutions need no fact the problem text
 * does not state and the whole chapter is `no-knowledge`.
 */

export const chapter = 6;

export const cases = [
  {
    template: 'Build the Number from Tens and Ones',
    type: 'build-the-number-from-tens-and-ones',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/A number has (\d+) tens and (\d+) one/);
      if (match === null) {
        throw new Error('the tens and ones counts are missing');
      }
      return { tens: Number(match[1]), ones: Number(match[2]) };
    },
    solve(slots) {
      return { value: 10 * slots.tens + slots.ones };
    },
    render(solution) {
      return String(solution.value);
    },
    compute: [
      'const slots = $slots;',
      'return String(10 * slots.tens + slots.ones);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The problem fixes the value of a ten: one ten is worth 10 ones, so ${slots.tens} tens contribute ${10 * slots.tens}.`,
        `The ${slots.ones} loose ones are added unchanged because they are already counted in ones.`,
        `Replacing every ten by 10 ones and adding the loose ones gives ${10 * slots.tens} + ${slots.ones} = ${solution.value}.`,
        `The answer ${solution.value} therefore has ${slots.tens} in the tens place and ${slots.ones} in the ones place, which matches the description.`
      ];
    }
  },
  {
    template: 'What Happens When We Reverse the Digits?',
    type: 'what-happens-when-we-reverse-the-digits',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/tens digit (\d+) and ones digit (\d+)/);
      if (match === null) {
        throw new Error('the tens digit and the ones digit are missing');
      }
      return { tens: Number(match[1]), ones: Number(match[2]) };
    },
    solve(slots) {
      const a = 10 * slots.tens + slots.ones;
      const b = 10 * slots.ones + slots.tens;
      if (a === b) {
        throw new Error('the two digits are equal, so reversing changes nothing');
      }
      return { larger: a > b ? 'A' : 'B', difference: Math.abs(a - b) };
    },
    render(solution) {
      return `${solution.larger} is larger by ${solution.difference}.`;
    },
    compute: [
      'const slots = $slots;',
      'const a = 10 * slots.tens + slots.ones;',
      'const b = 10 * slots.ones + slots.tens;',
      'if (a === b) {',
      '  throw new Error("the two digits are equal, so reversing changes nothing");',
      '}',
      'const larger = a > b ? "A" : "B";',
      'const difference = a > b ? a - b : b - a;',
      'return larger + " is larger by " + difference + ".";'
    ].join('\n'),
    explain(slots, solution) {
      const a = 10 * slots.tens + slots.ones;
      const b = 10 * slots.ones + slots.tens;
      return [
        `Number A uses tens digit ${slots.tens} and ones digit ${slots.ones}, so with the given rule A = 10×${slots.tens} + ${slots.ones} = ${a}.`,
        `Reversing puts ${slots.ones} in the tens place and ${slots.tens} in the ones place, so B = 10×${slots.ones} + ${slots.tens} = ${b}.`,
        `Because the tens digit of A is larger, the reversed number is smaller, and the gap is ${a} - ${b} = ${solution.difference}.`,
        `The reversal is worth nine times the digit gap: 9×(${slots.tens} - ${slots.ones}) = ${solution.difference}, which confirms the answer.`
      ];
    }
  },
  {
    template: 'Number from Allowed Digits',
    type: 'number-from-allowed-digits',
    category: 'no-knowledge',
    parse(statement) {
      const setMatch = statement.match(/from the set \[([0-9,\s]+)\]/);
      const boundsMatch = statement.match(/greater than (\d+) and less than (\d+)/);
      if (setMatch === null || boundsMatch === null) {
        throw new Error('the allowed digits or the two limits are missing');
      }
      return {
        digits: setMatch[1].split(',').map((value) => Number(value.trim())),
        lower: Number(boundsMatch[1]),
        upper: Number(boundsMatch[2])
      };
    },
    solve(slots) {
      const candidates = [];
      for (const tens of slots.digits) {
        for (const ones of slots.digits) {
          if (tens === ones || tens === 0) {
            continue;
          }
          const value = 10 * tens + ones;
          if (value > slots.lower && value < slots.upper) {
            candidates.push(value);
          }
        }
      }
      if (candidates.length === 0) {
        throw new Error('no two-digit number from the allowed digits fits between the limits');
      }
      return { value: Math.min(...candidates) };
    },
    render(solution) {
      return String(solution.value);
    },
    compute: [
      'const slots = $slots;',
      'const candidates = [];',
      'for (const tens of slots.digits) {',
      '  for (const ones of slots.digits) {',
      '    if (tens === ones || tens === 0) {',
      '      continue;',
      '    }',
      '    const value = 10 * tens + ones;',
      '    if (value > slots.lower && value < slots.upper) {',
      '      candidates.push(value);',
      '    }',
      '  }',
      '}',
      'if (candidates.length === 0) {',
      '  throw new Error("no two-digit number from the allowed digits fits between the limits");',
      '}',
      'candidates.sort((left, right) => left - right);',
      'return String(candidates[0]);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The two digits must be different and taken from ${slots.digits.join(', ')}, and the tens digit cannot be zero, so only six ordered pairs are possible.`,
        `Building each pair as 10×tens + ones and keeping those strictly greater than ${slots.lower} and strictly less than ${slots.upper} leaves a short candidate list.`,
        `Comparing the survivors and taking the smallest gives ${solution.value}, which satisfies both limits and uses two different allowed digits.`
      ];
    }
  },
  {
    template: 'H-T-O Code',
    type: 'h-t-o-code',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/H=(\d+), T=(\d+), O=(\d+)/);
      if (match === null) {
        throw new Error('the H-T-O code is missing');
      }
      return { hundreds: Number(match[1]), tens: Number(match[2]), ones: Number(match[3]) };
    },
    solve(slots) {
      return { value: 100 * slots.hundreds + 10 * slots.tens + slots.ones };
    },
    render(solution) {
      return String(solution.value);
    },
    compute: [
      'const slots = $slots;',
      'return String(100 * slots.hundreds + 10 * slots.tens + slots.ones);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The code fixes the worth of each letter: one hundred is 100 and one ten is 10, and the ones are already counted.`,
        `The hundreds contribute 100×${slots.hundreds} = ${100 * slots.hundreds}, the tens contribute 10×${slots.tens} = ${10 * slots.tens}, and the ones contribute ${slots.ones}.`,
        `Adding the three parts gives ${100 * slots.hundreds} + ${10 * slots.tens} + ${slots.ones} = ${solution.value}, which is the number the code represents.`
      ];
    }
  },
  {
    template: 'Change the Tens and Ones',
    type: 'change-the-tens-and-ones',
    category: 'no-knowledge',
    parse(statement) {
      const startMatch = statement.match(/start from the number (\d+)/);
      const tensMatch = statement.match(/add (\d+) tens/);
      const onesMatch = statement.match(/add (\d+) ones/);
      if (startMatch === null || tensMatch === null || onesMatch === null) {
        throw new Error('the start or the two additions are missing');
      }
      return {
        start: Number(startMatch[1]),
        tens: Number(tensMatch[1]),
        ones: Number(onesMatch[1])
      };
    },
    solve(slots) {
      return { value: slots.start + 10 * slots.tens + slots.ones };
    },
    render(solution) {
      return String(solution.value);
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.start + 10 * slots.tens + slots.ones);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The starting number is ${slots.start}, and the problem fixes one ten as 10 ones.`,
        `The tens instruction therefore adds 10×${slots.tens} = ${10 * slots.tens}, while the ones instruction adds ${slots.ones} directly.`,
        `Applying both changes in sequence gives ${slots.start} + ${10 * slots.tens} + ${slots.ones} = ${solution.value}.`
      ];
    }
  }
];
