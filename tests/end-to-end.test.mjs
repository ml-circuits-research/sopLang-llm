import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRuntime } from '../runtime/kernel.mjs';

/**
 * End-to-end checks that exercise the compiled-context pattern from
 * DS006-context-adapter with the standard vocabulary and the epoch semantics.
 */

test('compiles a source chunk into container contributions and answers a question', async () => {
  const source = [
    '@characters container',
    'kind: table',
    'primaryKey: id',
    'schema:',
    '  type: object',
    '  required: [id, name, sourceSpans]',
    '',
    '@chunk01_characters containerAdd',
    'target: characters',
    'items:',
    '  - id: char_hamlet',
    '    name: Hamlet',
    '    sourceSpans:',
    '      - { sourceId: bookA, chunkId: chunk01, start: 10, end: 42 }',
    '  - id: char_ophelia',
    '    name: Ophelia',
    '    sourceSpans:',
    '      - { sourceId: bookA, chunkId: chunk01, start: 60, end: 88 }',
    '',
    '@chunk02_characters containerAdd',
    'target: characters',
    'items:',
    '  - id: char_horatio',
    '    name: Horatio',
    '    sourceSpans:',
    '      - { sourceId: bookA, chunkId: chunk02, start: 5, end: 30 }',
    '',
    '@all containerFilter',
    'source: $characters',
    'predicate:',
    '  return true;',
    '',
    '@nameList jsEval',
    'return $all.records.map((record) => record.name).sort();'
  ].join('\n');

  const result = await createRuntime().run(source, { outputs: ['nameList'] });
  assert.equal(result.status, 'completed');
  assert.deepEqual(result.outputs.nameList, ['Hamlet', 'Horatio', 'Ophelia']);
  assert.equal(result.containers[0].revision, 1);
  const commits = result.trace.entries.filter((entry) => entry.type === 'container_commit');
  assert.equal(commits.length, 1, 'both chunk patches commit in one revision');
  assert.equal(commits[0].patches, 2);
});

test('answers a position-insensitive query over compiled state', async () => {
  const source = [
    '@exceptions container',
    'kind: table',
    'primaryKey: id',
    '',
    '@early containerAdd',
    'target: exceptions',
    'items:',
    '  - id: exc_early',
    '    rule: rule_7',
    '    text: exception near the start of the source',
    '',
    '@late containerAdd',
    'target: exceptions',
    'items:',
    '  - id: exc_late',
    '    rule: rule_7',
    '    text: exception near the end of the source',
    '',
    '@rule7 containerFilter',
    'source: $exceptions',
    'predicate:',
    '  return row.rule === $rule;',
    '',
    '@count jsEval',
    'return $rule7.records.length;'
  ].join('\n');

  const result = await createRuntime().run(source, { inputs: { rule: 'rule_7' }, outputs: ['count'] });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.count, 2, 'source position does not affect the compiled query');
});

test('decomposes a summarization circuit into obligations, draft, and coverage', async () => {
  const source = [
    '@claims container',
    'kind: table',
    'primaryKey: id',
    '',
    '@addClaims containerAdd',
    'target: claims',
    'items:',
    '  - id: c1',
    '    text: main thesis',
    '    importance: 0.9',
    '    minorityPosition: false',
    '  - id: c2',
    '    text: minority reading',
    '    importance: 0.2',
    '    minorityPosition: true',
    '',
    '@accepted containerFilter',
    'source: $claims',
    'predicate:',
    '  return row.importance >= 0.5 || row.minorityPosition === true;',
    '',
    '@mustKeep jsEval',
    'return $accepted.records.filter((record) => record.importance >= 0.8 || record.minorityPosition === true);',
    '',
    '@draft modelCall',
    'Summarize the accepted claims: $accepted. Preserve minority positions. Do not add claims.',
    '',
    '@coverage jsEval',
    'const draft = String($draft).toLowerCase();',
    'return $mustKeep.map((record) => ({ id: record.id, preserved: draft.includes(record.text.toLowerCase()) }));'
  ].join('\n');

  const models = {
    modelCall: async ({ values }) => `A summary covering ${values.accepted.records.length} claims.`
  };
  const result = await createRuntime().run(source, { outputs: ['coverage'], models });
  assert.equal(result.status, 'completed');
  const coverage = result.outputs.coverage;
  assert.equal(coverage.length, 2);
  assert.equal(coverage.every((entry) => typeof entry.preserved === 'boolean'), true);
  assert.equal(result.budgets.usage.neuralCalls, 1);
});

