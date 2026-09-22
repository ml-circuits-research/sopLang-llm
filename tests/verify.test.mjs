import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { scanShape, verifyExecution, verifyBook, verifyAmbiguity } from '../training-data/verify.mjs';
import { expectedAnswersOf } from '../training-data/dataset-manifest.mjs';
import { writeDataset } from '../teacher/dataset.mjs';
import { verifyProvenance } from '../training-data/provenance.mjs';
import { answerBody } from '../teacher/families/probes.mjs';

const VERIFY_TOOL = fileURLToPath(new URL('../training-data/verify.mjs', import.meta.url));
const HASH = '0123456789ab';

/** A dataset circuit: the slots literal plus the probe-wrapped answer body. */
function program(body, slots = '{"value": 1}') {
  return `@slots literal\n${slots}\n\n@answer jsEval\n${answerBody(body)}\n`;
}

/**
 * A minimal book dataset fixture: one manifest row and one problem folder with
 * the three text artifacts. The circuit returns the printed answer unless the
 * caller replaces the program.
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
    [
      '| folder | problem | chapter | template | type | category | split | paragraphs | answer | plan | problem | solution | explanation |',
      '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
      `| ${folder} | 1.1 | 1 | Order in a Line | order-in-a-line | no-knowledge | train | 1-5 | ${answer} | ${HASH} | ${HASH} | ${HASH} | ${HASH} |`,
      ''
    ].join('\n')
  );
  writeFileSync(join(problemDirectory, 'problem.md'), '# 1.1 — Fixture\n\nA fixture problem.\n');
  writeFileSync(join(problemDirectory, 'explanation.md'), '# Explanation\n\n**Answer.** Fixture.\n');
  writeFileSync(
    join(problemDirectory, 'solution.sop'),
    circuit ?? program('const slots = $slots;\nreturn String(slots.value);', '{"value": 7}')
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
      `@problem input\n\n@slots literal\n{}\n\n@answer jsEval\n${answerBody('return "7.";')}\n`
    );
    const withInput = scanShape(fixture.book, [join(fixture.problemDirectory, 'solution.sop')]);
    assert.equal(withInput.length, 1);
    assert.equal(withInput[0].command, 'input');
    assert.equal(withInput[0].wire, 'problem');

    writeFileSync(
      join(fixture.problemDirectory, 'solution.sop'),
      `@slots literal\n{}\n\n@parsed modelCall\nExtract.\n\n@answer jsEval\n${answerBody('return "7.";')}\n`
    );
    const withModelCall = scanShape(fixture.book, [join(fixture.problemDirectory, 'solution.sop')]);
    assert.equal(withModelCall.length, 1);
    assert.equal(withModelCall[0].command, 'modelCall');
  } finally {
    cleanup(fixture.root);
  }
});

test('the shape scan refuses a forbidden wire and accepts a bare computation', () => {
  // The generic input and output contract belongs to the `jsEval` command, so a
  // `jsEval` stage that asserts nothing of its own is a valid shape; what the scan
  // still refuses is a circuit that re-states its own input or re-parses itself.
  const bare = makeFixture({ circuit: '@slots literal\n{"value": 7}\n\n@answer jsEval\nreturn "7.";\n' });
  try {
    assert.deepEqual(scanShape(bare.book, [join(bare.problemDirectory, 'solution.sop')]), []);
  } finally {
    cleanup(bare.root);
  }
  const forbidden = makeFixture({ circuit: '@slots literal\n{"value": 7}\n\n@answer input\nreturn "7.";\n' });
  try {
    const violations = scanShape(forbidden.book, [join(forbidden.problemDirectory, 'solution.sop')]);
    assert.equal(violations.length, 1);
    assert.equal(violations[0].command, 'input');
    assert.match(violations[0].why, /re-states data/);
  } finally {
    cleanup(forbidden.root);
  }
});

test('the execution check runs a compiled plan without inputs or models and compares the printed answer', async () => {
  const fixture = makeFixture();
  try {
    const files = [join(fixture.problemDirectory, 'solution.sop')];
    const good = await verifyExecution(fixture.book, files);
    assert.equal(good.matched, 1);
    assert.deepEqual(good.failures, []);

    writeFileSync(join(fixture.problemDirectory, 'solution.sop'), program('return "8.";'));
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
    circuit: program('const slots = $slots;\nreturn String(slots.a + slots.b);', '{"a": 5, "b": 7}')
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
    circuit: program('const slots = $slots;\nreturn String(slots.a + slots.b);', '{"a": 5, "b": 7}')
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
    circuit: program('return "42 units.";', '{"a": 5}')
  });
  try {
    const result = await verifyProvenance(stored.book, [join(stored.problemDirectory, 'solution.sop')]);
    assert.equal(result.computed, 0);
    assert.equal(result.invariant.length, 1);
    assert.equal(result.invariant[0].usesInputs, false, 'only the probe assertions read the slots wire');
    assert.equal(result.invariant[0].echoed, true, 'the printed text appears literally in the program');
  } finally {
    cleanup(stored.root);
  }
});

test('the command line fails on a hardcoded answer even for a single-variant plan', () => {
  const fixture = makeFixture({
    answer: '42.',
    circuit: program('return "42.";', '{"a": 5}')
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
    circuit: program('const slots = $slots;\nreturn "No.";', '{"a": 5}')
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
      `@problem input\n\n@slots literal\n{}\n\n@answer jsEval\n${answerBody('return "7.";')}\n`
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
    // The usage text describes the shape rule as it stands: the generic input and
    // output assertions belong to the jsEval command, so the help names the forbidden
    // wires rather than a probe preamble no longer required of a target.
    assert.match(result.stdout, /must not contain an\s+input wire/);
    assert.match(result.stdout, /jsEval command/);
    assert.match(result.stdout, /--help, -h/);
    assert.match(result.stdout, /Exit codes:/);
  }
});

test('identical statements with different printed answers fail the ambiguity check', async () => {
  const fixture = makeFixture();
  try {
    const secondFolder = 'no-knowledge/order-in-a-line/1.2-order-in-a-line-2';
    const secondDirectory = join(fixture.book, secondFolder);
    mkdirSync(secondDirectory, { recursive: true });
    writeFileSync(join(secondDirectory, 'problem.md'), '# 1.2 — Fixture\n\nA fixture problem.\n');
    writeFileSync(join(secondDirectory, 'explanation.md'), '# Explanation\n\n**Answer.** Fixture.\n');
    writeFileSync(
      join(secondDirectory, 'solution.sop'),
      program('const slots = $slots;\nreturn String(slots.value);', '{"value": 7}')
    );
    const manifest = join(fixture.book, 'manifest', 'chapter-01.md');
    writeFileSync(
      manifest,
      `${readFileSync(manifest, 'utf8').trimEnd()}\n| ${secondFolder} | 1.2 | 1 | Order in a Line | order-in-a-line | no-knowledge | train | 1-5 | 8. | ${HASH} | ${HASH} | ${HASH} | ${HASH} |\n`
    );

    const files = [join(fixture.problemDirectory, 'solution.sop'), join(secondDirectory, 'solution.sop')];
    const ambiguous = verifyAmbiguity(fixture.book, files);
    assert.equal(ambiguous.length, 2);
    assert.equal(ambiguous[0].reason, 'ambiguous statement');

    const result = await verifyBook(fixture.book);
    assert.equal(result.executed, false);
    assert.equal(result.failures.length, 2);

    const cli = spawnSync(process.execPath, [VERIFY_TOOL, '--root', fixture.root], { encoding: 'utf8' });
    assert.equal(cli.status, 1, cli.stdout);
    assert.match(cli.stdout, /ambiguous statement/);
  } finally {
    cleanup(fixture.root);
  }
});

test('a manifest cell keeps a column separator that belongs to the answer', () => {
  const outputRoot = mkdtempSync(join(tmpdir(), 'soplang-cell-'));
  try {
    const source = {
      id: 'fixture-manifest-book',
      path: 'vision/fixture.docx',
      unitLabel: 'chapter',
      unitOf: () => 1,
      manifestFile: (unit) => `chapter-${String(unit).padStart(2, '0')}.md`,
      secondary: null,
      rights: 'fixture',
      permittedUse: 'fixture'
    };
    const registration = { rawHash: HASH, canonicalHash: HASH, extractor: 'fixture', paragraphs: [] };
    const problem = {
      id: '1.1',
      order: 1,
      title: 'Fixture',
      type: 'fixture',
      folder: '1.1-fixture',
      templateKey: 'Fixture',
      chapter: 1,
      printedAnswer: 'Level one | level two',
      statement: 'A fixture problem.',
      steps: [],
      paragraphSpan: { from: 1, to: 2 }
    };
    const item = {
      problem,
      entry: { category: 'no-knowledge', explain: () => ['Fixture.'], compute: 'return "";', facts: null },
      verification: { program: '@slots literal\n{}\n', verification: { class: 'exact_verified' }, solution: {}, parsedSlots: {} }
    };
    const computed = {
      problem: { ...problem, id: '1.2', folder: '1.2-fixture', title: 'Computed fixture', printedAnswer: 'The source prints one of several valid answers.' },
      entry: {
        category: 'no-knowledge',
        explain: () => ['Fixture.'],
        compute: 'return "";',
        facts: null,
        printedAnswerStatus: 'alternative',
        printedAnswerReason: 'the task admits several valid answers'
      },
      verification: {
        program: '@slots literal\n{}\n',
        verification: { class: 'computed_verified', printedStatus: 'alternative' },
        solution: {},
        parsedSlots: {}
      },
      shippedAnswer: 'The computed answer.'
    };
    writeDataset({ source, registration, accepted: [item, computed], rejected: [], split: new Set(), outputRoot });

    const manifest = readFileSync(join(outputRoot, source.id, 'manifest', 'chapter-01.md'), 'utf8');
    assert.equal(manifest.includes('Level one \\| level two'), true, 'the writer escapes the separator');
    const header = manifest.split('\n').find((line) => line.startsWith('| folder'));
    assert.equal(header.split('|').map((cell) => cell.trim()).includes('status'), true, 'the manifest records the answer status');
    assert.equal(manifest.includes('| match |') || manifest.includes(' match |'), true);
    assert.equal(manifest.includes('alternative'), true, 'the computed example records its printed-answer status');
    const expected = expectedAnswersOf(join(outputRoot, source.id));
    assert.equal(expected.get('no-knowledge/fixture/1.1-fixture').answer, 'Level one | level two');
    assert.equal(expected.get('no-knowledge/fixture/1.2-fixture').answer, 'The computed answer.');
    const explanation = readFileSync(join(outputRoot, source.id, 'no-knowledge', 'fixture', '1.2-fixture', 'explanation.md'), 'utf8');
    assert.match(explanation, /\*\*Source answer\.\*\* The source prints one of several valid answers\./);
    assert.match(explanation, /\*\*Answer\.\*\* The computed answer\./);
  } finally {
    rmSync(outputRoot, { recursive: true, force: true });
  }
});
