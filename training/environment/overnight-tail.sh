#!/usr/bin/env bash
# The tail of the night: exp-016's chain, then exp-017 on Qwen3-1.7B (the shootout
# winner: 357 of 705 in prose against the coder's 30 of 585), then the summary.
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
  if [ -f "evaluation/registry/$exp/metrics.json" ]; then note "$exp chain closed with metrics"; else note "$exp chain closed WITHOUT metrics — a human must look"; fi
}
note "tail armed: exp-016 chain, then exp-017"
wait_chain exp-016-wires
note "exp-016 done; launching exp-017-qwen3-17b"
bash training/environment/start-detached.sh train exp-017-qwen3-17b --epochs 2 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 150 --extra-data training/data/preservation-10.jsonl --patience 5 --base-model training/models/qwen3-1.7b --model-manifest training/environment/base-model-qwen3-17b.json >> evaluation/registry/overnight-pipeline.log 2>&1
wait_chain exp-017-qwen3-17b
note "TAIL COMPLETE"
{
  echo "=== exp-016 (1.5B coder, declarative wires) ==="
  grep -E "oracle match|capability probes|parse validity" evaluation/registry/exp-016-wires/series.log | tail -3
  echo "=== exp-017 (Qwen3-1.7B, declarative wires) ==="
  grep -E "oracle match|capability probes|parse validity" evaluation/registry/exp-017-qwen3-17b/series.log | tail -3
  echo "=== classes ==="
  for exp in exp-016-wires exp-017-qwen3-17b; do
    printf "%s: " "$exp"
    python3 -c "import json; m=json.load(open('evaluation/registry/$exp/metrics.json')); print(m['classes'])"
  done
} > evaluation/registry/overnight-tail-final.txt 2>&1
