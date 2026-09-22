/**
 * Text families of the procedural arithmetic source.
 *
 * These families cover the task type small models are known to fail: counting a
 * letter in a word ("how many r in raspberry"), reversing a word, and counting
 * the words of a sentence that contain a letter. A language model answers those
 * from pattern memory and gets them wrong; the compiled-plan pipeline answers
 * them by delegating the count to `jsEval`, which is exactly the thesis this
 * dataset is meant to teach.
 *
 * The probe measurement that motivated them (2026-09-21): the untuned base
 * passed 5 of 49 text-reasoning probes and the fine-tuned checkpoint 1 of 49,
 * while both compiled arithmetic plans well. The teaching examples therefore
 * have to exist, not just the probe set.
 */

/**
 * Words that name a letter they contain at least twice, so the asked-for count is
 * both non-obvious and different from the number a reader tends to recall.
 *
 * The vocabulary is deliberately larger than the words the training rows use. The
 * famous pair — "raspberry" and "strawberry", whose letter counts are the ones a
 * reader recalls wrongly — belongs to `DEMO_WORDS` and is used only by the
 * evaluation side, never by the training rows: a checkpoint that memorized those
 * two words would score well on a demo without having learned to count, and the
 * whole point of this shape is that the count must come from the characters. The
 * training rows draw their words from `TRAINING_WORDS`, and the split keeps the
 * two sets apart, which the dataset report states.
 *
 * Every value is the letter the word names, and every count is at least three, so
 * no instance is answered correctly by the "there are two of them" reflex.
 */
const SELF_REFERENTIAL_LETTERS = Object.freeze({
  // Training vocabulary: ordinary words that name a letter they repeat, drawn
  // generously enough that every family of this shape can produce a full set of
  // distinct instances without repeating a word.
  assessment: 's',
  mississippi: 's',
  committee: 't',
  bookkeeper: 'k',
  congratulations: 't',
  parallel: 'a',
  refrigerator: 'r',
  caterpillar: 'a',
  occurrence: 'c',
  successful: 's',
  appointment: 'p',
  embarrassment: 'r',
  questionnaire: 'n',
  entrepreneurial: 'r',
  uncharacteristically: 't',
  counterrevolutionary: 'r',
  accessibility: 's',
  accountability: 'a',
  accommodating: 'o',
  acknowledgement: 'e',
  advantageous: 'a',
  aesthetically: 'e',
  anniversary: 'n',
  approximately: 'p',
  assassination: 's',
  beneficiary: 'i',
  bureaucracy: 'c',
  characteristic: 'c',
  circumlocution: 'c',
  collaboration: 'l',
  commemorative: 'm',
  commissioner: 'm',
  communication: 'm',
  competitiveness: 't',
  comprehensible: 'e',
  conscientious: 'c',
  consequently: 'e',
  constitutionally: 't',
  contradictory: 't',
  conventional: 'n',
  correspondence: 'r',
  crystallography: 'l',
  deliberately: 'e',
  differentiate: 'e',
  disappointment: 'p',
  discrimination: 'i',
  enthusiastically: 's',
  environmental: 'n',
  essentially: 's',
  exaggeration: 'g',
  exceptionally: 'e',
  experimentation: 'e',
  extraordinarily: 'r',
  fundamental: 'n',
  geographical: 'g',
  governmental: 'n',
  hierarchical: 'h',
  homogeneous: 'e',
  identification: 'i',
  implementation: 'm',
  incomprehensible: 'e',
  indispensable: 'n',
  industrialization: 'i',
  infrastructure: 'r',
  intelligibility: 'i',
  interpretation: 'r',
  interrogation: 'r',
  investigating: 'i',
  jurisdiction: 'i',
  knowledgeable: 'e',
  manoeuvrability: 'a',
  misinterpretation: 'i',
  multiplication: 'i',
  nationalism: 'n',
  nevertheless: 'e',
  notwithstanding: 'n',
  organizational: 'n',
  parallelization: 'l',
  particularly: 'r',
  perpendicular: 'p',
  perseverance: 'r',
  phenomenology: 'o',
  philosophy: 'p',
  predominantly: 'n',
  presupposition: 's',
  professionalism: 's',
  pronunciation: 'n',
  qualitatively: 'l',
  quantitatively: 't',
  recommendation: 'm',
  reconciliation: 'i',
  reconfigure: 'r',
  reimbursement: 'r',
  representation: 'r',
  responsibility: 'i',
  significantly: 'i',
  simultaneously: 's',
  sophisticated: 's',
  specification: 'i',
  statistically: 't',
  straightforward: 'r',
  substantially: 't',
  superintendent: 'n',
  supplementary: 'p',
  sustainability: 'i',
  telecommunication: 'c',
  temperature: 'e',
  transformation: 'r',
  transparency: 'r',
  undoubtedly: 't',
  unfortunately: 't',
  unnecessarily: 'e',
  verification: 'i',
  vulnerability: 'i',
  // Demo vocabulary: reserved for evaluation, never trained on.
  raspberry: 'r',
  strawberry: 'r'
});

