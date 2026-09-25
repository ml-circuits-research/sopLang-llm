#!/usr/bin/env bash
# Start long work so it survives the terminal, the SSH session, and any agent session.
#
# Owner directive (2026-09-21): everything long-running is started detached, so the
# desktop can be closed and the machine left working overnight. This script is the
# way to do that without depending on the agent harness: `setsid` gives the work
# its own session, `nohup` ignores the hangup, and the log lands next to the
# experiment so `work-status.sh` can report it.
#
# Usage:
#   bash training/environment/start-detached.sh train exp-008-sft-shapes \
#       --epochs 3 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 90
#   bash training/environment/start-detached.sh cmd "node evaluation/run-slice.mjs --experiment my-run --best --slice holdout"
#
# `train` records the recipe in the experiment directory (so `resume-series.sh`
# needs no flags), then runs the supervisor and, after it, the evaluation chain.
# `cmd` runs one shell command with its output under evaluation/registry/<name>.log.

set -uo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

mode="${1:-}"
case "$mode" in
  train)
    experiment="${2:-}"
    [ -z "$experiment" ] && { echo "usage: start-detached.sh train <experiment> [trainer flags...]" >&2; exit 2; }
    shift 2
    # Every launch passes the preflight gate first: a second trainer, a full disk,
    # or a corrupt resume checkpoint is a refused launch, not a corrupted night.
    bash "$root/training/environment/preflight.sh" "$experiment" || exit 1
    checkpoints="$root/training/checkpoints/$experiment"
    mkdir -p "$checkpoints"
    recipe="$checkpoints/resume-recipe.sh"
    printf '#!/usr/bin/env bash\n# recorded by start-detached.sh on %s\nexec bash "$(dirname "${BASH_SOURCE[0]}")/../../environment/overnight.sh" --experiment %s %s\n' \
      "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$experiment" "$*" > "$recipe"
    chmod +x "$recipe"
    patience="$(printf '%s\n' "$*" | sed -n 's/.*--patience \([0-9][0-9]*\).*/\1/p')"
    if [ -n "$patience" ]; then
      # In-loop validation with early stopping: the watcher scores every settled
      # save beside the trainer and stops it after N stale ones; the chain then
      # runs against the whole checkpoint set, exactly as it would have.
      # After the trainer stops, the early-stop watcher runs one final pass to
      # score the last saves; the wrapper waits up to 30 minutes for it, then
      # kills it and starts the chain (which re-scores whatever is left).
      setsid nohup bash -c "bash '$recipe' >> '$checkpoints/overnight.log' 2>&1 & TP=\$!; bash '$root/training/environment/early-stop.sh' '$experiment' '$patience' >> '$checkpoints/early-stop.log' 2>&1 & WP=\$!; wait \$TP; for tick in \$(seq 1 90); do kill -0 \$WP 2>/dev/null || break; sleep 20; done; kill \$WP 2>/dev/null; bash '$root/evaluation/start-chain.sh' '$experiment' >> '$root/evaluation/registry/$experiment/series.log' 2>&1" \
        > /dev/null 2>&1 < /dev/null &
    else
      setsid nohup bash -c "bash '$recipe' >> '$checkpoints/overnight.log' 2>&1; bash '$root/evaluation/start-chain.sh' '$experiment' >> '$root/evaluation/registry/$experiment/series.log' 2>&1" \
        > /dev/null 2>&1 < /dev/null &
    fi
    ;;
  cmd)
    name="${2:-}"
    command="${3:-}"
    [ -z "$name" ] || [ -z "$command" ] && { echo "usage: start-detached.sh cmd <name> \"<shell command>\"" >&2; exit 2; }
    mkdir -p "$root/evaluation/registry"
    setsid nohup bash -c "$command" >> "$root/evaluation/registry/$name.log" 2>&1 < /dev/null &
    ;;
  *)
    echo "usage: start-detached.sh train <experiment> [flags] | cmd <name> \"<command>\"" >&2
    exit 2 ;;
esac

sleep 3
pid="$(pgrep -f "overnight.sh --experiment ${experiment:-$name}" | head -1 || true)"
echo "start-detached: $mode '${experiment:-$name}' is running detached (session leader $(ps -o sid= -p "${pid:-$$}" 2>/dev/null | tr -d ' '))"
echo "start-detached: follow it with bash training/environment/work-status.sh"
