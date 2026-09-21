# Training session state

Updated 2026-09-21 night (GB10 fine-tuning pipeline). This file is the handoff: it says where the pipeline stopped, what runs next, and how to watch a run. `training/PLAN.md` is the plan of record and carries the measured state table; the numbers here are the short version.

## Where we are

- Seven arms are measured end to end, each with a run manifest, a selection table that splits plan-seen from plan-unseen rows, one holdout run of its winner, and a capability-probe score from the same served artifact. The full table is `evaluation/registry/phase4-first-series.md`; the failure analysis and the decisions are `evaluation/registry/phase4-analysis.md`.
- The headline measurement has not moved: validation oracle 94.4-94.7% on plan-seen rows (317-319 of 323), 12.5-18.8% on the 16 plan-unseen validation rows, and **1 of 265 on the holdout** whose families are absent from every export — 1 of 225 for `exp-002`/`exp-003`, 1 of 265 for `exp-005` (compare-two-groups-by-percentage-not-absolute-count) and for `exp-007` (plant-growth-rate-as-change-per-day). Parse validity 100.0% and graph validity 100.0% from step 180 on in every full-fine-tuning arm.
- The structure run `exp-007-sft-wires` (7335 rows, multi-wire targets with the probe harness on every `jsEval` stage) completed 657 of 657 steps, final loss 0.00115, peak 17.494 GiB, and its winner checkpoint-540 reaches 98.1% plan-seen / 18.8% plan-unseen on validation. Its holdout failure mix moved toward run-time failure: 231 execution errors and 33 answer mismatches against `exp-005`'s 217 and 47.
- The capability probes are the second finding: the untuned base passes 4 of 10, the fine-tuned arms pass 0 or 1 (`exp-003` 1/10, `exp-004` 0/10, `exp-005` 1/10, `exp-007` 0/10), all as `answer_mismatch` with prose answers. The narrow SOP Lang mixture costs the instruction and JavaScript substrate, so preservation data is the next recipe variable (D-B now has its measurement).
- The suite was widened on the night of 2026-09-21: the procedural source declares 21 families, six of them new with two named intermediate stages each (`teacher/procedural/grouping.mjs`, `aggregation.mjs`, `textshapes.mjs`), the deepest taught chain is `slots → stage 1 → stage 2 → answer`, `node training-data/verify.mjs` reports `verify: OK` over the whole tree (840 procedural circuits, all reproduced and all reactive), `npm test` passes 282 of 282, the export holds 7575 rows under the new chat profile `compiled-plan-chat-2`, and the tokenizer gate reports no row above 4096 tokens (worst 2015).
- `exp-008-sft-shapes` trains on that export with the series recipe (3 epochs, lr 1e-4, batch 4 × accumulation 8, gradient checkpointing, checkpoint every 90 steps), started detached at 19:21Z after three memory-guard refusals: another user's benchmark (a 35B Q8 server under `/home/daniel/work/local-llms`) held the shared pool down to 3.1 GiB free at times.
- Guards are in place and were exercised tonight: `training/environment/watchdog.sh` (restarts a trainer whose manifest is not completed and a chain whose wrapper died), `training/environment/exp-008-queue.sh` (starts the next arm only when the export actually changed — the hand queue it replaced would have retrained the identical export), and `training/environment/start-detached.sh`. A real defect was found and fixed on the way: both `start-detached.sh` and `resume-series.sh` wrote a recipe whose relative path resolved to `training/checkpoints/environment/overnight.sh`, so the first `exp-008` launch died at once; the path is now `../../environment/overnight.sh` and both scripts are corrected.

## Resume point

`exp-008-sft-shapes` is training; `evaluation/run-series.sh` waits for it and then converts, serves, selects, and scores without attention, so the morning work starts by reading its registry folder.

```bash
# what is running and how far it has come
bash training/environment/work-status.sh
tail -3 training/checkpoints/exp-008-sft-shapes/train-log.jsonl
tail -20 evaluation/registry/exp-008-sft-shapes/series.log

# when the chain is done: reproduce the analysis numbers and fold them in
node evaluation/analyze-holdout.mjs --experiment exp-008-sft-shapes
```

Order of the next work items:

1. Read `exp-008`'s selection table with the plan-unseen column as the headline, then its holdout and probes; write the row into `evaluation/registry/phase4-first-series.md` and the section into `phase4-analysis.md`. The question this arm answers: does teaching deeper structure (two published stages per plan, twenty plan shapes) move a family the suite never taught?
2. A capability-preservation arm. The probes read 4/10 for the base and 0-1/10 for every fine-tuned arm, so the next series varies the mixture with a recorded size and source, and re-scores the same probe suite on the same served artifact.
3. The container and definition-read shapes (D-G): the four gates are the family validator (`teacher/procedural/index.mjs` accepts only `jsEval`/`literal` intermediate wires), the program builder (`teacher/families/index.mjs`, no container wire path), the provenance battery (`training-data/provenance.mjs` judges reactivity from `slots`/`facts` references only), and the missing manifest column for the structural read set that DS008 requires.
4. Split `evaluation/run-eval.mjs` to the DS001 size rule (848 lines, the only `.mjs` over it) and finish T11's generalization probes.

