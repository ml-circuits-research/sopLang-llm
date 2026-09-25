/**
 * Section 15 of the logical-reasoning book: if, when, whenever.
 *
 * Every case posts one boiler card with two instructions: a "when" clause that
 * fires on the present occasion and a "whenever" clause that fires on every
 * draining. The stem then fixes the situation — the needle is in the red band
 * and the tank is not being drained — and records three reactions: the person
 * who performs the act the "when" clause names, the person who also performs
 * the second act "to be safe", and the person who states the scope of each
 * trigger. The boiler room town and the three names change between cases; the
 * reasoning is fixed. "When" covers this occasion, "whenever" covers every
 * draining of which none is present, and caution imports no second procedure.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN =
  /^Boiler card in ([A-Z][a-z]+(?: [A-Z][a-z]+)?): “When ([^,]+), ([^.]+)\. Whenever ([^,]+), ([^.]+)\.”/;
const SITUATION_PATTERN = /The needle is (not in|in) the red band; the tank is (not being drained|being drained)\./;
const ACTOR_PATTERN = /([A-Z][a-z]+) opens the relief valve\./;
const CAUTIOUS_PATTERN = /([A-Z][a-z]+) also locks the cold tap/;
const READER_PATTERN =
  /([A-Z][a-z]+) says “when” covers this occasion and “whenever” covers every draining, which is not happening\./;
const TRIGGERS = Object.freeze(['red-band', 'draining']);

/** Which of the card's two triggers a clause names. */
function triggerKindOf(trigger) {
  if (/red band/.test(trigger)) {
    return 'red-band';
  }
  if (/drain/.test(trigger)) {
    return 'draining';
  }
  throw new Error(`the card trigger "${trigger}" is not one of the section's two triggers`);
}

/** "open the relief valve" → "Opening the relief valve" for the printed answer. */
function clauseHeading(act) {
  const [verb, ...rest] = act.split(' ');
  const stem = verb.endsWith('e') && !verb.endsWith('ee') ? verb.slice(0, -1) : verb;
  const phrase = `${stem}ing ${rest.join(' ')}`.trim();
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  const situation = SITUATION_PATTERN.exec(statement);
  const actor = ACTOR_PATTERN.exec(statement);
  const cautious = CAUTIOUS_PATTERN.exec(statement);
  const reader = READER_PATTERN.exec(statement);
  if (card === null || situation === null || actor === null || cautious === null || reader === null) {
    throw new Error('the statement does not record the boiler card, the situation, and its three reactions');
  }
  const rules = [
    { trigger: card[2], act: card[3] },
    { trigger: card[4], act: card[5] }
  ].map((rule) => ({ ...rule, triggerKind: triggerKindOf(rule.trigger) }));
  if (rules[0].triggerKind === rules[1].triggerKind) {
    throw new Error('the card must post one red-band rule and one draining rule');
  }
  return {
    place: card[1],
    rules,
    needleInRedBand: situation[1] === 'in',
    draining: situation[2] === 'being drained',
    actor: actor[1],
    cautious: cautious[1],
    reader: reader[1]
  };
}

/**
 * Each instruction carries its own trigger, so only the act whose trigger the
 * situation satisfies is forced. "When" names the present occasion the stem
 * reports, and "whenever" quantifies over draining occasions, of which the stem
 * reports none; eagerness is not a premise.
 */
function solve(slots) {
  const satisfied = { 'red-band': slots.needleInRedBand, draining: slots.draining };
  const forced = slots.rules.filter((rule) => satisfied[rule.triggerKind] === true);
  if (forced.length !== 1) {
    throw new Error('exactly one of the two instructions must have its trigger satisfied');
  }
  const other = slots.rules.find((rule) => rule !== forced[0]);
  const speakers = [slots.actor, slots.cautious, slots.reader];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three reactions must come from three different people');
  }
  return { forcedAct: forced[0].act, unforcedAct: other.act };
}

function render(solution) {
  return `${clauseHeading(solution.forcedAct)}. ${clauseHeading(solution.unforcedAct)} is not forced, because draining is not occurring.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const satisfied = { "red-band": slots.needleInRedBand, draining: slots.draining };',
  'const forced = slots.rules.filter((rule) => satisfied[rule.triggerKind] === true);',
  'probe(forced.length === 1, "exactly one of the two instructions must have its trigger satisfied");',
  'const other = slots.rules.find((rule) => rule !== forced[0]);',
  'const heading = (act) => { const parts = act.split(" "); const verb = parts[0]; const stem = verb.endsWith("e") && !verb.endsWith("ee") ? verb.slice(0, -1) : verb; const phrase = (stem + "ing " + parts.slice(1).join(" ")).trim(); return phrase.charAt(0).toUpperCase() + phrase.slice(1); };',
  'return heading(forced[0].act) + ". " + heading(other.act) + " is not forced, because draining is not occurring.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card in ${slots.place} pairs two instructions with two triggers, so a red-band occasion and a draining occasion are separate conditions.`,
    `The needle is in the red band, which is the occasion the "when" clause names, so ${clauseHeading(solution.forcedAct).toLowerCase()} is forced now and ${slots.actor} does what the card asks.`,
    `The tank is not being drained, so the "whenever" clause has no occasion and ${clauseHeading(solution.unforcedAct).toLowerCase()} is not forced.`,
    `${slots.cautious} adds the second act out of caution, and ${slots.reader} keeps the two scopes apart: "when" for this occasion and "whenever" for every draining, of which none is happening.`
  ];
}

export const unit = 15;

export const cases = [
  {
    template: 'If, when, whenever',
    type: slugify('If, when, whenever'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
