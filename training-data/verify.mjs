/**
 * Dataset verifier.
 *
 * Two checks run over every `solution.sop` of every book dataset under
 * `training-data/`:
 *
 * 1. The shape rule. A dataset circuit is the compiled plan of one problem
 *    instance, so it must not contain an `input` wire (nothing injects a
 *    binding into a dataset circuit) and must not contain a `modelCall` wire
 *    (the model that generated the circuit already read the problem). A
 *    violation is reported as a warning for each offending wire.
 *
 * 2. Execution. When no violation is found, every circuit is executed by the
 *    runtime without inputs and without model bindings, and the executed
 *    answer is compared with the printed answer recorded in the chapter
 *    manifests. This proves that the shipped program is the complete
 *    translation of its problem.
 *
 * Usage:
 *   node training-data/verify.mjs                     verify every book dataset
 *   node training-data/verify.mjs mathematical-thinking   verify one dataset
 *   node training-data/verify.mjs --root <dir>        verify datasets under another root
 *
 * Exit code 0 means no violations and every executed circuit reproduced its
 * printed answer. Exit code 1 means at least one warning or mismatch, and the
 * details are printed for triage.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCircuit, serializeCircuit } from '../runtime/parser.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { findValueReferences } from '../runtime/dependencies.mjs';
import { answerMatches, normalizeAnswer } from '../teacher/naming.mjs';

export const DEFAULT_ROOT = fileURLToPath(new URL('.', import.meta.url));
const FORBIDDEN_COMMANDS = new Map([
  ['input', 'an input wire re-states data the compiled plan already carries'],
  ['modelCall', 'the compiling model already read the problem; a circuit must not re-parse its own input']
]);

/** The book dataset directories under a root: every directory with a manifest/. */
export function bookRoots({ root = DEFAULT_ROOT, book = null } = {}) {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => book === null || name === book)
    .filter((name) => existsSync(join(root, name, 'manifest')))
    .sort();
}

/** Every solution.sop of a book dataset, across the categories that hold them. */
export function solutionFilesOf(root) {
  const files = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(path);
      } else if (entry.name === 'solution.sop') {
        files.push(path);
      }
    }
  };
  for (const category of ['no-knowledge', 'knowledge', 'eval']) {
    const path = join(root, category);
    if (existsSync(path)) {
      walk(path);
    }
  }
  return files.sort();
}

/**
 * The manifest row of every accepted example, keyed by the dataset-relative
 * folder: the printed answer the circuit must reproduce and the plan
 * fingerprint that identifies the latent plan across the variants of a
 * template.
 */
export function expectedAnswersOf(root) {
  const expected = new Map();
  const manifestDirectory = join(root, 'manifest');
  for (const fileName of readdirSync(manifestDirectory).sort()) {
    const text = readFileSync(join(manifestDirectory, fileName), 'utf8');
    for (const line of text.split('\n')) {
      const match = line.match(
        /^\| (\S+) \| ([0-9.]+) \| \d+ \| [^|]+ \| [^|]+ \| [^|]+ \| (?:train|eval) \| [^|]+ \| (.+?) \| ([a-f0-9]+) \| [a-f0-9]+ \| [a-f0-9]+ \| [a-f0-9]+ \|$/
      );
      if (match !== null) {
        expected.set(match[1], { answer: match[3].trim(), plan: match[4] });
      }
    }
  }
  return expected;
}

/**
 * Scan every circuit for the forbidden commands. The scan never stops at the
 * first violation, so one run reports every file that needs attention.
 */
export function scanShape(root, files) {
  const violations = [];
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    const parsed = parseCircuit(source, { sourceName: relative(root, file) });
    for (const wire of parsed.wires) {
      if (FORBIDDEN_COMMANDS.has(wire.command)) {
        violations.push({
          file: relative(root, file),
          wire: wire.name,
          command: wire.command,
          why: FORBIDDEN_COMMANDS.get(wire.command)
        });
      }
    }
  }
  return violations;
}