## Owner directive (2026-09-21)

No larger student: the milestone is decided on `Qwen2.5-Coder-0.5B-Instruct`, and a 1.5B download/training was stopped and its partial weights deleted. The work is to exhaust what the 0.5B can do — data breadth, decomposition supervision, prompt-side capability catalog, and inference-time adaptation from demonstrated plans — before any capacity claim is entertained.

## Current stage (2026-09-21, night)

**Working on: teach structure and widen the plan set.** The student compiles taught shapes at 98% oracle on rows whose plan it saw and cannot compile a family it never saw (1 of 265), so the night's change is in the data and the target shape: six more generator families whose plans publish two named intermediate values each, twenty taught plan shapes in total, and a chat profile whose system prompt names the intermediate-wire shape its targets carry. `exp-008-sft-shapes` measures whether that moves the plan-unseen column and the holdout.

**Measured tonight, on the way:** the untuned base passes 4 of 10 capability probes and the fine-tuned arms pass 0-1, so the substrate loss is reproduced on a full-fine-tuning arm and the mixture is the next variable; the adaptation measurement (0, 1, and 3 solved examples in the prompt) answered 0 of 265 holdout problems in every arm, so demonstrations alone do not move an unseen family.

**Not doing:** a larger student (owner directive above), containers and definition reads until their four gates move together (D-G), and any truncation of an SOP Lang target to fit the sequence length (the gate refuses instead).

## How to watch

- `bash training/environment/start-detached.sh train <experiment> [flags]` — the way every long job is started: `setsid nohup`, its own session, survives the desktop, the SSH session, and any agent session; then `work-status.sh` reports it. The recipe is written into `training/checkpoints/<experiment>/resume-recipe.sh`, which is what `resume-series.sh` and the watchdog replay.
- `bash training/environment/resume-series.sh <experiment>` — restart an interrupted run and its evaluation chain with one command, from the last checkpoint (`--save-steps` interval, 90 steps here).
- `bash training/environment/exp-008-queue.sh` — the shape of every queued arm: wait for the running chain, wait for the export snapshot to change, wait for the GPU to be idle, then start detached. It never launches an arm on an export a previous arm already trained.
- `bash training/environment/watchdog.sh` — every five minutes: resume a trainer that stopped before its manifest completed, restart an evaluation chain whose wrapper died, warn when a running trainer's step log has not moved for thirty minutes. Its log is `training/checkpoints/watchdog.log`.
- `bash training/environment/work-status.sh` — one screen with what is running, how far each training and evaluation has come, the latest scored runs, the device margin, and the guard state.
- `bash training/environment/train-status.sh` — one experiment: status, steps, loss curve, device margin, checkpoints, episodes, whether the process is alive.
- `tail -f training/checkpoints/<experiment>/train-log.jsonl` — per-step records (loss, learning rate, tokens, memory).
- `cat training/checkpoints/<experiment>/overnight-state.jsonl` and `memory-stops.jsonl` — the episode history and every memory-guard stop with its reason.
- `tail -f evaluation/registry/<experiment>/series.log` — checkpoint selection and the holdout run of the winner.
- `evaluation/registry/overnight-supervisor.log` and `evaluation/registry/exp-008-queue.log` — the unattended record of the night: one line per check, every action taken, every refusal and why.

## Machine sharing

The trainer declares `--memory-fraction 0.75` (a ceiling of 89.7 GiB of the 119.6 GiB GB10 pool) against a 16 GiB floor and stops at a step boundary, after writing a checkpoint, when the floor cannot be cleared; the realized peak of a full run is 17.494 GiB, and the trainer runs under `nice -n 10`. Runs are serialized among themselves (a selection server and a trainer on one GPU double both wall times). The pool is shared with other users of this host, and on the night of 2026-09-21 a 35B Q8 benchmark under `/home/daniel/work/local-llms` drove free device memory as low as 3.1 GiB, so `exp-008` needed three start attempts before a window with 52.6 GiB free; the guard's refusals are recorded in `training/checkpoints/exp-008-sft-shapes/memory-stops.jsonl` and the run resumed by itself.

## Morning check (answer without reading logs)

One command answers "is the night still working?":

    bash training/environment/work-status.sh

Read it as follows. RUNNING PROCESSES should list a `training` line for `exp-008-sft-shapes` and a `served model` line while a chain is scoring; TRAINING PROGRESS must show a step count that grows between two runs of the command; EVALUATION CHAINS must show the selection and holdout lines once the chain is running; BACKGROUND GUARDS must show `watchdog running` and no `resume needed` line. A missing trainer line plus a non-completed `run-manifest.json` is the one bad case, and the guard section prints the exact resume command for it:

    bash training/environment/resume-series.sh exp-008-sft-shapes

A run that the memory guard stopped shows `stopped` in its manifest with the reason in `memory-stops.jsonl`; the supervisor restarts it by itself, and `overnight-state.jsonl` records every episode.

## How to restart this session

Start a new agent session in the repository and say:

    Read training/STATE.md and continue from "Resume point".

The agent context files carry the project rules, `training/PLAN.md` carries the plan and the measured state, and the registries under `evaluation/registry/` carry the evidence of every gate so far.
