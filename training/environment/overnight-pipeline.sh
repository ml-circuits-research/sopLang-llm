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
note "exp-016 chain done"

# Stage 4 (night): the base shootout, then the Qwen3-1.7B arm if it earns it.
prune_ggufs() {
  local exp="$1"
  local winner="$(python3 -c "import json; print(json.load(open('evaluation/registry/$exp/selection.json'))['winner'])" 2>/dev/null || true)"
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
for arm in exp-014-deep-chains exp-015-deep-chains-05 exp-016-wires; do
  prune_ggufs "$arm"
done

baseline_of() {
  local name="$1" model_dir="$2" gguf="$3" port="$4"
  if [ ! -f "$gguf" ]; then
    note "converting $name base to f16 gguf"
    bash training/environment/train.sh python tools/llamacpp/convert_hf_to_gguf.py "$model_dir" --outfile "$gguf" --outtype f16 >> evaluation/registry/overnight-pipeline.log 2>&1
  fi
  node evaluation/run-prose-eval.mjs --experiment "cmp-base-holdout-prose-$name" --gguf "$gguf" --port "$port" >> evaluation/registry/overnight-pipeline.log 2>&1
}
note "shootout: prose baselines for the candidate bases"
baseline_of 15g training/models/qwen2.5-1.5b-instruct training/checkpoints/base-1.5b-general-f16.gguf 8135
baseline_of q3 training/models/qwen3-1.7b training/checkpoints/base-qwen3-17b-f16.gguf 8136
baseline_of gemma training/models/gemma-3-1b-it training/checkpoints/base-gemma3-1b-f16.gguf 8137
note "shootout done"
grep -hE "printed answer matched" evaluation/registry/cmp-base-holdout-prose-15g/report.md evaluation/registry/cmp-base-holdout-prose-q3/report.md evaluation/registry/cmp-base-holdout-prose-gemma/report.md >> evaluation/registry/overnight-pipeline.log

# The owner's rule: train the next arm on the best base found, and a candidate
# must clear the coder incumbent's 30 of 585 in prose to earn a training run.
score_of() { grep -oE '[0-9]+ \| 585' "$1" 2>/dev/null | head -1 | cut -d' ' -f1; }
best=""
best_score=30
for cand in "q3:training/models/qwen3-1.7b:training/environment/base-model-qwen3-17b.json" \
           "gemma:training/models/gemma-3-1b-it:training/environment/base-model-gemma3-1b.json" \
           "15g:training/models/qwen2.5-1.5b-instruct:training/environment/base-model-1.5b-general.json"; do
  IFS=':' read -r slug dir manifest_name <<< "$cand"
  score="$(score_of "evaluation/registry/cmp-base-holdout-prose-$slug/report.md")"
  score="${score:-0}"
  if [ "$score" -gt "$best_score" ]; then
    best_score="$score"
    best="$slug:$dir:$manifest_name"
  fi
done
if [ -z "$best" ]; then
  note "no candidate base cleared the coder's 30 of 585 in prose; NOT training — a human decides" >&2
  exit 4
fi
IFS=':' read -r best_slug best_dir best_manifest <<< "$best"
note "the best base is $best_slug with a prose baseline of $best_score of 585; launching exp-017-$best_slug"
bash training/environment/start-detached.sh train "exp-017-$best_slug" --epochs 2 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 150 --extra-data training/data/preservation-10.jsonl --patience 5 --base-model "$best_dir" --model-manifest "$best_manifest" >> evaluation/registry/overnight-pipeline.log 2>&1
wait_chain "exp-017-$best_slug"
prune_ggufs "exp-017-$best_slug"
ARM_017="exp-017-$best_slug"
note "PIPELINE COMPLETE: exp-014, exp-015, exp-016, exp-017 all closed"
{
  echo "=== exp-014 (1.5B, jsEval tranche) ==="
  grep -E "oracle match|capability probes" evaluation/registry/exp-014-deep-chains/series.log | tail -2
  echo "=== exp-015 (0.5B, jsEval tranche) ==="
  grep -E "oracle match|capability probes" evaluation/registry/exp-015-deep-chains-05/series.log | tail -2
  echo "=== exp-016 (1.5B, declarative wires) ==="
  grep -E "oracle match|capability probes" evaluation/registry/exp-016-wires/series.log | tail -2
  echo "=== exp-017 (best shootout base, declarative wires) ==="
  grep -E "oracle match|capability probes" "evaluation/registry/$ARM_017/series.log" 2>/dev/null | tail -2
  echo "=== prose baselines ==="
  grep -hE "printed answer matched" evaluation/registry/cmp-base-holdout-prose-15g/report.md evaluation/registry/cmp-base-holdout-prose-q3/report.md evaluation/registry/cmp-base-holdout-prose-gemma/report.md
  echo "=== wire arms: classes ==="
  for exp in exp-014-deep-chains exp-016-wires "$ARM_017"; do
    printf "%s: " "$exp"
    python3 -c "import json; m=json.load(open('evaluation/registry/$exp/metrics.json')); print(m['classes'])"
  done
} > evaluation/registry/overnight-pipeline-final.txt 2>&1
