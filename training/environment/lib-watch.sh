# Shared chain-waiting logic for the overnight watchers. Sourced, not executed:
# the caller provides a `note` function and then calls `wait_chain <experiment>`.
#
# wait_chain returns only when the experiment's chain delivered metrics.json —
# the one artifact only a chain that reached the holdout writes. A failed chain
# writes "series done" but never metrics.json, so the log line is never trusted.
# When the chain has really failed (a failure line in series.log, training over,
# no chain process running), the watcher exits 5 instead of waiting forever.

wait_chain() {
  local exp="$1"
  local waited=0
  while [ ! -f "evaluation/registry/$exp/metrics.json" ]; do
    if grep -q "failed" "evaluation/registry/$exp/series.log" 2>/dev/null \
      && ! pgrep -f "sft_train.py --experiment $exp" > /dev/null \
      && ! pgrep -f "overnight.sh --experiment $exp" > /dev/null \
      && ! pgrep -f "start-chain.sh $exp" > /dev/null \
      && ! pgrep -f "select-checkpoint.mjs --experiment $exp" > /dev/null \
      && ! pgrep -f "run-eval.mjs --experiment $exp" > /dev/null; then
      note "CHAIN FAILURE $exp: series.log reports a failure, training is over, and no chain is running — a human must look"
      exit 5
    fi
    sleep 180
    waited=$((waited + 3))
    if [ "$waited" -ge 12 ] && ! grep -q "selection" "evaluation/registry/$exp/series.log" 2>/dev/null \
      && ! pgrep -f "start-chain.sh $exp" > /dev/null; then
      note "no $exp chain after ${waited}min; starting it manually"
      bash evaluation/start-chain.sh "$exp" >> "evaluation/registry/$exp/series.log" 2>&1 &
    fi
  done
}
