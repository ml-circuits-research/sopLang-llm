/**
 * Family C6 of the world seed book: public budgets and priorities.
 *
 * Every problem states a town budget and a list of projects with their cost and
 * benefit, optionally marks one project as mandatory, and asks for the project
 * set of greatest total benefit whose total cost stays within the budget. The
 * answer names the chosen projects in printed order together with the cost and
 * the benefit of the package. When several packages reach the same benefit the
 * cheapest one is printed, and a still-tied package is broken by printed order.
 * Some variants of grades 2-4 append a cross-domain check, which the family
 * renders as the labelled answer suffix through the shared `renderCrossDomain`.
 *
 * The four grades share one computation; the grade differences live in the
 * stated data (budget, project list, mandatory project) and in whether a
 * cross-domain check is appended, not in the algorithm.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';

const BUDGET_PATTERN = /A town has a budget of (\d+) units/;
const PROJECTS_PATTERN = /Projects \(cost, benefit\): (.+?)\.(?=\s|$)/;
const PROJECT_PATTERN = /^(.+?)=\((\d+)\s*,\s*(\d+)\)$/;
const MANDATORY_PATTERN = /Safety rule: (.+?) must be included/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const budget = BUDGET_PATTERN.exec(facts);
  const listed = PROJECTS_PATTERN.exec(facts);
  if (budget === null || listed === null) {
    throw new Error('the statement states no budget or no project list');
  }
  const projects = listed[1]
    .split(';')
    .map((item) => item.trim())
    .filter((item) => item !== '')
    .map((item) => {
      const match = PROJECT_PATTERN.exec(item);
      if (match === null) {
        throw new Error(`the project entry "${item}" does not state a (cost, benefit) pair`);
      }
      return { name: match[1], cost: Number(match[2]), benefit: Number(match[3]) };
    });
  if (projects.length === 0) {
    throw new Error('the statement lists no project');
  }
  const mandatory = MANDATORY_PATTERN.exec(facts);
  return {
    budget: Number(budget[1]),
    projects,
    mandatory: mandatory === null ? null : mandatory[1].trim(),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

/** The better of two feasible packages: greatest benefit, then lowest cost, then printed order. */
function preferred(candidate, incumbent) {
  if (candidate.benefit !== incumbent.benefit) {
    return candidate.benefit > incumbent.benefit;
  }
  if (candidate.cost !== incumbent.cost) {
    return candidate.cost < incumbent.cost;
  }
  return candidate.mask < incumbent.mask;
}

function solve(slots) {
  const mandatoryIndex = slots.mandatory === null ? -1 : slots.projects.findIndex((project) => project.name === slots.mandatory);
  if (slots.mandatory !== null && mandatoryIndex === -1) {
    throw new Error(`the mandatory project "${slots.mandatory}" is not in the stated list`);
  }
  let best = null;
  const total = 2 ** slots.projects.length;
  for (let mask = 0; mask < total; mask += 1) {
    if (mandatoryIndex !== -1 && (mask & 2 ** mandatoryIndex) === 0) {
      continue;
    }
    const chosen = slots.projects.filter((project, index) => (mask & 2 ** index) !== 0);
    const cost = chosen.reduce((sum, project) => sum + project.cost, 0);
    if (cost > slots.budget) {
      continue;
    }
    const benefit = chosen.reduce((sum, project) => sum + project.benefit, 0);
    const candidate = { names: chosen.map((project) => project.name), cost, benefit, mask };
    if (best === null || preferred(candidate, best)) {
      best = candidate;
    }
  }
  if (best === null) {
    throw new Error('no project set fits the stated budget');
  }
  return { names: best.names, cost: best.cost, benefit: best.benefit, mandatory: slots.mandatory, crossDomain: slots.crossDomain };
}

function render(solution) {
  const main = `Choose ${solution.names.join(', ')}; cost ${solution.cost}, benefit ${solution.benefit}.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(Array.isArray(slots.projects) && slots.projects.length > 0, "the statement must list at least one project");',
  'probe(Number.isInteger(slots.budget) && slots.budget >= 0, "the statement must state a non-negative integer budget");',
  'const mandatoryIndex = slots.mandatory === null ? -1 : slots.projects.findIndex((project) => project.name === slots.mandatory);',
  'probe(slots.mandatory === null || mandatoryIndex !== -1, "a mandatory project must appear in the stated project list");',
  'let best = null;',
  'const total = 1 << slots.projects.length;',
  'for (let mask = 0; mask < total; mask += 1) {',
  '  if (mandatoryIndex !== -1 && (mask & (1 << mandatoryIndex)) === 0) {',
  '    continue;',
  '  }',
  '  const chosen = slots.projects.filter((project, index) => (mask & (1 << index)) !== 0);',
  '  const cost = chosen.reduce((sum, project) => sum + project.cost, 0);',
  '  if (cost > slots.budget) {',
  '    continue;',
  '  }',
  '  const benefit = chosen.reduce((sum, project) => sum + project.benefit, 0);',
  '  const better = best === null || benefit > best.benefit || (benefit === best.benefit && (cost < best.cost || (cost === best.cost && mask < best.mask)));',
  '  if (better) {',
  '    best = { names: chosen.map((project) => project.name), cost, benefit, mask };',
  '  }',
  '}',
  'probe(best !== null, "at least one project set must fit the stated budget");',
  'const main = "Choose " + best.names.join(", ") + "; cost " + best.cost + ", benefit " + best.benefit + ".";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const mandatory = solution.mandatory === null ? 'no project is mandatory' : `${solution.mandatory} is mandatory, so every plan keeps it`;
  return [
    `The budget is ${slots.budget} units and ${mandatory}.`,
    `A plan is feasible only when the costs of its projects sum to at most ${slots.budget}, and among the feasible plans the greatest benefit wins; the best benefit turns out to be ${solution.benefit}.`,
    `Among the plans reaching ${solution.benefit}, the cheapest one is ${solution.names.join(', ')} with cost ${solution.cost}, so no higher-benefit feasible package exists.`
  ];
}

function caseFor(grade) {
  return {
    template: `Public budgets and priorities (grade ${grade})`,
    type: `public-budgets-and-priorities-grade-${grade}`,
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'C6';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
