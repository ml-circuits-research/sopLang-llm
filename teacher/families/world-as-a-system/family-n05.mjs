/**
 * Family N5 of the world seed book: density, capacity, and crowding.
 *
 * Every problem states a park zone with its area in hectares, its current
 * number of visitors, and the stated comfortable density in visitors per
 * hectare, and asks for the visitor density plus whether the zone is above the
 * comfortable capacity. The density is the number of visitors divided by the
 * area, the zone exceeds capacity when that density is strictly greater than
 * the stated threshold, and the printed density is rounded to two decimals
 * (the source rounds a half to the even last digit, as the case 41/8 = 5.125
 * printed as 5.12 shows).
 *
 * All four grades share one computation; the grades differ in the stated area,
 * the stated number of visitors, and the stated threshold, never in the
 * algorithm.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';

const ZONE_PATTERN =
  /A park zone covers (\d+(?:\.\d+)?) hectares and currently has (\d+) visitors\. For this exercise, comfortable density is at most (\d+(?:\.\d+)?) visitors per hectare/;

/**
 * The visitors-per-hectare density rounded to two decimals with a half going
 * to the even last digit. The rounding is done on the exact fraction
 * `visitors * 100 / area` in integer arithmetic, so the last printed digit
 * never depends on a binary floating-point representation.
 */
function densityText(visitors, area) {
  const scaled = visitors * 100;
  const quotient = Math.floor(scaled / area);
  const remainder = scaled - quotient * area;
  const twice = remainder * 2;
  const rounded = twice > area ? quotient + 1 : twice < area ? quotient : quotient % 2 === 0 ? quotient : quotient + 1;
  return `${Math.floor(rounded / 100)}.${String(rounded % 100).padStart(2, '0')}`;
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const zone = ZONE_PATTERN.exec(facts);
  if (zone === null) {
    throw new Error('the statement does not state the area, the visitors, and the comfortable density');
  }
  return {
    area: Number(zone[1]),
    visitors: Number(zone[2]),
    threshold: Number(zone[3]),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  return {
    density: densityText(slots.visitors, slots.area),
    above: slots.visitors > slots.threshold * slots.area,
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const main = `${solution.density} visitors/hectare; ${solution.above ? 'above' : 'within'} capacity.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'const densityText = (visitors, area) => {',
  '  const scaled = visitors * 100;',
  '  const quotient = Math.floor(scaled / area);',
  '  const remainder = scaled - quotient * area;',
  '  const twice = remainder * 2;',
  '  const rounded = twice > area ? quotient + 1 : twice < area ? quotient : quotient % 2 === 0 ? quotient : quotient + 1;',
  '  return String(Math.floor(rounded / 100)) + "." + String(rounded % 100).padStart(2, "0");',
  '};',
  'const above = slots.visitors > slots.threshold * slots.area;',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'const main = densityText(slots.visitors, slots.area) + " visitors/hectare; " + (above ? "above" : "within") + " capacity.";',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The density is the number of visitors divided by the area: ${slots.visitors} / ${slots.area} = ${solution.density} visitors/hectare.`,
    `Comparing that density with the stated comfortable capacity of ${slots.threshold} visitors per hectare settles the verdict.`,
    solution.above
      ? 'The density is greater than the threshold, so the zone is above the comfortable capacity.'
      : 'The density is at most the threshold, so the zone stays within the comfortable capacity.'
  ];
}

function caseFor(grade) {
  return {
    template: `Density, capacity, and crowding (grade ${grade})`,
    type: `density-capacity-and-crowding-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N5';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
