# Training session state

Updated 2026-09-21 (GB10 fine-tuning pipeline). This file is the handoff: it says where the pipeline stopped, what runs next, and how to watch a run. `training/PLAN.md` is the plan of record and carries the measured state table; the numbers here are the short version.

## Where we are

- The first supervised series has produced its full-fine-tuning verdict. `exp-002-sft-lr2e-5` and `exp-003-sft-lr1e-4` each completed 606 of 606 steps (3 epochs over 6436 rows), with checkpoint selection and one holdout run in `evaluation/registry/<experiment>/`.
- The headline measurement: validation oracle match 53.7% (lr 2e-5) and 94.7% (lr 1e-4), holdout oracle match **0.0%** for both, with 100% parse validity and 100% graph validity in the lr 1e-4 run. The validation slice is mostly plan-reused, so the honest ladder is 98.8% on rows whose plan the trainer saw (319/323), 12.5% on rows whose plan occurs nowhere else (2/16), and 0/225 on the holdout families, which are absent from the export entirely.
- `evaluation/registry/phase4-analysis.md` is the T9 failure analysis: 80 of 225 holdout programs splice two memorized bodies and do not compile, 77 compile wrong inputs and trip the dataset's own probes, 62 execute and answer a different question, 0 match. It records the DS009 verdicts and the decisions: widen the training plan set before any further recipe or student-size arm (D-A), keep the capability-preservation mixture at `none` until the probes are scored on a fresh checkpoint (D-B), defer the 1.5B student to the widened suite (D-C), and run `exp-004-lora` as the last recipe arm (D-D).
- `evaluation/registry/phase4-first-series.md` compares every completed arm, the baseline included. `evaluation/analyze-holdout.mjs` reproduces every number in the analysis from the per-item records.
- `exp-004-lora` (LoRA r16 alpha32, lr 1e-4, same 606-step recipe, launched under `nice -n 10`) is training; `evaluation/run-series.sh` is waiting for it and then converts, serves, selects, and scores automatically.
- Documentation is current: `README.md`, `docs/index.html`, `docs/fine-tuning.html`, and `DS009` carry the first-series results and the new rule that the selection table reports plan-seen and plan-unseen rows separately.
- The tree is committed; `npm test` (266 tests) and `node training-data/verify.mjs` are green at this state.

## Resume point

`exp-005-sft-widened` is queued: it waits for the deployment measurement of `exp-003` (Q8_0 and Q4_K_M artifacts) to free the GPU, then trains the same recipe as `exp-003` (full fine-tuning, lr 1e-4, 3 epochs, batch 4 x accumulation 8, gradient checkpointing, checkpoint every 90 steps) on the WIDENED export (7135 rows: the seven books plus the synthetic source with ten families and nine training plan shapes), and runs its selection and holdout automatically. The tokenizer gate was refreshed on that export: no row exceeds the 4096-token sequence length (`training/data/token-stats.json`).

The earlier state, for reference: nothing else to restart: the machine is idle apart from the running `exp-004-lora` trainer and its waiting evaluation chain. Check them, then start the next work item.

```bash
# what is running and how far it has come
bash training/environment/train-status.sh
tail -3 training/checkpoints/exp-004-lora/train-log.jsonl
tail -20 evaluation/registry/exp-004-lora/series.log

# when the run is done: update the first-series table with its row
node evaluation/analyze-holdout.mjs --experiment exp-004-lora
```

Order of the next work items (from the analysis decisions):

1. Score the capability probes (and direct-answer mode) on the `exp-004-lora` winner and record the preservation verdict (D-B) — `evaluation/run-holdout.sh` now passes `--probes`, so this happens with the holdout run itself. The deployment measurement (T10) is queued behind the series: `node evaluation/run-deployment.mjs --experiment exp-003-sft-lr1e-4` quantizes the winning checkpoint to Q8_0/Q4_K_M and scores each artifact's accuracy, throughput, and peak memory in one session.
2. Implement the data revision that `docs/specs/DS008-training-data.md` now specifies: register the first procedural source (a generator family with several plan shapes and a constructed oracle), extend `training-data/verify.mjs` to the extended plan fingerprint and the new circuit shapes, compile a small suite, re-export.
3. Retrain on the widened suite and read the plan-unseen column of the selection table as the headline metric; only after that does the 1.5B student (D-C) or a further mixture arm become informative.

