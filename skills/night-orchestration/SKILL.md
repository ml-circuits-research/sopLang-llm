# Night orchestration: unattended long-running work without losing nights

The discipline and the tools for running long unattended jobs (training, batch evaluation,
anything that must survive closed terminals and machine resets) on one machine, safely.
Everything here is project-independent: the scripts read their configuration from environment
variables with documented conventions, so the whole folder can be copied into any project and
adopted in minutes.

## The rules (learned the hard way)

1. One worker at a time, always. A second concurrent worker on the same machine corrupts the
   first one's outputs (the sopLang-llm project ran three trainers at once twice, both nights
   lost). The launcher refuses, it does not warn.
2. Every launch passes a preflight gate first: no other worker, the job is not already
   supervised, enough disk, and no resume from an incomplete checkpoint. A refused launch is a
   healthy night; a forced launch is a corrupted one.
3. The completion signal is an artifact, never a log line: a chain that failed also writes
   "series done". Wait for the result artifact (metrics.json in the conventions below). A
   failure marker with no live processes raises a visible CHAIN-ALARM.txt (reported by the
   health check) and the watcher KEEPS WAITING - it never exits, because a stale failure line
   can precede a fresh chain by seconds, and an exited watcher kills the queue silently.
4. Disk is part of the experiment design. Prune closed jobs proactively (the night of
   2026-09-23 died on a full disk mid-save); the disk guard warns below 40 GiB and stops
   workers and downloads below 16 GiB.
5. Detached launches: setsid + nohup, logs beside the job, everything survives the terminal
   and the SSH session.
6. Operational scripts live in the repository (or this skill), never in /tmp: a machine reset
   wipes /tmp and the runbook with it.
7. Run the health check before and after every action; a clean morning starts with it.
   A stall sentinel watches every worker and raises a marker the moment a restart loop forms,
   so a blocked night is discovered in minutes, not when a human asks.

## Conventions (overridable by environment)

| variable | meaning | default |
| --- | --- | --- |
| PROJECT_ROOT | the project directory | the current directory |
| JOBS_DIR | job state (checkpoints, logs, recipes) | $PROJECT_ROOT/.jobs |
| RESULTS_DIR | run results (per-job logs, metrics) | $PROJECT_ROOT/.results |
| WORKER_PATTERN | pgrep pattern matching the one-at-a-time worker | (required) |
| SUPERVISOR_PATTERN | pgrep pattern matching the job supervisor | (required) |
| CHAIN_PATTERN | pgrep pattern matching the result-producing chain | (required) |
| MIN_FREE_GIB / WARN_FREE_GIB / STOP_FREE_GIB | disk thresholds | 30 / 40 / 16 |

A job's resume state lives under $JOBS_DIR/<job>/checkpoint-*; a job's completion artifact is
$RESULTS_DIR/<job>/metrics.json, and its log is $RESULTS_DIR/<job>/series.log.

## The scripts

- scripts/preflight.sh <job> — the launch gate: refuses when any precondition fails (worker
  running, double supervision, disk below MIN_FREE_GIB, incomplete newest checkpoint).
  Call it from every launcher, before anything else.
- scripts/lib-watch.sh — `wait_chain <job>`: returns only when metrics.json exists; detects a
  really-failed chain (failure marker + no live worker/supervisor/chain), raises
  CHAIN-ALARM.txt, and keeps waiting; starts the chain manually when nothing did after a
  grace period. Source it from watchers; the caller provides a `note` function.
- scripts/disk-guard.sh — the disk sentinel: one line every five minutes, warns below
  WARN_FREE_GIB, stops workers and downloads below STOP_FREE_GIB.
- scripts/stall-check.sh — the stall sentinel: runs every five minutes and raises a
  STALL-ALARM.txt marker when a worker is trapped in a restart loop (consecutive supervisor
  episodes ending at the same step) or its progress log is frozen. Detection only, never
  kills. The health check reports the markers.
- scripts/health-check.sh — the one-command status: disk, temperatures, workers,
  supervisors, chains, watchers, gates, stall alarms, and chain alarms. Run it before and
  after every action.
- scripts/session-sentinel.sh — the standing guard for a working session: every
  CHECK_INTERVAL (default 30 minutes) it runs the health check and writes one line to the
  sentinel log; when an alarm marker exists, disk is below WARN_FREE_GIB, or a check output
  is CRITICAL, it prints the full report and exits non-zero so the supervising agent is
  woken. Silent while healthy, loud when not.

## Adopting in a new project

1. Copy skills/night-orchestration into the project's skill folder.
2. Set WORKER_PATTERN, SUPERVISOR_PATTERN, CHAIN_PATTERN (and any path overrides) in the
   launcher's environment.
3. Make the launcher call scripts/preflight.sh before starting anything, source
   scripts/lib-watch.sh in its watchers, and run scripts/disk-guard.sh and
   scripts/health-check.sh as the standing sentinels.
4. Record the launch and disk discipline in the project's AGENTS.md (the rules above).
