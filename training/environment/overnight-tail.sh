#!/usr/bin/env bash
# The tail of the night: exp-016's chain, then exp-017 on Qwen3-1.7B (the shootout
# winner: 357 of 705 in prose against the coder's 30 of 585), then the summary.
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> evaluation/registry/overnight-pipeline.log; }
source "$(dirname "${BASH_SOURCE[0]}")/lib-watch.sh"
prune_arm() {
  local exp="$1"
  local winner="$(python3 -c "import json; print(json.load(open('evaluation/registry/$exp/selection.json'))['winner'])" 2>/dev/null || true)"
  rm -rf "training/checkpoints/$exp/checkpoint-"*
  note "pruned $exp HF checkpoints"
  if [ -n "$winner" ]; then
    for gguf in evaluation/registry/"$exp"/gguf/checkpoint-*.gguf; do
      [ -f "$gguf" ] || continue
      case "$(basename "$gguf")" in
        "$winner.gguf") ;;
        *) rm -f "$gguf"; note "pruned $exp $(basename "$gguf")" ;;
      esac
    done
  fi
}
note "tail armed: exp-016 chain, then exp-017"
wait_chain exp-016-wires
prune_arm exp-016-wires
note "exp-016 done and pruned; launching exp-017-qwen3-17b"
bash training/environment/start-detached.sh train exp-017-qwen3-17b --epochs 2 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 150 --extra-data training/data/preservation-10.jsonl --patience 5 --base-model training/models/qwen3-1.7b --model-manifest training/environment/base-model-qwen3-17b.json >> evaluation/registry/overnight-pipeline.log 2>&1
wait_chain exp-017-qwen3-17b
prune_arm exp-017-qwen3-17b
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
