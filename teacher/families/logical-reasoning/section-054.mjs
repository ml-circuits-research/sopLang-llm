/**
 * Section 54 of the logical-reasoning book: symptoms and a closed leaflet.
 *
 * Every case prints a leaflet from a named place that forks on its own
 * bundles: a dry cough with the listed fever band and no rash goes to the
 * listed nurse path, while a rash with fever goes to a different listed path.
 * Two readers then act, one with the first bundle following the first path and
 * one with a rash using the first path anyway, and a third speaker says
 * leaflets are timid so any path is fine. The case data changes the place and
 * the three names; the reasoning is fixed: the leaflet’s own fork decides each
 * reader’s best printed fit.
 */

import { slugify } from '../../naming.mjs';

const STATEMENT_PATTERN =
  /Leaflet in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): “Dry cough plus listed fever band plus no rash → see the listed nurse path\. Rash plus fever → different listed path\.” ([A-Z][a-z]+) has a dry cough in the fever band and no rash, and follows the first path\. ([A-Z][a-z]+) has a rash and uses the first path anyway\. ([A-Z][a-z]+) says leaflets are timid so any path is fine\.\s*Question\. Which path is the leaflet’s best fit\?/;

function parse(statement) {
  const matched = STATEMENT_PATTERN.exec(statement);
  if (matched === null) {
    throw new Error('the statement does not record the leaflet, the two readers, and the third speaker');
  }
  return {
    place: matched[1],
    firstBundle: matched[2],
    rash: matched[3],
    sceptic: matched[4]
  };
}

function solve(slots) {
  const speakers = [slots.firstBundle, slots.rash, slots.sceptic];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three speakers must be different people');
  }
  return { place: slots.place, firstBundle: slots.firstBundle, rash: slots.rash };
}

function render(solution) {
  return `${solution.firstBundle}’s symptoms match the first printed bundle. ${solution.rash} matches the second bundle.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return slots.firstBundle + "\\u2019s symptoms match the first printed bundle. " + slots.rash + " matches the second bundle.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The leaflet from ${slots.place} forks on its own printed bundles: the first bundle needs a dry cough with the fever band and no rash, the second needs a rash with fever.`,
    `${solution.firstBundle} has exactly the first bundle, so the first printed path is that reader’s best fit.`,
    `${solution.rash} arrives with a rash, which the leaflet uses as the fork, so the second bundle is the better match even though the first path was used.`,
    `${slots.sceptic} treats the leaflet as timid, but a printed fork is still what decides the best fit.`
  ];
}

export const unit = 54;

export const cases = [
  {
    template: 'Symptoms and a closed leaflet',
    type: slugify('Symptoms and a closed leaflet'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
