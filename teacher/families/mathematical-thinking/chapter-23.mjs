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

function truthCountCase(template, type) {
  return {
    template,
    type,
    category: 'no-knowledge',
    parse(statement) {
      const candidates = numbersAfter(statement, 'The secret number is ');
      const statements = [...statement.matchAll(/([A-Z]) [“"]([^“”"]+)[”"]/g)].map((match) => predicateFromText(match[2]));
      const count = statement.match(/Exactly (one|two|three) of/);
      if (statements.length === 0 || count === null) {
        throw new Error('cannot read the labelled statements');
      }
      return { candidates, statements, exactly: COUNT_WORDS[count[1]] };
    },
    solve(slots) {
      const matching = slots.candidates.filter(
        (value) => slots.statements.filter((predicate) => matches(value, predicate)).length === slots.exactly
      );
      return { matching, candidates: slots.candidates, all: matching.length === slots.candidates.length };
    },
    render(solution) {
      if (solution.all) {
        return `It cannot be determined; ${joinList(solution.candidates)} are all compatible.`;
      }
      return `${joinList(solution.matching)}.`;
    },
    wires: [
      {
        name: 'matching',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          MATCHES_SOURCE,
          'return slots.candidates.filter((value) => slots.statements.filter((predicate) => matches(value, predicate)).length === slots.exactly);'
        ].join('\n')
      }
    ],
    compute: [
      JOINLIST_SOURCE,
      'if ($matching.length === $slots.candidates.length) {',
      '  return "It cannot be determined; " + joinList($slots.candidates) + " are all compatible.";',
      '}',
      'return $matching.length === 1 ? String($matching[0]) + "." : joinList($matching) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each candidate is checked against the ${slots.statements.length} labelled statements, and only the candidates whose number of true statements equals ${slots.exactly} survive.`,
        `Trying every candidate one at a time leaves ${joinList(solution.matching)}, so the exact statements pin down exactly this set.`
      ];
    }
  };
}

