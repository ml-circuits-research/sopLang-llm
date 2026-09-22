# Training session state

Updated 2026-09-22 morning (GB10 fine-tuning pipeline). This file is the handoff: it says where the pipeline stopped, what runs next, and how to watch a run. `training/PLAN.md` is the plan of record and carries the measured state table; `evaluation/registry/phase4-analysis.md` carries the failure analysis and the decisions; this file is the short version, and every number in it was re-read from the raw per-item records.

## Where we are

Nine arms are measured end to end, each with a run manifest, a selection table that splits plan-seen from plan-unseen rows, one holdout run of its winner, and a capability-probe score from the same served artifact. All holdout numbers below are counts of `"class":"answer_match"` in `evaluation/registry/<experiment>/items/holdout.jsonl`.

| arm | suite | validation winner | plan-seen | plan-unseen | holdout (correct / items) | holdout completion | probes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exp-000-baseline` | untuned base | — | — | — | 0 / 50 | 0.0% | 4/10 |
| `exp-001-overfit` | 284-row subset | — | — | — | 0 / 300 gate items | — | — |
| `exp-001-overfit-lr1e-4` | 284-row subset | — | — | — | 284 / 284 trained rows | 96.3% | — |
| `exp-002-sft-lr2e-5` | books | 53.7% | 56.0% | 6.3% | **0 / 225** | 12.4% | — |
| `exp-003-sft-lr1e-4` | books | 94.7% | 98.8% | 12.5% | **0 / 225** | 27.6% | 1/10 |
| `exp-004-lora` | books | 52.5% | 54.2% | 18.8% | 0 / 265 | 12.5% | 0/10 |
| `exp-005-sft-widened` | + ten synthetic families | 94.4% | 98.5% | 12.5% | 1 / 265 | 18.1% | 1/10 |
| `exp-007-sft-wires` | + multi-wire targets | 94.4% | 98.1% | 18.8% | 1 / 265 | 12.8% | 0/10 |
| `exp-008-sft-shapes` | + twenty taught plan shapes | 95.0% | 98.8% | 18.8% | 1 / 265 | 30.9% | 2/10 |
| `exp-009-mix10` | + 721 preservation rows (ratio 0.1) | **95.3%** | 98.8% | **25.0%** | **0 / 265** | 19.2% | 1/10 |

The two verdicts that matter, both written in `evaluation/registry/phase4-analysis.md`:

- **D-J (structure):** teaching deeper structure buys *executable* programs on unseen families (holdout completion 12.8% for `exp-007` to 30.9% for `exp-008`) and does not buy correct answers (1 of 265 in every widened arm, 0 for the newest two). Failures moved from programs that break to programs that answer the wrong question.
- **D-K (preservation mixture):** the derived mixture did not restore the probe substrate (`exp-008` 2/10, `exp-009` 1/10), the comparison carries a 747-versus-681 step confound, and six of the ten probes measure short answers the preservation targets never taught — three of six JavaScript probes state the correct value and are still scored strictly wrong. The next mixture arm changes the mixture *shape* and matches the training budget.

## Resume point

Nothing is training. The GPU is idle and the machine is safe to use. Two queues are armed and detached: `exp-008-queue.sh` waits for a *new* export before starting another arm, and `exp-009-queue.sh` is spent (its arm completed).

## Night supervision (2026-09-22, ~21:00Z)

Disk cleanup done before the night: the intermediate `checkpoint-*` directories of the ten finished experiments
were pruned (the winner GGUF of each remains under `evaluation/registry/<experiment>/gguf/`, and every log,
manifest, recipe and analysis stays), freeing 256G: the disk went from 38G free to 288G free. The night run
needs roughly 40G (ten 2.8G checkpoints plus the selection conversions), so the run cannot fail on space, and a
disk guard prunes exp-011's oldest checkpoint only if free space ever collapses below 15G.

What is watching the night:

- the trainer itself (detached, setsid nohup via `start-detached.sh`);
- the watchdog, which resumes the trainer or the chain if either dies;
- the chain watcher that reports the selection, holdout, and probes when the series ends;
- this session lives in tmux `sup`, so it survives the owner's detach.

## `exp-011-compositions` closed (2026-09-22 20:39Z) — see `evaluation/registry/phase4-analysis.md`

The night run finished and the result is the first clean positive of the series, with its limit measured in the
same run. Winner `checkpoint-630`: selection oracle 94.7%, plan-seen 98.5%, plan-unseen 18.8%. Holdout
headline 37.9%, decomposed honestly: the four reserved compositions answer **160 of 160 (100.0%)**, the old
procedural eval family 0 of 40, the book-derived holdout 1 of 225 (0.4%). The thesis (a declared inventory
teaches operator composition) is proven; the limit (it transfers only within the shared operator vocabulary)
is measured. The next arm widens the operator vocabulary toward the book families' operations, and the I5
retrieval baseline should run first as the control. Nothing is running now; guards may be stopped.

## Running now: `exp-011-compositions` (started 2026-09-22 ~20:00Z)

The arm the plan-inventory finding called for. Restarted from zero on 2026-09-22 ~20:40Z after the probe helper also left the targets (jsEval 2.1.0 provides it in the sandbox; profile compiled-plan-chat-4; 0 of 8735 targets carry the helper line). `teacher/procedural/compositions.mjs` declares 22 operator
compositions (18 trained, 4 reserved whole for evaluation: `below-largest-add-rate`, `above-count-double`,
`below-total-per-unit-subtract-rate`, `above-largest-add-rate`), and `teacher/procedural/composition-families.mjs`
derives one family per composition from its chain, so the statement, the oracle, and the circuit are three
readings of one chain. The run uses exp-009/exp-010's exact recipe (3 epochs, lr 1e-4, batch 4, grad-accum 8,
gradient checkpointing, save-steps 90, preservation-10), so the arm changes the plan coverage and nothing else.
Watch with `bash training/environment/work-status.sh`; its chain writes
`evaluation/registry/exp-011-compositions/{selection.md,report.md,probes.md}`.

What it measures: every held-out row is a composition the trainer never saw at any depth, because
`selectEvalSplit` now honours the declared reservation (previously the hash-only walk silently put reserved
compositions in training; that defect was found and fixed before this run). The number to compare against is
exp-010's 0.4% holdout (1 of 265) and its plan-unseen plateau of 12.5–25.0%.

## The target lost its scaffolding (2026-09-22 18:00Z)

The fixed probe preamble left the trained target. Measured cost before the change: 18.96% of the target
tokens (875,160 of 4,616,945), identical in all 8415 `jsEval` stages. The three generic clauses are now the
input and output contract of the `jsEval` command (version 2.0.0): a dependency is defined, a compiled
`slots` record is a non-empty object, and the result is not `null`, `undefined`, or the empty string, each a
structured `execution_error` naming the wire and the clause. A body that staged a structural transaction is
exempt, because `circuit.commit` publishes through the transaction and returns nothing by design. Domain
assertions a family writes about its own values stay, and the loader no longer requires any.

Targets: 18,010,872 characters to 14,622,102, a reduction of 3,388,770 (-18.8%). Chat profile
`compiled-plan-chat-2` becomes `compiled-plan-chat-3`, whose system prompt asks for the computation and states
that the runtime asserts the generic contract. `verify: OK` over 8,540 circuits, 317 of 317 tests.

Five self-referential families were added to `teacher/procedural/text.mjs` for the shapes a language model
fails by recall rather than by reading: count the letter the word itself names, the length of a word, its
first and last letter, its distinct-letter count, and which of two words is longer. The famous pair
`raspberry`/`strawberry` is evaluation-only (`EVAL_ONLY_WORDS`, 0 of 8015 training rows), and the training
vocabulary is over a hundred other words, so a checkpoint that memorized the demo words cannot pass as one
that counts.

Two defects were found and fixed on the way: the provenance probe could not change what a string contains
(appending a character is absorbed by a character-set computation, and substituting one rare letter for
another leaves a distinct count unchanged), so a correct distinct-letters circuit was reported as a stored
answer; and the shared word list leaked the demo pair into training rows.

## Running now: `exp-010-contrastive` (started 2026-09-22 14:35Z)

The first arm built on the diagnosis. `teacher/procedural/contrastive.mjs` adds six families in three contrastive pairs to the procedural source, and the export grew from 7575 to 7815 rows (`procedural-arithmetic` 800 to 1040); the run uses exp-009's exact recipe (3 epochs, lr 1e-4, batch 4, grad-accum 8, gradient checkpointing, save-steps 90, preservation-10 extra data), so the arm changes the data and nothing else. Watch it with `bash training/environment/work-status.sh`, live log at `training/checkpoints/exp-010-contrastive/overnight.log`, and its chain writes `evaluation/registry/exp-010-contrastive/{selection.md,report.md,probes.md}`. The guards are running again beside it.

What the arm is for: the pairs make the nearest-memorized-family shortcut observably wrong, since the two members of a pair share their wording, numbers and entities and differ only where the decisive phrase changes the required operation. The measurement that matters is paired accuracy — the number of pairs whose two answers are both correct — not single-answer accuracy alone. Compare against `exp-009-mix10`: 8 of 60 on the diagnostic's normal condition (13.3%), holdout and probes in `evaluation/registry/exp-009-mix10/`.

## The diagnosis is done (`diag-009`, 2026-09-22 08:07Z)

The four-condition diagnostic ran on `exp-009-mix10`'s winner `checkpoint-728`: **normal 8 of 60 (13.3%)**, values supplied 9 of 60, plan supplied 8 of 60, both 10 of 60, all with 100% parse validity. Read it in `evaluation/registry/diag-009/report.md`, `items/diagnostic.jsonl`, and the analysis section **D-L**.

The finding: supplying the correct values or the correct operator graph buys almost nothing, so reading the statement, choosing operators, and writing JavaScript are **not** the bottleneck. All 60 programs carry the same shape (slots, an intermediate wire named `kept`, answer), and on `filter-total-001` the answer states the correct kept-total followed by the copied return statement of the `Filtered Total` training family, with a dangling `and` where the fixed charge belonged. The model completes a memorized family instead of applying the operation the statement asks for. Held-out structures score 0 of 10 each; the structure whose output shape the suite already teaches reaches 7 of 10.

Order of the next work items, from the reviewed plan (`astra_review.md`) and the analysis:

1. ~~A diagnostic suite before more training.~~ **Done** (`diag-009`, above): the failing stage is identified, and it is neither extraction nor operator choice nor code emission.
2. **Supervision that makes the operation come from the statement** (astra_review I3, justified by D-L with counts): contrastive pairs inside one structure — the same statement with one decisive word changed and its two different programs — plus training rows whose wording varies while the structure is held fixed, so the phrasing of the taught return statements stops acting as the plan selector. The sealed final suite and the structural splits of I2 stay a prerequisite of any headline claim.
3. **Compare the paths once the diagnosis exists**: standalone JavaScript emission on the same suite, a compact-target variant with the assertions kept, statement-only retrieval instead of fixed demonstrations, or a two-call compile — one main factor at a time with a matched control.
4. **Later milestones, explicitly deferred:** containers and definition reads (the four gates named in D-G), the compiled-context document task, repair trajectories.

## What changed in this session (2026-09-21 night to 2026-09-22 morning)

- **Data:** the procedural source grew to 21 families (six new ones with two published stages each), the suite verifies at 840 procedural circuits, the export holds 7575 rows under chat profile `compiled-plan-chat-2`, and the token gate passes.
- **A capability-preservation view** (`training/preservation.mjs`): every tenth statement repeated with the standalone JavaScript that prints the same answer, derived by a real transformation of each circuit, checked at export time and by a test that executes both sides and requires identical answers.
- **Review remediation R1-R6 and R9** from `astra_review.md`, all with the reviewer's acceptance tests: demonstrations no longer read the evaluated item's reference solution (verified by corrupting all 265 holdout solutions and requiring byte-identical prompts), every managed server serves a unique per-artifact alias that readiness requires and every runner generates against it, the chat CLI works again, the holdout holds the experiment lock and duplicates are refused, the trainer refuses a resume whose inputs changed, and probe records separate strict protocol compliance from semantic correctness while the compiled comparator rejects an echoed operand or a wrong result.
- **Six infrastructure defects found and fixed**, each with the failure it caused recorded: a wrong recipe path, duplicate evaluation chains, a lost `--out` default, an undefined name in the mixture support, a stale lock that blocked restarts, and the most serious one — readiness that accepted *any* server on the port, which had scored eight checkpoints of one selection with a single model. That invalid evidence was deleted and rebuilt.

## How to watch

- `bash training/environment/work-status.sh` — one screen: what runs, how far each experiment came, the latest scored runs, device memory, and the guard state.
- `evaluation/registry/overnight-supervisor.log` — the unattended record of the night, one line per check, including every defect and correction.
- `tail -f evaluation/registry/<experiment>/series.log` — a live chain's selection and holdout steps.
- `bash evaluation/start-chain.sh <experiment>` — the only supported way to start an evaluation chain; it takes the experiment lock, refuses a duplicate, and resumes at the holdout when a selection already exists.
- `bash training/environment/watchdog.sh` — every five minutes: restarts a trainer that stopped before its manifest completed, restarts a chain that left no report, warns on a stalled step log (`training/checkpoints/watchdog.log`).
- `node evaluation/chat.mjs --once "..."` — ask the student a question; the printed answer comes from executing the circuit it compiles.

The two background guards are **stopped** (2026-09-22 08:16Z, at the owner's request to reduce load while nothing was queued). Start them again only when a run is queued:

    bash training/environment/start-detached.sh cmd watchdog "bash training/environment/watchdog.sh"
    bash training/environment/start-detached.sh cmd night-watch "bash training/environment/night-watch.sh"

Long jobs are started only detached: `bash training/environment/start-detached.sh train <experiment> [flags]` (owner directive), which records the recipe so a resume needs no flags.

## Owner directives

No larger student: the milestone is decided on `Qwen2.5-Coder-0.5B-Instruct` (2026-09-21). Everything long-running is started detached (2026-09-21). Report concretely: name the run, the artifact, and the counts (2026-09-21).

## How to restart this session

Start an agent session in the repository and say:

    Read training/STATE.md and continue from "Resume point".

The repository rules live in `AGENTS.md`, the plan of record in `training/PLAN.md`, the measured analysis in `evaluation/registry/phase4-analysis.md`, and the external review with its experiment designs in `astra_review.md`.
