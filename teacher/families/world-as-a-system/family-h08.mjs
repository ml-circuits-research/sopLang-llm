/**
 * Family H8 of the world seed book: layers and dating objects.
 *
 * Every problem states an undisturbed sequence of four layers in top-to-bottom
 * order, the dated objects some layers contain, and asks which of two named
 * layers is older and whether the exact deposition year of a third layer can be
 * deduced. Stratigraphy settles the first question: in an undisturbed sequence
 * the lower layer was deposited earlier, so the deeper layer is the older one.
 * The dated objects do not settle the second: they are constraints on the
 * layers that contain them, and the source answers that the exact deposition
 * year of a layer without a stated dated object cannot be deduced. From grade 2
 * on the statement appends a cross-domain check (map scale, clock arithmetic,
 * quorum, duplicate reports, optionally combined with a map-sheet count), which
 * the family renders as the labelled answer suffix through the shared
 * `renderCrossDomain`.
 *
 * The four grades share one computation; the grade differences live in the
 * stated years and in whether a cross-domain check is appended.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const SEQUENCE_PATTERN = /layers from top to bottom: ([A-Z](?:, [A-Z])*)/;
const DATED_PATTERN = /([A-Z]) contains (?:an object|one) dated (\d+)/g;
const FIRST_QUESTION_PATTERN = /Which is older, Layer ([A-Z]) or Layer ([A-Z])\?/;
const SECOND_QUESTION_PATTERN = /exact year of deposition of Layer ([A-Z]) be deduced/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const sequence = SEQUENCE_PATTERN.exec(facts);
  if (sequence === null) {
    throw new Error('the statement does not list the layers from top to bottom');
  }
  const layers = sequence[1].split(',').map((layer) => layer.trim());
  const dated = new Map();
  for (const match of facts.matchAll(DATED_PATTERN)) {
    dated.set(match[1], Number(match[2]));
  }
  const first = FIRST_QUESTION_PATTERN.exec(blocks.Task);
  const second = SECOND_QUESTION_PATTERN.exec(blocks.Task);
  if (first === null || second === null) {
    throw new Error('the task does not ask both the relative age and the deducibility question');
  }
  const [left, right] = [first[1], first[2]];
  if (!layers.includes(left) || !layers.includes(right)) {
    throw new Error('the compared layers are not part of the stated sequence');
  }
  if (!layers.includes(second[1])) {
    throw new Error('the layer of the deducibility question is not part of the stated sequence');
  }
  return {
    layers,
    dated: [...dated].map(([layer, year]) => ({ layer, year })),
    compared: [left, right],
    askedLayer: second[1],
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function yearOf(slots, layer) {
  const entry = slots.dated.find((item) => item.layer === layer);
  return entry === undefined ? null : entry.year;
}

function solve(slots) {
  const [left, right] = slots.compared;
  const leftDepth = slots.layers.indexOf(left);
  const rightDepth = slots.layers.indexOf(right);
  if (leftDepth === rightDepth) {
    throw new Error('the task compares a layer with itself, which has no age ordering');
  }
  // The list is top to bottom, so the larger index is the deeper and older layer.
  const older = leftDepth > rightDepth ? left : right;
  const younger = older === left ? right : left;
  if (yearOf(slots, slots.askedLayer) !== null) {
    throw new Error(`Layer ${slots.askedLayer} carries a dated object, so the source's verdict for this variant is not stated`);
  }
  return {
    older,
    younger,
    askedLayer: slots.askedLayer,
    dated: slots.dated,
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const main = `Layer ${solution.older} is older than Layer ${solution.younger}. The exact deposition year of Layer ${solution.askedLayer} cannot be deduced.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'const left = slots.compared[0];',
  'const right = slots.compared[1];',
  'const leftDepth = slots.layers.indexOf(left);',
  'const rightDepth = slots.layers.indexOf(right);',
  'const aged = slots.dated || [];',
  'const asksForYear = aged.some((item) => item.layer === slots.askedLayer);',
  'const older = leftDepth > rightDepth ? left : right;',
  'const younger = older === left ? right : left;',
  'const main = "Layer " + older + " is older than Layer " + younger + ". The exact deposition year of Layer " + slots.askedLayer + " cannot be deduced.";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The sequence from top to bottom is ${slots.layers.join(', ')}, so a lower layer was deposited earlier than every layer above it.`,
    `Layer ${solution.older} lies below Layer ${solution.younger}, so Layer ${solution.older} is the older of the two by the stratigraphic rule alone.`,
    slots.dated.length === 0
      ? 'No dated object is stated at all, so no numeric constraint on a layer is available.'
      : `The dated objects constrain only their own layers (${slots.dated.map((item) => `${item.layer} at ${item.year}`).join(', ')}), and none of them is stated for Layer ${solution.askedLayer}.`,
    `Because there is no dated object and no deposition year for Layer ${solution.askedLayer}, only its relative position is justified, so its exact deposition year cannot be deduced.`
  ];
}

function caseFor(grade) {
  const template = `Layers and dating objects (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'H8';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
