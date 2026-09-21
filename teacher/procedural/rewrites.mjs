/**
 * One more plan shape of the procedural arithmetic source: a text
 * transformation over a stated phrase, with two named intermediate stages.
 *
 * The recorded evidence is that plan coverage, not the recipe, is the binding
 * constraint: the student compiles the shapes it was taught and does not
 * compile a family it never saw. Every other family of this source answers a
 * question about the values the statement lists; this one rewrites the stated
 * text itself. One stage publishes every word with its first letter moved to
 * the end of that word, the next appends the suffix to each of those words, and
 * the answer joins what the second stage published, so the plan carries the
 * rewriting one step at a time and the printed sentence is never recoverable by
 * copying the statement.
 *
 * The family is small and self-contained, in the style of the shipped training
 * families: the statement names its own context, quotes the phrase, and states
 * the rule it asks for, the words are plain lowercase ASCII so no diacritic or
 * punctuation rule interferes, and the answer is a deterministic function of
 * the phrase. The two stages of the plan use `map`, while the oracle is a
 * single indexed loop that rewrites each word in one step, so an agreement is
 * evidence about the plan rather than about one implementation.
 */

/** The word pool the family draws from: short lowercase ASCII words of two to seven letters. */
const WORDS = [
  'ox', 'ivy', 'oak', 'elm', 'emu', 'ash', 'ant', 'eel',
  'kiwi', 'fern', 'iris', 'opal', 'vase', 'plum', 'dune', 'mint',
  'trout', 'birch', 'maple', 'orbit', 'melon', 'ocean', 'cedar', 'lilac', 'tulip', 'amber', 'otter',
  'banana', 'tomato', 'salmon', 'cactus', 'meadow', 'walnut', 'pencil', 'guitar', 'bamboo'
];

/** The places a statement may name: every one of them shows a phrase. */
const CONTEXTS = [
  'A notice on the door',
  'A chalkboard at the front of the room',
  'A label on the crate',
  'A sign beside the gate',
  'A card on the table'
];

/** The latent plan: move the first letter of each word, then append `ay` to each of those words. */
const pigLatinPhrase = {
  id: 'pig-latin-phrase',
  name: 'Pig Latin Phrase',
  type: 'pig-latin-phrase',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 0.95 },
  sample(random) {
    // The statement must read as a phrase of two to four distinct words whose
    // neighbouring words never start alike, so the sampler redraws until the
    // drawn words satisfy that, and no sampling flag leaks into the compiled
    // slots.
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const count = 2 + Math.floor(random() * 3);
      const words = [];
      const pool = [...WORDS];
      while (words.length < count && pool.length > 0) {
        const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
        words.push(pool[index]);
        pool.splice(index, 1);
      }
      const neighbouring = words.some((word, index) => index > 0 && word[0] === words[index - 1][0]);
      if (neighbouring) {
        continue;
      }
      return { context: CONTEXTS[Math.floor(random() * CONTEXTS.length)], words };
    }
    throw new Error('the sampler could not draw a phrase whose neighbouring words start differently');
  },
  statement(slots) {
    return `${slots.context} shows the phrase "${slots.words.join(' ')}". ` +
      'Move the first letter of each word to the end of that word and add "ay". ' +
      'What is the rewritten phrase?';
  },
  parse(statement) {
    const head = new RegExp(`^(${CONTEXTS.join('|')}) shows the phrase "([a-z]+(?: [a-z]+)*)"\\.`).exec(statement);
    const rule = /Move the first letter of each word to the end of that word and add "ay"\./.exec(statement);
    if (head === null || rule === null) {
      throw new Error('the statement does not state the phrase and the rule that rewrites it');
    }
    return { context: head[1], words: head[2].split(' ') };
  },
  /** Independent oracle: one indexed pass that builds each rewritten word in a single step. */
  solve(slots) {
    const rewritten = [];
    for (let index = 0; index < slots.words.length; index += 1) {
      const word = slots.words[index];
      rewritten.push(word.slice(1) + word[0] + 'ay');
    }
    return { rewritten };
  },
  render(solution) {
    return `${solution.rewritten.join(' ')}.`;
  },
  wires: [
    {
      name: 'moved',
      command: 'jsEval',
      body: [
        'const slots = $slots;',
        'probe(Array.isArray(slots.words) && slots.words.length >= 2 && slots.words.length <= 4, "the statement must give a phrase of two to four words");',
        'probe(slots.words.every((word) => typeof word === "string" && word.length >= 2 && word.length <= 7 && [...word].every((character) => character >= "a" && character <= "z")), "every stated word must be a lowercase word of two to seven letters");',
        'probe(slots.words.every((word, index) => slots.words.indexOf(word) === index), "no stated word may repeat in the phrase");',
        'const moved = slots.words.map((word) => word.slice(1) + word[0]);',
        'probe(moved.length === slots.words.length, "the moved stage must publish one word per stated word");',
        'probe(moved.every((word, index) => word.length === slots.words[index].length), "every moved word must keep the length of its stated word");',
        'return moved;'
      ].join('\n')
    },
    {
      name: 'suffixed',
      command: 'jsEval',
      body: [
        'const moved = $moved;',
        'probe(Array.isArray(moved) && moved.length >= 2, "the moved stage must publish the words of the phrase");',
        'probe(moved.every((word) => typeof word === "string" && word.length >= 2), "every moved word must be a word of at least two letters");',
        'const suffixed = moved.map((word) => word + "ay");',
        'probe(suffixed.length === moved.length, "the suffixed stage must keep every moved word");',
        'probe(suffixed.every((word) => word.endsWith("ay")), "every suffixed word must end with ay");',
        'probe(suffixed.every((word, index) => word.slice(0, moved[index].length) === moved[index]), "every suffixed word must begin with its moved word");',
        'return suffixed;'
      ].join('\n')
    }
  ],
  compute: [
    'const slots = $slots;',
    'probe(Array.isArray(slots.words) && slots.words.length >= 2 && slots.words.length <= 4, "the statement must give a phrase of two to four words");',
    'probe(Array.isArray($moved) && $moved.length === slots.words.length, "the moved stage must publish one word per stated word");',
    'probe($moved.every((word, index) => typeof word === "string" && word.length === slots.words[index].length), "every moved word must keep the length of its stated word");',
    'probe($moved.every((word, index) => word.slice(0, -1) === slots.words[index].slice(1)), "every moved word must keep the rest of its stated word before the moved letter");',
    'probe(Array.isArray($suffixed) && $suffixed.length === $moved.length, "the suffixed stage must publish every moved word");',
    'probe($suffixed.every((word) => typeof word === "string" && word.endsWith("ay")), "every suffixed word must end with ay");',
    'probe($suffixed.every((word, index) => word === $moved[index] + "ay"), "every suffixed word must be its moved word with ay appended");',
    'return $suffixed.join(" ") + ".";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The statement shows the phrase "${slots.words.join(' ')}" and states the rule: move the first letter of each word to the end of that word and add "ay".`,
      'The moved stage publishes every word with its first letter at the end, and the suffixed stage appends "ay" to each of those words.',
      `The answer joins the words the second stage published with single spaces and closes them with a period: ${solution.rewritten.join(' ')}.`
    ];
  }
};

export const rewriteFamilies = [pigLatinPhrase];
