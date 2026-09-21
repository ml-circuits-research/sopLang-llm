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

const WORDS = [
  'raspberry', 'strawberry', 'congratulations', 'mississippi', 'bookkeeper', 'assessment',
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

export const textFamilies = [countLetter, reverseWord, wordsWithLetter];
