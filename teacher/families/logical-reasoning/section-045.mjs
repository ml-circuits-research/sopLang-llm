/**
 * Section 45 of the logical-reasoning book: before-after without a twin.
 *
 * Every case prints one institution in a named place that expands a lending
 * rule, a recorded rise in damage the next year, a letter that blames the rule,
 * and three readers: one accepts the letter, one names the missing comparison
 * town, one calls any rise after a change a cause. The case data changes the
 * place, the institution, and the names; the reasoning is fixed: a sequence is
 * a clue, not a finished cause. The family checks that the case states the
 * design without a comparison town and renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const TEMPLATE = 'Before-after without a twin';

const EXPANSION_PATTERN =
  /([A-Z][A-Za-z ]+) ([a-z]+) expands home loans of ([a-z]+)\. The next year, recorded ([a-z]+) damage is ([a-z]+)\. A letter says the new rule caused the damage\. ([A-Z][a-z]+) accepts the letter\. ([A-Z][a-z]+) says this is a before-after (without|with) a comparison town\. ([A-Z][a-z]+) says any rise after a change is already a cause\./;

function parse(statement) {
  const expansion = EXPANSION_PATTERN.exec(statement);
  if (expansion === null) {
    throw new Error('the statement does not print the expansion note with its three readers');
  }
  return {
    place: expansion[1],
    institution: expansion[2],
    itemPlural: expansion[3],
    itemSingular: expansion[4],
    rise: expansion[5],
    letterAccepter: expansion[6],
    cautionSpeaker: expansion[7],
    comparison: expansion[8],
    commonsenseSpeaker: expansion[9]
  };
}

function solve(slots) {
  if (slots.comparison !== 'without') {
    throw new Error('the case states a comparison town, so the sequence is not a blind before-after');
  }
  if (slots.itemPlural.slice(0, slots.itemSingular.length) !== slots.itemSingular) {
    throw new Error('the recorded item and the thing the rule lends must be the same word');
  }
  if (slots.rise !== 'higher') {
    throw new Error('the recorded damage must have risen after the change');
  }
  const readers = [slots.letterAccepter, slots.cautionSpeaker, slots.commonsenseSpeaker];
  if (new Set(readers).size !== readers.length) {
    throw new Error('the three readings must come from three different readers');
  }
  return {
    place: slots.place,
    institution: slots.institution,
    item: slots.itemSingular,
    comparison: slots.comparison
  };
}

function render() {
  return 'No. Sequence is a clue, not a finished cause. Other changes are not closed off.';
}

const COMPUTE = [
  'const slots = $slots;',
  'return "No. Sequence is a clue, not a finished cause. Other changes are not closed off.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The ${solution.institution} in ${solution.place} expanded its home loans of ${slots.itemPlural} and the next year recorded more damage, so the page gives one rise after one change.`,
    `${slots.letterAccepter} accepts the letter that blames the new rule, but ${slots.cautionSpeaker} names what the design lacks: a before-after ${solution.comparison} a comparison town.`,
    `${slots.commonsenseSpeaker} treats any rise after a change as already a cause; volume of use, weather, and the counting rule are still open, so the sequence is a clue and not a finished cause.`
  ];
}

export const unit = 45;

export const cases = [
  {
    template: TEMPLATE,
    type: slugify(TEMPLATE),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
