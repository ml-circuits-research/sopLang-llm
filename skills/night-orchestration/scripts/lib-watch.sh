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
  RESULTS_DIR="${RESULTS_DIR:-$PROJECT_ROOT/.results}"
  FAILURE_MARKER="${FAILURE_MARKER:-failed}"
  SELECTION_MARKER="${SELECTION_MARKER:-selection}"
  CHAIN_LAUNCHER="${CHAIN_LAUNCHER:-}"
  while [ ! -f "$RESULTS_DIR/$job/metrics.json" ]; do
    if grep -q "$FAILURE_MARKER" "$RESULTS_DIR/$job/series.log" 2>/dev/null \
      && { [ -z "$WORKER_PATTERN" ] || ! pgrep -f "$WORKER_PATTERN" > /dev/null; } \
      && { [ -z "$SUPERVISOR_PATTERN" ] || ! pgrep -f "$SUPERVISOR_PATTERN" > /dev/null; } \
      && { [ -z "$CHAIN_PATTERN" ] || ! pgrep -f "$CHAIN_PATTERN" > /dev/null; }; then
      note "CHAIN FAILURE $job: the log reports a failure, the work is over, and no chain is running - a human must look"
      exit 5
    fi
    sleep 180
    waited=$((waited + 3))
    if [ "$waited" -ge 12 ] && ! grep -q "$SELECTION_MARKER" "$RESULTS_DIR/$job/series.log" 2>/dev/null \
      && { [ -z "$CHAIN_PATTERN" ] || ! pgrep -f "$CHAIN_PATTERN" > /dev/null; } \
      && [ -n "$CHAIN_LAUNCHER" ]; then
      note "no $job chain after ${waited}min; starting it manually"
      bash "$CHAIN_LAUNCHER" "$job" >> "$RESULTS_DIR/$job/series.log" 2>&1 &
    fi
  done
}
