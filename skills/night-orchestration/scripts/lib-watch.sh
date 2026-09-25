# Shared chain-waiting logic for unattended watchers. Sourced, not executed:
# the caller provides a `note` function, sets RESULTS_DIR/CHAIN_PATTERN, then
# calls wait_chain <job>.
#
# wait_chain returns only when the job's result artifact exists
# ($RESULTS_DIR/<job>/metrics.json) — the one artifact only a chain that reached
# its final result writes. A failed chain also writes "series done" in its log,
# so the log line is never trusted. A really-failed chain (a failure marker in
# the log, no live worker/supervisor/chain) stops the watcher with exit 5.

wait_chain() {
  local job="$1"
  local waited=0
  local seen_selection_lines="${seen_selection_lines:-$(grep -c "$SELECTION_MARKER" "$RESULTS_DIR/$job/series.log" 2>/dev/null || echo 0)}"
  RESULTS_DIR="${RESULTS_DIR:-$PROJECT_ROOT/.results}"
  FAILURE_MARKER="${FAILURE_MARKER:-failed}"
  SELECTION_MARKER="${SELECTION_MARKER:-selection}"
  CHAIN_LAUNCHER="${CHAIN_LAUNCHER:-}"
  while [ ! -f "$RESULTS_DIR/$job/metrics.json" ]; do
    if grep -q "$FAILURE_MARKER" "$RESULTS_DIR/$job/series.log" 2>/dev/null \
      && { [ -z "$WORKER_PATTERN" ] || ! pgrep -f "$WORKER_PATTERN" > /dev/null; } \
      && { [ -z "$SUPERVISOR_PATTERN" ] || ! pgrep -f "$SUPERVISOR_PATTERN" > /dev/null; } \
      && { [ -z "$CHAIN_PATTERN" ] || ! pgrep -f "$CHAIN_PATTERN" > /dev/null; }; then
      # Never exit on a failure line: a stale failure from an earlier aborted
      # chain fired once right between training completion and the new chain
      # starting. Raise a visible marker and keep waiting for the result
      # artifact - a human or an agent sees the marker in the health check.
      alarm="$RESULTS_DIR/$job/CHAIN-ALARM.txt"
      if [ ! -f "$alarm" ]; then
        note "CHAIN FAILURE $job: the log reports a failure, the work is over, and no chain is running - a human must look; marker: $alarm"
        printf 'chain failure detected %s; waiting for metrics.json\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$alarm"
      fi
    fi

    sleep 180
    waited=$((waited + 3))
    # The gate compares against the line count seen when the wait began: a stale
    # selection line from an earlier failed chain must not suppress the manual
    # start forever (exp-016's first chain left one, and the watcher could never
    # relaunch).
    if [ "$waited" -ge 12 ] && [ "$(grep -c "$SELECTION_MARKER" "$RESULTS_DIR/$job/series.log" 2>/dev/null || echo 0)" -le "${seen_selection_lines:-0}" ] \
      && { [ -z "$CHAIN_PATTERN" ] || ! pgrep -f "$CHAIN_PATTERN" > /dev/null; } \
      && [ -n "$CHAIN_LAUNCHER" ]; then
      note "no $job chain after ${waited}min; starting it manually"
      bash "$CHAIN_LAUNCHER" "$job" >> "$RESULTS_DIR/$job/series.log" 2>&1 &
    fi
  done
  # The result artifact arrived: any chain alarm from the wait is moot.
  rm -f "$RESULTS_DIR/$job/CHAIN-ALARM.txt"
}
