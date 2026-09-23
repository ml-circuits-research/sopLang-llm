#!/usr/bin/env bash
# The full unattended pipeline: exp-014 chain -> exp-015 arm -> wire rebuild gate
# -> exp-016-wires arm. Every stage is logged; nothing needs a human. Lives in the
# repository because /tmp dies on a reset.
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> evaluation/registry/overnight-pipeline.log; }

wait_chain() {
  local exp="$1"
  local waited=0
  while ! grep -q "series done" "evaluation/registry/$exp/series.log" 2>/dev/null; do
    sleep 180
    waited=$((waited + 3))
    if [ "$waited" -ge 12 ] && ! grep -q "selection" "evaluation/registry/$exp/series.log" 2>/dev/null \
       && ! pgrep -f "start-chain.sh $exp" > /dev/null; then
      note "no $exp chain after ${waited}min; starting it manually"
      bash evaluation/start-chain.sh "$exp" >> "evaluation/registry/$exp/series.log" 2>&1 &
    fi
  done
}

note "pipeline armed"
wait_chain exp-014-deep-chains
note "exp-014 chain done; launching exp-015-deep-chains-05"
bash training/environment/start-detached.sh train exp-015-deep-chains-05 --epochs 2 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 150 --extra-data training/data/preservation-10.jsonl --patience 5 >> evaluation/registry/overnight-pipeline.log 2>&1
wait_chain exp-015-deep-chains-05
note "exp-015 chain done; waiting for the wire-verification gate"
while [ ! -f training/checkpoints/wire-verified.flag ]; do sleep 120; done
note "gate open; rebuilding the dataset with the declarative wires"
if ! node training/environment/rebuild-all.mjs >> evaluation/registry/overnight-pipeline.log 2>&1; then
  note "REBUILD FAILED; pipeline stops here for a human" >&2; exit 3
fi
if ! node training-data/verify.mjs >> evaluation/registry/overnight-pipeline.log 2>&1; then
  note "VERIFY FAILED; pipeline stops here for a human" >&2; exit 3
fi
if ! node training/export.mjs >> evaluation/registry/overnight-pipeline.log 2>&1; then
  note "EXPORT FAILED; pipeline stops here for a human" >&2; exit 3
fi
if ! npm test > /tmp/overnight-pipeline-tests.out 2>&1; then
  note "TEST SUITE FAILED; pipeline stops here for a human (see /tmp/overnight-pipeline-tests.out)" >&2; exit 3
fi
note "dataset rebuilt and verified; launching exp-016-wires"
bash training/environment/start-detached.sh train exp-016-wires --epochs 2 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 150 --extra-data training/data/preservation-10.jsonl --patience 5 --base-model training/models/qwen2.5-coder-1.5b-instruct --model-manifest training/environment/base-model-1.5b.json >> evaluation/registry/overnight-pipeline.log 2>&1
wait_chain exp-016-wires
note "PIPELINE COMPLETE: exp-014, exp-015, exp-016 all closed"
{
  echo "=== exp-014 (1.5B, jsEval tranche) ==="
  grep -E "oracle match|capability probes" evaluation/registry/exp-014-deep-chains/series.log | tail -2
  echo "=== exp-015 (0.5B, jsEval tranche) ==="
  grep -E "oracle match|capability probes" evaluation/registry/exp-015-deep-chains-05/series.log | tail -2
  echo "=== exp-016 (1.5B, declarative wires) ==="
  grep -E "oracle match|capability probes" evaluation/registry/exp-016-wires/series.log | tail -2
  echo "=== wire arms: classes ==="
  for exp in exp-014-deep-chains exp-016-wires; do
    printf "%s: " "$exp"
    python3 -c "import json; m=json.load(open('evaluation/registry/$exp/metrics.json')); print(m['classes'])"
  done
} > evaluation/registry/overnight-pipeline-final.txt 2>&1
