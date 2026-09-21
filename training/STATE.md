# Training session state

Updated 2026-09-18, evening (GB10 fine-tuning pipeline). This file is the handoff:
it says where the pipeline stopped, what runs next, and how to watch a run.
`training/PLAN.md` is the plan of record; the numbers here are the measured state.

## Where we are

- `exp-002-sft-lr2e-5` (the first full run, T8): **completed, 606 of 606 steps**,
  3 epochs over 6436 rows, final loss **0.0236** (1.254 at step 10), 15,849,528 input
  tokens (11,563,168 target), peak device memory 17.5 GiB. One memory-guard stop
  happened before the reboot (step 451, `checkpoint-451` written) and the resumed
  episode ran clean on the fresh pool. Checkpoints 90 through 540 plus the final
  model are on disk; checkpoint selection (T7) over the six checkpoints is running
  and writes `evaluation/registry/exp-002-sft-lr2e-5/`.
- `exp-003-sft-lr1e-4`: **completed, 606 of 606 steps** (3 epochs over 6436 rows,
  identical recipe, lr 1e-4), final loss **0.00125** — nineteen times lower than
  exp-002 at the same step budget, and 15,818,127 input tokens (11,542,959 target)
  seen, peak 17.5 GiB, about an hour on the fresh pool with no memory stop.
  Checkpoints 90 through 606 are on disk. Its checkpoint selection (7 checkpoints
  on the validation slice) started at 19:50 UTC and the holdout run of the winner
  follows automatically; then the same two steps run for exp-002.
- `exp-000-baseline`: done, registry committed.
- `exp-001-overfit` (lr 2e-5, 20 epochs, 284 rows): completed 180 steps, final loss
  0.179. Served gate run: parse 100%, graph 99.7%, runtime completion 44.3%, oracle
  match 5.0% (15/300). Gates 1 and 2 fail, gate 3 passes.
  Evidence: `evaluation/registry/exp-001-overfit/gates.md`.
- `exp-001-overfit-lr1e-4` (lr 1e-4, 40 epochs planned, same subset, batch 4 x
  accumulation 8, gradient checkpointing): **all three gates pass.** Gate 1: loss
  0.00413 at the early stop (step 100), 0.00032 at step 271 when the memory guard
  stopped the extension with `checkpoint-271` on disk. Gate 2 (the step-271
  checkpoint converted, served and scored on the same 300 items):
  **284/284 = 100.0% `answer_match` on the 284 trained rows** (94.7% over all 300;
  the 16 rows the D11 validation slice excluded stay at 0%, which is the
  memorization signature). Gate 3: served rendering equals the training rendering
  character- and token-for-token on three items. Evidence:
  `evaluation/registry/exp-001-overfit-lr1e-4/gates.md` and the served artifacts
  `training/checkpoints/exp-001-overfit-lr1e-4-step271-f16.gguf`.
- Device pool: the GB10 driver does not return the whole pool across processes, so
  runs are budgeted and stopped at a floor with a checkpoint (see the "Unified
  memory" notes of `training/PLAN.md`). At the end of this session the pool had
  about 17 GiB free; a reboot restores about 113 GiB.

## Resume point

Reboot the machine first: the device pool is exhausted at the driver level (about
11 GiB free against 114 GiB available to the host), and only a reboot restores it
(measured: about 113 GiB free after a fresh boot). Then continue the paused full run
and start the next arm:

```bash
# finish exp-002 (155 steps left, about 16 minutes), then run exp-003
nohup bash -c 'bash training/environment/overnight.sh --experiment exp-002-sft-lr2e-5 \
    --epochs 3 --lr 2e-5 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 90;
  bash training/environment/overnight.sh --experiment exp-003-sft-lr1e-4 \
    --epochs 3 --lr 1e-4 --batch-size 4 --grad-accum 8 --gradient-checkpointing --save-steps 90' \
  >> training/checkpoints/overnight-series.log 2>&1 &
```

The supervisor appends `--resume auto` whenever the experiment directory already has
checkpoints, so the first command continues from `checkpoint-451`.

## Next run (T8, first member)

`exp-002-sft-lr2e-5`: full set (6436 rows), 3 epochs (606 steps at effective batch 32, which the Trainer's own accounting gives: 202 update steps per epoch), lr 2e-5, batch 4 x
accumulation 8, gradient checkpointing, checkpoint every 90 steps. Launch it so it
survives the terminal that starts it:

```bash
nohup bash training/environment/overnight.sh --experiment exp-002-sft-lr2e-5 \
  --epochs 3 --lr 2e-5 --batch-size 4 --grad-accum 8 --gradient-checkpointing \
  --save-steps 90 > training/checkpoints/exp-002-sft-lr2e-5/overnight.log 2>&1 &
```

The supervisor resumes the run automatically after a memory-guard stop, waits two
minutes between episodes, and stops after twenty episodes (see the header of
`training/environment/overnight.sh`). Inside an omp session, start it as a detached
process instead of `nohup`.

After it: checkpoint selection (T7), the holdout run (T6), then the learning-rate
decision for the rest of the series — the measured evidence is that lr 2e-5
under-trains (loss plateaus at 0.18) while lr 1e-4 memorizes, so the plan's
`exp-003` at lr 1e-5 is in question.

## How to watch

- `bash training/environment/train-status.sh` — one screen: status, steps, loss
  curve, device margin, checkpoints, episodes, whether the process is alive.
- `tail -f training/checkpoints/<experiment>/train-log.jsonl` — per-step records
  (loss, learning rate, tokens, memory).
- `cat training/checkpoints/<experiment>/overnight-state.jsonl` — the episode
  history written by the supervisor.
- `cat training/checkpoints/<experiment>/memory-stops.jsonl` — when and why the
  memory guard stopped a run.
- `tail -f evaluation/registry/<experiment>/series.log` — the evaluation chain:
  checkpoint selection (T7) and the holdout run (T6) of the winner, serialized
  after each trainer finishes.

## How to restart this session

Start a new agent session in the repository and say:

    Read training/STATE.md and continue from "Resume point".

The agent context files carry the project rules, `training/PLAN.md` carries the plan
and the measured memory envelope, and the registries under `evaluation/registry/`
carry the evidence of every gate so far.
