import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { scanShape, verifyExecution, verifyBook, verifyProvenance, expectedAnswersOf } from '../training-data/verify.mjs';

const VERIFY_TOOL = fileURLToPath(new URL('../training-data/verify.mjs', import.meta.url));
const HASH = '0123456789ab';

/**
 * A minimal book dataset fixture: one manifest row and one problem folder with
 * the three text artifacts. The circuit returns the printed answer unless the
 * caller replaces the body.
 */
function makeFixture({ answer = '7.', circuit } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'soplang-verify-'));
  const book = join(root, 'fixture-book');
  const folder = 'no-knowledge/order-in-a-line/1.1-order-in-a-line-1';
  const problemDirectory = join(book, folder);
  mkdirSync(join(book, 'manifest'), { recursive: true });
  mkdirSync(problemDirectory, { recursive: true });
  writeFileSync(
    join(book, 'manifest', 'chapter-01.md'),
    `| ${folder} | 1.1 | 1 | Order in a Line | order-in-a-line | no-knowledge | train | 1-5 | ${answer} | ${HASH} | ${HASH} | ${HASH} | ${HASH} |\n`
  );
  writeFileSync(join(problemDirectory, 'problem.md'), '# 1.1 — Fixture\n\nA fixture problem.\n');
  writeFileSync(join(problemDirectory, 'explanation.md'), '# Explanation\n\n**Answer.** Fixture.\n');
  writeFileSync(
    join(problemDirectory, 'solution.sop'),
    circuit ?? '@slots literal\n{}\n\n@answer jsEval\nreturn "7.";\n'
  );
  return { root, book, folder, problemDirectory };
}

function cleanup(root) {
  rmSync(root, { recursive: true, force: true });
}

test('the shape scan reports input and modelCall wires and accepts the compiled plan', () => {
  const fixture = makeFixture();
  try {
    const compliant = scanShape(fixture.book, [join(fixture.problemDirectory, 'solution.sop')]);
    assert.deepEqual(compliant, []);

    writeFileSync(
      join(fixture.problemDirectory, 'solution.sop'),
      '@problem input\n\n@slots literal\n{}\n\n@answer jsEval\nreturn "7.";\n'
    );
    const withInput = scanShape(fixture.book, [join(fixture.problemDirectory, 'solution.sop')]);
    assert.equal(withInput.length, 1);
    assert.equal(withInput[0].command, 'input');
    assert.equal(withInput[0].wire, 'problem');

    writeFileSync(
      join(fixture.problemDirectory, 'solution.sop'),
      '@slots literal\n{}\n\n@parsed modelCall\nExtract.\n\n@answer jsEval\nreturn "7.";\n'
    );
    const withModelCall = scanShape(fixture.book, [join(fixture.problemDirectory, 'solution.sop')]);
    assert.equal(withModelCall.length, 1);
    assert.equal(withModelCall[0].command, 'modelCall');
  } finally {
    cleanup(fixture.root);
  }
});

test('the execution check runs a compiled plan without inputs or models and compares the printed answer', async () => {
  const fixture = makeFixture();
  try {
    const files = [join(fixture.problemDirectory, 'solution.sop')];
    const good = await verifyExecution(fixture.book, files);
    assert.equal(good.matched, 1);
    assert.deepEqual(good.failures, []);

    writeFileSync(join(fixture.problemDirectory, 'solution.sop'), '@slots literal\n{}\n\n@answer jsEval\nreturn "8.";\n');
    const mismatched = await verifyExecution(fixture.book, files);
    assert.equal(mismatched.matched, 0);
    assert.equal(mismatched.failures.length, 1);
    assert.equal(mismatched.failures[0].reason, 'answer mismatch');
  } finally {
    cleanup(fixture.root);
  }
});

test('a circuit that reads the manifest answers through the runtime without extra bindings', async () => {
  const fixture = makeFixture({
    answer: '12',
    circuit: '@slots literal\n{"a": 5, "b": 7}\n\n@answer jsEval\nconst slots = $slots;\nreturn String(slots.a + slots.b);\n'
  });
  try {
    const result = await verifyBook(fixture.book);
    assert.equal(result.violations.length, 0);
    assert.equal(result.executed, true);
    assert.equal(result.matched, 1);
    assert.deepEqual(result.failures, []);
    assert.equal(expectedAnswersOf(fixture.book).size, 1);
    assert.equal(result.provenance.computed, 1, 'a computing circuit reacts to a perturbed slots literal');
    assert.equal(result.provenance.invariant.length, 0);
  } finally {
    cleanup(fixture.root);
  }
});

