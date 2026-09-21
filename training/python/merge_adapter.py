#!/usr/bin/env python
"""Merge a LoRA adapter checkpoint into a full model directory (T7/T8).

`transformers` writes a PEFT checkpoint as adapter files, which llama.cpp's
converter cannot read: selection, holdout, and export need merged weights. This
tool loads the base recorded in the checkpoint's `adapter_config.json`, merges
the adapter with peft, and writes a complete model directory that
`training/llamacpp/convert_hf_to_gguf.py` accepts. The tokenizer comes from the
base model, because LoRA training never changes it.

Usage:
    bash training/environment/train.sh python training/python/merge_adapter.py \
        --checkpoint training/checkpoints/exp-004-lora/checkpoint-90 \
        --out training/checkpoints/exp-004-lora/merged-checkpoint-90
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import torch
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer


def parse_arguments(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Merge a LoRA adapter into its base model")
    parser.add_argument("--checkpoint", required=True, help="checkpoint directory that holds adapter_config.json")
    parser.add_argument("--base", default=None, help="base model directory (default: the adapter's base_model_name_or_path)")
    parser.add_argument("--out", required=True, help="output directory for the merged model")
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_arguments(argv)
    checkpoint = Path(args.checkpoint)
    adapter_config_path = checkpoint / "adapter_config.json"
    if not adapter_config_path.exists():
        raise SystemExit(f"{checkpoint} is not a LoRA checkpoint: adapter_config.json is missing")
    adapter_config = json.loads(adapter_config_path.read_text(encoding="utf-8"))
    base = args.base or adapter_config.get("base_model_name_or_path")
    if not base:
        raise SystemExit(f"{adapter_config_path} records no base_model_name_or_path; pass --base")

    model = AutoModelForCausalLM.from_pretrained(base, torch_dtype=torch.bfloat16, attn_implementation="sdpa")
    model = PeftModel.from_pretrained(model, str(checkpoint))
    merged = model.merge_and_unload()
    output = Path(args.out)
    output.mkdir(parents=True, exist_ok=True)
    merged.save_pretrained(str(output))
    AutoTokenizer.from_pretrained(base).save_pretrained(str(output))
    print(json.dumps({"checkpoint": str(checkpoint), "base": base, "out": str(output), "merged": True}))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
