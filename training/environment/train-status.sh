#!/usr/bin/env bash
# One-screen health report of a training run (training/PLAN.md, DS009).
#
# Usage:
#   bash training/environment/train-status.sh                 # three most recent experiments
#   bash training/environment/train-status.sh exp-002-sft-lr2e-5
#
# Reads only files on disk plus /proc/meminfo: it never creates a CUDA context,
# because every context costs a slice of the shared GB10 pool. The device figure
# shown is the one the trainer recorded in its own train log.

set -uo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
checkpoints_root="$repository_root/training/checkpoints"

if [ "$#" -ge 1 ]; then
  experiments=("$1")
else
  mapfile -t experiments < <(find "$checkpoints_root" -maxdepth 2 -name run-manifest.json -printf '%h\n' 2>/dev/null |
    xargs -r ls -dt 2>/dev/null | head -3 | xargs -r -n1 basename)
fi

if [ "${#experiments[@]}" -eq 0 ]; then
  echo "train-status: no run manifests under $checkpoints_root"
  exit 0
fi

avail_kib="$(awk '/MemAvailable:/ {print $2}' /proc/meminfo)"
echo "host: MemAvailable $((avail_kib / 1024 / 1024)) GiB | load $(cut -d' ' -f1-3 /proc/loadavg)"
echo

for experiment in "${experiments[@]}"; do
  directory="$checkpoints_root/$experiment"
  manifest="$directory/run-manifest.json"
  log="$directory/train-log.jsonl"
  state="$directory/overnight-state.jsonl"
  [ -f "$manifest" ] || { echo "== $experiment: no run manifest"; continue; }

  echo "== $experiment"
  python3 - "$manifest" "$log" "$state" "$directory" "$experiment" <<'PY'
import glob, json, os, sys

manifest_path, log_path, state_path, directory, experiment = sys.argv[1:6]
manifest = json.load(open(manifest_path, encoding="utf-8"))


def tail_records(path):
    records = []
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            line = line.strip()
            if line:
                try:
                    records.append(json.loads(line))
                except json.JSONDecodeError:
                    pass
    return records


losses = [record for record in tail_records(log_path) if record.get("loss") is not None]
last = losses[-1] if losses else {}
first_loss = losses[0].get("loss") if losses else None
recent = [record["loss"] for record in losses[-5:]]

print(f"   status           {manifest.get('status')} | steps {manifest.get('steps_completed')} of {manifest.get('planned_steps')}"
      f" | early_stopped {manifest.get('early_stopped')}")
print(f"   recipe           lr {manifest.get('learning_rate')} | effective batch {manifest.get('effective_batch_size')}"
      f" | per-device {manifest.get('per_device_train_batch_size')} x accum {manifest.get('gradient_accumulation_steps')}"
      f" | checkpointing {manifest.get('gradient_checkpointing')}")
if last:
    print(f"   last log         step {last.get('step')} loss {last.get('loss')} lr {last.get('learning_rate'):.2e}"
          f" | device free {last.get('cuda_free_gib')} GiB | peak {last.get('cuda_peak_gib')} GiB"
          f" | reserved {last.get('cuda_reserved_gib')} GiB")
    trend = "falling" if first_loss is not None and last.get("loss", 1) < first_loss else "flat or rising"
    print(f"   loss curve       {first_loss} -> {last.get('loss')} ({trend}; last five {recent})"
          if first_loss is not None else "   loss curve       n/a")
    floor = (manifest.get("memory_budget") or {}).get("floor_gb")
    if floor is not None and last.get("cuda_free_gib") is not None:
        margin = last["cuda_free_gib"] - floor
        print(f"   pool margin      {margin:+.1f} GiB above the {floor:+.1f} GiB floor"
              + (" (tight: expect guard reclaims)" if margin < 6 else ""))
checkpoints = sorted(glob.glob(os.path.join(directory, "checkpoint-*")),
                     key=lambda path: int(path.rsplit("-", 1)[1]))
print(f"   checkpoints      {len(checkpoints)}" + (f", last {os.path.basename(checkpoints[-1])}" if checkpoints else ""))
stops = tail_records(state_path)
if stops:
    print(f"   episodes         {len(stops)}; last exit {stops[-1].get('exit_code')} at step {stops[-1].get('step')} ({stops[-1].get('updated_utc')})")
memory_stops = tail_records(os.path.join(directory, "memory-stops.jsonl"))
if memory_stops:
    print(f"   memory stops     {len(memory_stops)}; last at step {memory_stops[-1].get('step')}: {memory_stops[-1].get('reason')}")
PY
  if pgrep -f "sft_train.py --experiment $experiment" > /dev/null; then
    echo "   process          RUNNING (pid $(pgrep -f "sft_train.py --experiment $experiment" | head -1))"
  else
    echo "   process          not running"
  fi
  echo
done

echo "follow: tail -f training/checkpoints/<experiment>/train-log.jsonl"
echo "resume: read training/STATE.md, then bash training/environment/overnight.sh <trainer args>"
