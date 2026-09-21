# sopLang-llm training infrastructure plan (Phase 4)

This document is the master implementation plan for Phase 4 of `todo.md`: fine-tuning a student model that compiles problems into SOP Lang circuits, on the local NVIDIA DGX Spark, together with the evaluation loop that scores the result. Every architectural decision is already taken and recorded in the decision log below; an implementing agent executes the tasks in order without reopening the decisions unless a gate fails, in which case the failure is recorded and the decision is revised here first.

Read before starting: `AGENTS.md` (repository rules), `README.md` (project purpose), `docs/specs/DS007-model-strategy.md` (student tiers, deployment targets), `docs/specs/DS008-training-data.md` (dataset contract), `docs/specs/DS009-fine-tuning-and-evaluation.md` (laboratory contract this plan implements). Everything written to disk stays in English. The library, its tests, and every Node-side tool keep Node built-ins only; the Python trainer side is the one recorded exception.

## Verified starting state (2026-09-18)

- `npm test` passes 233/233 on Node.js v22.23.2.
- `node training-data/verify.mjs` reports `verify: OK`: all seven seed books, 7000 circuits executed, every shipped answer reproduced, 6933 of 7000 answers proven reactive to their inputs, 107 reported as unprovable either way (see task T0d).
- `training-data/` holds 7000 accepted examples (6775 training rows after the 225-example holdout), every circuit of the same compiled-plan shape: `@slots literal`, optional `@facts literal`, `@answer jsEval` with the probe harness.
- The working tree carries the multi-book restructure uncommitted (~1100 modified, 78 deleted, 34 untracked files) — task T0a commits it before anything else lands.
- The workstation is a DGX Spark: NVIDIA GB10 (Blackwell, compute capability `sm_121`), 20 ARM cores, 119 GiB unified memory, Ubuntu 24.04.4 LTS, NVIDIA driver with CUDA 13.0 runtime, CUDA 13.0 toolkit with `nvcc` already at `/usr/local/cuda`, Python 3.12.3, Docker, CMake, Git, 495 GB free disk. Node.js v22.23.2 is installed.

Implemented state (2026-09-18, execution session): the trainer environment is provisioned and verified on the accelerator (`torch 2.14.0+cu130`, CUDA 13.0, `transformers 5.17.0`, `peft 0.21.0`; recorded in `training/environment/environment-manifest.json`); the base model is pinned at revision `ea3f2471cf1b1f0db85067f1ef93848e38e88c25` (`training/environment/base-model.json`); llama.cpp is built from source at commit `911f6cdc8ab8a530b2bee09ee61471a6f3178eeb` and serves the F16 conversion of the pinned base model; the trainer view is exported (6775 rows, snapshot `82d3dedb8f4c296f09969ca154ae62d9139c01215cea1cf51a86680132bf3289`); and the token gate measured every row with a maximum of 1968 total tokens and 1614 target tokens, zero rows above 4096, which confirms D7.

## Decision log

Each decision below is final for the first training milestone. "Revisit when" names the measured condition that reopens it.

### D1 — First-milestone scope: compiled-plan emission only

The first fine-tuned student learns exactly the behavior the shipped dataset teaches: read a problem statement, emit one SOP Lang compiled plan (`slots`, optional `facts`, deterministic `answer`). Containers, multi-wire intermediate plans, tool-registry reading, and neural wires are outside this milestone because no verified training data exists for them; the failure analysis after the first run (task T9) decides their introduction through a DS008 contract change. This matches DS009's "first training target" section, which explicitly does not try to prove the full research thesis.

### D2 — Base student: Qwen2.5-Coder-0.5B-Instruct

`Qwen/Qwen2.5-Coder-0.5B-Instruct` (Apache-2.0, ~0.49B parameters, 32,768-token context, Qwen2.5 chat template with no thinking tags). Rationale: it is the worked example already named by DS007; it is instruct-tuned with a clean, stable chat template, which the tiny overfit test depends on; it is code-capable, which the `jsEval` targets depend on; Apache-2.0 is compatible with internal training and later release of weights. Alternatives rejected for now: Qwen3-0.6B (Apache-2.0, but its hybrid thinking mode adds template complexity that can mask loss-mask bugs during the overfit gate — it is the fallback if the 0.5B fails to learn); vLLM-served API models (no local control, no reproducibility). The second student size for the scaling curve (task T11) is `Qwen2.5-Coder-1.5B-Instruct`, same family so the curve is attributable to size. The exact revision hash is recorded in every run manifest at download time; DS007 stays family-agnostic.

### D3 — Trainer stack: PyTorch cu130 + transformers Trainer + accelerate, nothing else

Training runs on the official PyTorch `cu130` aarch64 wheels (`https://download.pytorch.org/whl/cu130`, currently 2.9.x+cu130 — the `sm_121` warning they print is safe to ignore because `sm_121` is SASS-compatible with `sm_120`), plus `transformers` (Trainer API), `accelerate`, `peft` (for the LoRA comparison only), `huggingface_hub`, and `gguf` (for checkpoint conversion). Rejected: TRL and Unsloth (extra version churn and aarch64 packaging risk for capabilities the custom collator provides in ~100 lines); flash-attn (no `sm_121` kernels, causes `libcudart.so.12` ABI errors — PyTorch SDPA is the attention implementation, and it is competitive on Blackwell); bitsandbytes/QLoRA (the 0.5B full fine-tune fits trivially in 119 GiB); vLLM (no stable cu130 aarch64 wheels; not needed — the trainer generates no rollouts in this milestone); Docker/NGC containers (bare-metal wheels are confirmed working here and keep the environment inspectable; the container path remains the documented fallback in the troubleshooting section).

### D4 — Serving and export: llama.cpp built from source, GGUF artifacts

Inference for evaluation and deployment uses `llama.cpp` built locally with CUDA (`llama-server` exposes an OpenAI-compatible HTTP API; `llama-quantize` produces the deployment quantizations; `convert_hf_to_gguf.py` converts HF checkpoints). Rationale: llama.cpp is the stack community-confirmed to work best on GB10, it is also the CPU/GGUF deployment target DS007 names, so accuracy and speed are measured on the exact exported artifact, and it needs no Python service alive during evaluation. The Node evaluation client speaks plain HTTP with `fetch`. Checkpoints are converted to F16 GGUF for checkpoint selection, then quantized to Q8_0 and Q4_K_M for the deployment measurement (DS007 forbids reporting BF16 accuracy with 4-bit speed).

