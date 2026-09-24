#!/usr/bin/env bash
# The dv4 stage: after exp-017's chain closes, rebuild with the scheduling
# tranche, then train the next arm on the best base measured so far.
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> evaluation/registry/overnight-pipeline.log; }
source "$(dirname "${BASH_SOURCE[0]}")/lib-watch.sh"

prune_arm() {
  local exp="$1"
  local winner="$(python3 -c "import json; print(json.load(open('evaluation/registry/$exp/selection.json'))['winner'])" 2>/dev/null || true)"
  rm -rf "training/checkpoints/$exp/checkpoint-"*
  if [ -n "$winner" ]; then
    for gguf in evaluation/registry/"$exp"/gguf/checkpoint-*.gguf; do
      [ -f "$gguf" ] || continue
      case "$(basename "$gguf")" in "$winner.gguf") ;; *) rm -f "$gguf";; esac
    done
  fi
}

note "dv4 stage armed: exp-017 chain, then the dv4 rebuild and the next arm"
wait_chain exp-017-qwen3-17b
prune_arm exp-017-qwen3-17b
note "exp-017 closed; rebuilding with the dv4 scheduling tranche"
printf '4\n' > training-data/VERSION
printf 'scheduling tranche: critical path, deadline feasibility, prerequisite count, route bottleneck (2026-09-24)\n' > training-data/VERSION.label
printf '4: scheduling tranche (dv4) - critical path, deadline, prerequisite count, route bottleneck (2026-09-24)\n' >> training-data/VERSION.history
if ! node training/environment/rebuild-all.mjs >> evaluation/registry/overnight-pipeline.log 2>&1; then
  note "REBUILD FAILED; stopping for a human" >&2; exit 3
fi
if ! node training-data/verify.mjs >> evaluation/registry/overnight-pipeline.log 2>&1; then
  note "VERIFY FAILED; stopping for a human" >&2; exit 3
fi
if ! node training/export.mjs >> evaluation/registry/overnight-pipeline.log 2>&1; then
  note "EXPORT FAILED; stopping for a human" >&2; exit 3
fi
if ! npm test > /tmp/dv4-tests.out 2>&1; then
  note "TEST SUITE FAILED after the dv4 rebuild; stopping for a human (see /tmp/dv4-tests.out)" >&2; exit 3
fi
note "dv4 rebuilt and verified; choosing the base for the next arm"
# The owner's rule: train on the best base measured. Qwen3-1.7B earns the dv4 arm
# when its dv3 holdout matches or beats the coder's wire holdout (440 of 705).
q3="$(python3 -c "import json; m=json.load(open('evaluation/registry/exp-017-qwen3-17b/metrics.json')); print(m['classes'].get('answer_match', 0))" 2>/dev/null || echo 0)"
if [ "${q3:-0}" -ge 440 ]; then
  note "Qwen3-1.7B holdout $q3 matches the coder's 440; exp-018 trains on it"
  bash training/environment/start-detached.sh train exp-018-1.7b-qwen3-dv4 --epochs 2 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 150 --extra-data training/data/preservation-10.jsonl --patience 5 --base-model training/models/qwen3-1.7b --model-manifest training/environment/base-model-qwen3-17b.json >> evaluation/registry/overnight-pipeline.log 2>&1
  wait_chain exp-018-1.7b-qwen3-dv4
  prune_arm exp-018-1.7b-qwen3-dv4
  ARM_018=exp-018-1.7b-qwen3-dv4
else
  note "Qwen3-1.7B holdout $q3 is below the coder's 440; exp-018 trains on the 1.5B coder"
  bash training/environment/start-detached.sh train exp-018-1.5b-coder-dv4 --epochs 2 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 150 --extra-data training/data/preservation-10.jsonl --patience 5 --base-model training/models/qwen2.5-coder-1.5b-instruct --model-manifest training/environment/base-model-1.5b.json >> evaluation/registry/overnight-pipeline.log 2>&1
  wait_chain exp-018-1.5b-coder-dv4
  prune_arm exp-018-1.5b-coder-dv4
  ARM_018=exp-018-1.5b-coder-dv4
fi
note "DV4 STAGE COMPLETE: $ARM_018 closed"
{
  echo "=== exp-017 (Qwen3-1.7B, dv3) ==="
  grep -E "oracle match|capability probes" evaluation/registry/exp-017-qwen3-17b/series.log | tail -2
  echo "=== exp-018 (dv4) ==="
  grep -E "oracle match|capability probes" "evaluation/registry/$ARM_018/series.log" | tail -2
  echo "=== books ==="
  for exp in exp-017-qwen3-17b "$ARM_018"; do
    printf "%s: " "$exp"
    python3 -c "import json; m=json.load(open('evaluation/registry/$exp/metrics.json')); books=sum(v['classes'].get('answer_match',0) for k,v in m['byBook'].items() if k!='procedural-arithmetic'); print(f'books {books}/225')"
  done
} > evaluation/registry/dv4-final.txt 2>&1
