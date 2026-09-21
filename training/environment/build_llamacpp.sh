#!/usr/bin/env bash
# Build llama.cpp with CUDA for the GB10 (sm_121). See training/PLAN.md D4, T1.
#
# Usage: bash training/environment/build_llamacpp.sh

set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repository_root"

if [ ! -d tools/llamacpp ]; then
  mkdir -p tools
  git clone --depth 1 https://github.com/ggml-org/llama.cpp tools/llamacpp
fi

cmake -S tools/llamacpp -B tools/llamacpp/build \
  -DGGML_CUDA=ON \
  -DCMAKE_CUDA_ARCHITECTURES=121 \
  -DCMAKE_BUILD_TYPE=Release

cmake --build tools/llamacpp/build --config Release -j"$(nproc)"

tools/llamacpp/build/bin/llama-server --version
echo "LLAMACPP OK"
