// Local llama.cpp processes: one place that knows how this repository starts,
// waits for, and stops them, shared by checkpoint selection, the holdout run of
// a selected checkpoint, and the deployment measurement.

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { closeSync, existsSync, openSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPOSITORY_ROOT = fileURLToPath(new URL('..', import.meta.url));
/**
 * A registry path may be recorded absolute (older selection runs) or
 * repository-relative (current ones); both must resolve to the same file.
 */
export function resolveArtifactPath(pathLike) {
  return pathLike.startsWith('/') ? pathLike : join(REPOSITORY_ROOT, pathLike);
}

export const LLAMA_SERVER = join(REPOSITORY_ROOT, 'tools/llamacpp/build/bin/llama-server');
export const LLAMA_QUANTIZE = join(REPOSITORY_ROOT, 'tools/llamacpp/build/bin/llama-quantize');

/**
 * The alias of a managed server: unique per launch, so the readiness check can
 * tell *this* launch from any other.
 *
 * Every managed server used to answer as `student`. A server of a previous run
 * that still held the port then satisfied the readiness check of a new launch,
 * and a whole checkpoint selection was scored by the wrong model (exp-009,
 * 2026-09-21). The alias is derived from the artifact it serves, and the
 * readiness check requires exactly it, so a stranger can never be mistaken for
 * the artifact under test.
 */
export function aliasFor(ggufPath) {
  const digest = createHash('sha256').update(String(ggufPath)).digest('hex').slice(0, 12);
  return `student-${digest}`;
}

/** Server arguments of every measured run: full offload, the model's own template, four slots. */
export function serverArguments(ggufPath, port, { threads = null, alias = null } = {}) {
  return [
    '-m', ggufPath,
    '--port', String(port),
    '--ctx-size', '16384',
    '--n-gpu-layers', '99',
    '--jinja',
    '--parallel', '4',
    '--alias', alias ?? aliasFor(ggufPath),
    ...(threads === null ? [] : ['--threads', String(threads), '--threads-batch', String(threads)]),
  ];
}

/**
 * Waits for *our* server, not for any server.
 *
 * `/health` alone is not enough: a server of a previous run that still holds the
 * port answers it, our own child fails to bind, and every checkpoint of a whole
 * selection is then scored by the first model — which is what happened to
 * `exp-009-mix10` on the night of 2026-09-21, where eight checkpoints reported
 * the identical 36.3%. The readiness check therefore asks for the model list and
 * requires the artifact we launched, and it fails as soon as our child is gone.
 */
export async function waitForServer(port, timeoutMs = 300_000, { expectedModel = null, child = null } = {}) {
  const deadline = Date.now() + timeoutMs;
  let lastReason = 'not listening yet';
  while (Date.now() < deadline) {
    if (child !== null && child.exitCode !== null) {
      throw new Error(`llama-server exited with code ${child.exitCode} before it was ready (port ${port})`);
    }
    try {
      const response = await fetch(`http://127.0.0.1:${port}/v1/models`);
      if (response.ok) {
        if (expectedModel === null) {
          return;
        }
        const payload = await response.json();
        const ids = (payload?.data ?? []).map((entry) => entry?.id).filter((id) => typeof id === 'string');
        if (ids.includes(expectedModel)) {
          return;
        }
        lastReason = `port ${port} answers with ${ids.join(', ') || 'no model'}, not "${expectedModel}": another server holds the port`;
      } else {
        lastReason = `port ${port} answered ${response.status}`;
      }
    } catch (failure) {
      lastReason = `port ${port} is not listening (${failure.message})`;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`llama-server on port ${port} was not ready within ${timeoutMs} ms (${lastReason})`);
}

/** Peak resident set of a live process, in GiB, from VmHWM (null when unreadable). */
export function peakResidentGib(pid) {
  try {
    const status = readFileSync(`/proc/${pid}/status`, 'utf8');
    const match = status.match(/VmHWM:\s+(\d+) kB/);
    return match === null ? null : Number(match[1]) / (1024 * 1024);
  } catch {
    return null;
  }
}

/**
 * Runs `body()` against a served artifact and always stops the server again.
 * `body` receives `{ port, pid, peakResidentGib }` so a caller can sample the
 * process while it is alive.
 */
export async function withServer({ ggufPath, port, logPath, threads = null, extraArguments = [] }, body) {
  const logFd = openSync(logPath, 'a');
  const child = spawn(LLAMA_SERVER, [...serverArguments(ggufPath, port, { threads }), ...extraArguments], {
    cwd: REPOSITORY_ROOT,
    detached: true,
    stdio: ['ignore', logFd, logFd],
  });
  closeSync(logFd);
  try {
    await waitForServer(port, 300_000, { expectedModel: aliasFor(ggufPath), child });
    return await body({
      port,
      pid: child.pid,
      alias: aliasFor(ggufPath),
      peakResidentGib: () => peakResidentGib(child.pid),
    });
  } finally {
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {
      child.kill('SIGTERM');
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

/**
 * The newest experiment whose run-manifest records a winner on the requested
 * base, or `null` when none does.
 *
 * An experiment "pins" a base through the `base_model_manifest` its run manifest
 * records: the path names `base-model-1.5b.json` for the 1.5B arm and
 * `base-model.json` for the 0.5B arm. Recency is the experiment id, the same
 * order the chat's `latestExperiment` and `winner15` have always used; the
 * winner row must still name a gguf that exists, because a pruned conversion
 * must never hand the chat an artifact that is gone.
 */
function winnerByBase({ pins15 }) {
  const registry = `${REPOSITORY_ROOT}/evaluation/registry`;
  const candidates = [];
  for (const name of readdirSync(registry)) {
    const selection = join(registry, name, 'selection.json');
    const manifest = join(registry, name, 'run-manifest.json');
    if (!existsSync(selection) || !existsSync(manifest)) continue;
    const record = JSON.parse(readFileSync(manifest, 'utf8'));
    // Older evaluation manifests predate the base_model_manifest field; their
    // trainer manifest (training/checkpoints/<name>/run-manifest.json) has carried
    // it since the field existed, so the discrimination works for the whole series.
    let basePath = record.base_model_manifest?.path ?? null;
    if (basePath === null) {
      const trainerManifestPath = join(REPOSITORY_ROOT, 'training/checkpoints', name, 'run-manifest.json');
      if (existsSync(trainerManifestPath)) {
        try {
          basePath = JSON.parse(readFileSync(trainerManifestPath, 'utf8')).base_model_manifest?.path ?? null;
        } catch {
          basePath = null;
        }
      }
    }
    const pinned = String(basePath ?? '').includes('1.5b');
    if (pinned !== pins15) continue;
    const selected = JSON.parse(readFileSync(selection, 'utf8'));
    const row = selected.rows.find((entry) => entry.checkpoint === selected.winner);
    if (row === undefined) continue;
    const gguf = resolveArtifactPath(row.gguf);
    if (!existsSync(gguf)) continue;
    candidates.push({ experiment: selected.experiment, winner: selected.winner, gguf });
  }
  candidates.sort((left, right) => right.experiment.localeCompare(left.experiment));
  return candidates[0] ?? null;
}

/**
 * The newest experiment whose run-manifest pins the 1.5B base, or `null` when
 * none does. The 1.5B student lane joins the chat the moment this returns a
 * winner, and it drops back out the moment it returns `null`.
 */
export function winner15() {
  return winnerByBase({ pins15: true });
}

/**
 * The newest experiment whose run-manifest does not pin the 1.5B base — the
 * 0.5B arm — or `null` when none does. The chat's default artifact is this
 * winner, so the owner's playground serves the latest 0.5B-trained student
 * rather than a checkpoint whose recipe changed size.
 */
export function winner05() {
  return winnerByBase({ pins15: false });
}
