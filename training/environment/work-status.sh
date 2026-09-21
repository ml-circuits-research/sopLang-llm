#!/usr/bin/env bash
# One screen: what the student pipeline is doing right now.
#
# Answers "is anything running, and how far has it come?" without reading logs by
# hand: the processes that are alive, the progress of every training experiment,
# the state of each evaluation chain, the latest scored runs, and the device
# margin. Safe to run at any time; it writes nothing.
#
# Usage:
#   bash training/environment/work-status.sh

set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

line() { printf '%s\n' "------------------------------------------------------------------------"; }

echo "sopLang-llm work status — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
line

echo "RUNNING PROCESSES"
found=0
while read -r pid etime args; do
  [ -z "${pid:-}" ] && continue
  case "$args" in
    "bash -c "*) continue ;;
  esac
  found=1
  case "$args" in
    *sft_train.py*) kind="training" ;;
    *overnight.sh*) kind="supervisor" ;;
    *run-series.sh*) kind="evaluation chain" ;;
    *select-checkpoint*) kind="checkpoint selection" ;;
    *run-slice.mjs*) kind="slice run" ;;
    *run-adaptation.mjs*) kind="adaptation run" ;;
    *run-probe-suite.mjs*) kind="probe suite" ;;
    *run-deployment.mjs*) kind="deployment" ;;
    *llama-server*) kind="served model" ;;
    *) kind="other" ;;
  esac
  experiment="$(printf '%s' "$args" | grep -oE -e "--experiment [A-Za-z0-9._-]+" | head -1 | cut -d' ' -f2)"
  printf '  %-22s %-9s %s\n' "$kind" "$etime" "${experiment:-}"
done < <(ps -eo pid=,etime=,args= | grep -E -e 'sft_train\.py|overnight\.sh|run-series\.sh|select-checkpoint\.mjs|run-slice\.mjs|run-adaptation\.mjs|run-probe-suite\.mjs|run-deployment\.mjs|llama-server' | grep -v grep | sort -k2)
[ "$found" = 0 ] && echo "  (nothing running)"
line

echo "TRAINING PROGRESS"
for dir in training/checkpoints/exp-*/; do
  [ -d "$dir" ] || continue
  name="$(basename "$dir")"
  log="$dir/train-log.jsonl"
  if [ ! -f "$log" ]; then
    printf '  %-24s %s\n' "$name" "no log yet"
    continue
  fi
  report="$(python3 - "$log" <<'PY'
import json, sys
rows = []
for raw in open(sys.argv[1], encoding="utf-8"):
    raw = raw.strip()
    if raw:
        try:
            rows.append(json.loads(raw))
        except ValueError:
            pass
if not rows:
    print("empty log")
    raise SystemExit
last = rows[-1]
losses = [row for row in rows if row.get("loss") is not None]
step = last.get("step")
clock = last.get("wall_clock_s")
epoch = last.get("epoch")
loss = losses[-1]["loss"] if losses else None
text = f"step {step}"
if epoch is not None:
    text += f" epoch {epoch:.2f}"
if loss is not None:
    text += f" loss {loss:.4f}"
if step and clock:
    text += f" {clock / step:.1f}s/step"
print(text)
PY
)"
  if pgrep -f "sft_train.py --experiment $name" >/dev/null; then
    printf '  %-24s %s %s\n' "$name" "RUNNING " "$report"
  else
    printf '  %-24s %s %s\n' "$name" "finished" "$report"
  fi
done
line

echo "EVALUATION CHAINS"
for log in evaluation/registry/*/series.log; do
  [ -f "$log" ] || continue
  name="$(basename "$(dirname "$log")")"
  printf '  %-24s %s\n' "$name" "$(tail -1 "$log" | cut -c1-96)"
done
line

echo "SCORED RUNS (latest per folder)"
for dir in evaluation/registry/*/; do
  name="$(basename "$dir")"
  summary=""
  case "$name" in
    adapt-*)
      items="$dir/items/holdout.jsonl"
      if [ -f "$items" ]; then
        summary="correct $(grep -c '"class":"answer_match"' "$items") of $(wc -l < "$items" | tr -d ' ')"
      fi ;;
    cmp-*)
      if [ -f "$dir/metrics.json" ]; then
        summary="$(jq -r '"oracle \(.rates.oracle_match * 100 | floor)% of \(.items) items, parse \(.rates.parse_validity * 100 | floor)%"' "$dir/metrics.json" 2>/dev/null)"
      fi ;;
    text-probes-*|probe-*)
      summary="$(grep -m1 -oE '[0-9]+/[0-9]+ passed' "$dir"/*.md 2>/dev/null | head -1)" ;;
  esac
  case "$name" in
    adapt-*|cmp-*|text-probes-*|probe-*) ;;
    *) continue ;;
  esac
  printf '  %-28s %s\n' "$name" "${summary:-see $dir}"
done
line

echo "MEMORY"
awk '/MemTotal|MemAvailable/ {printf "  %s %.1f GiB\n", $1, $2/1048576}' /proc/meminfo
line

echo "WHAT HAPPENS NEXT"
echo "  when a run finishes its chain writes selection.md, report.md and probes.md under"
echo "  evaluation/registry/<experiment>/; follow it live with:"
echo "    tail -f evaluation/registry/<experiment>/series.log"
