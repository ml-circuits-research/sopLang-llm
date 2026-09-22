/**
 * Answer provenance of the shipped circuits.
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

import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { parseCircuit, serializeCircuit } from '../runtime/parser.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { findValueReferences } from '../runtime/dependencies.mjs';
import { stripProbeStatements } from '../teacher/families/probes.mjs';
import { normalizeAnswer } from '../teacher/naming.mjs';
import { expectedAnswersOf } from './dataset-manifest.mjs';

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

/**
 * The value with one character replaced by one it does not hold, chosen from the
 * lowercase alphabet. The length is preserved and the content provably differs,
 * so a computation over the characters of the value cannot return the same answer
 * unless it ignores the value entirely.
 */
function contentChanged(value) {
  const characters = [...String(value)];
  if (characters.length === 0) {
    return 'a';
  }
  // Deleting a character that occurs exactly once changes the *number* of distinct
  // characters, which is what a computation over the character set must react to. A
  // substitution alone does not: replacing one single-occurrence letter with another
  // leaves the count at the same value ("experimentation" holding "x" once becomes
  // "experimentation" holding "z" once), so a computing circuit would look stored.
  const counts = new Map();
  for (const character of characters) {
    counts.set(character, (counts.get(character) ?? 0) + 1);
  }
  const uniqueAt = characters.findIndex((character) => counts.get(character) === 1 && character !== ' ');
  if (uniqueAt === -1) {
    // Every character repeats, so the string is a run of repeated letters: adding a
    // new one raises the distinct count and is never absorbed.
    const held = new Set(characters);
    const fresh = 'zqxjvkwypbfgmhduconraltsie'.split('').find((letter) => !held.has(letter));
    return fresh === undefined ? `${value}x` : `${value}${fresh}`;
  }
  characters.splice(uniqueAt, 1);
  return characters.join('');
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

/**
 * Every pair of a short list. A boolean verdict over several numeric fields
 * (is the target reachable from the start with this step) only flips when one
 * field takes the value of another, and the pair that flips it is not always a
 * consecutive one, so the alignment probes cover all pairs of a small sample
 * instead of the consecutive pairs alone.
 */
function allPairs(list) {
  const pairs = [];
  for (let first = 0; first < list.length; first += 1) {
    for (let second = first + 1; second < list.length; second += 1) {
      pairs.push([list[first], list[second]]);
    }
  }
  return pairs;
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
    // A probe must be able to change what a string *contains*, not only what it is
    // concatenated with: appending a character can be absorbed by a computation over
    // the character set (appending "x" to a word already holding an "x" leaves its
    // distinct-letter count unchanged), so a computing circuit would look stored.
    // Replacing one character with one the value does not already hold changes the
    // content at the same length, which a character-level computation must react to.
    // It goes first because the candidate list is bounded.
    add(withEdits(strings, (value) => contentChanged(value)));
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
  for (const [first, second] of allPairs(sampleOf(scalarNumbers, 4))) {
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
    const references =
      answerWire === undefined ? [] : findValueReferences(stripProbeStatements(answerWire.body)).map((reference) => reference.name);
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