### D5 — Chat profile: `compiled-plan-chat-1`

The exact, versioned message layout of every training row, every prompt, and every generation. The system prompt is fixed text:

```
You compile problems into SOP Lang circuits. Read the problem and emit exactly one SOP Lang program, the compiled plan of this instance: a @slots literal wire that carries the values you extracted from the statement, an optional @facts literal wire that carries external knowledge the computation reads, and an @answer jsEval wire that computes the answer deterministically from those values. The program carries no input wire and no model call. Output only the program.
```

The user message is the statement body of `problem.md` — everything after the identity heading, exactly what `statementBodyOf` in `training-data/dataset-manifest.mjs` returns, including any `Referenced context` and `Additional information.` lines the statement carries. The assistant target is the exact bytes of `solution.sop`. `explanation.md` never enters prompts, training, or evaluation; the identity heading of `problem.md` never enters prompts. The tokenizer and chat template are the base model's own (no custom template), per DS009. The profile identifier and the SHA-256 of the system prompt text are recorded in every export manifest and run manifest. Revisit when: the T9 failure analysis shows the model needs the command manifest inline, or the DS008 contract gains new wire types.

### D6 — Export format: JSONL under `training/data/`, committed

The trainer view is one JSONL file per book plus one combined file, committed to the repository (they are the actual training snapshot and they total roughly 25 MB of text). Row schema:

```json
{"folder":"mathematical-thinking/no-knowledge/order-in-a-line/1.1-order-in-a-line-1",
 "messages":[{"role":"system","content":"..."},{"role":"user","content":"..."},{"role":"assistant","content":"..."}],
 "meta":{"book":"mathematical-thinking","unit":"1","template":"Order in a Line","type":"order-in-a-line",
         "category":"no-knowledge","split":"train","plan":"6857e0b9d864","status":"match",
         "hashes":{"problem":"...","solution":"...","explanation":"..."},
         "source":{"raw":"...","canonical":"...","extractor":"docx-canvas-text 1.1.0"}}}
```

The exporter reads only `no-knowledge/` and `knowledge/` (the 225 `eval/` examples never appear; a split is a directory fact), orders rows deterministically (book, then manifest row order), and writes `training/data/export-manifest.json` recording: exporter version, chat profile id and system-prompt hash, per-file SHA-256, row counts per book and category, and a dataset snapshot id (SHA-256 over the sorted manifest rows of all seven books, so the snapshot is content-addressed). Two runs on the same tree are byte-identical. The metadata object is never injected into the model — it travels beside the messages.

### D7 — Sequence length 4096, no packing, no truncation

Statement bodies measure up to ~1.6 KB, targets up to ~8.4 KB; with the system prompt and template the worst case is estimated near 3.9k tokens. Decision: `max_seq_len 4096`, no packing (correctness before throughput for the first milestone; packing policy is still recorded in every manifest), right padding, and a hard gate at export time: the tokenizer statistics of task T2 must confirm zero rows above 4096. If any row exceeds it, the global length rises to 5120 (recorded in the manifest) and the offending rows are listed in the export report — no row is ever truncated, because a truncated SOP Lang target teaches syntactically incomplete programs (DS009).

### D8 — Training recipe: full fine-tune first, LoRA as the one comparison

Common: BF16, AdamW, gradient clipping 1.0, cosine schedule with warmup, effective batch 32 (per-device 8 × gradient accumulation 4), seed 3407 recorded, checkpoints + metrics under `training/checkpoints/<experiment-id>/`, every run manifest carries the full DS009 field list (base and tokenizer revisions and hashes, dataset snapshot id, chat profile id, sequence length, packing policy, batch and accumulation, optimizer, learning rate and schedule, warmup, precision, clipping, method, seeds, token budget, checkpoint and evaluation cadence, environment manifest id).

- Overfit run (`exp-001-overfit`): the 300-example subset of task T5, learning rate 2e-5, up to 20 epochs, early stop when mean train loss stays below 0.05, checkpoint every epoch. Purpose: integration test with gradients, not a model.
- First full run (`exp-002-sft-lr2e-5`): all 6775 training rows minus the 339-row validation slice (task T7), learning rate 2e-5, 3 epochs, checkpoint every 0.5 epoch, behavioral evaluation of every checkpoint on the validation slice, one holdout scoring of the selected checkpoint only.
- Learning-rate dimension (`exp-003-sft-lr1e-4`): identical except learning rate 1e-4. Exactly one dimension varies between exp-002 and exp-003 (DS009: one major dimension at a time). The first series planned lr 1e-5 here; the overfit test of T5 replaced that arm: lr 2e-5 plateaued at loss 0.179 with 5.0% oracle match while lr 1e-4 drove the same subset to loss 0.00032 and 100% `answer_match` on the trained rows (`evaluation/registry/exp-001-overfit*/gates.md`), so 1e-5 would have been a third sub-1e-4 point and 1e-4 is the informative high end of the grid.
- LoRA dimension (`exp-004-lora`): exp-002's data and budget, LoRA r=16, alpha 32, dropout 0.05, all attention and MLP projections targeted, learning rate 1e-4.

Estimated cost on GB10: ~8M target tokens per epoch over 6436 rows; a 0.5B full fine-tune runs at roughly 5–15k tokens/s on this machine, so each epoch is well under an hour and the whole first series is an afternoon. Revisit when: the overfit gates fail (diagnose template and mask before touching learning rates — DS009 states the order), or when loss curves show the token budget is the binding constraint.

### D9 — Evaluation protocol: one generation attempt, seven outcome classes, greedy decoding

Every evaluation generation is greedy (temperature 0), max 2048 new tokens, one attempt, no repair pass (repair is a later measured behavior, not a v1 crutch). Each item lands in exactly one class: `generation_transport_error` (HTTP or transport failure, or empty completion after one retry), `wrapper_rejected` (the post-processor of D10 rejects), `parse_invalid` (the runtime parser rejects), `graph_invalid` (unknown output, unknown dependency, or cycle), `execution_error` (the circuit fails, including probe failures), `answer_mismatch` (executed answer differs from the manifest oracle), `answer_match`. Metrics reported separately per DS009: parse validity, graph validity, completion rate, oracle match, each as an overall rate and macro-averaged by book and by plan-fingerprint cluster, plus efficiency columns (prompt tokens, generated tokens, wall-clock, generated tokens per matched item). Per-item JSONL records are written before any aggregate exists, under `evaluation/registry/<experiment-id>/`.