const SELF_REFERENTIAL_WORDS = Object.freeze(Object.keys(SELF_REFERENTIAL_LETTERS));

/** The demo pair: evaluation-only, so a memorized word cannot pass as a count. */
const DEMO_WORDS = Object.freeze(['raspberry', 'strawberry']);

/** The words the training rows may use: everything except the demo pair. */
const TRAINING_WORDS = Object.freeze(SELF_REFERENTIAL_WORDS.filter((word) => !DEMO_WORDS.includes(word)));

const WORDS = [
  'congratulations', 'mississippi', 'bookkeeper', 'assessment',
  'committee', 'necessary', 'receive', 'parallel', 'banana', 'refrigerator', 'deterministic',
  'compiler', 'alphabet', 'rhythm', 'sensor', 'protocol', 'cartridge', 'window',
  'argument', 'boundary', 'capacity', 'diagram', 'elevator', 'fragment', 'gradient',
  'hesitate', 'interval', 'junction', 'kerosene', 'lighthouse', 'mechanism', 'notebook',
  'obstacle', 'particle', 'quantity', 'receiver', 'schedule', 'terrace', 'umbrella',
  'variable', 'workshop', 'xylophone', 'yourself', 'zeppelin', 'caterpillar', 'furniture'
];
const LETTERS = ['r', 's', 'a', 'e', 'o', 't', 'l', 'i', 'n', 'c'];
const FRAGMENTS = [
  'The small model compiles a plan instead of guessing the answer',
  'She sells sea shells by the sea shore',
  'Every report repeats the required results',
  'The runtime executes the compiled circuit',
  'Careful reading catches the repeated letter',
  'A precise compiler delegates every deterministic step',
  'The reviewer marked the recurring error in red',
  'Seven separate samples supported the stated result',
  'Tracking characters requires patience and attention',
  'The protocol records every request and response',
  'Numbers and letters are counted, never remembered',
  'Programs repeat reliably whatever the problem asks'
];

/** The latent plan: count one letter inside one stated word. */
const countLetter = {
  id: 'count-letter-in-word',
  name: 'Count Letter in Word',
  type: 'count-letter-in-word',
  category: 'no-knowledge',
  difficulty: { subproblems: 1, dependencyDepth: 1, branching: 0, irrelevantInformation: 0, symbolicShare: 1 },
  sample(random) {
    const word = WORDS[Math.floor(random() * WORDS.length)];
    const letter = LETTERS[Math.floor(random() * LETTERS.length)];
    return { word, letter };
  },
  statement(slots) {
    return `How many times does the letter "${slots.letter}" appear in the word "${slots.word}"? Reply with only the number.`;
  },
  parse(statement) {
    const match = /How many times does the letter "([a-z])" appear in the word "([a-z]+)"\?/.exec(statement);
    if (match === null) {
      throw new Error('the statement does not state the letter and the word');
    }
    return { word: match[2], letter: match[1] };
  },
  /** Independent oracle: split on the letter and count the pieces. */
  solve(slots) {
    return { occurrences: slots.word.split(slots.letter).length - 1 };
  },
  render(solution) {
    return `${solution.occurrences} times.`;
  },
  compute: [
    'const slots = $slots;',
    'probe(typeof slots.word === "string" && slots.word.length > 0, "the word must be a non-empty string");',
    'probe(typeof slots.letter === "string" && slots.letter.length === 1, "the letter must be a single character");',
    'const characters = [...slots.word.toLowerCase()];',
    'const wanted = slots.letter.toLowerCase();',
    'let occurrences = 0;',
    'for (const character of characters) {',
    '  if (character === wanted) {',
    '    occurrences += 1;',
    '  }',
    '}',
    'probe(occurrences >= 0 && occurrences <= characters.length, "the count must lie between zero and the word length");',
    'return occurrences + " times.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The word is "${slots.word}" and the letter is "${slots.letter}".`,
      'The count is a property of the characters, not of the meaning of the word, so it is delegated to deterministic work.',
      `Counting the characters gives ${solution.occurrences}.`
    ];
  }
};

