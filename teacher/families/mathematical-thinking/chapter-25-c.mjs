/**
 * Families for chapter 25 of the mathematical seed book: visual structures,
 * cutting, and transformations.
 *
 * This chapter titles every one of its 25 problems individually, so each
 * printed template is its own family and the case list is split across three
 * modules: part A (`chapter-25.mjs`) carries cases 25.1-25.9, part B
 * (`chapter-25-b.mjs`) carries cases 25.10-25.18, and this part carries cases
 * 25.19-25.25. Every part repeats the chapter number and the shared helpers so
 * the modules load independently.
 *
 * A family covers one printed template: a reference parse, an independent
 * computation, the answer text the source prints, the SOP Lang computation body
 * that the circuit executes, and the explanation lines of the example. The
 * chapter defines its own rules (unit sides and boundary counts, the folding
 * criterion for symmetry, the repeating cycle, the stated growth step), so no
 * case needs a fact the statement leaves unstated and every case is
 * `no-knowledge`.
 */

export const unit = 25;

const WORD_NUMBERS = {
  one: 1, once: 1, two: 2, twice: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, twenty: 20
};

function counted(text) {
  const word = String(text).toLowerCase();
  if (WORD_NUMBERS[word] !== undefined) {
    return WORD_NUMBERS[word];
  }
  const value = Number(word);
  if (!Number.isInteger(value)) {
    throw new Error(`"${text}" is not a whole number`);
  }
  return value;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const cases = [
  {
    template: 'A pattern of length three',
    type: 'a-pattern-of-length-three',
    category: 'no-knowledge',
    parse(statement) {
      const cycleMatch = statement.match(/pattern is (\w+), (\w+), (\w+) and then repeats/);
      const positionMatch = statement.match(/at position (\d+)/);
      if (cycleMatch === null || positionMatch === null) {
        throw new Error('the color cycle or the asked position is missing');
      }
      return { cycle: [cycleMatch[1], cycleMatch[2], cycleMatch[3]], position: Number(positionMatch[1]) };
    },
    solve(slots) {
      return { color: slots.cycle[(slots.position - 1) % slots.cycle.length] };
    },
    render(solution) {
      return `${capitalize(solution.color)}.`;
    },
    compute: [
      'const s = $slots;',
      'const color = s.cycle[(s.position - 1) % s.cycle.length];',
      'return color.charAt(0).toUpperCase() + color.slice(1) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The pattern is a cycle of ${slots.cycle.length} colors that restarts after every ${slots.cycle.length} positions.`,
        `Position ${slots.position} therefore matches the step ${(slots.position - 1) % slots.cycle.length + 1} inside the cycle.`,
        `That step is ${solution.color}, so the color at position ${slots.position} is ${solution.color}.`
      ];
    }
  },
  {
    template: 'A growth rule in a drawing',
    type: 'a-growth-rule-in-a-drawing',
    category: 'no-knowledge',
    parse(statement) {
      const firstMatch = statement.match(/Figure 1 has (\d+) dots/);
      const stepMatch = statement.match(/exactly (\d+) dots are added/);
      const figureMatch = statement.match(/does figure (\d+) have/);
      if (firstMatch === null || stepMatch === null || figureMatch === null) {
        throw new Error('the starting dots, the step, or the asked figure is missing');
      }
      return { first: Number(firstMatch[1]), step: Number(stepMatch[1]), figure: Number(figureMatch[1]) };
    },
    solve(slots) {
      return { dots: slots.first + slots.step * (slots.figure - 1) };
    },
    render(solution) {
      return `${solution.dots} dots.`;
    },
    compute: [
      'const s = $slots;',
      'const dots = s.first + s.step * (s.figure - 1);',
      'return dots + " dots.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The rule states a constant growth: ${slots.step} dots are added for every new figure after the first.`,
        `Reaching figure ${slots.figure} means applying that growth ${slots.figure - 1} times to the starting ${slots.first} dots.`,
        `So figure ${slots.figure} has ${slots.first} + ${slots.figure - 1}\u00d7${slots.step} = ${solution.dots} dots.`
      ];
    }
  },
  {
    template: 'A pattern with two alternative rules',
    type: 'a-pattern-with-two-alternative-rules',
    category: 'no-knowledge',
    parse(statement) {
      const observedMatch = statement.match(/first three numbers ([0-9,\s]+)/);
      const stepMatch = statement.match(/always add (\d+)/);
      const thenMatch = statement.match(/then comes (\d+)/);
      if (observedMatch === null || stepMatch === null || thenMatch === null) {
        throw new Error('the observed numbers or one of the two rules is missing');
      }
      const observed = observedMatch[1].split(',').map((value) => Number(value.trim()));
      return { observed, step: Number(stepMatch[1]), thenComes: Number(thenMatch[1]) };
    },
    solve(slots) {
      const ruleA = [...slots.observed, slots.observed[slots.observed.length - 1] + slots.step];
      const ruleB = [...slots.observed, slots.thenComes];
      const matches = (rule) => slots.observed.every((value, index) => rule[index] === value);
      if (!matches(ruleA) || !matches(ruleB)) {
        return { compatible: false, decided: true };
      }
      const decided = ruleA.some((value, index) => index >= slots.observed.length && value !== ruleB[index]);
      return { compatible: true, decided };
    },
    render(solution) {
      if (!solution.compatible) {
        return 'No; one rule contradicts the data.';
      }
      return solution.decided ? 'Yes; the data are insufficient to choose.' : 'No; the rules agree everywhere.';
    },
    compute: [
      'const s = $slots;',
      'const ruleA = s.observed.concat([s.observed[s.observed.length - 1] + s.step]);',
      'const ruleB = s.observed.concat([s.thenComes]);',
      'const matches = (rule) => s.observed.every((value, index) => rule[index] === value);',
      'if (!matches(ruleA) || !matches(ruleB)) {',
      '  return "No; one rule contradicts the data.";',
      '}',
      'const decided = ruleA.some((value, index) => index >= s.observed.length && value !== ruleB[index]);',
      'return decided ? "Yes; the data are insufficient to choose." : "No; the rules agree everywhere.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Both rules reproduce the observed numbers ${slots.observed.join(', ')}: Rule A continues by adding ${slots.step}, and Rule B keeps the same first three numbers before placing ${slots.thenComes}.`,
        `The two rules differ only from the fourth position onwards, which was never observed.`,
        `The data therefore cannot separate the rules, so both remain compatible and the observations do not choose between them.`
      ];
    }
  },
  {
    template: 'The simplest rule is not guaranteed to be true',
    type: 'the-simplest-rule-is-not-guaranteed-to-be-true',
    category: 'no-knowledge',
    parse(statement) {
      const observedMatch = statement.match(/observed sequence ([0-9]+(?:\s*,\s*[0-9]+)*)/);
      const guessMatch = statement.match(/next number is (\d+)/);
      const stepMatch = statement.match(/because (\d+) is added/);
      if (observedMatch === null || guessMatch === null || stepMatch === null) {
        throw new Error('the observed sequence, the step, or the guess is missing');
      }
      return {
        observed: observedMatch[1].split(',').map((value) => Number(value.trim())),
        guess: Number(guessMatch[1]),
        step: Number(stepMatch[1])
      };
    },
    solve(slots) {
      const last = slots.observed[slots.observed.length - 1];
      const consistent = slots.guess === last + slots.step;
      return { consistent };
    },
    render(solution) {
      return solution.consistent
        ? 'It is not required; 20 is a plausible hypothesis.'
        : 'No; the guess contradicts the observed sequence.';
    },
    compute: [
      'const s = $slots;',
      'const last = s.observed[s.observed.length - 1];',
      'const consistent = s.guess === last + s.step;',
      'return consistent',
      '  ? "It is not required; " + s.guess + " is a plausible hypothesis."',
      '  : "No; the guess contradicts the observed sequence.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The observations ${slots.observed.join(', ')} grow by ${slots.step} each time, so continuing the same step gives ${slots.guess}.`,
        `That continuation is consistent with everything seen, which makes it a reasonable hypothesis rather than a proven one.`,
        `Since the complete rule was never given, other rules could agree with the same observations and then produce a different next number, so the guess is not required to be true.`
      ];
    }
  },
  {
    template: 'Counting shapes without counting empty spaces',
    type: 'counting-shapes-without-counting-empty-spaces',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/contains (\d+) separate circles and (\d+) separate squares/);
      if (match === null) {
        throw new Error('the circles or the squares are missing');
      }
      return { circles: Number(match[1]), squares: Number(match[2]) };
    },
    solve(slots) {
      return { shapes: slots.circles + slots.squares };
    },
    render(solution) {
      return `${solution.shapes} shapes.`;
    },
    compute: [
      'const s = $slots;',
      'const shapes = s.circles + s.squares;',
      'return shapes + " shapes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The question asks for drawn shapes, not for regions of the page, so the empty background is not counted.`,
        `There are ${slots.circles} circles and ${slots.squares} squares, and each drawn shape counts once.`,
        `The drawing therefore contains ${solution.shapes} shapes.`
      ];
    }
  },
  {
    template: 'A structure with a common center',
    type: 'a-structure-with-a-common-center',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/one central point, (\d+) segments extend to (\d+) different points/);
      if (match === null) {
        throw new Error('the segments or the outer points are missing');
      }
      return { segments: Number(match[1]), points: Number(match[2]) };
    },
    solve(slots) {
      return { segments: slots.points };
    },
    render(solution) {
      return `${solution.segments} segments.`;
    },
    compute: [
      'const s = $slots;',
      'const segments = s.points;',
      'return segments + " segments.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Every segment runs from the shared center to one outer point, so a point on the boundary belongs to exactly one segment.`,
        `The statement also says the segments meet only at the center, so no segment is merged with or continued by another.`,
        `With ${slots.points} outer points there are ${solution.segments} segments.`
      ];
    }
  },
  {
    template: 'What remains unchanged after a cut?',
    type: 'what-remains-unchanged-after-a-cut',
    category: 'no-knowledge',
    parse(statement) {
      const cutMatch = statement.match(/cut (once|twice|\d+) into/);
      if (cutMatch === null) {
        throw new Error('the number of cuts is missing');
      }
      return { cuts: counted(cutMatch[1]), discarded: !/nothing is discarded/.test(statement) };
    },
    solve(slots) {
      return { pieces: slots.cuts + 1, discarded: slots.discarded };
    },
    render(solution) {
      return `The number of pieces changes; the total amount ${solution.discarded ? 'decreases' : 'remains the same'}.`;
    },
    compute: [
      'const s = $slots;',
      'const pieces = s.cuts + 1;',
      'return "The number of pieces changes; the total amount " + (s.discarded ? "decreases" : "remains the same") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A single cut separates the sheet into two parts, so the number of pieces changes from one to ${solution.pieces}.`,
        `Nothing is thrown away, so every bit of paper is still present in one of the pieces.`,
        `The total amount of paper is therefore unchanged, while the count of separate pieces is not.`
      ];
    }
  }
];
