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
- Learning-rate dimension (`exp-003-sft-lr1e-5`): identical except learning rate 1e-5. Exactly one dimension varies between exp-002 and exp-003 (DS009: one major dimension at a time).
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
- **T5b — Trainer (4.5.2).** Write `training/python/sft_train.py`: reads the export JSONL and a subset file, applies the tokenizer's official chat template, builds labels with `-100` on every non-assistant token (mask computed by tokenizing the prompt portion separately and by template-token boundaries — the standard `apply_chat_template(..., return_assistant_tokens_mask=True)` path when the template supports it, otherwise the two-pass prefix method), right-pads, trains with `transformers.Trainer` and the recipe of D8, writes checkpoints and a `train-log.jsonl` (step, loss, lr) under `training/checkpoints/<experiment-id>/`, and a `run-manifest.json` with the full DS009 field list. Acceptance: `python training/python/sft_train.py --experiment exp-001-overfit --subset training/overfit/overfit-subset.json --epochs 20 --lr 2e-5` completes.
- **T5c — Mask verification (4.5.3).** Write `training/python/tokenize_inspect.py`: tokenizes the first subset row, prints a two-column artifact (token id, decoded piece, masked or loss-bearing) to `training/checkpoints/exp-001-overfit/mask-inspect.txt`. Acceptance: the artifact shows loss exactly on the assistant tokens including the closing `<|im_end|>` and nowhere else; a human sign-off line is added to the registry note.
- **T5d — Gates (4.5.4).** Gate 1: final train loss below 0.05 with a strongly falling curve. Gate 2: convert the final checkpoint to GGUF, serve it, run the T6 loop over the same 300 training items — at least 95% must reach `answer_match` after memorization. Gate 3: the served prompt rendering provably matches the training rendering (the client builds messages identically; llama-server applies the model's template from the GGUF metadata — verified by decoding one served prompt via the `/tokenize` endpoint or by tokenizing the rendered string with the Python tokenizer and comparing). If loss falls but generations stay prose: inspect the chat template and the D10 wrapper before any hyperparameter change (DS009's stated order). All three gates pass or the milestone stops with a written diagnosis in the registry.

### T6 — Evaluation loop (4.6.1–4.6.3), 4–6 h

Complete `evaluation/run-eval.mjs`: arguments `--experiment <id> --gguf <path> --slice <holdout|validation|file> --port 8080`; for each row: build the prompt with `evaluation/client.mjs`, generate greedily (temperature 0, max 2048 new tokens), classify per D9, execute accepted programs with `runtime/kernel.mjs` (`createRuntime().run(program, { outputs: ['answer'] })`, no inputs, no models — dataset circuits need none), compare the executed answer with the oracle string of `expectedAnswersOf` (exact string match on the answer wire value; the runtime returns JSON-stringified values, the manifest carries the printed answer — normalize with the same rule `verify.mjs` already uses, reuse its comparison helper rather than re-deriving it). Write per-item records first (`items/items-0001.jsonl`: folder, book, class, expected, executed, program path, tokens, latency), then `metrics.json` and `report.md` with the four rates overall and macro by book and plan cluster, plus efficiency columns. Failure isolation: one bad circuit must never abort the batch (the runtime returns structured failures — carry them into the item class). Acceptance: the exp-000 baseline rerun through the final loop produces identical per-item classes; a deliberately corrupted GGUF run lands items in the expected classes; `tests/run-eval.test.mjs` covers the classifier and the comparison helper with fixtures.

### T7 — Checkpoint selection (4.6.4), 2 h

Write `evaluation/select-checkpoint.mjs`: for every checkpoint directory of an experiment, convert to F16 GGUF (scripted), serve, run the loop on the validation slice, tabulate oracle match and parse validity, write `evaluation/registry/<experiment-id>/selection.md` naming the winner. Acceptance: exp-002 produces a selection table over at least five checkpoints and one selected checkpoint.

### T8 — First full run (4.7.1), one afternoon of compute

Run, in order: `exp-002-sft-lr2e-5` (lr 2e-5, 3 epochs, 6436 training rows = 6775 minus the 339 validation rows), `exp-003-sft-lr1e-5` (identical, lr 1e-5), `exp-004-lora` (LoRA per D8). For each: checkpoint selection via T7, then exactly one holdout run of the selected checkpoint with the T6 loop, registry entries complete (run manifest, selection table, holdout report). The report states total target tokens and examples, not only epochs. Acceptance: three registry folders with holdout reports; a summary table `evaluation/registry/phase4-first-series.md` comparing exp-002/003/004 and the exp-000 baseline on the four rates.

### T9 — Failure analysis and the data-iteration decision (4.7.2, 4.2.5), 3–4 h

Over the holdout per-item records of the best experiment: aggregate the failure classes by book and plan cluster; sample and read 20 items of each dominant class; write `evaluation/registry/phase4-analysis.md` answering the DS009 diagnostic questions (syntax high but semantics low ⇒ planning not learned; train high but holdout low ⇒ structural overfit; wrapper_rejected dominant ⇒ template/format problem; knowledge rows fail disproportionately ⇒ knowledge-mode weakness). Attach the verdict for each postponed decision: the DS008 extension for multi-wire, container, and registry-reading example types (with which families produce them and how `verify.mjs` extends), the capability-preservation mixture (currently none — the JS microtask and instruction probes of T4 must be rerun on the trained checkpoint and reported here), the knowledge-category enrichment, and the chat-profile revision. No dataset regeneration happens before this document exists.

### T10 — Export and deployment measurement (4.7.4), 2 h

Quantize the selected checkpoint (`llama-quantize` to Q8_0 and Q4_K_M), rerun the full holdout loop on each quantized artifact, measure tokens/s, time to first token, prompt-processing throughput, peak memory (`/usr/bin/time -v` on llama-server), and whole-task latency on a named thread count. Write `evaluation/registry/<experiment-id>/deployment.md`; accuracy and speed always come from the same artifact.

### T11 — Later series (4.7.3, 4.7.5, 4.7.6)

Second student size (`Qwen2.5-Coder-1.5B-Instruct`, identical recipe and seeds, exp-005+), knowledge enrichment, and the generalization probes (unseen compositions, renamed vocabulary, greater depths — evaluation-only material from generated families) run only after T9 records their justification.

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
- **Unified memory**: the GB10 shares 119 GiB between CPU and GPU; nothing special is needed for these sizes, but keep an eye on `torch.cuda.max_memory_allocated()` in the train log so a configuration mistake surfaces early.
