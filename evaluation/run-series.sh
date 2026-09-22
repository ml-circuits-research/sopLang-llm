#!/usr/bin/env bash
# Selection and holdout for a list of experiments, in order (training/PLAN.md T6/T7).
#
# For each experiment id: wait until its trainer is no longer running, then run
# `evaluation/select-checkpoint.mjs` (checkpoint selection on the validation
# slice) and `evaluation/run-holdout.sh` (one holdout run of the winner). The
# evaluations are serialized on purpose: a selection server and a trainer share
# one GPU, and running them together doubled the wall time of both.
#
# Usage:
#   bash evaluation/run-series.sh exp-003-sft-lr1e-4 exp-002-sft-lr2e-5
#
# Every step appends to <experiment>/series.log inside the registry folder; the
# per-item records, metrics, report, selection table, and run manifest of each
# step are the evidence of the run.

set -uo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ "$#" -lt 1 ]; then
  echo "usage: run-series.sh <experiment-id> [<experiment-id> ...]" >&2
  exit 2
fi

for experiment in "$@"; do
  registry="$repository_root/evaluation/registry/$experiment"
  mkdir -p "$registry"
  log="$registry/series.log"
  # Refuse to run beside another chain of the same experiment: two selections
  # scoring one registry folder mix their per-item records. `start-chain.sh`
  # holds this lock for the decision it makes, so a chain it starts is the only
  # one for that experiment while it runs.
  exec 8>"$registry/.chain.lock"
  if ! flock -n 8; then
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $experiment: another evaluation chain holds the lock; this one exits" >> "$log"
    continue
  fi
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $experiment: waiting for the trainer to finish" >> "$log"
  while pgrep -f "[s]ft_train.py --experiment $experiment" > /dev/null; do
    sleep 60
  done

  # A completed selection is evidence that this step already ran: re-running it
  # would re-score every checkpoint while the holdout waits behind it, which is
  # exactly what happened to exp-008-sft-shapes at 22:33Z.
  if [ -f "$registry/selection.md" ] && [ -f "$registry/selection.json" ]; then
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $experiment: selection already complete; skipping to the holdout" >> "$log"
  else
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $experiment: checkpoint selection" >> "$log"
    node "$repository_root/evaluation/select-checkpoint.mjs" --experiment "$experiment" --concurrency 4 >> "$log" 2>&1
    if [ $? -ne 0 ]; then
      echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $experiment: selection failed; see $log" >> "$log" >&2
      continue
    fi
  fi

  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $experiment: holdout run of the selected checkpoint" >> "$log"
  CHAIN_LOCK_HELD_BY_PARENT=yes bash "$repository_root/evaluation/run-holdout.sh" "$experiment" --concurrency 4 >> "$log" 2>&1
done

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] series done" >> "$log"
