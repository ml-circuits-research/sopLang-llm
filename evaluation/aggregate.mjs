#!/usr/bin/env node
/**
 * Aggregation and reporting for the evaluation loop (DS009, "Metrics").
 *
 * The per-item records are the evidence; this module turns them into the
 * aggregate a report may quote. It keeps two rules visible:
 *
 * - the four rates (parse validity, graph validity, runtime completion, oracle
 *   match) are reported separately and never collapsed into one micro-score,
 *   because a system may emit beautiful syntax with wrong semantics;
 * - the macro tables by book and by plan cluster are reported next to the
 *   overall numbers, because thousands of easy items would otherwise hide the
 *   result of a few hard families.
 *
 * The efficiency block keeps the raw components (generated tokens, prompt
 * tokens, calls, wall clock) visible so a reader can reweight them, and
 * `costPerCorrect` is null when nothing was correct rather than a ratio over an
 * empty denominator.
 */

import { CLASSES } from './run-eval.mjs';

/** The four reported rates: the class sets each one excludes, and its label. */
export const RATE_METRICS = [
  {
    key: 'parse_validity',
    label: 'parse validity',
    excluded: new Set(['generation_transport_error', 'wrapper_rejected', 'parse_invalid'])
  },
  {
    key: 'graph_validity',
    label: 'graph validity',
    excluded: new Set(['generation_transport_error', 'wrapper_rejected', 'parse_invalid', 'graph_invalid'])
  },
  {
    key: 'runtime_completion',
    label: 'runtime completion',
    excluded: new Set(['generation_transport_error', 'wrapper_rejected', 'parse_invalid', 'graph_invalid', 'execution_error'])
  },
  { key: 'oracle_match', label: 'oracle match', excluded: null }
];

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/** Class counts for one group, with every D9 class present even at zero. */
function counted(records) {
  const classes = Object.fromEntries(CLASSES.map((className) => [className, 0]));
  for (const record of records) {
    if (Object.hasOwn(classes, record.class)) classes[record.class] += 1;
  }
  return classes;
}

/**
 * The four rates of one group, each as the fraction of items that survived its
 * stage, or `null` for an empty group (a rate over no items is not a number).
 */
function ratesOf(records) {
  if (records.length === 0) {
    return { parse_validity: null, graph_validity: null, runtime_completion: null, oracle_match: null };
  }
  const survived = (excluded) =>
    records.filter((record) => (excluded === null ? record.class === 'answer_match' : !excluded.has(record.class))).length;
  return Object.fromEntries(
    RATE_METRICS.map((metric) => [metric.key, round(survived(metric.excluded) / records.length, 6)])
  );
}

function groupTable(records, keyOf) {
  const groups = new Map();
  for (const record of records) {
    const raw = keyOf(record);
    const key = raw === null || raw === undefined || raw === '' ? 'unknown' : String(raw);
    const list = groups.get(key) ?? [];
    list.push(record);
    groups.set(key, list);
  }
  const table = [...groups.keys()].sort().map((key) => {
    const list = groups.get(key);
    return [key, { items: list.length, classes: counted(list), rates: ratesOf(list) }];
  });
  return Object.fromEntries(table);
}

function sumOf(records, pick) {
  let total = 0;
  for (const record of records) {
    const value = pick(record);
    if (typeof value === 'number' && Number.isFinite(value)) total += value;
  }
  return total;
}

/**
 * The aggregate of a per-item record set: class counts, the four rates, the two
 * macro tables (by book and by plan cluster), and the efficiency block.
 */
export function aggregate(records) {
  const items = records.length;
  const classes = counted(records);
  const generatedTokens = sumOf(records, (record) => record.generated?.tokens);
  const wallClockMs = sumOf(records, (record) => record.generated?.latencyMs);
  const matches = classes.answer_match;
  return {
    items,
    classes,
    rates: ratesOf(records),
    byBook: groupTable(records, (record) => record.book),
    byPlanCluster: groupTable(records, (record) => record.plan),
    efficiency: {
      generatedTokens,
      promptTokens: sumOf(records, (record) => record.generated?.promptTokens),
      calls: sumOf(records, (record) => record.generated?.attempts),
      wallClockMs,
      tokensPerSecond: wallClockMs > 0 ? round(generatedTokens / (wallClockMs / 1000), 2) : null,
      costPerCorrect: matches > 0 ? round(generatedTokens / matches, 2) : null
    }
  };
}