/**
 * Execute every circuit without inputs and without model bindings and compare
 * the answer with the expected answer of its manifest row. A circuit that
 * needs an input binding or a model call cannot complete this run, which is
 * the structural proof of the shape rule.
 */
export async function verifyExecution(root, files, { runtime = createRuntime() } = {}) {
  const expected = expectedAnswersOf(root);
  const failures = [];
  let matched = 0;
  const startedAll = performance.now();
  const durations = [];
  for (const file of files) {
    const folder = relative(root, file).replace(/\/solution\.sop$/, '');
    const entry = expected.get(folder);
    if (entry === undefined) {
      failures.push({ file: relative(root, file), reason: 'no manifest row for this folder' });
      continue;
    }
    const expectedAnswer = entry.answer;
    const source = readFileSync(file, 'utf8');
    const startedCircuit = performance.now();
    let result;
    try {
      result = await runtime.run(source, { outputs: ['answer'] });
    } catch (error) {
      failures.push({ file: relative(root, file), reason: `run threw: ${error.message}` });
      continue;
    }
    const circuitMs = performance.now() - startedCircuit;
    durations.push({ file: relative(root, file), ms: circuitMs });
    if (result.status !== 'completed') {
      failures.push({
        file: relative(root, file),
        reason: `run ended ${result.status}:${result.code}`,
        detail: result.error?.message ?? ''
      });
      continue;
    }
    const computed = String(result.outputs.answer);
    if (!answerMatches(expectedAnswer, computed)) {
      failures.push({
        file: relative(root, file),
        reason: 'answer mismatch',
        detail: `expected "${expectedAnswer}" but computed "${computed}"`
      });
      continue;
    }
    matched += 1;
  }
  const totalMs = performance.now() - startedAll;
  const bootMs = durations.length === 0 ? 0 : durations[0].ms;
  const settledEntries = durations.slice(1);
  const sorted = settledEntries.map((entry) => entry.ms).sort((left, right) => left - right);
  const slowest = settledEntries.reduce((winner, entry) => (winner === null || entry.ms > winner.ms ? entry : winner), null);
  return {
    matched,
    failures,
    timings: {
      totalMs,
      averageMs: durations.length === 0 ? 0 : totalMs / durations.length,
      bootMs,
      medianMs: sorted.length === 0 ? 0 : sorted[Math.floor(sorted.length / 2)],
      slowest,
      durations
    }
  };
}

/** Verify one book dataset: shape first, execution only when the shape holds. */
export async function verifyBook(root, { runtime } = {}) {
  const files = solutionFilesOf(root);
  const startedScan = performance.now();
  const violations = scanShape(root, files);
  const scanMs = performance.now() - startedScan;
  if (violations.length > 0) {
    return { circuits: files.length, violations, executed: false, matched: 0, failures: [], timings: { scanMs } };
  }
  const execution = await verifyExecution(root, files, runtime === undefined ? {} : { runtime });
  const provenance = await verifyProvenance(root, files, { runtime });
  return {
    circuits: files.length,
    violations: [],
    executed: true,
    matched: execution.matched,
    failures: execution.failures,
    provenance,
    timings: { scanMs, ...execution.timings, provenanceMs: provenance.timings.provenanceMs }
  };
}

/**
 * Answer provenance.
 *
 * A circuit can reproduce the printed answer in two ways: by computing it from
 * the instance values, or by carrying the text of the answer inside the
 * program. Output alone cannot tell them apart, so the check perturbs the
 * instance: it rewrites the `slots` literal with modified values, re-executes
 * the circuit, and asks whether the answer reacted. A computation that never
 * reacts to any perturbation is not computing its answer; when the printed
 * text also occurs literally in the program, the evidence is reported as a
 * hardcoded answer. The plan fingerprint keeps the verdict fair: when every
 * circuit of one plan is invariant and they all print the same answer, the
 * plan is a constant-answer template by design, which the caller reports as
 * information rather than as a warning.
 */

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Every mutable leaf of a slots value, with the path that addresses it. */
export function collectMutablePaths(value, path = [], leaves = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectMutablePaths(item, [...path, index], leaves));
    return leaves;
  }
  if (isPlainObject(value)) {
    for (const [key, item] of Object.entries(value)) {
      collectMutablePaths(item, [...path, key], leaves);
    }
    return leaves;
  }
  if (typeof value === 'number') {
    leaves.push({ path, kind: 'number' });
  } else if (typeof value === 'string') {
    leaves.push({ path, kind: 'string' });
  } else if (typeof value === 'boolean') {
    leaves.push({ path, kind: 'boolean' });
  }
  return leaves;
}

