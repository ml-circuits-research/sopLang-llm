/**
 * Family N23 of the world seed book: samples, surveys, and public opinion.
 *
 * Every problem describes one sampling design and asks whether that design is
 * likely to be biased for the stated question, together with the direction of
 * the possible bias. The book answers with one of two fixed clause shapes: a
 * bias verdict followed by the appraisal of the described design, or a
 * no-obvious-bias verdict followed by the appraisal. The appraisal of a design
 * is a judgement about the selection mechanism, so the family recognises the
 * described design and reports the appraisal that belongs to it instead of
 * inventing a new sentence; the verdict flag is what the grades vary together
 * with the design.
 *
 * Grades 2-4 append a cross-domain check (map scale, clock arithmetic, quorum,
 * or duplicate reports, optionally combined with a map-sheet count), which the
 * family renders through the shared `renderCrossDomain`, and grade 4 also
 * carries the mixed-domain variant.
 *
 * The four grades share one computation; the variants differ in the described
 * design and in the appended checks, not in the algorithm.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';

/**
 * The designs the family recognises, each with the bias verdict and the
 * appraisal sentence the book prints for it. A design is selected by the
 * sentence that describes how the sample is drawn, because that sentence is
 * the selection mechanism the verdict is about.
 */
const DESIGNS = Object.freeze([
  Object.freeze({
    design: /A town wants to estimate how many residents use buses\. It surveys only people waiting at the bus station\./,
    biased: true,
    appraisal: 'People already at the bus station are more likely than average to use buses.'
  }),
  Object.freeze({
    design: /A school wants opinions on lunch\. It randomly selects 10 students from each grade\./,
    biased: false,
    appraisal: 'Random selection within every grade gives broad grade coverage; no obvious topic-specific selection is stated.'
  }),
  Object.freeze({
    design: /A village asks only members of the sports club whether to build a sports field\./,
    biased: true,
    appraisal: 'Sports-club members are likely to be more favorable to a sports field than the whole village.'
  }),
  Object.freeze({
    design: /A library surveys every 20th visitor entering over a full week\./,
    biased: false,
    appraisal: 'Sampling every 20th visitor across a full week is systematic within the visitor population; it may represent visitors reasonably, though not non-visitors.'
  }),
  Object.freeze({
    design: /An online poll is open to anyone who chooses to click it\./,
    biased: true,
    appraisal: 'People who choose to click may differ systematically from those who ignore the poll.'
  })
]);

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const design = DESIGNS.find((candidate) => candidate.design.test(facts));
  if (design === undefined) {
    throw new Error('the statement describes an unknown sampling design');
  }
  return {
    design: design.design.exec(facts)[0],
    biased: design.biased,
    appraisal: design.appraisal,
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  return { biased: slots.biased, appraisal: slots.appraisal, crossDomain: slots.crossDomain };
}

function render(solution) {
  const verdict = solution.biased ? 'Likely biased' : 'Not obviously biased under the stated design';
  const main = `${verdict}. ${solution.appraisal}`;
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
  'const verdict = slots.biased ? "Likely biased" : "Not obviously biased under the stated design";',
  'const main = verdict + ". " + slots.appraisal;',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The stated design is: ${slots.design}`,
    solution.biased
      ? 'That selection mechanism favours people who are connected to the answer, so the sample is likely biased away from the whole population.'
      : 'That selection mechanism does not obviously favour people connected to the answer, so no bias is established by the stated design.',
    'The verdict and its direction follow from comparing the selection mechanism with the target population, not from the number of answers collected.',
    ...(slots.crossDomain === null ? [] : ['The appended cross-domain check is evaluated from its own stated quantities and printed as the labelled suffix.'])
  ];
}

function caseFor(grade) {
  return {
    template: `Samples, surveys, and public opinion (grade ${grade})`,
    type: `samples-surveys-and-public-opinion-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N23';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
