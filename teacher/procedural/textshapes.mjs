/**
 * Two more plan shapes of the procedural arithmetic source: a ranking over
 * counted records and a stable ordering with its extremes.
 *
 * The recorded evidence is that plan coverage, not the recipe, is the binding
 * constraint: the student compiles the shapes it was taught and does not
 * compile a family it never saw. The families of this module add two shapes the
 * rest of the source lacks. In the first, one stage publishes a record per
 * stated word and a second stage publishes the same records ranked, so the
 * plan carries the tie rule of the statement; in the second, one stage
 * publishes a stable ordering and the next reads only its two ends, so the
 * answer consumes a first and a last value rather than the whole list twice.
 *
 * Both families are small and self-contained, in the style of the shipped
 * training families: every statement states its own premises, the words are
 * plain lowercase ASCII so no diacritic or punctuation rule interferes, and the
 * answer is a deterministic function of the words the statement lists. The
 * oracle of each family is deliberately a different algorithm from the circuit
 * stage it is compared against, so an agreement is evidence about the plan
 * rather than about one implementation.
 */

/** The word list both families draw from: short lowercase ASCII words. */
const WORDS = [
  'oak', 'elm', 'emu', 'ant', 'ivy', 'ash', 'eel',
  'kiwi', 'fern', 'iris', 'opal', 'vase', 'plum', 'dune', 'mint',
  'trout', 'birch', 'maple', 'orbit', 'melon', 'ocean', 'cedar', 'lilac', 'tulip', 'amber', 'otter',
  'banana', 'tomato', 'salmon', 'cactus', 'meadow', 'walnut', 'iguana', 'pencil', 'guitar', 'azalea', 'bamboo',
  'coconut', 'prairie', 'holiday', 'apricot', 'rainbow',
  'umbrella', 'elephant', 'hospital', 'bungalow'
];

