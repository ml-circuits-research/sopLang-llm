// Gate 1 of containers-plan.md: the family validator admits the five container
// commands as intermediate wires and delegates their body contracts to the
// commands' own validate, so a drift between the validator and the runtime is
// impossible by construction.
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProceduralFamily } from '../teacher/procedural/index.mjs';
import { buildProgram, planFingerprint } from '../teacher/families/index.mjs';
import { createRuntime } from '../runtime/kernel.mjs';

const CONTAINER_WIRES = [
  { name: 'ledger', command: 'container', body: 'kind: table\nprimaryKey: id\nschema:\n  type: object' },
  { name: 'records', command: 'jsEval', body: 'return $slots.records;' },
  { name: 'seed', command: 'containerAdd', body: 'target: ledger\nitems: $records' },
  { name: 'kept', command: 'containerFilter', body: 'source: $ledger\npredicate: return row.enabled === true;' }
];

test('buildProgram rejects a mutation that names an undeclared container', () => {
  const family = familyWith([
    { name: 'seed', command: 'containerAdd', body: 'target: missing\nitems: $slots.records' }
  ]);
  assert.throws(() => buildProgram({ compute: family.compute, wires: family.wires }, {}), /before any container declares it/);
});

test('a built container plan executes on the runtime and answers from the seeded state', async () => {
  const family = familyWith(CONTAINER_WIRES);
  family.compute = 'return String($kept.records.length);';
  const program = buildProgram({ compute: family.compute, wires: family.wires }, {
    records: [{ id: 'a', enabled: true }, { id: 'b', enabled: false }, { id: 'c', enabled: true }]
  });
  const runtime = createRuntime();
  const outcome = await runtime.run(program, { outputs: ['answer'] });
  assert.equal(outcome.status, 'completed', outcome.error?.message ?? outcome.code);
  assert.equal(String(outcome.outputs.answer), '2');
});

test('a container plan carries a distinct plan fingerprint', () => {
  const entry = { compute: 'return "answer";', wires: CONTAINER_WIRES };
  const entryNoWires = { compute: 'return "answer";' };
  assert.notEqual(planFingerprint(entry), planFingerprint(entryNoWires));
});


const DIFFICULTY = { subproblems: 1, dependencyDepth: 1, branching: 1, irrelevantInformation: 1, symbolicShare: 1 };

function familyWith(wires) {
  return {
    id: 'container-smoke',
    name: 'Container Smoke',
    type: 'container-smoke',
    category: 'no-knowledge',
    difficulty: DIFFICULTY,
    wires,
    sample: () => ({}),
    statement: () => 'statement',
    parse: () => ({}),
    solve: () => ({}),
    render: () => 'answer',
    explain: () => [],
    compute: 'return "answer";'
  };
}

test('a family declaring the container commands as intermediate wires is accepted', () => {
  const family = familyWith([
    { name: 'ledger', command: 'container', body: 'kind: table\nprimaryKey: id\nschema:\n  type: object' },
    { name: 'seed', command: 'containerAdd', body: 'target: ledger\nitems: $slots.records' },
    { name: 'kept', command: 'containerFilter', body: 'source: $ledger\npredicate: return row.enabled === true;' }
  ]);
  assert.doesNotThrow(() => validateProceduralFamily(family, 'test'));
});

test('a container declaration without a kind is rejected with the command\'s message', () => {
  const family = familyWith([
    { name: 'ledger', command: 'container', body: 'primaryKey: id' }
  ]);
  assert.throws(() => validateProceduralFamily(family, 'test'), /requires a kind/);
});

test('a containerAdd without a target is rejected with the command\'s message', () => {
  const family = familyWith([
    { name: 'ledger', command: 'container', body: 'kind: table\nprimaryKey: id' },
    { name: 'seed', command: 'containerAdd', body: 'items: $slots.records' }
  ]);
  assert.throws(() => validateProceduralFamily(family, 'test'), /requires a target/);
});

test('an unknown command is still rejected', () => {
  const family = familyWith([{ name: 'mystery', command: 'madeUp', body: 'x' }]);
  assert.throws(() => validateProceduralFamily(family, 'test'), /unknown command madeUp/);
});

import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyProvenance } from '../training-data/provenance.mjs';

test('the provenance battery proves a container plan reacts to its seeded inputs', async () => {
  const root = mkdtempSync(join(tmpdir(), 'container-prov-'));
  const folder = join(root, 'no-knowledge', 'container-smoke');
  mkdirSync(folder, { recursive: true });
  const family = familyWith(CONTAINER_WIRES);
  family.compute = 'return String($kept.records.length);';
  const program = buildProgram({ compute: family.compute, wires: family.wires }, { records: [{ id: 'a', enabled: true }, { id: 'b', enabled: false }] });
  writeFileSync(join(folder, 'solution.sop'), program);
  const expected = new Map([['no-knowledge/container-smoke', { plan: 'x', answer: '1' }]]);
  const result = await verifyProvenance(root, [join(folder, 'solution.sop')], { expected });
  assert.equal(result.computed, 1, JSON.stringify(result));
  rmSync(root, { recursive: true, force: true });
});

test('a container plan whose seed is a baked literal is reported as non-reacting', async () => {
  const root = mkdtempSync(join(tmpdir(), 'container-baked-'));
  const folder = join(root, 'no-knowledge', 'container-baked');
  mkdirSync(folder, { recursive: true });
  const wires = [
    { name: 'ledger', command: 'container', body: 'kind: table\nprimaryKey: id' },
    { name: 'seed', command: 'containerAdd', body: 'target: ledger\nitems:\n  - id: a\n    enabled: true' },
    { name: 'kept', command: 'containerFilter', body: 'source: $ledger\npredicate: return row.enabled === true;' }
  ];
  const program = buildProgram({ compute: 'return String($kept.records.length);', wires }, {});
  writeFileSync(join(folder, 'solution.sop'), program);
  const expected = new Map([['no-knowledge/container-baked', { plan: 'x', answer: '1' }]]);
  const result = await verifyProvenance(root, [join(folder, 'solution.sop')], { expected });
  assert.equal(result.computed, 0);
  assert.equal(result.invariant.length, 1);
  assert.equal(result.invariant[0].usesInputs, false);
  rmSync(root, { recursive: true, force: true });
});
