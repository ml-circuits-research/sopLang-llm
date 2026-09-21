// Local llama.cpp processes: one place that knows how this repository starts,
// waits for, and stops them, shared by checkpoint selection, the holdout run of
// a selected checkpoint, and the deployment measurement.

import { spawn } from 'node:child_process';
import { closeSync, openSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPOSITORY_ROOT = fileURLToPath(new URL('..', import.meta.url));
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

export async function waitForServer(port, timeoutMs = 300_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      if (response.ok) {
        return;
      }
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`llama-server on port ${port} was not ready within ${timeoutMs} ms`);
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
    await waitForServer(port);
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