export const cases = [
  {
    template: 'The question that halves the possibilities',
    type: 'the-question-that-halves-the-possibilities',
    category: 'no-knowledge',
    parse(statement) {
      const candidates = numbersAfter(statement, 'The secret number is ');
      const questions = quotedSpans(statement)
        .filter((text) => /^is the number /i.test(text))
        .map((text) => ({ text, predicate: predicateFromText(text) }));
      if (questions.length !== 2) {
        throw new Error('expected two candidate questions');
      }
      return { candidates, questions };
    },
    solve(slots) {
      let best = null;
      for (const question of slots.questions) {
        const yes = keep(slots.candidates, question.predicate).length;
        const worst = Math.max(yes, slots.candidates.length - yes);
        if (best === null || worst < best.worst) {
          best = { text: question.text, worst };
        }
      }
      return { question: best.text };
    },
    render(solution) {
      return `“${solution.question}”.`;
    },
    wires: [
      {
        name: 'best',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          MATCHES_SOURCE,
          KEEP_SOURCE,
          'let best = null;',
          'for (const question of slots.questions) {',
          '  const yes = keep(slots.candidates, question.predicate).length;',
          '  const worst = Math.max(yes, slots.candidates.length - yes);',
          '  if (best === null || worst < best.worst) { best = { text: question.text, worst }; }',
          '}',
          'return best;'
        ].join('\n')
      }
    ],
    compute: [
      'return "“" + $best.text + "”.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'For a yes/no question the worst case is the larger of its two answer groups, because the unhelpful answer leaves that many candidates.',
        `"Is the number 1?" can leave three candidates while the threshold question splits the list in half, so ${solution.question} is the better question.`
      ];
    }
  },
  {
    template: 'Two answers that identify an object',
    type: 'two-answers-that-identify-an-object',
    category: 'knowledge',
    parse(statement) {
      const objects = [...statement.matchAll(/([A-D])=(\w+) (\w+)/g)].map((match) => ({ name: match[1], attributes: [match[2], match[3]] }));
      const questions = quotedSpans(statement).filter((text) => /^is it /i.test(text));
      const answers = [...statement.matchAll(/Q(\d+)=(yes|no)/g)].map((match) => ({ index: Number(match[1]), positive: match[2] === 'yes' }));
      if (objects.length === 0 || questions.length !== answers.length) {
        throw new Error('cannot read the objects or the given answers');
      }
      const asks = answers.map((answer) => ({
        word: questions[answer.index - 1].match(/is it (\w+)\?/i)[1].toLowerCase(),
        positive: answer.positive
      }));
      return { objects, asks };
    },
    solve(slots) {
      const target = slots.objects.find((object) => slots.asks.every((ask) => {
        const key = ROUND_FACTS[ask.word] ?? ask.word;
        return object.attributes.includes(key) === ask.positive;
      }));
      if (target === undefined) {
        throw new Error('no object matches the given answers');
      }
      return { name: target.name };
    },
    render(solution) {
      return `${solution.name}.`;
    },
    facts: '{"round": "circle"}',
    wires: [
      {
        name: 'target',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          'let target = null;',
          'for (const object of slots.objects) {',
          '  if (slots.asks.every((ask) => {',
          '    const key = $facts[ask.word] !== undefined ? $facts[ask.word] : ask.word;',
          '    return object.attributes.includes(key) === ask.positive;',
          '  })) { target = object; break; }',
          '}',
          'if (target === null) { throw new Error("no object matches the given answers"); }',
          'return target;'
        ].join('\n')
      }
    ],
    compute: [
      'return $target.name + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The two answers form a code: the first answer tells whether the object is red and the second whether it is round.',
        `Reading "round" as a circle, the pair (no, yes) means blue colour and round shape, which is object ${solution.name}.`
      ];
    }
  },
  {
    template: 'A clue that changes nothing',
    type: 'a-clue-that-changes-nothing',
    category: 'no-knowledge',
    parse(statement) {
      const candidates = numbersAfter(statement, 'The secret number is ');
      const listed = statement.match(/The clues are: ([^.]+)\./);
      if (listed === null) {
        throw new Error('cannot read the clue list');
      }
      const clues = listed[1].split('; ').map((text) => ({ text, predicate: predicateFromText(text) }));
      return { candidates, clues };
    },
    solve(slots) {
      const useless = slots.clues.filter((clue) => slots.candidates.every((value) => matches(value, clue.predicate)));
      return { texts: useless.map((clue) => clue.text) };
    },
    render(solution) {
      const parts = solution.texts.map((text, index) => `“${index === 0 ? capitalizeFirst(text) : text}”`);
      return `${parts.join(' and ')}.`;
    },
    wires: [
      {
        name: 'useless',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          MATCHES_SOURCE,
          'return slots.clues.filter((clue) => slots.candidates.every((value) => matches(value, clue.predicate)));'
        ].join('\n')
      }
    ],
    compute: [
      'const parts = $useless.map((clue, index) => "“" + (index === 0 ? clue.text.charAt(0).toUpperCase() + clue.text.slice(1) : clue.text) + "”");',
      'return parts.join(" and ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A clue is useless exactly when every candidate of the initial list satisfies it, so no candidate is removed.',
        `Testing the clues on ${joinList(slots.candidates)} shows that only ${joinList(solution.texts)} keep the whole list.`
      ];
    }
  },
  {
    template: 'A clue whose usefulness depends on another clue',
    type: 'a-clue-whose-usefulness-depends-on-another-clue',
    category: 'no-knowledge',
    parse(statement) {
      const candidates = numbersAfter(statement, 'The candidates are ');
      const clues = new Map();
      for (const match of statement.matchAll(/Clue ([A-Z]) says [“"]([^”"]+)[”"]/g)) {
        clues.set(match[1], predicateFromText(match[2]));
      }
      const order = statement.match(/After applying ([A-Z]), how many candidates does ([A-Z]) eliminate/);
      if (order === null || clues.size < 2) {
        throw new Error('cannot read the labelled clues');
      }
      return { candidates, first: clues.get(order[1]), second: clues.get(order[2]) };
    },
    solve(slots) {
      const afterFirst = keep(slots.candidates, slots.first);
      const eliminated = afterFirst.filter((value) => !matches(value, slots.second));
      return { count: eliminated.length };
    },
    render(solution) {
      return `${solution.count} candidates.`;
    },
    wires: [
      {
        name: 'eliminated',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          MATCHES_SOURCE,
          KEEP_SOURCE,
          'const afterFirst = keep(slots.candidates, slots.first);',
          'return afterFirst.filter((value) => !matches(value, slots.second));'
        ].join('\n')
      }
    ],
    compute: [
      'return $eliminated.length + " candidates.";'
    ].join('\n'),
    explain(slots) {
      return [
        'The first clue is applied before the second one, so the second clue only removes candidates that survived the first.',
        'Counting those removed candidates gives the answer without ever changing the order of the clues.'
      ];
    }
  },
  {
    template: 'When the information is not sufficient',
    type: 'when-the-information-is-not-sufficient',
    category: 'no-knowledge',
    parse(statement) {
      const candidates = numbersAfter(statement, 'chosen from ');
      const clue = statement.match(/only that ([^.]+)\./);
      if (clue === null) {
        throw new Error('cannot read the clue');
      }
      return { candidates, predicate: predicateFromText(clue[1]) };
    },
    solve(slots) {
      return { remaining: keep(slots.candidates, slots.predicate) };
    },
    render(solution) {
      if (solution.remaining.length === 1) {
        return `Yes; it is ${solution.remaining[0]}.`;
      }
      return `No; it could be ${joinOr(solution.remaining)}.`;
    },
    wires: [
      {
        name: 'remaining',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          MATCHES_SOURCE,
          KEEP_SOURCE,
          'return keep(slots.candidates, slots.predicate);'
        ].join('\n')
      }
    ],
    compute: [
      'if ($remaining.length === 1) { return "Yes; it is " + $remaining[0] + "."; }',
      'return "No; it could be " + $remaining.map(String).join(" or ") + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'The only clue is turned into a filter over the candidates, and the candidates that satisfy it are the remaining possibilities.',
        `More than one candidate survives, so ${joinList(solution.remaining)} all remain possible and the exact number is not determined.`
      ];
    }
  },
  {
    template: 'Contradictory clues',
    type: 'contradictory-clues',
    category: 'no-knowledge',
    parse(statement) {
      const candidates = numbersAfter(statement, 'The secret number is ');
      const clues = quotedSpans(statement).map(predicateFromText);
      if (clues.length !== 2) {
        throw new Error('expected two clues');
      }
      return { candidates, clues };
    },
    solve(slots) {
      return { remaining: slots.candidates.filter((value) => slots.clues.every((predicate) => matches(value, predicate))) };
    },
    render(solution) {
      if (solution.remaining.length === 0) {
        return 'No such number exists.';
      }
      return `${joinList(solution.remaining)}.`;
    },
    wires: [
      {
        name: 'remaining',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          MATCHES_SOURCE,
          'return slots.candidates.filter((value) => slots.clues.every((predicate) => matches(value, predicate)));'
        ].join('\n')
      }
    ],
    compute: [
      JOINLIST_SOURCE,
      'if ($remaining.length === 0) { return "No such number exists."; }',
      'return joinList($remaining) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'Both clues must hold at the same time, so a candidate survives only if it satisfies every filter.',
        'The two filters ask for a number that is both greater than 4 and less than 3, and the surviving set is empty.'
      ];
    }
  },
  truthCountCase('Exactly one statement is true', 'exactly-one-statement-is-true'),
  truthCountCase('Exactly two statements are true', 'exactly-two-statements-are-true'),
  {
    template: 'Information that completes a non-unique puzzle',
    type: 'information-that-completes-a-non-unique-puzzle',
    category: 'no-knowledge',
    sharedPremise: 'The previous problem left 4, 5, and 6 as the remaining possible numbers.',
    parse(statement) {
      const candidates = numbersAfter(statement, 'previous problem, ');
      const clues = [...statement.matchAll(/(I{1,3}) [“"]([^“”"]+)[”"]/g)]
        .map((match) => ({ label: match[1], text: match[2], predicate: predicateFromText(match[2]) }));
      if (clues.length === 0) {
        throw new Error('cannot read the labelled clues');
      }
      return { candidates, clues };
    },
    solve(slots) {
      const winners = slots.clues.filter((clue) => keep(slots.candidates, clue.predicate).length === 1);
      return { winners };
    },
    render(solution) {
      const first = solution.winners[0];
      return `${solution.winners.map((clue) => clue.label).join(', ')}: “${first.text}”.`;
    },
    wires: [
      {
        name: 'winners',
        command: 'jsEval',
        body: [
          'const slots = $slots;',
          MATCHES_SOURCE,
          KEEP_SOURCE,
          'return slots.clues.filter((clue) => keep(slots.candidates, clue.predicate).length === 1);'
        ].join('\n')
      }
    ],
    compute: [
      'const first = $winners[0];',
      'return $winners.map((clue) => clue.label).join(", ") + ": “" + first.text + "”.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        'A clue identifies the number only when exactly one of the remaining candidates satisfies it.',
        `Testing each clue on ${joinList(slots.candidates)} leaves a single candidate for ${solution.winners[0].label} alone, so that clue completes the puzzle.`
      ];
    }
  },
];
