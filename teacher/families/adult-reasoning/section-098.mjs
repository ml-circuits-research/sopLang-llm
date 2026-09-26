/**
 * Section 98 of the adult-reasoning course: urgent versus important.
 *
 * Every variant prints the same four-cell grid (important and urgent = today,
 * important only = scheduled, urgent only = delegated and short, neither =
 * dropped) and the same four numbered chores, each tagged with its cell. The
 * family classifies each tag from the parsed grid and prints the chores in the
 * grid’s own order of precedence: today, scheduled, short/delegated, dropped.
 * The variants repeat the same grid and the same four chores, so the family
 * still reads every label from the statement instead of restating it.
 */

import { slugify } from '../../naming.mjs';

const GRID_PATTERN =
  /important\+urgent = ([a-z/]+); important not urgent = ([a-z/]+); urgent not important = ([a-z/]+); neither = ([a-z/]+)\./;
const ITEM_PATTERN = /^\((\d+)\)\s+(.+?)\s+—\s+(.+)$/;

// The grid writes the urgent-only cell as "delegated/short"; the printed answer
// names the same cell "short/delegated".
const URGENT_LABEL = 'short/delegated';
const CLASS_RANK = { both: 0, important: 1, urgent: 2, neither: 3 };

function classify(tag) {
  if (/i\+u/.test(tag)) {
    return 'both';
  }
  if (/neither/.test(tag)) {
    return 'neither';
  }
  if (/u, not i/.test(tag)) {
    return 'urgent';
  }
  if (/i, not u/.test(tag)) {
    return 'important';
  }
  throw new Error(`the item tag "${tag}" does not name a cell of the grid`);
}

function parse(statement) {
  const grid = GRID_PATTERN.exec(statement);
  if (grid === null) {
    throw new Error('the statement does not print the importance and urgency grid');
  }
  const items = [];
  for (const line of statement.split('\n')) {
    const item = ITEM_PATTERN.exec(line.trim());
    if (item === null) {
      continue;
    }
    items.push({ n: Number(item[1]), tag: item[3].replace(/[;.]$/, '').trim() });
  }
  if (items.length !== 4) {
    throw new Error('the statement must list exactly four tagged chores');
  }
  return {
    grid: { both: grid[1], important: grid[2], urgent: grid[3], neither: grid[4] },
    items
  };
}

function solve(slots) {
  const ordered = slots.items
    .map((item) => {
      const cls = classify(item.tag);
      return {
        n: item.n,
        rank: CLASS_RANK[cls],
        label: cls === 'urgent' ? URGENT_LABEL : slots.grid[cls]
      };
    })
    .sort((left, right) => left.rank - right.rank);
  return { ordered };
}

function render(solution) {
  const parts = solution.ordered.map((item) => `(${item.n}) ${item.label}`);
  return `${parts.join('; ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const classify = (tag) => {',
  '  if (/i\\+u/.test(tag)) return "both";',
  '  if (/neither/.test(tag)) return "neither";',
  '  if (/u, not i/.test(tag)) return "urgent";',
  '  if (/i, not u/.test(tag)) return "important";',
  '  throw new Error("the item tag " + tag + " does not name a cell of the grid");',
  '};',
  'const rank = { both: 0, important: 1, urgent: 2, neither: 3 };',
  'const ordered = slots.items.map((item) => {',
  '  const cls = classify(item.tag);',
  '  return { n: item.n, rank: rank[cls], label: cls === "urgent" ? "short/delegated" : slots.grid[cls] };',
  '}).sort((left, right) => left.rank - right.rank);',
  'probe(ordered[0].label === slots.grid.both, "the first chore must sit in the both-cells of the grid");',
  'probe(ordered[3].label === slots.grid.neither, "the last chore must sit in the neither cell of the grid");',
  'return ordered.map((item) => "(" + item.n + ") " + item.label).join("; ") + ".";'
].join('\n');

function explain(slots, solution) {
  const first = solution.ordered[0];
  const last = solution.ordered[solution.ordered.length - 1];
  return [
    `The grid maps importance and urgency onto four answers: the both-cells are ${slots.grid.both}, importance alone is ${slots.grid.important}, urgency alone is ${URGENT_LABEL}, and neither is ${slots.grid.neither}.`,
    `The bill due tomorrow with the power cut is both, so chore ${first.n} comes first as ${first.label}, and the series is neither, so chore ${last.n} lands last as ${last.label}.`,
    `The “reply now” message is urgent without being important, so it takes the short, delegated slot, while the bookable medical check is important without being urgent and is scheduled.`,
    'The order is therefore the grid’s own precedence, not the order the chores were listed.'
  ];
}

export const unit = 98;

export const cases = [
  {
    template: 'Urgent versus important',
    type: slugify('Urgent versus important'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
