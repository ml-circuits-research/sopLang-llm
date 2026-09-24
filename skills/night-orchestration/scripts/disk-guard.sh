#!/usr/bin/env bash
# The disk sentinel for unattended work: one line every five minutes, a warning
# below WARN_FREE_GIB, and a stop of workers and downloads below STOP_FREE_GIB,
# well above the point where a mid-save interruption corrupts an output.
# Usage: bash disk-guard.sh   (env: PROJECT_ROOT, LOG path, thresholds, patterns)
set -uo pipefail
PROJECT_ROOT="${PROJECT_ROOT:-$(pwd)}"
LOG="${DISK_GUARD_LOG:-$PROJECT_ROOT/.disk-guard.log}"
WARN_FREE_GIB="${WARN_FREE_GIB:-40}"
STOP_FREE_GIB="${STOP_FREE_GIB:-16}"
WORKER_PATTERN="${WORKER_PATTERN:-}"
DOWNLOAD_PATTERN="${DOWNLOAD_PATTERN:-snapshot_download}"
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> "$LOG"; }
note "disk guard started (warn < ${WARN_FREE_GIB} GiB, stop < ${STOP_FREE_GIB} GiB)"
while :; do
  free_kib="$(df -k "$PROJECT_ROOT" | awk 'NR==2 {print $4}')"
  free_gib=$(( free_kib / 1024 / 1024 ))
  note "free ${free_gib} GiB"
  if [ "$free_gib" -lt "$STOP_FREE_GIB" ]; then
    note "CRITICAL: below ${STOP_FREE_GIB} GiB; stopping workers and downloads"
    [ -n "$WORKER_PATTERN" ] && pkill -TERM -f "$WORKER_PATTERN" || true
    pkill -TERM -f "$DOWNLOAD_PATTERN" || true
  elif [ "$free_gib" -lt "$WARN_FREE_GIB" ]; then
    note "WARN: below ${WARN_FREE_GIB} GiB free"
  fi
  sleep 300
done
