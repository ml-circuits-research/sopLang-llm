/**
 * Family N15 of the world seed book: perspective, interest, and source
 * credibility.
 *
 * Every problem describes three sources that speak about one numerical claim
 * (a proposed market tax). One source is evidence-backed — it states a
 * calculation or a measurement that bears on the claim — one source rests on a
 * secondhand rumor, and one source has an interest in the outcome without
 * offering evidence. The answer names the source that is best positioned for
 * the numerical claim and the source that deserves the most caution about it;
 * a stated interest alone never disqualifies a source.
 *
 * The four grades share one computation: the variants differ only in the
 * appended cross-domain (and mixed-domain) check, which the shared helper
 * renders as the labelled answer suffix.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const SOURCE_PATTERN = /Source ([A-Z]) is ([^.;]+)/g;

/**
 * The role a source plays for a numerical claim, read from the stated
 * description: `secondhand` sources repeat a rumor, `evidence` sources offer a
 * calculation or a measurement, and `interest` sources are parties to the
 * outcome. Interest is deliberately the weakest signal, because the knowledge
 * context states that perspective and interest are not falsity.
 */
const ROLE_TESTS = Object.freeze([
  Object.freeze({ role: 'secondhand', pattern: /rumor|hearsay|second-hand|secondhand|repeating/ }),
  Object.freeze({ role: 'evidence', pattern: /calculation|calculates|estimates|estimating|records|measured|data/ }),
  Object.freeze({ role: 'interest', pattern: /would pay|interest|benefit|profit|argues/ })
]);

function roleOf(description) {
  const text = String(description).toLowerCase();
  for (const test of ROLE_TESTS) {
    if (test.pattern.test(text)) {
      return test.role;
    }
  }
  throw new Error(`the source description "${description}" states no access to the claim`);
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const sources = [];
  for (const match of facts.matchAll(SOURCE_PATTERN)) {
    sources.push({ id: match[1], description: match[2].trim() });
  }
  if (sources.length < 2) {
    throw new Error('the statement describes fewer than two sources');
  }
  return { sources, crossDomain: parseCrossDomain(blocks['Given facts']) };
}

function select(slots) {
  const roles = slots.sources.map((source) => ({ ...source, role: roleOf(source.description) }));
  const best = roles.find((source) => source.role === 'evidence');
  const cautious = roles.find((source) => source.role === 'secondhand');
  if (best === undefined || cautious === undefined) {
    throw new Error('the sources do not separate an evidence-backed source from a secondhand one');
  }
  if (best.id === cautious.id) {
    throw new Error('the best-positioned and the most-cautious source coincide');
  }
  const claim = /estimates?\s+(?:the\s+)?([a-z]+)/.exec(best.description.toLowerCase());
  if (claim === null) {
    throw new Error(`the evidence-backed source ${best.id} names no estimated quantity`);
  }
  return { best, cautious, claim: claim[1] };
}

function solve(slots) {
  const { best, cautious, claim } = select(slots);
  return { best: best.id, cautious: cautious.id, claim, crossDomain: slots.crossDomain };
}

function render(solution) {
  const main =
    `Source ${solution.best} is best positioned for the ${solution.claim} estimate; ` +
    `Source ${solution.cautious} should be treated most cautiously for that numerical claim.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Array.isArray(slots.sources) && slots.sources.length >= 2, "the statement must describe at least two sources");',
  'const roleTests = [',
  '  { role: "secondhand", pattern: /rumor|hearsay|second-hand|secondhand|repeating/ },',
  '  { role: "evidence", pattern: /calculation|calculates|estimates|estimating|records|measured|data/ },',
  '  { role: "interest", pattern: /would pay|interest|benefit|profit|argues/ }',
  '];',
  'const roleOf = (description) => {',
  '  const text = String(description).toLowerCase();',
  '  for (const test of roleTests) {',
  '    if (test.pattern.test(text)) {',
  '      return test.role;',
  '    }',
  '  }',
  '  throw new Error("the source description states no access to the claim: " + description);',
  '};',
  'const roles = slots.sources.map((source) => ({ id: source.id, description: source.description, role: roleOf(source.description) }));',
  'const best = roles.find((source) => source.role === "evidence");',
  'const cautious = roles.find((source) => source.role === "secondhand");',
  'probe(best !== undefined, "one source must offer a calculation for the numerical claim");',
  'probe(cautious !== undefined, "one source must rest on a secondhand rumor");',
  'probe(best.id !== cautious.id, "the best-positioned and the most-cautious source must differ");',
  'const claim = /estimates?\\s+(?:the\\s+)?([a-z]+)/.exec(String(best.description).toLowerCase());',
  'probe(claim !== null, "the evidence-backed source must name the quantity it estimates");',
  'const main = "Source " + best.id + " is best positioned for the " + claim[1] + " estimate; Source " + cautious.id + " should be treated most cautiously for that numerical claim.";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The task asks which source can best support the numerical ${solution.claim} claim and which source deserves the most caution for it.`,
    `Reading the stated roles, Source ${solution.best} is evidence-backed because it estimates the quantity and states its calculation, so it has both relevance and access to the claim.`,
    `Source ${solution.cautious} only repeats a rumor from elsewhere, which is the weakest access to this specific number, so its version of the claim is the one to check first.`,
    `Interest alone does not disqualify a source, so the involved party is not discarded for that reason, but it offers no calculation that bears on the ${solution.claim} estimate.`
  ];
}

function caseFor(grade) {
  const template = `Perspective, interest, and source credibility (grade ${grade})`;
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

export const unit = 'N15';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
