/**
 * Form 19 of the scientific-reasoning book: minimum information needed.
 *
 * Every variant reports the observation already made and two rival hypotheses,
 * and asks which single further observation would separate them. The statement
 * prints neither hypothesis's predictions, while the answer is exactly the pair
 * of predictions that tells the two models apart, so the prediction sets are
 * the material a compiler must supply: they travel on this family's `@facts`
 * wire, keyed by the hypothesis text.
 *
 * The prediction sets are not invented. The book prints them for the very same
 * hypothesis pairs in its other forms, as `H1: <hypothesis> predicts [a, b, c]`:
 * `Choosing a discriminating experiment` (problems 129-249, paragraphs
 * 1782-3377), `Is the evidence sufficient?` (252-372, 3408-5003), and
 * `Competing hypotheses` (376-496, 5047-6642) print the identical fifty sets.
 * The table below is that union, in the book's own phrasing and order.
 *
 * The key of a table row is the content key of a hypothesis (lowercased,
 * articles dropped, word order ignored), so the form-19 printing of a pair
 * resolves to the set the other forms print for it: problem 499 prints "the
 * unusual value is a random error" where problems 249, 372, and 496 print "the
 * value unusual is a random error", and both reduce to the same content key.
 * Every one of the twenty-five cases is covered by two rows of this table; a
 * hypothesis the table does not print would be refused instead of guessed.
 *
 * The discriminating pair is the book's own rule, already written down for
 * form 9: the first prediction of H1 that H2 does not make, together with the
 * first prediction of H2 that H1 does not make. The observation the case
 * already made must be one that both models account for (or the source's plain
 * sentence that the cause is not yet located); a case whose stated observation
 * already separated the hypotheses would be refused instead of answered. The
 * answer wire reads the table, so the fact is load-bearing, and the printed
 * answer of the source is embedded nowhere.
 */

import { slugify } from '../../naming.mjs';

/**
 * One prediction set per hypothesis, exactly as the source prints it, in the
 * order of the `Choosing a discriminating experiment` problems.
 */
