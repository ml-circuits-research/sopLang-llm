#!/usr/bin/env bash
# The launch gate. Refuses loudly instead of corrupting a night.
# Usage: bash preflight.sh <job>
set -uo pipefail
PROJECT_ROOT="${PROJECT_ROOT:-$(pwd)}"
JOBS_DIR="${JOBS_DIR:-$PROJECT_ROOT/.jobs}"
MIN_FREE_GIB="${MIN_FREE_GIB:-30}"
job="${1:-}"
if [ -z "$job" ]; then echo "preflight: <job> is required" >&2; exit 2; fi

fail() { echo "preflight REFUSED: $*" >&2; exit 1; }

if [ -n "${WORKER_PATTERN:-}" ] && pgrep -f "$WORKER_PATTERN" > /dev/null; then
  other="$(pgrep -af "$WORKER_PATTERN" | head -1 | grep -oE "$WORKER_PATTERN" | head -1 || echo '?')"
  fail "another worker is already running (${other}); one worker at a time"
fi

if [ -n "${SUPERVISOR_PATTERN:-}" ] && pgrep -f "$SUPERVISOR_PATTERN" > /dev/null; then
  fail "$job is already supervised"
fi

free_gib="$(df -k "$PROJECT_ROOT" | awk 'NR==2 {print $4}')"
free_gib=$(( free_gib / 1024 / 1024 ))
if [ "$free_gib" -lt "$MIN_FREE_GIB" ]; then
  fail "only ${free_gib} GiB free (minimum ${MIN_FREE_GIB}); prune closed jobs first"
fi

if [ -d "$JOBS_DIR/$job" ] && compgen -G "$JOBS_DIR/$job/checkpoint-*" > /dev/null; then
  newest="$(ls -1d "$JOBS_DIR"/"$job"/checkpoint-* | sort -V | tail -1)"
  if [ ! -f "$newest/trainer_state.json" ] && [ ! -f "$newest/model.safetensors" ]; then
    fail "the newest checkpoint $newest is incomplete; remove it and retry"
  fi
fi

# On unified-memory hosts (the GB10) the page cache and the CUDA driver share
# one pool; a bloated cache starves the driver below the trainer's memory floor
# (the 2026-09-26 exp-024 restart loop). The shared cache-squeeze script
# detects the signature and reclaims the clean cache pages; it no-ops when
# torch is unavailable.
if [ "${SQUEEZE_CACHE:-1}" = "1" ] && [ -n "${CUDA_PYTHON:-}" ] && [ -x "$CUDA_PYTHON" ]; then
  "$(dirname "$0")/cache-squeeze.sh" || true
fi

echo "preflight OK: no other worker, disk ${free_gib} GiB free, $job free to launch"
