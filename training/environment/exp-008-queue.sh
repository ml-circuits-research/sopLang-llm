#!/usr/bin/env bash
# Queue the next arm on a *new* dataset export, never on the one exp-007 already trained.
#
# The queue that was launched by hand on 2026-09-21 18:58 fired as soon as the
# exp-007 evaluation chain ended and would have started `exp-008-sft-shapes` with
# the same recipe on the same export exp-007 had just trained on (snapshot
# 390211ea6a9bb711750b128b414ce9f5d4fc093db42d545f9eca01cd22d7495e, dataset sha
# 6dbfb1ebd12c6e4ca17f65c47970ebaa6f358eb9881ac1788607f9f4ec9e9d37): a duplicate
# run that would cost half an hour of the GPU and record a second, identical
# experiment. This queue waits for the exp-007 chain to finish, then for the
# trainer-view export to change, and only then starts the arm.
#
# Everything is appended to `evaluation/registry/exp-008-queue.log`, so the
# morning question "why did exp-008 start (or not start)?" has a written answer.
#
# Usage:
#   bash training/environment/start-detached.sh cmd exp-008-queue \
#     "bash training/environment/exp-008-queue.sh"

set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

LOG="$root/evaluation/registry/exp-008-queue.log"
TIMEOUT="${EXP008_QUEUE_TIMEOUT_SECONDS:-36000}"   # ten hours
EXPORT="$root/training/data/export-manifest.json"
SNAPSHOT_ALREADY_TRAINED="390211ea6a9bb711750b128b414ce9f5d4fc093db42d545f9eca01cd22d7495e"
FLAGS=(--epochs 3 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 90)

note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> "$LOG"; }

busy() {
  pgrep -f '[s]ft_train\.py --experiment' >/dev/null && return 0
  pgrep -f '[s]elect-checkpoint\.mjs' >/dev/null && return 0
  pgrep -f '[r]un-eval\.mjs' >/dev/null && return 0
  pgrep -f '[l]lama-server -m' >/dev/null && return 0
  return 1
}

note "queue started: waiting for the exp-007-sft-wires evaluation chain"
while pgrep -f '[r]un-series\.sh exp-007-sft' >/dev/null; do sleep 60; done
note "exp-007 chain finished"

deadline=$(( $(date +%s) + TIMEOUT ))
while :; do
  snapshot="$(jq -r '.snapshot // "missing"' "$EXPORT" 2>/dev/null || echo missing)"
  rows="$(jq -r '.rows // "?"' "$EXPORT" 2>/dev/null || echo '?')"
  if [ "$snapshot" != "$SNAPSHOT_ALREADY_TRAINED" ] && [ "$snapshot" != "missing" ]; then
    note "new export detected: snapshot $snapshot, $rows rows"
    while busy; do sleep 60; done
    note "GPU idle; starting exp-008-sft-shapes on the new export (${FLAGS[*]})"
    bash "$root/training/environment/start-detached.sh" train exp-008-sft-shapes "${FLAGS[@]}" >> "$LOG" 2>&1
    note "exp-008-sft-shapes launched; the evaluation chain follows automatically"
    exit 0
  fi
  if [ "$(date +%s)" -gt "$deadline" ]; then
    note "no new export within ${TIMEOUT}s (still $snapshot); NOT starting a duplicate of exp-007"
    exit 0
  fi
  sleep 60
done
