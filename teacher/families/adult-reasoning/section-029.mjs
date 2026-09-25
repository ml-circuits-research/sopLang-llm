/**
 * Section 29 of the adult-reasoning course: portions, meals, and equivalents.
 *
 * Every variant posts the same canteen portion guide (a side of 180 g, a
 * protein of 120 g, a bread slice of 30 g, the standard lunch as 1+1+1, doubling
 * only on the protein for +8, and the scale as the authority) and one tray whose
 * protein matches the guide while the side and the bread exceed it. The tray's
 * owner calls it “one and a half meals” and asks for the standard price. The
 * verdict reports the excess of each line in grams and states that the phrase
 * “a half” is not defined by the guide. The variants change the canteen place
 * and the person; the tray weights are parsed from the statement.
 */

import { slugify } from '../../naming.mjs';

const GUIDE_PATTERN =
  /Portion guide, canteen ([^:]+): “Side (\d+) g cooked\. Protein (\d+) g cooked\. Bread slice (\d+) g\. Standard lunch = 1\+1\+1\. Doubling only on protein, \+(\d+)\. The scale is the authority\.”/;
const TRAY_PATTERN =
  /([A-Z][a-z]+)’s tray: (\d+) g protein, (\d+) g side, (\d+) slices\. \1: “([^”]+)”, wants the standard price\./;

function parse(statement) {
  const guide = GUIDE_PATTERN.exec(statement);
  const tray = TRAY_PATTERN.exec(statement);
  if (guide === null || tray === null) {
    throw new Error('the statement does not describe the portion guide and the tray');
  }
  const claim = tray[5].replace(/^it[’']s\s+/i, '').trim();
  return {
    place: guide[1].trim(),
    sideStandard: Number(guide[2]),
    proteinStandard: Number(guide[3]),
    breadSlice: Number(guide[4]),
    doublingSurcharge: Number(guide[5]),
    person: tray[1],
    protein: Number(tray[2]),
    side: Number(tray[3]),
    slices: Number(tray[4]),
    claim
  };
}

function solve(slots) {
  const lines = [];
  const proteinExcess = slots.protein - slots.proteinStandard;
  lines.push(proteinExcess > 0 ? `protein +${proteinExcess} g` : 'Protein fine');
  const sideExcess = slots.side - slots.sideStandard;
  lines.push(sideExcess > 0 ? `side +${sideExcess} g` : 'side fine');
  const breadExcess = (slots.slices - 1) * slots.breadSlice;
  lines.push(breadExcess > 0 ? `bread +${breadExcess} g` : 'bread fine');
  const label = `${slots.claim.charAt(0).toUpperCase()}${slots.claim.slice(1)}`;
  return { lines, label };
}

function render(solution) {
  return `${solution.lines.join('; ')}. “${solution.label}” is not defined.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const lines = [];',
  'const proteinExcess = slots.protein - slots.proteinStandard;',
  'lines.push(proteinExcess > 0 ? "protein +" + proteinExcess + " g" : "Protein fine");',
  'const sideExcess = slots.side - slots.sideStandard;',
  'lines.push(sideExcess > 0 ? "side +" + sideExcess + " g" : "side fine");',
  'const breadExcess = (slots.slices - 1) * slots.breadSlice;',
  'lines.push(breadExcess > 0 ? "bread +" + breadExcess + " g" : "bread fine");',
  'const label = slots.claim.charAt(0).toUpperCase() + slots.claim.slice(1);',
  'return lines.join("; ") + ". “" + label + "” is not defined.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The guide at the canteen in ${slots.place} fixes one side at ${slots.sideStandard} g, one protein at ${slots.proteinStandard} g, and one slice at ${slots.breadSlice} g for the standard lunch of 1+1+1.`,
    `${slots.person}'s tray carries ${slots.protein} g of protein, which is within the guide, but ${slots.side} g of side is ${slots.side - slots.sideStandard} g over and ${slots.slices} slices are ${(slots.slices - 1) * slots.breadSlice} g over.`,
    `The guide's only doubling is on the protein at +${slots.doublingSurcharge}, and it gives no unit called “${slots.claim}”, so the claim to the standard price has nothing to stand on.`,
    `The scale, not the eye, is the authority, and on the scale the tray is over on two of its three lines.`
  ];
}

export const unit = 29;

export const cases = [
  {
    template: 'Portions, meals, and equivalents',
    type: slugify('Portions, meals, and equivalents'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
