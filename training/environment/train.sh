#!/usr/bin/env bash
# Runs a trainer command with this machine's environment settings.
#
# Two settings are machine-specific on the DGX Spark (training/PLAN.md,
# troubleshooting notes):
#
# - TRITON_PTXAS_PATH: Triton's bundled ptxas can fail on sm_121a; the system
#   CUDA 13.0 assembler is the correct one.
# - CPATH: Triton compiles a small CUDA helper with the system compiler, which
#   needs the CPython headers. `python3.12-dev`/`libpython3.12-dev` are not
#   installed and the account has no root, so training/environment/setup.sh
#   extracts those headers from the Ubuntu package into the gitignored
#   tools/python-headers/ tree and this wrapper points the compiler at them.
# - PYTORCH_CUDA_ALLOC_CONF: on the GB10 the SDPA path of this torch build falls
#   back to a kernel that fragments the shared pool; expandable segments keeps
#   the reserved blocks reusable (see the memory notes of training/PLAN.md).
#
# Usage:
#   bash training/environment/train.sh python training/python/sft_train.py --experiment exp-001-overfit ...

set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

export TRITON_PTXAS_PATH=/usr/local/cuda/bin/ptxas
export PYTORCH_CUDA_ALLOC_CONF="${PYTORCH_CUDA_ALLOC_CONF:-expandable_segments:True}"

headers="$repository_root/tools/python-headers/usr/include"
if [ -e "$headers/python3.12/Python.h" ]; then
  export CPATH="$headers:$headers/python3.12${CPATH:+:$CPATH}"
fi

# shellcheck disable=SC1091
source "$repository_root/training/.venv/bin/activate"

exec "$@"
