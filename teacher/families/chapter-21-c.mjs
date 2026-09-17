/**
 * Families for chapter 21 of the mathematical seed book: sets, properties, and
 * logical classification (part C: templates 21.18-21.25).
 *
 * This is a continuation part of `chapter-21.mjs`; it declares the same chapter
 * number and repeats the header and the helpers, so the family loader can read
 * each part independently. Every premise of every solution is stated in the
 * problem text, so the whole chapter is `no-knowledge`.
 */

export const chapter = 21;

function splitWords(text) {
  return text
    .split(/,| and /)
    .map((value) => value.trim())
    .filter((value) => value !== '');
}

function splitNumbers(text) {
  return splitWords(text).map((value) => Number(value));
}

function countWithin(low, high, keep) {
  let total = 0;
  for (let value = low; value <= high; value += 1) {
    if (keep(value)) {
      total += 1;
    }
  }
  return total;
}

function matchesQuestion(question, value) {
  const atMost = question.match(/at most (\d+)/);
  if (atMost !== null) {
    return value <= Number(atMost[1]);
  }
  const exact = question.match(/the number (\d+)/);
  if (exact !== null) {
    return value === Number(exact[1]);
  }
  throw new Error(`unsupported question "${question}"`);
}

export const cases = [
  {
    template: 'Exactly One Correct Label',
    type: 'exactly-one-correct-label',
    category: 'no-knowledge',
    parse(statement) {
      const boxes = statement.match(/labeled (\w), (\w), (\w)/);
      const opened = statement.match(/We open (\w+) and see (\w+); (\w+)'s label says “(\w+)\.?”/);
      if (boxes === null || opened === null) {
        throw new Error('the boxes or the opened box description are missing');
      }
      return {
        boxes: [boxes[1], boxes[2], boxes[3]],
        opened: opened[1],
        contents: opened[2],
        label: opened[4]
      };
    },
    solve(slots) {
      const confirmed = slots.contents === slots.label;
      const others = slots.boxes.filter((name) => name !== slots.opened);
      return { confirmed, others };
    },
    render(solution) {
      if (!solution.confirmed) {
        return 'The opened label is wrong, so the answer is not determined by it.';
      }
      return `The labels on boxes ${solution.others.join(' and ')} are both wrong.`;
    },
    compute: [
      'const slots = $slots;',
      'const others = slots.boxes.filter(function (name) { return name !== slots.opened; });',
      'if (slots.contents !== slots.label) {',
      '  return "The opened label is wrong, so the answer is not determined by it.";',
      '}',
      'return "The labels on boxes " + others.join(" and ") + " are both wrong.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Exactly one of the three labels is already known to be correct, and opening ${slots.opened} confirms that its label matches its contents.`,
        `With the single correct label used up on box ${slots.opened}, neither of the other labels can be correct.`,
        `Therefore the labels on boxes ${solution.others.join(' and ')} are both wrong.`
      ];
    }
  },
  {
    template: 'How Many Objects Share the Same Property?',
    type: 'how-many-objects-share-the-same-property',
    category: 'no-knowledge',
    parse(statement) {
      const total = statement.match(/There are (\d+) pencils/);
      const colors = statement.match(/colors: (\w+) or (\w+)/);
      if (total === null || colors === null) {
        throw new Error('the object count or the two possible colors are missing');
      }
      return { total: Number(total[1]), colors: 2 };
    },
    solve(slots) {
      return { smallestShared: Math.ceil(slots.total / slots.colors) };
    },
    render(solution) {
      return `At least ${solution.smallestShared} pencils have the same color.`;
    },
    compute: [
      'const slots = $slots;',
      'return "At least " + Math.ceil(slots.total / slots.colors) + " pencils have the same color.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Splitting ${slots.total} pencils between ${slots.colors} colors, suppose no color had ${solution.smallestShared} pencils.`,
        `Then each color would have at most ${solution.smallestShared - 1} pencils, giving at most ${slots.colors * (solution.smallestShared - 1)} pencils in total, which is fewer than ${slots.total}.`,
        `That contradiction forces at least ${solution.smallestShared} pencils to share one color, whatever the exact distribution is.`
      ];
    }
  },
  {
    template: 'Pairs with Different Types of Partners',
    type: 'pairs-with-different-types-of-partners',
    category: 'no-knowledge',
    parse(statement) {
      const counts = statement.match(/We have (\d+) round buttons and (\d+) square buttons/);
      if (counts === null) {
        throw new Error('the two button counts are missing');
      }
      return { round: Number(counts[1]), square: Number(counts[2]) };
    },
    solve(slots) {
      const pairs = Math.min(slots.round, slots.square);
      const leftover = Math.abs(slots.round - slots.square);
      const leftoverType = slots.round > slots.square ? 'round' : 'square';
      return { pairs, leftover, leftoverType };
    },
    render(solution) {
      return `${solution.pairs} pairs; ${solution.leftover} ${solution.leftoverType} buttons remain.`;
    },
    compute: [
      'const slots = $slots;',
      'const pairs = Math.min(slots.round, slots.square);',
      'const leftover = Math.abs(slots.round - slots.square);',
      'const type = slots.round > slots.square ? "round" : "square";',
      'return pairs + " pairs; " + leftover + " " + type + " buttons remain.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Every pair consumes one button of each type, so the number of pairs cannot exceed either group.`,
        `The smaller group (${Math.min(slots.round, slots.square)}) is used up completely, giving ${solution.pairs} pairs.`,
        `The difference between the two counts leaves ${solution.leftover} ${solution.leftoverType} buttons with no partner.`
      ];
    }
  },
  {
    template: 'Choose the Question That Splits Best',
    type: 'choose-the-question-that-splits-best',
    category: 'no-knowledge',
    parse(statement) {
      const candidates = statement.match(/one of ([\d, and]+)\./);
      const first = statement.match(/Q1 “([^”]+)”/);
      const second = statement.match(/Q2 “([^”]+)”/);
      if (candidates === null || first === null || second === null) {
        throw new Error('the candidates or the two questions are missing');
      }
      return { candidates: splitNumbers(candidates[1]), questions: [first[1], second[1]] };
    },
    solve(slots) {
      const partitions = slots.questions.map((question, index) => {
        const yes = slots.candidates.filter((value) => matchesQuestion(question, value));
        const remaining = Math.max(yes.length, slots.candidates.length - yes.length);
        return { index: index + 1, question, remaining };
      });
      let best = partitions[0];
      for (const part of partitions) {
        if (part.remaining < best.remaining) {
          best = part;
        }
      }
      return { best };
    },
    render(solution) {
      return `Q${solution.best.index}: “${solution.best.question}”.`;
    },
    compute: [
      'const slots = $slots;',
      'const parts = slots.questions.map(function (question, index) {',
      '  const atMost = question.match(/at most (\\d+)/);',
      '  const exact = question.match(/the number (\\d+)/);',
      '  if (atMost === null && exact === null) { throw new Error("unsupported question \\"" + question + "\\""); }',
      '  const yes = slots.candidates.filter(function (value) {',
      '    if (atMost !== null) { return value <= Number(atMost[1]); }',
      '    return value === Number(exact[1]);',
      '  });',
      '  const remaining = Math.max(yes.length, slots.candidates.length - yes.length);',
      '  return { index: index + 1, question, remaining };',
      '});',
      'let best = parts[0];',
      'for (const part of parts) { if (part.remaining < best.remaining) { best = part; } }',
      'return "Q" + best.index + ": “" + best.question + "”.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A question is balanced when the larger of its two answer groups is as small as possible.`,
        `"Is the number 1?" leaves up to 7 candidates, while "Is the number at most 4?" splits the ${slots.candidates.length} candidates into two groups of 4.`,
        `The second question keeps fewer candidates in the worst case, so ${solution.best.question} is the more balanced question.`
      ];
    }
  },
  {
    template: 'Classification into Three Non-Overlapping Boxes',
    type: 'classification-into-three-non-overlapping-boxes',
    category: 'no-knowledge',
    parse(statement) {
      const domain = statement.match(/numbers (\d+)–(\d+) must be divided/);
      const boxes = [...statement.matchAll(/([ABC]) for (\d+)–(\d+)/g)].map((match) => ({
        name: match[1],
        lo: Number(match[2]),
        hi: Number(match[3])
      }));
      const proposed = [...statement.matchAll(/“numbers (greater|less) than (\d+)” for ([ABC])/g)].map((match) => ({
        op: match[1],
        value: Number(match[2]),
        box: match[3]
      }));
      if (domain === null || boxes.length !== 3 || proposed.length < 2) {
        throw new Error('the domain, the boxes, or the proposed rules are missing');
      }
      return { low: Number(domain[1]), high: Number(domain[2]), boxes, proposed };
    },
    solve(slots) {
      for (const rule of slots.proposed) {
        const intended = slots.boxes.find((box) => box.name === rule.box);
        const outside = [];
        for (let value = slots.low; value <= slots.high; value += 1) {
          const inside = rule.op === 'greater' ? value > rule.value : value < rule.value;
          if (inside && (value < intended.lo || value > intended.hi)) {
            outside.push(value);
          }
        }
        if (outside.length > 0) {
          return { box: intended, outside };
        }
      }
      throw new Error('no proposed rule overflows its box');
    },
    render(solution) {
      return `The rule for ${solution.box.name} must be limited to ${solution.box.lo}–${solution.box.hi}.`;
    },
    compute: [
      'const slots = $slots;',
      'let offending = null;',
      'for (const rule of slots.proposed) {',
      '  const intended = slots.boxes.filter(function (box) { return box.name === rule.box; })[0];',
      '  let overflow = false;',
      '  for (let value = slots.low; value <= slots.high; value += 1) {',
      '    const inside = rule.op === "greater" ? value > rule.value : value < rule.value;',
      '    if (inside && (value < intended.lo || value > intended.hi)) { overflow = true; }',
      '  }',
      '  if (overflow) { offending = intended; break; }',
      '}',
      'if (offending === null) { throw new Error("no proposed rule overflows its box"); }',
      'return "The rule for " + offending.name + " must be limited to " + offending.lo + "–" + offending.hi + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A classification is non-overlapping only when each rule selects exactly the numbers of its own box.`,
        `The proposed rule for ${solution.box.name} also selects ${solution.outside.join(', ')} from other boxes, so it overlaps them.`,
        `Restricting that rule to its intended range ${solution.box.lo}–${solution.box.hi} removes the overlap.`
      ];
    }
  },
  {
    template: 'Deduction by Excluding Categories',
    type: 'deduction-by-excluding-categories',
    category: 'no-knowledge',
    parse(statement) {
      const domain = statement.match(/either (\w+), (\w+), or (\w+)/);
      const excluded = statement.match(/not made of (\w+) and not made of (\w+)/);
      if (domain === null || excluded === null) {
        throw new Error('the domain or the excluded values are missing');
      }
      return {
        domain: [domain[1], domain[2], domain[3]],
        excluded: [excluded[1], excluded[2]]
      };
    },
    solve(slots) {
      const remaining = slots.domain.filter((value) => !slots.excluded.includes(value));
      if (remaining.length !== 1) {
        throw new Error(`the exclusions leave ${remaining.length} values instead of one`);
      }
      return { value: remaining[0] };
    },
    render(solution) {
      return `${solution.value.charAt(0).toUpperCase()}${solution.value.slice(1)}.`;
    },
    compute: [
      'const slots = $slots;',
      'const remaining = slots.domain.filter(function (value) { return slots.excluded.indexOf(value) === -1; });',
      'if (remaining.length !== 1) { throw new Error("the exclusions leave " + remaining.length + " values instead of one"); }',
      'const value = remaining[0];',
      'return value.charAt(0).toUpperCase() + value.slice(1) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The object has exactly one of the three possible values: ${slots.domain.join(', ')}.`,
        `Excluding ${slots.excluded.join(' and ')} removes all but one of them.`,
        `The only value left is ${solution.value}, and it must be the answer.`
      ];
    }
  },
  {
    template: 'A Group Defined by Two Thresholds',
    type: 'a-group-defined-by-two-thresholds',
    category: 'no-knowledge',
    parse(statement) {
      const domain = statement.match(/Among the numbers (\d+)–(\d+)/);
      const bounds = statement.match(/greater than (\d+) and at most (\d+)/);
      if (domain === null || bounds === null) {
        throw new Error('the number range or the two thresholds are missing');
      }
      return {
        low: Number(domain[1]),
        high: Number(domain[2]),
        lower: Number(bounds[1]),
        upper: Number(bounds[2])
      };
    },
    solve(slots) {
      const elements = [];
      for (let value = slots.low; value <= slots.high; value += 1) {
        if (value > slots.lower && value <= slots.upper) {
          elements.push(value);
        }
      }
      if (elements.length === 0) {
        throw new Error('the two thresholds select no elements');
      }
      return { elements };
    },
    render(solution) {
      return `M={${solution.elements.join(',')}}; ${solution.elements.length} elements.`;
    },
    compute: [
      'const slots = $slots;',
      'const elements = [];',
      'for (let value = slots.low; value <= slots.high; value += 1) {',
      '  if (value > slots.lower && value <= slots.upper) { elements.push(value); }',
      '}',
      'if (elements.length === 0) { throw new Error("the two thresholds select no elements"); }',
      'return "M={" + elements.join(",") + "}; " + elements.length + " elements.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The definition is a conjunction: a number belongs to M only if it is greater than ${slots.lower} and at most ${slots.upper}.`,
        `Testing the numbers ${slots.low} to ${slots.high} against both comparisons keeps ${solution.elements.join(', ')}.`,
        `"Greater than" excludes ${slots.lower} itself and "at most" includes ${slots.upper}, so the group has ${solution.elements.length} elements.`
      ];
    }
  },
  {
    template: 'Classification Rule Tested on Cases',
    type: 'classification-rule-tested-on-cases',
    category: 'no-knowledge',
    parse(statement) {
      const threshold = statement.match(/less than (\d+)/);
      const inputs = statement.match(/For inputs ([\d, and]+),/);
      if (threshold === null || inputs === null) {
        throw new Error('the threshold or the input list is missing');
      }
      return { threshold: Number(threshold[1]), inputs: splitNumbers(inputs[1]) };
    },
    solve(slots) {
      const assignments = slots.inputs.map((value) => ({
        value,
        box: value < slots.threshold ? 'A' : 'B'
      }));
      return { assignments };
    },
    render(solution) {
      return `${solution.assignments.map(({ value, box }) => `${value}→${box}`).join(', ')}.`;
    },
    compute: [
      'const slots = $slots;',
      'const parts = slots.inputs.map(function (value) {',
      '  return value + "→" + (value < slots.threshold ? "A" : "B");',
      '});',
      'return parts.join(", ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The machine applies one test: is the number less than ${slots.threshold}?`,
        `Numbers that pass go to box A, and "otherwise" sends every remaining number to box B.`,
        `Applying the test to ${slots.inputs.join(', ')} gives ${solution.assignments.map(({ value, box }) => `${value}→${box}`).join(', ')}.`
      ];
    }
  }
];
