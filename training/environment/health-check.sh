# Repo adapter: the portable health check from the night-orchestration skill.
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
export PROJECT_ROOT="${PROJECT_ROOT:-$root}"
export JOBS_DIR="${JOBS_DIR:-$root/training/checkpoints}"
export RESULTS_DIR="${RESULTS_DIR:-$root/evaluation/registry}"
export WORKER_PATTERN="${WORKER_PATTERN:-sft_train.py --experiment}"
export SUPERVISOR_PATTERN="${SUPERVISOR_PATTERN:-overnight.sh --experiment}"
export TEMP_COMMAND="${TEMP_COMMAND:-nvidia-smi --query-gpu=temperature.gpu,utilization.gpu --format=csv,noheader | sed 's/^/GPU: /'}"
exec bash "$root/skills/night-orchestration/scripts/health-check.sh"
