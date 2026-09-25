/**
 * Family N7 of the world seed book: natural risk as hazard, exposure, protection.
 *
 * Every problem states the classroom formula `risk index = hazard × exposure ÷
 * protection` for three named sites and asks for the index of each site and for
 * the site with the lowest modeled risk. The stated values change from grade to
 * grade (and so does the verdict), but the algorithm does not: evaluate the
 * printed formula per site, print each value with two decimals in printed
 * order, then report the first site attaining the minimum.
 *
 * The four grades share one computation. A grade could append a cross-domain
 * check, so the family carries the shared descriptor through parse, render, and
 * the circuit even though none of the source variants here states one.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const FORMULA = 'risk index = hazard × exposure ÷ protection';
const SITE_PATTERN = /Site ([A-Z]): hazard=(\d+), exposure=(\d+), protection=(\d+)/g;

function riskOf(site) {
  return (site.hazard * site.exposure) / site.protection;
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  if (!facts.includes(FORMULA)) {
    throw new Error('the statement states a different risk formula');
  }
  const sites = [];
  for (const match of facts.matchAll(SITE_PATTERN)) {
    sites.push({
      id: match[1],
      hazard: Number(match[2]),
      exposure: Number(match[3]),
      protection: Number(match[4])
    });
  }
  if (sites.length === 0) {
    throw new Error('the statement lists no site');
  }
  if (sites.some((site) => site.protection === 0)) {
    throw new Error('a protection value of zero makes the risk index undefined');
  }
  return { sites, crossDomain: parseCrossDomain(blocks['Given facts']) };
}

function solve(slots) {
  const rows = slots.sites.map((site) => ({ id: site.id, value: riskOf(site) }));
  let lowest = rows[0];
  for (const row of rows) {
    if (row.value < lowest.value) {
      lowest = row;
    }
  }
  return { rows, lowest: lowest.id, crossDomain: slots.crossDomain };
}

function render(solution) {
  const values = solution.rows.map((row) => `${row.id}=${row.value.toFixed(2)}`).join('; ');
  const main = `${values}. Lowest: Site ${solution.lowest}.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'const rows = slots.sites.map((site) => ({ id: site.id, value: (site.hazard * site.exposure) / site.protection }));',
  'let lowest = rows[0];',
  'for (const row of rows) {',
  '  if (row.value < lowest.value) {',
  '    lowest = row;',
  '  }',
  '}',
  'const values = rows.map((row) => row.id + "=" + row.value.toFixed(2)).join("; ");',
  'const main = values + ". Lowest: Site " + lowest.id + ".";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The stated model gives each site a risk index of hazard × exposure ÷ protection, so the three values are computed independently.`,
    `The indices in printed order are ${solution.rows.map((row) => `${row.id}=${row.value.toFixed(2)}`).join(', ')}.`,
    `The smallest of those indices belongs to Site ${solution.lowest}, which is therefore the lowest-risk site.`,
    'A larger hazard value alone does not decide the answer; the exposure and protection values are divided into the product as well.'
  ];
}

function caseFor(grade) {
  const template = `Natural risk: hazard, exposure, protection (grade ${grade})`;
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

export const unit = 'N7';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