/** The latent plan: count the vowels of each word, then rank the records. */
const vowelRichestWord = {
  id: 'vowel-richest-word',
  name: 'Vowel Richest Word',
  type: 'vowel-richest-word',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 0.95 },
  sample(random) {
    // The statement must leave exactly one word with the strict maximum vowel
    // count, so the answer names one word: the sampler redraws until the drawn
    // words satisfy that, and no sampling flag leaks into the compiled slots.
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const words = [];
      const pool = [...WORDS];
      while (words.length < 4 && pool.length > 0) {
        const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
        words.push(pool[index]);
        pool.splice(index, 1);
      }
      const counted = words.map((word) => [...word].filter((character) => 'aeiou'.includes(character)).length);
      const best = Math.max(...counted);
      if (counted.filter((value) => value === best).length !== 1) {
        continue;
      }
      return { words };
    }
    throw new Error('the sampler could not draw four words with a single richest word');
  },
  statement(slots) {
    const list = slots.words.map((word) => `"${word}"`).join(', ');
    return `A chalkboard in the hallway lists four words: ${list}. ` +
      'Vowels are a, e, i, o, u. ' +
      'Which of the four words carries the most vowels, and how many vowels does it carry?';
  },
  parse(statement) {
    const head = /^A chalkboard in the hallway lists four words: ("[a-z]+", "[a-z]+", "[a-z]+", "[a-z]+")\./.exec(statement);
    const rule = /Vowels are a, e, i, o, u\./.exec(statement);
    if (head === null || rule === null) {
      throw new Error('the statement does not state the four words and the vowels that count');
    }
    const words = head[1].split(', ').map((part) => part.slice(1, -1));
    return { words };
  },
  /** Independent oracle: one pass that keeps the best count it has seen so far. */
  solve(slots) {
    const vowels = 'aeiou';
    let best = null;
    for (const word of slots.words) {
      let count = 0;
      for (let index = 0; index < word.length; index += 1) {
        if (vowels.includes(word[index])) {
          count += 1;
        }
      }
      if (best === null || count > best.vowels) {
        best = { word, vowels: count };
      }
    }
    return best;
  },
  render(solution) {
    return `The word "${solution.word}" carries ${solution.vowels} vowels.`;
  },
  wires: [
    {
      name: 'perWord',
      command: 'jsEval',
      body: [
        'const slots = $slots;',
        'probe(Array.isArray(slots.words) && slots.words.length === 4, "the chalkboard must list exactly four words");',
        'probe(slots.words.every((word) => typeof word === "string" && word.length >= 3 && word.length <= 9 && [...word].every((character) => character >= "a" && character <= "z")), "every listed word must be a lowercase word of three to nine letters");',
        'const vowels = "aeiou";',
        'const counted = slots.words.map((word) => ({ word, vowels: [...word].filter((character) => vowels.includes(character)).length }));',
        'probe(counted.length === slots.words.length, "every listed word must be counted once");',
        'probe(counted.every((record, index) => record.word === slots.words[index] && Number.isInteger(record.vowels) && record.vowels >= 0), "the counts must keep the order the chalkboard shows");',
        'return counted;'
      ].join('\n')
    },
    {
      name: 'ranked',
      command: 'jsEval',
      body: [
        'const counted = $perWord;',
        'probe(Array.isArray(counted) && counted.length === 4, "the counting stage must publish the four records");',
        'probe(counted.every((record) => typeof record.word === "string" && Number.isInteger(record.vowels) && record.vowels >= 0), "every record must carry a word and a whole vowel count");',
        'const ranked = counted.map((record, index) => ({ record, index }))',
        '  .sort((left, right) => (right.record.vowels - left.record.vowels) || (left.index - right.index))',
        '  .map((entry) => entry.record);',
        'probe(ranked.length === counted.length, "the ranking must keep every record");',
        'probe(ranked.every((record, index) => index === 0 || ranked[index - 1].vowels >= record.vowels), "the ranking must fall from the richest word");',
        'probe(ranked.every((record, index) => index === 0 || ranked[index - 1].vowels > record.vowels || counted.findIndex((candidate) => candidate.word === ranked[index - 1].word) < counted.findIndex((candidate) => candidate.word === ranked[index].word)), "words with equal counts must keep the order the chalkboard shows");',
        'return ranked;'
      ].join('\n')
    }
  ],
  compute: [
    'const slots = $slots;',
    'probe(Array.isArray($ranked) && $ranked.length === slots.words.length, "the ranking stage must publish every listed word");',
    'probe($ranked.every((record) => slots.words.includes(record.word)), "every ranked word must be a word the chalkboard shows");',
    'probe($ranked.every((record) => Number.isInteger(record.vowels) && record.vowels >= 0), "every ranked record must carry a whole vowel count");',
    'const best = $ranked[0];',
    'probe(best.vowels === Math.max(...$ranked.map((record) => record.vowels)), "the first ranked word must carry the most vowels");',
    'probe($ranked.filter((record) => record.vowels === best.vowels).length === 1, "exactly one word may carry the most vowels");',
    'return "The word " + JSON.stringify(best.word) + " carries " + best.vowels + " vowels.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The chalkboard lists four words: ${slots.words.join(', ')}.`,
      `The perWord stage counts the vowels of every word, and the ranked stage orders those records by their count: ${solution.word} comes first.`,
      `The answer prints the richest word, ${solution.word}, with its ${solution.vowels} vowels.`
    ];
  }
};

