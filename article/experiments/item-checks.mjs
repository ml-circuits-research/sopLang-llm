/**
 * Mechanical checks of the evaluation-only item files of experiments E2 and E3
 * (article/experiments/no-training-plan.md).
 *
 * The builders run these checks before they write anything, and
 * `items.test.mjs` runs them again over the written files. Each check returns a
 * list of failure messages, empty when the item passes, so a report can count
 * passes per check instead of stopping at the first failure.
 */

import { OPERATORS, formatEdges } from '../../teacher/procedural/compositions.mjs';
import { ordinalOf } from './surface-phrases.mjs';

const NUMBER_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty',
  'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'dozen', 'twice', 'double', 'doubled',
  'doubles', 'triple', 'half', 'halve', 'halves', 'pair', 'first', 'second', 'third', 'fourth', 'fifth'
];
const DISCARD = /\b(discard|discards|set aside|sets aside|remove|removes|drop|drops|exclude|excludes|ignore|ignores)\b/i;

/** Every whole number written in digits, in order of appearance. */
export function numbersIn(text) {
  return (text.match(/\d+/g) ?? []).map(Number);
}

/** The numbers a statement of this chain must state, with multiplicity: the ledger, then each stage's parameters. */
export function expectedNumbers(chain, slots) {
  const numbers = [...slots.values];
  for (const name of chain) {
    if (name === 'keepAbove' || name === 'keepBelow') numbers.push(slots.threshold);
    else if (name === 'addRate' || name === 'subtractRate') numbers.push(slots.rate);
    else if (name === 'perUnit') numbers.push(slots.perUnit);
    else if (name === 'double') numbers.push(slots.multiplier);
    else if (name === 'keepDivisibleBy' || name === 'modulo' || name === 'ratioPer') numbers.push(slots.divisor);
    else if (name === 'percentOf' || name === 'discount') numbers.push(slots.pct);
    else if (name === 'elapsed') numbers.push(slots.per);
    else if (name === 'rectangleArea') numbers.push(slots.width);
    else if (name === 'probability') numbers.push(slots.favourableDivisor);
    else if (name === 'neighbourCount') numbers.push(...slots.edges.flat());
    else if (name === 'pathExists') numbers.push(slots.target, ...slots.edges.flat());
  }
  return numbers;
}

function sortedKey(numbers) {
  return [...numbers].sort((left, right) => left - right).join(',');
}

/** The stated numbers are exactly the slot numbers, plus the declared distractor when there is one. */
export function checkNumbers(statement, chain, slots, distractor) {
  const expected = expectedNumbers(chain, slots);
  if (distractor !== null && distractor !== undefined) {
    if (expected.includes(distractor)) return [`the distractor ${distractor} equals a slot number`];
    expected.push(distractor);
  }
  const stated = numbersIn(statement);
  return sortedKey(stated) === sortedKey(expected) ? [] : [`numbers [${sortedKey(stated)}] differ from the expected [${sortedKey(expected)}]`];
}

/** No English number word, except the ordinal of the chain's own rank. */
export function checkNumberWords(statement, chain, slots) {
  const allowed = chain.includes('nthLargest') ? ordinalOf(slots.nth) : null;
  const found = NUMBER_WORDS.filter((word) => word !== allowed && new RegExp(`\\b${word}\\b`, 'i').test(statement));
  return found.length === 0 ? [] : [`number words ${found.join(', ')}`];
}

/**
 * How one mention of the threshold reads: `above` keeps values strictly greater,
 * `below` keeps values strictly smaller, `inclusive` names a boundary that
 * includes the threshold on the kept side, and `null` is not a filter mention.
 */
