#!/usr/bin/env bash
# Detect and fix the unified-memory cache-bloat condition.
#
# On unified-memory hosts (the NVIDIA GB10) the Linux page cache and the CUDA
# driver share one pool. A bloated cache (clean inactive file pages) leaves the
# driver below the trainer's memory floor even though the host reports plenty
# available, and the floor guard refuses the run at step 0 while the stall
# alarm restarts it in a loop (the 2026-09-26 exp-024 incident). This script
# detects that exact signature and fixes it by touching anonymous pages at a
# 4K stride, which forces the kernel to reclaim the clean cache pages; the
# touched pages are then released, so the pool returns to the driver.
#
# Environment (all optional, see the repo adapter):
#   CUDA_PYTHON       python with torch; the only way to read the driver's view
#   CUDA_MIN_FREE_GIB target device free memory (default 48)
#   HOST_MIN_AVAIL_GIB host available the cache-bloat signature requires
#                     (default 48): when the host has plenty and the driver
#                     has little, the cache is the suspect
# Exit status: 0 healthy or fixed, 1 driver free below the target after the
# fix (rare: pinned memory), 2 cannot measure (no torch).
# Usage: bash cache-squeeze.sh
set -uo pipefail

CUDA_PYTHON="${CUDA_PYTHON:-python3}"
CUDA_MIN_FREE_GIB="${CUDA_MIN_FREE_GIB:-48}"
HOST_MIN_AVAIL_GIB="${HOST_MIN_AVAIL_GIB:-48}"

read_free() {
  "$CUDA_PYTHON" -c 'import torch; print(round(torch.cuda.mem_get_info()[0] / 2**30, 1))' 2>/dev/null || echo NA
}

free="$(read_free)"
if [ "$free" = "NA" ]; then
  echo "cache-squeeze: cannot read the driver memory (no torch at $CUDA_PYTHON); skipping"
  exit 2
fi

if awk -v f="$free" -v t="$CUDA_MIN_FREE_GIB" 'BEGIN { exit !(f < t) }'; then
  host_avail="$(awk '/MemAvailable/ { printf "%.1f", $2 / 1024 / 1024 }' /proc/meminfo)"
  if awk -v h="$host_avail" -v m="$HOST_MIN_AVAIL_GIB" 'BEGIN { exit !(h >= m) }'; then
    echo "cache-squeeze: cache bloat — CUDA free ${free} GiB < ${CUDA_MIN_FREE_GIB} while host available ${host_avail} GiB; squeezing"
    "$CUDA_PYTHON" - "$CUDA_MIN_FREE_GIB" <<'PY'
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
print(f"cache-squeeze: after {rounds} round(s), CUDA free {torch.cuda.mem_get_info()[0] / 2**30:.1f} GiB")
PY
    free="$(read_free)"
    if awk -v f="$free" -v t="$CUDA_MIN_FREE_GIB" 'BEGIN { exit !(f >= t) }'; then
      echo "cache-squeeze: fixed — CUDA free ${free} GiB"
      exit 0
    fi
    echo "cache-squeeze: still ${free} GiB after the squeeze; the memory is pinned elsewhere, not cache"
    exit 1
  fi
  echo "cache-squeeze: CUDA free ${free} GiB below target but host available ${host_avail} GiB below ${HOST_MIN_AVAIL_GIB}; a real consumer, not cache"
  exit 1
fi

echo "cache-squeeze: healthy — CUDA free ${free} GiB"
exit 0
