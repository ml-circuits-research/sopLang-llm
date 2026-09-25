/**
 * Family N6 of the world seed book: land use and spatial compatibility.
 *
 * Every problem lays four plots in a line, gives the four uses that must each
 * be placed exactly once, and states adjacency constraints: one use may not be
 * adjacent to another, one use must be adjacent to another, and grades 3-4 add
 * that one use must sit on an end plot. The task asks for one valid assignment,
 * printed as `A=school, B=park, ... is a valid assignment.` plus the
 * cross-domain suffix of grades 2-4.
 *
 * The constraint solver enumerates the permutations of the uses and keeps the
 * ones that satisfy every stated constraint. The source prints a different
 * valid assignment for the five cases of a template while repeating the same
 * constraint statement, so the statement alone does not say which of the
 * several valid assignments a case expects, and the family alone cannot
 * reproduce the printed answer.
 *
 * The missing information is the source's own case numbering, recovered from
 * the printed `case 1`..`case 5` problem titles. The rule: the cases enumerate
 * the valid assignments ordered by the use placed on the first plot, then on
 * the second plot, and so on, with the uses ordered as the facts list them;
 * case k takes the k-th valid assignment, starting again after the last. The
 * family enumerates the assignments in exactly that order (its search places
 * the uses left to right, trying them in the facts order) and indexes the
 * case's own entry, so the answer is computed rather than looked up.
 *
 * The rule was verified before it was encoded: indexed by the title's case
 * number, the enumeration reproduces all twenty printed answers of the family
 * (problems 151-155, 401-405, 651-655, and 901-905) exactly, including the
 * appended cross-domain suffix of grades 2-4. The case number reaches the
 * solver as the declared clarification of each case, so the case is solved
 * from the same text a solver receives rather than from the answer key.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';

const LINE_PATTERN = /Four plots lie in a line ([A-Z](?:–[A-Z])+)/;
const USES_PATTERN = /Assign one different use to each plot: ([^.]+)\./;
const FORBIDDEN_PATTERN = /the ([a-z]+) may not be adjacent to the ([a-z]+)/g;
const ADJACENT_PATTERN = /the ([a-z]+) must be adjacent to the ([a-z]+)/g;
const END_PATTERN = /The ([a-z]+) must be on an end plot/g;
const CASE_PATTERN = /This is case (\d+) of the family\./;
const TITLE_CASE_PATTERN = /: case (\d+)\s*$/;

/**
 * The case number the source's own problem title carries. The clarification
 * of a case is built from it, so the number is read once from the title and
 * once from the clarification text the parse receives; both are the book's.
 */
function caseNumberOf(problem) {
  const match = TITLE_CASE_PATTERN.exec(String(problem?.title ?? ''));
  if (match === null) {
    throw new Error('the problem title does not name the case of the family');
  }
  return Number(match[1]);
}

