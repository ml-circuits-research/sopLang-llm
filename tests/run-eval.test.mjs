import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { CLASSES, aggregate, classifyItem, resolveSlice, runSlice } from '../evaluation/run-eval.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { answerBody } from '../teacher/families/probes.mjs';

const HASH = '0123456789ab';
const runtime = createRuntime();

/** A dataset circuit: the slots literal plus the probe-wrapped answer body. */
function program(body, slots = '{"value": 7}') {
  return `@slots literal\n${slots}\n\n@answer jsEval\n${answerBody(body)}\n`;
}

function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

function cleanup(root) {
  rmSync(root, { recursive: true, force: true });
}

test('a compiled plan that reproduces the manifest answer is an answer_match', async () => {
  const verdict = await classifyItem({
    completion: program('const slots = $slots;\nreturn String(slots.value);'),
    oracle: '7',
    runtime
  });
  assert.equal(verdict.className, 'answer_match');
  assert.equal(verdict.answer, '7');
  assert.equal(verdict.detail, null);
});

test('the same plan computing another value is an answer_mismatch', async () => {
  const verdict = await classifyItem({
    completion: program('const slots = $slots;\nreturn String(slots.value + 1);'),
    oracle: '7',
    runtime
  });
  assert.equal(verdict.className, 'answer_mismatch');
  assert.equal(verdict.answer, '8');
});

test('prose is rejected by the post-processor before any parser runs', async () => {
  const prose = await classifyItem({ completion: 'The answer is 7.\n', oracle: '7', runtime });
  assert.equal(prose.className, 'wrapper_rejected');
  assert.equal(prose.detail, 'no_wire_declaration');

  const aroundFence = await classifyItem({
    completion: `Here is the program:\n\n\`\`\`\n${program('return String($slots.value);')}\`\`\`\n`,
    oracle: '7',
    runtime
  });
  assert.equal(aroundFence.className, 'wrapper_rejected');
  assert.equal(aroundFence.detail, 'prose_outside_fence');
});

test('a program the runtime parser rejects is a parse_invalid', async () => {
  // The completion passes the D10 wrapper (bare text starting with `@`) but is
  // not valid SOP Lang: the model declared the answer wire twice. The ladder
  // runs parseCircuit before the runtime, so this never reaches execution.
  const duplicated = `${program('return String($slots.value);')}\n@answer jsEval\n${answerBody('return String($slots.value);')}\n`;
  const verdict = await classifyItem({ completion: duplicated, oracle: '7', runtime });
  assert.equal(verdict.className, 'parse_invalid');
  assert.match(verdict.detail, /parse_error/);
  assert.equal(verdict.answer, null);
});

test('an answer wire that reads an undeclared value is a graph_invalid', async () => {
  const verdict = await classifyItem({ completion: program('return String($missing);'), oracle: '7', runtime });
  assert.equal(verdict.className, 'graph_invalid');
  assert.match(verdict.detail, /unresolved_dependencies/);
  assert.equal(verdict.answer, null);
});

test('a missing completion is a transport error, whatever the transport reported', async () => {
  const silent = await classifyItem({ completion: null, oracle: '7', runtime });
  assert.equal(silent.className, 'generation_transport_error');
  assert.equal(silent.detail, 'empty completion');

  const blank = await classifyItem({ completion: '\n  \n', oracle: '7', runtime });
  assert.equal(blank.className, 'generation_transport_error');

  const reported = await classifyItem({
    completion: null,
    oracle: '7',
    runtime,
    error: { kind: 'transport', message: 'HTTP 503' }
  });
  assert.equal(reported.className, 'generation_transport_error');
  assert.equal(reported.detail, 'HTTP 503');
});

