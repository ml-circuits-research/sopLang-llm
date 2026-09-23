#!/usr/bin/env bash
# Download and pin Gemma-3-1B-it as another shootout candidate under the 2B ceiling.
cd "$(dirname "${BASH_SOURCE[0]}")/../.."
training/.venv/bin/python -c "from huggingface_hub import snapshot_download; snapshot_download('google/gemma-3-1b-it', local_dir='training/models/gemma-3-1b-it')" > /tmp/dl-gemma3-1b.log 2>&1
code=$?
echo "download exit $code" >> /tmp/dl-gemma3-1b.log
if [ $code -eq 0 ]; then
  training/.venv/bin/python training/environment/pin_base_model.py \
    --model "$(pwd)/training/models/gemma-3-1b-it" \
    --repo google/gemma-3-1b-it \
    --out training/environment/base-model-gemma3-1b.json >> /tmp/dl-gemma3-1b.log 2>&1
fi
