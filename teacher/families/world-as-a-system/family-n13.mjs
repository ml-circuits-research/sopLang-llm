/**
 * Family N13 of the world seed book: anachronisms and temporal compatibility.
 *
 * Every problem supplies availability intervals for four named items
 * ("Technology A: 1200–1600"), a year in which a story is set, and the two
 * items the story mentions. An item is compatible only when the story year
 * lies inside its stated interval, so the anachronism is the mentioned item
 * whose interval does not contain the year.
 *
 * The four grades share one membership test over the same stated intervals;
 * grades 2 to 4 append a cross-domain check, which the family renders as the
 * labelled answer suffix through the shared `renderCrossDomain`.
 */

import { slugify } from '../../naming.mjs';
import {
  blocksOf,
  stripCrossDomain,
  parseCrossDomain,
  renderCrossDomain,
  CROSS_DOMAIN_SOURCE
} from './shared.mjs';

const INTERVAL_PATTERN = /([A-Z][A-Za-z]*(?: [A-Z][A-Za-z]*)?)\s*:\s*(\d+)\s*[-\u2013\u2014]\s*(\d+)/g;
const STORY_PATTERN = /A story is set in (\d+) and mentions (.+?) and (.+?) together/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const intervals = [];
  for (const match of facts.matchAll(INTERVAL_PATTERN)) {
    intervals.push({ name: match[1].trim(), start: Number(match[2]), end: Number(match[3]) });
  }
  if (intervals.length === 0) {
    throw new Error('the statement supplies no availability interval');
  }
  const story = STORY_PATTERN.exec(facts);
  if (story === null) {
    throw new Error('the statement does not set a story year and the items it mentions');
  }
  return {
    intervals,
    year: Number(story[1]),
    mentioned: [story[2].trim(), story[3].trim()],
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  const byName = new Map(slots.intervals.map((interval) => [interval.name, interval]));
  const anachronistic = [];
  for (const item of slots.mentioned) {
    const interval = byName.get(item);
    if (interval === undefined) {
      throw new Error(`the statement gives no availability interval for "${item}"`);
    }
    if (!(slots.year >= interval.start && slots.year <= interval.end)) {
      anachronistic.push(item);
    }
  }
  return { anachronistic, crossDomain: slots.crossDomain };
}

function render(solution) {
  const main = solution.anachronistic.length === 0
    ? 'No anachronistic item.'
    : `Anachronistic: ${solution.anachronistic.join(', ')}.`;
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
  'const byName = new Map(slots.intervals.map((interval) => [interval.name, interval]));',
  'const anachronistic = [];',
  'for (const item of slots.mentioned) {',
  '  const interval = byName.get(item);',
  '  if (!(slots.year >= interval.start && slots.year <= interval.end)) {',
  '    anachronistic.push(item);',
  '  }',
  '}',
  'const main = anachronistic.length === 0 ? "No anachronistic item." : "Anachronistic: " + anachronistic.join(", ") + ".";',
  'return $cross.suffix === "" ? main : main + " " + $cross.suffix;'
].join('\n');

function explain(slots, solution) {
  return [
    `The story is set in ${slots.year}, so only items whose interval contains ${slots.year} are compatible.`,
    `Test each mentioned item against its stated interval: ${slots.mentioned.join(' and ')}.`,
    solution.anachronistic.length === 0
      ? 'Both mentioned items lie inside their intervals, so the story has no anachronism.'
      : `The item outside its interval is ${solution.anachronistic.join(', ')}, which is the anachronism.`,
    'Items the story does not mention cannot be anachronistic here, whatever their interval.'
  ];
}

function caseFor(grade) {
  const template = `Anachronisms and temporal compatibility (grade ${grade})`;
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

export const unit = 'N13';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
