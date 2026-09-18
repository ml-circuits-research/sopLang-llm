/**
 * Shared helpers for the families of the world seed book
 * (`World_as_a_System_1000_Reasoning_Problems_Grades_1-4.docx`).
 *
 * The book appends a second, smaller problem to many statements of grades 2-4:
 * a `Cross-domain check:` segment in the given facts, a matching rule, a
 * question in the task, and a labelled answer suffix. Seven printed shapes
 * exist (distance from a map scale, clock arithmetic, quorum, duplicate
 * reports, and the same three combined with a map-sheet count). Instead of
 * re-implementing that arithmetic in every family, the shapes are parsed once
 * here into a JSON descriptor that a family stores in its compiled `slots`, and
 * both the family and the circuit render the descriptor with the same function:
 *
 *   - the family calls `renderCrossDomain(descriptor)` from the solve/render
 *     path, and
 *   - the circuit embeds `CROSS_DOMAIN_SOURCE`, which is the source text of the
 *     same function, because a circuit body cannot import a module.
 *
 * The other helpers are the recurring statement utilities: splitting the four
 * premise blocks, removing the appended checks from a block, extracting
 * numbers, and the small graph algorithms the geography families share.
 */

const BLOCK_LABELS = Object.freeze(['Knowledge context', 'Given facts', 'Rules', 'Task']);

/**
 * Splits a statement into its four premise blocks. The statement of every
 * problem of this book is the labelled concatenation of these blocks, and a
 * family parser reads them by name instead of scanning the whole text.
 */
export function blocksOf(statement) {
  const blocks = {};
  for (const label of BLOCK_LABELS) {
    const pattern = new RegExp(`${label}\\.\\s*([\\s\\S]*?)(?=\\n\\n[A-Z][a-z]+ [a-z]+\\.\\s|$)`);
    const match = pattern.exec(String(statement));
    blocks[label] = match === null ? '' : match[1].trim();
  }
  return blocks;
}

/** The given-facts block with the appended cross-domain and mixed-domain checks removed. */
export function stripCrossDomain(text) {
  return String(text)
    .replace(/\s*(?:Cross-domain check|Mixed-domain verification):[\s\S]*$/, '')
    .trim();
}

/** Numbers in printed order, with the source's Unicode minus sign normalized. */
export function numbersIn(text) {
  return [...String(text).replace(/−/g, '-').matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
}

/** The printed list style of the book: ['market', 'well']. */
export function quotedList(items) {
  return `[${items.map((item) => `'${item}'`).join(', ')}]`;
}

/**
 * Undirected adjacency from a list of `A–B` pairs (the book's border lists).
 */
export function adjacencyOf(pairs) {
  const adjacency = new Map();
  for (const [left, right] of pairs) {
    if (!adjacency.has(left)) {
      adjacency.set(left, new Set());
    }
    if (!adjacency.has(right)) {
      adjacency.set(right, new Set());
    }
    adjacency.get(left).add(right);
    adjacency.get(right).add(left);
  }
  return adjacency;
}

/** Shortest number of edges between two nodes, or Infinity when disconnected. */
export function shortestDistance(adjacency, from, to) {
  if (from === to) {
    return 0;
  }
  const seen = new Set([from]);
  let frontier = [from];
  let distance = 0;
  while (frontier.length > 0) {
    distance += 1;
    const next = [];
    for (const node of frontier) {
      for (const neighbour of adjacency.get(node) ?? []) {
        if (neighbour === to) {
          return distance;
        }
        if (!seen.has(neighbour)) {
          seen.add(neighbour);
          next.push(neighbour);
        }
      }
    }
    frontier = next;
  }
  return Infinity;
}

/** Whether `to` is reachable from `from` when the banned nodes are deleted. */
export function reachableWithout(adjacency, from, to, banned = new Set()) {
  if (banned.has(from) || banned.has(to)) {
    return false;
  }
  const seen = new Set([from]);
  const queue = [from];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === to) {
      return true;
    }
    for (const neighbour of adjacency.get(node) ?? []) {
      if (!seen.has(neighbour) && !banned.has(neighbour)) {
        seen.add(neighbour);
        queue.push(neighbour);
      }
    }
  }
  return false;
}

