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
# one pool. A bloated cache leaves the driver under the trainer's memory floor
# even though the host reports plenty available, and the floor guard refuses
# the run at step 0 (the 2026-09-26 exp-024 restart loop). Touching anonymous
# pages at a 4K stride forces the kernel to reclaim clean inactive file pages;
# the pages are then released, so the pool returns to the driver. Nothing runs
# when CUDA_PYTHON is unset or torch is unavailable.
if [ "${SQUEEZE_CACHE:-1}" = "1" ] && [ -n "${CUDA_PYTHON:-}" ] && [ -x "$CUDA_PYTHON" ]; then
  free="$("$CUDA_PYTHON" -c 'import torch; print(round(torch.cuda.mem_get_info()[0] / 2**30, 1))' 2>/dev/null || echo NA)"
  if [ "$free" != "NA" ] && awk -v f="$free" -v t="${CUDA_MIN_FREE_GIB:-48}" 'BEGIN { exit !(f < t) }'; then
    echo "preflight: page cache holds the unified pool (CUDA free ${free} GiB < ${CUDA_MIN_FREE_GIB:-48}); squeezing"
    "$CUDA_PYTHON" - "${CUDA_MIN_FREE_GIB:-48}" <<'PY'
import mmap, sys
import torch
target = float(sys.argv[1])
rounds = 0
while rounds < 8:
    free = torch.cuda.mem_get_info()[0] / 2**30
    if free >= target:
        break
    size = int(min(24, max(8, target - free + 4)) * 2**30)
    buf = mmap.mmap(-1, size)
    for off in range(0, size, 4096):
        buf[off] = 1
    buf.close()
    rounds += 1
print(f"preflight: after {rounds} squeeze round(s), CUDA free {torch.cuda.mem_get_info()[0] / 2**30:.1f} GiB")
PY
  fi
fi

echo "preflight OK: no other worker, disk ${free_gib} GiB free, $job free to launch"
