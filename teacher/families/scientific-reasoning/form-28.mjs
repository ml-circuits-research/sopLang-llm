/**
 * Form 28 of the scientific-reasoning book: intervals, bounds, and possibility.
 *
 * Every variant states a closed accepted zone for one measured quantity and
 * four samples whose values are known only as closed intervals. A sample is
 * certainly accepted when its whole interval lies inside the zone, certainly
 * rejected when it shares no value with the zone, and uncertain when it
 * overlaps the zone only partly; only an uncertain sample can be settled by a
 * more precise measurement, so it is the one the answer names.
 *
 * The variants differ in the world's vocabulary (number of visits, dispersal
 * distance, remaining mass, infiltration time, energy reserve, bending angle,
 * pulse, spoilage index, …) and in the zone and the samples, not in the rule.
 * The samples are printed in one order and the answer keeps that order, and
 * the family refuses a variant whose four samples leave the choice of
 * remeasurement open.
 */

import { slugify } from '../../naming.mjs';

const ZONE_PATTERN =
  /The accepted zone for “(.+?)” is the closed interval \[(-?\d+),(-?\d+)\] ([^;\n]+); each result is known only as interval: ([^\n]*?)\./;
const SAMPLE_PATTERN = /([A-Za-z][A-Za-z0-9]*)=\[(-?\d+),(-?\d+)\]/g;

const ACCEPTED = 'certainly accepted';
const REJECTED = 'certainly rejected';
const UNCERTAIN = 'uncertain';

function parse(statement) {
  const zone = ZONE_PATTERN.exec(statement);
  if (zone === null) {
    throw new Error('the statement does not state its accepted zone and its samples');
  }
  const samples = [];
  for (const sample of zone[5].matchAll(SAMPLE_PATTERN)) {
    samples.push({ label: sample[1], low: Number(sample[2]), high: Number(sample[3]) });
  }
  if (samples.length < 2) {
    throw new Error('the statement must state at least two samples');
  }
  const low = Number(zone[2]);
  const high = Number(zone[3]);
  if (low > high) {
    throw new Error('the accepted zone must be printed as an increasing interval');
  }
  for (const sample of samples) {
    if (sample.low > sample.high) {
      throw new Error(`sample ${sample.label} must be printed as an increasing interval`);
    }
  }
  return { zone: { low, high, unit: zone[4].trim() }, samples };
}

/**
 * The verdict of one sample against the closed zone: the whole interval inside
 * the zone is a certain acceptance, no shared value at all is a certain
 * rejection, and a partial overlap leaves the case uncertain.
 */
function verdictOf(sample, zone) {
  if (sample.low >= zone.low && sample.high <= zone.high) {
    return ACCEPTED;
  }
  if (sample.high < zone.low || sample.low > zone.high) {
    return REJECTED;
  }
  return UNCERTAIN;
}

function solve(slots) {
  const entries = slots.samples.map((sample) => ({ label: sample.label, verdict: verdictOf(sample, slots.zone) }));
  const open = entries.filter((entry) => entry.verdict === UNCERTAIN);
  if (open.length === 0) {
    throw new Error('every sample is decided by its stated interval, so no remeasurement is useful');
  }
  if (open.length > 1) {
    const ambiguity = new Error(`the stated samples leave ${open.length} candidates for remeasurement`);
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  return { entries, remeasure: open[0].label };
}

function render(solution) {
  return `${solution.entries.map((entry) => `${entry.label}: ${entry.verdict}`).join(', ')}; remeasurement is useful for ${solution.remeasure}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'for (const sample of slots.samples) {',
  '}',
  'const entries = slots.samples.map((sample) => {',
  '  const verdict = sample.low >= slots.zone.low && sample.high <= slots.zone.high ? "certainly accepted" : (sample.high < slots.zone.low || sample.low > slots.zone.high ? "certainly rejected" : "uncertain");',
  '  return { label: sample.label, verdict };',
  '});',
  'const open = entries.filter((entry) => entry.verdict === "uncertain");',
  'probe(open.length > 0, "at least one sample must stay open under its stated interval");',
  'probe(open.length === 1, "the stated samples must leave exactly one candidate for remeasurement, not " + open.length);',
  'return entries.map((entry) => entry.label + ": " + entry.verdict).join(", ") + "; remeasurement is useful for " + open[0].label + ".";'
].join('\n');

function explain(slots, solution) {
  const zone = `[${slots.zone.low},${slots.zone.high}] ${slots.zone.unit}`;
  const open = solution.entries.filter((entry) => entry.verdict === UNCERTAIN);
  return [
    `The accepted zone is the closed interval ${zone}, so acceptance is certain only when the whole sample interval lies inside it, and rejection is certain only when the sample shares no value with it.`,
    `Each sample is compared by its two endpoints: a sample is certainly accepted when its lower bound is at least ${slots.zone.low} and its upper bound at most ${slots.zone.high}, and certainly rejected when it lies wholly below ${slots.zone.low} or wholly above ${slots.zone.high}.`,
    `${solution.entries.map((entry) => `${entry.label} is ${entry.verdict}`).join(', ')}.`,
    `Only ${open[0].label} overlaps the zone without being contained in it, so a more precise measurement of ${open[0].label} is the one that can settle an open case.`
  ];
}

export const unit = 28;

export const cases = [
  {
    template: 'Intervals, bounds, and possibility',
    type: slugify('Intervals, bounds, and possibility'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
