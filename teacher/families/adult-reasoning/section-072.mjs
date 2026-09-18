/**
 * Section 72 of the adult-reasoning course: charts told in prose.
 *
 * Every variant describes the same six-month subscription chart: the months
 * Jan–Jun, a vertical axis that starts just below the first plotted value
 * instead of at zero, a list of six values, and the headline “Explosion in
 * subscriptions”. A named reader claims the series doubled from January to
 * June. The verdict reads the two plotted endpoints: the rise is the
 * difference of the values, not twice the first, and the truncated axis makes
 * that modest rise look steep. The variants move the axis start, the six
 * values, and the reader, so the family derives each clause from the parsed
 * quantities.
 */

import { slugify } from '../../naming.mjs';

const HEADER_PATTERN =
  /Chart described: months (Jan[–-]Jun)\. Vertical axis from (\d+) to (\d+), NOT from 0\. Values \[([\d,\s]+)\]\. Title: “([^”]+)”\./;
const CLAIM_PATTERN = /([A-Z][a-z]+): “they doubled from January to June”\./;

function parse(statement) {
  const header = HEADER_PATTERN.exec(statement);
  const claim = CLAIM_PATTERN.exec(statement);
  if (header === null || claim === null) {
    throw new Error('the statement does not describe a six-month chart with a doubling claim');
  }
  return {
    months: header[1],
    axisStart: Number(header[2]),
    axisEnd: Number(header[3]),
    values: header[4].split(',').map((text) => Number(text.trim())),
    title: header[5],
    name: claim[1],
    claim: 'doubled',
    cutAxis: true,
    titleIsJudgement: /explosion/i.test(header[5])
  };
}

function solve(slots) {
  if (slots.values.length !== 6) {
    throw new Error(`the chart plots ${slots.values.length} values, not six months`);
  }
  if (slots.axisStart !== 0 && slots.axisEnd - slots.axisStart !== 20) {
    throw new Error('the printed axis does not span the twenty units the header claims');
  }
  const first = slots.values[0];
  const last = slots.values[slots.values.length - 1];
  if (last <= first) {
    throw new Error('the plotted series does not rise, so the doubling claim is not the defect');
  }
  const difference = last - first;
  const doubled = first * 2;
  const growth = `${first} → ${last} is +${difference}, not ×2 (that would be ${doubled}).`;
  const axisClause = slots.cutAxis
    ? 'A cut axis makes the slope look steep.'
    : 'The axis starts at zero, so the slope is honest.';
  const titleClause = slots.titleIsJudgement
    ? 'The title is a judgement.'
    : 'The title is neutral.';
  return { growth, axisClause, titleClause };
}

function render(solution) {
  return `${solution.growth} ${solution.axisClause} ${solution.titleClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(Array.isArray(slots.values) && slots.values.length === 6, "the chart must plot the six months it names");',
  'probe(slots.values.every((value) => Number.isInteger(value) && value >= 0), "every plotted value must be a whole count");',
  'probe(Number.isInteger(slots.axisStart) && slots.axisStart > 0, "the vertical axis must start above zero");',
  'probe(Number.isInteger(slots.axisEnd) && slots.axisEnd - slots.axisStart === 20, "the axis must span the twenty units the header states");',
  'probe(slots.values[5] > slots.values[0], "the series must end above where it began");',
  'probe(typeof slots.name === "string" && slots.name.length > 0 && slots.claim === "doubled", "the case must quote a doubling claim by a named reader");',
  'probe(slots.cutAxis === true, "the described chart must cut its axis");',
  'const first = slots.values[0];',
  'const last = slots.values[5];',
  'const difference = last - first;',
  'const doubled = first * 2;',
  'probe(doubled !== last, "a plotted endpoint that really doubled would carry no defect to report");',
  'const growth = first + " → " + last + " is +" + difference + ", not ×2 (that would be " + doubled + ").";',
  'const axisClause = slots.cutAxis',
  '  ? "A cut axis makes the slope look steep."',
  '  : "The axis starts at zero, so the slope is honest.";',
  'const titleClause = slots.titleIsJudgement',
  '  ? "The title is a judgement."',
  '  : "The title is neutral.";',
  'return growth + " " + axisClause + " " + titleClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The header plots the months ${slots.months} with the axis running from ${slots.axisStart} to ${slots.axisEnd}, so the values ${slots.values.join(', ')} sit inside a cut window instead of a zero-based one.`,
    `${slots.name} calls the series a doubling, but the first value is ${slots.values[0]} and the last is ${slots.values[5]}, a change of ${slots.values[5] - slots.values[0]}; a real doubling would have to reach ${slots.values[0] * 2}.`,
    'The truncated axis stretches the drawn slope, so the picture looks far steeper than the numbers behind it support.',
    `The headline “${slots.title}” is an editorial judgement about the same series, not a measured quantity.`
  ];
}

export const unit = 72;

export const cases = [
  {
    template: 'Charts told in prose',
    type: slugify('Charts told in prose'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