/**
 * The latent plan: count the letter that names the word itself ("how many r in
 * raspberry", "how many s in assessment").
 *
 * This is the self-referential case the module header names as the task small
 * models are known to fail, and it is the one no sampler can reach by chance:
 * `count-letter-in-word` draws the word and the letter independently, so the
 * probability that a draw asks for a letter the word already contains several
 * times is low, and the probability that the statement's word and letter are
 * *the same letter* is lower still. A model that answers from pattern memory
 * produces the memorized count for the famous word ("two r in raspberry", which
 * is wrong: the word holds three) while a model that delegates the count to
 * `jsEval` gets it right. Making the family dedicated also fixes the letter, so
 * the trap is stated by construction rather than hoped for.
 *
 * The pair of public examples is deliberate: "raspberry" and "strawberry" are
 * the two words whose letter counts are most often recalled wrongly, so an
 * accuracy number on this family is directly readable as "does the model count,
 * or does it remember".
 */
const countSelfLetter = {
  id: 'count-self-referential-letter',
  name: 'Count Self Referential Letter',
  type: 'count-self-referential-letter',
  category: 'no-knowledge',
  difficulty: { subproblems: 1, dependencyDepth: 1, branching: 0, irrelevantInformation: 0, symbolicShare: 1 },
  sample(random) {
    const word = TRAINING_WORDS[Math.floor(random() * TRAINING_WORDS.length)];
    // The letter is the one the word names, which is deliberately NOT the letter
    // the word starts with ("caterpillar" names "a"), so a model cannot answer by
    // reading the first character.
    const letter = SELF_REFERENTIAL_LETTERS[word];
    return { word, letter };
  },
  statement(slots) {
    return `How many times does the letter "${slots.letter}" appear in the word "${slots.word}"? Reply with only the number.`;
  },
  parse(statement) {
    const match = /How many times does the letter "([a-z])" appear in the word "([a-z]+)"\?/.exec(statement);
    if (match === null) {
      throw new Error('the statement does not state the letter and the word');
    }
    if (SELF_REFERENTIAL_LETTERS[match[2]] !== match[1]) {
      throw new Error(`the statement was parsed by the wrong family: "${match[2]}" does not name the letter "${match[1]}"`);
    }
    return { word: match[2], letter: match[1] };
  },
  /** Independent oracle: the same count by a different route, a regular-expression scan. */
  solve(slots) {
    const matches = slots.word.match(new RegExp(slots.letter, 'g'));
    return { occurrences: matches === null ? 0 : matches.length };
  },
  render(solution) {
    return `${solution.occurrences} times.`;
  },
  compute: [
    'const slots = $slots;',
    'probe(typeof slots.word === "string" && slots.word.length > 0, "the word must be a non-empty string");',
    'probe(typeof slots.letter === "string" && slots.letter.length === 1, "the letter must be a single character");',
    'probe(slots.word.includes(slots.letter), "the word must contain the letter it asks about");',
    'const characters = [...slots.word];',
    'let occurrences = 0;',
    'for (const character of characters) {',
    '  if (character === slots.letter) {',
    '    occurrences += 1;',
    '  }',
    '}',
    'probe(occurrences >= 1, "a self-referential word must contain the letter it names at least once");',
    'return occurrences + " times.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The word is "${slots.word}" and the letter it names is "${slots.letter}".`,
      'The count is a property of the characters, so it is delegated to deterministic work and never recalled from the word itself.',
      `Counting the characters gives ${solution.occurrences}.`
    ];
  }
};

