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
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $experiment: waiting for the trainer to finish" | tee -a "$log"
  while pgrep -f "sft_train.py --experiment $experiment" > /dev/null; do
    sleep 60
  done

  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $experiment: checkpoint selection" | tee -a "$log"
  node "$repository_root/evaluation/select-checkpoint.mjs" --experiment "$experiment" --concurrency 4 >> "$log" 2>&1
  if [ $? -ne 0 ]; then
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $experiment: selection failed; see $log" | tee -a "$log" >&2
    continue
  fi

  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $experiment: holdout run of the selected checkpoint" | tee -a "$log"
  bash "$repository_root/evaluation/run-holdout.sh" "$experiment" --concurrency 4 >> "$log" 2>&1
done

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] series done" | tee -a "$log"