test('the provenance probe separates a computed answer from a stored one', async () => {
  const computed = makeFixture({
    answer: '12',
    circuit: '@slots literal\n{"a": 5, "b": 7}\n\n@answer jsEval\nconst slots = $slots;\nreturn String(slots.a + slots.b);\n'
  });
  try {
    const result = await verifyProvenance(computed.book, [join(computed.problemDirectory, 'solution.sop')]);
    assert.equal(result.computed, 1);
    assert.equal(result.invariant.length, 0);
  } finally {
    cleanup(computed.root);
  }

  const stored = makeFixture({
    answer: '42 units.',
    circuit: '@slots literal\n{"a": 5}\n\n@answer jsEval\nreturn "42 units.";\n'
  });
  try {
    const result = await verifyProvenance(stored.book, [join(stored.problemDirectory, 'solution.sop')]);
    assert.equal(result.computed, 0);
    assert.equal(result.invariant.length, 1);
    assert.equal(result.invariant[0].usesInputs, false, 'the answer wire reads no input value');
    assert.equal(result.invariant[0].echoed, true, 'the printed text appears literally in the program');
  } finally {
    cleanup(stored.root);
  }
});

test('the command line fails on a hardcoded answer even for a single-variant plan', () => {
  const fixture = makeFixture({
    answer: '42.',
    circuit: '@slots literal\n{"a": 5}\n\n@answer jsEval\nreturn "42.";\n'
  });
  try {
    const result = spawnSync(process.execPath, [VERIFY_TOOL, '--root', fixture.root], { encoding: 'utf8' });
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stdout, /warning .*hardcoded answer/);
    assert.match(result.stdout, /verify: FAILED/);
  } finally {
    cleanup(fixture.root);
  }
});

test('unproven verdicts are silent by default and listed with --provenance', () => {
  const fixture = makeFixture({
    answer: 'No.',
    circuit: '@slots literal\n{"a": 5}\n\n@answer jsEval\nconst slots = $slots;\nreturn "No.";\n'
  });
  try {
    const quiet = spawnSync(process.execPath, [VERIFY_TOOL, '--root', fixture.root], { encoding: 'utf8' });
    assert.equal(quiet.status, 0, quiet.stdout);
    assert.match(quiet.stdout, /could not be proven either way/);
    assert.doesNotMatch(quiet.stdout, /note /);

    const detailed = spawnSync(process.execPath, [VERIFY_TOOL, '--root', fixture.root, '--provenance'], { encoding: 'utf8' });
    assert.equal(detailed.status, 0, detailed.stdout);
    assert.match(detailed.stdout, /note .*Consequence: none for this verdict/);
  } finally {
    cleanup(fixture.root);
  }
});

test('the command line reports a clean dataset as OK and a shape violation as a failure', () => {
  const fixture = makeFixture();
  try {
    const ok = spawnSync(process.execPath, [VERIFY_TOOL, '--root', fixture.root], { encoding: 'utf8' });
    assert.equal(ok.status, 0, ok.stdout);
    assert.match(ok.stdout, /verify: OK/);
    assert.match(ok.stdout, /reproduced the printed answer 1/);

    writeFileSync(
      join(fixture.problemDirectory, 'solution.sop'),
      '@problem input\n\n@slots literal\n{}\n\n@answer jsEval\nreturn "7.";\n'
    );
    const violated = spawnSync(process.execPath, [VERIFY_TOOL, '--root', fixture.root], { encoding: 'utf8' });
    assert.equal(violated.status, 1, violated.stdout);
    assert.match(violated.stdout, /warning .*wire "problem" uses "input"/);
    assert.match(violated.stdout, /execution skipped while a shape violation exists/);
    assert.match(violated.stdout, /verify: FAILED/);
  } finally {
    cleanup(fixture.root);
  }
});

test('the help flag describes every supported argument and exits zero', () => {
  for (const flag of ['--help', '-h']) {
    const result = spawnSync(process.execPath, [VERIFY_TOOL, flag], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Usage:/);
    assert.match(result.stdout, /book-id/);
    assert.match(result.stdout, /--root <dir>/);
    assert.match(result.stdout, /--timings/);
    assert.match(result.stdout, /--help, -h/);
    assert.match(result.stdout, /Exit codes:/);
  }
});
