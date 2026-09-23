#!/usr/bin/env bash
# Download and pin Qwen3-1.7B as a candidate base for the reasoning-balance shootout.
cd "$(dirname "${BASH_SOURCE[0]}")/../.."
training/.venv/bin/python -c "from huggingface_hub import snapshot_download; snapshot_download('Qwen/Qwen3-1.7B', local_dir='training/models/qwen3-1.7b')" > /tmp/dl-qwen3-17b.log 2>&1
code=$?
echo "download exit $code" >> /tmp/dl-qwen3-17b.log
if [ $code -eq 0 ]; then
  training/.venv/bin/python training/environment/pin_base_model.py \
    --model "$(pwd)/training/models/qwen3-1.7b" \
    --repo Qwen/Qwen3-1.7B \
    --out training/environment/base-model-qwen3-17b.json >> /tmp/dl-qwen3-17b.log 2>&1
fi
