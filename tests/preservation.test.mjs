import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { createRuntime } from '../runtime/kernel.mjs';
import { collectRows } from '../training/export.mjs';
import {
  PRESERVATION_PROFILE_ID,
  PRESERVATION_RATIO,
  PRESERVATION_SYSTEM_PROMPT,
  preservationFileName,
  preservationRowsOf,
  standaloneJavaScriptOf,
} from '../training/preservation.mjs';

const DATASET_ROOT = fileURLToPath(new URL('../training-data/', import.meta.url));
const DATA_DIR = fileURLToPath(new URL('../training/data/', import.meta.url));
const rows = collectRows({ datasetRoot: DATASET_ROOT });

function sampleRows() {
  // A stride over the export, plus one multi-wire generator plan and one
  // knowledge row, so the equivalence check covers stage references and facts.
  const sample = rows.filter((_, index) => index % 700 === 0);
  const multiWire = rows.find((row) => row.book === 'procedural-arithmetic' && row.meta.type === 'grouped-label-totals');
  const withFacts = rows.find((row) => row.meta.category === 'knowledge');
  for (const row of [multiWire, withFacts]) {
    if (row !== undefined) {
      sample.push(row);
    }
  }
  return sample;
}

test('the derived preservation program prints exactly the answer its circuit returns', async () => {
  const runtime = createRuntime();
  const sample = sampleRows();
  assert.ok(sample.length >= 10, 'the sample covers several rows');
  for (const row of sample) {
    const circuit = row.solution;
    const program = standaloneJavaScriptOf(circuit);
    const result = await runtime.run(circuit, { outputs: ['answer'] });
    assert.equal(result.status, 'completed', `${row.book}/${row.folder}: the circuit must execute`);
    const printed = execFileSync(process.execPath, ['-e', program], { encoding: 'utf8', timeout: 30000 }).trim();
    assert.equal(
      printed,
      String(result.outputs.answer).trim(),
      `${row.book}/${row.folder}: the derived JavaScript must print the circuit's answer`
    );
  }
});

test('every preservation row carries the preservation profile and the statement it was derived from', () => {
  const preservation = readFileSync(`${DATA_DIR}${preservationFileName()}`, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  assert.ok(preservation.length > 0, 'the preservation view is not empty');
  const byFolder = new Map(rows.map((row) => [`${row.book}/${row.folder}`, row]));
  for (const row of preservation) {
    assert.equal(row.messages[0].role, 'system');
    assert.equal(row.messages[0].content, PRESERVATION_SYSTEM_PROMPT);
    assert.equal(row.messages[1].role, 'user');
    assert.equal(row.messages[2].role, 'assistant');
    assert.equal(row.meta.kind, 'preservation');
    const source = byFolder.get(`${row.meta.book}/${row.meta.folder}`);
    assert.ok(source !== undefined, `${row.meta.folder} must come from an exported training row`);
    assert.equal(row.messages[1].content, source.statement, 'the user message is the statement of the source row');
    assert.equal(row.meta.plan, source.meta.plan, 'the plan identity of the source row is kept');
    assert.match(row.meta.hashes.target, /^[0-9a-f]{12}$/);
  }
});

test('the preservation view is a deterministic stride of the export', () => {
  const derived = preservationRowsOf(rows);
  const committed = readFileSync(`${DATA_DIR}${preservationFileName()}`, 'utf8').trim().split('\n');
  assert.equal(derived.length, committed.length);
  assert.equal(preservationFileName(), 'preservation-10.jsonl');
  assert.equal(PRESERVATION_PROFILE_ID, 'js-preservation-1');
  assert.ok(PRESERVATION_RATIO > 0 && PRESERVATION_RATIO < 1);
  assert.equal(
    derived.map((row) => `${row.book}/${row.folder}`).join('\n'),
    rows.filter((_, index) => index % 10 === 0).map((row) => `${row.book}/${row.folder}`).join('\n'),
    'every tenth export row is repeated in the preservation view'
  );
});