## Owner directive (2026-09-21)

No larger student: the milestone is decided on `Qwen2.5-Coder-0.5B-Instruct`, and a 1.5B download/training was stopped and its partial weights deleted. The work is to exhaust what the 0.5B can do — data breadth, decomposition supervision, prompt-side capability catalog, and inference-time adaptation from demonstrated plans — before any capacity claim is entertained.

## Current stage (2026-09-21, evening)

**Working on: can the 0.5B compile with context?** `evaluation/run-adaptation.mjs` measures the same holdout statements with 0, 1, and 3 compiled examples placed in the prompt (demonstrations drawn from the training rows, never from the target book). Runs `adapt-holdout-{0,1,3}` are executing; the smoke over twelve items with three demonstrations showed 0 matches and 83.3% execution errors, so an early read is that demonstrations alone have not yet moved the unseen-family result. Estimate for this stage: about one hour of unattended GPU time.

**Next stage: teach structure, not just answers (estimated 4 hours).** The student compiles taught shapes at 95.7% oracle on its own training rows and cannot compile an unseen family (0.4% on the holdout), so the next change is in the data and the target shape, not the model: (1) implement multi-wire targets in the pipeline (`buildProgram`, the writer, and `verify.mjs` accept intermediate wires with the probe harness on every `jsEval` stage, per `DS008-training-data.md` "Additional circuit shapes"); (2) author families whose plans decompose (filter, group, aggregate as named stages) plus more arithmetic and text shapes; (3) retrain the same 0.5B with the same recipe on the widened suite; (4) score the same instruments (selection plan-unseen, holdout, text probes direct and compiled). Split of the estimate: 1.5 h implementation and data, 1.5 h training, 1 h evaluation.

**Not doing:** a larger student. The owner directive stands: the milestone is answered on `Qwen2.5-Coder-0.5B-Instruct`, and a bigger model is a decision the owner takes only if the evidence demands it.

## How to watch

- `bash training/environment/start-detached.sh train <experiment> [flags]` — the way every long job is started now: `setsid nohup`, own session, survives the desktop, the SSH session, and any agent session; then `work-status.sh` reports it. Owner directive (2026-09-21): always detached.

- `bash training/environment/resume-series.sh <experiment>` — restart an interrupted run and its evaluation chain with one command. The supervisor resumes from the last checkpoint (`--save-steps` interval, 90 steps here), so an interruption costs at most that much compute; the recipe is read from `training/checkpoints/<experiment>/resume-recipe.sh`, written on first use or recorded by hand.
- Long runs are started **detached** from this session (`hub start ... detached: true`): they survive the SSH session ending and the harness broker shutting down. A run started only `persist` (the earlier default here) dies with the broker, i.e. with the session — the training of `exp-007-sft-wires` was moved to detached for that reason at 2026-09-21 17:0x UTC.

- `bash training/environment/work-status.sh` — one screen with what is running right now, how far each training and evaluation has come, the latest scored runs, and the device margin. This is the command to run when it is unclear whether work is in flight.

- `bash training/environment/train-status.sh` — one screen: status, steps, loss curve, device margin, checkpoints, episodes, whether the process is alive.
- `tail -f training/checkpoints/<experiment>/train-log.jsonl` — per-step records (loss, learning rate, tokens, memory).
- `cat training/checkpoints/<experiment>/overnight-state.jsonl` — the episode history written by the supervisor.
- `cat training/checkpoints/<experiment>/memory-stops.jsonl` — when and why the memory guard stopped a run.
- `tail -f evaluation/registry/<experiment>/series.log` — checkpoint selection and the holdout run of the winner.

## Machine sharing

The trainer budget keeps the workstation usable for other work: `--memory-fraction 0.75` caps the process allocator at 89.7 GiB of the 119.6 GiB unified pool against a 16 GiB floor, the realized peak of a full run is 17.5 GiB (14.3 GiB so far for LoRA), the guard stops at a step boundary with a checkpoint instead of letting the kernel OOM killer shoot host services, runs are serialized because a selection server and a trainer on one GPU double both wall times, and the trainer runs at `nice -n 10`.

## How to restart this session

Start a new agent session in the repository and say:

    Read training/STATE.md and continue from "Resume point".

The agent context files carry the project rules, `training/PLAN.md` carries the plan and the measured state, and the registries under `evaluation/registry/` carry the evidence of every gate so far.