/** The latent plan: reverse the characters of a stated word. */
const reverseWord = {
  id: 'reverse-word',
  name: 'Reverse Word',
  type: 'reverse-word',
  category: 'no-knowledge',
  difficulty: { subproblems: 1, dependencyDepth: 1, branching: 0, irrelevantInformation: 0, symbolicShare: 1 },
  sample(random) {
    return { word: WORDS[Math.floor(random() * WORDS.length)] };
  },
  statement(slots) {
    return `Write the word "${slots.word}" backwards. Reply with only the reversed word.`;
  },
  parse(statement) {
    const match = /Write the word "([a-z]+)" backwards\./.exec(statement);
    if (match === null) {
      throw new Error('the statement does not state the word to reverse');
    }
    return { word: match[1] };
  },
  /** Independent oracle: the characters read from the last position to the first. */
  solve(slots) {
    let reversed = '';
    for (let index = slots.word.length - 1; index >= 0; index -= 1) {
      reversed += slots.word[index];
    }
    return { reversed };
  },
  render(solution) {
    return `${solution.reversed}.`;
  },
  compute: [
    'const slots = $slots;',
    'probe(typeof slots.word === "string" && slots.word.length > 0, "the word must be a non-empty string");',
    'const reversed = [...slots.word].reverse().join("");',
    'probe(reversed.length === [...slots.word].length, "reversing must keep the number of characters");',
    'probe([...slots.word].every((character, index) => character === [...reversed][[...reversed].length - 1 - index]), "every character must move to its mirrored position");',
    'return reversed + ".";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The word is "${slots.word}", with ${slots.word.length} characters.`,
      'Reversing exchanges the first and last character, the second and the second to last, and so on.',
      `The reversed word is "${solution.reversed}".`
    ];
  }
};

/** The latent plan: count the words of a sentence that contain a letter. */
const wordsWithLetter = {
  id: 'words-containing-letter',
  name: 'Words Containing Letter',
  type: 'words-containing-letter',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 1 },
  sample(random) {
    const sentence = FRAGMENTS[Math.floor(random() * FRAGMENTS.length)];
    const letter = LETTERS[Math.floor(random() * LETTERS.length)];
    return { sentence, letter };
  },
  statement(slots) {
    return `In the sentence "${slots.sentence}", how many words contain the letter "${slots.letter}"? Reply with only the number.`;
  },
  parse(statement) {
    const match = /In the sentence "(.+)", how many words contain the letter "([a-z])"\?/.exec(statement);
    if (match === null) {
      throw new Error('the statement does not state the sentence and the letter');
    }
    return { sentence: match[1], letter: match[2] };
  },
  /** Independent oracle: filter the words, then count them. */
  solve(slots) {
    const words = slots.sentence.split(/\s+/).filter(Boolean);
    return { count: words.filter((word) => word.toLowerCase().includes(slots.letter)).length, words: words.length };
  },
  render(solution) {
    return `${solution.count} words.`;
  },
  compute: [
    'const slots = $slots;',
    'probe(typeof slots.sentence === "string" && slots.sentence.length > 0, "the sentence must be a non-empty string");',
    'probe(typeof slots.letter === "string" && slots.letter.length === 1, "the letter must be a single character");',
    'const words = slots.sentence.split(/\\s+/).filter((word) => word.length > 0);',
    'probe(words.length > 0, "the sentence must contain at least one word");',
    'const wanted = slots.letter.toLowerCase();',
    'let count = 0;',
    'for (const word of words) {',
    '  if (word.toLowerCase().split("").includes(wanted)) {',
    '    count += 1;',
    '  }',
    '}',
    'probe(count >= 0 && count <= words.length, "the count must lie between zero and the number of words");',
    'return count + " words.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The sentence has ${solution.words} words.`,
      `A word counts when it contains the letter "${slots.letter}", whatever its position inside the word.`,
      `The number of such words is ${solution.count}.`
    ];
  }
};

/**
 * The latent plan: count how many characters name the word itself, when the
 * question hands over the word's own name as the thing to inspect.
 *
 * "How many letters are in the word 'raspberry'?" is the simplest form of the
 * same failure: a language model recalls a word's length approximately, while a
 * plan that reads the characters gets it exactly. Four more shapes below cover
 * the other ways a statement can refer to its own text.
 */
