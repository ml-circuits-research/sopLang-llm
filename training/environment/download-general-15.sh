#!/usr/bin/env bash
# Download and pin the general (non-coder) 1.5B base for the reasoning-balance
# experiment. Lives in the repository because /tmp dies on a reset.
cd "$(dirname "${BASH_SOURCE[0]}")/../.."
huggingface-cli download Qwen/Qwen2.5-1.5B-Instruct --local-dir training/models/qwen2.5-1.5b-instruct --local-dir-use-symlinks False > /tmp/dl-general-15.log 2>&1
code=$?
echo "download exit $code" >> /tmp/dl-general-15.log
if [ $code -eq 0 ]; then
  python training/environment/pin_base_model.py \
    --model training/models/qwen2.5-1.5b-instruct \
    --repo Qwen/Qwen2.5-1.5B-Instruct \
    --out training/environment/base-model-1.5b-general.json >> /tmp/dl-general-15.log 2>&1
fi
