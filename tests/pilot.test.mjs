import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { runPilot, verifyProblem, selectEvalSplit, planHashOf, findTextBlemishes } from '../teacher/pilot.mjs';
import { createRuntime } from '../runtime/kernel.mjs';

function syntheticProblem(id, statement, printedAnswer) {
  return {
    id,
    chapter: 99,
    title: 'Synthetic guarded template',
    statement,
    printedAnswer,
    steps: [],
    paragraphSpan: { from: 0, to: 0 }
  };
}

function syntheticEntry(overrides = {}) {
  return {
    template: 'Synthetic guarded template',
    type: 'synthetic-guarded-template',
    category: 'no-knowledge',
    parse: (statement) => ({ value: Number(statement.match(/\d+/)[0]) }),
    solve: (slots) => {
      if (slots.value === 13) {
        throw new Error('the value is unlucky');
      }
      return { doubled: slots.value * 2 };
    },
    render: (solution) => String(solution.doubled),
    compute: [
      'const slots = $slots;',
      'if (slots.value === 13) { throw new Error("the value is unlucky"); }',
      'return String(slots.value * 2);'
    ].join('\n'),
    explain: () => ['Doubling the value.'],
    ...overrides
  };
}

test('a family whose solve throws rejects that variant instead of aborting the run', async () => {
  const entry = syntheticEntry();
  const accepted = await verifyProblem({
    runtime: createRuntime(),
    entry,
    problem: syntheticProblem('99.1', 'Double 4.', '8')
  });
  assert.equal(accepted.accepted, true);
  const refused = await verifyProblem({
    runtime: createRuntime(),
    entry,
    problem: syntheticProblem('99.2', 'Double 13.', '26')
  });
  assert.equal(refused.accepted, false);
  assert.equal(refused.reason, 'oracle_failed:the value is unlucky');
});

test('a dataset circuit is the compiled plan of its instance, with no input or modelCall stage', async () => {
  const result = await verifyProblem({
    runtime: createRuntime(),
    entry: syntheticEntry(),
    problem: syntheticProblem('99.3', 'Double 4.', '8')
  });
  assert.equal(result.accepted, true);
  assert.match(result.program, /@slots literal/);
  assert.match(result.program, /@answer jsEval/);
  assert.match(result.program, /"value": 4/, 'the compiled values of the instance are carried by the circuit');
  assert.doesNotMatch(result.program, /@\w+ input/);
  assert.doesNotMatch(result.program, /modelCall/);
});

test('near-identical plans land on one side of the holdout split', () => {
  const item = (id, template, program) => ({
    problem: { id, templateKey: template, type: 'shared', chapter: 1 },
    entry: { category: 'no-knowledge', compute: 'return "the same deterministic plan";' },
    verification: { program }
  });
  // Two templates compile to the same plan (same compute body) while their
  // circuits differ because each embeds its own instance values: a plan-aware
  // split must keep them together, because evaluating one while training on the
  // other overstates generalization.
  const accepted = [item('1.1', 'Template A', 'CIRCUIT-WITH-VALUE-1'), item('1.2', 'Template B', 'CIRCUIT-WITH-VALUE-2')];
  const split = selectEvalSplit(accepted);
  assert.equal(split.size, 2, 'the whole shared-plan cluster is taken as one unit');
  const evalPlans = new Set(accepted.filter((candidate) => split.has(candidate.problem.id)).map((candidate) => planHashOf(candidate)));
  const trainPlans = new Set(accepted.filter((candidate) => !split.has(candidate.problem.id)).map((candidate) => planHashOf(candidate)));
  for (const plan of evalPlans) {
    assert.equal(trainPlans.has(plan), false, 'no eval plan appears in the training rows');
  }
});

test('the text blemish scan reports source words glued to digits', () => {
  const findings = findTextBlemishes([
    { id: '1.1', title: 'Fine statement', statement: 'It shows 0 or1 tokens and 4th place.' },
    { id: '1.2', title: 'Clean statement', statement: 'It shows 0 or 1 tokens.' }
  ]);
  assert.deepEqual(findings, ['1.1: or1']);
});

test('the Romanian polarity answers of chapter 19 are quarantined under one rule', async () => {
  const result = await runPilot({ chapters: [19], write: false });
  const quarantined = result.rejected.filter((item) => item.reason === 'quarantine:non-english-answer-token');
  assert.deepEqual(
    quarantined.map((item) => item.problem.id).sort(),
    ['19.11', '19.12', '19.13', '19.14', '19.15']
  );
  assert.equal(result.accepted.length, 20);
});

test('a decorative fact keyword guard is recognised by the family review', async () => {
  const { factKeywordGuardOf } = await import('../teacher/families/index.mjs');
  const guarded = factKeywordGuardOf({
    category: 'knowledge',
    compute: 'if (!String($facts.mean).includes("divided by")) { throw new Error("missing"); }'
  });
  assert.match(guarded, /String\(\$facts\.mean\)\.includes\("divided by"\)/);
  assert.equal(
    factKeywordGuardOf({ category: 'knowledge', compute: 'const scale = $facts.minutesPerHour;' }),
    null
  );
  assert.equal(
    factKeywordGuardOf({ category: 'no-knowledge', compute: 'if (!String($facts.x).includes("y")) {}' }),
    null,
    'the guard lint applies to knowledge cases only'
  );
});

