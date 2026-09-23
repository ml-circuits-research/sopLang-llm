#!/usr/bin/env bash
# Unattended trainer supervisor (training/PLAN.md, "Unified memory" notes).
#
# Runs `training/python/sft_train.py` in episodes. When the memory guard stops a
# run (exit code 3) the supervisor waits for the device pool to recover, resumes
# from the last checkpoint of the output directory, and repeats until the run
# completes or the episode budget is spent. Every episode appends a line to
# `<output-dir>/overnight-state.jsonl`, so a process started with `nohup ... &`,
# a detached omp process, or a terminal that is later closed can be followed
# from the state file and the trainer's own `train-log.jsonl`.
#
# Usage:
#   bash training/environment/overnight.sh --experiment exp-002-sft-lr2e-5 \
#       --epochs 3 --lr 2e-5 --batch-size 4 --grad-accum 8 --gradient-checkpointing
#
# Overnight-only options (everything else is passed to the trainer unchanged):
#   --wait-seconds N   pause between episodes (default 120: the pool recovers)
#   --max-episodes N   give up after N episodes (default 20)
#   --patience N       consumed here, not by the trainer: it is read by
#                      start-detached.sh, which runs early-stop.sh beside the
#                      trainer to stop training after N stale validation saves
#
# Examples:
#   # unattended, survives the terminal that started it
#   nohup bash training/environment/overnight.sh --experiment exp-002-sft-lr2e-5 \
#       --epochs 3 --lr 2e-5 --batch-size 4 --grad-accum 8 --gradient-checkpointing \
#       > training/checkpoints/exp-002-sft-lr2e-5/overnight.log 2>&1 &

set -uo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
wait_seconds=120
max_episodes=20
patience=0
experiment=""
trainer_args=()

while [ $# -gt 0 ]; do
  case "$1" in
    --wait-seconds) wait_seconds="$2"; shift 2 ;;
    --max-episodes) max_episodes="$2"; shift 2 ;;
    --patience) patience="$2"; shift 2 ;;
    --experiment) experiment="$2"; trainer_args+=("$1" "$2"); shift 2 ;;
    *) trainer_args+=("$1"); shift ;;
  esac
done

if [ -z "$experiment" ]; then
  echo "overnight.sh: --experiment is required (it names the output directory)" >&2
  exit 2
fi

output_dir="$repository_root/training/checkpoints/$experiment"
state_path="$output_dir/overnight-state.jsonl"
mkdir -p "$output_dir"

attempt=0
while :; do
  attempt=$((attempt + 1))
  resume_args=()
  if compgen -G "$output_dir/checkpoint-*" > /dev/null; then
    resume_args=(--resume auto)
  fi
  echo "overnight: episode $attempt of $max_episodes (${resume_args[*]:-fresh start})"
  bash "$repository_root/training/environment/train.sh" python "$repository_root/training/python/sft_train.py" \
    "${trainer_args[@]}" "${resume_args[@]}"
  code=$?

  step="$(python3 -c 'import json, sys
print(max((json.loads(line).get("step", 0) for line in open(sys.argv[1], encoding="utf-8") if line.strip()), default=0))' \
    "$output_dir/train-log.jsonl" 2>/dev/null || echo 0)"

  printf '{"episode": %d, "exit_code": %d, "step": %s, "updated_utc": "%s"}\n' \
    "$attempt" "$code" "$step" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$state_path"

  case "$code" in
    0)
      echo "overnight: completed at step $step after $attempt episode(s)"
      exit 0
      ;;
    3)
      echo "overnight: memory guard stopped the run at step $step; resuming after ${wait_seconds}s"
      ;;
    *)
      echo "overnight: trainer failed with exit code $code at step $step; stopping" >&2
      exit "$code"
      ;;
  esac

  if [ "$attempt" -ge "$max_episodes" ]; then
    echo "overnight: episode budget spent; stopping at step $step" >&2
    exit 3
  fi

  sleep "$wait_seconds"
done
