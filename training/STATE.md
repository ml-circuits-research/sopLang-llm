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

Nothing to restart: the machine is idle apart from the running `exp-004-lora` trainer and its waiting evaluation chain. Check them, then start the next work item.

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

## How to watch

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