/** The latent plan: a stable ordering by length, then only its two ends. */
const lengthRankedWords = {
  id: 'length-ranked-words',
  name: 'Length Ranked Words',
  type: 'length-ranked-words',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 0.95 },
  sample(random) {
    // The statement must make the ordering interesting, so the sampler redraws
    // until the five drawn words carry at least three different lengths.
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const words = [];
      const pool = [...WORDS];
      while (words.length < 5 && pool.length > 0) {
        const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
        words.push(pool[index]);
        pool.splice(index, 1);
      }
      if (new Set(words.map((word) => word.length)).size < 3) {
        continue;
      }
      return { words };
    }
    throw new Error('the sampler could not draw five words with three different lengths');
  },
  statement(slots) {
    const list = slots.words.map((word) => `"${word}"`).join(', ');
    return `A label on the crate lists five words in this order: ${list}. ` +
      'Put them in order from the fewest letters to the most. ' +
      'If two words have the same number of letters, keep the order shown here. ' +
      'How many letters does the longest word have?';
  },
  parse(statement) {
    const head = /^A label on the crate lists five words in this order: ("[a-z]+", "[a-z]+", "[a-z]+", "[a-z]+", "[a-z]+")\./.exec(statement);
    const rule = /If two words have the same number of letters, keep the order shown here\./.exec(statement);
    if (head === null || rule === null) {
      throw new Error('the statement does not state the five words and the rule for equal lengths');
    }
    const words = head[1].split(', ').map((part) => part.slice(1, -1));
    return { words };
  },
  /** Independent oracle: an insertion sort that keeps equal lengths in place. */
  solve(slots) {
    const ordered = [];
    for (const word of slots.words) {
      let position = ordered.length;
      while (position > 0 && ordered[position - 1].length > word.length) {
        position -= 1;
      }
      ordered.splice(position, 0, word);
    }
    return { ordered, shortest: ordered[0].length, longest: ordered[ordered.length - 1].length };
  },
  render(solution) {
    return `From shortest to longest: ${solution.ordered.join(', ')}; the longest word has ${solution.longest} letters.`;
  },
  wires: [
    {
      name: 'ordered',
      command: 'jsEval',
      body: [
        'const slots = $slots;',
        'probe(Array.isArray(slots.words) && slots.words.length === 5, "the label must list exactly five words");',
        'probe(slots.words.every((word) => typeof word === "string" && word.length >= 2 && word.length <= 8 && [...word].every((character) => character >= "a" && character <= "z")), "every listed word must be a lowercase word of two to eight letters");',
        'const decorated = slots.words.map((word, index) => ({ word, length: word.length, index }));',
        'for (let position = 0; position < decorated.length; position += 1) {',
        '  let first = position;',
        '  for (let scan = position + 1; scan < decorated.length; scan += 1) {',
        '    const earlier = decorated[first];',
        '    const candidate = decorated[scan];',
        '    if (candidate.length < earlier.length || (candidate.length === earlier.length && candidate.index < earlier.index)) {',
        '      first = scan;',
        '    }',
        '  }',
        '  const held = decorated[position];',
        '  decorated[position] = decorated[first];',
        '  decorated[first] = held;',
        '}',
        'const ordered = decorated.map((entry) => entry.word);',
        'probe(ordered.length === slots.words.length, "the ordering must keep every listed word");',
        'probe(ordered.every((word) => slots.words.includes(word)), "every ordered word must be a word the label shows");',
        'probe(ordered.every((word, index) => index === 0 || ordered[index - 1].length <= word.length), "no word may come before a shorter one");',
        'probe(ordered.every((word, index) => index === 0 || ordered[index - 1].length < word.length || slots.words.indexOf(ordered[index - 1]) < slots.words.indexOf(word)), "words of equal length must keep the order the label shows");',
        'return ordered;'
      ].join('\n')
    },
    {
      name: 'extremes',
      command: 'jsEval',
      body: [
        'const ordered = $ordered;',
        'probe(Array.isArray(ordered) && ordered.length === 5, "the ordering stage must publish the five words");',
        'probe(ordered.every((word) => typeof word === "string" && word.length > 0), "every ordered entry must be a word of at least one letter");',
        'const extremes = { shortest: ordered[0].length, longest: ordered[ordered.length - 1].length };',
        'probe(Number.isInteger(extremes.shortest) && Number.isInteger(extremes.longest), "both extremes must be whole numbers of letters");',
        'probe(extremes.shortest <= extremes.longest, "the first ordered word cannot be longer than the last");',
        'probe(ordered.every((word) => word.length >= extremes.shortest && word.length <= extremes.longest), "every word must lie between the two extremes");',
        'return extremes;'
      ].join('\n')
    }
  ],
  compute: [
    'const slots = $slots;',
    'probe(Array.isArray($ordered) && $ordered.length === slots.words.length, "the ordering stage must publish every listed word");',
    'probe($ordered.every((word) => slots.words.includes(word)), "every ordered word must be a word the label shows");',
    'probe(typeof $extremes === "object" && $extremes !== null && Number.isInteger($extremes.shortest) && Number.isInteger($extremes.longest), "the extremes stage must publish both lengths");',
    'probe($extremes.shortest === $ordered[0].length, "the shortest length must belong to the first ordered word");',
    'probe($extremes.longest === $ordered[$ordered.length - 1].length, "the longest length must belong to the last ordered word");',
    'return "From shortest to longest: " + $ordered.join(", ") + "; the longest word has " + $extremes.longest + " letters.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The label lists five words: ${slots.words.join(', ')}.`,
      `The ordered stage sorts them by length and keeps the order shown for equal lengths, and the extremes stage reads the length of its first and last entry: ${solution.shortest} and ${solution.longest}.`,
      `The answer prints the ordered words, ${solution.ordered.join(', ')}, and the longest length, ${solution.longest}.`
    ];
  }
};

export const textShapeFamilies = [vowelRichestWord, lengthRankedWords];
