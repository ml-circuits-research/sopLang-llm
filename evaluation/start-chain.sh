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
exec 9>"$registry/.chain.lock"
if ! flock -n 9; then
  echo "start-chain: another start-chain call holds the lock for $experiment; nothing to do"
  exit 0
fi

if [ -f "$registry/report.md" ]; then
  echo "start-chain: $experiment already has a holdout report; nothing to do"
  exit 0
fi
if pgrep -f "[r]un-series.sh $experiment" >/dev/null \
  || pgrep -f "[s]elect-checkpoint.mjs --experiment $experiment" >/dev/null \
  || pgrep -f "[r]un-eval.mjs --experiment $experiment" >/dev/null; then
  echo "start-chain: $experiment is already being evaluated; nothing to do"
  exit 0
fi
if pgrep -f "[s]ft_train.py --experiment $experiment" >/dev/null; then
  echo "start-chain: $experiment is still training; nothing to do"
  exit 0
fi

echo "start-chain: starting the evaluation chain of $experiment"
setsid nohup bash "$root/evaluation/run-series.sh" "$experiment" >> "$log" 2>&1 < /dev/null &
sleep 3
echo "start-chain: chain pid $(pgrep -f "[r]un-series.sh $experiment" | head -1)"