const lengthOfWord = {
  id: 'length-of-word',
  name: 'Length Of Word',
  type: 'length-of-word',
  category: 'no-knowledge',
  difficulty: { subproblems: 1, dependencyDepth: 1, branching: 0, irrelevantInformation: 0, symbolicShare: 1 },
  sample(random) {
    return { word: TRAINING_WORDS[Math.floor(random() * TRAINING_WORDS.length)] };
  },
  statement(slots) {
    return `How many letters are in the word "${slots.word}"? Reply with only the number.`;
  },
  parse(statement) {
    const match = /How many letters are in the word "([a-z]+)"\?/.exec(statement);
    if (match === null || SELF_REFERENTIAL_LETTERS[match[1]] === undefined) {
      throw new Error('the statement does not state one of the words this family covers');
    }
    return { word: match[1] };
  },
  /** Independent oracle: the length of the character list, not the string's byte count. */
  solve(slots) {
    return { letters: [...slots.word].length };
  },
  render(solution) {
    return `${solution.letters} letters.`;
  },
  compute: [
    'const slots = $slots;',
    'probe(typeof slots.word === "string" && slots.word.length > 0, "the word must be a non-empty string");',
    'const characters = [...slots.word];',
    'probe(characters.every((character) => /[a-z]/.test(character)), "the word must hold lowercase letters only");',
    'return characters.length + " letters.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The word is "${slots.word}".`,
      'Its length is a property of its characters, so it is counted rather than recalled.',
      `Counting the characters gives ${solution.letters}.`
    ];
  }
};

/**
 * The latent plan: report the first and the last character of the stated word, so
 * the answer is read from the text rather than from the word's meaning.
 */
const firstAndLastLetter = {
  id: 'first-and-last-letter',
  name: 'First And Last Letter',
  type: 'first-and-last-letter',
  category: 'no-knowledge',
  // The answer is one character of the word the statement prints, so it is always a
  // substring of its own statement. That is the point of the shape: the answer must
  // be read from the text, and a memorized word cannot supply it.
  answerIsSubstringOfStatement: true,
  difficulty: { subproblems: 2, dependencyDepth: 1, branching: 0, irrelevantInformation: 0, symbolicShare: 1 },
  sample(random) {
    const word = TRAINING_WORDS[Math.floor(random() * TRAINING_WORDS.length)];
    return { word, position: random() < 0.5 ? 'first' : 'last' };
  },
  statement(slots) {
    return `What is the ${slots.position} letter of the word "${slots.word}"? Reply with only the letter.`;
  },
  parse(statement) {
    const match = /What is the (first|last) letter of the word "([a-z]+)"\?/.exec(statement);
    if (match === null || SELF_REFERENTIAL_LETTERS[match[2]] === undefined) {
      throw new Error('the statement does not state a position and one of the words this family covers');
    }
    return { word: match[2], position: match[1] };
  },
  /** Independent oracle: index the character list from its end for the last position. */
  solve(slots) {
    const characters = [...slots.word];
    return { letter: slots.position === 'first' ? characters[0] : characters[characters.length - 1] };
  },
  render(solution) {
    return `${solution.letter}`;
  },
  compute: [
    'const slots = $slots;',
    'probe(typeof slots.word === "string" && slots.word.length > 0, "the word must be a non-empty string");',
    'probe(slots.position === "first" || slots.position === "last", "the position must be first or last");',
    'const characters = [...slots.word];',
    'const letter = slots.position === "first" ? characters[0] : characters[characters.length - 1];',
    'probe(typeof letter === "string" && letter.length === 1, "the chosen position must hold exactly one letter");',
    'return letter;'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The word is "${slots.word}" and the asked position is its ${slots.position} character.`,
      'The answer is read from the characters, so the meaning of the word cannot influence it.',
      `The ${slots.position} letter is "${solution.letter}".`
    ];
  }
};

/**
 * The latent plan: count the distinct letters of the stated word, a number that is
 * neither its length nor the count of any single letter.
 */
const distinctLetters = {
  id: 'distinct-letters-in-word',
  name: 'Distinct Letters In Word',
  type: 'distinct-letters-in-word',
  category: 'no-knowledge',
  difficulty: { subproblems: 1, dependencyDepth: 1, branching: 0, irrelevantInformation: 0, symbolicShare: 1 },
  sample(random) {
    return { word: TRAINING_WORDS[Math.floor(random() * TRAINING_WORDS.length)] };
  },
  statement(slots) {
    return `How many distinct letters does the word "${slots.word}" contain? Reply with only the number.`;
  },
  parse(statement) {
    const match = /How many distinct letters does the word "([a-z]+)" contain\?/.exec(statement);
    if (match === null || SELF_REFERENTIAL_LETTERS[match[1]] === undefined) {
      throw new Error('the statement does not state one of the words this family covers');
    }
    return { word: match[1] };
  },
  /** Independent oracle: sort the character list and count the changes between neighbours. */
  solve(slots) {
    const sorted = [...slots.word].sort();
    let distinct = sorted.length === 0 ? 0 : 1;
    for (let index = 1; index < sorted.length; index += 1) {
      if (sorted[index] !== sorted[index - 1]) {
        distinct += 1;
      }
    }
    return { distinct };
  },
  render(solution) {
    return `${solution.distinct} distinct letters.`;
  },
  compute: [
    'const slots = $slots;',
    'probe(typeof slots.word === "string" && slots.word.length > 0, "the word must be a non-empty string");',
    'const seen = new Set([...slots.word]);',
    'probe(seen.size > 1, "a word of this family must repeat at least one letter");',
    'return seen.size + " distinct letters.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The word is "${slots.word}".`,
      'The distinct count is a property of the characters, so it is computed rather than recalled.',
      `The word holds ${solution.distinct} distinct letters.`
    ];
  }
};

