#!/usr/bin/env bash
# In-loop validation with early stopping (DS009 "Checkpoint selection", owner-approved
# patience 5-10). Runs beside the trainer: every settled save is converted, served,
# and scored on the fixed validation slice by select-checkpoint.mjs --only, which
# appends one line to <checkpoints>/validation-scores.jsonl. When `patience`
# consecutive saves fail to beat the best oracle match, the trainer is stopped and
# the regular chain (start-chain.sh) runs against the whole checkpoint set.
#
# Usage: bash training/environment/early-stop.sh <experiment> <patience>
set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
experiment="${1:-}"
patience="${2:-5}"
if [ -z "$experiment" ]; then
  echo "early-stop.sh: <experiment> is required" >&2
  exit 2
fi

checkpoints="$root/training/checkpoints/$experiment"
scores="$checkpoints/validation-scores.jsonl"
port=8175
settle_seconds=90

supervisor_alive() {
  pgrep -f "overnight.sh --experiment $experiment" > /dev/null || pgrep -f "sft_train.py --experiment $experiment" > /dev/null
}

staleness() {
  python3 - "$scores" <<'PY'
import json, sys
path = sys.argv[1]
rows = []
try:
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            row = json.loads(line)
            if row.get("oracle") is not None:
                rows.append(row["oracle"])
except FileNotFoundError:
    pass
best = -1.0
stale = 0
for value in rows:
    if value > best:
        best = value
        stale = 0
    else:
        stale += 1
print(stale)
PY
}

echo "early-stop: watching $checkpoints, patience $patience, port $port"
while :; do
  if ! supervisor_alive; then
    echo "early-stop: the trainer and its supervisor are gone; exiting"
    exit 0
  fi
  for dir in "$checkpoints"/checkpoint-*; do
    [ -d "$dir" ] || continue
    name="$(basename "$dir")"
    if grep -q "\"checkpoint\":\"$name\"" "$scores" 2>/dev/null; then
      continue
    fi
    newest="$(find "$dir" -type f -mmin -1.5 -print -quit 2>/dev/null || true)"
    if [ -n "$newest" ]; then
      continue
    fi
    echo "early-stop: scoring $name ($(date -u +%H:%M:%SZ))"
    if node "$root/evaluation/select-checkpoint.mjs" --experiment "$experiment" --only "$name" --port "$port" --concurrency 4; then
      verdict="$(tail -1 "$scores" | python3 -c 'import json,sys; r=json.loads(sys.stdin.read()); print(f"oracle {r[\"oracle\"]*100:.1f}% parse {r[\"parse\"]*100:.1f}% of {r[\"items\"]}")')"
      echo "early-stop: $name scored: $verdict"
    else
      # A broken save must not be retried forever: record the failure and move on.
      echo "early-stop: scoring $name failed; recording the failure and continuing"
      printf '{"checkpoint":"%s","oracle":null,"scoredUtc":"%s","error":"scoring failed"}\n' \
        "$name" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$scores"
    fi
    stale="$(staleness)"
    echo "early-stop: $stale save(s) without a new best (patience $patience)"
    if [ "$stale" -ge "$patience" ]; then
      echo "early-stop: patience reached after $stale stale saves; stopping the trainer"
      pkill -TERM -f "sft_train.py --experiment $experiment" || true
      echo "early-stop: trainer stopped; the chain will run against the whole checkpoint set"
      exit 0
    fi
  done
  sleep 45
done