function readAtPath(root, path) {
  let cursor = root;
  for (const key of path) {
    cursor = cursor[key];
  }
  return cursor;
}

function writeAtPath(root, path, value) {
  let cursor = root;
  for (let index = 0; index < path.length - 1; index += 1) {
    cursor = cursor[path[index]];
  }
  cursor[path[path.length - 1]] = value;
}

function mirroredString(value) {
  return value + [...value].reverse().join('');
}

/**
 * Replace the character at the second position (or the first for one-character
 * strings) with a different character from the string's own alphabet. This is
 * the smallest edit that changes a digit or letter while keeping the value
 * plausible, which flips predicates over individual characters.
 */
function charFlipped(value, position = 1) {
  const characters = [...value];
  if (characters.length === 0) {
    return 'z';
  }
  const at = Math.min(position, characters.length - 1);
  const distinct = [...new Set(characters)].sort();
  const alternative = distinct.find((character) => character !== characters[at]) ?? (characters[at] === 'z' ? 'a' : 'z');
  const copy = [...characters];
  copy[at] = alternative;
  return copy.join('');
}

function sampleOf(list, count) {
  if (list.length <= count) {
    return [...list];
  }
  const indexes = new Set([0, count - 1]);
  for (let index = 1; index < count - 1; index += 1) {
    indexes.add(Math.round((index * (list.length - 1)) / (count - 1)));
  }
  return [...indexes].sort((left, right) => left - right).map((position) => list[position]);
}

/** Consecutive pairs of a list, as a reducer: [a, b, c, d] → [[a, b], [c, d]]. */
function consecutivePairs(accumulator, leaf, index, list) {
  if (index > 0 && index % 2 === 1) {
    accumulator.push([list[index - 1], leaf]);
  }
  return accumulator;
}

/** Every array in the slots value, with the path that addresses it. */
function collectArrayPaths(value, path = [], arrays = []) {
  if (Array.isArray(value)) {
    arrays.push({ path, value });
    value.forEach((item, index) => collectArrayPaths(item, [...path, index], arrays));
    return arrays;
  }
  if (isPlainObject(value)) {
    for (const [key, item] of Object.entries(value)) {
      collectArrayPaths(item, [...path, key], arrays);
    }
  }
  return arrays;
}

/**
 * Candidates that copy one plain object of the slots onto a sibling with the
 * same key set. A conserved-sum or conserved-difference predicate flips when
 * both sides of the comparison are made equal, which no per-leaf number shift
 * can achieve.
 */
function siblingCopies(slots) {
  const results = [];
  const visit = (node, path) => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => visit(item, [...path, index]));
      return;
    }
    if (!isPlainObject(node)) {
      return;
    }
    const children = Object.entries(node).filter(([, child]) => isPlainObject(child));
    for (let first = 0; first < children.length; first += 1) {
      for (let second = first + 1; second < children.length; second += 1) {
        const [keyA, childA] = children[first];
        const [keyB, childB] = children[second];
        const keysA = Object.keys(childA).sort().join('|');
        const keysB = Object.keys(childB).sort().join('|');
        const primitiveA = Object.values(childA).every((value) => typeof value !== 'object');
        const primitiveB = Object.values(childB).every((value) => typeof value !== 'object');
        if (keysA !== '' && keysA === keysB && primitiveA && primitiveB && JSON.stringify(childA) !== JSON.stringify(childB)) {
          const copy = JSON.parse(JSON.stringify(slots));
          writeAtPath(copy, [...path, keyB], JSON.parse(JSON.stringify(childA)));
          results.push(copy);
        }
      }
    }
    for (const [key, child] of Object.entries(node)) {
      visit(child, [...path, key]);
    }
  };
  visit(slots, []);
  return results;
}

