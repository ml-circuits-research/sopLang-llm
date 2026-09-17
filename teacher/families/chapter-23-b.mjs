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

export const chapter = 23;

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

const FILTER_SOURCE = [
  'const slots = $slots;',
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
  '};',
  'const keep = (candidates, predicate) => candidates.filter((value) => matches(value, predicate));',
  'const joinList = (items) => {',
  '  const parts = items.map(String);',
  '  if (parts.length === 1) { return parts[0]; }',
  '  if (parts.length === 2) { return parts[0] + " and " + parts[1]; }',
  '  return parts.slice(0, -1).join(", ") + ", and " + parts[parts.length - 1];',
  '};'
].join('\n');

function body(lines) {
  return [FILTER_SOURCE, ...lines].join('\n');
}

export const cases = [
  {
    template: 'A two-bit code in child-friendly language',
    type: 'a-two-bit-code-in-child-friendly-language',
    category: 'no-knowledge',
    parse(statement) {
      const convention = statement.match(/write [“"]yes[”"] as (\d) and [“"]no[”"] as (\d)/);
      const described = statement.match(/What code does a ([^.]+?) receive/);
      if (convention === null || described === null) {
        throw new Error('cannot read the code convention or the described object');
      }
      const questions = quotedSpans(statement).filter((text) => text.trim().endsWith('?'));
      return { digits: { yes: convention[1], no: convention[2] }, questions, object: described[1].trim() };
    },
    solve(slots) {
      const code = slots.questions.map((question) => {
        const word = question.replace(/is it /i, '').replace('?', '').trim().toLowerCase();
        const value = propertyValue(word, slots.object);
        if (value === null) {
          throw new Error(`the object does not state "${word}"`);
        }
        return value ? slots.digits.yes : slots.digits.no;
      }).join('');
      return { code };
    },
    render(solution) {
      return `${solution.code}.`;
    },
    compute: body([
      'const code = slots.questions.map((question) => {',
      '  const word = question.replace("is it ", "").replace("?", "").trim().toLowerCase();',
      '  const words = slots.object.toLowerCase().split(/\\s+/);',
      '  const opposites = { large: "small", small: "large" };',
      '  let value = words.includes(word) ? true : null;',
      '  if (value === null && opposites[word] !== undefined && words.includes(opposites[word])) { value = false; }',
      '  if (value === null) { throw new Error("the object does not state " + word); }',
      '  return value ? slots.digits.yes : slots.digits.no;',
      '});',
      'return code.join("") + ".";'
    ]),
    explain(slots) {
      return [
        'Each question is answered from the described object and the answer is written with the agreed digits, in the order the questions are asked.',
        'A small object is not large, and the cube is red, so the two answers become 0 and 1.'
      ];
    }
  },
  {
    template: 'Two objects with the same code',
    type: 'two-objects-with-the-same-code',
    category: 'knowledge',
    sharedPremise: 'The previous problem agrees to write "yes" as 1 and "no" as 0, asking whether an object is large and whether it is red.',
    parse(statement) {
      const objects = [...statement.matchAll(/([A-Z])=a ([a-z ]+?)(?= and |\.)/g)].map((match) => ({ name: match[1], description: match[2] }));
      const questions = quotedSpans(statement).filter((text) => text.trim().endsWith('?'));
      if (objects.length < 2 || questions.length === 0) {
        throw new Error('cannot read the objects or the questions');
      }
      return { objects, questions };
    },
    solve(slots) {
      const codeOf = (description) => slots.questions.map((question) => {
        const word = question.replace(/is it /i, '').replace('?', '').trim().toLowerCase();
        const value = propertyValue(word, description);
        if (value === null) {
          throw new Error(`the description does not state "${word}"`);
        }
        return value ? CODE_DIGITS.yes : CODE_DIGITS.no;
      }).join('');
      const codes = slots.objects.map((object) => codeOf(object.description));
      return { same: codes.every((code) => code === codes[0]), code: codes[0] };
    },
    render(solution) {
      if (solution.same) {
        return `No; both have code ${solution.code}.`;
      }
      return 'Yes; the codes differ.';
    },
    facts: '{"yes": 1, "no": 0}',
    compute: body([
      'const codeOf = (description) => slots.questions.map((question) => {',
      '  const word = question.replace("is it ", "").replace("?", "").trim().toLowerCase();',
      '  const words = description.toLowerCase().split(/\\s+/);',
      '  const opposites = { large: "small", small: "large" };',
      '  let value = words.includes(word) ? true : null;',
      '  if (value === null && opposites[word] !== undefined && words.includes(opposites[word])) { value = false; }',
      '  if (value === null) { throw new Error("the description does not state " + word); }',
      '  return value ? String($facts.yes) : String($facts.no);',
      '}).join("");',
      'const codes = slots.objects.map((object) => codeOf(object.description));',
      'const same = codes.every((code) => code === codes[0]);',
      'return same ? "No; both have code " + codes[0] + "." : "Yes; the codes differ.";'
    ]),
    explain(slots, solution) {
      return [
        'Both objects are coded with the same two questions, so the codes are compared field by field.',
        `The cube and the sphere are both small and both red, so both receive the code ${solution.code} and the questions cannot tell them apart.`
      ];
    }
  },
  {
    template: 'The additional question that is needed',
    type: 'the-additional-question-that-is-needed',
    category: 'no-knowledge',
    parse(statement) {
      const found = statement.match(/possibilities are (.+?)\./);
      const fact = statement.match(/a (\w+) has flat faces and a (\w+) does not/);
      if (found === null || fact === null) {
        throw new Error('cannot read the possibilities or the flat-face fact');
      }
      const options = quotedSpans(statement).filter((text) => text.trim().endsWith('?'));
      return {
        possibilities: found[1].split(' and '),
        options,
        flatFaces: { yes: fact[1], no: fact[2] }
      };
    },
    solve(slots) {
      const separating = slots.options.filter((option) => {
        const values = slots.possibilities.map((description) => questionValue(option, description, slots.flatFaces));
        if (values.some((value) => value === null)) {
          throw new Error(`the descriptions do not answer "${option}"`);
        }
        return values[0] !== values[1];
      });
      return { text: separating[0] };
    },
    render(solution) {
      return `“${capitalizeFirst(solution.text)}”.`;
    },
    compute: body([
      'let separating = null;',
      'for (const option of slots.options) {',
      '  const word = option.toLowerCase().replace("does it have ", "").replace("is it ", "").replace("does it ", "").replace("?", "").trim();',
      '  const values = slots.possibilities.map((description) => {',
      '    const words = description.toLowerCase().split(/\\s+/);',
      '    if (word === "flat faces" || word === "flat face") {',
      '      if (words.includes(slots.flatFaces.yes)) { return true; }',
      '      if (words.includes(slots.flatFaces.no)) { return false; }',
      '      return null;',
      '    }',
      '    const opposites = { large: "small", small: "large" };',
      '    if (words.includes(word)) { return true; }',
      '    if (opposites[word] !== undefined && words.includes(opposites[word])) { return false; }',
      '    return null;',
      '  });',
      '  if (values.some((value) => value === null)) { throw new Error("the descriptions do not answer " + option); }',
      '  if (values[0] !== values[1]) { separating = option; break; }',
      '}',
      'const first = separating.charAt(0).toUpperCase() + separating.slice(1);',
      'return "“" + first + "”.";'
    ]),
    explain(slots, solution) {
      return [
        'A question separates the two possibilities only when it has a different answer for each of them.',
        'The small and red questions receive the same answer for both objects, while the flat-face question is answered differently because a cube has flat faces and a sphere does not.'
      ];
    }
  },
  {
    template: 'An incomplete message with multiple interpretations',
    type: 'an-incomplete-message-with-multiple-interpretations',
    category: 'no-knowledge',
    parse(statement) {
      const found = statement.match(/Take (\d+) more than (\w+) has/);
      if (found === null) {
        throw new Error('cannot read the incomplete message');
      }
      return { amount: Number(found[1]), owner: found[2] };
    },
    solve(slots) {
      return { amount: slots.amount, missing: `${slots.owner}'s quantity` };
    },
    render(solution) {
      return `No; ${solution.missing} is missing.`;
    },
    compute: body([
      'return "No; " + slots.owner + "\'s quantity is missing.";'
    ]),
    explain(slots) {
      return [
        `The message computes a value relative to what ${slots.owner} has, so the result would be that quantity plus ${slots.amount}.`,
        'The quantity itself is never given, so no exact number can be calculated and the missing information is that quantity.'
      ];
    }
  },
  {
    template: 'A message with extra information',
    type: 'a-message-with-extra-information',
    category: 'no-knowledge',
    parse(statement) {
      const found = statement.match(/has (\d+) marbles and gives (\d+) to/);
      if (found === null) {
        throw new Error('cannot read the marble message');
      }
      return { start: Number(found[1]), given: Number(found[2]) };
    },
    solve(slots) {
      return { left: slots.start - slots.given, start: slots.start, given: slots.given };
    },
    render(solution) {
      return `${solution.left} marbles; only ${solution.start} and ${solution.given} are relevant.`;
    },
    compute: body([
      'const left = slots.start - slots.given;',
      'return left + " marbles; only " + slots.start + " and " + slots.given + " are relevant.";'
    ]),
    explain(slots) {
      return [
        `Only the starting number ${slots.start} and the number given away ${slots.given} enter the calculation, which is a subtraction.`,
        'The colour of the bag and the weather do not change the number of marbles, so they are ignored as extra information.'
      ];
    }
  },
  {
    template: 'The order of clues and the same solution',
    type: 'the-order-of-clues-and-the-same-solution',
    category: 'no-knowledge',
    parse(statement) {
      const candidates = numbersAfter(statement, 'The candidates are ');
      const clues = quotedSpans(statement).map(predicateFromText);
      if (clues.length !== 2) {
        throw new Error('expected two clues');
      }
      return { candidates, clues };
    },
    solve(slots) {
      const first = keep(keep(slots.candidates, slots.clues[0]), slots.clues[1]);
      const second = keep(keep(slots.candidates, slots.clues[1]), slots.clues[0]);
      const same = first.length === second.length && first.every((value, index) => value === second[index]);
      return { same, first, second };
    },
    render(solution) {
      if (solution.same) {
        return `Yes; {${solution.first.join(',')}}.`;
      }
      return `No; {${solution.first.join(',')}} and {${solution.second.join(',')}}.`;
    },
    compute: body([
      'const first = keep(keep(slots.candidates, slots.clues[0]), slots.clues[1]);',
      'const second = keep(keep(slots.candidates, slots.clues[1]), slots.clues[0]);',
      'const same = first.length === second.length && first.every((value, index) => value === second[index]);',
      'if (same) { return "Yes; {" + first.join(",") + "}."; }',
      'return "No; {" + first.join(",") + "} and {" + second.join(",") + "}.";'
    ]),
    explain(slots, solution) {
      return [
        'Each order applies the same two filters, only one after the other, so the same candidates are removed either way.',
        `Both orders leave exactly ${joinList(solution.first)}, which shows that filtering does not depend on the order of the clues.`
      ];
    }
  },
  {
    template: 'A negative clue can be stronger',
    type: 'a-negative-clue-can-be-stronger',
    category: 'no-knowledge',
    parse(statement) {
      const found = statement.match(/The candidates are ([^.]+)\./);
      if (found === null) {
        throw new Error('cannot read the candidate objects');
      }
      const candidates = found[1].split(', ').map((part) => part.trim());
      const clues = quotedSpans(statement).map((text) => ({ text, predicate: predicateFromText(text) }));
      if (clues.length !== 2) {
        throw new Error('expected two negative clues');
      }
      return { candidates, clues };
    },
    solve(slots) {
      let best = null;
      for (const clue of slots.clues) {
        const remaining = keep(slots.candidates, clue.predicate).length;
        if (best === null || remaining < best.remaining) {
          best = { text: clue.text, remaining };
        }
      }
      return { text: best.text, remaining: best.remaining };
    },
    render(solution) {
      return `“${capitalizeFirst(solution.text)}”.`;
    },
    compute: body([
      'let best = null;',
      'for (const clue of slots.clues) {',
      '  const remaining = keep(slots.candidates, clue.predicate).length;',
      '  if (best === null || remaining < best.remaining) { best = { text: clue.text, remaining }; }',
      '}',
      'const first = best.text.charAt(0).toUpperCase() + best.text.slice(1);',
      'return "“" + first + "”.";'
    ]),
    explain(slots, solution) {
      return [
        'Each negative clue is applied as a filter that drops every candidate containing the excluded property.',
        `Excluding circles leaves one object while excluding red leaves two, so ${solution.text} is the stronger clue.`
      ];
    }
  },
  {
    template: 'A conclusion that does not follow from the data',
    type: 'a-conclusion-that-does-not-follow-from-the-data',
    category: 'no-knowledge',
    parse(statement) {
      const rule = /all flowers in the flowerpot are red/.test(statement);
      const observed = /We see a red object/.test(statement);
      const otherRedObjects = /allows other red objects/.test(statement);
      if (!rule || !observed) {
        throw new Error('cannot read the premise of the problem');
      }
      return { rule, observed, otherRedObjects };
    },
    solve(slots) {
      return { follows: slots.rule && slots.observed && !slots.otherRedObjects };
    },
    render(solution) {
      return solution.follows ? 'Yes.' : 'No.';
    },
    compute: body([
      'const follows = slots.rule && slots.observed && !slots.otherRedObjects;',
      'return follows ? "Yes." : "No.";'
    ]),
    explain(slots) {
      return [
        'The rule tells us that a flower from the flowerpot is red, but it does not tell us that every red object is such a flower.',
        'Because other red objects are allowed to exist, the observation that the object is red does not force the conclusion, so the answer is no.'
      ];
    }
  },
  {
    template: 'Information from the absence of a result',
    type: 'information-from-the-absence-of-a-result',
    category: 'no-knowledge',
    parse(statement) {
      const found = statement.match(/boxes ([A-Z](?:, [A-Z])*)/);
      const tested = statement.match(/We try ([A-Z]) and the key does not open/);
      if (found === null || tested === null) {
        throw new Error('cannot read the boxes or the failed test');
      }
      return { boxes: found[1].split(', '), tested: tested[1] };
    },
    solve(slots) {
      return { tested: slots.tested, remaining: slots.boxes.filter((box) => box !== slots.tested) };
    },
    render(solution) {
      return `We know it is not ${solution.tested}; it could be ${joinOr(solution.remaining)}.`;
    },
    compute: body([
      'const remaining = slots.boxes.filter((box) => box !== slots.tested);',
      'return "We know it is not " + slots.tested + "; it could be " + remaining.join(" or ") + ".";'
    ]),
    explain(slots, solution) {
      return [
        'A failed test is information: the key does not open that box, so that box leaves the list of possibilities.',
        `After removing ${solution.tested} the remaining possibilities are ${joinOr(solution.remaining)}, which is more than one, so the exact box is not yet known.`
      ];
    }
  },
];