test('a knowledge fact that the computation does not consume is rejected', async () => {
  const decorative = syntheticEntry({
    category: 'knowledge',
    facts: JSON.stringify({ mean: 'the sum of the values divided by how many values there are' }),
    compute: ['const slots = $slots;', 'return String(slots.value * 2);'].join('\n')
  });
  const refused = await verifyProblem({
    runtime: createRuntime(),
    entry: decorative,
    problem: syntheticProblem('99.5', 'Double 4.', '8')
  });
  assert.equal(refused.accepted, false);
  assert.equal(refused.reason, 'fact_not_load_bearing');

  const consumed = syntheticEntry({
    category: 'knowledge',
    facts: JSON.stringify({ factor: 2 }),
    compute: ['const slots = $slots;', 'return String(slots.value * $facts.factor);'].join('\n')
  });
  const accepted = await verifyProblem({
    runtime: createRuntime(),
    entry: consumed,
    problem: syntheticProblem('99.6', 'Double 4.', '8')
  });
  assert.equal(accepted.accepted, true);
});

test('a statement that references an earlier problem ships with its referenced context', async () => {
  const outputRoot = mkdtempSync(join(tmpdir(), 'soplang-pilot-ref-'));
  try {
    const result = await runPilot({ chapters: [38], write: true, outputRoot });
    const item = result.accepted.find((candidate) => candidate.problem.id === '38.19');
    assert.ok(item !== undefined, 'the referenced item is accepted');
    const relative = [
      ...(result.split.has('38.19') ? ['eval'] : []),
      item.entry.category,
      item.problem.type,
      item.problem.folder
    ].join('/');
    const problem = readFileSync(join(outputRoot, 'mathematical-thinking', ...relative.split('/'), 'problem.md'), 'utf8');
    assert.match(problem, /Referenced context: /);
    assert.match(problem, /red→2, green→5, blue→7/);
  } finally {
    rmSync(outputRoot, { recursive: true, force: true });
  }
});

test('the pilot verifies the chapter 1 families by executing their circuits', async () => {
  const result = await runPilot({ chapters: [1], write: false });
  assert.equal(result.accepted.length, 25);
  assert.equal(result.rejected.length, 0);
  for (const item of result.accepted) {
    assert.equal(item.verification.verification.class, 'exact_verified');
    assert.equal(item.verification.computed.length > 0, true);
  }
  const plans = new Set(result.accepted.map((item) => planHashOf(item)));
  assert.equal(plans.size, 5, 'five templates produce five distinct plans');
});

test('the evaluation holdout is deterministic and never splits a template', async () => {
  const first = await runPilot({ chapters: [1], write: false });
  const second = await runPilot({ chapters: [1], write: false });
  assert.deepEqual([...first.split].sort(), [...second.split].sort());
  const templatesInSplit = new Set(
    first.accepted.filter((item) => first.split.has(item.problem.id)).map((item) => item.problem.templateKey)
  );
  for (const template of templatesInSplit) {
    const variants = first.accepted.filter((item) => item.problem.templateKey === template);
    assert.equal(variants.every((item) => first.split.has(item.problem.id)), true, `${template} is split across the holdout`);
  }
});

test('the dataset layout holds three text artifacts per problem and a text manifest', async () => {
  const outputRoot = mkdtempSync(join(tmpdir(), 'soplang-pilot-'));
  try {
    const result = await runPilot({ chapters: [1], write: true, outputRoot });
    const root = join(outputRoot, 'mathematical-thinking');
    const trainFolder = join(root, 'no-knowledge', 'order-in-a-line', '1.1-order-in-a-line-1');
    assert.deepEqual(readdirSync(trainFolder).sort(), ['explanation.md', 'problem.md', 'solution.sop']);

    const problem = readFileSync(join(trainFolder, 'problem.md'), 'utf8');
    assert.equal(problem.includes('Ana, Mara, Daria, Luca'), false, 'the statement file never carries the answer');
    assert.equal(problem.includes('Abstract model'), false, 'the statement file never carries the reference model');

    const explanation = readFileSync(join(trainFolder, 'explanation.md'), 'utf8');
    assert.equal(explanation.includes('## Explanation'), true);
    assert.equal(explanation.includes('## Result'), true);
    assert.equal(explanation.includes('**Answer.** Ana, Mara, Daria, Luca.'), true);

    const program = readFileSync(join(trainFolder, 'solution.sop'), 'utf8');
    assert.match(program, /@slots literal/);
    assert.match(program, /@answer jsEval/);
    assert.doesNotMatch(program, /modelCall|@problem input/);

    const index = readFileSync(join(root, 'manifest.md'), 'utf8');
    assert.equal(index.split('\n').filter((line) => /^\| \d+ \|/.test(line)).length, 1, 'the index covers chapter 1');

    const manifest = readFileSync(join(root, 'manifest', 'chapter-01.md'), 'utf8');
    assert.equal(
      manifest.split('\n').filter((line) => line.startsWith('| no-knowledge/') || line.startsWith('| eval/')).length,
      result.accepted.length
    );

    const report = readFileSync(join(root, 'report.md'), 'utf8');
    assert.match(report, /## Accepted by category/);
    assert.match(report, /## Family integrity checks/);
    assert.equal(existsSync(join(outputRoot, 'sources.md')), true);

    const evalFolders = readdirSync(join(root, 'eval', 'no-knowledge'));
    for (const problemId of result.split) {
      const folderName = result.accepted.find((item) => item.problem.id === problemId).problem.folder;
      const inTrainingSets = ['no-knowledge', 'knowledge'].some((category) => {
        const categoryPath = join(root, category);
        if (!existsSync(categoryPath)) {
          return false;
        }
        return readdirSync(categoryPath).some((type) => existsSync(join(categoryPath, type, folderName)));
      });
      assert.equal(inTrainingSets, false, `${folderName} appears in a training set and in the holdout`);
    }
    assert.ok(evalFolders.length > 0);
  } finally {
    rmSync(outputRoot, { recursive: true, force: true });
  }
});
