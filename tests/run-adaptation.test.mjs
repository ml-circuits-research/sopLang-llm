import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const RUNNER = join(REPO_ROOT, 'evaluation', 'run-adaptation.mjs');

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

test('the shapes mode ranks a deeper plan ahead of the export-order default', () => {
  const distinct = dryRun(['--slice', 'holdout', '--demos', '3', '--limit', '200']);
  const shapes = dryRun(['--slice', 'holdout', '--demos', '3', '--demo-mode', 'shapes', '--limit', '200']);
  const firstThree = (run) => run.items.map((item) => item.rest.slice(0, 120));
  const differences = firstThree(distinct).filter((line, index) => line !== firstThree(shapes)[index]);
  assert.ok(
    differences.length > 0,
    'the shape mode changes which demonstrations at least some items receive'
  );
  const deeper = shapes.items.filter((item) => /\((\d+) wires\)/.test(item.rest) && Number(/\((\d+) wires\)/.exec(item.rest)[1]) >= 3);
  assert.ok(deeper.length > 0, 'some targets are shown a plan of three or more wires');
  for (const item of deeper) {
    assert.match(
      item.rest,
      /^3 demo\(s\) \[\S+\/[^(\n]*\(3 wires\)|^3 demo\(s\) \[\S+\/[^(\n]*\(4 wires\)/,
      `${item.identity}: a shape request leads with a deeper plan`
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