const PRINTED_PREDICTIONS = Object.freeze([
  ['the problem is a lack of air',
    ['the rootlet does not appear', 'improves after ventilation', 'humid']],
  ['the problem is a temperature that is too low',
    ['the rootlet does not appear', 'improves after warming', 'humid']],
  ['the soil is too dry',
    ['wilted leaves', 'dry soil', 'watering helps']],
  ['the stem does not transport water',
    ['wilted leaves', 'moist soil', 'watering alone does not help']],
  ['rabbits decrease from lack of food',
    ['little grass', 'rabbits decrease', 'the tracks of fox must not increase']],
  ['rabbits decrease through predation',
    ['grass sufficient', 'rabbits decrease', 'the tracks of fox increase']],
  ['problem main is heat',
    ['low activity at noon', 'activity returns evening', 'water there is']],
  ['problem main is the lack of the water',
    ['low activity all day', 'the animals leaves', 'spring dry']],
  ['food of the larvae is insufficient',
    ['the larvae increase slowly', 'many larvae', 'few pupae']],
  ['few eggs are viable',
    ['few larvae', 'few eggs hatches', 'ratio normal larvae-pupae']],
  ['problem is before the intestine',
    ['low absorption', 'food does not reach the intestine', 'the stomach receives food']],
  ['the problem is intestinal absorption',
    ['low absorption', 'food reaches the intestine', 'the preceding digestive path is normal']],
  ['air not reaches sufficient in lungs',
    ['little air', 'low blood oxygen', 'ventilation helps']],
  ['the transfer in blood is problem',
    ['normal air', 'low blood oxygen', 'ventilation alone does not solve']],
  ['the receiver does not detect',
    ['without signal initial', 'reaction absent', 'stimulus stronger helps']],
  ['the path of signal is blocked',
    ['the center does not receive', 'signal initial there is', 'stimulus stronger does not help']],
  ['transmission is through hands',
    ['microbes on hands', 'washing reduces cases', 'surface is reached']],
  ['transmission is direct through food',
    ['covering of the food reduces cases', 'the food are exposed', 'the hands can be clean']],
  ['the loss of heat is through material',
    ['the container remains closed', 'temperature decreases quickly', 'a layer insulator helps']],
  ['the loss is through opening',
    ['temperature decreases quickly', 'the wall type matters little', 'closing helps']],
  ['the the liquid is cloudy because of the sand',
    ['the filter clarifies it', 'the magnet does not change the turbidity', 'sand on filter']],
  ['the the liquid is cloudy because of the fine iron particles',
    ['the filter can retain them as well', 'the magnet reduces the particles', 'particles magnetic']],
  ['the droplets come from condensation',
    ['appear on the part cold a of the lid', 'without hole above', 'the container contains water warm']],
  ['the droplets come from outside',
    ['appear and when the container e empty', 'does not depend of the vapor from container', 'surface external is wet']],
  ['insulation is weak',
    ['lid closed', 'rapid cooling', 'layer thin']],
  ['the lid is problem',
    ['lid open', 'rapid cooling', 'the insulating layer is good']],
  ['the shadow is missing because of the object transparent',
    ['screen aligned', 'light passes through object', 'source lit']],
  ['the shadow is missing because of the screen',
    ['the screen is not behind the object', 'opaque object', 'source lit']],
  ['the source does not vibrate',
    ['without visible vibration', 'hitting the source changes the situation', 'no receptor does not detect']],
  ['the receiver is defect',
    ['first receptor does not detect', 'the source vibrates', 'a the second receptor detects']],
  ['the short distance is caused by friction',
    ['the same push', 'short distance', 'rough surface']],
  ['the short distance is caused by the push',
    ['short distance', 'identical surface area', 'weaker push']],
  ['the object is not magnetic',
    ['near of magnet', 'the magnet attracts another object', 'does not moves']],
  ['the magnet is too far',
    ['does not move far', 'object known magnetic', 'moves then when we bring closer the magnet']],
  ['the wire is broken',
    ['bulb off', 'the spare wire lights the bulb', 'switch closed']],
  ['the switch is open',
    ['bulb off', 'the wire is good', 'closing the switch lights the bulb']],
  ['the soil is compacted',
    ['loosening the soil helps', 'water at the surface', 'drainage slow']],
  ['too much water was poured',
    ['loosening the soil is not necessary', 'larger initial quantity', 'drainage apparently slow']],
  ['there is too little water vapor',
    ['low evaporation', 'little water vapor', 'heating increases the droplets']],
  ['the water vapor does not cool',
    ['much water vapor', 'few droplets', 'cooling increases condensation']],
  ['alternation comes from rotation of the sphere',
    ['the point marked enters and goes out from light', 'rotation changes the state', 'the source remains fixed']],
  ['alternation comes from turning off the source',
    ['rotation is not necessary', 'the source turns off', 'all the points darkens simultaneously']],
  ['the lack of the layer comes from transport that is too strong',
    ['the water is fast-flowing', 'little deposition', 'the sediments appear farther downstream']],
  ['the lack of the layer comes from a lack of fragments',
    ['the water may be slow-flowing', 'no deposits appear in the collector', 'no fragments are present']],
  ['the source of pollution is still active',
    ['increases after discharge', 'level large near source', 'stopping the source reduces rapid the input new']],
  ['the pollutant is in sediments old',
    ['increasing does not follow discharges new', 'level decreases slowly', 'the source is stopped']],
  ['the lack of satiety comes from a portion with too little energy',
    ['increasing the portion helps', 'energy below target', 'protein may be present']],
  ['the lack comes from unsuitable composition',
    ['energy at target', 'the required component is missing', 'changing the composition helps']],
  ['the value unusual is a random error',
    ['the instrument passes the check', 'a alone measurement differs', 'the repeated measurements groups']],
  ['the instrument is misadjusted',
    ['another instrument gives a different level', 'repetition keeps deviation', 'all the measurements are shifted']]
]);

/**
 * A hypothesis reduced to its content words: lowercased, stripped of
 * punctuation, with the articles dropped and the remaining words ordered, so
 * that the word order the source varies between forms ("the unusual value" and
 * "the value unusual") does not hide the row a case belongs to.
 */
function contentKey(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((word) => word !== '' && word !== 'the' && word !== 'a' && word !== 'an')
    .sort()
    .join(' ');
}

/** The printed table keyed by content key, refusing two rows that share one. */
function buildTable(rows) {
  const table = new Map();
  for (const [hypothesis, predictions] of rows) {
    const key = contentKey(hypothesis);
    if (table.has(key)) {
      throw new Error(`two printed hypotheses share the content key "${key}"`);
    }
    table.set(key, predictions);
  }
  return Object.freeze(Object.fromEntries(table));
}

const PREDICTIONS = buildTable(PRINTED_PREDICTIONS);

function predictionsOf(hypothesis) {
  const key = contentKey(hypothesis);
  if (!Object.hasOwn(PREDICTIONS, key)) {
    throw new Error(`the fact table prints no prediction set for the hypothesis "${hypothesis}"`);
  }
  return PREDICTIONS[key];
}

