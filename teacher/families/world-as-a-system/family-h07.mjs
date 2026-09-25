/**
 * Family H7 of the world seed book: change and continuity.
 *
 * Every problem lists the features of two settlement periods and asks for the
 * continuities, the disappearances, and the appearances. The three answers are
 * plain set operations over the two printed lists: the intersection, the
 * features only Period 1 has, and the features only Period 2 has, each printed
 * in the order the source lists them and quoted in the book's list style
 * (`['market', 'well']`). From grade 2 on the statement appends a cross-domain
 * check (map scale, clock arithmetic, quorum, duplicate reports, optionally
 * combined with a map-sheet count), which the family renders as the labelled
 * answer suffix through the shared `renderCrossDomain`.
 *
 * The four grades share one computation; the grade differences live in the
 * stated feature lists and in whether a cross-domain check is appended.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, quotedList, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const PERIOD_PATTERN = /Period (\d) features: ([^.]*)\./g;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const periods = new Map();
  for (const match of facts.matchAll(PERIOD_PATTERN)) {
    periods.set(
      Number(match[1]),
      match[2]
        .split(',')
        .map((feature) => feature.trim())
        .filter((feature) => feature !== '')
    );
  }
  const earlier = periods.get(1);
  const later = periods.get(2);
  if (earlier === undefined || later === undefined || earlier.length === 0 || later.length === 0) {
    throw new Error('the statement does not list the features of both periods');
  }
  return {
    period1: earlier,
    period2: later,
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  const continuities = slots.period1.filter((feature) => slots.period2.includes(feature));
  const disappearances = slots.period1.filter((feature) => !slots.period2.includes(feature));
  const appearances = slots.period2.filter((feature) => !slots.period1.includes(feature));
  if (continuities.length === 0) {
    throw new Error('the two periods share no feature, so the comparison has no continuity');
  }
  return { continuities, disappearances, appearances, crossDomain: slots.crossDomain };
}

function render(solution) {
  const main = `Continuities: ${quotedList(solution.continuities)}; disappearances: ${quotedList(solution.disappearances)}; appearances: ${quotedList(solution.appearances)}.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'const quoted = (items) => "[" + items.map((item) => "\'" + item + "\'").join(", ") + "]";',
  'const continuities = slots.period1.filter((feature) => slots.period2.includes(feature));',
  'const disappearances = slots.period1.filter((feature) => !slots.period2.includes(feature));',
  'const appearances = slots.period2.filter((feature) => !slots.period1.includes(feature));',
  'probe(continuities.length > 0, "the two periods must share at least one feature, otherwise the comparison has no continuity");',
  'probe(continuities.length + disappearances.length === slots.period1.length, "every Period 1 feature must be either a continuity or a disappearance");',
  'probe(continuities.length + appearances.length === slots.period2.length, "every Period 2 feature must be either a continuity or an appearance");',
  'const main = "Continuities: " + quoted(continuities) + "; disappearances: " + quoted(disappearances) + "; appearances: " + quoted(appearances) + ".";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `Period 1 features are ${quotedList(slots.period1)} and Period 2 features are ${quotedList(slots.period2)}.`,
    `The intersection of the two lists gives the continuities ${quotedList(solution.continuities)}.`,
    `Removing the Period 2 features from Period 1 gives the disappearances ${quotedList(solution.disappearances)}, and removing the Period 1 features from Period 2 gives the appearances ${quotedList(solution.appearances)}.`,
    'The three conclusions are direct set comparisons, so they follow from the two lists alone; only a role-based replacement claim would need information the problem does not state.'
  ];
}

function caseFor(grade) {
  const template = `Change and continuity (grade ${grade})`;
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

export const unit = 'H7';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
