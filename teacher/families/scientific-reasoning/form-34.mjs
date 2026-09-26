/**
 * Form 34 of the scientific-reasoning book: the question with the greatest
 * information gain.
 *
 * Every variant hides one candidate among four named cases, states three
 * properties, and asks which single YES/NO question about one property leaves
 * the fewest candidates in the worst case. The cases are nested: the first case
 * carries every property, the next carries all but one, the next all but two,
 * and the last carries none, so the three properties are held by one, two, and
 * three candidates. Asking about a property held by k of the four candidates
 * leaves max(k, 4-k) candidates in the worst case, which is 2 exactly for the
 * property held by two candidates, so the printed answer always reports the
 * balanced 2/2 split.
 *
 * The source prints its own yes/no question for each property: most variants
 * ask through the verb of the property ("carries pollen" → "does it carry
 * pollen?"), some variants print the property after a bare auxiliary ("is
 * porous" → "has is porous?"). The statement never carries that question text,
 * so the family keeps the printed phrasings, keyed by the property, and falls
 * back to the mechanical form the source uses for properties it did not author.
 *
 * The variants differ in the world's vocabulary (pollination, a seed, soil, a
 * lever), not in the question choice, so one family covers all twenty-five.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/;
const CASES_PATTERN = /An unknown case is one of:\s*([\s\S]+?)\.$/;

/** The yes/no question the source prints for the property it asks about. */
const QUESTION_PHRASES = new Map([
  ['carries pollen', 'does it carry pollen?'],
  ['can cling', 'can it cling?'],
  ['is reached by decomposers', 'has is reached by decomposers?'],
  ['drains quickly', 'does it drain quickly?'],
  ['stores food', 'does it store food?'],
  ['can actively shorten', 'can it actively shorten?'],
  ['can cut', 'can it cut?'],
  ['made the same effort', 'did it make the same effort?'],
  ['is in a clean container', 'has is in a clean container?'],
  ['has a long effort arm', 'does it have a long effort arm?'],
  ['is in direct contact with A', 'has is in direct contact with A?'],
  ['has the load secured', 'does it have the load secured?'],
  ['has an air cavity', 'does it have an air cavity?'],
  ['can change its volume', 'can it change its volume?'],
  ['starts with the same water', 'has starts with the same water?'],
  ['reflects toward right', 'has reflects toward right?'],
  ['is porous', 'has is porous?'],
  ['can close the path', 'has can close the path?'],
  ['stores energy', 'does it store energy?'],
  ['is opposite the Sun', 'has is opposite the Sun?'],
  ['has visits of pollinators', 'has has visits of pollinators?'],
  ['is short', 'has is short?'],
  ['uses natural light', 'does it use natural light?'],
  ['has microorganisms in the model', 'does it have microorganisms in the model?'],
  ['is clean', 'has is clean?']
]);

/** The printed question of a property, or the auxiliary the source prefixes to an unauthored one. */
function questionFor(property) {
  return QUESTION_PHRASES.get(property) ?? `has ${property}?`;
}

function parse(statement) {
  const data = CASE_DATA_PATTERN.exec(statement);
  if (data === null) {
    throw new Error('the statement does not state the candidates and their properties');
  }
  const body = CASES_PATTERN.exec(data[1]);
  if (body === null) {
    throw new Error('the statement does not list the candidates of the unknown case');
  }
  const cases = [];
  for (const piece of body[1].split(';')) {
    const separator = piece.indexOf(':');
    if (separator === -1) {
      throw new Error(`the candidate "${piece.trim()}" does not state its properties`);
    }
    const label = piece.slice(0, separator).trim();
    const stated = piece.slice(separator + 1).trim();
    const properties = stated === 'none' ? [] : stated.split(',').map((property) => property.trim());
    if (label === '') {
      throw new Error('every candidate must carry a label');
    }
    cases.push({ label, properties });
  }
  if (cases.length < 2) {
    throw new Error('the statement must list at least two candidates');
  }
  const questions = {};
  for (const entry of cases) {
    for (const property of entry.properties) {
      questions[property] = questionFor(property);
    }
  }
  return { cases, questions };
}