test('delegates deterministic work and counts only the semantic judgment', async () => {
  const source = [
    '@values input',
    '',
    '@median jsEval',
    'const sorted = [...$values].sort((a, b) => a - b);',
    'return sorted[Math.floor(sorted.length / 2)];',
    '',
    '@judgment modelCall',
    'Is the median $median above the stated threshold $threshold? Answer yes or no.',
    '',
    '@answer jsEval',
    'return { median: $median, verdict: String($judgment).trim().toLowerCase() };'
  ].join('\n');

  const models = { modelCall: async ({ values }) => (values.median > values.threshold ? 'yes' : 'no') };
  const result = await createRuntime().run(source, {
    inputs: { values: [3, 1, 4, 1, 5], threshold: 2 },
    outputs: ['answer'],
    models
  });
  assert.equal(result.status, 'completed');
  assert.deepEqual({ ...result.outputs.answer }, { median: 3, verdict: 'yes' });
  assert.equal(result.budgets.usage.neuralCalls, 1, 'the arithmetic never reaches the model');
});

test('returns explicit uncertainty instead of inventing a value', async () => {
  const source =
    '@evidence modelCall\nDecide from $provided.\n\n@output jsEval\nreturn { partial: true, unresolved: ["source for claim c17"] };';
  const result = await createRuntime().run(source, { inputs: { provided: [] }, outputs: ['output'], models: { modelCall: async () => 'unknown' } });
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.output.partial, true);
  assert.deepEqual([...result.outputs.output.unresolved], ['source for claim c17']);
});

test('a structured partial outcome survives budget exhaustion', async () => {
  const source = [
    '@expand jsEval',
    'for (let index = 0; index < 10; index += 1) {',
    '  circuit.addWire(`n${index}`, { command: "literal", body: "1" });',
    '}',
    'return circuit.commit({ result: true });'
  ].join('\n');
  const result = await createRuntime().run(source, { outputs: ['expand'], budget: { maxCreatedWires: 3 } });
  assert.equal(result.status, 'partial');
  assert.equal(result.code, 'budget_exceeded');
  assert.ok(result.trace.entries.length > 0, 'partial progress remains in the trace');
});

test('a tool added at runtime is used from its manifest without retraining', async () => {
  const { createRegistry } = await import('../runtime/registry.mjs');
  const { createStandardCommands } = await import('../wires/standard/index.mjs');
  const registry = createRegistry(createStandardCommands());
  registry.register({
    name: 'stats.bootstrapCI',
    version: '1.0.0',
    effectClass: 'pure',
    manifest: {
      name: 'stats.bootstrapCI',
      version: '1.0.0',
      summary: 'Compute a bootstrap confidence interval for the mean of a numeric sample.',
      whenToUse: 'Use when a reported improvement needs an uncertainty interval.',
      whenNotToUse: 'Do not use for exact arithmetic without a sample.',
      bodyFormat: 'profile',
      outputSchema: { type: 'object' },
      effectClass: 'pure',
      determinism: 'deterministic'
    },
    analyze: () => ({ values: [], structural: [], containerReads: [], containerWrites: [] }),
    validate: () => ({ ok: true }),
    async execute() {
      return { lower: 0.41, upper: 0.63 };
    }
  });

  const result = await createRuntime({ registry }).run(
    '@interval stats.bootstrapCI\nsample: $sample\n\n@report jsEval\nreturn `[${$interval.lower}, ${$interval.upper}]`;',
    { inputs: { sample: [0.4, 0.5, 0.6] }, outputs: ['report'] }
  );
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.report, '[0.41, 0.63]');
});
