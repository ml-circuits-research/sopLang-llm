// The portable chain-waiting logic (skills/night-orchestration/scripts/lib-watch.sh),
// pinned against its failure modes: metrics.json is the only completion signal, and a
// really-failed chain raises a visible CHAIN-ALARM.txt marker instead of either
// exiting or waiting silently. The lib
// runs against a fake root in a temp dir, configured through its environment variables,
// so no real experiment or process is touched.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LIB = join(ROOT, 'skills/night-orchestration/scripts/lib-watch.sh');

function runWait({ metrics, series, workerPattern = '' }) {
  const root = mkdtempSync(join(tmpdir(), 'watch-test-'));
  const registry = join(root, 'evaluation/registry/test-watch-xyz');
  mkdirSync(registry, { recursive: true });
  if (metrics !== null) writeFileSync(join(registry, 'metrics.json'), '{}');
  if (series !== null) writeFileSync(join(registry, 'series.log'), series);
  const script = [
    `export PROJECT_ROOT='${root}'`,
    `export RESULTS_DIR='${root}/evaluation/registry'`,
    `export WORKER_PATTERN='${workerPattern}'`,
    `export SUPERVISOR_PATTERN=''`,
    `export CHAIN_PATTERN=''`,
    `export FAILURE_MARKER='failed'`,
    `export SELECTION_MARKER='selection'`,
    `source '${LIB}'`,
    `note() { printf '%s\n' "$*"; }`,
    `wait_chain test-watch-xyz`,
    `echo DONE`,
  ].join('\n');
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

test('a failed chain raises a visible alarm marker and keeps waiting', () => {
  // The watcher must never exit on a failure line (a stale failure from an
  // earlier aborted chain fired once right between training completion and the
  // new chain starting). It raises CHAIN-ALARM.txt and keeps waiting for
  // metrics.json, so the pipeline stays alive and a human sees the marker.
  const root = mkdtempSync(join(tmpdir(), 'watch-alarm-'));
  const registry = join(root, 'evaluation/registry/test-watch-xyz');
  mkdirSync(registry, { recursive: true });
  writeFileSync(join(registry, 'series.log'), 'selection failed; see series.log\nseries done\n');
  const script = [
    `export PROJECT_ROOT='${root}'`,
    `export RESULTS_DIR='${root}/evaluation/registry'`,
    `export WORKER_PATTERN=''`,
    `export SUPERVISOR_PATTERN=''`,
    `export CHAIN_PATTERN=''`,
    `export FAILURE_MARKER='failed'`,
    `export SELECTION_MARKER='selection'`,
    `source '${LIB}'`,
    `note() { printf '%s\n' "$*"; }`,
    `wait_chain test-watch-xyz &`,
    `WATCH=$!`,
    `sleep 2`,
    `kill $WATCH 2>/dev/null`,
    `wait 2>/dev/null`,
    `cat ${root}/evaluation/registry/test-watch-xyz/CHAIN-ALARM.txt`,
  ].join('\n');
  const result = spawnSync('bash', ['-c', script], { cwd: root, encoding: 'utf8', timeout: 60_000 });
  rmSync(root, { recursive: true, force: true });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /CHAIN FAILURE/);
  assert.match(result.stdout, /chain failure detected/);
  assert.doesNotMatch(result.stdout, /DONE/);
});

test('a failed line while the worker still runs is not a failure verdict', () => {
  // A live worker means the job is not over, so the stale failure line from an
  // earlier aborted chain must not stop the watcher: the real signal is
  // metrics.json, which the re-run chain will write. This case would block the
  // watcher forever by design, so the test pins only that it does NOT exit 5
  // immediately; a timeout would mean the watcher wrongly returned.
  const fakeRoot = mkdtempSync(join(tmpdir(), 'watch-test2-'));
  const registry = join(fakeRoot, 'evaluation/registry/test-watch-xyz');
  mkdirSync(registry, { recursive: true });
  writeFileSync(join(registry, 'series.log'), 'selection failed');
  const script = [
    `export PROJECT_ROOT='${fakeRoot}'`,
    `export RESULTS_DIR='${fakeRoot}/evaluation/registry'`,
    `export WORKER_PATTERN='sleep 300'`,
    `export SUPERVISOR_PATTERN=''`,
    `export CHAIN_PATTERN=''`,
    `export FAILURE_MARKER='failed'`,
    `export SELECTION_MARKER='selection'`,
    `source '${LIB}'`,
    `note() { printf '%s\n' "$*"; }`,
    `sleep 300 & TRAINER=$!`,
    `wait_chain test-watch-xyz &`,
    `WATCH=$!`,
    `sleep 2`,
    `kill $WATCH 2>/dev/null; kill $TRAINER 2>/dev/null`,
    `wait 2>/dev/null`,
    `echo STILL_WAITING`,
  ].join('\n');
  const result = spawnSync('bash', ['-c', script], { cwd: fakeRoot, encoding: 'utf8', timeout: 60_000 });
  rmSync(fakeRoot, { recursive: true, force: true });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /STILL_WAITING/);
  assert.doesNotMatch(result.stdout, /CHAIN FAILURE/);
});
