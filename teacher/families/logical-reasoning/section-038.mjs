/**
 * Section 38 of the logical-reasoning book: a disanalogy that blocks transfer.
 *
 * Every case prints a poster that likens a ferry to a floating bus, a listed
 * fact that the ferry waits on tide windows the bus does not have, one speaker
 * who keeps the bus rules anyway, one speaker who calls the tide window a
 * relevant disanalogy, and one speaker who dismisses one extra part. The cases
 * change the place and the three names; the shared rule is a timetable rule
 * and the extra part works on exactly that timetable, so the printed verdict
 * is no and the extra part is named with the rule's own domain.
 */

import { slugify } from '../../naming.mjs';

const POSTER_PATTERN =
  /Poster in ([^:]+): \u201cA ferry is just a floating bus, so it should keep the same (\w+) rules as the town bus\.\u201d Listed fact: the ferry waits on ([a-z ]+) the bus does not have\. ([A-Z][a-z]+) keeps the bus rules anyway\. ([A-Z][a-z]+) says the ([a-z ]+) is a relevant disanalogy\. ([A-Z][a-z]+) says one extra part never matters\./;

function parse(statement) {
  const poster = POSTER_PATTERN.exec(statement);
  if (poster === null) {
    throw new Error('the statement does not record the ferry poster, the listed tide fact, and the three speakers');
  }
  return {
    place: poster[1].trim(),
    domain: poster[2],
    extraPlural: poster[3],
    keeper: poster[4],
    analyst: poster[5],
    extra: poster[6],
    dismisser: poster[7]
  };
}

/**
 * The listed extra part decides the transfer by the work it does: it is stated
 * in the plural as something the ferry waits on and named in the singular by
 * the analyst, and it does the same work as the rule the poster wants to
 * import, so the rule may not move unchanged.
 */
function solve(slots) {
  const singular = slots.extraPlural.replace(/s$/, '');
  if (singular !== slots.extra) {
    throw new Error(`the analyst names "${slots.extra}", but the listed extra part is "${slots.extraPlural}"`);
  }
  return {
    mayMove: false,
    extra: slots.extra,
    domain: slots.domain
  };
}

function render(solution) {
  return `${solution.mayMove ? 'Yes' : 'No'}. The ${solution.extra} is an extra part that does ${solution.domain} work.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const singular = slots.extraPlural.replace(/s$/, "");',
  'const doesRuleWork = singular === slots.extra && slots.domain.length > 0;',
  'const mayMove = !doesRuleWork;',
  'probe(mayMove === false, "an extra part that does work inside the imported rule stops the transfer");',
  'return (mayMove ? "Yes" : "No") + ". The " + slots.extra + " is an extra part that does " + slots.domain + " work.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The ferry and the town bus share public transport, stops, and tickets, so the poster's picture starts from a real resemblance.`,
    `The listed fact adds a part the bus does not have: the ferry waits on ${slots.extraPlural}, and waiting on them decides when the vehicle may move, which is work inside the same ${slots.domain} rules the poster wants to import.`,
    `${slots.keeper} keeps the bus rules anyway, while ${slots.analyst} calls the ${solution.extra} a relevant disanalogy and ${slots.dismisser} answers that one extra part never matters.`,
    `An extra engine that drives the rule the analogy wants to carry stops the transfer, so the bus rule may not move unchanged.`
  ];
}

export const unit = 38;

export const cases = [
  {
    template: 'A disanalogy that blocks transfer',
    type: slugify('A disanalogy that blocks transfer'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
