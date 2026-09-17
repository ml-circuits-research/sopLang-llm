/**
 * Families for chapter 4 of the mathematical seed book: patterns, algorithms,
 * and number machines.
 *
 * A family covers one printed template. The first five problems of the chapter
 * are titled individually (`The "Add 2" Machine` through `The "Add 6" Machine`),
 * so they form five single-variant templates; the remaining twenty problems
 * share four templates of five variants each. Every premise is stated in the
 * problem text, so the chapter is `no-knowledge`.
 */

export const chapter = 4;

/**
 * The five single-variant "Add N" machine templates differ only in their
 * printed title; the statement carries the machine rule, so one generic parse,
 * computation, and explanation serve all of them.
 */
function addMachineCase(template, type) {
  return {
    template,
    type,
    category: 'no-knowledge',
    parse(statement) {
      const addsMatch = statement.match(/it adds (\d+) to every input\./);
      const inputMatch = statement.match(/If the input is (\d+), what is the output\?/);
      const outputMatch = statement.match(/If the output is (\d+), what input was used\?/);
      if (addsMatch === null || inputMatch === null || outputMatch === null) {
        throw new Error('the machine rule, the given input, or the given output is missing');
      }
      return { adds: Number(addsMatch[1]), input: Number(inputMatch[1]), output: Number(outputMatch[1]) };
    },
    solve(slots) {
      const forward = slots.input + slots.adds;
      const backward = slots.output - slots.adds;
      if (backward < 0) {
        throw new Error('the given output is smaller than the machine rule');
      }
      return { forward, backward };
    },
    render(solution) {
      return `Output ${solution.forward}; input ${solution.backward}.`;
    },
    compute: [
      'const slots = $slots;',
      'const forward = slots.input + slots.adds;',
      'const backward = slots.output - slots.adds;',
      'if (backward < 0) {',
      '  throw new Error("the given output is smaller than the machine rule");',
      '}',
      'return "Output " + forward + "; input " + backward + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The machine adds ${slots.adds} to every input, so it is a single fixed rule rather than a table of separate cases.`,
        `Running the rule forward on the given input ${slots.input} gives ${slots.input} + ${slots.adds} = ${solution.forward}.`,
        `Running the rule backward inverts the addition: the input that produced ${slots.output} is ${slots.output} - ${slots.adds} = ${solution.backward}.`,
        `Checking: ${solution.backward} + ${slots.adds} = ${slots.output}, so both directions agree with the rule.`
      ];
    }
  };
}

