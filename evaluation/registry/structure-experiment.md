# Structure experiment: does modularizing the training targets help the student?

Recorded 2026-09-25, before the refactor. The question for the article: keeping the model, the data
content, the statements, the oracles, and the printed answers identical - only the STRUCTURE of the
training targets differs (monolithic hand-written jsEval bodies against modular multi-wire plans) -
does the student's measured quality change?

## Why the bloated bodies were never split

The series prioritized, in order: coverage (the operator vocabulary), the declarative wires
(graphPath/aggregate/fraction), and the container shapes. The book families' 40-67-line compute
bodies are case-based with book-fixed printed answers, and restructuring them safely required the
container gates and the declarative commands that did not exist until dv7. The assertion audits
cleaned the probes without touching structure; the structure was deliberately deferred, not missed.

## The indicator

The static checker reports the bloat indicator on the shipped suite: total wires, average wires per
plan, average jsEval lines per plan, jsEval lines per wire, and the count of plans with at most
three wires but more than 25 jsEval lines. On dv7: 2.19 wires per plan against 15.4 jsEval lines
(7.0 lines per wire), with 1,468 plans (13.8%) in the bloat class. The experiment moves that
indicator and measures whether the holdout follows.

## Design

- Baseline: exp-021-1.7b-qwen3-dv7 (Qwen3-1.7B, dv7, the current data) - the monolithic-structure
  arm whose holdout is measured.
- Arm: dv8 - the same dataset content, but the book families' flagged compute bodies are refactored
  into modular multi-wire plans (jsEval stages plus the declarative commands and containers where
  they genuinely fit). Statements, oracles, printed answers, and the dataset row counts stay
  identical; only the emitted circuit structure changes. The verify gate proves the invariant:
  every refactored circuit must reproduce its printed answer and react to its inputs.
- exp-022-1.7b-qwen3-dv8: the same base (Qwen3-1.7B) and the same recipe (2 epochs, lr 1e-4,
  batch 4 / grad-accum 8, gradient checkpointing, preservation-10, save-steps 150, patience 5).
  The only variable against exp-021 is the target structure.
- Decision: the holdout oracle match and the procedural execution errors of exp-022 against
  exp-021, plus the bloat indicator before and after. A measured delta is the article's indicator
  that modular training targets help; no delta is a measured null, also publishable.

## Status

- dv7 baseline: exp-021 training (measured at its holdout).
- dv8 refactor: queued after exp-021's chain closes.
- exp-022: queued after the dv8 rebuild and verification.


## VERDICT — measured 2026-09-25

dv7 monolithic (exp-021): 460/705 (65.2%), books 22/225, exec_errors 57, runtime completion 91.9%.
dv8 modular (exp-022): 448/705 (63.5%), books 20/225, exec_errors 135, runtime completion 80.9%.

Same base (qwen3-1.7b), same recipe, only the training-target structure differs. The modular arm
moves the bloat indicator (2.81 wires/plan, 5.5 jsEval lines/wire vs 2.19 / 7.0) and parse/graph
validity stay 100%, but the model loses 12 answers and execution errors double: more wires widen
the execution-failure surface. The measured sweet spot is the compact plan (2-3 wires, few lines),
which is exactly the container-family style that lifted world-as-a-system to 20/20 under dv7.
Conclusion for the article: structure is real but gratuitous splitting costs; new families are
written compact (small stages, few wires), never over-split.


## THIRD ARM — dv9 zero-book tranche, measured 2026-09-26

dv9 (exp-023): the two still-zero books' compute moved to the compact container idiom (build-in-stages,
whole-positive gates). Holdout 428/705 (60.7%): common-sense 0/50 and decompose-to-solve 0/100 stay zero,
and the perturbation costs 28 procedural answers (438 -> 410) and 4 world answers (20 -> 16).

The three measured arms: dv7 460 (65.2%) > dv8 448 (63.5%) > dv9 428 (60.7%). The zero books have not
moved under any target structure — the container idiom does not transfer to the dependency-chain and
units-and-rates shapes. The canonical generator is reverted to the dv7 bodies (VERSION 10); the next
arm needs a different hypothesis for these two books (a dedicated chain/rate wire command or statement
simplification), not another restructure of the existing bodies.
