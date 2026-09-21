#!/usr/bin/env bash
# Trainer environment setup for the DGX Spark (NVIDIA GB10, CUDA 13.0).
#
# Implements task T1 of training/PLAN.md: a local virtual environment with the
# official cu130 aarch64 PyTorch wheels installed first, the minimal SFT stack
# on top, a frozen lock file, and the environment probe that doubles as the
# startup check recorded in dependencies.md.
#
# Usage: bash training/environment/setup.sh

set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repository_root"

venv="$repository_root/training/.venv"

if [ ! -d "$venv" ]; then
  python3 -m venv "$venv"
fi
# shellcheck disable=SC1091
source "$venv/bin/activate"

pip install --upgrade pip

# PyTorch first, from the cu130 index only, so no later resolution can pull a
# cu12 wheel from PyPI (PLAN.md T1, troubleshooting notes).
pip install torch --index-url https://download.pytorch.org/whl/cu130

# The rest of the trainer stack resolves from PyPI (pure Python or
# aarch64-safe wheels) and must not replace the installed torch.
pip install transformers accelerate peft huggingface_hub gguf

pip freeze > "$repository_root/training/python/requirements.lock"

# Triton builds its CUDA helper with the system compiler, which needs the
# CPython headers; on this machine python3.12-dev/libpython3.12-dev are not
# installed and the account has no root. When the system headers are absent,
# they are extracted from the Ubuntu package without root into the gitignored
# tools/ tree; training/environment/train.sh points the compiler at them with
# CPATH. With root available, `apt-get install -y python3.12-dev` is the
# simpler equivalent.
headers="$repository_root/tools/python-headers/usr/include"
if [ ! -e /usr/include/python3.12/Python.h ] && [ ! -e "$headers/python3.12/Python.h" ]; then
  workdir="$(mktemp -d)"
  (cd "$workdir" && apt-get download libpython3.12-dev && dpkg-deb -x libpython3.12-dev_*.deb extract)
  mkdir -p "$(dirname "$headers")"
  mv "$workdir/extract/usr/include" "$(dirname "$headers")/"
  rm -rf "$workdir"
  echo "python headers: extracted into $headers"
fi

# Triton's bundled ptxas can fail on sm_121a; the system CUDA 13.0 one is
# correct (PLAN.md troubleshooting notes).
export TRITON_PTXAS_PATH=/usr/local/cuda/bin/ptxas

python "$repository_root/training/environment/probe.py" \
  --manifest "$repository_root/training/environment/environment-manifest.json"

echo "PROBE OK"
