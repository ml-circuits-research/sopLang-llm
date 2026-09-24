#!/usr/bin/env bash
# Precondition checks every launch must pass. Refuses loudly instead of corrupting.
# Usage: bash training/environment/preflight.sh <experiment>
set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"
experiment="${1:-}"
if [ -z "$experiment" ]; then echo "preflight: <experiment> is required" >&2; exit 2; fi

fail() { echo "preflight REFUSED: $*" >&2; exit 1; }

# 1. No other trainer anywhere: one trainer at a time is a hard repo rule.
if pgrep -f "sft_train.py --experiment" > /dev/null; then
  other="$(pgrep -af "sft_train.py --experiment" | head -1 | grep -oE 'exp-[A-Za-z0-9._-]+' | head -1)"
  fail "another trainer is already running ($other); one trainer at a time"
fi

# 2. This experiment is not already supervised.
if pgrep -f "overnight.sh --experiment $experiment" > /dev/null; then
  fail "$experiment is already supervised"
fi

# 3. Disk headroom: an arm needs roughly 5 saves x 3.4 GiB plus GGUF conversions;
#    refuse below 30 GiB free and say what to prune.
free_gib="$(df -k "$root" | awk 'NR==2 {print $4}')"
free_gib=$(( free_gib / 1024 / 1024 ))
if [ "$free_gib" -lt 30 ]; then
  fail "only ${free_gib} GiB free; prune closed arms first (see AGENTS.md, Disk discipline)"
fi

# 4. A resume only starts from a valid checkpoint: if the experiment has resume
#    sources but its newest checkpoint directory is incomplete, refuse.
if [ -d "training/checkpoints/$experiment" ] && compgen -G "training/checkpoints/$experiment/checkpoint-*" > /dev/null; then
  newest="$(ls -1d training/checkpoints/$experiment/checkpoint-* | sort -V | tail -1)"
  if [ ! -f "$newest/trainer_state.json" ] && [ ! -f "$newest/model.safetensors" ]; then
    fail "the newest checkpoint $newest is incomplete; remove it and retry"
  fi
fi

echo "preflight OK: no other trainer, disk ${free_gib} GiB free, $experiment free to launch"
