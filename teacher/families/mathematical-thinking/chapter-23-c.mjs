/**
 * Families for chapter 23 of the mathematical seed book: information,
 * questions, and deduction.
 *
 * Every printed template of this chapter is a single individually titled
 * puzzle, so each template gets one case. A case parses the candidates and the
 * clues out of the problem text, filters the candidates with a small predicate
 * algebra, and prints the answer sentence the source prints. Two templates use
 * a fact the text does not state (the previous problem's code convention and
 * the reading of "round" as a circle), so they carry a `literal` fact wire the
 * computation reads as `$facts` and are filed as `knowledge`.
 */

export const unit = 23;

const QUOTED = /[“"]([^“”"]+)[”"]/g;
const COUNT_WORDS = { one: 1, two: 2, three: 3 };
const OPPOSITES = { large: 'small', small: 'large', tall: 'short', short: 'tall', heavy: 'light', light: 'heavy' };
const ROUND_FACTS = { round: 'circle' };
const CODE_DIGITS = { yes: '1', no: '0' };
const ATTRIBUTE_CATEGORIES = {
  circle: 'shape', square: 'shape', triangle: 'shape', sphere: 'shape', cube: 'shape',
  red: 'color', blue: 'color', green: 'color', yellow: 'color'
};

function quotedSpans(text) {
  return [...String(text).matchAll(QUOTED)].map((match) => match[1]);
}

function numbersAfter(statement, prefix) {
  const index = statement.indexOf(prefix);
  if (index < 0) {
    throw new Error(`missing "${prefix}" in the statement`);
  }
  const clause = statement.slice(index + prefix.length).split(/[.?]/)[0];
  const numbers = [...clause.matchAll(/\d+/g)].map((match) => Number(match[0]));
  if (numbers.length === 0) {
    throw new Error(`no numbers in the "${prefix}" clause`);
  }
  return numbers;
}

function normalizeClue(text) {
  return String(text).toLowerCase()
    .replace(/^(the number|it)\s+is\s+/, '')
    .replace(/^the number\s+/, '')
    .replace(/^is the number\s+/, '')
    .replace(/^is it\s+/, '')
    .replace(/\?+$/, '')
    .trim();
}

const CLAUSE_PATTERNS = [
  [/^not less than (\d+)$/, 'ge'],
  [/^less than or equal to (\d+)$/, 'le'],
  [/^greater than (\d+)$/, 'gt'],
  [/^less than (\d+)$/, 'lt'],
  [/^at least (\d+)$/, 'ge'],
  [/^at most (\d+)$/, 'le'],
  [/^(\d+)$/, 'eq']
];

function predicateFromText(text) {
  const value = normalizeClue(text);
  if (value.includes(' and ')) {
    return { op: 'and', of: value.split(' and ').map(predicateFromText) };
  }
  if (value === 'even') {
    return { op: 'even' };
  }
  if (value === 'odd') {
    return { op: 'odd' };
  }
  let match = value.match(/^not (?:a )?(\w+)$/);
  if (match !== null) {
    return { op: 'lacks', word: match[1] };
  }
  for (const [pattern, op] of CLAUSE_PATTERNS) {
    match = value.match(pattern);
    if (match !== null) {
      return { op, value: Number(match[1]) };
    }
  }
  throw new Error(`unsupported clue text "${text}"`);
}

function matches(value, predicate) {
  if (predicate.op === 'and') {
    return predicate.of.every((part) => matches(value, part));
  }
  if (predicate.op === 'eq') {
    return Number(value) === predicate.value;
  }
  if (predicate.op === 'gt') {
    return Number(value) > predicate.value;
  }
  if (predicate.op === 'lt') {
    return Number(value) < predicate.value;
  }
  if (predicate.op === 'ge') {
    return Number(value) >= predicate.value;
  }
  if (predicate.op === 'le') {
    return Number(value) <= predicate.value;
  }
  if (predicate.op === 'even') {
    return Number(value) % 2 === 0;
  }
  if (predicate.op === 'odd') {
    return Math.abs(Number(value) % 2) === 1;
  }
  if (predicate.op === 'lacks') {
    return !String(value).includes(predicate.word);
  }
  throw new Error(`unsupported predicate "${predicate.op}"`);
}

function keep(candidates, predicate) {
  return candidates.filter((value) => matches(value, predicate));
}

function joinList(items) {
  const parts = items.map(String);
  if (parts.length === 1) {
    return parts[0];
  }
  if (parts.length === 2) {
    return `${parts[0]} and ${parts[1]}`;
  }
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

function joinOr(items) {
  const parts = items.map(String);
  if (parts.length === 1) {
    return parts[0];
  }
  if (parts.length === 2) {
    return `${parts[0]} or ${parts[1]}`;
  }
  return `${parts.slice(0, -1).join(', ')}, or ${parts[parts.length - 1]}`;
}

function capitalizeFirst(text) {
  return text.length === 0 ? text : text[0].toUpperCase() + text.slice(1);
}

function propertyValue(word, description) {
  const words = String(description).toLowerCase().split(/\s+/);
  if (words.includes(word)) {
    return true;
  }
  if (OPPOSITES[word] !== undefined && words.includes(OPPOSITES[word])) {
    return false;
  }
  return null;
}

function questionValue(option, description, flatFaces) {
  const word = option.toLowerCase()
    .replace('does it have ', '').replace('is it ', '').replace('does it ', '').replace('?', '').trim();
  if (word === 'flat faces' || word === 'flat face') {
    const words = description.toLowerCase().split(/\s+/);
    if (words.includes(flatFaces.yes)) {
      return true;
    }
    if (words.includes(flatFaces.no)) {
      return false;
    }
    return null;
  }
  return propertyValue(word, description);
}

const MATCHES_SOURCE = [
  'const matches = (value, predicate) => {',
  '  if (predicate.op === "and") { return predicate.of.every((part) => matches(value, part)); }',
  '  if (predicate.op === "eq") { return Number(value) === predicate.value; }',
  '  if (predicate.op === "gt") { return Number(value) > predicate.value; }',
  '  if (predicate.op === "lt") { return Number(value) < predicate.value; }',
  '  if (predicate.op === "ge") { return Number(value) >= predicate.value; }',
  '  if (predicate.op === "le") { return Number(value) <= predicate.value; }',
  '  if (predicate.op === "even") { return Number(value) % 2 === 0; }',
  '  if (predicate.op === "odd") { return Math.abs(Number(value) % 2) === 1; }',
  '  if (predicate.op === "lacks") { return !String(value).includes(predicate.word); }',
  '  throw new Error("unsupported predicate " + predicate.op);',
  '};'
].join('\n');

const KEEP_SOURCE = 'const keep = (candidates, predicate) => candidates.filter((value) => matches(value, predicate));';

const JOINLIST_SOURCE = [
  'const joinList = (items) => {',
  '  const parts = items.map(String);',
  '  if (parts.length === 1) { return parts[0]; }',
  '  if (parts.length === 2) { return parts[0] + " and " + parts[1]; }',
  '  return parts.slice(0, -1).join(", ") + ", and " + parts[parts.length - 1];',
  '};'
].join('\n');

function propertyCase(template, type) {
  return {
    template,
    type,
    category: 'no-knowledge',
    parse(statement) {
      const candidates = numbersAfter(statement, 'The secret number is ');
      const found = statement.match(/(?:the number is|it is) (\w+)\?/);
      if (found === null) {
        throw new Error('cannot read the tested property');
      }
      return { candidates, property: found[1], predicate: predicateFromText(found[1]) };
    },
    solve(slots) {
      const certain = slots.candidates.every((value) => matches(value, slots.predicate));
      const possible = slots.candidates.some((value) => matches(value, slots.predicate));
      return { certain, possible, property: slots.property };
    },
    render(solution) {
      if (solution.certain) {
        return `Yes, it is certainly ${solution.property}.`;
      }
      if (solution.possible) {
        return `It is not certainly ${solution.property}, but it may be ${solution.property}.`;
      }
      return `It is certainly not ${solution.property}.`;
    },
    wires: [
      {
        name: 'verdict',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          MATCHES_SOURCE,
          'const certain = slots.candidates.every((value) => matches(value, slots.predicate));',
          'const possible = slots.candidates.some((value) => matches(value, slots.predicate));',
          'return { certain, possible };'
        ].join('\n')
      }
    ],
    compute: [
      'if ($verdict.certain) { return "Yes, it is certainly " + $slots.property + "."; }',
      'if ($verdict.possible) { return "It is not certainly " + $slots.property + ", but it may be " + $slots.property + "."; }',
      'return "It is certainly not " + $slots.property + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The candidates are ${joinList(slots.candidates)}, and the property "${slots.property}" is tested on each of them.`,
        solution.certain
          ? 'Every candidate has the property, so it is certain even though the exact number is unknown.'
          : 'The property holds for some candidates but not for all, so it is possible without being certain.'
      ];
    }
  };
}

