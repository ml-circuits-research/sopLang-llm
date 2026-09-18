/**
 * Section 74 of the logical-reasoning book: a slope with no steps.
 *
 * Every case records a letter that allows one listed extra visitor and then
 * declares the charter dead by winter, a note that no mechanism for the chain
 * is written, and three commentators: one who treats the winter-death as
 * forced, one who asks for the steps, and one who claims fear is itself a
 * mechanism. The case data changes the place and the three commentators; the
 * reasoning is fixed: the slide is asserted rather than built, because the page
 * names no step of the chain.
 *
 * The family reads whether a mechanism is written, counts the step connectors
 * the page actually prints, and renders the printed verdict.
 */

import { slugify } from '../../naming.mjs';

const SLOPE_PATTERN =
  /^Letter in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): “If we allow ([^”]+), ([^”]+)\.” (No|A) mechanism for the chain is written\. ([A-Z][a-z]+) treats (the [a-z-]+) as forced\. ([A-Z][a-z]+) asks for the steps\. ([A-Z][a-z]+) says fear is itself a mechanism\./;

const STEP_PATTERN = /\b(?:then|next|after that|whereupon|followed by)\b/gi;

function parse(statement) {
  const letter = SLOPE_PATTERN.exec(statement);
  if (letter === null) {
    throw new Error('the statement does not record the letter, the missing mechanism, and the three commentators');
  }
  return {
    place: letter[1],
    admitted: letter[2],
    consequence: letter[3],
    mechanismWritten: letter[4] === 'A',
    claimant: letter[5],
    escalation: letter[6],
    critic: letter[7],
    sloganeer: letter[8],
    chainSteps: (statement.match(STEP_PATTERN) ?? []).length
  };
}

/**
 * A slope is an argument only when the page supplies the engine: a written
 * mechanism, or at least two printed links between the allowed exception and
 * the stated consequence. Here the note says that no mechanism is written and
 * the page prints no linking step, so the chain is not present.
 */
function solve(slots) {
  const chainPresent = slots.mechanismWritten || slots.chainSteps >= 2;
  return {
    place: slots.place,
    claimant: slots.claimant,
    admitted: slots.admitted,
    consequence: slots.consequence,
    mechanismWritten: slots.mechanismWritten,
    chainSteps: slots.chainSteps,
    chainPresent
  };
}

function render(solution) {
  const verdict = solution.chainPresent ? 'Yes' : 'No';
  return `${verdict}. A slope was asserted, not built. Fear can be real and still not be a step-by-step engine.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place that writes the letter");',
  'probe(typeof slots.admitted === "string" && slots.admitted.length > 0, "the case must name the exception the letter allows");',
  'probe(typeof slots.consequence === "string" && slots.consequence.length > 0, "the case must state the consequence the letter asserts");',
  'probe(slots.mechanismWritten === false, "the case must record that no mechanism for the chain is written");',
  'probe(Number.isInteger(slots.chainSteps) && slots.chainSteps === 0, "the page must print no linking step of the chain");',
  'const chainPresent = slots.mechanismWritten || slots.chainSteps >= 2;',
  'probe(chainPresent === false, "an asserted slide with no written step is not a chain");',
  'const verdict = chainPresent ? "Yes" : "No";',
  'return verdict + ". A slope was asserted, not built. Fear can be real and still not be a step-by-step engine.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The letter in ${slots.place} allows ${slots.admitted} and then asserts that ${slots.consequence}.`,
    `The page states that no mechanism for the chain is written and prints ${solution.chainSteps} linking steps, so the jump is an assertion rather than a deduction.`,
    `${slots.claimant} treats the consequence as forced, but a slope needs a written engine or a record of such slides.`,
    `Fear is real and still not a step, so the chain is ${solution.chainPresent ? '' : 'not '}present.`
  ];
}

export const unit = 74;

export const cases = [
  {
    template: 'A slope with no steps',
    type: slugify('A slope with no steps'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
