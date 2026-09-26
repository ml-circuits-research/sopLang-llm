# Repo adapter: the portable launch gate from the night-orchestration skill,
# bound to this project's paths and process patterns.
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
export PROJECT_ROOT="${PROJECT_ROOT:-$root}"
export JOBS_DIR="${JOBS_DIR:-$root/training/checkpoints}"
export WORKER_PATTERN="${WORKER_PATTERN:-sft_train.py --experiment}"
export SUPERVISOR_PATTERN="${SUPERVISOR_PATTERN:-overnight.sh --experiment}"
export MIN_FREE_GIB="${MIN_FREE_GIB:-30}"
export CUDA_PYTHON="${CUDA_PYTHON:-$root/training/.venv/bin/python}"
export CUDA_MIN_FREE_GIB="${CUDA_MIN_FREE_GIB:-48}"
exec bash "$root/skills/night-orchestration/scripts/preflight.sh" "$@"