function classifyMention(statement, index, threshold) {
  const clauseStart = Math.max(statement.lastIndexOf('.', index), statement.lastIndexOf(';', index), statement.lastIndexOf(', then', index));
  const before = statement.slice(clauseStart + 1, index);
  const after = statement.slice(index + String(threshold).length, index + String(threshold).length + 20);
  const discards = DISCARD.test(before);
  if (/\b(at least|at most|no more than|no less than|up to)\s*$/.test(before)) return 'inclusive';
  if (/^ or (more|higher|greater|above)\b/.test(after)) return discards ? 'below' : 'inclusive';
  if (/^ or (less|lower|smaller|below)\b/.test(after)) return discards ? 'above' : 'inclusive';
  if (/\b(above|greater than|more than|exceeding)\s*$/.test(before)) return discards ? 'below-by-discard' : 'above';
  if (/\b(below|under|less than|smaller than|lower than)\s*$/.test(before)) return discards ? 'above-by-discard' : 'below';
  return null;
}

/** The threshold of a filter stage is stated with the operator's exact, exclusive semantics. */
export function checkThreshold(statement, chain, slots) {
  const filter = chain.find((name) => name === 'keepAbove' || name === 'keepBelow');
  if (filter === undefined) return [];
  const want = filter === 'keepAbove' ? 'above' : 'below';
  const classes = [];
  for (const match of statement.matchAll(new RegExp(`\\b${slots.threshold}\\b`, 'g'))) {
    const reading = classifyMention(statement, match.index, slots.threshold);
    if (reading !== null) classes.push(reading);
  }
  const failures = [];
  if (!classes.includes(want)) failures.push(`no mention of ${slots.threshold} reads as keep-${want}`);
  const wrong = classes.filter((reading) => reading !== want);
  if (wrong.length > 0) failures.push(`threshold mentions read as ${wrong.join(', ')}`);
  return failures;
}

