/**
 * Family G6 of the world seed book: choosing a settlement site.
 *
 * Every problem scores four candidate sites on water, road access, flood-zone
 * and farmland. A site is valid only when it satisfies the mandatory
 * conditions — water, road access, and not inside the flood zone — and among
 * the valid sites the highest farmland score wins, with the printed order
 * breaking ties.
 *
 * Every problem also appends a smaller second problem (a map-scale distance, a
 * clock finish time, a quorum, or a count of non-duplicate reports; grade 2 and
 * up sometimes add a map-sheet count as well). Its arithmetic is the shared
 * `parseCrossDomain`/`renderCrossDomain` pair, so the family and the circuit
 * render the exact printed suffix from one descriptor.
 *
 * The four grades share one computation: they differ in the stated scores and
 * in which appended checks are printed.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const SITE_PATTERN = /Site ([A-Za-z0-9]+): water=(yes|no), road=(yes|no), flood-zone=(yes|no), nearby farmland score=(\d+)/g;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const sites = [];
  for (const match of facts.matchAll(SITE_PATTERN)) {
    sites.push({
      id: match[1],
      water: match[2] === 'yes',
      road: match[3] === 'yes',
      floodZone: match[4] === 'yes',
      farmland: Number(match[5])
    });
  }
  if (sites.length === 0) {
    throw new Error('the statement describes no candidate site');
  }
  return {
    sites,
    requiresWater: /must have water/.test(blocks.Rules),
    requiresRoad: /road access/.test(blocks.Rules),
    forbidsFloodZone: /must not be in the flood zone/.test(blocks.Rules),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function isValid(site, slots) {
  return (!slots.requiresWater || site.water)
    && (!slots.requiresRoad || site.road)
    && (!slots.forbidsFloodZone || !site.floodZone);
}

function solve(slots) {
  const valid = slots.sites.filter((site) => isValid(site, slots));
  if (valid.length === 0) {
    throw new Error('no candidate site satisfies the mandatory conditions');
  }
  let best = valid[0];
  for (const site of valid.slice(1)) {
    if (site.farmland > best.farmland) {
      best = site;
    }
  }
  return { id: best.id, farmland: best.farmland, validCount: valid.length, crossDomain: slots.crossDomain };
}

function render(solution) {
  const main = `Site ${solution.id}.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Array.isArray(slots.sites) && slots.sites.length > 0, "the statement must describe at least one candidate site");',
  'const valid = slots.sites.filter((site) => (!slots.requiresWater || site.water) && (!slots.requiresRoad || site.road) && (!slots.forbidsFloodZone || !site.floodZone));',
  'probe(valid.length > 0, "at least one candidate site must satisfy the mandatory conditions");',
  'let best = valid[0];',
  'for (const site of valid.slice(1)) {',
  '  if (site.farmland > best.farmland) {',
  '    best = site;',
  '  }',
  '}',
  'probe(valid.every((site) => Number.isInteger(site.farmland) && site.farmland >= 0), "every farmland score must be a non-negative integer");',
  'const main = "Site " + best.id + ".";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const mandatory = [];
  if (slots.requiresWater) {
    mandatory.push('water');
  }
  if (slots.requiresRoad) {
    mandatory.push('road access');
  }
  if (slots.forbidsFloodZone) {
    mandatory.push('a location outside the flood zone');
  }
  const lines = [
    `The mandatory conditions are ${mandatory.join(', ')}, so a site that fails any of them is disqualified before the preference is read.`,
    `Filtering the ${slots.sites.length} candidate sites leaves ${solution.validCount} valid site(s), and the highest farmland score among them is ${solution.farmland}, on Site ${solution.id}.`,
    'The preference is applied only to the valid sites, so a disqualified site with a higher score cannot win.'
  ];
  if (solution.crossDomain !== null) {
    lines.push('The appended check is a separate arithmetic step and does not change the selected site.');
  }
  return lines;
}

function caseFor(grade) {
  const template = `Choosing a settlement site (grade ${grade})`;
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

export const unit = 'G6';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
