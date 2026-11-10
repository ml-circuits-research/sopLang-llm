// Structure of the training programs before and after the split-target refactoring (Informatica, Section 5.3).
// Reads training/data/all-books.jsonl at the commits whose SHA-256 equals the dataset_sha256 recorded in each
// run's training manifest, counts computation (jsEval) wires per program, and checks whether the scheduling
// book's programs changed between data versions. Usage: node article/scripts/split-target-training-programs.mjs
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parseCircuit } from '../../runtime/parser.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const VERSIONS = [
  ['dv7 compact targets (exp-021)', '9aba95b08', '6b6b60927656e85625de16c7b80abb64862c2f27d10852c9d4db91398970a150'],
  ['dv8 split targets (exp-022)', '9a561fccd', 'edc319172bb0a9171c935280f3057844108c8f6f0982907ac125cef51de325c2'],
  ['dv9 container idiom (exp-023)', '45c7b4276', '50733d1c4ace81b891b34d80bdb1c4bdd1d138ff9f50403791294d4782eee926'],
  ['dv10 recorded revert (not trained)', '3eebc5984', null],
  ['dv11 phrase compression (exp-024)', 'e230b2146', '56804f8d740008e4f8baabb2adfa5ff9199b01d477b59632a29e3723b99ef6bc'],
  ['dv12 statement simplification (exp-025)', 'e494ddbf5', '699f0689816590bddb7b5a9e0f285500fd769f27a973ab521ac8b3a6a6fe2a2d'],
  ['dv13 final data (exp-026, exp-027)', 'df3602594', 'cfc01567a712dfa424582b98f3d0b51d2655ed0b580ae9963c7bb8ad144ab064']
];
const SCHEDULING_BOOK = 'decompose-to-solve';

function rowsAt(commit, expectedSha) {
  const text = execFileSync('git', ['show', `${commit}:training/data/all-books.jsonl`], { cwd: root, maxBuffer: 1 << 30, encoding: 'utf8' });
  const sha = createHash('sha256').update(text).digest('hex');
  if (expectedSha && sha !== expectedSha) throw new Error(`${commit}: dataset hash ${sha} does not match the run manifest`);
  return { sha, rows: text.split('\n').filter(Boolean).map((line) => JSON.parse(line)) };
}
const programOf = (row) => row.messages.find((message) => message.role === 'assistant')?.content ?? '';
const jsEvalWires = (program) => { try { return parseCircuit(program).wires.filter((wire) => wire.command === 'jsEval').length; } catch { return null; } };

const programsByVersion = {};
for (const [label, commit, expected] of VERSIONS) {
  const { sha, rows } = rowsAt(commit, expected);
  const book = rows.filter((row) => row.meta?.book !== 'procedural-arithmetic');
  const scheduling = rows.filter((row) => row.meta?.book === SCHEDULING_BOOK);
  const count = (list) => list.reduce((sum, row) => sum + (jsEvalWires(programOf(row)) ?? 0), 0);
  const multi = scheduling.filter((row) => (jsEvalWires(programOf(row)) ?? 0) >= 2).length;
  programsByVersion[label] = new Map(scheduling.map((row) => [row.meta.folder, programOf(row)]));
  // The habits the split-trained model showed on the held-out scheduling problems, counted in the training programs:
  // a keyed map of numbers in the slots literal, an assertion that a computed value stays within a limit, and a .values() call.
  const keyedMap = (program) => { const match = /@slots literal\n([\s\S]*?)\n\n@/.exec(program); if (!match) return false;
    try { return Object.values(JSON.parse(match[1])).some((value) => value && typeof value === 'object' && !Array.isArray(value)
      && Object.keys(value).length >= 2 && Object.values(value).every((inner) => typeof inner === 'number')); } catch { return false; } };
  const limitProbe = /probe\(\s*[^,;]*?(?:<=?\s*[^,;]*limit|limit\w*\s*>=?\s*(?!\d)[A-Za-z_$])/i;
  const habits = { keyedMap: 0, limitProbe: 0, valuesCall: 0 };
  for (const row of rows) {
    const program = programOf(row);
    if (keyedMap(program)) habits.keyedMap++;
    if (limitProbe.test(program)) habits.limitProbe++;
    if (/\.values\(\)/.test(program.replace(/Object\.values\(/g, ''))) habits.valuesCall++;
  }
  console.log(`${label} @ ${commit} (sha256 ${sha.slice(0, 12)}; ${expected ? 'matches the run manifest' : 'no run'})`);
  console.log(`  rows ${rows.length}; book-derived rows ${book.length}, jsEval wires in them ${count(book)}`);
  console.log(`  ${SCHEDULING_BOOK} rows ${scheduling.length}: jsEval wires ${count(scheduling)} (mean ${(count(scheduling) / scheduling.length).toFixed(2)}), programs with two or more jsEval wires ${multi}`);
  console.log(`  training programs with a keyed map of numbers in slots ${habits.keyedMap}, with a within-the-limit assertion ${habits.limitProbe}, with a .values() call ${habits.valuesCall}`);
}
// Are the scheduling book's programs identical between versions?
const labels = Object.keys(programsByVersion);
for (let index = 1; index < labels.length; index++) {
  const before = programsByVersion[labels[index - 1]], after = programsByVersion[labels[index]];
  let same = 0, changed = 0, missing = 0;
  for (const [folder, program] of after) { if (!before.has(folder)) missing++; else if (before.get(folder) === program) same++; else changed++; }
  console.log(`${SCHEDULING_BOOK} programs, ${labels[index - 1]} -> ${labels[index]}: identical ${same}, changed ${changed}, new ${missing}`);
}
const dv8 = programsByVersion[labels[1]];
for (const label of labels.slice(3)) {
  const programs = programsByVersion[label];
  let same = 0; for (const [folder, program] of programs) if (dv8.get(folder) === program) same++;
  console.log(`${SCHEDULING_BOOK} programs identical to dv8 in ${label}: ${same} of ${programs.size}`);
}
