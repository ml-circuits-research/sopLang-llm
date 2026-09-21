"""Pin the base student model: revision, shape, and artifact hashes.

Task T1 of training/PLAN.md (item 4.3.3): record the exact revision, parameter
count, context window, tokenizer revision, and artifact hashes of the base
model under a recorded path, so every run manifest can name the same artifact.

Usage:
    python training/environment/pin_base_model.py \
        --model training/models/qwen2.5-coder-0.5b-instruct \
        --repo Qwen/Qwen2.5-Coder-0.5B-Instruct \
        --out training/environment/base-model.json
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parents[2]


def sha256_of(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", type=Path, default=REPOSITORY_ROOT / "training/models/qwen2.5-coder-0.5b-instruct")
    parser.add_argument("--repo", default="Qwen/Qwen2.5-Coder-0.5B-Instruct")
    parser.add_argument("--out", type=Path, default=REPOSITORY_ROOT / "training/environment/base-model.json")
    arguments = parser.parse_args()

    from huggingface_hub import model_info

    info = model_info(arguments.repo)
    config = json.loads((arguments.model / "config.json").read_text(encoding="utf-8"))
    weights = sorted(arguments.model.glob("*.safetensors"))
    artifacts = {path.name: {"sha256": sha256_of(path), "bytes": path.stat().st_size} for path in weights}
    for name in ("config.json", "tokenizer_config.json", "vocab.json", "merges.txt", "generation_config.json"):
        path = arguments.model / name
        if path.exists():
            artifacts[name] = {"sha256": sha256_of(path), "bytes": path.stat().st_size}

    document = {
        "repo": arguments.repo,
        "revision": info.sha,
        "localPath": str(arguments.model.relative_to(REPOSITORY_ROOT)),
        "architecture": config.get("architectures"),
        "parameters": info.safetensors.total if info.safetensors is not None else None,
        "contextWindow": config.get("max_position_embeddings"),
        "hiddenSize": config.get("hidden_size"),
        "layers": config.get("num_hidden_layers"),
        "attentionHeads": config.get("num_attention_heads"),
        "torchDtype": config.get("torch_dtype"),
        "tokenizerClass": config.get("tokenizer_class"),
        "artifacts": artifacts,
    }
    arguments.out.parent.mkdir(parents=True, exist_ok=True)
    arguments.out.write_text(json.dumps(document, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({key: document[key] for key in ("repo", "revision", "parameters", "contextWindow")}, indent=2))
    print(f"written: {arguments.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