export function percent(rate) {
  return rate === null || rate === undefined ? 'n/a' : `${(rate * 100).toFixed(1)}%`;
}

function numeratorOf(classes, items, excluded) {
  if (excluded === null) return classes.answer_match ?? 0;
  return items - CLASSES.filter((className) => excluded.has(className)).reduce((total, name) => total + (classes[name] ?? 0), 0);
}

export function ratesTable(classes, items) {
  const lines = ['| metric | numerator | items | rate |', '| --- | --- | --- | --- |'];
  for (const metric of RATE_METRICS) {
    const numerator = numeratorOf(classes, items, metric.excluded);
    const rate = items === 0 ? null : round(numerator / items, 6);
    lines.push(`| ${metric.label} | ${numerator} | ${items} | ${percent(rate)} |`);
  }
  return lines;
}

function groupRatesTable(title, group) {
  const lines = [`## ${title}`, '', '| key | items | parse validity | graph validity | runtime completion | oracle match |', '| --- | --- | --- | --- | --- | --- |'];
  const keys = Object.keys(group);
  for (const key of keys) {
    const entry = group[key];
    const cells = RATE_METRICS.map((metric) => percent(entry.rates[metric.key]));
    lines.push(`| ${key} | ${entry.items} | ${cells.join(' | ')} |`);
  }
  if (keys.length === 0) lines.push('| (none) | 0 | n/a | n/a | n/a | n/a |');
  lines.push('');
  return lines;
}

function groupClassesTable(title, group) {
  const lines = [
    `## ${title}`,
    '',
    `| key | ${CLASSES.join(' | ')} |`,
    `| --- | ${CLASSES.map(() => '---').join(' | ')} |`
  ];
  const keys = Object.keys(group);
  for (const key of keys) {
    lines.push(`| ${key} | ${CLASSES.map((className) => group[key].classes[className] ?? 0).join(' | ')} |`);
  }
  if (keys.length === 0) lines.push(`| (none) | ${CLASSES.map(() => 0).join(' | ')} |`);
  lines.push('');
  return lines;
}

/**
 * The registry report body: the four rates overall and per book and per plan
 * cluster, the class counts, and the efficiency columns. The caller prepends
 * the run identity, so a report can be rendered from a finished experiment
 * without running anything.
 */
export function reportSections(metrics) {
  const efficiency = metrics.efficiency;
  return [
    '## Overall rates',
    '',
    ...ratesTable(metrics.classes, metrics.items),
    '',
    '## Outcome classes',
    '',
    '| class | items |',
    '| --- | --- |',
    ...CLASSES.map((className) => `| ${className} | ${metrics.classes[className] ?? 0} |`),
    '',
    ...groupRatesTable('Rates by book', metrics.byBook),
    ...groupRatesTable('Rates by plan cluster', metrics.byPlanCluster),
    ...groupClassesTable('Classes by book', metrics.byBook),
    ...groupClassesTable('Classes by plan cluster', metrics.byPlanCluster),
    '## Efficiency',
    '',
    '| metric | value |',
    '| --- | --- |',
    `| generated tokens | ${efficiency.generatedTokens} |`,
    `| prompt tokens | ${efficiency.promptTokens} |`,
    `| calls | ${efficiency.calls} |`,
    `| wall clock (s) | ${round(efficiency.wallClockMs / 1000, 1)} |`,
    `| generated tokens/s | ${efficiency.tokensPerSecond ?? 'n/a'} |`,
    `| generated tokens per correct answer | ${efficiency.costPerCorrect ?? 'n/a'} |`,
    ''
  ];
}
