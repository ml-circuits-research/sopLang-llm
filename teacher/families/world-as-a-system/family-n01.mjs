/**
 * Family N1 of the world seed book: scale, proportion, and distance.
 *
 * Every problem states a map scale `1:n` and a measured map distance in
 * centimetres, and asks for the real straight-line distance in kilometres. The
 * real distance is the map length multiplied by the scale denominator, which is
 * the number of real centimetres one map centimetre represents, and one
 * kilometre is 100,000 centimetres. Some variants of grades 2-4 append a
 * cross-domain check, which the family renders as the labelled answer suffix
 * through the shared `renderCrossDomain`.
 *
 * The four grades share one computation; the grade differences live in the
 * stated scale and map distance and in whether a cross-domain check is
 * appended.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';

const SCALE_PATTERN = /map has scale 1:(\d+)/;
const DISTANCE_PATTERN = /map distance between two points is (\d+(?:\.\d+)?) cm/;
const RULE_PATTERN = /1 cm on the map represents (\d+(?:\.\d+)?) cm in reality/;
const CENTIMETRES_PER_KILOMETRE = 100000;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const scale = SCALE_PATTERN.exec(facts);
  const distance = DISTANCE_PATTERN.exec(facts);
  if (scale === null || distance === null) {
    throw new Error('the statement states no map scale or no measured map distance');
  }
  const rule = RULE_PATTERN.exec(facts);
  if (rule !== null && Number(rule[1]) !== Number(scale[1])) {
    throw new Error(`the scale 1:${scale[1]} contradicts the stated rule that 1 cm represents ${rule[1]} cm`);
  }
  return {
    denominator: Number(scale[1]),
    mapCentimetres: Number(distance[1]),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

/** The printed kilometre value without binary-floating-point noise. */
function formatKilometres(kilometres) {
  return String(Number(kilometres.toFixed(4)));
}

function solve(slots) {
  if (slots.denominator <= 0) {
    throw new Error('a map scale denominator must be positive');
  }
  const realCentimetres = slots.mapCentimetres * slots.denominator;
  return {
    realCentimetres,
    kilometres: formatKilometres(realCentimetres / CENTIMETRES_PER_KILOMETRE),
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const main = `${solution.kilometres} km.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Number.isFinite(slots.denominator) && slots.denominator > 0, "the statement must state a positive scale denominator");',
  'probe(Number.isFinite(slots.mapCentimetres) && slots.mapCentimetres > 0, "the statement must state a positive map distance");',
  'const realCentimetres = slots.mapCentimetres * slots.denominator;',
  'probe(realCentimetres > 0, "the real distance must be positive because the scale is a ratio, not an added distance");',
  'const kilometres = String(Number((realCentimetres / 100000).toFixed(4)));',
  'const main = kilometres + " km.";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The scale 1:${slots.denominator} means that one centimetre on the map represents ${slots.denominator} centimetres in reality.`,
    `Multiplying the measured ${slots.mapCentimetres} cm by ${slots.denominator} gives ${solution.realCentimetres} real centimetres.`,
    `Dividing ${solution.realCentimetres} cm by 100,000 cm per kilometre gives ${solution.kilometres} km, and a scale is a ratio rather than an added distance.`
  ];
}

function caseFor(grade) {
  return {
    template: `Scale, proportion, and distance (grade ${grade})`,
    type: `scale-proportion-and-distance-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N1';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
