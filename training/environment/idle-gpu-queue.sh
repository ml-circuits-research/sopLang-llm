#!/usr/bin/env bash
# Runs queued evaluation jobs beside other GPU work, as long as memory allows, and backs off first.
#
# The GPU of this host (unified memory) is shared with training in other projects, which has
# priority. Small-model evaluation jobs may run beside that training, one at a time, while the
# host has memory to spare. Every POLL_SECONDS the watcher reads MemAvailable:
# - it starts the next unfinished job only when at least START_FREE_GIB are available and the
#   disk has at least MIN_FREE_GIB free (the repository's launch discipline);
# - it stops the running job's whole process group (its llama-server included) when available
#   memory falls below STOP_FREE_GIB, so the evaluation, not the training, gives way;
# - it stops a job whose record file has not grown for STALL_MINUTES (too slow beside the
#   training, or hung), and counts that as a failure.
# Jobs are resumable (evaluation/run-items.mjs skips recorded items), so a stopped job restarts
# later where it stopped. A job that exits 0 is marked done; one that fails three times is skipped.
#
# Queue: evaluation/registry/idle-queue/queue.txt, one job per line, "name|shell command", where
# name is also the job's registry directory (its progress is evaluation/registry/<name>/items.jsonl).
# Lines starting with # are ignored. Log: idle-queue/watcher.log. Start it detached:
#   bash training/environment/start-detached.sh cmd idle-gpu-queue "bash training/environment/idle-gpu-queue.sh"
set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
state="$root/evaluation/registry/idle-queue"
mkdir -p "$state/done" "$state/failed" "$state/logs"
queue="$state/queue.txt"
log="$state/watcher.log"
START_FREE_GIB="${START_FREE_GIB:-24}"
STOP_FREE_GIB="${STOP_FREE_GIB:-8}"
MIN_FREE_GIB="${MIN_FREE_GIB:-30}"
STALL_MINUTES="${STALL_MINUTES:-20}"
POLL_SECONDS="${POLL_SECONDS:-60}"

note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> "$log"; }
available_gib() { awk '/^MemAvailable:/ { printf "%d", $2 / 1048576 }' /proc/meminfo; }
disk_gib() { df -BG --output=avail "$root" | tail -1 | tr -dc '0-9'; }
records_of() { local file="$root/evaluation/registry/$1/items.jsonl"; if [ -f "$file" ]; then wc -l < "$file"; else echo 0; fi; }
failures_of() { cat "$state/failed/$1" 2>/dev/null || echo 0; }
record_failure() { local count=$(( $(failures_of "$1") + 1 )); echo "$count" > "$state/failed/$1"; note "job $1: $2 (failure $count of 3)"; }
next_job() {
  [ -f "$queue" ] || return 1
  local line name
  while IFS= read -r line; do
    case "$line" in ''|'#'*) continue ;; esac
    name="${line%%|*}"
    [ -f "$state/done/$name" ] && continue
    [ "$(failures_of "$name")" -ge 3 ] && continue
    printf '%s\n' "$line"
    return 0
  done < "$queue"
  return 1
}
stop_job() {
  kill -TERM -- "-$job_pid" 2>/dev/null || kill -TERM "$job_pid" 2>/dev/null
  sleep 20
  kill -KILL -- "-$job_pid" 2>/dev/null || true
  wait "$job_pid" 2>/dev/null
}

job_pid=""; job_name=""; last_count=0; last_growth=0; last_report=0
note "watcher started (start at >= ${START_FREE_GIB} GiB available, stop below ${STOP_FREE_GIB} GiB, stall after ${STALL_MINUTES} min)"
while true; do
  now=$(date +%s)
  mem="$(available_gib)"
  if [ -n "$job_pid" ]; then
    if ! kill -0 "$job_pid" 2>/dev/null; then
      wait "$job_pid"; status=$?
      if [ "$status" -eq 0 ]; then touch "$state/done/$job_name"; note "job $job_name finished ($(records_of "$job_name") records)"; else record_failure "$job_name" "exited with status $status"; fi
      job_pid=""; job_name=""
    elif [ "$mem" -lt "$STOP_FREE_GIB" ]; then
      note "only ${mem} GiB available; stopping $job_name to protect the other work"
      stop_job; job_pid=""; job_name=""
    else
      count="$(records_of "$job_name")"
      if [ "$count" -gt "$last_count" ]; then last_count="$count"; last_growth="$now"; fi
      if [ $(( now - last_report )) -ge 600 ]; then note "job $job_name: $count records, ${mem} GiB available"; last_report="$now"; fi
      if [ $(( now - last_growth )) -ge $(( STALL_MINUTES * 60 )) ]; then
        record_failure "$job_name" "no new record for ${STALL_MINUTES} min; stopped"
        stop_job; job_pid=""; job_name=""
      fi
    fi
  elif [ "$mem" -ge "$START_FREE_GIB" ] && [ "$(disk_gib)" -ge "$MIN_FREE_GIB" ] && job="$(next_job)"; then
    job_name="${job%%|*}"; command="${job#*|}"
    note "${mem} GiB available; starting $job_name"
    setsid bash -c "$command" >> "$state/logs/$job_name.log" 2>&1 &
    job_pid=$!
    last_count="$(records_of "$job_name")"; last_growth="$now"; last_report="$now"
  fi
  sleep "$POLL_SECONDS"
done
