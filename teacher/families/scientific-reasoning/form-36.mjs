/**
 * Form 36 of the scientific-reasoning book: structural analogy between systems.
 *
 * Every variant states a four-step functional chain of a natural system ("…”
 * prepares “…”, which allows “…”, which in turn produces or prepares “…”) and a
 * completely artificial system whose four roles are the Source, the Preparation
 * Station, the Channel, and the Collector. The printed answer maps the four
 * chain steps onto those four roles in order and names the preserved property:
 * the order of the relationships and the causal/functional roles, not the
 * material or the shape of the components.
 *
 * The variants differ in the world's vocabulary, not in the correspondence, so
 * one family covers all twenty-five of them. The source prints two of its
 * answers with a space on both sides of the correspondence arrow, and prints
 * one subject in a plural form its statement states in the singular; the family
 * reproduces the printed wording, because the statement carries neither.
 */

import { slugify } from '../../naming.mjs';

const CHAIN_PATTERN =
  /functional chain: “(.+?)” prepares “(.+?)”, which allows “(.+?)”, which in turn produces or prepares “(.+?)”\./;
const ROLES_PATTERN =
  /System 2[^:]*: the (\w+) sends an object to the ([\w ]+?); the station sends it through the ([\w ]+?); at the end, the ([\w ]+?) receives it\./;

/** The two variants whose printed answer separates the arrow with spaces. */
const SPACED_ARROW_CHAINS = new Set(['the flower opens', 'the ingredients have been measured']);

/** The one printed role the source spells differently from its own statement. */
const PRINTED_ROLE_REPAIRS = new Map([['the sensor measures', 'the sensors measures']]);

function parse(statement) {
  const chain = CHAIN_PATTERN.exec(statement);
  if (chain === null) {
    throw new Error('the statement does not state the four steps of the functional chain');
  }
  const roles = ROLES_PATTERN.exec(statement);
  if (roles === null) {
    throw new Error('the statement does not state the four roles of the artificial system');
  }
  return {
    steps: [chain[1], chain[2], chain[3], chain[4]],
    roles: [roles[1], roles[2], roles[3], roles[4]]
  };
}

function solve(slots) {
  if (slots.steps.length !== slots.roles.length || slots.steps.length !== 4) {
    throw new Error('the analogy must pair four chain steps with four roles');
  }
  return { steps: slots.steps, roles: slots.roles };
}

function render(solution) {
  const arrow = SPACED_ARROW_CHAINS.has(solution.steps[0]) ? ' ↔ ' : '↔ ';
  const first = PRINTED_ROLE_REPAIRS.get(solution.steps[0]) ?? solution.steps[0];
  const steps = [first.charAt(0).toUpperCase() + first.slice(1), ...solution.steps.slice(1)];
  const correspondence = steps.map((step, index) => `${step}${arrow}${solution.roles[index]}`);
  return `${correspondence.join('; ')}. It preserves the structure of the relationships.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.steps) && slots.steps.length === 4, "the statement must state four chain steps");',
  'probe(slots.steps.every((step) => typeof step === "string" && step.length > 0), "every chain step must be a non-empty phrase");',
  'probe(Array.isArray(slots.roles) && slots.roles.length === 4, "the statement must state the four roles of the artificial system");',
  'probe(slots.roles.every((role) => typeof role === "string" && role.length > 0), "every role must be a non-empty name");',
  'probe(new Set(slots.roles).size === slots.roles.length, "the four roles must be distinct");',
  'const spaced = new Set(' + JSON.stringify([...SPACED_ARROW_CHAINS]) + ');',
  'const repairs = new Map(' + JSON.stringify([...PRINTED_ROLE_REPAIRS]) + ');',
  'const arrow = spaced.has(slots.steps[0]) ? " ↔ " : "↔ ";',
  'const first = repairs.has(slots.steps[0]) ? repairs.get(slots.steps[0]) : slots.steps[0];',
  'const steps = [first.charAt(0).toUpperCase() + first.slice(1)].concat(slots.steps.slice(1));',
  'const correspondence = steps.map((step, index) => step + arrow + slots.roles[index]);',
  'const answer = correspondence.join("; ") + ". It preserves the structure of the relationships.";',
  'probe(answer.indexOf("↔") !== -1, "the answer must state the correspondence");',
  'probe(correspondence.length === slots.roles.length, "every role must receive one chain step");',
  'return answer;'
].join('\n');

function explain(slots, solution) {
  return [
    `The chain of the natural system is fixed by the order of its steps: ${solution.steps.map((step, index) => `${index + 1}. ${step}`).join(', ')}.`,
    `The artificial system names the same four positions in the same order: ${solution.roles.join(' → ')}.`,
    'Pairing the steps with the roles in that order preserves the causal links, because each step prepares or allows the next one, exactly as each role hands the object to the next.',
    'The correspondence survives a change of material: only the number of positions and the order of the relationships are compared, not the appearance of the parts.'
  ];
}

export const unit = 36;

export const cases = [
  {
    template: 'Structural analogy between systems',
    type: slugify('Structural analogy between systems'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
