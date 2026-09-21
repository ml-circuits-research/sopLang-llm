#!/usr/bin/env bash
# Unattended record of the night, independent of every agent session.
#
# The shell watchdog already restarts work and warns about stale logs; this
# script adds the numbers a reader wants in the morning, one line every five
# minutes: which trainer is running and how far it has come, which evaluation
# chain is alive, whether the queued arm has started, and the device margin of
# the shared GB10 pool. It writes only to
# `evaluation/registry/overnight-supervisor.log` and stops after its deadline.
#
# Usage:
#   bash training/environment/start-detached.sh cmd night-watch "bash training/environment/night-watch.sh"

set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

LOG="$root/evaluation/registry/overnight-supervisor.log"
DEADLINE=$(( $(date +%s) + ${NIGHT_WATCH_SECONDS:-36000} ))   # ten hours by default

trainer_line() {
  local pid name step loss
  pid="$(pgrep -f '[s]ft_train\.py --experiment' | head -1)"
  if [ -z "$pid" ]; then
    printf 'no trainer running'
    return
  fi
  name="$(tr '\0' ' ' < "/proc/$pid/cmdline" | grep -oE -- '--experiment [A-Za-z0-9._-]+' | head -1 | cut -d' ' -f2)"
  if [ -f "$root/training/checkpoints/$name/train-log.jsonl" ]; then
    step="$(tail -1 "$root/training/checkpoints/$name/train-log.jsonl" | jq -r '.step // "?"' 2>/dev/null)"
    loss="$(tail -1 "$root/training/checkpoints/$name/train-log.jsonl" | jq -r '.loss // "?"' 2>/dev/null)"
    printf 'training %s step %s loss %s' "$name" "$step" "$loss"
  else
    printf 'training %s (no step log yet)' "$name"
  fi
}

chain_line() {
  local chain
  chain="$(pgrep -af '[r]un-series\.sh' | head -1 | grep -oE 'run-series\.sh .*' | head -1)"
  if [ -n "$chain" ]; then
    printf '%s' "$chain"
  else
    printf 'no chain running'
  fi
}

gpu_line() {
  local free
  free="$(training/.venv/bin/python -c 'import torch;f,_=torch.cuda.mem_get_info();print(f"{f/2**30:.1f}")' 2>/dev/null | tail -1)"
  printf '%s GiB device free' "${free:-unknown}"
}

report_line() {
  local experiment
  for experiment in exp-008-sft-shapes exp-009-mix10; do
    if [ -f "$root/evaluation/registry/$experiment/report.md" ]; then
      printf '%s done; ' "$experiment"
    elif [ -f "$root/training/checkpoints/$experiment/run-manifest.json" ]; then
      printf '%s %s; ' "$experiment" "$(jq -r '.status // "?"' "$root/training/checkpoints/$experiment/run-manifest.json" 2>/dev/null)"
    else
      printf '%s not started; ' "$experiment"
    fi
  done
}

while [ "$(date +%s)" -lt "$DEADLINE" ]; do
  printf '%s watch: %s | %s | %s | %s\n' \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$(trainer_line)" "$(chain_line)" "$(report_line)" "$(gpu_line)" >> "$LOG"
  sleep 300
done
printf '%s watch: deadline reached, stopping\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$LOG"
