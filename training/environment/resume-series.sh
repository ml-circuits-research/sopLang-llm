#!/usr/bin/env bash
# Resume one experiment's training and its evaluation chain with one command.
#
# A training run survives an interrupted terminal only if its supervisor can pick
# the run up again: `overnight.sh` writes a checkpoint every `--save-steps` steps
# and resumes from the last one, so restarting it costs at most that interval of
# compute. This script does exactly that, then runs the evaluation chain
# (checkpoint selection, holdout, capability probes) for the same experiment.
#
# Usage:
#   bash training/environment/resume-series.sh exp-007-sft-wires
#   bash training/environment/resume-series.sh exp-007-sft-wires --name my-restart
#
# Everything the run needs is read from the experiment's recorded recipe: the
# command line that produced it is in `training/checkpoints/<experiment>/overnight.log`
# and the run manifest in the same directory. When those are missing, pass the
# recipe flags yourself (`--epochs`, `--lr`, `--batch-size`, `--grad-accum`,
# `--method`), because a resume with the wrong recipe would continue into a
# different experiment.

set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

experiment="${1:-}"
if [ -z "$experiment" ]; then
  echo "usage: resume-series.sh <experiment-id> [trainer flags...]" >&2
  exit 2
fi
shift

checkpoints="$root/training/checkpoints/$experiment"
if [ ! -d "$checkpoints" ]; then
  echo "resume-series: $checkpoints does not exist; nothing to resume" >&2
  exit 2
fi

if pgrep -f "sft_train.py --experiment $experiment" >/dev/null; then
  echo "resume-series: $experiment is already training (pid $(pgrep -f "sft_train.py --experiment $experiment" | head -1)); nothing to do"
  exit 0
fi

recipe="$checkpoints/resume-recipe.sh"
if [ "$#" -gt 0 ]; then
  printf '#!/usr/bin/env bash\n# recorded by resume-series.sh on %s\nexec bash "$(dirname "${BASH_SOURCE[0]}")/../../environment/overnight.sh" --experiment %s %s\n' \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$experiment" "$*" > "$recipe"
  chmod +x "$recipe"
elif [ ! -f "$recipe" ]; then
  echo "resume-series: no recorded recipe at $recipe and no trainer flags given." >&2
  echo "  Pass the experiment's flags, for example:" >&2
  echo "    bash training/environment/resume-series.sh $experiment --epochs 3 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 90" >&2
  exit 2
fi

echo "resume-series: resuming $experiment from $(ls -d "$checkpoints"/checkpoint-* 2>/dev/null | tail -1 || echo 'no checkpoint yet, starting fresh')"
echo "resume-series: log $checkpoints/overnight.log"
nohup bash "$recipe" >> "$checkpoints/overnight.log" 2>&1 &
sleep 5
echo "resume-series: supervisor pid $!"

echo "resume-series: evaluation chain after the trainer stops"
nohup bash "$root/evaluation/start-chain.sh" "$experiment" >> "$root/evaluation/registry/$experiment/series.log" 2>&1 &
sleep 2
echo "resume-series: chain pid $!"
echo "resume-series: watch with bash training/environment/work-status.sh"
