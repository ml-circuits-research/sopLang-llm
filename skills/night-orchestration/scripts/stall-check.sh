#!/usr/bin/env bash
# The stall sentinel: detects a worker trapped in a restart loop (consecutive
# supervisor episodes ending at the SAME step via the memory guard, exit 3) or a
# worker whose progress log is frozen, and raises a marker file that any health
# check or morning glance sees. Detection only - it never kills anything.
# Usage: bash stall-check.sh   (env: PROJECT_ROOT, JOBS_DIR, STATE_FILE, thresholds)
set -uo pipefail
PROJECT_ROOT="${PROJECT_ROOT:-$(pwd)}"
JOBS_DIR="${JOBS_DIR:-$PROJECT_ROOT/.jobs}"
LOG="${STALL_CHECK_LOG:-$PROJECT_ROOT/.stall-check.log}"
INTERVAL="${STALL_CHECK_INTERVAL:-300}"
WINDOW="${STALL_CHECK_WINDOW:-3}"
STATE_FILE="${STALL_STATE_FILE:-overnight-state.jsonl}"
STALE_SECONDS="${STALL_STALE_SECONDS:-1800}"
WORKER_PATTERN="${WORKER_PATTERN:-}"
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> "$LOG"; }
note "stall sentinel started (window ${WINDOW} episodes, stale ${STALE_SECONDS}s, interval ${INTERVAL}s)"
while :; do
  for dir in "$JOBS_DIR"/*/; do
    [ -d "$dir" ] || continue
    job="$(basename "$dir")"
    state="$dir/$STATE_FILE"
    marker="$dir/STALL-ALARM.txt"
    if [ -f "$state" ]; then
      # The restart-loop signature: the last WINDOW episodes all stopped at the
      # same step with exit code 3 (the memory guard). A healthy run stops at
      # different steps, so the signature cannot fire on normal resumption.
      verdict="$(tail -n "$WINDOW" "$state" | python3 -c '
import json,sys
rows=[]
for line in sys.stdin:
    line=line.strip()
    if not line: continue
    try: rows.append(json.loads(line))
    except Exception: pass
if len(rows) >= int(sys.argv[1]) and len(set(r.get("step") for r in rows)) == 1 and all(r.get("exit_code") == 3 for r in rows):
    print("LOOP:{}:{}".format(rows[-1].get("step"), rows[-1].get("updated_utc","")))
' "$WINDOW" 2>/dev/null)"
      if [ -n "$verdict" ] && [ ! -f "$marker" ]; then
        step="$(printf '%s' "$verdict" | cut -d: -f2)"
        note "CRITICAL $job is in a restart loop at step $step (${WINDOW} episodes, exit 3) - a human or an agent must look; marker: $marker"
        printf 'restart loop at step %s, detected %s\n' "$step" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$marker"
      elif [ -z "$verdict" ] && [ -f "$marker" ]; then
        note "$job recovered from the restart loop; clearing the marker"
        rm -f "$marker"
      fi
    fi
    if [ -n "$WORKER_PATTERN" ] && pgrep -f "$WORKER_PATTERN" > /dev/null 2>&1; then
      progress="$dir/train-log.jsonl"
      if [ -f "$progress" ]; then
        idle=$(( $(date +%s) - $(stat -c %Y "$progress" 2>/dev/null || echo 0) ))
        if [ "$idle" -gt "$STALE_SECONDS" ]; then
          note "WARN $job is running but its progress log has not changed for $((idle/60)) minutes"
        fi
      fi
    fi
  done
  sleep "$INTERVAL"
done