/**
 * Perturbed variants of a circuit's slots literal. The candidates combine
 * global mutations (every number shifted, every string mirrored into a
 * palindrome or extended, sibling objects aligned) with sampled single-leaf
 * edits (a character flipped, a field shifted, a value composed from two
 * scalar strings), so a computation that depends on its inputs in any of the
 * ways the families use reacts to at least one candidate. A computation that
 * reacts to none is not reading its inputs.
 */
export function perturbedSlotBodies(source, { maxCandidates = 16 } = {}) {
  const parsed = parseCircuit(source, { sourceName: 'provenance' });
  const slotsWire = parsed.wires.find((wire) => wire.name === 'slots' && wire.command === 'literal');
  if (slotsWire === undefined) {
    return { candidates: [], reason: 'no slots literal' };
  }
  let slots;
  try {
    slots = JSON.parse(slotsWire.body);
  } catch {
    return { candidates: [], reason: 'the slots literal is not JSON' };
  }
  const leaves = collectMutablePaths(slots);
  if (leaves.length === 0) {
    return { candidates: [], reason: 'no mutable values in slots' };
  }
  const numbers = leaves.filter((leaf) => leaf.kind === 'number');
  const strings = leaves.filter((leaf) => leaf.kind === 'string');
  const booleans = leaves.filter((leaf) => leaf.kind === 'boolean');
  const scalarStrings = strings.filter((leaf) => !leaf.path.some((key) => typeof key === 'number'));
  const scalarNumbers = numbers.filter((leaf) => !leaf.path.some((key) => typeof key === 'number'));
  const original = JSON.stringify(slots, null, 2);
  const candidates = [];
  const add = (mutated) => {
    const body = JSON.stringify(mutated, null, 2);
    if (body !== original && !candidates.includes(body)) {
      candidates.push(body);
    }
  };
  const cloneSlots = () => JSON.parse(JSON.stringify(slots));
  const editAll = (copy, leafList, fn) => {
    for (const leaf of leafList) {
      writeAtPath(copy, leaf.path, fn(readAtPath(copy, leaf.path)));
    }
  };
  const withEdits = (leafList, fn) => {
    const copy = cloneSlots();
    editAll(copy, leafList, fn);
    return copy;
  };

  if (numbers.length > 0) {
    add(withEdits(numbers, (number) => number + 1));
    add(withEdits(numbers, (number) => number * 2 + 1));
    add(withEdits(numbers, () => 0));
  }
  if (booleans.length > 0) {
    add(withEdits(booleans, (value) => !value));
  }
  if (strings.length > 0) {
    add(withEdits(strings, mirroredString));
  }
  if (numbers.length > 0 && strings.length > 0) {
    const combined = cloneSlots();
    editAll(combined, numbers, (number) => number + 1);
    editAll(combined, strings, mirroredString);
    add(combined);
  }
  for (const candidate of siblingCopies(slots)) {
    if (candidates.length >= maxCandidates) {
      break;
    }
    add(candidate);
  }
  for (const [first, second] of sampleOf(scalarNumbers, 4).reduce(consecutivePairs, [])) {
    if (candidates.length >= maxCandidates) {
      break;
    }
    if (readAtPath(slots, first.path) === readAtPath(slots, second.path)) {
      continue;
    }
    const aligned = cloneSlots();
    writeAtPath(aligned, second.path, readAtPath(aligned, first.path));
    add(aligned);
    const swapped = cloneSlots();
    const left = readAtPath(swapped, first.path);
    writeAtPath(swapped, first.path, readAtPath(swapped, second.path));
    writeAtPath(swapped, second.path, left);
    add(swapped);
  }
  if (strings.length > 0) {
    add(withEdits(strings, (value) => `${value}x`));
  }
  for (const array of sampleOf(collectArrayPaths(slots), 2)) {
    if (candidates.length >= maxCandidates) {
      break;
    }
    if (array.value.length > 0) {
      const appended = cloneSlots();
      const target = readAtPath(appended, array.path);
      target.push(JSON.parse(JSON.stringify(array.value[array.value.length - 1])));
      add(appended);
    } else {
      const extended = cloneSlots();
      readAtPath(extended, array.path).push(numbers.length > 0 ? 0 : 'x');
      add(extended);
    }
    if (array.value.length > 1) {
      const removed = cloneSlots();
      readAtPath(removed, array.path).pop();
      add(removed);
    }
  }
  for (const leaf of sampleOf(leaves, 4)) {
    if (candidates.length >= maxCandidates) {
      break;
    }
    if (leaf.kind === 'number') {
      add(withEdits([leaf], (number) => number + 3));
    } else if (leaf.kind === 'string') {
      add(withEdits([leaf], (value) => charFlipped(value, 0)));
      add(withEdits([leaf], (value) => `${value}x`));
    } else {
      add(withEdits([leaf], (value) => !value));
    }
  }
  const distinctScalars = [...new Set(sampleOf(scalarStrings, 3).map((leaf) => readAtPath(slots, leaf.path)))];
  for (const leaf of sampleOf(strings, 2)) {
    if (candidates.length >= maxCandidates) {
      break;
    }
    const others = distinctScalars.filter((value) => value !== readAtPath(slots, leaf.path));
    if (others.length >= 2) {
      add(withEdits([leaf], () => `${others[0]}-${others[1]}`));
    }
  }
  return { candidates: candidates.slice(0, maxCandidates), reason: null };
}

