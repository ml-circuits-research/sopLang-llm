#!/usr/bin/env node
/**
 * Hard-death safety for the chat: a detached watcher that closes the
 * llama-server processes a chat started when that chat disappears.
 *
 * A SIGKILLed chat cannot run its cleanup, so a hard-killed chat would leave
 * every server it started behind — holding a port and the GPU. The chat spawns
 * one of these, detached, and it watches the chat's PID; the moment the parent
 * no longer exists, the reaper terminates each recorded server's process group
 * (llama-server is started detached, so it is the leader of its own group),
 * then exits. It never signals a process it was not given.
 *
 * Usage:
 *   node evaluation/server-reaper.mjs <parent-pid> <server-pid>...
 *   node evaluation/server-reaper.mjs <parent-pid> <pid-file>
 *
 * A server argument that names an existing file is read as a growing PID list
 * (one per line), so the chat can record lanes as it starts them; every other
 * argument is a server PID. The list is re-read before the final kill so a lane
 * started just before the parent died is still closed.
 */

import { existsSync, readFileSync } from 'node:fs';

const POLL_MS = 1000;
const GRACE_MS = 5000;

const parentPid = Number(process.argv[2]);
const pidSources = process.argv.slice(3);

function parentIsAlive() {
  try {
    process.kill(parentPid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

/** The server PIDs this reaper is responsible for, as of right now. */
function currentServerPids() {
  const pids = new Set();
  for (const source of pidSources) {
    if (/^\d+$/.test(source)) {
      const pid = Number(source);
      if (pid > 0) pids.add(pid);
    } else if (existsSync(source)) {
      for (const line of readFileSync(source, 'utf8').split('\n')) {
        const pid = Number(line.trim());
        if (Number.isInteger(pid) && pid > 0) pids.add(pid);
      }
    }
  }
  return [...pids];
}

function groupGone(pid) {
  try {
    process.kill(-pid, 0);
    return false;
  } catch {
    return true;
  }
}

function signalGroup(pid, signal) {
  try {
    process.kill(-pid, signal);
  } catch {
    // Already gone.
  }
}

async function main() {
  if (!Number.isInteger(parentPid) || parentPid <= 0) {
    process.exit(0);
  }
  while (parentIsAlive()) {
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
  // The parent is gone: stop every server recorded for it, and nothing else.
  const servers = currentServerPids();
  for (const pid of servers) signalGroup(pid, 'SIGTERM');
  const deadline = Date.now() + GRACE_MS;
  while (Date.now() < deadline) {
    if (servers.every((pid) => groupGone(pid))) break;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  for (const pid of servers) signalGroup(pid, 'SIGKILL');
  process.exit(0);
}

main();
