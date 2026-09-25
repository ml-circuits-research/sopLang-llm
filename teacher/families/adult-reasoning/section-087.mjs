/**
 * Section 87 of the adult-reasoning course: a clear message versus a vague one.
 *
 * Every variant prints two numbered messages and a notebook line that defines an
 * actionable message as time plus place plus object plus a channel of refusal.
 * The first message is vague ("sometime", "that thing"); the second fixes a
 * weekday and hour, a door, an object to bring, and a written refusal channel.
 * The family marks each aspect the notebook lists inside both messages, then
 * renders the verdict from the message that carries them all.
 */

import { slugify } from '../../naming.mjs';

const MESSAGE_PATTERN = /^([A-Z][A-Za-z0-9]*): “([^”]+)”$/gm;
const NOTEBOOK_PATTERN = /Notebook: actionable = ([^.]+)\./;
const TIME_PATTERN = /\b\d{1,2}:\d{2}\b|\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
const PLACE_PATTERN = /\b(?:door|gate|window|lane|room|office|desk|counter|hall)\b/i;
const OBJECT_PATTERN = /\bbring\b/i;
const REFUSAL_PATTERN = /\bif\b[^”]*?\b(?:can’t|cannot|can't)\b|\bwrite by\b/i;

/** The notebook aspects with the wording the printed answer uses for a lack. */
const ASPECTS = [
  { key: 'time', label: 'time', present: (text) => TIME_PATTERN.test(text) },
  { key: 'place', label: 'place', present: (text) => PLACE_PATTERN.test(text) },
  { key: 'object', label: 'precise object', present: (text) => OBJECT_PATTERN.test(text) },
  { key: 'refusal', label: 'refusal channel', present: (text) => REFUSAL_PATTERN.test(text) }
];

function declaredKeyOf(item) {
  const aspect = ASPECTS.find((candidate) => item.includes(candidate.key));
  if (aspect === undefined) {
    throw new Error(`the notebook names the aspect "${item}", which this family cannot check`);
  }
  return aspect.key;
}

function parse(statement) {
  const notebook = NOTEBOOK_PATTERN.exec(statement);
  const matches = [...statement.matchAll(MESSAGE_PATTERN)];
  if (notebook === null || matches.length !== 2) {
    throw new Error('the statement does not pair two numbered messages with the notebook line');
  }
  const declared = notebook[1].split('+').map(declaredKeyOf);
  return {
    messages: matches.map((match) => ({
      id: match[1],
      text: match[2],
      missing: ASPECTS.filter((aspect) => declared.includes(aspect.key) && !aspect.present(match[2])).map(
        (aspect) => aspect.label
      )
    }))
  };
}

function solve(slots) {
  const actionable = slots.messages.find((message) => message.missing.length === 0);
  const vague = slots.messages.find((message) => message.missing.length > 0);
  if (actionable === undefined || vague === undefined) {
    throw new Error('the statement does not pair one actionable message with one vague message');
  }
  return {
    actionableClause: `${actionable.id} yes.`,
    vagueClause: `${vague.id}: no ${vague.missing.join(', ')}.`
  };
}

function render(solution) {
  return `${solution.actionableClause} ${solution.vagueClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const actionable = slots.messages.find((message) => message.missing.length === 0);',
  'const vague = slots.messages.find((message) => message.missing.length > 0);',
  'return actionable.id + " yes. " + vague.id + ": no " + vague.missing.join(", ") + ".";'
].join('\n');

function explain(slots, solution) {
  const actionable = slots.messages.find((message) => message.missing.length === 0);
  const vague = slots.messages.find((message) => message.missing.length > 0);
  return [
    `The notebook defines an actionable message as time plus place plus object plus a channel of refusal, and ${actionable.id} states all four: ${actionable.text}`,
    `${vague.id} offers “${vague.text}”, so it lacks ${vague.missing.join(', ')} and cannot be acted on.`,
    `The actionable message is therefore ${actionable.id}; the vague one is named only to record what it does not fix.`
  ];
}

export const unit = 87;

export const cases = [
  {
    template: 'A clear message versus a vague one',
    type: slugify('A clear message versus a vague one'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