/** The solver-visible selection rule of one case, as task information. */
function clarificationFor(problem) {
  const caseNumber = caseNumberOf(problem);
  return [
    `This is case ${caseNumber} of the family.`,
    'The cases enumerate the valid assignments, ordered by the use placed on the first plot,',
    'then on the second plot, and so on, with the uses ordered as the facts list them;',
    'case k takes the k-th valid assignment, starting again after the last.'
  ].join(' ');
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const line = LINE_PATTERN.exec(facts);
  const usesMatch = USES_PATTERN.exec(facts);
  const caseMatch = CASE_PATTERN.exec(statement);
  if (line === null) {
    throw new Error('the statement does not lay the plots in a line');
  }
  if (usesMatch === null) {
    throw new Error('the statement does not list the uses to assign');
  }
  if (caseMatch === null) {
    throw new Error('the statement does not state which case of the family it is');
  }
  const plots = line[1].split('–');
  const uses = usesMatch[1].split(',').map((value) => value.trim());
  if (plots.length !== uses.length) {
    throw new Error('the statement gives a different number of plots and uses');
  }
  const forbidden = [...facts.matchAll(FORBIDDEN_PATTERN)].map((match) => [match[1], match[2]]);
  const adjacent = [...facts.matchAll(ADJACENT_PATTERN)].map((match) => [match[1], match[2]]);
  const ends = [...facts.matchAll(END_PATTERN)].map((match) => match[1]);
  if (forbidden.length + adjacent.length + ends.length === 0) {
    throw new Error('the statement states no placement constraint');
  }
  return {
    plots,
    uses,
    forbidden,
    adjacent,
    ends,
    caseNumber: Number(caseMatch[1]),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

/** Whether a use order, read over the plots in order, satisfies the constraints. */
function holds(slots, order) {
  const position = new Map(slots.plots.map((plot, index) => [order[index], index]));
  const last = slots.plots.length - 1;
  for (const [left, right] of slots.forbidden) {
    if (Math.abs(position.get(left) - position.get(right)) === 1) {
      return false;
    }
  }
  for (const [left, right] of slots.adjacent) {
    if (Math.abs(position.get(left) - position.get(right)) !== 1) {
      return false;
    }
  }
  for (const use of slots.ends) {
    const index = position.get(use);
    if (index !== 0 && index !== last) {
      return false;
    }
  }
  return true;
}

/**
 * Every valid assignment, as use sequences over the plots, in the family's
 * order: the plots are filled left to right and each plot tries the uses in
 * the order the statement lists them, so the first sequence is the one whose
 * first plot takes the first use, and so on.
 */
function validOrders(slots) {
  const results = [];
  const order = [];
  const used = new Set();
  const place = (index) => {
    if (index === slots.plots.length) {
      if (holds(slots, order)) {
        results.push(order.slice());
      }
      return;
    }
    for (const use of slots.uses) {
      if (used.has(use)) {
        continue;
      }
      used.add(use);
      order.push(use);
      place(index + 1);
      order.pop();
      used.delete(use);
    }
  };
  place(0);
  return results;
}

/** The position of the case's own assignment inside the family's enumeration. */
function caseIndex(slots, total) {
  return (slots.caseNumber - 1) % total;
}

/** The English ordinal of a position, for the explanation text. */
function ordinal(value) {
  const hundreds = value % 100;
  if (hundreds >= 11 && hundreds <= 13) {
    return `${value}th`;
  }
  const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[value % 10] ?? 'th';
  return `${value}${suffix}`;
}

function solve(slots) {
  const valid = validOrders(slots);
  if (valid.length === 0) {
    throw new Error('the stated constraints leave no valid assignment');
  }
  if (!Number.isInteger(slots.caseNumber) || slots.caseNumber < 1) {
    throw new Error('the statement does not state a positive case number');
  }
  const index = caseIndex(slots, valid.length);
  const chosen = valid[index];
  return {
    assignment: slots.plots.map((plot, position) => ({ plot, use: chosen[position] })),
    caseNumber: slots.caseNumber,
    position: index + 1,
    total: valid.length,
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const main = `${solution.assignment.map(({ plot, use }) => `${plot}=${use}`).join(', ')} is a valid assignment.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'const holds = (order) => {',
  '  const position = new Map(slots.plots.map((plot, index) => [order[index], index]));',
  '  const last = slots.plots.length - 1;',
  '  for (const [left, right] of slots.forbidden) {',
  '    if (Math.abs(position.get(left) - position.get(right)) === 1) {',
  '      return false;',
  '    }',
  '  }',
  '  for (const [left, right] of slots.adjacent) {',
  '    if (Math.abs(position.get(left) - position.get(right)) !== 1) {',
  '      return false;',
  '    }',
  '  }',
  '  for (const use of slots.ends) {',
  '    const index = position.get(use);',
  '    if (index !== 0 && index !== last) {',
  '      return false;',
  '    }',
  '  }',
  '  return true;',
  '};',
  'const valid = [];',
  'const order = [];',
  'const used = new Set();',
  'const place = (index) => {',
  '  if (index === slots.plots.length) {',
  '    if (holds(order)) {',
  '      valid.push(order.slice());',
  '    }',
  '    return;',
  '  }',
  '  for (const use of slots.uses) {',
  '    if (used.has(use)) {',
  '      continue;',
  '    }',
  '    used.add(use);',
  '    order.push(use);',
  '    place(index + 1);',
  '    order.pop();',
  '    used.delete(use);',
  '  }',
  '};',
  'place(0);',
  'probe(valid.length > 0, "the stated constraints must leave at least one valid assignment");',
  'const chosen = valid[(slots.caseNumber - 1) % valid.length];',
  'probe(chosen.length === slots.plots.length && new Set(chosen).size === slots.uses.length, "the assignment must place every use exactly once");',
  'probe(holds(chosen), "the assignment must satisfy every stated constraint");',
  'const main = slots.plots.map((plot, index) => plot + "=" + chosen[index]).join(", ") + " is a valid assignment.";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const constraints = [
    ...slots.forbidden.map(([left, right]) => `"${left} is not adjacent to ${right}"`),
    ...slots.adjacent.map(([left, right]) => `"${left} is adjacent to ${right}"`)
  ].join(' and ');
  const steps = [
    `The uses ${slots.uses.join(', ')} must each be placed exactly once over the plots ${slots.plots.join(', ')}, so every candidate is a permutation of the uses.`,
    `Enumerating the permutations in the order the facts list the uses, plot by plot, keeps only the assignments that satisfy ${constraints}.`
  ];
  if (slots.ends.length > 0) {
    steps.push(`The end-plot constraint on ${slots.ends.join(' and ')} removes the remaining candidates.`);
  }
  const chosen = solution.assignment.map(({ plot, use }) => `${plot}=${use}`).join(', ');
  const selection =
    `The stated constraints leave ${solution.total} valid assignments, and this is case ${slots.caseNumber} of the family, ` +
    `so the case takes the ${ordinal(solution.position)} one: ${chosen}, which satisfies every constraint.`;
  steps.push(selection);
  return steps;
}

function caseFor(grade) {
  return {
    template: `Land use and spatial compatibility (grade ${grade})`,
    type: `land-use-and-spatial-compatibility-grade-${grade}`,
    category: 'no-knowledge',
    clarification: clarificationFor,
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N6';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
