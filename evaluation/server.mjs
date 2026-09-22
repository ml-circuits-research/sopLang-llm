// Local llama.cpp processes: one place that knows how this repository starts,
// waits for, and stops them, shared by checkpoint selection, the holdout run of
// a selected checkpoint, and the deployment measurement.

import { spawn } from 'node:child_process';
import { closeSync, openSync, readFileSync } from 'node:fs';
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

/** Server arguments of every measured run: full offload, the model's own template, four slots. */
export function serverArguments(ggufPath, port, { threads = null } = {}) {
  return [
    '-m', ggufPath,
    '--port', String(port),
    '--ctx-size', '16384',
    '--n-gpu-layers', '99',
    '--jinja',
    '--parallel', '4',
    '--alias', 'student',
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
    await waitForServer(port, 300_000, { expectedModel: 'student', child });
    return await body({
      port,
      pid: child.pid,
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