/**
 * The cross-domain suffix of a printed answer, or an empty string when the
 * problem has no appended check. This function is the single source of truth
 * for the suffix text: the circuit embeds its source text through
 * `CROSS_DOMAIN_SOURCE`, so the family and the circuit cannot drift apart.
 */
export function renderCrossDomain(checks) {
  if (checks === null || checks === undefined || checks.length === 0) {
    return '';
  }
  const parts = checks.map((check, index) => {
    const label = index === 1 ? 'Mixed-domain answer:' : 'Cross-domain answer:';
    return `${label} ${describeCrossDomain(check)}`;
  });
  return parts.join(' ');
}

function describeCrossDomain(check) {
  if (check.kind === 'distance') {
    return `${check.centimetres * check.kilometresPerCentimetre} km.`;
  }
  if (check.kind === 'time') {
    const minutes = check.startHour * 60 + check.startMinute + check.hours * 60;
    const hour = String(Math.floor(minutes / 60)).padStart(2, '0');
    const minute = String(minutes % 60).padStart(2, '0');
    return `${hour}:${minute}.`;
  }
  if (check.kind === 'quorum') {
    return check.present >= check.threshold ? 'quorum is met.' : 'quorum is not met.';
  }
  if (check.kind === 'reports') {
    return `${check.total - check.duplicates} independent reports.`;
  }
  if (check.kind === 'sheets') {
    return `${check.start + check.received} map sheets.`;
  }
  throw new Error(`Unknown cross-domain check "${check.kind}".`);
}

/**
 * The circuit-side copy of `renderCrossDomain`, as source text. A family
 * embeds it at the top of its compute body and renders the suffix from the
 * descriptor its parse stored under `slots.crossDomain`.
 */
export const CROSS_DOMAIN_SOURCE = [
  `const describeCrossDomain = ${describeCrossDomain.toString()};`,
  `const renderCrossDomain = ${renderCrossDomain.toString()};`
].join('\n');

/**
 * Parses the appended checks of a problem into the descriptor the circuit
 * consumes, or returns null when the statement has no appended check. The
 * checks are read from the given facts; the task and the rules are not needed
 * for the arithmetic, and their cross-domain segments are ignored.
 */
export function parseCrossDomain(givenFacts) {
  const checks = [];
  const distance = /on a field sketch, (\d+(?:\.\d+)?) cm represents (\d+(?:\.\d+)?) km and two checkpoints are (\d+(?:\.\d+)?) cm apart/.exec(givenFacts);
  if (distance !== null) {
    checks.push({ kind: 'distance', kilometresPerCentimetre: Number(distance[2]), centimetres: Number(distance[3]) });
  }
  const time = /a survey team starts work at (\d{1,2}):(\d{2}) and works for (\d+(?:\.\d+)?) hour\(s\) without a break/.exec(givenFacts);
  if (time !== null) {
    checks.push({ kind: 'time', startHour: Number(time[1]), startMinute: Number(time[2]), hours: Number(time[3]) });
  }
  const quorum = /a local committee has (\d+) members, requires at least (\d+) present for quorum, and (\d+) are present/.exec(givenFacts);
  if (quorum !== null) {
    checks.push({ kind: 'quorum', members: Number(quorum[1]), threshold: Number(quorum[2]), present: Number(quorum[3]) });
  }
  const reports = /researchers collected (\d+) reports, but (\d+) are exact duplicate copies/.exec(givenFacts);
  if (reports !== null) {
    checks.push({ kind: 'reports', total: Number(reports[1]), duplicates: Number(reports[2]) });
  }
  const sheets = /a regional archive has (\d+) map sheets and receives (\d+) additional sheets/.exec(givenFacts);
  if (sheets !== null) {
    checks.push({ kind: 'sheets', start: Number(sheets[1]), received: Number(sheets[2]) });
  }
  return checks.length === 0 ? null : checks;
}

/**
 * Whether the problem carries an appended check. Families use this to decide
 * whether their slots carry a `crossDomain` descriptor at all.
 */
export function hasCrossDomain(givenFacts) {
  return parseCrossDomain(givenFacts) !== null;
}