function escape(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** The pattern each operator's parameters must be stated with, so no parameter is left implicit. */
function parameterPatterns(name, slots) {
  switch (name) {
    case 'total': return [/\b(sum|add|adds|total)\b/];
    case 'count': return [/\b(count|counts|number of|how many)\b/];
    case 'largest': return [/\b(largest|biggest|maximum)\b/];
    case 'nthLargest': return [new RegExp(`\\b${ordinalOf(slots.nth)}\\b`), /\blargest\b/];
    case 'double': return [new RegExp(`(multipl\\w* (it|that figure|the result) by|factor of|double it by the factor of) ${slots.multiplier}\\b|\\b${slots.multiplier} times\\b`)];
    case 'addRate': return [new RegExp(`\\b(charge|fee|amount) of ${slots.rate}\\b`), /\b(add|adds|adding|increase)\b/];
    case 'subtractRate': return [new RegExp(`\\b(deduction|allowance|amount) of ${slots.rate}\\b`), /\b(subtract|deduction|take away|taken off|takes|reduce)\b/];
    case 'perUnit': return [new RegExp(`\\b${slots.perUnit} labels\\b`)];
    case 'modulo': return [/\bremainder\b/, new RegExp(`divid\\w*( it)? by ${slots.divisor}\\b`)];
    case 'percentOf': return [new RegExp(`\\b${slots.pct} percent\\b`)];
    case 'discount': return [new RegExp(`\\b${slots.pct} percent discount\\b|discount of ${slots.pct} percent\\b`)];
    case 'ratioPer': return [new RegExp(`\\b${slots.divisor} equal (parts|shares)\\b`)];
    case 'elapsed': return [new RegExp(`\\b${slots.label}\\b`), new RegExp(`(factor of|multiplying by) ${slots.per}\\b`)];
    case 'rectangleArea': return [/\brectangle\b/, new RegExp(`\\b${slots.width} wide\\b|width of ${slots.width}\\b`)];
    case 'pathExists': return [new RegExp(`\\bnode ${slots.target}\\b`), new RegExp(`${escape(formatEdges(slots.edges))}(?![\\d-])`), /\b(path|connected|reach)\b/];
    case 'keepAbove':
    case 'keepBelow': return [];
    default: throw new Error(`no parameter pattern for the operator ${name}`);
  }
}

/** Every stage's parameters appear in an unambiguous phrase, and the report unit is named. */
export function checkParameters(statement, chain, slots) {
  const failures = [];
  for (const name of chain) {
    if (OPERATORS[name] === undefined) failures.push(`unknown operator ${name}`);
    for (const pattern of parameterPatterns(name, slots)) {
      if (!pattern.test(statement)) failures.push(`${name}: missing ${pattern}`);
    }
  }
  if (chain.at(-1) !== 'pathExists' && !new RegExp(`\\b${slots.unit}\\b`).test(statement)) failures.push(`the unit ${slots.unit} is not named`);
  return failures;
}

/** All E2 checks of one row, grouped by check name. */
export function checkSurfaceRow(row) {
  const results = {
    numbers: checkNumbers(row.statement, row.chain, row.slots, row.distractor),
    threshold: checkThreshold(row.statement, row.chain, row.slots),
    parameters: checkParameters(row.statement, row.chain, row.slots),
    numberWords: row.rung === 'L0' ? [] : checkNumberWords(row.statement, row.chain, row.slots)
  };
  if (row.rung !== 'L0' && (row.distractor === null) !== (row.rung === 'L1')) {
    results.numbers.push(`rung ${row.rung} must ${row.rung === 'L1' ? 'not ' : ''}carry a distractor`);
  }
  return results;
}

/** The E3 scheduling statement values, read from either wording. */
export function schedulingNumbers(slots) {
  return [slots.aMinutes, slots.bMinutes, slots.cMinutes, slots.dMinutes, slots.eMinutes, slots.bufferMinutes, slots.limitMinutes];
}

/** The E3 coalition statement values, read from either wording. */
export function coalitionNumbers(slots) {
  return [...slots.groups.map((group) => group.seats), slots.threshold];
}

/** The numbers of a rewrite equal the numbers of its source statement, with multiplicity. */
export function checkSameNumbers(original, rewrite) {
  const left = sortedKey(numbersIn(original));
  const right = sortedKey(numbersIn(rewrite));
  return left === right ? [] : [`numbers [${right}] differ from the source [${left}]`];
}

/** Scheduling: the earliest safe completion time and the verdict, computed from the slots. */
export function scheduleReference(slots) {
  const minutes = slots.aMinutes + Math.max(slots.bMinutes, slots.cMinutes) + slots.dMinutes + slots.eMinutes + slots.bufferMinutes;
  return { minutes, feasible: minutes <= slots.limitMinutes };
}

/** Scheduling oracle "46 minutes: not feasible." as values. */
export function parseScheduleOracle(oracle) {
  const match = /^(\d+) minutes: (feasible|not feasible)\.$/.exec(oracle);
  if (match === null) throw new Error(`unexpected scheduling oracle "${oracle}"`);
  return { minutes: Number(match[1]), feasible: match[2] === 'feasible' };
}

/** Coalitions: every minimal winning coalition by bitmask, with its seats, in the book's order. */
export function coalitionReference(slots) {
  const groups = slots.groups;
  const winning = [];
  for (let mask = 1; mask < (1 << groups.length); mask += 1) {
    const members = groups.filter((group, index) => mask & (1 << index));
    const seats = members.reduce((sum, group) => sum + group.seats, 0);
    if (seats < slots.threshold) continue;
    if (members.every((group) => seats - group.seats < slots.threshold)) {
      winning.push({ label: members.map((group) => group.label).join(''), seats });
    }
  }
  winning.sort((left, right) => left.label.length - right.label.length || left.label.localeCompare(right.label));
  return winning;
}

/** Coalition oracle "AB with 8 seats; AC with 8 seats." as a list of coalitions. */
export function parseCoalitionOracle(oracle) {
  if (!oracle.endsWith('.')) throw new Error(`unexpected coalition oracle "${oracle}"`);
  return oracle.slice(0, -1).split('; ').map((part) => {
    const match = /^([A-Z]+) with (\d+) seats$/.exec(part);
    if (match === null) throw new Error(`unexpected coalition oracle part "${part}"`);
    return { label: match[1], seats: Number(match[2]) };
  });
}
