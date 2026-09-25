/**
 * Form 32 of the scientific-reasoning book: counterexample and falsification of
 * a rule.
 *
 * Every variant prints a table of five labelled observations, each carrying a
 * list of properties, and a peer's universal claim "any case with the property
 * X also has the property Y". The claim is refuted by the first observation of
 * the table that has X and lacks Y, and the printed answer names that
 * observation exactly as the table labels it.
 *
 * The variants differ in the world's vocabulary and in the two properties the
 * claim links, not in the refutation, so one family covers all twenty-five of
 * them.
 */

import { slugify } from '../../naming.mjs';

function parse(statement) {
  const problemData = /Problem data\.\s*([\s\S]*?)(?=\n\nQuestion\.)/.exec(statement);
  if (problemData === null) {
    throw new Error('the statement does not state the observations and the claim');
  }
  const table = /The table of observations is: ([\s\S]*?)A peer states:/.exec(problemData[1]);
  const claim = /case with the property “([^”]+)” also has the property “([^”]+)”/.exec(problemData[1]);
  if (table === null || claim === null) {
    throw new Error('the statement does not state the observations and the claim');
  }
  const observations = [];
  for (const entry of table[1].replace(/\.\s*$/, '').split('; ')) {
    const match = /^(.+ [A-Z]): (.*)$/.exec(entry.trim());
    if (match === null) {
      throw new Error(`the observation "${entry.trim()}" is not a labelled row of the table`);
    }
    observations.push({ label: match[1], properties: match[2].split(', ') });
  }
  if (observations.length === 0) {
    throw new Error('the statement lists no observation');
  }
  return { observations, subject: claim[1], required: claim[2] };
}

/**
 * The first observation of the table that carries the property the claim
 * requires and omits the property the claim promises. One such row is enough
 * to falsify a universal claim.
 */
function solve(slots) {
  const counterexample = slots.observations.find(
    (observation) =>
      observation.properties.includes(slots.subject) && !observation.properties.includes(slots.required)
  );
  if (counterexample === undefined) {
    throw new Error(`no observation has "${slots.subject}" without "${slots.required}"`);
  }
  return { label: counterexample.label };
}

function render(solution) {
  return `The statement is false. Counterexample: ${solution.label}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'for (const observation of slots.observations) {',
  '}',
  'const counterexample = slots.observations.find((observation) => observation.properties.indexOf(slots.subject) !== -1 && observation.properties.indexOf(slots.required) === -1);',
  'probe(counterexample !== undefined, "the data must contain one observation that refutes the universal claim");',
  'return "The statement is false. Counterexample: " + counterexample.label + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The claim has the form "every case with ${slots.subject} also has ${slots.required}", so the cases that can refute it are the ones carrying ${slots.subject}.`,
    `The observation ${solution.label} carries ${slots.subject} but does not carry ${slots.required}.`,
    'One case of that shape makes the universal statement false, and the printed counterexample is the first such row of the table.',
    'Refuting the claim only shows that the proposed rule fails; it does not prove the opposite rule either.'
  ];
}

export const unit = 32;

export const cases = [
  {
    template: 'Counterexample and falsification of a rule',
    type: slugify('Counterexample and falsification of a rule'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
