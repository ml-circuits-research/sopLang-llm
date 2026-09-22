#!/usr/bin/env bash
# One-shot start of an experiment's evaluation chain, guarded against duplicates.
#
# The chain is normally started by the detached wrapper of `start-detached.sh`
# and restarted by `watchdog.sh` when it is missing. Both can race with a chain
# started by hand: on the night of 2026-09-21 that happened twice for
# `exp-008-sft-shapes`, and two selections scoring the same registry folder would
# have mixed their per-item records. This script is the single entry point that
# checks first and starts second, under a lock file that makes the check atomic.
#
# Usage:
#   bash evaluation/start-chain.sh exp-008-sft-shapes
# Exit codes: 0 started, 0 nothing to do (already running or already scored), 2 usage.

set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

experiment="${1:-}"
if [ -z "$experiment" ]; then
  echo "usage: start-chain.sh <experiment-id>" >&2
  exit 2
fi

registry="$root/evaluation/registry/$experiment"
log="$registry/series.log"
mkdir -p "$registry"

# The lock makes "is a chain running?" and "start it" one decision: without it,
# two callers can both look, both see nothing, and both start a chain.
#
# A lock is only ever held for the few lines below, never for the chain's whole
# lifetime: `flock -w` waits briefly instead of failing on a transient overlap,
# and a holder that died leaves no lock behind (the kernel releases it with the
# process). What must not happen is the opposite case — an open descriptor
# inherited by a backgrounded child that outlives the decision — so the chain is
# started with `setsid nohup` plus an explicit descriptor close.
exec 9>"$registry/.chain.lock"
if ! flock -w 30 9; then
  echo "start-chain: another start-chain call holds the lock for $experiment after waiting 30s; nothing to do"
  exit 0
fi

if [ -f "$registry/report.md" ]; then
  echo "start-chain: $experiment already has a holdout report; nothing to do"
  exit 0
fi
# A selection table with a winner is evidence of a completed selection, so a
# chain started after it belongs at the holdout step, not at the top: on the
# night of 2026-09-21 a chain restarted from scratch and re-scored the eight
# checkpoints while the holdout it was meant to run waited behind it.
if [ -f "$registry/selection.md" ] && [ -f "$registry/selection.json" ]; then
  echo "start-chain: $experiment already has a completed selection; starting the holdout of its winner"
  setsid nohup bash "$root/evaluation/run-holdout.sh" "$experiment" --concurrency 4 >> "$log" 2>&1 < /dev/null 9>&- &
  sleep 3
  echo "start-chain: holdout pid $(pgrep -f "[r]un-holdout.sh $experiment" | head -1)"
  exit 0
fi
if pgrep -f "[r]un-series.sh $experiment" >/dev/null \
  || pgrep -f "[s]elect-checkpoint.mjs --experiment $experiment" >/dev/null \
  || pgrep -f "[r]un-eval.mjs --experiment $experiment" >/dev/null \
  || pgrep -f "[r]un-holdout.sh $experiment" >/dev/null; then
  echo "start-chain: $experiment is already being evaluated; nothing to do"
  exit 0
fi
if pgrep -f "[s]ft_train.py --experiment $experiment" >/dev/null; then
  echo "start-chain: $experiment is still training; nothing to do"
  exit 0
fi

echo "start-chain: starting the evaluation chain of $experiment"
# The lock protects the decision above, not the run: it is released before the
# chain starts, and `run-series.sh` takes it for its own lifetime, so two chains
# of one experiment still cannot run together while this script stays callable
# during a live chain.
flock -u 9
setsid nohup bash "$root/evaluation/run-series.sh" "$experiment" >> "$log" 2>&1 < /dev/null 9>&- &
sleep 3
echo "start-chain: chain pid $(pgrep -f "[r]un-series.sh $experiment" | head -1)"