/**
 * The latent plan: compare two stated words on a character property, so a model
 * that recognizes neither word still has to read both.
 */
const longerOfTwoWords = {
  id: 'longer-of-two-words',
  name: 'Longer Of Two Words',
  type: 'longer-of-two-words',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 1, branching: 1, irrelevantInformation: 0, symbolicShare: 1 },
  sample(random) {
    const first = TRAINING_WORDS[Math.floor(random() * TRAINING_WORDS.length)];
    let second = TRAINING_WORDS[Math.floor(random() * TRAINING_WORDS.length)];
    while (second === first || second.length === first.length) {
      second = TRAINING_WORDS[Math.floor(random() * TRAINING_WORDS.length)];
    }
    return { first, second };
  },
  statement(slots) {
    return `Which word is longer, "${slots.first}" or "${slots.second}"? Reply with only the longer word and its length.`;
  },
  parse(statement) {
    const match = /Which word is longer, "([a-z]+)" or "([a-z]+)"\?/.exec(statement);
    if (match === null || SELF_REFERENTIAL_LETTERS[match[1]] === undefined || SELF_REFERENTIAL_LETTERS[match[2]] === undefined) {
      throw new Error('the statement does not state two of the words this family covers');
    }
    return { first: match[1], second: match[2] };
  },
  /** Independent oracle: the longer word by comparing the two lengths directly. */
  solve(slots) {
    const firstLength = [...slots.first].length;
    const secondLength = [...slots.second].length;
    return firstLength > secondLength
      ? { word: slots.first, length: firstLength }
      : { word: slots.second, length: secondLength };
  },
  render(solution) {
    return `${solution.word} (${solution.length} letters).`;
  },
  compute: [
    'const slots = $slots;',
    'probe(typeof slots.first === "string" && slots.first.length > 0, "the first word must be a non-empty string");',
    'probe(typeof slots.second === "string" && slots.second.length > 0, "the second word must be a non-empty string");',
    'const firstLength = [...slots.first].length;',
    'const secondLength = [...slots.second].length;',
    'probe(firstLength !== secondLength, "the two words must differ in length");',
    'const longer = firstLength > secondLength ? slots.first : slots.second;',
    'return longer + " (" + Math.max(firstLength, secondLength) + " letters).";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The two words are "${slots.first}" and "${slots.second}".`,
      'Their lengths are counted from the characters, so recognizing either word is not enough.',
      `"${solution.word}" is longer, with ${solution.length} letters.`
    ];
  }
};

/**
 * The evaluation-only self-referential vocabulary, exported so a diagnostic or a
 * holdout can ask about the famous words without any training row using them.
 */
export const EVAL_ONLY_WORDS = Object.freeze([...DEMO_WORDS]);

export const textFamilies = [
  countLetter,
  countSelfLetter,
  lengthOfWord,
  firstAndLastLetter,
  distinctLetters,
  longerOfTwoWords,
  reverseWord,
  wordsWithLetter
];