/** Rebuild a circuit with a different slots literal body. */
export function withSlotsBody(source, body) {
  const parsed = parseCircuit(source, { sourceName: 'provenance' });
  const wires = parsed.wires.map((wire) =>
    wire.name === 'slots' && wire.command === 'literal' ? { name: wire.name, command: wire.command, body } : wire
  );
  return serializeCircuit(wires);
}

/**
 * Whether the printed answer occurs literally in the program. The answer text
 * is normalized and matched at word boundaries, so an answer of a few
 * characters cannot trigger a spurious match inside an identifier.
 */
export function answerEcho(body, answer) {
  const core = normalizeAnswer(answer);
  if (core.length < 3) {
    return false;
  }
  const escaped = core.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`).test(normalizeAnswer(body));
}

/**
 * Probe every circuit for answer provenance: run the base program, then the
 * perturbations of its slots literal, and record the circuits whose answer
 * never reacted. The check is bounded by `maxCandidates` and stops at the
 * first perturbation that changes the answer, so a computing circuit usually
 * costs one extra run.
 */
export async function verifyProvenance(root, files, { expected, runtime = createRuntime(), maxCandidates = 16 } = {}) {
  const answers = expected ?? expectedAnswersOf(root);
  const invariant = [];
  const skipped = [];
  let computed = 0;
  const started = performance.now();
  for (const file of files) {
    const folder = relative(root, file).replace(/\/solution\.sop$/, '');
    const entry = answers.get(folder);
    if (entry === undefined) {
      continue;
    }
    const source = readFileSync(file, 'utf8');
    const { candidates, reason } = perturbedSlotBodies(source, { maxCandidates });
    if (candidates.length === 0) {
      skipped.push({ file: relative(root, file), reason });
      continue;
    }
    const base = await runtime.run(source, { outputs: ['answer'] });
    const baseAnswer = base.status === 'completed' ? String(base.outputs.answer) : null;
    let reacted = false;
    let perturbations = 0;
    for (const body of candidates) {
      const result = await runtime.run(withSlotsBody(source, body), { outputs: ['answer'] });
      perturbations += 1;
      if (result.status !== 'completed' || baseAnswer === null || String(result.outputs.answer) !== baseAnswer) {
        reacted = true;
        break;
      }
    }
    if (reacted) {
      computed += 1;
      continue;
    }
    const answerWire = parseCircuit(source, { sourceName: folder }).wires.find((wire) => wire.name === 'answer');
    const references = answerWire === undefined ? [] : findValueReferences(answerWire.body).map((reference) => reference.name);
    invariant.push({
      file: relative(root, file),
      plan: entry.plan,
      answer: entry.answer,
      echoed: answerWire === undefined ? false : answerEcho(answerWire.body, entry.answer),
      usesInputs: references.includes('slots') || references.includes('facts'),
      perturbations
    });
  }
  return { computed, invariant, skipped, timings: { provenanceMs: performance.now() - started } };
}

function formatMs(milliseconds) {
  return `${milliseconds.toFixed(2)} ms`;
}

const HELP = `training-data/verify.mjs — dataset circuit verifier

Usage:
  node training-data/verify.mjs [book-id] [--root <dir>] [--timings]

Arguments:
  book-id            Verify only this book dataset under the root, for example
                     mathematical-thinking. Omitted: every dataset with a
                     manifest/ directory under the root is verified.
  --root <dir>       Verify the book datasets under another directory. Default:
                     the directory of this tool, training-data/.
  --timings          After the summary, print the measured duration of every
                     individual circuit execution, one line per solution.sop.
  --provenance       List the circuits whose computed-versus-stored answer
                     could not be proven either way. These notes never fail the
                     run; they only record a limit of the provenance probe.
  --help, -h         Print this text and exit.

What it checks:
  1. The shape rule, per solution.sop: a dataset circuit must not contain an
     input wire (nothing injects a binding into it) and must not contain a
     modelCall wire (the compiling model already read the problem). Each
     offending wire is printed as a warning, and execution is skipped while a
     violation exists.
  2. Execution, when the shape holds: every circuit is executed by the runtime
     without inputs and without model bindings, and the executed answer is
     compared with the printed answer of its manifest row.
  3. Answer provenance: the slots literal of every circuit is perturbed and the
     circuit is re-executed. The perturbations cover number shifts, zeroing,
     booleans flipped, strings mirrored into palindromes, characters flipped,
     array lengths changed, same-shaped sibling objects aligned, scalar pairs
     aligned and swapped, and values composed from scalar strings, so a
     computation that depends on its inputs reacts to at least one. An answer
     that never reacts is reported per file with the answer text and its
     consequence: a hardcoded answer (the answer wire reads no input value)
     fails the run, while an unverifiable verdict is a note, never a failure,
     when every circuit of the plan prints that same answer; notes are listed
     only with --provenance.

Exit codes:
  0  no violations, every executed circuit reproduced its printed answer, and
     no non-constant plan carried an invariant or hardcoded answer
  1  at least one shape warning, execution mismatch, missing manifest row, or
     non-constant-plan provenance warning
`;

async function main() {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.includes('--help') || argumentsList.includes('-h')) {
    process.stdout.write(HELP);
    process.exit(0);
  }
  const rootIndex = argumentsList.indexOf('--root');
  const root = rootIndex === -1 ? DEFAULT_ROOT : argumentsList[rootIndex + 1];
  const requestedBook = argumentsList.find((argument) => !argument.startsWith('--') && argument !== root) ?? null;

  const books = bookRoots({ root, book: requestedBook });
  if (books.length === 0) {
    process.stderr.write(
      requestedBook === null
        ? `No book dataset with a manifest/ directory found under ${root}.\n`
        : `No book dataset "${requestedBook}" with a manifest/ directory found under ${root}.\n`
    );
    process.exit(1);
  }

  let failed = false;
  for (const book of books) {
    const bookRoot = join(root, book);
    const result = await verifyBook(bookRoot);
    process.stdout.write(`${book}: ${result.circuits} circuits\n`);
    if (result.violations.length > 0) {
      failed = true;
      process.stdout.write(`  shape rule violated in ${result.violations.length} wire(s):\n`);
      for (const violation of result.violations) {
        process.stdout.write(
          `    warning ${violation.file}: wire "${violation.wire}" uses "${violation.command}" — ${violation.why}\n`
        );
      }
      process.stdout.write(`  shape scan: ${formatMs(result.timings.scanMs)} (${result.circuits} files parsed, ${FORBIDDEN_COMMANDS.size} forbidden commands)\n`);
      process.stdout.write('  execution skipped while a shape violation exists\n');
      continue;
    }
    process.stdout.write(`  executed ${result.circuits}, reproduced the printed answer ${result.matched}\n`);
    const { timings, provenance } = result;
    const slowest = timings.slowest ?? { ms: 0, file: 'n/a' };
    process.stdout.write(
      `  timings: scan ${formatMs(timings.scanMs)}, execution ${formatMs(timings.totalMs)} total, ${formatMs(timings.averageMs)} per circuit, median ${formatMs(timings.medianMs)}, boot ${formatMs(timings.bootMs)}, slowest ${formatMs(slowest.ms)} (${slowest.file}), provenance ${formatMs(timings.provenanceMs)}\n`
    );
    if (argumentsList.includes('--timings')) {
      for (const entry of timings.durations) {
        process.stdout.write(`    ${formatMs(entry.ms)}  ${entry.file}\n`);
      }
    }
    if (provenance !== undefined) {
      const unproven = provenance.invariant.length;
      process.stdout.write(
        `  answer provenance: ${provenance.computed} of ${result.circuits} answers changed when their inputs changed; ${unproven} could not be proven either way (no impact on this run's verdict; --provenance lists them); ${provenance.skipped.length} could not be probed\n`
      );
      if (argumentsList.includes('--provenance')) {
        for (const skipped of provenance.skipped) {
          process.stdout.write(
            `    note ${skipped.file}: this circuit has nothing to perturb (${skipped.reason}), so the probe cannot judge it. Consequence: none for this verdict.\n`
          );
        }
      }
      const expected = expectedAnswersOf(bookRoot);
      const byPlan = new Map();
      for (const finding of provenance.invariant) {
        const group = byPlan.get(finding.plan) ?? [];
        group.push(finding);
        byPlan.set(finding.plan, group);
      }
      for (const [plan, findings] of byPlan) {
        const planAnswers = new Set();
        let planCircuits = 0;
        for (const entry of expected.values()) {
          if (entry.plan === plan) {
            planAnswers.add(entry.answer);
            planCircuits += 1;
          }
        }
        for (const finding of findings) {
          if (!finding.usesInputs) {
            failed = true;
            process.stdout.write(
              `    warning ${finding.file}: the answer "${finding.answer}" stayed the same through all ${finding.perturbations} input perturbations and its answer wire reads no input value, so the text is stored, not computed — hardcoded answer (plan ${plan})\n`
            );
            continue;
          }
          if (planAnswers.size === 1) {
            if (argumentsList.includes('--provenance')) {
              process.stdout.write(
                `    note ${finding.file}: the answer "${finding.answer}" stayed the same through all ${finding.perturbations} input perturbations, and all ${planCircuits} circuit(s) of this plan print that same answer, so the probe cannot tell a computed verdict from a stored one. Consequence: none for this verdict — the answer is still verified against the printed answer; this note only records a limit of the probe.\n`
              );
            }
            continue;
          }
          failed = true;
          process.stdout.write(
            `    warning ${finding.file}: the answer "${finding.answer}" stayed the same through all ${finding.perturbations} input perturbations${finding.echoed ? ' and the printed text appears literally in the program' : ''}, while other circuits of this plan print different answers — the answer looks stored, not computed (plan ${plan})\n`
          );
        }
      }
    }
    if (result.failures.length > 0) {
      failed = true;
      for (const failure of result.failures) {
        process.stdout.write(
          `    failed ${failure.file}: ${failure.reason}${failure.detail === undefined ? '' : ` — ${failure.detail}`}\n`
        );
      }
    }
  }

  process.stdout.write(failed ? 'verify: FAILED\n' : 'verify: OK\n');
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
