#!/usr/bin/env bash
# Watchdog for unattended work: restart what stopped, warn about a stalled log.
#
# The machine can be left alone overnight. This loop runs every five minutes and,
# for every experiment that has a recorded recipe, checks the trainer against its
# run manifest:
#
#   - manifest status `completed` (or `stopped` by the memory guard with a
#     finished run)  -> nothing to do;
#   - trainer not running and the manifest is not completed  -> the run died or
#     was killed: call `resume-series.sh`, which continues from the last
#     checkpoint and chains the evaluation afterwards;
#   - trainer running but the step log has not advanced for 30 minutes -> write a
#     warning; the supervisor's own memory guard normally handles this case, so a
#     stale log means something outside the recipe.
#
# Everything it does is appended to `training/checkpoints/watchdog.log` with a
# timestamp, so the morning question "did the night go well?" has an answer that
# does not depend on any agent session.
#
# Usage:
#   bash training/environment/start-detached.sh cmd watchdog "bash training/environment/watchdog.sh"
#   bash training/environment/watchdog.sh --once      # one pass, for a check

set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

LOG="$root/training/checkpoints/watchdog.log"
INTERVAL="${WATCHDOG_INTERVAL_SECONDS:-300}"
STALE_SECONDS="${WATCHDOG_STALE_SECONDS:-1800}"
ONCE="${1:-}"

note() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> "$LOG"; }

pass() {
  for dir in "$root"/training/checkpoints/exp-*/; do
    [ -d "$dir" ] || continue
    name="$(basename "$dir")"
    [ -f "$dir/resume-recipe.sh" ] || continue

    running=no
    pgrep -f "sft_train.py --experiment $name" >/dev/null && running=yes

    status="none"
    if [ -f "$dir/run-manifest.json" ]; then
      status="$(jq -r '.status // "unknown"' "$dir/run-manifest.json" 2>/dev/null || echo unknown)"
    fi

    if [ "$running" = yes ]; then
      log="$dir/train-log.jsonl"
      if [ -f "$log" ]; then
        last_epoch="$(stat -c %Y "$log" 2>/dev/null || echo 0)"
        idle=$(( $(date +%s) - last_epoch ))
        if [ "$idle" -gt "$STALE_SECONDS" ]; then
          note "WARN $name is running but its step log has not changed for $((idle / 60)) minutes"
        fi
      fi
      continue
    fi

    case "$status" in
      completed|stopped)
        # Training is done: make sure its evaluation chain left the holdout report.
        # The chain normally runs inside the detached wrapper; if that wrapper died,
        # the registry has no report and nothing is running, so restart the chain.
        if [ ! -f "$root/evaluation/registry/$name/report.md" ] && ! pgrep -f "[r]un-series.sh $name" >/dev/null; then
          note "CHAIN $name has no holdout report and no chain running — starting the evaluation chain"
          ( cd "$root" && bash evaluation/run-series.sh "$name" >> "$root/evaluation/registry/$name/series.log" 2>&1 & )
        fi
        continue ;;
    esac

    note "RESTART $name is not running (manifest status: $status) — resuming from the last checkpoint"
    bash "$root/training/environment/resume-series.sh" "$name" >> "$LOG" 2>&1
  done
  note "pass complete (interval ${INTERVAL}s)"
}

note "watchdog started (interval ${INTERVAL}s, stale threshold ${STALE_SECONDS}s)"
if [ "$ONCE" = "--once" ]; then
  pass
  exit 0
fi
while :; do
  pass
  sleep "$INTERVAL"
done
