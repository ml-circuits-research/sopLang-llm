/**
 * Form 7 of the scientific-reasoning book: predicting a change.
 *
 * Every variant states that the system is stable, activates (or increases) one
 * named initial change, and gives a list of causal rules of the form
 * "state → effect". Following the rules forward from the states the change
 * activates yields the effects in the order they become reachable: the first
 * effect is the direct one, and every effect after it is indirect because an
 * intermediate change has become a cause itself. A rule whose condition the
 * change never activates contributes nothing, which is why several variants
 * end after one or two effects while others run through four rules.
 *
 * The variants differ in the world's vocabulary (germination, transport in a
 * plant, a food chain, digestion, sound, circuits, the water cycle), not in the
 * forward chain, so one family covers all twenty-five of them. Some rules name
 * a state with a slightly different word order or with the leading article
 * dropped, so a state is compared by its content words.
 */

import { slugify } from '../../naming.mjs';

const CASE_DATA_PATTERN = /Case data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/;
const CHANGE_PATTERN = /“([^”]+)”/;
const RULES_PATTERN = /The causal rules are:\s*([\s\S]*)$/;
const ARROW_PATTERN = /\s*(?:→|->)\s*/;
const FILLER_WORDS = Object.freeze(['the', 'a', 'an']);

/** The content words of a state, so "Water enters stem" and "water enters the stem" are one state. */
function stateKey(text) {
  const words = text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((word) => !FILLER_WORDS.includes(word));
  return [...new Set(words)].sort().join(' ');
}

function parse(statement) {
  const caseData = CASE_DATA_PATTERN.exec(statement);
  if (caseData === null) {
    throw new Error('the statement does not state its case data');
  }
  const change = CHANGE_PATTERN.exec(caseData[1]);
  if (change === null) {
    throw new Error('the statement does not name the change it activates');
  }
  const body = RULES_PATTERN.exec(caseData[1]);
  if (body === null) {
    throw new Error('the statement does not state its causal rules');
  }
  const rules = body[1]
    .trim()
    .replace(/\.\s*$/, '')
    .split(/\.\s+/)
    .map((chunk) => {
      const parts = chunk.split(ARROW_PATTERN);
      if (parts.length !== 2 || parts[0].trim() === '' || parts[1].trim() === '') {
        throw new Error(`the rule "${chunk}" is not written as "state → effect"`);
      }
      return { from: parts[0].trim(), to: parts[1].trim() };
    });
  if (rules.length === 0) {
    throw new Error('the statement lists no causal rule');
  }
  return { change: change[1].trim(), rules };
}

function solve(slots) {
  const activated = [stateKey(slots.change)];
  const effects = [];
  let grown = true;
  while (grown) {
    grown = false;
    for (const rule of slots.rules) {
      if (!activated.includes(stateKey(rule.from))) {
        continue;
      }
      const effected = stateKey(rule.to);
      if (activated.includes(effected)) {
        continue;
      }
      activated.push(effected);
      effects.push(rule.to);
      grown = true;
    }
  }
  if (effects.length === 0) {
    throw new Error(`no rule reacts to the activated change "${slots.change}"`);
  }
  return { direct: effects[0], effects };
}

function render(solution) {
  return `Direct effect: ${solution.direct}. Downstream effects: ${solution.effects.join(', ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'for (const rule of slots.rules) {',
  '}',
  'const filler = ["the", "a", "an"];',
  'const stateKey = (text) => [...new Set(text.toLowerCase().replace(/\\s+/g, " ").trim().split(" ").filter((word) => filler.indexOf(word) === -1))].sort().join(" ");',
  'const activated = [stateKey(slots.change)];',
  'const effects = [];',
  'let grown = true;',
  'while (grown) {',
  '  grown = false;',
  '  for (const rule of slots.rules) {',
  '    if (activated.indexOf(stateKey(rule.from)) === -1) {',
  '      continue;',
  '    }',
  '    const effected = stateKey(rule.to);',
  '    if (activated.indexOf(effected) !== -1) {',
  '      continue;',
  '    }',
  '    activated.push(effected);',
  '    effects.push(rule.to);',
  '    grown = true;',
  '  }',
  '}',
  'probe(effects.length > 0, "the activated change must trigger at least one rule");',
  'return "Direct effect: " + effects[0] + ". Downstream effects: " + effects.join(", ") + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The change is “${slots.change}”, and the ${slots.rules.length} rules are followed forward from the states the change activates.`,
    `The first rule whose condition becomes active gives the direct effect “${solution.direct}”.`,
    solution.effects.length === 1
      ? 'No other rule starts from an activated state, so no further effect appears and the direct effect is the whole downstream list.'
      : `Each effect then becomes a cause itself, which adds ${solution.effects.length - 1} indirect effect${solution.effects.length === 2 ? '' : 's'} in turn: ${solution.effects.slice(1).join(', ')}.`,
    'A rule whose condition the change never activates contributes nothing, so the answer lists only effects reachable from the initial change.'
  ];
}

export const unit = 7;

export const cases = [
  {
    template: 'Predicting a change',
    type: slugify('Predicting a change'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