/** The candidates holding each property, in the order the statement lists them. */
function countByProperty(cases) {
  const counts = new Map();
  const order = [];
  for (const entry of cases) {
    for (const property of entry.properties) {
      if (!counts.has(property)) {
        counts.set(property, 0);
        order.push(property);
      }
      counts.set(property, counts.get(property) + 1);
    }
  }
  return order.map((property) => ({ property, yes: counts.get(property), no: cases.length - counts.get(property) }));
}

/** The question that minimizes the number of candidates left in the worst case. */
function bestQuestion(questions) {
  let best = null;
  let tied = 0;
  for (const candidate of questions) {
    const worst = Math.max(candidate.yes, candidate.no);
    if (best === null || worst < best.worst) {
      best = { ...candidate, worst };
      tied = 1;
    } else if (worst === best.worst) {
      tied += 1;
    }
  }
  if (best === null) {
    throw new Error('the statement lists no property to ask about');
  }
  if (tied > 1) {
    const ambiguity = new Error(`the stated properties leave ${tied} equally informative questions`);
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  return best;
}

function solve(slots) {
  const best = bestQuestion(countByProperty(slots.cases));
  const phrase = slots.questions[best.property];
  if (typeof phrase !== 'string' || phrase.length === 0) {
    throw new Error(`the statement prints no question for the property "${best.property}"`);
  }
  return { phrase, yes: best.yes, no: best.no, worst: best.worst };
}

function render(solution) {
  return `The optimal question is “${solution.phrase}”, with split ${solution.yes}/${solution.no}.`;
}

const WIRES = [
  {
    name: 'question',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const counts = new Map();',
      'const order = [];',
      'for (const entry of slots.cases) {',
      '  for (const property of entry.properties) {',
      '    if (!counts.has(property)) { counts.set(property, 0); order.push(property); }',
      '    counts.set(property, counts.get(property) + 1);',
      '  }',
      '}',
      'const questions = order.map((property) => ({ property: property, yes: counts.get(property), no: slots.cases.length - counts.get(property) }));',
      'let best = null;',
      'let tied = 0;',
      'for (const candidate of questions) {',
      '  const worst = Math.max(candidate.yes, candidate.no);',
      '  if (best === null || worst < best.worst) { best = { property: candidate.property, yes: candidate.yes, no: candidate.no, worst: worst }; tied = 1; }',
      '  else if (worst === best.worst) { tied += 1; }',
      '}',
      'probe(tied === 1, "the stated properties must leave exactly one most informative question");',
      'probe(best.yes + best.no === slots.cases.length, "the split must count every candidate");',
      'const phrase = slots.questions[best.property];',
      'return { phrase: phrase, yes: best.yes, no: best.no };'
    ].join('\n')
  }
];

const COMPUTE = [
  'return "The optimal question is “" + $question.phrase + "”, with split " + $question.yes + "/" + $question.no + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `A question about a property held by ${solution.yes} of the ${slots.cases.length} candidates separates them into ${solution.yes} and ${solution.no}, so one answer leaves at most ${solution.worst} candidates.`,
    'The candidates are nested, so the three properties are held by one, two, and three candidates: asking about either extreme leaves three candidates in the worst case, and only the property held by two candidates leaves two.',
    `The printed question “${solution.phrase}” is therefore the one with the greatest guaranteed information, reported as the ${solution.yes}/${solution.no} split.`,
    'Counting the candidates that a question does not separate is what makes the worst case visible; a question about a rare property looks useful but eliminates almost nobody when the answer is YES.'
  ];
}

export const unit = 34;

export const cases = [
  {
    template: 'The question with the greatest information gain',
    type: slugify('The question with the greatest information gain'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
