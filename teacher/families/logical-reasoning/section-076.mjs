/**
 * Section 76 of the logical-reasoning book: going in a circle.
 *
 * Every case records a preface in a named place whose sentence gives a reason
 * for itself — the handbook is reliable because it says it is reliable — and
 * three commentators: one who treats that as support, one who says the
 * conclusion was used as a premise, and one who claims self-praise is the
 * strongest proof because it comes from inside. The case data changes the place
 * and the three commentators; the reasoning is fixed: the ground restates the
 * claim, so no independent support stands on the page.
 *
 * The family splits the quoted sentence into its claim and its stated ground
 * and checks whether the ground leans on the claim's own term.
 */

import { slugify } from '../../naming.mjs';

const CIRCLE_PATTERN =
  /^Preface in a ([A-Z][a-z]+(?: [A-Z][a-z]+)*) handbook: “([^”]+)” ([A-Z][a-z]+) treats that as support\. ([A-Z][a-z]+) says the conclusion was used as a premise\. ([A-Z][a-z]+) says self-praise is the strongest proof because it comes from inside\./;

const SUPPORT_PATTERN = /^(.+?) because (.+)$/;

function parse(statement) {
  const preface = CIRCLE_PATTERN.exec(statement);
  if (preface === null) {
    throw new Error('the statement does not record the self-supporting sentence and the three commentators');
  }
  const support = SUPPORT_PATTERN.exec(preface[2]);
  if (support === null) {
    throw new Error('the quoted sentence does not give a ground for its claim');
  }
  const conclusion = support[1];
  const ground = support[2];
  const claimTerm = conclusion.split(' ').pop();
  const restates = ground.includes(claimTerm);
  return {
    place: preface[1],
    conclusion,
    ground,
    claimTerm,
    restates,
    believer: preface[3],
    critic: preface[4],
    sloganeer: preface[5]
  };
}

/**
 * Support must come from something else, or from a method. The ground here is
 * the claim's own term in a second coat, so the sentence leans on itself and
 * there is no independent support on the page.
 */
function solve(slots) {
  return {
    place: slots.place,
    conclusion: slots.conclusion,
    restates: slots.restates,
    independentSupport: slots.restates === false
  };
}

function render(solution) {
  const verdict = solution.independentSupport ? 'Yes' : 'No';
  return `${verdict}. The sentence leans on itself. That is a circle, not a second source.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const restates = slots.ground.includes(slots.claimTerm);',
  'probe(restates === true, "the stated ground must hand the claim back as its own reason");',
  'const independentSupport = restates === false;',
  'const verdict = independentSupport ? "Yes" : "No";',
  'return verdict + ". The sentence leans on itself. That is a circle, not a second source.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The preface in ${slots.place} claims that ${slots.conclusion.toLowerCase()}.`,
    `Its stated ground is “${slots.ground}”, which hands the claim back instead of supporting it.`,
    `${slots.critic} names the defect: the conclusion was used as a premise, so the page offers one sentence in two coats.`,
    `Self-praise comes from inside, so it is not a second source and the page has ${solution.independentSupport ? '' : 'no '}independent support.`
  ];
}

export const unit = 76;

export const cases = [
  {
    template: 'Going in a circle',
    type: slugify('Going in a circle'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
