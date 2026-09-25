/**
 * Family N22 of the world seed book: due process, evidence, and the right of
 * reply.
 *
 * Every problem states a conjunctive procedure — a serious penalty requires at
 * least two independent pieces of evidence and a chance to respond — and one of
 * two case shapes: a camera record plus an independent witness (two distinct
 * sources, so the evidence condition is met) with no chance to respond (the
 * right-of-reply condition fails), or two friends repeating one original rumor
 * (one source, so the evidence condition fails) with a chance to respond. The
 * family reads the case facts, evaluates both conditions, and prints the
 * verdict together with the condition that fails.
 *
 * From grade 1 on some problems append a cross-domain check (clock arithmetic,
 * quorum, duplicate reports, or a map scale), and grades 2-4 add a mixed-domain
 * map-sheet count; both are rendered through the shared helper as the labelled
 * answer suffix.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const NUMBER_WORDS = Object.freeze({ one: 1, two: 2, three: 3, four: 4, five: 5 });

const REQUIRED_EVIDENCE_PATTERN = /(\d+|one|two|three|four|five) independent pieces? of evidence/;
const CAMERA_EVIDENCE_PATTERN = /one camera record and one independent witness/;
const SHARED_RUMOUR_PATTERN = /two friends repeating the same rumor/;
const REFUSED_RESPONSE_PATTERN = /was not allowed to respond/;
const GRANTED_RESPONSE_PATTERN = /plus a chance to respond/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const required = REQUIRED_EVIDENCE_PATTERN.exec(facts);
  if (required === null) {
    throw new Error('the statement states no required number of independent pieces of evidence');
  }
  const requiredEvidence = NUMBER_WORDS[required[1]] ?? Number(required[1]);
  const cameraCase = CAMERA_EVIDENCE_PATTERN.test(facts);
  const rumourCase = SHARED_RUMOUR_PATTERN.test(facts);
  if (cameraCase === rumourCase) {
    throw new Error('the case states neither a camera record with an independent witness nor two friends repeating one rumor');
  }
  const responseOpportunity = !REFUSED_RESPONSE_PATTERN.test(facts) && GRANTED_RESPONSE_PATTERN.test(facts);
  return {
    requiredEvidence,
    independentEvidence: cameraCase ? 2 : 1,
    responseOpportunity,
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  const evidenceMet = slots.independentEvidence >= slots.requiredEvidence;
  const responseMet = slots.responseOpportunity;
  return {
    evidenceMet,
    responseMet,
    penaltyAuthorized: evidenceMet && responseMet,
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  let condition;
  if (solution.penaltyAuthorized) {
    condition = 'Both the evidence requirement and the right-to-respond condition are met.';
  } else if (!solution.evidenceMet && !solution.responseMet) {
    condition = 'Both the evidence requirement and the right-to-respond condition are not met.';
  } else if (!solution.evidenceMet) {
    condition = 'The evidence requirement is not met.';
  } else {
    condition = 'The right-to-respond condition is not met.';
  }
  const main = `${solution.penaltyAuthorized ? 'Yes.' : 'No.'} ${condition}`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const WIRES = [
  {
    name: 'cross',
    command: 'jsEval',
    body: [
      CROSS_DOMAIN_SOURCE,
      'const slots = $slots;',
      'return { suffix: renderCrossDomain(slots.crossDomain) };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const slots = $slots;',
  'const evidenceMet = slots.independentEvidence >= slots.requiredEvidence;',
  'const responseMet = slots.responseOpportunity;',
  'const authorized = evidenceMet && responseMet;',
  'let condition;',
  'if (authorized) {',
  '  condition = "Both the evidence requirement and the right-to-respond condition are met.";',
  '} else if (!evidenceMet && !responseMet) {',
  '  condition = "Both the evidence requirement and the right-to-respond condition are not met.";',
  '} else if (!evidenceMet) {',
  '  condition = "The evidence requirement is not met.";',
  '} else {',
  '  condition = "The right-to-respond condition is not met.";',
  '}',
  'probe(!authorized || (evidenceMet && responseMet), "the verdict must follow from the conjunctive procedure");',
  'const main = (authorized ? "Yes." : "No.") + " " + condition;',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  const evidenceLine = solution.evidenceMet
    ? `The case offers ${slots.independentEvidence} independent sources, which reaches the required ${slots.requiredEvidence}, so the evidence condition is met.`
    : `The case offers ${slots.independentEvidence} independent source${slots.independentEvidence === 1 ? '' : 's'}, which falls short of the required ${slots.requiredEvidence}, so the evidence condition fails.`;
  const responseLine = solution.responseMet
    ? 'The student was given a chance to respond, so the right-to-respond condition is met.'
    : 'The student was not allowed to respond, so the right-to-respond condition fails.';
  const verdictLine = solution.penaltyAuthorized
    ? 'Both conditions of the conjunctive procedure hold, so the serious penalty may be imposed.'
    : 'The procedure requires both conditions, so the serious penalty is not authorized.';
  return [evidenceLine, responseLine, verdictLine];
}

function caseFor(grade) {
  const template = `Due process, evidence, and right of reply (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N22';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
