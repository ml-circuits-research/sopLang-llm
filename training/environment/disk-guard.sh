#!/usr/bin/env bash
# Disk-space guard for unattended work: one line every five minutes, a warning
# below 20 GiB free, and a trainer stop below 8 GiB free so a filling disk can
# never wedge the night. Lives in the repository because /tmp dies on a reset.
# Usage: bash training/environment/start-detached.sh cmd disk-guard "bash training/environment/disk-guard.sh"
set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG="$root/evaluation/registry/disk-guard.log"
WARN_GIB=40
STOP_GIB=16
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> "$LOG"; }
note "disk guard started (warn < ${WARN_GIB} GiB, stop trainer < ${STOP_GIB} GiB)"
while :; do
  free_kib="$(df -k "$root" | awk 'NR==2 {print $4}')"
  free_gib=$(( free_kib / 1024 / 1024 ))
  note "free ${free_gib} GiB on $(df -h "$root" | awk 'NR==2 {print $1}')"
  if [ "$free_gib" -lt "$STOP_GIB" ]; then
    note "CRITICAL: below ${STOP_GIB} GiB; stopping the trainer and every download"
    pkill -TERM -f "sft_train.py --experiment" || true
    pkill -TERM -f "snapshot_download" || true
  elif [ "$free_gib" -lt "$WARN_GIB" ]; then
    note "WARN: below ${WARN_GIB} GiB free"
  fi
  sleep 300
done
