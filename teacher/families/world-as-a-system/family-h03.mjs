/**
 * Family H3 of the world seed book: sources and supported claims.
 *
 * Every problem names one source, states what that source directly shows, and
 * confronts it with two claims: the first repeats the recorded content and the
 * second asserts something far broader that the source does not measure. The
 * printed verdict names the claim the source directly supports and refuses the
 * other one, and it is derived here by matching the claims against the printed
 * evidence sentence rather than by assuming that C1 is always the supported
 * claim.
 *
 * The four grades differ only in the named source and in the appended
 * cross-domain check (grades 1-4 of this family carry one on some variants, and
 * grade 3 also carries the mixed-domain map-sheet count), so they share one
 * parse, solve, render, and compute.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const SOURCE_PATTERN = /A historian has one source: (.+?)\./;
const EVIDENCE_PATTERN = /The source directly shows that (.+?)\./;
const CLAIMS_PATTERN = /A student proposes two claims: C1: (.+?); C2: (.+?)\./;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const source = SOURCE_PATTERN.exec(facts);
  const evidence = EVIDENCE_PATTERN.exec(facts);
  const claims = CLAIMS_PATTERN.exec(facts);
  if (source === null || evidence === null || claims === null) {
    throw new Error('the statement does not name a source, its direct content, and two claims');
  }
  return {
    source: source[1],
    evidence: evidence[1],
    claims: [claims[1], claims[2]],
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function sameContent(left, right) {
  return String(left).toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim()
    === String(right).toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
}

function solve(slots) {
  const supported = slots.claims.findIndex((claim) => sameContent(claim, slots.evidence));
  if (supported === -1) {
    throw new Error('neither claim repeats what the source directly shows');
  }
  return {
    supported,
    unsupported: supported === 0 ? 1 : 0,
    source: slots.source,
    evidence: slots.evidence,
    claims: slots.claims,
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const main = `C${solution.supported + 1} is supported. C${solution.unsupported + 1} is not justified by the source alone.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Array.isArray(slots.claims) && slots.claims.length === 2, "the statement must propose exactly two claims");',
  'probe(typeof slots.evidence === "string" && slots.evidence.length > 0, "the statement must say what the source directly shows");',
  'const sameContent = (left, right) => String(left).toLowerCase().replace(/[.]/g, "").replace(/\\s+/g, " ").trim() === String(right).toLowerCase().replace(/[.]/g, "").replace(/\\s+/g, " ").trim();',
  'const supported = slots.claims.findIndex((claim) => sameContent(claim, slots.evidence));',
  'probe(supported !== -1, "one of the two claims must be the content the source directly shows");',
  'probe(typeof slots.source === "string" && slots.source.length > 0, "the source itself must be named");',
  'const main = "C" + (supported + 1) + " is supported. C" + (supported === 0 ? 2 : 1) + " is not justified by the source alone.";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The source is ${slots.source}, and it directly shows that ${solution.evidence}.`,
    `Claim C${solution.supported + 1} repeats exactly that recorded content, so the evidence entails it.`,
    `Claim C${solution.unsupported + 1} asserts "${solution.claims[solution.unsupported]}", which nothing in the source measures; absence of evidence for a broad claim is not proof of it.`,
    `The verdict is therefore that C${solution.supported + 1} is supported and C${solution.unsupported + 1} is not established by this source alone.`
  ];
}

function caseFor(grade) {
  const template = `Sources and supported claims (grade ${grade})`;
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

export const unit = 'H3';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
