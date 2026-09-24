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
  while [ ! -f "$RESULTS_DIR/$job/metrics.json" ]; do
    if grep -q "failed" "$RESULTS_DIR/$job/series.log" 2>/dev/null \
      && ! pgrep -f "sft_train.py --experiment $job" > /dev/null \
      && ! pgrep -f "overnight.sh --experiment $job" > /dev/null \
      && ! pgrep -f "start-chain.sh $job" > /dev/null \
      && ! pgrep -f "select-checkpoint.mjs --experiment $job" > /dev/null \
      && ! pgrep -f "run-eval.mjs --experiment $job" > /dev/null; then
      note "CHAIN FAILURE $job: the log reports a failure, the work is over, and no chain is running - a human must look"
      exit 5
    fi
    sleep 180
    waited=$((waited + 3))
    if [ "$waited" -ge 12 ] && ! grep -q "selection" "$RESULTS_DIR/$job/series.log" 2>/dev/null \
      && ! pgrep -f "start-chain.sh $job" > /dev/null; then
      note "no $job chain after ${waited}min; starting it manually"
      bash evaluation/start-chain.sh "$job" >> "$RESULTS_DIR/$job/series.log" 2>&1 &
    fi
  done
}
