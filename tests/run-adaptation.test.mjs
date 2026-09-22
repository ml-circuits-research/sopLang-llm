import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const RUNNER = join(REPO_ROOT, 'evaluation', 'run-adaptation.mjs');
const DATA_ROOT = join(REPO_ROOT, 'training-data');

/**
 * The demonstration rule is exercised through the runner's `--dry-run`, which
 * resolves a slice and the demonstrations of every item without a served model
 * and prints one line per item: `<book>/<folder>: <n> demo(s) [<book>/<template>
 * (<k> wires), ...]`. Template names may themselves contain `), `, so the test
 * asserts the properties on the printed line rather than re-splitting it into a
 * structured list: the count, the absence of the target book, and the wire
 * counts of the demonstrations.
 */
function dryRun(args) {
  const output = execFileSync(
    process.execPath,
    [RUNNER, '--experiment', 'adapt-test', '--dry-run', ...args],
    { encoding: 'utf8', cwd: REPO_ROOT, timeout: 180000 }
  );
  const lines = output.trim().split('\n');
  const items = lines.filter((line) => line.includes('demo(s) [')).map((line) => {
    const [identity, rest] = line.split(': ');
    const count = Number(/^(\d+) demo\(s\)/.exec(rest)[1]);
    return { identity, book: identity.split('/')[0], count, rest };
  });
  return { items, summary: lines.at(-1) };
}

test('the demonstration rule never draws from the target book and fills every request', () => {
  const { items, summary } = dryRun(['--slice', 'holdout', '--demos', '3', '--limit', '12']);
  assert.equal(items.length, 12);
  assert.match(summary, /12 item\(s\), demos 3, mode distinct/);
  for (const item of items) {
    assert.equal(item.count, 3, `${item.identity} carries three demonstrations`);
    const demos = item.rest.replace(/^\d+ demo\(s\) \[/, '').replace(/\]$/, '');
    assert.ok(
      !demos.startsWith(`${item.book}/`),
      `${item.identity}: the first demonstration must not come from the target book (${demos.slice(0, 60)})`
    );
  }
});

test('a request for more demonstrations than the export can fill fails loudly', () => {
  assert.throws(
    () => dryRun(['--slice', 'holdout', '--demos', '5000', '--limit', '1']),
    /demonstrations available/,
    'an impossible demonstration request is an error, not a quietly shorter prompt'
  );
});

test('the statement mode retrieves by the incoming statement, which is all a deployment has', () => {
  const distinct = dryRun(['--slice', 'holdout', '--demos', '3', '--limit', '12']);
  const statement = dryRun(['--slice', 'holdout', '--demos', '3', '--demo-mode', 'statement', '--limit', '12']);
  assert.match(statement.summary, /mode statement/);
  assert.notDeepEqual(
    statement.items.map((item) => item.rest),
    distinct.items.map((item) => item.rest),
    'the retrieval changes which demonstrations items receive'
  );
  for (const item of statement.items) {
    assert.equal(item.count, 3, `${item.identity} carries three demonstrations`);
    assert.ok(!item.rest.startsWith(`${item.book}/`), `${item.identity}: never from the target book`);
  }
});

test('the demonstration selection reads no reference solution', () => {
  // The defect this pins: an earlier selector ranked demonstrations by the wire
  // count of the evaluated item's own solution.sop. The acceptance test of that
  // finding is that the prompts cannot depend on the target's reference program,
  // so this test corrupts every holdout solution, rebuilds the prompts, and
  // requires them unchanged.
  const args = ['--slice', 'holdout', '--demos', '3', '--demo-mode', 'statement', '--limit', '8'];
  const before = dryRun(args);
  const solutions = [];
  for (const book of readdirSync(DATA_ROOT)) {
    const evalDir = join(DATA_ROOT, book, 'eval');
    if (!existsSync(evalDir)) continue;
    const walk = (directory) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const child = join(directory, entry.name);
        if (entry.isDirectory()) walk(child);
        else if (entry.name === 'solution.sop') solutions.push(child);
      }
    };
    walk(evalDir);
  }
  assert.ok(solutions.length > 100, `the holdout holds reference solutions (${solutions.length})`);
  const restored = [];
  try {
    for (const solution of solutions) {
      restored.push([solution, readFileSync(solution, 'utf8')]);
      writeFileSync(solution, '@slots literal\n{"tampered": true}\n\n@answer jsEval\nreturn "TAMPERED";\n');
    }
    const after = dryRun(args);
    assert.deepEqual(
      after.items.map((item) => item.rest),
      before.items.map((item) => item.rest),
      'corrupting every reference solution must leave every prompt unchanged'
    );
  } finally {
    for (const [solution, original] of restored) writeFileSync(solution, original);
  }
});
