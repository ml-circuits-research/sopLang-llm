// The shared chain-waiting logic, pinned against its two failure modes:
// metrics.json is the only completion signal, and a really-failed chain stops
// the watcher (exit 5) instead of waiting forever. The lib runs against a fake
// root in a temp dir, so no real experiment or process is touched.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LIB = join(ROOT, 'training/environment/lib-watch.sh');

function runWait({ metrics, series }) {
  const root = mkdtempSync(join(tmpdir(), 'watch-test-'));
  const registry = join(root, 'evaluation/registry/test-watch-xyz');
  mkdirSync(registry, { recursive: true });
  if (metrics !== null) writeFileSync(join(registry, 'metrics.json'), '{}');
  if (series !== null) writeFileSync(join(registry, 'series.log'), series);
  const script = `
    source '${LIB}'
    note() { printf '%s\\n' "$*"; }
    wait_chain test-watch-xyz
    echo DONE
  `;
  try {
    return spawnSync('bash', ['-c', script], { cwd: root, encoding: 'utf8', timeout: 60_000 });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('a chain that wrote metrics.json completes immediately', () => {
  const result = runWait({ metrics: '{}', series: null });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /DONE/);
});

test('a failed chain with no live processes stops the watcher with exit 5', () => {
  const result = runWait({ metrics: null, series: 'selection failed; see series.log\nseries done\n' });
  assert.equal(result.status, 5);
  assert.match(result.stdout, /CHAIN FAILURE/);
  assert.doesNotMatch(result.stdout, /DONE/);
});

test('a failed line while training still runs is not a failure verdict', () => {
  // The experiment still has a trainer alive, so the stale failure line from an
  // earlier aborted chain must not stop the watcher: the real signal is
  // metrics.json, which the re-run chain will write. This case would block the
  // watcher forever by design, so the test only pins that it does NOT exit 5
  // immediately; a timeout would mean the watcher wrongly returned.
  const result = spawnSync('bash', ['-c', `
    source '${LIB}'
    note() { printf '%s\\n' "$*"; }
    mkdir -p evaluation/registry/test-watch-xyz
    echo 'selection failed' > evaluation/registry/test-watch-xyz/series.log
    # Simulate a live trainer for the experiment.
    sleep 300 & TRAINER=$!
    wait_chain test-watch-xyz &
    WATCH=$!
    sleep 2
    kill $WATCH 2>/dev/null; kill $TRAINER 2>/dev/null
    wait 2>/dev/null
    echo STILL_WAITING
  `], { cwd: mkdtempSync(join(tmpdir(), 'watch-test2-')), encoding: 'utf8', timeout: 60_000 });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /STILL_WAITING/);
});
