/**
 * Section 79 of the adult-reasoning course: licences and reuse as written.
 *
 * Every variant prints the same photo note (the picture may be copied
 * unchanged, with the author's name, for non-commercial purpose; changing is
 * forbidden; commercial use is forbidden) and then describes one person who
 * crops a piece, adds a company logo, and sells posters. The verdict counts the
 * broken conditions: the change, the commercial use, and the attribution the
 * stem never mentions, which stays a possible third. The variants change the
 * person, so the family derives each clause from the parsed action and the
 * parsed note.
 */

import { slugify } from '../../naming.mjs';

const NOTE_PATTERN = /Photo note: “([^”]+)”/;
const ACTION_PATTERN = /\n\n([A-Z][a-z]+) ([^\n]+)\n\nQuestion\./;

function parse(statement) {
  const note = NOTE_PATTERN.exec(statement);
  const action = ACTION_PATTERN.exec(statement);
  if (note === null || action === null) {
    throw new Error('the statement does not print the photo note and the person reusing the picture');
  }
  const licence = note[1];
  const actionText = action[2];
  const unchangedRequired = /copied unchanged/.test(licence);
  const attributionRequired = /the author’s name/.test(licence);
  const changingForbidden = /Changing forbidden/.test(licence);
  const commercialForbidden = /Commercial forbidden/.test(licence);
  if (!unchangedRequired || !attributionRequired || !changingForbidden || !commercialForbidden) {
    throw new Error('the note does not state the four conditions this section reads');
  }
  return {
    name: action[1],
    actionText,
    changed: /crops|alters|modifies|edits|adds a company logo/.test(actionText),
    commercial: /sells|commercial|advertis/.test(actionText),
    attributionStated: /the author|names the author|keeps the name/.test(actionText),
    unchangedRequired,
    attributionRequired,
    changingForbidden,
    commercialForbidden
  };
}

function solve(slots) {
  const definite = [];
  if (slots.changed && slots.changingForbidden) {
    definite.push('Changes');
  }
  if (slots.commercial && slots.commercialForbidden) {
    definite.push('uses commercially');
  }
  if (definite.length === 0) {
    throw new Error('the described reuse breaks no stated condition');
  }
  const possible = [];
  if (!slots.attributionStated) {
    possible.push('the stem does not say the name is kept — possibly a third');
  }
  return { definite, possible };
}

function render(solution) {
  return `${solution.definite.concat(solution.possible).join('; ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.name === "string" && slots.name.length > 0, "the case must name the person who reuses the photo");',
  'probe(slots.changed === true, "the reuse changes the photo");',
  'probe(slots.commercial === true, "the reuse serves a commercial purpose");',
  'probe(slots.changingForbidden === true && slots.commercialForbidden === true, "the note forbids changing and commercial use");',
  'probe(slots.unchangedRequired === true && slots.attributionRequired === true, "the note allows only unchanged copies that keep the author name");',
  'probe(slots.attributionStated === false, "the action paragraph does not say the author is named");',
  'const definite = [];',
  'if (slots.changed && slots.changingForbidden) { definite.push("Changes"); }',
  'if (slots.commercial && slots.commercialForbidden) { definite.push("uses commercially"); }',
  'probe(definite.length === 2, "the reuse breaks the change ban and the commercial ban");',
  'const possible = [];',
  'if (!slots.attributionStated) { possible.push("the stem does not say the name is kept — possibly a third"); }',
  'probe(possible.length === 1, "the attribution stays unstated");',
  'return definite.concat(possible).join("; ") + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The note allows only an unchanged copy, and ${slots.name} changes the picture by cropping a piece and adding a company logo, so the change condition is broken.`,
    'The same reuse sells posters, and the note forbids a commercial purpose, so the second condition is broken too.',
    'The note allows the copy only with the author’s name, but the stem never says whether the name is kept, so the attribution stays unproven rather than confirmed.',
    `The answer therefore reports ${solution.definite.length} certain breaches and one possible third.`
  ];
}

export const unit = 79;

export const cases = [
  {
    template: 'Licences and reuse as written',
    type: slugify('Licences and reuse as written'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