export const cases = [
  {
    template: 'The second test becomes decisive',
    type: 'the-second-test-becomes-decisive',
    category: 'no-knowledge',
    parse(statement) {
      const found = statement.match(/one of ([A-Z](?:, [A-Z])*)/);
      const first = statement.match(/After ([A-Z]) has been eliminated/);
      const second = statement.match(/does not open ([A-Z]) either/);
      if (found === null || first === null || second === null) {
        throw new Error('cannot read the boxes or the failed tests');
      }
      return { boxes: found[1].split(', '), failed: [first[1], second[1]] };
    },
    solve(slots) {
      return { remaining: slots.boxes.filter((box) => !slots.failed.includes(box)) };
    },
    render(solution) {
      if (solution.remaining.length === 1) {
        return `The key opens box ${solution.remaining[0]}.`;
      }
      return `It could be ${joinOr(solution.remaining)}.`;
    },
    wires: [
      {
        name: 'remaining',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          'return slots.boxes.filter((box) => slots.failed.indexOf(box) === -1);'
        ].join('\n')
      }
    ],
    compute: [
      'if ($remaining.length === 1) { return "The key opens box " + $remaining[0] + "."; }',
      'return "It could be " + $remaining.join(" or ") + ".";'
    ].join('\n'),
    explain(slots) {
      return [
        'Each failed test removes one box, and the key is known to open exactly one of the listed boxes.',
        'After eliminating the first two boxes only one remains, so that box must be the one the key opens.'
      ];
    }
  },
  {
    template: 'The smallest amount of information that solves the puzzle',
    type: 'the-smallest-amount-of-information-that-solves-the-puzzle',
    category: 'no-knowledge',
    parse(statement) {
      const candidates = numbersAfter(statement, 'The secret number is ');
      const target = statement.match(/identifies the number (\d+)/);
      if (target === null) {
        throw new Error('cannot read the target number');
      }
      const clues = [...statement.matchAll(/([A-Z]) [“"]([^“”]+)[”"]/g)]
        .map((match) => ({ label: match[1], predicate: predicateFromText(match[2]) }));
      if (clues.length === 0) {
        throw new Error('cannot read the labelled clues');
      }
      return { candidates, target: Number(target[1]), clues };
    },
    solve(slots) {
      const winners = slots.clues.filter((clue) => {
        const remaining = keep(slots.candidates, clue.predicate);
        return remaining.length === 1 && remaining[0] === slots.target;
      });
      return { winners };
    },
    render(solution) {
      return `${solution.winners.map((clue) => clue.label).join(', ')}.`;
    },
    wires: [
      {
        name: 'winners',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          MATCHES_SOURCE,
          KEEP_SOURCE,
          'const winners = slots.clues.filter((clue) => {',
          '  const remaining = keep(slots.candidates, clue.predicate);',
          '  return remaining.length === 1 && remaining[0] === slots.target;',
          '});',
          'return winners;'
        ].join('\n')
      }
    ],
    compute: [
      'return $winners.map((clue) => clue.label).join(", ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A clue identifies the number by itself only when the only candidate it keeps is the wanted number.',
        `Testing the clues on ${joinList(slots.candidates)} shows that the smallest clue that pins down ${slots.target} is ${solution.winners[0].label}.`
      ];
    }
  },
  {
    template: 'When two clues say the same thing',
    type: 'when-two-clues-say-the-same-thing',
    category: 'no-knowledge',
    parse(statement) {
      const candidates = numbersAfter(statement, 'the list ');
      const clues = [...statement.matchAll(/clue ([A-Z]) [“"]([^“”]+)[”"]/g)]
        .map((match) => ({ label: match[1], predicate: predicateFromText(match[2]) }));
      if (clues.length !== 2) {
        throw new Error('expected two labelled clues');
      }
      return { candidates, clues };
    },
    solve(slots) {
      const sets = slots.clues.map((clue) => keep(slots.candidates, clue.predicate));
      const same = sets[0].length === sets[1].length && sets[0].every((value, index) => value === sets[1][index]);
      return { same, first: sets[0], second: sets[1] };
    },
    render(solution) {
      if (solution.same) {
        return `Yes; both keep {${solution.first.join(',')}}.`;
      }
      return `No; {${solution.first.join(',')}} and {${solution.second.join(',')}}.`;
    },
    wires: [
      {
        name: 'sets',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          MATCHES_SOURCE,
          KEEP_SOURCE,
          'return slots.clues.map((clue) => keep(slots.candidates, clue.predicate));'
        ].join('\n')
      }
    ],
    compute: [
      'const same = $sets[0].length === $sets[1].length && $sets[0].every((value, index) => value === $sets[1][index]);',
      'if (same) { return "Yes; both keep {" + $sets[0].join(",") + "}."; }',
      'return "No; {" + $sets[0].join(",") + "} and {" + $sets[1].join(",") + "}.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The two clues are compared by the candidates they keep, not by their wording.',
        'Saying that the number is at least four and saying it is not less than four keep the same candidates on this list, so the clues say the same thing.'
      ];
    }
  },
  propertyCase('A certain answer without knowing the exact object', 'a-certain-answer-without-knowing-the-exact-object'),
  propertyCase('A property that is possible but not certain', 'a-property-that-is-possible-but-not-certain'),
  {
    template: 'Minimum number of questions for four possibilities',
    type: 'minimum-number-of-questions-for-four-possibilities',
    category: 'no-knowledge',
    parse(statement) {
      const found = statement.match(/boxes ([A-Z](?:,[A-Z])*)/);
      if (found === null) {
        throw new Error('cannot read the boxes');
      }
      return { boxes: found[1].split(',') };
    },
    solve(slots) {
      return { count: slots.boxes.length, needed: Math.ceil(Math.log(slots.boxes.length) / Math.log(2)) };
    },
    render(solution) {
      return `At least ${solution.needed} questions are necessary; ${solution.needed} can be sufficient.`;
    },
    wires: [
      {
        name: 'needed',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          'return Math.ceil(Math.log(slots.boxes.length) / Math.log(2));'
        ].join('\n')
      }
    ],
    compute: [
      'return "At least " + $needed + " questions are necessary; " + $needed + " can be sufficient.";'
    ].join('\n'),
    explain(slots) {
      return [
        `Each yes/no question has two answers, so one question can separate at most two of the ${slots.boxes.length} boxes.`,
        'Two questions have four possible answer sequences, one for each box, so two well-chosen questions are enough and one is never enough.'
      ];
    }
  },
  {
    template: 'Detecting a conclusion that is too strong',
    type: 'detecting-a-conclusion-that-is-too-strong',
    category: 'no-knowledge',
    parse(statement) {
      const found = statement.match(/either a ([^.]+?) or a ([^.]+?)\./);
      const claim = statement.match(/it is a (\w+)/);
      if (found === null || claim === null) {
        throw new Error('cannot read the possibilities or the claim');
      }
      return { descriptions: [found[1], found[2]], claim: claim[1], categories: ATTRIBUTE_CATEGORIES };
    },
    solve(slots) {
      const tokenSets = slots.descriptions.map((description) => new Set(description.toLowerCase().split(/\s+/)));
      const all = slots.descriptions[0].toLowerCase().split(/\s+/);
      return {
        shared: all.filter((token) => tokenSets.every((set) => set.has(token))),
        differing: all.filter((token) => !tokenSets.every((set) => set.has(token)))
      };
    },
    render(solution) {
      const category = ATTRIBUTE_CATEGORIES[solution.differing[0]] ?? 'attribute';
      return `We can say with certainty that it is ${joinList(solution.shared)}; the ${category} is not determined.`;
    },
    wires: [
      {
        name: 'tokens',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          'const tokenSets = slots.descriptions.map((description) => new Set(description.toLowerCase().split(/\\s+/)));',
          'const all = slots.descriptions[0].toLowerCase().split(/\\s+/);',
          'const shared = all.filter((token) => tokenSets.every((set) => set.has(token)));',
          'const differing = all.filter((token) => !tokenSets.every((set) => set.has(token)));',
          'return { shared, differing };'
        ].join('\n')
      }
    ],
    compute: [
      'const category = $slots.categories[$tokens.differing[0]] !== undefined ? $slots.categories[$tokens.differing[0]] : "attribute";',
      'return "We can say with certainty that it is " + $tokens.shared.join(" and ") + "; the " + category + " is not determined.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A property is certain when every remaining possibility has it, and it is undetermined when the possibilities differ on it.',
        `Both objects are ${joinList(solution.shared)} but they differ in ${joinList(solution.differing)}, so the colour is certain while that attribute is not determined.`
      ];
    }
  }
];
