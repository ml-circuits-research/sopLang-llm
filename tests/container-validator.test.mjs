// Gate 1 of containers-plan.md: the family validator admits the five container
// commands as intermediate wires and delegates their body contracts to the
// commands' own validate, so a drift between the validator and the runtime is
// impossible by construction.
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProceduralFamily } from '../teacher/procedural/index.mjs';

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