test('the loop records every item and one broken generation never aborts the batch', async () => {
  const root = mkdtempSync(join(tmpdir(), 'soplang-eval-'));
  const items = [
    {
      id: 'book-b/no-knowledge/y/1-c',
      book: 'book-b',
      folder: 'no-knowledge/y/1-c',
      plan: 'p2',
      unit: '1',
      template: 'U',
      category: 'no-knowledge',
      statement: 'Problem C',
      oracle: '7'
    },
    {
      id: 'book-a/no-knowledge/x/1-a',
      book: 'book-a',
      folder: 'no-knowledge/x/1-a',
      plan: 'p1',
      unit: '1',
      template: 'T',
      category: 'no-knowledge',
      statement: 'Problem A',
      oracle: '7'
    },
    {
      id: 'book-a/no-knowledge/x/2-b',
      book: 'book-a',
      folder: 'no-knowledge/x/2-b',
      plan: 'p1',
      unit: '1',
      template: 'T',
      category: 'no-knowledge',
      statement: 'Problem B',
      oracle: '7'
    }
  ];
  const good = program('const slots = $slots;\nreturn String(slots.value);');
  const generateItem = async (messages) => {
    assert.equal(messages[0].role, 'system');
    assert.ok(messages[0].content.length > 0, 'the chat profile supplies the system prompt');
    const statement = messages[1].content;
    if (statement === 'Problem A') {
      return {
        completion: good,
        finishReason: 'stop',
        usage: { prompt_tokens: 100, completion_tokens: 10, total_tokens: 110 },
        latencyMs: 5,
        attempts: 1,
        error: null
      };
    }
    if (statement === 'Problem B') {
      return {
        completion: 'I cannot do that.',
        finishReason: 'stop',
        usage: { prompt_tokens: 100, completion_tokens: 3, total_tokens: 103 },
        latencyMs: 4,
        attempts: 1,
        error: null
      };
    }
    throw new Error('connection refused');
  };

  try {
    const logPath = join(root, 'run-log.jsonl');
    const { records, path } = await runSlice({
      items,
      generateItem,
      runtime,
      outDir: root,
      experimentId: 'exp-test',
      sliceName: 'holdout',
      concurrency: 2,
      logPath
    });

    assert.equal(records.length, 3);
    assert.equal(path, join(root, 'items', 'holdout.jsonl'));
    assert.deepEqual(
      records.map((record) => [record.item, record.class]),
      [
        ['book-a/no-knowledge/x/1-a', 'answer_match'],
        ['book-a/no-knowledge/x/2-b', 'wrapper_rejected'],
        ['book-b/no-knowledge/y/1-c', 'generation_transport_error']
      ]
    );

    const lines = readFileSync(path, 'utf8').trim().split('\n');
    assert.equal(lines.length, 3);
    assert.deepEqual(
      lines.map((line) => JSON.parse(line).item),
      ['book-a/no-knowledge/x/1-a', 'book-a/no-knowledge/x/2-b', 'book-b/no-knowledge/y/1-c'],
      'the record file is sorted by item id'
    );
    const [matched, rejected, transported] = lines.map((line) => JSON.parse(line));
    assert.deepEqual(Object.keys(matched).sort(), [
      'answer',
      'book',
      'category',
      'class',
      'completion',
      'detail',
      'folder',
      'generated',
      'item',
      'oracle',
      'plan',
      'template',
      'unit'
    ]);
    assert.deepEqual(Object.keys(matched.generated).sort(), [
      'attempts',
      'completionSha256',
      'latencyMs',
      'promptTokens',
      'tokens'
    ]);
    assert.equal(matched.answer, '7');
    assert.equal(matched.oracle, '7');
    assert.equal(matched.completion, good, 'the raw completion is evidence');
    assert.equal(matched.generated.completionSha256, sha256(good));
    assert.equal(matched.generated.tokens, 10);
    assert.equal(rejected.generated.completionSha256, sha256('I cannot do that.'));
    assert.equal(transported.completion, null);
    assert.equal(transported.answer, null);
    assert.equal(transported.generated.completionSha256, null);
    assert.equal(transported.detail, 'connection refused');

    const logged = readFileSync(logPath, 'utf8').trim().split('\n');
    assert.equal(logged.length, 3, 'the item log records one line per request');
  } finally {
    cleanup(root);
  }
});