### D10 — Generation post-processing contract

A completion is accepted as a program if, after trimming leading/trailing whitespace, it either is already bare SOP text starting with `@` at column one, or is a single fenced block whose entire content is the program. It is rejected (class `wrapper_rejected`) when it is empty, contains prose outside a single fenced block, contains more than one fenced block, or contains no `@` wire declaration at all. The exact rule is implemented once, in the evaluation client, and covered by unit tests; fence-stripped-but-parseable completions are counted separately from prose completions so a chat-template defect is never misread as a language defect.

### D11 — Checkpoint selection: behavioral, on a fixed validation slice

A 339-row validation slice (5% of the 6775 training rows, sampled deterministically with seed 3407 from the export, recorded in `training/data/validation-slice.json`) is excluded from training and used to score every checkpoint with the full evaluation loop (GGUF conversion at F16, no quantization, for selection). The slice reserves an equal quota per book so the macro tables rest on comparable sample sizes, and within a book it prefers rows whose plan fingerprint does not occur elsewhere in the export (refinement recorded 2026-09-18), so the selection metric reads like the plan-clustered holdout; `report.md` records per book how many slice rows sit on a reused plan, and the common-sense book (19 plans for 950 rows) necessarily reuses. The holdout's 225 examples are never used for selection, only for the single final scoring of the selected checkpoint of each experiment. A checkpoint is selected by oracle match, with parse validity as the tiebreaker, never by training loss.

### D12 — Layout and git policy

```
training/
  PLAN.md                     this plan
  environment/                setup scripts, environment manifest, probe outputs
  python/                     requirements.txt, requirements.lock, sft_train.py, tokenize_inspect.py
  export.mjs                  trainer-view exporter (Node built-ins only)
  data/                       JSONL exports, export-manifest.json, report.md, validation-slice.json (committed)
  overfit/                    overfit-subset.json (committed)
  models/                     downloaded base models (gitignored)
  checkpoints/                training outputs (gitignored)
evaluation/
  client.mjs                  HTTP client + post-processing (Node built-ins only)
  run-eval.mjs                evaluation loop
  registry/<experiment-id>/   run-manifest.json, items/*.jsonl, metrics.json, report.md (committed)
tools/llamacpp/               llama.cpp clone + build (gitignored, outside the repo tree proper)
```

`evaluation/registry/` is committed because it is the evidence registry DS009 requires; GGUF binaries, model weights, and checkpoints are gitignored. Experiment ids are `exp-NNN-slug` with a running number; the id appears in the run manifest, the registry folder, and every report.

### D13 — Dependency recording

The Python trainer side is the sole sanctioned non-Node dependency surface. The implementing agent adds one `dependencies.md` entry covering the trainer toolchain (PyTorch cu130 wheels, transformers, accelerate, peft, huggingface_hub, gguf) and one covering llama.cpp (source build), each with justification, alternatives, authorization (this plan, owner-directed 2026-09-18), license, source and update URLs, startup checks (the verify probe of T1 and the llama-server health check), and removal opportunities. `npm test` must keep running with zero npm dependencies.

## Task breakdown

Tasks are ordered by dependency. `todo.md` Phase 4 ids appear in parentheses. Estimates assume one agent on this machine.

### T0 — Hygiene and defect repair (4.1.1–4.1.4), 1–2 h total

- **T0a — Commit the working tree (4.1.1).** Run `npm test` and `node training-data/verify.mjs` once more, then commit everything currently uncommitted in one commit whose message names the family restructure, the seven datasets, and the verifier rewrite. Verify no path still references `teacher/families/chapter-*.mjs` (`grep -rn "families/chapter" . --include="*.mjs" --include="*.md"` returns nothing).
- **T0b — Fix `docs/index.html` (4.1.2).** Replace the stale two-book narrative in the implementation-status paragraph (the sentences beginning "Two books are compiled." through "...rejected as `ambiguous_statement` because the statement does not determine its answer.") with the seven-book state: seven compiled books, 1000 accepted each, empty `rejected/`, the recovery mechanisms, 225 held out. Keep the paragraph's remaining sentences.
- **T0c — Fix `README.md` (4.1.3).** Delete the duplicated fragment: the paragraph under "The family modules under `teacher/families/<book>/` are the source of the dataset" must appear exactly once.
- **T0d — Adjudicate the 107 invariant answers (4.1.4).** Run `node training-data/verify.mjs --provenance` to list them (100 logical-reasoning, 7 mathematical-thinking). For each plan cluster, inspect the family: either add one perturbation that flips the answer (for example flipping a categorical label the computation dispatches on) and regenerate that book, or record the invariant-answer reason in that book's `report.md`. Acceptance: `verify.mjs` reports zero unprovable answers, or every remaining one is listed with a reason.

### T1 — Trainer environment (4.3.1–4.3.3), 1–2 h

Create `training/environment/setup.sh` that performs, in order:

```bash
# 1. Python virtual environment (gitignored)
python3 -m venv training/.venv
source training/.venv/bin/activate
pip install --upgrade pip

# 2. PyTorch cu130 aarch64 wheels FIRST (order matters; nothing may pull a cu12 wheel later)
pip install torch --index-url https://download.pytorch.org/whl/cu130

# 3. The rest of the trainer stack (pure-Python or aarch64-safe wheels)
pip install transformers accelerate peft huggingface_hub gguf

# 4. Freeze the resolved versions
pip freeze > training/python/requirements.lock
```

Write `training/python/requirements.txt` as the intent (`--extra-index-url https://download.pytorch.org/whl/cu130` plus the package list) and the lock file as the record; the run manifest references the lock file's hash. Safety exports for this machine: `export TRITON_PTXAS_PATH=/usr/local/cuda/bin/ptxas` (Triton's bundled `ptxas` can fail on `sm_121a`; the system CUDA 13.0 one is correct).

