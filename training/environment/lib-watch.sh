# Repo adapter: the portable chain-waiting logic from the night-orchestration
# skill, bound to this project's paths and process patterns.
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
export PROJECT_ROOT="${PROJECT_ROOT:-$root}"
export RESULTS_DIR="${RESULTS_DIR:-$root/evaluation/registry}"
export WORKER_PATTERN="${WORKER_PATTERN:-sft_train.py --experiment}"
export SUPERVISOR_PATTERN="${SUPERVISOR_PATTERN:-overnight.sh --experiment}"
export CHAIN_PATTERN="${CHAIN_PATTERN:-start-chain.sh|select-checkpoint.mjs --experiment|run-eval.mjs --experiment}"
export CHAIN_LAUNCHER="${CHAIN_LAUNCHER:-$root/evaluation/start-chain.sh}"
export FAILURE_MARKER="${FAILURE_MARKER:-failed}"
export SELECTION_MARKER="${SELECTION_MARKER:-selection}"
source "$root/skills/night-orchestration/scripts/lib-watch.sh"