function recordOf({ item, book, plan, className, tokens, promptTokens = 100, latencyMs, attempts }) {
  return {
    item,
    book,
    folder: `no-knowledge/x/${item}`,
    plan,
    unit: '1',
    template: 'T',
    category: 'no-knowledge',
    class: className,
    detail: null,
    oracle: '7',
    answer: null,
    generated: { tokens, promptTokens, attempts, latencyMs, completionSha256: HASH },
    completion: 'text'
  };
}

test('the aggregate reports the four rates separately, macro tables per book and per plan', () => {
  const records = [
    recordOf({ item: 'r1', book: 'book-a', plan: 'p1', className: 'answer_match', tokens: 1000, latencyMs: 1000, attempts: 1 }),
    recordOf({ item: 'r2', book: 'book-a', plan: 'p1', className: 'answer_mismatch', tokens: 500, latencyMs: 500, attempts: 1 }),
    recordOf({ item: 'r3', book: 'book-a', plan: 'p2', className: 'execution_error', tokens: 200, latencyMs: 200, attempts: 1 }),
    recordOf({ item: 'r4', book: 'book-b', plan: 'p1', className: 'graph_invalid', tokens: 100, latencyMs: 100, attempts: 1 }),
    recordOf({ item: 'r5', book: 'book-b', plan: 'p2', className: 'parse_invalid', tokens: 50, latencyMs: 50, attempts: 2 }),
    recordOf({ item: 'r6', book: 'book-b', plan: 'p2', className: 'wrapper_rejected', tokens: 20, latencyMs: 20, attempts: 1 }),
    recordOf({ item: 'r7', book: 'book-c', plan: 'p3', className: 'generation_transport_error', tokens: null, latencyMs: null, attempts: 2 })
  ];
  const metrics = aggregate(records);

  assert.equal(metrics.items, 7);
  assert.deepEqual(
    Object.keys(metrics.rates),
    ['parse_validity', 'graph_validity', 'runtime_completion', 'oracle_match'],
    'the four rates stay separate; no micro-score is emitted'
  );
  assert.deepEqual(metrics.rates, {
    parse_validity: 0.571429,
    graph_validity: 0.428571,
    runtime_completion: 0.285714,
    oracle_match: 0.142857
  });
  assert.deepEqual(metrics.classes, Object.fromEntries(CLASSES.map((className) => [className, 1])));

  assert.deepEqual(Object.keys(metrics.byBook), ['book-a', 'book-b', 'book-c']);
  assert.equal(metrics.byBook['book-a'].items, 3);
  assert.equal(metrics.byBook['book-a'].classes.answer_match, 1);
  assert.equal(metrics.byBook['book-a'].rates.oracle_match, 0.333333);
  assert.equal(metrics.byBook['book-a'].rates.runtime_completion, 0.666667);
  assert.equal(metrics.byBook['book-b'].rates.parse_validity, 0.333333);
  assert.equal(metrics.byBook['book-b'].rates.graph_validity, 0);

  assert.deepEqual(Object.keys(metrics.byPlanCluster), ['p1', 'p2', 'p3']);
  assert.equal(metrics.byPlanCluster.p1.items, 3);
  assert.equal(metrics.byPlanCluster.p1.rates.graph_validity, 0.666667);
  assert.equal(metrics.byPlanCluster.p1.rates.oracle_match, 0.333333);
  assert.equal(metrics.byPlanCluster.p2.classes.wrapper_rejected, 1);
  assert.equal(metrics.byPlanCluster.p3.rates.oracle_match, 0);

  assert.deepEqual(metrics.efficiency, {
    generatedTokens: 1870,
    promptTokens: 700,
    calls: 9,
    wallClockMs: 1870,
    tokensPerSecond: 1000,
    costPerCorrect: 1870
  });
});

test('an empty record set aggregates to zero items and null rates', () => {
  const metrics = aggregate([]);
  assert.equal(metrics.items, 0);
  assert.deepEqual(metrics.rates, {
    parse_validity: null,
    graph_validity: null,
    runtime_completion: null,
    oracle_match: null
  });
  assert.equal(metrics.efficiency.costPerCorrect, null);
  assert.equal(metrics.efficiency.tokensPerSecond, null);
});

