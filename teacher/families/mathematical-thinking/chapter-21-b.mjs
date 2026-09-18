/**
 * Families for chapter 21 of the mathematical seed book: sets, properties, and
 * logical classification (part B: templates 21.10-21.17). A continuation part of
 * `chapter-21.mjs`: same chapter number, same helpers, its own cases. Every
 * premise of every solution is stated in the problem text, so the whole chapter
 * is `no-knowledge`.
 */

export const unit = 21;

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
    if (keep(value)) total += 1;
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
    template: 'The Label That Separates Two Objects',
    type: 'the-label-that-separates-two-objects',
    category: 'no-knowledge',
    parse(statement) {
      const pair = statement.match(/A is ([^;]+); B is ([^.]+)\./);
      if (pair === null) {
        throw new Error('the two property descriptions are missing');
      }
      return { first: splitWords(pair[1]), second: splitWords(pair[2]) };
    },
    solve(slots) {
      if (slots.first.length !== slots.second.length) {
        throw new Error('the two objects do not have comparable properties');
      }
      const differing = slots.first.filter((value, index) => value !== slots.second[index]);
      if (differing.length === 0) {
        throw new Error('the two objects are indistinguishable');
      }
      return { property: differing[0] };
    },
    render(solution) {
      return `“Is it ${solution.property}?”`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.first.length !== slots.second.length) { throw new Error("the two objects do not have comparable properties"); }',
      'let property = null;',
      'for (let index = 0; index < slots.first.length; index += 1) {',
      '  if (slots.first[index] !== slots.second[index]) { property = slots.first[index]; break; }',
      '}',
      'if (property === null) { throw new Error("the two objects are indistinguishable"); }',
      'return "“Is it " + property + "?”";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A yes/no question tells the two objects apart only if the two objects answer differently.`,
        `Comparing ${slots.first.join(', ')} with ${slots.second.join(', ')} shows that the red and small properties are shared.`,
        `The property "${solution.property}" is the only one whose value differs, so that question identifies the piece with certainty.`
      ];
    }
  },
  {
    template: 'A Two-Question Classification Tree',
    type: 'a-two-question-classification-tree',
    category: 'no-knowledge',
    parse(statement) {
      const pieces = [...statement.matchAll(/([A-D])=([a-z]+) ([a-z]+)/g)].map((match) => ({
        name: match[1],
        properties: [match[2], match[3]]
      }));
      const first = statement.match(/Question 1 is “Is it (\w+)\?”/);
      if (pieces.length !== 4 || first === null) {
        throw new Error('the piece descriptions or the first question are missing');
      }
      return { pieces, firstProperty: first[1] };
    },
    solve(slots) {
      const groups = new Map();
      for (const piece of slots.pieces) {
        const key = piece.properties.includes(slots.firstProperty) ? 'yes' : 'no';
        groups.set(key, [...(groups.get(key) ?? []), piece]);
      }
      let candidates = null;
      for (const group of groups.values()) {
        const usable = [];
        for (let index = 0; index < group[0].properties.length; index += 1) {
          if (group.some((piece) => piece.properties[index] !== group[0].properties[index])) {
            usable.push(index);
          }
        }
        candidates = candidates === null ? usable : candidates.filter((index) => usable.includes(index));
      }
      if (candidates === null || candidates.length === 0) {
        throw new Error('no second question separates the remaining pieces');
      }
      return { property: slots.pieces[0].properties[candidates[0]] };
    },
    render(solution) {
      return `The second question can be “Is it ${solution.property}?”.`;
    },
    compute: [
      'const slots = $slots;',
      'const groups = {};',
      'for (const piece of slots.pieces) {',
      '  const key = piece.properties.includes(slots.firstProperty) ? "yes" : "no";',
      '  groups[key] = (groups[key] || []).concat([piece]);',
      '}',
      'let candidates = null;',
      'for (const key of Object.keys(groups)) {',
      '  const group = groups[key];',
      '  const usable = [];',
      '  for (let index = 0; index < group[0].properties.length; index += 1) {',
      '    let differs = false;',
      '    for (const piece of group) {',
      '      if (piece.properties[index] !== group[0].properties[index]) { differs = true; }',
      '    }',
      '    if (differs) { usable.push(index); }',
      '  }',
      '  candidates = candidates === null ? usable : candidates.filter(function (index) { return usable.indexOf(index) !== -1; });',
      '}',
      'if (candidates === null || candidates.length === 0) { throw new Error("no second question separates the remaining pieces"); }',
      'return "The second question can be “Is it " + slots.pieces[0].properties[candidates[0]] + "?”.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The first question "Is it ${slots.firstProperty}?" splits the four pieces into two pairs that share the answer.`,
        `Inside each pair the pieces differ in exactly one property, so the second question must ask about that property.`,
        `Both pairs point to the same property "${solution.property}", so that question identifies the piece with certainty.`
      ];
    }
  },
  {
    template: 'The Redundant Clue',
    type: 'the-redundant-clue',
    category: 'no-knowledge',
    parse(statement) {
      const candidates = statement.match(/one of ([\d, and]+)\./);
      const clues = [...statement.matchAll(/\((\d)\) it is (greater|less) than (\d+)/g)].map((match) => ({
        number: Number(match[1]),
        op: match[2],
        value: Number(match[3])
      }));
      if (candidates === null || clues.length < 3) {
        throw new Error('the candidates or the numbered clues are missing');
      }
      return { candidates: splitNumbers(candidates[1]), clues };
    },
    solve(slots) {
      const keep = (values, clue) =>
        values.filter((value) => (clue.op === 'greater' ? value > clue.value : value < clue.value));
      const base = keep(keep(slots.candidates, slots.clues[0]), slots.clues[1]);
      for (const clue of slots.clues.slice(2)) {
        const after = keep(base, clue);
        if (after.length === base.length) {
          return { clue: clue.number, base };
        }
      }
      throw new Error('no redundant clue was found');
    },
    render(solution) {
      return `Clue ${solution.clue}.`;
    },
    compute: [
      'const slots = $slots;',
      'const keep = function (values, clue) {',
      '  return values.filter(function (value) {',
      '    return clue.op === "greater" ? value > clue.value : value < clue.value;',
      '  });',
      '};',
      'let base = keep(keep(slots.candidates, slots.clues[0]), slots.clues[1]);',
      'let answer = null;',
      'for (const clue of slots.clues.slice(2)) {',
      '  if (keep(base, clue).length === base.length) { answer = clue.number; break; }',
      '}',
      'if (answer === null) { throw new Error("no redundant clue was found"); }',
      'return "Clue " + answer + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The first two clues narrow the candidates ${slots.candidates.join(', ')} down to ${solution.base.join(', ')}.`,
        `A clue is useless when it removes none of the surviving candidates.`,
        `Applying clue ${solution.clue} leaves those candidates unchanged, so it adds no information.`
      ];
    }
  },
  {
    template: 'Two Descriptions of the Same Group',
    type: 'two-descriptions-of-the-same-group',
    category: 'no-knowledge',
    parse(statement) {
      const listed = statement.match(/Group A contains the numbers ([\d, and]+)\./);
      const bounds = statement.match(/even numbers greater than (\d+) and less than (\d+)/);
      if (listed === null || bounds === null) {
        throw new Error('the explicit list or the definition of the second group is missing');
      }
      return { listed: splitNumbers(listed[1]), lower: Number(bounds[1]), upper: Number(bounds[2]) };
    },
    solve(slots) {
      const defined = [];
      for (let value = slots.lower + 1; value < slots.upper; value += 1) {
        if (value % 2 === 0) {
          defined.push(value);
        }
      }
      const sortedListed = [...slots.listed].sort((left, right) => left - right);
      const equal =
        sortedListed.length === defined.length && sortedListed.every((value, index) => value === defined[index]);
      return { equal, defined };
    },
    render(solution) {
      return solution.equal ? 'Yes, the groups are equal.' : 'No, the groups are different.';
    },
    compute: [
      'const slots = $slots;',
      'const defined = [];',
      'for (let value = slots.lower + 1; value < slots.upper; value += 1) {',
      '  if (value % 2 === 0) { defined.push(value); }',
      '}',
      'const listed = slots.listed.slice().sort(function (left, right) { return left - right; });',
      'let equal = listed.length === defined.length;',
      'for (let index = 0; index < listed.length; index += 1) {',
      '  if (listed[index] !== defined[index]) { equal = false; }',
      '}',
      'return equal ? "Yes, the groups are equal." : "No, the groups are different.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Two groups are the same when they contain exactly the same elements, no matter how they are described.',
        `The listed elements ${slots.listed.join(', ')} and the even integers strictly between ${slots.lower} and ${slots.upper} are ${solution.defined.join(', ')}.`,
        'The two descriptions pick out identical elements, so the groups are equal.'
      ];
    }
  },
  {
    template: 'The Missing Number in Two Circles',
    type: 'the-missing-number-in-two-circles',
    category: 'no-knowledge',
    parse(statement) {
      const total = statement.match(/group of (\d+) children/);
      const apples = statement.match(/(\d+) choose apples/);
      const pears = statement.match(/(\d+) choose pears/);
      const both = statement.match(/(\d+) choose both fruits/);
      if (total === null || apples === null || pears === null || both === null) {
        throw new Error('the total or one of the fruit counts is missing');
      }
      return {
        total: Number(total[1]),
        apples: Number(apples[1]),
        pears: Number(pears[1]),
        both: Number(both[1])
      };
    },
    solve(slots) {
      const applesOnly = slots.apples - slots.both;
      const pearsOnly = slots.pears - slots.both;
      const union = applesOnly + slots.both + pearsOnly;
      if (union !== slots.total) {
        return { compatible: false, union, applesOnly, pearsOnly };
      }
      return { compatible: true, union, applesOnly, pearsOnly };
    },
    render(solution) {
      return solution.compatible
        ? `Only apples: ${solution.applesOnly}, only pears: ${solution.pearsOnly}.`
        : `The data are incompatible; they account for only ${solution.union} children.`;
    },
    compute: [
      'const slots = $slots;',
      'const applesOnly = slots.apples - slots.both;',
      'const pearsOnly = slots.pears - slots.both;',
      'const union = applesOnly + slots.both + pearsOnly;',
      'if (union !== slots.total) {',
      '  return "The data are incompatible; they account for only " + union + " children.";',
      '}',
      'return "Only apples: " + applesOnly + ", only pears: " + pearsOnly + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Every child choosing at least one fruit is counted once as apples-only, once as both, and once as pears-only.`,
        `Those three parts give ${solution.applesOnly} + ${slots.both} + ${solution.pearsOnly} = ${solution.union} children, but the group has ${slots.total}.`,
        'The counts therefore cannot describe the same group of children, so the data are incompatible.'
      ];
    }
  },
  {
    template: 'Detect Incompatible Data',
    type: 'detect-incompatible-data',
    category: 'no-knowledge',
    parse(statement) {
      const total = statement.match(/class has (\d+) students/);
      const pencil = statement.match(/(\d+) brought a pencil/);
      const ruler = statement.match(/(\d+) brought a ruler/);
      const neither = statement.match(/(\d+) brought neither/);
      const both = statement.match(/that (\d+) students brought both objects/);
      if (total === null || pencil === null || ruler === null || neither === null || both === null) {
        throw new Error('one of the counts is missing');
      }
      return {
        total: Number(total[1]),
        pencil: Number(pencil[1]),
        ruler: Number(ruler[1]),
        neither: Number(neither[1]),
        both: Number(both[1])
      };
    },
    solve(slots) {
      const atLeastOne = slots.total - slots.neither;
      const union = slots.pencil + slots.ruler - slots.both;
      return { possible: union === atLeastOne };
    },
    render(solution) {
      return solution.possible ? 'Yes.' : 'No.';
    },
    compute: [
      'const slots = $slots;',
      'const atLeastOne = slots.total - slots.neither;',
      'const union = slots.pencil + slots.ruler - slots.both;',
      'return union === atLeastOne ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Since ${slots.neither} students brought neither object, exactly ${slots.total} - ${slots.neither} students brought at least one.`,
        `With ${slots.both} bringing both, the union rule would give ${slots.pencil} + ${slots.ruler} - ${slots.both} = ${slots.pencil + slots.ruler - slots.both} students.`,
        'The two numbers must agree for the data to be consistent, and here they do not.'
      ];
    }
  },
  {
    template: 'Three Properties, Only One Possible Object',
    type: 'three-properties-only-one-possible-object',
    category: 'no-knowledge',
    parse(statement) {
      const cards = [...statement.matchAll(/([A-D]) ([a-z]+)-([a-z]+)-([a-z]+)/g)].map((match) => ({
        name: match[1],
        properties: [match[2], match[3], match[4]]
      }));
      const excluded = statement.match(/not ([a-z]+), not ([a-z]+), and not ([a-z]+)/);
      if (cards.length !== 4 || excluded === null) {
        throw new Error('the card descriptions or the excluded values are missing');
      }
      return { cards, excluded: [excluded[1], excluded[2], excluded[3]] };
    },
    solve(slots) {
      const matching = slots.cards.filter((card) =>
        card.properties.every((property) => !slots.excluded.includes(property))
      );
      if (matching.length !== 1) {
        throw new Error(`the filters keep ${matching.length} cards instead of one`);
      }
      return { name: matching[0].name };
    },
    render(solution) {
      return `Card ${solution.name}.`;
    },
    compute: [
      'const slots = $slots;',
      'const matching = slots.cards.filter(function (card) {',
      '  return card.properties.every(function (property) { return slots.excluded.indexOf(property) === -1; });',
      '});',
      'if (matching.length !== 1) { throw new Error("the filters keep " + matching.length + " cards instead of one"); }',
      'return "Card " + matching[0].name + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each "not ..." removes every card carrying that value, and the three filters must hold together.`,
        `Removing cards with ${slots.excluded.join(', ')} from the four descriptions leaves only ${solution.name}.`,
        'One surviving card means the description determines the object uniquely.'
      ];
    }
  },
  {
    template: 'A Necessary but Not Sufficient Property',
    type: 'a-necessary-but-not-sufficient-property',
    category: 'no-knowledge',
    parse(statement) {
      const required = statement.match(/All VIP tickets are (\w+)/);
      const asked = statement.match(/If you see a (\w+) ticket, can it be VIP\? If you see a (\w+) ticket, do you know/);
      if (required === null || asked === null) {
        throw new Error('the rule or the two asked values are missing');
      }
      return { required: required[1], asked: [asked[1], asked[2]] };
    },
    solve(slots) {
      return {
        verdicts: slots.asked.map((value) => ({
          value,
          verdict: value === slots.required ? 'unknown' : 'cannot'
        }))
      };
    },
    render(solution) {
      const text = solution.verdicts
        .map(({ value, verdict }) => {
          const capital = value.charAt(0).toUpperCase() + value.slice(1);
          return `${capital}: ${verdict === 'cannot' ? 'it cannot be VIP' : 'we cannot know for certain'}`;
        })
        .join('. ');
      return `${text}.`;
    },
    compute: [
      'const slots = $slots;',
      'const parts = slots.asked.map(function (value) {',
      '  const capital = value.charAt(0).toUpperCase() + value.slice(1);',
      '  if (value === slots.required) { return capital + ": we cannot know for certain"; }',
      '  return capital + ": it cannot be VIP";',
      '});',
      'return parts.join(". ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The rule "all VIP tickets are ${slots.required}" makes that value necessary for being VIP, so a ticket without it cannot be VIP.`,
        `A ${slots.asked[0]} ticket is not ${slots.required}, which excludes it from the VIP group.`,
        `A ${slots.required} ticket is only known to satisfy the necessary condition, and ordinary tickets may share it, so VIP status is not decided.`
      ];
    }
  }
];
