/**
 * Section 12 of the logical-reasoning book: a necessary condition.
 *
 * Every case posts one gate notice that admits a visitor into the inner yard
 * "only if" they wear a vest taken from the hook rail, then records three
 * reactions: a person already wearing a rail vest who asks whether the sentence
 * guarantees entry, a person wearing a home-made vest of the same colour who
 * offers colour as a substitute, and a person who reads the rail vest as
 * required without claiming the notice lists every remaining door. The gate
 * town and the three names change between cases; the reasoning is fixed.
 * "Only if" makes the rail vest necessary, an unnamed source fails it, and
 * necessity is not sufficiency.
 */

import { slugify } from '../../naming.mjs';

const NOTICE_PATTERN =
  /^Gate notice in ([A-Z][a-z]+(?: [A-Z][a-z]+)?): “You may enter the inner yard only if you wear a vest taken from the hook rail\.”/;
const RAIL_WEARER_PATTERN =
  /([A-Z][a-z]+) wears a rail vest and asks whether that sentence already guarantees entry\./;
const HOME_MADE_PATTERN =
  /([A-Z][a-z]+) wears a home-made vest of the same colour and says colour should be enough\./;
const SCOPE_PATTERN =
  /([A-Z][a-z]+) says the rail vest is required, and the notice has not said it is the only remaining door\./;

function parse(statement) {
  const notice = NOTICE_PATTERN.exec(statement);
  const railWearer = RAIL_WEARER_PATTERN.exec(statement);
  const homeMade = HOME_MADE_PATTERN.exec(statement);
  const reading = SCOPE_PATTERN.exec(statement);
  if (notice === null || railWearer === null || homeMade === null || reading === null) {
    throw new Error('the statement does not record the gate notice and its three reactions');
  }
  return {
    place: notice[1],
    railWearer: railWearer[1],
    homeMade: homeMade[1],
    scopeHolder: reading[1]
  };
}

/**
 * The notice forces the rail vest and stops there: the person who reads it as
 * "required, not yet shown sufficient" is the one who has the force right, and
 * that reading comes from the sentence that names the vest as required without
 * promoting it to the only door.
 */
function solve(slots) {
  const speakers = [slots.railWearer, slots.homeMade, slots.scopeHolder];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three reactions must come from three different people');
  }
  return { scopeHolder: slots.scopeHolder };
}

function render(solution) {
  return `The rail vest is necessary. A home-made vest fails the named source. Wearing the rail vest is not yet shown to be sufficient. ${solution.scopeHolder} has the scope right.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "The rail vest is necessary. A home-made vest fails the named source. Wearing the rail vest is not yet shown to be sufficient. " + slots.scopeHolder + " has the scope right.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The notice in ${slots.place} admits a visitor only if the vest comes from the named hook rail, so a rail vest is necessary for entry.`,
    `${slots.homeMade} offers a home-made vest of the same colour, but the notice names the source of the vest, not its colour, so that vest fails the condition.`,
    `${slots.railWearer} wears a rail vest and that satisfies the condition, yet "only if" gives no direction from the condition back to entry, so sufficiency is untouched.`,
    `${solution.scopeHolder} keeps the two questions apart and reads the rail vest as required without inventing extra permissions, which is the scope the sentence fixes.`
  ];
}

export const unit = 12;

export const cases = [
  {
    template: 'Necessary conditions',
    type: slugify('Necessary conditions'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
