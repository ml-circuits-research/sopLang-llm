/**
 * Family N18 of the world seed book: public goods and common contributions.
 *
 * Every problem states a provision threshold in tokens and the voluntary
 * contributions of the households. The project is produced exactly when the
 * summed contributions reach the threshold, and the second clause of the answer
 * states the shortfall: the additional tokens still needed, which is zero once
 * the threshold is met. The threshold decides production only; it does not
 * judge whether a contribution pattern is fair.
 *
 * The four grades share one computation: the variants differ in the number of
 * households, the threshold, and the appended cross-domain (and mixed-domain)
 * check, which the shared helper renders as the labelled answer suffix.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const THRESHOLD_PATTERN = /reach (\d+) tokens/;
const CONTRIBUTIONS_PATTERN = /Contributions from (\d+) households are \[([^\]]+)\]/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const threshold = THRESHOLD_PATTERN.exec(facts);
  const contributions = CONTRIBUTIONS_PATTERN.exec(facts);
  if (threshold === null) {
    throw new Error('the statement does not state a provision threshold in tokens');
  }
  if (contributions === null) {
    throw new Error('the statement does not list the household contributions');
  }
  return {
    threshold: Number(threshold[1]),
    households: Number(contributions[1]),
    contributions: contributions[2].split(',').map((value) => Number(value.trim())),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  if (slots.contributions.length === 0) {
    throw new Error('the statement lists no contribution');
  }
  if (slots.contributions.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new Error('a contribution must be a non-negative number');
  }
  const total = slots.contributions.reduce((sum, value) => sum + value, 0);
  return {
    total,
    built: total >= slots.threshold,
    additional: Math.max(0, slots.threshold - total),
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const main = `${solution.built ? 'The project is built.' : 'The project is not built.'} Additional tokens needed: ${solution.additional}.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Number.isFinite(slots.threshold) && slots.threshold >= 0, "the statement must state a provision threshold in tokens");',
  'probe(Array.isArray(slots.contributions) && slots.contributions.length > 0, "the statement must list the household contributions");',
  'probe(slots.contributions.length === slots.households, "the listed contributions must match the stated number of households");',
  'probe(slots.contributions.every((value) => Number.isFinite(value) && value >= 0), "a contribution must be a non-negative number");',
  'const total = slots.contributions.reduce((sum, value) => sum + value, 0);',
  'probe(Number.isFinite(total), "the summed contribution must be a finite number");',
  'const built = total >= slots.threshold;',
  'const additional = Math.max(0, slots.threshold - total);',
  'probe(built || additional > 0, "a project short of the threshold must still need tokens");',
  'const main = (built ? "The project is built." : "The project is not built.") + " Additional tokens needed: " + additional + ".";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The provision rule makes the project depend on one aggregate: the voluntary contributions summed against the stated threshold of ${slots.threshold} tokens.`,
    `Adding the ${slots.contributions.length} listed contributions gives ${solution.total}, which is ${solution.built ? 'at least' : 'below'} the threshold, so the project is ${solution.built ? 'built' : 'not built'}.`,
    `The shortfall is the threshold minus the total when that difference is positive and zero otherwise, here ${solution.additional} additional tokens.`,
    'The threshold answers only whether the project is produced; it says nothing by itself about whether the contribution pattern is fair.'
  ];
}

function caseFor(grade) {
  const template = `Public goods and common contributions (grade ${grade})`;
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

export const unit = 'N18';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