Verify with a probe that also becomes the startup check recorded in `dependencies.md`:

```bash
python - <<'EOF'
import torch
print(torch.__version__, torch.version.cuda, torch.cuda.get_device_name(0))
x = torch.randn(2048, 2048, device="cuda")
print("matmul ok:", float((x @ x).sum()))
assert torch.version.cuda.startswith("13")
EOF
```

Expected: `2.9.x+cu130 13.0 NVIDIA GB10`, and a tensor result. The `sm_121` warning PyTorch prints is documented as safe to ignore. Then write `training/environment/environment-manifest.json` (driver and CUDA versions from `nvidia-smi` and `nvcc --version`, torch and library versions from the probe, CPU and memory from `/proc`, Python version) — every run manifest references this file's hash. Add the two `dependencies.md` entries (D13).

Then build llama.cpp (D4):

```bash
git clone --depth 1 https://github.com/ggml-org/llama.cpp tools/llamacpp
cmake -S tools/llamacpp -B tools/llamacpp/build -DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES=121
cmake --build tools/llamacpp/build --config Release -j20
```

Verify: `tools/llamacpp/build/bin/llama-server --version` runs, and after T3 a smoke generation completes.

Finally download the base model and record its revision (4.3.3):

```bash
source training/.venv/bin/activate
hf download Qwen/Qwen2.5-Coder-0.5B-Instruct --local-dir training/models/qwen2.5-coder-0.5b-instruct
python - <<'EOF'
from huggingface_hub import model_info
info = model_info("Qwen/Qwen2.5-Coder-0.5B-Instruct")
print(info.sha)  # record this revision hash in the environment manifest
EOF
```

### T2 — Trainer-view export (4.2.1–4.2.4), 3–5 h

The chat-profile decision (D5) and format (D6) are already made; this task implements them. Write `training/export.mjs` (Node built-ins only):

1. Read the seven book trees via `training-data/dataset-manifest.mjs` (`bookRoots`, `expectedAnswersOf`, `statementBodyOf`) and `training-data/sources.md` for the source hashes.
2. For every training row (categories `no-knowledge` and `knowledge` only), build the row of D6: system = the profile text, user = `statementBodyOf(problem.md)`, assistant = the exact `solution.sop` text; `meta` from the manifest row plus the source hashes.
3. Write `training/data/<book>.jsonl`, `training/data/all-books.jsonl`, and `training/data/export-manifest.json` (per-file SHA-256, row counts, snapshot id, profile id and prompt hash, exporter version).
4. Write `training/data/report.md`: distributions per book and combined of statement characters, target characters, wire count, JavaScript body lines, `$` dependency count; the ten longest targets and statements by folder.
5. Write `training/data/validation-slice.json` (D11: 339 folder ids, seed 3407) and exclude those rows from nothing yet — the trainer excludes them from training by this file.