export const cases = [
  addMachineCase('The “Add 2” Machine', 'the-add-2-machine'),
  addMachineCase('The “Add 3” Machine', 'the-add-3-machine'),
  addMachineCase('The “Add 4” Machine', 'the-add-4-machine'),
  addMachineCase('The “Add 5” Machine', 'the-add-5-machine'),
  addMachineCase('The “Add 6” Machine', 'the-add-6-machine'),
  {
    template: 'Alternating Rule',
    type: 'alternating-rule',
    category: 'no-knowledge',
    parse(statement) {
      const startMatch = statement.match(/starting from (\d+)\./);
      const ruleMatch = statement.match(/“add (\d+), then subtract (\d+), then repeat/);
      if (startMatch === null || ruleMatch === null) {
        throw new Error('the starting number or the alternating rule is missing');
      }
      return { start: Number(startMatch[1]), add: Number(ruleMatch[1]), subtract: Number(ruleMatch[2]) };
    },
    solve(slots) {
      const terms = [slots.start];
      for (let index = 0; index < 4; index += 1) {
        const previous = terms[terms.length - 1];
        terms.push(index % 2 === 0 ? previous + slots.add : previous - slots.subtract);
      }
      return { next: terms.slice(1) };
    },
    render(solution) {
      return solution.next.join(', ');
    },
    compute: [
      'const slots = $slots;',
      'const terms = [slots.start];',
      'for (let index = 0; index < 4; index += 1) {',
      '  const previous = terms[terms.length - 1];',
      '  terms.push(index % 2 === 0 ? previous + slots.add : previous - slots.subtract);',
      '}',
      'return terms.slice(1).join(", ");'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The rule is a repeating pair: first add ${slots.add}, then subtract ${slots.subtract}, and the order must be preserved.`,
        `Applying the pair twice to the starting number ${slots.start} produces the next four terms.`,
        `The terms alternate up and down: each addition is followed by a subtraction, so the sequence never drifts by the pair's net change at every step.`,
        `The four numbers written after ${slots.start} are ${solution.next.join(', ')}.`
      ];
    }
  },
  {
    template: 'Position in a Repeating Pattern',
    type: 'position-in-a-repeating-pattern',
    category: 'no-knowledge',
    parse(statement) {
      const patternMatch = statement.match(/pattern repeats forever: ([^.]+)\./);
      const positionMatch = statement.match(/Which element is in position (\d+)\?/);
      if (patternMatch === null || positionMatch === null) {
        throw new Error('the repeating pattern or the asked position is missing');
      }
      const elements = patternMatch[1].split(',').map((value) => value.trim());
      if (elements.length === 0 || elements.some((value) => value === '')) {
        throw new Error('the repeating pattern has no elements');
      }
      return { elements, position: Number(positionMatch[1]) };
    },
    solve(slots) {
      const cycle = slots.elements.length;
      const localIndex = ((slots.position - 1) % cycle + cycle) % cycle;
      return { element: slots.elements[localIndex], cycle, localIndex, position: slots.position };
    },
    render(solution) {
      return solution.element;
    },
    compute: [
      'const slots = $slots;',
      'const cycle = slots.elements.length;',
      'const localIndex = ((slots.position - 1) % cycle + cycle) % cycle;',
      'return slots.elements[localIndex];'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The pattern repeats as ${slots.elements.join(', ')}, so the elements are grouped into cycles of ${solution.cycle}.`,
        `Counting complete cycles up to position ${slots.position} leaves a remainder, and the remainder fixes the element inside one cycle.`,
        `Position ${slots.position} falls on index ${solution.localIndex + 1} of the cycle, which is ${solution.element}.`
      ];
    }
  },
  {
    template: 'Two Transformations in the Same Machine',
    type: 'two-transformations-in-the-same-machine',
    category: 'no-knowledge',
    parse(statement) {
      const addMatch = statement.match(/1\) add (\d+); 2\) double the result/);
      const inputMatch = statement.match(/For input (\d+), what is the output\?/);
      if (addMatch === null || inputMatch === null) {
        throw new Error('the addition step or the given input is missing');
      }
      return { add: Number(addMatch[1]), input: Number(inputMatch[1]) };
    },
    solve(slots) {
      const correct = (slots.input + slots.add) * 2;
      const reversed = slots.input * 2 + slots.add;
      return { correct, reversed };
    },
    render(solution) {
      return `Correct output: ${solution.correct}; with the reversed order: ${solution.reversed}.`;
    },
    compute: [
      'const slots = $slots;',
      'const correct = (slots.input + slots.add) * 2;',
      'const reversed = slots.input * 2 + slots.add;',
      'return "Correct output: " + correct + "; with the reversed order: " + reversed + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The machine performs add ${slots.add} first and then doubles, so the doubling applies to the whole sum ${slots.input} + ${slots.add}.`,
        `In the printed order the output is (${slots.input} + ${slots.add}) × 2 = ${solution.correct}.`,
        `Reversing the order doubles the input first and adds ${slots.add} afterward: ${slots.input} × 2 + ${slots.add} = ${solution.reversed}.`,
        `The two results differ because doubling gives back what the addition added, so the order of the two instructions changes the outcome.`
      ];
    }
  },
  {
    template: 'Choose the Rule That Explains the Examples',
    type: 'choose-the-rule-that-explains-the-examples',
    category: 'no-knowledge',
    parse(statement) {
      const pairsMatch = statement.match(/input→output pairs: ([^.]+)\./);
      const rulesMatch = statement.match(/candidate rules are: ([^.]+)\./);
      const inputMatch = statement.match(/apply it to input (\d+)\./);
      if (pairsMatch === null || rulesMatch === null || inputMatch === null) {
        throw new Error('the examples, the candidate rules, or the application input is missing');
      }
      const pairs = [...pairsMatch[1].matchAll(/(\d+)\s*→\s*(\d+)/g)].map((match) => [Number(match[1]), Number(match[2])]);
      if (pairs.length === 0) {
        throw new Error('no input→output examples were found');
      }
      return { pairs, rules: rulesMatch[1].split(';').map((value) => value.trim()), input: Number(inputMatch[1]) };
    },
    solve(slots) {
      const matching = slots.rules.filter((rule) =>
        slots.pairs.every(([input, output]) => {
          const operation = rule.match(/^(add|subtract)\s+(\d+)$/);
          if (operation === null) {
            return false;
          }
          const amount = Number(operation[2]);
          return (operation[1] === 'add' ? input + amount : input - amount) === output;
        })
      );
      if (matching.length !== 1) {
        throw new Error(`${matching.length} candidate rules explain all the examples instead of one`);
      }
      const operation = matching[0].match(/^(add|subtract)\s+(\d+)$/);
      const amount = Number(operation[2]);
      const result = operation[1] === 'add' ? slots.input + amount : slots.input - amount;
      return { rule: matching[0], input: slots.input, result };
    },
    render(solution) {
      return `Rule: ${solution.rule}; the output for ${solution.input} is ${solution.result}.`;
    },
    compute: [
      'const slots = $slots;',
      'const matching = slots.rules.filter((rule) => slots.pairs.every((pair) => {',
      '  const operation = rule.match(/^(add|subtract)\\s+(\\d+)$/);',
      '  if (operation === null) { return false; }',
      '  const amount = Number(operation[2]);',
      '  return (operation[1] === "add" ? pair[0] + amount : pair[0] - amount) === pair[1];',
      '}));',
      'if (matching.length !== 1) {',
      '  throw new Error(`${matching.length} candidate rules explain all the examples instead of one`);',
      '}',
      'const operation = matching[0].match(/^(add|subtract)\\s+(\\d+)$/);',
      'const amount = Number(operation[2]);',
      'const result = operation[1] === "add" ? slots.input + amount : slots.input - amount;',
      'return "Rule: " + matching[0] + "; the output for " + slots.input + " is " + result + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each candidate rule is tested against every example ${slots.pairs.map(([input, output]) => `${input}→${output}`).join(', ')}; a rule is kept only if it reproduces all of them.`,
        `The rule "${solution.rule}" maps every given input to its given output, while the other candidates fail on at least one example.`,
        `Applying the same rule to input ${solution.input} gives ${solution.result}, so the rule generalizes beyond the examples that identified it.`
      ];
    }
  }
];