test('holdout, export-file, and validation slices resolve the statement and the oracle', () => {
  const root = mkdtempSync(join(tmpdir(), 'soplang-eval-slice-'));
  const book = join(root, 'fixture-book');
  const evalFolder = 'eval/no-knowledge/eval-1';
  const trainFolder = 'no-knowledge/train-1';
  try {
    mkdirSync(join(book, 'manifest'), { recursive: true });
    mkdirSync(join(book, evalFolder), { recursive: true });
    mkdirSync(join(book, trainFolder), { recursive: true });
    writeFileSync(
      join(book, 'manifest', 'chapter-01.md'),
      [
        '| folder | problem | chapter | template | type | category | split | paragraphs | answer | plan | problem | solution | explanation |',
        '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
        `| ${trainFolder} | 1.1 | 1 | Order in a Line | order-in-a-line | no-knowledge | train | 1-5 | 7. | ${HASH} | ${HASH} | ${HASH} | ${HASH} |`,
        `| ${evalFolder} | 1.2 | 1 | Order in a Line | order-in-a-line | no-knowledge | eval | 1-5 | 8. | ${HASH} | ${HASH} | ${HASH} | ${HASH} |`,
        ''
      ].join('\n')
    );
    for (const [folder, title] of [
      [trainFolder, '1.1'],
      [evalFolder, '1.2']
    ]) {
      writeFileSync(join(book, folder, 'problem.md'), `# ${title} — Fixture\n\nA fixture statement.\n`);
      writeFileSync(join(book, folder, 'solution.sop'), program('return String($slots.value);'));
    }

    const holdout = resolveSlice({ slice: 'holdout', dataRoot: root, books: ['fixture-book'] });
    assert.equal(holdout.sliceName, 'holdout');
    assert.equal(holdout.items.length, 1, 'only the eval/ example is a holdout item');
    assert.deepEqual(
      holdout.items.map((item) => [item.id, item.folder, item.oracle, item.plan, item.category, item.statement]),
      [['fixture-book/eval/no-knowledge/eval-1', evalFolder, '8.', HASH, 'no-knowledge', 'A fixture statement.\n']]
    );
    assert.equal(holdout.items[0].unit, null, 'the holdout view carries no training metadata');

    const exportFile = join(root, 'export.jsonl');
    const row = (folder) =>
      `${JSON.stringify({ messages: [{ role: 'system', content: 's' }, { role: 'user', content: 'A fixture statement.\n' }, { role: 'assistant', content: 'p' }], meta: { book: 'fixture-book', folder, unit: '1', template: 'Order in a Line', category: 'no-knowledge', plan: HASH } })}\n`;
    writeFileSync(exportFile, row(trainFolder) + row(evalFolder));

    const file = resolveSlice({ slice: `file:${exportFile}`, dataRoot: root });
    assert.equal(file.sliceName, 'export');
    assert.deepEqual(
      file.items.map((item) => [item.folder, item.oracle, item.unit, item.template]),
      [
        [evalFolder, '8.', '1', 'Order in a Line'],
        [trainFolder, '7.', '1', 'Order in a Line']
      ],
      'the file slice resolves every row, sorted by item id'
    );
    assert.equal(resolveSlice({ slice: `file:${exportFile}`, dataRoot: root, limit: 1 }).items.length, 1);

    const validationFile = join(root, 'validation-slice.json');
    writeFileSync(validationFile, JSON.stringify({ folders: [`fixture-book/${evalFolder}`] }));
    const validation = resolveSlice({
      slice: 'validation',
      dataRoot: root,
      exportPath: exportFile,
      validationPath: validationFile
    });
    assert.deepEqual(
      validation.items.map((item) => [item.folder, item.oracle]),
      [[evalFolder, '8.']]
    );

    writeFileSync(validationFile, JSON.stringify({ folders: ['fixture-book/no-knowledge/absent'] }));
    assert.throws(
      () => resolveSlice({ slice: 'validation', dataRoot: root, exportPath: exportFile, validationPath: validationFile }),
      /absent from the export/
    );
    assert.throws(() => resolveSlice({ slice: 'holdout', dataRoot: root, books: ['no-such-book'] }), /unknown book/);
  } finally {
    cleanup(root);
  }
});
