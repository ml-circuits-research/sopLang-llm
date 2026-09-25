/**
 * Family C5 of the world seed book: institutions and roles.
 *
 * Every problem defines five civic institutions by their stated function and
 * then asks, for one requested action, which of two named institutions should
 * receive the request first. The family reads the requested action from the
 * statement, matches it against the stated functions through the topic words
 * each function covers, verifies that the matched institution is one of the two
 * candidates the task offers, and prints the routed institution.
 *
 * The topic table below is the domain vocabulary of the five stated roles (road
 * work, legal disputes, the budget and local policy, elections, and school
 * policy). It never decides the answer on its own: the matched institution must
 * also appear among the two candidates of the task, and a tie between two roles
 * is refused as ambiguous instead of guessed.
 *
 * Grades 3 and 4 append a cross-domain check (clock arithmetic or an appended
 * quorum comparison), which the family renders as the labelled answer suffix
 * through the shared `renderCrossDomain`.
 *
 * The four grades share one computation; the variants differ in the requested
 * action, the distractor institution, and whether a cross-domain check is
 * appended, so their cases share the same parse, solve, compute, and explain
 * functions and declare only their own printed template.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const ROLES_PATTERN = /Roles are defined as follows:\s*([\s\S]*?)\.\s*A resident asks/;
const ROLE_PATTERN = /^([A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)*) ([a-z][\s\S]*)$/;
const ACTION_PATTERN = /asks which institution should ([^.?]+)/;
const OPTIONS_PATTERN = /Should the request go first to the (.+?) or the (.+?)\?/;

/**
 * The topic words of each stated role. A role matches the requested action when
 * at least one of its words is one of the action's word tokens, and the role
 * with the most matches wins.
 */
const ROLE_TOPICS = Object.freeze([
  {
    role: 'Public Works Office',
    keywords: Object.freeze(['road', 'roads', 'street', 'streets', 'bridge', 'bridges', 'pavement', 'maintain', 'maintains', 'maintenance', 'repair', 'repairs', 'infrastructure'])
  },
  {
    role: 'Local Court',
    keywords: Object.freeze(['dispute', 'disputes', 'law', 'laws', 'legal', 'court', 'courts', 'hearing', 'hearings', 'judge', 'judges', 'justice'])
  },
  {
    role: 'Town Council',
    keywords: Object.freeze(['budget', 'budgets', 'policy', 'tax', 'taxes', 'fund', 'funds', 'funding', 'levy'])
  },
  {
    role: 'Election Committee',
    keywords: Object.freeze(['election', 'elections', 'ballot', 'ballots', 'vote', 'votes', 'voting', 'count', 'counting', 'tally'])
  },
  {
    role: 'School Board',
    keywords: Object.freeze(['school', 'schools', 'calendar', 'calendars', 'curriculum', 'class', 'classes', 'student', 'students', 'pupil', 'pupils'])
  }
]);

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const listed = ROLES_PATTERN.exec(facts);
  const action = ACTION_PATTERN.exec(facts);
  const options = OPTIONS_PATTERN.exec(blocks.Task);
  if (listed === null || action === null || options === null) {
    throw new Error('the statement does not define the roles, the requested action, and the two candidate institutions');
  }
  const roles = listed[1].split(';').map((entry) => {
    const match = ROLE_PATTERN.exec(entry.trim());
    if (match === null) {
      throw new Error(`the role entry "${entry.trim()}" does not read as an institution and its stated function`);
    }
    return { name: match[1], definition: match[2].trim() };
  });
  if (roles.length === 0) {
    throw new Error('the statement defines no institution');
  }
  return {
    roles,
    action: action[1].trim(),
    options: [options[1].trim(), options[2].trim()],
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function roleFor(action) {
  const tokens = action.toLowerCase().split(/[^a-z]+/).filter((token) => token !== '');
  let matched = null;
  let bestScore = 0;
  let tied = false;
  for (const entry of ROLE_TOPICS) {
    const score = entry.keywords.filter((keyword) => tokens.includes(keyword)).length;
    if (score > bestScore) {
      matched = entry.role;
      bestScore = score;
      tied = false;
    } else if (score > 0 && score === bestScore) {
      tied = true;
    }
  }
  if (matched === null) {
    throw new Error(`no stated role covers the requested action "${action}"`);
  }
  if (tied) {
    throw new Error(`more than one stated role covers the requested action "${action}"`);
  }
  return matched;
}

function solve(slots) {
  const role = roleFor(slots.action);
  if (!slots.options.includes(role)) {
    throw new Error(`the matched institution "${role}" is not one of the offered candidates`);
  }
  return { role, crossDomain: slots.crossDomain };
}

function render(solution) {
  const main = `The request should go first to the ${solution.role}.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const WIRES = [
  {
    name: 'role',
    command: 'jsEval',
    body: [
      `const ROLE_TOPICS = ${JSON.stringify(ROLE_TOPICS)};`,
      'const slots = $slots;',
      'const tokens = slots.action.toLowerCase().split(/[^a-z]+/).filter((token) => token !== "");',
      'let matched = null; let bestScore = 0; let tied = false;',
      'for (const entry of ROLE_TOPICS) { const score = entry.keywords.filter((keyword) => tokens.includes(keyword)).length; if (score > bestScore) { matched = entry.role; bestScore = score; tied = false; } else if (score > 0 && score === bestScore) { tied = true; } }',
      'probe(matched !== null, "one stated role must cover the requested action");',
      'probe(tied === false, "exactly one stated role must cover the requested action");',
      'probe(slots.options.includes(matched), "the matched institution must be one of the two offered candidates");',
      'return matched;'
    ].join('\n')
  },
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
  'const main = "The request should go first to the " + $role + ".";',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  const definition = slots.roles.find((role) => role.name === solution.role).definition;
  return [
    `The requested action is "${slots.action}", and the task offers ${slots.options[0]} and ${slots.options[1]} as the two candidates.`,
    `The stated function of ${solution.role} is "${definition}", which covers that action; no other stated function does.`,
    `The other candidate is not the first match, because the constitution assigns it a different function and power alone never routes a request.`,
    `So the request goes first to the ${solution.role}, whose stated role is the one that authorizes this action.`
  ];
}

function caseFor(grade) {
  const template = `Institutions and roles (grade ${grade})`;
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

export const unit = 'C5';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
