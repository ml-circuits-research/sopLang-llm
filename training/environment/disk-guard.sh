# Repo adapter: the portable disk guard from the night-orchestration skill,
# bound to this project's paths and process patterns.
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
export PROJECT_ROOT="${PROJECT_ROOT:-$root}"
export DISK_GUARD_LOG="${DISK_GUARD_LOG:-$root/evaluation/registry/disk-guard.log}"
export WARN_FREE_GIB="${WARN_FREE_GIB:-40}"
export STOP_FREE_GIB="${STOP_FREE_GIB:-16}"
export WORKER_PATTERN="${WORKER_PATTERN:-sft_train.py --experiment}"
export DOWNLOAD_PATTERN="${DOWNLOAD_PATTERN:-snapshot_download}"
exec bash "$root/skills/night-orchestration/scripts/disk-guard.sh"
