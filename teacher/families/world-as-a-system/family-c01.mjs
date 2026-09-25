/**
 * Family C1 of the world seed book: rules and exceptions.
 *
 * Every problem states a person's age, a library rule whose eligibility
 * conditions are a minimum age and an adult permit joined by AND, and the
 * exception that nobody may enter during an evacuation drill. The answer is the
 * verdict about entry: the exception is checked first and overrides the general
 * rule, and otherwise every AND condition must hold. The source prints the
 * verdict as a sentence naming the person (`No, Owen may not enter.`), which is
 * positive when the facts allow entry.
 *
 * The four grades share one computation; the variants differ in the stated age,
 * permit, drill state, and minimum age, not in the algorithm.
 */

import { blocksOf, stripCrossDomain } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const PERSON_PATTERN = /([A-Z][A-Za-z]+) is (\d+) years old\./;
const RULE_PATTERN = /may enter the archive room if age ≥ (\d+) AND an adult permit is present/;
const PERMIT_PATTERN = /Permit present: (yes|no)\./;
const DRILL_PATTERN = /Evacuation drill: (yes|no)\./;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const person = PERSON_PATTERN.exec(facts);
  const rule = RULE_PATTERN.exec(facts);
  const permit = PERMIT_PATTERN.exec(facts);
  const drill = DRILL_PATTERN.exec(facts);
  if (person === null || rule === null || permit === null || drill === null) {
    throw new Error('the statement does not state the person, the rule, the permit, and the drill state');
  }
  return {
    name: person[1],
    age: Number(person[2]),
    minimumAge: Number(rule[1]),
    permit: permit[1] === 'yes',
    drill: drill[1] === 'yes'
  };
}

function solve(slots) {
  const ageCondition = slots.age >= slots.minimumAge;
  const allowed = !slots.drill && ageCondition && slots.permit;
  return {
    name: slots.name,
    age: slots.age,
    minimumAge: slots.minimumAge,
    permit: slots.permit,
    drill: slots.drill,
    ageCondition,
    allowed
  };
}

function render(solution) {
  return solution.allowed
    ? `Yes, ${solution.name} may enter.`
    : `No, ${solution.name} may not enter.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const ageCondition = slots.age >= slots.minimumAge;',
  'const allowed = !slots.drill && ageCondition && slots.permit;',
  'return allowed ? "Yes, " + slots.name + " may enter." : "No, " + slots.name + " may not enter.";'
].join('\n');

function explain(slots, solution) {
  return [
    'The exception is checked first: during an evacuation drill nobody may enter, so it overrides ordinary eligibility.',
    solution.drill
      ? 'The evacuation drill is active here, so the exception decides the case and the conditions of the general rule need not be examined.'
      : `No evacuation drill is active, so the general rule applies: age ≥ ${solution.minimumAge} and an adult permit must both hold.`,
    ...(solution.drill
      ? []
      : [
          `The age test is ${solution.age} ≥ ${solution.minimumAge}, which is ${solution.ageCondition ? 'True' : 'False'}, and the permit test is ${solution.permit ? 'True' : 'False'}.`,
          `The rule joins the two conditions with AND, so entry is ${solution.allowed ? 'allowed' : 'not allowed'}: ${solution.ageCondition && solution.permit ? 'both tests pass' : 'at least one test fails'}.`
        ])
  ];
}

function caseFor(grade) {
  const template = `Rules and exceptions (grade ${grade})`;
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

export const unit = 'C1';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