Then the token gate (4.2.4): a small Python script `training/python/token_stats.py` loads the pinned tokenizer, tokenizes every row with the official chat template (assistant included), and reports the max and percentiles of total length and target length. Acceptance: 6775 rows; zero rows above 4096 total tokens (else apply D7's fallback and record it); the artifact `training/data/token-stats.json` is committed; `tests/export.test.mjs` pins row schema, eval exclusion (no `eval/` folder appears), determinism (double run byte-identical), and the count per book; `npm test` stays green.

### T3 — Serving wrapper and client (4.4.1, 4.4.2), 2–3 h

Write `evaluation/client.mjs` (Node built-ins only; Node 22 has global `fetch`): one function `generate({ base, model, messages, temperature, maxTokens })` that POSTs to the llama-server OpenAI-compatible `/v1/chat/completions` endpoint, applies exactly one retry on transport failure, returns `{ completion, usage, latencyMs, raw }`, and appends a JSON line per request to the experiment's item log. Implement the post-processing contract (D10) as `extractProgram(completion)` returning `{ ok: true, program } | { ok: false, reason }`, with unit tests covering: bare program, single fence, prose around fence (rejected), two fences (rejected), empty (rejected), fence with leading prose and trailing prose (rejected). Add a `serve.md` note with the exact commands:

```bash
# Convert an HF checkpoint (or the base model) to GGUF
python tools/llamacpp/convert_hf_to_gguf.py training/models/qwen2.5-coder-0.5b-instruct --outfile training/checkpoints/base-f16.gguf --outtype f16
# Serve it
tools/llamacpp/build/bin/llama-server -m training/checkpoints/base-f16.gguf --port 8080 --ctx-size 8192 --n-gpu-layers 99
```

Acceptance: a Node smoke script sends one compiled-plan prompt against the served base model and returns a completion; the item log records it; the unit tests pass.

### T4 — Baseline benchmark of the untuned base (4.3.4), 2 h

Build `evaluation/run-eval.mjs` (task T6 delivers the full loop; here it only needs enough to run a sample): sample 50 holdout examples (seed pinned), run them through the loop in two modes — (a) direct-answer mode (system prompt: `Answer the problem directly with the final answer only.`), recording the raw prose answers; (b) compiled-plan mode with profile `compiled-plan-chat-1`, running the full classification. Also run a 10-item JavaScript microtask probe (hand-written tiny tasks: sum an array, filter by predicate — served as plain coding prompts, answers checked by `eval` in a `node:vm` sandbox... use the runtime sandbox style: simplest is exact-string checks on prepared tasks). Record everything under `evaluation/registry/exp-000-baseline/`. Acceptance: the registry folder holds per-item records and a `report.md` with the four rates (they will be near zero for the base model — that is the expected result and the number the first run must beat), plus measured tokens/s on the served GGUF.

### T5 — Tiny overfit test (4.5.1–4.5.4), 4–6 h including the run

- **T5a — Subset (4.5.1).** Write `training/overfit/select.mjs` (Node): load the export, group training rows by `(book, plan)` fingerprint, deterministic shuffle with seed 20260918, take 300 pairs round-robin across books, one row per pair (first in sorted folder order). Commit `training/overfit/overfit-subset.json` (the 300 folder ids plus the seed and the export snapshot id). 
- **T5b — Trainer (4.5.2).** Write `training/python/sft_train.py`: reads the export JSONL and a subset file, applies the tokenizer's official chat template, builds labels with `-100` on every non-assistant token (mask computed by tokenizing the prompt portion separately and by template-token boundaries — the standard `apply_chat_template(..., return_assistant_tokens_mask=True)` path when the template supports it, otherwise the two-pass prefix method), right-pads, trains with `transformers.Trainer` and the recipe of D8, writes checkpoints and a `train-log.jsonl` (step, loss, lr, plus the memory columns `mem_available_gib`, `cuda_free_gib`, `cuda_peak_gib`, `cuda_reserved_gib`, `rss_gib`) under `training/checkpoints/<experiment-id>/`, and a `run-manifest.json` with the full DS009 field list. Every run declares a device-memory budget: `--memory-fraction` (default 0.75) caps the process allocator, the memory guard stops at a step boundary with a checkpoint and exit code 3 (`status: stopped_for_memory`) when available memory falls below `--memory-floor-gb` (default 16), and `--gradient-checkpointing` lowers the peak of a long batch. Acceptance: `python training/python/sft_train.py --experiment exp-001-overfit --subset training/overfit/overfit-subset.json --epochs 20 --lr 2e-5` completes.
- **T5c — Mask verification (4.5.3).** Write `training/python/tokenize_inspect.py`: tokenizes the first subset row, prints a two-column artifact (token id, decoded piece, masked or loss-bearing) to `training/checkpoints/exp-001-overfit/mask-inspect.txt`. Acceptance: the artifact shows loss exactly on the assistant tokens including the closing `<|im_end|>` and nowhere else; a human sign-off line is added to the registry note.
- **T5d — Gates (4.5.4).** Gate 1: final train loss below 0.05 with a strongly falling curve. Gate 2: convert the final checkpoint to GGUF, serve it, run the T6 loop over the same 300 training items — at least 95% must reach `answer_match` after memorization. Gate 3: the served prompt rendering provably matches the training rendering (the client builds messages identically; llama-server applies the model's template from the GGUF metadata — verified by decoding one served prompt via the `/tokenize` endpoint or by tokenizing the rendered string with the Python tokenizer and comparing). If loss falls but generations stay prose: inspect the chat template and the D10 wrapper before any hyperparameter change (DS009's stated order). All three gates pass or the milestone stops with a written diagnosis in the registry. Status (2026-09-18): the first 20-epoch run (lr 2e-5) passes gate 3 but fails gates 1 and 2 — the loss plateaus at 0.179 and the served model scores 100% parse validity, 44.3% runtime completion, and 5.0% oracle match, with the failures content-level on rows it trained on; the diagnosis is `evaluation/registry/exp-001-overfit/gates.md`, and `exp-001-overfit-lr1e-4` (lr 1e-4, 40 epochs, same subset, batch 4 x accumulation 8 to fit the degraded pool) re-runs gates 1 and 2 before the first full run. That re-run passes gate 1 (early stop at step 100/320, loss 0.00413, extended to 0.00032 at step 271), passes gate 3, and, on the step-271 checkpoint served after the guard stop, reaches **284/284 = 100% `answer_match` on the 284 trained rows** (94.7% over all 300; the 16 rows of the D11 overlap stay at 0%), so all three gates of the overfit test pass and the first full run of T8 is unblocked; the evidence is `evaluation/registry/exp-001-overfit-lr1e-4/gates.md`.

### T6 — Evaluation loop (4.6.1–4.6.3), 4–6 h

Complete `evaluation/run-eval.mjs`: arguments `--experiment <id> --gguf <path> --slice <holdout|validation|file> --port 8080`; for each row: build the prompt with `evaluation/client.mjs`, generate greedily (temperature 0, max 2048 new tokens), classify per D9, execute accepted programs with `runtime/kernel.mjs` (`createRuntime().run(program, { outputs: ['answer'] })`, no inputs, no models — dataset circuits need none), compare the executed answer with the oracle string of `expectedAnswersOf` (exact string match on the answer wire value; the runtime returns JSON-stringified values, the manifest carries the printed answer — normalize with the same rule `verify.mjs` already uses, reuse its comparison helper rather than re-deriving it). Write per-item records first (`items/items-0001.jsonl`: folder, book, class, expected, executed, program path, tokens, latency), then `metrics.json` and `report.md` with the four rates overall and macro by book and plan cluster, plus efficiency columns. Failure isolation: one bad circuit must never abort the batch (the runtime returns structured failures — carry them into the item class). Acceptance: the exp-000 baseline rerun through the final loop produces identical per-item classes; a deliberately corrupted GGUF run lands items in the expected classes; `tests/run-eval.test.mjs` covers the classifier and the comparison helper with fixtures.

### T7 — Checkpoint selection (4.6.4), 2 h

Write `evaluation/select-checkpoint.mjs`: for every checkpoint directory of an experiment, convert to F16 GGUF (scripted), serve, run the loop on the validation slice, tabulate oracle match and parse validity, write `evaluation/registry/<experiment-id>/selection.md` naming the winner. Acceptance: exp-002 produces a selection table over at least five checkpoints and one selected checkpoint.

### T8 — First full run (4.7.1), one afternoon of compute

Run, in order: `exp-002-sft-lr2e-5` (lr 2e-5, 3 epochs, 6436 training rows = 6775 minus the 339 validation rows, 606 optimizer steps), `exp-003-sft-lr1e-4` (identical, lr 1e-4, the arm the T5 evidence selected), `exp-004-lora` (LoRA per D8). For each: checkpoint selection via T7, then exactly one holdout run of the selected checkpoint with the T6 loop, registry entries complete (run manifest, selection table, holdout report). The report states total target tokens and examples, not only epochs. Acceptance: three registry folders with holdout reports; a summary table `evaluation/registry/phase4-first-series.md` comparing exp-002/003/004 and the exp-000 baseline on the four rates. Status (2026-09-18): `exp-002-sft-lr2e-5` **completed 606/606 steps** (3 epochs over 6436 rows) with final loss **0.0236**, 15.85M input tokens (11.56M target), and a peak of 17.5 GiB; one memory-guard stop at step 451 was resumed automatically after the owner's reboot, and checkpoint selection over the six checkpoints is running. `exp-003-sft-lr1e-4` completed the same recipe at lr 1e-4, the arm the T5 overfit evidence selected, with final loss **0.00125** (nineteen times lower than exp-002 at the same 606-step budget); both registries are being filled by the serialized evaluation chain (`select-checkpoint.mjs` then `run-holdout.sh` per experiment).

### T9 — Failure analysis and the data-iteration decision (4.7.2, 4.2.5), 3–4 h

Over the holdout per-item records of the best experiment: aggregate the failure classes by book and plan cluster; sample and read 20 items of each dominant class; write `evaluation/registry/phase4-analysis.md` answering the DS009 diagnostic questions (syntax high but semantics low ⇒ planning not learned; train high but holdout low ⇒ structural overfit; wrapper_rejected dominant ⇒ template/format problem; knowledge rows fail disproportionately ⇒ knowledge-mode weakness). Attach the verdict for each postponed decision: the DS008 extension for multi-wire, container, and registry-reading example types (with which families produce them and how `verify.mjs` extends), the capability-preservation mixture (currently none — the JS microtask and instruction probes of T4 must be rerun on the trained checkpoint and reported here), the knowledge-category enrichment, and the chat-profile revision. No dataset regeneration happens before this document exists.

### T10 — Export and deployment measurement (4.7.4), 2 h

Quantize the selected checkpoint (`llama-quantize` to Q8_0 and Q4_K_M), rerun the full holdout loop on each quantized artifact, measure tokens/s, time to first token, prompt-processing throughput, peak memory (`/usr/bin/time -v` on llama-server), and whole-task latency on a named thread count. Write `evaluation/registry/<experiment-id>/deployment.md`; accuracy and speed always come from the same artifact.

### T11 — Later series (4.7.3, 4.7.5, 4.7.6)

Knowledge enrichment and the generalization probes (unseen compositions, renamed vocabulary, greater depths — evaluation-only material from generated families) run only after T9 records their justification. The second student size is dropped by owner directive (2026-09-21): the milestone is answered on the 0.5B student, so a scaling arm is out of scope.

## Definition of done for the first milestone

1. `npm test` green; `node training-data/verify.mjs` `verify: OK`; working tree committed.
2. `training/environment/` holds a reproducible setup script, a verified environment manifest, and `dependencies.md` carries the two trainer entries.
3. `training/data/` holds the deterministic export (6775 rows), the token gate artifact, and the validation slice; `tests/export.test.mjs` green.
4. exp-001 overfit gates all pass with the mask-inspect artifact committed.
5. exp-000 baseline, exp-002, exp-003, exp-004 registry folders each hold per-item records, metrics, and a holdout report; `phase4-first-series.md` compares them.
6. `phase4-analysis.md` exists with the verdicts that gate every later data decision.
7. README, `docs/index.html`, and the affected specifications are updated in the same changes (the repository rule), including the training and evaluation trees in the repository-structure table.

## GB10 troubleshooting notes

- **`libcudart.so.12 not found` / undefined CUDA symbols at import**: a cu12 wheel slipped in (often via a transitive dependency). `pip uninstall` the offender and reinstall from the cu130 index; check `python -c "import torch; print(torch.version.cuda)"` prints `13.x`.
- **PyTorch warns about `sm_121`**: documented as safe to ignore; the binaries carry `sm_120` SASS, which `sm_121` executes.
- **flash-attention**: never `pip install flash-attn` on this machine — it breaks with ABI errors and has no `sm_121` kernels. SDPA is the attention path everywhere (Trainer `attn_implementation="sdpa"`).
- **Triton compile errors mentioning `ptxas`**: ensure `TRITON_PTXAS_PATH=/usr/local/cuda/bin/ptxas` is exported in the training shell.
- **llama.cpp build fails on CUDA arch**: use `-DCMAKE_CUDA_ARCHITECTURES=121` (native); the toolkit at `/usr/local/cuda` is 13.0 and matches the driver.
- **vLLM temptation**: no stable cu130 aarch64 wheels exist; do not introduce vLLM for this milestone. If serving throughput ever becomes the bottleneck, the recorded fallback is the NGC PyTorch container path, decided then.
- **Unified memory (measured 2026-09-18, after the first run froze the workstation)**: the GB10 shares one 119.6 GiB pool between the CPU and the GPU; `nvidia-smi` reports "Not Supported" for its memory, CUDA allocations do not appear in any process RSS, and the cgroup memory controller does not charge them (a 30 GiB CUDA allocation succeeds under `systemd-run --user --scope -p MemoryMax=4G` with `memory.current` still at 0.4 GiB), so the kernel OOM killer cannot see the consumer and kills desktop services (`wireplumber`, `pipewire`) instead of the trainer while the pool thrashes — that is what happened at 14:02-14:19 on 2026-09-18 (7 global OOM invocations, `NVRM: ... NV_ERR_NO_MEMORY` from the driver, an empty `train-log.jsonl`, then a reboot). The SDPA path of this torch build has no flash kernel for `sm_121` (`sdpa_kernel([FLASH_ATTENTION])` aborts with "No available kernel"), so attention materializes its intermediates and the footprint scales with the tokens of a batch: measured 33.5 GiB for a batch of 8 rows at the dataset's width (8.2k real tokens, 1.2k padded), 22.2 GiB with `--gradient-checkpointing`, and more than 95 GiB for a batch padded to the D7 limit of 4096 tokens (32.8k tokens) — budget roughly 3.5-4 GiB per 1000 batch tokens, which is why the D7 limit with batch 8 is only safe because the shipped rows stay below about 2000 tokens. The trainer now enforces a budget: `--memory-fraction 0.75` caps the process allocator at 89.7 GiB (`torch.cuda.set_per_process_memory_fraction`, verified to turn a runaway allocation into a clean Python `OutOfMemoryError`), the memory guard samples the pool every step, records `mem_available_gib`, `cuda_free_gib`, `cuda_peak_gib`, `cuda_reserved_gib`, and `rss_gib` in every logged step and in the run manifest (`memory_budget`, `peak_device_memory_gib`), reclaims the allocator's cached blocks when the pool approaches the floor (measured at the D8 shape: 23-42 GiB of freed blocks against 5-7 GiB of live tensors, which is what drained the pool at step 82 of the first episode), and stops at a step boundary with a checkpoint only when reclaiming does not clear `--memory-floor-gb 16` (exit code 3, `status: stopped_for_memory`, resumable with `--resume auto`, every stop appended to `memory-stops.jsonl` because the next episode overwrites the manifest). `--gradient-checkpointing` is the lever when the batch approaches the budget (measured peak 33.5 GiB at the dataset width against 22.2 GiB with checkpointing). Two separate effects of this driver are documented because they are not the trainer's: the SDPA path has no flash kernel for `sm_121` (`sdpa_kernel([FLASH_ATTENTION])` aborts with "No available kernel"), so attention materializes intermediates and the footprint scales with the tokens of a batch (roughly 3.5-4 GiB per 1000 batch tokens, more than 95 GiB for a batch padded to the D7 limit of 4096 tokens — which is why the D7 limit with batch 8 is only safe because the shipped rows stay below about 2000 tokens); and the driver does not return the whole pool when a process exits (a fresh process measured 68.3 GiB free while the host had 114.6 GiB available), so repeated runs starve the pool and only a reboot restores it — check the pool with `bash training/environment/train.sh python -c "import torch; print(torch.cuda.mem_get_info()[0]/2**30)"` before a long run. `training/environment/train.sh` exports `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True` against pool fragmentation. Swap stays off: the 16 GiB `/swap.img` only adds thrash to a pool that is already invisible to the kernel's accounting.
- **Unattended runs and watching them (2026-09-18)**: `training/environment/overnight.sh` runs `sft_train.py` in episodes — a memory-guard stop (exit code 3) is followed by a wait and a `--resume auto` continuation, one JSON line per episode appended to `<output-dir>/overnight-state.jsonl`, and the process survives the terminal that started it (`nohup ... &`, or a detached process inside an omp session). `evaluation/run-series.sh <experiment>...` runs the evaluation side in the same spirit: for each experiment it waits for that trainer to finish, then runs `evaluation/select-checkpoint.mjs` (T7) and `evaluation/run-holdout.sh` (T6, one holdout run of the winner, serving the winner's GGUF itself), appending to `evaluation/registry/<experiment>/series.log`; the evaluations are serialized on purpose because a selection server and a trainer share one GPU and doubled each other's wall time. `training/environment/train-status.sh` prints one screen of run health (status, steps, loss curve, device margin above the floor, checkpoints, episodes, live process) reading only files on disk plus `/proc/meminfo`, because creating a CUDA context to ask the device costs a slice of the shared pool. The handoff of the current session — where the pipeline stopped, the resume point, and the next commands — is `training/STATE.md`.
- **Triton asks for `Python.h` and the first training step dies**: `python3.12-dev`/`libpython3.12-dev` are not installed on this machine and the account has no root, so Triton cannot compile its CUDA helper. `training/environment/setup.sh` extracts those headers from the Ubuntu package into the gitignored `tools/python-headers/` tree and `training/environment/train.sh` exposes them through `CPATH`; with root, `apt-get install -y python3.12-dev` is the simpler equivalent. `training/environment/probe.py` now builds the Triton driver, so the failure surfaces in the probe instead of at the first optimizer step.
- **Measured throughput (2026-09-18)**: about 6.5 s per optimizer step at effective batch 32, i.e. roughly 3.5-4.5k tokens/s, with `transformers` 5.17.0 and SDPA; the full training set is about 202 optimizer steps per epoch (about 22 minutes per epoch), and startup costs about a minute. A first reading of the train log can mislead: `wall_clock_s` includes process start, so the first logged step carries the load and tokenization time. The later runs recorded 8 steps per epoch for the 284-row subset where the Trainer ran 9, because the manifest used a floor division of the batch count over the accumulation; the trainer now mirrors `set_initial_training_values` (a partial accumulation window is still an update step), verified against the Trainer's own computation for both dataset sizes (9 of 9 and 202 of 202).

## Measured state (2026-09-21)

Every arm below scores the same 265-item holdout of families absent from its export (the 225 book eval rows plus the 40 instances of the withheld synthetic family), so the oracle column is comparable across arms; `exp-003` predates the synthetic source and scored its own 225-item holdout.

| experiment | recipe and suite | validation oracle | plan-seen | plan-unseen | holdout (265, all plans unseen) | capability probes |
| --- | --- | --- | --- | --- | --- | --- |
| `exp-000-baseline` | untuned base, zero shot | — | — | — | parse 0.0%, oracle 0.0% (50 items); direct answers 0/50 | 4/10 |
| `exp-002-sft-lr2e-5` | full, lr 2e-5, 606 steps, 6775 rows | 53.7% (`checkpoint-450`) | 56.0% (181/323) | 6.3% (1/16) | parse 100.0%, graph 99.6%, completion 12.4%, oracle 0.0% | — |
| `exp-003-sft-lr1e-4` | full, lr 1e-4, 606 steps, 6775 rows | 94.7% (`checkpoint-540`) | 98.8% (319/323) | 12.5% (2/16) | parse 100.0%, graph 100.0%, completion 27.6%, oracle 0.0% (225 items) | 1/10 |
| `exp-004-lora` | LoRA r16 alpha32, lr 1e-4, 606 steps, 6775 rows | 52.5% (`checkpoint-360`) | 54.2% (175/323) | 18.8% (3/16) | parse 99.6%, graph 99.6%, completion 12.5%, oracle 0.0% | 0/10 |
| `exp-005-sft-widened` | full, lr 1e-4, 639 steps, 7135 rows, ten synthetic families | 94.4% (`checkpoint-360`) | 98.5% (318/323) | 12.5% (2/16) | parse 100.0%, graph 100.0%, completion 18.1%, oracle 0.4% (1 of 265) | 1/10 |
| `exp-007-sft-wires` | full, lr 1e-4, 657 steps, 7335 rows, multi-wire targets | 94.4% (`checkpoint-540`) | 98.1% (317/323) | 18.8% (3/16) | parse 100.0%, graph 100.0%, completion 12.8%, oracle 0.4% (1 of 265) | 0/10 |
| `exp-008-sft-shapes` | full, lr 1e-4, 3 epochs, 7575 rows, twenty training plan shapes | in flight (chain started 2026-09-21 19:21Z) | — | — | — | — |

`evaluation/registry/phase4-analysis.md` (T9, extended 2026-09-21) holds the failure analysis and the decisions. The ladder above is the measured form of the DS009 diagnostic "train high but holdout low": the student reproduces a known plan for new values and has no procedure for a plan it never saw. Decisions recorded there: widen the training plan set before any further recipe or student-size arm (D-A, implemented for `exp-008`), keep the preservation mixture at `none` pending the probe score on the next selected checkpoint (D-B; the scores have since landed and the substrate loss is measured, so the mixture is the next series' variable), defer the 1.5B arm to the widened suite (D-C, dropped by owner directive), deploy the best first-series artifact (D-E, closed), reject a variant-capped mixture (D-F), keep containers and definition reads out of the structure arm and widen with multi-stage plans instead (D-G, with the four gates named), and version the chat profile to `compiled-plan-chat-2` while requiring the evaluation manifest to publish the identity of the slice it scored (D-H).

Machine use while training, for hosts shared with other users: the trainer declares `--memory-fraction 0.75` (a ceiling of 89.7 GiB of the 119.6 GiB GB10 pool) against a 16 GiB floor, and the realized peak of a full run is 17.5 GiB (14.3 GiB so far for LoRA), so the desktop and other users keep the large majority of the pool; the guard releases cached blocks and stops at a step boundary with a checkpoint rather than letting the kernel OOM killer shoot host services, as it did before the budget existed. Runs are serialized (a selection server and a trainer on one GPU doubled both wall times) and the trainer is launched under `nice -n 10`, so competing interactive work wins the CPU without changing the recorded recipe. The evaluation chain (`evaluation/run-series.sh`) waits for the trainer, then converts, serves, selects, and scores without further attention.

## Data revision (specified 2026-09-21)

The holdout result (0/225 on families absent from the export, with 98.8% on plan-seen rows) makes plan coverage the binding constraint, and the pipeline cannot widen the plan set from the family modules: one case equals one printed template equals one `planFingerprint` (facts body plus compute body, and the loader rejects a duplicate `template`), statements are transcribed from the DOCX books by `teacher/sources/<book>.mjs`, and the eval-only families are the same modules on the holdout side of a deterministic split.

`docs/specs/DS008-training-data.md` therefore specifies the route:

- `### Procedural source families`: a registered source whose statements come from its own generator, with the assurance class `constructed_verified` (the circuit answer must equal the oracle of the recorded latent plan), the generator family as the unit of work, family-level splitting (a holdout family is never trained on), the provenance record that replaces a source span (generator id and version, family, instance index, sampling seed, latent plan, difficulty vector), repository-owned rights with no third-party text, and the volume cap that keeps the books present.
- `### Additional circuit shapes`: multi-wire plans (probe harness on every `jsEval` wire, not only the answer), container plans (state seeded from `slots`/`facts` because no `input` wire is permitted, writes read in a later epoch, answer a pure function of the state its epoch observes, `slots` still load-bearing for the provenance battery), and registry-reading plans (structural read set recorded, definition reads covered by the fingerprint, answer still reacting to perturbed `slots`).
- The extended `plan fingerprint` covers every wire's definition body, so intermediate structure, container work, and definition reads are visible to deduplication, leakage checks, the holdout clustering, and the plan-seen/plan-unseen columns of `evaluation/select-checkpoint.mjs`.
- `DS009` records that a run whose targets carry the new shapes uses a chat profile whose system prompt names them, instead of `compiled-plan-chat-1`.

Implementation order for the next data step: register the first procedural source with one generator family and several plan shapes, extend `training-data/verify.mjs` to the extended fingerprint and the new shapes, compile a small suite, re-export, retrain, and read the plan-unseen column. `evaluation/registry/phase4-analysis.md` (D-A, D-F) records the rejected alternatives: holdout rotation leaves no plan-disjoint holdout, and a variant-capped mixture of the existing plans adds no family.

The integration points a procedural source must touch, read from the current code: the registry entry in `teacher/sources/procedural.mjs` (included by `teacher/sources/index.mjs`), the branch in `runPilot` (a generated source samples its problems through `generatedProblems` instead of parsing a document), the four variants in `teacher/dataset.mjs` (the manifest row carries instance and seed where a book row carries its paragraph span, `explanationFile` records the generator provenance instead of printed reference steps, `sourcesFile` appends a generated-sources section, and `reportFile` states the `constructed_verified` class and the generator locator), and the loader and validator in `teacher/procedural/index.mjs`.

Status (2026-09-21): the integration is implemented and verified. Regenerating `common-sense` into the canonical root leaves `git status` clean for `training-data/`, so the book artifacts are byte-identical under the shared writer. Compiling the procedural source into a scratch root accepts 120 of 120 instances (three families of forty) with an empty `rejected/`, and `node training-data/verify.mjs --root <scratch>` reports `verify: OK` with 120 of 120 answers reproduced and 120 of 120 proven reactive under the provenance battery.

One design consequence of the split rule: a generated source clusters by family, so the holdout takes whole families and the 1% target overshoots. Three families of forty instances therefore put forty examples (one whole family) into `eval/` and leave eighty training examples over two plan shapes. A generated source that is meant to widen the training plan set needs many families — ten or more — so the holdout takes one of them and the training rows keep the rest of the plan shapes.

Status (2026-09-21, night): the source now declares 21 families. `teacher/procedural/grouping.mjs` (grouped label totals with merged groups, top-k among a list), `teacher/procedural/aggregation.mjs` (filter then exact average, a crate-and-box conversion chain with a remainder), and `teacher/procedural/textshapes.mjs` (the vowel-richest word, words ordered by length with stable ties) add six plan shapes whose plans publish two named intermediate values each, so the deepest taught chain is `slots → stage 1 → stage 2 → answer` where the previous maximum was one stage. The generative version is `1.1.0` in both the generator and the registry entry. Regenerating the source accepts 840 of 840 instances (21 families of 40) with an empty `rejected/`, `node training-data/verify.mjs` re-executes every circuit of the whole tree with `verify: OK` (840 procedural answers reproduced, 840 proven reactive), `npm test` passes 282 of 282, the export holds 7575 rows under the new profile `compiled-plan-chat-2`, and the tokenizer gate reports no row above 4096 tokens (worst total 2015). `exp-008-sft-shapes` trains on that export with the series recipe. Containers and definition reads stay unimplemented, with the four gates named in `phase4-analysis.md` (D-G).
