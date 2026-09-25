/**
 * Section 16 of the logical-reasoning book: the scope of a conditional.
 *
 * Every case posts one warehouse card whose conditional names an exact trigger:
 * a fire alarm running continuously for more than a stated number of seconds,
 * with a stated exit gate. The stem then reports an alarm that sounds in bursts
 * with pauses and never reaches that duration, and records three reactions: a
 * person who takes the gate anyway and calls it the same rule, a person who
 * says the sentence does not decide the intermittent case, and a person who
 * widens the rule because bursts feel worse. The warehouse town, the duration,
 * the gate, and the three names change between cases; the reasoning is fixed.
 * The trigger is read exactly, an unmatched pattern is uncovered, and silence
 * is not a secret extra clause.
 *
 * The stem says that the eager leaver "calls it the same rule", which the
 * pipeline reads as a hand-off to another problem; the case therefore declares
 * the rule that phrase refers to, so the referenced context is on the record
 * even though the card that carries it is printed in the same statement.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN =
  /^Warehouse card in ([A-Z][a-z]+(?: [A-Z][a-z]+)?): “If a fire alarm runs continuously for more than (\d+) seconds, leave by the ([a-z]+(?: [a-z]+)?)\./;
const PATTERN_PATTERN = /An alarm sounds in bursts with pauses, never continuous for (\d+) seconds\./;
const LEAVER_PATTERN = /([A-Z][a-z]+) leaves by the ([a-z]+(?: [a-z]+)?) anyway and calls it the same rule\./;
const SILENT_PATTERN = /([A-Z][a-z]+) says this sentence does not decide the intermittent case\./;
const WIDENER_PATTERN = /([A-Z][a-z]+) invents “bursts are worse, so the same exit applies\.”/;

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  const pattern = PATTERN_PATTERN.exec(statement);
  const leaver = LEAVER_PATTERN.exec(statement);
  const silent = SILENT_PATTERN.exec(statement);
  const widener = WIDENER_PATTERN.exec(statement);
  if (card === null || pattern === null || leaver === null || silent === null || widener === null) {
    throw new Error('the statement does not record the warehouse card and its three reactions');
  }
  if (leaver[2] !== card[3]) {
    throw new Error('the person in the statement leaves by a gate the card does not name');
  }
  return {
    place: card[1],
    seconds: Number(card[2]),
    gate: card[3],
    burstSeconds: Number(pattern[1]),
    leaver: leaver[1],
    silent: silent[1],
    widener: widener[1]
  };
}

/**
 * The conditional covers only the occasion whose trigger it writes: a
 * continuous alarm longer than the stated duration. The intermittent pattern in
 * the stem never reaches that duration, so it falls outside the sentence and no
 * argument about how much worse bursts feel can widen the written trigger.
 */
function solve(slots) {
  if (!Number.isInteger(slots.seconds) || slots.seconds <= 0) {
    throw new Error('the card must state a whole, positive number of seconds');
  }
  if (slots.burstSeconds !== slots.seconds) {
    throw new Error('the case must report an intermittent alarm that never sustains the duration the card writes');
  }
  const speakers = [slots.leaver, slots.silent, slots.widener];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three reactions must come from three different people');
  }
  return { seconds: slots.seconds, gate: slots.gate };
}

function render(solution) {
  return `Only a continuous alarm longer than ${solution.seconds} seconds. The intermittent pattern is not covered. “The text is silent” is the adult line.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "Only a continuous alarm longer than " + slots.seconds + " seconds. The intermittent pattern is not covered. \\u201cThe text is silent\\u201d is the adult line.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card in ${slots.place} attaches the exit to one trigger: an alarm running continuously for more than ${solution.seconds} seconds, which is what "continuously" and the duration together write.`,
    `The alarm in the case sounds in bursts with pauses and never runs for ${slots.burstSeconds} seconds at a stretch, so the pattern fails the written trigger.`,
    `${slots.leaver} leaves by the ${solution.gate} anyway and calls it the same rule, but the sentence never reached that pattern, and ${slots.widener} widens the trigger because bursts feel worse.`,
    `${slots.silent} states the honest line: the sentence does not decide the intermittent case, so the choice there is uncovered rather than permitted.`
  ];
}

export const unit = 16;

export const cases = [
  {
    template: 'The scope of if',
    type: slugify('The scope of if'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