function ambiguity(message) {
  const error = new Error(message);
  error.ambiguous = true;
  return error;
}

/**
 * The discriminating pair of two prediction sets, with the guard the source's
 * own task states: the observation already made must be compatible with both
 * hypotheses, otherwise it would have separated them before the question.
 */
function discriminate(observation, predictions1, predictions2) {
  if ((predictions1.indexOf(observation) !== -1) !== (predictions2.indexOf(observation) !== -1)) {
    throw ambiguity(
      'the observation the statement already made appears in the predictions of one hypothesis only, so it separates them already'
    );
  }
  const first = predictions1.find((prediction) => !predictions2.includes(prediction));
  const second = predictions2.find((prediction) => !predictions1.includes(prediction));
  if (first === undefined || second === undefined) {
    throw ambiguity('the two hypotheses predict the same observations, so no single observation separates them');
  }
  return { first, second, predictions1, predictions2 };
}

const CASE_DATA_PATTERN = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/;
const HYPOTHESES_PATTERN =
  /H1:\s*([\s\S]*?)\s*(?:;|\band\b)\s*H2:\s*([\s\S]*?)\.\s*We can make one additional observation/;
const OBSERVATION_PATTERN = /after the observation “([^”]*)”/i;

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state its case data');
  }
  const observation = OBSERVATION_PATTERN.exec(caseData[1]);
  if (observation === null) {
    throw new Error('the statement does not report the observation already made');
  }
  const hypotheses = HYPOTHESES_PATTERN.exec(caseData[1]);
  if (hypotheses === null) {
    throw new Error('the statement does not state its two competing hypotheses');
  }
  const hypothesis1 = hypotheses[1].trim();
  const hypothesis2 = hypotheses[2].trim();
  if (hypothesis1 === '' || hypothesis2 === '') {
    throw new Error('a hypothesis carries no text');
  }
  return { observation: observation[1].trim(), hypothesis1, hypothesis2 };
}

function solve(slots) {
  const predictions1 = predictionsOf(slots.hypothesis1);
  const predictions2 = predictionsOf(slots.hypothesis2);
  return discriminate(slots.observation, predictions1, predictions2);
}

function render(solution) {
  return `We check “${solution.first}” (or equivalently “${solution.second}”), because the result separates the two hypotheses.`;
}

const WIRES = [
  {
    name: 'pair',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const facts = (typeof $facts === "object" && $facts !== null) ? $facts : JSON.parse(String($facts));',
      'const key = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter((word) => word !== "" && word !== "the" && word !== "a" && word !== "an").sort().join(" ");',
      'const table = facts.predictions;',
      'const predictions1 = table[key(slots.hypothesis1)];',
      'const predictions2 = table[key(slots.hypothesis2)];',
      'probe((predictions1.indexOf(slots.observation) !== -1) === (predictions2.indexOf(slots.observation) !== -1), "the observation already made must be compatible with both hypotheses");',
      'const first = predictions1.find((prediction) => predictions2.indexOf(prediction) === -1);',
      'const second = predictions2.find((prediction) => predictions1.indexOf(prediction) === -1);',
      'probe(first !== undefined, "the first hypothesis must predict something the second does not");',
      'probe(second !== undefined, "the second hypothesis must predict something the first does not");',
      'return { first: first, second: second };'
    ].join('\n')
  }
];

const COMPUTE = [
  'return "We check “" + $pair.first + "” (or equivalently “" + $pair.second + "”), because the result separates the two hypotheses.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The statement reports the observation “${slots.observation}” and leaves both hypotheses possible: ` +
      `H1: ${slots.hypothesis1} and H2: ${slots.hypothesis2}.`,
    `The model of H1 predicts ${solution.predictions1.join(', ')}; the model of H2 predicts ` +
      `${solution.predictions2.join(', ')}. The observation already made is compatible with both, so it does not separate them.`,
    `The first prediction of H1 that H2 does not make is “${solution.first}”, and the first prediction of H2 ` +
      `that H1 does not make is “${solution.second}”.`,
    `Checking “${solution.first}” or “${solution.second}” is enough: the result sends the explanation down one of ` +
      'two different branches, and one observation chosen that way is the minimum information that separates the hypotheses.'
  ];
}

export const unit = 19;

export const cases = [
  {
    template: 'Minimum information needed',
    type: slugify('Minimum information needed'),
    category: 'knowledge',
    parse,
    solve,
    render,
    facts: { predictions: PREDICTIONS },
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
