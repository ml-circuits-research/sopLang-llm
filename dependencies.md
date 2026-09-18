# Dependencies

## Runtime prerequisite

| Item | Detail |
| --- | --- |
| Required runtime | Node.js with stable ECMAScript module support and the `node --test` runner, executing code in `.mjs` files. |
| Purpose | Runs the SOP Lang parser, dependency analyzer, scheduler, transaction layer, context adapter, and data pipeline. |
| Startup check | The library and its scripts import only `node:` built-ins. A missing or older Node.js version fails at module load with a module-resolution or syntax error before any circuit work starts. |

## Third-party dependencies

The project has no third-party runtime dependencies. The library, its tests, and its scripts use Node.js built-ins only, including `node:test` and `node:assert/strict` for test organization. No npm package, Python interpreter, transpiler, bundler, or external test framework is required.

The `vision/` seed books are research material rather than executable dependencies. Their rights status is recorded per source in dataset manifests according to `docs/specs/DS008-training-data.md`.

The HTML documentation loads the Mermaid ES module from the jsDelivr CDN for diagram rendering in the browser:

| Item | Detail |
| --- | --- |
| Dependency | `mermaid@11` ESM build, loaded from `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs`. |
| Scope | Documentation pages only. It is not part of the library. |
| Status | Required for diagram rendering in a browser; documentation text remains readable without it. |
| Alternatives considered | Static SVG files under `docs/assets/` were considered. Mermaid was selected because diagram definitions stay maintainable alongside the documentation pages and follow the documentation diagram rules. |
| License | MIT, as published by the Mermaid project. |
| Removal opportunity | Diagrams can be converted to static SVG assets and the CDN script removed from the HTML pages. |

## Trainer and inference dependencies

The Python trainer stack and the local llama.cpp build are the sanctioned non-Node surface of the fine-tuning laboratory, recorded as one entry each below. Both stay outside every path the library and its test suite load: `npm test` still runs with zero npm dependencies, and the Node-side tools (the exporter, the serving client, the evaluation loop) remain Node built-ins only.

| Item | Detail |
| --- | --- |
| Dependency | PyTorch `cu130` aarch64 wheels (`torch 2.14.0+cu130`), then `transformers`, `accelerate`, `peft`, `huggingface_hub`, `gguf`, `sentencepiece`. |
| Scope | Supervised fine-tuning, tokenizer statistics, and GGUF conversion under `training/python/`; nothing under `runtime/`, `wires/`, `context/`, `teacher/`, `training-data/`, or `evaluation/` imports them. |
| Justification | The laboratory needs an autograd trainer and a tokenizer for the pinned Qwen2.5-Coder base; PyTorch is the only stack with a working CUDA 13.0 aarch64 wheel set for the GB10, and `transformers` Trainer plus `accelerate` provide the training loop, chat template, and checkpointing the plan's decision D3 names. |
| Alternatives considered | TRL and Unsloth (extra version churn and aarch64 packaging risk for behavior a custom collator provides in about a hundred lines); flash-attn (no `sm_121` kernels, `libcudart.so.12` ABI errors; PyTorch SDPA is the attention implementation); bitsandbytes/QLoRA (the 0.5B full fine-tune fits in the 119 GiB unified memory); vLLM (no stable cu130 aarch64 wheels). |
| Authorization | Owner directive recorded in `training/PLAN.md`, decisions D3 and D13, 2026-09-18. |
| License | PyTorch BSD-3-Clause; transformers, accelerate, peft, huggingface_hub, and sentencepiece Apache-2.0; gguf MIT. |
| Source and update URLs | `https://download.pytorch.org/whl/cu130`, `https://pypi.org/project/transformers/`, `https://pypi.org/project/accelerate/`, `https://pypi.org/project/peft/`, `https://pypi.org/project/huggingface-hub/`, `https://pypi.org/project/gguf/`, `https://pypi.org/project/sentencepiece/`. |
| Startup check | `bash training/environment/setup.sh` provisions the environment and freezes `training/python/requirements.lock`; `python training/environment/probe.py` asserts that `torch.version.cuda` starts with `13`, prints the device name, and completes a forward and backward step on the accelerator. The resolved versions are recorded in `training/environment/environment-manifest.json`, whose hash every run manifest references. |
| Removal opportunity | The whole trainer tree is self-contained under `training/` (`python/`, `environment/`, `models/`, `checkpoints/`) and can be deleted or replaced by a container image without touching the library, its tests, or any Node-side tool. |

| Item | Detail |
| --- | --- |
| Dependency | llama.cpp built from source with CUDA (`-DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES=121`), cloned at commit `911f6cdc8ab8a530b2bee09ee61471a6f3178eeb`. |
| Scope | GGUF conversion for checkpoint selection and deployment measurement, and `llama-server` as the HTTP inference endpoint of the evaluation loop. Built under the gitignored `tools/llamacpp/`. |
| Justification | It is the stack with confirmed GB10 support and the CPU/GGUF deployment target `DS007-model-strategy.md` names, so accuracy and speed are measured on the exported artifact itself; the evaluation loop needs no Python service alive during scoring. |
| Alternatives considered | Serving the HF checkpoint through `transformers` (measures a different artifact from the deployed one); vLLM (no stable cu130 aarch64 wheels); Ollama (opaque quantization and versioning). |
| Authorization | Owner directive recorded in `training/PLAN.md`, decisions D4 and D13, 2026-09-18. |
| License | MIT. |
| Source and update URLs | `https://github.com/ggml-org/llama.cpp`; the checkout commit is recorded in `training/environment/environment-manifest.json` and the build script is `training/environment/build_llamacpp.sh`. |
| Startup check | `tools/llamacpp/build/bin/llama-server --version` runs; the serving smoke test (`node evaluation/smoke.mjs`) converts the pinned base model to F16 GGUF, serves it, and completes one generation with the recorded decoding configuration. |
| Removal opportunity | `tools/` is gitignored and holds only build outputs; deleting it removes the dependency completely, and a future run can rebuild from the recorded commit or switch to a packaged deployment runtime. |

