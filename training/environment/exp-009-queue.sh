#!/usr/bin/env bash
# Queue the capability-preservation mixture arm after the structure run.
#
# The probes measured the substrate loss that DS009 warns about: the untuned base
# passes 4 of 10 capability probes and every fine-tuned arm passes 0 or 1
# (evaluation/registry/<experiment>/probes.md, compared in
# evaluation/registry/phase4-first-series.md). `exp-009-mix10` keeps the recipe
# and the export of `exp-008-sft-shapes` exactly as they are and adds the
# preservation view `training/data/preservation-10.jsonl` — every tenth training
# statement repeated with the derived standalone JavaScript that prints the same
# answer — through the trainer's `--extra-data`. One dimension changes: the
# mixture.
#
# Everything is appended to `evaluation/registry/exp-009-queue.log`.
#
# Usage:
#   bash training/environment/start-detached.sh cmd exp-009-queue \
#     "bash training/environment/exp-009-queue.sh"

set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

LOG="$root/evaluation/registry/exp-009-queue.log"
TIMEOUT="${EXP009_QUEUE_TIMEOUT_SECONDS:-36000}"   # ten hours
PRESERVATION="$root/training/data/preservation-10.jsonl"
FLAGS=(
  --epochs 3 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 90
  --extra-data training/data/preservation-10.jsonl
)

note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> "$LOG"; }

busy() {
  pgrep -f '[s]ft_train\.py --experiment' >/dev/null && return 0
  pgrep -f '[s]elect-checkpoint\.mjs' >/dev/null && return 0
  pgrep -f '[r]un-eval\.mjs' >/dev/null && return 0
  pgrep -f '[l]lama-server -m' >/dev/null && return 0
  return 1
}

note "queue started: waiting for the exp-008-sft-shapes evaluation chain"
while pgrep -f '[r]un-series\.sh exp-008-sft' >/dev/null || pgrep -f '[s]ft_train\.py --experiment exp-008' >/dev/null; do sleep 60; done
note "exp-008 finished"

deadline=$(( $(date +%s) + TIMEOUT ))
while :; do
  if [ -f "$PRESERVATION" ] && [ -f "$root/evaluation/registry/exp-008-sft-shapes/report.md" ]; then
    note "preservation view and exp-008 holdout report present; waiting for an idle GPU"
    while busy; do sleep 60; done
    note "starting exp-009-mix10 (${FLAGS[*]})"
    bash "$root/training/environment/start-detached.sh" train exp-009-mix10 "${FLAGS[@]}" >> "$LOG" 2>&1
    note "exp-009-mix10 launched; the evaluation chain follows automatically"
    exit 0
  fi
  if [ "$(date +%s)" -gt "$deadline" ]; then
    note "timed out waiting for $PRESERVATION or the exp-008 holdout report; nothing started"
    exit 0
  fi
  sleep 60
done
