#!/usr/bin/env bash
# One-command status for unattended work: disk, workers, supervisors, chains,
# watchers, and gates. Run before and after every action; a clean morning
# starts with this. Usage: bash health-check.sh
set -uo pipefail
PROJECT_ROOT="${PROJECT_ROOT:-$(pwd)}"
JOBS_DIR="${JOBS_DIR:-$PROJECT_ROOT/.jobs}"
RESULTS_DIR="${RESULTS_DIR:-$PROJECT_ROOT/.results}"
free_gib="$(df -k "$PROJECT_ROOT" | awk 'NR==2 {print $4}')"
free_gib=$(( free_gib / 1024 / 1024 ))
echo "health $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "  disk free: ${free_gib} GiB"
if [ -n "${TEMP_COMMAND:-}" ]; then
  temp="$(bash -c "$TEMP_COMMAND" 2>/dev/null | head -3)"
  [ -n "$temp" ] && { echo "  temperatures:"; echo "$temp" | sed 's/^/    /'; }
fi
if [ -n "${WORKER_PATTERN:-}" ]; then
  count="$(pgrep -f "$WORKER_PATTERN" 2>/dev/null | wc -l | tr -d ' ')"
  count="${count:-0}"
  echo "  workers running: $count"
  if [ "$count" -gt 0 ]; then
    pgrep -af "$WORKER_PATTERN" | while read -r line; do echo "    - ${line:0:110}"; done
  fi
fi
if [ -n "${SUPERVISOR_PATTERN:-}" ]; then
  count="$(pgrep -f "$SUPERVISOR_PATTERN" 2>/dev/null | wc -l | tr -d ' ')"
  count="${count:-0}"
  echo "  supervisors running: $count"
fi
if [ -d "$RESULTS_DIR" ]; then
  echo "  results:"
  for dir in "$RESULTS_DIR"/*/; do
    [ -d "$dir" ] || continue
    name="$(basename "$dir")"
    state="no metrics"
    [ -f "$dir/metrics.json" ] && state="COMPLETE"
    last="$(tail -1 "$dir/series.log" 2>/dev/null | cut -c1-70)"
    echo "    - $name: $state${last:+ | $last}"
  done
fi
if [ -d "$JOBS_DIR" ]; then
  echo "  jobs:"
  for dir in "$JOBS_DIR"/*/; do
    [ -d "$dir" ] || continue
    name="$(basename "$dir")"
    checkpoints="$(ls -1d "$dir"/checkpoint-* 2>/dev/null | wc -l)"
    echo "    - $name: ${checkpoints} checkpoints"
  done
fi
for gate in "$PROJECT_ROOT"/*.flag "$JOBS_DIR"/*.flag; do
  [ -f "$gate" ] && echo "  gate open: $gate"
done
for alarm in "$JOBS_DIR"/*/STALL-ALARM.txt; do
  [ -f "$alarm" ] && echo "  STALL ALARM: $(cat "$alarm")"
done
echo "  watchers:"
for watcher in overnight-pipeline overnight-tail watchdog disk-guard night-watch; do
  count="$(pgrep -f "$watcher.sh" 2>/dev/null | wc -l | tr -d ' ')"
  [ "${count:-0}" -gt 0 ] 2>/dev/null && echo "    - $watcher: running"
done
# The unified pool: the cache-bloat signature that starves the trainer's memory
# floor is reported here so a human or an agent sees it before the next launch.
if [ -n "${CUDA_PYTHON:-}" ] && [ -x "$CUDA_PYTHON" ]; then
  free="$("$CUDA_PYTHON" -c 'import torch; print(round(torch.cuda.mem_get_info()[0] / 2**30, 1))' 2>/dev/null || echo NA)"
  host_avail="$(awk '/MemAvailable/ { printf "%.1f", $2 / 1024 / 1024 }' /proc/meminfo)"
  if [ "$free" != "NA" ]; then
    echo "  unified pool: CUDA free ${free} GiB, host available ${host_avail} GiB"
    if awk -v f="$free" -v t="${CUDA_MIN_FREE_GIB:-48}" -v h="$host_avail" -v m="${HOST_MIN_AVAIL_GIB:-48}" 'BEGIN { exit !(f < t && h >= m) }'; then
      echo "  CACHE BLOAT: run cache-squeeze.sh (the preflight does it automatically at launch)"
    fi
  fi
fi
