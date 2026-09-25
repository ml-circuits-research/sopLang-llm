/**
 * Family N11 of the world seed book: time intervals and overlapping events.
 *
 * Every problem states two dated events ("Event A lasted from year 100 to
 * 135") plus the rule that intervals overlap when the later start is strictly
 * before the earlier end. The answer decides whether the two periods overlap
 * and, when they do, reports the overlap length in years.
 *
 * The four grades share one computation; the grades differ only in the stated
 * years, so their cases declare the same parse, solve, compute, and explain
 * functions and only carry their own printed template. The cross-domain
 * plumbing is kept in every grade so a variant that appends a second, smaller
 * problem would render the shared suffix; the 20 printed variants of this
 * family carry no appended check.
 */

import { slugify } from '../../naming.mjs';
import {
  blocksOf,
  stripCrossDomain,
  parseCrossDomain,
  renderCrossDomain,
  CROSS_DOMAIN_SOURCE
} from './shared.mjs';

const EVENT_PATTERN = /Event (\w+) lasted from (?:year )?(-?\d+) to (-?\d+)/g;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const events = [];
  for (const match of facts.matchAll(EVENT_PATTERN)) {
    events.push({ name: match[1], start: Number(match[2]), end: Number(match[3]) });
  }
  if (events.length !== 2) {
    throw new Error(`the statement must date exactly two events, found ${events.length}`);
  }
  for (const event of events) {
    if (event.end < event.start) {
      throw new Error(`event ${event.name} ends (${event.end}) before it starts (${event.start})`);
    }
  }
  return { events, crossDomain: parseCrossDomain(blocks['Given facts']) };
}

function solve(slots) {
  // Later start and earlier end are the two boundary values of the rule the
  // statement supplies: the intervals share the years after the later start and
  // before the earlier end, and no years when that span is not positive.
  const laterStart = Math.max(...slots.events.map((event) => event.start));
  const earlierEnd = Math.min(...slots.events.map((event) => event.end));
  const overlapYears = earlierEnd - laterStart;
  return {
    overlap: overlapYears > 0,
    overlapYears: Math.max(overlapYears, 0),
    crossDomain: slots.crossDomain
  };
}

function render(solution) {
  const main = solution.overlap
    ? `Yes, overlap ${solution.overlapYears} years.`
    : 'No, the events do not overlap.';
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'const laterStart = Math.max(...slots.events.map((event) => event.start));',
  'const earlierEnd = Math.min(...slots.events.map((event) => event.end));',
  'const overlapYears = earlierEnd - laterStart;',
  'const main = overlapYears > 0 ? "Yes, overlap " + overlapYears + " years." : "No, the events do not overlap.";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const [first, second] = slots.events;
  return [
    `Compare the two started years: the later start is max(${first.start}, ${second.start}).`,
    `Compare the two end years: the earlier end is min(${first.end}, ${second.end}).`,
    solution.overlap
      ? `The earlier end lies after the later start, so the events overlap for ${solution.overlapYears} years.`
      : 'The later start is not before the earlier end, so the intervals share no years.'
  ];
}

function caseFor(grade) {
  const template = `Time intervals and overlapping events (grade ${grade})`;
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

export const unit = 'N11';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
